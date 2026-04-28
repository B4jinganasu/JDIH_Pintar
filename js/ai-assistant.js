/* ============================================
   JDIH Pintar - AI Assistant (RAG Simulation)
   ============================================ */

const AIAssistant = {
  init() {
    this.renderSuggestions();
    document.getElementById('aiSendBtn').addEventListener('click', () => this.sendMessage());
    document.getElementById('aiInput').addEventListener('keydown', (e) => {
      if (e.key === 'Enter') this.sendMessage();
    });
    // Welcome message
    this.addBotMessage('Halo! Saya adalah AI Assistant Kamus Praturan Pintar. Saya bisa membantu Anda mencari informasi tentang peraturan hukum. Silakan tanyakan apa saja! 😊');
  },

  renderSuggestions() {
    const suggestions = [
      'Aturan tentang retribusi',
      'Perda ketertiban umum',
      'Tata naskah dinas',
      'Peraturan tentang bangunan',
      'Perda tahun 2023'
    ];
    const container = document.getElementById('aiSuggestions');
    container.innerHTML = suggestions.map(s =>
      `<button class="ai-suggest-chip" onclick="AIAssistant.askSuggestion('${s}')">${s}</button>`
    ).join('');
  },

  askSuggestion(text) {
    document.getElementById('aiInput').value = text;
    this.sendMessage();
  },

  sendMessage() {
    const input = document.getElementById('aiInput');
    const text = input.value.trim();
    if (!text) return;
    input.value = '';

    this.addUserMessage(text);
    this.showTyping();

    // Simulate AI thinking
    setTimeout(() => {
      const response = this.generateResponse(text);
      this.hideTyping();
      this.addBotMessage(response.answer, response.source);
    }, 1500 + Math.random() * 1500);
  },

  generateResponse(query) {
    const q = query.toLowerCase();
    const results = [];

    MOCK_DOCUMENTS.forEach(doc => {
      const searchable = (doc.title + ' ' + doc.content + ' ' + doc.tags.join(' ')).toLowerCase();
      const terms = q.split(/\s+/);
      let score = 0;
      terms.forEach(t => {
        if (searchable.includes(t)) score++;
      });
      if (score > 0) results.push({ doc, score });
    });

    results.sort((a, b) => b.score - a.score);

    if (results.length === 0) {
      return {
        answer: 'Maaf, saya tidak menemukan peraturan yang relevan dengan pertanyaan Anda. Coba gunakan kata kunci yang berbeda atau lebih spesifik.',
        source: null
      };
    }

    const topDoc = results[0].doc;
    const cat = HIERARCHY_LEVELS.find(h => h.id === topDoc.category);

    // Generate contextual answer
    let answer = '';
    if (q.includes('denda') || q.includes('sanksi') || q.includes('hukuman')) {
      answer = `Berdasarkan **${topDoc.title}**, berikut informasi terkait sanksi/denda:\n\n${topDoc.content}\n\nPeraturan ini berstatus **${topDoc.status}**.`;
    } else if (q.includes('tugas') || q.includes('fungsi') || q.includes('wewenang')) {
      answer = `Mengenai tugas dan fungsi yang Anda tanyakan, berdasarkan **${topDoc.title}**:\n\n${topDoc.content}`;
    } else if (q.includes('apa') || q.includes('jelaskan') || q.includes('bagaimana')) {
      answer = `Berdasarkan dokumen **${topDoc.title}** (${cat ? cat.name : ''}):\n\n${topDoc.content}`;
    } else {
      answer = `Saya menemukan **${results.length} dokumen** yang relevan. Yang paling relevan:\n\n**${topDoc.title}**\n\n${topDoc.content}\n\n${results.length > 1 ? `📄 Ada ${results.length - 1} dokumen lain yang juga relevan.` : ''}`;
    }

    return {
      answer,
      source: `${cat ? cat.icon + ' ' : ''}${topDoc.title} (${topDoc.year})`
    };
  },

  addUserMessage(text) {
    const container = document.getElementById('aiMessages');
    const now = new Date().toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' });
    container.innerHTML += `
      <div class="ai-message user">
        <div class="ai-msg-avatar">👤</div>
        <div>
          <div class="ai-msg-bubble">${this.escapeHtml(text)}</div>
          <div class="ai-msg-time">${now}</div>
        </div>
      </div>`;
    container.scrollTop = container.scrollHeight;
  },

  addBotMessage(text, source) {
    const container = document.getElementById('aiMessages');
    const now = new Date().toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' });
    const formatted = text.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>').replace(/\n/g, '<br>');
    let sourceHtml = source ? `<div class="ai-msg-source"><strong>📎 Sumber:</strong> ${source}</div>` : '';

    container.innerHTML += `
      <div class="ai-message bot">
        <div class="ai-msg-avatar">🤖</div>
        <div>
          <div class="ai-msg-bubble">${formatted}${sourceHtml}</div>
          <div class="ai-msg-time">${now}</div>
        </div>
      </div>`;
    container.scrollTop = container.scrollHeight;
  },

  showTyping() { document.getElementById('aiTyping').classList.add('show'); },
  hideTyping() { document.getElementById('aiTyping').classList.remove('show'); },

  escapeHtml(text) {
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
  }
};
