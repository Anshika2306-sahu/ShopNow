import { getWishlist, toggleWishlist, addToCart } from '../storage.js';
import { fetchProducts } from '../api/products.js';
import { productCard } from '../components/productCard.js';

export default async function render(app) {
  const [list, products] = [getWishlist(), await fetchProducts()];
  const items = products.filter(p => list.includes(p.id));
  app.innerHTML = `
    <section>
      <h2>Wishlist (${items.length})</h2>
      <div class="wishlist" id="grid"></div>
    </section>
  `;
  const grid = app.querySelector('#grid');
  items.forEach(p => {
    const card = productCard(p, {
      onClick: () => window.location.href = `../pages/product.html?id=${encodeURIComponent(p.id)}`
    });
    const removeBtn = document.createElement('button');
    removeBtn.className = 'remove';
    removeBtn.textContent = '×';
    removeBtn.title = 'Remove from wishlist';
    removeBtn.addEventListener('click', () => {
      toggleWishlist(p.id);
      window.location.reload();
    });
    const addBtn = document.createElement('button');
    addBtn.className = 'btn btn-outline';
    addBtn.style.margin = '8px';
    addBtn.textContent = 'Move to Bag';
    addBtn.addEventListener('click', () => {
      const size = p.sizes?.[0] || 'Std';
      addToCart({ productId: p.id, size, qty: 1 });
      toggleWishlist(p.id);
      window.location.href = '../pages/cart.html';
    });
    card.appendChild(removeBtn);
    card.querySelector('.card-body').appendChild(addBtn);
    grid.appendChild(card);
  });
}






