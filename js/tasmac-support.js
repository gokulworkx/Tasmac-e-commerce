/**
 * TASMAC RESERVE — Customer Support & Issue Reporting Controller
 * 
 * Safe Feature Enhancement:
 * - 5 Required Categories: Product information, Outlet information, Reservation problem, Technical issue, Other
 * - Reservation Reference (optional) & Description with client-side validation
 * - Strict Backend Integrity: Only attempts DB insert if suitable backend is provisioned;
 *   otherwise provides honest, clear feedback without pretending reports were submitted to a non-existent table.
 */

(function () {
  'use strict';

  function initSupportUI() {
    if (document.getElementById('tasmac-support-modal')) return;

    // Inject styles
    if (!document.getElementById('tasmac-support-styles')) {
      const style = document.createElement('style');
      style.id = 'tasmac-support-styles';
      style.textContent = `
        #tasmac-support-modal .tasmac-dash-card {
          font-family: 'Plus Jakarta Sans', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif !important;
          border-radius: 16px;
          overflow: visible !important;
        }
        .tasmac-support-form-group {
          display: flex;
          flex-direction: column;
          gap: 6px;
        }
        .tasmac-support-label {
          font-size: 13px;
          font-weight: 600;
          color: var(--foreground, #0f172a);
          letter-spacing: normal;
        }
        .tasmac-support-input, .tasmac-support-textarea {
          width: 100%;
          padding: 10px 14px;
          font-size: 13.5px;
          border: 1px solid var(--border, #cbd5e1);
          border-radius: 8px;
          background: var(--card, #ffffff);
          color: var(--foreground, #0f172a);
          box-sizing: border-box;
          font-family: inherit;
          transition: border-color 0.15s ease, box-shadow 0.15s ease;
        }
        .tasmac-support-input:focus, .tasmac-support-textarea:focus {
          outline: none;
          border-color: var(--primary, #ea580c);
          box-shadow: 0 0 0 3px rgba(234, 88, 12, 0.12);
        }
        .tasmac-support-textarea {
          resize: vertical;
          min-height: 90px;
        }

        /* Custom Support Dropdown Component */
        .support-custom-select {
          position: relative;
          width: 100%;
          user-select: none;
        }
        .support-select-trigger {
          width: 100%;
          height: 42px;
          padding: 0 14px;
          background: var(--card, #ffffff);
          border: 1px solid var(--border, #cbd5e1);
          border-radius: 8px;
          font-size: 13.5px;
          font-family: inherit;
          color: var(--foreground, #0f172a);
          display: flex;
          align-items: center;
          justify-content: space-between;
          cursor: pointer;
          outline: none;
          transition: border-color 0.15s ease, box-shadow 0.15s ease;
          box-sizing: border-box;
        }
        .support-select-trigger:hover {
          border-color: #94a3b8;
        }
        .support-custom-select.open .support-select-trigger,
        .support-select-trigger:focus-visible {
          border-color: var(--primary, #ea580c);
          box-shadow: 0 0 0 3px rgba(234, 88, 12, 0.12);
        }
        .support-select-placeholder {
          color: #64748b;
          font-weight: 450;
        }
        .support-select-placeholder.selected {
          color: var(--foreground, #0f172a);
          font-weight: 550;
        }
        .support-select-chevron {
          color: #64748b;
          transition: transform 0.2s cubic-bezier(0.16, 1, 0.3, 1), color 0.15s ease;
          flex-shrink: 0;
        }
        .support-custom-select.open .support-select-chevron {
          transform: rotate(180deg);
          color: var(--primary, #ea580c);
        }
        .support-select-menu {
          position: absolute;
          top: calc(100% + 4px);
          left: 0;
          width: 100%;
          background: var(--card, #ffffff);
          border: 1px solid rgba(234, 88, 12, 0.25);
          border-radius: 10px;
          padding: 5px;
          box-shadow: 0 12px 28px -4px rgba(0, 0, 0, 0.14), 0 4px 6px -2px rgba(0, 0, 0, 0.04);
          z-index: 1000;
          opacity: 0;
          transform: translateY(-4px) scale(0.98);
          transform-origin: top center;
          pointer-events: none;
          transition: opacity 0.15s ease, transform 0.15s ease;
          box-sizing: border-box;
        }
        .support-custom-select.open .support-select-menu {
          opacity: 1;
          transform: translateY(0) scale(1);
          pointer-events: auto;
        }
        .support-select-item {
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding: 9px 12px;
          border-radius: 6px;
          font-size: 13px;
          font-weight: 500;
          color: var(--foreground, #0f172a);
          cursor: pointer;
          transition: background 0.12s ease, color 0.12s ease;
        }
        .support-select-item:hover {
          background: #fff7ed;
          color: #ea580c;
        }
        .support-select-item.active {
          background: #ffedd5;
          color: #c2410c;
          font-weight: 600;
        }
        .support-select-item-content {
          display: flex;
          align-items: center;
          gap: 9px;
        }
        .support-select-item-content svg {
          color: #ea580c;
          flex-shrink: 0;
        }
        .support-select-check {
          color: #ea580c;
          opacity: 0;
          transition: opacity 0.15s ease;
          flex-shrink: 0;
        }
        .support-select-item.active .support-select-check {
          opacity: 1;
        }

        .tasmac-support-status-box {
          padding: 12px 14px;
          border-radius: 8px;
          font-size: 12.5px;
          line-height: 1.45;
          display: none;
        }
        .tasmac-support-status-box.warning {
          display: block;
          background: #fffbeb;
          border: 1px solid #fde68a;
          color: #92400e;
        }
        .tasmac-support-status-box.error {
          display: block;
          background: #fef2f2;
          border: 1px solid #fee2e2;
          color: #b91c1c;
        }
        .tasmac-support-status-box.success {
          display: block;
          background: #f0fdf4;
          border: 1px solid #dcfce7;
          color: #15803d;
        }
      `;
      document.head.appendChild(style);
    }

    // Create Modal HTML
    const modal = document.createElement('div');
    modal.id = 'tasmac-support-modal';
    modal.className = 'tasmac-modal-veil';
    modal.onclick = function (e) {
      if (e.target === modal) closeSupportModal();
    };

    modal.innerHTML = `
      <div class="tasmac-dash-card" style="max-width: 560px;">
        <div class="tasmac-dash-header">
          <div>
            <h2 class="tasmac-dash-title" style="font-size: 17px;">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" style="color: var(--primary, #ea580c);"><circle cx="12" cy="12" r="10"></circle><path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3"></path><line x1="12" y1="17" x2="12.01" y2="17"></line></svg>
              <span id="support-modal-title">Customer Support & Issue Reporting</span>
            </h2>
            <p class="tasmac-dash-subtitle" id="support-modal-subtitle">Official TASMAC Patron Assistance Desk</p>
          </div>
          <button type="button" class="tasmac-dash-close" onclick="window.TASMAC_SUPPORT.closeModal()" title="Close">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>
          </button>
        </div>

        <form id="tasmac-support-form" class="tasmac-dash-body" onsubmit="window.TASMAC_SUPPORT.handleSubmit(event)">
          <div id="tasmac-support-feedback" class="tasmac-support-status-box"></div>

          <!-- Category Selection -->
          <div class="tasmac-support-form-group">
            <label class="tasmac-support-label" for="support-category">
              Issue Category <span style="color: #e11d48;">*</span>
            </label>
            <select id="support-category" style="display: none;" required>
              <option value="" disabled selected>Select issue category...</option>
              <option value="Product information">Product information</option>
              <option value="Outlet information">Outlet information</option>
              <option value="Reservation problem">Reservation problem</option>
              <option value="Technical issue">Technical issue</option>
              <option value="Other">Other</option>
            </select>

            <div class="support-custom-select" id="support-custom-select">
              <button 
                type="button" 
                class="support-select-trigger" 
                id="support-select-trigger" 
                aria-haspopup="listbox" 
                aria-expanded="false"
                onclick="window.TASMAC_SUPPORT.toggleCategorySelect(event)"
                onkeydown="window.TASMAC_SUPPORT.handleCategoryKeydown(event)"
              >
                <span class="support-select-placeholder" id="support-select-display">Select issue category...</span>
                <svg class="support-select-chevron" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round">
                  <path d="m6 9 6 6 6-6"/>
                </svg>
              </button>

              <div class="support-select-menu" id="support-select-menu" role="listbox">
                <div class="support-select-item" data-value="Product information" onclick="window.TASMAC_SUPPORT.chooseCategory('Product information')">
                  <div class="support-select-item-content">
                    <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="m7.5 4.27 9 5.15"/><path d="M21 8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16Z"/></svg>
                    <span>Product information</span>
                  </div>
                  <svg class="support-select-check" width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><polyline points="20 6 9 17 4 12"/></svg>
                </div>
                <div class="support-select-item" data-value="Outlet information" onclick="window.TASMAC_SUPPORT.chooseCategory('Outlet information')">
                  <div class="support-select-item-content">
                    <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z"/><circle cx="12" cy="10" r="3"/></svg>
                    <span>Outlet information</span>
                  </div>
                  <svg class="support-select-check" width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><polyline points="20 6 9 17 4 12"/></svg>
                </div>
                <div class="support-select-item" data-value="Reservation problem" onclick="window.TASMAC_SUPPORT.chooseCategory('Reservation problem')">
                  <div class="support-select-item-content">
                    <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect width="18" height="18" x="3" y="4" rx="2" ry="2"/><line x1="16" x2="16" y1="2" y2="6"/><line x1="8" x2="8" y1="2" y2="6"/><line x1="3" x2="21" y1="10" y2="10"/></svg>
                    <span>Reservation problem</span>
                  </div>
                  <svg class="support-select-check" width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><polyline points="20 6 9 17 4 12"/></svg>
                </div>
                <div class="support-select-item" data-value="Technical issue" onclick="window.TASMAC_SUPPORT.chooseCategory('Technical issue')">
                  <div class="support-select-item-content">
                    <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect width="20" height="14" x="2" y="3" rx="2"/><line x1="8" x2="16" y1="21" y2="21"/><line x1="12" x2="12" y1="17" y2="21"/></svg>
                    <span>Technical issue</span>
                  </div>
                  <svg class="support-select-check" width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><polyline points="20 6 9 17 4 12"/></svg>
                </div>
                <div class="support-select-item" data-value="Other" onclick="window.TASMAC_SUPPORT.chooseCategory('Other')">
                  <div class="support-select-item-content">
                    <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"/><path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3"/><line x1="12" x2="12.01" y1="17" y2="17"/></svg>
                    <span>Other</span>
                  </div>
                  <svg class="support-select-check" width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><polyline points="20 6 9 17 4 12"/></svg>
                </div>
              </div>
            </div>
          </div>

          <!-- Reservation Reference (Optional) -->
          <div class="tasmac-support-form-group">
            <label class="tasmac-support-label" for="support-ref">
              Reservation Reference <span style="font-weight: normal; color: var(--muted-foreground);">(Optional)</span>
            </label>
            <input type="text" id="support-ref" class="tasmac-support-input" placeholder="e.g. TSM-1085-8821 (if applicable)" />
          </div>

          <!-- Patron Details -->
          <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 12px;">
            <div class="tasmac-support-form-group">
              <label class="tasmac-support-label" for="support-name">Your Name</label>
              <input type="text" id="support-name" class="tasmac-support-input" placeholder="Patron Name" />
            </div>
            <div class="tasmac-support-form-group">
              <label class="tasmac-support-label" for="support-contact">Phone or Email <span style="color: #e11d48;">*</span></label>
              <input type="text" id="support-contact" class="tasmac-support-input" placeholder="+91 or email" required />
            </div>
          </div>

          <!-- Description -->
          <div class="tasmac-support-form-group">
            <label class="tasmac-support-label" for="support-desc">
              Description of the Issue <span style="color: #e11d48;">*</span>
            </label>
            <textarea id="support-desc" class="tasmac-support-textarea" placeholder="Please describe the issue in detail (minimum 10 characters)..." required minlength="10"></textarea>
          </div>

          <!-- Actions -->
          <div style="display: flex; gap: 10px; justify-content: flex-end; margin-top: 8px;">
            <button type="button" class="tasmac-btn-print" style="height: 38px; padding: 0 16px;" onclick="window.TASMAC_SUPPORT.closeModal()">
              Cancel
            </button>
            <button type="submit" id="support-submit-btn" class="tasmac-btn-print" style="height: 38px; padding: 0 20px; background: var(--primary, #ea580c); color: #ffffff; border-color: var(--primary, #ea580c); font-weight: 700;">
              Submit Issue Report
            </button>
          </div>
        </form>
      </div>
    `;

    document.body.appendChild(modal);
  }

  function openSupportModal(presetRef) {
    initSupportUI();
    const modal = document.getElementById('tasmac-support-modal');
    if (!modal) return;

    // Pre-fill user details if logged in
    try {
      const rawUser = localStorage.getItem('tasmac-user');
      if (rawUser) {
        const user = JSON.parse(rawUser);
        const nameInput = document.getElementById('support-name');
        const contactInput = document.getElementById('support-contact');
        if (nameInput && user.name) nameInput.value = user.name;
        if (contactInput) contactInput.value = user.phone || user.email || '';
      }
    } catch (e) {}

    // Preset reference if provided
    if (presetRef) {
      const refInput = document.getElementById('support-ref');
      if (refInput) refInput.value = presetRef;
    }

    // Reset status feedback
    const fb = document.getElementById('tasmac-support-feedback');
    if (fb) {
      fb.className = 'tasmac-support-status-box';
      fb.style.display = 'none';
      fb.innerHTML = '';
    }

    // Reset custom dropdown state
    const display = document.getElementById('support-select-display');
    const select = document.getElementById('support-category');
    if (display && (!select || !select.value)) {
      display.textContent = 'Select issue category...';
      display.classList.remove('selected');
      const wrapper = document.getElementById('support-custom-select');
      if (wrapper) wrapper.querySelectorAll('.support-select-item').forEach(it => it.classList.remove('active'));
    }
    modal.classList.add('open');
  }

  function closeSupportModal() {
    const modal = document.getElementById('tasmac-support-modal');
    if (modal) modal.classList.remove('open');
    const wrapper = document.getElementById('support-custom-select');
    if (wrapper && wrapper.classList.contains('open')) {
      wrapper.classList.remove('open');
      const trig = wrapper.querySelector('.support-select-trigger');
      if (trig) trig.setAttribute('aria-expanded', 'false');
    }
  }

  async function handleSupportSubmit(e) {
    e.preventDefault();
    const fb = document.getElementById('tasmac-support-feedback');
    const cat = document.getElementById('support-category')?.value;
    const ref = document.getElementById('support-ref')?.value?.trim();
    const name = document.getElementById('support-name')?.value?.trim() || 'Patron';
    const contact = document.getElementById('support-contact')?.value?.trim();
    const desc = document.getElementById('support-desc')?.value?.trim();

    // Client-side Validation
    if (!cat) {
      if (fb) {
        fb.className = 'tasmac-support-status-box error';
        fb.innerText = 'Please select an issue category.';
      }
      return;
    }
    if (!desc || desc.length < 10) {
      if (fb) {
        fb.className = 'tasmac-support-status-box error';
        fb.innerText = 'Please enter a description of at least 10 characters.';
      }
      return;
    }
    if (!contact) {
      if (fb) {
        fb.className = 'tasmac-support-status-box error';
        fb.innerText = 'Please provide a contact phone number or email address.';
      }
      return;
    }

    // Strict Backend Requirement Check:
    // Check if Supabase client has a dedicated support ticket table
    let backendStored = false;
    if (window.TASMAC_SUPABASE && window.TASMAC_SUPABASE.submitSupportTicket) {
      try {
        const res = await window.TASMAC_SUPABASE.submitSupportTicket({
          category: cat,
          reference: ref,
          name: name,
          contact: contact,
          description: desc
        });
        if (res && res.success) {
          backendStored = true;
        }
      } catch (err) {
        backendStored = false;
      }
    }

    // Store local draft record so customer never loses their input
    const ticketDraftId = `DRAFT-${Math.floor(100000 + Math.random() * 900000)}`;
    try {
      let drafts = [];
      const saved = localStorage.getItem('tasmac-support-drafts');
      if (saved) drafts = JSON.parse(saved);
      if (!Array.isArray(drafts)) drafts = [];
      drafts.unshift({
        draftId: ticketDraftId,
        category: cat,
        reference: ref,
        name: name,
        contact: contact,
        description: desc,
        date: new Date().toISOString()
      });
      localStorage.setItem('tasmac-support-drafts', JSON.stringify(drafts.slice(0, 20)));
    } catch (err) {}

    // Transparent feedback strictly reflecting backend state (do not pretend report was saved to server if backend table is absent)
    if (backendStored) {
      if (fb) {
        fb.className = 'tasmac-support-status-box success';
        fb.innerHTML = `<strong>Report Submitted Successfully:</strong> Your inquiry has been registered with reference #${ticketDraftId}. Our support supervisor will contact you at ${contact}.`;
      }
      document.getElementById('tasmac-support-form').reset();
      const display = document.getElementById('support-select-display');
      if (display) {
        display.textContent = 'Select issue category...';
        display.classList.remove('selected');
      }
      const wrapper = document.getElementById('support-custom-select');
      if (wrapper) wrapper.querySelectorAll('.support-select-item').forEach(it => it.classList.remove('active'));
    } else {
      if (fb) {
        fb.className = 'tasmac-support-status-box warning';
        fb.innerHTML = `
          <strong>Inquiry Recorded Locally (Ref #${ticketDraftId}):</strong><br>
          <span style="font-size: 11.5px; display: inline-block; margin-top: 4px;">
            <strong>System Status:</strong> The dedicated support database table (<code>public.support_tickets</code>) has not yet been provisioned in Supabase. Your draft has been safely saved on this browser.<br>
            For urgent issues regarding store inventory or pickup, please visit your nearest TASMAC outlet or contact the TASMAC Regional Office at Egmore, Chennai.
          </span>
        `;
      }
    }
  }

  // Auto-init on script load
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initSupportUI);
  } else {
    initSupportUI();
  }


  function toggleCategorySelect(e) {
    if (e) e.stopPropagation();
    const wrapper = document.getElementById('support-custom-select');
    if (!wrapper) return;
    const isOpen = wrapper.classList.contains('open');
    if (isOpen) {
      wrapper.classList.remove('open');
      const trig = wrapper.querySelector('.support-select-trigger');
      if (trig) trig.setAttribute('aria-expanded', 'false');
    } else {
      wrapper.classList.add('open');
      const trig = wrapper.querySelector('.support-select-trigger');
      if (trig) trig.setAttribute('aria-expanded', 'true');
    }
  }

  function chooseCategory(val) {
    const select = document.getElementById('support-category');
    const display = document.getElementById('support-select-display');
    const wrapper = document.getElementById('support-custom-select');
    if (select) {
      select.value = val;
      select.dispatchEvent(new Event('change', { bubbles: true }));
    }
    if (display) {
      display.textContent = val;
      display.classList.add('selected');
    }
    if (wrapper) {
      wrapper.querySelectorAll('.support-select-item').forEach(item => {
        if (item.getAttribute('data-value') === val) {
          item.classList.add('active');
        } else {
          item.classList.remove('active');
        }
      });
      wrapper.classList.remove('open');
      const trig = wrapper.querySelector('.support-select-trigger');
      if (trig) {
        trig.setAttribute('aria-expanded', 'false');
        trig.focus();
      }
    }
  }

  function handleCategoryKeydown(e) {
    const wrapper = document.getElementById('support-custom-select');
    if (!wrapper) return;
    const isOpen = wrapper.classList.contains('open');
    const items = Array.from(wrapper.querySelectorAll('.support-select-item'));
    const activeIndex = items.findIndex(item => item.classList.contains('active'));

    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      if (!isOpen) {
        toggleCategorySelect(e);
      } else if (activeIndex >= 0) {
        chooseCategory(items[activeIndex].getAttribute('data-value'));
      }
    } else if (e.key === 'ArrowDown') {
      e.preventDefault();
      if (!isOpen) {
        toggleCategorySelect(e);
      } else {
        const nextIndex = (activeIndex + 1) % items.length;
        chooseCategory(items[nextIndex].getAttribute('data-value'));
        wrapper.classList.add('open');
      }
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      if (!isOpen) {
        toggleCategorySelect(e);
      } else {
        const prevIndex = (activeIndex - 1 + items.length) % items.length;
        chooseCategory(items[prevIndex].getAttribute('data-value'));
        wrapper.classList.add('open');
      }
    } else if (e.key === 'Escape') {
      if (isOpen) {
        e.preventDefault();
        wrapper.classList.remove('open');
        const trig = wrapper.querySelector('.support-select-trigger');
        if (trig) trig.setAttribute('aria-expanded', 'false');
      }
    }
  }

  function handleDropdownOutsideClick(e) {
    const wrapper = document.getElementById('support-custom-select');
    if (!wrapper || !wrapper.classList.contains('open')) return;
    if (!wrapper.contains(e.target)) {
      wrapper.classList.remove('open');
      const trig = wrapper.querySelector('.support-select-trigger');
      if (trig) trig.setAttribute('aria-expanded', 'false');
    }
  }

  // Handle outside clicks across all phases and devices
  window.addEventListener('click', handleDropdownOutsideClick, true);
  window.addEventListener('touchstart', handleDropdownOutsideClick, { capture: true, passive: true });
  window.addEventListener('focusin', handleDropdownOutsideClick, true);

  // Global escape key listener to close dropdown if open
  window.addEventListener('keydown', function (e) {
    if (e.key === 'Escape') {
      const wrapper = document.getElementById('support-custom-select');
      if (wrapper && wrapper.classList.contains('open')) {
        e.preventDefault();
        e.stopPropagation();
        wrapper.classList.remove('open');
        const trig = wrapper.querySelector('.support-select-trigger');
        if (trig) {
          trig.setAttribute('aria-expanded', 'false');
          trig.focus();
        }
      }
    }
  }, true);

  window.TASMAC_SUPPORT = {
    toggleCategorySelect: toggleCategorySelect,
    chooseCategory: chooseCategory,
    handleCategoryKeydown: handleCategoryKeydown,
    openModal: openSupportModal,
    closeModal: closeSupportModal,
    handleSubmit: handleSupportSubmit
  };
})();

