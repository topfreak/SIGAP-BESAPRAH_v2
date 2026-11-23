import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { 
  FilePlus2, 
  ArrowLeft, 
  ArrowRight, 
  CheckCircle2, 
  UploadCloud, 
  Calculator, 
  FileText, 
  AlertTriangle, 
  Building2, 
  HelpCircle,
  UserCheck,
  ShieldCheck,
  Save
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { KODE_AKUN_LIST, TIM_KERJA_LIST } from '../lib/seedData';
import { calculateTaxes } from '../lib/taxEngine';

export default function FormSPJPage() {
  const navigate = useNavigate();
  const { currentUser, addTransaction, pegawaiList } = useAuth();

  const [step, setStep] = useState(1);

  // Form state
  const [formData, setFormData] = useState({
    uraian_kegiatan: '',
    tim_kerja: currentUser?.tim_kerja || 'Produksi',
    pj_kegiatan_nip: currentUser?.role === 'pj_kegiatan' ? currentUser?.nip_baru : (pegawaiList.find(p => p.role === 'pj_kegiatan')?.nip_baru || pegawaiList[0]?.nip_baru),
    mekanisme_ls_gup: 'LS',
    kode_akun: '521213',
    sub_jenis: 'Honor Petugas Lapangan',
    nominal_bruto: 1500000,
    rekanan_type: 'toko',
    penerima_pns_gol: '',
    is_mitra_non_pns: true,
    has_npwp: true,
    is_pkp: true,
    tarif_ppn: '11',
    catatan: ''
  });

  // Uploaded docs mockup
  const [uploadedDocs, setUploadedDocs] = useState({});

  // Current selected account
  const currentAccount = KODE_AKUN_LIST.find(a => a.kode === formData.kode_akun) || KODE_AKUN_LIST[0];

  // Tax calculation result
  const taxResult = calculateTaxes({
    kodeAkun: formData.kode_akun,
    kategori: currentAccount.kategori,
    nominal: formData.nominal_bruto,
    isPKP: formData.is_pkp,
    rekananType: formData.rekanan_type,
    penerimaPnsGol: formData.penerima_pns_gol || null,
    isMitraNonPns: formData.is_mitra_non_pns,
    hasNPWP: formData.has_npwp,
    tarifPpnKhusus: formData.tarif_ppn
  });

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const handleFileSimulate = (docName) => {
    setUploadedDocs(prev => ({
      ...prev,
      [docName]: {
        fileName: `${docName.replace(/\s+/g, '_')}_${Date.now()}.pdf`,
        uploadedAt: new Date().toLocaleTimeString()
      }
    }));
  };

  const handleSubmit = (targetStatus = 'Di PPK') => {
    const pj = pegawaiList.find(p => p.nip_baru === formData.pj_kegiatan_nip) || currentUser;

    const isDirectDraft = targetStatus === 'Draft';

    const newTx = {
      no_pengajuan: `SPJ-${Date.now().toString().slice(-5)}`,
      no_spm_spp: `00${Math.floor(100 + Math.random() * 900)}A`,
      kategori_belanja: currentAccount.kategori,
      kode_akun: formData.kode_akun,
      uraian_kegiatan: formData.uraian_kegiatan.trim() || "Pengajuan SPJ Baru",
      tim_kerja: formData.tim_kerja,
      
      // Delegated Drafting Identity
      pj_kegiatan_nip: formData.pj_kegiatan_nip,
      pj_nama: pj?.nama || currentUser?.nama,
      pengaju_nip: currentUser?.nip_baru,
      pengaju_nama: currentUser?.nama,

      mekanisme_ls_gup: formData.mekanisme_ls_gup,
      jumlah_pengeluaran: taxResult.bruto,
      jumlah_potongan: taxResult.totalPotongan,
      jumlah_pembayaran: taxResult.netto,
      
      // Status & Meja
      status_dokumen: isDirectDraft ? 'Draft' : 'Di PPK',
      posisi_dokumen: isDirectDraft ? 'Draf Baru' : 'Di PPK',
      meja_berkas: isDirectDraft 
        ? 'Meja PJ Kegiatan (Draf Pengajuan)' 
        : 'Meja PPK (Peninjauan Komitmen)',
      
      kelengkapan_dokumen: Object.keys(uploadedDocs).length >= 3 ? 'LENGKAP' : 'BELUM LENGKAP',
      tanggal_terima: new Date().toISOString().split('T')[0],
      tanggal_proses: isDirectDraft ? '' : new Date().toISOString().split('T')[0],
      tanggal_sp2d: '',
      catatan_kekurangan: formData.catatan || (Object.keys(uploadedDocs).length < 3 ? 'Lampiran KAK dan Nota belum di-scan lengkap' : ''),
      review_ppk: isDirectDraft ? 'Draf tersimpan' : 'Menunggu peninjauan komitmen PPK',
      review_ppspm: 'Menunggu',
      review_bdh: 'Menunggu'
    };

    addTransaction(newTx);
    navigate(isDirectDraft ? '/pengajuan-spj' : '/pengajuan-spj?tab=Di%20PPK');
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6 font-sans">
      {/* Top Breadcrumb */}
      <div className="flex items-center justify-between">
        <Link
          to="/pengajuan-spj"
          className="inline-flex items-center gap-1.5 text-xs text-purple-700 hover:text-purple-900 font-bold"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Kembali ke Daftar Monitoring SPJ</span>
        </Link>
        <span className="text-xs text-slate-400">Form Wizard Pengajuan Baru</span>
      </div>

      {/* Title */}
      <div className="p-6 rounded-3xl bg-gradient-to-r from-[#250b52] to-[#4c1d95] text-white shadow-xl">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-amber-400 text-purple-950 flex items-center justify-center font-bold">
            <FilePlus2 className="w-6 h-6" />
          </div>
          <div>
            <h1 className="text-xl font-extrabold">Buat Pengajuan SPJ Baru</h1>
            <p className="text-xs text-purple-200 mt-0.5">
              Lengkapi informasi kegiatan, pilih akun belanja, periksa kalkulasi pajak, dan unggah berkas pendukung.
            </p>
          </div>
        </div>

        {/* Stepper Wizard Bar */}
        <div className="mt-6 pt-5 border-t border-purple-800/40 grid grid-cols-4 gap-2 text-center text-xs font-semibold">
          {[
            { s: 1, label: 'Info Dasar' },
            { s: 2, label: 'Kode Akun' },
            { s: 3, label: 'Pajak & Nominal' },
            { s: 4, label: 'Checklist Berkas' },
          ].map((item) => (
            <div 
              key={item.s}
              onClick={() => setStep(item.s)}
              className={`cursor-pointer pb-1.5 border-b-2 transition ${
                step === item.s 
                  ? 'border-amber-300 text-amber-300 font-bold' 
                  : step > item.s 
                  ? 'border-emerald-400 text-emerald-300' 
                  : 'border-purple-800 text-purple-400'
              }`}
            >
              Step {item.s}: {item.label}
            </div>
          ))}
        </div>
      </div>

      {/* Wizard Step 1: Info Dasar Kegiatan */}
      {step === 1 && (
        <div className="p-6 rounded-3xl bg-white border border-purple-100 shadow-sm space-y-5 animate-in fade-in">
          <div className="flex items-center justify-between border-b border-purple-50 pb-3">
            <h2 className="text-base font-extrabold text-slate-900">
              Langkah 1: Identitas & Informasi Kegiatan
            </h2>
            <span className="text-[11px] text-purple-700 font-semibold bg-purple-50 px-2.5 py-1 rounded-lg border border-purple-150">
              Delegated Drafting Aktif
            </span>
          </div>

          {/* Operator Notice Card */}
          <div className="p-3.5 bg-purple-50/70 border border-purple-200 rounded-2xl flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
            <div className="flex items-center gap-2.5">
              <div className="w-9 h-9 rounded-xl bg-purple-700 text-white font-bold flex items-center justify-center flex-shrink-0">
                {currentUser?.nama?.charAt(0) || 'U'}
              </div>
              <div>
                <p className="font-extrabold text-slate-900">
                  Operator Penginput: {currentUser?.nama} <span className="text-purple-700 font-semibold">(Akun Anda)</span>
                </p>
                <p className="text-[10px] text-slate-500 font-mono">
                  NIP: {currentUser?.nip_baru} • Tim: {currentUser?.tim_kerja}
                </p>
              </div>
            </div>
            <div className="text-[11px] text-purple-800 bg-white px-3 py-1 rounded-xl border border-purple-200 shadow-2xs">
              Anda dapat menginput SPJ untuk diri sendiri atau mewakili <strong>PJ Kegiatan</strong> lain.
            </div>
          </div>

          <div className="space-y-4">
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1.5">
                Uraian / Nama Kegiatan SPJ <span className="text-rose-500">*</span>
              </label>
              <input
                type="text"
                name="uraian_kegiatan"
                value={formData.uraian_kegiatan}
                onChange={handleInputChange}
                placeholder="Contoh: Honor Petugas Pendataan Lapangan Sakernas Februari 2026"
                required
                className="w-full px-4 py-2.5 bg-purple-50/40 border border-purple-200 rounded-xl text-xs font-medium text-slate-800 focus:outline-none focus:ring-2 focus:ring-purple-500"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1.5">
                  Tim Kerja / Fungsi BPS
                </label>
                <select
                  name="tim_kerja"
                  value={formData.tim_kerja}
                  onChange={handleInputChange}
                  className="w-full px-3.5 py-2.5 bg-purple-50/40 border border-purple-200 rounded-xl text-xs font-medium text-slate-800 focus:outline-none focus:ring-2 focus:ring-purple-500"
                >
                  {TIM_KERJA_LIST.map(t => (
                    <option key={t.id} value={t.id}>{t.nama}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1.5 flex items-center justify-between">
                  <span>Penanggung Jawab Kegiatan (PJ)</span>
                  <span className="text-[10px] text-purple-600 font-normal">Pejabat yang Bertanggung Jawab</span>
                </label>
                <select
                  name="pj_kegiatan_nip"
                  value={formData.pj_kegiatan_nip}
                  onChange={handleInputChange}
                  className="w-full px-3.5 py-2.5 bg-purple-50/40 border border-purple-200 rounded-xl text-xs font-medium text-slate-800 focus:outline-none focus:ring-2 focus:ring-purple-500"
                >
                  {pegawaiList.map(p => (
                    <option key={p.nip_baru} value={p.nip_baru}>
                      {p.nama} — {p.jabatan_keuangan && p.jabatan_keuangan !== '-' ? p.jabatan_keuangan : p.jabatan} {p.tim_kerja && p.tim_kerja !== '-' ? `(Tim ${p.tim_kerja})` : ''}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1.5">
                  Mekanisme Pembayaran
                </label>
                <select
                  name="mekanisme_ls_gup"
                  value={formData.mekanisme_ls_gup}
                  onChange={handleInputChange}
                  className="w-full px-3.5 py-2.5 bg-purple-50/40 border border-purple-200 rounded-xl text-xs font-medium text-slate-800 focus:outline-none focus:ring-2 focus:ring-purple-500"
                >
                  <option value="LS">LS (Langsung ke Rekening Mitra / Penerima)</option>
                  <option value="GUP">GUP / UP (Uang Persediaan Kantor / Kas Bendahara)</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1.5">
                  Catatan Tambahan / Keterangan
                </label>
                <input
                  type="text"
                  name="catatan"
                  value={formData.catatan}
                  onChange={handleInputChange}
                  placeholder="Opsional: Keterangan berkas atau no. surat tugas"
                  className="w-full px-4 py-2.5 bg-purple-50/40 border border-purple-200 rounded-xl text-xs font-medium text-slate-800 focus:outline-none focus:ring-2 focus:ring-purple-500"
                />
              </div>
            </div>
          </div>

          <div className="flex justify-end pt-4 border-t border-purple-50">
            <button
              type="button"
              onClick={() => setStep(2)}
              className="px-6 py-2.5 rounded-xl bg-purple-700 hover:bg-purple-800 text-white font-bold text-xs flex items-center gap-2 shadow-md transition"
            >
              <span>Lanjut: Pilih Kode Akun Belanja</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}

      {/* Wizard Step 2: Pilih Kode Akun */}
      {step === 2 && (
        <div className="p-6 rounded-3xl bg-white border border-purple-100 shadow-sm space-y-5 animate-in fade-in">
          <div>
            <h2 className="text-base font-extrabold text-slate-900">
              Langkah 2: Pilih Kode Akun Belanja (14 MAK Standar BPS)
            </h2>
            <p className="text-xs text-slate-500 mt-0.5">
              Pilih kode akun yang sesuai. Sistem otomatis menentukan syarat kelengkapan dan aturan pajak.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 max-h-96 overflow-y-auto pr-1">
            {KODE_AKUN_LIST.map((akun) => {
              const isSelected = formData.kode_akun === akun.kode;
              return (
                <div
                  key={akun.kode}
                  onClick={() => setFormData(p => ({ ...p, kode_akun: akun.kode }))}
                  className={`p-4 rounded-2xl border cursor-pointer transition flex flex-col justify-between ${
                    isSelected 
                      ? 'border-purple-600 bg-purple-50/80 shadow-xs ring-2 ring-purple-600/20' 
                      : 'border-purple-100 hover:border-purple-300 hover:bg-purple-50/30'
                  }`}
                >
                  <div>
                    <div className="flex items-center justify-between mb-1.5">
                      <span className="font-mono font-extrabold text-purple-900 text-sm">
                        {akun.kode}
                      </span>
                      <span className="text-[10px] uppercase font-bold px-2 py-0.5 rounded-full bg-purple-100 text-purple-800">
                        {akun.kategori}
                      </span>
                    </div>
                    <p className="font-bold text-xs text-slate-800">{akun.nama}</p>
                    <p className="text-[11px] text-slate-500 mt-1 line-clamp-2">{akun.deskripsi}</p>
                  </div>
                  <div className="mt-3 pt-2 border-t border-purple-100/60 flex items-center justify-between text-[10px] text-purple-700">
                    <span>{akun.syarat.length} Dokumen Wajib</span>
                    {isSelected && <span className="font-bold text-emerald-600">✓ Terpilih</span>}
                  </div>
                </div>
              );
            })}
          </div>

          <div className="flex justify-between pt-4 border-t border-purple-50">
            <button
              type="button"
              onClick={() => setStep(1)}
              className="px-5 py-2.5 rounded-xl border border-purple-200 hover:bg-purple-50 text-purple-900 font-bold text-xs"
            >
              ← Kembali
            </button>
            <button
              type="button"
              onClick={() => setStep(3)}
              className="px-6 py-2.5 rounded-xl bg-purple-700 hover:bg-purple-800 text-white font-bold text-xs flex items-center gap-2 shadow-md transition"
            >
              <span>Lanjut: Pajak & Rincian Biaya</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}

      {/* Wizard Step 3: Pajak & Nominal */}
      {step === 3 && (
        <div className="p-6 rounded-3xl bg-white border border-purple-100 shadow-sm space-y-6 animate-in fade-in">
          <div>
            <h2 className="text-base font-extrabold text-slate-900">
              Langkah 3: Nilai Pengeluaran & Simulasi Pajak Otomatis
            </h2>
            <p className="text-xs text-slate-500 mt-0.5">
              Akun Terpilih: <strong className="text-purple-900 font-mono">{currentAccount.kode}</strong> - {currentAccount.nama}
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Input Nominal & Parameter Rekanan */}
            <div className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1.5">
                  Jumlah Pengeluaran Bruto (Rp) <span className="text-rose-500">*</span>
                </label>
                <div className="relative">
                  <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-xs font-bold text-purple-400">Rp</span>
                  <input
                    type="number"
                    name="nominal_bruto"
                    value={formData.nominal_bruto}
                    onChange={handleInputChange}
                    min={0}
                    step={1000}
                    className="w-full pl-10 pr-4 py-2.5 bg-purple-50/40 border border-purple-200 rounded-xl text-xs font-bold text-slate-800 focus:outline-none focus:ring-2 focus:ring-purple-500 font-mono"
                  />
                </div>
              </div>

              {/* Rekanan / Penerima Options */}
              {currentAccount.kategori === 'Honor' ? (
                <div className="p-4 rounded-2xl bg-purple-50/50 border border-purple-150 space-y-3 text-xs">
                  <p className="font-bold text-purple-900">Karakteristik Penerima Honor:</p>
                  
                  <div>
                    <label className="block text-[11px] font-semibold text-slate-700 mb-1">
                      Penerima PNS Golongan (Jika Ada):
                    </label>
                    <select
                      name="penerima_pns_gol"
                      value={formData.penerima_pns_gol}
                      onChange={handleInputChange}
                      className="w-full px-3 py-2 bg-white border border-purple-200 rounded-xl text-xs"
                    >
                      <option value="">Non-PNS / Mitra Lapangan</option>
                      <option value="IV">PNS Golongan IV (PPh 21 Final 15%)</option>
                      <option value="III">PNS Golongan III (PPh 21 Final 5%)</option>
                      <option value="II">PNS Golongan II / I (PPh 21 Final 0%)</option>
                    </select>
                  </div>

                  <div className="flex items-center gap-2">
                    <input
                      type="checkbox"
                      id="has_npwp"
                      name="has_npwp"
                      checked={formData.has_npwp}
                      onChange={handleInputChange}
                      className="rounded text-purple-600 focus:ring-purple-400"
                    />
                    <label htmlFor="has_npwp" className="text-xs text-slate-700 cursor-pointer">
                      Penerima memiliki NPWP / NIK Terverifikasi
                    </label>
                  </div>
                </div>
              ) : (
                <div className="p-4 rounded-2xl bg-purple-50/50 border border-purple-150 space-y-3 text-xs">
                  <p className="font-bold text-purple-900">Profil Rekanan & Pajak:</p>
                  
                  <div>
                    <label className="block text-[11px] font-semibold text-slate-700 mb-1">
                      Tipe Rekanan / Transaksi:
                    </label>
                    <select
                      name="rekanan_type"
                      value={formData.rekanan_type}
                      onChange={handleInputChange}
                      className="w-full px-3 py-2 bg-white border border-purple-200 rounded-xl text-xs"
                    >
                      <option value="toko">Toko / Penjual Barang (PPh 22)</option>
                      <option value="catering">Katering Makanan / Konsumsi (Pajak Daerah PB1 / PPh 23)</option>
                      <option value="jasa">Penyedia Jasa Lainnya / Servis (PPh 23)</option>
                      <option value="sewa">Sewa Kendaraan / Gedung (PPh 23 / PPh 4(2))</option>
                    </select>
                  </div>

                  <div className="flex items-center gap-4">
                    <label className="flex items-center gap-2 cursor-pointer">
                      <input
                        type="checkbox"
                        name="is_pkp"
                        checked={formData.is_pkp}
                        onChange={handleInputChange}
                        className="rounded text-purple-600 focus:ring-purple-400"
                      />
                      <span>Pengusaha Kena Pajak (PKP)</span>
                    </label>

                    <label className="flex items-center gap-2 cursor-pointer">
                      <input
                        type="checkbox"
                        name="has_npwp"
                        checked={formData.has_npwp}
                        onChange={handleInputChange}
                        className="rounded text-purple-600 focus:ring-purple-400"
                      />
                      <span>Memiliki NPWP</span>
                    </label>
                  </div>
                </div>
              )}
            </div>

            {/* Live Tax Engine Result */}
            <div className="p-5 rounded-3xl bg-gradient-to-br from-purple-900 to-indigo-950 text-white shadow-lg space-y-3">
              <h3 className="text-xs font-bold uppercase tracking-wider text-purple-200 border-b border-purple-800/60 pb-2">
                Hasil Hitungan Tax Engine
              </h3>

              <div className="space-y-2 text-xs">
                <div className="flex justify-between py-1">
                  <span className="text-purple-200">Jumlah Bruto:</span>
                  <span className="font-mono font-bold">
                    Rp {taxResult.bruto.toLocaleString('id-ID')}
                  </span>
                </div>

                {taxResult.ppn > 0 && (
                  <div className="flex justify-between py-1 text-purple-200">
                    <span>PPN (11%):</span>
                    <span className="font-mono">Rp {taxResult.ppn.toLocaleString('id-ID')}</span>
                  </div>
                )}

                {taxResult.pph21 > 0 && (
                  <div className="flex justify-between py-1 text-amber-300">
                    <span>PPh 21:</span>
                    <span className="font-mono">- Rp {taxResult.pph21.toLocaleString('id-ID')}</span>
                  </div>
                )}

                {taxResult.pph22 > 0 && (
                  <div className="flex justify-between py-1 text-amber-300">
                    <span>PPh 22:</span>
                    <span className="font-mono">- Rp {taxResult.pph22.toLocaleString('id-ID')}</span>
                  </div>
                )}

                {taxResult.pph23 > 0 && (
                  <div className="flex justify-between py-1 text-amber-300">
                    <span>PPh 23:</span>
                    <span className="font-mono">- Rp {taxResult.pph23.toLocaleString('id-ID')}</span>
                  </div>
                )}

                <div className="flex justify-between py-1.5 border-t border-purple-800 text-rose-300">
                  <span>Total Potongan Pajak:</span>
                  <span className="font-mono font-bold">- Rp {taxResult.totalPotongan.toLocaleString('id-ID')}</span>
                </div>

                <div className="flex justify-between py-2 border-t border-purple-700 font-extrabold text-sm text-emerald-300">
                  <span>Jumlah Pembayaran Netto:</span>
                  <span className="font-mono text-base">Rp {taxResult.netto.toLocaleString('id-ID')}</span>
                </div>
              </div>
            </div>
          </div>

          <div className="flex justify-between pt-4 border-t border-purple-50">
            <button
              type="button"
              onClick={() => setStep(2)}
              className="px-5 py-2.5 rounded-xl border border-purple-200 hover:bg-purple-50 text-purple-900 font-bold text-xs"
            >
              ← Kembali
            </button>
            <button
              type="button"
              onClick={() => setStep(4)}
              className="px-6 py-2.5 rounded-xl bg-purple-700 hover:bg-purple-800 text-white font-bold text-xs flex items-center gap-2 shadow-md transition"
            >
              <span>Lanjut: Checklist Berkas Dokumen</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}

      {/* Wizard Step 4: Checklist Dokumen & Submit */}
      {step === 4 && (
        <div className="p-6 rounded-3xl bg-white border border-purple-100 shadow-sm space-y-5 animate-in fade-in">
          <div>
            <h2 className="text-base font-extrabold text-slate-900">
              Langkah 4: Checklist Kelengkapan Dokumen ({currentAccount.kode} - {currentAccount.nama})
            </h2>
            <p className="text-xs text-slate-500 mt-0.5">
              Simulasi unggah dokumen digital sesuai standar file Kelengkapan SPJ BPS.
            </p>
          </div>

          <div className="space-y-3">
            {currentAccount.syarat.map((doc, idx) => {
              const isUploaded = Boolean(uploadedDocs[doc]);
              return (
                <div
                  key={idx}
                  className={`p-3.5 rounded-2xl border flex items-center justify-between gap-3 transition ${
                    isUploaded 
                      ? 'bg-emerald-50/70 border-emerald-300' 
                      : 'bg-purple-50/20 border-purple-100 hover:border-purple-300'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <div className={`w-8 h-8 rounded-lg flex items-center justify-center font-bold text-xs ${
                      isUploaded ? 'bg-emerald-600 text-white' : 'bg-purple-200 text-purple-800'
                    }`}>
                      {isUploaded ? <CheckCircle2 className="w-5 h-5" /> : idx + 1}
                    </div>
                    <div>
                      <p className="font-bold text-xs text-slate-800">{doc}</p>
                      {isUploaded ? (
                        <p className="text-[10px] text-emerald-700 font-medium">
                          Telah diunggah: {uploadedDocs[doc].fileName} ({uploadedDocs[doc].uploadedAt})
                        </p>
                      ) : (
                        <p className="text-[10px] text-slate-400">Format didukung: PDF, JPG, PNG (Maks 10MB)</p>
                      )}
                    </div>
                  </div>

                  <button
                    type="button"
                    onClick={() => handleFileSimulate(doc)}
                    className={`px-3 py-1.5 rounded-xl text-xs font-semibold flex items-center gap-1.5 transition ${
                      isUploaded 
                        ? 'bg-emerald-200 hover:bg-emerald-300 text-emerald-900' 
                        : 'bg-purple-100 hover:bg-purple-200 text-purple-900'
                    }`}
                  >
                    <UploadCloud className="w-3.5 h-3.5" />
                    <span>{isUploaded ? 'Ganti File' : 'Unggah File'}</span>
                  </button>
                </div>
              );
            })}
          </div>

          {/* Action Options: Simpan Draf atau Ajukan ke PPK */}
          <div className="flex flex-col sm:flex-row items-center justify-between gap-3 pt-6 border-t border-purple-50">
            <button
              type="button"
              onClick={() => setStep(3)}
              className="w-full sm:w-auto px-5 py-2.5 rounded-xl border border-purple-200 hover:bg-purple-50 text-purple-900 font-bold text-xs"
            >
              ← Kembali
            </button>

            <div className="flex items-center gap-3 w-full sm:w-auto">
              {/* Option 1: Save as Draft */}
              <button
                type="button"
                onClick={() => handleSubmit('Draft')}
                className="flex-1 sm:flex-none px-5 py-3 rounded-2xl bg-purple-100 hover:bg-purple-200 text-purple-900 font-bold text-xs flex items-center justify-center gap-2 transition"
              >
                <Save className="w-4 h-4" />
                <span>Simpan Draf (Meja PJ)</span>
              </button>

              {/* Option 2: Submit to PPK */}
              <button
                type="button"
                onClick={() => handleSubmit('Di PPK')}
                className="flex-1 sm:flex-none px-6 py-3 rounded-2xl bg-gradient-to-r from-purple-700 to-indigo-600 hover:from-purple-800 hover:to-indigo-700 text-white font-extrabold text-xs shadow-lg shadow-purple-600/25 flex items-center justify-center gap-2 transition active:scale-98"
              >
                <CheckCircle2 className="w-4 h-4 text-amber-300" />
                <span>Ajukan ke Meja PPK</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
