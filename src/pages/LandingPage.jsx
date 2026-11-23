import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { 
  ShieldCheck, 
  ArrowRight, 
  Search, 
  FileCheck2, 
  Calculator, 
  Users, 
  FileSpreadsheet, 
  TrendingUp, 
  ChevronRight,
  Clock,
  Sparkles,
  Award
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';

export default function LandingPage() {
  const navigate = useNavigate();
  const { transactions, currentUser } = useAuth();
  const [quickSearch, setQuickSearch] = useState('');

  const handleQuickSearch = (e) => {
    e.preventDefault();
    if (quickSearch.trim()) {
      navigate(`/lacak?q=${encodeURIComponent(quickSearch.trim())}`);
    } else {
      navigate('/lacak');
    }
  };

  const totalPengajuan = transactions.length;
  const selesaiCount = transactions.filter(t => t.status_dokumen === 'Selesai').length;
  const persenSelesai = Math.round((selesaiCount / (totalPengajuan || 1)) * 100);

  return (
    <div className="min-h-screen bg-[#FAF9FF] text-slate-800 flex flex-col font-sans">
      {/* Top Navbar */}
      <nav className="h-20 bg-white/90 backdrop-blur-md border-b border-purple-100 sticky top-0 z-40 px-6 lg:px-12 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-11 h-11 rounded-2xl bg-gradient-to-tr from-purple-700 to-indigo-600 flex items-center justify-center shadow-lg shadow-purple-500/20 text-white">
            <ShieldCheck className="w-6 h-6" />
          </div>
          <div>
            <span className="font-extrabold text-lg lg:text-xl tracking-wide bg-gradient-to-r from-purple-950 via-purple-800 to-indigo-900 bg-clip-text text-transparent">
              SIGAP BESAPRAH
            </span>
            <p className="text-[11px] text-purple-700 font-semibold tracking-wide -mt-0.5">
              BPS KABUPATEN SAMBAS
            </p>
          </div>
        </div>

        <div className="hidden md:flex items-center gap-8 text-sm font-medium text-slate-600">
          <a href="#fitur" className="hover:text-purple-700 transition">Fitur Utama</a>
          <a href="#filosofi" className="hover:text-purple-700 transition">Filosofi Besaprah</a>
          <Link to="/panduan-akun" className="hover:text-purple-700 transition">Panduan SPJ</Link>
          <Link to="/kalkulator-pajak" className="hover:text-purple-700 transition">Kalkulator Pajak</Link>
        </div>

        <div className="flex items-center gap-3">
          <Link
            to="/lacak"
            className="hidden sm:inline-flex items-center gap-1.5 px-4 py-2 text-xs font-semibold text-purple-700 bg-purple-50 hover:bg-purple-100 rounded-xl border border-purple-200 transition"
          >
            <Search className="w-3.5 h-3.5" />
            <span>Lacak Berkas</span>
          </Link>
          {currentUser ? (
            <Link
              to="/dashboard"
              className="inline-flex items-center gap-2 px-5 py-2.5 text-xs font-bold text-white bg-gradient-to-r from-purple-700 to-indigo-600 hover:from-purple-800 hover:to-indigo-700 rounded-xl shadow-md shadow-purple-500/25 transition transform active:scale-95"
            >
              <span>Dasbor ({currentUser.nama.split(' ')[0]})</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
          ) : (
            <Link
              to="/login"
              className="inline-flex items-center gap-2 px-5 py-2.5 text-xs font-bold text-white bg-gradient-to-r from-purple-700 to-indigo-600 hover:from-purple-800 hover:to-indigo-700 rounded-xl shadow-md shadow-purple-500/25 transition transform active:scale-95"
            >
              <span>Masuk Sistem</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
          )}
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative overflow-hidden pt-12 pb-20 lg:pt-20 lg:pb-28 bg-gradient-to-b from-purple-900 via-[#371172] to-[#250b52] text-white">
        {/* Glow decorations */}
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-purple-500/20 rounded-full blur-3xl pointer-events-none"></div>
        <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-indigo-500/20 rounded-full blur-3xl pointer-events-none"></div>

        <div className="max-w-6xl mx-auto px-6 lg:px-12 relative z-10 text-center">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/10 backdrop-blur-md border border-purple-400/30 text-xs font-medium text-purple-200 mb-6 shadow-inner">
            <Sparkles className="w-3.5 h-3.5 text-amber-300" />
            <span>Sistem Informasi Pertanggungjawaban Keuangan & Administrasi</span>
          </div>

          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight text-white max-w-4xl mx-auto leading-tight">
            SIGAP BESAPRAH
          </h1>
          <p className="mt-2 text-base sm:text-lg font-medium text-purple-200 max-w-2xl mx-auto">
            Sistem Integrasi dan Gerakan Administrasi Pertanggungjawaban yang Rapi dan Akuntabel
          </p>

          <div className="mt-4 inline-block px-5 py-2 rounded-2xl bg-amber-400/10 border border-amber-300/30 text-amber-300 font-semibold text-sm italic shadow-sm">
            “Bersaprah dalam Kerja, Sepakat dalam Akuntabilitas.”
          </div>

          <p className="mt-6 text-sm text-purple-200/90 max-w-2xl mx-auto leading-relaxed">
            Menyatukan seluruh proses verifikasi administrasi SPJ, kalkulasi pajak negara otomatis, 
            dan monitoring status pencairan real-time di BPS Kabupaten Sambas.
          </p>

          {/* Quick Tracking Form */}
          <div className="mt-10 max-w-xl mx-auto">
            <form onSubmit={handleQuickSearch} className="flex items-center p-2 rounded-2xl bg-white shadow-2xl border border-purple-200">
              <Search className="w-5 h-5 text-purple-400 ml-3 flex-shrink-0" />
              <input
                type="text"
                value={quickSearch}
                onChange={(e) => setQuickSearch(e.target.value)}
                placeholder="Masukkan No. SPM / SPP atau Nama Kegiatan..."
                className="w-full px-4 py-2.5 text-sm text-slate-800 placeholder-slate-400 focus:outline-none"
              />
              <button
                type="submit"
                className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-purple-700 to-indigo-600 text-white font-bold text-xs shadow-md hover:from-purple-800 hover:to-indigo-700 transition flex-shrink-0"
              >
                Cari Berkas
              </button>
            </form>
            <p className="mt-2 text-[11px] text-purple-300">
              Contoh pencarian: <span className="underline cursor-pointer" onClick={() => setQuickSearch('00042A')}>00042A</span>, <span className="underline cursor-pointer" onClick={() => setQuickSearch('Susenas')}>Susenas</span>, atau <span className="underline cursor-pointer" onClick={() => setQuickSearch('KSA Padi')}>KSA Padi</span>
            </p>
          </div>

          {/* Quick Metrics Bar */}
          <div className="mt-14 grid grid-cols-2 sm:grid-cols-4 gap-4 max-w-4xl mx-auto text-left">
            <div className="p-4 rounded-2xl bg-white/5 backdrop-blur-md border border-purple-400/20">
              <p className="text-xs text-purple-300 font-medium">Total Dokumen SPJ</p>
              <p className="text-2xl font-extrabold text-white mt-1">{totalPengajuan}</p>
            </div>
            <div className="p-4 rounded-2xl bg-white/5 backdrop-blur-md border border-purple-400/20">
              <p className="text-xs text-purple-300 font-medium">Telah Dicairkan</p>
              <p className="text-2xl font-extrabold text-emerald-300 mt-1">{selesaiCount}</p>
            </div>
            <div className="p-4 rounded-2xl bg-white/5 backdrop-blur-md border border-purple-400/20">
              <p className="text-xs text-purple-300 font-medium">Persentase Selesai</p>
              <p className="text-2xl font-extrabold text-amber-300 mt-1">{persenSelesai}%</p>
            </div>
            <div className="p-4 rounded-2xl bg-white/5 backdrop-blur-md border border-purple-400/20">
              <p className="text-xs text-purple-300 font-medium">Aparatur BPS</p>
              <p className="text-2xl font-extrabold text-indigo-300 mt-1">25 Pegawai</p>
            </div>
          </div>
        </div>
      </section>

      {/* Fitur Utama Section */}
      <section id="fitur" className="py-20 px-6 lg:px-12 max-w-6xl mx-auto">
        <div className="text-center max-w-2xl mx-auto mb-16">
          <span className="px-3.5 py-1 rounded-full bg-purple-100 text-purple-800 text-xs font-bold uppercase tracking-wider">
            Fitur Utama
          </span>
          <h2 className="text-2xl lg:text-3xl font-extrabold text-slate-900 mt-3">
            Digitalisasi Administrasi Keuangan Terintegrasi
          </h2>
          <p className="text-sm text-slate-500 mt-2">
            Dirancang berdasarkan pola kerja nyata BPS Kabupaten Sambas untuk memudahkan seluruh tim.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="p-6 rounded-2xl bg-white border border-purple-100 shadow-sm hover:shadow-xl hover:border-purple-300 transition group">
            <div className="w-12 h-12 rounded-xl bg-purple-100 text-purple-700 flex items-center justify-center font-bold mb-4 group-hover:scale-110 transition">
              <FileSpreadsheet className="w-6 h-6" />
            </div>
            <h3 className="text-base font-bold text-slate-800 mb-2">Monitoring Pembayaran & SPJ</h3>
            <p className="text-xs text-slate-500 leading-relaxed">
              Pantau kelengkapan dokumen untuk semua jenis pencairan: Honor Petugas, Perjadin, Belanja Bahan, Pengadaan ATK, hingga Sewa secara transparan.
            </p>
          </div>

          <div className="p-6 rounded-2xl bg-white border border-purple-100 shadow-sm hover:shadow-xl hover:border-purple-300 transition group">
            <div className="w-12 h-12 rounded-xl bg-indigo-100 text-indigo-700 flex items-center justify-center font-bold mb-4 group-hover:scale-110 transition">
              <Calculator className="w-6 h-6" />
            </div>
            <h3 className="text-base font-bold text-slate-800 mb-2">Kalkulator Pajak (Tax Engine)</h3>
            <p className="text-xs text-slate-500 leading-relaxed">
              Otomatisasi perhitungan PPN 11%, PPh 21 (PNS & Mitra tarif PTKP Rp 4,5 jt), PPh 22, PPh 23, PPh 4(2), dan ketentuan bea meterai Rp 10.000.
            </p>
          </div>

          <div className="p-6 rounded-2xl bg-white border border-purple-100 shadow-sm hover:shadow-xl hover:border-purple-300 transition group">
            <div className="w-12 h-12 rounded-xl bg-emerald-100 text-emerald-700 flex items-center justify-center font-bold mb-4 group-hover:scale-110 transition">
              <FileCheck2 className="w-6 h-6" />
            </div>
            <h3 className="text-base font-bold text-slate-800 mb-2">Alur Tertib & Verifikasi SPJ</h3>
            <p className="text-xs text-slate-500 leading-relaxed">
              Alur pengajuan bertahap dari PJ Kegiatan, PPK, Bendahara, PPSPM hingga Meja Arsip dilengkapi checklist dokumen 14 kode akun belanja.
            </p>
          </div>
        </div>
      </section>

      {/* Filosofi Besaprah Section */}
      <section id="filosofi" className="py-16 px-6 lg:px-12 bg-gradient-to-r from-purple-100/60 via-purple-50 to-indigo-100/60 border-y border-purple-100">
        <div className="max-w-5xl mx-auto flex flex-col md:flex-row items-center gap-10">
          <div className="w-20 h-20 md:w-28 md:h-28 rounded-3xl bg-gradient-to-tr from-purple-700 to-amber-400 flex items-center justify-center text-white shadow-xl flex-shrink-0">
            <Award className="w-10 h-10 md:w-14 md:h-14 text-white" />
          </div>
          <div className="flex-1">
            <span className="text-xs font-bold text-purple-700 uppercase tracking-widest">
              Nilai Budaya Lokal Sambas
            </span>
            <h2 className="text-xl lg:text-2xl font-extrabold text-purple-950 mt-1">
              Tradisi Besaprah: Duduk Bersama, Setara, dan Tertib
            </h2>
            <p className="text-xs sm:text-sm text-slate-600 mt-2 leading-relaxed">
              Tradisi <strong>Besaprah</strong> melambangkan kebersamaan, keterbukaan, dan tertib tata krama. 
              Dalam penatausahaan SPJ di BPS Kabupaten Sambas, prinsip ini diwujudkan sebagai wadah komunikasi yang sejajar antara Penanggung Jawab Kegiatan dengan Tim Keuangan untuk memastikan berkas rapi, sah, dan dapat dipertanggungjawabkan sesuai hukum.
            </p>
            <div className="mt-4 flex flex-wrap gap-2 text-xs font-semibold text-purple-900">
              <span className="px-3 py-1 bg-white rounded-lg border border-purple-200">#Keterbukaan</span>
              <span className="px-3 py-1 bg-white rounded-lg border border-purple-200">#Kebersamaan</span>
              <span className="px-3 py-1 bg-white rounded-lg border border-purple-200">#AkuntabilitasAPBN</span>
              <span className="px-3 py-1 bg-white rounded-lg border border-purple-200">#BPSKabupatenSambas</span>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="mt-auto py-8 px-6 lg:px-12 bg-[#250b52] text-purple-200 text-xs">
        <div className="max-w-6xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
          <div>
            <p className="font-bold text-white text-sm">SIGAP BESAPRAH - BPS Kabupaten Sambas</p>
            <p className="text-[11px] text-purple-300">“Bersaprah dalam Kerja, Sepakat dalam Akuntabilitas.”</p>
          </div>
          <div className="text-center sm:text-right text-[11px] text-purple-300">
            <p>© 2026 Badan Pusat Statistik Kabupaten Sambas, Kalimantan Barat.</p>
            <p>Dibangun untuk mempermudah monitoring administrasi dan SPJ.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
