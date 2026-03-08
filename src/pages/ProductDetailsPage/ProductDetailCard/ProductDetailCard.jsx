// // import React, { useState } from "react";
// // import { 
// //   Heart, 
// //   ShoppingCart, 
// //   Star, 
// //   ChevronLeft, 
// //   ChevronRight, 
// //   MapPin, 
// //   ShieldCheck 
// // } from "lucide-react";

// // const ProductDetailsCard = ({ product }) => {
// //   const [selectedImg, setSelectedImg] = useState(0);
// //   const [quantity, setQuantity] = useState(1);

// //   // Data processing based on your object
// //   const images = product?.images || [];
// //   const realPrice = product?.price || 0;
// //   const oldPrice = Math.round(realPrice / 0.88); // Mocking discount logic
// //   const discount = 12; // As per your screenshot
// //   const inStock = (product?.countInStock || 0) > 0;

// //   const nextImage = () => setSelectedImg((prev) => (prev + 1) % images.length);
// //   const prevImage = () => setSelectedImg((prev) => (prev - 1 + images.length) % images.length);

// //   return (
// //     <div className="max-w-6xl mx-auto p-4 md:p-8 bg-[#F9FAFB] min-h-screen">
// //       <div className="bg-white rounded-[32px] shadow-xl overflow-hidden border border-gray-100 flex flex-col md:flex-row">
        
// //         {/* Left: Image Gallery */}
// //         <div className="w-full md:w-1/2 p-6 bg-[#F1F1F1]">
// //           <div className="relative aspect-square rounded-2xl overflow-hidden group shadow-inner">
// //             <img
// //               src={images[selectedImg]}
// //               alt={product?.name}
// //               className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
// //             />
            
// //             {/* Discount Tag */}
// //             <div className="absolute top-4 left-4 bg-[#38BDF8] text-white px-3 py-1 rounded-full font-bold text-sm">
// //               {discount}% OFF
// //             </div>

// //             {/* Navigation Arrows */}
// //             {images.length > 1 && (
// //               <>
// //                 <button onClick={prevImage} className="absolute left-3 top-1/2 -translate-y-1/2 bg-white/80 p-2 rounded-full hover:bg-white shadow-md">
// //                   <ChevronLeft size={20} />
// //                 </button>
// //                 <button onClick={nextImage} className="absolute right-3 top-1/2 -translate-y-1/2 bg-white/80 p-2 rounded-full hover:bg-white shadow-md">
// //                   <ChevronRight size={20} />
// //                 </button>
// //               </>
// //             )}
// //           </div>

// //           {/* Thumbnails */}
// //           <div className="flex gap-3 mt-4 overflow-x-auto pb-2">
// //             {images.map((img, idx) => (
// //               <button
// //                 key={idx}
// //                 onClick={() => setSelectedImg(idx)}
// //                 className={`w-20 h-20 rounded-lg overflow-hidden border-2 transition-all ${
// //                   selectedImg === idx ? "border-[#38BDF8] scale-95" : "border-transparent opacity-70"
// //                 }`}
// //               >
// //                 <img src={img} alt="thumb" className="w-full h-full object-cover" />
// //               </button>
// //             ))}
// //           </div>
// //         </div>

// //         {/* Right: Product Info */}
// //         <div className="w-full md:w-1/2 p-8 md:p-12 flex flex-col justify-center">
// //           <div className="space-y-6">
// //             <div>
// //               <div className="flex items-center gap-2 mb-2">
// //                 <span className="bg-gray-100 text-gray-600 text-[10px] uppercase tracking-widest px-2 py-1 rounded font-bold">
// //                   {product?.brand || "Premium Brand"}
// //                 </span>
// //                 <span className="flex items-center gap-1 text-[#4CAF50] text-sm font-medium">
// //                   <ShieldCheck size={14} /> Official Store
// //                 </span>
// //               </div>
// //               <h1 className="text-3xl md:text-4xl font-bold text-gray-900 capitalize leading-tight">
// //                 {product?.name || "Product Name"}
// //               </h1>
// //             </div>

// //             {/* Rating & Stock */}
// //             <div className="flex items-center gap-4">
// //               <div className="flex items-center gap-1 bg-[#FFFBEB] px-3 py-1 rounded-lg border border-[#FEF3C7]">
// //                 <Star size={18} fill="#FFB400" className="text-[#FFB400]" />
// //                 <span className="font-bold text-gray-800">{product?.rating || 5}</span>
// //                 <span className="text-gray-400 text-sm">({product?.numReviews || 0} Reviews)</span>
// //               </div>
// //               <div className={`text-sm font-semibold ${inStock ? "text-[#4CAF50]" : "text-red-500"}`}>
// //                 {inStock ? "● In Stock" : "○ Out of Stock"}
// //               </div>
// //             </div>

// //             {/* Price Section - Aesthetic Look */}
// //             <div className="flex items-end gap-3 p-4 bg-gray-50 rounded-2xl border border-gray-100">
// //               <span className="text-4xl font-black text-[#D32F2F]">
// //                 Rs {realPrice}
// //               </span>
// //               <span className="text-xl text-gray-400 line-through mb-1">
// //                 Rs {oldPrice}
// //               </span>
// //             </div>

// //             <p className="text-gray-600 leading-relaxed line-clamp-3">
// //               {product?.description || "High-quality material with premium stitching. Perfect for daily wear or special occasions."}
// //             </p>

// //             <div className="flex items-center gap-2 text-gray-500 text-sm">
// //               <MapPin size={16} className="text-[#38BDF8]" />
// //               <span>Location: <span className="text-gray-800 font-medium capitalize">{product?.location || "Dhaka"}</span></span>
// //             </div>

// //             {/* Action Buttons */}
// //             <div className="flex flex-col sm:flex-row gap-4 pt-4">
// //               <div className="flex items-center border border-gray-200 rounded-xl overflow-hidden h-14">
// //                 <button onClick={() => setQuantity(q => Math.max(1, q-1))} className="px-4 hover:bg-gray-100">-</button>
// //                 <span className="px-6 font-bold">{quantity}</span>
// //                 <button onClick={() => setQuantity(q => q+1)} className="px-4 hover:bg-gray-100">+</button>
// //               </div>
              
// //               <button className="flex-1 bg-[#222] text-white rounded-xl font-bold flex items-center justify-center gap-3 hover:bg-black transition-all shadow-lg shadow-gray-200 h-14">
// //                 <ShoppingCart size={20} />
// //                 Add to Cart
// //               </button>
              
// //               <button 
// //                 onClick={() => setIsWished(!isWished)}
// //                 className={`p-4 rounded-xl border transition-all ${isWished ? "bg-red-50 border-red-100 text-red-500" : "bg-white border-gray-200 text-gray-400 hover:text-red-500"}`}
// //               >
// //                 <Heart size={24} fill={isWished ? "currentColor" : "none"} />
// //               </button>
// //             </div>
// //           </div>
// //         </div>
// //       </div>
// //     </div>
// //   );
// // };

// // export default ProductDetailsCard;

















// import { useState } from "react";
// import {
//   Heart, ArrowLeftRight, ShoppingCart, Shield,
//   Truck, RotateCcw, Star, ChevronRight, Minus, Plus, Check, Zap, Share2
// } from "lucide-react";
// import ProductImageGallery from "../../../Components/Shared/ProductImageGallery/ProductImageGallery";

// const ProductDetailCard = ({ product }) => {
//   const [quantity, setQuantity] = useState(1);
//   const [isWished, setIsWished] = useState(false);
//   const [addedToCart, setAddedToCart] = useState(false);

//   if (!product) return null;

//   const images = product.images || [];
//   const realPrice = Number(product.price);
//   const oldPrice = product.oldPrice && product.oldPrice > realPrice ? Number(product.oldPrice) : null;
//   const discount = oldPrice ? Math.round(((oldPrice - realPrice) / oldPrice) * 100) : null;
//   const inStock = product.countInStock > 0;
//   const rating = Math.min(5, Math.max(0, Number(product.rating) || 0));

//   const handleAddToCart = () => {
//     setAddedToCart(true);
//     setTimeout(() => setAddedToCart(false), 2000);
//   };

//   return (
//     <div className="max-w-7xl mx-auto p-4 lg:p-8 bg-white rounded-[32px] shadow-sm border border-gray-100 font-sans">
//       <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16 ">
        
//         {/* ── LEFT: GALLERY SECTION ── */}
//         <div className="sticky top-8">
//           <div className="relative group">
//             <ProductImageGallery images={images} />
//             {discount && (
//               <div className="absolute top-4 left-4 z-10 bg-black text-white text-[10px] font-black px-3 py-1.5 rounded-full tracking-tighter uppercase">
//                 Save {discount}%
//               </div>
//             )}
//           </div>
//         </div>

//         {/* ── RIGHT: PRODUCT INFO ── */}
//         <div className="flex flex-col pt-2">
//           {/* Top Meta */}
//           <div className="flex items-center justify-between mb-6">
//             <nav className="flex items-center gap-2 text-[11px] font-bold tracking-[0.1em] uppercase text-slate-400">
//               <span className="hover:text-black cursor-pointer transition-colors">Shop</span>
//               <ChevronRight size={12} className="opacity-50" />
//               <span className="text-slate-900">{product.category?.name || "General"}</span>
//             </nav>
//             <button className="p-2 hover:bg-slate-50 rounded-full transition-colors text-slate-400 hover:text-black">
//               <Share2 size={18} />
//             </button>
//           </div>

//           {/* Title & Brand */}
//           <div className="mb-6">
//             <p className="text-xs font-bold text-indigo-600 uppercase tracking-widest mb-2">{product.brand || "Exclusive"}</p>
//             <h1 className="text-3xl lg:text-4xl font-extrabold text-slate-900 leading-[1.1] mb-4">
//               {product.name}
//             </h1>
//             <div className="flex items-center gap-4">
//               <div className="flex items-center bg-amber-50 px-2 py-1 rounded-lg">
//                 <Star size={14} fill="#f59e0b" className="text-amber-500" />
//                 <span className="ml-1.5 text-sm font-bold text-amber-900">{rating}</span>
//               </div>
//               <span className="text-sm text-slate-400 font-medium underline cursor-pointer hover:text-slate-600 italic">
//                 {product.numReviews || 0} customer reviews
//               </span>
//             </div>
//           </div>

//           <div className="h-px bg-slate-100 w-full mb-8" />

//           {/* Pricing Section */}
//           <div className="mb-8 p-6 bg-slate-50/50 rounded-3xl border border-slate-100">
//             <div className="flex items-baseline gap-3">
//               <span className="text-4xl font-black text-slate-900 tracking-tighter">
//                 ৳{realPrice.toLocaleString()}
//               </span>
//               {oldPrice && (
//                 <span className="text-xl text-slate-400 line-through decoration-slate-300 font-medium">
//                   ৳{oldPrice.toLocaleString()}
//                 </span>
//               )}
//             </div>
//             {inStock ? (
//               <p className="text-xs font-bold text-emerald-600 mt-3 flex items-center gap-1.5">
//                 <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
//                 Ready to Ship from {product.location || "Dhaka"}
//               </p>
//             ) : (
//               <p className="text-xs font-bold text-rose-500 mt-3 italic">Currently Out of Stock</p>
//             )}
//           </div>

//           {/* Description */}
//           <div className="mb-8">
//             <h3 className="text-sm font-bold uppercase tracking-widest mb-3 text-slate-900">Description</h3>
//             <p className="text-slate-500 text-[15px] leading-relaxed max-w-prose">
//               {product.description || "A premium selection designed for style and durability. Experience the perfect blend of functionality and modern design."}
//             </p>
//           </div>

//           {/* Selection Options (RAM/Size) */}
//           <div className="mb-10 space-y-6">
//             {(product.productRam?.length > 0 || product.productSize?.length > 0) && (
//               <div>
//                 <h3 className="text-xs font-black uppercase tracking-widest mb-4 text-slate-400">Select Variation</h3>
//                 <div className="flex flex-wrap gap-3">
//                   {[...(product.productRam || []), ...(product.productSize || [])].map((item, idx) => (
//                     <button 
//                       key={idx}
//                       className="px-5 py-2.5 rounded-xl border-2 border-slate-100 text-sm font-bold text-slate-600 hover:border-black hover:text-black transition-all active:scale-95"
//                     >
//                       {item.productRam || item.productSize}
//                     </button>
//                   ))}
//                 </div>
//               </div>
//             )}
//           </div>

//           {/* Interaction Area */}
//           <div className="flex flex-col gap-4 mb-10">
//             <div className="flex items-center gap-4">
//               {/* Modern Qty Selector */}
//               <div className="flex items-center p-1 bg-slate-100 rounded-2xl border border-slate-200">
//                 <button 
//                   onClick={() => setQuantity(q => Math.max(1, q - 1))}
//                   className="w-10 h-10 flex items-center justify-center rounded-xl hover:bg-white hover:shadow-sm transition-all text-slate-600"
//                 >
//                   <Minus size={16} strokeWidth={3} />
//                 </button>
//                 <span className="w-12 text-center text-sm font-black text-slate-900">{quantity}</span>
//                 <button 
//                   onClick={() => setQuantity(q => q + 1)}
//                   className="w-10 h-10 flex items-center justify-center rounded-xl hover:bg-white hover:shadow-sm transition-all text-slate-600"
//                 >
//                   <Plus size={16} strokeWidth={3} />
//                 </button>
//               </div>

//               {/* Action Buttons */}
//               <button
//                 onClick={handleAddToCart}
//                 disabled={!inStock}
//                 className={`flex-1 h-[52px] rounded-2xl flex items-center justify-center gap-3 text-sm font-black tracking-widest uppercase transition-all duration-500
//                   ${!inStock
//                     ? "bg-slate-100 text-slate-400 cursor-not-allowed"
//                     : addedToCart
//                       ? "bg-emerald-500 text-white shadow-lg shadow-emerald-200"
//                       : "bg-slate-900 text-white hover:bg-black shadow-xl shadow-slate-200 active:scale-95"
//                   }`}
//               >
//                 {addedToCart ? <Check size={20} strokeWidth={3} /> : <ShoppingCart size={20} strokeWidth={2.5} />}
//                 {addedToCart ? "Success" : "Add to Cart"}
//               </button>

//               <button
//                 onClick={() => setIsWished(!isWished)}
//                 className={`w-[52px] h-[52px] rounded-2xl border-2 flex items-center justify-center transition-all group
//                   ${isWished ? "border-rose-100 bg-rose-50" : "border-slate-100 hover:border-rose-200 hover:bg-rose-50/30"}`}
//               >
//                 <Heart 
//                   size={20} 
//                   fill={isWished ? "#f43f5e" : "none"} 
//                   className={isWished ? "text-rose-500" : "text-slate-300 group-hover:text-rose-400"} 
//                 />
//               </button>
//             </div>

//             <button className="w-full h-[52px] rounded-2xl bg-indigo-50 text-indigo-700 hover:bg-indigo-100 transition-all flex items-center justify-center gap-2 text-sm font-black uppercase tracking-[0.2em]">
//               <Zap size={18} fill="currentColor" /> Buy it Now
//             </button>
//           </div>

//           {/* Trust Badges: Premium Style */}
//           <div className="grid grid-cols-3 gap-4 py-8 border-y border-slate-100 mb-8">
//             {[
//               { icon: <Truck size={20} />, label: "Express", sub: "Delivery", color: "text-blue-600" },
//               { icon: <Shield size={20} />, label: "Lifetime", sub: "Warranty", color: "text-emerald-600" },
//               { icon: <RotateCcw size={20} />, label: "30 Days", sub: "Returns", color: "text-indigo-600" },
//             ].map((item, i) => (
//               <div key={i} className="flex flex-col items-center text-center group cursor-default">
//                 <div className={`${item.color} mb-2 group-hover:scale-110 transition-transform duration-300`}>
//                   {item.icon}
//                 </div>
//                 <span className="text-[10px] font-black uppercase tracking-tighter text-slate-900 leading-none">{item.label}</span>
//                 <span className="text-[9px] font-bold text-slate-400 uppercase tracking-widest">{item.sub}</span>
//               </div>
//             ))}
//           </div>

//           {/* Meta Data */}
//           <div className="space-y-3">
//             <div className="flex items-center gap-3 text-[12px]">
//               <span className="text-slate-400 font-bold uppercase tracking-widest w-20">SKU:</span>
//               <span className="text-slate-900 font-medium tracking-wider uppercase">{product._id?.slice(-8) || "N/A-001"}</span>
//             </div>
//             <div className="flex items-center gap-3 text-[12px]">
//               <span className="text-slate-400 font-bold uppercase tracking-widest w-20">Category:</span>
//               <span className="text-slate-900 font-medium">{product.category?.name}</span>
//             </div>
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default ProductDetailCard;




import { useState } from "react";
import { Heart, ArrowLeftRight, ShoppingCart, Star, Minus, Plus } from "lucide-react";
import ProductImageGallery from "../../../Components/Shared/ProductImageGallery/ProductImageGallery";

const ProductDetailCard = ({ product }) => {
  const [quantity, setQuantity]       = useState(1);
  const [isWished, setIsWished]       = useState(false);
  const [addedToCart, setAddedToCart] = useState(false);

  if (!product) return null;

  const images    = product.images || [];
  const realPrice = Number(product.price);
  const oldPrice  = product.oldPrice && product.oldPrice > realPrice ? Number(product.oldPrice) : null;
  const discount  = oldPrice ? Math.round(((oldPrice - realPrice) / oldPrice) * 100) : null;
  const inStock   = product.countInStock > 0;
  const rating    = Math.min(5, Math.max(0, Number(product.rating) || 0));

  const handleAddToCart = () => {
    setAddedToCart(true);
    setTimeout(() => setAddedToCart(false), 2000);
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12 items-start">

      {/* LEFT — Image Gallery */}
      <div className="relative">
        {/* Discount badge */}
        {discount && (
          <div className="absolute top-3 left-3 z-10 bg-sky-400 text-white text-xs font-bold px-2.5 py-1 rounded-full">
            {discount}%
          </div>
        )}
        <ProductImageGallery images={images} />
      </div>

      {/* RIGHT — Product Info */}
      <div className="flex flex-col gap-3">

        {/* Title */}
        <h1 className="text-2xl sm:text-3xl font-semibold text-gray-900 leading-snug">
          {product.name}
        </h1>

        {/* Brand + Rating */}
        <div className="flex items-center gap-2 flex-wrap text-sm text-gray-600">
          {product.brand && (
            <span>Brands : <span className="font-semibold text-gray-800">{product.brand}</span></span>
          )}
          <div className="flex items-center gap-1 ml-1">
            {[...Array(5)].map((_, i) => (
              <Star
                key={i}
                size={14}
                fill={i < Math.round(rating) ? "#f59e0b" : "none"}
                className={i < Math.round(rating) ? "text-amber-400" : "text-gray-300"}
              />
            ))}
          </div>
          <span className="text-gray-500 text-sm">{rating} Review</span>
        </div>

        {/* Price */}
        <div className="flex items-center gap-3">
          {oldPrice && (
            <span className="text-gray-400 line-through text-base">
              Rs: {oldPrice.toLocaleString()}
            </span>
          )}
          <span className="text-xl font-bold text-red-500">
            Rs: {realPrice.toLocaleString()}
          </span>
        </div>

        {/* Stock */}
        <div>
          {inStock ? (
            <span className="inline-block text-xs font-semibold text-green-600 border border-green-500 px-3 py-1 rounded-full">
              IN STOCK
            </span>
          ) : (
            <span className="inline-block text-xs font-semibold text-red-500 border border-red-400 px-3 py-1 rounded-full">
              OUT OF STOCK
            </span>
          )}
        </div>

        {/* Description */}
        {product.description && (
          <p className="text-gray-600 text-sm leading-relaxed">
            {product.description}
          </p>
        )}

        {/* Attributes */}
        {(product.productSize?.length > 0) && (
          <div className="flex items-center gap-2 flex-wrap">
            <span className="text-sm font-medium text-gray-700">Size:</span>
            {product.productSize.map(s => (
              <button key={s._id} className="px-3 py-1 text-sm border border-gray-300 rounded hover:border-gray-900 transition-colors">
                {s.productSize}
              </button>
            ))}
          </div>
        )}
        {(product.productRam?.length > 0) && (
          <div className="flex items-center gap-2 flex-wrap">
            <span className="text-sm font-medium text-gray-700">RAM:</span>
            {product.productRam.map(r => (
              <button key={r._id} className="px-3 py-1 text-sm border border-gray-300 rounded hover:border-gray-900 transition-colors">
                {r.productRam}
              </button>
            ))}
          </div>
        )}
        {(product.productWeight?.length > 0) && (
          <div className="flex items-center gap-2 flex-wrap">
            <span className="text-sm font-medium text-gray-700">Weight:</span>
            {product.productWeight.map(w => (
              <button key={w._id} className="px-3 py-1 text-sm border border-gray-300 rounded hover:border-gray-900 transition-colors">
                {w.productWeight}
              </button>
            ))}
          </div>
        )}

        {/* Quantity + Add to Cart + Wishlist + Compare */}
        <div className="flex items-center gap-2 flex-wrap mt-1">

          {/* Qty */}
          <div className="flex items-center border border-gray-200 rounded-full overflow-hidden bg-gray-50">
            <button
              onClick={() => setQuantity(q => Math.max(1, q - 1))}
              className="w-9 h-10 flex items-center justify-center text-gray-500 hover:bg-gray-200 transition-colors"
            >
              <Minus size={13} />
            </button>
            <span className="w-8 text-center text-sm font-semibold text-gray-800 select-none">
              {quantity}
            </span>
            <button
              onClick={() => setQuantity(q => q + 1)}
              className="w-9 h-10 flex items-center justify-center text-gray-500 hover:bg-gray-200 transition-colors"
            >
              <Plus size={13} />
            </button>
          </div>

          {/* Add to Cart */}
          <button
            onClick={handleAddToCart}
            disabled={!inStock}
            className={`flex items-center gap-2 px-6 py-2.5 rounded-full text-sm font-semibold transition-all
              ${!inStock
                ? "bg-gray-200 text-gray-400 cursor-not-allowed"
                : addedToCart
                  ? "bg-green-500 text-white"
                  : "bg-red-500 text-white hover:bg-red-600"
              }`}
          >
            <ShoppingCart size={15} />
            {addedToCart ? "Added!" : "Add To Cart"}
          </button>

          {/* Wishlist */}
          <button
            onClick={() => setIsWished(w => !w)}
            className="w-10 h-10 rounded-full border border-gray-200 flex items-center justify-center hover:border-red-300 transition-colors"
          >
            <Heart
              size={16}
              fill={isWished ? "#ef4444" : "none"}
              className={isWished ? "text-red-500" : "text-gray-400"}
            />
          </button>

          {/* Compare */}
          <button className="w-10 h-10 rounded-full border border-gray-200 flex items-center justify-center hover:border-gray-400 transition-colors">
            <ArrowLeftRight size={15} className="text-gray-400" />
          </button>
        </div>

      </div>
    </div>
  );
};

export default ProductDetailCard;