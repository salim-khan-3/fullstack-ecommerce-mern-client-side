import { useCallback, useEffect, useState } from "react";
import useEmblaCarousel from "embla-carousel-react";
import Autoplay from "embla-carousel-autoplay";
import { ChevronLeft, ChevronRight } from "lucide-react";
import ProductCard from "../../Home/FeaturedProduct/ProductCard";
import ProductQuickView from "../../Home/ProductQuickView/ProductQuickView";
import { getProductsByCategory } from "../../../utils/api/productApi";

const RelatedProduct = ({ categoryId, currentProductId }) => {
  const [products, setProducts]           = useState([]);
  const [loading, setLoading]             = useState(true);
  const [selectedProduct, setSelectedProduct] = useState(null);

  const [emblaRef, emblaApi] = useEmblaCarousel(
    { loop: true, align: "start", dragFree: true },
    [Autoplay({ delay: 4000, stopOnInteraction: false })]
  );

  const scrollPrev = useCallback(() => emblaApi?.scrollPrev(), [emblaApi]);
  const scrollNext = useCallback(() => emblaApi?.scrollNext(), [emblaApi]);

  useEffect(() => {
    if (!categoryId) return;
    setLoading(true);
    getProductsByCategory(categoryId)
      .then((prods) => {
        // current product বাদ দিয়ে max 8টা
        const related = prods
          .filter((p) => p._id !== currentProductId)
          .slice(0, 8);
        setProducts(related);
      })
      .catch(console.error)
      .finally(() => setLoading(false));
  }, [categoryId, currentProductId]);

  // Skeleton
  if (loading) return (
    <div className="mt-10 px-4 lg:px-0">
      <div className="h-6 w-48 bg-gray-200 rounded animate-pulse mb-6" />
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
        {[...Array(4)].map((_, i) => (
          <div key={i} className="rounded-xl overflow-hidden border border-gray-100">
            <div className="h-44 bg-gray-100 animate-pulse" />
            <div className="p-3 space-y-2">
              <div className="h-3 bg-gray-100 rounded animate-pulse" />
              <div className="h-3 w-2/3 bg-gray-100 rounded animate-pulse" />
            </div>
          </div>
        ))}
      </div>
    </div>
  );

  // No related products
  if (products.length === 0) return null;

  return (
    <div className="flex-grow mt-10 px-4 lg:px-0">

      {/* Header */}
      <div className="flex justify-between items-center mb-6">
        <h3 className="text-xl font-bold text-gray-900 uppercase tracking-tight">
          Related Products
        </h3>
        <div className="flex items-center gap-2">
          <button onClick={scrollPrev}
            className="w-8 h-8 rounded-full border border-gray-200 flex items-center justify-center text-gray-500 hover:bg-blue-600 hover:text-white hover:border-blue-600 transition-all">
            <ChevronLeft size={16} />
          </button>
          <button onClick={scrollNext}
            className="w-8 h-8 rounded-full border border-gray-200 flex items-center justify-center text-gray-500 hover:bg-blue-600 hover:text-white hover:border-blue-600 transition-all">
            <ChevronRight size={16} />
          </button>
        </div>
      </div>

      {/* Slider */}
      <div className="relative group">
        <div className="overflow-hidden rounded-lg" ref={emblaRef}>
          <div className="flex">
            {products.map((product) => (
              <div
                key={product._id}
                className="flex-shrink-0 w-full sm:w-1/2 md:w-1/3 lg:w-1/4"
              >
                <ProductCard
                  product={product}
                  onQuickView={setSelectedProduct}
                />
              </div>
            ))}
          </div>
        </div>

        {/* Hover arrows */}
        <button onClick={scrollPrev}
          className="absolute -left-5 top-1/2 -translate-y-1/2 bg-white border border-gray-200 p-3 rounded-full shadow-xl z-30 opacity-0 group-hover:opacity-100 transition-all duration-300 hover:bg-blue-600 hover:text-white">
          <ChevronLeft size={20} />
        </button>
        <button onClick={scrollNext}
          className="absolute -right-5 top-1/2 -translate-y-1/2 bg-white border border-gray-200 p-3 rounded-full shadow-xl z-30 opacity-0 group-hover:opacity-100 transition-all duration-300 hover:bg-blue-600 hover:text-white">
          <ChevronRight size={20} />
        </button>
      </div>

      {/* QuickView Modal */}
      {selectedProduct && (
        <ProductQuickView
          product={selectedProduct}
          onClose={() => setSelectedProduct(null)}
        />
      )}
    </div>
  );
};

export default RelatedProduct;