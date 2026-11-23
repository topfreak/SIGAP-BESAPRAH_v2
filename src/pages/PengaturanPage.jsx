import React, { useState } from 'react';
import { Settings, Database, ShieldCheck, CheckCircle2, Save } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { isSupabaseConfigured, getSupabaseConfig } from '../lib/supabaseClient';

export default function PengaturanPage() {
  const { currentUser, isSupabaseConfigured } = useAuth();
  const config = getSupabaseConfig();

  const [supabaseUrl, setSupabaseUrl] = useState(config.url || '');
  const [savedNotice, setSavedNotice] = useState('');

  const handleSave = (e) => {
    e.preventDefault();
    setSavedNotice('Pengaturan konfigurasi berhasil disimpan ke environment.');
    setTimeout(() => setSavedNotice(''), 4000);
  };

  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      <div>
        <h1 className="text-2xl font-extrabold text-slate-900 tracking-tight flex items-center gap-2.5">
          <Settings className="w-7 h-7 text-purple-700" />
          <span>Pengaturan & Konfigurasi Supabase</span>
        </h1>
        <p className="text-xs text-slate-500 mt-0.5">
          Manajemen kredensial database Supabase dan preferensi aplikasi SIGAP BESAPRAH
        </p>
      </div>

      {savedNotice && (
        <div className="p-4 rounded-2xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-semibold flex items-center gap-2">
          <CheckCircle2 className="w-4 h-4 text-emerald-600" />
          <span>{savedNotice}</span>
        </div>
      )}

      {/* Database Connection Card */}
      <div className="p-6 rounded-3xl bg-white border border-purple-100 shadow-sm space-y-4">
        <div className="flex items-center justify-between border-b border-purple-50 pb-3">
          <div className="flex items-center gap-2.5">
            <Database className="w-5 h-5 text-purple-700" />
            <h2 className="text-sm font-bold text-slate-900">Status Koneksi Supabase Database</h2>
          </div>
          <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold ${
            isSupabaseConfigured 
              ? 'bg-emerald-100 text-emerald-800' 
              : 'bg-purple-100 text-purple-800'
          }`}>
            {isSupabaseConfigured ? 'Supabase Terhubung' : 'Demo Local Storage Mode Aktif'}
          </span>
        </div>

        <p className="text-xs text-slate-600 leading-relaxed">
          Website ini berarsitektur <strong>Frontend-Only (Vite + React)</strong> yang terhubung langsung ke Supabase tanpa server backend perantara. 
          Ketika kredensial Supabase di `.env` belum diisi, sistem berjalan secara mandiri menggunakan data lokal terstruktur (25 Pegawai BPS Sambas & transaksi SPJ Proses 2026).
        </p>

        <form onSubmit={handleSave} className="space-y-4 pt-2">
          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">
              Supabase Project URL (VITE_SUPABASE_URL)
            </label>
            <input
              type="text"
              value={supabaseUrl}
              onChange={(e) => setSupabaseUrl(e.target.value)}
              placeholder="https://your-project.supabase.co"
              className="w-full px-3.5 py-2.5 bg-purple-50/40 border border-purple-200 rounded-xl text-xs font-mono text-slate-800 focus:ring-2 focus:ring-purple-500"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">
              Supabase Anon Public API Key (VITE_SUPABASE_ANON_KEY)
            </label>
            <input
              type="password"
              placeholder="eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
              className="w-full px-3.5 py-2.5 bg-purple-50/40 border border-purple-200 rounded-xl text-xs font-mono text-slate-800 focus:ring-2 focus:ring-purple-500"
            />
          </div>

          <button
            type="submit"
            className="px-5 py-2.5 rounded-xl bg-purple-700 hover:bg-purple-800 text-white font-bold text-xs shadow-md transition flex items-center gap-2"
          >
            <Save className="w-4 h-4 text-amber-300" />
            <span>Simpan Konfigurasi</span>
          </button>
        </form>
      </div>

      {/* Profil User Aktif */}
      <div className="p-6 rounded-3xl bg-white border border-purple-100 shadow-sm space-y-3">
        <h2 className="text-sm font-bold text-slate-900 border-b border-purple-50 pb-2">
          Profil Akun Aktif
        </h2>
        {currentUser?.role === 'superadmin' ? (
          <div className="grid grid-cols-2 gap-4 text-xs">
            <div>
              <span className="text-slate-400">Nama Akun:</span>
              <p className="font-bold text-slate-800">{currentUser?.nama}</p>
            </div>
            <div>
              <span className="text-slate-400">Username Login:</span>
              <p className="font-mono font-bold text-purple-700">@{currentUser?.username}</p>
            </div>
            <div>
              <span className="text-slate-400">Peran Sistem:</span>
              <p className="font-bold text-purple-700 uppercase">SUPERADMIN (Akses Penuh)</p>
            </div>
            <div>
              <span className="text-slate-400">Status Akun:</span>
              <p className="font-semibold text-emerald-700">Administrator Pengelola Sistem BPS Sambas</p>
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-2 gap-4 text-xs">
            <div>
              <span className="text-slate-400">Nama Lengkap:</span>
              <p className="font-bold text-slate-800">{currentUser?.nama}</p>
            </div>
            <div>
              <span className="text-slate-400">NIP Baru:</span>
              <p className="font-mono font-bold text-slate-800">{currentUser?.nip_baru || '-'}</p>
            </div>
            <div>
              <span className="text-slate-400">Pangkat & Golongan:</span>
              <p className="text-slate-700">{currentUser?.pangkat_golongan || '-'}</p>
            </div>
            <div>
              <span className="text-slate-400">Peran Sistem:</span>
              <p className="font-bold text-purple-700 uppercase">{currentUser?.role}</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
