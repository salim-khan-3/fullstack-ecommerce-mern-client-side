import React, { useState, useRef, useEffect, useContext } from "react";
import { Heart, Maximize2, Star } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { StoreContext } from "../../../context/StoreContext";
import { useAuth } from "../../../context/AuthContext";

const ProductCard = ({ product, onQuickView }) => {
  const navigate = useNavigate();
  const [currentImg, setCurrentImg] = useState(0);
  const [wishLoading, setWishLoading] = useState(false);
  const intervalRef = useRef(null);

  const { isLoggedIn, token } = useAuth();
  const { addToMyList, removeFromMyList, isInMyList, getMyListItem } = useContext(StoreContext);

  const images = product.images || [];
  const realPrice = Number(product.price);
  const oldPrice = product.oldPrice || Math.round(realPrice / 0.88);
  const discount = Math.round(((oldPrice - realPrice) / oldPrice) * 100);
  const inStock = product.countInStock > 0;
  const rating = Math.round(product.rating || 5);

  const isWished = isLoggedIn && isInMyList(product._id);
  const wishItem = isWished ? getMyListItem(product._id) : null;

  const handleMouseEnter = () => {
    if (images.length <= 1) return;
    let idx = 0;
    intervalRef.current = setInterval(() => {
      idx = (idx + 1) % images.length;
      setCurrentImg(idx);
    }, 800);
  };

  const handleMouseLeave = () => {
    clearInterval(intervalRef.current);
    setCurrentImg(0);
  };

  useEffect(() => () => clearInterval(intervalRef.current), []);

  const handleCardClick = () => {
    navigate(`/product/${product._id}`);
  };

  const handleWishlist = async (e) => {
    e.stopPropagation();
    if (!isLoggedIn) { navigate("/login"); return; }
    setWishLoading(true);
    if (isWished && wishItem) {
      await removeFromMyList(wishItem._id, token);
    } else {
      await addToMyList(product, token);
    }
    setWishLoading(false);
  };

  return (
    <div className="w-full p-2 max-w-[280px]">
      <div
        className="group bg-[#F1F1F1] rounded-[15px] overflow-hidden border border-gray-200 shadow-sm cursor-pointer transition-all duration-300"
        onClick={handleCardClick}
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
      >
        {/* Image Section */}
        <div className="relative overflow-hidden h-[250px]">
          {images.length > 0 ? (
            images.map((img, idx) => (
              <img
                key={idx}
                src={img}
                alt={product.name}
                className="absolute inset-0 w-full h-full object-cover transition-opacity duration-500 ease-in-out"
                style={{ opacity: currentImg === idx ? 1 : 0 }}
              />
            ))
          ) : (
            <div className="w-full h-full flex items-center justify-center bg-gray-200 text-gray-400 text-xs">
              No Image
            </div>
          )}

          {/* Discount badge */}
          <div className="absolute top-3 left-3 z-10">
            <span className="bg-[#38BDF8] text-white text-[12px] font-bold px-2 py-1 rounded-full">
              {discount}%
            </span>
          </div>

          {/* Hover icons */}
          <div className="absolute top-3 right-3 z-10 flex flex-col gap-2 translate-x-12 opacity-0 group-hover:translate-x-0 group-hover:opacity-100 transition-all duration-300">
            <button
              onClick={(e) => { e.stopPropagation(); onQuickView?.(product); }}
              className="p-1.5 bg-white rounded-full shadow-sm hover:bg-gray-50 text-gray-700"
            >
              <Maximize2 size={14} />
            </button>
            <button
              onClick={handleWishlist}
              disabled={wishLoading}
              className="p-1.5 bg-white rounded-full shadow-sm hover:bg-gray-50 disabled:opacity-50"
            >
              <Heart
                size={14}
                fill={isWished ? "#EF4444" : "none"}
                className={isWished ? "text-red-500" : "text-gray-600"}
              />
            </button>
          </div>
        </div>

        {/* Info Section */}
        <div className="p-4 space-y-2">
          <h3 className="text-[16px] text-[#444] font-normal line-clamp-1">
            {product.name}
          </h3>

          <p className="text-[15px] font-medium text-[#4CAF50]">
            {inStock ? "In Stock" : "Out of Stock"}
          </p>

          <div className="flex gap-0.5">
            {[...Array(5)].map((_, i) => (
              <Star
                key={i}
                size={16}
                fill={i < rating ? "#FFB400" : "none"}
                className={i < rating ? "text-[#FFB400]" : "text-gray-300"}
              />
            ))}
          </div>

          <div className="flex items-center gap-2 pt-1">
            <span className="text-[16px] text-gray-500 line-through font-normal">
              Rs {Number(oldPrice)}
            </span>
            <span className="text-[18px] font-semibold text-[#D32F2F]">
              Rs {realPrice}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductCard;






















// import React, { useState, useRef, useEffect } from "react";
// import { Heart, Maximize2, Star } from "lucide-react";
// import { useNavigate } from "react-router-dom";

// const ProductCard = ({ product, onQuickView }) => {
//   const navigate = useNavigate();
//   const [isWished, setIsWished] = useState(false);
//   const [currentImg, setCurrentImg] = useState(0);
//   const intervalRef = useRef(null);

//   const images = product.images || [];
//   const realPrice = Number(product.price);
//   const oldPrice = product.oldPrice || Math.round(realPrice / 0.88);
//   const discount = Math.round(((oldPrice - realPrice) / oldPrice) * 100);
//   const inStock = product.countInStock > 0;
//   const rating = Math.round(product.rating || 5);

//   const handleMouseEnter = () => {
//     if (images.length <= 1) return;
//     let idx = 0;
//     intervalRef.current = setInterval(() => {
//       idx = (idx + 1) % images.length;
//       setCurrentImg(idx);
//     }, 800);
//   };

//   const handleMouseLeave = () => {
//     clearInterval(intervalRef.current);
//     setCurrentImg(0);
//   };

//   useEffect(() => () => clearInterval(intervalRef.current), []);

//   const handleCardClick = () => {
//     navigate(`/product/${product._id}`);
//   };

//   return (
//     <div className="w-full p-2 max-w-[280px]">
//       <div
//         className="group bg-[#F1F1F1] rounded-[15px] overflow-hidden border border-gray-200 shadow-sm cursor-pointer transition-all duration-300"
//         onClick={handleCardClick}
//         onMouseEnter={handleMouseEnter}
//         onMouseLeave={handleMouseLeave}
//       >
//         {/* Image Section */}
//         <div className="relative overflow-hidden h-[250px]">
//           {images.length > 0 ? (
//             images.map((img, idx) => (
//               <img
//                 key={idx}
//                 src={img}
//                 alt={product.name}
//                 className="absolute inset-0 w-full h-full object-cover transition-opacity duration-500 ease-in-out"
//                 style={{ opacity: currentImg === idx ? 1 : 0 }}
//               />
//             ))
//           ) : (
//             <div className="w-full h-full flex items-center justify-center bg-gray-200 text-gray-400 text-xs">
//               No Image
//             </div>
//           )}

//           {/* Discount badge - Exact Light Blue */}
//           <div className="absolute top-3 left-3 z-10">
//             <span className="bg-[#38BDF8] text-white text-[12px] font-bold px-2 py-1 rounded-full">
//               {discount}%
//             </span>
//           </div>

//           {/* Hover icons */}
//           <div className="absolute top-3 right-3 z-10 flex flex-col gap-2 translate-x-12 opacity-0 group-hover:translate-x-0 group-hover:opacity-100 transition-all duration-300">
//             <button
//               onClick={(e) => { e.stopPropagation(); onQuickView?.(product); }}
//               className="p-1.5 bg-white rounded-full shadow-sm hover:bg-gray-50 text-gray-700"
//             >
//               <Maximize2 size={14} />
//             </button>
//             <button
//               onClick={(e) => { e.stopPropagation(); setIsWished(!isWished); }}
//               className="p-1.5 bg-white rounded-full shadow-sm hover:bg-gray-50"
//             >
//               <Heart
//                 size={14}
//                 fill={isWished ? "#EF4444" : "none"}
//                 className={isWished ? "text-red-500" : "text-gray-600"}
//               />
//             </button>
//           </div>
//         </div>

//         {/* Info Section - Matches ScreenShot */}
//         <div className="p-4 space-y-2">
//           <h3 className="text-[16px] text-[#444] font-normal line-clamp-1">
//             {product.name}
//           </h3>

//           <p className="text-[15px] font-medium text-[#4CAF50]">
//             {inStock ? "In Stock" : "Out of Stock"}
//           </p>

//           <div className="flex gap-0.5">
//             {[...Array(5)].map((_, i) => (
//               <Star
//                 key={i}
//                 size={16}
//                 fill={i < rating ? "#FFB400" : "none"}
//                 className={i < rating ? "text-[#FFB400]" : "text-gray-300"}
//               />
//             ))}
//           </div>

//           <div className="flex items-center gap-2 pt-1">
//             <span className="text-[16px] text-gray-500 line-through font-normal">
//               Rs {Number(oldPrice)}
//             </span>
//             <span className="text-[18px] font-semibold text-[#D32F2F]">
//               Rs {realPrice}
//             </span>
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default ProductCard;









