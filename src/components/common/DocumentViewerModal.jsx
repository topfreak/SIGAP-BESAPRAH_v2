import React, { useState, useEffect } from 'react';
import { 
  X, 
  Download, 
  ZoomIn, 
  ZoomOut, 
  RotateCw, 
  FileText, 
  CheckCircle2, 
  XCircle, 
  AlertCircle,
  Loader2,
  Maximize2,
  ShieldCheck
} from 'lucide-react';
import { documentVault, formatFileSize } from '../../lib/documentVault';

export default function DocumentViewerModal({ 
  isOpen, 
  onClose, 
  docInfo, // { docName, fileId, fileName, fileSize, fileType, uploadedAt }
  canVerify = false,
  verifyStatus = null, // 'sah' | 'ditolak' | null
  onVerifyChange = null
}) {
  const [fileData, setFileData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [zoom, setZoom] = useState(100);
  const [rotation, setRotation] = useState(0);
  const [rejectReason, setRejectReason] = useState('');
  const [showRejectInput, setShowRejectInput] = useState(false);

  useEffect(() => {
    let objectUrlToRevoke = null;

    async function loadDocument() {
      if (!isOpen || !docInfo) return;
      setLoading(true);
      setZoom(100);
      setRotation(0);
      setShowRejectInput(false);
      setRejectReason('');

      try {
        if (docInfo.fileId) {
          const res = await documentVault.getFileObjectUrl(docInfo.fileId);
          if (res) {
            objectUrlToRevoke = res.url;
            setFileData(res);
          } else {
            setFileData(null);
          }
        } else {
          setFileData(null);
        }
      } catch (e) {
        console.error('Gagal memuat dokumen dari vault:', e);
        setFileData(null);
      } finally {
        setLoading(false);
      }
    }

    loadDocument();

    return () => {
      if (objectUrlToRevoke) {
        URL.revokeObjectURL(objectUrlToRevoke);
      }
    };
  }, [isOpen, docInfo]);

  if (!isOpen || !docInfo) return null;

  const isImage = fileData?.type?.startsWith('image/') || /\.(jpg|jpeg|png|gif|webp)$/i.test(docInfo.fileName || '');
  const isPdf = fileData?.type === 'application/pdf' || /\.pdf$/i.test(docInfo.fileName || '');

  const handleDownload = () => {
    if (!fileData?.url) return;
    const a = document.createElement('a');
    a.href = fileData.url;
    a.download = fileData.name || docInfo.fileName || 'dokumen-spj.pdf';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/80 backdrop-blur-sm p-3 sm:p-6 animate-in fade-in duration-150">
      <div className="bg-white rounded-3xl shadow-2xl border border-purple-200 w-full max-w-5xl h-[90vh] flex flex-col overflow-hidden">
        {/* Top Modal Bar */}
        <div className="px-5 py-3.5 bg-gradient-to-r from-[#250b52] to-[#4c1d95] text-white flex items-center justify-between gap-4 flex-shrink-0">
          <div className="flex items-center gap-3 min-w-0">
            <div className="w-9 h-9 rounded-xl bg-white/15 flex items-center justify-center flex-shrink-0">
              <FileText className="w-5 h-5 text-amber-300" />
            </div>
            <div className="min-w-0">
              <h3 className="text-sm font-extrabold truncate">{docInfo.docName}</h3>
              <p className="text-[11px] text-purple-200 truncate">
                {docInfo.fileName || 'Belum ada nama file'} 
                {docInfo.fileSize ? ` • ${formatFileSize(docInfo.fileSize)}` : ''}
                {docInfo.uploadedAt ? ` • Diunggah ${docInfo.uploadedAt}` : ''}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2 flex-shrink-0">
            {isImage && fileData && (
              <div className="hidden sm:flex items-center gap-1 bg-white/10 rounded-xl p-1 mr-1">
                <button
                  onClick={() => setZoom(z => Math.max(50, z - 25))}
                  className="p-1.5 hover:bg-white/20 rounded-lg transition"
                  title="Perkecil"
                >
                  <ZoomOut className="w-4 h-4" />
                </button>
                <span className="text-[11px] font-mono font-bold px-1.5">{zoom}%</span>
                <button
                  onClick={() => setZoom(z => Math.min(250, z + 25))}
                  className="p-1.5 hover:bg-white/20 rounded-lg transition"
                  title="Perbesar"
                >
                  <ZoomIn className="w-4 h-4" />
                </button>
                <button
                  onClick={() => setRotation(r => (r + 90) % 360)}
                  className="p-1.5 hover:bg-white/20 rounded-lg transition"
                  title="Putar 90°"
                >
                  <RotateCw className="w-4 h-4" />
                </button>
              </div>
            )}

            {fileData?.url && (
              <button
                onClick={handleDownload}
                className="px-3 py-1.5 rounded-xl bg-white/15 hover:bg-white/25 text-white text-xs font-bold flex items-center gap-1.5 transition"
              >
                <Download className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">Unduh</span>
              </button>
            )}

            <button
              onClick={onClose}
              className="p-2 rounded-xl bg-white/10 hover:bg-rose-500 text-white transition"
              title="Tutup Viewer"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Viewer Body */}
        <div className="flex-1 bg-slate-100 overflow-auto flex items-center justify-center p-4 relative">
          {loading ? (
            <div className="text-center space-y-2 text-purple-700">
              <Loader2 className="w-8 h-8 animate-spin mx-auto" />
              <p className="text-xs font-bold">Memuat dokumen digital dari brankas sistem...</p>
            </div>
          ) : fileData?.url ? (
            isPdf ? (
              <iframe
                src={`${fileData.url}#toolbar=1&view=FitH`}
                title={docInfo.docName}
                className="w-full h-full rounded-2xl border border-slate-300 bg-white shadow-inner"
              />
            ) : isImage ? (
              <div className="w-full h-full flex items-center justify-center overflow-auto">
                <img
                  src={fileData.url}
                  alt={docInfo.docName}
                  className="max-w-full max-h-full object-contain rounded-xl shadow-lg transition-transform duration-200"
                  style={{
                    transform: `scale(${zoom / 100}) rotate(${rotation}deg)`
                  }}
                />
              </div>
            ) : (
              <div className="bg-white p-8 rounded-3xl border border-purple-100 shadow-sm text-center max-w-md space-y-3">
                <FileText className="w-12 h-12 text-purple-600 mx-auto" />
                <h4 className="font-extrabold text-sm text-slate-900">Format File Siap Diunduh</h4>
                <p className="text-xs text-slate-500">
                  File <strong>{fileData.name}</strong> tidak dapat dipratinjau langsung di browser. Silakan unduh untuk memeriksa isinya.
                </p>
                <button
                  onClick={handleDownload}
                  className="px-5 py-2.5 rounded-xl bg-purple-700 hover:bg-purple-800 text-white text-xs font-bold inline-flex items-center gap-2"
                >
                  <Download className="w-4 h-4" />
                  <span>Unduh File ({formatFileSize(fileData.size)})</span>
                </button>
              </div>
            )
          ) : (
            /* Fallback jika dokumen hanya berupa nama file historis / bawaan seed */
            <div className="bg-white p-8 rounded-3xl border border-amber-200 shadow-sm text-center max-w-lg space-y-4">
              <div className="w-14 h-14 rounded-2xl bg-amber-100 text-amber-700 flex items-center justify-center mx-auto">
                <AlertCircle className="w-7 h-7" />
              </div>
              <div className="space-y-1">
                <h4 className="font-extrabold text-sm text-slate-900">Arsip Fisik / Data Historis Awal</h4>
                <p className="text-xs text-slate-500 leading-relaxed">
                  Dokumen <strong>"{docInfo.docName}"</strong> ini berasal dari entri data bawaan sistem atau belum diunggah file PDF/gambar fisiknya. 
                  Untuk pengajuan SPJ baru yang diunggah tim kerja melalui form wizard, isi file PDF/kuitansi akan tampil langsung di sini.
                </p>
              </div>
            </div>
          )}
        </div>

        {/* Footer PPK/Bendahara Document Verification Action Bar */}
        {canVerify && onVerifyChange && (
          <div className="p-4 bg-white border-t border-purple-100 flex flex-col sm:flex-row sm:items-center justify-between gap-3 flex-shrink-0">
            <div className="flex items-center gap-2 text-xs">
              <ShieldCheck className="w-4 h-4 text-purple-700 flex-shrink-0" />
              <span className="font-bold text-slate-700">Verifikasi Keabsahan Dokumen ini:</span>
              {verifyStatus === 'sah' && (
                <span className="px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 font-bold text-[11px]">
                  ✅ Dinyatakan Sah / Memenuhi Syarat
                </span>
              )}
              {verifyStatus === 'ditolak' && (
                <span className="px-2 py-0.5 rounded-full bg-rose-100 text-rose-800 font-bold text-[11px]">
                  ❌ Dinyatakan Perlu Perbaikan
                </span>
              )}
            </div>

            {showRejectInput ? (
              <div className="flex items-center gap-2 flex-1 max-w-md">
                <input
                  type="text"
                  value={rejectReason}
                  onChange={(e) => setRejectReason(e.target.value)}
                  placeholder="Tuliskan alasan kekurangan dokumen ini..."
                  className="flex-1 px-3 py-1.5 rounded-xl border border-rose-300 text-xs focus:outline-none focus:ring-2 focus:ring-rose-400"
                  autoFocus
                />
                <button
                  onClick={() => {
                    onVerifyChange(docInfo.docName, 'ditolak', rejectReason);
                    setShowRejectInput(false);
                    onClose();
                  }}
                  className="px-3 py-1.5 rounded-xl bg-rose-600 hover:bg-rose-700 text-white text-xs font-bold"
                >
                  Simpan
                </button>
                <button
                  onClick={() => setShowRejectInput(false)}
                  className="px-2.5 py-1.5 rounded-xl bg-slate-100 text-slate-600 text-xs font-semibold"
                >
                  Batal
                </button>
              </div>
            ) : (
              <div className="flex items-center gap-2.5">
                <button
                  onClick={() => setShowRejectInput(true)}
                  className="px-4 py-2 rounded-xl border border-rose-300 bg-rose-50 hover:bg-rose-100 text-rose-800 font-bold text-xs flex items-center gap-1.5 transition"
                >
                  <XCircle className="w-4 h-4" />
                  <span>Tidak Sesuai / Tolak</span>
                </button>
                <button
                  onClick={() => {
                    onVerifyChange(docInfo.docName, 'sah', '');
                    onClose();
                  }}
                  className="px-5 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs shadow-sm flex items-center gap-1.5 transition"
                >
                  <CheckCircle2 className="w-4 h-4" />
                  <span>Tandai Sah & Lengkap</span>
                </button>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
