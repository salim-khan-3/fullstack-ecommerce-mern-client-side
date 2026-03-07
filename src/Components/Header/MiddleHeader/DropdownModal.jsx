import { useContext, useState } from "react";
import {
  Menu,
  Search,
  ShoppingBag,
  User,
  X,
  ChevronDown,
  LogOut,
} from "lucide-react";
import { Link } from "react-router-dom";
import DropdownModal from "./DropdownModal";
import Logo from "../../layouts/Logo/Logo";
import { MyContext } from "../../../App";

const MiddleHeader = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const { isLogin, setIsLogin } = useContext(MyContext);
  const navItemClass =
    "flex items-center justify-between py-3.5 text-sm font-semibold text-gray-700 hover:text-red-600 transition-colors border-b border-gray-50";
  const dropdownItemClass =
    "block py-2.5 pl-4 text-sm text-gray-500 hover:text-red-600 border-l border-gray-100 ml-2";

  return (
    <div className="bg-white w-full border-b border-gray-100 z-50">
      <div className="container mx-auto px-4 py-4 lg:py-6 flex items-center justify-between gap-5">
        {/* 1. Logo Section (Always Left) */}
        <div className="flex items-center gap-8">
          <Logo />
          {/* Desktop Dropdown */}
          <div className="hidden lg:block">
            <DropdownModal />
          </div>
        </div>

        {/* 2. Search Section (Desktop Only) */}
        <div className="hidden flex-1 md:flex relative w-full max-w-[600px] mx-auto">
          <input
            type="text"
            placeholder="Search for products..."
            className="w-full bg-[#f3f4f7] border border-gray-100 rounded-lg py-3 px-5 text-[15px] outline-none focus:bg-white focus:ring-1 focus:ring-red-200 transition-all"
          />
          <Search
            className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400"
            size={20}
          />
        </div>

        {/* 3. Action Icons (Cart & Menu on Right for Mobile) */}
        <div className="flex items-center gap-2 sm:gap-4 lg:gap-6">
          <div className="hidden lg:block">
            {isLogin ? (
              <div className="p-2.5 border border-gray-200 rounded-full cursor-pointer hover:bg-gray-50">
                <User className="text-gray-700" size={20} />
              </div>
            ) : (
              <Link
                to="/login"
                className="px-4 py-2 border border-red-500 text-red-600 rounded-md text-sm font-semibold hover:bg-red-50 transition-colors"
              >
                Sign In
              </Link>
            )}
          </div>

          {/* Cart Icon (Always Left of Menu on Mobile) */}
          <div className="flex items-center gap-3 cursor-pointer group">
            <div className="relative p-2.5 bg-red-50 rounded-full group-hover:bg-red-100 transition-colors">
              <Link to={"./cart"}>
                <ShoppingBag size={22} className="text-red-600" />
                <span className="absolute -top-1 -right-1 bg-red-600 text-white text-[10px] font-bold rounded-full w-5 h-5 flex items-center justify-center border-2 border-white">
                  2
                </span>
              </Link>
            </div>
            <div className="hidden lg:block text-sm font-bold text-gray-800">
              $0.00
            </div>
          </div>

          {/* Mobile Menu Icon (Always Right) */}
          <div className="lg:hidden p-2 ml-1">
            <Menu
              className="text-gray-700 cursor-pointer"
              size={28}
              onClick={() => setIsSidebarOpen(true)}
            />
          </div>
        </div>
      </div>

      {/* --- MOBILE SIDEBAR --- */}
      {/* Overlay */}
      {isSidebarOpen && (
        <div
          className="fixed inset-0 bg-black/60 z-[60] lg:hidden backdrop-blur-sm transition-opacity"
          onClick={() => setIsSidebarOpen(false)}
        />
      )}

      {/* Sidebar Content */}
      <div
        className={`fixed top-0 right-0 h-full w-[280px] bg-white z-[70] shadow-2xl transform transition-transform duration-300 ease-in-out lg:hidden overflow-y-auto ${isSidebarOpen ? "translate-x-0" : "translate-x-full"}`}
      >
        <div className="p-6 flex flex-col h-full">
          {/* Close Button & Logo */}
          <div className="flex items-center justify-between mb-8 border-b pb-4">
            <Logo />
            <div
              className="p-2 hover:bg-gray-100 rounded-full cursor-pointer"
              onClick={() => setIsSidebarOpen(false)}
            >
              <X className="text-gray-500" size={24} />
            </div>
          </div>

          {/* Sidebar Search */}
          <div className="relative mb-6">
            <DropdownModal></DropdownModal>
          </div>

          {/* Navigation Links */}
          <nav className="flex-1 overflow-y-auto">
            <ul className="flex flex-col">
              <li>
                <Link to="/" className={navItemClass}>
                  HOME <ChevronDown size={14} className="opacity-50" />
                </Link>
                <div className="bg-gray-50/50">
                  <Link to="/home-1" className={dropdownItemClass}>
                    Home Style 1
                  </Link>
                  <Link to="/home-2" className={dropdownItemClass}>
                    Home Style 2
                  </Link>
                </div>
              </li>
              <li>
                <Link to="/men" className={navItemClass}>
                  MEN <ChevronDown size={14} className="opacity-50" />
                </Link>
              </li>
              <li>
                <Link to="/women" className={navItemClass}>
                  WOMEN <ChevronDown size={14} className="opacity-50" />
                </Link>
              </li>
              <li>
                <Link to="/beauty" className={navItemClass}>
                  BEAUTY
                </Link>
              </li>
              <li>
                <Link to="/watches" className={navItemClass}>
                  WATCHES
                </Link>
              </li>
              <li>
                <Link to="/kids" className={navItemClass}>
                  KIDS
                </Link>
              </li>
              <li>
                <Link to="/blog" className={navItemClass}>
                  BLOG
                </Link>
              </li>
              <li>
                <Link to="/contact" className={navItemClass}>
                  CONTACT
                </Link>
              </li>
            </ul>
          </nav>

          {/* Logout Button */}
          <div className="mt-6 border-t pt-4">
            <button className="flex items-center gap-3 text-gray-600 font-bold w-full py-3 px-2 hover:text-red-600 transition-colors">
              <LogOut size={20} />
              LOGOUT
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MiddleHeader;


