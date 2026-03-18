import { createContext, useEffect, useState, useCallback } from "react";
import { getAllCategoriesForUI } from "../utils/api/categoryApi";
import { getAllSubCategories } from "../utils/api/subCategoryApi";
import { getMyList, addToMyListApi, removeFromMyListApi } from "../utils/api/myListApi";
import toast from "react-hot-toast";

export const StoreContext = createContext();
export const MyContext = StoreContext;

export const StoreProvider = ({ children }) => {
  const [categories, setCategories] = useState([]);
  const [subCategories, setSubCategories] = useState([]);
  const [catLoading, setCatLoading] = useState(true);
  const [isShowHeaderFooter, setIsShowHeaderFooter] = useState(true);

  // ==========================
  // MY LIST STATE
  // ==========================
  const [myListItems, setMyListItems] = useState([]);
  const [myListLoading, setMyListLoading] = useState(false);

  // ==========================
  // CATEGORIES FETCH
  // ==========================
  const fetchData = useCallback(async () => {
    try {
      const [cats, subs] = await Promise.all([
        getAllCategoriesForUI(),
        getAllSubCategories(),
      ]);
      setCategories(Array.isArray(cats) ? cats : []);
      setSubCategories(Array.isArray(subs) ? subs : []);
    } catch (error) {
      console.error("StoreContext fetch error:", error);
    } finally {
      setCatLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchData();
    const interval = setInterval(fetchData, 2 * 60 * 1000);
    return () => clearInterval(interval);
  }, [fetchData]);

  const getSubCatsByCategory = (categoryId) => {
    return subCategories.filter((s) => {
      const catId = s.category?._id || s.category;
      return catId?.toString() === categoryId?.toString();
    });
  };

  // ==========================
  // MY LIST FETCH
  // ==========================
  const fetchMyList = useCallback(async (token) => {
    if (!token) { setMyListItems([]); return; }
    setMyListLoading(true);
    try {
      const data = await getMyList(token);
      setMyListItems(data.myList || []);
    } catch (err) {
      console.error("MyList fetch error:", err);
    } finally {
      setMyListLoading(false);
    }
  }, []);

  // ==========================
  // ADD TO MY LIST
  // ==========================
  const addToMyList = async (product, token) => {
    const existing = myListItems.find(
      (i) => i.productId?.toString() === product._id?.toString()
    );
    if (existing) {
      toast.error("Already in your wishlist");
      return false;
    }
    try {
      const data = await addToMyListApi({
        productTitle: product.name,
        images: product.images?.[0] || "",
        rating: product.rating || 0,
        price: product.price,
        productId: product._id,
      }, token);
      setMyListItems((prev) => [...prev, data.myList]);
      toast.success("Added to My List!");
      return data.myList;
    } catch (err) {
      const msg = err.response?.data?.message || "Failed to add";
      toast.error(msg);
      return false;
    }
  };

  // ==========================
  // REMOVE FROM MY LIST
  // ==========================
  const removeFromMyList = async (itemId, token) => {
    try {
      await removeFromMyListApi(itemId, token);
      setMyListItems((prev) => prev.filter((i) => i._id !== itemId));
      toast.success("Removed from My List");
      return true;
    } catch (err) {
      toast.error("Failed to remove");
      return false;
    }
  };

  // ==========================
  // RESET MY LIST (logout এ call হবে)
  // ==========================
  const resetMyList = () => setMyListItems([]);

  // ==========================
  // HELPERS
  // ==========================
  const isInMyList = (productId) =>
    myListItems.some((i) => i.productId?.toString() === productId?.toString());

  const getMyListItem = (productId) =>
    myListItems.find((i) => i.productId?.toString() === productId?.toString());

  const myListCount = myListItems.length;

  return (
    <StoreContext.Provider
      value={{
        // categories
        categories,
        setCategories,
        subCategories,
        setSubCategories,
        catLoading,
        getSubCatsByCategory,
        isShowHeaderFooter,
        setIsShowHeaderFooter,
        // myList
        myListItems,
        myListLoading,
        myListCount,
        fetchMyList,
        addToMyList,
        removeFromMyList,
        isInMyList,
        getMyListItem,
        resetMyList,
      }}
    >
      {children}
    </StoreContext.Provider>
  );
};




















// import { createContext, useEffect, useState, useCallback, useContext } from "react";
// import { getAllCategoriesForUI } from "../utils/api/categoryApi";
// import { getAllSubCategories } from "../utils/api/subCategoryApi";
// import { getMyList, addToMyListApi, removeFromMyListApi } from "../utils/api/myListApi";
// import toast from "react-hot-toast";

// export const StoreContext = createContext();
// export const MyContext = StoreContext;

// export const StoreProvider = ({ children }) => {
//   const [categories, setCategories] = useState([]);
//   const [subCategories, setSubCategories] = useState([]);
//   const [catLoading, setCatLoading] = useState(true);
//   const [isShowHeaderFooter, setIsShowHeaderFooter] = useState(true);

//   // ==========================
//   // MY LIST STATE
//   // ==========================
//   const [myListItems, setMyListItems] = useState([]);
//   const [myListLoading, setMyListLoading] = useState(false);

//   // ==========================
//   // CATEGORIES FETCH
//   // ==========================
//   const fetchData = useCallback(async () => {
//     try {
//       const [cats, subs] = await Promise.all([
//         getAllCategoriesForUI(),
//         getAllSubCategories(),
//       ]);
//       setCategories(Array.isArray(cats) ? cats : []);
//       setSubCategories(Array.isArray(subs) ? subs : []);
//     } catch (error) {
//       console.error("StoreContext fetch error:", error);
//     } finally {
//       setCatLoading(false);
//     }
//   }, []);

//   useEffect(() => {
//     fetchData();
//     const interval = setInterval(fetchData, 2 * 60 * 1000);
//     return () => clearInterval(interval);
//   }, [fetchData]);

//   const getSubCatsByCategory = (categoryId) => {
//     return subCategories.filter((s) => {
//       const catId = s.category?._id || s.category;
//       return catId?.toString() === categoryId?.toString();
//     });
//   };

//   // ==========================
//   // MY LIST FETCH
//   // ==========================
//   const fetchMyList = useCallback(async (token) => {
//     if (!token) { setMyListItems([]); return; }
//     setMyListLoading(true);
//     try {
//       const data = await getMyList(token);
//       setMyListItems(data.myList || []);
//     } catch (err) {
//       console.error("MyList fetch error:", err);
//     } finally {
//       setMyListLoading(false);
//     }
//   }, []);

//   // ==========================
//   // ADD TO MY LIST
//   // ==========================
//   const addToMyList = async (product, token) => {
//     const existing = myListItems.find(
//       (i) => i.productId?.toString() === product._id?.toString()
//     );
//     if (existing) {
//       toast.error("Already in your wishlist");
//       return false;
//     }
//     try {
//       const data = await addToMyListApi({
//         productTitle: product.name,
//         images: product.images?.[0] || "",
//         rating: product.rating || 0,
//         price: product.price,
//         productId: product._id,
//       }, token);
//       setMyListItems((prev) => [...prev, data.myList]);
//       toast.success("Added to My List!");
//       return data.myList;
//     } catch (err) {
//       const msg = err.response?.data?.message || "Failed to add";
//       toast.error(msg);
//       return false;
//     }
//   };

//   // ==========================
//   // REMOVE FROM MY LIST
//   // ==========================
//   const removeFromMyList = async (itemId, token) => {
//     try {
//       await removeFromMyListApi(itemId, token);
//       setMyListItems((prev) => prev.filter((i) => i._id !== itemId));
//       toast.success("Removed from My List");
//       return true;
//     } catch (err) {
//       toast.error("Failed to remove");
//       return false;
//     }
//   };

//   // ==========================
//   // HELPERS
//   // ==========================
//   const isInMyList = (productId) =>
//     myListItems.some((i) => i.productId?.toString() === productId?.toString());

//   const getMyListItem = (productId) =>
//     myListItems.find((i) => i.productId?.toString() === productId?.toString());

//   const myListCount = myListItems.length;

//   return (
//     <StoreContext.Provider
//       value={{
//         // categories
//         categories,
//         setCategories,
//         subCategories,
//         setSubCategories,
//         catLoading,
//         getSubCatsByCategory,
//         isShowHeaderFooter,
//         setIsShowHeaderFooter,
//         // myList
//         myListItems,
//         myListLoading,
//         myListCount,
//         fetchMyList,
//         addToMyList,
//         removeFromMyList,
//         isInMyList,
//         getMyListItem,
//       }}
//     >
//       {children}
//     </StoreContext.Provider>
//   );
// };






// import { createContext, useEffect, useState, useCallback } from "react";
// import { getAllCategoriesForUI } from "../utils/api/categoryApi";
// import { getAllSubCategories } from "../utils/api/subCategoryApi";

// export const StoreContext = createContext();
// export const MyContext = StoreContext;

// export const StoreProvider = ({ children }) => {
//   const [categories, setCategories] = useState([]);
//   const [subCategories, setSubCategories] = useState([]);
//   const [catLoading, setCatLoading] = useState(true);
//   const [isShowHeaderFooter, setIsShowHeaderFooter] = useState(true);

//   const fetchData = useCallback(async () => {
//     try {
//       const [cats, subs] = await Promise.all([
//         getAllCategoriesForUI(),
//         getAllSubCategories(),
//       ]);
//       setCategories(Array.isArray(cats) ? cats : []);
//       setSubCategories(Array.isArray(subs) ? subs : []);
//     } catch (error) {
//       console.error("StoreContext fetch error:", error);
//     } finally {
//       setCatLoading(false);
//     }
//   }, []);

//   useEffect(() => {
//     fetchData();
//     const interval = setInterval(fetchData, 2 * 60 * 1000);
//     return () => clearInterval(interval);
//   }, [fetchData]);

//   const getSubCatsByCategory = (categoryId) => {
//     return subCategories.filter((s) => {
//       const catId = s.category?._id || s.category;
//       return catId?.toString() === categoryId?.toString();
//     });
//   };

//   return (
//     <StoreContext.Provider
//       value={{
//         categories,
//         setCategories,
//         subCategories,
//         setSubCategories,
//         catLoading,
//         getSubCatsByCategory,
//         isShowHeaderFooter,
//         setIsShowHeaderFooter,
//       }}
//     >
//       {children}
//     </StoreContext.Provider>
//   );
// };
