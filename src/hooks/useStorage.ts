import { useState, useEffect, useCallback } from 'react';
import { StorageService } from '../utils/storage';
import { User, Market, TradingAccount, Transaction, Position, Order, Article, FAQItem, SupportTicket, SiteSettings } from '../types';

export function useAuth() {
  const [user, setUser] = useState<User | null>(() => StorageService.getCurrentUser());

  useEffect(() => {
    const handleUpdate = () => {
      setUser(StorageService.getCurrentUser());
    };
    window.addEventListener('nexora-storage-update', handleUpdate);
    return () => window.removeEventListener('nexora-storage-update', handleUpdate);
  }, []);

  const login = useCallback((email: string, pass: string) => {
    return StorageService.login(email, pass);
  }, []);

  const register = useCallback((data: { name: string; email: string; phone: string; country: string }) => {
    return StorageService.register(data);
  }, []);

  const logout = useCallback(() => {
    StorageService.logout();
  }, []);

  return { user, login, register, logout, isAuthenticated: !!user, isAdmin: user?.role === 'admin' };
}

export function useMarkets() {
  const [markets, setMarkets] = useState<Market[]>(() => StorageService.getMarkets());

  useEffect(() => {
    const handleUpdate = () => {
      setMarkets(StorageService.getMarkets());
    };
    window.addEventListener('nexora-storage-update', handleUpdate);
    return () => window.removeEventListener('nexora-storage-update', handleUpdate);
  }, []);

  return {
    markets,
    addMarket: StorageService.addMarket.bind(StorageService),
    updateMarket: StorageService.updateMarket.bind(StorageService),
    deleteMarket: StorageService.deleteMarket.bind(StorageService),
  };
}

export function useAccounts(userId?: string) {
  const [accounts, setAccounts] = useState<TradingAccount[]>(() =>
    userId ? StorageService.getUserAccounts(userId) : StorageService.getAccounts()
  );

  useEffect(() => {
    const handleUpdate = () => {
      setAccounts(userId ? StorageService.getUserAccounts(userId) : StorageService.getAccounts());
    };
    window.addEventListener('nexora-storage-update', handleUpdate);
    return () => window.removeEventListener('nexora-storage-update', handleUpdate);
  }, [userId]);

  return {
    accounts,
    updateAccount: StorageService.updateAccount.bind(StorageService),
    createTradingAccount: StorageService.createTradingAccount.bind(StorageService),
  };
}

export function useTransactions() {
  const [transactions, setTransactions] = useState<Transaction[]>(() => StorageService.getTransactions());

  useEffect(() => {
    const handleUpdate = () => {
      setTransactions(StorageService.getTransactions());
    };
    window.addEventListener('nexora-storage-update', handleUpdate);
    return () => window.removeEventListener('nexora-storage-update', handleUpdate);
  }, []);

  return {
    transactions,
    addTransaction: StorageService.addTransaction.bind(StorageService),
    updateTransactionStatus: StorageService.updateTransactionStatus.bind(StorageService),
  };
}

export function usePositions() {
  const [positions, setPositions] = useState<Position[]>(() => StorageService.getPositions());

  useEffect(() => {
    const handleUpdate = () => {
      setPositions(StorageService.getPositions());
    };
    window.addEventListener('nexora-storage-update', handleUpdate);
    return () => window.removeEventListener('nexora-storage-update', handleUpdate);
  }, []);

  return {
    positions,
    addPosition: StorageService.addPosition.bind(StorageService),
    closePosition: StorageService.closePosition.bind(StorageService),
  };
}

export function useOrders() {
  const [orders, setOrders] = useState<Order[]>(() => StorageService.getOrders());

  useEffect(() => {
    const handleUpdate = () => {
      setOrders(StorageService.getOrders());
    };
    window.addEventListener('nexora-storage-update', handleUpdate);
    return () => window.removeEventListener('nexora-storage-update', handleUpdate);
  }, []);

  return {
    orders,
    addOrder: StorageService.addOrder.bind(StorageService),
    cancelOrder: StorageService.cancelOrder.bind(StorageService),
  };
}

export function useArticles() {
  const [articles, setArticles] = useState<Article[]>(() => StorageService.getArticles());

  useEffect(() => {
    const handleUpdate = () => {
      setArticles(StorageService.getArticles());
    };
    window.addEventListener('nexora-storage-update', handleUpdate);
    return () => window.removeEventListener('nexora-storage-update', handleUpdate);
  }, []);

  return {
    articles,
    addArticle: StorageService.addArticle.bind(StorageService),
    updateArticle: StorageService.updateArticle.bind(StorageService),
    deleteArticle: StorageService.deleteArticle.bind(StorageService),
  };
}

export function useFaqs() {
  const [faqs, setFaqs] = useState<FAQItem[]>(() => StorageService.getFaqs());

  useEffect(() => {
    const handleUpdate = () => {
      setFaqs(StorageService.getFaqs());
    };
    window.addEventListener('nexora-storage-update', handleUpdate);
    return () => window.removeEventListener('nexora-storage-update', handleUpdate);
  }, []);

  return {
    faqs,
    addFaq: StorageService.addFaq.bind(StorageService),
    updateFaq: StorageService.updateFaq.bind(StorageService),
    deleteFaq: StorageService.deleteFaq.bind(StorageService),
  };
}

export function useTickets() {
  const [tickets, setTickets] = useState<SupportTicket[]>(() => StorageService.getTickets());

  useEffect(() => {
    const handleUpdate = () => {
      setTickets(StorageService.getTickets());
    };
    window.addEventListener('nexora-storage-update', handleUpdate);
    return () => window.removeEventListener('nexora-storage-update', handleUpdate);
  }, []);

  return {
    tickets,
    addTicket: StorageService.addTicket.bind(StorageService),
    addTicketMessage: StorageService.addTicketMessage.bind(StorageService),
    updateTicketStatus: StorageService.updateTicketStatus.bind(StorageService),
  };
}

export function useUsers() {
  const [users, setUsers] = useState<User[]>(() => StorageService.getUsers());

  useEffect(() => {
    const handleUpdate = () => {
      setUsers(StorageService.getUsers());
    };
    window.addEventListener('nexora-storage-update', handleUpdate);
    return () => window.removeEventListener('nexora-storage-update', handleUpdate);
  }, []);

  return {
    users,
    addUser: StorageService.addUser.bind(StorageService),
    updateUser: StorageService.updateUser.bind(StorageService),
    deleteUser: StorageService.deleteUser.bind(StorageService),
  };
}

export function useSiteSettings() {
  const [settings, setSettings] = useState<SiteSettings>(() => StorageService.getSettings());

  useEffect(() => {
    const handleUpdate = () => {
      setSettings(StorageService.getSettings());
    };
    window.addEventListener('nexora-storage-update', handleUpdate);
    return () => window.removeEventListener('nexora-storage-update', handleUpdate);
  }, []);

  return {
    settings,
    updateSettings: StorageService.updateSettings.bind(StorageService),
  };
}
