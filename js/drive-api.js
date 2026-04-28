/* ============================================
   JDIH Pintar - Google Drive API Integration
   Reads folders & files from Google Drive
   ============================================ */

const DriveAPI = {
  API_KEY: 'AIzaSyBqAZkO8CXOfEsWQKajBJh8xZSGKyWN3j8',
  ROOT_FOLDER_ID: '107J1Zmlhb0-Ba9u2ActNRkEgzjs9tKWl',
  BASE_URL: 'https://www.googleapis.com/drive/v3/files',

  // All fetched data
  folders: [],
  allFiles: [],
  folderTree: {},
  isLoaded: false,
  loadingStatus: '',

  async init() {
    this.updateStatus('Menghubungkan ke Google Drive...');
    try {
      await this.loadRootFolders();
      await this.loadAllSubfolders();
      this.buildDocumentIndex();
      this.isLoaded = true;
      this.updateStatus('Tersinkronisasi');
      console.log(`[DriveAPI] Loaded ${this.allFiles.length} files from ${this.folders.length} folders`);
    } catch (err) {
      console.error('[DriveAPI] Error:', err);
      this.updateStatus('Error koneksi');
    }
  },

  updateStatus(text) {
    this.loadingStatus = text;
    const statusEl = document.querySelector('.sync-status span');
    if (statusEl) statusEl.textContent = text;
  },

  // Fetch files/folders from a parent folder
  async fetchChildren(folderId) {
    const url = `${this.BASE_URL}?q='${folderId}'+in+parents&key=${this.API_KEY}&fields=files(id,name,mimeType,modifiedTime,size,webViewLink)&pageSize=1000&orderBy=name`;
    const resp = await fetch(url);
    if (!resp.ok) throw new Error(`API Error: ${resp.status}`);
    const data = await resp.json();
    return data.files || [];
  },

  // Load root level folders
  async loadRootFolders() {
    this.updateStatus('Membaca folder utama...');
    const items = await this.fetchChildren(this.ROOT_FOLDER_ID);
    
    items.forEach(item => {
      if (item.mimeType === 'application/vnd.google-apps.folder') {
        this.folders.push({
          id: item.id,
          name: item.name,
          parentId: this.ROOT_FOLDER_ID,
          level: 1,
          modifiedTime: item.modifiedTime
        });
      } else {
        this.allFiles.push(this.formatFile(item, 'Praturan', this.ROOT_FOLDER_ID));
      }
    });
  },

  // Recursively load all subfolders (2 levels deep to get actual files)
  async loadAllSubfolders() {
    const level1Folders = [...this.folders];
    
    for (const folder of level1Folders) {
      this.updateStatus(`Membaca: ${folder.name}...`);
      try {
        const items = await this.fetchChildren(folder.id);
        
        for (const item of items) {
          if (item.mimeType === 'application/vnd.google-apps.folder') {
            this.folders.push({
              id: item.id,
              name: item.name,
              parentId: folder.id,
              parentName: folder.name,
              level: 2,
              modifiedTime: item.modifiedTime
            });
          } else {
            this.allFiles.push(this.formatFile(item, folder.name, folder.id));
          }
        }
      } catch (e) {
        console.warn(`[DriveAPI] Error reading ${folder.name}:`, e);
      }
    }

    // Level 3 - read subfolders of level 2
    const level2Folders = this.folders.filter(f => f.level === 2);
    for (const folder of level2Folders) {
      this.updateStatus(`Membaca: ${folder.name}...`);
      try {
        const items = await this.fetchChildren(folder.id);
        
        for (const item of items) {
          if (item.mimeType === 'application/vnd.google-apps.folder') {
            this.folders.push({
              id: item.id,
              name: item.name,
              parentId: folder.id,
              parentName: folder.parentName + ' > ' + folder.name,
              level: 3,
              modifiedTime: item.modifiedTime
            });
          } else {
            const categoryPath = folder.parentName ? `${folder.parentName} > ${folder.name}` : folder.name;
            this.allFiles.push(this.formatFile(item, categoryPath, folder.id, folder.parentName));
          }
        }
      } catch (e) {
        console.warn(`[DriveAPI] Error reading ${folder.name}:`, e);
      }
    }

    // Level 4 - one more level for deeply nested files
    const level3Folders = this.folders.filter(f => f.level === 3);
    for (const folder of level3Folders) {
      try {
        const items = await this.fetchChildren(folder.id);
        for (const item of items) {
          if (item.mimeType !== 'application/vnd.google-apps.folder') {
            this.allFiles.push(this.formatFile(item, folder.parentName + ' > ' + folder.name, folder.id, folder.parentName));
          }
        }
      } catch (e) { /* skip */ }
    }
  },

  formatFile(item, categoryPath, folderId, rootCategory) {
    const ext = (item.name.split('.').pop() || '').toLowerCase();
    const isPdf = item.mimeType === 'application/pdf' || ext === 'pdf';
    const isDoc = item.mimeType.includes('document') || ext === 'doc' || ext === 'docx';
    const isSheet = item.mimeType.includes('spreadsheet') || ext === 'xlsx' || ext === 'xls';
    const isImage = item.mimeType.startsWith('image/') || ['jpg','jpeg','png'].includes(ext);
    
    let fileType = 'other';
    let fileIcon = '📄';
    if (isPdf) { fileType = 'pdf'; fileIcon = '📕'; }
    else if (isDoc) { fileType = 'doc'; fileIcon = '📘'; }
    else if (isSheet) { fileType = 'sheet'; fileIcon = '📗'; }
    else if (isImage) { fileType = 'image'; fileIcon = '🖼️'; }

    // Detect category from path
    const category = this.detectCategory(categoryPath, rootCategory);

    // Size formatting
    let sizeStr = '';
    if (item.size) {
      const bytes = parseInt(item.size);
      if (bytes < 1024) sizeStr = bytes + ' B';
      else if (bytes < 1048576) sizeStr = (bytes / 1024).toFixed(1) + ' KB';
      else sizeStr = (bytes / 1048576).toFixed(1) + ' MB';
    }

    return {
      id: item.id,
      name: item.name,
      title: item.name.replace(/\.[^.]+$/, ''), // Remove extension
      mimeType: item.mimeType,
      fileType,
      fileIcon,
      size: item.size || 0,
      sizeStr,
      modifiedTime: item.modifiedTime,
      categoryPath,
      category,
      folderId,
      driveLink: `https://drive.google.com/file/d/${item.id}/view`,
      ocrStatus: isPdf ? 'processed' : (isImage ? 'pending' : 'processed')
    };
  },

  detectCategory(path, rootCategory) {
    const p = (path || '').toUpperCase();
    const r = (rootCategory || '').toUpperCase();
    
    if (p.includes('PERDA') && !p.includes('PERBUP') && !p.includes('PERBUB')) return 'perda';
    if (p.includes('PERBUP') || p.includes('PERBUB')) return 'perbup';
    if (p.includes('UNDANG') || p.includes('UU') || p.includes('PERPPU')) return 'uu';
    if (p.includes('PERATURAN PEMERINTAH') || (p.startsWith('PP') && !p.includes('KPU'))) return 'pp';
    if (p.includes('PERPRES') || p.includes('PRESIDEN')) return 'perpres';
    if (p.includes('KPU') || p.includes('PEMILIHAN')) return 'kpu';
    if (p.includes('BPK') || p.includes('PEMERIKSA KEUANGAN')) return 'bpk';
    if (p.includes('MAHKAMAH') || p.includes('MA') || p.includes('MK')) return 'ma-mk';
    if (p.includes('YUDISIAL') || p.includes('KY')) return 'ky';
    if (p.includes('LAINNYA') || r.includes('LAINNYA')) return 'lainnya';
    return 'lainnya';
  },

  // Build document index that replaces MOCK_DOCUMENTS
  buildDocumentIndex() {
    // Clear existing mock data
    MOCK_DOCUMENTS.length = 0;
    
    // Replace HIERARCHY_LEVELS with actual Drive structure
    HIERARCHY_LEVELS.length = 0;
    HIERARCHY_LEVELS.push(
      { id: 'perda', name: 'PERDA', level: 1, icon: '🏘️', color: '#00d4ff', desc: 'Peraturan Daerah Kab. Tanah Bumbu' },
      { id: 'perbup', name: 'PERBUP', level: 2, icon: '📃', color: '#7c3aed', desc: 'Peraturan Bupati Tanah Bumbu' },
      { id: 'uu', name: 'UU / Perppu', level: 3, icon: '📋', color: '#8b5cf6', desc: 'Undang-Undang / Perppu' },
      { id: 'pp', name: 'Peraturan Pemerintah', level: 4, icon: '📄', color: '#3b82f6', desc: 'PP' },
      { id: 'perpres', name: 'Peraturan Presiden', level: 5, icon: '📑', color: '#06b6d4', desc: 'Perpres' },
      { id: 'kpu', name: 'Peraturan KPU', level: 6, icon: '🗳️', color: '#f59e0b', desc: 'Komisi Pemilihan Umum' },
      { id: 'bpk', name: 'Peraturan BPK', level: 7, icon: '🏦', color: '#10b981', desc: 'Badan Pemeriksa Keuangan' },
      { id: 'ma-mk', name: 'Peraturan MA & MK', level: 8, icon: '⚖️', color: '#ef4444', desc: 'Mahkamah Agung & Konstitusi' },
      { id: 'ky', name: 'Peraturan KY', level: 9, icon: '🔍', color: '#ec4899', desc: 'Komisi Yudisial' },
      { id: 'lainnya', name: 'Lainnya', level: 10, icon: '📂', color: '#94a3b8', desc: 'Dokumen lainnya' }
    );

    // Convert Drive files to document index
    this.allFiles.forEach((file, idx) => {
      // Extract year from filename
      const yearMatch = file.name.match(/(?:TAHUN|THN|TH)\s*(\d{4})/i) || file.name.match(/(\d{4})/);
      const year = yearMatch ? parseInt(yearMatch[1]) : new Date(file.modifiedTime).getFullYear();

      // Extract nomor from filename
      const nomorMatch = file.name.match(/(?:NO|NOMOR|NOM)\.?\s*(\d+)/i);
      const nomor = nomorMatch ? nomorMatch[1] : '';

      // Build searchable tags from filename
      const tags = file.title
        .toLowerCase()
        .replace(/[^a-z0-9\s]/g, ' ')
        .split(/\s+/)
        .filter(t => t.length > 2);

      MOCK_DOCUMENTS.push({
        id: idx + 1,
        driveId: file.id,
        title: file.title,
        category: file.category,
        year: year,
        number: nomor,
        content: `Dokumen: ${file.title}. Kategori: ${file.categoryPath}. Tipe: ${file.fileType.toUpperCase()}. Ukuran: ${file.sizeStr}.`,
        status: 'berlaku',
        ocrStatus: file.ocrStatus,
        driveFileId: file.id,
        driveLink: file.driveLink,
        fileIcon: file.fileIcon,
        fileType: file.fileType,
        sizeStr: file.sizeStr,
        categoryPath: file.categoryPath,
        tags: [...new Set(tags)]
      });
    });

    console.log(`[DriveAPI] Indexed ${MOCK_DOCUMENTS.length} documents`);
  },

  // Get folder tree for hierarchy view
  getFolderTree() {
    const rootFolders = this.folders.filter(f => f.level === 1);
    return rootFolders.map(folder => {
      const children = this.folders.filter(f => f.parentId === folder.id);
      const files = this.allFiles.filter(f => f.folderId === folder.id);
      return {
        ...folder,
        children: children.map(child => ({
          ...child,
          files: this.allFiles.filter(f => f.folderId === child.id),
          children: this.folders.filter(f => f.parentId === child.id)
        })),
        files
      };
    });
  }
};
