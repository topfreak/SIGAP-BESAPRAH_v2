/**
 * SIGAP BESAPRAH - Tax Engine
 * Berdasarkan aturan perpajakan instansi pemerintah BPS pada file Kelengkapan SPJ
 */

export const calculateTaxes = ({
  kodeAkun,
  kategori,
  nominal, // Nilai belanja termasuk PPN / Nilai bruto
  isPKP = true, // Apakah rekanan Pengusaha Kena Pajak
  rekananType = 'toko', // 'toko', 'catering', 'jasa', 'sewa', 'narasumber'
  penerimaPnsGol = null, // 'IV', 'III', 'II', 'I'
  isMitraNonPns = false,
  hasNPWP = true,
  tarifPpnKhusus = '11', // '11' or '1' (misal jasa pengiriman)
}) => {
  const bruto = Number(nominal) || 0
  let dpp = 0
  let ppn = 0
  let pph21 = 0
  let pph22 = 0
  let pph23 = 0
  let pph4_2 = 0
  let meterai = bruto > 5000000 ? 10000 : 0
  let notes = []

  // 1. Akun Belanja Honor Output Kegiatan (521213) & Jasa Profesi (522151) -> PPh 21
  if (kodeAkun === '521213' || kodeAkun === '522151' || kategori === 'Honor') {
    dpp = bruto
    if (penerimaPnsGol === 'IV') {
      pph21 = Math.round(bruto * 0.15)
      notes.push('PPh 21 Golongan IV: 15%')
    } else if (penerimaPnsGol === 'III') {
      pph21 = Math.round(bruto * 0.05)
      notes.push('PPh 21 Golongan III: 5%')
    } else if (penerimaPnsGol === 'II' || penerimaPnsGol === 'I') {
      pph21 = 0
      notes.push('PPh 21 Golongan I & II: 0%')
    } else if (isMitraNonPns) {
      // Mitra Non-PNS: PTKP Rp 4.500.000 / bulan
      const ptkp = 4500000
      if (bruto > ptkp) {
        const taxable = bruto - ptkp
        if (hasNPWP) {
          pph21 = Math.round(taxable * 0.05)
          notes.push('PPh 21 Mitra Non-PNS (NPWP): 5% x (Bruto - PTKP Rp 4,5 jt)')
        } else {
          pph21 = Math.round(taxable * 0.06)
          notes.push('PPh 21 Mitra Non-PNS (Non-NPWP): 6% x (Bruto - PTKP Rp 4,5 jt)')
        }
      } else {
        pph21 = 0
        notes.push('PPh 21 Mitra: Bruto <= PTKP (Rp 4.500.000), Pajak 0%')
      }
    }
  }

  // 2. Akun Belanja Bahan (521211) & Persediaan (521811)
  else if (kodeAkun === '521211' || kodeAkun === '521811' || kategori === 'Konsumsi' || kategori === 'Perlengkapan') {
    if (tarifPpnKhusus === '1') {
      dpp = Math.round((100 / 101) * bruto)
      ppn = Math.round((1 / 101) * bruto)
    } else {
      dpp = Math.round((100 / 111) * bruto)
      // PPN hanya jika transaksi > 2 juta dan PKP
      if (bruto > 2000000 && isPKP) {
        ppn = Math.round((11 / 111) * bruto)
        notes.push('PPN 11% (transaksi > Rp 2 jt dari PKP)')
      } else {
        dpp = bruto
        ppn = 0
      }
    }

    // PPh 22 untuk toko/warung > 2 juta
    if (rekananType === 'toko' || rekananType === 'barang') {
      if (bruto > 2000000) {
        pph22 = Math.round(0.015 * dpp)
        notes.push('PPh 22: 1,5% x DPP (transaksi pembelian barang > Rp 2 jt)')
      }
    } else if (rekananType === 'catering') {
      // Katering dikenakan PPh 23 tanpa batas minimal
      pph23 = Math.round(0.02 * dpp)
      notes.push('PPh 23 Jasa Katering: 2% x DPP (tanpa batasan minimal)')
    }
  }

  // 3. Sewa (522141)
  else if (kodeAkun === '522141' || kategori === 'Sewa') {
    dpp = Math.round((100 / 111) * bruto)
    if (bruto > 2000000 && isPKP) {
      ppn = Math.round((11 / 111) * bruto)
    }
    // PPh Final 4(2) sewa gedung / gudang
    pph4_2 = Math.round(0.10 * dpp) // Normal 10% untuk sewa tanah/bangunan
    notes.push('PPh Final Pasal 4(2) Sewa Gedung/Gudang')
  }

  // 4. Jasa Lainnya / Pengiriman (521219 / 522191)
  else if (kodeAkun === '521219' || kodeAkun === '522191') {
    if (tarifPpnKhusus === '1') {
      dpp = Math.round((100 / 101) * bruto)
      ppn = Math.round((1 / 101) * bruto)
      pph23 = Math.round(0.02 * dpp)
      notes.push('PPN Final 1% & PPh 23 (2%) atas jasa pengiriman')
    } else {
      dpp = Math.round((100 / 111) * bruto)
      if (bruto > 2000000 && isPKP) {
        ppn = Math.round((11 / 111) * bruto)
      }
      pph23 = Math.round(0.02 * dpp)
      notes.push('PPh 23 Jasa Publikasi/Lainnya (2% x DPP)')
    }
  }

  // 5. Paket Meeting (524114 / 524119)
  else if (kodeAkun === '524114' || kodeAkun === '524119') {
    dpp = Math.round((100 / 111) * bruto)
    if (bruto > 2000000 && isPKP) {
      ppn = Math.round((11 / 111) * bruto)
    }
    pph23 = Math.round(0.02 * dpp)
    notes.push('PPh 23 Paket Meeting Hotel (2% x DPP)')
  }

  // Total Potongan Pajak
  const totalPotongan = pph21 + pph22 + pph23 + pph4_2
  // Uang Bersih yang Diterima Rekanan/Penerima
  const netto = Math.max(0, bruto - totalPotongan)

  if (meterai > 0) {
    notes.push('Wajib Bea Meterai Rp 10.000 (transaksi > Rp 5.000.000)')
  }

  return {
    bruto,
    dpp,
    ppn,
    pph21,
    pph22,
    pph23,
    pph4_2,
    totalPotongan,
    netto,
    meterai,
    notes
  }
}
