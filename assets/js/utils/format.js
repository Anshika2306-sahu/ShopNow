export function formatPrice(value) {
  try {
    return new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR', maximumFractionDigits: 0 }).format(value);
  } catch {
    return `₹${value}`;
  }
}

export function calcDiscountPercent(mrp, price) {
  const pct = Math.round(((mrp - price) / mrp) * 100);
  return isFinite(pct) ? pct : 0;
}






