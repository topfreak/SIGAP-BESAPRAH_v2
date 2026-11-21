# SIGAP-BESAPRAH_v2
### *Sistem Integrasi dan Gerakan Administrasi Pertanggungjawaban yang Rapi dan Akuntabel*
> **Tagline**: *“Bersaprah dalam Kerja, Sepakat dalam Akuntabilitas.”*  
**Badan Pusat Statistik (BPS) Kabupaten Sambas, Kalimantan Barat**

---

## 📖 Tentang Aplikasi
**SIGAP BESAPRAH** adalah website pemantauan dan tata kelola Surat Pertanggungjawaban (SPJ) serta administrasi keuangan di lingkungan BPS Kabupaten Sambas. Sistem ini mengadopsi tradisi luhur Melayu Sambas **"Besaprah"** yang bermakna kebersamaan, keterbukaan, kesetaraan, dan ketertiban.

### ✨ Fitur Unggulan
1. **📍 Pelacakan Posisi Meja Berkas Real-Time**:
   - 🗄️ **Meja PPK** (Peninjauan komitmen anggaran & persetujuan)
   - ⚖️ **Meja PPSPM** (Pengujian pembayaran & penerbitan SPM)
   - 💼 **Meja Bendahara** (Pencairan dana & transfer CMS Bank)
   - 📝 **Meja PJ Kegiatan (Revisi)** (Dokumen dikembalikan untuk dilengkapi/diperbaiki)
   - 🏛️ **Meja Arsip Keuangan (Cair)** (Lunas / SP2D KPPN terbit)
2. **🖥️ Tampilan Tabel Pas Layar (100% Fit-to-Screen)**:
   - Dirancang tanpa scrollbar horizontal samping agar seluruh data (No SPM, Uraian, Posisi Meja, PJ, Nilai Netto, Kelengkapan, dan Aksi) langsung terlihat rapi di layar.
   - Pilihan mode: **Tabel Fit Screen** dan **Kartu Ringkas**.
3. **👑 Sistem Hak Akses Berlapis (Role-Based Access Control)**:
   - **Superadmin**: Akses penuh (100%) ke seluruh data, modul, master data, dan persetujuan.
   - **PPK / PPSPM / Bendahara / PJ Kegiatan / Pegawai**: Menu dan tombol aksi dibatasi otomatis sesuai tupoksi masing-masing.
4. **🧮 Kalkulator Pajak Otomatis (Tax Engine)**:
   - Perhitungan otomatis PPN 11% / 1%, PPh 21 (PNS Gol IV/III/II, Mitra PTKP Rp 4,5 jt), PPh 22, PPh 23, PPh 4(2), dan meterai Rp 10.000.
5. **🔍 Rekon Dokumen Lapangan**:
   - Pelacakan detail kekurangan fisik per petugas lapangan dan kecamatan (visum belum berstempel desa, BAST belum discan, kekurangan SLS).
6. **📋 Panduan Kelengkapan 14 Kode Akun Belanja**:
   - Matriks syarat berkas lengkap untuk akun 521211 hingga 532111.
7. **📈 Ekspor Excel Otomatis**:
   - Format ekspor rekapitulasi 100% sesuai format resmi penatausahaan SPJ Proses 2026.

---

## 🛠️ Teknologi
- **Frontend**: Vite 6, React 18, Tailwind CSS, Lucide Icons
- **Database**: Supabase (PostgreSQL, Auth, Storage) via `@supabase/supabase-js`
- **Routing**: React Router v6 dengan URL path bersih (`/login`, `/dashboard`, `/pengajuan-spj`, dll)
- **Ekspor Data**: SheetJS (XLSX)

---

## 🚀 Panduan Menjalankan Proyek Lokal

1. **Clone repository**:
   ```bash
   git clone https://github.com/topfreak/SIGAP-BESAPRAH_v2.git
   cd SIGAP-BESAPRAH_v2
   ```

2. **Install dependensi**:
   ```bash
   npm install
   ```

3. **Jalankan local server**:
   ```bash
   npm run dev
   ```
   Buka [http://localhost:3000](http://localhost:3000) di browser Anda.

---

## 🗄️ Koneksi ke Database Supabase (Opsional)
Aplikasi dapat berjalan mandiri menggunakan *Local Storage*. Untuk menghubungkan ke database cloud Supabase:
1. Buat proyek di [supabase.com](https://supabase.com).
2. Salin isi file `supabase_schema.sql` dan jalankan di menu **SQL Editor** Supabase.
3. Masukkan `Project URL` dan `Anon Key` di menu **/pengaturan** website atau buat file `.env`:
   ```env
   VITE_SUPABASE_URL=https://<your-project>.supabase.co
   VITE_SUPABASE_ANON_KEY=<your-anon-key>
   ```

---
© 2026 Badan Pusat Statistik (BPS) Kabupaten Sambas, Kalimantan Barat.
