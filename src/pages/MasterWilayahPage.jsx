import React, { useState, useMemo } from 'react';
import { 
  MapPin, 
  Search, 
  ChevronRight, 
  ArrowLeft, 
  Building2, 
  Home, 
  Layers, 
  Copy, 
  Check, 
  Filter, 
  ChevronDown, 
  ChevronUp, 
  X
} from 'lucide-react';
import { MASTER_WILAYAH_SAMBAS, STATISTIK_WILAYAH_SAMBAS } from '../lib/wilayahSambasData';

export default function MasterWilayahPage() {
  // State navigasi: null = Tampilan Utama (Kecamatan), string = Kode Kecamatan yang dipilih
  const [selectedKecKode, setSelectedKecKode] = useState(null);
  
  // State pencarian di halaman utama (Kecamatan)
  const [searchKec, setSearchKec] = useState('');
  const [viewMode, setViewMode] = useState('grid'); // 'grid' | 'table'

  // State di halaman detail kecamatan
  const [searchDetail, setSearchDetail] = useState('');
  const [filterDesaKode, setFilterDesaKode] = useState('ALL');
  const [expandedDesa, setExpandedDesa] = useState({});
  const [copiedCode, setCopiedCode] = useState(null);

  // Filter Kecamatan di Halaman Utama
  const filteredKecamatan = useMemo(() => {
    if (!searchKec.trim()) return MASTER_WILAYAH_SAMBAS;
    const q = searchKec.toLowerCase().trim();
    return MASTER_WILAYAH_SAMBAS.filter(k => 
      k.nama_kec.toLowerCase().includes(q) ||
      k.kode_kec.includes(q) ||
      k.kode_full_kec.includes(q) ||
      k.ibu_kota.toLowerCase().includes(q)
    );
  }, [searchKec]);

  // Kecamatan terpilih untuk tampilan detail
  const currentKecamatan = useMemo(() => {
    if (!selectedKecKode) return null;
    return MASTER_WILAYAH_SAMBAS.find(k => k.kode_kec === selectedKecKode);
  }, [selectedKecKode]);

  // Filter Desa & SLS di Halaman Detail Kecamatan
  const filteredDesaList = useMemo(() => {
    if (!currentKecamatan) return [];
    
    let desas = currentKecamatan.desa;
    if (filterDesaKode !== 'ALL') {
      desas = desas.filter(d => d.kode_desa === filterDesaKode);
    }

    if (!searchDetail.trim()) return desas;

    const q = searchDetail.toLowerCase().trim();
    return desas
      .map(d => {
        const matchesDesa = d.nama_desa.toLowerCase().includes(q) || d.kode_desa.includes(q);
        const matchedSls = d.sls.filter(s => 
          s.nama_sls.toLowerCase().includes(q) || 
          s.kode_sls.includes(q) ||
          s.kode_full_sls.includes(q)
        );
        if (matchesDesa) return d;
        if (matchedSls.length > 0) {
          return { ...d, sls: matchedSls };
        }
        return null;
      })
      .filter(Boolean);
  }, [currentKecamatan, filterDesaKode, searchDetail]);

  const toggleExpandDesa = (kodeDesa) => {
    setExpandedDesa(prev => ({
      ...prev,
      [kodeDesa]: !prev[kodeDesa]
    }));
  };

  const expandAllDesa = () => {
    if (!currentKecamatan) return;
    const all = {};
    currentKecamatan.desa.forEach(d => { all[d.kode_desa] = true; });
    setExpandedDesa(all);
  };

  const collapseAllDesa = () => {
    setExpandedDesa({});
  };

  const handleCopy = (text) => {
    navigator.clipboard.writeText(text);
    setCopiedCode(text);
    setTimeout(() => setCopiedCode(null), 2000);
  };

  // --------------------------------------------------------------------------
  // JIKA TAMPILAN DETAIL KECAMATAN AKTIF
  // --------------------------------------------------------------------------
  if (currentKecamatan) {
    return (
      <div className="space-y-6 max-w-6xl mx-auto pb-12 animate-fadeIn">
        {/* Breadcrumb & Navigation Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2 border-b border-purple-100">
          <div>
            <div className="flex items-center gap-2 text-xs font-semibold text-purple-700 mb-1">
              <button 
                onClick={() => { setSelectedKecKode(null); setSearchDetail(''); setFilterDesaKode('ALL'); }}
                className="hover:underline flex items-center gap-1 text-slate-500 hover:text-purple-700 transition"
              >
                <ArrowLeft className="w-3.5 h-3.5" />
                <span>Master Wilayah BPS</span>
              </button>
              <span className="text-slate-300">/</span>
              <span>Kabupaten Sambas (61.01)</span>
              <span className="text-slate-300">/</span>
              <span className="text-purple-900 font-bold">Kec. {currentKecamatan.nama_kec} ({currentKecamatan.kode_kec})</span>
            </div>
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-purple-100 text-purple-700 flex items-center justify-center font-extrabold font-mono text-base shadow-xs">
                {currentKecamatan.kode_kec}
              </div>
              <div>
                <h1 className="text-2xl font-black text-slate-900 tracking-tight flex items-center gap-2">
                  <span>Kecamatan {currentKecamatan.nama_kec}</span>
                  <span className="text-xs font-mono font-bold px-2 py-0.5 rounded-full bg-purple-100 text-purple-800 border border-purple-200">
                    61.01.{currentKecamatan.kode_kec}
                  </span>
                </h1>
                <p className="text-xs text-slate-500 mt-0.5">
                  Ibu Kota: <strong className="text-slate-700">{currentKecamatan.ibu_kota}</strong> • Kode Lengkap: <code className="bg-slate-100 px-1.5 py-0.5 rounded text-purple-700 font-mono text-[11px]">{currentKecamatan.kode_full_kec}</code>
                </p>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => { setSelectedKecKode(null); setSearchDetail(''); setFilterDesaKode('ALL'); }}
              className="inline-flex items-center gap-2 px-3.5 py-2 text-xs font-bold text-slate-700 bg-white border border-slate-200 hover:border-purple-300 hover:bg-purple-50 rounded-xl shadow-2xs transition"
            >
              <ArrowLeft className="w-4 h-4 text-purple-600" />
              <span>Kembali ke 19 Kecamatan</span>
            </button>
          </div>
        </div>

        {/* Ringkasan Statistik Kecamatan Terpilih */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          <div className="bg-white p-3.5 rounded-2xl border border-purple-100 shadow-2xs">
            <div className="flex items-center justify-between text-slate-500">
              <span className="text-xs font-semibold">Total Desa / Kel.</span>
              <Building2 className="w-4 h-4 text-purple-600" />
            </div>
            <p className="text-xl font-extrabold text-slate-900 mt-1">{currentKecamatan.jumlah_desa}</p>
            <span className="text-[10px] text-slate-400">Kode Desa 3 digit (001 s.d. {String(currentKecamatan.jumlah_desa).padStart(3, '0')})</span>
          </div>

          <div className="bg-white p-3.5 rounded-2xl border border-purple-100 shadow-2xs">
            <div className="flex items-center justify-between text-slate-500">
              <span className="text-xs font-semibold">Total SLS (RT/Dusun)</span>
              <Home className="w-4 h-4 text-amber-600" />
            </div>
            <p className="text-xl font-extrabold text-slate-900 mt-1">{currentKecamatan.jumlah_sls}</p>
            <span className="text-[10px] text-slate-400">Kode SLS 4 digit (0001 dst)</span>
          </div>

          <div className="bg-white p-3.5 rounded-2xl border border-purple-100 shadow-2xs">
            <div className="flex items-center justify-between text-slate-500">
              <span className="text-xs font-semibold">Total Sub-SLS</span>
              <Layers className="w-4 h-4 text-emerald-600" />
            </div>
            <p className="text-xl font-extrabold text-slate-900 mt-1">{currentKecamatan.jumlah_sub_sls}</p>
            <span className="text-[10px] text-slate-400">Kode Sub-SLS 2 digit (00/01/02)</span>
          </div>

          <div className="bg-gradient-to-br from-purple-900 to-indigo-950 p-3.5 rounded-2xl text-white shadow-xs">
            <span className="text-[11px] font-semibold text-purple-200">Format ID Hierarki</span>
            <p className="font-mono text-xs font-black tracking-tight text-amber-300 mt-1">
              61.01.{currentKecamatan.kode_kec}.DDD.SSSS.bb
            </p>
            <span className="text-[10px] text-purple-300/80 block mt-1">Standar Pendataan BPS</span>
          </div>
        </div>

        {/* Filter & Kontrol Dalam Kecamatan */}
        <div className="bg-white p-4 rounded-2xl border border-purple-100 shadow-2xs space-y-3">
          <div className="flex flex-col sm:flex-row gap-3 items-stretch sm:items-center justify-between">
            {/* Search Input */}
            <div className="relative flex-1">
              <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
              <input
                type="text"
                placeholder="Cari nama desa, kode desa (3 digit), nama SLS (RT/Dusun), atau kode SLS (4 digit)..."
                value={searchDetail}
                onChange={(e) => setSearchDetail(e.target.value)}
                className="w-full pl-9 pr-4 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500/20 focus:border-purple-600 transition"
              />
              {searchDetail && (
                <button 
                  onClick={() => setSearchDetail('')}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              )}
            </div>

            {/* Filter Dropdown Desa */}
            <div className="flex items-center gap-2">
              <Filter className="w-4 h-4 text-purple-700 hidden sm:block" />
              <select
                value={filterDesaKode}
                onChange={(e) => setFilterDesaKode(e.target.value)}
                className="text-xs bg-white border border-slate-200 rounded-xl px-3 py-2 text-slate-700 font-semibold focus:outline-none focus:border-purple-600 cursor-pointer shadow-2xs"
              >
                <option value="ALL">Semua Desa/Kelurahan ({currentKecamatan.desa.length})</option>
                {currentKecamatan.desa.map(d => (
                  <option key={d.kode_desa} value={d.kode_desa}>
                    [{d.kode_desa}] {d.nama_desa} ({d.jumlah_sls} SLS)
                  </option>
                ))}
              </select>
            </div>

            {/* Expand / Collapse All */}
            <div className="flex items-center gap-1.5 self-end sm:self-auto">
              <button
                onClick={expandAllDesa}
                className="px-2.5 py-1.5 text-[11px] font-semibold text-slate-600 bg-slate-100 hover:bg-slate-200 rounded-lg transition"
                title="Buka semua desa"
              >
                Buka Semua
              </button>
              <button
                onClick={collapseAllDesa}
                className="px-2.5 py-1.5 text-[11px] font-semibold text-slate-600 bg-slate-100 hover:bg-slate-200 rounded-lg transition"
                title="Tutup semua desa"
              >
                Tutup Semua
              </button>
            </div>
          </div>
        </div>

        {/* Daftar Desa & SLS (Accordion / Drilldown) */}
        <div className="space-y-3">
          {filteredDesaList.length === 0 ? (
            <div className="bg-white p-8 rounded-2xl border border-dashed border-slate-200 text-center">
              <MapPin className="w-8 h-8 text-slate-300 mx-auto mb-2" />
              <p className="text-sm font-bold text-slate-700">Tidak ada Desa atau SLS yang sesuai pencarian</p>
              <p className="text-xs text-slate-400 mt-1">Coba kata kunci lain atau pilih "Semua Desa/Kelurahan"</p>
            </div>
          ) : (
            filteredDesaList.map((desa) => {
              const isExpanded = expandedDesa[desa.kode_desa] ?? (filteredDesaList.length === 1 || Boolean(searchDetail.trim()));

              return (
                <div 
                  key={desa.kode_desa} 
                  className={`bg-white rounded-2xl border transition overflow-hidden shadow-2xs ${
                    isExpanded ? 'border-purple-300 ring-2 ring-purple-500/10' : 'border-purple-100 hover:border-purple-200'
                  }`}
                >
                  {/* Desa Header Bar */}
                  <div 
                    onClick={() => toggleExpandDesa(desa.kode_desa)}
                    className="p-3.5 sm:p-4 flex items-center justify-between cursor-pointer bg-gradient-to-r from-purple-50/50 via-white to-white hover:from-purple-50 transition"
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-lg bg-purple-700 text-white flex items-center justify-center font-mono font-bold text-xs shadow-2xs">
                        {desa.kode_desa}
                      </div>
                      <div>
                        <div className="flex items-center gap-2 flex-wrap">
                          <h3 className="font-extrabold text-sm text-slate-900">{desa.nama_desa}</h3>
                          <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                            desa.jenis === 'Kelurahan' 
                              ? 'bg-amber-100 text-amber-800 border border-amber-200' 
                              : 'bg-emerald-100 text-emerald-800 border border-emerald-200'
                          }`}>
                            {desa.jenis}
                          </span>
                          <span className="font-mono text-[11px] font-semibold text-purple-700 bg-purple-100/70 px-2 py-0.5 rounded-md border border-purple-200">
                            {desa.kode_bps_formatted}
                          </span>
                        </div>
                        <p className="text-[11px] text-slate-500 mt-0.5">
                          ID BPS Desa: <code className="font-mono font-bold text-slate-700">{desa.kode_full_desa}</code> • Memiliki <strong className="text-purple-700">{desa.sls.length} Satuan Lingkungan Setempat (SLS)</strong>
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center gap-2">
                      <div className="w-7 h-7 rounded-lg bg-slate-100 flex items-center justify-center text-slate-600">
                        {isExpanded ? <ChevronUp className="w-4 h-4 text-purple-700" /> : <ChevronDown className="w-4 h-4" />}
                      </div>
                    </div>
                  </div>

                  {/* Desa Detail: Tabel SLS & Sub-SLS */}
                  {isExpanded && (
                    <div className="border-t border-purple-100 bg-slate-50/50 p-3 sm:p-4 animate-fadeIn">
                      <div className="overflow-x-auto rounded-xl border border-slate-200 bg-white">
                        <table className="w-full text-left border-collapse text-xs">
                          <thead>
                            <tr className="bg-slate-100/80 text-slate-700 font-bold border-b border-slate-200">
                              <th className="py-2.5 px-3 font-mono text-[11px]">Kode SLS (4 digit)</th>
                              <th className="py-2.5 px-3">Nama Satuan Lingkungan Setempat (SLS)</th>
                              <th className="py-2.5 px-2.5 text-center">Jenis</th>
                              <th className="py-2.5 px-3 font-mono text-[11px]">Sub-SLS (2 digit)</th>
                              <th className="py-2.5 px-3">Rincian Sub-SLS</th>
                              <th className="py-2.5 px-3">Kode BPS Lengkap (ID SLS)</th>
                              <th className="py-2.5 px-2.5 text-center">Salin</th>
                            </tr>
                          </thead>
                          <tbody className="divide-y divide-slate-100">
                            {desa.sls.map((slsItem) => {
                              const fullFormattedCode = `${desa.kode_bps_formatted}.${slsItem.kode_sls}.${slsItem.sub_sls[0]?.kode_sub_sls || '00'}`;
                              const numericFull = `${desa.kode_full_desa}${slsItem.kode_sls}${slsItem.sub_sls[0]?.kode_sub_sls || '00'}`;
                              const isCopied = copiedCode === numericFull;

                              return (
                                <tr key={slsItem.kode_sls} className="hover:bg-purple-50/40 transition">
                                  {/* Kode SLS (4 Digit) */}
                                  <td className="py-2.5 px-3 font-mono font-bold text-purple-900 bg-purple-50/30">
                                    <span className="px-2 py-0.5 rounded bg-purple-100 border border-purple-200 text-purple-800">
                                      {slsItem.kode_sls}
                                    </span>
                                  </td>

                                  {/* Nama SLS */}
                                  <td className="py-2.5 px-3 font-bold text-slate-800">
                                    {slsItem.nama_sls}
                                  </td>

                                  {/* Jenis */}
                                  <td className="py-2.5 px-2.5 text-center">
                                    <span className="text-[10px] font-bold px-1.5 py-0.5 rounded bg-slate-100 text-slate-700">
                                      {slsItem.jenis}
                                    </span>
                                  </td>

                                  {/* Sub-SLS Kode (2 Digit) */}
                                  <td className="py-2.5 px-3 font-mono font-bold text-emerald-800">
                                    {slsItem.sub_sls.map((sub, subIdx) => (
                                      <span key={subIdx} className="inline-block mr-1 px-1.5 py-0.5 rounded bg-emerald-50 border border-emerald-200 text-emerald-700">
                                        {sub.kode_sub_sls}
                                      </span>
                                    ))}
                                  </td>

                                  {/* Nama Sub-SLS */}
                                  <td className="py-2.5 px-3 text-slate-600">
                                    {slsItem.sub_sls.map((sub, subIdx) => (
                                      <div key={subIdx} className="text-[11px] flex items-center gap-1.5">
                                        <span className={`w-1.5 h-1.5 rounded-full ${sub.status === 'Utuh' ? 'bg-emerald-500' : 'bg-amber-500'}`} />
                                        <span>{sub.nama_sub_sls}</span>
                                      </div>
                                    ))}
                                  </td>

                                  {/* Kode BPS Lengkap */}
                                  <td className="py-2.5 px-3 font-mono text-[11px]">
                                    <div className="font-bold text-purple-950">{numericFull}</div>
                                    <div className="text-[10px] text-slate-400">{fullFormattedCode}</div>
                                  </td>

                                  {/* Tombol Salin */}
                                  <td className="py-2.5 px-2.5 text-center">
                                    <button
                                      onClick={() => handleCopy(numericFull)}
                                      className={`p-1.5 rounded-lg border transition ${
                                        isCopied 
                                          ? 'bg-emerald-50 border-emerald-300 text-emerald-700' 
                                          : 'bg-white border-slate-200 text-slate-500 hover:text-purple-700 hover:border-purple-300'
                                      }`}
                                      title="Salin Kode BPS Lengkap"
                                    >
                                      {isCopied ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                                    </button>
                                  </td>
                                </tr>
                              );
                            })}
                          </tbody>
                        </table>
                      </div>
                    </div>
                  )}
                </div>
              );
            })
          )}
        </div>
      </div>
    );
  }

  // --------------------------------------------------------------------------
  // TAMPILAN UTAMA: HANYA TINGKAT KECAMATAN (19 KECAMATAN KABUPATEN SAMBAS)
  // --------------------------------------------------------------------------
  return (
    <div className="space-y-6 max-w-6xl mx-auto pb-12 animate-fadeIn">
      {/* Header Utama Halaman */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-black text-slate-900 tracking-tight flex items-center gap-2.5">
            <div className="p-2 rounded-xl bg-purple-100 text-purple-700 shadow-2xs">
              <MapPin className="w-6 h-6" />
            </div>
            <span>Master Wilayah & SLS Kabupaten Sambas</span>
          </h1>
          <p className="text-xs text-slate-500 mt-1 max-w-2xl">
            Struktur kode wilayah resmi Badan Pusat Statistik (BPS) Republik Indonesia untuk wilayah kerja Kabupaten Sambas, Provinsi Kalimantan Barat.
          </p>
        </div>
      </div>

      {/* Info Card: Penjelasan Struktur Kode Digit BPS */}
      <div className="bg-gradient-to-r from-purple-950 via-purple-900 to-indigo-950 text-white rounded-3xl p-5 shadow-sm border border-purple-800/40">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
          <div className="space-y-1">
            <span className="text-[11px] font-bold uppercase tracking-wider text-purple-300">
              Standar Kodifikasi Wilayah BPS
            </span>
            <h2 className="text-lg font-black text-white">
              Hierarki Digit Wilayah Administrasi & Satuan Lingkungan Setempat (SLS)
            </h2>
            <p className="text-xs text-purple-200/90 max-w-xl">
              Tampilan utama menyajikan 19 kecamatan. <strong>Klik pada salah satu kecamatan</strong> untuk membuka rincian desa/kelurahan (3 digit), SLS (4 digit), dan Sub-SLS (2 digit).
            </p>
          </div>

          <div className="grid grid-cols-3 sm:grid-cols-6 gap-2 w-full md:w-auto">
            <div className="bg-white/10 backdrop-blur-xs p-2.5 rounded-xl text-center border border-white/10">
              <span className="text-[10px] text-purple-200 block">Provinsi</span>
              <span className="font-mono text-base font-black text-amber-300">61</span>
              <span className="text-[9px] text-purple-300 block">2 digit</span>
            </div>
            <div className="bg-white/10 backdrop-blur-xs p-2.5 rounded-xl text-center border border-white/10">
              <span className="text-[10px] text-purple-200 block">Kabupaten</span>
              <span className="font-mono text-base font-black text-amber-300">01</span>
              <span className="text-[9px] text-purple-300 block">2 digit</span>
            </div>
            <div className="bg-white/15 backdrop-blur-xs p-2.5 rounded-xl text-center border border-amber-300/30 ring-1 ring-amber-300/40">
              <span className="text-[10px] text-amber-200 block font-semibold">Kecamatan</span>
              <span className="font-mono text-base font-black text-amber-300">XXX</span>
              <span className="text-[9px] text-amber-300 block">3 digit</span>
            </div>
            <div className="bg-white/10 backdrop-blur-xs p-2.5 rounded-xl text-center border border-white/10">
              <span className="text-[10px] text-purple-200 block">Desa/Kel</span>
              <span className="font-mono text-base font-black text-white">XXX</span>
              <span className="text-[9px] text-purple-300 block">3 digit</span>
            </div>
            <div className="bg-white/10 backdrop-blur-xs p-2.5 rounded-xl text-center border border-white/10">
              <span className="text-[10px] text-purple-200 block">SLS (RT/Dusun)</span>
              <span className="font-mono text-base font-black text-white">XXXX</span>
              <span className="text-[9px] text-purple-300 block">4 digit</span>
            </div>
            <div className="bg-white/10 backdrop-blur-xs p-2.5 rounded-xl text-center border border-white/10">
              <span className="text-[10px] text-purple-200 block">Sub-SLS</span>
              <span className="font-mono text-base font-black text-white">XX</span>
              <span className="text-[9px] text-purple-300 block">2 digit</span>
            </div>
          </div>
        </div>
      </div>

      {/* Ringkasan Statistik Utama Wilayah Sambas */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3.5">
        <div className="bg-white p-4 rounded-2xl border border-purple-100 shadow-2xs hover:border-purple-300 transition">
          <div className="flex items-center justify-between text-slate-500">
            <span className="text-xs font-bold text-slate-600">Total Kecamatan</span>
            <div className="p-1.5 rounded-lg bg-purple-50 text-purple-700">
              <MapPin className="w-4 h-4" />
            </div>
          </div>
          <p className="text-2xl font-black text-purple-950 mt-1">{STATISTIK_WILAYAH_SAMBAS.total_kecamatan}</p>
          <span className="text-[11px] text-slate-400">Kecamatan Resmi BPS</span>
        </div>

        <div className="bg-white p-4 rounded-2xl border border-purple-100 shadow-2xs hover:border-purple-300 transition">
          <div className="flex items-center justify-between text-slate-500">
            <span className="text-xs font-bold text-slate-600">Total Desa / Kelurahan</span>
            <div className="p-1.5 rounded-lg bg-emerald-50 text-emerald-700">
              <Building2 className="w-4 h-4" />
            </div>
          </div>
          <p className="text-2xl font-black text-slate-900 mt-1">{STATISTIK_WILAYAH_SAMBAS.total_desa}</p>
          <span className="text-[11px] text-slate-400">Desa & Kelurahan (3 digit)</span>
        </div>

        <div className="bg-white p-4 rounded-2xl border border-purple-100 shadow-2xs hover:border-purple-300 transition">
          <div className="flex items-center justify-between text-slate-500">
            <span className="text-xs font-bold text-slate-600">Total Satuan SLS</span>
            <div className="p-1.5 rounded-lg bg-amber-50 text-amber-700">
              <Home className="w-4 h-4" />
            </div>
          </div>
          <p className="text-2xl font-black text-slate-900 mt-1">
            {STATISTIK_WILAYAH_SAMBAS.total_sls.toLocaleString('id-ID')}
          </p>
          <span className="text-[11px] text-slate-400">RT, RW, & Dusun (4 digit)</span>
        </div>

        <div className="bg-white p-4 rounded-2xl border border-purple-100 shadow-2xs hover:border-purple-300 transition">
          <div className="flex items-center justify-between text-slate-500">
            <span className="text-xs font-bold text-slate-600">Total Sub-SLS</span>
            <div className="p-1.5 rounded-lg bg-indigo-50 text-indigo-700">
              <Layers className="w-4 h-4" />
            </div>
          </div>
          <p className="text-2xl font-black text-slate-900 mt-1">
            {STATISTIK_WILAYAH_SAMBAS.total_sub_sls.toLocaleString('id-ID')}
          </p>
          <span className="text-[11px] text-slate-400">Pecahan Sub-SLS (2 digit)</span>
        </div>
      </div>

      {/* Kontrol Pencarian & Filter Tingkat Kecamatan */}
      <div className="bg-white p-4 rounded-2xl border border-purple-100 shadow-2xs flex flex-col sm:flex-row gap-3 items-stretch sm:items-center justify-between">
        <div className="relative flex-1">
          <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            placeholder="Cari kecamatan (nama atau kode 3 digit: 010 Selakau, 040 Sambas, 020 Pemangkat, dll)..."
            value={searchKec}
            onChange={(e) => setSearchKec(e.target.value)}
            className="w-full pl-9 pr-4 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500/20 focus:border-purple-600 transition"
          />
          {searchKec && (
            <button 
              onClick={() => setSearchKec('')}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          )}
        </div>

        <div className="flex items-center gap-2">
          <span className="text-xs font-semibold text-slate-500">
            Menampilkan: <strong className="text-purple-700">{filteredKecamatan.length}</strong> dari 19 Kecamatan
          </span>

          <div className="flex items-center p-0.5 bg-slate-100 rounded-xl border border-slate-200">
            <button
              onClick={() => setViewMode('grid')}
              className={`px-3 py-1 text-xs font-bold rounded-lg transition ${
                viewMode === 'grid' 
                  ? 'bg-white text-purple-700 shadow-2xs' 
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Grid Kartu
            </button>
            <button
              onClick={() => setViewMode('table')}
              className={`px-3 py-1 text-xs font-bold rounded-lg transition ${
                viewMode === 'table' 
                  ? 'bg-white text-purple-700 shadow-2xs' 
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Tabel
            </button>
          </div>
        </div>
      </div>

      {/* TAMPILAN GRID KARTU (19 KECAMATAN) */}
      {viewMode === 'grid' && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3.5">
          {filteredKecamatan.map((kec) => (
            <div
              key={kec.kode_kec}
              onClick={() => setSelectedKecKode(kec.kode_kec)}
              className="group bg-white p-4 rounded-2xl border border-purple-100 shadow-2xs hover:border-purple-400 hover:shadow-md transition-all cursor-pointer relative overflow-hidden flex flex-col justify-between"
            >
              <div className="absolute top-0 right-0 w-24 h-24 bg-gradient-to-br from-purple-100/40 to-transparent rounded-bl-full pointer-events-none group-hover:scale-110 transition-transform" />

              <div>
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-1.5">
                    <span className="font-mono text-xs font-extrabold px-2 py-0.5 rounded-lg bg-purple-100 text-purple-800 border border-purple-200">
                      Kode: {kec.kode_kec}
                    </span>
                    <span className="font-mono text-[10px] text-slate-400">
                      61.01.{kec.kode_kec}
                    </span>
                  </div>
                  <ChevronRight className="w-4 h-4 text-slate-300 group-hover:text-purple-600 group-hover:translate-x-0.5 transition" />
                </div>

                <h3 className="font-extrabold text-base text-slate-900 group-hover:text-purple-700 transition">
                  Kecamatan {kec.nama_kec}
                </h3>
                <p className="text-xs text-slate-500 mt-0.5">
                  Ibu Kota: <span className="font-semibold text-slate-700">{kec.ibu_kota}</span>
                </p>
              </div>

              <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between text-xs">
                <div className="flex items-center gap-3">
                  <span className="text-slate-600 font-medium">
                    <strong className="text-slate-900 font-extrabold">{kec.jumlah_desa}</strong> Desa
                  </span>
                  <span className="text-slate-300">•</span>
                  <span className="text-slate-600 font-medium">
                    <strong className="text-purple-700 font-extrabold">{kec.jumlah_sls}</strong> SLS
                  </span>
                </div>

                <span className="text-[11px] font-bold text-purple-600 group-hover:underline flex items-center gap-1">
                  Detail SLS →
                </span>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* TAMPILAN TABEL (19 KECAMATAN) */}
      {viewMode === 'table' && (
        <div className="bg-white rounded-2xl border border-purple-100 shadow-2xs overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse text-xs">
              <thead>
                <tr className="bg-purple-50/60 text-purple-950 font-bold border-b border-purple-100">
                  <th className="py-3 px-3 w-12 text-center">No</th>
                  <th className="py-3 px-3 font-mono">Kode BPS (3 digit)</th>
                  <th className="py-3 px-3 font-mono">ID Lengkap</th>
                  <th className="py-3 px-4">Nama Kecamatan</th>
                  <th className="py-3 px-3">Ibu Kota</th>
                  <th className="py-3 px-3 text-center">Jumlah Desa</th>
                  <th className="py-3 px-3 text-center">Jumlah SLS</th>
                  <th className="py-3 px-3 text-center">Jumlah Sub-SLS</th>
                  <th className="py-3 px-3 text-center">Aksi</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {filteredKecamatan.map((kec, idx) => (
                  <tr 
                    key={kec.kode_kec}
                    onClick={() => setSelectedKecKode(kec.kode_kec)}
                    className="hover:bg-purple-50/50 cursor-pointer transition"
                  >
                    <td className="py-3 px-3 text-center text-slate-400 font-semibold">{idx + 1}</td>
                    <td className="py-3 px-3 font-mono font-bold text-purple-800">
                      <span className="px-2 py-0.5 rounded bg-purple-100 border border-purple-200">
                        {kec.kode_kec}
                      </span>
                    </td>
                    <td className="py-3 px-3 font-mono text-slate-500">{kec.kode_full_kec}</td>
                    <td className="py-3 px-4 font-extrabold text-slate-900 text-sm">
                      Kecamatan {kec.nama_kec}
                    </td>
                    <td className="py-3 px-3 text-slate-600 font-medium">{kec.ibu_kota}</td>
                    <td className="py-3 px-3 text-center font-bold text-slate-800">{kec.jumlah_desa}</td>
                    <td className="py-3 px-3 text-center font-bold text-purple-700">{kec.jumlah_sls}</td>
                    <td className="py-3 px-3 text-center font-bold text-emerald-700">{kec.jumlah_sub_sls}</td>
                    <td className="py-3 px-3 text-center">
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          setSelectedKecKode(kec.kode_kec);
                        }}
                        className="inline-flex items-center gap-1 px-3 py-1 text-xs font-bold text-purple-700 bg-purple-50 hover:bg-purple-100 border border-purple-200 rounded-lg transition"
                      >
                        <span>Lihat Detail</span>
                        <ChevronRight className="w-3.5 h-3.5" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}
