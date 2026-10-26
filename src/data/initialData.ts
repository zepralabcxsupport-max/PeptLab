import { Product, Order, AppsScriptConfig } from '../types';

export const INITIAL_PRODUCTS: Product[] = [
  {
    id: 'prod-bpc157',
    name: 'BPC-157 Pure Lyophilized Peptide',
    series: 'Recovery & Tissue',
    description: 'High-affinity pentadecapeptide derived from body protection compound proteins. Formulated through solid-phase peptide synthesis and validated via analytical reverse-phase HPLC.',
    benefits: [
      'Promotes cellular connective tissue regeneration',
      'Supports gut microbiome epithelial integrity',
      'Accelerates collagen tendon and ligament remodeling',
      'Enhanced stability in neutral pH formulations'
    ],
    sequence: 'Gly-Glu-Pro-Pro-Pro-Gly-Lys-Pro-Ala-Asp-Asp-Ala-Gly-Leu-Val',
    cas: '137525-51-0',
    molecularWeight: '1419.53 g/mol',
    purity: 99.4,
    basePrice: 58.00,
    stock: 45,
    isVisible: true,
    imageUrl: '/src/assets/images/product_peptide_vial_sage_1793001336509.jpg',
    batchNumber: 'PL-2026-BPC-889',
    storageTemp: '-20°C lyophilized / 2-8°C reconstituted',
    dosageGuide: 'Laboratory research titration standard 250mcg - 500mcg equivalent.',
    reconstitutionGuide: 'Add 2.0ml bacteriostatic water slowly along the vial wall. Gently swirl without violent agitation.',
    variants: [
      { id: 'v-bpc-5mg', name: '5mg Single Lyophilized Vial', price: 58.00, stock: 25, sku: 'PL-BPC-5M' },
      { id: 'v-bpc-10mg', name: '10mg High-Yield Vial', price: 92.00, stock: 15, sku: 'PL-BPC-10M' },
      { id: 'v-bpc-pack', name: 'Lab Pack (5x 10mg Vials + 30ml Bac Water)', price: 395.00, stock: 5, sku: 'PL-BPC-5X' },
    ],
    coaData: {
      batchNumber: 'PL-2026-BPC-889',
      purityTested: 99.42,
      testMethod: 'RP-HPLC & MALDI-TOF MS',
      testingDate: '2026-09-14',
      endotoxinLevel: '< 0.02 EU/mg (LAL Test)',
      labName: 'PharmaTech Analytical Laboratories, Zurich',
      analyst: 'Dr. Elena Vance, Senior Analytical Chemist',
      reportUrl: '#'
    },
    createdAt: '2026-09-15T08:00:00Z'
  },
  {
    id: 'prod-ghkcu',
    name: 'GHK-Cu Copper Tripeptide Complex',
    series: 'Aesthetic & Botanical',
    description: 'Bio-identical glycyl-L-histidyl-L-lysine chelated with divalent copper (Cu2+). Distinct deep sapphire blue solution known for regulating metalloproteinases and cellular renewal.',
    benefits: [
      'Stimulates collagen I, III and elastin synthesis',
      'Neutralizes lipid peroxidation and free radical stress',
      'Enhances dermal fibroblast proliferation',
      'Natural blue copper chelate with maximum bio-affinity'
    ],
    sequence: '[Gly-His-Lys]·Cu²⁺',
    cas: '49557-75-7',
    molecularWeight: '404.91 g/mol (free base: 340.38 g/mol)',
    purity: 99.6,
    basePrice: 64.00,
    stock: 38,
    isVisible: true,
    imageUrl: '/src/assets/images/product_peptide_ghk_copper_1793001337809.jpg',
    batchNumber: 'PL-2026-GHK-312',
    storageTemp: '2-8°C sealed away from direct photic exposure',
    dosageGuide: 'Formulation research grade, suitable for aqueous peptide matrixes.',
    reconstitutionGuide: 'Dissolve in sterile deionized water or bacteriostatic reconstitution media. Solution will turn bright sapphire blue.',
    variants: [
      { id: 'v-ghk-50mg', name: '50mg Pure Powder Vial', price: 64.00, stock: 20, sku: 'PL-GHK-50M' },
      { id: 'v-ghk-100mg', name: '100mg Extended Research Vial', price: 110.00, stock: 12, sku: 'PL-GHK-100M' },
      { id: 'v-ghk-serum', name: '1% Ready Aqueous Reconstituted Solution (10ml)', price: 84.00, stock: 6, sku: 'PL-GHK-SOL' },
    ],
    coaData: {
      batchNumber: 'PL-2026-GHK-312',
      purityTested: 99.65,
      testMethod: 'HPLC & ICP-MS Copper Quant',
      testingDate: '2026-09-22',
      endotoxinLevel: '< 0.01 EU/mg',
      labName: 'BioAnalytical Metrology Group, Cambridge',
      analyst: 'Marcus Sterling, PhD',
      reportUrl: '#'
    },
    createdAt: '2026-09-23T10:30:00Z'
  },
  {
    id: 'prod-nadplus',
    name: 'NAD+ Ultra-Pure Lyophilized Coenzyme',
    series: 'Longevity & Cellular',
    description: 'Nicotinamide Adenine Dinucleotide in crystalline stabilized form. Essential mitochondrial cofactor facilitating ATP bioenergetics and sirtuin longevity enzyme activation.',
    benefits: [
      'Direct co-substrate for PARP and SIRT1-SIRT7 enzymes',
      'Optimizes mitochondrial oxidative phosphorylation',
      'Replenishes declining cellular energy reservoirs',
      'Stabilized cold-chain lyophilization prevents hydrolysis'
    ],
    sequence: 'C21H27N7O14P2 (Coenzyme dinucleotide)',
    cas: '53-84-9',
    molecularWeight: '663.43 g/mol',
    purity: 99.1,
    basePrice: 85.00,
    stock: 29,
    isVisible: true,
    imageUrl: '/src/assets/images/product_peptide_longevity_vial_1793001338973.jpg',
    batchNumber: 'PL-2026-NAD-104',
    storageTemp: '-20°C strictly protected from humidity and warmth',
    dosageGuide: 'Investigational cellular biochemistry studies 100mg - 500mg.',
    reconstitutionGuide: 'Immediate reconstitution in ice-cold diluent before experimental measurement.',
    variants: [
      { id: 'v-nad-500mg', name: '500mg Ultra-Pure Lyophilized Vial', price: 85.00, stock: 18, sku: 'PL-NAD-500' },
      { id: 'v-nad-1000mg', name: '1000mg (1g) Institutional Batch', price: 148.00, stock: 8, sku: 'PL-NAD-1G' },
      { id: 'v-nad-kit', name: 'Cellular Vitality Research Kit (2x 500mg + Saline)', price: 165.00, stock: 3, sku: 'PL-NAD-KIT' },
    ],
    coaData: {
      batchNumber: 'PL-2026-NAD-104',
      purityTested: 99.18,
      testMethod: 'Ion-Pair HPLC & UV 260nm Spectrophotometry',
      testingDate: '2026-10-02',
      endotoxinLevel: '< 0.03 EU/mg',
      labName: 'Nordic Bioresearch Institute, Copenhagen',
      analyst: 'Ingrid Møller, MSc',
      reportUrl: '#'
    },
    createdAt: '2026-10-03T11:00:00Z'
  },
  {
    id: 'prod-semax',
    name: 'Semax Heptapeptide Botanical Matrix',
    series: 'Cognitive & Neuro',
    description: 'ACTH(4-10) synthetic analog combined with tripeptide Pro-Gly-Pro. Clinically researched for stimulating Brain-Derived Neurotrophic Factor (BDNF) and neuroprotection under hypoxia.',
    benefits: [
      'Upregulates BDNF and trkB mRNA in hippocampal structures',
      'Modulates dopamine and serotonin neuro-transmitters',
      'Demonstrates prolonged metabolic stability in serum',
      'Non-hormonal peptide fragment without endocrine suppression'
    ],
    sequence: 'Met-Glu-His-Phe-Pro-Gly-Pro',
    cas: '80714-61-0',
    molecularWeight: '813.92 g/mol',
    purity: 99.3,
    basePrice: 62.00,
    stock: 32,
    isVisible: true,
    imageUrl: '/src/assets/images/hero_peptlab_botanical_1793001336256.jpg',
    batchNumber: 'PL-2026-SMX-774',
    storageTemp: '-20°C lyophilized / 4°C in aqueous buffer',
    dosageGuide: 'Neuro-receptor binding affinity assays.',
    reconstitutionGuide: 'Add 3ml sterile bacteriostatic saline for 1% stock working concentration.',
    variants: [
      { id: 'v-smx-10mg', name: '10mg Standard Research Vial', price: 62.00, stock: 20, sku: 'PL-SMX-10M' },
      { id: 'v-smx-30mg', name: '30mg Extended Sequence Pack', price: 145.00, stock: 9, sku: 'PL-SMX-30M' },
      { id: 'v-smx-combo', name: 'Semax + Selank Dual Neuropeptide Suite', price: 185.00, stock: 3, sku: 'PL-SMX-SEL' },
    ],
    coaData: {
      batchNumber: 'PL-2026-SMX-774',
      purityTested: 99.35,
      testMethod: 'HPLC & High-Resolution Electrospray MS',
      testingDate: '2026-09-28',
      endotoxinLevel: '< 0.02 EU/mg',
      labName: 'PharmaTech Analytical Laboratories, Zurich',
      analyst: 'Dr. Elena Vance',
      reportUrl: '#'
    },
    createdAt: '2026-09-30T14:15:00Z'
  },
  {
    id: 'prod-tb500',
    name: 'TB-500 Synthetic Thymosin Beta-4 Fragment',
    series: 'Recovery & Tissue',
    description: 'Biomimetic peptide fragment (LKKTET) derived from natural human Thymosin Beta-4. Central to cellular actin sequestration, angiogenesis, and deep musculoskeletal recovery.',
    benefits: [
      'Regulates cellular G-actin monomer sequestering',
      'Facilitates micro-vascular endothelial migration',
      'Supports myoblast cellular proliferation in muscle tissue',
      'Synergistic interaction when paired with BPC-157'
    ],
    sequence: 'Ac-Ser-Asp-Lys-Pro-Asp-Met-Ala-Glu-Ile-Glu-Lys-Phe-Asp-Lys-Ser-Lys-Leu-Lys-Lys-Thr-Glu-Thr-Gln-Glu-Lys-Asn-Pro-Leu-Pro-Ser-Lys-Glu-Thr-Ile-Glu-Gln-Glu-Lys-Gln-Ala-Gly-Glu-Ser',
    cas: '77591-33-4',
    molecularWeight: '4963.5 g/mol',
    purity: 99.2,
    basePrice: 68.00,
    stock: 22,
    isVisible: true,
    imageUrl: '/src/assets/images/category_botanical_lab_1793001338723.jpg',
    batchNumber: 'PL-2026-TB-441',
    storageTemp: '-20°C lyophilized / keep shielded from light',
    dosageGuide: 'Tissue angiogenesis and wound healing assays.',
    reconstitutionGuide: 'Add 2ml sterile diluent, swirl gently. Never vortex.',
    variants: [
      { id: 'v-tb-5mg', name: '5mg Lyophilized Vial', price: 68.00, stock: 14, sku: 'PL-TB-5M' },
      { id: 'v-tb-10mg', name: '10mg High-Purity Vial', price: 115.00, stock: 8, sku: 'PL-TB-10M' },
    ],
    coaData: {
      batchNumber: 'PL-2026-TB-441',
      purityTested: 99.28,
      testMethod: 'Analytical RP-HPLC',
      testingDate: '2026-09-19',
      endotoxinLevel: '< 0.02 EU/mg',
      labName: 'BioAnalytical Metrology Group, Cambridge',
      analyst: 'Marcus Sterling, PhD',
      reportUrl: '#'
    },
    createdAt: '2026-09-20T09:40:00Z'
  },
  {
    id: 'prod-epithalon',
    name: 'Epithalon Telomerase Activator Tetra-Peptide',
    series: 'Longevity & Cellular',
    description: 'Synthetic pineal gland peptide Ala-Glu-Asp-Gly. Widely studied for pineal peptide signaling, telomerase elongation induction, and circadian endocrine normalization.',
    benefits: [
      'Induces telomerase elongation in somatic cells',
      'Normalizes natural melatonin synthesis rhythm',
      'Enhances antioxidant enzymatic protection (SOD)',
      'Extremely high thermal and solution stability'
    ],
    sequence: 'Ala-Glu-Asp-Gly',
    cas: '307297-39-8',
    molecularWeight: '390.35 g/mol',
    purity: 99.7,
    basePrice: 72.00,
    stock: 19,
    isVisible: true,
    imageUrl: '/src/assets/images/product_peptide_longevity_vial_1793001338973.jpg',
    batchNumber: 'PL-2026-EPI-092',
    storageTemp: '-20°C dry powder, desiccated',
    dosageGuide: 'Telomeric length and longevity cellular models.',
    reconstitutionGuide: 'Reconstitute in sterile water for injection.',
    variants: [
      { id: 'v-epi-10mg', name: '10mg Lyophilized Vial', price: 72.00, stock: 12, sku: 'PL-EPI-10M' },
      { id: 'v-epi-50mg', name: '50mg Multidose Lab Vial', price: 240.00, stock: 7, sku: 'PL-EPI-50M' },
    ],
    coaData: {
      batchNumber: 'PL-2026-EPI-092',
      purityTested: 99.71,
      testMethod: 'HPLC & Tandem Mass Spectrometry',
      testingDate: '2026-10-08',
      endotoxinLevel: '< 0.01 EU/mg',
      labName: 'Nordic Bioresearch Institute, Copenhagen',
      analyst: 'Ingrid Møller, MSc',
      reportUrl: '#'
    },
    createdAt: '2026-10-09T13:20:00Z'
  }
];

export const INITIAL_ORDERS: Order[] = [
  {
    id: 'PL-2026-1042',
    customerName: 'Dr. Alistair Finch',
    email: 'afinch@bio-regen.ox.ac.uk',
    phone: '+44 7700 900451',
    shippingAddress: {
      fullName: 'Dr. Alistair Finch',
      email: 'afinch@bio-regen.ox.ac.uk',
      phone: '+44 7700 900451',
      street: '14 St Giles, Dept of Physiology',
      aptSuite: 'Lab 3B',
      city: 'Oxford',
      state: 'Oxfordshire',
      postalCode: 'OX1 3PT',
      country: 'United Kingdom',
      deliveryNotes: 'Deliver to main laboratory reception, sign for cold chain cargo.'
    },
    items: [
      {
        productId: 'prod-bpc157',
        variantId: 'v-bpc-10mg',
        productName: 'BPC-157 Pure Lyophilized Peptide',
        variantName: '10mg High-Yield Vial',
        price: 92.00,
        quantity: 2,
        subtotal: 184.00
      },
      {
        productId: 'prod-ghkcu',
        variantId: 'v-ghk-50mg',
        productName: 'GHK-Cu Copper Tripeptide Complex',
        variantName: '50mg Pure Powder Vial',
        price: 64.00,
        quantity: 1,
        subtotal: 64.00
      }
    ],
    subtotal: 248.00,
    discount: 24.80,
    shippingFee: 0.00,
    total: 223.20,
    status: 'Pending',
    paymentMethod: 'Card',
    trackingNumber: '',
    carrier: 'FedEx Cold-Chain Priority',
    orderNotes: 'Pending initial lab batch allocation. Customer requested early shipping if available.',
    createdAt: '2026-10-25T14:32:00Z',
    updatedAt: '2026-10-25T14:32:00Z',
    emailHistory: [
      {
        id: 'em-101',
        orderId: 'PL-2026-1042',
        recipientEmail: 'afinch@bio-regen.ox.ac.uk',
        templateKey: 'order_confirmation',
        subject: 'Order #PL-2026-1042 Confirmed — PeptLab Botanical Precision',
        sentAt: '2026-10-25T14:32:15Z',
        bodyPreview: 'Thank you for your research order with PeptLab. Your allocation of BPC-157 and GHK-Cu has been reserved...',
        status: 'Sent'
      }
    ]
  },
  {
    id: 'PL-2026-1039',
    customerName: 'Sarah Lin, PhD',
    email: 'sarah.lin@vitalitylabs.ch',
    phone: '+41 22 555 0192',
    shippingAddress: {
      fullName: 'Sarah Lin, PhD',
      email: 'sarah.lin@vitalitylabs.ch',
      phone: '+41 22 555 0192',
      street: 'Rue du Rhône 42',
      aptSuite: 'Biochem Suite 5',
      city: 'Geneva',
      state: 'GE',
      postalCode: '1204',
      country: 'Switzerland',
      deliveryNotes: 'Keep temperature monitoring slip intact.'
    },
    items: [
      {
        productId: 'prod-nadplus',
        variantId: 'v-nad-kit',
        productName: 'NAD+ Ultra-Pure Lyophilized Coenzyme',
        variantName: 'Cellular Vitality Research Kit (2x 500mg + Saline)',
        price: 165.00,
        quantity: 1,
        subtotal: 165.00
      }
    ],
    subtotal: 165.00,
    discount: 0.00,
    shippingFee: 0.00,
    total: 165.00,
    status: 'Processing',
    paymentMethod: 'Wire/Zelle',
    trackingNumber: 'CH-FDX-99381022',
    carrier: 'Swiss Post Express Cold',
    orderNotes: 'Verified wire transfer, packaging in insulated thermal pod.',
    createdAt: '2026-10-24T09:12:00Z',
    updatedAt: '2026-10-24T11:45:00Z',
    emailHistory: [
      {
        id: 'em-102',
        orderId: 'PL-2026-1039',
        recipientEmail: 'sarah.lin@vitalitylabs.ch',
        templateKey: 'order_confirmation',
        subject: 'Order #PL-2026-1039 Confirmed — PeptLab Botanical Precision',
        sentAt: '2026-10-24T09:12:10Z',
        bodyPreview: 'Your order for the NAD+ Research Kit has been received and routed to our cleanroom team.',
        status: 'Sent'
      }
    ]
  },
  {
    id: 'PL-2026-1035',
    customerName: 'Julian Mercer',
    email: 'jmercer@novasoma.com',
    phone: '+1 415 892 4410',
    shippingAddress: {
      fullName: 'Julian Mercer',
      email: 'jmercer@novasoma.com',
      phone: '+1 415 892 4410',
      street: '750 Battery St',
      aptSuite: 'Floor 4',
      city: 'San Francisco',
      state: 'CA',
      postalCode: '94111',
      country: 'United States',
      deliveryNotes: 'Building has 24/7 front desk security.'
    },
    items: [
      {
        productId: 'prod-semax',
        variantId: 'v-smx-combo',
        productName: 'Semax Heptapeptide Botanical Matrix',
        variantName: 'Semax + Selank Dual Neuropeptide Suite',
        price: 185.00,
        quantity: 1,
        subtotal: 185.00
      },
      {
        productId: 'prod-bpc157',
        variantId: 'v-bpc-5mg',
        productName: 'BPC-157 Pure Lyophilized Peptide',
        variantName: '5mg Single Lyophilized Vial',
        price: 58.00,
        quantity: 2,
        subtotal: 116.00
      }
    ],
    subtotal: 301.00,
    discount: 30.10,
    shippingFee: 0.00,
    total: 270.90,
    status: 'Shipped',
    paymentMethod: 'Card',
    trackingNumber: '794611892041',
    carrier: 'FedEx ColdChain Priority',
    orderNotes: 'Dry ice packaging verified. Expected arrival Tuesday.',
    createdAt: '2026-10-23T16:04:00Z',
    updatedAt: '2026-10-24T08:30:00Z',
    emailHistory: [
      {
        id: 'em-103',
        orderId: 'PL-2026-1035',
        recipientEmail: 'jmercer@novasoma.com',
        templateKey: 'order_shipped',
        subject: 'Dispatched: Order #PL-2026-1035 is in Transit (FedEx 794611892041)',
        sentAt: '2026-10-24T08:31:00Z',
        bodyPreview: 'Your PeptLab order has departed our cold-chain facility with active dry-ice temperature monitoring.',
        status: 'Sent'
      }
    ]
  },
  {
    id: 'PL-2026-1028',
    customerName: 'Prof. Henrik Lindqvist',
    email: 'h.lindqvist@karolinska.se',
    phone: '+46 8 524 8000',
    shippingAddress: {
      fullName: 'Prof. Henrik Lindqvist',
      email: 'h.lindqvist@karolinska.se',
      phone: '+46 8 524 8000',
      street: 'Nobels väg 5',
      aptSuite: 'Biomedicum Room B04',
      city: 'Stockholm',
      state: 'Stockholm',
      postalCode: '171 77',
      country: 'Sweden'
    },
    items: [
      {
        productId: 'prod-epithalon',
        variantId: 'v-epi-50mg',
        productName: 'Epithalon Telomerase Activator Tetra-Peptide',
        variantName: '50mg Multidose Lab Vial',
        price: 240.00,
        quantity: 2,
        subtotal: 480.00
      }
    ],
    subtotal: 480.00,
    discount: 0.00,
    shippingFee: 0.00,
    total: 480.00,
    status: 'Delivered',
    paymentMethod: 'PO/Invoice',
    trackingNumber: 'SE-DHL-11099238',
    carrier: 'DHL Express Medical',
    orderNotes: 'Delivered and verified at Karolinska reception with cold pack intact.',
    createdAt: '2026-10-20T10:15:00Z',
    updatedAt: '2026-10-22T14:10:00Z',
    emailHistory: [
      {
        id: 'em-104',
        orderId: 'PL-2026-1028',
        recipientEmail: 'h.lindqvist@karolinska.se',
        templateKey: 'coa_report',
        subject: 'Batch Certificate of Analysis (COA) for Order #PL-2026-1028',
        sentAt: '2026-10-20T10:18:00Z',
        bodyPreview: 'Please find attached the official HPLC chromatogram and endotoxin report for Batch PL-2026-EPI-092.',
        status: 'Sent'
      }
    ]
  }
];

export const INITIAL_EMAIL_TEMPLATES = [
  {
    key: 'order_confirmation',
    title: 'Order Confirmation',
    subject: 'Order #{{orderId}} Confirmed — PeptLab Botanical Precision',
    content: `Dear {{customerName}},

Thank you for your order with PeptLab. We have received your order (#{{orderId}}) placed on {{orderDate}} and your high-purity peptide allocation has been confirmed.

Order Summary:
{{orderItems}}
Total: {{orderTotal}}

Shipping Address:
{{shippingAddress}}

Current Status: {{orderStatus}}
You can track and manage this order at any time using our online Order Lookup tool:
https://peptlab.store/lookup?id={{orderId}}

Best regards,
The PeptLab Quality & Fulfillment Team`
  },
  {
    key: 'order_shipped',
    title: 'Shipment Dispatched & Cold-Chain Tracking',
    subject: 'Dispatched: Order #{{orderId}} is in Transit ({{carrier}} {{trackingNumber}})',
    content: `Dear {{customerName}},

Great news — your PeptLab order #{{orderId}} has completed cleanroom inspection and is now in transit via {{carrier}}.

Tracking Reference: {{trackingNumber}}
Carrier: {{carrier}}

Cold-Chain Preservation Notice:
Your items have been sealed in insulated vacuum-barrier containers with thermal phase-change inserts to guarantee stability. Upon arrival, please store lyophilized vials at -20°C.

Track your package directly with the carrier or monitor live progress through our customer portal.

Warm regards,
PeptLab Logistics`
  },
  {
    key: 'order_address_updated',
    title: 'Customer Address Modification Confirmed',
    subject: 'Update Confirmed: Order #{{orderId}} Delivery Information',
    content: `Dear {{customerName}},

We have updated the shipping destination for your pending order #{{orderId}} as requested:

New Delivery Destination:
{{shippingAddress}}

If you have any further instructions before batch dispatch, please reply directly or visit your order management link.

Warm regards,
PeptLab Customer Support`
  },
  {
    key: 'coa_report',
    title: 'Certificate of Analysis (COA) Batch Report',
    subject: 'Certificate of Analysis (COA) for Order #{{orderId}}',
    content: `Dear {{customerName}},

As part of our commitment to botanical precision and pharmaceutical accountability, please review the analytical batch testing summary for your order #{{orderId}}.

Analytical Verification Highlights:
- Testing Methodology: High-Performance Liquid Chromatography (RP-HPLC) & High-Resolution MS
- Endotoxin Threshold: < 0.05 EU/mg (LAL Chromogenic Assay)
- Sterility & Heavy Metal Screening: Passed / Zero Detected Impurities

Thank you for relying on PeptLab for verified peptide compounds.

Best regards,
Dr. Elena Vance, Senior Analytical Chemist
PeptLab Analytical Services`
  },
  {
    key: 'order_cancelled',
    title: 'Order Cancellation & Refund Notice',
    subject: 'Notice: Cancellation for Order #{{orderId}}',
    content: `Dear {{customerName}},

This confirms that order #{{orderId}} has been cancelled in accordance with your request while in Pending status. 

Any authorized payment has been voided or credited to your original payment method. If this was done in error, please contact our support team.

Warm regards,
PeptLab Customer Operations`
  }
];

export const GOOGLE_APPS_SCRIPT_CODE = `/**
 * PeptLab - Google Apps Script Backend (Code.gs)
 * 
 * Instructions:
 * 1. Open Google Sheets (create a new sheet named "PeptLab Store Database").
 * 2. Create three tabs in your Sheet: "Products", "Orders", and "Logs".
 * 3. In the menu, go to Extensions -> Apps Script.
 * 4. Paste this entire code into Code.gs (replacing any default text).
 * 5. Click "Deploy" -> "New deployment".
 * 6. Select type: "Web app".
 * 7. Set "Execute as": "Me".
 * 8. Set "Who has access": "Anyone" (allows storefront and admin webhook calls).
 * 9. Click "Deploy", authorize permissions, and copy the Web App URL.
 * 10. Paste the Web App URL into PeptLab Admin -> Apps Script Settings.
 */

function doGet(e) {
  var action = (e && e.parameter && e.parameter.action) || 'getProducts';
  var ss = SpreadsheetApp.getActiveSpreadsheet();
  
  if (action === 'getProducts') {
    var sheet = getOrCreateSheet(ss, 'Products');
    var data = sheet.getDataRange().getValues();
    if (data.length <= 1) {
      return jsonResponse({ success: true, products: [] });
    }
    var headers = data[0];
    var products = [];
    for (var i = 1; i < data.length; i++) {
      var row = data[i];
      var prod = {};
      for (var h = 0; h < headers.length; h++) {
        prod[headers[h]] = row[h];
      }
      try {
        if (prod.variants && typeof prod.variants === 'string') prod.variants = JSON.parse(prod.variants);
        if (prod.benefits && typeof prod.benefits === 'string') prod.benefits = JSON.parse(prod.benefits);
        if (prod.coaData && typeof prod.coaData === 'string') prod.coaData = JSON.parse(prod.coaData);
      } catch (err) {}
      products.push(prod);
    }
    return jsonResponse({ success: true, products: products });
  }
  
  if (action === 'getOrders') {
    var sheet = getOrCreateSheet(ss, 'Orders');
    var data = sheet.getDataRange().getValues();
    if (data.length <= 1) {
      return jsonResponse({ success: true, orders: [] });
    }
    var headers = data[0];
    var orders = [];
    for (var i = 1; i < data.length; i++) {
      var row = data[i];
      var ord = {};
      for (var h = 0; h < headers.length; h++) {
        ord[headers[h]] = row[h];
      }
      try {
        if (ord.items && typeof ord.items === 'string') ord.items = JSON.parse(ord.items);
        if (ord.shippingAddress && typeof ord.shippingAddress === 'string') ord.shippingAddress = JSON.parse(ord.shippingAddress);
        if (ord.emailHistory && typeof ord.emailHistory === 'string') ord.emailHistory = JSON.parse(ord.emailHistory);
      } catch (err) {}
      orders.push(ord);
    }
    return jsonResponse({ success: true, orders: orders });
  }

  return jsonResponse({ success: true, message: "PeptLab Apps Script Backend is Live!" });
}

function doPost(e) {
  var ss = SpreadsheetApp.getActiveSpreadsheet();
  var postData = {};
  try {
    postData = JSON.parse(e.postData.contents);
  } catch (err) {
    return jsonResponse({ success: false, error: 'Invalid JSON payload' });
  }

  var action = postData.action;

  // 1. Submit New Order
  if (action === 'createOrder') {
    var order = postData.order;
    var sheet = getOrCreateSheet(ss, 'Orders');
    var headers = ['id', 'customerName', 'email', 'phone', 'total', 'status', 'paymentMethod', 'trackingNumber', 'carrier', 'createdAt', 'shippingAddress', 'items', 'orderNotes'];
    
    // Ensure header row exists
    if (sheet.getLastRow() === 0) {
      sheet.appendRow(headers);
    }

    var row = [
      order.id,
      order.customerName,
      order.email,
      order.phone,
      order.total,
      order.status || 'Pending',
      order.paymentMethod,
      order.trackingNumber || '',
      order.carrier || '',
      order.createdAt || new Date().toISOString(),
      JSON.stringify(order.shippingAddress || {}),
      JSON.stringify(order.items || []),
      order.orderNotes || ''
    ];
    sheet.appendRow(row);

    // Optional email notification to customer
    try {
      if (order.email) {
        MailApp.sendEmail({
          to: order.email,
          subject: 'Order Confirmation: #' + order.id + ' — PeptLab',
          body: 'Thank you for your order with PeptLab. Order ID: ' + order.id + '\\nTotal: $' + order.total + '\\nStatus: Pending fulfillment.'
        });
      }
    } catch (eMailErr) {
      Logger.log('Email delivery skipped: ' + eMailErr.message);
    }

    return jsonResponse({ success: true, orderId: order.id, message: 'Order recorded successfully' });
  }

  // 2. Update Existing Order Status or Address
  if (action === 'updateOrder') {
    var orderId = postData.orderId;
    var updates = postData.updates;
    var sheet = getOrCreateSheet(ss, 'Orders');
    var data = sheet.getDataRange().getValues();
    var headers = data[0];
    var idCol = headers.indexOf('id');

    for (var i = 1; i < data.length; i++) {
      if (data[i][idCol] == orderId) {
        if (updates.status !== undefined) {
          var statusCol = headers.indexOf('status');
          sheet.getRange(i + 1, statusCol + 1).setValue(updates.status);
        }
        if (updates.trackingNumber !== undefined) {
          var trackCol = headers.indexOf('trackingNumber');
          sheet.getRange(i + 1, trackCol + 1).setValue(updates.trackingNumber);
        }
        if (updates.carrier !== undefined) {
          var carrierCol = headers.indexOf('carrier');
          sheet.getRange(i + 1, carrierCol + 1).setValue(updates.carrier);
        }
        if (updates.shippingAddress !== undefined) {
          var addrCol = headers.indexOf('shippingAddress');
          sheet.getRange(i + 1, addrCol + 1).setValue(JSON.stringify(updates.shippingAddress));
        }
        return jsonResponse({ success: true, message: 'Order #' + orderId + ' updated' });
      }
    }
    return jsonResponse({ success: false, error: 'Order not found' });
  }

  // 3. Sync or Save Products
  if (action === 'syncProducts') {
    var products = postData.products;
    var sheet = getOrCreateSheet(ss, 'Products');
    sheet.clear();
    var headers = ['id', 'name', 'series', 'basePrice', 'stock', 'purity', 'cas', 'description', 'variants', 'imageUrl', 'isVisible'];
    sheet.appendRow(headers);

    for (var p = 0; p < products.length; p++) {
      var prod = products[p];
      sheet.appendRow([
        prod.id,
        prod.name,
        prod.series,
        prod.basePrice,
        prod.stock,
        prod.purity,
        prod.cas,
        prod.description,
        JSON.stringify(prod.variants || []),
        prod.imageUrl || '',
        prod.isVisible ? 'TRUE' : 'FALSE'
      ]);
    }
    return jsonResponse({ success: true, count: products.length, message: 'Products catalog synchronized' });
  }

  // 4. Send Customer Email via GmailApp / MailApp
  if (action === 'sendEmail') {
    var to = postData.to;
    var subject = postData.subject;
    var body = postData.body;
    try {
      MailApp.sendEmail({
        to: to,
        subject: subject,
        body: body
      });
      return jsonResponse({ success: true, message: 'Email sent successfully via Apps Script' });
    } catch (mailErr) {
      return jsonResponse({ success: false, error: mailErr.message });
    }
  }

  return jsonResponse({ success: false, error: 'Unknown action' });
}

function getOrCreateSheet(ss, name) {
  var sheet = ss.getSheetByName(name);
  if (!sheet) {
    sheet = ss.insertSheet(name);
  }
  return sheet;
}

function jsonResponse(data) {
  return ContentService.createTextOutput(JSON.stringify(data))
    .setMimeType(ContentService.MimeType.JSON);
}
`;
