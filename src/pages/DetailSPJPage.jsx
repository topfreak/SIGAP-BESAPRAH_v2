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
  Crown
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { KODE_AKUN_LIST } from '../lib/seedData';
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

  const isSuperadmin = currentUser?.role === 'superadmin';
  const isPPK = currentUser?.role === 'ppk' || isSuperadmin;
  const isPPSPM = currentUser?.role === 'ppspm' || isSuperadmin;
  const isBendahara = currentUser?.role === 'bendahara' || isSuperadmin;
  const isPJ = currentUser?.role === 'pj_kegiatan' || isSuperadmin;

  const toggleDoc = (doc) => {
    setCheckedDocs(prev => ({ ...prev, [doc]: !prev[doc] }));
  };

  // Actions for Approval
  const handleApprovePPK = () => {
    updateTransactionStatus(transaction.id, {
      status_dokumen: 'Di PPSPM',
      posisi_dokumen: 'Di PPSPM',
      meja_berkas: 'Meja PPSPM (Pengujian SPM)',
      review_ppk: reviewNote ? `Disetujui: ${reviewNote}` : 'Disetujui tanpa catatan oleh PPK'
    });
    setSuccessNotice('Dokumen berhasil disetujui PPK dan dipindahkan ke Meja PPSPM.');
    setTimeout(() => setSuccessNotice(''), 4000);
  };

  const handleMintaPerbaikan = () => {
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
    setTimeout(() => setSuccessNotice(''), 4000);
  };

  const handleApprovePPSPM = () => {
    updateTransactionStatus(transaction.id, {
      status_dokumen: 'Di Bendahara',
      posisi_dokumen: 'Di Bendahara',
      meja_berkas: 'Meja Bendahara (Pencairan Dana)',
      review_ppspm: reviewNote ? `SPM Diterbitkan: ${reviewNote}` : 'Disetujui tanpa catatan & SPM terbit'
    });
    setSuccessNotice('SPM berhasil diterbitkan dan dokumen dipindahkan ke Meja Bendahara Pengeluaran.');
    setTimeout(() => setSuccessNotice(''), 4000);
  };

  const handleBayarBendahara = () => {
    updateTransactionStatus(transaction.id, {
      status_dokumen: 'Selesai',
      posisi_dokumen: 'Selesai',
      meja_berkas: 'Meja Arsip Keuangan (Lunas / SP2D Terbit)',
      kelengkapan_dokumen: 'LENGKAP',
      tanggal_sp2d: new Date().toISOString().split('T')[0],
      review_bdh: 'Telah dicairkan / SP2D terbit'
    });
    setSuccessNotice('Pembayaran berhasil dikonfirmasi lunas dan berkas diarsipkan.');
    setTimeout(() => setSuccessNotice(''), 4000);
  };

  return (
    <div className="space-y-6 max-w-5xl mx-auto">
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
            className="px-3.5 py-2 rounded-xl bg-white border border-purple-200 text-purple-900 font-bold text-xs hover:bg-purple-50 flex items-center gap-2 shadow-2xs"
          >
            <Printer className="w-4 h-4" />
            <span>Cetak Lembar Verifikasi</span>
          </button>
        </div>
      </div>

      {successNotice && (
        <div className="p-4 rounded-2xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-semibold flex items-center gap-2">
          <CheckCircle2 className="w-5 h-5 text-emerald-600 flex-shrink-0" />
          <span>{successNotice}</span>
        </div>
      )}

      {/* POSISI MEJA BERKAS BANNER (SANGAT MENCOLOK & JELAS) */}
      <div className="p-4 rounded-2xl bg-amber-300 text-purple-950 border border-amber-400 shadow-md flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-purple-950 text-amber-300 flex items-center justify-center font-bold text-lg flex-shrink-0 shadow-xs">
            📍
          </div>
          <div>
            <p className="text-[11px] font-extrabold uppercase tracking-wider text-purple-900">
              Posisi Meja Berkas Saat Ini:
            </p>
            <p className="text-base font-black text-purple-950">
              {transaction.meja_berkas || transaction.posisi_dokumen || 'Meja Verifikator'}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <Badge status={transaction.kelengkapan_dokumen || 'BELUM LENGKAP'} type="kelengkapan" />
          <Badge status={transaction.mekanisme_ls_gup || 'LS'} type="ls_gup" />
        </div>
      </div>

      {/* Main Header Card */}
      <div className="p-6 md:p-8 rounded-3xl bg-gradient-to-r from-[#250b52] via-[#371172] to-[#4c1d95] text-white shadow-xl">
        <div className="flex flex-col md:flex-row md:items-start justify-between gap-4">
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <span className="font-mono font-extrabold text-xs px-2.5 py-0.5 rounded-md bg-amber-400 text-purple-950">
                {transaction.no_spm_spp || transaction.no_pengajuan}
              </span>
              <span className="text-xs bg-white/20 text-purple-200 px-2 py-0.5 rounded font-semibold">
                Akun: {transaction.kode_akun}
              </span>
              <span className="text-xs bg-white/20 text-purple-200 px-2 py-0.5 rounded font-semibold">
                {transaction.tim_kerja}
              </span>
            </div>

            <h1 className="text-xl md:text-2xl font-extrabold text-white leading-tight">
              {transaction.uraian_kegiatan}
            </h1>

            <div className="flex flex-wrap items-center gap-4 text-xs text-purple-200 pt-1">
              <span className="flex items-center gap-1.5">
                <User className="w-3.5 h-3.5 text-amber-300" />
                PJ: <strong>{transaction.pj_nama}</strong>
              </span>
              {transaction.tanggal_terima && (
                <span className="flex items-center gap-1.5">
                  <Calendar className="w-3.5 h-3.5 text-amber-300" />
                  Diterima: {transaction.tanggal_terima}
                </span>
              )}
            </div>
          </div>

          <div className="text-left md:text-right space-y-2">
            <Badge status={transaction.posisi_dokumen || transaction.status_dokumen} />
            <div className="mt-2">
              <span className="text-[11px] text-purple-300 block">Jumlah Pembayaran Netto</span>
              <span className="text-2xl font-black text-amber-300 font-mono">
                Rp {Number(transaction.jumlah_pembayaran || 0).toLocaleString('id-ID')}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Review & Approval Action Card (DIBATASI OLEH ROLE / SUPERADMIN) */}
      <div className="p-6 rounded-3xl bg-white border border-purple-100 shadow-sm space-y-4">
        <div className="flex items-center justify-between border-b border-purple-50 pb-3">
          <div>
            <h3 className="text-sm font-extrabold text-slate-900 flex items-center gap-1.5">
              <span>Aksi Tindak Lanjut Berkas di Meja Anda</span>
              {isSuperadmin && <Crown className="w-4 h-4 text-amber-500" title="Akses Superadmin Aktif" />}
            </h3>
            <p className="text-xs text-slate-500">
              Pengguna aktif: <strong className="text-purple-900">{currentUser?.nama}</strong> (Peran: <strong className="uppercase">{currentUser?.role}</strong>)
            </p>
          </div>
        </div>

        <div>
          <label className="block text-xs font-bold text-slate-700 mb-1.5">
            Catatan Review / Disposisi Berkas:
          </label>
          <textarea
            value={reviewNote}
            onChange={(e) => setReviewNote(e.target.value)}
            placeholder="Tuliskan catatan verifikasi atau kekurangan dokumen yang perlu dilengkapi..."
            rows={2}
            className="w-full px-4 py-2 bg-purple-50/40 border border-purple-200 rounded-xl text-xs text-slate-800 focus:outline-none focus:ring-2 focus:ring-purple-400"
          ></textarea>
        </div>

        {/* Buttons controlled by role */}
        <div className="flex flex-wrap items-center gap-2.5 pt-1">
          {/* PPK Action */}
          {isPPK && (
            <>
              <button
                onClick={handleApprovePPK}
                className="px-4 py-2 rounded-xl bg-purple-700 hover:bg-purple-800 text-white font-bold text-xs flex items-center gap-1.5 shadow-md transition"
              >
                <CheckCircle2 className="w-4 h-4 text-amber-300" />
                <span>Setujui Sebagai PPK (Kirim ke Meja PPSPM)</span>
              </button>

              <button
                onClick={handleMintaPerbaikan}
                className="px-4 py-2 rounded-xl bg-amber-100 hover:bg-amber-200 text-amber-900 font-bold text-xs flex items-center gap-1.5 transition"
              >
                <AlertCircle className="w-4 h-4 text-amber-600" />
                <span>Kembalikan ke Meja PJ (Minta Revisi)</span>
              </button>
            </>
          )}

          {/* PPSPM Action */}
          {isPPSPM && (
            <button
              onClick={handleApprovePPSPM}
              className="px-4 py-2 rounded-xl bg-indigo-700 hover:bg-indigo-800 text-white font-bold text-xs flex items-center gap-1.5 shadow-md transition"
            >
              <FileText className="w-4 h-4 text-indigo-200" />
              <span>Terbitkan SPM (Kirim ke Meja Bendahara)</span>
            </button>
          )}

          {/* Bendahara Action */}
          {isBendahara && (
            <button
              onClick={handleBayarBendahara}
              className="px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs flex items-center gap-1.5 shadow-md transition"
            >
              <Coins className="w-4 h-4 text-emerald-200" />
              <span>Konfirmasi Cair / Simpan ke Meja Arsip</span>
            </button>
          )}

          {!isPPK && !isPPSPM && !isBendahara && (
            <div className="text-xs text-slate-500 italic flex items-center gap-1.5 p-2 rounded-lg bg-slate-50">
              <Lock className="w-3.5 h-3.5 text-slate-400" />
              <span>Anda masuk sebagai {currentUser?.role}. Tombol verifikasi hanya aktif untuk PPK, PPSPM, atau Bendahara.</span>
            </div>
          )}
        </div>
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
            <div className="p-3 rounded-xl bg-amber-50 border border-amber-200 text-amber-900 text-xs">
              <strong>Catatan Kekurangan:</strong>
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
    </div>
  );
}
