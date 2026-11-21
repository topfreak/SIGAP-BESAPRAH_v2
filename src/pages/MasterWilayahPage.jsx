import React from 'react';
import { MapPin } from 'lucide-react';
import { KECAMATAN_SAMBAS } from '../lib/seedData';

export default function MasterWilayahPage() {
  return (
    <div className="space-y-6 max-w-5xl mx-auto">
      <div>
        <h1 className="text-2xl font-extrabold text-slate-900 tracking-tight flex items-center gap-2.5">
          <MapPin className="w-7 h-7 text-purple-700" />
          <span>Master Wilayah & SLS Kabupaten Sambas</span>
        </h1>
        <p className="text-xs text-slate-500 mt-0.5">
          Daftar 19 kecamatan dan pemetaan satuan lingkungan setempat (SLS) di wilayah kerja BPS Kabupaten Sambas
        </p>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
        {KECAMATAN_SAMBAS.map((kec, idx) => (
          <div key={idx} className="p-4 rounded-2xl bg-white border border-purple-100 shadow-xs hover:border-purple-300 transition">
            <span className="font-mono text-[10px] font-bold text-purple-600">Kode: 6101{String(idx + 1).padStart(2, '0')}</span>
            <h3 className="font-bold text-sm text-slate-800 mt-1">{kec}</h3>
            <p className="text-[11px] text-slate-400 mt-0.5">Kabupaten Sambas</p>
          </div>
        ))}
      </div>
    </div>
  );
}
