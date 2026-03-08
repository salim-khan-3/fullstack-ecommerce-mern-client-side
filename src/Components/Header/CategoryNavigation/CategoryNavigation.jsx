
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

  // desktop = lg breakpoint (1024px+)
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
        setHoveredCat(null);
      }
    };

    document.addEventListener("mousedown", handler);

    return () => {
      document.removeEventListener("mousedown", handler);
    };
  }, []);

  const getSubCats = (cat) => {
    return subCategories.filter((s) => {
      const catId = s.category?._id || s.category;
      return catId?.toString() === cat._id?.toString();
    });
  };

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;500;600;700&display=swap');

        .cat-nav-root {
          font-family: 'DM Sans', sans-serif;
        }

        .cat-all-btn-wrapper {
          display: none;
        }
        @media (min-width: 1024px) {
          .cat-all-btn-wrapper {
            display: block;
          }
        }

        .cat-all-dropdown {
          animation: fadeSlideDown 0.18s ease;
        }

        /* Desktop underline effect */
        .cat-nav-link {
          position: relative;
          transition: color 0.2s;
        }
        @media (min-width: 1024px) {
          .cat-nav-link::after {
            content: '';
            position: absolute;
            bottom: 0;
            left: 50%;
            transform: translateX(-50%);
            width: 0;
            height: 2px;
            background: #3b82f6;
            border-radius: 99px;
            transition: width 0.22s ease;
          }
          .cat-nav-link:hover::after {
            width: 70%;
          }
        }

        .sub-dropdown {
          animation: fadeSlideDown 0.16s ease;
          transform-origin: top left;
        }

        @keyframes fadeSlideDown {
          from { opacity: 0; transform: translateY(-6px); }
          to   { opacity: 1; transform: translateY(0); }
        }

        .chevron-open {
          transform: rotate(180deg);
          transition: transform 0.2s ease;
        }
        .chevron-closed {
          transition: transform 0.2s ease;
        }

        .sub-item {
          transition: background 0.15s, color 0.15s, padding-left 0.15s;
        }
        .sub-item:hover {
          padding-left: 22px;
        }

        /* ── KEY FIX: mobile scroll lives on a wrapper div, NOT on nav/ul ──
           So overflow-x:auto never clips the absolute dropdown            */
        .mobile-scroll-wrapper {
          overflow-x: auto;
          overflow-y: visible;
          -webkit-overflow-scrolling: touch;
          scrollbar-width: none;
        }
        .mobile-scroll-wrapper::-webkit-scrollbar {
          display: none;
        }
        @media (min-width: 1024px) {
          .mobile-scroll-wrapper {
            overflow: visible;
          }
        }

        /* nav and ul must NEVER clip children */
        .cat-main-nav,
        .cat-nav-list {
          overflow: visible !important;
        }

        /* scrollbar hide util */
        .scrollbar-hide::-webkit-scrollbar { display: none; }
        .scrollbar-hide { -ms-overflow-style: none; scrollbar-width: none; }
      `}</style>

      <div
        className="cat-nav-root w-full bg-white shadow-md sticky top-0 z-[100]"
        style={{ overflow: "visible" }}
      >
        <div
          className="container mx-auto px-4 flex items-center justify-between lg:justify-start"
          style={{ overflow: "visible" }}
        >

          {/* ── ALL CATEGORIES BUTTON (desktop only) ── */}
          <div
            className="cat-all-btn-wrapper relative py-3 pr-6 border-r border-gray-100"
            ref={dropdownRef}
          >
            <button
              onClick={() => setIsCatOpen(!isCatOpen)}
              className="flex items-center gap-2 px-5 py-2.5 rounded-full text-white text-sm font-bold bg-blue-500 hover:bg-blue-600 transition-colors duration-200 shadow-sm"
            >
              <Grid3X3 size={15} />
              ALL CATEGORIES
              <ChevronDown
                size={13}
                className={isCatOpen ? "chevron-open" : "chevron-closed"}
              />
            </button>

            {isCatOpen && (
              <div className="cat-all-dropdown absolute top-full left-0 mt-2 bg-white rounded-2xl shadow-xl min-w-[230px] py-2 z-[300] flex border border-gray-100">
                <div className="min-w-[200px] py-1">
                  {categories.map((cat) => {
                    const subCats = getSubCats(cat);
                    const isHovered = hoveredCat?._id === cat._id;
                    return (
                      <button
                        key={cat._id}
                        onClick={() => {
                          setIsCatOpen(false);
                          setHoveredCat(null);
                          navigate(`/category/${cat._id}`);
                        }}
                        onMouseEnter={() =>
                          setHoveredCat(subCats.length > 0 ? cat : null)
                        }
                        className={`flex items-center justify-between w-full text-left px-5 py-2.5 text-sm font-medium transition-colors duration-150 ${
                          isHovered
                            ? "bg-blue-50 text-blue-600"
                            : "text-gray-600 hover:bg-blue-50 hover:text-blue-600"
                        }`}
                      >
                        {cat.name}
                        {subCats.length > 0 && (
                          <ChevronDown
                            size={11}
                            className="-rotate-90 text-gray-400"
                          />
                        )}
                      </button>
                    );
                  })}
                </div>

                {hoveredCat && (
                  <div className="border-l border-gray-100 min-w-[190px] py-1 bg-white rounded-r-2xl">
                    {getSubCats(hoveredCat).map((sub) => (
                      <Link
                        key={sub._id}
                        to={`/category/${hoveredCat._id}?subCat=${sub._id}`}
                        onClick={() => {
                          setIsCatOpen(false);
                          setHoveredCat(null);
                        }}
                        className="sub-item flex items-center gap-3 px-5 py-2.5 text-[12.5px] text-gray-500 hover:bg-blue-50 hover:text-blue-600 font-medium"
                      >
                        <span className="w-1.5 h-1.5 rounded-full bg-blue-300 flex-shrink-0"></span>
                        {sub.subCat}
                      </Link>
                    ))}
                  </div>
                )}
              </div>
            )}
          </div>

          {/* ── MAIN NAV ── */}
          {/*
            STRUCTURE (important!):
            nav.cat-main-nav  → overflow: visible (never clips)
              div.mobile-scroll-wrapper → overflow-x:auto on mobile, visible on desktop
                ul.cat-nav-list → overflow: visible (never clips)
                  li (relative) → dropdown anchors here
          */}
          <nav className="cat-main-nav flex-1 lg:ml-5">
            <div className="mobile-scroll-wrapper">
              <ul className="cat-nav-list flex items-center gap-1 whitespace-nowrap">
                {categories.map((cat) => {
                  const subCats = getSubCats(cat);
                  const isOpen = openNav === cat._id;

                  return (
                    <li
                      key={cat._id}
                      className="relative flex-shrink-0"
                      onMouseEnter={() => {
                        if (isDesktop()) setOpenNav(cat._id);
                      }}
                      onMouseLeave={() => {
                        if (isDesktop()) setOpenNav(null);
                      }}
                    >
                      <Link
                        to={`/category/${cat._id}`}
                        className="cat-nav-link flex items-center gap-1.5 px-3 lg:px-4 py-4 lg:py-5 text-[13px] lg:text-[13.5px] font-semibold text-gray-600 hover:text-blue-600"
                      >
                        {cat.name}
                        {subCats.length > 0 && (
                          <ChevronDown
                            size={11}
                            className={`hidden lg:block ${
                              isOpen
                                ? "chevron-open text-blue-500"
                                : "chevron-closed text-gray-400"
                            }`}
                          />
                        )}
                      </Link>

                      {isOpen && subCats.length > 0 && (
                        <div className="sub-dropdown absolute top-full left-0 z-[9999]">
                          <div className="bg-white rounded-2xl py-2 min-w-[210px] shadow-[0_16px_48px_rgba(0,0,0,0.18)] border border-gray-100">
                            {subCats.map((sub) => (
                              <Link
                                key={sub._id}
                                to={`/category/${cat._id}?subCat=${sub._id}`}
                                className="sub-item flex items-center gap-3 px-5 py-2.5 text-[12.5px] text-gray-500 hover:bg-blue-50 hover:text-blue-600 font-medium"
                              >
                                <span className="w-1.5 h-1.5 rounded-full bg-blue-300 flex-shrink-0"></span>
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
            </div>
          </nav>

        </div>
      </div>
    </>
  );
};

export default CategoryNavigation;


