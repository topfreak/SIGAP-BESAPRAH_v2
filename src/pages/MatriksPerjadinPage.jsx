import React from 'react';
import { Users2, CheckCircle2, AlertCircle } from 'lucide-react';
import { PEGAWAI_LIST } from '../lib/seedData';

export default function MatriksPerjadinPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-extrabold text-slate-900 tracking-tight flex items-center gap-2.5">
          <Users2 className="w-7 h-7 text-purple-700" />
          <span>Matriks Penugasan Pegawai BPS Sambas</span>
        </h1>
        <p className="text-xs text-slate-500 mt-0.5">
          Pemantauan jadwal penugasan 25 pegawai untuk mencegah jadwal ganda (tabrakan) antar kegiatan survei
        </p>
      </div>

      <div className="bg-white rounded-3xl border border-purple-100 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse">
            <thead className="bg-[#2E1065] text-purple-100 font-bold uppercase text-[10px]">
              <tr>
                <th className="py-3 px-4">Nama Pegawai</th>
                <th className="py-3 px-4">Jabatan</th>
                <th className="py-3 px-4">Tim Kerja</th>
                <th className="py-3 px-4">Kegiatan Aktif Saat Ini</th>
                <th className="py-3 px-4 text-center">Status Beban Kerja</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-purple-50">
              {PEGAWAI_LIST.map((p) => (
                <tr key={p.nip_baru} className="hover:bg-purple-50/40">
                  <td className="py-3 px-4 font-bold text-slate-900">{p.nama}</td>
                  <td className="py-3 px-4 text-slate-600">{p.jabatan}</td>
                  <td className="py-3 px-4">
                    <span className="px-2 py-0.5 rounded bg-purple-100 text-purple-800 text-[10px] font-bold">
                      {p.tim_kerja}
                    </span>
                  </td>
                  <td className="py-3 px-4 text-slate-700">
                    {p.tim_kerja === 'Sosial' ? 'Susenas & Sakernas' :
                     p.tim_kerja === 'Produksi' ? 'KSA Padi & Ubinan' :
                     p.tim_kerja === 'Distribusi' ? 'Survei Harga Perdesaan' :
                     p.tim_kerja === 'Neraca' ? 'SKTNP & SKLNP' : 'Operasional Kantor'}
                  </td>
                  <td className="py-3 px-4 text-center">
                    <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-emerald-100 text-emerald-800">
                      Normal
                    </span>
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
