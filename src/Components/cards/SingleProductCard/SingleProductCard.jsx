import { Heart, Maximize2 } from "lucide-react";
import { useNavigate } from "react-router-dom";

const SingleProductCard = ({ product, onQuickView }) => {
  const navigate = useNavigate();

  const discount = product.oldPrice && product.price && product.oldPrice > product.price
    ? Math.round(((product.oldPrice - product.price) / product.oldPrice) * 100)
    : product.discount || 0;

  const rating    = Number(product.rating) || 0;
  const inStock   = product.countInStock > 0;
  const mainImage = (product.images && product.images[0]) || product.img || "";

  return (
    <>
      <style>{`
        /* 320–375px: image hide */
        @media (min-width: 320px) and (max-width: 375px) {
          .spc-image { display: none !important; }
        }

        /* card hover এ icons show */
        .spc-card:hover .spc-actions {
          opacity: 1;
          transform: translateX(0);
        }
        .spc-actions {
          opacity: 0;
          transform: translateX(20px);
          transition: opacity 0.3s ease, transform 0.35s cubic-bezier(0.34, 1.56, 0.64, 1);
          pointer-events: none;
        }
        .spc-card:hover .spc-actions {
          pointer-events: all;
        }

        /* center expand button */
        .spc-card:hover .spc-expand {
          opacity: 1;
          transform: scale(1);
        }
        .spc-expand {
          opacity: 0;
          transform: scale(0.7);
          transition: opacity 0.25s ease, transform 0.3s cubic-bezier(0.34, 1.56, 0.64, 1);
          pointer-events: none;
        }
        .spc-card:hover .spc-expand {
          pointer-events: all;
        }

        /* image zoom on hover */
        .spc-card:hover .spc-img {
          transform: scale(1.08);
        }
        .spc-img {
          transition: transform 0.6s ease;
        }

        /* title color on hover */
        .spc-card:hover .spc-title {
          color: #2bbef9;
        }
      `}</style>

      <div
        className="spc-card w-full bg-white rounded-xl border border-gray-100 overflow-hidden cursor-pointer hover:shadow-xl transition-shadow duration-300 mb-3"
        onClick={() => navigate(`/product/${product._id}`)}
      >
        <div className="flex flex-row">

          {/* Image */}
          <div className="spc-image relative w-[160px] sm:w-[200px] h-[160px] sm:h-[180px] flex-shrink-0 bg-gray-50 overflow-hidden">
            <img
              src={mainImage}
              alt={product.name}
              className="spc-img w-full h-full object-cover"
            />

            {/* Discount badge */}
            {discount > 0 && (
              <span className="absolute top-2 left-2 bg-[#2bbef9] text-white text-[10px] font-black px-2 py-0.5 rounded shadow-sm z-10">
                {discount}%
              </span>
            )}

            {/* Center expand button */}
            <div className="absolute inset-0 flex items-center justify-center z-20">
              <button
                className="spc-expand w-10 h-10 bg-white/90 text-[#2bbef9] rounded-full flex items-center justify-center shadow-xl hover:bg-[#2bbef9] hover:text-white transition-colors duration-200"
                onClick={(e) => { e.stopPropagation(); onQuickView?.(product); }}
              >
                <Maximize2 size={18} strokeWidth={2.5} />
              </button>
            </div>

            {/* Right side floating icons */}
            <div className="spc-actions absolute top-2 right-2 z-30 flex flex-col gap-1.5">
              <button
                className="w-8 h-8 bg-white/90 backdrop-blur-sm text-gray-500 rounded-full shadow-md flex items-center justify-center hover:bg-[#2bbef9] hover:text-white transition-colors duration-200"
                onClick={(e) => { e.stopPropagation(); onQuickView?.(product); }}
              >
                <Maximize2 size={14} strokeWidth={2.5} />
              </button>
              <button
                className="w-8 h-8 bg-white/90 backdrop-blur-sm text-gray-500 rounded-full shadow-md flex items-center justify-center hover:bg-red-500 hover:text-white transition-colors duration-200"
                onClick={(e) => e.stopPropagation()}
              >
                <Heart size={14} strokeWidth={2.5} />
              </button>
            </div>
          </div>

          {/* Info */}
          <div className="flex flex-col justify-center px-6 py-4 flex-1">
            <h4 className="spc-title text-[14px] font-bold text-gray-800 leading-snug line-clamp-2 mb-1 transition-colors duration-200">
              {product.name}
            </h4>
            <p className={`text-[11px] font-black mb-1.5 uppercase ${inStock ? "text-emerald-500" : "text-rose-400"}`}>
              {inStock ? "In Stock" : "Out of Stock"}
            </p>
            <div className="flex items-center gap-0.5 mb-2">
              {[...Array(5)].map((_, i) => (
                <svg key={i} width="12" height="12" viewBox="0 0 24 24" fill={i < Math.round(rating) ? "#ffb400" : "#e0e0e0"}>
                  <path d="M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z" />
                </svg>
              ))}
            </div>
            <div className="flex items-center gap-2">
              {product.oldPrice > 0 && (
                <span className="text-gray-400 line-through text-[13px]">Rs {product.oldPrice}</span>
              )}
              <span className="text-[#e53935] font-black text-[16px]">Rs {product.price}</span>
            </div>
          </div>

        </div>
      </div>
    </>
  );
};

export default SingleProductCard;
