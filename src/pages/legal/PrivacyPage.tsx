import React from 'react';
import { Badge } from '../../components/Badge';
import { Card } from '../../components/Card';
import { Shield } from 'lucide-react';

export const PrivacyPage: React.FC = () => {
  return (
    <div className="py-12 lg:py-16 px-4 sm:px-6 lg:px-8 max-w-4xl mx-auto space-y-8 text-left">
      <div className="space-y-3">
        <Badge variant="red" size="sm">
          LEGAL DOCUMENTATION
        </Badge>
        <h1 className="text-3xl sm:text-4xl font-black text-white tracking-tight">
          Privacy & Data Protection Policy
        </h1>
        <p className="text-xs text-neutral-400 font-mono-num">
          Last revised: January 2025 • Reference: DOC-NXR-PRIV-01
        </p>
      </div>

      <div className="p-4 bg-red-950/20 border border-red-900/40 rounded-xl text-red-300 text-xs font-semibold">
        Notice: Replace this demo legal content with official documentation before production.
      </div>

      <Card padding="lg" className="prose prose-invert max-w-none text-neutral-300 text-xs sm:text-sm leading-relaxed space-y-6">
        <section className="space-y-2">
          <h2 className="text-base font-bold text-white">1. Information Collection</h2>
          <p>
            Nexora Trade collects information you provide directly through our registration and contact forms, including your full name, email address, telephone number, and residential country. In this simulated environment, all profile data is stored locally in client memory.
          </p>
        </section>

        <section className="space-y-2">
          <h2 className="text-base font-bold text-white">2. Use of Information</h2>
          <p>
            Collected information is utilized strictly to provide simulated portal access, maintain user session preferences, authenticate demo client credentials, and respond to support inquiries.
          </p>
        </section>

        <section className="space-y-2">
          <h2 className="text-base font-bold text-white">3. Data Security & Storage</h2>
          <p>
            We deploy technical safeguards designed to protect personal information against unauthorized access, destruction, or disclosure. In demo mode, no real banking or identity documents are collected or retained.
          </p>
        </section>

        <section className="space-y-2">
          <h2 className="text-base font-bold text-white">4. Your Rights</h2>
          <p>
            Users may update their stored profile information, clear local browser storage, or submit requests to erase demo session logs at any time directly through the Client Profile settings.
          </p>
        </section>
      </Card>
    </div>
  );
};
