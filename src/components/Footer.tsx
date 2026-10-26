import React from 'react';

interface FooterProps {
  onNavigateSection: (sectionId: string) => void;
  onOpenOrderLookup: () => void;
  onOpenAdmin: () => void;
}

export const Footer: React.FC<FooterProps> = ({
  onNavigateSection,
  onOpenOrderLookup,
  onOpenAdmin,
}) => {
  return (
    <footer className="bg-[#24372D] text-[#E9E2D5] pt-16 pb-12 border-t border-[#344E41]">
      <div className="max-w-7xl mx-auto px-6">
        
        <div className="grid grid-cols-1 md:grid-cols-12 gap-10 pb-12 border-b border-[#344E41]">
          
          {/* Brand Info */}
          <div className="md:col-span-5 space-y-4">
            <div className="flex items-center gap-2.5">
              <div className="w-7 h-7 rounded-full bg-[#A3B18A] flex items-center justify-center text-[#24372D]">
                <svg className="w-3.5 h-3.5 fill-current text-[#24372D]" viewBox="0 0 24 24">
                  <path d="M17 8C8 10 5.9 16.17 3.82 21.34l1.89.66.95-2.3c.48.17.98.3 1.34.3C19 20 22 3 22 3c-1 2-8 2.25-13 3.25S2 11.5 2 13.5s1.75 3.75 1.75 3.75C7 8 17 8 17 8z"/>
                </svg>
              </div>
              <span className="font-editorial text-2xl font-bold tracking-tight text-[#F8F6F0]">
                PeptLab
              </span>
            </div>

            <p className="text-xs text-[#E9E2D5]/70 max-w-sm leading-relaxed">
              Synthesizing analytical-grade reference peptides with botanical harmony and rigorous chromatographic transparency.
            </p>

            <div className="text-xs text-[#A3B18A] pt-2">
              Laboratory Concierge: support@peptlab.store · +1 (800) 412-PEPT
            </div>
          </div>

          {/* Quick Links */}
          <div className="md:col-span-2 space-y-3">
            <h5 className="text-xs font-semibold uppercase tracking-wider text-[#F8F6F0]">
              Navigation
            </h5>
            <ul className="space-y-2 text-xs text-[#E9E2D5]/75">
              <li>
                <button onClick={() => onNavigateSection('hero')} className="hover:text-white transition-colors">
                  Overview
                </button>
              </li>
              <li>
                <button onClick={() => onNavigateSection('catalog')} className="hover:text-white transition-colors">
                  Peptide Catalog
                </button>
              </li>
              <li>
                <button onClick={() => onNavigateSection('series')} className="hover:text-white transition-colors">
                  Research Series
                </button>
              </li>
              <li>
                <button onClick={() => onNavigateSection('quality')} className="hover:text-white transition-colors">
                  Lab Certifications
                </button>
              </li>
            </ul>
          </div>

          {/* Customer Self-Service */}
          <div className="md:col-span-2 space-y-3">
            <h5 className="text-xs font-semibold uppercase tracking-wider text-[#F8F6F0]">
              Requisitions
            </h5>
            <ul className="space-y-2 text-xs text-[#E9E2D5]/75">
              <li>
                <button onClick={onOpenOrderLookup} className="hover:text-white transition-colors text-left">
                  Track Existing Order
                </button>
              </li>
              <li>
                <button onClick={onOpenOrderLookup} className="hover:text-white transition-colors text-left">
                  Edit Pending Requisition
                </button>
              </li>
              <li>
                <button onClick={onOpenAdmin} className="text-[#A3B18A] hover:text-white transition-colors">
                  Admin Management
                </button>
              </li>
            </ul>
          </div>

          {/* Regulatory Disclaimer */}
          <div className="md:col-span-3 space-y-2">
            <h5 className="text-xs font-semibold uppercase tracking-wider text-[#F8F6F0]">
              Compliance Notice
            </h5>
            <p className="text-[11px] text-[#E9E2D5]/60 leading-relaxed">
              All compounds provided by PeptLab are intended exclusively for in-vitro laboratory research, chemical characterization, and analytical assays. Not for direct human or clinical diagnostic use.
            </p>
          </div>

        </div>

        {/* Bottom Bar */}
        <div className="pt-8 flex flex-col sm:flex-row items-center justify-between text-xs text-[#E9E2D5]/50 gap-4">
          <p>© {new Date().getFullYear()} PeptLab Bio-Molecular Sciences. All rights reserved.</p>
          <div className="flex gap-6 text-[11px]">
            <span>ISO 9001:2015 Compliant</span>
            <span>·</span>
            <span>Batch HPLC Audited</span>
            <span>·</span>
            <span>Cold-Chain Guaranteed</span>
          </div>
        </div>

      </div>
    </footer>
  );
};
