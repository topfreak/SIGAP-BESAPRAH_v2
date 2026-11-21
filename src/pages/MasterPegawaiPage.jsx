import React, { useState } from 'react';
import { UserSquare2, Search, Filter, Mail, Award, CheckCircle2 } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

export default function MasterPegawaiPage() {
  const { pegawaiList, switchUser, currentUser } = useAuth();
  const [search, setSearch] = useState('');
  const [filterTim, setFilterTim] = useState('Semua');

  const filtered = pegawaiList.filter(p => {
    if (filterTim !== 'Semua' && p.tim_kerja !== filterTim) return false;
    if (search.trim()) {
      const q = search.toLowerCase();
      return (
        p.nama.toLowerCase().includes(q) ||
        p.nip_baru.includes(q) ||
        p.jabatan.toLowerCase().includes(q) ||
        p.pangkat_golongan.toLowerCase().includes(q)
      );
    }
    return true;
  });

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-extrabold text-slate-900 tracking-tight flex items-center gap-2.5">
            <UserSquare2 className="w-7 h-7 text-purple-700" />
            <span>Master Data Pegawai BPS Kabupaten Sambas</span>
          </h1>
          <p className="text-xs text-slate-500 mt-0.5">
            Daftar resmi 25 aparatur BPS Kabupaten Sambas beserta pangkat, golongan, jabatan, dan peran sistem
          </p>
        </div>
      </div>

      {/* Filter Bar */}
      <div className="p-4 rounded-2xl bg-white border border-purple-100 shadow-xs flex flex-col sm:flex-row items-center justify-between gap-3">
        <div className="relative w-full sm:w-80">
          <Search className="w-4 h-4 text-purple-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Cari nama, NIP, atau jabatan..."
            className="w-full pl-9 pr-3 py-2 bg-purple-50/50 border border-purple-150 rounded-xl text-xs text-slate-800 placeholder-purple-400/80 focus:outline-none focus:ring-2 focus:ring-purple-400"
          />
        </div>

        <select
          value={filterTim}
          onChange={(e) => setFilterTim(e.target.value)}
          className="px-3.5 py-2 bg-purple-50/50 border border-purple-150 rounded-xl text-xs font-medium text-slate-700 focus:outline-none w-full sm:w-auto"
        >
          <option value="Semua">Semua Tim / Fungsi</option>
          <option value="Pimpinan">Pimpinan</option>
          <option value="Umum">Umum / Tata Usaha</option>
          <option value="Sosial">Statistik Sosial</option>
          <option value="Produksi">Statistik Produksi</option>
          <option value="Distribusi">Statistik Distribusi</option>
          <option value="Neraca">Nerwilis & Analisis</option>
          <option value="IPDS">IPDS & TI</option>
        </select>
      </div>

      {/* Pegawai Cards / Table */}
      <div className="bg-white rounded-3xl border border-purple-100 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse">
            <thead className="bg-[#2E1065] text-purple-100 font-bold uppercase text-[10px] tracking-wider">
              <tr>
                <th className="py-3 px-4">No.</th>
                <th className="py-3 px-4">Nama Pegawai & Gelar</th>
                <th className="py-3 px-4">NIP Baru / Lama</th>
                <th className="py-3 px-4">Pangkat & Golongan</th>
                <th className="py-3 px-4">Jabatan</th>
                <th className="py-3 px-4">Tim / Fungsi</th>
                <th className="py-3 px-4 text-center">Peran Sistem</th>
                <th className="py-3 px-4 text-center">Aksi Simulasi</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-purple-50">
              {filtered.map((p, idx) => {
                const isCurrent = currentUser?.nip_baru === p.nip_baru;
                return (
                  <tr key={p.nip_baru} className={`hover:bg-purple-50/40 transition ${isCurrent ? 'bg-purple-50/60' : ''}`}>
                    <td className="py-3 px-4 font-mono text-slate-400">{idx + 1}</td>
                    <td className="py-3 px-4">
                      <div className="font-bold text-slate-900 flex items-center gap-1.5">
                        <span>{p.nama}</span>
                        {isCurrent && (
                          <span className="text-[9px] bg-purple-700 text-white font-bold px-1.5 py-0.2 rounded">Anda</span>
                        )}
                      </div>
                      <span className="text-[11px] text-purple-700 flex items-center gap-1 mt-0.5">
                        <Mail className="w-3 h-3" />
                        {p.email}
                      </span>
                    </td>
                    <td className="py-3 px-4 font-mono">
                      <div className="text-slate-800 font-semibold">{p.nip_baru}</div>
                      <div className="text-[10px] text-slate-400">{p.nip_lama}</div>
                    </td>
                    <td className="py-3 px-4 font-medium text-slate-700">
                      {p.pangkat_golongan}
                    </td>
                    <td className="py-3 px-4 text-slate-800 font-semibold">
                      {p.jabatan}
                    </td>
                    <td className="py-3 px-4">
                      <span className="px-2 py-0.5 rounded-md bg-purple-100 text-purple-800 font-bold text-[10px]">
                        {p.tim_kerja}
                      </span>
                    </td>
                    <td className="py-3 px-4 text-center">
                      <span className="px-2 py-0.5 rounded-full uppercase text-[10px] font-extrabold bg-amber-100 text-amber-900 border border-amber-200">
                        {p.role}
                      </span>
                    </td>
                    <td className="py-3 px-4 text-center">
                      <button
                        onClick={() => switchUser(p.nip_baru)}
                        className="px-2.5 py-1 rounded-lg bg-purple-100 hover:bg-purple-200 text-purple-900 font-bold text-[10px] transition"
                      >
                        Pilih Akun Ini
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
