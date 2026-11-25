import React, { useMemo } from 'react';
import { Link } from 'react-router-dom';
import { 
  FileSpreadsheet, 
  FilePlus2, 
  CheckCircle2, 
  AlertCircle, 
  TrendingUp, 
  FileText, 
  ShieldCheck, 
  ArrowRight,
  ExternalLink,
  Crown,
  Layers,
  Gauge
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { usePok } from '../context/PokContext';
import DashboardCharts from '../components/dashboard/DashboardCharts';

export default function DashboardPage() {
  const { currentUser, transactions, canAccess } = useAuth();
  const { rekapSatker, metadata } = usePok();

  // Statistics
  const total = transactions.length;
  const selesai = transactions.filter(t => t.status_dokumen === 'Selesai').length;
  const perluRevisi = transactions.filter(t => t.status_dokumen === 'Perlu Perbaikan').length;

  // Meja berkas counts
  const countMejaPJ = transactions.filter(t => t.meja_berkas?.includes('PJ') || t.status_dokumen === 'Perlu Perbaikan').length;
  const countMejaArsip = transactions.filter(t => t.meja_berkas?.includes('Arsip') || t.status_dokumen === 'Selesai').length;

  // Total nominal keseluruhan
  const totalNominal = useMemo(() => {
    return transactions.reduce((sum, t) => sum + (Number(t.jumlah_pembayaran) || 0), 0);
  }, [transactions]);

  // Nominal selesai (cair)
  const nominalSelesai = useMemo(() => {
    return transactions
      .filter(t => t.status_dokumen === 'Selesai' || t.meja_berkas?.includes('Arsip'))
      .reduce((sum, t) => sum + (Number(t.jumlah_pembayaran) || 0), 0);
  }, [transactions]);

  const persenSelesai = total > 0 ? Math.round((selesai / total) * 100) : 0;
  const isSuperadmin = currentUser?.role === 'superadmin';

  // Format IDR singkat
  const formatIDR = (val) => {
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      maximumFractionDigits: 0
    }).format(val);
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-200">
      {/* 1. WELCOME & ACTION BANNER */}
      <div className="p-6 md:p-8 rounded-3xl bg-gradient-to-r from-[#22094c] via-[#35106e] to-[#551884] text-white shadow-xl relative overflow-hidden">
        {/* Dekorasi Aksen Lingkaran di Background */}
        <div className="absolute -right-12 -top-12 w-64 h-64 rounded-full bg-white/5 blur-2xl pointer-events-none" />
        <div className="absolute right-32 -bottom-16 w-48 h-48 rounded-full bg-purple-400/10 blur-xl pointer-events-none" />

        <div className="relative z-10 flex flex-col lg:flex-row lg:items-center justify-between gap-6">
          <div className="space-y-2">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 text-purple-200 text-xs font-semibold backdrop-blur-md border border-white/10">
              <ShieldCheck className="w-3.5 h-3.5 text-amber-300" />
              <span>SIGAP BESAPRAH • BPS KABUPATEN SAMBAS</span>
            </div>
            
            <h1 className="text-2xl md:text-3xl font-extrabold tracking-tight flex items-center gap-2.5">
              <span>Selamat Datang, {currentUser?.nama}!</span>
              {isSuperadmin && <Crown className="w-6 h-6 text-amber-300 flex-shrink-0" title="Superadmin" />}
            </h1>

            <p className="text-xs text-purple-200/90 max-w-2xl leading-relaxed">
              Hak Akses: <strong className="text-amber-300 uppercase tracking-wide">{currentUser?.role}</strong>
              {currentUser?.jabatan ? ` — ${currentUser.jabatan}` : isSuperadmin ? ' — Administrator Sistem' : ''}.
              {isSuperadmin 
                ? ' Anda memiliki wewenang penuh untuk memantau, mengelola, dan mengonfigurasi seluruh data SPJ BPS.' 
                : ' Dasbor menyajikan pemantauan berkas dan penyerapan anggaran sesuai kewenangan Anda.'}
            </p>
          </div>

          {/* Quick Action Buttons */}
          <div className="flex items-center gap-3 shrink-0">
            {canAccess('/pengajuan-spj/baru') && (
              <Link
                to="/pengajuan-spj/baru"
                className="h-10 px-4 rounded-xl bg-amber-400 hover:bg-amber-300 text-purple-950 font-bold text-xs shadow-md hover:shadow-lg transition-all flex items-center gap-2 transform active:scale-95"
              >
                <FilePlus2 className="w-4 h-4" />
                <span>+ Buat SPJ Baru</span>
              </Link>
            )}
            <Link
              to="/pengajuan-spj"
              className="h-10 px-4 rounded-xl bg-white/10 hover:bg-white/20 text-white font-semibold text-xs border border-white/20 backdrop-blur-sm transition-all flex items-center gap-2 hover:border-white/40"
            >
              <FileSpreadsheet className="w-4 h-4 text-purple-200" />
              <span>Daftar SPJ</span>
            </Link>
          </div>
        </div>
      </div>

      {/* 2. RINGKASAN METRIK KUNCI (EXECUTIVE KPI CARDS - 4 KARTU BERSIH) */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* KPI 1: Total Pengajuan SPJ */}
        <Link
          to="/pengajuan-spj"
          className="p-5 rounded-2xl bg-white border border-purple-100 hover:border-purple-300 shadow-xs hover:shadow-md transition-all group"
        >
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-500">Total Pengajuan SPJ</span>
            <div className="w-9 h-9 rounded-xl bg-purple-50 text-purple-700 flex items-center justify-center group-hover:scale-110 transition">
              <FileText className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-3 flex items-baseline gap-2">
            <span className="text-2xl font-black text-slate-900">{total}</span>
            <span className="text-xs font-semibold text-slate-400">Berkas SPJ</span>
          </div>
          <div className="mt-2 text-[11px] text-purple-700 font-medium flex items-center gap-1">
            <span>Seluruh transaksi tahun berjalan</span>
            <ArrowRight className="w-3 h-3 opacity-0 group-hover:opacity-100 group-hover:translate-x-0.5 transition" />
          </div>
        </Link>

        {/* KPI 2: Total Realisasi Anggaran */}
        <div className="p-5 rounded-2xl bg-white border border-purple-100 hover:border-purple-300 shadow-xs hover:shadow-md transition-all group">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-500">Total Anggaran SPJ</span>
            <div className="w-9 h-9 rounded-xl bg-indigo-50 text-indigo-700 flex items-center justify-center group-hover:scale-110 transition">
              <TrendingUp className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-3 flex items-baseline gap-1.5">
            <span className="text-xl font-black text-slate-900 truncate" title={formatIDR(totalNominal)}>
              {formatIDR(totalNominal)}
            </span>
          </div>
          <div className="mt-2 text-[11px] text-slate-400 flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-indigo-500"></span>
            <span>LS & GUP gabungan 6 tim kerja</span>
          </div>
        </div>

        {/* KPI 3: SPJ Cair / Meja Arsip */}
        <Link
          to="/pengajuan-spj?tab=Selesai"
          className="p-5 rounded-2xl bg-white border border-purple-100 hover:border-emerald-300 shadow-xs hover:shadow-md transition-all group"
        >
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-500">Selesai & Cair (Arsip)</span>
            <div className="w-9 h-9 rounded-xl bg-emerald-50 text-emerald-700 flex items-center justify-center group-hover:scale-110 transition">
              <CheckCircle2 className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-3 flex items-baseline gap-2">
            <span className="text-2xl font-black text-emerald-950">{countMejaArsip}</span>
            <span className="text-xs font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200">
              {persenSelesai}% Cair
            </span>
          </div>
          <div className="mt-2 text-[11px] text-emerald-700 font-semibold truncate" title={`Rp ${nominalSelesai.toLocaleString('id-ID')}`}>
            Realisasi: {formatIDR(nominalSelesai)}
          </div>
        </Link>

        {/* KPI 4: Berkas Butuh Tindak Lanjut / Revisi */}
        <Link
          to="/pengajuan-spj?tab=Perlu%20Perbaikan"
          className={`p-5 rounded-2xl border shadow-xs hover:shadow-md transition-all group ${
            perluRevisi > 0 
              ? 'bg-amber-50/50 border-amber-200 hover:border-amber-400' 
              : 'bg-white border-purple-100 hover:border-purple-300'
          }`}
        >
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-500">Perlu Perbaikan / Revisi</span>
            <div className={`w-9 h-9 rounded-xl flex items-center justify-center group-hover:scale-110 transition ${
              perluRevisi > 0 ? 'bg-amber-100 text-amber-700' : 'bg-slate-100 text-slate-500'
            }`}>
              <AlertCircle className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-3 flex items-baseline gap-2">
            <span className={`text-2xl font-black ${perluRevisi > 0 ? 'text-amber-950' : 'text-slate-900'}`}>
              {countMejaPJ}
            </span>
            <span className={`text-xs font-bold px-2 py-0.5 rounded-full ${
              perluRevisi > 0 ? 'text-amber-800 bg-amber-100/70 border border-amber-300' : 'text-slate-500 bg-slate-100'
            }`}>
              Meja PJ Kegiatan
            </span>
          </div>
          <div className="mt-2 text-[11px] text-amber-800 font-medium flex items-center gap-1">
            <span>{perluRevisi > 0 ? 'Membutuhkan perbaikan dokumen' : 'Semua berkas berjalan lancar'}</span>
            <ArrowRight className="w-3 h-3 opacity-0 group-hover:opacity-100 group-hover:translate-x-0.5 transition" />
          </div>
        </Link>
      </div>

      {/* 2B. RINGKASAN EKSEKUTIF POK & RPD HALAMAN III DIPA (SAKTI) */}
      {canAccess('/pok-rpd') && rekapSatker && (
        <div className="p-5 rounded-3xl bg-gradient-to-r from-purple-50/90 via-white to-indigo-50/80 border border-purple-200/80 shadow-xs flex flex-col lg:flex-row lg:items-center justify-between gap-5">
          <div className="flex items-start gap-3.5">
            <div className="w-11 h-11 rounded-2xl bg-gradient-to-br from-purple-700 to-indigo-700 text-white flex items-center justify-center shrink-0 shadow-md">
              <Layers className="w-5 h-5" />
            </div>
            <div>
              <div className="flex flex-wrap items-center gap-2">
                <h3 className="text-sm font-extrabold text-slate-900">
                  Realisasi POK & RPD Halaman III DIPA ({metadata?.tahunAnggaran || 2026})
                </h3>
                <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-extrabold border ${
                  rekapSatker.avgDeviasiIkpa <= 5
                    ? 'bg-emerald-50 text-emerald-800 border-emerald-200'
                    : rekapSatker.avgDeviasiIkpa <= 10
                      ? 'bg-amber-50 text-amber-800 border-amber-200'
                      : 'bg-red-50 text-red-700 border-red-200'
                }`}>
                  Deviasi IKPA: {String(rekapSatker.avgDeviasiIkpa).replace('.', ',')}% ({rekapSatker.statusIkpa})
                </span>
              </div>
              <p className="text-xs text-slate-500 mt-0.5">
                Pagu DIPA: <strong className="text-slate-800">{formatIDR(rekapSatker.totalPagu)}</strong> • Terealisasi & Arsip: <strong className="text-emerald-700">{formatIDR(rekapSatker.totalRealisasi)} ({String(rekapSatker.persenSerapan).replace('.', ',')}%)</strong> • Komitmen Berjalan: <strong className="text-amber-700">{formatIDR(rekapSatker.totalOnProgress)}</strong>
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3 shrink-0">
            <div className="hidden sm:flex items-center gap-2 px-3 py-2 rounded-2xl bg-white border border-purple-100 text-xs">
              <Gauge className="w-4 h-4 text-purple-600" />
              <div>
                <span className="block text-[10px] text-slate-400 font-semibold leading-none">Sisa Anggaran</span>
                <span className="font-extrabold text-purple-950">{formatIDR(rekapSatker.totalSisa)}</span>
              </div>
            </div>
            <Link
              to="/pok-rpd"
              className="px-4 py-2.5 rounded-2xl bg-purple-900 hover:bg-purple-800 text-white font-bold text-xs shadow-sm flex items-center gap-1.5 transition"
            >
              <span>Kelola POK & RPD</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>
        </div>
      )}

      {/* 3. PUSAT GRAFIK & ANALISIS TERPADU */}
      <DashboardCharts transactions={transactions} />

      {/* 4. WORKLIST PRIORITAS: BERKAS DI MEJA PJ KEGIATAN YANG MEMERLUKAN PERBAIKAN */}
      <div className="p-6 rounded-3xl bg-white border border-purple-100 shadow-xs">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-4 mb-4 border-b border-slate-100 gap-3">
          <div>
            <h3 className="text-sm font-extrabold text-slate-900 flex items-center gap-2">
              <span className="p-1 rounded-lg bg-amber-100 text-amber-800">
                <AlertCircle className="w-4 h-4" />
              </span>
              <span>Prioritas Tindak Lanjut: Berkas Revisi di Meja PJ Kegiatan</span>
              <span className="text-xs font-bold text-amber-900 bg-amber-100 px-2.5 py-0.5 rounded-full border border-amber-300">
                {perluRevisi} Berkas
              </span>
            </h3>
            <p className="text-xs text-slate-400 mt-1">
              Daftar berkas SPJ yang dikembalikan untuk dilengkapi atau diperbaiki oleh penanggung jawab kegiatan
            </p>
          </div>

          <Link
            to="/pengajuan-spj?tab=Perlu%20Perbaikan"
            className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-purple-50 hover:bg-purple-100 text-purple-900 font-bold text-xs transition border border-purple-200 self-start sm:self-auto"
          >
            <span>Buka Semua Revisi</span>
            <ExternalLink className="w-3.5 h-3.5" />
          </Link>
        </div>

        {perluRevisi === 0 ? (
          <div className="py-10 text-center space-y-2">
            <div className="w-12 h-12 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center mx-auto">
              <CheckCircle2 className="w-6 h-6" />
            </div>
            <h4 className="font-extrabold text-sm text-slate-800">Tidak Ada Berkas yang Tertunda</h4>
            <p className="text-xs text-slate-400 max-w-md mx-auto">
              Semua berkas SPJ sedang berjalan lancar di meja PPK, Bendahara, atau PPSPM tanpa ada catatan kekurangan.
            </p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs table-fixed">
              <thead className="bg-purple-50/70 text-purple-900 font-bold uppercase text-[10px] tracking-wider">
                <tr>
                  <th className="py-3 px-3.5 w-[16%] rounded-l-xl">No. SPM / SPP</th>
                  <th className="py-3 px-3.5 w-[34%]">Uraian Kegiatan</th>
                  <th className="py-3 px-3.5 w-[18%]">PJ Kegiatan</th>
                  <th className="py-3 px-3.5 w-[20%]">Catatan Kekurangan</th>
                  <th className="py-3 px-3.5 w-[12%] rounded-r-xl text-right">Tindakan</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-purple-50">
                {transactions
                  .filter(t => t.status_dokumen === 'Perlu Perbaikan')
                  .slice(0, 5)
                  .map((t) => (
                    <tr key={t.id} className="hover:bg-purple-50/30 transition">
                      <td className="py-3.5 px-3.5 font-mono font-bold text-purple-950 truncate">
                        {t.no_spm_spp || t.no_pengajuan}
                      </td>
                      <td className="py-3.5 px-3.5 font-semibold text-slate-800 truncate" title={t.uraian_kegiatan}>
                        {t.uraian_kegiatan}
                      </td>
                      <td className="py-3.5 px-3.5 text-slate-600 truncate">
                        <span className="font-medium text-slate-800">{t.pj_nama}</span>
                        <span className="block text-[10px] text-purple-700 font-medium">Tim {t.tim_kerja || '-'}</span>
                      </td>
                      <td className="py-3.5 px-3.5 text-amber-900 font-medium truncate" title={t.catatan_kekurangan}>
                        <div className="inline-flex items-center gap-1 px-2 py-0.5 rounded bg-amber-50 text-amber-900 border border-amber-200 text-[11px] max-w-full truncate">
                          <span className="truncate">{t.catatan_kekurangan || "Belum ada catatan detail"}</span>
                        </div>
                      </td>
                      <td className="py-3.5 px-3.5 text-right">
                        <Link
                          to={`/pengajuan-spj/${t.id}`}
                          className="inline-flex items-center gap-1 px-3 py-1.5 rounded-xl bg-purple-100 hover:bg-purple-200 text-purple-900 font-bold text-xs shadow-2xs transition"
                        >
                          <span>Perbaiki</span>
                          <ArrowRight className="w-3 h-3" />
                        </Link>
                      </td>
                    </tr>
                  ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
