/**
 * TASMAC RESERVE — Customer Reservations Dashboard & Digital Receipt Controller
 * 
 * Safe Feature Enhancement:
 * - Customer Dashboard for authenticated reservations (Reference, Date, Outlet, Items, Qty, Total, Status)
 * - Strict Authenticated Customer Scope (No fake reservations)
 * - Empty state when no reservations exist
 * - Browser-supported Print / Save as PDF capability (@media print)
 * - Pre-confirmation Reservation Summary Review modal
 */

(function () {
  'use strict';

  // Inject Modal Structure and Print Stylesheet
  function initReservationsUI() {
    if (document.getElementById('tasmac-reservations-modal')) return;

    // 1. Add Print & Dashboard Stylesheet
    const style = document.createElement('style');
    style.id = 'tasmac-reservations-styles';
    style.textContent = `
      /* My Reservations Dashboard Modal */
      .tasmac-modal-veil {
        position: fixed;
        inset: 0;
        z-index: 9999;
        background: rgba(15, 23, 42, 0.7);
        backdrop-filter: blur(8px);
        display: none;
        align-items: center;
        justify-content: center;
        padding: 16px;
        box-sizing: border-box;
      }
      .tasmac-modal-veil.open {
        display: flex;
        animation: tasmacFadeIn 0.2s ease-out;
      }
      .tasmac-dash-card {
        background: #ffffff;
        color: #0f172a;
        border: 1px solid #e2e8f0;
        border-radius: 18px;
        width: 100%;
        max-width: 500px;
        max-height: 90vh;
        display: flex;
        flex-direction: column;
        overflow: hidden;
        box-shadow: 0 25px 50px -12px rgba(15, 23, 42, 0.25);
        font-family: 'Plus Jakarta Sans', system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif !important;
      }
      .tasmac-dash-header {
        display: flex;
        align-items: center;
        justify-content: space-between;
        padding: 16px 20px;
        border-bottom: 1px solid #f1f5f9;
        background: #ffffff;
      }
      .tasmac-dash-title {
        margin: 0;
        font-size: 17px;
        font-weight: 750;
        letter-spacing: -0.01em;
        display: flex;
        align-items: center;
        gap: 8px;
        color: #0f172a;
        font-family: 'Plus Jakarta Sans', system-ui, sans-serif !important;
      }
      .tasmac-dash-subtitle {
        margin: 2px 0 0 0;
        font-size: 12.5px;
        color: #64748b;
        font-weight: 400;
        font-family: 'Plus Jakarta Sans', system-ui, sans-serif !important;
      }
      .tasmac-dash-close {
        background: #f8fafc;
        border: 1px solid #e2e8f0;
        width: 32px;
        height: 32px;
        border-radius: 50%;
        display: flex;
        align-items: center;
        justify-content: center;
        cursor: pointer;
        color: #64748b;
        transition: all 0.15s ease;
      }
      .tasmac-dash-close:hover {
        background: #e2e8f0;
        color: #0f172a;
        transform: scale(1.05);
      }
      .tasmac-dash-body {
        padding: 22px 20px;
        overflow-y: auto;
        flex: 1;
        display: flex;
        flex-direction: column;
        gap: 14px;
        font-family: 'Plus Jakarta Sans', system-ui, sans-serif !important;
      }
      .tasmac-res-item {
        border: 1px solid #e2e8f0;
        border-radius: 14px;
        padding: 16px;
        background: #ffffff;
        display: flex;
        flex-direction: column;
        gap: 12px;
        box-shadow: 0 1px 3px rgba(0, 0, 0, 0.03);
        font-family: 'Plus Jakarta Sans', system-ui, sans-serif !important;
      }
      .tasmac-res-top {
        display: flex;
        align-items: center;
        justify-content: space-between;
        flex-wrap: wrap;
        gap: 8px;
      }
      .tasmac-res-token {
        font-size: 14px;
        font-weight: 750;
        color: #ea580c;
        background: #fff7ed;
        padding: 3px 8px;
        border-radius: 6px;
        display: inline-block;
        letter-spacing: 0.02em;
        font-family: 'Plus Jakarta Sans', system-ui, sans-serif !important;
      }
      .tasmac-status-tag {
        font-size: 11px;
        font-weight: 600;
        padding: 4px 10px;
        border-radius: 20px;
        text-transform: capitalize;
        font-family: 'Plus Jakarta Sans', system-ui, sans-serif !important;
      }
      .tasmac-status-tag.pending {
        background: #fff7ed;
        color: #c2410c;
        border: 1px solid #fed7aa;
      }
      .tasmac-status-tag.collected {
        background: #f0fdf4;
        color: #15803d;
        border: 1px solid #bbf7d0;
      }
      .tasmac-status-tag.cancelled {
        background: #fef2f2;
        color: #b91c1c;
        border: 1px solid #fecaca;
      }
      .tasmac-res-meta {
        display: grid;
        grid-template-columns: 1fr 1fr;
        gap: 8px;
        font-size: 12.5px;
        padding: 10px 14px;
        background: #f8fafc;
        border-radius: 10px;
        border: 1px solid #f1f5f9;
        font-family: 'Plus Jakarta Sans', system-ui, sans-serif !important;
      }
      @media (max-width: 500px) {
        .tasmac-res-meta {
          grid-template-columns: 1fr;
        }
      }
      .tasmac-res-table {
        width: 100%;
        border-collapse: collapse;
        font-size: 13px;
        font-family: 'Plus Jakarta Sans', system-ui, sans-serif !important;
      }
      .tasmac-res-table th {
        text-align: left;
        padding: 8px 10px;
        border-bottom: 1px solid #e2e8f0;
        color: #64748b;
        font-size: 11px;
        font-weight: 600;
        text-transform: uppercase;
        letter-spacing: 0.04em;
        font-family: 'Plus Jakarta Sans', system-ui, sans-serif !important;
      }
      .tasmac-res-table td {
        padding: 9px 10px;
        border-bottom: 1px solid #f1f5f9;
        color: #0f172a;
        font-family: 'Plus Jakarta Sans', system-ui, sans-serif !important;
      }
      .tasmac-res-actions {
        display: flex;
        align-items: center;
        justify-content: space-between;
        flex-wrap: wrap;
        gap: 8px;
        padding-top: 6px;
      }
      .tasmac-res-total {
        font-weight: 750;
        font-size: 15px;
        color: #0f172a;
        font-family: 'Plus Jakarta Sans', system-ui, sans-serif !important;
      }
      .tasmac-btn-print {
        display: inline-flex;
        align-items: center;
        gap: 6px;
        height: 34px;
        padding: 0 14px;
        border: 1px solid #e2e8f0;
        border-radius: 8px;
        background: #ffffff;
        color: #0f172a;
        font-size: 12.5px;
        font-weight: 600;
        cursor: pointer;
        transition: all 0.15s ease;
        font-family: 'Plus Jakarta Sans', system-ui, sans-serif !important;
      }
      .tasmac-btn-print:hover {
        background: #f8fafc;
        border-color: #cbd5e1;
      }
      .tasmac-empty-state {
        text-align: center;
        padding: 24px 16px 12px;
        display: flex;
        flex-direction: column;
        align-items: center;
        gap: 12px;
        font-family: 'Plus Jakarta Sans', system-ui, sans-serif !important;
      }
      .tasmac-empty-icon {
        width: 56px;
        height: 56px;
        border-radius: 16px;
        background: #fff7ed;
        border: 1px solid #ffedd5;
        display: flex;
        align-items: center;
        justify-content: center;
        color: #ea580c;
        margin-bottom: 2px;
      }
      .tasmac-res-auth-btn {
        display: inline-flex;
        align-items: center;
        justify-content: center;
        gap: 8px;
        width: 100%;
        max-width: 280px;
        height: 42px;
        background: linear-gradient(135deg, #ea580c 0%, #c2410c 100%);
        color: #ffffff !important;
        border-radius: 10px;
        font-size: 14px;
        font-weight: 600;
        text-decoration: none;
        box-shadow: 0 4px 14px rgba(234, 88, 12, 0.25);
        transition: all 0.15s ease;
        border: none;
        cursor: pointer;
        font-family: 'Plus Jakarta Sans', system-ui, sans-serif !important;
      }
      .tasmac-res-auth-btn:hover {
        transform: translateY(-1px);
        box-shadow: 0 6px 18px rgba(234, 88, 12, 0.35);
        color: #ffffff !important;
      }

      /* =========================================================================
         DEDICATED BROWSER PRINT STYLESHEET (@media print)
         Renders official TASMAC digital receipt voucher cleanly
         ========================================================================= */
      @media print {
        body * {
          visibility: hidden !important;
        }
        #tasmac-printable-receipt, #tasmac-printable-receipt * {
          visibility: visible !important;
        }
        #tasmac-printable-receipt {
          position: absolute !important;
          left: 0 !important;
          top: 0 !important;
          width: 100% !important;
          margin: 0 !important;
          padding: 24px !important;
          box-shadow: none !important;
          border: 1px solid #000000 !important;
          background: #ffffff !important;
          color: #000000 !important;
          display: block !important;
        }
        .no-print {
          display: none !important;
        }
      }
    `;
    document.head.appendChild(style);

    // 2. Add Modal HTML DOM Container
    const modal = document.createElement('div');
    modal.id = 'tasmac-reservations-modal';
    modal.className = 'tasmac-modal-veil';
    modal.onclick = function (e) {
      if (e.target === modal) closeReservationsModal();
    };

    modal.innerHTML = `
      <div class="tasmac-dash-card" onclick="event.stopPropagation()">
        <div class="tasmac-dash-header">
          <div>
            <h2 class="tasmac-dash-title">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" style="color: var(--primary, #ea580c);"><rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect><line x1="16" y1="2" x2="16" y2="6"></line><line x1="8" y1="2" x2="8" y2="6"></line><line x1="3" y1="10" x2="21" y2="10"></line></svg>
              <span id="dash-modal-title">My Reservations</span>
            </h2>
            <p class="tasmac-dash-subtitle" id="dash-modal-subtitle">Tokens & pickup history</p>
          </div>
          <button type="button" class="tasmac-dash-close" onclick="window.TASMAC_RESERVATIONS.closeModal()" title="Close">
            <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>
          </button>
        </div>

        <div class="tasmac-dash-body" id="tasmac-reservations-content">
          <!-- Dynamically populated -->
        </div>
      </div>
    `;

    document.body.appendChild(modal);

    // 3. Add Printable Receipt Stage Container (hidden on screen, visible during window.print())
    if (!document.getElementById('tasmac-printable-receipt')) {
      const printContainer = document.createElement('div');
      printContainer.id = 'tasmac-printable-receipt';
      printContainer.style.display = 'none';
      document.body.appendChild(printContainer);
    }
  }

  // Get current logged-in customer object
  function getCustomer() {
    try {
      const raw = localStorage.getItem('tasmac-user');
      if (raw) return JSON.parse(raw);
    } catch (e) {}
    return null;
  }

  // Fetch verified reservations for this customer
  async function loadCustomerReservations() {
    const user = getCustomer();
    if (!user) return { authenticated: false, reservations: [] };

    let results = [];

    // 1. Check local authenticated reservation registry for this user
    try {
      const userKey = `tasmac_user_reservations_${user.id || user.phone || 'auth'}`;
      const localSaved = localStorage.getItem(userKey);
      if (localSaved) {
        const parsed = JSON.parse(localSaved);
        if (Array.isArray(parsed)) results.push(...parsed);
      }
    } catch (e) {}

    // 2. Query live Supabase database if configured and customer has phone/id
    if (window.TASMAC_SUPABASE && window.TASMAC_SUPABASE.isConfigured() && user.phone) {
      try {
        if (window.TASMAC_SUPABASE.getMyReservations) {
          const liveData = await window.TASMAC_SUPABASE.getMyReservations(user.phone);
          if (Array.isArray(liveData)) {
            // Deduplicate by token
            const existingTokens = new Set(results.map(r => r.token));
            liveData.forEach(r => {
              if (!existingTokens.has(r.token)) {
                results.push(r);
              }
            });
          }
        }
      } catch (err) {
        console.warn('Note: Could not query Supabase reservations table:', err);
      }
    }

    // Sort newest first
    results.sort((a, b) => new Date(b.created_at || b.date || 0) - new Date(a.created_at || a.date || 0));

    return { authenticated: true, user, reservations: results };
  }

  // Render modal content
  async function renderModalContent() {
    const container = document.getElementById('tasmac-reservations-content');
    if (!container) return;

    container.innerHTML = `
      <div style="text-align: center; padding: 32px 12px; color: var(--muted-foreground);">
        <div style="font-size: 13px;">Checking verified patron reservation records...</div>
      </div>
    `;

    const data = await loadCustomerReservations();
    const t = window.TASMAC_I18N ? window.TASMAC_I18N.t : (k => k);

    // If customer is not authenticated: Show simple, clean sign-in card
    if (!data.authenticated) {
      container.innerHTML = `
        <div class="tasmac-empty-state">
          <div class="tasmac-empty-icon">
            <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="#ea580c" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
              <rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect>
              <line x1="16" y1="2" x2="16" y2="6"></line>
              <line x1="8" y1="2" x2="8" y2="6"></line>
              <line x1="3" y1="10" x2="21" y2="10"></line>
            </svg>
          </div>
          <h3 style="margin: 0; font-size: 18px; font-weight: 750; color: #0f172a; letter-spacing: -0.01em;">
            ${t('res.login_prompt')}
          </h3>
          <p style="margin: 0; font-size: 13.5px; line-height: 1.5; color: #64748b; max-width: 320px; text-align: center;">
            ${t('res.login_desc') || 'Please sign in to access your reservation tokens and digital receipts.'}
          </p>
          <a href="login.html?redirect=cart.html" class="tasmac-res-auth-btn" style="margin-top: 6px;">
            <span>${t('res.login_btn')}</span>
            <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><path d="M5 12h14"/><path d="m12 5 7 7-7 7"/></svg>
          </a>
          <div style="font-size: 13px; color: #64748b; margin-top: 4px;">
            Don't have an account? <a href="login.html?tab=signup&redirect=cart.html" style="color: #ea580c; font-weight: 600; text-decoration: none;">Create account</a>
          </div>
          <div style="display: flex; align-items: center; justify-content: center; gap: 6px; font-size: 11px; color: #94a3b8; margin-top: 10px; padding-top: 14px; border-top: 1px solid #f1f5f9; width: 100%;">
            <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="#10b981" stroke-width="2"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"></path></svg>
            <span>Strictly 21+ Only • Original Govt ID Required at Pickup</span>
          </div>
        </div>
      `;
      return;
    }

    // If customer has zero reservations: Show clean empty state
    if (data.reservations.length === 0) {
      container.innerHTML = `
        <div class="tasmac-empty-state">
          <div class="tasmac-empty-icon" style="background: #f8fafc; border-color: #e2e8f0; color: #64748b;">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
              <path d="M6 2L3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z"></path>
              <line x1="3" y1="6" x2="21" y2="6"></line>
              <path d="M16 10a4 4 0 0 1-8 0"></path>
            </svg>
          </div>
          <h3 style="margin: 0; font-size: 17px; font-weight: 750; color: #0f172a; letter-spacing: -0.01em;">
            ${t('res.empty_title')}
          </h3>
          <p style="margin: 0; font-size: 13.5px; line-height: 1.5; color: #64748b; max-width: 320px; text-align: center;">
            ${t('res.empty_desc')}
          </p>
          <button type="button" onclick="window.TASMAC_RESERVATIONS.closeModal()" style="display: flex; align-items: center; justify-content: center; gap: 8px; width: 100%; max-width: 220px; height: 38px; background: #0f172a; color: #ffffff; border: none; border-radius: 10px; font-size: 13.5px; font-weight: 600; cursor: pointer; margin-top: 6px; transition: background 0.15s ease;">
            Browse Catalog
          </button>
          <div style="font-size: 12px; color: #64748b; background: #f8fafc; padding: 6px 14px; border-radius: 20px; border: 1px solid #e2e8f0; margin-top: 8px;">
            Patron: <strong>${data.user.name || 'Verified Customer'}</strong> (${data.user.phone || data.user.email || 'Verified 21+'})
          </div>
        </div>
      `;
      return;
    }

    // Render list of verified reservations
    container.innerHTML = data.reservations.map(res => {
      const items = Array.isArray(res.items) ? res.items : [];
      const totalQty = items.reduce((sum, item) => sum + (Number(item.qty) || 1), 0);
      const isDelivery = res.orderType === 'delivery' || res.isDelivery;
      const status = res.status || 'pending';
      let statusLabel = status === 'collected' 
        ? t('res.status_collected') 
        : status === 'cancelled' 
          ? t('res.status_cancelled') 
          : t('res.status_pending');

      if (isDelivery) {
        if (status === 'delivered') {
          statusLabel = 'Delivered';
        } else if (status === 'cancelled') {
          statusLabel = '✕ Cancelled';
        } else {
          statusLabel = '🛵 In Transit';
        }
      }

      const dateStr = res.created_at || res.date 
        ? new Date(res.created_at || res.date).toLocaleString('en-IN', { dateStyle: 'medium', timeStyle: 'short' })
        : 'Confirmed';

      const statusTagStyle = isDelivery 
        ? (status === 'cancelled' 
            ? 'background:#fff1f2; color:#e11d48; border:1px solid #fecdd3;' 
            : (status === 'delivered' 
                ? 'background:#f0fdf4; color:#16a34a; border:1px solid #bbf7d0;' 
                : 'background:#fff7ed; color:#ea580c; border:1px solid #ffedd5;'))
        : '';

      return `
        <div class="tasmac-res-item">
          <div class="tasmac-res-top">
            <div>
              <span style="font-size: 11px; font-weight: 600; color: #64748b; text-transform: uppercase; letter-spacing: 0.05em; display: block; margin-bottom: 2px;">
                ${isDelivery ? '🛵 DOORSTEP DELIVERY' : t('res.token_ref')}
              </span>
              <div class="tasmac-res-token">${res.token}</div>
            </div>
            <span class="tasmac-status-tag ${status}" style="${statusTagStyle}">${statusLabel}</span>
          </div>

          <div class="tasmac-res-meta">
            <div>
              <span style="color: #64748b; font-size: 11.5px;">${isDelivery ? 'Sourced Outlet' : t('res.outlet')}</span>
              <strong style="display: block; margin-top: 2px; color: #0f172a; font-size: 13px;">${res.outlet_name || res.outletName || 'Chennai Express Outlet'}</strong>
            </div>
            <div>
              <span style="color: #64748b; font-size: 11.5px;">${t('res.date')}</span>
              <span style="display: block; margin-top: 2px; color: #0f172a; font-size: 13px; font-weight: 500;">${dateStr}</span>
            </div>
          </div>

          <table class="tasmac-res-table">
            <thead>
              <tr>
                <th>Bottle</th>
                <th style="text-align: center;">Size</th>
                <th style="text-align: center;">Qty</th>
                <th style="text-align: right;">MRP Total</th>
              </tr>
            </thead>
            <tbody>
              ${items.map(it => `
                <tr>
                  <td><strong style="color: #0f172a;">${it.name}</strong></td>
                  <td style="text-align: center; color: #64748b;">${it.size || '750 ml'}</td>
                  <td style="text-align: center; font-weight: 600;">${it.qty || 1}</td>
                  <td style="text-align: right; font-weight: 600; color: #ea580c;">₹${Number(it.price * (it.qty || 1)).toLocaleString()}</td>
                </tr>
              `).join('')}
            </tbody>
          </table>

          <div class="tasmac-res-actions">
            <div class="tasmac-res-total">
              <span style="font-size: 12px; font-weight: normal; color: #64748b;">${t('res.total_mrp')}: </span>
              <span style="color: #ea580c; font-weight: 800;">₹${Number(res.total_amount || res.amount || 0).toLocaleString()}</span>
            </div>
            <div style="display: flex; gap: 8px; flex-wrap: wrap;">
              ${isDelivery ? `
                <button type="button" class="tasmac-btn-print" style="background: #ea580c; color: #ffffff; border-color: #ea580c; font-weight: 700;" onclick="window.TASMAC_DELIVERY && window.TASMAC_DELIVERY.openLiveTracker('${res.token}')">
                  <span>🛵 Track Live</span>
                </button>
                ${status !== 'cancelled' && status !== 'delivered' ? `
                  <button type="button" class="tasmac-btn-print" style="background: #fff1f2; color: #e11d48; border-color: #fecdd3; font-weight: 600;" onclick="window.TASMAC_DELIVERY && window.TASMAC_DELIVERY.openCancelModal('${res.token}')">
                    <span>✕ Cancel</span>
                  </button>
                ` : ''}
              ` : ''}
              <button type="button" class="tasmac-btn-print" onclick="window.TASMAC_RESERVATIONS.printReceipt('${res.token}')">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="6 9 6 2 18 2 18 9"></polyline><path d="M6 18H4a2 2 0 0 1-2-2v-5a2 2 0 0 1 2-2h16a2 2 0 0 1 2 2v5a2 2 0 0 1-2 2h-2"></path><rect x="6" y="14" width="12" height="8"></rect></svg>
                <span>${t('cart.print_receipt')}</span>
              </button>
            </div>
          </div>
        </div>
      `;
    }).join('');
  }

  // Open & Close Reservations Modal
  function openReservationsModal() {
    initReservationsUI();
    const modal = document.getElementById('tasmac-reservations-modal');
    if (modal) {
      const t = window.TASMAC_I18N ? window.TASMAC_I18N.t : (k => k);
      const titleEl = document.getElementById('dash-modal-title');
      const subEl = document.getElementById('dash-modal-subtitle');
      if (titleEl) titleEl.textContent = t('res.dashboard_title') || 'My Reservations';
      if (subEl) subEl.textContent = t('res.dashboard_subtitle') || 'Tokens & pickup history';
      modal.classList.add('open');
      renderModalContent();
    }
  }

  function closeReservationsModal() {
    const modal = document.getElementById('tasmac-reservations-modal');
    if (modal) modal.classList.remove('open');
  }

  // Close on Escape key
  window.addEventListener('keydown', function (e) {
    if (e.key === 'Escape') {
      const modal = document.getElementById('tasmac-reservations-modal');
      if (modal && modal.classList.contains('open')) {
        closeReservationsModal();
      }
    }
  });

  // Save confirmed reservation locally under authenticated customer scope
  function saveCustomerReservation(resObj) {
    const user = getCustomer();
    if (!user) return;

    try {
      const userKey = `tasmac_user_reservations_${user.id || user.phone || 'auth'}`;
      let list = [];
      const raw = localStorage.getItem(userKey);
      if (raw) list = JSON.parse(raw);
      if (!Array.isArray(list)) list = [];

      // Avoid duplicate tokens
      if (!list.some(r => r.token === resObj.token)) {
        list.unshift({
          token: resObj.token,
          customer_name: resObj.name || user.name,
          customer_phone: resObj.phone || user.phone,
          id_type: resObj.idType || user.idType || 'Aadhaar Card',
          outlet_id: resObj.outletId,
          outlet_name: resObj.outletName,
          total_amount: resObj.amount,
          items: resObj.items || [],
          status: 'pending',
          created_at: new Date().toISOString()
        });
        localStorage.setItem(userKey, JSON.stringify(list.slice(0, 50)));
      }
    } catch (e) {
      console.warn('Could not save customer reservation to registry:', e);
    }
  }

  // Browser-supported Print / Save as PDF capability (Window.print)
  function printReceipt(token) {
    const printEl = document.getElementById('tasmac-printable-receipt');
    if (!printEl) return;

    // Find reservation data by token or from current DOM
    let res = null;
    const user = getCustomer();
    if (user) {
      try {
        const userKey = `tasmac_user_reservations_${user.id || user.phone || 'auth'}`;
        const raw = localStorage.getItem(userKey);
        if (raw) {
          const list = JSON.parse(raw);
          res = list.find(r => r.token === token);
        }
      } catch (e) {}
    }

    // Fallback: If printing active success token on cart page
    const activeTokenCode = document.getElementById('receipt-token-code');
    const activeStore = document.getElementById('receipt-store-name');
    const activeCust = document.getElementById('receipt-cust-name');
    const activeAmt = document.getElementById('receipt-total-amount');

    const displayToken = res ? res.token : (activeTokenCode ? activeTokenCode.innerText : (token || 'TSM-EXPRESS'));
    const displayOutlet = res ? res.outlet_name : (activeStore ? activeStore.innerText : 'TASMAC Elite Outlet');
    const displayCust = res ? res.customer_name : (activeCust ? activeCust.innerText : (user?.name || 'Valued Patron'));
    const displayAmt = res ? `₹${Number(res.total_amount).toLocaleString()}` : (activeAmt ? activeAmt.innerText : '₹0');
    const displayItems = res?.items || [];
    const dateStr = res?.created_at ? new Date(res.created_at).toLocaleString('en-IN') : new Date().toLocaleString('en-IN');

    printEl.innerHTML = `
      <div style="max-width: 600px; margin: 0 auto; font-family: monospace; line-height: 1.4;">
        <div style="text-align: center; border-bottom: 2px dashed #000; padding-bottom: 12px; margin-bottom: 16px;">
          <h2 style="margin: 0; font-size: 20px; font-weight: bold; letter-spacing: 0.05em;">TASMAC RESERVE</h2>
          <div style="font-size: 11px; margin-top: 2px;">Tamil Nadu State Marketing Corporation Ltd.</div>
          <div style="font-size: 10px;">Express Retail & Digital Token Queue Confirmation</div>
        </div>

        <div style="margin-bottom: 14px; font-size: 12px;">
          <div><strong>DIGITAL TOKEN:</strong> <span style="font-size: 15px; font-weight: bold;">${displayToken}</span></div>
          <div><strong>DATE & TIME:</strong> ${dateStr}</div>
          <div><strong>PATRON NAME:</strong> ${displayCust}</div>
          <div><strong>PICKUP OUTLET:</strong> ${displayOutlet}</div>
          <div><strong>OPERATING HOURS:</strong> 12:00 PM – 10:00 PM (Daily)</div>
        </div>

        <div style="border-top: 1px dashed #000; border-bottom: 1px dashed #000; padding: 10px 0; margin-bottom: 14px;">
          <table style="width: 100%; font-size: 11px; border-collapse: collapse;">
            <thead>
              <tr style="border-bottom: 1px solid #000;">
                <th style="text-align: left; padding: 4px;">ITEM</th>
                <th style="text-align: center; padding: 4px;">QTY</th>
                <th style="text-align: right; padding: 4px;">MRP</th>
              </tr>
            </thead>
            <tbody>
              ${displayItems.length > 0 ? displayItems.map(it => `
                <tr>
                  <td style="padding: 4px;">${it.name} (${it.size || '750ml'})</td>
                  <td style="text-align: center; padding: 4px;">${it.qty || 1}</td>
                  <td style="text-align: right; padding: 4px;">₹${Number(it.price * (it.qty || 1)).toLocaleString()}</td>
                </tr>
              `).join('') : `
                <tr>
                  <td colspan="3" style="padding: 4px; text-align: center;">Verified Counter Pickup Voucher</td>
                </tr>
              `}
            </tbody>
          </table>
        </div>

        <div style="display: flex; justify-content: space-between; font-size: 14px; font-weight: bold; margin-bottom: 20px;">
          <span>TOTAL STATUTORY MRP:</span>
          <span>${displayAmt}</span>
        </div>

        <div style="border: 1px solid #000; padding: 10px; font-size: 10px; margin-bottom: 16px;">
          <strong>STATUTORY NOTICE:</strong>
          Present this token along with your original Govt Photo ID (21+ age verification) at the dedicated express counter cashier. Liquor permits and statutory quota limits apply under Tamil Nadu State Excise Rules.
        </div>

        <div style="text-align: center; font-size: 10px; border-top: 1px dashed #000; padding-top: 8px;">
          Thank you for patronizing TASMAC Reserve. Drink responsibly.
        </div>
      </div>
    `;

    // Trigger browser print dialog
    window.print();
  }

  // Pre-confirmation Summary Review Dialog
  function showReservationSummary(orderData, onConfirm) {
    let summaryModal = document.getElementById('tasmac-summary-modal');
    if (!summaryModal) {
      summaryModal = document.createElement('div');
      summaryModal.id = 'tasmac-summary-modal';
      summaryModal.className = 'tasmac-modal-veil';
      document.body.appendChild(summaryModal);
    }

    const t = window.TASMAC_I18N ? window.TASMAC_I18N.t : (k => k);
    const items = orderData.items || [];
    const total = orderData.total || 0;

    summaryModal.innerHTML = `
      <div class="tasmac-dash-card" style="max-width: 540px;" onclick="event.stopPropagation()">
        <div class="tasmac-dash-header">
          <div>
            <h2 class="tasmac-dash-title" style="font-size: 17px;">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" style="color: var(--primary, #ea580c);"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path><polyline points="14 2 14 8 20 8"></polyline><line x1="16" y1="13" x2="8" y2="13"></line><line x1="16" y1="17" x2="8" y2="17"></line><polyline points="10 9 9 9 8 9"></polyline></svg>
              <span>${t('summary.title')}</span>
            </h2>
            <p class="tasmac-dash-subtitle">${t('summary.subtitle')}</p>
          </div>
          <button type="button" class="tasmac-dash-close" onclick="document.getElementById('tasmac-summary-modal').classList.remove('open')">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>
          </button>
        </div>

        <div class="tasmac-dash-body" style="gap: 12px;">
          <!-- Outlet & Patron Info -->
          <div style="background: var(--secondary, #f8fafc); border: 1px solid var(--border, #e2e8f0); border-radius: 10px; padding: 12px; font-size: 12.5px; display: flex; flex-direction: column; gap: 6px;">
            <div><span style="color: var(--muted-foreground);">${t('summary.outlet')}:</span> <strong>${orderData.outletName}</strong></div>
            <div><span style="color: var(--muted-foreground);">${t('summary.patron')}:</span> <strong>${orderData.custName}</strong> (${orderData.idType})</div>
          </div>

          <!-- Items Table -->
          <div style="border: 1px solid var(--border, #e2e8f0); border-radius: 10px; overflow: hidden;">
            <table class="tasmac-res-table" style="background: var(--card, #ffffff);">
              <thead>
                <tr>
                  <th>Bottle</th>
                  <th style="text-align: center;">Qty</th>
                  <th style="text-align: right;">MRP Total</th>
                </tr>
              </thead>
              <tbody>
                ${items.map(it => `
                  <tr>
                    <td><strong>${it.name}</strong> <span style="font-size: 11px; color: var(--muted-foreground);">(${it.size})</span></td>
                    <td style="text-align: center; font-family: var(--fp-font-mono);">${it.qty}</td>
                    <td style="text-align: right; font-family: var(--fp-font-mono);">₹${Number(it.price * it.qty).toLocaleString()}</td>
                  </tr>
                `).join('')}
              </tbody>
            </table>
          </div>

          <div style="display: flex; align-items: baseline; justify-content: space-between; padding: 6px 0;">
            <span style="font-size: 13px; font-weight: 600;">Total Payable at Express Counter:</span>
            <span style="font-size: 18px; font-weight: 800; font-family: var(--fp-font-mono); color: var(--primary, #ea580c);">₹${total.toLocaleString()}</span>
          </div>

          <div style="display: flex; gap: 10px; justify-content: flex-end; margin-top: 8px;">
            <button type="button" class="tasmac-btn-print" style="height: 38px; padding: 0 16px;" onclick="document.getElementById('tasmac-summary-modal').classList.remove('open')">
              ${t('summary.edit_action')}
            </button>
            <button type="button" id="tasmac-confirm-modal-btn" class="tasmac-btn-print" style="height: 38px; padding: 0 20px; background: var(--primary, #ea580c); color: #ffffff; border-color: var(--primary, #ea580c); font-weight: 700;">
              ${t('summary.confirm_action')}
            </button>
          </div>
        </div>
      </div>
    `;

    summaryModal.classList.add('open');

    const confirmBtn = document.getElementById('tasmac-confirm-modal-btn');
    if (confirmBtn) {
      confirmBtn.onclick = function () {
        const userJson = localStorage.getItem('tasmac-user');
        let user = null;
        try { if (userJson) user = JSON.parse(userJson); } catch(e) {}
        if (!user || (!user.name && !user.email)) {
          alert('Authentication Required: Please sign in or register to reserve bottles.');
          try { localStorage.setItem('tasmac-auth-redirect', 'cart.html'); } catch(e) {}
          window.location.href = 'login.html?redirect=cart.html';
          return;
        }

        summaryModal.classList.remove('open');
        if (typeof onConfirm === 'function') onConfirm();
      };
    }
  }

  // Auto-init DOM on script load
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initReservationsUI);
  } else {
    initReservationsUI();
  }

  // Live update if order cancelled while modal open
  window.addEventListener('tasmac:orderCancelled', () => {
    const modal = document.getElementById('tasmac-reservations-modal');
    if (modal && modal.classList.contains('open')) {
      renderModalContent();
    }
  });

  // Export module interface
  window.TASMAC_RESERVATIONS = {
    openModal: openReservationsModal,
    closeModal: closeReservationsModal,
    saveReservation: saveCustomerReservation,
    printReceipt: printReceipt,
    showSummary: showReservationSummary
  };
})();

