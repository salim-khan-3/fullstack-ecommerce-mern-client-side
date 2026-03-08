import React, { useState, useRef, useEffect } from "react";
import { Heart, Maximize2, Star } from "lucide-react";
import { useNavigate } from "react-router-dom";

const ProductCard = ({ product, onQuickView }) => {
  const navigate = useNavigate();
  const [isWished, setIsWished] = useState(false);
  const [currentImg, setCurrentImg] = useState(0);
  const intervalRef = useRef(null);

  const images = product.images || [];
  const realPrice = Number(product.price);
  const oldPrice = product.oldPrice || Math.round(realPrice / 0.88);
  const discount = Math.round(((oldPrice - realPrice) / oldPrice) * 100);
  const inStock = product.countInStock > 0;
  const rating = Math.round(product.rating || 5);

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

          {/* Discount badge - Exact Light Blue */}
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
              onClick={(e) => { e.stopPropagation(); setIsWished(!isWished); }}
              className="p-1.5 bg-white rounded-full shadow-sm hover:bg-gray-50"
            >
              <Heart
                size={14}
                fill={isWished ? "#EF4444" : "none"}
                className={isWished ? "text-red-500" : "text-gray-600"}
              />
            </button>
          </div>
        </div>

        {/* Info Section - Matches ScreenShot */}
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
//     <div className="w-full p-2">
//       <div
//         className="group bg-white rounded-2xl overflow-hidden transition-all duration-500 
//                    shadow-[0_2px_15px_-3px_rgba(0,0,0,0.07),0_10px_20px_-2px_rgba(0,0,0,0.04)] 
//                    hover:shadow-[0_20px_25px_-5px_rgba(0,0,0,0.1),0_10px_10px_-5px_rgba(0,0,0,0.04)] 
//                    hover:-translate-y-1 border border-gray-100/50 cursor-pointer"
//         onClick={handleCardClick}
//         onMouseEnter={handleMouseEnter}
//         onMouseLeave={handleMouseLeave}
//       >
//         {/* Image Section */}
//         <div className="relative overflow-hidden bg-[#F8F8F8]" style={{ height: "200px" }}>
//           {images.length > 0 ? (
//             images.map((img, idx) => (
//               <img
//                 key={idx}
//                 src={img}
//                 alt={product.name}
//                 className="absolute inset-0 w-full h-full object-cover transition-opacity duration-700 ease-in-out"
//                 style={{ opacity: currentImg === idx ? 1 : 0 }}
//               />
//             ))
//           ) : (
//             <div className="w-full h-full flex items-center justify-center bg-gray-200 text-gray-400 text-xs">
//               No Image
//             </div>
//           )}

//           {/* Discount badge */}
//           <div className="absolute top-3 left-3 z-10">
//             <span className="bg-[#4CC9F0] text-white text-[11px] font-bold px-2.5 py-1 rounded-full shadow-sm">
//               {discount}% OFF
//             </span>
//           </div>

//           {/* Image dots */}
//           {images.length > 1 && (
//             <div className="absolute bottom-3 left-1/2 -translate-x-1/2 flex items-center gap-1.5 z-10">
//               {images.map((_, idx) => (
//                 <div
//                   key={idx}
//                   className="rounded-full transition-all duration-300"
//                   style={{
//                     width: currentImg === idx ? "12px" : "6px",
//                     height: "6px",
//                     backgroundColor:
//                       currentImg === idx ? "white" : "rgba(255,255,255,0.5)",
//                   }}
//                 />
//               ))}
//             </div>
//           )}

//           {/* Hover icons */}
//           <div className="absolute top-3 right-3 z-10 flex flex-col gap-2 translate-x-12 opacity-0 group-hover:translate-x-0 group-hover:opacity-100 transition-all duration-300">
//             <button
//               onClick={(e) => { e.stopPropagation(); onQuickView?.(product); }}
//               className="p-2 bg-white rounded-full shadow-md hover:bg-[#4CC9F0] hover:text-white text-gray-700 transition-colors"
//             >
//               <Maximize2 size={16} />
//             </button>
//             <button
//               onClick={(e) => { e.stopPropagation(); setIsWished(!isWished); }}
//               className="p-2 bg-white rounded-full shadow-md hover:shadow-lg transition-all"
//             >
//               <Heart
//                 size={16}
//                 fill={isWished ? "#EF4444" : "none"}
//                 className={isWished ? "text-red-500" : "text-gray-600"}
//               />
//             </button>
//           </div>
//         </div>

//         {/* Info Section */}
//         <div className="p-4">
//           <h3 className="text-[15px] text-gray-800 font-semibold line-clamp-1 mb-1 group-hover:text-[#4CC9F0] transition-colors">
//             {product.name}
//           </h3>

//           <div className="flex items-center justify-between mb-2">
//             <p className={`text-[11px] font-bold uppercase tracking-wider ${inStock ? "text-green-500" : "text-red-400"}`}>
//               {inStock ? "● In Stock" : "○ Out of Stock"}
//             </p>
//             <div className="flex gap-0.5">
//               {[...Array(5)].map((_, i) => (
//                 <Star
//                   key={i}
//                   size={12}
//                   fill={i < rating ? "#F97316" : "none"}
//                   className={i < rating ? "text-[#F97316]" : "text-gray-200"}
//                 />
//               ))}
//             </div>
//           </div>

//           <div className="flex items-baseline gap-2">
//             <span className="text-[18px] font-bold text-[#D90429]">
//               Rs {realPrice.toLocaleString()}
//             </span>
//             <span className="text-[13px] text-gray-400 line-through">
//               Rs {Number(oldPrice).toLocaleString()}
//             </span>
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default ProductCard;