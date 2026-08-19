import React, { useState } from 'react';
import { Card } from '../../components/Card';
import { Badge } from '../../components/Badge';
import { Button } from '../../components/Button';
import { Input } from '../../components/Input';
import { Select } from '../../components/Select';
import { useAccounts, useAuth } from '../../hooks/useStorage';
import { StorageService } from '../../utils/storage';
import {
  ArrowDownCircle,
  CreditCard,
  Building2,
  Bitcoin,
  CheckCircle2,
  ShieldCheck,
  Zap,
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export const DepositPage: React.FC = () => {
  const { accounts } = useAccounts();
  const { user } = useAuth();
  const navigate = useNavigate();

  const primaryAccount = accounts.find((a) => a.userId === user?.id) || accounts[0];

  const [accountId, setAccountId] = useState(primaryAccount?.id || '');
  const [method, setMethod] = useState<'bank' | 'crypto' | 'card'>('crypto');
  const [amount, setAmount] = useState('2500');
  const [loading, setLoading] = useState(false);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);

  const handleDeposit = (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    const depAmount = parseFloat(amount) || 1000;
    const targetAcc = accounts.find((a) => a.id === accountId) || primaryAccount;

    setTimeout(() => {
      if (targetAcc) {
        StorageService.deposit(targetAcc.id, depAmount, `Simulated ${method.toUpperCase()} Deposit`);
      }
      setLoading(false);
      setSuccessMsg(`Successfully credited $${depAmount.toLocaleString()} demo funds to account ${targetAcc?.accountNumber || 'NX-894102'}!`);
    }, 600);
  };

  const presetAmounts = ['500', '1000', '2500', '5000', '10000'];

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      {/* Header */}
      <div className="space-y-2">
        <div className="flex items-center gap-2">
          <Badge variant="red" size="sm">
            DEMO SIMULATION
          </Badge>
          <span className="text-xs text-neutral-400">Instant Virtual Balance Credit</span>
        </div>
        <h1 className="text-2xl sm:text-3xl font-bold text-white tracking-tight">
          Deposit Demo Trading Funds
        </h1>
        <p className="text-xs sm:text-sm text-neutral-400">
          Allocate virtual test funds into your trading account to practice risk scenarios without capital commitment.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Main Form */}
        <div className="lg:col-span-8">
          <Card padding="lg">
            {successMsg ? (
              <div className="py-10 text-center space-y-4">
                <div className="w-14 h-14 rounded-full bg-emerald-950/80 border border-emerald-800 flex items-center justify-center text-emerald-400 mx-auto">
                  <CheckCircle2 className="w-8 h-8" />
                </div>
                <h3 className="text-xl font-bold text-white">Deposit Successful</h3>
                <p className="text-xs text-neutral-300 max-w-md mx-auto leading-relaxed">
                  {successMsg}
                </p>
                <div className="pt-4 flex justify-center gap-3">
                  <Button
                    variant="secondary"
                    size="sm"
                    onClick={() => {
                      setSuccessMsg(null);
                      setAmount('1000');
                    }}
                  >
                    Deposit More
                  </Button>
                  <Button
                    size="sm"
                    onClick={() => navigate('/dashboard')}
                  >
                    Return to Dashboard
                  </Button>
                </div>
              </div>
            ) : (
              <form onSubmit={handleDeposit} className="space-y-6">
                {/* Account Selection */}
                <Select
                  label="Target Trading Account"
                  value={accountId}
                  onChange={(e) => setAccountId(e.target.value)}
                  options={accounts.map((a) => ({
                    value: a.id,
                    label: `${a.accountNumber} (${a.tier} Tier • Balance: $${a.balance.toLocaleString()})`,
                  }))}
                />

                {/* Method Selector */}
                <div className="space-y-2">
                  <label className="block text-xs font-semibold text-neutral-300 uppercase tracking-wide">
                    Select Demo Deposit Method
                  </label>
                  <div className="grid grid-cols-3 gap-3">
                    <button
                      type="button"
                      onClick={() => setMethod('crypto')}
                      className={`p-3.5 rounded-xl border flex flex-col items-center gap-2 text-center transition-colors cursor-pointer ${
                        method === 'crypto'
                          ? 'bg-red-950/40 border-red-600 text-white'
                          : 'bg-[#151518] border-neutral-800 text-neutral-400 hover:text-white hover:bg-neutral-800'
                      }`}
                    >
                      <Bitcoin className="w-5 h-5 text-amber-400" />
                      <span className="text-xs font-bold">USDT / Crypto</span>
                      <span className="text-[10px] text-neutral-400">Instant</span>
                    </button>

                    <button
                      type="button"
                      onClick={() => setMethod('card')}
                      className={`p-3.5 rounded-xl border flex flex-col items-center gap-2 text-center transition-colors cursor-pointer ${
                        method === 'card'
                          ? 'bg-red-950/40 border-red-600 text-white'
                          : 'bg-[#151518] border-neutral-800 text-neutral-400 hover:text-white hover:bg-neutral-800'
                      }`}
                    >
                      <CreditCard className="w-5 h-5 text-blue-400" />
                      <span className="text-xs font-bold">Debit / Credit</span>
                      <span className="text-[10px] text-neutral-400">Instant</span>
                    </button>

                    <button
                      type="button"
                      onClick={() => setMethod('bank')}
                      className={`p-3.5 rounded-xl border flex flex-col items-center gap-2 text-center transition-colors cursor-pointer ${
                        method === 'bank'
                          ? 'bg-red-950/40 border-red-600 text-white'
                          : 'bg-[#151518] border-neutral-800 text-neutral-400 hover:text-white hover:bg-neutral-800'
                      }`}
                    >
                      <Building2 className="w-5 h-5 text-emerald-400" />
                      <span className="text-xs font-bold">Bank Wire</span>
                      <span className="text-[10px] text-neutral-400">Simulated</span>
                    </button>
                  </div>
                </div>

                {/* Amount Input and Quick Chips */}
                <div className="space-y-3">
                  <Input
                    label="Deposit Amount (USD)"
                    type="number"
                    min="50"
                    max="100000"
                    step="50"
                    value={amount}
                    onChange={(e) => setAmount(e.target.value)}
                    required
                  />

                  <div className="flex flex-wrap items-center gap-2 pt-1">
                    <span className="text-xs text-neutral-400">Quick presets:</span>
                    {presetAmounts.map((p) => (
                      <button
                        key={p}
                        type="button"
                        onClick={() => setAmount(p)}
                        className="px-2.5 py-1 text-xs font-mono-num rounded-lg bg-[#151518] hover:bg-neutral-800 text-neutral-300 border border-neutral-800 transition-colors cursor-pointer"
                      >
                        +${p}
                      </button>
                    ))}
                  </div>
                </div>

                <Button type="submit" fullWidth size="lg" disabled={loading}>
                  {loading ? 'Processing Virtual Deposit...' : 'Confirm Demo Deposit'}
                  <Zap className="w-4 h-4 ml-2" />
                </Button>
              </form>
            )}
          </Card>
        </div>

        {/* Informational Side Column */}
        <div className="lg:col-span-4 space-y-4 text-xs">
          <Card padding="md" className="space-y-3 bg-[#111114]">
            <h4 className="text-xs font-bold uppercase tracking-wider text-white flex items-center gap-2">
              <ShieldCheck className="w-4 h-4 text-emerald-400" /> Demo Operation Guidelines
            </h4>
            <p className="text-neutral-400 leading-relaxed">
              Deposits executed in this dashboard simulate instant blockchain confirmation and banking settlement protocols.
            </p>
            <div className="pt-2 border-t border-neutral-800 text-[11px] text-neutral-400 space-y-1">
              <div>• Minimum Demo Deposit: $50 USD</div>
              <div>• Maximum Demo Deposit: $100,000 USD</div>
              <div>• Processing Time: Instant simulated</div>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
};
