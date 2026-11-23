import React from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import { 
  LayoutDashboard, 
  Calendar, 
  Users2, 
  FileSpreadsheet, 
  FilePlus2, 
  FileCheck2, 
  BookOpenCheck, 
  Calculator, 
  FileText, 
  Car, 
  Coins, 
  Download, 
  Search, 
  UserSquare2, 
  MapPin, 
  Tags, 
  Settings,
  Sparkles,
  ChevronRight,
  ShieldCheck,
  Crown,
  Lock,
  UserCircle
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

export default function Sidebar() {
  const location = useLocation();
  const { transactions, rekonList, currentUser, canAccess } = useAuth();

  const countPerluRevisi = transactions.filter(t => t.status_dokumen === 'Perlu Perbaikan' || t.kelengkapan_dokumen === 'BELUM LENGKAP').length;
  const countRekonBelum = rekonList.filter(r => !r.is_selesai).length;

  const isSuperadmin = currentUser?.role === 'superadmin';

  const rawMenuGroups = [
    {
      group: "MAIN MENU",
      items: [
        { name: "Dasbor", path: "/dashboard", icon: LayoutDashboard },
        { name: "Profil & Keamanan Akun", path: "/profile", icon: UserCircle },
        { name: "Kalender Kegiatan & Perjadin", path: "/kalender-perjadin", icon: Calendar },
        { name: "Matriks & Rekap Perjadin", path: "/matriks-perjadin", icon: Users2 },
      ]
    },
    {
      group: "ADMINISTRASI & SPJ",
      items: [
        { 
          name: "Monitoring & Daftar SPJ", 
          path: "/pengajuan-spj", 
          icon: FileSpreadsheet,
          badge: countPerluRevisi > 0 ? countPerluRevisi : null,
          badgeColor: "bg-amber-400 text-purple-950 font-bold"
        },
        { name: "Buat Pengajuan SPJ Baru", path: "/pengajuan-spj/baru", icon: FilePlus2 },
        { 
          name: "Rekon & Kekurangan Berkas", 
          path: "/rekon-spj", 
          icon: FileCheck2,
          badge: countRekonBelum > 0 ? countRekonBelum : null,
          badgeColor: "bg-rose-400 text-purple-950 font-bold"
        },
        { name: "Panduan Kelengkapan Akun", path: "/panduan-akun", icon: BookOpenCheck },
        { name: "Kalkulator Pajak (Tax Engine)", path: "/kalkulator-pajak", icon: Calculator },
      ]
    },
    {
      group: "SURAT TUGAS & LAPORAN",
      items: [
        { name: "Surat Tugas", path: "/surat-tugas", icon: FileText },
        { name: "Laporan & Visum Perjadin", path: "/laporan-perjadin", icon: Car },
      ]
    },
    {
      group: "MONITORING & LAPORAN",
      items: [
        { name: "Monitoring Honor Mitra", path: "/monitoring-mitra", icon: Coins },
        { name: "Rekapitulasi SPJ (Export Excel)", path: "/rekapitulasi", icon: Download },
        { name: "Lacak Posisi Berkas Cepat", path: "/lacak", icon: Search },
      ]
    },
    {
      group: "MASTER DATA & SISTEM",
      items: [
        { name: "Manajemen Pegawai & Akun", path: "/pegawai", icon: UserSquare2 },
        { name: "Master Wilayah & SLS", path: "/master-wilayah", icon: MapPin },
        { name: "Master Kode Akun", path: "/master-akun", icon: Tags },
        { name: "Pengaturan & Hak Akses", path: "/pengaturan", icon: Settings },
      ]
    }
  ];

  // Filter based on user role permissions
  const menuGroups = rawMenuGroups.map(group => ({
    ...group,
    items: group.items.filter(item => canAccess(item.path))
  })).filter(group => group.items.length > 0);

  return (
    <aside className="w-72 bg-gradient-to-b from-[#250b52] via-[#350d6f] to-[#45128c] text-purple-100 flex flex-col h-screen sticky top-0 shadow-2xl z-30 select-none border-r border-purple-800/40">
      {/* Brand Header */}
      <div className="p-4 border-b border-purple-700/40 bg-purple-950/30">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-purple-500 to-amber-300 flex items-center justify-center shadow-lg shadow-purple-900/50 flex-shrink-0">
            <ShieldCheck className="w-6 h-6 text-purple-950" />
          </div>
          <div className="overflow-hidden">
            <h1 className="font-extrabold text-white text-base tracking-wider leading-none flex items-center gap-1.5">
              SIGAP BESAPRAH
            </h1>
            <p className="text-[10px] text-purple-300 font-semibold truncate mt-0.5">
              BPS Kabupaten Sambas
            </p>
          </div>
        </div>

        {/* User Role Indicator in Sidebar */}
        <div className="mt-3 px-2.5 py-1.5 rounded-xl bg-purple-900/50 border border-purple-500/30 flex items-center justify-between">
          <div className="flex items-center gap-1.5">
            {isSuperadmin ? (
              <Crown className="w-3.5 h-3.5 text-amber-300 flex-shrink-0 animate-bounce" />
            ) : (
              <ShieldCheck className="w-3.5 h-3.5 text-purple-300 flex-shrink-0" />
            )}
            <span className={`text-[10px] font-extrabold tracking-wide uppercase ${
              isSuperadmin ? 'text-amber-300' : 'text-purple-200'
            }`}>
              {isSuperadmin ? 'SUPERADMIN (AKSES PENUH)' : `ROLE: ${currentUser?.role || 'PEGAWAI'}`}
            </span>
          </div>
          {!isSuperadmin && (
            <span className="text-[9px] text-purple-300/80 font-medium">Fitur Terbatas</span>
          )}
        </div>

        <div className="mt-2 text-[9px] text-purple-300/80 italic leading-tight text-center">
          “Bersaprah dalam Kerja, Sepakat dalam Akuntabilitas.”
        </div>
      </div>

      {/* Nav List with custom scroll */}
      <div className="flex-1 overflow-y-auto px-3 py-3 space-y-5">
        {menuGroups.map((group, gIdx) => (
          <div key={gIdx} className="space-y-1">
            <div className="px-3 text-[10px] font-bold uppercase tracking-wider text-purple-300/70 mb-1 flex items-center justify-between">
              <span>{group.group}</span>
              <span className="w-6 h-[1px] bg-purple-700/40"></span>
            </div>
            {group.items.map((item, iIdx) => {
              const Icon = item.icon;
              const isActive = location.pathname === item.path || 
                (item.path !== '/dashboard' && item.path !== '/' && location.pathname.startsWith(item.path));

              return (
                <NavLink
                  key={iIdx}
                  to={item.path}
                  className={`flex items-center justify-between px-3 py-2 rounded-xl text-xs font-medium transition-all group relative ${
                    isActive
                      ? "bg-gradient-to-r from-purple-500/40 to-indigo-500/20 text-white font-semibold border-l-4 border-amber-300 shadow-sm pl-2.5"
                      : "text-purple-200/80 hover:text-white hover:bg-white/10"
                  }`}
                >
                  <div className="flex items-center gap-2.5 min-w-0">
                    <Icon className={`w-4 h-4 flex-shrink-0 transition-transform group-hover:scale-110 ${
                      isActive ? "text-amber-300" : "text-purple-300"
                    }`} />
                    <span className="truncate">{item.name}</span>
                  </div>

                  {item.badge ? (
                    <span className={`px-2 py-0.5 text-[10px] rounded-full shadow-sm ${item.badgeColor}`}>
                      {item.badge}
                    </span>
                  ) : isActive ? (
                    <ChevronRight className="w-3.5 h-3.5 text-amber-300" />
                  ) : null}
                </NavLink>
              );
            })}
          </div>
        ))}
      </div>

      {/* Footer Info */}
      <div className="p-3 border-t border-purple-700/40 bg-purple-950/40 flex items-center justify-between text-[11px] text-purple-300">
        <div className="flex items-center gap-1.5">
          <span className="w-2 h-2 rounded-full bg-emerald-400"></span>
          <span>Online (v2.0)</span>
        </div>
        <NavLink to="/" className="text-amber-300 hover:text-white font-semibold text-[10px] hover:underline">
          Portal Beranda
        </NavLink>
      </div>
    </aside>
  );
}
