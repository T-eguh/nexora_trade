import React, { useState } from 'react';
import { Card } from '../../components/Card';
import { Badge } from '../../components/Badge';
import { Table, Column } from '../../components/Table';
import { Input } from '../../components/Input';
import { useTransactions } from '../../hooks/useStorage';
import { StorageService } from '../../utils/storage';
import { Transaction, TransactionStatus } from '../../types';
import { Search } from 'lucide-react';

export const AdminTransactionsPage: React.FC = () => {
  const { transactions } = useTransactions();
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('ALL');

  const filtered = transactions.filter((t) => {
    const ref = t.reference || t.id;
    const matchesSearch =
      ref.toLowerCase().includes(search.toLowerCase()) ||
      t.accountId.toLowerCase().includes(search.toLowerCase()) ||
      (t.description || '').toLowerCase().includes(search.toLowerCase());
    const matchesStatus = statusFilter === 'ALL' || t.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const handleUpdateStatus = (id: string, newStatus: TransactionStatus) => {
    StorageService.updateTransactionStatus(id, newStatus);
  };

  const columns: Column<Transaction>[] = [
    {
      header: 'Reference',
      render: (t) => <strong className="font-bold text-white font-mono">#{t.reference || t.id}</strong>,
    },
    {
      header: 'Account',
      render: (t) => <span className="font-mono text-neutral-300">{t.accountId}</span>,
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
          className={`font-mono font-bold ${
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
          variant={t.status === 'completed' || t.status === 'Approved' ? 'success' : t.status === 'pending' || t.status === 'Pending' ? 'warning' : 'danger'}
          size="sm"
        >
          {t.status.toUpperCase()}
        </Badge>
      ),
    },
    {
      header: 'Timestamp',
      render: (t) => (
        <span className="text-xs text-neutral-400 font-mono">
          {new Date(t.createdAt || t.timestamp || Date.now()).toLocaleString([], { dateStyle: 'short', timeStyle: 'short' })}
        </span>
      ),
    },
    {
      header: 'Actions',
      align: 'right',
      render: (t) => (
        <div className="flex items-center justify-end gap-1.5">
          {t.status === 'pending' || t.status === 'Pending' ? (
            <>
              <button
                onClick={() => handleUpdateStatus(t.id, 'completed')}
                className="px-2 py-1 text-[10px] font-bold bg-emerald-950/80 hover:bg-emerald-900 text-emerald-300 border border-emerald-800 rounded transition-colors cursor-pointer"
              >
                Approve
              </button>
              <button
                onClick={() => handleUpdateStatus(t.id, 'rejected')}
                className="px-2 py-1 text-[10px] font-bold bg-red-950/80 hover:bg-red-900 text-red-300 border border-red-800 rounded transition-colors cursor-pointer"
              >
                Reject
              </button>
            </>
          ) : (
            <span className="text-[10px] text-neutral-500 font-mono">Settled</span>
          )}
        </div>
      ),
    },
  ];

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-white tracking-tight">Financial Transactions</h1>
          <p className="text-xs text-neutral-400">
            Monitor client funding, instant deposits, and process withdrawal approvals.
          </p>
        </div>
      </div>

      <Card padding="md">
        <div className="flex flex-col md:flex-row items-center justify-between gap-4 mb-6">
          <div className="w-full md:w-80">
            <Input
              placeholder="Search reference, account, method..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              icon={<Search className="w-4 h-4 text-neutral-400" />}
            />
          </div>

          <div className="flex items-center gap-1.5 overflow-x-auto w-full md:w-auto">
            {['ALL', 'pending', 'completed', 'rejected'].map((st) => (
              <button
                key={st}
                onClick={() => setStatusFilter(st)}
                className={`px-3 py-1.5 rounded-lg text-xs font-bold font-mono transition-colors cursor-pointer whitespace-nowrap ${
                  statusFilter === st
                    ? 'bg-red-600 text-white'
                    : 'bg-[#151518] text-neutral-400 hover:text-white border border-neutral-800'
                }`}
              >
                {st.toUpperCase()}
              </button>
            ))}
          </div>
        </div>

        <Table
          columns={columns}
          data={filtered}
          keyExtractor={(item) => item.id}
          emptyMessage="No transactions found."
        />
      </Card>
    </div>
  );
};
