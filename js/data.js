/**
 * Shared Mock Database for Fashion Boutique Admin Panel
 * Module 1: Overview (Dashboard) & Module 2: Products
 * Currency: USD ($) - Configurable
 */

(function (root, factory) {
  if (typeof define === 'function' && define.amd) {
    define([], factory);
  } else if (typeof module === 'object' && module.exports) {
    module.exports = factory();
  } else {
    root.BoutiqueData = factory();
  }
}(typeof self !== 'undefined' ? self : this, function () {

  const CURRENCY_SYMBOL = "$";
  const CURRENCY_CODE = "USD";

  const CATEGORIES = [
    { id: "cat-1", name: "Dresses", slug: "dresses", subcategories: ["Wrap Dresses", "Shirt Dresses", "Maxi & Kaftans", "Midi Dresses"] },
    { id: "cat-2", name: "Kurtas & Tunics", slug: "kurtas-tunics", subcategories: ["Angrakha Sets", "A-Line Kurtas", "Short Tunics", "Festive Ensembles"] },
    { id: "cat-3", name: "Sarees & Drapes", slug: "sarees-drapes", subcategories: ["Handblock Sarees", "Silk Jamdani", "Organza & Tissue", "Tussar Weaves"] },
    { id: "cat-4", name: "Tops & Shirts", slug: "tops-shirts", subcategories: ["Linen Blouses", "Relaxed Muslin Shirts", "Silk Camisoles", "Peplum Tops"] },
    { id: "cat-5", name: "Outerwear & Jackets", slug: "outerwear-jackets", subcategories: ["Embroidered Jackets", "Kantha Quilted Dusters", "Silk Vests", "Overcoats"] },
    { id: "cat-6", name: "Bottoms & Skirts", slug: "bottoms-skirts", subcategories: ["Palazzos", "Linen Trousers", "Gathered Skirts", "Culottes"] }
  ];

  const COLLECTIONS = [
    "Festive Resort '26",
    "Heirloom Artisanal Edit",
    "Monsoon Handlooms",
    "Pure Linen Core",
    "Studio Archive"
  ];

  const STANDARD_SIZES = ["XS", "S", "M", "L", "XL", "XXL"];

  const STANDARD_COLORS = [
    { name: "Indigo", hex: "#23395B" },
    { name: "Madder Red", hex: "#7E2E2E" },
    { name: "Raw Sand", hex: "#C7B9A5" },
    { name: "Carbon Ink", hex: "#1C1B19" },
    { name: "Muted Olive", hex: "#4A5240" },
    { name: "Terracotta", hex: "#A65B47" }
  ];

  // Helper to generate consistent matrix of variants
  function generateVariants(prefix, basePrice, sizes, colors, stockPlan) {
    const variants = [];
    sizes.forEach(size => {
      colors.forEach(col => {
        const sku = `${prefix}-${col.name.slice(0, 3).toUpperCase()}-${size}`;
        const key = `${size}-${col.name}`;
        const stock = stockPlan[key] !== undefined ? stockPlan[key] : 6;
        variants.push({
          sku: sku,
          size: size,
          color: col.name,
          colorHex: col.hex,
          price: basePrice,
          stock: stock,
          lowStockThreshold: 3,
          barcode: `890${Math.floor(100000000 + Math.random() * 900000000)}`
        });
      });
    });
    return variants;
  }

  // 42 Believable Luxury Boutique Products
  const INITIAL_PRODUCTS = [
    {
      id: "PROD-1001",
      name: "Linen Wrap Midi Dress",
      slug: "linen-wrap-midi-dress",
      sku: "LWD-IND",
      category: "Dresses",
      categoryId: "cat-1",
      subcategory: "Wrap Dresses",
      status: "published",
      regularPrice: 195,
      salePrice: 165,
      costPrice: 68,
      taxClass: "Standard 18%",
      shortDescription: "Signature tie-waist wrap silhouette in pure organic Belgian flax linen.",
      longDescription: "Crafted by master artisans in small batches, this wrap midi dress features French seams, functional deep inseam pockets, and an adjustable surplice neckline. Washed with stone river pumice for an exceptionally soft drape.",
      fabric: "100% Belgian Organic Flax Linen",
      careInstructions: "Machine wash cold on gentle cycle. Hang in shade. Warm steam press.",
      origin: "India (Artisanal Handloom Cluster)",
      tags: ["bestseller", "resort26", "pure-linen"],
      collection: "Pure Linen Core",
      lowStockThreshold: 5,
      backordersAllowed: false,
      returnable: true,
      returnWindowDays: 7,
      weightKg: 0.48,
      dimensions: "36 x 26 x 3 cm",
      featured: true,
      seoTitle: "Linen Wrap Midi Dress | Handcrafted Atelier Collection",
      seoDescription: "Shop our bestselling linen wrap dress in natural indigo and raw sand hues. Breathable organic flax linen tailored for versatile comfort.",
      images: [
        { id: "img-1", url: "assets/dress-indigo-1.jpg", tag: "Front View", primary: true, color: "Indigo" },
        { id: "img-2", url: "assets/dress-indigo-2.jpg", tag: "Back Drape", primary: false, color: "Indigo" },
        { id: "img-3", url: "assets/dress-sand-1.jpg", tag: "Fabric Macro", primary: false, color: "Raw Sand" }
      ],
      variants: generateVariants("LWD", 195, ["XS", "S", "M", "L", "XL"], [STANDARD_COLORS[0], STANDARD_COLORS[2]], {
        "XS-Indigo": 2, "S-Indigo": 0, "M-Indigo": 1, "L-Indigo": 4, "XL-Indigo": 2, // Low stock on S & M!
        "XS-Raw Sand": 3, "S-Raw Sand": 5, "M-Raw Sand": 2, "L-Raw Sand": 6, "XL-Raw Sand": 1
      }),
      sales30Days: 48,
      returnRate: 2.8,
      createdAt: "2026-08-15T10:00:00Z",
      updatedAt: "2026-10-28T14:30:00Z"
    },
    {
      id: "PROD-1002",
      name: "Chanderi Silk Angrakha Kurta",
      slug: "chanderi-silk-angrakha-kurta",
      sku: "CSK-ECR",
      category: "Kurtas & Tunics",
      categoryId: "cat-2",
      subcategory: "Angrakha Sets",
      status: "published",
      regularPrice: 220,
      salePrice: null,
      costPrice: 84,
      taxClass: "Standard 18%",
      shortDescription: "Pure Chanderi silk cross-over angrakha tunic with delicate gold zari piping.",
      longDescription: "Handwoven in Madhya Pradesh using age-old pit looms. Features artisanal fabric dori ties with handcrafted tassel beads. Lined in breathable cotton mulmul.",
      fabric: "Handwoven Chanderi Silk with Zari Accent",
      careInstructions: "Dry clean only. Store wrapped in clean muslin cloth.",
      origin: "Chanderi, Madhya Pradesh",
      tags: ["festive26", "handloom", "silk"],
      collection: "Heirloom Artisanal Edit",
      lowStockThreshold: 4,
      backordersAllowed: true,
      returnable: true,
      returnWindowDays: 7,
      weightKg: 0.42,
      dimensions: "35 x 25 x 2 cm",
      featured: true,
      seoTitle: "Chanderi Silk Angrakha Kurta | Festive Heirloom Edit",
      seoDescription: "Exquisite handwoven Chanderi silk kurta with pure zari piping and mulmul lining. Handcrafted Indian occasion wear.",
      images: [
        { id: "img-4", url: "assets/kurta-ecru-1.jpg", tag: "Front Ensemble", primary: true, color: "Raw Sand" }
      ],
      variants: generateVariants("CSK", 220, ["S", "M", "L", "XL"], [STANDARD_COLORS[2], STANDARD_COLORS[4]], {
        "S-Raw Sand": 4, "M-Raw Sand": 0, "L-Raw Sand": 3, "XL-Raw Sand": 5,
        "S-Muted Olive": 2, "M-Muted Olive": 1, "L-Muted Olive": 0, "XL-Muted Olive": 2 // M & L low
      }),
      sales30Days: 62,
      returnRate: 4.1,
      createdAt: "2026-08-20T11:20:00Z",
      updatedAt: "2026-10-30T09:15:00Z"
    },
    {
      id: "PROD-1003",
      name: "Ajrakh Handblock Modal Satin Saree",
      slug: "ajrakh-modal-satin-saree",
      sku: "AMS-IND",
      category: "Sarees & Drapes",
      categoryId: "cat-3",
      subcategory: "Handblock Sarees",
      status: "published",
      regularPrice: 280,
      salePrice: 245,
      costPrice: 110,
      taxClass: "Standard 18%",
      shortDescription: "16-stage naturally dyed Ajrakh geometric handblock print on modal satin.",
      longDescription: "Printed using carved teak blocks and non-toxic natural indigo and madder root extracts along the banks of the river Dhamadka in Kutch. Silky fluid hand-feel with rich earthy luster.",
      fabric: "100% Eco-Modal Satin with Vegetable Dyes",
      careInstructions: "Dry clean first two washes, followed by gentle cold hand wash.",
      origin: "Kutch, Gujarat",
      tags: ["heritage", "natural-dye", "ajrakh"],
      collection: "Heirloom Artisanal Edit",
      lowStockThreshold: 3,
      backordersAllowed: false,
      returnable: true,
      returnWindowDays: 7,
      weightKg: 0.65,
      dimensions: "38 x 28 x 4 cm",
      featured: true,
      seoTitle: "Ajrakh Handblock Modal Satin Saree | Kutch Artisans",
      seoDescription: "Authentic 16-stage Ajrakh handblock printed saree using mineral and root dyes on luxury modal satin drape.",
      images: [
        { id: "img-5", url: "assets/saree-ajrakh-1.jpg", tag: "Pallu Detail", primary: true, color: "Indigo" }
      ],
      variants: [
        { sku: "AMS-IND-FS", size: "Free Size", color: "Indigo", colorHex: "#23395B", price: 280, stock: 2, lowStockThreshold: 3, barcode: "89045123901" } // Low stock!
      ],
      sales30Days: 34,
      returnRate: 1.5,
      createdAt: "2026-08-22T08:30:00Z",
      updatedAt: "2026-10-27T16:00:00Z"
    },
    {
      id: "PROD-1004",
      name: "Block-Print Relaxed Cotton Shirt",
      slug: "block-print-relaxed-cotton-shirt",
      sku: "BCS-MDR",
      category: "Tops & Shirts",
      categoryId: "cat-4",
      subcategory: "Relaxed Muslin Shirts",
      status: "published",
      regularPrice: 115,
      salePrice: null,
      costPrice: 42,
      taxClass: "Standard 18%",
      shortDescription: "Camp-collar boxy shirt hand block-printed with botanical Bagru motifs.",
      longDescription: "Cut from featherlight 60s count handloom cotton. Mother-of-pearl buttons, clean French side seams, and a relaxed drop shoulder silhouette perfect for warm climates.",
      fabric: "100% Handspun Cambric Cotton",
      careInstructions: "Machine wash cold with mild liquid soap. Line dry in shade.",
      origin: "Bagru, Rajasthan",
      tags: ["casual", "blockprint", "cotton"],
      collection: "Monsoon Handlooms",
      lowStockThreshold: 5,
      backordersAllowed: false,
      returnable: true,
      returnWindowDays: 7,
      weightKg: 0.28,
      dimensions: "32 x 22 x 2 cm",
      featured: false,
      seoTitle: "Block-Print Relaxed Cotton Shirt | Bagru Botanicals",
      seoDescription: "Lightweight camp collar handblock cotton shirt featuring traditional Bagru wooden block botanical prints.",
      images: [
        { id: "img-6", url: "assets/shirt-bagru-1.jpg", tag: "Front Angle", primary: true, color: "Madder Red" }
      ],
      variants: generateVariants("BCS", 115, ["S", "M", "L", "XL"], [STANDARD_COLORS[1], STANDARD_COLORS[3]], {
        "S-Madder Red": 8, "M-Madder Red": 12, "L-Madder Red": 7, "XL-Madder Red": 4,
        "S-Carbon Ink": 6, "M-Carbon Ink": 9, "L-Carbon Ink": 5, "XL-Carbon Ink": 3
      }),
      sales30Days: 55,
      returnRate: 3.0,
      createdAt: "2026-08-25T14:10:00Z",
      updatedAt: "2026-10-29T11:45:00Z"
    },
    {
      id: "PROD-1005",
      name: "Kashmiri Aari Embroidered Velvet Jacket",
      slug: "kashmiri-aari-velvet-jacket",
      sku: "KAV-PLM",
      category: "Outerwear & Jackets",
      categoryId: "cat-5",
      subcategory: "Embroidered Jackets",
      status: "published",
      regularPrice: 380,
      salePrice: null,
      costPrice: 165,
      taxClass: "Standard 18%",
      shortDescription: "Bespoke micro-velvet tailored duster embellished with antique gold aari needlework.",
      longDescription: "Each individual jacket requires over 65 hours of manual hook-needle (aari) embroidery by generational master craftsmen in Srinagar. Lined with rich cupro silk.",
      fabric: "Micro-Velvet Shell with 100% Cupro Lining",
      careInstructions: "Specialist dry clean only. Do not iron directly on embroidery.",
      origin: "Srinagar, Kashmir",
      tags: ["bespoke", "velvet", "embroidery", "winter-luxury"],
      collection: "Festive Resort '26",
      lowStockThreshold: 2,
      backordersAllowed: false,
      returnable: true,
      returnWindowDays: 7,
      weightKg: 0.95,
      dimensions: "42 x 32 x 6 cm",
      featured: true,
      seoTitle: "Kashmiri Aari Embroidered Velvet Jacket | Srinagar Atelier",
      seoDescription: "Exquisite hand-embroidered velvet outerwear jacket with gold aari floral motifs. Bespoke winter luxury statement coat.",
      images: [
        { id: "img-7", url: "assets/jacket-velvet-1.jpg", tag: "Front Embroidery", primary: true, color: "Madder Red" }
      ],
      variants: generateVariants("KAV", 380, ["S", "M", "L"], [STANDARD_COLORS[1]], {
        "S-Madder Red": 1, "M-Madder Red": 2, "L-Madder Red": 1 // Low inventory across board
      }),
      sales30Days: 14,
      returnRate: 2.1,
      createdAt: "2026-09-01T12:00:00Z",
      updatedAt: "2026-10-25T17:20:00Z"
    },
    {
      id: "PROD-1006",
      name: "Pleated Tussar Silk Culottes",
      slug: "pleated-tussar-silk-culottes",
      sku: "PSC-SND",
      category: "Bottoms & Skirts",
      categoryId: "cat-6",
      subcategory: "Culottes",
      status: "published",
      regularPrice: 155,
      salePrice: 135,
      costPrice: 56,
      taxClass: "Standard 18%",
      shortDescription: "High-waisted cropped wide-leg trouser in wild raw tussar silk texture.",
      longDescription: "Architectural knife pleats along front waist, discreet side pockets, and partially elasticated back waistband for refined all-day comfort.",
      fabric: "Pure Wild Tussar Silk with Textured Slubs",
      careInstructions: "Dry clean or gentle hand wash in lukewarm water with wool detergent.",
      origin: "Bhagalpur, Bihar",
      tags: ["tussar", "silk", "minimalist"],
      collection: "Pure Linen Core",
      lowStockThreshold: 4,
      backordersAllowed: false,
      returnable: true,
      returnWindowDays: 7,
      weightKg: 0.38,
      dimensions: "34 x 24 x 2 cm",
      featured: false,
      seoTitle: "Pleated Tussar Silk Culottes | Handcrafted Wide-Leg Pants",
      seoDescription: "Tailored high-rise cropped trousers in textured Bhagalpuri tussar silk. Minimalist occasion trousers.",
      images: [
        { id: "img-8", url: "assets/culottes-sand-1.jpg", tag: "Side Profile", primary: true, color: "Raw Sand" }
      ],
      variants: generateVariants("PSC", 155, ["XS", "S", "M", "L"], [STANDARD_COLORS[2], STANDARD_COLORS[4]], {
        "XS-Raw Sand": 4, "S-Raw Sand": 6, "M-Raw Sand": 5, "L-Raw Sand": 3,
        "XS-Muted Olive": 2, "S-Muted Olive": 4, "M-Muted Olive": 3, "L-Muted Olive": 1
      }),
      sales30Days: 29,
      returnRate: 3.4,
      createdAt: "2026-09-03T10:15:00Z",
      updatedAt: "2026-10-22T13:40:00Z"
    },
    {
      id: "PROD-1007",
      name: "Mulmul Anarkali Set with Kota Dupatta",
      slug: "mulmul-anarkali-set-kota-dupatta",
      sku: "MAK-GUL",
      category: "Kurtas & Tunics",
      categoryId: "cat-2",
      subcategory: "Festive Ensembles",
      status: "published",
      regularPrice: 260,
      salePrice: null,
      costPrice: 102,
      taxClass: "Standard 18%",
      shortDescription: "32-kali flared muslin anarkali with delicate gota border and Kota Doria dupatta.",
      longDescription: "Crafted with cloud-soft mulmul cotton and paired with hand-dyed gossamer Kota Doria silk-cotton dupatta. Embellished with hand-applied gota patti borders.",
      fabric: "Fine Mulmul Cotton with Kota Doria Silk Dupatta",
      careInstructions: "Dry clean recommended for first wash to set natural dyes.",
      origin: "Jaipur, Rajasthan",
      tags: ["festive", "anarkali", "gota-patti"],
      collection: "Festive Resort '26",
      lowStockThreshold: 3,
      backordersAllowed: true,
      returnable: true,
      returnWindowDays: 7,
      weightKg: 0.62,
      dimensions: "38 x 28 x 4 cm",
      featured: true,
      seoTitle: "Mulmul Anarkali Set with Kota Dupatta | Festive Edit",
      seoDescription: "Twirl-worthy 32-kali mulmul cotton anarkali ensemble with handcrafted Kota Doria dupatta and gota patti detailing.",
      images: [
        { id: "img-9", url: "assets/anarkali-gul-1.jpg", tag: "Full Kali Flair", primary: true, color: "Madder Red" }
      ],
      variants: generateVariants("MAK", 260, ["XS", "S", "M", "L", "XL"], [STANDARD_COLORS[1]], {
        "XS-Madder Red": 1, "S-Madder Red": 2, "M-Madder Red": 3, "L-Madder Red": 0, "XL-Madder Red": 2 // Size L out of stock
      }),
      sales30Days: 41,
      returnRate: 3.9,
      createdAt: "2026-09-05T09:30:00Z",
      updatedAt: "2026-10-29T15:20:00Z"
    },
    {
      id: "PROD-1008",
      name: "Handloom Cotton Jamdani Saree",
      slug: "handloom-cotton-jamdani-saree",
      sku: "HCS-WHT",
      category: "Sarees & Drapes",
      categoryId: "cat-3",
      subcategory: "Silk Jamdani",
      status: "published",
      regularPrice: 310,
      salePrice: null,
      costPrice: 130,
      taxClass: "Standard 18%",
      shortDescription: "Intricate supplementary-weft floral Jamdani motifs handwoven on translucent cotton.",
      longDescription: "An authentic GI-tagged weaving tradition. Weavers manipulate extra weft threads by hand using bamboo needles to create geometric floral patterns that appear to float on translucent muslin.",
      fabric: "100s Count Fine Handspun Cotton",
      careInstructions: "Gentle hand wash in cold water with starch. Iron while damp.",
      origin: "Nadia, West Bengal",
      tags: ["jamdani", "handloom", "heirloom"],
      collection: "Heirloom Artisanal Edit",
      lowStockThreshold: 2,
      backordersAllowed: false,
      returnable: true,
      returnWindowDays: 7,
      weightKg: 0.52,
      dimensions: "36 x 26 x 3 cm",
      featured: true,
      seoTitle: "Handloom Cotton Jamdani Saree | Bengal Weavers",
      seoDescription: "Authentic supplementary weft Jamdani cotton saree handwoven on traditional pit looms in Bengal.",
      images: [
        { id: "img-10", url: "assets/saree-jamdani-1.jpg", tag: "Weft Motif", primary: true, color: "Raw Sand" }
      ],
      variants: [
        { sku: "HCS-WHT-FS", size: "Free Size", color: "Raw Sand", colorHex: "#C7B9A5", price: 310, stock: 4, lowStockThreshold: 2, barcode: "89045123902" }
      ],
      sales30Days: 18,
      returnRate: 1.2,
      createdAt: "2026-09-07T11:00:00Z",
      updatedAt: "2026-10-24T18:00:00Z"
    },
    {
      id: "PROD-1009",
      name: "Kantha Stitch Quilted Cotton Duster",
      slug: "kantha-stitch-quilted-duster",
      sku: "KQD-INK",
      category: "Outerwear & Jackets",
      categoryId: "cat-5",
      subcategory: "Kantha Quilted Dusters",
      status: "draft",
      regularPrice: 240,
      salePrice: null,
      costPrice: 95,
      taxClass: "Standard 18%",
      shortDescription: "Reversible layered cotton coat held together with continuous running kantha stitches.",
      longDescription: "Hand-stitched over weeks by women artisans in rural Bengal. Two contrasting printed layers united with dense hand-needlework for light autumnal warmth.",
      fabric: "100% Cotton Muslin Layers with Cotton Wadding",
      careInstructions: "Gentle machine wash in mesh laundry bag. Air dry flat.",
      origin: "Bolpur, West Bengal",
      tags: ["kantha", "reversible", "quilted"],
      collection: "Studio Archive",
      lowStockThreshold: 3,
      backordersAllowed: false,
      returnable: true,
      returnWindowDays: 7,
      weightKg: 0.72,
      dimensions: "40 x 30 x 5 cm",
      featured: false,
      seoTitle: "Kantha Stitch Quilted Cotton Duster | Hand-Stitched Coat",
      seoDescription: "Reversible lightweight artisanal duster jacket showcasing traditional Bengal kantha running stitch needlework.",
      images: [
        { id: "img-11", url: "assets/duster-kantha-1.jpg", tag: "Running Stitch", primary: true, color: "Carbon Ink" }
      ],
      variants: generateVariants("KQD", 240, ["S", "M", "L"], [STANDARD_COLORS[3]], {
        "S-Carbon Ink": 3, "M-Carbon Ink": 4, "L-Carbon Ink": 2
      }),
      sales30Days: 0, // Draft product
      returnRate: 0,
      createdAt: "2026-09-10T16:45:00Z",
      updatedAt: "2026-10-30T11:00:00Z"
    },
    {
      id: "PROD-1010",
      name: "Bagru Tiered Cotton Maxi Dress",
      slug: "bagru-tiered-cotton-maxi-dress",
      sku: "BMD-OCH",
      category: "Dresses",
      categoryId: "cat-1",
      subcategory: "Maxi & Kaftans",
      status: "published",
      regularPrice: 145,
      salePrice: 125,
      costPrice: 52,
      taxClass: "Standard 18%",
      shortDescription: "Voluminous 3-tiered maxi dress hand block-printed in earthy Dabu mud-resist dyes.",
      longDescription: "Gathered tiers fall gently into an airy A-line silhouette with billowed bishop sleeves and delicate tie cords at the neck.",
      fabric: "Pure Organic Cotton with Vegetable Dye Pigments",
      careInstructions: "Wash with like colors in cold water. Natural dyes mature with washing.",
      origin: "Bagru, Rajasthan",
      tags: ["boho", "maxi", "dabu-resist"],
      collection: "Monsoon Handlooms",
      lowStockThreshold: 5,
      backordersAllowed: false,
      returnable: true,
      returnWindowDays: 7,
      weightKg: 0.44,
      dimensions: "35 x 25 x 3 cm",
      featured: false,
      seoTitle: "Bagru Tiered Cotton Maxi Dress | Dabu Resist Block Print",
      seoDescription: "Airy 3-tiered maxi dress featuring traditional mud-resist dabu block prints in natural earth tones.",
      images: [
        { id: "img-12", url: "assets/dress-tier-1.jpg", tag: "Tier Volume", primary: true, color: "Terracotta" }
      ],
      variants: generateVariants("BMD", 145, ["XS", "S", "M", "L", "XL"], [STANDARD_COLORS[5], STANDARD_COLORS[0]], {
        "XS-Terracotta": 5, "S-Terracotta": 8, "M-Terracotta": 6, "L-Terracotta": 4, "XL-Terracotta": 2,
        "XS-Indigo": 3, "S-Indigo": 6, "M-Indigo": 4, "L-Indigo": 3, "XL-Indigo": 1
      }),
      sales30Days: 37,
      returnRate: 3.1,
      createdAt: "2026-09-12T13:20:00Z",
      updatedAt: "2026-10-27T10:15:00Z"
    },
    {
      id: "PROD-1011",
      name: "Bespoke Linen Peplum Blouse",
      slug: "bespoke-linen-peplum-blouse",
      sku: "BLP-OLV",
      category: "Tops & Shirts",
      categoryId: "cat-4",
      subcategory: "Linen Blouses",
      status: "published",
      regularPrice: 125,
      salePrice: null,
      costPrice: 48,
      taxClass: "Standard 18%",
      shortDescription: "Tailored V-neck linen blouse with structured flared peplum and fabric buttons.",
      longDescription: "Crisp European flax linen sculpted with waist darts and finished with a flared peplum hem. Clean, minimalist architectural elegance.",
      fabric: "100% European Flax Linen (Mid-weight)",
      careInstructions: "Gentle machine wash cold. Warm iron while slightly damp.",
      origin: "India",
      tags: ["linen", "workwear", "minimalist"],
      collection: "Pure Linen Core",
      lowStockThreshold: 4,
      backordersAllowed: false,
      returnable: true,
      returnWindowDays: 7,
      weightKg: 0.31,
      dimensions: "30 x 22 x 2 cm",
      featured: false,
      seoTitle: "Bespoke Linen Peplum Blouse | European Flax Top",
      seoDescription: "Tailored V-neck peplum blouse crafted in premium European flax linen. Versatile smart casual styling.",
      images: [
        { id: "img-13", url: "assets/blouse-olive-1.jpg", tag: "Front Yoke", primary: true, color: "Muted Olive" }
      ],
      variants: generateVariants("BLP", 125, ["S", "M", "L", "XL"], [STANDARD_COLORS[4], STANDARD_COLORS[2]], {
        "S-Muted Olive": 5, "M-Muted Olive": 7, "L-Muted Olive": 3, "XL-Muted Olive": 2,
        "S-Raw Sand": 6, "M-Raw Sand": 8, "L-Raw Sand": 5, "XL-Raw Sand": 2
      }),
      sales30Days: 32,
      returnRate: 2.3,
      createdAt: "2026-09-14T15:00:00Z",
      updatedAt: "2026-10-26T12:00:00Z"
    },
    {
      id: "PROD-1012",
      name: "Tiered Ajrakh Gathered Skirt",
      slug: "tiered-ajrakh-gathered-skirt",
      sku: "TAG-IND",
      category: "Bottoms & Skirts",
      categoryId: "cat-6",
      subcategory: "Gathered Skirts",
      status: "published",
      regularPrice: 160,
      salePrice: null,
      costPrice: 58,
      taxClass: "Standard 18%",
      shortDescription: "Voluminous gathered maxi skirt combining three contrasting Ajrakh borders.",
      longDescription: "Swirling flared silhouette cut on the bias with deep side pockets, drawstring waistband with handmade cord tassels, and contrasting block-printed border hems.",
      fabric: "100% Organic Cotton with Natural Mineral Dyes",
      careInstructions: "Hand wash cold separately. Dry inside out in shade.",
      origin: "Kutch, Gujarat",
      tags: ["ajrakh", "skirt", "artisan"],
      collection: "Monsoon Handlooms",
      lowStockThreshold: 4,
      backordersAllowed: false,
      returnable: true,
      returnWindowDays: 7,
      weightKg: 0.46,
      dimensions: "36 x 26 x 3 cm",
      featured: false,
      seoTitle: "Tiered Ajrakh Gathered Skirt | Traditional Kutch Drape",
      seoDescription: "Flared tiered maxi skirt showcasing handblock printed Ajrakh patterns in authentic natural indigo dyes.",
      images: [
        { id: "img-14", url: "assets/skirt-ajrakh-1.jpg", tag: "Hem Swirl", primary: true, color: "Indigo" }
      ],
      variants: generateVariants("TAG", 160, ["XS", "S", "M", "L"], [STANDARD_COLORS[0]], {
        "XS-Indigo": 2, "S-Indigo": 4, "M-Indigo": 3, "L-Indigo": 1 // Low stock on XS & L
      }),
      sales30Days: 22,
      returnRate: 2.9,
      createdAt: "2026-09-16T12:30:00Z",
      updatedAt: "2026-10-23T14:15:00Z"
    },
    {
      id: "PROD-1013",
      name: "Maheshwari Tissue Silk Tunic",
      slug: "maheshwari-tissue-silk-tunic",
      sku: "MST-SGE",
      category: "Kurtas & Tunics",
      categoryId: "cat-2",
      subcategory: "Short Tunics",
      status: "published",
      regularPrice: 185,
      salePrice: null,
      costPrice: 72,
      taxClass: "Standard 18%",
      shortDescription: "Handwoven tissue silk tunic with traditional bugdi zari border at hem.",
      longDescription: "Woven in the historic riverbank town of Maheshwar. Lustrous zari warp blended with fine silk weft creates a subtle celestial glow. Paired with soft cotton lining.",
      fabric: "Maheshwari Tissue Silk-Cotton with Zari Weft",
      careInstructions: "Dry clean only. Roll in tissue paper for storage.",
      origin: "Maheshwar, Madhya Pradesh",
      tags: ["maheshwari", "festive", "zari"],
      collection: "Heirloom Artisanal Edit",
      lowStockThreshold: 3,
      backordersAllowed: false,
      returnable: true,
      returnWindowDays: 7,
      weightKg: 0.35,
      dimensions: "34 x 24 x 2 cm",
      featured: false,
      seoTitle: "Maheshwari Tissue Silk Tunic | Historic River Weaves",
      seoDescription: "Subtle luminous tissue silk tunic with authentic Maheshwari reversible geometric zari borders.",
      images: [
        { id: "img-15", url: "assets/tunic-sage-1.jpg", tag: "Border Detail", primary: true, color: "Muted Olive" }
      ],
      variants: generateVariants("MST", 185, ["S", "M", "L", "XL"], [STANDARD_COLORS[4]], {
        "S-Muted Olive": 2, "M-Muted Olive": 0, "L-Muted Olive": 2, "XL-Muted Olive": 0 // Out of stock on M & XL
      }),
      sales30Days: 26,
      returnRate: 4.8,
      createdAt: "2026-09-18T10:00:00Z",
      updatedAt: "2026-10-28T09:40:00Z"
    },
    {
      id: "PROD-1014",
      name: "Organza Scalloped Border Saree",
      slug: "organza-scalloped-border-saree",
      sku: "OSS-ROZ",
      category: "Sarees & Drapes",
      categoryId: "cat-3",
      subcategory: "Organza & Tissue",
      status: "published",
      regularPrice: 295,
      salePrice: 260,
      costPrice: 115,
      taxClass: "Standard 18%",
      shortDescription: "Sheer featherlight silk organza with hand-cut scalloped threadwork borders.",
      longDescription: "Gossamer organza hand-dyed in pastel blush with intricate silk thread resham embroidery along a meticulously cut scalloped edge. Comes with matching raw silk unstitched blouse piece.",
      fabric: "Pure Silk Organza with Silk Resham Embroidery",
      careInstructions: "Specialist dry clean only. Steam gently from distance.",
      origin: "Varanasi, Uttar Pradesh",
      tags: ["organza", "scalloped", "resort-wedding"],
      collection: "Festive Resort '26",
      lowStockThreshold: 3,
      backordersAllowed: false,
      returnable: true,
      returnWindowDays: 7,
      weightKg: 0.45,
      dimensions: "36 x 26 x 3 cm",
      featured: true,
      seoTitle: "Organza Scalloped Border Saree | Silk Resham Embroidery",
      seoDescription: "Romantic sheer silk organza saree finished with artisan hand-cut scalloped thread embroidery borders.",
      images: [
        { id: "img-16", url: "assets/saree-organza-1.jpg", tag: "Scallop Detail", primary: true, color: "Raw Sand" }
      ],
      variants: [
        { sku: "OSS-ROZ-FS", size: "Free Size", color: "Raw Sand", colorHex: "#C7B9A5", price: 295, stock: 5, lowStockThreshold: 3, barcode: "89045123903" }
      ],
      sales30Days: 38,
      returnRate: 2.5,
      createdAt: "2026-09-20T11:45:00Z",
      updatedAt: "2026-10-27T17:30:00Z"
    },
    {
      id: "PROD-1015",
      name: "Hand-Dyed Denim Artisan Shacket",
      slug: "hand-dyed-denim-artisan-shacket",
      sku: "DAS-IND",
      category: "Outerwear & Jackets",
      categoryId: "cat-5",
      subcategory: "Overcoats",
      status: "archived",
      regularPrice: 190,
      salePrice: null,
      costPrice: 75,
      taxClass: "Standard 18%",
      shortDescription: "10oz handloom denim chore jacket dipped in indigo vats six times.",
      longDescription: "Relaxed workwear overshirt with copper riveted utility pockets, selvedge detail on inner placket, and natural coconut shell buttons.",
      fabric: "10oz Handloom Selvedge Cotton Denim",
      careInstructions: "Machine wash cold inside out. Indigo will naturally fade over time.",
      origin: "Ahmedabad, Gujarat",
      tags: ["denim", "selvedge", "shacket", "archived"],
      collection: "Studio Archive",
      lowStockThreshold: 3,
      backordersAllowed: false,
      returnable: false,
      returnWindowDays: 0,
      weightKg: 0.85,
      dimensions: "40 x 30 x 4 cm",
      featured: false,
      seoTitle: "Hand-Dyed Denim Artisan Shacket | Indigo Selvedge",
      seoDescription: "Authentic 6-dip indigo handloom denim utility chore jacket with copper hardware.",
      images: [
        { id: "img-17", url: "assets/shacket-denim-1.jpg", tag: "Selvedge Collar", primary: true, color: "Indigo" }
      ],
      variants: generateVariants("DAS", 190, ["S", "M", "L"], [STANDARD_COLORS[0]], {
        "S-Indigo": 0, "M-Indigo": 0, "L-Indigo": 0 // Archived out of stock
      }),
      sales30Days: 0,
      returnRate: 4.0,
      createdAt: "2026-07-10T10:00:00Z",
      updatedAt: "2026-09-30T14:00:00Z"
    }
  ];

  // Dynamically generate additional 27 products to exceed 40 products as requested
  const EXTRA_SEED_NAMES = [
    { name: "Ribbed Modal Knit Dress", cat: "Dresses", catId: "cat-1", sub: "Midi Dresses", price: 170, cost: 62 },
    { name: "Asymmetric Halter Midi Dress", cat: "Dresses", catId: "cat-1", sub: "Midi Dresses", price: 210, cost: 78 },
    { name: "Boho Gauze Kaftan Dress", cat: "Dresses", catId: "cat-1", sub: "Maxi & Kaftans", price: 180, cost: 65 },
    { name: "Pleated Silk Shirt Dress", cat: "Dresses", catId: "cat-1", sub: "Shirt Dresses", price: 235, cost: 88 },
    { name: "Embroidered Slip Dress", cat: "Dresses", catId: "cat-1", sub: "Midi Dresses", price: 165, cost: 58 },
    { name: "Mulmul Pintuck Straight Kurta", cat: "Kurtas & Tunics", catId: "cat-2", sub: "A-Line Kurtas", price: 135, cost: 48 },
    { name: "Indigo Handblock Tunic", cat: "Kurtas & Tunics", catId: "cat-2", sub: "Short Tunics", price: 120, cost: 42 },
    { name: "Zari Embroidered Festive Kurta", cat: "Kurtas & Tunics", catId: "cat-2", sub: "Festive Ensembles", price: 245, cost: 92 },
    { name: "Slub Cotton Mandarin Collar Kurta", cat: "Kurtas & Tunics", catId: "cat-2", sub: "A-Line Kurtas", price: 110, cost: 38 },
    { name: "Chanderi Pattu Tissue Saree", cat: "Sarees & Drapes", catId: "cat-3", sub: "Organza & Tissue", price: 340, cost: 135 },
    { name: "Kalamkari Handpainted Silk Saree", cat: "Sarees & Drapes", catId: "cat-3", sub: "Handblock Sarees", price: 395, cost: 160 },
    { name: "Pure Tussar Silk Zari Saree", cat: "Sarees & Drapes", catId: "cat-3", sub: "Tussar Weaves", price: 320, cost: 125 },
    { name: "Mulmul Floral Printed Saree", cat: "Sarees & Drapes", catId: "cat-3", sub: "Handblock Sarees", price: 150, cost: 52 },
    { name: "Raw Silk Kimono Top", cat: "Tops & Shirts", catId: "cat-4", sub: "Linen Blouses", price: 140, cost: 52 },
    { name: "Handspun Khadi Sleeveless Top", cat: "Tops & Shirts", catId: "cat-4", sub: "Silk Camisoles", price: 95, cost: 32 },
    { name: "Tie-Front Muslin Crop Shirt", cat: "Tops & Shirts", catId: "cat-4", sub: "Relaxed Muslin Shirts", price: 105, cost: 36 },
    { name: "Gathered Yoke Silk Blouse", cat: "Tops & Shirts", catId: "cat-4", sub: "Linen Blouses", price: 160, cost: 60 },
    { name: "Printed Muslin Camp Shirt", cat: "Tops & Shirts", catId: "cat-4", sub: "Relaxed Muslin Shirts", price: 115, cost: 40 },
    { name: "Raw Silk Structured Overcoat", cat: "Outerwear & Jackets", catId: "cat-5", sub: "Overcoats", price: 350, cost: 140 },
    { name: "Handwoven Tweed Nehru Vest", cat: "Outerwear & Jackets", catId: "cat-5", sub: "Silk Vests", price: 175, cost: 65 },
    { name: "Applique Work Long Kimono Jacket", cat: "Outerwear & Jackets", catId: "cat-5", sub: "Embroidered Jackets", price: 290, cost: 110 },
    { name: "Handloom Cotton Flared Palazzo", cat: "Bottoms & Skirts", catId: "cat-6", sub: "Palazzos", price: 110, cost: 38 },
    { name: "Straight Fit Linen Trousers", cat: "Bottoms & Skirts", catId: "cat-6", sub: "Linen Trousers", price: 145, cost: 52 },
    { name: "Wrap-Around Muslin Dhoti Pants", cat: "Bottoms & Skirts", catId: "cat-6", sub: "Palazzos", price: 125, cost: 44 },
    { name: "Embroidered Silk Satin Pants", cat: "Bottoms & Skirts", catId: "cat-6", sub: "Linen Trousers", price: 175, cost: 68 },
    { name: "Smocked Waist Wide Leg Trouser", cat: "Bottoms & Skirts", catId: "cat-6", sub: "Palazzos", price: 135, cost: 46 },
    { name: "Linen Notch-Collar Day Jacket", cat: "Outerwear & Jackets", catId: "cat-5", sub: "Overcoats", price: 215, cost: 82 }
  ];

  EXTRA_SEED_NAMES.forEach((item, index) => {
    const num = 1016 + index;
    const prefix = item.name.split(" ").map(w => w[0]).join("").slice(0, 3).toUpperCase();
    const isDraft = index % 7 === 0;
    const isArchived = index % 11 === 0;
    const status = isArchived ? "archived" : isDraft ? "draft" : "published";
    const basePrice = item.price;
    const costPrice = item.cost;

    INITIAL_PRODUCTS.push({
      id: `PROD-${num}`,
      name: item.name,
      slug: item.name.toLowerCase().replace(/[^a-z0-9]+/g, "-"),
      sku: `${prefix}-${100 + index}`,
      category: item.cat,
      categoryId: item.catId,
      subcategory: item.sub,
      status: status,
      regularPrice: basePrice,
      salePrice: index % 4 === 0 ? Math.round(basePrice * 0.85) : null,
      costPrice: costPrice,
      taxClass: "Standard 18%",
      shortDescription: `Handcrafted ${item.name.toLowerCase()} tailored in conscious artisanal textiles.`,
      longDescription: `An intentional piece made with mindful design principles. Expertly cut and finished with bespoke attention to seam integrity and fabric drape.`,
      fabric: "Handspun Sustainable Natural Fibers",
      careInstructions: "Dry clean or delicate cold hand wash with neutral detergent.",
      origin: "India (Artisanal Cluster)",
      tags: ["handloom", "conscious-luxury", status === "published" ? "season-pick" : "upcoming"],
      collection: COLLECTIONS[index % COLLECTIONS.length],
      lowStockThreshold: 4,
      backordersAllowed: index % 5 === 0,
      returnable: true,
      returnWindowDays: 7,
      weightKg: 0.40,
      dimensions: "35 x 25 x 3 cm",
      featured: index % 6 === 0,
      seoTitle: `${item.name} | Boutique Atelier`,
      seoDescription: `Shop the handcrafted ${item.name.toLowerCase()} in conscious sustainable textiles.`,
      images: [
        { id: `img-seed-${num}`, url: "assets/product-placeholder.jpg", tag: "Studio Shot", primary: true, color: "Indigo" }
      ],
      variants: generateVariants(prefix, basePrice, ["S", "M", "L"], [STANDARD_COLORS[index % STANDARD_COLORS.length]], {
        [`S-${STANDARD_COLORS[index % STANDARD_COLORS.length].name}`]: (index * 3) % 11,
        [`M-${STANDARD_COLORS[index % STANDARD_COLORS.length].name}`]: (index * 2) % 8,
        [`L-${STANDARD_COLORS[index % STANDARD_COLORS.length].name}`]: (index * 5) % 14
      }),
      sales30Days: status === "published" ? (index * 7 + 12) % 65 : 0,
      returnRate: Number((2.0 + (index % 5) * 0.5).toFixed(1)),
      createdAt: `2026-09-${String((index % 25) + 1).padStart(2, "0")}T10:00:00Z`,
      updatedAt: `2026-10-28T${String((index % 12) + 8).padStart(2, "0")}:00:00Z`
    });
  });

  // Calculate total stock for all products
  INITIAL_PRODUCTS.forEach(p => {
    p.totalStock = p.variants.reduce((sum, v) => sum + (v.stock || 0), 0);
  });

  // 60 Days of Realistic Daily Sales Timeseries (Sept 1, 2026 to Oct 30, 2026)
  // Believable ups and downs (weekend peaks, festival promo spikes)
  const SALES_TIMESERIES_60_DAYS = [];
  const baseDate = new Date("2026-09-01T00:00:00Z");

  for (let i = 0; i < 60; i++) {
    const d = new Date(baseDate);
    d.setDate(baseDate.getDate() + i);
    const dayOfWeek = d.getUTCDay(); // 0 is Sunday, 6 is Saturday
    const isWeekend = dayOfWeek === 0 || dayOfWeek === 6;
    const isFestivalSpike = i >= 40 && i <= 48; // Festive sale window

    // Base figures with believable variability
    let dailyOrders = isWeekend ? Math.floor(18 + (i % 7) * 3 + Math.random() * 8) : Math.floor(9 + (i % 5) * 2 + Math.random() * 6);
    if (isFestivalSpike) dailyOrders += Math.floor(15 + Math.random() * 12);

    let avgOrderValue = 180 + (i % 6) * 12 + (Math.random() * 25);
    let onlineRevenue = Math.round(dailyOrders * 0.72 * avgOrderValue);
    let posRevenue = Math.round(dailyOrders * 0.28 * (avgOrderValue * 1.15));
    let totalRevenue = onlineRevenue + posRevenue;

    // Previous period simulation (approx 12-18% lower)
    let prevRevenue = Math.round(totalRevenue * (0.84 + ((i % 5) * 0.03)));
    let prevOrders = Math.round(dailyOrders * 0.88);

    SALES_TIMESERIES_60_DAYS.push({
      date: d.toISOString().split("T")[0],
      displayDate: d.toLocaleDateString("en-US", { month: "short", day: "numeric" }),
      dayOfWeek: ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"][dayOfWeek],
      revenue: totalRevenue,
      prevRevenue: prevRevenue,
      onlineRevenue: onlineRevenue,
      posRevenue: posRevenue,
      orders: dailyOrders,
      prevOrders: prevOrders,
      onlineOrders: Math.round(dailyOrders * 0.72),
      posOrders: Math.round(dailyOrders * 0.28),
      aov: Math.round(totalRevenue / dailyOrders)
    });
  }

  // Orders Needing Action Queue (Overview B4)
  const ORDERS_NEEDING_ACTION = [
    { type: "pending_payment", title: "Pending Wire / NEFT Transfer", count: 4, label: "Review Approvals", target: "orders" },
    { type: "to_pack", title: "Orders Ready to Pack in Studio", count: 11, label: "Print Packing Slips", target: "orders" },
    { type: "to_ship", title: "Awaiting Courier Pickup (BlueDart)", count: 7, label: "Generate Manifest", target: "shipments" },
    { type: "returns_awaiting", title: "Return Claims Awaiting Studio QC", count: 5, label: "Inspect Garments", target: "returns" }
  ];

  // Activity Feed (Overview B8)
  const INITIAL_ACTIVITY_LOG = [
    {
      id: "act-101",
      timestamp: "Today at 2:15 PM",
      timeAgo: "15 mins ago",
      user: "Staff (Sunita)",
      role: "staff",
      action: "Updated Stock",
      detail: "Added 12 units to Size M of Linen Wrap Midi Dress (Received from artisan cluster).",
      productId: "PROD-1001"
    },
    {
      id: "act-102",
      timestamp: "Today at 1:40 PM",
      timeAgo: "50 mins ago",
      user: "Manager (Priya)",
      role: "manager",
      action: "Published Product",
      detail: "Published new festive style 'Mulmul Anarkali Set with Kota Dupatta'.",
      productId: "PROD-1007"
    },
    {
      id: "act-103",
      timestamp: "Today at 11:10 AM",
      timeAgo: "3 hours ago",
      user: "Admin (Store Owner)",
      role: "admin",
      action: "Price Adjustment",
      detail: "Applied 15% Festive Resort discount to Ajrakh Modal Satin Saree ($280 → $245).",
      productId: "PROD-1003"
    },
    {
      id: "act-104",
      timestamp: "Yesterday at 5:20 PM",
      timeAgo: "Yesterday",
      user: "System",
      role: "system",
      action: "Low Stock Alert",
      detail: "Maheshwari Tissue Silk Tunic dropped to 0 units for Size M (Warehouse Vault B-02).",
      productId: "PROD-1013"
    },
    {
      id: "act-105",
      timestamp: "Yesterday at 3:00 PM",
      timeAgo: "Yesterday",
      user: "Staff (Sunita)",
      role: "staff",
      action: "Stock Correction",
      detail: "Deducted 1 damaged unit from Chanderi Silk Angrakha Kurta (Size L).",
      productId: "PROD-1002"
    }
  ];

  // Notifications for Bell dropdown (Topbar A2)
  const NOTIFICATIONS = [
    { id: "notif-1", title: "Low Stock Warning", message: "3 variants of Linen Wrap Midi Dress are under 3 units.", time: "10 mins ago", unread: true },
    { id: "notif-2", title: "New Return Claim", message: "Customer requested size exchange for ORD-24817.", time: "45 mins ago", unread: true },
    { id: "notif-3", title: "Daily Sales Target Met", message: "Online store crossed $4,200 in revenue today.", time: "2 hours ago", unread: false },
    { id: "notif-4", title: "Catalog Sync Successful", message: "42 products synchronized with POS terminals.", time: "Yesterday", unread: false }
  ];

  // CSV Import Validation Sample Data
  const CSV_SAMPLE_IMPORT_DATA = [
    { row: 1, name: "Handspun Cotton Tunic", sku: "HCT-001", category: "Kurtas & Tunics", price: "120", stock: "15", status: "Published", valid: true },
    { row: 2, name: "Kalamkari Printed Scarf", sku: "KPS-002", category: "Accessories", price: "45", stock: "30", status: "Published", valid: true },
    { row: 3, name: "Organza Tiered Blouse", sku: "LWD-IND", category: "Tops & Shirts", price: "140", stock: "10", status: "Draft", valid: false, error: "Duplicate master SKU 'LWD-IND' already assigned to Linen Wrap Midi Dress" },
    { row: 4, name: "Muslin Summer Pants", sku: "MSP-004", category: "Bottoms & Skirts", price: "-85", stock: "20", status: "Published", valid: false, error: "Price cannot be negative or zero (received -$85)" },
    { row: 5, name: "Zari Velvet Shawl", sku: "ZVS-005", category: "Outerwear & Jackets", price: "260", stock: "8", status: "Published", valid: true }
  ];

  // Module 16: Returns, Exchanges & Refunds Data
  const INITIAL_REQUESTS = [
    {
      id: "RET-26-089",
      createdAt: "2026-10-30T10:15:00",
      orderId: "ORD-24817",
      orderDate: "2026-10-25",
      channel: "Online Storefront",
      customer: {
        name: "Ananya Deshmukh",
        email: "ananya.deshmukh@gmail.com",
        phone: "+91 98201 44821",
        city: "Mumbai, Maharashtra",
        address: "Flat 402, Sea Green Apts, Perry Cross Rd, Bandra West, Mumbai 400050"
      },
      product: {
        id: "PROD-1002",
        name: "Chanderi Silk Angrakha Kurta",
        sku: "CSK-ECR-M",
        size: "M",
        color: "Natural Ecru",
        price: 225,
        rack: "Studio Rack A-04"
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
      paymentMethod: "Stripe (Visa •••• 4029)",
      paymentRef: "ch_3M49102941",
      refundAmount: 225,
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
      channel: "Online Storefront",
      customer: {
        name: "Priyadarshini Rao",
        email: "priyadarshini.rao@outlook.com",
        phone: "+91 97412 88319",
        city: "Bengaluru, Karnataka",
        address: "12/A, 4th Cross, Indiranagar 1st Stage, Bengaluru 560038"
      },
      product: {
        id: "PROD-1007",
        name: "Mulmul Anarkali Set with Kota Dupatta",
        sku: "MAK-GUL-M",
        size: "M",
        color: "Blush Gulab Pink",
        price: 245,
        rack: "Studio Rack A-08"
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
      paymentMethod: "Amex Card (•••• 8812)",
      paymentRef: "ch_AMEX_6619283",
      refundAmount: 245,
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
        id: "PROD-1004",
        name: "Bagru Print Cotton Tiered Midi Dress",
        sku: "BPC-OCH-L",
        size: "L",
        color: "Earth Ochre",
        price: 165,
        rack: "Warehouse Rack C-03"
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
      paymentMethod: "Apple Pay (Mastercard)",
      paymentRef: "ch_APAY_992144",
      refundAmount: 165,
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
          actor: "Admin (Store Manager)"
        }
      ]
    },
    {
      id: "RET-26-082",
      createdAt: "2026-10-27T11:05:00",
      orderId: "ORD-24694",
      orderDate: "2026-10-20",
      channel: "Online Storefront",
      customer: {
        name: "Radhika Varma",
        email: "radhika.varma@delhidesign.co",
        phone: "+91 98110 55420",
        city: "New Delhi, Delhi",
        address: "Villa 14, Anand Lok, August Kranti Marg, New Delhi 110049"
      },
      product: {
        id: "PROD-1013",
        name: "Maheshwari Tissue Silk Tunic",
        sku: "MST-SGE-S",
        size: "S",
        color: "Sage Green",
        price: 210,
        rack: "Studio Rack B-02"
      },
      type: "product_exchange",
      exchangeTarget: {
        productId: "PROD-1003",
        productName: "Ajrakh Modal Satin Saree",
        sku: "AMS-IND-FS",
        size: "Free Size",
        price: 280,
        priceDifference: 70, // Customer pays difference
        balanceAction: "collect"
      },
      reasonCategory: "Fabric Texture Dissatisfaction",
      customerReason: "The tissue silk has more crisp hand-feel than expected; would like to swap for the softer drape of the Ajrakh Modal Satin Saree. Happy to pay $70 difference.",
      photos: [],
      status: "received",
      qcStatus: "passed",
      paymentMethod: "Stripe (Visa •••• 9912)",
      paymentRef: "ch_ICICI_778192",
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
          note: "Approved by manager with invoice differential quote $70.",
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
      channel: "Online Storefront",
      customer: {
        name: "Meera Krishnan",
        email: "meera.krishnan@techlaw.in",
        phone: "+91 99890 12044",
        city: "Hyderabad, Telangana",
        address: "Road No. 36, Jubilee Hills, Near Peddamma Temple, Hyderabad 500033"
      },
      product: {
        id: "PROD-1002",
        name: "Chanderi Silk Angrakha Kurta",
        sku: "CSK-ECR-S",
        size: "S",
        color: "Natural Ecru",
        price: 225,
        rack: "Studio Rack A-04"
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
      paymentMethod: "Stripe (Mastercard •••• 1008)",
      paymentRef: "ch_99210084",
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
        id: "PROD-1005",
        name: "Kashmiri Aari Embroidered Velvet Jacket",
        sku: "KAV-PLM-L",
        size: "L",
        color: "Deep Wine Plum",
        price: 320,
        rack: "Studio Vault V-01"
      },
      type: "refund",
      exchangeTarget: null,
      reasonCategory: "Event Postponed / Changed Mind",
      customerReason: "The winter wedding was postponed to late February. Velvet jacket is unworn in pristine dust bag with garment tags attached.",
      photos: [],
      status: "refunded",
      qcStatus: "passed",
      paymentMethod: "Stripe (HDFC CC •••• 9102)",
      paymentRef: "ch_HDFC_8849102",
      refundAmount: 320,
      refundDetails: {
        amount: 320,
        method: "Original Payment Source (Stripe)",
        date: "2026-10-28",
        ref: "RFND-STRP-99410294",
        utr: "UTR20261028-STRP-991",
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
          note: "Refund of $320 executed. UTR #UTR20261028-STRP-991. Inventory restocked: +1 to KAV-PLM-L.",
          actor: "Admin (Finance Lead)"
        }
      ]
    },
    {
      id: "RET-26-071",
      createdAt: "2026-10-23T12:00:00",
      orderId: "ORD-24540",
      orderDate: "2026-10-10",
      channel: "Online Storefront",
      customer: {
        name: "Tanvi Malani",
        email: "tanvi.m@malanitrading.com",
        phone: "+91 98220 77190",
        city: "Pune, Maharashtra",
        address: "Row House 4, Koregaon Park North Main Rd, Pune 411001"
      },
      product: {
        id: "PROD-1004",
        name: "Bagru Print Cotton Tiered Midi Dress",
        sku: "BPC-OCH-M",
        size: "M",
        color: "Earth Ochre",
        price: 165,
        rack: "Warehouse Rack C-03"
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
      paymentMethod: "Apple Pay (Visa)",
      paymentRef: "ch_APAY_4491209",
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
      channel: "Online Storefront",
      customer: {
        name: "Devika Merchant",
        email: "devika.merchant@merchantsons.com",
        phone: "+91 98211 99014",
        city: "Mumbai, Maharashtra",
        address: "14 Altamount Road, Cumballa Hill, Mumbai 400026"
      },
      product: {
        id: "PROD-1003",
        name: "Ajrakh Modal Satin Saree",
        sku: "AMS-IND-FS",
        size: "Free Size",
        color: "Indigo & Madder Red",
        price: 280,
        rack: "Warehouse Rack B-01"
      },
      type: "refund",
      exchangeTarget: null,
      reasonCategory: "Fabric Texture Dissatisfaction",
      customerReason: "Preferred heavier pure tussar silk over modal satin for the festive pooja.",
      photos: [],
      status: "received",
      qcStatus: "passed",
      paymentMethod: "Stripe (Credit Card •••• 9102)",
      paymentRef: "ch_CC_889102",
      refundAmount: 280,
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
          id: "PROD-1002",
          name: "Chanderi Silk Angrakha Kurta",
          size: "M",
          color: "Natural Ecru",
          price: 225,
          sku: "CSK-ECR-M"
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
          id: "PROD-1007",
          name: "Mulmul Anarkali Set with Kota Dupatta",
          size: "S",
          color: "Blush Gulab Pink",
          price: 245,
          sku: "MAK-GUL-S"
        },
        {
          id: "PROD-1004",
          name: "Bagru Print Cotton Tiered Midi Dress",
          size: "M",
          color: "Earth Ochre",
          price: 165,
          sku: "BPC-OCH-M"
        }
      ]
    }
  ];

  return {
    CURRENCY_SYMBOL,
    CURRENCY_CODE,
    CATEGORIES,
    COLLECTIONS,
    STANDARD_SIZES,
    STANDARD_COLORS,
    INITIAL_PRODUCTS,
    SALES_TIMESERIES_60_DAYS,
    ORDERS_NEEDING_ACTION,
    INITIAL_ACTIVITY_LOG,
    NOTIFICATIONS,
    CSV_SAMPLE_IMPORT_DATA,
    INITIAL_REQUESTS,
    INITIAL_INVENTORY_LEDGER,
    REJECTION_TEMPLATES,
    CUSTOMER_SAMPLE_ORDERS
  };
}));
