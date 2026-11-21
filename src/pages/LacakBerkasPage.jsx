import React, { useState } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import { Search, ShieldCheck, CheckCircle2, Clock, AlertCircle, ArrowRight, User, Building } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import Badge from '../components/common/Badge';

export default function LacakBerkasPage() {
  const [searchParams] = useSearchParams();
  const { transactions } = useAuth();
  const [keyword, setKeyword] = useState(searchParams.get('q') || '');

  const searchResults = keyword.trim() ? transactions.filter(t => {
    const q = keyword.toLowerCase();
    return (
      t.no_spm_spp?.toLowerCase().includes(q) ||
      t.no_pengajuan?.toLowerCase().includes(q) ||
      t.uraian_kegiatan?.toLowerCase().includes(q) ||
      t.pj_nama?.toLowerCase().includes(q)
    );
  }) : [];

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Title */}
      <div className="text-center space-y-2 py-4">
        <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-purple-700 to-indigo-600 text-white flex items-center justify-center mx-auto shadow-md">
          <Search className="w-6 h-6" />
        </div>
        <h1 className="text-2xl font-extrabold text-slate-900 tracking-tight">
          Lacak Posisi Berkas SPJ
        </h1>
        <p className="text-xs text-slate-500 max-w-md mx-auto">
          Cari status proses verifikasi dan pencairan berkas secara transparan menggunakan nomor SPM atau nama kegiatan
        </p>
      </div>

      {/* Search Input */}
      <div className="p-3 rounded-2xl bg-white border border-purple-200 shadow-md flex items-center gap-2">
        <Search className="w-5 h-5 text-purple-400 ml-2" />
        <input
          type="text"
          value={keyword}
          onChange={(e) => setKeyword(e.target.value)}
          placeholder="Ketik Nomor SPM (misal: 00042A, 00101A) atau judul kegiatan..."
          className="w-full px-2 py-2 text-sm text-slate-800 placeholder-slate-400 focus:outline-none"
        />
        {keyword && (
          <button
            onClick={() => setKeyword('')}
            className="text-xs text-slate-400 hover:text-slate-600 px-2"
          >
            Bersihkan
          </button>
        )}
      </div>

      {/* Results */}
      {keyword.trim() && (
        <div className="space-y-4">
          <p className="text-xs font-bold text-slate-600">
            Ditemukan {searchResults.length} dokumen untuk kata kunci: <strong className="text-purple-900">"{keyword}"</strong>
          </p>

          {searchResults.length === 0 ? (
            <div className="p-8 text-center bg-white rounded-3xl border border-purple-100">
              <AlertCircle className="w-8 h-8 text-purple-300 mx-auto mb-2" />
              <p className="font-bold text-slate-700 text-sm">Dokumen tidak ditemukan.</p>
              <p className="text-xs text-slate-400 mt-1">Pastikan nomor SPM atau nama kegiatan sudah sesuai.</p>
            </div>
          ) : (
            searchResults.map((t) => (
              <div 
                key={t.id}
                className="p-6 rounded-3xl bg-white border border-purple-100 shadow-sm hover:border-purple-300 transition space-y-4"
              >
                <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-3">
                  <div>
                    <div className="flex items-center gap-2 mb-1.5">
                      <span className="font-mono font-extrabold text-xs px-2 py-0.5 rounded bg-purple-100 text-purple-950">
                        {t.no_spm_spp || t.no_pengajuan}
                      </span>
                      <span className="text-[11px] font-semibold text-purple-700 bg-purple-50 px-2 py-0.5 rounded">
                        {t.tim_kerja}
                      </span>
                      <Badge status={t.posisi_dokumen || t.status_dokumen} />
                    </div>
                    <h2 className="text-base font-extrabold text-slate-900">{t.uraian_kegiatan}</h2>
                    <p className="text-xs text-slate-500 mt-0.5 flex items-center gap-1.5">
                      <User className="w-3.5 h-3.5 text-purple-500" />
                      <span>PJ Kegiatan: <strong>{t.pj_nama}</strong></span>
                    </p>
                  </div>

                  <div className="text-left sm:text-right">
                    <span className="text-[10px] text-slate-400 block uppercase font-bold">Nilai Pembayaran Netto</span>
                    <span className="text-lg font-black text-emerald-700 font-mono">
                      Rp {Number(t.jumlah_pembayaran || 0).toLocaleString('id-ID')}
                    </span>
                  </div>
                </div>

                {/* Tracking bar */}
                <div className="p-3.5 rounded-2xl bg-purple-50/50 border border-purple-100 text-xs flex items-center justify-between">
                  <div className="flex items-center gap-2 text-slate-700">
                    <Clock className="w-4 h-4 text-purple-600" />
                    <span>Posisi Saat Ini: <strong className="text-purple-950 font-bold">{t.posisi_dokumen || t.status_dokumen}</strong></span>
                  </div>
                  <Link
                    to={`/pengajuan-spj/${t.id}`}
                    className="text-xs font-bold text-purple-700 hover:text-purple-900 inline-flex items-center gap-1 hover:underline"
                  >
                    <span>Buka Rincian Lengkap</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </Link>
                </div>
              </div>
            ))
          )}
        </div>
      )}
    </div>
  );
}
