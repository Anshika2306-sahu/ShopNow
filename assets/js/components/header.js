import { getCart, getWishlist, getUser } from '../storage.js';
import { debounce } from '../utils/debounce.js';
import { fetchProducts } from '../api/products.js';

export function renderHeader(root) {
  const header = document.createElement('header');
  header.className = 'header';
  header.innerHTML = `
    <div class="container header-inner">
      <a class="brand" href="${relativeToRoot('index.html')}">
        <span class="brand-logo" aria-hidden="true"></span>
        <span>ShopNow</span>
      </a>
      <nav class="nav" aria-label="Primary">
        ${navItem('Makeup','makeup', ['lipstick','foundation','kajal'])}
        ${navItem('Sunglasses','sunglasses', ['aviator','wayfarer','sport'])}
        ${navItem('Watches','watches', ['analog','chronograph','smartwatch'])}
        ${navItem('Perfumes','perfumes', ['edt','edp','spray'])}
        ${navItem('Shoes','shoes', ['running','sneakers','training'])}
        ${navItem('Clothes','clothes', ['tshirts','shirts','jeans'])}
      </nav>
      <div class="searchbar" role="search">
        <svg width="16" height="16" viewBox="0 0 24 24" aria-hidden="true"><path fill="currentColor" d="M21 21l-4.33-4.33m1.66-4.67a7 7 0 11-14 0 7 7 0 0114 0Z"/></svg>
        <input id="global-search" type="search" placeholder="Search for products, brands and more" aria-label="Search" />
        <div id="search-suggest" class="search-suggest" role="listbox" aria-label="Suggestions"></div>
      </div>
      <div class="actions">
        <a class="action" href="${relativeToRoot('pages/auth.html')}">
          <span class="icon" aria-hidden="true"></span>
          <span data-role="profile-label">Profile</span>
        </a>
        <a class="action" href="${relativeToRoot('pages/wishlist.html')}">
          <span class="icon" aria-hidden="true"><span id="hdr-wishlist-count" class="badge">0</span></span>
          <span>Wishlist</span>
        </a>
        <a class="action" href="${relativeToRoot('pages/cart.html')}">
          <span class="icon" aria-hidden="true"><span id="hdr-cart-count" class="badge">0</span></span>
          <span>Bag</span>
        </a>
      </div>
    </div>
  `;

  root.innerHTML = '';
  root.appendChild(header);
  wireSearch(header);
  const u = getUser && getUser();
  const profileLabel = header.querySelector('[data-role="profile-label"]');
  if (profileLabel) {
    profileLabel.textContent = (u && u.name) ? `Hi! ${u.name}` : 'Profile';
  }
  updateHeaderCounts({
    cartCount: getCart().reduce((acc, it) => acc + (it.qty || 1), 0),
    wishlistCount: getWishlist().length
  });
}

function wireSearch(header) {
  const input = header.querySelector('#global-search');
  const panel = header.querySelector('#search-suggest');
  if (!input) return;
  const go = () => {
    const q = input.value.trim();
    const url = relativeToRoot(`pages/products.html${q ? `?search=${encodeURIComponent(q)}` : ''}`);
    window.location.href = url;
  };
  input.addEventListener('keydown', (e) => {
    if (e.key === 'Enter') go();
  });
  const updateHint = debounce(async () => {
    const q = input.value.trim().toLowerCase();
    if (!q) { input.title = ''; if (panel) { panel.classList.remove('active'); panel.innerHTML=''; } return; }
    const list = await fetchProducts();
    const suggestions = list.filter(p => p.title.toLowerCase().includes(q) || p.brand.toLowerCase().includes(q)).slice(0, 8);
    const match = suggestions[0];
    input.title = match ? `${match.brand} – ${match.title}` : '';
    if (panel) {
      if (suggestions.length === 0) { panel.classList.remove('active'); panel.innerHTML=''; return; }
      panel.innerHTML = suggestions.map(s => `
        <a role="option" href="${relativeToRoot('pages/product.html')}?id=${encodeURIComponent(s.id)}">
          ${escapeHtml(s.brand)} – ${escapeHtml(s.title)}
        </a>
      `).join('');
      panel.classList.add('active');
    }
  }, 200);
  input.addEventListener('input', updateHint);
  document.addEventListener('click', (e) => {
    if (!panel) return;
    if (!panel.contains(e.target) && e.target !== input) {
      panel.classList.remove('active');
    }
  });
}

export function updateHeaderCounts({ cartCount, wishlistCount }) {
  const c = document.getElementById('hdr-cart-count');
  const w = document.getElementById('hdr-wishlist-count');
  if (c) c.textContent = String(cartCount ?? 0);
  if (w) w.textContent = String(wishlistCount ?? 0);
}

function relativeToRoot(path) {
  // Compute relative link robustly across nested pages
  const here = window.location.pathname.replace(/\\/g, '/');
  const isRoot = /\/tachu_website\/?$/.test(here) || /\/tachu_website\/index\.html$/.test(here);
  if (here.endsWith('/pages/') || here.includes('/pages/')) {
    return `../${path}`;
  }
  return isRoot ? `${path}` : `${path}`;
}

function navItem(label, category, subs) {
  return `
    <div class="has-mega">
      <a href="${relativeToRoot('pages/products.html?category=')}${encodeURIComponent(category)}">${label}</a>
      <div class="mega">
        <div class="container mega-inner">
          <div>
            <h4>${label}</h4>
            ${subs.map(it => `<a href="${relativeToRoot('pages/products.html')}?category=${encodeURIComponent(category)}&subCategory=${encodeURIComponent(it)}">${capitalize(it)}</a>`).join('')}
          </div>
        </div>
      </div>
    </div>
  `;
}

function capitalize(s) { return s.charAt(0).toUpperCase() + s.slice(1); }
function escapeHtml(s) { return s.replace(/[&<>"']/g, ch => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#039;'}[ch])); }


