import { createContext, useState } from "react";
import {
  deleteProduct,
  getAllProducts,
  getProductsByCategory,
} from "../api/productApi";

export const ProductContext = createContext();

export const ProductProvider = ({ children }) => {
  const [products, setProducts]     = useState([]);
  const [loading, setLoading]       = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalItems, setTotalItems] = useState(0);

  const fetchProducts = async (categoryId = "", page = 1) => {
    setLoading(true);
    try {
      const data = categoryId
        ? await getProductsByCategory(categoryId)
        : await getAllProducts(page, 6);

      if (categoryId) {
        setProducts(Array.isArray(data.data) ? data.data : []);
        setTotalPages(1);
        setTotalItems(data.count || 0);
      } else {
        setProducts(data.products || []);
        setTotalPages(data.totalPages || 1);
        setTotalItems(data.totalItems || 0);
        setCurrentPage(data.currentPage || 1);
      }
    } catch (err) {
      console.error("Products fetch error:", err);
    } finally {
      setLoading(false);
    }
  };

  const productDeleteFunc = async (id) => {
    setLoading(true);
    try {
      await deleteProduct(id);
      setProducts((prev) => prev.filter((p) => p._id !== id));
    } catch (err) {
      console.error("Error deleting product:", err);
      alert("Failed to delete product: " + (err.message || err));
    } finally {
      setLoading(false);
    }
  };

  return (
    <ProductContext.Provider
      value={{
        products,
        setProducts,
        loading,
        setLoading,
        currentPage,
        setCurrentPage,
        totalPages,
        totalItems,
        fetchProducts,
        productDeleteFunc,
      }}
    >
      {children}
    </ProductContext.Provider>
  );
};