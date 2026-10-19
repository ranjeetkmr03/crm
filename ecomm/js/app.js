(() => {
  const $ = (s, el = document) => el.querySelector(s);
  const $$ = (s, el = document) => [...el.querySelectorAll(s)];
  const inr = (n) => "₹" + n.toLocaleString("en-IN");
  const byId = (id) => PRODUCTS.find((p) => p.id === id);

  const COUPONS = { AYUR10: { type: "pct", value: 10 }, WELLNESS100: { type: "flat", value: 100, min: 999 } };
  const FREE_SHIP_MIN = 499;
  const SHIPPING = 49;

  // ---------- persisted state ----------
  const store = {
    get(key, fallback) {
      try { return JSON.parse(localStorage.getItem(key)) ?? fallback; } catch { return fallback; }
    },
    set(key, val) {
      try { localStorage.setItem(key, JSON.stringify(val)); } catch { /* storage unavailable */ }
    },
  };

  const params = new URLSearchParams(location.search);
  const state = {
    cart: store.get("prakriti.cart", []).filter((i) => byId(i.id)), // [{id, qty}]
    coupon: store.get("prakriti.coupon", null),
    filter: CATEGORIES.some((c) => c.id === params.get("cat")) ? params.get("cat") : "all",
    query: params.get("q") || "",
    sort: "featured",
  };

  const save = () => {
    store.set("prakriti.cart", state.cart);
    store.set("prakriti.coupon", state.coupon);
  };

  // ---------- totals ----------
  function totals() {
    const subtotal = state.cart.reduce((s, i) => s + byId(i.id).price * i.qty, 0);
    let discount = 0;
    const c = state.coupon && COUPONS[state.coupon];
    if (c && subtotal >= (c.min || 0)) discount = c.type === "pct" ? Math.round((subtotal * c.value) / 100) : c.value;
    const shipping = subtotal === 0 || subtotal - discount >= FREE_SHIP_MIN ? 0 : SHIPPING;
    return { subtotal, discount, shipping, total: subtotal - discount + shipping };
  }

  function totalsHTML() {
    const t = totals();
    return `
      <div><dt>Subtotal</dt><dd>${inr(t.subtotal)}</dd></div>
      ${t.discount ? `<div class="totals__discount"><dt>Discount (${state.coupon})</dt><dd>−${inr(t.discount)}</dd></div>` : ""}
      <div><dt>Shipping</dt><dd>${t.shipping ? inr(t.shipping) : "Free"}</dd></div>
      <div class="totals__grand"><dt>Total</dt><dd>${inr(t.total)}</dd></div>`;
  }

  // ---------- shared bits ----------
  const stars = (r) =>
    `<span class="stars" aria-label="Rated ${r} out of 5"><svg class="icon icon--sm" aria-hidden="true"><use href="#i-star"/></svg>${r}</span>`;
  const starRow = (n) =>
    `<span class="star-row" aria-label="${n} out of 5 stars">${Array.from({ length: 5 }, (_, i) =>
      `<svg class="icon icon--sm ${i < n ? "is-on" : ""}" aria-hidden="true"><use href="#i-star"/></svg>`).join("")}</span>`;
  const off = (p) => Math.round(((p.mrp - p.price) / p.mrp) * 100);

  function productCard(p) {
    return `<article class="card">
      <button class="card__media" data-view="${p.id}" aria-label="View ${p.name}">
        ${productArt(p)}
        ${p.tag ? `<span class="tag">${p.tag}</span>` : ""}
      </button>
      <div class="card__body">
        <p class="card__cat">${CATEGORIES.find((c) => c.id === p.cat).name}</p>
        <h3 class="card__title"><button data-view="${p.id}">${p.name}</button></h3>
        <p class="muted small">${p.size}</p>
        <p>${stars(p.rating)} <span class="muted small">(${p.reviews.toLocaleString("en-IN")})</span></p>
        <div class="price"><strong>${inr(p.price)}</strong><s>${inr(p.mrp)}</s><span class="off">${off(p)}% off</span></div>
        <button class="btn btn--primary btn--block btn--sm" data-add="${p.id}">Add to cart</button>
      </div>
    </article>`;
  }

  function testimonialCard(t) {
    const p = byId(t.product);
    return `<figure class="review">
      <svg class="icon review__quote" aria-hidden="true"><use href="#i-quote"/></svg>
      ${starRow(t.rating)}
      <blockquote><p>${t.text}</p></blockquote>
      <figcaption>
        <span class="avatar" aria-hidden="true">${t.name.split(" ").map((w) => w[0]).join("").slice(0, 2)}</span>
        <span><strong>${t.name}</strong><span class="muted small">${t.city} · bought <button class="link" data-view="${p.id}">${p.name}</button></span></span>
      </figcaption>
    </figure>`;
  }

  // ---------- page sections (rendered only if present) ----------
  function renderHome() {
    const cats = $("#catGrid");
    if (cats) {
      cats.innerHTML = CATEGORIES.map((c) => {
        const sample = PRODUCTS.find((p) => p.cat === c.id);
        const count = PRODUCTS.filter((p) => p.cat === c.id).length;
        return `<a class="cat" href="shop.html?cat=${c.id}">
          ${productArt(sample)}
          <span class="cat__name">${c.name}</span>
          <span class="cat__count">${count} products</span>
        </a>`;
      }).join("");
    }
    const featured = $("#featuredGrid");
    if (featured) featured.innerHTML = PRODUCTS.filter((p) => p.tag).slice(0, 4).map(productCard).join("");
    const hero = $("#heroArt");
    if (hero) hero.innerHTML = [3, 1, 14].map((id) => productArt(byId(id))).join("");
    const homeReviews = $("#homeReviews");
    if (homeReviews) homeReviews.innerHTML = TESTIMONIALS.slice(0, 3).map(testimonialCard).join("");
  }

  function renderTestimonialsPage() {
    const grid = $("#reviewGrid");
    if (!grid) return;
    grid.innerHTML = TESTIMONIALS.map(testimonialCard).join("");
    const avg = TESTIMONIALS.reduce((s, t) => s + t.rating, 0) / TESTIMONIALS.length;
    $("#avgRating").textContent = avg.toFixed(1);
    $("#avgStars").innerHTML = starRow(Math.round(avg));
    $("#reviewCount").textContent = `Based on ${TESTIMONIALS.length} reviews`;
    $("#ratingBars").innerHTML = [5, 4, 3, 2, 1]
      .map((n) => {
        const count = TESTIMONIALS.filter((t) => t.rating === n).length;
        const pct = Math.round((count / TESTIMONIALS.length) * 100);
        return `<div class="bar"><span>${n} star</span><span class="bar__track"><span style="width:${pct}%"></span></span><span>${count}</span></div>`;
      })
      .join("");
  }

  function visibleProducts() {
    const q = state.query.trim().toLowerCase();
    let list = PRODUCTS.filter(
      (p) =>
        (state.filter === "all" || p.cat === state.filter) &&
        (!q || [p.name, p.desc, p.ingredients, p.cat].some((s) => s.toLowerCase().includes(q)))
    );
    const sorters = {
      "price-asc": (a, b) => a.price - b.price,
      "price-desc": (a, b) => b.price - a.price,
      rating: (a, b) => b.rating - a.rating,
    };
    if (sorters[state.sort]) list = [...list].sort(sorters[state.sort]);
    return list;
  }

  function renderShop() {
    const grid = $("#productGrid");
    if (!grid) return;
    const list = visibleProducts();
    grid.innerHTML = list.map(productCard).join("");
    $("#emptyState").hidden = list.length > 0;
    $("#resultInfo").textContent = `${list.length} product${list.length === 1 ? "" : "s"}${state.query ? ` for “${state.query}”` : ""}`;
    $$("#filterChips .chip").forEach((b) => b.setAttribute("aria-pressed", b.dataset.filter === state.filter));
    const url = new URL(location.href);
    url.search = "";
    if (state.filter !== "all") url.searchParams.set("cat", state.filter);
    if (state.query) url.searchParams.set("q", state.query);
    try { history.replaceState(null, "", url); } catch { /* file:// in some browsers */ }
  }

  function initShop() {
    if (!$("#productGrid")) return;
    $("#filterChips").innerHTML = [{ id: "all", name: "All" }, ...CATEGORIES]
      .map((c) => `<button class="chip" data-filter="${c.id}">${c.name}</button>`)
      .join("");
    const search = $("#shopSearch");
    search.value = state.query;
    search.addEventListener("input", () => { state.query = search.value; renderShop(); });
    $("#sortSelect").addEventListener("change", (e) => { state.sort = e.target.value; renderShop(); });
    $("#clearSearch").addEventListener("click", () => { state.query = ""; state.filter = "all"; search.value = ""; renderShop(); });
    renderShop();
  }

  // ---------- cart ----------
  function renderBadge() {
    const n = state.cart.reduce((s, i) => s + i.qty, 0);
    const cc = $("#cartCount");
    cc.textContent = n;
    cc.hidden = n === 0;
    $("#cartBtn").setAttribute("aria-label", `Open cart, ${n} item${n === 1 ? "" : "s"}`);
  }

  function renderCart() {
    const body = $("#cartItems");
    if (!state.cart.length) {
      body.innerHTML = `<div class="empty"><svg class="icon icon--xl" aria-hidden="true"><use href="#i-bag"/></svg><p>Your cart is empty.</p><a class="btn btn--ghost" href="shop.html">Browse remedies</a></div>`;
      $("#cartFoot").hidden = true;
      return;
    }
    $("#cartFoot").hidden = false;
    body.innerHTML = state.cart
      .map(({ id, qty }) => {
        const p = byId(id);
        return `<div class="line">
          ${productArt(p, "line__art")}
          <div class="line__info">
            <p class="line__name">${p.name}</p>
            <p class="muted small">${p.size} · ${inr(p.price)}</p>
            <div class="qty" role="group" aria-label="Quantity for ${p.name}">
              <button class="icon-btn icon-btn--sm" data-dec="${id}" aria-label="Decrease quantity"><svg class="icon icon--sm" aria-hidden="true"><use href="#i-minus"/></svg></button>
              <span aria-live="polite">${qty}</span>
              <button class="icon-btn icon-btn--sm" data-inc="${id}" aria-label="Increase quantity"><svg class="icon icon--sm" aria-hidden="true"><use href="#i-plus"/></svg></button>
            </div>
          </div>
          <div class="line__end">
            <strong>${inr(p.price * qty)}</strong>
            <button class="icon-btn icon-btn--sm" data-remove="${id}" aria-label="Remove ${p.name}"><svg class="icon icon--sm" aria-hidden="true"><use href="#i-trash"/></svg></button>
          </div>
        </div>`;
      })
      .join("");
    const t = totals();
    const left = FREE_SHIP_MIN - (t.subtotal - t.discount);
    if (left > 0) body.insertAdjacentHTML("afterbegin", `<p class="ship-note">Add ${inr(left)} more for free delivery</p>`);
    $("#cartTotals").innerHTML = totalsHTML();
    $("#couponInput").value = state.coupon || "";
  }

  const refresh = () => { renderBadge(); renderCart(); save(); };

  let toastTimer;
  function toast(msg) {
    const t = $("#toast");
    t.textContent = msg;
    t.classList.add("is-on");
    clearTimeout(toastTimer);
    toastTimer = setTimeout(() => t.classList.remove("is-on"), 2200);
  }

  function addToCart(id, qty = 1) {
    const line = state.cart.find((i) => i.id === id);
    if (line) line.qty = Math.min(10, line.qty + qty);
    else state.cart.push({ id, qty });
    refresh();
    toast(`Added “${byId(id).name}” to cart`);
  }

  function changeQty(id, delta) {
    const line = state.cart.find((i) => i.id === id);
    if (!line) return;
    line.qty = Math.min(10, line.qty + delta);
    if (line.qty <= 0) state.cart = state.cart.filter((i) => i.id !== id);
    refresh();
  }

  // ---------- drawer ----------
  let lastFocus = null;
  function openDrawer() {
    lastFocus = document.activeElement;
    const el = $("#cartDrawer");
    el.classList.add("is-open");
    el.setAttribute("aria-hidden", "false");
    $("#overlay").hidden = false;
    document.body.classList.add("no-scroll");
    el.focus();
  }
  function closeDrawer(restore = true) {
    const el = $("#cartDrawer");
    if (!el.classList.contains("is-open")) return;
    el.classList.remove("is-open");
    el.setAttribute("aria-hidden", "true");
    $("#overlay").hidden = true;
    document.body.classList.remove("no-scroll");
    if (restore && lastFocus) lastFocus.focus();
  }

  // ---------- product modal ----------
  function openProduct(id) {
    const p = byId(id);
    const cat = CATEGORIES.find((c) => c.id === p.cat).name;
    $("#pmBody").innerHTML = `
      <div class="pm__media">${productArt(p)}</div>
      <div class="pm__info">
        <p class="eyebrow">${cat}</p>
        <h2 id="pmTitle">${p.name}</h2>
        <p>${stars(p.rating)} <span class="muted small">${p.reviews.toLocaleString("en-IN")} reviews · ${p.size}</span></p>
        <div class="price price--lg"><strong>${inr(p.price)}</strong><s>${inr(p.mrp)}</s><span class="off">${off(p)}% off</span></div>
        <p class="muted small">MRP inclusive of all taxes</p>
        <p>${p.desc}</p>
        <details open><summary>Key ingredients</summary><p>${p.ingredients}</p></details>
        <details><summary>How to use</summary><p>${p.usage}</p></details>
        <div class="pm__buy">
          <div class="qty" role="group" aria-label="Quantity">
            <button class="icon-btn icon-btn--sm" id="pmDec" aria-label="Decrease quantity"><svg class="icon icon--sm" aria-hidden="true"><use href="#i-minus"/></svg></button>
            <span id="pmQty" aria-live="polite">1</span>
            <button class="icon-btn icon-btn--sm" id="pmInc" aria-label="Increase quantity"><svg class="icon icon--sm" aria-hidden="true"><use href="#i-plus"/></svg></button>
          </div>
          <button class="btn btn--accent" id="pmAdd">Add to cart</button>
        </div>
        <p class="pm__note">Consult your vaidya or doctor before use if pregnant, nursing or on medication.</p>
      </div>`;
    let qty = 1;
    const q = $("#pmQty");
    $("#pmDec").onclick = () => (q.textContent = qty = Math.max(1, qty - 1));
    $("#pmInc").onclick = () => (q.textContent = qty = Math.min(10, qty + 1));
    $("#pmAdd").onclick = () => { addToCart(id, qty); $("#productModal").close(); };
    $("#productModal").showModal();
  }

  // ---------- form validation (checkout + contact) ----------
  const validators = {
    name: (v) => (v.trim().length >= 2 ? "" : "Please enter your full name."),
    phone: (v) => (/^[6-9]\d{9}$/.test(v.replace(/\D/g, "").slice(-10)) && v.replace(/\D/g, "").length >= 10 ? "" : "Enter a valid 10-digit mobile number."),
    email: (v) => (/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v.trim()) ? "" : "Enter a valid email address."),
    address: (v) => (v.trim().length >= 10 ? "" : "Please enter your complete address."),
    city: (v) => (v.trim() ? "" : "City is required."),
    pin: (v) => (/^[1-9]\d{5}$/.test(v.trim()) ? "" : "Enter a valid 6-digit PIN code."),
    subject: (v) => (v ? "" : "Please choose a topic."),
    message: (v) => (v.trim().length >= 10 ? "" : "Please write at least 10 characters."),
  };

  function validateField(input) {
    const fn = validators[input.name];
    if (!fn) return true;
    const msg = fn(input.value);
    const box = input.closest(".field").querySelector(".field-msg");
    box.textContent = msg;
    input.setAttribute("aria-invalid", msg ? "true" : "false");
    return !msg;
  }

  function validateForm(form) {
    const fields = $$("input[name]:not([type=radio]):not([type=checkbox]), textarea[name], select[name]", form);
    const results = fields.map(validateField);
    const firstBad = fields[results.indexOf(false)];
    if (firstBad) firstBad.focus();
    return !firstBad;
  }

  function wireValidation(form) {
    form.addEventListener("focusout", (e) => { if (e.target.name) validateField(e.target); });
  }

  function openCheckout() {
    if (!state.cart.length) return;
    closeDrawer(false);
    $("#checkoutForm").hidden = false;
    $("#orderSuccess").hidden = true;
    $("#coTotals").innerHTML = totalsHTML();
    $("#checkoutModal").showModal();
  }

  // ---------- events ----------
  document.addEventListener("click", (e) => {
    const t = e.target.closest("button, a");
    if (!t) return;
    const d = t.dataset;
    if (d.add) addToCart(+d.add);
    else if (d.view) openProduct(+d.view);
    else if (d.inc) changeQty(+d.inc, 1);
    else if (d.dec) changeQty(+d.dec, -1);
    else if (d.remove) changeQty(+d.remove, -Infinity);
    else if (d.filter) { state.filter = d.filter; renderShop(); }
    else if ("close" in d) closeDrawer();
    else if ("closeModal" in d) t.closest("dialog").close();
  });

  $("#cartBtn").addEventListener("click", openDrawer);
  $("#overlay").addEventListener("click", () => closeDrawer());
  document.addEventListener("keydown", (e) => {
    if (e.key !== "Escape") return;
    closeDrawer();
    toggleMenu(false);
  });
  $$("dialog").forEach((dlg) => dlg.addEventListener("click", (e) => { if (e.target === dlg) dlg.close(); }));

  // mobile menu
  const menuBtn = $("#menuBtn");
  function toggleMenu(open = menuBtn.getAttribute("aria-expanded") !== "true") {
    menuBtn.setAttribute("aria-expanded", open);
    menuBtn.setAttribute("aria-label", open ? "Close menu" : "Open menu");
    $("#mainNav").classList.toggle("is-open", open);
  }
  menuBtn.addEventListener("click", () => toggleMenu());

  $("#couponForm").addEventListener("submit", (e) => {
    e.preventDefault();
    const code = $("#couponInput").value.trim().toUpperCase();
    const msg = $("#couponMsg");
    const c = COUPONS[code];
    msg.className = "field-msg";
    if (!code) { state.coupon = null; msg.textContent = ""; }
    else if (!c) { msg.textContent = "That code isn't valid."; return; }
    else if (totals().subtotal < (c.min || 0)) { msg.textContent = `${code} needs a minimum order of ${inr(c.min)}.`; return; }
    else { state.coupon = code; msg.textContent = `${code} applied!`; msg.className = "field-msg field-msg--ok"; }
    refresh();
  });

  $("#checkoutBtn").addEventListener("click", openCheckout);

  const coForm = $("#checkoutForm");
  wireValidation(coForm);
  coForm.addEventListener("submit", (e) => {
    e.preventDefault();
    if (!validateForm(coForm)) return;
    if (!coForm.consent.checked) { $("#consentMsg").textContent = "Please accept the Privacy Policy to continue."; coForm.consent.focus(); return; }
    $("#consentMsg").textContent = "";
    const orderId = "PA" + Date.now().toString().slice(-8);
    const pay = coForm.pay.value === "cod" ? "Cash on delivery" : "UPI";
    $("#orderMsg").innerHTML = `Order <strong>#${orderId}</strong> for <strong>${inr(totals().total)}</strong> (${pay}) will reach ${coForm.city.value.trim()} in 3–5 days. Updates will be sent to ${coForm.phone.value.trim()}.`;
    coForm.hidden = true;
    $("#orderSuccess").hidden = false;
    state.cart = []; state.coupon = null;
    coForm.reset();
    refresh();
  });

  const contactForm = $("#contactForm");
  if (contactForm) {
    wireValidation(contactForm);
    contactForm.addEventListener("submit", (e) => {
      e.preventDefault();
      if (!validateForm(contactForm)) return;
      const name = contactForm.name.value.trim().split(" ")[0];
      contactForm.hidden = true;
      const done = $("#contactSuccess");
      done.querySelector("p").textContent = `Thank you, ${name}! Our Ayurveda care team will get back to you within 24 hours.`;
      done.hidden = false;
      done.focus();
    });
  }

  const newsForm = $("#newsForm");
  if (newsForm) {
    newsForm.addEventListener("submit", (e) => {
      e.preventDefault();
      const input = $("#newsEmail");
      const msg = $("#newsMsg");
      if (validators.email(input.value)) { msg.textContent = "Please enter a valid email."; msg.className = "field-msg"; input.focus(); return; }
      msg.textContent = "Subscribed! Watch your inbox for seasonal wellness tips."; msg.className = "field-msg field-msg--ok";
      input.value = "";
    });
  }

  // fill store details on contact page
  $$("[data-store]").forEach((el) => {
    const key = el.dataset.store;
    el.textContent = key === "whatsapp" ? STORE.phone : STORE[key];
    if (el.tagName === "A") el.href = key === "phone" ? `tel:${STORE.phone.replace(/\s/g, "")}` : key === "email" ? `mailto:${STORE.email}` : `https://wa.me/${STORE.whatsapp}`;
  });

  // ---------- init ----------
  renderHome();
  renderTestimonialsPage();
  initShop();
  refresh();
})();
