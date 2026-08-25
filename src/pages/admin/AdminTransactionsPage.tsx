import React, { useState } from 'react';
import { Card } from '../../components/Card';
import { Badge } from '../../components/Badge';
import { Table, Column } from '../../components/Table';
import { Input } from '../../components/Input';
import { useTransactions, useAccounts } from '../../hooks/useStorage';
import { StorageService } from '../../utils/storage';
import { Transaction, TransactionStatus } from '../../types';
import { Search, CheckCircle, XCircle, AlertTriangle, ArrowDownCircle, ArrowUpCircle } from 'lucide-react';

export const AdminTransactionsPage: React.FC = () => {
  const { transactions } = useTransactions();
  const { accounts } = useAccounts();
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('ALL');
  const [actionFeedback, setActionFeedback] = useState<string | null>(null);

  const filtered = transactions.filter((t) => {
    const ref = t.reference || t.id;
    const matchesSearch =
      ref.toLowerCase().includes(search.toLowerCase()) ||
      t.accountId.toLowerCase().includes(search.toLowerCase()) ||
      (t.description || '').toLowerCase().includes(search.toLowerCase());
    const matchesStatus = statusFilter === 'ALL' || t.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const pendingCount = transactions.filter((t) => t.status === 'pending' || t.status === 'Pending').length;

  const handleUpdateStatus = (id: string, newStatus: TransactionStatus, tx: Transaction) => {
    StorageService.updateTransactionStatus(id, newStatus);
    if (newStatus === 'completed') {
      setActionFeedback(`Deposit #${tx.reference || tx.id} sebesar $${Math.abs(tx.amount).toFixed(2)} USD berhasil disetujui dan saldo dikreditkan ke Akun #${tx.accountId}!`);
    } else {
      setActionFeedback(`Transaksi #${tx.reference || tx.id} telah ditolak.`);
    }
    setTimeout(() => setActionFeedback(null), 4000);
  };

  const columns: Column<Transaction>[] = [
    {
      header: 'Reference',
      render: (t) => (
        <div>
          <strong className="font-bold text-white font-mono block">#{t.reference || t.id}</strong>
          <span className="text-[10px] text-neutral-400 font-mono">
            {new Date(t.createdAt || t.timestamp || Date.now()).toLocaleString([], { dateStyle: 'short', timeStyle: 'short' })}
          </span>
        </div>
      ),
    },
    {
      header: 'Account',
      render: (t) => (
        <span className="font-mono text-emerald-400 font-bold bg-emerald-950/60 px-2 py-0.5 rounded border border-emerald-800/60">
          #{t.accountId}
        </span>
      ),
    },
    {
      header: 'Type & Description',
      render: (t) => {
        const variant =
          t.type === 'deposit' ? 'success' : t.type === 'withdrawal' ? 'danger' : 'neutral';
        return (
          <div className="space-y-0.5">
            <div className="flex items-center gap-1.5">
              <Badge variant={variant} size="sm">{t.type.toUpperCase()}</Badge>
              {t.type === 'deposit' && <span className="text-[10px] text-neutral-400">QRIS / Instant Pay</span>}
            </div>
            <p className="text-[11px] text-neutral-300 truncate max-w-xs">{t.description || '-'}</p>
          </div>
        );
      },
    },
    {
      header: 'Amount',
      align: 'right',
      render: (t) => (
        <div>
          <span
            className={`font-mono font-bold text-sm ${
              t.amount > 0 ? 'text-emerald-400' : 'text-red-400'
            }`}
          >
            {t.amount > 0 ? '+' : '-'}${Math.abs(t.amount).toLocaleString('en-US', { minimumFractionDigits: 2 })} USD
          </span>
        </div>
      ),
    },
    {
      header: 'Status',
      render: (t) => {
        const isPending = t.status === 'pending' || t.status === 'Pending';
        const isCompleted = t.status === 'completed' || t.status === 'Approved';
        return (
          <Badge
            variant={isCompleted ? 'success' : isPending ? 'warning' : 'danger'}
            size="sm"
          >
            {isPending ? 'PENDING APPROVAL' : t.status.toUpperCase()}
          </Badge>
        );
      },
    },
    {
      header: 'Action / Admin Approval',
      align: 'right',
      render: (t) => (
        <div className="flex items-center justify-end gap-2">
          {t.status === 'pending' || t.status === 'Pending' ? (
            <>
              <button
                onClick={() => handleUpdateStatus(t.id, 'completed', t)}
                className="px-3 py-1.5 text-xs font-bold bg-emerald-600 hover:bg-emerald-500 text-white rounded-lg transition-all shadow cursor-pointer flex items-center gap-1 active:scale-95"
                title="Setujui dan masukkan saldo USD ke akun pengguna"
              >
                <CheckCircle className="w-3.5 h-3.5" />
                <span>Approve & Kreditkan</span>
              </button>
              <button
                onClick={() => handleUpdateStatus(t.id, 'rejected', t)}
                className="px-2.5 py-1.5 text-xs font-bold bg-red-900/60 hover:bg-red-800 text-red-300 border border-red-700/60 rounded-lg transition-colors cursor-pointer flex items-center gap-1"
                title="Tolak deposit"
              >
                <XCircle className="w-3.5 h-3.5" />
                <span>Reject</span>
              </button>
            </>
          ) : (
            <span className="text-xs text-neutral-500 font-mono">
              {t.status === 'completed' ? '✓ Credited' : '✕ Rejected'}
            </span>
          )}
        </div>
      ),
    },
  ];

  return (
    <div className="space-y-6">
      {/* Toast Feedback */}
      {actionFeedback && (
        <div className="p-4 bg-emerald-900/90 border border-emerald-500 text-emerald-100 rounded-xl font-medium text-xs sm:text-sm flex items-center gap-2 shadow-xl animate-fadeIn">
          <CheckCircle className="w-5 h-5 text-emerald-300 shrink-0" />
          <span>{actionFeedback}</span>
        </div>
      )}

      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-2xl font-bold text-white tracking-tight">Manajemen Deposit & Transaksi</h1>
            {pendingCount > 0 && (
              <span className="px-2.5 py-0.5 rounded-full bg-amber-500/20 text-amber-300 border border-amber-500/40 text-xs font-bold animate-pulse">
                {pendingCount} Menunggu Konfirmasi
              </span>
            )}
          </div>
          <p className="text-xs text-neutral-400 mt-0.5">
            Kelola verifikasi setoran QRIS, konfirmasi pembayaran pengguna, dan otorisasi penarikan dana.
          </p>
        </div>
      </div>

      {/* Pending Banner Alert if any pending deposits */}
      {pendingCount > 0 && (
        <div className="p-4 bg-amber-500/10 border border-amber-500/40 rounded-2xl flex items-center justify-between gap-4 text-amber-200">
          <div className="flex items-center gap-3">
            <AlertTriangle className="w-5 h-5 text-amber-400 shrink-0" />
            <div>
              <strong className="text-sm text-amber-300 block">Ada {pendingCount} Permintaan Deposit QRIS Menunggu Persetujuan</strong>
              <span className="text-xs text-neutral-300">
                Klik tombol <strong>"Approve & Kreditkan"</strong> pada baris transaksi untuk menyetujui mutasi dan menambah saldo akun trader secara otomatis.
              </span>
            </div>
          </div>
          <button
            onClick={() => setStatusFilter('pending')}
            className="px-3 py-1.5 bg-amber-500 text-neutral-950 font-bold text-xs rounded-lg hover:bg-amber-400 transition-colors whitespace-nowrap cursor-pointer"
          >
            Filter Pending
          </button>
        </div>
      )}

      <Card padding="md">
        <div className="flex flex-col md:flex-row items-center justify-between gap-4 mb-6">
          <div className="w-full md:w-80">
            <Input
              placeholder="Cari referensi, no akun, deskripsi..."
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
          emptyMessage="Tidak ada transaksi yang sesuai kriteria filter."
        />
      </Card>
    </div>
  );
};
