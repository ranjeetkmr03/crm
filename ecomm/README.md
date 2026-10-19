# Kartify — E-commerce Website

A complete e-commerce storefront built with plain HTML, CSS and JavaScript. No install or build step is needed.

## How to run
Double-click `index.html` and it opens in your browser. That's it.

(Optional) To run it on a local server: `npx serve .` or `python -m http.server`

## Features
- Hero, categories, and a product grid with 17 products
- Search, category filters, and sorting (price / rating)
- Product quick view with quantity selection
- Cart drawer: quantity +/- , remove, coupons (`WELCOME10`, `FLAT200`), free shipping above ₹999
- Wishlist
- Checkout form with validation (Indian mobile number and PIN code) → order confirmation
- Cart and wishlist are saved in the browser (localStorage)
- Mobile responsive, keyboard accessible

## Customise
- **Products / prices:** `js/products.js` → `PRODUCTS` array
- **Real photos:** put the image in an `images/` folder and add `image: "images/shoe.jpg"` to that product
- **Colours / fonts:** CSS variables at the top of `css/styles.css` (`:root`)
- **Coupons:** `COUPONS` in `js/app.js`

> Note: this is a frontend demo — no real payment or backend is involved. A backend (Node/Firebase etc.) is needed for real orders.
