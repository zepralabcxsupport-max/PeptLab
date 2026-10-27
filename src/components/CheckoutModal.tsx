import React, { useState } from 'react';
import { CartItem, Order, ShippingAddress } from '../types';
import { X, CheckCircle, ShieldCheck, Truck, CreditCard, Landmark, FileText, ArrowLeft, Loader2 } from 'lucide-react';

interface CheckoutModalProps {
  isOpen: boolean;
  onClose: () => void;
  cartItems: CartItem[];
  discountRate: number;
  onOrderPlaced: (order: Order) => Promise<void>;
  onClearCart: () => void;
  onOpenOrderLookupWithId: (orderId: string) => void;
}

export const CheckoutModal: React.FC<CheckoutModalProps> = ({
  isOpen,
  onClose,
  cartItems,
  discountRate,
  onOrderPlaced,
  onClearCart,
  onOpenOrderLookupWithId,
}) => {
  const [formData, setFormData] = useState<ShippingAddress>({
    fullName: '',
    email: '',
    phone: '',
    street: '',
    aptSuite: '',
    city: '',
    state: '',
    postalCode: '',
    country: 'United States',
    deliveryNotes: ''
  });

  const [paymentMethod, setPaymentMethod] = useState<'Card' | 'Wire/Zelle' | 'Crypto' | 'PO/Invoice'>('Card');
  const [shippingMethod, setShippingMethod] = useState<'standard' | 'priority'>('standard');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [confirmedOrder, setConfirmedOrder] = useState<Order | null>(null);

  if (!isOpen) return null;

  const subtotal = cartItems.reduce((acc, i) => acc + i.price * i.quantity, 0);
  const discountAmount = subtotal * discountRate;
  const baseShippingFee = subtotal >= 150 ? 0 : 9.95;
  const shippingFee = shippingMethod === 'priority' ? baseShippingFee + 15.00 : baseShippingFee;
  const total = Math.max(0, subtotal - discountAmount + shippingFee);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.fullName || !formData.email || !formData.phone || !formData.street || !formData.city || !formData.postalCode) {
      alert('Please fill in all required shipping address fields.');
      return;
    }

    setIsSubmitting(true);
    
    // Generate clean alphanumeric Order ID
    const randomSuffix = Math.floor(1000 + Math.random() * 9000);
    const orderId = `PL-2026-${randomSuffix}`;

    const newOrder: Order = {
      id: orderId,
      customerName: formData.fullName,
      email: formData.email,
      phone: formData.phone,
      shippingAddress: { ...formData },
      items: cartItems.map((c) => ({
        productId: c.productId,
        variantId: c.variantId,
        productName: c.name,
        variantName: c.variantName,
        price: c.price,
        quantity: c.quantity,
        subtotal: c.price * c.quantity
      })),
      subtotal,
      discount: discountAmount,
      shippingFee,
      total,
      status: 'Pending',
      paymentMethod,
      carrier: shippingMethod === 'priority' ? 'FedEx Priority Cold-Chain' : 'Standard Cold-Chain Insulated',
      orderNotes: formData.deliveryNotes,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      emailHistory: [
        {
          id: `em-${Date.now()}`,
          orderId,
          recipientEmail: formData.email,
          templateKey: 'order_confirmation',
          subject: `Order #${orderId} Confirmed — PeptLab Botanical Precision`,
          sentAt: new Date().toISOString(),
          bodyPreview: `Thank you for your research requisition. Order #${orderId} has been queued for formulation.`,
          status: 'Sent'
        }
      ]
    };

    try {
      await onOrderPlaced(newOrder);
      setConfirmedOrder(newOrder);
      onClearCart();
    } catch (err) {
      console.error(err);
      alert('There was an issue saving your order. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black/50 backdrop-blur-xs flex items-center justify-center p-4 sm:p-6">
      <div 
        className="relative w-full max-w-3xl bg-[#F8F6F0] rounded-2xl border border-[#E9E2D5] shadow-2xl overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Top Header */}
        <div className="px-6 py-4 border-b border-[#E9E2D5] flex items-center justify-between bg-[#F8F6F0]">
          <div className="flex items-center gap-2">
            <span className="font-editorial text-2xl font-bold text-[#344E41]">
              {confirmedOrder ? 'Requisition Confirmed' : 'Research Requisition Checkout'}
            </span>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full border border-[#E9E2D5] flex items-center justify-center text-[#575D56] hover:text-[#344E41] hover:bg-[#E9E2D5] transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Confirmation Screen */}
        {confirmedOrder ? (
          <div className="p-8 text-center max-h-[80vh] overflow-y-auto">
            <div className="w-16 h-16 rounded-full bg-[#A3B18A]/20 text-[#344E41] flex items-center justify-center mx-auto mb-4">
              <CheckCircle className="w-8 h-8" />
            </div>

            <div className="text-xs font-mono uppercase tracking-widest text-[#829267] mb-1">
              Order Dispatched to Fulfillment Queue
            </div>
            <h3 className="font-editorial text-3xl font-bold text-[#344E41] mb-2">
              Order #{confirmedOrder.id}
            </h3>
            <p className="text-sm text-[#575D56] max-w-md mx-auto mb-6">
              A confirmation and batch documentation report has been queued for <strong>{confirmedOrder.email}</strong>.
            </p>

            {/* Order Summary Box */}
            <div className="bg-[#E9E2D5]/40 rounded-xl p-5 border border-[#E9E2D5] text-left max-w-lg mx-auto mb-6 space-y-3 text-xs">
              <div className="flex justify-between items-center pb-2 border-b border-[#E9E2D5]">
                <span className="font-medium text-[#344E41]">Status</span>
                <span className="font-medium px-2 py-0.5 rounded bg-[#A3B18A]/30 text-[#344E41]">
                  {confirmedOrder.status}
                </span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-[#575D56]">Total Amount</span>
                <span className="font-editorial text-lg font-bold text-[#344E41] tabular-nums">
                  ₱{confirmedOrder.total.toFixed(2)} ({confirmedOrder.paymentMethod})
                </span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-[#575D56]">Destination</span>
                <span className="text-[#344E41] text-right truncate max-w-[240px]">
                  {confirmedOrder.shippingAddress.street}, {confirmedOrder.shippingAddress.city}
                </span>
              </div>
              <div className="flex justify-between items-center pt-2 border-t border-[#E9E2D5]">
                <span className="text-[#575D56]">Items</span>
                <span className="text-[#344E41]">{confirmedOrder.items.length} peptide formulation(s)</span>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
              <button
                onClick={() => {
                  onClose();
                  onOpenOrderLookupWithId(confirmedOrder.id);
                }}
                className="w-full sm:w-auto px-6 py-3 rounded-lg bg-[#344E41] text-[#F8F6F0] font-medium text-xs hover:bg-[#24372D] transition-colors"
              >
                Track & Edit Pending Order
              </button>

              <button
                onClick={onClose}
                className="w-full sm:w-auto px-6 py-3 rounded-lg border border-[#344E41]/30 text-[#344E41] font-medium text-xs hover:bg-[#E9E2D5]/50 transition-colors"
              >
                Return to Catalog
              </button>
            </div>
          </div>
        ) : (
          /* Checkout Form */
          <form onSubmit={handleSubmit} className="p-6 sm:p-8 max-h-[80vh] overflow-y-auto">
            <div className="grid grid-cols-1 md:grid-cols-12 gap-8">
              
              {/* Left Column: Customer & Delivery Info */}
              <div className="md:col-span-7 space-y-6">
                <div>
                  <h4 className="text-xs font-semibold uppercase tracking-wider text-[#344E41] mb-3">
                    1. Laboratory / Consignee Information
                  </h4>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div className="sm:col-span-2">
                      <label className="text-[11px] font-medium text-[#575D56] block mb-1">
                        Full Name / Principal Investigator *
                      </label>
                      <input
                        type="text"
                        required
                        placeholder="Dr. Eleanor Vance"
                        value={formData.fullName}
                        onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                        className="w-full px-3 py-2 text-xs rounded-lg bg-[#F8F6F0] border border-[#E9E2D5] text-[#292D29] focus:outline-none focus:ring-1 focus:ring-[#344E41]"
                      />
                    </div>
                    <div>
                      <label className="text-[11px] font-medium text-[#575D56] block mb-1">
                        Email Address *
                      </label>
                      <input
                        type="email"
                        required
                        placeholder="researcher@lab.org"
                        value={formData.email}
                        onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                        className="w-full px-3 py-2 text-xs rounded-lg bg-[#F8F6F0] border border-[#E9E2D5] text-[#292D29] focus:outline-none focus:ring-1 focus:ring-[#344E41]"
                      />
                    </div>
                    <div>
                      <label className="text-[11px] font-medium text-[#575D56] block mb-1">
                        Phone Number *
                      </label>
                      <input
                        type="tel"
                        required
                        placeholder="+1 (555) 234-5678"
                        value={formData.phone}
                        onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                        className="w-full px-3 py-2 text-xs rounded-lg bg-[#F8F6F0] border border-[#E9E2D5] text-[#292D29] focus:outline-none focus:ring-1 focus:ring-[#344E41]"
                      />
                    </div>
                  </div>
                </div>

                <div>
                  <h4 className="text-xs font-semibold uppercase tracking-wider text-[#344E41] mb-3">
                    2. Destination Cold-Chain Address
                  </h4>
                  <div className="space-y-3">
                    <div>
                      <label className="text-[11px] font-medium text-[#575D56] block mb-1">
                        Street Address *
                      </label>
                      <input
                        type="text"
                        required
                        placeholder="100 Innovation Way"
                        value={formData.street}
                        onChange={(e) => setFormData({ ...formData, street: e.target.value })}
                        className="w-full px-3 py-2 text-xs rounded-lg bg-[#F8F6F0] border border-[#E9E2D5] text-[#292D29] focus:outline-none focus:ring-1 focus:ring-[#344E41]"
                      />
                    </div>
                    <div>
                      <label className="text-[11px] font-medium text-[#575D56] block mb-1">
                        Suite / Department / Lab Room
                      </label>
                      <input
                        type="text"
                        placeholder="Biochemistry Wing, Room 402"
                        value={formData.aptSuite}
                        onChange={(e) => setFormData({ ...formData, aptSuite: e.target.value })}
                        className="w-full px-3 py-2 text-xs rounded-lg bg-[#F8F6F0] border border-[#E9E2D5] text-[#292D29] focus:outline-none focus:ring-1 focus:ring-[#344E41]"
                      />
                    </div>
                    <div className="grid grid-cols-3 gap-2">
                      <div>
                        <label className="text-[11px] font-medium text-[#575D56] block mb-1">City *</label>
                        <input
                          type="text"
                          required
                          placeholder="Boston"
                          value={formData.city}
                          onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                          className="w-full px-3 py-2 text-xs rounded-lg bg-[#F8F6F0] border border-[#E9E2D5] text-[#292D29] focus:outline-none focus:ring-1 focus:ring-[#344E41]"
                        />
                      </div>
                      <div>
                        <label className="text-[11px] font-medium text-[#575D56] block mb-1">State / Prov</label>
                        <input
                          type="text"
                          placeholder="MA"
                          value={formData.state}
                          onChange={(e) => setFormData({ ...formData, state: e.target.value })}
                          className="w-full px-3 py-2 text-xs rounded-lg bg-[#F8F6F0] border border-[#E9E2D5] text-[#292D29] focus:outline-none focus:ring-1 focus:ring-[#344E41]"
                        />
                      </div>
                      <div>
                        <label className="text-[11px] font-medium text-[#575D56] block mb-1">Postal Code *</label>
                        <input
                          type="text"
                          required
                          placeholder="02115"
                          value={formData.postalCode}
                          onChange={(e) => setFormData({ ...formData, postalCode: e.target.value })}
                          className="w-full px-3 py-2 text-xs rounded-lg bg-[#F8F6F0] border border-[#E9E2D5] text-[#292D29] focus:outline-none focus:ring-1 focus:ring-[#344E41]"
                        />
                      </div>
                    </div>
                    <div>
                      <label className="text-[11px] font-medium text-[#575D56] block mb-1">
                        Delivery Protocol / Cold Storage Notes
                      </label>
                      <input
                        type="text"
                        placeholder="e.g. Leave with security desk, requires immediate refrigeration"
                        value={formData.deliveryNotes}
                        onChange={(e) => setFormData({ ...formData, deliveryNotes: e.target.value })}
                        className="w-full px-3 py-2 text-xs rounded-lg bg-[#F8F6F0] border border-[#E9E2D5] text-[#292D29] focus:outline-none focus:ring-1 focus:ring-[#344E41]"
                      />
                    </div>
                  </div>
                </div>

                {/* Shipping Selection */}
                <div>
                  <h4 className="text-xs font-semibold uppercase tracking-wider text-[#344E41] mb-2">
                    3. Cold-Chain Dispatch Method
                  </h4>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                    <label className={`p-3 rounded-lg border cursor-pointer flex flex-col justify-between ${shippingMethod === 'standard' ? 'border-[#344E41] bg-[#344E41]/5' : 'border-[#E9E2D5] bg-[#F8F6F0]'}`}>
                      <div className="flex items-center gap-2">
                        <input
                          type="radio"
                          name="shipping"
                          checked={shippingMethod === 'standard'}
                          onChange={() => setShippingMethod('standard')}
                          className="text-[#344E41]"
                        />
                        <span className="font-semibold text-[#344E41]">Standard Thermal</span>
                      </div>
                      <span className="text-[11px] text-[#575D56] mt-1">Insulated box with gel packs (2-3 days)</span>
                      <span className="font-mono text-xs text-[#344E41] mt-2 font-medium">
                        {subtotal >= 150 ? 'FREE' : '₱9.95'}
                      </span>
                    </label>

                    <label className={`p-3 rounded-lg border cursor-pointer flex flex-col justify-between ${shippingMethod === 'priority' ? 'border-[#344E41] bg-[#344E41]/5' : 'border-[#E9E2D5] bg-[#F8F6F0]'}`}>
                      <div className="flex items-center gap-2">
                        <input
                          type="radio"
                          name="shipping"
                          checked={shippingMethod === 'priority'}
                          onChange={() => setShippingMethod('priority')}
                          className="text-[#344E41]"
                        />
                        <span className="font-semibold text-[#344E41]">Priority Overnight Dry-Ice</span>
                      </div>
                      <span className="text-[11px] text-[#575D56] mt-1">Guaranteed -20°C overnight delivery</span>
                      <span className="font-mono text-xs text-[#344E41] mt-2 font-medium">
                        {subtotal >= 150 ? '₱15.00' : '₱24.95'}
                      </span>
                    </label>
                  </div>
                </div>

              </div>

              {/* Right Column: Order Summary & Payment Mode */}
              <div className="md:col-span-5 bg-[#E9E2D5]/30 p-5 rounded-xl border border-[#E9E2D5] flex flex-col justify-between">
                <div>
                  <h4 className="text-xs font-semibold uppercase tracking-wider text-[#344E41] mb-3">
                    Requisition Summary
                  </h4>

                  {/* Itemized List */}
                  <div className="space-y-2.5 max-h-48 overflow-y-auto mb-4 pr-1 divide-y divide-[#E9E2D5]/60 text-xs">
                    {cartItems.map((item) => (
                      <div key={`${item.productId}-${item.variantId}`} className="pt-2 flex justify-between">
                        <div>
                          <p className="font-medium text-[#344E41]">{item.name}</p>
                          <p className="text-[11px] text-[#829267]">{item.variantName} × {item.quantity}</p>
                        </div>
                        <span className="font-mono text-[#344E41] tabular-nums">
                          ₱{(item.price * item.quantity).toFixed(2)}
                        </span>
                      </div>
                    ))}
                  </div>

                  {/* Totals */}
                  <div className="space-y-1.5 text-xs text-[#575D56] pt-3 border-t border-[#E9E2D5]">
                    <div className="flex justify-between">
                      <span>Subtotal</span>
                      <span className="font-mono tabular-nums text-[#344E41]">₱{subtotal.toFixed(2)}</span>
                    </div>
                    {discountAmount > 0 && (
                      <div className="flex justify-between text-[#829267]">
                        <span>Applied Discount</span>
                        <span className="font-mono tabular-nums">-₱{discountAmount.toFixed(2)}</span>
                      </div>
                    )}
                    <div className="flex justify-between">
                      <span>Shipping ({shippingMethod})</span>
                      <span className="font-mono tabular-nums text-[#344E41]">₱{shippingFee.toFixed(2)}</span>
                    </div>
                    <div className="flex justify-between text-sm font-semibold text-[#344E41] pt-2 border-t border-[#E9E2D5]">
                      <span>Final Order Total</span>
                      <span className="font-editorial text-2xl font-bold tabular-nums">₱{total.toFixed(2)}</span>
                    </div>
                  </div>

                  {/* Payment Method Selector */}
                  <div className="mt-6 pt-4 border-t border-[#E9E2D5]">
                    <label className="text-xs font-semibold text-[#344E41] block mb-2">
                      Payment / Billing Arrangement:
                    </label>
                    <div className="grid grid-cols-2 gap-2 text-xs">
                      {[
                        { id: 'Card', label: 'Credit Card / Wire' },
                        { id: 'Wire/Zelle', label: 'Bank Wire / Zelle' },
                        { id: 'Crypto', label: 'Crypto (USDC/BTC)' },
                        { id: 'PO/Invoice', label: 'Institutional Net 30' }
                      ].map((m) => (
                        <button
                          key={m.id}
                          type="button"
                          onClick={() => setPaymentMethod(m.id as any)}
                          className={`p-2 rounded-md border text-center transition-colors ${
                            paymentMethod === m.id
                              ? 'border-[#344E41] bg-[#344E41] text-[#F8F6F0]'
                              : 'border-[#E9E2D5] bg-[#F8F6F0] text-[#575D56] hover:bg-[#E9E2D5]/50'
                          }`}
                        >
                          {m.label}
                        </button>
                      ))}
                    </div>
                  </div>

                </div>

                {/* Submit Action */}
                <div className="mt-6 pt-4 border-t border-[#E9E2D5]">
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="w-full py-3.5 px-6 rounded-lg bg-[#344E41] text-[#F8F6F0] font-medium text-sm hover:bg-[#24372D] flex items-center justify-center gap-2 transition-colors cursor-pointer disabled:opacity-50"
                  >
                    {isSubmitting ? (
                      <>
                        <Loader2 className="w-4 h-4 animate-spin text-[#A3B18A]" />
                        <span>Transmitting Order...</span>
                      </>
                    ) : (
                      <span>Place Research Order — ₱${total.toFixed(2)}</span>
                    )}
                  </button>

                  <div className="mt-3 flex items-center justify-center gap-1.5 text-[11px] text-[#829267]">
                    <ShieldCheck className="w-3.5 h-3.5" />
                    <span>Transmitted to Apps Script fulfillment database</span>
                  </div>
                </div>

              </div>

            </div>
          </form>
        )}

      </div>
    </div>
  );
};
