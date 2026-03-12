import { useState, useContext } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronDown, MapPin, CreditCard, Truck, Package, CheckCircle2, ShieldCheck, Loader2 } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import { useCart } from "../../context/CartContext";
import { useAuth } from "../../context/AuthContext";
import { placeOrderApi, initPaymentApi } from "../../utils/api/orderApi";
import toast from "react-hot-toast";

const Checkout = () => {
  const { cartItems, cartTotal, clearCart } = useCart();
  const { user, token } = useAuth();
  const navigate = useNavigate();

  const [shipping, setShipping] = useState("flat");
  const [payment, setPayment] = useState("cod");
  const [focused, setFocused] = useState("");
  const [placing, setPlacing] = useState(false);

  const [form, setForm] = useState({
    firstName:  user?.name?.split(" ")[0] || "",
    lastName:   user?.name?.split(" ")[1] || "",
    company:    "",
    country:    "Bangladesh",
    street1:    "",
    street2:    "",
    city:       "",
    state:      "",
    zipCode:    "",
    phone:      "",
    email:      user?.email || "",
    notes:      "",
  });

  const shippingCost = shipping === "flat" ? 5 : 0;
  const subTotal     = cartTotal;
  const totalPrice   = subTotal + shippingCost;

  const handleChange = (e) => {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  // Validation
  const validate = () => {
    const required = ["firstName", "lastName", "country", "street1", "city", "state", "zipCode", "phone", "email"];
    for (const field of required) {
      if (!form[field]?.trim()) {
        toast.error(`Please fill in ${field.replace(/([A-Z])/g, " $1").toLowerCase()}`);
        return false;
      }
    }
    return true;
  };

  const handlePlaceOrder = async () => {
    if (!validate()) return;
    if (cartItems.length === 0) {
      toast.error("Your cart is empty");
      return;
    }

    setPlacing(true);
    try {
      // 1 — Build order payload
      const orderData = {
        orderItems: cartItems.map((item) => ({
          productId:    item.productId,
          productTitle: item.productTitle,
          image:        item.images,
          price:        item.price,
          quantity:     item.quantity,
          countInStock: item.countInStock,
          subTotal:     item.subTotal,
        })),
        shippingAddress: form,
        paymentMethod:   payment,
        shippingMethod:  shipping,
        shippingCost,
        subTotal,
        totalPrice,
      };

      // 2 — Place order
      const orderRes = await placeOrderApi(orderData, token);
      const orderId  = orderRes.order._id;

      // 3 — Payment flow
      if (payment === "sslcommerz") {
        const payRes = await initPaymentApi(orderId, token);
        if (payRes.success && payRes.gatewayUrl) {
          window.location.href = payRes.gatewayUrl; // SSLCommerz page এ redirect
        } else {
          toast.error("Payment init failed");
        }
      } else {
        // COD or Bank — directly go to success page
        toast.success("Order placed successfully!");
        navigate(`/payment/success?orderId=${orderId}`);
      }
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to place order");
    } finally {
      setPlacing(false);
    }
  };

  const inputClass = (name) =>
    `w-full px-4 py-3 rounded-xl border text-sm font-medium text-slate-700 bg-white outline-none transition-all duration-200
    ${focused === name
      ? "border-indigo-400 ring-2 ring-indigo-100 shadow-sm"
      : "border-slate-200 hover:border-slate-300"
    }`;

  const fadeUp = {
    hidden:  { opacity: 0, y: 16 },
    visible: (i) => ({ opacity: 1, y: 0, transition: { delay: i * 0.05, duration: 0.4, ease: [0.22, 1, 0.36, 1] } }),
  };

  return (
    <div className="min-h-screen bg-[#f5f4f0] py-10 px-4 sm:px-6 lg:px-8">

      {/* Breadcrumb */}
      <div className="max-w-6xl mx-auto mb-8 flex items-center gap-2 text-xs text-slate-400 font-medium">
        <Link to="/cart" className="hover:text-slate-600 transition-colors">Cart</Link>
        <span className="text-slate-300">›</span>
        <span className="text-slate-700 font-semibold">Checkout</span>
        <span className="text-slate-300">›</span>
        <span>Confirmation</span>
      </div>

      <div className="max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">

        {/* ── LEFT: BILLING ── */}
        <motion.div
          initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
          className="lg:col-span-7 bg-white rounded-3xl shadow-sm border border-slate-100 overflow-hidden"
        >
          <div className="px-8 py-6 border-b border-slate-100 flex items-center gap-3">
            <div className="w-8 h-8 rounded-xl bg-indigo-50 flex items-center justify-center">
              <MapPin size={15} className="text-indigo-500" />
            </div>
            <div>
              <h2 className="text-base font-bold text-slate-800 leading-none">Billing Details</h2>
              <p className="text-xs text-slate-400 mt-0.5">Where should we send your invoice?</p>
            </div>
          </div>

          <div className="p-8 space-y-5">

            {/* Name */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {[["firstName", "First name *", "text", "John"], ["lastName", "Last name *", "text", "Doe"]].map(([name, label, type, ph], i) => (
                <motion.div key={name} custom={i} variants={fadeUp} initial="hidden" animate="visible">
                  <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1.5">{label}</label>
                  <input name={name} type={type} placeholder={ph} value={form[name]} onChange={handleChange}
                    onFocus={() => setFocused(name)} onBlur={() => setFocused("")}
                    className={inputClass(name)} />
                </motion.div>
              ))}
            </div>

            {/* Company */}
            <motion.div custom={2} variants={fadeUp} initial="hidden" animate="visible">
              <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1.5">
                Company name <span className="text-slate-300 normal-case font-normal">(optional)</span>
              </label>
              <input name="company" type="text" value={form.company} onChange={handleChange}
                onFocus={() => setFocused("company")} onBlur={() => setFocused("")}
                className={inputClass("company")} />
            </motion.div>

            {/* Country */}
            <motion.div custom={3} variants={fadeUp} initial="hidden" animate="visible" className="relative">
              <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1.5">Country / Region *</label>
              <div className="relative">
                <select name="country" value={form.country} onChange={handleChange}
                  onFocus={() => setFocused("country")} onBlur={() => setFocused("")}
                  className={`${inputClass("country")} appearance-none pr-10 cursor-pointer`}>
                  <option>Bangladesh</option>
                  <option>India</option>
                  <option>USA</option>
                  <option>UK</option>
                </select>
                <ChevronDown size={14} className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
              </div>
            </motion.div>

            {/* Street */}
            <motion.div custom={4} variants={fadeUp} initial="hidden" animate="visible">
              <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1.5">Street address *</label>
              <div className="space-y-3">
                <input name="street1" type="text" placeholder="House number and street name" value={form.street1} onChange={handleChange}
                  onFocus={() => setFocused("street1")} onBlur={() => setFocused("")} className={inputClass("street1")} />
                <input name="street2" type="text" placeholder="Apartment, suite, unit, etc. (optional)" value={form.street2} onChange={handleChange}
                  onFocus={() => setFocused("street2")} onBlur={() => setFocused("")} className={inputClass("street2")} />
              </div>
            </motion.div>

            {/* City / State / ZIP */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              {[["city", "Town / City *"], ["state", "State / County *"], ["zipCode", "Postcode / ZIP *"]].map(([name, label], i) => (
                <motion.div key={name} custom={5 + i} variants={fadeUp} initial="hidden" animate="visible">
                  <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1.5">{label}</label>
                  <input name={name} type="text" value={form[name]} onChange={handleChange}
                    onFocus={() => setFocused(name)} onBlur={() => setFocused("")} className={inputClass(name)} />
                </motion.div>
              ))}
            </div>

            {/* Phone / Email */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {[["phone", "Phone *", "tel", "+880 ..."], ["email", "Email address *", "email", "john@email.com"]].map(([name, label, type, ph], i) => (
                <motion.div key={name} custom={8 + i} variants={fadeUp} initial="hidden" animate="visible">
                  <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1.5">{label}</label>
                  <input name={name} type={type} placeholder={ph} value={form[name]} onChange={handleChange}
                    onFocus={() => setFocused(name)} onBlur={() => setFocused("")} className={inputClass(name)} />
                </motion.div>
              ))}
            </div>

            {/* Notes */}
            <motion.div custom={10} variants={fadeUp} initial="hidden" animate="visible">
              <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1.5">
                Order notes <span className="text-slate-300 normal-case font-normal">(optional)</span>
              </label>
              <textarea name="notes" rows={3} placeholder="Notes about your order, e.g. special delivery instructions..."
                value={form.notes} onChange={handleChange}
                onFocus={() => setFocused("notes")} onBlur={() => setFocused("")}
                className={`${inputClass("notes")} resize-none`} />
            </motion.div>

          </div>
        </motion.div>

        {/* ── RIGHT: ORDER SUMMARY ── */}
        <motion.div
          initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1, ease: [0.22, 1, 0.36, 1] }}
          className="lg:col-span-5 space-y-4 sticky top-6"
        >

          {/* Order Summary */}
          <div className="bg-white rounded-3xl border border-slate-100 shadow-sm overflow-hidden">
            <div className="px-6 py-5 border-b border-slate-100 flex items-center gap-3">
              <div className="w-8 h-8 rounded-xl bg-amber-50 flex items-center justify-center">
                <Package size={15} className="text-amber-500" />
              </div>
              <div>
                <h2 className="text-base font-bold text-slate-800 leading-none">Your Order</h2>
                <p className="text-xs text-slate-400 mt-0.5">{cartItems.length} items</p>
              </div>
            </div>

            {/* Cart Items */}
            <div className="px-6 py-4 space-y-3 max-h-48 overflow-y-auto">
              {cartItems.map((item) => (
                <div key={item._id} className="flex items-center justify-between gap-3">
                  <div className="flex items-center gap-2.5">
                    <img src={item.images} alt={item.productTitle}
                      className="w-10 h-10 rounded-lg object-cover bg-slate-100 shrink-0" />
                    <span className="text-[12px] text-slate-500 leading-snug line-clamp-1 max-w-[140px]">
                      {item.productTitle} <span className="text-slate-400">× {item.quantity}</span>
                    </span>
                  </div>
                  <span className="text-[13px] font-bold text-slate-700 shrink-0">
                    ৳{item.subTotal?.toLocaleString()}
                  </span>
                </div>
              ))}
            </div>

            {/* Shipping */}
            <div className="px-6 pb-4">
              <div className="bg-slate-50 rounded-2xl p-4">
                <p className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-3 flex items-center gap-1.5">
                  <Truck size={12} /> Shipping
                </p>
                <div className="space-y-2">
                  {[
                    { id: "flat",   label: "Flat rate",    price: "৳5.00" },
                    { id: "pickup", label: "Local pickup", price: "Free" },
                  ].map((opt) => (
                    <div key={opt.id} onClick={() => setShipping(opt.id)}
                      className={`flex items-center justify-between px-3.5 py-2.5 rounded-xl cursor-pointer transition-all duration-200 border
                        ${shipping === opt.id ? "bg-white border-indigo-300 shadow-sm" : "bg-transparent border-transparent hover:bg-white/70"}`}
                    >
                      <div className="flex items-center gap-2.5">
                        <div className={`w-4 h-4 rounded-full border-2 flex items-center justify-center transition-colors
                          ${shipping === opt.id ? "border-indigo-500" : "border-slate-300"}`}>
                          {shipping === opt.id && <div className="w-1.5 h-1.5 rounded-full bg-indigo-500" />}
                        </div>
                        <span className="text-[13px] font-medium text-slate-600">{opt.label}</span>
                      </div>
                      <span className={`text-[13px] font-bold ${shipping === opt.id ? "text-indigo-600" : "text-slate-400"}`}>
                        {opt.price}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Totals */}
            <div className="px-6 pb-5 space-y-2.5">
              <div className="flex justify-between text-sm text-slate-500">
                <span>Subtotal</span>
                <span className="font-medium text-slate-700">৳{subTotal?.toLocaleString()}</span>
              </div>
              <div className="flex justify-between text-sm text-slate-500">
                <span>Shipping</span>
                <span className="font-medium text-slate-700">{shippingCost === 0 ? "Free" : `৳${shippingCost}`}</span>
              </div>
              <div className="flex justify-between items-center pt-3 border-t border-slate-100">
                <span className="text-base font-bold text-slate-800">Total</span>
                <span className="text-xl font-black text-indigo-600">৳{totalPrice?.toLocaleString()}</span>
              </div>
            </div>
          </div>

          {/* Payment */}
          <div className="bg-white rounded-3xl border border-slate-100 shadow-sm overflow-hidden">
            <div className="px-6 py-5 border-b border-slate-100 flex items-center gap-3">
              <div className="w-8 h-8 rounded-xl bg-green-50 flex items-center justify-center">
                <CreditCard size={15} className="text-green-500" />
              </div>
              <div>
                <h2 className="text-base font-bold text-slate-800 leading-none">Payment</h2>
                <p className="text-xs text-slate-400 mt-0.5">Choose your payment method</p>
              </div>
            </div>

            <div className="px-6 py-4 space-y-3">
              {[
                { id: "cod",        label: "Cash on Delivery",     desc: "Pay with cash when your order arrives at your door." },
                { id: "bank",       label: "Direct Bank Transfer",  desc: "Make your payment directly into our bank account. Use your Order ID as reference." },
                { id: "sslcommerz", label: "bKash / Nagad / Card",  desc: "Pay securely via bKash, Nagad, Rocket, or any bank card through SSLCommerz." },
              ].map((opt) => (
                <div key={opt.id} onClick={() => setPayment(opt.id)}
                  className={`p-4 rounded-2xl border cursor-pointer transition-all duration-200
                    ${payment === opt.id ? "border-indigo-300 bg-indigo-50/50" : "border-slate-200 hover:border-slate-300 bg-white"}`}
                >
                  <div className="flex items-center gap-2.5 mb-1">
                    <div className={`w-4 h-4 rounded-full border-2 flex items-center justify-center transition-colors shrink-0
                      ${payment === opt.id ? "border-indigo-500" : "border-slate-300"}`}>
                      {payment === opt.id && <div className="w-1.5 h-1.5 rounded-full bg-indigo-500" />}
                    </div>
                    <span className={`text-sm font-semibold ${payment === opt.id ? "text-indigo-700" : "text-slate-700"}`}>
                      {opt.label}
                    </span>
                  </div>
                  <AnimatePresence>
                    {payment === opt.id && (
                      <motion.p
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: "auto" }}
                        exit={{ opacity: 0, height: 0 }}
                        transition={{ duration: 0.2 }}
                        className="text-xs text-indigo-500/80 leading-relaxed ml-6 overflow-hidden"
                      >
                        {opt.desc}
                      </motion.p>
                    )}
                  </AnimatePresence>
                </div>
              ))}
            </div>

            {/* Trust badge */}
            <div className="px-6 pb-4">
              <div className="flex items-center gap-2 bg-green-50 rounded-2xl px-4 py-2.5">
                <ShieldCheck size={14} className="text-green-500 shrink-0" />
                <p className="text-[11px] text-green-700 font-medium">Your order is secured with 256-bit SSL encryption</p>
              </div>
            </div>

            {/* Place Order */}
            <div className="px-6 pb-6">
              <motion.button
                whileHover={{ scale: placing ? 1 : 1.015 }}
                whileTap={{ scale: placing ? 1 : 0.975 }}
                onClick={handlePlaceOrder}
                disabled={placing}
                className="w-full py-4 rounded-2xl text-white text-sm font-bold tracking-wide flex items-center justify-center gap-2 shadow-lg shadow-indigo-200 transition-all disabled:opacity-70 disabled:cursor-not-allowed"
                style={{ background: "linear-gradient(135deg, #6366f1, #4f46e5)" }}
              >
                {placing
                  ? <><Loader2 size={16} className="animate-spin" /> Placing Order...</>
                  : <><CheckCircle2 size={16} /> Place Order — ৳{totalPrice?.toLocaleString()}</>
                }
              </motion.button>
              <p className="text-center text-[11px] text-slate-400 mt-3">
                By placing your order you agree to our{" "}
                <span className="underline cursor-pointer hover:text-slate-600 transition-colors">Terms & Conditions</span>
              </p>
            </div>
          </div>

        </motion.div>
      </div>
    </div>
  );
};

export default Checkout;





























// import React, { useState } from 'react';
// import { motion, AnimatePresence } from 'framer-motion';
// import { ChevronDown, MapPin, CreditCard, Truck, Package, CheckCircle2, ShieldCheck } from 'lucide-react';

// const Checkout = () => {
//   const [shipping, setShipping] = useState('flat');
//   const [payment, setPayment] = useState('bank');
//   const [focused, setFocused] = useState('');

//   const subtotal = 10.54;
//   const shippingCost = shipping === 'flat' ? 5.00 : 0;
//   const total = subtotal + shippingCost;

//   const cartItems = [
//     { name: "All Natural Italian-Style Chicken Meatballs", qty: 1, price: 7.25 },
//     { name: "Angie's Boomchickapop Sweet & Salty Kettle Corn", qty: 1, price: 3.29 },
//   ];

//   const inputClass = (name) =>
//     `w-full px-4 py-3 rounded-xl border text-sm font-medium text-slate-700 bg-white outline-none transition-all duration-200
//     ${focused === name
//       ? 'border-indigo-400 ring-2 ring-indigo-100 shadow-sm'
//       : 'border-slate-200 hover:border-slate-300'
//     }`;

//   const fadeUp = {
//     hidden: { opacity: 0, y: 16 },
//     visible: (i) => ({ opacity: 1, y: 0, transition: { delay: i * 0.05, duration: 0.4, ease: [0.22, 1, 0.36, 1] } })
//   };

//   return (
//     <div className="min-h-screen bg-[#f5f4f0] py-10 px-4 sm:px-6 lg:px-8">

//       {/* Top breadcrumb */}
//       <div className="max-w-6xl mx-auto mb-8 flex items-center gap-2 text-xs text-slate-400 font-medium">
//         <span className="hover:text-slate-600 cursor-pointer transition-colors">Cart</span>
//         <span className="text-slate-300">›</span>
//         <span className="text-slate-700 font-semibold">Checkout</span>
//         <span className="text-slate-300">›</span>
//         <span>Confirmation</span>
//       </div>

//       <div className="max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">

//         {/* ── LEFT: BILLING ── */}
//         <motion.div
//           initial={{ opacity: 0, y: 24 }}
//           animate={{ opacity: 1, y: 0 }}
//           transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
//           className="lg:col-span-7 bg-white rounded-3xl shadow-sm border border-slate-100 overflow-hidden"
//         >
//           {/* Header */}
//           <div className="px-8 py-6 border-b border-slate-100 flex items-center gap-3">
//             <div className="w-8 h-8 rounded-xl bg-indigo-50 flex items-center justify-center">
//               <MapPin size={15} className="text-indigo-500" />
//             </div>
//             <div>
//               <h2 className="text-base font-bold text-slate-800 leading-none">Billing Details</h2>
//               <p className="text-xs text-slate-400 mt-0.5">Where should we send your invoice?</p>
//             </div>
//           </div>

//           <div className="p-8 space-y-5">

//             {/* Name row */}
//             <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
//               {[['firstName', 'First name *', 'John'], ['lastName', 'Last name *', 'Doe']].map(([name, label, ph], i) => (
//                 <motion.div key={name} custom={i} variants={fadeUp} initial="hidden" animate="visible">
//                   <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1.5">{label}</label>
//                   <input
//                     type="text" placeholder={ph}
//                     onFocus={() => setFocused(name)} onBlur={() => setFocused('')}
//                     className={inputClass(name)}
//                   />
//                 </motion.div>
//               ))}
//             </div>

//             {/* Company */}
//             <motion.div custom={2} variants={fadeUp} initial="hidden" animate="visible">
//               <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1.5">Company name <span className="text-slate-300 normal-case font-normal">(optional)</span></label>
//               <input type="text" onFocus={() => setFocused('company')} onBlur={() => setFocused('')} className={inputClass('company')} />
//             </motion.div>

//             {/* Country */}
//             <motion.div custom={3} variants={fadeUp} initial="hidden" animate="visible" className="relative">
//               <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1.5">Country / Region *</label>
//               <div className="relative">
//                 <select
//                   onFocus={() => setFocused('country')} onBlur={() => setFocused('')}
//                   className={`${inputClass('country')} appearance-none pr-10 cursor-pointer`}
//                 >
//                   <option>Bangladesh</option>
//                   <option>USA</option>
//                   <option>Zambia</option>
//                   <option>India</option>
//                 </select>
//                 <ChevronDown size={14} className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
//               </div>
//             </motion.div>

//             {/* Street */}
//             <motion.div custom={4} variants={fadeUp} initial="hidden" animate="visible">
//               <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1.5">Street address *</label>
//               <div className="space-y-3">
//                 <input type="text" placeholder="House number and street name"
//                   onFocus={() => setFocused('street1')} onBlur={() => setFocused('')}
//                   className={inputClass('street1')} />
//                 <input type="text" placeholder="Apartment, suite, unit, etc. (optional)"
//                   onFocus={() => setFocused('street2')} onBlur={() => setFocused('')}
//                   className={inputClass('street2')} />
//               </div>
//             </motion.div>

//             {/* City / State / ZIP */}
//             <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
//               {[['city', 'Town / City *', ''], ['state', 'State / County *', ''], ['zip', 'Postcode / ZIP *', '']].map(([name, label], i) => (
//                 <motion.div key={name} custom={5 + i} variants={fadeUp} initial="hidden" animate="visible">
//                   <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1.5">{label}</label>
//                   <input type="text" onFocus={() => setFocused(name)} onBlur={() => setFocused('')} className={inputClass(name)} />
//                 </motion.div>
//               ))}
//             </div>

//             {/* Phone / Email */}
//             <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
//               {[['phone', 'Phone *', 'tel', '+880 ...'], ['email', 'Email address *', 'email', 'john@email.com']].map(([name, label, type, ph], i) => (
//                 <motion.div key={name} custom={8 + i} variants={fadeUp} initial="hidden" animate="visible">
//                   <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1.5">{label}</label>
//                   <input type={type} placeholder={ph}
//                     onFocus={() => setFocused(name)} onBlur={() => setFocused('')}
//                     className={inputClass(name)} />
//                 </motion.div>
//               ))}
//             </div>

//             {/* Order notes */}
//             <motion.div custom={10} variants={fadeUp} initial="hidden" animate="visible">
//               <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1.5">Order notes <span className="text-slate-300 normal-case font-normal">(optional)</span></label>
//               <textarea rows={3} placeholder="Notes about your order, e.g. special delivery instructions..."
//                 onFocus={() => setFocused('notes')} onBlur={() => setFocused('')}
//                 className={`${inputClass('notes')} resize-none`} />
//             </motion.div>

//           </div>
//         </motion.div>

//         {/* ── RIGHT: ORDER SUMMARY ── */}
//         <motion.div
//           initial={{ opacity: 0, y: 24 }}
//           animate={{ opacity: 1, y: 0 }}
//           transition={{ duration: 0.5, delay: 0.1, ease: [0.22, 1, 0.36, 1] }}
//           className="lg:col-span-5 space-y-4 sticky top-6"
//         >

//           {/* Order Summary Card */}
//           <div className="bg-white rounded-3xl border border-slate-100 shadow-sm overflow-hidden">
//             <div className="px-6 py-5 border-b border-slate-100 flex items-center gap-3">
//               <div className="w-8 h-8 rounded-xl bg-amber-50 flex items-center justify-center">
//                 <Package size={15} className="text-amber-500" />
//               </div>
//               <div>
//                 <h2 className="text-base font-bold text-slate-800 leading-none">Your Order</h2>
//                 <p className="text-xs text-slate-400 mt-0.5">{cartItems.length} items</p>
//               </div>
//             </div>

//             {/* Items */}
//             <div className="px-6 py-4 space-y-3">
//               {cartItems.map((item, i) => (
//                 <div key={i} className="flex items-start justify-between gap-3">
//                   <div className="flex items-start gap-2.5">
//                     <div className="w-1.5 h-1.5 rounded-full bg-indigo-300 mt-1.5 shrink-0" />
//                     <span className="text-[13px] text-slate-500 leading-snug">
//                       {item.name} <span className="text-slate-400">× {item.qty}</span>
//                     </span>
//                   </div>
//                   <span className="text-[13px] font-bold text-slate-700 shrink-0">${item.price.toFixed(2)}</span>
//                 </div>
//               ))}
//             </div>

//             {/* Shipping */}
//             <div className="px-6 pb-4">
//               <div className="bg-slate-50 rounded-2xl p-4">
//                 <p className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-3 flex items-center gap-1.5">
//                   <Truck size={12} /> Shipping
//                 </p>
//                 <div className="space-y-2">
//                   {[
//                     { id: 'flat', label: 'Flat rate', price: '$5.00' },
//                     { id: 'pickup', label: 'Local pickup', price: 'Free' },
//                   ].map((opt) => (
//                     <label
//                       key={opt.id}
//                       onClick={() => setShipping(opt.id)}
//                       className={`flex items-center justify-between px-3.5 py-2.5 rounded-xl cursor-pointer transition-all duration-200 border
//                         ${shipping === opt.id
//                           ? 'bg-white border-indigo-300 shadow-sm'
//                           : 'bg-transparent border-transparent hover:bg-white/70'
//                         }`}
//                     >
//                       <div className="flex items-center gap-2.5">
//                         <div className={`w-4 h-4 rounded-full border-2 flex items-center justify-center transition-colors
//                           ${shipping === opt.id ? 'border-indigo-500' : 'border-slate-300'}`}>
//                           {shipping === opt.id && <div className="w-1.5 h-1.5 rounded-full bg-indigo-500" />}
//                         </div>
//                         <span className="text-[13px] font-medium text-slate-600">{opt.label}</span>
//                       </div>
//                       <span className={`text-[13px] font-bold ${shipping === opt.id ? 'text-indigo-600' : 'text-slate-400'}`}>
//                         {opt.price}
//                       </span>
//                     </label>
//                   ))}
//                 </div>
//               </div>
//             </div>

//             {/* Totals */}
//             <div className="px-6 pb-5 space-y-2.5">
//               <div className="flex justify-between text-sm text-slate-500">
//                 <span>Subtotal</span>
//                 <span className="font-medium text-slate-700">${subtotal.toFixed(2)}</span>
//               </div>
//               <div className="flex justify-between text-sm text-slate-500">
//                 <span>Shipping</span>
//                 <span className="font-medium text-slate-700">{shippingCost === 0 ? 'Free' : `$${shippingCost.toFixed(2)}`}</span>
//               </div>
//               <div className="flex justify-between items-center pt-3 border-t border-slate-100">
//                 <span className="text-base font-bold text-slate-800">Total</span>
//                 <span className="text-xl font-black text-indigo-600">${total.toFixed(2)}</span>
//               </div>
//             </div>
//           </div>

//           {/* Payment Card */}
//           <div className="bg-white rounded-3xl border border-slate-100 shadow-sm overflow-hidden">
//             <div className="px-6 py-5 border-b border-slate-100 flex items-center gap-3">
//               <div className="w-8 h-8 rounded-xl bg-green-50 flex items-center justify-center">
//                 <CreditCard size={15} className="text-green-500" />
//               </div>
//               <div>
//                 <h2 className="text-base font-bold text-slate-800 leading-none">Payment</h2>
//                 <p className="text-xs text-slate-400 mt-0.5">Choose your payment method</p>
//               </div>
//             </div>

//             <div className="px-6 py-4 space-y-3">
//               {[
//                 {
//                   id: 'bank',
//                   label: 'Direct Bank Transfer',
//                   desc: 'Make your payment directly into our bank account. Use your Order ID as reference.',
//                 },
//                 {
//                   id: 'cod',
//                   label: 'Cash on Delivery',
//                   desc: 'Pay with cash upon delivery.',
//                 },
//               ].map((opt) => (
//                 <div
//                   key={opt.id}
//                   onClick={() => setPayment(opt.id)}
//                   className={`p-4 rounded-2xl border cursor-pointer transition-all duration-200
//                     ${payment === opt.id
//                       ? 'border-indigo-300 bg-indigo-50/50'
//                       : 'border-slate-200 hover:border-slate-300 bg-white'
//                     }`}
//                 >
//                   <div className="flex items-center gap-2.5 mb-1">
//                     <div className={`w-4 h-4 rounded-full border-2 flex items-center justify-center transition-colors shrink-0
//                       ${payment === opt.id ? 'border-indigo-500' : 'border-slate-300'}`}>
//                       {payment === opt.id && <div className="w-1.5 h-1.5 rounded-full bg-indigo-500" />}
//                     </div>
//                     <span className={`text-sm font-semibold ${payment === opt.id ? 'text-indigo-700' : 'text-slate-700'}`}>
//                       {opt.label}
//                     </span>
//                   </div>
//                   <AnimatePresence>
//                     {payment === opt.id && (
//                       <motion.p
//                         initial={{ opacity: 0, height: 0 }}
//                         animate={{ opacity: 1, height: 'auto' }}
//                         exit={{ opacity: 0, height: 0 }}
//                         transition={{ duration: 0.2 }}
//                         className="text-xs text-indigo-500/80 leading-relaxed ml-6.5 overflow-hidden"
//                       >
//                         {opt.desc}
//                       </motion.p>
//                     )}
//                   </AnimatePresence>
//                 </div>
//               ))}
//             </div>

//             {/* Trust badges */}
//             <div className="px-6 pb-4">
//               <div className="flex items-center gap-2 bg-green-50 rounded-2xl px-4 py-2.5">
//                 <ShieldCheck size={14} className="text-green-500 shrink-0" />
//                 <p className="text-[11px] text-green-700 font-medium">Your order is secured with 256-bit SSL encryption</p>
//               </div>
//             </div>

//             {/* Place Order Button */}
//             <div className="px-6 pb-6">
//               <motion.button
//                 whileHover={{ scale: 1.015 }}
//                 whileTap={{ scale: 0.975 }}
//                 className="w-full py-4 rounded-2xl text-white text-sm font-bold tracking-wide flex items-center justify-center gap-2 shadow-lg shadow-indigo-200 transition-all"
//                 style={{ background: 'linear-gradient(135deg, #6366f1, #4f46e5)' }}
//               >
//                 <CheckCircle2 size={16} />
//                 Place Order — ${total.toFixed(2)}
//               </motion.button>
//               <p className="text-center text-[11px] text-slate-400 mt-3">
//                 By placing your order you agree to our <span className="underline cursor-pointer">Terms & Conditions</span>
//               </p>
//             </div>
//           </div>

//         </motion.div>
//       </div>
//     </div>
//   );
// };

// export default Checkout;



