import {
  User,
  TradingAccount,
  Market,
  Position,
  Order,
  Transaction,
  Article,
  FAQItem,
  SiteSettings,
  TransactionStatus,
  UserStatus,
  AccountTierType,
  PriceAlert,
  SupportTicket,
  KycDocument,
  KycStatus,
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
  ALERTS: 'nexora_price_alerts',
  KYC_DOCUMENTS: 'nexora_kyc_documents',
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
    setTimeout(() => {
      window.dispatchEvent(new Event('nexora-storage-update'));
    }, 0);
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
      setTimeout(() => {
        window.dispatchEvent(new Event('nexora-storage-update'));
      }, 0);
    }
  },

  login(emailOrPhone: string, password?: string): User | null {
    if (!emailOrPhone || !password) {
      return null;
    }

    const cleanInput = emailOrPhone.trim().toLowerCase();
    const cleanPass = password.trim();

    if (!cleanPass) {
      return null;
    }

    const users = this.getUsers();

    // 1. Admin login verification
    if (cleanInput === 'admin@nexoratrade.com' || cleanInput === 'admin') {
      const adminUser = users.find(
        (u) => u.email.toLowerCase() === 'admin@nexoratrade.com' || u.role === 'admin'
      ) || INITIAL_USERS[1];

      const expectedAdminPass = adminUser.password || 'admin123';
      if (cleanPass === expectedAdminPass) {
        this.setCurrentUser(adminUser);
        return adminUser;
      }
      // Wrong admin password
      return null;
    }

    // 2. Client / Trader account verification
    const matchedUser = users.find((u) => {
      const emailMatch = u.email.toLowerCase() === cleanInput;
      const phoneClean = (u.phone || '').replace(/[^0-9]/g, '');
      const inputClean = cleanInput.replace(/[^0-9]/g, '');
      const phoneMatch = inputClean.length >= 6 && phoneClean.includes(inputClean);
      const demoMatch = (cleanInput === 'demo' || cleanInput.includes('ismail')) && u.email.toLowerCase() === 'demo@nexoratrade.com';
      return emailMatch || phoneMatch || demoMatch;
    });

    if (matchedUser) {
      const expectedUserPass = matchedUser.password || (matchedUser.email.toLowerCase() === 'demo@nexoratrade.com' ? 'demo123' : 'password123');
      if (cleanPass === expectedUserPass) {
        this.setCurrentUser(matchedUser);
        return matchedUser;
      }
      // Password does not match
      return null;
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
    const existing = users.find((u) => u.email.toLowerCase() === userData.email.toLowerCase());
    if (existing) {
      this.setCurrentUser(existing);
      return existing;
    }

    const newUser: User = {
      id: `user-${Date.now()}`,
      name: userData.name || userData.email.split('@')[0],
      email: userData.email,
      phone: userData.phone,
      country: userData.country || 'Indonesia',
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
      accountId: `205128${Math.floor(100 + Math.random() * 900)}`,
      accountNumber: `205128${Math.floor(100 + Math.random() * 900)}`,
      userId: newUser.id,
      type: userData.accountTier || 'Pro',
      tier: userData.accountTier || 'Pro',
      balance: 0.0,
      equity: 0.0,
      leverage: '1:500',
      currency: 'USD',
      status: 'active',
      marginUsed: 0,
      margin: 0,
      freeMargin: 0.0,
      server: 'Nexora-US-Amerikan-Live01',
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

  // --- KYC / DOCUMENT VERIFICATION ---
  getKycDocuments(): KycDocument[] {
    return getStoredItem<KycDocument[]>(STORAGE_KEYS.KYC_DOCUMENTS, []);
  },

  getUserKycDocument(userId: string): KycDocument | undefined {
    const docs = this.getKycDocuments();
    return docs.find((d) => d.userId === userId);
  },

  submitKycDocument(data: {
    userId: string;
    fullName: string;
    nik: string;
    birthDate?: string;
    address?: string;
    ktpImageUrl: string;
  }): KycDocument {
    const docs = this.getKycDocuments().filter((d) => d.userId !== data.userId);
    const newDoc: KycDocument = {
      id: `kyc-${Date.now()}`,
      userId: data.userId,
      fullName: data.fullName,
      nik: data.nik,
      birthDate: data.birthDate,
      address: data.address,
      ktpImageUrl: data.ktpImageUrl,
      uploadedAt: new Date().toISOString(),
      status: 'pending',
    };

    setStoredItem(STORAGE_KEYS.KYC_DOCUMENTS, [newDoc, ...docs]);

    // Update user profile status
    this.updateUser(data.userId, {
      kycStatus: 'pending',
      nik: data.nik,
      ktpImageUrl: data.ktpImageUrl,
      kycSubmittedAt: newDoc.uploadedAt,
    });

    return newDoc;
  },

  updateKycStatus(docId: string, status: KycStatus, rejectionReason?: string): void {
    const docs = this.getKycDocuments();
    const doc = docs.find((d) => d.id === docId);
    if (!doc) return;

    const updatedDocs = docs.map((d) =>
      d.id === docId
        ? {
            ...d,
            status,
            rejectionReason: status === 'rejected' ? rejectionReason : undefined,
            verifiedAt: status === 'verified' ? new Date().toISOString() : undefined,
          }
        : d
    );
    setStoredItem(STORAGE_KEYS.KYC_DOCUMENTS, updatedDocs);

    // Update corresponding user record
    this.updateUser(doc.userId, {
      kycStatus: status,
      kycRejectionReason: status === 'rejected' ? rejectionReason : undefined,
    });
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
      accountId: account.accountId || (account as any).accountNumber || `205128${Math.floor(100 + Math.random() * 900)}`,
      accountNumber: account.accountNumber || account.accountId || `205128${Math.floor(100 + Math.random() * 900)}`,
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
  // Direct deposit helper (for admin or automated test)
  deposit(accountId: string, amount: number, note?: string): void {
    const accounts = this.getAccounts();
    const acc = accounts.find((a) => a.id === accountId || a.accountId === accountId || a.accountNumber === accountId) || accounts[0];
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
        createdAt: new Date().toISOString(),
        description: note || 'Setoran Instan Indonesia',
        reference: `DEP-${Date.now().toString().slice(-8)}`,
      });
    }
  },

  // User submits a deposit payment request (Pending admin confirmation)
  requestDeposit(accountId: string, amountUsd: number, amountIdr: number, note?: string): Transaction {
    const accounts = this.getAccounts();
    const acc = accounts.find((a) => a.id === accountId || a.accountId === accountId || a.accountNumber === accountId) || accounts[0];
    const accNum = acc ? (acc.accountNumber || acc.accountId) : accountId;

    const newTx: Transaction = {
      id: `tx-${Date.now()}`,
      accountId: accNum,
      type: 'deposit',
      amount: amountUsd,
      status: 'pending',
      createdAt: new Date().toISOString(),
      description: note || `Setoran QRIS Rp ${amountIdr.toLocaleString('id-ID')} (Menunggu Konfirmasi Admin)`,
      reference: `QRIS-${Date.now().toString().slice(-8)}`,
    };

    const txs = this.getTransactions();
    setStoredItem(STORAGE_KEYS.TRANSACTIONS, [newTx, ...txs]);
    return newTx;
  },

  withdraw(accountId: string, amount: number, note?: string): void {
    const accounts = this.getAccounts();
    const acc = accounts.find((a) => a.id === accountId || a.accountId === accountId || a.accountNumber === accountId) || accounts[0];
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
        createdAt: new Date().toISOString(),
        description: note || 'Penarikan Dana Indonesia',
        reference: `WD-${Date.now().toString().slice(-8)}`,
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

  toggleFavorite(marketId: string): void {
    const markets = this.getMarkets().map((m) =>
      m.id === marketId ? { ...m, isFavorite: !m.isFavorite } : m
    );
    setStoredItem(STORAGE_KEYS.MARKETS, markets);
  },

  deleteMarket(marketId: string): void {
    const markets = this.getMarkets().filter((m) => m.id !== marketId);
    setStoredItem(STORAGE_KEYS.MARKETS, markets);
  },

  // --- POSITIONS ---
  getPositions(): Position[] {
    const raw = getStoredItem<Position[]>(STORAGE_KEYS.POSITIONS, INITIAL_POSITIONS);
    // Sanitize any legacy mock positions
    const valid = raw.filter(
      (p) =>
        p &&
        p.id &&
        !['pos-1', 'pos-2', 'pos-3', 'pos-4', 'pos-5'].includes(p.id) &&
        !p.id.startsWith('dummy-')
    );
    if (valid.length !== raw.length) {
      try {
        localStorage.setItem(STORAGE_KEYS.POSITIONS, JSON.stringify(valid));
      } catch (e) {}
    }
    return valid;
  },

  addPosition(position: Omit<Position, 'id' | 'openTime'>): Position {
    const newPos: Position = {
      ...position,
      id: `pos-${Date.now()}-${Math.floor(Math.random() * 1000)}`,
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

  deletePosition(positionId: string): void {
    const positions = this.getPositions().filter((p) => p.id !== positionId);
    setStoredItem(STORAGE_KEYS.POSITIONS, positions);
  },

  clearAllPositions(): void {
    setStoredItem(STORAGE_KEYS.POSITIONS, []);
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
    const acc = accounts.find((a) => a.accountId === pos.accountId || a.accountNumber === pos.accountId || a.id === pos.accountId) || accounts[0];
    if (acc) {
      this.updateAccount(acc.id, {
        balance: acc.balance + pos.pnl,
        equity: acc.equity + pos.pnl,
        freeMargin: acc.freeMargin + pos.pnl,
      });

      this.addTransaction({
        accountId: acc.accountNumber || acc.accountId,
        type: 'transfer',
        amount: pos.pnl,
        status: 'completed',
        createdAt: new Date().toISOString(),
        description: `Tutup Order ${pos.type} ${pos.volume} lot ${pos.symbol} (P/L: ${pos.pnl >= 0 ? '+' : ''}$${pos.pnl.toFixed(2)})`,
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
    return getStoredItem<Transaction[]>(STORAGE_KEYS.TRANSACTIONS, INITIAL_TRANSACTIONS);
  },

  addTransaction(tx: Omit<Transaction, 'id' | 'createdAt'> & { createdAt?: string }): Transaction {
    const newTx: Transaction = {
      ...tx,
      id: `tx-${Date.now()}`,
      createdAt: tx.createdAt || new Date().toISOString(),
      description: tx.description,
    };
    const txs = this.getTransactions();
    setStoredItem(STORAGE_KEYS.TRANSACTIONS, [newTx, ...txs]);
    return newTx;
  },

  updateTransactionStatus(txId: string, status: TransactionStatus): void {
    const txs = this.getTransactions();
    const targetTx = txs.find((t) => t.id === txId);
    if (!targetTx) return;

    const previousStatus = targetTx.status;
    const isNowApproved = status === 'completed' || status === 'Approved';
    const wasPending = previousStatus === 'pending' || previousStatus === 'Pending';

    // If admin is approving a pending deposit, credit the balance to user's trading account
    if (isNowApproved && wasPending && targetTx.type === 'deposit') {
      const accounts = this.getAccounts();
      const acc =
        accounts.find(
          (a) =>
            a.accountNumber === targetTx.accountId ||
            a.accountId === targetTx.accountId ||
            a.id === targetTx.accountId
        ) || accounts[0];

      if (acc) {
        const depositAmount = Math.abs(targetTx.amount);
        const newBal = acc.balance + depositAmount;
        const newEq = acc.equity + depositAmount;
        const newFree = acc.freeMargin + depositAmount;

        this.updateAccount(acc.id, {
          balance: newBal,
          equity: newEq,
          freeMargin: newFree,
        });
      }
    }

    const updated = txs.map((t) => (t.id === txId ? { ...t, status } : t));
    setStoredItem(STORAGE_KEYS.TRANSACTIONS, updated);
  },

  // --- PRICE ALERTS ---
  getPriceAlerts(): PriceAlert[] {
    return getStoredItem<PriceAlert[]>(STORAGE_KEYS.ALERTS, []);
  },

  addPriceAlert(alert: Omit<PriceAlert, 'id' | 'createdAt' | 'active'>): PriceAlert {
    const newAlert: PriceAlert = {
      ...alert,
      id: `alert-${Date.now()}`,
      createdAt: new Date().toISOString(),
      active: true,
    };
    const alerts = this.getPriceAlerts();
    setStoredItem(STORAGE_KEYS.ALERTS, [newAlert, ...alerts]);
    return newAlert;
  },

  deletePriceAlert(id: string): void {
    const alerts = this.getPriceAlerts().filter((a) => a.id !== id);
    setStoredItem(STORAGE_KEYS.ALERTS, alerts);
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
    return getStoredItem<SupportTicket[]>('nexora_support_tickets', [
      {
        id: 't-101',
        userId: 'user-demo-1',
        userName: 'Ismail',
        subject: 'Pertanyaan Deposit Bank BCA',
        department: 'Finance',
        priority: 'medium',
        status: 'open',
        createdAt: new Date().toISOString(),
        messages: [
          {
            id: 'm-1',
            sender: 'user',
            message: 'Halo, bagaimana cara verifikasi pembayaran otomatis?',
            timestamp: new Date().toISOString(),
          },
          {
            id: 'm-2',
            sender: 'agent',
            message: 'Halo Pak Ismail, pembayaran melalui BCA Virtual Account diverifikasi otomatis dalam 1 menit.',
            timestamp: new Date().toISOString(),
          },
        ],
      },
    ]);
  },

  addTicket(ticket: Omit<SupportTicket, 'id' | 'createdAt' | 'messages'>): SupportTicket {
    const newT: SupportTicket = {
      ...ticket,
      id: `t-${Date.now()}`,
      createdAt: new Date().toISOString(),
      messages: [],
    };
    const tickets = this.getTickets();
    setStoredItem('nexora_support_tickets', [newT, ...tickets]);
    return newT;
  },

  addTicketMessage(ticketId: string, message: string, sender: 'user' | 'agent' = 'user'): void {
    const tickets = this.getTickets().map((t) => {
      if (t.id === ticketId) {
        return {
          ...t,
          messages: [
            ...t.messages,
            {
              id: `m-${Date.now()}`,
              sender,
              message,
              timestamp: new Date().toISOString(),
            },
          ],
        };
      }
      return t;
    });
    setStoredItem('nexora_support_tickets', tickets);
  },

  updateTicketStatus(ticketId: string, status: 'open' | 'in_progress' | 'resolved' | 'closed'): void {
    const tickets = this.getTickets().map((t) => (t.id === ticketId ? { ...t, status } : t));
    setStoredItem('nexora_support_tickets', tickets);
  },

  updateMarketPrice(marketId: string, dataOrBid: Partial<Market> | number, maybeAsk?: number): void {
    const markets = this.getMarkets().map((m) => {
      if (m.id === marketId) {
        if (typeof dataOrBid === 'object') {
          return { ...m, ...dataOrBid };
        }
        return { ...m, bid: dataOrBid, ask: maybeAsk ?? m.ask };
      }
      return m;
    });
    setStoredItem(STORAGE_KEYS.MARKETS, markets);
  },

  updateSiteSettings(data: Partial<SiteSettings>): SiteSettings {
    return this.updateSettings(data);
  },

  // --- SITE SETTINGS ---
  getSettings(): SiteSettings {
    return getStoredItem<SiteSettings>(STORAGE_KEYS.SETTINGS, INITIAL_SITE_SETTINGS);
  },

  updateSettings(data: Partial<SiteSettings>): SiteSettings {
    const current = this.getSettings();
    const updated = { ...current, ...data };
    setStoredItem(STORAGE_KEYS.SETTINGS, updated);
    return updated;
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
