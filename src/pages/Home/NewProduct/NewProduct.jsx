import React, { useEffect, useState, useCallback } from "react";
import useEmblaCarousel from "embla-carousel-react";
import { ChevronLeft, ChevronRight, ArrowUpRight } from "lucide-react";
import ProductCard from "../FeaturedProduct/ProductCard";
import ProductQuickView from "../ProductQuickView/ProductQuickView";
import { getNewProducts } from "../../../utils/api/productApi";

const NewProduct = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedProduct, setSelectedProduct] = useState(null);

  const [emblaRef, emblaApi] = useEmblaCarousel({
    breakpoints: { "(min-width: 1024px)": { active: false } },
    align: "start",
    dragFree: true,
  });

  const scrollPrev = useCallback(() => emblaApi?.scrollPrev(), [emblaApi]);
  const scrollNext = useCallback(() => emblaApi?.scrollNext(), [emblaApi]);

  useEffect(() => {
    getNewProducts(10)
      .then((data) => setProducts(data))
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  if (loading) return (
    <div className="mb-12">
      <div className="flex items-center justify-between mb-8">
        <div className="flex items-center gap-4">
          <div className="w-1 h-12 rounded-full bg-gray-200 animate-pulse" />
          <div>
            <div className="h-3 w-24 bg-gray-200 rounded-full animate-pulse mb-2" />
            <div className="h-6 w-40 bg-gray-200 rounded animate-pulse mb-1" />
            <div className="h-3 w-32 bg-gray-100 rounded animate-pulse" />
          </div>
        </div>
      </div>
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
        {[...Array(8)].map((_, i) => (
          <div key={i} className="rounded-xl overflow-hidden border border-gray-100">
            <div className="h-44 bg-gray-100 animate-pulse" />
            <div className="p-3 space-y-2">
              <div className="h-3 bg-gray-100 rounded animate-pulse" />
              <div className="h-3 w-2/3 bg-gray-100 rounded animate-pulse" />
              <div className="h-4 w-1/2 bg-gray-200 rounded animate-pulse" />
            </div>
          </div>
        ))}
      </div>
    </div>
  );

  if (!loading && products.length === 0) return null;

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;500;600;700;800&display=swap');
        .np-dm { font-family: 'DM Sans', sans-serif; }
      `}</style>

      <div className="np-dm mb-12">

        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-4">
            <div className="w-1 h-12 rounded-full bg-gradient-to-b from-emerald-400 to-teal-500" />
            <div>
              <div className="flex items-center gap-2 mb-1">
                <span className="text-[9px] font-black uppercase tracking-[3px] text-emerald-600 bg-emerald-50 px-2.5 py-0.5 rounded-full border border-emerald-100">
                  Latest Arrivals
                </span>
              </div>
              <h2 className="text-[22px] font-black text-gray-900 leading-tight tracking-tight">
                New{" "}
                <span className="bg-gradient-to-r from-emerald-500 to-teal-500 bg-clip-text text-transparent">
                  Products
                </span>
              </h2>
              <p className="text-[11px] text-gray-400 font-medium mt-0.5">
                Fresh arrivals — updated daily from latest stock.
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <button className="hidden sm:flex items-center gap-1.5 text-[11px] font-bold tracking-wider text-gray-500 uppercase hover:text-gray-900 transition-colors duration-150 mr-2">
              View All <ArrowUpRight size={13} />
            </button>
            <button
              onClick={scrollPrev}
              className="w-8 h-8 rounded-full border border-gray-200 flex items-center justify-center text-gray-500 hover:bg-gray-900 hover:border-gray-900 hover:text-white transition-all duration-200"
            >
              <ChevronLeft size={15} />
            </button>
            <button
              onClick={scrollNext}
              className="w-8 h-8 rounded-full border border-gray-200 flex items-center justify-center text-gray-500 hover:bg-gray-900 hover:border-gray-900 hover:text-white transition-all duration-200"
            >
              <ChevronRight size={15} />
            </button>
          </div>
        </div>

        {/* Slider & Grid */}
        <div className="overflow-hidden lg:overflow-visible" ref={emblaRef}>
          <div className="flex lg:grid lg:grid-cols-4">
            {products.map((product) => (
              <div
                key={product._id}
                className="flex-[0_0_100%] min-w-0 sm:flex-[0_0_50%] md:flex-[0_0_33.33%] lg:flex-none lg:w-full px-2 lg:px-0"
              >
                <ProductCard
                  product={product}
                  onQuickView={setSelectedProduct}
                />
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Quick View Modal */}
      {selectedProduct && (
        <ProductQuickView
          product={selectedProduct}
          onClose={() => setSelectedProduct(null)}
        />
      )}
    </>
  );
};

export default NewProduct;