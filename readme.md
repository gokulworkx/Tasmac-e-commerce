# TASMAC Reserve — Tamil Nadu Official Express Liquor Storefront

> **Next-Gen Customer-Facing E-Commerce Platform built with the TASMAC Reserve Design System, Real-Time Chennai Outlets Map, Live GPS Geolocation, and Express Digital QR Pickup Token Engine.**

---

## 📌 Executive Summary

**TASMAC Reserve** is a customer-centric, digital retail storefront designed to eliminate counter congestion, ensure 100% statutory Government Maximum Retail Price (MRP) transparency, and streamline liquor procurement across Chennai, Tamil Nadu.

Unlike administrative back-office ERPs or warehouse inventory tables, this project is engineered strictly as a **luxurious, consumer-first e-commerce experience**. Customers can browse authentic Indian Made Foreign Liquor (IMFL), craft beers, and imported reserves, inspect tasting notes, locate nearby authorized outlets with real-time GPS distances, and reserve bottles for a guaranteed 2-minute express counter collection.

---

## 🌟 Key Features & Capabilities

### 1. 🗺️ Interactive Live Store Locator (37 Chennai Outlets)
- **High-Resolution Street-Level GIS**: Integrated with **Esri ArcGIS World Street Map** via Leaflet, delivering ultra-clear road names, major junctions, landmarks (Panagal Park, Pondy Bazaar, Express Avenue, Vivira Mall), and coastal cartography without API keys or watermark restrictions.
- **Adaptive Dark & Light Theme Tiles**: In Dark Mode, an obsidian night-vision CSS matrix filter (`brightness`, `contrast`, `invert`, `hue-rotate`) renders the map in a cyber-luxury tone that matches the design tokens. In Light Mode, it automatically renders a natural daylight street map.
- **Multi-Zone Filtering**: One-click zone filtering for:
  - *Central & T. Nagar*
  - *South & Adyar*
  - *Anna Nagar & West*
  - *OMR IT Corridor*
  - *Tambaram & Guindy*
  - *North Chennai*
- **Counter Classification**: Distinct map beacons and badges for **Elite Reserve Lounges** (gold crowns) and **Standard Retail Counters** (slate capsules).

### 2. 📍 Intelligent Geolocation & Distance Engine
- **Live GPS Auto-Detection**: Seamlessly connects to HTML5 Geolocation API to calculate direct straight-line distance (via Haversine trigonometric formula) from the user's actual device coordinates.
- **Chennai Central Zero Milestone Baseline**: When GPS is not granted, distances gracefully benchmark against Chennai's historic Zero Point at Chennai Central / Ripon Building (`13.0827, 80.2757`). No outlet ever shows broken or fake `(0.0 km)` distances.
- **Unified UI Synchronization**: Distance changes immediately reflect across the top header pickup counter pill (`#nav-selected-shop`), the hero fulfillment ribbon, and the checkout summary simultaneously.
- **Location & Preference Caching**: Persists user coordinates and preferred outlet ID in browser `localStorage`.

### 3. 🍾 Curated 26-Bottle Catalog with 3D Floating Perspective
- **7 Regulated Categories**: IMFL Whisky & Scotch, French Brandy, Dark & Spiced Rum, Chilled Craft Beers, Pure Grain Vodka, Estate Wine, and Craft Gin.
- **3D Dynamic Bottle Hover Engine**: Interactive cursor tracking engine calculates normalized rotational perspective (`rotateX`, `rotateY`, `scale3d`) and dynamic lighting highlights when hovering over bottles.
- **Transparent Cutout Imagery**: Studio-grade transparent cutout photography for flagship Tamil Nadu brands:
  - *Amrut Fusion Single Malt, Morpheus Blue XO, Kyron French Brandy, British Empire, Royal Challenge, Old Port Deluxe, Bacardi Superior, Bira 91 White, Corona Extra, Budweiser Magnum, Bombay Sapphire, and more.*

### 4. 🔍 Animated Search & Multi-Facet Filtering
- **Single-Shot Shimmer Animation**: The header search trigger features an introductory typing simulation and shimmer sweep that runs once on initial page load without distracting repetitions.
- **Instant Search & Sorting**: Real-time client-side search across brand titles, regions, and shop numbers. Sort by *Most Popular*, *Price: Low to High*, *Price: High to Low*, and *Bottle Volume*.

### 5. 🛡️ Background Stability & Modal Controller
- **Zero Scroll-Bleed Lock**: Opening dialogs, Quick View modals, or the interactive Leaflet map locks both `html` and `body` scroll positions statically (`modal-open`), preventing any annoying background jump or bounce.
- **Keyboard Shortcuts**: Full desktop accessibility with Escape (`Esc`) to close open dialogs and `/` to immediately focus catalog search.

### 6. 📱 Digital QR Token Express Checkout
- **Statutory Age Verification**: Mandatory 21+ legal age verification modal in compliance with Tamil Nadu State Excise rules.
- **Dedicated Customer Login Portal (`login.html`)**: Secure authentication supporting Mobile OTP verification (+91), Registered Email & Password, and 1-click test profiles. Pre-populates customer name, mobile number, and verified Govt ID into express reservations.
- **Persistent Profile & Session Menu**: Real-time user dropdown in the main storefront navigation with instant Sign Out, active token tracking, and 21+ verification status.
- **Express QR Pickup Token**: Finalizing checkout generates a scannable digital token and unique order ID with pickup counter operating hours (12:00 PM – 10:00 PM) for zero-wait fulfillment.

---

## 🎨 TASMAC Reserve Design System

| Token | Dark Mode (Default) | Light Mode |
|---|---|---|
| **Background** | `#08090a` (Obsidian Deep) | `#f8fafc` (Clean Slate) |
| **Card Surface** | `#121316` (Raised Charcoal) | `#ffffff` (Pure White) |
| **Primary Accent** | `#f97316` / `#ff5500` (Electric Amber) | `#ea580c` (Vibrant Orange) |
| **Typography** | `JetBrains Mono`, Consolas, Monospace | `JetBrains Mono`, Consolas, Monospace |
| **Borders** | `rgba(255, 255, 255, 0.08)` | `rgba(0, 0, 0, 0.08)` |
| **Transitions** | View Transitions API with circular ripple effect | View Transitions API with circular ripple effect |

---

## 📂 Project Architecture

```plaintext
Tasmac e commerce/
├── index.html            # Main single-page storefront (UI, Leaflet Map, Cart, Modals)
├── login.html            # Dedicated customer authentication portal (Mobile OTP, Govt ID, 21+ Verification)
├── readme.md             # Project documentation & technical specifications
├── css/
│   └── style.css         # Design tokens and auxiliary layout rules
├── img/                  # Master collection of bottle cutouts, previews, and badges
├── js/
│   ├── all_utility_scripts.js # Consolidated utility and image processing scripts
│   ├── app.js            # Core application entry & scripts
│   ├── mock-data.js      # Reference catalog dataset & outlet coordinates
│   └── scripts/          # Individual utility and image processing scripts archive
└── images/               # High-resolution transparent cutout bottle photography
    ├── AMRUT-SGL-750.png
    ├── BAC-SUP-750.png
    ├── BIRA-WHT-500.png
    ├── BOMBAY-SAPH-750.png
    ├── BP-BR-650.png
    ├── BP-WH-750.png
    ├── BUD-MAG-650.png
    ├── CAPT-MORG-750.png
    ├── CORONA-330.png
    ├── COUR-NAP-750.png
    ├── FRAT-MER-750.png
    ├── JW-BLK-750.png
    ├── KF-PR-650.png
    ├── KF-ULTRA-650.png
    ├── KY-BR-750.png
    ├── MAGIC-VOD-750.png
    ├── MC-WH-750.png
    ├── MCD-NO1-750.png
    ├── MH-BR-750.png
    ├── MOR-XO-750.png
    ├── OLD-PORT-750.png
    ├── RC-WH-750.png
    ├── SMIR-RED-750.png
    ├── SN-WH-750.png
    ├── SULA-SH-750.png
    └── TEACH-SCO-750.png
```

---

## 🚀 Getting Started

No build tools, bundlers, or heavy npm installations are required. The application runs natively in any standard web browser.

### Option 1: Direct File Launch
Simply double-click `index.html` or open it directly in Google Chrome, Microsoft Edge, Mozilla Firefox, or Safari:
```plaintext
file:///C:/Users/Kasthuri/OneDrive/Desktop/Tasmac%20e%20commerce/index.html
```

### Option 2: Local HTTP Server (Recommended for Geolocation API)
Modern browsers require a secure or localhost context to enable high-accuracy HTML5 GPS:

**Using Python:**
```bash
# Navigate to the project folder
cd "C:\Users\Kasthuri\OneDrive\Desktop\Tasmac e commerce"

# Start Python HTTP server
python -m http.server 5500
```
Then visit: `http://localhost:5500`

**Using Node.js / npx:**
```bash
npx serve .
```

---

## 📜 Statutory Legal Notice

> [!IMPORTANT]
> **GOVERNMENT OF TAMIL NADU STATUTORY WARNING:**
> - Consumption of alcohol is injurious to health.
> - Be safe — don't drink and drive.
> - Strictly 21+ years of age only.
> 
> *This software is a digital frontend prototype designed for educational, demonstration, and express pickup workflow optimization. It strictly complies with state pricing policies and statutory identity verification guidelines.*