import React, { useCallback, useState, useEffect } from "react";
import useEmblaCarousel from "embla-carousel-react";
import Autoplay from "embla-carousel-autoplay";

import ProductCard from "./ProductCard";
import SectionHeader from "./SectionHeader";
import ProductQuickView from "../ProductQuickView/ProductQuickView";
import { getFeaturedProducts } from "../../../utils/api/productApi";

const FeaturedProduct = () => {
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getFeaturedProducts()
      .then(setProducts)
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  const [emblaRef, emblaApi] = useEmblaCarousel(
    { loop: true, align: "start", dragFree: true },
    [Autoplay({ delay: 4000, stopOnInteraction: true })]
  );

  const scrollPrev = useCallback(() => emblaApi?.scrollPrev(), [emblaApi]);
  const scrollNext = useCallback(() => emblaApi?.scrollNext(), [emblaApi]);

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Bebas+Neue&display=swap');
        .fp-bebas { font-family: 'Bebas Neue', sans-serif; }
      `}</style>

      <div className="mb-12">
        <SectionHeader onPrev={scrollPrev} onNext={scrollNext} />

        {loading ? (
          <div className="flex items-center justify-center h-48 gap-2 text-gray-300">
            <div className="animate-spin h-5 w-5 border-2 border-gray-300 border-t-gray-600 rounded-full" />
            <span className="text-sm">Loading products...</span>
          </div>
        ) : products.length === 0 ? (
          <div className="flex items-center justify-center h-48 text-gray-300 text-sm">
            No featured products found.
          </div>
        ) : (
          <div className="overflow-hidden" ref={emblaRef}>
            <div className="flex">
              {products.map((product) => (
                // mobile: 100% (1টা), sm: 50% (2টা), md: 33.33% (3টা), lg: 25% (4টা)
                <div
                  key={product._id}
                  className="flex-[0_0_100%] sm:flex-[0_0_50%] md:flex-[0_0_33.33%] lg:flex-[0_0_25%] min-w-0"
                >
                  <ProductCard
                    product={product}
                    onQuickView={setSelectedProduct}
                  />
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {selectedProduct && (
        <ProductQuickView
          product={selectedProduct}
          onClose={() => setSelectedProduct(null)}
        />
      )}
    </>
  );
};

export default FeaturedProduct;