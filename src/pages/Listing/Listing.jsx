import React, { useState, useEffect } from "react";
import { useParams, useSearchParams } from "react-router-dom";
import Sidebar from "./Sidebar/Sidebar";
import ProductControls from "./ProductControls/ProductControls";
import HeroBanner from "./HeroBanner/HeroBanner";
import SingleProductCard from "../../Components/cards/SingleProductCard/SingleProductCard";
import { getProductsByCategory } from "../../utils/api/productApi";
import { getAllCategoriesForUI } from "../../utils/api/categoryApi";
import { getAllSubCategories } from "../../utils/api/subCategoryApi";
import ProductCard from "../Home/FeaturedProduct/ProductCard";
import ProductQuickView from "../Home/ProductQuickView/ProductQuickView";

const Listing = () => {
  const { id: categoryId } = useParams();
  const [searchParams] = useSearchParams();
  const subCatParam = searchParams.get("subCat");

  const [columns, setColumns] = useState(4);
  const [products, setProducts] = useState([]);
  const [filtered, setFiltered] = useState([]);
  const [loading, setLoading] = useState(true);
  const [category, setCategory] = useState(null);
  const [subCategories, setSubCategories] = useState([]);
  const [selectedSubCat, setSelectedSubCat] = useState(subCatParam || "");
  const [windowWidth, setWindowWidth] = useState(window.innerWidth);
  const [quickViewProduct, setQuickViewProduct] = useState(null);

  useEffect(() => {
    const handleResize = () => setWindowWidth(window.innerWidth);
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  useEffect(() => {
    if (!categoryId) return;
    setLoading(true);
    Promise.all([
      getProductsByCategory(categoryId),
      getAllCategoriesForUI(),
      getAllSubCategories(),
    ])
      .then(([prods, cats, subs]) => {
        setProducts(prods);
        const cat = cats.find((c) => c._id === categoryId);
        setCategory(cat || null);
        const catSubs = subs.filter(
          (s) => (s.category?._id || s.category)?.toString() === categoryId?.toString()
        );
        setSubCategories(catSubs);
      })
      .catch(console.error)
      .finally(() => setLoading(false));
  }, [categoryId]);

  useEffect(() => {
    setSelectedSubCat(subCatParam || "");
  }, [subCatParam]);

  useEffect(() => {
    if (!selectedSubCat) {
      setFiltered(products);
    } else {
      setFiltered(
        products.filter(
          (p) => (p.subCat?._id || p.subCat)?.toString() === selectedSubCat?.toString()
        )
      );
    }
  }, [products, selectedSubCat]);

  const getGridCols = () => {
    // user manually column change করলে — সব screen এ সেটাই দেখাবে
    // শুধু default (4) এ থাকলে responsive breakpoints apply হবে
    if (columns !== 4) return columns;

    // default 4 col — responsive
    if (windowWidth <= 375) return 1;
    if (windowWidth < 600) return 2;
    if (windowWidth < 768) return 3;
    return 4;
  };

  const gridCols = getGridCols();

  const gridStyle = {
    display: "grid",
    gap: "0px",
    gridTemplateColumns: `repeat(${gridCols}, minmax(0, 1fr))`,
    marginTop: "16px",
  };

  const skeletonStyle = {
    display: "grid",
    gap: "0px",
    gridTemplateColumns: `repeat(${getGridCols()}, minmax(0, 1fr))`,
    marginTop: "16px",
  };

  return (
    <section>
      <div className="container mx-auto px-1 py-6 lg:py-10">
        <div className="flex gap-6">

          {/* Sidebar — desktop only */}
          <div className="hidden lg:block w-[240px] shrink-0">
            <Sidebar
              subCategories={subCategories}
              selectedSubCat={selectedSubCat}
              onSubCatChange={setSelectedSubCat}
            />
          </div>

          {/* Main content */}
          <div className="flex-1 min-w-0">

            {/* HeroBanner — desktop only */}
            <div className="hidden lg:block">
              <HeroBanner category={category} />
            </div>

            {/* Product Controls — always visible */}
            <ProductControls columns={columns} onChangeColumns={setColumns} />

            {/* Loading skeleton */}
            {loading ? (
              <div style={skeletonStyle}>
                {[...Array(6)].map((_, i) => (
                  <div key={i} className="rounded-xl overflow-hidden border border-gray-100">
                    <div className="h-40 lg:h-48 bg-gray-100 animate-pulse" />
                    <div className="p-3 space-y-2">
                      <div className="h-3 bg-gray-100 rounded animate-pulse" />
                      <div className="h-3 w-2/3 bg-gray-100 rounded animate-pulse" />
                    </div>
                  </div>
                ))}
              </div>
            ) : filtered.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-20 text-gray-400">
                <p className="text-4xl mb-3">📦</p>
                <p className="text-sm font-medium">No products found</p>
              </div>
            ) : (
              <div style={gridStyle}>
                {filtered.map((product) => (
                  <div key={product._id}>
                    {gridCols === 1
                      ? <SingleProductCard product={product} onQuickView={setQuickViewProduct} />
                      : <ProductCard product={product} onQuickView={setQuickViewProduct} />
                    }
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* QuickView Modal */}
      {quickViewProduct && (
        <ProductQuickView
          product={quickViewProduct}
          onClose={() => setQuickViewProduct(null)}
        />
      )}
    </section>
  );
};

export default Listing;














// import React, { useState, useEffect } from "react";
// import { useParams, useSearchParams } from "react-router-dom";
// import Sidebar from "./Sidebar/Sidebar";
// import ProductControls from "./ProductControls/ProductControls";
// import HeroBanner from "./HeroBanner/HeroBanner";
// import SingleProductCard from "../../Components/cards/SingleProductCard/SingleProductCard";
// import { getProductsByCategory } from "../../utils/api/productApi";
// import { getAllCategoriesForUI } from "../../utils/api/categoryApi";
// import { getAllSubCategories } from "../../utils/api/subCategoryApi";
// import ProductCard from "../Home/FeaturedProduct/ProductCard";
// import ProductQuickView from "../Home/ProductQuickView/ProductQuickView";

// const Listing = () => {
//   const { id: categoryId } = useParams();
//   const [searchParams] = useSearchParams();
//   const subCatParam = searchParams.get("subCat");

//   const [columns, setColumns] = useState(4);
//   const [products, setProducts] = useState([]);
//   const [filtered, setFiltered] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const [category, setCategory] = useState(null);
//   const [subCategories, setSubCategories] = useState([]);
//   const [selectedSubCat, setSelectedSubCat] = useState(subCatParam || "");
//   const [windowWidth, setWindowWidth] = useState(window.innerWidth);
//   const [quickViewProduct, setQuickViewProduct] = useState(null);

//   useEffect(() => {
//     const handleResize = () => setWindowWidth(window.innerWidth);
//     window.addEventListener("resize", handleResize);
//     return () => window.removeEventListener("resize", handleResize);
//   }, []);

//   useEffect(() => {
//     if (!categoryId) return;
//     setLoading(true);
//     Promise.all([
//       getProductsByCategory(categoryId),
//       getAllCategoriesForUI(),
//       getAllSubCategories(),
//     ])
//       .then(([prods, cats, subs]) => {
//         setProducts(prods);
//         const cat = cats.find((c) => c._id === categoryId);
//         setCategory(cat || null);
//         const catSubs = subs.filter(
//           (s) => (s.category?._id || s.category)?.toString() === categoryId?.toString()
//         );
//         setSubCategories(catSubs);
//       })
//       .catch(console.error)
//       .finally(() => setLoading(false));
//   }, [categoryId]);

//   useEffect(() => {
//     setSelectedSubCat(subCatParam || "");
//   }, [subCatParam]);

//   useEffect(() => {
//     if (!selectedSubCat) {
//       setFiltered(products);
//     } else {
//       setFiltered(
//         products.filter(
//           (p) => (p.subCat?._id || p.subCat)?.toString() === selectedSubCat?.toString()
//         )
//       );
//     }
//   }, [products, selectedSubCat]);

//   const getGridCols = () => {
//     // user manually column change করলে — সব screen এ সেটাই দেখাবে
//     // শুধু default (4) এ থাকলে responsive breakpoints apply হবে
//     if (columns !== 4) return columns;

//     // default 4 col — responsive
//     if (windowWidth <= 375) return 1;
//     if (windowWidth < 600) return 2;
//     if (windowWidth < 768) return 3;
//     return 4;
//   };

//   const gridCols = getGridCols();

//   const gridStyle = {
//     display: "grid",
//     gap: "0px",
//     gridTemplateColumns: `repeat(${gridCols}, minmax(0, 1fr))`,
//     marginTop: "16px",
//   };

//   const skeletonStyle = {
//     display: "grid",
//     gap: "0px",
//     gridTemplateColumns: `repeat(${getGridCols()}, minmax(0, 1fr))`,
//     marginTop: "16px",
//   };

//   return (
//     <section>
//       <div className="container mx-auto px-1 py-6 lg:py-10">
//         <div className="flex gap-6">

//           {/* Sidebar — desktop only */}
//           <div className="hidden lg:block w-[240px] shrink-0">
//             <Sidebar
//               subCategories={subCategories}
//               selectedSubCat={selectedSubCat}
//               onSubCatChange={setSelectedSubCat}
//             />
//           </div>

//           {/* Main content */}
//           <div className="flex-1 min-w-0">

//             {/* HeroBanner — desktop only */}
//             <div className="hidden lg:block">
//               <HeroBanner category={category} />
//             </div>

//             {/* Product Controls — always visible */}
//             <ProductControls columns={columns} onChangeColumns={setColumns} />

//             {/* Loading skeleton */}
//             {loading ? (
//               <div style={skeletonStyle}>
//                 {[...Array(6)].map((_, i) => (
//                   <div key={i} className="rounded-xl overflow-hidden border border-gray-100">
//                     <div className="h-40 lg:h-48 bg-gray-100 animate-pulse" />
//                     <div className="p-3 space-y-2">
//                       <div className="h-3 bg-gray-100 rounded animate-pulse" />
//                       <div className="h-3 w-2/3 bg-gray-100 rounded animate-pulse" />
//                     </div>
//                   </div>
//                 ))}
//               </div>
//             ) : filtered.length === 0 ? (
//               <div className="flex flex-col items-center justify-center py-20 text-gray-400">
//                 <p className="text-4xl mb-3">📦</p>
//                 <p className="text-sm font-medium">No products found</p>
//               </div>
//             ) : (
//               <div style={gridStyle}>
//                 {filtered.map((product) => (
//                   <div key={product._id}>
//                     {gridCols === 1 ? (
//                       <SingleProductCard product={product} onQuickView={setQuickViewProduct} />
//                     ) : (
//                       <ProductCard product={product} />
//                     )}
//                   </div>
//                 ))}
//               </div>
//             )}
//           </div>
//         </div>
//       </div>

//       {/* QuickView Modal */}
//       {quickViewProduct && (
//         <ProductQuickView
//           product={quickViewProduct}
//           onClose={() => setQuickViewProduct(null)}
//         />
//       )}
//     </section>
//   );
// };

// export default Listing;















