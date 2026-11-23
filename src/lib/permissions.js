/**
 * SIGAP BESAPRAH - Wewenang Aksi Berdasarkan Posisi Meja Berkas
 * Chain of Custody & Desk-Based Role Based Access Control (RBAC)
 * BPS Kabupaten Sambas
 */

export const DESK_CONFIG = {
  Draft: {
    deskName: 'Meja PJ Kegiatan (Draf Pengajuan)',
    activeRole: 'pj_kegiatan',
    activeRoleLabel: 'Penanggung Jawab Kegiatan / Pengaju Draf',
    color: 'bg-slate-100 text-slate-800 border-slate-300'
  },
  'Di PPK': {
    deskName: 'Meja PPK (Peninjauan Komitmen & SPP)',
    activeRole: 'ppk',
    activeRoleLabel: 'Pejabat Pembuat Komitmen (PPK)',
    color: 'bg-purple-100 text-purple-900 border-purple-300'
  },
  'Di PPSPM': {
    deskName: 'Meja PPSPM (Pengujian & Penerbitan SPM)',
    activeRole: 'ppspm',
    activeRoleLabel: 'Pejabat Penandatangan SPM (PPSPM)',
    color: 'bg-indigo-100 text-indigo-900 border-indigo-300'
  },
  'Di Bendahara': {
    deskName: 'Meja Bendahara (Pencairan Dana & Pajak)',
    activeRole: 'bendahara',
    activeRoleLabel: 'Bendahara Pengeluaran',
    color: 'bg-amber-100 text-amber-900 border-amber-300'
  },
  'Perlu Perbaikan': {
    deskName: 'Meja PJ Kegiatan (Revisi Dokumen Kekurangan)',
    activeRole: 'pj_kegiatan',
    activeRoleLabel: 'Penanggung Jawab Kegiatan / Pengaju',
    color: 'bg-rose-100 text-rose-900 border-rose-300'
  },
  Selesai: {
    deskName: 'Meja Arsip Keuangan (Lunas / SP2D Terbit)',
    activeRole: 'arsip',
    activeRoleLabel: 'Arsip Keuangan Selesai',
    color: 'bg-emerald-100 text-emerald-900 border-emerald-300'
  }
};

/**
 * Evaluasi apakah pengguna berhak memberi aksi pada transaksi tertentu
 */
export function getDeskActionAuthority(currentUser, transaction) {
  if (!currentUser || !transaction) {
    return {
      canAct: false,
      deskName: 'Tidak Diketahui',
      reason: 'Sesi pengguna tidak aktif atau data berkas tidak ditemukan.',
      allowedActions: []
    };
  }

  const status = transaction.status_dokumen || 'Draft';
  const deskInfo = DESK_CONFIG[status] || DESK_CONFIG.Draft;
  const role = currentUser.role || 'pegawai';
  const isSuperadmin = role === 'superadmin';

  // Superadmin memiliki wewenang administrator darurat
  if (isSuperadmin) {
    return {
      canAct: true,
      isSuperadminOverride: true,
      deskName: deskInfo.deskName,
      activeRole: deskInfo.activeRole,
      activeRoleLabel: deskInfo.activeRoleLabel,
      reason: 'Anda memiliki akses penuh sebagai Administrator Sistem.',
      allowedActions: ['ALL']
    };
  }

  // Berkas telah selesai / final
  if (status === 'Selesai') {
    return {
      canAct: false,
      deskName: deskInfo.deskName,
      activeRole: deskInfo.activeRole,
      activeRoleLabel: deskInfo.activeRoleLabel,
      reason: 'Berkas telah selesai diproses (Lunas / SP2D terbit) dan telah diarsipkan secara permanen. Berkas bersifat Read-Only.',
      allowedActions: []
    };
  }

  // Evaluasi per tahapan meja
  switch (status) {
    case 'Draft': {
      // Boleh jika user adalah PJ Kegiatan transaksi, staf pembuat draf, atau berperan pj_kegiatan
      const isOwner = currentUser.nip_baru === transaction.pj_kegiatan_nip || 
                      currentUser.nip_baru === transaction.pengaju_nip ||
                      role === 'pj_kegiatan';
      if (isOwner) {
        return {
          canAct: true,
          deskName: deskInfo.deskName,
          activeRole: 'pj_kegiatan',
          activeRoleLabel: 'PJ Kegiatan / Pengaju Draf',
          allowedActions: ['SUBMIT_TO_PPK', 'EDIT_DRAFT', 'DELETE_DRAFT']
        };
      }
      return {
        canAct: false,
        deskName: deskInfo.deskName,
        activeRole: 'pj_kegiatan',
        activeRoleLabel: 'PJ Kegiatan / Pengaju',
        reason: `Berkas masih berstatus draf di Meja PJ Kegiatan (${transaction.pj_nama || 'Tim Pemohon'}). Hanya pembuat draf atau PJ Kegiatan yang dapat memproses dan mengajukan berkas ini.`
      };
    }

    case 'Di PPK': {
      if (role === 'ppk') {
        return {
          canAct: true,
          deskName: deskInfo.deskName,
          activeRole: 'ppk',
          activeRoleLabel: 'Pejabat Pembuat Komitmen (PPK)',
          allowedActions: ['APPROVE_PPK', 'REQUEST_REVISION']
        };
      }
      return {
        canAct: false,
        deskName: deskInfo.deskName,
        activeRole: 'ppk',
        activeRoleLabel: 'Pejabat Pembuat Komitmen (PPK)',
        reason: `Berkas saat ini sedang berada di Meja PPK (Peninjauan Komitmen). Anda sedang masuk sebagai ${currentUser.nama} (${role.toUpperCase()}). Anda baru dapat memproses berkas ini setelah berkas disetujui PPK dan diteruskan ke tahapan Anda.`
      };
    }

    case 'Di PPSPM': {
      if (role === 'ppspm' || role === 'kpa') {
        return {
          canAct: true,
          deskName: deskInfo.deskName,
          activeRole: 'ppspm',
          activeRoleLabel: 'Pejabat Penandatangan SPM (PPSPM)',
          allowedActions: ['APPROVE_PPSPM', 'REJECT_PPSPM']
        };
      }
      return {
        canAct: false,
        deskName: deskInfo.deskName,
        activeRole: 'ppspm',
        activeRoleLabel: 'Pejabat Penandatangan SPM (PPSPM)',
        reason: `Berkas saat ini sedang dalam pengujian SPM di Meja PPSPM. Pejabat lain belum memiliki wewenang untuk memproses berkas ini.`
      };
    }

    case 'Di Bendahara': {
      if (role === 'bendahara') {
        return {
          canAct: true,
          deskName: deskInfo.deskName,
          activeRole: 'bendahara',
          activeRoleLabel: 'Bendahara Pengeluaran',
          allowedActions: ['PAY_BENDAHARA']
        };
      }
      return {
        canAct: false,
        deskName: deskInfo.deskName,
        activeRole: 'bendahara',
        activeRoleLabel: 'Bendahara Pengeluaran',
        reason: `Berkas saat ini sedang berada di Meja Bendahara (Pencairan Dana). Hanya Bendahara Pengeluaran yang berwenang melakukan konfirmasi pencairan dan membayarkan dana.`
      };
    }

    case 'Perlu Perbaikan': {
      const isOwner = currentUser.nip_baru === transaction.pj_kegiatan_nip || 
                      currentUser.nip_baru === transaction.pengaju_nip ||
                      role === 'pj_kegiatan';
      if (isOwner) {
        return {
          canAct: true,
          deskName: deskInfo.deskName,
          activeRole: 'pj_kegiatan',
          activeRoleLabel: 'PJ Kegiatan / Pengaju',
          allowedActions: ['RESUBMIT_TO_PPK', 'EDIT_ATTACHMENT']
        };
      }
      return {
        canAct: false,
        deskName: deskInfo.deskName,
        activeRole: 'pj_kegiatan',
        activeRoleLabel: 'PJ Kegiatan / Pengaju',
        reason: `Berkas dikembalikan ke Meja PJ Kegiatan (${transaction.pj_nama}) untuk perbaikan dokumen. Bagian keuangan sedang menunggu revisi dari tim kegiatan.`
      };
    }

    default:
      return {
        canAct: false,
        deskName: 'Status Tidak Dikenal',
        reason: 'Status dokumen tidak valid.'
      };
  }
}

/**
 * Pengecekan cepat boolean untuk proteksi baris tabel atau mass action
 */
export function canActOnTransaction(currentUser, transaction) {
  return getDeskActionAuthority(currentUser, transaction).canAct;
}
