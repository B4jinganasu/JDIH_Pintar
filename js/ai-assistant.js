/* ============================================
   JDIH Pintar - AI Assistant v2.0
   RAG + Gemini 2.5 Flash (Thinking Mode)
   ============================================ */

const AIAssistant = {
  // API Key sekarang tersimpan aman di Cloudflare Worker (tidak di frontend)
  PROXY_URL: 'https://summer-unit-4713.aldino-1414.workers.dev/',
  GEMINI_MODEL: 'gemini-2.5-flash',
  isStreaming: false,
  chatHistory: [],

  init() {
    this.renderSuggestions();
    document.getElementById('aiSendBtn').addEventListener('click', () => this.sendMessage());
    document.getElementById('aiInput').addEventListener('keydown', (e) => {
      if (e.key === 'Enter' && !e.shiftKey) {
        e.preventDefault();
        this.sendMessage();
      }
    });
    this.addBotMessage('Halo! Saya adalah **AI Assistant Kamus Praturan Pintar** yang didukung oleh **Gemini AI**. 🧠\n\nSaya bisa menganalisis peraturan daerah, menjelaskan pasal-pasal hukum, dan menjawab pertanyaan kompleks berdasarkan database peraturan Kab. Tanah Bumbu.\n\nSilakan tanyakan apa saja! 😊');
  },

  renderSuggestions() {
    const suggestions = [
      'Apa sanksi buang sampah sembarangan?',
      'Jelaskan aturan tentang PKL',
      'Bandingkan sanksi miras vs prostitusi',
      'Berapa denda reklame tanpa izin?',
      'Aturan TPP dan pemotongannya',
      'Apa saja jenis cuti PNS?'
    ];
    const container = document.getElementById('aiSuggestions');
    container.innerHTML = suggestions.map(s =>
      `<button class="ai-suggest-chip" onclick="AIAssistant.askSuggestion('${s.replace(/'/g, "\\'")}')">${s}</button>`
    ).join('');
  },

  askSuggestion(text) {
    document.getElementById('aiInput').value = text;
    this.sendMessage();
  },

  /* =============================================
     RAG: Build context dari database lokal
     ============================================= */
  buildRAGContext(query) {
    let contextParts = [];

    // 1. Cari dokumen relevan dari MOCK_DOCUMENTS
    const terms = query.toLowerCase().split(/\s+/);
    const scored = MOCK_DOCUMENTS.map(doc => {
      let score = 0;
      const searchable = (doc.title + ' ' + doc.content + ' ' + (doc.tags || []).join(' ')).toLowerCase();
      terms.forEach(term => {
        if (doc.title.toLowerCase().includes(term)) score += 10;
        if (doc.content.toLowerCase().includes(term)) score += 5;
        if ((doc.tags || []).some(t => t.includes(term))) score += 3;
      });
      return { doc, score };
    }).filter(r => r.score > 0).sort((a, b) => b.score - a.score).slice(0, 8);

    if (scored.length > 0) {
      contextParts.push('=== DOKUMEN PERATURAN RELEVAN ===');
      scored.forEach(({ doc }, i) => {
        const cat = HIERARCHY_LEVELS.find(h => h.id === doc.category);
        contextParts.push(`\n[Dokumen ${i + 1}] ${doc.title}`);
        contextParts.push(`Kategori: ${cat ? cat.name : doc.category}`);
        contextParts.push(`Tahun: ${doc.year} | Status: ${doc.status}`);
        if (doc.categoryPath) contextParts.push(`Folder: ${doc.categoryPath}`);
        contextParts.push(`Isi: ${doc.content}`);
        if (doc.tags && doc.tags.length > 0) contextParts.push(`Tags: ${doc.tags.slice(0, 10).join(', ')}`);
      });
    }

    // 2. Cari topik hukum dari LEGAL_KNOWLEDGE
    if (typeof searchLegalKnowledge === 'function') {
      const topics = searchLegalKnowledge(query);
      if (topics.length > 0) {
        contextParts.push('\n\n=== INFORMASI PASAL HUKUM ===');
        topics.forEach(topic => {
          contextParts.push(`\n📌 ${topic.title}`);
          contextParts.push(`Ringkasan: ${topic.summary}`);
          contextParts.push(`Status: ${topic.statusBerlaku !== false ? 'BERLAKU' : 'DICABUT'}`);
          if (topic.jenis) contextParts.push(`Jenis: ${topic.jenis.join(', ')}`);
          if (topic.dasarHukum) {
            contextParts.push('Dasar Hukum:');
            topic.dasarHukum.forEach(d => {
              contextParts.push(`  - ${d.peraturan}${d.pasal ? ' — ' + d.pasal : ''}`);
            });
          }
          if (topic.pasals) {
            contextParts.push('Pasal-pasal:');
            topic.pasals.forEach(p => {
              contextParts.push(`  - [${p.tipe.toUpperCase()}] ${p.ref}: ${p.isi}`);
            });
          }
        });
      }
    }

    // 3. Statistik umum
    const totalDocs = MOCK_DOCUMENTS.length;
    const categories = HIERARCHY_LEVELS.filter(h => MOCK_DOCUMENTS.some(d => d.category === h.id));
    contextParts.push(`\n\n=== STATISTIK DATABASE ===`);
    contextParts.push(`Total dokumen: ${totalDocs}`);
    contextParts.push(`Kategori tersedia: ${categories.map(c => c.name).join(', ')}`);

    return contextParts.join('\n');
  },

  /* =============================================
     Gemini API Call dengan Streaming
     ============================================= */
  async callGeminiStream(query, context) {
    const systemPrompt = `Kamu adalah AI Assistant Hukum bernama "Kamus Praturan Pintar AI" yang sangat ahli dalam bidang hukum dan peraturan daerah di Indonesia, khususnya Kabupaten Tanah Bumbu, Kalimantan Selatan.

ATURAN PENTING:
1. Jawab SELALU berdasarkan data/konteks yang diberikan. Jangan mengarang informasi yang tidak ada di konteks.
2. Jika data tidak tersedia di konteks, katakan dengan jujur bahwa data tersebut tidak ditemukan di database.
3. Sebutkan sumber peraturan secara spesifik (nama Perda/Perbup, nomor, tahun, pasal) saat menjawab.
4. Gunakan Bahasa Indonesia yang formal namun mudah dipahami.
5. Strukturkan jawaban dengan baik menggunakan format markdown (bold, list, heading).
6. Jika pertanyaan melibatkan analisis atau perbandingan, berikan penalaran langkah demi langkah.
7. Jika ditanya tentang sanksi, sebutkan dengan detail jenis sanksi dan besaran denda/kurungan.
8. Jangan gunakan heading level 1 (#). Mulai dari heading level 3 (###) untuk sub-bagian.

FORMAT JAWABAN:
- Mulai dengan ringkasan singkat (1-2 kalimat)
- Jelaskan detail berdasarkan data
- Akhiri dengan sumber referensi menggunakan format: 📎 **Sumber:** [daftar peraturan]`;

    // Build conversation with context
    const contents = [];

    // Add chat history (last 6 messages for context)
    const recentHistory = this.chatHistory.slice(-6);
    recentHistory.forEach(msg => {
      contents.push({
        role: msg.role,
        parts: [{ text: msg.text }]
      });
    });

    // Add current user message with RAG context
    const userMessage = context
      ? `Pertanyaan pengguna: ${query}\n\nBerikut data dari database peraturan yang relevan:\n\n${context}`
      : query;

    contents.push({
      role: 'user',
      parts: [{ text: userMessage }]
    });

    const body = {
      model: this.GEMINI_MODEL,
      contents,
      systemInstruction: {
        parts: [{ text: systemPrompt }]
      },
      generationConfig: {
        temperature: 0.7,
        maxOutputTokens: 4096,
        thinkingConfig: {
          thinkingBudget: 4096
        }
      }
    };

    const response = await fetch(this.PROXY_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body)
    });

    if (!response.ok) {
      const errText = await response.text();
      throw new Error(`Gemini API Error ${response.status}: ${errText}`);
    }

    return response.body;
  },

  /* =============================================
     Parse SSE Stream dari Gemini
     ============================================= */
  async processStream(stream, bubbleEl) {
    const reader = stream.getReader();
    const decoder = new TextDecoder();
    let fullText = '';
    let buffer = '';

    try {
      while (true) {
        const { done, value } = await reader.read();
        if (done) break;

        buffer += decoder.decode(value, { stream: true });
        const lines = buffer.split('\n');
        buffer = lines.pop() || '';

        for (const line of lines) {
          if (!line.startsWith('data: ')) continue;
          const jsonStr = line.slice(6).trim();
          if (!jsonStr || jsonStr === '[DONE]') continue;

          try {
            const data = JSON.parse(jsonStr);
            if (data.candidates && data.candidates[0]) {
              const parts = data.candidates[0].content?.parts || [];
              for (const part of parts) {
                // Skip thinking/reasoning parts — only show final output
                if (part.thought) continue;
                if (part.text) {
                  fullText += part.text;
                  bubbleEl.innerHTML = this.renderMarkdown(fullText);
                  // Auto scroll
                  const container = document.getElementById('aiMessages');
                  container.scrollTop = container.scrollHeight;
                }
              }
            }
          } catch (e) {
            // Skip malformed JSON chunks
          }
        }
      }
    } catch (e) {
      if (e.name !== 'AbortError') {
        console.error('[AI] Stream error:', e);
      }
    }

    return fullText;
  },

  /* =============================================
     SEND MESSAGE — Main Flow
     ============================================= */
  async sendMessage() {
    if (this.isStreaming) return;
    const input = document.getElementById('aiInput');
    const text = input.value.trim();
    if (!text) return;
    input.value = '';

    // Add user message
    this.addUserMessage(text);
    this.chatHistory.push({ role: 'user', text });

    // Show typing indicator
    this.showTyping();
    this.isStreaming = true;

    // Disable input
    const sendBtn = document.getElementById('aiSendBtn');
    sendBtn.disabled = true;
    sendBtn.style.opacity = '0.5';

    try {
      // Build RAG context
      const context = this.buildRAGContext(text);

      // Create bot message placeholder
      const { bubbleEl, sourceEl } = this.createBotPlaceholder();

      // Hide typing, show streaming bubble
      this.hideTyping();

      // Call Gemini with streaming
      const stream = await this.callGeminiStream(text, context);
      const fullResponse = await this.processStream(stream, bubbleEl);

      // Save to history
      this.chatHistory.push({ role: 'model', text: fullResponse });

      // Add source info
      const sources = this.extractSources(text);
      if (sources && sourceEl) {
        sourceEl.innerHTML = `<strong>📎 Database:</strong> ${sources}`;
        sourceEl.style.display = 'block';
      }

    } catch (err) {
      console.warn('[AI] Gemini API error, using fallback:', err);
      this.hideTyping();

      // Fallback ke simulasi lokal
      const fallback = this.generateFallbackResponse(text);
      this.addBotMessage(`⚠️ *Mode Offline — Gemini tidak tersedia*\n\n${fallback.answer}`, fallback.source);
    }

    // Re-enable input
    this.isStreaming = false;
    sendBtn.disabled = false;
    sendBtn.style.opacity = '1';
    input.focus();
  },

  /* =============================================
     Extract Source References
     ============================================= */
  extractSources(query) {
    const sources = [];
    const terms = query.toLowerCase().split(/\s+/);
    const scored = MOCK_DOCUMENTS.map(doc => {
      let score = 0;
      const searchable = (doc.title + ' ' + doc.content + ' ' + (doc.tags || []).join(' ')).toLowerCase();
      terms.forEach(t => { if (searchable.includes(t)) score++; });
      return { doc, score };
    }).filter(r => r.score > 0).sort((a, b) => b.score - a.score).slice(0, 3);

    scored.forEach(({ doc }) => {
      const cat = HIERARCHY_LEVELS.find(h => h.id === doc.category);
      sources.push(`${cat ? cat.icon + ' ' : ''}${doc.title} (${doc.year})`);
    });

    return sources.length > 0 ? sources.join(' · ') : null;
  },

  /* =============================================
     Fallback Response (tanpa API)
     ============================================= */
  generateFallbackResponse(query) {
    const q = query.toLowerCase();
    const results = [];

    MOCK_DOCUMENTS.forEach(doc => {
      const searchable = (doc.title + ' ' + doc.content + ' ' + (doc.tags || []).join(' ')).toLowerCase();
      const terms = q.split(/\s+/);
      let score = 0;
      terms.forEach(t => { if (searchable.includes(t)) score++; });
      if (score > 0) results.push({ doc, score });
    });

    results.sort((a, b) => b.score - a.score);

    if (results.length === 0) {
      return {
        answer: 'Maaf, saya tidak menemukan peraturan yang relevan dengan pertanyaan Anda. Coba gunakan kata kunci yang berbeda.',
        source: null
      };
    }

    const topDoc = results[0].doc;
    const cat = HIERARCHY_LEVELS.find(h => h.id === topDoc.category);
    return {
      answer: `Berdasarkan **${topDoc.title}**:\n\n${topDoc.content}\n\nPeraturan ini berstatus **${topDoc.status}**.`,
      source: `${cat ? cat.icon + ' ' : ''}${topDoc.title} (${topDoc.year})`
    };
  },

  /* =============================================
     Markdown Renderer (simple)
     ============================================= */
  renderMarkdown(text) {
    let html = this.escapeHtml(text);

    // Headers (### only, no h1/h2)
    html = html.replace(/^### (.+)$/gm, '<h4 class="ai-md-h3">$1</h4>');
    html = html.replace(/^#### (.+)$/gm, '<h5 class="ai-md-h4">$1</h5>');

    // Bold
    html = html.replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>');
    // Italic
    html = html.replace(/\*(.+?)\*/g, '<em>$1</em>');

    // Numbered lists
    html = html.replace(/^(\d+)\.\s+(.+)$/gm, '<li class="ai-md-oli">$2</li>');
    html = html.replace(/(<li class="ai-md-oli">.*<\/li>\n?)+/g, '<ol class="ai-md-ol">$&</ol>');

    // Bullet lists
    html = html.replace(/^[-•]\s+(.+)$/gm, '<li class="ai-md-li">$1</li>');
    html = html.replace(/(<li class="ai-md-li">.*<\/li>\n?)+/g, '<ul class="ai-md-ul">$&</ul>');

    // Inline code
    html = html.replace(/`([^`]+)`/g, '<code class="ai-md-code">$1</code>');

    // Line breaks
    html = html.replace(/\n\n/g, '</p><p>');
    html = html.replace(/\n/g, '<br>');

    return '<p>' + html + '</p>';
  },

  /* =============================================
     UI Helpers
     ============================================= */
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

  createBotPlaceholder() {
    const container = document.getElementById('aiMessages');
    const now = new Date().toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' });
    const msgId = 'ai-msg-' + Date.now();

    container.innerHTML += `
      <div class="ai-message bot" id="${msgId}">
        <div class="ai-msg-avatar">🤖</div>
        <div style="flex:1;min-width:0;">
          <div class="ai-msg-bubble ai-streaming" id="${msgId}-bubble">
            <span class="ai-cursor-blink">▍</span>
          </div>
          <div class="ai-msg-source" id="${msgId}-source" style="display:none;"></div>
          <div class="ai-msg-time">${now}</div>
        </div>
      </div>`;
    container.scrollTop = container.scrollHeight;

    return {
      bubbleEl: document.getElementById(`${msgId}-bubble`),
      sourceEl: document.getElementById(`${msgId}-source`)
    };
  },

  addBotMessage(text, source) {
    const container = document.getElementById('aiMessages');
    const now = new Date().toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' });
    const formatted = this.renderMarkdown(text);
    let sourceHtml = source ? `<div class="ai-msg-source"><strong>📎 Sumber:</strong> ${source}</div>` : '';

    container.innerHTML += `
      <div class="ai-message bot">
        <div class="ai-msg-avatar">🤖</div>
        <div style="flex:1;min-width:0;">
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
