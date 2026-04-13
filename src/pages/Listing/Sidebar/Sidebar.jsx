import { useContext, useMemo, useState } from "react";
import banner3 from "../../../assets/banner3.jpg";
import PriceFilter from "../PriceFilter/PriceFilter";
import { StoreContext } from "../../../context/StoreContext";

// ⭐ Star row component
const StarRow = ({ star, isActive, onClick }) => (
  <div
    className="flex items-center gap-2 cursor-pointer group py-1"
    onClick={() => onClick(star)}
  >
    <div className="flex items-center gap-0.5">
      {[...Array(5)].map((_, i) => (
        <svg key={i} width="15" height="15" viewBox="0 0 24 24"
          fill={i < star ? "#ffb400" : "#e0e0e0"}
          className="transition-all duration-150 group-hover:scale-110"
        >
          <path d="M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z" />
        </svg>
      ))}
    </div>
    <span className={`text-[13px] font-medium transition-colors ${
      isActive ? "text-[#2bbef9] font-semibold" : "text-gray-400 group-hover:text-gray-600"
    }`}>
      & up
    </span>
    {isActive && (
      <span className="ml-auto text-[10px] font-bold text-[#2bbef9] bg-blue-50 px-2 py-0.5 rounded-full">
        ✓
      </span>
    )}
  </div>
);

const Sidebar = ({ products, categoryId, selectedSubCat, onSubCatChange, onFilterChange }) => {
  const { subCategories } = useContext(StoreContext);

  // current category এর subCategories only
  const filteredSubCats = categoryId
    ? subCategories.filter(
        (s) => (s.category?._id || s.category)?.toString() === categoryId?.toString()
      )
    : [];

  const [minPrice, setMinPrice]             = useState(0);
  const [maxPrice, setMaxPrice]             = useState(100000);
  const [selectedBrands, setSelectedBrands] = useState([]);
  const [stockFilter, setStockFilter]       = useState("");
  const [ratingFilter, setRatingFilter]     = useState(0);

  const brands = useMemo(() => {
    if (!products || products.length === 0) return [];
    const brandMap = {};
    products.forEach((p) => {
      if (p.brand) brandMap[p.brand] = (brandMap[p.brand] || 0) + 1;
    });
    return Object.entries(brandMap).map(([name, count]) => ({ name, count }));
  }, [products]);

  const notify = (patch) => {
    onFilterChange?.({
      minPrice, maxPrice, brands: selectedBrands, stock: stockFilter, rating: ratingFilter,
      ...patch,
    });
  };

  const toggleBrand = (brandName) => {
    const updated = selectedBrands.includes(brandName)
      ? selectedBrands.filter((b) => b !== brandName)
      : [...selectedBrands, brandName];
    setSelectedBrands(updated);
    notify({ brands: updated });
  };

  const handleMinChange = (val) => { setMinPrice(val); notify({ minPrice: val }); };
  const handleMaxChange = (val) => { setMaxPrice(val); notify({ maxPrice: val }); };

  const handleStockFilter = (val) => {
    const updated = stockFilter === val ? "" : val;
    setStockFilter(updated);
    notify({ stock: updated });
  };

  const handleRatingFilter = (val) => {
    const updated = ratingFilter === val ? 0 : val;
    setRatingFilter(updated);
    notify({ rating: updated });
  };

  // reusable custom checkbox
  const CustomCheckbox = ({ isActive }) => (
    <div className={`w-5 h-5 rounded border-2 flex items-center justify-center flex-shrink-0 transition-all duration-200 ${
      isActive ? "bg-[#2bbef9] border-[#2bbef9]" : "border-gray-300 bg-white group-hover:border-[#2bbef9]"
    }`}>
      {isActive && (
        <svg width="11" height="8" viewBox="0 0 11 8" fill="none">
          <path d="M1 4L4 7L10 1" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      )}
    </div>
  );

  return (
    <>
      <style>{`
        .sb-scroll::-webkit-scrollbar { width: 4px; }
        .sb-scroll::-webkit-scrollbar-track { background: #f1f5f9; border-radius: 10px; }
        .sb-scroll::-webkit-scrollbar-thumb { background: #2bbef9; border-radius: 10px; }
        .sb-scroll::-webkit-scrollbar-thumb:hover { background: #1a9fd8; }
        .sb-scroll { scrollbar-width: thin; scrollbar-color: #2bbef9 #f1f5f9; }
      `}</style>

      <div className="p-6 rounded-lg">

        {/* SubCategories */}
        <h2 className="text-gray-700 font-bold text-lg mb-3 tracking-wide uppercase">
          Product Categories
        </h2>
        <div
          className={`space-y-3 mb-10 pr-2 ${filteredSubCats.length > 5 ? "sb-scroll" : ""}`}
          style={{
            maxHeight: filteredSubCats.length > 5 ? "210px" : "auto",
            overflowY: filteredSubCats.length > 5 ? "auto" : "visible",
          }}
        >
          {filteredSubCats.length === 0 ? (
            <p className="text-gray-400 text-sm">No subcategories found</p>
          ) : filteredSubCats.map((sub) => {
            const isSelected = selectedSubCat === sub._id;
            return (
              <label key={sub._id} className="flex items-center group cursor-pointer"
                onClick={() => onSubCatChange(isSelected ? "" : sub._id)}>
                <CustomCheckbox isActive={isSelected} />
                <span className={`ml-3 text-[14px] font-medium transition-colors duration-200 ${
                  isSelected ? "text-[#2bbef9] font-semibold" : "text-gray-500 group-hover:text-[#2bbef9]"
                }`}>
                  {sub.subCat}
                </span>
              </label>
            );
          })}
        </div>

        {/* Price Filter */}
        <PriceFilter minPrice={minPrice} maxPrice={maxPrice}
          onMinChange={handleMinChange} onMaxChange={handleMaxChange} />

        {/* Product Status */}
        <div className="mb-10">
          <h3 className="text-gray-800 font-bold text-sm tracking-widest uppercase mb-3">Product Status</h3>
          <div className="space-y-3">
            {[{ label: "In Stock", value: "instock" }, { label: "On Sale", value: "onsale" }].map(({ label, value }) => {
              const isActive = stockFilter === value;
              return (
                <label key={value} className="flex items-center cursor-pointer group"
                  onClick={() => handleStockFilter(value)}>
                  <CustomCheckbox isActive={isActive} />
                  <span className={`ml-3 text-[14px] font-medium transition-colors duration-200 ${
                    isActive ? "text-[#2bbef9] font-semibold" : "text-gray-500 group-hover:text-[#2bbef9]"
                  }`}>
                    {label}
                  </span>
                </label>
              );
            })}
          </div>
        </div>

        {/* ⭐ Rating Filter */}
        <div className="mb-10">
          <h3 className="text-gray-800 font-bold text-sm tracking-widest uppercase mb-3">Rating</h3>
          <div className="space-y-1">
            {[4, 3, 2, 1].map((star) => (
              <StarRow
                key={star}
                star={star}
                isActive={ratingFilter === star}
                onClick={handleRatingFilter}
              />
            ))}
          </div>
        </div>

        {/* Brands */}
        <div className="mb-10">
          <h3 className="text-gray-800 font-bold text-sm tracking-widest uppercase mb-3">Brands</h3>
          {brands.length === 0 ? (
            <p className="text-gray-400 text-sm">No brands found</p>
          ) : (
            <div className={`sb-scroll space-y-3 pr-2 ${brands.length > 5 ? "max-h-48 overflow-y-auto" : ""}`}>
              {brands.map((brand) => {
                const isActive = selectedBrands.includes(brand.name);
                return (
                  <label key={brand.name} className="flex items-center justify-between cursor-pointer group"
                    onClick={() => toggleBrand(brand.name)}>
                    <div className="flex items-center gap-3">
                      <CustomCheckbox isActive={isActive} />
                      <span className={`text-[14px] font-medium transition-colors duration-200 ${
                        isActive ? "text-[#2bbef9] font-semibold" : "text-gray-500 group-hover:text-[#2bbef9]"
                      }`}>
                        {brand.name}
                      </span>
                    </div>
                    <span className="text-gray-400 text-sm">({brand.count})</span>
                  </label>
                );
              })}
            </div>
          )}
        </div>

        {/* Banner */}
        <div className="w-full h-[350px]">
          <img className="w-full rounded-2xl h-full object-cover" src={banner3} alt="banner" />
        </div>
      </div>
    </>
  );
};

export default Sidebar;

















// import { useContext, useMemo, useState } from "react";
// import banner3 from "../../../assets/banner3.jpg";
// import PriceFilter from "../PriceFilter/PriceFilter";
// import { StoreContext } from "../../../context/StoreContext";

// // ⭐ Star row component
// const StarRow = ({ star, isActive, onClick }) => (
//   <div
//     className="flex items-center gap-2 cursor-pointer group py-1"
//     onClick={() => onClick(star)}
//   >
//     <div className="flex items-center gap-0.5">
//       {[...Array(5)].map((_, i) => (
//         <svg key={i} width="15" height="15" viewBox="0 0 24 24"
//           fill={i < star ? "#ffb400" : "#e0e0e0"}
//           className="transition-all duration-150 group-hover:scale-110"
//         >
//           <path d="M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z" />
//         </svg>
//       ))}
//     </div>
//     <span className={`text-[13px] font-medium transition-colors ${
//       isActive ? "text-[#2bbef9] font-semibold" : "text-gray-400 group-hover:text-gray-600"
//     }`}>
//       & up
//     </span>
//     {isActive && (
//       <span className="ml-auto text-[10px] font-bold text-[#2bbef9] bg-blue-50 px-2 py-0.5 rounded-full">
//         ✓
//       </span>
//     )}
//   </div>
// );

// const Sidebar = ({ products, selectedSubCat, onSubCatChange, onFilterChange }) => {
//   const { subCategories } = useContext(StoreContext);

//   const [minPrice, setMinPrice]             = useState(0);
//   const [maxPrice, setMaxPrice]             = useState(100000);
//   const [selectedBrands, setSelectedBrands] = useState([]);
//   const [stockFilter, setStockFilter]       = useState("");
//   const [ratingFilter, setRatingFilter]     = useState(0);

//   const brands = useMemo(() => {
//     if (!products || products.length === 0) return [];
//     const brandMap = {};
//     products.forEach((p) => {
//       if (p.brand) brandMap[p.brand] = (brandMap[p.brand] || 0) + 1;
//     });
//     return Object.entries(brandMap).map(([name, count]) => ({ name, count }));
//   }, [products]);

//   const notify = (patch) => {
//     onFilterChange?.({
//       minPrice, maxPrice, brands: selectedBrands, stock: stockFilter, rating: ratingFilter,
//       ...patch,
//     });
//   };

//   const toggleBrand = (brandName) => {
//     const updated = selectedBrands.includes(brandName)
//       ? selectedBrands.filter((b) => b !== brandName)
//       : [...selectedBrands, brandName];
//     setSelectedBrands(updated);
//     notify({ brands: updated });
//   };

//   const handleMinChange = (val) => { setMinPrice(val); notify({ minPrice: val }); };
//   const handleMaxChange = (val) => { setMaxPrice(val); notify({ maxPrice: val }); };

//   const handleStockFilter = (val) => {
//     const updated = stockFilter === val ? "" : val;
//     setStockFilter(updated);
//     notify({ stock: updated });
//   };

//   const handleRatingFilter = (val) => {
//     const updated = ratingFilter === val ? 0 : val;
//     setRatingFilter(updated);
//     notify({ rating: updated });
//   };

//   // reusable custom checkbox
//   const CustomCheckbox = ({ isActive }) => (
//     <div className={`w-5 h-5 rounded border-2 flex items-center justify-center flex-shrink-0 transition-all duration-200 ${
//       isActive ? "bg-[#2bbef9] border-[#2bbef9]" : "border-gray-300 bg-white group-hover:border-[#2bbef9]"
//     }`}>
//       {isActive && (
//         <svg width="11" height="8" viewBox="0 0 11 8" fill="none">
//           <path d="M1 4L4 7L10 1" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
//         </svg>
//       )}
//     </div>
//   );

//   return (
//     <>
//       <style>{`
//         .sb-scroll::-webkit-scrollbar { width: 4px; }
//         .sb-scroll::-webkit-scrollbar-track { background: #f1f5f9; border-radius: 10px; }
//         .sb-scroll::-webkit-scrollbar-thumb { background: #2bbef9; border-radius: 10px; }
//         .sb-scroll::-webkit-scrollbar-thumb:hover { background: #1a9fd8; }
//         .sb-scroll { scrollbar-width: thin; scrollbar-color: #2bbef9 #f1f5f9; }
//       `}</style>

//       <div className="p-6 rounded-lg">

//         {/* SubCategories */}
//         <h2 className="text-gray-700 font-bold text-lg mb-3 tracking-wide uppercase">
//           Product Categories
//         </h2>
//         <div
//           className={`space-y-3 mb-10 pr-2 ${subCategories.length > 5 ? "sb-scroll" : ""}`}
//           style={{
//             maxHeight: subCategories.length > 5 ? "210px" : "auto",
//             overflowY: subCategories.length > 5 ? "auto" : "visible",
//           }}
//         >
//           {subCategories.length === 0 ? (
//             <p className="text-gray-400 text-sm">No subcategories found</p>
//           ) : subCategories.map((sub) => {
//             const isSelected = selectedSubCat === sub._id;
//             return (
//               <label key={sub._id} className="flex items-center group cursor-pointer"
//                 onClick={() => onSubCatChange(isSelected ? "" : sub._id)}>
//                 <CustomCheckbox isActive={isSelected} />
//                 <span className={`ml-3 text-[14px] font-medium transition-colors duration-200 ${
//                   isSelected ? "text-[#2bbef9] font-semibold" : "text-gray-500 group-hover:text-[#2bbef9]"
//                 }`}>
//                   {sub.subCat}
//                 </span>
//               </label>
//             );
//           })}
//         </div>

//         {/* Price Filter */}
//         <PriceFilter minPrice={minPrice} maxPrice={maxPrice}
//           onMinChange={handleMinChange} onMaxChange={handleMaxChange} />

//         {/* Product Status */}
//         <div className="mb-10">
//           <h3 className="text-gray-800 font-bold text-sm tracking-widest uppercase mb-3">Product Status</h3>
//           <div className="space-y-3">
//             {[{ label: "In Stock", value: "instock" }, { label: "On Sale", value: "onsale" }].map(({ label, value }) => {
//               const isActive = stockFilter === value;
//               return (
//                 <label key={value} className="flex items-center cursor-pointer group"
//                   onClick={() => handleStockFilter(value)}>
//                   <CustomCheckbox isActive={isActive} />
//                   <span className={`ml-3 text-[14px] font-medium transition-colors duration-200 ${
//                     isActive ? "text-[#2bbef9] font-semibold" : "text-gray-500 group-hover:text-[#2bbef9]"
//                   }`}>
//                     {label}
//                   </span>
//                 </label>
//               );
//             })}
//           </div>
//         </div>

//         {/* ⭐ Rating Filter */}
//         <div className="mb-10">
//           <h3 className="text-gray-800 font-bold text-sm tracking-widest uppercase mb-3">Rating</h3>
//           <div className="space-y-1">
//             {[4, 3, 2, 1].map((star) => (
//               <StarRow
//                 key={star}
//                 star={star}
//                 isActive={ratingFilter === star}
//                 onClick={handleRatingFilter}
//               />
//             ))}
//           </div>
//         </div>

//         {/* Brands */}
//         <div className="mb-10">
//           <h3 className="text-gray-800 font-bold text-sm tracking-widest uppercase mb-3">Brands</h3>
//           {brands.length === 0 ? (
//             <p className="text-gray-400 text-sm">No brands found</p>
//           ) : (
//             <div className={`sb-scroll space-y-3 pr-2 ${brands.length > 5 ? "max-h-48 overflow-y-auto" : ""}`}>
//               {brands.map((brand) => {
//                 const isActive = selectedBrands.includes(brand.name);
//                 return (
//                   <label key={brand.name} className="flex items-center justify-between cursor-pointer group"
//                     onClick={() => toggleBrand(brand.name)}>
//                     <div className="flex items-center gap-3">
//                       <CustomCheckbox isActive={isActive} />
//                       <span className={`text-[14px] font-medium transition-colors duration-200 ${
//                         isActive ? "text-[#2bbef9] font-semibold" : "text-gray-500 group-hover:text-[#2bbef9]"
//                       }`}>
//                         {brand.name}
//                       </span>
//                     </div>
//                     <span className="text-gray-400 text-sm">({brand.count})</span>
//                   </label>
//                 );
//               })}
//             </div>
//           )}
//         </div>

//         {/* Banner */}
//         <div className="w-full h-[350px]">
//           <img className="w-full rounded-2xl h-full object-cover" src={banner3} alt="banner" />
//         </div>
//       </div>
//     </>
//   );
// };

// export default Sidebar;







