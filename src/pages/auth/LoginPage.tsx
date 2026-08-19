import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { Card } from '../../components/Card';
import { Input } from '../../components/Input';
import { Button } from '../../components/Button';
import { Badge } from '../../components/Badge';
import { useAuth } from '../../hooks/useStorage';
import { Lock, Mail, ArrowRight, ShieldCheck, AlertCircle } from 'lucide-react';

export const LoginPage: React.FC = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const { login } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const from = (location.state as any)?.from?.pathname || '/dashboard';

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    setTimeout(() => {
      const user = login(email, password);
      setLoading(false);

      if (user) {
        if (user.role === 'admin') {
          navigate('/admin');
        } else {
          navigate(from === '/login' ? '/dashboard' : from);
        }
      } else {
        setError('Invalid email or password. You can use the Quick Fill buttons below for instant demo credentials.');
      }
    }, 400);
  };

  const handleQuickFill = (demoEmail: string, demoPass: string) => {
    setEmail(demoEmail);
    setPassword(demoPass);
    setError(null);
  };

  return (
    <div className="min-h-[80vh] flex items-center justify-center px-4 py-12">
      <div className="max-w-md w-full space-y-6">
        {/* Header Branding */}
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
            Sign In to Client Portal
          </h1>
          <p className="text-xs text-neutral-400">
            Access your simulated trading accounts, active positions, and funds.
          </p>
        </div>

        {/* Login Card */}
        <Card padding="lg" className="space-y-6">
          {error && (
            <div className="p-3.5 bg-red-950/50 border border-red-800/80 rounded-xl text-red-300 text-xs flex items-start gap-2.5">
              <AlertCircle className="w-4 h-4 text-red-400 shrink-0 mt-0.5" />
              <span>{error}</span>
            </div>
          )}

          <form onSubmit={handleLogin} className="space-y-4">
            <Input
              label="Email Address"
              type="email"
              placeholder="trader@nexoratrade.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              leftIcon={<Mail className="w-4 h-4 text-neutral-400" />}
              required
            />

            <Input
              label="Password"
              type="password"
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              leftIcon={<Lock className="w-4 h-4 text-neutral-400" />}
              required
            />

            <Button type="submit" fullWidth size="lg" disabled={loading}>
              {loading ? 'Authenticating...' : 'Sign In to Portal'}
              <ArrowRight className="w-4 h-4 ml-2" />
            </Button>
          </form>

          {/* Quick-Fill Helper Box for Evaluation */}
          <div className="p-3.5 bg-[#151518] rounded-xl border border-neutral-800 space-y-2.5 text-xs">
            <span className="text-[10px] uppercase font-bold text-neutral-400 tracking-wider block">
              Quick Fill Demo Credentials
            </span>
            <div className="grid grid-cols-2 gap-2">
              <button
                type="button"
                onClick={() => handleQuickFill('demo@nexoratrade.com', 'demo123')}
                className="p-2 rounded-lg bg-[#1a1a1f] hover:bg-neutral-800 border border-neutral-700/60 text-left transition-colors cursor-pointer"
              >
                <strong className="block text-white text-xs">Demo Trader</strong>
                <span className="text-[10px] text-neutral-400 font-mono-num">demo@nexoratrade.com</span>
              </button>
              <button
                type="button"
                onClick={() => handleQuickFill('admin@nexoratrade.com', 'admin123')}
                className="p-2 rounded-lg bg-[#1a1a1f] hover:bg-neutral-800 border border-red-900/40 text-left transition-colors cursor-pointer"
              >
                <strong className="block text-red-400 text-xs">Administrator</strong>
                <span className="text-[10px] text-neutral-400 font-mono-num">admin@nexoratrade.com</span>
              </button>
            </div>
          </div>

          <div className="pt-2 text-center text-xs text-neutral-400 border-t border-neutral-800">
            Don't have an account yet?{' '}
            <Link to="/register" className="text-red-400 hover:text-red-300 font-semibold underline">
              Open Demo Account
            </Link>
          </div>
        </Card>
      </div>
    </div>
  );
};
