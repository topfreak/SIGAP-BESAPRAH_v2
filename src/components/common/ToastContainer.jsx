import React from 'react';
import { Link } from 'react-router-dom';
import { 
  Bell, 
  AlertCircle, 
  CheckCircle2, 
  Info, 
  X, 
  ArrowRight,
  ExternalLink 
} from 'lucide-react';
import { useNotification } from '../../context/NotificationContext';

export default function ToastContainer() {
  const { activeToasts, dismissToast } = useNotification();

  if (!activeToasts || activeToasts.length === 0) return null;

  return (
    <div 
      aria-live="polite"
      className="fixed bottom-5 right-5 z-50 flex flex-col gap-3 max-w-md w-full px-4 sm:px-0 pointer-events-none"
    >
      {activeToasts.map((toast) => {
        const isWarning = toast.type === 'warning';
        const isSuccess = toast.type === 'success';

        let borderClass = 'border-purple-200 bg-white/95';
        let iconBg = 'bg-purple-100 text-purple-700';
        let IconComp = Bell;

        if (isWarning) {
          borderClass = 'border-amber-300 bg-amber-50/95';
          iconBg = 'bg-amber-100 text-amber-800';
          IconComp = AlertCircle;
        } else if (isSuccess) {
          borderClass = 'border-emerald-300 bg-emerald-50/95';
          iconBg = 'bg-emerald-100 text-emerald-800';
          IconComp = CheckCircle2;
        }

        return (
          <div
            key={toast.id}
            className={`pointer-events-auto p-4 rounded-2xl shadow-xl border ${borderClass} backdrop-blur-md animate-in slide-in-from-bottom-5 duration-200 flex items-start gap-3 relative overflow-hidden`}
          >
            {/* Top accent line */}
            <div 
              className={`absolute top-0 left-0 right-0 h-1 ${
                isWarning 
                  ? 'bg-amber-500' 
                  : isSuccess 
                  ? 'bg-emerald-500' 
                  : 'bg-gradient-to-r from-purple-600 to-indigo-600'
              }`}
            />

            <div className={`w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0 mt-0.5 ${iconBg}`}>
              <IconComp className="w-5 h-5" />
            </div>

            <div className="flex-1 min-w-0 pr-6">
              <div className="flex items-center gap-2 mb-0.5">
                <span className="font-extrabold text-xs text-slate-900 truncate">
                  {toast.title}
                </span>
                {toast.no_spm && (
                  <span className="font-mono text-[10px] font-bold px-1.5 py-0.2 rounded bg-purple-100/70 text-purple-900 border border-purple-200">
                    {toast.no_spm}
                  </span>
                )}
              </div>

              <p className="text-xs text-slate-600 leading-relaxed line-clamp-2">
                {toast.message}
              </p>

              {toast.link && (
                <div className="mt-2">
                  <Link
                    to={toast.link}
                    onClick={() => dismissToast(toast.id)}
                    className="inline-flex items-center gap-1 text-[11px] font-bold text-purple-700 hover:text-purple-900 hover:underline"
                  >
                    <span>Buka Rincian Berkas</span>
                    <ArrowRight className="w-3 h-3" />
                  </Link>
                </div>
              )}
            </div>

            {/* Tombol Tutup Toast */}
            <button
              onClick={() => dismissToast(toast.id)}
              className="absolute top-3 right-3 p-1 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-100/80 transition"
              title="Tutup pemberitahuan"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        );
      })}
    </div>
  );
}
