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
import { Plus, CheckCircle2, ListOrdered, Trash2 } from 'lucide-react';

export const OrdersPage: React.FC = () => {
  const { orders } = useOrders();
  const { markets } = useMarkets();
  const { accounts } = useAccounts();
  const { user } = useAuth();

  const [createModalOpen, setCreateModalOpen] = useState(false);
  const [symbol, setSymbol] = useState('EUR/USD');
  const [orderType, setOrderType] = useState<OrderType>('BUY_LIMIT');
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
      accountId: primaryAccount?.accountNumber || 'NX-894102',
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
    setSuccessMsg(`Pending ${orderType} on ${symbol} placed successfully!`);
    setTimeout(() => {
      setSuccessMsg(null);
      setCreateModalOpen(false);
    }, 1500);
  };

  const columns: Column<Order>[] = [
    {
      header: 'Order ID',
      render: (o) => <span className="font-bold text-white font-mono-num">#{o.id}</span>,
    },
    {
      header: 'Account',
      render: (o) => <span className="font-mono-num text-neutral-400">{o.accountId}</span>,
    },
    {
      header: 'Symbol',
      render: (o) => <strong className="text-white text-sm">{o.symbol}</strong>,
    },
    {
      header: 'Order Type',
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
      render: (o) => <span className="font-mono-num">{o.volume.toFixed(2)} Lots</span>,
    },
    {
      header: 'Target Price',
      align: 'right',
      render: (o) => <span className="font-mono-num font-bold text-white">{o.targetPrice.toFixed(4)}</span>,
    },
    {
      header: 'Market Price',
      align: 'right',
      render: (o) => <span className="font-mono-num text-neutral-400">{o.currentPrice.toFixed(4)}</span>,
    },
    {
      header: 'Status',
      render: (o) => (
        <Badge
          variant={o.status === 'pending' ? 'warning' : o.status === 'executed' ? 'success' : 'neutral'}
          size="sm"
        >
          {o.status.toUpperCase()}
        </Badge>
      ),
    },
    {
      header: 'Action',
      align: 'right',
      render: (o) =>
        o.status === 'pending' ? (
          <button
            onClick={() => handleCancelOrder(o.id)}
            className="p-1.5 rounded bg-red-950/40 text-red-400 hover:bg-red-900 border border-red-800/80 transition-colors cursor-pointer"
            title="Cancel Order"
          >
            <Trash2 className="w-4 h-4" />
          </button>
        ) : (
          <span className="text-[11px] text-neutral-500 font-mono-num">Completed</span>
        ),
    },
  ];

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-white tracking-tight">Pending Orders</h1>
          <p className="text-xs text-neutral-400">
            Set limit and stop entry trigger orders that execute when the market reaches your target price.
          </p>
        </div>

        <Button onClick={() => setCreateModalOpen(true)} size="md">
          <Plus className="w-4 h-4 mr-1.5" /> Place Pending Order
        </Button>
      </div>

      <Card padding="md">
        <Table
          columns={columns}
          data={orders}
          keyExtractor={(o) => o.id}
          emptyMessage="No pending orders active. Click 'Place Pending Order' to create a new entry rule."
        />
      </Card>

      {/* Create Pending Order Modal */}
      <Modal
        isOpen={createModalOpen}
        onClose={() => setCreateModalOpen(false)}
        title="Create Pending Entry Order"
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
                label="Instrument"
                value={symbol}
                onChange={(e) => setSymbol(e.target.value)}
                options={markets.map((m) => ({ value: m.symbol, label: m.symbol }))}
              />

              <Select
                label="Order Type"
                value={orderType}
                onChange={(e) => setOrderType(e.target.value as OrderType)}
                options={[
                  { value: 'BUY_LIMIT', label: 'Buy Limit (Buy below current)' },
                  { value: 'SELL_LIMIT', label: 'Sell Limit (Sell above current)' },
                  { value: 'BUY_STOP', label: 'Buy Stop (Breakout buy)' },
                  { value: 'SELL_STOP', label: 'Sell Stop (Breakout sell)' },
                ]}
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <Input
                label="Volume (Lots)"
                type="number"
                step="0.01"
                min="0.01"
                value={volume}
                onChange={(e) => setVolume(e.target.value)}
                required
              />

              <Input
                label="Target Trigger Price"
                type="number"
                step="any"
                value={targetPrice}
                onChange={(e) => setTargetPrice(e.target.value)}
                required
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <Input
                label="Stop Loss (Optional)"
                type="number"
                step="any"
                value={sl}
                onChange={(e) => setSl(e.target.value)}
                placeholder="e.g. 1.0780"
              />
              <Input
                label="Take Profit (Optional)"
                type="number"
                step="any"
                value={tp}
                onChange={(e) => setTp(e.target.value)}
                placeholder="e.g. 1.0920"
              />
            </div>

            <div className="pt-2 flex justify-end gap-2">
              <Button
                type="button"
                variant="secondary"
                onClick={() => setCreateModalOpen(false)}
              >
                Cancel
              </Button>
              <Button type="submit">Submit Pending Order</Button>
            </div>
          </form>
        )}
      </Modal>
    </div>
  );
};
