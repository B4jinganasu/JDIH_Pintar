const LEGAL_KNOWLEDGE=[
{id:'pkl',keywords:['pkl','pedagang kaki lima','pedagang','lapak','kaki lima'],icon:'🛒',title:'Pedagang Kaki Lima (PKL)',
summary:'Peraturan tentang kegiatan usaha PKL di ruang publik.',statusBerlaku:true,
jenis:['PKL Tetap','PKL Musiman','PKL Keliling'],
dasarHukum:[{peraturan:'Perda Tanah Bumbu No. 1/2022',pasal:'Pasal 25–29'},{peraturan:'Perda No. 3/2015',pasal:'Ketertiban Umum'}],
pasals:[
{ref:'Pasal 25–29',tipe:'ketentuan',isi:'Kewajiban, larangan, lokasi PKL, dan pemberdayaan oleh Pemda.'},
{ref:'Pasal 29 ayat (1)',tipe:'sanksi',isi:'Teguran lisan, denda, penghentian kegiatan, pembongkaran.'},
{ref:'Pasal 29 ayat (2)',tipe:'sanksi',isi:'Denda administratif maksimal Rp 500.000.'},
{ref:'Pasal 26',tipe:'kewajiban',isi:'Setiap PKL wajib mematuhi tempat dan waktu kegiatan, menjaga kebersihan lokasi.'}
]},

{id:'ketertiban',keywords:['ketertiban','ketertiban umum','trantibum','ketenteraman','penertiban','keamanan'],icon:'🚔',
title:'Ketertiban Umum & Ketenteraman Masyarakat',
summary:'Peraturan tentang ketertiban di ruang publik dan sanksinya.',statusBerlaku:true,
jenis:['Ketertiban Jalan','Ketertiban Fasilitas Umum','Ketertiban Lingkungan'],
dasarHukum:[{peraturan:'Perda Tanah Bumbu No. 3/2015',pasal:'Pasal 1–30'},{peraturan:'PP No. 16/2018',pasal:'Satpol PP'}],
pasals:[
{ref:'Pasal umum',tipe:'ketentuan',isi:'Melarang tindakan mengganggu ketertiban umum, mengotori fasilitas publik.'},
{ref:'Sanksi Administratif',tipe:'sanksi',isi:'Teguran lisan/tertulis, denda, penghentian kegiatan.'},
{ref:'Sanksi Pidana',tipe:'sanksi',isi:'Pidana kurungan maks 3 bulan dan/atau denda maks Rp 50.000.000.'},
{ref:'Penindakan',tipe:'kewajiban',isi:'Satpol PP berwenang melakukan penertiban, razia, dan penyitaan barang.'}
]},

{id:'retribusi',keywords:['retribusi','retribusi daerah','pungutan','tarif retribusi'],icon:'🏷️',
title:'Retribusi Daerah',summary:'Pungutan daerah atas jasa layanan dan perizinan.',statusBerlaku:true,
jenis:['Retribusi Jasa Umum','Retribusi Jasa Usaha','Retribusi Perizinan Tertentu'],
dasarHukum:[{peraturan:'Perda Tanah Bumbu No. 9/2021',pasal:'Retribusi Izin Tempat Usaha'},{peraturan:'UU No. 28/2009',pasal:'Pajak & Retribusi Daerah'}],
pasals:[
{ref:'Objek Retribusi',tipe:'ketentuan',isi:'Retribusi Jasa Umum, Jasa Usaha, Perizinan Tertentu.'},
{ref:'Kewajiban',tipe:'kewajiban',isi:'Wajib retribusi mendaftar, membayar tepat waktu, menyimpan bukti.'},
{ref:'Sanksi Administratif',tipe:'sanksi',isi:'Denda 2% per bulan dari retribusi terutang, maks 24 bulan.'},
{ref:'Sanksi Pidana',tipe:'sanksi',isi:'Pidana kurungan 3 bulan atau denda 3× retribusi terutang.'}
]},

{id:'miras',keywords:['miras','minuman keras','beralkohol','alkohol','arak','bir'],icon:'🍺',
title:'Larangan Minuman Beralkohol',summary:'Larangan produksi, peredaran, penjualan minuman beralkohol.',statusBerlaku:true,
jenis:['Golongan A (1-5%)','Golongan B (5-20%)','Golongan C (20-55%)'],
dasarHukum:[{peraturan:'Perda Tanah Bumbu No. 2/2016',pasal:'Pasal 1–15'}],
pasals:[
{ref:'Larangan Umum',tipe:'larangan',isi:'Dilarang memproduksi, menjual, mengedarkan, mengonsumsi di tempat umum.'},
{ref:'Lokasi Terlarang',tipe:'larangan',isi:'Dilarang di sekolah, masjid, perkantoran, fasilitas publik.'},
{ref:'Sanksi Penjual',tipe:'sanksi',isi:'Pencabutan izin usaha, denda, pidana kurungan hingga 3 bulan.'},
{ref:'Penindakan',tipe:'kewajiban',isi:'Satpol PP berwenang menyita dan memusnahkan miras ilegal.'}
]},

{id:'bangunan',keywords:['bangunan','imb','gedung','pbg','konstruksi','mendirikan bangunan'],icon:'🏗️',
title:'Bangunan Gedung & Perizinan (IMB/PBG)',summary:'Kewajiban IMB/PBG dan sanksi bangunan tanpa izin.',statusBerlaku:true,
jenis:['Bangunan Hunian','Bangunan Komersial','Bangunan Khusus','Bangunan Campuran'],
dasarHukum:[{peraturan:'Perda Tanah Bumbu No. 6/2018',pasal:'Bangunan Gedung'},{peraturan:'PP No. 16/2021',pasal:'PBG'}],
pasals:[
{ref:'Kewajiban IMB/PBG',tipe:'kewajiban',isi:'Setiap pendirian/perubahan bangunan wajib memiliki PBG.'},
{ref:'Persyaratan Teknis',tipe:'ketentuan',isi:'Harus memenuhi standar keselamatan, kesehatan, kenyamanan.'},
{ref:'Sanksi Bangunan Liar',tipe:'sanksi',isi:'Teguran, denda, penghentian pembangunan, pembongkaran.'},
{ref:'Sanksi Pidana',tipe:'sanksi',isi:'Kurungan 3–6 bulan dan/atau denda Rp 50.000.000.'}
]},

{id:'sampah',keywords:['sampah','limbah','kebersihan','buang sampah','lingkungan','kotor'],icon:'🗑️',
title:'Pengelolaan Sampah & Kebersihan',summary:'Kewajiban menjaga kebersihan dan sanksi buang sampah sembarangan.',statusBerlaku:true,
jenis:['Sampah Organik','Sampah Anorganik','Sampah B3','Sampah Spesifik'],
dasarHukum:[{peraturan:'Perda Tanah Bumbu No. 5/2017',pasal:'Pengelolaan Sampah'},{peraturan:'UU No. 18/2008',pasal:'Pengelolaan Sampah'}],
pasals:[
{ref:'Kewajiban',tipe:'kewajiban',isi:'Wajib memilah sampah, menyediakan tempat sampah, buang di TPS.'},
{ref:'Larangan',tipe:'larangan',isi:'Dilarang membuang sampah di jalan, saluran air, sungai, tempat umum.'},
{ref:'Sanksi Perorangan',tipe:'sanksi',isi:'Teguran, denda Rp 250.000–2.000.000, atau kerja sosial.'},
{ref:'Sanksi Badan Usaha',tipe:'sanksi',isi:'Denda Rp 5.000.000–50.000.000 dan pembekuan izin usaha.'}
]},

{id:'disiplin-asn',keywords:['disiplin','disiplin asn','disiplin pns','hukuman disiplin','pegawai','asn','pns','kode etik'],icon:'👔',
title:'Disiplin ASN/PNS',summary:'Kewajiban, larangan, dan hukuman disiplin bagi ASN.',statusBerlaku:true,
jenis:['Hukuman Ringan','Hukuman Sedang','Hukuman Berat'],
dasarHukum:[{peraturan:'PP No. 94/2021',pasal:'Disiplin PNS'},{peraturan:'UU No. 5/2014',pasal:'ASN'}],
pasals:[
{ref:'Hukuman Ringan',tipe:'sanksi',isi:'Teguran lisan, teguran tertulis, pernyataan tidak puas.'},
{ref:'Hukuman Sedang',tipe:'sanksi',isi:'Penundaan KGB 1 tahun, penundaan pangkat 1 tahun.'},
{ref:'Hukuman Berat',tipe:'sanksi',isi:'Penurunan pangkat 3 tahun, pembebasan jabatan, pemberhentian.'},
{ref:'Larangan',tipe:'larangan',isi:'Dilarang jadi pengurus parpol, korupsi, menerima gratifikasi.'}
]},

{id:'naskah-dinas',keywords:['nota dinas','naskah dinas','surat dinas','disposisi','memo','tata naskah','surat tugas','surat edaran'],icon:'📋',
title:'Tata Naskah Dinas',summary:'Peraturan tentang jenis, format, dan tata cara pembuatan naskah dinas.',statusBerlaku:true,
jenis:['Nota Dinas','Surat Dinas','Surat Edaran','Disposisi','Surat Tugas','Surat Perintah','Telaahan Staf','Laporan'],
dasarHukum:[{peraturan:'Permendagri No. 54/2009',pasal:'Tata Naskah Dinas'},{peraturan:'Perbup Tanah Bumbu',pasal:'Pedoman Tata Naskah Dinas'}],
pasals:[
{ref:'Nota Dinas',tipe:'ketentuan',isi:'Naskah dinas internal untuk komunikasi antar pejabat/unit kerja berisi pemberitahuan, permintaan, atau instruksi.'},
{ref:'Surat Dinas',tipe:'ketentuan',isi:'Naskah dinas untuk komunikasi resmi keluar instansi. Harus bernomor, bertanggal, dan bertandatangan pejabat berwenang.'},
{ref:'Kewajiban Format',tipe:'kewajiban',isi:'Wajib menggunakan format resmi: kop surat, nomor, lampiran, perihal, dan tanda tangan basah/elektronik.'},
{ref:'Pelanggaran Prosedur',tipe:'sanksi',isi:'ASN yang memalsukan atau menyalahgunakan naskah dinas dikenai hukuman disiplin berat hingga pemberhentian.'}
]},

{id:'sppd',keywords:['sppd','perjalanan dinas','perjadin','biaya perjalanan','lumpsum','uang harian'],icon:'✈️',
title:'SPPD / Perjalanan Dinas',summary:'Peraturan tentang tata cara, biaya, dan pertanggungjawaban perjalanan dinas.',statusBerlaku:true,
jenis:['Perjalanan Dinas Dalam Daerah','Perjalanan Dinas Luar Daerah','Perjalanan Dinas Luar Negeri'],
dasarHukum:[{peraturan:'Perbup Tanah Bumbu tentang SPPD',pasal:'Biaya Perjalanan Dinas'},{peraturan:'Permendagri No. 59/2019',pasal:'Perjalanan Dinas'}],
pasals:[
{ref:'Komponen Biaya',tipe:'ketentuan',isi:'Uang harian (lumpsum), biaya transport, penginapan, dan uang representasi.'},
{ref:'Kewajiban Pelaporan',tipe:'kewajiban',isi:'Wajib menyampaikan laporan hasil perjalanan dinas paling lambat 5 hari kerja setelah kembali.'},
{ref:'Pertanggungjawaban',tipe:'kewajiban',isi:'Bukti pengeluaran riil (tiket, boarding pass, kuitansi hotel) wajib dilampirkan.'},
{ref:'Sanksi Penyalahgunaan',tipe:'sanksi',isi:'Pengembalian biaya dan hukuman disiplin jika SPPD fiktif atau tidak sesuai ketentuan.'}
]},

{id:'tpp',keywords:['tpp','tambahan penghasilan','tunjangan kinerja','insentif','remunerasi'],icon:'💰',
title:'TPP / Tambahan Penghasilan Pegawai',summary:'Peraturan tentang pemberian tambahan penghasilan berdasarkan kinerja ASN.',statusBerlaku:true,
jenis:['TPP Beban Kerja','TPP Prestasi Kerja','TPP Kondisi Kerja','TPP Kelangkaan Profesi'],
dasarHukum:[{peraturan:'Perbup Tanah Bumbu tentang TPP',pasal:'Tambahan Penghasilan ASN'},{peraturan:'PP No. 12/2019',pasal:'Pengelolaan Keuangan Daerah'}],
pasals:[
{ref:'Komponen TPP',tipe:'ketentuan',isi:'Dihitung berdasarkan kehadiran, kinerja harian, dan capaian sasaran kerja pegawai (SKP).'},
{ref:'Kewajiban Presensi',tipe:'kewajiban',isi:'ASN wajib melakukan presensi elektronik (fingerprint). Keterlambatan memotong TPP.'},
{ref:'Pemotongan',tipe:'sanksi',isi:'Tidak hadir tanpa keterangan: potong 3-5% per hari. Terlambat: potong 0.5-1% per jam.'},
{ref:'Pencabutan TPP',tipe:'sanksi',isi:'TPP dicabut 100% jika dijatuhi hukuman disiplin sedang atau berat.'}
]},

{id:'cuti',keywords:['cuti','cuti pns','cuti tahunan','cuti besar','cuti sakit','cuti melahirkan','izin'],icon:'🏖️',
title:'Cuti ASN/PNS',summary:'Hak cuti pegawai ASN beserta jenis dan ketentuannya.',statusBerlaku:true,
jenis:['Cuti Tahunan (12 hari)','Cuti Besar (3 bulan)','Cuti Sakit','Cuti Melahirkan (3 bulan)','Cuti Alasan Penting','Cuti Luar Tanggungan Negara'],
dasarHukum:[{peraturan:'PP No. 11/2017',pasal:'Manajemen PNS'},{peraturan:'UU No. 5/2014',pasal:'ASN'}],
pasals:[
{ref:'Cuti Tahunan',tipe:'ketentuan',isi:'12 hari kerja per tahun, dapat ditumpuk maks 18 hari jika tidak diambil.'},
{ref:'Cuti Sakit',tipe:'ketentuan',isi:'1–14 hari cukup surat dokter, >14 hari perlu rekomendasi tim penguji kesehatan.'},
{ref:'Kewajiban',tipe:'kewajiban',isi:'Wajib mengajukan permohonan tertulis dan mendapat persetujuan atasan langsung.'},
{ref:'Pelanggaran',tipe:'sanksi',isi:'Tidak masuk tanpa cuti/izin dianggap mangkir, dikenai hukuman disiplin.'}
]},

{id:'prostitusi',keywords:['prostitusi','asusila','pelacuran','psk','mucikari'],icon:'🚫',
title:'Pencegahan Prostitusi',summary:'Larangan kegiatan prostitusi dan sanksinya.',statusBerlaku:true,
jenis:['Prostitusi Terselubung','Prostitusi Online','Prostitusi Jalanan'],
dasarHukum:[{peraturan:'Perda Tanah Bumbu No. 4/2020',pasal:'Pencegahan Prostitusi'},{peraturan:'Perda No. 3/2015',pasal:'Ketertiban Umum'}],
pasals:[
{ref:'Larangan',tipe:'larangan',isi:'Dilarang melakukan, menyediakan tempat, menjadi mucikari/perantara prostitusi.'},
{ref:'Kewajiban Hotel',tipe:'kewajiban',isi:'Pemilik hotel/penginapan wajib mencegah kegiatan prostitusi di tempatnya.'},
{ref:'Sanksi Pidana',tipe:'sanksi',isi:'Kurungan maks 6 bulan atau denda maks Rp 50.000.000.'},
{ref:'Penindakan',tipe:'kewajiban',isi:'Satpol PP bersama kepolisian berwenang melakukan razia dan penertiban.'}
]},

{id:'sanksi-perda',keywords:['sanksi','denda','pidana','kurungan','hukuman','pelanggaran','penegakan perda'],icon:'🔨',
title:'Sanksi Pelanggaran Peraturan Daerah',summary:'Ketentuan umum sanksi dalam Perda Kab. Tanah Bumbu.',statusBerlaku:true,
jenis:['Sanksi Administratif','Sanksi Pidana Ringan','Biaya Paksa Penegakan'],
dasarHukum:[{peraturan:'UU No. 23/2014',pasal:'Pemerintahan Daerah'},{peraturan:'UU No. 12/2011',pasal:'Pembentukan Peraturan'}],
pasals:[
{ref:'Sanksi Administratif',tipe:'sanksi',isi:'Teguran lisan, tertulis, denda administratif, penghentian kegiatan, pencabutan izin.'},
{ref:'Sanksi Pidana Ringan',tipe:'sanksi',isi:'Kurungan maks 3 bulan dan/atau denda maks Rp 50.000.000.'},
{ref:'Penyidikan',tipe:'ketentuan',isi:'PPNS dan Polri berwenang melakukan penyidikan pelanggaran Perda.'},
{ref:'Biaya Paksa',tipe:'sanksi',isi:'Pelanggar dapat dibebankan biaya paksa penegakan Perda oleh Pemda.'}
]},

{id:'pajak',keywords:['pajak','pajak daerah','pbb','bphtb','pajak hotel','pajak restoran','wajib pajak'],icon:'💳',
title:'Pajak Daerah',summary:'Kewajiban pajak daerah, tarif, dan sanksi.',statusBerlaku:true,
jenis:['PBB P2','BPHTB','Pajak Hotel','Pajak Restoran','Pajak Hiburan','Pajak Reklame','Pajak Parkir'],
dasarHukum:[{peraturan:'UU No. 28/2009',pasal:'Pajak & Retribusi Daerah'},{peraturan:'Perda Tanah Bumbu',pasal:'Pajak Daerah'}],
pasals:[
{ref:'Kewajiban',tipe:'kewajiban',isi:'Mendaftarkan diri, mengisi SPTPD dengan benar, membayar tepat waktu.'},
{ref:'Sanksi Administratif',tipe:'sanksi',isi:'Bunga 2% per bulan atas keterlambatan pembayaran.'},
{ref:'Sanksi Pidana',tipe:'sanksi',isi:'Kurungan 1–2 tahun atau denda 2–4× pajak terutang bagi fraud.'},
{ref:'Keberatan',tipe:'ketentuan',isi:'Dapat mengajukan keberatan dalam 3 bulan sejak SKPD diterbitkan.'}
]},

{id:'reklame',keywords:['reklame','iklan','baliho','spanduk','billboard','papan nama'],icon:'📢',
title:'Reklame & Media Luar Ruang',summary:'Izin pemasangan reklame, pajak, dan sanksi pelanggaran.',statusBerlaku:true,
jenis:['Reklame Papan/Billboard','Reklame Berjalan','Reklame Kain/Spanduk','Reklame Melekat/Stiker'],
dasarHukum:[{peraturan:'Perda Tanah Bumbu No. 8/2019',pasal:'Penyelenggaraan Reklame'}],
pasals:[
{ref:'Kewajiban Izin',tipe:'kewajiban',isi:'Setiap pemasangan reklame wajib memiliki izin dan membayar pajak reklame.'},
{ref:'Larangan Lokasi',tipe:'larangan',isi:'Dilarang di kawasan lindung, menutupi rambu lalu lintas.'},
{ref:'Sanksi Tanpa Izin',tipe:'sanksi',isi:'Pembongkaran paksa, denda 2× pajak yang seharusnya dibayar.'},
{ref:'Sanksi Pajak',tipe:'sanksi',isi:'Bunga 2% per bulan atas keterlambatan pembayaran pajak reklame.'}
]},

{id:'apbd',keywords:['apbd','anggaran','keuangan daerah','belanja daerah','pendapatan daerah','dana'],icon:'🏦',
title:'APBD / Keuangan Daerah',summary:'Peraturan tentang pengelolaan anggaran dan keuangan daerah.',statusBerlaku:true,
jenis:['Pendapatan Daerah','Belanja Daerah','Pembiayaan Daerah'],
dasarHukum:[{peraturan:'PP No. 12/2019',pasal:'Pengelolaan Keuangan Daerah'},{peraturan:'Permendagri No. 77/2020',pasal:'Teknis Pengelolaan Keuangan'}],
pasals:[
{ref:'Prinsip',tipe:'ketentuan',isi:'APBD disusun berdasarkan prinsip efisiensi, ekonomis, efektif, transparan, dan akuntabel.'},
{ref:'Kewajiban Pelaporan',tipe:'kewajiban',isi:'Kepala Daerah wajib menyampaikan Raperda pertanggungjawaban APBD kepada DPRD.'},
{ref:'Larangan',tipe:'larangan',isi:'Dilarang melakukan pengeluaran atas beban APBD yang tidak tersedia anggarannya.'},
{ref:'Sanksi',tipe:'sanksi',isi:'Penyalahgunaan anggaran merupakan tindak pidana korupsi sesuai UU Tipikor.'}
]}
];

function searchLegalKnowledge(query){
if(!query||query.trim().length<2)return[];
var q=query.toLowerCase().trim();
var words=q.split(/\s+/).filter(function(w){return w.length>1;});
return LEGAL_KNOWLEDGE.filter(function(topic){
return topic.keywords.some(function(kw){
return words.some(function(word){return kw.includes(word)||word.includes(kw);});
});
});
}
