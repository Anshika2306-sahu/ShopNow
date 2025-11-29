import { getCart, setCart, removeFromCart, updateCartQty, toggleWishlist, getWishlist } from '../storage.js';
import { getProductById } from '../api/products.js';
import { formatPrice } from '../utils/format.js';
import { updateHeaderCounts } from '../components/header.js';

export default async function render(app) {
  const bag = await expandCart(getCart());
  app.innerHTML = `
    <section class="cart">
      <div>
        <h2>Bag</h2>
        <div class="bag" id="bag"></div>
      </div>
      <aside class="summary" id="summary"></aside>
    </section>
  `;

  renderBag(app, bag);
  renderSummary(app, bag);
}

async function expandCart(cart) {
  const items = [];
  for (const it of cart) {
    const p = await getProductById(it.productId);
    if (p) items.push({ ...it, product: p });
  }
  return items;
}

function renderBag(app, items) {
  const root = app.querySelector('#bag');
  root.innerHTML = '';
  items.forEach(({ product, size, qty }) => {
    const row = document.createElement('div');
    row.className = 'bag-item';
    row.innerHTML = `
      <img src="${product.images?.[0] || ''}" alt="${product.title}" />
      <div>
        <div style="font-weight:600">${product.brand}</div>
        <div style="color:var(--muted-text);font-size:14px;">${product.title}</div>
        <div style="margin:6px 0;">
          <span class="chip">Size: ${size}</span>
          <span class="chip">Qty: <select data-role="qty">
            ${[1,2,3,4,5].map(n => `<option value="${n}"${n===qty?' selected':''}>${n}</option>`).join('')}
          </select></span>
        </div>
        <div class="price">
          <strong>${formatPrice(product.price * qty)}</strong>
          <span class="mrp">${formatPrice(product.mrp * qty)}</span>
          <span class="offer">${product.discountPercent}% OFF</span>
        </div>
      </div>
      <div class="bag-actions">
        <button class="btn btn-outline" data-role="move-wishlist">Move to Wishlist</button>
        <button class="btn btn-outline" data-role="remove">Remove</button>
      </div>
    `;
    row.querySelector('[data-role="remove"]').addEventListener('click', () => {
      removeFromCart(product.id, size);
      window.location.reload();
    });
    row.querySelector('[data-role="move-wishlist"]').addEventListener('click', () => {
      const list = toggleWishlist(product.id);
      removeFromCart(product.id, size);
      updateHeaderCounts({
        cartCount: getCart().reduce((acc, it) => acc + (it.qty || 1), 0),
        wishlistCount: list.length
      });
      window.location.reload();
    });
    row.querySelector('[data-role="qty"]').addEventListener('change', (e) => {
      updateCartQty(product.id, size, parseInt(e.target.value, 10));
      window.location.reload();
    });
    root.appendChild(row);
  });
}

function renderSummary(app, items) {
  const totalMrp = items.reduce((acc, it) => acc + (it.product.mrp * it.qty), 0);
  const totalPrice = items.reduce((acc, it) => acc + (it.product.price * it.qty), 0);
  const discount = totalMrp - totalPrice;
  const shipping = totalPrice > 1199 ? 0 : 99;
  const toPay = totalPrice + shipping;
  const summary = app.querySelector('#summary');
  summary.innerHTML = `
    <h3>PRICE DETAILS (${items.reduce((a,b)=>a+b.qty,0)} items)</h3>
    <div class="row"><span>Total MRP</span><span>${formatPrice(totalMrp)}</span></div>
    <div class="row"><span>Discount on MRP</span><span style="color:var(--success)">- ${formatPrice(discount)}</span></div>
    <div class="row"><span>Shipping Fee</span><span>${shipping === 0 ? '<span style="color:var(--success)">FREE</span>' : formatPrice(shipping)}</span></div>
    <div class="row total"><span>Total Amount</span><span>${formatPrice(toPay)}</span></div>
    <button class="btn btn-primary" style="width:100%;margin-top:12px;">PLACE ORDER</button>
  `;
}






