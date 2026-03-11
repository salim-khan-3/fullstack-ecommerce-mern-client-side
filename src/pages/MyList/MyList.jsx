import { useState, useEffect } from "react";
import { X, Star, Loader2, Heart } from "lucide-react";
import { Link } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import { getMyList, removeFromMyListApi } from "../../utils/api/myListApi";
import toast from "react-hot-toast";

const MyList = () => {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [removingId, setRemovingId] = useState(null);

  const { token, isLoggedIn } = useAuth();

  useEffect(() => {
    if (!isLoggedIn) return;
    fetchMyList();
  }, [isLoggedIn]);

  const fetchMyList = async () => {
    setLoading(true);
    try {
      const data = await getMyList(token);
      setItems(data.myList || []);
    } catch {
      toast.error("Failed to load wishlist");
    } finally {
      setLoading(false);
    }
  };

  const handleRemove = async (itemId) => {
    setRemovingId(itemId);
    try {
      await removeFromMyListApi(itemId, token);
      setItems((prev) => prev.filter((i) => i._id !== itemId));
      toast.success("Removed from My List");
    } catch {
      toast.error("Failed to remove item");
    } finally {
      setRemovingId(null);
    }
  };

  // Skeleton row
  const SkeletonRow = () => (
    <tr className="border-b border-gray-100">
      <td className="py-5">
        <div className="flex items-center gap-4">
          <div className="w-16 h-20 bg-gray-100 rounded animate-pulse shrink-0" />
          <div className="space-y-2 flex-1">
            <div className="h-4 bg-gray-100 rounded-full animate-pulse w-3/4" />
            <div className="h-3 bg-gray-100 rounded-full animate-pulse w-1/3" />
          </div>
        </div>
      </td>
      <td className="py-5"><div className="h-4 bg-gray-100 rounded-full animate-pulse w-16" /></td>
      <td className="py-5 text-center"><div className="h-5 w-5 bg-gray-100 rounded animate-pulse mx-auto" /></td>
    </tr>
  );

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 py-10 min-h-screen bg-white">

      {/* Header */}
      <div className="mb-6">
        <h1 className="text-2xl font-extrabold text-gray-900 tracking-tight uppercase">
          My List
        </h1>
        {!loading && (
          <p className="text-gray-500 mt-1 text-sm">
            There are{" "}
            <span className="text-red-500 font-bold">{items.length}</span>{" "}
            products in your My List
          </p>
        )}
      </div>

      {/* Empty state */}
      {!loading && items.length === 0 && (
        <div className="flex flex-col items-center justify-center py-24 text-center">
          <div className="w-20 h-20 rounded-2xl bg-red-50 flex items-center justify-center mb-5">
            <Heart size={36} className="text-red-400" />
          </div>
          <h2 className="text-xl font-bold text-gray-700 mb-1">Your list is empty</h2>
          <p className="text-gray-400 text-sm mb-6">Save products you love to find them here later.</p>
          <Link
            to="/"
            className="px-6 py-3 bg-red-500 text-white rounded-full text-sm font-semibold hover:bg-red-600 transition-all"
          >
            Continue Shopping
          </Link>
        </div>
      )}

      {/* Table */}
      {(loading || items.length > 0) && (
        <div className="overflow-x-auto">
          <table className="w-full min-w-[500px]">
            <thead>
              <tr className="bg-gray-200 text-left text-sm text-gray-700">
                <th className="p-4 rounded-l-md font-bold uppercase tracking-wider">Product</th>
                <th className="p-4 font-bold uppercase tracking-wider">Unit Price</th>
                <th className="p-4 text-center rounded-r-md font-bold uppercase tracking-wider">Remove</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">

              {/* Skeleton */}
              {loading && [...Array(3)].map((_, i) => <SkeletonRow key={i} />)}

              {/* Real data */}
              {!loading && items.map((item) => (
                <tr
                  key={item._id}
                  className={`text-sm transition-opacity duration-200 ${removingId === item._id ? "opacity-40 pointer-events-none" : "opacity-100"}`}
                >
                  {/* Product */}
                  <td className="py-5">
                    <Link to={`/product/${item.productId}`} className="flex items-center gap-4">
                      <img
                        src={item.images}
                        alt={item.productTitle}
                        className="w-16 h-20 object-cover rounded bg-gray-100 shrink-0"
                      />
                      <div>
                        <p className="font-semibold text-gray-800 mb-1.5 max-w-xs leading-snug line-clamp-2">
                          {item.productTitle}
                        </p>
                        <div className="flex items-center gap-0.5">
                          {[...Array(5)].map((_, i) => (
                            <Star
                              key={i}
                              size={13}
                              fill={i < Math.round(item.rating) ? "#f59e0b" : "none"}
                              color={i < Math.round(item.rating) ? "#f59e0b" : "#d1d5db"}
                              strokeWidth={1.5}
                            />
                          ))}
                        </div>
                      </div>
                    </Link>
                  </td>

                  {/* Price */}
                  <td className="py-5 text-gray-600 font-medium">
                    Rs {item.price?.toLocaleString()}
                  </td>

                  {/* Remove */}
                  <td className="py-5 text-center">
                    <button
                      onClick={() => handleRemove(item._id)}
                      disabled={removingId === item._id}
                      className="text-gray-400 hover:text-red-500 transition-colors disabled:opacity-40"
                    >
                      {removingId === item._id
                        ? <Loader2 size={18} className="animate-spin text-red-400" />
                        : <X size={20} />
                      }
                    </button>
                  </td>
                </tr>
              ))}

            </tbody>
          </table>
        </div>
      )}

    </div>
  );
};

export default MyList;