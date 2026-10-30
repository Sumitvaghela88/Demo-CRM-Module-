/**
 * Fashion Boutique Management System — Core Application Controller
 * Module 1: Overview Dashboard & Module 2: Products Catalogue
 * Studio-quality, human-designed reactive architecture.
 */

(function () {
  'use strict';

  // Make sure BoutiqueData is loaded
  if (typeof BoutiqueData === 'undefined') {
    console.error('BoutiqueData is not loaded. Please ensure data.js is included before app.js.');
    return;
  }

  /* ==========================================================================
     APPLICATION STATE STORE
     ========================================================================== */
  const state = {
    // Current module view: 'overview' | 'products' | 'editor'
    currentView: 'overview',
    
    // Active Role: 'admin' | 'manager' | 'staff'
    role: localStorage.getItem('boutique_role') || 'admin',
    
    // Theme: 'dark' | 'light'
    theme: localStorage.getItem('boutique_theme') || 'dark',

    // Prototype State Simulator: 'normal' | 'empty' | 'loading' | 'error'
    simulatedState: 'normal',

    // Shared Reactive Data
    products: JSON.parse(JSON.stringify(BoutiqueData.INITIAL_PRODUCTS)),
    salesTimeseries: JSON.parse(JSON.stringify(BoutiqueData.SALES_TIMESERIES_60_DAYS)),
    actionOrders: JSON.parse(JSON.stringify(BoutiqueData.ORDERS_NEEDING_ACTION)),
    activityLog: JSON.parse(JSON.stringify(BoutiqueData.INITIAL_ACTIVITY_LOG)),
    notifications: JSON.parse(JSON.stringify(BoutiqueData.NOTIFICATIONS)),
    requests: JSON.parse(JSON.stringify(BoutiqueData.INITIAL_REQUESTS || [])),
    inventoryLedger: JSON.parse(JSON.stringify(BoutiqueData.INITIAL_INVENTORY_LEDGER || [])),
    selectedRequestId: "RET-26-089",
    newCreatedRequestId: null,

    // Module 16: Returns Module State
    returnsList: {
      activeTab: 'all',
      searchQuery: '',
      typeFilter: 'all',
      reasonFilter: 'all',
      dateFilter: 'all'
    },

    // Overview Module State
    overview: {
      dateRange: '30days', // 'today' | '7days' | '30days' | 'this_month' | 'custom'
      chartMetric: 'revenue', // 'revenue' | 'orders'
      chartChannel: 'both', // 'both' | 'online' | 'pos'
      activityUserFilter: 'all',
      activeWidgets: {
        kpi: true,
        chart: true,
        orders: true,
        topprod: true,
        stock: true,
        category: true,
        activity: true,
        actions: true
      }
    },

    // Products Module State
    productsList: {
      layout: 'table', // 'table' | 'grid'
      activeTab: 'all', // 'all' | 'published' | 'draft' | 'low_stock' | 'archived'
      searchQuery: '',
      categoryFilter: 'all',
      stockFilter: 'all',
      priceFilter: 'all',
      sizeFilter: 'all',
      sortColumn: 'name',
      sortDirection: 'asc',
      currentPage: 1,
      rowsPerPage: 25,
      selectedIds: new Set()
    },

    // Product Editor State (Dedicated full-page 8 tabs)
    editor: {
      currentProductId: null, // null for new product
      activeTab: 'tab-basic',
      previewDevice: 'desktop', // 'desktop' | 'mobile'
      isDirty: false,
      formData: null
    },

    // Active Modal / Drawer States
    activeQuickViewId: null,
    stockEditState: {
      productId: null,
      sizeDeltas: {}
    },
    barcodePrintState: {
      product: null,
      variant: null
    },
    csvImportState: {
      step: 1,
      validCount: 3,
      errorCount: 2
    }
  };

  /* ==========================================================================
     ICONS & VECTOR HELPERS
     ========================================================================== */
  const ICONS = {
    check: `<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="20 6 9 17 4 12"/></svg>`,
    alert: `<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"/><line x1="12" x2="12" y1="8" y2="12"/><line x1="12" x2="12.01" y1="16" y2="16"/></svg>`,
    eye: `<svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M2 12s3-7 10-7 10 7 10 7-3 7-10 7-10-7-10-7Z"/><circle cx="12" cy="12" r="3"/></svg>`,
    edit: `<svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M17 3a2.85 2.83 0 1 1 4 4L7.5 20.5 2 22l1.5-5.5Z"/></svg>`,
    stock: `<svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polygon points="12 2 2 7 12 12 22 7 12 2"/><polyline points="2 17 12 22 22 17"/><polyline points="2 12 12 17 22 12"/></svg>`,
    barcode: `<svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M3 5v14"/><path d="M8 5v14"/><path d="M12 5v14"/><path d="M17 5v14"/><path d="M21 5v14"/></svg>`,
    trash: `<svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="3 6 5 6 21 6"/><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"/></svg>`,
    lock: `<svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect width="18" height="11" x="3" y="11" rx="2" ry="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/></svg>`,
    trendUp: `<svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="#2C6344" stroke-width="2.5"><polyline points="23 6 13.5 15.5 8.5 10.5 1 18"/><polyline points="17 6 23 6 23 12"/></svg>`,
    trendDown: `<svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="#8A3838" stroke-width="2.5"><polyline points="23 18 13.5 8.5 8.5 13.5 1 6"/><polyline points="17 18 23 18 23 12"/></svg>`
  };

  /* ==========================================================================
     UTILITY HELPERS
     ========================================================================== */
  function formatUSD(amount) {
    if (amount === undefined || amount === null || isNaN(amount)) return "$0.00";
    return "$" + Number(amount).toLocaleString('en-US', { minimumFractionDigits: 0, maximumFractionDigits: 0 });
  }

  function formatNumber(num) {
    if (num === undefined || num === null) return "0";
    return Number(num).toLocaleString('en-US');
  }

  function escapeHtml(str) {
    if (!str) return "";
    return String(str)
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;")
      .replace(/'/g, "&#039;");
  }

  function showToast(message, type = 'success') {
    const toast = document.getElementById('global-toast');
    const toastMsg = document.getElementById('toast-message');
    if (!toast || !toastMsg) return;

    toastMsg.textContent = message;
    toast.className = 'toast-notification toast-visible';
    if (type === 'error') {
      toast.style.borderColor = 'var(--status-rejected-text)';
    } else {
      toast.style.borderColor = 'var(--stock-in)';
    }

    clearTimeout(toast._timeout);
    toast._timeout = setTimeout(() => {
      toast.className = 'toast-notification';
    }, 3200);
  }

  /* ==========================================================================
     GLOBAL SHELL & ROLE-BASED ACCESS CONTROL (A1 - A5)
     ========================================================================== */
  function initShell() {
    // 1. Sidebar Nav Switching
    const navOverview = document.getElementById('nav-overview');
    const navProducts = document.getElementById('nav-products');
    const navReturns = document.getElementById('nav-returns');

    if (navOverview) {
      navOverview.addEventListener('click', () => switchView('overview'));
    }
    if (navProducts) {
      navProducts.addEventListener('click', () => switchView('products'));
    }
    if (navReturns) {
      navReturns.addEventListener('click', () => switchView('returns'));
    }

    // Customer Portal Switches
    const btnCustomerPortal = document.getElementById('btn-switch-to-customer');
    if (btnCustomerPortal) {
      btnCustomerPortal.addEventListener('click', () => switchView('customer_portal'));
    }
    const btnBackToAdmin = document.getElementById('btn-back-to-admin-from-portal');
    if (btnBackToAdmin) {
      btnBackToAdmin.addEventListener('click', () => switchView('returns'));
    }
    const btnBackFromConfirm = document.getElementById('btn-back-to-admin-from-confirm');
    if (btnBackFromConfirm) {
      btnBackFromConfirm.addEventListener('click', () => {
        switchView('returns');
        if (state.newCreatedRequestId) {
          openReturnDrawer(state.newCreatedRequestId);
        }
      });
    }

    // Inventory Ledger Trigger
    const btnLedger = document.getElementById('btn-view-ledger');
    if (btnLedger) {
      btnLedger.addEventListener('click', openLedgerModal);
    }
    const btnCloseLedger = document.getElementById('btn-close-ledger-modal');
    const btnDismissLedger = document.getElementById('btn-dismiss-ledger-modal');
    if (btnCloseLedger) btnCloseLedger.addEventListener('click', closeLedgerModal);
    if (btnDismissLedger) btnDismissLedger.addEventListener('click', closeLedgerModal);

    // Photo Zoom Modal Close
    const btnCloseZoom = document.getElementById('btn-close-zoom-modal');
    if (btnCloseZoom) {
      btnCloseZoom.addEventListener('click', () => {
        const modal = document.getElementById('photo-zoom-modal');
        if (modal) modal.classList.remove('modal-open');
      });
    }

    // Inactive module links 3 to 15
    document.querySelectorAll('.inactive-module').forEach(item => {
      item.addEventListener('click', function () {
        const modName = this.getAttribute('data-module-name') || 'Module';
        openInactiveModal(modName);
      });
    });

    // Inactive modal close/confirm buttons
    const btnCloseInactive = document.getElementById('btn-close-inactive-modal');
    const btnConfirmInactive = document.getElementById('btn-confirm-inactive-modal');
    const inactiveModal = document.getElementById('inactive-module-modal');

    if (btnCloseInactive) {
      btnCloseInactive.addEventListener('click', () => inactiveModal.classList.remove('modal-open'));
    }
    if (btnConfirmInactive) {
      btnConfirmInactive.addEventListener('click', () => inactiveModal.classList.remove('modal-open'));
    }
    if (inactiveModal) {
      inactiveModal.addEventListener('click', (e) => {
        if (e.target === inactiveModal) inactiveModal.classList.remove('modal-open');
      });
    }

    // Mobile Sidebar Toggle
    const mobileBtn = document.getElementById('mobile-menu-toggle-btn');
    const sidebar = document.getElementById('app-sidebar');
    if (mobileBtn && sidebar) {
      mobileBtn.addEventListener('click', () => {
        sidebar.classList.toggle('sidebar-mobile-open');
      });
    }

    // 2. Role Switcher Buttons
    const btnAdmin = document.getElementById('btn-role-admin');
    const btnManager = document.getElementById('btn-role-manager');
    const btnStaff = document.getElementById('btn-role-staff');

    if (btnAdmin) btnAdmin.addEventListener('click', () => setRole('admin'));
    if (btnManager) btnManager.addEventListener('click', () => setRole('manager'));
    if (btnStaff) btnStaff.addEventListener('click', () => setRole('staff'));

    // 3. Theme Switcher (Dark / Light)
    const btnDark = document.getElementById('btn-theme-dark');
    const btnLight = document.getElementById('btn-theme-light');

    if (btnDark) btnDark.addEventListener('click', () => setTheme('dark'));
    if (btnLight) btnLight.addEventListener('click', () => setTheme('light'));

    // Apply initial theme
    setTheme(state.theme, false);

    // 4. Prototype State Simulator
    const stateSim = document.getElementById('app-state-simulator');
    if (stateSim) {
      stateSim.value = state.simulatedState;
      stateSim.addEventListener('change', (e) => {
        state.simulatedState = e.target.value;
        applySimulatorState();
      });
    }

    // 5. Global Search Autocomplete
    initGlobalSearch();

    // 6. Notification Bell Dropdown
    initNotifications();

    // Update count badges
    updateAllSidebarBadges();

    // Initial role enforcement
    applyRolePermissions();
  }

  function updateAllSidebarBadges() {
    const prodBadge = document.getElementById('sidebar-products-count');
    if (prodBadge) prodBadge.textContent = state.products.length;

    const retBadge = document.getElementById('sidebar-returns-count');
    if (retBadge) retBadge.textContent = state.requests.length;
  }

  function openInactiveModal(title) {
    const inactiveModal = document.getElementById('inactive-module-modal');
    const titleEl = document.getElementById('inactive-module-title');
    if (inactiveModal && titleEl) {
      titleEl.textContent = title;
      inactiveModal.classList.add('modal-open');
    }
  }

  function switchView(viewName, params = {}) {
    state.currentView = viewName;

    // View containers
    const viewOverview = document.getElementById('view-overview');
    const viewProducts = document.getElementById('view-products-list');
    const viewEditor = document.getElementById('view-product-editor');
    const viewReturns = document.getElementById('view-returns');
    const viewPortal = document.getElementById('view-customer-portal');

    // Nav links
    const navOverview = document.getElementById('nav-overview');
    const navProducts = document.getElementById('nav-products');
    const navReturns = document.getElementById('nav-returns');

    // Breadcrumbs
    const crumbCurrent = document.getElementById('breadcrumb-current');

    // Hide all views first
    if (viewOverview) viewOverview.classList.remove('active-view');
    if (viewProducts) viewProducts.classList.remove('active-view');
    if (viewEditor) viewEditor.classList.remove('active-view');
    if (viewReturns) viewReturns.classList.remove('active-view');
    if (viewPortal) viewPortal.classList.remove('active-view');

    if (navOverview) navOverview.classList.remove('active');
    if (navProducts) navProducts.classList.remove('active');
    if (navReturns) navReturns.classList.remove('active');

    // Close mobile sidebar if open
    const sidebar = document.getElementById('app-sidebar');
    if (sidebar) sidebar.classList.remove('sidebar-mobile-open');

    if (viewName === 'overview') {
      if (viewOverview) viewOverview.classList.add('active-view');
      if (navOverview) navOverview.classList.add('active');
      if (crumbCurrent) crumbCurrent.textContent = 'Overview';
      renderOverview();
    } else if (viewName === 'products') {
      if (viewProducts) viewProducts.classList.add('active-view');
      if (navProducts) navProducts.classList.add('active');
      if (crumbCurrent) crumbCurrent.textContent = 'Products Catalogue';
      renderProductsList();
    } else if (viewName === 'editor') {
      if (viewEditor) viewEditor.classList.add('active-view');
      if (navProducts) navProducts.classList.add('active');
      if (crumbCurrent) crumbCurrent.textContent = params.id ? 'Edit Product' : 'Add New Product';
      openProductEditor(params.id || null);
    } else if (viewName === 'returns') {
      if (viewReturns) viewReturns.classList.add('active-view');
      if (navReturns) navReturns.classList.add('active');
      if (crumbCurrent) crumbCurrent.textContent = 'Returns, Exchanges & Refunds';
      renderReturnsModule();
    } else if (viewName === 'customer_portal') {
      if (viewPortal) viewPortal.classList.add('active-view');
      if (crumbCurrent) crumbCurrent.textContent = 'Patron Concierge';
      initCustomerPortal();
    }

    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  function setRole(newRole) {
    state.role = newRole;
    localStorage.setItem('boutique_role', newRole);

    // Update segmented buttons
    document.querySelectorAll('[data-role]').forEach(btn => {
      btn.classList.toggle('active', btn.getAttribute('data-role') === newRole);
    });

    // Update sidebar indicator
    const roleIndicator = document.getElementById('sidebar-role-indicator');
    if (roleIndicator) {
      if (newRole === 'admin') roleIndicator.textContent = 'Admin (Full Rights)';
      else if (newRole === 'manager') roleIndicator.textContent = 'Manager (Catalogue & Reports)';
      else if (newRole === 'staff') roleIndicator.textContent = 'Staff (Stock & Inventory Only)';
    }

    applyRolePermissions();
    showToast(`Role switched to: ${newRole.toUpperCase()}`);

    // Re-render active view to update permissions in place
    if (state.currentView === 'overview') {
      renderOverview();
    } else if (state.currentView === 'products') {
      renderProductsList();
    } else if (state.currentView === 'editor') {
      updateEditorPermissions();
    }
  }

  function applyRolePermissions() {
    const isStaff = state.role === 'staff';
    const isManager = state.role === 'manager';
    const isAdmin = state.role === 'admin';

    // 1. Overview: Staff cannot see revenue figures (KPI locked overlays)
    // Handled in renderOverview()

    // 2. Products List:
    // Delete buttons: Admin only
    const bulkDeleteBtn = document.getElementById('bulk-btn-delete');
    if (bulkDeleteBtn) {
      bulkDeleteBtn.style.display = isAdmin ? 'inline-flex' : 'none';
    }

    // Publish/Unpublish bulk buttons: Admin and Manager only
    const bulkPublish = document.getElementById('bulk-btn-publish');
    const bulkUnpublish = document.getElementById('bulk-btn-unpublish');
    const bulkArchive = document.getElementById('bulk-btn-archive');
    const bulkDiscount = document.getElementById('bulk-btn-discount');

    if (bulkPublish) bulkPublish.style.display = isStaff ? 'none' : 'inline-flex';
    if (bulkUnpublish) bulkUnpublish.style.display = isStaff ? 'none' : 'inline-flex';
    if (bulkArchive) bulkArchive.style.display = isStaff ? 'none' : 'inline-flex';
    if (bulkDiscount) bulkDiscount.style.display = isStaff ? 'none' : 'inline-flex';

    // Add Product button in Products List: Admin & Manager only
    const btnCreateProd = document.getElementById('btn-create-new-product');
    const btnQuickAddProd = document.getElementById('btn-quick-add-product');
    if (btnCreateProd) btnCreateProd.style.display = isStaff ? 'none' : 'inline-flex';
    if (btnQuickAddProd) btnQuickAddProd.style.display = isStaff ? 'none' : 'inline-flex';

    // CSV Import / Export: Export for all, Import for Admin/Manager
    const btnImport = document.getElementById('btn-import-csv');
    if (btnImport) btnImport.style.display = isStaff ? 'none' : 'inline-flex';

    // Dashboard customizer: Admin only
    const btnCustomize = document.getElementById('btn-customize-dashboard');
    if (btnCustomize) btnCustomize.style.display = isAdmin ? 'inline-flex' : 'none';
  }

  function setTheme(themeName, showNotification = true) {
    state.theme = themeName;
    localStorage.setItem('boutique_theme', themeName);

    const body = document.body;
    const btnDark = document.getElementById('btn-theme-dark');
    const btnLight = document.getElementById('btn-theme-light');

    if (themeName === 'dark') {
      body.classList.add('theme-dark');
      body.setAttribute('data-theme', 'dark');
      if (btnDark) btnDark.classList.add('active');
      if (btnLight) btnLight.classList.remove('active');
    } else {
      body.classList.remove('theme-dark');
      body.setAttribute('data-theme', 'light');
      if (btnLight) btnLight.classList.add('active');
      if (btnDark) btnDark.classList.remove('active');
    }

    if (showNotification) {
      showToast(`Switched to ${themeName === 'dark' ? 'Obsidian Dark' : 'Warm Bone Light'} theme`);
    }

    // Re-draw SVG chart with correct color palette
    if (state.currentView === 'overview') {
      renderSalesChart();
    }
  }

  function applySimulatorState() {
    const s = state.simulatedState;
    if (s === 'loading') {
      showToast("Simulating loading skeleton state...", "info");
    } else if (s === 'empty') {
      showToast("Simulating empty store state...", "info");
    } else if (s === 'error') {
      showToast("Simulating network sync error...", "error");
    } else {
      showToast("Simulating normal active operational data.", "success");
    }

    if (state.currentView === 'overview') {
      renderOverview();
    } else if (state.currentView === 'products') {
      renderProductsList();
    }
  }

  /* ==========================================================================
     GLOBAL SEARCH AUTOCOMPLETE (A2)
     ========================================================================== */
  function initGlobalSearch() {
    const searchInput = document.getElementById('global-search-input');
    const dropdown = document.getElementById('global-search-dropdown');
    if (!searchInput || !dropdown) return;

    searchInput.addEventListener('input', function () {
      const q = this.value.trim().toLowerCase();
      if (!q) {
        dropdown.classList.remove('open');
        dropdown.innerHTML = '';
        return;
      }

      // Filter products
      const matchedProducts = state.products.filter(p =>
        p.name.toLowerCase().includes(q) ||
        p.sku.toLowerCase().includes(q) ||
        p.category.toLowerCase().includes(q)
      ).slice(0, 4);

      // Simulated orders matching query
      const sampleOrders = [
        { id: "ORD-24817", customer: "Pooja Sharma", total: "$195.00", status: "Return Requested" },
        { id: "ORD-24812", customer: "Meera Patel", total: "$340.00", status: "Delivered" },
        { id: "ORD-24799", customer: "Ananya Roy", total: "$165.00", status: "Shipped" }
      ].filter(o => o.id.toLowerCase().includes(q) || o.customer.toLowerCase().includes(q));

      // Simulated customers matching query
      const sampleCustomers = [
        { name: "Pooja Sharma", email: "pooja.sharma@example.com", orders: "4 orders" },
        { name: "Meera Patel", email: "meera.patel@example.com", orders: "2 orders" },
        { name: "Devika Sen", email: "devika.sen@example.com", orders: "6 orders" }
      ].filter(c => c.name.toLowerCase().includes(q) || c.email.toLowerCase().includes(q));

      if (matchedProducts.length === 0 && sampleOrders.length === 0 && sampleCustomers.length === 0) {
        dropdown.innerHTML = `<div style="padding: 1rem; text-align: center; font-size: 0.75rem; color: var(--text-muted);">No matching products, orders, or customers found.</div>`;
        dropdown.classList.add('open');
        return;
      }

      let html = '';

      if (matchedProducts.length > 0) {
        html += `<div class="search-category-title">Products (${matchedProducts.length})</div>`;
        matchedProducts.forEach(prod => {
          html += `
            <div class="search-result-item" data-type="product" data-id="${prod.id}">
              <div style="display: flex; align-items: center; justify-content: space-between;">
                <div>
                  <strong style="display: block; font-size: 0.8125rem;">${escapeHtml(prod.name)}</strong>
                  <span class="font-mono text-muted" style="font-size: 0.7rem;">SKU: ${prod.sku} &bull; ${prod.category}</span>
                </div>
                <span class="font-mono" style="font-weight: 600; font-size: 0.8125rem;">${formatUSD(prod.regularPrice)}</span>
              </div>
            </div>
          `;
        });
      }

      if (sampleOrders.length > 0) {
        html += `<div class="search-category-title">Orders (${sampleOrders.length})</div>`;
        sampleOrders.forEach(ord => {
          html += `
            <div class="search-result-item" data-type="order" data-id="${ord.id}">
              <div style="display: flex; align-items: center; justify-content: space-between;">
                <div>
                  <strong style="font-size: 0.8125rem;" class="font-mono">${ord.id}</strong>
                  <span class="text-muted" style="font-size: 0.72rem; margin-left: 0.5rem;">${ord.customer}</span>
                </div>
                <span class="status-pill status-requested font-mono" style="font-size: 0.65rem;">${ord.status}</span>
              </div>
            </div>
          `;
        });
      }

      if (sampleCustomers.length > 0) {
        html += `<div class="search-category-title">Customers (${sampleCustomers.length})</div>`;
        sampleCustomers.forEach(cust => {
          html += `
            <div class="search-result-item" data-type="customer">
              <div>
                <strong style="font-size: 0.8125rem;">${cust.name}</strong>
                <span class="text-muted" style="font-size: 0.7rem; margin-left: 0.5rem;">${cust.email} &bull; ${cust.orders}</span>
              </div>
            </div>
          `;
        });
      }

      dropdown.innerHTML = html;
      dropdown.classList.add('open');

      // Bind result clicks
      dropdown.querySelectorAll('.search-result-item').forEach(item => {
        item.addEventListener('click', function () {
          const type = this.getAttribute('data-type');
          const id = this.getAttribute('data-id');
          dropdown.classList.remove('open');
          searchInput.value = '';

          if (type === 'product' && id) {
            switchView('editor', { id });
          } else if (type === 'order') {
            openInactiveModal('12. Orders & Shipping');
          } else if (type === 'customer') {
            openInactiveModal('15. Customers');
          }
        });
      });
    });

    // Close on click outside or Escape
    document.addEventListener('click', function (e) {
      if (!searchInput.contains(e.target) && !dropdown.contains(e.target)) {
        dropdown.classList.remove('open');
      }
    });

    searchInput.addEventListener('keydown', function (e) {
      if (e.key === 'Escape') {
        dropdown.classList.remove('open');
      }
    });
  }

  /* ==========================================================================
     NOTIFICATIONS BELL DROPDOWN (A2)
     ========================================================================== */
  function initNotifications() {
    const toggleBtn = document.getElementById('btn-notifications-toggle');
    const dropdown = document.getElementById('notifications-dropdown');
    const container = document.getElementById('notifications-list-container');
    const clearBtn = document.getElementById('btn-clear-notifs');
    if (!toggleBtn || !dropdown || !container) return;

    function renderNotifs() {
      const unreadCount = state.notifications.filter(n => n.unread).length;
      const dot = toggleBtn.querySelector('.notif-badge-dot');
      if (dot) dot.style.display = unreadCount > 0 ? 'block' : 'none';

      if (state.notifications.length === 0) {
        container.innerHTML = `<div style="padding: 1.25rem; text-align: center; font-size: 0.75rem; color: var(--text-muted);">No active notifications.</div>`;
        return;
      }

      container.innerHTML = state.notifications.map(n => `
        <div style="padding: 0.65rem 0.85rem; border-bottom: 1px solid var(--border-subtle); background: ${n.unread ? 'rgba(74, 82, 64, 0.08)' : 'transparent'};">
          <div style="display: flex; justify-content: space-between; align-items: baseline; margin-bottom: 0.2rem;">
            <strong style="font-size: 0.78rem;">${escapeHtml(n.title)}</strong>
            <span class="text-muted" style="font-size: 0.6875rem;">${n.time}</span>
          </div>
          <div style="font-size: 0.72rem; color: var(--text-secondary); line-height: 1.35;">${escapeHtml(n.message)}</div>
        </div>
      `).join('');
    }

    toggleBtn.addEventListener('click', (e) => {
      e.stopPropagation();
      dropdown.classList.toggle('open');
      renderNotifs();
    });

    if (clearBtn) {
      clearBtn.addEventListener('click', () => {
        state.notifications.forEach(n => n.unread = false);
        renderNotifs();
        showToast("All notifications marked as read.");
      });
    }

    document.addEventListener('click', (e) => {
      if (!dropdown.contains(e.target) && !toggleBtn.contains(e.target)) {
        dropdown.classList.remove('open');
      }
    });

    renderNotifs();
  }

  /* ==========================================================================
     MODULE 1: OVERVIEW DASHBOARD MODULE (B1 - B12)
     ========================================================================== */
  function renderOverview() {
    const isStaff = state.role === 'staff';
    const s = state.simulatedState;

    // Overview widgets toggling from customizer
    const w = state.overview.activeWidgets;
    toggleWidgetDisplay('widget-kpi-strip', w.kpi);
    toggleWidgetDisplay('widget-sales-chart', w.chart);
    toggleWidgetDisplay('widget-action-orders', w.orders);
    toggleWidgetDisplay('widget-top-products', w.topprod);
    toggleWidgetDisplay('widget-stock-alerts', w.stock);
    toggleWidgetDisplay('widget-category-breakdown', w.category);
    toggleWidgetDisplay('widget-activity-feed', w.activity);
    toggleWidgetDisplay('widget-quick-actions', w.actions);

    // Date range subtitle
    const subTitle = document.getElementById('overview-period-subtitle');
    const dateRangeSelect = document.getElementById('overview-date-range-select');
    if (subTitle && dateRangeSelect) {
      const val = state.overview.dateRange;
      dateRangeSelect.value = val;
      const textMap = {
        today: "Showing performance metrics and studio operations for Today.",
        '7days': "Showing performance metrics and studio operations for the Last 7 Days.",
        '30days': "Showing performance metrics and studio operations for the Last 30 Days.",
        this_month: "Showing performance metrics and studio operations for This Calendar Month.",
        custom: "Showing performance metrics for Selected Custom Range."
      };
      subTitle.textContent = textMap[val] || textMap['30days'];
    }

    // Bind Overview events once
    bindOverviewEvents();

    if (s === 'loading') {
      renderOverviewLoadingSkeleton();
      return;
    }

    if (s === 'empty') {
      renderOverviewEmptyState();
      return;
    }

    if (s === 'error') {
      renderOverviewErrorState();
      return;
    }

    // B1: KPI Strip (6 Figures)
    renderKPIStrip();

    // B3: Sales Over Time Line Chart
    renderSalesChart();

    // B4: Orders Needing Action
    renderActionOrders();

    // B5: Top Selling Products
    renderTopSellingProducts();

    // B6: Low Stock & Depletion Alerts
    renderStockAlerts();

    // B7: Category & Channel Breakdown
    renderCategoryBreakdown();
    renderChannelBreakdown();

    // B8: Activity Feed
    renderActivityFeed();
  }

  function toggleWidgetDisplay(elementId, isVisible) {
    const el = document.getElementById(elementId);
    if (el) {
      el.style.display = isVisible ? '' : 'none';
    }
  }

  function bindOverviewEvents() {
    if (window._overviewEventsBound) return;
    window._overviewEventsBound = true;

    // Date range select
    const dateRangeSelect = document.getElementById('overview-date-range-select');
    if (dateRangeSelect) {
      dateRangeSelect.addEventListener('change', (e) => {
        state.overview.dateRange = e.target.value;
        renderOverview();
      });
    }

    // Chart metric toggles (Revenue vs Orders)
    const btnRev = document.getElementById('btn-chart-metric-rev');
    const btnOrd = document.getElementById('btn-chart-metric-ord');
    if (btnRev && btnOrd) {
      btnRev.addEventListener('click', () => {
        state.overview.chartMetric = 'revenue';
        btnRev.classList.add('active');
        btnOrd.classList.remove('active');
        renderSalesChart();
      });
      btnOrd.addEventListener('click', () => {
        state.overview.chartMetric = 'orders';
        btnOrd.classList.add('active');
        btnRev.classList.remove('active');
        renderSalesChart();
      });
    }

    // Chart channel filter
    const channelSelect = document.getElementById('chart-channel-select');
    if (channelSelect) {
      channelSelect.addEventListener('change', (e) => {
        state.overview.chartChannel = e.target.value;
        renderSalesChart();
      });
    }

    // Orders queue link
    const queueLink = document.getElementById('link-orders-queue');
    if (queueLink) {
      queueLink.addEventListener('click', () => openInactiveModal('12. Orders & Shipping Queue'));
    }

    // Top products header link
    const allProdLink = document.getElementById('link-goto-products');
    if (allProdLink) {
      allProdLink.addEventListener('click', () => switchView('products'));
    }

    // Activity user filter
    const actFilter = document.getElementById('activity-user-filter');
    if (actFilter) {
      actFilter.addEventListener('change', (e) => {
        state.overview.activityUserFilter = e.target.value;
        renderActivityFeed();
      });
    }

    // Quick Action buttons
    const qaAdd = document.getElementById('qa-add-product');
    const qaCoupon = document.getElementById('qa-create-coupon');
    const qaBarcode = document.getElementById('qa-scan-barcode');
    const qaOrders = document.getElementById('qa-view-orders');
    const btnQuickAdd = document.getElementById('btn-quick-add-product');

    if (qaAdd) qaAdd.addEventListener('click', () => switchView('editor'));
    if (btnQuickAdd) btnQuickAdd.addEventListener('click', () => switchView('editor'));
    if (qaCoupon) qaCoupon.addEventListener('click', () => openInactiveModal('14. Coupons & Promotions'));
    if (qaBarcode) qaBarcode.addEventListener('click', () => openInactiveModal('4. Barcodes & Scanning'));
    if (qaOrders) qaOrders.addEventListener('click', () => openInactiveModal('12. Orders & Shipping'));

    // Dashboard Customizer Drawer
    initDashboardCustomizer();
  }

  /* --- B1: KPI STRIP --- */
  function renderKPIStrip() {
    const container = document.getElementById('overview-kpi-container');
    if (!container) return;

    const isStaff = state.role === 'staff';
    const isManager = state.role === 'manager';
    const range = state.overview.dateRange;

    // Calculate aggregated figures from salesTimeseries
    let daysToInclude = 30;
    if (range === 'today') daysToInclude = 1;
    else if (range === '7days') daysToInclude = 7;
    else if (range === '30days' || range === 'this_month' || range === 'custom') daysToInclude = 30;

    const slice = state.salesTimeseries.slice(-daysToInclude);
    let totalRev = 0;
    let prevRev = 0;
    let totalOrders = 0;
    let prevOrders = 0;

    slice.forEach(d => {
      totalRev += d.revenue;
      prevRev += d.prevRevenue;
      totalOrders += d.orders;
      prevOrders += d.prevOrders;
    });

    const revDelta = (((totalRev - prevRev) / prevRev) * 100).toFixed(1);
    const ordDelta = (((totalOrders - prevOrders) / prevOrders) * 100).toFixed(1);
    const aov = Math.round(totalRev / (totalOrders || 1));
    const prevAov = Math.round(prevRev / (prevOrders || 1));
    const aovDelta = (((aov - prevAov) / prevAov) * 100).toFixed(1);

    // Realistic proportional figures for customers, conversion, return rate
    const newCustomers = Math.round(totalOrders * 0.42);
    const convRate = (3.42 + (daysToInclude === 1 ? 0.2 : 0)).toFixed(2) + "%";
    const returnRate = "2.1%";

    // Sparkline SVG generators
    function makeSparkline(dataPoints, isPositive = true) {
      if (!dataPoints || dataPoints.length < 2) return '';
      const min = Math.min(...dataPoints);
      const max = Math.max(...dataPoints);
      const range = max - min || 1;
      const width = 80;
      const height = 24;
      const step = width / (dataPoints.length - 1);

      const points = dataPoints.map((val, idx) => {
        const x = (idx * step).toFixed(1);
        const y = (height - ((val - min) / range) * (height - 4) - 2).toFixed(1);
        return `${x},${y}`;
      }).join(' ');

      const strokeColor = isPositive ? 'var(--stock-in)' : 'var(--stock-out)';
      return `
        <svg class="kpi-sparkline" viewBox="0 0 ${width} ${height}">
          <polyline fill="none" stroke="${strokeColor}" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" points="${points}" />
        </svg>
      `;
    }

    const revSparkPoints = slice.slice(-14).map(d => d.revenue);
    const ordSparkPoints = slice.slice(-14).map(d => d.orders);
    const aovSparkPoints = slice.slice(-14).map(d => d.aov);
    const custSparkPoints = [12, 14, 18, 15, 22, 20, 24, 28, 26, 31, 29, 34, 30, 36];
    const convSparkPoints = [3.1, 3.2, 3.0, 3.3, 3.4, 3.2, 3.5, 3.4, 3.6, 3.5, 3.7, 3.6, 3.8, 3.9];
    const retSparkPoints = [2.4, 2.3, 2.5, 2.2, 2.1, 2.3, 2.0, 2.1, 1.9, 2.2, 2.0, 2.1, 2.0, 2.1];

    const kpiData = [
      {
        id: 'rev',
        title: 'Net Atelier Revenue',
        value: formatUSD(totalRev),
        delta: `+${revDelta}%`,
        isPositive: Number(revDelta) >= 0,
        sub: `vs. ${formatUSD(prevRev)} prior`,
        spark: makeSparkline(revSparkPoints, true),
        isRestrictedForStaff: true
      },
      {
        id: 'ord',
        title: 'Completed Orders',
        value: formatNumber(totalOrders),
        delta: `+${ordDelta}%`,
        isPositive: Number(ordDelta) >= 0,
        sub: `vs. ${formatNumber(prevOrders)} prior`,
        spark: makeSparkline(ordSparkPoints, true),
        isRestrictedForStaff: false
      },
      {
        id: 'aov',
        title: 'Average Order Value',
        value: formatUSD(aov),
        delta: `+${aovDelta}%`,
        isPositive: Number(aovDelta) >= 0,
        sub: `vs. ${formatUSD(prevAov)} prior`,
        spark: makeSparkline(aovSparkPoints, true),
        isRestrictedForStaff: true
      },
      {
        id: 'cust',
        title: 'New Patrons Acquired',
        value: formatNumber(newCustomers),
        delta: '+18.4%',
        isPositive: true,
        sub: 'First-time clients',
        spark: makeSparkline(custSparkPoints, true),
        isRestrictedForStaff: false
      },
      {
        id: 'conv',
        title: 'Online Conversion Rate',
        value: convRate,
        delta: '+0.4%',
        isPositive: true,
        sub: 'Sessions to purchase',
        spark: makeSparkline(convSparkPoints, true),
        isRestrictedForStaff: false
      },
      {
        id: 'ret',
        title: 'Return / Exchange Rate',
        value: returnRate,
        delta: '-0.3%',
        isPositive: true,
        sub: 'Within 7-day window',
        spark: makeSparkline(retSparkPoints, true),
        isRestrictedForStaff: false
      }
    ];

    container.innerHTML = kpiData.map(kpi => {
      const showLockedOverlay = isStaff && kpi.isRestrictedForStaff;

      return `
        <div class="kpi-card" style="position: relative;">
          ${showLockedOverlay ? `
            <div class="kpi-locked-overlay" title="Revenue analytics restricted to Manager & Admin roles.">
              <div style="background: var(--bg-surface); border: 1px solid var(--border-hairline); border-radius: var(--radius-xs); padding: 0.35rem 0.65rem; display: flex; align-items: center; gap: 0.4rem; font-size: 0.72rem; font-weight: 600;">
                ${ICONS.lock}
                <span>Restricted (Staff View)</span>
              </div>
            </div>
          ` : ''}
          <div class="kpi-label-row">
            <span class="kpi-label">${kpi.title}</span>
            <span class="kpi-delta ${kpi.isPositive ? 'positive' : 'negative'}">
              ${kpi.isPositive ? ICONS.trendUp : ICONS.trendDown}
              ${kpi.delta}
            </span>
          </div>
          <div class="kpi-value ${showLockedOverlay ? 'text-muted' : ''}">${showLockedOverlay ? '••••••' : kpi.value}</div>
          <div style="display: flex; justify-content: space-between; align-items: flex-end; margin-top: 0.35rem;">
            <span class="kpi-subtext">${kpi.sub}</span>
            ${!showLockedOverlay ? kpi.spark : ''}
          </div>
        </div>
      `;
    }).join('');
  }

  /* --- B3: SALES OVER TIME LINE CHART --- */
  function renderSalesChart() {
    const svg = document.getElementById('sales-svg-chart');
    const legendCurr = document.getElementById('chart-legend-curr');
    const legendPrev = document.getElementById('chart-legend-prev');
    const dateDisplay = document.getElementById('chart-date-display');
    const tooltip = document.getElementById('chart-tooltip');
    if (!svg) return;

    const metric = state.overview.chartMetric; // 'revenue' | 'orders'
    const channel = state.overview.chartChannel; // 'both' | 'online' | 'pos'
    const range = state.overview.dateRange;

    let daysToInclude = 30;
    if (range === 'today') daysToInclude = 1;
    else if (range === '7days') daysToInclude = 7;
    else if (range === '30days' || range === 'this_month' || range === 'custom') daysToInclude = 30;

    if (dateDisplay) {
      dateDisplay.textContent = range === 'today' ? 'Today' : range === '7days' ? 'Last 7 Days' : 'Last 30 Days';
    }

    const dataSlice = state.salesTimeseries.slice(-daysToInclude);

    // Compute metric values based on channel
    const currentValues = dataSlice.map(d => {
      if (metric === 'revenue') {
        if (channel === 'online') return d.onlineRevenue;
        if (channel === 'pos') return d.posRevenue;
        return d.revenue;
      } else {
        if (channel === 'online') return d.onlineOrders;
        if (channel === 'pos') return d.posOrders;
        return d.orders;
      }
    });

    const previousValues = dataSlice.map(d => {
      if (metric === 'revenue') {
        const factor = channel === 'online' ? 0.7 : channel === 'pos' ? 0.3 : 1;
        return Math.round(d.prevRevenue * factor);
      } else {
        const factor = channel === 'online' ? 0.72 : channel === 'pos' ? 0.28 : 1;
        return Math.round(d.prevOrders * factor);
      }
    });

    const sumCurrent = currentValues.reduce((a, b) => a + b, 0);
    const sumPrevious = previousValues.reduce((a, b) => a + b, 0);

    if (legendCurr) {
      legendCurr.textContent = `Current Period (${metric === 'revenue' ? formatUSD(sumCurrent) : formatNumber(sumCurrent) + ' orders'})`;
    }
    if (legendPrev) {
      legendPrev.textContent = `Previous Period (${metric === 'revenue' ? formatUSD(sumPrevious) : formatNumber(sumPrevious) + ' orders'})`;
    }

    // SVG Canvas Dimensions
    const width = 700;
    const height = 240;
    const paddingLeft = 55;
    const paddingRight = 20;
    const paddingTop = 25;
    const paddingBottom = 35;
    const chartW = width - paddingLeft - paddingRight;
    const chartH = height - paddingTop - paddingBottom;

    const allValues = [...currentValues, ...previousValues];
    const maxVal = Math.max(...allValues, 10) * 1.15;
    const minVal = 0;

    // Helper: coordinate calculation
    function getX(i) {
      if (dataSlice.length === 1) return paddingLeft + chartW / 2;
      return paddingLeft + (i / (dataSlice.length - 1)) * chartW;
    }

    function getY(v) {
      return paddingTop + chartH - ((v - minVal) / (maxVal - minVal)) * chartH;
    }

    // Build Grid Lines & Y-Axis Labels
    const numYGuides = 4;
    let guidesHtml = '';
    for (let i = 0; i <= numYGuides; i++) {
      const v = (maxVal / numYGuides) * i;
      const y = getY(v);
      const label = metric === 'revenue' ? '$' + Math.round(v / 1000) + 'k' : Math.round(v);
      guidesHtml += `
        <line x1="${paddingLeft}" y1="${y}" x2="${width - paddingRight}" y2="${y}" stroke="var(--border-subtle)" stroke-dasharray="3,3" stroke-width="1" />
        <text x="${paddingLeft - 8}" y="${y + 4}" fill="var(--text-muted)" font-size="10" font-family="var(--font-mono)" text-anchor="end">${label}</text>
      `;
    }

    // Build Current Period Line Points & Area Path
    const currPoints = currentValues.map((v, i) => `${getX(i).toFixed(1)},${getY(v).toFixed(1)}`).join(' ');
    const prevPoints = previousValues.map((v, i) => `${getX(i).toFixed(1)},${getY(v).toFixed(1)}`).join(' ');

    const areaPath = `
      M ${getX(0).toFixed(1)},${getY(0)}
      L ${currPoints.split(' ')[0]}
      ${currPoints.split(' ').map(pt => 'L ' + pt).join(' ')}
      L ${getX(dataSlice.length - 1).toFixed(1)},${getY(0)}
      Z
    `;

    // Build X-Axis Date Labels (sample 6 ticks)
    let xLabelsHtml = '';
    const stepTick = Math.max(1, Math.floor(dataSlice.length / 6));
    for (let i = 0; i < dataSlice.length; i += stepTick) {
      const item = dataSlice[i];
      const x = getX(i);
      xLabelsHtml += `
        <text x="${x}" y="${height - 10}" fill="var(--text-muted)" font-size="9" font-family="var(--font-mono)" text-anchor="middle">${item.dayOfWeek} ${item.date.slice(5)}</text>
      `;
    }

    // Accent line stroke
    const accentStroke = state.theme === 'dark' ? '#7A8C6E' : '#3F4A38';
    const areaFill = state.theme === 'dark' ? 'rgba(122, 140, 110, 0.12)' : 'rgba(63, 74, 56, 0.08)';

    svg.innerHTML = `
      ${guidesHtml}
      <path d="${areaPath}" fill="${areaFill}" />
      <!-- Previous Period Dashed Line -->
      <polyline points="${prevPoints}" fill="none" stroke="var(--text-muted)" stroke-opacity="0.5" stroke-dasharray="4,4" stroke-width="1.75" />
      <!-- Current Period Solid Line -->
      <polyline points="${currPoints}" fill="none" stroke="${accentStroke}" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round" />
      <!-- Interactive Data Points -->
      ${currentValues.map((v, i) => `
        <circle class="chart-point" data-index="${i}" cx="${getX(i).toFixed(1)}" cy="${getY(v).toFixed(1)}" r="3" fill="var(--bg-surface)" stroke="${accentStroke}" stroke-width="2" style="cursor: pointer;" />
      `).join('')}
      ${xLabelsHtml}
      <line id="svg-crosshair-line" x1="0" y1="${paddingTop}" x2="0" y2="${paddingTop + chartH}" stroke="var(--accent)" stroke-width="1" stroke-dasharray="2,2" style="display: none;" />
    `;

    // Tooltip interaction
    const crosshair = svg.querySelector('#svg-crosshair-line');
    const points = svg.querySelectorAll('.chart-point');

    svg.onmousemove = function (e) {
      const rect = svg.getBoundingClientRect();
      const mouseX = ((e.clientX - rect.left) / rect.width) * width;

      // Find closest data point
      let closestIdx = 0;
      let minDiff = Infinity;
      dataSlice.forEach((_, i) => {
        const diff = Math.abs(getX(i) - mouseX);
        if (diff < minDiff) {
          minDiff = diff;
          closestIdx = i;
        }
      });

      const ptX = getX(closestIdx);
      const currVal = currentValues[closestIdx];
      const prevVal = previousValues[closestIdx];
      const item = dataSlice[closestIdx];

      if (crosshair) {
        crosshair.setAttribute('x1', ptX);
        crosshair.setAttribute('x2', ptX);
        crosshair.style.display = 'block';
      }

      if (tooltip) {
        const pctDelta = prevVal > 0 ? (((currVal - prevVal) / prevVal) * 100).toFixed(1) : '0';
        tooltip.innerHTML = `
          <div style="font-size: 0.6875rem; color: var(--text-muted); margin-bottom: 0.2rem;">${item.date} (${item.dayOfWeek})</div>
          <div style="font-weight: 700; font-size: 0.85rem; color: var(--text-primary);">Current: ${metric === 'revenue' ? formatUSD(currVal) : currVal + ' orders'}</div>
          <div style="font-size: 0.72rem; color: var(--text-muted); margin-top: 0.15rem;">Previous: ${metric === 'revenue' ? formatUSD(prevVal) : prevVal + ' orders'} <span style="color: ${pctDelta >= 0 ? 'var(--stock-in)' : 'var(--stock-out)'}">(${pctDelta >= 0 ? '+' : ''}${pctDelta}%)</span></div>
        `;
        tooltip.style.display = 'block';
        tooltip.style.left = `${(ptX / width) * 100}%`;
        tooltip.style.top = '15px';
      }
    };

    svg.onmouseleave = function () {
      if (crosshair) crosshair.style.display = 'none';
      if (tooltip) tooltip.style.display = 'none';
    };
  }

  /* --- B4: ORDERS NEEDING ACTION --- */
  function renderActionOrders() {
    const table = document.getElementById('action-orders-table');
    if (!table) return;

    table.innerHTML = state.actionOrders.map(item => `
      <tr style="cursor: pointer;" data-target="${item.target}">
        <td style="width: 28px;">
          <span style="display: inline-block; width: 8px; height: 8px; border-radius: 50%; background: ${item.type === 'returns_awaiting' ? 'var(--stock-low)' : 'var(--accent)'};"></span>
        </td>
        <td>
          <strong style="font-size: 0.78rem;">${escapeHtml(item.title)}</strong>
          <span class="text-muted" style="font-size: 0.6875rem; display: block;">Requires immediate fulfillment attention</span>
        </td>
        <td style="text-align: right; width: 60px;">
          <span class="badge font-mono" style="background: var(--bg-muted); font-weight: 700; padding: 0.2rem 0.5rem; border-radius: 999px;">${item.count}</span>
        </td>
        <td style="text-align: right; width: 130px;">
          <button class="btn-secondary" style="font-size: 0.7rem; padding: 0.25rem 0.5rem;" onclick="event.stopPropagation(); window.openInactiveModuleFromAction('${item.target}')">
            ${item.label} &rarr;
          </button>
        </td>
      </tr>
    `).join('');

    table.querySelectorAll('tr').forEach(row => {
      row.addEventListener('click', function () {
        const target = this.getAttribute('data-target');
        if (target === 'returns') {
          switchView('returns');
        } else {
          const map = {
            orders: '12. Orders & Shipping',
            shipments: '9. Shipments & Operations'
          };
          openInactiveModal(map[target] || 'Module');
        }
      });
    });

    window.openInactiveModuleFromAction = function (target) {
      if (target === 'returns') {
        switchView('returns');
      } else {
        const map = {
          orders: '12. Orders & Shipping',
          shipments: '9. Shipments & Operations'
        };
        openInactiveModal(map[target] || 'Module');
      }
    };
  }

  /* --- B5: TOP SELLING PRODUCTS --- */
  function renderTopSellingProducts() {
    const tbody = document.getElementById('top-products-table-body');
    if (!tbody) return;

    // Calculate actual 30-day revenue per product and sort descending
    const sorted = [...state.products].map(p => {
      const units = p.sales30Days !== undefined ? p.sales30Days : (p.thirtyDaySales || 0);
      const rev = units * p.regularPrice;
      return { ...p, units, rev };
    }).sort((a, b) => b.rev - a.rev).slice(0, 5);

    const growthPercentages = [24, 19, 16, 12, 9];

    tbody.innerHTML = sorted.map((p, idx) => {
      const growth = growthPercentages[idx] || 8;
      const catCode = (p.category || 'GM').slice(0, 2).toUpperCase();

      return `
        <tr style="cursor: pointer;" data-product-id="${p.id}" title="Click to view/edit ${escapeHtml(p.name)} in Products module">
          <td style="width: 36px;">
            <span class="rank-badge">${String(idx + 1).padStart(2, '0')}</span>
          </td>
          <td style="width: 48px;">
            <div class="garment-avatar">
              ${catCode}
            </div>
          </td>
          <td>
            <div style="display: flex; flex-direction: column; gap: 3px; min-width: 0;">
              <strong style="font-size: 0.8125rem; font-weight: 600; color: var(--text-primary); line-height: 1.25; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; max-width: 210px;">${escapeHtml(p.name)}</strong>
              <span class="text-muted font-mono" style="font-size: 0.6875rem;">${p.sku} &bull; ${p.category}</span>
            </div>
          </td>
          <td style="text-align: right; white-space: nowrap; width: 105px;">
            <div style="display: flex; flex-direction: column; align-items: flex-end; gap: 2px;">
              <span class="font-mono" style="font-weight: 700; font-size: 0.8125rem; color: var(--text-primary);">${p.units} pcs</span>
              <span class="font-mono text-muted" style="font-size: 0.6875rem;">${formatUSD(p.rev)}</span>
            </div>
          </td>
          <td style="text-align: right; width: 74px; white-space: nowrap;">
            <span class="status-pill status-published font-mono" style="font-size: 0.6875rem; padding: 0.2rem 0.5rem; display: inline-flex; align-items: center; gap: 3px;">
              <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><polyline points="18 15 12 9 6 15"/></svg>
              +${growth}%
            </span>
          </td>
        </tr>
      `;
    }).join('');

    tbody.querySelectorAll('tr').forEach(row => {
      row.addEventListener('click', function () {
        const pid = this.getAttribute('data-product-id');
        if (pid) {
          switchView('editor', { id: pid });
        }
      });
    });
  }

  /* --- B6: LOW STOCK & DEPLETION ALERTS --- */
  function renderStockAlerts() {
    const tbody = document.getElementById('stock-alerts-table-body');
    const badge = document.getElementById('low-stock-count-badge');
    if (!tbody) return;

    // Scan all product variants for stock <= lowStockThreshold or 0
    const allAlerts = [];
    let depletedCount = 0;

    state.products.forEach(p => {
      if (p.variants && p.variants.length > 0) {
        p.variants.forEach(v => {
          if (v.stock <= 4) {
            if (v.stock === 0) depletedCount++;
            allAlerts.push({
              productId: p.id,
              productName: p.name,
              sku: v.sku,
              size: v.size,
              color: v.color,
              stock: v.stock,
              isOut: v.stock === 0,
              category: p.category
            });
          }
        });
      } else if (p.totalStock <= 4) {
        if (p.totalStock === 0) depletedCount++;
        allAlerts.push({
          productId: p.id,
          productName: p.name,
          sku: p.sku,
          size: "All",
          color: "Standard",
          stock: p.totalStock,
          isOut: p.totalStock === 0,
          category: p.category
        });
      }
    });

    // Update Header Badge with meaningful studio numbers
    if (badge) {
      badge.innerHTML = `
        <span style="color: var(--oxblood); font-weight: 700;">${depletedCount} Depleted</span>
        <span style="color: var(--text-muted); margin: 0 4px;">&bull;</span>
        <span style="color: var(--stock-low); font-weight: 600;">${allAlerts.length} Alerts</span>
      `;
    }

    if (allAlerts.length === 0) {
      tbody.innerHTML = `
        <tr>
          <td colspan="4" style="text-align: center; padding: 2rem 1.15rem; font-size: 0.78rem; color: var(--text-muted);">
            All atelier inventory levels are healthy. Zero replenishment alerts.
          </td>
        </tr>
      `;
      return;
    }

    // Sort by urgency: Depleted (stock = 0) first, then 1, 2, 3...
    allAlerts.sort((a, b) => a.stock - b.stock);

    // Select Top 5 urgent alerts prioritizing unique silhouettes so 5 diverse garments are shown
    const seenProducts = new Set();
    const displayAlerts = [];

    for (const item of allAlerts) {
      if (!seenProducts.has(item.productId)) {
        seenProducts.add(item.productId);
        displayAlerts.push(item);
        if (displayAlerts.length === 5) break;
      }
    }

    // If fewer than 5 unique products, fill with remaining critical items
    if (displayAlerts.length < 5) {
      for (const item of allAlerts) {
        if (!displayAlerts.includes(item)) {
          displayAlerts.push(item);
          if (displayAlerts.length === 5) break;
        }
      }
    }

    tbody.innerHTML = displayAlerts.map(item => `
      <tr>
        <td style="width: 24px; text-align: center;">
          <span style="display: inline-block; width: 9px; height: 9px; border-radius: 50%; background: ${item.isOut ? 'var(--stock-out)' : 'var(--stock-low)'}; box-shadow: 0 0 0 2px ${item.isOut ? 'rgba(168, 72, 72, 0.2)' : 'rgba(229, 178, 89, 0.2)'};" title="${item.isOut ? 'Depleted (Out of Stock)' : 'Low Stock Alert'}"></span>
        </td>
        <td>
          <div style="display: flex; flex-direction: column; gap: 3px; min-width: 0;">
            <strong style="font-size: 0.8125rem; font-weight: 600; color: var(--text-primary); line-height: 1.25; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; max-width: 200px;">${escapeHtml(item.productName)}</strong>
            <span class="text-muted font-mono" style="font-size: 0.6875rem;">Size ${item.size} (${item.color}) &bull; SKU: ${item.sku}</span>
          </div>
        </td>
        <td style="text-align: right; width: 140px; white-space: nowrap;">
          <span class="status-pill ${item.isOut ? 'status-rejected' : 'status-low'} font-mono" style="font-size: 0.6875rem; padding: 0.25rem 0.55rem; display: inline-flex; align-items: center; gap: 4px; font-weight: 600;">
            <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5">
              ${item.isOut ? '<circle cx="12" cy="12" r="10"/><line x1="15" y1="9" x2="9" y2="15"/><line x1="9" y1="9" x2="15" y2="15"/>' : '<path d="m21.73 18-8-14a2 2 0 0 0-3.48 0l-8 14A2 2 0 0 0 4 21h16a2 2 0 0 0 1.73-3Z"/><line x1="12" y1="9" x2="12" y2="13"/><line x1="12" y1="17" x2="12.01" y2="17"/>'}
            </svg>
            ${item.isOut ? '0 pcs (Depleted)' : `${item.stock} ${item.stock === 1 ? 'pc remaining' : 'pcs remaining'}`}
          </span>
        </td>
        <td style="text-align: right; width: 115px; white-space: nowrap;">
          <button class="btn-secondary-action" style="font-size: 0.72rem; padding: 0.3rem 0.6rem; display: inline-flex; align-items: center; gap: 4px;" onclick="window.openQuickStockFromOverview('${item.productId}', '${item.size}')" title="Adjust inventory in Quick Stock modal">
            <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M12 20h9"/><path d="M16.5 3.5a2.12 2.12 0 0 1 3 3L7 19l-4 1 1-4Z"/></svg>
            <span>Update stock</span>
          </button>
        </td>
      </tr>
    `).join('');

    window.openQuickStockFromOverview = function (productId, size) {
      openStockQuickEditModal(productId, size);
    };
  }

  /* --- B7: CATEGORY & CHANNEL BREAKDOWN --- */
  function renderCategoryBreakdown() {
    const container = document.getElementById('category-bars-container');
    if (!container) return;

    // Calculate revenue share per category from products
    const catMap = {};
    state.products.forEach(p => {
      const cat = p.category || 'Other';
      if (!catMap[cat]) catMap[cat] = { revenue: 0, count: 0 };
      const units = p.sales30Days !== undefined ? p.sales30Days : (p.thirtyDaySales || 15);
      catMap[cat].revenue += units * p.regularPrice;
      catMap[cat].count++;
    });

    const totalRev = Object.values(catMap).reduce((sum, item) => sum + item.revenue, 0) || 1;
    const sortedCats = Object.keys(catMap).map(k => ({
      name: k,
      revenue: catMap[k].revenue,
      pct: ((catMap[k].revenue / totalRev) * 100).toFixed(1)
    })).sort((a, b) => b.revenue - a.revenue);

    container.innerHTML = sortedCats.map(cat => `
      <div class="category-bar-row">
        <div class="category-bar-header">
          <span style="font-weight: 500;">${escapeHtml(cat.name)}</span>
          <span class="font-mono text-muted">${formatUSD(cat.revenue)} (${cat.pct}%)</span>
        </div>
        <div class="category-bar-track">
          <div class="category-bar-fill" style="width: ${cat.pct}%;"></div>
        </div>
      </div>
    `).join('');
  }

  function renderChannelBreakdown() {
    const bar = document.getElementById('channel-segmented-bar');
    const legend = document.getElementById('channel-legend-grid');
    if (!bar || !legend) return;

    const channels = [
      { name: "Online Storefront", pct: 72, color: "var(--accent)" },
      { name: "Atelier POS (Delhi)", pct: 23, color: "var(--accent-hover)" },
      { name: "Trunk Shows / Events", pct: 5, color: "var(--text-muted)" }
    ];

    bar.innerHTML = channels.map(c => `
      <div style="width: ${c.pct}%; height: 100%; background: ${c.color};" title="${c.name}: ${c.pct}%"></div>
    `).join('');

    legend.innerHTML = channels.map(c => `
      <div class="channel-legend-item">
        <span class="channel-dot" style="background: ${c.color};"></span>
        <span style="font-weight: 500;">${c.name}</span>
        <span class="font-mono text-muted" style="margin-left: auto;">${c.pct}%</span>
      </div>
    `).join('');
  }

  /* --- B8: RECENT ACTIVITY FEED --- */
  function renderActivityFeed() {
    const container = document.getElementById('activity-feed-container');
    if (!container) return;

    const filter = state.overview.activityUserFilter;
    const filtered = filter === 'all'
      ? state.activityLog
      : state.activityLog.filter(item => item.role === filter);

    if (filtered.length === 0) {
      container.innerHTML = `<div style="padding: 1.5rem; text-align: center; font-size: 0.75rem; color: var(--text-muted);">No activity recorded for this user filter.</div>`;
      return;
    }

    container.innerHTML = filtered.map(item => `
      <div class="activity-feed-item">
        <div class="activity-avatar-circle">
          ${item.user.slice(0, 1)}
        </div>
        <div class="activity-info">
          <div style="display: flex; justify-content: space-between; align-items: baseline;">
            <strong style="font-size: 0.78rem;">${escapeHtml(item.user)}</strong>
            <span class="text-muted" style="font-size: 0.6875rem;">${item.timeAgo}</span>
          </div>
          <div style="font-size: 0.72rem; color: var(--accent); font-weight: 600; margin: 0.1rem 0;">${escapeHtml(item.action)}</div>
          <div style="font-size: 0.72rem; color: var(--text-secondary); line-height: 1.35;">${escapeHtml(item.detail)}</div>
        </div>
      </div>
    `).join('');
  }

  /* --- B10: DASHBOARD CUSTOMIZER DRAWER --- */
  function initDashboardCustomizer() {
    const btnOpen = document.getElementById('btn-customize-dashboard');
    const drawer = document.getElementById('dashboard-customizer-drawer');
    const backdrop = document.getElementById('customizer-drawer-backdrop');
    const btnClose = document.getElementById('btn-close-customizer-drawer');
    const btnSave = document.getElementById('btn-save-customizer-drawer');
    if (!drawer) return;

    const toggles = {
      kpi: document.getElementById('toggle-widget-kpi'),
      chart: document.getElementById('toggle-widget-chart'),
      orders: document.getElementById('toggle-widget-orders'),
      topprod: document.getElementById('toggle-widget-topprod'),
      stock: document.getElementById('toggle-widget-stock'),
      category: document.getElementById('toggle-widget-category'),
      activity: document.getElementById('toggle-widget-activity'),
      actions: document.getElementById('toggle-widget-actions')
    };

    function syncCheckboxes() {
      const w = state.overview.activeWidgets;
      Object.keys(toggles).forEach(k => {
        if (toggles[k]) toggles[k].checked = !!w[k];
      });
    }

    function openDrawer() {
      syncCheckboxes();
      drawer.classList.add('drawer-open');
      if (backdrop) backdrop.classList.add('drawer-open');
    }

    function closeDrawer() {
      drawer.classList.remove('drawer-open');
      if (backdrop) backdrop.classList.remove('drawer-open');
    }

    if (btnOpen) btnOpen.addEventListener('click', openDrawer);
    if (btnClose) btnClose.addEventListener('click', closeDrawer);
    if (backdrop) backdrop.addEventListener('click', closeDrawer);

    if (btnSave) {
      btnSave.addEventListener('click', () => {
        Object.keys(toggles).forEach(k => {
          if (toggles[k]) state.overview.activeWidgets[k] = toggles[k].checked;
        });
        closeDrawer();
        renderOverview();
        showToast("Dashboard layout preferences updated.");
      });
    }
  }

  /* --- B12: OVERVIEW SIMULATOR STATES --- */
  function renderOverviewLoadingSkeleton() {
    const kpiStrip = document.getElementById('overview-kpi-container');
    const topTbody = document.getElementById('top-products-table-body');
    const stockTbody = document.getElementById('stock-alerts-table-body');

    if (kpiStrip) {
      kpiStrip.innerHTML = Array(6).fill(0).map(() => `
        <div class="kpi-card skeleton-box" style="height: 100px;"></div>
      `).join('');
    }

    if (topTbody) {
      topTbody.innerHTML = `<tr><td colspan="5" style="padding: 2rem; text-align: center;"><div class="skeleton-box" style="height: 120px; width: 100%;"></div></td></tr>`;
    }
    if (stockTbody) {
      stockTbody.innerHTML = `<tr><td colspan="4" style="padding: 2rem; text-align: center;"><div class="skeleton-box" style="height: 120px; width: 100%;"></div></td></tr>`;
    }
  }

  function renderOverviewEmptyState() {
    const kpiStrip = document.getElementById('overview-kpi-container');
    const topTbody = document.getElementById('top-products-table-body');
    const stockTbody = document.getElementById('stock-alerts-table-body');

    if (kpiStrip) {
      kpiStrip.innerHTML = Array(6).fill(0).map((_, i) => `
        <div class="kpi-card">
          <div class="kpi-label">${['Revenue', 'Orders', 'AOV', 'Patrons', 'Conversion', 'Returns'][i]}</div>
          <div class="kpi-value">$0.00</div>
          <span class="kpi-subtext">No historical data recorded</span>
        </div>
      `).join('');
    }

    if (topTbody) {
      topTbody.innerHTML = `
        <tr>
          <td colspan="5" style="text-align: center; padding: 2.5rem; color: var(--text-muted); font-size: 0.8125rem;">
            No product sales recorded for this new store profile yet.
          </td>
        </tr>
      `;
    }
    if (stockTbody) {
      stockTbody.innerHTML = `
        <tr>
          <td colspan="4" style="text-align: center; padding: 2.5rem; color: var(--text-muted); font-size: 0.8125rem;">
            No stock warnings to report.
          </td>
        </tr>
      `;
    }
  }

  function renderOverviewErrorState() {
    const kpiStrip = document.getElementById('overview-kpi-container');
    if (kpiStrip) {
      kpiStrip.innerHTML = `
        <div style="grid-column: 1 / -1; background: rgba(138, 56, 56, 0.1); border: 1px solid var(--status-rejected-text); border-radius: var(--radius-sm); padding: 1.5rem; text-align: center;">
          <strong style="color: var(--status-rejected-text); display: block; margin-bottom: 0.35rem;">Telemetry Sync Error (Simulated)</strong>
          <span style="font-size: 0.78rem; color: var(--text-secondary);">Unable to connect to the atelier analytics datastore.</span>
          <div style="margin-top: 0.75rem;">
            <button class="btn-primary" onclick="window.retrySyncState()">Retry Connection</button>
          </div>
        </div>
      `;
    }

    window.retrySyncState = function () {
      state.simulatedState = 'normal';
      const sim = document.getElementById('app-state-simulator');
      if (sim) sim.value = 'normal';
      renderOverview();
      showToast("Store connection re-established.");
    };
  }

  /* ==========================================================================
     MODULE 2: PRODUCTS MODULE (LIST & GRID) (C1 - C6)
     ========================================================================== */
  function renderProductsList() {
    const isStaff = state.role === 'staff';
    const isAdmin = state.role === 'admin';

    // Update sidebar products count badge
    const badge = document.getElementById('sidebar-products-count');
    if (badge) badge.textContent = state.products.length;

    bindProductsEvents();

    // 1. Filter products according to activeTab and filter toolbar
    let filtered = [...state.products];

    // Saved Views Tabs Filter
    const activeTab = state.productsList.activeTab;
    if (activeTab === 'published') {
      filtered = filtered.filter(p => p.status === 'published');
    } else if (activeTab === 'draft') {
      filtered = filtered.filter(p => p.status === 'draft');
    } else if (activeTab === 'low_stock') {
      filtered = filtered.filter(p => (p.totalStock <= 4 || (p.variants && p.variants.some(v => v.stock <= 4))));
    } else if (activeTab === 'archived') {
      filtered = filtered.filter(p => p.status === 'archived');
    }

    // Update Tab Counts
    updateTabCounts();

    // Search Query Filter
    const query = state.productsList.searchQuery.toLowerCase().trim();
    if (query) {
      filtered = filtered.filter(p =>
        p.name.toLowerCase().includes(query) ||
        p.sku.toLowerCase().includes(query) ||
        p.category.toLowerCase().includes(query) ||
        (p.variants && p.variants.some(v => v.sku.toLowerCase().includes(query) || (v.barcode && v.barcode.includes(query))))
      );
    }

    // Category Filter
    const cat = state.productsList.categoryFilter;
    if (cat !== 'all') {
      filtered = filtered.filter(p => p.category === cat);
    }

    // Stock Filter
    const stockFilter = state.productsList.stockFilter;
    if (stockFilter === 'in_stock') {
      filtered = filtered.filter(p => p.totalStock > 4);
    } else if (stockFilter === 'low_stock') {
      filtered = filtered.filter(p => p.totalStock > 0 && p.totalStock <= 4);
    } else if (stockFilter === 'out_stock') {
      filtered = filtered.filter(p => p.totalStock === 0);
    }

    // Price Filter
    const priceFilter = state.productsList.priceFilter;
    if (priceFilter === 'under_150') {
      filtered = filtered.filter(p => p.regularPrice < 150);
    } else if (priceFilter === '150_250') {
      filtered = filtered.filter(p => p.regularPrice >= 150 && p.regularPrice <= 250);
    } else if (priceFilter === 'above_250') {
      filtered = filtered.filter(p => p.regularPrice > 250);
    }

    // Size Filter
    const sizeFilter = state.productsList.sizeFilter;
    if (sizeFilter !== 'all') {
      filtered = filtered.filter(p => p.variants && p.variants.some(v => v.size === sizeFilter && v.stock > 0));
    }

    // Active Filter Chips Strip
    renderActiveFilterChips();

    // Summary Count Label
    const countLabel = document.getElementById('products-table-count-label');
    if (countLabel) {
      countLabel.textContent = `Showing ${filtered.length} of ${state.products.length} products`;
    }

    // 2. Sorting
    const sortCol = state.productsList.sortColumn;
    const sortDir = state.productsList.sortDirection;

    filtered.sort((a, b) => {
      let valA, valB;
      if (sortCol === 'name') {
        valA = a.name.toLowerCase();
        valB = b.name.toLowerCase();
      } else if (sortCol === 'category') {
        valA = a.category.toLowerCase();
        valB = b.category.toLowerCase();
      } else if (sortCol === 'price') {
        valA = a.regularPrice;
        valB = b.regularPrice;
      } else if (sortCol === 'stock') {
        valA = a.totalStock;
        valB = b.totalStock;
      } else if (sortCol === 'status') {
        valA = a.status;
        valB = b.status;
      } else {
        valA = a.id;
        valB = b.id;
      }

      if (valA < valB) return sortDir === 'asc' ? -1 : 1;
      if (valA > valB) return sortDir === 'asc' ? 1 : -1;
      return 0;
    });

    // 3. Pagination
    const totalItems = filtered.length;
    const rpp = state.productsList.rowsPerPage;
    const totalPages = Math.max(1, Math.ceil(totalItems / rpp));
    if (state.productsList.currentPage > totalPages) {
      state.productsList.currentPage = 1;
    }
    const page = state.productsList.currentPage;
    const startIndex = (page - 1) * rpp;
    const pagedProducts = filtered.slice(startIndex, startIndex + rpp);

    // 4. Render Layout (Table or Grid)
    const isTable = state.productsList.layout === 'table';
    const tableContainer = document.getElementById('products-table-container');
    const gridContainer = document.getElementById('products-grid-container');

    if (tableContainer && gridContainer) {
      tableContainer.style.display = isTable ? 'block' : 'none';
      gridContainer.style.display = isTable ? 'none' : 'block';
    }

    if (isTable) {
      renderProductsTable(pagedProducts);
    } else {
      renderProductsGrid(pagedProducts);
    }

    // 5. Render Pagination Controls
    renderPagination(totalItems, totalPages, page);

    // 6. Update Bulk Action Bar
    updateBulkActionBar();
  }

  function updateTabCounts() {
    const allCount = state.products.length;
    const pubCount = state.products.filter(p => p.status === 'published').length;
    const draftCount = state.products.filter(p => p.status === 'draft').length;
    const lowCount = state.products.filter(p => p.totalStock <= 4 || (p.variants && p.variants.some(v => v.stock <= 4))).length;
    const archCount = state.products.filter(p => p.status === 'archived').length;

    const elAll = document.getElementById('tab-count-all');
    const elPub = document.getElementById('tab-count-published');
    const elDraft = document.getElementById('tab-count-draft');
    const elLow = document.getElementById('tab-count-low-stock');
    const elArch = document.getElementById('tab-count-archived');

    if (elAll) elAll.textContent = allCount;
    if (elPub) elPub.textContent = pubCount;
    if (elDraft) elDraft.textContent = draftCount;
    if (elLow) elLow.textContent = lowCount;
    if (elArch) elArch.textContent = archCount;
  }

  function renderActiveFilterChips() {
    const strip = document.getElementById('products-active-filter-chips');
    if (!strip) return;

    const chips = [];
    const pl = state.productsList;

    if (pl.categoryFilter !== 'all') chips.push({ label: `Category: ${pl.categoryFilter}`, key: 'categoryFilter' });
    if (pl.stockFilter !== 'all') {
      const map = { in_stock: 'In Stock', low_stock: 'Low Stock', out_stock: 'Out of Stock' };
      chips.push({ label: `Stock: ${map[pl.stockFilter]}`, key: 'stockFilter' });
    }
    if (pl.priceFilter !== 'all') {
      const map = { under_150: 'Under $150', '150_250': '$150-$250', above_250: 'Above $250' };
      chips.push({ label: `Price: ${map[pl.priceFilter]}`, key: 'priceFilter' });
    }
    if (pl.sizeFilter !== 'all') chips.push({ label: `Size: ${pl.sizeFilter}`, key: 'sizeFilter' });
    if (pl.searchQuery) chips.push({ label: `Search: "${pl.searchQuery}"`, key: 'searchQuery' });

    if (chips.length === 0) {
      strip.style.display = 'none';
      return;
    }

    strip.style.display = 'flex';
    strip.innerHTML = `
      <span class="text-overline" style="font-size: 0.65rem;">Active Filters:</span>
      ${chips.map(c => `
        <span class="filter-chip">
          ${escapeHtml(c.label)}
          <button type="button" class="chip-remove-btn" onclick="window.removeFilterChip('${c.key}')">&times;</button>
        </span>
      `).join('')}
      <button class="text-overline" style="color: var(--accent); cursor: pointer; margin-left: 0.5rem; background: none; border: none;" id="btn-chips-clear-all">Clear All</button>
    `;

    const clearAllBtn = document.getElementById('btn-chips-clear-all');
    if (clearAllBtn) {
      clearAllBtn.addEventListener('click', clearAllFilters);
    }

    window.removeFilterChip = function (key) {
      if (key === 'searchQuery') state.productsList.searchQuery = '';
      else state.productsList[key] = 'all';

      // Sync select dropdowns
      const searchEl = document.getElementById('products-filter-search');
      const catEl = document.getElementById('products-filter-category');
      const stockEl = document.getElementById('products-filter-stock');
      const priceEl = document.getElementById('products-filter-price');
      const sizeEl = document.getElementById('products-filter-size');

      if (searchEl && key === 'searchQuery') searchEl.value = '';
      if (catEl && key === 'categoryFilter') catEl.value = 'all';
      if (stockEl && key === 'stockFilter') stockEl.value = 'all';
      if (priceEl && key === 'priceFilter') priceEl.value = 'all';
      if (sizeEl && key === 'sizeFilter') sizeEl.value = 'all';

      renderProductsList();
    };
  }

  function clearAllFilters() {
    state.productsList.categoryFilter = 'all';
    state.productsList.stockFilter = 'all';
    state.productsList.priceFilter = 'all';
    state.productsList.sizeFilter = 'all';
    state.productsList.searchQuery = '';

    const searchEl = document.getElementById('products-filter-search');
    const catEl = document.getElementById('products-filter-category');
    const stockEl = document.getElementById('products-filter-stock');
    const priceEl = document.getElementById('products-filter-price');
    const sizeEl = document.getElementById('products-filter-size');

    if (searchEl) searchEl.value = '';
    if (catEl) catEl.value = 'all';
    if (stockEl) stockEl.value = 'all';
    if (priceEl) priceEl.value = 'all';
    if (sizeEl) sizeEl.value = 'all';

    renderProductsList();
  }

  function renderProductsTable(products) {
    const tbody = document.getElementById('products-table-body');
    const selectAllCheckbox = document.getElementById('th-select-all-products');
    if (!tbody) return;

    if (products.length === 0) {
      tbody.innerHTML = `
        <tr>
          <td colspan="9" style="text-align: center; padding: 3rem; color: var(--text-muted);">
            <div style="font-size: 0.95rem; font-weight: 600; margin-bottom: 0.25rem;">No products match the selected criteria</div>
            <span style="font-size: 0.75rem;">Try adjusting search terms, categories, or resetting active filters.</span>
          </td>
        </tr>
      `;
      if (selectAllCheckbox) selectAllCheckbox.checked = false;
      return;
    }

    const isStaff = state.role === 'staff';
    const isAdmin = state.role === 'admin';

    tbody.innerHTML = products.map(p => {
      const isSelected = state.productsList.selectedIds.has(p.id);
      const isLowStock = p.totalStock > 0 && p.totalStock <= 4;
      const isOutStock = p.totalStock === 0;

      const statusClass = p.status === 'published' ? 'status-published' : p.status === 'draft' ? 'status-draft' : 'status-archived';
      const statusLabel = p.status.charAt(0).toUpperCase() + p.status.slice(1);

      return `
        <tr class="${isSelected ? 'row-selected' : ''}" data-id="${p.id}">
          <td style="text-align: center;">
            <input type="checkbox" class="product-row-checkbox" data-id="${p.id}" ${isSelected ? 'checked' : ''} />
          </td>
          <td>
            <div style="width: 36px; height: 36px; border-radius: var(--radius-xs); background: var(--bg-subtle); display: flex; align-items: center; justify-content: center; font-size: 0.72rem; font-weight: 600; border: 1px solid var(--border-hairline);">
              ${p.category.slice(0, 2).toUpperCase()}
            </div>
          </td>
          <td>
            <div style="display: flex; flex-direction: column;">
              <strong style="font-size: 0.8125rem; color: var(--text-primary); cursor: pointer;" onclick="window.editProductById('${p.id}')">${escapeHtml(p.name)}</strong>
              <span class="font-mono text-muted" style="font-size: 0.7rem;">SKU: ${p.sku}</span>
            </div>
          </td>
          <td>
            <span style="font-size: 0.78rem;">${escapeHtml(p.category)}</span>
            ${p.subcategory ? `<span class="text-muted" style="font-size: 0.6875rem; display: block;">${p.subcategory}</span>` : ''}
          </td>
          <td>
            <div class="font-mono" style="font-size: 0.8125rem; font-weight: 600;">
              ${formatUSD(p.regularPrice)}
              ${p.salePrice ? `<span class="text-muted" style="font-size: 0.7rem; text-decoration: line-through; margin-left: 0.25rem;">${formatUSD(p.salePrice)}</span>` : ''}
            </div>
          </td>
          <td>
            <div style="display: flex; align-items: center; gap: 0.4rem;">
              <span style="display: inline-block; width: 7px; height: 7px; border-radius: 50%; background: ${isOutStock ? 'var(--stock-out)' : isLowStock ? 'var(--stock-low)' : 'var(--stock-in)'};"></span>
              <span class="font-mono" style="font-size: 0.78rem; font-weight: 600;">${p.totalStock} pcs</span>
            </div>
            <span class="text-muted" style="font-size: 0.6875rem;">${p.variants ? p.variants.length + ' variants' : '1 variant'}</span>
          </td>
          <td>
            <span class="status-pill ${statusClass}">${statusLabel}</span>
          </td>
          <td>
            <span class="text-muted font-mono" style="font-size: 0.72rem;">Oct 29, 2026</span>
          </td>
          <td style="text-align: right;">
            <div style="display: flex; align-items: center; justify-content: flex-end; gap: 0.25rem;">
              <button class="action-icon-btn" title="Quick View Summary" onclick="window.openQuickViewById('${p.id}')">
                ${ICONS.eye}
              </button>
              <button class="action-icon-btn" title="Quick Adjust Stock" onclick="window.openQuickStockModalById('${p.id}')">
                ${ICONS.stock}
              </button>
              <button class="action-icon-btn" title="Print Barcode Hangtag" onclick="window.openBarcodeModalById('${p.id}')">
                ${ICONS.barcode}
              </button>
              <button class="action-icon-btn" title="Edit Silhouette Details" onclick="window.editProductById('${p.id}')">
                ${ICONS.edit}
              </button>
            </div>
          </td>
        </tr>
      `;
    }).join('');

    // Checkbox selection listeners
    tbody.querySelectorAll('.product-row-checkbox').forEach(cb => {
      cb.addEventListener('change', function () {
        const id = this.getAttribute('data-id');
        if (this.checked) {
          state.productsList.selectedIds.add(id);
        } else {
          state.productsList.selectedIds.delete(id);
        }
        updateBulkActionBar();
        renderProductsTable(products);
      });
    });

    if (selectAllCheckbox) {
      const allChecked = products.every(p => state.productsList.selectedIds.has(p.id));
      selectAllCheckbox.checked = products.length > 0 && allChecked;
      selectAllCheckbox.indeterminate = !allChecked && products.some(p => state.productsList.selectedIds.has(p.id));
    }

    // Expose row action helpers to global scope
    window.editProductById = function (id) {
      switchView('editor', { id });
    };
    window.openQuickViewById = function (id) {
      openQuickViewDrawer(id);
    };
    window.openQuickStockModalById = function (id) {
      openStockQuickEditModal(id);
    };
    window.openBarcodeModalById = function (id) {
      openBarcodeModal(id);
    };
  }

  function renderProductsGrid(products) {
    const grid = document.getElementById('products-grid-cards');
    if (!grid) return;

    if (products.length === 0) {
      grid.innerHTML = `<div style="grid-column: 1 / -1; padding: 3rem; text-align: center; color: var(--text-muted);">No products match filter criteria.</div>`;
      return;
    }

    grid.innerHTML = products.map(p => `
      <div class="product-card" onclick="window.editProductById('${p.id}')">
        <div class="product-card-img-wrap">
          <div style="font-size: 1.5rem; color: var(--text-muted); font-family: var(--font-serif);">${p.category.slice(0, 2).toUpperCase()}</div>
          <span class="product-card-badge status-pill ${p.status === 'published' ? 'status-published' : 'status-draft'}">${p.status}</span>
        </div>
        <div class="product-card-body">
          <span class="text-overline" style="font-size: 0.65rem;">${escapeHtml(p.category)}</span>
          <strong class="product-card-title">${escapeHtml(p.name)}</strong>
          <div style="display: flex; justify-content: space-between; align-items: baseline; margin-top: 0.25rem;">
            <span class="font-mono product-card-price">${formatUSD(p.regularPrice)}</span>
            <span class="font-mono text-muted" style="font-size: 0.72rem;">${p.totalStock} pcs</span>
          </div>
        </div>
      </div>
    `).join('');
  }

  function renderPagination(totalItems, totalPages, currentPage) {
    const container = document.getElementById('products-pagination-controls');
    if (!container) return;

    let pagesHtml = '';

    // Prev Button
    pagesHtml += `
      <button class="pagination-page-btn" ${currentPage === 1 ? 'disabled style="opacity: 0.4;"' : ''} onclick="window.gotoProductsPage(${currentPage - 1})">
        &lsaquo; Prev
      </button>
    `;

    // Page Buttons
    for (let i = 1; i <= totalPages; i++) {
      pagesHtml += `
        <button class="pagination-page-btn ${i === currentPage ? 'active' : ''}" onclick="window.gotoProductsPage(${i})">
          ${i}
        </button>
      `;
    }

    // Next Button
    pagesHtml += `
      <button class="pagination-page-btn" ${currentPage === totalPages ? 'disabled style="opacity: 0.4;"' : ''} onclick="window.gotoProductsPage(${currentPage + 1})">
        Next &rsaquo;
      </button>
    `;

    container.innerHTML = pagesHtml;

    window.gotoProductsPage = function (pageNum) {
      state.productsList.currentPage = pageNum;
      renderProductsList();
    };
  }

  function updateBulkActionBar() {
    const bar = document.getElementById('products-bulk-bar');
    const label = document.getElementById('bulk-selected-count');
    if (!bar || !label) return;

    const count = state.productsList.selectedIds.size;
    if (count > 0) {
      bar.classList.add('visible');
      label.textContent = `${count} product${count > 1 ? 's' : ''} selected`;
    } else {
      bar.classList.remove('visible');
    }
  }

  function bindProductsEvents() {
    if (window._productsEventsBound) return;
    window._productsEventsBound = true;

    // View switcher (Table ⇄ Grid)
    const btnTable = document.getElementById('btn-products-view-table');
    const btnGrid = document.getElementById('btn-products-view-grid');

    if (btnTable && btnGrid) {
      btnTable.addEventListener('click', () => {
        state.productsList.layout = 'table';
        btnTable.classList.add('active');
        btnGrid.classList.remove('active');
        renderProductsList();
      });
      btnGrid.addEventListener('click', () => {
        state.productsList.layout = 'grid';
        btnGrid.classList.add('active');
        btnTable.classList.remove('active');
        renderProductsList();
      });
    }

    // Saved Views Tabs
    const tabsContainer = document.getElementById('products-saved-views-tabs');
    if (tabsContainer) {
      tabsContainer.querySelectorAll('.filter-tab').forEach(tab => {
        tab.addEventListener('click', function () {
          tabsContainer.querySelectorAll('.filter-tab').forEach(t => t.classList.remove('active'));
          this.classList.add('active');
          state.productsList.activeTab = this.getAttribute('data-view') || 'all';
          state.productsList.currentPage = 1;
          renderProductsList();
        });
      });
    }

    // Filter controls
    const searchInput = document.getElementById('products-filter-search');
    const catSelect = document.getElementById('products-filter-category');
    const stockSelect = document.getElementById('products-filter-stock');
    const priceSelect = document.getElementById('products-filter-price');
    const sizeSelect = document.getElementById('products-filter-size');
    const clearBtn = document.getElementById('btn-products-clear-filters');
    const rppSelect = document.getElementById('products-rows-per-page');

    if (searchInput) {
      searchInput.addEventListener('input', (e) => {
        state.productsList.searchQuery = e.target.value;
        state.productsList.currentPage = 1;
        renderProductsList();
      });
    }

    if (catSelect) {
      catSelect.addEventListener('change', (e) => {
        state.productsList.categoryFilter = e.target.value;
        state.productsList.currentPage = 1;
        renderProductsList();
      });
    }

    if (stockSelect) {
      stockSelect.addEventListener('change', (e) => {
        state.productsList.stockFilter = e.target.value;
        state.productsList.currentPage = 1;
        renderProductsList();
      });
    }

    if (priceSelect) {
      priceSelect.addEventListener('change', (e) => {
        state.productsList.priceFilter = e.target.value;
        state.productsList.currentPage = 1;
        renderProductsList();
      });
    }

    if (sizeSelect) {
      sizeSelect.addEventListener('change', (e) => {
        state.productsList.sizeFilter = e.target.value;
        state.productsList.currentPage = 1;
        renderProductsList();
      });
    }

    if (clearBtn) clearBtn.addEventListener('click', clearAllFilters);

    if (rppSelect) {
      rppSelect.addEventListener('change', (e) => {
        state.productsList.rowsPerPage = parseInt(e.target.value, 10);
        state.productsList.currentPage = 1;
        renderProductsList();
      });
    }

    // Select All in Table Header
    const selectAllCheckbox = document.getElementById('th-select-all-products');
    if (selectAllCheckbox) {
      selectAllCheckbox.addEventListener('change', function () {
        if (this.checked) {
          state.products.forEach(p => state.productsList.selectedIds.add(p.id));
        } else {
          state.productsList.selectedIds.clear();
        }
        renderProductsList();
      });
    }

    // Table Column Sorting
    document.querySelectorAll('.data-table th.sortable').forEach(th => {
      th.addEventListener('click', function () {
        const col = this.getAttribute('data-sort');
        if (state.productsList.sortColumn === col) {
          state.productsList.sortDirection = state.productsList.sortDirection === 'asc' ? 'desc' : 'asc';
        } else {
          state.productsList.sortColumn = col;
          state.productsList.sortDirection = 'asc';
        }
        renderProductsList();
      });
    });

    // Bulk Action Buttons
    initBulkActions();

    // Export CSV Button
    const btnExport = document.getElementById('btn-export-csv');
    if (btnExport) btnExport.addEventListener('click', handleExportCSV);

    // Import CSV Button
    const btnImport = document.getElementById('btn-import-csv');
    if (btnImport) btnImport.addEventListener('click', openCSVImportModal);

    // Add Product Button
    const btnAdd = document.getElementById('btn-create-new-product');
    if (btnAdd) btnAdd.addEventListener('click', () => switchView('editor'));
  }

  function initBulkActions() {
    const btnPub = document.getElementById('bulk-btn-publish');
    const btnUnpub = document.getElementById('bulk-btn-unpublish');
    const btnArch = document.getElementById('bulk-btn-archive');
    const btnDisc = document.getElementById('bulk-btn-discount');
    const btnDel = document.getElementById('bulk-btn-delete');

    if (btnPub) {
      btnPub.addEventListener('click', () => {
        const ids = state.productsList.selectedIds;
        state.products.forEach(p => {
          if (ids.has(p.id)) p.status = 'published';
        });
        showToast(`Published ${ids.size} selected silhouettes.`);
        state.productsList.selectedIds.clear();
        renderProductsList();
        renderOverview();
      });
    }

    if (btnUnpub) {
      btnUnpub.addEventListener('click', () => {
        const ids = state.productsList.selectedIds;
        state.products.forEach(p => {
          if (ids.has(p.id)) p.status = 'draft';
        });
        showToast(`Moved ${ids.size} products to Draft.`);
        state.productsList.selectedIds.clear();
        renderProductsList();
        renderOverview();
      });
    }

    if (btnArch) {
      btnArch.addEventListener('click', () => {
        const ids = state.productsList.selectedIds;
        state.products.forEach(p => {
          if (ids.has(p.id)) p.status = 'archived';
        });
        showToast(`Archived ${ids.size} products from active sales.`);
        state.productsList.selectedIds.clear();
        renderProductsList();
        renderOverview();
      });
    }

    if (btnDisc) {
      btnDisc.addEventListener('click', () => {
        const ids = state.productsList.selectedIds;
        state.products.forEach(p => {
          if (ids.has(p.id)) {
            p.salePrice = Math.round(p.regularPrice * 0.9);
          }
        });
        showToast(`Applied 10% promotional discount to ${ids.size} items.`);
        state.productsList.selectedIds.clear();
        renderProductsList();
      });
    }

    if (btnDel) {
      btnDel.addEventListener('click', () => {
        const ids = state.productsList.selectedIds;
        if (confirm(`Are you sure you want to permanently delete ${ids.size} selected products? This action cannot be undone.`)) {
          state.products = state.products.filter(p => !ids.has(p.id));
          showToast(`Deleted ${ids.size} products.`);
          state.productsList.selectedIds.clear();
          renderProductsList();
          renderOverview();
        }
      });
    }
  }

  function handleExportCSV() {
    const headers = ["ID", "Name", "SKU", "Category", "RegularPrice", "SalePrice", "TotalStock", "Status"];
    const rows = state.products.map(p => [
      `"${p.id}"`,
      `"${p.name.replace(/"/g, '""')}"`,
      `"${p.sku}"`,
      `"${p.category}"`,
      p.regularPrice,
      p.salePrice || "",
      p.totalStock,
      `"${p.status}"`
    ]);

    const csvContent = [headers.join(','), ...rows.map(r => r.join(','))].join('\n');
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.setAttribute('href', url);
    link.setAttribute('download', `boutique-products-export-${new Date().toISOString().slice(0, 10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    showToast("Products catalogue exported to CSV.");
  }

  /* ==========================================================================
     QUICK VIEW DRAWER (C3)
     ========================================================================== */
  function openQuickViewDrawer(productId) {
    const drawer = document.getElementById('product-quick-view-drawer');
    const backdrop = document.getElementById('product-drawer-backdrop');
    const body = document.getElementById('qview-drawer-body');
    const skuEl = document.getElementById('qview-sku');
    const statusEl = document.getElementById('qview-status');
    const btnClose = document.getElementById('btn-close-qview-drawer');
    if (!drawer || !body) return;

    const prod = state.products.find(p => p.id === productId);
    if (!prod) return;

    state.activeQuickViewId = productId;
    if (skuEl) skuEl.textContent = prod.sku;
    if (statusEl) {
      statusEl.className = `status-pill ${prod.status === 'published' ? 'status-published' : 'status-draft'}`;
      statusEl.textContent = prod.status;
    }

    // Build Size x Color Heat Matrix
    const sizes = BoutiqueData.STANDARD_SIZES;
    const colors = BoutiqueData.STANDARD_COLORS.slice(0, 4);

    let matrixHtml = `
      <div style="margin: 1rem 0;">
        <span class="text-overline" style="display: block; margin-bottom: 0.35rem;">Inventory Heat Matrix (Size &times; Color)</span>
        <div style="border: 1px solid var(--border-hairline); border-radius: var(--radius-xs); overflow-x: auto;">
          <table class="variant-matrix-table" style="font-size: 0.72rem;">
            <thead>
              <tr>
                <th>Color</th>
                ${sizes.map(s => `<th>${s}</th>`).join('')}
              </tr>
            </thead>
            <tbody>
              ${colors.map(col => `
                <tr>
                  <td><strong>${col.name}</strong></td>
                  ${sizes.map(s => {
                    const match = prod.variants ? prod.variants.find(v => v.size === s && v.color === col.name) : null;
                    const stock = match ? match.stock : Math.floor(Math.random() * 8);
                    const colorCls = stock === 0 ? 'var(--stock-out)' : stock <= 3 ? 'var(--stock-low)' : 'var(--stock-in)';
                    return `
                      <td style="text-align: center;">
                        <span style="font-weight: 700; color: ${colorCls}; font-family: var(--font-mono);">${stock}</span>
                      </td>
                    `;
                  }).join('')}
                </tr>
              `).join('')}
            </tbody>
          </table>
        </div>
      </div>
    `;

    body.innerHTML = `
      <div style="height: 180px; background: var(--bg-subtle); border-radius: var(--radius-sm); display: flex; align-items: center; justify-content: center; margin-bottom: 1rem; border: 1px solid var(--border-hairline);">
        <span style="font-family: var(--font-serif); font-size: 2.5rem; color: var(--text-muted);">${prod.category.slice(0, 2).toUpperCase()}</span>
      </div>

      <div style="display: flex; flex-direction: column; gap: 0.35rem; margin-bottom: 1rem;">
        <span class="text-overline" style="color: var(--accent);">${prod.category} &bull; ${prod.collection || 'Atelier Core'}</span>
        <h3 style="font-family: var(--font-serif); font-size: 1.35rem; line-height: 1.2;">${escapeHtml(prod.name)}</h3>
        <div style="display: flex; align-items: baseline; gap: 0.5rem; margin-top: 0.25rem;">
          <span class="font-mono" style="font-size: 1.25rem; font-weight: 700;">${formatUSD(prod.regularPrice)}</span>
          ${prod.salePrice ? `<span class="font-mono text-muted" style="text-decoration: line-through; font-size: 0.85rem;">${formatUSD(prod.salePrice)}</span>` : ''}
        </div>
        <p style="font-size: 0.78rem; color: var(--text-secondary); line-height: 1.45; margin-top: 0.5rem;">
          ${escapeHtml(prod.shortDescription || prod.longDescription || 'Exquisite artisanal silhouette.')}
        </p>
      </div>

      ${matrixHtml}

      <div style="background: var(--bg-subtle); border: 1px solid var(--border-hairline); border-radius: var(--radius-xs); padding: 0.85rem; display: grid; grid-template-columns: 1fr 1fr; gap: 0.75rem; margin-top: 1rem;">
        <div>
          <span class="text-overline" style="font-size: 0.65rem;">30-Day Demand</span>
          <div class="font-mono" style="font-size: 1.05rem; font-weight: 700;">${prod.sales30Days !== undefined ? prod.sales30Days : (prod.thirtyDaySales || 24)} units sold</div>
        </div>
        <div>
          <span class="text-overline" style="font-size: 0.65rem;">Return Incidence</span>
          <div class="font-mono" style="font-size: 1.05rem; font-weight: 700; color: var(--stock-in);">1.8% (Healthy)</div>
        </div>
      </div>

      <div style="margin-top: 1.5rem; display: flex; gap: 0.5rem;">
        <button class="btn-primary" style="flex: 1;" onclick="window.editFromQuickView('${prod.id}')">
          Edit Product (Full 8-Tabs) &rarr;
        </button>
      </div>
    `;

    drawer.classList.add('drawer-open');
    if (backdrop) backdrop.classList.add('drawer-open');

    function closeDrawer() {
      drawer.classList.remove('drawer-open');
      if (backdrop) backdrop.classList.remove('drawer-open');
    }

    if (btnClose) btnClose.onclick = closeDrawer;
    if (backdrop) backdrop.onclick = closeDrawer;

    window.editFromQuickView = function (id) {
      closeDrawer();
      switchView('editor', { id });
    };
  }

  /* ==========================================================================
     QUICK STOCK EDIT MODAL (C4)
     ========================================================================== */
  function openStockQuickEditModal(productId, highlightSize = null) {
    const modal = document.getElementById('stock-quick-edit-modal');
    const nameEl = document.getElementById('quick-stock-product-name');
    const totalEl = document.getElementById('quick-stock-total-display');
    const container = document.getElementById('quick-stock-spinners-container');
    const btnClose = document.getElementById('btn-close-stock-modal');
    const btnCancel = document.getElementById('btn-cancel-stock-modal');
    const btnSave = document.getElementById('btn-save-quick-stock');
    if (!modal || !container) return;

    const prod = state.products.find(p => p.id === productId);
    if (!prod) return;

    state.stockEditState.productId = productId;
    state.stockEditState.sizeDeltas = {};

    if (nameEl) nameEl.textContent = `${prod.name} (${prod.sku})`;
    if (totalEl) totalEl.textContent = `${prod.totalStock} pcs`;

    // Group stock by size
    const sizes = ["XS", "S", "M", "L", "XL", "XXL"];
    const sizeStock = {};
    sizes.forEach(s => sizeStock[s] = 0);

    if (prod.variants && prod.variants.length > 0) {
      prod.variants.forEach(v => {
        if (sizeStock[v.size] !== undefined) {
          sizeStock[v.size] += v.stock;
        }
      });
    } else {
      sizes.forEach(s => sizeStock[s] = Math.round(prod.totalStock / sizes.length));
    }

    container.innerHTML = sizes.map(s => `
      <div style="display: flex; align-items: center; justify-content: space-between; padding: 0.45rem 0.65rem; background: ${highlightSize === s ? 'rgba(74, 82, 64, 0.15)' : 'var(--bg-subtle)'}; border-radius: var(--radius-xs); border: 1px solid var(--border-hairline);">
        <div>
          <strong style="font-size: 0.8125rem;">Size ${s}</strong>
          <span class="text-muted" style="font-size: 0.6875rem; margin-left: 0.5rem;" id="quick-stock-curr-${s}">Current: ${sizeStock[s]} pcs</span>
        </div>
        <div style="display: flex; align-items: center; gap: 0.35rem;">
          <button type="button" class="btn-secondary" style="padding: 0.15rem 0.45rem; font-weight: 700;" onclick="window.deltaQuickStock('${s}', -1)">-</button>
          <input type="number" class="select-filter font-mono" id="quick-stock-input-${s}" value="${sizeStock[s]}" style="width: 60px; text-align: center; padding: 0.25rem;" onchange="window.inputQuickStock('${s}', this.value)" />
          <button type="button" class="btn-secondary" style="padding: 0.15rem 0.45rem; font-weight: 700;" onclick="window.deltaQuickStock('${s}', 1)">+</button>
        </div>
      </div>
    `).join('');

    modal.classList.add('modal-open');

    function closeModal() {
      modal.classList.remove('modal-open');
    }

    if (btnClose) btnClose.onclick = closeModal;
    if (btnCancel) btnCancel.onclick = closeModal;

    window.deltaQuickStock = function (size, delta) {
      const input = document.getElementById(`quick-stock-input-${size}`);
      if (input) {
        let val = parseInt(input.value, 10) || 0;
        val = Math.max(0, val + delta);
        input.value = val;
        recalculateQuickTotal();
      }
    };

    window.inputQuickStock = function (size, val) {
      const input = document.getElementById(`quick-stock-input-${size}`);
      if (input) {
        let n = parseInt(val, 10) || 0;
        input.value = Math.max(0, n);
        recalculateQuickTotal();
      }
    };

    function recalculateQuickTotal() {
      let sum = 0;
      sizes.forEach(s => {
        const input = document.getElementById(`quick-stock-input-${s}`);
        if (input) sum += parseInt(input.value, 10) || 0;
      });
      if (totalEl) totalEl.textContent = `${sum} pcs`;
    }

    if (btnSave) {
      btnSave.onclick = function () {
        let newTotal = 0;
        const reason = document.getElementById('quick-stock-reason-select').value;

        sizes.forEach(s => {
          const input = document.getElementById(`quick-stock-input-${s}`);
          const qty = input ? parseInt(input.value, 10) || 0 : 0;
          newTotal += qty;

          // Update matching variants in product
          if (prod.variants) {
            const matches = prod.variants.filter(v => v.size === s);
            if (matches.length > 0) {
              const perVariant = Math.floor(qty / matches.length);
              matches.forEach(m => m.stock = perVariant);
            }
          }
        });

        const oldTotal = prod.totalStock;
        prod.totalStock = newTotal;

        // Add to activity ledger
        const delta = newTotal - oldTotal;
        const deltaSign = delta >= 0 ? `+${delta}` : `${delta}`;
        state.activityLog.unshift({
          id: `act-${Date.now()}`,
          timestamp: "Just now",
          timeAgo: "Just now",
          user: state.role === 'admin' ? "Admin (Store Owner)" : state.role === 'manager' ? "Manager (Priya)" : "Staff (Sunita)",
          role: state.role,
          action: "Adjusted Stock",
          detail: `Reconciled stock for ${prod.name} (${deltaSign} pcs, Total: ${newTotal}). Reason: ${reason}.`,
          productId: prod.id
        });

        closeModal();
        showToast(`Stock reconciled for ${prod.name} (${newTotal} pcs total).`);

        // Refresh views
        if (state.currentView === 'products') renderProductsList();
        renderOverview();
      };
    }
  }

  /* ==========================================================================
     BARCODE HANGTAG PRINT MODAL (C5)
     ========================================================================== */
  function openBarcodeModal(productId) {
    const modal = document.getElementById('barcode-print-modal');
    const nameEl = document.getElementById('hangtag-name');
    const skuEl = document.getElementById('hangtag-sku');
    const sizeEl = document.getElementById('hangtag-size');
    const colorEl = document.getElementById('hangtag-color');
    const barcodeNumEl = document.getElementById('hangtag-barcode-num');
    const priceEl = document.getElementById('hangtag-price');
    const btnClose = document.getElementById('btn-close-barcode-modal');
    const btnCancel = document.getElementById('btn-cancel-barcode');
    const btnPrint = document.getElementById('btn-trigger-print');
    if (!modal) return;

    const prod = state.products.find(p => p.id === productId);
    if (!prod) return;

    if (nameEl) nameEl.textContent = prod.name;
    if (skuEl) skuEl.textContent = prod.sku + "-M";
    if (sizeEl) sizeEl.textContent = "M";
    if (colorEl) colorEl.textContent = prod.variants && prod.variants[0] ? prod.variants[0].color : "Standard";
    if (barcodeNumEl) barcodeNumEl.textContent = prod.variants && prod.variants[0] ? prod.variants[0].barcode : "890412345001";
    if (priceEl) priceEl.textContent = formatUSD(prod.regularPrice);

    modal.classList.add('modal-open');

    function closeModal() {
      modal.classList.remove('modal-open');
    }

    if (btnClose) btnClose.onclick = closeModal;
    if (btnCancel) btnCancel.onclick = closeModal;

    if (btnPrint) {
      btnPrint.onclick = function () {
        showToast(`Sending thermal hangtag for ${prod.name} to barcode printer...`);
        closeModal();
      };
    }
  }

  /* ==========================================================================
     CSV IMPORT WIZARD (C1)
     ========================================================================== */
  function openCSVImportModal() {
    const modal = document.getElementById('csv-import-modal');
    const step1 = document.getElementById('import-step-1');
    const step2 = document.getElementById('import-step-2');
    const stepLabel = document.getElementById('import-step-label');
    const dropzone = document.getElementById('import-file-dropzone');
    const tableBody = document.getElementById('import-validation-table-body');
    const btnClose = document.getElementById('btn-close-import-modal');
    const btnCancel = document.getElementById('btn-cancel-import');
    const btnProceed = document.getElementById('btn-proceed-import');
    const btnSample = document.getElementById('btn-download-sample-csv');
    if (!modal) return;

    // Reset wizard
    state.csvImportState.step = 1;
    if (step1) step1.style.display = 'block';
    if (step2) step2.style.display = 'none';
    if (stepLabel) stepLabel.textContent = "Step 1: Upload & Map Columns";
    if (btnProceed) {
      btnProceed.disabled = true;
      btnProceed.textContent = "Validate & Ingest Valid Rows";
    }

    modal.classList.add('modal-open');

    function closeModal() {
      modal.classList.remove('modal-open');
    }

    if (btnClose) btnClose.onclick = closeModal;
    if (btnCancel) btnCancel.onclick = closeModal;

    // Dropzone upload simulation
    if (dropzone) {
      dropzone.onclick = function () {
        // Switch to Step 2 with deliberate realistic validation errors
        state.csvImportState.step = 2;
        if (step1) step1.style.display = 'none';
        if (step2) step2.style.display = 'block';
        if (stepLabel) stepLabel.textContent = "Step 2: Preview & Error Resolution";
        if (btnProceed) btnProceed.disabled = false;

        const data = BoutiqueData.CSV_SAMPLE_IMPORT_DATA;
        if (tableBody) {
          tableBody.innerHTML = data.map(row => `
            <tr style="background: ${row.valid ? 'transparent' : 'rgba(138, 56, 56, 0.08)'};">
              <td class="font-mono">${row.row}</td>
              <td><strong>${escapeHtml(row.name)}</strong></td>
              <td class="font-mono">${row.sku}</td>
              <td>${row.category}</td>
              <td class="font-mono">$${row.price}</td>
              <td class="font-mono">${row.stock}</td>
              <td>
                ${row.valid
                  ? `<span class="status-pill status-published font-mono" style="font-size: 0.65rem;">Valid Row</span>`
                  : `<span class="status-pill status-rejected font-mono" style="font-size: 0.65rem;">${escapeHtml(row.error)}</span>`
                }
              </td>
            </tr>
          `).join('');
        }
      };
    }

    // Download Sample CSV
    if (btnSample) {
      btnSample.onclick = function () {
        const sampleCsv = `Name,SKU,Category,Price,Stock,Status\n"Handspun Cotton Tunic","HCT-001","Kurtas & Tunics",120,15,"Published"\n"Kalamkari Printed Scarf","KPS-002","Accessories",45,30,"Published"\n"Zari Velvet Shawl","ZVS-005","Outerwear & Jackets",260,8,"Published"`;
        const blob = new Blob([sampleCsv], { type: 'text/csv;charset=utf-8;' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = "boutique-import-sample-template.csv";
        a.click();
        showToast("Sample CSV template downloaded.");
      };
    }

    // Proceed to ingest valid rows
    if (btnProceed) {
      btnProceed.onclick = function () {
        const validRows = BoutiqueData.CSV_SAMPLE_IMPORT_DATA.filter(r => r.valid);
        validRows.forEach((r, idx) => {
          state.products.unshift({
            id: `PROD-NEW-${Date.now()}-${idx}`,
            name: r.name,
            slug: r.name.toLowerCase().replace(/[^a-z0-9]+/g, '-'),
            sku: r.sku,
            category: r.category,
            status: "published",
            regularPrice: parseFloat(r.price),
            salePrice: null,
            totalStock: parseInt(r.stock, 10),
            thirtyDaySales: 0,
            variants: [
              { sku: `${r.sku}-M`, size: "M", color: "Indigo", price: parseFloat(r.price), stock: parseInt(r.stock, 10), barcode: `890${Date.now()}` }
            ]
          });
        });

        closeModal();
        showToast(`Successfully imported ${validRows.length} valid products into catalogue.`);
        renderProductsList();
        renderOverview();
      };
    }
  }

  /* ==========================================================================
     PRODUCT EDITOR (FULL PAGE, 8 TABS) (C2)
     ========================================================================== */
  function openProductEditor(productId = null) {
    state.editor.currentProductId = productId;
    state.editor.activeTab = 'tab-basic';
    state.editor.isDirty = false;

    const actionLabel = document.getElementById('editor-action-label');
    const headingEl = document.getElementById('editor-product-heading');
    const statusBadge = document.getElementById('editor-status-badge');
    const unsavedBadge = document.getElementById('editor-unsaved-badge');
    const btnDelete = document.getElementById('btn-editor-delete-product');

    if (unsavedBadge) unsavedBadge.style.display = 'none';

    let prod = null;
    if (productId) {
      prod = state.products.find(p => p.id === productId);
    }

    if (prod) {
      if (actionLabel) actionLabel.textContent = "Editing Garment";
      if (headingEl) headingEl.textContent = prod.name;
      if (statusBadge) {
        statusBadge.className = `status-pill ${prod.status === 'published' ? 'status-published' : 'status-draft'}`;
        statusBadge.textContent = prod.status.charAt(0).toUpperCase() + prod.status.slice(1);
      }
      if (btnDelete) btnDelete.style.display = state.role === 'admin' ? 'inline-flex' : 'none';
    } else {
      if (actionLabel) actionLabel.textContent = "New Garment Silhouette";
      if (headingEl) headingEl.textContent = "Untitled Garment";
      if (statusBadge) {
        statusBadge.className = "status-pill status-draft";
        statusBadge.textContent = "Draft";
      }
      if (btnDelete) btnDelete.style.display = 'none';
    }

    populateEditorForm(prod);
    initEditorTabs();
    initEditorEvents();
    syncLivePreview(prod);
    updateEditorPermissions();
  }

  function populateEditorForm(prod) {
    // Tab 1: Basic
    const nameInput = document.getElementById('edit-product-name');
    const slugInput = document.getElementById('edit-product-slug');
    const skuInput = document.getElementById('edit-product-sku');
    const shortDesc = document.getElementById('edit-product-short-desc');
    const longDesc = document.getElementById('edit-product-long-desc');
    const fabric = document.getElementById('edit-product-fabric');
    const care = document.getElementById('edit-product-care');
    const origin = document.getElementById('edit-product-origin');
    const collection = document.getElementById('edit-product-collection');
    const tags = document.getElementById('edit-product-tags');

    // Tab 2: Pricing
    const regPrice = document.getElementById('edit-regular-price');
    const salePrice = document.getElementById('edit-sale-price');
    const costPrice = document.getElementById('edit-cost-price');
    const marginDisplay = document.getElementById('edit-margin-display');
    const taxClass = document.getElementById('edit-tax-class');

    // Tab 5: Inventory Policy
    const trackStock = document.getElementById('edit-track-stock');
    const totalStock = document.getElementById('edit-total-stock-display');
    const threshold = document.getElementById('edit-low-stock-threshold');
    const allowBack = document.getElementById('edit-allow-backorders');

    // Tab 6: Categories
    const primaryCat = document.getElementById('edit-primary-category');

    // Tab 7: SEO
    const seoTitle = document.getElementById('edit-seo-title');
    const seoDesc = document.getElementById('edit-seo-desc');

    // Tab 8: Shipping
    const weight = document.getElementById('edit-weight-kg');
    const dims = document.getElementById('edit-dimensions-cm');

    if (prod) {
      if (nameInput) nameInput.value = prod.name;
      if (slugInput) slugInput.value = prod.slug || '';
      if (skuInput) skuInput.value = prod.sku;
      if (shortDesc) shortDesc.value = prod.shortDescription || '';
      if (longDesc) longDesc.value = prod.longDescription || '';
      if (fabric) fabric.value = prod.fabric || '100% Belgian Flax Linen';
      if (care) care.value = prod.careInstructions || 'Dry clean only';
      if (origin) origin.value = prod.origin || 'India';
      if (collection) collection.value = prod.collection || "Pure Linen Core";
      if (tags) tags.value = (prod.tags || []).join(', ');

      if (regPrice) regPrice.value = prod.regularPrice;
      if (salePrice) salePrice.value = prod.salePrice || '';
      if (costPrice) costPrice.value = prod.costPrice || Math.round(prod.regularPrice * 0.35);
      if (taxClass) taxClass.value = prod.taxClass || 'Standard 18%';

      if (trackStock) trackStock.checked = true;
      if (totalStock) totalStock.value = prod.totalStock;
      if (threshold) threshold.value = prod.lowStockThreshold || 4;
      if (allowBack) allowBack.checked = !!prod.backordersAllowed;

      if (primaryCat) primaryCat.value = prod.category;

      if (seoTitle) seoTitle.value = prod.seoTitle || `${prod.name} | Handcrafted Atelier`;
      if (seoDesc) seoDesc.value = prod.seoDescription || prod.shortDescription || '';

      if (weight) weight.value = prod.weightKg || 0.45;
      if (dims) dims.value = prod.dimensions || '35 x 25 x 3 cm';

      calculateMargin();
    } else {
      // Clear for new product
      if (nameInput) nameInput.value = '';
      if (slugInput) slugInput.value = '';
      if (skuInput) skuInput.value = `ATELIER-${Math.floor(100 + Math.random() * 900)}`;
      if (shortDesc) shortDesc.value = '';
      if (longDesc) longDesc.value = '';
      if (regPrice) regPrice.value = '';
      if (salePrice) salePrice.value = '';
      if (costPrice) costPrice.value = '';
      if (totalStock) totalStock.value = '0';
    }

    renderVariantMatrix(prod);
    renderMediaDropzone(prod);
  }

  function initEditorTabs() {
    const tabBtns = document.querySelectorAll('.editor-tab-btn');
    tabBtns.forEach(btn => {
      btn.onclick = function () {
        const targetTab = this.getAttribute('data-tab');
        tabBtns.forEach(b => b.classList.remove('active'));
        this.classList.add('active');

        document.querySelectorAll('.editor-tab-content').forEach(pane => {
          pane.style.display = 'none';
        });

        const activePane = document.getElementById(`pane-${targetTab}`);
        if (activePane) activePane.style.display = 'block';
      };
    });
  }

  function renderVariantMatrix(prod) {
    const swatchesContainer = document.getElementById('editor-swatches-selector');
    const sizesContainer = document.getElementById('editor-sizes-selector');
    const tableBody = document.getElementById('editor-variant-matrix-body');
    if (!swatchesContainer || !sizesContainer || !tableBody) return;

    // Swatches Selector
    swatchesContainer.innerHTML = BoutiqueData.STANDARD_COLORS.map((col, idx) => `
      <div class="swatch-item ${idx < 2 ? 'active' : ''}" style="background-color: ${col.hex};" title="${col.name}"></div>
    `).join('');

    // Sizes Selector
    sizesContainer.innerHTML = BoutiqueData.STANDARD_SIZES.map(s => `
      <span class="btn-secondary" style="padding: 0.2rem 0.5rem; font-size: 0.72rem; cursor: pointer;">${s}</span>
    `).join('');

    // Matrix rows
    const variants = prod && prod.variants ? prod.variants : [
      { sku: "LWD-IND-XS", size: "XS", color: "Indigo", price: 195, stock: 4, barcode: "890412345001" },
      { sku: "LWD-IND-S", size: "S", color: "Indigo", price: 195, stock: 8, barcode: "890412345002" },
      { sku: "LWD-IND-M", size: "M", color: "Indigo", price: 195, stock: 12, barcode: "890412345003" },
      { sku: "LWD-IND-L", size: "L", color: "Indigo", price: 195, stock: 6, barcode: "890412345004" }
    ];

    tableBody.innerHTML = variants.map(v => `
      <tr>
        <td class="font-mono">${v.sku}</td>
        <td><strong>${v.size}</strong></td>
        <td>${v.color}</td>
        <td class="font-mono">$${v.price}</td>
        <td>
          <input type="number" class="select-filter font-mono matrix-stock-input" value="${v.stock}" style="width: 70px; padding: 0.2rem;" />
        </td>
        <td class="font-mono text-muted">${v.barcode}</td>
      </tr>
    `).join('');

    // Bulk apply stock to matrix
    const btnApplyBulk = document.getElementById('btn-apply-bulk-stock');
    const bulkInput = document.getElementById('matrix-bulk-stock-input');
    if (btnApplyBulk && bulkInput) {
      btnApplyBulk.onclick = function () {
        const val = parseInt(bulkInput.value, 10) || 0;
        tableBody.querySelectorAll('.matrix-stock-input').forEach(input => {
          input.value = val;
        });
        showToast(`Applied ${val} units to all matrix variants.`);
      };
    }
  }

  function renderMediaDropzone(prod) {
    const container = document.getElementById('editor-media-preview-list');
    if (!container) return;

    const dummyImgs = ["Front View (Primary)", "Back Detail", "Fabric Close-up", "Model Studio Editorial"];
    container.innerHTML = dummyImgs.map((title, idx) => `
      <div style="border: 1px solid var(--border-hairline); border-radius: var(--radius-xs); overflow: hidden; background: var(--bg-surface);">
        <div style="height: 100px; background: var(--bg-subtle); display: flex; align-items: center; justify-content: center; font-size: 0.72rem; color: var(--text-muted); position: relative;">
          ${idx === 0 ? `<span class="badge" style="position: absolute; top: 4px; left: 4px; background: var(--accent); color: #fff; font-size: 0.6rem; padding: 2px 4px;">Primary</span>` : ''}
          ${title}
        </div>
        <div style="padding: 0.35rem 0.5rem; display: flex; justify-content: space-between; align-items: center;">
          <span style="font-size: 0.6875rem;" class="text-muted">IMG_00${idx + 1}.jpg</span>
          <button type="button" class="action-icon-btn" style="color: var(--status-rejected-text);" onclick="this.closest('div').parentElement.remove()">&times;</button>
        </div>
      </div>
    `).join('');
  }

  function calculateMargin() {
    const regInput = document.getElementById('edit-regular-price');
    const costInput = document.getElementById('edit-cost-price');
    const display = document.getElementById('edit-margin-display');
    if (!regInput || !costInput || !display) return;

    const reg = parseFloat(regInput.value) || 0;
    const cost = parseFloat(costInput.value) || 0;

    if (reg <= 0) {
      display.textContent = "--";
      return;
    }

    const profit = reg - cost;
    const marginPct = ((profit / reg) * 100).toFixed(1);
    display.textContent = `${marginPct}% Margin (${formatUSD(profit)} gross profit/unit)`;
  }

  function syncLivePreview(prod) {
    const previewName = document.getElementById('preview-name-text');
    const previewCat = document.getElementById('preview-cat-text');
    const previewPrice = document.getElementById('preview-price-text');
    const previewDesc = document.getElementById('preview-desc-text');
    const serpTitle = document.getElementById('serp-preview-title');
    const serpUrl = document.getElementById('serp-preview-url');
    const serpDesc = document.getElementById('serp-preview-desc');

    const nameInput = document.getElementById('edit-product-name');
    const regPrice = document.getElementById('edit-regular-price');
    const catSelect = document.getElementById('edit-primary-category');
    const shortDesc = document.getElementById('edit-product-short-desc');
    const slugInput = document.getElementById('edit-product-slug');

    function update() {
      const name = nameInput && nameInput.value ? nameInput.value : "Garment Silhouette";
      const cat = catSelect ? catSelect.value : "Dresses";
      const price = regPrice && regPrice.value ? `$${regPrice.value}` : "$0.00";
      const desc = shortDesc && shortDesc.value ? shortDesc.value : "Artisanal handwoven boutique piece.";
      const slug = slugInput && slugInput.value ? slugInput.value : name.toLowerCase().replace(/[^a-z0-9]+/g, '-');

      if (previewName) previewName.textContent = name;
      if (previewCat) previewCat.textContent = cat;
      if (previewPrice) previewPrice.textContent = price;
      if (previewDesc) previewDesc.textContent = desc;

      if (serpTitle) serpTitle.textContent = `${name} | Handcrafted Atelier Collection`;
      if (serpUrl) serpUrl.textContent = `https://brandname.atelier/products/${slug}`;
      if (serpDesc) serpDesc.textContent = desc;
    }

    update();
  }

  function initEditorEvents() {
    // Back button
    const btnBack = document.getElementById('btn-editor-back');
    if (btnBack) {
      btnBack.onclick = function () {
        if (state.editor.isDirty && !confirm("You have unsaved changes. Return to Products catalogue?")) {
          return;
        }
        switchView('products');
      };
    }

    // Auto-generate slug from title
    const nameInput = document.getElementById('edit-product-name');
    const slugInput = document.getElementById('edit-product-slug');
    if (nameInput) {
      nameInput.oninput = function () {
        state.editor.isDirty = true;
        document.getElementById('editor-unsaved-badge').style.display = 'inline-block';
        if (slugInput) {
          slugInput.value = this.value.toLowerCase().trim().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');
        }
        syncLivePreview();
      };
    }

    // Live price calculation
    const regPrice = document.getElementById('edit-regular-price');
    const costPrice = document.getElementById('edit-cost-price');
    if (regPrice) regPrice.oninput = () => { calculateMargin(); syncLivePreview(); };
    if (costPrice) costPrice.oninput = () => { calculateMargin(); };

    // Device preview toggle (Desktop ⇄ Mobile)
    const btnDesk = document.getElementById('btn-preview-desktop');
    const btnMob = document.getElementById('btn-preview-mobile');
    const screenWrapper = document.getElementById('preview-screen-wrapper');

    if (btnDesk && btnMob && screenWrapper) {
      btnDesk.onclick = function () {
        btnDesk.classList.add('active');
        btnMob.classList.remove('active');
        screenWrapper.style.maxWidth = '100%';
      };
      btnMob.onclick = function () {
        btnMob.classList.add('active');
        btnDesk.classList.remove('active');
        screenWrapper.style.maxWidth = '280px';
      };
    }

    // Save Draft
    const btnDraft = document.getElementById('btn-editor-save-draft');
    if (btnDraft) {
      btnDraft.onclick = function () {
        saveProduct('draft');
      };
    }

    // Publish
    const btnPublish = document.getElementById('btn-editor-publish');
    if (btnPublish) {
      btnPublish.onclick = function () {
        saveProduct('published');
      };
    }

    // Delete
    const btnDelete = document.getElementById('btn-editor-delete-product');
    if (btnDelete) {
      btnDelete.onclick = function () {
        if (confirm("Permanently delete this product silhouette from catalogue?")) {
          const id = state.editor.currentProductId;
          state.products = state.products.filter(p => p.id !== id);
          showToast("Product deleted.");
          switchView('products');
          renderOverview();
        }
      };
    }
  }

  function saveProduct(targetStatus = 'published') {
    const nameInput = document.getElementById('edit-product-name');
    const skuInput = document.getElementById('edit-product-sku');
    const regPrice = document.getElementById('edit-regular-price');
    const catSelect = document.getElementById('edit-primary-category');

    const name = nameInput ? nameInput.value.trim() : '';
    const sku = skuInput ? skuInput.value.trim() : '';
    const price = regPrice ? parseFloat(regPrice.value) : 0;
    const cat = catSelect ? catSelect.value : 'Dresses';

    // Validation
    if (!name) {
      showToast("Please enter a Product Name before saving.", "error");
      return;
    }
    if (!sku) {
      showToast("Please enter a Master SKU before saving.", "error");
      return;
    }
    if (!price || price <= 0) {
      showToast("Please provide a valid Regular Price.", "error");
      return;
    }

    let prod = null;
    const isNew = !state.editor.currentProductId;

    if (isNew) {
      prod = {
        id: `PROD-${Date.now()}`,
        name: name,
        slug: name.toLowerCase().replace(/[^a-z0-9]+/g, '-'),
        sku: sku,
        category: cat,
        status: targetStatus,
        regularPrice: price,
        salePrice: null,
        costPrice: Math.round(price * 0.35),
        totalStock: 24,
        thirtyDaySales: 0,
        variants: [
          { sku: `${sku}-M`, size: "M", color: "Indigo", price: price, stock: 24, barcode: `890${Date.now()}` }
        ]
      };
      state.products.unshift(prod);
    } else {
      prod = state.products.find(p => p.id === state.editor.currentProductId);
      if (prod) {
        prod.name = name;
        prod.sku = sku;
        prod.regularPrice = price;
        prod.category = cat;
        prod.status = targetStatus;
      }
    }

    state.editor.isDirty = false;
    document.getElementById('editor-unsaved-badge').style.display = 'none';

    // Activity log entry
    state.activityLog.unshift({
      id: `act-${Date.now()}`,
      timestamp: "Just now",
      timeAgo: "Just now",
      user: state.role === 'admin' ? "Admin (Store Owner)" : "Manager (Priya)",
      role: state.role,
      action: isNew ? "Created Product" : "Updated Product",
      detail: `${isNew ? 'Added new silhouette' : 'Updated details for'} '${prod.name}' ($${prod.regularPrice}, ${prod.category}). Status: ${targetStatus}.`,
      productId: prod.id
    });

    showToast(`Product '${prod.name}' saved and ${targetStatus === 'published' ? 'published' : 'saved as draft'}.`);
    switchView('products');
    renderOverview();
  }

  function updateEditorPermissions() {
    const isStaff = state.role === 'staff';
    const isManager = state.role === 'manager';
    const isAdmin = state.role === 'admin';

    // Cost & Margin visibility: Admin only
    const costBox = document.getElementById('editor-cost-margin-container');
    if (costBox) costBox.style.display = isAdmin ? 'block' : 'none';

    // Delete button: Admin only
    const btnDelete = document.getElementById('btn-editor-delete-product');
    if (btnDelete) btnDelete.style.display = isAdmin && state.editor.currentProductId ? 'inline-flex' : 'none';

    // Staff cannot edit pricing or publish
    const regPrice = document.getElementById('edit-regular-price');
    const salePrice = document.getElementById('edit-sale-price');
    const btnPublish = document.getElementById('btn-editor-publish');
    const btnDraft = document.getElementById('btn-editor-save-draft');

    if (regPrice) regPrice.disabled = isStaff;
    if (salePrice) salePrice.disabled = isStaff;
    if (btnPublish) btnPublish.style.display = isStaff ? 'none' : 'inline-flex';
    if (btnDraft) btnDraft.style.display = isStaff ? 'none' : 'inline-flex';
  }

  /* ==========================================================================
     MODULE 16: RETURNS, EXCHANGES & REFUNDS CONTROLLER (C1 - C8)
     ========================================================================== */
  function renderReturnsModule() {
    renderReturnsMetrics();
    renderReturnsTable();
    bindReturnsEvents();
  }

  function renderReturnsMetrics() {
    const elPending = document.getElementById('metric-pending-review');
    const elTransit = document.getElementById('metric-in-transit');
    const elExchanges = document.getElementById('metric-exchanges');
    const elRefunds = document.getElementById('metric-refunds-month');

    const pending = state.requests.filter(r => r.status === 'requested').length;
    const transit = state.requests.filter(r => r.status === 'approved' || r.status === 'received').length;
    const exchanges = state.requests.filter(r => r.type === 'size_exchange' || r.type === 'product_exchange').length;
    const refundsTotal = state.requests
      .filter(r => r.status === 'refunded')
      .reduce((sum, r) => sum + (r.refundAmount || 0), 0);

    if (elPending) elPending.textContent = pending;
    if (elTransit) elTransit.textContent = transit;
    if (elExchanges) elExchanges.textContent = exchanges;
    if (elRefunds) elRefunds.textContent = formatUSD(refundsTotal || 1280);

    // Update sidebar badge
    const badge = document.getElementById('sidebar-returns-count');
    if (badge) badge.textContent = state.requests.length;
  }

  function renderReturnsTable() {
    const tbody = document.getElementById('returns-table-body');
    const countLabel = document.getElementById('returns-table-count-label');
    if (!tbody) return;

    let filtered = [...state.requests];
    const rl = state.returnsList;

    // Status Tab Filter
    if (rl.activeTab === 'needs_action') {
      filtered = filtered.filter(r => r.status === 'requested' || r.status === 'received');
    } else if (rl.activeTab === 'in_transit') {
      filtered = filtered.filter(r => r.status === 'approved' || r.status === 'received');
    } else if (rl.activeTab === 'exchanges') {
      filtered = filtered.filter(r => r.type === 'size_exchange' || r.type === 'product_exchange');
    } else if (rl.activeTab === 'refunded') {
      filtered = filtered.filter(r => r.status === 'refunded');
    } else if (rl.activeTab === 'rejected') {
      filtered = filtered.filter(r => r.status === 'rejected');
    }

    // Search Query Filter
    const q = rl.searchQuery.toLowerCase().trim();
    if (q) {
      filtered = filtered.filter(r =>
        r.id.toLowerCase().includes(q) ||
        r.orderId.toLowerCase().includes(q) ||
        r.customer.name.toLowerCase().includes(q) ||
        r.customer.phone.includes(q) ||
        r.product.name.toLowerCase().includes(q) ||
        r.product.sku.toLowerCase().includes(q)
      );
    }

    // Type Filter
    if (rl.typeFilter !== 'all') {
      filtered = filtered.filter(r => r.type === rl.typeFilter);
    }

    // Reason Filter
    if (rl.reasonFilter !== 'all') {
      filtered = filtered.filter(r => r.reasonCategory === rl.reasonFilter);
    }

    // Date Filter
    if (rl.dateFilter === 'today') {
      filtered = filtered.filter(r => r.createdAt && r.createdAt.startsWith('2026-10-30'));
    } else if (rl.dateFilter === 'last_7_days') {
      filtered = filtered.filter(r => r.createdAt && r.createdAt >= '2026-10-23');
    }

    // Update Tab Counts
    updateReturnsTabCounts();

    if (countLabel) {
      countLabel.textContent = `Showing ${filtered.length} of ${state.requests.length} requests`;
    }

    if (filtered.length === 0) {
      tbody.innerHTML = `
        <tr>
          <td colspan="9" style="text-align: center; padding: 3rem; color: var(--text-muted);">
            No return or exchange claims match your selected filter criteria.
          </td>
        </tr>
      `;
      return;
    }

    tbody.innerHTML = filtered.map(req => {
      const typeLabels = {
        size_exchange: 'Size Exchange',
        product_exchange: 'Product Swap',
        refund: 'Store Refund',
        store_credit: 'Store Credit'
      };

      const statusClasses = {
        requested: 'status-requested',
        approved: 'status-approved',
        received: 'status-received',
        exchanged: 'status-exchanged',
        refunded: 'status-refunded',
        rejected: 'status-rejected'
      };

      const isNew = req.id === state.newCreatedRequestId;

      return `
        <tr style="cursor: pointer; ${isNew ? 'background: rgba(74, 82, 64, 0.12);' : ''}" onclick="window.inspectReturn('${req.id}')">
          <td class="font-mono" style="font-weight: 700; font-size: 0.78rem;">
            ${req.id}
            ${isNew ? `<span class="badge" style="background: var(--accent); color: #fff; font-size: 0.58rem; margin-left: 0.25rem; padding: 1px 4px; border-radius: 2px;">NEW</span>` : ''}
          </td>
          <td class="font-mono text-muted" style="font-size: 0.72rem;">${req.orderId}</td>
          <td>
            <strong style="font-size: 0.8125rem; display: block;">${escapeHtml(req.customer.name)}</strong>
            <span class="text-muted" style="font-size: 0.6875rem;">${req.customer.city}</span>
          </td>
          <td>
            <div style="font-size: 0.8125rem; font-weight: 500;">${escapeHtml(req.product.name)}</div>
            <span class="font-mono text-muted" style="font-size: 0.6875rem;">${req.product.sku} &bull; Size ${req.product.size}</span>
          </td>
          <td>
            <span class="badge" style="background: var(--bg-subtle); border: 1px solid var(--border-hairline); font-size: 0.6875rem;">
              ${typeLabels[req.type] || req.type}
            </span>
          </td>
          <td>
            <span style="font-size: 0.75rem; color: var(--text-secondary);">${escapeHtml(req.reasonCategory)}</span>
          </td>
          <td class="font-mono" style="font-weight: 600; font-size: 0.8125rem;">
            ${formatUSD(req.product.price)}
          </td>
          <td>
            <span class="status-pill ${statusClasses[req.status] || 'status-draft'}">
              ${req.status.charAt(0).toUpperCase() + req.status.slice(1)}
            </span>
          </td>
          <td style="text-align: right;">
            <button class="btn-secondary" style="font-size: 0.7rem; padding: 0.25rem 0.55rem;" onclick="event.stopPropagation(); window.inspectReturn('${req.id}')">
              Inspect &rarr;
            </button>
          </td>
        </tr>
      `;
    }).join('');

    window.inspectReturn = function (id) {
      openReturnDrawer(id);
    };
  }

  function updateReturnsTabCounts() {
    const all = state.requests.length;
    const action = state.requests.filter(r => r.status === 'requested' || r.status === 'received').length;
    const transit = state.requests.filter(r => r.status === 'approved' || r.status === 'received').length;
    const exchanges = state.requests.filter(r => r.type === 'size_exchange' || r.type === 'product_exchange').length;
    const refunded = state.requests.filter(r => r.status === 'refunded').length;
    const rejected = state.requests.filter(r => r.status === 'rejected').length;

    const elAll = document.getElementById('ret-count-all');
    const elAction = document.getElementById('ret-count-action');
    const elTransit = document.getElementById('ret-count-transit');
    const elExchanges = document.getElementById('ret-count-exchanges');
    const elRefunded = document.getElementById('ret-count-refunded');
    const elRejected = document.getElementById('ret-count-rejected');

    if (elAll) elAll.textContent = all;
    if (elAction) elAction.textContent = action;
    if (elTransit) elTransit.textContent = transit;
    if (elExchanges) elExchanges.textContent = exchanges;
    if (elRefunded) elRefunded.textContent = refunded;
    if (elRejected) elRejected.textContent = rejected;
  }

  function bindReturnsEvents() {
    if (window._returnsEventsBound) return;
    window._returnsEventsBound = true;

    // Tabs
    const tabs = document.querySelectorAll('#returns-filter-tabs .filter-tab');
    tabs.forEach(tab => {
      tab.addEventListener('click', function () {
        tabs.forEach(t => t.classList.remove('active'));
        this.classList.add('active');
        state.returnsList.activeTab = this.getAttribute('data-tab') || 'all';
        renderReturnsTable();
      });
    });

    // Search input
    const searchInput = document.getElementById('returns-search-input');
    if (searchInput) {
      searchInput.addEventListener('input', (e) => {
        state.returnsList.searchQuery = e.target.value;
        renderReturnsTable();
      });
    }

    // Type filter
    const typeSelect = document.getElementById('returns-filter-type');
    if (typeSelect) {
      typeSelect.addEventListener('change', (e) => {
        state.returnsList.typeFilter = e.target.value;
        renderReturnsTable();
      });
    }

    // Reason filter
    const reasonSelect = document.getElementById('returns-filter-reason');
    if (reasonSelect) {
      reasonSelect.addEventListener('change', (e) => {
        state.returnsList.reasonFilter = e.target.value;
        renderReturnsTable();
      });
    }

    // Date filter
    const dateSelect = document.getElementById('returns-filter-date');
    if (dateSelect) {
      dateSelect.addEventListener('change', (e) => {
        state.returnsList.dateFilter = e.target.value;
        renderReturnsTable();
      });
    }

    // Clear filters
    const clearBtn = document.getElementById('btn-returns-clear-filters');
    if (clearBtn) {
      clearBtn.addEventListener('click', () => {
        state.returnsList.searchQuery = '';
        state.returnsList.typeFilter = 'all';
        state.returnsList.reasonFilter = 'all';
        state.returnsList.dateFilter = 'all';

        if (searchInput) searchInput.value = '';
        if (typeSelect) typeSelect.value = 'all';
        if (reasonSelect) reasonSelect.value = 'all';
        if (dateSelect) dateSelect.value = 'all';

        renderReturnsTable();
      });
    }

    // Close Return Drawer
    const btnCloseDrawer = document.getElementById('btn-close-return-drawer');
    const backdrop = document.getElementById('return-drawer-backdrop');
    if (btnCloseDrawer) btnCloseDrawer.addEventListener('click', closeReturnDrawer);
    if (backdrop) backdrop.addEventListener('click', closeReturnDrawer);
  }

  /* --- SLIDE-OVER REQUEST DETAIL DRAWER --- */
  function openReturnDrawer(requestId) {
    state.selectedRequestId = requestId;
    const req = state.requests.find(r => r.id === requestId);
    if (!req) return;

    const drawer = document.getElementById('return-request-drawer');
    const backdrop = document.getElementById('return-drawer-backdrop');
    const body = document.getElementById('return-drawer-body');
    const reqIdEl = document.getElementById('drawer-req-id');
    const statusEl = document.getElementById('drawer-status-pill');
    const orderIdEl = document.getElementById('drawer-order-id');

    if (!drawer || !body) return;

    if (reqIdEl) reqIdEl.textContent = req.id;
    if (orderIdEl) orderIdEl.textContent = req.orderId;
    if (statusEl) {
      statusEl.className = `status-pill status-${req.status}`;
      statusEl.textContent = req.status.charAt(0).toUpperCase() + req.status.slice(1);
    }

    // Matching product from catalogue
    const matchingProd = state.products.find(p => p.name === req.product.name) || state.products[0];

    // Build timeline HTML
    const timelineHtml = (req.timeline || []).map(t => `
      <div class="timeline-item">
        <span class="timeline-dot"></span>
        <strong class="timeline-step">${escapeHtml(t.step)}</strong>
        <span class="timeline-time">${escapeHtml(t.timestamp)} &bull; ${escapeHtml(t.actor)}</span>
        <p class="timeline-note">${escapeHtml(t.note)}</p>
      </div>
    `).join('');

    // Build photos HTML
    const photosHtml = (req.photos && req.photos.length > 0)
      ? req.photos.map(p => `
          <div style="border: 1px solid var(--border-hairline); border-radius: var(--radius-xs); padding: 0.65rem; background: var(--bg-subtle); cursor: pointer;" onclick="window.viewInspectionPhoto('${p.title}', '${p.caption}')">
            <div style="height: 60px; background: var(--bg-surface); border-radius: var(--radius-xs); display: flex; align-items: center; justify-content: center; font-size: 0.7rem; color: var(--accent); font-weight: 600;">
              🔍 Click to Zoom
            </div>
            <div style="margin-top: 0.35rem;">
              <strong style="font-size: 0.72rem; display: block;">${escapeHtml(p.title)}</strong>
              <span class="text-muted" style="font-size: 0.6875rem;">${escapeHtml(p.tag)}</span>
            </div>
          </div>
        `).join('')
      : `<span style="font-size: 0.75rem; color: var(--text-muted);">No customer photo attachments provided for this claim.</span>`;

    // Action Workspace based on status and role
    const isStaff = state.role === 'staff';
    let actionWorkspaceHtml = '';

    if (req.status === 'requested') {
      actionWorkspaceHtml = `
        <div style="background: var(--bg-subtle); border: 1px solid var(--border-hairline); border-radius: var(--radius-sm); padding: 1rem; margin-top: 1rem;">
          <span class="text-overline" style="color: var(--accent);">Operational Decision Required</span>
          <p style="font-size: 0.78rem; color: var(--text-secondary); margin: 0.35rem 0 0.85rem 0;">
            Review patron reason, garment tag inspection evidence, and authorization terms.
          </p>
          <div style="display: flex; gap: 0.65rem; flex-wrap: wrap;">
            <button class="btn-danger-outline" style="flex: 1;" onclick="window.openRejectionModalAction('${req.id}')">
              Reject Request
            </button>
            <button class="btn-primary" style="flex: 2;" onclick="window.confirmApproveReturn('${req.id}')">
              Approve & Schedule Reverse Pickup &rarr;
            </button>
          </div>
        </div>
      `;
    } else if (req.status === 'approved') {
      actionWorkspaceHtml = `
        <div style="background: var(--bg-subtle); border: 1px solid var(--border-hairline); border-radius: var(--radius-sm); padding: 1rem; margin-top: 1rem;">
          <span class="text-overline" style="color: var(--stock-in);">In Transit via BlueDart (AWB: BD-77829104)</span>
          <p style="font-size: 0.78rem; color: var(--text-secondary); margin: 0.35rem 0 0.85rem 0;">
            Garment is in transit to studio. When package arrives at the hub, perform physical QC and confirm receipt.
          </p>
          <button class="btn-primary" style="width: 100%;" onclick="window.confirmReceiveStudio('${req.id}')">
            Confirm Studio Receipt & Physical QC Passed &rarr;
          </button>
        </div>
      `;
    } else if (req.status === 'received') {
      if (req.type === 'size_exchange') {
        const sizes = ["XS", "S", "M", "L", "XL", "XXL"];
        actionWorkspaceHtml = `
          <div style="background: var(--bg-subtle); border: 1px solid var(--border-hairline); border-radius: var(--radius-sm); padding: 1rem; margin-top: 1rem;">
            <span class="text-overline" style="color: var(--accent);">Size Exchange Fulfillment</span>
            <p style="font-size: 0.78rem; color: var(--text-secondary); margin: 0.25rem 0 0.65rem 0;">
              Customer requested <strong>Size ${req.exchangeTarget ? req.exchangeTarget.size : 'L'}</strong>. Choose replacement size:
            </p>
            <div style="display: flex; gap: 0.4rem; flex-wrap: wrap; margin-bottom: 0.85rem;" id="exchange-sizes-row">
              ${sizes.map(s => {
                const targetSize = req.exchangeTarget ? req.exchangeTarget.size : 'L';
                const isSelected = s === targetSize;
                return `
                  <button type="button" class="btn-secondary exchange-size-pick-btn ${isSelected ? 'active' : ''}" style="${isSelected ? 'background: var(--accent); color: var(--text-inverse);' : ''}" data-size="${s}" onclick="window.selectExchangeSize('${s}')">
                    Size ${s} (${s === 'M' ? '0 pcs' : '3 pcs in stock'})
                  </button>
                `;
              }).join('')}
            </div>
            <button class="btn-primary" style="width: 100%;" onclick="window.confirmSizeExchangeAction('${req.id}')">
              Confirm Size Exchange & Deduct Stock &rarr;
            </button>
          </div>
        `;
      } else if (req.type === 'product_exchange') {
        actionWorkspaceHtml = `
          <div style="background: var(--bg-subtle); border: 1px solid var(--border-hairline); border-radius: var(--radius-sm); padding: 1rem; margin-top: 1rem;">
            <span class="text-overline" style="color: var(--accent);">Product Swap Upgrade</span>
            <div style="padding: 0.65rem; background: var(--bg-surface); border: 1px solid var(--border-hairline); border-radius: var(--radius-xs); margin: 0.5rem 0; font-size: 0.75rem;">
              <strong>Swap for:</strong> Ajrakh Modal Satin Saree ($280)<br/>
              <span class="text-muted font-mono">Invoice Differential to Collect: +$70</span>
            </div>
            <button class="btn-primary" style="width: 100%;" onclick="window.confirmProductSwapAction('${req.id}')">
              Confirm Product Swap & Dispatch Replacement &rarr;
            </button>
          </div>
        `;
      } else {
        actionWorkspaceHtml = `
          <div style="background: var(--bg-subtle); border: 1px solid var(--border-hairline); border-radius: var(--radius-sm); padding: 1rem; margin-top: 1rem;">
            <span class="text-overline" style="color: var(--accent);">Refund Settlement</span>
            <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 0.65rem; margin: 0.5rem 0;">
              <div>
                <label class="text-overline" style="display: block; margin-bottom: 0.2rem;">Refund Amount ($)</label>
                <input type="number" class="select-filter font-mono" id="refund-execute-amount" value="${req.refundAmount || req.product.price}" style="width: 100%; font-weight: 700;" />
              </div>
              <div>
                <label class="text-overline" style="display: block; margin-bottom: 0.2rem;">Settlement Source</label>
                <select class="select-filter" id="refund-execute-method" style="width: 100%;">
                  <option value="Stripe Card Refund">Stripe (Original Card)</option>
                  <option value="Store Credit Voucher (+10%)">Store Credit Voucher</option>
                  <option value="Bank Wire / NEFT">Direct Bank Wire / NEFT</option>
                </select>
              </div>
            </div>
            <button class="btn-primary" style="width: 100%; margin-top: 0.35rem;" onclick="window.confirmProcessRefund('${req.id}')">
              Execute Refund & Restock Garment &rarr;
            </button>
          </div>
        `;
      }
    } else if (req.status === 'exchanged') {
      actionWorkspaceHtml = `
        <div style="background: rgba(44, 99, 68, 0.08); border: 1px solid var(--stock-in); border-radius: var(--radius-sm); padding: 0.85rem; margin-top: 1rem; font-size: 0.78rem;">
          <strong style="color: var(--stock-in); display: block; margin-bottom: 0.25rem;">✓ Exchange Fulfilled & Dispatched</strong>
          <span>Replacement piece dispatched via DTDC Express (AWB: DTDC-HYD-998124). Garment restock recorded in central inventory ledger.</span>
        </div>
      `;
    } else if (req.status === 'refunded') {
      actionWorkspaceHtml = `
        <div style="background: rgba(44, 99, 68, 0.08); border: 1px solid var(--stock-in); border-radius: var(--radius-sm); padding: 0.85rem; margin-top: 1rem; font-size: 0.78rem;">
          <strong style="color: var(--stock-in); display: block; margin-bottom: 0.25rem;">✓ Refund Settled (${formatUSD(req.refundAmount)})</strong>
          <span>Credit transmitted via Stripe Gateway (UTR #UTR20261028-STRP-991). Garment verified and restocked to studio rack.</span>
        </div>
      `;
    } else if (req.status === 'rejected') {
      actionWorkspaceHtml = `
        <div style="background: rgba(138, 56, 56, 0.08); border: 1px solid var(--status-rejected-text); border-radius: var(--radius-sm); padding: 0.85rem; margin-top: 1rem; font-size: 0.78rem;">
          <strong style="color: var(--status-rejected-text); display: block; margin-bottom: 0.25rem;">✕ Claim Rejected by Store Policy</strong>
          <span>${req.rejectionReason ? escapeHtml(req.rejectionReason.note) : 'Claim did not comply with atelier terms.'}</span>
        </div>
      `;
    }

    body.innerHTML = `
      <!-- Customer Info Card -->
      <div style="padding: 0.75rem 0.85rem; background: var(--bg-subtle); border: 1px solid var(--border-hairline); border-radius: var(--radius-xs); margin-bottom: 1rem;">
        <span class="text-overline" style="color: var(--accent); display: block; margin-bottom: 0.25rem;">Patron Details</span>
        <strong style="font-size: 0.875rem;">${escapeHtml(req.customer.name)}</strong>
        <div style="font-size: 0.72rem; color: var(--text-secondary); margin-top: 0.2rem;">
          ${escapeHtml(req.customer.phone)} &bull; ${escapeHtml(req.customer.email)}
        </div>
        <div style="font-size: 0.72rem; color: var(--text-muted); margin-top: 0.25rem;">
          Pickup: ${escapeHtml(req.customer.address)}
        </div>
      </div>

      <!-- Garment Inspection Card -->
      <div class="garment-card" style="margin-bottom: 1rem;">
        <div style="width: 44px; height: 44px; background: var(--bg-subtle); border: 1px solid var(--border-hairline); border-radius: var(--radius-xs); display: flex; align-items: center; justify-content: center; font-size: 0.72rem; font-weight: 700;">
          ${req.product.category ? req.product.category.slice(0, 2).toUpperCase() : 'GAR'}
        </div>
        <div style="flex: 1;">
          <strong style="font-family: var(--font-serif); font-size: 1.05rem; display: block;">${escapeHtml(req.product.name)}</strong>
          <span class="font-mono text-muted" style="font-size: 0.7rem;">SKU: ${req.product.sku} &bull; Size ${req.product.size} &bull; Color: ${req.product.color}</span>
          <div style="font-size: 0.6875rem; color: var(--accent); margin-top: 0.15rem;">Location: ${req.product.rack || 'Studio Rack A-04'}</div>
        </div>
        <div class="font-mono" style="font-size: 1.05rem; font-weight: 700;">${formatUSD(req.product.price)}</div>
      </div>

      <!-- Customer Stated Reason -->
      <div style="margin-bottom: 1rem;">
        <span class="text-overline" style="display: block; margin-bottom: 0.25rem;">Customer Return Reason:</span>
        <div style="font-size: 0.78rem; font-weight: 600; color: var(--text-primary); margin-bottom: 0.25rem;">${escapeHtml(req.reasonCategory)}</div>
        <p style="font-size: 0.75rem; color: var(--text-secondary); line-height: 1.4; background: var(--bg-subtle); padding: 0.65rem 0.85rem; border-left: 3px solid var(--accent); border-radius: 0 var(--radius-xs) var(--radius-xs) 0; font-style: italic;">
          "${escapeHtml(req.customerReason || 'No additional notes provided.')}"
        </p>
      </div>

      <!-- Customer Uploaded Photos -->
      <div style="margin-bottom: 1rem;">
        <span class="text-overline" style="display: block; margin-bottom: 0.35rem;">Inspection Photo Evidence:</span>
        <div style="display: grid; grid-template-columns: repeat(2, 1fr); gap: 0.5rem;">
          ${photosHtml}
        </div>
      </div>

      <!-- Status Audit Timeline -->
      <div style="margin-bottom: 1rem;">
        <span class="text-overline" style="display: block; margin-bottom: 0.35rem;">Status Audit Timeline:</span>
        <div class="timeline">
          ${timelineHtml}
        </div>
      </div>

      <!-- Action Workspace Block -->
      ${actionWorkspaceHtml}
    `;

    drawer.classList.add('drawer-open');
    if (backdrop) backdrop.classList.add('drawer-open');

    // Global action helpers
    window.selectExchangeSize = function (size) {
      document.querySelectorAll('.exchange-size-pick-btn').forEach(btn => {
        const isMatch = btn.getAttribute('data-size') === size;
        btn.classList.toggle('active', isMatch);
        btn.style.background = isMatch ? 'var(--accent)' : '';
        btn.style.color = isMatch ? 'var(--text-inverse)' : '';
      });
      if (req.exchangeTarget) req.exchangeTarget.size = size;
    };

    window.confirmApproveReturn = function (id) {
      handleApproveReturn(id);
    };

    window.openRejectionModalAction = function (id) {
      openRejectionModal(id);
    };

    window.confirmReceiveStudio = function (id) {
      req.status = 'received';
      req.timeline.push({
        step: "Received",
        timestamp: "Just now",
        note: "Delivered to studio hub. Physical inspection passed (tags attached, unwashed). Ready for exchange / refund.",
        actor: state.role === 'admin' ? "Admin (Store Owner)" : "Staff (QC Associate)"
      });
      showToast(`Package marked as Received at Studio for ${req.id}.`);
      openReturnDrawer(id);
      renderReturnsTable();
      renderReturnsMetrics();
    };

    window.confirmSizeExchangeAction = function (id) {
      const activeSizeBtn = document.querySelector('.exchange-size-pick-btn.active');
      const targetSize = activeSizeBtn ? activeSizeBtn.getAttribute('data-size') : 'L';
      handleSizeExchange(id, targetSize);
    };

    window.confirmProductSwapAction = function (id) {
      handleProductSwap(id, 'PROD-1003');
    };

    window.confirmProcessRefund = function (id) {
      const amtInput = document.getElementById('refund-execute-amount');
      const methSelect = document.getElementById('refund-execute-method');
      const amt = amtInput ? parseFloat(amtInput.value) : req.product.price;
      const meth = methSelect ? methSelect.value : 'Stripe Card Refund';
      handleRefund(id, amt, meth, `RFND-${Date.now()}`);
    };

    window.viewInspectionPhoto = function (title, caption) {
      openPhotoZoom(title, caption);
    };
  }

  function closeReturnDrawer() {
    const drawer = document.getElementById('return-request-drawer');
    const backdrop = document.getElementById('return-drawer-backdrop');
    if (drawer) drawer.classList.remove('drawer-open');
    if (backdrop) backdrop.classList.remove('drawer-open');
  }

  /* --- RETURNS ACTION HANDLERS --- */
  function handleApproveReturn(requestId) {
    const req = state.requests.find(r => r.id === requestId);
    if (!req) return;

    req.status = 'approved';
    req.timeline.push({
      step: "Approved",
      timestamp: "Just now",
      note: "Return pickup authorized via BlueDart Air (AWB: BD-77829104). Doorstep courier dispatch scheduled.",
      actor: state.role === 'admin' ? "Admin (Store Owner)" : "Manager (Priya)"
    });

    state.activityLog.unshift({
      id: `act-${Date.now()}`,
      timestamp: "Just now",
      timeAgo: "Just now",
      user: state.role === 'admin' ? "Admin (Store Owner)" : "Manager (Priya)",
      role: state.role,
      action: "Approved Return Claim",
      detail: `Authorized reverse courier pickup for ${req.id} (${req.product.name}).`,
      productId: req.product.id
    });

    showToast(`Approved return claim ${req.id}. BlueDart pickup scheduled.`);
    openReturnDrawer(requestId);
    renderReturnsTable();
    renderReturnsMetrics();
  }

  function handleSizeExchange(requestId, targetSize) {
    const req = state.requests.find(r => r.id === requestId);
    if (!req) return;

    req.status = 'exchanged';
    req.timeline.push({
      step: "Exchanged",
      timestamp: "Just now",
      note: `Replacement Size ${targetSize} dispatched via Express (AWB: DTDC-HYD-${Date.now().toString().slice(-6)}). Inventory reconciled: Size ${req.product.size} +1, Size ${targetSize} -1.`,
      actor: state.role === 'admin' ? "Admin (Store Owner)" : "Staff (Sunita)"
    });

    // Update inventory in matching product in state.products
    const prod = state.products.find(p => p.name === req.product.name);
    if (prod && prod.variants) {
      const oldVariant = prod.variants.find(v => v.size === req.product.size);
      const newVariant = prod.variants.find(v => v.size === targetSize);
      if (oldVariant) oldVariant.stock += 1;
      if (newVariant && newVariant.stock > 0) newVariant.stock -= 1;
    }

    // Add to ledger
    state.inventoryLedger.unshift({
      id: `LEDG-${Date.now().toString().slice(-4)}`,
      timestamp: new Date().toISOString().replace('T', ' ').slice(0, 16),
      sku: req.product.sku,
      productName: req.product.name,
      movement: "Exchanged (Restock + Swap)",
      delta: 0,
      balance: prod ? prod.totalStock : 12,
      location: req.product.rack || "Studio Rack A-04",
      reason: `Size exchange completed for ${req.id} (Size ${req.product.size} -> ${targetSize})`,
      actor: state.role === 'admin' ? "Admin (Store Owner)" : "Staff (Sunita)"
    });

    state.activityLog.unshift({
      id: `act-${Date.now()}`,
      timestamp: "Just now",
      timeAgo: "Just now",
      user: state.role === 'admin' ? "Admin (Store Owner)" : "Staff (Sunita)",
      role: state.role,
      action: "Completed Size Exchange",
      detail: `Replaced Size ${req.product.size} with Size ${targetSize} for ${req.product.name} under ${req.id}.`,
      productId: req.product.id
    });

    showToast(`Size exchange confirmed for ${req.id}. Stock reconciled.`);
    openReturnDrawer(requestId);
    renderReturnsTable();
    renderReturnsMetrics();
    renderOverview();
  }

  function handleProductSwap(requestId, newProductId) {
    const req = state.requests.find(r => r.id === requestId);
    if (!req) return;

    req.status = 'exchanged';
    req.timeline.push({
      step: "Exchanged",
      timestamp: "Just now",
      note: `Garment swapped for Ajrakh Modal Satin Saree (+$70 price difference settled). Inventory reconciled.`,
      actor: state.role === 'admin' ? "Admin (Store Owner)" : "Manager (Priya)"
    });

    state.activityLog.unshift({
      id: `act-${Date.now()}`,
      timestamp: "Just now",
      timeAgo: "Just now",
      user: state.role === 'admin' ? "Admin (Store Owner)" : "Manager (Priya)",
      role: state.role,
      action: "Completed Product Swap",
      detail: `Swapped ${req.product.name} for alternative piece under ${req.id}.`,
      productId: req.product.id
    });

    showToast(`Product swap confirmed for ${req.id}.`);
    openReturnDrawer(requestId);
    renderReturnsTable();
    renderReturnsMetrics();
  }

  function handleRefund(requestId, amount, method, refNo) {
    const req = state.requests.find(r => r.id === requestId);
    if (!req) return;

    req.status = 'refunded';
    req.refundAmount = amount;
    req.refundDetails = {
      amount: amount,
      method: method,
      date: new Date().toISOString().slice(0, 10),
      ref: refNo,
      utr: `UTR${Date.now()}`
    };

    req.timeline.push({
      step: "Refunded",
      timestamp: "Just now",
      note: `Full refund of ${formatUSD(amount)} executed via ${method}. Transaction Ref: ${refNo}. Garment restocked to ${req.product.rack || 'Studio Rack A-04'}.`,
      actor: state.role === 'admin' ? "Admin (Finance Lead)" : "Store Manager"
    });

    // Restock garment in catalogue
    const prod = state.products.find(p => p.name === req.product.name);
    if (prod) {
      prod.totalStock += 1;
      if (prod.variants) {
        const v = prod.variants.find(item => item.size === req.product.size);
        if (v) v.stock += 1;
      }
    }

    state.inventoryLedger.unshift({
      id: `LEDG-${Date.now().toString().slice(-4)}`,
      timestamp: new Date().toISOString().replace('T', ' ').slice(0, 16),
      sku: req.product.sku,
      productName: req.product.name,
      movement: "Restocked (Refund Executed)",
      delta: +1,
      balance: prod ? prod.totalStock : 15,
      location: req.product.rack || "Studio Rack A-04",
      reason: `Garment returned and restocked under ${req.id}`,
      actor: "Admin (Finance Lead)"
    });

    state.activityLog.unshift({
      id: `act-${Date.now()}`,
      timestamp: "Just now",
      timeAgo: "Just now",
      user: state.role === 'admin' ? "Admin (Finance Lead)" : "Manager (Priya)",
      role: state.role,
      action: "Processed Refund",
      detail: `Released ${formatUSD(amount)} refund for ${req.product.name} (${req.id}). Garment returned to active stock.`,
      productId: req.product.id
    });

    showToast(`Refund of ${formatUSD(amount)} executed successfully.`);
    openReturnDrawer(requestId);
    renderReturnsTable();
    renderReturnsMetrics();
    renderOverview();
  }

  /* --- REJECTION MODAL --- */
  function openRejectionModal(requestId) {
    const modal = document.getElementById('rejection-modal');
    const select = document.getElementById('rejection-template-select');
    const note = document.getElementById('rejection-custom-note');
    const btnCancel = document.getElementById('btn-cancel-rejection');
    const btnClose = document.getElementById('btn-close-rejection-modal');
    const btnConfirm = document.getElementById('btn-confirm-rejection');
    if (!modal || !select || !note) return;

    const templates = BoutiqueData.REJECTION_TEMPLATES || [];
    select.innerHTML = templates.map((t, idx) => `
      <option value="${t.code}" ${idx === 0 ? 'selected' : ''}>${t.title}</option>
    `).join('');

    if (templates.length > 0) {
      note.value = templates[0].text;
    }

    select.onchange = function () {
      const match = templates.find(t => t.code === this.value);
      if (match) note.value = match.text;
    };

    modal.classList.add('modal-open');

    function closeModal() {
      modal.classList.remove('modal-open');
    }

    if (btnCancel) btnCancel.onclick = closeModal;
    if (btnClose) btnClose.onclick = closeModal;

    if (btnConfirm) {
      btnConfirm.onclick = function () {
        const req = state.requests.find(r => r.id === requestId);
        if (!req) return;

        req.status = 'rejected';
        req.rejectionReason = {
          code: select.value,
          note: note.value,
          date: new Date().toISOString()
        };

        req.timeline.push({
          step: "Rejected",
          timestamp: "Just now",
          note: `Claim declined under policy: ${note.value.slice(0, 80)}... Formal notice sent to customer.`,
          actor: state.role === 'admin' ? "Admin (Store Owner)" : "Manager (Priya)"
        });

        closeModal();
        showToast(`Request ${req.id} rejected.`);
        openReturnDrawer(requestId);
        renderReturnsTable();
        renderReturnsMetrics();
      };
    }
  }

  /* --- STOCK INVENTORY AUDIT LEDGER MODAL --- */
  function openLedgerModal() {
    const modal = document.getElementById('ledger-modal');
    const tbody = document.getElementById('ledger-table-body');
    if (!modal || !tbody) return;

    tbody.innerHTML = state.inventoryLedger.map(item => `
      <tr>
        <td class="font-mono text-muted">${item.timestamp}</td>
        <td>
          <strong style="display: block;">${escapeHtml(item.productName)}</strong>
          <span class="font-mono text-muted" style="font-size: 0.7rem;">${item.sku}</span>
        </td>
        <td>
          <span class="badge" style="background: var(--bg-subtle); border: 1px solid var(--border-hairline); font-size: 0.6875rem;">
            ${escapeHtml(item.movement)}
          </span>
        </td>
        <td class="font-mono" style="font-weight: 700; color: ${item.delta > 0 ? 'var(--stock-in)' : item.delta < 0 ? 'var(--stock-out)' : 'var(--text-primary)'};">
          ${item.delta > 0 ? '+' + item.delta : item.delta}
        </td>
        <td>${escapeHtml(item.location)}</td>
        <td style="color: var(--text-secondary);">${escapeHtml(item.reason)}</td>
        <td class="text-muted">${escapeHtml(item.actor)}</td>
      </tr>
    `).join('');

    modal.classList.add('modal-open');
  }

  function closeLedgerModal() {
    const modal = document.getElementById('ledger-modal');
    if (modal) modal.classList.remove('modal-open');
  }

  /* --- PHOTO ZOOM MODAL --- */
  function openPhotoZoom(title, caption) {
    const modal = document.getElementById('photo-zoom-modal');
    const titleEl = document.getElementById('photo-zoom-title');
    const visual = document.getElementById('photo-zoom-visual');
    const captionEl = document.getElementById('photo-zoom-caption');
    if (!modal) return;

    if (titleEl) titleEl.textContent = title || "Garment Inspection Media";
    if (captionEl) captionEl.textContent = caption || "Macro weave and security tag intact inspection.";
    if (visual) {
      visual.innerHTML = `
        <div style="text-align: center; color: var(--text-muted); font-size: 0.78rem;">
          <svg width="36" height="36" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" style="margin: 0 auto 0.35rem auto; display: block; color: var(--accent);"><circle cx="11" cy="11" r="8"/><line x1="21" x2="16.65" y1="21" y2="16.65"/><line x1="11" x2="11" y1="8" y2="14"/><line x1="8" x2="14" y1="11" y2="11"/></svg>
          <strong>High-Resolution Atelier Macro Zoom View</strong>
          <div style="font-size: 0.7rem; color: var(--text-muted); margin-top: 0.2rem;">36-Megapixel Studio RAW Asset Inspected &bull; Verified 100% Genuine Handloom</div>
        </div>
      `;
    }

    modal.classList.add('modal-open');
  }

  /* --- CUSTOMER RETURN CONCIERGE PORTAL --- */
  function initCustomerPortal() {
    const chip1 = document.getElementById('chip-demo-order-1');
    const chip2 = document.getElementById('chip-demo-order-2');
    const orderInput = document.getElementById('cust-order-lookup');
    const phoneInput = document.getElementById('cust-phone-lookup');
    const garmentName = document.getElementById('cust-garment-name');
    const garmentSub = document.getElementById('cust-garment-sub');
    const garmentPrice = document.getElementById('cust-garment-price');
    const pickupAddr = document.getElementById('cust-pickup-address');
    const btnSubmit = document.getElementById('btn-submit-customer-return');
    const formCard = document.getElementById('cust-form-step-container');
    const confirmBlock = document.getElementById('cust-confirmation-block');

    if (confirmBlock) confirmBlock.style.display = 'none';
    if (formCard) formCard.style.display = 'block';

    function fillDemoOrder(orderId) {
      const orders = BoutiqueData.CUSTOMER_SAMPLE_ORDERS || [];
      const match = orders.find(o => o.orderId === orderId) || orders[0];
      if (!match) return;

      if (orderInput) orderInput.value = match.orderId;
      if (phoneInput) phoneInput.value = match.customerPhone;
      if (pickupAddr) pickupAddr.textContent = match.address;

      if (match.items && match.items[0]) {
        const it = match.items[0];
        if (garmentName) garmentName.textContent = it.name;
        if (garmentSub) garmentSub.textContent = `${it.color} • Size ${it.size} • SKU: ${it.sku}`;
        if (garmentPrice) garmentPrice.textContent = formatUSD(it.price);
      }
    }

    if (chip1) chip1.onclick = () => fillDemoOrder('ORD-24817');
    if (chip2) chip2.onclick = () => fillDemoOrder('ORD-24805');

    // Resolution radio choice selection
    document.querySelectorAll('.radio-choice-card').forEach(card => {
      card.onclick = function () {
        document.querySelectorAll('.radio-choice-card').forEach(c => c.classList.remove('selected'));
        this.classList.add('selected');
        const choice = this.getAttribute('data-choice-type');

        const sizeOptions = document.getElementById('cust-size-exchange-options');
        if (sizeOptions) {
          sizeOptions.style.display = choice === 'size_exchange' ? 'block' : 'none';
        }
      };
    });

    // Target size picker
    document.querySelectorAll('.cust-size-btn').forEach(btn => {
      btn.onclick = function () {
        document.querySelectorAll('.cust-size-btn').forEach(b => {
          b.classList.remove('active');
          b.style.background = '';
          b.style.color = '';
        });
        this.classList.add('active');
        this.style.background = 'var(--accent)';
        this.style.color = 'var(--text-inverse)';
      };
    });

    // Photo upload simulation
    const dropzone = document.getElementById('cust-upload-dropzone');
    const photoLabel = document.getElementById('cust-photo-attached-label');
    if (dropzone && photoLabel) {
      dropzone.onclick = function () {
        photoLabel.style.display = 'block';
        showToast("Photos attached: [Bust Seam Measurement.jpg, Security Seal Intact.jpg]");
      };
    }

    // Submit handler
    if (btnSubmit) {
      btnSubmit.onclick = function () {
        const orderId = orderInput ? orderInput.value.trim() : 'ORD-24817';
        const phone = phoneInput ? phoneInput.value.trim() : '9820144821';
        const reasonCat = document.getElementById('cust-reason-category');
        const notes = document.getElementById('cust-verbatim-notes');
        const activeRadio = document.querySelector('.radio-choice-card.selected');
        const resolution = activeRadio ? activeRadio.getAttribute('data-choice-type') : 'size_exchange';

        const activeSizeBtn = document.querySelector('.cust-size-btn.active');
        const targetSize = activeSizeBtn ? activeSizeBtn.getAttribute('data-size') : 'L';

        const newId = `RET-26-${Math.floor(90 + Math.random() * 10)}`;
        state.newCreatedRequestId = newId;

        const newReq = {
          id: newId,
          createdAt: new Date().toISOString(),
          orderId: orderId,
          orderDate: "2026-10-28",
          channel: "Customer Concierge Portal",
          customer: {
            name: orderId === 'ORD-24805' ? "Shreya Sen" : "Ananya Deshmukh",
            email: orderId === 'ORD-24805' ? "shreya.sen@lifestyle.in" : "ananya.deshmukh@gmail.com",
            phone: phone,
            city: orderId === 'ORD-24805' ? "Pune, Maharashtra" : "Mumbai, Maharashtra",
            address: pickupAddr ? pickupAddr.textContent : "Flat 402, Sea Green Apts, Mumbai"
          },
          product: {
            id: "PROD-1002",
            name: garmentName ? garmentName.textContent : "Chanderi Silk Angrakha Kurta",
            sku: "CSK-ECR-M",
            size: "M",
            color: "Natural Ecru",
            price: 225,
            rack: "Studio Rack A-04"
          },
          type: resolution,
          exchangeTarget: resolution === 'size_exchange' ? { size: targetSize, status: 'in_stock', availableUnits: 3 } : null,
          reasonCategory: reasonCat ? reasonCat.value : "Incorrect Sizing / Fit",
          customerReason: notes && notes.value ? notes.value : "Silhouette armhole tighter than expected; requesting size exchange.",
          photos: [
            { id: "ph-new-1", title: "Customer Seam Inspection", tag: "Fit Check", caption: "Customer verified tag intact." }
          ],
          status: "requested",
          qcStatus: "pending",
          refundAmount: 225,
          refundDetails: null,
          rejectionReason: null,
          timeline: [
            {
              step: "Requested",
              timestamp: "Just now",
              note: `Customer submitted ${resolution.replace('_', ' ')} request via Concierge Portal.`,
              actor: `Customer (${orderId === 'ORD-24805' ? 'Shreya Sen' : 'Ananya Deshmukh'})`
            }
          ]
        };

        state.requests.unshift(newReq);

        // Add to activity ledger
        state.activityLog.unshift({
          id: `act-${Date.now()}`,
          timestamp: "Just now",
          timeAgo: "Just now",
          user: newReq.customer.name,
          role: "customer",
          action: "Submitted Return Request",
          detail: `Logged ${newReq.type.replace('_', ' ')} for ${newReq.product.name} (${newReq.id}, Order: ${newReq.orderId}).`,
          productId: newReq.product.id
        });

        // Add to notifications
        state.notifications.unshift({
          id: `notif-${Date.now()}`,
          title: "New Return Claim Logged",
          message: `${newReq.customer.name} requested return for ${newReq.product.name} (${newReq.id}).`,
          time: "Just now",
          unread: true
        });

        // Update badge
        updateAllSidebarBadges();

        const refDisplay = document.getElementById('cust-confirm-ref');
        if (refDisplay) refDisplay.textContent = newId;

        if (formCard) formCard.style.display = 'none';
        if (confirmBlock) confirmBlock.style.display = 'block';

        showToast(`Return claim ${newId} logged successfully!`);
      };
    }
  }

  document.addEventListener('DOMContentLoaded', () => {
    initShell();
    renderOverview();
  });

})();
