import { Heart, X } from "lucide-react";
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
    <div
      className="w-full bg-white rounded-xl border border-gray-100 overflow-hidden cursor-pointer group/card hover:shadow-lg transition-shadow duration-300 mb-3"
      onClick={() => navigate(`/product/${product._id}`)}
    >
      <div className="flex flex-row">

        {/* Image section */}
        <div className="relative w-[200px] h-[180px] flex-shrink-0 bg-gray-50 overflow-hidden">
          <img
            src={mainImage}
            alt={product.name}
            className="w-full h-full object-cover group-hover/card:scale-105 transition-transform duration-500"
          />

          {/* Discount badge — top left */}
          {discount > 0 && (
            <span className="absolute top-2 left-2 bg-[#2bbef9] text-white text-[10px] font-bold px-2 py-0.5 rounded">
              {discount}%
            </span>
          )}

          {/* X + Heart — top right */}
          <div className="absolute top-2 right-2 flex flex-col gap-1.5">
            <button
              onClick={e => { e.stopPropagation(); }}
              className="w-7 h-7 bg-white rounded-full shadow flex items-center justify-center hover:bg-red-50 hover:text-red-400 transition-colors"
            >
              <X size={13} strokeWidth={2.5} />
            </button>
            <button
              onClick={e => { e.stopPropagation(); }}
              className="w-7 h-7 bg-white rounded-full shadow flex items-center justify-center hover:bg-red-50 hover:text-red-400 transition-colors"
            >
              <Heart size={13} strokeWidth={2} />
            </button>
          </div>
        </div>

        {/* Info section */}
        <div className="flex flex-col justify-center px-5 py-4 flex-1">
          <h4 className="text-[14px] font-semibold text-gray-800 leading-snug line-clamp-2 mb-1">
            {product.name}
          </h4>

          <p className={`text-[11px] font-bold mb-1.5 ${inStock ? "text-green-500" : "text-red-400"}`}>
            {inStock ? "In Stock" : "Out of Stock"}
          </p>

          {/* Stars */}
          <div className="flex items-center gap-0.5 mb-2">
            {[...Array(5)].map((_, i) => (
              <svg key={i} width="13" height="13" viewBox="0 0 24 24" fill={i < Math.round(rating) ? "#f59e0b" : "none"} stroke="#f59e0b" strokeWidth="2">
                <polygon points="12,2 15.09,8.26 22,9.27 17,14.14 18.18,21.02 12,17.77 5.82,21.02 7,14.14 2,9.27 8.91,8.26" />
              </svg>
            ))}
          </div>

          {/* Price */}
          <div className="flex items-center gap-2">
            {product.oldPrice > 0 && (
              <span className="text-gray-400 line-through text-[13px]">
                Rs {Number(product.oldPrice).toLocaleString()}
              </span>
            )}
            <span className="text-[#e53935] font-bold text-[15px]">
              Rs {Number(product.price).toLocaleString()}
            </span>
          </div>
        </div>

      </div>
    </div>
  );
};

export default SingleProductCard;