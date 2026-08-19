import { FAQItem } from '../types';

export const INITIAL_FAQS: FAQItem[] = [
  {
    id: 'faq-1',
    category: 'General',
    question: 'What is Nexora Trade?',
    answer: 'Nexora Trade is a modern financial platform offering institutional-grade execution across global markets including Forex, Precious Metals, Global Indices, Energy Commodities, and Cryptocurrencies on a unified trading interface.',
  },
  {
    id: 'faq-2',
    category: 'General',
    question: 'Are the market conditions and funds in this portal real?',
    answer: 'This environment operates under demo conditions with simulated market execution, virtual funds, and sample price feeds. No real monetary transactions or actual broker custody take place.',
  },
  {
    id: 'faq-3',
    category: 'Trading',
    question: 'What trading instruments are available on Nexora Trade?',
    answer: 'You can explore over 500+ demo CFD instruments including major/minor/exotic Forex pairs, Spot Gold (XAU/USD) & Silver, US Tech 100 (NASDAQ), Wall Street 500 (S&P 500), DAX 40, WTI & Brent Crude Oil, and key Cryptocurrencies like Bitcoin, Ethereum, and Solana.',
  },
  {
    id: 'faq-4',
    category: 'Trading',
    question: 'What is the maximum leverage available for trading?',
    answer: 'Demo leverage configurations range from 1:100 up to 1:2000 depending on the selected account tier (Starter, Pro, Zero, or Premium) and the specific asset class traded.',
  },
  {
    id: 'faq-5',
    category: 'Accounts',
    question: 'How do I open a demo trading account?',
    answer: 'You can register in less than 30 seconds by navigating to the Register page. An initial demo account with virtual funds is instantly provisioned in your client dashboard.',
  },
  {
    id: 'faq-6',
    category: 'Accounts',
    question: 'Can I have multiple trading accounts?',
    answer: 'Yes, inside your Nexora Client Dashboard under the Trading Accounts section, you can manage multiple demo sub-accounts with different currencies, tiers, and leverage settings.',
  },
  {
    id: 'faq-7',
    category: 'Deposits & Withdrawals',
    question: 'How do deposit and withdrawal simulations work?',
    answer: 'You can submit simulated deposit and withdrawal requests using Bank Transfer, E-Wallets, or Crypto payment methods. Requests will reflect in your transaction history with simulated approval states.',
  },
  {
    id: 'faq-8',
    category: 'Platforms',
    question: 'Which trading platforms are supported?',
    answer: 'Nexora Trade features the proprietary high-performance Nexora WebTrader accessible on any modern desktop and mobile browser, along with full compatibility for MetaTrader 4 (MT4), MetaTrader 5 (MT5), and native iOS/Android mobile apps.',
  },
];
