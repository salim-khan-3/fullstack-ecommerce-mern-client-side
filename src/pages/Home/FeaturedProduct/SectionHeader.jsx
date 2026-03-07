import React from "react";
import { ArrowUpRight, ChevronLeft, ChevronRight } from "lucide-react";

const SectionHeader = ({ onPrev, onNext }) => {
  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;500;600;700;800&display=swap');
        .sh-dm { font-family: 'DM Sans', sans-serif; }
      `}</style>

      <div className="sh-dm flex items-center justify-between mb-8 p-4 md:p-2 lg:p-0">
        {/* Left */}
        <div className="flex items-center gap-4">
          {/* Gradient vertical bar */}
          <div className="w-1 h-12 rounded-full bg-gradient-to-b from-blue-500 to-violet-500" />

          <div>
            {/* Tag */}
            <div className="flex items-center gap-2 mb-1">
              <span className="text-[9px] font-black uppercase tracking-[3px] text-blue-500 bg-blue-50 px-2.5 py-0.5 rounded-full border border-blue-100">
                Curated Selection
              </span>
            </div>

            {/* Title */}
            <h2 className="text-[22px] font-black text-gray-900 leading-tight tracking-tight">
              Featured{" "}
              <span className="bg-gradient-to-r from-blue-500 to-violet-500 bg-clip-text text-transparent">
                Products
              </span>
            </h2>

            <p className="text-[11px] text-gray-400 font-medium mt-0.5">
              Hand-picked deals you won't find anywhere else.
            </p>
          </div>
        </div>

        {/* Right */}
        <div className="flex items-center gap-3">
          <button className="hidden sm:flex items-center gap-1.5 text-[11px] font-bold tracking-wider text-gray-500 uppercase hover:text-gray-900 transition-colors duration-150 mr-2">
            View All <ArrowUpRight size={13} />
          </button>
          <button
            onClick={onPrev}
            className="w-8 h-8 rounded-full border border-gray-200 flex items-center justify-center text-gray-500 hover:bg-gray-900 hover:border-gray-900 hover:text-white transition-all duration-200"
          >
            <ChevronLeft size={15} />
          </button>
          <button
            onClick={onNext}
            className="w-8 h-8 rounded-full border border-gray-200 flex items-center justify-center text-gray-500 hover:bg-gray-900 hover:border-gray-900 hover:text-white transition-all duration-200"
          >
            <ChevronRight size={15} />
          </button>
        </div>
      </div>
    </>
  );
};

export default SectionHeader;