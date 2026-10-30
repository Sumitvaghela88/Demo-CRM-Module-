/**
 * Mock Data Store for Fashion Boutique E-Commerce Admin & Customer Portal
 * Focus: Module 16 — Returns, Exchanges & Refunds
 * Realistic Indian Designer / Handcrafted Luxury Apparel Data
 */

const INITIAL_PRODUCTS = [
  {
    id: "PROD-101",
    name: "Chanderi Silk Angrakha Kurta",
    category: "Festive Pret",
    color: "Natural Ecru",
    fabric: "Pure Chanderi Silk with Zari Piping",
    price: 6450,
    rack: "Studio Rack A-04",
    inventory: {
      XS: 2,
      S: 4,
      M: 0, // Out of stock
      L: 3,
      XL: 5
    },
    skuPrefix: "CSK-ECR"
  },
  {
    id: "PROD-102",
    name: "Ajrakh Handblock Modal Satin Saree",
    category: "Heritage Sarees",
    color: "Indigo & Madder Red",
    fabric: "Modal Satin with Natural Dyes",
    price: 8900,
    rack: "Warehouse Rack B-01",
    inventory: {
      "Free Size": 6
    },
    skuPrefix: "AMS-IND"
  },
  {
    id: "PROD-103",
    name: "Mulmul Anarkali Set with Kota Doria Dupatta",
    category: "Occasion Wear",
    color: "Blush Gulab Pink",
    fabric: "Fine Mulmul Cotton with Gota Patti Handwork",
    price: 11200,
    rack: "Studio Rack A-08",
    inventory: {
      XS: 1,
      S: 2,
      M: 3,
      L: 0, // Out of stock
      XL: 2
    },
    skuPrefix: "MAK-GUL"
  },
  {
    id: "PROD-104",
    name: "Bagru Print Cotton Tiered Midi Dress",
    category: "Contemporary Handlooms",
    color: "Earth Ochre",
    fabric: "100% Handspun Bagru Cotton",
    price: 4250,
    rack: "Warehouse Rack C-03",
    inventory: {
      XS: 4,
      S: 6,
      M: 5,
      L: 4,
      XL: 1
    },
    skuPrefix: "BPC-OCH"
  },
  {
    id: "PROD-105",
    name: "Maheshwari Tissue Silk Tunic",
    category: "Festive Pret",
    color: "Sage Green & Zari Border",
    fabric: "Handwoven Maheshwari Silk-Cotton",
    price: 7800,
    rack: "Studio Rack B-02",
    inventory: {
      XS: 0,
      S: 2,
      M: 4,
      L: 2,
      XL: 0
    },
    skuPrefix: "MST-SGE"
  },
  {
    id: "PROD-106",
    name: "Kashmiri Aari Embroidered Velvet Jacket",
    category: "Bespoke Outerwear",
    color: "Deep Wine Plum",
    fabric: "Micro-Velvet with Antique Gold Aari Work",
    price: 16500,
    rack: "Studio Vault V-01",
    inventory: {
      S: 1,
      M: 2,
      L: 1,
      XL: 0
    },
    skuPrefix: "KAV-PLM"
  }
];

const INITIAL_REQUESTS = [
  {
    id: "RET-26-089",
    createdAt: "2026-10-30T10:15:00",
    orderId: "ORD-24817",
    orderDate: "2026-10-25",
    channel: "Online Boutique",
    customer: {
      name: "Ananya Deshmukh",
      email: "ananya.deshmukh@gmail.com",
      phone: "+91 98201 44821",
      city: "Mumbai, Maharashtra",
      address: "Flat 402, Sea Green Apts, Perry Cross Rd, Bandra West, Mumbai 400050"
    },
    product: {
      id: "PROD-101",
      name: "Chanderi Silk Angrakha Kurta",
      sku: "CSK-ECR-M",
      size: "M",
      color: "Natural Ecru",
      price: 6450
    },
    type: "size_exchange", // size_exchange | product_exchange | refund | store_credit
    exchangeTarget: {
      size: "L",
      status: "in_stock",
      availableUnits: 3
    },
    reasonCategory: "Incorrect Sizing / Fit",
    customerReason: "The kurta craftsmanship is exquisite, but the bust measurement and armhole sit 1.5 inches tighter than standard boutique sizing. I would love to exchange for Size L if available.",
    photos: [
      {
        id: "ph-1",
        title: "Garment Fit Assessment",
        tag: "Bust Seam Measurement",
        caption: "Bust seam measuring 36 inches instead of stated 38 inches"
      },
      {
        id: "ph-2",
        title: "Intact Tags & Condition",
        tag: "Security Seal",
        caption: "Security ribbon and designer tag intact and untouched"
      }
    ],
    status: "requested", // requested | approved | received | exchanged | refunded | rejected
    qcStatus: "pending", // pending | passed | defective_refurbish | failed_cust_damage
    paymentMethod: "Razorpay (UPI / HDFC)",
    paymentRef: "pay_NZ829141029",
    refundAmount: 6450,
    refundDetails: null,
    rejectionReason: null,
    timeline: [
      {
        step: "Requested",
        timestamp: "30 Oct 2026, 10:15 AM",
        note: "Customer submitted size exchange request via Concierge portal.",
        actor: "Customer (Ananya Deshmukh)"
      }
    ]
  },
  {
    id: "RET-26-088",
    createdAt: "2026-10-29T16:40:00",
    orderId: "ORD-24792",
    orderDate: "2026-10-24",
    channel: "Online Boutique",
    customer: {
      name: "Priyadarshini Rao",
      email: "priyadarshini.rao@outlook.com",
      phone: "+91 97412 88319",
      city: "Bengaluru, Karnataka",
      address: "12/A, 4th Cross, Indiranagar 1st Stage, Bengaluru 560038"
    },
    product: {
      id: "PROD-103",
      name: "Mulmul Anarkali Set with Kota Doria Dupatta",
      sku: "MAK-GUL-M",
      size: "M",
      color: "Blush Gulab Pink",
      price: 11200
    },
    type: "refund",
    exchangeTarget: null,
    reasonCategory: "Weave / Zari Flaw",
    customerReason: "Found a pulled metallic gota thread across the front kali hem right out of the box. Attaching macro photos of the unravelling.",
    photos: [
      {
        id: "ph-3",
        title: "Hem Gota Thread Pull",
        tag: "Fabric Defect",
        caption: "Loose zari filament unravelling near bottom kali border"
      }
    ],
    status: "requested",
    qcStatus: "pending",
    paymentMethod: "HDFC Credit Card (Direct PG)",
    paymentRef: "pay_HDFC_6619283",
    refundAmount: 11200,
    refundDetails: null,
    rejectionReason: null,
    timeline: [
      {
        step: "Requested",
        timestamp: "29 Oct 2026, 04:40 PM",
        note: "Quality claim logged with photos of weave flaw.",
        actor: "Customer (Priyadarshini Rao)"
      }
    ]
  },
  {
    id: "RET-26-085",
    createdAt: "2026-10-28T14:20:00",
    orderId: "ORD-24760",
    orderDate: "2026-10-22",
    channel: "Studio Pre-Order",
    customer: {
      name: "Sunita Singhania",
      email: "sunita.singhania@heritageart.in",
      phone: "+91 94140 33910",
      city: "Jaipur, Rajasthan",
      address: "Bungalow 7, Civil Lines, Near Raj Bhavan, Jaipur 302006"
    },
    product: {
      id: "PROD-104",
      name: "Bagru Print Cotton Tiered Midi Dress",
      sku: "BPC-OCH-L",
      size: "L",
      color: "Earth Ochre",
      price: 4250
    },
    type: "store_credit",
    exchangeTarget: null,
    reasonCategory: "Color Variance",
    customerReason: "The natural dye ochre is deeper and browner than the sunny mustard shown on monitor under studio lights. Prefer store voucher for the upcoming Festive Silk drop.",
    photos: [
      {
        id: "ph-4",
        title: "Natural Daylight Shade Comparison",
        tag: "Color Variance",
        caption: "Garment viewed under morning natural light"
      }
    ],
    status: "approved",
    qcStatus: "pending",
    paymentMethod: "UPI (Google Pay / Axis)",
    paymentRef: "upi_AXIS_992144",
    refundAmount: 4250,
    refundDetails: null,
    rejectionReason: null,
    timeline: [
      {
        step: "Requested",
        timestamp: "28 Oct 2026, 02:20 PM",
        note: "Customer requested store voucher exchange.",
        actor: "Customer (Sunita Singhania)"
      },
      {
        step: "Approved",
        timestamp: "29 Oct 2026, 11:10 AM",
        note: "Return pickup authorized via BlueDart Air (AWB: BD-77829104). Expected delivery to Studio: 31 Oct.",
        actor: "Admin (Store Manager - Radhika)"
      }
    ]
  },
  {
    id: "RET-26-082",
    createdAt: "2026-10-27T11:05:00",
    orderId: "ORD-24694",
    orderDate: "2026-10-20",
    channel: "Online Boutique",
    customer: {
      name: "Radhika Varma",
      email: "radhika.varma@delhidesign.co",
      phone: "+91 98110 55420",
      city: "New Delhi, Delhi",
      address: "Villa 14, Anand Lok, August Kranti Marg, New Delhi 110049"
    },
    product: {
      id: "PROD-105",
      name: "Maheshwari Tissue Silk Tunic",
      sku: "MST-SGE-S",
      size: "S",
      color: "Sage Green",
      price: 7800
    },
    type: "product_exchange",
    exchangeTarget: {
      productId: "PROD-102",
      productName: "Ajrakh Handblock Modal Satin Saree",
      sku: "AMS-IND-FS",
      size: "Free Size",
      price: 8900,
      priceDifference: 1100, // Customer pays difference
      balanceAction: "collect"
    },
    reasonCategory: "Fabric Texture Dissatisfaction",
    customerReason: "The tissue silk has more crisp hand-feel than expected; would like to swap for the softer drape of the Ajrakh Modal Satin Saree. Happy to pay ₹1,100 difference.",
    photos: [],
    status: "received",
    qcStatus: "passed",
    paymentMethod: "Razorpay NetBanking (ICICI)",
    paymentRef: "pay_ICICI_778192",
    refundAmount: 0,
    refundDetails: null,
    rejectionReason: null,
    timeline: [
      {
        step: "Requested",
        timestamp: "27 Oct 2026, 11:05 AM",
        note: "Product upgrade exchange requested.",
        actor: "Customer (Radhika Varma)"
      },
      {
        step: "Approved",
        timestamp: "27 Oct 2026, 03:30 PM",
        note: "Approved by manager with invoice differential quote ₹1,100.",
        actor: "Admin (Store Manager)"
      },
      {
        step: "Received",
        timestamp: "30 Oct 2026, 09:45 AM",
        note: "Package received at Studio Hub. Quality inspection PASSED. Tags attached, unwashed, pristine condition.",
        actor: "Staff (QC Associate - Sunita)"
      }
    ]
  },
  {
    id: "RET-26-079",
    createdAt: "2026-10-26T15:30:00",
    orderId: "ORD-24651",
    orderDate: "2026-10-18",
    channel: "Online Boutique",
    customer: {
      name: "Meera Krishnan",
      email: "meera.krishnan@techlaw.in",
      phone: "+91 99890 12044",
      city: "Hyderabad, Telangana",
      address: "Road No. 36, Jubilee Hills, Near Peddamma Temple, Hyderabad 500033"
    },
    product: {
      id: "PROD-101",
      name: "Chanderi Silk Angrakha Kurta",
      sku: "CSK-ECR-S",
      size: "S",
      color: "Natural Ecru",
      price: 6450
    },
    type: "size_exchange",
    exchangeTarget: {
      size: "M",
      status: "completed",
      dispatchRef: "DTDC-HYD-998124"
    },
    reasonCategory: "Incorrect Sizing / Fit",
    customerReason: "Needed half size larger for relaxed festival drape.",
    photos: [],
    status: "exchanged",
    qcStatus: "passed",
    paymentMethod: "UPI (Paytm / Axis)",
    paymentRef: "paytm_99210084",
    refundAmount: 0,
    refundDetails: {
      method: "Replacement Dispatched",
      date: "2026-10-29",
      ref: "DTDC-HYD-998124",
      dispatchedSku: "CSK-ECR-M"
    },
    rejectionReason: null,
    timeline: [
      {
        step: "Requested",
        timestamp: "26 Oct 2026, 03:30 PM",
        note: "Customer logged size exchange from S to M.",
        actor: "Customer"
      },
      {
        step: "Approved",
        timestamp: "26 Oct 2026, 05:00 PM",
        note: "Reverse courier pickup arranged.",
        actor: "Admin"
      },
      {
        step: "Received",
        timestamp: "28 Oct 2026, 11:00 AM",
        note: "Returned Size S received and verified pristine.",
        actor: "Staff"
      },
      {
        step: "Exchanged",
        timestamp: "29 Oct 2026, 02:15 PM",
        note: "Replacement Size M dispatched via DTDC Express (AWB: DTDC-HYD-998124). Inventory updated: Size S +1, Size M -1.",
        actor: "Admin (Store Manager)"
      }
    ]
  },
  {
    id: "RET-26-074",
    createdAt: "2026-10-24T18:10:00",
    orderId: "ORD-24589",
    orderDate: "2026-10-15",
    channel: "Studio Pre-Order",
    customer: {
      name: "Kabir Sen",
      email: "kabir.sen@senassociates.com",
      phone: "+91 98300 44902",
      city: "Kolkata, West Bengal",
      address: "18 Ballygunge Circular Road, Kolkata 700019"
    },
    product: {
      id: "PROD-106",
      name: "Kashmiri Aari Embroidered Velvet Jacket",
      sku: "KAV-PLM-L",
      size: "L",
      color: "Deep Wine Plum",
      price: 16500
    },
    type: "refund",
    exchangeTarget: null,
    reasonCategory: "Event Postponed / Changed Mind",
    customerReason: "The winter wedding was postponed to late February. Velvet jacket is unworn in pristine dust bag with garment tags attached.",
    photos: [],
    status: "refunded",
    qcStatus: "passed",
    paymentMethod: "Razorpay (HDFC CC)",
    paymentRef: "pay_HDFC_8849102",
    refundAmount: 16500,
    refundDetails: {
      amount: 16500,
      method: "Original Payment Source (Razorpay Gate)",
      date: "2026-10-28",
      ref: "RFND-RZP-99410294",
      utr: "UTR20261028-HDFC-991",
      note: "Full refund credited back to customer card. Garment returned to Studio Vault V-01."
    },
    rejectionReason: null,
    timeline: [
      {
        step: "Requested",
        timestamp: "24 Oct 2026, 06:10 PM",
        note: "Return request submitted within 7-day policy window.",
        actor: "Customer"
      },
      {
        step: "Approved",
        timestamp: "25 Oct 2026, 10:00 AM",
        note: "Courier pickup booked.",
        actor: "Admin"
      },
      {
        step: "Received",
        timestamp: "27 Oct 2026, 01:20 PM",
        note: "Delivered to studio. Physical inspection passed.",
        actor: "Staff"
      },
      {
        step: "Refunded",
        timestamp: "28 Oct 2026, 04:30 PM",
        note: "Refund of ₹16,500 executed. UTR #UTR20261028-HDFC-991. Inventory restocked: +1 to KAV-PLM-L.",
        actor: "Admin (Finance Lead)"
      }
    ]
  },
  {
    id: "RET-26-071",
    createdAt: "2026-10-23T12:00:00",
    orderId: "ORD-24540",
    orderDate: "2026-10-10",
    channel: "Online Boutique",
    customer: {
      name: "Tanvi Malani",
      email: "tanvi.m@malanitrading.com",
      phone: "+91 98220 77190",
      city: "Pune, Maharashtra",
      address: "Row House 4, Koregaon Park North Main Rd, Pune 411001"
    },
    product: {
      id: "PROD-104",
      name: "Bagru Print Cotton Tiered Midi Dress",
      sku: "BPC-OCH-M",
      size: "M",
      color: "Earth Ochre",
      price: 4250
    },
    type: "refund",
    exchangeTarget: null,
    reasonCategory: "Policy Breach / Worn Garment",
    customerReason: "Fabric did not feel as soft as expected.",
    photos: [
      {
        id: "ph-5",
        title: "Staff QC Inspection Report",
        tag: "QC Failure Evidence",
        caption: "Designer brand tag detached and heavy synthetic perfume aroma detected"
      }
    ],
    status: "rejected",
    qcStatus: "failed_cust_damage",
    paymentMethod: "UPI (PhonePe)",
    paymentRef: "phonepe_4491209",
    refundAmount: 0,
    refundDetails: null,
    rejectionReason: {
      code: "TAG_REMOVED_WORN",
      title: "Security Tag Removed & Wear Detected",
      note: "During Studio QC on 25 Oct, garment was inspected: the tamper-evident security ribbon was cut, and strong fragrance was present. Under Section 4.2 of our Handcrafted Return Policy, worn garments cannot be refunded. Garment is being couriered back to customer.",
      date: "2026-10-25T14:30:00",
      adminName: "Store Manager"
    },
    timeline: [
      {
        step: "Requested",
        timestamp: "23 Oct 2026, 12:00 PM",
        note: "Return request submitted 13 days after delivery (outside standard 7-day window).",
        actor: "Customer"
      },
      {
        step: "Rejected",
        timestamp: "25 Oct 2026, 02:30 PM",
        note: "Request rejected due to missing tag & evidence of wear. Formal notification dispatched to customer.",
        actor: "Admin (Store Manager)"
      }
    ]
  },
  {
    id: "RET-26-068",
    createdAt: "2026-10-22T09:30:00",
    orderId: "ORD-24490",
    orderDate: "2026-10-14",
    channel: "Online Boutique",
    customer: {
      name: "Devika Merchant",
      email: "devika.merchant@merchantsons.com",
      phone: "+91 98211 99014",
      city: "Mumbai, Maharashtra",
      address: "14 Altamount Road, Cumballa Hill, Mumbai 400026"
    },
    product: {
      id: "PROD-102",
      name: "Ajrakh Handblock Modal Satin Saree",
      sku: "AMS-IND-FS",
      size: "Free Size",
      color: "Indigo & Madder Red",
      price: 8900
    },
    type: "refund",
    exchangeTarget: null,
    reasonCategory: "Fabric Texture Dissatisfaction",
    customerReason: "Preferred heavier pure tussar silk over modal satin for the festive pooja.",
    photos: [],
    status: "received",
    qcStatus: "passed",
    paymentMethod: "Razorpay (Credit Card)",
    paymentRef: "pay_CC_889102",
    refundAmount: 8900,
    refundDetails: null,
    rejectionReason: null,
    timeline: [
      {
        step: "Requested",
        timestamp: "22 Oct 2026, 09:30 AM",
        note: "Return logged.",
        actor: "Customer"
      },
      {
        step: "Approved",
        timestamp: "22 Oct 2026, 02:15 PM",
        note: "Approved for studio pickup.",
        actor: "Admin"
      },
      {
        step: "Received",
        timestamp: "29 Oct 2026, 04:00 PM",
        note: "Received at Colaba studio. QC verified intact. Ready for refund release.",
        actor: "Staff"
      }
    ]
  }
];

const INITIAL_INVENTORY_LEDGER = [
  {
    id: "LEDG-891",
    timestamp: "2026-10-29 14:15",
    sku: "CSK-ECR-M",
    productName: "Chanderi Silk Angrakha Kurta",
    movement: "Dispatched (Exchange)",
    delta: -1,
    balance: 0,
    location: "Studio Rack A-04",
    reason: "Dispatched replacement for RET-26-079",
    actor: "Admin (Store Manager)"
  },
  {
    id: "LEDG-890",
    timestamp: "2026-10-28 16:30",
    sku: "KAV-PLM-L",
    productName: "Kashmiri Aari Velvet Jacket",
    movement: "Restocked (Return QC Passed)",
    delta: +1,
    balance: 1,
    location: "Studio Vault V-01",
    reason: "Restocked from approved return RET-26-074",
    actor: "Staff (Sunita - QC Lead)"
  },
  {
    id: "LEDG-889",
    timestamp: "2026-10-28 11:00",
    sku: "CSK-ECR-S",
    productName: "Chanderi Silk Angrakha Kurta",
    movement: "Restocked (Exchange Return)",
    delta: +1,
    balance: 4,
    location: "Studio Rack A-04",
    reason: "Customer returned Size S under RET-26-079",
    actor: "Staff (Sunita - QC Lead)"
  }
];

const REJECTION_TEMPLATES = [
  {
    code: "TAG_REMOVED",
    title: "Security Tag / Designer Label Removed",
    text: "The tamper-evident security ribbon or fabric designer label was detached or missing upon studio inspection. Our boutique policy requires all tags to remain intact for returns."
  },
  {
    code: "EVIDENCE_OF_WEAR",
    title: "Signs of Wear or Alteration",
    text: "The returned garment exhibits indications of wear (fragrance/cosmetic transfer/hem adjustment). Handcrafted garments cannot be resold once worn."
  },
  {
    code: "WINDOW_EXCEEDED",
    title: "Return Window Expired (7-Day Policy)",
    text: "This return request was initiated after our standard 7-day boutique window from the date of confirmed delivery."
  },
  {
    code: "CUSTOM_MADE_EXCLUSION",
    title: "Customized or Made-to-Measure Piece",
    text: "This order was individually customized or altered to specific customer bust/length measurements, which is exempt from standard returns as communicated at purchase."
  }
];

// Sample past orders available for Customer Portal demo lookup
const CUSTOMER_SAMPLE_ORDERS = [
  {
    orderId: "ORD-24817",
    customerPhone: "9820144821",
    customerEmail: "ananya.deshmukh@gmail.com",
    customerName: "Ananya Deshmukh",
    deliveryDate: "27 Oct 2026",
    address: "Flat 402, Sea Green Apts, Perry Cross Rd, Bandra West, Mumbai 400050",
    items: [
      {
        id: "PROD-101",
        name: "Chanderi Silk Angrakha Kurta",
        size: "M",
        color: "Natural Ecru",
        price: 6450,
        sku: "CSK-ECR-M",
        imageType: "kurta"
      }
    ]
  },
  {
    orderId: "ORD-24805",
    customerPhone: "9819922011",
    customerEmail: "shreya.sen@lifestyle.in",
    customerName: "Shreya Sen",
    deliveryDate: "28 Oct 2026",
    address: "Penthouse 12, Regency Heights, Koregaon Park, Pune 411001",
    items: [
      {
        id: "PROD-103",
        name: "Mulmul Anarkali Set with Kota Doria Dupatta",
        size: "S",
        color: "Blush Gulab Pink",
        price: 11200,
        sku: "MAK-GUL-S",
        imageType: "anarkali"
      },
      {
        id: "PROD-104",
        name: "Bagru Print Cotton Tiered Midi Dress",
        size: "M",
        color: "Earth Ochre",
        price: 4250,
        sku: "BPC-OCH-M",
        imageType: "dress"
      }
    ]
  }
];

// Browser & Node environment compatibility
if (typeof window !== "undefined") {
  window.INITIAL_PRODUCTS = INITIAL_PRODUCTS;
  window.INITIAL_REQUESTS = INITIAL_REQUESTS;
  window.INITIAL_INVENTORY_LEDGER = INITIAL_INVENTORY_LEDGER;
  window.REJECTION_TEMPLATES = REJECTION_TEMPLATES;
  window.CUSTOMER_SAMPLE_ORDERS = CUSTOMER_SAMPLE_ORDERS;
}
if (typeof module !== "undefined" && module.exports) {
  module.exports = {
    INITIAL_PRODUCTS,
    INITIAL_REQUESTS,
    INITIAL_INVENTORY_LEDGER,
    REJECTION_TEMPLATES,
    CUSTOMER_SAMPLE_ORDERS
  };
}

