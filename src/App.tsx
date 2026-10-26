import React, { useState, useEffect } from 'react';
import { Product, ProductVariant, CartItem, Order, OrderStatus, AppsScriptConfig } from './types';
import { 
  getStoredProducts, 
  saveProducts, 
  getStoredOrders, 
  saveOrders, 
  getStoredCart, 
  saveCart, 
  getStoredAppsScriptConfig, 
  saveAppsScriptConfig,
  submitOrderToAppsScript,
  updateOrderInAppsScript,
  resetDefaultData
} from './utils/storage';

import { Header } from './components/Header';
import { Hero } from './components/Hero';
import { ResearchSeries } from './components/ResearchSeries';
import { ProductCatalog } from './components/ProductCatalog';
import { QualitySection } from './components/QualitySection';
import { Footer } from './components/Footer';

import { ProductDetailModal } from './components/ProductDetailModal';
import { CartDrawer } from './components/CartDrawer';
import { CheckoutModal } from './components/CheckoutModal';
import { OrderLookupModal } from './components/OrderLookupModal';
import { InvoiceModal } from './components/InvoiceModal';
import { AdminDashboard } from './components/admin/AdminDashboard';

export default function App() {
  // Primary State
  const [products, setProducts] = useState<Product[]>(() => getStoredProducts());
  const [orders, setOrders] = useState<Order[]>(() => getStoredOrders());
  const [cart, setCart] = useState<CartItem[]>(() => getStoredCart());
  const [appsScriptConfig, setAppsScriptConfig] = useState<AppsScriptConfig>(() => getStoredAppsScriptConfig());

  // Category & Filter State
  const [selectedCategory, setSelectedCategory] = useState<string>('All Series');

  // UI Drawers & Modals
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isCheckoutOpen, setIsCheckoutOpen] = useState(false);
  const [isOrderLookupOpen, setIsOrderLookupOpen] = useState(false);
  const [lookupInitialId, setLookupInitialId] = useState('');
  const [isAdminOpen, setIsAdminOpen] = useState(false);
  const [selectedProductDetail, setSelectedProductDetail] = useState<Product | null>(null);
  const [invoiceOrder, setInvoiceOrder] = useState<Order | null>(null);

  // Promo Code State
  const [promoCode, setPromoCode] = useState<string>('');
  const [discountRate, setDiscountRate] = useState<number>(0);

  // Persistence Effects
  useEffect(() => {
    saveProducts(products);
  }, [products]);

  useEffect(() => {
    saveOrders(orders);
  }, [orders]);

  useEffect(() => {
    saveCart(cart);
  }, [cart]);

  // Cart Calculations
  const cartCount = cart.reduce((total, item) => total + item.quantity, 0);

  // Smooth Section Navigation
  const handleNavigateSection = (sectionId: string) => {
    const el = document.getElementById(sectionId);
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  // Cart Handlers
  const handleAddToCart = (product: Product, variant: ProductVariant, quantity: number) => {
    setCart((prevCart) => {
      const existingIdx = prevCart.findIndex(
        (item) => item.productId === product.id && item.variantId === variant.id
      );

      if (existingIdx > -1) {
        const updated = [...prevCart];
        updated[existingIdx].quantity += quantity;
        return updated;
      } else {
        return [
          ...prevCart,
          {
            productId: product.id,
            variantId: variant.id,
            name: product.name,
            variantName: variant.name,
            price: variant.price,
            quantity: quantity,
            imageUrl: product.imageUrl,
            sku: variant.sku
          }
        ];
      }
    });
  };

  const handleUpdateCartQuantity = (productId: string, variantId: string, delta: number) => {
    setCart((prevCart) => {
      return prevCart
        .map((item) => {
          if (item.productId === productId && item.variantId === variantId) {
            const newQty = item.quantity + delta;
            return newQty > 0 ? { ...item, quantity: newQty } : null;
          }
          return item;
        })
        .filter(Boolean) as CartItem[];
    });
  };

  const handleRemoveFromCart = (productId: string, variantId: string) => {
    setCart((prevCart) =>
      prevCart.filter((item) => !(item.productId === productId && item.variantId === variantId))
    );
  };

  const handleApplyPromo = (code: string): boolean => {
    const normalized = code.trim().toUpperCase();
    if (normalized === 'BOTANICAL10') {
      setPromoCode(normalized);
      setDiscountRate(0.10);
      return true;
    }
    if (normalized === 'PEPTLAB' || normalized === 'PEPTLAB15') {
      setPromoCode(normalized);
      setDiscountRate(0.15);
      return true;
    }
    return false;
  };

  // Order Placement
  const handleOrderPlaced = async (newOrder: Order) => {
    // 1. Add to orders list
    const updatedOrders = [newOrder, ...orders];
    setOrders(updatedOrders);
    saveOrders(updatedOrders);

    // 2. Decrement inventory
    setProducts((prev) =>
      prev.map((p) => {
        const orderItem = newOrder.items.find((item) => item.productId === p.id);
        if (orderItem) {
          const newStock = Math.max(0, p.stock - orderItem.quantity);
          const updatedVariants = p.variants.map((v) => {
            if (v.id === orderItem.variantId) {
              return { ...v, stock: Math.max(0, v.stock - orderItem.quantity) };
            }
            return v;
          });
          return { ...p, stock: newStock, variants: updatedVariants };
        }
        return p;
      })
    );

    // 3. Relay to Apps Script Backend if configured
    if (appsScriptConfig.webAppUrl) {
      await submitOrderToAppsScript(newOrder, appsScriptConfig.webAppUrl);
    }
  };

  // Order Update (e.g. from Order Lookup Customer Self-Service)
  const handleUpdateOrder = async (orderId: string, updates: Partial<Order>) => {
    const updated = orders.map((o) => {
      if (o.id === orderId) {
        return { ...o, ...updates, updatedAt: new Date().toISOString() };
      }
      return o;
    });
    setOrders(updated);
    saveOrders(updated);

    if (appsScriptConfig.webAppUrl) {
      await updateOrderInAppsScript(orderId, updates, appsScriptConfig.webAppUrl);
    }
  };

  // Order Cancellation (when Pending)
  const handleCancelOrder = async (orderId: string) => {
    await handleUpdateOrder(orderId, { status: 'Cancelled' });
  };

  // Admin Order Status Update
  const handleUpdateOrderStatus = async (
    orderId: string, 
    status: OrderStatus, 
    trackingNumber?: string, 
    carrier?: string
  ) => {
    const updates: Partial<Order> = { status };
    if (trackingNumber !== undefined) updates.trackingNumber = trackingNumber;
    if (carrier !== undefined) updates.carrier = carrier;

    await handleUpdateOrder(orderId, updates);
  };

  // Product Catalog Updates
  const handleUpdateProduct = (updatedProduct: Product) => {
    setProducts((prev) =>
      prev.map((p) => (p.id === updatedProduct.id ? updatedProduct : p))
    );
  };

  const handleAddProduct = (newProduct: Product) => {
    setProducts((prev) => [newProduct, ...prev]);
  };

  const handleDeleteProduct = (productId: string) => {
    setProducts((prev) => prev.filter((p) => p.id !== productId));
  };

  // Reset Data to Default
  const handleResetData = () => {
    if (confirm('Reset catalog and orders to default factory configuration?')) {
      const res = resetDefaultData();
      setProducts(res.products);
      setOrders(res.orders);
      setCart([]);
    }
  };

  // Order Lookup Quick Trigger from Checkout Confirmation
  const handleOpenOrderLookupWithId = (orderId: string) => {
    setLookupInitialId(orderId);
    setIsOrderLookupOpen(true);
  };

  return (
    <div className="min-h-screen bg-[#F8F6F0] text-[#292D29] flex flex-col font-sans selection:bg-[#A3B18A]/30 selection:text-[#344E41]">
      
      {/* Top Bar Header */}
      <Header
        cartCount={cartCount}
        onOpenCart={() => setIsCartOpen(true)}
        onOpenOrderLookup={() => {
          setLookupInitialId('');
          setIsOrderLookupOpen(true);
        }}
        onOpenAdmin={() => setIsAdminOpen(true)}
        onNavigateSection={handleNavigateSection}
      />

      {/* Hero Showcase */}
      <Hero
        onExploreClick={() => handleNavigateSection('catalog')}
        onQualityClick={() => handleNavigateSection('quality')}
      />

      {/* Curated Product Series */}
      <ResearchSeries
        onSelectSeries={(series) => {
          setSelectedCategory(series);
          handleNavigateSection('catalog');
        }}
      />

      {/* Main Peptide Catalog */}
      <ProductCatalog
        products={products}
        selectedCategory={selectedCategory}
        onCategoryChange={setSelectedCategory}
        onSelectProduct={setSelectedProductDetail}
        onAddToCart={handleAddToCart}
      />

      {/* Lab Quality & Analytical Standards */}
      <QualitySection />

      {/* Footer */}
      <Footer
        onNavigateSection={handleNavigateSection}
        onOpenOrderLookup={() => {
          setLookupInitialId('');
          setIsOrderLookupOpen(true);
        }}
        onOpenAdmin={() => setIsAdminOpen(true)}
      />

      {/* Product Detail Modal */}
      <ProductDetailModal
        product={selectedProductDetail}
        onClose={() => setSelectedProductDetail(null)}
        onAddToCart={handleAddToCart}
      />

      {/* Cart Drawer */}
      <CartDrawer
        isOpen={isCartOpen}
        onClose={() => setIsCartOpen(false)}
        items={cart}
        onUpdateQuantity={handleUpdateCartQuantity}
        onRemoveItem={handleRemoveFromCart}
        onProceedToCheckout={() => {
          setIsCartOpen(false);
          setIsCheckoutOpen(true);
        }}
        promoCode={promoCode}
        setPromoCode={setPromoCode}
        discountRate={discountRate}
        onApplyPromo={handleApplyPromo}
      />

      {/* Checkout Modal */}
      <CheckoutModal
        isOpen={isCheckoutOpen}
        onClose={() => setIsCheckoutOpen(false)}
        cartItems={cart}
        discountRate={discountRate}
        onOrderPlaced={handleOrderPlaced}
        onClearCart={() => setCart([])}
        onOpenOrderLookupWithId={handleOpenOrderLookupWithId}
      />

      {/* Order Lookup & Self-Service Editing */}
      <OrderLookupModal
        isOpen={isOrderLookupOpen}
        onClose={() => setIsOrderLookupOpen(false)}
        orders={orders}
        onUpdateOrder={handleUpdateOrder}
        onCancelOrder={handleCancelOrder}
        onOpenInvoice={setInvoiceOrder}
        initialOrderId={lookupInitialId}
      />

      {/* Printable Invoice Modal */}
      <InvoiceModal
        order={invoiceOrder}
        onClose={() => setInvoiceOrder(null)}
      />

      {/* Admin Portal */}
      {isAdminOpen && (
        <AdminDashboard
          onClose={() => setIsAdminOpen(false)}
          products={products}
          orders={orders}
          onUpdateProduct={handleUpdateProduct}
          onAddProduct={handleAddProduct}
          onDeleteProduct={handleDeleteProduct}
          onUpdateOrderStatus={handleUpdateOrderStatus}
          onUpdateOrderDetails={handleUpdateOrder}
          appsScriptConfig={appsScriptConfig}
          onSaveAppsScriptConfig={(cfg) => {
            setAppsScriptConfig(cfg);
            saveAppsScriptConfig(cfg);
          }}
          onResetData={handleResetData}
        />
      )}

    </div>
  );
}
