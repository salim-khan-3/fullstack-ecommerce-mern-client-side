import React, { useCallback, useEffect, useState } from "react";
import useEmblaCarousel from "embla-carousel-react";
import { ChevronLeft, ChevronRight, LayoutGrid } from "lucide-react";
import { getAllCategoriesForUI } from "../../../utils/api/categoryApi";

const bgGradients = [
  { bg: "from-rose-50 to-pink-100", icon: "bg-rose-100", border: "hover:border-rose-200", dot: "bg-rose-400" },
  { bg: "from-blue-50 to-indigo-100", icon: "bg-blue-100", border: "hover:border-blue-200", dot: "bg-blue-400" },
  { bg: "from-amber-50 to-orange-100", icon: "bg-amber-100", border: "hover:border-amber-200", dot: "bg-amber-400" },
  { bg: "from-emerald-50 to-green-100", icon: "bg-emerald-100", border: "hover:border-emerald-200", dot: "bg-emerald-400" },
  { bg: "from-purple-50 to-violet-100", icon: "bg-purple-100", border: "hover:border-purple-200", dot: "bg-purple-400" },
  { bg: "from-cyan-50 to-teal-100", icon: "bg-cyan-100", border: "hover:border-cyan-200", dot: "bg-cyan-400" },
  { bg: "from-lime-50 to-green-100", icon: "bg-lime-100", border: "hover:border-lime-200", dot: "bg-lime-400" },
  { bg: "from-fuchsia-50 to-pink-100", icon: "bg-fuchsia-100", border: "hover:border-fuchsia-200", dot: "bg-fuchsia-400" },
];

const FeaturedCategories = () => {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);

  const [emblaRef, emblaApi] = useEmblaCarousel({
    align: "start",
    loop: false,
    dragFree: true,
    slidesToScroll: 1,
  });

  const scrollPrev = useCallback(() => emblaApi && emblaApi.scrollPrev(), [emblaApi]);
  const scrollNext = useCallback(() => emblaApi && emblaApi.scrollNext(), [emblaApi]);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const data = await getAllCategoriesForUI();
        setCategories(data);
      } catch (err) {
        console.error("Failed to load categories:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchCategories();
  }, []);

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;500;600;700&display=swap');
        .cat-section { font-family: 'DM Sans', sans-serif; }
        .cat-card {
          transition: all 0.35s cubic-bezier(0.34, 1.56, 0.64, 1);
        }
        .cat-card:hover {
          transform: translateY(-6px) scale(1.03);
        }
        .cat-img {
          transition: transform 0.4s cubic-bezier(0.34, 1.56, 0.64, 1);
        }
        .cat-card:hover .cat-img {
          transform: scale(1.12) rotate(-3deg);
        }
        .skeleton-wave {
          background: linear-gradient(90deg, #f0f0f0 25%, #e0e0e0 50%, #f0f0f0 75%);
          background-size: 200% 100%;
          animation: wave 1.5s infinite;
        }
        @keyframes wave {
          0% { background-position: 200% 0; }
          100% { background-position: -200% 0; }
        }
        .scroll-btn {
          transition: all 0.25s ease;
        }
        .scroll-btn:hover {
          transform: scale(1.1);
          box-shadow: 0 8px 25px rgba(0,0,0,0.15);
        }
        .title-line {
          width: 40px;
          height: 3px;
          border-radius: 2px;
          background: linear-gradient(90deg, #3b82f6, #8b5cf6);
        }
      `}</style>

      <section className="cat-section py-10 px-8 md:px-6">
        <div className="container mx-auto">

          {/* Header */}
          <div className="flex items-end justify-between mb-8">
            <div>
              <div className="flex items-center gap-2 mb-2">
                <div className="title-line" />
                <span className="text-xs font-semibold text-blue-500 uppercase tracking-widest">Browse</span>
              </div>
              <h2 className="text-2xl md:text-3xl font-bold text-gray-900 leading-tight">
                Featured{" "}
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-500 to-violet-500">
                  Categories
                </span>
              </h2>
              <p className="text-sm text-gray-400 mt-1 font-medium">Discover products across all categories</p>
            </div>

            <div className="hidden md:flex items-center gap-2">
              <button onClick={scrollPrev} className="scroll-btn w-10 h-10 rounded-xl bg-white border border-gray-200 shadow-sm flex items-center justify-center text-gray-500 hover:text-blue-600 hover:border-blue-200">
                <ChevronLeft size={18} />
              </button>
              <button onClick={scrollNext} className="scroll-btn w-10 h-10 rounded-xl bg-white border border-gray-200 shadow-sm flex items-center justify-center text-gray-500 hover:text-blue-600 hover:border-blue-200">
                <ChevronRight size={18} />
              </button>
            </div>
          </div>

          {/* Carousel */}
          {loading ? (
            <div className="flex gap-4 overflow-hidden">
              {[...Array(7)].map((_, i) => (
                <div key={i} className="flex-[0_0_42%] sm:flex-[0_0_22%] md:flex-[0_0_16%] lg:flex-[0_0_13%]">
                  <div className="skeleton-wave h-44 rounded-2xl" />
                  <div className="skeleton-wave h-3 rounded-full mt-3 mx-4" />
                </div>
              ))}
            </div>
          ) : (
            <div className="relative">
              <div className="overflow-hidden" ref={emblaRef}>
                <div className="flex gap-3 md:gap-4">
                  {categories.map((cat, index) => {
                    const theme = bgGradients[index % bgGradients.length];
                    return (
                      <div
                        key={cat._id}
                        className="flex-[0_0_42%] sm:flex-[0_0_22%] md:flex-[0_0_16%] lg:flex-[0_0_13%] min-w-0"
                      >
                        <div
                          className={`cat-card bg-gradient-to-b ${theme.bg} rounded-2xl border border-transparent ${theme.border} cursor-pointer overflow-hidden shadow-sm hover:shadow-xl`}
                        >
                          {/* Image area */}
                          <div className="relative pt-5 px-4 flex items-center justify-center h-28">
                            <div className={`absolute w-20 h-20 rounded-full ${theme.icon} opacity-60`} />
                            <div className="relative w-16 h-16 flex items-center justify-center">
                              <img
                                src={cat.images?.[0] || "/placeholder.png"}
                                alt={cat.name}
                                className="cat-img w-full h-full object-contain drop-shadow-md"
                                onError={(e) => {
                                  e.target.onerror = null;
                                  e.target.style.display = "none";
                                }}
                              />
                            </div>
                          </div>

                          {/* Name */}
                          <div className="px-3 pb-4 pt-2 text-center">
                            <p className="text-xs md:text-sm font-bold text-gray-700 truncate leading-tight">
                              {cat.name}
                            </p>
                            <div className="flex items-center justify-center gap-1 mt-1.5">
                              <div className={`w-1.5 h-1.5 rounded-full ${theme.dot}`} />
                              <span className="text-[10px] text-gray-400 font-medium">Shop Now</span>
                            </div>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Mobile arrows */}
              <button
                onClick={scrollPrev}
                className="md:hidden scroll-btn absolute -left-3 top-1/2 -translate-y-1/2 w-8 h-8 bg-white shadow-lg rounded-full flex items-center justify-center text-gray-600 border border-gray-100 z-10"
              >
                <ChevronLeft size={16} />
              </button>
              <button
                onClick={scrollNext}
                className="md:hidden scroll-btn absolute -right-3 top-1/2 -translate-y-1/2 w-8 h-8 bg-white shadow-lg rounded-full flex items-center justify-center text-gray-600 border border-gray-100 z-10"
              >
                <ChevronRight size={16} />
              </button>
            </div>
          )}

          {/* View All */}
          {!loading && categories.length > 0 && (
            <div className="flex justify-center mt-8">
              <button className="flex items-center gap-2 text-sm font-semibold text-gray-500 hover:text-blue-600 transition-colors group">
                <LayoutGrid size={15} />
                View All Categories
                <ChevronRight size={14} className="group-hover:translate-x-1 transition-transform" />
              </button>
            </div>
          )}
        </div>
      </section>
    </>
  );
};

export default FeaturedCategories;