import { Product, Order, CartItem, AppsScriptConfig, EmailRecord, OrderStatus, ShippingAddress } from '../types';
import { INITIAL_PRODUCTS, INITIAL_ORDERS } from '../data/initialData';

const STORAGE_KEYS = {
  PRODUCTS: 'peptlab_products_v1',
  ORDERS: 'peptlab_orders_v1',
  CART: 'peptlab_cart_v1',
  APPS_SCRIPT: 'peptlab_apps_script_config_v1',
  ADMIN_AUTH: 'peptlab_admin_auth_v1',
};

// --- Google Drive Image Parser Helper ---
export function formatProductImageUrl(rawUrl: string): string {
  if (!rawUrl) return '/src/assets/images/product_peptide_vial_sage_1793001336509.jpg';
  
  // Check if it's already a local asset or regular direct image URL
  if (rawUrl.startsWith('/src/') || rawUrl.startsWith('data:') || rawUrl.startsWith('blob:')) {
    return rawUrl;
  }

  // Parse Google Drive share URLs
  // Patterns: https://drive.google.com/file/d/1aBcDeFgHiJkLmNoP/view
  // or https://drive.google.com/open?id=1aBcDeFgHiJkLmNoP
  const driveFileRegex = /(?:drive\.google\.com\/(?:file\/d\/|open\?id=)|lh3\.googleusercontent\.com\/d\/)([a-zA-Z0-9_-]+)/;
  const match = rawUrl.match(driveFileRegex);
  
  if (match && match[1]) {
    const fileId = match[1];
    // High-resolution reliable Google Drive direct thumbnail embed
    return `https://lh3.googleusercontent.com/d/${fileId}=w800`;
  }

  return rawUrl;
}

// --- Storage Utilities ---

export function getStoredProducts(): Product[] {
  try {
    const saved = localStorage.getItem(STORAGE_KEYS.PRODUCTS);
    if (!saved) {
      localStorage.setItem(STORAGE_KEYS.PRODUCTS, JSON.stringify(INITIAL_PRODUCTS));
      return INITIAL_PRODUCTS;
    }
    return JSON.parse(saved);
  } catch (err) {
    console.error('Failed to read products from localStorage', err);
    return INITIAL_PRODUCTS;
  }
}

export function saveProducts(products: Product[]): void {
  try {
    localStorage.setItem(STORAGE_KEYS.PRODUCTS, JSON.stringify(products));
  } catch (err) {
    console.error('Failed to save products to localStorage', err);
  }
}

export function resetDefaultData(): { products: Product[]; orders: Order[] } {
  localStorage.setItem(STORAGE_KEYS.PRODUCTS, JSON.stringify(INITIAL_PRODUCTS));
  localStorage.setItem(STORAGE_KEYS.ORDERS, JSON.stringify(INITIAL_ORDERS));
  localStorage.removeItem(STORAGE_KEYS.CART);
  return { products: INITIAL_PRODUCTS, orders: INITIAL_ORDERS };
}

export function getStoredOrders(): Order[] {
  try {
    const saved = localStorage.getItem(STORAGE_KEYS.ORDERS);
    if (!saved) {
      localStorage.setItem(STORAGE_KEYS.ORDERS, JSON.stringify(INITIAL_ORDERS));
      return INITIAL_ORDERS;
    }
    return JSON.parse(saved);
  } catch (err) {
    console.error('Failed to read orders from localStorage', err);
    return INITIAL_ORDERS;
  }
}

export function saveOrders(orders: Order[]): void {
  try {
    localStorage.setItem(STORAGE_KEYS.ORDERS, JSON.stringify(orders));
  } catch (err) {
    console.error('Failed to save orders to localStorage', err);
  }
}

export function getStoredCart(): CartItem[] {
  try {
    const saved = localStorage.getItem(STORAGE_KEYS.CART);
    return saved ? JSON.parse(saved) : [];
  } catch {
    return [];
  }
}

export function saveCart(items: CartItem[]): void {
  try {
    localStorage.setItem(STORAGE_KEYS.CART, JSON.stringify(items));
  } catch (err) {
    console.error('Failed to save cart to localStorage', err);
  }
}

export function getStoredAppsScriptConfig(): AppsScriptConfig {
  try {
    const saved = localStorage.getItem(STORAGE_KEYS.APPS_SCRIPT);
    return saved ? JSON.parse(saved) : {
      webAppUrl: '',
      autoSync: false,
      isConnected: false
    };
  } catch {
    return { webAppUrl: '', autoSync: false, isConnected: false };
  }
}

export function saveAppsScriptConfig(config: AppsScriptConfig): void {
  try {
    localStorage.setItem(STORAGE_KEYS.APPS_SCRIPT, JSON.stringify(config));
  } catch (err) {
    console.error('Failed to save apps script config', err);
  }
}

// --- Apps Script Integration Calls ---

export async function submitOrderToAppsScript(order: Order, webAppUrl?: string): Promise<{ success: boolean; message: string }> {
  if (!webAppUrl) {
    return { success: true, message: 'Saved locally (Apps Script URL not configured)' };
  }

  try {
    const response = await fetch(webAppUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'text/plain;charset=utf-8' // avoids preflight CORS on Apps Script
      },
      body: JSON.stringify({
        action: 'createOrder',
        order: order
      })
    });

    if (response.ok) {
      return { success: true, message: 'Order submitted to Google Sheet successfully' };
    } else {
      return { success: false, message: `Apps Script returned HTTP ${response.status}` };
    }
  } catch (err: any) {
    console.warn('Apps Script submission error:', err);
    return { success: false, message: err?.message || 'Network error connecting to Apps Script' };
  }
}

export async function updateOrderInAppsScript(orderId: string, updates: Partial<Order>, webAppUrl?: string): Promise<{ success: boolean; message: string }> {
  if (!webAppUrl) {
    return { success: true, message: 'Updated locally' };
  }

  try {
    const response = await fetch(webAppUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'text/plain;charset=utf-8'
      },
      body: JSON.stringify({
        action: 'updateOrder',
        orderId,
        updates
      })
    });

    return { success: response.ok, message: response.ok ? 'Google Sheet synchronized' : 'Google Sheet update pending' };
  } catch (err: any) {
    return { success: false, message: err?.message || 'Sync error' };
  }
}

export async function sendEmailViaAppsScript(to: string, subject: string, body: string, webAppUrl?: string): Promise<{ success: boolean; message: string }> {
  if (!webAppUrl) {
    return { success: true, message: 'Dispatched via local simulation (Apps Script URL not configured)' };
  }

  try {
    const response = await fetch(webAppUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'text/plain;charset=utf-8'
      },
      body: JSON.stringify({
        action: 'sendEmail',
        to,
        subject,
        body
      })
    });

    return { success: response.ok, message: response.ok ? 'Email sent via GmailApp' : 'Apps Script email error' };
  } catch (err: any) {
    return { success: false, message: err?.message || 'Error sending email' };
  }
}

// --- CSV Export Helpers ---

export function downloadCsv(filename: string, csvContent: string): void {
  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
  const link = document.createElement('a');
  const url = URL.createObjectURL(blob);
  link.setAttribute('href', url);
  link.setAttribute('download', filename);
  link.style.visibility = 'hidden';
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
}

export function exportOrdersCsv(orders: Order[]): void {
  const headers = ['Order ID', 'Date', 'Customer Name', 'Email', 'Phone', 'Status', 'Payment Method', 'Carrier', 'Tracking Number', 'Items Count', 'Total ($)', 'Shipping Street', 'City', 'Country'];
  const rows = orders.map(o => [
    `"${o.id}"`,
    `"${new Date(o.createdAt).toLocaleString()}"`,
    `"${o.customerName.replace(/"/g, '""')}"`,
    `"${o.email}"`,
    `"${o.phone}"`,
    `"${o.status}"`,
    `"${o.paymentMethod}"`,
    `"${o.carrier || ''}"`,
    `"${o.trackingNumber || ''}"`,
    o.items.reduce((acc, i) => acc + i.quantity, 0),
    o.total.toFixed(2),
    `"${(o.shippingAddress?.street || '').replace(/"/g, '""')}"`,
    `"${o.shippingAddress?.city || ''}"`,
    `"${o.shippingAddress?.country || ''}"`
  ]);

  const csv = [headers.join(','), ...rows.map(r => r.join(','))].join('\n');
  downloadCsv(`peptlab-orders-${new Date().toISOString().slice(0, 10)}.csv`, csv);
}

export function exportProductsCsv(products: Product[]): void {
  const headers = ['Product ID', 'Name', 'Series', 'CAS', 'Purity (%)', 'Base Price ($)', 'Stock', 'Visibility', 'Batch Number', 'Storage'];
  const rows = products.map(p => [
    `"${p.id}"`,
    `"${p.name.replace(/"/g, '""')}"`,
    `"${p.series}"`,
    `"${p.cas}"`,
    p.purity,
    p.basePrice.toFixed(2),
    p.stock,
    p.isVisible ? 'Visible' : 'Hidden',
    `"${p.batchNumber}"`,
    `"${p.storageTemp}"`
  ]);

  const csv = [headers.join(','), ...rows.map(r => r.join(','))].join('\n');
  downloadCsv(`peptlab-products-${new Date().toISOString().slice(0, 10)}.csv`, csv);
}
