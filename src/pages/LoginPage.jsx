import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation, Link } from 'react-router-dom';
import { 
  ShieldCheck, 
  LogIn, 
  Lock, 
  User, 
  Eye, 
  EyeOff, 
  AlertCircle, 
  Info,
  ArrowRight
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';

export default function LoginPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const { login, currentUser } = useAuth();
  
  // Real login: field starts completely empty
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Jika sudah login, langsung alihkan ke dashboard atau halaman tujuan
  useEffect(() => {
    if (currentUser) {
      const redirectPath = location.state?.from?.pathname || '/dashboard';
      navigate(redirectPath, { replace: true });
    }
  }, [currentUser, navigate, location]);

  const handleSubmit = (e) => {
    e.preventDefault();
    setErrorMsg('');

    if (!username.trim() || !password) {
      setErrorMsg('Harap masukkan username dan kata sandi Anda.');
      return;
    }

    setIsSubmitting(true);
    
    // Autentikasi real
    setTimeout(() => {
      const res = login(username.trim(), password);
      setIsSubmitting(false);

      if (res.success) {
        const redirectPath = location.state?.from?.pathname || '/dashboard';
        navigate(redirectPath, { replace: true });
      } else {
        setErrorMsg(res.message || 'Login gagal. Periksa kembali username dan kata sandi Anda.');
      }
    }, 250);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#250b52] via-[#350d6f] to-[#45128c] flex items-center justify-center p-4 sm:p-6 text-slate-800 font-sans">
      <div className="max-w-md w-full bg-white rounded-3xl shadow-2xl p-6 sm:p-8 border border-purple-100 relative overflow-hidden animate-in fade-in zoom-in-95 duration-200">
        {/* Decorative Top Accent Bar */}
        <div className="absolute top-0 left-0 right-0 h-2 bg-gradient-to-r from-amber-400 via-purple-500 to-indigo-600"></div>

        {/* Header Branding */}
        <div className="text-center mb-6 pt-2">
          <div className="w-14 h-14 rounded-2xl bg-gradient-to-tr from-purple-700 to-indigo-600 flex items-center justify-center shadow-lg shadow-purple-600/30 text-white mx-auto mb-3">
            <ShieldCheck className="w-8 h-8" />
          </div>
          <h1 className="text-2xl font-black text-slate-900 tracking-tight">
            SIGAP BESAPRAH
          </h1>
          <p className="text-xs text-purple-700 font-bold mt-0.5 uppercase tracking-wider">
            BPS KABUPATEN SAMBAS
          </p>
          <p className="text-[11px] text-slate-500 italic mt-0.5">
            “Bersaprah dalam Kerja, Sepakat dalam Akuntabilitas.”
          </p>
        </div>

        {/* Real Error Message Banner */}
        {errorMsg && (
          <div className="mb-4 p-3 rounded-2xl bg-rose-50 border border-rose-200 text-rose-700 text-xs flex items-center gap-2.5 animate-in shake duration-200">
            <AlertCircle className="w-4 h-4 flex-shrink-0 text-rose-600" />
            <span className="font-medium">{errorMsg}</span>
          </div>
        )}

        {/* Real Login Form */}
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
                placeholder="Masukkan username Anda"
                required
                autoFocus
                autoComplete="username"
                className="w-full pl-10 pr-4 py-2.5 bg-purple-50/50 border border-purple-200 rounded-xl text-xs font-medium text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:bg-white transition"
              />
            </div>
          </div>

          {/* Password Input */}
          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1.5">
              Kata Sandi <span className="text-rose-500">*</span>
            </label>
            <div className="relative">
              <Lock className="w-4 h-4 text-purple-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type={showPassword ? 'text' : 'password'}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Masukkan kata sandi"
                required
                autoComplete="current-password"
                className="w-full pl-10 pr-10 py-2.5 bg-purple-50/50 border border-purple-200 rounded-xl text-xs font-medium text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:bg-white transition"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-purple-400 hover:text-purple-600 focus:outline-none"
              >
                {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full mt-2 py-3 px-4 rounded-xl font-bold text-xs text-white bg-gradient-to-r from-purple-700 to-indigo-600 hover:from-purple-800 hover:to-indigo-700 shadow-lg shadow-purple-600/30 transition transform active:scale-98 flex items-center justify-center gap-2 disabled:opacity-60"
          >
            {isSubmitting ? (
              <span>Memverifikasi Kredensial...</span>
            ) : (
              <>
                <LogIn className="w-4 h-4" />
                <span>Masuk ke Sistem</span>
              </>
            )}
          </button>
        </form>

        {/* Informational Guidance (No one-click bypass) */}
        <div className="mt-5 p-3 rounded-2xl bg-purple-50/60 border border-purple-100 text-[11px] text-slate-600 space-y-1">
          <div className="flex items-center gap-1.5 font-bold text-purple-900">
            <Info className="w-3.5 h-3.5 text-purple-600 flex-shrink-0" />
            <span>Petunjuk Akses Sistem:</span>
          </div>
          <p className="text-slate-600 leading-relaxed pl-5">
            Gunakan <strong>username</strong> dan <strong>kata sandi</strong> resmi Anda.
          </p>
          <p className="text-slate-500 leading-relaxed pl-5 text-[10px]">
            • Akun Superadmin: <code className="bg-purple-100 px-1 py-0.5 rounded text-purple-900 font-mono">superadmin</code> (pass: <code className="bg-purple-100 px-1 py-0.5 rounded text-purple-900 font-mono">admin123</code>)<br />
            • Akun Pegawai BPS Sambas: username masing-masing (pass awal: <code className="bg-purple-100 px-1 py-0.5 rounded text-purple-900 font-mono">bps6101</code>)
          </p>
        </div>

        {/* Back Link */}
        <div className="mt-5 pt-4 border-t border-purple-50 text-center">
          <Link to="/" className="text-xs text-purple-700 hover:text-purple-900 font-semibold inline-flex items-center gap-1">
            <span>← Kembali ke Portal Depan</span>
          </Link>
        </div>
      </div>
    </div>
  );
}
