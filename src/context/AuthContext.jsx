import React, { createContext, useContext, useState, useEffect } from 'react';
import { PEGAWAI_LIST, INITIAL_TRANSACTIONS, REKON_PETUGAS_LIST } from '../lib/seedData';
import { supabase, isSupabaseConfigured } from '../lib/supabaseClient';

const AuthContext = createContext();

// Matrix izin akses menu per peran (RBAC)
const ROLE_PERMISSIONS = {
  superadmin: ['*'], // Superadmin memiliki akses 100% tanpa batas
  kpa: [
    '/dashboard',
    '/profile',
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
    '/profile',
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
    '/profile',
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
    '/profile',
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
    '/profile',
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
    '/profile',
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
    '/profile',
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
  // Master users list (disimpan di localStorage atau fallback ke PEGAWAI_LIST)
  const [users, setUsers] = useState(() => {
    const saved = localStorage.getItem('sigap_users');
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) return parsed;
      } catch (e) {
        console.error('Error parsing sigap_users:', e);
      }
    }
    return PEGAWAI_LIST;
  });

  // Current active logged-in user: STRICT REAL AUTH (starts as null if no active session)
  const [currentUser, setCurrentUser] = useState(() => {
    const saved = localStorage.getItem('sigap_user');
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        if (parsed && parsed.username && parsed.nip_baru) {
          return parsed;
        }
      } catch (e) {
        console.error('Error parsing sigap_user:', e);
      }
    }
    return null; // Pengguna wajib login terlebih dahulu!
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

  // Save changes to localStorage
  useEffect(() => {
    localStorage.setItem('sigap_users', JSON.stringify(users));
  }, [users]);

  useEffect(() => {
    if (currentUser) {
      localStorage.setItem('sigap_user', JSON.stringify(currentUser));
    } else {
      localStorage.removeItem('sigap_user');
    }
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
    if (path === '/profile') return true;
    const role = currentUser.role || 'pegawai';
    const allowed = ROLE_PERMISSIONS[role] || ROLE_PERMISSIONS.pegawai;
    if (allowed.includes('*')) return true; // Superadmin
    return allowed.some(p => path === p || (p !== '/dashboard' && path.startsWith(p)));
  };

  // Real Login with Username and Password
  const login = (usernameInput, passwordInput) => {
    if (!usernameInput || !passwordInput) {
      return { success: false, message: 'Username dan kata sandi wajib diisi.' };
    }

    const cleanInput = usernameInput.trim().toLowerCase();
    const found = users.find(p => 
      p.username?.toLowerCase() === cleanInput ||
      p.nip_baru === usernameInput.trim()
    );

    if (!found) {
      return { success: false, message: 'Username atau NIP tidak ditemukan dalam sistem.' };
    }

    // Strict Password Validation
    if (found.password !== passwordInput) {
      return { success: false, message: 'Kata sandi yang Anda masukkan salah.' };
    }

    setCurrentUser(found);
    return { success: true, user: found };
  };

  // User Logout
  const logout = () => {
    setCurrentUser(null);
    localStorage.removeItem('sigap_user');
  };

  // User self change password
  const changePassword = (oldPassword, newPassword) => {
    if (!currentUser) return { success: false, message: 'Sesi pengguna tidak aktif.' };
    
    if (currentUser.password !== oldPassword) {
      return { success: false, message: 'Kata sandi saat ini tidak sesuai.' };
    }
    
    if (!newPassword || newPassword.length < 6) {
      return { success: false, message: 'Kata sandi baru minimal 6 karakter.' };
    }

    const updatedUser = { ...currentUser, password: newPassword };
    setUsers(prev => prev.map(u => u.nip_baru === currentUser.nip_baru ? updatedUser : u));
    setCurrentUser(updatedUser);
    return { success: true, message: 'Kata sandi berhasil diperbarui!' };
  };

  // Superadmin: Add New User Account
  const addUser = (userData) => {
    if (currentUser?.role !== 'superadmin') {
      return { success: false, message: 'Hanya Superadmin yang memiliki wewenang membuat akun baru.' };
    }

    const cleanUsername = (userData.username || '').trim().toLowerCase();
    if (!cleanUsername) {
      return { success: false, message: 'Username wajib diisi.' };
    }

    if (users.some(u => u.username?.toLowerCase() === cleanUsername)) {
      return { success: false, message: `Username "${cleanUsername}" sudah digunakan oleh akun lain.` };
    }

    if (!userData.nip_baru || !userData.nip_baru.trim()) {
      return { success: false, message: 'NIP Baru wajib diisi.' };
    }

    if (users.some(u => u.nip_baru === userData.nip_baru.trim())) {
      return { success: false, message: `NIP Baru "${userData.nip_baru}" sudah terdaftar.` };
    }

    if (!userData.nama || !userData.nama.trim()) {
      return { success: false, message: 'Nama lengkap pegawai wajib diisi.' };
    }

    if (!userData.password || userData.password.length < 6) {
      return { success: false, message: 'Kata sandi akun minimal 6 karakter.' };
    }

    const newUser = {
      nip_baru: userData.nip_baru.trim(),
      nip_lama: (userData.nip_lama || '').trim(),
      username: cleanUsername,
      password: userData.password,
      nama: userData.nama.trim(),
      pangkat_golongan: userData.pangkat_golongan || 'Pengatur Muda/II/a',
      jabatan: userData.jabatan || 'Staf Pelaksana',
      status_pegawai: userData.status_pegawai || 'PNS',
      role: userData.role || 'pegawai',
      tim_kerja: userData.tim_kerja || 'Umum',
      email: userData.email?.trim() || `${cleanUsername}@bps.go.id`,
      created_at: new Date().toISOString()
    };

    setUsers(prev => [newUser, ...prev]);
    return { success: true, user: newUser, message: `Akun ${newUser.nama} (${newUser.username}) berhasil ditambahkan!` };
  };

  // Superadmin: Update User Details
  const updateUser = (nip, updates) => {
    setUsers(prev => prev.map(u => {
      if (u.nip_baru === nip) {
        const updated = { ...u, ...updates };
        if (currentUser?.nip_baru === nip) {
          setCurrentUser(updated);
        }
        return updated;
      }
      return u;
    }));
    return { success: true, message: 'Data akun berhasil diperbarui.' };
  };

  // Superadmin: Reset Any User's Password
  const resetUserPassword = (nip, newPassword) => {
    if (currentUser?.role !== 'superadmin') {
      return { success: false, message: 'Hanya Superadmin yang dapat mereset kata sandi pengguna lain.' };
    }

    if (!newPassword || newPassword.length < 6) {
      return { success: false, message: 'Kata sandi baru minimal 6 karakter.' };
    }

    let foundTarget = false;
    setUsers(prev => prev.map(u => {
      if (u.nip_baru === nip) {
        foundTarget = true;
        const updated = { ...u, password: newPassword };
        if (currentUser?.nip_baru === nip) {
          setCurrentUser(updated);
        }
        return updated;
      }
      return u;
    }));

    if (!foundTarget) {
      return { success: false, message: 'Pengguna dengan NIP tersebut tidak ditemukan.' };
    }

    return { success: true, message: 'Kata sandi pengguna berhasil diubah.' };
  };

  // Superadmin: Delete User Account
  const deleteUser = (nip) => {
    if (currentUser?.role !== 'superadmin') {
      return { success: false, message: 'Hanya Superadmin yang berwenang menghapus akun.' };
    }

    if (currentUser?.nip_baru === nip) {
      return { success: false, message: 'Tidak dapat menghapus akun Anda sendiri yang sedang aktif digunakan.' };
    }

    setUsers(prev => prev.filter(u => u.nip_baru !== nip));
    return { success: true, message: 'Akun pegawai berhasil dihapus dari sistem.' };
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
      login,
      logout,
      changePassword,
      addUser,
      updateUser,
      resetUserPassword,
      deleteUser,
      pegawaiList: users, // Reactive users list
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
