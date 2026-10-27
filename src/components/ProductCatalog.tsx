import React, { useState, useMemo } from 'react';
import { Product, ProductCategory, ProductVariant } from '../types';
import { Search, SlidersHorizontal, Plus, Check, Eye } from 'lucide-react';
import { formatProductImageUrl } from '../utils/storage';

interface ProductCatalogProps {
  products: Product[];
  selectedCategory: string;
  onCategoryChange: (category: string) => void;
  onSelectProduct: (product: Product) => void;
  onAddToCart: (product: Product, variant: ProductVariant, quantity: number) => void;
}

const CATEGORIES = [
  'All Series',
  'Longevity & Cellular',
  'Recovery & Tissue',
  'Cognitive & Neuro',
  'Aesthetic & Botanical',
];

export const ProductCatalog: React.FC<ProductCatalogProps> = ({
  products,
  selectedCategory,
  onCategoryChange,
  onSelectProduct,
  onAddToCart,
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [sortBy, setSortBy] = useState<'featured' | 'price-asc' | 'price-desc' | 'purity' | 'name'>('featured');
  const [selectedVariants, setSelectedVariants] = useState<Record<string, string>>({});
  const [justAddedId, setJustAddedId] = useState<string | null>(null);

  // Filter and sort products
  const filteredProducts = useMemo(() => {
    return products
      .filter((p) => p.isVisible)
      .filter((p) => {
        if (selectedCategory !== 'All Series' && p.series !== selectedCategory) {
          return false;
        }
        if (searchQuery.trim()) {
          const q = searchQuery.toLowerCase();
          const matchName = p.name.toLowerCase().includes(q);
          const matchCas = p.cas.toLowerCase().includes(q);
          const matchSeq = p.sequence.toLowerCase().includes(q);
          const matchDesc = p.description.toLowerCase().includes(q);
          return matchName || matchCas || matchSeq || matchDesc;
        }
        return true;
      })
      .sort((a, b) => {
        if (sortBy === 'price-asc') return a.basePrice - b.basePrice;
        if (sortBy === 'price-desc') return b.basePrice - a.basePrice;
        if (sortBy === 'purity') return b.purity - a.purity;
        if (sortBy === 'name') return a.name.localeCompare(b.name);
        return 0;
      });
  }, [products, selectedCategory, searchQuery, sortBy]);

  const handleVariantChange = (productId: string, variantId: string) => {
    setSelectedVariants((prev) => ({ ...prev, [productId]: variantId }));
  };

  const handleAdd = (product: Product) => {
    const chosenVariantId = selectedVariants[product.id] || product.variants[0]?.id;
    const variant = product.variants.find((v) => v.id === chosenVariantId) || product.variants[0];
    if (variant) {
      onAddToCart(product, variant, 1);
      setJustAddedId(product.id);
      setTimeout(() => setJustAddedId(null), 1500);
    }
  };

  return (
    <section id="catalog" className="py-20 bg-[#F8F6F0]">
      <div className="max-w-7xl mx-auto px-6">
        
        {/* Section Header */}
        <div className="mb-10 text-center max-w-2xl mx-auto">
          <div className="text-xs font-medium tracking-wider uppercase text-[#829267] mb-2">
            Analytical Lyophilized Compounds
          </div>
          <h2 className="font-editorial text-3xl sm:text-4xl font-medium text-[#344E41]">
            Standardized Peptide Catalog
          </h2>
          <p className="text-sm text-[#575D56] mt-3">
            Every lot is synthesised in an argon environment, verified by analytical HPLC & mass spectrometry, and sealed under sterile nitrogen.
          </p>
        </div>

        {/* Filter & Search Bar */}
        <div className="bg-[#E9E2D5]/40 rounded-xl p-3 border border-[#E9E2D5] mb-8 flex flex-col lg:flex-row gap-4 items-stretch lg:items-center justify-between">
          
          {/* Interactive Category Segmented Control */}
          <div className="flex flex-wrap items-center gap-1.5 p-1 bg-[#F8F6F0]/80 rounded-lg border border-[#E9E2D5]">
            {CATEGORIES.map((cat) => (
              <button
                key={cat}
                onClick={() => onCategoryChange(cat)}
                className={`px-3 py-1.5 text-xs font-medium rounded-md transition-colors cursor-pointer whitespace-nowrap shrink-0 ${
                  selectedCategory === cat
                    ? 'bg-[#344E41] text-[#F8F6F0] shadow-xs'
                    : 'text-[#575D56] hover:text-[#344E41] hover:bg-[#E9E2D5]/40'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>

          {/* Search & Sort Controls */}
          <div className="flex flex-col sm:flex-row items-center gap-3">
            <div className="relative w-full sm:w-64">
              <Search className="w-4 h-4 text-[#829267] absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
              <input
                type="text"
                placeholder="Search peptide, CAS #, sequence..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-9 pr-3 py-1.5 text-xs rounded-lg bg-[#F8F6F0] border border-[#E9E2D5] text-[#292D29] placeholder-[#829267]/60 focus:outline-none focus:ring-1 focus:ring-[#344E41]"
              />
            </div>

            <div className="flex items-center gap-2 w-full sm:w-auto">
              <span className="text-xs text-[#575D56] whitespace-nowrap">Sort:</span>
              <select
                value={sortBy}
                onChange={(e: any) => setSortBy(e.target.value)}
                className="py-1.5 px-3 text-xs rounded-lg bg-[#F8F6F0] border border-[#E9E2D5] text-[#292D29] focus:outline-none focus:ring-1 focus:ring-[#344E41]"
              >
                <option value="featured">Featured First</option>
                <option value="price-asc">Price: Low to High</option>
                <option value="price-desc">Price: High to Low</option>
                <option value="purity">Highest Purity (%)</option>
                <option value="name">Alphabetical</option>
              </select>
            </div>
          </div>

        </div>

        {/* Product Grid */}
        {filteredProducts.length === 0 ? (
          <div className="text-center py-20 bg-[#E9E2D5]/20 rounded-xl border border-dashed border-[#E9E2D5]">
            <p className="font-editorial text-xl text-[#344E41]">No peptides match your search.</p>
            <p className="text-xs text-[#575D56] mt-2">Try clearing your filters or search criteria.</p>
            <button
              onClick={() => {
                setSearchQuery('');
                onCategoryChange('All Series');
              }}
              className="mt-4 px-4 py-2 text-xs rounded-lg bg-[#344E41] text-[#F8F6F0]"
            >
              Reset Filters
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredProducts.map((product) => {
              const activeVariantId = selectedVariants[product.id] || product.variants[0]?.id;
              const activeVariant = product.variants.find((v) => v.id === activeVariantId) || product.variants[0];
              const isAdded = justAddedId === product.id;

              return (
                <div
                  key={product.id}
                  className="group bg-[#F8F6F0] rounded-xl border border-[#E9E2D5] overflow-hidden hover:border-[#A3B18A]/80 hover:shadow-xs transition-all duration-200 flex flex-col justify-between"
                >
                  {/* Product Visual Container (65-75% imagery height) */}
                  <div className="relative aspect-4/3 bg-[#E9E2D5]/40 overflow-hidden">
                    <img
                      src={formatProductImageUrl(product.imageUrl)}
                      alt={product.name}
                      className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-103"
                      referrerPolicy="no-referrer"
                      onError={(e) => {
                        // Fallback image handling
                        (e.target as HTMLImageElement).src = '/src/assets/images/product_peptide_vial_sage_1793001336509.jpg';
                      }}
                    />

                    {/* Quick View Button Overlay */}
                    <button
                      onClick={() => onSelectProduct(product)}
                      className="absolute bottom-3 right-3 px-3 py-1.5 rounded-md bg-[#F8F6F0]/90 backdrop-blur-sm text-[#344E41] text-xs font-medium border border-[#E9E2D5] opacity-0 group-hover:opacity-100 transition-opacity flex items-center gap-1.5 hover:bg-[#344E41] hover:text-[#F8F6F0]"
                    >
                      <Eye className="w-3.5 h-3.5" />
                      <span>Lab Details</span>
                    </button>
                  </div>

                  {/* Card Content & Metadata */}
                  <div className="p-6 flex-1 flex flex-col justify-between">
                    <div>
                      {/* Anti-Slop Unboxed Metadata with · separator */}
                      <div className="flex items-center gap-2 text-xs text-[#829267] font-medium mb-1.5">
                        <span>{product.series}</span>
                        <span aria-hidden="true">·</span>
                        <span className="font-mono">CAS {product.cas}</span>
                        <span aria-hidden="true">·</span>
                        <span className="text-[#344E41] font-semibold">HPLC {product.purity}%</span>
                      </div>

                      <h3
                        onClick={() => onSelectProduct(product)}
                        className="font-editorial text-2xl font-bold text-[#344E41] cursor-pointer hover:text-[#24372D] transition-colors leading-snug"
                      >
                        {product.name}
                      </h3>

                      <p className="text-xs text-[#575D56] line-clamp-2 mt-2 leading-relaxed">
                        {product.description}
                      </p>
                    </div>

                    {/* Variant Selector & Purchase Controls */}
                    <div className="mt-6 pt-4 border-t border-[#E9E2D5]">
                      
                      {/* Variant Selector Dropdown */}
                      {product.variants.length > 1 && (
                        <div className="mb-3">
                          <label className="text-[11px] font-medium text-[#575D56] block mb-1">
                            Format / Formulation:
                          </label>
                          <select
                            value={activeVariant?.id}
                            onChange={(e) => handleVariantChange(product.id, e.target.value)}
                            className="w-full text-xs py-1.5 px-2.5 rounded-md bg-[#F8F6F0] border border-[#E9E2D5] text-[#292D29] focus:outline-none focus:ring-1 focus:ring-[#344E41]"
                          >
                            {product.variants.map((v) => (
                              <option key={v.id} value={v.id}>
                                {v.name} — ₱{v.price.toFixed(2)}
                              </option>
                            ))}
                          </select>
                        </div>
                      )}

                      <div className="flex items-center justify-between gap-3">
                        <div>
                          <span className="text-xs text-[#829267] block">Research Unit Price</span>
                          <span className="font-editorial text-2xl font-bold text-[#344E41] tabular-nums">
                            ₱{(activeVariant?.price ?? product.basePrice).toFixed(2)}
                          </span>
                        </div>

                        <button
                          onClick={() => handleAdd(product)}
                          disabled={isAdded}
                          className={`px-4 py-2.5 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-colors cursor-pointer whitespace-nowrap shrink-0 ${
                            isAdded
                              ? 'bg-[#A3B18A] text-[#24372D]'
                              : 'bg-[#344E41] text-[#F8F6F0] hover:bg-[#24372D]'
                          }`}
                        >
                          {isAdded ? (
                            <>
                              <Check className="w-3.5 h-3.5" />
                              <span>Added</span>
                            </>
                          ) : (
                            <>
                              <Plus className="w-3.5 h-3.5" />
                              <span>Add to Bag</span>
                            </>
                          )}
                        </button>
                      </div>

                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}

      </div>
    </section>
  );
};
