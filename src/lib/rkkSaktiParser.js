/**
 * SIGAP BESAPRAH - Parser & Exporter RKK Website SAKTI (XLSX & PDF)
 * Mendukung:
 * 1. Import RKK SAKTI format Excel (.xlsx, .xls, .csv) termasuk kolom RPD & Realisasi 12 bulan
 * 2. Import RKK SAKTI format PDF cetak resmi (39 halaman Rincian Kertas Kerja Satker)
 * 3. Ekspor POK & RPD ke format Excel resmi BPS Kabupaten Sambas
 */

import * as XLSX from 'xlsx';
import * as pdfjsLib from 'pdfjs-dist';
import pdfWorker from 'pdfjs-dist/build/pdf.worker.min.mjs?url';
import { detectTimKerjaByKegiatan, NAMA_BULAN } from './pokRpdData';

// Konfigurasi Worker PDF.js untuk Vite
pdfjsLib.GlobalWorkerOptions.workerSrc = pdfWorker;

// Clean numeric strings (handles commas/dots/spaces)
function parseNum(val) {
  if (typeof val === 'number') return isNaN(val) ? 0 : Math.round(val);
  if (!val) return 0;
  const str = String(val).replace(/[^0-9-]/g, '');
  const n = parseInt(str, 10);
  return isNaN(n) ? 0 : n;
}

// Clean float volume
function parseFloatSafe(val) {
  if (typeof val === 'number') return val;
  if (!val) return 0;
  const cleaned = String(val).replace(/,/g, '').replace(/[^0-9.]/g, '');
  const f = parseFloat(cleaned);
  return isNaN(f) ? 0 : f;
}

/**
 * Normalisasi RPD default jika file import hanya RKK murni (tanpa kolom bulanan):
 * Mengalokasikan pagu pada bulan yang masih berjalan/tersisa atau merata secara proporsional.
 */
function buildDefaultMonthlyRpd(pagu, realisasiAwal = null) {
  const arr = new Array(12).fill(0);
  if (!pagu || pagu <= 0) return arr;
  // Letakkan pada bulan aktif atau distribusi proporsional triwulan IV sebagai default awal
  arr[10] = Math.round(pagu * 0.5); // Nov
  arr[11] = pagu - arr[10];           // Des
  return arr;
}

/**
 * 1. PARSER EXCEL / CSV RKK SAKTI
 */
export async function parseRkkExcel(file) {
  const buffer = await file.arrayBuffer();
  const workbook = XLSX.read(buffer, { type: 'array' });
  const sheetName = workbook.SheetNames[0];
  const sheet = workbook.Sheets[sheetName];
  const rows = XLSX.utils.sheet_to_json(sheet, { header: 1, defval: '' });

  let metadata = {
    tahun_anggaran: 2026,
    kemen_lemb: '(054) BADAN PUSAT STATISTIK',
    unit_org: '(01) Badan Pusat Statistik',
    satker_kode: '428392',
    satker_nama: 'BADAN PUSAT STATISTIK KAB. SAMBAS',
    lokasi: 'KAB. SAMBAS',
    sumber_import: `Import Excel SAKTI (${file.name})`,
    tanggal_import: new Date().toISOString().split('T')[0]
  };

  // Cari kolom bulan jika format RPD 12 bulan tersedia
  let hasMonthlyColumns = false;
  let monthStartCol = -1;
  let paguCol = -1;

  for (let r = 0; r < Math.min(10, rows.length); r++) {
    const row = rows[r].map(c => String(c || '').trim());
    const janIdx = row.findIndex(c => c.toLowerCase() === 'januari');
    if (janIdx !== -1) {
      hasMonthlyColumns = true;
      monthStartCol = janIdx;
    }
    const pIdx = row.findIndex(c => c.toLowerCase().includes('pagu'));
    if (pIdx !== -1 && paguCol === -1) {
      paguCol = pIdx;
    }
  }

  // Fallback jika header Pagu di kolom indeks 9 atau 4
  if (paguCol === -1) paguCol = 9;

  const accounts = [];
  let ctx = {
    programKode: '054.01.GG',
    programNama: 'Program Penyediaan dan Pelayanan Informasi Statistik',
    kegiatanKode: '',
    kegiatanNama: '',
    outputKode: '',
    outputNama: '',
    komponenKode: '',
    komponenNama: '',
    subKomponen: 'A - TANPA SUB KOMPONEN',
    currentAccount: null
  };

  const reProgram = /^\d{3}\.\d{2}\.[A-Z0-9]{2}$/;
  const reKegiatan = /^\d{4}$/;
  const reOutput = /^\d{4}\.[A-Z]{3}\.[A-Z0-9]{3}$/;
  const reKomponen = /^\d{3}$/;
  const reSubKomp = /^[A-Z]$/;
  const reAkun = /^5\d{5}$/;

  for (let i = 0; i < rows.length; i++) {
    const row = rows[i];
    if (!row || row.length === 0) continue;

    // Deteksi kode di kolom 0 atau kolom 1
    let col0 = String(row[0] || '').trim();
    let col1 = String(row[1] || '').trim();
    let code = col0 || col1;

    // Cari uraian di kolom teks pertama setelah kode (biasanya col 3 atau col 1)
    let uraian = '';
    for (let c = 1; c < Math.min(6, row.length); c++) {
      const cellStr = String(row[c] || '').trim();
      if (cellStr && !reAkun.test(cellStr) && cellStr !== '-') {
        uraian = cellStr;
        break;
      }
    }

    // Ambil pagu
    let rowPagu = parseNum(row[paguCol]);
    if (rowPagu === 0 && paguCol === 9) {
      // Coba cari nilai angka besar di kolom 7..11
      for (let c = 5; c < Math.min(12, row.length); c++) {
        const val = parseNum(row[c]);
        if (val >= 1000 && c !== 7) { // c=7 sering harga satuan
          rowPagu = val;
          break;
        }
      }
    }

    if (reProgram.test(code)) {
      ctx.programKode = code;
      ctx.programNama = uraian || ctx.programNama;
      ctx.currentAccount = null;
    } else if (reKegiatan.test(code)) {
      ctx.kegiatanKode = code;
      ctx.kegiatanNama = uraian;
      ctx.currentAccount = null;
    } else if (reOutput.test(code)) {
      ctx.outputKode = code;
      ctx.outputNama = uraian;
      ctx.currentAccount = null;
    } else if (reKomponen.test(code)) {
      ctx.komponenKode = code;
      ctx.komponenNama = uraian;
      ctx.currentAccount = null;
    } else if (reSubKomp.test(code)) {
      ctx.subKomponen = `${code} - ${uraian || 'SUB KOMPONEN'}`;
    } else if (reAkun.test(code) || (col1 && reAkun.test(col1))) {
      const kodeAkun = reAkun.test(code) ? code : col1;
      const namaAkun = String(row[3] || row[2] || uraian || `Akun ${kodeAkun}`).trim();

      let rpdBulanan = new Array(12).fill(0);
      let realisasiAwal = new Array(12).fill(0);

      if (hasMonthlyColumns && monthStartCol !== -1) {
        for (let mIdx = 0; mIdx < 12; mIdx++) {
          rpdBulanan[mIdx] = parseNum(row[monthStartCol + mIdx * 2]);
          realisasiAwal[mIdx] = parseNum(row[monthStartCol + mIdx * 2 + 1]);
        }
      } else {
        rpdBulanan = buildDefaultMonthlyRpd(rowPagu);
      }

      const accId = `${ctx.outputKode || ctx.kegiatanKode}-${ctx.komponenKode || '000'}-${kodeAkun}-${accounts.length}`;
      const newAcc = {
        id: accId,
        programKode: ctx.programKode,
        programNama: ctx.programNama,
        kegiatanKode: ctx.kegiatanKode,
        kegiatanNama: ctx.kegiatanNama,
        outputKode: ctx.outputKode,
        outputNama: ctx.outputNama,
        komponenKode: ctx.komponenKode,
        komponenNama: ctx.komponenNama,
        subKomponen: ctx.subKomponen,
        timKerja: detectTimKerjaByKegiatan(ctx.kegiatanKode, `${ctx.kegiatanNama} ${ctx.outputNama}`),
        kodeAkun,
        namaAkun,
        sumberDana: 'RM',
        pagu: rowPagu,
        rpdBulanan,
        realisasiAwal,
        items: []
      };

      accounts.push(newAcc);
      ctx.currentAccount = newAcc;
    } else if (ctx.currentAccount) {
      // Baris rincian item (volume / satuan / harga satuan)
      const isItemDash = String(row[3] || '').trim() === '-' || String(row[4] || '').trim().length > 2;
      const itemDesc = String(row[4] || row[3] || row[2] || '').trim();
      const volRaw = String(row[6] || '').trim();
      const harga = parseNum(row[7]);
      const jumlah = parseNum(row[9] || row[8]);

      if (itemDesc && !itemDesc.toLowerCase().includes('kppn') && (jumlah > 0 || harga > 0 || isItemDash)) {
        const volMatch = volRaw.match(/^([\d.,]+)\s*(.*)$/);
        ctx.currentAccount.items.push({
          deskripsi: itemDesc,
          volume: volMatch ? parseFloatSafe(volMatch[1]) : 1,
          satuan: volMatch && volMatch[2] ? volMatch[2] : 'Paket',
          hargaSatuan: harga || jumlah,
          jumlah: jumlah || rowPagu
        });
      }
    }
  }

  return {
    metadata,
    accounts,
    summary: {
      totalAccounts: accounts.length,
      totalPagu: accounts.reduce((sum, a) => sum + (a.pagu || 0), 0),
      hasMonthlyRpd: hasMonthlyColumns
    }
  };
}

/**
 * 2. PARSER PDF RKK SAKTI RESMI (Menangani dokumen RKK 39 halaman SAKTI)
 */
export async function parseRkkPdf(file) {
  const arrayBuffer = await file.arrayBuffer();
  const pdf = await pdfjsLib.getDocument({ data: arrayBuffer }).promise;

  let allLines = [];

  for (let pageNum = 1; pageNum <= pdf.numPages; pageNum++) {
    const page = await pdf.getPage(pageNum);
    const textContent = await page.getTextContent();

    // Kelompokkan item teks berdasarkan koordinat Y (toleransi 3px)
    const rowsByY = {};
    for (const item of textContent.items) {
      const text = item.str;
      if (!text || !text.trim()) continue;
      const y = Math.round(item.transform[5] / 3) * 3;
      const x = Math.round(item.transform[4]);
      if (!rowsByY[y]) rowsByY[y] = [];
      rowsByY[y].push({ x, text: text.trim() });
    }

    // Urutkan Y dari atas ke bawah (koordinat PDF Y membesar ke atas)
    const sortedYs = Object.keys(rowsByY).map(Number).sort((a, b) => b - a);
    for (const y of sortedYs) {
      const items = rowsByY[y].sort((a, b) => a.x - b.x);
      const lineStr = items.map(i => i.text).join(' ');
      allLines.push({ lineStr, items });
    }
  }

  let metadata = {
    tahun_anggaran: 2026,
    kemen_lemb: '(054) BADAN PUSAT STATISTIK',
    unit_org: '(01) Badan Pusat Statistik',
    satker_kode: '428392',
    satker_nama: 'BADAN PUSAT STATISTIK KAB. SAMBAS',
    lokasi: 'KAB. SAMBAS',
    sumber_import: `Import PDF RKK SAKTI (${file.name}, ${pdf.numPages} Hal)`,
    tanggal_import: new Date().toISOString().split('T')[0]
  };

  // Cari Alokasi Satker & Tahun dari header PDF
  for (const { lineStr } of allLines.slice(0, 25)) {
    const mAlokasi = lineStr.match(/ALOKASI\s*[:\s]*Rp\.?\s*([\d.,]+)/i);
    if (mAlokasi) metadata.alokasi_pdf = parseNum(mAlokasi[1]);
    const mTahun = lineStr.match(/T\.A\.\s*(\d{4})/i);
    if (mTahun) metadata.tahun_anggaran = parseInt(mTahun[1], 10);
  }

  const accounts = [];
  let ctx = {
    programKode: '054.01.GG',
    programNama: 'Program Penyediaan dan Pelayanan Informasi Statistik',
    kegiatanKode: '',
    kegiatanNama: '',
    outputKode: '',
    outputNama: '',
    komponenKode: '',
    komponenNama: '',
    subKomponen: 'A - TANPA SUB KOMPONEN',
    currentAccount: null
  };

  const reProgram = /^(\d{3}\.\d{2}\.[A-Z0-9]{2})\s+(.+?)\s+([\d,]+)$/;
  const reKegiatan = /^(\d{4})\s+(.+?)\s+([\d,]+)$/;
  const reOutput = /^(\d{4}\.[A-Z]{3}\.[A-Z0-9]{3})\s+(.+?)(?:\s+([\d,]+))?$/;
  const reKomponen = /^(\d{3})\s+([A-Za-z].+?)\s+([\d,]+)(?:\s+[UP])?$/;
  const reAkun = /^(5\d{5})\s+(.+?)\s+([\d,]+)(?:\s+9)?(?:\s+RM)?$/;
  const reAkunAlt = /\b(5\d{5})\b\s+([A-Za-z\s(),/-]+?)\s+([\d,]{4,})/;

  for (const { lineStr, items } of allLines) {
    // Skip header / footer halaman
    if (
      lineStr.includes('RINCIAN KERTAS KERJA') ||
      lineStr.includes('PERHITUNGAN TAHUN') ||
      lineStr.includes('KEMEN/LEMB') ||
      lineStr.includes('(KPPN.') ||
      lineStr.startsWith('Halaman :')
    ) {
      continue;
    }

    const firstToken = items[0]?.text || '';

    // 1. Cek Program
    if (/^\d{3}\.\d{2}\.[A-Z0-9]{2}$/.test(firstToken)) {
      ctx.programKode = firstToken;
      ctx.programNama = items.slice(1, -1).map(i => i.text).join(' ') || ctx.programNama;
      continue;
    }

    // 2. Cek Output RO (misal 2896.BMA.004)
    if (/^\d{4}\.[A-Z]{3}\.[A-Z0-9]{3}$/.test(firstToken)) {
      ctx.outputKode = firstToken;
      ctx.outputNama = items.slice(1).filter(i => !/^[\d,]+$/.test(i.text)).map(i => i.text).join(' ');
      continue;
    }

    // 3. Cek Kegiatan 4 digit (misal 2902)
    if (/^\d{4}$/.test(firstToken)) {
      ctx.kegiatanKode = firstToken;
      ctx.kegiatanNama = items.slice(1).filter(i => !/^[\d,]+$/.test(i.text)).map(i => i.text).join(' ');
      continue;
    }

    // 4. Cek Komponen 3 digit (misal 051, 005, 530)
    if (/^\d{3}$/.test(firstToken) && items.length >= 2) {
      ctx.komponenKode = firstToken;
      ctx.komponenNama = items.slice(1).filter(i => !/^[\d,]+$/.test(i.text) && i.text !== 'U' && i.text !== 'P').map(i => i.text).join(' ');
      continue;
    }

    // 5. Cek Akun 6 digit (5xxxxx)
    let matchedAkun = null;
    let akunNama = '';
    let akunPagu = 0;

    if (/^5\d{5}$/.test(firstToken)) {
      matchedAkun = firstToken;
      // Cari nominal di sebelah kanan (angka dengan koma ribuan >= 1000)
      const numItems = items.filter(i => /^[\d,]+$/.test(i.text) && parseNum(i.text) >= 1000);
      akunPagu = numItems.length > 0 ? parseNum(numItems[numItems.length - 1].text) : 0;
      akunNama = items
        .slice(1)
        .filter(i => i.text !== 'RM' && i.text !== '9' && !/^[\d,]+$/.test(i.text))
        .map(i => i.text)
        .join(' ');
    } else {
      const mAlt = lineStr.match(reAkunAlt);
      if (mAlt) {
        matchedAkun = mAlt[1];
        akunNama = mAlt[2].trim();
        akunPagu = parseNum(mAlt[3]);
      }
    }

    if (matchedAkun) {
      const accId = `${ctx.outputKode || ctx.kegiatanKode}-${ctx.komponenKode || '000'}-${matchedAkun}-${accounts.length}`;
      const newAcc = {
        id: accId,
        programKode: ctx.programKode,
        programNama: ctx.programNama,
        kegiatanKode: ctx.kegiatanKode,
        kegiatanNama: ctx.kegiatanNama,
        outputKode: ctx.outputKode,
        outputNama: ctx.outputNama,
        komponenKode: ctx.komponenKode,
        komponenNama: ctx.komponenNama,
        subKomponen: ctx.subKomponen,
        timKerja: detectTimKerjaByKegiatan(ctx.kegiatanKode, `${ctx.kegiatanNama} ${ctx.outputNama}`),
        kodeAkun: matchedAkun,
        namaAkun: akunNama || `Belanja Akun ${matchedAkun}`,
        sumberDana: 'RM',
        pagu: akunPagu,
        rpdBulanan: buildDefaultMonthlyRpd(akunPagu),
        realisasiAwal: new Array(12).fill(0),
        items: []
      };
      accounts.push(newAcc);
      ctx.currentAccount = newAcc;
      continue;
    }

    // 6. Cek baris detail item (diawali '-' atau memiliki pola Volume + Satuan + Harga + Jumlah)
    if (ctx.currentAccount) {
      const itemMatch = lineStr.match(/^[-]?\s*(.+?)\s+(\d+(?:\.\d+)?)\s+([A-Za-z/-]+)\s+([\d,]+)\s+([\d,]+)(?:\s+\*)?$/);
      if (itemMatch) {
        ctx.currentAccount.items.push({
          deskripsi: itemMatch[1].replace(/^-\s*/, '').trim(),
          volume: parseFloat(itemMatch[2]) || 1,
          satuan: itemMatch[3],
          hargaSatuan: parseNum(itemMatch[4]),
          jumlah: parseNum(itemMatch[5])
        });
      }
    }
  }

  return {
    metadata,
    accounts,
    summary: {
      totalAccounts: accounts.length,
      totalPagu: accounts.reduce((sum, a) => sum + (a.pagu || 0), 0),
      hasMonthlyRpd: false,
      pdfPages: pdf.numPages
    }
  };
}

/**
 * 3. EKSPOR POK & RPD 12 BULAN KE EXCEL (.xlsx) SESUAI FORMAT RESMI DINAS
 */
export function exportRkkRpdToExcel(pokAccounts, metadata) {
  const header1 = [
    'Program / Kegiatan / Output / Akun',
    'Kode Akun',
    'Uraian Belanja',
    'Tim Kerja',
    'Pagu Revisi (Rp)',
    'Total Realisasi (Rp)',
    '% Serapan',
    'Sisa Anggaran (Rp)'
  ];

  // Tambah 24 kolom bulanan (RPD & Realisasi Jan - Des)
  NAMA_BULAN.forEach(bln => {
    header1.push(`${bln} (RPD)`);
    header1.push(`${bln} (Realisasi)`);
  });

  const rows = [header1];

  pokAccounts.forEach(acc => {
    const totalRealisasi = acc.realisasiGabungan
      ? acc.realisasiGabungan.reduce((a, b) => a + b, 0)
      : acc.realisasiAwal.reduce((a, b) => a + b, 0);
    const sisa = (acc.pagu || 0) - totalRealisasi;
    const persen = acc.pagu > 0 ? ((totalRealisasi / acc.pagu) * 100).toFixed(1) + '%' : '0%';

    const r = [
      `${acc.kegiatanKode} / ${acc.outputKode} / ${acc.komponenKode}`,
      acc.kodeAkun,
      `${acc.namaAkun} (${acc.outputNama || acc.kegiatanNama})`,
      acc.timKerja,
      acc.pagu || 0,
      totalRealisasi,
      persen,
      sisa
    ];

    for (let i = 0; i < 12; i++) {
      r.push(acc.rpdBulanan?.[i] || 0);
      r.push((acc.realisasiGabungan ? acc.realisasiGabungan[i] : acc.realisasiAwal?.[i]) || 0);
    }

    rows.push(r);
  });

  const ws = XLSX.utils.aoa_to_sheet(rows);
  const wb = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(wb, ws, 'POK_RPD_2026');
  XLSX.writeFile(wb, `POK_RPD_BPS_Sambas_${metadata?.tahun_anggaran || 2026}_${new Date().toISOString().split('T')[0]}.xlsx`);
}
