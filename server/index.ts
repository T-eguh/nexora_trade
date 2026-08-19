import express, { Request, Response } from 'express';
import { INITIAL_MARKETS } from '../src/data/markets';
import { INITIAL_TRADING_ACCOUNTS } from '../src/data/accounts';
import { INITIAL_USERS } from '../src/data/users';
import { INITIAL_TRANSACTIONS } from '../src/data/transactions';
import { INITIAL_ARTICLES } from '../src/data/articles';
import { INITIAL_FAQS } from '../src/data/faq';
import { INITIAL_SITE_SETTINGS } from '../src/data/site';

const app = express();
const port = process.env.PORT || 3001;

app.use(express.json());

// In-memory state for API testing
let markets = [...INITIAL_MARKETS];
let accounts = [...INITIAL_TRADING_ACCOUNTS];
let users = [...INITIAL_USERS];
let transactions = [...INITIAL_TRANSACTIONS];
let articles = [...INITIAL_ARTICLES];
let faqs = [...INITIAL_FAQS];
let settings = { ...INITIAL_SITE_SETTINGS };
let positions: any[] = [];
let orders: any[] = [];

// Markets
app.get('/api/markets', (_req: Request, res: Response) => {
  res.json({ success: true, data: markets });
});

// Accounts
app.get('/api/accounts', (_req: Request, res: Response) => {
  res.json({ success: true, data: accounts });
});

// Positions
app.get('/api/positions', (_req: Request, res: Response) => {
  res.json({ success: true, data: positions });
});

app.post('/api/positions', (req: Request, res: Response) => {
  const newPos = {
    id: `pos-${Date.now()}`,
    openTime: new Date().toISOString(),
    ...req.body,
  };
  positions.push(newPos);
  res.json({ success: true, data: newPos });
});

// Orders
app.get('/api/orders', (_req: Request, res: Response) => {
  res.json({ success: true, data: orders });
});

app.post('/api/orders', (req: Request, res: Response) => {
  const newOrder = {
    id: `ord-${Date.now()}`,
    createdAt: new Date().toISOString(),
    ...req.body,
  };
  orders.push(newOrder);
  res.json({ success: true, data: newOrder });
});

// Transactions
app.get('/api/transactions', (_req: Request, res: Response) => {
  res.json({ success: true, data: transactions });
});

// Articles
app.get('/api/articles', (_req: Request, res: Response) => {
  res.json({ success: true, data: articles });
});

// FAQs
app.get('/api/faq', (_req: Request, res: Response) => {
  res.json({ success: true, data: faqs });
});

// Site Settings
app.get('/api/settings', (_req: Request, res: Response) => {
  res.json({ success: true, data: settings });
});

// Contact Submission
app.post('/api/contact', (req: Request, res: Response) => {
  res.json({
    success: true,
    message: 'Thank you for reaching out. A Nexora support specialist will respond within 24 hours.',
    data: req.body,
  });
});

if (process.env.NODE_ENV !== 'test') {
  app.listen(port, () => {
    console.log(`Nexora Trade Mock API server running on port ${port}`);
  });
}

export default app;
