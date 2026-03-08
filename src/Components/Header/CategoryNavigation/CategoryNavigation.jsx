
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

  const dropdownRef = useRef(null);
  const navigate = useNavigate();

  useEffect(() => {

    const fetchData = async () => {
      try {

        const catData = await getAllCategoriesForUI();
        setCategories(Array.isArray(catData) ? catData : []);

        const subData = await getAllSubCategories();
        setSubCategories(Array.isArray(subData) ? subData : []);

      } catch (error) {
        console.error(error);
      }
    };

    fetchData();

  }, []);

  useEffect(() => {

    const handler = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setIsCatOpen(false);
      }
    };

    document.addEventListener("mousedown", handler);

    return () => {
      document.removeEventListener("mousedown", handler);
    };

  }, []);

  // category অনুযায়ী subcategory বের করা
  const getSubCats = (cat) => {

    return subCategories.filter((s) => {

      const catId = s.category?._id || s.category;

      return catId?.toString() === cat._id?.toString();

    });

  };

  return (
    <div className="w-full bg-white border-b shadow-sm sticky top-0 z-[100]">

      <div className="container mx-auto px-4 flex items-center">

        {/* ALL CATEGORY BUTTON */}

        <div
          className="relative py-3 pr-6 border-r"
          ref={dropdownRef}
        >

          <button
            onClick={() => setIsCatOpen(!isCatOpen)}
            className="flex items-center gap-2 px-5 py-2.5 rounded-full text-white text-sm font-bold bg-blue-500"
          >
            <Grid3X3 size={16} />
            ALL CATEGORIES
            <ChevronDown size={14} />
          </button>

          {isCatOpen && (
            <div className="absolute top-full left-0 mt-2 bg-white rounded-xl shadow-lg border min-w-[220px]">

              {categories.map((cat) => (

                <button
                  key={cat._id}
                  onClick={() => {
                    setIsCatOpen(false);
                    navigate(`/category/${cat._id}`);
                  }}
                  className="block w-full text-left px-5 py-3 text-sm hover:bg-gray-100"
                >
                  {cat.name}
                </button>

              ))}

            </div>
          )}

        </div>

        {/* NAV */}

        <nav className="flex-1 ml-5">

          <ul className="flex items-center gap-2">

            {categories.map((cat) => {

              const subCats = getSubCats(cat);
              const isOpen = openNav === cat._id;

              return (

                <li
                  key={cat._id}
                  className="relative"
                  onMouseEnter={() => setOpenNav(cat._id)}
                  onMouseLeave={() => setOpenNav(null)}
                >

                  <Link
                    to={`/category/${cat._id}`}
                    className="flex items-center gap-2 px-4 py-5 text-sm font-semibold text-gray-600 hover:text-blue-600"
                  >
                    {cat.name}
                    <ChevronDown size={12} />
                  </Link>

                 {isOpen && subCats.length > 0 && (
  <div className="absolute top-full left-0 z-[200]">
    <div className="cn-drop bg-white rounded-2xl py-4 min-w-[230px] shadow-[0_20px_50px_rgba(0,0,0,0.15)] border border-gray-100">

      {subCats.map((sub) => (
        <Link
          key={sub._id}
          to={`/category/${cat._id}?subCat=${sub._id}`}
          className="flex items-center gap-3 px-5 py-2.5 text-[13px] text-gray-600 hover:bg-blue-50 hover:text-blue-600 font-medium transition-all duration-200"
        >
          <span className="w-1.5 h-1.5 rounded-full bg-gray-300"></span>
          {sub.subCat}
        </Link>
      ))}

    </div>
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
//   const [categories, setCategories]       = useState([]);
//   const [subCategories, setSubCategories] = useState([]);
//   const [isCatOpen, setIsCatOpen]         = useState(false);
//   const [openNav, setOpenNav]             = useState(null);

//   const dropdownRef = useRef(null);
//   const navigate    = useNavigate();

//   useEffect(() => {
//     getAllCategoriesForUI()
//       .then((data) => setCategories(Array.isArray(data) ? data : []))
//       .catch(console.error);

//     getAllSubCategories()
//       .then(setSubCategories)
//       .catch(console.error);
//   }, []);

//   useEffect(() => {
//     const handler = (e) => {
//       if (dropdownRef.current && !dropdownRef.current.contains(e.target))
//         setIsCatOpen(false);
//     };
//     document.addEventListener("mousedown", handler);
//     return () => document.removeEventListener("mousedown", handler);
//   }, []);

//   // populate করা হয় তাই s.category একটা object { _id, name }
//   const getSubCats = (cat) =>
//     subCategories.filter((s) =>
//       s.category?._id?.toString() === cat._id?.toString()
//     );
// console.log(subCategories);

//   return (
//     <>
//       <style>{`
//         @import url('https://fonts.googleapis.com/css2?family=Outfit:wght@400;500;600;700;800&display=swap');
//         .cn-root { font-family: 'Outfit', sans-serif; }
//         .cn-scroll::-webkit-scrollbar { display: none; }
//         .cn-scroll { scrollbar-width: none; }

//         .cn-drop {
//           animation: cnFadeIn 0.2s ease-out;
//         }
//         @keyframes cnFadeIn {
//           from { opacity: 0; transform: translateY(10px); }
//           to { opacity: 1; transform: translateY(0); }
//         }
//       `}</style>

//       <div className="cn-root w-full bg-white border-b border-gray-100 shadow-sm sticky top-0 z-[100]">
//         <div className="container mx-auto px-4 flex items-center">

//           {/* ── ALL CATEGORIES ── */}
//           <div className="relative shrink-0 py-3 pr-6 border-r border-gray-100" ref={dropdownRef}>
//             <button
//               onClick={() => setIsCatOpen(!isCatOpen)}
//               className="flex items-center gap-2 px-5 py-2.5 rounded-full text-white text-[13px] font-bold transition-all hover:shadow-lg active:scale-95"
//               style={{ background: "linear-gradient(135deg,#2bbef9,#3b82f6)" }}
//             >
//               <Grid3X3 size={16} />
//               ALL CATEGORIES
//               <ChevronDown size={14} className={`transition-transform duration-300 ${isCatOpen ? "rotate-180" : ""}`} />
//             </button>

//             {isCatOpen && (
//               <div className="cn-drop absolute top-[calc(100%+10px)] left-0 z-[200] bg-white rounded-2xl py-3 min-w-[220px] shadow-[0_20px_50px_rgba(0,0,0,0.15)] border border-gray-50">
//                 {categories.map((cat) => (
//                   <button
//                     key={cat._id}
//                     onClick={() => {
//                       setIsCatOpen(false);
//                       navigate(`/category/${cat._id}`);
//                     }}
//                     className="w-full text-left px-5 py-2.5 text-[14px] text-gray-600 hover:bg-blue-50 hover:text-blue-600 font-medium transition-all"
//                   >
//                     {cat.name}
//                   </button>
//                 ))}
//               </div>
//             )}
//           </div>

//           {/* ── NAV LINKS ── */}
//           <nav className="flex-1 cn-scroll overflow-x-auto ml-4">
//             <ul className="flex items-center gap-1">
//               {categories.map((cat) => {
//                 const isOpen  = openNav === cat._id;
//                 const subCats = getSubCats(cat);

//                 return (
//                   <li
//                     key={cat._id}
//                     className="relative"
//                     onMouseEnter={() => setOpenNav(cat._id)}
//                     onMouseLeave={() => setOpenNav(null)}
//                   >
//                     <Link
//                       to={`/category/${cat._id}`}
//                       className={`flex items-center gap-2 px-4 py-6 text-[13.5px] font-semibold whitespace-nowrap transition-all duration-200 ${
//                         isOpen ? "text-blue-600" : "text-gray-500 hover:text-gray-900"
//                       }`}
//                     >
//                       <span
//                         className="w-2 h-2 rounded-full transition-all"
//                         style={{ backgroundColor: isOpen ? "#3b82f6" : "#e2e8f0" }}
//                       />
//                       {cat.name}
//                       <ChevronDown size={12} className={`transition-transform duration-300 ${isOpen ? "rotate-180" : ""}`} />
//                     </Link>

//                     {isOpen && subCats.length > 0 && (
//                       <div className="absolute top-full left-0 pt-2 z-[100]">
//                         <div className="cn-drop bg-white rounded-xl py-3 min-w-[200px] shadow-[0_15px_35px_rgba(0,0,0,0.1)] border border-gray-100">
//                           {subCats.map((sub) => (
//                             <Link
//                               key={sub._id}
//                               to={`/category/${cat._id}?subCat=${sub._id}`}
//                               className="block px-5 py-2.5 text-[13px] text-gray-600 hover:bg-gray-50 hover:text-blue-600 font-medium transition-colors"
//                             >
//                               {sub.subCat}
//                             </Link>
//                           ))}
//                         </div>
//                       </div>
//                     )}
//                   </li>
//                 );
//               })}
//             </ul>
//           </nav>
//         </div>
//       </div>
//     </>
//   );
// };

// export default CategoryNavigation;
















// // // import React, { useEffect, useRef, useState } from "react";
// // // import { ChevronDown, Grid3X3 } from "lucide-react";
// // // import { Link, useNavigate } from "react-router-dom";
// // // import { getAllCategoriesForUI } from "../../../utils/api/categoryApi";
// // // import { getAllSubCategories } from "../../../utils/api/subCategoryApi";

// // // const CategoryNavigation = () => {
// // //   const [categories, setCategories]       = useState([]);
// // //   const [subCategories, setSubCategories] = useState([]);
// // //   const [isCatOpen, setIsCatOpen]         = useState(false);
// // //   const [openNav, setOpenNav]             = useState(null);

// // //   const dropdownRef = useRef(null);
// // //   const navigate    = useNavigate();

// // //   useEffect(() => {
// // //     getAllCategoriesForUI()
// // //       .then((data) => setCategories(Array.isArray(data) ? data : []))
// // //       .catch(console.error);

// // //     getAllSubCategories()
// // //       .then(setSubCategories)
// // //       .catch(console.error);
// // //   }, []);

// // //   useEffect(() => {
// // //     const handler = (e) => {
// // //       if (dropdownRef.current && !dropdownRef.current.contains(e.target))
// // //         setIsCatOpen(false);
// // //     };
// // //     document.addEventListener("mousedown", handler);
// // //     return () => document.removeEventListener("mousedown", handler);
// // //   }, []);

// // //   // category._id দিয়ে match, category null হলে category name দিয়ে match
// // //   const getSubCats = (cat) =>
// // //     subCategories.filter((s) => {
// // //       // populated object এর _id দিয়ে match
// // //       if (s.category?._id) {
// // //         return s.category._id.toString() === cat._id.toString();
// // //       }
// // //       // plain string id দিয়ে match
// // //       if (s.category) {
// // //         return s.category.toString() === cat._id.toString();
// // //       }
// // //       return false;
// // //     });

// // //   return (
// // //     <>
// // //       <style>{`
// // //         @import url('https://fonts.googleapis.com/css2?family=Outfit:wght@400;500;600;700;800&display=swap');
// // //         .cn-root { font-family: 'Outfit', sans-serif; }
// // //         .cn-scroll::-webkit-scrollbar { display: none; }
// // //         .cn-scroll { scrollbar-width: none; }

// // //         .cn-drop {
// // //           animation: cnFadeIn 0.2s ease-out;
// // //         }
// // //         @keyframes cnFadeIn {
// // //           from { opacity: 0; transform: translateY(10px); }
// // //           to { opacity: 1; transform: translateY(0); }
// // //         }
// // //       `}</style>

// // //       <div className="cn-root w-full bg-white border-b border-gray-100 shadow-sm sticky top-0 z-[100]">
// // //         <div className="container mx-auto px-4 flex items-center">

// // //           {/* ── ALL CATEGORIES ── */}
// // //           <div className="relative shrink-0 py-3 pr-6 border-r border-gray-100" ref={dropdownRef}>
// // //             <button
// // //               onClick={() => setIsCatOpen(!isCatOpen)}
// // //               className="flex items-center gap-2 px-5 py-2.5 rounded-full text-white text-[13px] font-bold transition-all hover:shadow-lg active:scale-95"
// // //               style={{ background: "linear-gradient(135deg,#2bbef9,#3b82f6)" }}
// // //             >
// // //               <Grid3X3 size={16} />
// // //               ALL CATEGORIES
// // //               <ChevronDown size={14} className={`transition-transform duration-300 ${isCatOpen ? "rotate-180" : ""}`} />
// // //             </button>

// // //             {isCatOpen && (
// // //               <div className="cn-drop absolute top-[calc(100%+10px)] left-0 z-[200] bg-white rounded-2xl py-3 min-w-[220px] shadow-[0_20px_50px_rgba(0,0,0,0.15)] border border-gray-50">
// // //                 {categories.map((cat) => (
// // //                   <button
// // //                     key={cat._id}
// // //                     onClick={() => {
// // //                       setIsCatOpen(false);
// // //                       navigate(`/category/${cat._id}`);
// // //                     }}
// // //                     className="w-full text-left px-5 py-2.5 text-[14px] text-gray-600 hover:bg-blue-50 hover:text-blue-600 font-medium transition-all"
// // //                   >
// // //                     {cat.name}
// // //                   </button>
// // //                 ))}
// // //               </div>
// // //             )}
// // //           </div>

// // //           {/* ── NAV LINKS ── */}
// // //           <nav className="flex-1 cn-scroll overflow-x-auto ml-4">
// // //             <ul className="flex items-center gap-1">
// // //               {categories.map((cat) => {
// // //                 const isOpen  = openNav === cat._id;
// // //                 const subCats = getSubCats(cat);

// // //                 return (
// // //                   <li
// // //                     key={cat._id}
// // //                     className="relative"
// // //                     onMouseEnter={() => setOpenNav(cat._id)}
// // //                     onMouseLeave={() => setOpenNav(null)}
// // //                   >
// // //                     <Link
// // //                       to={`/category/${cat._id}`}
// // //                       className={`flex items-center gap-2 px-4 py-6 text-[13.5px] font-semibold whitespace-nowrap transition-all duration-200 ${
// // //                         isOpen ? "text-blue-600" : "text-gray-500 hover:text-gray-900"
// // //                       }`}
// // //                     >
// // //                       <span
// // //                         className="w-2 h-2 rounded-full transition-all"
// // //                         style={{ backgroundColor: isOpen ? "#3b82f6" : "#e2e8f0" }}
// // //                       />
// // //                       {cat.name}
// // //                       <ChevronDown size={12} className={`transition-transform duration-300 ${isOpen ? "rotate-180" : ""}`} />
// // //                     </Link>

// // //                     {isOpen && subCats.length > 0 && (
// // //                       <div className="absolute top-full left-0 pt-2 z-[100]">
// // //                         <div className="cn-drop bg-white rounded-xl py-3 min-w-[200px] shadow-[0_15px_35px_rgba(0,0,0,0.1)] border border-gray-100">
// // //                           {subCats.map((sub) => (
// // //                             <Link
// // //                               key={sub._id}
// // //                               to={`/category/${cat._id}?subCat=${sub._id}`}
// // //                               className="block px-5 py-2.5 text-[13px] text-gray-600 hover:bg-gray-50 hover:text-blue-600 font-medium transition-colors"
// // //                             >
// // //                               {sub.subCat}
// // //                             </Link>
// // //                           ))}
// // //                         </div>
// // //                       </div>
// // //                     )}
// // //                   </li>
// // //                 );
// // //               })}
// // //             </ul>
// // //           </nav>
// // //         </div>
// // //       </div>
// // //     </>
// // //   );
// // // };

// // // export default CategoryNavigation;














// // // import React, { useEffect, useRef, useState } from "react";
// // // import { ChevronDown, Grid3X3 } from "lucide-react";
// // // import { Link, useNavigate } from "react-router-dom";
// // // import { getAllCategoriesForUI } from "../../../utils/api/categoryApi";
// // // import { getAllSubCategories } from "../../../utils/api/subCategoryApi";

// // // const CategoryNavigation = () => {
// // //   const [categories, setCategories] = useState([]);
// // //   const [subCategories, setSubCategories] = useState([]);
// // //   const [isCatOpen, setIsCatOpen] = useState(false);
// // //   const [openNav, setOpenNav] = useState(null);

// // //   const dropdownRef = useRef(null);
// // //   const navigate = useNavigate();

// // //   useEffect(() => {
// // //     getAllCategoriesForUI()
// // //       .then((data) => setCategories(Array.isArray(data) ? data : []))
// // //       .catch(console.error);

// // //     getAllSubCategories()
// // //       .then(setSubCategories)
// // //       .catch(console.error);
// // //   }, []);

// // //   useEffect(() => {
// // //     const handler = (e) => {
// // //       if (dropdownRef.current && !dropdownRef.current.contains(e.target))
// // //         setIsCatOpen(false);
// // //     };
// // //     document.addEventListener("mousedown", handler);
// // //     return () => document.removeEventListener("mousedown", handler);
// // //   }, []);

// // //   const getSubCats = (categoryId) =>
// // //     subCategories.filter((s) => {
// // //       const id = s.category?._id || s.category;
// // //       return id?.toString() === categoryId?.toString();
// // //     });
// // // console.log(subCategories);
// // //   return (
// // //     <>
// // //       <style>{`
// // //         @import url('https://fonts.googleapis.com/css2?family=Outfit:wght@400;500;600;700;800&display=swap');
// // //         .cn-root { font-family: 'Outfit', sans-serif; }
// // //         .cn-scroll::-webkit-scrollbar { display: none; }
// // //         .cn-scroll { scrollbar-width: none; }

// // //         .cn-drop {
// // //           animation: cnFadeIn 0.2s ease-out;
// // //         }
// // //         @keyframes cnFadeIn {
// // //           from { opacity: 0; transform: translateY(10px); }
// // //           to { opacity: 1; transform: translateY(0); }
// // //         }
// // //       `}</style>

// // //       <div className="cn-root w-full bg-white border-b border-gray-100 shadow-sm sticky top-0 z-[100]">
// // //         <div className="container mx-auto px-4 flex items-center">
          
// // //           {/* ── ALL CATEGORIES ── */}
// // //           <div className="relative shrink-0 py-3 pr-6 border-r border-gray-100" ref={dropdownRef}>
// // //             <button
// // //               onClick={() => setIsCatOpen(!isCatOpen)}
// // //               className="flex items-center gap-2 px-5 py-2.5 rounded-full text-white text-[13px] font-bold transition-all hover:shadow-lg active:scale-95"
// // //               style={{ background: "linear-gradient(135deg,#2bbef9,#3b82f6)" }}
// // //             >
// // //               <Grid3X3 size={16} />
// // //               ALL CATEGORIES
// // //               <ChevronDown size={14} className={`transition-transform duration-300 ${isCatOpen ? "rotate-180" : ""}`} />
// // //             </button>

// // //             {isCatOpen && (
// // //               <div className="cn-drop absolute top-[calc(100%+10px)] left-0 z-[200] bg-white rounded-2xl py-3 min-w-[220px] shadow-[0_20px_50px_rgba(0,0,0,0.15)] border border-gray-50">
// // //                 {categories.map((cat) => (
// // //                   <button
// // //                     key={cat._id}
// // //                     onClick={() => {
// // //                       setIsCatOpen(false);
// // //                       navigate(`/category/${cat._id}`);
// // //                     }}
// // //                     className="w-full text-left px-5 py-2.5 text-[14px] text-gray-600 hover:bg-blue-50 hover:text-blue-600 font-medium transition-all"
// // //                   >
// // //                     {cat.name}
// // //                   </button>
// // //                 ))}
// // //               </div>
// // //             )}
// // //           </div>

// // //           {/* ── NAV LINKS ── */}
// // //           <nav className="flex-1 cn-scroll overflow-x-auto ml-4">
// // //             <ul className="flex items-center gap-1">
// // //               {categories.map((cat) => {
// // //                 const isOpen = openNav === cat._id;
// // //                 const subCats = getSubCats(cat._id);

// // //                 return (
// // //                   <li
// // //                     key={cat._id}
// // //                     className="relative"
// // //                     onMouseEnter={() => setOpenNav(cat._id)}
// // //                     onMouseLeave={() => setOpenNav(null)}
// // //                   >
// // //                     <Link
// // //                       to={`/category/${cat._id}`}
// // //                       className={`flex items-center gap-2 px-4 py-6 text-[13.5px] font-semibold whitespace-nowrap transition-all duration-200 ${
// // //                         isOpen ? "text-blue-600" : "text-gray-500 hover:text-gray-900"
// // //                       }`}
// // //                     >
// // //                       <span
// // //                         className="w-2 h-2 rounded-full transition-all"
// // //                         style={{ backgroundColor: isOpen ? "#3b82f6" : "#e2e8f0" }}
// // //                       />
// // //                       {cat.name}
// // //                       <ChevronDown size={12} className={`transition-transform duration-300 ${isOpen ? "rotate-180" : ""}`} />
// // //                     </Link>

// // //                     {/* Dropdown with invisible bridge to prevent closing */}
// // //                     {isOpen && (
// // //                       <div className="absolute top-full left-0 pt-2 z-[100]"> 
// // //                         <div className="cn-drop bg-white rounded-xl py-3 min-w-[200px] shadow-[0_15px_35px_rgba(0,0,0,0.1)] border border-gray-100">
// // //                           {subCats.length > 0 ? (
// // //                             subCats.map((sub) => (
// // //                               <Link
// // //                                 key={sub._id}
// // //                                 to={`/category/${cat._id}?subCat=${sub._id}`}
// // //                                 className="block px-5 py-2.5 text-[13px] text-gray-600 hover:bg-gray-50 hover:text-blue-600 font-medium transition-colors"
// // //                               >
// // //                                 {sub.subCat}
// // //                               </Link>
// // //                             ))
// // //                           ) : (
// // //                             <Link
// // //                               to={`/category/${cat._id}`}
// // //                               className="block px-5 py-2.5 text-[13px] text-gray-400 italic"
// // //                             >
// // //                               No subcategories
// // //                             </Link>
// // //                           )}
// // //                         </div>
// // //                       </div>
// // //                     )}
// // //                   </li>
// // //                 );
// // //               })}
// // //             </ul>
// // //           </nav>
// // //         </div>
// // //       </div>
// // //     </>
// // //   );
// // // };

// // // export default CategoryNavigation;














// // // import React, { useEffect, useRef, useState } from "react";
// // // import { ChevronDown, Grid3X3 } from "lucide-react";
// // // import { Link, useNavigate } from "react-router-dom";
// // // import { getAllCategoriesForUI } from "../../../utils/api/categoryApi";
// // // import { getAllSubCategories } from "../../../utils/api/subCategoryApi";

// // // const CategoryNavigation = () => {
// // //   const [categories, setCategories]         = useState([]);
// // //   const [subCategories, setSubCategories]   = useState([]);
// // //   const [isCatOpen, setIsCatOpen]           = useState(false);
// // //   const [openNav, setOpenNav]               = useState(null);

// // //   const dropdownRef = useRef(null);
// // //   const navigate    = useNavigate();

// // //   useEffect(() => {
// // //     getAllCategoriesForUI()
// // //       .then((data) => setCategories(Array.isArray(data) ? data : []))
// // //       .catch(console.error);

// // //     getAllSubCategories()
// // //       .then(setSubCategories)
// // //       .catch(console.error);
// // //   }, []);

// // //   // Close ALL CATEGORIES on outside click
// // //   useEffect(() => {
// // //     const handler = (e) => {
// // //       if (dropdownRef.current && !dropdownRef.current.contains(e.target))
// // //         setIsCatOpen(false);
// // //     };
// // //     document.addEventListener("mousedown", handler);
// // //     return () => document.removeEventListener("mousedown", handler);
// // //   }, []);

// // //   const getSubCats = (categoryId) =>
// // //     subCategories.filter((s) => {
// // //       const id = s.category?._id || s.category;
// // //       return id?.toString() === categoryId?.toString();
// // //     });

// // //   return (
// // //     <>
// // //       <style>{`
// // //         @import url('https://fonts.googleapis.com/css2?family=Outfit:wght@400;500;600;700;800&display=swap');
// // //         .cn-root { font-family: 'Outfit', sans-serif; }
// // //         .cn-scroll::-webkit-scrollbar { display: none; }
// // //         .cn-scroll { scrollbar-width: none; }

// // //         .cn-drop {
// // //           animation: cnDrop 0.15s ease;
// // //         }
// // //         @keyframes cnDrop {
// // //           from { opacity: 0; transform: translateY(-6px); }
// // //           to   { opacity: 1; transform: translateY(0); }
// // //         }

// // //         .cn-allcat-drop {
// // //           animation: cnDrop 0.15s ease;
// // //         }
// // //       `}</style>

// // //       <div className="cn-root w-full bg-white border-b border-gray-100 shadow-sm">
// // //         <div className="container mx-auto px-4 flex items-center gap-2">

// // //           {/* ── ALL CATEGORIES ── */}
// // //           <div className="relative shrink-0" ref={dropdownRef}>
// // //             <button
// // //               onClick={() => setIsCatOpen(!isCatOpen)}
// // //               className="flex items-center gap-2 px-4 py-3 rounded-lg text-white text-[13px] font-bold"
// // //               style={{ background: "linear-gradient(135deg,#2bbef9,#3b82f6)" }}
// // //             >
// // //               <Grid3X3 size={15} />
// // //               ALL CATEGORIES
// // //               <ChevronDown
// // //                 size={12}
// // //                 className={`transition-transform duration-200 ${isCatOpen ? "rotate-180" : ""}`}
// // //               />
// // //             </button>

// // //             {/* ALL CATEGORIES dropdown — simple list */}
// // //             {isCatOpen && (
// // //               <div
// // //                 className="cn-allcat-drop absolute top-[calc(100%+4px)] left-0 z-[200] bg-white rounded-xl py-1.5 min-w-[180px]"
// // //                 style={{ boxShadow: "0 8px 30px rgba(0,0,0,0.12), 0 0 0 1px rgba(0,0,0,0.06)" }}
// // //               >
// // //                 {categories.map((cat) => (
// // //                   <button
// // //                     key={cat._id}
// // //                     onClick={() => {
// // //                       setIsCatOpen(false);
// // //                       navigate(`/category/${cat._id}`);
// // //                     }}
// // //                     className="w-full text-left px-4 py-2.5 text-[13px] text-gray-600 hover:bg-gray-50 hover:text-gray-900 font-medium transition-colors"
// // //                   >
// // //                     {cat.name}
// // //                   </button>
// // //                 ))}
// // //               </div>
// // //             )}
// // //           </div>

// // //           {/* ── NAV LINKS ── */}
// // //           <nav className="flex-1 cn-scroll overflow-x-auto">
// // //             <ul className="flex items-center">
// // //               {categories.map((cat) => {
// // //                 const isOpen  = openNav === cat._id;
// // //                 const subCats = getSubCats(cat._id);

// // //                 return (
// // //                   <li
// // //                     key={cat._id}
// // //                     className="relative shrink-0"
// // //                     onMouseEnter={() => setOpenNav(cat._id)}
// // //                     onMouseLeave={() => setOpenNav(null)}
// // //                   >
// // //                     {/* Category link */}
// // //                     <Link
// // //                       to={`/category/${cat._id}`}
// // //                       className={`flex items-center gap-1.5 px-3 py-4 text-[13px] font-semibold whitespace-nowrap transition-colors duration-150 ${
// // //                         isOpen ? "text-[#2bbef9]" : "text-gray-600 hover:text-gray-900"
// // //                       }`}
// // //                     >
// // //                       {/* Category icon initial */}
// // //                       <span
// // //                         className="w-5 h-5 rounded-full flex items-center justify-center text-[9px] font-black text-white shrink-0"
// // //                         style={{ background: isOpen ? "#2bbef9" : "#94a3b8" }}
// // //                       >
// // //                         {cat.name?.charAt(0).toUpperCase()}
// // //                       </span>
// // //                       {cat.name}
// // //                       <ChevronDown
// // //                         size={11}
// // //                         strokeWidth={2.5}
// // //                         className={`transition-transform duration-200 ${isOpen ? "rotate-180 text-[#2bbef9]" : "text-gray-300"}`}
// // //                       />
// // //                     </Link>

// // //                     {/* Simple dropdown */}
// // //                     {isOpen && (
// // //                       <div
// // //                         className="cn-drop absolute top-full left-0 z-[100] bg-white rounded-xl py-1.5 min-w-[160px]"
// // //                         style={{ boxShadow: "0 8px 30px rgba(0,0,0,0.10), 0 0 0 1px rgba(0,0,0,0.06)" }}
// // //                       >
// // //                         {subCats.length > 0 ? (
// // //                           subCats.map((sub) => (
// // //                             <Link
// // //                               key={sub._id}
// // //                               to={`/category/${cat._id}?subCat=${sub._id}`}
// // //                               className="block px-4 py-2.5 text-[13px] text-gray-600 hover:bg-gray-50 hover:text-gray-900 font-medium transition-colors"
// // //                             >
// // //                               {sub.subCat}
// // //                             </Link>
// // //                           ))
// // //                         ) : (
// // //                           <Link
// // //                             to={`/category/${cat._id}`}
// // //                             className="block px-4 py-2.5 text-[13px] text-gray-600 hover:bg-gray-50 hover:text-gray-900 font-medium transition-colors"
// // //                           >
// // //                             View all {cat.name}
// // //                           </Link>
// // //                         )}
// // //                       </div>
// // //                     )}
// // //                   </li>
// // //                 );
// // //               })}
// // //             </ul>
// // //           </nav>

// // //         </div>
// // //       </div>
// // //     </>
// // //   );
// // // };

// // // export default CategoryNavigation;



















// // // import React, { useEffect, useRef, useState } from "react";
// // // import { ChevronDown, Grid3X3 } from "lucide-react";
// // // import { Link, useNavigate } from "react-router-dom";
// // // import { getAllCategoriesForUI } from "../../../utils/api/categoryApi";
// // // import { getAllSubCategories } from "../../../utils/api/subCategoryApi";

// // // const CategoryNavigation = () => {
// // //   const [categories, setCategories]         = useState([]);
// // //   const [subCategories, setSubCategories]   = useState([]);
// // //   const [isCatOpen, setIsCatOpen]           = useState(false);
// // //   const [openNav, setOpenNav]               = useState(null);

// // //   const dropdownRef = useRef(null);
// // //   const navigate    = useNavigate();

// // //   useEffect(() => {
// // //     getAllCategoriesForUI()
// // //       .then((data) => setCategories(Array.isArray(data) ? data : []))
// // //       .catch(console.error);

// // //     getAllSubCategories()
// // //       .then(setSubCategories)
// // //       .catch(console.error);
// // //   }, []);

// // //   // Close ALL CATEGORIES on outside click
// // //   useEffect(() => {
// // //     const handler = (e) => {
// // //       if (dropdownRef.current && !dropdownRef.current.contains(e.target))
// // //         setIsCatOpen(false);
// // //     };
// // //     document.addEventListener("mousedown", handler);
// // //     return () => document.removeEventListener("mousedown", handler);
// // //   }, []);

// // //   const getSubCats = (categoryId) =>
// // //     subCategories.filter((s) => {
// // //       const id = s.category?._id || s.category;
// // //       return id?.toString() === categoryId?.toString();
// // //     });
// // // console.log(subCategories);
// // //   return (
// // //     <>
// // //       <style>{`
// // //         @import url('https://fonts.googleapis.com/css2?family=Outfit:wght@400;500;600;700;800&display=swap');
// // //         .cn-root { font-family: 'Outfit', sans-serif; }
// // //         .cn-scroll::-webkit-scrollbar { display: none; }
// // //         .cn-scroll { scrollbar-width: none; }

// // //         .cn-drop {
// // //           animation: cnDrop 0.15s ease;
// // //         }
// // //         @keyframes cnDrop {
// // //           from { opacity: 0; transform: translateY(-6px); }
// // //           to   { opacity: 1; transform: translateY(0); }
// // //         }

// // //         .cn-allcat-drop {
// // //           animation: cnDrop 0.15s ease;
// // //         }
// // //       `}</style>

// // //       <div className="cn-root w-full bg-white border-b border-gray-100 shadow-sm">
// // //         <div className="container mx-auto px-4 flex items-center gap-2">

// // //           {/* ── ALL CATEGORIES ── */}
// // //           <div className="relative shrink-0" ref={dropdownRef}>
// // //             <button
// // //               onClick={() => setIsCatOpen(!isCatOpen)}
// // //               className="flex items-center gap-2 px-4 py-3 rounded-lg text-white text-[13px] font-bold"
// // //               style={{ background: "linear-gradient(135deg,#2bbef9,#3b82f6)" }}
// // //             >
// // //               <Grid3X3 size={15} />
// // //               ALL CATEGORIES
// // //               <ChevronDown
// // //                 size={12}
// // //                 className={`transition-transform duration-200 ${isCatOpen ? "rotate-180" : ""}`}
// // //               />
// // //             </button>

// // //             {/* ALL CATEGORIES dropdown — simple list */}
// // //             {isCatOpen && (
// // //               <div
// // //                 className="cn-allcat-drop absolute top-[calc(100%+4px)] left-0 z-[200] bg-white rounded-xl py-1.5 min-w-[180px]"
// // //                 style={{ boxShadow: "0 8px 30px rgba(0,0,0,0.12), 0 0 0 1px rgba(0,0,0,0.06)" }}
// // //               >
// // //                 {categories.map((cat) => (
// // //                   <button
// // //                     key={cat._id}
// // //                     onClick={() => {
// // //                       setIsCatOpen(false);
// // //                       navigate(`/category/${cat._id}`);
// // //                     }}
// // //                     className="w-full text-left px-4 py-2.5 text-[13px] text-gray-600 hover:bg-gray-50 hover:text-gray-900 font-medium transition-colors"
// // //                   >
// // //                     {cat.name}
// // //                   </button>
// // //                 ))}
// // //               </div>
// // //             )}
// // //           </div>

// // //           {/* ── NAV LINKS ── */}
// // //           <nav className="flex-1 cn-scroll overflow-x-auto">
// // //             <ul className="flex items-center">
// // //               {categories.map((cat) => {
// // //                 const isOpen  = openNav === cat._id;
// // //                 const subCats = getSubCats(cat._id);

// // //                 return (
// // //                   <li
// // //                     key={cat._id}
// // //                     className="relative shrink-0"
// // //                     onMouseEnter={() => setOpenNav(cat._id)}
// // //                     onMouseLeave={() => setOpenNav(null)}
// // //                   >
// // //                     {/* Category link */}
// // //                     <Link
// // //                       to={`/category/${cat._id}`}
// // //                       className={`flex items-center gap-1.5 px-3 py-4 text-[13px] font-semibold whitespace-nowrap transition-colors duration-150 ${
// // //                         isOpen ? "text-[#2bbef9]" : "text-gray-600 hover:text-gray-900"
// // //                       }`}
// // //                     >
// // //                       {/* Category icon initial */}
// // //                       <span
// // //                         className="w-5 h-5 rounded-full flex items-center justify-center text-[9px] font-black text-white shrink-0"
// // //                         style={{ background: isOpen ? "#2bbef9" : "#94a3b8" }}
// // //                       >
// // //                         {cat.name?.charAt(0).toUpperCase()}
// // //                       </span>
// // //                       {cat.name}
// // //                       <ChevronDown
// // //                         size={11}
// // //                         strokeWidth={2.5}
// // //                         className={`transition-transform duration-200 ${isOpen ? "rotate-180 text-[#2bbef9]" : "text-gray-300"}`}
// // //                       />
// // //                     </Link>

// // //                     {/* Simple dropdown */}
// // //                     {isOpen && (
// // //                       <div
// // //                         className="cn-drop absolute top-full left-0 z-[100] bg-white rounded-xl py-1.5 min-w-[160px]"
// // //                         style={{ boxShadow: "0 8px 30px rgba(0,0,0,0.10), 0 0 0 1px rgba(0,0,0,0.06)" }}
// // //                       >
// // //                         {subCats.length > 0 ? (
// // //                           subCats.map((sub) => (
// // //                             <Link
// // //                               key={sub._id}
// // //                               to={`/category/${cat._id}?subCat=${sub._id}`}
// // //                               className="block px-4 py-2.5 text-[13px] text-gray-600 hover:bg-gray-50 hover:text-gray-900 font-medium transition-colors"
// // //                             >
// // //                               {sub.subCat}
// // //                             </Link>
// // //                           ))
// // //                         ) : (
// // //                           <Link
// // //                             to={`/category/${cat._id}`}
// // //                             className="block px-4 py-2.5 text-[13px] text-gray-600 hover:bg-gray-50 hover:text-gray-900 font-medium transition-colors"
// // //                           >
// // //                             View all {cat.name}
// // //                           </Link>
// // //                         )}
// // //                       </div>
// // //                     )}
// // //                   </li>
// // //                 );
// // //               })}
// // //             </ul>
// // //           </nav>

// // //         </div>
// // //       </div>
// // //     </>
// // //   );
// // // };

// // // export default CategoryNavigation;































// import React, { useEffect, useRef, useState } from "react";
// import { ChevronDown, ChevronRight, Grid3X3, Tag, Flame } from "lucide-react";
// import { Link, useNavigate } from "react-router-dom";
// import { getAllCategoriesForUI } from "../../../utils/api/categoryApi";
// import { getAllSubCategories } from "../../../utils/api/subCategoryApi";

// const CategoryNavigation = () => {
//   const [categories, setCategories]         = useState([]);
//   const [subCategories, setSubCategories]   = useState([]);
//   const [isCatOpen, setIsCatOpen]           = useState(false);
//   const [activeCategory, setActiveCategory] = useState(null);
//   const [openNav, setOpenNav]               = useState(null);

//   const dropdownRef = useRef(null);
//   const navigate    = useNavigate();

//   // Fetch categories + subcategories
//   useEffect(() => {
//     getAllCategoriesForUI()
//       .then((data) => {
//         const list = Array.isArray(data) ? data : [];
//         setCategories(list);
//         if (list.length > 0) setActiveCategory(list[0]);
//       })
//       .catch(console.error);

//     getAllSubCategories()
//       .then(setSubCategories)
//       .catch(console.error);
//   }, []);

//   // Close on outside click
//   useEffect(() => {
//     const handler = (e) => {
//       if (dropdownRef.current && !dropdownRef.current.contains(e.target))
//         setIsCatOpen(false);
//     };
//     document.addEventListener("mousedown", handler);
//     return () => document.removeEventListener("mousedown", handler);
//   }, []);

//   // Filter subcategories by category id
//   const getSubCats = (categoryId) =>
//     subCategories.filter((s) => {
//       const id = s.category?._id || s.category;
//       return id === categoryId;
//     });

//   return (
//     <>
//       <style>{`
//         @import url('https://fonts.googleapis.com/css2?family=Outfit:wght@400;500;600;700;800&display=swap');
//         .cn-root { font-family: 'Outfit', sans-serif; }

//         .cn-link-line::after {
//           content: '';
//           position: absolute;
//           bottom: 0; left: 50%; right: 50%;
//           height: 2px;
//           background: linear-gradient(90deg, #2bbef9, #6366f1);
//           border-radius: 2px 2px 0 0;
//           transition: left 0.22s ease, right 0.22s ease;
//         }
//         .cn-link-line:hover::after { left: 10px; right: 10px; }

//         .cn-panel-slide {
//           animation: cnPanelIn 0.18s cubic-bezier(0.16,1,0.3,1);
//         }
//         @keyframes cnPanelIn {
//           from { opacity:0; transform: translateY(-8px); }
//           to   { opacity:1; transform: translateY(0); }
//         }

//         .cn-drop-fade {
//           animation: cnDropIn 0.14s ease;
//         }
//         @keyframes cnDropIn {
//           from { opacity:0; transform: translateY(6px) translateX(-50%); }
//           to   { opacity:1; transform: translateY(0)  translateX(-50%); }
//         }

//         .cn-scroll::-webkit-scrollbar { display: none; }
//         .cn-scroll { scrollbar-width: none; }
//         .cn-cat-item { transition: background 0.15s; }
//         .cn-sub-link { transition: background 0.12s, color 0.12s, padding-left 0.15s; }
//         .cn-sub-link:hover { background: #f0f9ff; color: #2bbef9; padding-left: 16px; }
//       `}</style>

//       <div
//         className="cn-root w-full bg-white"
//         style={{ borderBottom: "1px solid #efefef", boxShadow: "0 2px 14px rgba(0,0,0,0.04)" }}
//       >
//         <div className="container mx-auto px-5 flex items-center justify-between">

//           {/* ── ALL CATEGORIES button ── */}
//           <div className="relative hidden lg:flex shrink-0 items-center py-3 pr-4" ref={dropdownRef}>
//             <button
//               onClick={() => setIsCatOpen(!isCatOpen)}
//               className="flex items-center gap-2 pl-4 pr-5 py-2.5 rounded-xl text-white text-[13px] font-bold tracking-wide transition-all duration-200 active:scale-[0.97]"
//               style={{
//                 background: "linear-gradient(135deg,#2bbef9 0%,#3b82f6 100%)",
//                 boxShadow: isCatOpen
//                   ? "0 6px 20px rgba(43,190,249,0.45)"
//                   : "0 4px 14px rgba(43,190,249,0.28)",
//               }}
//             >
//               <Grid3X3 size={15} strokeWidth={2.5} />
//               ALL CATEGORIES
//               <ChevronDown
//                 size={13}
//                 strokeWidth={2.5}
//                 className={`transition-transform duration-200 ml-0.5 ${isCatOpen ? "rotate-180" : ""}`}
//               />
//             </button>

//             {/* ── Mega dropdown ── */}
//             {isCatOpen && activeCategory && (
//               <div
//                 className="cn-panel-slide absolute top-[calc(100%+4px)] left-0 z-[200] flex bg-white rounded-2xl overflow-hidden"
//                 style={{
//                   boxShadow: "0 24px 64px rgba(0,0,0,0.13), 0 0 0 1px rgba(0,0,0,0.05)",
//                   minWidth: 500,
//                 }}
//               >
//                 {/* Left — category list */}
//                 <ul className="w-[230px] py-2" style={{ borderRight: "1px solid #f4f4f6" }}>
//                   {categories.map((cat) => {
//                     const active = activeCategory._id === cat._id;
//                     return (
//                       <li
//                         key={cat._id}
//                         onMouseEnter={() => setActiveCategory(cat)}
//                         onClick={() => {
//                           setIsCatOpen(false);
//                           navigate(`/category/${cat._id}`);
//                         }}
//                         className="cn-cat-item mx-2 my-0.5 rounded-xl flex items-center justify-between px-3 py-2.5 cursor-pointer"
//                         style={{ background: active ? "#f0f9ff" : "transparent" }}
//                       >
//                         <span className="flex items-center gap-3">
//                           <span
//                             className="w-7 h-7 rounded-lg flex items-center justify-center shrink-0 text-[11px] font-black uppercase"
//                             style={{
//                               background: active ? "#2bbef920" : "#f3f4f6",
//                               color: active ? "#2bbef9" : "#9ca3af",
//                             }}
//                           >
//                             {cat.name?.charAt(0)}
//                           </span>
//                           <span
//                             className="text-[12.5px] font-semibold"
//                             style={{ color: active ? "#2bbef9" : "#4b5563" }}
//                           >
//                             {cat.name}
//                           </span>
//                         </span>
//                         <ChevronRight size={12} style={{ color: active ? "#2bbef9" : "#d1d5db" }} />
//                       </li>
//                     );
//                   })}
//                 </ul>

//                 {/* Right — subcategories */}
//                 <div className="flex-1 p-5 flex flex-col" style={{ minHeight: 290 }}>
//                   {/* Header */}
//                   <div className="flex items-center gap-3 mb-4 pb-3" style={{ borderBottom: "1.5px solid #2bbef920" }}>
//                     <span className="w-9 h-9 rounded-xl flex items-center justify-center text-sm font-black bg-sky-50 text-sky-500 shrink-0">
//                       {activeCategory.name?.charAt(0)}
//                     </span>
//                     <div>
//                       <p className="text-[9.5px] font-bold uppercase tracking-widest text-sky-400">Browse Category</p>
//                       <p className="text-[14px] font-black text-gray-900 leading-tight">{activeCategory.name}</p>
//                     </div>
//                   </div>

//                   {/* Sub-items */}
//                   <ul className="flex-1 space-y-0.5">
//                     {getSubCats(activeCategory._id).length > 0 ? (
//                       getSubCats(activeCategory._id).map((sub) => (
//                         <li key={sub._id}>
//                           <Link
//                             to={`/category/${activeCategory._id}?subCat=${sub._id}`}
//                             onClick={() => setIsCatOpen(false)}
//                             className="cn-sub-link flex items-center gap-2.5 px-2.5 py-2 rounded-lg text-[12.5px] font-medium text-gray-500"
//                           >
//                             <span className="w-1.5 h-1.5 rounded-full bg-sky-200 shrink-0" />
//                             {sub.subCat}
//                           </Link>
//                         </li>
//                       ))
//                     ) : (
//                       <li className="text-[12px] text-gray-300 px-2.5 py-2 italic">No subcategories</li>
//                     )}
//                   </ul>

//                   {/* Promo chip */}
//                   <div className="mt-3 flex items-center gap-2 px-3 py-2 rounded-xl text-[11px] font-bold bg-sky-50 text-sky-500">
//                     <Flame size={12} />
//                     Up to 50% off · Limited time offer
//                   </div>
//                 </div>
//               </div>
//             )}
//           </div>

//           {/* ── NAV LINKS (dynamic categories) ── */}
//           <nav className="flex-1 cn-scroll overflow-x-auto overflow-y-visible">
//             <ul className="flex items-center justify-end">
//               {categories.map((cat) => {
//                 const isOpen  = openNav === cat._id;
//                 const subCats = getSubCats(cat._id);

//                 return (
//                   <li
//                     key={cat._id}
//                     className="relative shrink-0"
//                     onMouseEnter={() => setOpenNav(cat._id)}
//                     onMouseLeave={() => setOpenNav(null)}
//                   >
//                     <Link
//                       to={`/category/${cat._id}`}
//                       className={`cn-link-line flex items-center gap-1 px-3 py-[18px] text-[12px] font-bold uppercase tracking-[0.7px] whitespace-nowrap relative transition-colors duration-150 ${
//                         isOpen ? "text-[#2bbef9]" : "text-gray-500 hover:text-gray-900"
//                       }`}
//                     >
//                       {cat.name}
//                       <ChevronDown
//                         size={10}
//                         strokeWidth={2.5}
//                         className={`transition-transform duration-200 ${isOpen ? "rotate-180 text-[#2bbef9]" : "text-gray-300"}`}
//                       />
//                     </Link>

//                     {/* Dropdown */}
//                     {isOpen && (
//                       <div
//                         className="cn-drop-fade absolute top-full left-1/2 pt-1 z-[100]"
//                         style={{ transform: "translateX(-50%)" }}
//                       >
//                         <div
//                           className="bg-white rounded-2xl overflow-hidden"
//                           style={{ boxShadow: "0 12px 40px rgba(0,0,0,0.1), 0 0 0 1px rgba(0,0,0,0.05)", minWidth: 195 }}
//                         >
//                           <div className="h-[2.5px]" style={{ background: "linear-gradient(90deg,#2bbef9,#6366f1)" }} />

//                           <div className="py-1.5">
//                             {subCats.map((sub) => (
//                               <Link
//                                 key={sub._id}
//                                 to={`/category/${cat._id}?subCat=${sub._id}`}
//                                 className="flex items-center gap-3 px-4 py-2.5 text-[12.5px] font-medium text-gray-500 hover:text-[#2bbef9] hover:bg-sky-50 transition-all duration-100 group/sub"
//                               >
//                                 <span className="w-1.5 h-1.5 rounded-full bg-gray-200 group-hover/sub:bg-[#2bbef9] transition-colors shrink-0" />
//                                 {sub.subCat}
//                               </Link>
//                             ))}
//                           </div>

//                           <div className="px-4 py-2.5" style={{ borderTop: "1px solid #f4f4f6" }}>
//                             <Link
//                               to={`/category/${cat._id}`}
//                               className="flex items-center gap-1.5 text-[11px] font-bold text-[#2bbef9] hover:text-blue-700 transition-colors"
//                             >
//                               <Tag size={10} />
//                               View all {cat.name}
//                             </Link>
//                           </div>
//                         </div>
//                       </div>
//                     )}
//                   </li>
//                 );
//               })}
//             </ul>
//           </nav>

//         </div>
//       </div>
//     </>
//   );
// };

// export default CategoryNavigation;