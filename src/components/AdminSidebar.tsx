import React from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import {
  LayoutDashboard,
  Users,
  Wallet,
  TrendingUp,
  Receipt,
  FileText,
  HelpCircle,
  Settings,
  LogOut,
  ExternalLink,
  Shield,
  X,
} from 'lucide-react';
import { useAuth } from '../hooks/useStorage';

export interface AdminSidebarProps {
  mobileOpen?: boolean;
  onCloseMobile?: () => void;
}

export const AdminSidebar: React.FC<AdminSidebarProps> = ({ mobileOpen, onCloseMobile }) => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const adminNavItems = [
    { to: '/admin', label: 'Overview', icon: LayoutDashboard, end: true },
    { to: '/admin/users', label: 'Users & Verifikasi KTP', icon: Users },
    { to: '/admin/accounts', label: 'Trading Accounts', icon: Wallet },
    { to: '/admin/markets', label: 'Markets & Instruments', icon: TrendingUp },
    { to: '/admin/transactions', label: 'Transactions', icon: Receipt },
    { to: '/admin/articles', label: 'Education Articles', icon: FileText },
    { to: '/admin/faq', label: 'FAQ Manager', icon: HelpCircle },
    { to: '/admin/settings', label: 'Platform Settings', icon: Settings },
  ];

  const handleLogout = () => {
    logout();
    navigate('/admin/login');
  };

  return (
    <>
      {mobileOpen && (
        <div
          className="fixed inset-0 bg-black/80 z-40 lg:hidden"
          onClick={onCloseMobile}
        />
      )}

      <aside
        className={`fixed top-0 bottom-0 left-0 z-40 w-64 bg-[#0B0B0D] border-r border-neutral-800 flex flex-col justify-between transition-transform duration-200 lg:translate-x-0 ${
          mobileOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        <div>
          {/* Header */}
          <div className="h-16 px-6 flex items-center justify-between border-b border-neutral-800 bg-[#121216]">
            <div className="flex items-center gap-2">
              <Shield className="w-5 h-5 text-red-500" />
              <div className="flex flex-col">
                <span className="font-black text-white tracking-wider text-xs uppercase leading-tight">
                  NEXORA <span className="text-red-500">ADMIN</span>
                </span>
                <span className="text-[9px] text-neutral-400 font-mono">Control Center</span>
              </div>
            </div>
            {onCloseMobile && (
              <button
                onClick={onCloseMobile}
                className="lg:hidden p-1.5 text-neutral-400 hover:text-white rounded-lg"
              >
                <X className="w-5 h-5" />
              </button>
            )}
          </div>

          {/* Admin User Info */}
          <div className="p-4 mx-3 my-3 bg-[#151518] rounded-xl border border-neutral-800">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded bg-red-600 flex items-center justify-center text-white font-bold text-xs">
                ADM
              </div>
              <div className="truncate">
                <h5 className="text-xs font-bold text-white truncate">{user?.name || 'Administrator'}</h5>
                <span className="text-[10px] text-red-400 font-mono-num font-semibold uppercase">
                  Super Admin
                </span>
              </div>
            </div>
          </div>

          {/* Nav Items */}
          <nav className="px-3 py-2 space-y-1 overflow-y-auto max-h-[calc(100vh-270px)]">
            {adminNavItems.map((item) => (
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

        {/* Bottom Actions */}
        <div className="p-3 border-t border-neutral-800 space-y-1">
          <NavLink
            to="/dashboard"
            className="flex items-center justify-between px-3.5 py-2 rounded-lg text-xs text-neutral-400 hover:text-white hover:bg-neutral-900 transition-colors"
          >
            <span className="flex items-center gap-2">
              <ExternalLink className="w-4 h-4" />
              Client Dashboard
            </span>
          </NavLink>
          <button
            onClick={handleLogout}
            className="w-full flex items-center gap-3 px-3.5 py-2 rounded-lg text-xs font-medium text-red-400 hover:bg-red-950/40 transition-colors cursor-pointer"
          >
            <LogOut className="w-4 h-4 shrink-0" />
            <span>Sign Out Admin</span>
          </button>
        </div>
      </aside>
    </>
  );
};
