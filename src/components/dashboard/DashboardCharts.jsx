import React, { useState, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { 
  BarChart3, 
  PieChart as PieIcon, 
  ArrowUpRight, 
  Building2, 
  ShieldCheck, 
  CheckCircle2, 
  AlertCircle,
  ChevronRight
} from 'lucide-react';

// Helper format singkatan nominal dalam Bahasa Indonesia (jt / Miliar)
function formatJutaRupiah(val) {
  if (!val && val !== 0) return '0 jt';
  if (val >= 1000000000) {
    return `${(val / 1000000000).toLocaleString('id-ID', { minimumFractionDigits: 1, maximumFractionDigits: 1 })} M`;
  }
  return `${(val / 1000000).toLocaleString('id-ID', { minimumFractionDigits: 1, maximumFractionDigits: 1 })} jt`;
}

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
  // 1. DATA ALUR 5 MEJA BERKAS
  // --------------------------------------------------------------------------
  const mejaStages = useMemo(() => {
    const stages = [
      {
        id: 'pj',
        tahap: '1',
        nama: 'Meja PJ Kegiatan',
        deskripsi: 'Penyusunan & Perbaikan Revisi',
        icon: '📝',
        filterTab: 'Perlu Perbaikan',
        barGradient: 'from-amber-400 to-amber-500',
        badgeBg: 'bg-amber-100 text-amber-900 border-amber-300',
        items: transactions.filter(t => t.meja_berkas?.includes('PJ') || t.status_dokumen === 'Perlu Perbaikan')
      },
      {
        id: 'ppk',
        tahap: '2',
        nama: 'Meja PPK',
        deskripsi: 'Peninjauan Komitmen & SPP',
        icon: '🗄️',
        filterTab: 'Di PPK',
        barGradient: 'from-purple-500 to-indigo-600',
        badgeBg: 'bg-purple-100 text-purple-900 border-purple-200',
        items: transactions.filter(t => t.meja_berkas?.includes('PPK') || t.status_dokumen === 'Di PPK')
      },
      {
        id: 'bendahara',
        tahap: '3',
        nama: 'Meja Bendahara',
        deskripsi: 'Verifikasi Kuitansi, Pajak & Kas',
        icon: '💼',
        filterTab: 'Di Bendahara',
        barGradient: 'from-blue-500 to-cyan-600',
        badgeBg: 'bg-blue-100 text-blue-900 border-blue-200',
        items: transactions.filter(t => t.meja_berkas?.includes('Bendahara') || t.status_dokumen === 'Di Bendahara')
      },
      {
        id: 'ppspm',
        tahap: '4',
        nama: 'Meja PPSPM',
        deskripsi: 'Pengujian Formal & Penerbitan SPM',
        icon: '⚖️',
        filterTab: 'Di PPSPM',
        barGradient: 'from-indigo-500 to-violet-600',
        badgeBg: 'bg-indigo-100 text-indigo-900 border-indigo-200',
        items: transactions.filter(t => t.meja_berkas?.includes('PPSPM') || t.status_dokumen === 'Di PPSPM')
      },
      {
        id: 'arsip',
        tahap: '5',
        nama: 'Meja Arsip Keuangan',
        deskripsi: 'Lunas / SP2D Terbit (Selesai)',
        icon: '🏛️',
        filterTab: 'Selesai',
        barGradient: 'from-emerald-500 to-teal-600',
        badgeBg: 'bg-emerald-100 text-emerald-900 border-emerald-300',
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
  // 2. DATA DONUT CHART PROPORSI BELANJA & MEKANISME
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
          : 'Operasional Kantor';

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
      const lsItems = transactions.filter(t => (t.mekanisme_ls_gup || 'LS').toUpperCase() === 'LS');
      const gupItems = transactions.filter(t => (t.mekanisme_ls_gup || '').toUpperCase() === 'GUP');

      const lsNominal = lsItems.reduce((acc, t) => acc + (Number(t.jumlah_pembayaran) || 0), 0);
      const gupNominal = gupItems.reduce((acc, t) => acc + (Number(t.jumlah_pembayaran) || 0), 0);

      return [
        {
          label: 'LS (Langsung)',
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

  // Top Donut Item
  const topDonutItem = donutData[0];

  // SVG Donut Slices Calculation
  const donutSegments = useMemo(() => {
    let accumulatedAngle = 0;
    const radius = 64;
    const circumference = 2 * Math.PI * radius;

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
  // 3. DATA REALISASI PER 6 TIM KERJA
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

  const topTim = useMemo(() => {
    return [...timChartData].sort((a, b) => b.nominal - a.nominal)[0];
  }, [timChartData]);

  // --------------------------------------------------------------------------
  // 4. KEPATUHAN & KELENGKAPAN BERKAS
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
    <div className="space-y-6">
      {/* ROW 1: ALUR 5 MEJA BERKAS (PIPELINE) & PROPORSI BELANJA (DONUT) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
        {/* GRAFIK 1: Alur 5 Meja Berkas Terpadu (7 Kolom) */}
        <div className="lg:col-span-7 bg-white p-6 rounded-3xl border border-purple-100 shadow-2xs flex flex-col justify-between space-y-4">
          <div>
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <div>
                <h3 className="font-extrabold text-sm text-slate-900 flex items-center gap-2">
                  <span className="p-1 rounded-lg bg-purple-100 text-purple-700">
                    <BarChart3 className="w-3.5 h-3.5" />
                  </span>
                  <span>Distribusi Berkas pada 5 Meja Alur SPJ</span>
                </h3>
                <p className="text-[11px] text-slate-400 mt-0.5">
                  Pemantauan posisi antrean berkas fisik & kuitansi dari Tahap 1 hingga Lunas
                </p>
              </div>

              <Link
                to="/pengajuan-spj"
                className="text-xs font-bold text-purple-700 hover:text-purple-900 flex items-center gap-1 transition"
              >
                <span>Buka Tabel</span>
                <ArrowUpRight className="w-3.5 h-3.5" />
              </Link>
            </div>

            {/* List 5 Tahapan Alur */}
            <div className="space-y-3 mt-4">
              {mejaStages.map((stage) => (
                <Link
                  key={stage.id}
                  to={`/pengajuan-spj?tab=${encodeURIComponent(stage.filterTab)}`}
                  className="group block p-2.5 rounded-2xl hover:bg-purple-50/40 transition border border-transparent hover:border-purple-200"
                >
                  <div className="flex items-center justify-between text-xs mb-1.5">
                    <div className="flex items-center gap-2.5">
                      <span className="text-base flex-shrink-0">{stage.icon}</span>
                      <div>
                        <div className="font-bold text-slate-800 group-hover:text-purple-700 transition flex items-center gap-1.5">
                          <span>{stage.nama}</span>
                          <span className="text-[10px] font-bold text-purple-700 bg-purple-100/70 px-1.5 py-0.2 rounded font-mono">
                            Tahap {stage.tahap}
                          </span>
                        </div>
                        <span className="text-[10px] text-slate-400 block">{stage.deskripsi}</span>
                      </div>
                    </div>

                    <div className="text-right flex-shrink-0">
                      <span className="font-mono font-extrabold text-slate-900 text-xs">
                        {stage.count} Berkas
                      </span>
                      <span className="text-[10px] text-purple-700 font-semibold block">
                        Rp {stage.nominal.toLocaleString('id-ID')}
                      </span>
                    </div>
                  </div>

                  {/* Horizontal Bar Progress */}
                  <div className="w-full h-2.5 bg-slate-100 rounded-full overflow-hidden flex items-center p-0.5">
                    <div
                      className={`h-full rounded-full bg-gradient-to-r ${stage.barGradient} transition-all duration-700`}
                      style={{ width: `${Math.max(stage.percentage, stage.count > 0 ? 6 : 0)}%` }}
                    />
                  </div>
                </Link>
              ))}
            </div>
          </div>

          <div className="pt-3 border-t border-slate-100 flex items-center justify-between text-[11px] text-slate-500">
            <span className="italic">* Klik baris meja untuk memfilter daftar berkas</span>
            <span className="font-bold text-emerald-700 bg-emerald-50 px-2.5 py-0.5 rounded-md border border-emerald-200">
              Selesai: {mejaStages[4]?.count || 0} Berkas ({mejaStages[4]?.percentage || 0}%)
            </span>
          </div>
        </div>

        {/* GRAFIK 2: Proporsi Pengeluaran (Donut Chart - 5 Kolom) */}
        <div className="lg:col-span-5 bg-white p-6 rounded-3xl border border-purple-100 shadow-2xs flex flex-col justify-between space-y-4">
          <div>
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <h3 className="font-extrabold text-sm text-slate-900 flex items-center gap-2">
                <span className="p-1 rounded-lg bg-purple-100 text-purple-700">
                  <PieIcon className="w-3.5 h-3.5" />
                </span>
                <span>Proporsi Anggaran Belanja</span>
              </h3>

              {/* Mode Toggle Button */}
              <div className="p-0.5 bg-slate-100 rounded-xl flex items-center text-[10px] font-bold">
                <button
                  onClick={() => setDonutMode('kategori')}
                  className={`px-2.5 py-1 rounded-lg transition ${
                    donutMode === 'kategori' 
                      ? 'bg-white text-purple-700 shadow-2xs font-extrabold' 
                      : 'text-slate-500 hover:text-slate-800'
                  }`}
                >
                  Kategori
                </button>
                <button
                  onClick={() => setDonutMode('mekanisme')}
                  className={`px-2.5 py-1 rounded-lg transition ${
                    donutMode === 'mekanisme' 
                      ? 'bg-white text-purple-700 shadow-2xs font-extrabold' 
                      : 'text-slate-500 hover:text-slate-800'
                  }`}
                >
                  Mekanisme
                </button>
              </div>
            </div>

            {/* Donut Chart Visual SVG */}
            <div className="flex flex-col sm:flex-row items-center justify-center gap-5 pt-3">
              <div className="relative w-36 h-36 flex items-center justify-center flex-shrink-0">
                <svg className="w-full h-full -rotate-90" viewBox="0 0 160 160">
                  <circle
                    cx="80"
                    cy="80"
                    r="64"
                    fill="transparent"
                    stroke="#f1f5f9"
                    strokeWidth="18"
                  />
                  {donutSegments.map((segment, idx) => (
                    <circle
                      key={idx}
                      cx="80"
                      cy="80"
                      r="64"
                      fill="transparent"
                      stroke={segment.color}
                      strokeWidth="18"
                      strokeDasharray={segment.strokeDasharray}
                      strokeDashoffset={segment.strokeDashoffset}
                      strokeLinecap="butt"
                      className="transition-all duration-700 hover:opacity-80"
                    />
                  ))}
                </svg>

                <div className="absolute inset-0 flex flex-col items-center justify-center text-center pointer-events-none">
                  <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Total</span>
                  <span className="font-mono text-sm font-black text-purple-950">
                    Rp {formatJutaRupiah(totalNominal)}
                  </span>
                  <span className="text-[9px] text-slate-400 font-semibold">{totalBerkas} Berkas</span>
                </div>
              </div>

              {/* Legenda Donut */}
              <div className="space-y-1.5 flex-1 w-full text-xs">
                {donutData.map((item, idx) => (
                  <div key={idx} className="flex items-center justify-between p-1 rounded-lg hover:bg-slate-50 transition">
                    <div className="flex items-center gap-2 min-w-0">
                      <span
                        className="w-2.5 h-2.5 rounded-full flex-shrink-0"
                        style={{ backgroundColor: item.color }}
                      />
                      <span className="font-semibold text-slate-700 truncate text-[11px]" title={item.label}>
                        {item.label}
                      </span>
                    </div>
                    <div className="text-right flex-shrink-0 font-mono">
                      <span className="font-bold text-slate-900 text-xs">{item.percent}%</span>
                      <span className="text-[10px] text-slate-400 block">
                        {formatJutaRupiah(item.nominal)}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div className="p-3 bg-purple-50/50 rounded-2xl border border-purple-100 flex items-center justify-between text-[11px] text-purple-900">
            <span className="font-semibold">
              {donutMode === 'kategori' ? 'Kategori Anggaran Terbesar:' : 'Mekanisme Terbesar:'}
            </span>
            <span className="font-bold text-purple-950 bg-white px-2.5 py-0.5 rounded-md border border-purple-200">
              {topDonutItem ? `${topDonutItem.label} (${topDonutItem.percent}%)` : '-'}
            </span>
          </div>
        </div>
      </div>

      {/* ROW 2: KINERJA 6 TIM KERJA (BAR) & INDIKATOR KEPATUHAN BERKAS (GAUGE) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
        {/* GRAFIK 3: Kinerja 6 Tim Kerja BPS Sambas (7 Kolom) */}
        <div className="lg:col-span-7 bg-white p-6 rounded-3xl border border-purple-100 shadow-2xs flex flex-col justify-between space-y-4">
          <div>
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <div>
                <h3 className="font-extrabold text-sm text-slate-900 flex items-center gap-2">
                  <span className="p-1 rounded-lg bg-purple-100 text-purple-700">
                    <Building2 className="w-3.5 h-3.5" />
                  </span>
                  <span>Realisasi SPJ Menurut 6 Tim Kerja BPS</span>
                </h3>
                <p className="text-[11px] text-slate-400 mt-0.5">
                  Perbandingan nominal realisasi & persentase penyelesaian per fungsi
                </p>
              </div>

              {/* Metric Toggle */}
              <div className="p-0.5 bg-slate-100 rounded-xl flex items-center text-[10px] font-bold">
                <button
                  onClick={() => setTimMetric('nominal')}
                  className={`px-2.5 py-1 rounded-lg transition ${
                    timMetric === 'nominal' 
                      ? 'bg-white text-purple-700 shadow-2xs font-extrabold' 
                      : 'text-slate-500 hover:text-slate-800'
                  }`}
                >
                  Nominal (Rp)
                </button>
                <button
                  onClick={() => setTimMetric('volume')}
                  className={`px-2.5 py-1 rounded-lg transition ${
                    timMetric === 'volume' 
                      ? 'bg-white text-purple-700 shadow-2xs font-extrabold' 
                      : 'text-slate-500 hover:text-slate-800'
                  }`}
                >
                  Jumlah SPJ
                </button>
              </div>
            </div>

            {/* List 6 Tim Kerja */}
            <div className="space-y-3 mt-4">
              {timChartData.map((tim) => (
                <div key={tim.nama} className="space-y-1">
                  <div className="flex items-center justify-between text-xs">
                    <div className="flex items-center gap-2">
                      <span className="font-bold text-slate-800">Tim {tim.nama}</span>
                      <span className="text-[10px] font-semibold text-purple-700 bg-purple-50 px-1.5 py-0.2 rounded border border-purple-100">
                        {tim.persenSelesai}% selesai
                      </span>
                    </div>

                    <div className="flex items-center gap-2 font-mono">
                      <span className="text-[11px] text-slate-400">
                        {tim.count} Berkas
                      </span>
                      <span className="font-bold text-purple-950 text-xs">
                        {timMetric === 'nominal' 
                          ? `Rp ${tim.nominal.toLocaleString('id-ID')}` 
                          : `${tim.count} Berkas`}
                      </span>
                    </div>
                  </div>

                  <div className="w-full h-2.5 bg-slate-100 rounded-full overflow-hidden flex items-center p-0.5">
                    <div
                      className="h-full rounded-full bg-gradient-to-r from-purple-600 to-indigo-500 transition-all duration-700"
                      style={{ width: `${Math.max(tim.barWidthPercent, tim.nominal > 0 || tim.count > 0 ? 5 : 0)}%` }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="pt-3 border-t border-slate-100 flex items-center justify-between text-[11px] text-slate-500">
            <span>
              Serapan tertinggi:{' '}
              <strong className="text-purple-900">
                {topTim ? `Tim ${topTim.nama} (Rp ${formatJutaRupiah(topTim.nominal)})` : '-'}
              </strong>
            </span>
            <Link to="/pengajuan-spj" className="text-purple-700 font-bold hover:underline flex items-center gap-1">
              <span>Buka Detail</span>
              <ChevronRight className="w-3.5 h-3.5" />
            </Link>
          </div>
        </div>

        {/* GRAFIK 4: Tingkat Kepatuhan & Kelengkapan Berkas (Gauge - 5 Kolom) */}
        <div className="lg:col-span-5 bg-white p-6 rounded-3xl border border-purple-100 shadow-2xs flex flex-col justify-between space-y-4">
          <div>
            <div className="pb-3 border-b border-slate-100">
              <h3 className="font-extrabold text-sm text-slate-900 flex items-center gap-2">
                <span className="p-1 rounded-lg bg-emerald-100 text-emerald-700">
                  <ShieldCheck className="w-3.5 h-3.5" />
                </span>
                <span>Kepatuhan & Kelengkapan Berkas</span>
              </h3>
              <p className="text-[11px] text-slate-400 mt-0.5">
                Rasio kelengkapan dokumen pendukung dan kuitansi fisik
              </p>
            </div>

            {/* Gauge Circle SVG */}
            <div className="flex items-center justify-center gap-6 pt-4">
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
                    <span className="font-bold font-mono text-sm">{complianceStats.lengkap}</span>
                  </div>
                </div>

                <div className="p-2.5 rounded-xl bg-amber-50 border border-amber-200">
                  <div className="flex items-center justify-between text-amber-950">
                    <span className="font-semibold flex items-center gap-1.5">
                      <AlertCircle className="w-3.5 h-3.5 text-amber-600" />
                      <span>Perlu Perbaikan</span>
                    </span>
                    <span className="font-bold font-mono text-sm">{complianceStats.belum}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="p-3 rounded-2xl bg-gradient-to-r from-purple-900 to-indigo-950 text-white text-xs space-y-1">
            <div className="flex items-center justify-between text-[11px] text-purple-200">
              <span className="font-bold uppercase tracking-wider">Status Akuntabilitas:</span>
              <span className="font-mono text-amber-300 font-extrabold">TERTIB ADMINISTRASI</span>
            </div>
            <p className="text-[10px] text-purple-300/80 leading-relaxed">
              Berkas telah divalidasi berjenjang melalui alur resmi 5 meja pengujian SPJ BPS Sambas.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
