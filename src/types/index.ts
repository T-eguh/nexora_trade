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
  accountId: string;
  accountNumber?: string;
  userId: string;
  type: AccountTierType;
  tier?: AccountTierType;
  balance: number;
  equity: number;
  leverage: string;
  currency: string;
  status: AccountStatus;
  marginUsed: number;
  margin?: number;
  freeMargin: number;
  server: string;
}

export type MarketCategory = 'Favorit' | 'Forex' | 'Crypto' | 'Komoditas' | 'Metals' | 'Indices' | 'Indeks' | 'Commodities' | 'Saham';

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
  isFavorite?: boolean;
}

export type PositionType = 'BUY' | 'SELL';
export type PositionStatus = 'open' | 'closed';

export interface Position {
  id: string;
  accountId: string;
  symbol: string;
  type: PositionType;
  volume: number;
  openPrice: number;
  currentPrice: number;
  pnl: number;
  status: PositionStatus;
  openTime?: string;
  closeTime?: string;
  closePrice?: number;
  sl?: number;
  tp?: number;
}

export type OrderType =
  | 'LIMIT_BUY'
  | 'LIMIT_SELL'
  | 'STOP_BUY'
  | 'STOP_SELL'
  | 'BUY LIMIT'
  | 'SELL LIMIT'
  | 'BUY STOP'
  | 'SELL STOP';
export type OrderStatus = 'pending' | 'executed' | 'cancelled';

export interface Order {
  id: string;
  accountId: string;
  symbol: string;
  type: OrderType;
  volume: number;
  targetPrice: number;
  price?: number;
  currentPrice?: number;
  status: OrderStatus;
  createdAt: string;
  sl?: number;
  tp?: number;
}

export type TransactionType = 'deposit' | 'withdrawal' | 'transfer' | 'trade_pnl' | 'trade_profit';
export type TransactionStatus = 'pending' | 'completed' | 'rejected' | 'failed' | 'Approved' | 'Pending';

export interface Transaction {
  id: string;
  reference?: string;
  accountId: string;
  userId?: string;
  type: TransactionType;
  amount: number;
  status: TransactionStatus;
  createdAt: string;
  timestamp?: string;
  date?: string;
  description: string;
  method?: string;
  proofUrl?: string;
}

export interface PriceAlert {
  id: string;
  symbol: string;
  targetPrice: number;
  condition: 'ABOVE' | 'BELOW';
  createdAt: string;
  active: boolean;
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
  image?: string;
}

export interface FAQItem {
  id: string;
  question: string;
  answer: string;
  category: 'General' | 'Account' | 'Accounts' | 'Trading' | 'Funding' | 'Platforms' | 'Deposits & Withdrawals';
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

export interface TicketMessage {
  id: string;
  sender: string;
  message?: string;
  text?: string;
  timestamp: string;
}

export interface SupportTicket {
  id: string;
  userId: string;
  userName: string;
  subject: string;
  department?: string;
  category?: string;
  priority: 'low' | 'medium' | 'high' | 'urgent';
  status: 'open' | 'in_progress' | 'resolved' | 'closed';
  createdAt: string;
  updatedAt?: string;
  messages: TicketMessage[];
}

export interface SiteSettings {
  brandName: string;
  websiteName?: string;
  tagline: string;
  supportEmail: string;
  email?: string;
  supportPhone: string;
  phone?: string;
  address: string;
  supportHours?: string;
  riskWarning: string;
  socialLinks: {
    twitter: string;
    telegram: string;
    discord: string;
    linkedin: string;
    youtube?: string;
  };
  kycRequired: boolean;
}
