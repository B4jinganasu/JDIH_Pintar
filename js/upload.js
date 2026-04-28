/* ============================================
   JDIH Pintar - Upload Manager
   ============================================ */

const UploadManager = {
  files: [],

  init() {
    const zone = document.getElementById('uploadZone');
    const fileInput = document.getElementById('fileInput');

    // Populate category select
    const select = document.getElementById('uploadCategory');
    select.innerHTML = '<option value="">-- Pilih Kategori --</option>' +
      HIERARCHY_LEVELS.map(h => `<option value="${h.id}">${h.icon} ${h.name}</option>`).join('');

    // Click to browse
    zone.addEventListener('click', () => fileInput.click());
    fileInput.addEventListener('change', (e) => this.handleFiles(e.target.files));

    // Drag and drop
    zone.addEventListener('dragover', (e) => { e.preventDefault(); zone.classList.add('dragover'); });
    zone.addEventListener('dragleave', () => zone.classList.remove('dragover'));
    zone.addEventListener('drop', (e) => {
      e.preventDefault();
      zone.classList.remove('dragover');
      this.handleFiles(e.dataTransfer.files);
    });

    // Submit
    document.getElementById('uploadSubmitBtn').addEventListener('click', () => this.simulateUpload());
  },

  handleFiles(fileList) {
    if (!fileList.length) return;
    this.files = Array.from(fileList);
    this.renderFileList();
    document.getElementById('uploadForm').style.display = 'block';
  },

  renderFileList() {
    const container = document.getElementById('uploadFileList');
    container.innerHTML = this.files.map((file, i) => {
      const ext = file.name.split('.').pop().toLowerCase();
      const icon = ext === 'pdf' ? '📕' : ext.match(/docx?/) ? '📘' : '📄';
      const size = file.size < 1024 * 1024
        ? (file.size / 1024).toFixed(1) + ' KB'
        : (file.size / (1024 * 1024)).toFixed(1) + ' MB';
      return `
        <div class="upload-file-item" id="uploadFile${i}">
          <div class="upload-file-icon">${icon}</div>
          <div class="upload-file-info">
            <div class="upload-file-name">${file.name}</div>
            <div class="upload-file-size">${size}</div>
            <div class="upload-progress-bar"><div class="upload-progress-fill" id="progress${i}"></div></div>
          </div>
          <button class="upload-file-remove" onclick="UploadManager.removeFile(${i})">✕</button>
        </div>`;
    }).join('');
  },

  removeFile(index) {
    this.files.splice(index, 1);
    if (this.files.length === 0) {
      document.getElementById('uploadFileList').innerHTML = '';
      document.getElementById('uploadForm').style.display = 'none';
    } else {
      this.renderFileList();
    }
  },

  simulateUpload() {
    const category = document.getElementById('uploadCategory').value;
    if (!category) { alert('Pilih kategori terlebih dahulu!'); return; }
    if (!this.files.length) { alert('Pilih file terlebih dahulu!'); return; }

    const btn = document.getElementById('uploadSubmitBtn');
    btn.disabled = true;
    btn.textContent = '⏳ Mengupload...';

    // Simulate progress for each file
    this.files.forEach((file, i) => {
      const bar = document.getElementById('progress' + i);
      let progress = 0;
      const interval = setInterval(() => {
        progress += Math.random() * 15 + 5;
        if (progress >= 100) {
          progress = 100;
          clearInterval(interval);
          bar.style.background = 'var(--accent-emerald)';
          // Check if all done
          if (i === this.files.length - 1) {
            setTimeout(() => {
              btn.disabled = false;
              btn.textContent = '📤 Upload ke Google Drive';
              alert('✅ Upload berhasil! File akan tersinkronisasi ke Google Drive.');
              // Add to mock data
              const cat = HIERARCHY_LEVELS.find(h => h.id === category);
              const title = document.getElementById('uploadTitle').value || file.name.replace(/\.[^.]+$/, '');
              MOCK_DOCUMENTS.push({
                id: MOCK_DOCUMENTS.length + 1,
                title: title,
                category: category,
                year: new Date().getFullYear(),
                number: String(MOCK_DOCUMENTS.length + 1),
                content: 'Dokumen baru yang diupload melalui aplikasi. Menunggu proses OCR untuk indexing konten.',
                status: 'berlaku',
                ocrStatus: 'pending',
                driveFileId: 'uploaded_' + Date.now(),
                tags: [cat ? cat.name.toLowerCase() : category, 'baru']
              });
              this.files = [];
              document.getElementById('uploadFileList').innerHTML = '';
              document.getElementById('uploadForm').style.display = 'none';
              document.getElementById('uploadTitle').value = '';
              DashboardStats.init();
            }, 500);
          }
        }
        bar.style.width = progress + '%';
      }, 200);
    });
  }
};
