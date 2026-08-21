import React, { useState } from 'react';
import { Card } from '../../components/Card';
import { Badge } from '../../components/Badge';
import { Button } from '../../components/Button';
import { Table, Column } from '../../components/Table';
import { Modal } from '../../components/Modal';
import { Input } from '../../components/Input';
import { Select } from '../../components/Select';
import { useTickets, useAuth, useSiteSettings } from '../../hooks/useStorage';
import { StorageService } from '../../utils/storage';
import { SupportTicket } from '../../types';
import {
  Plus,
  MessageSquare,
  CheckCircle2,
  Mail,
  Phone,
  Send,
} from 'lucide-react';

export const SupportPage: React.FC = () => {
  const { tickets } = useTickets();
  const { user } = useAuth();
  const { settings } = useSiteSettings();

  const [createModalOpen, setCreateModalOpen] = useState(false);
  const [selectedTicket, setSelectedTicket] = useState<SupportTicket | null>(null);

  const [subject, setSubject] = useState('');
  const [category, setCategory] = useState('Bantuan Teknis');
  const [priority, setPriority] = useState<'low' | 'medium' | 'high'>('medium');
  const [message, setMessage] = useState('');

  // Ticket reply state
  const [replyText, setReplyText] = useState('');
  const [successMsg, setSuccessMsg] = useState<string | null>(null);

  const handleCreateTicket = (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;

    const newTicket: Omit<SupportTicket, 'id' | 'createdAt' | 'updatedAt'> = {
      userId: user.id,
      userName: user.name,
      subject,
      department: category,
      category,
      priority,
      status: 'open',
      messages: [
        {
          id: `msg-${Date.now()}`,
          sender: 'user',
          message,
          timestamp: new Date().toISOString(),
        },
      ],
    };

    StorageService.addTicket(newTicket);
    setSuccessMsg('Tiket bantuan berhasil diajukan. Tim kami akan segera merespons.');
    setTimeout(() => {
      setSuccessMsg(null);
      setCreateModalOpen(false);
      setSubject('');
      setMessage('');
    }, 1800);
  };

  const handleSendReply = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedTicket || !replyText.trim()) return;

    StorageService.addTicketMessage(selectedTicket.id, replyText.trim(), 'user');

    setReplyText('');
    const updated = StorageService.getTickets().find((t) => t.id === selectedTicket.id);
    if (updated) setSelectedTicket(updated);
  };

  const columns: Column<SupportTicket>[] = [
    {
      header: 'ID Tiket',
      render: (t) => <strong className="font-bold text-white font-mono">#{t.id}</strong>,
    },
    {
      header: 'Subjek',
      render: (t) => <span className="font-medium text-white">{t.subject}</span>,
    },
    {
      header: 'Kategori',
      render: (t) => <span className="text-neutral-400 text-xs">{t.category || t.department || 'Umum'}</span>,
    },
    {
      header: 'Prioritas',
      render: (t) => {
        const variant =
          t.priority === 'high' || t.priority === 'urgent' ? 'danger' : t.priority === 'medium' ? 'warning' : 'neutral';
        return (
          <Badge variant={variant} size="sm">
            {t.priority === 'high' ? 'TINGGI' : t.priority === 'medium' ? 'SEDANG' : 'NORMAL'}
          </Badge>
        );
      },
    },
    {
      header: 'Status',
      render: (t) => (
        <Badge
          variant={t.status === 'open' ? 'warning' : t.status === 'in_progress' ? 'red' : 'success'}
          size="sm"
        >
          {t.status === 'open' ? 'TERBUKA' : t.status === 'in_progress' ? 'DIPROSES' : 'SELESAI'}
        </Badge>
      ),
    },
    {
      header: 'Tanggal Dibuat',
      render: (t) => (
        <span className="text-xs text-neutral-400 font-mono">
          {new Date(t.createdAt).toLocaleDateString('id-ID')}
        </span>
      ),
    },
    {
      header: 'Aksi',
      align: 'right',
      render: (t) => (
        <button
          onClick={() => setSelectedTicket(t)}
          className="text-xs px-3 py-1 bg-red-600 hover:bg-red-500 text-white rounded font-bold transition-colors cursor-pointer"
        >
          Lihat Chat
        </button>
      ),
    },
  ];

  return (
    <div className="space-y-6 font-sans">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl font-bold text-white tracking-tight">Pusat Bantuan & Layanan Klien</h1>
          <p className="text-xs text-neutral-400">
            Ajukan tiket pertanyaan atau berkomunikasi langsung dengan tim dukungan teknis kami 24/7.
          </p>
        </div>

        <Button onClick={() => setCreateModalOpen(true)} size="md">
          <Plus className="w-4 h-4 mr-1.5" /> Buat Tiket Bantuan
        </Button>
      </div>

      {/* Ticket List Table */}
      <Card padding="md">
        <Table
          columns={columns}
          data={tickets}
          keyExtractor={(t) => t.id}
          emptyMessage="Belum ada tiket bantuan yang dibuka. Klik 'Buat Tiket Bantuan' untuk bertanya."
        />
      </Card>

      {/* Contact Quick Info Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
        <div className="p-4 bg-[#14161d] rounded-xl border border-neutral-800 flex items-center gap-3">
          <div className="p-2.5 rounded-lg bg-red-600/10 text-red-500">
            <Mail className="w-5 h-5" />
          </div>
          <div>
            <span className="text-neutral-400 block font-semibold">Email Dukungan Pelanggan</span>
            <span className="text-white font-bold">{settings.supportEmail || 'support@hfm.com'}</span>
          </div>
        </div>

        <div className="p-4 bg-[#14161d] rounded-xl border border-neutral-800 flex items-center gap-3">
          <div className="p-2.5 rounded-lg bg-red-600/10 text-red-500">
            <Phone className="w-5 h-5" />
          </div>
          <div>
            <span className="text-neutral-400 block font-semibold">Hotline Trading Room</span>
            <span className="text-white font-bold font-mono">{settings.supportPhone || '+62 21 5088 0123'}</span>
          </div>
        </div>
      </div>

      {/* Create Ticket Modal */}
      <Modal
        isOpen={createModalOpen}
        onClose={() => setCreateModalOpen(false)}
        title="Buka Tiket Bantuan Baru"
      >
        {successMsg ? (
          <div className="p-6 text-center space-y-2">
            <CheckCircle2 className="w-8 h-8 text-emerald-400 mx-auto" />
            <p className="text-sm font-bold text-white">{successMsg}</p>
          </div>
        ) : (
          <form onSubmit={handleCreateTicket} className="space-y-4">
            <Input
              label="Subjek Pertanyaan"
              value={subject}
              onChange={(e) => setSubject(e.target.value)}
              placeholder="Contoh: Pertanyaan verifikasi akun / deposit"
              required
            />

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <Select
                label="Kategori / Departemen"
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                options={[
                  { value: 'Bantuan Teknis', label: 'Bantuan Teknis & Platform' },
                  { value: 'Deposit & Penarikan', label: 'Deposit & Penarikan Dana' },
                  { value: 'Verifikasi Akun', label: 'Verifikasi Dokumen / Akun' },
                  { value: 'Pertanyaan Trading', label: 'Trading & Eksekusi Order' },
                ]}
              />

              <Select
                label="Tingkat Prioritas"
                value={priority}
                onChange={(e) => setPriority(e.target.value as any)}
                options={[
                  { value: 'low', label: 'Rendah (Pertanyaan Umum)' },
                  { value: 'medium', label: 'Sedang (Standar)' },
                  { value: 'high', label: 'Tinggi (Kendala Transaksi)' },
                ]}
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-neutral-300 mb-1">
                Pesan / Rincian Kendala
              </label>
              <textarea
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                rows={4}
                required
                placeholder="Jelaskan kendala Anda secara rinci..."
                className="w-full bg-[#181a22] border border-neutral-700 rounded-lg p-3 text-xs text-white placeholder-neutral-500 focus:outline-none focus:border-red-500"
              />
            </div>

            <div className="pt-2 flex justify-end gap-2">
              <Button type="button" variant="secondary" onClick={() => setCreateModalOpen(false)}>
                Batal
              </Button>
              <Button type="submit">Kirim Tiket</Button>
            </div>
          </form>
        )}
      </Modal>

      {/* View Ticket Details Modal */}
      {selectedTicket && (
        <Modal
          isOpen={!!selectedTicket}
          onClose={() => setSelectedTicket(null)}
          title={`Tiket #${selectedTicket.id}: ${selectedTicket.subject}`}
        >
          <div className="space-y-4">
            <div className="p-3 bg-[#181a22] rounded-lg border border-neutral-700 flex items-center justify-between text-xs font-mono">
              <span className="text-neutral-400">Status: <strong className="text-white uppercase">{selectedTicket.status}</strong></span>
              <span className="text-neutral-400">Prioritas: <strong className="text-red-400 uppercase">{selectedTicket.priority}</strong></span>
            </div>

            {/* Chat Thread */}
            <div className="space-y-3 max-h-64 overflow-y-auto p-2 bg-[#101217] rounded-lg border border-neutral-800">
              {selectedTicket.messages.map((m, idx) => {
                const isUser = m.sender === 'user';
                return (
                  <div
                    key={idx}
                    className={`flex flex-col ${isUser ? 'items-end' : 'items-start'}`}
                  >
                    <div
                      className={`max-w-[80%] rounded-xl p-3 text-xs ${
                        isUser
                          ? 'bg-red-600 text-white rounded-br-none'
                          : 'bg-[#22252e] text-neutral-200 rounded-bl-none border border-neutral-700'
                      }`}
                    >
                      <p>{m.message || m.text}</p>
                      <span className="block text-[10px] opacity-70 mt-1 font-mono">
                        {new Date(m.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Reply Input */}
            <form onSubmit={handleSendReply} className="flex gap-2">
              <input
                type="text"
                value={replyText}
                onChange={(e) => setReplyText(e.target.value)}
                placeholder="Tulis balasan Anda..."
                className="flex-1 bg-[#181a22] border border-neutral-700 rounded-lg px-3 py-2 text-xs text-white focus:outline-none focus:border-red-500"
              />
              <Button type="submit" size="sm">
                <Send className="w-4 h-4 mr-1" /> Kirim
              </Button>
            </form>
          </div>
        </Modal>
      )}
    </div>
  );
};
