import React, { useState, useRef, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { 
  Bell, 
  CheckCheck, 
  AlertCircle, 
  CheckCircle2, 
  Clock, 
  FileText, 
  Trash2, 
  ChevronRight, 
  ExternalLink,
  Sparkles,
  ArrowRightCircle,
  Inbox
} from 'lucide-react';
import { useNotification } from '../../context/NotificationContext';

// Helper format waktu relatif yang ramah pengguna
function formatRelativeTime(dateString) {
  if (!dateString) return '';
  const now = new Date();
  const past = new Date(dateString);
  const diffMs = now - past;
  const diffSec = Math.floor(diffMs / 1000);
  const diffMin = Math.floor(diffSec / 60);
  const diffHours = Math.floor(diffMin / 60);
  const diffDays = Math.floor(diffHours / 24);

  if (diffMin < 1) return 'Baru saja';
  if (diffMin < 60) return `${diffMin} mnt lalu`;
  if (diffHours < 24) return `${diffHours} jam lalu`;
  if (diffDays === 1) return 'Kemarin';
  if (diffDays < 7) return `${diffDays} hari lalu`;
  return past.toLocaleDateString('id-ID', { day: 'numeric', month: 'short' });
}

export default function NotificationDropdown() {
  const navigate = useNavigate();
  const { 
    notifications, 
    unreadCount, 
    markAsRead, 
    markAllAsRead, 
    deleteNotification,
    clearAllNotifications,
    simulateIncomingNotification
  } = useNotification();

  const [isOpen, setIsOpen] = useState(false);
  const [activeTab, setActiveTab] = useState('all'); // 'all' | 'unread' | 'revisi'
  const dropdownRef = useRef(null);

  // Tutup dropdown saat klik di luar
  useEffect(() => {
    function handleClickOutside(event) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Filter list notifikasi berdasarkan tab
  const filteredNotifications = notifications.filter(n => {
    if (activeTab === 'unread') return !n.isRead;
    if (activeTab === 'revisi') return n.category === 'revisi' || n.type === 'warning';
    return true;
  });

  const revisiCount = notifications.filter(n => n.category === 'revisi' || n.type === 'warning').length;

  const handleItemClick = (notif) => {
    markAsRead(notif.id);
    setIsOpen(false);
    if (notif.link) {
      navigate(notif.link);
    }
  };

  return (
    <div className="relative" ref={dropdownRef}>
      {/* Tombol Lonceng Notifikasi */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        aria-label="Pemberitahuan"
        className={`relative p-2.5 rounded-xl transition-all ${
          isOpen 
            ? 'bg-purple-100 text-purple-900 shadow-xs' 
            : 'text-purple-600 hover:text-purple-800 hover:bg-purple-50'
        }`}
        title={`${unreadCount} pemberitahuan belum dibaca`}
      >
        <Bell className={`w-5 h-5 ${unreadCount > 0 ? 'animate-bounce-subtle text-purple-700' : ''}`} />

        {/* Badge Unread Count */}
        {unreadCount > 0 && (
          <span className="absolute top-1 right-1 min-w-[18px] h-[18px] px-1 bg-rose-500 text-white text-[10px] font-black rounded-full flex items-center justify-center ring-2 ring-white shadow-xs animate-in zoom-in-50">
            {unreadCount > 99 ? '99+' : unreadCount}
          </span>
        )}
      </button>

      {/* Popover Panel Dropdown */}
      {isOpen && (
        <div className="absolute right-0 mt-2 w-80 sm:w-96 bg-white rounded-3xl shadow-2xl border border-purple-100 z-50 overflow-hidden animate-in fade-in zoom-in-95 duration-150">
          {/* Header Popover */}
          <div className="p-4 bg-gradient-to-r from-purple-900 via-purple-800 to-indigo-900 text-white flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-xl bg-white/15 flex items-center justify-center backdrop-blur-sm">
                <Bell className="w-4 h-4 text-amber-300" />
              </div>
              <div>
                <h3 className="text-xs font-black uppercase tracking-wider">
                  Pemberitahuan Sistem
                </h3>
                <p className="text-[10px] text-purple-200">
                  {unreadCount > 0 ? `${unreadCount} pesan belum dibaca` : 'Semua pesan telah dibaca'}
                </p>
              </div>
            </div>

            {unreadCount > 0 && (
              <button
                onClick={markAllAsRead}
                className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-white/15 hover:bg-white/25 text-white text-[11px] font-bold backdrop-blur-xs transition"
                title="Tandai semua telah dibaca"
              >
                <CheckCheck className="w-3.5 h-3.5" />
                <span>Baca Semua</span>
              </button>
            )}
          </div>

          {/* Filter Tabs */}
          <div className="px-3 pt-2.5 pb-2 border-b border-purple-50 flex items-center gap-1.5 bg-slate-50/70 text-xs font-bold">
            <button
              onClick={() => setActiveTab('all')}
              className={`px-3 py-1.5 rounded-xl transition ${
                activeTab === 'all'
                  ? 'bg-purple-700 text-white shadow-xs'
                  : 'text-slate-600 hover:text-purple-700 hover:bg-purple-50'
              }`}
            >
              Semua ({notifications.length})
            </button>
            <button
              onClick={() => setActiveTab('unread')}
              className={`px-3 py-1.5 rounded-xl transition flex items-center gap-1.5 ${
                activeTab === 'unread'
                  ? 'bg-purple-700 text-white shadow-xs'
                  : 'text-slate-600 hover:text-purple-700 hover:bg-purple-50'
              }`}
            >
              <span>Belum Dibaca</span>
              {unreadCount > 0 && (
                <span className={`px-1.5 py-0.2 rounded-full text-[10px] font-mono ${
                  activeTab === 'unread' ? 'bg-white text-purple-800' : 'bg-rose-100 text-rose-700'
                }`}>
                  {unreadCount}
                </span>
              )}
            </button>
            <button
              onClick={() => setActiveTab('revisi')}
              className={`px-3 py-1.5 rounded-xl transition flex items-center gap-1.5 ${
                activeTab === 'revisi'
                  ? 'bg-purple-700 text-white shadow-xs'
                  : 'text-slate-600 hover:text-purple-700 hover:bg-purple-50'
              }`}
            >
              <span>Revisi</span>
              {revisiCount > 0 && (
                <span className={`px-1.5 py-0.2 rounded-full text-[10px] font-mono ${
                  activeTab === 'revisi' ? 'bg-white text-purple-800' : 'bg-amber-100 text-amber-800'
                }`}>
                  {revisiCount}
                </span>
              )}
            </button>
          </div>

          {/* List Notifikasi */}
          <div className="max-h-80 sm:max-h-96 overflow-y-auto divide-y divide-purple-50/70">
            {filteredNotifications.length === 0 ? (
              <div className="py-10 px-4 text-center space-y-2">
                <div className="w-12 h-12 rounded-2xl bg-purple-50 text-purple-600 flex items-center justify-center mx-auto">
                  <Inbox className="w-6 h-6" />
                </div>
                <p className="text-xs font-bold text-slate-700">Tidak ada pemberitahuan</p>
                <p className="text-[11px] text-slate-400 max-w-xs mx-auto">
                  {activeTab === 'unread' 
                    ? 'Bagus! Semua pemberitahuan sudah Anda baca.'
                    : activeTab === 'revisi'
                    ? 'Tidak ada berkas yang memerlukan revisi saat ini.'
                    : 'Belum ada riwayat pemberitahuan yang tersimpan.'}
                </p>
              </div>
            ) : (
              filteredNotifications.map((notif) => {
                const isWarning = notif.type === 'warning';
                const isSuccess = notif.type === 'success';

                let iconBg = 'bg-purple-100 text-purple-700';
                let IconComp = FileText;

                if (isWarning) {
                  iconBg = 'bg-amber-100 text-amber-800';
                  IconComp = AlertCircle;
                } else if (isSuccess) {
                  iconBg = 'bg-emerald-100 text-emerald-800';
                  IconComp = CheckCircle2;
                } else if (notif.category === 'disposisi') {
                  iconBg = 'bg-blue-100 text-blue-700';
                  IconComp = ArrowRightCircle;
                }

                return (
                  <div
                    key={notif.id}
                    onClick={() => handleItemClick(notif)}
                    className={`p-3.5 hover:bg-purple-50/50 transition cursor-pointer flex items-start gap-3 relative group ${
                      !notif.isRead ? 'bg-purple-50/30' : ''
                    }`}
                  >
                    {/* Icon */}
                    <div className={`w-8 h-8 rounded-xl flex items-center justify-center flex-shrink-0 mt-0.5 ${iconBg}`}>
                      <IconComp className="w-4 h-4" />
                    </div>

                    {/* Content */}
                    <div className="flex-1 min-w-0 pr-4">
                      <div className="flex items-center justify-between gap-1 mb-0.5">
                        <span className={`text-xs font-extrabold truncate ${
                          !notif.isRead ? 'text-purple-950 font-black' : 'text-slate-800'
                        }`}>
                          {notif.title}
                        </span>
                        <span className="text-[10px] text-slate-400 flex-shrink-0 font-medium">
                          {formatRelativeTime(notif.timestamp)}
                        </span>
                      </div>

                      <p className="text-[11px] text-slate-600 line-clamp-2 leading-relaxed">
                        {notif.message}
                      </p>

                      <div className="mt-1.5 flex items-center gap-2">
                        {notif.no_spm && (
                          <span className="text-[9px] font-mono font-bold px-1.5 py-0.2 rounded bg-purple-100/80 text-purple-900 border border-purple-200">
                            {notif.no_spm}
                          </span>
                        )}
                        <span className="text-[10px] text-purple-700 font-semibold group-hover:underline flex items-center gap-0.5">
                          <span>Buka Berkas</span>
                          <ChevronRight className="w-3 h-3 group-hover:translate-x-0.5 transition" />
                        </span>
                      </div>
                    </div>

                    {/* Unread Indicator Dot */}
                    {!notif.isRead && (
                      <span className="w-2.5 h-2.5 rounded-full bg-purple-600 flex-shrink-0 mt-1.5 ring-2 ring-white animate-pulse" />
                    )}

                    {/* Tombol Hapus Single Notifikasi saat hover */}
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        deleteNotification(notif.id);
                      }}
                      className="absolute right-2 top-2 p-1 rounded-lg text-slate-300 hover:text-rose-600 hover:bg-rose-50 opacity-0 group-hover:opacity-100 transition"
                      title="Hapus pemberitahuan"
                    >
                      <Trash2 className="w-3 h-3" />
                    </button>
                  </div>
                );
              })
            )}
          </div>

          {/* Footer Popover: Demo Test Simulasi & Link Berkas */}
          <div className="p-3 bg-slate-50 border-t border-purple-100 flex items-center justify-between text-xs font-bold">
            <button
              onClick={simulateIncomingNotification}
              className="inline-flex items-center gap-1.5 text-purple-700 hover:text-purple-950 transition text-[11px]"
              title="Simulasikan ada berkas SPJ baru yang masuk ke meja Anda"
            >
              <Sparkles className="w-3.5 h-3.5 text-amber-500" />
              <span>Simulasi Notifikasi</span>
            </button>

            <Link
              to="/pengajuan-spj"
              onClick={() => setIsOpen(false)}
              className="text-purple-700 hover:underline flex items-center gap-1 text-[11px]"
            >
              <span>Daftar SPJ</span>
              <ChevronRight className="w-3.5 h-3.5" />
            </Link>
          </div>
        </div>
      )}
    </div>
  );
}
