import React, { useState } from 'react';
import { usePositions } from '../../hooks/useStorage';
import { StorageService } from '../../utils/storage';
import { Position } from '../../types';
import { CheckCircle2, X } from 'lucide-react';

export const PositionsPage: React.FC = () => {
  const { positions } = usePositions();
  const [tab, setTab] = useState<'open' | 'closed'>('open');

  const [editingPosition, setEditingPosition] = useState<Position | null>(null);
  const [sl, setSl] = useState('');
  const [tp, setTp] = useState('');
  const [saveMsg, setSaveMsg] = useState<string | null>(null);

  const openPositions = positions.filter((p) => p.status === 'open');
  const closedPositions = positions.filter((p) => p.status === 'closed');
  const displayed = tab === 'open' ? openPositions : closedPositions;

  const totalOpenPnl = openPositions.reduce((acc, p) => acc + p.pnl, 0);
  const totalOpenLots = openPositions.reduce((acc, p) => acc + p.volume, 0);
  const totalClosedPnl = closedPositions.reduce((acc, p) => acc + p.pnl, 0);

  const handleClose = (id: string) => {
    StorageService.closePosition(id);
  };

  const handleSaveProtection = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingPosition) return;

    StorageService.updatePosition(editingPosition.id, {
      sl: sl ? parseFloat(sl) : undefined,
      tp: tp ? parseFloat(tp) : undefined,
    });

    setSaveMsg('Batas perlindungan SL / TP berhasil diperbarui.');
    setTimeout(() => {
      setEditingPosition(null);
      setSaveMsg(null);
    }, 1200);
  };

  const openEditModal = (pos: Position) => {
    setEditingPosition(pos);
    setSl(pos.sl?.toString() || '');
    setTp(pos.tp?.toString() || '');
    setSaveMsg(null);
  };

  return (
    <div className="space-y-6 font-sans">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="space-y-1">
          <h1 className="text-xl sm:text-2xl font-bold text-neutral-900 tracking-tight">
            Posisi & Riwayat Trading
          </h1>
          <p className="text-xs text-neutral-500">
            Pantau posisi pasar aktif secara real-time dan tinjau laporan transaksi yang telah ditutup.
          </p>
        </div>

        {/* Tab switcher */}
        <div className="flex items-center gap-1 bg-white p-1 rounded-xl border border-neutral-200 shadow-xs">
          <button
            onClick={() => setTab('open')}
            className={`px-3.5 py-1.5 text-xs font-bold rounded-lg transition-colors cursor-pointer ${
              tab === 'open'
                ? 'bg-neutral-900 text-white'
                : 'text-neutral-600 hover:text-neutral-900'
            }`}
          >
            Posisi Terbuka ({openPositions.length})
          </button>
          <button
            onClick={() => setTab('closed')}
            className={`px-3.5 py-1.5 text-xs font-bold rounded-lg transition-colors cursor-pointer ${
              tab === 'closed'
                ? 'bg-neutral-900 text-white'
                : 'text-neutral-600 hover:text-neutral-900'
            }`}
          >
            Posisi Ditutup ({closedPositions.length})
          </button>
        </div>
      </div>

      {/* Summary strip */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
        <div className="bg-white p-3.5 rounded-xl border border-neutral-200 shadow-xs">
          <span className="text-[11px] text-neutral-500 font-medium block">P/L Mengambang</span>
          <strong
            className={`text-lg font-mono ${
              totalOpenPnl >= 0 ? 'text-emerald-600' : 'text-red-600'
            }`}
          >
            {totalOpenPnl >= 0 ? '+' : ''}${totalOpenPnl.toFixed(2)} USD
          </strong>
        </div>

        <div className="bg-white p-3.5 rounded-xl border border-neutral-200 shadow-xs">
          <span className="text-[11px] text-neutral-500 font-medium block">Total Volume Lot Aktif</span>
          <strong className="text-lg font-mono text-neutral-900">
            {totalOpenLots.toFixed(2)} Lots
          </strong>
        </div>

        <div className="bg-white p-3.5 rounded-xl border border-neutral-200 shadow-xs">
          <span className="text-[11px] text-neutral-500 font-medium block">Total Profit Realisasi</span>
          <strong
            className={`text-lg font-mono ${
              totalClosedPnl >= 0 ? 'text-emerald-600' : 'text-red-600'
            }`}
          >
            {totalClosedPnl >= 0 ? '+' : ''}${totalClosedPnl.toFixed(2)} USD
          </strong>
        </div>
      </div>

      {/* Main Table */}
      <div className="bg-white rounded-xl border border-neutral-200 shadow-xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-xs text-left">
            <thead>
              <tr className="border-b border-neutral-200 bg-neutral-50 text-neutral-500 font-semibold text-[11px]">
                <th className="py-2.5 px-3.5">Simbol</th>
                <th className="py-2.5 px-3">Tipe</th>
                <th className="py-2.5 px-3">Volume</th>
                <th className="py-2.5 px-3 text-right">Harga Buka</th>
                <th className="py-2.5 px-3 text-right">Harga Terkini</th>
                <th className="py-2.5 px-3 text-right">SL / TP</th>
                <th className="py-2.5 px-3 text-right">Profit / Rugi</th>
                <th className="py-2.5 px-3.5 text-right">Aksi</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-neutral-100">
              {displayed.length === 0 ? (
                <tr>
                  <td colSpan={8} className="py-8 text-center text-xs text-neutral-500">
                    {tab === 'open'
                      ? 'Tidak ada posisi trading yang sedang aktif.'
                      : 'Belum ada riwayat transaksi yang ditutup.'}
                  </td>
                </tr>
              ) : (
                displayed.map((p) => {
                  const isPos = p.pnl >= 0;
                  return (
                    <tr key={p.id} className="hover:bg-neutral-50 transition-colors">
                      <td className="py-3 px-3.5 font-bold font-mono text-neutral-900">
                        {p.symbol}
                      </td>
                      <td className="py-3 px-3">
                        <span
                          className={`px-2 py-0.5 rounded text-[10px] font-black ${
                            p.type === 'BUY'
                              ? 'bg-emerald-100 text-emerald-800'
                              : 'bg-red-100 text-red-800'
                          }`}
                        >
                          {p.type}
                        </span>
                      </td>
                      <td className="py-3 px-3 font-mono font-bold text-neutral-800">
                        {p.volume.toFixed(2)} Lot
                      </td>
                      <td className="py-3 px-3 text-right font-mono text-neutral-700">
                        {p.openPrice.toFixed(4)}
                      </td>
                      <td className="py-3 px-3 text-right font-mono text-neutral-700">
                        {(p.closePrice || p.currentPrice).toFixed(4)}
                      </td>
                      <td className="py-3 px-3 text-right font-mono text-neutral-500 text-[11px]">
                        {p.sl ? `SL: ${p.sl}` : '-'} / {p.tp ? `TP: ${p.tp}` : '-'}
                      </td>
                      <td className="py-3 px-3 text-right font-mono font-bold">
                        <span className={isPos ? 'text-emerald-600' : 'text-red-600'}>
                          {isPos ? '+' : ''}${p.pnl.toFixed(2)} USD
                        </span>
                      </td>
                      <td className="py-3 px-3.5 text-right">
                        {p.status === 'open' ? (
                          <div className="flex items-center justify-end gap-1.5">
                            <button
                              type="button"
                              onClick={() => openEditModal(p)}
                              className="px-2.5 py-1 rounded bg-neutral-100 hover:bg-neutral-200 text-neutral-700 font-bold text-[11px]"
                            >
                              Ubah
                            </button>
                            <button
                              type="button"
                              onClick={() => handleClose(p.id)}
                              className="px-2.5 py-1 rounded bg-red-600 hover:bg-red-700 text-white font-bold text-[11px]"
                            >
                              Tutup
                            </button>
                          </div>
                        ) : (
                          <span className="text-[11px] text-neutral-400 font-mono">
                            Ditutup
                          </span>
                        )}
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Edit SL / TP Modal */}
      {editingPosition && (
        <div className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-sm w-full p-5 space-y-4 shadow-2xl animate-scaleUp">
            <div className="flex items-center justify-between border-b border-neutral-200 pb-2.5">
              <h3 className="text-sm font-bold text-neutral-900">
                Atur SL / TP — {editingPosition.symbol}
              </h3>
              <button
                type="button"
                onClick={() => setEditingPosition(null)}
                className="text-neutral-400 hover:text-neutral-700"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {saveMsg ? (
              <div className="py-4 text-center space-y-2">
                <CheckCircle2 className="w-8 h-8 text-emerald-600 mx-auto" />
                <p className="text-xs font-bold text-neutral-900">{saveMsg}</p>
              </div>
            ) : (
              <form onSubmit={handleSaveProtection} className="space-y-3 text-xs">
                <div>
                  <label className="block text-neutral-700 font-semibold mb-1">
                    Stop Loss (SL)
                  </label>
                  <input
                    type="number"
                    step="any"
                    value={sl}
                    onChange={(e) => setSl(e.target.value)}
                    placeholder="Contoh: 1.1520"
                    className="w-full p-2.5 border border-neutral-300 rounded-lg font-mono"
                  />
                </div>

                <div>
                  <label className="block text-neutral-700 font-semibold mb-1">
                    Take Profit (TP)
                  </label>
                  <input
                    type="number"
                    step="any"
                    value={tp}
                    onChange={(e) => setTp(e.target.value)}
                    placeholder="Contoh: 1.1650"
                    className="w-full p-2.5 border border-neutral-300 rounded-lg font-mono"
                  />
                </div>

                <div className="pt-2 flex gap-2">
                  <button
                    type="button"
                    onClick={() => setEditingPosition(null)}
                    className="flex-1 py-2.5 bg-neutral-100 hover:bg-neutral-200 text-neutral-700 font-bold rounded-lg"
                  >
                    Batal
                  </button>
                  <button
                    type="submit"
                    className="flex-1 py-2.5 bg-neutral-900 hover:bg-black text-white font-bold rounded-lg shadow"
                  >
                    Simpan
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      )}
    </div>
  );
};
