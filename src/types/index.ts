export type UserRole = 'user' | 'admin';
export type UserStatus = 'active' | 'suspended';
export type AccountTierType = 'Starter' | 'Pro' | 'Zero' | 'Premium';
export type AccountType = AccountTierType;
export type AccountStatus = 'active' | 'suspended';

export interface User {
  id: string;
  name: string;
  email: string;
  phone: string;
  country: string;
  role: UserRole;
  status: UserStatus;
  createdAt: string;
  password?: string;
  accountTier?: AccountTierType;
  twoFactorEnabled?: boolean;
}

export interface TradingAccount {
  id: string;
  accountId: string; // e.g. "NX-882910"
  accountNumber?: string; // alias for accountId
  userId: string;
  type: AccountTierType;
  tier?: AccountTierType; // alias for type
  balance: number;
  equity: number;
  leverage: string; // e.g. "1:500"
  currency: string;
  status: AccountStatus;
  marginUsed: number;
  margin?: number; // alias
  freeMargin: number;
  server: string;
}

export type MarketCategory = 'Forex' | 'Metals' | 'Indices' | 'Commodities' | 'Crypto';

export interface Market {
  id: string;
  symbol: string;
  name: string;
  category: MarketCategory;
  bid: number;
  ask: number;
  change: number;
  changePercent: number;
  high: number;
  low: number;
  spread: number;
  digits: number;
  pipValue: number;
  sparkline: number[];
  description?: string;
}

export type PositionType = 'BUY' | 'SELL';
export type PositionStatus = 'open' | 'closed';

export interface Position {
  id: string;
  accountId: string;
  symbol: string;
  type: PositionType;
  volume: number; // in lots
  openPrice: number;
  currentPrice: number;
  closePrice?: number;
  sl?: number;
  tp?: number;
  pnl: number;
  status: PositionStatus;
  openTime: string;
  closeTime?: string;
}

export type OrderType = 'BUY LIMIT' | 'SELL LIMIT' | 'BUY STOP' | 'SELL STOP' | 'BUY_LIMIT' | 'SELL_LIMIT' | 'BUY_STOP' | 'SELL_STOP';
export type OrderStatus = 'pending' | 'executed' | 'cancelled';

export interface Order {
  id: string;
  accountId: string;
  symbol: string;
  type: OrderType;
  volume: number;
  price?: number;
  targetPrice?: number;
  currentPrice?: number;
  sl?: number;
  tp?: number;
  status: OrderStatus;
  date?: string;
  createdAt?: string;
}

export type TransactionType = 'deposit' | 'withdrawal' | 'trade_profit' | 'trade_loss' | 'trade_pnl';
export type TransactionStatus = 'Pending' | 'Approved' | 'Rejected' | 'completed' | 'pending' | 'failed';

export interface Transaction {
  id: string;
  reference?: string;
  userId?: string;
  accountId: string;
  date?: string;
  timestamp?: string;
  type: TransactionType;
  amount: number;
  method?: string;
  accountName?: string;
  accountNumber?: string;
  status: TransactionStatus;
  note?: string;
  description?: string;
}

export interface Article {
  id: string;
  slug: string;
  title: string;
  category: string;
  readTime: string;
  publishedAt: string;
  author: string;
  summary: string;
  content: string;
  tags: string[];
}

export interface FAQItem {
  id: string;
  question: string;
  answer: string;
  category: string;
}

export interface TicketMessage {
  id: string;
  sender: 'user' | 'admin' | string;
  text: string;
  timestamp: string;
  isAdmin?: boolean;
}

export interface TicketReply {
  id: string;
  sender: string;
  message: string;
  timestamp: string;
  isAdmin: boolean;
}

export interface SupportTicket {
  id: string;
  userId: string;
  userName: string;
  userEmail: string;
  subject: string;
  category: string;
  message?: string;
  messages?: TicketMessage[];
  status: 'open' | 'in_progress' | 'resolved' | string;
  priority: 'low' | 'medium' | 'high';
  createdAt: string;
  updatedAt?: string;
  replies?: TicketReply[];
}

export interface SiteSettings {
  websiteName?: string;
  brandName: string;
  tagline: string;
  email: string;
  phone: string;
  supportHours: string;
  riskWarning: string;
  socialLinks?: {
    twitter: string;
    telegram: string;
    discord: string;
    youtube: string;
    linkedin: string;
  };
}

export interface EconomicEvent {
  id: string;
  time: string;
  currency: string;
  event: string;
  impact: 'low' | 'medium' | 'high';
  actual?: string;
  forecast?: string;
  previous?: string;
}
