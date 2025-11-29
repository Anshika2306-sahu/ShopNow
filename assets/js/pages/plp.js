import { fetchProducts } from '../api/products.js';
import { productCard } from '../components/productCard.js';
import { paginate, paginationControls } from '../components/pagination.js';

export default async function render(app) {
  const params = new URLSearchParams(window.location.search);
  const currentCategory = params.get('category') || '';
  const currentSub = params.get('subCategory') || '';
  const search = (params.get('search') || '').toLowerCase();
  const sort = params.get('sort') || 'recommended';
  const pageParam = parseInt(params.get('page') || '1', 10);

  const all = await fetchProducts();

  const selectedBrands = new Set((params.get('brands') || '').split(',').filter(Boolean));
  const minDiscount = parseInt(params.get('discount') || '0', 10);

  // Base filtered list (exclude brand filter for computing available brands)
  const baseFiltered = all.filter(p => {
    if (currentCategory && p.category !== currentCategory) return false;
    if (currentSub && p.subCategory !== currentSub) return false;
    if (search && !(p.title.toLowerCase().includes(search) || p.brand.toLowerCase().includes(search))) return false;
    if (p.discountPercent < minDiscount) return false;
    return true;
  });

  // Available brands for current context (category/sub/search/discount)
  const availableBrands = Array.from(new Set(baseFiltered.map(p => p.brand))).sort();

  // Sanitize selected brands against availability
  const filteredSelectedBrands = new Set([...selectedBrands].filter(b => availableBrands.includes(b)));
  if (filteredSelectedBrands.size !== selectedBrands.size) {
    params.set('brands', Array.from(filteredSelectedBrands).join(','));
    // Keep URL in sync without a reload
    window.history.replaceState(null, '', `?${params.toString()}`);
  }

  // Final list including brand filter
  let list = baseFiltered.filter(p => {
    if (filteredSelectedBrands.size && !filteredSelectedBrands.has(p.brand)) return false;
    return true;
  });

  if (sort === 'price_asc') list.sort((a,b) => a.price - b.price);
  if (sort === 'price_desc') list.sort((a,b) => b.price - a.price);
  if (sort === 'discount_desc') list.sort((a,b) => b.discountPercent - a.discountPercent);

  app.innerHTML = `
    <div class="toolbar">
      <div class="left">
        <span><strong>${list.length}</strong> items</span>
        ${currentCategory ? `<span class="chip">${currentCategory.toUpperCase()}</span>` : ''}
        ${currentSub ? `<span class="chip">${currentSub.toUpperCase()}</span>` : ''}
        ${search ? `<span class="chip">Search: "${escapeHtml(search)}"</span>` : ''}
      </div>
      <div class="right">
        <label>Sort:
          <select id="sort">
            <option value="recommended"${sort==='recommended'?' selected':''}>Recommended</option>
            <option value="price_asc"${sort==='price_asc'?' selected':''}>Price: Low to High</option>
            <option value="price_desc"${sort==='price_desc'?' selected':''}>Price: High to Low</option>
            <option value="discount_desc"${sort==='discount_desc'?' selected':''}>Better Discount</option>
          </select>
        </label>
      </div>
    </div>
    <div class="plp">
      <aside class="filters">
        <h3>Filters</h3>
        <div class="group">
          <strong>Brand</strong>
          <div id="brand-filters"></div>
        </div>
        <div class="group">
          <strong>Discount</strong>
          <select id="discount">
            ${[0,10,20,30,40,50,60,70].map(d => `<option value="${d}"${d===minDiscount?' selected':''}>${d}% and above</option>`).join('')}
          </select>
        </div>
      </aside>
      <section>
        <div id="grid" class="plp-grid"></div>
        <div id="pager"></div>
      </section>
    </div>
  `;

  // Brand filters
  const brandBox = app.querySelector('#brand-filters');
  brandBox.innerHTML = availableBrands.map(b => `
    <label><input type="checkbox" value="${b}" ${filteredSelectedBrands.has(b) ? 'checked' : ''}/> ${b}</label>
  `).join('');
  brandBox.addEventListener('change', () => {
    const checked = Array.from(brandBox.querySelectorAll('input:checked')).map(i => i.value);
    params.set('brands', checked.join(','));
    params.set('page', '1');
    window.location.search = params.toString();
  });
  app.querySelector('#discount').addEventListener('change', (e) => {
    params.set('discount', e.target.value);
    params.set('page', '1');
    window.location.search = params.toString();
  });
  app.querySelector('#sort').addEventListener('change', (e) => {
    params.set('sort', e.target.value);
    window.location.search = params.toString();
  });

  // Pagination and grid
  const perPage = 24;
  const meta = paginate(list, pageParam, perPage);
  const grid = app.querySelector('#grid');
  grid.innerHTML = '';
  meta.items.forEach(p => {
    grid.appendChild(productCard(p, {
      onClick: () => {
        window.location.href = `../pages/product.html?id=${encodeURIComponent(p.id)}`;
      }
    }));
  });
  const pager = app.querySelector('#pager');
  pager.innerHTML = '';
  pager.appendChild(paginationControls(meta, (nextPage) => {
    params.set('page', String(nextPage));
    window.location.search = params.toString();
  }));
}

function escapeHtml(s) {
  return s.replace(/[&<>"']/g, ch => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#039;'}[ch]));
}


