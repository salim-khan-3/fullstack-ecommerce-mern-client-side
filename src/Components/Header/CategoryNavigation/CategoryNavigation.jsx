import React, { useEffect, useRef, useState } from "react";
import { ChevronDown, ChevronRight, Menu } from "lucide-react";
import {
  GiAppleCore,
  GiSteak,
  GiMilkCarton,
  GiCoffeeCup,
  GiCupcake,
  GiSnowflake1,
} from "react-icons/gi";
import { Link } from "react-router-dom";

const categories = [
  {
    name: "Fruits & Vegetables",
    icon: <GiAppleCore size={18} />,
    link: "/category/fruits",
    children: [
      "Cuts & Sprouts",
      "Exotic Fruits & Veggies",
      "Fresh Fruits",
      "Fresh Vegetables",
      "Herbs & Seasonings",
      "Packaged Produce",
      "Party Trays",
    ],
  },
  {
    name: "Meats & Seafood",
    icon: <GiSteak size={18} />,
    link: "/category/meats",
    children: [
      "Fresh Meat",
      "Frozen Meat",
      "Fish",
      "Shellfish",
      "Marinated Items",
    ],
  },
  {
    name: "Breakfast & Dairy",
    icon: <GiMilkCarton size={18} />,
    link: "/category/dairy",
    children: ["Milk", "Butter", "Cheese", "Eggs", "Yogurt"],
  },
  {
    name: "Beverages",
    icon: <GiCoffeeCup size={18} />,
    link: "/category/beverages",
    children: ["Soft Drinks", "Juice", "Coffee", "Tea", "Energy Drinks"],
  },
  {
    name: "Breads & Bakery",
    icon: <GiCupcake size={18} />,
    link: "/category/bakery",
    children: ["Bread", "Cakes", "Cookies", "Pastries"],
  },
  {
    name: "Frozen Foods",
    icon: <GiSnowflake1 size={18} />,
    link: "/category/frozen",
    children: ["Frozen Veggies", "Frozen Snacks", "Ice Cream"],
  },
];

const CategoryNavigation = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [activeCategory, setActiveCategory] = useState(categories[0]);

  const dropdownRef = useRef(null);

  // Outside click handle
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsSidebarOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const navItemClass =
    "relative group flex items-center gap-1 px-4 py-4 lg:py-6 text-[13px] font-bold uppercase tracking-wider text-gray-700 hover:text-[#2bbef9] transition-all duration-300 flex-shrink-0";
  
  const dropdownClass =
    "absolute top-[100%] left-0 min-w-[200px] bg-white shadow-xl border border-gray-100 rounded-md py-2 opacity-0 invisible group-hover:opacity-100 group-hover:visible group-hover:translate-y-0 translate-y-2 transition-all duration-300 z-50 hidden lg:block";
  
  const dropdownItemClass =
    "px-5 py-2.5 text-[13px] text-gray-600 hover:bg-gray-50 hover:text-[#2bbef9] block transition-colors border-b border-gray-50 last:border-0";

  return (
    <div className="w-full  bg-white border-b border-gray-100 shadow-sm">
      <div className="container mx-auto px-4 flex items-center justify-between lg:gap-24">
        
        {/* 1. ALL CATEGORIES - Desktop Only */}
        <div className="relative py-4 hidden lg:block" ref={dropdownRef}>
          <button
            onClick={() => setIsSidebarOpen(!isSidebarOpen)}
            className="bg-[#2bbef9] text-white px-7 py-4 flex items-center gap-3 rounded-full transition-all duration-300 hover:bg-[#233a95] shadow-lg"
          >
            <Menu size={20} />
            <span className="font-bold text-[14px]">ALL CATEGORIES</span>
            <ChevronDown
              size={16}
              className={`transition-transform ${isSidebarOpen ? "rotate-180" : ""}`}
            />
          </button>

          {isSidebarOpen && (
            <div className="absolute top-[100%] z-50 left-0 flex bg-white border border-gray-100 shadow-2xl rounded-b-xl mt-1 animate-in fade-in slide-in-from-top-2 duration-200">
              <ul className="w-[260px] border-r border-gray-100 py-2">
                {categories.map((item, index) => (
                  <li
                    key={index}
                    onMouseEnter={() => setActiveCategory(item)}
                    className={`flex items-center justify-between px-6 py-3 text-[14px] cursor-pointer transition-colors
                    ${activeCategory.name === item.name ? "bg-blue-50 text-[#2bbef9] font-medium" : "text-gray-600 hover:bg-gray-50"}`}
                  >
                    <span className="flex items-center gap-4">
                      <span className={activeCategory.name === item.name ? "text-[#2bbef9]" : "text-gray-400"}>
                        {item.icon}
                      </span>
                      {item.name}
                    </span>
                    <ChevronRight size={14} className="opacity-40" />
                  </li>
                ))}
              </ul>

              <div className="w-[300px] p-6 bg-white min-h-[350px]">
                <h4 className="text-[14px] font-bold text-gray-800 mb-4 border-b pb-2 uppercase">
                  {activeCategory.name}
                </h4>
                <ul className="grid grid-cols-1 gap-y-2">
                  {activeCategory.children?.map((child, idx) => (
                    <li key={idx} className="text-[13px] text-gray-500 hover:text-[#2bbef9] hover:pl-2 cursor-pointer transition-all">
                      {child}
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          )}
        </div>

        {/* 2. NAVIGATION LINKS - Mobile Scrollable & Vertical Scroll Hidden */}
        <nav className="flex-1 overflow-x-auto overflow-y-hidden no-scrollbar">
          <ul className="flex items-center lg:justify-between min-w-max lg:min-w-full">
            
            <li className="relative group">
              <Link to="/" className={navItemClass}>
                HOME <ChevronDown size={14} className="opacity-40 hidden lg:block group-hover:rotate-180 transition-transform" />
              </Link>
              <div className={dropdownClass}>
                <Link to="/home-1" className={dropdownItemClass}>Home Style 1</Link>
                <Link to="/home-2" className={dropdownItemClass}>Home Style 2</Link>
              </div>
            </li>

            <li className="relative group">
              <Link to="/men" className={navItemClass}>
                MEN <ChevronDown size={14} className="opacity-40 hidden lg:block" />
              </Link>
              <div className={dropdownClass}>
                <Link to="/men/clothing" className={dropdownItemClass}>Clothing</Link>
                <Link to="/men/footwear" className={dropdownItemClass}>Footwear</Link>
              </div>
            </li>

            <li className="relative group">
              <Link to="/women" className={navItemClass}>WOMEN</Link>
            </li>

            <li className="relative group">
              <Link to="/beauty" className={navItemClass}>BEAUTY</Link>
            </li>

            <li className="relative group">
              <Link to="/watches" className={navItemClass}>WATCHES</Link>
            </li>

            <li className="relative group">
              <Link to="/kids" className={navItemClass}>KIDS</Link>
            </li>

            <li className="relative group">
              <Link to="/blog" className={navItemClass}>BLOG</Link>
            </li>

            <li className="relative group">
              <Link to="/contact" className={navItemClass}>CONTACT</Link>
            </li>
          </ul>
        </nav>
      </div>

      {/* Internal CSS for Scrollbar and Layout Fix */}
      <style dangerouslySetInnerHTML={{ __html: `
        .no-scrollbar::-webkit-scrollbar {
          display: none;
        }
        .no-scrollbar {
          -ms-overflow-style: none;
          scrollbar-width: none;
          -webkit-overflow-scrolling: touch;
        }
      `}} />
    </div>
  );
};

export default CategoryNavigation;