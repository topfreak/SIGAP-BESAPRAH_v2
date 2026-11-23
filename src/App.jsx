import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import MainLayout from './components/layout/MainLayout';

// Pages
import LandingPage from './pages/LandingPage';
import LoginPage from './pages/LoginPage';
import DashboardPage from './pages/DashboardPage';
import ProfilePage from './pages/ProfilePage';
import DaftarSPJPage from './pages/DaftarSPJPage';
import FormSPJPage from './pages/FormSPJPage';
import DetailSPJPage from './pages/DetailSPJPage';
import PanduanAlurPage from './pages/PanduanAlurPage';
import PanduanAkunPage from './pages/PanduanAkunPage';
import KalkulatorPajakPage from './pages/KalkulatorPajakPage';
import SuratTugasPage from './pages/SuratTugasPage';
import LaporanPerjadinPage from './pages/LaporanPerjadinPage';
import KalenderPerjadinPage from './pages/KalenderPerjadinPage';
import MatriksPerjadinPage from './pages/MatriksPerjadinPage';
import MonitoringMitraPage from './pages/MonitoringMitraPage';
import RekapitulasiPage from './pages/RekapitulasiPage';
import LacakBerkasPage from './pages/LacakBerkasPage';
import MasterPegawaiPage from './pages/MasterPegawaiPage';
import MasterWilayahPage from './pages/MasterWilayahPage';
import MasterAkunPage from './pages/MasterAkunPage';
import PengaturanPage from './pages/PengaturanPage';

export default function App() {
  return (
    <Routes>
      {/* Public Pages */}
      <Route path="/" element={<LandingPage />} />
      <Route path="/login" element={<LoginPage />} />

      {/* Main Authenticated Layout with Sidebar and Topbar */}
      <Route element={<MainLayout />}>
        <Route path="/dashboard" element={<DashboardPage />} />
        <Route path="/profile" element={<ProfilePage />} />
        
        {/* Administrasi & SPJ */}
        <Route path="/pengajuan-spj" element={<DaftarSPJPage />} />
        <Route path="/pengajuan-spj/baru" element={<FormSPJPage />} />
        <Route path="/pengajuan-spj/:id" element={<DetailSPJPage />} />
        <Route path="/panduan-alur" element={<PanduanAlurPage />} />
        <Route path="/panduan-akun" element={<PanduanAkunPage />} />
        <Route path="/kalkulator-pajak" element={<KalkulatorPajakPage />} />

        {/* Surat Tugas & Perjadin */}
        <Route path="/surat-tugas" element={<SuratTugasPage />} />
        <Route path="/laporan-perjadin" element={<LaporanPerjadinPage />} />
        <Route path="/kalender-perjadin" element={<KalenderPerjadinPage />} />
        <Route path="/matriks-perjadin" element={<MatriksPerjadinPage />} />

        {/* Monitoring & Laporan */}
        <Route path="/monitoring-mitra" element={<MonitoringMitraPage />} />
        <Route path="/rekapitulasi" element={<RekapitulasiPage />} />
        <Route path="/lacak" element={<LacakBerkasPage />} />

        {/* Master Data & Sistem */}
        <Route path="/pegawai" element={<MasterPegawaiPage />} />
        <Route path="/master-wilayah" element={<MasterWilayahPage />} />
        <Route path="/master-akun" element={<MasterAkunPage />} />
        <Route path="/pengaturan" element={<PengaturanPage />} />
      </Route>

      {/* Fallback */}
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}
