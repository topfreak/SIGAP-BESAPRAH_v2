import React, { createContext, useContext, useState, useEffect } from 'react';
import { PEGAWAI_LIST, INITIAL_TRANSACTIONS, REKON_PETUGAS_LIST } from '../lib/seedData';
import { supabase, isSupabaseConfigured } from '../lib/supabaseClient';
import { getDeskActionAuthority, canActOnTransaction } from '../lib/permissions';

const AuthContext = createContext();

// Matrix izin akses menu per peran (RBAC)
const ROLE_PERMISSIONS = {
  superadmin: ['*'], // Superadmin memiliki akses 100% tanpa batas
  kpa: [
    '/dashboard',
    '/profile',
    '/pengajuan-spj',
    '/panduan-alur',
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
    '/panduan-alur',
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
    '/panduan-alur',
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
    '/panduan-alur',
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
    '/panduan-alur',
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
    '/panduan-alur',
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
    '/pengajuan-spj/baru',
    '/panduan-alur',
    '/panduan-akun',
    '/kalkulator-pajak',
    '/surat-tugas',
    '/laporan-perjadin',
    '/kalender-perjadin',
    '/lacak'
  ]
};

// Helper untuk memastikan akun superadmin steril dari NIP, Pangkat/Gol, Jabatan Fungsional/Keuangan, dan Email
function sanitizeUser(u) {
  if (!u) return u;
  if (u.role === 'superadmin' || u.username === 'superadmin') {
    return {
      ...u,
      nip_baru: '',
      nip_lama: '',
      pangkat_golongan: '',
      jabatan: '',
      status_pegawai: 'Administrator Sistem',
      jabatan_keuangan: '',
      tim_kerja: '',
      email: ''
    };
  }
  return u;
}

export function AuthProvider({ children }) {
  // Master users list (disimpan di localStorage atau fallback ke PEGAWAI_LIST)
  const [users, setUsers] = useState(() => {
    // Bersihkan versi lama agar pembaruan data superadmin & pegawai langsung aktif
    localStorage.removeItem('sigap_users');
    localStorage.removeItem('sigap_users_v4');
    localStorage.removeItem('sigap_users_v5');
    localStorage.removeItem('sigap_users_v6');
    localStorage.removeItem('sigap_users_v7');

    const saved = localStorage.getItem('sigap_users_v8');
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) {
          return parsed.map(sanitizeUser);
        }
      } catch (e) {
        console.error('Error parsing sigap_users_v8:', e);
      }
    }
    return PEGAWAI_LIST.map(sanitizeUser);
  });

  // Current active logged-in user: STRICT REAL AUTH (starts as null if no active session)
  const [currentUser, setCurrentUser] = useState(() => {
    const saved = localStorage.getItem('sigap_user');
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        // Validasi hanya user dengan has_account yang bisa memegang sesi aktif
        if (parsed && parsed.username && parsed.has_account !== false) {
          return sanitizeUser(parsed);
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
    localStorage.setItem('sigap_users_v8', JSON.stringify(users.map(sanitizeUser)));
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
      (p.username && p.username.toLowerCase() === cleanInput) ||
      p.nip_baru === usernameInput.trim()
    );

    if (!found) {
      return { success: false, message: 'Username atau NIP tidak ditemukan dalam sistem.' };
    }

    if (!found.has_account || !found.password) {
      return { 
        success: false, 
        message: 'Pegawai ini tidak memiliki akun login keuangan. Sesuai kebijakan, hanya pegawai dengan Jabatan Keuangan yang dibuatkan akun.' 
      };
    }

    // Strict Password Validation
    if (found.password !== passwordInput) {
      return { success: false, message: 'Kata sandi yang Anda masukkan salah.' };
    }

    const cleanUser = sanitizeUser(found);
    setCurrentUser(cleanUser);
    return { success: true, user: cleanUser };
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
      jabatan_keuangan: userData.jabatan_keuangan || 'Ketua Tim',
      tim_kerja: userData.tim_kerja || 'Umum',
      role: userData.role || 'pj_kegiatan',
      email: userData.email?.trim() || `${cleanUsername}@bps.go.id`,
      has_account: true,
      status_akun: 'Aktif',
      created_at: new Date().toISOString()
    };

    setUsers(prev => [newUser, ...prev]);
    return { success: true, user: newUser, message: `Akun ${newUser.nama} (${newUser.username}) berhasil ditambahkan!` };
  };

  // Superadmin: Update User Details
  const updateUser = (identifier, updates) => {
    setUsers(prev => prev.map(u => {
      const isMatch = (u.nip_baru && u.nip_baru !== '-' && u.nip_baru === identifier) || 
                      (u.username && u.username === identifier) || 
                      u.nip_baru === identifier;
      if (isMatch) {
        const updated = { ...u, ...updates };
        if (currentUser?.nip_baru === identifier || currentUser?.username === identifier) {
          setCurrentUser(updated);
        }
        return updated;
      }
      return u;
    }));
    return { success: true, message: 'Data akun berhasil diperbarui.' };
  };

  // Superadmin: Reset Any User's Password
  const resetUserPassword = (identifier, newPassword) => {
    if (currentUser?.role !== 'superadmin') {
      return { success: false, message: 'Hanya Superadmin yang dapat mereset kata sandi pengguna lain.' };
    }

    if (!newPassword || newPassword.length < 6) {
      return { success: false, message: 'Kata sandi baru minimal 6 karakter.' };
    }

    let foundTarget = false;
    setUsers(prev => prev.map(u => {
      const isMatch = (u.nip_baru && u.nip_baru !== '-' && u.nip_baru === identifier) || 
                      (u.username && u.username === identifier) || 
                      u.nip_baru === identifier;
      if (isMatch) {
        foundTarget = true;
        const updated = { ...u, password: newPassword };
        if (currentUser?.nip_baru === identifier || currentUser?.username === identifier) {
          setCurrentUser(updated);
        }
        return updated;
      }
      return u;
    }));

    if (!foundTarget) {
      return { success: false, message: 'Pengguna tersebut tidak ditemukan.' };
    }

    return { success: true, message: 'Kata sandi pengguna berhasil diubah.' };
  };

  // Superadmin: Delete User Account
  const deleteUser = (identifier) => {
    if (currentUser?.role !== 'superadmin') {
      return { success: false, message: 'Hanya Superadmin yang berwenang menghapus akun.' };
    }

    if (currentUser?.nip_baru === identifier || currentUser?.username === identifier) {
      return { success: false, message: 'Tidak dapat menghapus akun Anda sendiri yang sedang aktif digunakan.' };
    }

    setUsers(prev => prev.filter(u => {
      const isMatch = (u.nip_baru && u.nip_baru !== '-' && u.nip_baru === identifier) || 
                      (u.username && u.username === identifier) || 
                      u.nip_baru === identifier;
      return !isMatch;
    }));
    return { success: true, message: 'Akun pegawai berhasil dihapus dari sistem.' };
  };

  const addTransaction = (newTx) => {
    const initialLog = {
      id: `log-${Date.now()}`,
      timestamp: new Date().toISOString(),
      actor_nama: currentUser?.nama || 'Pengaju',
      actor_nip: currentUser?.nip_baru || '-',
      actor_role: currentUser?.role || 'pegawai',
      meja_asal: 'Draf Baru',
      meja_tujuan: newTx.meja_berkas || 'Meja PPK (Peninjauan Komitmen)',
      status_tujuan: newTx.status_dokumen || 'Di PPK',
      catatan: newTx.catatan_kekurangan || 'Pengajuan berkas SPJ baru'
    };

    const tx = {
      ...newTx,
      id: `spj-${Date.now()}`,
      logs: [initialLog],
      created_at: new Date().toISOString()
    };
    setTransactions(prev => [tx, ...prev]);
    return tx;
  };

  const updateTransactionStatus = (id, updates) => {
    setTransactions(prev => prev.map(t => {
      if (t.id === id) {
        let meja = t.meja_berkas;
        if (updates.status_dokumen === 'Di PPK') meja = 'Meja PPK (Peninjauan Komitmen & SPP)';
        else if (updates.status_dokumen === 'Di Bendahara') meja = 'Meja Bendahara (Verifikasi Kuitansi, Pajak & Kas)';
        else if (updates.status_dokumen === 'Di PPSPM') meja = 'Meja PPSPM (Pengujian Formal & Penerbitan SPM)';
        else if (updates.status_dokumen === 'Perlu Perbaikan') meja = 'Meja PJ Kegiatan (Revisi Dokumen)';
        else if (updates.status_dokumen === 'Selesai') meja = 'Meja Arsip Keuangan (Lunas / SP2D Terbit)';

        const targetMeja = updates.meja_berkas || meja;
        const targetStatus = updates.status_dokumen || t.status_dokumen;

        // Catat jejak audit trail (Chain of Custody Log)
        const transitionLog = {
          id: `log-${Date.now()}-${Math.random().toString(36).substr(2, 4)}`,
          timestamp: new Date().toISOString(),
          actor_nama: currentUser?.nama || 'Sistem',
          actor_nip: currentUser?.nip_baru || '-',
          actor_role: currentUser?.role || 'pegawai',
          meja_asal: t.meja_berkas || 'Meja Sebelumnya',
          meja_tujuan: targetMeja,
          status_tujuan: targetStatus,
          catatan: updates.catatan || updates.review_ppk || updates.review_ppspm || updates.review_bdh || updates.catatan_kekurangan || 'Perpindahan meja berkas'
        };

        const existingLogs = Array.isArray(t.logs) ? t.logs : [];

        return {
          ...t,
          ...updates,
          meja_berkas: targetMeja,
          status_dokumen: targetStatus,
          logs: [transitionLog, ...existingLogs],
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
      getDeskActionAuthority,
      canActOnTransaction,
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
