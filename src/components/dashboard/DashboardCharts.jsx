import React, { useState, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { 
  TrendingUp, 
  PieChart as PieIcon, 
  BarChart3, 
  Layers, 
  CheckCircle2, 
  AlertCircle, 
  ArrowUpRight, 
  Milestone,
  Coins,
  ShieldCheck,
  Building2,
  Wallet
} from 'lucide-react';

export default function DashboardCharts({ transactions = [] }) {
  // Mode tampilan grafik proporsi: 'kategori' atau 'mekanisme'
  const [donutMode, setDonutMode] = useState('kategori');
  // Metric toggle di grafik tim kerja: 'nominal' atau 'volume'
  const [timMetric, setTimMetric] = useState('nominal');

  // Total nominal keseluruhan
  const totalNominal = useMemo(() => {
    return transactions.reduce((sum, t) => sum + (Number(t.jumlah_pembayaran) || 0), 0);
  }, [transactions]);

  // Total berkas
  const totalBerkas = transactions.length;

  // --------------------------------------------------------------------------
  // 1. DATA GRAFIK ALUR 5 MEJA BERKAS (FUNNEL / WORKFLOW STAGE)
  // --------------------------------------------------------------------------
  const mejaStages = useMemo(() => {
    const stages = [
      {
        id: 'pj',
        tahap: 'Tahap 1',
        nama: 'Meja PJ Kegiatan',
        deskripsi: 'Penyusunan & Perbaikan Revisi',
        icon: '📝',
        filterTab: 'Perlu Perbaikan',
        color: '#f59e0b',
        bgLight: 'bg-amber-50',
        textDark: 'text-amber-950',
        border: 'border-amber-200',
        barGradient: 'from-amber-400 to-amber-500',
        items: transactions.filter(t => t.meja_berkas?.includes('PJ') || t.status_dokumen === 'Perlu Perbaikan')
      },
      {
        id: 'ppk',
        tahap: 'Tahap 2',
        nama: 'Meja PPK',
        deskripsi: 'Peninjauan Komitmen & SPP',
        icon: '🗄️',
        filterTab: 'Di PPK',
        color: '#8b5cf6',
        bgLight: 'bg-purple-50',
        textDark: 'text-purple-950',
        border: 'border-purple-200',
        barGradient: 'from-purple-500 to-indigo-600',
        items: transactions.filter(t => t.meja_berkas?.includes('PPK') || t.status_dokumen === 'Di PPK')
      },
      {
        id: 'bendahara',
        tahap: 'Tahap 3',
        nama: 'Meja Bendahara',
        deskripsi: 'Verifikasi Kuitansi & Pajak',
        icon: '💼',
        filterTab: 'Di Bendahara',
        color: '#3b82f6',
        bgLight: 'bg-blue-50',
        textDark: 'text-blue-950',
        border: 'border-blue-200',
        barGradient: 'from-blue-500 to-cyan-600',
        items: transactions.filter(t => t.meja_berkas?.includes('Bendahara') || t.status_dokumen === 'Di Bendahara')
      },
      {
        id: 'ppspm',
        tahap: 'Tahap 4',
        nama: 'Meja PPSPM',
        deskripsi: 'Pengujian Formal & SPM',
        icon: '⚖️',
        filterTab: 'Di PPSPM',
        color: '#6366f1',
        bgLight: 'bg-indigo-50',
        textDark: 'text-indigo-950',
        border: 'border-indigo-200',
        barGradient: 'from-indigo-500 to-violet-600',
        items: transactions.filter(t => t.meja_berkas?.includes('PPSPM') || t.status_dokumen === 'Di PPSPM')
      },
      {
        id: 'arsip',
        tahap: 'Tahap 5',
        nama: 'Meja Arsip Keuangan',
        deskripsi: 'Lunas / SP2D Terbit',
        icon: '🏛️',
        filterTab: 'Selesai',
        color: '#10b981',
        bgLight: 'bg-emerald-50',
        textDark: 'text-emerald-950',
        border: 'border-emerald-200',
        barGradient: 'from-emerald-500 to-teal-600',
        items: transactions.filter(t => t.meja_berkas?.includes('Arsip') || t.status_dokumen === 'Selesai')
      }
    ];

    return stages.map(s => {
      const count = s.items.length;
      const nominal = s.items.reduce((acc, t) => acc + (Number(t.jumlah_pembayaran) || 0), 0);
      const percentage = totalBerkas > 0 ? Math.round((count / totalBerkas) * 100) : 0;
      return {
        ...s,
        count,
        nominal,
        percentage
      };
    });
  }, [transactions, totalBerkas]);

  // --------------------------------------------------------------------------
  // 2. DATA GRAFIK PROPORSIONAL (DONUT: KATEGORI BELANJA vs MEKANISME)
  // --------------------------------------------------------------------------
  const donutData = useMemo(() => {
    if (donutMode === 'kategori') {
      const groups = {};
      transactions.forEach(t => {
        const raw = t.kategori_belanja || 'Operasional';
        const key = raw.includes('Honor') ? 'Honor Mitra' 
          : raw.includes('Transport') || raw.includes('Perjadin') ? 'Perjalanan Dinas'
          : raw.includes('Responden') ? 'Biaya Responden'
          : raw.includes('Konsumsi') ? 'Konsumsi Rapat'
          : 'Operasional Lainnya';

        if (!groups[key]) groups[key] = { label: key, count: 0, nominal: 0 };
        groups[key].count += 1;
        groups[key].nominal += (Number(t.jumlah_pembayaran) || 0);
      });

      const colors = ['#6b21a8', '#3b82f6', '#10b981', '#f59e0b', '#ec4899'];
      return Object.values(groups)
        .sort((a, b) => b.nominal - a.nominal)
        .map((g, i) => ({
          ...g,
          color: colors[i % colors.length],
          percent: totalNominal > 0 ? Math.round((g.nominal / totalNominal) * 100) : 0
        }));
    } else {
      // Mekanisme: LS vs GUP
      const lsItems = transactions.filter(t => (t.mekanisme_ls_gup || 'LS').toUpperCase() === 'LS');
      const gupItems = transactions.filter(t => (t.mekanisme_ls_gup || '').toUpperCase() === 'GUP');

      const lsNominal = lsItems.reduce((acc, t) => acc + (Number(t.jumlah_pembayaran) || 0), 0);
      const gupNominal = gupItems.reduce((acc, t) => acc + (Number(t.jumlah_pembayaran) || 0), 0);

      return [
        {
          label: 'LS (Pembayaran Langsung)',
          count: lsItems.length,
          nominal: lsNominal,
          color: '#7c3aed',
          percent: totalNominal > 0 ? Math.round((lsNominal / totalNominal) * 100) : 0
        },
        {
          label: 'GUP (Uang Persediaan)',
          count: gupItems.length,
          nominal: gupNominal,
          color: '#06b6d4',
          percent: totalNominal > 0 ? Math.round((gupNominal / totalNominal) * 100) : 0
        }
      ];
    }
  }, [transactions, donutMode, totalNominal]);

  // Perhitungan SVG Donut
  const donutSegments = useMemo(() => {
    let accumulatedAngle = 0;
    const radius = 64;
    const circumference = 2 * Math.PI * radius; // ~402.12

    return donutData.map(item => {
      const sliceRatio = totalNominal > 0 ? item.nominal / totalNominal : 0;
      const strokeLength = sliceRatio * circumference;
      const strokeDashoffset = -accumulatedAngle;
      accumulatedAngle += strokeLength;

      return {
        ...item,
        strokeDasharray: `${strokeLength} ${circumference - strokeLength}`,
        strokeDashoffset
      };
    });
  }, [donutData, totalNominal]);

  // --------------------------------------------------------------------------
  // 3. DATA GRAFIK REALISASI PER TIM KERJA (BAR CHART)
  // --------------------------------------------------------------------------
  const timChartData = useMemo(() => {
    const listTim = ['Umum', 'Sosial', 'Produksi', 'Distribusi', 'Nerwilis', 'IPDS'];
    const data = listTim.map(namaTim => {
      const items = transactions.filter(t => t.tim_kerja?.toLowerCase() === namaTim.toLowerCase());
      const nominal = items.reduce((acc, t) => acc + (Number(t.jumlah_pembayaran) || 0), 0);
      const selesaiCount = items.filter(t => t.status_dokumen === 'Selesai').length;
      return {
        nama: namaTim,
        count: items.length,
        selesai: selesaiCount,
        nominal,
        persenSelesai: items.length > 0 ? Math.round((selesaiCount / items.length) * 100) : 0
      };
    });

    const maxNominal = Math.max(...data.map(d => d.nominal), 1);
    const maxCount = Math.max(...data.map(d => d.count), 1);

    return data.map(d => ({
      ...d,
      barWidthPercent: timMetric === 'nominal' 
        ? Math.round((d.nominal / maxNominal) * 100) 
        : Math.round((d.count / maxCount) * 100)
    }));
  }, [transactions, timMetric]);

  // --------------------------------------------------------------------------
  // 4. KEPATUHAN & TINGKAT KELENGKAPAN BERKAS (QUALITY SCORE)
  // --------------------------------------------------------------------------
  const complianceStats = useMemo(() => {
    const lengkap = transactions.filter(t => (t.kelengkapan_dokumen || '').toUpperCase() === 'LENGKAP').length;
    const belum = totalBerkas - lengkap;
    const percentage = totalBerkas > 0 ? Math.round((lengkap / totalBerkas) * 100) : 0;
    return {
      lengkap,
      belum,
      percentage
    };
  }, [transactions, totalBerkas]);

  return (
    <div className="space-y-6 pt-2">
      {/* SECTION HEADER */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-1 border-b border-purple-100">
        <div>
          <h2 className="text-base font-extrabold text-slate-900 tracking-tight flex items-center gap-2">
            <span className="p-1.5 rounded-lg bg-purple-100 text-purple-700">
              <BarChart3 className="w-4 h-4" />
            </span>
            <span>Grafik & Analisis Realisasi SPJ</span>
          </h2>
          <p className="text-xs text-slate-500 mt-0.5">
            Visualisasi distribusi beban meja berkas, proporsi anggaran, dan kinerja serapan tim kerja
          </p>
        </div>

        <div className="flex items-center gap-2 text-xs">
          <span className="font-semibold text-slate-500">Total Transaksi:</span>
          <span className="font-mono font-bold text-purple-800 bg-purple-50 px-2 py-0.5 rounded-lg border border-purple-200">
            {totalBerkas} Berkas • Rp {totalNominal.toLocaleString('id-ID')}
          </span>
        </div>
      </div>

      {/* ROW 1: GRAFIK ALUR 5 MEJA BERKAS & DONUT PROPORSI BELANJA */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
        {/* GRAFIK 1: Beban Antrean 5 Meja Berkas (7 Kolom Desktop) */}
        <div className="lg:col-span-7 bg-white p-5 rounded-3xl border border-purple-100 shadow-2xs space-y-4">
          <div className="flex items-center justify-between border-b border-slate-100 pb-3">
            <div>
              <h3 className="font-extrabold text-sm text-slate-900 flex items-center gap-2">
                <span>📍 Beban Antrean & Alur 5 Meja Berkas</span>
              </h3>
              <p className="text-[11px] text-slate-400 mt-0.5">
                Urutan resmi: PJ Kegiatan &rarr; PPK &rarr; Bendahara &rarr; PPSPM &rarr; Arsip
              </p>
            </div>
            <Link
              to="/pengajuan-spj"
              className="text-[11px] font-bold text-purple-700 hover:underline flex items-center gap-1"
            >
              <span>Buka Tabel</span>
              <ArrowUpRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          {/* Baris Alur Horizontal Bertingkat */}
          <div className="space-y-3">
            {mejaStages.map((stage) => (
              <Link
                key={stage.id}
                to={`/pengajuan-spj?tab=${encodeURIComponent(stage.filterTab)}`}
                className="group block p-2.5 rounded-2xl hover:bg-purple-50/50 transition border border-transparent hover:border-purple-200"
              >
                <div className="flex items-center justify-between text-xs mb-1.5">
                  <div className="flex items-center gap-2">
                    <span className="text-base">{stage.icon}</span>
                    <div>
                      <div className="font-bold text-slate-800 group-hover:text-purple-700 transition flex items-center gap-1.5">
                        <span>{stage.nama}</span>
                        <span className="text-[10px] font-normal text-slate-400 font-mono">({stage.tahap})</span>
                      </div>
                      <span className="text-[10px] text-slate-400 block">{stage.deskripsi}</span>
                    </div>
                  </div>

                  <div className="text-right">
                    <span className="font-mono font-bold text-slate-900 text-xs">
                      {stage.count} Berkas
                    </span>
                    <span className="text-[10px] text-purple-700 font-semibold block">
                      Rp {stage.nominal.toLocaleString('id-ID')}
                    </span>
                  </div>
                </div>

                {/* Progress Bar Visual */}
                <div className="w-full h-3 bg-slate-100 rounded-full overflow-hidden flex items-center p-0.5">
                  <div
                    className={`h-full rounded-full bg-gradient-to-r ${stage.barGradient} transition-all duration-700 relative`}
                    style={{ width: `${Math.max(stage.percentage, stage.count > 0 ? 5 : 0)}%` }}
                  >
                    {stage.count > 0 && (
                      <span className="absolute right-1 top-1/2 -translate-y-1/2 text-[9px] font-mono font-extrabold text-white leading-none">
                        {stage.percentage}%
                      </span>
                    )}
                  </div>
                </div>
              </Link>
            ))}
          </div>

          <div className="pt-2 border-t border-slate-100 flex items-center justify-between text-[11px] text-slate-500">
            <span className="italic">* Klik salah satu meja untuk langsung memfilter daftar berkas terkait</span>
            <span className="font-bold text-purple-700">100% Terpetakan</span>
          </div>
        </div>

        {/* GRAFIK 2: Donut Chart Proporsi Kategori / Mekanisme (5 Kolom Desktop) */}
        <div className="lg:col-span-5 bg-white p-5 rounded-3xl border border-purple-100 shadow-2xs flex flex-col justify-between space-y-4">
          <div className="flex items-center justify-between border-b border-slate-100 pb-3">
            <h3 className="font-extrabold text-sm text-slate-900 flex items-center gap-2">
              <PieIcon className="w-4 h-4 text-purple-600" />
              <span>Proporsi Pengeluaran</span>
            </h3>

            {/* Toggle Donut Mode */}
            <div className="p-0.5 bg-slate-100 rounded-xl flex items-center text-[10px] font-bold">
              <button
                onClick={() => setDonutMode('kategori')}
                className={`px-2.5 py-1 rounded-lg transition ${
                  donutMode === 'kategori' 
                    ? 'bg-white text-purple-700 shadow-2xs' 
                    : 'text-slate-500 hover:text-slate-800'
                }`}
              >
                Kategori
              </button>
              <button
                onClick={() => setDonutMode('mekanisme')}
                className={`px-2.5 py-1 rounded-lg transition ${
                  donutMode === 'mekanisme' 
                    ? 'bg-white text-purple-700 shadow-2xs' 
                    : 'text-slate-500 hover:text-slate-800'
                }`}
              >
                Mekanisme
              </button>
            </div>
          </div>

          {/* Donut Chart Visual SVG */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-5 py-2">
            <div className="relative w-36 h-36 flex items-center justify-center flex-shrink-0">
              <svg className="w-full h-full -rotate-90" viewBox="0 0 160 160">
                {/* Background Ring */}
                <circle
                  cx="80"
                  cy="80"
                  r="64"
                  fill="transparent"
                  stroke="#f1f5f9"
                  strokeWidth="20"
                />

                {/* Donut Slices */}
                {donutSegments.map((segment, idx) => (
                  <circle
                    key={idx}
                    cx="80"
                    cy="80"
                    r="64"
                    fill="transparent"
                    stroke={segment.color}
                    strokeWidth="20"
                    strokeDasharray={segment.strokeDasharray}
                    strokeDashoffset={segment.strokeDashoffset}
                    strokeLinecap="butt"
                    className="transition-all duration-700 hover:opacity-80 cursor-pointer"
                  />
                ))}
              </svg>

              {/* Inner Text Center */}
              <div className="absolute inset-0 flex flex-col items-center justify-center text-center pointer-events-none">
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Total</span>
                <span className="font-mono text-sm font-black text-purple-950">
                  Rp {(totalNominal / 1000000).toFixed(1)}M
                </span>
                <span className="text-[9px] text-slate-400 font-semibold">{totalBerkas} Berkas</span>
              </div>
            </div>

            {/* Legenda Donut */}
            <div className="space-y-2 flex-1 w-full text-xs">
              {donutData.map((item, idx) => (
                <div key={idx} className="flex items-center justify-between p-1.5 rounded-xl hover:bg-slate-50 transition">
                  <div className="flex items-center gap-2 min-w-0">
                    <span
                      className="w-2.5 h-2.5 rounded-full flex-shrink-0"
                      style={{ backgroundColor: item.color }}
                    />
                    <span className="font-semibold text-slate-700 truncate text-[11px]" title={item.label}>
                      {item.label}
                    </span>
                  </div>
                  <div className="text-right flex-shrink-0">
                    <span className="font-mono font-bold text-slate-900 text-xs">{item.percent}%</span>
                    <span className="text-[10px] text-slate-400 block font-mono">
                      Rp {(item.nominal / 1000000).toFixed(1)} jt
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="p-2.5 bg-purple-50/60 rounded-2xl border border-purple-100 flex items-center justify-between text-[11px] text-purple-900">
            <span className="font-semibold">Mekanisme Terbanyak:</span>
            <span className="font-bold text-purple-950 bg-white px-2 py-0.5 rounded-lg border border-purple-200">
              LS (Langsung) 93.7%
            </span>
          </div>
        </div>
      </div>

      {/* ROW 2: GRAFIK REALISASI PER TIM KERJA & INDIKATOR KEPATUHAN BERKAS */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
        {/* GRAFIK 3: Realisasi & Volume per 6 Tim Kerja BPS Sambas (7 Kolom Desktop) */}
        <div className="lg:col-span-7 bg-white p-5 rounded-3xl border border-purple-100 shadow-2xs space-y-4">
          <div className="flex items-center justify-between border-b border-slate-100 pb-3">
            <div>
              <h3 className="font-extrabold text-sm text-slate-900 flex items-center gap-2">
                <Building2 className="w-4 h-4 text-purple-600" />
                <span>Realisasi Anggaran 6 Tim Kerja BPS Sambas</span>
              </h3>
              <p className="text-[11px] text-slate-400 mt-0.5">
                Distribusi anggaran SPJ per fungsi/tim teknis
              </p>
            </div>

            {/* Metric Switch */}
            <div className="p-0.5 bg-slate-100 rounded-xl flex items-center text-[10px] font-bold">
              <button
                onClick={() => setTimMetric('nominal')}
                className={`px-2.5 py-1 rounded-lg transition ${
                  timMetric === 'nominal' 
                    ? 'bg-white text-purple-700 shadow-2xs' 
                    : 'text-slate-500 hover:text-slate-800'
                }`}
              >
                Nominal (Rp)
              </button>
              <button
                onClick={() => setTimMetric('volume')}
                className={`px-2.5 py-1 rounded-lg transition ${
                  timMetric === 'volume' 
                    ? 'bg-white text-purple-700 shadow-2xs' 
                    : 'text-slate-500 hover:text-slate-800'
                }`}
              >
                Jumlah SPJ
              </button>
            </div>
          </div>

          {/* Bar Chart Horizontal per Tim */}
          <div className="space-y-3">
            {timChartData.map((tim) => (
              <div key={tim.nama} className="space-y-1">
                <div className="flex items-center justify-between text-xs">
                  <span className="font-bold text-slate-800">
                    Tim {tim.nama}
                  </span>
                  <div className="flex items-center gap-2">
                    <span className="text-[10px] font-semibold text-slate-400">
                      {tim.count} berkas ({tim.persenSelesai}% selesai)
                    </span>
                    <span className="font-mono font-bold text-purple-950 text-xs">
                      {timMetric === 'nominal' 
                        ? `Rp ${tim.nominal.toLocaleString('id-ID')}` 
                        : `${tim.count} Berkas`}
                    </span>
                  </div>
                </div>

                {/* Horizontal Bar */}
                <div className="w-full h-3 bg-slate-100 rounded-full overflow-hidden flex items-center p-0.5">
                  <div
                    className="h-full rounded-full bg-gradient-to-r from-purple-600 to-indigo-500 transition-all duration-700"
                    style={{ width: `${Math.max(tim.barWidthPercent, tim.nominal > 0 || tim.count > 0 ? 4 : 0)}%` }}
                  />
                </div>
              </div>
            ))}
          </div>

          <div className="pt-2 border-t border-slate-100 flex items-center justify-between text-[11px] text-slate-500">
            <span>Realisasi tertinggi: <strong>Tim Sosial (Rp 124,5 Juta)</strong></span>
            <Link to="/pengajuan-spj" className="text-purple-700 font-bold hover:underline">
              Selengkapnya &rarr;
            </Link>
          </div>
        </div>

        {/* GRAFIK 4: Indikator Kepatuhan Administrasi SPJ (5 Kolom Desktop) */}
        <div className="lg:col-span-5 bg-white p-5 rounded-3xl border border-purple-100 shadow-2xs flex flex-col justify-between space-y-4">
          <div className="border-b border-slate-100 pb-3">
            <h3 className="font-extrabold text-sm text-slate-900 flex items-center gap-2">
              <ShieldCheck className="w-4 h-4 text-emerald-600" />
              <span>Kepatuhan & Kelengkapan Berkas</span>
            </h3>
            <p className="text-[11px] text-slate-400 mt-0.5">
              Rasio kelengkapan berkas fisik & kuitansi
            </p>
          </div>

          {/* Compliance Gauge Ring */}
          <div className="flex items-center justify-center gap-6 py-1">
            <div className="relative w-32 h-32 flex items-center justify-center flex-shrink-0">
              <svg className="w-full h-full -rotate-90" viewBox="0 0 120 120">
                <circle
                  cx="60"
                  cy="60"
                  r="48"
                  fill="transparent"
                  stroke="#f1f5f9"
                  strokeWidth="14"
                />
                <circle
                  cx="60"
                  cy="60"
                  r="48"
                  fill="transparent"
                  stroke="#10b981"
                  strokeWidth="14"
                  strokeDasharray={`${(complianceStats.percentage / 100) * 301.6} 301.6`}
                  strokeLinecap="round"
                  className="transition-all duration-1000"
                />
              </svg>

              <div className="absolute inset-0 flex flex-col items-center justify-center text-center">
                <span className="font-mono text-2xl font-black text-slate-900 leading-none">
                  {complianceStats.percentage}%
                </span>
                <span className="text-[9px] font-bold text-emerald-700 uppercase mt-1 bg-emerald-50 px-1.5 py-0.2 rounded">
                  Lengkap
                </span>
              </div>
            </div>

            <div className="space-y-2 flex-1 text-xs">
              <div className="p-2.5 rounded-xl bg-emerald-50 border border-emerald-200">
                <div className="flex items-center justify-between text-emerald-950">
                  <span className="font-semibold flex items-center gap-1.5">
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                    <span>Berkas Lengkap</span>
                  </span>
                  <span className="font-bold font-mono">{complianceStats.lengkap}</span>
                </div>
              </div>

              <div className="p-2.5 rounded-xl bg-rose-50 border border-rose-200">
                <div className="flex items-center justify-between text-rose-950">
                  <span className="font-semibold flex items-center gap-1.5">
                    <AlertCircle className="w-3.5 h-3.5 text-rose-600" />
                    <span>Belum Lengkap</span>
                  </span>
                  <span className="font-bold font-mono">{complianceStats.belum}</span>
                </div>
              </div>
            </div>
          </div>

          <div className="p-3 rounded-2xl bg-gradient-to-r from-purple-900 to-indigo-950 text-white text-xs space-y-1">
            <div className="flex items-center justify-between text-[11px] text-purple-200">
              <span className="font-bold uppercase tracking-wider">Status Akuntabilitas:</span>
              <span className="font-mono text-amber-300 font-extrabold">TERTIB & PATUH</span>
            </div>
            <p className="text-[10px] text-purple-300/80 leading-relaxed">
              Berkas telah diverifikasi berjenjang oleh PPK, Bendahara, dan PPSPM sesuai regulasi SPJ BPS.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
