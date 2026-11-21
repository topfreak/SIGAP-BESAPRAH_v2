import React from 'react';
import { Car, FileCheck2, UploadCloud, MapPin, CheckCircle2 } from 'lucide-react';

export default function LaporanPerjadinPage() {
  return (
    <div className="space-y-6 max-w-5xl mx-auto">
      <div>
        <h1 className="text-2xl font-extrabold text-slate-900 tracking-tight flex items-center gap-2.5">
          <Car className="w-7 h-7 text-purple-700" />
          <span>Laporan Perjalanan Dinas & Visum</span>
        </h1>
        <p className="text-xs text-slate-500 mt-0.5">
          Unggah bukti visum desa/kecamatan berstempel, tiket perjalanan, boarding pass, dan daftar pengeluaran riil (DOP)
        </p>
      </div>

      <div className="p-6 rounded-3xl bg-white border border-purple-100 shadow-sm space-y-4">
        <h2 className="text-sm font-bold text-slate-800 border-b border-purple-50 pb-2">
          Ketentuan Dokumen Kepulangan Dinas Sesuai PMK 113/2012:
        </h2>
        <ul className="text-xs text-slate-600 space-y-2 list-disc pl-5">
          <li><strong>Bukti Visum:</strong> Wajib dibubuhi tanda tangan dan stempel basah kantor desa/lurah/kecamatan setempat.</li>
          <li><strong>Daftar Pengeluaran Riil (DOP):</strong> Wajib ditandatangani oleh pelaksana SPD.</li>
          <li><strong>Pernyataan Tidak Menggunakan Kendaraan Dinas:</strong> Lampirkan untuk klaim biaya transportasi lokal atau tiket.</li>
          <li><strong>Billing Hotel:</strong> Menginap dibayarkan at cost, bila tidak menginap di hotel diberikan sebesar 30% dari SBM dengan melampirkan surat pernyataan.</li>
        </ul>

        <div className="p-4 rounded-2xl bg-purple-50/60 border border-purple-150 flex items-center justify-between">
          <div>
            <p className="text-xs font-bold text-purple-900">Upload Dokumen Laporan Perjadin Anda</p>
            <p className="text-[11px] text-purple-700">Gabungkan lembar visum, kuitansi riil, dan dokumentasi foto kegiatan</p>
          </div>
          <button 
            onClick={() => alert('Silakan pilih berkas PDF laporan perjadin Anda.')}
            className="px-4 py-2 rounded-xl bg-purple-700 hover:bg-purple-800 text-white font-bold text-xs flex items-center gap-2"
          >
            <UploadCloud className="w-4 h-4" />
            <span>Unggah PDF</span>
          </button>
        </div>
      </div>
    </div>
  );
}
