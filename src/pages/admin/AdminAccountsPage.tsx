import React, { useState } from 'react';
import { Card } from '../../components/Card';
import { Badge } from '../../components/Badge';
import { Button } from '../../components/Button';
import { Table, Column } from '../../components/Table';
import { Modal } from '../../components/Modal';
import { Input } from '../../components/Input';
import { Select } from '../../components/Select';
import { useAccounts } from '../../hooks/useStorage';
import { StorageService } from '../../utils/storage';
import { TradingAccount } from '../../types';
import { Wallet, Search, Edit3, CheckCircle2 } from 'lucide-react';

export const AdminAccountsPage: React.FC = () => {
  const { accounts } = useAccounts();
  const [search, setSearch] = useState('');

  const [editingAcc, setEditingAcc] = useState<TradingAccount | null>(null);
  const [newBalance, setNewBalance] = useState('');
  const [newLeverage, setNewLeverage] = useState('');
  const [successMsg, setSuccessMsg] = useState<string | null>(null);

  const filtered = accounts.filter(
    (a) =>
      a.accountNumber.toLowerCase().includes(search.toLowerCase()) ||
      a.tier.toLowerCase().includes(search.toLowerCase()) ||
      a.server.toLowerCase().includes(search.toLowerCase())
  );

  const openEdit = (acc: TradingAccount) => {
    setEditingAcc(acc);
    setNewBalance(acc.balance.toString());
    setNewLeverage(acc.leverage);
    setSuccessMsg(null);
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingAcc) return;

    const bal = parseFloat(newBalance) || editingAcc.balance;
    StorageService.updateAccount(editingAcc.id, {
      balance: bal,
      equity: bal,
      freeMargin: bal - editingAcc.margin,
      leverage: newLeverage,
    });

    setSuccessMsg(`Account ${editingAcc.accountNumber} updated.`);
    setTimeout(() => {
      setSuccessMsg(null);
      setEditingAcc(null);
    }, 1200);
  };

  const columns: Column<TradingAccount>[] = [
    {
      header: 'Account Number',
      render: (a) => <strong className="font-bold text-white font-mono-num">{a.accountNumber}</strong>,
    },
    {
      header: 'Tier',
      render: (a) => (
        <Badge variant={a.tier === 'Premium' ? 'red' : 'neutral'} size="sm">
          {a.tier}
        </Badge>
      ),
    },
    {
      header: 'Balance',
      align: 'right',
      render: (a) => (
        <span className="font-bold text-white font-mono-num">
          ${a.balance.toLocaleString('en-US', { minimumFractionDigits: 2 })}
        </span>
      ),
    },
    {
      header: 'Leverage',
      render: (a) => <span className="font-mono-num text-neutral-300">{a.leverage}</span>,
    },
    {
      header: 'Server',
      render: (a) => <span className="text-xs text-neutral-400">{a.server}</span>,
    },
    {
      header: 'Status',
      render: (a) => (
        <Badge variant={a.status === 'active' ? 'success' : 'danger'} size="sm">
          {a.status.toUpperCase()}
        </Badge>
      ),
    },
    {
      header: 'Action',
      align: 'right',
      render: (a) => (
        <button
          onClick={() => openEdit(a)}
          className="px-2.5 py-1 text-xs bg-[#151518] hover:bg-neutral-800 text-neutral-200 border border-neutral-700 rounded transition-colors cursor-pointer"
        >
          Edit
        </button>
      ),
    },
  ];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-white tracking-tight">Trading Accounts Management</h1>
        <p className="text-xs text-neutral-400">
          Audit portfolio balances, adjust leverage ratios, and manage margin allocations.
        </p>
      </div>

      <div className="bg-[#0D0D0F] p-4 rounded-xl border border-neutral-800 flex items-center justify-between gap-4">
        <div className="w-full sm:w-80">
          <Input
            placeholder="Search account #, tier, server..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            leftIcon={<Search className="w-4 h-4 text-neutral-400" />}
            className="py-1.5 text-xs"
          />
        </div>
        <span className="text-xs text-neutral-400 font-mono-num">
          Total: {filtered.length} Accounts
        </span>
      </div>

      <Card padding="md">
        <Table
          columns={columns}
          data={filtered}
          keyExtractor={(a) => a.id}
          emptyMessage="No trading accounts match the query."
        />
      </Card>

      {/* Edit Modal */}
      {editingAcc && (
        <Modal
          isOpen={!!editingAcc}
          onClose={() => setEditingAcc(null)}
          title={`Edit Account ${editingAcc.accountNumber}`}
        >
          {successMsg ? (
            <div className="p-6 text-center space-y-2">
              <CheckCircle2 className="w-8 h-8 text-emerald-400 mx-auto" />
              <p className="text-sm font-bold text-white">{successMsg}</p>
            </div>
          ) : (
            <form onSubmit={handleSave} className="space-y-4">
              <Input
                label="Adjust Demo Balance (USD)"
                type="number"
                step="100"
                value={newBalance}
                onChange={(e) => setNewBalance(e.target.value)}
                required
              />

              <Select
                label="Leverage Profile"
                value={newLeverage}
                onChange={(e) => setNewLeverage(e.target.value)}
                options={[
                  { value: '1:100', label: '1:100' },
                  { value: '1:200', label: '1:200' },
                  { value: '1:500', label: '1:500' },
                  { value: '1:1000', label: '1:1000' },
                  { value: '1:2000', label: '1:2000' },
                ]}
              />

              <div className="flex justify-end gap-2 pt-2">
                <Button
                  type="button"
                  variant="secondary"
                  onClick={() => setEditingAcc(null)}
                >
                  Cancel
                </Button>
                <Button type="submit">Save Updates</Button>
              </div>
            </form>
          )}
        </Modal>
      )}
    </div>
  );
};
