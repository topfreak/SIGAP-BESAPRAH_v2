import React from 'react';
import { Link } from 'react-router-dom';
import { 
  FileSpreadsheet, 
  FilePlus2, 
  CheckCircle2, 
  AlertCircle, 
  Clock, 
  TrendingUp, 
  FileText, 
  ArrowUpRight, 
  Calculator,
  ChevronRight,
  ShieldCheck,
  Building2,
  Users,
  Crown,
  Milestone,
  ArrowRight
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { TIM_KERJA_LIST } from '../lib/seedData';
import Badge from '../components/common/Badge';
import DashboardCharts from '../components/dashboard/DashboardCharts';

export default function DashboardPage() {
  const { currentUser, transactions, canAccess } = useAuth();

  // Statistics
  const total = transactions.length;
  const selesai = transactions.filter(t => t.status_dokumen === 'Selesai').length;
  const perluRevisi = transactions.filter(t => t.status_dokumen === 'Perlu Perbaikan').length;
  const diPPK = transactions.filter(t => t.status_dokumen === 'Di PPK').length;
  const diPPSPM = transactions.filter(t => t.status_dokumen === 'Di PPSPM').length;
  const diBendahara = transactions.filter(t => t.status_dokumen === 'Di Bendahara').length;

  // Meja berkas counts
  const countMejaPPK = transactions.filter(t => t.meja_berkas?.includes('PPK') || t.status_dokumen === 'Di PPK').length;
  const countMejaPPSPM = transactions.filter(t => t.meja_berkas?.includes('PPSPM') || t.status_dokumen === 'Di PPSPM').length;
  const countMejaBendahara = transactions.filter(t => t.meja_berkas?.includes('Bendahara') || t.status_dokumen === 'Di Bendahara').length;
  const countMejaPJ = transactions.filter(t => t.meja_berkas?.includes('PJ') || t.status_dokumen === 'Perlu Perbaikan').length;
  const countMejaArsip = transactions.filter(t => t.meja_berkas?.includes('Arsip') || t.status_dokumen === 'Selesai').length;

  // Personal statistics (based on currentUser)
  const myTransactions = transactions.filter(t => 
    t.pj_kegiatan_nip === currentUser?.nip_baru || 
    t.pengaju_nip === currentUser?.nip_baru ||
    t.pj_nama?.toLowerCase().includes(currentUser?.nama?.split(' ')[0]?.toLowerCase() || '')
  );

  const mySelesai = myTransactions.filter(t => t.status_dokumen === 'Selesai').length;
  const myRevisi = myTransactions.filter(t => t.status_dokumen === 'Perlu Perbaikan').length;
  const myPending = myTransactions.filter(t => t.status_dokumen !== 'Selesai' && t.status_dokumen !== 'Perlu Perbaikan').length;

  const isSuperadmin = currentUser?.role === 'superadmin';

  return (
    <div className="space-y-6 animate-in fade-in duration-150">
      {/* Welcome Banner */}
      <div className="p-6 md:p-8 rounded-3xl bg-gradient-to-r from-[#250b52] via-[#371172] to-[#581c87] text-white shadow-xl relative overflow-hidden">
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-1.5">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/15 text-purple-200 text-xs font-semibold backdrop-blur-sm">
              <ShieldCheck className="w-3.5 h-3.5 text-amber-300" />
              <span>SIGAP BESAPRAH • BPS Kabupaten Sambas</span>
            </div>
            <h1 className="text-2xl md:text-3xl font-extrabold tracking-tight flex items-center gap-2">
              <span>Selamat Datang, {currentUser?.nama}!</span>
              {isSuperadmin && <Crown className="w-6 h-6 text-amber-300" title="Superadmin" />}
            </h1>
            <p className="text-xs text-purple-200 max-w-xl">
              Peran: <strong className="text-amber-300 uppercase">{currentUser?.role}</strong>{currentUser?.jabatan ? ` (${currentUser.jabatan})` : isSuperadmin ? ' (Administrator Sistem)' : ''}. 
              {isSuperadmin 
                ? ' Anda memiliki akses SUPERADMIN penuh ke seluruh data, modul dan pengaturan sistem.' 
                : ' Akses menu dibatasi sesuai kewenangan tugas jabatan Anda.'}
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            {canAccess('/pengajuan-spj/baru') && (
              <Link
                to="/pengajuan-spj/baru"
                className="px-4 py-2.5 rounded-xl bg-amber-400 hover:bg-amber-300 text-purple-950 font-bold text-xs shadow-md transition flex items-center gap-2 transform active:scale-95"
              >
                <FilePlus2 className="w-4 h-4" />
                <span>+ Buat SPJ Baru</span>
              </Link>
            )}
            <Link
              to="/pengajuan-spj"
              className="px-4 py-2.5 rounded-xl bg-white/15 hover:bg-white/25 text-white font-semibold text-xs border border-white/20 transition flex items-center gap-2"
            >
              <FileSpreadsheet className="w-4 h-4" />
              <span>Daftar SPJ</span>
            </Link>
          </div>
        </div>
      </div>

      {/* BANNER ALUR RESMI SPJ */}
      <div className="p-4 md:p-5 rounded-2xl bg-white border border-purple-100 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-purple-100 text-purple-800 flex items-center justify-center flex-shrink-0 font-bold">
            <Milestone className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-xs font-bold text-slate-900 uppercase tracking-wide flex items-center gap-2">
              <span>Alur Pengajuan SPJ BPS Kabupaten Sambas</span>
              <span className="text-[10px] px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 font-extrabold">Resmi</span>
            </h3>
            <p className="text-xs text-slate-500 mt-0.5">
              PJ Kegiatan &rarr; PPK &rarr; Bendahara &rarr; PPSPM &rarr; Arsip Keuangan (Lunas)
            </p>
          </div>
        </div>
        <Link
          to="/panduan-alur"
          className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-purple-50 hover:bg-purple-100 text-purple-900 text-xs font-bold transition border border-purple-200 self-start md:self-auto"
        >
          <span>Buka Panduan Alur Lengkap</span>
          <ArrowRight className="w-3.5 h-3.5" />
        </Link>
      </div>

      {/* WIDGET POSISI MEJA BERKAS SAAT INI (BERDASARKAN ALUR TERTIB TAHAPAN) */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <h2 className="text-sm font-extrabold text-slate-800 uppercase tracking-wider flex items-center gap-2">
            <span>📍 Posisi Berkas SPJ Saat Ini (Urutan Alur: PJ &rarr; PPK &rarr; Bendahara &rarr; PPSPM &rarr; Arsip)</span>
          </h2>
          <span className="text-xs text-slate-400">Total {total} Berkas Aktif</span>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3">
          {/* 1. Meja PJ Kegiatan (Revisi & Draft) */}
          <Link
            to="/pengajuan-spj?tab=Perlu%20Perbaikan"
            className="p-4 rounded-2xl bg-amber-50/70 border border-amber-300 hover:border-amber-500 shadow-xs hover:shadow-md transition group"
          >
            <div className="flex items-center justify-between">
              <span className="text-xl animate-pulse">📝</span>
              <span className="text-2xl font-black text-amber-900 group-hover:scale-110 transition">{countMejaPJ}</span>
            </div>
            <div className="mt-2">
              <span className="text-[10px] font-bold text-amber-800 uppercase tracking-wider">Tahap 1</span>
              <h3 className="font-extrabold text-xs text-amber-950">Meja PJ Kegiatan</h3>
            </div>
            <p className="text-[10px] text-amber-800 font-semibold mt-0.5">Penyusunan & Perbaikan</p>
          </Link>

          {/* 2. Meja PPK */}
          <Link
            to="/pengajuan-spj?tab=Di%20PPK"
            className="p-4 rounded-2xl bg-white border border-purple-200 hover:border-purple-500 shadow-xs hover:shadow-md transition group"
          >
            <div className="flex items-center justify-between">
              <span className="text-xl">🗄️</span>
              <span className="text-2xl font-black text-purple-900 group-hover:scale-110 transition">{countMejaPPK}</span>
            </div>
            <div className="mt-2">
              <span className="text-[10px] font-bold text-purple-600 uppercase tracking-wider">Tahap 2</span>
              <h3 className="font-extrabold text-xs text-slate-900">Meja PPK</h3>
            </div>
            <p className="text-[10px] text-slate-400 mt-0.5">Peninjauan Komitmen & SPP</p>
          </Link>

          {/* 3. Meja Bendahara */}
          <Link
            to="/pengajuan-spj?tab=Di%20Bendahara"
            className="p-4 rounded-2xl bg-white border border-blue-200 hover:border-blue-500 shadow-xs hover:shadow-md transition group"
          >
            <div className="flex items-center justify-between">
              <span className="text-xl">💼</span>
              <span className="text-2xl font-black text-blue-900 group-hover:scale-110 transition">{countMejaBendahara}</span>
            </div>
            <div className="mt-2">
              <span className="text-[10px] font-bold text-blue-600 uppercase tracking-wider">Tahap 3</span>
              <h3 className="font-extrabold text-xs text-slate-900">Meja Bendahara</h3>
            </div>
            <p className="text-[10px] text-slate-400 mt-0.5">Verifikasi Kuitansi, Pajak & Kas</p>
          </Link>

          {/* 4. Meja PPSPM */}
          <Link
            to="/pengajuan-spj?tab=Di%20PPSPM"
            className="p-4 rounded-2xl bg-white border border-indigo-200 hover:border-indigo-500 shadow-xs hover:shadow-md transition group"
          >
            <div className="flex items-center justify-between">
              <span className="text-xl">⚖️</span>
              <span className="text-2xl font-black text-indigo-900 group-hover:scale-110 transition">{countMejaPPSPM}</span>
            </div>
            <div className="mt-2">
              <span className="text-[10px] font-bold text-indigo-600 uppercase tracking-wider">Tahap 4</span>
              <h3 className="font-extrabold text-xs text-slate-900">Meja PPSPM</h3>
            </div>
            <p className="text-[10px] text-slate-400 mt-0.5">Pengujian Formal & SPM</p>
          </Link>

          {/* 5. Meja Arsip (Cair) */}
          <Link
            to="/pengajuan-spj?tab=Selesai"
            className="p-4 rounded-2xl bg-emerald-50/70 border border-emerald-300 hover:border-emerald-500 shadow-xs hover:shadow-md transition group"
          >
            <div className="flex items-center justify-between">
              <span className="text-xl">🏛️</span>
              <span className="text-2xl font-black text-emerald-900 group-hover:scale-110 transition">{countMejaArsip}</span>
            </div>
            <div className="mt-2">
              <span className="text-[10px] font-bold text-emerald-700 uppercase tracking-wider">Tahap 5</span>
              <h3 className="font-extrabold text-xs text-emerald-950">Meja Arsip</h3>
            </div>
            <p className="text-[10px] text-emerald-800 font-semibold mt-0.5">Lunas / SP2D Selesai</p>
          </Link>
        </div>
      </div>

      {/* Persentase Capaian SPJ per Tim / Fungsi */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <h2 className="text-sm font-bold text-slate-800 uppercase tracking-wider flex items-center gap-2">
            <Building2 className="w-4 h-4 text-purple-700" />
            <span>Penyelesaian SPJ Berdasarkan Tim Kerja</span>
          </h2>
          <Link to="/pengajuan-spj" className="text-xs font-bold text-purple-700 hover:underline flex items-center gap-1">
            <span>Lihat Semua SPJ</span>
            <ChevronRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
          {TIM_KERJA_LIST.map((tim) => (
            <div 
              key={tim.id}
              className="p-4 rounded-2xl bg-white border border-purple-100 shadow-xs hover:border-purple-300 transition"
            >
              <p className="text-[11px] font-semibold text-slate-500 truncate">{tim.nama}</p>
              <div className="mt-2 flex items-baseline justify-between">
                <span className="text-2xl font-extrabold text-purple-900">{tim.persenSelesai}%</span>
                <span className="text-[10px] text-emerald-600 font-bold bg-emerald-50 px-1.5 py-0.5 rounded">Selesai</span>
              </div>
              <div className="w-full h-1.5 bg-purple-50 rounded-full mt-2.5 overflow-hidden">
                <div 
                  className="h-full bg-gradient-to-r from-purple-600 to-indigo-600 rounded-full"
                  style={{ width: `${tim.persenSelesai}%` }}
                ></div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Visualisasi Grafik Interaktif Realisasi SPJ */}
      <DashboardCharts transactions={transactions} />

      {/* Dokumen Perlu Perbaikan Segera */}
      <div className="p-6 rounded-3xl bg-white border border-purple-100 shadow-xs">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h3 className="text-sm font-extrabold text-slate-900 flex items-center gap-2">
              <AlertCircle className="w-4 h-4 text-amber-500" />
              <span>Berkas di Meja PJ Kegiatan yang Membutuhkan Revisi ({perluRevisi})</span>
            </h3>
            <p className="text-xs text-slate-400">Segera lengkapi berkas agar proses pencairan tidak terhambat</p>
          </div>
          <Link to="/pengajuan-spj?tab=Perlu%20Perbaikan" className="text-xs font-bold text-purple-700 hover:underline">
            Lihat Semua
          </Link>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs table-fixed">
            <thead className="bg-purple-50/60 text-purple-900 font-bold uppercase text-[10px]">
              <tr>
                <th className="py-2.5 px-3 w-[15%] rounded-l-lg">No. SPM</th>
                <th className="py-2.5 px-3 w-[35%]">Uraian Kegiatan</th>
                <th className="py-2.5 px-3 w-[20%]">PJ Kegiatan</th>
                <th className="py-2.5 px-3 w-[20%]">Catatan Kekurangan</th>
                <th className="py-2.5 px-3 w-[10%] rounded-r-lg text-right">Aksi</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-purple-50">
              {transactions.filter(t => t.status_dokumen === 'Perlu Perbaikan').slice(0, 5).map((t) => (
                <tr key={t.id} className="hover:bg-purple-50/30 transition">
                  <td className="py-3 px-3 font-mono font-bold text-purple-900 truncate">{t.no_spm_spp || t.no_pengajuan}</td>
                  <td className="py-3 px-3 font-semibold text-slate-800 truncate" title={t.uraian_kegiatan}>
                    {t.uraian_kegiatan}
                  </td>
                  <td className="py-3 px-3 text-slate-600 truncate">{t.pj_nama}</td>
                  <td className="py-3 px-3 text-amber-900 font-semibold truncate" title={t.catatan_kekurangan}>
                    {t.catatan_kekurangan || "Belum ada catatan"}
                  </td>
                  <td className="py-3 px-3 text-right">
                    <Link
                      to={`/pengajuan-spj/${t.id}`}
                      className="px-2.5 py-1 rounded-lg bg-purple-100 hover:bg-purple-200 text-purple-900 font-bold text-[11px]"
                    >
                      Perbaiki
                    </Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
