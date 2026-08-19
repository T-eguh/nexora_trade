import { StorageService } from '../utils/storage';
import { Market, Article, FAQItem } from '../types';

export const ApiService = {
  async getHealth(): Promise<{ status: string; timestamp: string }> {
    try {
      const res = await fetch('/api/health');
      if (!res.ok) throw new Error('API offline');
      return await res.json();
    } catch {
      return { status: 'healthy (local demo mode)', timestamp: new Date().toISOString() };
    }
  },

  async getMarkets(): Promise<Market[]> {
    try {
      const res = await fetch('/api/markets');
      if (!res.ok) throw new Error('API error');
      return await res.json();
    } catch {
      return StorageService.getMarkets();
    }
  },

  async getArticles(): Promise<Article[]> {
    try {
      const res = await fetch('/api/articles');
      if (!res.ok) throw new Error('API error');
      return await res.json();
    } catch {
      return StorageService.getArticles();
    }
  },

  async getFaqs(): Promise<FAQItem[]> {
    try {
      const res = await fetch('/api/faq');
      if (!res.ok) throw new Error('API error');
      return await res.json();
    } catch {
      return StorageService.getFaqs();
    }
  },

  async submitContact(data: { name: string; email: string; phone?: string; subject: string; message: string }): Promise<{ success: boolean; message: string }> {
    try {
      const res = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });
      if (!res.ok) throw new Error('API error');
      return await res.json();
    } catch {
      // Graceful local simulation
      return { success: true, message: 'Thank you for reaching out. Your demo message has been received successfully.' };
    }
  },
};
