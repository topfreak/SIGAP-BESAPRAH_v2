-- =====================================================================
-- SKEMA DATABASE SUPABASE: SIGAP BESAPRAH
-- BPS KABUPATEN SAMBAS
-- Jalankan skema ini di menu SQL Editor pada Dashboard Supabase Anda
-- =====================================================================

-- 1. EXTENSION UUID
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- 2. TABEL PEGAWAI (25 Pegawai BPS Sambas + Superadmin + Kredensial Login)
CREATE TABLE IF NOT EXISTS pegawai (
    nip_baru VARCHAR(20) PRIMARY KEY,
    nip_lama VARCHAR(15),
    username VARCHAR(50) UNIQUE NOT NULL,
    password VARCHAR(255) NOT NULL DEFAULT 'bps6101',
    nama VARCHAR(150) NOT NULL,
    pangkat_golongan VARCHAR(50),
    jabatan VARCHAR(100),
    status_pegawai VARCHAR(20) DEFAULT 'PNS',
    role VARCHAR(30) DEFAULT 'pegawai', -- 'superadmin', 'kpa', 'ppk', 'ppspm', 'bendahara', 'verifikator', 'pj_kegiatan', 'pegawai'
    tim_kerja VARCHAR(50), -- 'Umum', 'Sosial', 'Produksi', 'Distribusi', 'Neraca', 'IPDS', 'Pimpinan'
    email VARCHAR(100) UNIQUE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Index username untuk performa query autentikasi
CREATE INDEX IF NOT EXISTS idx_pegawai_username ON pegawai(LOWER(username));

-- 3. TABEL MASTER KODE AKUN (MAK)
CREATE TABLE IF NOT EXISTS kode_akun (
    kode VARCHAR(10) PRIMARY KEY,
    nama_akun VARCHAR(150) NOT NULL,
    kategori_belanja VARCHAR(50),
    deskripsi TEXT
);

-- 4. TABEL SYARAT DOKUMEN KELENGKAPAN PER AKUN
CREATE TABLE IF NOT EXISTS syarat_dokumen_akun (
    id BIGSERIAL PRIMARY KEY,
    kode_akun VARCHAR(10) REFERENCES kode_akun(kode) ON DELETE CASCADE,
    sub_jenis VARCHAR(100),
    nama_dokumen VARCHAR(200) NOT NULL,
    is_wajib BOOLEAN DEFAULT TRUE,
    catatan_aturan TEXT
);

-- 5. TABEL UTAMA: PENGAJUAN & MONITORING SPJ
CREATE TABLE IF NOT EXISTS pengajuan_spj (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    no_pengajuan VARCHAR(50) UNIQUE NOT NULL,
    no_spm_spp VARCHAR(50),
    kategori_belanja VARCHAR(50) NOT NULL,
    kode_akun VARCHAR(10) REFERENCES kode_akun(kode),
    uraian_kegiatan TEXT NOT NULL,
    tim_kerja VARCHAR(50) NOT NULL,
    pj_kegiatan_nip VARCHAR(20) REFERENCES pegawai(nip_baru),
    pj_nama VARCHAR(150),
    pengaju_nip VARCHAR(20) REFERENCES pegawai(nip_baru),
    pengaju_nama VARCHAR(150),
    mekanisme_ls_gup VARCHAR(10) DEFAULT 'LS', -- 'LS' atau 'GUP'
    jumlah_pengeluaran NUMERIC(15,2) DEFAULT 0, -- Bruto
    jumlah_potongan NUMERIC(15,2) DEFAULT 0, -- Total Pajak
    jumlah_pembayaran NUMERIC(15,2) DEFAULT 0, -- Netto
    status_dokumen VARCHAR(40) DEFAULT 'Draft', -- 'Draft', 'Di PPK', 'Di PPSPM', 'Di Bendahara', 'Perlu Perbaikan', 'Selesai', 'Ditolak'
    posisi_dokumen VARCHAR(40) DEFAULT 'Di PPK',
    meja_berkas VARCHAR(100) DEFAULT 'Meja PPK (Peninjauan Komitmen)', -- Keterangan Meja Fisik/Digital
    kelengkapan_dokumen VARCHAR(30) DEFAULT 'BELUM LENGKAP', -- 'LENGKAP' / 'BELUM LENGKAP'
    tanggal_terima DATE DEFAULT CURRENT_DATE,
    tanggal_proses DATE,
    tanggal_sp2d DATE,
    catatan_kekurangan TEXT,
    review_ppk TEXT,
    review_ppspm TEXT,
    review_bdh TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 6. TABEL DETAIL BERKAS DOKUMEN DIGITAL (UPLOAD FILE)
CREATE TABLE IF NOT EXISTS dokumen_spj (
    id BIGSERIAL PRIMARY KEY,
    pengajuan_id UUID REFERENCES pengajuan_spj(id) ON DELETE CASCADE,
    nama_dokumen VARCHAR(200) NOT NULL,
    file_url TEXT,
    file_name VARCHAR(255),
    is_verified BOOLEAN DEFAULT FALSE,
    catatan_verifikator TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 7. TABEL REKONSILIASI KEKURANGAN LAPANGAN (PETUGAS / SLS)
CREATE TABLE IF NOT EXISTS rekon_kekurangan (
    id BIGSERIAL PRIMARY KEY,
    pengajuan_id UUID REFERENCES pengajuan_spj(id) ON DELETE SET NULL,
    nama_petugas VARCHAR(150) NOT NULL,
    kecamatan VARCHAR(100),
    jabatan_petugas VARCHAR(50) DEFAULT 'PCL',
    pj_kuda VARCHAR(150),
    kekurangan_sls INTEGER DEFAULT 0,
    dokumen_kurang TEXT, -- misal: 'Visum belum ditandatangani desa'
    is_selesai BOOLEAN DEFAULT FALSE,
    status VARCHAR(30) DEFAULT 'Belum Lengkap',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 8. TABEL LOG JEJAK ALUR (AUDIT TRAIL)
CREATE TABLE IF NOT EXISTS log_status_spj (
    id BIGSERIAL PRIMARY KEY,
    pengajuan_id UUID REFERENCES pengajuan_spj(id) ON DELETE CASCADE,
    meja_asal VARCHAR(100),
    meja_tujuan VARCHAR(100),
    status_tujuan VARCHAR(40),
    aktor_nip VARCHAR(20) REFERENCES pegawai(nip_baru),
    aktor_nama VARCHAR(150),
    catatan TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- STORAGE BUCKET UNTUK FILE DIGITAL SPJ
-- Buat bucket dengan nama 'spj-documents' di Supabase Storage
-- =====================================================================
