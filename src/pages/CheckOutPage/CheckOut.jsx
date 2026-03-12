import React from 'react';
import { motion } from 'framer-motion';

const Checkout = () => {
  const containerVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.6, staggerChildren: 0.1 } }
  };

  const itemVariants = {
    hidden: { opacity: 0, x: -10 },
    visible: { opacity: 1, x: 0 }
  };

  return (
    <div className="min-h-screen bg-slate-50 py-12 px-4 sm:px-6 lg:px-8 font-sans">
      <motion.div 
        initial="hidden"
        animate="visible"
        variants={containerVariants}
        className="max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-8"
      >
        {/* Left Side: Billing Details */}
        <div className="lg:col-span-7 bg-white p-8 rounded-3xl shadow-sm border border-slate-100">
          <h2 className="text-2xl font-bold text-slate-800 mb-8 border-b pb-4">Billing Details</h2>
          
          <form className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <motion.div variants={itemVariants}>
                <label className="block text-sm font-medium text-slate-600 mb-2">First name *</label>
                <input type="text" className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all outline-none" placeholder="First Name" />
              </motion.div>
              <motion.div variants={itemVariants}>
                <label className="block text-sm font-medium text-slate-600 mb-2">Last name *</label>
                <input type="text" className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all outline-none" placeholder="Last Name" />
              </motion.div>
            </div>

            <motion.div variants={itemVariants}>
              <label className="block text-sm font-medium text-slate-600 mb-2">Company name (optional)</label>
              <input type="text" className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none" />
            </motion.div>

            <motion.div variants={itemVariants}>
              <label className="block text-sm font-medium text-slate-600 mb-2">Country / Region *</label>
              <select className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none appearance-none cursor-pointer">
                <option>Zambia</option>
                <option>Bangladesh</option>
                <option>USA</option>
              </select>
            </motion.div>

            <motion.div variants={itemVariants}>
              <label className="block text-sm font-medium text-slate-600 mb-2">Street address *</label>
              <input type="text" className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl mb-4 focus:ring-2 focus:ring-blue-500 outline-none" placeholder="House number and street name" />
              <input type="text" className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none" placeholder="Apartment, suite, unit, etc. (optional)" />
            </motion.div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <motion.div variants={itemVariants}>
                <label className="block text-sm font-medium text-slate-600 mb-2">Town / City *</label>
                <input type="text" className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none" />
              </motion.div>
              <motion.div variants={itemVariants}>
                <label className="block text-sm font-medium text-slate-600 mb-2">State / County *</label>
                <input type="text" className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none" />
              </motion.div>
              <motion.div variants={itemVariants}>
                <label className="block text-sm font-medium text-slate-600 mb-2">Postcode / ZIP *</label>
                <input type="text" className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none" />
              </motion.div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <motion.div variants={itemVariants}>
                <label className="block text-sm font-medium text-slate-600 mb-2">Phone *</label>
                <input type="tel" className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none" />
              </motion.div>
              <motion.div variants={itemVariants}>
                <label className="block text-sm font-medium text-slate-600 mb-2">Email address *</label>
                <input type="email" className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none" />
              </motion.div>
            </div>
          </form>
        </div>

        {/* Right Side: Order Summary */}
        <div className="lg:col-span-5">
          <div className="bg-slate-900 text-white p-8 rounded-3xl shadow-xl sticky top-8">
            <h2 className="text-xl font-bold mb-6 border-b border-slate-700 pb-4">Your Order</h2>
            
            <div className="space-y-4 mb-6">
              <div className="flex justify-between items-start gap-4">
                <span className="text-slate-400 text-sm">All Natural Italian-Style Chicken Meatballs × 1</span>
                <span className="font-semibold">$7.25</span>
              </div>
              <div className="flex justify-between items-start gap-4">
                <span className="text-slate-400 text-sm">Angie's Boomchickapop Sweet & Salty Kettle Corn × 1</span>
                <span className="font-semibold">$3.29</span>
              </div>
            </div>

            <div className="border-t border-slate-700 pt-4 space-y-3">
              <div className="flex justify-between text-slate-300">
                <span>Subtotal</span>
                <span>$10.54</span>
              </div>
              
              <div className="py-2">
                <p className="text-sm font-medium mb-3 text-slate-300">Shipping</p>
                <div className="space-y-2">
                  <label className="flex items-center justify-between p-3 rounded-xl bg-slate-800 border border-slate-700 cursor-pointer">
                    <div className="flex items-center">
                      <input type="radio" name="shipping" className="w-4 h-4 text-blue-600" defaultChecked />
                      <span className="ml-3 text-sm text-slate-200">Flat rate</span>
                    </div>
                    <span className="text-sm font-bold">$5.00</span>
                  </label>
                  <label className="flex items-center p-3 rounded-xl bg-slate-800 border border-slate-700 cursor-pointer">
                    <input type="radio" name="shipping" className="w-4 h-4 text-blue-600" />
                    <span className="ml-3 text-sm text-slate-200">Local pickup</span>
                  </label>
                </div>
              </div>

              <div className="flex justify-between text-xl font-bold pt-4 border-t border-slate-700">
                <span>Total</span>
                <span className="text-blue-400">$15.54</span>
              </div>
            </div>

            {/* Payment Methods */}
            <div className="mt-8 space-y-4">
              <div className="p-4 rounded-2xl bg-slate-800 border border-blue-500/30">
                <label className="flex items-center font-medium mb-2">
                  <input type="radio" name="payment" defaultChecked className="w-4 h-4" />
                  <span className="ml-3">Direct bank transfer</span>
                </label>
                <p className="text-xs text-slate-400 leading-relaxed ml-7">
                  Make your payment directly into our bank account. Please use your Order ID as the payment reference.
                </p>
              </div>
              <label className="flex items-center p-4 rounded-2xl bg-slate-800 border border-slate-700">
                <input type="radio" name="payment" className="w-4 h-4" />
                <span className="ml-3 font-medium">Cash on delivery</span>
              </label>
            </div>

            <motion.button 
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className="w-full mt-8 bg-blue-600 hover:bg-blue-700 text-white font-bold py-4 rounded-2xl shadow-lg shadow-blue-500/20 transition-all"
            >
              Place Order
            </motion.button>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default Checkout;