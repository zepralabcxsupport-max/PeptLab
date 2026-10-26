import React, { useState } from 'react';
import { Product, ProductVariant } from '../types';
import { X, Check, FileCheck, Shield, Thermometer, FlaskConical, Plus, Minus, ShoppingBag } from 'lucide-react';
import { formatProductImageUrl } from '../utils/storage';

interface ProductDetailModalProps {
  product: Product | null;
  onClose: () => void;
  onAddToCart: (product: Product, variant: ProductVariant, quantity: number) => void;
}

export const ProductDetailModal: React.FC<ProductDetailModalProps> = ({
  product,
  onClose,
  onAddToCart,
}) => {
  if (!product) return null;

  const [selectedVariantId, setSelectedVariantId] = useState<string>(product.variants[0]?.id || '');
  const [quantity, setQuantity] = useState<number>(1);
  const [showCoaDeepDive, setShowCoaDeepDive] = useState<boolean>(false);
  const [isAdded, setIsAdded] = useState<boolean>(false);

  const currentVariant = product.variants.find((v) => v.id === selectedVariantId) || product.variants[0];
  const totalPrice = (currentVariant ? currentVariant.price : product.basePrice) * quantity;

  const handleAdd = () => {
    if (currentVariant) {
      onAddToCart(product, currentVariant, quantity);
      setIsAdded(true);
      setTimeout(() => {
        setIsAdded(false);
        onClose();
      }, 1200);
    }
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black/50 backdrop-blur-xs flex items-center justify-center p-4 md:p-8">
      <div 
        className="relative w-full max-w-4xl bg-[#F8F6F0] rounded-2xl border border-[#E9E2D5] shadow-xl overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 z-10 w-9 h-9 rounded-full bg-[#F8F6F0]/80 backdrop-blur-md border border-[#E9E2D5] flex items-center justify-center text-[#575D56] hover:text-[#344E41] hover:bg-[#E9E2D5] transition-colors"
          aria-label="Close dialog"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="grid grid-cols-1 md:grid-cols-12 max-h-[85vh] overflow-y-auto">
          
          {/* Left Column: Visual & Laboratory COA Summary */}
          <div className="md:col-span-6 bg-[#E9E2D5]/30 p-6 md:p-8 border-b md:border-b-0 md:border-r border-[#E9E2D5] flex flex-col justify-between">
            <div>
              <div className="aspect-4/3 rounded-xl overflow-hidden bg-[#E9E2D5] mb-6 border border-[#E9E2D5]">
                <img
                  src={formatProductImageUrl(product.imageUrl)}
                  alt={product.name}
                  className="w-full h-full object-cover"
                  referrerPolicy="no-referrer"
                  onError={(e) => {
                    (e.target as HTMLImageElement).src = '/src/assets/images/product_peptide_vial_sage_1793001336509.jpg';
                  }}
                />
              </div>

              {/* COA Badge Card */}
              <div className="bg-[#F8F6F0] rounded-xl p-4 border border-[#E9E2D5]">
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-2">
                    <FileCheck className="w-4 h-4 text-[#829267]" />
                    <span className="text-xs font-semibold text-[#344E41]">Batch Certificate of Analysis</span>
                  </div>
                  <span className="text-xs font-mono text-[#829267]">{product.coaData.batchNumber}</span>
                </div>

                <div className="space-y-1.5 text-xs text-[#575D56]">
                  <div className="flex justify-between">
                    <span>HPLC Tested Purity:</span>
                    <strong className="text-[#344E41] font-mono tabular-nums">{product.coaData.purityTested}%</strong>
                  </div>
                  <div className="flex justify-between">
                    <span>Endotoxin Assay:</span>
                    <span className="font-mono">{product.coaData.endotoxinLevel}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Testing Methodology:</span>
                    <span>{product.coaData.testMethod}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Accredited Lab:</span>
                    <span className="truncate max-w-[180px]">{product.coaData.labName}</span>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={() => setShowCoaDeepDive(!showCoaDeepDive)}
                  className="w-full mt-3 py-1.5 px-3 text-xs font-medium text-[#344E41] bg-[#E9E2D5]/50 hover:bg-[#E9E2D5] rounded-md transition-colors"
                >
                  {showCoaDeepDive ? 'Hide Full Lab Report' : 'Inspect Chromatogram & Report Details'}
                </button>

                {showCoaDeepDive && (
                  <div className="mt-3 pt-3 border-t border-[#E9E2D5] text-[11px] text-[#575D56] space-y-1 bg-[#F4EFE7] p-2.5 rounded">
                    <p><strong>Signed by:</strong> {product.coaData.analyst}</p>
                    <p><strong>Date of Assay:</strong> {product.coaData.testingDate}</p>
                    <p><strong>Matrix Stability:</strong> High-vacuum lyophilized cake with argon flush. Residual moisture &lt; 1.5%.</p>
                  </div>
                )}
              </div>
            </div>

            {/* Storage Guidelines */}
            <div className="mt-6 flex items-start gap-3 text-xs text-[#575D56] bg-[#F8F6F0]/60 p-3 rounded-lg border border-[#E9E2D5]">
              <Thermometer className="w-4 h-4 text-[#829267] shrink-0 mt-0.5" />
              <div>
                <strong className="text-[#344E41]">Storage:</strong> {product.storageTemp}
              </div>
            </div>
          </div>

          {/* Right Column: Contiguous Purchase Module & Scientific Details */}
          <div className="md:col-span-6 p-6 md:p-8 flex flex-col justify-between">
            <div>
              {/* Category & CAS */}
              <div className="flex items-center gap-2 text-xs text-[#829267] font-medium mb-1">
                <span>{product.series}</span>
                <span aria-hidden="true">·</span>
                <span className="font-mono">CAS {product.cas}</span>
                <span aria-hidden="true">·</span>
                <span className="text-[#344E41] font-semibold">Purity {product.purity}%</span>
              </div>

              <h2 className="font-editorial text-3xl font-bold text-[#344E41] mb-3">
                {product.name}
              </h2>

              <p className="text-sm text-[#575D56] leading-relaxed mb-6">
                {product.description}
              </p>

              {/* Chemical Sequence Box */}
              <div className="mb-6 p-3 rounded-lg bg-[#E9E2D5]/35 border border-[#E9E2D5]">
                <div className="text-[11px] font-medium text-[#829267] uppercase tracking-wider mb-1">
                  Peptide Amino Acid Sequence
                </div>
                <div className="font-mono text-xs text-[#344E41] break-all">
                  {product.sequence}
                </div>
                <div className="mt-1 text-[11px] text-[#575D56]">
                  MW: <span className="font-mono">{product.molecularWeight}</span>
                </div>
              </div>

              {/* Formulation Benefits */}
              <div className="mb-6">
                <h4 className="text-xs font-semibold uppercase tracking-wider text-[#344E41] mb-2.5">
                  Research Highlights
                </h4>
                <ul className="space-y-1.5 text-xs text-[#575D56]">
                  {product.benefits.map((b, idx) => (
                    <li key={idx} className="flex items-start gap-2">
                      <span className="w-1.5 h-1.5 rounded-full bg-[#A3B18A] mt-1.5 shrink-0" />
                      <span>{b}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Reconstitution & Dosage */}
              <div className="mb-6 p-3 rounded-lg bg-[#F4EFE7] border border-[#E9E2D5] text-xs text-[#575D56] space-y-1.5">
                <p><strong>Reconstitution:</strong> {product.reconstitutionGuide}</p>
                <p><strong>Reference Titration:</strong> {product.dosageGuide}</p>
              </div>

              {/* Variant Selector */}
              <div className="mb-6">
                <label className="text-xs font-semibold text-[#344E41] block mb-2">
                  Select Formulation / Vial Size:
                </label>
                <div className="grid grid-cols-1 gap-2">
                  {product.variants.map((v) => (
                    <button
                      key={v.id}
                      type="button"
                      onClick={() => setSelectedVariantId(v.id)}
                      className={`p-3 rounded-lg border text-left flex items-center justify-between text-xs transition-colors cursor-pointer ${
                        selectedVariantId === v.id
                          ? 'border-[#344E41] bg-[#344E41]/5 text-[#344E41]'
                          : 'border-[#E9E2D5] bg-[#F8F6F0] text-[#575D56] hover:border-[#A3B18A]'
                      }`}
                    >
                      <div>
                        <span className="font-medium text-[#344E41] block">{v.name}</span>
                        <span className="text-[11px] text-[#829267]">SKU: {v.sku} · In Stock ({v.stock})</span>
                      </div>
                      <span className="font-editorial text-lg font-bold text-[#344E41] tabular-nums">
                        ${v.price.toFixed(2)}
                      </span>
                    </button>
                  ))}
                </div>
              </div>

            </div>

            {/* Bottom Contiguous Buy Module */}
            <div className="pt-6 border-t border-[#E9E2D5]">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-3">
                  <span className="text-xs font-medium text-[#575D56]">Quantity:</span>
                  <div className="flex items-center border border-[#E9E2D5] rounded-md bg-[#F8F6F0]">
                    <button
                      type="button"
                      onClick={() => setQuantity(Math.max(1, quantity - 1))}
                      className="px-2.5 py-1 text-[#575D56] hover:text-[#344E41] transition-colors"
                      aria-label="Decrease quantity"
                    >
                      <Minus className="w-3.5 h-3.5" />
                    </button>
                    <span className="px-3 text-xs font-mono font-semibold text-[#344E41] tabular-nums">
                      {quantity}
                    </span>
                    <button
                      type="button"
                      onClick={() => setQuantity(quantity + 1)}
                      className="px-2.5 py-1 text-[#575D56] hover:text-[#344E41] transition-colors"
                      aria-label="Increase quantity"
                    >
                      <Plus className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>

                <div className="text-right">
                  <span className="text-xs text-[#829267] block">Total Amount</span>
                  <span className="font-editorial text-2xl font-bold text-[#344E41] tabular-nums">
                    ${totalPrice.toFixed(2)}
                  </span>
                </div>
              </div>

              <button
                type="button"
                onClick={handleAdd}
                disabled={isAdded}
                className={`w-full py-3.5 px-6 rounded-lg font-medium text-sm flex items-center justify-center gap-2 transition-colors cursor-pointer ${
                  isAdded
                    ? 'bg-[#A3B18A] text-[#24372D]'
                    : 'bg-[#344E41] text-[#F8F6F0] hover:bg-[#24372D]'
                }`}
              >
                {isAdded ? (
                  <>
                    <Check className="w-4 h-4" />
                    <span>Added to Research Bag</span>
                  </>
                ) : (
                  <>
                    <ShoppingBag className="w-4 h-4 text-[#A3B18A]" />
                    <span>Add to Bag — ${totalPrice.toFixed(2)}</span>
                  </>
                )}
              </button>
              
              <p className="text-[11px] text-center text-[#829267] mt-2">
                For in-vitro laboratory research and analytical characterization only.
              </p>
            </div>

          </div>

        </div>
      </div>
    </div>
  );
};
