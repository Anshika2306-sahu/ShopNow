export function paginate(items, page = 1, perPage = 24) {
  const total = items.length;
  const pages = Math.max(1, Math.ceil(total / perPage));
  const current = Math.min(Math.max(1, page), pages);
  const start = (current - 1) * perPage;
  const end = start + perPage;
  return {
    items: items.slice(start, end),
    total,
    page: current,
    pages,
    perPage
  };
}

export function paginationControls(meta, onPage) {
  const nav = document.createElement('div');
  nav.style.display = 'flex';
  nav.style.alignItems = 'center';
  nav.style.justifyContent = 'center';
  nav.style.gap = '8px';
  nav.style.margin = '16px 0';
  const prev = document.createElement('button');
  prev.className = 'btn btn-outline';
  prev.textContent = 'Previous';
  prev.disabled = meta.page <= 1;
  prev.addEventListener('click', () => onPage(meta.page - 1));
  const next = document.createElement('button');
  next.className = 'btn btn-outline';
  next.textContent = 'Next';
  next.disabled = meta.page >= meta.pages;
  next.addEventListener('click', () => onPage(meta.page + 1));
  const info = document.createElement('span');
  info.textContent = `Page ${meta.page} of ${meta.pages}`;
  nav.append(prev, info, next);
  return nav;
}






