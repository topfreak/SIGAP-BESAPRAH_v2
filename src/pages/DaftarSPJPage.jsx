import React, { useState, useMemo } from 'react';
import { Link, useSearchParams, useNavigate } from 'react-router-dom';
import { 
  FileSpreadsheet, 
  FilePlus2, 
  Download, 
  CheckSquare, 
  Search, 
  Filter, 
  Eye, 
  CheckCircle2, 
  AlertCircle, 
  ChevronRight,
  LayoutGrid,
  Table as TableIcon,
  User,
  Clock,
  Building2,
  Calendar,
  Lock,
  UserCheck
} from 'lucide-react';
import * as XLSX from 'xlsx';
import { useAuth } from '../context/AuthContext';
import { TIM_KERJA_LIST } from '../lib/seedData';
import { canActOnTransaction } from '../lib/permissions';
import Badge from '../components/common/Badge';

export default function DaftarSPJPage() {
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();
  const { transactions, updateTransactionStatus, currentUser, canAccess } = useAuth();

  const activeTab = searchParams.get('tab') || 'Semua';
  const queryParam = searchParams.get('q') || '';

  const [searchQuery, setSearchQuery] = useState(queryParam);
  const [selectedTim, setSelectedTim] = useState('Semua');
  const [selectedMeja, setSelectedMeja] = useState('Semua');
  const [viewMode, setViewMode] = useState('table'); // 'table' or 'card'
  const [selectedRows, setSelectedRows] = useState([]);
  const [massSuccessMsg, setMassSuccessMsg] = useState('');

  const isSuperadmin = currentUser?.role === 'superadmin';
  const isPimpinanOrKeuangan = ['superadmin', 'kpa', 'ppk', 'ppspm', 'bendahara'].includes(currentUser?.role);

  // Counts for tabs (Alur: PJ -> PPK -> Bendahara -> PPSPM -> Arsip)
  const tabCounts = useMemo(() => {
    return {
      Semua: transactions.length,
      'Perlu Perbaikan': transactions.filter(t => t.status_dokumen === 'Perlu Perbaikan').length,
      'Di PPK': transactions.filter(t => t.status_dokumen === 'Di PPK').length,
      'Di Bendahara': transactions.filter(t => t.status_dokumen === 'Di Bendahara').length,
      'Di PPSPM': transactions.filter(t => t.status_dokumen === 'Di PPSPM').length,
      'Selesai': transactions.filter(t => t.status_dokumen === 'Selesai').length,
    };
  }, [transactions]);

  // Filtered transactions
  const filteredData = useMemo(() => {
    return transactions.filter(item => {
      // Tab filter
      if (activeTab === 'Perlu Perbaikan' && item.status_dokumen !== 'Perlu Perbaikan') return false;
      if (activeTab === 'Di PPK' && item.status_dokumen !== 'Di PPK') return false;
      if (activeTab === 'Di PPSPM' && item.status_dokumen !== 'Di PPSPM') return false;
      if (activeTab === 'Di Bendahara' && item.status_dokumen !== 'Di Bendahara') return false;
      if (activeTab === 'Selesai' && item.status_dokumen !== 'Selesai') return false;

      // Tim filter
      if (selectedTim !== 'Semua' && item.tim_kerja !== selectedTim) return false;

      // Meja filter
      if (selectedMeja !== 'Semua') {
        if (!item.meja_berkas?.toLowerCase().includes(selectedMeja.toLowerCase())) return false;
      }

      // Search query
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        const matchUraian = item.uraian_kegiatan?.toLowerCase().includes(q);
        const matchNo = item.no_spm_spp?.toLowerCase().includes(q) || item.no_pengajuan?.toLowerCase().includes(q);
        const matchPJ = item.pj_nama?.toLowerCase().includes(q);
        const matchPengaju = item.pengaju_nama?.toLowerCase().includes(q);
        const matchMeja = item.meja_berkas?.toLowerCase().includes(q);
        const matchCatatan = item.catatan_kekurangan?.toLowerCase().includes(q);
        return matchUraian || matchNo || matchPJ || matchPengaju || matchMeja || matchCatatan;
      }

      return true;
    });
  }, [transactions, activeTab, selectedTim, selectedMeja, searchQuery]);

  // Handle Tab Change
  const handleTabClick = (tab) => {
    setSearchParams(prev => {
      if (tab === 'Semua') {
        prev.delete('tab');
      } else {
        prev.set('tab', tab);
      }
      return prev;
    });
  };

  const actionableItems = useMemo(() => {
    return filteredData.filter(d => canActOnTransaction(currentUser, d));
  }, [filteredData, currentUser]);

  const toggleSelectRow = (id) => {
    const item = transactions.find(t => t.id === id);
    if (!item || !canActOnTransaction(currentUser, item)) {
      return; // Tidak dapat memilih berkas yang sedang di meja pejabat lain
    }
    setSelectedRows(prev => 
      prev.includes(id) ? prev.filter(r => r !== id) : [...prev, id]
    );
  };

  const toggleSelectAll = () => {
    if (selectedRows.length === actionableItems.length && actionableItems.length > 0) {
      setSelectedRows([]);
    } else {
      setSelectedRows(actionableItems.map(d => d.id));
    }
  };

  // Mass action
  const handleMassApproval = () => {
    if (selectedRows.length === 0) return;
    
    let processedCount = 0;
    selectedRows.forEach(id => {
      const tx = transactions.find(t => t.id === id);
      if (!tx || !canActOnTransaction(currentUser, tx)) return;

      if (tx.status_dokumen === 'Di PPK' && (currentUser?.role === 'ppk' || isSuperadmin)) {
        updateTransactionStatus(id, {
          status_dokumen: 'Di Bendahara',
          posisi_dokumen: 'Di Bendahara',
          meja_berkas: 'Meja Bendahara (Verifikasi Kuitansi, Pajak & Kas)',
          review_ppk: 'Disetujui massal oleh PPK'
        });
        processedCount++;
      } else if (tx.status_dokumen === 'Di Bendahara' && (currentUser?.role === 'bendahara' || isSuperadmin)) {
        updateTransactionStatus(id, {
          status_dokumen: 'Di PPSPM',
          posisi_dokumen: 'Di PPSPM',
          meja_berkas: 'Meja PPSPM (Pengujian Formal & Penerbitan SPM)',
          review_bdh: 'Diverifikasi massal oleh Bendahara'
        });
        processedCount++;
      } else if (tx.status_dokumen === 'Di PPSPM' && (currentUser?.role === 'ppspm' || currentUser?.role === 'kpa' || isSuperadmin)) {
        updateTransactionStatus(id, {
          status_dokumen: 'Selesai',
          posisi_dokumen: 'Selesai',
          meja_berkas: 'Meja Arsip Keuangan (Lunas / SP2D Terbit)',
          kelengkapan_dokumen: 'LENGKAP',
          tanggal_sp2d: new Date().toISOString().split('T')[0],
          review_ppspm: 'SPM disahkan massal oleh PPSPM'
        });
        processedCount++;
      } else if (tx.status_dokumen === 'Draft' || tx.status_dokumen === 'Perlu Perbaikan') {
        updateTransactionStatus(id, {
          status_dokumen: 'Di PPK',
          posisi_dokumen: 'Di PPK',
          meja_berkas: 'Meja PPK (Peninjauan Komitmen & SPP)',
          review_ppk: 'Diajukan massal oleh PJ'
        });
        processedCount++;
      }
    });

    if (processedCount > 0) {
      setMassSuccessMsg(`${processedCount} dokumen di meja wewenang Anda berhasil dipindahkan secara massal!`);
    } else {
      setMassSuccessMsg('Tidak ada dokumen terpilih yang saat ini berada di bawah wewenang meja Anda.');
    }
    setSelectedRows([]);
    setTimeout(() => setMassSuccessMsg(''), 4000);
  };

  const handleExportExcel = () => {
    const dataForExport = filteredData.map((d, idx) => ({
      'No.': idx + 1,
      'Posisi Meja Berkas': d.meja_berkas || d.posisi_dokumen,
      'Kategori Belanja': d.kategori_belanja,
      'Uraian Kegiatan': d.uraian_kegiatan,
      'Tanggal Terima': d.tanggal_terima || '',
      'Tanggal Proses': d.tanggal_proses || '',
      'Jumlah Pengeluaran': d.jumlah_pengeluaran,
      'Jumlah Potongan': d.jumlah_potongan,
      'Jumlah Pembayaran': d.jumlah_pembayaran,
      'Status Dokumen': d.status_dokumen,
      'Kelengkapan Dokumen': d.kelengkapan_dokumen,
      'LS/GUP': d.mekanisme_ls_gup,
      'NO SPM/SPP': d.no_spm_spp || d.no_pengajuan,
      'Tanggal SP2D': d.tanggal_sp2d || '',
      'Catatan': d.catatan_kekurangan || ''
    }));

    const ws = XLSX.utils.json_to_sheet(dataForExport);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "SPJ_Proses");
    XLSX.writeFile(wb, `SPJ_Proses_BPS_Sambas_${new Date().toISOString().split('T')[0]}.xlsx`);
  };

  return (
    <div className="space-y-5">
      {/* Breadcrumb & Header Action */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <nav className="text-xs text-slate-400 font-semibold mb-1 flex items-center gap-1.5">
            <span>Pengajuan</span>
            <ChevronRight className="w-3.5 h-3.5" />
            <span className="text-purple-700">Daftar Monitoring SPJ</span>
          </nav>
          <h1 className="text-2xl font-extrabold text-slate-900 tracking-tight">
            Monitoring & Penatausahaan SPJ
          </h1>
          <p className="text-xs text-slate-500">
            Pelacakan posisi meja berkas fisik/digital secara real-time dan terperinci
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          {/* View Mode Toggle */}
          <div className="flex items-center bg-white border border-purple-200 rounded-xl p-1 shadow-2xs">
            <button
              onClick={() => setViewMode('table')}
              className={`p-1.5 rounded-lg text-xs font-bold transition flex items-center gap-1 ${
                viewMode === 'table' ? 'bg-purple-900 text-white' : 'text-slate-600 hover:bg-purple-50'
              }`}
              title="Tampilan Tabel Pas Layar (No-Scroll)"
            >
              <TableIcon className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Tabel Fit</span>
            </button>
            <button
              onClick={() => setViewMode('card')}
              className={`p-1.5 rounded-lg text-xs font-bold transition flex items-center gap-1 ${
                viewMode === 'card' ? 'bg-purple-900 text-white' : 'text-slate-600 hover:bg-purple-50'
              }`}
              title="Tampilan Kartu Ringkas"
            >
              <LayoutGrid className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Kartu</span>
            </button>
          </div>

          {canAccess('/pengajuan-spj/baru') && (
            <Link
              to="/pengajuan-spj/baru"
              className="px-4 py-2 rounded-xl bg-gradient-to-r from-purple-700 to-indigo-600 hover:from-purple-800 hover:to-indigo-700 text-white font-bold text-xs shadow-md transition flex items-center gap-1.5"
            >
              <FilePlus2 className="w-4 h-4" />
              <span>+ Ajukan SPJ Baru</span>
            </Link>
          )}

          {isPimpinanOrKeuangan && (
            <button
              onClick={handleExportExcel}
              className="px-3.5 py-2 rounded-xl bg-white hover:bg-emerald-50 text-emerald-700 font-bold text-xs border border-emerald-200 transition flex items-center gap-1.5 shadow-2xs"
            >
              <Download className="w-4 h-4" />
              <span>Export</span>
            </button>
          )}

          {isPimpinanOrKeuangan && selectedRows.length > 0 && (
            <button
              onClick={handleMassApproval}
              className="px-3.5 py-2 rounded-xl bg-amber-400 hover:bg-amber-300 text-purple-950 font-bold text-xs shadow-md transition flex items-center gap-1.5 animate-pulse"
            >
              <CheckSquare className="w-4 h-4" />
              <span>Proses ke Meja Berikutnya ({selectedRows.length})</span>
            </button>
          )}
        </div>
      </div>

      {/* Alert info banner */}
      {massSuccessMsg && (
        <div className="p-3.5 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-semibold flex items-center gap-2">
          <CheckCircle2 className="w-4 h-4 text-emerald-600 flex-shrink-0" />
          <span>{massSuccessMsg}</span>
        </div>
      )}

      {/* Filter Tabs Bar (Alur: PJ -> PPK -> Bendahara -> PPSPM -> Arsip) */}
      <div className="flex flex-wrap items-center gap-2 border-b border-purple-100 pb-2.5">
        {[
          { key: 'Semua', label: 'Semua Berkas' },
          { key: 'Perlu Perbaikan', label: 'Meja PJ (Perlu Revisi)' },
          { key: 'Di PPK', label: 'Meja PPK' },
          { key: 'Di Bendahara', label: 'Meja Bendahara' },
          { key: 'Di PPSPM', label: 'Meja PPSPM' },
          { key: 'Selesai', label: 'Meja Arsip (Cair)' }
        ].map((tab) => {
          const isActive = activeTab === tab.key;
          const count = tabCounts[tab.key] || 0;
          return (
            <button
              key={tab.key}
              onClick={() => handleTabClick(tab.key)}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition flex items-center gap-1.5 ${
                isActive
                  ? 'bg-purple-900 text-white shadow-md shadow-purple-900/20'
                  : 'bg-white hover:bg-purple-50 text-slate-600 border border-purple-100'
              }`}
            >
              <span>{tab.label}</span>
              <span className={`px-1.5 py-0.2 rounded-full text-[10px] font-extrabold ${
                isActive 
                  ? 'bg-amber-300 text-purple-950' 
                  : tab.key === 'Perlu Perbaikan' ? 'bg-amber-100 text-amber-900' : 'bg-purple-100 text-purple-800'
              }`}>
                {count}
              </span>
            </button>
          );
        })}
      </div>

      {/* Controls filter & search */}
      <div className="p-3.5 rounded-2xl bg-white border border-purple-100 shadow-2xs flex flex-col md:flex-row items-center justify-between gap-3">
        <div className="relative w-full md:w-80">
          <Search className="w-4 h-4 text-purple-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Cari no. SPM, uraian, posisi meja, atau nama PJ..."
            className="w-full pl-9 pr-3 py-1.5 bg-purple-50/50 border border-purple-150 rounded-xl text-xs text-slate-800 placeholder-purple-400/80 focus:outline-none focus:ring-2 focus:ring-purple-400"
          />
        </div>

        <div className="flex flex-wrap items-center gap-2 w-full md:w-auto">
          <select
            value={selectedMeja}
            onChange={(e) => setSelectedMeja(e.target.value)}
            className="px-3 py-1.5 bg-purple-50/50 border border-purple-150 rounded-xl text-xs font-medium text-slate-700 focus:outline-none"
          >
            <option value="Semua">Semua Posisi Meja</option>
            <option value="PPK">🗄️ Meja PPK</option>
            <option value="PPSPM">⚖️ Meja PPSPM</option>
            <option value="Bendahara">💼 Meja Bendahara</option>
            <option value="PJ">📝 Meja PJ (Revisi)</option>
            <option value="Arsip">🏛️ Meja Arsip (Cair)</option>
          </select>

          <select
            value={selectedTim}
            onChange={(e) => setSelectedTim(e.target.value)}
            className="px-3 py-1.5 bg-purple-50/50 border border-purple-150 rounded-xl text-xs font-medium text-slate-700 focus:outline-none"
          >
            <option value="Semua">Semua Tim Kerja</option>
            {TIM_KERJA_LIST.map(t => (
              <option key={t.id} value={t.id}>{t.nama}</option>
            ))}
          </select>
        </div>
      </div>

      {/* VIEW 1: TABLE VIEW (FIT TO SCREEN - NO HORIZONTAL SCROLL) */}
      {viewMode === 'table' ? (
        <div className="bg-white rounded-3xl border border-purple-100 shadow-sm overflow-hidden w-full">
          <table className="w-full text-left text-xs table-fixed border-collapse">
            <thead className="bg-[#250b52] text-purple-100 font-extrabold uppercase text-[10px] tracking-wider select-none">
              <tr>
                {isPimpinanOrKeuangan && (
                  <th className="py-3 px-2 w-[3%] text-center">
                    <input
                      type="checkbox"
                      checked={actionableItems.length > 0 && selectedRows.length === actionableItems.length}
                      disabled={actionableItems.length === 0}
                      onChange={toggleSelectAll}
                      className="rounded border-purple-300 text-purple-600 focus:ring-purple-500 cursor-pointer disabled:opacity-30"
                      title={actionableItems.length > 0 ? "Pilih semua berkas di meja wewenang Anda" : "Tidak ada berkas di meja Anda"}
                    />
                  </th>
                )}
                <th className="py-3 px-3 w-[15%]">No. SPM & Jalur</th>
                <th className="py-3 px-3 w-[30%]">Uraian Kegiatan & Tim</th>
                <th className="py-3 px-3 w-[20%]">📍 Posisi Meja Berkas</th>
                <th className="py-3 px-3 w-[14%]">PJ & Pengaju</th>
                <th className="py-3 px-3 w-[14%] text-right">Pembayaran (Netto)</th>
                <th className="py-3 px-2 w-[7%] text-center">Aksi</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-purple-50">
              {filteredData.length === 0 ? (
                <tr>
                  <td colSpan={7} className="py-12 text-center text-slate-400">
                    <AlertCircle className="w-7 h-7 text-purple-300 mx-auto mb-2" />
                    <p className="font-semibold text-slate-600">Tidak ada pengajuan yang sesuai dengan kriteria filter.</p>
                  </td>
                </tr>
              ) : (
                filteredData.map((item) => {
                  const isChecked = selectedRows.includes(item.id);
                  return (
                    <tr 
                      key={item.id} 
                      className={`hover:bg-purple-50/40 transition ${isChecked ? 'bg-purple-50/70' : ''}`}
                    >
                      {isPimpinanOrKeuangan && (
                        <td className="py-2.5 px-2 text-center">
                          {canActOnTransaction(currentUser, item) ? (
                            <input
                              type="checkbox"
                              checked={isChecked}
                              onChange={() => toggleSelectRow(item.id)}
                              className="rounded border-purple-300 text-purple-600 cursor-pointer"
                              title="Centang untuk proses berkas di meja Anda"
                            />
                          ) : (
                            <span title="Wewenang terkunci: Berkas saat ini sedang berada di meja lain">
                              <Lock className="w-3.5 h-3.5 text-slate-300 mx-auto" />
                            </span>
                          )}
                        </td>
                      )}

                      {/* Col 1: No SPM & Jalur */}
                      <td className="py-2.5 px-3">
                        <div className="font-mono font-extrabold text-purple-950 text-xs">
                          {item.no_spm_spp || item.no_pengajuan}
                        </div>
                        <div className="flex items-center gap-1.5 mt-1">
                          <Badge status={item.mekanisme_ls_gup || 'LS'} type="ls_gup" />
                          <span className="text-[10px] text-slate-400 font-mono">
                            {item.tanggal_terima ? item.tanggal_terima.slice(5) : ''}
                          </span>
                        </div>
                      </td>

                      {/* Col 2: Uraian Kegiatan & Tim */}
                      <td className="py-2.5 px-3">
                        <div className="font-bold text-slate-900 leading-snug break-words">
                          {item.uraian_kegiatan}
                        </div>
                        <div className="flex flex-wrap items-center gap-1.5 mt-1 text-[10px]">
                          <span className="font-mono font-bold text-purple-700 bg-purple-100 px-1.5 py-0.2 rounded">
                            {item.kode_akun}
                          </span>
                          <span className="text-purple-800 font-medium">
                            {item.tim_kerja}
                          </span>
                          {item.catatan_kekurangan && (
                            <span className="text-amber-800 font-semibold truncate max-w-[200px]" title={item.catatan_kekurangan}>
                              ⚠️ {item.catatan_kekurangan}
                            </span>
                          )}
                        </div>
                      </td>

                      {/* Col 3: Posisi Meja Berkas (KETERANGAN MEJA SANGAT JELAS) */}
                      <td className="py-2.5 px-3">
                        <div className="space-y-1">
                          <Badge meja={item.meja_berkas || item.posisi_dokumen} type="meja" />
                          <div className="flex items-center gap-1 text-[10px]">
                            <Badge status={item.kelengkapan_dokumen || 'BELUM LENGKAP'} type="kelengkapan" />
                          </div>
                        </div>
                      </td>

                      {/* Col 4: PJ & Pengaju */}
                      <td className="py-2.5 px-3">
                        <div className="font-semibold text-slate-800 text-[11px] truncate" title={item.pj_nama}>
                          {item.pj_nama}
                        </div>
                        <div className="text-[10px] text-slate-400 truncate" title={item.pengaju_nama}>
                          Pengaju: {item.pengaju_nama || '-'}
                        </div>
                      </td>

                      {/* Col 5: Pembayaran (Netto) */}
                      <td className="py-2.5 px-3 text-right">
                        <div className="font-mono font-extrabold text-xs text-emerald-700">
                          Rp {Number(item.jumlah_pembayaran || 0).toLocaleString('id-ID')}
                        </div>
                        <div className="text-[10px] text-slate-400 font-mono">
                          Bruto: {Number(item.jumlah_pengeluaran || 0).toLocaleString('id-ID')}
                        </div>
                      </td>

                      {/* Col 6: Aksi */}
                      <td className="py-2.5 px-2 text-center">
                        <Link
                          to={`/pengajuan-spj/${item.id}`}
                          className="px-2.5 py-1 rounded-lg bg-purple-100 hover:bg-purple-200 text-purple-900 font-bold text-[10px] inline-flex items-center gap-1 transition"
                        >
                          <Eye className="w-3 h-3 text-purple-700" />
                          <span>Buka</span>
                        </Link>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>

          {/* Footer note */}
          <div className="p-3 bg-purple-50/40 border-t border-purple-100 flex items-center justify-between text-[11px] text-slate-500">
            <span>Menampilkan <strong>{filteredData.length}</strong> berkas SPJ (Pas Layar / Tanpa Scroll Samping)</span>
            <span className="text-purple-800 font-semibold italic">
              * Tanda meja berkas mencerminkan pejabat penanggung jawab saat ini
            </span>
          </div>
        </div>
      ) : (
        /* VIEW 2: CARD VIEW */
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredData.map((item) => (
            <div 
              key={item.id}
              className="p-5 rounded-3xl bg-white border border-purple-100 shadow-xs hover:border-purple-300 transition space-y-3"
            >
              <div className="flex items-center justify-between">
                <span className="font-mono font-extrabold text-xs text-purple-950 bg-purple-100 px-2 py-0.5 rounded">
                  {item.no_spm_spp || item.no_pengajuan}
                </span>
                <Badge status={item.mekanisme_ls_gup || 'LS'} type="ls_gup" />
              </div>

              <div>
                <h3 className="font-bold text-xs text-slate-900 leading-snug">
                  {item.uraian_kegiatan}
                </h3>
                <div className="flex items-center gap-2 mt-1 text-[10px] text-slate-400">
                  <span className="font-mono text-purple-700 font-bold">{item.kode_akun}</span>
                  <span>•</span>
                  <span>{item.tim_kerja}</span>
                </div>
              </div>

              {/* Meja Indicator */}
              <div className="p-2.5 rounded-2xl bg-purple-50/70 border border-purple-100 space-y-1">
                <span className="text-[10px] text-slate-500 font-semibold block">Posisi Berkas Saat Ini:</span>
                <Badge meja={item.meja_berkas || item.posisi_dokumen} type="meja" />
              </div>

              <div className="flex items-center justify-between pt-2 border-t border-purple-50 text-xs">
                <div>
                  <span className="text-[10px] text-slate-400 block">Jumlah Netto:</span>
                  <span className="font-mono font-extrabold text-emerald-700 text-sm">
                    Rp {Number(item.jumlah_pembayaran || 0).toLocaleString('id-ID')}
                  </span>
                </div>
                <Link
                  to={`/pengajuan-spj/${item.id}`}
                  className="px-3 py-1.5 rounded-xl bg-purple-700 hover:bg-purple-800 text-white font-bold text-xs flex items-center gap-1 shadow-xs"
                >
                  <Eye className="w-3.5 h-3.5 text-amber-300" />
                  <span>Detail</span>
                </Link>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
