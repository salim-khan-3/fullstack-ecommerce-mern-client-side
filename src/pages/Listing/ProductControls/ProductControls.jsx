
import React, { useState, useEffect, useRef } from "react";
import {
  LayoutGrid,
  List,
  Grid3X3,
  TableCellsSplit,
  ChevronDown,
} from "lucide-react";

const ProductControls = ({ onChangeColumns, columns }) => {
  const [sortOpen, setSortOpen] = useState(false);
  const [showOpen, setShowOpen] = useState(false);
  const [sortBy, setSortBy] = useState("Sort by latest");
  const [showCount, setShowCount] = useState(12);

  const sortRef = useRef(null);
  const showRef = useRef(null);

  // outside click close
  useEffect(() => {
    const handler = (e) => {
      if (sortRef.current && !sortRef.current.contains(e.target)) setSortOpen(false);
      if (showRef.current && !showRef.current.contains(e.target)) setShowOpen(false);
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  const activeClass =
    "text-[#2bbef9] bg-white shadow-sm border border-gray-100 rounded-md";

  const sortOptions = [
    "Sort by latest",
    "Price: Low to High",
    "Price: High to Low",
    "Rating: High to Low",
  ];
  const showOptions = [12, 24, 36, 48];

  return (
    <div className="flex flex-wrap justify-between items-center py-2.5 px-3 sm:px-5 bg-[#f8f9fa] border border-gray-100 rounded-xl mb-4 sm:mb-6 relative z-30 gap-y-2">

      {/* Column icons */}
      <div className="flex items-center gap-1">
        <button
          onClick={() => onChangeColumns(1)}
          className={`p-1.5 sm:p-2 transition-colors ${columns === 1 ? activeClass : "text-gray-400 hover:text-[#2bbef9]"}`}
        >
          <List size={18} />
        </button>
        <button
          onClick={() => onChangeColumns(2)}
          className={`p-1.5 sm:p-2 transition-colors ${columns === 2 ? activeClass : "text-gray-400 hover:text-[#2bbef9]"}`}
        >
          <LayoutGrid size={18} />
        </button>
        <button
          onClick={() => onChangeColumns(3)}
          className={`p-1.5 sm:p-2 transition-colors ${columns === 3 ? activeClass : "text-gray-400 hover:text-[#2bbef9]"}`}
        >
          <Grid3X3 size={18} />
        </button>
        <button
          onClick={() => onChangeColumns(4)}
          className={`p-1.5 sm:p-2 transition-colors ${columns === 4 ? activeClass : "text-gray-400 hover:text-[#2bbef9]"}`}
        >
          <TableCellsSplit size={18} />
        </button>
      </div>

      {/* Dropdowns */}
      <div className="flex items-center gap-3 sm:gap-6">

        {/* Sort Dropdown */}
        <div className="relative" ref={sortRef}>
          <div
            onClick={() => { setSortOpen(!sortOpen); setShowOpen(false); }}
            className="flex items-center gap-1.5 cursor-pointer"
          >
            {/* Mobile: short label, Desktop: full label */}
            <span className="text-gray-500 text-[12px] sm:text-[14px] whitespace-nowrap">
              <span className="hidden sm:inline">{sortBy}</span>
              <span className="inline sm:hidden">Sort</span>
            </span>
            <ChevronDown
              size={14}
              className={`text-gray-400 transition-transform ${sortOpen ? "rotate-180" : ""}`}
            />
          </div>

          {sortOpen && (
            <div className="absolute top-full right-0 mt-2 w-44 sm:w-48 bg-white border border-gray-100 shadow-xl rounded-lg py-2 z-50">
              {sortOptions.map((option) => (
                <div
                  key={option}
                  onClick={() => { setSortBy(option); setSortOpen(false); }}
                  className={`px-4 py-2 text-[12px] sm:text-sm cursor-pointer transition-colors ${
                    sortBy === option
                      ? "text-[#2bbef9] bg-[#2bbef9]/10 font-semibold"
                      : "text-gray-600 hover:bg-[#2bbef9]/10 hover:text-[#2bbef9]"
                  }`}
                >
                  {option}
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Show Count Dropdown */}
        <div className="relative" ref={showRef}>
          <div
            onClick={() => { setShowOpen(!showOpen); setSortOpen(false); }}
            className="flex items-center gap-1.5 cursor-pointer"
          >
            <span className="text-gray-500 text-[12px] sm:text-[14px] whitespace-nowrap">
              <span className="hidden sm:inline">Show </span>
              <span className="font-bold text-gray-800">{showCount}</span>
            </span>
            <ChevronDown
              size={14}
              className={`text-gray-400 transition-transform ${showOpen ? "rotate-180" : ""}`}
            />
          </div>

          {showOpen && (
            <div className="absolute top-full right-0 mt-2 w-20 bg-white border border-gray-100 shadow-xl rounded-lg py-2 z-50">
              {showOptions.map((num) => (
                <div
                  key={num}
                  onClick={() => { setShowCount(num); setShowOpen(false); }}
                  className={`px-4 py-2 text-[12px] sm:text-sm cursor-pointer text-center transition-colors ${
                    showCount === num
                      ? "text-[#2bbef9] bg-[#2bbef9]/10 font-semibold"
                      : "text-gray-600 hover:bg-[#2bbef9]/10 hover:text-[#2bbef9]"
                  }`}
                >
                  {num}
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ProductControls;