import { SiteSettings, EconomicEvent } from '../types';

export const SITE_STATS = [
  {
    value: '10+',
    label: 'Years of Experience',
    description: 'Serving global trading communities with cutting-edge technology and market liquidity.',
  },
  {
    value: '500+',
    label: 'Trading Instruments',
    description: 'Diverse CFD markets covering Forex, Metals, Indices, Energies, and Digital Assets.',
  },
  {
    value: '24/7',
    label: 'Client Support',
    description: 'Multilingual round-the-clock technical assistance and dedicated account management.',
  },
  {
    value: 'Multi Platform',
    label: 'Web & Mobile',
    description: 'Seamless execution across Nexora WebTrader, MT4, MT5, and native mobile apps.',
  },
];

export const INITIAL_SITE_SETTINGS: SiteSettings = {
  brandName: 'NEXORA TRADE',
  websiteName: 'NEXORA TRADE',
  tagline: 'TRADE SMARTER. GROW WITH CONFIDENCE.',
  email: 'support@nexoratrade.com',
  phone: '+1 (800) 892-4100',
  supportHours: '24 Hours / 7 Days a Week',
  riskWarning: 'Trading leveraged products involves significant risk of loss. Please understand the risks and review your investment objectives before trading.',
  socialLinks: {
    twitter: 'https://twitter.com',
    telegram: 'https://telegram.org',
    discord: 'https://discord.com',
    youtube: 'https://youtube.com',
    linkedin: 'https://linkedin.com',
  },
};

export const INITIAL_ECONOMIC_EVENTS: EconomicEvent[] = [
  {
    id: 'eco-1',
    time: '13:30 GMT',
    currency: 'USD',
    event: 'Core CPI (MoM)',
    impact: 'high',
    actual: '0.3%',
    forecast: '0.3%',
    previous: '0.3%',
  },
  {
    id: 'eco-2',
    time: '14:45 GMT',
    currency: 'USD',
    event: 'Flash Manufacturing PMI',
    impact: 'medium',
    actual: '51.2',
    forecast: '50.8',
    previous: '50.5',
  },
  {
    id: 'eco-3',
    time: '09:00 GMT',
    currency: 'EUR',
    event: 'German Final CPI (MoM)',
    impact: 'medium',
    actual: '0.2%',
    forecast: '0.2%',
    previous: '0.1%',
  },
  {
    id: 'eco-4',
    time: '19:00 GMT',
    currency: 'USD',
    event: 'FOMC Meeting Minutes',
    impact: 'high',
    actual: 'Hawkish tone',
    forecast: '-',
    previous: '-',
  },
  {
    id: 'eco-5',
    time: '01:30 GMT',
    currency: 'AUD',
    event: 'Employment Change',
    impact: 'high',
    actual: '+35.2K',
    forecast: '+25.0K',
    previous: '+18.4K',
  },
  {
    id: 'eco-6',
    time: '07:00 GMT',
    currency: 'GBP',
    event: 'GDP (MoM)',
    impact: 'medium',
    actual: '0.1%',
    forecast: '0.2%',
    previous: '-0.1%',
  },
];
