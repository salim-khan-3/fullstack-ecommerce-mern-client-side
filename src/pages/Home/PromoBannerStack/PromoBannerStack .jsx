import React from "react";

// ─── তোমার নিজের images দিয়ে replace করো ───
// import img1 from "../../assets/banner1.jpg";
// import img2 from "../../assets/banner2.jpg";
// import img3 from "../../assets/banner3.jpg";

const banners = [
  {
    id: 1,
    tag: "Limited Offer",
    headline: "SALE UP TO",
    highlight: "50%",
    sub: "off on selected items*",
    cta: "Shop Now",
    bg: "https://images.unsplash.com/photo-1607082348824-0a96f2a4b9da?w=600&q=80",
    accent: "#FF4D4D",
    tagColor: "#FF4D4D",
  },
  {
    id: 2,
    tag: "New Season",
    headline: "WEEKEND",
    highlight: "DISCOUNT",
    sub: "40% on electronics",
    cta: "Explore",
    bg: "https://images.unsplash.com/photo-1593642632559-0c6d3fc62b89?w=600&q=80",
    accent: "#3B82F6",
    tagColor: "#3B82F6",
  },
  {
    id: 3,
    tag: "Clearance",
    headline: "FLAT",
    highlight: "30% OFF",
    sub: "fashion & accessories",
    cta: "Grab Deal",
    bg: "https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=600&q=80",
    accent: "#10B981",
    tagColor: "#10B981",
  },
];

const PromoBannerStack = () => {
  return (
    <div className="flex flex-col gap-4 w-full">
      {banners.map((banner) => (
        <div
          key={banner.id}
          className="relative overflow-hidden rounded-2xl cursor-pointer group"
          style={{ height: "400px" }}
        >
          {/* Background Image */}
          <div
            className="absolute inset-0 bg-cover bg-center transition-transform duration-700 ease-out group-hover:scale-110"
            style={{ backgroundImage: `url(${banner.bg})` }}
          />

          {/* Dark overlay */}
          <div className="absolute inset-0 bg-gradient-to-r from-black/75 via-black/50 to-black/20" />

          {/* Decorative accent line */}
          <div
            className="absolute left-0 top-0 bottom-0 w-1 rounded-r-full"
            style={{ backgroundColor: banner.accent }}
          />

          {/* Content */}
          <div className="relative z-10 h-full flex flex-col justify-between p-4">
            <div>
              {/* Tag */}
              <span
                className="inline-block text-[9px] font-black uppercase tracking-[2px] px-2 py-0.5 rounded-full mb-2"
                style={{
                  backgroundColor: `${banner.accent}25`,
                  color: banner.accent,
                  border: `1px solid ${banner.accent}50`,
                }}
              >
                {banner.tag}
              </span>

              {/* Headline */}
              <div className="leading-none">
                <p className="text-white/70 text-[11px] font-bold uppercase tracking-widest">
                  {banner.headline}
                </p>
                <p
                  className="text-[32px] font-black leading-none tracking-tight"
                  style={{ color: banner.accent }}
                >
                  {banner.highlight}
                </p>
                <p className="text-white/60 text-[10px] mt-0.5 font-medium">
                  {banner.sub}
                </p>
              </div>
            </div>

            {/* CTA Button */}
            <button
              className="self-start flex items-center gap-1.5 text-[10px] font-black uppercase tracking-widest text-white px-3 py-1.5 rounded-lg transition-all duration-300 group-hover:pl-4"
              style={{
                backgroundColor: `${banner.accent}30`,
                border: `1px solid ${banner.accent}60`,
              }}
            >
              {banner.cta}
              <svg
                className="w-3 h-3 transition-transform duration-300 group-hover:translate-x-1"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M9 5l7 7-7 7" />
              </svg>
            </button>
          </div>

          {/* Shine effect on hover */}
          <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none"
            style={{
              background: "linear-gradient(105deg, transparent 40%, rgba(255,255,255,0.06) 50%, transparent 60%)",
            }}
          />
        </div>
      ))}
    </div>
  );
};

export default PromoBannerStack;