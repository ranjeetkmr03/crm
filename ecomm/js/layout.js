// Shared header, footer, cart drawer and dialogs, injected on every page.
// Edit store details here once and they update across the whole site.
const STORE = {
  name: "Prakriti",
  suffix: "Ayurveda",
  phone: "+91 98765 43210",
  whatsapp: "919876543210",
  email: "care@prakritiayurveda.in",
  address: "12, Dhanvantari Marg, Rishikesh, Uttarakhand 249201",
  hours: "Mon–Sat, 9:00 AM – 7:00 PM",
};

(() => {
  const page = document.body.dataset.page;
  const nav = [
    ["index.html", "home", "Home"],
    ["shop.html", "shop", "Shop"],
    ["testimonials.html", "testimonials", "Testimonials"],
    ["contact.html", "contact", "Contact"],
  ];
  const navLinks = nav
    .map(([href, id, text]) => `<li><a href="${href}"${id === page ? ' aria-current="page"' : ""}>${text}</a></li>`)
    .join("");
  const logo = (cls = "") =>
    `<a href="index.html" class="logo ${cls}" aria-label="${STORE.name} ${STORE.suffix} home">
      <svg class="logo__mark" viewBox="0 0 32 32" aria-hidden="true"><path d="M16 3c7 6 9 14 0 26C7 17 9 9 16 3Z" fill="currentColor"/><path d="M16 9v18" stroke="#fffaf0" stroke-width="1.6"/></svg>
      <span>${STORE.name}<small>${STORE.suffix}</small></span>
    </a>`;

  document.getElementById("site-header").outerHTML = `
    <a class="skip-link" href="#main">Skip to content</a>
    <div class="announce">Free delivery on orders above ₹499 · First order? Use <strong>AYUR10</strong> for 10% off</div>
    <header class="header">
      <div class="container header__inner">
        <button class="icon-btn menu-btn" id="menuBtn" aria-label="Open menu" aria-expanded="false" aria-controls="mainNav">
          <svg class="icon" aria-hidden="true"><use href="#i-menu"/></svg>
        </button>
        ${logo()}
        <nav class="main-nav" id="mainNav" aria-label="Main"><ul>${navLinks}</ul></nav>
        <div class="header__actions">
          <form class="search" role="search" action="shop.html">
            <label for="headerSearch" class="sr-only">Search products</label>
            <input id="headerSearch" name="q" type="search" placeholder="Search ashwagandha, triphala…" autocomplete="off">
            <button class="search__btn" aria-label="Search"><svg class="icon" aria-hidden="true"><use href="#i-search"/></svg></button>
          </form>
          <button class="icon-btn" id="cartBtn" aria-label="Open cart">
            <svg class="icon" aria-hidden="true"><use href="#i-bag"/></svg>
            <span class="badge" id="cartCount" hidden>0</span>
          </button>
        </div>
      </div>
    </header>`;

  document.getElementById("site-footer").outerHTML = `
    <footer class="footer">
      <div class="container footer__inner">
        <div class="footer__brand">
          ${logo("logo--light")}
          <p>Authentic Ayurvedic formulations made with time-tested recipes and carefully sourced herbs.</p>
          <p class="footer__cert">AYUSH Mfg. Licence No: [add your licence number]</p>
        </div>
        <div>
          <h2>Explore</h2>
          <ul>${navLinks}<li><a href="privacy-policy.html"${page === "privacy" ? ' aria-current="page"' : ""}>Privacy Policy</a></li></ul>
        </div>
        <div>
          <h2>Shop</h2>
          <ul>${CATEGORIES.map((c) => `<li><a href="shop.html?cat=${c.id}">${c.name}</a></li>`).join("")}</ul>
        </div>
        <div>
          <h2>Get in touch</h2>
          <ul class="footer__contact">
            <li><svg class="icon icon--sm" aria-hidden="true"><use href="#i-phone"/></svg><a href="tel:${STORE.phone.replace(/\s/g, "")}">${STORE.phone}</a></li>
            <li><svg class="icon icon--sm" aria-hidden="true"><use href="#i-mail"/></svg><a href="mailto:${STORE.email}">${STORE.email}</a></li>
            <li><svg class="icon icon--sm" aria-hidden="true"><use href="#i-pin"/></svg><span>${STORE.address}</span></li>
          </ul>
        </div>
      </div>
      <div class="container footer__bottom">
        <p>© ${new Date().getFullYear()} ${STORE.name} ${STORE.suffix}. All rights reserved.</p>
        <p class="footer__disclaimer">These products are traditional Ayurvedic formulations and are not intended to diagnose, treat, cure or prevent any disease. Consult a qualified Ayurvedic practitioner or doctor before use, especially if pregnant, nursing or on medication.</p>
      </div>
    </footer>

    <div class="overlay" id="overlay" hidden></div>
    <aside class="drawer" id="cartDrawer" aria-label="Shopping cart" aria-hidden="true" tabindex="-1">
      <div class="drawer__head">
        <h2>Your cart</h2>
        <button class="icon-btn" data-close aria-label="Close cart"><svg class="icon" aria-hidden="true"><use href="#i-x"/></svg></button>
      </div>
      <div class="drawer__body" id="cartItems"></div>
      <div class="drawer__foot" id="cartFoot">
        <form class="coupon" id="couponForm">
          <label for="couponInput" class="sr-only">Coupon code</label>
          <input id="couponInput" placeholder="Coupon code">
          <button class="btn btn--ghost btn--sm" type="submit">Apply</button>
        </form>
        <p class="field-msg" id="couponMsg" aria-live="polite"></p>
        <dl class="totals" id="cartTotals"></dl>
        <button class="btn btn--accent btn--block" id="checkoutBtn">Proceed to checkout</button>
      </div>
    </aside>

    <dialog class="modal" id="productModal" aria-labelledby="pmTitle">
      <button class="icon-btn modal__close" data-close-modal aria-label="Close"><svg class="icon" aria-hidden="true"><use href="#i-x"/></svg></button>
      <div class="pm" id="pmBody"></div>
    </dialog>

    <dialog class="modal modal--narrow" id="checkoutModal" aria-labelledby="coTitle">
      <button class="icon-btn modal__close" data-close-modal aria-label="Close"><svg class="icon" aria-hidden="true"><use href="#i-x"/></svg></button>
      <form id="checkoutForm" novalidate>
        <h2 id="coTitle">Checkout</h2>
        <div class="field"><label for="coName">Full name</label><input id="coName" name="name" autocomplete="name" required><p class="field-msg"></p></div>
        <div class="field"><label for="coPhone">Mobile number</label><input id="coPhone" name="phone" type="tel" inputmode="numeric" autocomplete="tel" placeholder="10-digit number" required><p class="field-msg"></p></div>
        <div class="field"><label for="coAddress">Delivery address</label><textarea id="coAddress" name="address" rows="3" autocomplete="street-address" required></textarea><p class="field-msg"></p></div>
        <div class="field-row">
          <div class="field"><label for="coCity">City</label><input id="coCity" name="city" autocomplete="address-level2" required><p class="field-msg"></p></div>
          <div class="field"><label for="coPin">PIN code</label><input id="coPin" name="pin" inputmode="numeric" autocomplete="postal-code" required><p class="field-msg"></p></div>
        </div>
        <fieldset class="field">
          <legend>Payment</legend>
          <label class="radio"><input type="radio" name="pay" value="cod" checked> Cash on delivery</label>
          <label class="radio"><input type="radio" name="pay" value="upi"> UPI (demo)</label>
        </fieldset>
        <label class="radio radio--consent"><input type="checkbox" name="consent" required> I agree to the <a href="privacy-policy.html" target="_blank">Privacy Policy</a></label>
        <p class="field-msg" id="consentMsg"></p>
        <dl class="totals" id="coTotals"></dl>
        <button class="btn btn--accent btn--block" type="submit">Place order</button>
      </form>
      <div class="success" id="orderSuccess" hidden>
        <svg class="icon icon--xl" aria-hidden="true"><use href="#i-check"/></svg>
        <h2>Order placed!</h2>
        <p id="orderMsg"></p>
        <button class="btn btn--primary" data-close-modal>Continue shopping</button>
      </div>
    </dialog>

    <a class="wa-float" href="https://wa.me/${STORE.whatsapp}" target="_blank" rel="noopener" aria-label="Chat with us on WhatsApp">
      <svg viewBox="0 0 24 24" aria-hidden="true"><path fill="currentColor" d="M12 2a10 10 0 0 0-8.6 15.1L2 22l5-1.3A10 10 0 1 0 12 2Zm0 18.2c-1.6 0-3.1-.4-4.4-1.2l-.3-.2-3 .8.8-2.9-.2-.3A8.2 8.2 0 1 1 12 20.2Zm4.5-6.1c-.2-.1-1.5-.7-1.7-.8-.2-.1-.4-.1-.6.1l-.8 1c-.1.2-.3.2-.5.1a6.7 6.7 0 0 1-3.3-2.9c-.2-.4.3-.4.7-1.2.1-.2 0-.3 0-.4l-.8-1.8c-.2-.5-.4-.4-.6-.4h-.5a1 1 0 0 0-.7.3 3 3 0 0 0-.9 2.2c0 1.3.9 2.5 1 2.7.1.2 1.8 2.8 4.4 3.9 1.6.7 2.3.8 3.1.6.5-.1 1.5-.6 1.7-1.2.2-.6.2-1.1.2-1.2-.1-.1-.3-.2-.5-.3Z"/></svg>
    </a>
    <div class="toast" id="toast" role="status" aria-live="polite"></div>`;

  // Icon sprite (Lucide-style strokes)
  document.body.insertAdjacentHTML(
    "beforeend",
    `<svg width="0" height="0" style="position:absolute" aria-hidden="true"><defs>
      <symbol id="i-search" viewBox="0 0 24 24"><circle cx="11" cy="11" r="7"/><path d="m20 20-3.5-3.5"/></symbol>
      <symbol id="i-bag" viewBox="0 0 24 24"><path d="M6 2 3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4Z"/><path d="M3 6h18"/><path d="M16 10a4 4 0 0 1-8 0"/></symbol>
      <symbol id="i-menu" viewBox="0 0 24 24"><path d="M4 6h16M4 12h16M4 18h16"/></symbol>
      <symbol id="i-x" viewBox="0 0 24 24"><path d="M18 6 6 18M6 6l12 12"/></symbol>
      <symbol id="i-star" viewBox="0 0 24 24"><path d="m12 2 3.1 6.3 6.9 1-5 4.9 1.2 6.8L12 17.8 5.8 21l1.2-6.8-5-4.9 6.9-1Z"/></symbol>
      <symbol id="i-plus" viewBox="0 0 24 24"><path d="M12 5v14M5 12h14"/></symbol>
      <symbol id="i-minus" viewBox="0 0 24 24"><path d="M5 12h14"/></symbol>
      <symbol id="i-trash" viewBox="0 0 24 24"><path d="M3 6h18"/><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6"/><path d="M8 6V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"/></symbol>
      <symbol id="i-check" viewBox="0 0 24 24"><circle cx="12" cy="12" r="10"/><path d="m8 12 3 3 5-6"/></symbol>
      <symbol id="i-leaf" viewBox="0 0 24 24"><path d="M11 20A7 7 0 0 1 9.8 6.1C15.5 5 17 4.5 19 2c1 2 2 4.2 2 8 0 5.5-4.8 10-10 10Z"/><path d="M2 21c0-3 1.9-5.4 5.2-6.1 2.5-.5 4.5-2 5.8-3.9"/></symbol>
      <symbol id="i-shield" viewBox="0 0 24 24"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10Z"/><path d="m9 12 2 2 4-4"/></symbol>
      <symbol id="i-truck" viewBox="0 0 24 24"><path d="M14 18V6H2v12h2"/><path d="M14 9h4l4 4v5h-2"/><circle cx="7" cy="18" r="2"/><circle cx="17" cy="18" r="2"/><path d="M9 18h6"/></symbol>
      <symbol id="i-flask" viewBox="0 0 24 24"><path d="M9 3h6M10 3v6L4.5 18.5A2 2 0 0 0 6.2 21h11.6a2 2 0 0 0 1.7-2.5L14 9V3"/><path d="M7 15h10"/></symbol>
      <symbol id="i-user" viewBox="0 0 24 24"><circle cx="12" cy="8" r="4"/><path d="M4 21a8 8 0 0 1 16 0"/></symbol>
      <symbol id="i-phone" viewBox="0 0 24 24"><path d="M22 16.9v3a2 2 0 0 1-2.2 2 19.8 19.8 0 0 1-8.6-3.1 19.5 19.5 0 0 1-6-6A19.8 19.8 0 0 1 2.1 4.2 2 2 0 0 1 4.1 2h3a2 2 0 0 1 2 1.7c.1.9.4 1.8.7 2.7a2 2 0 0 1-.5 2.1L8 9.8a16 16 0 0 0 6 6l1.3-1.3a2 2 0 0 1 2.1-.4c.9.3 1.8.6 2.7.7a2 2 0 0 1 1.7 2Z"/></symbol>
      <symbol id="i-mail" viewBox="0 0 24 24"><rect x="2" y="4" width="20" height="16" rx="2"/><path d="m22 7-10 6L2 7"/></symbol>
      <symbol id="i-pin" viewBox="0 0 24 24"><path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z"/><circle cx="12" cy="10" r="3"/></symbol>
      <symbol id="i-clock" viewBox="0 0 24 24"><circle cx="12" cy="12" r="10"/><path d="M12 6v6l4 2"/></symbol>
      <symbol id="i-quote" viewBox="0 0 24 24"><path d="M3 21c3 0 7-1 7-8V5H3v8h4c0 4-2 5-4 5Zm11 0c3 0 7-1 7-8V5h-7v8h4c0 4-2 5-4 5Z"/></symbol>
    </defs></svg>`
  );
})();
