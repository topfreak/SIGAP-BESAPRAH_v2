/**
 * SIGAP BESAPRAH - IndexedDB Document Vault
 * Engine penyimpanan berkas digital lokal berkapasitas besar (PDF, Gambar Kuitansi, Lampiran)
 * agar tidak membebani kuota sempit localStorage.
 */

const DB_NAME = 'sigap_besaprah_vault';
const DB_VERSION = 1;
const STORE_NAME = 'documents';

function openDB() {
  return new Promise((resolve, reject) => {
    if (typeof window === 'undefined' || !window.indexedDB) {
      reject(new Error('IndexedDB tidak didukung oleh browser ini.'));
      return;
    }

    const request = window.indexedDB.open(DB_NAME, DB_VERSION);

    request.onupgradeneeded = (event) => {
      const db = event.target.result;
      if (!db.objectStoreNames.contains(STORE_NAME)) {
        db.createObjectStore(STORE_NAME, { keyPath: 'id' });
      }
    };

    request.onsuccess = () => resolve(request.result);
    request.onerror = () => reject(request.error);
  });
}

export const documentVault = {
  /**
   * Simpan file asli (File/Blob) beserta metadata ke IndexedDB
   */
  async saveFile(fileId, file) {
    try {
      const arrayBuffer = await file.arrayBuffer();
      const db = await openDB();
      return new Promise((resolve, reject) => {
        const tx = db.transaction(STORE_NAME, 'readwrite');
        const store = tx.objectStore(STORE_NAME);
        const record = {
          id: fileId,
          name: file.name,
          type: file.type || 'application/pdf',
          size: file.size,
          data: arrayBuffer,
          uploadedAt: new Date().toISOString()
        };
        const req = store.put(record);
        req.onsuccess = () => resolve(record);
        req.onerror = () => reject(req.error);
      });
    } catch (err) {
      console.error('documentVault.saveFile error:', err);
      throw err;
    }
  },

  /**
   * Ambil record file dari IndexedDB
   */
  async getFile(fileId) {
    try {
      const db = await openDB();
      return new Promise((resolve, reject) => {
        const tx = db.transaction(STORE_NAME, 'readonly');
        const store = tx.objectStore(STORE_NAME);
        const req = store.get(fileId);
        req.onsuccess = () => resolve(req.result || null);
        req.onerror = () => reject(req.error);
      });
    } catch (err) {
      console.error('documentVault.getFile error:', err);
      return null;
    }
  },

  /**
   * Buat Blob URL yang bisa langsung ditampilkan di <iframe> atau <img>
   */
  async getFileObjectUrl(fileId) {
    const record = await this.getFile(fileId);
    if (!record || !record.data) return null;
    const blob = new Blob([record.data], { type: record.type || 'application/pdf' });
    return {
      url: URL.createObjectURL(blob),
      name: record.name,
      type: record.type,
      size: record.size,
      uploadedAt: record.uploadedAt
    };
  },

  /**
   * Hapus file dari IndexedDB
   */
  async deleteFile(fileId) {
    try {
      const db = await openDB();
      return new Promise((resolve, reject) => {
        const tx = db.transaction(STORE_NAME, 'readwrite');
        const store = tx.objectStore(STORE_NAME);
        const req = store.delete(fileId);
        req.onsuccess = () => resolve(true);
        req.onerror = () => reject(req.error);
      });
    } catch (err) {
      console.error('documentVault.deleteFile error:', err);
      return false;
    }
  }
};

export function formatFileSize(bytes) {
  if (!bytes || bytes === 0) return '0 B';
  const k = 1024;
  const sizes = ['B', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return parseFloat((bytes / Math.pow(k, i)).toFixed(1)) + ' ' + sizes[i];
}
