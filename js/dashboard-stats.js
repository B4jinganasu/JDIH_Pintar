/* ============================================
   JDIH Pintar - Dashboard Stats & Info
   ============================================ */

const DashboardStats = {
  init() {
    this.renderStats();
    this.renderCategoryBars();
    this.renderRecentDocs();
    this.renderQuickTags();
  },

  renderStats() {
    const total = getTotalDocuments();
    const ocrPending = getOcrPendingCount();
    const categories = HIERARCHY_LEVELS.filter(h => {
      return MOCK_DOCUMENTS.some(d => d.category === h.id);
    }).length;
    const berlaku = MOCK_DOCUMENTS.filter(d => d.status === 'berlaku').length;

    const stats = [
      { icon: '📚', value: total, label: 'Total Dokumen', trend: '+3', trendType: 'up', color: 'cyan' },
      { icon: '📂', value: categories, label: 'Kategori Aktif', trend: '', trendType: 'neutral', color: 'purple' },
      { icon: '✅', value: berlaku, label: 'Berlaku', trend: `${Math.round(berlaku/total*100)}%`, trendType: 'up', color: 'emerald' },
      { icon: '🔄', value: ocrPending, label: 'OCR Pending', trend: 'proses', trendType: 'neutral', color: 'amber' }
    ];

    document.getElementById('statsGrid').innerHTML = stats.map((s, i) => `
      <div class="stat-card ${s.color} animate-fade-in-up stagger-${i + 1}">
        <div class="stat-card-header">
          <div class="stat-card-icon">${s.icon}</div>
          ${s.trend ? `<div class="stat-card-trend ${s.trendType}">${s.trend}</div>` : ''}
        </div>
        <div class="stat-card-value">${s.value}</div>
        <div class="stat-card-label">${s.label}</div>
      </div>
    `).join('');

    // Animate counters
    document.querySelectorAll('.stat-card-value').forEach(el => {
      const target = parseInt(el.textContent);
      let current = 0;
      const increment = Math.ceil(target / 30);
      const timer = setInterval(() => {
        current += increment;
        if (current >= target) { current = target; clearInterval(timer); }
        el.textContent = current;
      }, 40);
    });
  },

  renderCategoryBars() {
    const stats = getCategoryStats();
    const maxCount = Math.max(...Object.values(stats).map(s => s.count), 1);
    const container = document.getElementById('categoryBars');

    container.innerHTML = HIERARCHY_LEVELS
      .filter(h => stats[h.id] && stats[h.id].count > 0)
      .map(h => {
        const pct = Math.round((stats[h.id].count / maxCount) * 100);
        return `
          <div class="category-bar-item">
            <div class="category-bar-icon">${h.icon}</div>
            <div class="category-bar-info">
              <div class="category-bar-top">
                <span class="category-bar-name">${h.name}</span>
                <span class="category-bar-count">${stats[h.id].count}</span>
              </div>
              <div class="category-bar-track">
                <div class="category-bar-fill" style="background:${h.color};" data-width="${pct}%"></div>
              </div>
            </div>
          </div>`;
      }).join('');

    // Animate bars after render
    setTimeout(() => {
      container.querySelectorAll('.category-bar-fill').forEach(bar => {
        bar.style.width = bar.dataset.width;
      });
    }, 300);
  },

  renderRecentDocs() {
    const recent = getRecentDocuments(6);
    const container = document.getElementById('recentDocs');
    container.innerHTML = recent.map(doc => {
      const cat = HIERARCHY_LEVELS.find(h => h.id === doc.category);
      return `
        <div class="recent-doc-item" onclick="App.loadView('search');document.getElementById('searchInput').value='${doc.title.split(' ').slice(0,3).join(' ')}';SearchEngine.performSearch('${doc.title.split(' ').slice(0,3).join(' ')}')">
          <div class="recent-doc-icon">${cat ? cat.icon : '📄'}</div>
          <div class="recent-doc-info">
            <div class="recent-doc-title">${doc.title}</div>
            <div class="recent-doc-meta">${cat ? cat.name : doc.category} • ${doc.year}</div>
          </div>
        </div>`;
    }).join('');
  },

  renderQuickTags() {
    const tags = ['retribusi', 'naskah dinas', 'ketertiban', 'RTRW', 'perda 2023', 'perbup 2025', 'WFH', 'TPP', 'izin', 'bangunan'];
    const container = document.getElementById('quickSearchTags');
    container.innerHTML = tags.map(tag =>
      `<button class="quick-search-tag" onclick="document.getElementById('quickSearchInput').value='${tag}';App.loadView('search');document.getElementById('searchInput').value='${tag}';SearchEngine.performSearch('${tag}');">#${tag}</button>`
    ).join('');
  }
};
