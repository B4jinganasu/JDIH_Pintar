/* ============================================
   JDIH Pintar - Mock Legal Documents Data
   Google Drive Folder: "Praturan"
   Folder ID: 107J1Zmlhb0-Ba9u2ActNRkEgzjs9tKWl
   ============================================ */

const DRIVE_CONFIG = {
  folderId: '107J1Zmlhb0-Ba9u2ActNRkEgzjs9tKWl',
  apiKey: '', // Set your Google Drive API key here
  rootFolderName: 'Praturan'
};

const HIERARCHY_LEVELS = [
  { id: 'uud', name: 'UUD 1945', level: 1, icon: '🏛️', color: '#f59e0b', desc: 'Undang-Undang Dasar' },
  { id: 'tap-mpr', name: 'TAP MPR', level: 2, icon: '📜', color: '#ef4444', desc: 'Ketetapan MPR' },
  { id: 'uu', name: 'Undang-Undang', level: 3, icon: '📋', color: '#8b5cf6', desc: 'UU / Perppu' },
  { id: 'pp', name: 'Peraturan Pemerintah', level: 4, icon: '📄', color: '#3b82f6', desc: 'PP' },
  { id: 'perpres', name: 'Peraturan Presiden', level: 5, icon: '📑', color: '#06b6d4', desc: 'Perpres' },
  { id: 'permen', name: 'Peraturan Menteri', level: 6, icon: '📝', color: '#10b981', desc: 'Permen / Kepmen' },
  { id: 'perda-prov', name: 'Perda Provinsi', level: 7, icon: '🏢', color: '#f97316', desc: 'Perda Kalsel' },
  { id: 'perda', name: 'Perda Kabupaten', level: 8, icon: '🏘️', color: '#00d4ff', desc: 'Perda Tanah Bumbu' },
  { id: 'perbup', name: 'Peraturan Bupati', level: 9, icon: '📃', color: '#7c3aed', desc: 'Perbup Tanah Bumbu' },
  { id: 'sk', name: 'SK / Keputusan', level: 10, icon: '📎', color: '#ec4899', desc: 'SK Bupati / Kepala Dinas' }
];

const MOCK_DOCUMENTS = [
  // === UNDANG-UNDANG ===
  { id: 1, title: 'UU No. 23 Tahun 2014 tentang Pemerintahan Daerah', category: 'uu', year: 2014, number: '23',
    content: 'Undang-Undang tentang Pemerintahan Daerah mengatur penyelenggaraan pemerintahan daerah, pembagian urusan pemerintahan, penataan daerah, penyelenggara pemerintahan daerah, keuangan daerah, peraturan daerah, dan pembinaan pengawasan. Pemerintah daerah berwenang mengatur urusan pemerintahan konkuren yang menjadi kewenangan daerah. Termasuk di dalamnya urusan ketertiban umum, ketenteraman masyarakat, dan perlindungan masyarakat yang menjadi tanggung jawab Satuan Polisi Pamong Praja.',
    status: 'berlaku', ocrStatus: 'processed', driveFileId: 'mock_1', tags: ['pemerintahan', 'daerah', 'otonomi', 'satpol pp'] },
  { id: 2, title: 'UU No. 2 Tahun 2002 tentang Kepolisian Negara RI', category: 'uu', year: 2002, number: '2',
    content: 'Undang-Undang tentang Kepolisian Negara Republik Indonesia mengatur fungsi kepolisian, tugas pokok kepolisian, wewenang kepolisian, dan hubungan kepolisian dengan pemerintah daerah. Kepolisian bertugas memelihara keamanan dan ketertiban masyarakat, menegakkan hukum, dan memberikan perlindungan kepada masyarakat.',
    status: 'berlaku', ocrStatus: 'processed', driveFileId: 'mock_2', tags: ['kepolisian', 'keamanan', 'ketertiban'] },
  { id: 3, title: 'UU No. 22 Tahun 2009 tentang Lalu Lintas dan Angkutan Jalan', category: 'uu', year: 2009, number: '22',
    content: 'Undang-Undang tentang Lalu Lintas dan Angkutan Jalan mengatur ketertiban lalu lintas, perizinan angkutan, ketentuan pidana pelanggaran lalu lintas, denda pelanggaran, SIM, STNK, dan keselamatan berkendara. Pelanggaran lalu lintas dapat dikenakan sanksi administratif maupun pidana kurungan dan denda.',
    status: 'berlaku', ocrStatus: 'processed', driveFileId: 'mock_3', tags: ['lalu lintas', 'kendaraan', 'denda', 'pelanggaran'] },

  // === PERATURAN PEMERINTAH ===
  { id: 4, title: 'PP No. 16 Tahun 2018 tentang Satuan Polisi Pamong Praja', category: 'pp', year: 2018, number: '16',
    content: 'Peraturan Pemerintah tentang Satpol PP mengatur kedudukan, susunan organisasi, tugas dan fungsi, kewenangan, hak dan kewajiban, serta pembinaan Satuan Polisi Pamong Praja. Satpol PP bertugas menegakkan Perda dan Perkada, menyelenggarakan ketertiban umum dan ketenteraman, serta menyelenggarakan perlindungan masyarakat. Satpol PP berwenang melakukan tindakan penertiban terhadap pelanggaran Perda termasuk pelanggaran terkait prostitusi, minuman keras, dan pedagang kaki lima.',
    status: 'berlaku', ocrStatus: 'processed', driveFileId: 'mock_4', tags: ['satpol pp', 'ketertiban', 'penertiban', 'prostitusi', 'miras'] },
  { id: 5, title: 'PP No. 6 Tahun 2010 tentang Satuan Polisi Pamong Praja', category: 'pp', year: 2010, number: '6',
    content: 'Peraturan Pemerintah tentang Satpol PP yang mengatur tugas pokok dan fungsi dalam penegakan Peraturan Daerah. Memberikan kewenangan kepada Satpol PP untuk melakukan operasi penertiban, pengawasan, dan tindakan preventif maupun represif non-yustisial.',
    status: 'dicabut', ocrStatus: 'processed', driveFileId: 'mock_5', tags: ['satpol pp', 'penertiban'] },

  // === PERATURAN PRESIDEN ===
  { id: 6, title: 'Perpres No. 87 Tahun 2014 tentang Peraturan Pelaksanaan UU Pembentukan Peraturan', category: 'perpres', year: 2014, number: '87',
    content: 'Peraturan Presiden tentang pelaksanaan UU No 12 Tahun 2011 tentang Pembentukan Peraturan Perundang-undangan. Mengatur tata cara penyusunan Prolegnas, perencanaan penyusunan peraturan, teknik penyusunan, dan pengundangan.',
    status: 'berlaku', ocrStatus: 'processed', driveFileId: 'mock_6', tags: ['peraturan', 'penyusunan', 'prolegnas'] },

  // === PERDA KABUPATEN ===
  { id: 7, title: 'Perda Tanah Bumbu No. 3 Tahun 2015 tentang Ketertiban Umum', category: 'perda', year: 2015, number: '3',
    content: 'Peraturan Daerah tentang Ketertiban Umum dan Ketenteraman Masyarakat di Kabupaten Tanah Bumbu. Mengatur tentang larangan dan sanksi terkait: prostitusi dan perbuatan asusila di tempat umum, perjudian, minuman keras dan beralkohol, gelandangan dan pengemis, pedagang kaki lima yang mengganggu ketertiban, vandalisme, kebisingan, pembuangan sampah sembarangan, dan pelanggaran lainnya. Pelanggaran terhadap Perda ini diancam pidana kurungan paling lama 6 bulan atau denda paling banyak Rp 50.000.000.',
    status: 'berlaku', ocrStatus: 'processed', driveFileId: 'mock_7', tags: ['ketertiban', 'prostitusi', 'miras', 'pkl', 'sampah', 'denda', 'tanah bumbu'] },
  { id: 8, title: 'Perda Tanah Bumbu No. 5 Tahun 2017 tentang Pengelolaan Sampah', category: 'perda', year: 2017, number: '5',
    content: 'Peraturan Daerah tentang pengelolaan sampah rumah tangga dan sampah sejenis sampah rumah tangga di Kabupaten Tanah Bumbu. Setiap orang dilarang membuang sampah di luar tempat yang telah ditentukan. Pelanggaran dikenakan sanksi administratif berupa teguran tertulis, paksaan pemerintah, atau denda administratif.',
    status: 'berlaku', ocrStatus: 'processed', driveFileId: 'mock_8', tags: ['sampah', 'lingkungan', 'kebersihan', 'denda'] },
  { id: 9, title: 'Perda Tanah Bumbu No. 8 Tahun 2019 tentang Reklame', category: 'perda', year: 2019, number: '8',
    content: 'Peraturan Daerah tentang penyelenggaraan reklame di Kabupaten Tanah Bumbu. Mengatur jenis reklame, perizinan pemasangan reklame, lokasi pemasangan, pajak reklame, dan sanksi pelanggaran. Reklame yang dipasang tanpa izin akan dibongkar oleh Satpol PP. Denda pelanggaran reklame maksimal Rp 25.000.000.',
    status: 'berlaku', ocrStatus: 'processed', driveFileId: 'mock_9', tags: ['reklame', 'iklan', 'perizinan', 'pajak', 'denda'] },
  { id: 10, title: 'Perda Tanah Bumbu No. 2 Tahun 2016 tentang Larangan Minuman Beralkohol', category: 'perda', year: 2016, number: '2',
    content: 'Peraturan Daerah tentang larangan peredaran dan penjualan minuman beralkohol di Kabupaten Tanah Bumbu. Setiap orang dilarang memproduksi, mengedarkan, menjual, menyimpan, dan mengkonsumsi minuman beralkohol di tempat umum. Pelanggaran diancam pidana kurungan paling lama 3 bulan atau denda paling banyak Rp 50.000.000.',
    status: 'berlaku', ocrStatus: 'processed', driveFileId: 'mock_10', tags: ['miras', 'minuman keras', 'alkohol', 'denda', 'larangan'] },
  { id: 11, title: 'Perda Tanah Bumbu No. 6 Tahun 2018 tentang Bangunan Gedung', category: 'perda', year: 2018, number: '6',
    content: 'Peraturan Daerah tentang Bangunan Gedung di Kabupaten Tanah Bumbu mengatur persyaratan IMB, tata bangunan, keandalan bangunan, dan pembongkaran bangunan liar. Satpol PP berwenang melakukan penertiban bangunan yang tidak memiliki IMB.',
    status: 'berlaku', ocrStatus: 'pending', driveFileId: 'mock_11', tags: ['bangunan', 'imb', 'penertiban', 'pembongkaran'] },
  { id: 12, title: 'Perda Tanah Bumbu No. 4 Tahun 2020 tentang Pencegahan Prostitusi', category: 'perda', year: 2020, number: '4',
    content: 'Peraturan Daerah tentang pencegahan dan penanggulangan prostitusi di Kabupaten Tanah Bumbu. Setiap orang dilarang melakukan kegiatan prostitusi, menyediakan tempat untuk prostitusi, menjadi mucikari atau perantara prostitusi. Pemilik hotel, penginapan, dan tempat hiburan wajib mencegah kegiatan prostitusi di tempat usahanya. Pelanggaran diancam pidana kurungan paling lama 6 bulan atau denda paling banyak Rp 50.000.000. Satpol PP bersama kepolisian berwenang melakukan razia dan penertiban.',
    status: 'berlaku', ocrStatus: 'processed', driveFileId: 'mock_12', tags: ['prostitusi', 'asusila', 'hotel', 'penginapan', 'razia', 'denda'] },

  // === PERBUP ===
  { id: 13, title: 'Perbup Tanah Bumbu No. 15 Tahun 2019 tentang Tugas Satpol PP', category: 'perbup', year: 2019, number: '15',
    content: 'Peraturan Bupati tentang kedudukan, susunan organisasi, tugas, fungsi, dan tata kerja Satuan Polisi Pamong Praja Kabupaten Tanah Bumbu. Satpol PP bertugas menegakkan Perda dan Perbup, menyelenggarakan ketertiban umum dan ketenteraman masyarakat, serta perlindungan masyarakat.',
    status: 'berlaku', ocrStatus: 'processed', driveFileId: 'mock_13', tags: ['satpol pp', 'organisasi', 'tugas', 'fungsi'] },
  { id: 14, title: 'Perbup Tanah Bumbu No. 22 Tahun 2020 tentang Pedoman PPNS', category: 'perbup', year: 2020, number: '22',
    content: 'Peraturan Bupati tentang pedoman pelaksanaan tugas Penyidik Pegawai Negeri Sipil (PPNS) di lingkungan Pemerintah Kabupaten Tanah Bumbu. PPNS bertugas melakukan penyidikan terhadap pelanggaran Perda dan Perbup sesuai dengan ketentuan peraturan perundang-undangan.',
    status: 'berlaku', ocrStatus: 'processed', driveFileId: 'mock_14', tags: ['ppns', 'penyidik', 'penyidikan', 'pelanggaran'] },
  { id: 15, title: 'Perbup Tanah Bumbu No. 10 Tahun 2021 tentang Trantibum', category: 'perbup', year: 2021, number: '10',
    content: 'Peraturan Bupati tentang penyelenggaraan ketertiban umum dan ketenteraman masyarakat di Kabupaten Tanah Bumbu. Mengatur SOP penertiban, prosedur razia, koordinasi dengan instansi terkait, dan mekanisme penegakan Perda di lapangan.',
    status: 'berlaku', ocrStatus: 'pending', driveFileId: 'mock_15', tags: ['ketertiban', 'trantibum', 'razia', 'penertiban', 'sop'] },

  // === SK / KEPUTUSAN ===
  { id: 16, title: 'SK Bupati No. 188/2021 tentang Tim Penertiban Gabungan', category: 'sk', year: 2021, number: '188',
    content: 'Surat Keputusan Bupati Tanah Bumbu tentang pembentukan Tim Penertiban Gabungan yang terdiri dari Satpol PP, Kepolisian, TNI, dan dinas terkait untuk melakukan operasi penertiban terhadap pelanggaran Perda di wilayah Kabupaten Tanah Bumbu.',
    status: 'berlaku', ocrStatus: 'processed', driveFileId: 'mock_16', tags: ['penertiban', 'tim gabungan', 'operasi'] },

  // === PERDA PROVINSI ===
  { id: 17, title: 'Perda Kalsel No. 4 Tahun 2018 tentang Ketertiban Umum', category: 'perda-prov', year: 2018, number: '4',
    content: 'Peraturan Daerah Provinsi Kalimantan Selatan tentang penyelenggaraan ketertiban umum, ketenteraman masyarakat, dan perlindungan masyarakat. Berlaku sebagai pedoman bagi kabupaten/kota di Kalimantan Selatan.',
    status: 'berlaku', ocrStatus: 'processed', driveFileId: 'mock_17', tags: ['ketertiban', 'kalsel', 'provinsi'] },

  // === PERATURAN MENTERI ===
  { id: 18, title: 'Permendagri No. 26 Tahun 2020 tentang Satpol PP', category: 'permen', year: 2020, number: '26',
    content: 'Peraturan Menteri Dalam Negeri tentang penyelenggaraan ketertiban umum dan ketenteraman masyarakat serta perlindungan masyarakat. Mengatur standar pelayanan minimal, kapasitas Satpol PP, dan koordinasi lintas sektor.',
    status: 'berlaku', ocrStatus: 'processed', driveFileId: 'mock_18', tags: ['satpol pp', 'ketertiban', 'pelayanan'] },

  // More documents
  { id: 19, title: 'Perda Tanah Bumbu No. 1 Tahun 2022 tentang Pedagang Kaki Lima', category: 'perda', year: 2022, number: '1',
    content: 'Peraturan Daerah tentang penataan dan pemberdayaan pedagang kaki lima di Kabupaten Tanah Bumbu. Pedagang kaki lima wajib memiliki izin lokasi, menjaga kebersihan, dan tidak mengganggu arus lalu lintas. Pelanggaran dikenakan sanksi pencabutan izin dan pembongkaran.',
    status: 'berlaku', ocrStatus: 'processed', driveFileId: 'mock_19', tags: ['pkl', 'pedagang', 'izin', 'penertiban'] },
  { id: 20, title: 'UU No. 11 Tahun 2008 tentang Informasi dan Transaksi Elektronik', category: 'uu', year: 2008, number: '11',
    content: 'Undang-Undang tentang ITE mengatur transaksi elektronik, tanda tangan elektronik, penyelenggaraan sistem elektronik, dan perbuatan yang dilarang. Termasuk larangan penyebaran konten asusila, perjudian online, penghinaan, ancaman, dan berita bohong melalui media elektronik.',
    status: 'berlaku', ocrStatus: 'processed', driveFileId: 'mock_20', tags: ['ite', 'elektronik', 'internet', 'asusila', 'hoax'] },
  { id: 21, title: 'Perda Tanah Bumbu No. 7 Tahun 2023 tentang Perlindungan Anak', category: 'perda', year: 2023, number: '7',
    content: 'Peraturan Daerah tentang perlindungan anak di Kabupaten Tanah Bumbu. Mengatur hak-hak anak, pencegahan kekerasan terhadap anak, eksploitasi anak, pekerja anak, dan perlindungan anak dari prostitusi serta narkotika.',
    status: 'berlaku', ocrStatus: 'pending', driveFileId: 'mock_21', tags: ['anak', 'perlindungan', 'kekerasan', 'eksploitasi', 'prostitusi'] },
  { id: 22, title: 'PP No. 28 Tahun 2008 tentang Denda Pelanggaran', category: 'pp', year: 2008, number: '28',
    content: 'Peraturan Pemerintah tentang pengenaan sanksi administratif berupa denda di bidang ketertiban umum. Mengatur besaran denda minimum dan maksimum untuk berbagai jenis pelanggaran Perda.',
    status: 'berlaku', ocrStatus: 'processed', driveFileId: 'mock_22', tags: ['denda', 'sanksi', 'pelanggaran'] },
  { id: 23, title: 'Perbup Tanah Bumbu No. 30 Tahun 2022 tentang Prosedur Penyegelan', category: 'perbup', year: 2022, number: '30',
    content: 'Peraturan Bupati tentang prosedur penyegelan dan penutupan tempat usaha yang melanggar peraturan daerah. Termasuk tempat hiburan malam, kafe, hotel, dan usaha lain yang terbukti memfasilitasi prostitusi, perjudian, atau peredaran minuman keras ilegal.',
    status: 'berlaku', ocrStatus: 'processed', driveFileId: 'mock_23', tags: ['penyegelan', 'penutupan', 'prostitusi', 'miras', 'judi', 'hotel'] },
  { id: 24, title: 'UU No. 35 Tahun 2009 tentang Narkotika', category: 'uu', year: 2009, number: '35',
    content: 'Undang-Undang tentang Narkotika mengatur pencegahan, pemberantasan penyalahgunaan dan peredaran gelap narkotika. Setiap orang yang tanpa hak menanam, memelihara, memiliki, menyimpan, menguasai, atau menyediakan narkotika golongan I diancam pidana penjara paling singkat 4 tahun dan paling lama 12 tahun.',
    status: 'berlaku', ocrStatus: 'processed', driveFileId: 'mock_24', tags: ['narkotika', 'narkoba', 'penyalahgunaan', 'pidana'] },
  { id: 25, title: 'Perda Tanah Bumbu No. 9 Tahun 2021 tentang Retribusi Izin Tempat Usaha', category: 'perda', year: 2021, number: '9',
    content: 'Peraturan Daerah tentang retribusi perizinan tempat usaha tertentu di Kabupaten Tanah Bumbu. Mengatur tarif retribusi untuk izin mendirikan bangunan, izin gangguan, izin trayek, dan izin usaha perikanan.',
    status: 'berlaku', ocrStatus: 'processed', driveFileId: 'mock_25', tags: ['retribusi', 'izin', 'usaha', 'imb'] }
];

// Category statistics
function getCategoryStats() {
  const stats = {};
  HIERARCHY_LEVELS.forEach(h => { stats[h.id] = { ...h, count: 0 }; });
  MOCK_DOCUMENTS.forEach(doc => { if (stats[doc.category]) stats[doc.category].count++; });
  return stats;
}

function getRecentDocuments(limit = 5) {
  return [...MOCK_DOCUMENTS].sort((a, b) => b.year - a.year).slice(0, limit);
}

function getDocumentById(id) {
  return MOCK_DOCUMENTS.find(d => d.id === id);
}

function getDocumentsByCategory(cat) {
  return MOCK_DOCUMENTS.filter(d => d.category === cat);
}

function getTotalDocuments() {
  return MOCK_DOCUMENTS.length;
}

function getOcrPendingCount() {
  return MOCK_DOCUMENTS.filter(d => d.ocrStatus === 'pending').length;
}
