import React, { useState } from 'react';
import { Card } from '../../components/Card';
import { Badge } from '../../components/Badge';
import { Button } from '../../components/Button';
import { Table, Column } from '../../components/Table';
import { Modal } from '../../components/Modal';
import { Input } from '../../components/Input';
import { Select } from '../../components/Select';
import { useArticles } from '../../hooks/useStorage';
import { StorageService } from '../../utils/storage';
import { Article } from '../../types';
import { FileText, Plus, Trash2, Edit2, Search, CheckCircle2 } from 'lucide-react';

export const AdminArticlesPage: React.FC = () => {
  const { articles } = useArticles();
  const [search, setSearch] = useState('');

  const [createModalOpen, setCreateModalOpen] = useState(false);
  const [title, setTitle] = useState('');
  const [category, setCategory] = useState('Beginner');
  const [readTime, setReadTime] = useState('5 min read');
  const [summary, setSummary] = useState('');
  const [content, setContent] = useState('');
  const [author, setAuthor] = useState('Nexora Market Research');
  const [successMsg, setSuccessMsg] = useState<string | null>(null);

  const filtered = articles.filter(
    (a) =>
      a.title.toLowerCase().includes(search.toLowerCase()) ||
      a.category.toLowerCase().includes(search.toLowerCase())
  );

  const handleDelete = (id: string) => {
    if (confirm('Delete this education article?')) {
      StorageService.deleteArticle(id);
    }
  };

  const handleCreate = (e: React.FormEvent) => {
    e.preventDefault();
    const slug = title
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/(^-|-$)+/g, '');

    const newArt: Omit<Article, 'id'> = {
      slug,
      title,
      category,
      readTime,
      summary,
      content,
      author,
      publishedAt: new Date().toISOString().split('T')[0],
      tags: [category.toLowerCase(), 'trading', 'nexora'],
    };

    StorageService.addArticle(newArt);
    setSuccessMsg('Article published to Education Academy.');
    setTimeout(() => {
      setSuccessMsg(null);
      setCreateModalOpen(false);
      setTitle('');
      setSummary('');
      setContent('');
    }, 1500);
  };

  const columns: Column<Article>[] = [
    {
      header: 'Title',
      render: (a) => (
        <div>
          <strong className="text-white text-xs block">{a.title}</strong>
          <span className="text-[10px] text-neutral-400 font-mono-num">/education/{a.slug}</span>
        </div>
      ),
    },
    {
      header: 'Category',
      render: (a) => <Badge variant="neutral" size="sm">{a.category}</Badge>,
    },
    {
      header: 'Author',
      render: (a) => <span className="text-xs text-neutral-300">{a.author}</span>,
    },
    {
      header: 'Read Time',
      render: (a) => <span className="text-xs text-neutral-400 font-mono-num">{a.readTime}</span>,
    },
    {
      header: 'Published',
      render: (a) => <span className="text-xs text-neutral-400 font-mono-num">{a.publishedAt}</span>,
    },
    {
      header: 'Action',
      align: 'right',
      render: (a) => (
        <button
          onClick={() => handleDelete(a.id)}
          className="p-1.5 rounded bg-red-950/40 text-red-400 hover:bg-red-900 border border-red-800/60 transition-colors cursor-pointer"
          title="Delete Article"
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
          <h1 className="text-2xl font-bold text-white tracking-tight">Education Articles Manager</h1>
          <p className="text-xs text-neutral-400">
            Publish, edit, and organize research tutorials and technical analysis guides.
          </p>
        </div>

        <Button onClick={() => setCreateModalOpen(true)} size="md">
          <Plus className="w-4 h-4 mr-1.5" /> New Academy Article
        </Button>
      </div>

      <div className="bg-[#0D0D0F] p-4 rounded-xl border border-neutral-800 flex items-center justify-between gap-4">
        <div className="w-full sm:w-80">
          <Input
            placeholder="Search articles..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            leftIcon={<Search className="w-4 h-4 text-neutral-400" />}
            className="py-1.5 text-xs"
          />
        </div>
        <span className="text-xs text-neutral-400 font-mono-num">
          {filtered.length} Articles
        </span>
      </div>

      <Card padding="md">
        <Table
          columns={columns}
          data={filtered}
          keyExtractor={(a) => a.id}
        />
      </Card>

      {/* Create Modal */}
      <Modal
        isOpen={createModalOpen}
        onClose={() => setCreateModalOpen(false)}
        title="Publish Educational Article"
        size="lg"
      >
        {successMsg ? (
          <div className="p-6 text-center space-y-2">
            <CheckCircle2 className="w-8 h-8 text-emerald-400 mx-auto" />
            <p className="text-sm font-bold text-white">{successMsg}</p>
          </div>
        ) : (
          <form onSubmit={handleCreate} className="space-y-4">
            <Input
              label="Article Title"
              placeholder="e.g. Master Elliott Wave Fibonacci Sequences"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              required
            />

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <Select
                label="Category"
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                options={[
                  { value: 'Beginner', label: 'Beginner' },
                  { value: 'Analysis', label: 'Technical Analysis' },
                  { value: 'Risk', label: 'Risk Management' },
                  { value: 'Psychology', label: 'Trading Psychology' },
                ]}
              />

              <Input
                label="Read Time"
                value={readTime}
                onChange={(e) => setReadTime(e.target.value)}
                placeholder="e.g. 7 min read"
              />

              <Input
                label="Author"
                value={author}
                onChange={(e) => setAuthor(e.target.value)}
              />
            </div>

            <div className="space-y-1">
              <label className="block text-xs font-semibold text-neutral-300 uppercase">
                Executive Summary
              </label>
              <textarea
                rows={2}
                className="w-full bg-[#151518] text-white text-xs rounded-lg border border-neutral-800 p-2.5 focus:outline-none focus:ring-1 focus:ring-red-500"
                placeholder="Short 2-line preview overview..."
                value={summary}
                onChange={(e) => setSummary(e.target.value)}
                required
              />
            </div>

            <div className="space-y-1">
              <label className="block text-xs font-semibold text-neutral-300 uppercase">
                Full Article Content (Markdown / Text)
              </label>
              <textarea
                rows={6}
                className="w-full bg-[#151518] text-white text-xs rounded-lg border border-neutral-800 p-2.5 focus:outline-none focus:ring-1 focus:ring-red-500 font-mono"
                placeholder="Full article content body..."
                value={content}
                onChange={(e) => setContent(e.target.value)}
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
              <Button type="submit">Publish Article</Button>
            </div>
          </form>
        )}
      </Modal>
    </div>
  );
};
