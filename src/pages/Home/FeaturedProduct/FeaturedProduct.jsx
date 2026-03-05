import { useCallback, useState, useEffect } from "react";
import useEmblaCarousel from "embla-carousel-react";
import Autoplay from "embla-carousel-autoplay";
import {
  Heart,
  ChevronLeft,
  ChevronRight,
  ShoppingBag,
  Star,
  ArrowUpRight,
  Eye,
} from "lucide-react";
import ProductQuickView from "../ProductQuickView/ProductQuickView";
import { getFeaturedProducts } from "../../../utils/api/productApi";
// import { getFeaturedProducts } from "../../../api/productApi";

const ProductCard = ({ product, onQuickView }) => {
  const [wished, setWished] = useState(false);
  const [added, setAdded] = useState(false);

  return (
    <div className="flex-shrink-0 w-full sm:w-1/2 md:w-1/3 lg:w-1/4 xl:w-1/5 p-[5px]">
      <div className="group bg-white rounded-2xl border border-gray-100 overflow-hidden transition-all duration-200 hover:-translate-y-1 hover:shadow-[0_8px_30px_rgba(0,0,0,0.08)]">

        {/* ── Image ── */}
        <div className="relative h-48 overflow-hidden bg-gray-50">
          <img
            src={product.images?.[0]}
            alt={product.name}
            className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
          />

          {/* Discount — top left */}
          <div className="absolute top-2.5 left-2.5">
            <span className="bg-gray-900 text-white text-[10px] font-semibold px-2.5 py-1 rounded-full">
              {product.category?.name || "Featured"}
            </span>
          </div>

          {/* ── Side icons — slide in from right on hover ── */}
          <div className="absolute top-2.5 right-2.5 flex flex-col gap-1.5">

            {/* Wishlist */}
            <button
              onClick={(e) => { e.stopPropagation(); setWished(!wished); }}
              className={`w-7 h-7 rounded-full flex items-center justify-center backdrop-blur-sm transition-all duration-200
                translate-x-10 opacity-0 group-hover:translate-x-0 group-hover:opacity-100
                ${wished
                  ? "bg-red-50 text-red-500"
                  : "bg-white/90 text-gray-400 hover:text-red-400 hover:bg-white"
                }`}
              style={{ transitionDelay: "0ms" }}
            >
              <Heart size={13} fill={wished ? "currentColor" : "none"} strokeWidth={2} />
            </button>

            {/* Quick View */}
            <button
              onClick={(e) => { e.stopPropagation(); onQuickView(product); }}
              className="w-7 h-7 rounded-full flex items-center justify-center backdrop-blur-sm transition-all duration-200
                translate-x-10 opacity-0 group-hover:translate-x-0 group-hover:opacity-100
                bg-white/90 text-gray-400 hover:text-gray-900 hover:bg-white"
              style={{ transitionDelay: "60ms" }}
            >
              <Eye size={13} strokeWidth={2} />
            </button>

          </div>
        </div>

        {/* ── Body ── */}
        <div className="p-3.5">
          {/* Tag */}
          <p className="text-[10px] font-medium text-indigo-500 mb-1 tracking-wide">
            {product.brand || "Featured"}
          </p>

          {/* Name */}
          <p className="text-[13px] font-medium text-gray-800 leading-snug mb-2 line-clamp-2 min-h-[38px]">
            {product.name}
          </p>

          {/* Stars */}
          <div className="flex items-center gap-0.5 mb-3">
            {[1, 2, 3, 4, 5].map((s) => (
              <Star
                key={s}
                size={10}
                fill={s <= product.rating ? "#FBBF24" : "none"}
                color={s <= product.rating ? "#FBBF24" : "#D1D5DB"}
                strokeWidth={1.5}
              />
            ))}
            <span className="text-[10px] text-gray-300 ml-1">
              ({product.numReviews || 0})
            </span>
          </div>

          {/* Price + Cart */}
          <div className="flex items-center justify-between">
            <span className="text-base font-semibold text-gray-900">
              ${product.price}
            </span>

            <button
              onClick={() => { setAdded(true); setTimeout(() => setAdded(false), 1500); }}
              className={`w-8 h-8 rounded-lg flex items-center justify-center text-[11px] font-bold transition-all duration-150 flex-shrink-0
                ${added
                  ? "bg-emerald-500 border-emerald-500 text-white"
                  : "border border-gray-200 text-gray-400 hover:bg-gray-900 hover:border-gray-900 hover:text-white"
                }`}
            >
              {added ? "✓" : <ShoppingBag size={14} />}
            </button>
          </div>
        </div>

      </div>
    </div>
  );
};

const FeaturedProduct = () => {
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getFeaturedProducts()
      .then((data) => setProducts(data))
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  const [emblaRef, emblaApi] = useEmblaCarousel(
    { loop: true, align: "start", dragFree: true },
    [Autoplay({ delay: 4000, stopOnInteraction: true })]
  );

  const scrollPrev = useCallback(() => emblaApi?.scrollPrev(), [emblaApi]);
  const scrollNext = useCallback(() => emblaApi?.scrollNext(), [emblaApi]);

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Bebas+Neue&display=swap');
        .fp-bebas { font-family: 'Bebas Neue', sans-serif; }
      `}</style>

      <div className="mb-12">

        {/* ── Header ── */}
        <div className="flex items-end justify-between mb-8">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <div className="w-6 h-[2px] bg-red-500 rounded-full" />
              <span className="text-[10px] font-bold tracking-[3px] text-red-500 uppercase">
                Curated Selection
              </span>
            </div>
            <div className="fp-bebas leading-none">
              <div className="text-[42px] text-gray-900 tracking-wide">FEATURED</div>
              <div
                className="text-[42px] tracking-wide"
                style={{ WebkitTextStroke: "1.5px #111", color: "transparent" }}
              >
                PRODUCTS
              </div>
            </div>
            <p className="text-xs text-gray-400 mt-2 leading-relaxed max-w-[260px]">
              Hand-picked deals you won't find anywhere else — updated weekly.
            </p>
          </div>

          <div className="flex flex-col items-end gap-3 pb-1">
            <button className="flex items-center gap-1.5 text-[11px] font-bold tracking-wider text-gray-700 uppercase hover:text-gray-900 transition-colors duration-150">
              View All Collection <ArrowUpRight size={13} />
            </button>
            <div className="flex items-center gap-2">
              <div className="w-16 h-[2px] bg-gray-200 rounded-full" />
              <button
                onClick={scrollPrev}
                className="w-8 h-8 rounded-full border border-gray-200 flex items-center justify-center text-gray-500 hover:bg-gray-900 hover:border-gray-900 hover:text-white transition-all duration-150"
              >
                <ChevronLeft size={15} />
              </button>
              <button
                onClick={scrollNext}
                className="w-8 h-8 rounded-full border border-gray-200 flex items-center justify-center text-gray-500 hover:bg-gray-900 hover:border-gray-900 hover:text-white transition-all duration-150"
              >
                <ChevronRight size={15} />
              </button>
            </div>
          </div>
        </div>

        {/* ── Loading ── */}
        {loading && (
          <div className="flex items-center justify-center h-48 gap-2 text-gray-300">
            <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24" fill="none">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z" />
            </svg>
            <span className="text-sm">Loading products...</span>
          </div>
        )}

        {/* ── Empty state ── */}
        {!loading && products.length === 0 && (
          <div className="flex items-center justify-center h-48 text-gray-300 text-sm">
            No featured products found.
          </div>
        )}

        {/* ── Slider ── */}
        {!loading && products.length > 0 && (
          <div className="overflow-hidden -mx-[5px]" ref={emblaRef}>
            <div className="flex">
              {products.map((product) => (
                <ProductCard
                  key={product._id}
                  product={product}
                  onQuickView={setSelectedProduct}
                />
              ))}
            </div>
          </div>
        )}
      </div>

      {selectedProduct && (
        <ProductQuickView
          product={selectedProduct}
          onClose={() => setSelectedProduct(null)}
        />
      )}
    </>
  );
};

export default FeaturedProduct;





// import { useCallback, useState, useEffect, useRef } from "react";
// import useEmblaCarousel from "embla-carousel-react";
// import Autoplay from "embla-carousel-autoplay";
// import { Heart, ChevronLeft, ChevronRight, ShoppingBag, Star, ArrowUpRight, Flame } from "lucide-react";
// import pp from "../../../assets/cyber-monday-shopping-sales.jpg";
// import ProductQuickView from "../ProductQuickView/ProductQuickView";

// const products = [
//   { id: 1, name: "Werther's Original Caramel Candies", price: 14.97, oldPrice: 20.0, discount: 26, img: pp, rating: 5, reviews: 2341, tag: "BESTSELLER", color: "#FF6B35" },
//   { id: 2, name: "Italian-Style Chicken Meatballs", price: 7.25, oldPrice: 9.35, discount: 23, img: pp, rating: 4, reviews: 891, tag: "RECOMMENDED", color: "#06D6A0" },
//   { id: 3, name: "Boomchickapop Kettle Corn", price: 3.29, oldPrice: 4.29, discount: 24, img: pp, rating: 5, reviews: 1567, tag: "NEW DROP", color: "#118AB2" },
//   { id: 4, name: "Chao Cheese Creamy Original", price: 19.5, oldPrice: 24.0, discount: 19, img: pp, rating: 5, reviews: 432, tag: "ORGANIC", color: "#8AC926" },
//   { id: 5, name: "Organic Honey Crushed Grapes", price: 12.0, oldPrice: 15.0, discount: 20, img: pp, rating: 5, reviews: 789, tag: "LIMITED", color: "#FF006E" },
//   { id: 6, name: "Premium Dark Roast Coffee Blend", price: 22.0, oldPrice: 28.0, discount: 21, img: pp, rating: 4, reviews: 1102, tag: "POPULAR", color: "#FB5607" },
// ];

// const ProductCard = ({ product, index }) => {
//   const [hovered, setHovered] = useState(false);
//   const [wished, setWished] = useState(false);
//   const [added, setAdded] = useState(false);
//   const cardRef = useRef(null);

//   const handleAddCart = (e) => {
//     e.stopPropagation();
//     setAdded(true);
//     setTimeout(() => setAdded(false), 1800);
//   };

//   const handleMouseMove = (e) => {
//     if (!cardRef.current) return;
//     const rect = cardRef.current.getBoundingClientRect();
//     const x = ((e.clientX - rect.left) / rect.width - 0.5) * 14;
//     const y = ((e.clientY - rect.top) / rect.height - 0.5) * -14;
//     cardRef.current.style.transform = `perspective(900px) rotateY(${x}deg) rotateX(${y}deg) translateY(-10px) scale(1.02)`;
//   };

//   const handleMouseLeave = () => {
//     setHovered(false);
//     if (cardRef.current) {
//       cardRef.current.style.transform = `perspective(900px) rotateY(0deg) rotateX(0deg) translateY(0px) scale(1)`;
//     }
//   };

//   return (
//     <div
//       style={{
//         padding: "10px 8px",
//         flexShrink: 0,
//         width: "100%",
//         animation: `fpSlideIn 0.5s ease ${index * 60}ms both`,
//       }}
//       className="fp-card-size"
//     >
//       <div
//         ref={cardRef}
//         style={{
//           background: "#fff",
//           borderRadius: "22px",
//           overflow: "hidden",
//           border: "1px solid #f0eeea",
//           transition: "transform 0.35s cubic-bezier(0.23, 1, 0.32, 1), box-shadow 0.35s cubic-bezier(0.23, 1, 0.32, 1)",
//           boxShadow: hovered ? "0 28px 65px rgba(0,0,0,0.13), 0 8px 22px rgba(0,0,0,0.06)" : "0 2px 14px rgba(0,0,0,0.04)",
//           position: "relative",
//           willChange: "transform",
//           cursor: "pointer",
//         }}
//         onMouseEnter={() => setHovered(true)}
//         onMouseMove={handleMouseMove}
//         onMouseLeave={handleMouseLeave}
//       >
//         {/* Image Zone */}
//         <div style={{ position: "relative", height: "215px", background: "#f7f5f2", overflow: "hidden" }}>
//           <img
//             src={product.img}
//             alt={product.name}
//             style={{
//               width: "100%", height: "100%", objectFit: "cover",
//               transition: "transform 0.55s cubic-bezier(0.23, 1, 0.32, 1)",
//               transform: hovered ? "scale(1.1)" : "scale(1)",
//             }}
//           />

//           {/* Dark gradient */}
//           <div style={{ position: "absolute", inset: 0, background: "linear-gradient(180deg, transparent 35%, rgba(0,0,0,0.5) 100%)" }} />

//           {/* Tag badge */}
//           <div style={{
//             position: "absolute", top: 12, left: 12,
//             padding: "4px 10px", borderRadius: "7px",
//             fontSize: "8px", fontWeight: 800, letterSpacing: "1.5px",
//             color: "white", background: product.color,
//             fontFamily: "'Plus Jakarta Sans', sans-serif",
//           }}>
//             {product.tag}
//           </div>

//           {/* Discount */}
//           <div style={{
//             position: "absolute", top: 12, right: 44,
//             background: "#0a0a0a", color: "white",
//             padding: "4px 9px", borderRadius: "7px",
//             fontSize: "9px", fontWeight: 800,
//             display: "flex", alignItems: "center", gap: 3,
//           }}>
//             <Flame size={9} />
//             -{product.discount}%
//           </div>

//           {/* Wishlist */}
//           <button
//             onClick={(e) => { e.stopPropagation(); setWished(!wished); }}
//             style={{
//               position: "absolute", top: 10, right: 10,
//               width: 34, height: 34,
//               background: wished ? "#FF006E" : "rgba(255,255,255,0.92)",
//               backdropFilter: "blur(8px)",
//               border: "none", borderRadius: "50%",
//               display: "flex", alignItems: "center", justifyContent: "center",
//               cursor: "pointer", color: wished ? "white" : "#666",
//               transition: "all 0.25s ease",
//               transform: hovered ? "scale(1.1)" : "scale(1)",
//             }}
//           >
//             <Heart size={13} fill={wished ? "white" : "none"} />
//           </button>

//           {/* Hover quick view */}
//           <div style={{
//             position: "absolute", bottom: 0, left: 0, right: 0,
//             padding: "14px", display: "flex", justifyContent: "center",
//             transform: hovered ? "translateY(0)" : "translateY(110%)",
//             transition: "transform 0.35s cubic-bezier(0.23, 1, 0.32, 1)",
//           }}>
//             <button style={{
//               background: "rgba(255,255,255,0.96)",
//               backdropFilter: "blur(12px)",
//               border: "none", padding: "9px 22px", borderRadius: "25px",
//               fontSize: "11px", fontWeight: 700, color: "#0a0a0a",
//               cursor: "pointer", display: "flex", alignItems: "center", gap: 5,
//               boxShadow: "0 4px 20px rgba(0,0,0,0.2)",
//               letterSpacing: "0.3px", whiteSpace: "nowrap",
//               fontFamily: "'Plus Jakarta Sans', sans-serif",
//             }}>
//               Quick View <ArrowUpRight size={12} />
//             </button>
//           </div>
//         </div>

//         {/* Card Body */}
//         <div style={{ padding: "14px 16px 16px" }}>
//           {/* Stars */}
//           <div style={{ display: "flex", alignItems: "center", gap: 2, marginBottom: 8 }}>
//             {[1,2,3,4,5].map(s => (
//               <Star key={s} size={10} fill={s <= product.rating ? product.color : "#e8e8e8"} color={s <= product.rating ? product.color : "#e8e8e8"} />
//             ))}
//             <span style={{ fontSize: "10px", color: "#bbb", marginLeft: 4, fontWeight: 500 }}>
//               ({product.reviews.toLocaleString()})
//             </span>
//           </div>

//           {/* Name */}
//           <p style={{
//             fontSize: "13px", fontWeight: 600, color: "#1a1a1a",
//             lineHeight: 1.45, marginBottom: 12,
//             display: "-webkit-box", WebkitLineClamp: 2,
//             WebkitBoxOrient: "vertical", overflow: "hidden", minHeight: 38,
//           }}>
//             {product.name}
//           </p>

//           {/* Price + Cart */}
//           <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
//             <div>
//               <span style={{ fontFamily: "'Bebas Neue', sans-serif", fontSize: 23, color: "#0a0a0a", letterSpacing: "0.5px" }}>
//                 ${product.price}
//               </span>
//               <span style={{ fontSize: 12, color: "#ccc", textDecoration: "line-through", marginLeft: 5 }}>
//                 ${product.oldPrice}
//               </span>
//             </div>

//             <button
//               onClick={handleAddCart}
//               style={{
//                 width: 40, height: 40, borderRadius: 13,
//                 border: added ? "none" : "2px solid #f0eeea",
//                 background: added ? "#06D6A0" : hovered ? product.color : "white",
//                 color: added || hovered ? "white" : "#555",
//                 display: "flex", alignItems: "center", justifyContent: "center",
//                 cursor: "pointer",
//                 transition: "all 0.28s cubic-bezier(0.23, 1, 0.32, 1)",
//                 transform: hovered ? "scale(1.1) rotate(-6deg)" : "scale(1)",
//                 boxShadow: hovered ? `0 8px 22px ${product.color}55` : "none",
//                 fontSize: 10, fontWeight: 800, flexShrink: 0,
//               }}
//             >
//               {added ? "✓" : <ShoppingBag size={15} />}
//             </button>
//           </div>
//         </div>

//         {/* Bottom color bar */}
//         <div style={{
//           position: "absolute", bottom: 0, left: 0, right: 0, height: 3,
//           background: product.color,
//           opacity: hovered ? 1 : 0,
//           transition: "opacity 0.3s ease",
//         }} />
//       </div>
//     </div>
//   );
// };

// const FeaturedProduct = () => {
//   const [selectedProduct, setSelectedProduct] = useState(null);
//   const [scrollProgress, setScrollProgress] = useState(0);

//   const [emblaRef, emblaApi] = useEmblaCarousel(
//     { loop: true, align: "start", dragFree: true },
//     [Autoplay({ delay: 3800, stopOnInteraction: true })]
//   );

//   useEffect(() => {
//     if (!emblaApi) return;
//     const onScroll = () => setScrollProgress(Math.max(0, Math.min(1, emblaApi.scrollProgress())));
//     emblaApi.on("scroll", onScroll);
//     emblaApi.on("reInit", onScroll);
//   }, [emblaApi]);

//   const scrollPrev = useCallback(() => emblaApi?.scrollPrev(), [emblaApi]);
//   const scrollNext = useCallback(() => emblaApi?.scrollNext(), [emblaApi]);

//   return (
//     <>
//       <style>{`
//         @import url('https://fonts.googleapis.com/css2?family=Bebas+Neue&family=Plus+Jakarta+Sans:wght@300;400;500;600;700&display=swap');

//         .fp-card-size { }
//         @media (min-width: 480px) { .fp-card-size { width: 50% !important; } }
//         @media (min-width: 768px) { .fp-card-size { width: 33.333% !important; } }
//         @media (min-width: 1024px) { .fp-card-size { width: 25% !important; } }
//         @media (min-width: 1280px) { .fp-card-size { width: 20% !important; } }

//         @keyframes fpSlideIn {
//           from { opacity: 0; transform: translateY(22px); }
//           to { opacity: 1; transform: translateY(0); }
//         }

//         .fp-nav-btn {
//           width: 42px; height: 42px; border-radius: 50%;
//           border: 1.5px solid #e8e6e2; background: white;
//           display: flex; align-items: center; justify-content: center;
//           cursor: pointer; transition: all 0.25s ease; color: #555;
//         }
//         .fp-nav-btn:hover { background: #0a0a0a; border-color: #0a0a0a; color: white; transform: scale(1.06); }

//         .fp-view-all-btn {
//           display: flex; align-items: center; gap: 6px;
//           font-size: 11px; font-weight: 700; color: #0a0a0a;
//           background: none; border: none; cursor: pointer;
//           letter-spacing: 0.8px; text-transform: uppercase;
//           padding: 10px 0; position: relative;
//           font-family: 'Plus Jakarta Sans', sans-serif;
//           transition: color 0.25s ease, gap 0.25s ease;
//         }
//         .fp-view-all-btn::after {
//           content: ''; position: absolute; bottom: 6px; left: 0;
//           width: 0; height: 1.5px; background: #FF6B35;
//           transition: width 0.3s ease;
//         }
//         .fp-view-all-btn:hover { color: #FF6B35; gap: 10px; }
//         .fp-view-all-btn:hover::after { width: 100%; }
//       `}</style>

//       <div style={{ fontFamily: "'Plus Jakarta Sans', sans-serif", marginBottom: 60, padding: "0 4px" }}>

//         {/* ── Header ── */}
//         <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-end", marginBottom: 32, padding: "0 4px" }}>

//           {/* Left */}
//           <div>
//             <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 6 }}>
//               <div style={{ width: 28, height: 2, background: "linear-gradient(90deg,#FF6B35,#FF006E)", borderRadius: 2 }} />
//               <span style={{ fontSize: 10, fontWeight: 700, letterSpacing: "3px", color: "#FF6B35", textTransform: "uppercase" }}>
//                 Curated Selection
//               </span>
//             </div>
//             <h2 style={{ fontFamily: "'Bebas Neue', sans-serif", fontSize: "clamp(32px, 4vw, 46px)", lineHeight: 0.95, color: "#0a0a0a", letterSpacing: 1, margin: 0 }}>
//               FEATURED<br />
//               <span style={{ WebkitTextStroke: "1.5px #0a0a0a", color: "transparent" }}>PRODUCTS</span>
//             </h2>
//             <p style={{ fontSize: 12, color: "#999", fontWeight: 400, marginTop: 8, maxWidth: 280, lineHeight: 1.6 }}>
//               Hand-picked deals you won't find anywhere else — updated weekly.
//             </p>
//           </div>

//           {/* Right: view all + controls */}
//           <div style={{ display: "flex", flexDirection: "column", alignItems: "flex-end", gap: 14 }}>
//             <button className="fp-view-all-btn">
//               View All Collection <ArrowUpRight size={13} />
//             </button>
//             <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
//               {/* Progress bar */}
//               <div style={{ width: 72, height: 3, background: "#f0eeea", borderRadius: 3, overflow: "hidden" }}>
//                 <div style={{ height: "100%", width: `${scrollProgress * 100}%`, background: "linear-gradient(90deg,#FF6B35,#FF006E)", borderRadius: 3, transition: "width 0.2s ease" }} />
//               </div>
//               <button className="fp-nav-btn" onClick={scrollPrev}><ChevronLeft size={18} /></button>
//               <button className="fp-nav-btn" onClick={scrollNext}><ChevronRight size={18} /></button>
//             </div>
//           </div>
//         </div>

//         {/* ── Slider ── */}
//         <div style={{ overflow: "hidden", margin: "0 -4px" }} ref={emblaRef}>
//           <div style={{ display: "flex" }}>
//             {products.map((product, i) => (
//               <ProductCard key={product.id} product={product} index={i} />
//             ))}
//           </div>
//         </div>
//       </div>

//       {selectedProduct && (
//         <ProductQuickView product={selectedProduct} onClose={() => setSelectedProduct(null)} />
//       )}
//     </>
//   );
// };

// export default FeaturedProduct;
























// import { useCallback, useState, useEffect } from "react";
// import useEmblaCarousel from "embla-carousel-react";
// import Autoplay from "embla-carousel-autoplay";
// import { Heart, Maximize2, ChevronLeft, ChevronRight, ShoppingCart, Star, Zap, Eye } from "lucide-react";
// import pp from "../../../assets/cyber-monday-shopping-sales.jpg";
// import ProductCard from "../../../Components/cards/ProductCard/ProductCard";
// import ProductQuickView from "../ProductQuickView/ProductQuickView";

// const FeaturedProduct = () => {
//   const [selectedProduct, setSelectedProduct] = useState(null);
//   const [activeIndex, setActiveIndex] = useState(0);
//   const [wishlist, setWishlist] = useState([]);

//   const products = [
//     {
//       id: 1,
//       name: "Werther's Original Caramel Hard Candies",
//       price: 14.97,
//       oldPrice: 20.0,
//       discount: "26%",
//       img: pp,
//       rating: 5,
//       reviews: 2341,
//       badge: "HOT",
//       badgeColor: "#ff4757",
//       description: "Classic smooth and creamy caramel candies made with real butter and fresh cream.",
//     },
//     {
//       id: 2,
//       name: "All Natural Italian-Style Chicken Meatballs",
//       price: 7.25,
//       oldPrice: 9.35,
//       discount: "23%",
//       img: pp,
//       rating: 4,
//       reviews: 891,
//       badge: "RECOMMENDED",
//       badgeColor: "#2ed573",
//       description: "Flavorful, pre-cooked meatballs seasoned with Italian herbs and spices.",
//     },
//     {
//       id: 3,
//       name: "Angie's Boomchickapop Sweet & Salty Kettle Corn",
//       price: 3.29,
//       oldPrice: 4.29,
//       discount: "24%",
//       img: pp,
//       rating: 5,
//       reviews: 1567,
//       badge: "NEW",
//       badgeColor: "#1e90ff",
//       description: "The perfect balance of sugar and sea salt. Non-GMO, gluten-free.",
//     },
//     {
//       id: 4,
//       name: "Field Roast Chao Cheese Creamy Original",
//       price: 19.5,
//       oldPrice: 24.0,
//       discount: "19%",
//       img: pp,
//       rating: 5,
//       reviews: 432,
//       badge: "ORGANIC",
//       badgeColor: "#7bed9f",
//       description: "A coconut-based vegan cheese alternative that melts beautifully.",
//     },
//     {
//       id: 5,
//       name: "Fresh Organic Honey Crushed Grapes",
//       price: 12.0,
//       oldPrice: 15.0,
//       discount: "20%",
//       img: pp,
//       rating: 5,
//       reviews: 789,
//       badge: "SALE",
//       badgeColor: "#ffa502",
//       description: "Farm-fresh, organic grapes bursting with natural sweetness.",
//     },
//   ];

//   const [emblaRef, emblaApi] = useEmblaCarousel(
//     { loop: true, align: "start", dragFree: true },
//     [Autoplay({ delay: 3500, stopOnInteraction: false })]
//   );

//   useEffect(() => {
//     if (!emblaApi) return;
//     emblaApi.on("select", () => setActiveIndex(emblaApi.selectedScrollSnap()));
//   }, [emblaApi]);

//   const scrollPrev = useCallback(() => emblaApi && emblaApi.scrollPrev(), [emblaApi]);
//   const scrollNext = useCallback(() => emblaApi && emblaApi.scrollNext(), [emblaApi]);

//   const toggleWishlist = (id) => {
//     setWishlist((prev) => prev.includes(id) ? prev.filter((i) => i !== id) : [...prev, id]);
//   };

//   return (
//     <>
//       <style>{`
//         @import url('https://fonts.googleapis.com/css2?family=Syne:wght@400;600;700;800&family=DM+Sans:wght@300;400;500&display=swap');

//         .featured-section { font-family: 'DM Sans', sans-serif; }
//         .featured-title { font-family: 'Syne', sans-serif; }

//         .product-card-pro {
//           background: #fff;
//           border-radius: 20px;
//           overflow: hidden;
//           margin: 8px;
//           border: 1px solid #f0f0f0;
//           transition: all 0.4s cubic-bezier(0.23, 1, 0.32, 1);
//           position: relative;
//           cursor: pointer;
//         }
//         .product-card-pro:hover {
//           transform: translateY(-8px);
//           box-shadow: 0 30px 60px rgba(0,0,0,0.12);
//           border-color: transparent;
//         }
//         .product-card-pro:hover .card-actions { opacity: 1; transform: translateY(0); }
//         .product-card-pro:hover .img-zoom { transform: scale(1.08); }

//         .img-wrapper {
//           height: 220px;
//           overflow: hidden;
//           position: relative;
//           background: linear-gradient(135deg, #f8f9ff 0%, #eef1ff 100%);
//         }
//         .img-zoom {
//           width: 100%; height: 100%; object-fit: cover;
//           transition: transform 0.6s cubic-bezier(0.23, 1, 0.32, 1);
//         }
//         .card-actions {
//           position: absolute;
//           bottom: 12px; right: 12px;
//           display: flex; flex-direction: column; gap: 8px;
//           opacity: 0;
//           transform: translateY(10px);
//           transition: all 0.3s ease;
//         }
//         .action-btn {
//           width: 38px; height: 38px;
//           background: white;
//           border: none; border-radius: 50%;
//           display: flex; align-items: center; justify-content: center;
//           box-shadow: 0 4px 15px rgba(0,0,0,0.15);
//           cursor: pointer;
//           transition: all 0.2s ease;
//         }
//         .action-btn:hover { background: #1a1a2e; color: white; transform: scale(1.1); }
//         .action-btn.wishlisted { background: #ff4757; color: white; }

//         .badge-pro {
//           position: absolute;
//           top: 12px; left: 12px;
//           padding: 4px 10px;
//           border-radius: 6px;
//           font-size: 9px;
//           font-weight: 800;
//           letter-spacing: 1px;
//           color: white;
//           font-family: 'Syne', sans-serif;
//         }

//         .discount-tag {
//           position: absolute;
//           top: 12px; right: 12px;
//           background: #1a1a2e;
//           color: #ffd700;
//           padding: 4px 8px;
//           border-radius: 6px;
//           font-size: 10px;
//           font-weight: 800;
//           font-family: 'Syne', sans-serif;
//         }

//         .card-body { padding: 16px; }

//         .stars { display: flex; gap: 2px; align-items: center; }
//         .star-filled { color: #ffd700; }
//         .star-empty { color: #e0e0e0; }

//         .price-new {
//           font-family: 'Syne', sans-serif;
//           font-size: 20px;
//           font-weight: 800;
//           color: #1a1a2e;
//         }
//         .price-old {
//           font-size: 13px;
//           color: #bbb;
//           text-decoration: line-through;
//         }

//         .add-cart-btn {
//           width: 100%;
//           padding: 11px;
//           background: linear-gradient(135deg, #1a1a2e 0%, #16213e 100%);
//           color: white;
//           border: none;
//           border-radius: 12px;
//           font-size: 12px;
//           font-weight: 700;
//           letter-spacing: 0.5px;
//           cursor: pointer;
//           display: flex; align-items: center; justify-content: center; gap: 6px;
//           transition: all 0.3s ease;
//           margin-top: 12px;
//           font-family: 'Syne', sans-serif;
//         }
//         .add-cart-btn:hover {
//           background: linear-gradient(135deg, #e63946 0%, #c1121f 100%);
//           transform: translateY(-1px);
//           box-shadow: 0 8px 20px rgba(230,57,70,0.35);
//         }

//         .nav-btn-pro {
//           position: absolute;
//           top: 50%; transform: translateY(-50%);
//           width: 46px; height: 46px;
//           background: white;
//           border: 1px solid #eee;
//           border-radius: 50%;
//           display: flex; align-items: center; justify-content: center;
//           cursor: pointer;
//           box-shadow: 0 8px 25px rgba(0,0,0,0.12);
//           z-index: 30;
//           opacity: 0;
//           transition: all 0.3s ease;
//           color: #1a1a2e;
//         }
//         .nav-btn-pro:hover { background: #1a1a2e; color: white; border-color: #1a1a2e; }
//         .slider-group:hover .nav-btn-pro { opacity: 1; }

//         .section-label {
//           display: inline-flex; align-items: center; gap: 6px;
//           background: linear-gradient(135deg, #1a1a2e, #16213e);
//           color: white;
//           padding: 5px 14px;
//           border-radius: 20px;
//           font-size: 10px;
//           font-weight: 700;
//           letter-spacing: 2px;
//           font-family: 'Syne', sans-serif;
//           margin-bottom: 8px;
//         }

//         .view-all-btn {
//           padding: 9px 22px;
//           background: transparent;
//           border: 1.5px solid #1a1a2e;
//           border-radius: 25px;
//           font-size: 12px;
//           font-weight: 700;
//           color: #1a1a2e;
//           cursor: pointer;
//           transition: all 0.3s ease;
//           font-family: 'Syne', sans-serif;
//           letter-spacing: 0.5px;
//         }
//         .view-all-btn:hover {
//           background: #1a1a2e;
//           color: white;
//           transform: translateY(-2px);
//           box-shadow: 0 8px 20px rgba(26,26,46,0.2);
//         }
//       `}</style>

//       <div className="featured-section mb-12 px-4 lg:px-0">
//         {/* Header */}
//         <div className="flex justify-between items-end mb-8">
//           <div>
//             <div className="section-label">
//               <Zap size={10} />
//               FEATURED COLLECTION
//             </div>
//             <h2 className="featured-title text-2xl font-extrabold text-gray-900 leading-tight">
//               Handpicked For You
//             </h2>
//             <p className="text-xs text-gray-400 mt-1 font-medium">
//               Curated deals — valid until end of March
//             </p>
//           </div>
//           <button className="view-all-btn">View All →</button>
//         </div>

//         {/* Slider */}
//         <div className="relative slider-group">
//           <div className="overflow-hidden rounded-2xl" ref={emblaRef}>
//             <div className="flex">
//               {products.map((product) => (
//                 <div
//                   key={product.id}
//                   className="flex-shrink-0 w-full sm:w-1/2 md:w-1/3 lg:w-1/4 xl:w-1/5"
//                 >
//                   <div className="product-card-pro">
//                     {/* Image */}
//                     <div className="img-wrapper">
//                       <img src={product.img} alt={product.name} className="img-zoom" />

//                       {/* Badge */}
//                       <span className="badge-pro" style={{ background: product.badgeColor }}>
//                         {product.badge}
//                       </span>

//                       {/* Discount */}
//                       <span className="discount-tag">-{product.discount}</span>

//                       {/* Actions */}
//                       <div className="card-actions">
//                         <button
//                           className={`action-btn ${wishlist.includes(product.id) ? "wishlisted" : ""}`}
//                           onClick={() => toggleWishlist(product.id)}
//                         >
//                           <Heart size={15} fill={wishlist.includes(product.id) ? "white" : "none"} />
//                         </button>
//                         <button
//                           className="action-btn"
//                           onClick={() => setSelectedProduct(product)}
//                         >
//                           <Eye size={15} />
//                         </button>
//                       </div>
//                     </div>

//                     {/* Body */}
//                     <div className="card-body">
//                       {/* Stars */}
//                       <div className="stars mb-2">
//                         {[1,2,3,4,5].map((s) => (
//                           <Star
//                             key={s}
//                             size={11}
//                             className={s <= product.rating ? "star-filled" : "star-empty"}
//                             fill={s <= product.rating ? "#ffd700" : "#e0e0e0"}
//                           />
//                         ))}
//                         <span style={{ fontSize: "10px", color: "#aaa", marginLeft: "4px" }}>
//                           ({product.reviews.toLocaleString()})
//                         </span>
//                       </div>

//                       {/* Name */}
//                       <p className="text-gray-800 font-semibold text-sm leading-snug mb-3 line-clamp-2">
//                         {product.name}
//                       </p>

//                       {/* Price */}
//                       <div className="flex items-baseline gap-2">
//                         <span className="price-new">${product.price}</span>
//                         <span className="price-old">${product.oldPrice}</span>
//                       </div>

//                       {/* Cart Button */}
//                       <button className="add-cart-btn">
//                         <ShoppingCart size={13} />
//                         ADD TO CART
//                       </button>
//                     </div>
//                   </div>
//                 </div>
//               ))}
//             </div>
//           </div>

//           {/* Nav Buttons */}
//           <button className="nav-btn-pro" style={{ left: "-23px" }} onClick={scrollPrev}>
//             <ChevronLeft size={20} />
//           </button>
//           <button className="nav-btn-pro" style={{ right: "-23px" }} onClick={scrollNext}>
//             <ChevronRight size={20} />
//           </button>
//         </div>
//       </div>

//       {/* Quick View Modal */}
//       {selectedProduct && (
//         <ProductQuickView
//           product={selectedProduct}
//           onClose={() => setSelectedProduct(null)}
//         />
//       )}
//     </>
//   );
// };

// export default FeaturedProduct;















// import { useCallback, useState } from "react";
// import useEmblaCarousel from "embla-carousel-react";
// import Autoplay from "embla-carousel-autoplay";
// import { Heart, Maximize2, ChevronLeft, ChevronRight } from "lucide-react";
// import pp from "../../../assets/cyber-monday-shopping-sales.jpg";
// import ProductCard from "../../../Components/cards/ProductCard/ProductCard";
// import ProductQuickView from "../ProductQuickView/ProductQuickView";

// const FeaturedProduct = () => {
//   const [selectedProduct, setSelectedProduct] = useState(null);
//   const products = [
//     {
//       id: 1,
//       name: "Werther's Original Caramel Hard Candies",
//       price: 14.97,
//       oldPrice: 20.0,
//       discount: "26%",
//       img: pp,
//       rating: 5,
//       description:
//         "Classic smooth and creamy caramel candies made with real butter and fresh cream for a rich, melting taste.",
//     },
//     {
//       id: 2,
//       name: "All Natural Italian-Style Chicken Meatballs",
//       price: 7.25,
//       oldPrice: 9.35,
//       discount: "23%",
//       img: pp,
//       rating: 4,
//       recommended: true,
//       description:
//         "Flavorful, pre-cooked meatballs seasoned with Italian herbs and spices. Perfect for pasta, subs, or as a quick snack.",
//     },
//     {
//       id: 3,
//       name: "Angie's Boomchickapop Sweet & Salty Kettle Corn",
//       price: 3.29,
//       oldPrice: 4.29,
//       discount: "24%",
//       img: pp,
//       rating: 5,
//       description:
//         "The perfect balance of sugar and sea salt. Non-GMO, gluten-free, and only 70 calories per cup for guilt-free snacking.",
//     },
//     {
//       id: 4,
//       name: "Field Roast Chao Cheese Creamy Original",
//       price: 19.5,
//       oldPrice: 24.0,
//       discount: "19%",
//       img: pp,
//       rating: 5,
//       organic: true,
//       description:
//         "A coconut-based vegan cheese alternative that melts beautifully. Creamy and rich with a sophisticated savory finish.",
//     },
//     {
//       id: 5,
//       name: "Fresh Organic Honey Crushed Grapes",
//       price: 12.0,
//       oldPrice: 15.0,
//       discount: "20%",
//       img: pp,
//       rating: 5,
//       description:
//         "Farm-fresh, organic grapes bursting with natural sweetness. A healthy, juicy addition to your daily fruit bowl.",
//     },
//   ];

// const [emblaRef, emblaApi] = useEmblaCarousel(
//   {
//     loop: true,
//     align: "start",
//     dragFree: true,
//   },
//   [Autoplay({ delay: 4000, stopOnInteraction: false })]
// );


//   const scrollPrev = useCallback(
//     () => emblaApi && emblaApi.scrollPrev(),
//     [emblaApi],
//   );
//   const scrollNext = useCallback(
//     () => emblaApi && emblaApi.scrollNext(),
//     [emblaApi],
//   );

//   return (
//     <div className="flex-grow mb-10 px-4 lg:px-0">
//       <div className="flex justify-between items-center mb-6">
//         <div>
//           <h3 className="text-xl font-bold text-gray-900 uppercase tracking-tight">
//            Featured Products
//           </h3>
//           <p className="text-xs text-gray-400 font-medium mt-1">
//             Do not miss the current offers until the end of March.
//           </p>
//         </div>
//         <button className="border border-gray-200 rounded-full px-5 py-2 text-xs font-bold text-gray-500 hover:bg-blue-600 hover:text-white transition-all shadow-sm">
//           View All →
//         </button>
//       </div>

//       {/* Slider Wrapper with Relative Position */}
//       <div className="relative group">
//         {/* Viewport */}
//         <div
//           className="overflow-hidden border-l border-t border-gray-100 rounded-lg"
//           ref={emblaRef}
//         >
//           <div className="flex">
//             {products.map((product) => (
//               <div
//                 key={product.id}
//                 className="
//         flex-shrink-0
//         w-full
//         sm:w-1/2
//         md:w-1/3
//         lg:w-1/4
//       "
//               >
//                 <ProductCard
//                   product={product}
//                   onQuickView={() => setSelectedProduct(product)}
//                 />
//               </div>
//             ))}
//           </div>
//         </div>

//         <button
//           onClick={scrollPrev}
//           className="absolute -left-5 top-1/2 -translate-y-1/2 bg-white border border-gray-200 p-3 rounded-full shadow-xl z-30 opacity-0 group-hover:opacity-100 transition-all duration-300 hover:bg-blue-600 hover:text-white"
//         >
//           <ChevronLeft size={24} />
//         </button>
//         <button
//           onClick={scrollNext}
//           className="absolute -right-5 top-1/2 -translate-y-1/2 bg-white border border-gray-200 p-3 rounded-full shadow-xl z-30 opacity-0 group-hover:opacity-100 transition-all duration-300 hover:bg-blue-600 hover:text-white"
//         >
//           <ChevronRight size={24} />
//         </button>
//       </div>
//       {/* 🔥 MODAL */}
//       {selectedProduct && (
//         <ProductQuickView
//           product={selectedProduct}
//           onClose={() => setSelectedProduct(null)}
//         />
//       )}
//     </div>
//   );
// };

// export default FeaturedProduct;
