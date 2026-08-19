import React, { useState } from 'react';
import { Card } from '../../components/Card';
import { Badge } from '../../components/Badge';
import { Button } from '../../components/Button';
import { Table, Column } from '../../components/Table';
import { Modal } from '../../components/Modal';
import { Input } from '../../components/Input';
import { Select } from '../../components/Select';
import { useMarkets } from '../../hooks/useStorage';
import { StorageService } from '../../utils/storage';
import { Market, MarketCategory } from '../../types';
import { TrendingUp, Plus, Edit2, Search, CheckCircle2 } from 'lucide-react';

export const AdminMarketsPage: React.FC = () => {
  const { markets } = useMarkets();
  const [search, setSearch] = useState('');

  // Editing state
  const [editingMarket, setEditingMarket] = useState<Market | null>(null);
  const [bid, setBid] = useState('');
  const [ask, setAsk] = useState('');
  const [spread, setSpread] = useState('');
  const [change, setChange] = useState('');
  const [successMsg, setSuccessMsg] = useState<string | null>(null);

  const filtered = markets.filter(
    (m) =>
      m.symbol.toLowerCase().includes(search.toLowerCase()) ||
      m.name.toLowerCase().includes(search.toLowerCase()) ||
      m.category.toLowerCase().includes(search.toLowerCase())
  );

  const openEdit = (m: Market) => {
    setEditingMarket(m);
    setBid(m.bid.toString());
    setAsk(m.ask.toString());
    setSpread(m.spread.toString());
    setChange(m.changePercent.toString());
    setSuccessMsg(null);
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingMarket) return;

    const newBid = parseFloat(bid) || editingMarket.bid;
    const newAsk = parseFloat(ask) || editingMarket.ask;
    const newSpread = parseFloat(spread) || editingMarket.spread;
    const newChangePercent = parseFloat(change) || editingMarket.changePercent;

    StorageService.updateMarketPrice(editingMarket.id, {
      bid: newBid,
      ask: newAsk,
      spread: newSpread,
      changePercent: newChangePercent,
      change: (newBid * newChangePercent) / 100,
    });

    setSuccessMsg(`Quote feed for ${editingMarket.symbol} updated.`);
    setTimeout(() => {
      setSuccessMsg(null);
      setEditingMarket(null);
    }, 1200);
  };

  const columns: Column<Market>[] = [
    {
      header: 'Symbol',
      render: (m) => (
        <div>
          <strong className="text-white text-xs font-mono-num block">{m.symbol}</strong>
          <span className="text-[10px] text-neutral-400">{m.name}</span>
        </div>
      ),
    },
    {
      header: 'Category',
      render: (m) => <Badge variant="neutral" size="sm">{m.category}</Badge>,
    },
    {
      header: 'Bid Price',
      align: 'right',
      render: (m) => <span className="font-mono-num font-bold text-white">{m.bid.toFixed(m.digits)}</span>,
    },
    {
      header: 'Ask Price',
      align: 'right',
      render: (m) => <span className="font-mono-num font-bold text-white">{m.ask.toFixed(m.digits)}</span>,
    },
    {
      header: 'Spread',
      align: 'right',
      render: (m) => <span className="font-mono-num text-neutral-300">{m.spread}</span>,
    },
    {
      header: '24h Change',
      align: 'right',
      render: (m) => {
        const isPos = m.change >= 0;
        return (
          <span className={`font-mono-num font-bold text-xs ${isPos ? 'text-emerald-400' : 'text-red-400'}`}>
            {isPos ? '+' : ''}{m.changePercent.toFixed(2)}%
          </span>
        );
      },
    },
    {
      header: 'Action',
      align: 'right',
      render: (m) => (
        <button
          onClick={() => openEdit(m)}
          className="px-2.5 py-1 text-xs bg-[#151518] hover:bg-neutral-800 text-neutral-200 border border-neutral-700 rounded transition-colors cursor-pointer"
        >
          Edit Quote
        </button>
      ),
    },
  ];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-white tracking-tight">Market Feeds & Instruments</h1>
        <p className="text-xs text-neutral-400">
          Simulate market volatility, adjust pricing feeds, spreads, and test platform client reactions.
        </p>
      </div>

      <div className="bg-[#0D0D0F] p-4 rounded-xl border border-neutral-800 flex items-center justify-between gap-4">
        <div className="w-full sm:w-80">
          <Input
            placeholder="Search symbol, category..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            leftIcon={<Search className="w-4 h-4 text-neutral-400" />}
            className="py-1.5 text-xs"
          />
        </div>
        <span className="text-xs text-neutral-400 font-mono-num">
          {filtered.length} Instruments Active
        </span>
      </div>

      <Card padding="md">
        <Table
          columns={columns}
          data={filtered}
          keyExtractor={(m) => m.id}
        />
      </Card>

      {/* Edit Market Modal */}
      {editingMarket && (
        <Modal
          isOpen={!!editingMarket}
          onClose={() => setEditingMarket(null)}
          title={`Adjust Quotes — ${editingMarket.symbol}`}
        >
          {successMsg ? (
            <div className="p-6 text-center space-y-2">
              <CheckCircle2 className="w-8 h-8 text-emerald-400 mx-auto" />
              <p className="text-sm font-bold text-white">{successMsg}</p>
            </div>
          ) : (
            <form onSubmit={handleSave} className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <Input
                  label="Bid Price"
                  type="number"
                  step="any"
                  value={bid}
                  onChange={(e) => setBid(e.target.value)}
                  required
                />
                <Input
                  label="Ask Price"
                  type="number"
                  step="any"
                  value={ask}
                  onChange={(e) => setAsk(e.target.value)}
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <Input
                  label="Spread Value"
                  type="number"
                  step="any"
                  value={spread}
                  onChange={(e) => setSpread(e.target.value)}
                  required
                />
                <Input
                  label="24h Change %"
                  type="number"
                  step="any"
                  value={change}
                  onChange={(e) => setChange(e.target.value)}
                  required
                />
              </div>

              <div className="flex justify-end gap-2 pt-2">
                <Button
                  type="button"
                  variant="secondary"
                  onClick={() => setEditingMarket(null)}
                >
                  Cancel
                </Button>
                <Button type="submit">Update Quote Feed</Button>
              </div>
            </form>
          )}
        </Modal>
      )}
    </div>
  );
};
