import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import {
  Wallet,
  TrendingUp,
  BarChart2,
  ArrowDownCircle,
  ArrowUpCircle,
  Plus,
  Shield,
  Layers,
  CheckCircle2,
  XCircle,
} from 'lucide-react';
import { Card } from '../../components/Card';
import { StatsCard } from '../../components/StatsCard';
import { Badge } from '../../components/Badge';
import { Button } from '../../components/Button';
import { TradingTerminalMock } from '../../components/TradingTerminalMock';
import { Table, Column } from '../../components/Table';
import {
  useAccounts,
  usePositions,
  useTransactions,
  useAuth,
  useMarkets,
} from '../../hooks/useStorage';
import { Position } from '../../types';
import { StorageService } from '../../utils/storage';

export const DashboardOverviewPage: React.FC = () => {
  const { user } = useAuth();
  const { accounts } = useAccounts();
  const { positions } = usePositions();
  const { transactions } = useTransactions();
  const { markets } = useMarkets();

  // Find primary account
  const primaryAccount = accounts.find((a) => a.userId === user?.id) || accounts[0];

  // Calculate live portfolio summary from primary account and open positions
  const openPositions = positions.filter((p) => p.status === 'open');
  const totalOpenPnl = openPositions.reduce((acc, p) => acc + p.pnl, 0);

  const balance = primaryAccount?.balance || 10000;
  const equity = balance + totalOpenPnl;
  const marginUsed = primaryAccount?.margin || 620;
  const freeMargin = equity - marginUsed;
  const marginLevel = marginUsed > 0 ? (equity / marginUsed) * 100 : 0;

  const handleClosePosition = (id: string) => {
    StorageService.closePosition(id);
  };

  const positionColumns: Column<Position>[] = [
    {
      header: 'Symbol',
      render: (p) => <strong className="font-bold text-white">{p.symbol}</strong>,
    },
    {
      header: 'Type',
      render: (p) => (
        <Badge variant={p.type === 'BUY' ? 'success' : 'danger'} size="sm">
          {p.type}
        </Badge>
      ),
    },
    {
      header: 'Volume',
      render: (p) => <span className="font-mono-num">{p.volume.toFixed(2)} Lots</span>,
    },
    {
      header: 'Open Price',
      align: 'right',
      render: (p) => <span className="font-mono-num">{p.openPrice.toFixed(4)}</span>,
    },
    {
      header: 'Current Price',
      align: 'right',
      render: (p) => <span className="font-mono-num">{p.currentPrice.toFixed(4)}</span>,
    },
    {
      header: 'Floating P/L',
      align: 'right',
      render: (p) => {
        const isPos = p.pnl >= 0;
        return (
          <span
            className={`font-mono-num font-bold ${
              isPos ? 'text-emerald-400' : 'text-red-400'
            }`}
          >
            {isPos ? '+' : ''}${p.pnl.toFixed(2)}
          </span>
        );
      },
    },
    {
      header: 'Action',
      align: 'right',
      render: (p) => (
        <button
          onClick={() => handleClosePosition(p.id)}
          className="text-xs px-2.5 py-1 rounded bg-neutral-800 hover:bg-red-950 text-neutral-300 hover:text-red-400 border border-neutral-700 transition-colors cursor-pointer"
        >
          Close
        </button>
      ),
    },
  ];

  return (
    <div className="space-y-6">
      {/* Top Banner Greeting */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-[#0D0D0F] p-6 rounded-2xl border border-neutral-800">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <h1 className="text-xl sm:text-2xl font-bold text-white tracking-tight">
              Welcome back, {user?.name || 'Demo Trader'}
            </h1>
            <Badge variant="red" size="sm">
              DEMO MODE
            </Badge>
          </div>
          <p className="text-xs text-neutral-400">
            Account ID: <strong className="text-neutral-200 font-mono-num">{primaryAccount?.accountNumber || 'NX-894102'}</strong> ({primaryAccount?.tier || 'Pro'} Tier • 1:{primaryAccount?.leverage || '1000'})
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2.5">
          <Link to="/dashboard/deposit">
            <Button size="sm" className="bg-emerald-600 hover:bg-emerald-500">
              <ArrowDownCircle className="w-3.5 h-3.5 mr-1" /> Deposit Demo
            </Button>
          </Link>
          <Link to="/dashboard/withdrawal">
            <Button variant="secondary" size="sm">
              <ArrowUpCircle className="w-3.5 h-3.5 mr-1" /> Withdraw
            </Button>
          </Link>
          <Link to="/dashboard/markets">
            <Button variant="outline" size="sm">
              <TrendingUp className="w-3.5 h-3.5 mr-1" /> Trade Markets
            </Button>
          </Link>
        </div>
      </div>

      {/* Portfolio Financial Metrics Row */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <StatsCard
          title="Account Balance"
          value={`$${balance.toLocaleString('en-US', { minimumFractionDigits: 2 })}`}
          subtitle="Settled Demo Capital"
          icon={<Wallet className="w-5 h-5" />}
        />
        <StatsCard
          title="Total Equity"
          value={`$${equity.toLocaleString('en-US', { minimumFractionDigits: 2 })}`}
          subtitle="Balance + Floating P/L"
          trend={{
            value: totalOpenPnl >= 0 ? `+$${totalOpenPnl.toFixed(2)}` : `-$${Math.abs(totalOpenPnl).toFixed(2)}`,
            isPositive: totalOpenPnl >= 0,
          }}
          icon={<TrendingUp className="w-5 h-5" />}
        />
        <StatsCard
          title="Free Margin"
          value={`$${freeMargin.toLocaleString('en-US', { minimumFractionDigits: 2 })}`}
          subtitle={`Margin Used: $${marginUsed.toFixed(2)}`}
          icon={<Layers className="w-5 h-5" />}
        />
        <StatsCard
          title="Margin Level"
          value={`${marginLevel.toFixed(1)}%`}
          subtitle="Safety Buffer: Healthy"
          icon={<Shield className="w-5 h-5" />}
        />
      </div>

      {/* WebTrader Interactive Terminal Component */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <h2 className="text-base font-bold text-white">Live Execution Terminal</h2>
          <Badge variant="red" size="sm">
            DEMO STREAM FEED
          </Badge>
        </div>
        <TradingTerminalMock />
      </div>

      {/* Active Positions Table */}
      <Card padding="md" className="space-y-4">
        <div className="flex items-center justify-between border-b border-neutral-800 pb-3">
          <div className="flex items-center gap-2">
            <BarChart2 className="w-4 h-4 text-red-500" />
            <h3 className="text-sm font-bold text-white">Active Open Positions</h3>
            <span className="text-xs bg-[#151518] px-2 py-0.5 rounded text-neutral-400 font-mono-num">
              {openPositions.length} Open
            </span>
          </div>
          <Link to="/dashboard/positions" className="text-xs text-red-400 hover:underline">
            Manage All Positions →
          </Link>
        </div>

        <Table
          columns={positionColumns}
          data={openPositions}
          keyExtractor={(p) => p.id}
          emptyMessage="No active open positions. Execute an order using the terminal above or Market Explorer."
        />
      </Card>
    </div>
  );
};
