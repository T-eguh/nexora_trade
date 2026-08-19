import React, { useState } from 'react';
import { Card } from '../../components/Card';
import { Badge } from '../../components/Badge';
import { Button } from '../../components/Button';
import { Table, Column } from '../../components/Table';
import { Modal } from '../../components/Modal';
import { Input } from '../../components/Input';
import { Select } from '../../components/Select';
import { useFaqs } from '../../hooks/useStorage';
import { StorageService } from '../../utils/storage';
import { FAQItem } from '../../types';
import { HelpCircle, Plus, Trash2, Search, CheckCircle2 } from 'lucide-react';

export const AdminFaqPage: React.FC = () => {
  const { faqs } = useFaqs();
  const [search, setSearch] = useState('');

  const [createModalOpen, setCreateModalOpen] = useState(false);
  const [question, setQuestion] = useState('');
  const [answer, setAnswer] = useState('');
  const [category, setCategory] = useState('General');
  const [successMsg, setSuccessMsg] = useState<string | null>(null);

  const filtered = faqs.filter(
    (f) =>
      f.question.toLowerCase().includes(search.toLowerCase()) ||
      f.answer.toLowerCase().includes(search.toLowerCase()) ||
      f.category.toLowerCase().includes(search.toLowerCase())
  );

  const handleDelete = (id: string) => {
    if (confirm('Delete this FAQ entry?')) {
      StorageService.deleteFaq(id);
    }
  };

  const handleCreate = (e: React.FormEvent) => {
    e.preventDefault();
    const newFaq: Omit<FAQItem, 'id'> = {
      question,
      answer,
      category,
    };

    StorageService.addFaq(newFaq);
    setSuccessMsg('FAQ entry added successfully.');
    setTimeout(() => {
      setSuccessMsg(null);
      setCreateModalOpen(false);
      setQuestion('');
      setAnswer('');
    }, 1200);
  };

  const columns: Column<FAQItem>[] = [
    {
      header: 'Question',
      render: (f) => <strong className="text-white text-xs block max-w-md">{f.question}</strong>,
    },
    {
      header: 'Category',
      render: (f) => <Badge variant="neutral" size="sm">{f.category}</Badge>,
    },
    {
      header: 'Answer Preview',
      render: (f) => (
        <span className="text-xs text-neutral-400 truncate max-w-xs block">
          {f.answer}
        </span>
      ),
    },
    {
      header: 'Action',
      align: 'right',
      render: (f) => (
        <button
          onClick={() => handleDelete(f.id)}
          className="p-1.5 rounded bg-red-950/40 text-red-400 hover:bg-red-900 border border-red-800/60 transition-colors cursor-pointer"
          title="Delete FAQ"
        >
          <Trash2 className="w-3.5 h-3.5" />
        </button>
      ),
    },
  ];

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-white tracking-tight">FAQ Knowledge Manager</h1>
          <p className="text-xs text-neutral-400">
            Maintain public question and answer entries across categories.
          </p>
        </div>

        <Button onClick={() => setCreateModalOpen(true)} size="md">
          <Plus className="w-4 h-4 mr-1.5" /> Add New FAQ
        </Button>
      </div>

      <div className="bg-[#0D0D0F] p-4 rounded-xl border border-neutral-800 flex items-center justify-between gap-4">
        <div className="w-full sm:w-80">
          <Input
            placeholder="Search FAQs..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            leftIcon={<Search className="w-4 h-4 text-neutral-400" />}
            className="py-1.5 text-xs"
          />
        </div>
        <span className="text-xs text-neutral-400 font-mono-num">
          {filtered.length} FAQs
        </span>
      </div>

      <Card padding="md">
        <Table
          columns={columns}
          data={filtered}
          keyExtractor={(f) => f.id}
        />
      </Card>

      {/* Create Modal */}
      <Modal
        isOpen={createModalOpen}
        onClose={() => setCreateModalOpen(false)}
        title="Add FAQ Question"
      >
        {successMsg ? (
          <div className="p-6 text-center space-y-2">
            <CheckCircle2 className="w-8 h-8 text-emerald-400 mx-auto" />
            <p className="text-sm font-bold text-white">{successMsg}</p>
          </div>
        ) : (
          <form onSubmit={handleCreate} className="space-y-4">
            <Input
              label="Question"
              placeholder="e.g. What is the execution model of Nexora Trade?"
              value={question}
              onChange={(e) => setQuestion(e.target.value)}
              required
            />

            <Select
              label="Category"
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              options={[
                { value: 'General', label: 'General' },
                { value: 'Trading', label: 'Trading & Execution' },
                { value: 'Accounts', label: 'Accounts & Tiers' },
                { value: 'Deposits & Withdrawals', label: 'Deposits & Withdrawals' },
                { value: 'Platforms', label: 'Platforms' },
              ]}
            />

            <div className="space-y-1">
              <label className="block text-xs font-semibold text-neutral-300 uppercase">
                Detailed Answer
              </label>
              <textarea
                rows={4}
                className="w-full bg-[#151518] text-white text-xs rounded-lg border border-neutral-800 p-2.5 focus:outline-none focus:ring-1 focus:ring-red-500"
                placeholder="Comprehensive answer explanation..."
                value={answer}
                onChange={(e) => setAnswer(e.target.value)}
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
              <Button type="submit">Save FAQ</Button>
            </div>
          </form>
        )}
      </Modal>
    </div>
  );
};
