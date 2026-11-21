import React, { useState } from 'react';
import { Coins, Search, CheckCircle2, Clock, AlertTriangle } from 'lucide-react';

export default function MonitoringMitraPage() {
  const [mitraList, setMitraList] = useState([
    { id: 1, nama: 'Muhlis', kecamatan: 'Jawai', survei: 'VKOMSTRAT2026', honor: 1750000, pph: 0, netto: 1750000, status: 'Sudah Ditransfer CMS' },
    { id: 2, nama: 'NJI HUANG', kecamatan: 'Teluk Keramat', survei: 'VKOMSTRAT2026', honor: 1750000, pph: 0, netto: 1750000, status: 'Sudah Ditransfer CMS' },
    { id: 3, nama: 'Efri', kecamatan: 'Teluk Keramat', survei: 'VKOMSTRAT2026', honor: 1750000, pph: 0, netto: 1750000, status: 'Sudah Ditransfer CMS' },
    { id: 4, nama: 'Karmin', kecamatan: 'Selakau', survei: 'VKOMSTRAT2026', honor: 1750000, pph: 0, netto: 1750000, status: 'Sudah Ditransfer CMS' },
    { id: 5, nama: 'Windra', kecamatan: 'Galing', survei: 'VKOMSTRAT2026', honor: 1750000, pph: 0, netto: 1750000, status: 'Menunggu Verifikasi Visum' },
    { id: 6, nama: 'Esti Lestari', kecamatan: 'Subah', survei: 'VKOMSTRAT2026', honor: 1750000, pph: 0, netto: 1750000, status: 'Menunggu Verifikasi Visum' }
  ]);

  return (
    <div className="space-y-6 max-w-5xl mx-auto">
      <div>
        <h1 className="text-2xl font-extrabold text-slate-900 tracking-tight flex items-center gap-2.5">
          <Coins className="w-7 h-7 text-purple-700" />
          <span>Monitoring Pembayaran Honor Mitra</span>
        </h1>
        <p className="text-xs text-slate-500 mt-0.5">
          Pemantauan transfer honor mitra pendataan lapangan dan bukti bayar CMS Bank
        </p>
      </div>

      <div className="bg-white rounded-3xl border border-purple-100 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse">
            <thead className="bg-[#2E1065] text-purple-100 font-bold uppercase text-[10px]">
              <tr>
                <th className="py-3 px-4">Nama Mitra</th>
                <th className="py-3 px-4">Kecamatan</th>
                <th className="py-3 px-4">Kegiatan Survei</th>
                <th className="py-3 px-4 text-right">Honor Bruto</th>
                <th className="py-3 px-4 text-right">Netto Ditransfer</th>
                <th className="py-3 px-4 text-center">Status Pembayaran</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-purple-50">
              {mitraList.map((m) => (
                <tr key={m.id} className="hover:bg-purple-50/40">
                  <td className="py-3 px-4 font-bold text-slate-900">{m.nama}</td>
                  <td className="py-3 px-4 text-slate-600">{m.kecamatan}</td>
                  <td className="py-3 px-4 font-semibold text-purple-900">{m.survei}</td>
                  <td className="py-3 px-4 text-right font-mono">Rp {m.honor.toLocaleString('id-ID')}</td>
                  <td className="py-3 px-4 text-right font-mono font-bold text-emerald-700">Rp {m.netto.toLocaleString('id-ID')}</td>
                  <td className="py-3 px-4 text-center">
                    <span className={`inline-block px-2.5 py-0.5 rounded-full text-[10px] font-bold ${
                      m.status.includes('Sudah') ? 'bg-emerald-100 text-emerald-800' : 'bg-amber-100 text-amber-900'
                    }`}>
                      {m.status}
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
