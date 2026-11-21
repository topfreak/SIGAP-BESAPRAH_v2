import React, { useState } from 'react';
import { Download, FileSpreadsheet, Filter, CheckCircle2, Calendar } from 'lucide-react';
import * as XLSX from 'xlsx';
import { useAuth } from '../context/AuthContext';

export default function RekapitulasiPage() {
  const { transactions } = useAuth();
  const [selectedTim, setSelectedTim] = useState('Semua');
  const [selectedStatus, setSelectedStatus] = useState('Semua');

  const filtered = transactions.filter(t => {
    if (selectedTim !== 'Semua' && t.tim_kerja !== selectedTim) return false;
    if (selectedStatus !== 'Semua' && t.status_dokumen !== selectedStatus) return false;
    return true;
  });

  const totalPengeluaran = filtered.reduce((acc, curr) => acc + (Number(curr.jumlah_pengeluaran) || 0), 0);
  const totalPotongan = filtered.reduce((acc, curr) => acc + (Number(curr.jumlah_potongan) || 0), 0);
  const totalPembayaran = filtered.reduce((acc, curr) => acc + (Number(curr.jumlah_pembayaran) || 0), 0);

  const handleExport = () => {
    const data = filtered.map((d, i) => ({
      'No.': i + 1,
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

    const ws = XLSX.utils.json_to_sheet(data);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "SPJ_Proses_2026");
    XLSX.writeFile(wb, `Rekapitulasi_SPJ_BPS_Sambas_${new Date().toISOString().split('T')[0]}.xlsx`);
  };

  return (
    <div className="space-y-6 max-w-6xl mx-auto">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-extrabold text-slate-900 tracking-tight flex items-center gap-2.5">
            <Download className="w-7 h-7 text-purple-700" />
            <span>Rekapitulasi & Ekspor Laporan SPJ</span>
          </h1>
          <p className="text-xs text-slate-500 mt-0.5">
            Unduh rekapitulasi penatausahaan SPJ yang 100% kompatibel dengan file Excel SPJ Proses 2026
          </p>
        </div>

        <button
          onClick={handleExport}
          className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-700 hover:from-emerald-700 hover:to-teal-800 text-white font-bold text-xs shadow-md transition flex items-center gap-2 transform active:scale-95"
        >
          <FileSpreadsheet className="w-4 h-4 text-emerald-200" />
          <span>Download Rekap Excel (.xlsx)</span>
        </button>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="p-5 rounded-2xl bg-white border border-purple-100 shadow-xs">
          <p className="text-xs text-slate-500 font-semibold">Total Pengeluaran (Bruto)</p>
          <p className="text-xl font-black text-slate-900 font-mono mt-1">
            Rp {totalPengeluaran.toLocaleString('id-ID')}
          </p>
        </div>

        <div className="p-5 rounded-2xl bg-white border border-purple-100 shadow-xs">
          <p className="text-xs text-rose-600 font-semibold">Total Potongan Pajak</p>
          <p className="text-xl font-black text-rose-600 font-mono mt-1">
            Rp {totalPotongan.toLocaleString('id-ID')}
          </p>
        </div>

        <div className="p-5 rounded-2xl bg-white border border-purple-100 shadow-xs">
          <p className="text-xs text-emerald-700 font-semibold">Total Pembayaran (Netto)</p>
          <p className="text-xl font-black text-emerald-700 font-mono mt-1">
            Rp {totalPembayaran.toLocaleString('id-ID')}
          </p>
        </div>
      </div>

      {/* Filter and Preview */}
      <div className="p-4 rounded-2xl bg-white border border-purple-100 shadow-xs flex flex-wrap gap-3">
        <select
          value={selectedTim}
          onChange={(e) => setSelectedTim(e.target.value)}
          className="px-3.5 py-2 bg-purple-50/50 border border-purple-150 rounded-xl text-xs font-medium text-slate-700 focus:outline-none"
        >
          <option value="Semua">Semua Tim Kerja</option>
          <option value="Umum">Bagian Umum</option>
          <option value="Sosial">Statistik Sosial</option>
          <option value="Produksi">Statistik Produksi</option>
          <option value="Distribusi">Statistik Distribusi</option>
          <option value="Neraca">Nerwilis</option>
          <option value="IPDS">IPDS</option>
        </select>

        <select
          value={selectedStatus}
          onChange={(e) => setSelectedStatus(e.target.value)}
          className="px-3.5 py-2 bg-purple-50/50 border border-purple-150 rounded-xl text-xs font-medium text-slate-700 focus:outline-none"
        >
          <option value="Semua">Semua Status</option>
          <option value="Selesai">Selesai / Cair</option>
          <option value="Perlu Perbaikan">Perlu Perbaikan</option>
          <option value="Di PPK">Di PPK</option>
          <option value="Di PPSPM">Di PPSPM</option>
          <option value="Di Bendahara">Di Bendahara</option>
        </select>
      </div>

      <div className="bg-white rounded-3xl border border-purple-100 shadow-sm overflow-hidden">
        <div className="overflow-x-auto max-h-96">
          <table className="w-full text-left text-xs border-collapse">
            <thead className="bg-[#2E1065] text-purple-100 font-bold uppercase text-[10px] sticky top-0">
              <tr>
                <th className="py-3 px-3">No.</th>
                <th className="py-3 px-3">No. SPM</th>
                <th className="py-3 px-3">Uraian Kegiatan</th>
                <th className="py-3 px-3 text-right">Bruto (Rp)</th>
                <th className="py-3 px-3 text-right">Potongan (Rp)</th>
                <th className="py-3 px-3 text-right">Netto (Rp)</th>
                <th className="py-3 px-3 text-center">Jalur</th>
                <th className="py-3 px-3 text-center">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-purple-50">
              {filtered.map((d, i) => (
                <tr key={d.id} className="hover:bg-purple-50/40">
                  <td className="py-2.5 px-3 font-mono text-slate-400">{i + 1}</td>
                  <td className="py-2.5 px-3 font-mono font-bold text-purple-950">{d.no_spm_spp || d.no_pengajuan}</td>
                  <td className="py-2.5 px-3 font-medium text-slate-900">{d.uraian_kegiatan}</td>
                  <td className="py-2.5 px-3 text-right font-mono">{Number(d.jumlah_pengeluaran || 0).toLocaleString('id-ID')}</td>
                  <td className="py-2.5 px-3 text-right font-mono text-rose-600">{Number(d.jumlah_potongan || 0).toLocaleString('id-ID')}</td>
                  <td className="py-2.5 px-3 text-right font-mono font-bold text-emerald-700">{Number(d.jumlah_pembayaran || 0).toLocaleString('id-ID')}</td>
                  <td className="py-2.5 px-3 text-center font-bold text-purple-900">{d.mekanisme_ls_gup}</td>
                  <td className="py-2.5 px-3 text-center font-semibold text-slate-700">{d.status_dokumen}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
