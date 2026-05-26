# Pixel & Parcel — Luxury Mechanical Watch E-Commerce

> **"Where time meets trust."**

Welcome to **Pixel & Parcel**, an ultra-premium, minimalist luxury watch e-commerce experience designed for watch purists. This platform fuses modern precision (pixel-level digital registry verification) with physical heritage craftsmanship (fine mechanics, lacquer box parcel delivery).

---

## Key Features

1. **Atelier Aesthetics**: Meticulously designed dark charcoal (`#080808`) theme with brass and gold accent lines. High-contrast typography featuring **Cormorant Garamond** (Heritage Serif) and **Inter** (Precision Sans-serif).
2. **Acoustic Caliber Ticking (Escapement Heartbeat)**: An interactive sound manager that synthesizes a highly realistic 5.5Hz automatic watch escapement heartbeat directly via the **HTML5 Web Audio API** (requires 0 external files).
3. **Registry Serial Checker**: An interactive serial validation board. Customers can input watch SKU codes (e.g. `PP-CH-8921`) to inspect factory calibration states, blockchain register details, and assembly logs.
4. **QR Code Verification Simulator**: A mock lens scan scanner that scans caseback codes and outputs registry validity.
5. **Spec Comparison Engine**: Users can compare specifications (caliber, thickness, power reserves, strap detail) of up to 3 watches side-by-side in a drawer.
6. **Complimentary Engraving Customizer**: Customers can add custom engraving text lines on watch casebacks before purchasing.
7. **Secure Razorpay Integration**: Equipped with automated script loaders and client checkout handlers, calling Next.js Route APIs for Order Creation and signature verification.
8. **Sandbox Payment Terminal**: If no keys are provided in the environment, the site launches a custom interactive mock gateway allowing users to test successful/declined payments immediately.
9. **Merchant Atelier (Admin Panel)**: An administrator suite available at `/admin` featuring revenue tracking, active orders management, status indicators, and an inventory catalog editor.
10. **Custom watchMETAPHOR 404**: A broken clock repair error page telling users "Time has stalled".

---

## Technical Stack

- **Framework**: Next.js 16 (App Router) + TypeScript
- **Styling**: Tailwind CSS v4 + Vanilla HSL design tokens
- **Icons**: Lucide React
- **State Management**: Zustand
- **Payment API**: Razorpay SDK Node

---

## Project Structure

```bash
├── public/                  # Static assets and downloaded product photos
│   └── images/products/     # High-resolution watch photos downloaded automatically
├── scripts/
│   └── download-images.js   # Script that downloads photos on init
├── src/
│   ├── app/
│   │   ├── api/             # Next.js API Routes (Razorpay backend)
│   │   │   ├── checkout/
│   │   │   │   ├── create-order/route.ts
│   │   │   │   └── verify-payment/route.ts
│   │   │   admin/           # Dashboard page
│   │   │   about/           # Brand story page
│   │   │   checkout/        # Checkout flow pages
│   │   │   product/         # Dynamic detail pages
│   │   │   shop/            # Gallery page with sidebar filters
│   │   │   trust/           # Serial registry checker & scanner
│   │   │   globals.css      # Core theme, variables, and typography overrides
│   │   │   layout.tsx       # Dynamic layout wrapping global utilities
│   │   │   page.tsx         # Splash screen and hero canvas gears
│   │   ├── components/      # Reusable client assets (Cart, Navbar, Sound, Footer)
│   │   ├── data/            # Watch database collections and coupons
│   │   └── store/           # Zustand state persist stores
```

---

## Quick Start

### 1. Install Dependencies
```bash
npm install
```

### 2. Verify Product Assets
During project initialization, a download utility automatically downloads high-resolution Unsplash watch photos into your local public folder:
```bash
node scripts/download-images.js
```
*(Verify that `public/images/products/` contains 8 files: `chronos_horizon.jpg`, etc.)*

### 3. Spin Up Local Server
```bash
npm run dev
```
Open [http://localhost:3000](http://localhost:3000) in your browser.

---

## Payment Configuration

To switch from the **Sandbox Mock Payment Gateway** to **Live/Test Razorpay Checkout**, create a `.env.local` file in the root directory:

```env
# Razorpay Credentials (Test or Production)
RAZORPAY_KEY_ID=rzp_test_yourkeyhere123
RAZORPAY_KEY_SECRET=yourkeysecretheredonotshare
```

### How to test:
- **Sandbox Fallback (Default)**: If `.env.local` is missing or keys are empty, submitting the shipping details opens the custom **Sandbox Modal** inside the page. Clicking *Simulate Success* redirects to `/checkout/success` with a tracking stepper. *Simulate Declined Card* redirects to `/checkout/failure`.
- **Live/Test Mode**: If keys are present, submitting the form triggers the official Razorpay Client SDK widget popup. You can use standard Razorpay test card numbers or UPI handles to complete the verification.

---

## Merchant Dashboard Simulation

Visit [http://localhost:3000/admin](http://localhost:3000/admin) to manage the store:
- **Gross Revenue**: Automatically adds values from successful checkouts completed in your current session.
- **Product Management**: Fill out the form to add a watch. It instantly appears in the shop page catalog grid. Or edit specifications of existing ones.
- **Order Tracking**: Toggle dropdown statuses (Processing, Calibrating, Shipped, Delivered) to mock update shipping progress for simulated orders.
