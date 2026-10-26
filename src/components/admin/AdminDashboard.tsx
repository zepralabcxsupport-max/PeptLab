import React, { useState, useMemo } from 'react';
import { Product, Order, OrderStatus, AppsScriptConfig, EmailRecord } from '../../types';
import { 
  Lock, Key, LogOut, ArrowLeft, RefreshCw, Download, Search, Filter, 
  Plus, Edit2, Trash2, Eye, EyeOff, CheckCircle, AlertTriangle, Send, 
  Copy, Check, FileSpreadsheet, ExternalLink, Mail, Package, DollarSign,
  TrendingUp, Clock, Truck, ChevronDown, Image as ImageIcon
} from 'lucide-react';
import { 
  exportOrdersCsv, 
  exportProductsCsv, 
  formatProductImageUrl,
  submitOrderToAppsScript,
  updateOrderInAppsScript,
  sendEmailViaAppsScript
} from '../../utils/storage';
import { GOOGLE_APPS_SCRIPT_CODE, INITIAL_EMAIL_TEMPLATES } from '../../data/initialData';

interface AdminDashboardProps {
  onClose: () => void;
  products: Product[];
  orders: Order[];
  onUpdateProduct: (product: Product) => void;
  onAddProduct: (product: Product) => void;
  onDeleteProduct: (productId: string) => void;
  onUpdateOrderStatus: (orderId: string, status: OrderStatus, trackingNumber?: string, carrier?: string) => Promise<void>;
  onUpdateOrderDetails: (orderId: string, updates: Partial<Order>) => Promise<void>;
  appsScriptConfig: AppsScriptConfig;
  onSaveAppsScriptConfig: (config: AppsScriptConfig) => void;
  onResetData: () => void;
}

export const AdminDashboard: React.FC<AdminDashboardProps> = ({
  onClose,
  products,
  orders,
  onUpdateProduct,
  onAddProduct,
  onDeleteProduct,
  onUpdateOrderStatus,
  onUpdateOrderDetails,
  appsScriptConfig,
  onSaveAppsScriptConfig,
  onResetData,
}) => {
  // Authentication State
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(() => {
    return sessionStorage.getItem('peptlab_admin_session') === 'true';
  });
  const [passwordInput, setPasswordInput] = useState('');
  const [loginError, setLoginError] = useState('');

  // Active Tab
  const [activeTab, setActiveTab] = useState<'overview' | 'orders' | 'catalog' | 'sales' | 'emails' | 'appsscript'>('overview');

  // Orders State & Filters
  const [orderSearch, setOrderSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('All');
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const [isEditingOrderModal, setIsEditingOrderModal] = useState(false);
  const [orderEditForm, setOrderEditForm] = useState<Partial<Order>>({});

  // Catalog State & Filters
  const [productSearch, setProductSearch] = useState('');
  const [seriesFilter, setSeriesFilter] = useState('All');
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [isAddingProduct, setIsAddingProduct] = useState(false);

  // Email Center State
  const [selectedTemplateKey, setSelectedTemplateKey] = useState<string>('order_confirmation');
  const [emailRecipient, setEmailRecipient] = useState<string>('');
  const [emailSubject, setEmailSubject] = useState<string>('');
  const [emailBody, setEmailBody] = useState<string>('');
  const [emailTargetOrderId, setEmailTargetOrderId] = useState<string>('');
  const [emailSentAlert, setEmailSentAlert] = useState<string>('');

  // Apps Script Settings State
  const [webAppUrlInput, setWebAppUrlInput] = useState(appsScriptConfig.webAppUrl || '');
  const [testStatus, setTestStatus] = useState<{ message: string; isSuccess: boolean } | null>(null);
  const [isCopiedCode, setIsCopiedCode] = useState(false);

  // --- Handlers for Login ---
  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (passwordInput === 'peptlab2026' || passwordInput === 'admin') {
      setIsAuthenticated(true);
      sessionStorage.setItem('peptlab_admin_session', 'true');
      setLoginError('');
    } else {
      setLoginError('Invalid password. Default demo password is "peptlab2026"');
    }
  };

  const handleLogout = () => {
    setIsAuthenticated(false);
    sessionStorage.removeItem('peptlab_admin_session');
  };

  // --- Analytics Calculations ---
  const analytics = useMemo(() => {
    const totalRev = orders
      .filter((o) => o.status !== 'Cancelled')
      .reduce((sum, o) => sum + o.total, 0);
    const countPending = orders.filter((o) => o.status === 'Pending').length;
    const countProcessing = orders.filter((o) => o.status === 'Processing').length;
    const countShipped = orders.filter((o) => o.status === 'Shipped').length;
    const countDelivered = orders.filter((o) => o.status === 'Delivered').length;
    const countCancelled = orders.filter((o) => o.status === 'Cancelled').length;
    const validOrders = orders.filter((o) => o.status !== 'Cancelled');
    const aov = validOrders.length > 0 ? totalRev / validOrders.length : 0;

    return {
      totalRev,
      totalOrders: orders.length,
      countPending,
      countProcessing,
      countShipped,
      countDelivered,
      countCancelled,
      aov,
    };
  }, [orders]);

  // --- Filtered Orders ---
  const filteredOrders = useMemo(() => {
    return orders
      .filter((o) => {
        if (statusFilter !== 'All' && o.status !== statusFilter) return false;
        if (orderSearch.trim()) {
          const q = orderSearch.toLowerCase();
          return (
            o.id.toLowerCase().includes(q) ||
            o.customerName.toLowerCase().includes(q) ||
            o.email.toLowerCase().includes(q) ||
            o.phone.includes(q) ||
            (o.trackingNumber && o.trackingNumber.toLowerCase().includes(q))
          );
        }
        return true;
      })
      .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
  }, [orders, statusFilter, orderSearch]);

  // --- Filtered Products ---
  const filteredProducts = useMemo(() => {
    return products.filter((p) => {
      if (seriesFilter !== 'All' && p.series !== seriesFilter) return false;
      if (productSearch.trim()) {
        const q = productSearch.toLowerCase();
        return p.name.toLowerCase().includes(q) || p.cas.toLowerCase().includes(q);
      }
      return true;
    });
  }, [products, seriesFilter, productSearch]);

  // --- Product Sales Totals ---
  const salesTotals = useMemo(() => {
    const map: Record<string, { product: Product; unitsSold: number; totalRevenue: number }> = {};
    products.forEach((p) => {
      map[p.id] = { product: p, unitsSold: 0, totalRevenue: 0 };
    });

    orders
      .filter((o) => o.status !== 'Cancelled')
      .forEach((o) => {
        o.items.forEach((item) => {
          if (map[item.productId]) {
            map[item.productId].unitsSold += item.quantity;
            map[item.productId].totalRevenue += item.subtotal;
          }
        });
      });

    return Object.values(map).sort((a, b) => b.totalRevenue - a.totalRevenue);
  }, [products, orders]);

  // --- Order Editing Modal Trigger ---
  const handleOpenEditOrder = (order: Order) => {
    setSelectedOrder(order);
    setOrderEditForm({
      status: order.status,
      carrier: order.carrier || '',
      trackingNumber: order.trackingNumber || '',
      orderNotes: order.orderNotes || '',
      shippingAddress: { ...order.shippingAddress }
    });
    setIsEditingOrderModal(true);
  };

  const handleSaveOrderEdits = async () => {
    if (!selectedOrder) return;
    try {
      await onUpdateOrderDetails(selectedOrder.id, orderEditForm);
      setIsEditingOrderModal(false);
      setSelectedOrder(null);
    } catch (err) {
      alert('Failed to save order updates');
    }
  };

  // --- Email Composer Setup ---
  const handleSelectTemplateForOrder = (order: Order, templateKey: string) => {
    const tmpl = INITIAL_EMAIL_TEMPLATES.find((t) => t.key === templateKey) || INITIAL_EMAIL_TEMPLATES[0];
    setSelectedTemplateKey(templateKey);
    setEmailTargetOrderId(order.id);
    setEmailRecipient(order.email);
    setEmailSubject(tmpl.subject.replace('{{orderId}}', order.id));
    
    const itemsSummary = order.items.map((i) => `· ${i.productName} (${i.variantName}) x${i.quantity} - $${i.subtotal.toFixed(2)}`).join('\n');
    const addressStr = `${order.shippingAddress.street}, ${order.shippingAddress.city}, ${order.shippingAddress.postalCode} ${order.shippingAddress.country}`;

    const bodyReplaced = tmpl.content
      .replace(/{{customerName}}/g, order.customerName)
      .replace(/{{orderId}}/g, order.id)
      .replace(/{{orderDate}}/g, new Date(order.createdAt).toLocaleDateString())
      .replace(/{{orderItems}}/g, itemsSummary)
      .replace(/{{orderTotal}}/g, `$${order.total.toFixed(2)}`)
      .replace(/{{shippingAddress}}/g, addressStr)
      .replace(/{{orderStatus}}/g, order.status)
      .replace(/{{carrier}}/g, order.carrier || 'FedEx ColdChain')
      .replace(/{{trackingNumber}}/g, order.trackingNumber || 'Pending Allocation');

    setEmailBody(bodyReplaced);
    setActiveTab('emails');
  };

  const handleSendEmail = async () => {
    if (!emailRecipient || !emailSubject || !emailBody) {
      alert('Please specify recipient, subject, and body.');
      return;
    }

    try {
      const res = await sendEmailViaAppsScript(emailRecipient, emailSubject, emailBody, appsScriptConfig.webAppUrl);
      setEmailSentAlert(`Success: ${res.message} to ${emailRecipient}`);
      setTimeout(() => setEmailSentAlert(''), 5000);
    } catch (err: any) {
      alert('Error sending email: ' + err.message);
    }
  };

  // --- Copy Script Helper ---
  const handleCopyCode = () => {
    navigator.clipboard.writeText(GOOGLE_APPS_SCRIPT_CODE);
    setIsCopiedCode(true);
    setTimeout(() => setIsCopiedCode(false), 2500);
  };

  // --- Save Apps Script URL ---
  const handleSaveAppsScript = () => {
    onSaveAppsScriptConfig({
      webAppUrl: webAppUrlInput.trim(),
      autoSync: true,
      isConnected: Boolean(webAppUrlInput.trim())
    });
    setTestStatus({
      message: 'Apps Script endpoint saved! Order and product operations will automatically relay to your spreadsheet.',
      isSuccess: true
    });
  };

  // ================= RENDER: LOGIN SCREEN =================
  if (!isAuthenticated) {
    return (
      <div className="fixed inset-0 z-50 bg-[#24372D]/90 backdrop-blur-sm flex items-center justify-center p-4">
        <div className="w-full max-w-md bg-[#F8F6F0] rounded-2xl border border-[#E9E2D5] p-8 shadow-2xl">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-full bg-[#344E41] flex items-center justify-center text-[#A3B18A]">
                <Lock className="w-4 h-4" />
              </div>
              <h3 className="font-editorial text-2xl font-bold text-[#344E41]">PeptLab Admin</h3>
            </div>
            <button
              onClick={onClose}
              className="text-xs text-[#575D56] hover:text-[#344E41] underline cursor-pointer"
            >
              Back to Storefront
            </button>
          </div>

          <p className="text-xs text-[#575D56] mb-6">
            Access catalog pricing, batch inventory, customer orders, and Google Apps Script spreadsheet synchronization.
          </p>

          <form onSubmit={handleLogin} className="space-y-4">
            <div>
              <label className="text-[11px] font-medium text-[#575D56] block mb-1">
                Admin Security Password:
              </label>
              <div className="relative">
                <input
                  type="password"
                  placeholder="Enter admin password..."
                  value={passwordInput}
                  onChange={(e) => setPasswordInput(e.target.value)}
                  className="w-full px-3 py-2 text-xs rounded-lg bg-[#F8F6F0] border border-[#E9E2D5] text-[#292D29] focus:outline-none focus:ring-1 focus:ring-[#344E41]"
                />
              </div>
              <p className="text-[11px] text-[#829267] mt-1.5">
                Default password: <code className="font-mono bg-[#E9E2D5] px-1 py-0.5 rounded text-[#344E41]">peptlab2026</code>
              </p>
            </div>

            {loginError && (
              <p className="text-xs text-[#C4866A]">{loginError}</p>
            )}

            <button
              type="submit"
              className="w-full py-2.5 px-4 rounded-lg bg-[#344E41] text-[#F8F6F0] text-xs font-medium hover:bg-[#24372D] transition-colors cursor-pointer"
            >
              Authenticate & Open Portal
            </button>
          </form>
        </div>
      </div>
    );
  }

  // ================= RENDER: MAIN ADMIN DASHBOARD =================
  return (
    <div className="fixed inset-0 z-50 bg-[#F8F6F0] overflow-y-auto flex flex-col">
      
      {/* Admin Top Navigation */}
      <header className="bg-[#24372D] text-[#F8F6F0] border-b border-[#344E41] sticky top-0 z-30">
        <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <button
              onClick={onClose}
              className="p-1.5 rounded-md hover:bg-[#344E41] text-[#E9E2D5] hover:text-white transition-colors cursor-pointer"
              title="Return to Storefront"
            >
              <ArrowLeft className="w-4 h-4" />
            </button>
            <div className="flex items-center gap-2">
              <span className="font-editorial text-2xl font-bold tracking-tight text-white">PeptLab</span>
              <span className="text-[11px] font-mono uppercase bg-[#344E41] text-[#A3B18A] px-2 py-0.5 rounded">
                Admin Console
              </span>
            </div>
          </div>

          {/* Quick Tabs */}
          <div className="hidden lg:flex items-center gap-1">
            {[
              { id: 'overview', label: 'Overview' },
              { id: 'orders', label: `Orders (${orders.length})` },
              { id: 'catalog', label: `Products (${products.length})` },
              { id: 'sales', label: 'Sales Totals' },
              { id: 'emails', label: 'Email Center' },
              { id: 'appsscript', label: 'Apps Script & Sheets' },
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                className={`px-3 py-1.5 text-xs font-medium rounded-md transition-colors cursor-pointer ${
                  activeTab === tab.id
                    ? 'bg-[#344E41] text-[#A3B18A] font-semibold'
                    : 'text-[#E9E2D5]/70 hover:text-white hover:bg-[#344E41]/50'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>

          {/* Right Actions */}
          <div className="flex items-center gap-3">
            <button
              onClick={handleLogout}
              className="px-3 py-1.5 rounded-md bg-[#344E41] hover:bg-[#C4866A]/20 hover:text-[#C4866A] text-xs font-medium text-[#E9E2D5] transition-colors flex items-center gap-1.5 cursor-pointer"
            >
              <LogOut className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Sign Out</span>
            </button>
          </div>
        </div>

        {/* Mobile Tab Selector */}
        <div className="lg:hidden px-6 py-2 bg-[#1C2C24] flex overflow-x-auto gap-2">
          {[
            { id: 'overview', label: 'Overview' },
            { id: 'orders', label: 'Orders' },
            { id: 'catalog', label: 'Products' },
            { id: 'sales', label: 'Sales' },
            { id: 'emails', label: 'Emails' },
            { id: 'appsscript', label: 'Apps Script' },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`px-2.5 py-1 text-xs whitespace-nowrap rounded ${
                activeTab === tab.id ? 'bg-[#344E41] text-[#A3B18A]' : 'text-white/70'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </header>

      {/* Main Admin View Container */}
      <main className="flex-1 max-w-7xl mx-auto w-full px-6 py-8">
        
        {/* ================= TAB 1: OVERVIEW ================= */}
        {activeTab === 'overview' && (
          <div className="space-y-8">
            
            {/* Header / Sync Banner */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <h2 className="font-editorial text-3xl font-bold text-[#344E41]">
                  Laboratory Operations Overview
                </h2>
                <p className="text-xs text-[#575D56] mt-0.5">
                  Real-time metrics, order throughput, and batch allocation.
                </p>
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={() => exportOrdersCsv(orders)}
                  className="px-3 py-2 rounded-lg border border-[#E9E2D5] bg-[#F8F6F0] text-xs font-medium text-[#344E41] hover:bg-[#E9E2D5] flex items-center gap-1.5 cursor-pointer"
                >
                  <Download className="w-3.5 h-3.5" />
                  <span>Export Orders CSV</span>
                </button>
                <button
                  onClick={() => exportProductsCsv(products)}
                  className="px-3 py-2 rounded-lg border border-[#E9E2D5] bg-[#F8F6F0] text-xs font-medium text-[#344E41] hover:bg-[#E9E2D5] flex items-center gap-1.5 cursor-pointer"
                >
                  <Download className="w-3.5 h-3.5" />
                  <span>Export Catalog CSV</span>
                </button>
              </div>
            </div>

            {/* KPI Cards Strip */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="bg-[#F8F6F0] p-5 rounded-xl border border-[#E9E2D5]">
                <span className="text-xs text-[#829267] font-medium block">Total Revenue</span>
                <span className="font-editorial text-3xl font-bold text-[#344E41] tabular-nums mt-1 block">
                  ${analytics.totalRev.toFixed(2)}
                </span>
                <span className="text-[11px] text-[#575D56]">From {orders.length} requisitions</span>
              </div>

              <div className="bg-[#F8F6F0] p-5 rounded-xl border border-[#E9E2D5]">
                <span className="text-xs text-[#829267] font-medium block">Pending Allocation</span>
                <span className="font-editorial text-3xl font-bold text-[#C4866A] tabular-nums mt-1 block">
                  {analytics.countPending}
                </span>
                <span className="text-[11px] text-[#575D56]">Awaiting cleanroom batch prep</span>
              </div>

              <div className="bg-[#F8F6F0] p-5 rounded-xl border border-[#E9E2D5]">
                <span className="text-xs text-[#829267] font-medium block">In Transit / Shipped</span>
                <span className="font-editorial text-3xl font-bold text-[#344E41] tabular-nums mt-1 block">
                  {analytics.countShipped}
                </span>
                <span className="text-[11px] text-[#575D56]">Active cold-chain shipments</span>
              </div>

              <div className="bg-[#F8F6F0] p-5 rounded-xl border border-[#E9E2D5]">
                <span className="text-xs text-[#829267] font-medium block">Average Order Value</span>
                <span className="font-editorial text-3xl font-bold text-[#344E41] tabular-nums mt-1 block">
                  ${analytics.aov.toFixed(2)}
                </span>
                <span className="text-[11px] text-[#575D56]">Verified customer orders</span>
              </div>
            </div>

            {/* Status Breakdown Bar */}
            <div className="bg-[#E9E2D5]/35 p-5 rounded-xl border border-[#E9E2D5]">
              <h4 className="text-xs font-semibold uppercase tracking-wider text-[#344E41] mb-3">
                Order Status Distribution
              </h4>
              <div className="grid grid-cols-2 sm:grid-cols-5 gap-3 text-xs">
                <div className="bg-[#F8F6F0] p-3 rounded-lg border border-[#E9E2D5]">
                  <span className="text-[#829267]">Pending</span>
                  <div className="font-mono text-lg font-bold text-[#344E41] tabular-nums mt-0.5">
                    {analytics.countPending}
                  </div>
                </div>
                <div className="bg-[#F8F6F0] p-3 rounded-lg border border-[#E9E2D5]">
                  <span className="text-[#829267]">Processing</span>
                  <div className="font-mono text-lg font-bold text-[#344E41] tabular-nums mt-0.5">
                    {analytics.countProcessing}
                  </div>
                </div>
                <div className="bg-[#F8F6F0] p-3 rounded-lg border border-[#E9E2D5]">
                  <span className="text-[#829267]">Shipped</span>
                  <div className="font-mono text-lg font-bold text-[#344E41] tabular-nums mt-0.5">
                    {analytics.countShipped}
                  </div>
                </div>
                <div className="bg-[#F8F6F0] p-3 rounded-lg border border-[#E9E2D5]">
                  <span className="text-[#829267]">Delivered</span>
                  <div className="font-mono text-lg font-bold text-[#344E41] tabular-nums mt-0.5">
                    {analytics.countDelivered}
                  </div>
                </div>
                <div className="bg-[#F8F6F0] p-3 rounded-lg border border-[#E9E2D5]">
                  <span className="text-[#829267]">Cancelled</span>
                  <div className="font-mono text-lg font-bold text-[#C4866A] tabular-nums mt-0.5">
                    {analytics.countCancelled}
                  </div>
                </div>
              </div>
            </div>

            {/* Recent Orders Preview */}
            <div className="bg-[#F8F6F0] rounded-xl border border-[#E9E2D5] overflow-hidden">
              <div className="p-4 border-b border-[#E9E2D5] flex items-center justify-between">
                <h4 className="font-editorial text-xl font-bold text-[#344E41]">
                  Recent Requisitions
                </h4>
                <button
                  onClick={() => setActiveTab('orders')}
                  className="text-xs font-medium text-[#344E41] hover:underline"
                >
                  View All Orders →
                </button>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs">
                  <thead className="bg-[#E9E2D5]/40 text-[#575D56] border-b border-[#E9E2D5]">
                    <tr>
                      <th className="py-2.5 px-4 font-semibold">Order ID</th>
                      <th className="py-2.5 px-4 font-semibold">Customer</th>
                      <th className="py-2.5 px-4 font-semibold">Date</th>
                      <th className="py-2.5 px-4 font-semibold">Items</th>
                      <th className="py-2.5 px-4 font-semibold">Status</th>
                      <th className="py-2.5 px-4 font-semibold text-right">Total</th>
                      <th className="py-2.5 px-4 font-semibold text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-[#E9E2D5]">
                    {orders.slice(0, 5).map((order) => (
                      <tr key={order.id} className="hover:bg-[#E9E2D5]/20">
                        <td className="py-3 px-4 font-mono font-medium text-[#344E41]">{order.id}</td>
                        <td className="py-3 px-4">
                          <div className="font-medium text-[#292D29]">{order.customerName}</div>
                          <div className="text-[11px] text-[#829267]">{order.email}</div>
                        </td>
                        <td className="py-3 px-4 text-[#575D56]">{new Date(order.createdAt).toLocaleDateString()}</td>
                        <td className="py-3 px-4 text-[#575D56]">{order.items.length} items</td>
                        <td className="py-3 px-4">
                          <span className={`px-2 py-0.5 rounded text-[11px] font-semibold ${
                            order.status === 'Pending' ? 'bg-[#C4866A]/20 text-[#C4866A]' :
                            order.status === 'Processing' ? 'bg-[#A3B18A]/20 text-[#344E41]' :
                            order.status === 'Shipped' ? 'bg-[#344E41] text-white' :
                            order.status === 'Delivered' ? 'bg-[#829267]/30 text-[#344E41]' :
                            'bg-neutral-200 text-neutral-600'
                          }`}>
                            {order.status}
                          </span>
                        </td>
                        <td className="py-3 px-4 text-right font-mono font-semibold text-[#344E41] tabular-nums">
                          ${order.total.toFixed(2)}
                        </td>
                        <td className="py-3 px-4 text-right">
                          <button
                            onClick={() => handleOpenEditOrder(order)}
                            className="px-2.5 py-1 text-xs font-medium text-[#344E41] hover:bg-[#E9E2D5] rounded"
                          >
                            Manage
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

          </div>
        )}

        {/* ================= TAB 2: ORDERS MANAGEMENT ================= */}
        {activeTab === 'orders' && (
          <div className="space-y-6">
            
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <h2 className="font-editorial text-3xl font-bold text-[#344E41]">Order Dashboard</h2>
                <p className="text-xs text-[#575D56]">Search, filter, update statuses, assign tracking, and message consignees.</p>
              </div>
              <button
                onClick={() => exportOrdersCsv(orders)}
                className="px-3 py-2 rounded-lg bg-[#344E41] text-[#F8F6F0] text-xs font-medium hover:bg-[#24372D] flex items-center gap-1.5 self-start cursor-pointer"
              >
                <Download className="w-3.5 h-3.5" />
                <span>Export to CSV</span>
              </button>
            </div>

            {/* Filter & Search Controls */}
            <div className="bg-[#E9E2D5]/40 p-4 rounded-xl border border-[#E9E2D5] flex flex-col md:flex-row gap-4 items-stretch md:items-center justify-between">
              <div className="flex flex-wrap items-center gap-1.5">
                {['All', 'Pending', 'Processing', 'Shipped', 'Delivered', 'Cancelled'].map((st) => (
                  <button
                    key={st}
                    onClick={() => setStatusFilter(st)}
                    className={`px-3 py-1.5 text-xs font-medium rounded-md transition-colors cursor-pointer ${
                      statusFilter === st
                        ? 'bg-[#344E41] text-[#F8F6F0]'
                        : 'bg-[#F8F6F0] text-[#575D56] hover:bg-[#E9E2D5]'
                    }`}
                  >
                    {st}
                  </button>
                ))}
              </div>

              <div className="relative w-full md:w-72">
                <Search className="w-4 h-4 text-[#829267] absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
                <input
                  type="text"
                  placeholder="Search by ID, name, email, tracking..."
                  value={orderSearch}
                  onChange={(e) => setOrderSearch(e.target.value)}
                  className="w-full pl-9 pr-3 py-2 text-xs rounded-lg bg-[#F8F6F0] border border-[#E9E2D5] text-[#292D29] focus:outline-none focus:ring-1 focus:ring-[#344E41]"
                />
              </div>
            </div>

            {/* Orders Table */}
            <div className="bg-[#F8F6F0] rounded-xl border border-[#E9E2D5] overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs">
                  <thead className="bg-[#E9E2D5]/50 text-[#575D56] border-b border-[#E9E2D5]">
                    <tr>
                      <th className="py-3 px-4 font-semibold">Order Reference</th>
                      <th className="py-3 px-4 font-semibold">Consignee</th>
                      <th className="py-3 px-4 font-semibold">Status</th>
                      <th className="py-3 px-4 font-semibold">Cold-Chain Tracking</th>
                      <th className="py-3 px-4 font-semibold">Payment</th>
                      <th className="py-3 px-4 font-semibold text-right">Total</th>
                      <th className="py-3 px-4 font-semibold text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-[#E9E2D5]">
                    {filteredOrders.length === 0 ? (
                      <tr>
                        <td colSpan={7} className="text-center py-12 text-[#575D56]">
                          No orders found matching the filter.
                        </td>
                      </tr>
                    ) : (
                      filteredOrders.map((order) => (
                        <tr key={order.id} className="hover:bg-[#E9E2D5]/20">
                          <td className="py-3 px-4 font-mono font-bold text-[#344E41]">
                            {order.id}
                            <div className="text-[10px] text-[#829267] font-sans font-normal">
                              {new Date(order.createdAt).toLocaleString()}
                            </div>
                          </td>
                          <td className="py-3 px-4">
                            <div className="font-semibold text-[#292D29]">{order.customerName}</div>
                            <div className="text-[11px] text-[#575D56]">{order.email} · {order.phone}</div>
                          </td>
                          <td className="py-3 px-4">
                            <select
                              value={order.status}
                              onChange={(e) => onUpdateOrderStatus(order.id, e.target.value as OrderStatus)}
                              className="px-2 py-1 rounded bg-[#F8F6F0] border border-[#E9E2D5] text-xs font-medium text-[#344E41] focus:ring-1 focus:ring-[#344E41]"
                            >
                              <option value="Pending">Pending</option>
                              <option value="Processing">Processing</option>
                              <option value="Shipped">Shipped</option>
                              <option value="Delivered">Delivered</option>
                              <option value="Cancelled">Cancelled</option>
                            </select>
                          </td>
                          <td className="py-3 px-4">
                            {order.trackingNumber ? (
                              <div>
                                <span className="font-mono text-xs text-[#344E41]">{order.trackingNumber}</span>
                                <div className="text-[10px] text-[#829267]">{order.carrier}</div>
                              </div>
                            ) : (
                              <span className="text-[#829267] italic text-[11px]">Unassigned</span>
                            )}
                          </td>
                          <td className="py-3 px-4 text-[#575D56]">
                            {order.paymentMethod}
                          </td>
                          <td className="py-3 px-4 text-right font-mono font-bold text-[#344E41] tabular-nums">
                            ${order.total.toFixed(2)}
                          </td>
                          <td className="py-3 px-4 text-right space-x-1">
                            <button
                              onClick={() => handleOpenEditOrder(order)}
                              className="px-2.5 py-1 text-xs rounded bg-[#E9E2D5] text-[#344E41] hover:bg-[#D8CEBD]"
                            >
                              Edit
                            </button>
                            <button
                              onClick={() => handleSelectTemplateForOrder(order, 'order_shipped')}
                              title="Send Email"
                              className="px-2 py-1 text-xs rounded bg-[#344E41] text-white hover:bg-[#24372D]"
                            >
                              <Mail className="w-3.5 h-3.5 inline" />
                            </button>
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>
            </div>

          </div>
        )}

        {/* ================= TAB 3: PRODUCT CATALOG MANAGER ================= */}
        {activeTab === 'catalog' && (
          <div className="space-y-6">
            
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <h2 className="font-editorial text-3xl font-bold text-[#344E41]">Catalog Management</h2>
                <p className="text-xs text-[#575D56]">Add, edit, adjust prices, manage stock, and toggle visibility for peptides.</p>
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={() => setIsAddingProduct(true)}
                  className="px-3.5 py-2 rounded-lg bg-[#344E41] text-[#F8F6F0] text-xs font-medium hover:bg-[#24372D] flex items-center gap-1.5 cursor-pointer"
                >
                  <Plus className="w-4 h-4 text-[#A3B18A]" />
                  <span>Add New Peptide</span>
                </button>
                <button
                  onClick={() => exportProductsCsv(products)}
                  className="px-3 py-2 rounded-lg border border-[#E9E2D5] bg-[#F8F6F0] text-xs font-medium text-[#344E41] hover:bg-[#E9E2D5] flex items-center gap-1.5 cursor-pointer"
                >
                  <Download className="w-3.5 h-3.5" />
                  <span>Export CSV</span>
                </button>
              </div>
            </div>

            {/* Filter and Search */}
            <div className="bg-[#E9E2D5]/40 p-4 rounded-xl border border-[#E9E2D5] flex flex-col md:flex-row gap-4 items-stretch md:items-center justify-between">
              <div className="flex flex-wrap items-center gap-1.5">
                {['All', 'Longevity & Cellular', 'Recovery & Tissue', 'Cognitive & Neuro', 'Aesthetic & Botanical'].map((s) => (
                  <button
                    key={s}
                    onClick={() => setSeriesFilter(s)}
                    className={`px-3 py-1.5 text-xs font-medium rounded-md transition-colors cursor-pointer ${
                      seriesFilter === s ? 'bg-[#344E41] text-[#F8F6F0]' : 'bg-[#F8F6F0] text-[#575D56] hover:bg-[#E9E2D5]'
                    }`}
                  >
                    {s}
                  </button>
                ))}
              </div>

              <div className="relative w-full md:w-64">
                <Search className="w-4 h-4 text-[#829267] absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
                <input
                  type="text"
                  placeholder="Filter peptides..."
                  value={productSearch}
                  onChange={(e) => setProductSearch(e.target.value)}
                  className="w-full pl-9 pr-3 py-2 text-xs rounded-lg bg-[#F8F6F0] border border-[#E9E2D5] text-[#292D29] focus:outline-none focus:ring-1 focus:ring-[#344E41]"
                />
              </div>
            </div>

            {/* Product Table */}
            <div className="bg-[#F8F6F0] rounded-xl border border-[#E9E2D5] overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs">
                  <thead className="bg-[#E9E2D5]/50 text-[#575D56] border-b border-[#E9E2D5]">
                    <tr>
                      <th className="py-3 px-4 font-semibold">Peptide Compound</th>
                      <th className="py-3 px-4 font-semibold">Series</th>
                      <th className="py-3 px-4 font-semibold">CAS #</th>
                      <th className="py-3 px-4 font-semibold">Purity</th>
                      <th className="py-3 px-4 font-semibold">Stock</th>
                      <th className="py-3 px-4 font-semibold">Base Price</th>
                      <th className="py-3 px-4 font-semibold">Status</th>
                      <th className="py-3 px-4 font-semibold text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-[#E9E2D5]">
                    {filteredProducts.map((prod) => (
                      <tr key={prod.id} className="hover:bg-[#E9E2D5]/20">
                        <td className="py-3 px-4">
                          <div className="flex items-center gap-3">
                            <div className="w-10 h-10 rounded-md bg-[#E9E2D5] overflow-hidden shrink-0 border border-[#E9E2D5]">
                              <img
                                src={formatProductImageUrl(prod.imageUrl)}
                                alt={prod.name}
                                className="w-full h-full object-cover"
                                referrerPolicy="no-referrer"
                              />
                            </div>
                            <div>
                              <div className="font-bold text-[#344E41]">{prod.name}</div>
                              <div className="text-[10px] text-[#829267] font-mono">Lot: {prod.batchNumber}</div>
                            </div>
                          </div>
                        </td>
                        <td className="py-3 px-4 text-[#575D56]">{prod.series}</td>
                        <td className="py-3 px-4 font-mono text-[#575D56]">{prod.cas}</td>
                        <td className="py-3 px-4 font-mono text-[#344E41] font-semibold">{prod.purity}%</td>
                        <td className="py-3 px-4">
                          <span className={`font-mono font-medium ${prod.stock < 10 ? 'text-[#C4866A]' : 'text-[#344E41]'}`}>
                            {prod.stock} units
                          </span>
                        </td>
                        <td className="py-3 px-4 font-mono font-bold text-[#344E41] tabular-nums">
                          ${prod.basePrice.toFixed(2)}
                        </td>
                        <td className="py-3 px-4">
                          <button
                            onClick={() => onUpdateProduct({ ...prod, isVisible: !prod.isVisible })}
                            className={`px-2 py-0.5 rounded text-[11px] font-medium flex items-center gap-1 cursor-pointer ${
                              prod.isVisible ? 'bg-[#A3B18A]/30 text-[#344E41]' : 'bg-neutral-200 text-neutral-600'
                            }`}
                          >
                            {prod.isVisible ? <Eye className="w-3 h-3" /> : <EyeOff className="w-3 h-3" />}
                            <span>{prod.isVisible ? 'Visible' : 'Hidden'}</span>
                          </button>
                        </td>
                        <td className="py-3 px-4 text-right space-x-1">
                          <button
                            onClick={() => setEditingProduct(prod)}
                            className="px-2.5 py-1 text-xs rounded bg-[#E9E2D5] text-[#344E41] hover:bg-[#D8CEBD]"
                          >
                            Edit
                          </button>
                          <button
                            onClick={() => {
                              if (confirm(`Remove ${prod.name} from catalog?`)) {
                                onDeleteProduct(prod.id);
                              }
                            }}
                            className="px-2 py-1 text-xs rounded bg-[#C4866A]/20 text-[#C4866A] hover:bg-[#C4866A]/30"
                          >
                            <Trash2 className="w-3.5 h-3.5 inline" />
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

          </div>
        )}

        {/* ================= TAB 4: PRODUCT SALES TOTALS ================= */}
        {activeTab === 'sales' && (
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="font-editorial text-3xl font-bold text-[#344E41]">Product Sales Totals</h2>
                <p className="text-xs text-[#575D56]">Aggregated demand, units requisitioned, and revenue per peptide.</p>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {salesTotals.map(({ product, unitsSold, totalRevenue }) => (
                <div key={product.id} className="bg-[#F8F6F0] p-5 rounded-xl border border-[#E9E2D5] flex flex-col justify-between">
                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-xs text-[#829267] font-medium">{product.series}</span>
                      <span className={`text-[11px] font-mono px-2 py-0.5 rounded ${
                        product.stock < 10 ? 'bg-[#C4866A]/20 text-[#C4866A]' : 'bg-[#A3B18A]/20 text-[#344E41]'
                      }`}>
                        Stock: {product.stock}
                      </span>
                    </div>

                    <h4 className="font-editorial text-xl font-bold text-[#344E41] leading-snug">
                      {product.name}
                    </h4>
                  </div>

                  <div className="mt-6 pt-4 border-t border-[#E9E2D5] grid grid-cols-2 gap-4">
                    <div>
                      <span className="text-[11px] text-[#575D56] block">Units Sold</span>
                      <span className="font-editorial text-2xl font-bold text-[#344E41] tabular-nums">
                        {unitsSold}
                      </span>
                    </div>
                    <div className="text-right">
                      <span className="text-[11px] text-[#575D56] block">Revenue</span>
                      <span className="font-editorial text-2xl font-bold text-[#344E41] tabular-nums">
                        ${totalRevenue.toFixed(2)}
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ================= TAB 5: EMAIL CENTER ================= */}
        {activeTab === 'emails' && (
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="font-editorial text-3xl font-bold text-[#344E41]">Customer Communication & Dispatch</h2>
                <p className="text-xs text-[#575D56]">Send order confirmations, tracking alerts, and Certificate of Analysis PDFs via Gmail/Apps Script.</p>
              </div>
            </div>

            {emailSentAlert && (
              <div className="p-3 bg-[#A3B18A]/20 text-[#344E41] rounded-lg text-xs font-medium flex items-center gap-2">
                <CheckCircle className="w-4 h-4 text-[#344E41]" />
                <span>{emailSentAlert}</span>
              </div>
            )}

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
              {/* Template Selector */}
              <div className="lg:col-span-4 space-y-3">
                <h4 className="text-xs font-semibold uppercase tracking-wider text-[#344E41]">
                  Available Email Templates
                </h4>
                <div className="space-y-2">
                  {INITIAL_EMAIL_TEMPLATES.map((tmpl) => (
                    <button
                      key={tmpl.key}
                      onClick={() => {
                        setSelectedTemplateKey(tmpl.key);
                        setEmailSubject(tmpl.subject.replace('{{orderId}}', emailTargetOrderId || 'PL-2026-XXXX'));
                        setEmailBody(tmpl.content);
                      }}
                      className={`w-full p-3 rounded-lg text-left text-xs border transition-colors cursor-pointer ${
                        selectedTemplateKey === tmpl.key
                          ? 'border-[#344E41] bg-[#344E41] text-white'
                          : 'border-[#E9E2D5] bg-[#F8F6F0] text-[#575D56] hover:bg-[#E9E2D5]'
                      }`}
                    >
                      <strong className="block mb-0.5">{tmpl.title}</strong>
                      <span className="text-[11px] opacity-80 truncate block">{tmpl.subject}</span>
                    </button>
                  ))}
                </div>
              </div>

              {/* Email Editor / Sender */}
              <div className="lg:col-span-8 bg-[#F8F6F0] p-6 rounded-xl border border-[#E9E2D5] space-y-4">
                <h4 className="text-xs font-semibold uppercase tracking-wider text-[#344E41]">
                  Compose Dispatch Email
                </h4>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
                  <div>
                    <label className="text-[11px] font-medium text-[#575D56] block mb-1">
                      Recipient Email:
                    </label>
                    <input
                      type="email"
                      value={emailRecipient}
                      onChange={(e) => setEmailRecipient(e.target.value)}
                      placeholder="customer@domain.com"
                      className="w-full px-3 py-2 rounded-lg bg-[#F8F6F0] border border-[#E9E2D5] text-[#292D29] focus:outline-none focus:ring-1 focus:ring-[#344E41]"
                    />
                  </div>
                  <div>
                    <label className="text-[11px] font-medium text-[#575D56] block mb-1">
                      Associated Order ID:
                    </label>
                    <input
                      type="text"
                      value={emailTargetOrderId}
                      onChange={(e) => setEmailTargetOrderId(e.target.value)}
                      placeholder="e.g. PL-2026-1042"
                      className="w-full px-3 py-2 rounded-lg bg-[#F8F6F0] border border-[#E9E2D5] text-[#292D29] focus:outline-none focus:ring-1 focus:ring-[#344E41]"
                    />
                  </div>
                </div>

                <div className="text-xs">
                  <label className="text-[11px] font-medium text-[#575D56] block mb-1">
                    Email Subject Line:
                  </label>
                  <input
                    type="text"
                    value={emailSubject}
                    onChange={(e) => setEmailSubject(e.target.value)}
                    className="w-full px-3 py-2 rounded-lg bg-[#F8F6F0] border border-[#E9E2D5] text-[#292D29] focus:outline-none focus:ring-1 focus:ring-[#344E41]"
                  />
                </div>

                <div className="text-xs">
                  <label className="text-[11px] font-medium text-[#575D56] block mb-1">
                    Email Content:
                  </label>
                  <textarea
                    rows={10}
                    value={emailBody}
                    onChange={(e) => setEmailBody(e.target.value)}
                    className="w-full p-3 font-mono text-xs rounded-lg bg-[#F8F6F0] border border-[#E9E2D5] text-[#292D29] focus:outline-none focus:ring-1 focus:ring-[#344E41]"
                  />
                </div>

                <div className="flex items-center justify-between pt-2 border-t border-[#E9E2D5]">
                  <span className="text-[11px] text-[#829267]">
                    Dispatched via Google Apps Script MailApp / Gmail
                  </span>
                  <button
                    onClick={handleSendEmail}
                    className="px-5 py-2.5 rounded-lg bg-[#344E41] text-[#F8F6F0] font-medium text-xs hover:bg-[#24372D] flex items-center gap-2 cursor-pointer"
                  >
                    <Send className="w-3.5 h-3.5 text-[#A3B18A]" />
                    <span>Send Customer Email</span>
                  </button>
                </div>
              </div>
            </div>

          </div>
        )}

        {/* ================= TAB 6: APPS SCRIPT / GOOGLE SHEETS ================= */}
        {activeTab === 'appsscript' && (
          <div className="space-y-8">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <h2 className="font-editorial text-3xl font-bold text-[#344E41]">Google Apps Script & Sheets Integration</h2>
                <p className="text-xs text-[#575D56]">Synchronize storefront orders, update inventory in real-time, and automate email notifications via your Google Sheet.</p>
              </div>

              <button
                onClick={onResetData}
                className="px-3 py-2 rounded-lg border border-[#C4866A]/40 text-[#C4866A] text-xs font-medium hover:bg-[#C4866A]/10 self-start cursor-pointer"
              >
                Reset Default Sample Data
              </button>
            </div>

            {/* URL Input & Connection Status */}
            <div className="bg-[#F8F6F0] p-6 rounded-xl border border-[#E9E2D5] space-y-4">
              <h4 className="text-xs font-semibold uppercase tracking-wider text-[#344E41]">
                Apps Script Web App Endpoint URL
              </h4>
              <div className="flex flex-col sm:flex-row gap-3">
                <input
                  type="url"
                  placeholder="https://script.google.com/macros/s/.../exec"
                  value={webAppUrlInput}
                  onChange={(e) => setWebAppUrlInput(e.target.value)}
                  className="flex-1 px-3 py-2.5 text-xs rounded-lg bg-[#F8F6F0] border border-[#E9E2D5] text-[#292D29] focus:outline-none focus:ring-1 focus:ring-[#344E41]"
                />
                <button
                  onClick={handleSaveAppsScript}
                  className="px-5 py-2.5 rounded-lg bg-[#344E41] text-[#F8F6F0] font-medium text-xs hover:bg-[#24372D] cursor-pointer"
                >
                  Save & Connect
                </button>
              </div>

              {testStatus && (
                <div className={`p-3 rounded-lg text-xs ${testStatus.isSuccess ? 'bg-[#A3B18A]/20 text-[#344E41]' : 'bg-[#C4866A]/20 text-[#C4866A]'}`}>
                  {testStatus.message}
                </div>
              )}
            </div>

            {/* Step-by-Step Instructions */}
            <div className="bg-[#E9E2D5]/35 p-6 rounded-xl border border-[#E9E2D5] space-y-4">
              <h4 className="text-xs font-semibold uppercase tracking-wider text-[#344E41]">
                Quick 1-Minute Google Sheets Setup Instructions
              </h4>
              <ol className="list-decimal list-inside space-y-2 text-xs text-[#575D56] leading-relaxed">
                <li>Create a new spreadsheet in Google Sheets named <strong className="text-[#344E41]">"PeptLab Store Database"</strong>.</li>
                <li>In Google Sheets, go to the top menu: <code className="bg-[#F8F6F0] px-1 py-0.5 rounded text-[#344E41]">Extensions → Apps Script</code>.</li>
                <li>Delete any default code in <code className="bg-[#F8F6F0] px-1 py-0.5 rounded text-[#344E41]">Code.gs</code> and paste the complete script below.</li>
                <li>Click <strong className="text-[#344E41]">Deploy → New deployment</strong>, select <strong className="text-[#344E41]">Web app</strong>.</li>
                <li>Set <em>"Execute as"</em>: <strong>Me</strong> and <em>"Who has access"</em>: <strong>Anyone</strong>.</li>
                <li>Click <strong>Deploy</strong>, authorize Google permissions, copy your Web App URL and paste it into the field above.</li>
              </ol>
            </div>

            {/* Code.gs Viewer & 1-Click Copy */}
            <div className="bg-[#24372D] rounded-xl overflow-hidden border border-[#344E41]">
              <div className="p-4 bg-[#1C2C24] flex items-center justify-between text-xs text-[#E9E2D5]">
                <div className="flex items-center gap-2">
                  <FileSpreadsheet className="w-4 h-4 text-[#A3B18A]" />
                  <span className="font-mono font-medium">Code.gs (Ready for Deployment)</span>
                </div>
                <button
                  onClick={handleCopyCode}
                  className="px-3 py-1.5 rounded bg-[#344E41] hover:bg-[#A3B18A] hover:text-[#24372D] text-xs font-medium text-white transition-colors flex items-center gap-1.5 cursor-pointer"
                >
                  {isCopiedCode ? <Check className="w-3.5 h-3.5 text-[#24372D]" /> : <Copy className="w-3.5 h-3.5" />}
                  <span>{isCopiedCode ? 'Copied to Clipboard!' : 'Copy Code.gs'}</span>
                </button>
              </div>
              <pre className="p-4 text-xs font-mono text-[#E9E2D5]/80 overflow-x-auto max-h-96">
                {GOOGLE_APPS_SCRIPT_CODE}
              </pre>
            </div>

          </div>
        )}

      </main>

      {/* ================= MODAL: EDIT / ADD PRODUCT ================= */}
      {(editingProduct || isAddingProduct) && (
        <ProductEditModal
          product={editingProduct}
          isNew={isAddingProduct}
          onClose={() => {
            setEditingProduct(null);
            setIsAddingProduct(false);
          }}
          onSave={(prod) => {
            if (isAddingProduct) {
              onAddProduct(prod);
            } else {
              onUpdateProduct(prod);
            }
            setEditingProduct(null);
            setIsAddingProduct(false);
          }}
        />
      )}

      {/* ================= MODAL: EDIT ORDER DETAILS ================= */}
      {isEditingOrderModal && selectedOrder && (
        <OrderEditModal
          order={selectedOrder}
          formData={orderEditForm}
          onChangeForm={setOrderEditForm}
          onClose={() => {
            setIsEditingOrderModal(false);
            setSelectedOrder(null);
          }}
          onSave={handleSaveOrderEdits}
        />
      )}

    </div>
  );
};

// --- Sub-Component: Product Edit / Add Modal ---
interface ProductEditModalProps {
  product: Product | null;
  isNew: boolean;
  onClose: () => void;
  onSave: (product: Product) => void;
}

const ProductEditModal: React.FC<ProductEditModalProps> = ({
  product,
  isNew,
  onClose,
  onSave,
}) => {
  const [name, setName] = useState(product?.name || '');
  const [series, setSeries] = useState(product?.series || 'Longevity & Cellular');
  const [basePrice, setBasePrice] = useState(product?.basePrice?.toString() || '65.00');
  const [stock, setStock] = useState(product?.stock?.toString() || '30');
  const [purity, setPurity] = useState(product?.purity?.toString() || '99.4');
  const [cas, setCas] = useState(product?.cas || '');
  const [sequence, setSequence] = useState(product?.sequence || '');
  const [molecularWeight, setMolecularWeight] = useState(product?.molecularWeight || '');
  const [description, setDescription] = useState(product?.description || '');
  const [imageUrl, setImageUrl] = useState(product?.imageUrl || '');
  const [batchNumber, setBatchNumber] = useState(product?.batchNumber || `PL-2026-LOT-${Math.floor(100 + Math.random() * 900)}`);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) {
      alert('Please enter a product name');
      return;
    }

    const priceNum = parseFloat(basePrice) || 60;
    const stockNum = parseInt(stock) || 20;
    const purityNum = parseFloat(purity) || 99.0;

    const savedProduct: Product = {
      id: product?.id || `prod-${Date.now()}`,
      name: name.trim(),
      series: series as any,
      description: description.trim() || 'Analytical-grade synthetic peptide compound.',
      benefits: product?.benefits || [
        'Validated through reverse-phase HPLC chromatogram',
        'Sealed under inert atmosphere with nitrogen flush'
      ],
      sequence: sequence.trim() || 'Synthetic polypeptide chain',
      cas: cas.trim() || 'Pending Registration',
      molecularWeight: molecularWeight.trim() || '1200.0 g/mol',
      purity: purityNum,
      basePrice: priceNum,
      stock: stockNum,
      isVisible: product ? product.isVisible : true,
      imageUrl: formatProductImageUrl(imageUrl.trim()),
      batchNumber: batchNumber.trim(),
      storageTemp: product?.storageTemp || '-20°C lyophilized / 2-8°C reconstituted',
      dosageGuide: product?.dosageGuide || 'Standard laboratory assay titration.',
      reconstitutionGuide: product?.reconstitutionGuide || 'Add bacteriostatic water gently along vial wall.',
      variants: product?.variants || [
        { id: `v-${Date.now()}-1`, name: '5mg Single Vial', price: priceNum, stock: stockNum, sku: `PL-SKU-${Math.floor(100 + Math.random() * 900)}` },
        { id: `v-${Date.now()}-2`, name: '10mg High-Yield Vial', price: priceNum * 1.6, stock: 10, sku: `PL-SKU-${Math.floor(100 + Math.random() * 900)}B` }
      ],
      coaData: product?.coaData || {
        batchNumber: batchNumber.trim(),
        purityTested: purityNum,
        testMethod: 'RP-HPLC & MS',
        testingDate: new Date().toISOString().slice(0, 10),
        endotoxinLevel: '< 0.02 EU/mg',
        labName: 'PharmaTech Analytical Laboratories, Zurich',
        analyst: 'Dr. Elena Vance',
        reportUrl: '#'
      },
      createdAt: product?.createdAt || new Date().toISOString()
    };

    onSave(savedProduct);
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-xs flex items-center justify-center p-4">
      <div 
        className="w-full max-w-2xl bg-[#F8F6F0] rounded-2xl border border-[#E9E2D5] p-6 shadow-2xl max-h-[90vh] overflow-y-auto"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between pb-4 border-b border-[#E9E2D5] mb-6">
          <h3 className="font-editorial text-2xl font-bold text-[#344E41]">
            {isNew ? 'Add New Analytical Peptide' : `Edit ${product?.name}`}
          </h3>
          <button onClick={onClose} className="p-1 rounded text-[#575D56] hover:bg-[#E9E2D5]">
            ✕
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4 text-xs">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="sm:col-span-2">
              <label className="text-[11px] font-medium text-[#575D56] block mb-1">Peptide Compound Name *</label>
              <input
                type="text"
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="e.g. BPC-157 Pure Lyophilized Peptide"
                className="w-full px-3 py-2 rounded-lg bg-[#F8F6F0] border border-[#E9E2D5] text-[#292D29]"
              />
            </div>

            <div>
              <label className="text-[11px] font-medium text-[#575D56] block mb-1">Series / Category</label>
              <select
                value={series}
                onChange={(e) => setSeries(e.target.value as any)}
                className="w-full px-3 py-2 rounded-lg bg-[#F8F6F0] border border-[#E9E2D5] text-[#292D29]"
              >
                <option value="Longevity & Cellular">Longevity & Cellular</option>
                <option value="Recovery & Tissue">Recovery & Tissue</option>
                <option value="Cognitive & Neuro">Cognitive & Neuro</option>
                <option value="Aesthetic & Botanical">Aesthetic & Botanical</option>
              </select>
            </div>

            <div>
              <label className="text-[11px] font-medium text-[#575D56] block mb-1">CAS Registry Number</label>
              <input
                type="text"
                value={cas}
                onChange={(e) => setCas(e.target.value)}
                placeholder="e.g. 137525-51-0"
                className="w-full px-3 py-2 rounded-lg bg-[#F8F6F0] border border-[#E9E2D5] text-[#292D29]"
              />
            </div>

            <div>
              <label className="text-[11px] font-medium text-[#575D56] block mb-1">Base Price ($)</label>
              <input
                type="number"
                step="0.01"
                value={basePrice}
                onChange={(e) => setBasePrice(e.target.value)}
                className="w-full px-3 py-2 rounded-lg bg-[#F8F6F0] border border-[#E9E2D5] text-[#292D29]"
              />
            </div>

            <div>
              <label className="text-[11px] font-medium text-[#575D56] block mb-1">Inventory Stock</label>
              <input
                type="number"
                value={stock}
                onChange={(e) => setStock(e.target.value)}
                className="w-full px-3 py-2 rounded-lg bg-[#F8F6F0] border border-[#E9E2D5] text-[#292D29]"
              />
            </div>

            <div>
              <label className="text-[11px] font-medium text-[#575D56] block mb-1">Tested Purity (%)</label>
              <input
                type="number"
                step="0.1"
                value={purity}
                onChange={(e) => setPurity(e.target.value)}
                className="w-full px-3 py-2 rounded-lg bg-[#F8F6F0] border border-[#E9E2D5] text-[#292D29]"
              />
            </div>

            <div>
              <label className="text-[11px] font-medium text-[#575D56] block mb-1">Batch / Lot #</label>
              <input
                type="text"
                value={batchNumber}
                onChange={(e) => setBatchNumber(e.target.value)}
                className="w-full px-3 py-2 rounded-lg bg-[#F8F6F0] border border-[#E9E2D5] text-[#292D29]"
              />
            </div>

            <div className="sm:col-span-2">
              <label className="text-[11px] font-medium text-[#575D56] block mb-1">
                Image URL or Google Drive Link
              </label>
              <input
                type="text"
                value={imageUrl}
                onChange={(e) => setImageUrl(e.target.value)}
                placeholder="Paste direct URL or Google Drive share link (drive.google.com/...)"
                className="w-full px-3 py-2 rounded-lg bg-[#F8F6F0] border border-[#E9E2D5] text-[#292D29]"
              />
              <p className="text-[10px] text-[#829267] mt-1">
                Supports Google Drive links! PeptLab automatically parses file IDs into responsive direct embeds.
              </p>
            </div>

            <div className="sm:col-span-2">
              <label className="text-[11px] font-medium text-[#575D56] block mb-1">Amino Acid Sequence</label>
              <input
                type="text"
                value={sequence}
                onChange={(e) => setSequence(e.target.value)}
                placeholder="e.g. Gly-Glu-Pro-Pro-Pro-Gly-Lys..."
                className="w-full px-3 py-2 rounded-lg bg-[#F8F6F0] border border-[#E9E2D5] text-[#292D29] font-mono"
              />
            </div>

            <div className="sm:col-span-2">
              <label className="text-[11px] font-medium text-[#575D56] block mb-1">Product Description</label>
              <textarea
                rows={3}
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                className="w-full px-3 py-2 rounded-lg bg-[#F8F6F0] border border-[#E9E2D5] text-[#292D29]"
              />
            </div>
          </div>

          <div className="flex items-center justify-end gap-3 pt-4 border-t border-[#E9E2D5]">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-lg border border-[#E9E2D5] text-[#575D56] hover:bg-[#E9E2D5]"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-5 py-2 rounded-lg bg-[#344E41] text-white hover:bg-[#24372D] font-medium"
            >
              Save Peptide Record
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

// --- Sub-Component: Order Edit Modal ---
interface OrderEditModalProps {
  order: Order;
  formData: Partial<Order>;
  onChangeForm: (form: Partial<Order>) => void;
  onClose: () => void;
  onSave: () => void;
}

const OrderEditModal: React.FC<OrderEditModalProps> = ({
  order,
  formData,
  onChangeForm,
  onClose,
  onSave,
}) => {
  return (
    <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-xs flex items-center justify-center p-4">
      <div 
        className="w-full max-w-xl bg-[#F8F6F0] rounded-2xl border border-[#E9E2D5] p-6 shadow-2xl max-h-[90vh] overflow-y-auto"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between pb-4 border-b border-[#E9E2D5] mb-4">
          <h3 className="font-editorial text-2xl font-bold text-[#344E41]">
            Manage Order #{order.id}
          </h3>
          <button onClick={onClose} className="p-1 rounded text-[#575D56] hover:bg-[#E9E2D5]">
            ✕
          </button>
        </div>

        <div className="space-y-4 text-xs">
          <div>
            <label className="text-[11px] font-medium text-[#575D56] block mb-1">Fulfillment Status:</label>
            <select
              value={formData.status}
              onChange={(e) => onChangeForm({ ...formData, status: e.target.value as any })}
              className="w-full px-3 py-2 rounded-lg bg-[#F8F6F0] border border-[#E9E2D5] text-[#292D29] font-medium"
            >
              <option value="Pending">Pending (Customer can self-edit address)</option>
              <option value="Processing">Processing (Cleanroom synthesis / Packing)</option>
              <option value="Shipped">Shipped (Cold chain departed)</option>
              <option value="Delivered">Delivered</option>
              <option value="Cancelled">Cancelled</option>
            </select>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-[11px] font-medium text-[#575D56] block mb-1">Cold-Chain Carrier:</label>
              <input
                type="text"
                value={formData.carrier || ''}
                onChange={(e) => onChangeForm({ ...formData, carrier: e.target.value })}
                placeholder="e.g. FedEx ColdChain Priority"
                className="w-full px-3 py-2 rounded-lg bg-[#F8F6F0] border border-[#E9E2D5] text-[#292D29]"
              />
            </div>
            <div>
              <label className="text-[11px] font-medium text-[#575D56] block mb-1">Tracking Number:</label>
              <input
                type="text"
                value={formData.trackingNumber || ''}
                onChange={(e) => onChangeForm({ ...formData, trackingNumber: e.target.value })}
                placeholder="e.g. 794611892041"
                className="w-full px-3 py-2 rounded-lg bg-[#F8F6F0] border border-[#E9E2D5] text-[#292D29] font-mono"
              />
            </div>
          </div>

          <div>
            <label className="text-[11px] font-medium text-[#575D56] block mb-1">Internal Operations Notes:</label>
            <textarea
              rows={3}
              value={formData.orderNotes || ''}
              onChange={(e) => onChangeForm({ ...formData, orderNotes: e.target.value })}
              placeholder="e.g. Dry ice verified. Assigned batch lot PL-2026-BPC-889."
              className="w-full px-3 py-2 rounded-lg bg-[#F8F6F0] border border-[#E9E2D5] text-[#292D29]"
            />
          </div>

          <div className="pt-2 border-t border-[#E9E2D5] flex items-center justify-end gap-3">
            <button
              onClick={onClose}
              className="px-4 py-2 rounded-lg border border-[#E9E2D5] text-[#575D56] hover:bg-[#E9E2D5]"
            >
              Cancel
            </button>
            <button
              onClick={onSave}
              className="px-5 py-2 rounded-lg bg-[#344E41] text-white hover:bg-[#24372D] font-medium"
            >
              Save Order Updates
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
