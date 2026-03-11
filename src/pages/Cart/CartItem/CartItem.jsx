import React from "react";
import { X, Minus, Plus } from "lucide-react";
import { Link } from "react-router-dom";

const CartItem = ({ item, onUpdateQuantity, onRemove }) => {
  return (
    <tr className="text-sm border-b border-gray-100 last:border-0">
      {/* Product */}
      <td className="py-6">
        <Link to={`/product/${item.productId}`} className="flex items-center gap-4">
          <img
            src={item.images}
            alt={item.productTitle}
            className="w-16 h-20 object-cover rounded shadow-sm bg-gray-100"
          />
          <div>
            <p className="font-semibold text-gray-800 mb-1 max-w-[200px] line-clamp-2">
              {item.productTitle}
            </p>
            <div className="flex text-yellow-400">
              {"★".repeat(Math.round(item.rating))}
              {"☆".repeat(5 - Math.round(item.rating))}
            </div>
          </div>
        </Link>
      </td>

      {/* Unit Price */}
      <td className="py-6 text-gray-600">Rs {item.price?.toLocaleString()}</td>

      {/* Quantity */}
      <td className="py-6">
        <div className="flex items-center justify-center gap-3">
          <button
            onClick={() => onUpdateQuantity(item._id, item.quantity - 1, item.price)}
            className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center hover:bg-gray-200 transition-colors disabled:opacity-40"
            disabled={item.quantity <= 1}
          >
            <Minus size={14} />
          </button>
          <span className="w-4 text-center font-medium">{item.quantity}</span>
          <button
            onClick={() => onUpdateQuantity(item._id, item.quantity + 1, item.price)}
            className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center hover:bg-gray-200 transition-colors"
          >
            <Plus size={14} />
          </button>
        </div>
      </td>

      {/* Subtotal */}
      <td className="py-6 font-medium text-gray-700">
        Rs. {item.subTotal?.toLocaleString()}
      </td>

      {/* Remove */}
      <td className="py-6 text-center">
        <button
          onClick={() => onRemove(item._id)}
          className="text-gray-400 hover:text-red-500 transition-colors"
        >
          <X size={20} />
        </button>
      </td>
    </tr>
  );
};

export default CartItem;