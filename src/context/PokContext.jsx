import React, { createContext, useContext, useState, useEffect, useMemo, useCallback } from 'react';
import { useAuth } from './AuthContext';
import { INITIAL_POK_ACCOUNTS, INITIAL_RKK_METADATA } from '../lib/pokRpdData';
import { mergeImportedPokAccounts } from '../lib/rkkSaktiParser';

const PokContext = createContext();

const STORAGE_KEYS = {
  metadata: 'sigap_pok_metadata_v2',
  accounts: 'sigap_pok_accounts_v2'
};

export function PokProvider({ children }) {
  const { transactions } = useAuth();

  // State Metadata RKK SAKTI
  const [metadata, setMetadata] = useState(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.metadata);
      if (saved) return JSON.parse(saved);
    } catch (e) {}
    return INITIAL_RKK_METADATA;
  });

  // State Akun POK & Target RPD 12 Bulan
  const [rawPokAccounts, setRawPokAccounts] = useState(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.accounts);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) return parsed;
      }
    } catch (e) {}
    return INITIAL_POK_ACCOUNTS;
  });

  // Simpan perubahan ke localStorage
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEYS.metadata, JSON.stringify(metadata));
      localStorage.setItem(STORAGE_KEYS.accounts, JSON.stringify(rawPokAccounts));
    } catch (e) {
      console.error('Gagal menyimpan data POK ke localStorage:', e);
    }
  }, [metadata, rawPokAccounts]);

  /**
   * KONEKSI REAL-TIME: Sinkronkan RKK SAKTI dengan transaksi SPJ SIGAP BESAPRAH
   * - Transaksi Selesai (SP2D terbit / Arsip) -> menambah Realisasi di bulan tanggal_sp2d / tanggal_proses
   * - Transaksi Berjalan (Di PPK/Bendahara/PPSPM) -> menambah Komitmen Berjalan (On-Progress)
   */
  const pokAccounts = useMemo(() => {
    return rawPokAccounts.map(acc => {
      const spjRealisasiBulanan = new Array(12).fill(0);
      let spjOnProgressTotal = 0;
      const linkedTransactions = [];

      transactions.forEach(tx => {
        // Cocokkan transaksi dengan akun POK:
        // 1. Jika memiliki pok_account_id persis
        // 2. Atau kecocokan berdasarkan kode_akun + tim_kerja (untuk data transaksi seed)
        const isExactMatch = tx.pok_account_id && tx.pok_account_id === acc.id;
        const isHeuristicMatch = !tx.pok_account_id &&
          tx.kode_akun === acc.kodeAkun &&
          (tx.tim_kerja?.toLowerCase() === acc.timKerja?.toLowerCase());

        // Untuk heuristic match agar tidak terhitung ganda jika ada banyak akun dg kode sama di tim yang sama,
        // kaitkan hanya ke akun pertama yang cocok di tim tersebut.
        if (isExactMatch || (isHeuristicMatch && rawPokAccounts.find(a => a.kodeAkun === tx.kode_akun && a.timKerja?.toLowerCase() === tx.tim_kerja?.toLowerCase())?.id === acc.id)) {
          const nominal = Number(tx.jumlah_pengeluaran || tx.jumlah_pembayaran) || 0;
          linkedTransactions.push(tx);

          if (tx.status_dokumen === 'Selesai') {
            // Tentukan bulan SP2D (default bulan aktif saat ini jika tidak ada tanggal_sp2d)
            const dateStr = tx.tanggal_sp2d || tx.tanggal_proses || tx.tanggal_terima;
            let monthIdx = new Date().getMonth(); // 0-11
            if (dateStr) {
              const parsedDate = new Date(dateStr);
              if (!isNaN(parsedDate.getTime())) {
                monthIdx = parsedDate.getMonth();
              }
            }
            spjRealisasiBulanan[monthIdx] += nominal;
          } else {
            spjOnProgressTotal += nominal;
          }
        }
      });

      // Gabungkan realisasi awal (baseline RKK) dengan realisasi SPJ baru dari SIGAP
      // Untuk menjaga agar data seed awal tidak ter-double count dengan realisasi awal Oktober ke bawah,
      // tambahkan spjRealisasiBulanan khusus untuk transaksi baru (yg memiliki pok_account_id atau bulan Nov-Des)
      const realisasiGabungan = new Array(12).fill(0);
      for (let i = 0; i < 12; i++) {
        const base = acc.realisasiAwal?.[i] || 0;
        const fromSpj = spjRealisasiBulanan[i] || 0;
        realisasiGabungan[i] = base + fromSpj;
      }

      const totalRpd = (acc.rpdBulanan || []).reduce((a, b) => a + b, 0);
      const totalRealisasi = realisasiGabungan.reduce((a, b) => a + b, 0);
      const sisaAnggaran = (acc.pagu || 0) - totalRealisasi;
      const sisaSetelahKomitmen = sisaAnggaran - spjOnProgressTotal;
      const persenSerapan = acc.pagu > 0 ? Math.round((totalRealisasi / acc.pagu) * 1000) / 10 : 0;

      return {
        ...acc,
        realisasiSpjBaru: spjRealisasiBulanan,
        realisasiGabungan,
        komitmenOnProgress: spjOnProgressTotal,
        linkedTransactionsCount: linkedTransactions.length,
        totalRpd,
        totalRealisasi,
        sisaAnggaran,
        sisaSetelahKomitmen,
        persenSerapan
      };
    });
  }, [rawPokAccounts, transactions]);

  /**
   * Kalkulasi Agregat Satker, 12 Bulan, Triwulanan (TW I-IV), dan Deviasi IKPA
   */
  const rekapSatker = useMemo(() => {
    const totalPagu = pokAccounts.reduce((sum, a) => sum + (a.pagu || 0), 0);
    const totalRealisasi = pokAccounts.reduce((sum, a) => sum + (a.totalRealisasi || 0), 0);
    const totalOnProgress = pokAccounts.reduce((sum, a) => sum + (a.komitmenOnProgress || 0), 0);
    const totalSisa = totalPagu - totalRealisasi;
    const persenSerapan = totalPagu > 0 ? Math.round((totalRealisasi / totalPagu) * 1000) / 10 : 0;

    // 12 Bulan Agregat
    const rpdPerBulan = new Array(12).fill(0);
    const realisasiPerBulan = new Array(12).fill(0);

    pokAccounts.forEach(acc => {
      for (let i = 0; i < 12; i++) {
        rpdPerBulan[i] += acc.rpdBulanan?.[i] || 0;
        realisasiPerBulan[i] += acc.realisasiGabungan?.[i] || 0;
      }
    });

    const deviasiPerBulan = rpdPerBulan.map((rpd, i) => {
      const real = realisasiPerBulan[i];
      if (rpd <= 0) return real > 0 ? 100 : 0;
      return Math.round((Math.abs(real - rpd) / rpd) * 1000) / 10;
    });

    // Triwulanan (TW I - IV)
    const triwulan = [0, 1, 2, 3].map(tw => {
      const start = tw * 3;
      const target = rpdPerBulan[start] + rpdPerBulan[start + 1] + rpdPerBulan[start + 2];
      const real = realisasiPerBulan[start] + realisasiPerBulan[start + 1] + realisasiPerBulan[start + 2];
      const deviasi = target > 0 ? Math.round((Math.abs(real - target) / target) * 1000) / 10 : 0;
      const persenReal = target > 0 ? Math.round((real / target) * 1000) / 10 : 0;
      return {
        label: `Triwulan ${['I', 'II', 'III', 'IV'][tw]}`,
        periode: ['Jan–Mar', 'Apr–Jun', 'Jul–Sep', 'Okt–Des'][tw],
        target,
        realisasi: real,
        deviasi,
        persenReal
      };
    });

    // Hitung rata-rata deviasi sampai bulan berjalan (misal Nov = indeks 10 -> cek s.d. Okt indeks 9 untuk IKPA closed months)
    const closedMonthsDeviasi = deviasiPerBulan.slice(0, 10); // Jan-Okt
    const avgDeviasiIkpa = closedMonthsDeviasi.length > 0
      ? Math.round((closedMonthsDeviasi.reduce((a, b) => a + b, 0) / closedMonthsDeviasi.length) * 10) / 10
      : 0;

    let statusIkpa = 'Sangat Baik';
    if (avgDeviasiIkpa > 10) statusIkpa = 'Perlu Perhatian';
    else if (avgDeviasiIkpa > 5) statusIkpa = 'Cukup';

    return {
      totalPagu,
      totalRealisasi,
      totalOnProgress,
      totalSisa,
      persenSerapan,
      rpdPerBulan,
      realisasiPerBulan,
      deviasiPerBulan,
      triwulan,
      avgDeviasiIkpa,
      statusIkpa
    };
  }, [pokAccounts]);

  /**
   * Menerapkan data POK baru hasil Import XLSX / PDF RKK SAKTI
   * Jika file tidak memuat kolom bulan (RKK murni), gabungkan cerdas dengan jadwal RPD & Realisasi baseline/aktif.
   */
  const applyImportedPok = useCallback((newAccounts, newMetadata, hasMonthlyRpd = false) => {
    if (Array.isArray(newAccounts) && newAccounts.length > 0) {
      const baselineForMerge = rawPokAccounts.length >= INITIAL_POK_ACCOUNTS.length
        ? rawPokAccounts
        : INITIAL_POK_ACCOUNTS;
      const { accounts: merged, matchedCount } = mergeImportedPokAccounts(
        newAccounts,
        baselineForMerge,
        hasMonthlyRpd
      );
      setRawPokAccounts(merged);
      setMetadata(prev => ({
        ...prev,
        ...newMetadata,
        sumber_import: !hasMonthlyRpd && matchedCount > 0
          ? `${newMetadata?.sumber_import || 'Import RKK SAKTI'} • Smart Merge RPD 12 Bln (${matchedCount} akun)`
          : (newMetadata?.sumber_import || prev.sumber_import)
      }));
      return true;
    }
    return false;
  }, [rawPokAccounts]);

  /**
   * Memperbarui jadwal penarikan RPD 12 bulan (atau memperbarui pagu revisi)
   */
  const updateRpdSchedule = useCallback((accountId, newRpdBulanan, newPagu = null) => {
    setRawPokAccounts(prev => prev.map(acc => {
      if (acc.id !== accountId) return acc;
      return {
        ...acc,
        pagu: newPagu !== null ? Number(newPagu) : acc.pagu,
        rpdBulanan: newRpdBulanan.map(v => Number(v) || 0)
      };
    }));
  }, []);

  /**
   * Reset data POK & RPD ke kondisi baseline resmi T.A. 2026
   */
  const resetToDefaultPok = useCallback(() => {
    setRawPokAccounts(INITIAL_POK_ACCOUNTS);
    setMetadata(INITIAL_RKK_METADATA);
    localStorage.removeItem(STORAGE_KEYS.accounts);
    localStorage.removeItem(STORAGE_KEYS.metadata);
    localStorage.removeItem('sigap_pok_accounts_v1');
    localStorage.removeItem('sigap_pok_metadata_v1');
  }, []);

  /**
   * Ambil status pagu akun spesifik untuk validasi di Form Pengajuan SPJ Baru
   */
  const getAccountById = useCallback((accountId) => {
    return pokAccounts.find(a => a.id === accountId) || null;
  }, [pokAccounts]);

  const value = {
    metadata,
    pokAccounts,
    rekapSatker,
    applyImportedPok,
    updateRpdSchedule,
    resetToDefaultPok,
    getAccountById
  };

  return (
    <PokContext.Provider value={value}>
      {children}
    </PokContext.Provider>
  );
}

export function usePok() {
  const context = useContext(PokContext);
  if (!context) {
    throw new Error('usePok must be used within a PokProvider');
  }
  return context;
}
