import React, { useState } from 'react';
import { Card } from '../../components/Card';
import { Badge } from '../../components/Badge';
import { Button } from '../../components/Button';
import { Input } from '../../components/Input';
import { Select } from '../../components/Select';
import { useAuth } from '../../hooks/useStorage';
import { StorageService } from '../../utils/storage';
import { User, Mail, Phone, Globe, Shield, CheckCircle2 } from 'lucide-react';

export const ProfilePage: React.FC = () => {
  const { user } = useAuth();

  const [name, setName] = useState(user?.name || '');
  const [phone, setPhone] = useState(user?.phone || '');
  const [country, setCountry] = useState(user?.country || 'United States');
  const [successMsg, setSuccessMsg] = useState<string | null>(null);

  const handleUpdateProfile = (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;

    StorageService.updateUser(user.id, {
      name,
      phone,
      country,
    });

    setSuccessMsg('Personal profile information saved successfully.');
    setTimeout(() => setSuccessMsg(null), 2500);
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-white tracking-tight">Client Profile</h1>
        <p className="text-xs text-neutral-400">
          Manage your personal contact details, residential country, and account preferences.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* User Identity Card */}
        <div className="lg:col-span-4 space-y-4">
          <Card padding="md" className="text-center space-y-3">
            <div className="w-16 h-16 rounded-full bg-red-600/20 border-2 border-red-500 flex items-center justify-center text-red-400 font-black text-xl mx-auto">
              {user?.name ? user.name.substring(0, 2).toUpperCase() : 'NX'}
            </div>
            <div>
              <h3 className="text-base font-bold text-white">{user?.name}</h3>
              <p className="text-xs text-neutral-400 font-mono-num">{user?.email}</p>
            </div>
            <div className="flex justify-center gap-2 pt-1">
              <Badge variant="red" size="sm">
                {user?.role.toUpperCase()}
              </Badge>
              <Badge variant="success" size="sm">
                LIVE TERVERIFIKASI
              </Badge>
            </div>
          </Card>
        </div>

        {/* Update Form */}
        <div className="lg:col-span-8">
          <Card padding="lg">
            {successMsg && (
              <div className="p-3.5 mb-4 bg-emerald-950/60 border border-emerald-800 rounded-xl text-emerald-300 text-xs flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                <span>{successMsg}</span>
              </div>
            )}

            <form onSubmit={handleUpdateProfile} className="space-y-4">
              <Input
                label="Full Legal Name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                leftIcon={<User className="w-4 h-4 text-neutral-400" />}
                required
              />

              <Input
                label="Registered Email (Immutable)"
                value={user?.email || ''}
                disabled
                leftIcon={<Mail className="w-4 h-4 text-neutral-400" />}
                helperText="Email changes require security validation."
              />

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <Input
                  label="Contact Phone"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  leftIcon={<Phone className="w-4 h-4 text-neutral-400" />}
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

              <div className="pt-2">
                <Button type="submit" size="md">
                  Save Changes
                </Button>
              </div>
            </form>
          </Card>
        </div>
      </div>
    </div>
  );
};
