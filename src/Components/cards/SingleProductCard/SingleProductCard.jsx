// import { Heart, Maximize2 } from "lucide-react";
// import { useNavigate } from "react-router-dom";

// const SingleProductCard = ({ product, onQuickView }) => {
//   const navigate = useNavigate();

//   const discount = product.oldPrice && product.price && product.oldPrice > product.price
//     ? Math.round(((product.oldPrice - product.price) / product.oldPrice) * 100)
//     : product.discount || 0;

//   const rating    = Number(product.rating) || 0;
//   const inStock   = product.countInStock > 0;
//   const mainImage = (product.images && product.images[0]) || product.img || "";

//   return (
//     <>
//       <style>{`
//         /* 320px–375px: image hide */
//         @media (min-width: 320px) and (max-width: 375px) {
//           .spc-image { display: none !important; }
//         }

//         /* Action icons — right থেকে slide in */
//         .spc-actions {
//           opacity: 0;
//           transform: translateX(18px);
//           transition: opacity 0.3s ease, transform 0.3s cubic-bezier(0.34, 1.56, 0.64, 1);
//           pointer-events: none;
//         }
//         .spc-wrap:hover .spc-actions {
//           opacity: 1;
//           transform: translateX(0);
//           pointer-events: all;
//         }

//         /* Expand icon — scale in */
//         .spc-expand {
//           opacity: 0;
//           transform: scale(0.75);
//           transition: opacity 0.25s ease, transform 0.25s cubic-bezier(0.34, 1.56, 0.64, 1);
//           pointer-events: none;
//         }
//         .spc-wrap:hover .spc-expand {
//           opacity: 1;
//           transform: scale(1);
//           pointer-events: all;
//         }
//       `}</style>

//       <div
//         className="spc-wrap w-full bg-white rounded-xl border border-gray-100 overflow-hidden cursor-pointer hover:shadow-xl transition-shadow duration-300 mb-3"
//         onClick={() => navigate(`/product/${product._id}`)}
//       >
//         <div className="flex flex-row">

//           {/* Image section */}
//           <div className="spc-image relative w-[160px] sm:w-[200px] h-[160px] sm:h-[180px] flex-shrink-0 bg-gray-50 overflow-hidden">
//             <img
//               src={mainImage}
//               alt={product.name}
//               className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
//               style={{ transition: "transform 0.7s ease" }}
//             />

//             {/* Discount badge */}
//             {discount > 0 && (
//               <span className="absolute top-2 left-2 bg-[#2bbef9] text-white text-[10px] font-black px-2 py-0.5 rounded shadow-sm z-10">
//                 {discount}%
//               </span>
//             )}

//             {/* Center expand button */}
//             <div className="spc-expand absolute inset-0 flex items-center justify-center z-20">
//               <button
//                 onClick={(e) => {
//                   e.stopPropagation();
//                   if (onQuickView) onQuickView(product);
//                 }}
//                 className="w-10 h-10 bg-white/90 text-[#2bbef9] rounded-full flex items-center justify-center shadow-xl hover:bg-[#2bbef9] hover:text-white transition-colors duration-200"
//               >
//                 <Maximize2 size={17} strokeWidth={2.5} />
//               </button>
//             </div>

//             {/* Right side floating icons — slide from right */}
//             <div className="spc-actions absolute top-2 right-2 z-30 flex flex-col gap-1.5">
//               <button
//                 onClick={(e) => {
//                   e.stopPropagation();
//                   if (onQuickView) onQuickView(product);
//                 }}
//                 className="w-8 h-8 bg-white/90 backdrop-blur-sm text-gray-500 rounded-full shadow-md flex items-center justify-center hover:bg-[#2bbef9] hover:text-white transition-colors duration-200"
//               >
//                 <Maximize2 size={14} strokeWidth={2.5} />
//               </button>
//               <button
//                 onClick={(e) => e.stopPropagation()}
//                 className="w-8 h-8 bg-white/90 backdrop-blur-sm text-gray-500 rounded-full shadow-md flex items-center justify-center hover:bg-red-500 hover:text-white transition-colors duration-200"
//               >
//                 <Heart size={14} strokeWidth={2.5} />
//               </button>
//             </div>
//           </div>

//           {/* Info section */}
//           <div className="flex flex-col justify-center px-5 py-4 flex-1">
//             <h4 className="text-[14px] font-bold text-gray-800 leading-snug line-clamp-2 mb-1 transition-colors duration-200">
//               {product.name}
//             </h4>

//             <p className={`text-[11px] font-black mb-1.5 uppercase ${inStock ? "text-emerald-500" : "text-rose-400"}`}>
//               {inStock ? "In Stock" : "Out of Stock"}
//             </p>

//             {/* Stars */}
//             <div className="flex items-center gap-0.5 mb-2">
//               {[...Array(5)].map((_, i) => (
//                 <svg key={i} width="12" height="12" viewBox="0 0 24 24"
//                   fill={i < Math.round(rating) ? "#ffb400" : "#e0e0e0"}>
//                   <path d="M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z" />
//                 </svg>
//               ))}
//             </div>

//             {/* Price */}
//             <div className="flex items-center gap-2">
//               {product.oldPrice > 0 && (
//                 <span className="text-gray-400 line-through text-[13px]">
//                   ৳{Number(product.oldPrice).toLocaleString()}
//                 </span>
//               )}
//               <span className="text-[#e53935] font-black text-[16px]">
//                 ৳{Number(product.price).toLocaleString()}
//               </span>
//             </div>
//           </div>

//         </div>
//       </div>
//     </>
//   );
// };

// export default SingleProductCard;
























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
        /* ৩২০px থেকে ৩৭৫px এর মধ্যে ইমেজ হাইড */
        @media (min-width: 320px) and (max-width: 375px) {
          .spc-image { display: none !important; }
        }

        /* ভিডিওর মতো আইকন স্লাইড অ্যানিমেশন */
        .action-icons-container {
          opacity: 0;
          transform: translateX(20px);
          transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
        }

        .group\/card:hover .action-icons-container {
          opacity: 1;
          transform: translateX(0);
        }

        /* মাঝখানের এক্সপ্যান্ড আইকন হোভার ইফেক্ট */
        .expand-btn {
          opacity: 0;
          transform: scale(0.8);
          transition: all 0.3s ease;
        }

        .group\/card:hover .expand-btn {
          opacity: 1;
          transform: scale(1);
        }
      `}</style>

      <div
        className="w-full bg-white rounded-xl border border-gray-100 overflow-hidden cursor-pointer group/card hover:shadow-xl transition-all duration-300 mb-3"
        onClick={() => navigate(`/product/${product._id}`)}
      >
        <div className="flex flex-row">

          {/* LEFT: Image Section */}
          <div className="spc-image relative w-[160px] sm:w-[200px] h-[160px] sm:h-[180px] flex-shrink-0 bg-gray-50 overflow-hidden">
            <img
              src={mainImage}
              alt={product.name}
              className="w-full h-full object-cover group-hover/card:scale-110 transition-transform duration-700"
            />

            {/* ভিডিওর মতো সেন্টার এক্সপ্যান্ড বাটন */}
            <div className="absolute inset-0 flex items-center justify-center z-30">
              <button 
                onClick={(e) => { e.stopPropagation(); onQuickView(product); }}
                className="expand-btn w-10 h-10 bg-white/90 text-[#2bbef9] rounded-full flex items-center justify-center shadow-xl hover:bg-[#2bbef9] hover:text-white transition-all"
              >
                <Maximize2 size={18} strokeWidth={2.5} />
              </button>
            </div>

            {/* টপ রাইট সাইড আইকন (Heart) */}
            <div className="action-icons-container absolute top-2 right-2 z-20">
              <button
                onClick={(e) => { e.stopPropagation(); }}
                className="w-8 h-8 bg-white/90 backdrop-blur-sm text-gray-600 rounded-full shadow-md flex items-center justify-center hover:bg-red-500 hover:text-white transition-all"
              >
                <Heart size={14} strokeWidth={2.5} />
              </button>
            </div>

            {/* Discount Badge */}
            {discount > 0 && (
              <span className="absolute top-2 left-2 bg-[#2bbef9] text-white text-[10px] font-black px-2 py-0.5 rounded shadow-sm z-10">
                {discount}%
              </span>
            )}
          </div>

          {/* RIGHT: Info Section */}
          <div className="info-section flex flex-col justify-center px-6 py-4 flex-1">
            <h4 className="text-[14px] font-bold text-gray-800 leading-snug line-clamp-2 mb-1 group-hover/card:text-[#2bbef9]">
              {product.name}
            </h4>
            <p className={`text-[11px] font-black mb-1.5 uppercase ${inStock ? "text-emerald-500" : "text-rose-400"}`}>
              {inStock ? "In Stock" : "Out of Stock"}
            </p>
            {/* Stars & Price are same as before */}
            <div className="flex items-center gap-0.5 mb-2">
              {[...Array(5)].map((_, i) => (
                <svg key={i} width="12" height="12" viewBox="0 0 24 24" fill={i < Math.round(rating) ? "#ffb400" : "#e0e0e0"}>
                  <path d="M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z" />
                </svg>
              ))}
            </div>
            <div className="flex items-center gap-2">
              {product.oldPrice > 0 && <span className="text-gray-400 line-through text-[13px]">Rs {product.oldPrice}</span>}
              <span className="text-[#e53935] font-black text-[16px]">Rs {product.price}</span>
            </div>
          </div>

        </div>
      </div>
    </>
  );
};

export default SingleProductCard;
























// import { Heart, Maximize2 } from "lucide-react";
// import { useNavigate } from "react-router-dom";

// const SingleProductCard = ({ product, onQuickView }) => {
//   const navigate = useNavigate();

//   const discount = product.oldPrice && product.price && product.oldPrice > product.price
//     ? Math.round(((product.oldPrice - product.price) / product.oldPrice) * 100)
//     : product.discount || 0;

//   const rating    = Number(product.rating) || 0;
//   const inStock   = product.countInStock > 0;
//   const mainImage = (product.images && product.images[0]) || product.img || "";

//   return (
//     <>
//       <style>{`
//         /* ৩২০px থেকে ৩৭৫px এর মধ্যে ইমেজ হাইড করার লজিক ঠিক রাখা হয়েছে */
//         @media (min-width: 320px) and (max-width: 375px) {
//           .spc-image { display: none !important; }
//         }

//         /* আইকনগুলোর ডিফল্ট স্টেট */
//         .action-icon {
//           opacity: 0;
//           transform: translateX(20px);
//           transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
//         }

//         /* কার্ড হোভার করলে আইকনগুলো স্লাইড হয়ে আসবে */
//         .group\/card:hover .action-icon {
//           opacity: 1;
//           transform: translateX(0);
//         }

//         /* আইকনগুলোর মধ্যে একটু সময়ের পার্থক্য (Stagger delay) */
//         .icon-delay-1 { transition-delay: 100ms; }
//         .icon-delay-2 { transition-delay: 200ms; }
//       `}</style>

//       <div
//         className="w-full bg-white rounded-xl border border-gray-100 overflow-hidden cursor-pointer group/card hover:shadow-2xl transition-all duration-300 mb-3"
//         onClick={() => navigate(`/product/${product._id}`)}
//       >
//         <div className="flex flex-row">
          
//           {/* LEFT: Image Section */}
//           <div className="spc-image relative w-[160px] sm:w-[200px] h-[160px] sm:h-[180px] flex-shrink-0 bg-gray-50 overflow-hidden">
//             <img
//               src={mainImage}
//               alt={product.name}
//               className="w-full h-full object-cover group-hover/card:scale-110 transition-transform duration-700"
//             />

//             {/* Top-Right Action Icons Container */}
//             <div className="absolute top-2 right-2 flex flex-col gap-2 z-20">
              
//               {/* Expand/Modal Icon */}
//               <button
//                 onClick={(e) => { 
//                   e.stopPropagation(); 
//                   onQuickView(product); 
//                 }}
//                 className="action-icon icon-delay-1 w-8 h-8 bg-white/95 backdrop-blur-sm text-gray-700 rounded-full shadow-lg flex items-center justify-center hover:bg-[#2bbef9] hover:text-white transition-all duration-300"
//               >
//                 <Maximize2 size={14} strokeWidth={2.5} />
//               </button>

//               {/* Heart/Wishlist Icon */}
//               <button
//                 onClick={(e) => { e.stopPropagation(); }}
//                 className="action-icon icon-delay-2 w-8 h-8 bg-white/95 backdrop-blur-sm text-gray-700 rounded-full shadow-lg flex items-center justify-center hover:bg-red-500 hover:text-white transition-all duration-300"
//               >
//                 <Heart size={14} strokeWidth={2.5} />
//               </button>
//             </div>

//             {/* Discount Badge */}
//             {discount > 0 && (
//               <span className="absolute top-2 left-2 bg-[#2bbef9] text-white text-[10px] font-black px-2 py-0.5 rounded shadow-sm z-10">
//                 {discount}%
//               </span>
//             )}
//           </div>

//           {/* RIGHT: Info Section */}
//           <div className="info-section flex flex-col justify-center px-6 py-4 flex-1 bg-white">
//             <h4 className="text-[14px] font-bold text-gray-800 leading-snug line-clamp-2 mb-1 group-hover/card:text-[#2bbef9] transition-colors">
//               {product.name}
//             </h4>

//             <p className={`text-[11px] font-black mb-1.5 uppercase tracking-wide ${inStock ? "text-emerald-500" : "text-rose-400"}`}>
//               {inStock ? "In Stock" : "Out of Stock"}
//             </p>

//             <div className="flex items-center gap-0.5 mb-2">
//               {[...Array(5)].map((_, i) => (
//                 <svg key={i} width="12" height="12" viewBox="0 0 24 24" fill={i < Math.round(rating) ? "#ffb400" : "#e0e0e0"}>
//                   <path d="M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z" />
//                 </svg>
//               ))}
//             </div>

//             <div className="flex items-center gap-2">
//               {product.oldPrice > 0 && (
//                 <span className="text-gray-400 line-through text-[13px] font-medium">
//                   Rs {Number(product.oldPrice).toLocaleString()}
//                 </span>
//               )}
//               <span className="text-[#e53935] font-black text-[16px]">
//                 Rs {Number(product.price).toLocaleString()}
//               </span>
//             </div>
//           </div>

//         </div>
//       </div>
//     </>
//   );
// };

// export default SingleProductCard;




















// import { Heart, X, Eye } from "lucide-react";
// import { useNavigate } from "react-router-dom";

// const SingleProductCard = ({ product, onQuickView }) => {
//   const navigate = useNavigate();

//   const discount = product.oldPrice && product.price && product.oldPrice > product.price
//     ? Math.round(((product.oldPrice - product.price) / product.oldPrice) * 100)
//     : product.discount || 0;

//   const rating    = Number(product.rating) || 0;
//   const inStock   = product.countInStock > 0;
//   const mainImage = (product.images && product.images[0]) || product.img || "";

//   return (
//     <>
//       <style>{`
//         @media (min-width: 320px) and (max-width: 375px) {
//           .spc-image { display: none !important; }
//           .info-section { padding-left: 15px !important; padding-right: 15px !important; }
//         }
//         /* LG ডিভাইসে হভার করলে কুইক ভিউ বাটন দেখানোর জন্য */
//         .quick-view-btn {
//           opacity: 0;
//           transform: translateX(20px);
//           transition: all 0.3s ease;
//         }
//         .group\/card:hover .quick-view-btn {
//           opacity: 1;
//           transform: translateX(0);
//         }
//       `}</style>

//       <div
//         className="w-full bg-white rounded-xl border border-gray-100 overflow-hidden cursor-pointer group/card hover:shadow-2xl transition-all duration-300 mb-3 relative"
//         onClick={() => navigate(`/product/${product._id}`)}
//       >
//         <div className="flex flex-row">
//           {/* Image section */}
//           <div className="spc-image relative w-[160px] sm:w-[200px] h-[160px] sm:h-[180px] flex-shrink-0 bg-gray-50 overflow-hidden">
//             <img src={mainImage} alt={product.name} className="w-full h-full object-cover group-hover/card:scale-110 transition-transform duration-700" />
            
//             {/* Quick View Button for LG Devices */}
//             <button 
//               onClick={(e) => { e.stopPropagation(); onQuickView(product); }}
//               className="quick-view-btn absolute inset-0 m-auto w-10 h-10 bg-white/90 text-blue-600 rounded-full flex items-center justify-center shadow-lg hover:bg-blue-600 hover:text-white z-30 hidden lg:flex"
//             >
//               <Eye size={18} />
//             </button>

//             {discount > 0 && (
//               <span className="absolute top-2 left-2 bg-[#2bbef9] text-white text-[10px] font-bold px-2 py-0.5 rounded z-10">
//                 {discount}%
//               </span>
//             )}
//           </div>

//           {/* Info section */}
//           <div className="info-section flex flex-col justify-center px-5 py-4 flex-1">
//             <h4 className="text-[14px] font-semibold text-gray-800 leading-snug line-clamp-2 mb-1">{product.name}</h4>
//             <p className={`text-[11px] font-bold mb-1.5 ${inStock ? "text-green-500" : "text-red-400"}`}>
//               {inStock ? "In Stock" : "Out of Stock"}
//             </p>
//             <div className="flex items-center gap-0.5 mb-2">
//               {[...Array(5)].map((_, i) => (
//                 <svg key={i} width="13" height="13" viewBox="0 0 24 24" fill={i < Math.round(rating) ? "#f59e0b" : "none"} stroke="#f59e0b" strokeWidth="2">
//                   <polygon points="12,2 15.09,8.26 22,9.27 17,14.14 18.18,21.02 12,17.77 5.82,21.02 7,14.14 2,9.27 8.91,8.26" />
//                 </svg>
//               ))}
//             </div>
//             <div className="flex items-center gap-2">
//               {product.oldPrice > 0 && <span className="text-gray-400 line-through text-[13px]">Rs {product.oldPrice}</span>}
//               <span className="text-[#e53935] font-bold text-[15px]">Rs {product.price}</span>
//             </div>
//           </div>
//         </div>
//       </div>
//     </>
//   );
// };
// export default SingleProductCard;









// import { Heart, X } from "lucide-react";
// import { useNavigate } from "react-router-dom";

// const SingleProductCard = ({ product }) => {
//   const navigate = useNavigate();

//   const discount = product.oldPrice && product.price && product.oldPrice > product.price
//     ? Math.round(((product.oldPrice - product.price) / product.oldPrice) * 100)
//     : product.discount || 0;

//   const rating    = Number(product.rating) || 0;
//   const inStock   = product.countInStock > 0;
//   const mainImage = (product.images && product.images[0]) || product.img || "";

//   return (
//     <>
//       <style>{`
//         /* ৩২০px থেকে ৩৭৫px এর মধ্যে ইমেজ সেকশন হাইড হবে */
//         @media (min-width: 320px) and (max-width: 375px) {
//           .spc-image { 
//             display: none !important; 
//           }
//           .info-section {
//             padding-left: 15px !important;
//             padding-right: 15px !important;
//             text-align: left;
//           }
//         }
//       `}</style>

//       <div
//         className="w-full bg-white rounded-xl border border-gray-100 overflow-hidden cursor-pointer group/card hover:shadow-lg transition-shadow duration-300 mb-3"
//         onClick={() => navigate(`/product/${product._id}`)}
//       >
//         <div className="flex flex-row">

//           {/* Image section — hidden between 320px and 375px */}
//           <div className="spc-image relative w-[160px] sm:w-[200px] h-[160px] sm:h-[180px] flex-shrink-0 bg-gray-50 overflow-hidden">
//             <img
//               src={mainImage}
//               alt={product.name}
//               className="w-full h-full object-cover group-hover/card:scale-105 transition-transform duration-500"
//             />

//             {discount > 0 && (
//               <span className="absolute top-2 left-2 bg-[#2bbef9] text-white text-[10px] font-bold px-2 py-0.5 rounded">
//                 {discount}%
//               </span>
//             )}

//             <div className="absolute top-2 right-2 flex flex-col gap-1.5">
//               <button onClick={e => { e.stopPropagation(); }} className="w-7 h-7 bg-white rounded-full shadow flex items-center justify-center hover:bg-red-50 hover:text-red-400 transition-colors">
//                 <X size={13} strokeWidth={2.5} />
//               </button>
//               <button onClick={e => { e.stopPropagation(); }} className="w-7 h-7 bg-white rounded-full shadow flex items-center justify-center hover:bg-red-50 hover:text-red-400 transition-colors">
//                 <Heart size={13} strokeWidth={2} />
//               </button>
//             </div>
//           </div>

//           {/* Info section */}
//           <div className="info-section flex flex-col justify-center px-5 py-4 flex-1">
//             <h4 className="text-[14px] font-semibold text-gray-800 leading-snug line-clamp-2 mb-1">
//               {product.name}
//             </h4>

//             <p className={`text-[11px] font-bold mb-1.5 ${inStock ? "text-green-500" : "text-red-400"}`}>
//               {inStock ? "In Stock" : "Out of Stock"}
//             </p>

//             <div className="flex items-center gap-0.5 mb-2">
//               {[...Array(5)].map((_, i) => (
//                 <svg key={i} width="13" height="13" viewBox="0 0 24 24" fill={i < Math.round(rating) ? "#f59e0b" : "none"} stroke="#f59e0b" strokeWidth="2">
//                   <polygon points="12,2 15.09,8.26 22,9.27 17,14.14 18.18,21.02 12,17.77 5.82,21.02 7,14.14 2,9.27 8.91,8.26" />
//                 </svg>
//               ))}
//             </div>

//             <div className="flex items-center gap-2">
//               {product.oldPrice > 0 && (
//                 <span className="text-gray-400 line-through text-[13px]">
//                   Rs {Number(product.oldPrice).toLocaleString()}
//                 </span>
//               )}
//               <span className="text-[#e53935] font-bold text-[15px]">
//                 Rs {Number(product.price).toLocaleString()}
//               </span>
//             </div>
//           </div>

//         </div>
//       </div>
//     </>
//   );
// };

// export default SingleProductCard;
















// import { Heart, X } from "lucide-react";
// import { useNavigate } from "react-router-dom";

// const SingleProductCard = ({ product, onQuickView }) => {
//   const navigate = useNavigate();

//   const discount = product.oldPrice && product.price && product.oldPrice > product.price
//     ? Math.round(((product.oldPrice - product.price) / product.oldPrice) * 100)
//     : product.discount || 0;

//   const rating    = Number(product.rating) || 0;
//   const inStock   = product.countInStock > 0;
//   const mainImage = (product.images && product.images[0]) || product.img || "";

//   return (
//     <div
//       className="w-full bg-white rounded-xl border border-gray-100 overflow-hidden cursor-pointer group/card hover:shadow-lg transition-shadow duration-300 mb-3"
//       onClick={() => navigate(`/product/${product._id}`)}
//     >
//       <div className="flex flex-row">

//         {/* Image section */}
//         <div className="relative w-[200px] h-[180px] flex-shrink-0 bg-gray-50 overflow-hidden">
//           <img
//             src={mainImage}
//             alt={product.name}
//             className="w-full h-full object-cover group-hover/card:scale-105 transition-transform duration-500"
//           />

//           {/* Discount badge — top left */}
//           {discount > 0 && (
//             <span className="absolute top-2 left-2 bg-[#2bbef9] text-white text-[10px] font-bold px-2 py-0.5 rounded">
//               {discount}%
//             </span>
//           )}

//           {/* X + Heart — top right */}
//           <div className="absolute top-2 right-2 flex flex-col gap-1.5">
//             <button
//               onClick={e => { e.stopPropagation(); }}
//               className="w-7 h-7 bg-white rounded-full shadow flex items-center justify-center hover:bg-red-50 hover:text-red-400 transition-colors"
//             >
//               <X size={13} strokeWidth={2.5} />
//             </button>
//             <button
//               onClick={e => { e.stopPropagation(); }}
//               className="w-7 h-7 bg-white rounded-full shadow flex items-center justify-center hover:bg-red-50 hover:text-red-400 transition-colors"
//             >
//               <Heart size={13} strokeWidth={2} />
//             </button>
//           </div>
//         </div>

//         {/* Info section */}
//         <div className="flex flex-col justify-center px-5 py-4 flex-1">
//           <h4 className="text-[14px] font-semibold text-gray-800 leading-snug line-clamp-2 mb-1">
//             {product.name}
//           </h4>

//           <p className={`text-[11px] font-bold mb-1.5 ${inStock ? "text-green-500" : "text-red-400"}`}>
//             {inStock ? "In Stock" : "Out of Stock"}
//           </p>

//           {/* Stars */}
//           <div className="flex items-center gap-0.5 mb-2">
//             {[...Array(5)].map((_, i) => (
//               <svg key={i} width="13" height="13" viewBox="0 0 24 24" fill={i < Math.round(rating) ? "#f59e0b" : "none"} stroke="#f59e0b" strokeWidth="2">
//                 <polygon points="12,2 15.09,8.26 22,9.27 17,14.14 18.18,21.02 12,17.77 5.82,21.02 7,14.14 2,9.27 8.91,8.26" />
//               </svg>
//             ))}
//           </div>

//           {/* Price */}
//           <div className="flex items-center gap-2">
//             {product.oldPrice > 0 && (
//               <span className="text-gray-400 line-through text-[13px]">
//                 Rs {Number(product.oldPrice).toLocaleString()}
//               </span>
//             )}
//             <span className="text-[#e53935] font-bold text-[15px]">
//               Rs {Number(product.price).toLocaleString()}
//             </span>
//           </div>
//         </div>

//       </div>
//     </div>
//   );
// };

// export default SingleProductCard;