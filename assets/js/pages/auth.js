import { getUser, setUser, logout } from '../storage.js';

export default async function render(app) {
  const user = getUser();
  if (user) {
    app.innerHTML = `
      <section class="auth-wrap">
        <div class="auth-visual">
          <img src="https://images.unsplash.com/photo-1512436991641-6745cdb1723f?q=80&w=1200&auto=format&fit=crop" alt="Welcome back" />
        </div>
        <div class="auth">
          <h1>Welcome back, ${user.name}</h1>
          <p class="hint">Signed in as ${user.email}</p>
          <div class="alt">
            <button id="logout" class="btn btn-outline">Logout</button>
            <a class="btn btn-ghost" href="../index.html">Go to Home</a>
          </div>
        </div>
      </section>
    `;
    app.querySelector('#logout').addEventListener('click', () => {
      logout();
      window.location.reload();
    });
    return;
  }
  app.innerHTML = `
    <section class="auth-wrap">
      <div class="auth-visual">
        <img src="https://images.unsplash.com/photo-1503341455253-b2e723bb3dbb?q=80&w=1200&auto=format&fit=crop" alt="Shop in style" />
      </div>
      <div class="auth">
        <h1>Login</h1>
        <form id="auth-form" novalidate>
          <div class="row">
            <input name="email" type="email" placeholder="Email" required />
            <input name="password" type="password" placeholder="Password" required />
          </div>
          <button class="btn btn-primary" type="submit">Login</button>
          <p class="hint">Demo credentials: demo@gmail.com / 12345</p>
        </form>
      </div>
    </section>
  `;
  app.querySelector('#auth-form').addEventListener('submit', (e) => {
    e.preventDefault();
    const data = Object.fromEntries(new FormData(e.currentTarget).entries());
    const email = (data.email || '').trim().toLowerCase();
    const password = (data.password || '').trim();
    if (email === 'demo@gmail.com' && password === '12345') {
      setUser({ name: 'Anshika Sahu', email: 'demo@gmail.com' });
      window.location.href = '../index.html';
      return;
    }
    alert('Invalid email or password. Use demo@gmail.com / 12345');
  });
}


