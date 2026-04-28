/* ============================================
   JDIH Pintar - Hierarchy Visualization
   ============================================ */

const HierarchyView = {
  init() {
    this.render();
  },

  render() {
    const container = document.getElementById('hierarchyTree');
    const stats = getCategoryStats();
    let html = '';

    HIERARCHY_LEVELS.forEach((level, idx) => {
      const count = stats[level.id] ? stats[level.id].count : 0;
      html += `
        <div class="hierarchy-level stagger-${idx + 1} animate-fade-in-left" 
             data-category="${level.id}" 
             onclick="HierarchyView.toggleExpand(this, '${level.id}')"
             style="margin-left:${idx * 12}px;animation-delay:${idx * 0.08}s;">
          <div class="hierarchy-level-num" style="background:${level.color}22;color:${level.color};">${level.level}</div>
          <div class="hierarchy-level-icon">${level.icon}</div>
          <div class="hierarchy-level-info">
            <div class="hierarchy-level-name">${level.name}</div>
            <div class="hierarchy-level-desc">${level.desc}</div>
          </div>
          <div class="hierarchy-level-count">${count} <span style="font-weight:400;font-size:11px;">dok</span></div>
          <div class="hierarchy-level-arrow">▶</div>
        </div>
        <div class="hierarchy-docs" id="docs-${level.id}"></div>`;

      if (idx < HIERARCHY_LEVELS.length - 1) {
        html += `<div class="hierarchy-connector" style="margin-left:${idx * 12 + 42}px;"></div>`;
      }
    });

    container.innerHTML = html;
  },

  toggleExpand(el, categoryId) {
    const docsContainer = document.getElementById('docs-' + categoryId);
    const isExpanded = el.classList.contains('expanded');

    // Close all
    document.querySelectorAll('.hierarchy-level').forEach(l => l.classList.remove('expanded'));
    document.querySelectorAll('.hierarchy-docs').forEach(d => { d.classList.remove('show'); d.innerHTML = ''; });

    if (!isExpanded) {
      el.classList.add('expanded');
      const docs = getDocumentsByCategory(categoryId);
      if (docs.length === 0) {
        docsContainer.innerHTML = '<div style="padding:var(--space-4);color:var(--text-muted);font-size:var(--text-sm);">Belum ada dokumen dalam kategori ini</div>';
      } else {
        docsContainer.innerHTML = docs.map(doc => `
          <div class="hierarchy-doc-item" onclick="event.stopPropagation();App.showDocModal(${doc.id})">
            <span style="color:var(--accent-cyan);">📄</span>
            <span class="doc-title">${doc.title}</span>
            <span class="doc-year">${doc.year}</span>
            <span class="badge ${doc.status === 'berlaku' ? 'badge-emerald' : 'badge-rose'}" style="font-size:10px;">${doc.status}</span>
          </div>
        `).join('');
      }
      docsContainer.classList.add('show');
    }
  }
};
