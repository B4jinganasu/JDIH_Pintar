/* ============================================
   JDIH Pintar - Main App Controller
   ============================================ */

const App = {
  currentView: 'home',
  isAdmin: false,

  async init() {
    // Check auth
    const session = JSON.parse(localStorage.getItem('jdih_session') || 'null');
    if (!session || Date.now() - session.timestamp > 86400000) {
      window.location.href = 'index.html';
      return;
    }
    this.isAdmin = session.role === 'admin';
    this.setupUI();
    this.setupNavigation();
    this.setupMobileMenu();
    this.loadView('home');

    // Init modules with mock data first (fast render)
    DashboardStats.init();
    SearchEngine.init();
    AIAssistant.init();
    HierarchyView.init();
    HistoryManager.init();
    if (this.isAdmin) {
      UploadManager.init();
      DataManager.init();
    }

    // Then load real data from Google Drive
    try {
      await DriveAPI.init();
      // Re-initialize modules with real Drive data
      DashboardStats.init();
      SearchEngine.renderFilters();
      HierarchyView.render();
      if (this.isAdmin) DataManager.renderTable();
      // Update drive stats
      document.getElementById('driveTotalFiles').textContent = DriveAPI.allFiles.length;
      const ocrDone = DriveAPI.allFiles.filter(f => f.ocrStatus === 'processed').length;
      document.getElementById('driveOcrDone').textContent = ocrDone;
      document.getElementById('driveOcrPending').textContent = DriveAPI.allFiles.length - ocrDone;
      console.log('[App] Drive data loaded and UI refreshed');
    } catch (err) {
      console.warn('[App] Drive API failed, using mock data:', err);
    }
  },

  setupUI() {
    const page = document.getElementById('dashboardPage');
    const userName = document.getElementById('userName');
    const userRole = document.getElementById('userRole');
    const userAvatar = document.getElementById('userAvatar');

    if (this.isAdmin) {
      page.classList.add('is-admin');
      userName.textContent = 'Admin';
      userRole.textContent = 'Administrator';
      userAvatar.textContent = '🛡️';
      // Show admin labels
      document.querySelectorAll('.admin-only-label').forEach(el => el.style.display = 'block');
    } else {
      userName.textContent = 'Pengunjung';
      userRole.textContent = 'Akses Terbatas';
      userAvatar.textContent = '👤';
    }

    // Logout
    document.getElementById('btnLogout').addEventListener('click', () => {
      localStorage.removeItem('jdih_session');
      window.location.href = 'index.html';
    });

    // Quick search redirect
    document.getElementById('quickSearchInput').addEventListener('keydown', (e) => {
      if (e.key === 'Enter' && e.target.value.trim()) {
        this.loadView('search');
        document.getElementById('searchInput').value = e.target.value.trim();
        SearchEngine.performSearch(e.target.value.trim());
      }
    });

    // Update drive stats
    document.getElementById('driveTotalFiles').textContent = getTotalDocuments();
    document.getElementById('driveOcrDone').textContent = getTotalDocuments() - getOcrPendingCount();
    document.getElementById('driveOcrPending').textContent = getOcrPendingCount();
  },

  setupNavigation() {
    document.querySelectorAll('.nav-item').forEach(item => {
      item.addEventListener('click', () => {
        const view = item.dataset.view;
        if (view) this.loadView(view);
      });
    });
  },

  loadView(viewName) {
    this.currentView = viewName;

    // Update nav
    document.querySelectorAll('.nav-item').forEach(n => n.classList.remove('active'));
    const activeNav = document.querySelector(`.nav-item[data-view="${viewName}"]`);
    if (activeNav) activeNav.classList.add('active');

    // Update views
    const viewIdMap = {
      home: 'viewHome', search: 'viewSearch', ai: 'viewAI',
      hierarchy: 'viewHierarchy', history: 'viewHistory',
      upload: 'viewUpload', manage: 'viewManage', drive: 'viewDrive'
    };
    document.querySelectorAll('.view-section').forEach(v => v.classList.remove('active'));
    const view = document.getElementById(viewIdMap[viewName]);
    if (view) {
      view.classList.add('active');
      view.style.animation = 'none';
      view.offsetHeight;
      view.style.animation = 'fadeInUp 0.4s var(--ease-out) forwards';
    }

    // Update header
    const titles = {
      home: 'Beranda', search: 'Pencarian', ai: 'AI Assistant',
      hierarchy: 'Hierarki Peraturan', history: 'Riwayat',
      upload: 'Upload Dokumen', manage: 'Kelola Data', drive: 'Google Drive'
    };
    document.getElementById('headerTitle').textContent = titles[viewName] || 'Beranda';

    // Close mobile menu
    this.closeMobileMenu();
  },

  setupMobileMenu() {
    const toggle = document.getElementById('mobileMenuToggle');
    const sidebar = document.getElementById('sidebar');
    const overlay = document.getElementById('sidebarOverlay');

    toggle.addEventListener('click', () => {
      sidebar.classList.toggle('open');
      overlay.classList.toggle('show');
    });

    overlay.addEventListener('click', () => this.closeMobileMenu());
  },

  closeMobileMenu() {
    document.getElementById('sidebar').classList.remove('open');
    document.getElementById('sidebarOverlay').classList.remove('show');
  },

  // Show document detail modal
  showDocModal(docId, searchTerm) {
    const doc = getDocumentById(docId);
    if (!doc) return;

    const cat = HIERARCHY_LEVELS.find(h => h.id === doc.category);
    document.getElementById('modalTitle').textContent = doc.title;

    let metaHtml = `
      <span class="badge badge-cyan">${cat ? cat.icon + ' ' + cat.name : doc.category}</span>
      <span class="badge badge-purple">Tahun ${doc.year}</span>
      <span class="badge ${doc.status === 'berlaku' ? 'badge-emerald' : 'badge-rose'}">${doc.status === 'berlaku' ? '✅ Berlaku' : '❌ Dicabut'}</span>
      <span class="badge ${doc.ocrStatus === 'processed' ? 'badge-emerald' : 'badge-amber'}">OCR: ${doc.ocrStatus === 'processed' ? 'Selesai' : 'Pending'}</span>
      ${doc.sizeStr ? '<span class="badge" style="background:var(--bg-tertiary);color:var(--text-secondary);">📦 ' + doc.sizeStr + '</span>' : ''}
    `;
    document.getElementById('modalMeta').innerHTML = metaHtml;

    let content = doc.content;
    if (searchTerm) {
      const regex = new RegExp(`(${searchTerm.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')})`, 'gi');
      content = content.replace(regex, '<mark>$1</mark>');
    }

    let driveBtn = '';
    if (doc.driveLink) {
      driveBtn = `<div style="margin-top:var(--space-4);"><a href="${doc.driveLink}" target="_blank" class="btn-primary" style="text-decoration:none;display:inline-flex;align-items:center;gap:var(--space-2);">📂 Buka di Google Drive</a></div>`;
    }
    let pathInfo = '';
    if (doc.categoryPath) {
      pathInfo = `<div style="margin-top:var(--space-3);font-size:var(--text-xs);color:var(--text-muted);">📁 ${doc.categoryPath}</div>`;
    }
    document.getElementById('modalContent').innerHTML = `<p>${content}</p>${pathInfo}${driveBtn}`;

    document.getElementById('docModal').classList.add('show');
  },

  hideDocModal() {
    document.getElementById('docModal').classList.remove('show');
  }
};

// Modal close handlers
document.addEventListener('DOMContentLoaded', () => {
  App.init();

  document.getElementById('modalClose').addEventListener('click', () => App.hideDocModal());
  document.getElementById('docModal').addEventListener('click', (e) => {
    if (e.target.id === 'docModal') App.hideDocModal();
  });
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') App.hideDocModal();
  });
});
