import { useContext, useState, useEffect, useRef } from "react";
import {
  ShoppingBag, User, MapPin, ChevronDown, X,
  LogOut, Heart, Menu, Package, UserCircle,
} from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import Logo from "../../layouts/Logo/Logo";
import { getAllCategoriesForUI } from "../../../utils/api/categoryApi";
import { getAllSubCategories } from "../../../utils/api/subCategoryApi";
import { useAuth } from "../../../context/AuthContext";
import { useCart } from "../../../context/CartContext";
import { StoreContext } from "../../../context/StoreContext";
import SearchBar from "./SearchBar";
import useRequireAuth from "../../../context/useRequireAuth/useRequireAuth";
// import useRequireAuth from "../../../hooks/useRequireAuth";

const MiddleHeader = () => {
  const [isSidebarOpen, setIsSidebarOpen]   = useState(false);
  const [openCatId, setOpenCatId]           = useState(null);
  const [categories, setCategories]         = useState([]);
  const [subCategories, setSubCategories]   = useState([]);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  const { isLoggedIn, user, logout, token } = useAuth();
  const { cartCount, cartTotal, resetCart } = useCart();
  const { myListCount, fetchMyList, resetMyList } = useContext(StoreContext);

  const navigate        = useNavigate();
  const dropdownRef     = useRef(null);
  const guardedNavigate = useRequireAuth(); // 👈 protected navigation hook

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

  useEffect(() => {
    const handler = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setIsDropdownOpen(false);
      }
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  useEffect(() => {
    if (isLoggedIn && token) fetchMyList(token);
  }, [isLoggedIn]);

  const getSubCats = (cat) =>
    subCategories.filter((s) => {
      const catId = s.category?._id || s.category;
      return catId?.toString() === cat._id?.toString();
    });

  const toggleCat = (id) => setOpenCatId((prev) => (prev === id ? null : id));

  const handleLogout = () => {
    logout({ resetCart, resetMyList });
    setIsDropdownOpen(false);
    setIsSidebarOpen(false);
    navigate("/");
  };

  const avatarLetter = user?.name?.charAt(0).toUpperCase() || "U";

  return (
    <>
      {/* ── MAIN HEADER BAR ── */}
      <div className="bg-white w-full sticky top-0 z-[110] border-b border-gray-100 shadow-sm">
        <div className="container mx-auto px-5">
          <div className="flex items-center gap-4 py-3.5">
            <div className="shrink-0"><Logo /></div>

            {/* Location */}
            <button className="hidden xl:flex items-center gap-2.5 px-3.5 py-2.5 rounded-2xl border border-gray-100 bg-gray-50 shrink-0 hover:bg-sky-50 hover:border-sky-200 transition-all duration-200" style={{ minWidth: 160 }}>
              <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-sky-100 to-sky-200 flex items-center justify-center shrink-0">
                <MapPin size={14} className="text-sky-500" />
              </div>
              <div className="text-left">
                <p className="text-[9.5px] font-semibold text-gray-400 uppercase tracking-widest leading-none mb-0.5">Deliver to</p>
                <p className="text-[13px] font-bold text-gray-800 leading-none flex items-center gap-1">
                  Bangladesh <ChevronDown size={11} className="text-gray-400" />
                </p>
              </div>
            </button>

            {/* Search */}
            <SearchBar />

            {/* Right actions */}
            <div className="flex items-center gap-2 shrink-0 ml-auto">

              {/* Wishlist — login না থাকলে login page এ redirect */}
              <button
                onClick={() => guardedNavigate("/my-list")}
                className="hidden lg:flex w-10 h-10 rounded-2xl border border-gray-100 bg-gray-50 items-center justify-center relative hover:bg-rose-50 hover:border-rose-200 transition-all duration-200"
              >
                <Heart size={18} className={myListCount > 0 ? "text-rose-500" : "text-gray-400"} />
                {myListCount > 0 && (
                  <span className="absolute -top-1 -right-1 w-[18px] h-[18px] bg-rose-500 text-white text-[9px] font-black rounded-full flex items-center justify-center border-2 border-white">
                    {myListCount}
                  </span>
                )}
              </button>

              <div className="hidden lg:block w-px h-7 bg-gray-100 mx-0.5" />

              {/* User Dropdown */}
              <div className="hidden lg:block relative" ref={dropdownRef}>
                {isLoggedIn ? (
                  <>
                    <button
                      onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                      className="flex items-center gap-2.5 pl-2.5 pr-3.5 py-2 rounded-2xl border border-gray-100 bg-gray-50 hover:bg-sky-50 hover:border-sky-200 transition-all duration-200"
                    >
                      <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-sky-400 to-blue-600 flex items-center justify-center text-white text-sm font-black shadow-sm shrink-0 overflow-hidden">
                        {user?.image
                          ? <img src={user.image} alt="avatar" className="w-full h-full object-cover" />
                          : avatarLetter
                        }
                      </div>
                      <div className="text-left">
                        <p className="text-[9px] text-gray-400 font-semibold uppercase tracking-wider leading-none">Hello,</p>
                        <p className="text-[12.5px] font-bold text-gray-800 leading-none flex items-center gap-1 max-w-[90px] truncate">
                          {user?.name}
                          <ChevronDown size={10} className={`text-gray-400 transition-transform duration-200 ${isDropdownOpen ? "rotate-180" : ""}`} />
                        </p>
                      </div>
                    </button>

                    {isDropdownOpen && (
                      <div className="absolute right-0 mt-2 w-56 bg-white rounded-2xl shadow-2xl border border-gray-100 overflow-hidden z-50 animate-in fade-in slide-in-from-top-2 duration-200">
                        <div className="p-4 border-b border-gray-50 flex items-center gap-3 bg-gradient-to-br from-sky-50 to-sky-100">
                          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-sky-400 to-blue-600 flex items-center justify-center text-white font-black text-base shadow-sm shrink-0 overflow-hidden">
                            {user?.image
                              ? <img src={user.image} alt="avatar" className="w-full h-full object-cover" />
                              : avatarLetter
                            }
                          </div>
                          <div className="overflow-hidden">
                            <p className="text-sm font-bold text-gray-800 truncate">{user?.name}</p>
                            <p className="text-[10px] text-gray-400 truncate">{user?.email}</p>
                          </div>
                        </div>
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
                    className="flex items-center gap-2 pl-3 pr-4 py-2.5 rounded-2xl border border-gray-100 bg-gray-50 text-[12.5px] font-bold text-gray-700 hover:bg-sky-50 hover:border-sky-200 transition-all duration-200">
                    <User size={15} className="text-sky-500" /> Sign In
                  </Link>
                )}
              </div>

              {/* Cart — login না থাকলে login page এ redirect */}
              <button
                onClick={() => guardedNavigate("/cart")}
                className="flex items-center gap-2.5 pl-2.5 pr-4 py-2 rounded-2xl border border-gray-100 bg-gray-50 hover:bg-gray-100 transition-all duration-200 shadow-sm"
              >
                <div className="relative w-8 h-8 rounded-xl bg-white flex items-center justify-center shrink-0 border border-gray-100">
                  <ShoppingBag size={16} className="text-gray-600" />
                  {cartCount > 0 && (
                    <span className="absolute -top-1.5 -right-1.5 w-[17px] h-[17px] bg-rose-500 text-white text-[9px] font-black rounded-full flex items-center justify-center border border-white">
                      {cartCount}
                    </span>
                  )}
                </div>
                <div className="hidden lg:block">
                  <p className="text-[13px] font-black text-gray-800 leading-none">
                    ৳{cartTotal?.toLocaleString()}
                  </p>
                </div>
              </button>

              {/* Mobile menu button */}
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

      {/* ── MOBILE OVERLAY ── */}
      <div
        className={`fixed inset-0 bg-black/50 z-[120] lg:hidden backdrop-blur-sm transition-opacity duration-300 ${isSidebarOpen ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none"}`}
        onClick={() => setIsSidebarOpen(false)}
      />

      {/* ── MOBILE SIDEBAR ── */}
      <div className={`fixed top-0 right-0 h-full w-[300px] bg-white z-[130] shadow-2xl lg:hidden flex flex-col transition-transform duration-300 ease-in-out ${isSidebarOpen ? "translate-x-0" : "translate-x-full"}`}>

        <div className="px-5 py-4 flex items-center justify-between shrink-0 border-b border-gray-100">
          <Logo />
          <button
            className="w-8 h-8 rounded-xl bg-gray-100 hover:bg-gray-200 flex items-center justify-center transition-colors"
            onClick={() => setIsSidebarOpen(false)}
          >
            <X size={16} className="text-gray-500" />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto flex flex-col no-scrollbar">

          <div className="px-4 pt-4 pb-2">
            <div className="flex items-center gap-2.5 bg-gray-50 border border-gray-200 rounded-2xl px-3.5 py-2.5">
              <Package size={14} className="text-gray-400 shrink-0" />
              <input type="text" placeholder="Search products..."
                className="flex-1 bg-transparent text-[13px] outline-none text-gray-700 placeholder-gray-400 font-medium" />
            </div>
          </div>

          {isLoggedIn && (
            <div className="mx-4 mt-2 mb-1 p-3 rounded-2xl flex items-center gap-3 bg-gradient-to-br from-sky-50 to-sky-100">
              <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-sky-400 to-blue-600 flex items-center justify-center text-white font-black text-sm shrink-0 overflow-hidden">
                {user?.image
                  ? <img src={user.image} alt="avatar" className="w-full h-full object-cover" />
                  : avatarLetter
                }
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
              const isOpen  = openCatId === cat._id;
              return (
                <div key={cat._id} className="mb-1">
                  <div
                    className={`flex items-center justify-between px-3 py-3 rounded-xl cursor-pointer transition-colors ${isOpen ? "bg-blue-50" : "hover:bg-gray-50"}`}
                    onClick={() =>
                      subCats.length > 0
                        ? toggleCat(cat._id)
                        : (setIsSidebarOpen(false), navigate(`/category/${cat._id}`))
                    }
                  >
                    <span className={`text-[13.5px] font-bold flex-1 ${isOpen ? "text-blue-600" : "text-gray-700"}`}>
                      {cat.name}
                    </span>
                    {subCats.length > 0 && (
                      <div className={`w-7 h-7 rounded-full flex items-center justify-center transition-all duration-200 ${isOpen ? "bg-blue-100 rotate-180" : "bg-gray-100"}`}>
                        <ChevronDown size={13} className={isOpen ? "text-blue-600" : "text-gray-400"} />
                      </div>
                    )}
                  </div>
                  {subCats.length > 0 && isOpen && (
                    <div className="pl-3 pb-1">
                      {subCats.map((sub) => (
                        <Link key={sub._id}
                          to={`/category/${cat._id}?subCat=${sub._id}`}
                          onClick={() => setIsSidebarOpen(false)}
                          className="flex items-center gap-3 px-4 py-2.5 rounded-xl text-[12.5px] text-gray-500 font-medium hover:bg-blue-50 hover:text-blue-600 transition-colors"
                        >
                          <span className="w-1.5 h-1.5 rounded-full bg-blue-300 shrink-0" />
                          {sub.subCat}
                        </Link>
                      ))}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>

        <div className="px-4 py-4 shrink-0 space-y-2 border-t border-gray-100">
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
              className="flex items-center justify-center gap-2 text-white font-bold w-full py-3 rounded-2xl text-[13px] transition-all active:scale-95 bg-gradient-to-r from-sky-400 to-blue-600">
              <User size={15} /> Sign In
            </Link>
          )}
        </div>
      </div>
    </>
  );
};

export default MiddleHeader;






