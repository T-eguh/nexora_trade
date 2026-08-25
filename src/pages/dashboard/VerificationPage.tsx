import React, { useState, useRef } from 'react';
import { useAuth, useKyc } from '../../hooks/useStorage';
import {
  FileText,
  UploadCloud,
  CheckCircle2,
  AlertCircle,
  Clock,
  ShieldCheck,
  Image as ImageIcon,
  User,
  CreditCard,
  MapPin,
  Calendar,
  X,
  Eye,
  RefreshCw,
  AlertTriangle,
} from 'lucide-react';

export const VerificationPage: React.FC = () => {
  const { user } = useAuth();
  const { documents, submitKycDocument } = useKyc();

  const userDoc = documents.find((d) => d.userId === user?.id) || (user?.kycStatus ? {
    id: 'kyc-user',
    userId: user.id,
    fullName: user.name,
    nik: user.nik || '3201018291020001',
    ktpImageUrl: user.ktpImageUrl || '',
    uploadedAt: user.kycSubmittedAt || new Date().toISOString(),
    status: user.kycStatus,
    rejectionReason: user.kycRejectionReason,
  } : undefined);

  // Form states
  const [fullName, setFullName] = useState(user?.name || '');
  const [nik, setNik] = useState(user?.nik || '');
  const [birthDate, setBirthDate] = useState('');
  const [address, setAddress] = useState('');
  const [ktpImageBase64, setKtpImageBase64] = useState<string>('');
  const [ktpFileName, setKtpFileName] = useState<string>('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [successToast, setSuccessToast] = useState<string | null>(null);
  const [previewModalOpen, setPreviewModalOpen] = useState(false);

  const fileInputRef = useRef<HTMLInputElement | null>(null);

  // Handle File Selection (JPG, PNG, WebP, PDF)
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.size > 5 * 1024 * 1024) {
      alert('Ukuran file maksimal 5 MB.');
      return;
    }

    setKtpFileName(file.name);

    const reader = new FileReader();
    reader.onload = () => {
      if (typeof reader.result === 'string') {
        setKtpImageBase64(reader.result);
      }
    };
    reader.readAsDataURL(file);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;

    if (!ktpImageBase64) {
      alert('Silakan upload foto KTP Anda terlebih dahulu.');
      return;
    }

    if (nik.length < 16) {
      alert('Nomor NIK KTP harus berjumlah 16 digit.');
      return;
    }

    setIsSubmitting(true);

    setTimeout(() => {
      submitKycDocument({
        userId: user.id,
        fullName: fullName.trim(),
        nik: nik.trim(),
        birthDate,
        address,
        ktpImageUrl: ktpImageBase64,
      });

      setIsSubmitting(false);
      setSuccessToast('Formulir dan foto KTP berhasil dikirim ke Admin untuk verifikasi!');
    }, 700);
  };

  const status = user?.kycStatus || userDoc?.status || 'unverified';

  return (
    <div className="max-w-4xl mx-auto space-y-6 font-sans">
      {/* Header */}
      <div className="space-y-1">
        <div className="flex items-center gap-2">
          <span className="px-2.5 py-0.5 rounded-full bg-red-100 text-red-700 text-[10px] font-bold tracking-wide uppercase">
            Verifikasi Identitas Sederhana
          </span>
          <span className="text-xs text-neutral-500 font-medium">Upload KTP Mandiri (Tanpa Face Scan Rumit)</span>
        </div>
        <h1 className="text-xl sm:text-2xl font-bold text-neutral-900 tracking-tight">
          Form Dokumen & Verifikasi KTP
        </h1>
        <p className="text-xs text-neutral-500 leading-relaxed">
          Cukup isi data diri sesuai KTP dan upload foto KTP Anda. Admin kami akan memeriksa dan mengaktifkan akun Anda secara manual.
        </p>
      </div>

      {/* Success Notification */}
      {successToast && (
        <div className="p-4 bg-emerald-50 border border-emerald-300 text-emerald-900 rounded-xl text-xs sm:text-sm font-medium flex items-center gap-2 shadow-xs animate-fadeIn">
          <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />
          <span>{successToast}</span>
        </div>
      )}

      {/* STATUS BANNER */}
      {status === 'verified' && (
        <div className="p-5 bg-emerald-50 border border-emerald-200 rounded-2xl flex items-center justify-between gap-4">
          <div className="flex items-center gap-3.5">
            <div className="w-12 h-12 rounded-xl bg-emerald-600 text-white flex items-center justify-center shadow-sm">
              <ShieldCheck className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <strong className="text-sm font-bold text-emerald-950">Akun Anda Telah Terverifikasi (KTP Approved)</strong>
                <span className="px-2 py-0.5 rounded-full bg-emerald-200 text-emerald-900 text-[10px] font-bold">
                  RESMI & AKTIF
                </span>
              </div>
              <p className="text-xs text-emerald-800 mt-0.5">
                Dokumen KTP Anda atas nama <strong>{userDoc?.fullName || user?.name}</strong> telah disetujui admin. Semua fitur penarikan dan trading aktif penuh.
              </p>
            </div>
          </div>
          {userDoc?.ktpImageUrl && (
            <button
              type="button"
              onClick={() => setPreviewModalOpen(true)}
              className="px-3 py-1.5 bg-emerald-100 hover:bg-emerald-200 text-emerald-900 font-bold text-xs rounded-lg transition-colors flex items-center gap-1.5 cursor-pointer whitespace-nowrap"
            >
              <Eye className="w-4 h-4" />
              <span>Lihat KTP</span>
            </button>
          )}
        </div>
      )}

      {status === 'pending' && (
        <div className="p-5 bg-amber-50 border border-amber-300 rounded-2xl flex items-center justify-between gap-4">
          <div className="flex items-center gap-3.5">
            <div className="w-12 h-12 rounded-xl bg-amber-500 text-white flex items-center justify-center shadow-sm">
              <Clock className="w-6 h-6 animate-pulse" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <strong className="text-sm font-bold text-amber-950">Dokumen KTP Sedang Ditinjau Admin</strong>
                <span className="px-2 py-0.5 rounded-full bg-amber-200 text-amber-900 text-[10px] font-bold font-mono">
                  MENUNGGU KONFIRMASI
                </span>
              </div>
              <p className="text-xs text-amber-800 mt-0.5">
                Foto KTP Anda telah diterima. Admin keuangan/verifikasi sedang memeriksa kesesuaian nama dan NIK.
              </p>
            </div>
          </div>
          {(ktpImageBase64 || userDoc?.ktpImageUrl) && (
            <button
              type="button"
              onClick={() => setPreviewModalOpen(true)}
              className="px-3 py-1.5 bg-amber-100 hover:bg-amber-200 text-amber-900 font-bold text-xs rounded-lg transition-colors flex items-center gap-1.5 cursor-pointer whitespace-nowrap"
            >
              <Eye className="w-4 h-4" />
              <span>Pratinjau KTP</span>
            </button>
          )}
        </div>
      )}

      {status === 'rejected' && (
        <div className="p-5 bg-red-50 border border-red-300 rounded-2xl flex items-start gap-3.5">
          <div className="w-10 h-10 rounded-xl bg-red-600 text-white flex items-center justify-center shrink-0 mt-0.5 shadow-sm">
            <AlertCircle className="w-5 h-5" />
          </div>
          <div className="space-y-1">
            <strong className="text-sm font-bold text-red-950 block">Verifikasi KTP Ditolak</strong>
            <p className="text-xs text-red-800">
              Alasan Penolakan: <em>"{user?.kycRejectionReason || userDoc?.rejectionReason || 'Foto KTP buram / tidak terbaca jelas'}"</em>.
            </p>
            <p className="text-xs text-neutral-600">
              Silakan unggah kembali foto KTP yang lebih jelas dan pastikan nomor NIK sesuai dengan kartu fisik Anda.
            </p>
          </div>
        </div>
      )}

      {/* FORM UPLOAD DOKUMEN & FOTO KTP */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Form Column */}
        <div className="lg:col-span-8 bg-white rounded-2xl p-6 sm:p-7 border border-neutral-200 shadow-sm space-y-6">
          <form onSubmit={handleSubmit} className="space-y-5">
            <div className="pb-3 border-b border-neutral-100 flex items-center justify-between">
              <h2 className="text-sm font-bold text-neutral-900 uppercase tracking-wider flex items-center gap-2">
                <FileText className="w-4 h-4 text-red-600" />
                <span>Formulir Data Dokumen KTP</span>
              </h2>
              <span className="text-[11px] text-neutral-500">* Wajib diisi</span>
            </div>

            {/* Nama Lengkap Sesuai KTP */}
            <div className="space-y-1.5">
              <label className="block text-xs font-bold text-neutral-800 uppercase tracking-wider">
                Nama Lengkap (Sesuai KTP) <span className="text-red-600">*</span>
              </label>
              <div className="relative">
                <User className="w-4 h-4 text-neutral-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  required
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  placeholder="Contoh: AHMAD ISMAIL"
                  className="w-full pl-10 pr-4 py-3 rounded-xl border border-neutral-300 text-sm font-semibold text-neutral-900 focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-red-500 transition-all uppercase"
                />
              </div>
            </div>

            {/* NIK KTP (16 Digit) */}
            <div className="space-y-1.5">
              <label className="block text-xs font-bold text-neutral-800 uppercase tracking-wider">
                Nomor NIK KTP (16 Digit) <span className="text-red-600">*</span>
              </label>
              <div className="relative">
                <CreditCard className="w-4 h-4 text-neutral-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  required
                  maxLength={16}
                  value={nik}
                  onChange={(e) => setNik(e.target.value.replace(/\D/g, ''))}
                  placeholder="3201012304950002"
                  className="w-full pl-10 pr-4 py-3 rounded-xl border border-neutral-300 font-mono text-sm font-bold text-neutral-900 focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-red-500 transition-all tracking-wider"
                />
              </div>
              <span className="text-[11px] text-neutral-400">
                Jumlah digit: {nik.length}/16
              </span>
            </div>

            {/* Tanggal Lahir & Alamat (Opsional) */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <label className="block text-xs font-bold text-neutral-800 uppercase tracking-wider">
                  Tanggal Lahir
                </label>
                <div className="relative">
                  <Calendar className="w-4 h-4 text-neutral-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                  <input
                    type="date"
                    value={birthDate}
                    onChange={(e) => setBirthDate(e.target.value)}
                    className="w-full pl-10 pr-4 py-3 rounded-xl border border-neutral-300 text-xs font-medium text-neutral-900 focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-red-500 transition-all"
                  />
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="block text-xs font-bold text-neutral-800 uppercase tracking-wider">
                  Kota / Alamat Domisili
                </label>
                <div className="relative">
                  <MapPin className="w-4 h-4 text-neutral-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                  <input
                    type="text"
                    value={address}
                    onChange={(e) => setAddress(e.target.value)}
                    placeholder="Contoh: Jakarta Selatan"
                    className="w-full pl-10 pr-4 py-3 rounded-xl border border-neutral-300 text-xs font-medium text-neutral-900 focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-red-500 transition-all"
                  />
                </div>
              </div>
            </div>

            {/* UPLOAD FOTO KTP */}
            <div className="space-y-2 pt-2">
              <label className="block text-xs font-bold text-neutral-800 uppercase tracking-wider">
                Upload Foto KTP Asli <span className="text-red-600">*</span>
              </label>

              {/* Hidden Native File Input */}
              <input
                type="file"
                ref={fileInputRef}
                accept="image/png, image/jpeg, image/jpg, image/webp"
                onChange={handleFileChange}
                className="hidden"
              />

              {/* Upload Box Dropzone */}
              {!ktpImageBase64 && !userDoc?.ktpImageUrl ? (
                <div
                  onClick={() => fileInputRef.current?.click()}
                  className="border-2 border-dashed border-neutral-300 hover:border-red-500 rounded-2xl p-6 sm:p-8 text-center cursor-pointer transition-all bg-neutral-50 hover:bg-red-50/30 group space-y-3"
                >
                  <div className="w-14 h-14 rounded-2xl bg-white border border-neutral-200 text-neutral-600 group-hover:text-red-600 flex items-center justify-center mx-auto shadow-xs transition-colors">
                    <UploadCloud className="w-7 h-7" />
                  </div>
                  <div className="space-y-1">
                    <p className="text-xs font-bold text-neutral-900">
                      Klik untuk Memilih / Mengambil Foto KTP
                    </p>
                    <p className="text-[11px] text-neutral-500">
                      Format didukung: JPG, PNG, WebP (Maksimal 5 MB)
                    </p>
                  </div>
                </div>
              ) : (
                /* Selected File Preview Box */
                <div className="p-4 bg-neutral-50 rounded-2xl border border-neutral-200 space-y-3">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="w-12 h-12 rounded-xl bg-red-100 text-red-700 flex items-center justify-center font-bold">
                        <ImageIcon className="w-6 h-6" />
                      </div>
                      <div>
                        <strong className="text-xs font-bold text-neutral-900 block truncate max-w-xs">
                          {ktpFileName || 'Foto_KTP.jpg'}
                        </strong>
                        <span className="text-[10px] text-emerald-700 font-bold bg-emerald-100 px-2 py-0.5 rounded">
                          File Siap Dikirim
                        </span>
                      </div>
                    </div>

                    <div className="flex items-center gap-2">
                      <button
                        type="button"
                        onClick={() => setPreviewModalOpen(true)}
                        className="px-2.5 py-1.5 bg-white hover:bg-neutral-100 text-neutral-700 text-xs font-bold rounded-lg border border-neutral-200 flex items-center gap-1 cursor-pointer"
                      >
                        <Eye className="w-3.5 h-3.5" />
                        <span>Pratinjau</span>
                      </button>
                      <button
                        type="button"
                        onClick={() => fileInputRef.current?.click()}
                        className="px-2.5 py-1.5 bg-red-50 hover:bg-red-100 text-red-700 text-xs font-bold rounded-lg border border-red-200 flex items-center gap-1 cursor-pointer"
                      >
                        <RefreshCw className="w-3.5 h-3.5" />
                        <span>Ganti</span>
                      </button>
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Petunjuk Foto KTP */}
            <div className="p-3.5 bg-neutral-50 rounded-xl border border-neutral-200 text-xs space-y-1.5 text-neutral-600">
              <strong className="font-bold text-neutral-800 block text-[11px] uppercase tracking-wider">
                Ketentuan Foto KTP:
              </strong>
              <ul className="list-disc pl-4 space-y-0.5 text-[11px] leading-relaxed">
                <li>Foto KTP harus jelas, tidak buram, dan teks NIK serta nama terbaca.</li>
                <li>Seluruh 4 sudut kartu KTP harus terlihat di dalam bingkai foto.</li>
                <li>Tidak boleh menggunakan KTP fotokopi hitam putih (harus KTP fisik asli).</li>
              </ul>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full py-4 bg-red-600 hover:bg-red-700 text-white font-bold text-xs uppercase tracking-wider rounded-xl transition-all shadow-md active:scale-98 cursor-pointer disabled:opacity-50 flex items-center justify-center gap-2"
            >
              {isSubmitting ? (
                <span>Menyimpan & Mengirim Dokumen...</span>
              ) : (
                <>
                  <UploadCloud className="w-4 h-4" />
                  <span>Kirim Dokumen KTP untuk Verifikasi</span>
                </>
              )}
            </button>
          </form>
        </div>

        {/* Right Info Column */}
        <div className="lg:col-span-4 space-y-4">
          <div className="bg-white rounded-2xl p-5 border border-neutral-200 shadow-sm space-y-4 text-xs">
            <h3 className="font-bold text-neutral-900 pb-2 border-b border-neutral-100 flex items-center gap-2">
              <ShieldCheck className="w-4 h-4 text-emerald-600" />
              <span>Kenapa Perlu Upload KTP?</span>
            </h3>

            <div className="space-y-2.5 text-neutral-600 text-[11px] leading-relaxed">
              <p>
                1. <strong>Keamanan Akun:</strong> Memastikan penarikan dana hanya dapat dikirim ke rekening bank atas nama pemilik akun yang sah.
              </p>
              <p>
                2. <strong>Proses Manual Cepat:</strong> Tanpa perlu scan wajah biometrik otomatis yang sering gagal. Dokumen diperiksa langsung oleh admin broker.
              </p>
              <p>
                3. <strong>Kerahasiaan Terjamin:</strong> Data KTP Anda dienkripsi dan hanya digunakan untuk verifikasi kepemilikan akun trading.
              </p>
            </div>

            <div className="p-3 bg-red-50 rounded-xl border border-red-200 text-red-900 text-[11px]">
              <strong>Perhatian:</strong> Pastikan nama di KTP sama dengan nama rekening bank tujuan saat Anda melakukan penarikan dana (Withdraw).
            </div>
          </div>
        </div>
      </div>

      {/* MODAL PRATINJAU FOTO KTP */}
      {previewModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-xs flex items-center justify-center p-4 animate-fadeIn">
          <div className="w-full max-w-lg bg-white rounded-2xl p-5 border border-neutral-200 shadow-2xl space-y-4 animate-scaleUp text-neutral-900 relative">
            <div className="flex items-center justify-between border-b border-neutral-200 pb-2.5">
              <h3 className="text-sm font-bold text-neutral-900 flex items-center gap-2">
                <FileText className="w-4 h-4 text-red-600" />
                <span>Pratinjau Foto KTP</span>
              </h3>
              <button
                type="button"
                onClick={() => setPreviewModalOpen(false)}
                className="text-neutral-400 hover:text-neutral-700 cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Image Preview Box */}
            <div className="bg-neutral-900 rounded-xl overflow-hidden flex items-center justify-center min-h-[220px] max-h-[360px] border border-neutral-800">
              {ktpImageBase64 || userDoc?.ktpImageUrl ? (
                <img
                  src={ktpImageBase64 || userDoc?.ktpImageUrl}
                  alt="Foto KTP"
                  className="max-h-[340px] w-auto object-contain rounded-lg shadow-md"
                />
              ) : (
                <div className="text-neutral-400 text-xs p-6 text-center">
                  Foto KTP belum diunggah.
                </div>
              )}
            </div>

            <div className="bg-neutral-50 p-3 rounded-xl border border-neutral-200 text-xs space-y-1">
              <div className="flex justify-between">
                <span className="text-neutral-500">Nama di Dokumen:</span>
                <strong className="text-neutral-900">{fullName || user?.name}</strong>
              </div>
              <div className="flex justify-between">
                <span className="text-neutral-500">NIK:</span>
                <strong className="font-mono text-neutral-900">{nik || user?.nik || '-'}</strong>
              </div>
            </div>

            <button
              type="button"
              onClick={() => setPreviewModalOpen(false)}
              className="w-full py-2.5 bg-neutral-900 hover:bg-black text-white font-bold text-xs rounded-xl transition-colors cursor-pointer"
            >
              Tutup Pratinjau
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
