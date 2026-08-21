import React from 'react';
import { HFMWebTrader } from '../../components/HFMWebTrader';

export const DashboardMarketsPage: React.FC = () => {
  return (
    <div className="space-y-4">
      <div>
        <h1 className="text-xl sm:text-2xl font-bold text-neutral-900 tracking-tight">
          Nexora / HFM WebTrader Terminal
        </h1>
        <p className="text-xs text-neutral-500">
          Akses kutipan pasar interbank secara real-time dengan eksekusi satu klik dan antarmuka chart interaktif.
        </p>
      </div>

      <HFMWebTrader />
    </div>
  );
};
