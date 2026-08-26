import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Card } from '../../components/Card';
import { Badge } from '../../components/Badge';
import { Button } from '../../components/Button';
import { Input } from '../../components/Input';
import { Select } from '../../components/Select';
import { useAuth } from '../../hooks/useStorage';
import { StorageService } from '../../utils/storage';
import { User, Mail, Phone, Globe, Shield, CheckCircle2, FileText, ArrowRight, Clock, AlertCircle } from 'lucide-react';

export const ProfilePage: React.FC = () => {
  const { user } = useAuth();
  const navigate = useNavigate();

  const [name, setName] = useState(user?.name || '');
  const [phone, setPhone] = useState(user?.phone || '');
  const [country, setCountry] = useState(user?.country || 'Indonesia');
  const [successMsg, setSuccessMsg] = useState<string | null>(null);

  const kycStatus = user?.kycStatus || 'unverified';

  const handleUpdateProfile = (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;

    StorageService.updateUser(user.id, {
      name,
      phone,
      country,
    });

    setSuccessMsg('Informasi profil berhasil diperbarui.');
    setTimeout(() => setSuccessMsg(null), 2500);
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-white tracking-tight">Profil Pengguna & Status KYC</h1>
        <p className="text-xs text-neutral-400">
          Kelola rincian kontak pribadi, negara domisili, dan status kelengkapan dokumen identitas KTP.
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
            <div className="flex justify-center flex-wrap gap-1.5 pt-1">
              <Badge variant="red" size="sm">
                {user?.role.toUpperCase()}
              </Badge>
              <Badge
                variant={
                  kycStatus === 'verified'
                    ? 'success'
                    : kycStatus === 'pending'
                    ? 'warning'
                    : 'danger'
                }
                size="sm"
              >
                {kycStatus === 'verified'
                  ? 'KTP TERVERIFIKASI'
                  : kycStatus === 'pending'
                  ? 'KTP MENUNGGU APPROVAL'
                  : 'KTP BELUM DIUPLOAD'}
              </Badge>
            </div>
          </Card>

          {/* Quick KYC Box */}
          <div className="p-4 bg-[#14151b] border border-neutral-800 rounded-2xl space-y-3 text-xs">
            <div className="flex items-center gap-2 text-white font-bold">
              <FileText className="w-4 h-4 text-red-500" />
              <span>Verifikasi Dokumen KTP</span>
            </div>
            <p className="text-[11px] text-neutral-400 leading-relaxed">
              Upload foto KTP Anda melalui form dokumen sederhana tanpa verifikasi scan wajah rumit.
            </p>
            <Link
              to="/dashboard/verification"
              className="w-full py-2.5 px-3 bg-red-600 hover:bg-red-700 text-white font-bold text-xs rounded-xl flex items-center justify-center gap-2 transition-all shadow"
            >
              <span>{kycStatus === 'verified' ? 'Lihat Dokumen KTP' : 'Buka Form Upload KTP'}</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          {/* Quick Password & Security Box */}
          <div className="p-4 bg-[#14151b] border border-neutral-800 rounded-2xl space-y-3 text-xs">
            <div className="flex items-center gap-2 text-white font-bold">
              <Shield className="w-4 h-4 text-amber-500" />
              <span>Ganti Sandi & Keamanan</span>
            </div>
            <p className="text-[11px] text-neutral-400 leading-relaxed">
              Ubah kata sandi login dan aktifkan proteksi otentikasi dua langkah (2FA).
            </p>
            <Link
              to="/dashboard/security"
              className="w-full py-2.5 px-3 bg-neutral-800 hover:bg-neutral-700 text-white font-bold text-xs rounded-xl flex items-center justify-center gap-2 transition-all border border-neutral-700"
            >
              <span>Pengaturan Kata Sandi</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>
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
                label="Nama Lengkap (Sesuai KTP)"
                value={name}
                onChange={(e) => setName(e.target.value)}
                leftIcon={<User className="w-4 h-4 text-neutral-400" />}
                required
              />

              <Input
                label="Alamat Email Terdaftar"
                value={user?.email || ''}
                disabled
                leftIcon={<Mail className="w-4 h-4 text-neutral-400" />}
                helperText="Email utama akun tidak dapat diubah sembarangan demi keamanan."
              />

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <Input
                  label="Nomor WhatsApp / Telepon"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  leftIcon={<Phone className="w-4 h-4 text-neutral-400" />}
                />

                <Select
                  label="Negara Domisili"
                  value={country}
                  onChange={(e) => setCountry(e.target.value)}
                  options={[
                    { value: 'Indonesia', label: 'Indonesia' },
                    { value: 'Singapore', label: 'Singapore' },
                    { value: 'Malaysia', label: 'Malaysia' },
                    { value: 'United States', label: 'United States' },
                    { value: 'United Kingdom', label: 'United Kingdom' },
                    { value: 'Australia', label: 'Australia' },
                    { value: 'Germany', label: 'Germany' },
                  ]}
                />
              </div>

              <div className="pt-2">
                <Button type="submit" size="md">
                  Simpan Perubahan
                </Button>
              </div>
            </form>
          </Card>
        </div>
      </div>
    </div>
  );
};
