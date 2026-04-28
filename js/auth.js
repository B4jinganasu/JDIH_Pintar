/* ============================================
   JDIH Pintar - Authentication System
   ============================================ */

const Auth = {
  PASSWORDS: { admin: 'admin123', visitor: 'tamu123' },
  currentRole: null,
  selectedRole: 'admin',

  init() {
    const session = localStorage.getItem('jdih_session');
    if (session) {
      const data = JSON.parse(session);
      if (Date.now() - data.timestamp < 24 * 60 * 60 * 1000) {
        this.currentRole = data.role;
        window.location.href = 'dashboard.html';
        return;
      } else {
        localStorage.removeItem('jdih_session');
      }
    }
    this.setupEventListeners();
  },

  setupEventListeners() {
    document.querySelectorAll('.role-tab').forEach(tab => {
      tab.addEventListener('click', () => {
        document.querySelectorAll('.role-tab').forEach(t => t.classList.remove('active'));
        tab.classList.add('active');
        this.selectedRole = tab.dataset.role;
        const label = document.getElementById('passwordLabel');
        const input = document.getElementById('passwordInput');
        label.textContent = this.selectedRole === 'admin' ? 'Kata Sandi Admin' : 'Kata Sandi Pengunjung';
        input.placeholder = this.selectedRole === 'admin' ? 'Masukkan kata sandi admin...' : 'Masukkan kata sandi pengunjung...';
        this.hideError();
        input.value = '';
        input.focus();
      });
    });

    document.getElementById('loginForm').addEventListener('submit', (e) => {
      e.preventDefault();
      this.handleLogin();
    });

    document.getElementById('togglePassword').addEventListener('click', () => {
      const input = document.getElementById('passwordInput');
      input.type = input.type === 'password' ? 'text' : 'password';
    });
  },

  handleLogin() {
    const password = document.getElementById('passwordInput').value.trim();
    const btn = document.getElementById('loginBtn');
    if (!password) { this.showError('Masukkan kata sandi terlebih dahulu!'); return; }
    btn.classList.add('loading');
    btn.disabled = true;
    setTimeout(() => {
      const correctPassword = this.selectedRole === 'admin' ? this.PASSWORDS.admin : this.PASSWORDS.visitor;
      if (password === correctPassword) {
        this.currentRole = this.selectedRole;
        localStorage.setItem('jdih_session', JSON.stringify({
          role: this.selectedRole, timestamp: Date.now(), loginTime: new Date().toISOString()
        }));
        const card = document.getElementById('loginCard');
        card.style.animation = 'fadeInScale 0.4s var(--ease-out) reverse forwards';
        setTimeout(() => { window.location.href = 'dashboard.html'; }, 400);
      } else {
        btn.classList.remove('loading');
        btn.disabled = false;
        this.showError('Kata sandi salah! Silakan coba lagi.');
        document.getElementById('passwordInput').select();
      }
    }, 800);
  },

  showError(msg) {
    const el = document.getElementById('loginError');
    document.getElementById('loginErrorText').textContent = msg;
    el.classList.add('show');
  },
  hideError() { document.getElementById('loginError').classList.remove('show'); },

  getSession() {
    const s = localStorage.getItem('jdih_session');
    if (!s) return null;
    const d = JSON.parse(s);
    if (Date.now() - d.timestamp > 86400000) { localStorage.removeItem('jdih_session'); return null; }
    return d;
  },
  isAdmin() { const s = this.getSession(); return s && s.role === 'admin'; },
  logout() { localStorage.removeItem('jdih_session'); window.location.href = 'index.html'; }
};

const shakeStyle = document.createElement('style');
shakeStyle.textContent = '@keyframes shake{0%,100%{transform:translateX(0)}25%{transform:translateX(-5px)}75%{transform:translateX(5px)}}';
document.head.appendChild(shakeStyle);
document.addEventListener('DOMContentLoaded', () => Auth.init());
