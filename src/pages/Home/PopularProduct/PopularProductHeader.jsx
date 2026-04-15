import React, { useState, useRef, useEffect, useContext, useCallback } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { StoreContext } from "../../../context/StoreContext";

const PopularProductHeader = ({ onCategoryChange }) => {
  const { categories } = useContext(StoreContext);

  const [activeCategory, setActiveCategory] = useState(null);
  const [indicatorStyle, setIndicatorStyle] = useState({ left: 0, width: 0 });

  const tabsRef = useRef({});
  const navRef  = useRef(null);

  const updateIndicator = useCallback(() => {
    if (!activeCategory) return;
    const el  = tabsRef.current[activeCategory._id];
    const nav = navRef.current;
    if (!el || !nav) return;

    setIndicatorStyle({
      left:  el.offsetLeft,
      width: el.offsetWidth,
    });
  }, [activeCategory]);

  // categories load হলে প্রথমটা select করো
  useEffect(() => {
    if (categories.length > 0 && !activeCategory) {
      setActiveCategory(categories[0]);
      onCategoryChange?.(categories[0]);
    }
  }, [categories]);

  // active category বদলালে double rAF দিয়ে DOM paint এর পরে measure করো
  useEffect(() => {
    if (!activeCategory) return;
    const id = requestAnimationFrame(() => {
      requestAnimationFrame(updateIndicator);
    });
    return () => cancelAnimationFrame(id);
  }, [activeCategory, updateIndicator]);

  // scroll করলেও indicator সঠিক থাকবে
  useEffect(() => {
    const nav = navRef.current;
    if (!nav) return;
    nav.addEventListener("scroll", updateIndicator);
    return () => nav.removeEventListener("scroll", updateIndicator);
  }, [updateIndicator]);

  // window resize এ indicator update
  useEffect(() => {
    window.addEventListener("resize", updateIndicator);
    return () => window.removeEventListener("resize", updateIndicator);
  }, [updateIndicator]);

  const handleSelect = (cat) => {
    setActiveCategory(cat);
    onCategoryChange?.(cat);
    const el = tabsRef.current[cat._id];
    el?.scrollIntoView({ behavior: "smooth", inline: "nearest", block: "nearest" });
  };

  const scrollNav = (dir) => {
    navRef.current?.scrollBy({ left: dir * 120, behavior: "smooth" });
    setTimeout(updateIndicator, 350);
  };

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;500;600;700;800&display=swap');
        .pp-root { font-family: 'DM Sans', sans-serif; }
        .pp-nav::-webkit-scrollbar { display: none; }
        .pp-nav { scrollbar-width: none; }
        .pp-indicator {
          position: absolute; bottom: 0; height: 2.5px;
          background: linear-gradient(90deg, #3b82f6, #8b5cf6);
          border-radius: 99px;
          pointer-events: none;
          transition: left 0.3s cubic-bezier(0.4,0,0.2,1), width 0.3s cubic-bezier(0.4,0,0.2,1);
        }
        .pp-tab {
          position: relative; cursor: pointer; white-space: nowrap;
          padding: 10px 4px; font-size: 13px; font-weight: 500;
          transition: color 0.2s; border: none; background: none; outline: none;
          flex-shrink: 0;
        }
        .pp-tab.active { color: #3b82f6; font-weight: 700; }
        .pp-tab:not(.active) { color: #6b7280; }
        .pp-tab:not(.active):hover { color: #374151; }
      `}</style>

      <div className="pp-root mb-10">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 sm:gap-6">

          {/* Left — Header */}
          <div className="flex items-center gap-4 shrink-0">
            <div className="w-1 h-12 rounded-full bg-gradient-to-b from-blue-500 to-violet-500" />
            <div>
              <div className="flex items-center gap-2 mb-1">
                <span className="text-[9px] font-black uppercase tracking-[3px] text-blue-500 bg-blue-50 px-2.5 py-0.5 rounded-full border border-blue-100">
                  Curated Selection
                </span>
              </div>
              <h2 className="text-[22px] font-black text-gray-900 leading-tight tracking-tight">
                Popular{" "}
                <span className="bg-gradient-to-r from-blue-500 to-violet-500 bg-clip-text text-transparent">
                  Products
                </span>
              </h2>
              <p className="text-[11px] text-gray-400 font-medium mt-0.5">
                Hand-picked deals you won't find anywhere else.
              </p>
            </div>
          </div>

          {/* Right — Category Tabs */}
          <div className="flex items-center gap-1 min-w-0 flex-1 sm:justify-end">
            <button
              onClick={() => scrollNav(-1)}
              className="shrink-0 w-7 h-7 rounded-full border border-gray-200 flex items-center justify-center text-gray-400 hover:text-gray-700 hover:border-gray-300 transition-all"
            >
              <ChevronLeft size={14} />
            </button>

            <div className="relative flex-1 min-w-0 overflow-hidden">
              {/* ✅ navRef — position:relative তাই offsetLeft এখানে relative */}
              <div ref={navRef} className="pp-nav relative flex items-center gap-5 overflow-x-auto pb-[2px]">
                {categories.map((cat) => (
                  <button
                    key={cat._id}
                    ref={(el) => (tabsRef.current[cat._id] = el)}
                    onClick={() => handleSelect(cat)}
                    className={`pp-tab ${activeCategory?._id === cat._id ? "active" : ""}`}
                  >
                    {cat.name}
                  </button>
                ))}
                {/* ✅ indicator navRef এর ভেতরে — offsetLeft same reference */}
                <span className="pp-indicator" style={indicatorStyle} />
              </div>
            </div>

            <button
              onClick={() => scrollNav(1)}
              className="shrink-0 w-7 h-7 rounded-full border border-gray-200 flex items-center justify-center text-gray-400 hover:text-gray-700 hover:border-gray-300 transition-all"
            >
              <ChevronRight size={14} />
            </button>
          </div>

        </div>
      </div>
    </>
  );
};

export default PopularProductHeader;




// import React, { useState, useRef, useEffect } from "react";
// import { ChevronLeft, ChevronRight } from "lucide-react";

// const categories = [
//   "Fashion", "Electronics", "Bags", "Footwear",
//   "Groceries", "Beauty", "Wellness", "Jewellery", "Clothing",
// ];
// const PopularProductHeader = () => {
//     const [active, setActive] = useState("Fashion");
//   const [indicatorStyle, setIndicatorStyle] = useState({ left: 0, width: 0 });
//   const tabsRef = useRef({});
//   const navRef = useRef(null);

//   // Update indicator position whenever active tab changes
//   useEffect(() => {
//     const el = tabsRef.current[active];
//     if (el) {
//       setIndicatorStyle({
//         left: el.offsetLeft,
//         width: el.offsetWidth,
//       });
//     }
//   }, [active]);

//   const scrollNav = (dir) => {
//     if (navRef.current) {
//       navRef.current.scrollBy({ left: dir * 120, behavior: "smooth" });
//     }
//   };
//     return (
//     <>
//       <style>{`
//         @import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;500;600;700;800&display=swap');
//         .pp-root { font-family: 'DM Sans', sans-serif; }
//         .pp-nav::-webkit-scrollbar { display: none; }
//         .pp-nav { scrollbar-width: none; }
//         .pp-indicator {
//           position: absolute;
//           bottom: 0;
//           height: 2.5px;
//           background: linear-gradient(90deg, #3b82f6, #8b5cf6);
//           border-radius: 99px;
//           transition: left 0.3s cubic-bezier(0.4,0,0.2,1), width 0.3s cubic-bezier(0.4,0,0.2,1);
//         }
//         .pp-tab {
//           position: relative;
//           cursor: pointer;
//           white-space: nowrap;
//           padding: 10px 4px;
//           font-size: 13px;
//           font-weight: 500;
//           transition: color 0.2s;
//           border: none;
//           background: none;
//           outline: none;
//         }
//         .pp-tab.active { color: #3b82f6; font-weight: 700; }
//         .pp-tab:not(.active) { color: #6b7280; }
//         .pp-tab:not(.active):hover { color: #374151; }
//       `}</style>

//       <div className="pp-root mb-10">
//         <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 sm:gap-6">

//           {/* Left — Header (your existing design) */}
//           <div className="flex items-center gap-4 shrink-0">
//             <div className="w-1 h-12 rounded-full bg-gradient-to-b from-blue-500 to-violet-500" />
//             <div>
//               <div className="flex items-center gap-2 mb-1">
//                 <span className="text-[9px] font-black uppercase tracking-[3px] text-blue-500 bg-blue-50 px-2.5 py-0.5 rounded-full border border-blue-100">
//                   Curated Selection
//                 </span>
//               </div>
//               <h2 className="text-[22px] font-black text-gray-900 leading-tight tracking-tight">
//                 Popular{" "}
//                 <span className="bg-gradient-to-r from-blue-500 to-violet-500 bg-clip-text text-transparent">
//                   Products
//                 </span>
//               </h2>
//               <p className="text-[11px] text-gray-400 font-medium mt-0.5">
//                 Hand-picked deals you won't find anywhere else.
//               </p>
//             </div>
//           </div>

//           {/* Right — Category Tabs */}
//           <div className="flex items-center gap-1 min-w-0 flex-1 sm:justify-end">
//             {/* Left scroll arrow */}
//             <button
//               onClick={() => scrollNav(-1)}
//               className="shrink-0 w-7 h-7 rounded-full border border-gray-200 flex items-center justify-center text-gray-400 hover:text-gray-700 hover:border-gray-300 transition-all"
//             >
//               <ChevronLeft size={14} />
//             </button>

//             {/* Tabs */}
//             <div className="relative flex-1 overflow-hidden">
//               <div
//                 ref={navRef}
//                 className="pp-nav flex items-center gap-5 overflow-x-auto pb-[2px]"
//               >
//                 {categories.map((cat) => (
//                   <button
//                     key={cat}
//                     ref={(el) => (tabsRef.current[cat] = el)}
//                     onClick={() => setActive(cat)}
//                     className={`pp-tab ${active === cat ? "active" : ""}`}
//                   >
//                     {cat}
//                   </button>
//                 ))}

//                 {/* Sliding underline indicator */}
//                 <span
//                   className="pp-indicator"
//                   style={indicatorStyle}
//                 />
//               </div>
//             </div>

//             {/* Right scroll arrow */}
//             <button
//               onClick={() => scrollNav(1)}
//               className="shrink-0 w-7 h-7 rounded-full border border-gray-200 flex items-center justify-center text-gray-400 hover:text-gray-700 hover:border-gray-300 transition-all"
//             >
//               <ChevronRight size={14} />
//             </button>
//           </div>
//         </div>
//       </div>
//     </>
//     );
// };

// export default PopularProductHeader;