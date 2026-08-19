import React from 'react';
import { Badge } from '../../components/Badge';
import { Card } from '../../components/Card';
import { ShieldAlert } from 'lucide-react';

export const RiskDisclosurePage: React.FC = () => {
  return (
    <div className="py-12 lg:py-16 px-4 sm:px-6 lg:px-8 max-w-4xl mx-auto space-y-8 text-left">
      <div className="space-y-3">
        <Badge variant="danger" size="sm">
          CRITICAL RISK WARNING
        </Badge>
        <h1 className="text-3xl sm:text-4xl font-black text-white tracking-tight">
          General Risk Disclosure Notice
        </h1>
        <p className="text-xs text-neutral-400 font-mono-num">
          Last revised: January 2025 • Reference: DOC-NXR-RISK-03
        </p>
      </div>

      <div className="p-4 bg-red-950/20 border border-red-900/40 rounded-xl text-red-300 text-xs font-semibold">
        Notice: Replace this demo legal content with official documentation before production.
      </div>

      <Card padding="lg" className="text-neutral-300 text-xs sm:text-sm leading-relaxed space-y-6">
        <div className="p-4 bg-[#151518] rounded-xl border border-neutral-800 flex items-start gap-3">
          <ShieldAlert className="w-5 h-5 text-red-500 shrink-0 mt-0.5" />
          <div>
            <h3 className="text-sm font-bold text-white mb-1">High Risk Derivative Warning</h3>
            <p className="text-xs text-neutral-300">
              Trading leveraged financial products such as Forex, Contracts for Difference (CFDs), Precious Metals, and Crypto derivatives carries a high degree of risk to capital. Losses can exceed initial deposits.
            </p>
          </div>
        </div>

        <section className="space-y-2">
          <h2 className="text-base font-bold text-white">1. Leverage and Volatility</h2>
          <p>
            The high degree of leverage available in derivative trading means that small market movements can produce substantial proportional impacts on your account equity. A favorable movement can generate significant gains, while an adverse movement can result in the total depletion of your margin collateral.
          </p>
        </section>

        <section className="space-y-2">
          <h2 className="text-base font-bold text-white">2. Market Gapping & Slippage</h2>
          <p>
            During extreme market volatility, economic news releases, or weekend session openings, prices may experience "gapping," where the market opens at a price substantially different from the previous tick. Stop-loss orders cannot guarantee execution at exact requested levels during slippage events.
          </p>
        </section>

        <section className="space-y-2">
          <h2 className="text-base font-bold text-white">3. Appropriateness Assessment</h2>
          <p>
            Before undertaking leveraged derivative trading, you should carefully assess your investment objectives, level of market experience, and personal appetite for financial risk. Never trade with capital you cannot afford to lose.
          </p>
        </section>
      </Card>
    </div>
  );
};
