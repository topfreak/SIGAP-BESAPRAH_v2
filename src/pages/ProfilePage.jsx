import React, { useState } from 'react';
import { 
  UserCircle, 
  ShieldCheck, 
  KeyRound, 
  Lock, 
  Eye, 
  EyeOff, 
  CheckCircle2, 
  AlertCircle, 
  Mail, 
  Award, 
  Briefcase, 
  Users, 
  Fingerprint,
  Calendar,
  Sparkles,
  Crown
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';

export default function ProfilePage() {
  const { currentUser, changePassword } = useAuth();

  const [oldPassword, setOldPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  const [showOld, setShowOld] = useState(false);
  const [showNew, setShowNew] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);

  const [alert, setAlert] = useState(null); // { type: 'success' | 'error', message: '' }
  const [isLoading, setIsLoading] = useState(false);

  if (!currentUser) {
    return (
      <div className="p-8 text-center text-slate-600">
        <p>Anda belum masuk ke sistem. Silakan login terlebih dahulu.</p>
      </div>
    );
  }

  const isSuperadmin = currentUser.role === 'superadmin';

  const handlePasswordSubmit = (e) => {
    e.preventDefault();
    setAlert(null);

    if (!oldPassword) {
      setAlert({ type: 'error', message: 'Harap masukkan kata sandi Anda saat ini.' });
      return;
    }

    if (newPassword.length < 6) {
      setAlert({ type: 'error', message: 'Kata sandi baru minimal harus 6 karakter.' });
      return;
    }

    if (newPassword !== confirmPassword) {
      setAlert({ type: 'error', message: 'Konfirmasi kata sandi baru tidak cocok.' });
      return;
    }

    if (oldPassword === newPassword) {
      setAlert({ type: 'error', message: 'Kata sandi baru tidak boleh sama dengan kata sandi lama.' });
      return;
    }

    setIsLoading(true);
    setTimeout(() => {
      const res = changePassword(oldPassword, newPassword);
      setIsLoading(false);
      if (res.success) {
        setAlert({ type: 'success', message: 'Kata sandi Anda berhasil diperbarui!' });
        setOldPassword('');
        setNewPassword('');
        setConfirmPassword('');
      } else {
        setAlert({ type: 'error', message: res.message || 'Gagal mengubah kata sandi.' });
      }
    }, 300);
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-extrabold text-slate-900 tracking-tight flex items-center gap-2.5">
            <UserCircle className="w-7 h-7 text-purple-700" />
            <span>Profil Pengguna & Keamanan Akun</span>
          </h1>
          <p className="text-xs text-slate-500 mt-0.5">
            Kelola identitas aparatur BPS Kabupaten Sambas dan pengaturan kata sandi akses sistem
          </p>
        </div>
      </div>

      {/* Profile Overview Card */}
      <div className="bg-gradient-to-r from-[#2A0845] via-[#3B1470] to-[#642B73] rounded-3xl p-6 sm:p-8 text-white shadow-xl relative overflow-hidden">
        <div className="absolute top-0 right-0 w-80 h-80 bg-purple-500/20 rounded-full blur-3xl pointer-events-none -mr-20 -mt-20"></div>

        <div className="flex flex-col sm:flex-row items-center sm:items-start gap-6 relative z-10">
          {/* Avatar */}
          <div className="relative">
            <div className="w-24 h-24 rounded-3xl bg-white/10 backdrop-blur-md border-2 border-purple-300/40 flex items-center justify-center text-4xl font-extrabold text-amber-300 shadow-2xl">
              {currentUser.nama.charAt(0)}
            </div>
            {isSuperadmin && (
              <div className="absolute -bottom-2 -right-2 w-8 h-8 rounded-xl bg-amber-400 text-purple-950 flex items-center justify-center shadow-md">
                <Crown className="w-4 h-4 fill-purple-950" />
              </div>
            )}
          </div>

          {/* Details */}
          <div className="flex-1 text-center sm:text-left space-y-2">
            <div className="flex flex-wrap items-center justify-center sm:justify-start gap-2">
              <h2 className="text-xl sm:text-2xl font-bold tracking-tight">
                {currentUser.nama}
              </h2>
              <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-extrabold uppercase tracking-wider ${
                isSuperadmin 
                  ? 'bg-amber-400 text-purple-950 border border-amber-300' 
                  : 'bg-purple-900/80 text-purple-200 border border-purple-400/30'
              }`}>
                {currentUser.role}
              </span>
            </div>

            {isSuperadmin ? (
              <p className="text-xs text-purple-200 font-medium">
                Administrator Pengelola Sistem BPS Kabupaten Sambas
              </p>
            ) : (
              <p className="text-xs text-purple-200 font-medium">
                {currentUser.jabatan} • {currentUser.pangkat_golongan}
              </p>
            )}

            <div className="pt-2 flex flex-wrap items-center justify-center sm:justify-start gap-4 text-xs text-purple-200/90">
              {currentUser.role === 'superadmin' ? (
                <div className="flex items-center gap-1.5 bg-black/20 px-3 py-1 rounded-xl">
                  <ShieldCheck className="w-3.5 h-3.5 text-amber-300" />
                  <span className="font-semibold text-amber-300">ADMINISTRATOR SISTEM (AKSES PENUH)</span>
                </div>
              ) : (
                <>
                  <div className="flex items-center gap-1.5 bg-black/20 px-3 py-1 rounded-xl">
                    <Fingerprint className="w-3.5 h-3.5 text-amber-300" />
                    <span className="font-mono">NIP: {currentUser.nip_baru}</span>
                  </div>
                  <div className="flex items-center gap-1.5 bg-black/20 px-3 py-1 rounded-xl">
                    <Users className="w-3.5 h-3.5 text-purple-300" />
                    <span>Tim: {currentUser.tim_kerja || '-'}</span>
                  </div>
                  {currentUser.email && currentUser.email !== '-' && (
                    <div className="flex items-center gap-1.5 bg-black/20 px-3 py-1 rounded-xl">
                      <Mail className="w-3.5 h-3.5 text-emerald-300" />
                      <span>{currentUser.email}</span>
                    </div>
                  )}
                </>
              )}
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
        {/* Left Column: Account Details */}
        <div className="md:col-span-6 space-y-6">
          <div className="bg-white rounded-3xl p-6 border border-purple-100 shadow-sm space-y-4">
            <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2 pb-2 border-b border-purple-50">
              <ShieldCheck className="w-4 h-4 text-purple-700" />
              <span>Rincian Akun & Kredensial</span>
            </h3>

            <div className="space-y-3 text-xs">
              <div className="flex items-center justify-between p-3 rounded-2xl bg-purple-50/50">
                <span className="text-slate-500 font-medium">Username Login</span>
                <span className="font-mono font-bold text-purple-950 bg-purple-100/80 px-2.5 py-0.5 rounded-lg border border-purple-200">
                  {currentUser.username || '-'}
                </span>
              </div>

              {isSuperadmin ? (
                <>
                  <div className="flex items-center justify-between p-3 rounded-2xl bg-slate-50">
                    <span className="text-slate-500 font-medium">Peran & Hak Akses</span>
                    <span className="font-bold text-purple-700 bg-purple-50 px-2.5 py-0.5 rounded-md border border-purple-200">
                      SUPERADMIN (Akses Penuh)
                    </span>
                  </div>
                  <div className="flex items-center justify-between p-3 rounded-2xl bg-slate-50">
                    <span className="text-slate-500 font-medium">Status Akun</span>
                    <span className="font-semibold text-emerald-700 bg-emerald-50 px-2.5 py-0.5 rounded-md border border-emerald-200">
                      Administrator Pengelola Sistem
                    </span>
                  </div>
                </>
              ) : (
                <>
                  <div className="flex items-center justify-between p-3 rounded-2xl bg-slate-50">
                    <span className="text-slate-500 font-medium">NIP Baru (18 Digit)</span>
                    <span className="font-mono font-semibold text-slate-800">
                      {currentUser.nip_baru || '-'}
                    </span>
                  </div>

                  <div className="flex items-center justify-between p-3 rounded-2xl bg-slate-50">
                    <span className="text-slate-500 font-medium">NIP Lama</span>
                    <span className="font-mono font-semibold text-slate-800">
                      {currentUser.nip_lama || '-'}
                    </span>
                  </div>

                  <div className="flex items-center justify-between p-3 rounded-2xl bg-slate-50">
                    <span className="text-slate-500 font-medium">Status Kepegawaian</span>
                    <span className="font-semibold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-md border border-emerald-200">
                      {currentUser.status_pegawai || 'PNS'}
                    </span>
                  </div>
                </>
              )}

              <div className="flex items-center justify-between p-3 rounded-2xl bg-slate-50">
                <span className="text-slate-500 font-medium">Satuan Kerja</span>
                <span className="font-semibold text-slate-800">BPS Kabupaten Sambas (6101)</span>
              </div>
            </div>

            <div className="p-3.5 rounded-2xl bg-amber-50 border border-amber-200/80 text-[11px] text-amber-900 flex items-start gap-2.5">
              <Sparkles className="w-4 h-4 text-amber-600 flex-shrink-0 mt-0.5" />
              <div>
                <p className="font-bold">Keamanan Akun SIGAP BESAPRAH</p>
                <p className="text-amber-800 mt-0.5">
                  Gunakan username Anda saat melakukan login. Jangan bagikan kata sandi Anda kepada orang lain untuk menjaga akuntabilitas penandatanganan dan pengujian berkas SPJ.
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Right Column: Change Password Form */}
        <div className="md:col-span-6 space-y-6">
          <div className="bg-white rounded-3xl p-6 border border-purple-100 shadow-sm space-y-4">
            <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2 pb-2 border-b border-purple-50">
              <KeyRound className="w-4 h-4 text-purple-700" />
              <span>Ganti Kata Sandi (Password)</span>
            </h3>

            {alert && (
              <div className={`p-3.5 rounded-2xl text-xs flex items-start gap-2.5 ${
                alert.type === 'success' 
                  ? 'bg-emerald-50 border border-emerald-200 text-emerald-800' 
                  : 'bg-rose-50 border border-rose-200 text-rose-800'
              }`}>
                {alert.type === 'success' ? (
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 flex-shrink-0 mt-0.5" />
                ) : (
                  <AlertCircle className="w-4 h-4 text-rose-600 flex-shrink-0 mt-0.5" />
                )}
                <span>{alert.message}</span>
              </div>
            )}

            <form onSubmit={handlePasswordSubmit} className="space-y-4 text-xs">
              {/* Old Password */}
              <div>
                <label className="block font-bold text-slate-700 mb-1.5">
                  Kata Sandi Lama <span className="text-rose-500">*</span>
                </label>
                <div className="relative">
                  <Lock className="w-4 h-4 text-purple-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                  <input
                    type={showOld ? 'text' : 'password'}
                    value={oldPassword}
                    onChange={(e) => setOldPassword(e.target.value)}
                    placeholder="Masukkan kata sandi saat ini"
                    required
                    className="w-full pl-10 pr-10 py-2.5 bg-purple-50/40 border border-purple-200 rounded-xl text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-purple-500"
                  />
                  <button
                    type="button"
                    onClick={() => setShowOld(!showOld)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-purple-400 hover:text-purple-600"
                  >
                    {showOld ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              {/* New Password */}
              <div>
                <label className="block font-bold text-slate-700 mb-1.5">
                  Kata Sandi Baru <span className="text-rose-500">*</span>
                </label>
                <div className="relative">
                  <KeyRound className="w-4 h-4 text-purple-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                  <input
                    type={showNew ? 'text' : 'password'}
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    placeholder="Minimal 6 karakter"
                    required
                    minLength={6}
                    className="w-full pl-10 pr-10 py-2.5 bg-purple-50/40 border border-purple-200 rounded-xl text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-purple-500"
                  />
                  <button
                    type="button"
                    onClick={() => setShowNew(!showNew)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-purple-400 hover:text-purple-600"
                  >
                    {showNew ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
                <p className="text-[10px] text-slate-400 mt-1">Gunakan kombinasi huruf dan angka.</p>
              </div>

              {/* Confirm New Password */}
              <div>
                <label className="block font-bold text-slate-700 mb-1.5">
                  Konfirmasi Kata Sandi Baru <span className="text-rose-500">*</span>
                </label>
                <div className="relative">
                  <KeyRound className="w-4 h-4 text-purple-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                  <input
                    type={showConfirm ? 'text' : 'password'}
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    placeholder="Ketik ulang kata sandi baru"
                    required
                    minLength={6}
                    className="w-full pl-10 pr-10 py-2.5 bg-purple-50/40 border border-purple-200 rounded-xl text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-purple-500"
                  />
                  <button
                    type="button"
                    onClick={() => setShowConfirm(!showConfirm)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-purple-400 hover:text-purple-600"
                  >
                    {showConfirm ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              <button
                type="submit"
                disabled={isLoading}
                className="w-full mt-2 py-2.5 px-4 rounded-xl font-bold text-xs text-white bg-gradient-to-r from-purple-700 to-indigo-600 hover:from-purple-800 hover:to-indigo-700 shadow-md shadow-purple-600/20 transition active:scale-98 flex items-center justify-center gap-2 disabled:opacity-50"
              >
                {isLoading ? (
                  <span>Menyimpan Perubahan...</span>
                ) : (
                  <>
                    <KeyRound className="w-4 h-4" />
                    <span>Perbarui Kata Sandi</span>
                  </>
                )}
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}
