import React, { createContext, useContext, useState, useEffect } from 'react';
import { PEGAWAI_LIST, INITIAL_TRANSACTIONS, REKON_PETUGAS_LIST } from '../lib/seedData';
import { supabase, isSupabaseConfigured } from '../lib/supabaseClient';

const AuthContext = createContext();

// Matrix izin akses menu per peran (RBAC)
const ROLE_PERMISSIONS = {
  superadmin: ['*'], // Superadmin memiliki akses 100% tanpa batas
  kpa: [
    '/dashboard',
    '/pengajuan-spj',
    '/rekon-spj',
    '/panduan-akun',
    '/kalkulator-pajak',
    '/surat-tugas',
    '/laporan-perjadin',
    '/kalender-perjadin',
    '/matriks-perjadin',
    '/monitoring-mitra',
    '/rekapitulasi',
    '/lacak',
    '/pegawai',
    '/master-wilayah'
  ],
  ppk: [
    '/dashboard',
    '/pengajuan-spj',
    '/pengajuan-spj/baru',
    '/rekon-spj',
    '/panduan-akun',
    '/kalkulator-pajak',
    '/surat-tugas',
    '/laporan-perjadin',
    '/kalender-perjadin',
    '/matriks-perjadin',
    '/rekapitulasi',
    '/lacak',
    '/pegawai'
  ],
  ppspm: [
    '/dashboard',
    '/pengajuan-spj',
    '/rekon-spj',
    '/panduan-akun',
    '/kalkulator-pajak',
    '/rekapitulasi',
    '/lacak',
    '/pegawai'
  ],
  bendahara: [
    '/dashboard',
    '/pengajuan-spj',
    '/rekon-spj',
    '/panduan-akun',
    '/kalkulator-pajak',
    '/monitoring-mitra',
    '/rekapitulasi',
    '/lacak',
    '/pegawai'
  ],
  verifikator: [
    '/dashboard',
    '/pengajuan-spj',
    '/rekon-spj',
    '/panduan-akun',
    '/kalkulator-pajak',
    '/rekapitulasi',
    '/lacak',
    '/pegawai'
  ],
  pj_kegiatan: [
    '/dashboard',
    '/pengajuan-spj',
    '/pengajuan-spj/baru',
    '/rekon-spj',
    '/panduan-akun',
    '/kalkulator-pajak',
    '/surat-tugas',
    '/laporan-perjadin',
    '/kalender-perjadin',
    '/monitoring-mitra',
    '/lacak'
  ],
  pegawai: [
    '/dashboard',
    '/pengajuan-spj',
    '/panduan-akun',
    '/kalkulator-pajak',
    '/surat-tugas',
    '/laporan-perjadin',
    '/kalender-perjadin',
    '/lacak'
  ]
};

export function AuthProvider({ children }) {
  // Default to Superadmin agar user langsung bisa eksplorasi semua fitur
  const [currentUser, setCurrentUser] = useState(() => {
    const saved = localStorage.getItem('sigap_user');
    if (saved) {
      try { return JSON.parse(saved); } catch (e) {}
    }
    return PEGAWAI_LIST.find(p => p.role === 'superadmin') || PEGAWAI_LIST[0];
  });

  const [transactions, setTransactions] = useState(() => {
    const saved = localStorage.getItem('sigap_transactions');
    if (saved) {
      try { return JSON.parse(saved); } catch (e) {}
    }
    return INITIAL_TRANSACTIONS;
  });

  const [rekonList, setRekonList] = useState(() => {
    const saved = localStorage.getItem('sigap_rekon');
    if (saved) {
      try { return JSON.parse(saved); } catch (e) {}
    }
    return REKON_PETUGAS_LIST;
  });

  useEffect(() => {
    localStorage.setItem('sigap_user', JSON.stringify(currentUser));
  }, [currentUser]);

  useEffect(() => {
    localStorage.setItem('sigap_transactions', JSON.stringify(transactions));
  }, [transactions]);

  useEffect(() => {
    localStorage.setItem('sigap_rekon', JSON.stringify(rekonList));
  }, [rekonList]);

  // Check if current user can access a route
  const canAccess = (path) => {
    if (!currentUser) return path === '/' || path === '/login' || path === '/lacak';
    const role = currentUser.role || 'pegawai';
    const allowed = ROLE_PERMISSIONS[role] || ROLE_PERMISSIONS.pegawai;
    if (allowed.includes('*')) return true; // Superadmin
    return allowed.some(p => path === p || (p !== '/dashboard' && path.startsWith(p)));
  };

  const switchUser = (nip) => {
    const found = PEGAWAI_LIST.find(p => p.nip_baru === nip || p.nip_lama === nip);
    if (found) {
      setCurrentUser(found);
    }
  };

  const login = (emailOrNip) => {
    const found = PEGAWAI_LIST.find(p => 
      p.email.toLowerCase() === emailOrNip.toLowerCase() || 
      p.nip_baru === emailOrNip || 
      p.nip_lama === emailOrNip
    );
    if (found) {
      setCurrentUser(found);
      return { success: true, user: found };
    }
    const guestUser = {
      nip_baru: "999999999999999999",
      nama: emailOrNip.split('@')[0] || "Pegawai BPS",
      pangkat_golongan: "Penata/III/c",
      jabatan: "Staf BPS Kabupaten Sambas",
      role: "pegawai",
      tim_kerja: "Umum",
      email: emailOrNip
    };
    setCurrentUser(guestUser);
    return { success: true, user: guestUser };
  };

  const logout = () => {
    setCurrentUser(null);
  };

  const addTransaction = (newTx) => {
    const tx = {
      ...newTx,
      id: `spj-${Date.now()}`,
      created_at: new Date().toISOString()
    };
    setTransactions(prev => [tx, ...prev]);
    return tx;
  };

  const updateTransactionStatus = (id, updates) => {
    setTransactions(prev => prev.map(t => {
      if (t.id === id) {
        let meja = t.meja_berkas;
        if (updates.status_dokumen === 'Di PPK') meja = 'Meja PPK (Peninjauan Komitmen)';
        else if (updates.status_dokumen === 'Di PPSPM') meja = 'Meja PPSPM (Pengujian SPM)';
        else if (updates.status_dokumen === 'Di Bendahara') meja = 'Meja Bendahara (Pencairan Dana)';
        else if (updates.status_dokumen === 'Perlu Perbaikan') meja = 'Meja PJ Kegiatan (Revisi Dokumen)';
        else if (updates.status_dokumen === 'Selesai') meja = 'Meja Arsip Keuangan (Lunas / SP2D Terbit)';

        return {
          ...t,
          ...updates,
          meja_berkas: updates.meja_berkas || meja,
          tanggal_proses: updates.status_dokumen && updates.status_dokumen !== 'Draft' 
            ? (t.tanggal_proses || new Date().toISOString().split('T')[0]) 
            : t.tanggal_proses
        };
      }
      return t;
    }));
  };

  const updateRekonStatus = (id, isSelesai) => {
    setRekonList(prev => prev.map(r => r.id === id ? { ...r, is_selesai: isSelesai, status: isSelesai ? 'Lengkap' : 'Belum Lengkap' } : r));
  };

  return (
    <AuthContext.Provider value={{
      currentUser,
      switchUser,
      login,
      logout,
      pegawaiList: PEGAWAI_LIST,
      transactions,
      addTransaction,
      updateTransactionStatus,
      rekonList,
      updateRekonStatus,
      canAccess,
      isSupabaseConfigured
    }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
