










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

  // Track window width for responsive grid
  useEffect(() => {
    const handleResize = () => setWindowWidth(window.innerWidth);
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  // Fetch products + category + subcategories
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
          (s) =>
            (s.category?._id || s.category)?.toString() ===
            categoryId?.toString()
        );
        setSubCategories(catSubs);
      })
      .catch(console.error)
      .finally(() => setLoading(false));
  }, [categoryId]);

  // Sync subCat from URL param
  useEffect(() => {
    setSelectedSubCat(subCatParam || "");
  }, [subCatParam]);

  // Filter by subcategory
  useEffect(() => {
    if (!selectedSubCat) {
      setFiltered(products);
    } else {
      setFiltered(
        products.filter(
          (p) =>
            (p.subCat?._id || p.subCat)?.toString() ===
            selectedSubCat?.toString()
        )
      );
    }
  }, [products, selectedSubCat]);

  // Responsive column count
  // 375–599  → 2 cols
  // 600–767  → 3 cols
  // 768–992  → 4 cols (fixed)
  // 993+     → user controlled (columns state)
  // const getGridCols = () => {
  //   if (windowWidth < 600) return 2;
  //   if (windowWidth < 768) return 3;
  //   if (windowWidth <= 992) return 4;
  //   return columns; // 993+: user choice
  // };

  // const gridCols = getGridCols();
// Listing.js এর ভেতরকার getGridCols ফাংশনটি এই অংশ দিয়ে পরিবর্তন করো

  const getGridCols = () => {
    // ৩৭৫px বা তার নিচে থাকলে ১টি কলাম হবে (যাতে SingleProductCard টা সুন্দর দেখায়)
    if (windowWidth <= 375) return 1; 
    if (windowWidth < 600) return 2;
    if (windowWidth < 768) return 3;
    if (windowWidth <= 992) return 4;
    return columns; // ৯৯৩+ এর জন্য ইউজারের কন্ট্রোল
  };

  const gridCols = getGridCols();
  const gridStyle = {
    display: "grid",
    gap: windowWidth >= 1024 ? "24px" : "12px",
    gridTemplateColumns: `repeat(${gridCols}, minmax(0, 1fr))`,
    marginTop: "16px",
  };

  const skeletonStyle = {
    display: "grid",
    gap: windowWidth >= 1024 ? "24px" : "12px",
    gridTemplateColumns: `repeat(${getGridCols()}, minmax(0, 1fr))`,
    marginTop: "16px",
  };

  return (
    <section>
      <div className="container mx-auto px-4 py-6 lg:py-10">
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
                  <div
                    key={i}
                    className="rounded-xl overflow-hidden border border-gray-100"
                  >
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
                    {gridCols === 1 ? (
                      <SingleProductCard product={product} />
                    ) : (
                      <ProductCard product={product} />
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  );
};

export default Listing;











// import React, { useState, useEffect } from "react";
// import { useParams, useSearchParams, useNavigate } from "react-router-dom";
// import Sidebar from "./Sidebar/Sidebar";
// import ProductControls from "./ProductControls/ProductControls";
// import HeroBanner from "./HeroBanner/HeroBanner";
// import SingleProductCard from "../../Components/cards/SingleProductCard/SingleProductCard";
// import { getProductsByCategory } from "../../utils/api/productApi";
// import { getAllCategoriesForUI } from "../../utils/api/categoryApi";
// import { getAllSubCategories } from "../../utils/api/subCategoryApi";
// import ProductCard from "../Home/FeaturedProduct/ProductCard";

// const Listing = () => {
//   const { id: categoryId } = useParams();
//   const [searchParams] = useSearchParams();
//   const navigate = useNavigate();
//   const subCatParam = searchParams.get("subCat");

//   const [columns, setColumns] = useState(4);
//   const [products, setProducts] = useState([]);
//   const [filtered, setFiltered] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const [category, setCategory] = useState(null);
//   const [subCategories, setSubCategories] = useState([]);
//   const [selectedSubCat, setSelectedSubCat] = useState(subCatParam || "");

//   // Fetch products + category + subcategories
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
//           (s) =>
//             (s.category?._id || s.category)?.toString() ===
//             categoryId?.toString(),
//         );
//         setSubCategories(catSubs);
//       })
//       .catch(console.error)
//       .finally(() => setLoading(false));
//   }, [categoryId]);

//   // Sync subCat from URL param
//   useEffect(() => {
//     setSelectedSubCat(subCatParam || "");
//   }, [subCatParam]);

//   // Filter by subcategory
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

//   return (
//     <section>
//       <div className="container mx-auto">
//         <div className="px-4 py-10 grid grid-cols-4">
//           <div className="col-span-1">
//             <Sidebar
//               subCategories={subCategories}
//               selectedSubCat={selectedSubCat}
//               onSubCatChange={setSelectedSubCat}
//             />
//           </div>
//           <div className="col-span-3">
//             <HeroBanner category={category} />
//             <ProductControls columns={columns} onChangeColumns={setColumns} />

//             {loading ? (
//               <div className="grid grid-cols-4 gap-6">
//                 {[...Array(4)].map((_, i) => (
//                   <div
//                     key={i}
//                     className="rounded-xl overflow-hidden border border-gray-100"
//                   >
//                     <div className="h-48 bg-gray-100 animate-pulse" />
//                     <div className="p-3 space-y-2">
//                       <div className="h-3 bg-gray-100 rounded animate-pulse" />
//                       <div className="h-3 w-2/3 bg-gray-100 rounded animate-pulse" />
//                     </div>
//                   </div>
//                 ))}
//               </div>
//             ) : (
//               <div
//                 className={`grid gap-6 ${
//                   columns === 1
//                     ? "grid-cols-1"
//                     : columns === 2
//                       ? "grid-cols-2"
//                       : columns === 3
//                         ? "grid-cols-3"
//                         : "grid-cols-4"
//                 }`}
//               >
//                 {filtered.map((product) => (
//                   <div key={product._id} className="px-2 lg:px-0">
//                     {columns === 1 ? (
//                       <SingleProductCard product={product} />
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
//     </section>
//   );
// };

// export default Listing;

// import React, { useState, useEffect } from "react";
// import { useParams, useSearchParams, useNavigate } from "react-router-dom";
// import Sidebar from "./Sidebar/Sidebar";
// import ProductControls from "./ProductControls/ProductControls";
// import HeroBanner from "./HeroBanner/HeroBanner";
// import SingleProductCard from "../../Components/cards/SingleProductCard/SingleProductCard";
// import { getProductsByCategory } from "../../utils/api/productApi";
// import { getAllCategoriesForUI } from "../../utils/api/categoryApi";
// import { getAllSubCategories } from "../../utils/api/subCategoryApi";
// import ProductCard from "../Home/FeaturedProduct/ProductCard";

// const Listing = () => {
//   const { id: categoryId }       = useParams();
//   const [searchParams]           = useSearchParams();
//   const navigate                 = useNavigate();
//   const subCatParam              = searchParams.get("subCat");

//   const [columns, setColumns]           = useState(4);
//   const [products, setProducts]         = useState([]);
//   const [filtered, setFiltered]         = useState([]);
//   const [loading, setLoading]           = useState(true);
//   const [category, setCategory]         = useState(null);
//   const [subCategories, setSubCategories] = useState([]);
//   const [selectedSubCat, setSelectedSubCat] = useState(subCatParam || "");

//   // Fetch products + category + subcategories
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
//         const cat = cats.find(c => c._id === categoryId);
//         setCategory(cat || null);
//         const catSubs = subs.filter(s => (s.category?._id || s.category) === categoryId);
//         setSubCategories(catSubs);
//       })
//       .catch(console.error)
//       .finally(() => setLoading(false));
//   }, [categoryId]);

//   // Sync subCat from URL param
//   useEffect(() => {
//     setSelectedSubCat(subCatParam || "");
//   }, [subCatParam]);

//   // Filter by subcategory
//   useEffect(() => {
//     if (!selectedSubCat) {
//       setFiltered(products);
//     } else {
//       setFiltered(
//         products.filter(p => (p.subCat?._id || p.subCat) === selectedSubCat)
//       );
//     }
//   }, [products, selectedSubCat]);

//   return (
//     <section>
//       <div className="container mx-auto">
//         <div className="px-4 py-10 grid grid-cols-4">
//           <div className="col-span-1">
//             <Sidebar
//               subCategories={subCategories}
//               selectedSubCat={selectedSubCat}
//               onSubCatChange={setSelectedSubCat}
//             />
//           </div>
//           <div className="col-span-3">
//             <HeroBanner category={category} />
//             <ProductControls columns={columns} onChangeColumns={setColumns} />

//             {loading ? (
//               <div className="grid grid-cols-4 gap-6">
//                 {[...Array(4)].map((_, i) => (
//                   <div key={i} className="rounded-xl overflow-hidden border border-gray-100">
//                     <div className="h-48 bg-gray-100 animate-pulse" />
//                     <div className="p-3 space-y-2">
//                       <div className="h-3 bg-gray-100 rounded animate-pulse" />
//                       <div className="h-3 w-2/3 bg-gray-100 rounded animate-pulse" />
//                     </div>
//                   </div>
//                 ))}
//               </div>
//             ) : (
//               <div
//                 className={`grid gap-6 ${
//                   columns === 1
//                     ? "grid-cols-1"
//                     : columns === 2
//                     ? "grid-cols-2"
//                     : columns === 3
//                     ? "grid-cols-3"
//                     : "grid-cols-4"
//                 }`}
//               >
//                 {filtered.map((product) => (
//                   <div key={product._id} className="px-2 lg:px-0">
//                     {columns === 1 ? (
//                       <SingleProductCard product={product} />
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
//     </section>
//   );
// };

// export default Listing;

// import React, { useState } from "react";
// import Sidebar from "./Sidebar/Sidebar";
// import ProductControls from "./ProductControls/ProductControls";
// import HeroBanner from "./HeroBanner/HeroBanner";
// import ProductCard from "../../Components/cards/ProductCard/ProductCard";
// import SingleProductCard from "../../Components/cards/SingleProductCard/SingleProductCard";
// import pp from "../../assets/4685339.jpg";

// const Listing = () => {
//   const [columns, setColumns] = useState(4);
//   const [currentPage, setCurrentPage] = useState(1);
//   const productsPerPage = 4; // Number of products per page

//   const products = [
//     {
//       id: 1,
//       name: "Werther's Original Caramel Hard Candies",
//       price: 14.97,
//       oldPrice: 20.0,
//       discount: "26%",
//       img: pp,
//       rating: 5,
//       description:
//         "Classic smooth and creamy caramel candies made with real butter and fresh cream for a rich, melting taste.",
//       recommended: true,
//     },
//     {
//       id: 2,
//       name: "All Natural Italian-Style Chicken Meatballs",
//       price: 7.25,
//       oldPrice: 9.5,
//       discount: "24%",
//       img: pp,
//       rating: 4,
//       description:
//         "Healthy and delicious chicken meatballs seasoned with authentic Italian herbs and spices.",
//       recommended: false,
//     },
//     {
//       id: 3,
//       name: "Angus Beef Lean Ground Beef - 93% Lean",
//       price: 24.0,
//       oldPrice: 32.0,
//       discount: "25%",
//       img: pp,
//       rating: 5,
//       description:
//         "Premium quality Angus beef, perfect for burgers, tacos, or your favorite pasta sauce.",
//       recommended: true,
//     },
//     {
//       id: 4,
//       name: "Foster Farms Take Out Crispy Wings - 2lb",
//       price: 15.99,
//       oldPrice: 19.99,
//       discount: "20%",
//       img: pp,
//       rating: 4,
//       description:
//         "Restaurant-style crispy wings that you can enjoy at home. Oven-baked and ready in minutes.",
//       recommended: false,
//     },
//     {
//       id: 5,
//       name: "Blue Diamond Almonds Whole Natural",
//       price: 12.5,
//       oldPrice: 15.0,
//       discount: "16%",
//       img: pp,
//       rating: 5,
//       description:
//         "Crunchy, heart-healthy whole natural almonds. Great for snacking or adding to salads.",
//       recommended: true,
//     },
//     {
//       id: 6,
//       name: "Organic Honey Nut Cheerios Cereal",
//       price: 5.49,
//       oldPrice: 8.0,
//       discount: "31%",
//       img: pp,
//       rating: 4,
//       description:
//         "Wholesome toasted oat cereal with real honey and natural almond flavor.",
//       recommended: false,
//     },
//     {
//       id: 7,
//       name: "Chobani Greek Yogurt Variety Pack",
//       price: 11.2,
//       oldPrice: 14.0,
//       discount: "20%",
//       img: pp,
//       rating: 5,
//       description:
//         "Non-fat Greek yogurt with real fruit pieces. A protein-packed snack for any time of day.",
//       recommended: true,
//     },
//     {
//       id: 8,
//       name: "Pure Leaf Unsweetened Black Iced Tea",
//       price: 2.99,
//       oldPrice: 4.5,
//       discount: "33%",
//       img: pp,
//       rating: 4,
//       description:
//         "Brewed from real tea leaves with no added sugar or artificial sweeteners.",
//       recommended: false,
//     },
//     {
//       id: 9,
//       name: "Oreo Double Stuf Chocolate Sandwich Cookies",
//       price: 4.5,
//       oldPrice: 6.0,
//       discount: "25%",
//       img: pp,
//       rating: 5,
//       description:
//         "The classic Oreo cookie you love, but with double the amount of smooth creme filling.",
//       recommended: true,
//     },
//     {
//       id: 10,
//       name: "Nespresso Vertuo Coffee Pods - 30 Count",
//       price: 35.0,
//       oldPrice: 45.0,
//       discount: "22%",
//       img: pp,
//       rating: 5,
//       description:
//         "A selection of premium coffee blends designed specifically for the Nespresso Vertuo system.",
//       recommended: false,
//     },
//   ];

//   // Calculate pagination
//   const indexOfLastProduct = currentPage * productsPerPage;
//   const indexOfFirstProduct = indexOfLastProduct - productsPerPage;
//   const currentProducts = products.slice(
//     indexOfFirstProduct,
//     indexOfLastProduct
//   );

//   const totalPages = Math.ceil(products.length / productsPerPage);

//   const handlePageChange = (pageNumber) => {
//     setCurrentPage(pageNumber);
//   };

//   return (
//     <section>
//       <div className="container mx-auto">
//         <div className="px-4 py-10 grid grid-cols-4">
//           <div className="col-span-1">
//             <Sidebar />
//           </div>
//           <div className="col-span-3">
//             <HeroBanner />
//             <ProductControls columns={columns} onChangeColumns={setColumns} />
//             <div
//               className={`grid gap-6 ${
//                 columns === 1
//                   ? "grid-cols-1"
//                   : columns === 2
//                   ? "grid-cols-2"
//                   : columns === 3
//                   ? "grid-cols-3"
//                   : "grid-cols-4"
//               }`}
//             >
//               {currentProducts.map((product) => (
//                 <div key={product.id} className="px-2 lg:px-0">
//                   {columns === 1 ? (
//                     <SingleProductCard product={product} />
//                   ) : (
//                     <ProductCard product={product} />
//                   )}
//                 </div>
//               ))}
//             </div>

//             {/* Pagination */}
//             <div className="flex justify-center mt-6 space-x-2">
//               {Array.from({ length: totalPages }, (_, i) => i + 1).map(
//                 (page) => (
//                   <button
//                     key={page}
//                     onClick={() => handlePageChange(page)}
//                     className={`px-3 py-1 rounded ${
//                       currentPage === page
//                         ? "bg-blue-500 text-white"
//                         : "bg-gray-200 text-gray-700"
//                     }`}
//                   >
//                     {page}
//                   </button>
//                 )
//               )}
//             </div>
//           </div>
//         </div>
//       </div>
//     </section>
//   );
// };

// export default Listing;
