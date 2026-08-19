import React, { useState } from 'react';
import { Card } from '../../components/Card';
import { Badge } from '../../components/Badge';
import { Button } from '../../components/Button';
import { Input } from '../../components/Input';
import { Shield, Lock, Smartphone, CheckCircle2, AlertCircle } from 'lucide-react';
import { useAuth } from '../../hooks/useStorage';
import { StorageService } from '../../utils/storage';

export const SecurityPage: React.FC = () => {
  const { user } = useAuth();

  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [twoFactor, setTwoFactor] = useState(user?.twoFactorEnabled || false);

  const [error, setError] = useState<string | null>(null);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);

  const handlePasswordChange = (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (newPassword.length < 6) {
      setError('New password must be at least 6 characters.');
      return;
    }

    if (newPassword !== confirmPassword) {
      setError('New passwords do not match.');
      return;
    }

    if (!user) return;

    StorageService.updateUser(user.id, {
      password: newPassword,
    });

    setSuccessMsg('Security password updated successfully.');
    setCurrentPassword('');
    setNewPassword('');
    setConfirmPassword('');
    setTimeout(() => setSuccessMsg(null), 3000);
  };

  const toggle2FA = () => {
    if (!user) return;
    const nextVal = !twoFactor;
    setTwoFactor(nextVal);
    StorageService.updateUser(user.id, { twoFactorEnabled: nextVal });
    setSuccessMsg(nextVal ? 'Two-Factor Authentication activated.' : 'Two-Factor Authentication disabled.');
    setTimeout(() => setSuccessMsg(null), 2500);
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-white tracking-tight">Security & Access</h1>
        <p className="text-xs text-neutral-400">
          Manage your account credentials, multi-factor authentication, and security protections.
        </p>
      </div>

      {successMsg && (
        <div className="p-3.5 bg-emerald-950/60 border border-emerald-800 rounded-xl text-emerald-300 text-xs flex items-center gap-2">
          <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
          <span>{successMsg}</span>
        </div>
      )}

      {error && (
        <div className="p-3.5 bg-red-950/60 border border-red-800 rounded-xl text-red-300 text-xs flex items-center gap-2">
          <AlertCircle className="w-4 h-4 text-red-400 shrink-0" />
          <span>{error}</span>
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Change Password Card */}
        <Card padding="lg" className="space-y-4">
          <div className="flex items-center gap-2.5 pb-2 border-b border-neutral-800">
            <Lock className="w-4 h-4 text-red-500" />
            <h3 className="text-base font-bold text-white">Change Password</h3>
          </div>

          <form onSubmit={handlePasswordChange} className="space-y-3">
            <Input
              label="Current Password"
              type="password"
              placeholder="••••••••"
              value={currentPassword}
              onChange={(e) => setCurrentPassword(e.target.value)}
              required
            />

            <Input
              label="New Password"
              type="password"
              placeholder="Min 6 characters"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              required
            />

            <Input
              label="Confirm New Password"
              type="password"
              placeholder="Min 6 characters"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              required
            />

            <div className="pt-2">
              <Button type="submit" size="sm" fullWidth>
                Update Password
              </Button>
            </div>
          </form>
        </Card>

        {/* 2FA & Active Sessions */}
        <div className="space-y-6">
          <Card padding="lg" className="space-y-4">
            <div className="flex items-center gap-2.5 pb-2 border-b border-neutral-800">
              <Smartphone className="w-4 h-4 text-red-500" />
              <h3 className="text-base font-bold text-white">Two-Factor Authentication</h3>
            </div>

            <p className="text-xs text-neutral-400 leading-relaxed">
              Require a secondary one-time passcode verification on mobile before executing withdrawals or account changes.
            </p>

            <div className="pt-2 flex items-center justify-between">
              <div>
                <span className="text-xs font-bold text-white block">
                  Status: {twoFactor ? 'ENABLED' : 'DISABLED'}
                </span>
                <span className="text-[10px] text-neutral-400 font-mono-num">
                  {twoFactor ? 'Protected with 6-digit TOTP' : 'Standard single password authentication'}
                </span>
              </div>

              <Button
                variant={twoFactor ? 'danger' : 'secondary'}
                size="sm"
                onClick={toggle2FA}
              >
                {twoFactor ? 'Disable 2FA' : 'Enable 2FA'}
              </Button>
            </div>
          </Card>

          <Card padding="lg" className="space-y-3">
            <h4 className="text-xs font-bold uppercase tracking-wider text-white">
              Active Browser Sessions
            </h4>
            <div className="p-3 bg-[#151518] rounded-xl border border-neutral-800 flex items-center justify-between text-xs">
              <div>
                <span className="text-white font-semibold block">Current Browser (Vite SPA)</span>
                <span className="text-neutral-500 text-[10px] font-mono-num">
                  Localhost / Preview Environment • Active Now
                </span>
              </div>
              <Badge variant="success" size="sm">
                CURRENT
              </Badge>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
};
