export function renderFooter(root) {
  const footer = document.createElement('footer');
  footer.className = 'footer';
  footer.innerHTML = `
    <div class="container footer-inner">
      <div>
        <strong>ShopNow</strong>
        <div><a href="#">About</a></div>
        <div><a href="#">Careers</a></div>
        <div><a href="#">Contact</a></div>
      </div>
      <div>
        <strong>Help</strong>
        <div><a href="#">Track Orders</a></div>
        <div><a href="#">Shipping</a></div>
        <div><a href="#">Returns</a></div>
      </div>
      <div>
        <strong>Policy</strong>
        <div><a href="#">Terms of Use</a></div>
        <div><a href="#">Privacy</a></div>
        <div><a href="#">Cookies</a></div>
      </div>
      <div>
        <strong>Social</strong>
        <div><a href="#">Instagram</a></div>
        <div><a href="#">Twitter</a></div>
        <div><a href="#">Facebook</a></div>
        <div class="badges" style="margin-top:8px;">
          <span class="chip">100% Secure Payments</span>
          <span class="chip">Original Brands</span>
        </div>
      </div>
    </div>
    <div class="container"><small>© ${new Date().getFullYear()} ShopNow.com</small></div>
  `;
  root.innerHTML = '';
  root.appendChild(footer);
}


