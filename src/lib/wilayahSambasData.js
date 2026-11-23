// Data Master Wilayah & SLS BPS Kabupaten Sambas (Provinsi 61, Kabupaten 01)
// Kode Wilayah Hierarki BPS:
// - Provinsi: 61 (2 digit)
// - Kabupaten: 01 (2 digit)
// - Kecamatan: 3 digit (e.g. 010, 011, 020, ... 090)
// - Desa/Kelurahan: 3 digit (e.g. 001, 002, ...)
// - SLS (Satuan Lingkungan Setempat): 4 digit (e.g. 0001, 0002, ...)
// - Sub-SLS: 2 digit (e.g. 00, 01, ...)

const RAW_KECAMATAN_DATA = [
  {
    kode_kec: "010",
    nama_kec: "Selakau",
    ibu_kota: "Kuala",
    desa: [
      "Semelagi Besar", "Sungai Daun", "Sungai Rusa", "Pangkalan Bemban",
      "Sungai Nyirih", "Kuala", "Parit Baru", "Twi Mentibar",
      "Bentunai", "Parit Kongsi", "Gayung Bersambut"
    ]
  },
  {
    kode_kec: "011",
    nama_kec: "Selakau Timur",
    ibu_kota: "Selakau Tua",
    desa: [
      "Gelik", "Seranggam", "Selakau Tua", "Buduk Sempadang"
    ]
  },
  {
    kode_kec: "020",
    nama_kec: "Pemangkat",
    ibu_kota: "Pemangkat Kota",
    desa: [
      "Perapakan", "Jelutung", "Harapan", "Penjajap",
      "Pemangkat Kota", "Sebatuan", "Gugah Sejahtera", "Lonam"
    ]
  },
  {
    kode_kec: "021",
    nama_kec: "Semparuk",
    ibu_kota: "Semparuk",
    desa: [
      "Seburing", "Sepadu", "Sepinggan", "Semparuk", "Singaraya"
    ]
  },
  {
    kode_kec: "022",
    nama_kec: "Salatiga",
    ibu_kota: "Salatiga",
    desa: [
      "Parit Baru", "Salatiga", "Sungai Toman", "Serumpun", "Serunai"
    ]
  },
  {
    kode_kec: "030",
    nama_kec: "Tebas",
    ibu_kota: "Tebas Kuala",
    desa: [
      "Seret Ayon", "Maribas", "Batu Makjage", "Bukit Sigoler",
      "Serindang", "Matang Labong", "Mak Tangguk", "Segedong",
      "Pusaka", "Mensere", "Sungai Kelambu", "Serumpun Buluh",
      "Pangkalan Kongsi", "Dungun Perapakan", "Tebas Sungai", "Sejiram",
      "Seberkat", "Sempalai", "Bekut", "Mak Rampai",
      "Tebas Kuala", "Mekar Sekuntum", "Segarau Parit"
    ]
  },
  {
    kode_kec: "031",
    nama_kec: "Tekarang",
    ibu_kota: "Tekarang",
    desa: [
      "Matang Segarau", "Rambayan", "Sari Makmur", "Tekarang",
      "Sempadian", "Cepala", "Merubung"
    ]
  },
  {
    kode_kec: "040",
    nama_kec: "Sambas",
    ibu_kota: "Dalam Kaum",
    desa: [
      "Sungai Rambah", "Gapura", "Kartiasa", "Saing Rambi",
      "Lumbang", "Durian", "Pasar Melayu", "Pendawan",
      "Tanjung Bugis", "Lubuk Dagang", "Dalam Kaum", "Tanjung Mekar",
      "Tumuk Manggis", "Jagur", "Lorong", "Semangau",
      "Sumber Harapan", "Sebayan"
    ]
  },
  {
    kode_kec: "041",
    nama_kec: "Subah",
    ibu_kota: "Balai Gemuruh",
    desa: [
      "Arga Pura", "Balai Gemuruh", "Bukit Mulya", "Karaban Jaya",
      "Madak", "Mensade", "Mukti Raharja", "Sabung",
      "Sempurna", "Sungai Deden", "Sungai Sapak"
    ]
  },
  {
    kode_kec: "042",
    nama_kec: "Sebawi",
    ibu_kota: "Sebawi",
    desa: [
      "Sebangun", "Sebawi", "Semanjang", "Sempalai Sebedang",
      "Sepuk Tanjung", "Tebing Batu", "Tempatan"
    ]
  },
  {
    kode_kec: "043",
    nama_kec: "Sajad",
    ibu_kota: "Tengguli",
    desa: [
      "Beringin", "Jirak", "Mekar Jaya", "Tengguli"
    ]
  },
  {
    kode_kec: "050",
    nama_kec: "Jawai",
    ibu_kota: "Sentebang",
    desa: [
      "Bakau", "Dungun Laut", "Lambau", "Mutus Darussalam",
      "Parit Setia", "Pelimpaan", "Sarang Burung Danau", "Sarang Burung Kolam",
      "Sarang Burung Kuala", "Sarang Burung Usrat", "Sentebang", "Sungai Nilam",
      "Sungai Nyirih"
    ]
  },
  {
    kode_kec: "051",
    nama_kec: "Jawai Selatan",
    ibu_kota: "Matang Terap",
    desa: [
      "Jawai Laut", "Jelu Air", "Matang Terap", "Sabaran",
      "Sarilaba A", "Sarilaba B", "Semperiuk A", "Semperiuk B", "Suah Api"
    ]
  },
  {
    kode_kec: "060",
    nama_kec: "Teluk Keramat",
    ibu_kota: "Sekura",
    desa: [
      "Berlimang", "Kuala Pangkalan Keramat", "Kubangga", "Lela",
      "Matang Segantar", "Mekar Sekuntum", "Mulia", "Pedada",
      "Pipit Teja", "Puringan", "Sabing", "Samustida",
      "Sayang Sedayu", "Sebagu", "Sekura", "Sengawang",
      "Sepadu", "Sungai Baru", "Sungai Kumpai", "Sungai Serabek",
      "Tambatan", "Tanjung Kerucut", "Teluk Kaseh", "Teluk Kumbang", "Tri Mandayan"
    ]
  },
  {
    kode_kec: "061",
    nama_kec: "Galing",
    ibu_kota: "Galing",
    desa: [
      "Galing", "Ratu Sepudak", "Sagu", "Sijang",
      "Sungai Palah", "Teluk Pandan", "Tempapan Hulu", "Tempapan Kuala",
      "Tri Gadu", "Tri Kembang"
    ]
  },
  {
    kode_kec: "062",
    nama_kec: "Tangaran",
    ibu_kota: "Simpang Empat",
    desa: [
      "Arung Medang", "Arung Parak", "Merabuan", "Merpati",
      "Pancur", "Semata", "Simpang Empat", "Tangaran"
    ]
  },
  {
    kode_kec: "070",
    nama_kec: "Sejangkung",
    ibu_kota: "Parit Raja",
    desa: [
      "Parit Raja", "Penakalan", "Perigi Landu", "Perigi Limus",
      "Piantus", "Sekuduk", "Semanga", "Sendoyan",
      "Senujuh", "Sepantai", "Setalik", "Sulung"
    ]
  },
  {
    kode_kec: "080",
    nama_kec: "Sajingan Besar",
    ibu_kota: "Kaliau",
    desa: [
      "Kaliau'", "Santaban", "Sebunga", "Senatab", "Sungai Bening"
    ]
  },
  {
    kode_kec: "090",
    nama_kec: "Paloh",
    ibu_kota: "Nibung",
    desa: [
      "Kalimantan", "Malek", "Matang Danau", "Mentibar",
      "Nibung", "Sebubus", "Tanah Hitam", "Temajuk"
    ]
  }
];

const NAMA_DUSUN_POOL = [
  "Dusun Melati", "Dusun Kenanga", "Dusun Mawar", "Dusun Anggrek",
  "Dusun Cempaka", "Dusun Flamboyan", "Dusun Sejahtera", "Dusun Harapan",
  "Dusun Mandiri", "Dusun Bakti", "Dusun Makmur", "Dusun Kencana",
  "Dusun Sinar Pagi", "Dusun Suka Maju", "Dusun Beringin", "Dusun Nelayan"
];

// Helper generate SLS per desa
function generateSlsList(kodeKec, kodeDesa, namaDesa, desaIndex) {
  // Rata-rata 4 - 6 SLS per desa
  const count = 4 + ((desaIndex * 3 + parseInt(kodeKec, 10)) % 4);
  const slsList = [];

  for (let s = 1; s <= count; s++) {
    const kodeSls = String(s).padStart(4, "0"); // 4 digit SLS
    const dusunName = NAMA_DUSUN_POOL[(s + desaIndex) % NAMA_DUSUN_POOL.length];
    const rtNumber = String(s).padStart(3, "0");
    const namaSls = `RT ${rtNumber} / ${dusunName}`;
    
    // Sub-SLS: mayoritas '00' (utuh), sebagian memiliki sub '01' / '02'
    const hasSplit = (s % 4 === 0);
    const subSlsList = [];

    if (hasSplit) {
      subSlsList.push({
        kode_sub_sls: "01",
        nama_sub_sls: "Sub-SLS 01 (Sektor Barat)",
        status: "Pemekaran"
      });
      subSlsList.push({
        kode_sub_sls: "02",
        nama_sub_sls: "Sub-SLS 02 (Sektor Timur)",
        status: "Pemekaran"
      });
    } else {
      subSlsList.push({
        kode_sub_sls: "00",
        nama_sub_sls: "Sub-SLS 00 (Utuh)",
        status: "Utuh"
      });
    }

    slsList.push({
      kode_sls: kodeSls,
      nama_sls: namaSls,
      jenis: "RT",
      kode_full_sls: `6101${kodeKec}${kodeDesa}${kodeSls}`,
      kode_bps_sls_formatted: `61.01.${kodeKec}.${kodeDesa}.${kodeSls}`,
      sub_sls: subSlsList
    });
  }

  return slsList;
}

// Build hierarchical structure
export const MASTER_WILAYAH_SAMBAS = RAW_KECAMATAN_DATA.map((k, kIdx) => {
  const desaList = k.desa.map((namaDesa, dIdx) => {
    const kodeDesa = String(dIdx + 1).padStart(3, "0"); // 3 digit Desa
    const slsList = generateSlsList(k.kode_kec, kodeDesa, namaDesa, dIdx + kIdx);
    const totalSubSls = slsList.reduce((acc, curr) => acc + curr.sub_sls.length, 0);

    return {
      kode_desa: kodeDesa,
      nama_desa: namaDesa,
      jenis: namaDesa.toLowerCase().includes("pasar") || namaDesa.toLowerCase().includes("kota") ? "Kelurahan" : "Desa",
      kode_full_desa: `6101${k.kode_kec}${kodeDesa}`,
      kode_bps_formatted: `61.01.${k.kode_kec}.${kodeDesa}`,
      jumlah_sls: slsList.length,
      jumlah_sub_sls: totalSubSls,
      sls: slsList
    };
  });

  const totalSlsKec = desaList.reduce((acc, curr) => acc + curr.jumlah_sls, 0);
  const totalSubSlsKec = desaList.reduce((acc, curr) => acc + curr.jumlah_sub_sls, 0);

  return {
    kode_prov: "61",
    nama_prov: "Kalimantan Barat",
    kode_kab: "01",
    nama_kab: "Sambas",
    kode_kec: k.kode_kec, // 3 digit Kecamatan
    nama_kec: k.nama_kec,
    ibu_kota: k.ibu_kota,
    kode_full_kec: `6101${k.kode_kec}`,
    kode_bps_formatted: `61.01.${k.kode_kec}`,
    jumlah_desa: desaList.length,
    jumlah_sls: totalSlsKec,
    jumlah_sub_sls: totalSubSlsKec,
    desa: desaList
  };
});

// Summary Stats
export const STATISTIK_WILAYAH_SAMBAS = {
  provinsi: { kode: "61", nama: "Kalimantan Barat" },
  kabupaten: { kode: "01", nama: "Sambas" },
  total_kecamatan: MASTER_WILAYAH_SAMBAS.length,
  total_desa: MASTER_WILAYAH_SAMBAS.reduce((acc, k) => acc + k.jumlah_desa, 0),
  total_sls: MASTER_WILAYAH_SAMBAS.reduce((acc, k) => acc + k.jumlah_sls, 0),
  total_sub_sls: MASTER_WILAYAH_SAMBAS.reduce((acc, k) => acc + k.jumlah_sub_sls, 0)
};
