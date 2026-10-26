import React from 'react';
import { ShoppingBag, Search, ShieldCheck, Compass, FileText, Settings } from 'lucide-react';

interface HeaderProps {
  cartCount: number;
  onOpenCart: () => void;
  onOpenOrderLookup: () => void;
  onOpenAdmin: () => void;
  onNavigateSection: (sectionId: string) => void;
}

export const Header: React.FC<HeaderProps> = ({
  cartCount,
  onOpenCart,
  onOpenOrderLookup,
  onOpenAdmin,
  onNavigateSection
}) => {
  return (
    <header className="sticky top-0 z-40 bg-[#F8F6F0]/95 backdrop-blur-md border-b border-[#E9E2D5]">
      {/* Top Bar: Exactly 3 Zones */}
      <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between gap-8">
        
        {/* Zone 1: Single Brand Wordmark */}
        <button 
          onClick={() => onNavigateSection('hero')}
          className="flex items-center gap-2.5 text-left group focus:outline-none focus-visible:ring-2 focus-visible:ring-[#344E41]"
        >
          <div className="w-8 h-8 rounded-full bg-[#344E41] flex items-center justify-center text-[#F8F6F0] transition-transform duration-200 group-hover:scale-105">
            <svg className="w-4 h-4 fill-current text-[#A3B18A]" viewBox="0 0 24 24">
              <path d="M17 8C8 10 5.9 16.17 3.82 21.34l1.89.66.95-2.3c.48.17.98.3 1.34.3C19 20 22 3 22 3c-1 2-8 2.25-13 3.25S2 11.5 2 13.5s1.75 3.75 1.75 3.75C7 8 17 8 17 8z"/>
            </svg>
          </div>
          <span className="font-editorial text-2xl font-bold tracking-tight text-[#344E41] whitespace-nowrap shrink-0">
            PeptLab
          </span>
        </button>

        {/* Zone 2: 4-5 Clean Nav Links */}
        <nav className="hidden md:flex items-center gap-7 text-sm font-medium text-[#575D56]">
          <button 
            onClick={() => onNavigateSection('catalog')}
            className="hover:text-[#344E41] transition-colors whitespace-nowrap shrink-0 focus:outline-none"
          >
            Catalog
          </button>
          <button 
            onClick={() => onNavigateSection('series')}
            className="hover:text-[#344E41] transition-colors whitespace-nowrap shrink-0 focus:outline-none"
          >
            Research Series
          </button>
          <button 
            onClick={() => onNavigateSection('quality')}
            className="hover:text-[#344E41] transition-colors whitespace-nowrap shrink-0 focus:outline-none"
          >
            Quality & COA
          </button>
          <button 
            onClick={onOpenOrderLookup}
            className="hover:text-[#344E41] transition-colors whitespace-nowrap shrink-0 focus:outline-none flex items-center gap-1.5"
          >
            <span>Track Order</span>
          </button>
          <button 
            onClick={onOpenAdmin}
            className="hover:text-[#344E41] transition-colors whitespace-nowrap shrink-0 focus:outline-none text-[#344E41]/80 hover:text-[#344E41]"
          >
            Admin Portal
          </button>
        </nav>

        {/* Zone 3: Primary Action (Cart Drawer Trigger) */}
        <div className="flex items-center gap-3 shrink-0">
          <button
            onClick={onOpenCart}
            aria-label="View shopping cart"
            className="relative flex items-center gap-2 px-4 py-2.5 rounded-lg bg-[#344E41] text-[#F8F6F0] hover:bg-[#24372D] transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-[#344E41] whitespace-nowrap shrink-0 cursor-pointer text-sm font-medium"
          >
            <ShoppingBag className="w-4 h-4 text-[#A3B18A]" />
            <span>Bag</span>
            {cartCount > 0 && (
              <span className="ml-1 px-1.5 py-0.2 text-xs font-semibold bg-[#A3B18A] text-[#24372D] rounded-full tabular-nums">
                {cartCount}
              </span>
            )}
          </button>
        </div>

      </div>
    </header>
  );
};
