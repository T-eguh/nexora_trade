import React from 'react';
import { Link } from 'react-router-dom';
import { Card } from '../../components/Card';
import { Button } from '../../components/Button';
import { Badge } from '../../components/Badge';
import { CheckCircle2, ShieldAlert, Zap, ArrowRight, HelpCircle } from 'lucide-react';
import { ACCOUNT_TIERS } from '../../data/accounts';

export const AccountsPage: React.FC = () => {
  return (
    <div className="py-12 lg:py-16 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto space-y-16">
      {/* Page Header */}
      <div className="text-center max-w-3xl mx-auto space-y-4">
        <Badge variant="red" size="md">
          DEMO CONDITIONS
        </Badge>
        <h1 className="text-3xl sm:text-5xl font-black text-white tracking-tight">
          Flexible Trading Accounts for Every Strategy
        </h1>
        <p className="text-sm sm:text-base text-neutral-300">
          Compare our 4 distinct account tiers designed for beginners, experienced day traders, scalpers, and institutional VIP clients.
        </p>
      </div>

      {/* Account Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {ACCOUNT_TIERS.map((tier) => (
          <Card
            key={tier.type}
            hoverEffect
            padding="lg"
            className={`flex flex-col justify-between relative ${
              tier.popular ? 'border-red-600 bg-[#120e10]' : ''
            }`}
          >
            {tier.popular && (
              <div className="absolute -top-3.5 left-1/2 -translate-x-1/2">
                <span className="bg-red-600 text-white text-[11px] font-black uppercase tracking-wider py-1 px-3 rounded-full shadow-lg">
                  Most Popular
                </span>
              </div>
            )}

            <div>
              <div className="mb-4">
                <h3 className="text-2xl font-bold text-white tracking-tight">{tier.type}</h3>
                <p className="text-xs text-neutral-400 mt-1 min-h-[36px]">{tier.tagline}</p>
              </div>

              {/* Price & Spread Callout */}
              <div className="p-4 bg-[#151518] rounded-xl border border-neutral-800 font-mono-num mb-6">
                <span className="text-[10px] text-neutral-400 uppercase font-semibold block">
                  Min Deposit
                </span>
                <span className="text-2xl font-black text-white">{tier.minDeposit}</span>
                <div className="mt-2 pt-2 border-t border-neutral-800 flex justify-between text-xs">
                  <span className="text-neutral-400">Spread from:</span>
                  <span className="font-bold text-emerald-400">{tier.spreadFrom}</span>
                </div>
              </div>

              {/* Specs Breakdown */}
              <div className="space-y-2.5 font-mono-num text-xs pb-6 border-b border-neutral-800">
                <div className="flex justify-between">
                  <span className="text-neutral-400">Commission:</span>
                  <span className="font-semibold text-white">{tier.commission}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-neutral-400">Max Leverage:</span>
                  <span className="font-semibold text-white">{tier.leverage}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-neutral-400">Swap Structure:</span>
                  <span className="font-semibold text-white">{tier.swap}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-neutral-400">Execution:</span>
                  <span className="font-semibold text-white">{tier.execution}</span>
                </div>
              </div>

              {/* Feature List */}
              <ul className="space-y-2.5 my-6 text-xs text-neutral-300">
                {tier.features.map((feat, fIdx) => (
                  <li key={fIdx} className="flex items-start gap-2">
                    <CheckCircle2 className="w-4 h-4 text-red-500 shrink-0 mt-0.5" />
                    <span>{feat}</span>
                  </li>
                ))}
              </ul>
            </div>

            <div className="pt-2">
              <Link to="/register">
                <Button
                  variant={tier.popular ? 'primary' : 'secondary'}
                  fullWidth
                  size="md"
                >
                  OPEN {tier.type.toUpperCase()} ACCOUNT
                </Button>
              </Link>
            </div>
          </Card>
        ))}
      </div>

      {/* Comprehensive Comparison Table */}
      <div className="space-y-6 pt-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-neutral-800 pb-4">
          <div>
            <h2 className="text-xl sm:text-2xl font-bold text-white tracking-tight">
              Full Account Specification Matrix
            </h2>
            <p className="text-xs text-neutral-400">
              Detailed breakdown of trading mechanics across all virtual account tiers.
            </p>
          </div>
          <Badge variant="red" size="sm">
            DEMO CONDITIONS
          </Badge>
        </div>

        <div className="overflow-x-auto rounded-xl border border-neutral-800 bg-[#0D0D0F]">
          <table className="w-full text-left text-sm text-neutral-300">
            <thead className="bg-[#151518] text-xs font-bold uppercase tracking-wider text-neutral-400 border-b border-neutral-800 font-mono-num">
              <tr>
                <th className="py-4 px-6">Feature</th>
                <th className="py-4 px-6 text-center">Starter</th>
                <th className="py-4 px-6 text-center text-red-400 font-bold">Pro (Popular)</th>
                <th className="py-4 px-6 text-center">Zero Spread</th>
                <th className="py-4 px-6 text-center">Premium VIP</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-neutral-800/80 font-mono-num text-xs">
              <tr className="hover:bg-neutral-900/40">
                <td className="py-3.5 px-6 font-semibold text-white">Minimum Deposit</td>
                <td className="py-3.5 px-6 text-center">$10</td>
                <td className="py-3.5 px-6 text-center text-red-400 font-bold">$100</td>
                <td className="py-3.5 px-6 text-center">$500</td>
                <td className="py-3.5 px-6 text-center">$5,000</td>
              </tr>
              <tr className="hover:bg-neutral-900/40">
                <td className="py-3.5 px-6 font-semibold text-white">Spread (EUR/USD)</td>
                <td className="py-3.5 px-6 text-center">From 1.2 pips</td>
                <td className="py-3.5 px-6 text-center text-red-400 font-bold">From 0.6 pips</td>
                <td className="py-3.5 px-6 text-center text-emerald-400 font-bold">From 0.0 pips</td>
                <td className="py-3.5 px-6 text-center text-emerald-400 font-bold">From 0.0 pips</td>
              </tr>
              <tr className="hover:bg-neutral-900/40">
                <td className="py-3.5 px-6 font-semibold text-white">Trading Commission</td>
                <td className="py-3.5 px-6 text-center">$0 / lot</td>
                <td className="py-3.5 px-6 text-center text-red-400 font-bold">$0 / lot</td>
                <td className="py-3.5 px-6 text-center">$3.50 / side</td>
                <td className="py-3.5 px-6 text-center">$2.00 / side</td>
              </tr>
              <tr className="hover:bg-neutral-900/40">
                <td className="py-3.5 px-6 font-semibold text-white">Max Leverage</td>
                <td className="py-3.5 px-6 text-center">1:500</td>
                <td className="py-3.5 px-6 text-center text-red-400 font-bold">1:1000</td>
                <td className="py-3.5 px-6 text-center">1:1000</td>
                <td className="py-3.5 px-6 text-center">1:2000</td>
              </tr>
              <tr className="hover:bg-neutral-900/40">
                <td className="py-3.5 px-6 font-semibold text-white">Execution Model</td>
                <td className="py-3.5 px-6 text-center">Market Execution</td>
                <td className="py-3.5 px-6 text-center text-red-400 font-bold">STP Direct</td>
                <td className="py-3.5 px-6 text-center">Raw ECN</td>
                <td className="py-3.5 px-6 text-center">Institutional ECN</td>
              </tr>
              <tr className="hover:bg-neutral-900/40">
                <td className="py-3.5 px-6 font-semibold text-white">Micro Lots (0.01)</td>
                <td className="py-3.5 px-6 text-center text-emerald-400">Yes</td>
                <td className="py-3.5 px-6 text-center text-emerald-400 font-bold">Yes</td>
                <td className="py-3.5 px-6 text-center text-emerald-400">Yes</td>
                <td className="py-3.5 px-6 text-center text-emerald-400">Yes</td>
              </tr>
              <tr className="hover:bg-neutral-900/40">
                <td className="py-3.5 px-6 font-semibold text-white">Expert Advisors (EA)</td>
                <td className="py-3.5 px-6 text-center text-neutral-500">Standard</td>
                <td className="py-3.5 px-6 text-center text-emerald-400 font-bold">Allowed</td>
                <td className="py-3.5 px-6 text-center text-emerald-400">Allowed</td>
                <td className="py-3.5 px-6 text-center text-emerald-400">Allowed</td>
              </tr>
              <tr className="hover:bg-neutral-900/40">
                <td className="py-3.5 px-6 font-semibold text-white">Dedicated Account Mgr</td>
                <td className="py-3.5 px-6 text-center text-neutral-500">-</td>
                <td className="py-3.5 px-6 text-center text-neutral-500">-</td>
                <td className="py-3.5 px-6 text-center text-neutral-400">Upon Request</td>
                <td className="py-3.5 px-6 text-center text-emerald-400 font-bold">Included</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
