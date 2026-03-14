import React, { useState, useEffect, useContext } from "react";
import { useParams, useSearchParams } from "react-router-dom";
import Sidebar from "./Sidebar/Sidebar";
import ProductControls from "./ProductControls/ProductControls";
import HeroBanner from "./HeroBanner/HeroBanner";
import SingleProductCard from "../../Components/cards/SingleProductCard/SingleProductCard";
import ProductCard from "../Home/FeaturedProduct/ProductCard";
import ProductQuickView from "../Home/ProductQuickView/ProductQuickView";
import { getProducts } from "../../utils/api/productApi";
import { StoreContext } from "../../context/StoreContext";

const PER_PAGE = 12;

const Listing = () => {
  const { id: categoryId }  = useParams();
  const [searchParams]      = useSearchParams();

  // URL params
  const searchQuery  = searchParams.get("search")   || "";
  const subCatParam  = searchParams.get("subCat")   || "";
  const brandParam   = searchParams.get("brand")    || "";

  const { categories } = useContext(StoreContext);

  const [columns, setColumns]                   = useState(4);
  const [products, setProducts]                 = useState([]);
  const [loading, setLoading]                   = useState(true);
  const [selectedSubCat, setSelectedSubCat]     = useState(subCatParam);
  const [windowWidth, setWindowWidth]           = useState(window.innerWidth);
  const [quickViewProduct, setQuickViewProduct] = useState(null);
  const [page, setPage]                         = useState(1);
  const [totalPages, setTotalPages]             = useState(1);
  const [totalItems, setTotalItems]             = useState(0);

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

  // Reset page when params change
  useEffect(() => {
    setPage(1);
    setSelectedSubCat(subCatParam);
  }, [searchQuery, categoryId, subCatParam, brandParam]);

  // Fetch products
  useEffect(() => {
    fetchProducts();
  }, [searchQuery, categoryId, selectedSubCat, brandParam, sidebarFilters, page]);

  const fetchProducts = async () => {
    setLoading(true);
    try {
      const params = {
        page,
        limit: PER_PAGE,
      };

      if (searchQuery)    params.search   = searchQuery;
      if (categoryId)     params.category = categoryId;
      if (selectedSubCat) params.subCat   = selectedSubCat;
      if (brandParam)     params.brand    = brandParam;

      // brand filter from sidebar
      if (sidebarFilters.brands.length === 1) params.brand = sidebarFilters.brands[0];

      const data = await getProducts(params);
      let result = data.products || [];

      // Client-side filters (price, rating, stock) —
      // এগুলো backend এ না করে frontend এ করা হচ্ছে
      result = result.filter(
        (p) => Number(p.price) >= sidebarFilters.minPrice && Number(p.price) <= sidebarFilters.maxPrice
      );
      if (sidebarFilters.rating > 0) {
        result = result.filter((p) => Number(p.rating) >= sidebarFilters.rating);
      }
      if (sidebarFilters.stock === "instock") {
        result = result.filter((p) => p.countInStock > 0);
      } else if (sidebarFilters.stock === "onsale") {
        result = result.filter((p) => p.oldPrice && p.oldPrice > p.price);
      }

      setProducts(result);
      setTotalPages(data.totalPages  || 1);
      setTotalItems(data.totalItems  || 0);
    } catch (err) {
      console.error(err);
      setProducts([]);
    } finally {
      setLoading(false);
    }
  };

  const category = categories.find((c) => c._id === categoryId) || null;

  // Page title
  const pageTitle = searchQuery
    ? `Search results for "${searchQuery}"`
    : category?.name || "All Products";

  const getGridCols = () => {
    if (columns !== 4) return columns;
    if (windowWidth <= 375) return 1;
    if (windowWidth < 600)  return 2;
    if (windowWidth < 768)  return 3;
    if (windowWidth < 1024) return 4;
    return 5;
  };

  const gridCols   = getGridCols();
  const gridStyle  = { display: "grid", gap: "0px", gridTemplateColumns: `repeat(${gridCols}, minmax(0, 1fr))`, marginTop: "16px" };

  return (
    <section>
      <div className="container mx-auto px-1 py-6 lg:py-10">
        <div className="flex gap-6">

          {/* Sidebar */}
          <div className="hidden lg:block w-[240px] shrink-0">
            <Sidebar
              products={products}
              selectedSubCat={selectedSubCat}
              onSubCatChange={setSelectedSubCat}
              onFilterChange={setSidebarFilters}
            />
          </div>

          <div className="flex-1 min-w-0">

            {/* HeroBanner — category page এ দেখাবে, search এ না */}
            {!searchQuery && (
              <div className="hidden lg:block">
                <HeroBanner category={category} />
              </div>
            )}

            {/* Search result title */}
            {searchQuery && (
              <div className="mb-4">
                <p className="text-xs font-bold text-indigo-500 uppercase tracking-widest mb-1">Search Results</p>
                <h1 className="text-2xl font-extrabold text-gray-900">
                  "{searchQuery}"
                </h1>
                {!loading && (
                  <p className="text-sm text-gray-400 mt-1">{totalItems} products found</p>
                )}
              </div>
            )}

            <ProductControls columns={columns} onChangeColumns={setColumns} />

            {/* Loading skeleton */}
            {loading ? (
              <div style={gridStyle}>
                {[...Array(PER_PAGE)].map((_, i) => (
                  <div key={i} className="rounded-xl overflow-hidden border border-gray-100">
                    <div className="h-40 lg:h-48 bg-gray-100 animate-pulse" />
                    <div className="p-3 space-y-2">
                      <div className="h-3 bg-gray-100 rounded animate-pulse" />
                      <div className="h-3 w-2/3 bg-gray-100 rounded animate-pulse" />
                    </div>
                  </div>
                ))}
              </div>
            ) : products.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-20 text-gray-400">
                <p className="text-4xl mb-3">📦</p>
                <p className="text-sm font-medium">No products found</p>
                {searchQuery && (
                  <p className="text-xs text-gray-400 mt-1">Try a different keyword</p>
                )}
              </div>
            ) : (
              <div style={gridStyle}>
                {products.map((product) => (
                  <div key={product._id}>
                    {gridCols === 1
                      ? <SingleProductCard product={product} onQuickView={setQuickViewProduct} />
                      : <ProductCard       product={product} onQuickView={setQuickViewProduct} />
                    }
                  </div>
                ))}
              </div>
            )}

            {/* Pagination */}
            {!loading && totalPages > 1 && (
              <div className="flex items-center justify-center gap-2 mt-8">
                <button
                  onClick={() => setPage((p) => Math.max(1, p - 1))}
                  disabled={page === 1}
                  className="px-4 py-2 rounded-xl border border-gray-200 text-sm font-semibold text-gray-600 hover:bg-gray-50 disabled:opacity-30 disabled:cursor-not-allowed transition-all"
                >
                  Previous
                </button>
                {[...Array(totalPages)].map((_, i) => (
                  <button
                    key={i}
                    onClick={() => setPage(i + 1)}
                    className={`w-9 h-9 rounded-xl text-sm font-bold transition-all ${
                      page === i + 1
                        ? "bg-gray-900 text-white"
                        : "border border-gray-200 text-gray-600 hover:bg-gray-50"
                    }`}
                  >
                    {i + 1}
                  </button>
                ))}
                <button
                  onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                  disabled={page === totalPages}
                  className="px-4 py-2 rounded-xl border border-gray-200 text-sm font-semibold text-gray-600 hover:bg-gray-50 disabled:opacity-30 disabled:cursor-not-allowed transition-all"
                >
                  Next
                </button>
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

//     // Rating filter — exact match
//     if (sidebarFilters.rating > 0) {
//       result = result.filter((p) => Number(p.rating) === sidebarFilters.rating);
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
//    return 5;
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




