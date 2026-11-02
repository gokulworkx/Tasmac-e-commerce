/**
 * TASMAC RESERVE — Customer Preferences Controller
 * 
 * Safe Feature Enhancement:
 * - Preserves category, search term, sorting preference, and selected outlet across navigation
 * - Reuses existing localStorage approach
 * - Strictly zero sensitive data stored (no passwords, tokens, or IDs)
 */

(function () {
  'use strict';

  const KEYS = {
    CATEGORY: 'tasmac-pref-cat',
    SEARCH: 'tasmac-pref-search',
    SORT: 'tasmac-pref-sort',
    OUTLET: 'tasmac-selected-outlet-id'
  };

  function getPreference(key, defaultValue = '') {
    try {
      const val = localStorage.getItem(key);
      return val !== null ? val : defaultValue;
    } catch (e) {
      return defaultValue;
    }
  }

  function setPreference(key, value) {
    try {
      if (value === undefined || value === null) {
        localStorage.removeItem(key);
      } else {
        localStorage.setItem(key, String(value));
      }
    } catch (e) {}
  }

  // Restore preferences into index.html catalog state
  function restoreCatalogPreferences() {
    // 1. Restore Category
    const savedCat = getPreference(KEYS.CATEGORY);
    if (savedCat && typeof window.filterCategory === 'function') {
      const chips = document.querySelectorAll('#category-pills .filter-chip-4rge');
      let targetChip = null;
      chips.forEach(chip => {
        const text = chip.textContent || '';
        if (text.includes(savedCat) || (savedCat === 'All' && text.includes('All'))) {
          targetChip = chip;
        }
      });
      if (targetChip) {
        window.filterCategory(savedCat, targetChip);
      }
    }

    // 2. Restore Search Term
    const savedSearch = getPreference(KEYS.SEARCH);
    const searchInput = document.getElementById('catalog-search-input');
    if (savedSearch && searchInput) {
      searchInput.value = savedSearch;
      if (typeof window.handleSearchInput === 'function') {
        window.handleSearchInput(savedSearch);
      }
    }

    // 3. Restore Sorting
    const savedSort = getPreference(KEYS.SORT);
    const sortSelect = document.getElementById('sort-mode-select');
    if (savedSort && sortSelect) {
      sortSelect.value = savedSort;
      if (typeof window.applySorting === 'function') {
        window.applySorting(savedSort);
      }
    }
  }

  // Listeners to automatically persist customer preferences when changed
  function bindPreferenceListeners() {
    // Search input tracking
    const searchInput = document.getElementById('catalog-search-input');
    if (searchInput) {
      searchInput.addEventListener('input', function (e) {
        setPreference(KEYS.SEARCH, e.target.value.trim());
      });
    }

    // Sort select tracking
    const sortSelect = document.getElementById('sort-mode-select');
    if (sortSelect) {
      sortSelect.addEventListener('change', function (e) {
        setPreference(KEYS.SORT, e.target.value);
      });
    }
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => {
      bindPreferenceListeners();
      // Delay catalog restore slightly to allow DOM drinks initialization
      setTimeout(restoreCatalogPreferences, 100);
    });
  } else {
    bindPreferenceListeners();
    setTimeout(restoreCatalogPreferences, 100);
  }

  window.TASMAC_PREFERENCES = {
    getCategory: () => getPreference(KEYS.CATEGORY, 'All'),
    setCategory: (cat) => setPreference(KEYS.CATEGORY, cat),
    getSearch: () => getPreference(KEYS.SEARCH, ''),
    setSearch: (s) => setPreference(KEYS.SEARCH, s),
    getSort: () => getPreference(KEYS.SORT, 'popular'),
    setSort: (s) => setPreference(KEYS.SORT, s),
    getOutletId: () => getPreference(KEYS.OUTLET, '1085'),
    setOutletId: (id) => setPreference(KEYS.OUTLET, id)
  };
})();

