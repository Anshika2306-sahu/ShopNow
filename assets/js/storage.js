const CART_KEY = 'shopnow_cart';
const WISHLIST_KEY = 'shopnow_wishlist';
const USER_KEY = 'shopnow_user';

function read(key, fallback) {
  try {
    const raw = localStorage.getItem(key);
    if (!raw) return fallback;
    return JSON.parse(raw);
  } catch {
    return fallback;
  }
}
function write(key, value) {
  localStorage.setItem(key, JSON.stringify(value));
}

export function getCart() {
  return read(CART_KEY, []);
}
export function setCart(items) {
  write(CART_KEY, items);
}
export function addToCart(item) {
  const cart = getCart();
  const index = cart.findIndex(
    it => it.productId === item.productId && it.size === item.size
  );
  if (index >= 0) {
    cart[index].qty = (cart[index].qty || 1) + (item.qty || 1);
  } else {
    cart.push({ ...item, qty: item.qty || 1 });
  }
  setCart(cart);
  return cart;
}
export function removeFromCart(productId, size) {
  const cart = getCart().filter(it => !(it.productId === productId && it.size === size));
  setCart(cart);
  return cart;
}
export function updateCartQty(productId, size, qty) {
  const cart = getCart();
  const index = cart.findIndex(it => it.productId === productId && it.size === size);
  if (index >= 0) {
    cart[index].qty = Math.max(1, qty);
    setCart(cart);
  }
  return cart;
}

export function getWishlist() {
  return read(WISHLIST_KEY, []);
}
export function setWishlist(items) {
  write(WISHLIST_KEY, items);
}
export function toggleWishlist(productId) {
  const list = getWishlist();
  const has = list.includes(productId);
  const next = has ? list.filter(id => id !== productId) : [...list, productId];
  setWishlist(next);
  return next;
}

export function getUser() {
  return read(USER_KEY, null);
}
export function setUser(user) {
  write(USER_KEY, user);
}
export function logout() {
  localStorage.removeItem(USER_KEY);
}






