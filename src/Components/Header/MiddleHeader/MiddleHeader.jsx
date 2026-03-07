import { useContext, useState } from "react";
import {
  Search, ShoppingBag, User, MapPin,
  ChevronDown, Menu, X, LogOut, Heart, Sparkles,
} from "lucide-react";
import { Link } from "react-router-dom";
import Logo from "../../layouts/Logo/Logo";
import { MyContext } from "../../../App";

const MiddleHeader = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [searchFocused, setSearchFocused] = useState(false);
  const { isLogin, setIsLogin } = useContext(MyContext);

  const navItemClass =
    "flex items-center justify-between py-3 text-[13px] font-bold text-gray-700 hover:text-blue-600 transition-colors border-b border-gray-50";

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Outfit:wght@400;500;600;700;800&display=swap');
        .mh-root { font-family: 'Outfit', sans-serif; }
        .mh-search-glow { transition: box-shadow 0.2s, border-color 0.2s; }
        .mh-search-glow:focus-within {
          box-shadow: 0 0 0 3.5px rgba(43,190,249,0.15);
          border-color: #2bbef9 !important;
        }
        .mh-cart-btn {
          background: linear-gradient(135deg, #1a73e8 0%, #0ea5e9 100%);
          transition: all 0.2s;
        }
        .mh-cart-btn:hover {
          background: linear-gradient(135deg, #1557b0 0%, #0284c7 100%);
          transform: translateY(-1px);
          box-shadow: 0 6px 20px rgba(14,165,233,0.35);
        }
        .mh-location-btn:hover { background: #f0f9ff; border-color: #bae6fd; }
        .mh-user-btn:hover { background: #f0f9ff; border-color: #bae6fd; }
        .mh-wish-btn:hover { background: #fff1f2; border-color: #fecdd3; }
        .mh-wish-btn:hover svg { color: #f43f5e; }
        @keyframes subtlePulse {
          0%, 100% { box-shadow: 0 0 0 0 rgba(239,68,68,0.4); }
          50% { box-shadow: 0 0 0 4px rgba(239,68,68,0); }
        }
        .badge-pulse { animation: subtlePulse 2s ease infinite; }
      `}</style>

      <div className="mh-root bg-white w-full z-50"
        style={{ borderBottom: "1px solid #f0f0f0", boxShadow: "0 2px 16px rgba(0,0,0,0.05)" }}
      >
        <div className="container mx-auto px-5">
          <div className="flex items-center gap-4 py-3.5">

            {/* ── Logo ── */}
            <div className="shrink-0">
              <Logo />
            </div>

            {/* ── Location ── */}
            <button
              className="mh-location-btn hidden xl:flex items-center gap-2.5 px-3.5 py-2.5 rounded-2xl border border-gray-100 bg-gray-50 shrink-0 transition-all duration-200"
              style={{ minWidth: 160 }}
            >
              <div
                className="w-8 h-8 rounded-xl flex items-center justify-center shrink-0"
                style={{ background: "linear-gradient(135deg,#e0f2fe,#bae6fd)" }}
              >
                <MapPin size={14} className="text-sky-500" />
              </div>
              <div className="text-left">
                <p className="text-[9.5px] font-semibold text-gray-400 uppercase tracking-widest leading-none mb-0.5">
                  Deliver to
                </p>
                <p className="text-[13px] font-bold text-gray-800 leading-none flex items-center gap-1">
                  Bangladesh
                  <ChevronDown size={11} className="text-gray-400" />
                </p>
              </div>
            </button>

            {/* ── Search ── */}
            <div className="hidden md:flex flex-1 mh-search-glow rounded-2xl overflow-hidden border border-gray-200 bg-gray-50">
              {/* Category select */}
              <button className="hidden lg:flex items-center gap-1.5 pl-4 pr-3.5 border-r border-gray-200 text-[11.5px] font-bold text-gray-500 hover:text-sky-600 transition-colors whitespace-nowrap shrink-0 py-3">
                All <ChevronDown size={10} />
              </button>

              <div className="relative flex-1 flex items-center">
                <Search
                  size={15}
                  className={`absolute left-3.5 transition-colors ${searchFocused ? "text-sky-500" : "text-gray-300"}`}
                />
                <input
                  type="text"
                  placeholder="Search products, brands, categories..."
                  onFocus={() => setSearchFocused(true)}
                  onBlur={() => setSearchFocused(false)}
                  className="w-full bg-transparent py-3 pl-9 pr-4 text-[13.5px] outline-none text-gray-700 placeholder-gray-400 font-medium"
                />
              </div>

              <button
                className="m-1.5 px-5 py-2 rounded-xl text-white text-[12px] font-bold flex items-center gap-1.5 shrink-0 transition-all active:scale-95"
                style={{ background: "linear-gradient(135deg,#2bbef9,#1a73e8)" }}
              >
                Search
              </button>
            </div>

            {/* ── Right Side ── */}
            <div className="flex items-center gap-2 shrink-0 ml-auto">

              {/* Wishlist */}
              <button
                className="mh-wish-btn hidden lg:flex w-10 h-10 rounded-2xl border border-gray-100 bg-gray-50 items-center justify-center relative transition-all duration-200"
              >
                <Heart size={18} className="text-gray-400 transition-colors" />
                <span className="badge-pulse absolute -top-1 -right-1 w-[18px] h-[18px] bg-rose-500 text-white text-[9px] font-black rounded-full flex items-center justify-center border-2 border-white">
                  4
                </span>
              </button>

              {/* Divider */}
              <div className="hidden lg:block w-px h-7 bg-gray-100 mx-0.5" />

              {/* User */}
              <div className="hidden lg:block">
                {isLogin ? (
                  <button className="mh-user-btn flex items-center gap-2.5 pl-2.5 pr-4 py-2 rounded-2xl border border-gray-100 bg-gray-50 transition-all duration-200">
                    <div
                      className="w-7 h-7 rounded-xl flex items-center justify-center shadow-sm shrink-0"
                      style={{ background: "linear-gradient(135deg,#2bbef9,#1a73e8)" }}
                    >
                      <User size={13} className="text-white" />
                    </div>
                    <div>
                      <p className="text-[9px] text-gray-400 font-semibold uppercase tracking-wider leading-none">Hello</p>
                      <p className="text-[12.5px] font-bold text-gray-800 leading-none flex items-center gap-0.5">
                        Account <ChevronDown size={10} className="text-gray-400" />
                      </p>
                    </div>
                  </button>
                ) : (
                  <Link
                    to="/login"
                    className="mh-user-btn flex items-center gap-2 pl-3 pr-4 py-2.5 rounded-2xl border border-gray-100 bg-gray-50 text-[12.5px] font-bold text-gray-700 transition-all duration-200"
                  >
                    <User size={15} className="text-sky-500" />
                    Sign In
                  </Link>
                )}
              </div>

              {/* Cart */}
              <Link
                to="/cart"
                className="mh-cart-btn flex items-center gap-2.5 pl-2.5 pr-4 py-2 rounded-2xl text-white shadow-md shadow-sky-100"
              >
                <div className="relative w-8 h-8 rounded-xl bg-white/20 flex items-center justify-center shrink-0">
                  <ShoppingBag size={16} className="text-white" />
                  <span className="absolute -top-1.5 -right-1.5 w-[17px] h-[17px] bg-rose-400 text-white text-[9px] font-black rounded-full flex items-center justify-center border border-white/50">
                    3
                  </span>
                </div>
                <div className="hidden lg:block">
                  <p className="text-[9px] text-white/70 font-semibold uppercase tracking-wider leading-none">Cart</p>
                  <p className="text-[13px] font-black text-white leading-none">৳25,100</p>
                </div>
              </Link>

              {/* Mobile hamburger */}
              <button
                className="lg:hidden w-10 h-10 rounded-2xl border border-gray-100 bg-gray-50 flex items-center justify-center hover:bg-gray-100 transition-colors"
                onClick={() => setIsSidebarOpen(true)}
              >
                <Menu size={20} className="text-gray-700" />
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* ── Mobile Overlay ── */}
      {isSidebarOpen && (
        <div
          className="fixed inset-0 bg-black/60 z-[60] lg:hidden backdrop-blur-sm"
          onClick={() => setIsSidebarOpen(false)}
        />
      )}

      {/* ── Mobile Sidebar ── */}
      <div
        className={`mh-root fixed top-0 right-0 h-full w-[300px] bg-white z-[70] shadow-2xl transform transition-transform duration-300 ease-in-out lg:hidden flex flex-col overflow-hidden ${
          isSidebarOpen ? "translate-x-0" : "translate-x-full"
        }`}
      >
        {/* Sidebar top bar */}
        <div
          className="px-5 py-4 flex items-center justify-between shrink-0"
          style={{ borderBottom: "1px solid #f4f4f6" }}
        >
          <Logo />
          <button
            className="w-8 h-8 rounded-xl bg-gray-100 hover:bg-gray-200 flex items-center justify-center transition-colors"
            onClick={() => setIsSidebarOpen(false)}
          >
            <X size={16} className="text-gray-500" />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto px-5 py-4 flex flex-col gap-3">

          {/* Mobile search */}
          <div className="flex items-center gap-2.5 bg-gray-50 border border-gray-200 rounded-2xl px-3.5 py-2.5">
            <Search size={14} className="text-gray-400 shrink-0" />
            <input
              type="text"
              placeholder="Search products..."
              className="flex-1 bg-transparent text-[13px] outline-none text-gray-700 placeholder-gray-400 font-medium"
            />
          </div>

          {/* Location */}
          <div className="flex items-center gap-3 px-3.5 py-3 rounded-2xl border border-sky-100 bg-sky-50">
            <div className="w-8 h-8 rounded-xl bg-sky-100 flex items-center justify-center shrink-0">
              <MapPin size={14} className="text-sky-500" />
            </div>
            <div>
              <p className="text-[9.5px] text-sky-400 font-bold uppercase tracking-widest">Deliver to</p>
              <p className="text-[13px] font-bold text-sky-800">Bangladesh</p>
            </div>
          </div>

          {/* Cart summary card */}
          <Link
            to="/cart"
            onClick={() => setIsSidebarOpen(false)}
            className="flex items-center gap-3 px-4 py-3.5 rounded-2xl text-white"
            style={{ background: "linear-gradient(135deg,#2bbef9,#1a73e8)" }}
          >
            <div className="relative w-9 h-9 rounded-xl bg-white/20 flex items-center justify-center shrink-0">
              <ShoppingBag size={17} className="text-white" />
              <span className="absolute -top-1 -right-1 w-4 h-4 bg-rose-400 text-white text-[9px] font-black rounded-full flex items-center justify-center">3</span>
            </div>
            <div className="flex-1">
              <p className="text-[10px] text-white/70 font-semibold">My Cart</p>
              <p className="text-[15px] font-black text-white">৳25,100.00</p>
            </div>
            <Sparkles size={16} className="text-white/50" />
          </Link>

          {/* Nav links */}
          <nav className="flex-1">
            <ul className="flex flex-col">
              {[
                { to: "/", label: "HOME" },
                { to: "/men", label: "MEN" },
                { to: "/women", label: "WOMEN" },
                { to: "/beauty", label: "BEAUTY" },
                { to: "/watches", label: "WATCHES" },
                { to: "/kids", label: "KIDS" },
                { to: "/blog", label: "BLOG" },
                { to: "/contact", label: "CONTACT" },
              ].map((item) => (
                <li key={item.to}>
                  <Link
                    to={item.to}
                    className={navItemClass}
                    onClick={() => setIsSidebarOpen(false)}
                  >
                    {item.label}
                    <ChevronDown size={13} className="opacity-30" />
                  </Link>
                </li>
              ))}
            </ul>
          </nav>
        </div>

        {/* Sidebar bottom */}
        <div className="px-5 py-4 shrink-0" style={{ borderTop: "1px solid #f4f4f6" }}>
          {!isLogin ? (
            <Link
              to="/login"
              onClick={() => setIsSidebarOpen(false)}
              className="flex items-center justify-center gap-2 text-white font-bold w-full py-3 rounded-2xl text-[13px] transition-all active:scale-95"
              style={{ background: "linear-gradient(135deg,#2bbef9,#1a73e8)" }}
            >
              <User size={15} /> Sign In to Account
            </Link>
          ) : (
            <button
              className="flex items-center gap-3 text-gray-500 font-bold w-full py-3 px-1 hover:text-rose-600 transition-colors text-[13px]"
              onClick={() => { setIsLogin(false); setIsSidebarOpen(false); }}
            >
              <LogOut size={16} /> Sign Out
            </button>
          )}
        </div>
      </div>
    </>
  );
};

export default MiddleHeader;

// import { useContext, useState } from "react";
// import {
//   Menu,
//   Search,
//   ShoppingBag,
//   User,
//   X,
//   ChevronDown,
//   LogOut,
// } from "lucide-react";
// import { Link } from "react-router-dom";
// import DropdownModal from "./DropdownModal";
// import Logo from "../../layouts/Logo/Logo";
// import { MyContext } from "../../../App";

// const MiddleHeader = () => {
//   const [isSidebarOpen, setIsSidebarOpen] = useState(false);
//   const { isLogin, setIsLogin } = useContext(MyContext);
//   const navItemClass =
//     "flex items-center justify-between py-3.5 text-sm font-semibold text-gray-700 hover:text-red-600 transition-colors border-b border-gray-50";
//   const dropdownItemClass =
//     "block py-2.5 pl-4 text-sm text-gray-500 hover:text-red-600 border-l border-gray-100 ml-2";

//   return (
//     <div className="bg-white w-full border-b border-gray-100 z-50">
//       <div className="container mx-auto px-4 py-4 lg:py-6 flex items-center justify-between gap-5">
//         {/* 1. Logo Section (Always Left) */}
//         <div className="flex items-center gap-8">
//           <Logo />
//           {/* Desktop Dropdown */}
//           <div className="hidden lg:block">
//             <DropdownModal />
//           </div>
//         </div>

//         {/* 2. Search Section (Desktop Only) */}
//         <div className="hidden flex-1 md:flex relative w-full max-w-[600px] mx-auto">
//           <input
//             type="text"
//             placeholder="Search for products..."
//             className="w-full bg-[#f3f4f7] border border-gray-100 rounded-lg py-3 px-5 text-[15px] outline-none focus:bg-white focus:ring-1 focus:ring-red-200 transition-all"
//           />
//           <Search
//             className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400"
//             size={20}
//           />
//         </div>

//         {/* 3. Action Icons (Cart & Menu on Right for Mobile) */}
//         <div className="flex items-center gap-2 sm:gap-4 lg:gap-6">
//           <div className="hidden lg:block">
//             {isLogin ? (
//               <div className="p-2.5 border border-gray-200 rounded-full cursor-pointer hover:bg-gray-50">
//                 <User className="text-gray-700" size={20} />
//               </div>
//             ) : (
//               <Link
//                 to="/login"
//                 className="px-4 py-2 border border-red-500 text-red-600 rounded-md text-sm font-semibold hover:bg-red-50 transition-colors"
//               >
//                 Sign In
//               </Link>
//             )}
//           </div>

//           {/* Cart Icon */}
//           <div className="flex items-center gap-3 cursor-pointer group">
//             <div className="relative p-2.5 bg-red-50 rounded-full group-hover:bg-red-100 transition-colors">
//               <Link to={"./cart"}>
//                 <ShoppingBag size={22} className="text-red-600" />
//                 <span className="absolute -top-1 -right-1 bg-red-600 text-white text-[10px] font-bold rounded-full w-5 h-5 flex items-center justify-center border-2 border-white">
//                   2
//                 </span>
//               </Link>
//             </div>
//             <div className="hidden lg:block text-sm font-bold text-gray-800">
//               $0.00
//             </div>
//           </div>

//           {/* Mobile Menu Icon */}
//           <div className="lg:hidden p-2 ml-1">
//             <Menu
//               className="text-gray-700 cursor-pointer"
//               size={28}
//               onClick={() => setIsSidebarOpen(true)}
//             />
//           </div>
//         </div>
//       </div>

//       {/* MOBILE SIDEBAR */}
//       {isSidebarOpen && (
//         <div
//           className="fixed inset-0 bg-black/60 z-[60] lg:hidden backdrop-blur-sm transition-opacity"
//           onClick={() => setIsSidebarOpen(false)}
//         />
//       )}

//       <div
//         className={`fixed top-0 right-0 h-full w-[280px] bg-white z-[70] shadow-2xl transform transition-transform duration-300 ease-in-out lg:hidden overflow-y-auto ${isSidebarOpen ? "translate-x-0" : "translate-x-full"}`}
//       >
//         <div className="p-6 flex flex-col h-full">
//           <div className="flex items-center justify-between mb-8 border-b pb-4">
//             <Logo />
//             <div
//               className="p-2 hover:bg-gray-100 rounded-full cursor-pointer"
//               onClick={() => setIsSidebarOpen(false)}
//             >
//               <X className="text-gray-500" size={24} />
//             </div>
//           </div>

//           <div className="relative mb-6">
//             <DropdownModal />
//           </div>

//           <nav className="flex-1 overflow-y-auto">
//             <ul className="flex flex-col">
//               <li>
//                 <Link to="/" className={navItemClass}>
//                   HOME <ChevronDown size={14} className="opacity-50" />
//                 </Link>
//                 <div className="bg-gray-50/50">
//                   <Link to="/home-1" className={dropdownItemClass}>Home Style 1</Link>
//                   <Link to="/home-2" className={dropdownItemClass}>Home Style 2</Link>
//                 </div>
//               </li>
//               <li><Link to="/men" className={navItemClass}>MEN <ChevronDown size={14} className="opacity-50" /></Link></li>
//               <li><Link to="/women" className={navItemClass}>WOMEN <ChevronDown size={14} className="opacity-50" /></Link></li>
//               <li><Link to="/beauty" className={navItemClass}>BEAUTY</Link></li>
//               <li><Link to="/watches" className={navItemClass}>WATCHES</Link></li>
//               <li><Link to="/kids" className={navItemClass}>KIDS</Link></li>
//               <li><Link to="/blog" className={navItemClass}>BLOG</Link></li>
//               <li><Link to="/contact" className={navItemClass}>CONTACT</Link></li>
//             </ul>
//           </nav>

//           <div className="mt-6 border-t pt-4">
//             <button className="flex items-center gap-3 text-gray-600 font-bold w-full py-3 px-2 hover:text-red-600 transition-colors">
//               <LogOut size={20} />
//               LOGOUT
//             </button>
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default MiddleHeader;



// import React from 'react';

// const MiddleHeader = () => {
//   return (
//     <div>
//       hello middle header 
//     </div>
//   );
// };

// export default MiddleHeader;