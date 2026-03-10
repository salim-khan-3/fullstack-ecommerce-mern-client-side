import { useState, useEffect } from "react";
import {
  Heart, ArrowLeftRight, ShoppingCart, Star, Minus, Plus,
} from "lucide-react";
import ProductImageGallery from "../../../Components/Shared/ProductImageGallery/ProductImageGallery";
import { useCart } from "../../../context/CartContext";
import { useAuth } from "../../../context/AuthContext";
import { useNavigate } from "react-router-dom";

const ProductDetailCard = ({ product }) => {
  const [quantity, setQuantity] = useState(1);
  const [isWished, setIsWished] = useState(false);
  const [adding, setAdding] = useState(false);

  const { addToCart, updateCartItem, isInCart, getCartItem } = useCart();
  const { isLoggedIn } = useAuth();
  const navigate = useNavigate();

  if (!product) return null;

  const images = product.images || [];
  const realPrice = Number(product.price);
  const oldPrice = product.oldPrice && product.oldPrice > realPrice ? Number(product.oldPrice) : null;
  const discount = oldPrice ? Math.round(((oldPrice - realPrice) / oldPrice) * 100) : null;
  const maxStock = Number(product.countInStock) || 0;
  const inStock = maxStock > 0;
  const rating = Math.min(5, Math.max(0, Number(product.rating) || 0));

  const alreadyInCart = isLoggedIn && isInCart(product._id);
  const cartItem = alreadyInCart ? getCartItem(product._id) : null;

  // cart এ থাকলে quantity sync
  useEffect(() => {
    if (cartItem) setQuantity(cartItem.quantity);
  }, [cartItem]);

  const attrBtn = "px-3 py-1 text-sm border border-gray-300 rounded hover:border-blue-400 hover:text-blue-600 transition-colors";

  // Add to Cart — একবারই হবে
  const handleAddToCart = async () => {
    if (!isLoggedIn) {
      navigate("/login");
      return;
    }
    if (alreadyInCart) return; // আর click করতে দেবো না
    setAdding(true);
    await addToCart(product, quantity);
    setAdding(false);
  };

  // Quantity change — stock limit check + DB update
  const handleQuantityChange = async (newQty) => {
    if (newQty < 1) return;

    // stock validation
    if (newQty > maxStock) {
      toast.error(`Only ${maxStock} items available in stock`);
      return;
    }

    setQuantity(newQty);

    // cart এ থাকলে সাথে সাথে DB update
    if (alreadyInCart && cartItem) {
      await updateCartItem(cartItem._id, newQty, realPrice);
    }
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12 items-start">
      {/* LEFT — Image Gallery */}
      <div className="relative">
        {discount && (
          <div className="absolute top-3 left-3 z-10 bg-sky-400 text-white text-xs font-bold px-2.5 py-1 rounded-full">
            {discount}%
          </div>
        )}
        <ProductImageGallery images={images} />
      </div>

      {/* RIGHT — Product Info */}
      <div className="flex flex-col gap-3">
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
              <Star key={i} size={14}
                fill={i < Math.round(rating) ? "#f59e0b" : "none"}
                className={i < Math.round(rating) ? "text-amber-400" : "text-gray-300"} />
            ))}
          </div>
          <span className="text-gray-500 text-sm">{rating} Review</span>
        </div>

        {/* Price */}
        <div className="flex items-center gap-3">
          {oldPrice && (
            <span className="text-gray-400 line-through text-base">Rs: {oldPrice.toLocaleString()}</span>
          )}
          <span className="text-xl font-bold text-red-500">Rs: {realPrice.toLocaleString()}</span>
        </div>

        {/* Stock */}
        <div className="flex items-center gap-3">
          {inStock ? (
            <span className="inline-block text-xs font-semibold text-green-600 border border-green-500 px-3 py-1 rounded-full">IN STOCK</span>
          ) : (
            <span className="inline-block text-xs font-semibold text-red-500 border border-red-400 px-3 py-1 rounded-full">OUT OF STOCK</span>
          )}
          {/* stock count দেখাবো */}
          {inStock && (
            <span className="text-xs text-gray-400">{maxStock} items left</span>
          )}
        </div>

        {/* Description */}
        {product.description && (
          <p className="text-gray-600 text-sm leading-relaxed">{product.description}</p>
        )}

        {/* Attributes */}
        {product.productSize?.length > 0 && (
          <div className="flex items-center gap-2 flex-wrap">
            <span className="text-sm font-medium text-gray-700">Size:</span>
            {product.productSize.map((s) => (
              <button key={s._id} className={attrBtn}>{s.name}</button>
            ))}
          </div>
        )}
        {product.productRam?.length > 0 && (
          <div className="flex items-center gap-2 flex-wrap">
            <span className="text-sm font-medium text-gray-700">RAM:</span>
            {product.productRam.map((r) => (
              <button key={r._id} className={attrBtn}>{r.name}</button>
            ))}
          </div>
        )}
        {product.productWeight?.length > 0 && (
          <div className="flex items-center gap-2 flex-wrap">
            <span className="text-sm font-medium text-gray-700">Weight:</span>
            {product.productWeight.map((w) => (
              <button key={w._id} className={attrBtn}>{w.name}</button>
            ))}
          </div>
        )}

        {/* Quantity + Buttons */}
        <div className="flex items-center gap-2 flex-wrap mt-1">
          {/* Qty */}
          <div className="flex items-center border border-gray-200 rounded-full overflow-hidden bg-gray-50">
            <button
              onClick={() => handleQuantityChange(quantity - 1)}
              disabled={quantity <= 1}
              className="w-9 h-10 flex items-center justify-center text-gray-500 hover:bg-gray-200 transition-colors disabled:opacity-40 disabled:cursor-not-allowed">
              <Minus size={13} />
            </button>
            <span className="w-8 text-center text-sm font-semibold text-gray-800 select-none">{quantity}</span>
            <button
              onClick={() => handleQuantityChange(quantity + 1)}
              disabled={quantity >= maxStock}
              className="w-9 h-10 flex items-center justify-center text-gray-500 hover:bg-gray-200 transition-colors disabled:opacity-40 disabled:cursor-not-allowed">
              <Plus size={13} />
            </button>
          </div>

          {/* stock এ max পৌঁছালে warning */}
          {quantity >= maxStock && inStock && (
            <span className="text-xs text-orange-500 font-medium">Max stock reached</span>
          )}

          {/* Add to Cart */}
          <button
            onClick={handleAddToCart}
            disabled={!inStock || adding || alreadyInCart}
            className={`flex items-center gap-2 px-6 py-2.5 rounded-full text-sm font-semibold transition-all
              ${!inStock
                ? "bg-gray-200 text-gray-400 cursor-not-allowed"
                : alreadyInCart
                  ? "bg-green-500 text-white cursor-default"
                  : adding
                    ? "bg-orange-400 text-white cursor-wait"
                    : "bg-red-500 text-white hover:bg-red-600"
              }`}
          >
            <ShoppingCart size={15} />
            {adding ? "Adding..." : alreadyInCart ? "✓ In Cart" : "Add To Cart"}
          </button>

          {/* Wishlist */}
          <button onClick={() => setIsWished((w) => !w)}
            className="w-10 h-10 rounded-full border border-gray-200 flex items-center justify-center hover:border-red-300 transition-colors">
            <Heart size={16} fill={isWished ? "#ef4444" : "none"}
              className={isWished ? "text-red-500" : "text-gray-400"} />
          </button>

          {/* Compare */}
          <button className="w-10 h-10 rounded-full border border-gray-200 flex items-center justify-center hover:border-gray-400 transition-colors">
            <ArrowLeftRight size={15} className="text-gray-400" />
          </button>
        </div>

        {/* Login prompt */}
        {!isLoggedIn && (
          <p className="text-xs text-gray-400 mt-1">
            <span className="text-blue-500 font-semibold cursor-pointer hover:underline"
              onClick={() => navigate("/login")}>Login</span> to add items to cart
          </p>
        )}
      </div>
    </div>
  );
};

export default ProductDetailCard;



















// import { useState, useEffect } from "react";
// import {
//   Heart, ArrowLeftRight, ShoppingCart, Star, Minus, Plus,
// } from "lucide-react";
// import ProductImageGallery from "../../../Components/Shared/ProductImageGallery/ProductImageGallery";
// import { useCart } from "../../../context/CartContext";
// import { useAuth } from "../../../context/AuthContext";
// import { useNavigate } from "react-router-dom";

// const ProductDetailCard = ({ product }) => {
//   const [quantity, setQuantity] = useState(1);
//   const [isWished, setIsWished] = useState(false);
//   const [adding, setAdding] = useState(false);

//   const { addToCart, updateCartItem, isInCart, getCartItem } = useCart();
//   const { isLoggedIn } = useAuth();
//   const navigate = useNavigate();

//   if (!product) return null;

//   const images = product.images || [];
//   const realPrice = Number(product.price);
//   const oldPrice = product.oldPrice && product.oldPrice > realPrice ? Number(product.oldPrice) : null;
//   const discount = oldPrice ? Math.round(((oldPrice - realPrice) / oldPrice) * 100) : null;
//   const inStock = product.countInStock > 0;
//   const rating = Math.min(5, Math.max(0, Number(product.rating) || 0));

//   // product টা cart এ আছে কিনা
//   const alreadyInCart = isLoggedIn && isInCart(product._id);
//   const cartItem = alreadyInCart ? getCartItem(product._id) : null;

//   // cart এ থাকলে quantity sync করো
//   useEffect(() => {
//     if (cartItem) setQuantity(cartItem.quantity);
//   }, [cartItem]);

//   const attrBtn = "px-3 py-1 text-sm border border-gray-300 rounded hover:border-blue-400 hover:text-blue-600 transition-colors";

//   const handleAddToCart = async () => {
//     if (!isLoggedIn) {
//       navigate("/login");
//       return;
//     }
//     setAdding(true);
//     await addToCart(product, quantity);
//     setAdding(false);
//   };

//   // quantity + / - button — cart এ থাকলে সাথে সাথে update
//   const handleQuantityChange = async (newQty) => {
//     if (newQty < 1) return;
//     setQuantity(newQty);
//     if (alreadyInCart && cartItem) {
//       await updateCartItem(cartItem._id, newQty, realPrice);
//     }
//   };

//   return (
//     <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12 items-start">
//       {/* LEFT — Image Gallery */}
//       <div className="relative">
//         {discount && (
//           <div className="absolute top-3 left-3 z-10 bg-sky-400 text-white text-xs font-bold px-2.5 py-1 rounded-full">
//             {discount}%
//           </div>
//         )}
//         <ProductImageGallery images={images} />
//       </div>

//       {/* RIGHT — Product Info */}
//       <div className="flex flex-col gap-3">
//         <h1 className="text-2xl sm:text-3xl font-semibold text-gray-900 leading-snug">
//           {product.name}
//         </h1>

//         {/* Brand + Rating */}
//         <div className="flex items-center gap-2 flex-wrap text-sm text-gray-600">
//           {product.brand && (
//             <span>Brands : <span className="font-semibold text-gray-800">{product.brand}</span></span>
//           )}
//           <div className="flex items-center gap-1 ml-1">
//             {[...Array(5)].map((_, i) => (
//               <Star key={i} size={14}
//                 fill={i < Math.round(rating) ? "#f59e0b" : "none"}
//                 className={i < Math.round(rating) ? "text-amber-400" : "text-gray-300"} />
//             ))}
//           </div>
//           <span className="text-gray-500 text-sm">{rating} Review</span>
//         </div>

//         {/* Price */}
//         <div className="flex items-center gap-3">
//           {oldPrice && (
//             <span className="text-gray-400 line-through text-base">Rs: {oldPrice.toLocaleString()}</span>
//           )}
//           <span className="text-xl font-bold text-red-500">Rs: {realPrice.toLocaleString()}</span>
//         </div>

//         {/* Stock */}
//         <div>
//           {inStock ? (
//             <span className="inline-block text-xs font-semibold text-green-600 border border-green-500 px-3 py-1 rounded-full">IN STOCK</span>
//           ) : (
//             <span className="inline-block text-xs font-semibold text-red-500 border border-red-400 px-3 py-1 rounded-full">OUT OF STOCK</span>
//           )}
//         </div>

//         {/* Description */}
//         {product.description && (
//           <p className="text-gray-600 text-sm leading-relaxed">{product.description}</p>
//         )}

//         {/* Attributes */}
//         {product.productSize?.length > 0 && (
//           <div className="flex items-center gap-2 flex-wrap">
//             <span className="text-sm font-medium text-gray-700">Size:</span>
//             {product.productSize.map((s) => (
//               <button key={s._id} className={attrBtn}>{s.name}</button>
//             ))}
//           </div>
//         )}
//         {product.productRam?.length > 0 && (
//           <div className="flex items-center gap-2 flex-wrap">
//             <span className="text-sm font-medium text-gray-700">RAM:</span>
//             {product.productRam.map((r) => (
//               <button key={r._id} className={attrBtn}>{r.name}</button>
//             ))}
//           </div>
//         )}
//         {product.productWeight?.length > 0 && (
//           <div className="flex items-center gap-2 flex-wrap">
//             <span className="text-sm font-medium text-gray-700">Weight:</span>
//             {product.productWeight.map((w) => (
//               <button key={w._id} className={attrBtn}>{w.name}</button>
//             ))}
//           </div>
//         )}

//         {/* Quantity + Buttons */}
//         <div className="flex items-center gap-2 flex-wrap mt-1">
//           {/* Qty */}
//           <div className="flex items-center border border-gray-200 rounded-full overflow-hidden bg-gray-50">
//             <button onClick={() => handleQuantityChange(quantity - 1)}
//               className="w-9 h-10 flex items-center justify-center text-gray-500 hover:bg-gray-200 transition-colors">
//               <Minus size={13} />
//             </button>
//             <span className="w-8 text-center text-sm font-semibold text-gray-800 select-none">{quantity}</span>
//             <button onClick={() => handleQuantityChange(quantity + 1)}
//               className="w-9 h-10 flex items-center justify-center text-gray-500 hover:bg-gray-200 transition-colors">
//               <Plus size={13} />
//             </button>
//           </div>

//           {/* Add to Cart / Already in Cart */}
//           <button
//             onClick={handleAddToCart}
//             disabled={!inStock || adding}
//             className={`flex items-center gap-2 px-6 py-2.5 rounded-full text-sm font-semibold transition-all
//               ${!inStock
//                 ? "bg-gray-200 text-gray-400 cursor-not-allowed"
//                 : alreadyInCart
//                   ? "bg-green-500 text-white hover:bg-green-600"
//                   : adding
//                     ? "bg-orange-400 text-white cursor-wait"
//                     : "bg-red-500 text-white hover:bg-red-600"
//               }`}
//           >
//             <ShoppingCart size={15} />
//             {adding ? "Adding..." : alreadyInCart ? "✓ In Cart" : "Add To Cart"}
//           </button>

//           {/* Wishlist */}
//           <button onClick={() => setIsWished((w) => !w)}
//             className="w-10 h-10 rounded-full border border-gray-200 flex items-center justify-center hover:border-red-300 transition-colors">
//             <Heart size={16} fill={isWished ? "#ef4444" : "none"}
//               className={isWished ? "text-red-500" : "text-gray-400"} />
//           </button>

//           {/* Compare */}
//           <button className="w-10 h-10 rounded-full border border-gray-200 flex items-center justify-center hover:border-gray-400 transition-colors">
//             <ArrowLeftRight size={15} className="text-gray-400" />
//           </button>
//         </div>

//         {/* Login prompt */}
//         {!isLoggedIn && (
//           <p className="text-xs text-gray-400 mt-1">
//             <span className="text-blue-500 font-semibold cursor-pointer hover:underline"
//               onClick={() => navigate("/login")}>Login</span> to add items to cart
//           </p>
//         )}
//       </div>
//     </div>
//   );
// };

// export default ProductDetailCard;




















// import { useState } from "react";
// import {
//   Heart,
//   ArrowLeftRight,
//   ShoppingCart,
//   Star,
//   Minus,
//   Plus,
// } from "lucide-react";
// import ProductImageGallery from "../../../Components/Shared/ProductImageGallery/ProductImageGallery";

// const ProductDetailCard = ({ product }) => {
//   const [quantity, setQuantity] = useState(1);
//   const [isWished, setIsWished] = useState(false);
//   const [addedToCart, setAddedToCart] = useState(false);

//   if (!product) return null;

//   const images = product.images || [];
//   const realPrice = Number(product.price);
//   const oldPrice =
//     product.oldPrice && product.oldPrice > realPrice
//       ? Number(product.oldPrice)
//       : null;
//   const discount = oldPrice
//     ? Math.round(((oldPrice - realPrice) / oldPrice) * 100)
//     : null;
//   const inStock = product.countInStock > 0;
//   const rating = Math.min(5, Math.max(0, Number(product.rating) || 0));

//   const handleAddToCart = () => {
//     setAddedToCart(true);
//     setTimeout(() => setAddedToCart(false), 2000);
//   };

//   // Attribute button style
//   const attrBtn =
//     "px-3 py-1 text-sm border border-gray-300 rounded hover:border-blue-400 hover:text-blue-600 transition-colors";

//   return (
//     <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12 items-start">
//       {/* LEFT — Image Gallery */}
//       <div className="relative">
//         {discount && (
//           <div className="absolute top-3 left-3 z-10 bg-sky-400 text-white text-xs font-bold px-2.5 py-1 rounded-full">
//             {discount}%
//           </div>
//         )}
//         <ProductImageGallery images={images} />
//       </div>

//       {/* RIGHT — Product Info */}
//       <div className="flex flex-col gap-3">
//         {/* Title */}
//         <h1 className="text-2xl sm:text-3xl font-semibold text-gray-900 leading-snug">
//           {product.name}
//         </h1>

//         {/* Brand + Rating */}
//         <div className="flex items-center gap-2 flex-wrap text-sm text-gray-600">
//           {product.brand && (
//             <span>
//               Brands :{" "}
//               <span className="font-semibold text-gray-800">
//                 {product.brand}
//               </span>
//             </span>
//           )}
//           <div className="flex items-center gap-1 ml-1">
//             {[...Array(5)].map((_, i) => (
//               <Star
//                 key={i}
//                 size={14}
//                 fill={i < Math.round(rating) ? "#f59e0b" : "none"}
//                 className={
//                   i < Math.round(rating) ? "text-amber-400" : "text-gray-300"
//                 }
//               />
//             ))}
//           </div>
//           <span className="text-gray-500 text-sm">{rating} Review</span>
//         </div>

//         {/* Price */}
//         <div className="flex items-center gap-3">
//           {oldPrice && (
//             <span className="text-gray-400 line-through text-base">
//               Rs: {oldPrice.toLocaleString()}
//             </span>
//           )}
//           <span className="text-xl font-bold text-red-500">
//             Rs: {realPrice.toLocaleString()}
//           </span>
//         </div>

//         {/* Stock */}
//         <div>
//           {inStock ? (
//             <span className="inline-block text-xs font-semibold text-green-600 border border-green-500 px-3 py-1 rounded-full">
//               IN STOCK
//             </span>
//           ) : (
//             <span className="inline-block text-xs font-semibold text-red-500 border border-red-400 px-3 py-1 rounded-full">
//               OUT OF STOCK
//             </span>
//           )}
//         </div>

//         {/* Description */}
//         {product.description && (
//           <p className="text-gray-600 text-sm leading-relaxed">
//             {product.description}
//           </p>
//         )}

//         {/* ✅ Attributes — field name হলো "name" (model এ name field আছে) */}
//         {product.productSize?.length > 0 && (
//           <div className="flex items-center gap-2 flex-wrap">
//             <span className="text-sm font-medium text-gray-700">Size:</span>
//             {product.productSize.map((s) => (
//               <button key={s._id} className={attrBtn}>
//                 {s.name}
//               </button>
//             ))}
//           </div>
//         )}

//         {product.productRam?.length > 0 && (
//           <div className="flex items-center gap-2 flex-wrap">
//             <span className="text-sm font-medium text-gray-700">RAM:</span>
//             {product.productRam.map((r) => (
//               <button key={r._id} className={attrBtn}>
//                 {r.name}
//               </button>
//             ))}
//           </div>
//         )}

//         {product.productWeight?.length > 0 && (
//           <div className="flex items-center gap-2 flex-wrap">
//             <span className="text-sm font-medium text-gray-700">Weight:</span>
//             {product.productWeight.map((w) => (
//               <button key={w._id} className={attrBtn}>
//                 {w.name}
//               </button>
//             ))}
//           </div>
//         )}

//         {/* Quantity + Add to Cart + Wishlist + Compare */}
//         <div className="flex items-center gap-2 flex-wrap mt-1">
//           {/* Qty */}
//           <div className="flex items-center border border-gray-200 rounded-full overflow-hidden bg-gray-50">
//             <button
//               onClick={() => setQuantity((q) => Math.max(1, q - 1))}
//               className="w-9 h-10 flex items-center justify-center text-gray-500 hover:bg-gray-200 transition-colors"
//             >
//               <Minus size={13} />
//             </button>
//             <span className="w-8 text-center text-sm font-semibold text-gray-800 select-none">
//               {quantity}
//             </span>
//             <button
//               onClick={() => setQuantity((q) => q + 1)}
//               className="w-9 h-10 flex items-center justify-center text-gray-500 hover:bg-gray-200 transition-colors"
//             >
//               <Plus size={13} />
//             </button>
//           </div>

//           {/* Add to Cart */}
//           <button
//             onClick={handleAddToCart}
//             disabled={!inStock}
//             className={`flex items-center gap-2 px-6 py-2.5 rounded-full text-sm font-semibold transition-all
//               ${
//                 !inStock
//                   ? "bg-gray-200 text-gray-400 cursor-not-allowed"
//                   : addedToCart
//                     ? "bg-green-500 text-white"
//                     : "bg-red-500 text-white hover:bg-red-600"
//               }`}
//           >
//             <ShoppingCart size={15} />
//             {addedToCart ? "Added!" : "Add To Cart"}
//           </button>

//           {/* Wishlist */}
//           <button
//             onClick={() => setIsWished((w) => !w)}
//             className="w-10 h-10 rounded-full border border-gray-200 flex items-center justify-center hover:border-red-300 transition-colors"
//           >
//             <Heart
//               size={16}
//               fill={isWished ? "#ef4444" : "none"}
//               className={isWished ? "text-red-500" : "text-gray-400"}
//             />
//           </button>

//           {/* Compare */}
//           <button className="w-10 h-10 rounded-full border border-gray-200 flex items-center justify-center hover:border-gray-400 transition-colors">
//             <ArrowLeftRight size={15} className="text-gray-400" />
//           </button>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default ProductDetailCard;
