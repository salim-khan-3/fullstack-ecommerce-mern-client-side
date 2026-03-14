import React, { useCallback, useEffect, useState } from "react";
import useEmblaCarousel from "embla-carousel-react";
import Autoplay from "embla-carousel-autoplay";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { getAllBannersApi } from "../../../utils/api/Homebannerapi";

const Banner = () => {
  const [slides, setSlides] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedIndex, setSelectedIndex] = useState(0);

  const [emblaRef, emblaApi] = useEmblaCarousel({ loop: true }, [
    Autoplay({ delay: 5500, stopOnInteraction: false }),
  ]);

  useEffect(() => { fetchBanners(); }, []);

  const fetchBanners = async () => {
    try {
      const data = await getAllBannersApi();
      const banners = (data.banners || []).map((b) => ({
        id: b._id,
        image: b.image,
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
    setSelectedIndex(emblaApi.selectedScrollSnap());
  }, [emblaApi]);

  useEffect(() => {
    if (!emblaApi) return;
    onSelect();
    emblaApi.on("select", onSelect);
  }, [emblaApi, onSelect]);

  // ── Skeleton ──
  if (loading) {
    return (
      <div
        className="relative w-full mt-10 overflow-hidden rounded-2xl lg:rounded-3xl bg-gray-200 animate-pulse"
        style={{ height: "clamp(200px, 35vw, 450px)" }}
      />
    );
  }

  // ── No banners ──
  if (slides.length === 0) return null;

  return (
    <div className="relative w-full mt-10 overflow-hidden rounded-2xl lg:rounded-3xl"
      style={{ height: "clamp(200px, 35vw, 450px)" }}
    >
      {/* Embla Carousel */}
      <div className="h-full w-full" ref={emblaRef}>
        <div className="flex h-full">
          {slides.map((slide) => (
            <div
              key={slide.id}
              className="relative flex-[0_0_100%] h-full"
            >
              <img
                src={slide.image}
                alt="banner"
                className="w-full h-full object-cover"
              />
            </div>
          ))}
        </div>
      </div>

      {/* Left Arrow */}
      <button
        onClick={scrollPrev}
        className="absolute left-3 top-1/2 -translate-y-1/2 z-30 w-9 h-9 rounded-full bg-white/80 shadow-md flex items-center justify-center hover:bg-white transition-all duration-300"
      >
        <ChevronLeft size={20} className="text-gray-700" />
      </button>

      {/* Right Arrow */}
      <button
        onClick={scrollNext}
        className="absolute right-3 top-1/2 -translate-y-1/2 z-30 w-9 h-9 rounded-full bg-white/80 shadow-md flex items-center justify-center hover:bg-white transition-all duration-300"
      >
        <ChevronRight size={20} className="text-gray-700" />
      </button>

      {/* Dot Indicators */}
      <div className="absolute bottom-3 left-1/2 -translate-x-1/2 z-30 flex gap-2">
        {slides.map((_, index) => (
          <button
            key={index}
            onClick={() => emblaApi && emblaApi.scrollTo(index)}
            className={`rounded-full transition-all duration-300 ${
              selectedIndex === index
                ? "w-5 h-2 bg-white"
                : "w-2 h-2 bg-white/50"
            }`}
          />
        ))}
      </div>
    </div>
  );
};

export default Banner;
