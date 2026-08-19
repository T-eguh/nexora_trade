import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Card } from '../../components/Card';
import { Input } from '../../components/Input';
import { Select } from '../../components/Select';
import { Button } from '../../components/Button';
import { Badge } from '../../components/Badge';
import { useAuth } from '../../hooks/useStorage';
import { User, Mail, Lock, Phone, Globe, ArrowRight, ShieldCheck } from 'lucide-react';
import { AccountTierType } from '../../types';

export const RegisterPage: React.FC = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [country, setCountry] = useState('United States');
  const [password, setPassword] = useState('');
  const [accountTier, setAccountTier] = useState<AccountTierType>('Pro');
  const [agreeTerms, setAgreeTerms] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const { register } = useAuth();
  const navigate = useNavigate();

  const handleRegister = (e: React.FormEvent) => {
    e.preventDefault();
    if (!agreeTerms) {
      setError('You must accept the terms of service and risk disclosure to proceed.');
      return;
    }

    setError(null);
    setLoading(true);

    setTimeout(() => {
      const user = register({
        name,
        email,
        phone,
        country,
        password,
        accountTier,
      });

      setLoading(false);
      if (user) {
        navigate('/dashboard');
      } else {
        setError('An account with this email already exists. Please sign in instead.');
      }
    }, 500);
  };

  return (
    <div className="min-h-[85vh] flex items-center justify-center px-4 py-12">
      <div className="max-w-xl w-full space-y-6">
        {/* Header */}
        <div className="text-center space-y-2">
          <Link
            to="/"
            className="inline-flex items-center gap-2 text-xl font-black tracking-tight text-white"
          >
            <span className="w-7 h-7 rounded-lg bg-red-600 flex items-center justify-center text-white font-black text-sm">
              N
            </span>
            <span>
              NEXORA<span className="text-red-500">TRADE</span>
            </span>
          </Link>
          <h1 className="text-2xl font-bold text-white tracking-tight">
            Open Free Demo Trading Account
          </h1>
          <p className="text-xs text-neutral-400">
            Get instant access to $10,000 in virtual funds and institutional-grade trading tools.
          </p>
        </div>

        {/* Form Card */}
        <Card padding="lg" className="space-y-6">
          {error && (
            <div className="p-3.5 bg-red-950/50 border border-red-800/80 rounded-xl text-red-300 text-xs">
              {error}
            </div>
          )}

          <form onSubmit={handleRegister} className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <Input
                label="Full Legal Name"
                placeholder="Marcus Vance"
                value={name}
                onChange={(e) => setName(e.target.value)}
                leftIcon={<User className="w-4 h-4 text-neutral-400" />}
                required
              />

              <Input
                label="Email Address"
                type="email"
                placeholder="name@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                leftIcon={<Mail className="w-4 h-4 text-neutral-400" />}
                required
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <Input
                label="Phone Number"
                type="tel"
                placeholder="+1 555 0192"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                leftIcon={<Phone className="w-4 h-4 text-neutral-400" />}
                required
              />

              <Select
                label="Country of Residence"
                value={country}
                onChange={(e) => setCountry(e.target.value)}
                options={[
                  { value: 'United States', label: 'United States' },
                  { value: 'United Kingdom', label: 'United Kingdom' },
                  { value: 'Singapore', label: 'Singapore' },
                  { value: 'Australia', label: 'Australia' },
                  { value: 'Germany', label: 'Germany' },
                  { value: 'Indonesia', label: 'Indonesia' },
                  { value: 'United Arab Emirates', label: 'United Arab Emirates' },
                ]}
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <Input
                label="Create Password"
                type="password"
                placeholder="At least 6 characters"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                leftIcon={<Lock className="w-4 h-4 text-neutral-400" />}
                required
              />

              <Select
                label="Initial Account Tier"
                value={accountTier}
                onChange={(e) => setAccountTier(e.target.value as AccountTierType)}
                options={[
                  { value: 'Starter', label: 'Starter ($10 Min / 1:500)' },
                  { value: 'Pro', label: 'Pro Tier ($100 Min / 1:1000) [Popular]' },
                  { value: 'Zero', label: 'Zero Spread (0.0 Pip / Raw ECN)' },
                  { value: 'Premium', label: 'Premium VIP (1:2000 Institutional)' },
                ]}
              />
            </div>

            {/* Checkbox */}
            <label className="flex items-start gap-2.5 cursor-pointer text-xs text-neutral-400 select-none pt-2">
              <input
                type="checkbox"
                checked={agreeTerms}
                onChange={(e) => setAgreeTerms(e.target.checked)}
                className="mt-0.5 rounded border-neutral-700 bg-neutral-900 text-red-600 focus:ring-red-500 accent-red-600"
              />
              <span>
                I agree to the{' '}
                <Link to="/terms" className="text-white hover:underline">
                  Terms of Service
                </Link>
                ,{' '}
                <Link to="/privacy" className="text-white hover:underline">
                  Privacy Policy
                </Link>
                , and acknowledge the{' '}
                <Link to="/risk-disclosure" className="text-white hover:underline">
                  Risk Disclosure
                </Link>
                .
              </span>
            </label>

            <Button type="submit" fullWidth size="lg" disabled={loading}>
              {loading ? 'Creating Demo Account...' : 'Open Demo Trading Account'}
              <ArrowRight className="w-4 h-4 ml-2" />
            </Button>
          </form>

          <div className="pt-2 text-center text-xs text-neutral-400 border-t border-neutral-800">
            Already have an account?{' '}
            <Link to="/login" className="text-red-400 hover:text-red-300 font-semibold underline">
              Sign In to Portal
            </Link>
          </div>
        </Card>
      </div>
    </div>
  );
};
