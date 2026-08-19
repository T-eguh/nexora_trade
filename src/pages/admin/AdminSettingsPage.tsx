import React, { useState } from 'react';
import { Card } from '../../components/Card';
import { Button } from '../../components/Button';
import { Input } from '../../components/Input';
import { useSiteSettings } from '../../hooks/useStorage';
import { StorageService } from '../../utils/storage';
import { Settings, RefreshCw, CheckCircle2, ShieldAlert } from 'lucide-react';

export const AdminSettingsPage: React.FC = () => {
  const { settings } = useSiteSettings();

  const [brandName, setBrandName] = useState(settings.brandName);
  const [tagline, setTagline] = useState(settings.tagline);
  const [email, setEmail] = useState(settings.email);
  const [phone, setPhone] = useState(settings.phone);
  const [supportHours, setSupportHours] = useState(settings.supportHours);
  const [riskWarning, setRiskWarning] = useState(settings.riskWarning);

  const [successMsg, setSuccessMsg] = useState<string | null>(null);

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    StorageService.updateSiteSettings({
      brandName,
      tagline,
      email,
      phone,
      supportHours,
      riskWarning,
    });

    setSuccessMsg('Global platform configuration saved.');
    setTimeout(() => setSuccessMsg(null), 2500);
  };

  const handleResetData = () => {
    if (confirm('Reset all demo state (users, accounts, positions, trades) to initial factory defaults?')) {
      StorageService.resetToDefaults();
      window.location.reload();
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-white tracking-tight">Platform Configuration</h1>
        <p className="text-xs text-neutral-400">
          Control global system branding, support endpoints, risk warnings, and system state resets.
        </p>
      </div>

      {successMsg && (
        <div className="p-3.5 bg-emerald-950/60 border border-emerald-800 rounded-xl text-emerald-300 text-xs flex items-center gap-2">
          <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
          <span>{successMsg}</span>
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
        <div className="md:col-span-8">
          <Card padding="lg">
            <form onSubmit={handleSave} className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <Input
                  label="Brand Name"
                  value={brandName}
                  onChange={(e) => setBrandName(e.target.value)}
                  required
                />
                <Input
                  label="Tagline"
                  value={tagline}
                  onChange={(e) => setTagline(e.target.value)}
                  required
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <Input
                  label="Support Email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
                <Input
                  label="Support Phone"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  required
                />
              </div>

              <Input
                label="Support Desk Working Hours"
                value={supportHours}
                onChange={(e) => setSupportHours(e.target.value)}
                required
              />

              <div className="space-y-1">
                <label className="block text-xs font-semibold text-neutral-300 uppercase">
                  Global Risk Warning Footer Disclaimer
                </label>
                <textarea
                  rows={3}
                  className="w-full bg-[#151518] text-white text-xs rounded-lg border border-neutral-800 p-2.5 focus:outline-none focus:ring-1 focus:ring-red-500"
                  value={riskWarning}
                  onChange={(e) => setRiskWarning(e.target.value)}
                  required
                />
              </div>

              <div className="pt-2">
                <Button type="submit" size="md">
                  Save Platform Settings
                </Button>
              </div>
            </form>
          </Card>
        </div>

        {/* Maintenance / Factory Reset */}
        <div className="md:col-span-4 space-y-4">
          <Card padding="md" className="space-y-3 bg-[#111114] border-red-900/30">
            <div className="flex items-center gap-2 text-red-400 font-bold text-xs">
              <ShieldAlert className="w-4 h-4" />
              <span>Factory State Reset</span>
            </div>
            <p className="text-xs text-neutral-400 leading-relaxed">
              Restore initial accounts, demo balances, market instruments, and clear test positions.
            </p>
            <Button
              variant="danger"
              size="sm"
              fullWidth
              onClick={handleResetData}
            >
              <RefreshCw className="w-3.5 h-3.5 mr-1" /> Reset All Demo Data
            </Button>
          </Card>
        </div>
      </div>
    </div>
  );
};
