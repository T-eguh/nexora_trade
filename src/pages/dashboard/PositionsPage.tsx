import React, { useState } from 'react';
import { Card } from '../../components/Card';
import { Badge } from '../../components/Badge';
import { Button } from '../../components/Button';
import { Table, Column } from '../../components/Table';
import { Modal } from '../../components/Modal';
import { Input } from '../../components/Input';
import { usePositions } from '../../hooks/useStorage';
import { StorageService } from '../../utils/storage';
import { Position } from '../../types';
import { BarChart2, CheckCircle2, TrendingUp, XCircle } from 'lucide-react';

export const PositionsPage: React.FC = () => {
  const { positions } = usePositions();
  const [tab, setTab] = useState<'open' | 'closed'>('open');

  // Edit SL/TP state
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

    setSaveMsg('Protection levels updated.');
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

  const columns: Column<Position>[] = [
    {
      header: 'ID / Account',
      render: (p) => (
        <div>
          <span className="font-bold text-white font-mono-num">#{p.id}</span>
          <span className="block text-[11px] text-neutral-400 font-mono-num">{p.accountId}</span>
        </div>
      ),
    },
    {
      header: 'Symbol',
      render: (p) => <strong className="font-bold text-white text-sm">{p.symbol}</strong>,
    },
    {
      header: 'Type',
      render: (p) => (
        <Badge variant={p.type === 'BUY' ? 'success' : 'danger'} size="sm">
          {p.type}
        </Badge>
      ),
    },
    {
      header: 'Volume',
      render: (p) => <span className="font-mono-num">{p.volume.toFixed(2)} Lots</span>,
    },
    {
      header: 'Open Price',
      align: 'right',
      render: (p) => <span className="font-mono-num text-neutral-300">{p.openPrice.toFixed(4)}</span>,
    },
    {
      header: 'Current / Close',
      align: 'right',
      render: (p) => (
        <span className="font-mono-num text-neutral-300">
          {(p.closePrice || p.currentPrice).toFixed(4)}
        </span>
      ),
    },
    {
      header: 'S / L',
      align: 'right',
      render: (p) => (
        <span className="font-mono-num text-neutral-400">{p.sl ? p.sl.toFixed(4) : '-'}</span>
      ),
    },
    {
      header: 'T / P',
      align: 'right',
      render: (p) => (
        <span className="font-mono-num text-neutral-400">{p.tp ? p.tp.toFixed(4) : '-'}</span>
      ),
    },
    {
      header: 'Profit / Loss',
      align: 'right',
      render: (p) => {
        const isPos = p.pnl >= 0;
        return (
          <span
            className={`font-mono-num font-bold text-sm ${
              isPos ? 'text-emerald-400' : 'text-red-400'
            }`}
          >
            {isPos ? '+' : ''}${p.pnl.toFixed(2)}
          </span>
        );
      },
    },
    {
      header: 'Actions',
      align: 'right',
      render: (p) =>
        p.status === 'open' ? (
          <div className="flex items-center justify-end gap-1.5">
            <button
              onClick={() => openEditModal(p)}
              className="text-[11px] px-2 py-1 bg-[#151518] hover:bg-neutral-800 text-neutral-300 rounded border border-neutral-800 transition-colors cursor-pointer"
            >
              Edit
            </button>
            <button
              onClick={() => handleClose(p.id)}
              className="text-[11px] px-2 py-1 bg-red-950/60 hover:bg-red-900/80 text-red-300 rounded border border-red-800/80 transition-colors cursor-pointer"
            >
              Close
            </button>
          </div>
        ) : (
          <span className="text-[11px] text-neutral-500 font-mono-num">
            {p.closeTime ? new Date(p.closeTime).toLocaleTimeString() : 'Closed'}
          </span>
        ),
    },
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-white tracking-tight">Trading Positions</h1>
          <p className="text-xs text-neutral-400">
            Real-time tracking of active market exposure and settled trade statements.
          </p>
        </div>

        {/* Tab switcher */}
        <div className="flex items-center gap-1 bg-[#0D0D0F] p-1 rounded-xl border border-neutral-800">
          <button
            onClick={() => setTab('open')}
            className={`px-4 py-1.5 text-xs font-bold rounded-lg transition-colors cursor-pointer ${
              tab === 'open'
                ? 'bg-red-600 text-white'
                : 'text-neutral-400 hover:text-white'
            }`}
          >
            Open Positions ({openPositions.length})
          </button>
          <button
            onClick={() => setTab('closed')}
            className={`px-4 py-1.5 text-xs font-bold rounded-lg transition-colors cursor-pointer ${
              tab === 'closed'
                ? 'bg-red-600 text-white'
                : 'text-neutral-400 hover:text-white'
            }`}
          >
            Closed Trades ({closedPositions.length})
          </button>
        </div>
      </div>

      {/* Summary bar */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 font-mono-num">
        <Card padding="sm" className="bg-[#0D0D0F]">
          <span className="text-[11px] text-neutral-400 uppercase">Floating P/L</span>
          <p
            className={`text-xl font-bold ${
              totalOpenPnl >= 0 ? 'text-emerald-400' : 'text-red-400'
            }`}
          >
            {totalOpenPnl >= 0 ? '+' : ''}${totalOpenPnl.toFixed(2)}
          </p>
        </Card>
        <Card padding="sm" className="bg-[#0D0D0F]">
          <span className="text-[11px] text-neutral-400 uppercase">Total Exposure</span>
          <p className="text-xl font-bold text-white">{totalOpenLots.toFixed(2)} Lots</p>
        </Card>
        <Card padding="sm" className="bg-[#0D0D0F]">
          <span className="text-[11px] text-neutral-400 uppercase">Realized History P/L</span>
          <p
            className={`text-xl font-bold ${
              totalClosedPnl >= 0 ? 'text-emerald-400' : 'text-red-400'
            }`}
          >
            {totalClosedPnl >= 0 ? '+' : ''}${totalClosedPnl.toFixed(2)}
          </p>
        </Card>
      </div>

      {/* Main Table */}
      <Card padding="md">
        <Table
          columns={columns}
          data={displayed}
          keyExtractor={(p) => p.id}
          emptyMessage={
            tab === 'open'
              ? 'No open positions currently active.'
              : 'No closed trades recorded yet.'
          }
        />
      </Card>

      {/* Edit SL / TP Modal */}
      {editingPosition && (
        <Modal
          isOpen={!!editingPosition}
          onClose={() => setEditingPosition(null)}
          title={`Modify Order #${editingPosition.id} — ${editingPosition.symbol}`}
        >
          {saveMsg ? (
            <div className="p-6 text-center space-y-2">
              <CheckCircle2 className="w-8 h-8 text-emerald-400 mx-auto" />
              <p className="text-sm font-bold text-white">{saveMsg}</p>
            </div>
          ) : (
            <form onSubmit={handleSaveProtection} className="space-y-4">
              <div className="p-3 bg-[#151518] rounded-lg border border-neutral-800 text-xs font-mono-num space-y-1">
                <div className="flex justify-between">
                  <span className="text-neutral-400">Entry Price:</span>
                  <span className="text-white font-bold">{editingPosition.openPrice}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-neutral-400">Current Market:</span>
                  <span className="text-emerald-400 font-bold">{editingPosition.currentPrice}</span>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <Input
                  label="Stop Loss (SL)"
                  type="number"
                  step="any"
                  value={sl}
                  onChange={(e) => setSl(e.target.value)}
                  placeholder="e.g. 1.0800"
                />
                <Input
                  label="Take Profit (TP)"
                  type="number"
                  step="any"
                  value={tp}
                  onChange={(e) => setTp(e.target.value)}
                  placeholder="e.g. 1.0950"
                />
              </div>

              <div className="flex justify-end gap-2 pt-2">
                <Button
                  type="button"
                  variant="secondary"
                  onClick={() => setEditingPosition(null)}
                >
                  Cancel
                </Button>
                <Button type="submit">Update Protection</Button>
              </div>
            </form>
          )}
        </Modal>
      )}
    </div>
  );
};
