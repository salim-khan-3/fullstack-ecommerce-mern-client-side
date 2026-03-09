import React, { useContext, useRef, useState } from "react";
import { ChevronDown, Grid3X3 } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import { StoreContext } from "../../../context/StoreContext";

const CategoryNavigation = () => {
  const { categories, getSubCatsByCategory } = useContext(StoreContext);

  const [isCatOpen, setIsCatOpen] = useState(false);
  const [openNav, setOpenNav]     = useState(null);
  const [hoveredCat, setHoveredCat] = useState(null);

  const isDesktop  = () => window.innerWidth >= 1024;
  const dropdownRef = useRef(null);
  const navigate    = useNavigate();

  // outside click close
  React.useEffect(() => {
    const handler = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setIsCatOpen(false);
        setHoveredCat(null);
      }
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  return (
    <div className="w-full bg-white shadow-sm relative z-[100]">
      <div className="container mx-auto px-4 flex items-center relative" style={{ overflow: "visible" }}>

        {/* ALL CATEGORIES — desktop only */}
        <div className="hidden lg:block relative py-3 pr-6" ref={dropdownRef} style={{ zIndex: 101 }}>
          <button
            onClick={() => setIsCatOpen(!isCatOpen)}
            className="flex items-center gap-2 px-5 py-2.5 rounded-full text-white text-[12px] font-bold bg-blue-600 hover:bg-blue-700 transition-all shadow-sm"
          >
            <Grid3X3 size={15} /> ALL CATEGORIES
            <ChevronDown size={13} className={isCatOpen ? "rotate-180" : ""} />
          </button>

          {isCatOpen && (
            <div className="absolute top-full left-0 mt-2 bg-white rounded-xl shadow-2xl min-w-[230px] py-2 flex border border-gray-100 z-[9999]">
              <div className="min-w-[200px] py-1 bg-white rounded-l-xl">
                {categories.map((cat) => {
                  const subs = getSubCatsByCategory(cat._id);
                  return (
                    <button
                      key={cat._id}
                      onMouseEnter={() => setHoveredCat(subs.length > 0 ? cat : null)}
                      onClick={() => { setIsCatOpen(false); navigate(`/category/${cat._id}`); }}
                      className="flex items-center justify-between w-full px-5 py-2.5 text-sm font-medium hover:bg-blue-50 hover:text-blue-600"
                    >
                      {cat.name}
                      {subs.length > 0 && <ChevronDown size={11} className="-rotate-90" />}
                    </button>
                  );
                })}
              </div>

              {hoveredCat && (
                <div className="border-l min-w-[190px] py-1 bg-white rounded-r-xl shadow-lg">
                  {getSubCatsByCategory(hoveredCat._id).map((sub) => (
                    <Link
                      key={sub._id}
                      to={`/category/${hoveredCat._id}?subCat=${sub._id}`}
                      onClick={() => { setIsCatOpen(false); setHoveredCat(null); }}
                      className="flex items-center gap-3 px-5 py-2.5 text-[12.5px] text-gray-500 hover:bg-blue-50 hover:text-blue-600"
                    >
                      <span className="w-1.5 h-1.5 rounded-full bg-blue-300"></span> {sub.subCat}
                    </Link>
                  ))}
                </div>
              )}
            </div>
          )}
        </div>

        {/* NAV LINKS */}
        <nav className="flex-1 lg:ml-5 overflow-x-auto lg:overflow-visible scrollbar-none">
          <ul className="flex items-center gap-1 lg:gap-2 whitespace-nowrap py-1 lg:overflow-visible">
            {categories.map((cat) => {
              const subs = getSubCatsByCategory(cat._id);
              return (
                <li
                  key={cat._id}
                  className="relative group"
                  onMouseEnter={() => isDesktop() && setOpenNav(cat._id)}
                  onMouseLeave={() => isDesktop() && setOpenNav(null)}
                >
                  <Link
                    to={`/category/${cat._id}`}
                    className="flex items-center gap-1 px-3 py-4 lg:py-5 text-[12px] lg:text-[13px] font-bold text-gray-600 hover:text-blue-600 uppercase tracking-tighter"
                  >
                    {cat.name}
                    {subs.length > 0 && (
                      <ChevronDown size={11} className="hidden lg:block opacity-40 transition-transform group-hover:rotate-180" />
                    )}
                  </Link>

                  {openNav === cat._id && subs.length > 0 && isDesktop() && (
                    <div className="absolute top-full left-0 z-[9999] bg-white rounded-xl py-2 min-w-[210px] shadow-2xl border border-gray-100">
                      {subs.map((sub) => (
                        <Link
                          key={sub._id}
                          to={`/category/${cat._id}?subCat=${sub._id}`}
                          className="flex items-center gap-3 px-5 py-2.5 text-[12.5px] text-gray-500 hover:bg-blue-50 hover:text-blue-600 font-medium"
                        >
                          <span className="w-1.5 h-1.5 rounded-full bg-blue-300"></span> {sub.subCat}
                        </Link>
                      ))}
                    </div>
                  )}
                </li>
              );
            })}
          </ul>
        </nav>
      </div>
    </div>
  );
};

export default CategoryNavigation;



















// import React, { useEffect, useRef, useState } from "react";
// import { ChevronDown, Grid3X3 } from "lucide-react";
// import { Link, useNavigate } from "react-router-dom";
// import { getAllCategoriesForUI } from "../../../utils/api/categoryApi";
// import { getAllSubCategories } from "../../../utils/api/subCategoryApi";

// const CategoryNavigation = () => {
//   const [categories, setCategories] = useState([]);
//   const [subCategories, setSubCategories] = useState([]);
//   const [isCatOpen, setIsCatOpen] = useState(false);
//   const [openNav, setOpenNav] = useState(null);
//   const [hoveredCat, setHoveredCat] = useState(null);

//   const isDesktop = () => window.innerWidth >= 1024;
//   const dropdownRef = useRef(null);
//   const navigate = useNavigate();

//   useEffect(() => {
//     const fetchData = async () => {
//       try {
//         const catData = await getAllCategoriesForUI();
//         setCategories(Array.isArray(catData) ? catData : []);
//         const subData = await getAllSubCategories();
//         setSubCategories(Array.isArray(subData) ? subData : []);
//       } catch (error) { console.error(error); }
//     };
//     fetchData();
//   }, []);

//   useEffect(() => {
//     const handler = (e) => {
//       if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
//         setIsCatOpen(false);
//         setHoveredCat(null);
//       }
//     };
//     document.addEventListener("mousedown", handler);
//     return () => document.removeEventListener("mousedown", handler);
//   }, []);

//   const getSubCats = (cat) => {
//     return subCategories.filter((s) => (s.category?._id || s.category)?.toString() === cat._id?.toString());
//   };

//   return (
//     <div className="w-full bg-white shadow-sm relative z-[100]">
//       <div className="container mx-auto px-4 flex items-center relative" style={{ overflow: "visible" }}>
        
//         {/* ALL CATEGORIES (Desktop Only) - বর্ডার রিমুভ করা হয়েছে */}
//         <div className="hidden lg:block relative py-3 pr-6" ref={dropdownRef} style={{ zIndex: 101 }}>
//           <button 
//             onClick={() => setIsCatOpen(!isCatOpen)} 
//             className="flex items-center gap-2 px-5 py-2.5 rounded-full text-white text-[12px] font-bold bg-blue-600 hover:bg-blue-700 transition-all shadow-sm"
//           >
//             <Grid3X3 size={15} /> ALL CATEGORIES <ChevronDown size={13} className={isCatOpen ? "rotate-180" : ""} />
//           </button>

//           {isCatOpen && (
//             <div className="absolute top-full left-0 mt-2 bg-white rounded-xl shadow-2xl min-w-[230px] py-2 flex border border-gray-100 z-[9999]">
//               <div className="min-w-[200px] py-1 bg-white rounded-l-xl">
//                 {categories.map((cat) => (
//                   <button 
//                     key={cat._id} 
//                     onMouseEnter={() => setHoveredCat(getSubCats(cat).length > 0 ? cat : null)} 
//                     onClick={() => { setIsCatOpen(false); navigate(`/category/${cat._id}`); }} 
//                     className="flex items-center justify-between w-full px-5 py-2.5 text-sm font-medium hover:bg-blue-50 hover:text-blue-600"
//                   >
//                     {cat.name} {getSubCats(cat).length > 0 && <ChevronDown size={11} className="-rotate-90" />}
//                   </button>
//                 ))}
//               </div>
//               {hoveredCat && (
//                 <div className="border-l min-w-[190px] py-1 bg-white rounded-r-xl shadow-lg">
//                   {getSubCats(hoveredCat).map((sub) => (
//                     <Link key={sub._id} to={`/category/${hoveredCat._id}?subCat=${sub._id}`} onClick={() => { setIsCatOpen(false); setHoveredCat(null); }} className="flex items-center gap-3 px-5 py-2.5 text-[12.5px] text-gray-500 hover:bg-blue-50 hover:text-blue-600">
//                       <span className="w-1.5 h-1.5 rounded-full bg-blue-300"></span> {sub.subCat}
//                     </Link>
//                   ))}
//                 </div>
//               )}
//             </div>
//           )}
//         </div>

//         <nav className="flex-1 lg:ml-5 overflow-x-auto lg:overflow-visible scrollbar-none">
//           <ul className="flex items-center gap-1 lg:gap-2 whitespace-nowrap py-1 lg:overflow-visible">
//             {categories.map((cat) => (
//               <li 
//                 key={cat._id} 
//                 className="relative group"
//                 onMouseEnter={() => isDesktop() && setOpenNav(cat._id)} 
//                 onMouseLeave={() => isDesktop() && setOpenNav(null)}
//               >
//                 <Link to={`/category/${cat._id}`} className="flex items-center gap-1 px-3 py-4 lg:py-5 text-[12px] lg:text-[13px] font-bold text-gray-600 hover:text-blue-600 uppercase tracking-tighter">
//                   {cat.name}
//                   {getSubCats(cat).length > 0 && <ChevronDown size={11} className="hidden lg:block opacity-40 transition-transform group-hover:rotate-180" />}
//                 </Link>

//                 {/* Desktop Sub-Dropdown */}
//                 {openNav === cat._id && getSubCats(cat).length > 0 && isDesktop() && (
//                   <div className="absolute top-full left-0 z-[9999] bg-white rounded-xl py-2 min-w-[210px] shadow-2xl border border-gray-100">
//                     {getSubCats(cat).map((sub) => (
//                       <Link 
//                         key={sub._id} 
//                         to={`/category/${cat._id}?subCat=${sub._id}`} 
//                         className="flex items-center gap-3 px-5 py-2.5 text-[12.5px] text-gray-500 hover:bg-blue-50 hover:text-blue-600 font-medium"
//                       >
//                         <span className="w-1.5 h-1.5 rounded-full bg-blue-300"></span> {sub.subCat}
//                       </Link>
//                     ))}
//                   </div>
//                 )}
//               </li>
//             ))}
//           </ul>
//         </nav>
//       </div>
//     </div>
//   );
// };

// export default CategoryNavigation;









