# Prakriti Ayurveda — Ayurvedic Medicine Store

A multi-page Ayurveda e-commerce website built with plain HTML, CSS and JavaScript. No install or build step is needed.

## Pages
| File | Page |
|---|---|
| `index.html` | Home: hero, health-concern categories, bestsellers, why us, testimonials, newsletter |
| `shop.html` | Shop: 16 products, search (name/ingredient), category filter, sorting, product details |
| `testimonials.html` | Testimonials: rating summary + all reviews |
| `contact.html` | Contact: phone/WhatsApp/email/address, validated contact form, FAQ |
| `privacy-policy.html` | Privacy Policy (in line with India's DPDP Act 2023) |

The cart, coupons (`AYUR10`, `WELLNESS100`), checkout and the WhatsApp button work on every page.

## How to run
Double-click `index.html`. All the files must stay in the same folder structure.

## Before going live, replace these (important)
- **Store details** (name, phone, WhatsApp, email, address): the `STORE` object at the top of `js/layout.js`; it updates across the whole site
- **AYUSH licence number**: `footer__cert` in `js/layout.js`
- **Grievance officer name**: the bottom of `privacy-policy.html`
- **Testimonials**: `js/testimonials.js` contains SAMPLE reviews. Put real customer reviews there; publishing fake reviews is not allowed under the Consumer Protection (E-commerce) Rules
- **Claims**: edit the "Why Prakriti" section in `index.html` (batch testing, sourcing etc.) to describe what you actually do
- Have the privacy policy reviewed by a lawyer once

## Customise
- **Products / prices / ingredients:** `js/products.js` → `PRODUCTS`
- **Real photos:** put the image in an `images/` folder and add `image: "images/ashwagandha.jpg"` to that product
- **Colours / fonts:** CSS variables in `:root` at the top of `css/styles.css`
- **Coupons / shipping:** `COUPONS`, `FREE_SHIP_MIN`, `SHIPPING` in `js/app.js`

> This is a frontend site — orders and contact form messages are not sent anywhere yet. For real orders you need a backend or service (e.g. Razorpay, Shopify, Firebase, or Formspree for the contact form).
