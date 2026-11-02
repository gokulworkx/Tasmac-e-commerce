/**
 * TASMAC RESERVE — Online Doorstep Delivery Engine (Swiggy / Zomato Style)
 * 
 * Features:
 * - Doorstep delivery partner assignment & dispatch
 * - Real-time Leaflet route tracking with animated delivery rider scooter (🛵)
 * - Assigned Delivery Executive profile card (Photo, Name, Bike No, Rating, Call, Chat)
 * - 5-Stage Live Order Stepper (Confirmed -> Partner Assigned -> Picked Up -> Out for Delivery -> Delivered)
 * - 4-Digit Delivery Verification OTP (Age verification & tamper seal safety)
 * - Complete Order Cancellation capability with reasons ("Changed my mind")
 * - Simulated Rider Calling & Live Messaging dialogs
 * - Persistent top navigation bar & floating live delivery tracker across all pages
 * - Demo fast-forward controls for testing all stages
 */

(function () {
  'use strict';

  const STORAGE_KEY = 'tasmac_active_delivery';

  // Sample verified fleet riders for realistic assignment
  const RIDERS_POOL = [
    {
      name: "Rajesh Kumar",
      phone: "+91 98401 24890",
      rating: "4.9 ★",
      deliveries: "1,420+ safe deliveries",
      vehicle: "Honda Activa 6G • TN 09 BK 2914",
      badge: "Govt 21+ Verified Fleet Rider",
      avatar: "RK"
    },
    {
      name: "Vignesh Sundaram",
      phone: "+91 98842 51630",
      rating: "4.95 ★",
      deliveries: "2,150+ safe deliveries",
      vehicle: "TVS Jupiter 125 • TN 02 CJ 8192",
      badge: "Govt 21+ Verified Fleet Rider",
      avatar: "VS"
    },
    {
      name: "Karthik Raja",
      phone: "+91 97910 88472",
      rating: "4.88 ★",
      deliveries: "980+ safe deliveries",
      vehicle: "Hero Splendor Pro • TN 10 AW 4401",
      badge: "Govt 21+ Verified Fleet Rider",
      avatar: "KR"
    }
  ];

  let deliveryMapInstance = null;
  let storeMarker = null;
  let homeMarker = null;
  let riderMarker = null;
  let routePolyline = null;
  let simulationTimer = null;
  let callAudioTimer = null;

  // Retrieve active delivery order from storage with resilient history fallback
  function getActiveDelivery(orderId) {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (raw) {
        const d = JSON.parse(raw);
        if (d && (!orderId || d.orderId === orderId || d.token === orderId)) {
          return d;
        }
      }
    } catch (e) {}

    // Resilient Fallback: Search user reservation history for latest delivery order
    try {
      const userJson = localStorage.getItem('tasmac-user');
      if (userJson) {
        const u = JSON.parse(userJson);
        const userKey = `tasmac_user_reservations_${u.id || u.phone || 'auth'}`;
        const historyRaw = localStorage.getItem(userKey);
        if (historyRaw) {
          const list = JSON.parse(historyRaw);
          if (Array.isArray(list)) {
            const found = orderId 
              ? list.find(r => r.token === orderId) 
              : list.find(r => (r.orderType === 'delivery' || r.isDelivery) && r.status !== 'cancelled');
            if (found) {
              const restored = {
                orderId: found.token,
                token: found.token,
                orderType: 'delivery',
                isDelivery: true,
                stage: found.status === 'delivered' ? 4 : found.status === 'cancelled' ? 4 : 2,
                status: found.status || 'pending',
                etaMinutes: 20,
                otp: '4829',
                rider: RIDERS_POOL[0],
                store: { 
                  name: found.outlet_name || 'Shop #1085 (Elite)', 
                  area: 'Panagal Park, T. Nagar', 
                  lat: 13.0418, 
                  lng: 80.2341 
                },
                destination: {
                  name: found.customer_name || 'Patron',
                  phone: found.customer_phone || '',
                  flat: 'Flat 4B, Emerald Heights',
                  street: 'G.N. Chetty Road, T. Nagar',
                  area: 'Chennai',
                  instructions: 'Call on arrival',
                  lat: 13.0560,
                  lng: 80.2520
                },
                items: found.items || [],
                pricing: { total: found.total_amount || 0 }
              };
              return restored;
            }
          }
        }
      }
    } catch(e) {}

    return null;
  }

  function saveActiveDelivery(delivery) {
    try {
      if (delivery) {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(delivery));
      } else {
        localStorage.removeItem(STORAGE_KEY);
      }
    } catch (e) {}
    renderFloatingBar();
  }

  // Generate a realistic 4-digit security OTP
  function generateOtp() {
    return Math.floor(1000 + Math.random() * 9000).toString();
  }

  // Inject Styles for Swiggy / Zomato Delivery System & Order Cancellation
  function injectDeliveryStyles() {
    if (document.getElementById('tasmac-delivery-styles')) return;

    const style = document.createElement('style');
    style.id = 'tasmac-delivery-styles';
    style.textContent = `
      /* =========================================================================
         SWIGGY / ZOMATO STYLE DELIVERY UI & TRACKER
         ========================================================================= */
      
      /* Mode Tabs in Cart Checkout */
      .fulfillment-mode-bar {
        display: grid;
        grid-template-columns: 1fr 1fr;
        gap: 8px;
        background: #f1f5f9;
        padding: 5px;
        border-radius: 14px;
        margin-bottom: 20px;
        border: 1px solid #e2e8f0;
      }
      .fulfillment-mode-btn {
        display: flex;
        align-items: center;
        gap: 10px;
        padding: 10px 14px;
        border-radius: 10px;
        border: none;
        background: transparent;
        cursor: pointer;
        text-align: left;
        transition: all 0.2s cubic-bezier(0.16, 1, 0.3, 1);
        color: #64748b;
      }
      .fulfillment-mode-btn.active {
        background: #ffffff;
        color: #0f172a;
        box-shadow: 0 4px 12px rgba(0, 0, 0, 0.06);
        border: 1px solid #e2e8f0;
      }
      .fulfillment-mode-btn.active .mode-icon-box {
        background: #fff7ed;
        color: #ea580c;
      }
      .mode-icon-box {
        width: 34px;
        height: 34px;
        border-radius: 8px;
        background: #e2e8f0;
        display: flex;
        align-items: center;
        justify-content: center;
        flex-shrink: 0;
        color: #64748b;
        transition: all 0.2s;
      }
      .mode-title {
        display: block;
        font-weight: 700;
        font-size: 13px;
        line-height: 1.2;
      }
      .mode-sub {
        display: block;
        font-size: 11px;
        color: #64748b;
        margin-top: 2px;
      }

      /* Delivery Address Form Card */
      .delivery-form-card {
        background: #ffffff;
        border: 1px solid #e2e8f0;
        border-radius: 14px;
        padding: 16px;
        margin-bottom: 18px;
      }
      .delivery-form-header {
        display: flex;
        align-items: center;
        justify-content: space-between;
        margin-bottom: 14px;
      }
      .delivery-form-title {
        font-size: 13.5px;
        font-weight: 750;
        color: #0f172a;
        display: flex;
        align-items: center;
        gap: 7px;
      }
      .btn-auto-locate {
        display: inline-flex;
        align-items: center;
        gap: 5px;
        background: #fff7ed;
        color: #ea580c;
        border: 1px solid #ffedd5;
        border-radius: 20px;
        padding: 4px 10px;
        font-size: 11px;
        font-weight: 650;
        cursor: pointer;
        transition: all 0.15s;
      }
      .btn-auto-locate:hover {
        background: #ea580c;
        color: #ffffff;
      }

      /* Delivery Tip Selector */
      .delivery-tip-bar {
        display: flex;
        align-items: center;
        gap: 8px;
        margin-top: 10px;
        flex-wrap: wrap;
      }
      .tip-chip {
        padding: 6px 12px;
        border-radius: 20px;
        border: 1px solid #e2e8f0;
        background: #ffffff;
        font-size: 12px;
        font-weight: 600;
        color: #475569;
        cursor: pointer;
        transition: all 0.15s;
      }
      .tip-chip.active {
        background: #0f172a;
        color: #ffffff;
        border-color: #0f172a;
      }

      /* Delivery Bill Summary */
      .delivery-bill-card {
        background: #f8fafc;
        border: 1px solid #e2e8f0;
        border-radius: 12px;
        padding: 14px;
        margin-bottom: 16px;
        font-size: 12.5px;
      }
      .bill-row {
        display: flex;
        justify-content: space-between;
        align-items: center;
        padding: 4px 0;
        color: #475569;
      }
      .bill-row.total {
        margin-top: 8px;
        padding-top: 8px;
        border-top: 1px dashed #cbd5e1;
        font-weight: 800;
        font-size: 14px;
        color: #0f172a;
      }

      /* =========================================================================
         LIVE DELIVERY TRACKER MODAL (SWIGGY / ZOMATO STYLE)
         ========================================================================= */
      .tasmac-tracker-modal {
        position: fixed;
        inset: 0;
        z-index: 10000;
        background: rgba(15, 23, 42, 0.75);
        backdrop-filter: blur(8px);
        display: none;
        align-items: center;
        justify-content: center;
        padding: 16px;
        box-sizing: border-box;
      }
      .tasmac-tracker-modal.open {
        display: flex;
        animation: trackerModalFade 0.25s ease-out;
      }
      @keyframes trackerModalFade {
        from { opacity: 0; transform: scale(0.98); }
        to { opacity: 1; transform: scale(1); }
      }
      .tasmac-tracker-container {
        background: #ffffff;
        width: 100%;
        max-width: 840px;
        max-height: 92vh;
        border-radius: 20px;
        display: flex;
        flex-direction: column;
        overflow: hidden;
        box-shadow: 0 25px 60px -15px rgba(0, 0, 0, 0.35);
        border: 1px solid #e2e8f0;
        position: relative;
        font-family: 'Plus Jakarta Sans', system-ui, -apple-system, sans-serif;
      }

      /* Tracker Top Header */
      .tracker-top-header {
        padding: 14px 20px;
        border-bottom: 1px solid #f1f5f9;
        display: flex;
        align-items: center;
        justify-content: space-between;
        background: #ffffff;
        gap: 12px;
      }
      .tracker-order-id-badge {
        font-family: 'JetBrains Mono', monospace;
        font-size: 11px;
        font-weight: 700;
        background: #f1f5f9;
        padding: 4px 9px;
        border-radius: 6px;
        color: #475569;
        border: 1px solid #e2e8f0;
      }
      .tracker-eta-badge {
        display: inline-flex;
        align-items: center;
        gap: 6px;
        background: #ecfdf5;
        border: 1px solid #a7f3d0;
        color: #065f46;
        padding: 4px 12px;
        border-radius: 20px;
        font-size: 12px;
        font-weight: 700;
      }
      .tracker-pulse-green {
        width: 8px;
        height: 8px;
        border-radius: 50%;
        background: #10b981;
        box-shadow: 0 0 0 0 rgba(16, 185, 129, 0.7);
        animation: trackerPulse 1.8s infinite;
      }
      @keyframes trackerPulse {
        0% { transform: scale(0.95); box-shadow: 0 0 0 0 rgba(16, 185, 129, 0.7); }
        70% { transform: scale(1); box-shadow: 0 0 0 8px rgba(16, 185, 129, 0); }
        100% { transform: scale(0.95); box-shadow: 0 0 0 0 rgba(16, 185, 129, 0); }
      }
      .tracker-close-btn {
        width: 32px;
        height: 32px;
        border-radius: 50%;
        background: #f1f5f9;
        border: 1px solid #e2e8f0;
        cursor: pointer;
        display: flex;
        align-items: center;
        justify-content: center;
        color: #64748b;
        transition: all 0.15s;
      }
      .tracker-close-btn:hover {
        background: #0f172a;
        color: #ffffff;
      }

      /* Cancel Order Buttons */
      .btn-cancel-delivery-header {
        display: inline-flex;
        align-items: center;
        gap: 5px;
        background: #fff1f2;
        color: #e11d48;
        border: 1px solid #fecdd3;
        border-radius: 8px;
        padding: 5px 11px;
        font-size: 11.5px;
        font-weight: 700;
        cursor: pointer;
        transition: all 0.15s;
      }
      .btn-cancel-delivery-header:hover {
        background: #e11d48;
        color: #ffffff;
        border-color: #e11d48;
      }

      .btn-cancel-delivery-main {
        width: 100%;
        display: flex;
        align-items: center;
        justify-content: center;
        gap: 7px;
        background: #fff1f2;
        color: #e11d48;
        border: 1.5px dashed #fecdd3;
        border-radius: 10px;
        padding: 10px 14px;
        font-size: 12.5px;
        font-weight: 750;
        cursor: pointer;
        transition: all 0.15s;
      }
      .btn-cancel-delivery-main:hover {
        background: #ffe4e6;
        border-color: #fda4af;
      }

      /* Cancellation Reason Choices */
      .cancel-reason-label {
        display: flex;
        align-items: center;
        gap: 10px;
        padding: 10px 12px;
        border: 1px solid #e2e8f0;
        border-radius: 10px;
        background: #ffffff;
        font-size: 13px;
        color: #334155;
        cursor: pointer;
        transition: all 0.15s;
      }
      .cancel-reason-label:hover {
        background: #f8fafc;
        border-color: #cbd5e1;
      }
      .cancel-reason-label input[type="radio"] {
        accent-color: #e11d48;
        width: 16px;
        height: 16px;
      }

      /* Split Layout: Map & Stepper Sidebar */
      .tracker-body-split {
        display: grid;
        grid-template-columns: 1.15fr 1fr;
        flex: 1;
        overflow: hidden;
        min-height: 480px;
      }
      @media (max-width: 768px) {
        .tracker-body-split {
          grid-template-columns: 1fr;
          overflow-y: auto;
        }
      }

      /* Interactive Live Map */
      .tracker-map-pane {
        position: relative;
        background: #f8fafc;
        border-right: 1px solid #f1f5f9;
        min-height: 280px;
      }
      #tasmac-delivery-live-map {
        width: 100%;
        height: 100%;
        min-height: 280px;
      }
      .tracker-map-overlay-status {
        position: absolute;
        top: 14px;
        left: 14px;
        right: 14px;
        z-index: 500;
        background: rgba(255, 255, 255, 0.95);
        backdrop-filter: blur(6px);
        padding: 10px 14px;
        border-radius: 12px;
        box-shadow: 0 6px 18px rgba(0, 0, 0, 0.08);
        border: 1px solid rgba(226, 232, 240, 0.8);
        display: flex;
        align-items: center;
        justify-content: space-between;
      }

      /* Right Side: Rider Details & Stepper */
      .tracker-info-pane {
        padding: 20px;
        overflow-y: auto;
        display: flex;
        flex-direction: column;
        gap: 15px;
        background: #ffffff;
      }

      /* Delivery Rider Profile Card */
      .tracker-rider-card {
        background: #ffffff;
        border: 1px solid #e2e8f0;
        border-radius: 14px;
        padding: 14px;
        box-shadow: 0 4px 14px rgba(0, 0, 0, 0.03);
      }
      .rider-card-top {
        display: flex;
        align-items: center;
        justify-content: space-between;
        gap: 12px;
      }
      .rider-avatar-wrap {
        position: relative;
      }
      .rider-avatar-circle {
        width: 46px;
        height: 46px;
        border-radius: 50%;
        background: linear-gradient(135deg, #ea580c, #c2410c);
        color: #ffffff;
        font-weight: 750;
        font-size: 16px;
        display: flex;
        align-items: center;
        justify-content: center;
        box-shadow: 0 4px 10px rgba(234, 88, 12, 0.3);
      }
      .rider-verified-dot {
        position: absolute;
        bottom: 0;
        right: 0;
        width: 14px;
        height: 14px;
        border-radius: 50%;
        background: #10b981;
        border: 2px solid #ffffff;
      }
      .rider-details {
        flex: 1;
      }
      .rider-name-title {
        font-size: 14.5px;
        font-weight: 750;
        color: #0f172a;
        display: flex;
        align-items: center;
        gap: 6px;
      }
      .rider-rating-pill {
        display: inline-flex;
        align-items: center;
        gap: 3px;
        background: #ecfdf5;
        color: #047857;
        font-size: 11px;
        font-weight: 700;
        padding: 1px 6px;
        border-radius: 6px;
      }
      .rider-sub-info {
        font-size: 11.5px;
        color: #64748b;
        margin-top: 2px;
      }
      .rider-actions-bar {
        display: grid;
        grid-template-columns: 1fr 1fr;
        gap: 8px;
        margin-top: 12px;
        padding-top: 12px;
        border-top: 1px solid #f1f5f9;
      }
      .btn-rider-action {
        display: flex;
        align-items: center;
        justify-content: center;
        gap: 6px;
        padding: 8px 12px;
        border-radius: 10px;
        font-size: 12px;
        font-weight: 650;
        cursor: pointer;
        transition: all 0.15s;
        border: 1px solid #e2e8f0;
        background: #f8fafc;
        color: #334155;
      }
      .btn-rider-action:hover {
        background: #0f172a;
        color: #ffffff;
        border-color: #0f172a;
      }

      /* OTP Security Card */
      .tracker-otp-card {
        background: #fff7ed;
        border: 1px solid #ffedd5;
        border-radius: 12px;
        padding: 12px 16px;
        display: flex;
        align-items: center;
        justify-content: space-between;
      }
      .tracker-otp-digits {
        font-family: 'JetBrains Mono', monospace;
        font-size: 20px;
        font-weight: 850;
        letter-spacing: 0.25em;
        color: #ea580c;
        background: #ffffff;
        padding: 4px 12px;
        border-radius: 8px;
        border: 1.5px dashed #fdba74;
      }

      /* 5-Step Order Journey Stepper */
      .tracker-stepper {
        display: flex;
        flex-direction: column;
        gap: 12px;
        position: relative;
        padding-left: 6px;
      }
      .step-item {
        display: flex;
        align-items: flex-start;
        gap: 12px;
        position: relative;
      }
      .step-item:not(:last-child)::after {
        content: '';
        position: absolute;
        top: 22px;
        left: 11px;
        width: 2px;
        height: calc(100% + 2px);
        background: #e2e8f0;
      }
      .step-item.completed:not(:last-child)::after {
        background: #10b981;
      }
      .step-indicator {
        width: 24px;
        height: 24px;
        border-radius: 50%;
        background: #ffffff;
        border: 2px solid #cbd5e1;
        display: flex;
        align-items: center;
        justify-content: center;
        font-size: 11px;
        font-weight: 750;
        color: #94a3b8;
        flex-shrink: 0;
        z-index: 2;
        transition: all 0.2s;
      }
      .step-item.completed .step-indicator {
        background: #10b981;
        border-color: #10b981;
        color: #ffffff;
      }
      .step-item.active .step-indicator {
        background: #ea580c;
        border-color: #ea580c;
        color: #ffffff;
        box-shadow: 0 0 0 4px rgba(234, 88, 12, 0.2);
      }
      .step-text {
        flex: 1;
      }
      .step-title {
        font-size: 13px;
        font-weight: 700;
        color: #64748b;
      }
      .step-item.active .step-title,
      .step-item.completed .step-title {
        color: #0f172a;
      }
      .step-desc {
        font-size: 11.5px;
        color: #94a3b8;
        margin-top: 1px;
      }
      .step-item.active .step-desc {
        color: #ea580c;
        font-weight: 600;
      }

      /* Demo Controls for Testing */
      .tracker-demo-bar {
        background: #f8fafc;
        border-top: 1px solid #f1f5f9;
        padding: 10px 20px;
        display: flex;
        align-items: center;
        justify-content: space-between;
        gap: 8px;
        flex-wrap: wrap;
        font-size: 11.5px;
      }
      .demo-chip-btn {
        background: #ffffff;
        border: 1px solid #cbd5e1;
        border-radius: 6px;
        padding: 3px 8px;
        font-size: 11px;
        font-weight: 600;
        color: #334155;
        cursor: pointer;
        transition: all 0.15s;
      }
      .demo-chip-btn:hover {
        background: #0f172a;
        color: #ffffff;
      }

      /* Floating Bottom Delivery Bar (Persistent on all pages) */
      .tasmac-floating-delivery-bar {
        position: fixed;
        bottom: 24px;
        right: 24px;
        z-index: 99999;
        background: #0f172a;
        color: #ffffff;
        border-radius: 50px;
        padding: 10px 18px 10px 14px;
        display: none;
        align-items: center;
        gap: 12px;
        box-shadow: 0 10px 30px rgba(0, 0, 0, 0.35);
        border: 1.5px solid rgba(234, 88, 12, 0.4);
        cursor: pointer;
        animation: floatBarIn 0.3s cubic-bezier(0.16, 1, 0.3, 1);
        font-family: 'Plus Jakarta Sans', system-ui, sans-serif;
      }
      @keyframes floatBarIn {
        from { transform: translateY(40px); opacity: 0; }
        to { transform: translateY(0); opacity: 1; }
      }
      .tasmac-floating-delivery-bar:hover {
        transform: translateY(-2px);
        box-shadow: 0 14px 34px rgba(0, 0, 0, 0.45);
      }
      .float-scooter-icon {
        width: 34px;
        height: 34px;
        border-radius: 50%;
        background: #ea580c;
        display: flex;
        align-items: center;
        justify-content: center;
        font-size: 16px;
      }

      /* Custom Leaflet Marker Pins */
      .leaflet-rider-scooter-pin {
        display: flex;
        align-items: center;
        justify-content: center;
        width: 36px;
        height: 36px;
        border-radius: 50%;
        background: #0f172a;
        border: 2px solid #ea580c;
        color: #ffffff;
        font-size: 18px;
        box-shadow: 0 4px 12px rgba(0, 0, 0, 0.3);
        animation: riderBounce 1.5s ease-in-out infinite;
      }
      @keyframes riderBounce {
        0%, 100% { transform: translateY(0); }
        50% { transform: translateY(-3px); }
      }
      .leaflet-dest-home-pin {
        display: flex;
        align-items: center;
        justify-content: center;
        width: 32px;
        height: 32px;
        border-radius: 50%;
        background: #10b981;
        border: 2px solid #ffffff;
        color: #ffffff;
        box-shadow: 0 4px 12px rgba(16, 185, 129, 0.4);
      }
      .leaflet-store-origin-pin {
        display: flex;
        align-items: center;
        justify-content: center;
        width: 32px;
        height: 32px;
        border-radius: 50%;
        background: #ea580c;
        border: 2px solid #ffffff;
        color: #ffffff;
        box-shadow: 0 4px 12px rgba(234, 88, 12, 0.4);
      }

      /* Call, Chat & Cancel Dialogs */
      .tasmac-comm-dialog {
        position: fixed;
        inset: 0;
        z-index: 10010;
        background: rgba(15, 23, 42, 0.8);
        backdrop-filter: blur(6px);
        display: none;
        align-items: center;
        justify-content: center;
        padding: 16px;
      }
      .tasmac-comm-dialog.open {
        display: flex;
      }
      .comm-card {
        background: #ffffff;
        border-radius: 18px;
        width: 100%;
        max-width: 440px;
        overflow: hidden;
        box-shadow: 0 20px 45px rgba(0, 0, 0, 0.25);
        border: 1px solid #e2e8f0;
        font-family: 'Plus Jakarta Sans', system-ui, sans-serif;
      }
      .comm-card-header {
        padding: 16px 20px;
        border-bottom: 1px solid #f1f5f9;
        display: flex;
        align-items: center;
        justify-content: space-between;
      }
      .comm-card-body {
        padding: 20px;
      }
      .calling-wave-box {
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: center;
        padding: 20px 0;
      }
      .calling-avatar-ring {
        width: 80px;
        height: 80px;
        border-radius: 50%;
        background: #ea580c;
        color: #ffffff;
        display: flex;
        align-items: center;
        justify-content: center;
        font-size: 28px;
        font-weight: 750;
        animation: callPulse 1.4s infinite;
      }
      @keyframes callPulse {
        0% { box-shadow: 0 0 0 0 rgba(234, 88, 12, 0.6); }
        70% { box-shadow: 0 0 0 20px rgba(234, 88, 12, 0); }
        100% { box-shadow: 0 0 0 0 rgba(234, 88, 12, 0); }
      }
    `;

    document.head.appendChild(style);
  }

  // Update navbar tracking button if present
  function updateNavTrackingButton(delivery) {
    const navBtn = document.getElementById('nav-btn-track-order');
    const navText = document.getElementById('nav-track-order-text');
    if (!navBtn) return;

    if (delivery && delivery.status !== 'cancelled' && delivery.stage < 4) {
      navBtn.style.display = 'inline-flex';
      if (navText) {
        const shortId = (delivery.orderId || '').replace('TSM-DLV-', '#');
        navText.textContent = `Track Order (${shortId})`;
      }
    } else {
      navBtn.style.display = 'none';
    }
  }

  // Inject UI modal structure for Live Tracker, Floating Bar, Call, Chat & Cancel modals
  function initDeliveryUI() {
    injectDeliveryStyles();

    // 1. Floating Delivery Tracker Bar
    if (!document.getElementById('tasmac-floating-delivery-bar')) {
      const floatBar = document.createElement('div');
      floatBar.id = 'tasmac-floating-delivery-bar';
      floatBar.className = 'tasmac-floating-delivery-bar';
      floatBar.onclick = () => window.TASMAC_DELIVERY.openLiveTracker();
      floatBar.innerHTML = `
        <div class="float-scooter-icon">🛵</div>
        <div>
          <div style="font-size: 11px; font-weight: 700; color: #fdba74; text-transform: uppercase; letter-spacing: 0.05em;" id="float-order-tag">LIVE DELIVERY</div>
          <div style="font-size: 13px; font-weight: 700;" id="float-status-text">Rajesh is on the way (ETA 22m)</div>
        </div>
        <div style="padding: 4px 10px; background: #ea580c; border-radius: 20px; font-size: 11px; font-weight: 750;">Track Live &rarr;</div>
      `;
      document.body.appendChild(floatBar);
    }

    // 2. Main Live Delivery Tracker Modal
    if (!document.getElementById('tasmac-delivery-modal')) {
      const modal = document.createElement('div');
      modal.id = 'tasmac-delivery-modal';
      modal.className = 'tasmac-tracker-modal';
      modal.onclick = (e) => {
        if (e.target.id === 'tasmac-delivery-modal') window.TASMAC_DELIVERY.closeLiveTracker();
      };
      modal.innerHTML = `
        <div class="tasmac-tracker-container" id="tracker-main-container" onclick="event.stopPropagation()">
          
          <!-- Top Header -->
          <div class="tracker-top-header">
            <div style="display: flex; align-items: center; gap: 10px;">
              <span class="tracker-order-id-badge" id="tracker-order-id">TSM-DLV-1085</span>
              <div class="tracker-eta-badge" id="tracker-eta-wrap">
                <span class="tracker-pulse-green"></span>
                <span id="tracker-eta-text">Arriving in 26 mins</span>
              </div>
            </div>
            <div style="display: flex; align-items: center; gap: 8px;">
              <button type="button" class="btn-cancel-delivery-header" id="btn-cancel-delivery-header" onclick="window.TASMAC_DELIVERY.openCancelModal()" title="Cancel Order">
                <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><circle cx="12" cy="12" r="10"></circle><line x1="15" y1="9" x2="9" y2="15"></line><line x1="9" y1="9" x2="15" y2="15"></line></svg>
                <span>Cancel Order</span>
              </button>
              <button type="button" class="tracker-close-btn" onclick="window.TASMAC_DELIVERY.closeLiveTracker()" title="Close Tracker">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>
              </button>
            </div>
          </div>

          <!-- Split Workspace: Map on Left, Rider & Stepper on Right -->
          <div class="tracker-body-split" id="tracker-active-view">
            
            <!-- Map Pane -->
            <div class="tracker-map-pane">
              <div id="tasmac-delivery-live-map"></div>
              
              <div class="tracker-map-overlay-status">
                <div style="display: flex; align-items: center; gap: 8px;">
                  <span style="font-size: 18px;">🛵</span>
                  <div>
                    <div style="font-size: 12px; font-weight: 750; color: #0f172a;" id="map-overlay-title">Rider is heading to counter</div>
                    <div style="font-size: 11px; color: #64748b;" id="map-overlay-sub">Picking up from Shop #1085</div>
                  </div>
                </div>
                <span style="font-size: 11px; font-weight: 700; color: #ea580c; background: #fff7ed; padding: 2px 8px; border-radius: 12px;">Live GPS</span>
              </div>
            </div>

            <!-- Right Info Pane -->
            <div class="tracker-info-pane">

              <!-- Assigned Delivery Rider Card -->
              <div class="tracker-rider-card">
                <div class="rider-card-top">
                  <div class="rider-avatar-wrap">
                    <div class="rider-avatar-circle" id="tracker-rider-avatar">RK</div>
                    <span class="rider-verified-dot" title="Govt Verified"></span>
                  </div>
                  <div class="rider-details">
                    <div class="rider-name-title">
                      <span id="tracker-rider-name">Rajesh Kumar</span>
                      <span class="rider-rating-pill" id="tracker-rider-rating">★ 4.9</span>
                    </div>
                    <div class="rider-sub-info" id="tracker-rider-vehicle">Honda Activa 6G • TN 09 BK 2914</div>
                    <div style="font-size: 10.5px; color: #10b981; font-weight: 600; margin-top: 2px;">✔ Tamil Nadu 21+ Fleet Verified Partner</div>
                  </div>
                </div>

                <div class="rider-actions-bar">
                  <button type="button" class="btn-rider-action" onclick="window.TASMAC_DELIVERY.callRider()">
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"></path></svg>
                    <span>Call Rajesh</span>
                  </button>
                  <button type="button" class="btn-rider-action" onclick="window.TASMAC_DELIVERY.chatRider()">
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"></path></svg>
                    <span>Message</span>
                  </button>
                </div>
              </div>

              <!-- 4-Digit Delivery Verification OTP Card -->
              <div class="tracker-otp-card">
                <div>
                  <div style="font-size: 11px; font-weight: 700; color: #9a3412; text-transform: uppercase; letter-spacing: 0.05em;">DELIVERY VERIFICATION OTP</div>
                  <div style="font-size: 11.5px; color: #c2410c; margin-top: 2px;">Share with rider upon bottle inspection</div>
                </div>
                <div class="tracker-otp-digits" id="tracker-otp-display">4 8 2 9</div>
              </div>

              <!-- 5-Step Order Journey Stepper -->
              <div class="tracker-stepper">
                <div class="step-item completed" id="step-node-0">
                  <div class="step-indicator">✔</div>
                  <div class="step-text">
                    <div class="step-title">Order Confirmed</div>
                    <div class="step-desc">Received at TASMAC Outlet</div>
                  </div>
                </div>

                <div class="step-item" id="step-node-1">
                  <div class="step-indicator">2</div>
                  <div class="step-text">
                    <div class="step-title">Delivery Partner Assigned</div>
                    <div class="step-desc">Rider arriving at counter for verification</div>
                  </div>
                </div>

                <div class="step-item" id="step-node-2">
                  <div class="step-indicator">3</div>
                  <div class="step-text">
                    <div class="step-title">Bottles Picked Up & Sealed</div>
                    <div class="step-desc">Tamper-evident excise seal scanned</div>
                  </div>
                </div>

                <div class="step-item" id="step-node-3">
                  <div class="step-indicator">4</div>
                  <div class="step-text">
                    <div class="step-title">Out for Doorstep Delivery</div>
                    <div class="step-desc">Rider is heading to your location</div>
                  </div>
                </div>

                <div class="step-item" id="step-node-4">
                  <div class="step-indicator">5</div>
                  <div class="step-text">
                    <div class="step-title">Delivered & Age Verified</div>
                    <div class="step-desc">OTP verified & bottles received</div>
                  </div>
                </div>
              </div>

              <!-- Delivery Destination Note -->
              <div style="background: #f8fafc; border: 1px solid #e2e8f0; border-radius: 12px; padding: 12px; font-size: 12px;">
                <div style="color: #64748b; font-size: 11px; text-transform: uppercase; letter-spacing: 0.05em; margin-bottom: 3px;">Delivering To</div>
                <div style="font-weight: 700; color: #0f172a;" id="tracker-dest-address">Flat 4B, Emerald Heights, T. Nagar</div>
                <div style="color: #64748b; margin-top: 3px;" id="tracker-dest-instructions">Instructions: Call on arrival</div>
              </div>

              <!-- Prominent Cancel Order Button (For changing mind) -->
              <button type="button" class="btn-cancel-delivery-main" onclick="window.TASMAC_DELIVERY.openCancelModal()">
                <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2"><circle cx="12" cy="12" r="10"></circle><line x1="15" y1="9" x2="9" y2="15"></line><line x1="9" y1="9" x2="15" y2="15"></line></svg>
                <span>Cancel Order (I changed my mind)</span>
              </button>

            </div>
          </div>

          <!-- Cancelled State View (Shown when order has been cancelled) -->
          <div id="tracker-cancelled-view" style="display: none; padding: 40px 24px; text-align: center;">
            <div style="width: 58px; height: 58px; border-radius: 50%; background: #fff1f2; color: #e11d48; display: inline-flex; align-items: center; justify-content: center; font-size: 26px; font-weight: 800; margin-bottom: 14px;">
              ✕
            </div>
            <h3 style="font-size: 21px; font-weight: 800; color: #0f172a; margin: 0 0 6px 0;">Delivery Order Cancelled</h3>
            <div style="font-family: 'JetBrains Mono', monospace; font-size: 13px; font-weight: 700; color: #e11d48; margin-bottom: 10px;" id="cancelled-view-token">TSM-DLV-XXXX</div>
            <p style="font-size: 13.5px; color: #64748b; max-width: 440px; margin: 0 auto 22px auto; line-height: 1.5;" id="cancelled-view-desc">
              Your order has been cancelled as per your request. The assigned delivery partner has been notified and any payment authorization is cancelled.
            </p>
            <div style="display: flex; gap: 10px; justify-content: center; flex-wrap: wrap;">
              <a href="index.html" class="demo-chip-btn" style="height: 40px; padding: 0 20px; background: #0f172a; color: #ffffff; border-radius: 10px; border: none; font-size: 13px; font-weight: 700; display: inline-flex; align-items: center; text-decoration: none;">
                Browse Bottle Catalog
              </a>
              <button type="button" onclick="window.TASMAC_DELIVERY.closeLiveTracker()" style="height: 40px; padding: 0 20px; background: #f1f5f9; color: #475569; border-radius: 10px; border: 1px solid #cbd5e1; font-size: 13px; font-weight: 650; cursor: pointer;">
                Close Window
              </button>
            </div>
          </div>

          <!-- Fast-Forward Simulation Bar (For User Testing) -->
          <div class="tracker-demo-bar" id="tracker-demo-bar">
            <span style="color: #64748b; font-weight: 600;">⚡ Test Delivery Stages:</span>
            <div style="display: flex; gap: 6px; flex-wrap: wrap;">
              <button type="button" class="demo-chip-btn" onclick="window.TASMAC_DELIVERY.setStage(1)">1. At Counter</button>
              <button type="button" class="demo-chip-btn" onclick="window.TASMAC_DELIVERY.setStage(2)">2. Picked Up</button>
              <button type="button" class="demo-chip-btn" onclick="window.TASMAC_DELIVERY.setStage(3)">3. On The Way</button>
              <button type="button" class="demo-chip-btn" onclick="window.TASMAC_DELIVERY.setStage(4)">4. Delivered</button>
              <button type="button" class="demo-chip-btn" style="color: #e11d48; border-color: #fecdd3;" onclick="window.TASMAC_DELIVERY.openCancelModal()">Cancel Order</button>
              <button type="button" class="demo-chip-btn" style="color: #ea580c; border-color: #fdba74;" onclick="window.TASMAC_DELIVERY.resetOrder()">Reset Demo</button>
            </div>
          </div>

        </div>
      `;
      document.body.appendChild(modal);
    }

    // 3. Cancellation Confirmation Dialog Modal
    if (!document.getElementById('tasmac-cancel-delivery-modal')) {
      const cancelModal = document.createElement('div');
      cancelModal.id = 'tasmac-cancel-delivery-modal';
      cancelModal.className = 'tasmac-comm-dialog';
      cancelModal.innerHTML = `
        <div class="comm-card" onclick="event.stopPropagation()">
          <div class="comm-card-header" style="background: #fff1f2; border-bottom: 1px solid #fee2e2;">
            <div style="display: flex; align-items: center; gap: 8px; color: #e11d48; font-weight: 750;">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><circle cx="12" cy="12" r="10"></circle><line x1="12" y1="8" x2="12" y2="12"></line><line x1="12" y1="16" x2="12.01" y2="16"></line></svg>
              <span>Cancel Delivery Order?</span>
            </div>
            <button type="button" class="tracker-close-btn" onclick="window.TASMAC_DELIVERY.closeCancelModal()">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>
            </button>
          </div>
          <div class="comm-card-body">
            <p style="font-size: 13.5px; color: #334155; line-height: 1.5; margin: 0 0 16px 0;">
              Are you sure you want to cancel this order? If you have changed your mind, we will immediately alert your delivery partner <strong id="cancel-rider-name">Rajesh</strong> and release the bottles.
            </p>

            <div style="font-size: 12px; font-weight: 700; color: #64748b; margin-bottom: 8px; text-transform: uppercase; letter-spacing: 0.05em;">Why are you cancelling?</div>

            <div style="display: flex; flex-direction: column; gap: 8px; margin-bottom: 20px;">
              <label class="cancel-reason-label">
                <input type="radio" name="cancel-order-reason" value="I changed my mind / No longer need it" checked />
                <span>I changed my mind / No longer need it</span>
              </label>
              <label class="cancel-reason-label">
                <input type="radio" name="cancel-order-reason" value="Delivery time is too long" />
                <span>Delivery time is too long</span>
              </label>
              <label class="cancel-reason-label">
                <input type="radio" name="cancel-order-reason" value="Entered wrong delivery address" />
                <span>Entered wrong delivery address</span>
              </label>
              <label class="cancel-reason-label">
                <input type="radio" name="cancel-order-reason" value="Want to change bottle selection" />
                <span>Want to change my bottle selection</span>
              </label>
            </div>

            <div style="display: grid; grid-template-columns: 1fr 1.2fr; gap: 10px;">
              <button type="button" onclick="window.TASMAC_DELIVERY.closeCancelModal()" style="height: 42px; border-radius: 10px; background: #f1f5f9; color: #475569; border: 1px solid #cbd5e1; font-size: 13px; font-weight: 650; cursor: pointer;">
                Don't Cancel
              </button>
              <button type="button" onclick="window.TASMAC_DELIVERY.confirmCancellation()" style="height: 42px; border-radius: 10px; background: #e11d48; color: #ffffff; border: none; font-size: 13px; font-weight: 750; cursor: pointer; display: flex; align-items: center; justify-content: center; gap: 6px;">
                <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>
                <span>Yes, Cancel Order</span>
              </button>
            </div>
          </div>
        </div>
      `;
      document.body.appendChild(cancelModal);
    }

    // 4. Simulated Rider Call Dialog
    if (!document.getElementById('tasmac-call-rider-modal')) {
      const callModal = document.createElement('div');
      callModal.id = 'tasmac-call-rider-modal';
      callModal.className = 'tasmac-comm-dialog';
      callModal.innerHTML = `
        <div class="comm-card" onclick="event.stopPropagation()">
          <div class="comm-card-header">
            <div style="font-weight: 750; font-size: 13.5px; color: #0f172a;">TASMAC Fleet Call</div>
            <button type="button" class="tracker-close-btn" onclick="window.TASMAC_DELIVERY.endCall()">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>
            </button>
          </div>
          <div class="comm-card-body">
            <div class="calling-wave-box">
              <div class="calling-avatar-ring" id="call-avatar-ring">RK</div>
              <div style="font-weight: 800; font-size: 17px; color: #0f172a; margin-top: 14px;" id="call-rider-name">Rajesh Kumar</div>
              <div style="font-size: 12.5px; color: #64748b; margin-top: 2px;" id="call-status-line">Calling +91 98401 24890...</div>
            </div>
            <div id="call-dialog-msg" style="display: none; background: #f8fafc; border: 1px solid #e2e8f0; border-radius: 12px; padding: 12px; font-size: 12.5px; line-height: 1.5; color: #334155; margin-bottom: 14px;">
              "Vanakkam Sir! This is Rajesh from TASMAC Delivery. I am picking up your bottles from the counter and securing them in the tamper-proof excise bag. I will reach your address shortly. Please keep your Govt ID ready for 21+ verification!"
            </div>
            <button type="button" onclick="window.TASMAC_DELIVERY.endCall()" style="width: 100%; height: 40px; border-radius: 10px; background: #ef4444; color: #ffffff; border: none; font-size: 13px; font-weight: 700; cursor: pointer;">
              End Call
            </button>
          </div>
        </div>
      `;
      document.body.appendChild(callModal);
    }

    // 5. Simulated Rider Message Dialog
    if (!document.getElementById('tasmac-chat-rider-modal')) {
      const chatModal = document.createElement('div');
      chatModal.id = 'tasmac-chat-rider-modal';
      chatModal.className = 'tasmac-comm-dialog';
      chatModal.innerHTML = `
        <div class="comm-card" onclick="event.stopPropagation()">
          <div class="comm-card-header">
            <div style="display: flex; align-items: center; gap: 8px;">
              <span style="width: 8px; height: 8px; border-radius: 50%; background: #10b981;"></span>
              <strong style="font-size: 13.5px;" id="chat-rider-title">Chat with Rajesh Kumar</strong>
            </div>
            <button type="button" class="tracker-close-btn" onclick="window.TASMAC_DELIVERY.closeChat()">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>
            </button>
          </div>
          <div class="comm-card-body" style="padding: 14px;">
            <div id="chat-messages-box" style="height: 180px; overflow-y: auto; display: flex; flex-direction: column; gap: 8px; margin-bottom: 12px; font-size: 12px;">
              <div style="align-self: flex-start; background: #f1f5f9; padding: 8px 12px; border-radius: 10px; max-width: 80%;">
                Vanakkam! I've been assigned to your order. Picking up the bottles from the counter now.
              </div>
            </div>
            <div style="display: flex; gap: 6px; margin-bottom: 10px; flex-wrap: wrap;">
              <button type="button" class="demo-chip-btn" onclick="window.TASMAC_DELIVERY.sendQuickMessage('Please ring the doorbell')">Ring bell</button>
              <button type="button" class="demo-chip-btn" onclick="window.TASMAC_DELIVERY.sendQuickMessage('Please call when at gate')">Call at gate</button>
              <button type="button" class="demo-chip-btn" onclick="window.TASMAC_DELIVERY.sendQuickMessage('Leave with security guard')">Leave with guard</button>
            </div>
            <div style="display: flex; gap: 6px;">
              <input type="text" id="chat-user-input" placeholder="Message your delivery partner..." style="flex: 1; height: 36px; border: 1px solid #cbd5e1; border-radius: 8px; padding: 0 10px; font-size: 12px;" onkeypress="if(event.key === 'Enter') window.TASMAC_DELIVERY.sendChatMessage()" />
              <button type="button" onclick="window.TASMAC_DELIVERY.sendChatMessage()" style="background: #ea580c; color: #ffffff; border: none; border-radius: 8px; padding: 0 12px; font-size: 12px; font-weight: 650; cursor: pointer;">Send</button>
            </div>
          </div>
        </div>
      `;
      document.body.appendChild(chatModal);
    }

    renderFloatingBar();
  }

  // Render or update floating tracking bar
  function renderFloatingBar() {
    const bar = document.getElementById('tasmac-floating-delivery-bar');
    const delivery = getActiveDelivery();

    if (bar) {
      if (delivery && delivery.status !== 'cancelled' && delivery.stage < 4) {
        bar.style.display = 'flex';
        const statusEl = document.getElementById('float-status-text');
        if (statusEl) {
          const riderName = delivery.rider ? delivery.rider.name.split(' ')[0] : 'Rider';
          if (delivery.stage === 0) statusEl.textContent = 'Order received at counter';
          else if (delivery.stage === 1) statusEl.textContent = `${riderName} is arriving at counter`;
          else if (delivery.stage === 2) statusEl.textContent = `${riderName} picked up your bottles`;
          else if (delivery.stage === 3) statusEl.textContent = `${riderName} is on the way (${delivery.etaMinutes || 18}m)`;
        }
      } else {
        bar.style.display = 'none';
      }
    }

    updateNavTrackingButton(delivery);
  }

  // Open the Fullscreen / Centered Live Delivery Tracker
  function openLiveTracker(orderId) {
    initDeliveryUI();
    let delivery = getActiveDelivery(orderId);
    if (!delivery) {
      if (typeof showToast === 'function') showToast("No active delivery order found. Please place an order first.");
      return;
    }

    const modal = document.getElementById('tasmac-delivery-modal');
    if (!modal) return;
    modal.classList.add('open');

    // Check if order was already cancelled
    const activeView = document.getElementById('tracker-active-view');
    const cancelledView = document.getElementById('tracker-cancelled-view');
    const demoBar = document.getElementById('tracker-demo-bar');
    const cancelHeaderBtn = document.getElementById('btn-cancel-delivery-header');
    const etaWrap = document.getElementById('tracker-eta-wrap');

    if (delivery.status === 'cancelled') {
      if (activeView) activeView.style.display = 'none';
      if (demoBar) demoBar.style.display = 'none';
      if (cancelHeaderBtn) cancelHeaderBtn.style.display = 'none';
      if (etaWrap) etaWrap.style.display = 'none';
      if (cancelledView) {
        cancelledView.style.display = 'block';
        const tokenEl = document.getElementById('cancelled-view-token');
        const descEl = document.getElementById('cancelled-view-desc');
        if (tokenEl) tokenEl.textContent = delivery.orderId;
        if (descEl) descEl.textContent = `Your order was cancelled (${delivery.cancelReason || 'Changed mind'}). The assigned rider has been notified and you have not been charged.`;
      }
      return;
    }

    // Normal active delivery view
    if (activeView) activeView.style.display = 'grid';
    if (demoBar) demoBar.style.display = 'flex';
    if (cancelHeaderBtn) cancelHeaderBtn.style.display = 'inline-flex';
    if (etaWrap) etaWrap.style.display = 'inline-flex';
    if (cancelledView) cancelledView.style.display = 'none';

    // Populate data
    const orderIdEl = document.getElementById('tracker-order-id');
    const etaEl = document.getElementById('tracker-eta-text');
    const riderAvatar = document.getElementById('tracker-rider-avatar');
    const riderName = document.getElementById('tracker-rider-name');
    const riderRating = document.getElementById('tracker-rider-rating');
    const riderVehicle = document.getElementById('tracker-rider-vehicle');
    const otpDisplay = document.getElementById('tracker-otp-display');
    const destAddr = document.getElementById('tracker-dest-address');
    const destInst = document.getElementById('tracker-dest-instructions');

    if (orderIdEl) orderIdEl.textContent = delivery.orderId;
    if (etaEl) etaEl.textContent = delivery.stage >= 4 ? "Delivered" : `Arriving in ${delivery.etaMinutes || 24} mins`;
    if (riderAvatar && delivery.rider) riderAvatar.textContent = delivery.rider.avatar || "RK";
    if (riderName && delivery.rider) riderName.textContent = delivery.rider.name;
    if (riderRating && delivery.rider) riderRating.textContent = delivery.rider.rating;
    if (riderVehicle && delivery.rider) riderVehicle.textContent = delivery.rider.vehicle;
    if (otpDisplay) otpDisplay.textContent = (delivery.otp || "4829").split('').join(' ');
    
    if (destAddr && delivery.destination) {
      const parts = [];
      if (delivery.destination.flat) parts.push(delivery.destination.flat);
      if (delivery.destination.street) {
        parts.push(delivery.destination.street);
      } else if (delivery.destination.area) {
        parts.push(delivery.destination.area);
      }
      destAddr.textContent = parts.join(", ") || "Chennai";
    }
    if (destInst && delivery.destination) {
      destInst.textContent = `Instructions: ${delivery.destination.instructions || 'Call on arrival'}`;
    }

    updateStepperUI(delivery.stage);

    // Initialize or refresh Leaflet map
    setTimeout(() => {
      renderTrackerMap(delivery);
    }, 200);

    // Start background autonomous movement if not delivered
    if (delivery.stage < 4 && !simulationTimer && delivery.status !== 'cancelled') {
      startLiveSimulation();
    }
  }

  function closeLiveTracker() {
    const modal = document.getElementById('tasmac-delivery-modal');
    if (modal) modal.classList.remove('open');
    renderFloatingBar();
  }

  // Open Cancel Order Confirmation Modal
  function openCancelModal(orderId) {
    const delivery = getActiveDelivery(orderId);
    if (!delivery) {
      if (typeof showToast === 'function') showToast("No active order to cancel.");
      return;
    }

    const cancelModal = document.getElementById('tasmac-cancel-delivery-modal');
    if (!cancelModal) return;

    const riderNameEl = document.getElementById('cancel-rider-name');
    if (riderNameEl && delivery.rider) {
      riderNameEl.textContent = delivery.rider.name;
    }

    cancelModal.classList.add('open');
  }

  function closeCancelModal() {
    const cancelModal = document.getElementById('tasmac-cancel-delivery-modal');
    if (cancelModal) cancelModal.classList.remove('open');
  }

  // Confirm and Execute Cancellation
  function confirmCancellation() {
    let delivery = getActiveDelivery();
    if (!delivery) return;

    const selectedReasonEl = document.querySelector('input[name="cancel-order-reason"]:checked');
    const reason = selectedReasonEl ? selectedReasonEl.value : "I changed my mind / No longer need it";

    delivery.status = 'cancelled';
    delivery.cancelledAt = new Date().toISOString();
    delivery.cancelReason = reason;

    if (simulationTimer) {
      clearInterval(simulationTimer);
      simulationTimer = null;
    }

    saveActiveDelivery(delivery);

    // Update matching record in customer reservations history
    try {
      const userJson = localStorage.getItem('tasmac-user');
      if (userJson) {
        const u = JSON.parse(userJson);
        const userKey = `tasmac_user_reservations_${u.id || u.phone || 'auth'}`;
        const raw = localStorage.getItem(userKey);
        if (raw) {
          let list = JSON.parse(raw);
          if (Array.isArray(list)) {
            list = list.map(item => {
              if (item.token === delivery.orderId) {
                return { ...item, status: 'cancelled' };
              }
              return item;
            });
            localStorage.setItem(userKey, JSON.stringify(list));
          }
        }
      }
    } catch(e) {}

    // Ensure cart is cleared in localStorage
    try { localStorage.setItem("tasmac-cart", "[]"); } catch(e) {}

    closeCancelModal();

    // Show cancelled view in tracker modal
    const activeView = document.getElementById('tracker-active-view');
    const cancelledView = document.getElementById('tracker-cancelled-view');
    const demoBar = document.getElementById('tracker-demo-bar');
    const cancelHeaderBtn = document.getElementById('btn-cancel-delivery-header');
    const etaWrap = document.getElementById('tracker-eta-wrap');

    if (activeView) activeView.style.display = 'none';
    if (demoBar) demoBar.style.display = 'none';
    if (cancelHeaderBtn) cancelHeaderBtn.style.display = 'none';
    if (etaWrap) etaWrap.style.display = 'none';
    if (cancelledView) {
      cancelledView.style.display = 'block';
      const tokenEl = document.getElementById('cancelled-view-token');
      const descEl = document.getElementById('cancelled-view-desc');
      if (tokenEl) tokenEl.textContent = delivery.orderId;
      if (descEl) descEl.textContent = `Your order was cancelled (${reason}). The assigned rider has been notified and you have not been charged.`;
    }

    // Trigger external notification & callback for cart.html
    window.dispatchEvent(new CustomEvent('tasmac:orderCancelled', { 
      detail: { 
        orderId: delivery.orderId, 
        reason: reason, 
        cancelReason: reason 
      } 
    }));

    renderFloatingBar();
    updateNavTrackingButton(delivery);

    if (typeof showToast === 'function') {
      showToast(`Order ${delivery.orderId} cancelled successfully.`);
    }
  }

  // Update Stepper View (0..4)
  function updateStepperUI(stage) {
    for (let i = 0; i <= 4; i++) {
      const node = document.getElementById(`step-node-${i}`);
      if (!node) continue;
      node.classList.remove('completed', 'active');
      if (i < stage) {
        node.classList.add('completed');
        node.querySelector('.step-indicator').textContent = '✔';
      } else if (i === stage) {
        node.classList.add('active');
        node.querySelector('.step-indicator').textContent = (i + 1).toString();
      } else {
        node.querySelector('.step-indicator').textContent = (i + 1).toString();
      }
    }

    // Update overlay title
    const mapTitle = document.getElementById('map-overlay-title');
    const mapSub = document.getElementById('map-overlay-sub');
    const delivery = getActiveDelivery();
    const riderName = delivery && delivery.rider ? delivery.rider.name.split(' ')[0] : 'Rider';

    if (mapTitle && mapSub) {
      if (stage === 0) {
        mapTitle.textContent = "Order Confirmed";
        mapSub.textContent = "Outlet preparing bottles";
      } else if (stage === 1) {
        mapTitle.textContent = `${riderName} Assigned`;
        mapSub.textContent = "Heading to TASMAC counter";
      } else if (stage === 2) {
        mapTitle.textContent = "Bottles Picked Up";
        mapSub.textContent = "Tamper-proof seal verified";
      } else if (stage === 3) {
        mapTitle.textContent = "Out for Delivery";
        mapSub.textContent = `${riderName} is on the way to you`;
      } else if (stage === 4) {
        mapTitle.textContent = "Delivered!";
        mapSub.textContent = "OTP verified • Enjoy responsibly";
      }
    }
  }

  // Render & Animate Leaflet Route
  function renderTrackerMap(delivery) {
    if (!window.L) return;

    const mapContainer = document.getElementById('tasmac-delivery-live-map');
    if (!mapContainer) return;

    const storeLat = delivery.store && delivery.store.lat ? delivery.store.lat : 13.0418;
    const storeLng = delivery.store && delivery.store.lng ? delivery.store.lng : 80.2341;

    const destLat = delivery.destination && delivery.destination.lat ? delivery.destination.lat : (storeLat + 0.018);
    const destLng = delivery.destination && delivery.destination.lng ? delivery.destination.lng : (storeLng + 0.022);

    if (!deliveryMapInstance) {
      deliveryMapInstance = L.map('tasmac-delivery-live-map', {
        attributionControl: false,
        zoomControl: true
      }).setView([storeLat, storeLng], 14);

      L.tileLayer('https://server.arcgisonline.com/ArcGIS/rest/services/World_Street_Map/MapServer/tile/{z}/{y}/{x}', {
        maxZoom: 18,
        maxNativeZoom: 17
      }).addTo(deliveryMapInstance);
    } else {
      deliveryMapInstance.invalidateSize();
    }

    // Clear existing markers & route
    if (storeMarker) try { deliveryMapInstance.removeLayer(storeMarker); } catch(e) {}
    if (homeMarker) try { deliveryMapInstance.removeLayer(homeMarker); } catch(e) {}
    if (riderMarker) try { deliveryMapInstance.removeLayer(riderMarker); } catch(e) {}
    if (routePolyline) try { deliveryMapInstance.removeLayer(routePolyline); } catch(e) {}

    // Store Pin
    const storeIcon = L.divIcon({
      className: '',
      html: `<div class="leaflet-store-origin-pin" title="TASMAC Outlet">🍾</div>`,
      iconSize: [32, 32],
      iconAnchor: [16, 16]
    });
    storeMarker = L.marker([storeLat, storeLng], { icon: storeIcon }).addTo(deliveryMapInstance);
    storeMarker.bindPopup(`<strong>${delivery.store.name || 'TASMAC Outlet'}</strong><br/>Fulfillment Origin`);

    // Home Destination Pin
    const homeIcon = L.divIcon({
      className: '',
      html: `<div class="leaflet-dest-home-pin" title="Delivery Address">🏠</div>`,
      iconSize: [32, 32],
      iconAnchor: [16, 16]
    });
    homeMarker = L.marker([destLat, destLng], { icon: homeIcon }).addTo(deliveryMapInstance);
    homeMarker.bindPopup(`<strong>Your Delivery Address</strong><br/>${delivery.destination.area || 'Chennai'}`);

    // Generate Route points (Store -> Midpoint curve -> Destination)
    const midLat = (storeLat + destLat) / 2 + 0.003;
    const midLng = (storeLng + destLng) / 2 - 0.004;
    const routePoints = [
      [storeLat, storeLng],
      [(storeLat * 2 + midLat) / 3, (storeLng * 2 + midLng) / 3],
      [midLat, midLng],
      [(midLat + destLat * 2) / 3, (midLng + destLng * 2) / 3],
      [destLat, destLng]
    ];

    routePolyline = L.polyline(routePoints, {
      color: '#ea580c',
      weight: 4,
      dashArray: '8, 8',
      opacity: 0.85
    }).addTo(deliveryMapInstance);

    // Calculate Rider current coordinate along the route based on stage
    const riderRatio = delivery.stage === 0 ? 0 :
                       delivery.stage === 1 ? 0.2 :
                       delivery.stage === 2 ? 0.45 :
                       delivery.stage === 3 ? 0.78 : 1.0;

    const riderCoord = getInterpolatedPoint(routePoints, riderRatio);

    const riderIcon = L.divIcon({
      className: '',
      html: `<div class="leaflet-rider-scooter-pin" title="${delivery.rider ? delivery.rider.name : 'Rider'}">🛵</div>`,
      iconSize: [36, 36],
      iconAnchor: [18, 18]
    });

    riderMarker = L.marker(riderCoord, { icon: riderIcon, zIndexOffset: 2000 }).addTo(deliveryMapInstance);
    riderMarker.bindPopup(`<strong>${delivery.rider ? delivery.rider.name : 'Rider'}</strong><br/>${delivery.rider ? delivery.rider.vehicle : 'Active Delivery'}`);

    // Fit map to show both store and destination
    try {
      deliveryMapInstance.fitBounds([
        [storeLat, storeLng],
        [destLat, destLng]
      ], { padding: [50, 50], maxZoom: 15 });
    } catch(e) {}
  }

  // Helper: Linear interpolation along a list of coordinates
  function getInterpolatedPoint(points, ratio) {
    if (ratio <= 0) return points[0];
    if (ratio >= 1) return points[points.length - 1];
    const totalSegments = points.length - 1;
    const currentSegmentIndex = Math.min(Math.floor(ratio * totalSegments), totalSegments - 1);
    const segmentRatio = (ratio * totalSegments) - currentSegmentIndex;
    const p1 = points[currentSegmentIndex];
    const p2 = points[currentSegmentIndex + 1];
    return [
      p1[0] + (p2[0] - p1[0]) * segmentRatio,
      p1[1] + (p2[1] - p1[1]) * segmentRatio
    ];
  }

  // Advance delivery to a specific stage
  function setStage(stage) {
    let delivery = getActiveDelivery();
    if (!delivery || delivery.status === 'cancelled') return;

    delivery.stage = stage;
    if (stage === 1) delivery.etaMinutes = 24;
    else if (stage === 2) delivery.etaMinutes = 18;
    else if (stage === 3) delivery.etaMinutes = 9;
    else if (stage >= 4) {
      delivery.stage = 4;
      delivery.etaMinutes = 0;
      delivery.status = 'delivered';
      if (simulationTimer) clearInterval(simulationTimer);
    }

    saveActiveDelivery(delivery);
    updateStepperUI(delivery.stage);

    const etaEl = document.getElementById('tracker-eta-text');
    if (etaEl) {
      etaEl.textContent = delivery.stage >= 4 ? "Delivered" : `Arriving in ${delivery.etaMinutes} mins`;
    }

    renderTrackerMap(delivery);
    renderFloatingBar();

    const stageNames = [
      "Order Confirmed",
      "Delivery Partner Assigned",
      "Bottles Picked Up & Sealed",
      "Out for Doorstep Delivery",
      "Order Delivered Successfully!"
    ];

    if (typeof showToast === 'function') {
      showToast(stageNames[stage]);
    }
  }

  // Autonomous background progression for realistic feel
  function startLiveSimulation() {
    if (simulationTimer) clearInterval(simulationTimer);
    simulationTimer = setInterval(() => {
      let delivery = getActiveDelivery();
      if (!delivery || delivery.stage >= 4 || delivery.status === 'cancelled') {
        clearInterval(simulationTimer);
        simulationTimer = null;
        return;
      }
      setStage(delivery.stage + 1);
    }, 18000); // Progress every 18 seconds
  }

  // Reset or clear demo delivery order
  function resetOrder() {
    saveActiveDelivery(null);
    closeLiveTracker();
    if (typeof showToast === 'function') showToast("Active delivery order cleared.");
  }

  // Simulated Rider Calling
  function callRider() {
    const delivery = getActiveDelivery();
    const modal = document.getElementById('tasmac-call-rider-modal');
    if (!modal) return;

    const riderNameEl = document.getElementById('call-rider-name');
    const statusLine = document.getElementById('call-status-line');
    const msgBox = document.getElementById('call-dialog-msg');
    const avatarEl = document.getElementById('call-avatar-ring');

    if (riderNameEl && delivery && delivery.rider) riderNameEl.textContent = delivery.rider.name;
    if (avatarEl && delivery && delivery.rider) avatarEl.textContent = delivery.rider.avatar || "RK";
    if (statusLine) statusLine.textContent = `Calling ${delivery && delivery.rider ? delivery.rider.phone : '+91 98401 24890'}...`;
    if (msgBox) msgBox.style.display = 'none';

    modal.classList.add('open');

    // Simulate answer after 2 seconds
    clearTimeout(callAudioTimer);
    callAudioTimer = setTimeout(() => {
      if (statusLine) statusLine.textContent = "Connected • 00:03 (TASMAC Fleet Line)";
      if (msgBox) msgBox.style.display = 'block';
    }, 2000);
  }

  function endCall() {
    clearTimeout(callAudioTimer);
    const modal = document.getElementById('tasmac-call-rider-modal');
    if (modal) modal.classList.remove('open');
  }

  // Simulated In-App Rider Messaging
  function chatRider() {
    const delivery = getActiveDelivery();
    const modal = document.getElementById('tasmac-chat-rider-modal');
    if (!modal) return;
    const title = document.getElementById('chat-rider-title');
    if (title && delivery && delivery.rider) {
      title.textContent = `Chat with ${delivery.rider.name}`;
    }
    modal.classList.add('open');
  }

  function closeChat() {
    const modal = document.getElementById('tasmac-chat-rider-modal');
    if (modal) modal.classList.remove('open');
  }

  function sendQuickMessage(text) {
    const box = document.getElementById('chat-messages-box');
    if (!box) return;

    // Append user message
    const userBubble = document.createElement('div');
    userBubble.style.cssText = 'align-self: flex-end; background: #ea580c; color: #ffffff; padding: 8px 12px; border-radius: 10px; max-width: 80%;';
    userBubble.textContent = text;
    box.appendChild(userBubble);
    box.scrollTop = box.scrollHeight;

    // Rider automated polite acknowledgment
    setTimeout(() => {
      const riderBubble = document.createElement('div');
      riderBubble.style.cssText = 'align-self: flex-start; background: #f1f5f9; padding: 8px 12px; border-radius: 10px; max-width: 80%;';
      riderBubble.textContent = "Got it, noted! I will follow your instructions carefully.";
      box.appendChild(riderBubble);
      box.scrollTop = box.scrollHeight;
    }, 1200);
  }

  function sendChatMessage() {
    const input = document.getElementById('chat-user-input');
    if (!input || !input.value.trim()) return;
    const msg = input.value.trim();
    input.value = '';
    sendQuickMessage(msg);
  }

  // Create a brand new Delivery Order from Cart Checkout
  function createDeliveryOrder(params) {
    const orderId = `TSM-DLV-${Math.floor(1000 + Math.random() * 9000)}`;
    const randomRider = RIDERS_POOL[Math.floor(Math.random() * RIDERS_POOL.length)];
    const otp = generateOtp();

    const deliveryPayload = {
      orderId: orderId,
      token: orderId,
      orderType: 'delivery',
      isDelivery: true,
      stage: 0,
      status: 'pending',
      etaMinutes: 28,
      otp: otp,
      rider: randomRider,
      store: params.store || { name: 'Shop #1085 (Elite)', area: 'Panagal Park, T. Nagar', lat: 13.0418, lng: 80.2341 },
      destination: params.destination || {
        name: params.name || 'Patron',
        phone: params.phone || '',
        flat: params.flat || '',
        street: params.street || '',
        area: params.area || 'Chennai',
        pincode: params.pincode || '600017',
        instructions: params.instructions || 'Call on arrival',
        lat: params.lat || (13.0418 + 0.015),
        lng: params.lng || (80.2341 + 0.018)
      },
      items: params.items || [],
      pricing: params.pricing || { total: params.total || 0 },
      created_at: new Date().toISOString()
    };

    saveActiveDelivery(deliveryPayload);

    // Save to customer's reservation & orders dashboard registry
    if (window.TASMAC_RESERVATIONS && typeof window.TASMAC_RESERVATIONS.saveReservation === 'function') {
      window.TASMAC_RESERVATIONS.saveReservation({
        token: orderId,
        name: deliveryPayload.destination.name,
        phone: deliveryPayload.destination.phone,
        idType: params.idType || 'Aadhaar Card',
        outletId: deliveryPayload.store.id || '1085',
        outletName: `${deliveryPayload.store.name}, ${deliveryPayload.store.area}`,
        amount: deliveryPayload.pricing.total,
        orderType: 'delivery',
        isDelivery: true,
        items: deliveryPayload.items
      });
    }

    // Launch Tracker Modal
    openLiveTracker(orderId);
    return deliveryPayload;
  }

  // Auto-init on page load
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initDeliveryUI);
  } else {
    initDeliveryUI();
  }

  // Export Delivery API
  window.TASMAC_DELIVERY = {
    getActiveDelivery: getActiveDelivery,
    createDeliveryOrder: createDeliveryOrder,
    openLiveTracker: openLiveTracker,
    closeLiveTracker: closeLiveTracker,
    openCancelModal: openCancelModal,
    closeCancelModal: closeCancelModal,
    confirmCancellation: confirmCancellation,
    setStage: setStage,
    resetOrder: resetOrder,
    callRider: callRider,
    endCall: endCall,
    chatRider: chatRider,
    closeChat: closeChat,
    sendQuickMessage: sendQuickMessage,
    sendChatMessage: sendChatMessage
  };

})();
