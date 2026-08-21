import { SiteSettings, EconomicEvent } from '../types';

export const SITE_STATS = [
  {
    value: '14+',
    label: 'Tahun Pengalaman',
    description: 'Melayani komunitas trader global dengan teknologi eksekusi STP mutakhir.',
  },
  {
    value: '500+',
    label: 'Instrumen Pasar',
    description: 'Pasar CFD mencakup Forex, Emas, Indeks Saham, Minyak, dan Aset Digital.',
  },
  {
    value: '24/7',
    label: 'Layanan Dukungan',
    description: 'Dukungan teknis multibahasa 24 jam dengan tim Customer Service responsif.',
  },
  {
    value: 'Multi Platform',
    label: 'Web & Android',
    description: 'Eksekusi mulus di browser WebTrader dan perangkat mobile.',
  },
];

export const INITIAL_SITE_SETTINGS: SiteSettings = {
  brandName: 'Nexora Trade',
  websiteName: 'Nexora Trade',
  tagline: 'TRADING LEBIH CERDAS. TUMBUH BERSAMA NEXORA TRADE.',
  supportEmail: 'support@nexoratrade.com',
  email: 'support@nexoratrade.com',
  supportPhone: '+62 21 5088 0123',
  phone: '+62 21 5088 0123',
  address: 'Financial Center Tower 2, Jakarta & Global Financial District',
  supportHours: '24 Jam / 7 Hari Kerja',
  riskWarning: 'Trading produk dengan leverage memiliki tingkat risiko tinggi terhadap modal Anda. Pastikan Anda memahami risikonya sebelum memulai transaksi.',
  socialLinks: {
    twitter: 'https://twitter.com/nexoratrade',
    telegram: 'https://telegram.org/nexoratrade',
    discord: 'https://discord.com',
    youtube: 'https://youtube.com',
    linkedin: 'https://linkedin.com',
  },
  kycRequired: true,
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
    previous: '0.2%',
  },
  {
    id: 'eco-2',
    time: '14:00 GMT',
    currency: 'EUR',
    event: 'ECB Monetary Policy Statement',
    impact: 'high',
    actual: '4.50%',
    forecast: '4.50%',
    previous: '4.50%',
  },
  {
    id: 'eco-3',
    time: '18:00 GMT',
    currency: 'USD',
    event: 'FOMC Meeting Minutes',
    impact: 'high',
  },
  {
    id: 'eco-4',
    time: '01:30 GMT',
    currency: 'AUD',
    event: 'Employment Change',
    impact: 'medium',
    actual: '38.5K',
    forecast: '25.0K',
    previous: '12.0K',
  },
  {
    id: 'eco-5',
    time: '07:00 GMT',
    currency: 'GBP',
    event: 'GDP (YoY)',
    impact: 'high',
    actual: '0.5%',
    forecast: '0.4%',
    previous: '0.3%',
  },
];
