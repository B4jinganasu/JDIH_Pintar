/* ============================================
   JDIH Pintar - Google Drive API v2.1
   BFS Rekursif + Inferensi Topik Hukum
   ============================================ */

const DriveAPI = {
  API_KEY: 'AIzaSyBqAZkO8CXOfEsWQKajBJh8xZSGKyWN3j8',
  ROOT_FOLDER_ID: '107J1Zmlhb0-Ba9u2ActNRkEgzjs9tKWl',
  BASE_URL: 'https://www.googleapis.com/drive/v3/files',
  MAX_DEPTH: 8,

  SKIP_MIME_TYPES: new Set([
    'application/x-compressed','application/x-zip-compressed',
    'application/zip','application/x-rar-compressed'
  ]),
  SKIP_PREFIXES: ['~$', '.', 'Compres', 'KOMPRES', 'Conpres', 'compres'],

  folders: [],
  allFiles: [],
  isLoaded: false,
  loadingStatus: '',

  /* --- PETA INFERENSI TOPIK HUKUM ---
     Jika nama file/folder mengandung kata kunci,
     otomatis tambahkan tag hukum relevan.
     Inilah yang membuat "sanksi" bisa menemukan
     PERDA ketertiban, retribusi, disiplin, dll. */
  TOPIC_INFERENCE: [
    { keys: ['ketertiban','trantibum','tramtibum','ketenteraman'],
      tags: ['sanksi','denda','pidana','larangan','pelanggaran','penertiban','razia','kurungan','hukuman'] },
    { keys: ['larangan','pelarangan'],
      tags: ['sanksi','denda','pidana','larangan','pelanggaran','hukuman','kurungan'] },
    { keys: ['disiplin','kode etik','perilaku asn','lhkpn'],
      tags: ['sanksi','hukuman','disiplin','pelanggaran','pemberhentian','asn','pns'] },
    { keys: ['miras','minuman keras','beralkohol','alkohol'],
      tags: ['miras','alkohol','sanksi','denda','pidana','larangan','kurungan','hukuman'] },
    { keys: ['prostitusi','asusila','pelacuran'],
      tags: ['prostitusi','asusila','sanksi','pidana','denda','larangan','razia','hukuman'] },
    { keys: ['perjudian','judi','togel'],
      tags: ['judi','perjudian','sanksi','pidana','larangan','denda','hukuman'] },
    { keys: ['narkoba','narkotika','psikotropika','napza'],
      tags: ['narkoba','narkotika','sanksi','pidana','larangan','hukuman','penjara'] },
    { keys: ['sampah','limbah','kebersihan','lingkungan hidup'],
      tags: ['sampah','limbah','sanksi','denda','larangan','lingkungan'] },
    { keys: ['bangunan','imb','gedung','pbg','persetujuan bangunan'],
      tags: ['bangunan','imb','sanksi','denda','pembongkaran','pelanggaran','izin'] },
    { keys: ['pkl','pedagang kaki lima'],
      tags: ['pkl','pedagang','sanksi','penertiban','izin','denda','larangan'] },
    { keys: ['reklame','iklan','baliho','spanduk'],
      tags: ['reklame','iklan','sanksi','denda','izin','pembongkaran','pelanggaran'] },
    { keys: ['retribusi','pungutan'],
      tags: ['retribusi','tarif','sanksi','denda','administrasi','izin','pungutan'] },
    { keys: ['pajak','pbb','bphtb'],
      tags: ['pajak','sanksi','denda','tarif','retribusi','wajib','pbb','bphtb'] },
    { keys: ['izin usaha','perizinan','siup','nib','ptsp'],
      tags: ['izin','perizinan','sanksi','denda','pelanggaran','pencabutan','usaha'] },
    { keys: ['rokok','kawasan tanpa rokok'],
      tags: ['rokok','kawasan','larangan','sanksi','denda','merokok','hukuman'] },
    { keys: ['korupsi','pungli','gratifikasi','whistleblower','kecurangan'],
      tags: ['korupsi','gratifikasi','sanksi','hukuman','pidana','pencegahan','pungli'] },
    { keys: ['apbd','penjabaran apbd','belanja daerah'],
      tags: ['apbd','anggaran','keuangan','belanja','pendapatan','dana'] },
    { keys: ['sppd','perjalanan dinas','perjadin'],
      tags: ['perjalanan','dinas','sppd','biaya','pegawai','anggaran'] },
    { keys: ['tpp','tambahan penghasilan','tunjangan kinerja'],
      tags: ['tpp','tunjangan','penghasilan','kinerja','asn','pns','prestasi'] },
    { keys: ['gaji','thr','gaji 13','gaji ketiga belas'],
      tags: ['gaji','thr','tunjangan','asn','pns','remunerasi','penghasilan'] },
    { keys: ['dana desa','alokasi dana desa','apbdesa','add'],
      tags: ['desa','dana','add','alokasi','apbdesa','perangkat','kades','bpd'] },
    { keys: ['pendidikan','sekolah','ppdb','bop daerah'],
      tags: ['pendidikan','sekolah','siswa','guru','ppdb','bop','belajar'] },
    { keys: ['kesehatan','puskesmas','rsud','rumah sakit','germas','stunting'],
      tags: ['kesehatan','puskesmas','rsud','tarif','layanan','jkn','bpjs'] },
    { keys: ['sotk','susunan organisasi','tupoksi','tugas fungsi'],
      tags: ['sotk','organisasi','tupoksi','tugas','fungsi','perangkat','kewenangan'] },
    { keys: ['batas desa','batas kecamatan','penegasan batas','peta batas'],
      tags: ['batas','desa','kecamatan','wilayah','penetapan','penegasan','peta'] },
    { keys: ['inspektorat','audit','pengawasan intern','spip'],
      tags: ['pengawasan','audit','inspektorat','spip','akuntabilitas','evaluasi'] },
    { keys: ['perlindungan anak','layak anak','kla'],
      tags: ['anak','perlindungan','hak','kekerasan','eksploitasi','sanksi','hukuman'] },
  ],

  /* -----------------------------------------------  INIT  */
  async init() {
    this.folders = [];
    this.allFiles = [];
    this.isLoaded = false;
    this.updateStatus('🔗 Menghubungkan ke Google Drive...');
    try {
      await this.loadRootFolders();
      await this.loadAllFoldersBFS();
      this.buildDocumentIndex();
      this.isLoaded = true;
      this.updateStatus(`✅ ${this.allFiles.length} dokumen tersinkronisasi`);
      console.log(`[DriveAPI] ✅ ${this.allFiles.length} file dari ${this.folders.length} folder`);
    } catch (err) {
      console.error('[DriveAPI] Error:', err);
      this.updateStatus('⚠️ Gagal terhubung ke Drive');
    }
  },

  updateStatus(text) {
    this.loadingStatus = text;
    const el = document.querySelector('.sync-status span') ||
                document.getElementById('syncStatusText');
    if (el) el.textContent = text;
  },

  /* ---  Load folder level 1 (langsung di bawah root)  --- */
  async loadRootFolders() {
    this.updateStatus('📂 Membaca folder utama...');
    const items = await this.fetchChildren(this.ROOT_FOLDER_ID);
    for (const item of items) {
      if (item.mimeType === 'application/vnd.google-apps.folder') {
        this.folders.push({
          id: item.id, name: item.name,
          parentId: this.ROOT_FOLDER_ID, level: 1,
          fullPath: item.name, rootCategory: item.name,
          modifiedTime: item.modifiedTime
        });
      } else if (!this._shouldSkip(item)) {
        this.allFiles.push(this.formatFile(item, 'Lainnya', this.ROOT_FOLDER_ID, 'Lainnya'));
      }
    }
  },

  /* ---  BFS: baca SEMUA subfolder sampai habis  --- */
  async loadAllFoldersBFS() {
    let currentLevel = [...this.folders];
    let depth = 1;
    while (currentLevel.length > 0 && depth < this.MAX_DEPTH) {
      depth++;
      this.updateStatus(`📁 Level ${depth} (${currentLevel.length} folder)... ${this.allFiles.length} dok`);
      const nextLevel = [];
      const BATCH = 10;
      for (let i = 0; i < currentLevel.length; i += BATCH) {
        const batch = currentLevel.slice(i, i + BATCH);
        const results = await Promise.allSettled(
          batch.map(f => this._processFolderContents(f))
        );
        for (const r of results) {
          if (r.status === 'fulfilled' && r.value) nextLevel.push(...r.value);
        }
      }
      this.folders.push(...nextLevel);
      currentLevel = nextLevel;
    }
  },

  async _processFolderContents(folder) {
    try {
      const items = await this.fetchChildren(folder.id);
      const newSubs = [];
      for (const item of items) {
        if (this._shouldSkip(item)) continue;
        if (item.mimeType === 'application/vnd.google-apps.folder') {
          newSubs.push({
            id: item.id, name: item.name,
            parentId: folder.id, parentName: folder.name,
            level: folder.level + 1,
            fullPath: `${folder.fullPath} > ${item.name}`,
            rootCategory: folder.rootCategory,
            modifiedTime: item.modifiedTime
          });
        } else {
          this.allFiles.push(
            this.formatFile(item, folder.fullPath, folder.id, folder.rootCategory)
          );
        }
      }
      return newSubs;
    } catch (e) {
      console.warn(`[DriveAPI] ⚠️ "${folder.name}":`, e.message);
      return [];
    }
  },

  _shouldSkip(item) {
    if (this.SKIP_MIME_TYPES.has(item.mimeType)) return true;
    if (this.SKIP_PREFIXES.some(p => item.name.toLowerCase().startsWith(p.toLowerCase()))) return true;
    return false;
  },

  async fetchChildren(folderId) {
    const url = `${this.BASE_URL}?q='${folderId}'+in+parents&key=${this.API_KEY}`
      + `&fields=files(id,name,mimeType,modifiedTime,size)&pageSize=1000&orderBy=name`;
    const resp = await fetch(url);
    if (!resp.ok) throw new Error(`API ${resp.status}`);
    return (await resp.json()).files || [];
  },

  formatFile(item, categoryPath, folderId, rootCategory) {
    const ext = (item.name.split('.').pop() || '').toLowerCase();
    const isPdf   = item.mimeType === 'application/pdf' || ext === 'pdf';
    const isDoc   = item.mimeType.includes('document') || ['doc','docx'].includes(ext);
    const isSheet = item.mimeType.includes('spreadsheet') || ['xlsx','xls'].includes(ext);
    const isImage = item.mimeType.startsWith('image/') || ['jpg','jpeg','png'].includes(ext);
    let fileType = 'other', fileIcon = '📄';
    if (isPdf)    { fileType = 'pdf';   fileIcon = '📕'; }
    else if (isDoc)   { fileType = 'doc';   fileIcon = '📘'; }
    else if (isSheet) { fileType = 'sheet'; fileIcon = '📗'; }
    else if (isImage) { fileType = 'image'; fileIcon = '🖼️'; }
    const category = this.detectCategory(categoryPath, rootCategory);
    let sizeStr = '';
    if (item.size) {
      const b = parseInt(item.size);
      sizeStr = b < 1048576 ? (b/1024).toFixed(1)+' KB' : (b/1048576).toFixed(1)+' MB';
    }
    return {
      id: item.id, name: item.name,
      title: item.name.replace(/\.[^.]+$/, ''),
      mimeType: item.mimeType, fileType, fileIcon,
      size: item.size || 0, sizeStr,
      modifiedTime: item.modifiedTime,
      categoryPath, category, folderId,
      driveLink: `https://drive.google.com/file/d/${item.id}/view`,
      ocrStatus: isPdf ? 'processed' : (isImage ? 'pending' : 'processed')
    };
  },

  detectCategory(path, rootCategory) {
    const r = (rootCategory || '').toUpperCase();
    const p = (path || '').toUpperCase();
    if (r.includes('PERBUP') || r.includes('PERBUB')) return 'perbup';
    if (r.includes('UNDANG') || r === 'UU' || r.includes('PERPPU')) return 'uu';
    if (r.includes('PERATURAN PEMERINTAH')) return 'pp';
    if (r.includes('PERPRES') || r.includes('PRESIDEN')) return 'perpres';
    if (r.includes('KPU') || r.includes('PEMILIHAN')) return 'kpu';
    if (r.includes('BPK') || r.includes('PEMERIKSA')) return 'bpk';
    if (r.includes('MAHKAMAH')) return 'ma-mk';
    if (r.includes('YUDISIAL') || r === 'KY') return 'ky';
    if (r.includes('LAINNYA')) return 'lainnya';
    if (p.includes('PERBUP') || p.includes('PERBUB')) return 'perbup';
    if (p.includes('PERDA') && !p.includes('PERBUP') && !p.includes('PERBUB')) return 'perda';
    if (p.includes('UNDANG') || p.includes(' UU ') || p.includes('PERPPU')) return 'uu';
    if (p.includes('PERATURAN PEMERINTAH')) return 'pp';
    if (p.includes('PERPRES')) return 'perpres';
    if (p.includes('KPU')) return 'kpu';
    if (p.includes('BPK')) return 'bpk';
    if (p.includes('MAHKAMAH')) return 'ma-mk';
    return 'lainnya';
  },

  /* ---  Inferensi topik dari judul/path  --- */
  _inferTopics(text) {
    const t = text.toLowerCase();
    const tags = new Set();
    for (const topic of this.TOPIC_INFERENCE) {
      if (topic.keys.some(kw => t.includes(kw))) {
        topic.tags.forEach(tag => tags.add(tag));
      }
    }
    return [...tags];
  },

  /* ---  Build index dokumen  --- */
  buildDocumentIndex() {
    MOCK_DOCUMENTS.length = 0;
    HIERARCHY_LEVELS.length = 0;
    HIERARCHY_LEVELS.push(
      { id:'perda',   name:'PERDA',               level:1,  icon:'🏘️', color:'#00d4ff', desc:'Peraturan Daerah Kab. Tanah Bumbu' },
      { id:'perbup',  name:'PERBUP',               level:2,  icon:'📃', color:'#7c3aed', desc:'Peraturan Bupati Tanah Bumbu' },
      { id:'uu',      name:'UU / Perppu',           level:3,  icon:'📋', color:'#8b5cf6', desc:'Undang-Undang / Perppu' },
      { id:'pp',      name:'Peraturan Pemerintah',  level:4,  icon:'📄', color:'#3b82f6', desc:'PP' },
      { id:'perpres', name:'Peraturan Presiden',    level:5,  icon:'📑', color:'#06b6d4', desc:'Perpres' },
      { id:'kpu',     name:'Peraturan KPU',         level:6,  icon:'🗳️', color:'#f59e0b', desc:'Komisi Pemilihan Umum' },
      { id:'bpk',     name:'Peraturan BPK',         level:7,  icon:'🏦', color:'#10b981', desc:'Badan Pemeriksa Keuangan' },
      { id:'ma-mk',   name:'Peraturan MA & MK',     level:8,  icon:'⚖️', color:'#ef4444', desc:'Mahkamah Agung & Konstitusi' },
      { id:'ky',      name:'Peraturan KY',           level:9,  icon:'🔍', color:'#ec4899', desc:'Komisi Yudisial' },
      { id:'lainnya', name:'Lainnya',                level:10, icon:'📂', color:'#94a3b8', desc:'Dokumen lainnya' }
    );

    const STOPWORDS = new Set([
      'tentang','dan','atau','yang','dengan','dalam','untuk','dari','pada','oleh',
      'tahun','nomor','thn','no','the','of','and','atas','serta',
      'kabupaten','tanah','bumbu','peraturan','provinsi','kalimantan','selatan',
      'keputusan','surat','undang','ketetapan','presiden','pemerintah','menteri',
      'perda','perbup','perbub','bupati','daerah','kab','kota',
      'pelaksanaan','perubahan','pdf','doc','xlsx','fix','final','revisi',
      'compres','compress','11zon','word','rar','zip'
    ]);

    this.allFiles.forEach((file, idx) => {
      // Ekstrak tahun
      const ym = file.name.match(/(?:TAHUN|THN|TH)[\s._-]*(\d{4})/i)
              || file.categoryPath.match(/(\d{4})/)
              || file.name.match(/(\d{4})/);
      let year = ym ? parseInt(ym[1]) : new Date(file.modifiedTime||Date.now()).getFullYear();
      if (year < 1945 || year > 2030) year = new Date(file.modifiedTime||Date.now()).getFullYear();

      // Ekstrak nomor
      const nm = file.name.match(/(?:NO|NOMOR)\b\.?\s*(\d+)/i) || file.name.match(/^(\d+)\./);
      const nomor = nm ? nm[1] : '';

      // Tags dasar dari nama file + path
      const baseTags = [...new Set(
        (file.title + ' ' + (file.categoryPath||''))
          .toLowerCase().replace(/[^a-z0-9\s]/g,' ').split(/\s+/)
          .filter(t => t.length > 2 && !STOPWORDS.has(t))
      )];

      // Inferensi topik hukum — KUNCI pencarian "sanksi", "denda", dll.
      const titleAndPath = (file.title + ' ' + (file.categoryPath||'')).toLowerCase();
      const inferredTags = this._inferTopics(titleAndPath);

      // Gabungkan semua tags
      const allTags = new Set([...baseTags, ...inferredTags]);

      // Ekspansi sinonim (jika SYNONYM_MAP tersedia)
      if (typeof SYNONYM_MAP !== 'undefined') {
        [...allTags].forEach(tag => {
          if (SYNONYM_MAP[tag]) {
            SYNONYM_MAP[tag].forEach(s =>
              s.split(/\s+/).forEach(w => { if (w.length > 2) allTags.add(w.toLowerCase()); })
            );
          }
        });
      }

      // Content
      const pathParts = (file.categoryPath||'').split(/>/).map(p=>p.trim()).filter(Boolean);
      const content = [
        `Dokumen: ${file.title}.`,
        `Kategori: ${file.categoryPath}.`,
        `Tipe: ${file.fileType.toUpperCase()}.`,
        file.sizeStr ? `Ukuran: ${file.sizeStr}.` : '',
        nomor ? `Nomor: ${nomor}.` : '',
        year ? `Tahun: ${year}.` : '',
        pathParts.length > 1 ? `Folder: ${pathParts.join(', ')}.` : '',
        // Tambahkan kata kunci inferensi ke content agar full-text search juga bisa menemukan
        inferredTags.length > 0 ? `Topik: ${inferredTags.slice(0,10).join(', ')}.` : '',
      ].filter(Boolean).join(' ');

      MOCK_DOCUMENTS.push({
        id: idx + 1, driveId: file.id,
        title: file.title, category: file.category,
        year, number: nomor, content,
        status: 'berlaku', ocrStatus: file.ocrStatus,
        driveFileId: file.id, driveLink: file.driveLink,
        fileIcon: file.fileIcon, fileType: file.fileType,
        sizeStr: file.sizeStr, categoryPath: file.categoryPath,
        tags: [...allTags]
      });
    });

    console.log(`[DriveAPI] 📦 Terindeks ${MOCK_DOCUMENTS.length} dokumen`);
  },

  /* ---  Folder tree untuk tampilan hierarki  --- */
  getFolderTree() {
    const childMap = {};
    this.folders.forEach(f => {
      if (!childMap[f.parentId]) childMap[f.parentId] = [];
      childMap[f.parentId].push(f);
    });
    const fileMap = {};
    this.allFiles.forEach(f => {
      if (!fileMap[f.folderId]) fileMap[f.folderId] = [];
      fileMap[f.folderId].push(f);
    });
    const build = (folder, depth=0) => ({
      ...folder,
      files: fileMap[folder.id] || [],
      children: depth < 5 ? (childMap[folder.id]||[]).map(c => build(c, depth+1)) : []
    });
    return this.folders.filter(f => f.level===1).map(f => build(f));
  }
};
