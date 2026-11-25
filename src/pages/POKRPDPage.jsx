import React, { useState, useMemo } from 'react';
import { 
  FileSpreadsheet, 
  UploadCloud, 
  Download, 
  Search, 
  ChevronDown, 
  ChevronRight, 
  TrendingUp, 
  CheckCircle2, 
  AlertTriangle, 
  Calendar, 
  SlidersHorizontal, 
  RotateCcw, 
  Edit3, 
  X, 
  FileText,
  Layers,
  ShieldCheck,
  Loader2,
  Coins
} from 'lucide-react';
import { usePok } from '../context/PokContext';
import { useAuth } from '../context/AuthContext';
import { NAMA_BULAN, NAMA_BULAN_SINGKAT } from '../lib/pokRpdData';
import { parseRkkExcel, parseRkkPdf, exportRkkRpdToExcel } from '../lib/rkkSaktiParser';

export default function POKRPDPage() {
  const { currentUser } = useAuth();
  const { 
    metadata, 
    pokAccounts, 
    rekapSatker, 
    applyImportedPok, 
    updateRpdSchedule, 
    resetToDefaultPok 
  } = usePok();

  // Filter states
  const [searchQuery, setSearchQuery] = useState('');
  const [filterProgram, setFilterProgram] = useState('Semua');
  const [filterTim, setFilterTim] = useState('Semua');
  const [filterKelompok, setFilterKelompok] = useState('Semua'); // 'Semua', '51', '52', '53'
  const [expandedIds, setExpandedIds] = useState({});

  // Modal states
  const [showImportModal, setShowImportModal] = useState(false);
  const [importLoading, setImportLoading] = useState(false);
  const [importError, setImportError] = useState('');
  const [importPreview, setImportPreview] = useState(null);

  const [editingAccount, setEditingAccount] = useState(null);
  const [editRpdValues, setEditRpdValues] = useState(new Array(12).fill(0));
  const [editPaguValue, setEditPaguValue] = useState(0);

  const canEditRpd = ['superadmin', 'kpa', 'ppk', 'bendahara', 'pj_kegiatan'].includes(currentUser?.role);

  const formatIDR = (val) => {
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      maximumFractionDigits: 0
    }).format(val || 0);
  };

  const formatCompactIDR = (val) => {
    if (!val) return '-';
    return Number(val).toLocaleString('id-ID');
  };

  // Filter akun POK
  const filteredAccounts = useMemo(() => {
    return pokAccounts.filter(acc => {
      if (filterProgram !== 'Semua' && acc.programKode !== filterProgram) return false;
      if (filterTim !== 'Semua' && acc.timKerja !== filterTim) return false;
      if (filterKelompok !== 'Semua' && !acc.kodeAkun.startsWith(filterKelompok)) return false;

      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        const itemMatch = acc.items?.some(it => it.deskripsi.toLowerCase().includes(q));
        return (
          acc.kodeAkun.toLowerCase().includes(q) ||
          acc.namaAkun.toLowerCase().includes(q) ||
          acc.kegiatanNama.toLowerCase().includes(q) ||
          acc.outputNama.toLowerCase().includes(q) ||
          acc.outputKode.toLowerCase().includes(q) ||
          itemMatch
        );
      }
      return true;
    });
  }, [pokAccounts, filterProgram, filterTim, filterKelompok, searchQuery]);

  const toggleExpand = (id) => {
    setExpandedIds(prev => ({ ...prev, [id]: !prev[id] }));
  };

  // Handle File Upload Import (XLSX atau PDF RKK SAKTI)
  const handleFileUpload = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setImportLoading(true);
    setImportError('');
    setImportPreview(null);

    try {
      const ext = file.name.split('.').pop().toLowerCase();
      let parsed = null;

      if (ext === 'pdf') {
        parsed = await parseRkkPdf(file);
      } else if (['xlsx', 'xls', 'csv'].includes(ext)) {
        parsed = await parseRkkExcel(file);
      } else {
        throw new Error('Format file tidak didukung. Harap unggah file .xlsx, .xls, .csv, atau .pdf RKK dari SAKTI.');
      }

      if (!parsed.accounts || parsed.accounts.length === 0) {
        throw new Error('Tidak ditemukan baris kode akun belanja (5xxxxx) yang valid di dalam dokumen ini.');
      }

      setImportPreview({
        fileName: file.name,
        fileType: ext.toUpperCase(),
        ...parsed
      });
    } catch (err) {
      console.error('Import error:', err);
      setImportError(err.message || 'Gagal membaca file dokumen RKK SAKTI.');
    } finally {
      setImportLoading(false);
    }
  };

  const confirmImport = () => {
    if (!importPreview) return;
    applyImportedPok(
      importPreview.accounts,
      importPreview.metadata,
      Boolean(importPreview.summary?.hasMonthlyRpd)
    );
    setShowImportModal(false);
    setImportPreview(null);
  };

  // Handle Buka Modal Geser RPD / Ubah Pagu
  const openShiftModal = (acc) => {
    setEditingAccount(acc);
    setEditRpdValues([...(acc.rpdBulanan || new Array(12).fill(0))]);
    setEditPaguValue(acc.pagu || 0);
  };

  const handleRpdMonthChange = (idx, rawVal) => {
    const num = parseInt(String(rawVal).replace(/[^0-9]/g, ''), 10) || 0;
    const next = [...editRpdValues];
    next[idx] = num;
    setEditRpdValues(next);
  };

  const totalEditRpd = editRpdValues.reduce((a, b) => a + b, 0);
  const rpdBalanceDiff = Number(editPaguValue) - totalEditRpd;

  const autoBalanceDecember = () => {
    const sumJanToNov = editRpdValues.slice(0, 11).reduce((a, b) => a + b, 0);
    const remaining = Math.max(0, Number(editPaguValue) - sumJanToNov);
    const next = [...editRpdValues];
    next[11] = remaining;
    setEditRpdValues(next);
  };

  const saveRpdUpdate = () => {
    if (!editingAccount) return;
    updateRpdSchedule(editingAccount.id, editRpdValues, Number(editPaguValue));
    setEditingAccount(null);
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-200">
      {/* 1. HEADER & ACTION BAR */}
      <div className="p-6 md:p-7 rounded-3xl bg-gradient-to-r from-[#22094c] via-[#35106e] to-[#551884] text-white shadow-xl flex flex-col lg:flex-row lg:items-center justify-between gap-6 relative overflow-hidden">
        <div className="absolute -right-12 -top-12 w-60 h-60 rounded-full bg-white/5 blur-2xl pointer-events-none" />
        
        <div className="space-y-1.5 relative z-10">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/15 text-purple-200 text-xs font-semibold backdrop-blur-sm border border-white/10">
            <ShieldCheck className="w-3.5 h-3.5 text-amber-300" />
            <span>SATKER ({metadata.satker_kode}) {metadata.satker_nama} • T.A. {metadata.tahun_anggaran}</span>
          </div>
          <h1 className="text-xl md:text-2xl font-black tracking-tight">
            POK & Rencana Penarikan Dana (RPD) Terpadu
          </h1>
          <p className="text-xs text-purple-200/90 max-w-2xl">
            Sumber aktif: <strong className="text-amber-300">{metadata.sumber_import}</strong>. 
            Setiap SPJ yang cair di Meja Arsip otomatis menambah realisasi RPD dan mengurangi sisa pagu akun.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2.5 relative z-10 flex-shrink-0">
          {canEditRpd && (
            <button
              onClick={() => {
                setImportError('');
                setImportPreview(null);
                setShowImportModal(true);
              }}
              className="h-10 px-4 rounded-xl bg-amber-400 hover:bg-amber-300 text-purple-950 font-extrabold text-xs shadow-md transition flex items-center gap-2"
            >
              <UploadCloud className="w-4 h-4" />
              <span>Import RKK SAKTI (PDF / XLSX)</span>
            </button>
          )}

          <button
            onClick={() => exportRkkRpdToExcel(pokAccounts, metadata)}
            className="h-10 px-4 rounded-xl bg-white/15 hover:bg-white/25 text-white font-bold text-xs border border-white/20 backdrop-blur-sm transition flex items-center gap-2"
          >
            <Download className="w-4 h-4 text-emerald-300" />
            <span>Download Excel RPD</span>
          </button>

          {currentUser?.role === 'superadmin' && (
            <button
              onClick={() => {
                if (window.confirm('Kembalikan data POK & RPD ke kondisi baseline resmi T.A. 2026?')) {
                  resetToDefaultPok();
                }
              }}
              className="h-10 px-3 rounded-xl bg-white/10 hover:bg-rose-500/80 text-purple-100 hover:text-white font-semibold text-xs border border-white/15 transition flex items-center gap-1.5"
              title="Reset ke data awal"
            >
              <RotateCcw className="w-3.5 h-3.5" />
            </button>
          )}
        </div>
      </div>

      {/* 2. KPI SUMMARY CARDS (4 KARTU UTAMA + IKPA) */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="p-5 rounded-2xl bg-white border border-purple-100 shadow-xs">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-bold uppercase tracking-wider text-slate-500">Total Pagu POK Aktif</span>
            <div className="w-8 h-8 rounded-xl bg-purple-50 text-purple-700 flex items-center justify-center">
              <Layers className="w-4 h-4" />
            </div>
          </div>
          <p className="mt-2.5 text-lg font-black text-slate-900 font-mono truncate" title={formatIDR(rekapSatker.totalPagu)}>
            {formatIDR(rekapSatker.totalPagu)}
          </p>
          <p className="mt-1 text-[11px] text-slate-400">
            Total {pokAccounts.length} akun belanja terpantau
          </p>
        </div>

        <div className="p-5 rounded-2xl bg-white border border-purple-100 shadow-xs">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-bold uppercase tracking-wider text-slate-500">Realisasi SP2D Cair</span>
            <div className="w-8 h-8 rounded-xl bg-emerald-50 text-emerald-700 flex items-center justify-center">
              <CheckCircle2 className="w-4 h-4" />
            </div>
          </div>
          <p className="mt-2.5 text-lg font-black text-emerald-900 font-mono truncate" title={formatIDR(rekapSatker.totalRealisasi)}>
            {formatIDR(rekapSatker.totalRealisasi)}
          </p>
          <div className="mt-1.5 flex items-center gap-2">
            <span className="px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 text-[10px] font-extrabold">
              {rekapSatker.persenSerapan}% Terserap
            </span>
          </div>
        </div>

        <div className="p-5 rounded-2xl bg-white border border-purple-100 shadow-xs">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-bold uppercase tracking-wider text-slate-500">Sisa Anggaran Bebas</span>
            <div className="w-8 h-8 rounded-xl bg-indigo-50 text-indigo-700 flex items-center justify-center">
              <Coins className="w-4 h-4" />
            </div>
          </div>
          <p className="mt-2.5 text-lg font-black text-slate-900 font-mono truncate" title={formatIDR(rekapSatker.totalSisa)}>
            {formatIDR(rekapSatker.totalSisa)}
          </p>
          <p className="mt-1 text-[11px] text-indigo-700 font-medium">
            Antrean On-Progress SPJ: {formatIDR(rekapSatker.totalOnProgress)}
          </p>
        </div>

        <div className={`p-5 rounded-2xl border shadow-xs ${
          rekapSatker.avgDeviasiIkpa <= 5 
            ? 'bg-emerald-50/40 border-emerald-200' 
            : rekapSatker.avgDeviasiIkpa <= 10 
            ? 'bg-amber-50/40 border-amber-200' 
            : 'bg-rose-50/40 border-rose-200'
        }`}>
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-bold uppercase tracking-wider text-slate-600">Deviasi Hal. III DIPA (IKPA)</span>
            <div className={`w-8 h-8 rounded-xl flex items-center justify-center ${
              rekapSatker.avgDeviasiIkpa <= 5 ? 'bg-emerald-100 text-emerald-700' : 'bg-amber-100 text-amber-800'
            }`}>
              <TrendingUp className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-2.5 flex items-baseline gap-2">
            <span className="text-2xl font-black text-slate-900 font-mono">
              {rekapSatker.avgDeviasiIkpa}%
            </span>
            <span className={`text-[10px] font-extrabold px-2 py-0.5 rounded-full ${
              rekapSatker.avgDeviasiIkpa <= 5 
                ? 'bg-emerald-100 text-emerald-800' 
                : rekapSatker.avgDeviasiIkpa <= 10 
                ? 'bg-amber-100 text-amber-900' 
                : 'bg-rose-100 text-rose-800'
            }`}>
              {rekapSatker.statusIkpa}
            </span>
          </div>
          <p className="mt-1 text-[10px] text-slate-500">
            Target deviasi Kemenkeu ≤ 5% per bulan
          </p>
        </div>
      </div>

      {/* 3. REKAPITULASI TRIWULANAN (TW I - TW IV) */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
        {rekapSatker.triwulan.map((tw, idx) => (
          <div key={idx} className="p-4 rounded-2xl bg-white border border-purple-100 shadow-2xs space-y-2">
            <div className="flex items-center justify-between">
              <div>
                <span className="text-xs font-extrabold text-purple-950">{tw.label}</span>
                <span className="text-[10px] text-slate-400 ml-1.5">({tw.periode})</span>
              </div>
              <span className={`text-[10px] font-bold px-2 py-0.5 rounded-md ${
                tw.deviasi <= 5 ? 'bg-emerald-50 text-emerald-700 border border-emerald-200' : 'bg-amber-50 text-amber-800 border border-amber-200'
              }`}>
                Dev: {tw.deviasi}%
              </span>
            </div>

            <div className="text-[11px] space-y-1 font-mono">
              <div className="flex justify-between text-slate-500">
                <span>RPD:</span>
                <span className="font-semibold text-slate-800">{formatCompactIDR(tw.target)}</span>
              </div>
              <div className="flex justify-between text-slate-500">
                <span>Realisasi:</span>
                <span className="font-bold text-emerald-700">{formatCompactIDR(tw.realisasi)}</span>
              </div>
            </div>

            <div className="w-full h-1.5 bg-slate-100 rounded-full overflow-hidden">
              <div 
                className="h-full bg-gradient-to-r from-purple-600 to-emerald-500 rounded-full"
                style={{ width: `${Math.min(100, tw.persenReal)}%` }}
              />
            </div>
          </div>
        ))}
      </div>

      {/* 4. FILTER & SEARCH BAR */}
      <div className="p-4 rounded-2xl bg-white border border-purple-100 shadow-xs flex flex-wrap items-center gap-3">
        <div className="relative flex-1 min-w-[240px]">
          <Search className="w-4 h-4 text-purple-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Cari kode akun (521213), nama kegiatan (Susenas, SE2026), atau rincian..."
            className="w-full pl-10 pr-4 py-2 bg-purple-50/40 border border-purple-150 rounded-xl text-xs focus:outline-none focus:ring-2 focus:ring-purple-400 focus:bg-white transition"
          />
        </div>

        <select
          value={filterProgram}
          onChange={(e) => setFilterProgram(e.target.value)}
          className="px-3 py-2 bg-purple-50/50 border border-purple-150 rounded-xl text-xs font-semibold text-slate-700 focus:outline-none"
        >
          <option value="Semua">Semua Program</option>
          <option value="054.01.GG">054.01.GG (Informasi Statistik)</option>
          <option value="054.01.WA">054.01.WA (Dukungan Manajemen)</option>
        </select>

        <select
          value={filterTim}
          onChange={(e) => setFilterTim(e.target.value)}
          className="px-3 py-2 bg-purple-50/50 border border-purple-150 rounded-xl text-xs font-semibold text-slate-700 focus:outline-none"
        >
          <option value="Semua">Semua Tim Kerja</option>
          <option value="Umum">Bagian Umum</option>
          <option value="Sosial">Statistik Sosial</option>
          <option value="Produksi">Statistik Produksi</option>
          <option value="Distribusi">Statistik Distribusi</option>
          <option value="Nerwilis">Nerwilis</option>
          <option value="IPDS">IPDS</option>
        </select>

        <select
          value={filterKelompok}
          onChange={(e) => setFilterKelompok(e.target.value)}
          className="px-3 py-2 bg-purple-50/50 border border-purple-150 rounded-xl text-xs font-semibold text-slate-700 focus:outline-none"
        >
          <option value="Semua">Semua Jenis Belanja</option>
          <option value="51">51 — Belanja Pegawai</option>
          <option value="52">52 — Belanja Barang</option>
          <option value="53">53 — Belanja Modal</option>
        </select>
      </div>

      {/* 5. TABEL MATRIKS POK & RPD 12 BULAN (JANUARI - DESEMBER) */}
      <div className="bg-white rounded-3xl border border-purple-100 shadow-xs overflow-hidden">
        <div className="p-4 bg-purple-50/60 border-b border-purple-100 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <FileSpreadsheet className="w-4 h-4 text-purple-700" />
            <span className="text-xs font-extrabold text-purple-950 uppercase tracking-wider">
              Matriks POK & Target RPD vs Realisasi (Januari – Desember {metadata.tahun_anggaran})
            </span>
          </div>
          <span className="text-[11px] text-slate-500">
            Menampilkan <strong>{filteredAccounts.length}</strong> akun • Geser ke kanan untuk lihat 12 bulan &rarr;
          </span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="bg-slate-100/90 text-slate-700 font-bold text-[10px] uppercase border-b border-slate-200">
                <th rowSpan="2" className="py-3 px-3 min-w-[280px] sticky left-0 bg-slate-100 z-10 border-r border-slate-200">
                  Kegiatan / Output / Akun Belanja
                </th>
                <th rowSpan="2" className="py-3 px-2.5 text-right min-w-[115px] border-r border-slate-200">
                  Pagu Revisi
                </th>
                <th rowSpan="2" className="py-3 px-2.5 text-right min-w-[115px] border-r border-slate-200">
                  Realisasi (%)
                </th>
                <th rowSpan="2" className="py-3 px-2.5 text-right min-w-[115px] border-r border-slate-200">
                  Sisa Pagu
                </th>
                <th rowSpan="2" className="py-3 px-2 text-center min-w-[85px] border-r border-slate-200">
                  Aksi
                </th>
                {NAMA_BULAN_SINGKAT.map((bln, i) => (
                  <th key={i} colSpan="2" className="py-1.5 px-2 text-center border-r border-slate-200 bg-purple-50/80 text-purple-950">
                    {bln}
                  </th>
                ))}
              </tr>
              <tr className="bg-slate-50 text-[9px] font-bold uppercase text-slate-500 border-b border-slate-200">
                {NAMA_BULAN_SINGKAT.map((_, i) => (
                  <React.Fragment key={i}>
                    <th className="py-1 px-2 text-right min-w-[85px] border-r border-slate-100">RPD</th>
                    <th className="py-1 px-2 text-right min-w-[85px] border-r border-slate-200 text-emerald-700">Real.</th>
                  </React.Fragment>
                ))}
              </tr>
            </thead>

            <tbody className="divide-y divide-purple-50">
              {filteredAccounts.map((acc) => {
                const isExpanded = Boolean(expandedIds[acc.id]);
                const hasItems = acc.items && acc.items.length > 0;
                const rpdSum = acc.rpdBulanan?.reduce((a, b) => a + b, 0) || 0;
                const rpdBalanced = rpdSum === acc.pagu;

                return (
                  <React.Fragment key={acc.id}>
                    <tr className="hover:bg-purple-50/30 transition group">
                      {/* Sticky Left Info Column */}
                      <td className="py-3 px-3 sticky left-0 bg-white group-hover:bg-[#FAF7FF] z-10 border-r border-slate-200 align-top">
                        <div className="flex items-start gap-2">
                          {hasItems ? (
                            <button
                              onClick={() => toggleExpand(acc.id)}
                              className="p-0.5 mt-0.5 rounded hover:bg-purple-100 text-purple-700 flex-shrink-0"
                              title="Lihat rincian item POK"
                            >
                              {isExpanded ? <ChevronDown className="w-4 h-4" /> : <ChevronRight className="w-4 h-4" />}
                            </button>
                          ) : (
                            <span className="w-5 flex-shrink-0" />
                          )}

                          <div className="min-w-0">
                            <div className="flex items-center gap-1.5 flex-wrap">
                              <span className="font-mono font-extrabold text-[11px] px-1.5 py-0.2 rounded bg-purple-100 text-purple-900">
                                {acc.kodeAkun}
                              </span>
                              <span className="text-[10px] font-bold px-1.5 py-0.2 rounded bg-slate-100 text-slate-700">
                                Tim {acc.timKerja}
                              </span>
                              <span className="text-[10px] font-mono text-slate-400">
                                {acc.outputKode} • Komp.{acc.komponenKode}
                              </span>
                            </div>
                            <p className="font-bold text-slate-900 text-xs mt-1 leading-snug">
                              {acc.namaAkun}
                            </p>
                            <p className="text-[10px] text-slate-500 truncate max-w-[240px]" title={acc.outputNama}>
                              {acc.outputNama || acc.kegiatanNama}
                            </p>
                          </div>
                        </div>
                      </td>

                      {/* Pagu Revisi */}
                      <td className="py-3 px-2.5 text-right font-mono font-bold text-slate-900 border-r border-slate-100 align-top">
                        {formatCompactIDR(acc.pagu)}
                        {!rpdBalanced && (
                          <span className="block text-[9px] text-amber-600 font-sans font-semibold mt-0.5" title={`Total RPD: ${formatCompactIDR(rpdSum)}`}>
                            *RPD ≠ Pagu
                          </span>
                        )}
                      </td>

                      {/* Total Realisasi */}
                      <td className="py-3 px-2.5 text-right font-mono border-r border-slate-100 align-top">
                        <span className="font-bold text-emerald-700 block">
                          {formatCompactIDR(acc.totalRealisasi)}
                        </span>
                        <span className="text-[10px] text-slate-400 font-sans">
                          {acc.persenSerapan}%
                        </span>
                        {acc.komitmenOnProgress > 0 && (
                          <span className="block text-[9px] text-amber-700 font-sans font-semibold">
                            +{formatCompactIDR(acc.komitmenOnProgress)} antre
                          </span>
                        )}
                      </td>

                      {/* Sisa Anggaran */}
                      <td className="py-3 px-2.5 text-right font-mono font-bold border-r border-slate-100 align-top">
                        <span className={acc.sisaAnggaran < 0 ? 'text-rose-600' : 'text-slate-700'}>
                          {formatCompactIDR(acc.sisaAnggaran)}
                        </span>
                      </td>

                      {/* Aksi Geser RPD */}
                      <td className="py-3 px-2 text-center border-r border-slate-200 align-top">
                        {canEditRpd && (
                          <button
                            onClick={() => openShiftModal(acc)}
                            className="px-2 py-1 rounded-lg bg-purple-50 hover:bg-purple-100 text-purple-800 border border-purple-200 text-[10px] font-bold inline-flex items-center gap-1 transition"
                            title="Sesuaikan / Geser Jadwal RPD atau Revisi Pagu"
                          >
                            <Edit3 className="w-3 h-3" />
                            <span>RPD</span>
                          </button>
                        )}
                      </td>

                      {/* 24 Sub-Kolom Bulanan (RPD | Realisasi Jan-Des) */}
                      {NAMA_BULAN_SINGKAT.map((_, mIdx) => {
                        const valRpd = acc.rpdBulanan?.[mIdx] || 0;
                        const valReal = acc.realisasiGabungan?.[mIdx] || 0;
                        const isOverOrMatch = valRpd > 0 && valReal >= valRpd;

                        return (
                          <React.Fragment key={mIdx}>
                            <td className="py-3 px-2 text-right font-mono text-[11px] text-slate-600 border-r border-slate-50 align-top">
                              {valRpd > 0 ? formatCompactIDR(valRpd) : <span className="text-slate-300">-</span>}
                            </td>
                            <td className={`py-3 px-2 text-right font-mono text-[11px] border-r border-slate-200 align-top ${
                              valReal > 0 ? (isOverOrMatch ? 'text-emerald-700 font-bold bg-emerald-50/30' : 'text-blue-700 font-bold') : 'text-slate-300'
                            }`}>
                              {valReal > 0 ? formatCompactIDR(valReal) : '-'}
                            </td>
                          </React.Fragment>
                        );
                      })}
                    </tr>

                    {/* Expanded Sub-Row: Rincian Item POK (Volume, Satuan, Harga Satuan) */}
                    {isExpanded && hasItems && (
                      <tr className="bg-purple-50/20">
                        <td colSpan={29} className="py-2.5 px-8 border-b border-purple-100">
                          <div className="bg-white rounded-2xl border border-purple-100 p-3 shadow-2xs max-w-4xl">
                            <p className="text-[10px] font-extrabold uppercase text-purple-800 tracking-wider mb-2">
                              Rincian Item Belanja POK ({acc.kodeAkun} — {acc.komponenNama})
                            </p>
                            <table className="w-full text-[11px]">
                              <thead>
                                <tr className="text-slate-400 border-b border-slate-100 text-[10px]">
                                  <th className="py-1 text-left">Uraian Detil Item</th>
                                  <th className="py-1 text-right w-24">Volume</th>
                                  <th className="py-1 text-right w-32">Harga Satuan</th>
                                  <th className="py-1 text-right w-32">Jumlah Pagu</th>
                                </tr>
                              </thead>
                              <tbody className="divide-y divide-slate-50">
                                {acc.items.map((it, idx) => (
                                  <tr key={idx}>
                                    <td className="py-1.5 text-slate-700 font-medium">• {it.deskripsi}</td>
                                    <td className="py-1.5 text-right font-mono text-slate-600">{it.volume} {it.satuan}</td>
                                    <td className="py-1.5 text-right font-mono text-slate-600">{formatCompactIDR(it.hargaSatuan)}</td>
                                    <td className="py-1.5 text-right font-mono font-bold text-slate-900">{formatCompactIDR(it.jumlah)}</td>
                                  </tr>
                                ))}
                              </tbody>
                            </table>
                          </div>
                        </td>
                      </tr>
                    )}
                  </React.Fragment>
                );
              })}
            </tbody>

            {/* Table Footer Summary */}
            <tfoot className="bg-purple-950 text-white font-mono text-[11px] font-bold">
              <tr>
                <td className="py-3 px-3 sticky left-0 bg-purple-950 z-10 border-r border-purple-800 font-sans">
                  JUMLAH KESELURUHAN ({pokAccounts.length} AKUN)
                </td>
                <td className="py-3 px-2.5 text-right border-r border-purple-800">
                  {formatCompactIDR(rekapSatker.totalPagu)}
                </td>
                <td className="py-3 px-2.5 text-right text-emerald-300 border-r border-purple-800">
                  {formatCompactIDR(rekapSatker.totalRealisasi)}
                </td>
                <td className="py-3 px-2.5 text-right text-amber-300 border-r border-purple-800">
                  {formatCompactIDR(rekapSatker.totalSisa)}
                </td>
                <td className="py-3 px-2 text-center border-r border-purple-800">-</td>
                {NAMA_BULAN_SINGKAT.map((_, mIdx) => (
                  <React.Fragment key={mIdx}>
                    <td className="py-3 px-2 text-right border-r border-purple-900 text-purple-200">
                      {formatCompactIDR(rekapSatker.rpdPerBulan[mIdx])}
                    </td>
                    <td className="py-3 px-2 text-right border-r border-purple-800 text-emerald-300">
                      {formatCompactIDR(rekapSatker.realisasiPerBulan[mIdx])}
                    </td>
                  </React.Fragment>
                ))}
              </tr>
            </tfoot>
          </table>
        </div>
      </div>

      {/* =================================================================== */}
      {/* MODAL 1: IMPORT RKK WEBSITE SAKTI (FORMAT PDF & XLSX)               */}
      {/* =================================================================== */}
      {showImportModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/75 backdrop-blur-sm p-4 animate-in fade-in">
          <div className="bg-white rounded-3xl shadow-2xl border border-purple-200 max-w-2xl w-full overflow-hidden">
            <div className="p-5 bg-gradient-to-r from-[#250b52] to-[#4c1d95] text-white flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-amber-400 text-purple-950 flex items-center justify-center">
                  <UploadCloud className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-sm font-extrabold">Import Rincian Kertas Kerja (RKK) Website SAKTI</h3>
                  <p className="text-[11px] text-purple-200">Mendukung format dokumen PDF (cetak RKK SAKTI) maupun Excel (.xlsx / .csv)</p>
                </div>
              </div>
              <button onClick={() => setShowImportModal(false)} className="p-1.5 hover:bg-white/20 rounded-xl">
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="p-6 space-y-5">
              {/* Upload Dropzone */}
              <label className="block border-2 border-dashed border-purple-300 hover:border-purple-500 rounded-2xl p-6 text-center cursor-pointer bg-purple-50/40 hover:bg-purple-50 transition">
                <input
                  type="file"
                  accept=".xlsx,.xls,.csv,.pdf"
                  onChange={handleFileUpload}
                  className="hidden"
                />
                {importLoading ? (
                  <div className="space-y-2 text-purple-700 py-4">
                    <Loader2 className="w-8 h-8 animate-spin mx-auto" />
                    <p className="text-xs font-bold">Mengekstrak hierarki Program, Kegiatan & Akun dari RKK SAKTI...</p>
                  </div>
                ) : (
                  <div className="space-y-2">
                    <div className="w-12 h-12 rounded-2xl bg-purple-100 text-purple-700 flex items-center justify-center mx-auto">
                      <FileText className="w-6 h-6" />
                    </div>
                    <p className="text-sm font-bold text-slate-800">Klik untuk memilih file RKK SAKTI (.PDF atau .XLSX)</p>
                    <p className="text-xs text-slate-500">
                      Sistem otomatis mengenali kode Program (054.01), Kegiatan, KRO/Output, Komponen, serta Akun 5xxxxx.
                    </p>
                  </div>
                )}
              </label>

              {importError && (
                <div className="p-3.5 rounded-2xl bg-rose-50 border border-rose-200 text-rose-800 text-xs flex items-start gap-2.5">
                  <AlertTriangle className="w-4 h-4 text-rose-600 flex-shrink-0 mt-0.5" />
                  <span>{importError}</span>
                </div>
              )}

              {/* Pratinjau Hasil Pembacaan RKK SAKTI */}
              {importPreview && (
                <div className="p-4 rounded-2xl bg-emerald-50/70 border border-emerald-200 space-y-3 animate-in fade-in">
                  <div className="flex items-center justify-between border-b border-emerald-200 pb-2">
                    <div className="flex items-center gap-2">
                      <CheckCircle2 className="w-5 h-5 text-emerald-600" />
                      <span className="text-xs font-extrabold text-emerald-950">
                        RKK SAKTI Berhasil Dibaca ({importPreview.fileType})
                      </span>
                    </div>
                    <span className="text-[11px] font-mono bg-white px-2 py-0.5 rounded border border-emerald-200 text-emerald-800 font-bold">
                      {importPreview.summary.totalAccounts} Akun Belanja
                    </span>
                  </div>

                  <div className="grid grid-cols-2 gap-3 text-xs">
                    <div className="p-2.5 bg-white rounded-xl border border-emerald-100">
                      <span className="text-[10px] text-slate-400 block">Total Pagu Terdeteksi</span>
                      <span className="font-mono font-black text-emerald-900 text-sm">
                        {formatIDR(importPreview.summary.totalPagu)}
                      </span>
                    </div>
                    <div className="p-2.5 bg-white rounded-xl border border-emerald-100">
                      <span className="text-[10px] text-slate-400 block">Struktur RPD Bulanan</span>
                      <span className="font-bold text-slate-800">
                        {importPreview.summary.hasMonthlyRpd
                          ? 'Lengkap dari File (Jan–Des)'
                          : 'Smart Merge (Pertahankan RPD Jan–Des)'}
                      </span>
                    </div>
                  </div>

                  {!importPreview.summary.hasMonthlyRpd && (
                    <div className="p-2.5 rounded-xl bg-amber-50 border border-amber-200 text-[11px] text-amber-900 leading-relaxed">
                      File RKK SAKTI murni tidak memiliki kolom bulan Jan–Des. Sistem akan <strong>mempertahankan jadwal RPD &amp; realisasi Jan–Des yang sudah ada</strong> pada akun yang cocok dan hanya menyesuaikan selisih pagu revisi.
                    </div>
                  )}

                  <div className="max-h-36 overflow-y-auto bg-white rounded-xl border border-emerald-100 p-2 text-[11px] space-y-1">
                    {importPreview.accounts.slice(0, 6).map((a, i) => (
                      <div key={i} className="flex justify-between py-0.5 border-b border-slate-50 last:border-0">
                        <span className="truncate pr-3 text-slate-700">
                          <strong className="font-mono text-purple-800">{a.kodeAkun}</strong> — {a.outputNama || a.namaAkun}
                        </span>
                        <span className="font-mono font-bold text-slate-900 flex-shrink-0">
                          {formatCompactIDR(a.pagu)}
                        </span>
                      </div>
                    ))}
                    {importPreview.accounts.length > 6 && (
                      <p className="text-center text-[10px] text-slate-400 pt-1 italic">
                        ... dan {importPreview.accounts.length - 6} akun lainnya.
                      </p>
                    )}
                  </div>
                </div>
              )}

              <div className="flex justify-end gap-3 pt-2 border-t border-slate-100">
                <button
                  onClick={() => setShowImportModal(false)}
                  className="px-4 py-2 rounded-xl border border-slate-200 text-slate-600 text-xs font-bold hover:bg-slate-50"
                >
                  Batal
                </button>
                <button
                  disabled={!importPreview}
                  onClick={confirmImport}
                  className="px-5 py-2 rounded-xl bg-purple-700 hover:bg-purple-800 disabled:opacity-40 text-white text-xs font-bold shadow-md transition"
                >
                  Terapkan Data RKK SAKTI
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* =================================================================== */}
      {/* MODAL 2: UPDATE / GESER JADWAL RPD & REVISI PAGU                   */}
      {/* =================================================================== */}
      {editingAccount && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/75 backdrop-blur-sm p-4 animate-in fade-in">
          <div className="bg-white rounded-3xl shadow-2xl border border-purple-200 max-w-3xl w-full overflow-hidden max-h-[90vh] flex flex-col">
            <div className="p-5 bg-gradient-to-r from-[#250b52] to-[#4c1d95] text-white flex items-center justify-between flex-shrink-0">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-amber-400 text-purple-950 flex items-center justify-center">
                  <Calendar className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-sm font-extrabold">Geser Jadwal RPD & Pembaruan Pagu</h3>
                  <p className="text-[11px] text-purple-200">
                    {editingAccount.kodeAkun} — {editingAccount.namaAkun} ({editingAccount.outputKode})
                  </p>
                </div>
              </div>
              <button onClick={() => setEditingAccount(null)} className="p-1.5 hover:bg-white/20 rounded-xl">
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="p-6 overflow-y-auto space-y-5">
              {/* Pagu Revisi Editor */}
              <div className="p-4 rounded-2xl bg-purple-50/70 border border-purple-200 grid grid-cols-1 sm:grid-cols-3 gap-4 items-center">
                <div>
                  <label className="text-[10px] font-bold uppercase text-purple-800 block mb-1">
                    Pagu Anggaran Akun (Rp)
                  </label>
                  <input
                    type="number"
                    value={editPaguValue}
                    onChange={(e) => setEditPaguValue(Number(e.target.value) || 0)}
                    className="w-full px-3 py-2 rounded-xl bg-white border border-purple-300 font-mono font-bold text-sm text-purple-950 focus:outline-none focus:ring-2 focus:ring-purple-500"
                  />
                </div>

                <div>
                  <span className="text-[10px] font-bold uppercase text-slate-500 block mb-1">Total RPD 12 Bulan</span>
                  <span className="font-mono font-black text-sm text-slate-900">
                    {formatIDR(totalEditRpd)}
                  </span>
                </div>

                <div>
                  <span className="text-[10px] font-bold uppercase text-slate-500 block mb-1">Status Keseimbangan</span>
                  {rpdBalanceDiff === 0 ? (
                    <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-emerald-100 text-emerald-800 text-xs font-bold">
                      <CheckCircle2 className="w-3.5 h-3.5" /> Seimbang (Balance)
                    </span>
                  ) : (
                    <div className="space-y-1">
                      <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-amber-100 text-amber-900 text-[11px] font-bold">
                        Selisih: {formatIDR(rpdBalanceDiff)}
                      </span>
                      <button
                        type="button"
                        onClick={autoBalanceDecember}
                        className="block text-[10px] font-bold text-purple-700 hover:underline"
                      >
                        &rarr; Arahkan sisa ke Desember
                      </button>
                    </div>
                  )}
                </div>
              </div>

              {/* 12 Month Grid Input */}
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
                {NAMA_BULAN.map((bln, idx) => {
                  const realisasiBulanIni = editingAccount.realisasiGabungan?.[idx] || 0;
                  return (
                    <div key={idx} className="p-3 rounded-2xl border border-slate-200 bg-slate-50/50 space-y-1.5">
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-bold text-slate-800">{bln}</span>
                        {realisasiBulanIni > 0 && (
                          <span className="text-[9px] font-bold text-emerald-700 bg-emerald-50 px-1.5 py-0.2 rounded">
                            Real: {formatCompactIDR(realisasiBulanIni)}
                          </span>
                        )}
                      </div>
                      <input
                        type="text"
                        value={editRpdValues[idx]}
                        onChange={(e) => handleRpdMonthChange(idx, e.target.value)}
                        className="w-full px-2.5 py-1.5 rounded-xl bg-white border border-purple-200 font-mono text-xs font-bold text-right text-slate-900 focus:outline-none focus:ring-2 focus:ring-purple-400"
                      />
                    </div>
                  );
                })}
              </div>
            </div>

            <div className="p-4 bg-slate-50 border-t border-slate-200 flex items-center justify-between flex-shrink-0">
              <p className="text-[11px] text-slate-500">
                * Perubahan jadwal RPD langsung memperbarui kalkulator deviasi IKPA satker.
              </p>
              <div className="flex items-center gap-2.5">
                <button
                  onClick={() => setEditingAccount(null)}
                  className="px-4 py-2 rounded-xl border border-slate-200 bg-white text-slate-600 text-xs font-bold"
                >
                  Batal
                </button>
                <button
                  onClick={saveRpdUpdate}
                  className="px-5 py-2 rounded-xl bg-purple-700 hover:bg-purple-800 text-white text-xs font-bold shadow-md"
                >
                  Simpan Perubahan RPD
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
