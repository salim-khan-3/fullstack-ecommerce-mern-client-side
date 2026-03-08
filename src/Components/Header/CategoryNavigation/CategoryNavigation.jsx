import React, { useEffect, useRef, useState } from "react";
import { ChevronDown, Grid3X3 } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import { getAllCategoriesForUI } from "../../../utils/api/categoryApi";
import { getAllSubCategories } from "../../../utils/api/subCategoryApi";

const CategoryNavigation = () => {
  const [categories, setCategories] = useState([]);
  const [subCategories, setSubCategories] = useState([]);
  const [isCatOpen, setIsCatOpen] = useState(false);
  const [openNav, setOpenNav] = useState(null);
  const [hoveredCat, setHoveredCat] = useState(null);

  const isDesktop = () => window.innerWidth >= 1024;
  const dropdownRef = useRef(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const catData = await getAllCategoriesForUI();
        setCategories(Array.isArray(catData) ? catData : []);
        const subData = await getAllSubCategories();
        setSubCategories(Array.isArray(subData) ? subData : []);
      } catch (error) { console.error(error); }
    };
    fetchData();
  }, []);

  useEffect(() => {
    const handler = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setIsCatOpen(false);
        setHoveredCat(null);
      }
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  const getSubCats = (cat) => {
    return subCategories.filter((s) => (s.category?._id || s.category)?.toString() === cat._id?.toString());
  };

  return (
    <div className="w-full bg-white border-b shadow-sm relative z-[100]">
      <div className="container mx-auto px-4 flex items-center relative" style={{ overflow: "visible" }}>
        
        {/* ALL CATEGORIES (Desktop Only) - বর্ডার রিমুভ করা হয়েছে */}
        <div className="hidden lg:block relative py-3 pr-6" ref={dropdownRef} style={{ zIndex: 101 }}>
          <button 
            onClick={() => setIsCatOpen(!isCatOpen)} 
            className="flex items-center gap-2 px-5 py-2.5 rounded-full text-white text-[12px] font-bold bg-blue-600 hover:bg-blue-700 transition-all shadow-sm"
          >
            <Grid3X3 size={15} /> ALL CATEGORIES <ChevronDown size={13} className={isCatOpen ? "rotate-180" : ""} />
          </button>

          {isCatOpen && (
            <div className="absolute top-full left-0 mt-2 bg-white rounded-xl shadow-2xl min-w-[230px] py-2 flex border border-gray-100 z-[9999]">
              <div className="min-w-[200px] py-1 bg-white rounded-l-xl">
                {categories.map((cat) => (
                  <button 
                    key={cat._id} 
                    onMouseEnter={() => setHoveredCat(getSubCats(cat).length > 0 ? cat : null)} 
                    onClick={() => { setIsCatOpen(false); navigate(`/category/${cat._id}`); }} 
                    className="flex items-center justify-between w-full px-5 py-2.5 text-sm font-medium hover:bg-blue-50 hover:text-blue-600"
                  >
                    {cat.name} {getSubCats(cat).length > 0 && <ChevronDown size={11} className="-rotate-90" />}
                  </button>
                ))}
              </div>
              {hoveredCat && (
                <div className="border-l min-w-[190px] py-1 bg-white rounded-r-xl shadow-lg">
                  {getSubCats(hoveredCat).map((sub) => (
                    <Link key={sub._id} to={`/category/${hoveredCat._id}?subCat=${sub._id}`} onClick={() => { setIsCatOpen(false); setHoveredCat(null); }} className="flex items-center gap-3 px-5 py-2.5 text-[12.5px] text-gray-500 hover:bg-blue-50 hover:text-blue-600">
                      <span className="w-1.5 h-1.5 rounded-full bg-blue-300"></span> {sub.subCat}
                    </Link>
                  ))}
                </div>
              )}
            </div>
          )}
        </div>

        {/* MAIN NAV - বর্ডার এবং কালো দাগ রিমুভ করা হয়েছে */}
        <nav className="flex-1 lg:ml-5 overflow-x-auto lg:overflow-visible scrollbar-none">
          <ul className="flex items-center gap-1 lg:gap-2 whitespace-nowrap py-1 lg:overflow-visible">
            {categories.map((cat) => (
              <li 
                key={cat._id} 
                className="relative group"
                onMouseEnter={() => isDesktop() && setOpenNav(cat._id)} 
                onMouseLeave={() => isDesktop() && setOpenNav(null)}
              >
                <Link to={`/category/${cat._id}`} className="flex items-center gap-1 px-3 py-4 lg:py-5 text-[12px] lg:text-[13px] font-bold text-gray-600 hover:text-blue-600 uppercase tracking-tighter">
                  {cat.name}
                  {getSubCats(cat).length > 0 && <ChevronDown size={11} className="hidden lg:block opacity-40 transition-transform group-hover:rotate-180" />}
                </Link>

                {/* Desktop Sub-Dropdown */}
                {openNav === cat._id && getSubCats(cat).length > 0 && isDesktop() && (
                  <div className="absolute top-full left-0 z-[9999] bg-white rounded-xl py-2 min-w-[210px] shadow-2xl border border-gray-100">
                    {getSubCats(cat).map((sub) => (
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
            ))}
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
//     <>
//       <style>{`
//         .hide-scrollbar::-webkit-scrollbar { display: none; }
//         .hide-scrollbar { -ms-overflow-style: none; scrollbar-width: none; }
//       `}</style>

//       <div className="w-full bg-white shadow-sm border-b overflow-visible">
//         <div className="container mx-auto px-4 flex items-center overflow-visible">
          
//           {/* ALL CATEGORIES (Desktop Only) */}
//           <div className="hidden lg:block relative py-3 pr-6 border-r border-gray-100" ref={dropdownRef}>
//             <button onClick={() => setIsCatOpen(!isCatOpen)} className="flex items-center gap-2 px-5 py-2.5 rounded-full text-white text-sm font-bold bg-blue-500 hover:bg-blue-600 shadow-sm transition-all">
//               <Grid3X3 size={15} /> ALL CATEGORIES <ChevronDown size={13} className={isCatOpen ? "rotate-180" : ""} />
//             </button>

//             {isCatOpen && (
//               <div className="absolute top-full left-0 mt-2 bg-white rounded-2xl shadow-xl min-w-[230px] py-2 z-[300] flex border">
//                 <div className="min-w-[200px] py-1">
//                   {categories.map((cat) => (
//                     <button key={cat._id} onMouseEnter={() => setHoveredCat(getSubCats(cat).length > 0 ? cat : null)} onClick={() => { setIsCatOpen(false); navigate(`/category/${cat._id}`); }} className="flex items-center justify-between w-full px-5 py-2.5 text-sm font-medium hover:bg-blue-50 hover:text-blue-600 transition-colors">
//                       {cat.name} {getSubCats(cat).length > 0 && <ChevronDown size={11} className="-rotate-90" />}
//                     </button>
//                   ))}
//                 </div>
//                 {hoveredCat && (
//                   <div className="border-l min-w-[190px] py-1 bg-white rounded-r-2xl">
//                     {getSubCats(hoveredCat).map((sub) => (
//                       <Link key={sub._id} to={`/category/${hoveredCat._id}?subCat=${sub._id}`} onClick={() => { setIsCatOpen(false); setHoveredCat(null); }} className="flex items-center gap-3 px-5 py-2.5 text-[12.5px] text-gray-500 hover:bg-blue-50 hover:text-blue-600">
//                         <span className="w-1.5 h-1.5 rounded-full bg-blue-300"></span> {sub.subCat}
//                       </Link>
//                     ))}
//                   </div>
//                 )}
//               </div>
//             )}
//           </div>

//           {/* MAIN NAV (Horizontally Scrollable on Mobile) */}
//           <nav className="flex-1 lg:ml-5 overflow-x-auto hide-scrollbar overflow-y-visible">
//             <ul className="flex items-center gap-2 whitespace-nowrap overflow-visible">
//               {categories.map((cat) => (
//                 <li key={cat._id} className="relative" onMouseEnter={() => isDesktop() && setOpenNav(cat._id)} onMouseLeave={() => isDesktop() && setOpenNav(null)}>
//                   <Link to={`/category/${cat._id}`} className="flex items-center gap-1 px-4 py-5 text-[13px] font-bold text-gray-600 hover:text-blue-600 uppercase">
//                     {cat.name} {getSubCats(cat).length > 0 && <ChevronDown size={11} className="hidden lg:block opacity-40" />}
//                   </Link>

//                   {/* Desktop Dropdown */}
//                   {openNav === cat._id && getSubCats(cat).length > 0 && isDesktop() && (
//                     <div className="absolute top-full left-0 z-[9999] bg-white rounded-2xl py-2 min-w-[210px] shadow-2xl border">
//                       {getSubCats(cat).map((sub) => (
//                         <Link key={sub._id} to={`/category/${cat._id}?subCat=${sub._id}`} className="flex items-center gap-3 px-5 py-2.5 text-[12.5px] text-gray-500 hover:bg-blue-50 hover:text-blue-600 font-medium">
//                           <span className="w-1.5 h-1.5 rounded-full bg-blue-300"></span> {sub.subCat}
//                         </Link>
//                       ))}
//                     </div>
//                   )}
//                 </li>
//               ))}
//             </ul>
//           </nav>

//         </div>
//       </div>
//     </>
//   );
// };
// export default CategoryNavigation;





















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
//       } catch (error) {
//         console.error(error);
//       }
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

//   const getSubCats = (cat) =>
//     subCategories.filter((s) => {
//       const catId = s.category?._id || s.category;
//       return catId?.toString() === cat._id?.toString();
//     });

//   return (
//     <>
//       <style>{`
//         @import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;500;600;700&display=swap');

//         .cat-nav-root { font-family: 'DM Sans', sans-serif; }

//         /* ── ALL CATEGORIES: desktop only ── */
//         .cat-all-btn-wrapper { display: none; }
//         @media (min-width: 1024px) {
//           .cat-all-btn-wrapper { display: block; }
//         }

//         /* ── Dropdown animations ── */
//         .cat-all-dropdown,
//         .sub-dropdown { animation: fadeSlideDown 0.16s ease; }

//         @keyframes fadeSlideDown {
//           from { opacity: 0; transform: translateY(-6px); }
//           to   { opacity: 1; transform: translateY(0); }
//         }

//         /* ── Desktop nav link underline ── */
//         .cat-nav-link { position: relative; transition: color 0.2s; }
//         @media (min-width: 1024px) {
//           .cat-nav-link::after {
//             content: '';
//             position: absolute;
//             bottom: 0; left: 50%;
//             transform: translateX(-50%);
//             width: 0; height: 2px;
//             background: #3b82f6;
//             border-radius: 99px;
//             transition: width 0.22s ease;
//           }
//           .cat-nav-link:hover::after { width: 70%; }
//         }

//         /* ── Mobile/tablet: pill chips ── */
//         @media (max-width: 1023px) {
//           .cat-nav-link {
//             display: inline-flex !important;
//             align-items: center !important;
//             padding: 7px 16px !important;
//             border-radius: 999px !important;
//             font-size: 12.5px !important;
//             font-weight: 600 !important;
//             color: #374151 !important;
//             background: #f3f4f6 !important;
//             white-space: nowrap !important;
//             transition: background 0.18s, color 0.18s !important;
//           }
//           .cat-nav-link:hover, .cat-nav-link:active {
//             background: #dbeafe !important;
//             color: #2563eb !important;
//           }
//           .cat-nav-chevron { display: none !important; }
//         }

//         /* ── Chevron rotate ── */
//         .chevron-open  { transform: rotate(180deg); transition: transform 0.2s ease; }
//         .chevron-closed { transition: transform 0.2s ease; }

//         /* ── Sub item hover ── */
//         .sub-item { transition: background 0.15s, color 0.15s, padding-left 0.15s; }
//         .sub-item:hover { padding-left: 22px; }

//         /*
//           KEY LAYOUT:
//           nav (overflow:visible) 
//             → .mob-scroll (overflow-x:auto on mobile, visible on desktop)
//               → ul (overflow:visible)
//                 → li[relative] ← dropdown anchors here ✅
//         */
//         .cat-main-nav,
//         .cat-nav-list { overflow: visible !important; }

//         .mob-scroll {
//           overflow-x: auto;
//           overflow-y: visible;
//           -webkit-overflow-scrolling: touch;
//           scrollbar-width: none;
//           padding: 8px 2px;
//         }
//         .mob-scroll::-webkit-scrollbar { display: none; }

//         @media (min-width: 1024px) {
//           .mob-scroll { overflow: visible; padding: 0; }
//         }
//       `}</style>

//       <div
//         className="cat-nav-root w-full bg-white sticky top-0 z-[100]"
//         style={{ overflow: "visible", boxShadow: "0 2px 10px rgba(0,0,0,0.07)" }}
//       >
//         <div
//           className="container mx-auto px-4 flex items-center"
//           style={{ overflow: "visible" }}
//         >
//           {/* ── ALL CATEGORIES (desktop only) ── */}
//           <div className="cat-all-btn-wrapper relative py-3 pr-5" ref={dropdownRef}>
//             <button
//               onClick={() => setIsCatOpen(!isCatOpen)}
//               className="flex items-center gap-2 px-5 py-2.5 rounded-full text-white text-sm font-bold bg-blue-500 hover:bg-blue-600 transition-colors duration-200 shadow-sm"
//             >
//               <Grid3X3 size={15} />
//               ALL CATEGORIES
//               <ChevronDown size={13} className={isCatOpen ? "chevron-open" : "chevron-closed"} />
//             </button>

//             {isCatOpen && (
//               <div className="cat-all-dropdown absolute top-full left-0 mt-2 bg-white rounded-2xl shadow-xl min-w-[230px] py-2 z-[300] flex">
//                 {/* Left panel */}
//                 <div className="min-w-[200px] py-1">
//                   {categories.map((cat) => {
//                     const subCats = getSubCats(cat);
//                     const isHovered = hoveredCat?._id === cat._id;
//                     return (
//                       <button
//                         key={cat._id}
//                         onClick={() => { setIsCatOpen(false); setHoveredCat(null); navigate(`/category/${cat._id}`); }}
//                         onMouseEnter={() => setHoveredCat(subCats.length > 0 ? cat : null)}
//                         className={`flex items-center justify-between w-full text-left px-5 py-2.5 text-sm font-medium transition-colors duration-150 ${
//                           isHovered ? "bg-blue-50 text-blue-600" : "text-gray-600 hover:bg-blue-50 hover:text-blue-600"
//                         }`}
//                       >
//                         {cat.name}
//                         {subCats.length > 0 && (
//                           <ChevronDown size={11} className="-rotate-90 text-gray-400" />
//                         )}
//                       </button>
//                     );
//                   })}
//                 </div>

//                 {/* Right flyout */}
//                 {hoveredCat && (
//                   <div className="border-l border-gray-100 min-w-[190px] py-1 bg-white rounded-r-2xl">
//                     {getSubCats(hoveredCat).map((sub) => (
//                       <Link
//                         key={sub._id}
//                         to={`/category/${hoveredCat._id}?subCat=${sub._id}`}
//                         onClick={() => { setIsCatOpen(false); setHoveredCat(null); }}
//                         className="sub-item flex items-center gap-3 px-5 py-2.5 text-[12.5px] text-gray-500 hover:bg-blue-50 hover:text-blue-600 font-medium"
//                       >
//                         <span className="w-1.5 h-1.5 rounded-full bg-blue-300 shrink-0" />
//                         {sub.subCat}
//                       </Link>
//                     ))}
//                   </div>
//                 )}
//               </div>
//             )}
//           </div>

//           {/* ── MAIN NAV ── */}
//           <nav className="cat-main-nav flex-1 lg:ml-5">
//             {/* mob-scroll wraps the scroll, nav/ul never have overflow set */}
//             <div className="mob-scroll">
//               <ul className="cat-nav-list flex items-center gap-1 whitespace-nowrap">
//                 {categories.map((cat) => {
//                   const subCats = getSubCats(cat);
//                   const isOpen = openNav === cat._id;

//                   return (
//                     <li
//                       key={cat._id}
//                       className="relative flex-shrink-0"
//                       onMouseEnter={() => { if (isDesktop()) setOpenNav(cat._id); }}
//                       onMouseLeave={() => { if (isDesktop()) setOpenNav(null); }}
//                     >
//                       <Link
//                         to={`/category/${cat._id}`}
//                         className="cat-nav-link flex items-center gap-1.5 px-3 lg:px-4 py-4 lg:py-5 text-[13px] lg:text-[13.5px] font-semibold text-gray-600 hover:text-blue-600"
//                       >
//                         {cat.name}
//                         {subCats.length > 0 && (
//                           <ChevronDown
//                             size={11}
//                             className={`cat-nav-chevron ${isOpen ? "chevron-open text-blue-500" : "chevron-closed text-gray-400"}`}
//                           />
//                         )}
//                       </Link>

//                       {isOpen && subCats.length > 0 && (
//                         <div className="sub-dropdown absolute top-full left-0 z-[9999]">
//                           <div className="bg-white rounded-2xl py-2 min-w-[210px] shadow-[0_16px_48px_rgba(0,0,0,0.18)]">
//                             {subCats.map((sub) => (
//                               <Link
//                                 key={sub._id}
//                                 to={`/category/${cat._id}?subCat=${sub._id}`}
//                                 className="sub-item flex items-center gap-3 px-5 py-2.5 text-[12.5px] text-gray-500 hover:bg-blue-50 hover:text-blue-600 font-medium"
//                               >
//                                 <span className="w-1.5 h-1.5 rounded-full bg-blue-300 shrink-0" />
//                                 {sub.subCat}
//                               </Link>
//                             ))}
//                           </div>
//                         </div>
//                       )}
//                     </li>
//                   );
//                 })}
//               </ul>
//             </div>
//           </nav>

//         </div>
//       </div>
//     </>
//   );
// };

// export default CategoryNavigation;




















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

//   // desktop = lg breakpoint (1024px+)
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
//       } catch (error) {
//         console.error(error);
//       }
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

//     return () => {
//       document.removeEventListener("mousedown", handler);
//     };
//   }, []);

//   const getSubCats = (cat) => {
//     return subCategories.filter((s) => {
//       const catId = s.category?._id || s.category;
//       return catId?.toString() === cat._id?.toString();
//     });
//   };

//   return (
//     <>
//       <style>{`
//         @import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;500;600;700&display=swap');

//         .cat-nav-root {
//           font-family: 'DM Sans', sans-serif;
//         }

//         .cat-all-btn-wrapper {
//           display: none;
//         }
//         @media (min-width: 1024px) {
//           .cat-all-btn-wrapper {
//             display: block;
//           }
//         }

//         .cat-all-dropdown {
//           animation: fadeSlideDown 0.18s ease;
//         }

//         /* Desktop underline effect */
//         .cat-nav-link {
//           position: relative;
//           transition: color 0.2s;
//         }
//         @media (min-width: 1024px) {
//           .cat-nav-link::after {
//             content: '';
//             position: absolute;
//             bottom: 0;
//             left: 50%;
//             transform: translateX(-50%);
//             width: 0;
//             height: 2px;
//             background: #3b82f6;
//             border-radius: 99px;
//             transition: width 0.22s ease;
//           }
//           .cat-nav-link:hover::after {
//             width: 70%;
//           }
//         }

//         .sub-dropdown {
//           animation: fadeSlideDown 0.16s ease;
//           transform-origin: top left;
//         }

//         @keyframes fadeSlideDown {
//           from { opacity: 0; transform: translateY(-6px); }
//           to   { opacity: 1; transform: translateY(0); }
//         }

//         .chevron-open {
//           transform: rotate(180deg);
//           transition: transform 0.2s ease;
//         }
//         .chevron-closed {
//           transition: transform 0.2s ease;
//         }

//         .sub-item {
//           transition: background 0.15s, color 0.15s, padding-left 0.15s;
//         }
//         .sub-item:hover {
//           padding-left: 22px;
//         }

//         /* ── KEY FIX: mobile scroll lives on a wrapper div, NOT on nav/ul ──
//            So overflow-x:auto never clips the absolute dropdown            */
//         .mobile-scroll-wrapper {
//           overflow-x: auto;
//           overflow-y: visible;
//           -webkit-overflow-scrolling: touch;
//           scrollbar-width: none;
//         }
//         .mobile-scroll-wrapper::-webkit-scrollbar {
//           display: none;
//         }
//         @media (min-width: 1024px) {
//           .mobile-scroll-wrapper {
//             overflow: visible;
//           }
//         }

//         /* nav and ul must NEVER clip children */
//         .cat-main-nav,
//         .cat-nav-list {
//           overflow: visible !important;
//         }

//         /* scrollbar hide util */
//         .scrollbar-hide::-webkit-scrollbar { display: none; }
//         .scrollbar-hide { -ms-overflow-style: none; scrollbar-width: none; }
//       `}</style>

//       <div
//         className="cat-nav-root w-full bg-white shadow-md sticky top-0 z-[100]"
//         style={{ overflow: "visible" }}
//       >
//         <div
//           className="container mx-auto px-4 flex items-center justify-between lg:justify-start"
//           style={{ overflow: "visible" }}
//         >

//           {/* ── ALL CATEGORIES BUTTON (desktop only) ── */}
//           <div
//             className="cat-all-btn-wrapper relative py-3 pr-6 border-r border-gray-100"
//             ref={dropdownRef}
//           >
//             <button
//               onClick={() => setIsCatOpen(!isCatOpen)}
//               className="flex items-center gap-2 px-5 py-2.5 rounded-full text-white text-sm font-bold bg-blue-500 hover:bg-blue-600 transition-colors duration-200 shadow-sm"
//             >
//               <Grid3X3 size={15} />
//               ALL CATEGORIES
//               <ChevronDown
//                 size={13}
//                 className={isCatOpen ? "chevron-open" : "chevron-closed"}
//               />
//             </button>

//             {isCatOpen && (
//               <div className="cat-all-dropdown absolute top-full left-0 mt-2 bg-white rounded-2xl shadow-xl min-w-[230px] py-2 z-[300] flex border border-gray-100">
//                 <div className="min-w-[200px] py-1">
//                   {categories.map((cat) => {
//                     const subCats = getSubCats(cat);
//                     const isHovered = hoveredCat?._id === cat._id;
//                     return (
//                       <button
//                         key={cat._id}
//                         onClick={() => {
//                           setIsCatOpen(false);
//                           setHoveredCat(null);
//                           navigate(`/category/${cat._id}`);
//                         }}
//                         onMouseEnter={() =>
//                           setHoveredCat(subCats.length > 0 ? cat : null)
//                         }
//                         className={`flex items-center justify-between w-full text-left px-5 py-2.5 text-sm font-medium transition-colors duration-150 ${
//                           isHovered
//                             ? "bg-blue-50 text-blue-600"
//                             : "text-gray-600 hover:bg-blue-50 hover:text-blue-600"
//                         }`}
//                       >
//                         {cat.name}
//                         {subCats.length > 0 && (
//                           <ChevronDown
//                             size={11}
//                             className="-rotate-90 text-gray-400"
//                           />
//                         )}
//                       </button>
//                     );
//                   })}
//                 </div>

//                 {hoveredCat && (
//                   <div className="border-l border-gray-100 min-w-[190px] py-1 bg-white rounded-r-2xl">
//                     {getSubCats(hoveredCat).map((sub) => (
//                       <Link
//                         key={sub._id}
//                         to={`/category/${hoveredCat._id}?subCat=${sub._id}`}
//                         onClick={() => {
//                           setIsCatOpen(false);
//                           setHoveredCat(null);
//                         }}
//                         className="sub-item flex items-center gap-3 px-5 py-2.5 text-[12.5px] text-gray-500 hover:bg-blue-50 hover:text-blue-600 font-medium"
//                       >
//                         <span className="w-1.5 h-1.5 rounded-full bg-blue-300 flex-shrink-0"></span>
//                         {sub.subCat}
//                       </Link>
//                     ))}
//                   </div>
//                 )}
//               </div>
//             )}
//           </div>

//           {/* ── MAIN NAV ── */}
//           {/*
//             STRUCTURE (important!):
//             nav.cat-main-nav  → overflow: visible (never clips)
//               div.mobile-scroll-wrapper → overflow-x:auto on mobile, visible on desktop
//                 ul.cat-nav-list → overflow: visible (never clips)
//                   li (relative) → dropdown anchors here
//           */}
//           <nav className="cat-main-nav flex-1 lg:ml-5">
//             <div className="mobile-scroll-wrapper">
//               <ul className="cat-nav-list flex items-center gap-1 whitespace-nowrap">
//                 {categories.map((cat) => {
//                   const subCats = getSubCats(cat);
//                   const isOpen = openNav === cat._id;

//                   return (
//                     <li
//                       key={cat._id}
//                       className="relative flex-shrink-0"
//                       onMouseEnter={() => {
//                         if (isDesktop()) setOpenNav(cat._id);
//                       }}
//                       onMouseLeave={() => {
//                         if (isDesktop()) setOpenNav(null);
//                       }}
//                     >
//                       <Link
//                         to={`/category/${cat._id}`}
//                         className="cat-nav-link flex items-center gap-1.5 px-3 lg:px-4 py-4 lg:py-5 text-[13px] lg:text-[13.5px] font-semibold text-gray-600 hover:text-blue-600"
//                       >
//                         {cat.name}
//                         {subCats.length > 0 && (
//                           <ChevronDown
//                             size={11}
//                             className={`hidden lg:block ${
//                               isOpen
//                                 ? "chevron-open text-blue-500"
//                                 : "chevron-closed text-gray-400"
//                             }`}
//                           />
//                         )}
//                       </Link>

//                       {isOpen && subCats.length > 0 && (
//                         <div className="sub-dropdown absolute top-full left-0 z-[9999]">
//                           <div className="bg-white rounded-2xl py-2 min-w-[210px] shadow-[0_16px_48px_rgba(0,0,0,0.18)] border border-gray-100">
//                             {subCats.map((sub) => (
//                               <Link
//                                 key={sub._id}
//                                 to={`/category/${cat._id}?subCat=${sub._id}`}
//                                 className="sub-item flex items-center gap-3 px-5 py-2.5 text-[12.5px] text-gray-500 hover:bg-blue-50 hover:text-blue-600 font-medium"
//                               >
//                                 <span className="w-1.5 h-1.5 rounded-full bg-blue-300 flex-shrink-0"></span>
//                                 {sub.subCat}
//                               </Link>
//                             ))}
//                           </div>
//                         </div>
//                       )}
//                     </li>
//                   );
//                 })}
//               </ul>
//             </div>
//           </nav>

//         </div>
//       </div>
//     </>
//   );
// };

// export default CategoryNavigation;


