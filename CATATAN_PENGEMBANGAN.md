# 📝 Catatan Pengembangan — Kamus Praturan Pintar
**Tanggal:** 2 Mei 2026  
**Developer:** Abang AL + AI Assistant (Antigravity)

---

## Sesi 1: Membaca & Memahami Seluruh Alur Aplikasi

### Struktur Aplikasi
```
APlikasi 3/
├── index.html          → Halaman login
├── dashboard.html      → Dashboard SPA-like (8 view)
├── css/ (9 file)       → Design system dark mode premium
└── js/ (12 file)       → Modul-modul aplikasi
```

### 12 Modul JavaScript
| Modul | Fungsi |
|-------|--------|
| `auth.js` | Login (admin: `admin123`, pengunjung: `tamu123`), session 24 jam |
| `mock-data.js` | 25 dokumen hukum hardcoded + helper functions |
| `legal-knowledge.js` | 16 topik hukum + pasal (Knowledge Panel) |
| `search-engine.js` | Full-text search + scoring + Knowledge Panel |
| `drive-api.js` | Google Drive API, BFS rekursif (maks 8 level), inferensi topik |
| `app.js` | Main controller, routing, modal dokumen |
| `ai-assistant.js` | AI chatbot (sekarang pakai Gemini API) |
| `hierarchy.js` | Visualisasi hierarki peraturan |
| `dashboard-stats.js` | Statistik beranda + chart |
| `history.js` | Riwayat pencarian (localStorage) |
| `upload.js` | Upload dokumen (simulasi, admin only) |
| `data-manager.js` | CRUD dokumen (admin only, in-memory) |

### Alur Data Utama
1. **Progressive loading**: Mock data (instant) → Google Drive (async) → replace & re-render
2. **Inferensi topik**: File "ketertiban" → otomatis dapat tag "sanksi", "denda", dll
3. **Knowledge Panel**: Info pasal hukum muncul di atas hasil pencarian
4. **1.933 dokumen** dari Google Drive berhasil terindeks

### Urutan Loading Script (KRITIS)
```
1. mock-data.js → 2. legal-knowledge.js → 3. search-engine.js → 4. drive-api.js
→ 5. app.js → 6. ai-assistant.js → 7. hierarchy.js → 8. upload.js
→ 9. dashboard-stats.js → 10. history.js → 11. data-manager.js
```

---

## Sesi 2: Sinkronisasi Website GitHub Pages

### Masalah
Website di https://b4jinganasu.github.io/JDIH_Pintar/ belum terupdate — ada 4 file yang belum di-push.

### File yang Belum Sinkron
| File | Masalah |
|------|---------|
| `js/legal-knowledge.js` | **Belum ada** di GitHub (404) |
| `js/search-engine.js` | **Versi lama** (4,836 vs 9,003 bytes) |
| `css/search.css` | **Belum terupdate** (style Knowledge Panel) |
| `dashboard.html` | **Script tag** `legal-knowledge.js` belum ada |

### Solusi
```bash
git add css/search.css dashboard.html js/search-engine.js js/legal-knowledge.js
git commit -m "Tambah Legal Knowledge Panel + update search engine"
git push origin main
# Commit: 62c6c23
```

✅ **Website sekarang 100% sinkron dengan kode lokal.**

---

## Sesi 3: Upgrade AI Assistant → Gemini 2.5 Flash

### Perubahan
AI Assistant di-upgrade dari simulasi keyword matching menjadi **RAG + Gemini API**.

| Aspek | Sebelum | Sesudah |
|-------|---------|---------|
| Engine | Keyword matching | **Gemini 2.5 Flash** (thinking mode) |
| Konteks | Tidak ada | **RAG** — ambil dari database |
| Jawaban | Template statis | **Analisis cerdas** dengan penalaran |
| Tampilan | Teks polos | **Markdown rendering** |
| Response | Loading → sekaligus | **Streaming** kata per kata |
| Fallback | Tidak ada | **Mode offline** jika API gagal |

### File yang Diubah
- `js/ai-assistant.js` — Rewrite total (136 → 310+ baris)
- `css/ai-chat.css` — Tambah style markdown + streaming cursor

### Commit
```bash
git commit -m "Upgrade AI Assistant: Gemini 2.5 Flash + RAG + Streaming"
git push origin main
# Commit: db90d89
```

### ⚠️ MASALAH: API Key Terblokir
```
Error 403: "Your API key was reported as leaked. Please use another API key."
```

**Penyebab:** Google mendeteksi API key yang di-push ke repo publik dan otomatis menonaktifkannya.

### TODO: Solusi API Key
1. ❌ API Key lama: `AIzaSyAbLu7ffYOYLdTq97YUtAxmZqQBo0jv5r4` (DIBLOKIR)
2. [ ] Buat API Key baru di https://aistudio.google.com/apikey
3. [ ] Set restriction di Google Cloud Console:
   - Application restrictions → HTTP referrers
   - Tambahkan: `https://b4jinganasu.github.io/*`
4. [ ] Update key di `js/ai-assistant.js` baris 8
5. [ ] Push ulang ke GitHub

### Cara Set API Key Restriction
1. Buka https://console.cloud.google.com/apis/credentials
2. Klik API Key yang baru
3. Di "Application restrictions" → pilih **HTTP referrers (websites)**
4. Tambahkan: `https://b4jinganasu.github.io/*`
5. Di "API restrictions" → pilih **Restrict key** → centang **Generative Language API**
6. Save

---

## Konfigurasi Penting

### Google Drive
- **Root Folder ID:** `107J1Zmlhb0-Ba9u2ActNRkEgzjs9tKWl`
- **Drive API Key:** `AIzaSyBqAZkO8CXOfEsWQKajBJh8xZSGKyWN3j8`
- **Link:** https://drive.google.com/drive/folders/107J1Zmlhb0-Ba9u2ActNRkEgzjs9tKWl

### Website
- **URL:** https://b4jinganasu.github.io/JDIH_Pintar/
- **Repo:** https://github.com/B4jinganasu/JDIH_Pintar

### Gemini API
- **Model:** `gemini-2.5-flash` (dengan thinking mode)
- **Key lama (DIBLOKIR):** `AIzaSyAbLu7ffYOYLdTq97YUtAxmZqQBo0jv5r4`
- **Key baru:** _(belum dibuat)_

---

## Login Credentials
| Role | Password | Akses |
|------|----------|-------|
| Admin | `admin123` | Semua fitur |
| Pengunjung | `tamu123` | Beranda, Pencarian, AI, Hierarki, Riwayat |
