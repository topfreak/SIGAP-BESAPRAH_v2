import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { 
  Search, 
  LogOut, 
  ExternalLink, 
  ChevronDown, 
  UserCircle, 
  ShieldCheck, 
  KeyRound 
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import NotificationDropdown from './NotificationDropdown';

export default function Topbar() {
  const navigate = useNavigate();
  const { currentUser, logout, transactions } = useAuth();
  const [showUserMenu, setShowUserMenu] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  const perluPerbaikanCount = transactions.filter(t => t.status_dokumen === 'Perlu Perbaikan').length;

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/pengajuan-spj?q=${encodeURIComponent(searchQuery.trim())}`);
    }
  };

  const handleLogout = () => {
    logout();
    navigate('/login');
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
        {/* Local In-App Notification Center Dropdown */}
        <NotificationDropdown />

        {/* Quick Portal Switch */}
        <Link
          to="/"
          className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 text-xs text-purple-700 hover:text-purple-900 bg-purple-50 hover:bg-purple-100 rounded-xl font-medium border border-purple-200/60 transition"
        >
          <ExternalLink className="w-3.5 h-3.5" />
          <span>Portal Publik</span>
        </Link>

        {/* User Account Dropdown */}
        <div className="relative">
          <button
            onClick={() => setShowUserMenu(!showUserMenu)}
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
                {currentUser?.role === 'superadmin' ? 'Administrator Sistem' : (currentUser?.jabatan || '-')}
              </div>
            </div>
            <ChevronDown className="w-3.5 h-3.5 text-purple-400" />
          </button>

          {/* Real User Menu */}
          {showUserMenu && (
            <div 
              className="absolute right-0 mt-2 w-72 bg-white rounded-2xl shadow-xl border border-purple-100 py-2 z-50 animate-in fade-in zoom-in-95 duration-100"
              onClick={() => setShowUserMenu(false)}
            >
              {/* Profile Details Header */}
              <div className="px-4 py-3 border-b border-purple-50 bg-purple-50/30">
                <p className="text-[10px] font-bold text-purple-600 uppercase tracking-wider">Sedang Masuk Sebagai:</p>
                <p className="text-xs font-extrabold text-slate-900 mt-0.5">{currentUser?.nama}</p>
                <div className="flex items-center gap-1.5 mt-1">
                  <span className="text-[10px] font-mono bg-purple-100 text-purple-900 px-1.5 py-0.2 rounded font-semibold">
                    @{currentUser?.username}
                  </span>
                  {currentUser?.role !== 'superadmin' && currentUser?.nip_baru && currentUser?.nip_baru !== '-' ? (
                    <span className="text-[10px] text-slate-400 font-mono">
                      NIP: {currentUser?.nip_baru}
                    </span>
                  ) : currentUser?.role === 'superadmin' ? (
                    <span className="text-[10px] text-purple-700 font-semibold">
                      Administrator Sistem
                    </span>
                  ) : null}
                </div>
              </div>

              {/* Action Links */}
              <div className="p-2 space-y-1">
                <Link
                  to="/profile"
                  className="w-full text-left px-3 py-2 rounded-xl text-xs font-semibold text-purple-900 hover:bg-purple-50 flex items-center gap-2.5 transition"
                >
                  <UserCircle className="w-4 h-4 text-purple-600" />
                  <span>Profil Pengguna</span>
                </Link>

                <Link
                  to="/profile"
                  className="w-full text-left px-3 py-2 rounded-xl text-xs font-semibold text-purple-900 hover:bg-purple-50 flex items-center gap-2.5 transition"
                >
                  <KeyRound className="w-4 h-4 text-purple-600" />
                  <span>Ganti Kata Sandi</span>
                </Link>
              </div>

              {/* Logout Button */}
              <div className="border-t border-purple-50 pt-1.5 px-2">
                <button
                  onClick={handleLogout}
                  className="w-full text-left px-3 py-2 text-xs text-rose-600 hover:bg-rose-50 rounded-xl flex items-center gap-2.5 font-bold transition"
                >
                  <LogOut className="w-4 h-4" />
                  <span>Keluar Sesi (Logout)</span>
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}
