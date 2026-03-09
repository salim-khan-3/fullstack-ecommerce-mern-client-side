import { createContext, useEffect, useState, useCallback } from "react";
import { getAllCategoriesForUI } from "../utils/api/categoryApi";
import { getAllSubCategories } from "../utils/api/subCategoryApi";

export const StoreContext = createContext();
export const MyContext = StoreContext;

export const StoreProvider = ({ children }) => {
  const [categories, setCategories] = useState([]);
  const [subCategories, setSubCategories] = useState([]);
  const [catLoading, setCatLoading] = useState(true);
  const [isShowHeaderFooter, setIsShowHeaderFooter] = useState(true);

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

  return (
    <StoreContext.Provider
      value={{
        categories,
        setCategories,
        subCategories,
        setSubCategories,
        catLoading,
        getSubCatsByCategory,
        isShowHeaderFooter,
        setIsShowHeaderFooter,
      }}
    >
      {children}
    </StoreContext.Provider>
  );
};
