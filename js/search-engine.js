/* ============================================
   JDIH Pintar - Full-Text Search Engine
   + Legal Knowledge Panel Integration
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
        const titleLower = doc.title.toLowerCase();
        if (titleLower.includes(term)) score += 10;
        const contentLower = doc.content.toLowerCase();
        const contentMatches = (contentLower.match(new RegExp(term.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'), 'g')) || []).length;
        score += contentMatches * 3;
        if (doc.tags.some(t => t.includes(term))) score += 5;
      });
      return { doc, score };
    }).filter(r => r.score > 0).sort((a, b) => b.score - a.score);
    return scored;
  },

  /* =============================================
     KNOWLEDGE PANEL — Info Pasal Terkait
     ============================================= */
  renderKnowledgePanel(topics) {
    if (!topics || topics.length === 0) return '';

    let html = '';

    // Tabs jika multi topik
    if (topics.length > 1) {
      html += '<div class="lk-topics-tabs">';
      topics.forEach((t, i) => {
        html += `<button class="lk-topic-tab ${i === 0 ? 'active' : ''}" onclick="SearchEngine.switchKnowledgeTopic(${i})">${t.icon} ${t.title}</button>`;
      });
      html += '</div>';
    }

    topics.forEach((topic, idx) => {
      html += `<div class="legal-knowledge-panel lk-topic-panel" id="lkPanel${idx}" style="${idx > 0 ? 'display:none;' : ''}">`;

      // Header
      const statusClass = topic.statusBerlaku !== false ? 'lk-status-aktif' : 'lk-status-dicabut';
      const statusText = topic.statusBerlaku !== false ? '✅ BERLAKU' : '❌ DICABUT';
      html += `<div class="lk-header">
        <div class="lk-icon">${topic.icon}</div>
        <div class="lk-title-group">
          <div style="display:flex;align-items:center;gap:8px;flex-wrap:wrap;">
            <h4 class="lk-title">${topic.title}</h4>
            <span class="lk-badge">INFO PASAL</span>
            <span class="lk-status ${statusClass}">${statusText}</span>
          </div>
          <p class="lk-summary">${topic.summary}</p>
        </div>
      </div>`;

      // Jenis-jenis
      if (topic.jenis && topic.jenis.length > 0) {
        html += `<div class="lk-section">
          <div class="lk-section-title" style="color:var(--accent-purple);">📌 Jenis-jenis</div>
          <div class="lk-jenis-list">${topic.jenis.map(j => `<span class="lk-jenis-tag">${j}</span>`).join('')}</div>
        </div>`;
      }

      // Dasar Hukum
      if (topic.dasarHukum && topic.dasarHukum.length > 0) {
        html += `<div class="lk-section">
          <div class="lk-section-title" style="color:var(--accent-cyan);">📖 Dasar Hukum</div>
          <div class="lk-dasar-list">${topic.dasarHukum.map(d =>
            `<div class="lk-dasar-item">• <strong>${d.peraturan}</strong>${d.pasal ? ' — ' + d.pasal : ''}</div>`
          ).join('')}</div>
        </div>`;
      }

      // Pasal-pasal — kelompokkan per tipe
      const tipeOrder = ['sanksi', 'larangan', 'kewajiban', 'ketentuan'];
      const tipeLabels = { sanksi: '⚖️ Sanksi', larangan: '🚫 Larangan', kewajiban: '📋 Kewajiban', ketentuan: '📝 Ketentuan Umum' };

      tipeOrder.forEach(tipe => {
        const items = topic.pasals.filter(p => p.tipe === tipe);
        if (items.length === 0) return;
        html += `<div class="lk-section">
          <div class="lk-section-title">${tipeLabels[tipe] || tipe}</div>
          <div class="lk-pasals">`;
        items.forEach(p => {
          html += `<div class="lk-pasal-card">
            <div class="lk-tipe-badge lk-tipe-${p.tipe}">${p.tipe.toUpperCase()}</div>
            <div class="lk-pasal-ref">${p.ref}</div>
            <div class="lk-pasal-isi">${p.isi}</div>
          </div>`;
        });
        html += '</div></div>';
      });

      html += '</div>'; // close panel
    });

    return html;
  },

  switchKnowledgeTopic(index) {
    document.querySelectorAll('.lk-topic-panel').forEach((el, i) => {
      el.style.display = i === index ? '' : 'none';
    });
    document.querySelectorAll('.lk-topic-tab').forEach((tab, i) => {
      tab.classList.toggle('active', i === index);
    });
  },

  /* =============================================
     RENDER RESULTS + KNOWLEDGE PANEL
     ============================================= */
  renderResults(results, query) {
    const area = document.getElementById('searchResultsArea');

    // Knowledge Panel
    const topics = (typeof searchLegalKnowledge === 'function') ? searchLegalKnowledge(query) : [];
    const panelHtml = this.renderKnowledgePanel(topics);

    if (results.length === 0 && topics.length === 0) {
      area.innerHTML = `
        <div class="search-empty">
          <div class="search-empty-icon">🔍</div>
          <h3>Tidak ada hasil</h3>
          <p>Coba kata kunci lain atau ubah filter kategori</p>
        </div>`;
      return;
    }

    if (results.length === 0) {
      area.innerHTML = panelHtml + `
        <div class="search-empty" style="padding:var(--space-8) 0;">
          <p style="color:var(--text-muted);font-size:var(--text-sm);">📄 Tidak ada dokumen yang cocok, tetapi ditemukan info pasal terkait di atas.</p>
        </div>`;
      return;
    }

    let html = panelHtml + `
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
