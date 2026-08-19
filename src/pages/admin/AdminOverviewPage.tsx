import React from 'react';
import { Card } from '../../components/Card';
import { StatsCard } from '../../components/StatsCard';
import { Badge } from '../../components/Badge';
import { Button } from '../../components/Button';
import { Table, Column } from '../../components/Table';
import {
  useUsers,
  useAccounts,
  useMarkets,
  useTransactions,
} from '../../hooks/useStorage';
import { Users, Wallet, TrendingUp, Receipt, Shield, ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';
import { User, Transaction } from '../../types';

export const AdminOverviewPage: React.FC = () => {
  const { users } = useUsers();
  const { accounts } = useAccounts();
  const { markets } = useMarkets();
  const { transactions } = useTransactions();

  const totalBalance = accounts.reduce((acc, a) => acc + a.balance, 0);
  const totalTransactions = transactions.length;

  const userColumns: Column<User>[] = [
    {
      header: 'Name',
      render: (u) => <strong className="text-white text-xs">{u.name}</strong>,
    },
    {
      header: 'Email',
      render: (u) => <span className="text-xs text-neutral-400 font-mono-num">{u.email}</span>,
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
        <span className="text-xs text-neutral-400 font-mono-num">
          {new Date(u.createdAt).toLocaleDateString()}
        </span>
      ),
    },
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-[#0D0D0F] p-6 rounded-2xl border border-neutral-800">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-xl sm:text-2xl font-bold text-white tracking-tight">
              Platform Administration Console
            </h1>
            <Badge variant="red" size="sm">
              CHIEF ADMIN
            </Badge>
          </div>
          <p className="text-xs text-neutral-400 mt-1">
            Global management portal for users, simulated trading accounts, pricing feeds, and knowledge base.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <Link to="/admin/users">
            <Button size="sm">Manage Users</Button>
          </Link>
          <Link to="/admin/markets">
            <Button variant="secondary" size="sm">
              Price Control
            </Button>
          </Link>
        </div>
      </div>

      {/* Top Stat Metrics */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <StatsCard
          title="Registered Users"
          value={users.length.toString()}
          subtitle="Demo & Admin Accounts"
          icon={<Users className="w-5 h-5" />}
        />
        <StatsCard
          title="Active Accounts"
          value={accounts.length.toString()}
          subtitle="Trading Portfolios"
          icon={<Wallet className="w-5 h-5" />}
        />
        <StatsCard
          title="Total Virtual Balances"
          value={`$${totalBalance.toLocaleString('en-US', { minimumFractionDigits: 0 })}`}
          subtitle="System Demo Liquidity"
          icon={<TrendingUp className="w-5 h-5" />}
        />
        <StatsCard
          title="Instruments Monitored"
          value={markets.length.toString()}
          subtitle="Active Price Feeds"
          icon={<Shield className="w-5 h-5" />}
        />
      </div>

      {/* Recent Users and Market Overview */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left: User Roster */}
        <Card padding="md" className="lg:col-span-8 space-y-4">
          <div className="flex items-center justify-between border-b border-neutral-800 pb-3">
            <h3 className="text-sm font-bold text-white">Recent Registered Users</h3>
            <Link to="/admin/users" className="text-xs text-red-400 hover:underline">
              View All Users →
            </Link>
          </div>

          <Table
            columns={userColumns}
            data={users.slice(0, 5)}
            keyExtractor={(u) => u.id}
          />
        </Card>

        {/* Right: Market Feeds Overview */}
        <Card padding="md" className="lg:col-span-4 space-y-4">
          <div className="flex items-center justify-between border-b border-neutral-800 pb-3">
            <h3 className="text-sm font-bold text-white">Live Instrument Quotes</h3>
            <Link to="/admin/markets" className="text-xs text-red-400 hover:underline">
              Adjust Quotes →
            </Link>
          </div>

          <div className="space-y-2 max-h-80 overflow-y-auto">
            {markets.slice(0, 6).map((m) => (
              <div
                key={m.id}
                className="p-2.5 rounded-lg bg-[#151518] border border-neutral-800 flex items-center justify-between font-mono-num text-xs"
              >
                <div>
                  <strong className="text-white block">{m.symbol}</strong>
                  <span className="text-[10px] text-neutral-400">{m.category}</span>
                </div>
                <div className="text-right">
                  <span className="text-white block font-bold">
                    {m.bid.toFixed(m.digits)} / {m.ask.toFixed(m.digits)}
                  </span>
                  <span
                    className={`text-[10px] font-semibold ${
                      m.change >= 0 ? 'text-emerald-400' : 'text-red-400'
                    }`}
                  >
                    {m.change >= 0 ? '+' : ''}
                    {m.changePercent.toFixed(2)}%
                  </span>
                </div>
              </div>
            ))}
          </div>
        </Card>
      </div>
    </div>
  );
};
