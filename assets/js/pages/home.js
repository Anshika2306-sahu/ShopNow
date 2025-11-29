import { fetchProducts } from '../api/products.js';
import { productCard } from '../components/productCard.js';

export default async function render(app) {
  const all = await fetchProducts();

  const categoryImg = (cat, fallback) => {
    const item = all.find(p => p.category === cat && Array.isArray(p.images) && p.images[0]);
    return (item && item.images[0]) || fallback;
  };

  app.innerHTML = `
    <section class="section">
      <div class="hero">
        <img src="https://images.unsplash.com/photo-1544441893-675973e31985?q=80&w=1600&auto=format&fit=crop" alt="ShopNow Fashion Festival" />
        <div class="caption">Big Fashion Festival • Up to 70% OFF</div>
      </div>
    </section>

    <section class="section">
      <h2>Shop by Category</h2>
      <div class="categories">
        ${categoryTile('Makeup', 'makeup', categoryImg('makeup', 'https://source.unsplash.com/800x600/?makeup'))}
        ${categoryTile('Sunglasses', 'sunglasses', categoryImg('sunglasses', 'https://source.unsplash.com/800x600/?sunglasses'))}
        ${categoryTile('Watches', 'watches', categoryImg('watches', 'https://source.unsplash.com/800x600/?watch'))}
        ${categoryTile('Perfumes', 'perfumes', categoryImg('perfumes', 'https://source.unsplash.com/800x600/?perfume'))}
        ${categoryTile('Shoes', 'shoes', categoryImg('shoes', 'https://source.unsplash.com/800x600/?shoes'))}
        ${categoryTile('Clothes', 'clothes', categoryImg('clothes', 'https://source.unsplash.com/800x600/?clothes'))}
      </div>
    </section>

    <section class="section">
      <h2>Top Deals</h2>
      <div id="row-deals" class="h-scroll"></div>
    </section>
    <section class="section">
      <h2>Trending Now</h2>
      <div id="row-trending" class="h-scroll"></div>
    </section>
    <section class="section">
      <div class="banner">
        <img src="https://images.unsplash.com/photo-1603252109303-2751441dd157?q=80&w=1600&auto=format&fit=crop" alt="Seasonal Sale" />
      </div>
    </section>
    <section class="section">
      <h2>Best Sellers</h2>
      <div id="row-bestsellers" class="h-scroll"></div>
    </section>
    <section class="section">
      <h2>New Arrivals</h2>
      <div id="row-new" class="h-scroll"></div>
    </section>
    <section class="section">
      <h2>Shop by Brand</h2>
      <div class="strip" id="brand-strip"></div>
    </section>
    <section class="section">
      <div class="banner app-only">
        <img src="https://static.vecteezy.com/system/resources/previews/028/197/596/large_2x/big-sale-banner-template-design-special-offer-discount-50-70-off-vector.jpg" alt="App-only offers" />
      </div>
    </section>
    <section class="section" aria-label="SEO content">
      <div class="seo">
        <h3>ShopNow – Online Shopping for Fashion & Lifestyle</h3>
        <p>Discover the latest trends across Men, Women, Kids, Home & Living, and Beauty. Enjoy exclusive deals, top brands, and fast delivery for a delightful shopping experience.</p>
      </div>
    </section>
  `;

  // Populate rows
  mountRow(app.querySelector('#row-deals'), topDeals(all));
  mountRow(app.querySelector('#row-trending'), trendingNow(all));
  mountRow(app.querySelector('#row-bestsellers'), bestSellers(all));
  mountRow(app.querySelector('#row-new'), newArrivals(all));
  mountBrands(app.querySelector('#brand-strip'), all);
}

function categoryTile(label, category, img) {
  const href = category
    ? `pages/products.html?category=${encodeURIComponent(category)}`
    : `pages/products.html`;
  return `
    <a class="category-tile" href="${href}">
      <img src="${img}" alt="${label}" loading="lazy" />
      <span>${label}</span>
    </a>
  `;
}

function mountRow(root, items) {
  root.innerHTML = '';
  items.forEach(p => {
    root.appendChild(productCard(p, {
      onClick: () => window.location.href = `pages/product.html?id=${encodeURIComponent(p.id)}`
    }));
  });
}

function mountBrands(root, all) {
  const brands = Array.from(new Set(all.map(p => p.brand))).slice(0, 12);
  root.innerHTML = brands.map(b => `
    <a class="tile" href="pages/products.html?search=${encodeURIComponent(b)}">
      <img src="${brandImageFromProducts(b, all)}" alt="${b} brand" loading="lazy" />
      <span>${b}</span>
    </a>
  `).join('');
}

function topDeals(all) {
  return all.filter(p => p.discountPercent >= 50).slice(0, 20);
}
function trendingNow(all) {
  return [...all].sort((a,b) => (b.rating||0)-(a.rating||0)).slice(0, 20);
}
function bestSellers(all) {
  return [...all].sort((a,b) => (b.ratingsCount||0)-(a.ratingsCount||0)).slice(0, 20);
}
function newArrivals(all) {
  return shuffle([...all]).slice(0, 20);
}

function shuffle(arr) {
  for (let i = arr.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [arr[i], arr[j]] = [arr[j], arr[i]];
  }
  return arr;
}

function brandImage(b) {
  const map = {
    'Maybelline': 'https://source.unsplash.com/1200x600/?makeup',
    'Lakme': 'https://source.unsplash.com/1200x600/?cosmetics',
    'Ray-Ban': 'https://source.unsplash.com/1200x600/?sunglasses',
    'Oakley': 'https://source.unsplash.com/1200x600/?sport,sunglasses',
    'Casio': 'https://source.unsplash.com/1200x600/?watch,analog',
    'Fossil': 'https://source.unsplash.com/1200x600/?watch,chronograph',
    'Calvin Klein': 'https://source.unsplash.com/1200x600/?perfume',
    'Davidoff': 'https://source.unsplash.com/1200x600/?fragrance',
    'Nike': 'https://source.unsplash.com/1200x600/?shoes',
    'Adidas': 'https://source.unsplash.com/1200x600/?sneakers',
    "Levi's": 'https://source.unsplash.com/1200x600/?jeans',
    'H&M': 'https://source.unsplash.com/1200x600/?clothes'
  };
  return map[b] || 'https://source.unsplash.com/1200x600/?shopping';
}

function brandImageFromProducts(b, all) {
  const p = all.find(it => it.brand === b && Array.isArray(it.images) && it.images[0]);
  return (p && p.images[0]) ? p.images[0] : brandImage(b);
}
