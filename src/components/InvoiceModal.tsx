import React from 'react';
import { Order } from '../types';
import { X, Printer, Download, CheckCircle } from 'lucide-react';

interface InvoiceModalProps {
  order: Order | null;
  onClose: () => void;
}

export const InvoiceModal: React.FC<InvoiceModalProps> = ({ order, onClose }) => {
  if (!order) return null;

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black/60 backdrop-blur-xs flex items-center justify-center p-4 sm:p-6 print:p-0 print:bg-white">
      <div 
        className="relative w-full max-w-2xl bg-white text-[#292D29] rounded-xl shadow-2xl overflow-hidden print:shadow-none print:w-full print:max-w-none"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Modal Controls (Hidden in Print) */}
        <div className="px-6 py-3 bg-[#F8F6F0] border-b border-[#E9E2D5] flex items-center justify-between print:hidden">
          <div className="flex items-center gap-2 text-xs font-medium text-[#344E41]">
            <span>Laboratory Invoice Preview</span>
            <span className="font-mono text-[#829267]">#{order.id}</span>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={handlePrint}
              className="px-3 py-1.5 rounded-lg bg-[#344E41] text-white text-xs font-medium hover:bg-[#24372D] flex items-center gap-1.5 cursor-pointer"
            >
              <Printer className="w-3.5 h-3.5" />
              <span>Print / Save PDF</span>
            </button>
            <button
              onClick={onClose}
              className="w-8 h-8 rounded-full border border-[#E9E2D5] flex items-center justify-center text-[#575D56] hover:bg-[#E9E2D5]"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Printable Invoice Body */}
        <div className="p-8 sm:p-12 space-y-8 font-sans">
          
          {/* Header */}
          <div className="flex justify-between items-start border-b border-neutral-200 pb-6">
            <div>
              <div className="flex items-center gap-2 mb-1">
                <span className="font-editorial text-3xl font-bold text-[#344E41]">PeptLab</span>
                <span className="text-xs uppercase tracking-widest text-[#829267] font-sans">Bio-Molecular</span>
              </div>
              <p className="text-xs text-neutral-500">Certified Analytical Peptide Synthesis</p>
              <p className="text-xs text-neutral-500">ISO 9001:2015 · cGMP Research Grade</p>
              <p className="text-xs text-neutral-500">billing@peptlab.store</p>
            </div>

            <div className="text-right">
              <h2 className="text-2xl font-bold text-neutral-800">INVOICE</h2>
              <p className="text-xs text-neutral-500 font-mono mt-1">Invoice #: {order.id}</p>
              <p className="text-xs text-neutral-500">Date: {new Date(order.createdAt).toLocaleDateString()}</p>
              <p className="text-xs text-neutral-500">Status: <strong className="text-[#344E41]">{order.status}</strong></p>
            </div>
          </div>

          {/* Consignee & Order Metadata */}
          <div className="grid grid-cols-2 gap-8 text-xs">
            <div>
              <h4 className="font-semibold text-neutral-500 uppercase tracking-wider mb-2">Billed / Shipped To:</h4>
              <p className="font-bold text-neutral-900 text-sm">{order.shippingAddress.fullName}</p>
              <p className="text-neutral-700">{order.shippingAddress.street} {order.shippingAddress.aptSuite}</p>
              <p className="text-neutral-700">{order.shippingAddress.city}, {order.shippingAddress.state} {order.shippingAddress.postalCode}</p>
              <p className="text-neutral-700">{order.shippingAddress.country}</p>
              <p className="text-neutral-500 mt-1">Email: {order.email}</p>
              <p className="text-neutral-500">Phone: {order.phone}</p>
            </div>

            <div className="text-right">
              <h4 className="font-semibold text-neutral-500 uppercase tracking-wider mb-2">Logistics Specification:</h4>
              <p className="text-neutral-700">Payment: <strong className="text-neutral-900">{order.paymentMethod}</strong></p>
              <p className="text-neutral-700">Cold Chain: <strong className="text-neutral-900">{order.carrier || 'Insulated Thermal'}</strong></p>
              {order.trackingNumber && (
                <p className="text-neutral-700 font-mono">Tracking: {order.trackingNumber}</p>
              )}
              {order.orderNotes && (
                <p className="text-neutral-500 italic mt-2">Notes: {order.orderNotes}</p>
              )}
            </div>
          </div>

          {/* Table of Requisitioned Compounds */}
          <div className="border border-neutral-200 rounded-lg overflow-hidden">
            <table className="w-full text-left text-xs">
              <thead className="bg-[#F8F6F0] border-b border-neutral-200 text-neutral-700">
                <tr>
                  <th className="py-2.5 px-4 font-semibold">Peptide Compound</th>
                  <th className="py-2.5 px-4 font-semibold">Formulation Variant</th>
                  <th className="py-2.5 px-4 font-semibold text-right">Unit Price</th>
                  <th className="py-2.5 px-4 font-semibold text-right">Qty</th>
                  <th className="py-2.5 px-4 font-semibold text-right">Subtotal</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-neutral-200">
                {order.items.map((item, idx) => (
                  <tr key={idx}>
                    <td className="py-3 px-4 font-medium text-neutral-900">{item.productName}</td>
                    <td className="py-3 px-4 text-neutral-600">{item.variantName}</td>
                    <td className="py-3 px-4 text-right font-mono tabular-nums">${item.price.toFixed(2)}</td>
                    <td className="py-3 px-4 text-right font-mono tabular-nums">{item.quantity}</td>
                    <td className="py-3 px-4 text-right font-mono font-medium text-neutral-900 tabular-nums">
                      ${item.subtotal.toFixed(2)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Totals */}
          <div className="flex justify-end text-xs">
            <div className="w-64 space-y-2">
              <div className="flex justify-between text-neutral-600">
                <span>Subtotal:</span>
                <span className="font-mono tabular-nums">${order.subtotal.toFixed(2)}</span>
              </div>
              {order.discount > 0 && (
                <div className="flex justify-between text-[#829267]">
                  <span>Discount:</span>
                  <span className="font-mono tabular-nums">-${order.discount.toFixed(2)}</span>
                </div>
              )}
              <div className="flex justify-between text-neutral-600">
                <span>Cold-Chain Handling:</span>
                <span className="font-mono tabular-nums">
                  {order.shippingFee === 0 ? 'FREE' : `$${order.shippingFee.toFixed(2)}`}
                </span>
              </div>
              <div className="flex justify-between text-base font-bold text-[#344E41] pt-2 border-t border-neutral-200">
                <span>Total Amount:</span>
                <span className="font-mono tabular-nums">${order.total.toFixed(2)}</span>
              </div>
            </div>
          </div>

          {/* Footer Quality Stamp */}
          <div className="pt-6 border-t border-neutral-200 flex items-center justify-between text-[11px] text-neutral-500">
            <div>
              <p className="font-medium text-[#344E41]">Official PeptLab Analytical Certificate Included</p>
              <p>For in-vitro research use only. Lot HPLC purity verified ≥ 99%.</p>
            </div>
            <div className="text-right">
              <p className="font-mono">Authorized by: Dr. Elena Vance</p>
              <p>Senior Analytical Chemist, Quality Assurance</p>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
};
