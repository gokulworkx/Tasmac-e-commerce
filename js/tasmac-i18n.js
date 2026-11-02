/**
 * TASMAC RESERVE — Bilingual Localization Controller (Tamil & English)
 * 
 * Safe Feature Enhancement:
 * - English default interface preserved
 * - Instant toggle between English and Tamil
 * - Preserves brand names, product titles, and statutory legal meanings
 * - Persists language selection in localStorage ('tasmac-lang')
 */

(function () {
  'use strict';

  const DICTIONARY = {
    en: {
      // Header & Navigation
      'nav.catalog': 'Catalog',
      'nav.map_view': 'Map View',
      'nav.cart': 'Cart',
      'nav.login': 'Sign In',
      'nav.patron': 'Patron Account',
      'nav.my_reservations': 'Reservations',
      'nav.support': 'Support',
      'nav.logout': 'Sign Out',
      'nav.store_locator': 'Store Locator',
      'nav.notifications': 'Notifications',
      'nav.clear_all': 'Clear all',

      // Hero / Active Store Strip
      'store.active_counter': 'ACTIVE FULFILLMENT COUNTER (GOVT MRP GUARANTEED)',
      'store.switch_outlet': 'Switch Outlet',
      'store.counter_ready': 'Counter Ready • 12 PM – 10 PM',
      'store.directions': 'Directions',
      'store.operating_hours': 'Operating Hours',
      'store.verified_address': 'Verified Address',

      // Catalog & Filters
      'catalog.all': 'All Bottles',
      'catalog.whisky': 'Whisky & Scotch',
      'catalog.brandy': 'French Brandy',
      'catalog.rum': 'Dark & Spiced Rum',
      'catalog.beer': 'Beer',
      'catalog.vodka': 'Vodka',
      'catalog.gin': 'Craft Gin',
      'catalog.search_ph': 'Search 26 Govt Registered brands, Scotch, Single Malts...',
      'catalog.sort_popular': 'Sort: Most Popular',
      'catalog.sort_price_asc': 'Price: Low to High',
      'catalog.sort_price_desc': 'Price: High to Low',
      'catalog.sort_rating': 'Highest Rated',
      'catalog.mrp_label': 'Govt Printed MRP',
      'catalog.reserve_btn': 'Reserve',
      'catalog.availability_unconfirmed': 'Availability not confirmed',
      'catalog.live_stock': 'Verified Live Stock',
      'catalog.quickview': 'Quick View',

      // Cart & Checkout
      'cart.title': 'Your Cart & Express Token',
      'cart.direct_reservation': 'Direct Counter Reservation',
      'cart.pickup_at': 'Pickup at:',
      'cart.change_outlet': 'Change Outlet ▾',
      'cart.total_payable': 'Total Payable at Counter:',
      'cart.confirm_btn': 'Confirm & Generate Digital Token',
      'cart.review_btn': 'Review Reservation Summary',
      'cart.return_store': 'Return to Store',
      'cart.empty_title': 'Your Reservation Cart is Empty',
      'cart.empty_desc': 'Explore our Tamil Nadu State Excise approved catalog and add your preferred beverages.',
      'cart.print_receipt': 'Print / Save PDF Receipt',
      'cart.reservation_ready': 'Reservation Ready!',
      'cart.present_token': 'Present this digital token to the express counter cashier for 2-minute pickup.',
      'cart.express_queue': 'EXPRESS QUEUE',
      'cart.statutory_notice': 'Show original Govt ID at the dedicated VIP counter to claim your bottles. Maximum purchase limits per patron apply under state law.',
      'cart.signin_required': 'Sign in required: You must be signed in to reserve bottles.',
      'cart.signin_to_reserve': 'Sign In to Reserve Bottles',
      'cart.signin_now': 'Sign in now →',
      'cart.remove_btn': 'Remove',
      'cart.auth_modal_title': 'Sign In to View Your Cart',
      'cart.auth_modal_badge': 'Official 21+ Verification',
      'cart.auth_modal_desc': 'Please sign in to view the items in your cart and complete your reservation.',
      'cart.auth_modal_signin_btn': 'Sign In to View Cart',
      'cart.auth_modal_create_btn': 'Create New Account',
      'cart.auth_modal_cancel': 'Continue browsing',
      'cart.auth_modal_statutory': 'Strictly 21+ Only • Original Govt ID Required at Pickup',

      // Summary Modal
      'summary.title': 'Reservation Summary',
      'summary.subtitle': 'Please review your reservation before final confirmation',
      'summary.outlet': 'Selected Outlet',
      'summary.items': 'Reserved Bottles',
      'summary.patron': 'Patron Details',
      'summary.confirm_action': 'Confirm & Secure Token',
      'summary.edit_action': 'Back to Edit Cart',

      // Support & Help
      'support.title': 'Customer Support & Issue Reporting',
      'support.subtitle': 'TASMAC Patron Assistance & Feedback Desk',
      'support.category': 'Issue Category',
      'support.cat_product': 'Product information',
      'support.cat_outlet': 'Outlet information',
      'support.cat_reservation': 'Reservation problem',
      'support.cat_technical': 'Technical issue',
      'support.cat_other': 'Other',
      'support.ref_optional': 'Reservation Reference (Optional)',
      'support.desc_label': 'Description of the Issue',
      'support.desc_ph': 'Please describe the problem or question in detail (minimum 10 characters)...',
      'support.name_label': 'Your Name',
      'support.phone_label': 'Phone / Contact',
      'support.submit_btn': 'Submit Issue Report',
      'support.notice': 'Official TASMAC Reserve Support Desk. Submitted issues are routed to regional supervision.',

      // My Reservations
      'res.dashboard_title': 'My Reservations',
      'res.dashboard_subtitle': 'Tokens & pickup history',
      'res.empty_title': 'No Reservations Yet',
      'res.empty_desc': 'When you reserve bottles, your pickup tokens and digital receipts will appear here.',
      'res.login_prompt': 'Sign in to view your reservations',
      'res.login_desc': 'Please sign in to access your reservation tokens and digital receipts.',
      'res.login_btn': 'Sign In',
      'res.token_ref': 'Token Reference',
      'res.date': 'Date & Time',
      'res.outlet': 'Pickup Outlet',
      'res.status_pending': 'Pending Counter Pickup',
      'res.status_collected': 'Collected / Complete',
      'res.status_cancelled': 'Cancelled',
      'res.items_count': 'Items',
      'res.total_mrp': 'Statutory Total'
    },
    ta: {
      // Header & Navigation
      'nav.catalog': 'தயாரிப்புகள்',
      'nav.map_view': 'வரைபடம்',
      'nav.cart': 'கூடை',
      'nav.login': 'உள்நுழைக',
      'nav.patron': 'வாடிக்கையாளர் கணக்கு',
      'nav.my_reservations': 'முன்பதிவுகள்',
      'nav.support': 'உதவி',
      'nav.logout': 'வெளியேறு',
      'nav.store_locator': 'டாஸ்மாக் கடைகள்',
      'nav.notifications': 'அறிவிப்புகள்',
      'nav.clear_all': 'அனைத்தையும் நீக்குக',

      // Hero / Active Store Strip
      'store.active_counter': 'செயலில் உள்ள விநியோக கவுண்டர் (அரசு MRP உத்தரவாதம்)',
      'store.switch_outlet': 'கடையை மாற்றுக',
      'store.counter_ready': 'கவுண்டர் தயார் • மதியம் 12 – இரவு 10',
      'store.directions': 'வழிகாட்டுதல்',
      'store.operating_hours': 'வேலை நேரம்',
      'store.verified_address': 'சரிபார்க்கப்பட்ட முகவரி',

      // Catalog & Filters
      'catalog.all': 'அனைத்து பாட்டில்கள்',
      'catalog.whisky': 'விஸ்கி & ஸ்காட்ச்',
      'catalog.brandy': 'பிராந்தி',
      'catalog.rum': 'ரம்',
      'catalog.beer': 'பீர்',
      'catalog.vodka': 'ஓட்கா',
      'catalog.gin': 'ஜின்',
      'catalog.search_ph': '26 அரசுப் பதிவு பிராண்டுகளைத் தேடுக...',
      'catalog.sort_popular': 'வரிசைப்படுத்து: பிரபலமானவை',
      'catalog.sort_price_asc': 'விலை: குறைந்தது முதல் அதிகம்',
      'catalog.sort_price_desc': 'விலை: அதிகம் முதல் குறைந்தது',
      'catalog.sort_rating': 'உயர்ந்த மதிப்பீடு',
      'catalog.mrp_label': 'அரசு அச்சிட்ட MRP',
      'catalog.reserve_btn': 'முன்பதிவு',
      'catalog.availability_unconfirmed': 'இருப்பு உறுதிசெய்யப்படவில்லை',
      'catalog.live_stock': 'நேரலை இருப்பு உறுதி',
      'catalog.quickview': 'துரிதப் பார்வை',

      // Cart & Checkout
      'cart.title': 'உங்கள் கூடை & டோக்கன்',
      'cart.direct_reservation': 'நேரடி கவுண்டர் முன்பதிவு',
      'cart.pickup_at': 'பெறும் கடை:',
      'cart.change_outlet': 'கடையை மாற்றுக ▾',
      'cart.total_payable': 'கவுண்டரில் செலுத்த வேண்டிய தொகை:',
      'cart.confirm_btn': 'உறுதிசெய்து டோக்கன் பெறுக',
      'cart.review_btn': 'முன்பதிவு சரிபார்ப்பு',
      'cart.return_store': 'கடைக்குத் திரும்பு',
      'cart.empty_title': 'உங்கள் முன்பதிவுக் கூடை காலியாக உள்ளது',
      'cart.empty_desc': 'தமிழ்நாடு மதுவிலக்கு மற்றும் ஆயத்தீர்வைத் துறை அங்கீகரித்த பட்டியலிலிருந்து பாட்டில்களைத் தேர்ந்தெடுக்கவும்.',
      'cart.print_receipt': 'ரசீது அச்சிடுக / PDF சேமிக்க',
      'cart.reservation_ready': 'முன்பதிவு முடிந்தது!',
      'cart.present_token': '2 நிமிட துரிதப் பெறுகைக்கு இந்த டிஜிட்டல் டோக்கனைக் கவுண்டரில் காட்டவும்.',
      'cart.express_queue': 'விரைவுக் கவுண்டர்',
      'cart.statutory_notice': 'பாட்டில்களைப் பெற அசல் அரசு அடையாள அட்டையைக் கவுண்டரில் சமர்ப்பிக்கவும். அரசு சட்டப்படி ஒரு நபருக்கான கொள்முதல் வரம்பு பொருந்தும்.',
      'cart.signin_required': 'உள்நுழைவு அவசியம்: பாட்டில்களை முன்பதிவு செய்ய கணக்கில் உள்நுழைய வேண்டும்.',
      'cart.signin_to_reserve': 'முன்பதிவு செய்ய உள்நுழைக',
      'cart.signin_now': 'இப்போதே உள்நுழைக →',
      'cart.remove_btn': 'நீக்கு',
      'cart.auth_modal_title': 'உங்கள் கூடையைப் பார்க்க உள்நுழையவும்',
      'cart.auth_modal_badge': 'அரசு அங்கீகரிக்கப்பட்ட 21+ சரிபார்ப்பு',
      'cart.auth_modal_desc': 'உங்கள் கூடையில் உள்ள பொருட்களைப் பார்க்கவும் முன்பதிவை முடிக்கவும் உள்நுழையவும்.',
      'cart.auth_modal_signin_btn': 'கூடையைப் பார்க்க உள்நுழைக',
      'cart.auth_modal_create_btn': 'புதிய கணக்கு உருவாக்குக',
      'cart.auth_modal_cancel': 'தொடர்ந்து உலாவுக',
      'cart.auth_modal_statutory': '21+ வயதுக்கு மட்டுமே • அசல் அரசு அடையாள அட்டை தேவை',

      // Summary Modal
      'summary.title': 'முன்பதிவு சுருக்கம்',
      'summary.subtitle': 'இறுதி உறுதிப்படுத்தலுக்கு முன் உங்கள் முன்பதிவைச் சரிபார்க்கவும்',
      'summary.outlet': 'தேர்ந்தெடுக்கப்பட்ட கடை',
      'summary.items': 'முன்பதிவு செய்யப்பட்டவை',
      'summary.patron': 'வாடிக்கையாளர் விவரங்கள்',
      'summary.confirm_action': 'உறுதிசெய்து டோக்கன் பெறுக',
      'summary.edit_action': 'கூடையைத் திருத்து',

      // Support & Help
      'support.title': 'வாடிக்கையாளர் ஆதரவு & புகார் பதிவு',
      'support.subtitle': 'டாஸ்மாக் உதவி மற்றும் கருத்துப் பிரிவு',
      'support.category': 'பிரச்சனை வகை',
      'support.cat_product': 'தயாரிப்பு தகவல்',
      'support.cat_outlet': 'கடை தகவல்',
      'support.cat_reservation': 'முன்பதிவு சிக்கல்',
      'support.cat_technical': 'தொழில்நுட்பப் பிரச்சனை',
      'support.cat_other': 'பிற',
      'support.ref_optional': 'முன்பதிவு டோக்கன் எண் (விருப்பத்தேர்வு)',
      'support.desc_label': 'விவரம்',
      'support.desc_ph': 'உங்கள் பிரச்சனை அல்லது சந்தேகத்தை தெளிவாக எழுதவும் (குறைந்தது 10 எழுத்துக்கள்)...',
      'support.name_label': 'உங்கள் பெயர்',
      'support.phone_label': 'தொலைபேசி எண்',
      'support.submit_btn': 'புகாரைச் சமர்ப்பிக்க',
      'support.notice': 'அதிகாரப்பூர்வ டாஸ்மாக் உதவி மையம். பதிவு செய்யப்பட்ட புகார்கள் மண்டலக் கண்காணிப்பிற்கு அனுப்பப்படும்.',

      // My Reservations
      'res.dashboard_title': 'எனது முன்பதிவுகள்',
      'res.dashboard_subtitle': 'டோக்கன்கள் மற்றும் ரசீதுகள்',
      'res.empty_title': 'முன்பதிவுகள் ஏதுமில்லை',
      'res.empty_desc': 'நீங்கள் மதுபானங்களை முன்பதிவு செய்யும்போது, டோக்கன்கள் இங்கு தோன்றும்.',
      'res.login_prompt': 'முன்பதிவுகளைப் பார்க்க உள்நுழையவும்',
      'res.login_desc': 'உங்கள் டோக்கன்கள் மற்றும் ரசீதுகளைப் பார்க்க தயவுசெய்து உள்நுழையவும்.',
      'res.login_btn': 'உள்நுழைக',
      'res.token_ref': 'டோக்கன் எண்',
      'res.date': 'தேதி & நேரம்',
      'res.outlet': 'பெறும் கடை',
      'res.status_pending': 'கவுண்டர் பெறுகை நிலுவையில் உள்ளது',
      'res.status_collected': 'பெறப்பட்டது / நிறைவடைந்தது',
      'res.status_cancelled': 'ரத்து செய்யப்பட்டது',
      'res.items_count': 'எண்ணிக்கை',
      'res.total_mrp': 'மொத்தத் தொகை'
    }
  };

  let currentLang = 'en';
  try {
    const saved = localStorage.getItem('tasmac-lang');
    if (saved === 'ta' || saved === 'en') {
      currentLang = saved;
    }
  } catch (e) {}

  function t(key) {
    if (DICTIONARY[currentLang] && DICTIONARY[currentLang][key]) {
      return DICTIONARY[currentLang][key];
    }
    if (DICTIONARY.en && DICTIONARY.en[key]) {
      return DICTIONARY.en[key];
    }
    return key;
  }

  function applyDOMTranslation(selector, enText, taText, isHTML = false) {
    document.querySelectorAll(selector).forEach(el => {
      // If this element already has data-i18n, let data-i18n handle it exclusively
      if (el.hasAttribute('data-i18n')) return;
      if (el.closest('#nav-btn-track-order')) return;

      if (currentLang === 'ta') {
        if (isHTML) el.innerHTML = taText;
        else el.textContent = taText;
      } else {
        if (isHTML) el.innerHTML = enText;
        else el.textContent = enText;
      }
    });
  }

  function applyPlaceholderTranslation(selector, enText, taText) {
    document.querySelectorAll(selector).forEach(el => {
      if (el.hasAttribute('data-i18n-ph')) return;
      if (currentLang === 'ta') {
        el.setAttribute('placeholder', taText);
      } else {
        el.setAttribute('placeholder', enText);
      }
    });
  }

  function translateProductCards() {
    if (currentLang === 'ta') {
      document.querySelectorAll('.mrp-micro-label').forEach(el => {
        el.textContent = 'அரசு அச்சிட்ட MRP';
      });
      document.querySelectorAll('.btn-reserve-action span').forEach(el => {
        el.textContent = 'முன்பதிவு';
      });
      document.querySelectorAll('.card-bestseller-star').forEach(el => {
        el.textContent = '★ அதிகம் விற்பனை';
      });
      document.querySelectorAll('.card-stock-pill span').forEach(el => {
        const txt = el.textContent || '';
        if (txt.includes('Availability') || txt.includes('உறுதி')) el.textContent = 'இருப்பு உறுதிசெய்யப்படவில்லை';
        else if (txt.includes('Verified') || txt.includes('நேரலை')) el.textContent = 'நேரலை இருப்பு உறுதி';
        else if (txt.includes('In Stock') || txt.includes('கவுண்டரில்')) el.textContent = 'கவுண்டரில் உள்ளது';
      });
      document.querySelectorAll('.card-top-tag').forEach(el => {
        const txt = el.textContent ? el.textContent.trim() : '';
        if (txt === 'IMFL Whisky' || txt === 'Whisky') el.textContent = 'விஸ்கி';
        else if (txt === 'IMFL Brandy' || txt === 'Brandy') el.textContent = 'பிராந்தி';
        else if (txt === 'IMFL Rum' || txt === 'Rum') el.textContent = 'ரம்';
        else if (txt === 'Beer') el.textContent = 'பீர்';
        else if (txt === 'Vodka' || txt === 'Pure Vodka') el.textContent = 'ஓட்கா';
        else if (txt === 'Premium Wine' || txt === 'Estate Wine') el.textContent = 'ஒயின்';
        else if (txt === 'Craft Gin' || txt === 'Gin') el.textContent = 'ஜின்';
      });
    } else {
      document.querySelectorAll('.mrp-micro-label').forEach(el => {
        el.textContent = 'Govt Printed MRP';
      });
      document.querySelectorAll('.btn-reserve-action span').forEach(el => {
        el.textContent = 'Reserve';
      });
      document.querySelectorAll('.card-bestseller-star').forEach(el => {
        el.textContent = '★ Top Seller';
      });
      document.querySelectorAll('.card-stock-pill span').forEach(el => {
        const txt = el.textContent || '';
        if (txt.includes('இருப்பு உறுதி') || txt.includes('Availability')) el.textContent = 'Availability not confirmed';
        else if (txt.includes('நேரலை') || txt.includes('Verified')) el.textContent = 'Verified Live Stock';
        else if (txt.includes('கவுண்டரில்') || txt.includes('In Stock')) el.textContent = 'In Stock at Counter';
      });
      document.querySelectorAll('.card-top-tag').forEach(el => {
        const txt = el.textContent ? el.textContent.trim() : '';
        if (txt === 'விஸ்கி') el.textContent = 'IMFL Whisky';
        else if (txt === 'பிராந்தி') el.textContent = 'IMFL Brandy';
        else if (txt === 'ரம்') el.textContent = 'IMFL Rum';
        else if (txt === 'பீர்') el.textContent = 'Beer';
        else if (txt === 'ஓட்கா') el.textContent = 'Vodka';
        else if (txt === 'ஒயின்') el.textContent = 'Premium Wine';
        else if (txt === 'ஜின்') el.textContent = 'Craft Gin';
      });
    }
  }

  function setupProductGridObserver() {
    if (typeof MutationObserver === 'undefined') return;
    const grid = document.getElementById('products-grid');
    if (!grid) return;
    if (grid._tasmacObserver) return;

    const observer = new MutationObserver(() => {
      if (currentLang === 'ta') {
        translateProductCards();
      }
    });

    observer.observe(grid, { childList: true });
    grid._tasmacObserver = observer;
  }

  function applyTranslations() {
    // 1. Elements with data-i18n
    document.querySelectorAll('[data-i18n]').forEach(el => {
      const key = el.getAttribute('data-i18n');
      if (key) {
        const text = t(key);
        if (text) el.textContent = text;
      }
    });

    // Translate placeholders with data-i18n-ph
    document.querySelectorAll('[data-i18n-ph]').forEach(el => {
      const key = el.getAttribute('data-i18n-ph');
      if (key) {
        const text = t(key);
        if (text) el.setAttribute('placeholder', text);
      }
    });

    // Translate titles with data-i18n-title
    document.querySelectorAll('[data-i18n-title]').forEach(el => {
      const key = el.getAttribute('data-i18n-title');
      if (key) {
        const text = t(key);
        if (text) el.setAttribute('title', text);
      }
    });

    // 2. Comprehensive Storefront & Top Shell Translations (Deterministic en & ta)
    applyDOMTranslation('.statutory-badge-pill', 'Government of Tamil Nadu', 'தமிழ்நாடு அரசு');
    applyDOMTranslation('.statutory-top-strip span:last-child', "Consumption of liquor is injurious to health. Be safe - don't drink and drive. Strictly 21+ only.", "மது அருந்துதல் உடல் நலத்திற்கு கேடானது. பாதுகாப்பாக இருங்கள் — மது அருந்திவிட்டு வாகனம் ஓட்டாதீர்கள். 21+ வயதுக்கு மட்டுமே.");
    applyDOMTranslation('.statutory-text-desktop', 'Official Government Reserve Concierge • Guaranteed Statutory MRP • Strictly 21+ Only', 'அரசு அதிகாரப்பூர்வ முன்பதிவு சேவை • நிலையான அரசு MRP • 21+ வயதுக்கு மட்டுமே');
    applyDOMTranslation('.statutory-text-mobile', 'Guaranteed Govt MRP • Strictly 21+ Only', 'நிலையான அரசு MRP • 21+ வயதுக்கு மட்டுமே');

    // Brand and Pickup Header
    applyDOMTranslation('.brand-sub', 'Express Retail', 'துரித விற்பனை');
    applyDOMTranslation('.location-sub', 'Pickup Counter', 'பெறும் கவுண்டர்');

    // Hero Headline & Subheadline
    applyDOMTranslation('.hero-headline', 'Direct State Spirits.<br>Exact Govt MRP. Zero Queue.', 'நேரடி மாநில மதுபானங்கள்.<br>சரியான அரசு MRP. வரிசையின்றி.', true);
    applyDOMTranslation('.hero-subhead', 'Browse verified Indian Made Foreign Liquor, cold craft beers, and imported reserves. Reserve online at exact government MRP with instant digital QR tokens for 2-minute express collection.', 'அரசு அங்கீகரித்த இந்திய தயாரிப்பு வெளிநாட்டு மதுபானங்கள், பீர் வகைகள் மற்றும் இறக்குமதி செய்யப்பட்ட பானங்களை முன்பதிவு செய்து கவுண்டரில் உடனடியாகப் பெறுங்கள்.');

    // Stat Cards
    applyDOMTranslation('.stat-cards-strip .stat-card-4rge:nth-child(1) .stat-card-label', 'EXCISE AUTHENTICITY', 'கலால் நம்பகத்தன்மை');
    applyDOMTranslation('.stat-cards-strip .stat-card-4rge:nth-child(1) .stat-card-value', '100% Genuine', '100% அசல்');
    applyDOMTranslation('.stat-cards-strip .stat-card-4rge:nth-child(1) .stat-card-hint', '<i data-lucide="check" style="width: 13px; height: 13px; color: var(--fp-state-success);"></i> State hologram & batch tracked', '<i data-lucide="check" style="width: 13px; height: 13px; color: var(--fp-state-success);"></i> மாநில ஹோலோகிராம் & தொகுதி சரிபார்ப்பு', true);

    applyDOMTranslation('.stat-cards-strip .stat-card-4rge:nth-child(2) .stat-card-label', 'STATUTORY PRICING', 'சட்டப்பூர்வ விலை');
    applyDOMTranslation('.stat-cards-strip .stat-card-4rge:nth-child(2) .stat-card-value', 'Printed MRP', 'நிலையான அரசு MRP');
    applyDOMTranslation('.stat-cards-strip .stat-card-4rge:nth-child(2) .stat-card-hint', '<i data-lucide="check" style="width: 13px; height: 13px; color: var(--fp-state-success);"></i> Zero counter surcharge enforced', '<i data-lucide="check" style="width: 13px; height: 13px; color: var(--fp-state-success);"></i> கூடுதல் கட்டணம் ஏதுமில்லை', true);

    applyDOMTranslation('.stat-cards-strip .stat-card-4rge:nth-child(3) .stat-card-label', 'CHENNAI NETWORK', 'சென்னை நெட்வொர்க்');
    applyDOMTranslation('.stat-cards-strip .stat-card-4rge:nth-child(3) .stat-card-value', '35 Outlets', '35 கடைகள்');
    applyDOMTranslation('.stat-cards-strip .stat-card-4rge:nth-child(3) .stat-card-hint', '<i data-lucide="check" style="width: 13px; height: 13px; color: var(--fp-state-success);"></i> Live GPS locator & cold storage', '<i data-lucide="check" style="width: 13px; height: 13px; color: var(--fp-state-success);"></i> நேரலை ஜிபிஎஸ் & குளிர்சாதனக் கிடங்கு', true);

    // Active Store Strip
    applyDOMTranslation('.store-pill-sub', 'ACTIVE FULFILLMENT COUNTER (GOVT MRP GUARANTEED)', 'செயலில் உள்ள விநியோக கவுண்டர் (அரசு MRP உத்தரவாதம்)');
    applyDOMTranslation('#hero-store-status span', 'Counter Ready • 12 PM – 10 PM', 'கவுண்டர் தயார் • மதியம் 12 – இரவு 10');
    applyDOMTranslation('.btn-switch-store-hero span', 'Switch Outlet (35 Chennai Counters)', 'கடையை மாற்றுக (35 சென்னை கடைகள்)');

    // Category Filter Chips (All 8 Categories)
    applyDOMTranslation('#category-pills button:nth-child(1) span:first-child', 'All Bottles', 'அனைத்து பாட்டில்கள்');
    applyDOMTranslation('#category-pills button:nth-child(2) span:first-child', 'Whisky & Scotch', 'விஸ்கி & ஸ்காட்ச்');
    applyDOMTranslation('#category-pills button:nth-child(3) span:first-child', 'French Brandy', 'பிரெஞ்சு பிராந்தி');
    applyDOMTranslation('#category-pills button:nth-child(4) span:first-child', 'Dark & Spiced Rum', 'டார்க் & ஸ்பைஸ்டு ரம்');
    applyDOMTranslation('#category-pills button:nth-child(5) span:first-child', 'Chilled Beers', 'பீர் வகைகள்');
    applyDOMTranslation('#category-pills button:nth-child(6) span:first-child', 'Pure Vodka', 'தூய ஓட்கா');
    applyDOMTranslation('#category-pills button:nth-child(7) span:first-child', 'Estate Wine', 'எஸ்டேட் ஒயின்');
    applyDOMTranslation('#category-pills button:nth-child(8) span:first-child', 'Craft Gin', 'கிராஃப்ட் ஜின்');

    // Search Placeholders
    applyPlaceholderTranslation('#product-search-input', 'Search 26 Govt Registered brands, Scotch, Single Malts...', '26 அரசு பதிவு பிராண்டுகள், ஸ்காட்ச், சிங்கிள் மால்ட்களைத் தேடுக...');
    applyPlaceholderTranslation('#map-outlet-search', 'Search Chennai area, road, or shop # (e.g. Velachery, T. Nagar, 1085)...', 'சென்னை பகுதி, சாலை, அல்லது கடை எண் தேடுக...');

    // Sort Dropdown
    applyDOMTranslation('#sort-select-menu .custom-select-item[data-value="popular"] span', 'Sort: Most Popular', 'வரிசைப்படுத்து: பிரபலமானவை');
    applyDOMTranslation('#sort-select-menu .custom-select-item[data-value="price-asc"] span', 'Price: Low to High', 'விலை: குறைந்தது முதல் அதிகம்');
    applyDOMTranslation('#sort-select-menu .custom-select-item[data-value="price-desc"] span', 'Price: High to Low', 'விலை: அதிகம் முதல் குறைந்தது');
    applyDOMTranslation('#sort-select-menu .custom-select-item[data-value="rating"] span', 'Highest Rated', 'உயர்ந்த மதிப்பீடு');

    const sortLabelEl = document.getElementById('sort-select-current-label');
    if (sortLabelEl) {
      const SORT_LABELS = {
        'popular': { en: 'Sort: Most Popular', ta: 'வரிசைப்படுத்து: பிரபலமானவை' },
        'price-asc': { en: 'Price: Low to High', ta: 'விலை: குறைந்தது முதல் அதிகம்' },
        'price-desc': { en: 'Price: High to Low', ta: 'விலை: அதிகம் முதல் குறைந்தது' },
        'rating': { en: 'Highest Rated', ta: 'உயர்ந்த மதிப்பீடு' }
      };

      let currentVal = sortLabelEl.getAttribute('data-sort-val') || (typeof sortMode !== 'undefined' ? sortMode : null) || localStorage.getItem('tasmac-pref-sort');

      if (!currentVal || !SORT_LABELS[currentVal]) {
        const txt = (sortLabelEl.textContent || '').trim();
        if (txt.includes('Popular') || txt.includes('பிரபலமானவை')) currentVal = 'popular';
        else if (txt.includes('High to Low') || txt.includes('அதிகம்')) currentVal = 'price-desc';
        else if (txt.includes('Low to High') || txt.includes('குறைந்தது')) currentVal = 'price-asc';
        else if (txt.includes('Rated') || txt.includes('மதிப்பீடு') || txt.includes('உயர்ந்த')) currentVal = 'rating';
        else currentVal = 'popular';
      }

      sortLabelEl.setAttribute('data-sort-val', currentVal);
      const entry = SORT_LABELS[currentVal] || SORT_LABELS['popular'];
      sortLabelEl.textContent = currentLang === 'ta' ? entry.ta : entry.en;
    }

    // Catalog count badge
    const countBadge = document.getElementById('catalog-count-badge');
    if (countBadge) {
      const match = (countBadge.textContent || '').match(/\d+/);
      const num = match ? match[0] : '';
      if (currentLang === 'ta') {
        countBadge.textContent = num ? `${num} பொருட்கள் உள்ளன` : 'பொருட்கள் உள்ளன';
      } else {
        countBadge.textContent = num ? `${num} items found` : 'Items found';
      }
    }

    // Header Action Buttons (non-data-i18n buttons)
    applyDOMTranslation('#nav-login-btn span', 'Sign In', 'உள்நுழைக');
    applyDOMTranslation('.cart-pill-bubble .cart-label', 'Cart', 'கூடை');
    applyDOMTranslation('#header-cart-btn .cart-label', 'Cart', 'கூடை');

    // Floating Cart Bar
    applyDOMTranslation('.floating-cart-bar button span', 'Reserve & Get Token', 'முன்பதிவு செய்து டோக்கன் பெறுக');
    applyDOMTranslation('.cart-float-info span:last-child', '(Govt Printed MRP)', '(அரசு அச்சிட்ட MRP)');

    // Map Modal Elements
    applyDOMTranslation('.map-modal-badge span:last-child', 'Chennai District Live Network', 'சென்னை மாவட்ட நேரலை நெட்வொர்க்');
    applyDOMTranslation('.map-modal-title', 'Live TASMAC Store Locator — Chennai', 'நேரலை டாஸ்மாக் கடை அமைவிடம் — சென்னை');
    applyDOMTranslation('.map-modal-subtitle', 'Browse 35 official Govt Retail & Elite Outlets across Chennai with real-time stock & Govt MRP', 'சென்னை முழுவதும் உள்ள 35 அரசு சில்லறை & எலைட் கடைகளை உண்மையான இருப்பு மற்றும் அரசு MRP உடன் பார்க்கவும்');
    applyDOMTranslation('#btn-gps-locate span', 'Locate Near Me', 'அருகிலுள்ள கடையைக் கண்டறிக');

    // Cart Page Elements
    applyDOMTranslation('.cart-header-title span:first-child', 'Your Cart & Express Token', 'உங்கள் கூடை & விரைவு டோக்கன்');
    applyDOMTranslation('.cart-header-badge span', 'Direct Counter Reservation', 'நேரடி கவுண்டர் முன்பதிவு');
    applyDOMTranslation('.store-summary-left div > span:first-child', 'Pickup at: ', 'பெறும் கடை: ');
    applyDOMTranslation('.store-change-btn span', 'Change Outlet ▾', 'கடையை மாற்றுக ▾');
    applyDOMTranslation('.cart-total-label', 'Total Payable at Counter:', 'கவுண்டரில் செலுத்த வேண்டிய தொகை:');
    applyDOMTranslation('#btn-submit-reservation span', 'Confirm & Generate Digital Token', 'உறுதிசெய்து டோக்கன் பெறுக');
    applyDOMTranslation('#btn-review-reservation span', 'Review Reservation Summary', 'முன்பதிவு சுருக்கத்தை சரிபார்க்கவும்');
    applyDOMTranslation('a.btn-return-store span.btn-return-text-full', 'Return to Store', 'கடைக்குத் திரும்பு');
    applyDOMTranslation('.cart-empty-box .btn-explore-catalog span', 'Explore Bottle Catalog', 'தயாரிப்புகளைப் பார்வையிடவும்');
    applyDOMTranslation('.cart-item-remove', 'Remove', 'நீக்கு');
    applyDOMTranslation('.cart-empty-title', 'Your Cart is Empty', 'உங்கள் கூடை காலியாக உள்ளது');
    applyDOMTranslation('.cart-empty-desc', "You haven't reserved any bottles yet. Browse our verified stock of single malts, fine whiskeys, beers and rums.", 'நீங்கள் இன்னும் எந்தப் பாட்டில்களையும் முன்பதிவு செய்யவில்லை. அரசு அங்கீகரித்த எங்கள் தயாரிப்புகளைப் பார்வையிடவும்.');

    // Login Page Elements
    const signupEl = document.getElementById('form-signup');
    const isSignUp = Boolean(signupEl && signupEl.style && signupEl.style.display !== 'none');
    if (isSignUp) {
      applyDOMTranslation('#auth-main-title', 'Create Account', 'புதிய கணக்கு உருவாக்குக');
      applyDOMTranslation('#auth-main-subtitle', 'Register your account to access your cart and reservations', 'முன்பதிவு செய்ய புதிய கணக்கை உருவாக்கவும்');
    } else {
      applyDOMTranslation('#auth-main-title', 'Sign In', 'உள்நுழைக');
      applyDOMTranslation('#auth-main-subtitle', 'Enter your email and password to access your cart', 'உங்கள் கூடை மற்றும் முன்பதிவுகளைக் காண உள்நுழையவும்');
    }
    applyDOMTranslation('a.btn-return-store span', 'Return to Store', 'கடைக்குத் திரும்பு');

    // 3. Dynamic Product Cards
    translateProductCards();

    // 4. Update language switch button active state
    const btnEn = document.getElementById('lang-switch-en');
    const btnTa = document.getElementById('lang-switch-ta');
    if (btnEn && btnTa) {
      if (currentLang === 'ta') {
        btnEn.classList.remove('active');
        btnTa.classList.add('active');
      } else {
        btnTa.classList.remove('active');
        btnEn.classList.add('active');
      }
    }
  }

  function setLanguage(lang) {
    if (lang !== 'en' && lang !== 'ta') return;
    currentLang = lang;
    try {
      localStorage.setItem('tasmac-lang', lang);
    } catch (e) {}
    applyTranslations();

    if (typeof window.renderProductsGrid === 'function') {
      try { window.renderProductsGrid(); } catch(e) {}
    }
    translateProductCards();

    // Trigger custom event so other components can re-render if needed
    window.dispatchEvent(new CustomEvent('tasmac-lang-changed', { detail: { lang: currentLang } }));
  }

  function getLanguage() {
    return currentLang;
  }

  // Inject language toggle widget in header safely (On the other side: Right Actions)
  function injectLanguageSwitcher() {
    if (document.getElementById('tasmac-lang-switcher')) return;

    // Target the right-side actions container
    const rightContainer = document.querySelector('.header-right-actions') || 
                           document.querySelector('.header-right') || 
                           document.querySelector('.header-container > div:last-child');

    if (!rightContainer) return;

    const switcher = document.createElement('div');
    switcher.id = 'tasmac-lang-switcher';
    switcher.className = 'tasmac-lang-pill';
    switcher.innerHTML = `
      <button type="button" id="lang-switch-en" class="lang-pill-btn ${currentLang === 'en' ? 'active' : ''}" onclick="window.TASMAC_I18N.setLanguage('en')">EN</button>
      <span class="lang-pill-sep">|</span>
      <button type="button" id="lang-switch-ta" class="lang-pill-btn ${currentLang === 'ta' ? 'active' : ''}" onclick="window.TASMAC_I18N.setLanguage('ta')">தமிழ்</button>
    `;

    // Add minimal scoped styles for the switcher
    if (!document.getElementById('tasmac-lang-style')) {
      const style = document.createElement('style');
      style.id = 'tasmac-lang-style';
      style.textContent = `
        .tasmac-lang-pill {
          display: inline-flex;
          align-items: center;
          gap: 2px;
          background: var(--card, #ffffff);
          border: 1px solid var(--border, #e2e8f0);
          border-radius: 9999px;
          padding: 2px 6px;
          height: 30px;
          box-shadow: 0 1px 2px rgba(0,0,0,0.04);
          font-family: var(--fp-font-mono, monospace);
          font-size: 11.5px;
          font-weight: 600;
          color: var(--muted-foreground, #64748b);
          user-select: none;
          flex-shrink: 0;
        }
        .lang-pill-btn {
          background: transparent;
          border: none;
          padding: 2px 6px;
          font-size: 11px;
          font-weight: 600;
          color: var(--muted-foreground, #64748b);
          cursor: pointer;
          border-radius: 9999px;
          transition: all 0.15s ease;
          font-family: inherit;
        }
        .lang-pill-btn:hover {
          color: var(--foreground, #0f172a);
        }
        .lang-pill-btn.active {
          background: var(--primary, #ea580c);
          color: #ffffff !important;
          font-weight: 700;
        }
        .lang-pill-sep {
          color: var(--border, #cbd5e1);
          font-size: 10px;
        }
      `;
      document.head.appendChild(style);
    }

    // Place language switch right after cart button on the right side
    const cartBubble = rightContainer.querySelector('.cart-pill-bubble');
    if (cartBubble) {
      if (cartBubble.nextSibling) {
        rightContainer.insertBefore(switcher, cartBubble.nextSibling);
      } else {
        rightContainer.appendChild(switcher);
      }
    } else if (rightContainer.lastChild) {
      rightContainer.appendChild(switcher);
    } else {
      rightContainer.appendChild(switcher);
    }
  }

  // Initialize on DOM ready
  function init() {
    injectLanguageSwitcher();
    setupProductGridObserver();
    applyTranslations();
    setTimeout(() => {
      applyTranslations();
      setupProductGridObserver();
    }, 150);
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }

  window.TASMAC_I18N = {
    t,
    setLanguage,
    getLanguage,
    applyTranslations,
    translateProductCards
  };
})();

