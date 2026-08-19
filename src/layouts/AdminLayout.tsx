import React, { useState } from 'react';
import { Outlet, Link } from 'react-router-dom';
import { AdminSidebar } from '../components/AdminSidebar';
import { Menu, ShieldAlert, CheckCircle, Database } from 'lucide-react';
import { Badge } from '../components/Badge';
import { useAuth } from '../hooks/useStorage';

export const AdminLayout: React.FC = () => {
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);
  const { user } = useAuth();

  return (
    <div className="min-h-screen bg-[#050505] text-neutral-100 flex">
      {/* Admin Sidebar */}
      <AdminSidebar
        mobileOpen={mobileSidebarOpen}
        onCloseMobile={() => setMobileSidebarOpen(false)}
      />

      {/* Main Admin Area */}
      <div className="flex-1 lg:pl-64 flex flex-col min-h-screen min-w-0">
        {/* Topbar */}
        <header className="h-16 bg-[#0B0B0D]/95 backdrop-blur-md border-b border-neutral-800 sticky top-0 z-30 px-4 sm:px-6 flex items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <button
              onClick={() => setMobileSidebarOpen(true)}
              className="lg:hidden p-2 rounded-lg text-neutral-400 hover:text-white hover:bg-neutral-800 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-red-500"
              aria-label="Open admin sidebar"
            >
              <Menu className="w-5 h-5" />
            </button>
            <div className="flex items-center gap-2">
              <Badge variant="red" size="sm">
                ADMIN CONSOLE
              </Badge>
              <span className="hidden sm:inline-flex items-center gap-1.5 text-xs text-neutral-400 font-mono-num">
                <Database className="w-3.5 h-3.5 text-emerald-400" />
                Local State Sync: OK
              </span>
            </div>
          </div>

          <div className="flex items-center gap-4 text-xs">
            <Link
              to="/dashboard"
              className="text-neutral-400 hover:text-white transition-colors"
            >
              Switch to Client Portal
            </Link>
            <div className="flex items-center gap-2 pl-3 border-l border-neutral-800">
              <div className="text-right hidden sm:block">
                <span className="block font-bold text-white">Chief Admin</span>
                <span className="text-[10px] text-red-400 font-mono-num">
                  admin@nexoratrade.com
                </span>
              </div>
              <div className="w-8 h-8 rounded-lg bg-red-600 flex items-center justify-center text-white font-bold text-xs">
                ADM
              </div>
            </div>
          </div>
        </header>

        {/* Content */}
        <main className="flex-1 p-4 sm:p-6 lg:p-8 max-w-7xl w-full mx-auto space-y-6">
          <Outlet />
        </main>
      </div>
    </div>
  );
};
