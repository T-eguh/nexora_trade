import { TradingAccount } from '../types';

export interface AccountTierConfig {
  type: string;
  tagline: string;
  minDeposit: string;
  spreadFrom: string;
  commission: string;
  leverage: string;
  swap: string;
  platforms: string[];
  execution: string;
  popular?: boolean;
  features: string[];
}

export const ACCOUNT_TIERS: AccountTierConfig[] = [
  {
    type: 'Starter',
    tagline: 'Ideal for newcomers learning the mechanics of live financial markets.',
    minDeposit: '$10',
    spreadFrom: '1.2 pips',
    commission: '$0',
    leverage: '1:500',
    swap: 'Standard',
    platforms: ['Nexora WebTrader', 'Mobile App'],
    execution: 'Market Execution',
    features: [
      'Zero commission trading',
      'Micro-lot sizing (0.01 lot)',
      'Access to standard educational hub',
      'Instant demo account upgrade',
      'Standard 24/5 customer support',
    ],
  },
  {
    type: 'Pro',
    tagline: 'Engineered for dedicated traders seeking tighter spreads and rapid order execution.',
    minDeposit: '$100',
    spreadFrom: '0.6 pips',
    commission: '$0',
    leverage: '1:1000',
    swap: 'Standard',
    platforms: ['Nexora WebTrader', 'MT4', 'MT5', 'Mobile App'],
    execution: 'Direct Market STP',
    popular: true,
    features: [
      'Ultra-tight floating spreads',
      'No deposit/withdrawal transaction fees',
      'Full suite of advanced technical tools',
      'Access to all 500+ instruments',
      'Priority 24/7 dedicated support',
      'Hedging & EA automated trading allowed',
    ],
  },
  {
    type: 'Zero',
    tagline: 'Raw interbank spreads from 0.0 pips tailored for scalpers and algorithmic strategies.',
    minDeposit: '$500',
    spreadFrom: '0.0 pips',
    commission: '$3.50 / lot per side',
    leverage: '1:1000',
    swap: 'Swap-free option available',
    platforms: ['Nexora WebTrader', 'MT4', 'MT5', 'Mobile App'],
    execution: 'Raw ECN Liquidity',
    features: [
      'Raw institutional spreads from 0.0 pips',
      'Deep Tier-1 interbank liquidity pool',
      'Fastest latency sub-millisecond execution',
      'Zero mark-up on currency pairs',
      'Dedicated VPS server hosting option',
      'Level II market depth view',
    ],
  },
  {
    type: 'Premium',
    tagline: 'Bespoke institutional tier with tailored trading conditions and VIP account management.',
    minDeposit: '$5,000',
    spreadFrom: '0.0 pips',
    commission: '$2.00 / lot per side',
    leverage: '1:2000',
    swap: 'Custom Swap-Free',
    platforms: ['Nexora WebTrader', 'MT4', 'MT5', 'Mobile App'],
    execution: 'Institutional ECN/STP',
    features: [
      'Lowest VIP commission structure',
      'Personal Senior Market Analyst assigned',
      'Custom liquidity stream integration',
      'Free high-speed institutional VPS',
      'Daily exclusive market intelligence briefs',
      'Direct WhatsApp concierge line',
    ],
  },
];

export const INITIAL_TRADING_ACCOUNTS: TradingAccount[] = [
  {
    id: 'acc-1',
    accountId: 'NX-894102',
    userId: 'user-demo-1',
    type: 'Pro',
    balance: 10540.25,
    equity: 10865.75,
    leverage: '1:500',
    currency: 'USD',
    status: 'active',
    marginUsed: 420.00,
    freeMargin: 10445.75,
    server: 'Nexora-US-Amerikan-Live01',
  },
  {
    id: 'acc-2',
    accountId: 'NX-410982',
    userId: 'user-demo-1',
    type: 'Zero',
    balance: 5000.00,
    equity: 5000.00,
    leverage: '1:1000',
    currency: 'USD',
    status: 'active',
    marginUsed: 0.00,
    freeMargin: 5000.00,
    server: 'Nexora-US-Amerikan-ECN02',
  },
];
