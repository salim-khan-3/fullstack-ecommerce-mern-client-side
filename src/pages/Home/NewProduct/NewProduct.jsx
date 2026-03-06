import React, { useEffect, useState, useCallback } from "react";
import useEmblaCarousel from "embla-carousel-react";
import { ChevronLeft, ChevronRight, ArrowUpRight } from "lucide-react";
import ProductCard from "../FeaturedProduct/ProductCard";
import { getNewProducts } from "../../../utils/api/productApi";

const NewProduct = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  const [emblaRef, emblaApi] = useEmblaCarousel({
    breakpoints: {
      "(min-width: 1024px)": { active: false },
    },
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
      <div className="flex items-end justify-between mb-8">
        <div>
          <div className="h-3 w-24 bg-gray-200 rounded animate-pulse mb-3" />
          <div className="h-8 w-40 bg-gray-200 rounded animate-pulse mb-1" />
          <div className="h-8 w-32 bg-gray-100 rounded animate-pulse" />
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
        @import url('https://fonts.googleapis.com/css2?family=Bebas+Neue&display=swap');
        .np-bebas { font-family: 'Bebas Neue', sans-serif; }
      `}</style>

      <div className="mb-12">

        {/* Header */}
        <div className="flex items-end justify-between mb-8">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <div className="w-6 h-[2px] bg-emerald-500 rounded-full" />
              <span className="text-[10px] font-bold tracking-[3px] text-emerald-500 uppercase">
                Latest Arrivals
              </span>
            </div>
            <div className="np-bebas leading-none">
              <div className="text-[42px] text-gray-900 tracking-wide">NEW</div>
              <div
                className="text-[42px] tracking-wide"
                style={{ WebkitTextStroke: "1.5px #111", color: "transparent" }}
              >
                PRODUCTS
              </div>
            </div>
            <p className="text-xs text-gray-400 mt-2 leading-relaxed max-w-[260px]">
              Fresh arrivals straight from our latest stock — updated daily.
            </p>
          </div>

          <div className="flex flex-col items-end gap-3 pb-1">
            <button className="flex items-center gap-1.5 text-[11px] font-bold tracking-wider text-gray-700 uppercase hover:text-gray-900 transition-colors duration-150">
              View All Products <ArrowUpRight size={13} />
            </button>
            <div className="flex items-center gap-2">
              <div className="w-16 h-[2px] bg-gray-200 rounded-full" />
              <button
                onClick={scrollPrev}
                className="w-8 h-8 rounded-full border border-gray-200 flex items-center justify-center text-gray-500 hover:bg-gray-900 hover:border-gray-900 hover:text-white transition-all duration-150"
              >
                <ChevronLeft size={15} />
              </button>
              <button
                onClick={scrollNext}
                className="w-8 h-8 rounded-full border border-gray-200 flex items-center justify-center text-gray-500 hover:bg-gray-900 hover:border-gray-900 hover:text-white transition-all duration-150"
              >
                <ChevronRight size={15} />
              </button>
            </div>
          </div>
        </div>

        {/* Slider & Grid */}
        <div className="overflow-hidden lg:overflow-visible" ref={emblaRef}>
          <div className="flex lg:grid lg:grid-cols-4 lg:gap-4">
            {products.map((product) => (
              <div
                key={product._id}
                className="flex-[0_0_50%] min-w-0 md:flex-[0_0_33.33%] lg:flex-none lg:w-full px-2 lg:px-0"
              >
                <ProductCard product={product} />
              </div>
            ))}
          </div>
        </div>
      </div>
    </>
  );
};

export default NewProduct;