import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { 
  Milestone, 
  ShieldCheck, 
  User, 
  FileText, 
  CheckCircle2, 
  ArrowRight, 
  AlertCircle, 
  Lock, 
  Unlock, 
  BookOpen, 
  HelpCircle, 
  ChevronRight, 
  ChevronDown, 
  FileSpreadsheet, 
  Calculator, 
  Building2, 
  Coins, 
  Sparkles,
  Info
} from 'lucide-react';

export default function PanduanAlurPage() {
  const [activeStep, setActiveStep] = useState(1);
  const [openFaq, setOpenFaq] = useState(0);

  const steps = [
    {
      step: 1,
      id: 'pj',
      title: 'Penyusunan & Pengajuan Draft',
      meja: 'Meja PJ Kegiatan',
      role: 'Penanggung Jawab (PJ) / Pengaju SPJ',
      status: 'Draft / Perlu Perbaikan',
      badgeColor: 'bg-amber-100 text-amber-900 border-amber-300',
      icon: '📝',
      summary: 'Pembuatan dokumen pertanggungjawaban kegiatan, rincian kuitansi, dan kelengkapan bukti dukung awal.',
      pelaksana: 'PJ Kegiatan yang bersangkutan atau Staf Administrasi yang membantu membuatkan draft.',
      tindakanAplikasi: [
        {
          aksi: 'Simpan Draft',
          efek: 'Menyimpan rincian SPJ sementara di sistem tanpa mengubah posisi meja (tetap di Meja PJ).'
        },
        {
          aksi: 'Ajukan ke PPK',
          efek: 'Status berubah menjadi "Di PPK" dan berkas berpindah ke "Meja PPK (Peninjauan Komitmen & SPP)". Tombol di sisi PJ otomatis terkunci (read-only).'
        }
      ],
      checklistDokumen: [
        'Surat Tugas & Daftar Hadir / Notula Kegiatan',
        'Kuitansi Asli / Bukti Pembayaran Riil / Nota Toko',
        'Laporan Hasil Pelaksanaan Kegiatan / Visum Perjadin',
        'Daftar Nominatif Honor / BAST Pekerjaan (jika ada jasa/mitra)',
        'Perhitungan Pajak awal (PPh 21/22/23/PPN) sesuai ketentuan'
      ],
      aturanPenting: 'Dokumen yang telah diajukan ke PPK tidak dapat diedit kembali oleh PJ kecuali jika PPK atau Bendahara mengembalikannya dengan status "Perlu Perbaikan".'
    },
    {
      step: 2,
      id: 'ppk',
      title: 'Peninjauan Komitmen & SPP',
      meja: 'Meja PPK',
      role: 'Pejabat Pembuat Komitmen (PPK)',
      status: 'Di PPK',
      badgeColor: 'bg-purple-100 text-purple-900 border-purple-300',
      icon: '🗄️',
      summary: 'Peninjauan kesesuaian belanja dengan DIPA/POK, keabsahan komitmen pengeluaran, dan penerbitan SPP.',
      pelaksana: 'Pejabat Pembuat Komitmen (PPK) BPS Kabupaten Sambas atau Pejabat yang ditunjuk.',
      tindakanAplikasi: [
        {
          aksi: 'Setujui & Teruskan ke Bendahara',
          efek: 'Berkas disetujui secara komitmen, status berubah menjadi "Di Bendahara" dan berpindah ke "Meja Bendahara (Verifikasi Kuitansi, Pajak & Kas)".'
        },
        {
          aksi: 'Minta Perbaikan ke PJ',
          efek: 'Status berubah menjadi "Perlu Perbaikan" dengan catatan koreksi. Berkas kembali ke "Meja PJ Kegiatan" agar diperbaiki oleh pengaju.'
        }
      ],
      checklistDokumen: [
        'Kesesuaian dengan POK (Petunjuk Operasional Kegiatan) & Mata Anggaran',
        'Kesesuaian nilai belanja dengan Surat Tugas & batasan standar biaya masukan (SBM)',
        'Ketersediaan sisa pagu anggaran pada akun belanja terkait',
        'Draft Surat Permintaan Pembayaran (SPP)'
      ],
      aturanPenting: 'PPK memastikan bahwa kegiatan benar-benar telah selesai dilaksanakan dan sah menjadi beban anggaran negara.'
    },
    {
      step: 3,
      id: 'bendahara',
      title: 'Verifikasi Kuitansi, Pajak & Kas',
      meja: 'Meja Bendahara',
      role: 'Bendahara Pengeluaran',
      status: 'Di Bendahara',
      badgeColor: 'bg-blue-100 text-blue-900 border-blue-300',
      icon: '💼',
      summary: 'Pengujian fisik bukti kuitansi, pemotongan dan penyetoran pajak, serta verifikasi ketersediaan dana kas.',
      pelaksana: 'Bendahara Pengeluaran BPS Kabupaten Sambas.',
      tindakanAplikasi: [
        {
          aksi: 'Verifikasi Pajak & Teruskan ke PPSPM',
          efek: 'Pajak dan kuitansi dinyatakan valid, status berubah menjadi "Di PPSPM" dan berkas berpindah ke "Meja PPSPM (Pengujian Formal & Penerbitan SPM)".'
        },
        {
          aksi: 'Minta Perbaikan ke PJ',
          efek: 'Status dikembalikan menjadi "Perlu Perbaikan" dengan catatan koreksi rincian kuitansi/bukti dukung kepada PJ Kegiatan.'
        }
      ],
      checklistDokumen: [
        'Kuitansi bertanda tangan lengkap dan bermeterai cukup (Rp 10.000 jika > Rp 5 juta)',
        'Faktur Pajak / NPWP / NIK rekanan atau penerima honor',
        'Perhitungan pemotongan PPh 21 (PNS tarif Golongan, Mitra tarif PTKP) & PPN 11%',
        'Kesesuaian nomor rekening bank tujuan pencairan'
      ],
      aturanPenting: 'Bendahara bertanggung jawab penuh atas kebenaran perhitungan pajak dan kelayakan bukti pengeluaran kas.'
    },
    {
      step: 4,
      id: 'ppspm',
      title: 'Pengujian Formal & Penerbitan SPM',
      meja: 'Meja PPSPM',
      role: 'Pejabat Penandatangan SPM (PPSPM)',
      status: 'Di PPSPM',
      badgeColor: 'bg-indigo-100 text-indigo-900 border-indigo-300',
      icon: '⚖️',
      summary: 'Pengujian keabsahan dokumen secara menyeluruh dari sisi administrasi dan penerbitan Surat Perintah Membayar.',
      pelaksana: 'Pejabat Penandatangan Surat Perintah Membayar (PPSPM) BPS Kabupaten Sambas.',
      tindakanAplikasi: [
        {
          aksi: 'Terbitkan SPM & Selesaikan (Kirim ke Arsip)',
          efek: 'SPM resmi diterbitkan, status berubah menjadi "Selesai", berkas berpindah permanen ke "Meja Arsip Keuangan (Lunas / SP2D Terbit)".'
        },
        {
          aksi: 'Tolak & Kembalikan ke Bendahara',
          efek: 'Jika terdapat ketidaksesuaian administrasi pengujian SPM, berkas dikembalikan ke "Meja Bendahara" untuk ditinjau ulang.'
        }
      ],
      checklistDokumen: [
        'Kelengkapan dokumen SPP beserta lampiran verifikasi dari PPK dan Bendahara',
        'Kebenaran penulisan data rekening, nominal angka, dan terbilang pada draft SPM',
        'Pengujian kesesuaian batas waktu penyampaian SPM ke KPPN / Bank mitra'
      ],
      aturanPenting: 'Penerbitan SPM merupakan langkah otorisasi pembayaran resmi sebelum SP2D diterbitkan oleh KPPN atau kas dicairkan.'
    },
    {
      step: 5,
      id: 'arsip',
      title: 'Meja Arsip Keuangan (Lunas)',
      meja: 'Meja Arsip Keuangan',
      role: 'Arsiparis & Petugas Keuangan',
      status: 'Selesai',
      badgeColor: 'bg-emerald-100 text-emerald-900 border-emerald-300',
      icon: '🏛️',
      summary: 'Penyimpanan permanen berkas SPJ yang telah cair / terbit SP2D, pencetakan bukti pertanggungjawaban fisik.',
      pelaksana: 'Semua pihak (Akses Read-Only untuk pemantauan, cetak bukti, dan pemeriksaan BPK/Inspektorat).',
      tindakanAplikasi: [
        {
          aksi: 'Cetak Bukti SPJ & Tanda Terima',
          efek: 'Mencetak lembar tanda terima berkas fisik dan lembar verifikasi lengkap untuk penataan ordner arsip.'
        },
        {
          aksi: 'Penguncian Permanen',
          efek: 'Dokumen berstatus "Selesai" tidak dapat diubah oleh siapa pun untuk menjaga akuntabilitas audit.'
        }
      ],
      checklistDokumen: [
        'Nomor SPM dan Nomor SP2D resmi tercatat',
        'Berkas fisik lengkap tersusun rapi di ordner arsip tahun anggaran berjalan',
        'Tanda bukti transfer / pembayaran tunai kepada penerima yang sah'
      ],
      aturanPenting: 'Dokumen di Meja Arsip bersifat final, transparan, dan siap dipertanggungjawabkan saat audit internal maupun eksternal.'
    }
  ];

  const faqs = [
    {
      q: 'Apakah boleh membuatkan draft SPJ untuk orang lain?',
      a: 'Sangat Boleh. Sistem SIGAP BESAPRAH mendukung fleksibilitas kerja di BPS Kabupaten Sambas di mana rekan tim atau staf administrasi dapat membantu menginput draft SPJ untuk Penanggung Jawab (PJ) lain. Pembuat awal akan tercatat di sistem sebagai "Pengaju Asli" (created_by), sedangkan pejabat penanggung jawab kegiatan tercatat sebagai "PJ Kegiatan". Namun, setelah berkas diajukan ke PPK, proses verifikasi dan persetujuan hanya dapat dilakukan oleh pejabat yang memegang meja berkas tersebut.'
    },
    {
      q: 'Mengapa tombol aksi (Setujui/Tolak/Teruskan) terkunci dan berwarna abu-abu?',
      a: 'Hal ini merupakan fitur keamanan utama "Pengamanan Meja Berkas" (Desk-Based Security). Sistem memastikan bahwa hanya pengguna dengan peran yang sesuai dan saat berkas sedang berada di meja tugasnya yang dapat memberikan tindakan. Misalnya, Bendahara tidak bisa melakukan verifikasi kuitansi jika berkas masih berada di meja PPK atau sedang direvisi oleh PJ Kegiatan. Hal ini mencegah bypass wewenang dan menjaga integritas audit.'
    },
    {
      q: 'Apa yang harus dilakukan jika berkas saya berstatus "Perlu Perbaikan"?',
      a: 'Buka menu "Monitoring & Daftar SPJ", pilih tab "Perlu Perbaikan" (atau filter meja PJ Kegiatan). Klik pada berkas tersebut untuk melihat catatan kekurangan yang diberikan oleh PPK atau Bendahara di kotak peringatan kuning. Lengkapi kekurangan tersebut, perbarui lampiran atau nominal, lalu klik tombol "Ajukan Ulang ke PPK".'
    },
    {
      q: 'Bagaimana jika ada perbedaan perhitungan pajak antara pengaju dan bendahara?',
      a: 'Bendahara Pengeluaran adalah verifikator akhir untuk perhitungan pajak resmi. Pengaju dapat memanfaatkan menu "Kalkulator Pajak (Tax Engine)" yang telah terintegrasi di sistem untuk melakukan simulasi perhitungan tarif PPh 21 (PNS vs Mitra), PPh 22, PPh 23, PPN 11%, dan ambang batas meterai Rp 10.000 sebelum mengajukan berkas.'
    },
    {
      q: 'Apakah Superadmin bisa memproses berkas di semua meja?',
      a: 'Ya, akun dengan peran Superadmin memiliki wewenang supervisi darurat penuh untuk mengedit, memajukan, atau mengoreksi berkas di meja mana pun jika terjadi hambatan teknis, pejabat berwenang sedang dinas luar darurat, atau kebutuhan pemeliharaan data.'
    }
  ];

  return (
    <div className="space-y-8 max-w-6xl mx-auto animate-in fade-in duration-200">
      {/* Hero Header */}
      <div className="p-6 md:p-8 rounded-3xl bg-gradient-to-r from-[#250b52] via-[#371172] to-[#581c87] text-white shadow-xl relative overflow-hidden">
        <div className="relative z-10 space-y-3">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/15 text-purple-200 text-xs font-semibold backdrop-blur-sm">
            <Milestone className="w-3.5 h-3.5 text-amber-300" />
            <span>Tata Kelola Alur Pengajuan SPJ BPS Kabupaten Sambas</span>
          </div>

          <h1 className="text-2xl md:text-3xl font-extrabold tracking-tight">
            Panduan Alur Pengajuan & Pengamanan Meja Berkas
          </h1>

          <p className="text-xs md:text-sm text-purple-200 max-w-3xl leading-relaxed">
            Sistem <strong>SIGAP BESAPRAH</strong> menerapkan alur bertahap yang tertib dan transparan sesuai tata kelola keuangan negara. Setiap berkas bergerak berurutan dari meja ke meja dengan proteksi hak akses ketat:
          </p>

          <div className="pt-2 flex flex-wrap items-center gap-2 text-xs font-bold text-amber-300">
            <span className="px-3 py-1 rounded-lg bg-white/10 border border-white/20">1. PJ Kegiatan</span>
            <span>&rarr;</span>
            <span className="px-3 py-1 rounded-lg bg-white/10 border border-white/20">2. PPK</span>
            <span>&rarr;</span>
            <span className="px-3 py-1 rounded-lg bg-white/10 border border-white/20">3. Bendahara</span>
            <span>&rarr;</span>
            <span className="px-3 py-1 rounded-lg bg-white/10 border border-white/20">4. PPSPM</span>
            <span>&rarr;</span>
            <span className="px-3 py-1 rounded-lg bg-white/10 border border-white/20">5. Meja Arsip (Cair)</span>
          </div>
        </div>

        {/* Background glow decoration */}
        <div className="absolute right-0 bottom-0 w-80 h-80 bg-purple-500/10 rounded-full blur-3xl pointer-events-none"></div>
      </div>

      {/* Interactive Step-by-Step Navigator */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-base font-extrabold text-slate-900 flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-purple-700" />
            <span>Tahapan Alur Pengajuan Berkas (Klik untuk Melihat Rincian)</span>
          </h2>
          <span className="text-xs text-slate-400">5 Tahap Resmi</span>
        </div>

        {/* Step Buttons */}
        <div className="grid grid-cols-1 sm:grid-cols-3 lg:grid-cols-5 gap-2.5">
          {steps.map((s) => {
            const isActive = activeStep === s.step;
            return (
              <button
                key={s.step}
                type="button"
                onClick={() => setActiveStep(s.step)}
                className={`p-3.5 rounded-2xl text-left transition-all border ${
                  isActive
                    ? 'bg-purple-900 text-white border-purple-950 shadow-md transform -translate-y-0.5'
                    : 'bg-white text-slate-700 border-purple-100 hover:border-purple-300 hover:bg-purple-50/50 shadow-xs'
                }`}
              >
                <div className="flex items-center justify-between">
                  <span className="text-lg">{s.icon}</span>
                  <span className={`text-[10px] font-extrabold px-2 py-0.5 rounded-full ${
                    isActive ? 'bg-amber-400 text-purple-950' : 'bg-purple-100 text-purple-900'
                  }`}>
                    Tahap {s.step}
                  </span>
                </div>
                <h3 className={`font-bold text-xs mt-2 truncate ${isActive ? 'text-white' : 'text-slate-900'}`}>
                  {s.meja}
                </h3>
                <p className={`text-[10px] mt-0.5 truncate ${isActive ? 'text-purple-200' : 'text-slate-400'}`}>
                  {s.title}
                </p>
              </button>
            );
          })}
        </div>

        {/* Active Step Detailed Card */}
        {(() => {
          const s = steps.find(item => item.step === activeStep) || steps[0];
          return (
            <div className="p-6 md:p-8 rounded-3xl bg-white border border-purple-200 shadow-sm space-y-6 animate-in fade-in duration-150">
              {/* Header Box */}
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-6 border-b border-purple-100">
                <div className="flex items-center gap-4">
                  <div className="w-14 h-14 rounded-2xl bg-purple-100 text-purple-900 flex items-center justify-center text-2xl flex-shrink-0 shadow-inner">
                    {s.icon}
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-bold px-2.5 py-0.5 rounded-full bg-purple-100 text-purple-900">
                        Tahap {s.step} dari 5
                      </span>
                      <span className="text-xs text-slate-400">•</span>
                      <span className="text-xs font-semibold text-slate-500">Status: <strong>{s.status}</strong></span>
                    </div>
                    <h3 className="text-lg md:text-xl font-extrabold text-slate-900 mt-1">
                      {s.meja}: {s.title}
                    </h3>
                    <p className="text-xs text-slate-500 mt-0.5">
                      Penanggung Jawab Meja: <strong className="text-purple-900 font-semibold">{s.role}</strong>
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <Link
                    to={
                      s.step === 1 ? '/pengajuan-spj?tab=Perlu%20Perbaikan' :
                      s.step === 2 ? '/pengajuan-spj?tab=Di%20PPK' :
                      s.step === 3 ? '/pengajuan-spj?tab=Di%20Bendahara' :
                      s.step === 4 ? '/pengajuan-spj?tab=Di%20PPSPM' :
                      '/pengajuan-spj?tab=Selesai'
                    }
                    className="px-4 py-2 rounded-xl bg-purple-50 hover:bg-purple-100 text-purple-900 font-bold text-xs border border-purple-200 transition inline-flex items-center gap-1.5"
                  >
                    <span>Lihat Berkas di Meja Ini</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </Link>
                </div>
              </div>

              {/* Main Content Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Left: Tugas & Tindakan Aplikasi */}
                <div className="space-y-4">
                  <div>
                    <h4 className="text-xs font-bold text-slate-900 uppercase tracking-wider flex items-center gap-1.5 mb-2">
                      <FileText className="w-4 h-4 text-purple-700" />
                      <span>Fungsi & Tugas Utama</span>
                    </h4>
                    <p className="text-xs text-slate-600 leading-relaxed bg-purple-50/40 p-3.5 rounded-xl border border-purple-100">
                      {s.summary}
                    </p>
                  </div>

                  <div>
                    <h4 className="text-xs font-bold text-slate-900 uppercase tracking-wider flex items-center gap-1.5 mb-2">
                      <Unlock className="w-4 h-4 text-emerald-600" />
                      <span>Tombol Aksi di Sistem (Hanya Muncul untuk Pemegang Meja)</span>
                    </h4>
                    <div className="space-y-2">
                      {s.tindakanAplikasi.map((t, idx) => (
                        <div key={idx} className="p-3 rounded-xl bg-white border border-slate-200 shadow-xs">
                          <p className="text-xs font-bold text-purple-950 flex items-center gap-1.5">
                            <span className="w-2 h-2 rounded-full bg-purple-600"></span>
                            {t.aksi}
                          </p>
                          <p className="text-[11px] text-slate-500 mt-1 pl-3.5 leading-relaxed">
                            {t.efek}
                          </p>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Right: Checklist Dokumen & Peraturan */}
                <div className="space-y-4">
                  <div>
                    <h4 className="text-xs font-bold text-slate-900 uppercase tracking-wider flex items-center gap-1.5 mb-2">
                      <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                      <span>Kelengkapan Berkas yang Diperiksa</span>
                    </h4>
                    <ul className="space-y-2">
                      {s.checklistDokumen.map((c, idx) => (
                        <li key={idx} className="flex items-start gap-2 text-xs text-slate-700">
                          <CheckCircle2 className="w-4 h-4 text-emerald-500 flex-shrink-0 mt-0.5" />
                          <span>{c}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  <div className="p-4 rounded-2xl bg-amber-50/70 border border-amber-200">
                    <div className="flex items-start gap-2.5">
                      <AlertCircle className="w-4 h-4 text-amber-600 flex-shrink-0 mt-0.5" />
                      <div>
                        <h5 className="text-xs font-bold text-amber-950">Aturan Penting Meja Berkas:</h5>
                        <p className="text-[11px] text-amber-800 mt-1 leading-relaxed">
                          {s.aturanPenting}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Navigation next/prev step */}
              <div className="pt-4 border-t border-purple-100 flex items-center justify-between">
                <button
                  type="button"
                  disabled={activeStep === 1}
                  onClick={() => setActiveStep(prev => Math.max(1, prev - 1))}
                  className="px-3.5 py-1.5 rounded-lg border border-slate-200 text-xs font-semibold text-slate-600 hover:bg-slate-50 disabled:opacity-40 transition"
                >
                  &larr; Tahap Sebelumnya
                </button>
                <span className="text-xs text-slate-400 font-medium">
                  Tahap {activeStep} dari 5
                </span>
                <button
                  type="button"
                  disabled={activeStep === 5}
                  onClick={() => setActiveStep(prev => Math.min(5, prev + 1))}
                  className="px-3.5 py-1.5 rounded-lg bg-purple-900 text-white text-xs font-semibold hover:bg-purple-800 disabled:opacity-40 transition"
                >
                  Tahap Berikutnya &rarr;
                </button>
              </div>
            </div>
          );
        })()}
      </div>

      {/* Matriks Hak Akses & Pengamanan Meja Berkas */}
      <div className="p-6 md:p-8 rounded-3xl bg-white border border-purple-100 shadow-xs space-y-4">
        <div>
          <h2 className="text-base font-extrabold text-slate-900 flex items-center gap-2">
            <ShieldCheck className="w-5 h-5 text-purple-700" />
            <span>Prinsip Pengamanan Meja Berkas (Desk-Based Security)</span>
          </h2>
          <p className="text-xs text-slate-500 mt-0.5">
            Menjamin akuntabilitas dan mencegah bypass persetujuan di luar wewenang pejabat yang sah
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-2">
          <div className="p-4 rounded-2xl bg-purple-50/60 border border-purple-100">
            <div className="w-8 h-8 rounded-lg bg-purple-100 text-purple-800 flex items-center justify-center font-bold mb-2">
              <Lock className="w-4 h-4" />
            </div>
            <h3 className="font-bold text-xs text-purple-950">1. Proteksi Tombol Aksi</h3>
            <p className="text-[11px] text-slate-600 mt-1 leading-relaxed">
              Jika berkas tidak berada di meja Anda, semua tombol aksi (Setujui, Minta Perbaikan, Terbitkan SPM) otomatis dinonaktifkan. Anda hanya dapat melihat rincian dokumen (read-only).
            </p>
          </div>

          <div className="p-4 rounded-2xl bg-indigo-50/60 border border-indigo-100">
            <div className="w-8 h-8 rounded-lg bg-indigo-100 text-indigo-800 flex items-center justify-center font-bold mb-2">
              <User className="w-4 h-4" />
            </div>
            <h3 className="font-bold text-xs text-indigo-950">2. Fleksibilitas Pembuatan Draft</h3>
            <p className="text-[11px] text-slate-600 mt-1 leading-relaxed">
              Staf dapat membantu menginputkan SPJ orang lain. Namun, begitu diajukan, berkas sepenuhnya berpindah ke ranah tanggung jawab PPK & Bendahara tanpa intervensi sepihak.
            </p>
          </div>

          <div className="p-4 rounded-2xl bg-amber-50/60 border border-amber-100">
            <div className="w-8 h-8 rounded-lg bg-amber-100 text-amber-800 flex items-center justify-center font-bold mb-2">
              <Sparkles className="w-4 h-4" />
            </div>
            <h3 className="font-bold text-xs text-amber-950">3. Jejak Audit & Superadmin</h3>
            <p className="text-[11px] text-slate-600 mt-1 leading-relaxed">
              Setiap pergeseran meja terekam tanggal dan riwayat catatannya. Superadmin memiliki peran supervisi untuk menjaga kelancaran operasional jika ada kendala kedaruratan.
            </p>
          </div>
        </div>

        {/* Tabel Matriks */}
        <div className="overflow-x-auto mt-4">
          <table className="w-full text-left text-xs border-collapse">
            <thead className="bg-purple-100/70 text-purple-950 font-bold uppercase text-[10px]">
              <tr>
                <th className="p-3 rounded-l-xl">Status Berkas</th>
                <th className="p-3">Posisi Meja</th>
                <th className="p-3">Pejabat Berwenang</th>
                <th className="p-3">Tindakan Selanjutnya</th>
                <th className="p-3 rounded-r-xl">User Lain</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-purple-50 text-slate-700">
              <tr className="hover:bg-purple-50/30">
                <td className="p-3 font-semibold text-amber-900">Draft / Perlu Perbaikan</td>
                <td className="p-3 font-medium">Meja PJ Kegiatan</td>
                <td className="p-3 font-bold text-purple-950">PJ Kegiatan / Pembuat Dokumen</td>
                <td className="p-3 text-slate-600">Ajukan ke PPK</td>
                <td className="p-3"><span className="text-[10px] px-2 py-0.5 rounded bg-slate-100 text-slate-500 font-semibold">Terkunci (Read-Only)</span></td>
              </tr>
              <tr className="hover:bg-purple-50/30">
                <td className="p-3 font-semibold text-purple-900">Di PPK</td>
                <td className="p-3 font-medium">Meja PPK</td>
                <td className="p-3 font-bold text-purple-950">Pejabat Pembuat Komitmen (PPK)</td>
                <td className="p-3 text-slate-600">Teruskan ke Bendahara / Kembalikan ke PJ</td>
                <td className="p-3"><span className="text-[10px] px-2 py-0.5 rounded bg-slate-100 text-slate-500 font-semibold">Terkunci (Read-Only)</span></td>
              </tr>
              <tr className="hover:bg-purple-50/30">
                <td className="p-3 font-semibold text-blue-900">Di Bendahara</td>
                <td className="p-3 font-medium">Meja Bendahara</td>
                <td className="p-3 font-bold text-purple-950">Bendahara Pengeluaran</td>
                <td className="p-3 text-slate-600">Teruskan ke PPSPM / Kembalikan ke PJ</td>
                <td className="p-3"><span className="text-[10px] px-2 py-0.5 rounded bg-slate-100 text-slate-500 font-semibold">Terkunci (Read-Only)</span></td>
              </tr>
              <tr className="hover:bg-purple-50/30">
                <td className="p-3 font-semibold text-indigo-900">Di PPSPM</td>
                <td className="p-3 font-medium">Meja PPSPM</td>
                <td className="p-3 font-bold text-purple-950">PPSPM</td>
                <td className="p-3 text-slate-600">Terbitkan SPM (Selesai) / Tolak ke Bendahara</td>
                <td className="p-3"><span className="text-[10px] px-2 py-0.5 rounded bg-slate-100 text-slate-500 font-semibold">Terkunci (Read-Only)</span></td>
              </tr>
              <tr className="hover:bg-purple-50/30">
                <td className="p-3 font-semibold text-emerald-900">Selesai</td>
                <td className="p-3 font-medium">Meja Arsip Keuangan</td>
                <td className="p-3 font-bold text-emerald-950">Arsip Permanen</td>
                <td className="p-3 text-slate-600">Lunas / SP2D Selesai (Cetak Bukti)</td>
                <td className="p-3"><span className="text-[10px] px-2 py-0.5 rounded bg-emerald-100 text-emerald-800 font-semibold">Pantau & Cetak</span></td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      {/* Pertanyaan Sering Diajukan (FAQ) */}
      <div className="p-6 md:p-8 rounded-3xl bg-white border border-purple-100 shadow-xs space-y-4">
        <div>
          <h2 className="text-base font-extrabold text-slate-900 flex items-center gap-2">
            <HelpCircle className="w-5 h-5 text-purple-700" />
            <span>Pertanyaan yang Sering Diajukan (FAQ)</span>
          </h2>
          <p className="text-xs text-slate-500 mt-0.5">
            Jawaban seputar teknis pengajuan, alur wewenang, dan perbaikan berkas
          </p>
        </div>

        <div className="space-y-3 pt-2">
          {faqs.map((faq, idx) => {
            const isOpen = openFaq === idx;
            return (
              <div 
                key={idx} 
                className="rounded-2xl border border-purple-100 overflow-hidden transition"
              >
                <button
                  type="button"
                  onClick={() => setOpenFaq(isOpen ? null : idx)}
                  className="w-full p-4 text-left flex items-center justify-between bg-purple-50/30 hover:bg-purple-50 transition"
                >
                  <span className="font-bold text-xs text-slate-900">{faq.q}</span>
                  {isOpen ? (
                    <ChevronDown className="w-4 h-4 text-purple-700 transform rotate-180 transition" />
                  ) : (
                    <ChevronDown className="w-4 h-4 text-slate-400 transition" />
                  )}
                </button>
                {isOpen && (
                  <div className="p-4 text-xs text-slate-600 bg-white border-t border-purple-100 leading-relaxed animate-in fade-in duration-100">
                    {faq.a}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* Quick Links Banner */}
      <div className="p-6 rounded-3xl bg-gradient-to-r from-purple-100 via-purple-50 to-indigo-100 border border-purple-200 flex flex-col md:flex-row items-center justify-between gap-4">
        <div>
          <h3 className="font-extrabold text-sm text-purple-950">Butuh Bantuan Lain Terkait Dokumen & Pajak?</h3>
          <p className="text-xs text-purple-800 mt-0.5">
            Kunjungi panduan kelengkapan mata anggaran belanja atau hitung potongan pajak secara otomatis.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          <Link
            to="/panduan-akun"
            className="px-4 py-2 rounded-xl bg-white hover:bg-purple-50 text-purple-950 font-bold text-xs border border-purple-200 shadow-xs transition inline-flex items-center gap-1.5"
          >
            <BookOpen className="w-3.5 h-3.5 text-purple-700" />
            <span>Panduan Kelengkapan Akun</span>
          </Link>
          <Link
            to="/kalkulator-pajak"
            className="px-4 py-2 rounded-xl bg-purple-900 hover:bg-purple-800 text-white font-bold text-xs shadow-xs transition inline-flex items-center gap-1.5"
          >
            <Calculator className="w-3.5 h-3.5 text-amber-300" />
            <span>Kalkulator Pajak</span>
          </Link>
        </div>
      </div>
    </div>
  );
}
