import React, { useEffect, useRef, useState } from "react";
import { ChevronDown, ChevronRight, Grid3X3, Tag, Flame } from "lucide-react";
import {
  GiAppleCore, GiSteak, GiMilkCarton,
  GiCoffeeCup, GiCupcake, GiSnowflake1,
} from "react-icons/gi";
import { Link } from "react-router-dom";

const categories = [
  {
    name: "Fruits & Vegetables", icon: <GiAppleCore size={15} />, link: "/category/fruits",
    color: "#22c55e", bg: "#f0fdf4",
    children: ["Fresh Fruits", "Fresh Vegetables", "Herbs & Seasonings", "Exotic Fruits & Veggies", "Cuts & Sprouts", "Packaged Produce"],
  },
  {
    name: "Meats & Seafood", icon: <GiSteak size={15} />, link: "/category/meats",
    color: "#ef4444", bg: "#fef2f2",
    children: ["Fresh Chicken", "Mutton", "Fish & Seafood", "Marinated Items", "Frozen Meat"],
  },
  {
    name: "Breakfast & Dairy", icon: <GiMilkCarton size={15} />, link: "/category/dairy",
    color: "#f59e0b", bg: "#fffbeb",
    children: ["Milk & Cream", "Butter & Ghee", "Cheese", "Eggs", "Yogurt"],
  },
  {
    name: "Beverages", icon: <GiCoffeeCup size={15} />, link: "/category/beverages",
    color: "#8b5cf6", bg: "#f5f3ff",
    children: ["Soft Drinks", "Juices", "Coffee & Tea", "Energy Drinks", "Health Drinks"],
  },
  {
    name: "Breads & Bakery", icon: <GiCupcake size={15} />, link: "/category/bakery",
    color: "#f97316", bg: "#fff7ed",
    children: ["Bread & Buns", "Cakes", "Cookies & Biscuits", "Pastries"],
  },
  {
    name: "Frozen Foods", icon: <GiSnowflake1 size={15} />, link: "/category/frozen",
    color: "#0ea5e9", bg: "#f0f9ff",
    children: ["Frozen Veggies", "Frozen Snacks", "Ice Cream", "Ready Meals"],
  },
];

const navLinks = [
  { label: "HOME",    href: "/",        items: ["Home Default", "Home Style 2", "Landing Page"] },
  { label: "MEN",     href: "/men",     items: ["T-Shirts & Polos", "Jeans & Trousers", "Footwear"] },
  { label: "WOMEN",   href: "/women",   items: ["Sarees & Kurtis", "Dresses & Tops", "Beauty"] },
  { label: "BEAUTY",  href: "/beauty",  items: ["Skin Care", "Hair Care", "Makeup"] },
  { label: "WATCHES", href: "/watches", items: ["Men's Watches", "Women's Watches", "Smartwatches"] },
  { label: "KIDS",    href: "/kids",    items: ["Boys Wear", "Girls Wear", "Toys & Games"] },
  { label: "BLOG",    href: "/blog",    items: ["Fashion Tips", "Lifestyle", "New Arrivals"] },
  { label: "CONTACT", href: "/contact", items: ["Help Center", "About Us", "Policies"] },
];

const CategoryNavigation = () => {
  const [isCatOpen, setIsCatOpen] = useState(false);
  const [activeCategory, setActiveCategory] = useState(categories[0]);
  const [openNav, setOpenNav] = useState(null);
  const dropdownRef = useRef(null);

  useEffect(() => {
    const handler = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target))
        setIsCatOpen(false);
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Outfit:wght@400;500;600;700;800&display=swap');
        .cn-root { font-family: 'Outfit', sans-serif; }

        .cn-link-line::after {
          content: '';
          position: absolute;
          bottom: 0; left: 50%; right: 50%;
          height: 2px;
          background: linear-gradient(90deg, #2bbef9, #6366f1);
          border-radius: 2px 2px 0 0;
          transition: left 0.22s ease, right 0.22s ease;
        }
        .cn-link-line:hover::after,
        .cn-link-line.active::after { left: 10px; right: 10px; }

        .cn-panel-slide {
          animation: cnPanelIn 0.18s cubic-bezier(0.16,1,0.3,1);
        }
        @keyframes cnPanelIn {
          from { opacity:0; transform: translateY(-8px); }
          to   { opacity:1; transform: translateY(0); }
        }

        .cn-drop-fade {
          animation: cnDropIn 0.14s ease;
        }
        @keyframes cnDropIn {
          from { opacity:0; transform: translateY(6px) translateX(-50%); }
          to   { opacity:1; transform: translateY(0)  translateX(-50%); }
        }

        .cn-scroll::-webkit-scrollbar { display: none; }
        .cn-scroll { scrollbar-width: none; }

        .cn-cat-item { transition: background 0.15s; }
      `}</style>

      <div
        className="cn-root w-full bg-white"
        style={{ borderBottom: "1px solid #efefef", boxShadow: "0 2px 14px rgba(0,0,0,0.04)" }}
      >
        <div className="container mx-auto px-5 flex items-center justify-between">

          {/* ── ALL CATEGORIES ── */}
          <div className="relative hidden lg:flex shrink-0 items-center py-3 pr-4" ref={dropdownRef}>
            <button
              onClick={() => setIsCatOpen(!isCatOpen)}
              className="flex items-center gap-2 pl-4 pr-5 py-2.5 rounded-xl text-white text-[13px] font-bold tracking-wide transition-all duration-200 active:scale-[0.97]"
              style={{
                background: "linear-gradient(135deg,#2bbef9 0%,#3b82f6 100%)",
                boxShadow: isCatOpen
                  ? "0 6px 20px rgba(43,190,249,0.45)"
                  : "0 4px 14px rgba(43,190,249,0.28)",
              }}
            >
              <Grid3X3 size={15} strokeWidth={2.5} />
              ALL CATEGORIES
              <ChevronDown
                size={13}
                strokeWidth={2.5}
                className={`transition-transform duration-200 ml-0.5 ${isCatOpen ? "rotate-180" : ""}`}
              />
            </button>

            {/* Mega dropdown */}
            {isCatOpen && (
              <div
                className="cn-panel-slide absolute top-[calc(100%+4px)] left-0 z-[200] flex bg-white rounded-2xl overflow-hidden"
                style={{
                  boxShadow: "0 24px 64px rgba(0,0,0,0.13), 0 0 0 1px rgba(0,0,0,0.05)",
                  minWidth: 500,
                }}
              >
                {/* Left list */}
                <ul className="w-[230px] py-2" style={{ borderRight: "1px solid #f4f4f6" }}>
                  {categories.map((cat, i) => {
                    const active = activeCategory.name === cat.name;
                    return (
                      <li
                        key={i}
                        onMouseEnter={() => setActiveCategory(cat)}
                        className="cn-cat-item mx-2 my-0.5 rounded-xl flex items-center justify-between px-3 py-2.5 cursor-pointer"
                        style={{ background: active ? cat.bg : "transparent" }}
                      >
                        <span className="flex items-center gap-3">
                          <span
                            className="w-7 h-7 rounded-lg flex items-center justify-center shrink-0"
                            style={{
                              background: active ? cat.color + "20" : "#f3f4f6",
                              color: active ? cat.color : "#9ca3af",
                            }}
                          >
                            {cat.icon}
                          </span>
                          <span
                            className="text-[12.5px] font-semibold"
                            style={{ color: active ? cat.color : "#4b5563" }}
                          >
                            {cat.name}
                          </span>
                        </span>
                        <ChevronRight
                          size={12}
                          style={{ color: active ? cat.color : "#d1d5db" }}
                        />
                      </li>
                    );
                  })}
                </ul>

                {/* Right sub-items */}
                <div className="flex-1 p-5 flex flex-col" style={{ minHeight: 290 }}>
                  {/* Header */}
                  <div
                    className="flex items-center gap-3 mb-4 pb-3"
                    style={{ borderBottom: `1.5px solid ${activeCategory.color}20` }}
                  >
                    <span
                      className="w-9 h-9 rounded-xl flex items-center justify-center text-lg shrink-0"
                      style={{ background: activeCategory.bg, color: activeCategory.color }}
                    >
                      {activeCategory.icon}
                    </span>
                    <div>
                      <p className="text-[9.5px] font-bold uppercase tracking-widest" style={{ color: activeCategory.color }}>
                        Browse Category
                      </p>
                      <p className="text-[14px] font-black text-gray-900 leading-tight">
                        {activeCategory.name}
                      </p>
                    </div>
                  </div>

                  {/* Sub-items */}
                  <ul className="flex-1 space-y-0.5">
                    {activeCategory.children?.map((child, idx) => (
                      <li key={idx}>
                        <Link
                          to={`${activeCategory.link}/${child.toLowerCase().replace(/\s+/g, "-")}`}
                          onClick={() => setIsCatOpen(false)}
                          className="flex items-center gap-2.5 px-2.5 py-2 rounded-lg text-[12.5px] font-medium text-gray-500 transition-all duration-100 group/item hover:pl-4"
                          style={{ "--c": activeCategory.color }}
                          onMouseEnter={e => {
                            e.currentTarget.style.background = activeCategory.bg;
                            e.currentTarget.style.color = activeCategory.color;
                          }}
                          onMouseLeave={e => {
                            e.currentTarget.style.background = "";
                            e.currentTarget.style.color = "";
                          }}
                        >
                          <span
                            className="w-1.5 h-1.5 rounded-full shrink-0"
                            style={{ background: activeCategory.color + "60" }}
                          />
                          {child}
                        </Link>
                      </li>
                    ))}
                  </ul>

                  {/* Promo chip */}
                  <div
                    className="mt-3 flex items-center gap-2 px-3 py-2 rounded-xl text-[11px] font-bold"
                    style={{ background: activeCategory.bg, color: activeCategory.color }}
                  >
                    <Flame size={12} />
                    Up to 50% off · Limited time offer
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Vertical divider */}
          {/* <div className="hidden lg:block w-px h-6 bg-gray-100 mr-3" /> */}

          {/* ── NAV LINKS ── */}
          <nav className="flex-1 cn-scroll overflow-x-auto overflow-y-visible">
            <ul className="flex items-center justify-end">
              {navLinks.map((nav) => {
                const isOpen = openNav === nav.label;
                return (
                  <li
                    key={nav.label}
                    className="relative shrink-0"
                    onMouseEnter={() => setOpenNav(nav.label)}
                    onMouseLeave={() => setOpenNav(null)}
                  >
                    <Link
                      to={nav.href}
                      className={`cn-link-line flex items-center gap-1 px-3 py-[18px] text-[12px] font-bold uppercase tracking-[0.7px] whitespace-nowrap relative transition-colors duration-150 ${
                        isOpen ? "text-[#2bbef9]" : "text-gray-500 hover:text-gray-900"
                      }`}
                    >
                      {nav.label}
                      <ChevronDown
                        size={10}
                        strokeWidth={2.5}
                        className={`transition-transform duration-200 ${isOpen ? "rotate-180 text-[#2bbef9]" : "text-gray-300"}`}
                      />
                    </Link>

                    {/* Dropdown */}
                    {isOpen && (
                      <div
                        className="cn-drop-fade absolute top-full left-1/2 pt-1 z-[100]"
                        style={{ transform: "translateX(-50%)" }}
                      >
                        <div
                          className="bg-white rounded-2xl overflow-hidden"
                          style={{
                            boxShadow: "0 12px 40px rgba(0,0,0,0.1), 0 0 0 1px rgba(0,0,0,0.05)",
                            minWidth: 195,
                          }}
                        >
                          {/* Accent top bar */}
                          <div
                            className="h-[2.5px]"
                            style={{ background: "linear-gradient(90deg,#2bbef9,#6366f1)" }}
                          />

                          <div className="py-1.5">
                            {nav.items.map((sub, i) => (
                              <Link
                                key={i}
                                to={`${nav.href}/${sub.toLowerCase().replace(/\s+/g, "-")}`}
                                className="flex items-center gap-3 px-4 py-2.5 text-[12.5px] font-medium text-gray-500 hover:text-[#2bbef9] hover:bg-sky-50 transition-all duration-100 group/sub"
                              >
                                <span className="w-1.5 h-1.5 rounded-full bg-gray-200 group-hover/sub:bg-[#2bbef9] transition-colors shrink-0" />
                                {sub}
                              </Link>
                            ))}
                          </div>

                          {/* View all */}
                          <div
                            className="px-4 py-2.5"
                            style={{ borderTop: "1px solid #f4f4f6" }}
                          >
                            <Link
                              to={nav.href}
                              className="flex items-center gap-1.5 text-[11px] font-bold text-[#2bbef9] hover:text-blue-700 transition-colors"
                            >
                              <Tag size={10} />
                              View all {nav.label.charAt(0) + nav.label.slice(1).toLowerCase()}
                            </Link>
                          </div>
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
    </>
  );
};

export default CategoryNavigation;