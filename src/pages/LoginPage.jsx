import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { ShieldCheck, LogIn, KeyRound, Mail, ArrowRight, UserCheck } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

export default function LoginPage() {
  const navigate = useNavigate();
  const { login, pegawaiList } = useAuth();
  const [selectedNip, setSelectedNip] = useState(pegawaiList[3]?.nip_baru || ''); // Default to PPK Adi Rakhmat
  const [emailInput, setEmailInput] = useState('');
  const [passwordInput, setPasswordInput] = useState('password123');
  const [isCustomMode, setIsCustomMode] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (isCustomMode) {
      if (emailInput.trim()) {
        login(emailInput.trim(), passwordInput);
        navigate('/dashboard');
      }
    } else {
      if (selectedNip) {
        login(selectedNip, 'password123');
        navigate('/dashboard');
      }
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#250b52] via-[#350d6f] to-[#45128c] flex items-center justify-center p-6 text-slate-800">
      <div className="max-w-md w-full bg-white rounded-3xl shadow-2xl p-8 border border-purple-100 relative overflow-hidden animate-in fade-in zoom-in-95 duration-200">
        {/* Decorative banner */}
        <div className="absolute top-0 left-0 right-0 h-2.5 bg-gradient-to-r from-amber-400 via-purple-500 to-indigo-600"></div>

        {/* Header */}
        <div className="text-center mb-8 pt-2">
          <div className="w-14 h-14 rounded-2xl bg-gradient-to-tr from-purple-700 to-indigo-600 flex items-center justify-center shadow-lg shadow-purple-600/30 text-white mx-auto mb-3">
            <ShieldCheck className="w-8 h-8" />
          </div>
          <h1 className="text-2xl font-extrabold text-slate-900 tracking-tight">
            SSO BPS KABUPATEN SAMBAS
          </h1>
          <p className="text-xs text-purple-700 font-bold mt-1 uppercase tracking-wider">
            SIGAP BESAPRAH
          </p>
          <p className="text-[11px] text-slate-500 italic mt-0.5">
            “Bersaprah dalam Kerja, Sepakat dalam Akuntabilitas.”
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-5">
          {!isCustomMode ? (
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-2 flex items-center justify-between">
                <span>Pilih Pegawai (25 Aparatur BPS Sambas)</span>
                <span className="text-[10px] text-purple-600 font-semibold">Simulasi Akun</span>
              </label>
              <select
                value={selectedNip}
                onChange={(e) => setSelectedNip(e.target.value)}
                className="w-full px-3.5 py-2.5 bg-purple-50/60 border border-purple-200 rounded-xl text-xs font-medium text-slate-800 focus:outline-none focus:ring-2 focus:ring-purple-500"
              >
                {pegawaiList.map((p) => (
                  <option key={p.nip_baru} value={p.nip_baru}>
                    {p.nama} — {p.jabatan} ({p.role.toUpperCase()})
                  </option>
                ))}
              </select>
              <p className="text-[10px] text-slate-500 mt-1.5">
                Anda dapat memilih peran PPK, PPSPM, Bendahara, atau PJ Kegiatan untuk menguji seluruh alur kerja.
              </p>
            </div>
          ) : (
            <>
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1.5">
                  Email atau NIP BPS
                </label>
                <div className="relative">
                  <Mail className="w-4 h-4 text-purple-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                  <input
                    type="text"
                    value={emailInput}
                    onChange={(e) => setEmailInput(e.target.value)}
                    placeholder="nama@bps.go.id atau NIP"
                    required
                    className="w-full pl-10 pr-4 py-2.5 bg-purple-50/60 border border-purple-200 rounded-xl text-xs font-medium text-slate-800 focus:outline-none focus:ring-2 focus:ring-purple-500"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1.5">
                  Kata Sandi
                </label>
                <div className="relative">
                  <KeyRound className="w-4 h-4 text-purple-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                  <input
                    type="password"
                    value={passwordInput}
                    onChange={(e) => setPasswordInput(e.target.value)}
                    required
                    className="w-full pl-10 pr-4 py-2.5 bg-purple-50/60 border border-purple-200 rounded-xl text-xs font-medium text-slate-800 focus:outline-none focus:ring-2 focus:ring-purple-500"
                  />
                </div>
              </div>
            </>
          )}

          <div className="flex items-center justify-between text-[11px]">
            <button
              type="button"
              onClick={() => setIsCustomMode(!isCustomMode)}
              className="text-purple-700 hover:text-purple-900 font-semibold underline"
            >
              {isCustomMode ? "Gunakan Pilihan Pegawai" : "Login dengan Email / Password Manual"}
            </button>
            <span className="text-slate-400">v2.0</span>
          </div>

          <button
            type="submit"
            className="w-full py-3 px-4 rounded-xl font-bold text-xs text-white bg-gradient-to-r from-purple-700 to-indigo-600 hover:from-purple-800 hover:to-indigo-700 shadow-lg shadow-purple-600/30 transition transform active:scale-98 flex items-center justify-center gap-2"
          >
            <LogIn className="w-4 h-4" />
            <span>Masuk ke SIGAP BESAPRAH</span>
          </button>
        </form>

        <div className="mt-6 pt-5 border-t border-purple-50 text-center">
          <Link to="/" className="text-xs text-purple-700 hover:text-purple-900 font-semibold inline-flex items-center gap-1">
            <span>← Kembali ke Halaman Depan</span>
          </Link>
        </div>
      </div>
    </div>
  );
}
