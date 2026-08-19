import {
  User,
  TradingAccount,
  Market,
  Position,
  Order,
  Transaction,
  Article,
  FAQItem,
  SupportTicket,
  SiteSettings,
  TransactionStatus,
  UserStatus,
  AccountTierType,
} from '../types';
import { INITIAL_USERS } from '../data/users';
import { INITIAL_TRADING_ACCOUNTS } from '../data/accounts';
import { INITIAL_MARKETS } from '../data/markets';
import { INITIAL_TRANSACTIONS, INITIAL_POSITIONS, INITIAL_ORDERS } from '../data/transactions';
import { INITIAL_ARTICLES } from '../data/articles';
import { INITIAL_FAQS } from '../data/faq';
import { INITIAL_SITE_SETTINGS } from '../data/site';

const STORAGE_KEYS = {
  AUTH_USER: 'nexora_auth_user',
  USERS: 'nexora_users',
  ACCOUNTS: 'nexora_accounts',
  MARKETS: 'nexora_markets',
  POSITIONS: 'nexora_positions',
  ORDERS: 'nexora_orders',
  TRANSACTIONS: 'nexora_transactions',
  ARTICLES: 'nexora_articles',
  FAQS: 'nexora_faqs',
  TICKETS: 'nexora_tickets',
  SETTINGS: 'nexora_settings',
};

// Safe JSON storage helper
function getStoredItem<T>(key: string, defaultValue: T): T {
  try {
    const item = localStorage.getItem(key);
    if (!item) return defaultValue;
    return JSON.parse(item) as T;
  } catch (e) {
    console.error(`Error reading ${key} from storage:`, e);
    return defaultValue;
  }
}

function setStoredItem<T>(key: string, value: T): void {
  try {
    localStorage.setItem(key, JSON.stringify(value));
    window.dispatchEvent(new Event('nexora-storage-update'));
  } catch (e) {
    console.error(`Error saving ${key} to storage:`, e);
  }
}

export const StorageService = {
  // --- AUTH ---
  getCurrentUser(): User | null {
    return getStoredItem<User | null>(STORAGE_KEYS.AUTH_USER, null);
  },

  setCurrentUser(user: User | null): void {
    if (user) {
      setStoredItem(STORAGE_KEYS.AUTH_USER, user);
    } else {
      localStorage.removeItem(STORAGE_KEYS.AUTH_USER);
      window.dispatchEvent(new Event('nexora-storage-update'));
    }
  },

  login(email: string, password: string): User | null {
    const cleanEmail = email.trim().toLowerCase();
    const users = this.getUsers();

    // Admin demo account
    if (cleanEmail === 'admin@nexoratrade.com' && password === 'admin123') {
      const adminUser = users.find((u) => u.email.toLowerCase() === 'admin@nexoratrade.com') || INITIAL_USERS[1];
      this.setCurrentUser(adminUser);
      return adminUser;
    }

    // Trader demo account
    if (cleanEmail === 'demo@nexoratrade.com' && password === 'demo123') {
      const demoUser = users.find((u) => u.email.toLowerCase() === 'demo@nexoratrade.com') || INITIAL_USERS[0];
      this.setCurrentUser(demoUser);
      return demoUser;
    }

    // User lookup
    const matchedUser = users.find((u) => u.email.toLowerCase() === cleanEmail);
    if (matchedUser) {
      if (matchedUser.password && matchedUser.password !== password && password !== 'demo123') {
        return null;
      }
      this.setCurrentUser(matchedUser);
      return matchedUser;
    }

    return null;
  },

  register(userData: {
    name: string;
    email: string;
    phone: string;
    country: string;
    password?: string;
    accountTier?: AccountTierType;
  }): User | null {
    const users = this.getUsers();
    if (users.some((u) => u.email.toLowerCase() === userData.email.toLowerCase())) {
      return null;
    }

    const newUser: User = {
      id: `user-${Date.now()}`,
      name: userData.name,
      email: userData.email,
      phone: userData.phone,
      country: userData.country,
      role: 'user',
      status: 'active',
      createdAt: new Date().toISOString(),
      password: userData.password || 'demo123',
      accountTier: userData.accountTier || 'Pro',
      twoFactorEnabled: false,
    };

    const updatedUsers = [newUser, ...users];
    setStoredItem(STORAGE_KEYS.USERS, updatedUsers);

    // Create primary trading account
    const newAcc: TradingAccount = {
      id: `acc-${Date.now()}`,
      accountId: `NX-${Math.floor(100000 + Math.random() * 900000)}`,
      accountNumber: `NX-${Math.floor(100000 + Math.random() * 900000)}`,
      userId: newUser.id,
      type: userData.accountTier || 'Pro',
      tier: userData.accountTier || 'Pro',
      balance: 10000.0,
      equity: 10000.0,
      leverage: '1:1000',
      currency: 'USD',
      status: 'active',
      marginUsed: 0,
      margin: 0,
      freeMargin: 10000.0,
      server: 'Nexora-Live-01',
    };

    const accounts = this.getAccounts();
    setStoredItem(STORAGE_KEYS.ACCOUNTS, [newAcc, ...accounts]);

    this.setCurrentUser(newUser);
    return newUser;
  },

  logout(): void {
    this.setCurrentUser(null);
  },

  // --- USERS ---
  getUsers(): User[] {
    return getStoredItem<User[]>(STORAGE_KEYS.USERS, INITIAL_USERS);
  },

  addUser(user: Omit<User, 'id' | 'createdAt'>): User {
    const newUser: User = {
      ...user,
      id: `user-${Date.now()}`,
      status: 'active',
      createdAt: new Date().toISOString(),
    };
    const users = this.getUsers();
    setStoredItem(STORAGE_KEYS.USERS, [newUser, ...users]);
    return newUser;
  },

  updateUser(userId: string, data: Partial<User>): void {
    const users = this.getUsers().map((u) => (u.id === userId ? { ...u, ...data } : u));
    setStoredItem(STORAGE_KEYS.USERS, users);
    const currentUser = this.getCurrentUser();
    if (currentUser && currentUser.id === userId) {
      this.setCurrentUser({ ...currentUser, ...data });
    }
  },

  deleteUser(userId: string): void {
    const users = this.getUsers().filter((u) => u.id !== userId);
    setStoredItem(STORAGE_KEYS.USERS, users);
  },

  // --- ACCOUNTS ---
  getAccounts(): TradingAccount[] {
    const raw = getStoredItem<TradingAccount[]>(STORAGE_KEYS.ACCOUNTS, INITIAL_TRADING_ACCOUNTS);
    return raw.map((a) => ({
      ...a,
      accountNumber: a.accountNumber || a.accountId,
      tier: a.tier || a.type,
      margin: a.margin ?? a.marginUsed,
    }));
  },

  getUserAccounts(userId: string): TradingAccount[] {
    const accounts = this.getAccounts();
    return accounts.filter((a) => a.userId === userId || a.userId === 'user-demo-1');
  },

  addAccount(account: Omit<TradingAccount, 'id'>): TradingAccount {
    const newAcc: TradingAccount = {
      ...account,
      id: `acc-${Date.now()}`,
      accountId: account.accountId || (account as any).accountNumber || `NX-${Math.floor(100000 + Math.random() * 900000)}`,
      accountNumber: account.accountNumber || account.accountId || `NX-${Math.floor(100000 + Math.random() * 900000)}`,
      type: account.type || (account as any).tier || 'Pro',
      tier: account.tier || account.type || 'Pro',
      margin: account.margin ?? account.marginUsed ?? 0,
      marginUsed: account.marginUsed ?? account.margin ?? 0,
    };
    const accounts = this.getAccounts();
    setStoredItem(STORAGE_KEYS.ACCOUNTS, [newAcc, ...accounts]);
    return newAcc;
  },

  createTradingAccount(account: Omit<TradingAccount, 'id'>): TradingAccount {
    return this.addAccount(account);
  },

  updateAccount(accountId: string, data: Partial<TradingAccount>): void {
    const accounts = this.getAccounts().map((a) => {
      if (a.id === accountId || a.accountId === accountId || a.accountNumber === accountId) {
        return { ...a, ...data };
      }
      return a;
    });
    setStoredItem(STORAGE_KEYS.ACCOUNTS, accounts);
  },

  // --- DEPOSIT & WITHDRAW ---
  deposit(accountId: string, amount: number, note?: string): void {
    const accounts = this.getAccounts();
    const acc = accounts.find((a) => a.id === accountId || a.accountId === accountId || a.accountNumber === accountId);
    if (acc) {
      const newBal = acc.balance + amount;
      const newEq = acc.equity + amount;
      const newFree = acc.freeMargin + amount;
      this.updateAccount(acc.id, {
        balance: newBal,
        equity: newEq,
        freeMargin: newFree,
      });

      this.addTransaction({
        accountId: acc.accountNumber || acc.accountId,
        type: 'deposit',
        amount,
        status: 'completed',
        date: new Date().toISOString(),
        timestamp: new Date().toISOString(),
        reference: `DEP-${Math.floor(100000 + Math.random() * 900000)}`,
        description: note || 'Demo Instant Credit',
      });
    }
  },

  withdraw(accountId: string, amount: number, note?: string): void {
    const accounts = this.getAccounts();
    const acc = accounts.find((a) => a.id === accountId || a.accountId === accountId || a.accountNumber === accountId);
    if (acc) {
      const newBal = Math.max(0, acc.balance - amount);
      const newEq = Math.max(0, acc.equity - amount);
      const newFree = Math.max(0, acc.freeMargin - amount);
      this.updateAccount(acc.id, {
        balance: newBal,
        equity: newEq,
        freeMargin: newFree,
      });

      this.addTransaction({
        accountId: acc.accountNumber || acc.accountId,
        type: 'withdrawal',
        amount: -amount,
        status: 'completed',
        date: new Date().toISOString(),
        timestamp: new Date().toISOString(),
        reference: `WIT-${Math.floor(100000 + Math.random() * 900000)}`,
        description: note || 'Demo Instant Withdrawal',
      });
    }
  },

  // --- MARKETS ---
  getMarkets(): Market[] {
    return getStoredItem<Market[]>(STORAGE_KEYS.MARKETS, INITIAL_MARKETS);
  },

  addMarket(market: Omit<Market, 'id'>): Market {
    const newMarket: Market = {
      ...market,
      id: `m-${Date.now()}`,
    };
    const markets = this.getMarkets();
    setStoredItem(STORAGE_KEYS.MARKETS, [newMarket, ...markets]);
    return newMarket;
  },

  updateMarket(marketId: string, data: Partial<Market>): void {
    const markets = this.getMarkets().map((m) => (m.id === marketId ? { ...m, ...data } : m));
    setStoredItem(STORAGE_KEYS.MARKETS, markets);
  },

  updateMarketPrice(marketId: string, data: Partial<Market>): void {
    this.updateMarket(marketId, data);
  },

  deleteMarket(marketId: string): void {
    const markets = this.getMarkets().filter((m) => m.id !== marketId);
    setStoredItem(STORAGE_KEYS.MARKETS, markets);
  },

  // --- POSITIONS ---
  getPositions(): Position[] {
    return getStoredItem<Position[]>(STORAGE_KEYS.POSITIONS, INITIAL_POSITIONS);
  },

  addPosition(position: Omit<Position, 'id' | 'openTime'>): Position {
    const newPos: Position = {
      ...position,
      id: `pos-${Date.now()}`,
      openTime: new Date().toISOString(),
    };
    const positions = this.getPositions();
    setStoredItem(STORAGE_KEYS.POSITIONS, [newPos, ...positions]);
    return newPos;
  },

  updatePosition(positionId: string, data: Partial<Position>): void {
    const positions = this.getPositions().map((p) => (p.id === positionId ? { ...p, ...data } : p));
    setStoredItem(STORAGE_KEYS.POSITIONS, positions);
  },

  closePosition(positionId: string): void {
    const positions = this.getPositions();
    const pos = positions.find((p) => p.id === positionId);
    if (!pos || pos.status === 'closed') return;

    const closedPos: Position = {
      ...pos,
      status: 'closed',
      closePrice: pos.currentPrice,
      closeTime: new Date().toISOString(),
    };

    const updated = positions.map((p) => (p.id === positionId ? closedPos : p));
    setStoredItem(STORAGE_KEYS.POSITIONS, updated);

    // Apply realized profit to account balance
    const accounts = this.getAccounts();
    const acc = accounts.find((a) => a.accountId === pos.accountId || a.accountNumber === pos.accountId || a.id === pos.accountId);
    if (acc) {
      this.updateAccount(acc.id, {
        balance: acc.balance + pos.pnl,
        equity: acc.equity + pos.pnl,
        freeMargin: acc.freeMargin + pos.pnl,
      });

      this.addTransaction({
        accountId: acc.accountNumber || acc.accountId,
        type: 'trade_pnl',
        amount: pos.pnl,
        status: 'completed',
        date: new Date().toISOString(),
        timestamp: new Date().toISOString(),
        reference: `TRD-${Math.floor(100000 + Math.random() * 900000)}`,
        description: `Closed ${pos.type} ${pos.volume} lot(s) ${pos.symbol}`,
      });
    }
  },

  // --- ORDERS ---
  getOrders(): Order[] {
    return getStoredItem<Order[]>(STORAGE_KEYS.ORDERS, INITIAL_ORDERS);
  },

  addOrder(order: Omit<Order, 'id' | 'createdAt'>): Order {
    const newOrder: Order = {
      ...order,
      id: `ord-${Date.now()}`,
      createdAt: new Date().toISOString(),
      date: new Date().toISOString(),
    };
    const orders = this.getOrders();
    setStoredItem(STORAGE_KEYS.ORDERS, [newOrder, ...orders]);
    return newOrder;
  },

  cancelOrder(orderId: string): void {
    const orders = this.getOrders().map((o) =>
      o.id === orderId ? { ...o, status: 'cancelled' as const } : o
    );
    setStoredItem(STORAGE_KEYS.ORDERS, orders);
  },

  // --- TRANSACTIONS ---
  getTransactions(): Transaction[] {
    const raw = getStoredItem<Transaction[]>(STORAGE_KEYS.TRANSACTIONS, INITIAL_TRANSACTIONS);
    return raw.map((t) => ({
      ...t,
      reference: t.reference || t.id.replace('tx-', 'REF-'),
      timestamp: t.timestamp || t.date || new Date().toISOString(),
      description: t.description || t.note || `${t.type.toUpperCase()} execution`,
    }));
  },

  addTransaction(tx: Omit<Transaction, 'id'>): Transaction {
    const newTx: Transaction = {
      ...tx,
      id: `tx-${Date.now()}`,
      reference: tx.reference || `REF-${Math.floor(100000 + Math.random() * 900000)}`,
      date: tx.date || new Date().toISOString(),
      timestamp: tx.timestamp || new Date().toISOString(),
      description: tx.description || tx.note,
    };
    const txs = this.getTransactions();
    setStoredItem(STORAGE_KEYS.TRANSACTIONS, [newTx, ...txs]);
    return newTx;
  },

  updateTransactionStatus(txId: string, status: TransactionStatus): void {
    const txs = this.getTransactions().map((t) => (t.id === txId ? { ...t, status } : t));
    setStoredItem(STORAGE_KEYS.TRANSACTIONS, txs);
  },

  // --- ARTICLES ---
  getArticles(): Article[] {
    return getStoredItem<Article[]>(STORAGE_KEYS.ARTICLES, INITIAL_ARTICLES);
  },

  getArticleBySlug(slug: string): Article | undefined {
    return this.getArticles().find((a) => a.slug === slug);
  },

  addArticle(article: Omit<Article, 'id'>): Article {
    const newArt: Article = {
      ...article,
      id: `art-${Date.now()}`,
      publishedAt: article.publishedAt || new Date().toISOString().substring(0, 10),
    };
    const articles = this.getArticles();
    setStoredItem(STORAGE_KEYS.ARTICLES, [newArt, ...articles]);
    return newArt;
  },

  updateArticle(articleId: string, data: Partial<Article>): void {
    const articles = this.getArticles().map((a) => (a.id === articleId ? { ...a, ...data } : a));
    setStoredItem(STORAGE_KEYS.ARTICLES, articles);
  },

  deleteArticle(articleId: string): void {
    const articles = this.getArticles().filter((a) => a.id !== articleId);
    setStoredItem(STORAGE_KEYS.ARTICLES, articles);
  },

  // --- FAQS ---
  getFaqs(): FAQItem[] {
    return getStoredItem<FAQItem[]>(STORAGE_KEYS.FAQS, INITIAL_FAQS);
  },

  addFaq(faq: Omit<FAQItem, 'id'>): FAQItem {
    const newFaq: FAQItem = {
      ...faq,
      id: `faq-${Date.now()}`,
    };
    const faqs = this.getFaqs();
    setStoredItem(STORAGE_KEYS.FAQS, [...faqs, newFaq]);
    return newFaq;
  },

  updateFaq(faqId: string, data: Partial<FAQItem>): void {
    const faqs = this.getFaqs().map((f) => (f.id === faqId ? { ...f, ...data } : f));
    setStoredItem(STORAGE_KEYS.FAQS, faqs);
  },

  deleteFaq(faqId: string): void {
    const faqs = this.getFaqs().filter((f) => f.id !== faqId);
    setStoredItem(STORAGE_KEYS.FAQS, faqs);
  },

  // --- SUPPORT TICKETS ---
  getTickets(): SupportTicket[] {
    const defaultTickets: SupportTicket[] = [
      {
        id: 'tkt-101',
        userId: 'user-demo-1',
        userName: 'Alex Vance',
        userEmail: 'demo@nexoratrade.com',
        subject: 'Inquiry regarding demo ECN raw spread execution',
        category: 'Trading',
        message: 'Hello, what is the average latency for executing market orders on the Zero account tier during London session open?',
        messages: [
          {
            id: 'msg-1',
            sender: 'user',
            text: 'Hello, what is the average latency for executing market orders on the Zero account tier during London session open?',
            timestamp: '2025-02-19 11:20',
          },
          {
            id: 'msg-2',
            sender: 'admin',
            text: 'Hello Alex! On the Zero account tier, demo simulated execution latency averages under 15ms connected to our primary virtual ECN liquidity bridge.',
            timestamp: '2025-02-19 12:05',
          },
        ],
        status: 'in_progress',
        priority: 'medium',
        createdAt: '2025-02-19 11:20',
        updatedAt: '2025-02-19 12:05',
      },
    ];
    const tickets = getStoredItem<SupportTicket[]>(STORAGE_KEYS.TICKETS, defaultTickets);
    return tickets.map((t) => ({
      ...t,
      messages: t.messages || [
        {
          id: `msg-${Date.now()}`,
          sender: 'user',
          text: t.message || 'Support inquiry',
          timestamp: t.createdAt,
        },
      ],
      updatedAt: t.updatedAt || t.createdAt,
    }));
  },

  addTicket(ticket: Omit<SupportTicket, 'id' | 'createdAt' | 'updatedAt'>): SupportTicket {
    const now = new Date().toISOString().replace('T', ' ').substring(0, 16);
    const newTicket: SupportTicket = {
      ...ticket,
      id: `tkt-${Date.now()}`,
      createdAt: now,
      updatedAt: now,
      messages: ticket.messages || [
        {
          id: `msg-${Date.now()}`,
          sender: 'user',
          text: ticket.message || 'Inquiry',
          timestamp: now,
        },
      ],
    };
    const tickets = this.getTickets();
    setStoredItem(STORAGE_KEYS.TICKETS, [newTicket, ...tickets]);
    return newTicket;
  },

  addTicketMessage(ticketId: string, msg: { sender: 'user' | 'admin'; text: string }): void {
    const newMsg = {
      id: `msg-${Date.now()}`,
      sender: msg.sender,
      text: msg.text,
      timestamp: new Date().toISOString(),
    };
    const tickets = this.getTickets().map((t) => {
      if (t.id === ticketId) {
        return {
          ...t,
          status: msg.sender === 'admin' ? ('in_progress' as const) : t.status,
          updatedAt: new Date().toISOString(),
          messages: [...(t.messages || []), newMsg],
        };
      }
      return t;
    });
    setStoredItem(STORAGE_KEYS.TICKETS, tickets);
  },

  updateTicketStatus(ticketId: string, status: string): void {
    const tickets = this.getTickets().map((t) => (t.id === ticketId ? { ...t, status } : t));
    setStoredItem(STORAGE_KEYS.TICKETS, tickets);
  },

  // --- SITE SETTINGS ---
  getSettings(): SiteSettings {
    const raw = getStoredItem<SiteSettings>(STORAGE_KEYS.SETTINGS, INITIAL_SITE_SETTINGS);
    return {
      ...raw,
      brandName: raw.brandName || raw.websiteName || 'NEXORA TRADE',
    };
  },

  updateSettings(data: Partial<SiteSettings>): SiteSettings {
    const current = this.getSettings();
    const updated = { ...current, ...data };
    setStoredItem(STORAGE_KEYS.SETTINGS, updated);
    return updated;
  },

  updateSiteSettings(data: Partial<SiteSettings>): SiteSettings {
    return this.updateSettings(data);
  },

  resetToDefaults(): void {
    localStorage.clear();
    setStoredItem(STORAGE_KEYS.USERS, INITIAL_USERS);
    setStoredItem(STORAGE_KEYS.ACCOUNTS, INITIAL_TRADING_ACCOUNTS);
    setStoredItem(STORAGE_KEYS.MARKETS, INITIAL_MARKETS);
    setStoredItem(STORAGE_KEYS.TRANSACTIONS, INITIAL_TRANSACTIONS);
    setStoredItem(STORAGE_KEYS.POSITIONS, INITIAL_POSITIONS);
    setStoredItem(STORAGE_KEYS.ORDERS, INITIAL_ORDERS);
    setStoredItem(STORAGE_KEYS.ARTICLES, INITIAL_ARTICLES);
    setStoredItem(STORAGE_KEYS.FAQS, INITIAL_FAQS);
    setStoredItem(STORAGE_KEYS.SETTINGS, INITIAL_SITE_SETTINGS);
    window.dispatchEvent(new Event('nexora-storage-update'));
  },
};
