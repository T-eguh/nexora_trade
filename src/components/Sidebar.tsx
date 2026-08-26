import React from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import {
  Home,
  ArrowDownCircle,
  ArrowUpCircle,
  Repeat,
  Wallet,
  LineChart,
  UserCheck,
  Users,
  Settings,
  LogOut,
  X,
  Globe,
  FileCheck2,
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
    { to: '/dashboard', label: 'Beranda', icon: Home, end: true },
    { to: '/dashboard/verification', label: 'Verifikasi KTP', icon: FileCheck2 },
    { to: '/dashboard/deposit', label: 'Setoran (Deposit)', icon: ArrowDownCircle },
    { to: '/dashboard/withdrawal', label: 'Penarikan Dana', icon: ArrowUpCircle },
    { to: '/dashboard/transactions', label: 'Riwayat Transaksi', icon: Repeat },
    { to: '/dashboard/accounts', label: 'Dompet & Akun', icon: Wallet },
    { to: '/dashboard/markets', label: 'Nexora WebTrader', icon: LineChart },
    { to: '/dashboard/security', label: 'Pengaturan & Ganti Sandi', icon: Settings },
    { to: '/dashboard/profile', label: 'Profil Saya', icon: UserCheck },
    { to: '/dashboard/support', label: 'Bantuan & Tiket', icon: Users },
  ];

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const kycStatus = user?.kycStatus || 'unverified';

  return (
    <>
      {/* Mobile backdrop */}
      {mobileOpen && (
        <div
          className="fixed inset-0 bg-black/60 z-40 lg:hidden animate-fadeIn"
          onClick={onCloseMobile}
        />
      )}

      <aside
        className={`fixed top-0 bottom-0 left-0 z-50 w-72 bg-white text-neutral-800 border-r border-neutral-200 flex flex-col justify-between shadow-2xl transition-transform duration-200 lg:translate-x-0 ${
          mobileOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        <div className="overflow-y-auto flex-1">
          {/* Header Brand */}
          <div className="h-16 px-5 flex items-center justify-between border-b border-neutral-200 bg-white">
            <NavLink to="/" className="flex items-center gap-2" onClick={onCloseMobile}>
              <span className="w-7 h-7 rounded bg-red-600 flex items-center justify-center text-white font-black text-xs shadow-sm">
                N
              </span>
              <div>
                <div className="font-black text-base tracking-tight text-neutral-900 leading-tight">
                  NEXORA<span className="text-red-600 font-bold ml-1">TRADE</span>
                </div>
                <span className="text-[9px] font-bold text-neutral-500 uppercase tracking-wider block">
                  Client Portal
                </span>
              </div>
            </NavLink>
            {onCloseMobile && (
              <button
                type="button"
                onClick={onCloseMobile}
                className="lg:hidden p-1.5 text-neutral-400 hover:text-neutral-700 rounded-lg"
              >
                <X className="w-5 h-5" />
              </button>
            )}
          </div>

          {/* User Profile Card */}
          <div className="p-4 mx-3 my-3 bg-neutral-50 rounded-xl border border-neutral-200 space-y-2">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-red-100 border border-red-200 flex items-center justify-center text-red-700 font-bold text-sm">
                {user?.name ? user.name.substring(0, 2).toUpperCase() : 'NT'}
              </div>
              <div className="truncate flex-1">
                <h5 className="text-xs font-bold text-neutral-900 truncate">
                  {user?.name || 'Trader Nexora'}
                </h5>
                <p className="text-[11px] text-neutral-500 truncate">
                  {user?.email || 'trader@nexoratrade.com'}
                </p>
              </div>
            </div>

            <div className="pt-2 border-t border-neutral-200 flex items-center justify-between text-[11px]">
              <span className="text-neutral-500">Status KTP:</span>
              <span
                className={`px-2 py-0.5 rounded font-bold text-[10px] ${
                  kycStatus === 'verified'
                    ? 'bg-emerald-100 text-emerald-800'
                    : kycStatus === 'pending'
                    ? 'bg-amber-100 text-amber-800'
                    : 'bg-neutral-100 text-neutral-600'
                }`}
              >
                {kycStatus === 'verified'
                  ? 'KTP TERVERIFIKASI'
                  : kycStatus === 'pending'
                  ? 'MENUNGGU APPROVAL'
                  : 'BELUM UPLOAD KTP'}
              </span>
            </div>
          </div>

          {/* Navigation Links */}
          <nav className="px-3 py-1 space-y-1 font-medium text-sm">
            {navItems.map((item, idx) => (
              <NavLink
                key={idx}
                to={item.to}
                end={item.end}
                onClick={onCloseMobile}
                className={({ isActive }) =>
                  `flex items-center gap-3.5 px-4 py-2.5 rounded-lg text-xs font-semibold transition-colors ${
                    isActive
                      ? 'bg-neutral-100 text-red-600 font-bold border-l-4 border-red-600'
                      : 'text-neutral-700 hover:bg-neutral-50 hover:text-neutral-900'
                  }`
                }
              >
                <item.icon className="w-4 h-4 shrink-0 text-neutral-500" />
                <span className="truncate">{item.label}</span>
              </NavLink>
            ))}
          </nav>
        </div>

        {/* Footer Actions */}
        <div className="p-3 border-t border-neutral-200 bg-neutral-50 space-y-1 text-xs">
          <NavLink
            to="/"
            onClick={onCloseMobile}
            className="flex items-center gap-2 px-3.5 py-2 rounded-lg text-neutral-600 hover:text-neutral-900 hover:bg-white transition-colors"
          >
            <Globe className="w-4 h-4 text-neutral-500" />
            <span>Situs Web Publik</span>
          </NavLink>
          <button
            type="button"
            onClick={handleLogout}
            className="w-full flex items-center gap-2 px-3.5 py-2 rounded-lg text-red-600 hover:bg-red-50 font-semibold transition-colors cursor-pointer text-left"
          >
            <LogOut className="w-4 h-4" />
            <span>Keluar Akun (Logout)</span>
          </button>
        </div>
      </aside>
    </>
  );
};
