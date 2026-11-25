import React, { useState, useMemo } from 'react';
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
  Save,
  Eye,
  Trash2,
  Layers,
  Coins
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useNotification } from '../context/NotificationContext';
import { usePok } from '../context/PokContext';
import { KODE_AKUN_LIST, TIM_KERJA_LIST } from '../lib/seedData';
import { calculateTaxes } from '../lib/taxEngine';
import { documentVault, formatFileSize } from '../lib/documentVault';
import DocumentViewerModal from '../components/common/DocumentViewerModal';

export default function FormSPJPage() {
  const navigate = useNavigate();
  const { currentUser, addTransaction, pegawaiList } = useAuth();
  const { addNotification } = useNotification();
  const { pokAccounts, getAccountById } = usePok();

  const [step, setStep] = useState(1);

  // Default POK account match
  const defaultPokAccount = pokAccounts.find(a => a.kodeAkun === '521213') || pokAccounts[0];

  // Form state
  const [formData, setFormData] = useState({
    uraian_kegiatan: '',
    tim_kerja: currentUser?.tim_kerja || 'Produksi',
    pj_kegiatan_nip: currentUser?.role === 'pj_kegiatan' ? currentUser?.nip_baru : (pegawaiList.find(p => p.role === 'pj_kegiatan')?.nip_baru || pegawaiList[0]?.nip_baru),
    mekanisme_ls_gup: 'LS',
    pok_account_id: defaultPokAccount?.id || '',
    kode_akun: defaultPokAccount?.kodeAkun || '521213',
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

  // Uploaded real files metadata keyed by docName
  const [uploadedDocs, setUploadedDocs] = useState({});
  const [previewDoc, setPreviewDoc] = useState(null);

  // Current selected account rules (14 MAK)
  const currentAccount = KODE_AKUN_LIST.find(a => a.kode === formData.kode_akun) || KODE_AKUN_LIST[0];

  // Current selected POK Budget Account
  const selectedPok = useMemo(() => {
    return getAccountById(formData.pok_account_id) || null;
  }, [formData.pok_account_id, getAccountById]);

  const isOverBudget = selectedPok ? Number(formData.nominal_bruto) > selectedPok.sisaSetelahKomitmen : false;

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

  const handleSelectPok = (pokId) => {
    const found = pokAccounts.find(a => a.id === pokId);
    if (!found) {
      setFormData(prev => ({ ...prev, pok_account_id: '' }));
      return;
    }
    const matchingMak = KODE_AKUN_LIST.find(k => k.kode === found.kodeAkun);
    setFormData(prev => ({
      ...prev,
      pok_account_id: found.id,
      kode_akun: matchingMak ? found.kodeAkun : prev.kode_akun,
      tim_kerja: found.timKerja || prev.tim_kerja
    }));
  };

  // Unggah file asli ke IndexedDB Document Vault
  const handleRealFileUpload = async (docName, e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.size > 25 * 1024 * 1024) {
      alert('Ukuran file maksimal 25 MB per dokumen.');
      return;
    }

    const fileId = `doc-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`;
    try {
      await documentVault.saveFile(fileId, file);
      setUploadedDocs(prev => ({
        ...prev,
        [docName]: {
          docName,
          fileId,
          fileName: file.name,
          fileSize: file.size,
          fileType: file.type,
          uploadedAt: new Date().toLocaleDateString('id-ID', { day: 'numeric', month: 'short', hour: '2-digit', minute: '2-digit' })
        }
      }));
    } catch (err) {
      alert('Gagal menyimpan berkas dokumen: ' + err.message);
    }
  };

  const handleRemoveUploadedFile = async (docName) => {
    const existing = uploadedDocs[docName];
    if (existing?.fileId) {
      await documentVault.deleteFile(existing.fileId);
    }
    setUploadedDocs(prev => {
      const next = { ...prev };
      delete next[docName];
      return next;
    });
  };

  const handleSubmit = (targetStatus = 'Di PPK') => {
    if (targetStatus !== 'Draft' && isOverBudget) {
      const confirmOver = window.confirm(
        `PERINGATAN PAGU: Nilai pengajuan (Rp ${Number(formData.nominal_bruto).toLocaleString('id-ID')}) melebihi sisa pagu RKK SAKTI akun ${selectedPok?.kodeAkun} (Rp ${selectedPok?.sisaSetelahKomitmen?.toLocaleString('id-ID')}). Tetap lanjutkan?`
      );
      if (!confirmOver) return;
    }

    const pj = pegawaiList.find(p => p.nip_baru === formData.pj_kegiatan_nip) || currentUser;
    const isDirectDraft = targetStatus === 'Draft';
    const uploadedCount = Object.keys(uploadedDocs).length;
    const totalSyarat = currentAccount.syarat.length;

    const newTx = {
      id: `spj-${Date.now()}`,
      no_pengajuan: `SPJ-${Date.now().toString().slice(-5)}`,
      no_spm_spp: `00${Math.floor(100 + Math.random() * 900)}A`,
      pok_account_id: formData.pok_account_id || null,
      pok_output_nama: selectedPok?.outputNama || '',
      kategori_belanja: currentAccount.kategori,
      kode_akun: formData.kode_akun,
      uraian_kegiatan: formData.uraian_kegiatan.trim() || (selectedPok ? `${selectedPok.outputNama} (${selectedPok.namaAkun})` : "Pengajuan SPJ Baru"),
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
      
      kelengkapan_dokumen: uploadedCount >= Math.min(3, totalSyarat) ? 'LENGKAP' : 'BELUM LENGKAP',
      uploaded_docs: uploadedDocs,
      tanggal_terima: new Date().toISOString().split('T')[0],
      tanggal_proses: isDirectDraft ? '' : new Date().toISOString().split('T')[0],
      tanggal_sp2d: '',
      catatan_kekurangan: formData.catatan || (uploadedCount === 0 ? 'Berkas digital belum diunggah' : ''),
      review_ppk: isDirectDraft ? 'Draf tersimpan' : 'Menunggu peninjauan komitmen & verifikasi dokumen digital oleh PPK',
      review_ppspm: 'Menunggu',
      review_bdh: 'Menunggu'
    };

    addTransaction(newTx);

    if (!isDirectDraft) {
      addNotification({
        title: 'Pengajuan SPJ Baru di Meja PPK',
        message: `Pengajuan SPJ baru No. ${newTx.no_pengajuan} ("${newTx.uraian_kegiatan}") dengan ${uploadedCount} lampiran dokumen siap dicek PPK.`,
        type: 'info',
        category: 'disposisi',
        targetRole: ['ppk', 'superadmin'],
        no_spm: newTx.no_pengajuan,
        transactionId: newTx.id,
        link: `/pengajuan-spj/${newTx.id}`
      });
    }

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
                  {currentUser?.role === 'superadmin' 
                    ? 'Administrator Pengelola Sistem BPS Sambas' 
                    : `NIP: ${currentUser?.nip_baru || '-'} • Tim: ${currentUser?.tim_kerja || '-'}`}
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

      {/* Wizard Step 2: Tarik Data Pagu POK (RKK SAKTI) & Pilih Kode Akun */}
      {step === 2 && (
        <div className="p-6 rounded-3xl bg-white border border-purple-100 shadow-sm space-y-5 animate-in fade-in">
          <div>
            <h2 className="text-base font-extrabold text-slate-900">
              Langkah 2: Pilih Sumber Mata Anggaran POK (RKK SAKTI) & Kode Akun
            </h2>
            <p className="text-xs text-slate-500 mt-0.5">
              Tarik data pagu dari RKK SAKTI yang aktif agar sisa anggaran terpantau otomatis saat pengajuan dan realisasi RPD.
            </p>
          </div>

          {/* Koneksi Mata Anggaran POK RKK SAKTI */}
          <div className="p-4 rounded-2xl bg-gradient-to-br from-purple-50 to-indigo-50/70 border border-purple-200 space-y-3">
            <label className="block text-xs font-extrabold text-purple-950 flex items-center gap-2">
              <Layers className="w-4 h-4 text-purple-700" />
              <span>Tarik Data Anggaran dari POK / RKK SAKTI (Tim Kerja {formData.tim_kerja})</span>
            </label>

            <select
              value={formData.pok_account_id}
              onChange={(e) => handleSelectPok(e.target.value)}
              className="w-full px-3.5 py-2.5 bg-white border border-purple-300 rounded-xl text-xs font-semibold text-slate-800 focus:outline-none focus:ring-2 focus:ring-purple-500"
            >
              <option value="">-- Pilih Mata Anggaran Kegiatan dari RKK SAKTI --</option>
              {pokAccounts.map(acc => (
                <option key={acc.id} value={acc.id}>
                  [Tim {acc.timKerja}] {acc.outputKode} • {acc.kodeAkun} — {acc.namaAkun} ({acc.outputNama}) | Sisa: Rp {acc.sisaSetelahKomitmen.toLocaleString('id-ID')}
                </option>
              ))}
            </select>

            {selectedPok && (
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-1">
                <div className="p-3 bg-white rounded-xl border border-purple-100">
                  <span className="text-[10px] text-slate-400 font-bold uppercase block">Pagu Revisi POK</span>
                  <span className="font-mono font-extrabold text-sm text-slate-900">
                    Rp {selectedPok.pagu.toLocaleString('id-ID')}
                  </span>
                </div>
                <div className="p-3 bg-white rounded-xl border border-purple-100">
                  <span className="text-[10px] text-slate-400 font-bold uppercase block">Terpakai & Antre SPJ</span>
                  <span className="font-mono font-bold text-sm text-purple-800">
                    Rp {(selectedPok.totalRealisasi + selectedPok.komitmenOnProgress).toLocaleString('id-ID')}
                  </span>
                </div>
                <div className={`p-3 rounded-xl border ${
                  selectedPok.sisaSetelahKomitmen > 0 ? 'bg-emerald-50 border-emerald-200' : 'bg-rose-50 border-rose-200'
                }`}>
                  <span className="text-[10px] text-slate-500 font-bold uppercase block">Sisa Pagu Bebas</span>
                  <span className={`font-mono font-black text-sm ${
                    selectedPok.sisaSetelahKomitmen > 0 ? 'text-emerald-800' : 'text-rose-700'
                  }`}>
                    Rp {selectedPok.sisaSetelahKomitmen.toLocaleString('id-ID')}
                  </span>
                </div>
              </div>
            )}
          </div>

          <div className="pt-1">
            <h3 className="text-xs font-extrabold text-slate-700 mb-2">
              Aturan Pajak & Syarat Kelengkapan Dokumen (14 MAK Standar BPS):
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 max-h-72 overflow-y-auto pr-1">
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

          {isOverBudget && selectedPok && (
            <div className="p-4 rounded-2xl bg-red-50 border border-red-200 flex items-start gap-3 text-xs text-red-900">
              <AlertTriangle className="w-5 h-5 text-red-600 shrink-0 mt-0.5" />
              <div>
                <p className="font-extrabold">Peringatan: Nominal Bruto Melebihi Sisa Pagu POK Bebas!</p>
                <p className="mt-0.5 text-red-700 leading-relaxed">
                  Nominal Bruto (<strong>Rp {Number(formData.nominal_bruto || 0).toLocaleString('id-ID')}</strong>) melebihi sisa anggaran tersedia pada rincian <strong>{selectedPok.uraian}</strong> (Sisa bebas: <strong>Rp {selectedPok.sisaSetelahKomitmen.toLocaleString('id-ID')}</strong>). Anda hanya dapat menyimpan sebagai <em>Draft</em> atau perlu penyesuaian nominal/revisi RPD terlebih dahulu.
                </p>
              </div>
            </div>
          )}

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
              Unggah berkas dokumen asli (PDF, JPG, PNG, atau XLSX, maksimal 10MB per berkas) agar PPK & Bendahara dapat memeriksa langsung di dalam sistem.
            </p>
          </div>

          <div className="space-y-3">
            {currentAccount.syarat.map((doc, idx) => {
              const fileMeta = uploadedDocs[doc];
              const isUploaded = Boolean(fileMeta);
              return (
                <div
                  key={idx}
                  className={`p-3.5 rounded-2xl border flex flex-col sm:flex-row sm:items-center justify-between gap-3 transition ${
                    isUploaded 
                      ? 'bg-emerald-50/70 border-emerald-300' 
                      : 'bg-purple-50/20 border-purple-100 hover:border-purple-300'
                  }`}
                >
                  <div className="flex items-center gap-3 min-w-0">
                    <div className={`w-8 h-8 rounded-lg flex items-center justify-center font-bold text-xs shrink-0 ${
                      isUploaded ? 'bg-emerald-600 text-white' : 'bg-purple-200 text-purple-800'
                    }`}>
                      {isUploaded ? <CheckCircle2 className="w-5 h-5" /> : idx + 1}
                    </div>
                    <div className="min-w-0">
                      <p className="font-bold text-xs text-slate-800">{doc}</p>
                      {isUploaded ? (
                        <p className="text-[10px] text-emerald-700 font-medium truncate">
                          Telah diunggah: <strong>{fileMeta.fileName}</strong> • {formatFileSize(fileMeta.fileSize)} ({fileMeta.uploadedAt})
                        </p>
                      ) : (
                        <p className="text-[10px] text-slate-400">Format didukung: PDF, JPG, PNG, XLSX (Maks 10MB)</p>
                      )}
                    </div>
                  </div>

                  <div className="flex items-center gap-2 shrink-0 self-end sm:self-center">
                    {isUploaded && (
                      <>
                        <button
                          type="button"
                          onClick={() => setPreviewDoc({ docName: doc, ...fileMeta })}
                          className="px-3 py-1.5 rounded-xl bg-white border border-emerald-200 hover:bg-emerald-100 text-emerald-800 text-xs font-bold flex items-center gap-1.5 transition"
                        >
                          <Eye className="w-3.5 h-3.5" />
                          <span>Lihat</span>
                        </button>
                        <button
                          type="button"
                          onClick={() => handleRemoveUploadedFile(doc)}
                          title="Hapus file"
                          className="p-1.5 rounded-xl bg-white border border-red-200 hover:bg-red-50 text-red-600 transition"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </>
                    )}
                    <label
                      className={`px-3 py-1.5 rounded-xl text-xs font-semibold flex items-center gap-1.5 transition cursor-pointer ${
                        isUploaded 
                          ? 'bg-emerald-200 hover:bg-emerald-300 text-emerald-900' 
                          : 'bg-purple-100 hover:bg-purple-200 text-purple-900'
                      }`}
                    >
                      <UploadCloud className="w-3.5 h-3.5" />
                      <span>{isUploaded ? 'Ganti File' : 'Pilih & Unggah'}</span>
                      <input
                        type="file"
                        accept=".pdf,image/*,.xlsx,.xls"
                        className="hidden"
                        onChange={(e) => handleRealFileUpload(doc, e)}
                      />
                    </label>
                  </div>
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

      {/* Preview Modal untuk dokumen yang diunggah */}
      <DocumentViewerModal
        isOpen={Boolean(previewDoc)}
        onClose={() => setPreviewDoc(null)}
        docInfo={previewDoc}
      />
    </div>
  );
}
