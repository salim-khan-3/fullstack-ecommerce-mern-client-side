
import { useContext, useState, useEffect, useRef } from "react";
import {
  Search, ShoppingBag, User, MapPin,
  ChevronDown, X, LogOut, Heart, Menu,
  ShoppingCart, Package, UserCircle,
} from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import Logo from "../../layouts/Logo/Logo";
import { MyContext } from "../../../App";
import { getAllCategoriesForUI } from "../../../utils/api/categoryApi";
import { getAllSubCategories } from "../../../utils/api/subCategoryApi";
import { useAuth } from "../../../context/AuthContext";
import { useCart } from "../../../context/CartContext";

const MiddleHeader = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [searchFocused, setSearchFocused] = useState(false);
  const [openCatId, setOpenCatId] = useState(null);
  const [categories, setCategories] = useState([]);
  const [subCategories, setSubCategories] = useState([]);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  const { isLoggedIn, user, logout } = useAuth();
  const { cartCount, cartTotal } = useCart();
  const navigate = useNavigate();
  const dropdownRef = useRef(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const catData = await getAllCategoriesForUI();
        setCategories(Array.isArray(catData) ? catData : []);
        const subData = await getAllSubCategories();
        setSubCategories(Array.isArray(subData) ? subData : []);
      } catch (e) {
        console.error("Error fetching header data:", e);
      }
    };
    fetchData();
  }, []);

  // dropdown outside click close
  useEffect(() => {
    const handler = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setIsDropdownOpen(false);
      }
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  const getSubCats = (cat) =>
    subCategories.filter((s) => {
      const catId = s.category?._id || s.category;
      return catId?.toString() === cat._id?.toString();
    });

  const toggleCat = (id) => setOpenCatId((prev) => (prev === id ? null : id));

  const handleLogout = () => {
    logout();
    setIsDropdownOpen(false);
    setIsSidebarOpen(false);
    navigate("/");
  };

  const avatarLetter = user?.name?.charAt(0).toUpperCase() || "U";

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

        .mh-location-btn:hover { background: #f0f9ff; border-color: #bae6fd; }
        .mh-user-btn:hover { background: #f0f9ff; border-color: #bae6fd; }
        .mh-wish-btn:hover { background: #fff1f2; border-color: #fecdd3; }
        .mh-wish-btn:hover svg { color: #f43f5e; }
        @keyframes subtlePulse {
          0%, 100% { box-shadow: 0 0 0 0 rgba(239,68,68,0.4); }
          50% { box-shadow: 0 0 0 4px rgba(239,68,68,0); }
        }
        .badge-pulse { animation: subtlePulse 2s ease infinite; }
        .mh-sidebar {
          transform: translateX(100%);
          transition: transform 0.3s cubic-bezier(0.4,0,0.2,1);
        }
        .mh-sidebar.open { transform: translateX(0); }
        .cat-sub-list { max-height: 0; overflow: hidden; transition: max-height 0.3s ease; }
        .cat-sub-list.open { max-height: 400px; }
        .cat-row { transition: background 0.15s; }
        .cat-row:hover { background: #f8fafc; }
        .cat-row.active { background: #eff6ff; }
        .sub-row { transition: background 0.15s, padding-left 0.15s; }
        .sub-row:hover { background: #eff6ff; padding-left: 28px; }

        /* Dropdown animation */
        @keyframes dropIn {
          from { opacity: 0; transform: translateY(-8px) scale(0.97); }
          to   { opacity: 1; transform: translateY(0) scale(1); }
        }
        .user-dropdown { animation: dropIn 0.2s cubic-bezier(0.4,0,0.2,1); }
      `}</style>

      {/* ── MAIN HEADER BAR ── */}
      <div className="mh-root bg-white w-full sticky top-0 z-[110]"
        style={{ borderBottom: "1px solid #f0f0f0", boxShadow: "0 2px 16px rgba(0,0,0,0.05)" }}>
        <div className="container mx-auto px-5">
          <div className="flex items-center gap-4 py-3.5">
            <div className="shrink-0"><Logo /></div>

            {/* Location */}
            <button className="mh-location-btn hidden xl:flex items-center gap-2.5 px-3.5 py-2.5 rounded-2xl border border-gray-100 bg-gray-50 shrink-0 transition-all duration-200" style={{ minWidth: 160 }}>
              <div className="w-8 h-8 rounded-xl flex items-center justify-center shrink-0" style={{ background: "linear-gradient(135deg,#e0f2fe,#bae6fd)" }}>
                <MapPin size={14} className="text-sky-500" />
              </div>
              <div className="text-left">
                <p className="text-[9.5px] font-semibold text-gray-400 uppercase tracking-widest leading-none mb-0.5">Deliver to</p>
                <p className="text-[13px] font-bold text-gray-800 leading-none flex items-center gap-1">Bangladesh <ChevronDown size={11} className="text-gray-400" /></p>
              </div>
            </button>

            {/* Search */}
            <div className="hidden md:flex flex-1 mh-search-glow rounded-2xl overflow-hidden border border-gray-200 bg-gray-50">
              <button className="hidden lg:flex items-center gap-1.5 pl-4 pr-3.5 border-r border-gray-200 text-[11.5px] font-bold text-gray-500 hover:text-sky-600 transition-colors whitespace-nowrap shrink-0 py-3">All <ChevronDown size={10} /></button>
              <div className="relative flex-1 flex items-center">
                <Search size={15} className={`absolute left-3.5 transition-colors ${searchFocused ? "text-sky-500" : "text-gray-300"}`} />
                <input type="text" placeholder="Search products..."
                  onFocus={() => setSearchFocused(true)}
                  onBlur={() => setSearchFocused(false)}
                  className="w-full bg-transparent py-3 pl-9 pr-4 text-[13.5px] outline-none text-gray-700 placeholder-gray-400 font-medium" />
              </div>
              <button className="m-1.5 px-5 py-2 rounded-xl text-white text-[12px] font-bold flex items-center gap-1.5 shrink-0 transition-all active:scale-95"
                style={{ background: "linear-gradient(135deg,#2bbef9,#1a73e8)" }}>Search</button>
            </div>

            {/* Right actions */}
            <div className="flex items-center gap-2 shrink-0 ml-auto">

              {/* Wishlist */}
              <button className="mh-wish-btn hidden lg:flex w-10 h-10 rounded-2xl border border-gray-100 bg-gray-50 items-center justify-center relative transition-all duration-200">
                <Heart size={18} className="text-gray-400 transition-colors" />
                <span className="badge-pulse absolute -top-1 -right-1 w-[18px] h-[18px] bg-rose-500 text-white text-[9px] font-black rounded-full flex items-center justify-center border-2 border-white">4</span>
              </button>

              <div className="hidden lg:block w-px h-7 bg-gray-100 mx-0.5" />

              {/* User — Dropdown or Sign In */}
              <div className="hidden lg:block relative" ref={dropdownRef}>
                {isLoggedIn ? (
                  <>
                    {/* Avatar Button */}
                    <button
                      onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                      className="mh-user-btn flex items-center gap-2.5 pl-2.5 pr-3.5 py-2 rounded-2xl border border-gray-100 bg-gray-50 transition-all duration-200"
                    >
                      {/* Avatar Circle */}
                      <div className="w-8 h-8 rounded-xl flex items-center justify-center text-white text-sm font-black shadow-sm shrink-0"
                        style={{ background: "linear-gradient(135deg,#2bbef9,#1a73e8)" }}>
                        {avatarLetter}
                      </div>
                      <div className="text-left">
                        <p className="text-[9px] text-gray-400 font-semibold uppercase tracking-wider leading-none">Hello,</p>
                        <p className="text-[12.5px] font-bold text-gray-800 leading-none flex items-center gap-1 max-w-[90px] truncate">
                          {user?.name} <ChevronDown size={10} className={`text-gray-400 transition-transform duration-200 ${isDropdownOpen ? "rotate-180" : ""}`} />
                        </p>
                      </div>
                    </button>

                    {/* Dropdown */}
                    {isDropdownOpen && (
                      <div className="user-dropdown absolute right-0 mt-2 w-56 bg-white rounded-2xl shadow-2xl border border-gray-100 overflow-hidden z-50">
                        {/* Profile Info */}
                        <div className="p-4 border-b border-gray-50 flex items-center gap-3"
                          style={{ background: "linear-gradient(135deg,#f0f9ff,#e0f2fe)" }}>
                          <div className="w-10 h-10 rounded-xl flex items-center justify-center text-white font-black text-base shadow-sm shrink-0"
                            style={{ background: "linear-gradient(135deg,#2bbef9,#1a73e8)" }}>
                            {avatarLetter}
                          </div>
                          <div className="overflow-hidden">
                            <p className="text-sm font-bold text-gray-800 truncate">{user?.name}</p>
                            <p className="text-[10px] text-gray-400 truncate">{user?.email}</p>
                          </div>
                        </div>

                        {/* Menu Items */}
                        <div className="p-2">
                          <Link to="/my-account" onClick={() => setIsDropdownOpen(false)}
                            className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-[13px] text-gray-600 hover:bg-blue-50 hover:text-blue-600 transition-colors font-medium">
                            <UserCircle size={15} /> My Account
                          </Link>
                          <Link to="/orders" onClick={() => setIsDropdownOpen(false)}
                            className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-[13px] text-gray-600 hover:bg-blue-50 hover:text-blue-600 transition-colors font-medium">
                            <Package size={15} /> Orders
                          </Link>
                          <Link to="/my-list" onClick={() => setIsDropdownOpen(false)}
                            className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-[13px] text-gray-600 hover:bg-blue-50 hover:text-blue-600 transition-colors font-medium">
                            <Heart size={15} /> My List
                          </Link>
                          <div className="border-t border-gray-100 mt-1 pt-1">
                            <button onClick={handleLogout}
                              className="flex items-center gap-3 w-full px-3 py-2.5 rounded-xl text-[13px] text-red-500 hover:bg-red-50 transition-colors font-medium">
                              <LogOut size={15} /> Logout
                            </button>
                          </div>
                        </div>
                      </div>
                    )}
                  </>
                ) : (
                  <Link to="/login"
                    className="mh-user-btn flex items-center gap-2 pl-3 pr-4 py-2.5 rounded-2xl border border-gray-100 bg-gray-50 text-[12.5px] font-bold text-gray-700 transition-all duration-200">
                    <User size={15} className="text-sky-500" /> Sign In
                  </Link>
                )}
              </div>

              {/* Cart */}
              <Link to="/cart" className="flex items-center gap-2.5 pl-2.5 pr-4 py-2 rounded-2xl border border-gray-100 bg-gray-50 hover:bg-gray-100 transition-all duration-200 shadow-sm">
                <div className="relative w-8 h-8 rounded-xl bg-white flex items-center justify-center shrink-0 border border-gray-100">
                  <ShoppingBag size={16} className="text-gray-600" />
                  {cartCount > 0 && (
                    <span className="badge-pulse absolute -top-1.5 -right-1.5 w-[17px] h-[17px] bg-rose-500 text-white text-[9px] font-black rounded-full flex items-center justify-center border border-white">
                      {cartCount}
                    </span>
                  )}
                </div>
                <div className="hidden lg:block">
                  <p className="text-[13px] font-black text-gray-800 leading-none">৳{cartTotal?.toLocaleString()}</p>
                </div>
              </Link>

              <button className="lg:hidden w-10 h-10 rounded-2xl border border-gray-100 bg-gray-50 flex items-center justify-center hover:bg-gray-100 transition-colors"
                onClick={() => setIsSidebarOpen(true)}>
                <Menu size={20} className="text-gray-700" />
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* ── MOBILE SIDEBAR OVERLAY ── */}
      <div className={`fixed inset-0 bg-black/50 z-[120] lg:hidden backdrop-blur-sm transition-opacity duration-300 ${isSidebarOpen ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none"}`}
        onClick={() => setIsSidebarOpen(false)} />

      {/* ── MOBILE SIDEBAR ── */}
      <div className={`mh-root fixed top-0 right-0 h-full w-[300px] bg-white z-[130] shadow-2xl lg:hidden flex flex-col mh-sidebar ${isSidebarOpen ? "open" : ""}`}>
        <div className="px-5 py-4 flex items-center justify-between shrink-0" style={{ borderBottom: "1px solid #f4f4f6" }}>
          <Logo />
          <button className="w-8 h-8 rounded-xl bg-gray-100 hover:bg-gray-200 flex items-center justify-center transition-colors"
            onClick={() => setIsSidebarOpen(false)}><X size={16} className="text-gray-500" /></button>
        </div>

        <div className="flex-1 overflow-y-auto flex flex-col">
          <div className="px-4 pt-4 pb-2">
            <div className="flex items-center gap-2.5 bg-gray-50 border border-gray-200 rounded-2xl px-3.5 py-2.5">
              <Search size={14} className="text-gray-400 shrink-0" />
              <input type="text" placeholder="Search products..." className="flex-1 bg-transparent text-[13px] outline-none text-gray-700 placeholder-gray-400 font-medium" />
            </div>
          </div>

          {/* Mobile user info */}
          {isLoggedIn && (
            <div className="mx-4 mt-2 mb-1 p-3 rounded-2xl flex items-center gap-3"
              style={{ background: "linear-gradient(135deg,#f0f9ff,#e0f2fe)" }}>
              <div className="w-9 h-9 rounded-xl flex items-center justify-center text-white font-black text-sm shrink-0"
                style={{ background: "linear-gradient(135deg,#2bbef9,#1a73e8)" }}>
                {avatarLetter}
              </div>
              <div className="overflow-hidden">
                <p className="text-[13px] font-bold text-gray-800 truncate">{user?.name}</p>
                <p className="text-[10px] text-gray-400 truncate">{user?.email}</p>
              </div>
            </div>
          )}

          <div className="px-4 pt-2 pb-4">
            <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-2 px-1">Categories</p>
            {categories.map((cat) => {
              const subCats = getSubCats(cat);
              const isOpen = openCatId === cat._id;
              return (
                <div key={cat._id} className="mb-1">
                  <div
                    className={`cat-row flex items-center justify-between px-3 py-3 rounded-xl cursor-pointer ${isOpen ? "active" : ""}`}
                    onClick={() => subCats.length > 0 ? toggleCat(cat._id) : (setIsSidebarOpen(false), navigate(`/category/${cat._id}`))}
                  >
                    <span className={`text-[13.5px] font-bold flex-1 ${isOpen ? "text-blue-600" : "text-gray-700"}`}>{cat.name}</span>
                    {subCats.length > 0 && (
                      <div className={`w-7 h-7 rounded-full flex items-center justify-center transition-all duration-200 ${isOpen ? "bg-blue-100 rotate-180" : "bg-gray-100"}`}>
                        <ChevronDown size={13} className={isOpen ? "text-blue-600" : "text-gray-400"} />
                      </div>
                    )}
                  </div>
                  {subCats.length > 0 && (
                    <div className={`cat-sub-list ${isOpen ? "open" : ""}`}>
                      <div className="pl-3 pb-1">
                        {subCats.map((sub) => (
                          <Link key={sub._id} to={`/category/${cat._id}?subCat=${sub._id}`}
                            onClick={() => setIsSidebarOpen(false)}
                            className="sub-row flex items-center gap-3 px-4 py-2.5 rounded-xl text-[12.5px] text-gray-500 font-medium">
                            <span className="w-1.5 h-1.5 rounded-full bg-blue-300 shrink-0" />{sub.subCat}
                          </Link>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>

        {/* Mobile Bottom */}
        <div className="px-4 py-4 shrink-0 space-y-2" style={{ borderTop: "1px solid #f4f4f6" }}>
          {isLoggedIn ? (
            <>
              <Link to="/orders" onClick={() => setIsSidebarOpen(false)}
                className="flex items-center gap-2 text-gray-600 font-semibold w-full py-2.5 px-3 rounded-xl hover:bg-gray-50 text-[13px] transition-colors">
                <Package size={15} /> Orders
              </Link>
              <button onClick={handleLogout}
                className="flex items-center gap-2 text-red-500 font-bold w-full py-2.5 px-3 rounded-xl hover:bg-red-50 transition-colors text-[13px]">
                <LogOut size={15} /> Sign Out
              </button>
            </>
          ) : (
            <Link to="/login" onClick={() => setIsSidebarOpen(false)}
              className="flex items-center justify-center gap-2 text-white font-bold w-full py-3 rounded-2xl text-[13px] transition-all active:scale-95"
              style={{ background: "linear-gradient(135deg,#2bbef9,#1a73e8)" }}>
              <User size={15} /> Sign In
            </Link>
          )}
        </div>
      </div>
    </>
  );
};

export default MiddleHeader;












// import { useContext, useState, useEffect, useRef } from "react";
// import {
//   Search,
//   ShoppingBag,
//   User,
//   MapPin,
//   ChevronDown,
//   X,
//   LogOut,
//   Heart,
//   Menu,
//   ShoppingCart,
//   Package,
//   UserCircle,
// } from "lucide-react";
// import { Link, useNavigate } from "react-router-dom";
// import Logo from "../../layouts/Logo/Logo";
// import { MyContext } from "../../../App";
// import { getAllCategoriesForUI } from "../../../utils/api/categoryApi";
// import { getAllSubCategories } from "../../../utils/api/subCategoryApi";
// import { useAuth } from "../../../context/AuthContext";

// const MiddleHeader = () => {
//   const [isSidebarOpen, setIsSidebarOpen] = useState(false);
//   const [searchFocused, setSearchFocused] = useState(false);
//   const [openCatId, setOpenCatId] = useState(null);
//   const [categories, setCategories] = useState([]);
//   const [subCategories, setSubCategories] = useState([]);
//   const [isDropdownOpen, setIsDropdownOpen] = useState(false);

//   const { isLoggedIn, user, logout } = useAuth();
//   const navigate = useNavigate();
//   const dropdownRef = useRef(null);

//   useEffect(() => {
//     const fetchData = async () => {
//       try {
//         const catData = await getAllCategoriesForUI();
//         setCategories(Array.isArray(catData) ? catData : []);
//         const subData = await getAllSubCategories();
//         setSubCategories(Array.isArray(subData) ? subData : []);
//       } catch (e) {
//         console.error("Error fetching header data:", e);
//       }
//     };
//     fetchData();
//   }, []);

//   // dropdown outside click close
//   useEffect(() => {
//     const handler = (e) => {
//       if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
//         setIsDropdownOpen(false);
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

//   const toggleCat = (id) => setOpenCatId((prev) => (prev === id ? null : id));

//   const handleLogout = () => {
//     logout();
//     setIsDropdownOpen(false);
//     setIsSidebarOpen(false);
//     navigate("/");
//   };

//   const avatarLetter = user?.name?.charAt(0).toUpperCase() || "U";

//   return (
//     <>
//       <style>{`
//         @import url('https://fonts.googleapis.com/css2?family=Outfit:wght@400;500;600;700;800&display=swap');
//         .mh-root { font-family: 'Outfit', sans-serif; }
//         .mh-search-glow { transition: box-shadow 0.2s, border-color 0.2s; }
//         .mh-search-glow:focus-within {
//           box-shadow: 0 0 0 3.5px rgba(43,190,249,0.15);
//           border-color: #2bbef9 !important;
//         }
//         .mh-cart-btn {
//           background: linear-gradient(135deg, #1a73e8 0%, #0ea5e9 100%);
//           transition: all 0.2s;
//         }
//         .mh-cart-btn:hover {
//           background: linear-gradient(135deg, #1557b0 0%, #0284c7 100%);
//           transform: translateY(-1px);
//           box-shadow: 0 6px 20px rgba(14,165,233,0.35);
//         }
//         .mh-location-btn:hover { background: #f0f9ff; border-color: #bae6fd; }
//         .mh-user-btn:hover { background: #f0f9ff; border-color: #bae6fd; }
//         .mh-wish-btn:hover { background: #fff1f2; border-color: #fecdd3; }
//         .mh-wish-btn:hover svg { color: #f43f5e; }
//         @keyframes subtlePulse {
//           0%, 100% { box-shadow: 0 0 0 0 rgba(239,68,68,0.4); }
//           50% { box-shadow: 0 0 0 4px rgba(239,68,68,0); }
//         }
//         .badge-pulse { animation: subtlePulse 2s ease infinite; }
//         .mh-sidebar {
//           transform: translateX(100%);
//           transition: transform 0.3s cubic-bezier(0.4,0,0.2,1);
//         }
//         .mh-sidebar.open { transform: translateX(0); }
//         .cat-sub-list { max-height: 0; overflow: hidden; transition: max-height 0.3s ease; }
//         .cat-sub-list.open { max-height: 400px; }
//         .cat-row { transition: background 0.15s; }
//         .cat-row:hover { background: #f8fafc; }
//         .cat-row.active { background: #eff6ff; }
//         .sub-row { transition: background 0.15s, padding-left 0.15s; }
//         .sub-row:hover { background: #eff6ff; padding-left: 28px; }

//         /* Dropdown animation */
//         @keyframes dropIn {
//           from { opacity: 0; transform: translateY(-8px) scale(0.97); }
//           to   { opacity: 1; transform: translateY(0) scale(1); }
//         }
//         .user-dropdown { animation: dropIn 0.2s cubic-bezier(0.4,0,0.2,1); }
//       `}</style>

//       {/* ── MAIN HEADER BAR ── */}
//       <div
//         className="mh-root bg-white w-full sticky top-0 z-[110]"
//         style={{
//           borderBottom: "1px solid #f0f0f0",
//           boxShadow: "0 2px 16px rgba(0,0,0,0.05)",
//         }}
//       >
//         <div className="container mx-auto px-5">
//           <div className="flex items-center gap-4 py-3.5">
//             <div className="shrink-0">
//               <Logo />
//             </div>

//             {/* Location */}
//             <button
//               className="mh-location-btn hidden xl:flex items-center gap-2.5 px-3.5 py-2.5 rounded-2xl border border-gray-100 bg-gray-50 shrink-0 transition-all duration-200"
//               style={{ minWidth: 160 }}
//             >
//               <div
//                 className="w-8 h-8 rounded-xl flex items-center justify-center shrink-0"
//                 style={{
//                   background: "linear-gradient(135deg,#e0f2fe,#bae6fd)",
//                 }}
//               >
//                 <MapPin size={14} className="text-sky-500" />
//               </div>
//               <div className="text-left">
//                 <p className="text-[9.5px] font-semibold text-gray-400 uppercase tracking-widest leading-none mb-0.5">
//                   Deliver to
//                 </p>
//                 <p className="text-[13px] font-bold text-gray-800 leading-none flex items-center gap-1">
//                   Bangladesh <ChevronDown size={11} className="text-gray-400" />
//                 </p>
//               </div>
//             </button>

//             {/* Search */}
//             <div className="hidden md:flex flex-1 mh-search-glow rounded-2xl overflow-hidden border border-gray-200 bg-gray-50">
//               <button className="hidden lg:flex items-center gap-1.5 pl-4 pr-3.5 border-r border-gray-200 text-[11.5px] font-bold text-gray-500 hover:text-sky-600 transition-colors whitespace-nowrap shrink-0 py-3">
//                 All <ChevronDown size={10} />
//               </button>
//               <div className="relative flex-1 flex items-center">
//                 <Search
//                   size={15}
//                   className={`absolute left-3.5 transition-colors ${searchFocused ? "text-sky-500" : "text-gray-300"}`}
//                 />
//                 <input
//                   type="text"
//                   placeholder="Search products..."
//                   onFocus={() => setSearchFocused(true)}
//                   onBlur={() => setSearchFocused(false)}
//                   className="w-full bg-transparent py-3 pl-9 pr-4 text-[13.5px] outline-none text-gray-700 placeholder-gray-400 font-medium"
//                 />
//               </div>
//               <button
//                 className="m-1.5 px-5 py-2 rounded-xl text-white text-[12px] font-bold flex items-center gap-1.5 shrink-0 transition-all active:scale-95"
//                 style={{
//                   background: "linear-gradient(135deg,#2bbef9,#1a73e8)",
//                 }}
//               >
//                 Search
//               </button>
//             </div>

//             {/* Right actions */}
//             <div className="flex items-center gap-2 shrink-0 ml-auto">
//               {/* Wishlist */}
//               <button className="mh-wish-btn hidden lg:flex w-10 h-10 rounded-2xl border border-gray-100 bg-gray-50 items-center justify-center relative transition-all duration-200">
//                 <Heart size={18} className="text-gray-400 transition-colors" />
//                 <span className="badge-pulse absolute -top-1 -right-1 w-[18px] h-[18px] bg-rose-500 text-white text-[9px] font-black rounded-full flex items-center justify-center border-2 border-white">
//                   4
//                 </span>
//               </button>

//               <div className="hidden lg:block w-px h-7 bg-gray-100 mx-0.5" />

//               {/* User — Dropdown or Sign In */}
//               <div className="hidden lg:block relative" ref={dropdownRef}>
//                 {isLoggedIn ? (
//                   <>
//                     {/* Avatar Button */}
//                     <button
//                       onClick={() => setIsDropdownOpen(!isDropdownOpen)}
//                       className="mh-user-btn flex items-center gap-2.5 pl-2.5 pr-3.5 py-2 rounded-2xl border border-gray-100 bg-gray-50 transition-all duration-200"
//                     >
//                       {/* Avatar Circle */}
//                       <div
//                         className="w-8 h-8 rounded-xl flex items-center justify-center text-white text-sm font-black shadow-sm shrink-0"
//                         style={{
//                           background: "linear-gradient(135deg,#2bbef9,#1a73e8)",
//                         }}
//                       >
//                         {avatarLetter}
//                       </div>
//                       <div className="text-left">
//                         <p className="text-[9px] text-gray-400 font-semibold uppercase tracking-wider leading-none">
//                           Hello,
//                         </p>
//                         <p className="text-[12.5px] font-bold text-gray-800 leading-none flex items-center gap-1 max-w-[90px] truncate">
//                           {user?.name}{" "}
//                           <ChevronDown
//                             size={10}
//                             className={`text-gray-400 transition-transform duration-200 ${isDropdownOpen ? "rotate-180" : ""}`}
//                           />
//                         </p>
//                       </div>
//                     </button>

//                     {/* Dropdown */}
//                     {isDropdownOpen && (
//                       <div className="user-dropdown absolute right-0 mt-2 w-56 bg-white rounded-2xl shadow-2xl border border-gray-100 overflow-hidden z-50">
//                         {/* Profile Info */}
//                         <div
//                           className="p-4 border-b border-gray-50 flex items-center gap-3"
//                           style={{
//                             background:
//                               "linear-gradient(135deg,#f0f9ff,#e0f2fe)",
//                           }}
//                         >
//                           <div
//                             className="w-10 h-10 rounded-xl flex items-center justify-center text-white font-black text-base shadow-sm shrink-0"
//                             style={{
//                               background:
//                                 "linear-gradient(135deg,#2bbef9,#1a73e8)",
//                             }}
//                           >
//                             {avatarLetter}
//                           </div>
//                           <div className="overflow-hidden">
//                             <p className="text-sm font-bold text-gray-800 truncate">
//                               {user?.name}
//                             </p>
//                             <p className="text-[10px] text-gray-400 truncate">
//                               {user?.email}
//                             </p>
//                           </div>
//                         </div>

//                         {/* Menu Items */}
//                         <div className="p-2">
//                           <Link
//                             to="/my-account"
//                             onClick={() => setIsDropdownOpen(false)}
//                             className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-[13px] text-gray-600 hover:bg-blue-50 hover:text-blue-600 transition-colors font-medium"
//                           >
//                             <UserCircle size={15} /> My Account
//                           </Link>
//                           <Link
//                             to="/orders"
//                             onClick={() => setIsDropdownOpen(false)}
//                             className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-[13px] text-gray-600 hover:bg-blue-50 hover:text-blue-600 transition-colors font-medium"
//                           >
//                             <Package size={15} /> Orders
//                           </Link>
//                           <Link
//                             to="/my-list"
//                             onClick={() => setIsDropdownOpen(false)}
//                             className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-[13px] text-gray-600 hover:bg-blue-50 hover:text-blue-600 transition-colors font-medium"
//                           >
//                             <Heart size={15} /> My List
//                           </Link>
//                           <div className="border-t border-gray-100 mt-1 pt-1">
//                             <button
//                               onClick={handleLogout}
//                               className="flex items-center gap-3 w-full px-3 py-2.5 rounded-xl text-[13px] text-red-500 hover:bg-red-50 transition-colors font-medium"
//                             >
//                               <LogOut size={15} /> Logout
//                             </button>
//                           </div>
//                         </div>
//                       </div>
//                     )}
//                   </>
//                 ) : (
//                   <Link
//                     to="/login"
//                     className="mh-user-btn flex items-center gap-2 pl-3 pr-4 py-2.5 rounded-2xl border border-gray-100 bg-gray-50 text-[12.5px] font-bold text-gray-700 transition-all duration-200"
//                   >
//                     <User size={15} className="text-sky-500" /> Sign In
//                   </Link>
//                 )}
//               </div>

//               {/* Cart */}
//               <Link
//                 to="/cart"
//                 className="mh-cart-btn flex items-center gap-2.5 pl-2.5 pr-4 py-2 rounded-2xl text-white shadow-md shadow-sky-100"
//               >
//                 <div className="relative w-8 h-8 rounded-xl bg-white/20 flex items-center justify-center shrink-0">
//                   <ShoppingBag size={16} className="text-white" />
//                   <span className="absolute -top-1.5 -right-1.5 w-[17px] h-[17px] bg-rose-400 text-white text-[9px] font-black rounded-full flex items-center justify-center border border-white/50">
//                     3
//                   </span>
//                 </div>
//                 <div className="hidden lg:block">
//                   <p className="text-[9px] text-white/70 font-semibold uppercase tracking-wider leading-none">
//                     Cart
//                   </p>
//                   <p className="text-[13px] font-black text-white leading-none">
//                     ৳25,100
//                   </p>
//                 </div>
//               </Link>

//               <button
//                 className="lg:hidden w-10 h-10 rounded-2xl border border-gray-100 bg-gray-50 flex items-center justify-center hover:bg-gray-100 transition-colors"
//                 onClick={() => setIsSidebarOpen(true)}
//               >
//                 <Menu size={20} className="text-gray-700" />
//               </button>
//             </div>
//           </div>
//         </div>
//       </div>

//       {/* ── MOBILE SIDEBAR OVERLAY ── */}
//       <div
//         className={`fixed inset-0 bg-black/50 z-[120] lg:hidden backdrop-blur-sm transition-opacity duration-300 ${isSidebarOpen ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none"}`}
//         onClick={() => setIsSidebarOpen(false)}
//       />

//       {/* ── MOBILE SIDEBAR ── */}
//       <div
//         className={`mh-root fixed top-0 right-0 h-full w-[300px] bg-white z-[130] shadow-2xl lg:hidden flex flex-col mh-sidebar ${isSidebarOpen ? "open" : ""}`}
//       >
//         <div
//           className="px-5 py-4 flex items-center justify-between shrink-0"
//           style={{ borderBottom: "1px solid #f4f4f6" }}
//         >
//           <Logo />
//           <button
//             className="w-8 h-8 rounded-xl bg-gray-100 hover:bg-gray-200 flex items-center justify-center transition-colors"
//             onClick={() => setIsSidebarOpen(false)}
//           >
//             <X size={16} className="text-gray-500" />
//           </button>
//         </div>

//         <div className="flex-1 overflow-y-auto flex flex-col">
//           <div className="px-4 pt-4 pb-2">
//             <div className="flex items-center gap-2.5 bg-gray-50 border border-gray-200 rounded-2xl px-3.5 py-2.5">
//               <Search size={14} className="text-gray-400 shrink-0" />
//               <input
//                 type="text"
//                 placeholder="Search products..."
//                 className="flex-1 bg-transparent text-[13px] outline-none text-gray-700 placeholder-gray-400 font-medium"
//               />
//             </div>
//           </div>

//           {/* Mobile user info */}
//           {isLoggedIn && (
//             <div
//               className="mx-4 mt-2 mb-1 p-3 rounded-2xl flex items-center gap-3"
//               style={{ background: "linear-gradient(135deg,#f0f9ff,#e0f2fe)" }}
//             >
//               <div
//                 className="w-9 h-9 rounded-xl flex items-center justify-center text-white font-black text-sm shrink-0"
//                 style={{
//                   background: "linear-gradient(135deg,#2bbef9,#1a73e8)",
//                 }}
//               >
//                 {avatarLetter}
//               </div>
//               <div className="overflow-hidden">
//                 <p className="text-[13px] font-bold text-gray-800 truncate">
//                   {user?.name}
//                 </p>
//                 <p className="text-[10px] text-gray-400 truncate">
//                   {user?.email}
//                 </p>
//               </div>
//             </div>
//           )}

//           <div className="px-4 pt-2 pb-4">
//             <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-2 px-1">
//               Categories
//             </p>
//             {categories.map((cat) => {
//               const subCats = getSubCats(cat);
//               const isOpen = openCatId === cat._id;
//               return (
//                 <div key={cat._id} className="mb-1">
//                   <div
//                     className={`cat-row flex items-center justify-between px-3 py-3 rounded-xl cursor-pointer ${isOpen ? "active" : ""}`}
//                     onClick={() =>
//                       subCats.length > 0
//                         ? toggleCat(cat._id)
//                         : (setIsSidebarOpen(false),
//                           navigate(`/category/${cat._id}`))
//                     }
//                   >
//                     <span
//                       className={`text-[13.5px] font-bold flex-1 ${isOpen ? "text-blue-600" : "text-gray-700"}`}
//                     >
//                       {cat.name}
//                     </span>
//                     {subCats.length > 0 && (
//                       <div
//                         className={`w-7 h-7 rounded-full flex items-center justify-center transition-all duration-200 ${isOpen ? "bg-blue-100 rotate-180" : "bg-gray-100"}`}
//                       >
//                         <ChevronDown
//                           size={13}
//                           className={isOpen ? "text-blue-600" : "text-gray-400"}
//                         />
//                       </div>
//                     )}
//                   </div>
//                   {subCats.length > 0 && (
//                     <div className={`cat-sub-list ${isOpen ? "open" : ""}`}>
//                       <div className="pl-3 pb-1">
//                         {subCats.map((sub) => (
//                           <Link
//                             key={sub._id}
//                             to={`/category/${cat._id}?subCat=${sub._id}`}
//                             onClick={() => setIsSidebarOpen(false)}
//                             className="sub-row flex items-center gap-3 px-4 py-2.5 rounded-xl text-[12.5px] text-gray-500 font-medium"
//                           >
//                             <span className="w-1.5 h-1.5 rounded-full bg-blue-300 shrink-0" />
//                             {sub.subCat}
//                           </Link>
//                         ))}
//                       </div>
//                     </div>
//                   )}
//                 </div>
//               );
//             })}
//           </div>
//         </div>

//         {/* Mobile Bottom */}
//         <div
//           className="px-4 py-4 shrink-0 space-y-2"
//           style={{ borderTop: "1px solid #f4f4f6" }}
//         >
//           {isLoggedIn ? (
//             <>
//               <Link
//                 to="/orders"
//                 onClick={() => setIsSidebarOpen(false)}
//                 className="flex items-center gap-2 text-gray-600 font-semibold w-full py-2.5 px-3 rounded-xl hover:bg-gray-50 text-[13px] transition-colors"
//               >
//                 <Package size={15} /> Orders
//               </Link>
//               <button
//                 onClick={handleLogout}
//                 className="flex items-center gap-2 text-red-500 font-bold w-full py-2.5 px-3 rounded-xl hover:bg-red-50 transition-colors text-[13px]"
//               >
//                 <LogOut size={15} /> Sign Out
//               </button>
//             </>
//           ) : (
//             <Link
//               to="/login"
//               onClick={() => setIsSidebarOpen(false)}
//               className="flex items-center justify-center gap-2 text-white font-bold w-full py-3 rounded-2xl text-[13px] transition-all active:scale-95"
//               style={{ background: "linear-gradient(135deg,#2bbef9,#1a73e8)" }}
//             >
//               <User size={15} /> Sign In
//             </Link>
//           )}
//         </div>
//       </div>
//     </>
//   );
// };

// export default MiddleHeader;
