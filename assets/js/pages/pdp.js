import { getProductById } from '../api/products.js';
import { formatPrice } from '../utils/format.js';
import { addToCart, toggleWishlist, getWishlist } from '../storage.js';
import { updateHeaderCounts } from '../components/header.js';

export default async function render(app) {
  const params = new URLSearchParams(window.location.search);
  const id = params.get('id');
  if (!id) {
    app.innerHTML = `<p>Product not found.</p>`;
    return;
  }
  const product = await getProductById(id);
  if (!product) {
    app.innerHTML = `<p>Product not found.</p>`;
    return;
  }

  const inWishlist = getWishlist().includes(product.id);

  app.innerHTML = `
    <section class="pdp">
      <div class="pdp-media">
        ${[0,1,2,3].map(i => `<img src="${product.images?.[i] || product.images?.[0] || ''}" alt="${product.title} image ${i+1}" />`).join('')}
      </div>
      <div class="pdp-details">
        <div class="brand">${product.brand}</div>
        <h1>${product.title}</h1>
        <div class="price">
          <strong>${formatPrice(product.price)}</strong>
          <span class="mrp">${formatPrice(product.mrp)}</span>
          <span class="offer">${product.discountPercent}% OFF</span>
        </div>
        <div>
          <div style="font-weight:600;margin:8px 0 6px;">Select Size</div>
          <div class="sizes" id="sizes"></div>
        </div>
        <div class="pdp-actions">
          <button id="add-bag" class="btn btn-primary">Add to Bag</button>
          <button id="toggle-wishlist" class="btn btn-outline">${inWishlist ? 'Wishlisted' : 'Wishlist'}</button>
        </div>
        <div style="margin-top:16px;color:var(--muted-text);font-size:14px;">
          <div>Category: ${product.category} / ${product.subCategory}</div>
          <div>Color: ${product.color}</div>
          <div>Rating: ${product.rating} (${product.ratingsCount})</div>
        </div>
      </div>
    </section>
  `;

  // sizes
  const sizesRoot = app.querySelector('#sizes');
  let selected = product.sizes?.[0] || 'Std';
  (product.sizes?.length ? product.sizes : ['Std']).forEach(size => {
    const btn = document.createElement('button');
    btn.className = `size-btn${size===selected?' active':''}`;
    btn.textContent = size;
    btn.addEventListener('click', () => {
      selected = size;
      sizesRoot.querySelectorAll('.size-btn').forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
    });
    sizesRoot.appendChild(btn);
  });

  // actions
  app.querySelector('#add-bag').addEventListener('click', () => {
    addToCart({ productId: product.id, size: selected, qty: 1 });
    updateHeaderCounts({
      cartCount: (parseInt(document.getElementById('hdr-cart-count')?.textContent || '0', 10) + 1),
      wishlistCount: getWishlist().length,
    });
  });
  app.querySelector('#toggle-wishlist').addEventListener('click', (e) => {
    const list = toggleWishlist(product.id);
    e.currentTarget.textContent = list.includes(product.id) ? 'Wishlisted' : 'Wishlist';
    updateHeaderCounts({
      cartCount: parseInt(document.getElementById('hdr-cart-count')?.textContent || '0', 10),
      wishlistCount: list.length,
    });
  });
}






