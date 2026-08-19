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
  LifeBuoy,
  Plus,
  MessageSquare,
  Clock,
  CheckCircle2,
  Mail,
  Phone,
} from 'lucide-react';

export const SupportPage: React.FC = () => {
  const { tickets } = useTickets();
  const { user } = useAuth();
  const { settings } = useSiteSettings();

  const [createModalOpen, setCreateModalOpen] = useState(false);
  const [selectedTicket, setSelectedTicket] = useState<SupportTicket | null>(null);

  const [subject, setSubject] = useState('');
  const [category, setCategory] = useState('Technical Support');
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
      userEmail: user.email,
      subject,
      category,
      priority,
      status: 'open',
      messages: [
        {
          id: `msg-${Date.now()}`,
          sender: 'user',
          text: message,
          timestamp: new Date().toISOString(),
        },
      ],
    };

    StorageService.addTicket(newTicket);
    setSuccessMsg('Support ticket submitted. A specialist will reply shortly.');
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

    StorageService.addTicketMessage(selectedTicket.id, {
      sender: 'user',
      text: replyText.trim(),
    });

    setReplyText('');
    // Refresh active ticket view
    const updated = StorageService.getTickets().find((t) => t.id === selectedTicket.id);
    if (updated) setSelectedTicket(updated);
  };

  const columns: Column<SupportTicket>[] = [
    {
      header: 'Ticket ID',
      render: (t) => <strong className="font-bold text-white font-mono-num">#{t.id}</strong>,
    },
    {
      header: 'Subject',
      render: (t) => <span className="font-medium text-white">{t.subject}</span>,
    },
    {
      header: 'Category',
      render: (t) => <span className="text-neutral-400 text-xs">{t.category}</span>,
    },
    {
      header: 'Priority',
      render: (t) => {
        const variant =
          t.priority === 'high' ? 'danger' : t.priority === 'medium' ? 'warning' : 'neutral';
        return (
          <Badge variant={variant} size="sm">
            {t.priority.toUpperCase()}
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
          {t.status.replace('_', ' ').toUpperCase()}
        </Badge>
      ),
    },
    {
      header: 'Last Updated',
      render: (t) => (
        <span className="text-xs text-neutral-400 font-mono-num">
          {new Date(t.updatedAt).toLocaleDateString()}
        </span>
      ),
    },
    {
      header: 'Action',
      align: 'right',
      render: (t) => (
        <button
          onClick={() => setSelectedTicket(t)}
          className="text-xs px-3 py-1 bg-red-600 hover:bg-red-500 text-white rounded font-bold transition-colors cursor-pointer"
        >
          View Ticket
        </button>
      ),
    },
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-white tracking-tight">Client Support Desk</h1>
          <p className="text-xs text-neutral-400">
            Submit inquiry tickets or communicate directly with our 24/7 technical helpdesk.
          </p>
        </div>

        <Button onClick={() => setCreateModalOpen(true)} size="md">
          <Plus className="w-4 h-4 mr-1.5" /> Create Support Ticket
        </Button>
      </div>

      {/* Ticket List Table */}
      <Card padding="md">
        <Table
          columns={columns}
          data={tickets}
          keyExtractor={(t) => t.id}
          emptyMessage="No support tickets opened yet. Click 'Create Support Ticket' to ask a question."
        />
      </Card>

      {/* Contact Quick Info Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
        <div className="p-4 bg-[#0D0D0F] rounded-xl border border-neutral-800 flex items-center gap-3">
          <div className="p-2.5 rounded-lg bg-red-600/10 text-red-500">
            <Mail className="w-5 h-5" />
          </div>
          <div>
            <span className="text-neutral-400 block font-semibold">Priority Email Desk</span>
            <span className="text-white font-bold">{settings.email}</span>
          </div>
        </div>

        <div className="p-4 bg-[#0D0D0F] rounded-xl border border-neutral-800 flex items-center gap-3">
          <div className="p-2.5 rounded-lg bg-red-600/10 text-red-500">
            <Phone className="w-5 h-5" />
          </div>
          <div>
            <span className="text-neutral-400 block font-semibold">Helpline & Trading Room</span>
            <span className="text-white font-bold font-mono-num">{settings.phone}</span>
          </div>
        </div>
      </div>

      {/* Create Ticket Modal */}
      <Modal
        isOpen={createModalOpen}
        onClose={() => setCreateModalOpen(false)}
        title="Open Support Ticket"
      >
        {successMsg ? (
          <div className="p-6 text-center space-y-2">
            <CheckCircle2 className="w-8 h-8 text-emerald-400 mx-auto" />
            <p className="text-sm font-bold text-white">{successMsg}</p>
          </div>
        ) : (
          <form onSubmit={handleCreateTicket} className="space-y-4">
            <Input
              label="Subject"
              placeholder="e.g. Question regarding Gold spread execution"
              value={subject}
              onChange={(e) => setSubject(e.target.value)}
              required
            />

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <Select
                label="Category"
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                options={[
                  { value: 'Technical Support', label: 'Technical & WebTrader' },
                  { value: 'Account Questions', label: 'Accounts & Verification' },
                  { value: 'Deposits / Withdrawals', label: 'Deposits & Funds' },
                  { value: 'Other', label: 'General Questions' },
                ]}
              />

              <Select
                label="Priority"
                value={priority}
                onChange={(e) => setPriority(e.target.value as 'low' | 'medium' | 'high')}
                options={[
                  { value: 'low', label: 'Low' },
                  { value: 'medium', label: 'Medium' },
                  { value: 'high', label: 'High (Urgent)' },
                ]}
              />
            </div>

            <div className="space-y-1.5">
              <label className="block text-xs font-semibold text-neutral-300 uppercase">
                Detailed Message
              </label>
              <textarea
                rows={4}
                className="w-full bg-[#151518] text-white text-xs rounded-lg border border-neutral-800 p-3 focus:outline-none focus:ring-1 focus:ring-red-500"
                placeholder="Describe the issue or inquiry in detail..."
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                required
              />
            </div>

            <div className="flex justify-end gap-2 pt-2">
              <Button
                type="button"
                variant="secondary"
                onClick={() => setCreateModalOpen(false)}
              >
                Cancel
              </Button>
              <Button type="submit">Submit Ticket</Button>
            </div>
          </form>
        )}
      </Modal>

      {/* View Ticket Thread Modal */}
      {selectedTicket && (
        <Modal
          isOpen={!!selectedTicket}
          onClose={() => setSelectedTicket(null)}
          title={`Ticket #${selectedTicket.id} — ${selectedTicket.subject}`}
          size="lg"
        >
          <div className="space-y-4">
            <div className="flex flex-wrap items-center justify-between gap-2 p-3 bg-[#151518] rounded-xl border border-neutral-800 text-xs">
              <div>
                <span className="text-neutral-400">Category: </span>
                <strong className="text-white">{selectedTicket.category}</strong>
              </div>
              <div className="flex items-center gap-2">
                <Badge variant="neutral" size="sm">
                  {selectedTicket.priority.toUpperCase()}
                </Badge>
                <Badge
                  variant={selectedTicket.status === 'open' ? 'warning' : 'success'}
                  size="sm"
                >
                  {selectedTicket.status.toUpperCase()}
                </Badge>
              </div>
            </div>

            {/* Conversation Messages */}
            <div className="space-y-3 max-h-72 overflow-y-auto p-1">
              {selectedTicket.messages.map((m) => (
                <div
                  key={m.id}
                  className={`p-3.5 rounded-xl text-xs space-y-1 ${
                    m.sender === 'admin'
                      ? 'bg-red-950/40 border border-red-900/60 ml-6 text-red-100'
                      : 'bg-[#151518] border border-neutral-800 mr-6 text-neutral-200'
                  }`}
                >
                  <div className="flex justify-between items-center text-[10px] text-neutral-400">
                    <strong className={m.sender === 'admin' ? 'text-red-400 font-bold' : 'text-neutral-300'}>
                      {m.sender === 'admin' ? 'Support Desk Representative' : selectedTicket.userName}
                    </strong>
                    <span className="font-mono-num">{new Date(m.timestamp).toLocaleTimeString()}</span>
                  </div>
                  <p className="leading-relaxed">{m.text}</p>
                </div>
              ))}
            </div>

            {/* Reply Input */}
            <form onSubmit={handleSendReply} className="pt-2 border-t border-neutral-800 space-y-2">
              <textarea
                rows={2}
                className="w-full bg-[#151518] text-white text-xs rounded-lg border border-neutral-800 p-2.5 focus:outline-none focus:ring-1 focus:ring-red-500"
                placeholder="Type your reply message..."
                value={replyText}
                onChange={(e) => setReplyText(e.target.value)}
                required
              />
              <div className="flex justify-end gap-2">
                <Button
                  type="button"
                  variant="secondary"
                  size="sm"
                  onClick={() => setSelectedTicket(null)}
                >
                  Close
                </Button>
                <Button type="submit" size="sm">
                  Send Response
                </Button>
              </div>
            </form>
          </div>
        </Modal>
      )}
    </div>
  );
};
