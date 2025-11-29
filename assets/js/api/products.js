import { calcDiscountPercent } from '../utils/format.js';

let cache;

const IMAGE_POOLS = {
  tshirts: [
    'https://images.unsplash.com/photo-1520975916090-3105956dac38?q=80&w=800&auto=format&fit=crop',
    'https://images.unsplash.com/photo-1540574163026-643ea20ade25?q=80&w=800&auto=format&fit=crop',
    'https://images.unsplash.com/photo-1503341455253-b2e723bb3dbb?q=80&w=800&auto=format&fit=crop'
  ],
  shirts: [
    'https://images.unsplash.com/photo-1541099649105-f69ad21f3246?q=80&w=800&auto=format&fit=crop',
    'https://images.unsplash.com/photo-1520974735194-8762f26e26b0?q=80&w=800&auto=format&fit=crop'
  ],
  jeans: [
    'https://images.unsplash.com/photo-1490481651871-ab68de25d43d?q=80&w=800&auto=format&fit=crop',
    'https://images.unsplash.com/photo-1490481651871-ab68de25d43d?q=80&w=800&auto=format&fit=crop'
  ],
  trousers: [
    'https://images.unsplash.com/photo-1490111718993-d98654ce6cf7?q=80&w=800&auto=format&fit=crop'
  ],
  jackets: [
    'https://images.unsplash.com/photo-1548883354-94bcfe321c90?q=80&w=800&auto=format&fit=crop',
    'https://images.unsplash.com/photo-1544025162-d76694265947?q=80&w=800&auto=format&fit=crop'
  ],
  trackpants: [
    'https://images.unsplash.com/photo-1591195853828-11db59a44f6b?q=80&w=800&auto=format&fit=crop'
  ],
  shoes: [
    'https://images.unsplash.com/photo-1600180758890-6b94519a8ba6?q=80&w=800&auto=format&fit=crop',
    'https://images.unsplash.com/photo-1595950653106-6c9ebd614d3a?q=80&w=800&auto=format&fit=crop',
    'https://images.unsplash.com/photo-1571907480495-3a83bde2cf52?q=80&w=800&auto=format&fit=crop'
  ],
  makeup: [
    'https://images.unsplash.com/photo-1580136579312-94651dfd596d?q=80&w=800&auto=format&fit=crop'
  ],
  sunglasses: [
    'https://source.unsplash.com/800x1067/?sunglasses',
    'https://source.unsplash.com/800x1067/?sunglasses,men',
    'https://source.unsplash.com/800x1067/?sunglasses,women'
  ],
  watches: [
    'https://source.unsplash.com/800x1067/?watch,analog',
    'https://source.unsplash.com/800x1067/?watch,chronograph',
    'https://source.unsplash.com/800x1067/?smartwatch'
  ],
  perfumes: [
    'https://source.unsplash.com/800x1067/?perfume,bottle',
    'https://source.unsplash.com/800x1067/?fragrance,bottle'
  ],
  clothes: [
    'https://source.unsplash.com/800x1067/?tshirt',
    'https://source.unsplash.com/800x1067/?shirt',
    'https://source.unsplash.com/800x1067/?jeans'
  ]
};

// Override specific brand + subItem image URLs as provided
const OVERRIDE_IMAGES = {
  'Adidas': {
    sneakers: 'https://extrabutterny.in/cdn/shop/files/IG1024-1.jpg?v=1699649962&width=1600'
  },
  'Maybelline': {
    lipstick: 'https://m.media-amazon.com/images/I/51UCpJEnBbL._SX569_.jpg',
    kajal: 'https://m.media-amazon.com/images/I/51GFMXKWyPL._SX569_.jpg',
    makeup: 'https://m.media-amazon.com/images/I/615aXeTo4AL._SX569_.jpg'
  },
  'Lakme': {
    foundation: 'https://images-static.nykaa.com/media/catalog/product/0/0/0060d708901030654886-new_9.jpg?tr=w-500'
  },
  'Ray-Ban': {
    aviator: 'https://cdn-images.farfetch-contents.com/23/79/06/50/23790650_53856160_1000.jpg',
    sport: 'https://www.thesunglassfashion.com/cdn/shop/products/ray-ban-active-sport-sunglasses-black-gloss-frame-green-lens-rb4188-60171-thesunglassfashion_158.jpg?v=1557277745&width=1206'
  },
  'Oakley': {
    wayfarer: 'https://optorium.in/cdn/shop/files/OakleySunglassOO94170459Image05.jpg?v=1752756183&width=1200'
  },
  'Calvin Klein': {
    edt: 'https://www.aarfragrances.com/public/uploads/all/6dnw8NiB2hZ3PXVDSmoSXH7p1EpnP0Tt026eCec7.jpg',
    spray: 'https://m.media-amazon.com/images/I/51wX7vWU5AL._SX522_.jpg'
  },
  'Casio': {
    analog: 'https://cdn.shopify.com/s/files/1/0261/8900/4880/files/Casio_Mobile_Banner.webp?v=1759907610',
    smartwatch: 'https://gshock.casio.com/content/casio/locales/us/en/brands/gshock/products/gshock-move/_jcr_content/root/responsivegrid/container_107153019/container_749550155__1025000528/content_panel_202104/image.casiocoreimg.jpeg/1758909014686/gmovestravadw-h5600-800x800.jpeg'
  },
  'Fossil': {
    chronograph: 'https://www.buyon.in/wp-content/uploads/2024/09/Fossil-Chronograph-Mens-Watch-1.jpg'
  },
  'H&M': {
    shirts: 'https://image.hm.com/assets/hm/fb/cb/fbcbae31ae309f5e56e006b22a1315e618a06c32.jpg?imwidth=1260'
  },
  "Levi's": {
    tshirts: 'https://m.media-amazon.com/images/I/51ix-pGbi7L._SX679_.jpg',
    jeans: 'https://levi.in/cdn/shop/files/86e30ceaf4f4d239e3f2437905a47da5.jpg?v=1747222484'
  },
  'Davidoff': {
    edp: 'https://m.media-amazon.com/images/I/91uaXZV2CrL._SL1500_.jpg'
  },
  'Nike': {
    running: 'https://static.nike.com/a/images/t_web_pdp_936_v2/f_auto/7d3215e5-f431-4b02-8875-a069ca8acc87/NIKE+RUN+SWIFT+3.png',
    training: 'https://static.nike.com/a/images/t_web_pdp_936_v2/f_auto/5f3cde64-61cf-4afa-a3ae-478e58d16db5/NIKE+FREE+2025.png'
  }
};

function buildCuratedCatalog() {
  const defs = [
    { category: 'makeup',     brands: ['Maybelline','Lakme'],       subItems: ['lipstick','foundation','kajal'] },
    { category: 'sunglasses', brands: ['Ray-Ban','Oakley'],         subItems: ['aviator','wayfarer','sport'] },
    { category: 'watches',    brands: ['Casio','Fossil'],           subItems: ['analog','chronograph','smartwatch'] },
    { category: 'perfumes',   brands: ['Calvin Klein','Davidoff'],  subItems: ['edt','edp','spray'] },
    { category: 'shoes',      brands: ['Nike','Adidas'],            subItems: ['running','sneakers','training'] },
    { category: 'clothes',    brands: ['Levi\'s','H&M'],            subItems: ['tshirts','shirts','jeans'] }
  ];
  const rand = (min, max) => Math.floor(Math.random() * (max - min + 1)) + min;
  const list = [];
  let seq = 1;
  for (const d of defs) {
    for (let i = 0; i < d.subItems.length; i++) {
      const sub = d.subItems[i];
      const brand = d.brands[i % d.brands.length];
      const mrp = rand(799, 4999);
      const price = Math.max(299, mrp - rand(200, Math.floor(mrp * 0.6)));
      const discountPercent = calcDiscountPercent(mrp, price);
      const rating = +(Math.random() * 1.2 + 3.7).toFixed(1);
      const ratingsCount = rand(50, 2500);
      const title = titleFor(sub);
      const sizes = sizesFor(sub);
      const color = colorFor(sub);
      const override = (OVERRIDE_IMAGES[brand] && OVERRIDE_IMAGES[brand][sub]) || null;
      const images = override ? [override, override, override, override] : pickImages(mapPoolKey(d.category, sub));
      list.push({
        id: `SN-${d.category.substring(0,2).toUpperCase()}-${seq.toString().padStart(3,'0')}`,
        title,
        brand,
        category: d.category,
        subCategory: sub,
        images,
        price,
        mrp,
        discountPercent,
        rating,
        ratingsCount,
        sizes,
        color,
        tags: [d.category, sub, brand]
      });
      seq++;
    }
  }
  return list;
}

function titleFor(sub) {
  const map = {
    tshirts: 'Cotton Regular Fit T-shirt',
    shirts: 'Slim Fit Casual Shirt',
    jeans: 'Mid-Rise Stretch Jeans',
    shoes: 'Casual Sneakers',
    lipstick: 'Matte Lipstick',
    foundation: 'Liquid Foundation',
    kajal: 'Kajal Eyeliner',
    aviator: 'Aviator Sunglasses',
    wayfarer: 'Wayfarer Sunglasses',
    sport: 'Sport Sunglasses',
    analog: 'Analog Watch',
    chronograph: 'Chronograph Watch',
    smartwatch: 'Smartwatch',
    edt: 'Eau de Toilette',
    edp: 'Eau de Parfum',
    spray: 'Deodorant Spray'
  };
  return map[sub] || 'Product';
}

function sizesFor(sub) {
  const map = {
    tshirts: ['S','M','L','XL'],
    shirts: ['S','M','L','XL'],
    jeans: ['28','30','32','34'],
    shoes: ['7','8','9','10']
  };
  return map[sub] || [];
}

function colorFor(sub) {
  const map = {
    tshirts: 'Black',
    shirts: 'Blue',
    jeans: 'Indigo',
    shoes: 'White',
    lipstick: 'Red',
    foundation: 'Beige',
    kajal: 'Black',
    aviator: 'Gold',
    wayfarer: 'Black',
    sport: 'Black',
    analog: 'Brown',
    chronograph: 'Silver',
    smartwatch: 'Black',
    edt: 'N/A',
    edp: 'N/A',
    spray: 'N/A'
  };
  return map[sub] || 'Assorted';
}

function mapPoolKey(category, sub) {
  if (category === 'makeup') return 'makeup';
  if (category === 'sunglasses') return 'sunglasses';
  if (category === 'watches') return 'watches';
  if (category === 'perfumes') return 'perfumes';
  if (category === 'shoes') return 'shoes';
  if (category === 'clothes') {
    if (['tshirts','shirts','jeans'].includes(sub)) return 'clothes';
    return 'clothes';
  }
  return 'clothes';
}

function pickImages(poolKey) {
  const pool = IMAGE_POOLS[poolKey] || IMAGE_POOLS['clothes'];
  const pick = (arr) => arr[Math.floor(Math.random() * arr.length)];
  const i1 = pick(pool);
  const i2 = pick(pool);
  const i3 = pick(pool);
  const i4 = pick(pool);
  return [i1, i2, i3, i4];
}

export async function fetchProducts() {
  if (cache) return cache;
  // Force curated catalog per requirements
  cache = buildCuratedCatalog();
  return cache;
}

export async function getProductById(id) {
  const list = await fetchProducts();
  return list.find(p => p.id === id);
}

export async function getBrands() {
  const list = await fetchProducts();
  return Array.from(new Set(list.map(p => p.brand))).sort();
}

export async function getCategories() {
  const list = await fetchProducts();
  return Array.from(new Set(list.map(p => p.category))).sort();
}


