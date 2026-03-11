import { createContext, useContext, useState, useEffect } from "react";
import { useAuth } from "./AuthContext";
import { getCart, addToCartApi, removeFromCartApi, updateCartApi } from "../utils/api/cartApi";
import toast from "react-hot-toast";

export const CartContext = createContext();

export const CartProvider = ({ children }) => {
  const { isLoggedIn, token } = useAuth();
  const [cartItems, setCartItems] = useState([]);
  const [cartLoading, setCartLoading] = useState(false);

  // ==========================
  // FETCH CART
  // ==========================
  const fetchCart = async () => {
    if (!isLoggedIn) return;
    setCartLoading(true);
    try {
      const data = await getCart(token);
      setCartItems(data.cart || []);
    } catch (err) {
      console.error("Cart fetch error:", err);
    } finally {
      setCartLoading(false);
    }
  };

  useEffect(() => {
    fetchCart();
  }, [isLoggedIn]);

  // ==========================
  // ADD TO CART (duplicate check)
  // ==========================
  const addToCart = async (product, quantity = 1) => {
    if (!isLoggedIn) {
      toast.error("Please login to add items to cart");
      return false;
    }

    // duplicate check
    const existing = cartItems.find(
      (item) => item.productId?.toString() === product._id?.toString()
    );

    if (existing) {
      // already in cart — quantity update করো
      const newQty = existing.quantity + quantity;
      await updateCartItem(existing._id, newQty, product.price);
      toast.success("Cart quantity updated!");
      return true;
    }

    try {
      const data = await addToCartApi(
        {
          productTitle: product.name,
          images: product.images?.[0] || "",
          rating: product.rating || 0,
          price: product.price,
          quantity,
          countInStock: product.countInStock || 0,
          productId: product._id,
        },
        token
      );

      setCartItems((prev) => [...prev, data.cart]);
      toast.success("Item added to cart!");
      return true;
    } catch (err) {
      const msg = err.response?.data?.message || "Failed to add to cart";
      toast.error(msg);
      return false;
    }
  };

  // ==========================
  // REMOVE FROM CART
  // ==========================
  const removeFromCart = async (cartItemId) => {
    try {
      await removeFromCartApi(cartItemId, token);
      setCartItems((prev) => prev.filter((item) => item._id !== cartItemId));
      toast.success("Item removed from cart");
    } catch (err) {
      toast.error("Failed to remove item");
    }
  };

  // ==========================
  // UPDATE CART ITEM
  // ==========================
  const updateCartItem = async (cartItemId, quantity, price) => {
    if (quantity < 1) return;
    try {
      const data = await updateCartApi(cartItemId, { quantity, price }, token);
      setCartItems((prev) =>
        prev.map((item) => (item._id === cartItemId ? data.cart : item))
      );
    } catch (err) {
      toast.error("Failed to update cart");
    }
  };

  // ==========================
  // TOTALS
  // ==========================
  const cartTotal = cartItems.reduce((sum, item) => sum + item.subTotal, 0);
  const cartCount = cartItems.reduce((sum, item) => sum + item.quantity, 0);

  // product cart এ আছে কিনা check
  const isInCart = (productId) =>
    cartItems.some((item) => item.productId?.toString() === productId?.toString());

  // product এর cart item খোঁজা
  const getCartItem = (productId) =>
    cartItems.find((item) => item.productId?.toString() === productId?.toString());

  return (
    <CartContext.Provider
      value={{
        cartItems,
        cartLoading,
        cartTotal,
        cartCount,
        addToCart,
        removeFromCart,
        updateCartItem,
        fetchCart,
        isInCart,
        getCartItem,
      }}
    >
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => useContext(CartContext);
















// import { createContext, useContext, useState, useEffect } from "react";
// import { useAuth } from "./AuthContext";
// import { getCart, addToCartApi, removeFromCartApi, updateCartApi } from "../utils/api/cartApi";
// import toast from "react-hot-toast";

// export const CartContext = createContext();

// export const CartProvider = ({ children }) => {
//   const { isLoggedIn, token } = useAuth();
//   const [cartItems, setCartItems] = useState([]);
//   const [cartLoading, setCartLoading] = useState(false);

//   // ==========================
//   // FETCH CART
//   // ==========================
//   const fetchCart = async () => {
//     if (!isLoggedIn) return;
//     setCartLoading(true);
//     try {
//       const data = await getCart(token);
//       setCartItems(data.cart || []);
//     } catch (err) {
//       console.error("Cart fetch error:", err);
//     } finally {
//       setCartLoading(false);
//     }
//   };

//   useEffect(() => {
//     fetchCart();
//   }, [isLoggedIn]);

//   // ==========================
//   // ADD TO CART (duplicate check)
//   // ==========================
//   const addToCart = async (product, quantity = 1) => {
//     if (!isLoggedIn) {
//       toast.error("Please login to add items to cart");
//       return false;
//     }

//     // duplicate check
//     const existing = cartItems.find(
//       (item) => item.productId?.toString() === product._id?.toString()
//     );

//     if (existing) {
//       // already in cart — quantity update করো
//       const newQty = existing.quantity + quantity;
//       await updateCartItem(existing._id, newQty, product.price);
//       toast.success("Cart quantity updated!");
//       return true;
//     }

//     try {
//       const data = await addToCartApi(
//         {
//           productTitle: product.name,
//           images: product.images?.[0] || "",
//           rating: product.rating || 0,
//           price: product.price,
//           quantity,
//           productId: product._id,
//         },
//         token
//       );

//       setCartItems((prev) => [...prev, data.cart]);
//       toast.success("Item added to cart!");
//       return true;
//     } catch (err) {
//       const msg = err.response?.data?.message || "Failed to add to cart";
//       toast.error(msg);
//       return false;
//     }
//   };

//   // ==========================
//   // REMOVE FROM CART
//   // ==========================
//   const removeFromCart = async (cartItemId) => {
//     try {
//       await removeFromCartApi(cartItemId, token);
//       setCartItems((prev) => prev.filter((item) => item._id !== cartItemId));
//       toast.success("Item removed from cart");
//     } catch (err) {
//       toast.error("Failed to remove item");
//     }
//   };

//   // ==========================
//   // UPDATE CART ITEM
//   // ==========================
//   const updateCartItem = async (cartItemId, quantity, price) => {
//     if (quantity < 1) return;
//     try {
//       const data = await updateCartApi(cartItemId, { quantity, price }, token);
//       setCartItems((prev) =>
//         prev.map((item) => (item._id === cartItemId ? data.cart : item))
//       );
//     } catch (err) {
//       toast.error("Failed to update cart");
//     }
//   };

//   // ==========================
//   // TOTALS
//   // ==========================
//   const cartTotal = cartItems.reduce((sum, item) => sum + item.subTotal, 0);
//   const cartCount = cartItems.reduce((sum, item) => sum + item.quantity, 0);

//   // product cart এ আছে কিনা check
//   const isInCart = (productId) =>
//     cartItems.some((item) => item.productId?.toString() === productId?.toString());

//   // product এর cart item খোঁজা
//   const getCartItem = (productId) =>
//     cartItems.find((item) => item.productId?.toString() === productId?.toString());

//   return (
//     <CartContext.Provider
//       value={{
//         cartItems,
//         cartLoading,
//         cartTotal,
//         cartCount,
//         addToCart,
//         removeFromCart,
//         updateCartItem,
//         fetchCart,
//         isInCart,
//         getCartItem,
//       }}
//     >
//       {children}
//     </CartContext.Provider>
//   );
// };

// export const useCart = () => useContext(CartContext);