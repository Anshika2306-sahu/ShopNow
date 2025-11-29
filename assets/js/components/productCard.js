import { formatPrice } from '../utils/format.js';
import { toggleWishlist, getWishlist, addToCart } from '../storage.js';
import { updateHeaderCounts } from './header.js';

export function productCard(product, { onClick } = {}) {
  const inWishlist = getWishlist().includes(product.id);
  const el = document.createElement('article');
  el.className = 'card';
  el.innerHTML = `
    <div class="card-media">
      <img src="${product.images?.[0] || ''}" alt="${product.title}" loading="lazy" />
    </div>
    <div class="card-body">
      <div class="card-title">${product.brand}</div>
      <div class="card-subtitle">${product.title}</div>
      <div class="price">
        <strong>${formatPrice(product.price)}</strong>
        <span class="mrp">${formatPrice(product.mrp)}</span>
        <span class="offer">${product.discountPercent}% OFF</span>
      </div>
      <div style="display:flex;gap:8px;margin-top:8px;">
        <button class="btn btn-outline btn-sm" data-role="wishlist">${inWishlist ? 'Wishlisted' : 'Wishlist'}</button>
        <button class="btn btn-outline btn-sm" data-role="add">Add to Bag</button>
        <button class="btn btn-outline btn-sm" data-role="view">View</button>
      </div>
    </div>
  `;
  el.querySelector('[data-role="view"]').addEventListener('click', () => {
    if (onClick) onClick(product);
  });
  el.querySelector('[data-role="wishlist"]').addEventListener('click', (e) => {
    const list = toggleWishlist(product.id);
    e.currentTarget.textContent = list.includes(product.id) ? 'Wishlisted' : 'Wishlist';
  });
  el.querySelector('[data-role="add"]').addEventListener('click', () => {
    const size = (product.sizes && product.sizes[0]) || 'Std';
    addToCart({ productId: product.id, size, qty: 1 });
    // Update header counts if present
    const currentCart = parseInt(document.getElementById('hdr-cart-count')?.textContent || '0', 10) + 1;
    const currentWish = parseInt(document.getElementById('hdr-wishlist-count')?.textContent || '0', 10);
    updateHeaderCounts({ cartCount: currentCart, wishlistCount: currentWish });
  });
  return el;
}


