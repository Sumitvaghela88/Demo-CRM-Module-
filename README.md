# Fashion Boutique Management System — Prototype Walkthrough
## Module 16: Returns, Exchanges & Refunds (Admin Panel & Customer Concierge)

This clickable front-end prototype has been built for client presentation, adhering strictly to human studio design principles, luxury editorial typography, and Indian designer boutique operational realism.

---

### How to Open & Present
1. Open `index.html` in any modern web browser (Google Chrome, Safari, Edge, Firefox).
2. No build tools, terminal dependencies, or backend server are required — everything runs in pure, vanilla JavaScript and CSS with mock data stored in `js/data.js`.

---

### How to Deploy to Vercel

#### Method 1: Direct CLI Deployment (Instant)
Run in the project directory:
```bash
npx vercel
```
- Follow the interactive prompts (hit Enter to accept defaults).
- For production deployment:
```bash
npx vercel --prod
```

#### Method 2: Via GitHub / GitLab
1. Create a new repository on GitHub.
2. Link and push your code:
```bash
git remote add origin https://github.com/<YOUR_USERNAME>/<YOUR_REPO>.git
git push -u origin main
```
3. Open [vercel.com/new](https://vercel.com/new), select your repository, and click **Deploy**. Vercel will automatically read `vercel.json` and deploy.

---

### Included Screens & Client Presentation Flows

#### 1. Admin Management Workspace (`Module 16: Returns, Exchanges & Refunds`)
- **System Architecture Sidebar**: Displays all 16 modules defined in the boutique management system specification (Overview, Products, Categories, Barcodes, Inventory, HR, Finance, Shipments, Exhibitions, Orders, POS, Customers, Returns). Module 16 is active with a live counter badge; the other 15 modules are visibly mapped to demonstrate complete ERP architectural coherence.
- **Editorial Metrics Ribbon**: Live operational metrics showing *Needs Review (2)*, *Consignments In Transit (3)*, *Exchanges in Pipeline (3)*, and *Refunds Processed This Month (₹16,500)*.
- **Search & Multi-Dimensional Filtering**:
  - **Status Tabs**: *All Requests*, *Needs Action*, *In Transit / Studio*, *Exchanges*, *Refunded*, *Rejected*.
  - **Quick Search**: Real-time filtering by Order ID (`ORD-24817`), Customer Name (`Ananya`), Phone (`98201...`), Garment SKU (`CSK-ECR-M`), or Product Name.
  - **Dropdowns**: Filter by Return Type, Reason Category, and Date Range (`Today`, `Last 7 Days`, `Last 30 Days`).
- **Request Detail Dossier (Slide-Over Drawer)**:
  - Click any row in the table or click `Inspect →` to open the drawer.
  - Full client profile, order channel, and pickup address.
  - Garment inspection card with SKU, price in ₹ INR, size, fabric description, and physical studio rack location (e.g. `Studio Rack A-04`).
  - Verbatim customer reason quote and customer-uploaded garment photo evidence with a click-to-zoom macro modal.
  - Audit trail timeline showing chronological timestamps and responsible staff.

#### 2. Interactive Operational Workflows (Clickable in UI)
- **Approve Request**: Generates reverse logistics dispatch via BlueDart Air, transitions status to `Approved`, and logs timeline note.
- **Reject Request with Note**: Opens the Rejection Dialog with boutique policy presets (*Security Tag Removed*, *Signs of Wear / Perfume*, *Window Exceeded*, *Customized Garment*) and an editable formal note.
- **Studio Inward & Physical QC**: Staff marks garment as received at the studio and passes physical inspection.
- **Size Exchange Flow**: Displays an interactive size selector (`XS`, `S`, `M`, `L`, `XL`) with real-time stock indicators (`Size L: 3 in stock`, `Size M: 0 Out of Stock`). Selecting an in-stock size updates the live forecast; clicking *Confirm Size Exchange* deducts 1 unit from the chosen size, restocks 1 unit of the returned size, logs movements in the ledger, and transitions status to `Exchanged`.
- **Product Swap Flow**: Choose an alternative boutique item from the catalogue. The UI automatically calculates the price differential (e.g. Customer pays `+₹1,100` or receives store credit) and updates stock.
- **Refund Recording Flow**: Execute refunds via Original Payment Source (Razorpay Gate ID), Instant Store Credit Voucher (with generated voucher code), Direct Bank NEFT, or Studio Cash. The UI records the transaction reference / UTR number, restores the returned garment to studio inventory, and updates the status to `Refunded`.
- **Stock Audit Ledger Modal**: Click `Stock Ledger` in the top bar to inspect the audit log of every stock increment/decrement, rack location, and staff actor.
- **Role-Based View Simulation**: Toggle between `Store Manager (Admin)` and `Studio Associate (Staff)` in the top bar to preview role restrictions (e.g., Staff cannot authorize refunds > ₹5,000 without Manager sign-off).
- **State Simulator**: Toggle between `Normal Data`, `Empty Queue`, `Skeleton Loading Shimmer`, and `Ledger Synchronization Error` (with retry button) from the header dropdown.

#### 3. Customer Concierge Portal ("Request a Return")
- Click `Customer Portal` in the top header.
- Enter Order ID and phone number, or click the **Quick Demo Fill** chips (`ORD-24817` or `ORD-24805`).
- Select garments, choose resolution (*Size Exchange*, *Store Credit Voucher with +10% bonus*, *Product Swap*, or *Original Refund*), select reason, write notes for master tailor, and simulate garment photo upload.
- On submission, an acknowledgement screen displays the reference number (`RET-26-...`).
- Clicking `← Return to Admin Panel to see your new request in the queue` returns to the admin view, places the new request at the very top of the table with a highlighted `NEW` tag, and opens its detail drawer!

---

### Design System & Human Studio Aesthetic
- **Dual Studio Color Palettes (with Instant Toggle)**:
  - **Obsidian Dark Studio (Default)**: Deep espresso obsidian canvas (`#121110`), rich charcoal surfaces (`#1A1916`), antique warm bone typography (`#F3EFE6`), hairline architectural dividers (`#2D2A24`), and a refined heritage sage-olive accent (`#5D7051`). Eliminates eye strain and gives a bespoke luxury atelier look.
  - **Warm Bone Light**: Restrained off-white canvas (`#F6F3EE`), ink charcoal text (`#1F1D1A`), hairline borders (`#DDD6CB`), and deep muted olive accent (`#3F4A38`).
  - **Theme Toggle**: Located right in the top navigation bar of both Admin and Customer views, with state persistence across sessions.
- **Typography**: Cormorant Garamond (editorial serif headings) paired with Plus Jakarta Sans (clean UI text) and JetBrains Mono (SKUs, Order IDs, UTRs).
- **Brand Neutral**: Plain `LOGO` box and neutral `Brand Name` text as specified in branding rules. All colors and typography are centralized in `css/main.css` for easy client rebranding.

