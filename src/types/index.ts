export type ProductCategory = 
  | 'Longevity & Cellular' 
  | 'Recovery & Tissue' 
  | 'Cognitive & Neuro' 
  | 'Aesthetic & Botanical';

export interface ProductVariant {
  id: string;
  name: string;
  price: number;
  stock: number;
  sku: string;
}

export interface CoaReport {
  batchNumber: string;
  purityTested: number; // e.g. 99.4%
  testMethod: string; // HPLC & Mass Spectrometry
  testingDate: string;
  endotoxinLevel: string; // < 0.05 EU/mg
  labName: string;
  analyst: string;
  reportUrl?: string;
}

export interface Product {
  id: string;
  name: string;
  series: ProductCategory;
  description: string;
  benefits: string[];
  sequence: string;
  cas: string;
  molecularWeight: string;
  purity: number; // e.g. 99.2
  basePrice: number;
  stock: number;
  isVisible: boolean;
  imageUrl: string;
  driveFileId?: string;
  batchNumber: string;
  storageTemp: string;
  dosageGuide: string;
  reconstitutionGuide: string;
  variants: ProductVariant[];
  coaData: CoaReport;
  createdAt: string;
}

export interface CartItem {
  productId: string;
  variantId: string;
  name: string;
  variantName: string;
  price: number;
  quantity: number;
  imageUrl: string;
  sku: string;
}

export type OrderStatus = 'Pending' | 'Processing' | 'Shipped' | 'Delivered' | 'Cancelled';

export interface ShippingAddress {
  fullName: string;
  email: string;
  phone: string;
  street: string;
  aptSuite?: string;
  city: string;
  state: string;
  postalCode: string;
  country: string;
  deliveryNotes?: string;
}

export interface OrderItem {
  productId: string;
  variantId: string;
  productName: string;
  variantName: string;
  price: number;
  quantity: number;
  subtotal: number;
}

export interface EmailRecord {
  id: string;
  orderId: string;
  recipientEmail: string;
  templateKey: string;
  subject: string;
  sentAt: string;
  bodyPreview: string;
  status: 'Sent' | 'Failed';
}

export interface Order {
  id: string; // e.g. 'PL-2026-1042'
  customerName: string;
  email: string;
  phone: string;
  shippingAddress: ShippingAddress;
  items: OrderItem[];
  subtotal: number;
  discount: number;
  shippingFee: number;
  total: number;
  status: OrderStatus;
  paymentMethod: 'Card' | 'Wire/Zelle' | 'Crypto' | 'PO/Invoice';
  trackingNumber?: string;
  carrier?: string;
  orderNotes?: string;
  createdAt: string;
  updatedAt: string;
  emailHistory: EmailRecord[];
}

export interface AppsScriptConfig {
  webAppUrl: string;
  autoSync: boolean;
  lastSyncedAt?: string;
  statusMessage?: string;
  isConnected?: boolean;
}
