/* ============================================
   JDIH Pintar - Search History Manager
   ============================================ */

const HistoryManager = {
  STORAGE_KEY: 'jdih_search_history',

  init() {
    this.render();
    document.getElementById('clearHistoryBtn').addEventListener('click', () => {
      if (confirm('Hapus semua riwayat pencarian?')) {
        localStorage.removeItem(this.STORAGE_KEY);
        this.render();
      }
    });
  },

  getHistory() {
    return JSON.parse(localStorage.getItem(this.STORAGE_KEY) || '[]');
  },

  addSearch(query) {
    let history = this.getHistory();
    // Remove duplicate
    history = history.filter(h => h.query.toLowerCase() !== query.toLowerCase());
    // Add to front
    history.unshift({
      query: query,
      timestamp: Date.now(),
      time: new Date().toLocaleString('id-ID')
    });
    // Keep max 50
    if (history.length > 50) history = history.slice(0, 50);
    localStorage.setItem(this.STORAGE_KEY, JSON.stringify(history));
    this.render();
  },

  removeItem(index) {
    const history = this.getHistory();
    history.splice(index, 1);
    localStorage.setItem(this.STORAGE_KEY, JSON.stringify(history));
    this.render();
  },

  render() {
    const container = document.getElementById('historyList');
    const history = this.getHistory();

    if (history.length === 0) {
      container.innerHTML = `
        <div class="history-empty">
          <div class="empty-icon">📜</div>
          <h3 style="color:var(--text-secondary);font-size:var(--text-lg);">Belum ada riwayat</h3>
          <p style="color:var(--text-muted);font-size:var(--text-sm);">Riwayat pencarian Anda akan muncul di sini</p>
        </div>`;
      return;
    }

    container.innerHTML = history.map((item, i) => `
      <div class="history-item" onclick="App.loadView('search');document.getElementById('searchInput').value='${item.query.replace(/'/g, "\\'")}';SearchEngine.performSearch('${item.query.replace(/'/g, "\\'")}');">
        <div class="history-item-icon">🔍</div>
        <div class="history-item-text">${item.query}</div>
        <div class="history-item-time">${this.timeAgo(item.timestamp)}</div>
        <button class="history-item-delete" onclick="event.stopPropagation();HistoryManager.removeItem(${i});">✕</button>
      </div>
    `).join('');
  },

  timeAgo(ts) {
    const diff = Date.now() - ts;
    const mins = Math.floor(diff / 60000);
    if (mins < 1) return 'Baru saja';
    if (mins < 60) return mins + ' menit lalu';
    const hours = Math.floor(mins / 60);
    if (hours < 24) return hours + ' jam lalu';
    const days = Math.floor(hours / 24);
    return days + ' hari lalu';
  }
};
