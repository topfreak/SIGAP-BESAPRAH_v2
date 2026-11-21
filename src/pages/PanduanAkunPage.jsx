import React, { useState } from 'react';
import { BookOpenCheck, Search, Download, ChevronDown, ChevronUp, FileText, CheckCircle2 } from 'lucide-react';
import { KODE_AKUN_LIST } from '../lib/seedData';

export default function PanduanAkunPage() {
  const [search, setSearch] = useState('');
  const [expandedKode, setExpandedKode] = useState('521211');

  const filtered = KODE_AKUN_LIST.filter(a => 
    a.kode.includes(search) || 
    a.nama.toLowerCase().includes(search.toLowerCase()) ||
    a.kategori.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="space-y-6 max-w-5xl mx-auto">
      <div>
        <h1 className="text-2xl font-extrabold text-slate-900 tracking-tight flex items-center gap-2.5">
          <BookOpenCheck className="w-7 h-7 text-purple-700" />
          <span>Panduan Kelengkapan Akun Belanja SPJ</span>
        </h1>
        <p className="text-xs text-slate-500 mt-0.5">
          Standar dokumen persyaratan dan tata cara pertanggungjawaban 14 kode akun belanja (Mata Anggaran) BPS Sambas
        </p>
      </div>

      {/* Search */}
      <div className="p-4 rounded-2xl bg-white border border-purple-100 shadow-xs flex items-center gap-3">
        <Search className="w-4 h-4 text-purple-400 ml-1" />
        <input
          type="text"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Cari kode akun atau nama belanja (misal: 521213, Honor, Transport, Sewa)..."
          className="w-full text-xs text-slate-800 placeholder-purple-400/80 focus:outline-none"
        />
      </div>

      {/* Akun List Accordion */}
      <div className="space-y-3">
        {filtered.map((akun) => {
          const isExpanded = expandedKode === akun.kode;
          return (
            <div 
              key={akun.kode} 
              className="bg-white rounded-2xl border border-purple-100 shadow-xs overflow-hidden transition"
            >
              <div
                onClick={() => setExpandedKode(isExpanded ? null : akun.kode)}
                className="p-4 flex items-center justify-between cursor-pointer hover:bg-purple-50/40 transition select-none"
              >
                <div className="flex items-center gap-3">
                  <span className="font-mono font-extrabold text-xs px-2.5 py-1 rounded-lg bg-purple-100 text-purple-900 border border-purple-200">
                    {akun.kode}
                  </span>
                  <div>
                    <h3 className="font-bold text-xs text-slate-900">{akun.nama}</h3>
                    <p className="text-[11px] text-slate-400">Kategori: {akun.kategori}</p>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <span className="text-[11px] font-semibold text-purple-700 bg-purple-50 px-2 py-0.5 rounded">
                    {akun.syarat.length} Dokumen Wajib
                  </span>
                  {isExpanded ? (
                    <ChevronUp className="w-4 h-4 text-purple-600" />
                  ) : (
                    <ChevronDown className="w-4 h-4 text-slate-400" />
                  )}
                </div>
              </div>

              {isExpanded && (
                <div className="p-5 bg-purple-50/20 border-t border-purple-100 space-y-4 animate-in fade-in duration-100">
                  {akun.subJenis && (
                    <div>
                      <p className="text-[11px] font-bold text-purple-900 uppercase tracking-wider mb-1">
                        Sub-Jenis Penggunaan Belanja:
                      </p>
                      <div className="flex flex-wrap gap-2">
                        {akun.subJenis.map((sj, idx) => (
                          <span key={idx} className="px-2.5 py-0.5 rounded-lg bg-white border border-purple-200 text-purple-900 text-xs font-semibold">
                            {sj}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}

                  <div>
                    <p className="text-[11px] font-bold text-purple-900 uppercase tracking-wider mb-2">
                      Daftar Kelengkapan Dokumen yang Harus Disiapkan:
                    </p>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                      {akun.syarat.map((s, idx) => (
                        <div key={idx} className="flex items-start gap-2 p-2 rounded-xl bg-white border border-purple-100 text-xs">
                          <CheckCircle2 className="w-4 h-4 text-emerald-600 flex-shrink-0 mt-0.5" />
                          <span className="text-slate-800 font-medium">{s}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
