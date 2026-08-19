import React, { useState } from 'react';
import { Card } from '../../components/Card';
import { Badge } from '../../components/Badge';
import { Table, Column } from '../../components/Table';
import { Input } from '../../components/Input';
import { useTransactions } from '../../hooks/useStorage';
import { StorageService } from '../../utils/storage';
import { Transaction } from '../../types';
import { Search, CheckCircle, XCircle, CheckCircle2 } from 'lucide-react';

export const AdminTransactionsPage: React.FC = () => {
  const { transactions } = useTransactions();
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('ALL');

  const filtered = transactions.filter((t) => {
    const matchesSearch =
      t.reference.toLowerCase().includes(search.toLowerCase()) ||
      t.accountId.toLowerCase().includes(search.toLowerCase()) ||
      (t.description || '').toLowerCase().includes(search.toLowerCase());
    const matchesStatus = statusFilter === 'ALL' || t.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const handleUpdateStatus = (id: string, newStatus: 'completed' | 'failed' | 'pending') => {
    StorageService.updateTransactionStatus(id, newStatus);
  };

  const columns: Column<Transaction>[] = [
    {
      header: 'Reference',
      render: (t) => <strong className="font-bold text-white font-mono-num">#{t.reference}</strong>,
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
        return <Badge variant={variant} size="sm">{t.type.toUpperCase()}</Badge>;
      },
    },
    {
      header: 'Amount',
      align: 'right',
      render: (t) => (
        <span
          className={`font-mono-num font-bold ${
            t.amount > 0 ? 'text-emerald-400' : 'text-red-400'
          }`}
        >
          {t.amount > 0 ? '+' : '-'}${Math.abs(t.amount).toLocaleString('en-US', { minimumFractionDigits: 2 })}
        </span>
      ),
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
      header: 'Timestamp',
      render: (t) => (
        <span className="text-xs text-neutral-400 font-mono-num">
          {new Date(t.timestamp).toLocaleString([], { dateStyle: 'short', timeStyle: 'short' })}
        </span>
      ),
    },
    {
      header: 'Actions',
      align: 'right',
      render: (t) => (
        <div className="flex items-center justify-end gap-1.5">
          {t.status === 'pending' ? (
            <>
              <button
                onClick={() => handleUpdateStatus(t.id, 'completed')}
                className="px-2 py-1 text-[10px] font-bold bg-emerald-950/80 hover:bg-emerald-900 text-emerald-300 border border-emerald-800 rounded transition-colors cursor-pointer"
              >
                Approve
              </button>
              <button
                onClick={() => handleUpdateStatus(t.id, 'failed')}
                className="px-2 py-1 text-[10px] font-bold bg-red-950/80 hover:bg-red-900 text-red-300 border border-red-800 rounded transition-colors cursor-pointer"
              >
                Reject
              </button>
            </>
          ) : (
            <span className="text-[10px] text-neutral-500 font-mono-num">Settled</span>
          )}
        </div>
      ),
    },
  ];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-white tracking-tight">System Transactions</h1>
        <p className="text-xs text-neutral-400">
          Complete audit ledger of demo fund flows, payment authorizations, and trade settlements.
        </p>
      </div>

      <div className="bg-[#0D0D0F] p-4 rounded-xl border border-neutral-800 flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="w-full sm:w-80">
          <Input
            placeholder="Search reference, account #..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            leftIcon={<Search className="w-4 h-4 text-neutral-400" />}
            className="py-1.5 text-xs"
          />
        </div>

        <div className="flex items-center gap-1.5 overflow-x-auto">
          {['ALL', 'completed', 'pending', 'failed'].map((st) => (
            <button
              key={st}
              onClick={() => setStatusFilter(st)}
              className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-colors cursor-pointer uppercase ${
                statusFilter === st
                  ? 'bg-red-600 text-white'
                  : 'bg-[#151518] text-neutral-400 hover:text-white border border-neutral-800'
              }`}
            >
              {st}
            </button>
          ))}
        </div>
      </div>

      <Card padding="md">
        <Table
          columns={columns}
          data={filtered}
          keyExtractor={(t) => t.id}
        />
      </Card>
    </div>
  );
};
