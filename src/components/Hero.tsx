import React from 'react';
import { ArrowRight, ShieldCheck, Snowflake, Award } from 'lucide-react';

interface HeroProps {
  onExploreClick: () => void;
  onQualityClick: () => void;
}

export const Hero: React.FC<HeroProps> = ({ onExploreClick, onQualityClick }) => {
  return (
    <section id="hero" className="relative border-b border-[#E9E2D5] bg-[#F8F6F0] overflow-hidden">
      <div className="max-w-7xl mx-auto px-6 py-16 lg:py-24">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-center">
          
          {/* Left Column: Editorial Headline & Actions */}
          <div className="lg:col-span-6 flex flex-col justify-center">
            
            {/* Unboxed Metadata Kicker (Anti-Slop Zero-Pill) */}
            <div className="flex items-center gap-2 text-xs font-medium tracking-wider uppercase text-[#829267] mb-4">
              <span>Bio-Molecular Synthesis</span>
              <span aria-hidden="true">·</span>
              <span>Pharmaceutical Grade</span>
              <span aria-hidden="true">·</span>
              <span>Lot-Certified HPLC</span>
            </div>

            <h1 className="font-editorial text-4xl sm:text-5xl lg:text-6xl font-medium tracking-tight text-[#344E41] leading-[1.08] mb-6 text-balance">
              Precision peptides rooted in modern botanical harmony.
            </h1>

            <p className="text-base sm:text-lg text-[#575D56] leading-relaxed mb-8 max-w-xl">
              PeptLab crafts analytical-grade research peptides with validated chromatograms, certified cold-chain preservation, and strict batch-level transparency.
            </p>

            <div className="flex flex-wrap items-center gap-4">
              <button
                onClick={onExploreClick}
                className="inline-flex items-center gap-2 px-6 py-3.5 rounded-lg bg-[#344E41] text-[#F8F6F0] font-medium text-sm hover:bg-[#24372D] transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-[#344E41] cursor-pointer group"
              >
                <span>Explore Catalog</span>
                <ArrowRight className="w-4 h-4 text-[#A3B18A] transition-transform duration-200 group-hover:translate-x-1" />
              </button>

              <button
                onClick={onQualityClick}
                className="inline-flex items-center gap-2 px-6 py-3.5 rounded-lg border border-[#344E41]/30 text-[#344E41] font-medium text-sm hover:bg-[#E9E2D5]/50 transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-[#344E41] cursor-pointer"
              >
                <span>Lab Standards & COA</span>
              </button>
            </div>

            {/* Proof Points Strip (Adjacent to Claim) */}
            <div className="mt-12 pt-8 border-t border-[#E9E2D5] grid grid-cols-3 gap-6 text-left">
              <div>
                <p className="text-xl sm:text-2xl font-serif font-bold text-[#344E41] tabular-nums">≥ 99.2%</p>
                <p className="text-xs text-[#575D56] mt-0.5">HPLC Purity Minimum</p>
              </div>
              <div>
                <p className="text-xl sm:text-2xl font-serif font-bold text-[#344E41] tabular-nums">-20°C</p>
                <p className="text-xs text-[#575D56] mt-0.5">Cold-Chain Insulated</p>
              </div>
              <div>
                <p className="text-xl sm:text-2xl font-serif font-bold text-[#344E41] tabular-nums">100%</p>
                <p className="text-xs text-[#575D56] mt-0.5">Third-Party Verified</p>
              </div>
            </div>

          </div>

          {/* Right Column: Hero Visual Asset */}
          <div className="lg:col-span-6 relative">
            <div className="relative rounded-2xl overflow-hidden bg-[#E9E2D5] aspect-16/10 shadow-sm border border-[#E9E2D5]">
              <img
                src="/src/assets/images/hero_peptlab_botanical_1793001336256.jpg"
                alt="PeptLab pharmaceutical peptide vials resting on botanical travertine pedestal"
                className="w-full h-full object-cover"
                loading="eager"
                referrerPolicy="no-referrer"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[#292D29]/40 via-transparent to-transparent pointer-events-none" />
              
              {/* Subtle Natural Captions (Anti-slop, clean typography) */}
              <div className="absolute bottom-4 left-4 right-4 flex items-center justify-between text-xs text-white/90 backdrop-blur-md bg-[#24372D]/60 px-4 py-2 rounded-lg">
                <span className="font-medium">Batch PL-2026 Lyophilized Series</span>
                <span className="font-mono tabular-nums text-[#A3B18A]">HPLC 99.4% Verified</span>
              </div>
            </div>
          </div>

        </div>
      </div>
    </section>
  );
};
