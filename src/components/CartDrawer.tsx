import React, { useState } from 'react';
import { CartItem } from '../types';
import { X, Plus, Minus, Trash2, ArrowRight, ShieldCheck, Tag } from 'lucide-react';
import { formatProductImageUrl } from '../utils/storage';

interface CartDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  items: CartItem[];
  onUpdateQuantity: (productId: string, variantId: string, delta: number) => void;
  onRemoveItem: (productId: string, variantId: string) => void;
  onProceedToCheckout: () => void;
  promoCode: string;
  setPromoCode: (code: string) => void;
  discountRate: number;
  onApplyPromo: (code: string) => boolean;
}

const FREE_SHIPPING_THRESHOLD = 150.00;

export const CartDrawer: React.FC<CartDrawerProps> = ({
  isOpen,
  onClose,
  items,
  onUpdateQuantity,
  onRemoveItem,
  onProceedToCheckout,
  promoCode,
  setPromoCode,
  discountRate,
  onApplyPromo,
}) => {
  const [promoInput, setPromoInput] = useState('');
  const [promoMessage, setPromoMessage] = useState<{ text: string; isError: boolean } | null>(null);

  if (!isOpen) return null;

  const subtotal = items.reduce((sum, item) => sum + item.price * item.quantity, 0);
  const discountAmount = subtotal * discountRate;
  const shippingFee = subtotal >= FREE_SHIPPING_THRESHOLD || subtotal === 0 ? 0 : 9.95;
  const total = Math.max(0, subtotal - discountAmount + shippingFee);
  const remainingForFreeShipping = Math.max(0, FREE_SHIPPING_THRESHOLD - subtotal);
  const progressPercent = Math.min(100, (subtotal / FREE_SHIPPING_THRESHOLD) * 100);

  const handleApplyPromo = (e: React.FormEvent) => {
    e.preventDefault();
    if (!promoInput.trim()) return;
    const success = onApplyPromo(promoInput.trim());
    if (success) {
      setPromoMessage({ text: 'Promo code applied successfully!', isError: false });
    } else {
      setPromoMessage({ text: 'Invalid promo code (Try "BOTANICAL10" or "PEPTLAB")', isError: true });
    }
  };

  return (
    <div className="fixed inset-0 z-50 overflow-hidden bg-black/40 backdrop-blur-xs flex justify-end">
      <div 
        className="w-full max-w-md bg-[#F8F6F0] h-full shadow-2xl flex flex-col justify-between border-l border-[#E9E2D5] transform transition-transform duration-300 ease-in-out"
        onClick={(e) => e.stopPropagation()}
      >
        
        {/* Header */}
        <div className="px-6 py-5 border-b border-[#E9E2D5] flex items-center justify-between bg-[#F8F6F0]">
          <div className="flex items-center gap-2">
            <h3 className="font-editorial text-2xl font-bold text-[#344E41]">Research Bag</h3>
            <span className="text-xs font-mono text-[#829267] tabular-nums">({items.length} items)</span>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full border border-[#E9E2D5] flex items-center justify-center text-[#575D56] hover:text-[#344E41] hover:bg-[#E9E2D5] transition-colors"
            aria-label="Close cart"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Free Shipping Progress Indicator */}
        <div className="bg-[#E9E2D5]/40 px-6 py-3 border-b border-[#E9E2D5]">
          <div className="flex justify-between items-center text-xs mb-1.5">
            <span className="text-[#575D56]">
              {remainingForFreeShipping > 0 ? (
                <>Add <strong className="text-[#344E41] font-mono tabular-nums">₱{remainingForFreeShipping.toFixed(2)}</strong> for Free Express Cold-Pack</>
              ) : (
                <span className="text-[#344E41] font-medium">✓ Complimentary Express Cold-Pack Unlocked</span>
              )}
            </span>
            <span className="text-[11px] font-mono text-[#829267]">{progressPercent.toFixed(0)}%</span>
          </div>
          <div className="w-full bg-[#E9E2D5] rounded-full h-1.5 overflow-hidden">
            <div
              className="bg-[#A3B18A] h-full transition-all duration-300"
              style={{ width: `${progressPercent}%` }}
            />
          </div>
        </div>

        {/* Items Scrollable List */}
        <div className="flex-1 overflow-y-auto px-6 py-4 divide-y divide-[#E9E2D5]">
          {items.length === 0 ? (
            <div className="h-full flex flex-col items-center justify-center text-center py-16">
              <div className="w-16 h-16 rounded-full bg-[#E9E2D5]/50 flex items-center justify-center text-[#829267] mb-4">
                <Tag className="w-6 h-6" />
              </div>
              <p className="font-editorial text-xl font-medium text-[#344E41]">Your research bag is empty</p>
              <p className="text-xs text-[#575D56] max-w-xs mt-1">
                Browse our analytical peptide catalog and select formulation vials to begin your requisition.
              </p>
            </div>
          ) : (
            items.map((item) => (
              <div key={`${item.productId}-${item.variantId}`} className="py-4 flex gap-4 items-start">
                {/* Thumbnail */}
                <div className="w-16 h-16 rounded-lg bg-[#E9E2D5] overflow-hidden shrink-0 border border-[#E9E2D5]">
                  <img
                    src={formatProductImageUrl(item.imageUrl)}
                    alt={item.name}
                    className="w-full h-full object-cover"
                    referrerPolicy="no-referrer"
                  />
                </div>

                {/* Details */}
                <div className="flex-1 min-w-0">
                  <h4 className="text-sm font-semibold text-[#344E41] truncate leading-tight">
                    {item.name}
                  </h4>
                  <p className="text-xs text-[#829267] mt-0.5 truncate">{item.variantName}</p>
                  
                  <div className="flex items-center justify-between mt-3">
                    {/* Stepper */}
                    <div className="flex items-center border border-[#E9E2D5] rounded bg-[#F8F6F0]">
                      <button
                        onClick={() => onUpdateQuantity(item.productId, item.variantId, -1)}
                        className="px-2 py-0.5 text-[#575D56] hover:text-[#344E41]"
                        aria-label="Decrease"
                      >
                        <Minus className="w-3 h-3" />
                      </button>
                      <span className="px-2.5 text-xs font-mono font-semibold text-[#344E41] tabular-nums">
                        {item.quantity}
                      </span>
                      <button
                        onClick={() => onUpdateQuantity(item.productId, item.variantId, 1)}
                        className="px-2 py-0.5 text-[#575D56] hover:text-[#344E41]"
                        aria-label="Increase"
                      >
                        <Plus className="w-3 h-3" />
                      </button>
                    </div>

                    {/* Item Total Price */}
                    <span className="font-editorial text-base font-bold text-[#344E41] tabular-nums">
                      ₱{(item.price * item.quantity).toFixed(2)}
                    </span>
                  </div>
                </div>

                {/* Remove */}
                <button
                  onClick={() => onRemoveItem(item.productId, item.variantId)}
                  className="text-[#829267] hover:text-[#C4866A] p-1 transition-colors"
                  aria-label="Remove item"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            ))
          )}
        </div>

        {/* Footer: Promos & Checkout */}
        {items.length > 0 && (
          <div className="p-6 border-t border-[#E9E2D5] bg-[#F8F6F0] space-y-4">
            
            {/* Promo Code Input */}
            <form onSubmit={handleApplyPromo} className="flex gap-2">
              <input
                type="text"
                placeholder="Promo code (e.g. BOTANICAL10)"
                value={promoInput}
                onChange={(e) => setPromoInput(e.target.value)}
                className="flex-1 px-3 py-1.5 text-xs rounded-lg bg-[#F8F6F0] border border-[#E9E2D5] text-[#292D29] uppercase focus:outline-none focus:ring-1 focus:ring-[#344E41]"
              />
              <button
                type="submit"
                className="px-3 py-1.5 text-xs font-medium bg-[#E9E2D5] text-[#344E41] hover:bg-[#D8CEBD] rounded-lg transition-colors cursor-pointer"
              >
                Apply
              </button>
            </form>
            {promoMessage && (
              <p className={`text-[11px] ${promoMessage.isError ? 'text-[#C4866A]' : 'text-[#829267]'}`}>
                {promoMessage.text}
              </p>
            )}

            {/* Calculations */}
            <div className="space-y-1.5 text-xs text-[#575D56] pt-2 border-t border-[#E9E2D5]/70">
              <div className="flex justify-between">
                <span>Subtotal</span>
                <span className="font-mono tabular-nums text-[#344E41]">₱{subtotal.toFixed(2)}</span>
              </div>
              {discountRate > 0 && (
                <div className="flex justify-between text-[#829267]">
                  <span>Discount ({(discountRate * 100).toFixed(0)}%)</span>
                  <span className="font-mono tabular-nums">-₱{discountAmount.toFixed(2)}</span>
                </div>
              )}
              <div className="flex justify-between">
                <span>Cold-Chain Shipping</span>
                <span className="font-mono tabular-nums text-[#344E41]">
                  {shippingFee === 0 ? 'Complimentary' : `₱${shippingFee.toFixed(2)}`}
                </span>
              </div>
              <div className="flex justify-between text-sm font-semibold text-[#344E41] pt-2 border-t border-[#E9E2D5]">
                <span>Estimated Total</span>
                <span className="font-editorial text-2xl font-bold tabular-nums">₱{total.toFixed(2)}</span>
              </div>
            </div>

            {/* Checkout Action */}
            <button
              onClick={onProceedToCheckout}
              className="w-full py-3.5 px-6 rounded-lg bg-[#344E41] text-[#F8F6F0] font-medium text-sm hover:bg-[#24372D] flex items-center justify-center gap-2 transition-colors cursor-pointer group"
            >
              <span>Proceed to Checkout</span>
              <ArrowRight className="w-4 h-4 text-[#A3B18A] transition-transform duration-200 group-hover:translate-x-1" />
            </button>
            
            <p className="text-[11px] text-center text-[#829267]">
              Thermal insulation & continuous temperature monitoring included.
            </p>
          </div>
        )}

      </div>
    </div>
  );
};
