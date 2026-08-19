import React, { useState } from 'react';
import { Card } from '../../components/Card';
import { Badge } from '../../components/Badge';
import { Input } from '../../components/Input';
import { Table, Column } from '../../components/Table';
import { useTransactions } from '../../hooks/useStorage';
import { Transaction, TransactionType } from '../../types';
import { Search, Receipt, ArrowDownCircle, ArrowUpCircle, RefreshCw } from 'lucide-react';

export const TransactionsPage: React.FC = () => {
  const { transactions } = useTransactions();
  const [search, setSearch] = useState('');
  const [typeFilter, setTypeFilter] = useState<string>('ALL');

  const filtered = transactions.filter((tx) => {
    const matchesSearch =
      tx.reference.toLowerCase().includes(search.toLowerCase()) ||
      tx.accountId.toLowerCase().includes(search.toLowerCase()) ||
      (tx.description || '').toLowerCase().includes(search.toLowerCase());
    const matchesType = typeFilter === 'ALL' || tx.type === typeFilter;
    return matchesSearch && matchesType;
  });

  const columns: Column<Transaction>[] = [
    {
      header: 'Reference',
      render: (t) => <strong className="font-bold text-white font-mono-num">#{t.reference}</strong>,
    },
    {
      header: 'Date & Time',
      render: (t) => (
        <span className="text-xs text-neutral-400 font-mono-num">
          {new Date(t.timestamp).toLocaleDateString()} {new Date(t.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
        </span>
      ),
    },
    {
      header: 'Account',
      render: (t) => <span className="font-mono-num text-neutral-300">{t.accountId}</span>,
    },
    {
      header: 'Type',
      render: (t) => {
        const variant =
          t.type === 'deposit' ? 'success' : t.type === 'withdrawal' ? 'danger' : 'neutral';
        return (
          <Badge variant={variant} size="sm">
            {t.type.toUpperCase()}
          </Badge>
        );
      },
    },
    {
      header: 'Amount',
      align: 'right',
      render: (t) => {
        const isDep = t.type === 'deposit' || t.amount > 0;
        return (
          <span
            className={`font-mono-num font-bold text-sm ${
              isDep ? 'text-emerald-400' : 'text-red-400'
            }`}
          >
            {isDep ? '+' : '-'}${Math.abs(t.amount).toLocaleString('en-US', { minimumFractionDigits: 2 })}
          </span>
        );
      },
    },
    {
      header: 'Status',
      render: (t) => (
        <Badge
          variant={t.status === 'completed' ? 'success' : t.status === 'pending' ? 'warning' : 'danger'}
          size="sm"
        >
          {t.status.toUpperCase()}
        </Badge>
      ),
    },
    {
      header: 'Notes',
      render: (t) => (
        <span className="text-xs text-neutral-400 truncate max-w-[200px] block">
          {t.description || '-'}
        </span>
      ),
    },
  ];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-white tracking-tight">Transaction History</h1>
        <p className="text-xs text-neutral-400">
          Auditable statement log of all deposits, withdrawals, and trade P/L settlements.
        </p>
      </div>

      {/* Filter and Search */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4 bg-[#0D0D0F] p-4 rounded-xl border border-neutral-800">
        <div className="flex items-center gap-1.5 overflow-x-auto w-full sm:w-auto">
          {['ALL', 'deposit', 'withdrawal', 'trade_pnl'].map((type) => (
            <button
              key={type}
              onClick={() => setTypeFilter(type)}
              className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-colors cursor-pointer capitalize ${
                typeFilter === type
                  ? 'bg-red-600 text-white'
                  : 'bg-[#151518] text-neutral-400 hover:text-white border border-neutral-800'
              }`}
            >
              {type.replace('_', ' ')}
            </button>
          ))}
        </div>

        <div className="w-full sm:w-72">
          <Input
            placeholder="Search by reference, account..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            leftIcon={<Search className="w-4 h-4 text-neutral-400" />}
            className="py-1.5 text-xs"
          />
        </div>
      </div>

      {/* Transactions Table */}
      <Card padding="md">
        <Table
          columns={columns}
          data={filtered}
          keyExtractor={(t) => t.id}
          emptyMessage="No transaction records match the specified filters."
        />
      </Card>
    </div>
  );
};
