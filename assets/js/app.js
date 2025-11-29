// Core app bootstrap
import { renderHeader, updateHeaderCounts } from './components/header.js';
import { renderFooter } from './components/footer.js';
import { getCart, getWishlist } from './storage.js';

const appRoot = document.getElementById('app');
const headerRoot = document.getElementById('header-root');
const footerRoot = document.getElementById('footer-root');

function getCurrentPage() {
  const page = document.documentElement.getAttribute('data-page') || 'home';
  return page;
}

async function loadPageModule(page) {
  switch (page) {
    case 'home':
      return import('./pages/home.js');
    case 'plp':
      return import('./pages/plp.js');
    case 'pdp':
      return import('./pages/pdp.js');
    case 'cart':
      return import('./pages/cart.js');
    case 'wishlist':
      return import('./pages/wishlist.js');
    case 'auth':
      return import('./pages/auth.js');
    default:
      return import('./pages/home.js');
  }
}

async function bootstrap() {
  renderHeader(headerRoot);
  renderFooter(footerRoot);

  // Update header badge counts
  updateHeaderCounts({
    cartCount: getCart().reduce((acc, it) => acc + (it.qty || 1), 0),
    wishlistCount: getWishlist().length,
  });

  const page = getCurrentPage();
  const mod = await loadPageModule(page);
  if (mod && typeof mod.default === 'function') {
    await mod.default(appRoot);
  } else if (mod && typeof mod.render === 'function') {
    await mod.render(appRoot);
  }
}

bootstrap();






