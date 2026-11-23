import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { 
  ShieldCheck, 
  LogIn, 
  Lock, 
  User, 
  Eye, 
  EyeOff, 
  AlertCircle, 
  CheckCircle2, 
  KeyRound, 
  ChevronDown, 
  ChevronUp, 
  Crown,
  Sparkles
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';

export default function LoginPage() {
  const navigate = useNavigate();
  const { login, pegawaiList } = useAuth();
  
  const [username, setUsername] = useState('superadmin');
  const [password, setPassword] = useState('admin123');
  const [showPassword, setShowPassword] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const [showDemoAccounts, setShowDemoAccounts] = useState(true);

  const handleSubmit = (e) => {
    e.preventDefault();
    setErrorMsg('');

    if (!username.trim() || !password) {
      setErrorMsg('Harap masukkan username dan kata sandi.');
      return;
    }

    const res = login(username.trim(), password);
    if (res.success) {
      navigate('/dashboard');
    } else {
      setErrorMsg(res.message || 'Login gagal. Periksa kembali username dan kata sandi Anda.');
    }
  };

  const handleQuickFill = (demoUser, demoPass) => {
    setUsername(demoUser);
    setPassword(demoPass);
    setErrorMsg('');
  };

  // Sample quick accounts for convenience
  const quickAccounts = [
    { label: 'Superadmin (Akses Penuh)', username: 'superadmin', password: 'admin123', role: 'SUPERADMIN', color: 'bg-amber-100 text-amber-900 border-amber-300' },
    { label: 'Adi Rakhmat (PPK)', username: 'adi.rakhmat', password: 'bps6101', role: 'PPK', color: 'bg-purple-100 text-purple-900 border-purple-300' },
    { label: 'Solikhin (KPA/Kepala Kantor)', username: 'solikhin', password: 'bps6101', role: 'KPA', color: 'bg-indigo-100 text-indigo-900 border-indigo-300' },
    { label: 'Fitria W. (Bendahara Pengeluaran)', username: 'fitria.w', password: 'bps6101', role: 'BENDAHARA', color: 'bg-emerald-100 text-emerald-900 border-emerald-300' },
    { label: 'Samsuri (PJ Kegiatan / Distribusi)', username: 'samsuri', password: 'bps6101', role: 'PJ KEGIATAN', color: 'bg-blue-100 text-blue-900 border-blue-300' },
    { label: 'Erika (Staf Sosial / Pegawai)', username: 'erika', password: 'bps6101', role: 'PEGAWAI', color: 'bg-rose-100 text-rose-900 border-rose-300' }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#250b52] via-[#350d6f] to-[#45128c] flex items-center justify-center p-4 sm:p-6 text-slate-800">
      <div className="max-w-md w-full bg-white rounded-3xl shadow-2xl p-6 sm:p-8 border border-purple-100 relative overflow-hidden animate-in fade-in zoom-in-95 duration-200">
        {/* Decorative banner */}
        <div className="absolute top-0 left-0 right-0 h-2.5 bg-gradient-to-r from-amber-400 via-purple-500 to-indigo-600"></div>

        {/* Header */}
        <div className="text-center mb-6 pt-2">
          <div className="w-14 h-14 rounded-2xl bg-gradient-to-tr from-purple-700 to-indigo-600 flex items-center justify-center shadow-lg shadow-purple-600/30 text-white mx-auto mb-3">
            <ShieldCheck className="w-8 h-8" />
          </div>
          <h1 className="text-2xl font-extrabold text-slate-900 tracking-tight">
            MASUK SIGAP BESAPRAH
          </h1>
          <p className="text-xs text-purple-700 font-bold mt-0.5 uppercase tracking-wider">
            BPS KABUPATEN SAMBAS
          </p>
          <p className="text-[11px] text-slate-500 italic mt-0.5">
            “Bersaprah dalam Kerja, Sepakat dalam Akuntabilitas.”
          </p>
        </div>

        {/* Error Alert */}
        {errorMsg && (
          <div className="mb-4 p-3 rounded-2xl bg-rose-50 border border-rose-200 text-rose-700 text-xs flex items-center gap-2 animate-in shake duration-200">
            <AlertCircle className="w-4 h-4 flex-shrink-0" />
            <span>{errorMsg}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Username Input */}
          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1.5">
              Username Pegawai <span className="text-rose-500">*</span>
            </label>
            <div className="relative">
              <User className="w-4 h-4 text-purple-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                placeholder="Contoh: superadmin atau adi.rakhmat"
                required
                className="w-full pl-10 pr-4 py-2.5 bg-purple-50/60 border border-purple-200 rounded-xl text-xs font-medium text-slate-900 focus:outline-none focus:ring-2 focus:ring-purple-500"
              />
            </div>
          </div>

          {/* Password Input */}
          <div>
            <div className="flex items-center justify-between mb-1.5">
              <label className="text-xs font-bold text-slate-700">
                Kata Sandi <span className="text-rose-500">*</span>
              </label>
            </div>
            <div className="relative">
              <Lock className="w-4 h-4 text-purple-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type={showPassword ? 'text' : 'password'}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Masukkan kata sandi akun"
                required
                className="w-full pl-10 pr-10 py-2.5 bg-purple-50/60 border border-purple-200 rounded-xl text-xs font-medium text-slate-900 focus:outline-none focus:ring-2 focus:ring-purple-500"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-purple-400 hover:text-purple-600"
              >
                {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
          </div>

          <button
            type="submit"
            className="w-full py-3 px-4 rounded-xl font-bold text-xs text-white bg-gradient-to-r from-purple-700 to-indigo-600 hover:from-purple-800 hover:to-indigo-700 shadow-lg shadow-purple-600/30 transition transform active:scale-98 flex items-center justify-center gap-2"
          >
            <LogIn className="w-4 h-4" />
            <span>Masuk ke Sistem</span>
          </button>
        </form>

        {/* Demo / Quick Fill Toggle */}
        <div className="mt-5 pt-4 border-t border-purple-50">
          <button
            type="button"
            onClick={() => setShowDemoAccounts(!showDemoAccounts)}
            className="w-full flex items-center justify-between text-xs text-purple-700 font-semibold hover:text-purple-900 py-1"
          >
            <span className="flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5 text-amber-500" />
              <span>Daftar Akun Pengujian (Klik untuk Isi Otomatis)</span>
            </span>
            {showDemoAccounts ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
          </button>

          {showDemoAccounts && (
            <div className="mt-2.5 space-y-1.5 max-h-48 overflow-y-auto pr-1">
              {quickAccounts.map((acc) => (
                <button
                  key={acc.username}
                  type="button"
                  onClick={() => handleQuickFill(acc.username, acc.password)}
                  className="w-full text-left p-2 rounded-xl bg-purple-50/60 hover:bg-purple-100/80 border border-purple-100 flex items-center justify-between transition text-xs group"
                >
                  <div className="truncate pr-2">
                    <p className="font-bold text-slate-800 group-hover:text-purple-900 truncate">
                      {acc.label}
                    </p>
                    <p className="text-[10px] text-slate-500 font-mono">
                      User: <span className="font-semibold text-purple-700">{acc.username}</span> | Pass: <span className="font-semibold text-purple-700">{acc.password}</span>
                    </p>
                  </div>
                  <span className={`px-2 py-0.5 rounded-md text-[9px] font-extrabold border flex-shrink-0 ${acc.color}`}>
                    PILIH
                  </span>
                </button>
              ))}
            </div>
          )}
        </div>

        <div className="mt-5 pt-4 border-t border-purple-50 text-center">
          <Link to="/" className="text-xs text-purple-700 hover:text-purple-900 font-semibold inline-flex items-center gap-1">
            <span>← Kembali ke Portal Beranda</span>
          </Link>
        </div>
      </div>
    </div>
  );
}
