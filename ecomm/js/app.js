(() => {
  const $ = (s, el = document) => el.querySelector(s);
  const $$ = (s, el = document) => [...el.querySelectorAll(s)];
  const inr = (n) => "₹" + n.toLocaleString("en-IN");
  const byId = (id) => PRODUCTS.find((p) => p.id === id);

  const COUPONS = { WELCOME10: { type: "pct", value: 10 }, FLAT200: { type: "flat", value: 200, min: 1499 } };
  const FREE_SHIP_MIN = 999;
  const SHIPPING = 79;

  // ---------- persisted state ----------
  const store = {
    get(key, fallback) {
      try { return JSON.parse(localStorage.getItem(key)) ?? fallback; } catch { return fallback; }
    },
    set(key, val) {
      try { localStorage.setItem(key, JSON.stringify(val)); } catch { /* storage unavailable */ }
    },
  };

  const state = {
    cart: store.get("kartify.cart", []), // [{id, qty}]
    wish: store.get("kartify.wish", []), // [id]
    coupon: store.get("kartify.coupon", null),
    filter: "all",
    query: "",
    sort: "featured",
  };

  const save = () => {
    store.set("kartify.cart", state.cart);
    store.set("kartify.wish", state.wish);
    store.set("kartify.coupon", state.coupon);
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

  // ---------- rendering ----------
  const stars = (r) =>
    `<span class="stars" aria-label="Rated ${r} out of 5"><svg class="icon icon--sm" aria-hidden="true"><use href="#i-star"/></svg>${r}</span>`;
  const off = (p) => Math.round(((p.mrp - p.price) / p.mrp) * 100);

  function renderCategories() {
    $("#catGrid").innerHTML = CATEGORIES.map((c) => {
      const sample = PRODUCTS.find((p) => p.cat === c.id);
      const count = PRODUCTS.filter((p) => p.cat === c.id).length;
      return `<button class="cat" data-cat="${c.id}" style="--tint:${c.tint}">
        ${productArt(sample)}
        <span class="cat__name">${c.name}</span>
        <span class="cat__count">${count} items</span>
      </button>`;
    }).join("");

    $("#filterChips").innerHTML = [{ id: "all", name: "All" }, ...CATEGORIES]
      .map((c) => `<button class="chip" data-filter="${c.id}" aria-pressed="${state.filter === c.id}">${c.name}</button>`)
      .join("");

    $("#footerCats").innerHTML = CATEGORIES.map((c) => `<li><a href="#shop" data-cat="${c.id}">${c.name}</a></li>`).join("");
  }

  function visibleProducts() {
    const q = state.query.trim().toLowerCase();
    let list = PRODUCTS.filter(
      (p) =>
        (state.filter === "all" || p.cat === state.filter) &&
        (!q || p.name.toLowerCase().includes(q) || p.cat.includes(q) || p.desc.toLowerCase().includes(q))
    );
    const sorters = {
      "price-asc": (a, b) => a.price - b.price,
      "price-desc": (a, b) => b.price - a.price,
      rating: (a, b) => b.rating - a.rating,
    };
    if (sorters[state.sort]) list = [...list].sort(sorters[state.sort]);
    return list;
  }

  function renderGrid() {
    const list = visibleProducts();
    $("#productGrid").innerHTML = list
      .map((p) => {
        const wished = state.wish.includes(p.id);
        return `<article class="card">
          <button class="card__media" data-view="${p.id}" aria-label="View ${p.name}">
            ${productArt(p)}
            ${p.tag ? `<span class="tag">${p.tag}</span>` : ""}
          </button>
          <button class="icon-btn card__wish ${wished ? "is-on" : ""}" data-wish="${p.id}" aria-pressed="${wished}" aria-label="${wished ? "Remove from" : "Add to"} wishlist">
            <svg class="icon" aria-hidden="true"><use href="#i-heart"/></svg>
          </button>
          <div class="card__body">
            <h3 class="card__title"><button data-view="${p.id}">${p.name}</button></h3>
            ${stars(p.rating)} <span class="muted small">(${p.reviews.toLocaleString("en-IN")})</span>
            <div class="price">
              <strong>${inr(p.price)}</strong><s>${inr(p.mrp)}</s><span class="off">${off(p)}% off</span>
            </div>
            <button class="btn btn--primary btn--block btn--sm" data-add="${p.id}">Add to cart</button>
          </div>
        </article>`;
      })
      .join("");
    $("#emptyState").hidden = list.length > 0;
    $("#resultInfo").textContent = `${list.length} product${list.length === 1 ? "" : "s"}${state.query ? ` for “${state.query}”` : ""}`;
    $$("#filterChips .chip").forEach((b) => b.setAttribute("aria-pressed", b.dataset.filter === state.filter));
  }

  function renderBadges() {
    const n = state.cart.reduce((s, i) => s + i.qty, 0);
    const cc = $("#cartCount");
    cc.textContent = n;
    cc.hidden = n === 0;
    const wc = $("#wishCount");
    wc.textContent = state.wish.length;
    wc.hidden = state.wish.length === 0;
    $("#cartBtn").setAttribute("aria-label", `Open cart, ${n} item${n === 1 ? "" : "s"}`);
  }

  function renderCart() {
    const body = $("#cartItems");
    if (!state.cart.length) {
      body.innerHTML = `<div class="empty"><svg class="icon icon--xl" aria-hidden="true"><use href="#i-bag"/></svg><p>Your cart is empty.</p><button class="btn btn--ghost" data-close>Start shopping</button></div>`;
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
            <p class="muted small">${inr(p.price)} each</p>
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

  function renderWish() {
    const body = $("#wishItems");
    if (!state.wish.length) {
      body.innerHTML = `<div class="empty"><svg class="icon icon--xl" aria-hidden="true"><use href="#i-heart"/></svg><p>No saved items yet.</p></div>`;
      return;
    }
    body.innerHTML = state.wish
      .map((id) => {
        const p = byId(id);
        return `<div class="line">
          ${productArt(p, "line__art")}
          <div class="line__info"><p class="line__name">${p.name}</p><p><strong>${inr(p.price)}</strong></p></div>
          <div class="line__end">
            <button class="btn btn--primary btn--sm" data-add="${id}">Add to cart</button>
            <button class="icon-btn icon-btn--sm" data-wish="${id}" aria-label="Remove from wishlist"><svg class="icon icon--sm" aria-hidden="true"><use href="#i-trash"/></svg></button>
          </div>
        </div>`;
      })
      .join("");
  }

  const renderAll = () => { renderGrid(); renderBadges(); renderCart(); renderWish(); save(); };

  // ---------- actions ----------
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
    renderAll();
    toast(`Added “${byId(id).name}” to cart`);
  }

  function changeQty(id, delta) {
    const line = state.cart.find((i) => i.id === id);
    if (!line) return;
    line.qty = Math.min(10, line.qty + delta);
    if (line.qty <= 0) state.cart = state.cart.filter((i) => i.id !== id);
    renderAll();
  }

  function toggleWish(id) {
    const on = state.wish.includes(id);
    state.wish = on ? state.wish.filter((x) => x !== id) : [...state.wish, id];
    renderAll();
    toast(on ? "Removed from wishlist" : "Saved to wishlist");
  }

  // ---------- drawers ----------
  let lastFocus = null;
  function openDrawer(el) {
    lastFocus = document.activeElement;
    $$(".drawer.is-open").forEach((d) => closeDrawer(d, false));
    el.classList.add("is-open");
    el.setAttribute("aria-hidden", "false");
    $("#overlay").hidden = false;
    document.body.classList.add("no-scroll");
    el.focus();
  }
  function closeDrawer(el = $(".drawer.is-open"), restore = true) {
    if (!el) return;
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
        <p>${stars(p.rating)} <span class="muted small">${p.reviews.toLocaleString("en-IN")} reviews</span></p>
        <div class="price price--lg"><strong>${inr(p.price)}</strong><s>${inr(p.mrp)}</s><span class="off">${off(p)}% off</span></div>
        <p class="muted small">Inclusive of all taxes</p>
        <p>${p.desc}</p>
        <div class="pm__buy">
          <div class="qty" role="group" aria-label="Quantity">
            <button class="icon-btn icon-btn--sm" id="pmDec" aria-label="Decrease quantity"><svg class="icon icon--sm" aria-hidden="true"><use href="#i-minus"/></svg></button>
            <span id="pmQty" aria-live="polite">1</span>
            <button class="icon-btn icon-btn--sm" id="pmInc" aria-label="Increase quantity"><svg class="icon icon--sm" aria-hidden="true"><use href="#i-plus"/></svg></button>
          </div>
          <button class="btn btn--accent" id="pmAdd">Add to cart</button>
        </div>
        <ul class="perks perks--stack">
          <li><svg class="icon" aria-hidden="true"><use href="#i-truck"/></svg>Delivery in 3–5 days</li>
          <li><svg class="icon" aria-hidden="true"><use href="#i-return"/></svg>Easy 7-day returns</li>
        </ul>
      </div>`;
    let qty = 1;
    const q = $("#pmQty");
    $("#pmDec").onclick = () => (q.textContent = qty = Math.max(1, qty - 1));
    $("#pmInc").onclick = () => (q.textContent = qty = Math.min(10, qty + 1));
    $("#pmAdd").onclick = () => { addToCart(id, qty); $("#productModal").close(); };
    $("#productModal").showModal();
  }

  // ---------- checkout ----------
  const validators = {
    name: (v) => (v.trim().length >= 2 ? "" : "Please enter your full name."),
    phone: (v) => (/^[6-9]\d{9}$/.test(v.trim()) ? "" : "Enter a valid 10-digit mobile number."),
    address: (v) => (v.trim().length >= 10 ? "" : "Please enter your complete address."),
    city: (v) => (v.trim() ? "" : "City is required."),
    pin: (v) => (/^[1-9]\d{5}$/.test(v.trim()) ? "" : "Enter a valid 6-digit PIN code."),
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

  function openCheckout() {
    if (!state.cart.length) return;
    closeDrawer(undefined, false);
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
    else if (d.wish) toggleWish(+d.wish);
    else if (d.view) openProduct(+d.view);
    else if (d.inc) changeQty(+d.inc, 1);
    else if (d.dec) changeQty(+d.dec, -1);
    else if (d.remove) changeQty(+d.remove, -Infinity);
    else if (d.filter) { state.filter = d.filter; renderGrid(); }
    else if (d.cat) {
      state.filter = d.cat;
      renderGrid();
      $("#shop").scrollIntoView({ behavior: matchMedia("(prefers-reduced-motion: reduce)").matches ? "auto" : "smooth" });
    } else if ("close" in d) closeDrawer();
    else if ("closeModal" in d) t.closest("dialog").close();
  });

  $("#cartBtn").addEventListener("click", () => openDrawer($("#cartDrawer")));
  $("#wishlistBtn").addEventListener("click", () => openDrawer($("#wishDrawer")));
  $("#overlay").addEventListener("click", () => closeDrawer());
  document.addEventListener("keydown", (e) => { if (e.key === "Escape") closeDrawer(); });

  // close dialogs when clicking the backdrop
  $$("dialog").forEach((dlg) => dlg.addEventListener("click", (e) => { if (e.target === dlg) dlg.close(); }));

  $("#searchForm").addEventListener("submit", (e) => { e.preventDefault(); $("#shop").scrollIntoView(); });
  $("#searchInput").addEventListener("input", (e) => { state.query = e.target.value; renderGrid(); });
  $("#sortSelect").addEventListener("change", (e) => { state.sort = e.target.value; renderGrid(); });
  $("#clearSearch").addEventListener("click", () => {
    state.query = ""; state.filter = "all"; $("#searchInput").value = ""; renderGrid();
  });

  $("#couponForm").addEventListener("submit", (e) => {
    e.preventDefault();
    const code = $("#couponInput").value.trim().toUpperCase();
    const msg = $("#couponMsg");
    const c = COUPONS[code];
    if (!code) { state.coupon = null; msg.textContent = ""; }
    else if (!c) { msg.textContent = "That code isn't valid."; msg.className = "field-msg"; return; }
    else if (totals().subtotal < (c.min || 0)) { msg.textContent = `${code} needs a minimum order of ${inr(c.min)}.`; msg.className = "field-msg"; return; }
    else { state.coupon = code; msg.textContent = `${code} applied!`; msg.className = "field-msg field-msg--ok"; }
    renderAll();
  });

  $("#checkoutBtn").addEventListener("click", openCheckout);

  const form = $("#checkoutForm");
  form.addEventListener("focusout", (e) => { if (e.target.name) validateField(e.target); });
  form.addEventListener("submit", (e) => {
    e.preventDefault();
    const fields = $$("input[name]:not([type=radio]), textarea", form);
    const ok = fields.map(validateField).every(Boolean);
    if (!ok) { fields.find((f) => f.getAttribute("aria-invalid") === "true").focus(); return; }
    const orderId = "KF" + Date.now().toString().slice(-8);
    const total = totals().total;
    const pay = form.pay.value === "cod" ? "Pay on delivery" : "UPI";
    $("#orderMsg").innerHTML = `Order <strong>#${orderId}</strong> for <strong>${inr(total)}</strong> (${pay}) will reach ${form.city.value.trim()} in 3–5 days. We'll SMS updates to ${form.phone.value.trim()}.`;
    form.hidden = true;
    $("#orderSuccess").hidden = false;
    state.cart = []; state.coupon = null;
    form.reset();
    renderAll();
  });

  $("#newsForm").addEventListener("submit", (e) => {
    e.preventDefault();
    const input = $("#newsEmail");
    const msg = $("#newsMsg");
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(input.value.trim())) {
      msg.textContent = "Please enter a valid email."; msg.className = "field-msg"; input.focus(); return;
    }
    msg.textContent = "You're in! Check your inbox for the ₹200 code."; msg.className = "field-msg field-msg--ok";
    input.value = "";
  });

  // ---------- init ----------
  $("#heroArt").innerHTML = [7, 1, 5].map((id) => productArt(byId(id))).join("");
  $("#year").textContent = new Date().getFullYear();
  renderCategories();
  renderAll();
})();
