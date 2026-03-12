import React from "react";
import { ShoppingBag } from "lucide-react";
import { Link } from "react-router-dom";

const CartSummary = ({ subtotal }) => {
  return (
    <div className="lg:w-1/3">
      <div className="border border-gray-100 rounded-lg p-6 shadow-sm sticky top-60">
        <h2 className="text-lg font-bold text-gray-800 border-b pb-4 mb-4">
          CART TOTALS
        </h2>
        <div className="space-y-4 text-sm">
          <div className="flex justify-between items-center">
            <span className="text-gray-500">Subtotal</span>
            <span className="font-bold text-pink-600 text-lg">
              ₹{subtotal.toLocaleString("en-IN")}.00
            </span>
          </div>
          <div className="flex justify-between items-center border-t pt-4">
            <span className="text-gray-500">Shipping</span>
            <span className="text-gray-800">Free</span>
          </div>
          <div className="flex justify-between items-center border-t pt-4">
            <span className="text-gray-500">Estimate for</span>
            <span className="font-semibold text-gray-800">United Kingdom</span>
          </div>
          <div className="flex justify-between items-center border-t pt-4 pb-6">
            <span className="text-gray-500 font-bold">Total</span>
            <span className="font-bold text-pink-600 text-xl">
              ₹{subtotal.toLocaleString("en-IN")}.00
            </span>
          </div>
        </div>
        <Link to={"/checkout"}>
          <button className="w-full cursor-pointer bg-[#E91E63] hover:bg-[#D81B60] text-white py-4 rounded-md flex items-center justify-center gap-2 font-bold transition-all uppercase text-sm tracking-widest shadow-md">
            <ShoppingBag size={18} />
            Checkout
          </button>
        </Link>
      </div>
    </div>
  );
};

export default CartSummary;
