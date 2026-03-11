import React, { useState } from "react";
import { X, Minus, Plus, Loader2 } from "lucide-react";
import { Link } from "react-router-dom";

const CartItem = ({ item, onUpdateQuantity, onRemove }) => {
  const [updating, setUpdating] = useState(false);
  const [removing, setRemoving] = useState(false);

  const maxStock = Number(item.countInStock) || Infinity;
  const isLoading = updating || removing;

  const handleQuantityChange = async (newQty) => {
    if (newQty < 1) return;
    if (newQty > maxStock) return; // stock validation
    setUpdating(true);
    await onUpdateQuantity(item._id, newQty, item.price);
    setUpdating(false);
  };

  const handleRemove = async () => {
    setRemoving(true);
    await onRemove(item._id);
    setRemoving(false);
  };

  return (
    <tr className={`text-sm border-b border-gray-100 last:border-0 transition-opacity duration-200 ${isLoading ? "opacity-50 pointer-events-none" : "opacity-100"}`}>

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
            {/* stock এ max পৌঁছালে warning */}
            {item.quantity >= maxStock && maxStock !== Infinity && (
              <p className="text-[10px] text-orange-500 font-semibold mt-1">Max stock reached</p>
            )}
          </div>
        </Link>
      </td>

      {/* Unit Price */}
      <td className="py-6 text-gray-600">Rs {item.price?.toLocaleString()}</td>

      {/* Quantity */}
      <td className="py-6">
        <div className="flex items-center justify-center gap-3">
          <button
            onClick={() => handleQuantityChange(item.quantity - 1)}
            disabled={item.quantity <= 1 || updating}
            className="w-8 h-8 cursor-pointer rounded-full bg-gray-100 flex items-center justify-center hover:bg-gray-200 transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
          >
            <Minus size={14} />
          </button>

          <span className="w-6 text-center font-medium flex items-center justify-center">
            {updating
              ? <Loader2 size={14} className="animate-spin text-red-400" />
              : item.quantity
            }
          </span>

          <button
            onClick={() => handleQuantityChange(item.quantity + 1)}
            disabled={updating || item.quantity >= maxStock}
            className="w-8 h-8 cursor-pointer rounded-full bg-gray-100 flex items-center justify-center hover:bg-gray-200 transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
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
          onClick={handleRemove}
          disabled={removing}
          className="text-gray-400 cursor-pointer hover:text-red-500 transition-colors disabled:opacity-40"
        >
          {removing
            ? <Loader2 size={18} className="animate-spin text-red-400" />
            : <X size={20} />
          }
        </button>
      </td>
    </tr>
  );
};

export default CartItem;












// import React, { useState } from "react";
// import { X, Minus, Plus, Loader2 } from "lucide-react";
// import { Link } from "react-router-dom";

// const CartItem = ({ item, onUpdateQuantity, onRemove }) => {
//   const [updating, setUpdating] = useState(false);
//   const [removing, setRemoving] = useState(false);

//   const handleQuantityChange = async (newQty) => {
//     if (newQty < 1) return;
//     setUpdating(true);
//     await onUpdateQuantity(item._id, newQty, item.price);
//     setUpdating(false);
//   };

//   const handleRemove = async () => {
//     setRemoving(true);
//     await onRemove(item._id);
//     setRemoving(false);
//   };

//   const isLoading = updating || removing;

//   return (
//     <tr className={`text-sm border-b border-gray-100 last:border-0 transition-opacity duration-200 ${isLoading ? "opacity-50 pointer-events-none" : "opacity-100"}`}>

//       {/* Product */}
//       <td className="py-6">
//         <Link to={`/product/${item.productId}`} className="flex items-center gap-4">
//           <img
//             src={item.images}
//             alt={item.productTitle}
//             className="w-16 h-20 object-cover rounded shadow-sm bg-gray-100"
//           />
//           <div>
//             <p className="font-semibold text-gray-800 mb-1 max-w-[200px] line-clamp-2">
//               {item.productTitle}
//             </p>
//             <div className="flex text-yellow-400">
//               {"★".repeat(Math.round(item.rating))}
//               {"☆".repeat(5 - Math.round(item.rating))}
//             </div>
//           </div>
//         </Link>
//       </td>

//       {/* Unit Price */}
//       <td className="py-6 text-gray-600">Rs {item.price?.toLocaleString()}</td>

//       {/* Quantity */}
//       <td className="py-6">
//         <div className="flex items-center justify-center gap-3">
//           <button
//             onClick={() => handleQuantityChange(item.quantity - 1)}
//             disabled={item.quantity <= 1 || updating}
//             className="w-8 h-8 cursor-pointer rounded-full bg-gray-100 flex items-center justify-center hover:bg-gray-200 transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
//           >
//             <Minus size={14} />
//           </button>

       
//           <span className="w-6 text-center font-medium flex items-center justify-center">
//             {updating
//               ? <Loader2 size={14} className="animate-spin text-red-400" />
//               : item.quantity
//             }
//           </span>

//           <button
//             onClick={() => handleQuantityChange(item.quantity + 1)}
//             disabled={updating}
//             className="w-8 h-8 cursor-pointer rounded-full bg-gray-100 flex items-center justify-center hover:bg-gray-200 transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
//           >
//             <Plus size={14} />
//           </button>
//         </div>
//       </td>

//       {/* Subtotal */}
//       <td className="py-6 font-medium text-gray-700">
//         Rs. {item.subTotal?.toLocaleString()}
//       </td>

//       {/* Remove */}
//       <td className="py-6 text-center">
//         <button
//           onClick={handleRemove}
//           disabled={removing}
//           className="text-gray-400 cursor-pointer hover:text-red-500 transition-colors disabled:opacity-40"
//         >
//           {removing
//             ? <Loader2 size={18} className="animate-spin text-red-400" />
//             : <X size={20} />
//           }
//         </button>
//       </td>
//     </tr>
//   );
// };

// export default CartItem;