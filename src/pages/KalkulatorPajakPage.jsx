import React, { useState } from 'react';
import { Calculator, Sparkles, AlertCircle, Info, BookOpen, RefreshCw } from 'lucide-react';
import { calculateTaxes } from '../lib/taxEngine';

export default function KalkulatorPajakPage() {
  const [nominal, setNominal] = useState(11000000);
  const [kategori, setKategori] = useState('Bahan');
  const [rekananType, setRekananType] = useState('toko');
  const [pnsGol, setPnsGol] = useState('');
  const [isMitra, setIsMitra] = useState(false);
  const [hasNPWP, setHasNPWP] = useState(true);
  const [isPKP, setIsPKP] = useState(true);
  const [tarifPpn, setTarifPpn] = useState('11');

  const tax = calculateTaxes({
    kodeAkun: kategori === 'Honor' ? '521213' : '521211',
    kategori,
    nominal,
    isPKP,
    rekananType,
    penerimaPnsGol: pnsGol || null,
    isMitraNonPns: isMitra,
    hasNPWP,
    tarifPpnKhusus: tarifPpn
  });

  return (
    <div className="space-y-6 max-w-5xl mx-auto">
      <div>
        <h1 className="text-2xl font-extrabold text-slate-900 tracking-tight flex items-center gap-2.5">
          <Calculator className="w-7 h-7 text-purple-700" />
          <span>Kalkulator & Simulator Pajak SPJ</span>
        </h1>
        <p className="text-xs text-slate-500 mt-0.5">
          Perhitungan otomatis PPN 11% / 1%, PPh 21, PPh 22, PPh 23, PPh 4(2), dan ketentuan bea meterai instansi pemerintah
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Input Form Controls */}
        <div className="lg:col-span-7 p-6 rounded-3xl bg-white border border-purple-100 shadow-sm space-y-4">
          <h2 className="text-sm font-bold text-slate-800 border-b border-purple-50 pb-2">
            Parameter Transaksi Belanja
          </h2>

          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">
              Nominal Belanja Termasuk Pajak (Bruto)
            </label>
            <div className="relative">
              <span className="absolute left-3.5 top-1/2 -translate-y-1/2 font-bold text-xs text-purple-700">Rp</span>
              <input
                type="number"
                value={nominal}
                onChange={(e) => setNominal(Number(e.target.value) || 0)}
                step="10000"
                min="0"
                className="w-full pl-10 pr-4 py-2.5 bg-purple-50/40 border border-purple-200 rounded-xl text-base font-bold text-purple-950 focus:ring-2 focus:ring-purple-400"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-[11px] font-bold text-slate-700 mb-1">
                Kategori Transaksi
              </label>
              <select
                value={kategori}
                onChange={(e) => {
                  setKategori(e.target.value);
                  if (e.target.value === 'Honor') {
                    setIsMitra(true);
                  } else {
                    setIsMitra(false);
                    setPnsGol('');
                  }
                }}
                className="w-full px-3 py-2 bg-purple-50/40 border border-purple-200 rounded-xl text-xs font-medium"
              >
                <option value="Bahan">Belanja Bahan / Barang / ATK (521211 / 521811)</option>
                <option value="Honor">Honor Output / Jasa Profesi (521213 / 522151)</option>
                <option value="Sewa">Sewa Gedung / Gudang (522141)</option>
                <option value="Jasa">Jasa Pengiriman / Publisitas (521219 / 522191)</option>
              </select>
            </div>

            {kategori === 'Bahan' && (
              <div>
                <label className="block text-[11px] font-bold text-slate-700 mb-1">
                  Jenis Pengadaan Bahan
                </label>
                <select
                  value={rekananType}
                  onChange={(e) => setRekananType(e.target.value)}
                  className="w-full px-3 py-2 bg-purple-50/40 border border-purple-200 rounded-xl text-xs font-medium"
                >
                  <option value="toko">Toko / Warung Makan (PPh 22 &gt; 2 Juta)</option>
                  <option value="catering">Jasa Katering (PPh 23 2% tanpa minimal)</option>
                  <option value="barang">Barang Cetakan / Komputer (PPh 22)</option>
                </select>
              </div>
            )}

            {kategori === 'Honor' && (
              <div>
                <label className="block text-[11px] font-bold text-slate-700 mb-1">
                  Penerima Honor
                </label>
                <select
                  value={pnsGol}
                  onChange={(e) => {
                    setPnsGol(e.target.value);
                    setIsMitra(!e.target.value);
                  }}
                  className="w-full px-3 py-2 bg-purple-50/40 border border-purple-200 rounded-xl text-xs font-medium"
                >
                  <option value="">Mitra Non-PNS (PTKP Rp 4,5 Juta/bln)</option>
                  <option value="IV">PNS Golongan IV (Tarif 15%)</option>
                  <option value="III">PNS Golongan III (Tarif 5%)</option>
                  <option value="II">PNS Golongan I & II (Tarif 0%)</option>
                </select>
              </div>
            )}
          </div>

          <div className="pt-2 border-t border-purple-100 flex flex-wrap gap-4 text-xs font-medium text-slate-700">
            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                checked={isPKP}
                onChange={(e) => setIsPKP(e.target.checked)}
                className="rounded text-purple-600"
              />
              <span>Rekanan PKP (Dikenakan PPN)</span>
            </label>

            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                checked={hasNPWP}
                onChange={(e) => setHasNPWP(e.target.checked)}
                className="rounded text-purple-600"
              />
              <span>Memiliki NPWP</span>
            </label>
          </div>
        </div>

        {/* Calculation Result Breakdown */}
        <div className="lg:col-span-5 p-6 rounded-3xl bg-gradient-to-br from-[#2E1065] to-[#4C1D95] text-white shadow-xl space-y-4">
          <div className="flex items-center justify-between border-b border-purple-400/30 pb-3">
            <span className="text-xs font-bold uppercase tracking-wider text-purple-200">
              Hasil Simulasi Pajak
            </span>
            <span className="text-[10px] bg-amber-400 text-purple-950 font-bold px-2 py-0.5 rounded">
              SIAP SETOR
            </span>
          </div>

          <div className="space-y-2 text-xs">
            <div className="flex justify-between py-1 border-b border-purple-800/40">
              <span className="text-purple-200">Nilai Bruto Transaksi</span>
              <span className="font-mono font-bold text-white">Rp {tax.bruto.toLocaleString('id-ID')}</span>
            </div>
            <div className="flex justify-between py-1 border-b border-purple-800/40">
              <span className="text-purple-200">Dasar Pengenaan Pajak (DPP)</span>
              <span className="font-mono">Rp {tax.dpp.toLocaleString('id-ID')}</span>
            </div>
            {tax.ppn > 0 && (
              <div className="flex justify-between py-1 text-amber-300 border-b border-purple-800/40">
                <span>PPN Dipungut (11%)</span>
                <span className="font-mono font-bold">+ Rp {tax.ppn.toLocaleString('id-ID')}</span>
              </div>
            )}
            {tax.pph21 > 0 && (
              <div className="flex justify-between py-1 text-rose-300 border-b border-purple-800/40">
                <span>PPh Pasal 21</span>
                <span className="font-mono font-bold">- Rp {tax.pph21.toLocaleString('id-ID')}</span>
              </div>
            )}
            {tax.pph22 > 0 && (
              <div className="flex justify-between py-1 text-rose-300 border-b border-purple-800/40">
                <span>PPh Pasal 22 (1,5%)</span>
                <span className="font-mono font-bold">- Rp {tax.pph22.toLocaleString('id-ID')}</span>
              </div>
            )}
            {tax.pph23 > 0 && (
              <div className="flex justify-between py-1 text-rose-300 border-b border-purple-800/40">
                <span>PPh Pasal 23 (2%)</span>
                <span className="font-mono font-bold">- Rp {tax.pph23.toLocaleString('id-ID')}</span>
              </div>
            )}
            {tax.pph4_2 > 0 && (
              <div className="flex justify-between py-1 text-rose-300 border-b border-purple-800/40">
                <span>PPh Final Pasal 4(2)</span>
                <span className="font-mono font-bold">- Rp {tax.pph4_2.toLocaleString('id-ID')}</span>
              </div>
            )}
          </div>

          <div className="p-3.5 rounded-2xl bg-white/10 border border-white/10 space-y-1">
            <span className="text-[11px] text-purple-200 block">Uang Diterima Rekanan (Netto):</span>
            <span className="text-2xl font-black text-amber-300 font-mono block">
              Rp {tax.netto.toLocaleString('id-ID')}
            </span>
          </div>

          {tax.meterai > 0 && (
            <div className="p-2.5 rounded-xl bg-amber-400/20 text-amber-200 text-xs border border-amber-300/30">
              ⚡ <strong>Wajib Meterai 10.000:</strong> Karena transaksi bernilai &gt; Rp 5.000.000.
            </div>
          )}

          {tax.notes.length > 0 && (
            <div className="text-[10px] text-purple-200 space-y-0.5 pt-2 border-t border-purple-800/40">
              <span className="font-bold text-white block">Ketentuan Regulasi:</span>
              {tax.notes.map((n, i) => (
                <div key={i}>• {n}</div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
