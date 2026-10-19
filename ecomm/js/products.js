// Product catalogue. Images are inline SVG illustrations so the site works offline.
// To use real photos, add an `image: "images/your-photo.jpg"` field to any product.

const CATEGORIES = [
  { id: "immunity", name: "Immunity", tint: "#F3EBD3" },
  { id: "digestion", name: "Digestion", tint: "#E4EEDC" },
  { id: "stress", name: "Stress & Sleep", tint: "#E6E3F1" },
  { id: "skin-hair", name: "Skin & Hair", tint: "#F4E1DA" },
  { id: "women", name: "Women's Wellness", tint: "#F3DFE6" },
  { id: "pain", name: "Joint & Pain", tint: "#DDEAEC" },
];

const leaf = (x, y, s = 1) =>
  `<g transform="translate(${x} ${y}) scale(${s})"><path d="M0 0c10-14 28-16 38-12-4 16-20 26-38 12Z" fill="#4d7c0f"/><path d="M2 -1c10-4 22-8 32-10" stroke="#ecfccb" stroke-width="2" fill="none"/></g>`;

const fit = (text, width) => Math.min(13, Math.floor(width / (0.62 * text.length)));

const label = (y, h, c, text) => `
  <rect x="78" y="${y}" width="84" height="${h}" rx="6" fill="#fffaf0"/>
  <rect x="78" y="${y}" width="84" height="8" rx="3" fill="${c}"/>
  <text x="120" y="${y + h / 2 + 8}" text-anchor="middle" font-family="Lora, Georgia, serif" font-size="${fit(text, 78)}" font-weight="700" fill="#3b2f1e">${text}</text>
  <path d="M100 ${y + h - 12}h40" stroke="${c}" stroke-width="2"/>`;

// Simple illustration per pack type; `c` is the brand colour, `t` the short label text.
const ART = {
  capsules: (c, t) => `
    <rect x="96" y="34" width="48" height="22" rx="5" fill="#3b2f1e"/>
    <rect x="72" y="52" width="96" height="140" rx="18" fill="${c}"/>
    ${label(84, 70, c, t)}
    <g transform="translate(176 170) rotate(-30)"><rect width="34" height="14" rx="7" fill="#fbbf24"/><rect width="17" height="14" rx="7" fill="#b45309"/></g>
    ${leaf(30, 182, .8)}`,
  jar: (c, t) => `
    <rect x="64" y="48" width="112" height="26" rx="8" fill="#3b2f1e"/>
    <path d="M60 74h120v100a20 20 0 0 1-20 20H80a20 20 0 0 1-20-20Z" fill="${c}"/>
    ${label(96, 70, c, t)}
    ${leaf(176, 186, .9)}`,
  syrup: (c, t) => `
    <rect x="106" y="20" width="28" height="22" rx="4" fill="#3b2f1e"/>
    <path d="M108 42h24v20c18 8 30 22 30 40v84a10 10 0 0 1-10 10H88a10 10 0 0 1-10-10v-84c0-18 12-32 30-40Z" fill="${c}"/>
    ${label(110, 64, c, t)}
    ${leaf(28, 180, .8)}`,
  dropper: (c, t) => `
    <path d="M110 18a10 10 0 0 1 20 0v30h-20Z" fill="#1f2937"/>
    <rect x="102" y="46" width="36" height="20" rx="4" fill="#a16207"/>
    <rect x="84" y="66" width="72" height="126" rx="14" fill="${c}"/>
    <rect x="84" y="96" width="72" height="62" fill="#fffaf0"/>
    <text x="120" y="133" text-anchor="middle" font-family="Lora, Georgia, serif" font-size="${fit(t, 66)}" font-weight="700" fill="#3b2f1e">${t}</text>
    ${leaf(160, 180, .9)}`,
  oil: (c, t) => `
    <rect x="108" y="22" width="24" height="26" rx="4" fill="#a16207"/>
    <path d="M110 48h20v14l26 22v100a12 12 0 0 1-12 12H96a12 12 0 0 1-12-12V84l26-22Z" fill="${c}"/>
    ${label(110, 64, c, t)}
    <path d="M196 132c-10 14-10 24 0 30 10-6 10-16 0-30Z" fill="#facc15"/>
    ${leaf(26, 186, .8)}`,
  pouch: (c, t) => `
    <path d="M70 46h100l10 146H60Z" fill="${c}"/>
    <path d="M70 46h100v14H70Z" fill="#00000030"/>
    ${label(92, 72, c, t)}
    <ellipse cx="190" cy="190" rx="22" ry="8" fill="#d97706"/><path d="M170 190c6-12 34-12 40 0" fill="#f59e0b"/>
    ${leaf(28, 186, .8)}`,
};

const PRODUCTS = [
  { id: 1, name: "Ashwagandha Capsules", cat: "stress", art: "capsules", color: "#7C5A2E", label: "Ashwagandha", size: "60 capsules", price: 449, mrp: 599, rating: 4.7, reviews: 2140, tag: "Bestseller",
    desc: "KSM-66 root extract traditionally used to support calm, restful sleep and everyday energy.", ingredients: "Ashwagandha root extract (Withania somnifera) 500 mg", usage: "1 capsule twice daily after meals with warm milk or water." },
  { id: 2, name: "Triphala Churna", cat: "digestion", art: "pouch", color: "#6B7F2A", label: "Triphala", size: "200 g", price: 199, mrp: 260, rating: 4.6, reviews: 1612, tag: "Bestseller",
    desc: "Classic blend of amla, haritaki and bibhitaki for gentle digestive support and regularity.", ingredients: "Amalaki, Haritaki, Bibhitaki in equal parts", usage: "1 teaspoon with warm water at bedtime." },
  { id: 3, name: "Chyawanprash Special", cat: "immunity", art: "jar", color: "#7F1D1D", label: "Chyawanprash", size: "500 g", price: 349, mrp: 425, rating: 4.8, reviews: 3380, tag: "Top rated",
    desc: "Amla-rich herbal jam with 40+ herbs, prepared in pure ghee and honey to the classical recipe.", ingredients: "Amla, Ashwagandha, Pippali, Giloy, Shatavari, ghee, honey and 35+ herbs", usage: "1–2 teaspoons daily with warm milk. Children: half the dose." },
  { id: 4, name: "Giloy Ghanvati Tablets", cat: "immunity", art: "capsules", color: "#3F6212", label: "Giloy", size: "60 tablets", price: 179, mrp: 230, rating: 4.5, reviews: 1290,
    desc: "Concentrated guduchi stem extract, a traditional rasayana for seasonal wellness.", ingredients: "Giloy stem extract (Tinospora cordifolia) 500 mg", usage: "1–2 tablets twice daily after meals." },
  { id: 5, name: "Tulsi Drops", cat: "immunity", art: "dropper", color: "#166534", label: "Tulsi", size: "30 ml", price: 149, mrp: 199, rating: 4.4, reviews: 870,
    desc: "Panch tulsi extract from five holy basil varieties. Add a few drops to tea or warm water.", ingredients: "Rama, Shyama, Vana, Kapoor and Marua tulsi extracts", usage: "2–3 drops in a cup of warm water or tea, twice daily." },
  { id: 6, name: "Brahmi Syrup", cat: "stress", art: "syrup", color: "#365314", label: "Brahmi", size: "200 ml", price: 229, mrp: 295, rating: 4.5, reviews: 640,
    desc: "Brahmi and shankhpushpi tonic traditionally used to support focus, memory and a calm mind.", ingredients: "Brahmi, Shankhpushpi, Jatamansi, Vacha", usage: "2 teaspoons twice daily after meals." },
  { id: 7, name: "Kumkumadi Tailam", cat: "skin-hair", art: "dropper", color: "#B45309", label: "Kumkumadi", size: "15 ml", price: 599, mrp: 799, rating: 4.6, reviews: 1105, tag: "New",
    desc: "Saffron-infused face oil from the Ashtanga Hridayam for an even, radiant complexion.", ingredients: "Kesar (saffron), Manjistha, Chandan, Lotus in sesame oil", usage: "2–3 drops on clean skin at night; massage gently." },
  { id: 8, name: "Bhringraj Hair Oil", cat: "skin-hair", art: "oil", color: "#1E3A2B", label: "Bhringraj", size: "200 ml", price: 299, mrp: 399, rating: 4.5, reviews: 1820,
    desc: "Bhringraj, amla and brahmi slow-cooked in coconut and sesame oil for nourished, strong hair.", ingredients: "Bhringraj, Amla, Brahmi, Neem in coconut & sesame oil", usage: "Warm slightly, massage into scalp, leave 1 hour or overnight, then wash." },
  { id: 9, name: "Neem Capsules", cat: "skin-hair", art: "capsules", color: "#4D7C0F", label: "Neem", size: "60 capsules", price: 189, mrp: 240, rating: 4.3, reviews: 510,
    desc: "Neem leaf extract traditionally used to support clear skin from within.", ingredients: "Neem leaf extract (Azadirachta indica) 500 mg", usage: "1 capsule twice daily after meals." },
  { id: 10, name: "Shatavari Powder", cat: "women", art: "pouch", color: "#9D174D", label: "Shatavari", size: "100 g", price: 249, mrp: 320, rating: 4.6, reviews: 760,
    desc: "Shatavari root, the classical rasayana for women's vitality and hormonal balance.", ingredients: "Shatavari root powder (Asparagus racemosus)", usage: "½ teaspoon with warm milk twice daily." },
  { id: 11, name: "Ashokarishta", cat: "women", art: "syrup", color: "#831843", label: "Ashokarishta", size: "450 ml", price: 189, mrp: 235, rating: 4.4, reviews: 430,
    desc: "Traditional fermented herbal tonic made with ashoka bark to support menstrual wellness.", ingredients: "Ashoka bark, Dhataki, Musta, Haritaki and more", usage: "15–30 ml with equal water after meals, or as directed by your vaidya." },
  { id: 12, name: "Amla Juice", cat: "immunity", art: "syrup", color: "#65A30D", label: "Amla", size: "1 L", price: 199, mrp: 250, rating: 4.4, reviews: 990,
    desc: "Cold-pressed Indian gooseberry juice, naturally rich in vitamin C. No added sugar.", ingredients: "Amla (Emblica officinalis) juice", usage: "20–30 ml with a glass of water, empty stomach in the morning." },
  { id: 13, name: "Hingvastak Churna", cat: "digestion", art: "pouch", color: "#A16207", label: "Hingvastak", size: "100 g", price: 149, mrp: 185, rating: 4.5, reviews: 380,
    desc: "Hing, ajwain and trikatu blend traditionally taken to ease gas and bloating after meals.", ingredients: "Hing, Ajwain, Saunth, Kali mirch, Pippali, Jeera, Saindhav namak", usage: "½ teaspoon with the first morsel of food or with buttermilk." },
  { id: 14, name: "Mahanarayan Oil", cat: "pain", art: "oil", color: "#92400E", label: "Mahanarayan", size: "100 ml", price: 249, mrp: 310, rating: 4.7, reviews: 1430, tag: "Bestseller",
    desc: "Classical massage oil with 50+ herbs, traditionally used for stiff joints and tired muscles.", ingredients: "Bala, Ashwagandha, Shatavari, Dashmool and 50+ herbs in sesame oil", usage: "Warm and massage on the affected area 2–3 times daily. External use only." },
  { id: 15, name: "Yograj Guggulu", cat: "pain", art: "capsules", color: "#57534E", label: "Guggulu", size: "80 tablets", price: 219, mrp: 275, rating: 4.4, reviews: 520,
    desc: "Guggulu-based classical formulation traditionally used to support joint comfort and mobility.", ingredients: "Shuddha Guggulu, Chitrak, Pippali, Triphala and more", usage: "2 tablets twice daily with warm water, or as directed by your vaidya." },
  { id: 16, name: "Haldi Gold Capsules", cat: "pain", art: "capsules", color: "#CA8A04", label: "Haldi", size: "60 capsules", price: 329, mrp: 420, rating: 4.5, reviews: 690, tag: "New",
    desc: "High-curcumin turmeric with black pepper extract for better absorption.", ingredients: "Turmeric extract (95% curcuminoids), Piperine", usage: "1 capsule daily after a meal." },
];

function productArt(p, extraClass = "") {
  if (p.image) return `<img class="art ${extraClass}" src="${p.image}" alt="${p.name}" loading="lazy">`;
  const tint = CATEGORIES.find((c) => c.id === p.cat).tint;
  return `<svg class="art ${extraClass}" viewBox="0 0 240 220" role="img" aria-label="${p.name}" style="background:${tint}">${ART[p.art](p.color, p.label)}</svg>`;
}
