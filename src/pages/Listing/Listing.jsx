import React, { useState, useEffect, useContext } from "react";
import { useParams, useSearchParams } from "react-router-dom";
import Sidebar from "./Sidebar/Sidebar";
import ProductControls from "./ProductControls/ProductControls";
import HeroBanner from "./HeroBanner/HeroBanner";
import SingleProductCard from "../../Components/cards/SingleProductCard/SingleProductCard";
import ProductCard from "../Home/FeaturedProduct/ProductCard";
import ProductQuickView from "../Home/ProductQuickView/ProductQuickView";
import { getProductsByCategory } from "../../utils/api/productApi";
import { StoreContext } from "../../context/StoreContext";

const Listing = () => {
  const { id: categoryId } = useParams();
  const [searchParams] = useSearchParams();
  const subCatParam = searchParams.get("subCat");

  const { categories, getSubCatsByCategory } = useContext(StoreContext);

  const [columns, setColumns]               = useState(4);
  const [products, setProducts]             = useState([]);
  const [filtered, setFiltered]             = useState([]);
  const [loading, setLoading]               = useState(true);
  const [selectedSubCat, setSelectedSubCat] = useState(subCatParam || "");
  const [windowWidth, setWindowWidth]       = useState(window.innerWidth);
  const [quickViewProduct, setQuickViewProduct] = useState(null);

  // Sidebar filter state
  const [sidebarFilters, setSidebarFilters] = useState({
    minPrice: 0,
    maxPrice: 100000,
    brands: [],
    stock: "",
    rating: 0,
  });

  useEffect(() => {
    const handleResize = () => setWindowWidth(window.innerWidth);
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  useEffect(() => {
    if (!categoryId) return;
    setLoading(true);
    getProductsByCategory(categoryId)
      .then((prods) => setProducts(prods))
      .catch(console.error)
      .finally(() => setLoading(false));
  }, [categoryId]);

  useEffect(() => {
    setSelectedSubCat(subCatParam || "");
  }, [subCatParam]);

  // Filter: subCat + price + brand + stock
  useEffect(() => {
    let result = [...products];

    // SubCat filter
    if (selectedSubCat) {
      result = result.filter(
        (p) => (p.subCat?._id || p.subCat)?.toString() === selectedSubCat
      );
    }

    // Price filter
    result = result.filter(
      (p) => Number(p.price) >= sidebarFilters.minPrice && Number(p.price) <= sidebarFilters.maxPrice
    );

    // Brand filter
    if (sidebarFilters.brands.length > 0) {
      result = result.filter((p) => sidebarFilters.brands.includes(p.brand));
    }

    // Rating filter — exact match
    if (sidebarFilters.rating > 0) {
      result = result.filter((p) => Number(p.rating) === sidebarFilters.rating);
    }

    // Stock filter
    if (sidebarFilters.stock === "instock") {
      result = result.filter((p) => p.countInStock > 0);
    } else if (sidebarFilters.stock === "onsale") {
      result = result.filter((p) => p.oldPrice && p.oldPrice > p.price);
    }

    setFiltered(result);
  }, [products, selectedSubCat, sidebarFilters]);

  const category = categories.find((c) => c._id === categoryId) || null;

  const getGridCols = () => {
    if (columns !== 4) return columns;
    if (windowWidth <= 375) return 1;
    if (windowWidth < 600) return 2;
    if (windowWidth < 768) return 3;
    if (windowWidth < 1024) return 4;  // ১০২৪ এর নিচে ৪টা
   return 5;
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
    gridTemplateColumns: `repeat(${gridCols}, minmax(0, 1fr))`,
    marginTop: "16px",
  };

  return (
    <section>
      <div className="container mx-auto px-1 py-6 lg:py-10">
        <div className="flex gap-6">

          {/* Sidebar — desktop only */}
          <div className="hidden lg:block w-[240px] shrink-0">
            <Sidebar
              products={products}
              selectedSubCat={selectedSubCat}
              onSubCatChange={setSelectedSubCat}
              onFilterChange={setSidebarFilters}
            />
          </div>

          <div className="flex-1 min-w-0">
            <div className="hidden lg:block">
              <HeroBanner category={category} />
            </div>

            <ProductControls columns={columns} onChangeColumns={setColumns} />

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















// import React, { useState, useEffect, useContext } from "react";
// import { useParams, useSearchParams } from "react-router-dom";
// import Sidebar from "./Sidebar/Sidebar";
// import ProductControls from "./ProductControls/ProductControls";
// import HeroBanner from "./HeroBanner/HeroBanner";
// import SingleProductCard from "../../Components/cards/SingleProductCard/SingleProductCard";
// import ProductCard from "../Home/FeaturedProduct/ProductCard";
// import ProductQuickView from "../Home/ProductQuickView/ProductQuickView";
// import { getProductsByCategory } from "../../utils/api/productApi";
// import { StoreContext } from "../../context/StoreContext";

// const Listing = () => {
//   const { id: categoryId } = useParams();
//   const [searchParams] = useSearchParams();
//   const subCatParam = searchParams.get("subCat");

//   const { categories, getSubCatsByCategory } = useContext(StoreContext);

//   const [columns, setColumns]               = useState(4);
//   const [products, setProducts]             = useState([]);
//   const [filtered, setFiltered]             = useState([]);
//   const [loading, setLoading]               = useState(true);
//   const [selectedSubCat, setSelectedSubCat] = useState(subCatParam || "");
//   const [windowWidth, setWindowWidth]       = useState(window.innerWidth);
//   const [quickViewProduct, setQuickViewProduct] = useState(null);

//   // Sidebar filter state
//   const [sidebarFilters, setSidebarFilters] = useState({
//     minPrice: 0,
//     maxPrice: 100000,
//     brands: [],
//     stock: "",
//     rating: 0,
//   });

//   useEffect(() => {
//     const handleResize = () => setWindowWidth(window.innerWidth);
//     window.addEventListener("resize", handleResize);
//     return () => window.removeEventListener("resize", handleResize);
//   }, []);

//   useEffect(() => {
//     if (!categoryId) return;
//     setLoading(true);
//     getProductsByCategory(categoryId)
//       .then((prods) => setProducts(prods))
//       .catch(console.error)
//       .finally(() => setLoading(false));
//   }, [categoryId]);

//   useEffect(() => {
//     setSelectedSubCat(subCatParam || "");
//   }, [subCatParam]);

//   // Filter: subCat + price + brand + stock
//   useEffect(() => {
//     let result = [...products];

//     // SubCat filter
//     if (selectedSubCat) {
//       result = result.filter(
//         (p) => (p.subCat?._id || p.subCat)?.toString() === selectedSubCat
//       );
//     }

//     // Price filter
//     result = result.filter(
//       (p) => Number(p.price) >= sidebarFilters.minPrice && Number(p.price) <= sidebarFilters.maxPrice
//     );

//     // Brand filter
//     if (sidebarFilters.brands.length > 0) {
//       result = result.filter((p) => sidebarFilters.brands.includes(p.brand));
//     }

//     // Rating filter
//     if (sidebarFilters.rating > 0) {
//       result = result.filter((p) => Number(p.rating) >= sidebarFilters.rating);
//     }

//     // Stock filter
//     if (sidebarFilters.stock === "instock") {
//       result = result.filter((p) => p.countInStock > 0);
//     } else if (sidebarFilters.stock === "onsale") {
//       result = result.filter((p) => p.oldPrice && p.oldPrice > p.price);
//     }

//     setFiltered(result);
//   }, [products, selectedSubCat, sidebarFilters]);

//   const category = categories.find((c) => c._id === categoryId) || null;

//   const getGridCols = () => {
//     if (columns !== 4) return columns;
//     if (windowWidth <= 375) return 1;
//     if (windowWidth < 600) return 2;
//     if (windowWidth < 768) return 3;
//     if (windowWidth < 1024) return 4;  // ১০২৪ এর নিচে ৪টা
//     return 5;

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
//     gridTemplateColumns: `repeat(${gridCols}, minmax(0, 1fr))`,
//     marginTop: "16px",
//   };

//   return (
//     <section>
//       <div className="container mx-auto px-1 py-6 lg:py-10">
//         <div className="flex gap-6">

//           {/* Sidebar — desktop only */}
//           <div className="hidden lg:block w-[240px] shrink-0">
//             <Sidebar
//               products={products}
//               selectedSubCat={selectedSubCat}
//               onSubCatChange={setSelectedSubCat}
//               onFilterChange={setSidebarFilters}
//             />
//           </div>

//           <div className="flex-1 min-w-0">
//             <div className="hidden lg:block">
//               <HeroBanner category={category} />
//             </div>

//             <ProductControls columns={columns} onChangeColumns={setColumns} />

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
//                     {gridCols === 1
//                       ? <SingleProductCard product={product} onQuickView={setQuickViewProduct} />
//                       : <ProductCard product={product} onQuickView={setQuickViewProduct} />
//                     }
//                   </div>
//                 ))}
//               </div>
//             )}
//           </div>
//         </div>
//       </div>

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
// import React, { useState, useEffect, useContext } from "react";
// import { useParams, useSearchParams } from "react-router-dom";
// import Sidebar from "./Sidebar/Sidebar";
// import ProductControls from "./ProductControls/ProductControls";
// import HeroBanner from "./HeroBanner/HeroBanner";
// import SingleProductCard from "../../Components/cards/SingleProductCard/SingleProductCard";
// import ProductCard from "../Home/FeaturedProduct/ProductCard";
// import ProductQuickView from "../Home/ProductQuickView/ProductQuickView";
// import { getProductsByCategory } from "../../utils/api/productApi";
// import { StoreContext } from "../../context/StoreContext";

// const Listing = () => {
//   const { id: categoryId } = useParams();
//   const [searchParams] = useSearchParams();
//   const subCatParam = searchParams.get("subCat");

//   const { categories, getSubCatsByCategory } = useContext(StoreContext);

//   const [columns, setColumns]               = useState(4);
//   const [products, setProducts]             = useState([]);
//   const [filtered, setFiltered]             = useState([]);
//   const [loading, setLoading]               = useState(true);
//   const [selectedSubCat, setSelectedSubCat] = useState(subCatParam || "");
//   const [windowWidth, setWindowWidth]       = useState(window.innerWidth);
//   const [quickViewProduct, setQuickViewProduct] = useState(null);

//   // Sidebar filter state
//   const [sidebarFilters, setSidebarFilters] = useState({
//     minPrice: 0,
//     maxPrice: 100000,
//     brands: [],
//     stock: "",
//   });

//   useEffect(() => {
//     const handleResize = () => setWindowWidth(window.innerWidth);
//     window.addEventListener("resize", handleResize);
//     return () => window.removeEventListener("resize", handleResize);
//   }, []);

//   useEffect(() => {
//     if (!categoryId) return;
//     setLoading(true);
//     getProductsByCategory(categoryId)
//       .then((prods) => setProducts(prods))
//       .catch(console.error)
//       .finally(() => setLoading(false));
//   }, [categoryId]);

//   useEffect(() => {
//     setSelectedSubCat(subCatParam || "");
//   }, [subCatParam]);

//   // Filter: subCat + price + brand + stock
//   useEffect(() => {
//     let result = [...products];

//     // SubCat filter
//     if (selectedSubCat) {
//       result = result.filter(
//         (p) => (p.subCat?._id || p.subCat)?.toString() === selectedSubCat
//       );
//     }

//     // Price filter
//     result = result.filter(
//       (p) => Number(p.price) >= sidebarFilters.minPrice && Number(p.price) <= sidebarFilters.maxPrice
//     );

//     // Brand filter
//     if (sidebarFilters.brands.length > 0) {
//       result = result.filter((p) => sidebarFilters.brands.includes(p.brand));
//     }

//     // Stock filter
//     if (sidebarFilters.stock === "instock") {
//       result = result.filter((p) => p.countInStock > 0);
//     } else if (sidebarFilters.stock === "onsale") {
//       result = result.filter((p) => p.oldPrice && p.oldPrice > p.price);
//     }

//     setFiltered(result);
//   }, [products, selectedSubCat, sidebarFilters]);

//   const category = categories.find((c) => c._id === categoryId) || null;

//   const getGridCols = () => {
//     if (columns !== 4) return columns;
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
//     gridTemplateColumns: `repeat(${gridCols}, minmax(0, 1fr))`,
//     marginTop: "16px",
//   };

//   return (
//     <section>
//       <div className="container mx-auto px-1 py-6 lg:py-10">
//         <div className="flex gap-6">

//           {/* Sidebar — desktop only */}
//           <div className="hidden lg:block w-[240px] shrink-0">
//             <Sidebar
//               products={products}
//               selectedSubCat={selectedSubCat}
//               onSubCatChange={setSelectedSubCat}
//               onFilterChange={setSidebarFilters}
//             />
//           </div>

//           <div className="flex-1 min-w-0">
//             <div className="hidden lg:block">
//               <HeroBanner category={category} />
//             </div>

//             <ProductControls columns={columns} onChangeColumns={setColumns} />

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
//                     {gridCols === 1
//                       ? <SingleProductCard product={product} onQuickView={setQuickViewProduct} />
//                       : <ProductCard product={product} onQuickView={setQuickViewProduct} />
//                     }
//                   </div>
//                 ))}
//               </div>
//             )}
//           </div>
//         </div>
//       </div>

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



















// import React, { useState, useEffect, useContext } from "react";
// import { useParams, useSearchParams } from "react-router-dom";
// import Sidebar from "./Sidebar/Sidebar";
// import ProductControls from "./ProductControls/ProductControls";
// // import HeroBanner from "./HeroBanner/HeroBanner";
// import SingleProductCard from "../../Components/cards/SingleProductCard/SingleProductCard";
// import ProductCard from "../Home/FeaturedProduct/ProductCard";
// import ProductQuickView from "../Home/ProductQuickView/ProductQuickView";
// import { getProductsByCategory } from "../../utils/api/productApi";
// import { StoreContext } from "../../context/StoreContext";

// const Listing = () => {
//   const { id: categoryId } = useParams();
//   const [searchParams] = useSearchParams();
//   const subCatParam = searchParams.get("subCat");

//   // ✅ context থেকে categories + subcategories — আর API call নেই
//   const { categories, getSubCatsByCategory } = useContext(StoreContext);
//   const [columns, setColumns] = useState(4);
//   const [products, setProducts] = useState([]);
//   const [filtered, setFiltered] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const [selectedSubCat, setSelectedSubCat] = useState(subCatParam || "");
//   const [windowWidth, setWindowWidth] = useState(window.innerWidth);
//   const [quickViewProduct, setQuickViewProduct] = useState(null);

//   // window resize track
//   useEffect(() => {
//     const handleResize = () => setWindowWidth(window.innerWidth);
//     window.addEventListener("resize", handleResize);
//     return () => window.removeEventListener("resize", handleResize);
//   }, []);

//   // products fetch — শুধু products API call, categories/subs context থেকে
//   useEffect(() => {
//     if (!categoryId) return;
//     setLoading(true);
//     getProductsByCategory(categoryId)
//       .then((prods) => setProducts(prods))
//       .catch(console.error)
//       .finally(() => setLoading(false));
//   }, [categoryId]);

//   // URL param থেকে subCat sync
//   useEffect(() => {
//     setSelectedSubCat(subCatParam || "");
//   }, [subCatParam]);

//   // subCat filter
//   useEffect(() => {
//     if (!selectedSubCat) {
//       setFiltered(products);
//     } else {
//       setFiltered(
//         products.filter(
//           (p) =>
//             (p.subCat?._id || p.subCat)?.toString() ===
//             selectedSubCat?.toString(),
//         ),
//       );
//     }
//   }, [products, selectedSubCat]);

//   // context থেকে current category এবং subCategories
//   const category = categories.find((c) => c._id === categoryId) || null;
//   const subCategories = getSubCatsByCategory(categoryId);

//   // responsive grid
//   const getGridCols = () => {
//     if (columns !== 4) return columns;
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
//     gridTemplateColumns: `repeat(${gridCols}, minmax(0, 1fr))`,
//     marginTop: "16px",
//   };

//   return (
//     <section>
//       <div className="container mx-auto px-1 py-6 lg:py-10">
//         <div className="flex gap-6">
//           {/* Sidebar — desktop only */}
//           <div className="hidden lg:block w-[240px] shrink-0">
//             <Sidebar
//               selectedSubCat={selectedSubCat}
//               onSubCatChange={setSelectedSubCat}
//             />
//           </div>

//           {/* Main content */}
//           <div className="flex-1 min-w-0">
//             {/* HeroBanner — desktop only */}
//             {/* <div className="hidden lg:block">
//               <HeroBanner category={category} />
//             </div> */}

//             {/* Product Controls */}
//             <ProductControls columns={columns} onChangeColumns={setColumns} />

//             {/* Loading skeleton */}
//             {loading ? (
//               <div style={skeletonStyle}>
//                 {[...Array(6)].map((_, i) => (
//                   <div
//                     key={i}
//                     className="rounded-xl overflow-hidden border border-gray-100"
//                   >
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
//                       <SingleProductCard
//                         product={product}
//                         onQuickView={setQuickViewProduct}
//                       />
//                     ) : (
//                       <ProductCard
//                         product={product}
//                         onQuickView={setQuickViewProduct}
//                       />
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

// import React, { useState, useEffect, useContext } from "react";
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
// import { StoreContext } from "../../context/StoreContext";
// const Listing = () => {
//   const { products, setProducts,loading, setLoading } = useContext(StoreContext);
//   const { id: categoryId } = useParams();
//   const [searchParams] = useSearchParams();
//   const subCatParam = searchParams.get("subCat");

//   const [columns, setColumns] = useState(4);
//   // const [products, setProducts] = useState([]);
//   const [filtered, setFiltered] = useState([]);
//   // const [loading, setLoading] = useState(true);
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
// console.log(subCategories);
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
//                     {gridCols === 1
//                       ? <SingleProductCard product={product} onQuickView={setQuickViewProduct} />
//                       : <ProductCard product={product} onQuickView={setQuickViewProduct} />
//                     }
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
