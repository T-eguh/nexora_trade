import React, { useState } from 'react';
import { Card } from '../../components/Card';
import { Badge } from '../../components/Badge';
import { Button } from '../../components/Button';
import { Input } from '../../components/Input';
import { Select } from '../../components/Select';
import { Modal } from '../../components/Modal';
import { Table, Column } from '../../components/Table';
import { useUsers } from '../../hooks/useStorage';
import { StorageService } from '../../utils/storage';
import { User } from '../../types';
import { Users, Plus, Search, Trash2, Shield, CheckCircle2 } from 'lucide-react';

export const AdminUsersPage: React.FC = () => {
  const { users } = useUsers();
  const [search, setSearch] = useState('');
  const [createModalOpen, setCreateModalOpen] = useState(false);

  // Form fields
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('demo123');
  const [role, setRole] = useState<'user' | 'admin'>('user');
  const [country, setCountry] = useState('United States');
  const [successMsg, setSuccessMsg] = useState<string | null>(null);

  const filtered = users.filter(
    (u) =>
      u.name.toLowerCase().includes(search.toLowerCase()) ||
      u.email.toLowerCase().includes(search.toLowerCase()) ||
      u.country.toLowerCase().includes(search.toLowerCase())
  );

  const handleDeleteUser = (id: string) => {
    if (confirm('Are you sure you want to delete this user profile?')) {
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
      phone: '+1 555 0100',
      accountTier: 'Pro',
      twoFactorEnabled: false,
    };

    StorageService.addUser(newUser);
    setSuccessMsg(`User ${name} added to system.`);
    setTimeout(() => {
      setSuccessMsg(null);
      setCreateModalOpen(false);
      setName('');
      setEmail('');
    }, 1500);
  };

  const columns: Column<User>[] = [
    {
      header: 'User Name',
      render: (u) => (
        <div>
          <strong className="text-white text-xs block">{u.name}</strong>
          <span className="text-[10px] text-neutral-400 font-mono-num">{u.id}</span>
        </div>
      ),
    },
    {
      header: 'Email Address',
      render: (u) => <span className="text-xs text-neutral-300 font-mono-num">{u.email}</span>,
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
      header: 'Tier',
      render: (u) => <span className="text-xs font-bold text-neutral-200">{u.accountTier || 'Pro'}</span>,
    },
    {
      header: 'Created',
      render: (u) => (
        <span className="text-xs text-neutral-400 font-mono-num">
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
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-white tracking-tight">Users Management</h1>
          <p className="text-xs text-neutral-400">
            View registered trader profiles, provision administrative privileges, and manage credentials.
          </p>
        </div>

        <Button onClick={() => setCreateModalOpen(true)} size="md">
          <Plus className="w-4 h-4 mr-1.5" /> Create New User
        </Button>
      </div>

      <div className="bg-[#0D0D0F] p-4 rounded-xl border border-neutral-800 flex items-center justify-between gap-4">
        <div className="w-full sm:w-80">
          <Input
            placeholder="Search by name, email, country..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            leftIcon={<Search className="w-4 h-4 text-neutral-400" />}
            className="py-1.5 text-xs"
          />
        </div>
        <span className="text-xs text-neutral-400 font-mono-num">
          Total: {filtered.length} Users
        </span>
      </div>

      <Card padding="md">
        <Table
          columns={columns}
          data={filtered}
          keyExtractor={(u) => u.id}
          emptyMessage="No users found matching search query."
        />
      </Card>

      {/* Create User Modal */}
      <Modal
        isOpen={createModalOpen}
        onClose={() => setCreateModalOpen(false)}
        title="Create New User Profile"
      >
        {successMsg ? (
          <div className="p-6 text-center space-y-2">
            <CheckCircle2 className="w-8 h-8 text-emerald-400 mx-auto" />
            <p className="text-sm font-bold text-white">{successMsg}</p>
          </div>
        ) : (
          <form onSubmit={handleCreateUser} className="space-y-4">
            <Input
              label="Full Name"
              placeholder="e.g. Jordan Belfort"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
            />

            <Input
              label="Email Address"
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
              label="Country"
              value={country}
              onChange={(e) => setCountry(e.target.value)}
              options={[
                { value: 'United States', label: 'United States' },
                { value: 'United Kingdom', label: 'United Kingdom' },
                { value: 'Singapore', label: 'Singapore' },
                { value: 'Australia', label: 'Australia' },
                { value: 'Germany', label: 'Germany' },
              ]}
            />

            <div className="flex justify-end gap-2 pt-2">
              <Button
                type="button"
                variant="secondary"
                onClick={() => setCreateModalOpen(false)}
              >
                Cancel
              </Button>
              <Button type="submit">Create User</Button>
            </div>
          </form>
        )}
      </Modal>
    </div>
  );
};
