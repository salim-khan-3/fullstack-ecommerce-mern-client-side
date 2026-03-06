import React, { useState, useRef, useEffect } from "react";
import { Heart, Maximize2, Star } from "lucide-react";

const ProductCard = ({ product, onQuickView }) => {
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

  return (
    <div className="w-full p-2">
      <div
        className="group bg-[#F8F8F8] rounded-2xl overflow-hidden transition-all duration-300 hover:shadow-md"
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
      >
        {/* Image */}
        <div className="relative overflow-hidden" style={{ height: "200px" }}>
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
            <span className="bg-[#4CC9F0] text-white text-[11px] font-bold px-2.5 py-1 rounded-full shadow-sm">
              {discount}%
            </span>
          </div>

          {/* Image dots — শুধু multiple images থাকলে */}
          {images.length > 1 && (
            <div className="absolute bottom-2.5 left-1/2 -translate-x-1/2 flex items-center gap-1.5 z-10">
              {images.map((_, idx) => (
                <div
                  key={idx}
                  className="rounded-full transition-all duration-300"
                  style={{
                    width: currentImg === idx ? "8px" : "5px",
                    height: currentImg === idx ? "8px" : "5px",
                    backgroundColor:
                      currentImg === idx ? "white" : "rgba(255,255,255,0.5)",
                  }}
                />
              ))}
            </div>
          )}

          {/* Hover icons */}
          <div className="absolute top-3 right-3 z-10 flex flex-col gap-2 translate-x-12 opacity-0 group-hover:translate-x-0 group-hover:opacity-100 transition-all duration-300">
            <button
              onClick={() => onQuickView?.(product)}
              className="p-2 bg-white rounded-full shadow-md hover:bg-gray-50 text-gray-700"
            >
              <Maximize2 size={16} />
            </button>
            <button
              onClick={() => setIsWished(!isWished)}
              className="p-2 bg-white rounded-full shadow-md hover:bg-gray-50"
            >
              <Heart
                size={16}
                fill={isWished ? "#EF4444" : "none"}
                className={isWished ? "text-red-500" : "text-gray-600"}
              />
            </button>
          </div>
        </div>

        {/* Info */}
        <div className="p-4 bg-white">
          <h3 className="text-[14px] text-gray-800 font-medium line-clamp-1 mb-1">
            {product.name}
          </h3>

          <p className={`text-[12px] font-semibold mb-2 ${inStock ? "text-green-600" : "text-red-400"}`}>
            {inStock ? "In Stock" : "Out of Stock"}
          </p>

          <div className="flex gap-0.5 mb-3">
            {[...Array(5)].map((_, i) => (
              <Star
                key={i}
                size={14}
                fill={i < rating ? "#F97316" : "none"}
                className={i < rating ? "text-[#F97316]" : "text-gray-300"}
              />
            ))}
          </div>

          <div className="flex items-center gap-2">
            <span className="text-[14px] text-gray-400 line-through">
              Rs {Number(oldPrice).toLocaleString()}
            </span>
            <span className="text-[18px] font-bold text-[#D90429]">
              Rs {realPrice.toLocaleString()}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductCard;













// import React, { useState, useEffect, useRef } from "react";
// import { Heart, Maximize2, Star } from "lucide-react";

// const ProductCard = ({ product, onQuickView }) => {
//   const [isWished, setIsWished] = useState(false);
//   const [currentImg, setCurrentImg] = useState(0);
//   const [isHovered, setIsHovered] = useState(false);
  
//   const images = product.images || [];
//   const realPrice = Number(product.price);
//   const oldPrice = product.oldPrice || Math.round(realPrice / 0.88);
//   const discount = Math.round(((oldPrice - realPrice) / oldPrice) * 100);
//   const inStock = product.countInStock > 0;
//   const rating = Math.round(product.rating || 5);

//   // অটো-স্ক্রল লজিক
//   useEffect(() => {
//     let interval;
//     if (isHovered && images.length > 1) {
//       interval = setInterval(() => {
//         setCurrentImg((prev) => (prev + 1) % images.length);
//       }, 1200); // ১.২ সেকেন্ড পর পর ইমেজ চেঞ্জ হবে
//     } else {
//       setCurrentImg(0); // হোভার ছেড়ে দিলে প্রথম ইমেজে ফিরে যাবে
//       clearInterval(interval);
//     }
//     return () => clearInterval(interval);
//   }, [isHovered, images.length]);

//   return (
//     <div className="w-full max-w-[260px] p-2">
//       <div 
//         className="group bg-white rounded-xl overflow-hidden transition-all duration-300 hover:shadow-xl border border-gray-100"
//         onMouseEnter={() => setIsHovered(true)}
//         onMouseLeave={() => setIsHovered(false)}
//       >
//         {/* --- ইমেজ সেকশন (উচ্চতা কমানো হয়েছে) --- */}
//         <div className="relative h-44 overflow-hidden bg-[#F8F8F8]">
//           {images.map((img, index) => (
//             <img
//               key={index}
//               src={img}
//               alt={`${product.name} ${index}`}
//               className={`absolute inset-0 w-full h-full object-contain transition-all duration-700 ease-in-out ${
//                 currentImg === index ? "opacity-100 translate-x-0" : "opacity-0 translate-x-full"
//               }`}
//             />
//           ))}

//           {/* ডিসকাউন্ট ব্যাজ */}
//           <div className="absolute top-2 left-2 z-10">
//             <span className="bg-[#34A8FF] text-white text-[10px] font-bold px-2 py-0.5 rounded-full shadow-sm">
//               {discount}%
//             </span>
//           </div>

//           {/* হোভার অ্যাকশন বাটন */}
//           <div className="absolute top-2 right-2 z-10 flex flex-col gap-1.5 translate-x-10 opacity-0 group-hover:translate-x-0 group-hover:opacity-100 transition-all duration-300">
//             <button 
//               onClick={(e) => { e.stopPropagation(); onQuickView?.(product); }}
//               className="p-1.5 bg-white rounded-full shadow-md hover:bg-gray-50 text-gray-700"
//             >
//               <Maximize2 size={14} />
//             </button>
//             <button 
//               onClick={(e) => { e.stopPropagation(); setIsWished(!isWished); }}
//               className="p-1.5 bg-white rounded-full shadow-md hover:bg-gray-50"
//             >
//               <Heart size={14} fill={isWished ? "#EF4444" : "none"} className={isWished ? "text-red-500" : "text-gray-600"} />
//             </button>
//           </div>

//           {/* স্ক্রল ইন্ডিকেটর ডটস */}
//           {isHovered && images.length > 1 && (
//             <div className="absolute bottom-2 left-1/2 -translate-x-1/2 flex gap-1 z-10">
//               {images.map((_, i) => (
//                 <div 
//                   key={i}
//                   className={`h-1 rounded-full transition-all duration-300 ${currentImg === i ? "w-3 bg-[#34A8FF]" : "w-1 bg-gray-300"}`}
//                 />
//               ))}
//             </div>
//           )}
//         </div>

//         {/* --- ইনফরমেশন সেকশন --- */}
//         <div className="p-3">
//           <h3 className="text-[13px] text-gray-800 font-medium line-clamp-1 mb-1">
//             {product.name}
//           </h3>

//           <p className="text-[11px] font-bold text-green-600 mb-1.5">
//             {inStock ? "In Stock" : "Out of Stock"}
//           </p>

//           <div className="flex gap-0.5 mb-2">
//             {[...Array(5)].map((_, i) => (
//               <Star 
//                 key={i} 
//                 size={12} 
//                 fill={i < rating ? "#FFA000" : "none"} 
//                 className={i < rating ? "text-[#FFA000]" : "text-gray-200"} 
//               />
//             ))}
//           </div>

//           <div className="flex items-center gap-2">
//             <span className="text-[12px] text-gray-400 line-through">Rs {oldPrice}</span>
//             <span className="text-[16px] font-bold text-[#E01313]">Rs {realPrice}</span>
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default ProductCard;