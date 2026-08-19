import React from 'react';
import { Badge } from '../../components/Badge';
import { Card } from '../../components/Card';

export const CookiesPage: React.FC = () => {
  return (
    <div className="py-12 lg:py-16 px-4 sm:px-6 lg:px-8 max-w-4xl mx-auto space-y-8 text-left">
      <div className="space-y-3">
        <Badge variant="red" size="sm">
          LEGAL DOCUMENTATION
        </Badge>
        <h1 className="text-3xl sm:text-4xl font-black text-white tracking-tight">
          Cookie Policy & Web Storage
        </h1>
        <p className="text-xs text-neutral-400 font-mono-num">
          Last revised: January 2025 • Reference: DOC-NXR-COOK-05
        </p>
      </div>

      <div className="p-4 bg-red-950/20 border border-red-900/40 rounded-xl text-red-300 text-xs font-semibold">
        Notice: Replace this demo legal content with official documentation before production.
      </div>

      <Card padding="lg" className="text-neutral-300 text-xs sm:text-sm leading-relaxed space-y-6">
        <section className="space-y-2">
          <h2 className="text-base font-bold text-white">1. What Are Cookies and Local Storage?</h2>
          <p>
            Cookies and browser LocalStorage are small text files and client-side key-value pairs stored on your computer or mobile device when you interact with modern web applications.
          </p>
        </section>

        <section className="space-y-2">
          <h2 className="text-base font-bold text-white">2. How Nexora Trade Uses Storage</h2>
          <p>
            This application uses browser LocalStorage strictly for functional session persistence—including maintaining active demo login states, simulated trading positions, virtual account balances, and user interface preferences (such as selected chart timeframes).
          </p>
        </section>

        <section className="space-y-2">
          <h2 className="text-base font-bold text-white">3. Managing and Clearing Storage</h2>
          <p>
            You can clear all stored demo state and cached preferences at any time by accessing your browser’s developer tools or privacy settings and choosing to clear site data for this domain.
          </p>
        </section>
      </Card>
    </div>
  );
};
