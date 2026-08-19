import React, { useState } from 'react';
import { Card } from '../../components/Card';
import { Button } from '../../components/Button';
import { Badge } from '../../components/Badge';
import { Modal } from '../../components/Modal';
import { Input } from '../../components/Input';
import { Select } from '../../components/Select';
import { useAccounts, useAuth } from '../../hooks/useStorage';
import { StorageService } from '../../utils/storage';
import { Wallet, Plus, ArrowDownCircle, ArrowUpCircle, CheckCircle2, Shield } from 'lucide-react';
import { AccountTierType, TradingAccount } from '../../types';
import { Link } from 'react-router-dom';

export const TradingAccountsPage: React.FC = () => {
  const { accounts } = useAccounts();
  const { user } = useAuth();

  const [createModalOpen, setCreateModalOpen] = useState(false);
  const [selectedTier, setSelectedTier] = useState<AccountTierType>('Pro');
  const [leverage, setLeverage] = useState('1000');
  const [initialDeposit, setInitialDeposit] = useState('10000');
  const [successMsg, setSuccessMsg] = useState<string | null>(null);

  const handleCreateAccount = (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;

    const accNum = `NX-${Math.floor(100000 + Math.random() * 900000)}`;
    const newAcc: Omit<TradingAccount, 'id'> = {
      userId: user.id,
      accountId: accNum,
      accountNumber: accNum,
      type: selectedTier,
      tier: selectedTier,
      currency: 'USD',
      balance: parseFloat(initialDeposit) || 10000,
      equity: parseFloat(initialDeposit) || 10000,
      margin: 0,
      marginUsed: 0,
      freeMargin: parseFloat(initialDeposit) || 10000,
      leverage: `1:${leverage}`,
      server: 'Nexora-Live-01',
      status: 'active',
    };

    StorageService.addAccount(newAcc);
    setSuccessMsg(`Trading Account ${newAcc.accountNumber} provisioned successfully!`);
    setTimeout(() => {
      setSuccessMsg(null);
      setCreateModalOpen(false);
    }, 2000);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-white tracking-tight">
            Trading Accounts Management
          </h1>
          <p className="text-xs text-neutral-400">
            Manage multiple virtual trading accounts, adjust leverage parameters, and allocate demo capital.
          </p>
        </div>

        <Button onClick={() => setCreateModalOpen(true)} size="md">
          <Plus className="w-4 h-4 mr-1.5" /> Create New Demo Account
        </Button>
      </div>

      {/* Accounts Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {accounts.map((acc) => (
          <Card key={acc.id} padding="lg" className="space-y-5 flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between pb-3 border-b border-neutral-800">
                <div>
                  <span className="text-[10px] text-neutral-400 font-bold uppercase tracking-wider block">
                    Account Number
                  </span>
                  <strong className="text-lg font-black text-white font-mono-num">
                    {acc.accountNumber}
                  </strong>
                </div>
                <Badge variant={acc.tier === 'Premium' ? 'red' : 'neutral'} size="sm">
                  {acc.tier} Tier
                </Badge>
              </div>

              <div className="py-4 space-y-3 font-mono-num text-xs">
                <div className="flex justify-between">
                  <span className="text-neutral-400">Balance:</span>
                  <span className="text-base font-bold text-white">
                    ${acc.balance.toLocaleString('en-US', { minimumFractionDigits: 2 })}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-neutral-400">Equity:</span>
                  <span className="font-semibold text-emerald-400">
                    ${acc.equity.toLocaleString('en-US', { minimumFractionDigits: 2 })}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-neutral-400">Leverage:</span>
                  <span className="text-neutral-200">{acc.leverage}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-neutral-400">Server:</span>
                  <span className="text-neutral-300 font-sans text-[11px]">{acc.server}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-neutral-400">Status:</span>
                  <span className="text-emerald-400 font-bold uppercase text-[11px]">
                    {acc.status}
                  </span>
                </div>
              </div>
            </div>

            <div className="pt-3 border-t border-neutral-800 grid grid-cols-2 gap-2">
              <Link to="/dashboard/deposit">
                <Button variant="secondary" size="sm" fullWidth>
                  <ArrowDownCircle className="w-3.5 h-3.5 mr-1" /> Deposit
                </Button>
              </Link>
              <Link to="/dashboard/markets">
                <Button size="sm" fullWidth>
                  Trade Now
                </Button>
              </Link>
            </div>
          </Card>
        ))}
      </div>

      {/* Create Account Modal */}
      <Modal
        isOpen={createModalOpen}
        onClose={() => setCreateModalOpen(false)}
        title="Open New Demo Trading Account"
      >
        {successMsg ? (
          <div className="py-8 text-center space-y-3">
            <CheckCircle2 className="w-10 h-10 text-emerald-400 mx-auto" />
            <h4 className="text-base font-bold text-white">{successMsg}</h4>
          </div>
        ) : (
          <form onSubmit={handleCreateAccount} className="space-y-4">
            <Select
              label="Account Tier"
              value={selectedTier}
              onChange={(e) => setSelectedTier(e.target.value as AccountTierType)}
              options={[
                { value: 'Starter', label: 'Starter ($10 Min / 1:500)' },
                { value: 'Pro', label: 'Pro Tier ($100 Min / 1:1000) [Popular]' },
                { value: 'Zero', label: 'Zero Spread (0.0 Pip Raw)' },
                { value: 'Premium', label: 'Premium VIP (1:2000 Institutional)' },
              ]}
            />

            <Select
              label="Account Leverage"
              value={leverage}
              onChange={(e) => setLeverage(e.target.value)}
              options={[
                { value: '100', label: '1:100' },
                { value: '200', label: '1:200' },
                { value: '500', label: '1:500' },
                { value: '1000', label: '1:1000 (Recommended)' },
                { value: '2000', label: '1:2000 (High Risk)' },
              ]}
            />

            <Input
              label="Initial Demo Capital (USD)"
              type="number"
              min="100"
              max="100000"
              step="100"
              value={initialDeposit}
              onChange={(e) => setInitialDeposit(e.target.value)}
              required
              helperText="Virtual funds credited instantly upon account creation."
            />

            <div className="pt-3 flex justify-end gap-2">
              <Button
                type="button"
                variant="secondary"
                onClick={() => setCreateModalOpen(false)}
              >
                Cancel
              </Button>
              <Button type="submit">Create Account</Button>
            </div>
          </form>
        )}
      </Modal>
    </div>
  );
};
