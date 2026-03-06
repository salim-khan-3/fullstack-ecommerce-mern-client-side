import React from "react";
import { ArrowUpRight, ChevronLeft, ChevronRight } from "lucide-react";

const SectionHeader = ({ onPrev, onNext }) => {
  return (
    <div className="flex items-end justify-between mb-8">
      <div>
        <div className="flex items-center gap-2 mb-2">
          <div className="w-6 h-[2px] bg-red-500 rounded-full" />
          <span className="text-[10px] font-bold tracking-[3px] text-red-500 uppercase">
            Curated Selection
          </span>
        </div>
        <div className="fp-bebas leading-none">
          <div className="text-[42px] text-gray-900 tracking-wide">FEATURED</div>
          <div
            className="text-[42px] tracking-wide"
            style={{ WebkitTextStroke: "1.5px #111", color: "transparent" }}
          >
            PRODUCTS
          </div>
        </div>
        <p className="text-xs text-gray-400 mt-2 leading-relaxed max-w-[260px]">
          Hand-picked deals you won't find anywhere else — updated weekly.
        </p>
      </div>

      <div className="flex flex-col items-end gap-3 pb-1">
        <button className="flex items-center gap-1.5 text-[11px] font-bold tracking-wider text-gray-700 uppercase hover:text-gray-900 transition-colors duration-150">
          View All Collection <ArrowUpRight size={13} />
        </button>
        <div className="flex items-center gap-2">
          <div className="w-16 h-[2px] bg-gray-200 rounded-full" />
          <button onClick={onPrev} className="w-8 h-8 rounded-full border border-gray-200 flex items-center justify-center text-gray-500 hover:bg-gray-900 hover:text-white transition-all">
            <ChevronLeft size={15} />
          </button>
          <button onClick={onNext} className="w-8 h-8 rounded-full border border-gray-200 flex items-center justify-center text-gray-500 hover:bg-gray-900 hover:text-white transition-all">
            <ChevronRight size={15} />
          </button>
        </div>
      </div>
    </div>
  );
};

export default SectionHeader;