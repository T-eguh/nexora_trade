import React, { useState } from 'react';
import { Outlet, Link } from 'react-router-dom';
import { Sidebar } from '../components/Sidebar';
import { Menu, Bell, ShieldAlert, Plus } from 'lucide-react';
import { Badge } from '../components/Badge';
import { useAuth } from '../hooks/useStorage';

export const DashboardLayout: React.FC = () => {
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);
  const { user } = useAuth();

  return (
    <div className="min-h-screen bg-[#050505] text-neutral-100 flex">
      {/* Sidebar navigation */}
      <Sidebar
        mobileOpen={mobileSidebarOpen}
        onCloseMobile={() => setMobileSidebarOpen(false)}
      />

      {/* Main Content Area */}
      <div className="flex-1 lg:pl-64 flex flex-col min-h-screen min-w-0">
        {/* Top bar */}
        <header className="h-16 bg-[#0D0D0F]/90 backdrop-blur-md border-b border-neutral-800 sticky top-0 z-30 px-4 sm:px-6 flex items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <button
              onClick={() => setMobileSidebarOpen(true)}
              className="lg:hidden p-2 rounded-lg text-neutral-400 hover:text-white hover:bg-neutral-800 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-red-500"
              aria-label="Open sidebar"
            >
              <Menu className="w-5 h-5" />
            </button>
            <div className="flex items-center gap-2">
              <Badge variant="red" size="sm">
                DEMO ACCOUNT
              </Badge>
              <span className="hidden sm:inline-block text-xs text-neutral-400">
                Server: <strong className="text-neutral-300">Nexora-Live-01</strong>
              </span>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <Link
              to="/dashboard/deposit"
              className="hidden sm:inline-flex items-center gap-1.5 py-1.5 px-3 bg-red-600 hover:bg-red-500 text-white text-xs font-bold uppercase rounded-lg transition-colors"
            >
              <Plus className="w-3.5 h-3.5" />
              Deposit Demo Funds
            </Link>

            <div className="flex items-center gap-2 pl-2 border-l border-neutral-800 text-xs">
              <div className="text-right hidden sm:block">
                <span className="block font-semibold text-white truncate max-w-[140px]">
                  {user?.name || 'Demo Trader'}
                </span>
                <span className="text-[10px] text-neutral-400 font-mono-num">
                  NX-894102 (Pro)
                </span>
              </div>
              <div className="w-8 h-8 rounded-lg bg-[#18181b] border border-neutral-700 flex items-center justify-center text-red-400 font-bold text-xs">
                {user?.name ? user.name.substring(0, 1) : 'U'}
              </div>
            </div>
          </div>
        </header>

        {/* Page Inner Content */}
        <main className="flex-1 p-4 sm:p-6 lg:p-8 max-w-7xl w-full mx-auto space-y-6">
          <Outlet />
        </main>
      </div>
    </div>
  );
};
