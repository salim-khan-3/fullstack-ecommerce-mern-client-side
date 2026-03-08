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

        <div className="relative py-3 pr-6 border-r" ref={dropdownRef}>
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
