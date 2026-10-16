/**
 * TASMAC Customer Storefront Product Catalog Data
 * Official retail catalog specifications and pricing tiers
 * Expanded with 26 authentic brands across 7 beverage categories
 */

window.TASMAC_CATALOG = [
  /* 1. IMFL Whisky */
  { id: "AMRUT-SGL-750", name: "Amrut Fusion Indian Single Malt", brand: "Amrut Distilleries", category: "IMFL Whisky", size: "750 ml", abv: "50.0%", price: 4200, rating: "5.0", reviews: "2,420", bestseller: true },
  { id: "MCD-NO1-750", name: "McDowell's No.1 Reserve Whisky", brand: "United Spirits Limited", category: "IMFL Whisky", size: "750 ml", abv: "42.8%", price: 720, rating: "4.9", reviews: "1,840", bestseller: true },
  { id: "SN-WH-750", name: "Signature Premier Grain Whisky", brand: "United Spirits Limited", category: "IMFL Whisky", size: "750 ml", abv: "42.8%", price: 920, rating: "4.8", reviews: "920", bestseller: false },
  { id: "RC-WH-750", name: "Royal Challenge Select Premium", brand: "United Spirits Limited", category: "IMFL Whisky", size: "750 ml", abv: "42.8%", price: 840, rating: "4.8", reviews: "1,620", bestseller: true },
  { id: "BP-WH-750", name: "Blenders Pride Rare Premium Whisky", brand: "Pernod Ricard India", category: "IMFL Whisky", size: "750 ml", abv: "42.8%", price: 980, rating: "4.8", reviews: "2,100", bestseller: true },
  { id: "RS-WH-750", name: "Royal Stag Premier Special Whisky", brand: "Pernod Ricard India", category: "IMFL Whisky", size: "750 ml", abv: "42.8%", price: 760, rating: "4.7", reviews: "3,110", bestseller: false },
  { id: "ANT-BL-750", name: "Antiquity Blue Ultra Premium", brand: "United Spirits Limited", category: "IMFL Whisky", size: "750 ml", abv: "42.8%", price: 1350, rating: "4.9", reviews: "890", bestseller: false },

  /* 2. IMFL Brandy */
  { id: "MH-BR-750", name: "Mansion House French Brandy", brand: "Tilaknagar Industries", category: "IMFL Brandy", size: "750 ml", abv: "42.8%", price: 860, rating: "4.9", reviews: "4,150", bestseller: true },
  { id: "MOR-XO-750", name: "Morpheus Blue XO Premium Brandy", brand: "Radico Khaitan", category: "IMFL Brandy", size: "750 ml", abv: "42.8%", price: 1120, rating: "4.9", reviews: "1,780", bestseller: true },
  { id: "COUR-NAP-750", name: "Courrier Napoleon French Brandy", brand: "Tilaknagar Industries", category: "IMFL Brandy", size: "750 ml", abv: "42.8%", price: 920, rating: "4.7", reviews: "940", bestseller: false },
  { id: "GOLD-GRP-750", name: "Golden Grape Reserve Brandy", brand: "SNJ Distilleries", category: "IMFL Brandy", size: "750 ml", abv: "42.8%", price: 640, rating: "4.6", reviews: "2,350", bestseller: false },

  /* 3. IMFL Rum */
  { id: "MC-WH-750", name: "Old Monk Supreme Rum (Vatted Dark)", brand: "Mohan Meakin Limited", category: "IMFL Rum", size: "750 ml", abv: "42.8%", price: 650, rating: "5.0", reviews: "5,840", bestseller: true },
  { id: "BAC-SUP-750", name: "Bacardi Superior White Rum", brand: "Bacardi-Martini", category: "IMFL Rum", size: "750 ml", abv: "42.8%", price: 820, rating: "4.8", reviews: "1,220", bestseller: false },
  { id: "BAC-BLK-750", name: "Bacardi Black Premium Dark Rum", brand: "Bacardi-Martini", category: "IMFL Rum", size: "750 ml", abv: "42.8%", price: 890, rating: "4.8", reviews: "950", bestseller: false },
  { id: "CAPT-MORG-750", name: "Captain Morgan Original Spiced Rum", brand: "Diageo India", category: "IMFL Rum", size: "750 ml", abv: "35.0%", price: 940, rating: "4.8", reviews: "1,420", bestseller: true },

  /* 4. Beer & Brews */
  { id: "KF-PR-650", name: "Kingfisher Premium Lager Beer", brand: "United Breweries", category: "Beer", size: "650 ml", abv: "5.0%", price: 170, rating: "4.9", reviews: "3,800", bestseller: true },
  { id: "KF-ULTRA-650", name: "Kingfisher Ultra Max Super Premium", brand: "United Breweries", category: "Beer", size: "650 ml", abv: "8.0%", price: 220, rating: "4.9", reviews: "1,940", bestseller: true },
  { id: "BUD-MAG-650", name: "Budweiser Magnum Super Premium Beer", brand: "Anheuser-Busch InBev", category: "Beer", size: "650 ml", abv: "8.0%", price: 240, rating: "4.9", reviews: "2,840", bestseller: true },
  { id: "BP-BR-650", name: "British Empire Super Strong Beer", brand: "SNJ Breweries", category: "Beer", size: "650 ml", abv: "8.0%", price: 180, rating: "4.7", reviews: "2,450", bestseller: false },
  { id: "CORONA-330", name: "Corona Extra Premium Mexican Lager", brand: "Grupo Modelo (Imported)", category: "Beer", size: "330 ml", abv: "4.5%", price: 280, rating: "4.9", reviews: "1,120", bestseller: false },
  { id: "BIRA-WHT-500", name: "Bira 91 White Belgian Wheat Beer", brand: "B9 Beverages", category: "Beer", size: "500 ml", abv: "4.7%", price: 210, rating: "4.8", reviews: "1,890", bestseller: true },

  /* 5. Vodka */
  { id: "MAGIC-VOD-750", name: "Magic Moments Remix Grain Vodka", brand: "Radico Khaitan", category: "Vodka", size: "750 ml", abv: "42.8%", price: 760, rating: "4.8", reviews: "2,190", bestseller: true },
  { id: "SMIR-RED-750", name: "Smirnoff No.21 Triple Distilled Vodka", brand: "Diageo India", category: "Vodka", size: "750 ml", abv: "42.8%", price: 920, rating: "4.9", reviews: "3,100", bestseller: true },
  { id: "ABSOLUT-750", name: "Absolut Swedish Vodka (Imported)", brand: "Pernod Ricard", category: "Vodka", size: "750 ml", abv: "40.0%", price: 2100, rating: "4.9", reviews: "1,450", bestseller: false },

  /* 6. Premium Wine */
  { id: "SULA-SH-750", name: "Sula Vineyards Shiraz Red Wine", brand: "Sula Vineyards", category: "Premium Wine", size: "750 ml", abv: "13.5%", price: 980, rating: "4.8", reviews: "1,180", bestseller: true },
  { id: "FRAT-MER-750", name: "Fratelli Classic Merlot Red Wine", brand: "Fratelli Vineyards", category: "Premium Wine", size: "750 ml", abv: "13.0%", price: 920, rating: "4.7", reviews: "820", bestseller: false },

  /* 7. Craft Gin */
  { id: "BOMBAY-SAPH-750", name: "Bombay Sapphire London Dry Gin", brand: "Bacardi-Martini", category: "Craft Gin", size: "750 ml", abv: "47.0%", price: 2400, rating: "4.9", reviews: "1,650", bestseller: true },
  { id: "GREATER-GIN-750", name: "Greater Than London Dry Craft Gin", brand: "NAO Spirits (Goa)", category: "Craft Gin", size: "750 ml", abv: "42.8%", price: 1250, rating: "4.9", reviews: "1,390", bestseller: true }
];
