import React, { useState } from 'react';
import { Card } from '../../components/Card';
import { Badge } from '../../components/Badge';
import { Button } from '../../components/Button';
import { Input } from '../../components/Input';
import { Select } from '../../components/Select';
import { useAccounts, useAuth } from '../../hooks/useStorage';
import { StorageService } from '../../utils/storage';
import {
  ArrowUpCircle,
  Building2,
  Bitcoin,
  CreditCard,
  CheckCircle2,
  AlertCircle,
  Zap,
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export const WithdrawalPage: React.FC = () => {
  const { accounts } = useAccounts();
  const { user } = useAuth();
  const navigate = useNavigate();

  const primaryAccount = accounts.find((a) => a.userId === user?.id) || accounts[0];

  const [accountId, setAccountId] = useState(primaryAccount?.id || '');
  const [method, setMethod] = useState<'crypto' | 'bank' | 'card'>('crypto');
  const [amount, setAmount] = useState('1000');
  const [destination, setDestination] = useState('0x71C...8942');
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);

  const selectedAcc = accounts.find((a) => a.id === accountId) || primaryAccount;

  const handleWithdraw = (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    const withAmount = parseFloat(amount) || 0;

    if (!selectedAcc) return;

    if (withAmount <= 0) {
      setError('Please enter a valid withdrawal amount greater than zero.');
      return;
    }

    if (withAmount > selectedAcc.balance) {
      setError(`Insufficient demo funds. Available balance: $${selectedAcc.balance.toLocaleString()}`);
      return;
    }

    setLoading(true);

    setTimeout(() => {
      StorageService.withdraw(selectedAcc.id, withAmount, `Simulated ${method.toUpperCase()} to ${destination}`);
      setLoading(false);
      setSuccessMsg(`Simulated withdrawal request of $${withAmount.toLocaleString()} submitted successfully for account ${selectedAcc.accountNumber}!`);
    }, 600);
  };

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      {/* Header */}
      <div className="space-y-2">
        <div className="flex items-center gap-2">
          <Badge variant="red" size="sm">
            DEMO SIMULATION
          </Badge>
          <span className="text-xs text-neutral-400">Virtual Funds Deduction Test</span>
        </div>
        <h1 className="text-2xl sm:text-3xl font-bold text-white tracking-tight">
          Simulated Withdrawal Request
        </h1>
        <p className="text-xs sm:text-sm text-neutral-400">
          Simulate a profit withdrawal transaction and observe real-time balance deductions and transaction status changes.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        <div className="lg:col-span-8">
          <Card padding="lg">
            {successMsg ? (
              <div className="py-10 text-center space-y-4">
                <div className="w-14 h-14 rounded-full bg-emerald-950/80 border border-emerald-800 flex items-center justify-center text-emerald-400 mx-auto">
                  <CheckCircle2 className="w-8 h-8" />
                </div>
                <h3 className="text-xl font-bold text-white">Withdrawal Submitted</h3>
                <p className="text-xs text-neutral-300 max-w-md mx-auto leading-relaxed">
                  {successMsg}
                </p>
                <div className="pt-4 flex justify-center gap-3">
                  <Button
                    variant="secondary"
                    size="sm"
                    onClick={() => {
                      setSuccessMsg(null);
                      setAmount('500');
                    }}
                  >
                    New Request
                  </Button>
                  <Button
                    size="sm"
                    onClick={() => navigate('/dashboard/transactions')}
                  >
                    View in Transactions
                  </Button>
                </div>
              </div>
            ) : (
              <form onSubmit={handleWithdraw} className="space-y-6">
                {error && (
                  <div className="p-3.5 bg-red-950/50 border border-red-800/80 rounded-xl text-red-300 text-xs flex items-start gap-2">
                    <AlertCircle className="w-4 h-4 text-red-400 shrink-0 mt-0.5" />
                    <span>{error}</span>
                  </div>
                )}

                <Select
                  label="Source Trading Account"
                  value={accountId}
                  onChange={(e) => setAccountId(e.target.value)}
                  options={accounts.map((a) => ({
                    value: a.id,
                    label: `${a.accountNumber} (Available: $${a.balance.toLocaleString()})`,
                  }))}
                />

                {/* Method selection */}
                <div className="space-y-2">
                  <label className="block text-xs font-semibold text-neutral-300 uppercase tracking-wide">
                    Withdrawal Channel
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
                      <span className="text-xs font-bold">USDT (TRC20)</span>
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
                      <span className="text-xs font-bold">Bank Transfer</span>
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
                      <span className="text-xs font-bold">Card Refund</span>
                    </button>
                  </div>
                </div>

                <Input
                  label="Withdrawal Amount (USD)"
                  type="number"
                  min="10"
                  max="50000"
                  value={amount}
                  onChange={(e) => setAmount(e.target.value)}
                  required
                  helperText={`Maximum available to withdraw: $${selectedAcc ? selectedAcc.balance.toLocaleString() : '0'}`}
                />

                <Input
                  label={method === 'crypto' ? 'Destination Wallet Address (USDT TRC20)' : method === 'bank' ? 'Bank Account IBAN / Number' : 'Card Last 4 Digits'}
                  placeholder={method === 'crypto' ? 'e.g. TXyZ871...90AB' : 'e.g. US89 3704 0044 ...'}
                  value={destination}
                  onChange={(e) => setDestination(e.target.value)}
                  required
                />

                <Button type="submit" fullWidth size="lg" disabled={loading}>
                  {loading ? 'Processing Withdrawal...' : 'Request Demo Withdrawal'}
                  <Zap className="w-4 h-4 ml-2" />
                </Button>
              </form>
            )}
          </Card>
        </div>

        {/* Security checklist */}
        <div className="lg:col-span-4 space-y-4 text-xs">
          <Card padding="md" className="space-y-3 bg-[#111114]">
            <h4 className="text-xs font-bold uppercase tracking-wider text-white">
              Withdrawal Rules
            </h4>
            <p className="text-neutral-400 leading-relaxed">
              In this simulated testing environment, submitted withdrawal orders immediately deduct the account balance and record an auditable transaction log.
            </p>
            <div className="pt-2 border-t border-neutral-800 space-y-1.5 text-[11px] text-neutral-400">
              <div>• Minimum Withdrawal: $10 USD</div>
              <div>• Fee: $0.00 (Zero Demo Commission)</div>
              <div>• Settlement Status: Automated</div>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
};
