import React, { useCallback, useEffect, useState } from "react";
import useEmblaCarousel from "embla-carousel-react";
import Autoplay from "embla-carousel-autoplay";
import { ChevronLeft, ChevronRight, Sparkles, ArrowRight } from "lucide-react";
import { getAllBannersApi } from "../../../utils/api/Homebannerapi";

const accentSlots = [
  { accent: "#3b82f6", accentRgb: "59,130,246" },
  { accent: "#f97316", accentRgb: "249,115,22" },
  { accent: "#8b5cf6", accentRgb: "139,92,246" },
  { accent: "#10b981", accentRgb: "16,185,129" },
  { accent: "#ef4444", accentRgb: "239,68,68"  },
];

const Banner = () => {
  const [slides, setSlides] = useState([]);
  const [loading, setLoading] = useState(true);

  const [emblaRef, emblaApi] = useEmblaCarousel({ loop: true }, [
    Autoplay({ delay: 5500, stopOnInteraction: false }),
  ]);
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [isAnimating, setIsAnimating] = useState(false);

  useEffect(() => { fetchBanners(); }, []);

  const fetchBanners = async () => {
    try {
      const data = await getAllBannersApi();
      const banners = (data.banners || []).map((b, i) => ({
        id: b._id,
        bg: b.image,
        ...accentSlots[i % accentSlots.length],
      }));
      setSlides(banners);
    } catch {
      setSlides([]);
    } finally {
      setLoading(false);
    }
  };

  const scrollPrev = useCallback(() => emblaApi && emblaApi.scrollPrev(), [emblaApi]);
  const scrollNext = useCallback(() => emblaApi && emblaApi.scrollNext(), [emblaApi]);

  const onSelect = useCallback(() => {
    if (!emblaApi) return;
    setIsAnimating(true);
    setTimeout(() => setIsAnimating(false), 100);
    setSelectedIndex(emblaApi.selectedScrollSnap());
  }, [emblaApi]);

  useEffect(() => {
    if (!emblaApi) return;
    onSelect();
    emblaApi.on("select", onSelect);
  }, [emblaApi, onSelect]);

  const currentSlide = slides[selectedIndex] || accentSlots[0];

  // ── Skeleton ──
  if (loading) {
    return (
      <div
        className="relative w-full mt-10 overflow-hidden rounded-2xl lg:rounded-3xl bg-gray-200 animate-pulse"
        style={{ height: "clamp(300px, 55vw, 680px)" }}
      />
    );
  }

  // ── No banners ──
  if (slides.length === 0) return null;

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:wght@700;900&family=DM+Sans:wght@300;400;500;600&display=swap');
        .banner-title { font-family: 'Playfair Display', serif; line-height: 1.05; }
        .banner-body  { font-family: 'DM Sans', sans-serif; }
        .slide-content { transition: opacity 0.6s ease, transform 0.6s ease; }
        .slide-content.animating { opacity: 0; transform: translateY(20px); }
        .slide-content.ready    { opacity: 1; transform: translateY(0); }
        .stat-card {
          backdrop-filter: blur(12px);
          background: rgba(255,255,255,0.08);
          border: 1px solid rgba(255,255,255,0.15);
          transition: all 0.3s ease;
        }
        .stat-card:hover { background: rgba(255,255,255,0.15); transform: translateY(-2px); }
        .progress-bar { animation: none; }
        .progress-bar.active { animation: progress 5.5s linear forwards; }
        @keyframes progress { from { width: 0% } to { width: 100% } }
        .grain-overlay {
          background-image: url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)' opacity='0.03'/%3E%3C/svg%3E");
          pointer-events: none;
        }
        .btn-primary { position: relative; overflow: hidden; transition: all 0.3s ease; }
        .btn-primary::before {
          content: ''; position: absolute; inset: 0;
          background: rgba(255,255,255,0.15);
          transform: translateX(-100%); transition: transform 0.4s ease;
        }
        .btn-primary:hover::before { transform: translateX(0); }
      `}</style>

      <div
        className="relative w-full mt-10 overflow-hidden rounded-2xl lg:rounded-3xl banner-body"
        style={{ height: "clamp(300px, 55vw, 680px)" }}
      >
        {/* Embla Carousel */}
        <div className="h-full w-full" ref={emblaRef}>
          <div className="flex h-full">
            {slides.map((slide) => (
              <div
                key={slide.id}
                className="relative flex-[0_0_100%] h-full bg-cover bg-center"
                style={{ backgroundImage: `url(${slide.bg})` }}
              >
                <div className="absolute inset-0 bg-gradient-to-r from-black/75 via-black/40 to-black/10" />
                <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent" />
                <div className="absolute inset-0 grain-overlay" />
              </div>
            ))}
          </div>
        </div>

        {/* Slide Counter */}
        <div className="absolute top-6 left-6 md:top-10 md:left-14 lg:left-20 flex items-center gap-2 z-20">
          <span className="text-white font-bold text-sm md:text-base" style={{ fontFamily: "'DM Sans', sans-serif" }}>
            0{selectedIndex + 1}
          </span>
          <div className="w-px h-4 bg-white/30" />
          <span className="text-white/40 text-xs md:text-sm">0{slides.length}</span>
        </div>

        {/* Navigation Arrows */}
        <button
          onClick={scrollPrev}
          className="absolute left-4 md:left-6 top-1/2 -translate-y-1/2 z-30 w-10 h-10 md:w-12 md:h-12 rounded-full bg-white/10 backdrop-blur-md border border-white/20 text-white flex items-center justify-center hover:bg-white/25 transition-all duration-300 hover:scale-110"
        >
          <ChevronLeft size={20} />
        </button>
        <button
          onClick={scrollNext}
          className="absolute right-4 md:right-6 top-1/2 -translate-y-1/2 z-30 w-10 h-10 md:w-12 md:h-12 rounded-full bg-white/10 backdrop-blur-md border border-white/20 text-white flex items-center justify-center hover:bg-white/25 transition-all duration-300 hover:scale-110"
        >
          <ChevronRight size={20} />
        </button>

        {/* Progress Indicators */}
        <div className="absolute bottom-5 md:bottom-8 left-6 md:left-14 lg:left-20 z-30 flex flex-col gap-2 w-32 md:w-48">
          {slides.map((slide, index) => (
            <button
              key={index}
              onClick={() => emblaApi && emblaApi.scrollTo(index)}
              className="relative h-0.5 bg-white/20 rounded-full overflow-hidden"
            >
              <div
                className={`absolute left-0 top-0 h-full rounded-full progress-bar ${selectedIndex === index ? "active" : ""}`}
                style={{
                  backgroundColor: selectedIndex === index ? currentSlide.accent : "transparent",
                  width: selectedIndex > index ? "100%" : selectedIndex === index ? undefined : "0%",
                }}
              />
            </button>
          ))}
        </div>
      </div>
    </>
  );
};

export default Banner;





