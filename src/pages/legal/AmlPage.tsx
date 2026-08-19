import React from 'react';
import { Badge } from '../../components/Badge';
import { Card } from '../../components/Card';

export const AmlPage: React.FC = () => {
  return (
    <div className="py-12 lg:py-16 px-4 sm:px-6 lg:px-8 max-w-4xl mx-auto space-y-8 text-left">
      <div className="space-y-3">
        <Badge variant="red" size="sm">
          COMPLIANCE FRAMEWORK
        </Badge>
        <h1 className="text-3xl sm:text-4xl font-black text-white tracking-tight">
          Anti-Money Laundering (AML) & KYC Policy
        </h1>
        <p className="text-xs text-neutral-400 font-mono-num">
          Last revised: January 2025 • Reference: DOC-NXR-AML-04
        </p>
      </div>

      <div className="p-4 bg-red-950/20 border border-red-900/40 rounded-xl text-red-300 text-xs font-semibold">
        Notice: Replace this demo legal content with official documentation before production.
      </div>

      <Card padding="lg" className="text-neutral-300 text-xs sm:text-sm leading-relaxed space-y-6">
        <section className="space-y-2">
          <h2 className="text-base font-bold text-white">1. AML Policy Commitment</h2>
          <p>
            Nexora Trade is committed to upholding international standards of anti-money laundering (AML), counter-terrorist financing (CTF), and Know-Your-Customer (KYC) identity verification procedures across its operational entities.
          </p>
        </section>

        <section className="space-y-2">
          <h2 className="text-base font-bold text-white">2. Identity Verification (KYC)</h2>
          <p>
            In production implementations, clients are required to furnish government-issued photo identification (passport, national ID, or driver’s license) and verified proof of address (utility bill or bank statement issued within the last 90 days) prior to initiating live account operations.
          </p>
        </section>

        <section className="space-y-2">
          <h2 className="text-base font-bold text-white">3. Third-Party Payments Prohibition</h2>
          <p>
            Deposits and withdrawals must strictly originate from and be returned to banking accounts or payment methods held in the exact registered legal name of the verified account holder. Third-party transactions are strictly rejected.
          </p>
        </section>
      </Card>
    </div>
  );
};
