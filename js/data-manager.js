/* ============================================
   JDIH Pintar - Data Manager (Admin CRUD)
   ============================================ */

const DataManager = {
  init() {
    this.renderTable();
    document.getElementById('addDocBtn').addEventListener('click', () => this.showAddForm());
    document.getElementById('manageSearchInput').addEventListener('input', (e) => {
      this.renderTable(e.target.value);
    });
  },

  renderTable(filter = '') {
    const tbody = document.getElementById('manageTableBody');
    let docs = [...MOCK_DOCUMENTS];

    if (filter) {
      const q = filter.toLowerCase();
      docs = docs.filter(d =>
        d.title.toLowerCase().includes(q) || d.category.includes(q) || d.tags.some(t => t.includes(q))
      );
    }

    tbody.innerHTML = docs.map((doc, i) => {
      const cat = HIERARCHY_LEVELS.find(h => h.id === doc.category);
      return `
        <tr>
          <td>${i + 1}</td>
          <td style="max-width:300px;">
            <div style="font-weight:500;color:var(--text-primary);line-height:1.3;">${doc.title}</div>
          </td>
          <td><span class="badge badge-cyan" style="font-size:11px;">${cat ? cat.icon + ' ' + cat.name : doc.category}</span></td>
          <td style="font-family:var(--font-mono);">${doc.year}</td>
          <td><span class="badge ${doc.status === 'berlaku' ? 'badge-emerald' : 'badge-rose'}" style="font-size:11px;">${doc.status}</span></td>
          <td><span class="badge ${doc.ocrStatus === 'processed' ? 'badge-emerald' : 'badge-amber'}" style="font-size:11px;">${doc.ocrStatus}</span></td>
          <td>
            <div class="manage-actions">
              <button class="btn-edit" onclick="DataManager.editDoc(${doc.id})">✏️ Edit</button>
              <button class="btn-delete" onclick="DataManager.deleteDoc(${doc.id})">🗑️</button>
            </div>
          </td>
        </tr>`;
    }).join('');
  },

  showAddForm() {
    const title = prompt('Judul Dokumen:');
    if (!title) return;

    const catOptions = HIERARCHY_LEVELS.map(h => `${h.id} = ${h.name}`).join('\n');
    const category = prompt('Kategori (ketik ID):\n' + catOptions);
    if (!category || !HIERARCHY_LEVELS.find(h => h.id === category)) {
      alert('Kategori tidak valid!');
      return;
    }

    const year = prompt('Tahun:', new Date().getFullYear());
    const content = prompt('Isi/Konten Dokumen:');

    MOCK_DOCUMENTS.push({
      id: MOCK_DOCUMENTS.length + 1,
      title: title,
      category: category,
      year: parseInt(year) || new Date().getFullYear(),
      number: String(MOCK_DOCUMENTS.length + 1),
      content: content || 'Konten belum diisi.',
      status: 'berlaku',
      ocrStatus: 'processed',
      driveFileId: 'manual_' + Date.now(),
      tags: [title.split(' ').pop().toLowerCase()]
    });

    this.renderTable();
    DashboardStats.init();
    HierarchyView.init();
    alert('✅ Dokumen berhasil ditambahkan!');
  },

  editDoc(id) {
    const doc = MOCK_DOCUMENTS.find(d => d.id === id);
    if (!doc) return;

    const newTitle = prompt('Edit Judul:', doc.title);
    if (newTitle === null) return;
    if (newTitle) doc.title = newTitle;

    const newContent = prompt('Edit Konten:', doc.content);
    if (newContent) doc.content = newContent;

    const newStatus = prompt('Status (berlaku / dicabut):', doc.status);
    if (newStatus === 'berlaku' || newStatus === 'dicabut') doc.status = newStatus;

    this.renderTable();
    DashboardStats.init();
    alert('✅ Dokumen berhasil diupdate!');
  },

  deleteDoc(id) {
    if (!confirm('Yakin ingin menghapus dokumen ini?')) return;
    const idx = MOCK_DOCUMENTS.findIndex(d => d.id === id);
    if (idx > -1) {
      MOCK_DOCUMENTS.splice(idx, 1);
      this.renderTable();
      DashboardStats.init();
      HierarchyView.init();
      alert('✅ Dokumen berhasil dihapus!');
    }
  }
};
