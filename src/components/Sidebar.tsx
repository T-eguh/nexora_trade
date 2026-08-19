import React from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import {
  LayoutDashboard,
  WalletCards,
  TrendingUp,
  BarChart2,
  ListOrdered,
  ArrowDownCircle,
  ArrowUpCircle,
  Receipt,
  User,
  ShieldCheck,
  LifeBuoy,
  LogOut,
  X,
  ExternalLink,
} from 'lucide-react';
import { useAuth } from '../hooks/useStorage';

export interface SidebarProps {
  mobileOpen?: boolean;
  onCloseMobile?: () => void;
}

export const Sidebar: React.FC<SidebarProps> = ({ mobileOpen, onCloseMobile }) => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const navItems = [
    { to: '/dashboard', label: 'Dashboard', icon: LayoutDashboard, end: true },
    { to: '/dashboard/accounts', label: 'Trading Accounts', icon: WalletCards },
    { to: '/dashboard/markets', label: 'Markets', icon: TrendingUp },
    { to: '/dashboard/positions', label: 'Positions', icon: BarChart2 },
    { to: '/dashboard/orders', label: 'Orders', icon: ListOrdered },
    { to: '/dashboard/deposit', label: 'Deposit', icon: ArrowDownCircle },
    { to: '/dashboard/withdrawal', label: 'Withdrawal', icon: ArrowUpCircle },
    { to: '/dashboard/transactions', label: 'Transactions', icon: Receipt },
    { to: '/dashboard/profile', label: 'Profile', icon: User },
    { to: '/dashboard/security', label: 'Security', icon: ShieldCheck },
    { to: '/dashboard/support', label: 'Support', icon: LifeBuoy },
  ];

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <>
      {/* Mobile backdrop */}
      {mobileOpen && (
        <div
          className="fixed inset-0 bg-black/80 z-40 lg:hidden"
          onClick={onCloseMobile}
        />
      )}

      <aside
        className={`fixed top-0 bottom-0 left-0 z-40 w-64 bg-[#0D0D0F] border-r border-neutral-800 flex flex-col justify-between transition-transform duration-200 lg:translate-x-0 ${
          mobileOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        <div>
          {/* Brand Header */}
          <div className="h-16 px-6 flex items-center justify-between border-b border-neutral-800">
            <NavLink to="/" className="flex items-center gap-2">
              <span className="w-6 h-6 rounded bg-red-600 flex items-center justify-center text-white font-black text-xs">
                N
              </span>
              <span className="font-bold text-white tracking-wider text-sm">
                NEXORA<span className="text-red-500">TRADE</span>
              </span>
            </NavLink>
            {onCloseMobile && (
              <button
                onClick={onCloseMobile}
                className="lg:hidden p-1.5 text-neutral-400 hover:text-white rounded-lg"
              >
                <X className="w-5 h-5" />
              </button>
            )}
          </div>

          {/* User Brief Bar */}
          <div className="p-4 mx-3 my-3 bg-[#151518] rounded-xl border border-neutral-800/80">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-full bg-red-600/20 border border-red-500/30 flex items-center justify-center text-red-400 font-bold text-xs">
                {user?.name ? user.name.substring(0, 2).toUpperCase() : 'NX'}
              </div>
              <div className="truncate">
                <h5 className="text-xs font-bold text-white truncate">{user?.name || 'Demo Trader'}</h5>
                <p className="text-[11px] text-neutral-400 truncate">{user?.email || 'demo@nexoratrade.com'}</p>
              </div>
            </div>
            <div className="mt-2.5 pt-2 border-t border-neutral-800 flex items-center justify-between text-[10px]">
              <span className="text-neutral-400 uppercase font-semibold">Status: Active</span>
              <span className="bg-emerald-950/80 text-emerald-300 px-2 py-0.5 rounded border border-emerald-800/80 font-mono-num">
                DEMO
              </span>
            </div>
          </div>

          {/* Navigation links */}
          <nav className="px-3 py-2 space-y-0.5 overflow-y-auto max-h-[calc(100vh-280px)]">
            {navItems.map((item) => (
              <NavLink
                key={item.to}
                to={item.to}
                end={item.end}
                onClick={onCloseMobile}
                className={({ isActive }) =>
                  `flex items-center gap-3 px-3.5 py-2 rounded-lg text-xs font-medium transition-colors cursor-pointer ${
                    isActive
                      ? 'bg-red-600/10 text-red-400 font-bold border-l-2 border-red-500'
                      : 'text-neutral-400 hover:text-neutral-200 hover:bg-neutral-900/60'
                  }`
                }
              >
                <item.icon className="w-4 h-4 shrink-0" />
                <span className="truncate">{item.label}</span>
              </NavLink>
            ))}
          </nav>
        </div>

        {/* Footer actions */}
        <div className="p-3 border-t border-neutral-800 space-y-1">
          <NavLink
            to="/"
            className="flex items-center justify-between px-3.5 py-2 rounded-lg text-xs text-neutral-400 hover:text-white hover:bg-neutral-900 transition-colors"
          >
            <span className="flex items-center gap-2">
              <ExternalLink className="w-4 h-4" />
              Public Website
            </span>
          </NavLink>
          <button
            onClick={handleLogout}
            className="w-full flex items-center gap-3 px-3.5 py-2 rounded-lg text-xs font-medium text-red-400 hover:bg-red-950/40 transition-colors cursor-pointer"
          >
            <LogOut className="w-4 h-4 shrink-0" />
            <span>Logout Session</span>
          </button>
        </div>
      </aside>
    </>
  );
};
