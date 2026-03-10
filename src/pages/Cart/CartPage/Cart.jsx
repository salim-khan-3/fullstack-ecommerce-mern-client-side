import React from "react";
import CartTable from "../CartTable/CartTable";
import CartSummary from "../CartSummary/CartSummary";
import { useCart } from "../../../context/CartContext";
import { ShoppingCart } from "lucide-react";
import { Link } from "react-router-dom";

const Cart = () => {
  const { cartItems, cartLoading, cartCount, cartTotal, updateCartItem, removeFromCart } = useCart();

  const handleUpdateQuantity = async (cartItemId, newQty, price) => {
    if (newQty < 1) return;
    await updateCartItem(cartItemId, newQty, price);
  };

  const handleRemove = async (cartItemId) => {
    await removeFromCart(cartItemId);
  };

  if (cartLoading) {
    return (
      <div className="container mx-auto p-10 min-h-screen flex items-center justify-center">
        <div className="text-gray-400 text-lg">Loading cart...</div>
      </div>
    );
  }

  if (cartItems.length === 0) {
    return (
      <div className="container mx-auto p-10 min-h-screen flex flex-col items-center justify-center gap-4">
        <ShoppingCart size={64} className="text-gray-200" />
        <h2 className="text-2xl font-bold text-gray-400">Your cart is empty</h2>
        <Link to="/" className="px-6 py-3 bg-red-500 text-white rounded-full font-semibold hover:bg-red-600 transition-all">
          Continue Shopping
        </Link>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-4 md:p-10 min-h-screen bg-white">
      {/* Header */}
      <div className="mb-10">
        <h1 className="text-3xl font-extrabold text-gray-900 tracking-tight">YOUR CART</h1>
        <p className="text-gray-500 mt-1">
          There are{" "}
          <span className="text-pink-600 font-bold">{cartCount}</span>{" "}
          products in your cart
        </p>
      </div>

      {/* Content */}
      <div className="flex flex-col lg:flex-row gap-12">
        <CartTable
          items={cartItems}
          onUpdateQuantity={handleUpdateQuantity}
          onRemove={handleRemove}
        />
        <CartSummary subtotal={cartTotal} />
      </div>
    </div>
  );
};

export default Cart;














// import React, { useState } from "react";
// import CartTable from "../CartTable/CartTable";
// import CartSummary from "../CartSummary/CartSummary";
// import pp from "../../../assets/category.jpg"
// const Cart = () => {
//   const [items, setItems] = useState([
//     {
//       id: 1,
//       name: "Men Alias-N Regular Fit Spread...",
//       price: 1500,
//       quantity: 1,
//       image: pp,
//       rating: 4,
//     },
//     {
//       id: 2,
//       name: "Chikankari Woven Kurta...",
//       price: 1200,
//       quantity: 3,
//       image: pp,
//       rating: 5,
//     },
//     {
//       id: 3,
//       name: "POCO C61, 4GB RAM, 64GB ROM...",
//       price: 20000,
//       quantity: 1,
//       image:pp,
//       rating: 5,
//     },
//     {
//       id: 3,
//       name: "POCO C61, 4GB RAM, 64GB ROM...",
//       price: 20000,
//       quantity: 1,
//       image:pp,
//       rating: 5,
//     },
//     {
//       id: 3,
//       name: "POCO C61, 4GB RAM, 64GB ROM...",
//       price: 20000,
//       quantity: 1,
//       image:pp,
//       rating: 5,
//     },
//     {
//       id: 3,
//       name: "POCO C61, 4GB RAM, 64GB ROM...",
//       price: 20000,
//       quantity: 1,
//       image:pp,
//       rating: 5,
//     },
//     {
//       id: 3,
//       name: "POCO C61, 4GB RAM, 64GB ROM...",
//       price: 20000,
//       quantity: 1,
//       image:pp,
//       rating: 5,
//     },
//     {
//       id: 3,
//       name: "POCO C61, 4GB RAM, 64GB ROM...",
//       price: 20000,
//       quantity: 1,
//       image:pp,
//       rating: 5,
//     },
//   ]);

//   const handleUpdateQuantity = (id, delta) => {
//     setItems((prevItems) =>
//       prevItems.map((item) =>
//         item.id === id
//           ? {
//               ...item,
//               quantity: Math.max(1, item.quantity + delta),
//             }
//           : item
//       )
//     );
//   };

//   const subtotal = items.reduce(
//     (acc, item) => acc + item.price * item.quantity,
//     0
//   );

//   return (
//     <div className="container mx-auto p-4 md:p-10 min-h-screen bg-white">
//       {/* Header */}
//       <div className="mb-10">
//         <h1 className="text-3xl font-extrabold text-gray-900 tracking-tight">
//           YOUR CART
//         </h1>
//         <p className="text-gray-500 mt-1">
//           There are{" "}
//           <span className="text-pink-600 font-bold">
//             {items.length}
//           </span>{" "}
//           products in your cart
//         </p>
//       </div>

//       {/* Content */}
//       <div className="flex flex-col lg:flex-row gap-12">
//         <CartTable
//           items={items}
//           onUpdateQuantity={handleUpdateQuantity}
//         />
//         <CartSummary subtotal={subtotal} />
//       </div>
//     </div>
//   );
// };

// export default Cart;
