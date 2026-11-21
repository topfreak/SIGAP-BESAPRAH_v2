import React, { useState } from 'react';
import { FileText, Plus, Search, CheckCircle2, Clock, MapPin, Calendar, User } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { KECAMATAN_SAMBAS } from '../lib/seedData';

export default function SuratTugasPage() {
  const { currentUser, pegawaiList } = useAuth();
  const [showModal, setShowModal] = useState(false);

  // Mock initial surat tugas
  const [stList, setStList] = useState([
    {
      id: 'ST-01',
      nomor_st: 'B-042/6101/VS.300/2026',
      kegiatan: 'Supervisi Lapangan Pendataan Sakernas Februari',
      tujuan: 'Kecamatan Tebas & Jawai',
      petugas: 'Fauzan Azim, SST',
      tanggal_mulai: '2026-02-10',
      tanggal_selesai: '2026-02-12',
      status: 'Disetujui',
      statusColor: 'bg-emerald-100 text-emerald-800'
    },
    {
      id: 'ST-02',
      nomor_st: 'B-055/6101/VS.350/2026',
      kegiatan: 'Pemeriksaan Lapangan Listing Indeks Komstrat',
      tujuan: 'Kecamatan Paloh & Teluk Keramat',
      petugas: 'Firmansyah, S.Si',
      tanggal_mulai: '2026-03-01',
      tanggal_selesai: '2026-03-03',
      status: 'Disetujui',
      statusColor: 'bg-emerald-100 text-emerald-800'
    },
    {
      id: 'ST-03',
      nomor_st: 'B-088/6101/VS.400/2026',
      kegiatan: 'Pendataan Survei Harga Perdesaan (HD)',
      tujuan: 'Kecamatan Sambas & Sejangkung',
      petugas: 'Nuri Hayana, S.Si.',
      tanggal_mulai: '2026-04-05',
      tanggal_selesai: '2026-04-06',
      status: 'Menunggu TTD KPA',
      statusColor: 'bg-amber-100 text-amber-900'
    }
  ]);

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-extrabold text-slate-900 tracking-tight flex items-center gap-2.5">
            <FileText className="w-7 h-7 text-purple-700" />
            <span>Manajemen Surat Tugas</span>
          </h1>
          <p className="text-xs text-slate-500 mt-0.5">
            Penerbitan dan pemantauan surat tugas kegiatan sensus, survei, dan perjalanan dinas BPS Kabupaten Sambas
          </p>
        </div>

        <button
          onClick={() => alert('Formulir surat tugas siap diterbitkan!')}
          className="px-4 py-2.5 rounded-xl bg-purple-700 hover:bg-purple-800 text-white font-bold text-xs shadow-md transition flex items-center gap-2"
        >
          <Plus className="w-4 h-4 text-amber-300" />
          <span>+ Ajukan Surat Tugas</span>
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {stList.map((st) => (
          <div key={st.id} className="p-5 rounded-2xl bg-white border border-purple-100 shadow-xs hover:border-purple-300 transition space-y-3">
            <div className="flex items-center justify-between">
              <span className="font-mono font-bold text-xs text-purple-950 bg-purple-100 px-2 py-0.5 rounded">
                {st.nomor_st}
              </span>
              <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${st.statusColor}`}>
                {st.status}
              </span>
            </div>

            <h3 className="font-bold text-xs text-slate-800 leading-snug">{st.kegiatan}</h3>

            <div className="text-[11px] text-slate-600 space-y-1 pt-1 border-t border-purple-50">
              <div className="flex items-center gap-1.5">
                <User className="w-3.5 h-3.5 text-purple-500" />
                <span>{st.petugas}</span>
              </div>
              <div className="flex items-center gap-1.5">
                <MapPin className="w-3.5 h-3.5 text-purple-500" />
                <span>{st.tujuan}</span>
              </div>
              <div className="flex items-center gap-1.5 text-slate-400">
                <Calendar className="w-3.5 h-3.5" />
                <span>{st.tanggal_mulai} s.d. {st.tanggal_selesai}</span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
