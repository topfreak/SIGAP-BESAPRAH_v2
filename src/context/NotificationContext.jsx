import React, { createContext, useContext, useState, useEffect, useMemo, useCallback } from 'react';
import { useAuth } from './AuthContext';

const NotificationContext = createContext();

// Seed notifikasi awal yang realistis dan kontekstual dengan alur 5 meja SPJ BPS Sambas
const INITIAL_NOTIFICATIONS = [
  {
    id: 'notif-001',
    title: 'Berkas Siap Diverifikasi di Meja Bendahara',
    message: 'SPM No. 00042A (Honor Petugas Lapangan Susenas) telah disetujui PPK dan siap untuk verifikasi kuitansi serta potongan PPh.',
    type: 'info', // info | warning | success | alert
    category: 'disposisi',
    targetRole: ['bendahara', 'superadmin'],
    targetNip: ['199304152015032002'], // Fitria W.
    transactionId: 'spj-001',
    no_spm: '00042A',
    link: '/pengajuan-spj/spj-001',
    timestamp: new Date(Date.now() - 25 * 60 * 1000).toISOString(), // 25 menit yang lalu
    isRead: false
  },
  {
    id: 'notif-002',
    title: 'Catatan Perbaikan Dokumen SPJ',
    message: 'Berkas No. 00068A (Survei HP Januari 2026) dikembalikan ke Meja PJ: "Form Permintaan & SK KPA belum terlampir lengkap".',
    type: 'warning',
    category: 'revisi',
    targetRole: ['pegawai', 'superadmin'],
    targetNip: ['198811202010122003'], // Nuri Hayana
    transactionId: 'spj-003',
    no_spm: '00068A',
    link: '/pengajuan-spj/spj-003',
    timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(), // 2 jam yang lalu
    isRead: false
  },
  {
    id: 'notif-003',
    title: 'Pengajuan SPJ Baru di Meja PPK',
    message: 'PJ Kegiatan Tim Distribusi mengajukan SPJ baru No. 00070A (HPT Januari 2026) senilai Rp 2.850.000 menunggu persetujuan komitmen.',
    type: 'info',
    category: 'disposisi',
    targetRole: ['ppk', 'superadmin'],
    targetNip: ['198602142008011002'], // Adi Rakhmat
    transactionId: 'spj-005',
    no_spm: '00070A',
    link: '/pengajuan-spj/spj-005',
    timestamp: new Date(Date.now() - 4 * 60 * 60 * 1000).toISOString(), // 4 jam yang lalu
    isRead: false
  },
  {
    id: 'notif-004',
    title: 'Pengujian Formal SPM di Meja PPSPM',
    message: 'Berkas No. 00120T (Translok Petugas Pendataan PES) telah diverifikasi Bendahara dan masuk ke Meja PPSPM untuk pengujian SPM.',
    type: 'info',
    category: 'disposisi',
    targetRole: ['ppspm', 'kpa', 'superadmin'],
    targetNip: ['198005122002121001'], // Solikhin / KPA
    transactionId: 'spj-008',
    no_spm: '00120T',
    link: '/pengajuan-spj/spj-008',
    timestamp: new Date(Date.now() - 6 * 60 * 60 * 1000).toISOString(), // 6 jam yang lalu
    isRead: true
  },
  {
    id: 'notif-005',
    title: 'Dana SP2D Telah Terbit & Cair (Arsip)',
    message: 'Selamat! Pembayaran SPJ No. 00001A senilai Rp 37.681.800 telah selesai diproses dan berkas fisik tersimpan di Meja Arsip Keuangan.',
    type: 'success',
    category: 'pencairan',
    targetRole: ['all'],
    transactionId: 'spj-002',
    no_spm: '00001A',
    link: '/pengajuan-spj/spj-002',
    timestamp: new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString(), // 1 hari yang lalu
    isRead: true
  }
];

export function NotificationProvider({ children }) {
  const { currentUser, transactions } = useAuth();

  // Load notifikasi tersimpan atau gunakan initial
  const [notifications, setNotifications] = useState(() => {
    try {
      const saved = localStorage.getItem('sigap_local_notifications_v1');
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) {
          return parsed;
        }
      }
    } catch (e) {
      console.error('Gagal memuat notifikasi dari localStorage:', e);
    }
    return INITIAL_NOTIFICATIONS;
  });

  // State untuk Toast interaktif (muncul sementara di pojok layar)
  const [activeToasts, setActiveToasts] = useState([]);

  // Simpan ke localStorage saat ada perubahan
  useEffect(() => {
    try {
      localStorage.setItem('sigap_local_notifications_v1', JSON.stringify(notifications));
    } catch (e) {
      console.error('Gagal menyimpan notifikasi ke localStorage:', e);
    }
  }, [notifications]);

  // Tambahkan Toast baru dengan auto-dismiss 5 detik
  const triggerToast = useCallback((toastData) => {
    const toastId = 'toast-' + Date.now() + '-' + Math.random().toString(36).substr(2, 4);
    const newToast = {
      id: toastId,
      ...toastData,
      createdAt: Date.now()
    };

    setActiveToasts(prev => [newToast, ...prev.slice(0, 3)]); // Maksimal 4 toast bersamaan

    setTimeout(() => {
      setActiveToasts(prev => prev.filter(t => t.id !== toastId));
    }, 5500);
  }, []);

  const dismissToast = useCallback((toastId) => {
    setActiveToasts(prev => prev.filter(t => t.id !== toastId));
  }, []);

  // Fungsi menambah notifikasi baru ke sistem
  const addNotification = useCallback(({
    title,
    message,
    type = 'info',
    category = 'disposisi',
    targetRole = ['all'],
    targetNip = [],
    transactionId = null,
    no_spm = null,
    link = '/pengajuan-spj'
  }) => {
    const newNotif = {
      id: 'notif-' + Date.now() + '-' + Math.random().toString(36).substr(2, 5),
      title,
      message,
      type,
      category,
      targetRole,
      targetNip,
      transactionId,
      no_spm,
      link,
      timestamp: new Date().toISOString(),
      isRead: false
    };

    setNotifications(prev => [newNotif, ...prev]);

    // Tampilkan toast pop-up jika relevan dengan user yang sedang aktif
    triggerToast({
      title,
      message,
      type,
      link,
      no_spm
    });

    return newNotif;
  }, [triggerToast]);

  // Tandai notifikasi spesifik sebagai sudah dibaca
  const markAsRead = useCallback((notifId) => {
    setNotifications(prev => prev.map(n => 
      n.id === notifId ? { ...n, isRead: true } : n
    ));
  }, []);

  // Tandai semua notifikasi relevan user sebagai sudah dibaca
  const markAllAsRead = useCallback(() => {
    if (!currentUser) return;
    const isSuperadmin = currentUser.role === 'superadmin';

    setNotifications(prev => prev.map(n => {
      const isTarget = isSuperadmin || 
        n.targetRole?.includes('all') || 
        n.targetRole?.includes(currentUser.role) ||
        (n.targetNip && n.targetNip.includes(currentUser.nip_baru));

      if (isTarget) {
        return { ...n, isRead: true };
      }
      return n;
    }));
  }, [currentUser]);

  // Hapus notifikasi
  const deleteNotification = useCallback((notifId) => {
    setNotifications(prev => prev.filter(n => n.id !== notifId));
  }, []);

  // Bersihkan semua notifikasi
  const clearAllNotifications = useCallback(() => {
    setNotifications([]);
  }, []);

  // Filter notifikasi yang berhak dilihat oleh currentUser
  const userNotifications = useMemo(() => {
    if (!currentUser) return [];

    const isSuperadmin = currentUser.role === 'superadmin';

    return notifications.filter(n => {
      if (isSuperadmin) return true; // Superadmin melihat semua notifikasi
      if (n.targetRole?.includes('all')) return true;
      if (n.targetRole?.includes(currentUser.role)) return true;
      if (n.targetNip && n.targetNip.includes(currentUser.nip_baru)) return true;
      
      // Jika NIP tidak cocok tapi nama PJ cocok
      if (n.message && currentUser.nama && n.message.toLowerCase().includes(currentUser.nama.toLowerCase().split(' ')[0])) {
        return true;
      }

      return false;
    });
  }, [notifications, currentUser]);

  // Hitung jumlah notifikasi yang belum dibaca (unread count)
  const unreadCount = useMemo(() => {
    return userNotifications.filter(n => !n.isRead).length;
  }, [userNotifications]);

  // Simulasi notifikasi cepat (berguna untuk pengujian langsung oleh pengguna)
  const simulateIncomingNotification = useCallback(() => {
    const roles = ['bendahara', 'ppk', 'ppspm', 'pegawai'];
    const randomRole = roles[Math.floor(Math.random() * roles.length)];
    const randomSPM = `00${Math.floor(100 + Math.random() * 900)}A`;

    addNotification({
      title: `⚡ Simulasi: Berkas Baru Masuk ke Meja SPJ`,
      message: `Berkas SPM No. ${randomSPM} baru saja diteruskan dan siap diproses oleh penanggung jawab terkait.`,
      type: 'info',
      category: 'disposisi',
      targetRole: ['all'],
      no_spm: randomSPM,
      link: '/pengajuan-spj'
    });
  }, [addNotification]);

  const value = {
    notifications: userNotifications,
    rawNotifications: notifications,
    unreadCount,
    activeToasts,
    addNotification,
    markAsRead,
    markAllAsRead,
    deleteNotification,
    clearAllNotifications,
    dismissToast,
    triggerToast,
    simulateIncomingNotification
  };

  return (
    <NotificationContext.Provider value={value}>
      {children}
    </NotificationContext.Provider>
  );
}

export function useNotification() {
  const context = useContext(NotificationContext);
  if (!context) {
    throw new Error('useNotification must be used within a NotificationProvider');
  }
  return context;
}
