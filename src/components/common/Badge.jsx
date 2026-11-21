import React from 'react';
import { 
  Building2, 
  UserCheck, 
  FileCheck, 
  Wallet, 
  FileSpreadsheet, 
  Archive, 
  AlertTriangle,
  RotateCcw
} from 'lucide-react';

export default function Badge({ status, type = 'status', meja = null }) {
  if (type === 'ls_gup') {
    const isLS = status === 'LS';
    return (
      <span className={`inline-flex items-center px-2 py-0.5 rounded text-[10px] font-extrabold tracking-wider ${
        isLS 
          ? 'bg-blue-100 text-blue-900 border border-blue-300' 
          : 'bg-emerald-100 text-emerald-900 border border-emerald-300'
      }`}>
        {status}
      </span>
    );
  }

  if (type === 'kelengkapan') {
    const isLengkap = status === 'LENGKAP';
    return (
      <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold ${
        isLengkap
          ? 'bg-emerald-100 text-emerald-800 border border-emerald-200'
          : 'bg-rose-100 text-rose-800 border border-rose-300'
      }`}>
        <span className={`w-1.5 h-1.5 rounded-full ${isLengkap ? 'bg-emerald-600' : 'bg-rose-600 animate-ping'}`}></span>
        {status}
      </span>
    );
  }

  // Meja Berkas Indicator
  if (type === 'meja' || meja) {
    const mejaText = meja || status || '';
    if (mejaText.includes('PPK')) {
      return (
        <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-xl bg-purple-100 text-purple-900 border border-purple-300 text-[11px] font-extrabold shadow-2xs">
          <span>🗄️</span>
          <span>Meja PPK</span>
        </span>
      );
    }
    if (mejaText.includes('PPSPM')) {
      return (
        <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-xl bg-indigo-100 text-indigo-900 border border-indigo-300 text-[11px] font-extrabold shadow-2xs">
          <span>⚖️</span>
          <span>Meja PPSPM</span>
        </span>
      );
    }
    if (mejaText.includes('Bendahara')) {
      return (
        <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-xl bg-blue-100 text-blue-900 border border-blue-300 text-[11px] font-extrabold shadow-2xs">
          <span>💼</span>
          <span>Meja Bendahara</span>
        </span>
      );
    }
    if (mejaText.includes('PJ') || mejaText.includes('Revisi')) {
      return (
        <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-xl bg-amber-100 text-amber-950 border border-amber-300 text-[11px] font-extrabold shadow-2xs animate-pulse">
          <span>📝</span>
          <span>Meja PJ (Revisi)</span>
        </span>
      );
    }
    if (mejaText.includes('Arsip') || mejaText.includes('Selesai')) {
      return (
        <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-xl bg-emerald-100 text-emerald-950 border border-emerald-300 text-[11px] font-extrabold shadow-2xs">
          <span>🏛️</span>
          <span>Meja Arsip (Cair)</span>
        </span>
      );
    }
    return (
      <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-xl bg-purple-50 text-purple-900 border border-purple-200 text-[11px] font-bold">
        <span>🔍</span>
        <span>{mejaText}</span>
      </span>
    );
  }

  // General Status Dokumen
  let colorStyle = 'bg-slate-100 text-slate-700 border-slate-200';
  
  switch (status) {
    case 'Selesai':
    case 'Sudah diproses':
      colorStyle = 'bg-emerald-100 text-emerald-900 border-emerald-300 font-bold';
      break;
    case 'Di PPK':
      colorStyle = 'bg-purple-100 text-purple-900 border-purple-300 font-bold';
      break;
    case 'Di PPSPM':
      colorStyle = 'bg-indigo-100 text-indigo-900 border-indigo-300 font-bold';
      break;
    case 'Di Bendahara':
      colorStyle = 'bg-blue-100 text-blue-900 border-blue-300 font-bold';
      break;
    case 'Perlu Perbaikan':
    case 'Perlu Revisi':
      colorStyle = 'bg-amber-100 text-amber-900 border-amber-300 font-bold';
      break;
    case 'Ditolak':
      colorStyle = 'bg-rose-100 text-rose-800 border-rose-200 font-bold';
      break;
    default:
      colorStyle = 'bg-purple-50 text-purple-700 border-purple-200';
  }

  return (
    <span className={`inline-flex items-center px-2 py-0.5 rounded text-[11px] font-semibold border ${colorStyle}`}>
      {status}
    </span>
  );
}
