import React from 'react';
import { Link } from 'react-router-dom';
import { ShieldAlert } from 'lucide-react';
import { useSiteSettings } from '../hooks/useStorage';

export const Footer: React.FC = () => {
  const { settings } = useSiteSettings();

  return (
    <footer className="bg-[#0f1115] border-t border-neutral-800 text-neutral-400 text-xs font-sans">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 lg:py-12">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
          {/* Col 1: Brand */}
          <div className="col-span-2 space-y-3">
            <Link
              to="/"
              className="text-lg font-black tracking-tight text-white flex items-center gap-2"
            >
              <span className="w-6 h-6 rounded bg-red-600 flex items-center justify-center text-white font-black text-xs">
                N
              </span>
              <span>
                NEXORA<span className="text-red-500 font-black text-xs ml-1">TRADE</span>
              </span>
            </Link>
            <p className="text-neutral-400 text-xs max-w-sm leading-relaxed">
              Infrastruktur broker trading valuta asing, komoditas emas, indeks, dan kripto dengan eksekusi pasar STP berkecepatan tinggi.
            </p>
            <div className="pt-1 flex items-center gap-2 text-neutral-400 text-xs">
              <span>Lisensi & Regulasi Finansial Internasional</span>
            </div>
          </div>

          {/* Col 2: Pasar & Produk */}
          <div className="space-y-2.5">
            <h4 className="text-xs font-bold uppercase tracking-wider text-white">Pasar & Trading</h4>
            <ul className="space-y-1.5">
              <li>
                <Link to="/markets" className="hover:text-white transition-colors">
                  Mata Uang Forex
                </Link>
              </li>
              <li>
                <Link to="/markets" className="hover:text-white transition-colors">
                  Logam Mulia (Gold)
                </Link>
              </li>
              <li>
                <Link to="/markets" className="hover:text-white transition-colors">
                  Indeks Saham Global
                </Link>
              </li>
              <li>
                <Link to="/markets" className="hover:text-white transition-colors">
                  Mata Uang Kripto
                </Link>
              </li>
            </ul>
          </div>

          {/* Col 3: Platform & Bantuan */}
          <div className="space-y-2.5">
            <h4 className="text-xs font-bold uppercase tracking-wider text-white">Platform & Bantuan</h4>
            <ul className="space-y-1.5">
              <li>
                <Link to="/platforms" className="hover:text-white transition-colors">
                  Nexora WebTrader
                </Link>
              </li>
              <li>
                <Link to="/accounts" className="hover:text-white transition-colors">
                  Pilihan Tipe Akun
                </Link>
              </li>
              <li>
                <Link to="/education" className="hover:text-white transition-colors">
                  Pusat Edukasi
                </Link>
              </li>
              <li>
                <Link to="/about" className="hover:text-white transition-colors">
                  Tentang Kami
                </Link>
              </li>
            </ul>
          </div>
        </div>

        {/* Risk Warning Box */}
        <div className="mt-8 p-4 rounded-xl bg-[#16181f] border border-neutral-800 space-y-1.5 text-neutral-400 text-[11px] leading-relaxed">
          <div className="flex items-center gap-2 text-red-400 font-bold">
            <ShieldAlert className="w-4 h-4 shrink-0" />
            <span>Peringatan Risiko Finansial</span>
          </div>
          <p>
            Trading produk derivatif dengan leverage (seperti Forex dan CFD) memiliki tingkat risiko tinggi dan mungkin tidak cocok untuk semua investor. Pastikan Anda memahami sepenuhnya risiko yang terlibat sebelum melakukan transaksi.
          </p>
        </div>

        {/* Bottom copyright row */}
        <div className="mt-6 pt-4 border-t border-neutral-800 flex flex-col sm:flex-row items-center justify-between gap-3 text-[11px] text-neutral-400">
          <p>© {new Date().getFullYear()} Nexora Trade Ltd. Hak Cipta Dilindungi Undang-Undang.</p>
          <div className="flex items-center gap-4">
            <Link to="/privacy" className="hover:text-white">
              Kebijakan Privasi
            </Link>
            <Link to="/terms" className="hover:text-white">
              Syarat & Ketentuan
            </Link>
            <Link to="/risk-disclosure" className="hover:text-white">
              Pernyataan Risiko
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
};
