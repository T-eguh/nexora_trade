import React from 'react';
import { Link } from 'react-router-dom';
import { Button } from '../components/Button';
import { ShieldAlert, Home, ArrowLeft } from 'lucide-react';

export const NotFoundPage: React.FC = () => {
  return (
    <div className="min-h-[70vh] flex items-center justify-center px-4 py-16">
      <div className="max-w-md w-full text-center space-y-6">
        <div className="w-16 h-16 rounded-2xl bg-red-950/60 border border-red-800/80 flex items-center justify-center text-red-500 mx-auto">
          <ShieldAlert className="w-8 h-8" />
        </div>

        <div className="space-y-2">
          <span className="text-5xl font-black text-white font-mono-num">404</span>
          <h1 className="text-2xl font-bold text-white tracking-tight">
            Instrument or Page Not Found
          </h1>
          <p className="text-xs text-neutral-400 leading-relaxed">
            The destination you requested does not exist or has been moved to a different market route.
          </p>
        </div>

        <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-2">
          <Link to="/" className="w-full sm:w-auto">
            <Button size="md" className="w-full sm:w-auto">
              <Home className="w-4 h-4 mr-1.5" /> Return Home
            </Button>
          </Link>
          <Link to="/markets" className="w-full sm:w-auto">
            <Button variant="secondary" size="md" className="w-full sm:w-auto">
              Explore Markets
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
};
