import React from 'react';
import { ProductCategory } from '../types';
import { ArrowUpRight } from 'lucide-react';

interface ResearchSeriesProps {
  onSelectSeries: (series: ProductCategory) => void;
}

interface SeriesItem {
  key: ProductCategory;
  title: string;
  count: string;
  description: string;
  highlightCompound: string;
  image: string;
}

const SERIES_LIST: SeriesItem[] = [
  {
    key: 'Longevity & Cellular',
    title: 'Longevity & Cellular',
    count: '3 Formulations',
    description: 'Targeted mitochondrial coenzymes, telomerase activators, and metabolic biogenesis modulators.',
    highlightCompound: 'NAD+ · Epithalon · MOTS-c',
    image: '/src/assets/images/product_peptide_longevity_vial_1793001338973.jpg'
  },
  {
    key: 'Recovery & Tissue',
    title: 'Recovery & Tissue',
    count: '3 Formulations',
    description: 'High-affinity signaling peptides aiding tendon, ligament, gut mucosal, and vascular angiogenesis.',
    highlightCompound: 'BPC-157 · TB-500 · KPV',
    image: '/src/assets/images/product_peptide_vial_sage_1793001336509.jpg'
  },
  {
    key: 'Cognitive & Neuro',
    title: 'Cognitive & Neuro',
    count: '2 Formulations',
    description: 'Neuropeptide sequences engineered for neurotrophin expression (BDNF) and neuroprotection.',
    highlightCompound: 'Semax · Selank Complex',
    image: '/src/assets/images/hero_peptlab_botanical_1793001336256.jpg'
  },
  {
    key: 'Aesthetic & Botanical',
    title: 'Aesthetic & Botanical',
    count: '2 Formulations',
    description: 'Pure copper-chelated complexes and dermal signaling matrices supporting collagen density.',
    highlightCompound: 'GHK-Cu Tripeptide · SNAP-8',
    image: '/src/assets/images/product_peptide_ghk_copper_1793001337809.jpg'
  }
];

export const ResearchSeries: React.FC<ResearchSeriesProps> = ({ onSelectSeries }) => {
  return (
    <section id="series" className="py-20 bg-[#E9E2D5]/35 border-b border-[#E9E2D5]">
      <div className="max-w-7xl mx-auto px-6">
        
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 gap-6">
          <div>
            <div className="text-xs font-medium tracking-wider uppercase text-[#829267] mb-2">
              Curated Research Taxonomy
            </div>
            <h2 className="font-editorial text-3xl sm:text-4xl font-medium text-[#344E41]">
              Engineered Product Series
            </h2>
          </div>
          <p className="text-sm text-[#575D56] max-w-md">
            Each research family is synthesized under strict cGMP conditions, lyophilized in inert atmosphere, and third-party certified.
          </p>
        </div>

        {/* 4-Card Series Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {SERIES_LIST.map((item) => (
            <div
              key={item.key}
              onClick={() => onSelectSeries(item.key)}
              className="group cursor-pointer bg-[#F8F6F0] rounded-xl border border-[#E9E2D5] overflow-hidden hover:border-[#A3B18A] transition-all duration-300 flex flex-col justify-between"
            >
              {/* Image Preview */}
              <div className="aspect-4/3 overflow-hidden bg-[#E9E2D5] relative">
                <img
                  src={item.image}
                  alt={item.title}
                  className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                  referrerPolicy="no-referrer"
                />
                <div className="absolute top-3 right-3 w-8 h-8 rounded-full bg-[#F8F6F0]/90 backdrop-blur-sm flex items-center justify-center text-[#344E41] transition-colors group-hover:bg-[#344E41] group-hover:text-[#F8F6F0]">
                  <ArrowUpRight className="w-4 h-4" />
                </div>
              </div>

              {/* Card Body */}
              <div className="p-5 flex-1 flex flex-col justify-between">
                <div>
                  <div className="text-xs text-[#829267] font-medium mb-1">
                    {item.count}
                  </div>
                  <h3 className="font-editorial text-xl font-bold text-[#344E41] group-hover:text-[#24372D] transition-colors">
                    {item.title}
                  </h3>
                  <p className="text-xs text-[#575D56] leading-relaxed mt-2 line-clamp-2">
                    {item.description}
                  </p>
                </div>

                <div className="mt-4 pt-3 border-t border-[#E9E2D5]/70 flex items-center justify-between text-xs text-[#575D56]">
                  <span className="font-mono">{item.highlightCompound}</span>
                  <span className="font-medium text-[#344E41] group-hover:translate-x-0.5 transition-transform">
                    View Series →
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>

      </div>
    </section>
  );
};
