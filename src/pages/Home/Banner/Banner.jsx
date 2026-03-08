import React, { useCallback, useEffect, useState } from "react";
import useEmblaCarousel from "embla-carousel-react";
import Autoplay from "embla-carousel-autoplay";
import { ChevronLeft, ChevronRight, Sparkles, ArrowRight } from "lucide-react";

const slides = [
  {
    id: 1,
    tag: "New Season Drop",
    title: "Fresh Arrivals",
    titleAccent: "Redefine Your Style",
    desc: "Upgrade your wardrobe with this season's most anticipated fashion trends. Style meets comfort in every piece.",
    bg: "https://images.unsplash.com/photo-1542291026-7eec264c27ff?q=80&w=2070",
    accent: "#3b82f6",
    accentRgb: "59,130,246",
    buttonText: "Shop New Arrivals",
    stat1: { val: "2K+", label: "New Items" },
    stat2: { val: "Free", label: "Shipping" },
  },
  {
    id: 2,
    tag: "Limited Offer",
    title: "Up to 50% Off",
    titleAccent: "Everything You Love",
    desc: "Limited time offer! Grab your favorites at half the price before they're gone forever.",
    bg: "https://images.unsplash.com/photo-1607082348824-0a96f2a4b9da?q=80&w=2070",
    accent: "#f97316",
    accentRgb: "249,115,22",
    buttonText: "Grab the Deals",
    stat1: { val: "50%", label: "Max Discount" },
    stat2: { val: "24h", label: "Flash Sale" },
  },
  {
    id: 3,
    tag: "Tech Universe",
    title: "Premium Electronics",
    titleAccent: "Power Your World",
    desc: "Discover the latest gadgets and smart devices designed to make your daily life smoother and faster.",
    bg: "https://images.unsplash.com/photo-1498049794561-7780e7231661?q=80&w=2070",
    accent: "#8b5cf6",
    accentRgb: "139,92,246",
    buttonText: "Discover Gadgets",
    stat1: { val: "500+", label: "Gadgets" },
    stat2: { val: "Top", label: "Brands" },
  },
];

const Banner = () => {
  const [emblaRef, emblaApi] = useEmblaCarousel({ loop: true }, [
    Autoplay({ delay: 5500, stopOnInteraction: false }),
  ]);
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [isAnimating, setIsAnimating] = useState(false);

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

  const currentSlide = slides[selectedIndex];

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:wght@700;900&family=DM+Sans:wght@300;400;500;600&display=swap');

        .banner-title {
          font-family: 'Playfair Display', serif;
          line-height: 1.05;
        }
        .banner-body {
          font-family: 'DM Sans', sans-serif;
        }
        .slide-content {
          transition: opacity 0.6s ease, transform 0.6s ease;
        }
        .slide-content.animating {
          opacity: 0;
          transform: translateY(20px);
        }
        .slide-content.ready {
          opacity: 1;
          transform: translateY(0);
        }
        .accent-line {
          height: 3px;
          border-radius: 2px;
          transition: width 0.4s ease, background-color 0.5s ease;
        }
        .stat-card {
          backdrop-filter: blur(12px);
          background: rgba(255,255,255,0.08);
          border: 1px solid rgba(255,255,255,0.15);
          transition: all 0.3s ease;
        }
        .stat-card:hover {
          background: rgba(255,255,255,0.15);
          transform: translateY(-2px);
        }
        .progress-bar {
          animation: none;
        }
        .progress-bar.active {
          animation: progress 5.5s linear forwards;
        }
        @keyframes progress {
          from { width: 0% }
          to { width: 100% }
        }
        .grain-overlay {
          background-image: url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)' opacity='0.03'/%3E%3C/svg%3E");
          pointer-events: none;
        }
        .btn-primary {
          position: relative;
          overflow: hidden;
          transition: all 0.3s ease;
        }
        .btn-primary::before {
          content: '';
          position: absolute;
          inset: 0;
          background: rgba(255,255,255,0.15);
          transform: translateX(-100%);
          transition: transform 0.4s ease;
        }
        .btn-primary:hover::before {
          transform: translateX(0);
        }
        .floating-badge {
          animation: floatBadge 3s ease-in-out infinite;
        }
        @keyframes floatBadge {
          0%, 100% { transform: translateY(0px) rotate(-2deg); }
          50% { transform: translateY(-6px) rotate(-2deg); }
        }
      `}</style>

      <div className="relative w-full mt-10 overflow-hidden rounded-2xl lg:rounded-3xl banner-body" style={{ height: "clamp(300px, 55vw, 680px)" }}>

        {/* Embla Carousel */}
        <div className="h-full w-full" ref={emblaRef}>
          <div className="flex h-full">
            {slides.map((slide) => (
              <div
                key={slide.id}
                className="relative flex-[0_0_100%] h-full bg-cover bg-center"
                style={{ backgroundImage: `url(${slide.bg})` }}
              >
                {/* Multi-layer overlay */}
                <div className="absolute inset-0 bg-gradient-to-r from-black/85 via-black/50 to-black/10" />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
                <div className="absolute inset-0 grain-overlay" />
              </div>
            ))}
          </div>
        </div>

        {/* Floating Content Layer (outside embla, always visible) */}
        <div className="absolute inset-0 flex items-center pointer-events-none">
          <div
            className={`slide-content w-full px-6 md:px-14 lg:px-20 pointer-events-auto ${isAnimating ? "animating" : "ready"}`}
          >
            <div className="max-w-2xl">

              {/* Tag */}
              <div className="flex items-center gap-2 mb-4 md:mb-5">
                <div
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-full text-white text-[10px] md:text-xs font-semibold tracking-widest uppercase"
                  style={{ backgroundColor: `rgba(${currentSlide.accentRgb}, 0.9)` }}
                >
                  <Sparkles size={10} />
                  {currentSlide.tag}
                </div>
                <div className="accent-line w-8 md:w-12" style={{ backgroundColor: currentSlide.accent }} />
              </div>

              {/* Title */}
              <h1 className="banner-title text-white mb-1 md:mb-2" style={{ fontSize: "clamp(2rem, 5vw, 5.5rem)" }}>
                {currentSlide.title}
              </h1>
              <h2
                className="banner-title mb-4 md:mb-6"
                style={{
                  fontSize: "clamp(1.8rem, 4.5vw, 5rem)",
                  color: currentSlide.accent,
                  WebkitTextStroke: "1px transparent",
                }}
              >
                {currentSlide.titleAccent}
              </h2>

              {/* Description */}
              <p className="hidden sm:block text-gray-300 text-sm md:text-base lg:text-lg mb-6 md:mb-8 max-w-lg leading-relaxed font-light">
                {currentSlide.desc}
              </p>

              {/* CTA Buttons */}
              <div className="flex items-center gap-3 mb-8 md:mb-10">
                <button
                  className="btn-primary flex items-center gap-2 text-white font-semibold text-xs md:text-sm px-5 md:px-8 py-2.5 md:py-3.5 rounded-xl shadow-2xl"
                  style={{ backgroundColor: currentSlide.accent }}
                >
                  {currentSlide.buttonText}
                  <ArrowRight size={15} />
                </button>
                <button className="hidden sm:flex items-center gap-2 bg-white/10 backdrop-blur-md border border-white/20 hover:bg-white/20 text-white font-semibold text-xs md:text-sm px-5 md:px-8 py-2.5 md:py-3.5 rounded-xl transition-all duration-300">
                  View All
                </button>
              </div>

              {/* Stats */}
              <div className="flex gap-3">
                <div className="stat-card rounded-xl px-4 py-2.5 text-white">
                  <p className="text-lg md:text-2xl font-bold" style={{ color: currentSlide.accent }}>
                    {currentSlide.stat1.val}
                  </p>
                  <p className="text-[10px] md:text-xs text-gray-300 font-medium">{currentSlide.stat1.label}</p>
                </div>
                <div className="stat-card rounded-xl px-4 py-2.5 text-white">
                  <p className="text-lg md:text-2xl font-bold" style={{ color: currentSlide.accent }}>
                    {currentSlide.stat2.val}
                  </p>
                  <p className="text-[10px] md:text-xs text-gray-300 font-medium">{currentSlide.stat2.label}</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Floating Discount Badge */}
        <div className="floating-badge absolute top-6 right-6 md:top-10 md:right-10 hidden md:flex flex-col items-center justify-center w-20 h-20 md:w-24 md:h-24 rounded-full text-white font-bold shadow-2xl border-2 border-white/20"
          style={{ backgroundColor: `rgba(${currentSlide.accentRgb}, 0.9)`, backdropFilter: "blur(8px)" }}
        >
          <span className="text-xl md:text-2xl font-black leading-none">50%</span>
          <span className="text-[9px] md:text-[10px] tracking-wider uppercase opacity-90">Off Today</span>
        </div>

        {/* Slide Counter */}
        <div className="absolute top-6 left-6 md:top-10 md:left-14 lg:left-20 flex items-center gap-2">
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

          {/* Current slide title */}
          <p className="text-white/50 text-[10px] md:text-xs font-medium mt-1 truncate" style={{ fontFamily: "'DM Sans', sans-serif" }}>
            {currentSlide.title} — {currentSlide.titleAccent}
          </p>
        </div>
      </div>
    </>
  );
};

export default Banner;



















// import React, { useCallback, useEffect, useState } from "react";
// import useEmblaCarousel from "embla-carousel-react";
// import Autoplay from "embla-carousel-autoplay";
// import { ChevronLeft, ChevronRight } from "lucide-react";

// const Banner = () => {
//   const slides = [
//     {
//       id: 1,
//       title: "Fresh Arrivals: Explore Our Latest Collection",
//       desc: "Upgrade your wardrobe with this season's most anticipated fashion trends. Style meets comfort in every piece.",
//       bg: "https://images.unsplash.com/photo-1542291026-7eec264c27ff?q=80&w=2070",
//       buttonText: "Shop New Arrivals",
//     },
//     {
//       id: 2,
//       title: "Unbeatable Deals: Up to 50% Off Everything!",
//       desc: "Limited time offer! Grab your favorites at half the price before they are gone forever.",
//       bg: "https://images.unsplash.com/photo-1607082348824-0a96f2a4b9da?q=80&w=2070",
//       buttonText: "Grab the Deals Now",
//     },
//     {
//       id: 3,
//       title: "Premium Electronics: Power Your Life",
//       desc: "Discover the latest gadgets and smart devices designed to make your daily life smoother and faster.",
//       bg: "https://images.unsplash.com/photo-1498049794561-7780e7231661?q=80&w=2070",
//       buttonText: "Discover Gadgets",
//     },
//   ];

//   const [emblaRef, emblaApi] = useEmblaCarousel({ loop: true }, [
//     Autoplay({ delay: 5000 }),
//   ]);
//   const [selectedIndex, setSelectedIndex] = useState(0);

//   const scrollPrev = useCallback(() => emblaApi && emblaApi.scrollPrev(), [emblaApi]);
//   const scrollNext = useCallback(() => emblaApi && emblaApi.scrollNext(), [emblaApi]);

//   const onSelect = useCallback(() => {
//     if (!emblaApi) return;
//     setSelectedIndex(emblaApi.selectedScrollSnap());
//   }, [emblaApi]);

//   useEffect(() => {
//     if (!emblaApi) return;
//     onSelect();
//     emblaApi.on("select", onSelect);
//   }, [emblaApi, onSelect]);

//   return (
//     <div className="relative mt-5 lg:mt-0 w-full overflow-hidden group rounded-2xl lg:rounded-none">
//       {/* Banner Container - Height Adjustments */}
//       <div className="h-[250px] md:h-[350px] lg:h-[650px] w-full" ref={emblaRef}>
//         <div className="flex h-full">
//           {slides.map((slide, index) => (
//             <div
//               key={slide.id}
//               className="relative flex-[0_0_100%] h-full flex items-center bg-cover bg-center transition-transform duration-700 ease-in-out"
//               style={{ backgroundImage: `url(${slide.bg})` }}
//             >
//               {/* Overlay */}
//               <div className="absolute inset-0 bg-gradient-to-r from-black/80 via-black/40 to-transparent"></div>

//               {/* Content Container - Width & Padding Adjustment */}
//               <div
//                 className={`relative z-10 w-full px-6 md:px-12 lg:px-20 text-white transition-all duration-1000 transform ${
//                   selectedIndex === index ? "translate-y-0 opacity-100" : "translate-y-6 opacity-0"
//                 }`}
//               >
//                 <span className="inline-block bg-blue-600 text-[10px] md:text-xs font-bold px-3 py-1 rounded-full mb-3 md:mb-4 tracking-widest uppercase">
//                   Trending 2026
//                 </span>

//                 <h1 className="text-xl md:text-4xl lg:text-7xl font-extrabold mb-2 md:mb-6 max-w-[280px] md:max-w-2xl lg:max-w-4xl leading-[1.2] md:leading-tight">
//                   {slide.title}
//                 </h1>

//                 <p className="hidden md:block text-sm lg:text-xl mb-6 lg:mb-10 max-w-xl text-gray-200">
//                   {slide.desc}
//                 </p>

//                 <div className="flex items-center gap-3 mt-4 md:mt-0">
//                   <button className="bg-blue-600 hover:bg-blue-700 text-white px-5 md:px-10 py-2.5 md:py-4 rounded-lg md:rounded-xl text-xs md:text-base font-bold transition-all whitespace-nowrap">
//                     {slide.buttonText}
//                   </button>
//                   <button className="hidden sm:block bg-white/10 backdrop-blur-md border border-white/20 hover:bg-white/20 text-white px-6 md:px-10 py-3 md:py-4 rounded-lg md:rounded-xl text-xs md:text-base font-bold whitespace-nowrap">
//                     Watch Demo
//                   </button>
//                 </div>
//               </div>
//             </div>
//           ))}
//         </div>
//       </div>

//       {/* Navigation Controls - Hidden on Mobile for better UX */}
//       <button
//         onClick={scrollPrev}
//         className="hidden md:flex absolute left-4 md:left-8 top-1/2 -translate-y-1/2 z-30 p-3 md:p-4 rounded-full bg-black/20 text-white opacity-0 group-hover:opacity-100 transition-all hover:bg-blue-600"
//       >
//         <ChevronLeft size={24} />
//       </button>

//       <button
//         onClick={scrollNext}
//         className="hidden md:flex absolute right-4 md:right-8 top-1/2 -translate-y-1/2 z-30 p-3 md:p-4 rounded-full bg-black/20 text-white opacity-0 group-hover:opacity-100 transition-all hover:bg-blue-600"
//       >
//         <ChevronRight size={24} />
//       </button>

//       {/* Progress Bars / Dots */}
//       <div className="absolute bottom-4 md:bottom-8 left-6 md:left-12 lg:left-20 z-30 flex gap-2">
//         {slides.map((_, index) => (
//           <button
//             key={index}
//             onClick={() => emblaApi && emblaApi.scrollTo(index)}
//             className={`h-1 transition-all duration-500 rounded-full ${
//               selectedIndex === index ? "w-8 md:w-12 bg-blue-600" : "w-3 md:w-4 bg-white/40"
//             }`}
//           />
//         ))}
//       </div>
//     </div>
//   );
// };

// export default Banner;


