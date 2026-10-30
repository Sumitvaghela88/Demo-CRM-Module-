# Fashion Boutique Atelier ERP — Client Presentation Prototype
## Fully Interactive: Module 1 (Overview), Module 2 (Products) & Module 16 (Returns & Refunds)

This clickable front-end prototype has been built for an international client presentation, strictly adhering to human studio design principles, luxury editorial typography (Fraunces serif & DM Sans / JetBrains Mono), and boutique atelier operational realism.

---

### How to Run & Present Locally
1. Simply double-click `index.html` or open it in any modern web browser (Google Chrome, Apple Safari, Microsoft Edge, Mozilla Firefox).
2. **Zero Dependencies & Zero Build Steps**: No Node build server, no bundler, no npm install required. Everything runs natively on vanilla JavaScript (ES6+), semantic HTML5, and CSS3 custom properties with shared reactive mock state in `js/data.js` and `js/app.js`.

---

### How to Deploy to Vercel (Instant & Error-Free)

This repository includes a pre-configured `vercel.json` with `"outputDirectory": "."` and `"buildCommand": null`. It deploys purely as static files in under 5 seconds with zero build failures.

#### Option A: Direct Vercel CLI
Run in the project directory:
```bash
npx vercel
```
- Accept default settings by pressing Enter.
- For production:
```bash
npx vercel --prod
```

#### Option B: GitHub Push
```bash
git add .
git commit -m "Activate Overview, Products, and Returns & Refunds interactive prototype"
git push origin main
```
Import the repository on [vercel.com](https://vercel.com/new) and hit **Deploy**.

---

### Included System Modules & Presentation Features

#### Part A: Shared Boutique Management Shell
- **Full 16-Module Architecture Sidebar**: All 16 ERP modules are visibly rendered:
  1. **Overview** *(Active & Built)*
  2. **Products** *(Active & Built, Badge: 42)*
  3. Categories *(Click opens scope boundary modal)*
  4. Barcodes & Scanning
  5. Inventory & Sizes
  6. Internal Inventory
  7. HR & Attendance
  8. Finance & Accounting
  9. Shipments & Operations
  10. Exhibitions & Events
  11. Product Submit Requests
  12. Orders & Shipping
  13. POS Orders
  14. Coupons
  15. Customers
  16. **Returns & Refunds** *(Active & Built, Badge: 8)*
- **Global Search Autocomplete**: Real-time cross-entity search matching Products by name/SKU/category, Orders (e.g. `ORD-24817`), and Customers (e.g. `Pooja Sharma`). Clicking a product jumps directly to its editor.
- **Date Range Selector**: Controls Overview analytics across `Today`, `Last 7 Days`, `Last 30 Days`, `This Month`, and `Custom Range`.
- **Notification Center**: Operational atelier alerts drawer with badge counter and "Mark all read" trigger.
- **Role-Based Access Switcher**:
  - **Admin**: Full master rights, confidential artisan cost prices, gross margin % calculations, delete actions, dashboard widget customizer.
  - **Manager**: Create/edit products, publish/unpublish, view sales reports; cost price and delete buttons are securely hidden.
  - **Staff**: Inventory count reconciliations (Quick Stock modal) and garment inspection; price modifications locked, revenue KPIs in Overview locked with confidential staff overlay.
- **Dual Luxury Theme Switcher**: Toggle between **Obsidian Dark** (`#1C1B19`) and **Warm Bone Light** (`#F6F3EE`).
- **Prototype State Simulator**: Toggle between `Normal Data`, `Empty Store`, `Skeleton Shimmer`, and `Sync Error` (with retry button).

---

#### Part B: Module 1 — Executive Overview Dashboard
- **B1. KPI Strip (6 Figures with SVG Sparklines)**: Net Atelier Revenue ($), Completed Orders count, Average Order Value ($), New Patrons Acquired (+18.4%), Online Storefront Conversion Rate (3.42%), and Return / Exchange Rate (2.1%).
- **B2. Sales & Volume Trajectory (Interactive Vector Line Chart)**: SVG line chart with current period solid line, prior period dashed line, hover crosshair, metric toggle (Revenue vs Orders), and channel filter (All vs Online vs POS).
- **B3. Orders Needing Action**: Compact queue. Clicking "Return Claims Awaiting Studio QC" jumps directly to Module 16 (Returns)!
- **B4. Top Selling Silhouettes**: Top 5 revenue-generating garments with rank, units sold, revenue, and trend badge. Clicking opens the item in Products.
- **B5. Stock Level Warnings**: Scans variants across the catalogue for inventory &le; 4 pcs. "Update stock" button opens the quick-adjustment modal instantly.
- **B6. Category & Channel Breakdown**: Horizontal progress bars for category revenue share and a segmented stacked bar for sales channels.
- **B7. Operational Activity Ledger**: Real-time audit feed filterable by user role (`All`, `Admin`, `Manager`, `Staff`). Automatically logs every stock adjustment, product save, and return approval.
- **B8. Dashboard Customizer Drawer**: Admin can show or hide any of the 8 widgets, persisting during the session.

---

#### Part C: Module 2 — Products Catalogue & Multi-Size Inventory
- **C1. Catalogue Views**: Instant toggle between high-density Data Table and visual Grid Cards.
- **C2. Saved Views Tabs**: `All (42)`, `Published (38)`, `Drafts (3)`, `Low Stock (7)`, `Archived (1)` with dynamic count sync.
- **C3. Multi-Filter Toolbar**: Search by name/SKU/barcode, category select, stock level select, price range select, and size select with active removable chips.
- **C4. Column Sorting & Pagination**: Sort by Name, Category, Price, Stock, or Status. Pagination with 10, 25, or 50 rows per page.
- **C5. Multi-Select & Floating Bulk Action Bar**: Select individual or all products to Publish, Unpublish, Archive, Apply 10% Discount, or Delete (Admin only).
- **C6. Quick-View Drawer**: Displays garment summary and an interactive **Size &times; Color Heat Grid** (green >4 pcs, amber 1-4 pcs, red out of stock) plus 30-day analytics.
- **C7. Quick Adjust Stock Modal**: Steppers `[-]` / `[+]` and numeric input per size, adjustment reason dropdown, instant reconciliation, and automatic activity logging.
- **C8. Barcode Hangtag Label Print Modal**: Thermal hangtag preview with brand placeholder, garment title, SKU, size, color, vector barcode lines, EAN number, and price.
- **C9. CSV Batch Import & Export**: Export CSV download and 3-step CSV Import Wizard with realistic validation errors.
- **C10. Dedicated Full-Page Product Editor (8 Tabs + Live Storefront Preview)**:
  - Tab 1: Basic Info (Auto-generating slug, SKU, rich text, fabric, origin).
  - Tab 2: Pricing & Margins (Regular, sale, Admin Confidential Cost & dynamic Gross Margin % calculation).
  - Tab 3: Variants & Multi-Size Matrix (Color swatches, size run pills, bulk fill helper, matrix table).
  - Tab 4: Media & Photos (Dropzone simulation with primary hero badge).
  - Tab 5: Inventory Policy (Track stock, threshold, backorders, audit movements).
  - Tab 6: Categories & Cross-Sells (Primary category, subcategory, Complete the Look).
  - Tab 7: SEO & Live Google SERP Preview (Snippet card mirroring Google search results).
  - Tab 8: Shipping Logistics & Returns (Weight, dimensions, return eligibility).
  - Right-Side Live Customer Storefront Preview with Desktop ⇄ Mobile toggle.

---

#### Part D: Module 16 — Returns, Exchanges & Refunds (Built & Working)
- **D1. Admin Returns Management Queue**:
  - Metric Ribbon: *Needs Review (2)*, *Consignments In Transit (2)*, *Exchanges in Pipeline (3)*, and *Refunds Processed ($1,280)*.
  - Status Tabs: *All Requests (8)*, *Needs Action (4)*, *In Transit / Studio (3)*, *Exchanges (3)*, *Refunded (1)*, *Rejected (1)*.
  - Multi-Filter Toolbar: Quick search by Order ID, customer, phone, SKU; filter by resolution type, return reason, date.
- **D2. Slide-Over Request Detail Drawer (Inspection Dossier)**:
  - Click any row in the table or click `Inspect →` to open the drawer.
  - Customer summary (phone, email, doorstep pickup address).
  - Garment inspection card with SKU, price, size, color, and studio rack location (e.g. `Studio Rack A-04`).
  - Verbatim customer reason quote and customer-uploaded garment photo evidence with click-to-zoom macro inspection modal.
  - Chronological audit timeline (Requested -> Approved/Rejected -> Received -> Exchanged/Refunded).
  - Action Workspace:
    - **Approve Request**: Generates reverse logistics dispatch via BlueDart Air (AWB: `BD-77829104`).
    - **Reject Request with Note**: Opens policy rejection modal with templates (*Security Tag Removed*, *Signs of Wear*, *Window Expired*, *Customized Piece*) and custom note.
    - **Studio Receipt & QC**: Mark garment as received and verified at studio.
    - **Size Exchange Flow**: Displays interactive size picker showing real-time stock levels. Selecting a size and confirming restocks returned size (+1) and deducts target size (-1) in `state.products`, logs in central ledger, and transitions status to `Exchanged`.
    - **Product Swap Flow**: Exchange for alternative piece with automatic price differential calculation.
    - **Refund Recording Flow**: Execute refunds via Original Payment (Stripe), Store Credit Voucher (+10% bonus), or Bank NEFT. Restocks garment to inventory and transitions status to `Refunded`.
- **D3. Studio Stock & Inventory Audit Ledger Modal**: Click `Stock Ledger` in the top header to inspect the audit log of every stock increment/decrement, location, reason, and staff actor.
- **D4. Customer Concierge Portal ("Request a Return")**:
  - Click `Customer Portal →` in the top header.
  - Enter Order ID and phone number, or click the **Quick Demo Fill** chips (`ORD-24817` or `ORD-24805`).
  - Select garments, choose resolution (*Size Exchange*, *Store Credit Voucher with +10% bonus*, *Product Swap*, or *Original Refund*), select reason, write notes for master tailor, and simulate garment photo upload.
  - On submission, an acknowledgement screen displays the reference number (`RET-26-...`).
  - Clicking `← Return to Admin Panel to see your new request in the queue` returns to the admin view, places the new request at the very top of the table with a highlighted `NEW` tag, and opens its detail drawer!

---

### Project Structure
```
E-com Prototype/
├── index.html                       # Main application shell, views & modals
├── css/
│   └── main.css                     # Complete design system & themes (Dark/Light)
├── js/
│   ├── data.js                      # 42 products, 60-day timeseries, 8 returns, ledger
│   └── app.js                       # Reactive controller, navigation & cross-module sync
├── MODULE_EXPLANATION_HINGLISH.txt  # Comprehensive presentation guide in Hinglish
├── README.md                        # Documentation & setup instructions
└── vercel.json                      # Vercel deployment configuration
```
