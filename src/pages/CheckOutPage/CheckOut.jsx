import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronDown, MapPin, CreditCard, Truck, Package, CheckCircle2, ShieldCheck } from 'lucide-react';

const Checkout = () => {
  const [shipping, setShipping] = useState('flat');
  const [payment, setPayment] = useState('bank');
  const [focused, setFocused] = useState('');

  const subtotal = 10.54;
  const shippingCost = shipping === 'flat' ? 5.00 : 0;
  const total = subtotal + shippingCost;

  const cartItems = [
    { name: "All Natural Italian-Style Chicken Meatballs", qty: 1, price: 7.25 },
    { name: "Angie's Boomchickapop Sweet & Salty Kettle Corn", qty: 1, price: 3.29 },
  ];

  const inputClass = (name) =>
    `w-full px-4 py-3 rounded-xl border text-sm font-medium text-slate-700 bg-white outline-none transition-all duration-200
    ${focused === name
      ? 'border-indigo-400 ring-2 ring-indigo-100 shadow-sm'
      : 'border-slate-200 hover:border-slate-300'
    }`;

  const fadeUp = {
    hidden: { opacity: 0, y: 16 },
    visible: (i) => ({ opacity: 1, y: 0, transition: { delay: i * 0.05, duration: 0.4, ease: [0.22, 1, 0.36, 1] } })
  };

  return (
    <div className="min-h-screen bg-[#f5f4f0] py-10 px-4 sm:px-6 lg:px-8">

      {/* Top breadcrumb */}
      <div className="max-w-6xl mx-auto mb-8 flex items-center gap-2 text-xs text-slate-400 font-medium">
        <span className="hover:text-slate-600 cursor-pointer transition-colors">Cart</span>
        <span className="text-slate-300">›</span>
        <span className="text-slate-700 font-semibold">Checkout</span>
        <span className="text-slate-300">›</span>
        <span>Confirmation</span>
      </div>

      <div className="max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">

        {/* ── LEFT: BILLING ── */}
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
          className="lg:col-span-7 bg-white rounded-3xl shadow-sm border border-slate-100 overflow-hidden"
        >
          {/* Header */}
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

            {/* Name row */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {[['firstName', 'First name *', 'John'], ['lastName', 'Last name *', 'Doe']].map(([name, label, ph], i) => (
                <motion.div key={name} custom={i} variants={fadeUp} initial="hidden" animate="visible">
                  <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1.5">{label}</label>
                  <input
                    type="text" placeholder={ph}
                    onFocus={() => setFocused(name)} onBlur={() => setFocused('')}
                    className={inputClass(name)}
                  />
                </motion.div>
              ))}
            </div>

            {/* Company */}
            <motion.div custom={2} variants={fadeUp} initial="hidden" animate="visible">
              <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1.5">Company name <span className="text-slate-300 normal-case font-normal">(optional)</span></label>
              <input type="text" onFocus={() => setFocused('company')} onBlur={() => setFocused('')} className={inputClass('company')} />
            </motion.div>

            {/* Country */}
            <motion.div custom={3} variants={fadeUp} initial="hidden" animate="visible" className="relative">
              <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1.5">Country / Region *</label>
              <div className="relative">
                <select
                  onFocus={() => setFocused('country')} onBlur={() => setFocused('')}
                  className={`${inputClass('country')} appearance-none pr-10 cursor-pointer`}
                >
                  <option>Bangladesh</option>
                  <option>USA</option>
                  <option>Zambia</option>
                  <option>India</option>
                </select>
                <ChevronDown size={14} className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
              </div>
            </motion.div>

            {/* Street */}
            <motion.div custom={4} variants={fadeUp} initial="hidden" animate="visible">
              <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1.5">Street address *</label>
              <div className="space-y-3">
                <input type="text" placeholder="House number and street name"
                  onFocus={() => setFocused('street1')} onBlur={() => setFocused('')}
                  className={inputClass('street1')} />
                <input type="text" placeholder="Apartment, suite, unit, etc. (optional)"
                  onFocus={() => setFocused('street2')} onBlur={() => setFocused('')}
                  className={inputClass('street2')} />
              </div>
            </motion.div>

            {/* City / State / ZIP */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              {[['city', 'Town / City *', ''], ['state', 'State / County *', ''], ['zip', 'Postcode / ZIP *', '']].map(([name, label], i) => (
                <motion.div key={name} custom={5 + i} variants={fadeUp} initial="hidden" animate="visible">
                  <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1.5">{label}</label>
                  <input type="text" onFocus={() => setFocused(name)} onBlur={() => setFocused('')} className={inputClass(name)} />
                </motion.div>
              ))}
            </div>

            {/* Phone / Email */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {[['phone', 'Phone *', 'tel', '+880 ...'], ['email', 'Email address *', 'email', 'john@email.com']].map(([name, label, type, ph], i) => (
                <motion.div key={name} custom={8 + i} variants={fadeUp} initial="hidden" animate="visible">
                  <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1.5">{label}</label>
                  <input type={type} placeholder={ph}
                    onFocus={() => setFocused(name)} onBlur={() => setFocused('')}
                    className={inputClass(name)} />
                </motion.div>
              ))}
            </div>

            {/* Order notes */}
            <motion.div custom={10} variants={fadeUp} initial="hidden" animate="visible">
              <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1.5">Order notes <span className="text-slate-300 normal-case font-normal">(optional)</span></label>
              <textarea rows={3} placeholder="Notes about your order, e.g. special delivery instructions..."
                onFocus={() => setFocused('notes')} onBlur={() => setFocused('')}
                className={`${inputClass('notes')} resize-none`} />
            </motion.div>

          </div>
        </motion.div>

        {/* ── RIGHT: ORDER SUMMARY ── */}
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1, ease: [0.22, 1, 0.36, 1] }}
          className="lg:col-span-5 space-y-4 sticky top-6"
        >

          {/* Order Summary Card */}
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

            {/* Items */}
            <div className="px-6 py-4 space-y-3">
              {cartItems.map((item, i) => (
                <div key={i} className="flex items-start justify-between gap-3">
                  <div className="flex items-start gap-2.5">
                    <div className="w-1.5 h-1.5 rounded-full bg-indigo-300 mt-1.5 shrink-0" />
                    <span className="text-[13px] text-slate-500 leading-snug">
                      {item.name} <span className="text-slate-400">× {item.qty}</span>
                    </span>
                  </div>
                  <span className="text-[13px] font-bold text-slate-700 shrink-0">${item.price.toFixed(2)}</span>
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
                    { id: 'flat', label: 'Flat rate', price: '$5.00' },
                    { id: 'pickup', label: 'Local pickup', price: 'Free' },
                  ].map((opt) => (
                    <label
                      key={opt.id}
                      onClick={() => setShipping(opt.id)}
                      className={`flex items-center justify-between px-3.5 py-2.5 rounded-xl cursor-pointer transition-all duration-200 border
                        ${shipping === opt.id
                          ? 'bg-white border-indigo-300 shadow-sm'
                          : 'bg-transparent border-transparent hover:bg-white/70'
                        }`}
                    >
                      <div className="flex items-center gap-2.5">
                        <div className={`w-4 h-4 rounded-full border-2 flex items-center justify-center transition-colors
                          ${shipping === opt.id ? 'border-indigo-500' : 'border-slate-300'}`}>
                          {shipping === opt.id && <div className="w-1.5 h-1.5 rounded-full bg-indigo-500" />}
                        </div>
                        <span className="text-[13px] font-medium text-slate-600">{opt.label}</span>
                      </div>
                      <span className={`text-[13px] font-bold ${shipping === opt.id ? 'text-indigo-600' : 'text-slate-400'}`}>
                        {opt.price}
                      </span>
                    </label>
                  ))}
                </div>
              </div>
            </div>

            {/* Totals */}
            <div className="px-6 pb-5 space-y-2.5">
              <div className="flex justify-between text-sm text-slate-500">
                <span>Subtotal</span>
                <span className="font-medium text-slate-700">${subtotal.toFixed(2)}</span>
              </div>
              <div className="flex justify-between text-sm text-slate-500">
                <span>Shipping</span>
                <span className="font-medium text-slate-700">{shippingCost === 0 ? 'Free' : `$${shippingCost.toFixed(2)}`}</span>
              </div>
              <div className="flex justify-between items-center pt-3 border-t border-slate-100">
                <span className="text-base font-bold text-slate-800">Total</span>
                <span className="text-xl font-black text-indigo-600">${total.toFixed(2)}</span>
              </div>
            </div>
          </div>

          {/* Payment Card */}
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
                {
                  id: 'bank',
                  label: 'Direct Bank Transfer',
                  desc: 'Make your payment directly into our bank account. Use your Order ID as reference.',
                },
                {
                  id: 'cod',
                  label: 'Cash on Delivery',
                  desc: 'Pay with cash upon delivery.',
                },
              ].map((opt) => (
                <div
                  key={opt.id}
                  onClick={() => setPayment(opt.id)}
                  className={`p-4 rounded-2xl border cursor-pointer transition-all duration-200
                    ${payment === opt.id
                      ? 'border-indigo-300 bg-indigo-50/50'
                      : 'border-slate-200 hover:border-slate-300 bg-white'
                    }`}
                >
                  <div className="flex items-center gap-2.5 mb-1">
                    <div className={`w-4 h-4 rounded-full border-2 flex items-center justify-center transition-colors shrink-0
                      ${payment === opt.id ? 'border-indigo-500' : 'border-slate-300'}`}>
                      {payment === opt.id && <div className="w-1.5 h-1.5 rounded-full bg-indigo-500" />}
                    </div>
                    <span className={`text-sm font-semibold ${payment === opt.id ? 'text-indigo-700' : 'text-slate-700'}`}>
                      {opt.label}
                    </span>
                  </div>
                  <AnimatePresence>
                    {payment === opt.id && (
                      <motion.p
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: 'auto' }}
                        exit={{ opacity: 0, height: 0 }}
                        transition={{ duration: 0.2 }}
                        className="text-xs text-indigo-500/80 leading-relaxed ml-6.5 overflow-hidden"
                      >
                        {opt.desc}
                      </motion.p>
                    )}
                  </AnimatePresence>
                </div>
              ))}
            </div>

            {/* Trust badges */}
            <div className="px-6 pb-4">
              <div className="flex items-center gap-2 bg-green-50 rounded-2xl px-4 py-2.5">
                <ShieldCheck size={14} className="text-green-500 shrink-0" />
                <p className="text-[11px] text-green-700 font-medium">Your order is secured with 256-bit SSL encryption</p>
              </div>
            </div>

            {/* Place Order Button */}
            <div className="px-6 pb-6">
              <motion.button
                whileHover={{ scale: 1.015 }}
                whileTap={{ scale: 0.975 }}
                className="w-full py-4 rounded-2xl text-white text-sm font-bold tracking-wide flex items-center justify-center gap-2 shadow-lg shadow-indigo-200 transition-all"
                style={{ background: 'linear-gradient(135deg, #6366f1, #4f46e5)' }}
              >
                <CheckCircle2 size={16} />
                Place Order — ${total.toFixed(2)}
              </motion.button>
              <p className="text-center text-[11px] text-slate-400 mt-3">
                By placing your order you agree to our <span className="underline cursor-pointer">Terms & Conditions</span>
              </p>
            </div>
          </div>

        </motion.div>
      </div>
    </div>
  );
};

export default Checkout;












// import React from 'react';
// import { motion } from 'framer-motion';

// const Checkout = () => {
//   const containerVariants = {
//     hidden: { opacity: 0, y: 20 },
//     visible: { opacity: 1, y: 0, transition: { duration: 0.6, staggerChildren: 0.1 } }
//   };

//   const itemVariants = {
//     hidden: { opacity: 0, x: -10 },
//     visible: { opacity: 1, x: 0 }
//   };

//   return (
//     <div className="min-h-screen bg-slate-50 py-12 px-4 sm:px-6 lg:px-8 font-sans">
//       <motion.div 
//         initial="hidden"
//         animate="visible"
//         variants={containerVariants}
//         className="max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-8"
//       >
//         {/* Left Side: Billing Details */}
//         <div className="lg:col-span-7 bg-white p-8 rounded-3xl shadow-sm border border-slate-100">
//           <h2 className="text-2xl font-bold text-slate-800 mb-8 border-b pb-4">Billing Details</h2>
          
//           <form className="space-y-6">
//             <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
//               <motion.div variants={itemVariants}>
//                 <label className="block text-sm font-medium text-slate-600 mb-2">First name *</label>
//                 <input type="text" className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all outline-none" placeholder="First Name" />
//               </motion.div>
//               <motion.div variants={itemVariants}>
//                 <label className="block text-sm font-medium text-slate-600 mb-2">Last name *</label>
//                 <input type="text" className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all outline-none" placeholder="Last Name" />
//               </motion.div>
//             </div>

//             <motion.div variants={itemVariants}>
//               <label className="block text-sm font-medium text-slate-600 mb-2">Company name (optional)</label>
//               <input type="text" className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none" />
//             </motion.div>

//             <motion.div variants={itemVariants}>
//               <label className="block text-sm font-medium text-slate-600 mb-2">Country / Region *</label>
//               <select className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none appearance-none cursor-pointer">
//                 <option>Zambia</option>
//                 <option>Bangladesh</option>
//                 <option>USA</option>
//               </select>
//             </motion.div>

//             <motion.div variants={itemVariants}>
//               <label className="block text-sm font-medium text-slate-600 mb-2">Street address *</label>
//               <input type="text" className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl mb-4 focus:ring-2 focus:ring-blue-500 outline-none" placeholder="House number and street name" />
//               <input type="text" className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none" placeholder="Apartment, suite, unit, etc. (optional)" />
//             </motion.div>

//             <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
//               <motion.div variants={itemVariants}>
//                 <label className="block text-sm font-medium text-slate-600 mb-2">Town / City *</label>
//                 <input type="text" className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none" />
//               </motion.div>
//               <motion.div variants={itemVariants}>
//                 <label className="block text-sm font-medium text-slate-600 mb-2">State / County *</label>
//                 <input type="text" className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none" />
//               </motion.div>
//               <motion.div variants={itemVariants}>
//                 <label className="block text-sm font-medium text-slate-600 mb-2">Postcode / ZIP *</label>
//                 <input type="text" className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none" />
//               </motion.div>
//             </div>

//             <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
//               <motion.div variants={itemVariants}>
//                 <label className="block text-sm font-medium text-slate-600 mb-2">Phone *</label>
//                 <input type="tel" className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none" />
//               </motion.div>
//               <motion.div variants={itemVariants}>
//                 <label className="block text-sm font-medium text-slate-600 mb-2">Email address *</label>
//                 <input type="email" className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none" />
//               </motion.div>
//             </div>
//           </form>
//         </div>

//         {/* Right Side: Order Summary */}
//         <div className="lg:col-span-5">
//           <div className="bg-slate-900 text-white p-8 rounded-3xl shadow-xl sticky top-8">
//             <h2 className="text-xl font-bold mb-6 border-b border-slate-700 pb-4">Your Order</h2>
            
//             <div className="space-y-4 mb-6">
//               <div className="flex justify-between items-start gap-4">
//                 <span className="text-slate-400 text-sm">All Natural Italian-Style Chicken Meatballs × 1</span>
//                 <span className="font-semibold">$7.25</span>
//               </div>
//               <div className="flex justify-between items-start gap-4">
//                 <span className="text-slate-400 text-sm">Angie's Boomchickapop Sweet & Salty Kettle Corn × 1</span>
//                 <span className="font-semibold">$3.29</span>
//               </div>
//             </div>

//             <div className="border-t border-slate-700 pt-4 space-y-3">
//               <div className="flex justify-between text-slate-300">
//                 <span>Subtotal</span>
//                 <span>$10.54</span>
//               </div>
              
//               <div className="py-2">
//                 <p className="text-sm font-medium mb-3 text-slate-300">Shipping</p>
//                 <div className="space-y-2">
//                   <label className="flex items-center justify-between p-3 rounded-xl bg-slate-800 border border-slate-700 cursor-pointer">
//                     <div className="flex items-center">
//                       <input type="radio" name="shipping" className="w-4 h-4 text-blue-600" defaultChecked />
//                       <span className="ml-3 text-sm text-slate-200">Flat rate</span>
//                     </div>
//                     <span className="text-sm font-bold">$5.00</span>
//                   </label>
//                   <label className="flex items-center p-3 rounded-xl bg-slate-800 border border-slate-700 cursor-pointer">
//                     <input type="radio" name="shipping" className="w-4 h-4 text-blue-600" />
//                     <span className="ml-3 text-sm text-slate-200">Local pickup</span>
//                   </label>
//                 </div>
//               </div>

//               <div className="flex justify-between text-xl font-bold pt-4 border-t border-slate-700">
//                 <span>Total</span>
//                 <span className="text-blue-400">$15.54</span>
//               </div>
//             </div>

//             {/* Payment Methods */}
//             <div className="mt-8 space-y-4">
//               <div className="p-4 rounded-2xl bg-slate-800 border border-blue-500/30">
//                 <label className="flex items-center font-medium mb-2">
//                   <input type="radio" name="payment" defaultChecked className="w-4 h-4" />
//                   <span className="ml-3">Direct bank transfer</span>
//                 </label>
//                 <p className="text-xs text-slate-400 leading-relaxed ml-7">
//                   Make your payment directly into our bank account. Please use your Order ID as the payment reference.
//                 </p>
//               </div>
//               <label className="flex items-center p-4 rounded-2xl bg-slate-800 border border-slate-700">
//                 <input type="radio" name="payment" className="w-4 h-4" />
//                 <span className="ml-3 font-medium">Cash on delivery</span>
//               </label>
//             </div>

//             <motion.button 
//               whileHover={{ scale: 1.02 }}
//               whileTap={{ scale: 0.98 }}
//               className="w-full mt-8 bg-blue-600 hover:bg-blue-700 text-white font-bold py-4 rounded-2xl shadow-lg shadow-blue-500/20 transition-all"
//             >
//               Place Order
//             </motion.button>
//           </div>
//         </div>
//       </motion.div>
//     </div>
//   );
// };

// export default Checkout;