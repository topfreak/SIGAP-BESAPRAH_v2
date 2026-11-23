import React, { useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { 
  ArrowLeft, 
  CheckCircle2, 
  AlertCircle, 
  FileText, 
  Clock, 
  CheckSquare, 
  XCircle, 
  Printer, 
  User, 
  Calendar, 
  Coins, 
  Building2,
  ShieldCheck,
  FileCheck2,
  MapPin,
  Lock,
  Crown,
  History,
  Send,
  RotateCcw,
  UserCheck
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { KODE_AKUN_LIST } from '../lib/seedData';
import { getDeskActionAuthority, DESK_CONFIG } from '../lib/permissions';
import Badge from '../components/common/Badge';

export default function DetailSPJPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { transactions, updateTransactionStatus, currentUser } = useAuth();

  const transaction = transactions.find(t => t.id === id) || transactions[0];
  const akun = KODE_AKUN_LIST.find(a => a.kode === transaction?.kode_akun) || KODE_AKUN_LIST[0];

  const [reviewNote, setReviewNote] = useState('');
  const [successNotice, setSuccessNotice] = useState('');
  const [checkedDocs, setCheckedDocs] = useState({});

  if (!transaction) {
    return (
      <div className="p-12 text-center">
        <p className="text-slate-500">Pengajuan SPJ tidak ditemukan.</p>
        <Link to="/pengajuan-spj" className="text-purple-700 font-bold mt-2 inline-block">
          ← Kembali ke Daftar SPJ
        </Link>
      </div>
    );
  }

  // Evaluasi Wewenang Meja Berkas
  const authority = getDeskActionAuthority(currentUser, transaction);

  const toggleDoc = (doc) => {
    setCheckedDocs(prev => ({ ...prev, [doc]: !prev[doc] }));
  };

  // Actions per Desk: PJ -> PPK -> Bendahara -> PPSPM -> Arsip
  const handleApprovePPK = () => {
    updateTransactionStatus(transaction.id, {
      status_dokumen: 'Di Bendahara',
      posisi_dokumen: 'Di Bendahara',
      meja_berkas: 'Meja Bendahara (Verifikasi Kuitansi, Pajak & Kas)',
      review_ppk: reviewNote ? `Disetujui PPK: ${reviewNote}` : 'Komitmen disetujui PPK, diteruskan ke Meja Bendahara'
    });
    setSuccessNotice('Dokumen berhasil disetujui PPK dan dipindahkan ke Meja Bendahara.');
    setReviewNote('');
    setTimeout(() => setSuccessNotice(''), 4000);
  };

  const handleMintaPerbaikanPPK = () => {
    if (!reviewNote.trim()) {
      alert('Mohon tuliskan catatan kekurangan dokumen yang perlu dilengkapi.');
      return;
    }
    updateTransactionStatus(transaction.id, {
      status_dokumen: 'Perlu Perbaikan',
      posisi_dokumen: 'Perlu Revisi',
      meja_berkas: 'Meja PJ Kegiatan (Revisi Dokumen)',
      catatan_kekurangan: reviewNote,
      review_ppk: `Perlu Perbaikan: ${reviewNote}`
    });
    setSuccessNotice('Dokumen berhasil dikembalikan ke Meja PJ Kegiatan untuk perbaikan.');
    setReviewNote('');
    setTimeout(() => setSuccessNotice(''), 4000);
  };

  const handleApproveBendahara = () => {
    updateTransactionStatus(transaction.id, {
      status_dokumen: 'Di PPSPM',
      posisi_dokumen: 'Di PPSPM',
      meja_berkas: 'Meja PPSPM (Pengujian Formal & Penerbitan SPM)',
      review_bdh: reviewNote ? `Verifikasi Pajak & Kas: ${reviewNote}` : 'Kuitansi & potongan pajak lengkap, diteruskan ke Meja PPSPM'
    });
    setSuccessNotice('Dokumen diverifikasi Bendahara Pengeluaran dan diteruskan ke Meja PPSPM untuk pengujian SPM.');
    setReviewNote('');
    setTimeout(() => setSuccessNotice(''), 4000);
  };

  const handleMintaPerbaikanBendahara = () => {
    if (!reviewNote.trim()) {
      alert('Mohon tuliskan catatan kekurangan kuitansi atau perhitungan pajak.');
      return;
    }
    updateTransactionStatus(transaction.id, {
      status_dokumen: 'Perlu Perbaikan',
      posisi_dokumen: 'Perlu Revisi',
      meja_berkas: 'Meja PJ Kegiatan (Revisi Dokumen)',
      catatan_kekurangan: `Catatan Bendahara: ${reviewNote}`,
      review_bdh: `Perlu Perbaikan: ${reviewNote}`
    });
    setSuccessNotice('Dokumen dikembalikan ke Meja PJ Kegiatan untuk perbaikan kuitansi/pajak.');
    setReviewNote('');
    setTimeout(() => setSuccessNotice(''), 4000);
  };

  const handleApprovePPSPM = () => {
    updateTransactionStatus(transaction.id, {
      status_dokumen: 'Selesai',
      posisi_dokumen: 'Selesai',
      meja_berkas: 'Meja Arsip Keuangan (Lunas / SP2D Terbit)',
      kelengkapan_dokumen: 'LENGKAP',
      tanggal_sp2d: new Date().toISOString().split('T')[0],
      review_ppspm: reviewNote ? `SPM Diterbitkan: ${reviewNote}` : 'SPM resmi diterbitkan oleh PPSPM & disahkan lunas'
    });
    setSuccessNotice('SPM resmi diterbitkan dan berkas disahkan lunas serta disimpan di Meja Arsip.');
    setReviewNote('');
    setTimeout(() => setSuccessNotice(''), 4000);
  };

  const handleTolakPPSPM = () => {
    updateTransactionStatus(transaction.id, {
      status_dokumen: 'Di Bendahara',
      posisi_dokumen: 'Di Bendahara',
      meja_berkas: 'Meja Bendahara (Verifikasi Kuitansi, Pajak & Kas)',
      review_ppspm: reviewNote ? `Ditolak PPSPM: ${reviewNote}` : 'SPM belum memenuhi syarat pengujian, dikembalikan ke Bendahara'
    });
    setSuccessNotice('SPM ditolak dan dokumen dikembalikan ke Meja Bendahara.');
    setReviewNote('');
    setTimeout(() => setSuccessNotice(''), 4000);
  };

  const handleAjukanUlangPJ = () => {
    updateTransactionStatus(transaction.id, {
      status_dokumen: 'Di PPK',
      posisi_dokumen: 'Di PPK',
      meja_berkas: 'Meja PPK (Peninjauan Komitmen & SPP)',
      catatan_kekurangan: '',
      review_ppk: reviewNote ? `Perbaikan dari PJ: ${reviewNote}` : 'Dokumen perbaikan telah diunggah oleh PJ'
    });
    setSuccessNotice('Dokumen berhasil diajukan ke Meja PPK.');
    setReviewNote('');
    setTimeout(() => setSuccessNotice(''), 4000);
  };

  // Steps definition for Chain of Custody Timeline: PJ -> PPK -> Bendahara -> PPSPM -> Arsip
  const timelineSteps = [
    { key: 'Draft', label: '1. Draf PJ' },
    { key: 'Di PPK', label: '2. Meja PPK' },
    { key: 'Di Bendahara', label: '3. Meja Bendahara' },
    { key: 'Di PPSPM', label: '4. Meja PPSPM' },
    { key: 'Selesai', label: '5. Meja Arsip (Lunas)' }
  ];

  const getStepStatus = (stepKey) => {
    const order = ['Draft', 'Di PPK', 'Di Bendahara', 'Di PPSPM', 'Selesai'];
    const currentIdx = order.indexOf(transaction.status_dokumen === 'Perlu Perbaikan' ? 'Draft' : transaction.status_dokumen);
    const targetIdx = order.indexOf(stepKey);

    if (transaction.status_dokumen === 'Perlu Perbaikan' && stepKey === 'Draft') return 'active';
    if (transaction.status_dokumen === stepKey) return 'active';
    if (targetIdx < currentIdx || transaction.status_dokumen === 'Selesai') return 'completed';
    return 'pending';
  };

  return (
    <div className="space-y-6 max-w-5xl mx-auto font-sans">
      {/* Top Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <Link
          to="/pengajuan-spj"
          className="inline-flex items-center gap-1.5 text-xs text-purple-700 hover:text-purple-900 font-bold"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Kembali ke Daftar SPJ</span>
        </Link>

        <div className="flex items-center gap-2">
          <button 
            onClick={() => window.print()} 
            className="px-3.5 py-1.5 rounded-xl border border-purple-200 text-purple-900 bg-white hover:bg-purple-50 font-bold text-xs flex items-center gap-1.5 shadow-2xs"
          >
            <Printer className="w-3.5 h-3.5" />
            <span>Cetak Lembar Kontrol</span>
          </button>
        </div>
      </div>

      {/* Success Banner */}
      {successNotice && (
        <div className="p-4 rounded-2xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs flex items-center gap-2 animate-in slide-in-from-top">
          <CheckCircle2 className="w-4 h-4 text-emerald-600 flex-shrink-0" />
          <span className="font-semibold">{successNotice}</span>
        </div>
      )}

      {/* Main Card Header */}
      <div className="p-6 rounded-3xl bg-gradient-to-r from-[#250b52] via-[#38117a] to-[#4c1d95] text-white shadow-xl space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="space-y-1">
            <div className="flex flex-wrap items-center gap-2">
              <span className="text-xs font-mono font-bold bg-amber-400 text-purple-950 px-2 py-0.5 rounded-md">
                {transaction.no_spm_spp || transaction.no_pengajuan}
              </span>
              <span className="text-[10px] uppercase font-bold px-2 py-0.5 rounded-md bg-white/10 text-purple-200">
                {transaction.mekanisme_ls_gup}
              </span>
              <span className="text-[10px] uppercase font-bold px-2 py-0.5 rounded-md bg-purple-400/20 text-amber-300">
                MAK: {transaction.kode_akun}
              </span>
            </div>
            <h1 className="text-xl sm:text-2xl font-extrabold text-white mt-1">
              {transaction.uraian_kegiatan}
            </h1>
          </div>

          <div className="text-left sm:text-right">
            <p className="text-[11px] text-purple-200">Jumlah Netto Pembayaran</p>
            <p className="text-2xl font-black text-amber-300 font-mono mt-0.5">
              Rp {Number(transaction.jumlah_pembayaran || 0).toLocaleString('id-ID')}
            </p>
          </div>
        </div>

        {/* Visual Custody Chain Timeline (Alur Meja Berkas) */}
        <div className="pt-4 border-t border-purple-800/60">
          <p className="text-[10px] font-bold text-purple-300 uppercase tracking-wider mb-2.5">
            Rantai Penjagaan Posisi Meja Berkas (Chain of Custody):
          </p>
          <div className="grid grid-cols-2 sm:grid-cols-5 gap-2">
            {timelineSteps.map(step => {
              const status = getStepStatus(step.key);
              return (
                <div 
                  key={step.key}
                  className={`p-2.5 rounded-xl border text-center text-xs transition ${
                    status === 'active'
                      ? 'bg-amber-400 text-purple-950 border-amber-300 font-extrabold shadow-md'
                      : status === 'completed'
                      ? 'bg-emerald-900/60 text-emerald-200 border-emerald-500/40 font-semibold'
                      : 'bg-white/5 text-purple-400 border-purple-800/60'
                  }`}
                >
                  <div className="text-[11px] truncate">{step.label}</div>
                  <div className="text-[9px] mt-0.5 uppercase tracking-wide opacity-80">
                    {status === 'active' ? '● Meja Aktif' : status === 'completed' ? '✓ Terlewati' : 'Terkunci'}
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Meta Bar */}
        <div className="pt-2 flex flex-wrap items-center justify-between gap-3 text-xs text-purple-200">
          <div className="flex flex-wrap items-center gap-4">
            <span className="flex items-center gap-1.5">
              <MapPin className="w-3.5 h-3.5 text-amber-300" />
              <span>Posisi Meja: <strong>{transaction.meja_berkas || authority.deskName}</strong></span>
            </span>
            <span className="flex items-center gap-1.5">
              <Calendar className="w-3.5 h-3.5 text-purple-300" />
              <span>Diterima: {transaction.tanggal_terima}</span>
            </span>
          </div>

          <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-extrabold uppercase border ${
            transaction.kelengkapan_dokumen === 'LENGKAP' 
              ? 'bg-emerald-500/20 text-emerald-200 border-emerald-400/40' 
              : 'bg-rose-500/20 text-rose-200 border-rose-400/40'
          }`}>
            {transaction.kelengkapan_dokumen}
          </span>
        </div>
      </div>

      {/* Delegated Drafting Information Card */}
      <div className="p-4 rounded-2xl bg-white border border-purple-100 shadow-2xs flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-purple-100 text-purple-800 flex items-center justify-center font-bold">
            <UserCheck className="w-5 h-5 text-purple-700" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <p className="font-extrabold text-slate-900">
                Penanggung Jawab: {transaction.pj_nama}
              </p>
              <span className="px-2 py-0.2 rounded bg-purple-100 text-purple-800 text-[10px] font-bold">
                Tim {transaction.tim_kerja}
              </span>
            </div>
            <p className="text-[11px] text-slate-500 mt-0.5">
              Operator Penginput Draf: <strong className="text-slate-700">{transaction.pengaju_nama || transaction.pj_nama}</strong> 
              {transaction.pengaju_nip && transaction.pengaju_nip !== transaction.pj_kegiatan_nip && (
                <span className="text-purple-600 ml-1">(Draf dibuatkan untuk PJ Kegiatan)</span>
              )}
            </p>
          </div>
        </div>

        <div className="text-right text-[11px] text-slate-400 font-mono">
          NIP PJ: {transaction.pj_kegiatan_nip || '-'}
        </div>
      </div>

      {/* ========================================================================= */}
      {/* KOTAK AKSI & PENGAMANAN WEWENANG MEJA (DESK ACTION CONTROLLER) */}
      {/* ========================================================================= */}
      <div className="p-6 rounded-3xl bg-white border border-purple-100 shadow-sm space-y-4">
        <div className="flex items-center justify-between border-b border-purple-50 pb-3">
          <div className="flex items-center gap-2">
            <ShieldCheck className="w-5 h-5 text-purple-700" />
            <h3 className="text-sm font-extrabold text-slate-900">
              Panel Pengesahan & Pengalihan Meja Berkas
            </h3>
          </div>

          <div className="flex items-center gap-2">
            {authority.isSuperadminOverride && (
              <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-amber-100 text-amber-900 border border-amber-300 flex items-center gap-1">
                <Crown className="w-3 h-3 text-amber-700" />
                <span>Mode Superadmin</span>
              </span>
            )}
            <span className="text-[11px] font-semibold text-purple-700 bg-purple-50 px-2 py-0.5 rounded-md">
              Posisi: {authority.deskName}
            </span>
          </div>
        </div>

        {/* JIKA USER TIDAK MEMILIKI WEWENANG DI MEJA SAAT INI */}
        {!authority.canAct ? (
          <div className="p-4 rounded-2xl bg-amber-50/80 border border-amber-200 text-amber-950 space-y-2">
            <div className="flex items-start gap-3">
              <div className="w-9 h-9 rounded-xl bg-amber-200/80 text-amber-900 flex items-center justify-center flex-shrink-0 mt-0.5">
                <Lock className="w-5 h-5 text-amber-800" />
              </div>
              <div className="space-y-1">
                <h4 className="font-extrabold text-xs text-amber-900 flex items-center gap-1.5">
                  <span>Wewenang Aksi Terkunci: Berkas Sedang Berada di Meja Lain</span>
                </h4>
                <p className="text-xs text-amber-800 leading-relaxed">
                  {authority.reason}
                </p>
                <p className="text-[11px] text-amber-700/80">
                  Akun aktif Anda: <strong>{currentUser?.nama}</strong> (Peran: <span className="uppercase font-mono font-bold">{currentUser?.role}</span>)
                </p>
              </div>
            </div>
          </div>
        ) : (
          /* JIKA USER BERHAK MEMBERIKAN AKSI DI MEJA INI */
          <div className="space-y-4 animate-in fade-in">
            {/* Review Note Input */}
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                Catatan Verifikasi / Disposisi (Opsional):
              </label>
              <textarea
                value={reviewNote}
                onChange={(e) => setReviewNote(e.target.value)}
                placeholder="Tuliskan catatan verifikasi, nomor SPM, atau kekurangan berkas..."
                rows={2}
                className="w-full px-4 py-2 bg-purple-50/40 border border-purple-200 rounded-xl text-xs text-slate-800 focus:outline-none focus:ring-2 focus:ring-purple-400"
              ></textarea>
            </div>

            {/* Tombol Aksi Spesifik Meja */}
            <div className="flex flex-wrap items-center gap-3 pt-1">
              {/* 1. AKSI DI MEJA PPK (Dari PPK diteruskan ke Meja Bendahara) */}
              {transaction.status_dokumen === 'Di PPK' && (
                <>
                  <button
                    onClick={handleApprovePPK}
                    className="px-5 py-2.5 rounded-xl bg-purple-700 hover:bg-purple-800 text-white font-bold text-xs flex items-center gap-2 shadow-md transition"
                  >
                    <CheckCircle2 className="w-4 h-4 text-amber-300" />
                    <span>Setujui Sebagai PPK (Teruskan ke Meja Bendahara)</span>
                  </button>

                  <button
                    onClick={handleMintaPerbaikanPPK}
                    className="px-4 py-2.5 rounded-xl bg-amber-100 hover:bg-amber-200 text-amber-900 font-bold text-xs flex items-center gap-1.5 transition border border-amber-200"
                  >
                    <AlertCircle className="w-4 h-4 text-amber-700" />
                    <span>Kembalikan ke Meja PJ (Minta Revisi)</span>
                  </button>
                </>
              )}

              {/* 2. AKSI DI MEJA BENDAHARA (Dari Bendahara diteruskan ke Meja PPSPM) */}
              {transaction.status_dokumen === 'Di Bendahara' && (
                <>
                  <button
                    onClick={handleApproveBendahara}
                    className="px-5 py-2.5 rounded-xl bg-amber-600 hover:bg-amber-700 text-white font-extrabold text-xs flex items-center gap-2 shadow-md transition"
                  >
                    <CheckCircle2 className="w-4 h-4 text-amber-200" />
                    <span>Verifikasi Kuitansi & Pajak (Kirim ke Meja PPSPM)</span>
                  </button>

                  <button
                    onClick={handleMintaPerbaikanBendahara}
                    className="px-4 py-2.5 rounded-xl bg-amber-100 hover:bg-amber-200 text-amber-900 font-bold text-xs flex items-center gap-1.5 transition border border-amber-200"
                  >
                    <AlertCircle className="w-4 h-4 text-amber-700" />
                    <span>Kembalikan ke Meja PJ (Revisi Kuitansi/Pajak)</span>
                  </button>
                </>
              )}

              {/* 3. AKSI DI MEJA PPSPM (Dari PPSPM diterbitkan SPM & disimpan ke Arsip) */}
              {transaction.status_dokumen === 'Di PPSPM' && (
                <>
                  <button
                    onClick={handleApprovePPSPM}
                    className="px-6 py-2.5 rounded-xl bg-indigo-700 hover:bg-indigo-800 text-white font-extrabold text-xs flex items-center gap-2 shadow-md transition"
                  >
                    <FileText className="w-4 h-4 text-indigo-200" />
                    <span>Terbitkan SPM & Sahkan (Simpan ke Meja Arsip)</span>
                  </button>

                  <button
                    onClick={handleTolakPPSPM}
                    className="px-4 py-2.5 rounded-xl bg-rose-100 hover:bg-rose-200 text-rose-900 font-bold text-xs flex items-center gap-1.5 transition border border-rose-200"
                  >
                    <RotateCcw className="w-4 h-4 text-rose-700" />
                    <span>Tolak & Kembalikan ke Meja Bendahara</span>
                  </button>
                </>
              )}

              {/* 4. AKSI DI MEJA PJ (REVISI ATAU DRAF) */}
              {(transaction.status_dokumen === 'Perlu Perbaikan' || transaction.status_dokumen === 'Draft') && (
                <button
                  onClick={handleAjukanUlangPJ}
                  className="px-6 py-2.5 rounded-xl bg-purple-700 hover:bg-purple-800 text-white font-bold text-xs flex items-center gap-2 shadow-md transition"
                >
                  <Send className="w-4 h-4 text-amber-300" />
                  <span>Ajukan Dokumen ke Meja PPK</span>
                </button>
              )}
            </div>
          </div>
        )}
      </div>

      {/* Rincian Finansial & Syarat Dokumen */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Rincian Nilai */}
        <div className="p-6 rounded-3xl bg-white border border-purple-100 shadow-sm space-y-3">
          <h3 className="text-sm font-bold text-slate-800 border-b border-purple-50 pb-2">
            Rincian Nilai Pembayaran
          </h3>
          <div className="space-y-2 text-xs">
            <div className="flex justify-between py-1">
              <span className="text-slate-500">Jumlah Pengeluaran Bruto</span>
              <span className="font-mono font-bold text-slate-900">
                Rp {Number(transaction.jumlah_pengeluaran || 0).toLocaleString('id-ID')}
              </span>
            </div>
            <div className="flex justify-between py-1 text-rose-600">
              <span>Jumlah Potongan Pajak</span>
              <span className="font-mono font-bold">
                - Rp {Number(transaction.jumlah_potongan || 0).toLocaleString('id-ID')}
              </span>
            </div>
            <div className="flex justify-between py-2 border-t border-purple-100 font-extrabold text-sm text-purple-950">
              <span>Jumlah Pembayaran Netto</span>
              <span className="font-mono text-emerald-700">
                Rp {Number(transaction.jumlah_pembayaran || 0).toLocaleString('id-ID')}
              </span>
            </div>
          </div>

          {transaction.catatan_kekurangan && (
            <div className="p-3 rounded-xl bg-amber-50 border border-amber-200 text-amber-900 text-xs mt-3">
              <strong>Catatan Kekurangan Dokumen:</strong>
              <p className="mt-0.5">{transaction.catatan_kekurangan}</p>
            </div>
          )}
        </div>

        {/* Checklist Dokumen Standar */}
        <div className="p-6 rounded-3xl bg-white border border-purple-100 shadow-sm space-y-3">
          <h3 className="text-sm font-bold text-slate-800 border-b border-purple-50 pb-2 flex items-center justify-between">
            <span>Verifikasi Syarat Dokumen ({akun.kode})</span>
            <span className="text-[10px] text-purple-700 font-semibold">{akun.nama}</span>
          </h3>

          <div className="space-y-2 max-h-72 overflow-y-auto pr-1">
            {akun.syarat.map((syarat, idx) => {
              const isChecked = checkedDocs[syarat] || transaction.kelengkapan_dokumen === 'LENGKAP';
              return (
                <label
                  key={idx}
                  className="flex items-center justify-between p-2 rounded-xl hover:bg-purple-50/50 cursor-pointer text-xs"
                >
                  <span className={`text-slate-700 ${isChecked ? 'font-semibold text-purple-950' : ''}`}>
                    {idx + 1}. {syarat}
                  </span>
                  <input
                    type="checkbox"
                    checked={isChecked}
                    onChange={() => toggleDoc(syarat)}
                    className="rounded text-purple-600 focus:ring-purple-400"
                  />
                </label>
              );
            })}
          </div>
        </div>
      </div>

      {/* Riwayat Jejak Perpindahan Meja (Chain of Custody Audit Trail) */}
      <div className="p-6 rounded-3xl bg-white border border-purple-100 shadow-sm space-y-3">
        <h3 className="text-sm font-bold text-slate-800 border-b border-purple-50 pb-2 flex items-center gap-2">
          <History className="w-4 h-4 text-purple-700" />
          <span>Riwayat Jejak Disposisi Meja (Audit Trail)</span>
        </h3>

        {transaction.logs && transaction.logs.length > 0 ? (
          <div className="space-y-3 pt-1">
            {transaction.logs.map((log, idx) => (
              <div key={log.id || idx} className="p-3 bg-purple-50/40 border border-purple-100 rounded-2xl flex items-start justify-between text-xs gap-3">
                <div className="space-y-0.5">
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-purple-950">{log.actor_nama}</span>
                    <span className="text-[10px] bg-purple-100 text-purple-800 px-1.5 py-0.2 rounded font-mono font-semibold">
                      {log.actor_role?.toUpperCase()}
                    </span>
                  </div>
                  <p className="text-[11px] text-slate-600">
                    Memindahkan berkas ke: <strong className="text-purple-900">{log.meja_tujuan}</strong>
                  </p>
                  {log.catatan && (
                    <p className="text-[11px] text-slate-500 italic mt-0.5">"{log.catatan}"</p>
                  )}
                </div>
                <div className="text-[10px] text-slate-400 font-mono whitespace-nowrap">
                  {new Date(log.timestamp).toLocaleDateString('id-ID', { hour: '2-digit', minute: '2-digit' })}
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="p-4 text-center text-xs text-slate-400 italic">
            Belum ada perpindahan meja lebih lanjut tercatat untuk berkas ini.
          </div>
        )}
      </div>
    </div>
  );
}
