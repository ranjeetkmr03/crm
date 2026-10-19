// Product catalogue. Images are inline SVG illustrations so the site works offline.
// To use real photos, add an `image: "images/your-photo.jpg"` field to any product.

const CATEGORIES = [
  { id: "footwear", name: "Footwear", tint: "#FDE7D9" },
  { id: "watches", name: "Watches", tint: "#DCEFE7" },
  { id: "audio", name: "Audio", tint: "#E3E5F8" },
  { id: "bags", name: "Bags", tint: "#F6E6CF" },
  { id: "apparel", name: "Apparel", tint: "#F3DDE3" },
  { id: "home", name: "Home", tint: "#E1ECF2" },
];

// Simple illustration per product type; `c` is the product colour.
const ART = {
  sneaker: (c) => `
    <path d="M30 128c0-14 8-22 20-24l26-4 18-26c4-6 12-6 16-1l14 18c10 12 30 18 50 20l12 2c10 2 16 10 16 20v8H30Z" fill="${c}"/>
    <path d="M30 136h172v10c0 4-4 8-8 8H38c-4 0-8-4-8-8Z" fill="#fff" stroke="#1f2937" stroke-width="3"/>
    <path d="M96 84l10 10M104 76l10 10M88 94l10 10" stroke="#fff" stroke-width="5" stroke-linecap="round"/>
    <path d="M130 116c18 6 40 8 60 8" stroke="#fff" stroke-width="4" stroke-linecap="round" opacity=".7"/>`,
  boot: (c) => `
    <path d="M70 40h50v70c0 8 6 14 14 16l44 10c10 2 16 10 16 20v4H60V52c0-6 4-12 10-12Z" fill="${c}"/>
    <path d="M60 160h134v8c0 4-4 8-8 8H68c-4 0-8-4-8-8Z" fill="#3f2a1d"/>
    <path d="M70 60h50M70 76h50" stroke="#00000033" stroke-width="4"/>`,
  watch: (c) => `
    <rect x="96" y="20" width="48" height="50" rx="10" fill="${c}"/>
    <rect x="96" y="150" width="48" height="50" rx="10" fill="${c}"/>
    <circle cx="120" cy="110" r="52" fill="#1f2937"/>
    <circle cx="120" cy="110" r="44" fill="#fff"/>
    <path d="M120 110V80M120 110l20 12" stroke="#1f2937" stroke-width="5" stroke-linecap="round"/>
    <circle cx="120" cy="110" r="5" fill="${c}"/>
    <rect x="170" y="102" width="10" height="16" rx="3" fill="#1f2937"/>`,
  smartwatch: (c) => `
    <rect x="98" y="18" width="44" height="52" rx="10" fill="${c}"/>
    <rect x="98" y="150" width="44" height="52" rx="10" fill="${c}"/>
    <rect x="72" y="58" width="96" height="104" rx="26" fill="#111827"/>
    <rect x="82" y="68" width="76" height="84" rx="18" fill="#0f766e"/>
    <path d="M94 112h14l8-16 10 30 8-14h14" stroke="#fff" stroke-width="4" fill="none" stroke-linecap="round" stroke-linejoin="round"/>`,
  headphones: (c) => `
    <path d="M56 130V108a64 64 0 0 1 128 0v22" stroke="${c}" stroke-width="14" fill="none" stroke-linecap="round"/>
    <rect x="40" y="118" width="40" height="64" rx="16" fill="${c}"/>
    <rect x="160" y="118" width="40" height="64" rx="16" fill="${c}"/>
    <rect x="52" y="128" width="20" height="44" rx="8" fill="#00000030"/>
    <rect x="168" y="128" width="20" height="44" rx="8" fill="#00000030"/>`,
  earbuds: (c) => `
    <rect x="62" y="96" width="116" height="80" rx="38" fill="#fff" stroke="#d1d5db" stroke-width="3"/>
    <path d="M62 128h116" stroke="#d1d5db" stroke-width="3"/>
    <circle cx="96" cy="70" r="20" fill="${c}"/><rect x="90" y="70" width="12" height="40" rx="6" fill="${c}"/>
    <circle cx="144" cy="70" r="20" fill="${c}"/><rect x="138" y="70" width="12" height="40" rx="6" fill="${c}"/>
    <circle cx="120" cy="150" r="4" fill="#10b981"/>`,
  speaker: (c) => `
    <rect x="70" y="30" width="100" height="160" rx="24" fill="${c}"/>
    <circle cx="120" cy="80" r="22" fill="#00000035"/><circle cx="120" cy="80" r="8" fill="#ffffff55"/>
    <circle cx="120" cy="140" r="34" fill="#00000035"/><circle cx="120" cy="140" r="12" fill="#ffffff55"/>`,
  backpack: (c) => `
    <path d="M96 50a24 24 0 0 1 48 0" stroke="#1f2937" stroke-width="8" fill="none"/>
    <rect x="66" y="50" width="108" height="140" rx="30" fill="${c}"/>
    <rect x="84" y="120" width="72" height="50" rx="12" fill="#00000025"/>
    <path d="M84 138h72" stroke="#ffffff70" stroke-width="3"/>
    <rect x="112" y="78" width="16" height="6" rx="3" fill="#ffffff90"/>`,
  tote: (c) => `
    <path d="M92 80V64a28 28 0 0 1 56 0v16" stroke="#3f2a1d" stroke-width="8" fill="none"/>
    <path d="M58 80h124l-10 110H68Z" fill="${c}"/>
    <path d="M70 100h100" stroke="#00000020" stroke-width="4"/>`,
  tshirt: (c) => `
    <path d="M90 36c6 12 18 18 30 18s24-6 30-18l44 22-16 34-20-8v104H82V84l-20 8-16-34Z" fill="${c}"/>
    <path d="M100 38c4 10 12 14 20 14s16-4 20-14" stroke="#00000030" stroke-width="4" fill="none"/>`,
  hoodie: (c) => `
    <path d="M86 50c0-20 16-30 34-30s34 10 34 30l40 20-14 40-18-8v96H78v-96l-18 8-14-40Z" fill="${c}"/>
    <path d="M98 50c4 14 12 20 22 20s18-6 22-20" fill="#00000025"/>
    <rect x="94" y="140" width="52" height="30" rx="8" fill="#00000020"/>
    <path d="M112 72v26M128 72v26" stroke="#fff" stroke-width="3" stroke-linecap="round"/>`,
  sunglasses: (c) => `
    <path d="M30 96h180" stroke="#1f2937" stroke-width="6" stroke-linecap="round"/>
    <path d="M40 96h66v18c0 18-12 30-32 30s-34-12-34-30Z" fill="${c}"/>
    <path d="M134 96h66v18c0 18-14 30-34 30s-32-12-32-30Z" fill="${c}"/>
    <path d="M54 108l18-6M148 108l18-6" stroke="#ffffff80" stroke-width="4" stroke-linecap="round"/>`,
  mug: (c) => `
    <path d="M160 92h12a22 22 0 0 1 0 44h-12" stroke="${c}" stroke-width="12" fill="none"/>
    <path d="M60 70h104v96a20 20 0 0 1-20 20H80a20 20 0 0 1-20-20Z" fill="${c}"/>
    <path d="M92 40c-6 8 6 12 0 20M114 36c-6 8 6 12 0 20M136 40c-6 8 6 12 0 20" stroke="#94a3b8" stroke-width="4" fill="none" stroke-linecap="round"/>`,
  lamp: (c) => `
    <path d="M84 40h72l24 70H60Z" fill="${c}"/>
    <rect x="114" y="110" width="12" height="64" fill="#1f2937"/>
    <rect x="82" y="174" width="76" height="14" rx="7" fill="#1f2937"/>
    <ellipse cx="120" cy="112" rx="40" ry="6" fill="#fde68a"/>`,
  plant: (c) => `
    <path d="M120 120c-30-10-44-40-36-70 26 6 40 34 36 70Z" fill="#16a34a"/>
    <path d="M120 120c26-14 50-8 64 12-24 14-50 8-64-12Z" fill="#22c55e"/>
    <path d="M120 120c-20-6-44 2-56 20 20 10 44 4 56-20Z" fill="#15803d"/>
    <path d="M78 124h84l-10 66H88Z" fill="${c}"/>`,
};

const PRODUCTS = [
  { id: 1, name: "AirFlow Runner Sneakers", cat: "footwear", art: "sneaker", color: "#EA580C", price: 2499, mrp: 3999, rating: 4.6, reviews: 1284, tag: "Bestseller", desc: "Lightweight knit upper with responsive foam cushioning. Built for daily runs and long city walks." },
  { id: 2, name: "Trailhead Leather Boots", cat: "footwear", art: "boot", color: "#92400E", price: 3999, mrp: 5499, rating: 4.4, reviews: 412, desc: "Full-grain leather with a grippy rubber sole. Water-resistant and ready for monsoon." },
  { id: 3, name: "Court Classic Sneakers", cat: "footwear", art: "sneaker", color: "#1D4ED8", price: 1899, mrp: 2499, rating: 4.3, reviews: 860, desc: "Retro low-top silhouette with padded collar and cushioned insole." },
  { id: 4, name: "Heritage Analog Watch", cat: "watches", art: "watch", color: "#B45309", price: 3299, mrp: 4999, rating: 4.7, reviews: 932, tag: "New", desc: "Minimal 40mm dial, sapphire-coated glass and a genuine leather strap. 3 ATM water resistance." },
  { id: 5, name: "Pulse Fit Smartwatch", cat: "watches", art: "smartwatch", color: "#0F766E", price: 4499, mrp: 6999, rating: 4.5, reviews: 2210, tag: "Bestseller", desc: "AMOLED display, heart-rate and SpO2 tracking, 10-day battery and Bluetooth calling." },
  { id: 6, name: "Steel Chrono Watch", cat: "watches", art: "watch", color: "#475569", price: 5799, mrp: 7999, rating: 4.6, reviews: 318, desc: "Stainless steel chronograph with luminous hands and a fold-over clasp." },
  { id: 7, name: "Studio Pro Headphones", cat: "audio", art: "headphones", color: "#111827", price: 5999, mrp: 8999, rating: 4.8, reviews: 1745, tag: "Top rated", desc: "Active noise cancellation, 40-hour battery and plush memory-foam ear cushions." },
  { id: 8, name: "Buds Lite True Wireless", cat: "audio", art: "earbuds", color: "#7C3AED", price: 1499, mrp: 2999, rating: 4.2, reviews: 3120, desc: "Punchy bass, low-latency gaming mode and 30 hours of playback with the case." },
  { id: 9, name: "Boom Mini Speaker", cat: "audio", art: "speaker", color: "#DC2626", price: 2199, mrp: 3499, rating: 4.4, reviews: 690, desc: "IPX7 waterproof Bluetooth speaker with 360° sound and 12-hour battery." },
  { id: 10, name: "Commuter Laptop Backpack", cat: "bags", art: "backpack", color: "#065F46", price: 1799, mrp: 2799, rating: 4.5, reviews: 1033, tag: "Bestseller", desc: "Fits 15.6\" laptops, water-repellent fabric, hidden anti-theft pocket and USB port." },
  { id: 11, name: "Canvas Market Tote", cat: "bags", art: "tote", color: "#D97706", price: 699, mrp: 999, rating: 4.3, reviews: 421, desc: "Heavy-duty cotton canvas with leather handles. Folds flat for travel." },
  { id: 12, name: "Everyday Cotton Tee", cat: "apparel", art: "tshirt", color: "#2563EB", price: 499, mrp: 799, rating: 4.2, reviews: 2580, desc: "100% combed cotton, pre-shrunk, regular fit. Available in S to XXL." },
  { id: 13, name: "Cloud Fleece Hoodie", cat: "apparel", art: "hoodie", color: "#BE185D", price: 1599, mrp: 2299, rating: 4.6, reviews: 744, tag: "New", desc: "Brushed fleece interior, kangaroo pocket and ribbed cuffs. Cozy without the bulk." },
  { id: 14, name: "Aviator Polarised Shades", cat: "apparel", art: "sunglasses", color: "#0E7490", price: 1299, mrp: 1999, rating: 4.4, reviews: 512, desc: "UV400 polarised lenses in a lightweight metal frame. Includes hard case." },
  { id: 15, name: "Stoneware Coffee Mug", cat: "home", art: "mug", color: "#0F766E", price: 399, mrp: 599, rating: 4.7, reviews: 980, desc: "Hand-glazed 350ml stoneware. Microwave and dishwasher safe." },
  { id: 16, name: "Nordic Table Lamp", cat: "home", art: "lamp", color: "#F59E0B", price: 1899, mrp: 2999, rating: 4.5, reviews: 287, desc: "Warm ambient light with a linen-finish shade and solid wood base." },
  { id: 17, name: "Ceramic Planter Set", cat: "home", art: "plant", color: "#E7E5E4", price: 899, mrp: 1399, rating: 4.4, reviews: 356, desc: "Set of two matte ceramic planters with drainage trays. Plants not included." },
];

function productArt(p, extraClass = "") {
  if (p.image) return `<img class="art ${extraClass}" src="${p.image}" alt="${p.name}" loading="lazy">`;
  const tint = CATEGORIES.find((c) => c.id === p.cat).tint;
  return `<svg class="art ${extraClass}" viewBox="0 0 240 220" role="img" aria-label="${p.name}" style="background:${tint}">${ART[p.art](p.color)}</svg>`;
}
