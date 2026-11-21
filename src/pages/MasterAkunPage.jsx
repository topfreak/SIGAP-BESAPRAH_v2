import React from 'react';
import { Tags } from 'lucide-react';
import { KODE_AKUN_LIST } from '../lib/seedData';

export default function MasterAkunPage() {
  return (
    <div className="space-y-6 max-w-5xl mx-auto">
      <div>
        <h1 className="text-2xl font-extrabold text-slate-900 tracking-tight flex items-center gap-2.5">
          <Tags className="w-7 h-7 text-purple-700" />
          <span>Master Kode Akun Anggaran (MAK)</span>
        </h1>
        <p className="text-xs text-slate-500 mt-0.5">
          14 Kode Akun Belanja penatausahaan SPJ APBN di BPS Kabupaten Sambas
        </p>
      </div>

      <div className="bg-white rounded-3xl border border-purple-100 shadow-sm overflow-hidden">
        <table className="w-full text-left text-xs">
          <thead className="bg-[#2E1065] text-purple-100 font-bold uppercase text-[10px]">
            <tr>
              <th className="py-3 px-4">Kode Akun</th>
              <th className="py-3 px-4">Nama Akun Belanja</th>
              <th className="py-3 px-4">Kategori Belanja</th>
              <th className="py-3 px-4 text-center">Jumlah Dokumen Syarat</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-purple-50">
            {KODE_AKUN_LIST.map((a) => (
              <tr key={a.kode} className="hover:bg-purple-50/40">
                <td className="py-3 px-4 font-mono font-bold text-purple-950">{a.kode}</td>
                <td className="py-3 px-4 font-bold text-slate-900">{a.nama}</td>
                <td className="py-3 px-4 text-slate-600">{a.kategori}</td>
                <td className="py-3 px-4 text-center font-bold text-purple-700">{a.syarat.length} Dokumen</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
