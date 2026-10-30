/**
 * Fashion Boutique Management System — Application Controller
 * Module 16: Returns, Exchanges & Refunds (Admin Panel & Customer Portal)
 */

(function () {
  'use strict';

  // Application State
  const state = {
    requests: JSON.parse(JSON.stringify(INITIAL_REQUESTS)),
    products: JSON.parse(JSON.stringify(INITIAL_PRODUCTS)),
    inventoryLedger: JSON.parse(JSON.stringify(INITIAL_INVENTORY_LEDGER)),
    selectedRequestId: "RET-26-089", // default open first item for instant inspection
    activeFilterTab: "all",
    searchQuery: "",
    typeFilter: "all",
    reasonFilter: "all",
    dateFilter: "all",
    userRole: "admin", // 'admin' | 'staff'
    currentTheme: localStorage.getItem("boutique_theme") || "dark",
    currentView: "admin", // 'admin' | 'customer_portal'
    simulatedState: "normal", // 'normal' | 'empty' | 'loading' | 'error'
    newCreatedRequestId: null,
    customerFormData: {
      orderId: "ORD-24817",
      selectedProduct: null,
      type: "size_exchange",
      targetSize: "L",
      targetProduct: null,
      reasonCategory: "Incorrect Sizing / Fit",
      customerReason: "",
      hasPhoto: true
    }
  };

  // Helper: Format currency in INR
  function formatINR(amount) {
    if (amount === undefined || amount === null) return "₹0";
    return "₹" + Number(amount).toLocaleString("en-IN");
  }

  // Helper: Format date strings
  function formatDate(isoString) {
    if (!isoString) return "";
    const date = new Date(isoString);
    if (isNaN(date.getTime())) return isoString;
    return date.toLocaleDateString("en-IN", {
      day: "2-digit",
      month: "short",
      year: "numeric"
    });
  }

  // SVG Icons collection (Thin-line 1.75px stroke Lucide-style)
  const icons = {
    package: `<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.75" stroke-linecap="round" stroke-linejoin="round"><path d="m7.5 4.27 9 5.15"/><path d="M21 8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16Z"/><path d="m3.3 7 8.7 5 8.7-5"/><path d="M12 22V12"/></svg>`,
    refresh: `<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.75" stroke-linecap="round" stroke-linejoin="round"><path d="M3 12a9 9 0 0 1 9-9 9.75 9.75 0 0 1 6.74 2.74L21 8"/><path d="M21 3v5h-5"/><path d="M21 12a9 9 0 0 1-9 9 9.75 9.75 0 0 1-6.74-2.74L3 16"/><path d="M8 16H3v5"/></svg>`,
    checkCircle: `<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.75" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><path d="m9 12 2 2 4-4"/></svg>`,
    xCircle: `<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.75" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><path d="m15 9-6 6"/><path d="m9 9 6 6"/></svg>`,
    search: `<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.75" stroke-linecap="round" stroke-linejoin="round"><circle cx="11" cy="11" r="8"/><path d="m21 21-4.3-4.3"/></svg>`,
    arrowRight: `<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.75" stroke-linecap="round" stroke-linejoin="round"><path d="M5 12h14"/><path d="m12 5 7 7-7 7"/></svg>`,
    arrowLeft: `<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.75" stroke-linecap="round" stroke-linejoin="round"><path d="m12 19-7-7 7-7"/><path d="M19 12H5"/></svg>`,
    close: `<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.75" stroke-linecap="round" stroke-linejoin="round"><path d="M18 6 6 18"/><path d="m6 6 12 12"/></svg>`,
    alertCircle: `<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.75" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><line x1="12" x2="12" y1="8" y2="12"/><line x1="12" x2="12.01" y1="16" y2="16"/></svg>`,
    layers: `<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.75" stroke-linecap="round" stroke-linejoin="round"><polygon points="12 2 2 7 12 12 22 7 12 2"/><polyline points="2 17 12 22 22 17"/><polyline points="2 12 12 17 22 12"/></svg>`,
    shieldCheck: `<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.75" stroke-linecap="round" stroke-linejoin="round"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/><path d="m9 12 2 2 4-4"/></svg>`,
    truck: `<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.75" stroke-linecap="round" stroke-linejoin="round"><path d="M14 18V6a2 2 0 0 0-2-2H4a2 2 0 0 0-2 2v11a1 1 0 0 0 1 1h2"/><path d="M15 18H9"/><path d="M19 18h2a1 1 0 0 0 1-1v-3.65a1 1 0 0 0-.22-.62l-3.48-4.35A1 1 0 0 0 17.52 8H14"/><circle cx="17" cy="18" r="2"/><circle cx="7" cy="18" r="2"/></svg>`,
    zoom: `<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.75" stroke-linecap="round" stroke-linejoin="round"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/><line x1="11" y1="8" x2="11" y2="14"/><line x1="8" y1="11" x2="14" y2="11"/></svg>`,
    creditCard: `<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.75" stroke-linecap="round" stroke-linejoin="round"><rect width="20" height="14" x="2" y="5" rx="2"/><line x1="2" x2="22" y1="10" y2="10"/></svg>`,
    box: `<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.75" stroke-linecap="round" stroke-linejoin="round"><path d="M21 8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16Z"/><polyline points="3.29 7 12 12 20.71 7"/><line x1="12" y1="22" x2="12" y2="12"/></svg>`,
    user: `<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.75" stroke-linecap="round" stroke-linejoin="round"><path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>`,
    camera: `<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.75" stroke-linecap="round" stroke-linejoin="round"><path d="M14.5 4h-5L7 7H4a2 2 0 0 0-2 2v9a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2V9a2 2 0 0 0-2-2h-3l-2.5-3z"/><circle cx="12" cy="13" r="3"/></svg>`
  };

  // DOM Elements cache
  const el = {
    // Topbar & global controls
    btnThemeDark: document.getElementById("btn-theme-dark"),
    btnThemeLight: document.getElementById("btn-theme-light"),
    btnPortalThemeDark: document.getElementById("btn-portal-theme-dark"),
    btnPortalThemeLight: document.getElementById("btn-portal-theme-light"),
    roleAdminBtn: document.getElementById("btn-role-admin"),
    roleStaffBtn: document.getElementById("btn-role-staff"),
    roleIndicatorText: document.getElementById("role-indicator-text"),
    btnSwitchToCustomer: document.getElementById("btn-switch-to-customer"),
    btnSwitchToAdmin: document.getElementById("btn-switch-to-admin"),
    customerPortalView: document.getElementById("customer-portal-view"),
    btnViewLedger: document.getElementById("btn-view-ledger"),
    stateSelect: document.getElementById("state-simulator-select"),

    // Table & filter controls
    tabsContainer: document.getElementById("filter-tabs-container"),
    tableBody: document.getElementById("requests-table-body"),
    tableContainer: document.getElementById("table-container"),
    searchInput: document.getElementById("table-search-input"),
    typeSelect: document.getElementById("filter-type-select"),
    reasonSelect: document.getElementById("filter-reason-select"),
    dateSelect: document.getElementById("filter-date-select"),
    btnClearFilters: document.getElementById("btn-clear-filters"),
    tableCountFooter: document.getElementById("table-count-footer"),

    // Metric counters
    metricPendingReview: document.getElementById("metric-pending-review"),
    metricInTransit: document.getElementById("metric-in-transit"),
    metricExchanges: document.getElementById("metric-exchanges"),
    metricRefundsMonth: document.getElementById("metric-refunds-month"),

    // Drawer elements
    drawerBackdrop: document.getElementById("drawer-backdrop"),
    requestDrawer: document.getElementById("request-drawer"),
    drawerCloseBtn: document.getElementById("drawer-close-btn"),
    drawerContent: document.getElementById("drawer-content"),

    // Modals
    rejectionModal: document.getElementById("rejection-modal"),
    rejectionModalClose: document.getElementById("rejection-modal-close"),
    rejectionCancelBtn: document.getElementById("rejection-cancel-btn"),
    rejectionConfirmBtn: document.getElementById("rejection-confirm-btn"),
    rejectionTemplateSelect: document.getElementById("rejection-template-select"),
    rejectionTextarea: document.getElementById("rejection-custom-note"),

    ledgerModal: document.getElementById("ledger-modal"),
    ledgerModalClose: document.getElementById("ledger-modal-close"),
    ledgerTableBody: document.getElementById("ledger-table-body"),

    photoZoomModal: document.getElementById("photo-zoom-modal"),
    photoZoomModalClose: document.getElementById("photo-zoom-modal-close"),
    photoZoomTitle: document.getElementById("photo-zoom-title"),
    photoZoomCaption: document.getElementById("photo-zoom-caption"),
    photoZoomVisual: document.getElementById("photo-zoom-visual"),

    inactiveModuleModal: document.getElementById("inactive-module-modal"),
    inactiveModuleClose: document.getElementById("inactive-module-close"),
    inactiveModuleName: document.getElementById("inactive-module-name"),

    // Toast
    toast: document.getElementById("global-toast"),
    toastMessage: document.getElementById("toast-message")
  };

  // Toast Notification System
  let toastTimer = null;
  function showToast(message) {
    if (toastTimer) clearTimeout(toastTimer);
    el.toastMessage.textContent = message;
    el.toast.classList.add("show");
    toastTimer = setTimeout(() => {
      el.toast.classList.remove("show");
    }, 3800);
  }

  // Calculate Metrics from State
  function updateMetrics() {
    const pendingReview = state.requests.filter(r => r.status === "requested").length;
    const inTransit = state.requests.filter(r => r.status === "approved" || r.status === "received").length;
    const exchanges = state.requests.filter(r => r.type === "size_exchange" || r.type === "product_exchange").length;
    const refundTotal = state.requests
      .filter(r => r.status === "refunded")
      .reduce((sum, r) => sum + (r.refundDetails?.amount || r.refundAmount || 0), 0);

    if (el.metricPendingReview) el.metricPendingReview.textContent = pendingReview;
    if (el.metricInTransit) el.metricInTransit.textContent = inTransit;
    if (el.metricExchanges) el.metricExchanges.textContent = exchanges;
    if (el.metricRefundsMonth) el.metricRefundsMonth.textContent = formatINR(refundTotal);
  }

  // Filter Requests based on active filters
  function getFilteredRequests() {
    return state.requests.filter(req => {
      // Tab filter
      if (state.activeFilterTab === "needs_action") {
        if (req.status !== "requested" && req.status !== "received") return false;
      } else if (state.activeFilterTab === "in_transit") {
        if (req.status !== "approved" && req.status !== "received") return false;
      } else if (state.activeFilterTab === "exchanges") {
        if (req.type !== "size_exchange" && req.type !== "product_exchange") return false;
      } else if (state.activeFilterTab === "refunded") {
        if (req.status !== "refunded") return false;
      } else if (state.activeFilterTab === "rejected") {
        if (req.status !== "rejected") return false;
      }

      // Type filter
      if (state.typeFilter !== "all" && req.type !== state.typeFilter) {
        return false;
      }

      // Reason filter
      if (state.reasonFilter !== "all" && req.reasonCategory !== state.reasonFilter) {
        return false;
      }

      // Date filter
      if (state.dateFilter !== "all") {
        const reqDate = new Date(req.createdAt).getTime();
        const baseDate = new Date("2026-10-30T16:08:45").getTime();
        const diffDays = (baseDate - reqDate) / (1000 * 60 * 60 * 24);
        if (state.dateFilter === "today" && diffDays > 1) return false;
        if (state.dateFilter === "last_7_days" && diffDays > 7) return false;
        if (state.dateFilter === "last_30_days" && diffDays > 30) return false;
      }

      // Search Query
      if (state.searchQuery.trim() !== "") {
        const query = state.searchQuery.toLowerCase();
        const matchesId = req.id.toLowerCase().includes(query);
        const matchesOrder = req.orderId.toLowerCase().includes(query);
        const matchesCustomer = req.customer.name.toLowerCase().includes(query);
        const matchesPhone = req.customer.phone.toLowerCase().includes(query);
        const matchesProduct = req.product.name.toLowerCase().includes(query);
        const matchesSku = req.product.sku.toLowerCase().includes(query);
        if (!matchesId && !matchesOrder && !matchesCustomer && !matchesPhone && !matchesProduct && !matchesSku) {
          return false;
        }
      }

      return true;
    });
  }

  // Render Table
  function renderTable() {
    updateMetrics();

    // Check simulation states
    if (state.simulatedState === "loading") {
      el.tableContainer.innerHTML = `
        <div style="padding: 1.5rem;">
          <div class="skeleton-row"></div>
          <div class="skeleton-row"></div>
          <div class="skeleton-row"></div>
          <div class="skeleton-row"></div>
          <div class="skeleton-row"></div>
        </div>
      `;
      return;
    }

    if (state.simulatedState === "error") {
      el.tableContainer.innerHTML = `
        <div class="state-container">
          <div style="color: var(--status-rejected-text);">${icons.alertCircle}</div>
          <h3 class="state-title">Studio Inventory Ledger Synchronization Failed</h3>
          <p class="state-desc">Unable to retrieve real-time rack inventory balances from the Colaba Studio Hub. Please verify network or retry.</p>
          <button class="btn-primary" id="btn-retry-sync" style="margin-top: 0.5rem;">
            ${icons.refresh} Retry Connection
          </button>
        </div>
      `;
      document.getElementById("btn-retry-sync")?.addEventListener("click", () => {
        state.simulatedState = "normal";
        el.stateSelect.value = "normal";
        renderTable();
        showToast("Reconnected to Studio Inventory Database.");
      });
      return;
    }

    const filtered = getFilteredRequests();

    // Reset table structure if it was replaced by state views
    if (!document.getElementById("requests-table-body")) {
      el.tableContainer.innerHTML = `
        <div class="table-responsive">
          <table class="data-table">
            <thead>
              <tr>
                <th style="width: 130px;">Request ID</th>
                <th style="width: 110px;">Order ID</th>
                <th>Customer</th>
                <th>Product & SKU</th>
                <th>Type</th>
                <th>Return Reason</th>
                <th>Value</th>
                <th>Status</th>
                <th style="text-align: right;">Action</th>
              </tr>
            </thead>
            <tbody id="requests-table-body"></tbody>
          </table>
        </div>
      `;
      el.tableBody = document.getElementById("requests-table-body");
    }

    if (filtered.length === 0 || state.simulatedState === "empty") {
      el.tableBody.innerHTML = `
        <tr>
          <td colspan="9" style="padding: 0;">
            <div class="state-container">
              <div style="color: var(--text-muted);">${icons.package}</div>
              <h3 class="state-title">No Return Requests Found</h3>
              <p class="state-desc">There are no return or exchange requests matching the selected filters. Clear your search or filter options.</p>
              <button class="btn-secondary" id="btn-reset-empty-filters">Reset All Filters</button>
            </div>
          </td>
        </tr>
      `;
      document.getElementById("btn-reset-empty-filters")?.addEventListener("click", clearAllFilters);
      if (el.tableCountFooter) el.tableCountFooter.textContent = "Showing 0 requests";
      return;
    }

    el.tableBody.innerHTML = filtered.map(req => {
      const isSelected = req.id === state.selectedRequestId;
      const isNewlyCreated = req.id === state.newCreatedRequestId;
      const typeBadgeClass = req.type.includes("exchange") ? "type-exchange" : req.type === "refund" ? "type-refund" : "type-credit";
      const typeLabel = req.type === "size_exchange" ? "Size Exchange" : req.type === "product_exchange" ? "Product Swap" : req.type === "refund" ? "Store Refund" : "Store Credit";

      return `
        <tr class="${isSelected ? 'row-selected' : ''}" data-request-id="${req.id}" style="${isNewlyCreated ? 'background-color: var(--status-requested-bg); transition: background-color 2s ease;' : ''}">
          <td data-label="Request ID">
            <div style="display: flex; align-items: center; gap: 0.35rem;">
              <span class="font-mono" style="font-weight: 600; font-size: 0.8125rem;">${req.id}</span>
              ${isNewlyCreated ? '<span style="font-size: 0.6rem; padding: 1px 4px; background: var(--oxblood); color: #fff; border-radius: 2px;">NEW</span>' : ''}
            </div>
            <div class="text-overline" style="font-size: 0.65rem; color: var(--text-muted);">${formatDate(req.createdAt)}</div>
          </td>
          <td data-label="Order ID">
            <span class="font-mono" style="font-weight: 500;">${req.orderId}</span>
            <div style="font-size: 0.6875rem; color: var(--text-muted);">${req.channel}</div>
          </td>
          <td data-label="Customer">
            <div class="cell-customer">
              <span class="customer-name">${req.customer.name}</span>
              <span class="customer-location">${req.customer.city.split(',')[0]}</span>
            </div>
          </td>
          <td data-label="Product">
            <div class="cell-product">
              <div class="item-thumb-placeholder">
                ${req.product.size}
              </div>
              <div class="product-meta">
                <span class="product-name">${req.product.name}</span>
                <span class="product-sku">${req.product.sku}</span>
              </div>
            </div>
          </td>
          <td data-label="Type">
            <span class="type-tag ${typeBadgeClass}">${typeLabel}</span>
          </td>
          <td data-label="Reason">
            <span style="font-size: 0.75rem; color: var(--text-secondary); max-width: 170px; display: inline-block; white-space: nowrap; overflow: hidden; text-overflow: ellipsis;" title="${req.customerReason}">
              ${req.reasonCategory}
            </span>
          </td>
          <td data-label="Value">
            <span class="font-mono" style="font-weight: 600;">${formatINR(req.refundAmount || req.product.price)}</span>
          </td>
          <td data-label="Status">
            <span class="status-pill status-${req.status}">
              ${req.status.replace('_', ' ')}
            </span>
          </td>
          <td data-label="Action" style="text-align: right;">
            <a href="javascript:void(0)" class="row-action-link" data-open-id="${req.id}">
              Inspect ${icons.arrowRight}
            </a>
          </td>
        </tr>
      `;
    }).join("");

    if (el.tableCountFooter) {
      el.tableCountFooter.textContent = `Showing ${filtered.length} of ${state.requests.length} total return requests`;
    }

    // Attach row click listeners
    el.tableBody.querySelectorAll("tr[data-request-id]").forEach(row => {
      row.addEventListener("click", (e) => {
        const id = row.getAttribute("data-request-id");
        openRequestDrawer(id);
      });
    });
  }

  // Clear all filters
  function clearAllFilters() {
    state.activeFilterTab = "all";
    state.searchQuery = "";
    state.typeFilter = "all";
    state.reasonFilter = "all";
    state.dateFilter = "all";
    state.simulatedState = "normal";

    el.searchInput.value = "";
    el.typeSelect.value = "all";
    el.reasonSelect.value = "all";
    if (el.dateSelect) el.dateSelect.value = "all";
    el.stateSelect.value = "normal";

    updateTabUI();
    renderTable();
  }

  function updateTabUI() {
    el.tabsContainer.querySelectorAll(".filter-tab").forEach(tab => {
      if (tab.getAttribute("data-tab") === state.activeFilterTab) {
        tab.classList.add("active");
      } else {
        tab.classList.remove("active");
      }
    });
  }

  // Open Request Drawer
  function openRequestDrawer(requestId) {
    const req = state.requests.find(r => r.id === requestId);
    if (!req) return;

    state.selectedRequestId = requestId;
    renderDrawerContent(req);

    el.drawerBackdrop.classList.add("active");
    el.requestDrawer.classList.add("open");

    // Also update row highlighting in table
    document.querySelectorAll(".data-table tbody tr").forEach(row => {
      if (row.getAttribute("data-request-id") === requestId) {
        row.classList.add("row-selected");
      } else {
        row.classList.remove("row-selected");
      }
    });
  }

  function closeRequestDrawer() {
    el.drawerBackdrop.classList.remove("active");
    el.requestDrawer.classList.remove("open");
  }

  // Render Drawer Content dynamically
  function renderDrawerContent(req) {
    const prod = state.products.find(p => p.id === req.product.id) || state.products[0];
    const isStaff = state.userRole === "staff";

    // Build timeline HTML
    const timelineHtml = req.timeline.map((item, idx) => {
      const isLast = idx === req.timeline.length - 1;
      return `
        <div class="timeline-step ${isLast ? 'active' : 'completed'}">
          <div class="timeline-dot"></div>
          <div class="step-meta">
            <span class="step-title">${item.step}</span>
            <span class="step-time font-mono">${item.timestamp}</span>
          </div>
          <div class="step-note">${item.note}</div>
          <div class="step-actor">By: ${item.actor}</div>
        </div>
      `;
    }).join("");

    // Build Action Workspace based on current request status and type
    let workspaceHtml = "";

    if (req.status === "requested") {
      workspaceHtml = `
        <div class="action-workspace">
          <div class="workspace-header">
            <span class="text-overline">Step 1 of 3: Request Authorization</span>
            <span class="workspace-badge">Pending Review</span>
          </div>

          <p style="font-size: 0.8125rem; color: var(--text-secondary); line-height: 1.4;">
            Customer requested authorization. Approving will automatically generate reverse shipping pickup via <strong>BlueDart Air</strong> and email the return consignment label to <strong>${req.customer.email}</strong>.
          </p>

          ${isStaff ? `
            <div class="role-restriction-notice">
              ${icons.alertCircle}
              <span>Role Notice: You are in <strong>Staff Mode</strong>. Staff may verify garment photos, but final approval requires Store Manager (Admin) rights.</span>
            </div>
          ` : ''}

          <div class="drawer-footer-actions">
            <button class="btn-primary" id="btn-approve-request" ${isStaff ? 'disabled' : ''}>
              ${icons.checkCircle} Approve & Schedule Reverse Pickup
            </button>
            <button class="btn-danger-outline" id="btn-open-reject-modal" ${isStaff ? 'disabled' : ''}>
              ${icons.xCircle} Reject Request
            </button>
          </div>
        </div>
      `;
    } else if (req.status === "approved") {
      workspaceHtml = `
        <div class="action-workspace">
          <div class="workspace-header">
            <span class="text-overline">Step 2 of 3: Studio Inward & Physical QC</span>
            <span class="workspace-badge" style="background: var(--status-received-bg); color: var(--status-received-text); border: 1px solid var(--status-received-border);">Pickup Scheduled</span>
          </div>

          <div class="inventory-impact-box" style="background: var(--bg-subtle); border-color: var(--border-hairline);">
            <div class="impact-icon" style="color: var(--text-secondary);">${icons.truck}</div>
            <div class="impact-content">
              <span class="impact-title">Consignment in Transit</span>
              <span class="impact-details">BlueDart Airway Bill: <strong class="font-mono">BD-77829104</strong>. Expected arrival at Colaba Studio Hub within 24-48 hours.</span>
            </div>
          </div>

          <p style="font-size: 0.8125rem; color: var(--text-secondary);">
            Once the courier arrives and unwraps the parcel at the studio, mark the item as received to begin physical fabric inspection.
          </p>

          <div class="drawer-footer-actions">
            <button class="btn-primary" id="btn-mark-received">
              ${icons.package} Mark as Received at Studio (Physical QC)
            </button>
          </div>
        </div>
      `;
    } else if (req.status === "received") {
      // Received status: branch depending on type (Size Exchange, Product Exchange, Refund)
      if (req.type === "size_exchange") {
        const availableSizes = Object.entries(prod.inventory).map(([size, count]) => {
          const isCurrent = size === req.product.size;
          const isSelected = req.exchangeTarget?.size === size;
          const isOutOfStock = count === 0;

          return `
            <div class="size-option-card ${isSelected ? 'selected' : ''} ${isOutOfStock ? 'disabled' : ''}" 
                 data-exchange-size="${size}" 
                 data-stock-count="${count}">
              <div class="size-label">${size}</div>
              <div class="size-stock-indicator ${count > 0 ? 'in-stock' : 'out-of-stock'}">
                ${isCurrent ? '(Returned)' : count > 0 ? `${count} in stock` : 'Out of Stock'}
              </div>
            </div>
          `;
        }).join("");

        const chosenSize = req.exchangeTarget?.size || "L";
        const chosenStock = prod.inventory[chosenSize] !== undefined ? prod.inventory[chosenSize] : 3;

        workspaceHtml = `
          <div class="action-workspace">
            <div class="workspace-header">
              <span class="text-overline">Final Step: Execute Size Exchange</span>
              <span class="workspace-badge">Garment Received & QC Passed</span>
            </div>

            <div style="font-size: 0.8125rem;">
              <span style="font-weight: 600; color: var(--text-primary);">Select Target Exchange Size:</span>
              <div class="size-picker-grid" style="margin-top: 0.5rem;" id="exchange-size-grid">
                ${availableSizes}
              </div>
            </div>

            <!-- Live Inventory Forecast -->
            <div class="inventory-impact-box" id="exchange-inventory-forecast">
              <div class="impact-icon">${icons.layers}</div>
              <div class="impact-content">
                <span class="impact-title">Live Inventory Impact on Execution:</span>
                <span class="impact-details">
                  • Restock returned size <strong>${req.product.size}</strong> (+1 unit to ${prod.rack})<br>
                  • Deduct selected size <strong>${chosenSize}</strong> (-1 unit from available ${chosenStock} pcs)<br>
                  • Reserve stock immediately for outbound courier dispatch.
                </span>
              </div>
            </div>

            <div class="drawer-footer-actions">
              <button class="btn-primary" id="btn-process-size-exchange" ${chosenStock <= 0 ? 'disabled' : ''}>
                ${icons.refresh} Confirm Size Exchange & Update Inventory
              </button>
            </div>
          </div>
        `;
      } else if (req.type === "product_exchange") {
        const otherProducts = state.products.filter(p => p.id !== req.product.id);
        const optionsHtml = otherProducts.map(p => {
          const isSel = req.exchangeTarget?.productId === p.id;
          return `<option value="${p.id}" ${isSel ? 'selected' : ''}>${p.name} (${formatINR(p.price)})</option>`;
        }).join("");

        const targetProduct = state.products.find(p => p.id === req.exchangeTarget?.productId) || otherProducts[0];
        const priceDiff = (targetProduct?.price || 0) - req.product.price;

        workspaceHtml = `
          <div class="action-workspace">
            <div class="workspace-header">
              <span class="text-overline">Final Step: Product Swap & Ledger Settlement</span>
              <span class="workspace-badge">Garment Received</span>
            </div>

            <div class="form-group">
              <label class="form-label">Replacement Garment from Catalogue</label>
              <select class="form-select" id="select-product-exchange">
                ${optionsHtml}
              </select>
            </div>

            <div class="inventory-impact-box">
              <div class="impact-icon">${icons.creditCard}</div>
              <div class="impact-content">
                <span class="impact-title">Price Settlement Breakdown:</span>
                <span class="impact-details">
                  Original Item: ${formatINR(req.product.price)}<br>
                  New Selected Item: ${formatINR(targetProduct.price)}<br>
                  <strong>${priceDiff > 0 ? `Customer pays difference: +${formatINR(priceDiff)}` : priceDiff < 0 ? `Refund difference to customer: ${formatINR(Math.abs(priceDiff))}` : 'Even value exchange (₹0 difference)'}</strong>
                </span>
              </div>
            </div>

            <div class="drawer-footer-actions">
              <button class="btn-primary" id="btn-process-product-exchange">
                ${icons.refresh} Complete Product Swap & Update Racks
              </button>
            </div>
          </div>
        `;
      } else {
        // Refund / Store credit
        workspaceHtml = `
          <div class="action-workspace">
            <div class="workspace-header">
              <span class="text-overline">Final Step: Process Refund & Restock Garment</span>
              <span class="workspace-badge">Garment Received & QC Passed</span>
            </div>

            <div class="refund-form-grid">
              <div class="form-group">
                <label class="form-label">Refund Amount (INR)</label>
                <input type="number" class="form-input font-mono" id="refund-amount-input" value="${req.refundAmount || req.product.price}" />
              </div>
              <div class="form-group">
                <label class="form-label">Disbursement Method</label>
                <select class="form-select" id="refund-method-select">
                  <option value="original">Original Mode (Razorpay / CC)</option>
                  <option value="store_credit">Instant Store Credit Voucher</option>
                  <option value="neft">Direct Bank NEFT / IMPS</option>
                  <option value="cash">Studio Cash Reimbursement</option>
                </select>
              </div>
              <div class="form-group col-span-2">
                <label class="form-label">Transaction / UTR Reference No.</label>
                <input type="text" class="form-input font-mono" id="refund-ref-input" value="UTR-${new Date().getFullYear()}${Math.floor(100000 + Math.random() * 900000)}" />
              </div>
            </div>

            <div class="inventory-impact-box">
              <div class="impact-icon">${icons.box}</div>
              <div class="impact-content">
                <span class="impact-title">Automatic Inventory Restock on Refund:</span>
                <span class="impact-details">
                  Returned SKU <strong>${req.product.sku}</strong> will be incremented (+1 unit) to <strong>${prod.rack}</strong> with audit note logged in the central ledger.
                </span>
              </div>
            </div>

            ${isStaff ? `
              <div class="role-restriction-notice">
                ${icons.alertCircle}
                <span>Role Notice: Staff can draft refund details, but releasing funds > ₹5,000 requires Store Manager authorization.</span>
              </div>
            ` : ''}

            <div class="drawer-footer-actions">
              <button class="btn-primary" id="btn-execute-refund" ${isStaff ? 'disabled' : ''}>
                ${icons.creditCard} Record Refund & Restock Inventory
              </button>
            </div>
          </div>
        `;
      }
    } else if (req.status === "exchanged") {
      workspaceHtml = `
        <div class="action-workspace" style="background: var(--accent-subtle); border-color: var(--accent-border);">
          <div class="workspace-header">
            <span class="text-overline" style="color: var(--stock-in);">Exchange Fulfilled</span>
            <span class="status-pill status-exchanged">Completed</span>
          </div>

          <div class="inventory-impact-box" style="background: var(--bg-surface); border-color: var(--border-hairline);">
            <div class="impact-icon">${icons.checkCircle}</div>
            <div class="impact-content">
              <span class="impact-title">Dispatch Confirmation:</span>
              <span class="impact-details">
                Replacement unit dispatched. Courier Waybill: <strong class="font-mono">${req.refundDetails?.ref || 'DTDC-HYD-998124'}</strong>.<br>
                Stock successfully rebalanced in Colaba Studio Rack.
              </span>
            </div>
          </div>
        </div>
      `;
    } else if (req.status === "refunded") {
      workspaceHtml = `
        <div class="action-workspace" style="background: var(--accent-subtle); border-color: var(--accent-border);">
          <div class="workspace-header">
            <span class="text-overline" style="color: var(--stock-in);">Refund Executed</span>
            <span class="status-pill status-refunded">Refunded</span>
          </div>

          <div class="inventory-impact-box" style="background: var(--bg-surface); border-color: var(--border-hairline);">
            <div class="impact-icon">${icons.checkCircle}</div>
            <div class="impact-content">
              <span class="impact-title">Financial Settlement Details:</span>
              <span class="impact-details">
                Amount: <strong>${formatINR(req.refundDetails?.amount || req.refundAmount)}</strong> via ${req.refundDetails?.method || 'Original Payment Source'}.<br>
                Bank UTR / Ref: <strong class="font-mono">${req.refundDetails?.utr || req.refundDetails?.ref || 'UTR-20261028-HDFC-991'}</strong>.<br>
                Garment inspected & restocked to studio inventory.
              </span>
            </div>
          </div>
        </div>
      `;
    } else if (req.status === "rejected") {
      workspaceHtml = `
        <div class="action-workspace" style="background: var(--status-rejected-bg); border-color: var(--status-rejected-border);">
          <div class="workspace-header">
            <span class="text-overline" style="color: var(--status-rejected-text);">Request Rejected</span>
            <span class="status-pill status-rejected">Rejected</span>
          </div>

          <div style="font-size: 0.8125rem; color: var(--text-primary); line-height: 1.45;">
            <strong>Rejection Reason:</strong> ${req.rejectionReason?.title || 'Policy Breach'}<br>
            <p style="margin-top: 0.35rem; color: var(--text-secondary);">${req.rejectionReason?.note || 'Item does not meet return criteria.'}</p>
          </div>
        </div>
      `;
    }

    // Build Photos HTML
    let photosHtml = "";
    if (req.photos && req.photos.length > 0) {
      photosHtml = req.photos.map(p => `
        <div class="photo-thumb-card" data-photo-id="${p.id}" data-photo-title="${p.title}" data-photo-tag="${p.tag}" data-photo-caption="${p.caption}">
          <div class="photo-visual-box">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" style="color: var(--text-muted);"><rect width="18" height="18" x="3" y="3" rx="2"/><circle cx="9" cy="9" r="2"/><path d="m21 15-3.086-3.086a2 2 0 0 0-2.828 0L6 21"/></svg>
            <span style="position: absolute; bottom: 4px; right: 4px; background: rgba(0,0,0,0.6); color: #fff; font-size: 0.6rem; padding: 1px 4px; border-radius: 2px;">Zoom</span>
          </div>
          <div class="photo-tag-badge">${p.tag}</div>
        </div>
      `).join("");
    } else {
      photosHtml = `
        <div style="font-size: 0.75rem; color: var(--text-muted); padding: 0.5rem 0;">
          No customer photos attached for this return.
        </div>
      `;
    }

    el.drawerContent.innerHTML = `
      <!-- Header Meta -->
      <div class="drawer-header">
        <div class="drawer-title-area">
          <div class="drawer-top-meta">
            <span class="drawer-id">${req.id}</span>
            <span class="status-pill status-${req.status}">${req.status.replace('_', ' ')}</span>
            <span class="type-tag" style="font-size: 0.6875rem;">${req.type.replace('_', ' ').toUpperCase()}</span>
          </div>
          <h2 class="drawer-title">${req.product.name}</h2>
          <div style="font-size: 0.75rem; color: var(--text-secondary);">
            Order <strong class="font-mono">${req.orderId}</strong> • Placed on ${formatDate(req.orderDate)} • ${req.channel}
          </div>
        </div>
        <button class="drawer-close-btn" id="drawer-close-btn" title="Close Drawer">
          ${icons.close}
        </button>
      </div>

      <div class="drawer-body">
        <!-- Section: Customer Dossier -->
        <div class="drawer-section">
          <div class="section-title">
            <span>Customer & Delivery Details</span>
            <span style="font-weight: 500; text-transform: none; font-size: 0.7rem; color: var(--text-muted);">Verified Buyer</span>
          </div>
          <div style="background: var(--bg-subtle); border: 1px solid var(--border-hairline); border-radius: var(--radius-sm); padding: 0.85rem 1rem; font-size: 0.8125rem;">
            <div style="display: flex; justify-content: space-between; align-items: baseline;">
              <strong>${req.customer.name}</strong>
              <span class="font-mono" style="font-size: 0.75rem; color: var(--text-secondary);">${req.customer.phone}</span>
            </div>
            <div style="color: var(--text-muted); font-size: 0.75rem; margin-top: 0.2rem;">${req.customer.email}</div>
            <div style="color: var(--text-secondary); font-size: 0.75rem; margin-top: 0.4rem; line-height: 1.35;">
              <strong>Pickup Address:</strong> ${req.customer.address}
            </div>
          </div>
        </div>

        <!-- Section: Ordered Garment Dossier -->
        <div class="drawer-section">
          <div class="section-title">
            <span>Garment Specifications & Stock Location</span>
            <span class="font-mono" style="font-size: 0.7rem;">${req.product.sku}</span>
          </div>
          <div class="garment-card">
            <div class="garment-visual">
              <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><path d="M20.38 3.46 16 2a4 4 0 0 1-8 0L3.62 3.46a2 2 0 0 0-1.34 2.23l.58 3.47a1 1 0 0 0 .99.84H6v10c0 1.1.9 2 2 2h8a2 2 0 0 0 2-2V10h2.15a1 1 0 0 0 .99-.84l.58-3.47a2 2 0 0 0-1.34-2.23z"/></svg>
              <span style="font-size: 0.65rem; font-weight: 600;">Size ${req.product.size}</span>
            </div>
            <div class="garment-info">
              <div>
                <h4 class="garment-name">${req.product.name}</h4>
                <div style="font-size: 0.75rem; color: var(--text-muted);">${prod.fabric}</div>
              </div>
              <div class="garment-grid-meta">
                <div class="garment-meta-item">
                  <span class="garment-meta-label">Color:</span>
                  <span class="garment-meta-val">${req.product.color}</span>
                </div>
                <div class="garment-meta-item">
                  <span class="garment-meta-label">Invoice Value:</span>
                  <span class="garment-meta-val font-mono">${formatINR(req.product.price)}</span>
                </div>
                <div class="garment-meta-item">
                  <span class="garment-meta-label">Studio Location:</span>
                  <span class="garment-meta-val">${prod.rack}</span>
                </div>
                <div class="garment-meta-item">
                  <span class="garment-meta-label">Payment Mode:</span>
                  <span class="garment-meta-val">${req.paymentMethod.split(' ')[0]}</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- Section: Customer Return Reason & Photos -->
        <div class="drawer-section">
          <div class="section-title">
            <span>Customer Return Reason & Evidence</span>
          </div>
          <div class="reason-box">
            <span class="reason-category-tag">${req.reasonCategory}</span>
            <div class="reason-verbatim">"${req.customerReason}"</div>
          </div>

          <div style="margin-top: 0.25rem;">
            <div class="text-overline" style="margin-bottom: 0.4rem;">Customer Uploaded Media</div>
            <div class="photo-strip">
              ${photosHtml}
            </div>
          </div>
        </div>

        <!-- Section: Dynamic Action Workspace -->
        <div class="drawer-section">
          <div class="section-title">
            <span>Action Workspace</span>
            <span style="font-size: 0.7rem; color: var(--accent); font-weight: 600;">Module 16 Engine</span>
          </div>
          ${workspaceHtml}
        </div>

        <!-- Section: Status Timeline -->
        <div class="drawer-section">
          <div class="section-title">
            <span>Status Timeline & Audit Trail</span>
          </div>
          <div class="timeline-stepper">
            ${timelineHtml}
          </div>
        </div>
      </div>
    `;

    // Hook up internal drawer close button
    document.getElementById("drawer-close-btn")?.addEventListener("click", closeRequestDrawer);

    // Hook up action workspace events
    attachDrawerActionListeners(req, prod);
  }

  // Attach listeners to interactive elements inside drawer
  function attachDrawerActionListeners(req, prod) {
    // Photo zoom clicks
    el.drawerContent.querySelectorAll(".photo-thumb-card").forEach(card => {
      card.addEventListener("click", () => {
        const title = card.getAttribute("data-photo-title");
        const tag = card.getAttribute("data-photo-tag");
        const caption = card.getAttribute("data-photo-caption");
        openPhotoZoomModal(title, tag, caption);
      });
    });

    // 1. Approve Request
    document.getElementById("btn-approve-request")?.addEventListener("click", () => {
      req.status = "approved";
      req.timeline.push({
        step: "Approved",
        timestamp: new Date().toLocaleDateString("en-IN", { day: "2-digit", month: "short", year: "numeric", hour: "2-digit", minute: "2-digit" }),
        note: `Approved by ${state.userRole === 'admin' ? 'Store Manager (Admin)' : 'Staff Associate'}. Reverse pickup consignment generated via BlueDart Air.`,
        actor: state.userRole === 'admin' ? 'Store Manager' : 'Staff Associate'
      });
      renderDrawerContent(req);
      renderTable();
      showToast(`Request ${req.id} approved. BlueDart pickup dispatched.`);
    });

    // 2. Open Reject Modal
    document.getElementById("btn-open-reject-modal")?.addEventListener("click", () => {
      openRejectionModal(req);
    });

    // 3. Mark Received at Studio
    document.getElementById("btn-mark-received")?.addEventListener("click", () => {
      req.status = "received";
      req.qcStatus = "passed";
      req.timeline.push({
        step: "Received",
        timestamp: new Date().toLocaleDateString("en-IN", { day: "2-digit", month: "short", year: "numeric", hour: "2-digit", minute: "2-digit" }),
        note: `Garment unpacked and verified at Colaba Studio Hub. Physical fabric and tag inspection PASSED.`,
        actor: state.userRole === 'admin' ? 'Store Manager' : 'Staff (QC Lead Sunita)'
      });
      renderDrawerContent(req);
      renderTable();
      showToast(`Package for ${req.id} marked as Received & QC Passed.`);
    });

    // 4. Size Exchange Flow: Size Grid Click
    const sizeCards = el.drawerContent.querySelectorAll("#exchange-size-grid .size-option-card:not(.disabled)");
    sizeCards.forEach(card => {
      card.addEventListener("click", () => {
        sizeCards.forEach(c => c.classList.remove("selected"));
        card.classList.add("selected");
        const chosen = card.getAttribute("data-exchange-size");
        const count = parseInt(card.getAttribute("data-stock-count"), 10);
        req.exchangeTarget = req.exchangeTarget || {};
        req.exchangeTarget.size = chosen;

        // Update forecast preview in real time
        const forecastEl = document.getElementById("exchange-inventory-forecast");
        if (forecastEl) {
          forecastEl.querySelector(".impact-details").innerHTML = `
            • Restock returned size <strong>${req.product.size}</strong> (+1 unit to ${prod.rack})<br>
            • Deduct selected size <strong>${chosen}</strong> (-1 unit from available ${count} pcs)<br>
            • Reserve stock immediately for outbound courier dispatch.
          `;
        }
      });
    });

    // Confirm Size Exchange
    document.getElementById("btn-process-size-exchange")?.addEventListener("click", () => {
      const chosenSize = req.exchangeTarget?.size || "L";
      const targetCount = prod.inventory[chosenSize] || 0;

      if (targetCount <= 0) {
        showToast(`Cannot exchange: Size ${chosenSize} is currently out of stock.`);
        return;
      }

      // Deduct target size
      prod.inventory[chosenSize] = Math.max(0, targetCount - 1);
      // Restock returned size
      prod.inventory[req.product.size] = (prod.inventory[req.product.size] || 0) + 1;

      // Add to inventory ledger
      state.inventoryLedger.unshift(
        {
          id: `LEDG-${Math.floor(900 + Math.random() * 99)}`,
          timestamp: new Date().toISOString().replace('T', ' ').slice(0, 16),
          sku: `${prod.skuPrefix}-${chosenSize}`,
          productName: prod.name,
          movement: "Dispatched (Exchange)",
          delta: -1,
          balance: prod.inventory[chosenSize],
          location: prod.rack,
          reason: `Dispatched replacement Size ${chosenSize} for ${req.id}`,
          actor: state.userRole === 'admin' ? 'Store Manager' : 'Staff Associate'
        },
        {
          id: `LEDG-${Math.floor(900 + Math.random() * 99)}`,
          timestamp: new Date().toISOString().replace('T', ' ').slice(0, 16),
          sku: req.product.sku,
          productName: prod.name,
          movement: "Restocked (Exchange Return)",
          delta: +1,
          balance: prod.inventory[req.product.size],
          location: prod.rack,
          reason: `Returned Size ${req.product.size} received under ${req.id}`,
          actor: state.userRole === 'admin' ? 'Store Manager' : 'Staff Associate'
        }
      );

      req.status = "exchanged";
      req.refundDetails = {
        ref: `BD-EXP-${Math.floor(100000 + Math.random() * 900000)}`,
        date: new Date().toISOString().split('T')[0],
        dispatchedSku: `${prod.skuPrefix}-${chosenSize}`
      };

      req.timeline.push({
        step: "Exchanged",
        timestamp: new Date().toLocaleDateString("en-IN", { day: "2-digit", month: "short", year: "numeric", hour: "2-digit", minute: "2-digit" }),
        note: `Size exchange executed. Dispatched replacement Size ${chosenSize}. Live rack inventory updated: Size ${req.product.size} (+1), Size ${chosenSize} (-1).`,
        actor: state.userRole === 'admin' ? 'Store Manager' : 'Staff Associate'
      });

      renderDrawerContent(req);
      renderTable();
      showToast(`Size exchange processed. Live stock updated: Size ${chosenSize} reserved.`);
    });

    // 5. Product Exchange Flow: Dropdown Select
    const prodSelect = document.getElementById("select-product-exchange");
    prodSelect?.addEventListener("change", (e) => {
      const newProdId = e.target.value;
      req.exchangeTarget = req.exchangeTarget || {};
      req.exchangeTarget.productId = newProdId;
      renderDrawerContent(req);
    });

    document.getElementById("btn-process-product-exchange")?.addEventListener("click", () => {
      const newProdId = req.exchangeTarget?.productId || state.products[1].id;
      const targetProd = state.products.find(p => p.id === newProdId);

      // Restock original
      prod.inventory[req.product.size] = (prod.inventory[req.product.size] || 0) + 1;

      state.inventoryLedger.unshift({
        id: `LEDG-${Math.floor(900 + Math.random() * 99)}`,
        timestamp: new Date().toISOString().replace('T', ' ').slice(0, 16),
        sku: req.product.sku,
        productName: prod.name,
        movement: "Restocked (Product Swap Return)",
        delta: +1,
        balance: prod.inventory[req.product.size],
        location: prod.rack,
        reason: `Restocked after swap for ${targetProd.name}`,
        actor: state.userRole === 'admin' ? 'Store Manager' : 'Staff Associate'
      });

      req.status = "exchanged";
      req.timeline.push({
        step: "Exchanged",
        timestamp: new Date().toLocaleDateString("en-IN", { day: "2-digit", month: "short", year: "numeric", hour: "2-digit", minute: "2-digit" }),
        note: `Product exchange completed for ${targetProd.name}. Inventory restocked to ${prod.rack}.`,
        actor: state.userRole === 'admin' ? 'Store Manager' : 'Staff Associate'
      });

      renderDrawerContent(req);
      renderTable();
      showToast(`Product swap recorded and inventory updated.`);
    });

    // 6. Execute Refund Flow
    document.getElementById("btn-execute-refund")?.addEventListener("click", () => {
      const amountInput = document.getElementById("refund-amount-input");
      const methodSelect = document.getElementById("refund-method-select");
      const refInput = document.getElementById("refund-ref-input");

      const amount = parseFloat(amountInput.value) || req.product.price;
      const method = methodSelect.options[methodSelect.selectedIndex].text;
      const ref = refInput.value;

      // Restock returned item to inventory
      prod.inventory[req.product.size] = (prod.inventory[req.product.size] || 0) + 1;

      // Log in inventory ledger
      state.inventoryLedger.unshift({
        id: `LEDG-${Math.floor(900 + Math.random() * 99)}`,
        timestamp: new Date().toISOString().replace('T', ' ').slice(0, 16),
        sku: req.product.sku,
        productName: prod.name,
        movement: "Restocked (Refund Return)",
        delta: +1,
        balance: prod.inventory[req.product.size],
        location: prod.rack,
        reason: `Physical item restored to studio stock after refund ${req.id}`,
        actor: state.userRole === 'admin' ? 'Store Manager (Finance)' : 'Staff Associate'
      });

      req.status = "refunded";
      req.refundDetails = {
        amount: amount,
        method: method,
        utr: ref,
        date: new Date().toISOString().split('T')[0]
      };

      req.timeline.push({
        step: "Refunded",
        timestamp: new Date().toLocaleDateString("en-IN", { day: "2-digit", month: "short", year: "numeric", hour: "2-digit", minute: "2-digit" }),
        note: `Refund of ${formatINR(amount)} executed via ${method} (Ref: ${ref}). Garment restocked: +1 to ${prod.rack}.`,
        actor: state.userRole === 'admin' ? 'Store Manager (Finance Lead)' : 'Staff Associate'
      });

      renderDrawerContent(req);
      renderTable();
      showToast(`Refund of ${formatINR(amount)} recorded & stock restored to ${prod.rack}.`);
    });
  }

  // Rejection Modal Logic
  let pendingRejectionRequest = null;
  function openRejectionModal(req) {
    pendingRejectionRequest = req;
    el.rejectionModal.classList.add("active");

    // Populate templates
    el.rejectionTemplateSelect.innerHTML = REJECTION_TEMPLATES.map(t => `
      <option value="${t.code}">${t.title}</option>
    `).join("");

    el.rejectionTextarea.value = REJECTION_TEMPLATES[0].text;
  }

  function closeRejectionModal() {
    el.rejectionModal.classList.remove("active");
    pendingRejectionRequest = null;
  }

  el.rejectionTemplateSelect?.addEventListener("change", (e) => {
    const selected = REJECTION_TEMPLATES.find(t => t.code === e.target.value);
    if (selected) {
      el.rejectionTextarea.value = selected.text;
    }
  });

  el.rejectionConfirmBtn?.addEventListener("click", () => {
    if (!pendingRejectionRequest) return;
    const req = pendingRejectionRequest;
    const selectedTemplate = REJECTION_TEMPLATES.find(t => t.code === el.rejectionTemplateSelect.value);

    req.status = "rejected";
    req.rejectionReason = {
      code: el.rejectionTemplateSelect.value,
      title: selectedTemplate?.title || "Return Policy Breach",
      note: el.rejectionTextarea.value,
      date: new Date().toISOString(),
      adminName: state.userRole === 'admin' ? 'Store Manager' : 'Staff Associate'
    };

    req.timeline.push({
      step: "Rejected",
      timestamp: new Date().toLocaleDateString("en-IN", { day: "2-digit", month: "short", year: "numeric", hour: "2-digit", minute: "2-digit" }),
      note: `Return rejected: ${req.rejectionReason.title}. Customer formal notification dispatched.`,
      actor: state.userRole === 'admin' ? 'Store Manager' : 'Staff Associate'
    });

    closeRejectionModal();
    renderDrawerContent(req);
    renderTable();
    showToast(`Request ${req.id} rejected. Formal note logged.`);
  });

  // Photo Zoom Modal
  function openPhotoZoomModal(title, tag, caption) {
    el.photoZoomTitle.textContent = title;
    el.photoZoomCaption.textContent = caption;
    el.photoZoomVisual.innerHTML = `
      <div style="display: flex; flex-direction: column; align-items: center; justify-content: center; height: 100%; gap: 1rem; color: var(--text-primary);">
        <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><rect width="18" height="18" x="3" y="3" rx="2"/><circle cx="9" cy="9" r="2"/><path d="m21 15-3.086-3.086a2 2 0 0 0-2.828 0L6 21"/></svg>
        <div style="font-family: var(--font-serif); font-size: 1.15rem; font-weight: 600;">Customer Garment Photo Evidence</div>
        <div style="font-size: 0.75rem; max-width: 380px; text-align: center; color: var(--text-secondary);">
          <strong>Verification Tag:</strong> ${tag}<br>
          High-resolution macro inspection view uploaded directly from customer concierge portal.
        </div>
      </div>
    `;
    el.photoZoomModal.classList.add("active");
  }

  function closePhotoZoomModal() {
    el.photoZoomModal.classList.remove("active");
  }

  // Inventory Ledger Modal
  function openLedgerModal() {
    el.ledgerModal.classList.add("active");
    renderLedgerTable();
  }

  function closeLedgerModal() {
    el.ledgerModal.classList.remove("active");
  }

  function renderLedgerTable() {
    el.ledgerTableBody.innerHTML = state.inventoryLedger.map(item => {
      const isPositive = item.delta > 0;
      return `
        <tr>
          <td class="font-mono" style="font-size: 0.75rem;">${item.timestamp}</td>
          <td>
            <div style="font-weight: 600;">${item.productName}</div>
            <div class="font-mono" style="font-size: 0.6875rem; color: var(--text-muted);">${item.sku}</div>
          </td>
          <td>
            <span class="type-tag ${isPositive ? 'type-exchange' : 'type-refund'}">${item.movement}</span>
          </td>
          <td class="font-mono" style="font-weight: 700; color: ${isPositive ? 'var(--stock-in)' : 'var(--stock-out)'};">
            ${isPositive ? `+${item.delta}` : item.delta}
          </td>
          <td class="font-mono">${item.balance} in rack</td>
          <td style="font-size: 0.75rem;">${item.location}</td>
          <td style="font-size: 0.75rem; color: var(--text-secondary);">${item.reason}</td>
          <td style="font-size: 0.75rem; color: var(--text-muted);">${item.actor}</td>
        </tr>
      `;
    }).join("");
  }

  // Inactive Modules Modal
  function openInactiveModuleModal(moduleName) {
    el.inactiveModuleName.textContent = moduleName;
    el.inactiveModuleModal.classList.add("active");
  }

  function closeInactiveModuleModal() {
    el.inactiveModuleModal.classList.remove("active");
  }

  // Customer Portal Controller
  function initCustomerPortal() {
    const orderInput = document.getElementById("cust-order-lookup");
    const phoneInput = document.getElementById("cust-phone-lookup");
    const btnLookup = document.getElementById("cust-btn-lookup");
    const orderDetailsSection = document.getElementById("cust-order-details-section");
    const itemsContainer = document.getElementById("cust-items-selection");
    const chips = document.querySelectorAll(".lookup-chip");

    // Pre-fill helper chips
    chips.forEach(chip => {
      chip.addEventListener("click", () => {
        const orderId = chip.getAttribute("data-order-id");
        const found = CUSTOMER_SAMPLE_ORDERS.find(o => o.orderId === orderId);
        if (found) {
          orderInput.value = found.orderId;
          phoneInput.value = found.customerPhone;
          loadCustomerOrder(found);
        }
      });
    });

    btnLookup?.addEventListener("click", () => {
      const orderId = orderInput.value.trim().toUpperCase();
      const phone = phoneInput.value.trim();
      const found = CUSTOMER_SAMPLE_ORDERS.find(o => o.orderId === orderId) || CUSTOMER_SAMPLE_ORDERS[0];
      loadCustomerOrder(found);
    });

    function loadCustomerOrder(order) {
      orderDetailsSection.style.display = "block";
      itemsContainer.innerHTML = order.items.map((item, idx) => `
        <div class="garment-card cust-selectable-item ${idx === 0 ? 'selected-border' : ''}" data-item-idx="${idx}" style="cursor: pointer; border-color: ${idx === 0 ? 'var(--accent)' : 'var(--border-hairline)'};">
          <div class="garment-visual">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><path d="M20.38 3.46 16 2a4 4 0 0 1-8 0L3.62 3.46a2 2 0 0 0-1.34 2.23l.58 3.47a1 1 0 0 0 .99.84H6v10c0 1.1.9 2 2 2h8a2 2 0 0 0 2-2V10h2.15a1 1 0 0 0 .99-.84l.58-3.47a2 2 0 0 0-1.34-2.23z"/></svg>
            <span style="font-size: 0.65rem;">Size ${item.size}</span>
          </div>
          <div class="garment-info">
            <div>
              <strong style="font-family: var(--font-serif); font-size: 1.1rem;">${item.name}</strong>
              <div style="font-size: 0.75rem; color: var(--text-muted);">${item.color} • SKU: ${item.sku}</div>
            </div>
            <div style="display: flex; justify-content: space-between; align-items: baseline; margin-top: 0.5rem;">
              <span class="font-mono" style="font-weight: 600;">${formatINR(item.price)}</span>
              <span style="font-size: 0.75rem; color: var(--accent); font-weight: 600;">Selected for Return</span>
            </div>
          </div>
        </div>
      `).join("");

      state.customerFormData.selectedProduct = order.items[0];
      state.customerFormData.currentOrder = order;

      // Allow selecting between items in order
      itemsContainer.querySelectorAll(".cust-selectable-item").forEach(itemEl => {
        itemEl.addEventListener("click", () => {
          const idx = parseInt(itemEl.getAttribute("data-item-idx"), 10);
          state.customerFormData.selectedProduct = order.items[idx];
          itemsContainer.querySelectorAll(".cust-selectable-item").forEach((el, i) => {
            el.style.borderColor = i === idx ? "var(--accent)" : "var(--border-hairline)";
            const statusSpan = el.querySelector(".garment-info > div:last-child > span:last-child");
            if (statusSpan) {
              statusSpan.textContent = i === idx ? "Selected for Return" : "Click to Select";
              statusSpan.style.color = i === idx ? "var(--accent)" : "var(--text-muted)";
            }
          });
        });
      });

      // Smooth scroll to options
      orderDetailsSection.scrollIntoView({ behavior: 'smooth' });
    }

    // Type cards in customer portal
    const radioCards = document.querySelectorAll(".radio-choice-card");
    radioCards.forEach(card => {
      card.addEventListener("click", () => {
        radioCards.forEach(c => c.classList.remove("selected"));
        card.classList.add("selected");
        const type = card.getAttribute("data-choice-type");
        state.customerFormData.type = type;

        const sizeOptionsWrap = document.getElementById("cust-size-exchange-options");
        if (sizeOptionsWrap) {
          sizeOptionsWrap.style.display = type === "size_exchange" ? "block" : "none";
        }
      });
    });

    // Customer size options buttons
    const custSizeBtns = document.querySelectorAll("#cust-size-exchange-options button");
    custSizeBtns.forEach(btn => {
      btn.addEventListener("click", () => {
        custSizeBtns.forEach(b => {
          b.style.backgroundColor = "var(--bg-surface)";
          b.style.color = "var(--text-primary)";
        });
        btn.style.backgroundColor = "var(--accent)";
        btn.style.color = "#FFFFFF";
        state.customerFormData.targetSize = btn.textContent.split(' ')[0];
      });
    });

    // Submit Customer Return Request
    const submitBtn = document.getElementById("btn-submit-customer-return");
    submitBtn?.addEventListener("click", () => {
      const order = state.customerFormData.currentOrder || CUSTOMER_SAMPLE_ORDERS[0];
      const prod = state.customerFormData.selectedProduct || order.items[0];
      const reasonCategory = document.getElementById("cust-reason-category").value;
      const customerNotes = document.getElementById("cust-verbatim-notes").value || "Garment was tried on once at home. Sizing and drape slightly off.";

      const newId = `RET-26-0${state.requests.length + 80}`;
      const newRequest = {
        id: newId,
        createdAt: new Date().toISOString(),
        orderId: order.orderId,
        orderDate: "2026-10-27",
        channel: "Online Concierge",
        customer: {
          name: order.customerName,
          email: order.customerEmail,
          phone: `+91 ${order.customerPhone}`,
          city: order.address.split(',').slice(-2).join(','),
          address: order.address
        },
        product: {
          id: prod.id,
          name: prod.name,
          sku: prod.sku,
          size: prod.size,
          color: prod.color,
          price: prod.price
        },
        type: state.customerFormData.type,
        exchangeTarget: state.customerFormData.type === "size_exchange" ? { size: "L", status: "in_stock", availableUnits: 3 } : null,
        reasonCategory: reasonCategory,
        customerReason: customerNotes,
        photos: [
          {
            id: `ph-${Date.now()}`,
            title: "Customer Uploaded Image",
            tag: "Packaging & Tags",
            caption: "Garment in original garment bag with tags intact"
          }
        ],
        status: "requested",
        qcStatus: "pending",
        paymentMethod: "Razorpay (Online)",
        paymentRef: `pay_RZP_${Math.floor(100000 + Math.random() * 900000)}`,
        refundAmount: prod.price,
        refundDetails: null,
        rejectionReason: null,
        timeline: [
          {
            step: "Requested",
            timestamp: new Date().toLocaleDateString("en-IN", { day: "2-digit", month: "short", year: "numeric", hour: "2-digit", minute: "2-digit" }),
            note: `Customer submitted ${state.customerFormData.type.replace('_', ' ')} request via Concierge Self-Service Portal.`,
            actor: `Customer (${order.customerName})`
          }
        ]
      };

      // Add to front of requests array
      state.requests.unshift(newRequest);
      state.newCreatedRequestId = newId;

      // Show confirmation dialog / screen
      document.getElementById("cust-form-step-container").style.display = "none";
      const confirmationBlock = document.getElementById("cust-confirmation-block");
      confirmationBlock.style.display = "block";
      document.getElementById("cust-confirm-ref").textContent = newId;

      showToast(`Return Request ${newId} created! Return to Admin Panel to view.`);
    });

    // Return to Admin view button from confirmation
    document.getElementById("btn-back-to-admin-from-confirm")?.addEventListener("click", () => {
      switchToAdminView();
      // Reset customer form
      document.getElementById("cust-form-step-container").style.display = "block";
      document.getElementById("cust-confirmation-block").style.display = "none";
      // Open the new request in drawer
      openRequestDrawer(state.newCreatedRequestId);
    });
  }

  // Switch Views (Admin ⇄ Customer)
  function switchToCustomerPortal() {
    state.currentView = "customer_portal";
    el.customerPortalView.classList.add("active");
  }

  function switchToAdminView() {
    state.currentView = "admin";
    el.customerPortalView.classList.remove("active");
    renderTable();
  }

  // Theme Management (Obsidian Dark vs Warm Bone Light)
  function applyTheme(theme) {
    state.currentTheme = theme;
    try {
      localStorage.setItem("boutique_theme", theme);
    } catch (e) {}

    if (theme === "dark") {
      document.body.classList.add("theme-dark");
      document.documentElement.setAttribute("data-theme", "dark");
      document.body.setAttribute("data-theme", "dark");

      el.btnThemeDark?.classList.add("active");
      el.btnThemeLight?.classList.remove("active");
      el.btnPortalThemeDark?.classList.add("active");
      el.btnPortalThemeLight?.classList.remove("active");
    } else {
      document.body.classList.remove("theme-dark");
      document.documentElement.setAttribute("data-theme", "light");
      document.body.setAttribute("data-theme", "light");

      el.btnThemeLight?.classList.add("active");
      el.btnThemeDark?.classList.remove("active");
      el.btnPortalThemeLight?.classList.add("active");
      el.btnPortalThemeDark?.classList.remove("active");
    }
  }

  // Setup Global Event Listeners
  function setupEventListeners() {
    // Theme Switchers
    el.btnThemeDark?.addEventListener("click", () => {
      applyTheme("dark");
      showToast("Switched to Obsidian Dark Palette.");
    });
    el.btnThemeLight?.addEventListener("click", () => {
      applyTheme("light");
      showToast("Switched to Warm Bone Light Palette.");
    });
    el.btnPortalThemeDark?.addEventListener("click", () => {
      applyTheme("dark");
    });
    el.btnPortalThemeLight?.addEventListener("click", () => {
      applyTheme("light");
    });

    // Role switcher
    el.roleAdminBtn?.addEventListener("click", () => {
      state.userRole = "admin";
      el.roleAdminBtn.classList.add("active");
      el.roleStaffBtn.classList.remove("active");
      el.roleIndicatorText.textContent = "Store Manager (Admin)";
      if (state.selectedRequestId) {
        const req = state.requests.find(r => r.id === state.selectedRequestId);
        if (req) renderDrawerContent(req);
      }
      showToast("Role switched to: Store Manager (Full Approval & Refund Rights)");
    });

    el.roleStaffBtn?.addEventListener("click", () => {
      state.userRole = "staff";
      el.roleStaffBtn.classList.add("active");
      el.roleAdminBtn.classList.remove("active");
      el.roleIndicatorText.textContent = "Studio Associate (Staff)";
      if (state.selectedRequestId) {
        const req = state.requests.find(r => r.id === state.selectedRequestId);
        if (req) renderDrawerContent(req);
      }
      showToast("Role switched to: Studio Associate (QC & Inward Inspection Only)");
    });

    // View switchers
    el.btnSwitchToCustomer?.addEventListener("click", switchToCustomerPortal);
    el.btnSwitchToAdmin?.addEventListener("click", switchToAdminView);

    // Ledger modal
    el.btnViewLedger?.addEventListener("click", openLedgerModal);
    el.ledgerModalClose?.addEventListener("click", closeLedgerModal);

    // Drawer close
    el.drawerCloseBtn?.addEventListener("click", closeRequestDrawer);
    el.drawerBackdrop?.addEventListener("click", closeRequestDrawer);

    // Modals close
    el.rejectionModalClose?.addEventListener("click", closeRejectionModal);
    el.rejectionCancelBtn?.addEventListener("click", closeRejectionModal);
    el.photoZoomModalClose?.addEventListener("click", closePhotoZoomModal);
    el.inactiveModuleClose?.addEventListener("click", closeInactiveModuleModal);

    // Filter tabs
    el.tabsContainer?.querySelectorAll(".filter-tab").forEach(tab => {
      tab.addEventListener("click", () => {
        state.activeFilterTab = tab.getAttribute("data-tab");
        updateTabUI();
        renderTable();
      });
    });

    // Search input
    el.searchInput?.addEventListener("input", (e) => {
      state.searchQuery = e.target.value;
      renderTable();
    });

    // Type select
    el.typeSelect?.addEventListener("change", (e) => {
      state.typeFilter = e.target.value;
      renderTable();
    });

    // Reason select
    el.reasonSelect?.addEventListener("change", (e) => {
      state.reasonFilter = e.target.value;
      renderTable();
    });

    // Date select
    el.dateSelect?.addEventListener("change", (e) => {
      state.dateFilter = e.target.value;
      renderTable();
    });

    // Clear filters
    el.btnClearFilters?.addEventListener("click", clearAllFilters);

    // Simulator select
    el.stateSelect?.addEventListener("change", (e) => {
      state.simulatedState = e.target.value;
      renderTable();
      showToast(`State set to: ${e.target.value.toUpperCase()}`);
    });

    // Inactive sidebar links
    document.querySelectorAll(".nav-link.inactive-module").forEach(link => {
      link.addEventListener("click", (e) => {
        e.preventDefault();
        const moduleName = link.querySelector("span")?.textContent || "Module";
        openInactiveModuleModal(moduleName);
      });
    });

    // Keyboard escape to close modals/drawers
    document.addEventListener("keydown", (e) => {
      if (e.key === "Escape") {
        closeRequestDrawer();
        closeRejectionModal();
        closePhotoZoomModal();
        closeLedgerModal();
        closeInactiveModuleModal();
      }
    });

    // Mobile sidebar toggle
    const mobileMenuBtn = document.getElementById("mobile-menu-btn");
    const sidebar = document.querySelector(".sidebar");
    mobileMenuBtn?.addEventListener("click", () => {
      sidebar.classList.toggle("mobile-open");
    });
  }

  // Initialize Application
  function init() {
    applyTheme(state.currentTheme);
    renderTable();
    setupEventListeners();
    initCustomerPortal();

    // Default open the first request for immediate presentation inspection
    if (state.requests.length > 0) {
      openRequestDrawer(state.requests[0].id);
    }
  }

  // Start on DOM ready
  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", init);
  } else {
    init();
  }

})();
