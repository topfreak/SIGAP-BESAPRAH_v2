import React, { useState } from 'react';
import { 
  FileCheck2, 
  Search, 
  Filter, 
  Plus, 
  CheckCircle2, 
  XCircle, 
  MapPin, 
  User, 
  AlertTriangle,
  Building
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { KECAMATAN_SAMBAS } from '../lib/seedData';

export default function RekonSPJPage() {
  const { rekonList, updateRekonStatus, currentUser } = useAuth();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedKecamatan, setSelectedKecamatan] = useState('Semua');
  const [filterStatus, setFilterStatus] = useState('Semua');

  // New item modal state
  const [showAddModal, setShowAddModal] = useState(false);
  const [newEntry, setNewEntry] = useState({
    nama_petugas: '',
    kecamatan: 'Tebas',
    jabatan: 'PCL',
    pj_kuda: currentUser?.nama || 'Diva Maharani Basuki',
    kekurangan_sls: 0,
    dokumen_kurang: ''
  });

  const filtered = rekonList.filter(item => {
    if (selectedKecamatan !== 'Semua' && item.kecamatan !== selectedKecamatan) return false;
    if (filterStatus === 'Lengkap' && !item.is_selesai) return false;
    if (filterStatus === 'Belum Lengkap' && item.is_selesai) return false;
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      return (
        item.nama_petugas.toLowerCase().includes(q) ||
        item.pj_kuda.toLowerCase().includes(q) ||
        item.dokumen_kurang.toLowerCase().includes(q)
      );
    }
    return true;
  });

  const handleToggle = (id, currentStatus) => {
    updateRekonStatus(id, !currentStatus);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-extrabold text-slate-900 tracking-tight flex items-center gap-2.5">
            <FileCheck2 className="w-7 h-7 text-purple-700" />
            <span>Rekonsiliasi & Kekurangan Berkas Petugas</span>
          </h1>
          <p className="text-xs text-slate-500 mt-0.5">
            Monitoring kekurangan tanda tangan visum desa, BAST, tanda terima transport, dan setoran SLS per kecamatan
          </p>
        </div>

        <button
          onClick={() => setShowAddModal(true)}
          className="px-4 py-2.5 rounded-xl bg-purple-700 hover:bg-purple-800 text-white font-bold text-xs shadow-md transition flex items-center gap-2 transform active:scale-95"
        >
          <Plus className="w-4 h-4 text-amber-300" />
          <span>+ Catat Kekurangan Petugas</span>
        </button>
      </div>

      {/* Filter Bar */}
      <div className="p-4 rounded-2xl bg-white border border-purple-100 shadow-xs flex flex-col md:flex-row items-center justify-between gap-3">
        <div className="relative w-full md:w-80">
          <Search className="w-4 h-4 text-purple-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Cari nama petugas, PJ, atau jenis kekurangan..."
            className="w-full pl-9 pr-3 py-2 bg-purple-50/50 border border-purple-150 rounded-xl text-xs text-slate-800 placeholder-purple-400/80 focus:outline-none focus:ring-2 focus:ring-purple-400"
          />
        </div>

        <div className="flex flex-wrap items-center gap-2.5 w-full md:w-auto">
          <select
            value={selectedKecamatan}
            onChange={(e) => setSelectedKecamatan(e.target.value)}
            className="px-3 py-2 bg-purple-50/50 border border-purple-150 rounded-xl text-xs font-medium text-slate-700 focus:outline-none"
          >
            <option value="Semua">Semua Kecamatan</option>
            {KECAMATAN_SAMBAS.map(k => (
              <option key={k} value={k}>{k}</option>
            ))}
          </select>

          <select
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
            className="px-3 py-2 bg-purple-50/50 border border-purple-150 rounded-xl text-xs font-medium text-slate-700 focus:outline-none"
          >
            <option value="Semua">Semua Status</option>
            <option value="Belum Lengkap">Belum Lengkap</option>
            <option value="Lengkap">Sudah Lengkap</option>
          </select>
        </div>
      </div>

      {/* Table */}
      <div className="bg-white rounded-3xl border border-purple-100 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse">
            <thead className="bg-[#2E1065] text-purple-100 font-bold uppercase text-[10px] tracking-wider">
              <tr>
                <th className="py-3 px-4">Nama Petugas Lapangan</th>
                <th className="py-3 px-4">Kecamatan</th>
                <th className="py-3 px-4">Penanggung Jawab (PJ Kuda)</th>
                <th className="py-3 px-4">Kekurangan SLS</th>
                <th className="py-3 px-4">Rincian Dokumen Belum Lengkap</th>
                <th className="py-3 px-4 text-center">Status</th>
                <th className="py-3 px-4 text-center">Aksi</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-purple-50">
              {filtered.map((r) => (
                <tr key={r.id} className="hover:bg-purple-50/40 transition">
                  <td className="py-3.5 px-4 font-bold text-slate-900">
                    {r.nama_petugas}
                    <span className="block text-[10px] text-purple-700 font-normal">{r.jabatan}</span>
                  </td>
                  <td className="py-3.5 px-4">
                    <span className="inline-flex items-center gap-1 text-slate-700">
                      <MapPin className="w-3 h-3 text-purple-500" />
                      {r.kecamatan}
                    </span>
                  </td>
                  <td className="py-3.5 px-4 font-medium text-slate-700">
                    {r.pj_kuda}
                  </td>
                  <td className="py-3.5 px-4">
                    {r.kekurangan_sls > 0 ? (
                      <span className="px-2 py-0.5 rounded-full bg-rose-100 text-rose-800 font-bold text-[10px]">
                        Kurang {r.kekurangan_sls} SLS
                      </span>
                    ) : (
                      <span className="text-slate-400 font-mono">-</span>
                    )}
                  </td>
                  <td className="py-3.5 px-4 text-rose-800 font-semibold max-w-xs">
                    {r.dokumen_kurang}
                  </td>
                  <td className="py-3.5 px-4 text-center">
                    <span className={`inline-block px-2.5 py-0.5 rounded-full text-[10px] font-bold ${
                      r.is_selesai 
                        ? 'bg-emerald-100 text-emerald-800' 
                        : 'bg-rose-100 text-rose-800 animate-pulse'
                    }`}>
                      {r.is_selesai ? 'Lengkap' : 'Belum Lengkap'}
                    </span>
                  </td>
                  <td className="py-3.5 px-4 text-center">
                    <button
                      onClick={() => handleToggle(r.id, r.is_selesai)}
                      className={`px-3 py-1 rounded-lg text-[11px] font-bold transition ${
                        r.is_selesai
                          ? 'bg-slate-100 hover:bg-slate-200 text-slate-700'
                          : 'bg-emerald-600 hover:bg-emerald-700 text-white shadow-xs'
                      }`}
                    >
                      {r.is_selesai ? 'Tandai Kurang' : 'Tandai Lengkap'}
                    </button>
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
