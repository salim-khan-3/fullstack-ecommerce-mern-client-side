import React, { useState } from "react";
import { Heart, Maximize2, Star } from "lucide-react";

const ProductCard = ({ product, onQuickView }) => {
  const [wished, setWished] = useState(false);
  const [currentImg, setCurrentImg] = useState(0);

  const images = product.images || [];
  const realPrice = Number(product.price);
  const oldPrice = Math.round(realPrice * 1.33);
  const discount = Math.round(((oldPrice - realPrice) / oldPrice) * 100);
  const inStock = product.countInStock > 0;
  const rating = Math.round(product.rating || 0);

  const handleMouseEnter = () => {
    if (images.length > 1) setCurrentImg(1);
  };
  const handleMouseLeave = () => {
    setCurrentImg(0);
  };

  return (
    <div className="w-full p-2">
      <div
        className="group bg-white rounded-lg border border-gray-100 overflow-hidden transition-all duration-300 hover:shadow-lg hover:-translate-y-1"
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
      >
        {/* ── Image ── */}
        <div className="relative bg-gray-50 overflow-hidden" style={{ height: "180px" }}>

          {/* Image slide transition */}
          {images.map((img, idx) => (
            <img
              key={idx}
              src={img}
              alt={product.name}
              className="absolute inset-0 w-full h-full object-cover transition-all duration-500 ease-in-out"
              style={{
                opacity: currentImg === idx ? 1 : 0,
                transform: currentImg === idx ? "scale(1.03)" : "scale(1)",
              }}
            />
          ))}

          {/* Fallback if no images */}
          {images.length === 0 && (
            <div className="w-full h-full flex items-center justify-center text-gray-300 text-xs">
              No Image
            </div>
          )}

          {/* Discount badge */}
          <div className="absolute top-3 left-3 z-10">
            <span className="bg-[#34A8FF] text-white text-[10px] font-bold px-3 py-1 rounded-full">
              {discount}%
            </span>
          </div>

          {/* Hover icons */}
          <div className="absolute top-3 right-3 z-10 flex flex-col gap-2">
            <button
              onClick={(e) => { e.stopPropagation(); onQuickView && onQuickView(product); }}
              className="w-9 h-9 rounded-full flex items-center justify-center bg-white shadow-md text-gray-600 hover:text-black hover:scale-105 transition-all duration-300 ease-in-out translate-x-12 opacity-0 group-hover:translate-x-0 group-hover:opacity-100"
              style={{ transitionDelay: "0ms" }}
            >
              <Maximize2 size={15} strokeWidth={1.5} />
            </button>
            <button
              onClick={(e) => { e.stopPropagation(); setWished(!wished); }}
              className={`w-9 h-9 rounded-full flex items-center justify-center bg-white shadow-md transition-all duration-300 ease-in-out translate-x-12 opacity-0 group-hover:translate-x-0 group-hover:opacity-100
                ${wished ? "text-red-500" : "text-gray-400 hover:text-red-500 hover:scale-105"}`}
              style={{ transitionDelay: "80ms" }}
            >
              <Heart size={15} fill={wished ? "currentColor" : "none"} strokeWidth={1.5} />
            </button>
          </div>

          {/* Image dots */}
          {images.length > 1 && (
            <div className="absolute bottom-2.5 left-1/2 -translate-x-1/2 flex items-center gap-1.5 z-10">
              {images.map((_, idx) => (
                <div
                  key={idx}
                  className="rounded-full transition-all duration-300"
                  style={{
                    width: currentImg === idx ? "8px" : "6px",
                    height: currentImg === idx ? "8px" : "6px",
                    backgroundColor: currentImg === idx ? "white" : "rgba(255,255,255,0.45)",
                  }}
                />
              ))}
            </div>
          )}
        </div>

        {/* ── Body ── */}
        <div className="p-3.5 pb-4">
          {/* Name */}
          <p className="text-[13px] font-medium text-gray-900 leading-snug line-clamp-2 min-h-[40px] mb-2">
            {product.name}
          </p>

          {/* Stock */}
          <p className={`text-[12px] font-semibold mb-2 ${inStock ? "text-[#008B00]" : "text-red-400"}`}>
            {inStock ? "In Stock" : "Out of Stock"}
          </p>

          {/* Stars */}
          <div className="flex items-center gap-0.5 mb-3">
            {[1, 2, 3, 4, 5].map((s) => (
              <Star
                key={s}
                size={13}
                fill={s <= rating ? "#FFA000" : "none"}
                color={s <= rating ? "#FFA000" : "#D1D5DB"}
                strokeWidth={1.5}
              />
            ))}
          </div>

          {/* Price */}
          <div className="flex items-end gap-2">
            <p className="text-[13px] text-gray-400 line-through leading-none font-medium">
              Rs {oldPrice.toLocaleString()}
            </p>
            <p className="text-[17px] font-bold text-[#E01313] leading-none">
              Rs {realPrice.toLocaleString()}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductCard;