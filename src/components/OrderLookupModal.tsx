import React, { useState, useEffect } from 'react';
import { Order, OrderStatus, ShippingAddress } from '../types';
import { X, Search, CheckCircle, Clock, Truck, Package, AlertCircle, Edit2, Save, Printer, ArrowLeft } from 'lucide-react';

interface OrderLookupModalProps {
  isOpen: boolean;
  onClose: () => void;
  orders: Order[];
  onUpdateOrder: (orderId: string, updates: Partial<Order>) => Promise<void>;
  onCancelOrder: (orderId: string) => Promise<void>;
  onOpenInvoice: (order: Order) => void;
  initialOrderId?: string;
}

const STATUS_STEPS: OrderStatus[] = ['Pending', 'Processing', 'Shipped', 'Delivered'];

export const OrderLookupModal: React.FC<OrderLookupModalProps> = ({
  isOpen,
  onClose,
  orders,
  onUpdateOrder,
  onCancelOrder,
  onOpenInvoice,
  initialOrderId,
}) => {
  const [lookupQuery, setLookupQuery] = useState(initialOrderId || '');
  const [activeOrder, setActiveOrder] = useState<Order | null>(null);
  const [lookupError, setLookupError] = useState('');
  
  // Pending Order Edit Mode state
  const [isEditingAddress, setIsEditingAddress] = useState(false);
  const [editAddress, setEditAddress] = useState<ShippingAddress | null>(null);
  const [isSaving, setIsSaving] = useState(false);
  const [successNotice, setSuccessNotice] = useState('');

  useEffect(() => {
    if (initialOrderId) {
      setLookupQuery(initialOrderId);
      const match = orders.find((o) => o.id.toLowerCase() === initialOrderId.toLowerCase());
      if (match) {
        setActiveOrder(match);
        setEditAddress(match.shippingAddress);
      }
    }
  }, [initialOrderId, orders]);

  if (!isOpen) return null;

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    setLookupError('');
    setSuccessNotice('');
    const q = lookupQuery.trim().toLowerCase();
    if (!q) {
      setLookupError('Please enter an Order ID or customer email.');
      return;
    }

    const found = orders.find(
      (o) => o.id.toLowerCase() === q || o.email.toLowerCase() === q || o.phone.includes(q)
    );

    if (found) {
      setActiveOrder(found);
      setEditAddress(found.shippingAddress);
      setLookupError('');
    } else {
      setActiveOrder(null);
      setLookupError(`No record found matching "${lookupQuery}". Please check your order ID (e.g. PL-2026-1042).`);
    }
  };

  const handleSaveAddress = async () => {
    if (!activeOrder || !editAddress) return;
    setIsSaving(true);
    try {
      await onUpdateOrder(activeOrder.id, {
        shippingAddress: editAddress,
        updatedAt: new Date().toISOString()
      });
      // update activeOrder local view
      setActiveOrder({
        ...activeOrder,
        shippingAddress: editAddress,
        updatedAt: new Date().toISOString()
      });
      setIsEditingAddress(false);
      setSuccessNotice('Your shipping destination has been updated successfully!');
      setTimeout(() => setSuccessNotice(''), 4000);
    } catch (err) {
      alert('Failed to update address. Please try again.');
    } finally {
      setIsSaving(false);
    }
  };

  const handleCancel = async () => {
    if (!activeOrder) return;
    if (confirm(`Are you sure you want to cancel Pending order #${activeOrder.id}?`)) {
      try {
        await onCancelOrder(activeOrder.id);
        setActiveOrder({
          ...activeOrder,
          status: 'Cancelled',
          updatedAt: new Date().toISOString()
        });
        setSuccessNotice('Order has been cancelled. Confirmation sent to email.');
      } catch (err) {
        alert('Could not cancel order.');
      }
    }
  };

  const getStepStatus = (step: OrderStatus, current: OrderStatus) => {
    if (current === 'Cancelled') return 'cancelled';
    const stepIdx = STATUS_STEPS.indexOf(step);
    const currIdx = STATUS_STEPS.indexOf(current);
    if (stepIdx < currIdx) return 'completed';
    if (stepIdx === currIdx) return 'active';
    return 'upcoming';
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black/50 backdrop-blur-xs flex items-center justify-center p-4 sm:p-6">
      <div 
        className="relative w-full max-w-3xl bg-[#F8F6F0] rounded-2xl border border-[#E9E2D5] shadow-2xl overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="px-6 py-4 border-b border-[#E9E2D5] flex items-center justify-between bg-[#F8F6F0]">
          <div className="flex items-center gap-2">
            <Clock className="w-5 h-5 text-[#829267]" />
            <h3 className="font-editorial text-2xl font-bold text-[#344E41]">Order Tracking & Self-Service</h3>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full border border-[#E9E2D5] flex items-center justify-center text-[#575D56] hover:text-[#344E41] hover:bg-[#E9E2D5] transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        <div className="p-6 sm:p-8 max-h-[80vh] overflow-y-auto">
          {/* Lookup Input Form */}
          <form onSubmit={handleSearch} className="mb-8">
            <label className="text-xs font-semibold uppercase tracking-wider text-[#344E41] block mb-2">
              Find Your Research Requisition
            </label>
            <div className="flex gap-2">
              <div className="relative flex-1">
                <Search className="w-4 h-4 text-[#829267] absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
                <input
                  type="text"
                  placeholder="Enter Order ID (e.g. PL-2026-1042) or email..."
                  value={lookupQuery}
                  onChange={(e) => setLookupQuery(e.target.value)}
                  className="w-full pl-9 pr-3 py-2.5 text-xs rounded-lg bg-[#F8F6F0] border border-[#E9E2D5] text-[#292D29] focus:outline-none focus:ring-1 focus:ring-[#344E41]"
                />
              </div>
              <button
                type="submit"
                className="px-5 py-2.5 rounded-lg bg-[#344E41] text-[#F8F6F0] font-medium text-xs hover:bg-[#24372D] transition-colors cursor-pointer"
              >
                Track Order
              </button>
            </div>

            {lookupError && (
              <p className="mt-2 text-xs text-[#C4866A] flex items-center gap-1.5">
                <AlertCircle className="w-3.5 h-3.5 shrink-0" />
                <span>{lookupError}</span>
              </p>
            )}

            {successNotice && (
              <p className="mt-2 text-xs text-[#344E41] bg-[#A3B18A]/20 p-2 rounded flex items-center gap-1.5">
                <CheckCircle className="w-3.5 h-3.5 shrink-0 text-[#344E41]" />
                <span>{successNotice}</span>
              </p>
            )}
          </form>

          {/* Active Order Details View */}
          {activeOrder && (
            <div className="space-y-6">
              
              {/* Top Banner: Status & Action Strip */}
              <div className="bg-[#E9E2D5]/35 rounded-xl p-5 border border-[#E9E2D5] flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                <div>
                  <div className="text-xs text-[#829267] font-medium">Requisition Details</div>
                  <div className="font-editorial text-2xl font-bold text-[#344E41]">
                    Order #{activeOrder.id}
                  </div>
                  <div className="text-xs text-[#575D56] mt-0.5">
                    Placed on {new Date(activeOrder.createdAt).toLocaleDateString()} · {activeOrder.customerName}
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    onClick={() => onOpenInvoice(activeOrder)}
                    className="px-3 py-1.5 rounded-lg border border-[#E9E2D5] bg-[#F8F6F0] text-xs font-medium text-[#344E41] hover:bg-[#E9E2D5] transition-colors flex items-center gap-1.5 cursor-pointer"
                  >
                    <Printer className="w-3.5 h-3.5" />
                    <span>Print Invoice</span>
                  </button>

                  <div className={`px-3 py-1 rounded-full text-xs font-semibold ${
                    activeOrder.status === 'Delivered'
                      ? 'bg-[#A3B18A]/30 text-[#344E41]'
                      : activeOrder.status === 'Cancelled'
                      ? 'bg-[#C4866A]/20 text-[#C4866A]'
                      : 'bg-[#344E41] text-[#F8F6F0]'
                  }`}>
                    {activeOrder.status}
                  </div>
                </div>
              </div>

              {/* Progress Stepper */}
              {activeOrder.status !== 'Cancelled' ? (
                <div className="py-4">
                  <div className="grid grid-cols-4 gap-2 text-center">
                    {STATUS_STEPS.map((step) => {
                      const state = getStepStatus(step, activeOrder.status);
                      return (
                        <div key={step} className="flex flex-col items-center">
                          <div className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-medium mb-1.5 transition-colors ${
                            state === 'completed'
                              ? 'bg-[#344E41] text-[#F8F6F0]'
                              : state === 'active'
                              ? 'bg-[#A3B18A] text-[#24372D] ring-4 ring-[#A3B18A]/20'
                              : 'bg-[#E9E2D5] text-[#575D56]'
                          }`}>
                            {state === 'completed' ? '✓' : step[0]}
                          </div>
                          <span className={`text-[11px] font-medium ${state === 'active' ? 'text-[#344E41] font-semibold' : 'text-[#575D56]'}`}>
                            {step}
                          </span>
                        </div>
                      );
                    })}
                  </div>
                </div>
              ) : (
                <div className="p-3 bg-[#C4866A]/10 border border-[#C4866A]/30 rounded-lg text-xs text-[#C4866A] flex items-center gap-2">
                  <AlertCircle className="w-4 h-4 shrink-0" />
                  <span>This order was cancelled while in Pending status. Any payment authorization has been released.</span>
                </div>
              )}

              {/* Shipping & Cold-Chain Details */}
              {activeOrder.trackingNumber && (
                <div className="p-4 bg-[#F4EFE7] rounded-xl border border-[#E9E2D5] flex items-center justify-between text-xs">
                  <div>
                    <span className="text-[#829267] block">Cold-Chain Carrier & Tracking</span>
                    <strong className="text-[#344E41] font-mono text-sm">{activeOrder.carrier}: {activeOrder.trackingNumber}</strong>
                  </div>
                  <span className="text-[#344E41] font-medium bg-[#A3B18A]/20 px-2.5 py-1 rounded">
                    Active Cold Pack
                  </span>
                </div>
              )}

              {/* Pending Order Self-Service Editing Section */}
              <div className="bg-[#F8F6F0] p-5 rounded-xl border border-[#E9E2D5]">
                <div className="flex items-center justify-between mb-3">
                  <h4 className="text-xs font-semibold uppercase tracking-wider text-[#344E41]">
                    Destination Address
                  </h4>
                  {activeOrder.status === 'Pending' && !isEditingAddress && (
                    <button
                      onClick={() => setIsEditingAddress(true)}
                      className="text-xs text-[#344E41] hover:text-[#24372D] flex items-center gap-1 font-medium underline cursor-pointer"
                    >
                      <Edit2 className="w-3 h-3" />
                      <span>Edit Destination (Pending Order)</span>
                    </button>
                  )}
                </div>

                {isEditingAddress && editAddress ? (
                  <div className="space-y-3 pt-2">
                    <div className="p-2.5 bg-[#A3B18A]/15 text-[#344E41] rounded text-[11px]">
                      Because your order is still in <strong>Pending</strong> status, you can update your delivery destination before our cleanroom seals the cold-chain package.
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
                      <div>
                        <label className="text-[11px] text-[#575D56] block">Street Address</label>
                        <input
                          type="text"
                          value={editAddress.street}
                          onChange={(e) => setEditAddress({ ...editAddress, street: e.target.value })}
                          className="w-full px-2.5 py-1.5 rounded border border-[#E9E2D5] bg-[#F8F6F0] text-xs"
                        />
                      </div>
                      <div>
                        <label className="text-[11px] text-[#575D56] block">Apt / Suite / Lab</label>
                        <input
                          type="text"
                          value={editAddress.aptSuite || ''}
                          onChange={(e) => setEditAddress({ ...editAddress, aptSuite: e.target.value })}
                          className="w-full px-2.5 py-1.5 rounded border border-[#E9E2D5] bg-[#F8F6F0] text-xs"
                        />
                      </div>
                      <div>
                        <label className="text-[11px] text-[#575D56] block">City</label>
                        <input
                          type="text"
                          value={editAddress.city}
                          onChange={(e) => setEditAddress({ ...editAddress, city: e.target.value })}
                          className="w-full px-2.5 py-1.5 rounded border border-[#E9E2D5] bg-[#F8F6F0] text-xs"
                        />
                      </div>
                      <div>
                        <label className="text-[11px] text-[#575D56] block">Postal Code</label>
                        <input
                          type="text"
                          value={editAddress.postalCode}
                          onChange={(e) => setEditAddress({ ...editAddress, postalCode: e.target.value })}
                          className="w-full px-2.5 py-1.5 rounded border border-[#E9E2D5] bg-[#F8F6F0] text-xs"
                        />
                      </div>
                      <div className="sm:col-span-2">
                        <label className="text-[11px] text-[#575D56] block">Delivery Instructions</label>
                        <input
                          type="text"
                          value={editAddress.deliveryNotes || ''}
                          onChange={(e) => setEditAddress({ ...editAddress, deliveryNotes: e.target.value })}
                          className="w-full px-2.5 py-1.5 rounded border border-[#E9E2D5] bg-[#F8F6F0] text-xs"
                        />
                      </div>
                    </div>

                    <div className="flex items-center gap-2 pt-2">
                      <button
                        onClick={handleSaveAddress}
                        disabled={isSaving}
                        className="px-4 py-2 rounded-lg bg-[#344E41] text-[#F8F6F0] text-xs font-medium hover:bg-[#24372D] flex items-center gap-1.5"
                      >
                        <Save className="w-3.5 h-3.5" />
                        <span>Save Address Updates</span>
                      </button>
                      <button
                        onClick={() => setIsEditingAddress(false)}
                        className="px-3 py-2 rounded-lg border border-[#E9E2D5] text-xs text-[#575D56] hover:bg-[#E9E2D5]/40"
                      >
                        Cancel
                      </button>
                    </div>
                  </div>
                ) : (
                  <div className="text-xs text-[#575D56] space-y-1">
                    <p className="font-medium text-[#344E41]">{activeOrder.shippingAddress.fullName}</p>
                    <p>{activeOrder.shippingAddress.street} {activeOrder.shippingAddress.aptSuite}</p>
                    <p>{activeOrder.shippingAddress.city}, {activeOrder.shippingAddress.postalCode} {activeOrder.shippingAddress.country}</p>
                    <p>Contact: {activeOrder.phone} · {activeOrder.email}</p>
                    {activeOrder.shippingAddress.deliveryNotes && (
                      <p className="text-[11px] text-[#829267] italic pt-1">
                        Note: {activeOrder.shippingAddress.deliveryNotes}
                      </p>
                    )}
                  </div>
                )}

                {/* Cancel Action for Pending status */}
                {activeOrder.status === 'Pending' && !isEditingAddress && (
                  <div className="mt-4 pt-3 border-t border-[#E9E2D5] flex items-center justify-between">
                    <span className="text-[11px] text-[#575D56]">Need to cancel this requisition?</span>
                    <button
                      onClick={handleCancel}
                      className="text-xs text-[#C4866A] hover:underline font-medium cursor-pointer"
                    >
                      Cancel Order
                    </button>
                  </div>
                )}
              </div>

              {/* Items Table */}
              <div className="border border-[#E9E2D5] rounded-xl overflow-hidden">
                <div className="bg-[#E9E2D5]/40 px-4 py-2.5 text-xs font-semibold text-[#344E41] flex justify-between">
                  <span>Requisitioned Peptides</span>
                  <span>Total (₱{activeOrder.total.toFixed(2)})</span>
                </div>
                <div className="divide-y divide-[#E9E2D5] p-2 text-xs">
                  {activeOrder.items.map((i, idx) => (
                    <div key={idx} className="p-2 flex justify-between items-center">
                      <div>
                        <strong className="text-[#344E41] block">{i.productName}</strong>
                        <span className="text-[11px] text-[#829267]">{i.variantName} × {i.quantity}</span>
                      </div>
                      <span className="font-mono tabular-nums text-[#344E41] font-medium">
                        ₱{i.subtotal.toFixed(2)}
                      </span>
                    </div>
                  ))}
                </div>
              </div>

            </div>
          )}

        </div>
      </div>
    </div>
  );
};
