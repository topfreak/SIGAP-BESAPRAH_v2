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
  HelpCircle
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
    pj_kegiatan_nip: currentUser?.nip_baru || pegawaiList[0]?.nip_baru,
    mekanisme_ls_gup: 'LS',
    kode_akun: '521213',
    sub_jenis: 'Honor Petugas Lapangan',
    nominal_bruto: 1500000,
    rekanan_type: 'toko', // 'toko', 'catering', 'jasa', 'sewa'
    penerima_pns_gol: '', // '', 'IV', 'III', 'II', 'I'
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

  const handleSubmit = (e) => {
    e.preventDefault();
    const pj = pegawaiList.find(p => p.nip_baru === formData.pj_kegiatan_nip);

    const newTx = {
      no_pengajuan: `SPJ-${Date.now().toString().slice(-5)}`,
      no_spm_spp: `00${Math.floor(100 + Math.random() * 900)}A`,
      kategori_belanja: currentAccount.kategori,
      kode_akun: formData.kode_akun,
      uraian_kegiatan: formData.uraian_kegiatan || "Pengajuan SPJ Baru",
      tim_kerja: formData.tim_kerja,
      pj_kegiatan_nip: formData.pj_kegiatan_nip,
      pj_nama: pj?.nama || currentUser?.nama,
      pengaju_nip: currentUser?.nip_baru,
      pengaju_nama: currentUser?.nama,
      mekanisme_ls_gup: formData.mekanisme_ls_gup,
      jumlah_pengeluaran: taxResult.bruto,
      jumlah_potongan: taxResult.totalPotongan,
      jumlah_pembayaran: taxResult.netto,
      status_dokumen: 'Di PPK',
      posisi_dokumen: 'Di PPK',
      kelengkapan_dokumen: Object.keys(uploadedDocs).length >= 3 ? 'LENGKAP' : 'BELUM LENGKAP',
      tanggal_terima: new Date().toISOString().split('T')[0],
      tanggal_proses: '',
      tanggal_sp2d: '',
      catatan_kekurangan: formData.catatan || (Object.keys(uploadedDocs).length < 3 ? 'Dokumen KAK dan Nota belum di-scan lengkap' : ''),
      review_ppk: 'Menunggu review PPK',
      review_ppspm: 'Menunggu',
      review_bdh: 'Menunggu'
    };

    addTransaction(newTx);
    navigate('/pengajuan-spj?tab=Di%20PPK');
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6">
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
          <h2 className="text-base font-extrabold text-slate-900 border-b border-purple-50 pb-3">
            Langkah 1: Identitas & Informasi Kegiatan
          </h2>

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
                <label className="block text-xs font-bold text-slate-700 mb-1.5">
                  Penanggung Jawab Kegiatan (PJ Kuda)
                </label>
                <select
                  name="pj_kegiatan_nip"
                  value={formData.pj_kegiatan_nip}
                  onChange={handleInputChange}
                  className="w-full px-3.5 py-2.5 bg-purple-50/40 border border-purple-200 rounded-xl text-xs font-medium text-slate-800 focus:outline-none focus:ring-2 focus:ring-purple-500"
                >
                  {pegawaiList.map(p => (
                    <option key={p.nip_baru} value={p.nip_baru}>
                      {p.nama} ({p.jabatan})
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1.5">
                  Mekanisme Pencairan Dana
                </label>
                <div className="grid grid-cols-2 gap-3">
                  <label className={`p-3 rounded-xl border cursor-pointer text-xs font-semibold flex items-center justify-between ${
                    formData.mekanisme_ls_gup === 'LS'
                      ? 'bg-purple-100/60 border-purple-600 text-purple-900 ring-2 ring-purple-400/20'
                      : 'border-slate-200 hover:bg-slate-50 text-slate-600'
                  }`}>
                    <span>Pembayaran Langsung (LS)</span>
                    <input
                      type="radio"
                      name="mekanisme_ls_gup"
                      value="LS"
                      checked={formData.mekanisme_ls_gup === 'LS'}
                      onChange={handleInputChange}
                      className="text-purple-600"
                    />
                  </label>

                  <label className={`p-3 rounded-xl border cursor-pointer text-xs font-semibold flex items-center justify-between ${
                    formData.mekanisme_ls_gup === 'GUP'
                      ? 'bg-purple-100/60 border-purple-600 text-purple-900 ring-2 ring-purple-400/20'
                      : 'border-slate-200 hover:bg-slate-50 text-slate-600'
                  }`}>
                    <span>Ganti Uang Persediaan (GUP)</span>
                    <input
                      type="radio"
                      name="mekanisme_ls_gup"
                      value="GUP"
                      checked={formData.mekanisme_ls_gup === 'GUP'}
                      onChange={handleInputChange}
                      className="text-purple-600"
                    />
                  </label>
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1.5">
                  Catatan Awal / Rincian Singkat
                </label>
                <input
                  type="text"
                  name="catatan"
                  value={formData.catatan}
                  onChange={handleInputChange}
                  placeholder="Keterangan tambahan (opsional)..."
                  className="w-full px-4 py-2.5 bg-purple-50/40 border border-purple-200 rounded-xl text-xs font-medium text-slate-800 focus:outline-none"
                />
              </div>
            </div>
          </div>

          <div className="flex justify-end pt-4">
            <button
              type="button"
              onClick={() => setStep(2)}
              className="px-6 py-2.5 rounded-xl bg-purple-700 hover:bg-purple-800 text-white font-bold text-xs flex items-center gap-2 shadow-md transition"
            >
              <span>Lanjut: Pilih Kode Akun</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}

      {/* Wizard Step 2: Pilih Kode Akun */}
      {step === 2 && (
        <div className="p-6 rounded-3xl bg-white border border-purple-100 shadow-sm space-y-5 animate-in fade-in">
          <h2 className="text-base font-extrabold text-slate-900 border-b border-purple-50 pb-3">
            Langkah 2: Pilih Kode Akun Belanja (Mata Anggaran)
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-3 max-h-96 overflow-y-auto pr-1">
            {KODE_AKUN_LIST.map((akun) => (
              <div
                key={akun.kode}
                onClick={() => setFormData(prev => ({ ...prev, kode_akun: akun.kode }))}
                className={`p-4 rounded-2xl border cursor-pointer transition ${
                  formData.kode_akun === akun.kode
                    ? 'border-purple-600 bg-purple-50/80 ring-2 ring-purple-400/20 shadow-sm'
                    : 'border-purple-100 hover:border-purple-300 hover:bg-purple-50/30'
                }`}
              >
                <div className="flex items-center justify-between">
                  <span className="font-mono font-extrabold text-xs text-purple-900 bg-purple-200/60 px-2 py-0.5 rounded">
                    {akun.kode}
                  </span>
                  <span className="text-[10px] font-bold text-slate-400 uppercase">
                    {akun.kategori}
                  </span>
                </div>
                <h3 className="font-bold text-xs text-slate-800 mt-2">
                  {akun.nama}
                </h3>
                <p className="text-[11px] text-slate-500 mt-0.5">
                  Sub-jenis: {akun.subJenis?.join(', ')}
                </p>
                <div className="mt-2 text-[10px] text-purple-700 font-semibold">
                  {akun.syarat.length} Dokumen Syarat Wajib
                </div>
              </div>
            ))}
          </div>

          <div className="flex justify-between pt-4">
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
              <span>Lanjut: Hitung Pajak & Nominal</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}

      {/* Wizard Step 3: Tax Engine & Nominal */}
      {step === 3 && (
        <div className="p-6 rounded-3xl bg-white border border-purple-100 shadow-sm space-y-5 animate-in fade-in">
          <h2 className="text-base font-extrabold text-slate-900 border-b border-purple-50 pb-3 flex items-center gap-2">
            <Calculator className="w-5 h-5 text-purple-700" />
            <span>Langkah 3: Rincian Anggaran & Kalkulasi Pajak Otomatis</span>
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Input Controls */}
            <div className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1.5">
                  Jumlah Pengeluaran Bruto (Rp) <span className="text-rose-500">*</span>
                </label>
                <input
                  type="number"
                  name="nominal_bruto"
                  value={formData.nominal_bruto}
                  onChange={handleInputChange}
                  min="0"
                  step="1000"
                  className="w-full px-4 py-2.5 bg-purple-50/40 border border-purple-200 rounded-xl text-base font-bold text-purple-950 focus:outline-none focus:ring-2 focus:ring-purple-500"
                />
                <p className="text-[11px] text-slate-400 mt-1">
                  Terbilang: Rp {Number(formData.nominal_bruto || 0).toLocaleString('id-ID')}
                </p>
              </div>

              {/* Specific Tax Conditions */}
              {(formData.kode_akun === '521213' || formData.kode_akun === '522151') && (
                <div className="p-4 rounded-2xl bg-purple-50/60 border border-purple-150 space-y-3">
                  <p className="text-xs font-bold text-purple-900">Ketentuan Pajak PPh Pasal 21 (Honor / Jasa)</p>
                  
                  <div>
                    <label className="block text-[11px] font-semibold text-slate-700 mb-1">
                      Penerima PNS (Pilih Golongan jika PNS BPS / Luar)
                    </label>
                    <select
                      name="penerima_pns_gol"
                      value={formData.penerima_pns_gol}
                      onChange={handleInputChange}
                      className="w-full px-3 py-2 bg-white border border-purple-200 rounded-xl text-xs font-medium"
                    >
                      <option value="">Bukan PNS (Mitra / Masyarakat)</option>
                      <option value="IV">PNS Golongan IV (Tarif 15%)</option>
                      <option value="III">PNS Golongan III (Tarif 5%)</option>
                      <option value="II">PNS Golongan II / I (Tarif 0%)</option>
                    </select>
                  </div>

                  {!formData.penerima_pns_gol && (
                    <div className="space-y-2 pt-1 border-t border-purple-200/60">
                      <label className="flex items-center gap-2 text-xs font-medium text-slate-700 cursor-pointer">
                        <input
                          type="checkbox"
                          name="is_mitra_non_pns"
                          checked={formData.is_mitra_non_pns}
                          onChange={handleInputChange}
                          className="rounded text-purple-600"
                        />
                        <span>Mitra Non-PNS (PTKP Rp 4.500.000 / bulan)</span>
                      </label>

                      <label className="flex items-center gap-2 text-xs font-medium text-slate-700 cursor-pointer">
                        <input
                          type="checkbox"
                          name="has_npwp"
                          checked={formData.has_npwp}
                          onChange={handleInputChange}
                          className="rounded text-purple-600"
                        />
                        <span>Memiliki NPWP Valid (Tarif 5% vs 6%)</span>
                      </label>
                    </div>
                  )}
                </div>
              )}

              {(formData.kode_akun === '521211' || formData.kode_akun === '521811') && (
                <div className="p-4 rounded-2xl bg-purple-50/60 border border-purple-150 space-y-3">
                  <p className="text-xs font-bold text-purple-900">Ketentuan PPh 22 & PPh 23 (Bahan / Konsumsi)</p>
                  
                  <div>
                    <label className="block text-[11px] font-semibold text-slate-700 mb-1">
                      Jenis Pembelian Konsumsi / Rekanan
                    </label>
                    <select
                      name="rekanan_type"
                      value={formData.rekanan_type}
                      onChange={handleInputChange}
                      className="w-full px-3 py-2 bg-white border border-purple-200 rounded-xl text-xs font-medium"
                    >
                      <option value="toko">Toko / Warung Makan (Dikenakan PPh 22 jika &gt; 2 Juta)</option>
                      <option value="catering">Jasa Catering (Dikenakan PPh 23 2% tanpa minimal)</option>
                      <option value="barang">Pengadaan Barang / ATK (PPh 22 1,5% jika &gt; 2 Juta)</option>
                    </select>
                  </div>

                  <label className="flex items-center gap-2 text-xs font-medium text-slate-700 cursor-pointer">
                    <input
                      type="checkbox"
                      name="is_pkp"
                      checked={formData.is_pkp}
                      onChange={handleInputChange}
                      className="rounded text-purple-600"
                    />
                    <span>Rekanan Pengusaha Kena Pajak (Dikenakan PPN 11%)</span>
                  </label>
                </div>
              )}
            </div>

            {/* Live Calculation Output Card */}
            <div className="p-5 rounded-2xl bg-gradient-to-br from-[#2E1065] to-[#4C1D95] text-white space-y-4">
              <h3 className="font-extrabold text-sm border-b border-purple-400/30 pb-2 flex items-center justify-between">
                <span>Rincian Hasil Perhitungan</span>
                <span className="text-[10px] bg-amber-400 text-purple-950 px-2 py-0.5 rounded font-bold">Auto Tax</span>
              </h3>

              <div className="space-y-2 text-xs">
                <div className="flex justify-between">
                  <span className="text-purple-200">Nilai Bruto Pengeluaran</span>
                  <span className="font-mono font-bold">Rp {taxResult.bruto.toLocaleString('id-ID')}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-purple-200">Dasar Pengenaan Pajak (DPP)</span>
                  <span className="font-mono">Rp {taxResult.dpp.toLocaleString('id-ID')}</span>
                </div>
                {taxResult.ppn > 0 && (
                  <div className="flex justify-between text-amber-300">
                    <span>PPN ({formData.tarif_ppn}%)</span>
                    <span className="font-mono">+ Rp {taxResult.ppn.toLocaleString('id-ID')}</span>
                  </div>
                )}
                {taxResult.pph21 > 0 && (
                  <div className="flex justify-between text-rose-300">
                    <span>Potongan PPh 21</span>
                    <span className="font-mono">- Rp {taxResult.pph21.toLocaleString('id-ID')}</span>
                  </div>
                )}
                {taxResult.pph22 > 0 && (
                  <div className="flex justify-between text-rose-300">
                    <span>Potongan PPh 22 (1,5%)</span>
                    <span className="font-mono">- Rp {taxResult.pph22.toLocaleString('id-ID')}</span>
                  </div>
                )}
                {taxResult.pph23 > 0 && (
                  <div className="flex justify-between text-rose-300">
                    <span>Potongan PPh 23 (2%)</span>
                    <span className="font-mono">- Rp {taxResult.pph23.toLocaleString('id-ID')}</span>
                  </div>
                )}
                {taxResult.pph4_2 > 0 && (
                  <div className="flex justify-between text-rose-300">
                    <span>Potongan PPh Final 4(2)</span>
                    <span className="font-mono">- Rp {taxResult.pph4_2.toLocaleString('id-ID')}</span>
                  </div>
                )}
              </div>

              <div className="pt-3 border-t border-purple-400/30">
                <div className="flex justify-between text-sm font-extrabold text-amber-300">
                  <span>Jumlah Pembayaran (Netto)</span>
                  <span className="font-mono text-base">Rp {taxResult.netto.toLocaleString('id-ID')}</span>
                </div>
                <p className="text-[10px] text-purple-200 mt-1">
                  * Jumlah bersih yang akan ditransfer ke rekening penerima/rekanan.
                </p>
              </div>

              {taxResult.meterai > 0 && (
                <div className="p-2.5 rounded-xl bg-amber-400/20 border border-amber-300/40 text-[11px] text-amber-200">
                  ⚠️ <strong>Wajib Meterai Rp 10.000:</strong> Nilai transaksi di atas Rp 5.000.000.
                </div>
              )}

              {taxResult.notes.length > 0 && (
                <div className="text-[10px] text-purple-200 space-y-0.5 pt-1">
                  <div className="font-semibold text-white">Catatan Regulasi:</div>
                  {taxResult.notes.map((n, idx) => (
                    <div key={idx}>• {n}</div>
                  ))}
                </div>
              )}
            </div>
          </div>

          <div className="flex justify-between pt-4">
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

          <div className="flex justify-between pt-6 border-t border-purple-50">
            <button
              type="button"
              onClick={() => setStep(3)}
              className="px-5 py-2.5 rounded-xl border border-purple-200 hover:bg-purple-50 text-purple-900 font-bold text-xs"
            >
              ← Kembali
            </button>

            <button
              type="button"
              onClick={handleSubmit}
              className="px-8 py-3 rounded-2xl bg-gradient-to-r from-amber-400 via-purple-600 to-indigo-700 hover:from-amber-500 hover:to-indigo-800 text-white font-extrabold text-xs shadow-xl shadow-purple-600/30 flex items-center gap-2 transform active:scale-95 transition"
            >
              <CheckCircle2 className="w-4 h-4 text-amber-300" />
              <span>Kirim Pengajuan SPJ ke Verifikator & PPK</span>
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
