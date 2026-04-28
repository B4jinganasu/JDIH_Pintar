/* ============================================
   JDIH Pintar - Full-Text Search Engine
   ============================================ */

const SearchEngine = {
  activeFilter: 'all',

  init() {
    this.renderFilters();
    document.getElementById('searchBtn').addEventListener('click', () => {
      const q = document.getElementById('searchInput').value.trim();
      if (q) this.performSearch(q);
    });
    document.getElementById('searchInput').addEventListener('keydown', (e) => {
      if (e.key === 'Enter') {
        const q = e.target.value.trim();
        if (q) this.performSearch(q);
      }
    });
  },

  renderFilters() {
    const container = document.getElementById('searchFilters');
    let html = '<button class="filter-chip active" data-filter="all">Semua</button>';
    HIERARCHY_LEVELS.forEach(h => {
      html += `<button class="filter-chip" data-filter="${h.id}">${h.icon} ${h.name}</button>`;
    });
    container.innerHTML = html;
    container.querySelectorAll('.filter-chip').forEach(chip => {
      chip.addEventListener('click', () => {
        container.querySelectorAll('.filter-chip').forEach(c => c.classList.remove('active'));
        chip.classList.add('active');
        this.activeFilter = chip.dataset.filter;
        const q = document.getElementById('searchInput').value.trim();
        if (q) this.performSearch(q);
      });
    });
  },

  performSearch(query) {
    HistoryManager.addSearch(query);
    const results = this.search(query);
    this.renderResults(results, query);
  },

  search(query) {
    const terms = query.toLowerCase().split(/\s+/);
    let docs = [...MOCK_DOCUMENTS];
    if (this.activeFilter !== 'all') {
      docs = docs.filter(d => d.category === this.activeFilter);
    }

    const scored = docs.map(doc => {
      let score = 0;
      const searchable = (doc.title + ' ' + doc.content + ' ' + doc.tags.join(' ')).toLowerCase();
      terms.forEach(term => {
        // Title match (high weight)
        const titleLower = doc.title.toLowerCase();
        if (titleLower.includes(term)) score += 10;
        // Content match
        const contentLower = doc.content.toLowerCase();
        const contentMatches = (contentLower.match(new RegExp(term.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'), 'g')) || []).length;
        score += contentMatches * 3;
        // Tag match
        if (doc.tags.some(t => t.includes(term))) score += 5;
      });
      return { doc, score };
    }).filter(r => r.score > 0).sort((a, b) => b.score - a.score);

    return scored;
  },

  renderResults(results, query) {
    const area = document.getElementById('searchResultsArea');
    if (results.length === 0) {
      area.innerHTML = `
        <div class="search-empty">
          <div class="search-empty-icon">🔍</div>
          <h3>Tidak ada hasil</h3>
          <p>Coba kata kunci lain atau ubah filter kategori</p>
        </div>`;
      return;
    }

    let html = `
      <div class="search-results-header">
        <div class="search-results-count">Ditemukan <strong>${results.length}</strong> dokumen untuk "<strong>${query}</strong>"</div>
      </div>
      <div class="search-results-list">`;

    results.forEach(({ doc, score }) => {
      const cat = HIERARCHY_LEVELS.find(h => h.id === doc.category);
      let excerpt = doc.content;
      const regex = new RegExp(`(${query.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')})`, 'gi');
      excerpt = excerpt.replace(regex, '<mark>$1</mark>');
      if (excerpt.length > 250) {
        const idx = excerpt.toLowerCase().indexOf(query.toLowerCase());
        const start = Math.max(0, idx - 80);
        excerpt = (start > 0 ? '...' : '') + excerpt.substring(start, start + 250) + '...';
      }

      html += `
        <div class="search-result-card" onclick="App.showDocModal(${doc.id}, '${query.replace(/'/g, "\\'")}')">
          <div class="search-result-top">
            <span class="search-result-category badge badge-cyan">${cat ? cat.icon + ' ' + cat.name : doc.category}</span>
            <span class="search-result-year">${doc.year}</span>
            ${doc.sizeStr ? '<span style="font-size:var(--text-xs);color:var(--text-muted);">📦 ' + doc.sizeStr + '</span>' : ''}
            ${doc.driveLink ? '<a href="' + doc.driveLink + '" target="_blank" onclick="event.stopPropagation();" style="font-size:var(--text-xs);color:var(--accent-cyan);text-decoration:none;">📂 Drive</a>' : ''}
          </div>
          <div class="search-result-title">${doc.fileIcon || '📄'} ${doc.title}</div>
          <div class="search-result-excerpt">${excerpt}</div>
          <div class="search-result-tags">
            ${doc.tags.slice(0, 5).map(t => `<span class="search-result-tag">#${t}</span>`).join('')}
          </div>
        </div>`;
    });

    html += '</div>';
    area.innerHTML = html;
  }
};
