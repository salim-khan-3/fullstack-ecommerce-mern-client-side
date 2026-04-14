import React, { useState, useEffect } from "react";
import useEmblaCarousel from "embla-carousel-react";
import { getProductsByCategory } from "../../../utils/api/productApi";
import PopularProductHeader from "./PopularProductHeader";
import ProductCard from "../FeaturedProduct/ProductCard";
import ProductQuickView from "../ProductQuickView/ProductQuickView";

const PopularProduct = () => {
  const [products, setProducts]               = useState([]);
  const [loadingProds, setLoadingProds]       = useState(false);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [windowWidth, setWindowWidth]         = useState(window.innerWidth);

  useEffect(() => {
    const handleResize = () => setWindowWidth(window.innerWidth);
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const [emblaRef] = useEmblaCarousel({
    breakpoints: { "(min-width: 1024px)": { active: false } },
    align: "start",
    dragFree: true,
  });

  const handleCategoryChange = (cat) => {
    if (!cat) return;
    setLoadingProds(true);
    getProductsByCategory(cat._id)
      .then((prods) => {
        // rating >= 4 হলেই popular, rating দিয়ে sort
        const popular = prods
          .filter((p) => Number(p.rating) >= 4)
          .sort((a, b) => Number(b.rating) - Number(a.rating));
        setProducts(popular);
      })
      .catch(console.error)
      .finally(() => setLoadingProds(false));
  };

  const ProductSkeleton = () => (
    <div className="rounded-xl overflow-hidden border border-gray-100">
      <div className="h-44 bg-gray-100 animate-pulse" />
      <div className="p-3 space-y-2">
        <div className="h-3 bg-gray-100 rounded animate-pulse" />
        <div className="h-3 w-2/3 bg-gray-100 rounded animate-pulse" />
        <div className="h-4 w-1/2 bg-gray-200 rounded animate-pulse" />
      </div>
    </div>
  );

  return (
    <>
      <div className="mb-12">
        <PopularProductHeader onCategoryChange={handleCategoryChange} />

        {loadingProds ? (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {[...Array(8)].map((_, i) => <ProductSkeleton key={i} />)}
          </div>
        ) : products.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-16 text-center">
            <div className="text-5xl mb-4">⭐</div>
            <p className="text-gray-400 font-semibold text-[14px]">
              No popular products found in this category.
            </p>
          </div>
        ) : (
          <div className="overflow-hidden lg:overflow-visible" ref={emblaRef}>
            <div className="flex lg:grid lg:grid-cols-4 lg:gap-4">
              {products.map((product) => (
                <div
                  key={product._id}
                  className="flex-[0_0_100%] min-w-0 md:flex-[0_0_33.33%] lg:flex-none lg:w-full px-2 lg:px-0"
                  style={{ flex: windowWidth >= 425 && windowWidth < 768 ? "0 0 50%" : undefined }}
                >
                  <ProductCard product={product} onQuickView={setSelectedProduct} />
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

export default PopularProduct;













// import React, { useState, useEffect, useCallback } from "react";
// import useEmblaCarousel from "embla-carousel-react";
// import { getProductsByCategory } from "../../../utils/api/productApi";
// import PopularProductHeader from "./PopularProductHeader";
// import ProductCard from "../FeaturedProduct/ProductCard";
// import ProductQuickView from "../ProductQuickView/ProductQuickView";

// const PopularProduct = () => {
//   const [products, setProducts]               = useState([]);
//   const [loadingProds, setLoadingProds]       = useState(false);
//   const [selectedProduct, setSelectedProduct] = useState(null);

//   const [emblaRef] = useEmblaCarousel({
//     breakpoints: { "(min-width: 1024px)": { active: false } },
//     align: "start",
//     dragFree: true,
//   });

//   // Called by PopularProductHeader when category changes
//   const handleCategoryChange = (cat) => {
//     if (!cat) return;
//     setLoadingProds(true);
//     getProductsByCategory(cat._id)
//       .then(setProducts)
//       .catch(console.error)
//       .finally(() => setLoadingProds(false));
//   };

//   const ProductSkeleton = () => (
//     <div className="rounded-xl overflow-hidden border border-gray-100">
//       <div className="h-44 bg-gray-100 animate-pulse" />
//       <div className="p-3 space-y-2">
//         <div className="h-3 bg-gray-100 rounded animate-pulse" />
//         <div className="h-3 w-2/3 bg-gray-100 rounded animate-pulse" />
//         <div className="h-4 w-1/2 bg-gray-200 rounded animate-pulse" />
//       </div>
//     </div>
//   );

//   return (
//     <>
//       <div className="mb-12">

//         {/* Header — categories fetched & managed inside */}
//         <PopularProductHeader onCategoryChange={handleCategoryChange} />

//         {/* Products */}
//         {loadingProds ? (
//           <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
//             {[...Array(8)].map((_, i) => <ProductSkeleton key={i} />)}
//           </div>
//         ) : products.length === 0 ? (
//           <div className="flex flex-col items-center justify-center py-16 text-center">
//             <div className="text-5xl mb-4">📦</div>
//             <p className="text-gray-400 font-semibold text-[14px]">
//               No products found in this category.
//             </p>
//           </div>
//         ) : (
//           <div className="overflow-hidden lg:overflow-visible" ref={emblaRef}>
//             <div className="flex lg:grid lg:grid-cols-4 lg:gap-4">
//               {products.map((product) => (
//                 <div
//                   key={product._id}
//                   className="flex-[0_0_100%] min-w-0 sm:flex-[0_0_50%] md:flex-[0_0_33.33%] lg:flex-none lg:w-full px-2 lg:px-0"
//                 >
//                   <ProductCard
//                     product={product}
//                     onQuickView={setSelectedProduct}
//                   />
//                 </div>
//               ))}
//             </div>
//           </div>
//         )}
//       </div>

//       {selectedProduct && (
//         <ProductQuickView
//           product={selectedProduct}
//           onClose={() => setSelectedProduct(null)}
//         />
//       )}
//     </>
//   );
// };

// export default PopularProduct;