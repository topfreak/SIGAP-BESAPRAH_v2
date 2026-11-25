/**
 * SIGAP BESAPRAH - Dataset Resmi RKK SAKTI & RPD BPS Kabupaten Sambas T.A. 2026
 * Satker: (428392) BADAN PUSAT STATISTIK KAB. SAMBAS
 * Total Pagu Revisi: Rp 15.194.551.000
 */

export const NAMA_BULAN = [
  'Januari', 'Februari', 'Maret', 'April', 'Mei', 'Juni',
  'Juli', 'Agustus', 'September', 'Oktober', 'November', 'Desember'
];

export const NAMA_BULAN_SINGKAT = [
  'Jan', 'Feb', 'Mar', 'Apr', 'Mei', 'Jun',
  'Jul', 'Agt', 'Sep', 'Okt', 'Nov', 'Des'
];

// Helper pembuat array 12 bulan
const m = (jan=0, feb=0, mar=0, apr=0, mei=0, jun=0, jul=0, agt=0, sep=0, okt=0, nov=0, des=0) => 
  [jan, feb, mar, apr, mei, jun, jul, agt, sep, okt, nov, des];

export const INITIAL_RKK_METADATA = {
  tahun_anggaran: 2026,
  kemen_lemb: '(054) BADAN PUSAT STATISTIK',
  unit_org: '(01) Badan Pusat Statistik',
  satker_kode: '428392',
  satker_nama: 'BADAN PUSAT STATISTIK KAB. SAMBAS',
  lokasi: 'KAB. SAMBAS',
  kppn: 'KPPN.093-Singkawang',
  kpa_nama: 'SOLIKHIN',
  kpa_nip: '197908271999121001',
  sumber_import: 'Data Resmi RKK & RPD SAKTI T.A. 2026',
  tanggal_import: '2026-11-25'
};

/**
 * Daftar baris Akun POK lengkap dari dokumen RKK SAKTI BPS Sambas T.A. 2026.
 * Setiap baris memiliki relasi ke Program -> Kegiatan -> KRO/Output -> Komponen -> Akun -> Item rincian,
 * serta target RPD 12 bulan & realisasi awal 12 bulan.
 */
export const INITIAL_POK_ACCOUNTS = [
  // =========================================================================
  // PROGRAM 054.01.GG : Penyediaan dan Pelayanan Informasi Statistik
  // =========================================================================

  // --- 2896: Analisis Statistik, Tata Kelola Data, Neraca Satelit (Nerwilis) ---
  {
    id: '2896.BMA.004-052-524113',
    programKode: '054.01.GG',
    programNama: 'Program Penyediaan dan Pelayanan Informasi Statistik',
    kegiatanKode: '2896',
    kegiatanNama: 'Analisis Statistik, Tata Kelola Data Statistik Pembangunan, dan Neraca Satelit',
    outputKode: '2896.BMA.004',
    outputNama: 'PUBLIKASI/LAPORAN ANALISIS STATISTIK DAN NERACA SATELIT',
    komponenKode: '052',
    komponenNama: 'PENGUMPULAN DATA',
    subKomponen: 'A - TANPA SUB KOMPONEN',
    timKerja: 'Nerwilis',
    kodeAkun: '524113',
    namaAkun: 'Belanja Perjalanan Dinas Dalam Kota',
    sumberDana: 'RM',
    pagu: 170000,
    rpdBulanan: m(0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 170000),
    realisasiAwal: m(0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0),
    items: [
      { deskripsi: 'transport lokal', volume: 1, satuan: 'OKali', hargaSatuan: 170000, jumlah: 170000 }
    ]
  },

  // --- 2897: Diseminasi, Pemberdayaan, Evaluasi Statistik (IPDS / Diseminasi) ---
  {
    id: '2897.BMA.004-052-524111',
    programKode: '054.01.GG',
    programNama: 'Program Penyediaan dan Pelayanan Informasi Statistik',
    kegiatanKode: '2897',
    kegiatanNama: 'Diseminasi, Pemberdayaan, dan Evaluasi Penyelenggaraan Statistik',
    outputKode: '2897.BMA.004',
    outputNama: 'LAYANAN STATISTIK TERPADU',
    komponenKode: '052',
    komponenNama: 'PENGUMPULAN DATA',
    subKomponen: 'A - TANPA SUB KOMPONEN',
    timKerja: 'IPDS',
    kodeAkun: '524111',
    namaAkun: 'Belanja Perjalanan Dinas Biasa',
    sumberDana: 'RM',
    pagu: 11080000,
    rpdBulanan: m(0, 0, 0, 0, 0, 0, 0, 0, 9915000, 0, 0, 1165000),
    realisasiAwal: m(0, 0, 0, 0, 0, 0, 0, 0, 9915000, 0, 0, 0),
    items: [
      { deskripsi: 'Perjalanan dinas konsultasi Kab/Kota ke BPS Provinsi', volume: 3, satuan: 'OP', hargaSatuan: 3693334, jumlah: 11080000 }
    ]
  },
  {
    id: '2897.BMA.004-052-524113',
    programKode: '054.01.GG',
    programNama: 'Program Penyediaan dan Pelayanan Informasi Statistik',
    kegiatanKode: '2897',
    kegiatanNama: 'Diseminasi, Pemberdayaan, dan Evaluasi Penyelenggaraan Statistik',
    outputKode: '2897.BMA.004',
    outputNama: 'LAYANAN STATISTIK TERPADU',
    komponenKode: '052',
    komponenNama: 'PENGUMPULAN DATA',
    subKomponen: 'A - TANPA SUB KOMPONEN',
    timKerja: 'IPDS',
    kodeAkun: '524113',
    namaAkun: 'Belanja Perjalanan Dinas Dalam Kota',
    sumberDana: 'RM',
    pagu: 170000,
    rpdBulanan: m(0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 170000),
    realisasiAwal: m(),
    items: [
      { deskripsi: 'Transport lokal FGD Standar Pelayanan 2026', volume: 1, satuan: 'OKali', hargaSatuan: 170000, jumlah: 170000 }
    ]
  },
  {
    id: '2897.QDB.003-052-522151',
    programKode: '054.01.GG',
    programNama: 'Program Penyediaan dan Pelayanan Informasi Statistik',
    kegiatanKode: '2897',
    kegiatanNama: 'Diseminasi, Pemberdayaan, dan Evaluasi Penyelenggaraan Statistik',
    outputKode: '2897.QDB.003',
    outputNama: 'PEMBINAAN STATISTIK SEKTORAL',
    komponenKode: '052',
    komponenNama: 'PENGUMPULAN DATA',
    subKomponen: 'A - TANPA SUB KOMPONEN',
    timKerja: 'IPDS',
    kodeAkun: '522151',
    namaAkun: 'Belanja Jasa Profesi',
    sumberDana: 'RM',
    pagu: 1000000,
    rpdBulanan: m(),
    realisasiAwal: m(),
    items: [
      { deskripsi: 'Honor narasumber eselon II/ ke bawah', volume: 1, satuan: 'OJ', hargaSatuan: 1000000, jumlah: 1000000 }
    ]
  },
  {
    id: '2897.QDB.003-052-524113',
    programKode: '054.01.GG',
    programNama: 'Program Penyediaan dan Pelayanan Informasi Statistik',
    kegiatanKode: '2897',
    kegiatanNama: 'Diseminasi, Pemberdayaan, dan Evaluasi Penyelenggaraan Statistik',
    outputKode: '2897.QDB.003',
    outputNama: 'PEMBINAAN STATISTIK SEKTORAL',
    komponenKode: '052',
    komponenNama: 'PENGUMPULAN DATA',
    subKomponen: 'A - TANPA SUB KOMPONEN',
    timKerja: 'IPDS',
    kodeAkun: '524113',
    namaAkun: 'Belanja Perjalanan Dinas Dalam Kota',
    sumberDana: 'RM',
    pagu: 1530000,
    rpdBulanan: m(0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1530000),
    realisasiAwal: m(),
    items: [
      { deskripsi: 'Transport lokal dalam rangka pembinaan statistik sektoral (kabkota)', volume: 9, satuan: 'OKali', hargaSatuan: 170000, jumlah: 1530000 }
    ]
  },

  // --- 2898: Statistik Neraca Pengeluaran (Nerwilis) ---
  {
    id: '2898.BMA.007-005-521213',
    programKode: '054.01.GG',
    programNama: 'Program Penyediaan dan Pelayanan Informasi Statistik',
    kegiatanKode: '2898',
    kegiatanNama: 'Penyediaan dan Pengembangan Statistik Neraca Pengeluaran',
    outputKode: '2898.BMA.007',
    outputNama: 'PUBLIKASI/LAPORAN STATISTIK NERACA PENGELUARAN',
    komponenKode: '005',
    komponenNama: 'Dukungan Penyelenggaraan Tugas dan Fungsi Unit',
    subKomponen: 'A - TANPA SUB KOMPONEN',
    timKerja: 'Nerwilis',
    kodeAkun: '521213',
    namaAkun: 'Belanja Honor Output Kegiatan',
    sumberDana: 'RM',
    pagu: 6159000,
    rpdBulanan: m(0, 0, 0, 546000, 0, 0, 182000, 0, 0, 1456000, 3975000, 0),
    realisasiAwal: m(0, 0, 0, 546000, 0, 0, 182000, 0, 0, 546000, 0, 0),
    items: [
      { deskripsi: 'honor petugas pendataan lapangan SKLNP Triwulanan (kabkot)', volume: 24, satuan: 'Dok', hargaSatuan: 91000, jumlah: 2184000 },
      { deskripsi: 'honor petugas pendataan lapangan sksppi di kab/kota', volume: 53, satuan: 'Dok', hargaSatuan: 75000, jumlah: 3975000 }
    ]
  },
  {
    id: '2898.BMA.007-005-524113',
    programKode: '054.01.GG',
    programNama: 'Program Penyediaan dan Pelayanan Informasi Statistik',
    kegiatanKode: '2898',
    kegiatanNama: 'Penyediaan dan Pengembangan Statistik Neraca Pengeluaran',
    outputKode: '2898.BMA.007',
    outputNama: 'PUBLIKASI/LAPORAN STATISTIK NERACA PENGELUARAN',
    komponenKode: '005',
    komponenNama: 'Dukungan Penyelenggaraan Tugas dan Fungsi Unit',
    subKomponen: 'A - TANPA SUB KOMPONEN',
    timKerja: 'Nerwilis',
    kodeAkun: '524113',
    namaAkun: 'Belanja Perjalanan Dinas Dalam Kota',
    sumberDana: 'RM',
    pagu: 4510000,
    rpdBulanan: m(0, 0, 0, 0, 0, 320000, 0, 0, 0, 0, 360000, 3830000),
    realisasiAwal: m(0, 0, 0, 0, 0, 320000, 0, 0, 0, 0, 0, 0),
    items: [
      { deskripsi: 'transport lokal petugas pemeriksaan lapangan SKLNP Triwulanan', volume: 3, satuan: 'OKali', hargaSatuan: 170000, jumlah: 510000 },
      { deskripsi: 'transport lokal petugas pemeriksaan lapangan sksppi di kab/kota', volume: 6, satuan: 'OKali', hargaSatuan: 170000, jumlah: 1020000 },
      { deskripsi: 'transport lokal petugas pendataan lapangan SKLNP Triwulanan', volume: 4, satuan: 'OKali', hargaSatuan: 170000, jumlah: 680000 },
      { deskripsi: 'transport lokal petugas pedataan lapangan sksppi di kab/kota', volume: 14, satuan: 'OKali', hargaSatuan: 164286, jumlah: 2300000 }
    ]
  },
  {
    id: '2898.BMA.007-051-521211',
    programKode: '054.01.GG',
    programNama: 'Program Penyediaan dan Pelayanan Informasi Statistik',
    kegiatanKode: '2898',
    kegiatanNama: 'Penyediaan dan Pengembangan Statistik Neraca Pengeluaran',
    outputKode: '2898.BMA.007',
    outputNama: 'PUBLIKASI/LAPORAN STATISTIK NERACA PENGELUARAN',
    komponenKode: '051',
    komponenNama: 'PERSIAPAN',
    subKomponen: 'A - TANPA SUB KOMPONEN',
    timKerja: 'Nerwilis',
    kodeAkun: '521211',
    namaAkun: 'Belanja Bahan',
    sumberDana: 'RM',
    pagu: 2245000,
    rpdBulanan: m(0, 0, 0, 300000, 0, 0, 0, 0, 1350000, 0, 0, 0),
    realisasiAwal: m(0, 0, 0, 300000, 0, 0, 0, 0, 1350000, 0, 0, 0),
    items: [
      { deskripsi: 'konsumsi fullday di kantor pelatihan petugas pencacahan SKLNPT', volume: 7, satuan: 'OK', hargaSatuan: 85000, jumlah: 595000 },
      { deskripsi: 'perlengkapan pelatihan petugas SKLNPT', volume: 6, satuan: 'Set', hargaSatuan: 50000, jumlah: 300000 },
      { deskripsi: 'perlengkapan pelatihan petugas SKSPPI', volume: 10, satuan: 'Set', hargaSatuan: 50000, jumlah: 500000 },
      { deskripsi: 'konsumsi fullday di kantor pelatihan petugas pencacahan SKSPPI', volume: 10, satuan: 'OK', hargaSatuan: 85000, jumlah: 850000 }
    ]
  },
  {
    id: '2898.BMA.007-051-521213',
    programKode: '054.01.GG',
    programNama: 'Program Penyediaan dan Pelayanan Informasi Statistik',
    kegiatanKode: '2898',
    kegiatanNama: 'Penyediaan dan Pengembangan Statistik Neraca Pengeluaran',
    outputKode: '2898.BMA.007',
    outputNama: 'PUBLIKASI/LAPORAN STATISTIK NERACA PENGELUARAN',
    komponenKode: '051',
    komponenNama: 'PERSIAPAN',
    subKomponen: 'A - TANPA SUB KOMPONEN',
    timKerja: 'Nerwilis',
    kodeAkun: '521213',
    namaAkun: 'Belanja Honor Output Kegiatan',
    sumberDana: 'RM',
    pagu: 1998000,
    rpdBulanan: m(0, 0, 0, 1998000, 0, 0, 0, 0, 0, 0, 0, 0),
    realisasiAwal: m(0, 0, 0, 1998000, 0, 0, 0, 0, 0, 0, 0, 0),
    items: [
      { deskripsi: 'honor pengajar petugas fullday pelatihan SKLNPT', volume: 9, satuan: 'OJP', hargaSatuan: 111000, jumlah: 999000 },
      { deskripsi: 'honor pengajar petugas fullday pelatihan SKSPPI', volume: 9, satuan: 'OJP', hargaSatuan: 111000, jumlah: 999000 }
    ]
  },
  {
    id: '2898.BMA.007-052-524111',
    programKode: '054.01.GG',
    programNama: 'Program Penyediaan dan Pelayanan Informasi Statistik',
    kegiatanKode: '2898',
    kegiatanNama: 'Penyediaan dan Pengembangan Statistik Neraca Pengeluaran',
    outputKode: '2898.BMA.007',
    outputNama: 'PUBLIKASI/LAPORAN STATISTIK NERACA PENGELUARAN',
    komponenKode: '052',
    komponenNama: 'PENGUMPULAN DATA',
    subKomponen: 'A - TANPA SUB KOMPONEN',
    timKerja: 'Nerwilis',
    kodeAkun: '524111',
    namaAkun: 'Belanja Perjalanan Dinas Biasa',
    sumberDana: 'RM',
    pagu: 3545000,
    rpdBulanan: m(0, 0, 0, 0, 3545000, 0, 0, 0, 0, 0, 0, 0),
    realisasiAwal: m(0, 0, 0, 0, 3545000, 0, 0, 0, 0, 0, 0, 0),
    items: [
      { deskripsi: 'Perjalanan dinas rekonsiliasi PDRB pengeluaran triwulanan Kab/Kota', volume: 1, satuan: 'OP', hargaSatuan: 3545000, jumlah: 3545000 }
    ]
  },

  // --- 2899: Statistik Neraca Produksi (Nerwilis) ---
  {
    id: '2899.BMA.006-005-521213',
    programKode: '054.01.GG',
    programNama: 'Program Penyediaan dan Pelayanan Informasi Statistik',
    kegiatanKode: '2899',
    kegiatanNama: 'Penyediaan dan Pengembangan Statistik Neraca Produksi',
    outputKode: '2899.BMA.006',
    outputNama: 'PUBLIKASI/LAPORAN NERACA PRODUKSI',
    komponenKode: '005',
    komponenNama: 'Dukungan Penyelenggaraan Tugas dan Fungsi Unit',
    subKomponen: 'A - TANPA SUB KOMPONEN',
    timKerja: 'Nerwilis',
    kodeAkun: '521213',
    namaAkun: 'Belanja Honor Output Kegiatan',
    sumberDana: 'RM',
    pagu: 3168000,
    rpdBulanan: m(0, 462000, 0, 198000, 0, 0, 0, 132000, 0, 198000, 2178000, 0),
    realisasiAwal: m(0, 462000, 0, 198000, 0, 0, 0, 132000, 0, 0, 0, 0),
    items: [
      { deskripsi: 'Honor petugas lapangan SKTNP Jasa 2026', volume: 11, satuan: 'Dok', hargaSatuan: 66000, jumlah: 726000 },
      { deskripsi: 'honor petugas pendataan lapangan SKNP', volume: 33, satuan: 'Dok', hargaSatuan: 66000, jumlah: 2178000 },
      { deskripsi: 'Honor Petugas Pendataan Lapangan SKTNP Barang', volume: 4, satuan: 'Dok', hargaSatuan: 66000, jumlah: 264000 }
    ]
  },
  {
    id: '2899.BMA.006-052-524111',
    programKode: '054.01.GG',
    programNama: 'Program Penyediaan dan Pelayanan Informasi Statistik',
    kegiatanKode: '2899',
    kegiatanNama: 'Penyediaan dan Pengembangan Statistik Neraca Produksi',
    outputKode: '2899.BMA.006',
    outputNama: 'PUBLIKASI/LAPORAN NERACA PRODUKSI',
    komponenKode: '052',
    komponenNama: 'PENGUMPULAN DATA',
    subKomponen: 'A - TANPA SUB KOMPONEN',
    timKerja: 'Nerwilis',
    kodeAkun: '524111',
    namaAkun: 'Belanja Perjalanan Dinas Biasa',
    sumberDana: 'RM',
    pagu: 3445000,
    rpdBulanan: m(0, 0, 0, 0, 3445000, 0, 0, 0, 0, 0, 0, 0),
    realisasiAwal: m(0, 0, 0, 0, 3445000, 0, 0, 0, 0, 0, 0, 0),
    items: [
      { deskripsi: 'Perjalanan dinas rekonsiliasi PDRB Triwulanan Kab/Kota', volume: 1, satuan: 'OP', hargaSatuan: 3445000, jumlah: 3445000 }
    ]
  },

  // --- 2901: Pengembangan Sistem Informasi Statistik (IPDS) ---
  {
    id: '2901.CAN.004-056-522119',
    programKode: '054.01.GG',
    programNama: 'Program Penyediaan dan Pelayanan Informasi Statistik',
    kegiatanKode: '2901',
    kegiatanNama: 'Pengembangan Sistem Informasi Statistik',
    outputKode: '2901.CAN.004',
    outputNama: 'Pengembangan Infrastruktur dan Layanan Teknologi Informasi dan Komunikasi',
    komponenKode: '056',
    komponenNama: 'Pengembangan Infrastruktur dan Layanan Teknologi Informasi dan Komunikasi',
    subKomponen: 'A - TANPA SUB KOMPONEN',
    timKerja: 'IPDS',
    kodeAkun: '522119',
    namaAkun: 'Belanja Langganan Daya dan Jasa Lainnya',
    sumberDana: 'RM',
    pagu: 7077000,
    rpdBulanan: m(0, 7076250, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0),
    realisasiAwal: m(0, 7076250, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0),
    items: [
      { deskripsi: 'Pengadaan software pendukung perwajahan publikasi BPS Kabupaten/Kota', volume: 1, satuan: 'PAKET', hargaSatuan: 7077000, jumlah: 7077000 }
    ]
  },

  // --- 2902: Statistik Distribusi & Sensus Ekonomi 2026 (Distribusi) ---
  {
    id: '2902.BMA.006-005-524113',
    programKode: '054.01.GG',
    programNama: 'Program Penyediaan dan Pelayanan Informasi Statistik',
    kegiatanKode: '2902',
    kegiatanNama: 'Penyediaan dan Pengembangan Statistik Distribusi (Sensus Ekonomi 2026)',
    outputKode: '2902.BMA.006',
    outputNama: 'PUBLIKASI/LAPORAN SENSUS EKONOMI',
    komponenKode: '005',
    komponenNama: 'Dukungan Penyelenggaraan Tugas dan Fungsi Unit',
    subKomponen: 'A - TANPA SUB KOMPONEN',
    timKerja: 'Distribusi',
    kodeAkun: '524113',
    namaAkun: 'Belanja Perjalanan Dinas Dalam Kota',
    sumberDana: 'RM',
    pagu: 70040000,
    rpdBulanan: m(0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 29530000, 40510000),
    realisasiAwal: m(),
    items: [
      { deskripsi: 'Task force pendataan lengkap dan CAWI BPS Kab/Kota', volume: 40, satuan: 'OK', hargaSatuan: 170000, jumlah: 6800000 },
      { deskripsi: 'Transport Pengawasan tim pelaksana BPS Kab/Kota', volume: 200, satuan: 'OK', hargaSatuan: 170000, jumlah: 34000000 },
      { deskripsi: 'Transport lokal dalam rangka PES', volume: 172, satuan: 'OK', hargaSatuan: 170000, jumlah: 29240000 }
    ]
  },
  {
    id: '2902.BMA.006-530-524114',
    programKode: '054.01.GG',
    programNama: 'Program Penyediaan dan Pelayanan Informasi Statistik',
    kegiatanKode: '2902',
    kegiatanNama: 'Penyediaan dan Pengembangan Statistik Distribusi (Sensus Ekonomi 2026)',
    outputKode: '2902.BMA.006',
    outputNama: 'PUBLIKASI/LAPORAN SENSUS EKONOMI',
    komponenKode: '530',
    komponenNama: 'Pelaksanaan SE2026',
    subKomponen: 'A - PELATIHAN PETUGAS SE2026',
    timKerja: 'Distribusi',
    kodeAkun: '524114',
    namaAkun: 'Belanja Perjalanan Dinas Paket Meeting Dalam Kota',
    sumberDana: 'RM',
    pagu: 317060000,
    rpdBulanan: m(0, 0, 0, 0, 0, 317060000, 0, 0, 0, 0, 0, 0),
    realisasiAwal: m(0, 0, 0, 0, 0, 317060000, 0, 0, 0, 0, 0, 0),
    items: [
      { deskripsi: 'Perjalanan Fullboard pelatihan petugas pendataan SE2026', volume: 626, satuan: 'OP', hargaSatuan: 506486, jumlah: 317060000 }
    ]
  },
  {
    id: '2902.BMA.006-530-521211',
    programKode: '054.01.GG',
    programNama: 'Program Penyediaan dan Pelayanan Informasi Statistik',
    kegiatanKode: '2902',
    kegiatanNama: 'Penyediaan dan Pengembangan Statistik Distribusi (Sensus Ekonomi 2026)',
    outputKode: '2902.BMA.006',
    outputNama: 'PUBLIKASI/LAPORAN SENSUS EKONOMI',
    komponenKode: '530',
    komponenNama: 'Pelaksanaan SE2026',
    subKomponen: 'B - PENDATAAN LENGKAP',
    timKerja: 'Distribusi',
    kodeAkun: '521211',
    namaAkun: 'Belanja Bahan (Paket Data SE2026)',
    sumberDana: 'RM',
    pagu: 142300000,
    rpdBulanan: m(0, 0, 0, 0, 0, 56899943, 56899943, 28449972, 0, 0, 0, 0),
    realisasiAwal: m(0, 0, 0, 0, 0, 56899943, 56899943, 28449972, 0, 0, 0, 0),
    items: [
      { deskripsi: 'Biaya Paket Data Pelaksanaan SE2026', volume: 1423, satuan: 'OB', hargaSatuan: 100000, jumlah: 142300000 }
    ]
  },
  {
    id: '2902.BMA.006-530-524113',
    programKode: '054.01.GG',
    programNama: 'Program Penyediaan dan Pelayanan Informasi Statistik',
    kegiatanKode: '2902',
    kegiatanNama: 'Penyediaan dan Pengembangan Statistik Distribusi (Sensus Ekonomi 2026)',
    outputKode: '2902.BMA.006',
    outputNama: 'PUBLIKASI/LAPORAN SENSUS EKONOMI',
    komponenKode: '530',
    komponenNama: 'Pelaksanaan SE2026',
    subKomponen: 'B - PENDATAAN LENGKAP',
    timKerja: 'Distribusi',
    kodeAkun: '524113',
    namaAkun: 'Belanja Perjalanan Dinas Dalam Kota',
    sumberDana: 'RM',
    pagu: 186634000,
    rpdBulanan: m(0, 0, 0, 0, 0, 0, 42075000, 45675000, 43825000, 30464000, 0, 24595000),
    realisasiAwal: m(0, 0, 0, 0, 0, 0, 42075000, 45675000, 43825000, 0, 0, 0),
    items: [
      { deskripsi: 'Transport Pertemuan Petugas SE2026', volume: 1800, satuan: 'OK', hargaSatuan: 75000, jumlah: 135000000 },
      { deskripsi: 'Transport penunjuk jalan SE2026', volume: 250, satuan: 'OK', hargaSatuan: 100000, jumlah: 25000000 },
      { deskripsi: 'Transport Daerah Sulit SE2026', volume: 10, satuan: 'OP', hargaSatuan: 2096400, jumlah: 20964000 },
      { deskripsi: 'Perjalanan Pengawasan Kab/Kota ke Kecamatan', volume: 18, satuan: 'OP', hargaSatuan: 315000, jumlah: 5670000 }
    ]
  },
  {
    id: '2902.BMA.006-SABA-521213',
    programKode: '054.01.GG',
    programNama: 'Program Penyediaan dan Pelayanan Informasi Statistik',
    kegiatanKode: '2902',
    kegiatanNama: 'Penyediaan dan Pengembangan Statistik Distribusi (Sensus Ekonomi 2026)',
    outputKode: '2902.BMA.006',
    outputNama: 'PUBLIKASI/LAPORAN SENSUS EKONOMI (SABA 999.08)',
    komponenKode: '005',
    komponenNama: 'Dukungan Penyelenggaraan Tugas dan Fungsi Unit',
    subKomponen: 'A - TANPA SUB KOMPONEN',
    timKerja: 'Distribusi',
    kodeAkun: '521213',
    namaAkun: 'Belanja Honor Output Kegiatan (Petugas SE2026)',
    sumberDana: 'RM',
    pagu: 5806282000,
    rpdBulanan: m(0, 0, 0, 0, 0, 0, 2753758000, 4917000, 3010834500, 0, 0, 31697000),
    realisasiAwal: m(0, 0, 0, 0, 0, 0, 2753758000, 4917000, 3010834500, 0, 0, 0),
    items: [
      { deskripsi: 'Honor petugas lapangan sensus SE2026', volume: 1021, satuan: 'OB', hargaSatuan: 4817000, jumlah: 4918157000 },
      { deskripsi: 'Honor pemeriksa lapangan sensus (PML) SE2026', volume: 175, satuan: 'OB', hargaSatuan: 5075000, jumlah: 888125000 }
    ]
  },
  {
    id: '2902.CAN.004-056-532111',
    programKode: '054.01.GG',
    programNama: 'Program Penyediaan dan Pelayanan Informasi Statistik',
    kegiatanKode: '2902',
    kegiatanNama: 'Penyediaan dan Pengembangan Statistik Distribusi (Sensus Ekonomi 2026)',
    outputKode: '2902.CAN.004',
    outputNama: 'Pengadaan TIK SE2026 (Laptop)',
    komponenKode: '056',
    komponenNama: 'Pengadaan TIK SE2026',
    subKomponen: 'A - TANPA SUB KOMPONEN',
    timKerja: 'Distribusi',
    kodeAkun: '532111',
    namaAkun: 'Belanja Modal Peralatan dan Mesin',
    sumberDana: 'RM',
    pagu: 45000000,
    rpdBulanan: m(0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 45000000, 0),
    realisasiAwal: m(),
    items: [
      { deskripsi: 'Pengadaan laptop', volume: 2, satuan: 'UNIT', hargaSatuan: 22500000, jumlah: 45000000 }
    ]
  },
  {
    id: '2902.FAN.ZZ1-051-521213',
    programKode: '054.01.GG',
    programNama: 'Program Penyediaan dan Pelayanan Informasi Statistik',
    kegiatanKode: '2902',
    kegiatanNama: 'Penyediaan dan Pengembangan Statistik Distribusi (Sensus Ekonomi 2026)',
    outputKode: '2902.FAN.ZZ1',
    outputNama: 'Pemenuhan Prioritas Direktif Presiden (SE2026)',
    komponenKode: '051',
    komponenNama: 'SENSUS EKONOMI 2026',
    subKomponen: 'A - DUKUNGAN TUGAS FUNGSI',
    timKerja: 'Distribusi',
    kodeAkun: '521213',
    namaAkun: 'Belanja Honor Output Kegiatan',
    sumberDana: 'RM',
    pagu: 1188106000,
    rpdBulanan: m(0, 0, 0, 0, 0, 0, 0, 0, 1127178000, 0, 17059000, 43869000),
    realisasiAwal: m(0, 0, 0, 0, 0, 0, 0, 0, 1127178000, 0, 0, 0),
    items: [
      { deskripsi: 'Honor petugas lapangan sensus', volume: 234, satuan: 'OB', hargaSatuan: 4817000, jumlah: 1127178000 },
      { deskripsi: 'honor petugas lapangan sensus (PES)', volume: 7, satuan: 'OB', hargaSatuan: 4817000, jumlah: 33719000 },
      { deskripsi: 'Honor pengolahan peta (Wilkerstat)', volume: 7, satuan: 'OB', hargaSatuan: 2437000, jumlah: 17059000 },
      { deskripsi: 'honor pemeriksa lapangan sensus (PES)', volume: 2, satuan: 'OB', hargaSatuan: 5075000, jumlah: 10150000 }
    ]
  },
  {
    id: '2902.FAN.ZZ1-051-524114',
    programKode: '054.01.GG',
    programNama: 'Program Penyediaan dan Pelayanan Informasi Statistik',
    kegiatanKode: '2902',
    kegiatanNama: 'Penyediaan dan Pengembangan Statistik Distribusi (Sensus Ekonomi 2026)',
    outputKode: '2902.FAN.ZZ1',
    outputNama: 'Pemenuhan Prioritas Direktif Presiden (SE2026)',
    komponenKode: '051',
    komponenNama: 'SENSUS EKONOMI 2026',
    subKomponen: 'B - PELATIHAN PETUGAS SE2026',
    timKerja: 'Distribusi',
    kodeAkun: '524114',
    namaAkun: 'Belanja Perjalanan Dinas Paket Meeting Dalam Kota',
    sumberDana: 'RM',
    pagu: 715181000,
    rpdBulanan: m(0, 0, 0, 0, 0, 715180000, 0, 0, 0, 0, 0, 0),
    realisasiAwal: m(0, 0, 0, 0, 0, 715180000, 0, 0, 0, 0, 0, 0),
    items: [
      { deskripsi: 'Paket Meeting Fullboard pelatihan petugas pendataan', volume: 1878, satuan: 'OP', hargaSatuan: 380821, jumlah: 715181000 }
    ]
  },

  // --- 2903: Statistik Harga (Distribusi) ---
  {
    id: '2903.BMA.009-005-521213',
    programKode: '054.01.GG',
    programNama: 'Program Penyediaan dan Pelayanan Informasi Statistik',
    kegiatanKode: '2903',
    kegiatanNama: 'Penyediaan dan Pengembangan Statistik Harga',
    outputKode: '2903.BMA.009',
    outputNama: 'PUBLIKASI/LAPORAN STATISTIK HARGA',
    komponenKode: '005',
    komponenNama: 'Dukungan Penyelenggaraan Tugas dan Fungsi Unit',
    subKomponen: 'A - TANPA SUB KOMPONEN',
    timKerja: 'Distribusi',
    kodeAkun: '521213',
    namaAkun: 'Belanja Honor Output Kegiatan',
    sumberDana: 'RM',
    pagu: 66907000,
    rpdBulanan: m(0, 8672000, 5205000, 5205000, 7371000, 5205000, 3903000, 1743000, 1743000, 7716000, 7716000, 12426000),
    realisasiAwal: m(0, 8672000, 5205000, 5205000, 7371000, 5205000, 3903000, 1743000, 1743000, 5493000, 0, 0),
    items: [
      { deskripsi: 'Honor petugas pendataan lapangan Survei Harga Kemahalan Konstruksi', volume: 154, satuan: 'DOK', hargaSatuan: 57000, jumlah: 8778000 },
      { deskripsi: 'Honor petugas pendataan lapangan Survei Harga Konsumen Perdesaan (HKD)', volume: 150, satuan: 'DOK', hargaSatuan: 64000, jumlah: 9600000 },
      { deskripsi: 'Honor petugas pendataan lapangan Survei Harga Perdagangan Besar', volume: 194, satuan: 'DOK', hargaSatuan: 48000, jumlah: 9312000 },
      { deskripsi: 'Honor petugas pendataan lapangan Survei Harga Produsen Perdesaan (HD)', volume: 294, satuan: 'DOK', hargaSatuan: 53000, jumlah: 15582000 },
      { deskripsi: 'Honor petugas pendataan lapangan Survei Harga Produsen (HP/HPT/HPJ)', volume: 474, satuan: 'DOK', hargaSatuan: 49500, jumlah: 23635000 }
    ]
  },
  {
    id: '2903.BMA.008-005-521213',
    programKode: '054.01.GG',
    programNama: 'Program Penyediaan dan Pelayanan Informasi Statistik',
    kegiatanKode: '2903',
    kegiatanNama: 'Penyediaan dan Pengembangan Statistik Harga',
    outputKode: '2903.BMA.008',
    outputNama: 'Survei Penyempurnaan Diagram Timbang NTP (SPDT NTP)',
    komponenKode: '005',
    komponenNama: 'Dukungan Penyelenggaraan Tugas dan Fungsi Unit',
    subKomponen: 'A - TANPA SUB KOMPONEN',
    timKerja: 'Distribusi',
    kodeAkun: '521213',
    namaAkun: 'Belanja Honor Output Kegiatan',
    sumberDana: 'RM',
    pagu: 121310000,
    rpdBulanan: m(0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 103370000, 17940000),
    realisasiAwal: m(),
    items: [
      { deskripsi: 'Honor petugas pendataan lapangan SPDT NTP', volume: 690, satuan: 'Dok', hargaSatuan: 128000, jumlah: 88320000 },
      { deskripsi: 'Honor petugas pemeriksaan lapangan SPDT NTP', volume: 350, satuan: 'Dok', hargaSatuan: 43000, jumlah: 15050000 },
      { deskripsi: 'Honor petugas pengolahan SPDT NTP (2 semester)', volume: 690, satuan: 'Dok', hargaSatuan: 26000, jumlah: 17940000 }
    ]
  },

  // --- 2905: Kependudukan & Ketenagakerjaan - Sakernas (Sosial) ---
  {
    id: '2905.BMA.004-005-521213',
    programKode: '054.01.GG',
    programNama: 'Program Penyediaan dan Pelayanan Informasi Statistik',
    kegiatanKode: '2905',
    kegiatanNama: 'Penyediaan dan Pengembangan Statistik Kependudukan dan Ketenagakerjaan',
    outputKode: '2905.BMA.004',
    outputNama: 'PUBLIKASI/LAPORAN SURVEI ANGKATAN KERJA NASIONAL (SAKERNAS)',
    komponenKode: '005',
    komponenNama: 'Dukungan Penyelenggaraan Tugas dan Fungsi Unit',
    subKomponen: 'A - SAKERNAS FEBRUARI & AGUSTUS',
    timKerja: 'Sosial',
    kodeAkun: '521213',
    namaAkun: 'Belanja Honor Output Kegiatan',
    sumberDana: 'RM',
    pagu: 66920000,
    rpdBulanan: m(0, 0, 11584000, 0, 0, 0, 0, 0, 46171000, 0, 0, 0),
    realisasiAwal: m(0, 0, 11584000, 0, 0, 0, 0, 0, 46171000, 0, 0, 0),
    items: [
      { deskripsi: 'honor petugas pendataan lapangan Sakernas Februari', volume: 160, satuan: 'RUTA', hargaSatuan: 55000, jumlah: 8800000 },
      { deskripsi: 'honor petugas pendataan lapangan Sakernas Agustus', volume: 640, satuan: 'RUTA', hargaSatuan: 55000, jumlah: 35200000 },
      { deskripsi: 'honor updating listing BS Sakernas Feb & Agt', volume: 80, satuan: 'EA', hargaSatuan: 174000, jumlah: 13920000 },
      { deskripsi: 'honor pemeriksaan lapangan Sakernas Agustus non organik', volume: 440, satuan: 'RUTA', hargaSatuan: 20455, jumlah: 9000000 }
    ]
  },

  // --- 2906: Statistik Kesejahteraan Rakyat - Susenas & Seruti (Sosial) ---
  {
    id: '2906.BMA.006-005-521213',
    programKode: '054.01.GG',
    programNama: 'Program Penyediaan dan Pelayanan Informasi Statistik',
    kegiatanKode: '2906',
    kegiatanNama: 'Penyediaan dan Pengembangan Statistik Kesejahteraan Rakyat',
    outputKode: '2906.BMA.006',
    outputNama: 'PUBLIKASI/LAPORAN SURVEI SOSIAL EKONOMI NASIONAL (SUSENAS)',
    komponenKode: '005',
    komponenNama: 'Dukungan Penyelenggaraan Tugas dan Fungsi Unit',
    subKomponen: 'A - TANPA SUB KOMPONEN',
    timKerja: 'Sosial',
    kodeAkun: '521213',
    namaAkun: 'Belanja Honor Output Kegiatan',
    sumberDana: 'RM',
    pagu: 247923000,
    rpdBulanan: m(0, 0, 155459000, 0, 0, 0, 23840000, 0, 0, 44315000, 0, 23840000),
    realisasiAwal: m(0, 0, 155459000, 0, 0, 0, 23840000, 0, 0, 44315000, 0, 0),
    items: [
      { deskripsi: 'honor petugas pendataan & pengolahan Susenas Maret', volume: 748, satuan: 'RUTA', hargaSatuan: 154000, jumlah: 115192000 },
      { deskripsi: 'honor petugas updating listing & pemeriksaan Susenas Maret', volume: 251, satuan: 'DOK', hargaSatuan: 83036, jumlah: 20842000 },
      { deskripsi: 'honor petugas pendataan & pengolahan Susenas September', volume: 160, satuan: 'RUTA', hargaSatuan: 154000, jumlah: 24640000 },
      { deskripsi: 'honor petugas pendataan & pengolahan Seruti (TW 1-4)', volume: 640, satuan: 'RUTA', hargaSatuan: 126952, jumlah: 81280000 },
      { deskripsi: 'honor updating Susenas September', volume: 32, satuan: 'DOK', hargaSatuan: 186531, jumlah: 5969000 }
    ]
  },
  {
    id: '2906.BMA.006-005-524113',
    programKode: '054.01.GG',
    programNama: 'Program Penyediaan dan Pelayanan Informasi Statistik',
    kegiatanKode: '2906',
    kegiatanNama: 'Penyediaan dan Pengembangan Statistik Kesejahteraan Rakyat',
    outputKode: '2906.BMA.006',
    outputNama: 'PUBLIKASI/LAPORAN SURVEI SOSIAL EKONOMI NASIONAL (SUSENAS)',
    komponenKode: '005',
    komponenNama: 'Dukungan Penyelenggaraan Tugas dan Fungsi Unit',
    subKomponen: 'A - TANPA SUB KOMPONEN',
    timKerja: 'Sosial',
    kodeAkun: '524113',
    namaAkun: 'Belanja Perjalanan Dinas Dalam Kota',
    sumberDana: 'RM',
    pagu: 58056000,
    rpdBulanan: m(0, 0, 37040000, 0, 0, 0, 3840000, 0, 0, 6460000, 3810000, 6906000),
    realisasiAwal: m(0, 0, 37040000, 0, 0, 0, 3840000, 0, 0, 0, 0, 0),
    items: [
      { deskripsi: 'transport lokal petugas pendataan & pemeriksaan Susenas Maret', volume: 192, satuan: 'OKali', hargaSatuan: 168000, jumlah: 32230000 },
      { deskripsi: 'transport lokal pencacahan & pemeriksaan Susenas September', volume: 67, satuan: 'OKali', hargaSatuan: 162000, jumlah: 11390000 },
      { deskripsi: 'transport lokal petugas pendataan & pemeriksaan Seruti TW 1-4', volume: 69, satuan: 'OKali', hargaSatuan: 150000, jumlah: 10356000 },
      { deskripsi: 'transport lokal pencacahan rentang harga Susenas Maret', volume: 24, satuan: 'OKali', hargaSatuan: 170000, jumlah: 4080000 }
    ]
  },

  // --- 2910 & 8130: Statistik Tanaman Pangan & Sumber Daya Hayati - KSA/Ubinan (Produksi) ---
  {
    id: '2910.BMA.007-005-521213',
    programKode: '054.01.GG',
    programNama: 'Program Penyediaan dan Pelayanan Informasi Statistik',
    kegiatanKode: '2910',
    kegiatanNama: 'Penyediaan dan Pengembangan Statistik Tanaman Pangan, Hortikultura, dan Perkebunan',
    outputKode: '2910.BMA.007',
    outputNama: 'PUBLIKASI/ LAPORAN STATISTIK TANAMAN PANGAN (KSA & UBINAN)',
    komponenKode: '005',
    komponenNama: 'Dukungan Penyelenggaraan Tugas dan Fungsi Unit',
    subKomponen: 'A - TANPA SUB KOMPONEN',
    timKerja: 'Produksi',
    kodeAkun: '521213',
    namaAkun: 'Belanja Honor Output Kegiatan',
    sumberDana: 'RM',
    pagu: 96410000,
    rpdBulanan: m(0, 16960000, 27004000, 16960000, 18526000, 16960000, 0, 0, 0, 0, 0, 0),
    realisasiAwal: m(0, 16960000, 27004000, 16960000, 18526000, 16960000, 0, 0, 0, 0, 0, 0),
    items: [
      { deskripsi: 'honor petugas pendataan lapangan KSA Padi', volume: 720, satuan: 'SGMN', hargaSatuan: 110000, jumlah: 79200000 },
      { deskripsi: 'honor petugas pendataan lapangan KSA Jagung', volume: 100, satuan: 'SGMN', hargaSatuan: 56000, jumlah: 5600000 },
      { deskripsi: 'honor petugas pendataan ubinan padi & palawija', volume: 133, satuan: 'DOK', hargaSatuan: 87293, jumlah: 11610000 }
    ]
  },
  {
    id: '8130.BMA.007-005-521213',
    programKode: '054.01.GG',
    programNama: 'Program Penyediaan dan Pelayanan Informasi Statistik',
    kegiatanKode: '8130',
    kegiatanNama: 'Penyediaan dan Pengembangan Statistik Sumber Daya Hayati',
    outputKode: '8130.BMA.007',
    outputNama: 'PUBLIKASI/ LAPORAN STATISTIK TANAMAN PANGAN (SEMESTER II)',
    komponenKode: '005',
    komponenNama: 'Dukungan Penyelenggaraan Tugas dan Fungsi Unit',
    subKomponen: 'A - TANPA SUB KOMPONEN',
    timKerja: 'Produksi',
    kodeAkun: '521213',
    namaAkun: 'Belanja Honor Output Kegiatan',
    sumberDana: 'RM',
    pagu: 147411000,
    rpdBulanan: m(0, 0, 0, 0, 0, 2673000, 16960000, 16960000, 26842000, 16960000, 16960000, 50056000),
    realisasiAwal: m(0, 0, 0, 0, 0, 2673000, 16960000, 16960000, 26842000, 16960000, 0, 0),
    items: [
      { deskripsi: 'honor petugas pendataan lapangan KSA Padi (Sem II)', volume: 1008, satuan: 'SGMN', hargaSatuan: 110000, jumlah: 110880000 },
      { deskripsi: 'honor petugas pendataan lapangan KSA Jagung (Sem II)', volume: 140, satuan: 'SGMN', hargaSatuan: 56000, jumlah: 7840000 },
      { deskripsi: 'honor petugas pendataan ubinan padi & palawija (Sem II)', volume: 336, satuan: 'DOK', hargaSatuan: 85390, jumlah: 28691000 }
    ]
  },

  // =========================================================================
  // PROGRAM 054.01.WA : Program Dukungan Manajemen (Bagian Umum)
  // =========================================================================
  {
    id: '2886.EBA.994-001-511111',
    programKode: '054.01.WA',
    programNama: 'Program Dukungan Manajemen',
    kegiatanKode: '2886',
    kegiatanNama: 'Dukungan Manajemen dan Pelaksanaan Tugas Teknis Lainnya BPS Provinsi',
    outputKode: '2886.EBA.994',
    outputNama: 'Layanan Perkantoran',
    komponenKode: '001',
    komponenNama: 'Gaji dan Tunjangan',
    subKomponen: 'A - TANPA SUB KOMPONEN',
    timKerja: 'Umum',
    kodeAkun: '511111',
    namaAkun: 'Belanja Gaji Pokok PNS',
    sumberDana: 'RM',
    pagu: 1110680000,
    rpdBulanan: m(78131980, 78926920, 158018740, 83795740, 81567180, 163134360, 82624980, 77375760, 77375760, 77626360, 75631760, 75531760),
    realisasiAwal: m(78131980, 78926920, 158018740, 83795740, 81567180, 163134360, 82624980, 77375760, 77375760, 77626360, 0, 0),
    items: [
      { deskripsi: 'Belanja Gaji Pokok PNS (Induk)', volume: 1, satuan: 'THN', hargaSatuan: 950000000, jumlah: 950000000 },
      { deskripsi: 'Belanja Gaji Pokok PNS (13)', volume: 1, satuan: 'BLN', hargaSatuan: 81750000, jumlah: 81750000 },
      { deskripsi: 'Belanja Gaji Pokok PNS (14)', volume: 1, satuan: 'BLN', hargaSatuan: 78930000, jumlah: 78930000 }
    ]
  },
  {
    id: '2886.EBA.994-001-512411',
    programKode: '054.01.WA',
    programNama: 'Program Dukungan Manajemen',
    kegiatanKode: '2886',
    kegiatanNama: 'Dukungan Manajemen dan Pelaksanaan Tugas Teknis Lainnya BPS Provinsi',
    outputKode: '2886.EBA.994',
    outputNama: 'Layanan Perkantoran',
    komponenKode: '001',
    komponenNama: 'Gaji dan Tunjangan',
    subKomponen: 'A - TANPA SUB KOMPONEN',
    timKerja: 'Umum',
    kodeAkun: '512411',
    namaAkun: 'Belanja Pegawai (Tunjangan Kinerja PNS)',
    sumberDana: 'RM',
    pagu: 1482000000,
    rpdBulanan: m(103679904, 104669176, 212408471, 101989356, 109293826, 213397544, 102266360, 107019504, 108008205, 106503130, 106261394, 106503130),
    realisasiAwal: m(103679904, 104669176, 212408471, 101989356, 109293826, 213397544, 102266360, 107019504, 108008205, 106503130, 0, 0),
    items: [
      { deskripsi: 'Tunjangan Kinerja PNS 12 Bulan + 13 + 14', volume: 1, satuan: 'THN', hargaSatuan: 1482000000, jumlah: 1482000000 }
    ]
  },
  {
    id: '2886.EBA.994-001-511129',
    programKode: '054.01.WA',
    programNama: 'Program Dukungan Manajemen',
    kegiatanKode: '2886',
    kegiatanNama: 'Dukungan Manajemen dan Pelaksanaan Tugas Teknis Lainnya BPS Provinsi',
    outputKode: '2886.EBA.994',
    outputNama: 'Layanan Perkantoran',
    komponenKode: '001',
    komponenNama: 'Gaji dan Tunjangan',
    subKomponen: 'A - TANPA SUB KOMPONEN',
    timKerja: 'Umum',
    kodeAkun: '511129',
    namaAkun: 'Belanja Uang Makan PNS',
    sumberDana: 'RM',
    pagu: 194990000,
    rpdBulanan: m(13364000, 13933000, 13812000, 13795000, 16983000, 10853000, 12197000, 18562000, 15067000, 17754000, 16000000, 32670000),
    realisasiAwal: m(13364000, 13933000, 13812000, 13795000, 16983000, 10853000, 12197000, 18562000, 15067000, 17754000, 0, 0),
    items: [
      { deskripsi: 'Uang Makan PNS', volume: 1, satuan: 'THN', hargaSatuan: 194990000, jumlah: 194990000 }
    ]
  },
  {
    id: '2886.EBA.994-001-511611',
    programKode: '054.01.WA',
    programNama: 'Program Dukungan Manajemen',
    kegiatanKode: '2886',
    kegiatanNama: 'Dukungan Manajemen dan Pelaksanaan Tugas Teknis Lainnya BPS Provinsi',
    outputKode: '2886.EBA.994',
    outputNama: 'Layanan Perkantoran',
    komponenKode: '001',
    komponenNama: 'Gaji dan Tunjangan',
    subKomponen: 'A - TANPA SUB KOMPONEN',
    timKerja: 'Umum',
    kodeAkun: '511611',
    namaAkun: 'Belanja Gaji Pokok & Tunkin PPPK + Tunjangan Lainnya',
    sumberDana: 'RM',
    pagu: 807755000,
    rpdBulanan: m(48616400, 49979768, 107637317, 68613706, 49647689, 113546508, 73136730, 48810139, 48363422, 68455036, 47969458, 81949110),
    realisasiAwal: m(48616400, 49979768, 107637317, 68613706, 49647689, 113546508, 73136730, 48810139, 48362822, 69419536, 0, 0),
    items: [
      { deskripsi: 'Gaji & Tunjangan PPPK, Tunj. Fungsional, Struktural, PPh & Lembur PNS', volume: 1, satuan: 'THN', hargaSatuan: 807755000, jumlah: 807755000 }
    ]
  },
  {
    id: '2886.EBA.994-002-521111',
    programKode: '054.01.WA',
    programNama: 'Program Dukungan Manajemen',
    kegiatanKode: '2886',
    kegiatanNama: 'Dukungan Manajemen dan Pelaksanaan Tugas Teknis Lainnya BPS Provinsi',
    outputKode: '2886.EBA.994',
    outputNama: 'Layanan Perkantoran',
    komponenKode: '002',
    komponenNama: 'Operasional dan Pemeliharaan Kantor',
    subKomponen: 'A - TANPA SUB KOMPONEN',
    timKerja: 'Umum',
    kodeAkun: '521111',
    namaAkun: 'Belanja Keperluan Perkantoran',
    sumberDana: 'RM',
    pagu: 37668000,
    rpdBulanan: m(6573000, 3631800, 142000, 1926000, 480000, 100000, 1031000, 4696000, 730000, 5000000, 5000000, 6051000),
    realisasiAwal: m(6573000, 3631800, 142000, 1926000, 480000, 100000, 1031000, 4696000, 730000, 100000, 0, 0),
    items: [
      { deskripsi: 'Keperluan sehari-hari perkantoran, Zoom, Google Drive, Canva Pro & Pengiriman Surat', volume: 1, satuan: 'THN', hargaSatuan: 37668000, jumlah: 37668000 }
    ]
  },
  {
    id: '2886.EBA.994-002-521115',
    programKode: '054.01.WA',
    programNama: 'Program Dukungan Manajemen',
    kegiatanKode: '2886',
    kegiatanNama: 'Dukungan Manajemen dan Pelaksanaan Tugas Teknis Lainnya BPS Provinsi',
    outputKode: '2886.EBA.994',
    outputNama: 'Layanan Perkantoran',
    komponenKode: '002',
    komponenNama: 'Operasional dan Pemeliharaan Kantor',
    subKomponen: 'A - TANPA SUB KOMPONEN',
    timKerja: 'Umum',
    kodeAkun: '521115',
    namaAkun: 'Belanja Honor Operasional Satuan Kerja',
    sumberDana: 'RM',
    pagu: 63500000,
    rpdBulanan: m(0, 4370000, 4370000, 4370000, 4370000, 4370000, 3190000, 6310000, 6310000, 6910000, 6310000, 12620000),
    realisasiAwal: m(0, 4370000, 4370000, 4370000, 4370000, 4370000, 3190000, 6310000, 6310000, 6310000, 0, 0),
    items: [
      { deskripsi: 'Honor KPA, PPK, PPSPM, Bendahara, Pejabat Pengadaan & Pengelola SAI', volume: 12, satuan: 'O-B', hargaSatuan: 5291667, jumlah: 63500000 }
    ]
  },
  {
    id: '2886.EBA.994-002-522111',
    programKode: '054.01.WA',
    programNama: 'Program Dukungan Manajemen',
    kegiatanKode: '2886',
    kegiatanNama: 'Dukungan Manajemen dan Pelaksanaan Tugas Teknis Lainnya BPS Provinsi',
    outputKode: '2886.EBA.994',
    outputNama: 'Layanan Perkantoran',
    komponenKode: '002',
    komponenNama: 'Operasional dan Pemeliharaan Kantor',
    subKomponen: 'A - TANPA SUB KOMPONEN',
    timKerja: 'Umum',
    kodeAkun: '522111',
    namaAkun: 'Belanja Langganan Listrik, Air, Telepon & Internet',
    sumberDana: 'RM',
    pagu: 105337000,
    rpdBulanan: m(7377310, 7629942, 7329573, 6764216, 7980380, 8060347, 8033736, 9012974, 8966351, 9066523, 11066523, 10995125),
    realisasiAwal: m(7377310, 7629942, 7329573, 6764216, 7980380, 8060347, 8033736, 9012974, 8966351, 8566117, 0, 0),
    items: [
      { deskripsi: 'Biaya langganan listrik, telepon, air & koneksi internet kantor', volume: 1, satuan: 'THN', hargaSatuan: 105337000, jumlah: 105337000 }
    ]
  },
  {
    id: '2886.EBA.994-002-522191',
    programKode: '054.01.WA',
    programNama: 'Program Dukungan Manajemen',
    kegiatanKode: '2886',
    kegiatanNama: 'Dukungan Manajemen dan Pelaksanaan Tugas Teknis Lainnya BPS Provinsi',
    outputKode: '2886.EBA.994',
    outputNama: 'Layanan Perkantoran',
    komponenKode: '002',
    komponenNama: 'Operasional dan Pemeliharaan Kantor',
    subKomponen: 'A - TANPA SUB KOMPONEN',
    timKerja: 'Umum',
    kodeAkun: '522191',
    namaAkun: 'Belanja Jasa Lainnya (Manajemen Building & MCU)',
    sumberDana: 'RM',
    pagu: 147451000,
    rpdBulanan: m(0, 8668523, 8668523, 18127445, 17337046, 8668523, 8668523, 8668523, 8668523, 8668523, 33043523, 8668523),
    realisasiAwal: m(0, 8668523, 8668523, 18127445, 17337046, 8668523, 8668523, 8668523, 8668523, 0, 17337046, 0),
    items: [
      { deskripsi: 'Biaya Jasa Manajemen Building (Pramubakti/Satpam/Kebersihan)', volume: 1, satuan: 'Paket', hargaSatuan: 123076000, jumlah: 123076000 },
      { deskripsi: 'Medical Check Up Pegawai', volume: 25, satuan: 'Paket', hargaSatuan: 975000, jumlah: 24375000 }
    ]
  },
  {
    id: '2886.EBA.994-002-523111',
    programKode: '054.01.WA',
    programNama: 'Program Dukungan Manajemen',
    kegiatanKode: '2886',
    kegiatanNama: 'Dukungan Manajemen dan Pelaksanaan Tugas Teknis Lainnya BPS Provinsi',
    outputKode: '2886.EBA.994',
    outputNama: 'Layanan Perkantoran',
    komponenKode: '002',
    komponenNama: 'Operasional dan Pemeliharaan Kantor',
    subKomponen: 'A - TANPA SUB KOMPONEN',
    timKerja: 'Umum',
    kodeAkun: '523111',
    namaAkun: 'Belanja Pemeliharaan Gedung, Peralatan & Kendaraan',
    sumberDana: 'RM',
    pagu: 174247000,
    rpdBulanan: m(22715600, 12496400, 5340779, 2983000, 2152000, 4007000, 3679000, 1131735, 15116806, 7390000, 34187000, 18737000),
    realisasiAwal: m(22715600, 12496400, 5340779, 2983000, 2152000, 4007000, 3679000, 1131735, 15116806, 950000, 0, 0),
    items: [
      { deskripsi: 'Pemeliharaan gedung kantor bertingkat & halaman', volume: 1, satuan: 'THN', hargaSatuan: 85168000, jumlah: 85168000 },
      { deskripsi: 'Pemeliharaan kendaraan operasional, AC, PC, Printer & UPS', volume: 1, satuan: 'THN', hargaSatuan: 89079000, jumlah: 89079000 }
    ]
  },
  {
    id: '2886.EBA.994-002-521811',
    programKode: '054.01.WA',
    programNama: 'Program Dukungan Manajemen',
    kegiatanKode: '2886',
    kegiatanNama: 'Dukungan Manajemen dan Pelaksanaan Tugas Teknis Lainnya BPS Provinsi',
    outputKode: '2886.EBA.994',
    outputNama: 'Layanan Perkantoran',
    komponenKode: '002',
    komponenNama: 'Operasional dan Pemeliharaan Kantor',
    subKomponen: 'A - TANPA SUB KOMPONEN',
    timKerja: 'Umum',
    kodeAkun: '521811',
    namaAkun: 'Belanja Barang Persediaan Barang Konsumsi (ATK & CS)',
    sumberDana: 'RM',
    pagu: 134891000,
    rpdBulanan: m(0, 12253500, 1815000, 1525000, 0, 0, 7475000, 0, 0, 7300000, 63636523, 28592500),
    realisasiAwal: m(0, 12253500, 1815000, 1525000, 0, 0, 7475000, 0, 0, 0, 0, 0),
    items: [
      { deskripsi: 'Pengadaan ATK, Computer Supplies, Seragam Pegawai & Kursi Kerja', volume: 1, satuan: 'THN', hargaSatuan: 134891000, jumlah: 134891000 }
    ]
  }
];

/**
 * Helper pemetaan kategori Tim Kerja otomatis berdasarkan kode kegiatan SAKTI
 */
export function detectTimKerjaByKegiatan(kegiatanKode, text = '') {
  const k = String(kegiatanKode || '');
  const t = String(text || '').toLowerCase();

  if (k === '2886') return 'Umum';
  if (k === '2896' || k === '2898' || k === '2899') return 'Nerwilis';
  if (k === '2897' || k === '2900' || k === '2901') return 'IPDS';
  if (k === '2902' || k === '2903' || k === '2908') return 'Distribusi';
  if (k === '2904' || k === '2909' || k === '2910' || k === '8130' || k === '8131') return 'Produksi';
  if (k === '2905' || k === '2906' || k === '2907') return 'Sosial';

  if (t.includes('susenas') || t.includes('sakernas') || t.includes('podes') || t.includes('sosial')) return 'Sosial';
  if (t.includes('se2026') || t.includes('sensus ekonomi') || t.includes('harga') || t.includes('jasa') || t.includes('distribusi')) return 'Distribusi';
  if (t.includes('ksa') || t.includes('ubinan') || t.includes('pertanian') || t.includes('industri') || t.includes('produksi')) return 'Produksi';
  if (t.includes('neraca') || t.includes('pdrb') || t.includes('sklnp')) return 'Nerwilis';
  if (t.includes('infrastruktur') || t.includes('sektoral') || t.includes('diseminasi') || t.includes('big data')) return 'IPDS';

  return 'Umum';
}
