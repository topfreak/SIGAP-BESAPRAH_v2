import React from 'react';
import { Calendar as CalendarIcon, Clock, MapPin, Tag } from 'lucide-react';

export default function KalenderPerjadinPage() {
  const events = [
    { tanggal: '02 - 15 Feb 2026', nama: 'Pendataan Sakernas Februari 2026', tim: 'Statistik Sosial', lokasi: 'Seluruh Kecamatan' },
    { tanggal: '01 - 31 Mar 2026', nama: 'Pendataan Susenas Maret 2026', tim: 'Statistik Sosial', lokasi: 'Sampel SLS Terpilih' },
    { tanggal: '01 - 28 Mar 2026', nama: 'Pendataan KSA Padi & Jagung Subround I', tim: 'Statistik Produksi', lokasi: 'Sentra Padi Sambas' },
    { tanggal: '10 - 25 Apr 2026', nama: 'Survei Harga Perdesaan (HD/HP)', tim: 'Statistik Distribusi', lokasi: 'Pasar & Produsen' },
    { tanggal: '01 - 20 Mei 2026', nama: 'Listing Indeks Komstrat 2026', tim: 'Statistik Produksi', lokasi: 'Perkebunan Rakyat' }
  ];

  return (
    <div className="space-y-6 max-w-5xl mx-auto">
      <div>
        <h1 className="text-2xl font-extrabold text-slate-900 tracking-tight flex items-center gap-2.5">
          <CalendarIcon className="w-7 h-7 text-purple-700" />
          <span>Kalender Kegiatan & Perjalanan Dinas</span>
        </h1>
        <p className="text-xs text-slate-500 mt-0.5">
          Jadwal pelaksanaan sensus, survei rutin, supervisi, dan perjalanan dinas BPS Kabupaten Sambas
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {events.map((ev, idx) => (
          <div key={idx} className="p-5 rounded-2xl bg-white border border-purple-100 shadow-xs hover:border-purple-300 transition space-y-2">
            <span className="text-[11px] font-bold px-2.5 py-0.5 rounded-full bg-purple-100 text-purple-900 inline-block font-mono">
              {ev.tanggal}
            </span>
            <h3 className="font-bold text-sm text-slate-800">{ev.nama}</h3>
            <div className="flex items-center gap-4 text-xs text-slate-500 pt-1">
              <span className="flex items-center gap-1">
                <Tag className="w-3.5 h-3.5 text-purple-600" />
                {ev.tim}
              </span>
              <span className="flex items-center gap-1">
                <MapPin className="w-3.5 h-3.5 text-purple-600" />
                {ev.lokasi}
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
