import React, { useState } from 'react';
import { useTransactions } from '../../hooks/useStorage';
import { Transaction } from '../../types';
import { Search, ArrowDownCircle, ArrowUpCircle, Repeat } from 'lucide-react';

export const TransactionsPage: React.FC = () => {
  const { transactions } = useTransactions();
  const [search, setSearch] = useState('');
  const [typeFilter, setTypeFilter] = useState<string>('ALL');

  const filtered = transactions.filter((tx) => {
    const matchesSearch =
      (tx.id || '').toLowerCase().includes(search.toLowerCase()) ||
      (tx.accountId || '').toLowerCase().includes(search.toLowerCase()) ||
      (tx.description || '').toLowerCase().includes(search.toLowerCase());
    const matchesType = typeFilter === 'ALL' || tx.type === typeFilter;
    return matchesSearch && matchesType;
  });

  return (
    <div className="space-y-5 font-sans">
      <div className="space-y-1">
        <h1 className="text-xl sm:text-2xl font-bold text-neutral-900 tracking-tight">
          Riwayat Transaksi & Transfer Dana
        </h1>
        <p className="text-xs text-neutral-500">
          Catatan mutasi saldo akun trading, deposit, penarikan, dan penutupan order.
        </p>
      </div>

      {/* Filter and Search */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-3 bg-white p-3.5 rounded-xl border border-neutral-200 shadow-xs">
        <div className="flex items-center gap-1.5 overflow-x-auto w-full sm:w-auto">
          {[
            { id: 'ALL', label: 'Semua Transaksi' },
            { id: 'deposit', label: 'Setoran (Deposit)' },
            { id: 'withdrawal', label: 'Penarikan' },
            { id: 'transfer', label: 'Transfer / Trade' },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setTypeFilter(tab.id)}
              className={`px-3 py-1.5 text-xs font-bold rounded-lg transition-colors cursor-pointer whitespace-nowrap ${
                typeFilter === tab.id
                  ? 'bg-neutral-900 text-white'
                  : 'bg-neutral-100 text-neutral-600 hover:bg-neutral-200'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        <div className="w-full sm:w-64 relative">
          <Search className="w-3.5 h-3.5 text-neutral-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Cari transaksi..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-8 pr-3 py-1.5 text-xs bg-neutral-50 border border-neutral-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-emerald-600 text-neutral-900"
          />
        </div>
      </div>

      {/* Transactions Table */}
      <div className="bg-white rounded-xl border border-neutral-200 shadow-xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-xs text-left">
            <thead>
              <tr className="border-b border-neutral-200 bg-neutral-50 text-neutral-500 font-semibold text-[11px]">
                <th className="py-2.5 px-3.5">Waktu Transaksi</th>
                <th className="py-2.5 px-3">Akun</th>
                <th className="py-2.5 px-3">Jenis</th>
                <th className="py-2.5 px-3 text-right">Nominal</th>
                <th className="py-2.5 px-3">Status</th>
                <th className="py-2.5 px-3.5">Keterangan</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-neutral-100">
              {filtered.length === 0 ? (
                <tr>
                  <td colSpan={6} className="py-8 text-center text-xs text-neutral-500">
                    Tidak ada catatan transaksi yang sesuai.
                  </td>
                </tr>
              ) : (
                filtered.map((tx) => {
                  const isPositive = tx.type === 'deposit' || tx.amount > 0;
                  return (
                    <tr key={tx.id} className="hover:bg-neutral-50 transition-colors">
                      <td className="py-3 px-3.5 text-neutral-600 font-mono text-[11px]">
                        {new Date(tx.createdAt).toLocaleString('id-ID', {
                          day: '2-digit',
                          month: 'short',
                          year: 'numeric',
                          hour: '2-digit',
                          minute: '2-digit',
                        })}
                      </td>
                      <td className="py-3 px-3 font-mono font-bold text-neutral-800">
                        #{tx.accountId}
                      </td>
                      <td className="py-3 px-3">
                        <span
                          className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase ${
                            tx.type === 'deposit'
                              ? 'bg-emerald-100 text-emerald-800'
                              : tx.type === 'withdrawal'
                              ? 'bg-red-100 text-red-800'
                              : 'bg-blue-100 text-blue-800'
                          }`}
                        >
                          {tx.type === 'deposit'
                            ? 'Setoran'
                            : tx.type === 'withdrawal'
                            ? 'Penarikan'
                            : 'Transfer'}
                        </span>
                      </td>
                      <td className="py-3 px-3 text-right font-mono font-bold">
                        <span className={isPositive ? 'text-emerald-600' : 'text-red-600'}>
                          {isPositive ? '+' : '-'}${Math.abs(tx.amount).toFixed(2)} USD
                        </span>
                      </td>
                      <td className="py-3 px-3">
                        <span
                          className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                            tx.status === 'completed'
                              ? 'bg-emerald-100 text-emerald-800'
                              : tx.status === 'pending' || tx.status === 'Pending'
                              ? 'bg-amber-100 text-amber-800 border border-amber-300'
                              : 'bg-red-100 text-red-800'
                          }`}
                        >
                          {tx.status === 'completed'
                            ? 'BERHASIL'
                            : tx.status === 'pending' || tx.status === 'Pending'
                            ? 'MENUNGGU KONFIRMASI'
                            : 'DITOLAK'}
                        </span>
                      </td>
                      <td className="py-3 px-3.5 text-neutral-600 text-[11px] max-w-xs truncate">
                        {tx.description}
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
