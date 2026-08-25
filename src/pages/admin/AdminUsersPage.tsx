import React, { useState } from 'react';
import { Card } from '../../components/Card';
import { Badge } from '../../components/Badge';
import { Button } from '../../components/Button';
import { Input } from '../../components/Input';
import { Select } from '../../components/Select';
import { Modal } from '../../components/Modal';
import { Table, Column } from '../../components/Table';
import { useUsers, useKyc } from '../../hooks/useStorage';
import { StorageService } from '../../utils/storage';
import { User, KycDocument } from '../../types';
import {
  Users,
  Plus,
  Search,
  Trash2,
  Shield,
  CheckCircle2,
  FileText,
  Eye,
  Check,
  X,
  AlertTriangle,
  CreditCard,
  ExternalLink,
} from 'lucide-react';

export const AdminUsersPage: React.FC = () => {
  const { users } = useUsers();
  const { documents, updateKycStatus } = useKyc();
  const [search, setSearch] = useState('');
  const [activeTab, setActiveTab] = useState<'users' | 'kyc'>('kyc');
  const [createModalOpen, setCreateModalOpen] = useState(false);
  const [reviewDoc, setReviewDoc] = useState<KycDocument | null>(null);
  const [rejectionReason, setRejectionReason] = useState('');
  const [actionFeedback, setActionFeedback] = useState<string | null>(null);

  // Form fields for new user creation
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('demo123');
  const [role, setRole] = useState<'user' | 'admin'>('user');
  const [country, setCountry] = useState('Indonesia');
  const [successMsg, setSuccessMsg] = useState<string | null>(null);

  const filteredUsers = users.filter(
    (u) =>
      u.name.toLowerCase().includes(search.toLowerCase()) ||
      u.email.toLowerCase().includes(search.toLowerCase()) ||
      u.country.toLowerCase().includes(search.toLowerCase())
  );

  const pendingKycCount = documents.filter((d) => d.status === 'pending').length;

  const handleApproveKyc = (doc: KycDocument) => {
    updateKycStatus(doc.id, 'verified');
    setActionFeedback(`Dokumen KTP atas nama ${doc.fullName} berhasil disetujui (STATUS VERIFIED)!`);
    setReviewDoc(null);
    setTimeout(() => setActionFeedback(null), 4000);
  };

  const handleRejectKyc = (doc: KycDocument) => {
    const reason = rejectionReason.trim() || 'Foto KTP buram / data tidak sesuai';
    updateKycStatus(doc.id, 'rejected', reason);
    setActionFeedback(`Dokumen KTP ${doc.fullName} ditolak. Alasan: ${reason}`);
    setReviewDoc(null);
    setRejectionReason('');
    setTimeout(() => setActionFeedback(null), 4000);
  };

  const handleDeleteUser = (id: string) => {
    if (confirm('Apakah Anda yakin ingin menghapus profil pengguna ini?')) {
      StorageService.deleteUser(id);
    }
  };

  const handleCreateUser = (e: React.FormEvent) => {
    e.preventDefault();

    const newUser: Omit<User, 'id' | 'createdAt'> = {
      name,
      email,
      role,
      status: 'active',
      password,
      country,
      phone: '+62 812 3456 7890',
      accountTier: 'Pro',
      twoFactorEnabled: false,
    };

    StorageService.addUser(newUser);
    setSuccessMsg(`User ${name} berhasil ditambahkan.`);
    setTimeout(() => {
      setSuccessMsg(null);
      setCreateModalOpen(false);
      setName('');
      setEmail('');
    }, 1500);
  };

  // Columns for KYC Verification Tab
  const kycColumns: Column<KycDocument>[] = [
    {
      header: 'Nama & NIK KTP',
      render: (doc) => (
        <div>
          <strong className="text-white text-xs block font-bold">{doc.fullName}</strong>
          <span className="text-[11px] text-emerald-400 font-mono font-bold tracking-wider">
            NIK: {doc.nik}
          </span>
        </div>
      ),
    },
    {
      header: 'Tanggal Upload',
      render: (doc) => (
        <span className="text-xs text-neutral-400 font-mono">
          {new Date(doc.uploadedAt).toLocaleString([], { dateStyle: 'medium', timeStyle: 'short' })}
        </span>
      ),
    },
    {
      header: 'Foto KTP',
      render: (doc) => (
        <button
          type="button"
          onClick={() => setReviewDoc(doc)}
          className="px-2.5 py-1 bg-[#1e2029] hover:bg-[#282b37] border border-neutral-700 rounded text-xs text-white flex items-center gap-1.5 cursor-pointer font-medium"
        >
          <Eye className="w-3.5 h-3.5 text-red-400" />
          <span>Lihat Foto KTP</span>
        </button>
      ),
    },
    {
      header: 'Status',
      render: (doc) => {
        const isVerified = doc.status === 'verified';
        const isPending = doc.status === 'pending';
        return (
          <Badge
            variant={isVerified ? 'success' : isPending ? 'warning' : 'danger'}
            size="sm"
          >
            {isPending ? 'PENDING APPROVAL' : doc.status.toUpperCase()}
          </Badge>
        );
      },
    },
    {
      header: 'Aksi Verifikasi Admin',
      align: 'right',
      render: (doc) => (
        <div className="flex items-center justify-end gap-2">
          {doc.status === 'pending' ? (
            <>
              <button
                type="button"
                onClick={() => handleApproveKyc(doc)}
                className="px-3 py-1.5 text-xs font-bold bg-emerald-600 hover:bg-emerald-500 text-white rounded-lg transition-all shadow cursor-pointer flex items-center gap-1 active:scale-95"
                title="Setujui KTP Pengguna"
              >
                <Check className="w-3.5 h-3.5" />
                <span>Approve KTP</span>
              </button>
              <button
                type="button"
                onClick={() => setReviewDoc(doc)}
                className="px-2.5 py-1.5 text-xs font-bold bg-red-900/60 hover:bg-red-800 text-red-300 border border-red-700/60 rounded-lg transition-colors cursor-pointer flex items-center gap-1"
                title="Tolak Verifikasi KTP"
              >
                <X className="w-3.5 h-3.5" />
                <span>Tolak</span>
              </button>
            </>
          ) : (
            <span className="text-xs text-neutral-400 font-mono">
              {doc.status === 'verified' ? '✓ Disetujui' : '✕ Ditolak'}
            </span>
          )}
        </div>
      ),
    },
  ];

  // Columns for All Users Tab
  const userColumns: Column<User>[] = [
    {
      header: 'User Name',
      render: (u) => (
        <div>
          <strong className="text-white text-xs block">{u.name}</strong>
          <span className="text-[10px] text-neutral-400 font-mono">{u.id}</span>
        </div>
      ),
    },
    {
      header: 'Email Address',
      render: (u) => <span className="text-xs text-neutral-300 font-mono">{u.email}</span>,
    },
    {
      header: 'KYC / KTP',
      render: (u) => {
        const status = u.kycStatus || 'unverified';
        return (
          <Badge
            variant={status === 'verified' ? 'success' : status === 'pending' ? 'warning' : 'neutral'}
            size="sm"
          >
            {status.toUpperCase()}
          </Badge>
        );
      },
    },
    {
      header: 'Role',
      render: (u) => (
        <Badge variant={u.role === 'admin' ? 'red' : 'neutral'} size="sm">
          {u.role.toUpperCase()}
        </Badge>
      ),
    },
    {
      header: 'Country',
      render: (u) => <span className="text-xs text-neutral-300">{u.country}</span>,
    },
    {
      header: 'Created',
      render: (u) => (
        <span className="text-xs text-neutral-400 font-mono">
          {new Date(u.createdAt).toLocaleDateString()}
        </span>
      ),
    },
    {
      header: 'Action',
      align: 'right',
      render: (u) => (
        <button
          onClick={() => handleDeleteUser(u.id)}
          className="p-1.5 rounded bg-red-950/40 text-red-400 hover:bg-red-900 border border-red-800/60 transition-colors cursor-pointer"
          title="Delete User"
        >
          <Trash2 className="w-3.5 h-3.5" />
        </button>
      ),
    },
  ];

  return (
    <div className="space-y-6">
      {/* Toast Feedback */}
      {actionFeedback && (
        <div className="p-4 bg-emerald-900/90 border border-emerald-500 text-emerald-100 rounded-xl font-medium text-xs sm:text-sm flex items-center gap-2 shadow-xl animate-fadeIn">
          <CheckCircle2 className="w-5 h-5 text-emerald-300 shrink-0" />
          <span>{actionFeedback}</span>
        </div>
      )}

      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-2xl font-bold text-white tracking-tight">Manajemen Pengguna & Verifikasi KTP</h1>
            {pendingKycCount > 0 && (
              <span className="px-2.5 py-0.5 rounded-full bg-amber-500/20 text-amber-300 border border-amber-500/40 text-xs font-bold animate-pulse">
                {pendingKycCount} KTP Menunggu Approval
              </span>
            )}
          </div>
          <p className="text-xs text-neutral-400 mt-0.5">
            Pemeriksaan dokumen foto KTP yang diunggah pengguna serta manajemen akun trader.
          </p>
        </div>

        <Button onClick={() => setCreateModalOpen(true)} size="md">
          <Plus className="w-4 h-4 mr-1.5" /> Buat Pengguna Baru
        </Button>
      </div>

      {/* Tabs */}
      <div className="flex items-center gap-2 border-b border-neutral-800 pb-2">
        <button
          type="button"
          onClick={() => setActiveTab('kyc')}
          className={`px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center gap-2 ${
            activeTab === 'kyc'
              ? 'bg-red-600 text-white shadow-md'
              : 'bg-[#151518] text-neutral-400 hover:text-white border border-neutral-800'
          }`}
        >
          <FileText className="w-4 h-4" />
          <span>Verifikasi Dokumen KTP</span>
          {pendingKycCount > 0 && (
            <span className="px-1.5 py-0.2 bg-white text-red-600 rounded-full font-black text-[10px]">
              {pendingKycCount}
            </span>
          )}
        </button>

        <button
          type="button"
          onClick={() => setActiveTab('users')}
          className={`px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center gap-2 ${
            activeTab === 'users'
              ? 'bg-red-600 text-white shadow-md'
              : 'bg-[#151518] text-neutral-400 hover:text-white border border-neutral-800'
          }`}
        >
          <Users className="w-4 h-4" />
          <span>Semua Pengguna ({users.length})</span>
        </button>
      </div>

      {/* TAB CONTENT: KYC VERIFICATION */}
      {activeTab === 'kyc' && (
        <Card padding="md">
          <div className="flex items-center justify-between gap-4 mb-4">
            <h3 className="text-sm font-bold text-white flex items-center gap-2">
              <Shield className="w-4 h-4 text-emerald-400" />
              <span>Daftar Pengajuan Dokumen KTP</span>
            </h3>
            <span className="text-xs text-neutral-400 font-mono">
              Total {documents.length} Dokumen Diajukan
            </span>
          </div>

          <Table
            columns={kycColumns}
            data={documents}
            keyExtractor={(d) => d.id}
            emptyMessage="Belum ada dokumen KTP yang diunggah pengguna."
          />
        </Card>
      )}

      {/* TAB CONTENT: ALL USERS */}
      {activeTab === 'users' && (
        <Card padding="md">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4 mb-6">
            <div className="w-full sm:w-80">
              <Input
                placeholder="Cari nama, email, negara..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                leftIcon={<Search className="w-4 h-4 text-neutral-400" />}
                className="py-1.5 text-xs"
              />
            </div>
            <span className="text-xs text-neutral-400 font-mono">
              Total: {filteredUsers.length} Users
            </span>
          </div>

          <Table
            columns={userColumns}
            data={filteredUsers}
            keyExtractor={(u) => u.id}
            emptyMessage="Tidak ada pengguna yang cocok dengan pencarian."
          />
        </Card>
      )}

      {/* MODAL REVIEW FOTO KTP & APPROVAL ADMIN */}
      {reviewDoc && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-xs flex items-center justify-center p-4 animate-fadeIn">
          <div className="w-full max-w-lg bg-[#14151b] border border-neutral-800 rounded-2xl p-6 shadow-2xl space-y-4 text-white animate-scaleUp">
            <div className="flex items-center justify-between border-b border-neutral-800 pb-3">
              <div className="flex items-center gap-2">
                <FileText className="w-5 h-5 text-red-500" />
                <h3 className="font-bold text-sm text-white">
                  Verifikasi Dokumen KTP: {reviewDoc.fullName}
                </h3>
              </div>
              <button
                type="button"
                onClick={() => setReviewDoc(null)}
                className="text-neutral-400 hover:text-white"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Foto KTP Display */}
            <div className="bg-black rounded-xl p-2 flex items-center justify-center min-h-[220px] max-h-[340px] overflow-hidden border border-neutral-800">
              {reviewDoc.ktpImageUrl ? (
                <img
                  src={reviewDoc.ktpImageUrl}
                  alt="Foto KTP User"
                  className="max-h-[320px] w-auto object-contain rounded-lg"
                />
              ) : (
                <span className="text-xs text-neutral-500">Tidak ada gambar KTP</span>
              )}
            </div>

            {/* User Details */}
            <div className="bg-[#1b1d26] p-3.5 rounded-xl border border-neutral-800 text-xs space-y-1.5 font-mono">
              <div className="flex justify-between">
                <span className="text-neutral-400 font-sans">Nama Lengkap:</span>
                <strong className="text-white font-bold">{reviewDoc.fullName}</strong>
              </div>
              <div className="flex justify-between">
                <span className="text-neutral-400 font-sans">Nomor NIK:</span>
                <strong className="text-emerald-400">{reviewDoc.nik}</strong>
              </div>
              {reviewDoc.birthDate && (
                <div className="flex justify-between">
                  <span className="text-neutral-400 font-sans">Tanggal Lahir:</span>
                  <span className="text-neutral-300">{reviewDoc.birthDate}</span>
                </div>
              )}
              {reviewDoc.address && (
                <div className="flex justify-between">
                  <span className="text-neutral-400 font-sans">Alamat:</span>
                  <span className="text-neutral-300 font-sans">{reviewDoc.address}</span>
                </div>
              )}
            </div>

            {/* Rejection input if needed */}
            <div className="space-y-1">
              <label className="block text-[11px] text-neutral-400">
                Catatan Penolakan (Jika Ingin Ditolak):
              </label>
              <input
                type="text"
                value={rejectionReason}
                onChange={(e) => setRejectionReason(e.target.value)}
                placeholder="Contoh: Foto KTP buram, silakan upload ulang."
                className="w-full px-3 py-2 bg-[#1b1d26] border border-neutral-700 rounded-lg text-xs text-white focus:outline-none focus:border-red-500"
              />
            </div>

            {/* Action Buttons */}
            <div className="grid grid-cols-2 gap-3 pt-2">
              <button
                type="button"
                onClick={() => handleRejectKyc(reviewDoc)}
                className="py-2.5 px-4 bg-red-900/60 hover:bg-red-800 text-red-200 font-bold text-xs rounded-xl border border-red-700 transition-colors cursor-pointer flex items-center justify-center gap-1.5"
              >
                <X className="w-4 h-4" />
                <span>Tolak Dokumen</span>
              </button>
              <button
                type="button"
                onClick={() => handleApproveKyc(reviewDoc)}
                className="py-2.5 px-4 bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs rounded-xl transition-all shadow-md cursor-pointer flex items-center justify-center gap-1.5"
              >
                <Check className="w-4 h-4" />
                <span>Setujui (Approve)</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Create User Modal */}
      <Modal
        isOpen={createModalOpen}
        onClose={() => setCreateModalOpen(false)}
        title="Buat Profil Pengguna Baru"
      >
        {successMsg ? (
          <div className="p-6 text-center space-y-2">
            <CheckCircle2 className="w-8 h-8 text-emerald-400 mx-auto" />
            <p className="text-sm font-bold text-white">{successMsg}</p>
          </div>
        ) : (
          <form onSubmit={handleCreateUser} className="space-y-4">
            <Input
              label="Nama Lengkap"
              placeholder="Contoh: Jordan Belfort"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
            />

            <Input
              label="Alamat Email"
              type="email"
              placeholder="user@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <Input
                label="Password"
                type="text"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />

              <Select
                label="Role"
                value={role}
                onChange={(e) => setRole(e.target.value as 'user' | 'admin')}
                options={[
                  { value: 'user', label: 'Trader (User)' },
                  { value: 'admin', label: 'Administrator' },
                ]}
              />
            </div>

            <Select
              label="Negara"
              value={country}
              onChange={(e) => setCountry(e.target.value)}
              options={[
                { value: 'Indonesia', label: 'Indonesia' },
                { value: 'Singapore', label: 'Singapore' },
                { value: 'Malaysia', label: 'Malaysia' },
                { value: 'United States', label: 'United States' },
                { value: 'United Kingdom', label: 'United Kingdom' },
              ]}
            />

            <div className="flex justify-end gap-2 pt-2">
              <Button
                type="button"
                variant="secondary"
                onClick={() => setCreateModalOpen(false)}
              >
                Batal
              </Button>
              <Button type="submit">Buat Pengguna</Button>
            </div>
          </form>
        )}
      </Modal>
    </div>
  );
};
