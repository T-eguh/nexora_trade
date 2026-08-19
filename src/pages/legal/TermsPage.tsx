import React from 'react';
import { Badge } from '../../components/Badge';
import { Card } from '../../components/Card';

export const TermsPage: React.FC = () => {
  return (
    <div className="py-12 lg:py-16 px-4 sm:px-6 lg:px-8 max-w-4xl mx-auto space-y-8 text-left">
      <div className="space-y-3">
        <Badge variant="red" size="sm">
          LEGAL DOCUMENTATION
        </Badge>
        <h1 className="text-3xl sm:text-4xl font-black text-white tracking-tight">
          Terms & Conditions of Service
        </h1>
        <p className="text-xs text-neutral-400 font-mono-num">
          Last revised: January 2025 • Reference: DOC-NXR-TERMS-02
        </p>
      </div>

      <div className="p-4 bg-red-950/20 border border-red-900/40 rounded-xl text-red-300 text-xs font-semibold">
        Notice: Replace this demo legal content with official documentation before production.
      </div>

      <Card padding="lg" className="text-neutral-300 text-xs sm:text-sm leading-relaxed space-y-6">
        <section className="space-y-2">
          <h2 className="text-base font-bold text-white">1. Acceptance of Terms</h2>
          <p>
            By accessing and utilizing the Nexora Trade demonstration website and associated services, you acknowledge and agree to be bound by these Terms and Conditions. If you disagree with any part of these terms, you must refrain from using the platform.
          </p>
        </section>

        <section className="space-y-2">
          <h2 className="text-base font-bold text-white">2. Demonstration & Simulated Scope</h2>
          <p>
            The software, trading interfaces, market data feeds, deposit mechanisms, withdrawal simulations, and account balances provided on this platform operate exclusively under virtual simulation conditions. No actual broker custody, interbank settlement, or real money transfers occur.
          </p>
        </section>

        <section className="space-y-2">
          <h2 className="text-base font-bold text-white">3. User Conduct</h2>
          <p>
            Users agree not to attempt automated denial-of-service, penetration testing, or reverse engineering of the application codebase without prior authorization.
          </p>
        </section>

        <section className="space-y-2">
          <h2 className="text-base font-bold text-white">4. Limitation of Liability</h2>
          <p>
            Nexora Trade and its developers shall not be liable for any direct, indirect, incidental, or consequential damages resulting from the use or inability to use this demonstration software.
          </p>
        </section>
      </Card>
    </div>
  );
};
