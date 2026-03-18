import React, { useState, useEffect, useContext } from "react";
import { Heart, Minus, Plus, X, ShoppingCart, ArrowLeftRight, Share2, Check } from "lucide-react";
import { FaStar, FaRegStar } from "react-icons/fa";
import ProductImageZoom from "../../../Components/Shared/ProductImageZoom/ProductImageZoom";
import { useAuth } from "../../../context/AuthContext";
import { useCart } from "../../../context/CartContext";
import { StoreContext } from "../../../context/StoreContext";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";

const ProductQuickView = ({ product, onClose }) => {
  const [selectedImg, setSelectedImg] = useState(product?.images?.[0] || null);
  const [quantity, setQuantity]       = useState(1);
  const [visible, setVisible]         = useState(false);
  const [adding, setAdding]           = useState(false);
  const [wishLoading, setWishLoading] = useState(false);

  const { isLoggedIn, token }                               = useAuth();
  const { addToCart, isInCart }                             = useCart();
  const { addToMyList, removeFromMyList, isInMyList, getMyListItem } = useContext(StoreContext);
  const navigate = useNavigate();

  useEffect(() => {
    setTimeout(() => setVisible(true), 10);
  }, []);

  const handleClose = () => {
    setVisible(false);
    setTimeout(onClose, 300);
  };

  if (!product) return null;

  const images     = product.images?.length > 0 ? product.images : [];
  const realPrice  = Number(product.price) || 0;
  const oldPrice   = product.oldPrice ? Number(product.oldPrice) : Math.round(realPrice / 0.88);
  const discount   = oldPrice > realPrice ? Math.round(((oldPrice - realPrice) / oldPrice) * 100) : 0;
  const inStock    = product.countInStock > 0;
  const rating     = Math.min(5, Math.round(product.rating || 0));
  const categoryName = product.category?.name || product.category || "General";
  const brand      = product.brand || "—";
  const subCat     = product.subCat?.subCat || product.subCat || null;

  const alreadyInCart = isInCart?.(product._id);
  const isWished      = isInMyList?.(product._id);

  // ── Add to Cart ──
  const handleAddToCart = async () => {
    if (!isLoggedIn) { navigate("/login"); return; }
    if (!inStock) return;
    setAdding(true);
    try {
      await addToCart(product, quantity);
    } finally {
      setAdding(false);
    }
  };

  // ── Wishlist toggle ──
  const handleWishlist = async () => {
    if (!isLoggedIn) { navigate("/login"); return; }
    setWishLoading(true);
    try {
      if (isWished) {
        const item = getMyListItem(product._id);
        await removeFromMyList(item._id, token);
      } else {
        await addToMyList(product, token);
      }
    } finally {
      setWishLoading(false);
    }
  };

  return (
    <div
      className="fixed inset-0 z-[200] flex items-center justify-center p-4"
      style={{ backgroundColor: `rgba(0,0,0,${visible ? 0.65 : 0})`, transition: "background-color 0.3s ease" }}
      onClick={handleClose}
    >
      <div
        className="bg-white w-full max-w-[920px] max-h-[92vh] overflow-y-auto rounded-3xl relative shadow-2xl"
        style={{
          transform: visible ? "scale(1) translateY(0)" : "scale(0.94) translateY(24px)",
          opacity: visible ? 1 : 0,
          transition: "transform 0.3s cubic-bezier(0.34,1.56,0.64,1), opacity 0.3s ease",
        }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* accent bar */}
        <div className="h-1 w-full rounded-t-3xl bg-gradient-to-r from-blue-500 via-violet-500 to-pink-500" />

        {/* Close */}
        <button
          onClick={handleClose}
          className="absolute top-4 right-4 z-20 w-9 h-9 bg-gray-100 hover:bg-red-500 hover:text-white text-gray-500 rounded-full flex items-center justify-center transition-all duration-200 shadow-sm"
        >
          <X size={17} />
        </button>

        <div className="flex flex-col md:flex-row gap-0">

          {/* LEFT: Image Gallery */}
          <div className="w-full md:w-[45%] bg-gray-50 rounded-bl-3xl p-6 flex flex-col gap-4">
            <div className="relative rounded-2xl overflow-hidden bg-white border border-gray-100 flex items-center justify-center" style={{ height: "340px" }}>
              {selectedImg
                ? <ProductImageZoom Image={selectedImg} />
                : <div className="text-gray-300 text-sm">No Image</div>
              }
              <div className="absolute top-3 left-3 flex flex-col gap-1.5 z-10">
                {discount > 0 && (
                  <span className="bg-gradient-to-r from-blue-500 to-cyan-400 text-white text-[10px] font-black px-2.5 py-1 rounded-full shadow">
                    -{discount}%
                  </span>
                )}
                {product.isFeatured && (
                  <span className="bg-gradient-to-r from-violet-500 to-purple-500 text-white text-[9px] uppercase font-black px-2.5 py-1 rounded-full shadow">
                    Featured
                  </span>
                )}
              </div>
              <div className="absolute top-3 right-3 z-10">
                <span className={`text-[9px] font-black uppercase px-2.5 py-1 rounded-full ${
                  inStock
                    ? "bg-emerald-50 text-emerald-600 border border-emerald-200"
                    : "bg-red-50 text-red-500 border border-red-200"
                }`}>
                  {inStock ? "In Stock" : "Out of Stock"}
                </span>
              </div>
            </div>

            {images.length > 1 && (
              <div className="flex gap-2 flex-wrap">
                {images.map((img, idx) => (
                  <button key={idx} onClick={() => setSelectedImg(img)}
                    className={`w-14 h-14 rounded-xl overflow-hidden border-2 transition-all duration-200 ${
                      selectedImg === img ? "border-blue-500 scale-105 shadow-md" : "border-gray-200 hover:border-gray-400"
                    }`}
                  >
                    <img src={img} alt={`thumb-${idx}`} className="w-full h-full object-cover" />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* RIGHT: Product Info */}
          <div className="w-full md:w-[55%] p-7 flex flex-col gap-5">

            {/* Category + Brand */}
            <div className="flex items-center gap-2 flex-wrap">
              <span className="text-[10px] font-black uppercase tracking-[2px] text-blue-500 bg-blue-50 px-2.5 py-0.5 rounded-full border border-blue-100">
                {categoryName}
              </span>
              {subCat && (
                <span className="text-[10px] font-black uppercase tracking-[2px] text-violet-500 bg-violet-50 px-2.5 py-0.5 rounded-full border border-violet-100">
                  {subCat}
                </span>
              )}
              <span className="text-[10px] text-gray-400 font-semibold ml-auto">
                Brand: <span className="text-gray-700">{brand}</span>
              </span>
            </div>

            {/* Name */}
            <h2 className="text-[20px] font-black text-gray-900 leading-snug tracking-tight">
              {product.name}
            </h2>

            {/* Rating */}
            <div className="flex items-center gap-2">
              <div className="flex items-center gap-0.5">
                {[1, 2, 3, 4, 5].map((s) =>
                  s <= rating
                    ? <FaStar key={s} size={13} className="text-amber-400" />
                    : <FaRegStar key={s} size={13} className="text-gray-200" />
                )}
              </div>
              <span className="text-[12px] text-gray-400 font-semibold">{rating}.0 / 5.0</span>
            </div>

            {/* Price */}
            <div className="flex items-end gap-3">
              {oldPrice > realPrice && (
                <span className="text-[15px] text-gray-300 line-through font-medium">
                  ৳{oldPrice.toLocaleString()}
                </span>
              )}
              <span className="text-[32px] font-black text-gray-900 leading-none">
                ৳{realPrice.toLocaleString()}
              </span>
              {discount > 0 && (
                <span className="text-[11px] font-black text-emerald-600 bg-emerald-50 border border-emerald-200 px-2 py-0.5 rounded-full mb-1">
                  Save {discount}%
                </span>
              )}
            </div>

            <div className="w-full h-px bg-gradient-to-r from-blue-100 via-violet-100 to-transparent" />

            {/* Description */}
            {product.description && (
              <p className="text-[13px] text-gray-500 leading-relaxed line-clamp-3">
                {product.description}
              </p>
            )}

            {/* Quick info */}
            <div className="grid grid-cols-2 gap-2">
              {[
                { label: "Stock",    value: product.countInStock || 0, unit: "pcs" },
                { label: "Location", value: product.location || "—" },
                product.productRam?.name    && { label: "RAM",    value: product.productRam.name    },
                product.productSize?.name   && { label: "Size",   value: product.productSize.name   },
                product.productWeight?.name && { label: "Weight", value: product.productWeight.name },
              ].filter(Boolean).map((item, i) => (
                <div key={i} className="flex items-center gap-2 bg-gray-50 rounded-xl px-3 py-2">
                  <Check size={12} className="text-emerald-500 shrink-0" />
                  <span className="text-[11px] text-gray-400">{item.label}:</span>
                  <span className="text-[11px] font-bold text-gray-700 ml-auto">
                    {item.value}{item.unit ? ` ${item.unit}` : ""}
                  </span>
                </div>
              ))}
            </div>

            {/* Quantity + Add to Cart */}
            <div className="flex items-center gap-3">
              <div className="flex items-center bg-gray-50 border border-gray-200 rounded-2xl px-3 py-2 gap-3">
                <button
                  onClick={() => setQuantity(Math.max(1, quantity - 1))}
                  className="w-7 h-7 rounded-full bg-white border border-gray-200 flex items-center justify-center text-gray-500 hover:border-gray-400 transition-all"
                >
                  <Minus size={13} />
                </button>
                <span className="text-[15px] font-black text-gray-800 min-w-[24px] text-center">{quantity}</span>
                <button
                  onClick={() => {
                    if (quantity < product.countInStock) {
                      setQuantity(quantity + 1);
                    } else {
                      toast.error(`সর্বোচ্চ ${product.countInStock} টি add করা যাবে`);
                    }
                  }}
                  className="w-7 h-7 rounded-full bg-white border border-gray-200 flex items-center justify-center text-gray-500 hover:border-gray-400 transition-all"
                >
                  <Plus size={13} />
                </button>
              </div>

              <button
                onClick={handleAddToCart}
                disabled={!inStock || adding}
                className={`flex-1 flex items-center justify-center gap-2 py-3 rounded-2xl font-black text-[13px] uppercase tracking-wider transition-all duration-300 shadow-lg active:scale-95 ${
                  alreadyInCart
                    ? "bg-emerald-500 text-white shadow-emerald-200"
                    : inStock
                    ? "bg-gradient-to-r from-blue-600 to-violet-600 text-white hover:shadow-blue-200 hover:scale-[1.02]"
                    : "bg-gray-100 text-gray-400 cursor-not-allowed shadow-none"
                }`}
              >
                {adding
                  ? <><ShoppingCart size={16} className="animate-pulse" /> Adding...</>
                  : alreadyInCart
                  ? <><Check size={16} /> In Cart</>
                  : <><ShoppingCart size={16} /> Add to Cart</>
                }
              </button>
            </div>

            {/* Wishlist + Compare + Share */}
            <div className="flex items-center gap-4 pt-1">
              <button
                onClick={handleWishlist}
                disabled={wishLoading}
                className="flex items-center gap-1.5 text-[11px] font-bold text-gray-500 hover:text-red-500 transition-colors uppercase tracking-wider disabled:opacity-50"
              >
                <Heart
                  size={15}
                  fill={isWished ? "#EF4444" : "none"}
                  className={isWished ? "text-red-500" : ""}
                />
                {isWished ? "Wishlisted" : "Wishlist"}
              </button>
              <div className="w-px h-4 bg-gray-200" />
              <button className="flex items-center gap-1.5 text-[11px] font-bold text-gray-500 hover:text-blue-500 transition-colors uppercase tracking-wider">
                <ArrowLeftRight size={15} /> Compare
              </button>
              <div className="w-px h-4 bg-gray-200" />
              <button className="flex items-center gap-1.5 text-[11px] font-bold text-gray-500 hover:text-violet-500 transition-colors uppercase tracking-wider">
                <Share2 size={15} /> Share
              </button>
            </div>

          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductQuickView;



























// import React, { useState, useEffect, useContext } from "react";
// import { Heart, Minus, Plus, X, ShoppingCart, ArrowLeftRight, Share2, Check } from "lucide-react";
// import { FaStar, FaRegStar } from "react-icons/fa";
// import ProductImageZoom from "../../../Components/Shared/ProductImageZoom/ProductImageZoom";
// import { useAuth } from "../../../context/AuthContext";
// import { useCart } from "../../../context/CartContext";
// import { StoreContext } from "../../../context/StoreContext";
// import { useNavigate } from "react-router-dom";

// const ProductQuickView = ({ product, onClose }) => {
//   const [selectedImg, setSelectedImg] = useState(product?.images?.[0] || null);
//   const [quantity, setQuantity]       = useState(1);
//   const [visible, setVisible]         = useState(false);
//   const [adding, setAdding]           = useState(false);
//   const [wishLoading, setWishLoading] = useState(false);

//   const { isLoggedIn, token }                               = useAuth();
//   const { addToCart, isInCart }                             = useCart();
//   const { addToMyList, removeFromMyList, isInMyList, getMyListItem } = useContext(StoreContext);
//   const navigate = useNavigate();

//   useEffect(() => {
//     setTimeout(() => setVisible(true), 10);
//   }, []);

//   const handleClose = () => {
//     setVisible(false);
//     setTimeout(onClose, 300);
//   };

//   if (!product) return null;

//   const images     = product.images?.length > 0 ? product.images : [];
//   const realPrice  = Number(product.price) || 0;
//   const oldPrice   = product.oldPrice ? Number(product.oldPrice) : Math.round(realPrice / 0.88);
//   const discount   = oldPrice > realPrice ? Math.round(((oldPrice - realPrice) / oldPrice) * 100) : 0;
//   const inStock    = product.countInStock > 0;
//   const rating     = Math.min(5, Math.round(product.rating || 0));
//   const categoryName = product.category?.name || product.category || "General";
//   const brand      = product.brand || "—";
//   const subCat     = product.subCat?.subCat || product.subCat || null;

//   const alreadyInCart = isInCart?.(product._id);
//   const isWished      = isInMyList?.(product._id);

//   // ── Add to Cart ──
//   const handleAddToCart = async () => {
//     if (!isLoggedIn) { navigate("/login"); return; }
//     if (!inStock) return;
//     setAdding(true);
//     try {
//       await addToCart(product, quantity);
//     } finally {
//       setAdding(false);
//     }
//   };

//   // ── Wishlist toggle ──
//   const handleWishlist = async () => {
//     if (!isLoggedIn) { navigate("/login"); return; }
//     setWishLoading(true);
//     try {
//       if (isWished) {
//         const item = getMyListItem(product._id);
//         await removeFromMyList(item._id, token);
//       } else {
//         await addToMyList(product, token);
//       }
//     } finally {
//       setWishLoading(false);
//     }
//   };

//   return (
//     <div
//       className="fixed inset-0 z-[200] flex items-center justify-center p-4"
//       style={{ backgroundColor: `rgba(0,0,0,${visible ? 0.65 : 0})`, transition: "background-color 0.3s ease" }}
//       onClick={handleClose}
//     >
//       <div
//         className="bg-white w-full max-w-[920px] max-h-[92vh] overflow-y-auto rounded-3xl relative shadow-2xl"
//         style={{
//           transform: visible ? "scale(1) translateY(0)" : "scale(0.94) translateY(24px)",
//           opacity: visible ? 1 : 0,
//           transition: "transform 0.3s cubic-bezier(0.34,1.56,0.64,1), opacity 0.3s ease",
//         }}
//         onClick={(e) => e.stopPropagation()}
//       >
//         {/* accent bar */}
//         <div className="h-1 w-full rounded-t-3xl bg-gradient-to-r from-blue-500 via-violet-500 to-pink-500" />

//         {/* Close */}
//         <button
//           onClick={handleClose}
//           className="absolute top-4 right-4 z-20 w-9 h-9 bg-gray-100 hover:bg-red-500 hover:text-white text-gray-500 rounded-full flex items-center justify-center transition-all duration-200 shadow-sm"
//         >
//           <X size={17} />
//         </button>

//         <div className="flex flex-col md:flex-row gap-0">

//           {/* LEFT: Image Gallery */}
//           <div className="w-full md:w-[45%] bg-gray-50 rounded-bl-3xl p-6 flex flex-col gap-4">
//             <div className="relative rounded-2xl overflow-hidden bg-white border border-gray-100 flex items-center justify-center" style={{ height: "340px" }}>
//               {selectedImg
//                 ? <ProductImageZoom Image={selectedImg} />
//                 : <div className="text-gray-300 text-sm">No Image</div>
//               }
//               <div className="absolute top-3 left-3 flex flex-col gap-1.5 z-10">
//                 {discount > 0 && (
//                   <span className="bg-gradient-to-r from-blue-500 to-cyan-400 text-white text-[10px] font-black px-2.5 py-1 rounded-full shadow">
//                     -{discount}%
//                   </span>
//                 )}
//                 {product.isFeatured && (
//                   <span className="bg-gradient-to-r from-violet-500 to-purple-500 text-white text-[9px] uppercase font-black px-2.5 py-1 rounded-full shadow">
//                     Featured
//                   </span>
//                 )}
//               </div>
//               <div className="absolute top-3 right-3 z-10">
//                 <span className={`text-[9px] font-black uppercase px-2.5 py-1 rounded-full ${
//                   inStock
//                     ? "bg-emerald-50 text-emerald-600 border border-emerald-200"
//                     : "bg-red-50 text-red-500 border border-red-200"
//                 }`}>
//                   {inStock ? "In Stock" : "Out of Stock"}
//                 </span>
//               </div>
//             </div>

//             {images.length > 1 && (
//               <div className="flex gap-2 flex-wrap">
//                 {images.map((img, idx) => (
//                   <button key={idx} onClick={() => setSelectedImg(img)}
//                     className={`w-14 h-14 rounded-xl overflow-hidden border-2 transition-all duration-200 ${
//                       selectedImg === img ? "border-blue-500 scale-105 shadow-md" : "border-gray-200 hover:border-gray-400"
//                     }`}
//                   >
//                     <img src={img} alt={`thumb-${idx}`} className="w-full h-full object-cover" />
//                   </button>
//                 ))}
//               </div>
//             )}
//           </div>

//           {/* RIGHT: Product Info */}
//           <div className="w-full md:w-[55%] p-7 flex flex-col gap-5">

//             {/* Category + Brand */}
//             <div className="flex items-center gap-2 flex-wrap">
//               <span className="text-[10px] font-black uppercase tracking-[2px] text-blue-500 bg-blue-50 px-2.5 py-0.5 rounded-full border border-blue-100">
//                 {categoryName}
//               </span>
//               {subCat && (
//                 <span className="text-[10px] font-black uppercase tracking-[2px] text-violet-500 bg-violet-50 px-2.5 py-0.5 rounded-full border border-violet-100">
//                   {subCat}
//                 </span>
//               )}
//               <span className="text-[10px] text-gray-400 font-semibold ml-auto">
//                 Brand: <span className="text-gray-700">{brand}</span>
//               </span>
//             </div>

//             {/* Name */}
//             <h2 className="text-[20px] font-black text-gray-900 leading-snug tracking-tight">
//               {product.name}
//             </h2>

//             {/* Rating */}
//             <div className="flex items-center gap-2">
//               <div className="flex items-center gap-0.5">
//                 {[1, 2, 3, 4, 5].map((s) =>
//                   s <= rating
//                     ? <FaStar key={s} size={13} className="text-amber-400" />
//                     : <FaRegStar key={s} size={13} className="text-gray-200" />
//                 )}
//               </div>
//               <span className="text-[12px] text-gray-400 font-semibold">{rating}.0 / 5.0</span>
//             </div>

//             {/* Price */}
//             <div className="flex items-end gap-3">
//               {oldPrice > realPrice && (
//                 <span className="text-[15px] text-gray-300 line-through font-medium">
//                   ৳{oldPrice.toLocaleString()}
//                 </span>
//               )}
//               <span className="text-[32px] font-black text-gray-900 leading-none">
//                 ৳{realPrice.toLocaleString()}
//               </span>
//               {discount > 0 && (
//                 <span className="text-[11px] font-black text-emerald-600 bg-emerald-50 border border-emerald-200 px-2 py-0.5 rounded-full mb-1">
//                   Save {discount}%
//                 </span>
//               )}
//             </div>

//             <div className="w-full h-px bg-gradient-to-r from-blue-100 via-violet-100 to-transparent" />

//             {/* Description */}
//             {product.description && (
//               <p className="text-[13px] text-gray-500 leading-relaxed line-clamp-3">
//                 {product.description}
//               </p>
//             )}

//             {/* Quick info */}
//             <div className="grid grid-cols-2 gap-2">
//               {[
//                 { label: "Stock",    value: product.countInStock || 0, unit: "pcs" },
//                 { label: "Location", value: product.location || "—" },
//                 product.productRam?.name    && { label: "RAM",    value: product.productRam.name    },
//                 product.productSize?.name   && { label: "Size",   value: product.productSize.name   },
//                 product.productWeight?.name && { label: "Weight", value: product.productWeight.name },
//               ].filter(Boolean).map((item, i) => (
//                 <div key={i} className="flex items-center gap-2 bg-gray-50 rounded-xl px-3 py-2">
//                   <Check size={12} className="text-emerald-500 shrink-0" />
//                   <span className="text-[11px] text-gray-400">{item.label}:</span>
//                   <span className="text-[11px] font-bold text-gray-700 ml-auto">
//                     {item.value}{item.unit ? ` ${item.unit}` : ""}
//                   </span>
//                 </div>
//               ))}
//             </div>

//             {/* Quantity + Add to Cart */}
//             <div className="flex items-center gap-3">
//               <div className="flex items-center bg-gray-50 border border-gray-200 rounded-2xl px-3 py-2 gap-3">
//                 <button
//                   onClick={() => setQuantity(Math.max(1, quantity - 1))}
//                   className="w-7 h-7 rounded-full bg-white border border-gray-200 flex items-center justify-center text-gray-500 hover:border-gray-400 transition-all"
//                 >
//                   <Minus size={13} />
//                 </button>
//                 <span className="text-[15px] font-black text-gray-800 min-w-[24px] text-center">{quantity}</span>
//                 <button
//                   onClick={() => setQuantity(Math.min(product.countInStock, quantity + 1))}
//                   className="w-7 h-7 rounded-full bg-white border border-gray-200 flex items-center justify-center text-gray-500 hover:border-gray-400 transition-all"
//                 >
//                   <Plus size={13} />
//                 </button>
//               </div>

//               <button
//                 onClick={handleAddToCart}
//                 disabled={!inStock || adding}
//                 className={`flex-1 flex items-center justify-center gap-2 py-3 rounded-2xl font-black text-[13px] uppercase tracking-wider transition-all duration-300 shadow-lg active:scale-95 ${
//                   alreadyInCart
//                     ? "bg-emerald-500 text-white shadow-emerald-200"
//                     : inStock
//                     ? "bg-gradient-to-r from-blue-600 to-violet-600 text-white hover:shadow-blue-200 hover:scale-[1.02]"
//                     : "bg-gray-100 text-gray-400 cursor-not-allowed shadow-none"
//                 }`}
//               >
//                 {adding
//                   ? <><ShoppingCart size={16} className="animate-pulse" /> Adding...</>
//                   : alreadyInCart
//                   ? <><Check size={16} /> In Cart</>
//                   : <><ShoppingCart size={16} /> Add to Cart</>
//                 }
//               </button>
//             </div>

//             {/* Wishlist + Compare + Share */}
//             <div className="flex items-center gap-4 pt-1">
//               <button
//                 onClick={handleWishlist}
//                 disabled={wishLoading}
//                 className="flex items-center gap-1.5 text-[11px] font-bold text-gray-500 hover:text-red-500 transition-colors uppercase tracking-wider disabled:opacity-50"
//               >
//                 <Heart
//                   size={15}
//                   fill={isWished ? "#EF4444" : "none"}
//                   className={isWished ? "text-red-500" : ""}
//                 />
//                 {isWished ? "Wishlisted" : "Wishlist"}
//               </button>
//               <div className="w-px h-4 bg-gray-200" />
//               <button className="flex items-center gap-1.5 text-[11px] font-bold text-gray-500 hover:text-blue-500 transition-colors uppercase tracking-wider">
//                 <ArrowLeftRight size={15} /> Compare
//               </button>
//               <div className="w-px h-4 bg-gray-200" />
//               <button className="flex items-center gap-1.5 text-[11px] font-bold text-gray-500 hover:text-violet-500 transition-colors uppercase tracking-wider">
//                 <Share2 size={15} /> Share
//               </button>
//             </div>

//           </div>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default ProductQuickView;



















// import React, { useState, useEffect } from "react";
// import { Heart, Minus, Plus, X, ShoppingCart, ArrowLeftRight, Share2, Check } from "lucide-react";
// import { FaStar, FaRegStar } from "react-icons/fa";
// import ProductImageZoom from "../../../Components/Shared/ProductImageZoom/ProductImageZoom";

// const ProductQuickView = ({ product, onClose }) => {
//   const [selectedImg, setSelectedImg] = useState(product?.images?.[0] || null);
//   const [quantity, setQuantity] = useState(1);
//   const [wished, setWished] = useState(false);
//   const [added, setAdded] = useState(false);
//   const [visible, setVisible] = useState(false);

//   useEffect(() => {
//     // mount animation
//     setTimeout(() => setVisible(true), 10);
//   }, []);

//   const handleClose = () => {
//     setVisible(false);
//     setTimeout(onClose, 300);
//   };

//   if (!product) return null;

//   const images = product.images?.length > 0 ? product.images : [];
//   const realPrice = Number(product.price) || 0;
//   const oldPrice = product.oldPrice
//     ? Number(product.oldPrice)
//     : Math.round(realPrice / 0.88);
//   const discount = oldPrice > realPrice
//     ? Math.round(((oldPrice - realPrice) / oldPrice) * 100)
//     : 0;
//   const inStock = product.countInStock > 0;
//   const rating = Math.min(5, Math.round(product.rating || 0));
//   const categoryName = product.category?.name || product.category || "General";
//   const brand = product.brand || "—";
//   const subCat = product.subCat?.subCat || product.subCat || null;

//   const handleAddToCart = () => {
//     setAdded(true);
//     setTimeout(() => setAdded(false), 2000);
//   };

//   return (
//     <div
//       className="fixed inset-0 z-[200] flex items-center justify-center p-4"
//       style={{ backgroundColor: `rgba(0,0,0,${visible ? 0.65 : 0})`, transition: "background-color 0.3s ease" }}
//       onClick={handleClose}
//     >
//       {/* Modal */}
//       <div
//         className="bg-white w-full max-w-[920px] max-h-[92vh] overflow-y-auto rounded-3xl relative shadow-2xl"
//         style={{
//           transform: visible ? "scale(1) translateY(0)" : "scale(0.94) translateY(24px)",
//           opacity: visible ? 1 : 0,
//           transition: "transform 0.3s cubic-bezier(0.34,1.56,0.64,1), opacity 0.3s ease",
//         }}
//         onClick={(e) => e.stopPropagation()}
//       >

//         {/* ── Top accent bar ── */}
//         <div className="h-1 w-full rounded-t-3xl bg-gradient-to-r from-blue-500 via-violet-500 to-pink-500" />

//         {/* ── Close button ── */}
//         <button
//           onClick={handleClose}
//           className="absolute top-4 right-4 z-20 w-9 h-9 bg-gray-100 hover:bg-red-500 hover:text-white text-gray-500 rounded-full flex items-center justify-center transition-all duration-200 shadow-sm"
//         >
//           <X size={17} />
//         </button>

//         <div className="flex flex-col md:flex-row gap-0">

//           {/* ── LEFT: Image Gallery ── */}
//           <div className="w-full md:w-[45%] bg-gray-50 rounded-bl-3xl rounded-tl-none md:rounded-tl-none p-6 flex flex-col gap-4">

//             {/* Main image */}
//             <div className="relative rounded-2xl overflow-hidden bg-white border border-gray-100 flex items-center justify-center"
//               style={{ height: "340px" }}>
//               {selectedImg ? (
//                 <ProductImageZoom Image={selectedImg} />
//               ) : (
//                 <div className="text-gray-300 text-sm">No Image</div>
//               )}

//               {/* Badges */}
//               <div className="absolute top-3 left-3 flex flex-col gap-1.5 z-10">
//                 {discount > 0 && (
//                   <span className="bg-gradient-to-r from-blue-500 to-cyan-400 text-white text-[10px] font-black px-2.5 py-1 rounded-full shadow">
//                     -{discount}%
//                   </span>
//                 )}
//                 {product.isFeatured && (
//                   <span className="bg-gradient-to-r from-violet-500 to-purple-500 text-white text-[9px] uppercase font-black px-2.5 py-1 rounded-full shadow">
//                     Featured
//                   </span>
//                 )}
//               </div>

//               {/* Stock tag */}
//               <div className="absolute top-3 right-3 z-10">
//                 <span className={`text-[9px] font-black uppercase px-2.5 py-1 rounded-full ${
//                   inStock
//                     ? "bg-emerald-50 text-emerald-600 border border-emerald-200"
//                     : "bg-red-50 text-red-500 border border-red-200"
//                 }`}>
//                   {inStock ? "In Stock" : "Out of Stock"}
//                 </span>
//               </div>
//             </div>

//             {/* Thumbnails */}
//             {images.length > 1 && (
//               <div className="flex gap-2 flex-wrap">
//                 {images.map((img, idx) => (
//                   <button
//                     key={idx}
//                     onClick={() => setSelectedImg(img)}
//                     className={`w-14 h-14 rounded-xl overflow-hidden border-2 transition-all duration-200 ${
//                       selectedImg === img
//                         ? "border-blue-500 scale-105 shadow-md"
//                         : "border-gray-200 hover:border-gray-400"
//                     }`}
//                   >
//                     <img src={img} alt={`thumb-${idx}`} className="w-full h-full object-cover" />
//                   </button>
//                 ))}
//               </div>
//             )}
//           </div>

//           {/* ── RIGHT: Product Info ── */}
//           <div className="w-full md:w-[55%] p-7 flex flex-col gap-5">

//             {/* Category + Brand */}
//             <div className="flex items-center gap-2 flex-wrap">
//               <span className="text-[10px] font-black uppercase tracking-[2px] text-blue-500 bg-blue-50 px-2.5 py-0.5 rounded-full border border-blue-100">
//                 {categoryName}
//               </span>
//               {subCat && (
//                 <span className="text-[10px] font-black uppercase tracking-[2px] text-violet-500 bg-violet-50 px-2.5 py-0.5 rounded-full border border-violet-100">
//                   {subCat}
//                 </span>
//               )}
//               <span className="text-[10px] text-gray-400 font-semibold ml-auto">
//                 Brand: <span className="text-gray-700">{brand}</span>
//               </span>
//             </div>

//             {/* Name */}
//             <h2 className="text-[20px] font-black text-gray-900 leading-snug tracking-tight">
//               {product.name}
//             </h2>

//             {/* Rating */}
//             <div className="flex items-center gap-2">
//               <div className="flex items-center gap-0.5">
//                 {[1, 2, 3, 4, 5].map((s) =>
//                   s <= rating ? (
//                     <FaStar key={s} size={13} className="text-amber-400" />
//                   ) : (
//                     <FaRegStar key={s} size={13} className="text-gray-200" />
//                   )
//                 )}
//               </div>
//               <span className="text-[12px] text-gray-400 font-semibold">
//                 {rating}.0 / 5.0
//               </span>
//             </div>

//             {/* Price */}
//             <div className="flex items-end gap-3">
//               {oldPrice > realPrice && (
//                 <span className="text-[15px] text-gray-300 line-through font-medium">
//                   ৳{oldPrice.toLocaleString()}
//                 </span>
//               )}
//               <span className="text-[32px] font-black text-gray-900 leading-none">
//                 ৳{realPrice.toLocaleString()}
//               </span>
//               {discount > 0 && (
//                 <span className="text-[11px] font-black text-emerald-600 bg-emerald-50 border border-emerald-200 px-2 py-0.5 rounded-full mb-1">
//                   Save {discount}%
//                 </span>
//               )}
//             </div>

//             {/* Divider */}
//             <div className="w-full h-px bg-gradient-to-r from-blue-100 via-violet-100 to-transparent" />

//             {/* Description */}
//             {product.description && (
//               <p className="text-[13px] text-gray-500 leading-relaxed line-clamp-3">
//                 {product.description}
//               </p>
//             )}

//             {/* Quick info */}
//             <div className="grid grid-cols-2 gap-2">
//               {[
//                 { label: "Stock", value: product.countInStock || 0, unit: "pcs" },
//                 { label: "Location", value: product.location || "—" },
//                 product.productRam?.name && { label: "RAM", value: product.productRam.name },
//                 product.productSize?.name && { label: "Size", value: product.productSize.name },
//                 product.productWeight?.name && { label: "Weight", value: product.productWeight.name },
//               ]
//                 .filter(Boolean)
//                 .map((item, i) => (
//                   <div key={i} className="flex items-center gap-2 bg-gray-50 rounded-xl px-3 py-2">
//                     <Check size={12} className="text-emerald-500 shrink-0" />
//                     <span className="text-[11px] text-gray-400">{item.label}:</span>
//                     <span className="text-[11px] font-bold text-gray-700 ml-auto">
//                       {item.value}{item.unit ? ` ${item.unit}` : ""}
//                     </span>
//                   </div>
//                 ))}
//             </div>

//             {/* Quantity + Add to Cart */}
//             <div className="flex items-center gap-3">
//               {/* Quantity */}
//               <div className="flex items-center bg-gray-50 border border-gray-200 rounded-2xl px-3 py-2 gap-3">
//                 <button
//                   onClick={() => setQuantity(Math.max(1, quantity - 1))}
//                   className="w-7 h-7 rounded-full bg-white border border-gray-200 flex items-center justify-center text-gray-500 hover:border-gray-400 transition-all"
//                 >
//                   <Minus size={13} />
//                 </button>
//                 <span className="text-[15px] font-black text-gray-800 min-w-[24px] text-center">
//                   {quantity}
//                 </span>
//                 <button
//                   onClick={() => setQuantity(quantity + 1)}
//                   className="w-7 h-7 rounded-full bg-white border border-gray-200 flex items-center justify-center text-gray-500 hover:border-gray-400 transition-all"
//                 >
//                   <Plus size={13} />
//                 </button>
//               </div>

//               {/* Add to cart */}
//               <button
//                 onClick={handleAddToCart}
//                 disabled={!inStock}
//                 className={`flex-1 flex items-center justify-center gap-2 py-3 rounded-2xl font-black text-[13px] uppercase tracking-wider transition-all duration-300 shadow-lg active:scale-95 ${
//                   added
//                     ? "bg-emerald-500 text-white shadow-emerald-200"
//                     : inStock
//                     ? "bg-gradient-to-r from-blue-600 to-violet-600 text-white hover:shadow-blue-200 hover:scale-[1.02]"
//                     : "bg-gray-100 text-gray-400 cursor-not-allowed shadow-none"
//                 }`}
//               >
//                 {added ? (
//                   <><Check size={16} /> Added!</>
//                 ) : (
//                   <><ShoppingCart size={16} /> Add to Cart</>
//                 )}
//               </button>
//             </div>

//             {/* Wishlist + Compare + Share */}
//             <div className="flex items-center gap-4 pt-1">
//               <button
//                 onClick={() => setWished(!wished)}
//                 className="flex items-center gap-1.5 text-[11px] font-bold text-gray-500 hover:text-red-500 transition-colors uppercase tracking-wider"
//               >
//                 <Heart
//                   size={15}
//                   fill={wished ? "#EF4444" : "none"}
//                   className={wished ? "text-red-500" : ""}
//                 />
//                 {wished ? "Wishlisted" : "Wishlist"}
//               </button>
//               <div className="w-px h-4 bg-gray-200" />
//               <button className="flex items-center gap-1.5 text-[11px] font-bold text-gray-500 hover:text-blue-500 transition-colors uppercase tracking-wider">
//                 <ArrowLeftRight size={15} />
//                 Compare
//               </button>
//               <div className="w-px h-4 bg-gray-200" />
//               <button className="flex items-center gap-1.5 text-[11px] font-bold text-gray-500 hover:text-violet-500 transition-colors uppercase tracking-wider">
//                 <Share2 size={15} />
//                 Share
//               </button>
//             </div>

//           </div>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default ProductQuickView;