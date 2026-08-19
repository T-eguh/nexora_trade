import React from 'react';
import { Link } from 'react-router-dom';
import { ShieldAlert, Globe, ArrowUpRight } from 'lucide-react';
import { useSiteSettings } from '../hooks/useStorage';

export const Footer: React.FC = () => {
  const { settings } = useSiteSettings();

  return (
    <footer className="bg-[#050505] border-t border-neutral-800 text-neutral-400 text-xs">
      {/* Top Footer Navigation Columns */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 lg:py-16">
        <div className="grid grid-cols-2 md:grid-cols-5 gap-8 lg:gap-12">
          {/* Col 1: Brand & Identity */}
          <div className="col-span-2 space-y-4">
            <Link
              to="/"
              className="text-lg font-black tracking-tight text-white flex items-center gap-2"
            >
              <span className="w-6 h-6 rounded bg-red-600 flex items-center justify-center text-white font-black text-xs">
                N
              </span>
              <span>
                NEXORA<span className="text-red-500">TRADE</span>
              </span>
            </Link>
            <p className="text-neutral-400 text-sm max-w-sm leading-relaxed">
              {settings.tagline}
            </p>
            <p className="text-neutral-400 text-xs max-w-sm leading-relaxed">
              Modern simulated CFD execution infrastructure engineered for precision, speed, and disciplined risk management across global markets.
            </p>
            <div className="pt-2 flex items-center gap-3">
              <a
                href={settings.socialLinks.twitter}
                target="_blank"
                rel="noreferrer"
                className="w-8 h-8 rounded-lg bg-[#151518] border border-neutral-800 flex items-center justify-center text-neutral-400 hover:text-white hover:border-neutral-700 transition-colors"
                aria-label="Twitter"
              >
                X
              </a>
              <a
                href={settings.socialLinks.telegram}
                target="_blank"
                rel="noreferrer"
                className="w-8 h-8 rounded-lg bg-[#151518] border border-neutral-800 flex items-center justify-center text-neutral-400 hover:text-white hover:border-neutral-700 transition-colors"
                aria-label="Telegram"
              >
                TG
              </a>
              <a
                href={settings.socialLinks.discord}
                target="_blank"
                rel="noreferrer"
                className="w-8 h-8 rounded-lg bg-[#151518] border border-neutral-800 flex items-center justify-center text-neutral-400 hover:text-white hover:border-neutral-700 transition-colors"
                aria-label="Discord"
              >
                DC
              </a>
              <a
                href={settings.socialLinks.linkedin}
                target="_blank"
                rel="noreferrer"
                className="w-8 h-8 rounded-lg bg-[#151518] border border-neutral-800 flex items-center justify-center text-neutral-400 hover:text-white hover:border-neutral-700 transition-colors"
                aria-label="LinkedIn"
              >
                IN
              </a>
            </div>
          </div>

          {/* Col 2: Products & Markets */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold uppercase tracking-wider text-white">Products</h4>
            <ul className="space-y-2">
              <li>
                <Link to="/trading#forex" className="hover:text-white transition-colors">
                  Forex Trading
                </Link>
              </li>
              <li>
                <Link to="/trading#gold" className="hover:text-white transition-colors">
                  Precious Metals
                </Link>
              </li>
              <li>
                <Link to="/trading#indices" className="hover:text-white transition-colors">
                  Global Indices
                </Link>
              </li>
              <li>
                <Link to="/trading#commodities" className="hover:text-white transition-colors">
                  Energies & Oil
                </Link>
              </li>
              <li>
                <Link to="/trading#crypto" className="hover:text-white transition-colors">
                  Cryptocurrencies
                </Link>
              </li>
              <li>
                <Link to="/markets" className="hover:text-white transition-colors">
                  Market Explorer
                </Link>
              </li>
            </ul>
          </div>

          {/* Col 3: Accounts & Tools */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold uppercase tracking-wider text-white">Trading</h4>
            <ul className="space-y-2">
              <li>
                <Link to="/accounts" className="hover:text-white transition-colors">
                  Account Tiers
                </Link>
              </li>
              <li>
                <Link to="/platforms" className="hover:text-white transition-colors">
                  Trading Platforms
                </Link>
              </li>
              <li>
                <Link to="/tools" className="hover:text-white transition-colors">
                  Profit Calculator
                </Link>
              </li>
              <li>
                <Link to="/tools" className="hover:text-white transition-colors">
                  Pip & Margin Tools
                </Link>
              </li>
              <li>
                <Link to="/tools" className="hover:text-white transition-colors">
                  Economic Calendar
                </Link>
              </li>
              <li>
                <Link to="/education" className="hover:text-white transition-colors">
                  Education Academy
                </Link>
              </li>
            </ul>
          </div>

          {/* Col 4: Company & Legal */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold uppercase tracking-wider text-white">Company</h4>
            <ul className="space-y-2">
              <li>
                <Link to="/about" className="hover:text-white transition-colors">
                  About Nexora
                </Link>
              </li>
              <li>
                <Link to="/contact" className="hover:text-white transition-colors">
                  Contact & Support
                </Link>
              </li>
              <li>
                <Link to="/faq" className="hover:text-white transition-colors">
                  Help Center & FAQ
                </Link>
              </li>
              <li>
                <Link to="/privacy" className="hover:text-white transition-colors">
                  Privacy Policy
                </Link>
              </li>
              <li>
                <Link to="/terms" className="hover:text-white transition-colors">
                  Terms of Service
                </Link>
              </li>
              <li>
                <Link to="/risk-disclosure" className="hover:text-white transition-colors">
                  Risk Disclosure
                </Link>
              </li>
              <li>
                <Link to="/aml" className="hover:text-white transition-colors">
                  AML Compliance
                </Link>
              </li>
              <li>
                <Link to="/cookies" className="hover:text-white transition-colors">
                  Cookie Policy
                </Link>
              </li>
            </ul>
          </div>
        </div>

        {/* Demo Notice & Risk Warning Box */}
        <div className="mt-12 p-4 rounded-xl bg-[#0D0D0F] border border-neutral-800 space-y-2 text-neutral-400 text-xs leading-relaxed">
          <div className="flex items-center gap-2 text-red-400 font-bold">
            <ShieldAlert className="w-4 h-4 shrink-0" />
            <span>High Risk Investment & Demo Operation Warning</span>
          </div>
          <p>
            {settings.riskWarning}
          </p>
          <p className="text-neutral-400 text-[11px]">
            <strong>Notice:</strong> This web application operates as a demonstration testing platform. All financial quotes, deposits, balances, orders, execution logs, and transactions shown within this application are purely simulated for educational and evaluation purposes.
          </p>
        </div>

        {/* Bottom copyright row */}
        <div className="mt-8 pt-6 border-t border-neutral-900 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-neutral-400">
          <p>© {new Date().getFullYear()} NEXORA TRADE. All rights reserved.</p>
          <div className="flex items-center gap-6">
            <Link to="/privacy" className="hover:text-white">
              Privacy
            </Link>
            <Link to="/terms" className="hover:text-white">
              Terms
            </Link>
            <Link to="/risk-disclosure" className="hover:text-white">
              Risk Disclosure
            </Link>
            <Link to="/aml" className="hover:text-white">
              AML
            </Link>
            <Link to="/cookies" className="hover:text-white">
              Cookies
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
};
