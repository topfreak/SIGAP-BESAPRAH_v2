import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { 
  Bell, 
  Search, 
  UserCheck, 
  LogOut, 
  ExternalLink, 
  Layers, 
  CheckCircle2, 
  AlertTriangle,
  ChevronDown
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

export default function Topbar() {
  const navigate = useNavigate();
  const { currentUser, switchUser, pegawaiList, logout, transactions } = useAuth();
  const [showRoleMenu, setShowRoleMenu] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  const perluPerbaikanCount = transactions.filter(t => t.status_dokumen === 'Perlu Perbaikan').length;

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/pengajuan-spj?q=${encodeURIComponent(searchQuery.trim())}`);
    }
  };

  return (
    <header className="h-16 bg-white/95 backdrop-blur-md border-b border-purple-100 px-6 flex items-center justify-between sticky top-0 z-20 shadow-xs">
      {/* Search Bar */}
      <form onSubmit={handleSearch} className="flex-1 max-w-md relative hidden md:block">
        <Search className="w-4 h-4 text-purple-400 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder="Cari no. SPM, uraian kegiatan, atau nama PJ..."
          className="w-full pl-10 pr-4 py-2 bg-purple-50/50 border border-purple-150 rounded-xl text-xs text-slate-800 placeholder-purple-400/80 focus:outline-none focus:ring-2 focus:ring-purple-400 focus:bg-white transition"
        />
      </form>

      {/* Right Controls */}
      <div className="flex items-center gap-3 ml-auto">
        {/* Quick Notification for Pending / Revisi */}
        <Link 
          to="/pengajuan-spj?tab=Perlu%20Perbaikan"
          className="relative p-2 text-purple-600 hover:text-purple-800 hover:bg-purple-50 rounded-xl transition"
          title={`${perluPerbaikanCount} dokumen perlu perbaikan`}
        >
          <Bell className="w-5 h-5" />
          {perluPerbaikanCount > 0 && (
            <span className="absolute top-1.5 right-1.5 w-4 h-4 bg-rose-500 text-white text-[10px] font-bold rounded-full flex items-center justify-center ring-2 ring-white">
              {perluPerbaikanCount}
            </span>
          )}
        </Link>

        {/* Quick Portal Switch */}
        <Link
          to="/"
          className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 text-xs text-purple-700 hover:text-purple-900 bg-purple-50 hover:bg-purple-100 rounded-xl font-medium border border-purple-200/60 transition"
        >
          <ExternalLink className="w-3.5 h-3.5" />
          <span>Portal Publik</span>
        </Link>

        {/* User Role Switcher Dropdown */}
        <div className="relative">
          <button
            onClick={() => setShowRoleMenu(!showRoleMenu)}
            className="flex items-center gap-2.5 p-1.5 pr-3 rounded-xl hover:bg-purple-50 transition border border-transparent hover:border-purple-200"
          >
            <div className="w-8 h-8 rounded-lg bg-gradient-to-tr from-purple-600 to-indigo-600 text-white flex items-center justify-center font-bold text-xs shadow-xs">
              {currentUser?.nama?.charAt(0) || 'U'}
            </div>
            <div className="text-left hidden lg:block">
              <div className="text-xs font-bold text-slate-800 flex items-center gap-1.5">
                <span className="max-w-[140px] truncate">{currentUser?.nama}</span>
                <span className="px-1.5 py-0.2 bg-purple-100 text-purple-800 text-[10px] rounded font-semibold uppercase">
                  {currentUser?.role}
                </span>
              </div>
              <div className="text-[10px] text-slate-500 truncate max-w-[160px]">
                {currentUser?.jabatan}
              </div>
            </div>
            <ChevronDown className="w-3.5 h-3.5 text-purple-400" />
          </button>

          {/* Dropdown Menu */}
          {showRoleMenu && (
            <div 
              className="absolute right-0 mt-2 w-72 bg-white rounded-2xl shadow-xl border border-purple-100 py-2 z-50 animate-in fade-in zoom-in-95 duration-100"
              onClick={() => setShowRoleMenu(false)}
            >
              <div className="px-4 py-2 border-b border-purple-50">
                <p className="text-[11px] font-semibold text-purple-900">Masuk Sebagai:</p>
                <p className="text-xs font-bold text-slate-800">{currentUser?.nama}</p>
                <p className="text-[10px] text-slate-500">NIP: {currentUser?.nip_baru}</p>
              </div>

              <div className="px-3 py-1.5 text-[10px] font-bold text-purple-500 uppercase tracking-wider">
                Simulasi Peran Pegawai BPS Sambas:
              </div>

              <div className="max-h-56 overflow-y-auto px-1 space-y-0.5">
                {pegawaiList.map((p) => (
                  <button
                    key={p.nip_baru}
                    onClick={() => switchUser(p.nip_baru)}
                    className={`w-full text-left px-3 py-1.5 rounded-lg text-xs flex items-center justify-between transition ${
                      currentUser?.nip_baru === p.nip_baru 
                        ? 'bg-purple-100 text-purple-900 font-bold' 
                        : 'hover:bg-purple-50 text-slate-700'
                    }`}
                  >
                    <div className="truncate pr-2">
                      <div className="truncate">{p.nama}</div>
                      <div className="text-[10px] text-slate-400">{p.jabatan}</div>
                    </div>
                    <span className="text-[9px] px-1.5 py-0.5 rounded uppercase font-semibold bg-white border border-purple-200 text-purple-700 flex-shrink-0">
                      {p.role}
                    </span>
                  </button>
                ))}
              </div>

              <div className="border-t border-purple-50 mt-2 pt-1 px-2">
                <button
                  onClick={logout}
                  className="w-full text-left px-3 py-1.5 text-xs text-rose-600 hover:bg-rose-50 rounded-lg flex items-center gap-2 font-medium"
                >
                  <LogOut className="w-3.5 h-3.5" />
                  <span>Keluar Sesi</span>
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}
