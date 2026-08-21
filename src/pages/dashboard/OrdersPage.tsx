import React, { useState } from 'react';
import { Card } from '../../components/Card';
import { Badge } from '../../components/Badge';
import { Button } from '../../components/Button';
import { Table, Column } from '../../components/Table';
import { Modal } from '../../components/Modal';
import { Input } from '../../components/Input';
import { Select } from '../../components/Select';
import { useOrders, useMarkets, useAccounts, useAuth } from '../../hooks/useStorage';
import { StorageService } from '../../utils/storage';
import { Order, OrderType } from '../../types';
import { Plus, CheckCircle2, Trash2 } from 'lucide-react';

export const OrdersPage: React.FC = () => {
  const { orders } = useOrders();
  const { markets } = useMarkets();
  const { accounts } = useAccounts();
  const { user } = useAuth();

  const [createModalOpen, setCreateModalOpen] = useState(false);
  const [symbol, setSymbol] = useState('EUR/USD');
  const [orderType, setOrderType] = useState<OrderType>('LIMIT_BUY');
  const [volume, setVolume] = useState('0.50');
  const [targetPrice, setTargetPrice] = useState('1.0820');
  const [sl, setSl] = useState('');
  const [tp, setTp] = useState('');
  const [successMsg, setSuccessMsg] = useState<string | null>(null);

  const primaryAccount = accounts.find((a) => a.userId === user?.id) || accounts[0];

  const handleCancelOrder = (id: string) => {
    StorageService.cancelOrder(id);
  };

  const handleCreateOrder = (e: React.FormEvent) => {
    e.preventDefault();
    const currentMarket = markets.find((m) => m.symbol === symbol);
    const currPrice = currentMarket ? currentMarket.bid : 1.085;

    const newOrder: Omit<Order, 'id' | 'createdAt'> = {
      accountId: primaryAccount?.accountNumber || primaryAccount?.accountId || '205128182',
      symbol,
      type: orderType,
      volume: parseFloat(volume) || 0.1,
      targetPrice: parseFloat(targetPrice) || 1.0,
      currentPrice: currPrice,
      sl: sl ? parseFloat(sl) : undefined,
      tp: tp ? parseFloat(tp) : undefined,
      status: 'pending',
    };

    StorageService.addOrder(newOrder);
    setSuccessMsg(`Order Tertunda ${orderType} pada ${symbol} berhasil dipasang!`);
    setTimeout(() => {
      setSuccessMsg(null);
      setCreateModalOpen(false);
    }, 1500);
  };

  const columns: Column<Order>[] = [
    {
      header: 'ID Order',
      render: (o) => <span className="font-bold text-white font-mono">#{o.id}</span>,
    },
    {
      header: 'Akun',
      render: (o) => <span className="font-mono text-neutral-400">{o.accountId}</span>,
    },
    {
      header: 'Simbol',
      render: (o) => <strong className="text-white text-xs">{o.symbol}</strong>,
    },
    {
      header: 'Tipe Order',
      render: (o) => (
        <Badge
          variant={o.type.includes('BUY') ? 'success' : 'danger'}
          size="sm"
        >
          {o.type.replace('_', ' ')}
        </Badge>
      ),
    },
    {
      header: 'Volume',
      render: (o) => <span className="font-mono">{o.volume.toFixed(2)} Lot</span>,
    },
    {
      header: 'Harga Target',
      align: 'right',
      render: (o) => <span className="font-mono font-bold text-white">{o.targetPrice.toFixed(4)}</span>,
    },
    {
      header: 'Harga Pasar',
      align: 'right',
      render: (o) => (
        <span className="font-mono text-neutral-400">
          {(o.currentPrice || o.targetPrice).toFixed(4)}
        </span>
      ),
    },
    {
      header: 'Status',
      render: (o) => (
        <Badge
          variant={o.status === 'pending' ? 'warning' : o.status === 'executed' ? 'success' : 'neutral'}
          size="sm"
        >
          {o.status === 'pending' ? 'TERTUNDA' : o.status === 'executed' ? 'DIEKSEKUSI' : 'DIBATALKAN'}
        </Badge>
      ),
    },
    {
      header: 'Aksi',
      align: 'right',
      render: (o) =>
        o.status === 'pending' ? (
          <button
            onClick={() => handleCancelOrder(o.id)}
            className="p-1.5 rounded bg-red-950/40 text-red-400 hover:bg-red-900 border border-red-800/80 transition-colors cursor-pointer"
            title="Batalkan Order"
          >
            <Trash2 className="w-4 h-4" />
          </button>
        ) : (
          <span className="text-[11px] text-neutral-500 font-mono">Selesai</span>
        ),
    },
  ];

  return (
    <div className="space-y-5 font-sans">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl font-bold text-white tracking-tight">Order Tertunda (Pending Orders)</h1>
          <p className="text-xs text-neutral-400">
            Atur limit dan stop trigger order yang akan dieksekusi saat harga pasar menyentuh target Anda.
          </p>
        </div>

        <Button onClick={() => setCreateModalOpen(true)} size="md">
          <Plus className="w-4 h-4 mr-1.5" /> Pasang Order Tertunda
        </Button>
      </div>

      <Card padding="md">
        <Table
          columns={columns}
          data={orders}
          keyExtractor={(o) => o.id}
          emptyMessage="Belum ada order tertunda aktif. Klik 'Pasang Order Tertunda' untuk membuat pesanan baru."
        />
      </Card>

      {/* Create Pending Order Modal */}
      <Modal
        isOpen={createModalOpen}
        onClose={() => setCreateModalOpen(false)}
        title="Buat Order Tertunda Baru"
      >
        {successMsg ? (
          <div className="p-6 text-center space-y-2">
            <CheckCircle2 className="w-8 h-8 text-emerald-400 mx-auto" />
            <p className="text-sm font-bold text-white">{successMsg}</p>
          </div>
        ) : (
          <form onSubmit={handleCreateOrder} className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <Select
                label="Instrumen Pasar"
                value={symbol}
                onChange={(e) => setSymbol(e.target.value)}
                options={markets.map((m) => ({ value: m.symbol, label: m.symbol }))}
              />

              <Select
                label="Tipe Order"
                value={orderType}
                onChange={(e) => setOrderType(e.target.value as OrderType)}
                options={[
                  { value: 'LIMIT_BUY', label: 'Buy Limit (Beli di bawah harga sekarang)' },
                  { value: 'LIMIT_SELL', label: 'Sell Limit (Jual di atas harga sekarang)' },
                  { value: 'STOP_BUY', label: 'Buy Stop (Breakout beli)' },
                  { value: 'STOP_SELL', label: 'Sell Stop (Breakout jual)' },
                ]}
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <Input
                label="Volume (Lot)"
                type="number"
                step="0.01"
                min="0.01"
                value={volume}
                onChange={(e) => setVolume(e.target.value)}
                required
              />

              <Input
                label="Harga Pemicu Target"
                type="number"
                step="any"
                value={targetPrice}
                onChange={(e) => setTargetPrice(e.target.value)}
                required
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <Input
                label="Stop Loss (Opsional)"
                type="number"
                step="any"
                value={sl}
                onChange={(e) => setSl(e.target.value)}
                placeholder="Contoh: 1.0780"
              />
              <Input
                label="Take Profit (Opsional)"
                type="number"
                step="any"
                value={tp}
                onChange={(e) => setTp(e.target.value)}
                placeholder="Contoh: 1.0920"
              />
            </div>

            <div className="pt-2 flex justify-end gap-2">
              <Button
                type="button"
                variant="secondary"
                onClick={() => setCreateModalOpen(false)}
              >
                Batal
              </Button>
              <Button type="submit">Pasang Order</Button>
            </div>
          </form>
        )}
      </Modal>
    </div>
  );
};
