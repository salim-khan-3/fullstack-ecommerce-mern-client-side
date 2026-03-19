import { useEffect, useState } from "react";
import { useNavigate, useSearchParams, Link } from "react-router-dom";
import { CheckCircle, Package, MapPin, CreditCard, Clock, ArrowRight, ShoppingBag, Copy, Check } from "lucide-react";
import { useCart } from "../../context/CartContext";

const OrderSuccess = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const orderId = searchParams.get("orderId");

  const { resetCart } = useCart();

  const [visible, setVisible] = useState(false);
  const [copied, setCopied]   = useState(false);

  useEffect(() => {
    // Page load হওয়ার সাথে সাথে cart clear করো
    // COD তে Checkout এ clear হয়, SSLCommerz এ এখানে clear হয়
    resetCart();

    const t = setTimeout(() => setVisible(true), 100);
    return () => clearTimeout(t);
  }, []);

  const handleCopy = () => {
    if (!orderId) return;
    navigator.clipboard.writeText(orderId);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-50 via-white to-sky-50 flex items-center justify-center px-4 py-16">

      {/* Background decorative blobs */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden">
        <div className="absolute -top-32 -left-32 w-96 h-96 bg-emerald-100/60 rounded-full blur-3xl" />
        <div className="absolute -bottom-32 -right-32 w-96 h-96 bg-sky-100/60 rounded-full blur-3xl" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-emerald-50/40 rounded-full blur-3xl" />
      </div>

      <div
        className={`relative w-full max-w-lg transition-all duration-700 ease-out
          ${visible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"}`}
      >
        {/* Main Card */}
        <div className="bg-white/80 backdrop-blur-xl rounded-[2.5rem] shadow-2xl shadow-emerald-100/50 border border-white/60 overflow-hidden">

          {/* Top green strip */}
          <div className="h-1.5 w-full bg-gradient-to-r from-emerald-400 via-green-400 to-teal-400" />

          <div className="p-8 md:p-10">

            {/* Success Icon */}
            <div
              className={`flex justify-center mb-7 transition-all duration-700 delay-200
                ${visible ? "opacity-100 scale-100" : "opacity-0 scale-50"}`}
            >
              <div className="relative">
                <div className="absolute inset-0 rounded-full bg-emerald-100 animate-ping opacity-30 scale-125" />
                <div className="relative w-24 h-24 rounded-full bg-gradient-to-br from-emerald-400 to-teal-500
                                flex items-center justify-center shadow-xl shadow-emerald-200">
                  <CheckCircle size={44} className="text-white" strokeWidth={2} />
                </div>
              </div>
            </div>

            {/* Title */}
            <div
              className={`text-center mb-8 transition-all duration-700 delay-300
                ${visible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"}`}
            >
              <h1 className="text-3xl md:text-4xl font-black text-gray-900 tracking-tight mb-2">
                Order Confirmed! 🎉
              </h1>
              <p className="text-gray-500 text-base leading-relaxed">
                Thank you for your purchase. Your order has been placed successfully.
              </p>
            </div>

            {/* Order ID Card */}
            {orderId && (
              <div
                className={`mb-6 transition-all duration-700 delay-[400ms]
                  ${visible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"}`}
              >
                <div className="flex items-center justify-between px-5 py-4 rounded-2xl
                                bg-gray-50 border border-gray-100">
                  <div>
                    <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-0.5">
                      Order ID
                    </p>
                    <p className="text-sm font-black text-gray-800 font-mono tracking-wide">
                      #{orderId.slice(-8).toUpperCase()}
                    </p>
                  </div>
                  <button
                    onClick={handleCopy}
                    className="flex items-center gap-1.5 px-3 py-2 rounded-xl
                               bg-white border border-gray-200
                               text-xs font-semibold text-gray-500
                               hover:border-emerald-300 hover:text-emerald-600
                               transition-all duration-200"
                  >
                    {copied ? (
                      <><Check size={13} className="text-emerald-500" /> Copied!</>
                    ) : (
                      <><Copy size={13} /> Copy</>
                    )}
                  </button>
                </div>
              </div>
            )}

            {/* Info Cards */}
            <div
              className={`grid grid-cols-2 gap-3 mb-8 transition-all duration-700 delay-500
                ${visible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"}`}
            >
              {[
                { icon: Clock,       label: "Estimated Delivery", value: "3 - 5 Business Days", color: "text-sky-500",     bg: "bg-sky-50 border-sky-100" },
                { icon: CreditCard,  label: "Payment",            value: "Cash on Delivery",    color: "text-violet-500",  bg: "bg-violet-50 border-violet-100" },
                { icon: Package,     label: "Status",             value: "Processing",          color: "text-amber-500",   bg: "bg-amber-50 border-amber-100" },
                { icon: MapPin,      label: "Shipping",           value: "Standard Delivery",   color: "text-emerald-500", bg: "bg-emerald-50 border-emerald-100" },
              ].map((item) => (
                <div
                  key={item.label}
                  className={`flex items-start gap-3 p-4 rounded-2xl border ${item.bg}`}
                >
                  <div className={`mt-0.5 ${item.color}`}>
                    <item.icon size={16} />
                  </div>
                  <div className="min-w-0">
                    <p className="text-[10px] font-bold text-gray-400 uppercase tracking-wider leading-none mb-1">
                      {item.label}
                    </p>
                    <p className="text-xs font-bold text-gray-700 leading-snug">
                      {item.value}
                    </p>
                  </div>
                </div>
              ))}
            </div>

            {/* Divider */}
            <div className="h-px w-full bg-gray-100 mb-7" />

            {/* Action Buttons */}
            <div
              className={`flex flex-col gap-3 transition-all duration-700 delay-[600ms]
                ${visible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"}`}
            >
              <Link
                to={orderId ? `/orders/${orderId}` : "/orders"}
                className="flex items-center justify-center gap-2.5 w-full py-4 rounded-2xl
                           bg-gradient-to-r from-emerald-500 to-teal-500
                           text-white font-bold text-sm
                           shadow-lg shadow-emerald-200
                           hover:shadow-xl hover:shadow-emerald-300
                           hover:scale-[1.02] active:scale-[0.98]
                           transition-all duration-200"
              >
                <Package size={18} />
                Track My Order
                <ArrowRight size={16} />
              </Link>

              <Link
                to="/"
                className="flex items-center justify-center gap-2.5 w-full py-4 rounded-2xl
                           bg-gray-50 border border-gray-200
                           text-gray-700 font-bold text-sm
                           hover:bg-gray-100 hover:border-gray-300
                           hover:scale-[1.02] active:scale-[0.98]
                           transition-all duration-200"
              >
                <ShoppingBag size={17} />
                Continue Shopping
              </Link>
            </div>
          </div>
        </div>

        {/* Bottom note */}
        <p
          className={`text-center text-xs text-gray-400 mt-5 transition-all duration-700 delay-700
            ${visible ? "opacity-100" : "opacity-0"}`}
        >
          A confirmation will be sent to your email. Need help?{" "}
          <Link to="/contact" className="text-emerald-600 font-semibold hover:underline">
            Contact Support
          </Link>
        </p>
      </div>
    </div>
  );
};

export default OrderSuccess;



















// import { useEffect, useState } from "react";
// import { useNavigate, useSearchParams, Link } from "react-router-dom";
// import { CheckCircle, Package, MapPin, CreditCard, Clock, ArrowRight, ShoppingBag, Copy, Check } from "lucide-react";

// const OrderSuccess = () => {
//   const navigate = useNavigate();
//   const [searchParams] = useSearchParams();
//   const orderId = searchParams.get("orderId");

//   const [visible, setVisible] = useState(false);
//   const [copied, setCopied] = useState(false);

//   useEffect(() => {
//     // Mount হওয়ার পর animate করো
//     const t = setTimeout(() => setVisible(true), 100);
//     return () => clearTimeout(t);
//   }, []);

//   const handleCopy = () => {
//     if (!orderId) return;
//     navigator.clipboard.writeText(orderId);
//     setCopied(true);
//     setTimeout(() => setCopied(false), 2000);
//   };

//   return (
//     <div className="min-h-screen bg-gradient-to-br from-emerald-50 via-white to-sky-50 flex items-center justify-center px-4 py-16">

//       {/* Background decorative blobs */}
//       <div className="fixed inset-0 pointer-events-none overflow-hidden">
//         <div className="absolute -top-32 -left-32 w-96 h-96 bg-emerald-100/60 rounded-full blur-3xl" />
//         <div className="absolute -bottom-32 -right-32 w-96 h-96 bg-sky-100/60 rounded-full blur-3xl" />
//         <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-emerald-50/40 rounded-full blur-3xl" />
//       </div>

//       <div
//         className={`relative w-full max-w-lg transition-all duration-700 ease-out
//           ${visible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"}`}
//       >

//         {/* Main Card */}
//         <div className="bg-white/80 backdrop-blur-xl rounded-[2.5rem] shadow-2xl shadow-emerald-100/50 border border-white/60 overflow-hidden">

//           {/* Top green strip */}
//           <div className="h-1.5 w-full bg-gradient-to-r from-emerald-400 via-green-400 to-teal-400" />

//           <div className="p-8 md:p-10">

//             {/* Success Icon */}
//             <div
//               className={`flex justify-center mb-7 transition-all duration-700 delay-200
//                 ${visible ? "opacity-100 scale-100" : "opacity-0 scale-50"}`}
//             >
//               <div className="relative">
//                 {/* Outer ring */}
//                 <div className="absolute inset-0 rounded-full bg-emerald-100 animate-ping opacity-30 scale-125" />
//                 {/* Icon bg */}
//                 <div className="relative w-24 h-24 rounded-full bg-gradient-to-br from-emerald-400 to-teal-500
//                                 flex items-center justify-center shadow-xl shadow-emerald-200">
//                   <CheckCircle size={44} className="text-white" strokeWidth={2} />
//                 </div>
//               </div>
//             </div>

//             {/* Title */}
//             <div
//               className={`text-center mb-8 transition-all duration-700 delay-300
//                 ${visible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"}`}
//             >
//               <h1 className="text-3xl md:text-4xl font-black text-gray-900 tracking-tight mb-2">
//                 Order Confirmed! 🎉
//               </h1>
//               <p className="text-gray-500 text-base leading-relaxed">
//                 Thank you for your purchase. Your order has been placed successfully.
//               </p>
//             </div>

//             {/* Order ID Card */}
//             {orderId && (
//               <div
//                 className={`mb-6 transition-all duration-700 delay-[400ms]
//                   ${visible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"}`}
//               >
//                 <div className="flex items-center justify-between px-5 py-4 rounded-2xl
//                                 bg-gray-50 border border-gray-100">
//                   <div>
//                     <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-0.5">
//                       Order ID
//                     </p>
//                     <p className="text-sm font-black text-gray-800 font-mono tracking-wide">
//                       #{orderId.slice(-8).toUpperCase()}
//                     </p>
//                   </div>
//                   <button
//                     onClick={handleCopy}
//                     className="flex items-center gap-1.5 px-3 py-2 rounded-xl
//                                bg-white border border-gray-200
//                                text-xs font-semibold text-gray-500
//                                hover:border-emerald-300 hover:text-emerald-600
//                                transition-all duration-200"
//                   >
//                     {copied ? (
//                       <><Check size={13} className="text-emerald-500" /> Copied!</>
//                     ) : (
//                       <><Copy size={13} /> Copy</>
//                     )}
//                   </button>
//                 </div>
//               </div>
//             )}

//             {/* Info Cards */}
//             <div
//               className={`grid grid-cols-2 gap-3 mb-8 transition-all duration-700 delay-500
//                 ${visible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"}`}
//             >
//               {[
//                 {
//                   icon: Clock,
//                   label: "Estimated Delivery",
//                   value: "3 - 5 Business Days",
//                   color: "text-sky-500",
//                   bg: "bg-sky-50 border-sky-100",
//                 },
//                 {
//                   icon: CreditCard,
//                   label: "Payment",
//                   value: "Cash on Delivery",
//                   color: "text-violet-500",
//                   bg: "bg-violet-50 border-violet-100",
//                 },
//                 {
//                   icon: Package,
//                   label: "Status",
//                   value: "Processing",
//                   color: "text-amber-500",
//                   bg: "bg-amber-50 border-amber-100",
//                 },
//                 {
//                   icon: MapPin,
//                   label: "Shipping",
//                   value: "Standard Delivery",
//                   color: "text-emerald-500",
//                   bg: "bg-emerald-50 border-emerald-100",
//                 },
//               ].map((item) => (
//                 <div
//                   key={item.label}
//                   className={`flex items-start gap-3 p-4 rounded-2xl border ${item.bg}`}
//                 >
//                   <div className={`mt-0.5 ${item.color}`}>
//                     <item.icon size={16} />
//                   </div>
//                   <div className="min-w-0">
//                     <p className="text-[10px] font-bold text-gray-400 uppercase tracking-wider leading-none mb-1">
//                       {item.label}
//                     </p>
//                     <p className="text-xs font-bold text-gray-700 leading-snug">
//                       {item.value}
//                     </p>
//                   </div>
//                 </div>
//               ))}
//             </div>

//             {/* Divider */}
//             <div className="h-px w-full bg-gray-100 mb-7" />

//             {/* Action Buttons */}
//             <div
//               className={`flex flex-col gap-3 transition-all duration-700 delay-[600ms]
//                 ${visible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"}`}
//             >
//               {/* Track Order */}
//               <Link
//                 to={orderId ? `/orders/${orderId}` : "/orders"}
//                 className="flex items-center justify-center gap-2.5 w-full py-4 rounded-2xl
//                            bg-gradient-to-r from-emerald-500 to-teal-500
//                            text-white font-bold text-sm
//                            shadow-lg shadow-emerald-200
//                            hover:shadow-xl hover:shadow-emerald-300
//                            hover:scale-[1.02] active:scale-[0.98]
//                            transition-all duration-200"
//               >
//                 <Package size={18} />
//                 Track My Order
//                 <ArrowRight size={16} />
//               </Link>

//               {/* Continue Shopping */}
//               <Link
//                 to="/"
//                 className="flex items-center justify-center gap-2.5 w-full py-4 rounded-2xl
//                            bg-gray-50 border border-gray-200
//                            text-gray-700 font-bold text-sm
//                            hover:bg-gray-100 hover:border-gray-300
//                            hover:scale-[1.02] active:scale-[0.98]
//                            transition-all duration-200"
//               >
//                 <ShoppingBag size={17} />
//                 Continue Shopping
//               </Link>
//             </div>
//           </div>
//         </div>

//         {/* Bottom note */}
//         <p
//           className={`text-center text-xs text-gray-400 mt-5 transition-all duration-700 delay-700
//             ${visible ? "opacity-100" : "opacity-0"}`}
//         >
//           A confirmation will be sent to your email. Need help?{" "}
//           <Link to="/contact" className="text-emerald-600 font-semibold hover:underline">
//             Contact Support
//           </Link>
//         </p>
//       </div>
//     </div>
//   );
// };

// export default OrderSuccess;