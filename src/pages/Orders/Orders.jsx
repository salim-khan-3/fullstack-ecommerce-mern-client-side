import { useState, useEffect } from "react";
import { useAuth } from "../../context/AuthContext";
import { getMyOrdersApi, cancelOrderApi } from "../../utils/api/orderApi";
import { X, Loader2, ShoppingBag, ChevronRight } from "lucide-react";
import { Link } from "react-router-dom";
import toast from "react-hot-toast";

const statusConfig = {
  processing: { bg: "bg-blue-100",    text: "text-blue-700",    dot: "bg-blue-500"    },
  confirmed:  { bg: "bg-indigo-100",  text: "text-indigo-700",  dot: "bg-indigo-500"  },
  shipped:    { bg: "bg-violet-100",  text: "text-violet-700",  dot: "bg-violet-500"  },
  delivered:  { bg: "bg-emerald-100", text: "text-emerald-700", dot: "bg-emerald-500" },
  cancelled:  { bg: "bg-red-100",     text: "text-red-700",     dot: "bg-red-400"     },
};

const Orders = () => {
  const { token } = useAuth();
  const [orders, setOrders]               = useState([]);
  const [loading, setLoading]             = useState(true);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [cancellingId, setCancellingId]   = useState(null);
  const [filterStatus, setFilterStatus]   = useState("all");

  useEffect(() => { fetchOrders(); }, []);

  const fetchOrders = async () => {
    setLoading(true);
    try {
      const data = await getMyOrdersApi(token);
      setOrders(data.orders || []);
    } catch {
      toast.error("Failed to load orders");
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = async (orderId) => {
    setCancellingId(orderId);
    try {
      await cancelOrderApi(orderId, token);
      setOrders((prev) =>
        prev.map((o) => o._id === orderId ? { ...o, orderStatus: "cancelled" } : o)
      );
      if (selectedOrder?._id === orderId) {
        setSelectedOrder((prev) => ({ ...prev, orderStatus: "cancelled" }));
      }
      toast.success("Order cancelled");
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to cancel order");
    } finally {
      setCancellingId(null);
    }
  };

  const filtered = orders.filter((o) =>
    filterStatus === "all" || o.orderStatus === filterStatus
  );

  return (
    <div className="min-h-screen bg-gray-50 py-10 px-4 sm:px-6">
      <div className="max-w-6xl mx-auto">

        {/* Header */}
        <div className="mb-8">
          <p className="text-xs font-bold text-indigo-500 uppercase tracking-widest mb-1">My Account</p>
          <h1 className="text-4xl font-extrabold text-gray-900">My Orders</h1>
        </div>

        {/* Filter */}
        <div className="flex gap-2 flex-wrap mb-6">
          {["all", "processing", "confirmed", "shipped", "delivered", "cancelled"].map((s) => (
            <button key={s} onClick={() => setFilterStatus(s)}
              className={`px-3 py-2 rounded-xl text-xs font-semibold capitalize transition-all
                ${filterStatus === s
                  ? "bg-gray-900 text-white"
                  : "bg-white border border-gray-200 text-gray-500 hover:border-gray-300"
                }`}
            >
              {s}
            </button>
          ))}
        </div>

        {/* Empty state */}
        {!loading && orders.length === 0 && (
          <div className="flex flex-col items-center justify-center py-24 text-center">
            <div className="w-20 h-20 rounded-2xl bg-indigo-50 flex items-center justify-center mb-5">
              <ShoppingBag size={36} className="text-indigo-400" />
            </div>
            <h2 className="text-xl font-bold text-gray-700 mb-1">No orders yet</h2>
            <p className="text-gray-400 text-sm mb-6">Start shopping to see your orders here.</p>
            <Link to="/" className="px-6 py-3 bg-indigo-600 text-white rounded-full text-sm font-semibold hover:bg-indigo-700 transition-all">
              Start Shopping
            </Link>
          </div>
        )}

        {/* Table */}
        {(loading || orders.length > 0) && (
          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full min-w-[700px]">
                <thead>
                  <tr className="bg-gray-100 text-left text-xs font-bold text-gray-500 uppercase tracking-wider">
                    <th className="px-5 py-4 rounded-tl-2xl">Order</th>
                    <th className="px-5 py-4">Items</th>
                    <th className="px-5 py-4">Date</th>
                    <th className="px-5 py-4">Payment</th>
                    <th className="px-5 py-4">Total</th>
                    <th className="px-5 py-4">Status</th>
                    <th className="px-5 py-4 text-center rounded-tr-2xl">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">

                  {/* Skeleton */}
                  {loading && [...Array(4)].map((_, i) => (
                    <tr key={i}>
                      {[...Array(7)].map((_, j) => (
                        <td key={j} className="px-5 py-4">
                          <div className="h-4 bg-gray-100 rounded-full animate-pulse w-3/4" />
                        </td>
                      ))}
                    </tr>
                  ))}

                  {/* Real rows */}
                  {!loading && filtered.map((order) => {
                    const sc = statusConfig[order.orderStatus] || statusConfig.processing;
                    return (
                      <tr key={order._id} className="hover:bg-gray-50 transition-colors">

                        {/* Order ID */}
                        <td className="px-5 py-4">
                          <span className="text-xs font-mono font-bold text-indigo-500 bg-indigo-50 px-2 py-1 rounded-lg">
                            #{order._id.slice(-8).toUpperCase()}
                          </span>
                        </td>

                        {/* Items thumbnails */}
                        <td className="px-5 py-4">
                          <div className="flex items-center gap-2">
                            <div className="flex -space-x-2">
                              {order.orderItems.slice(0, 3).map((item, i) => (
                                <img key={i} src={item.image} alt={item.productTitle}
                                  className="w-8 h-8 rounded-lg object-cover border-2 border-white bg-gray-100 shrink-0" />
                              ))}
                              {order.orderItems.length > 3 && (
                                <div className="w-8 h-8 rounded-lg bg-gray-100 border-2 border-white flex items-center justify-center text-[10px] font-bold text-gray-500">
                                  +{order.orderItems.length - 3}
                                </div>
                              )}
                            </div>
                            <span className="text-xs text-gray-400">
                              {order.orderItems.length} item{order.orderItems.length !== 1 ? "s" : ""}
                            </span>
                          </div>
                        </td>

                        {/* Date */}
                        <td className="px-5 py-4 text-xs text-gray-500 whitespace-nowrap">
                          {new Date(order.createdAt).toLocaleDateString("en-GB", {
                            day: "numeric", month: "short", year: "numeric"
                          })}
                        </td>

                        {/* Payment */}
                        <td className="px-5 py-4">
                          <p className="text-xs font-medium text-gray-700 capitalize">{order.paymentMethod}</p>
                          <p className="text-[11px] text-gray-400 capitalize">{order.paymentStatus}</p>
                        </td>

                        {/* Total */}
                        <td className="px-5 py-4">
                          <span className="text-sm font-black text-gray-800">
                            ৳{order.totalPrice?.toLocaleString()}
                          </span>
                        </td>

                        {/* Status */}
                        <td className="px-5 py-4">
                          <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold ${sc.bg} ${sc.text}`}>
                            <span className={`w-1.5 h-1.5 rounded-full ${sc.dot}`} />
                            {order.orderStatus.charAt(0).toUpperCase() + order.orderStatus.slice(1)}
                          </span>
                        </td>

                        {/* Actions */}
                        <td className="px-5 py-4">
                          <div className="flex items-center justify-center gap-3">
                            {!["shipped", "delivered", "cancelled"].includes(order.orderStatus) && (
                              <button
                                onClick={() => handleCancel(order._id)}
                                disabled={cancellingId === order._id}
                                className="text-xs text-red-400 hover:text-red-600 font-semibold transition-colors disabled:opacity-40 flex items-center gap-1"
                              >
                                {cancellingId === order._id
                                  ? <Loader2 size={12} className="animate-spin" />
                                  : <X size={12} />
                                }
                                Cancel
                              </button>
                            )}
                            <button
                              onClick={() => setSelectedOrder(order)}
                              className="flex items-center gap-1 text-xs text-indigo-500 hover:text-indigo-700 font-semibold transition-colors"
                            >
                              Details <ChevronRight size={12} />
                            </button>
                          </div>
                        </td>

                      </tr>
                    );
                  })}

                  {/* No filter match */}
                  {!loading && filtered.length === 0 && orders.length > 0 && (
                    <tr>
                      <td colSpan={7} className="px-5 py-16 text-center text-sm text-gray-400">
                        No orders match the selected filter.
                      </td>
                    </tr>
                  )}

                </tbody>
              </table>
            </div>

            {/* Footer */}
            {!loading && (
              <div className="px-5 py-3 border-t border-gray-100 text-xs text-gray-400">
                Showing {filtered.length} of {orders.length} orders
              </div>
            )}
          </div>
        )}

      </div>

      {/* ── DETAIL MODAL ── */}
      {selectedOrder && (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-sm z-50 flex items-center justify-center p-4"
          onClick={() => setSelectedOrder(null)}>
          <div className="bg-white rounded-3xl w-full max-w-lg shadow-2xl overflow-hidden max-h-[90vh] overflow-y-auto"
            onClick={(e) => e.stopPropagation()}>

            {/* Modal Header */}
            <div className="px-6 py-5 border-b border-gray-100 flex items-center justify-between sticky top-0 bg-white z-10">
              <div>
                <p className="text-xs text-gray-400 mb-0.5">Order Details</p>
                <h2 className="text-base font-bold text-gray-800">
                  #{selectedOrder._id.slice(-8).toUpperCase()}
                </h2>
              </div>
              <button onClick={() => setSelectedOrder(null)}
                className="w-8 h-8 rounded-xl bg-gray-100 flex items-center justify-center hover:bg-gray-200 transition-colors">
                <X size={15} className="text-gray-500" />
              </button>
            </div>

            <div className="p-6 space-y-5">

              {/* Status */}
              {(() => {
                const sc = statusConfig[selectedOrder.orderStatus] || statusConfig.processing;
                return (
                  <span className={`inline-flex items-center gap-2 px-3 py-1.5 rounded-full text-sm font-semibold ${sc.bg} ${sc.text}`}>
                    <span className={`w-2 h-2 rounded-full ${sc.dot}`} />
                    {selectedOrder.orderStatus.charAt(0).toUpperCase() + selectedOrder.orderStatus.slice(1)}
                  </span>
                );
              })()}

              {/* Items */}
              <div>
                <p className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-3">Items</p>
                <div className="space-y-2.5">
                  {selectedOrder.orderItems.map((item, i) => (
                    <div key={i} className="flex items-center gap-3 bg-gray-50 rounded-xl p-3">
                      <img src={item.image} alt={item.productTitle}
                        className="w-12 h-12 rounded-lg object-cover bg-gray-100 shrink-0" />
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-semibold text-gray-700 line-clamp-1">{item.productTitle}</p>
                        <p className="text-xs text-gray-400">Qty: {item.quantity} × ৳{item.price?.toLocaleString()}</p>
                      </div>
                      <span className="text-sm font-bold text-gray-700 shrink-0">৳{item.subTotal?.toLocaleString()}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Pricing */}
              <div className="bg-gray-50 rounded-2xl p-4 space-y-2">
                <div className="flex justify-between text-sm text-gray-500">
                  <span>Subtotal</span><span>৳{selectedOrder.subTotal?.toLocaleString()}</span>
                </div>
                <div className="flex justify-between text-sm text-gray-500">
                  <span>Shipping</span>
                  <span>{selectedOrder.shippingCost === 0 ? "Free" : `৳${selectedOrder.shippingCost}`}</span>
                </div>
                <div className="flex justify-between font-bold text-gray-800 pt-2 border-t border-gray-200">
                  <span>Total</span>
                  <span className="text-indigo-600">৳{selectedOrder.totalPrice?.toLocaleString()}</span>
                </div>
              </div>

              {/* Shipping Address */}
              <div>
                <p className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-3">Shipping Address</p>
                <div className="bg-gray-50 rounded-2xl p-4 text-sm text-gray-600 space-y-1">
                  <p className="font-semibold text-gray-800">
                    {selectedOrder.shippingAddress.firstName} {selectedOrder.shippingAddress.lastName}
                  </p>
                  <p>{selectedOrder.shippingAddress.street1}</p>
                  {selectedOrder.shippingAddress.street2 && <p>{selectedOrder.shippingAddress.street2}</p>}
                  <p>{selectedOrder.shippingAddress.city}, {selectedOrder.shippingAddress.state} {selectedOrder.shippingAddress.zipCode}</p>
                  <p>{selectedOrder.shippingAddress.country}</p>
                  <p className="text-indigo-500">{selectedOrder.shippingAddress.phone}</p>
                  <p className="text-indigo-500">{selectedOrder.shippingAddress.email}</p>
                </div>
              </div>

              {/* Payment Info */}
              <div className="grid grid-cols-2 gap-3">
                {[
                  ["Payment Method", selectedOrder.paymentMethod],
                  ["Payment Status", selectedOrder.paymentStatus],
                  ["Shipping Method", selectedOrder.shippingMethod],
                  ["Order Date", new Date(selectedOrder.createdAt).toLocaleDateString("en-GB")],
                ].map(([k, v]) => (
                  <div key={k} className="bg-gray-50 rounded-xl px-4 py-3">
                    <p className="text-xs text-gray-400 mb-0.5">{k}</p>
                    <p className="text-sm font-semibold text-gray-700 capitalize">{v}</p>
                  </div>
                ))}
              </div>

              {/* Cancel */}
              {!["shipped", "delivered", "cancelled"].includes(selectedOrder.orderStatus) && (
                <button onClick={() => handleCancel(selectedOrder._id)}
                  disabled={cancellingId === selectedOrder._id}
                  className="w-full py-3 rounded-2xl border-2 border-red-200 text-red-500 text-sm font-bold hover:bg-red-50 transition-all disabled:opacity-40 flex items-center justify-center gap-2">
                  {cancellingId === selectedOrder._id
                    ? <><Loader2 size={15} className="animate-spin" /> Cancelling...</>
                    : "Cancel Order"
                  }
                </button>
              )}

            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Orders;












// import { useState, useEffect } from "react";
// import { useAuth } from "../../context/AuthContext";
// import { getMyOrdersApi, cancelOrderApi } from "../../utils/api/orderApi";
// import { Package, ChevronRight, X, Loader2, ShoppingBag } from "lucide-react";
// import { Link } from "react-router-dom";
// import toast from "react-hot-toast";

// const statusConfig = {
//   processing: { bg: "bg-blue-100",    text: "text-blue-700",    dot: "bg-blue-500"    },
//   confirmed:  { bg: "bg-indigo-100",  text: "text-indigo-700",  dot: "bg-indigo-500"  },
//   shipped:    { bg: "bg-violet-100",  text: "text-violet-700",  dot: "bg-violet-500"  },
//   delivered:  { bg: "bg-emerald-100", text: "text-emerald-700", dot: "bg-emerald-500" },
//   cancelled:  { bg: "bg-red-100",     text: "text-red-700",     dot: "bg-red-400"     },
// };

// const Orders = () => {
//   const { token } = useAuth();
//   const [orders, setOrders]               = useState([]);
//   const [loading, setLoading]             = useState(true);
//   const [selectedOrder, setSelectedOrder] = useState(null);
//   const [cancellingId, setCancellingId]   = useState(null);
//   const [filterStatus, setFilterStatus]   = useState("all");

//   useEffect(() => {
//     fetchOrders();
//   }, []);

//   const fetchOrders = async () => {
//     setLoading(true);
//     try {
//       const data = await getMyOrdersApi(token);
//       setOrders(data.orders || []);
//     } catch {
//       toast.error("Failed to load orders");
//     } finally {
//       setLoading(false);
//     }
//   };

//   const handleCancel = async (orderId) => {
//     setCancellingId(orderId);
//     try {
//       await cancelOrderApi(orderId, token);
//       setOrders((prev) =>
//         prev.map((o) => o._id === orderId ? { ...o, orderStatus: "cancelled" } : o)
//       );
//       if (selectedOrder?._id === orderId) {
//         setSelectedOrder((prev) => ({ ...prev, orderStatus: "cancelled" }));
//       }
//       toast.success("Order cancelled");
//     } catch (err) {
//       toast.error(err.response?.data?.message || "Failed to cancel order");
//     } finally {
//       setCancellingId(null);
//     }
//   };

//   const filtered = orders.filter((o) =>
//     filterStatus === "all" || o.orderStatus === filterStatus
//   );

//   const SkeletonRow = () => (
//     <div className="bg-white rounded-2xl p-5 border border-gray-100 space-y-3">
//       <div className="flex justify-between">
//         <div className="h-4 w-32 bg-gray-100 rounded-full animate-pulse" />
//         <div className="h-6 w-20 bg-gray-100 rounded-full animate-pulse" />
//       </div>
//       <div className="h-3 w-48 bg-gray-100 rounded-full animate-pulse" />
//       <div className="h-4 w-24 bg-gray-100 rounded-full animate-pulse" />
//     </div>
//   );

//   return (
//     <div className="min-h-screen bg-gray-50 py-10 px-4 sm:px-6">
//       <div className="max-w-4xl mx-auto">

//         {/* Header */}
//         <div className="mb-8">
//           <p className="text-xs font-bold text-indigo-500 uppercase tracking-widest mb-1">My Account</p>
//           <h1 className="text-4xl font-extrabold text-gray-900">My Orders</h1>
//         </div>

//         {/* Filters */}
//         <div className="flex flex-wrap items-center gap-3 mb-6">
//           <div className="flex gap-2 flex-wrap">
//             {["all", "processing", "confirmed", "shipped", "delivered", "cancelled"].map((s) => (
//               <button
//                 key={s}
//                 onClick={() => setFilterStatus(s)}
//                 className={`px-3 py-2 rounded-xl text-xs font-semibold capitalize transition-all
//                   ${filterStatus === s
//                     ? "bg-gray-900 text-white"
//                     : "bg-white border border-gray-200 text-gray-500 hover:border-gray-300"
//                   }`}
//               >
//                 {s}
//               </button>
//             ))}
//           </div>
//         </div>

//         {/* Loading */}
//         {loading && (
//           <div className="space-y-3">
//             {[...Array(3)].map((_, i) => <SkeletonRow key={i} />)}
//           </div>
//         )}

//         {/* Empty */}
//         {!loading && orders.length === 0 && (
//           <div className="flex flex-col items-center justify-center py-24 text-center">
//             <div className="w-20 h-20 rounded-2xl bg-indigo-50 flex items-center justify-center mb-5">
//               <ShoppingBag size={36} className="text-indigo-400" />
//             </div>
//             <h2 className="text-xl font-bold text-gray-700 mb-1">No orders yet</h2>
//             <p className="text-gray-400 text-sm mb-6">Start shopping to see your orders here.</p>
//             <Link to="/" className="px-6 py-3 bg-indigo-600 text-white rounded-full text-sm font-semibold hover:bg-indigo-700 transition-all">
//               Start Shopping
//             </Link>
//           </div>
//         )}

//         {/* Orders list */}
//         {!loading && filtered.length > 0 && (
//           <div className="space-y-3">
//             {filtered.map((order) => {
//               const sc = statusConfig[order.orderStatus] || statusConfig.processing;
//               return (
//                 <div key={order._id}
//                   className="bg-white rounded-2xl border border-gray-100 shadow-sm hover:shadow-md transition-all duration-200 overflow-hidden"
//                 >
//                   <div className="p-5">
//                     <div className="flex items-start justify-between gap-4 flex-wrap">

//                       {/* Left */}
//                       <div className="flex-1 min-w-0">
//                         <div className="flex items-center gap-2 mb-2 flex-wrap">
//                           <span className="text-xs font-mono text-indigo-500 bg-indigo-50 px-2 py-0.5 rounded-lg">
//                             #{order._id.slice(-8).toUpperCase()}
//                           </span>
//                           <span className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-semibold ${sc.bg} ${sc.text}`}>
//                             <span className={`w-1.5 h-1.5 rounded-full ${sc.dot}`} />
//                             {order.orderStatus.charAt(0).toUpperCase() + order.orderStatus.slice(1)}
//                           </span>
//                         </div>

//                         {/* Products */}
//                         <div className="flex items-center gap-2 mb-3">
//                           <div className="flex -space-x-2">
//                             {order.orderItems.slice(0, 3).map((item, i) => (
//                               <img key={i} src={item.image} alt={item.productTitle}
//                                 className="w-9 h-9 rounded-lg object-cover border-2 border-white bg-gray-100" />
//                             ))}
//                             {order.orderItems.length > 3 && (
//                               <div className="w-9 h-9 rounded-lg bg-gray-100 border-2 border-white flex items-center justify-center text-[10px] font-bold text-gray-500">
//                                 +{order.orderItems.length - 3}
//                               </div>
//                             )}
//                           </div>
//                           <span className="text-xs text-gray-400">
//                             {order.orderItems.length} item{order.orderItems.length !== 1 ? "s" : ""}
//                           </span>
//                         </div>

//                         <div className="flex items-center gap-4 text-xs text-gray-400 flex-wrap">
//                           <span>{new Date(order.createdAt).toLocaleDateString("en-GB", { day: "numeric", month: "short", year: "numeric" })}</span>
//                           <span className="capitalize">{order.paymentMethod} · {order.paymentStatus}</span>
//                         </div>
//                       </div>

//                       {/* Right */}
//                       <div className="flex flex-col items-end gap-3">
//                         <span className="text-xl font-black text-gray-800">
//                           ৳{order.totalPrice?.toLocaleString()}
//                         </span>
//                         <div className="flex items-center gap-2">
//                           {!["shipped", "delivered", "cancelled"].includes(order.orderStatus) && (
//                             <button
//                               onClick={() => handleCancel(order._id)}
//                               disabled={cancellingId === order._id}
//                               className="text-xs text-red-400 hover:text-red-600 font-semibold transition-colors disabled:opacity-40 flex items-center gap-1"
//                             >
//                               {cancellingId === order._id
//                                 ? <Loader2 size={12} className="animate-spin" />
//                                 : <X size={12} />
//                               }
//                               Cancel
//                             </button>
//                           )}
//                           <button
//                             onClick={() => setSelectedOrder(order)}
//                             className="flex items-center gap-1 text-xs text-indigo-500 hover:text-indigo-700 font-semibold transition-colors"
//                           >
//                             Details <ChevronRight size={13} />
//                           </button>
//                         </div>
//                       </div>

//                     </div>
//                   </div>
//                 </div>
//               );
//             })}
//           </div>
//         )}

//         {/* No filter results */}
//         {!loading && orders.length > 0 && filtered.length === 0 && (
//           <div className="text-center py-16 text-gray-400 text-sm">
//             No orders match the selected filter.
//           </div>
//         )}

//       </div>

//       {/* ── DETAIL MODAL ── */}
//       {selectedOrder && (
//         <div
//           className="fixed inset-0 bg-black/40 backdrop-blur-sm z-50 flex items-center justify-center p-4"
//           onClick={() => setSelectedOrder(null)}
//         >
//           <div
//             className="bg-white rounded-3xl w-full max-w-lg shadow-2xl overflow-hidden max-h-[90vh] overflow-y-auto"
//             onClick={(e) => e.stopPropagation()}
//           >
//             {/* Modal Header */}
//             <div className="px-6 py-5 border-b border-gray-100 flex items-center justify-between sticky top-0 bg-white z-10">
//               <div>
//                 <p className="text-xs text-gray-400 mb-0.5">Order Details</p>
//                 <h2 className="text-base font-bold text-gray-800">
//                   #{selectedOrder._id.slice(-8).toUpperCase()}
//                 </h2>
//               </div>
//               <button onClick={() => setSelectedOrder(null)}
//                 className="w-8 h-8 rounded-xl bg-gray-100 flex items-center justify-center hover:bg-gray-200 transition-colors">
//                 <X size={15} className="text-gray-500" />
//               </button>
//             </div>

//             <div className="p-6 space-y-5">

//               {/* Status */}
//               {(() => {
//                 const sc = statusConfig[selectedOrder.orderStatus] || statusConfig.processing;
//                 return (
//                   <span className={`inline-flex items-center gap-2 px-3 py-1.5 rounded-full text-sm font-semibold ${sc.bg} ${sc.text}`}>
//                     <span className={`w-2 h-2 rounded-full ${sc.dot}`} />
//                     {selectedOrder.orderStatus.charAt(0).toUpperCase() + selectedOrder.orderStatus.slice(1)}
//                   </span>
//                 );
//               })()}

//               {/* Order Items */}
//               <div>
//                 <p className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-3">Items</p>
//                 <div className="space-y-2.5">
//                   {selectedOrder.orderItems.map((item, i) => (
//                     <div key={i} className="flex items-center gap-3 bg-gray-50 rounded-xl p-3">
//                       <img src={item.image} alt={item.productTitle}
//                         className="w-12 h-12 rounded-lg object-cover bg-gray-100 shrink-0" />
//                       <div className="flex-1 min-w-0">
//                         <p className="text-sm font-semibold text-gray-700 line-clamp-1">{item.productTitle}</p>
//                         <p className="text-xs text-gray-400">Qty: {item.quantity} × ৳{item.price?.toLocaleString()}</p>
//                       </div>
//                       <span className="text-sm font-bold text-gray-700 shrink-0">৳{item.subTotal?.toLocaleString()}</span>
//                     </div>
//                   ))}
//                 </div>
//               </div>

//               {/* Pricing */}
//               <div className="bg-gray-50 rounded-2xl p-4 space-y-2">
//                 <div className="flex justify-between text-sm text-gray-500">
//                   <span>Subtotal</span>
//                   <span>৳{selectedOrder.subTotal?.toLocaleString()}</span>
//                 </div>
//                 <div className="flex justify-between text-sm text-gray-500">
//                   <span>Shipping</span>
//                   <span>{selectedOrder.shippingCost === 0 ? "Free" : `৳${selectedOrder.shippingCost}`}</span>
//                 </div>
//                 <div className="flex justify-between font-bold text-gray-800 pt-2 border-t border-gray-200">
//                   <span>Total</span>
//                   <span className="text-indigo-600">৳{selectedOrder.totalPrice?.toLocaleString()}</span>
//                 </div>
//               </div>

//               {/* Shipping Address */}
//               <div>
//                 <p className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-3">Shipping Address</p>
//                 <div className="bg-gray-50 rounded-2xl p-4 text-sm text-gray-600 space-y-1">
//                   <p className="font-semibold text-gray-800">
//                     {selectedOrder.shippingAddress.firstName} {selectedOrder.shippingAddress.lastName}
//                   </p>
//                   <p>{selectedOrder.shippingAddress.street1}</p>
//                   {selectedOrder.shippingAddress.street2 && <p>{selectedOrder.shippingAddress.street2}</p>}
//                   <p>{selectedOrder.shippingAddress.city}, {selectedOrder.shippingAddress.state} {selectedOrder.shippingAddress.zipCode}</p>
//                   <p>{selectedOrder.shippingAddress.country}</p>
//                   <p className="text-indigo-500">{selectedOrder.shippingAddress.phone}</p>
//                   <p className="text-indigo-500">{selectedOrder.shippingAddress.email}</p>
//                 </div>
//               </div>

//               {/* Payment Info */}
//               <div className="grid grid-cols-2 gap-3">
//                 {[
//                   ["Payment Method", selectedOrder.paymentMethod],
//                   ["Payment Status", selectedOrder.paymentStatus],
//                   ["Shipping Method", selectedOrder.shippingMethod],
//                   ["Order Date", new Date(selectedOrder.createdAt).toLocaleDateString("en-GB")],
//                 ].map(([k, v]) => (
//                   <div key={k} className="bg-gray-50 rounded-xl px-4 py-3">
//                     <p className="text-xs text-gray-400 mb-0.5">{k}</p>
//                     <p className="text-sm font-semibold text-gray-700 capitalize">{v}</p>
//                   </div>
//                 ))}
//               </div>

//               {/* Cancel button in modal */}
//               {!["shipped", "delivered", "cancelled"].includes(selectedOrder.orderStatus) && (
//                 <button
//                   onClick={() => handleCancel(selectedOrder._id)}
//                   disabled={cancellingId === selectedOrder._id}
//                   className="w-full py-3 rounded-2xl border-2 border-red-200 text-red-500 text-sm font-bold hover:bg-red-50 transition-all disabled:opacity-40 flex items-center justify-center gap-2"
//                 >
//                   {cancellingId === selectedOrder._id
//                     ? <><Loader2 size={15} className="animate-spin" /> Cancelling...</>
//                     : "Cancel Order"
//                   }
//                 </button>
//               )}

//             </div>
//           </div>
//         </div>
//       )}
//     </div>
//   );
// };

// export default Orders;









// import { useState, useEffect } from "react";
// import { useAuth } from "../../context/AuthContext";
// import { getMyOrdersApi, cancelOrderApi } from "../../utils/api/orderApi";
// import { Package, ChevronRight, X, Loader2, ShoppingBag } from "lucide-react";
// import { Link } from "react-router-dom";
// import toast from "react-hot-toast";

// const statusConfig = {
//   processing: { bg: "bg-blue-100",    text: "text-blue-700",    dot: "bg-blue-500"    },
//   confirmed:  { bg: "bg-indigo-100",  text: "text-indigo-700",  dot: "bg-indigo-500"  },
//   shipped:    { bg: "bg-violet-100",  text: "text-violet-700",  dot: "bg-violet-500"  },
//   delivered:  { bg: "bg-emerald-100", text: "text-emerald-700", dot: "bg-emerald-500" },
//   cancelled:  { bg: "bg-red-100",     text: "text-red-700",     dot: "bg-red-400"     },
// };

// const Orders = () => {
//   const { token } = useAuth();
//   const [orders, setOrders]               = useState([]);
//   const [loading, setLoading]             = useState(true);
//   const [selectedOrder, setSelectedOrder] = useState(null);
//   const [cancellingId, setCancellingId]   = useState(null);
//   const [filterStatus, setFilterStatus]   = useState("all");
//   const [search, setSearch]               = useState("");

//   useEffect(() => {
//     fetchOrders();
//   }, []);

//   const fetchOrders = async () => {
//     setLoading(true);
//     try {
//       const data = await getMyOrdersApi(token);
//       setOrders(data.orders || []);
//     } catch {
//       toast.error("Failed to load orders");
//     } finally {
//       setLoading(false);
//     }
//   };

//   const handleCancel = async (orderId) => {
//     setCancellingId(orderId);
//     try {
//       await cancelOrderApi(orderId, token);
//       setOrders((prev) =>
//         prev.map((o) => o._id === orderId ? { ...o, orderStatus: "cancelled" } : o)
//       );
//       if (selectedOrder?._id === orderId) {
//         setSelectedOrder((prev) => ({ ...prev, orderStatus: "cancelled" }));
//       }
//       toast.success("Order cancelled");
//     } catch (err) {
//       toast.error(err.response?.data?.message || "Failed to cancel order");
//     } finally {
//       setCancellingId(null);
//     }
//   };

//   const filtered = orders.filter((o) => {
//     const matchStatus = filterStatus === "all" || o.orderStatus === filterStatus;
//     const matchSearch =
//       o._id.toLowerCase().includes(search.toLowerCase()) ||
//       o.shippingAddress?.firstName?.toLowerCase().includes(search.toLowerCase());
//     return matchStatus && matchSearch;
//   });

//   const SkeletonRow = () => (
//     <div className="bg-white rounded-2xl p-5 border border-gray-100 space-y-3">
//       <div className="flex justify-between">
//         <div className="h-4 w-32 bg-gray-100 rounded-full animate-pulse" />
//         <div className="h-6 w-20 bg-gray-100 rounded-full animate-pulse" />
//       </div>
//       <div className="h-3 w-48 bg-gray-100 rounded-full animate-pulse" />
//       <div className="h-4 w-24 bg-gray-100 rounded-full animate-pulse" />
//     </div>
//   );

//   return (
//     <div className="min-h-screen bg-gray-50 py-10 px-4 sm:px-6">
//       <div className="max-w-4xl mx-auto">

//         {/* Header */}
//         <div className="mb-8">
//           <p className="text-xs font-bold text-indigo-500 uppercase tracking-widest mb-1">My Account</p>
//           <h1 className="text-4xl font-extrabold text-gray-900">My Orders</h1>
//         </div>

//         {/* Filters */}
//         <div className="flex flex-wrap items-center gap-3 mb-6">
//           <div className="relative flex-1 min-w-48">
//             <input
//               type="text"
//               placeholder="Search by order ID or name..."
//               value={search}
//               onChange={(e) => setSearch(e.target.value)}
//               className="w-full pl-4 pr-4 py-2.5 text-sm bg-white border border-gray-200 rounded-xl outline-none focus:border-indigo-300 focus:ring-2 focus:ring-indigo-100 transition-all"
//             />
//           </div>
//           <div className="flex gap-2 flex-wrap">
//             {["all", "processing", "confirmed", "shipped", "delivered", "cancelled"].map((s) => (
//               <button
//                 key={s}
//                 onClick={() => setFilterStatus(s)}
//                 className={`px-3 py-2 rounded-xl text-xs font-semibold capitalize transition-all
//                   ${filterStatus === s
//                     ? "bg-gray-900 text-white"
//                     : "bg-white border border-gray-200 text-gray-500 hover:border-gray-300"
//                   }`}
//               >
//                 {s}
//               </button>
//             ))}
//           </div>
//         </div>

//         {/* Loading */}
//         {loading && (
//           <div className="space-y-3">
//             {[...Array(3)].map((_, i) => <SkeletonRow key={i} />)}
//           </div>
//         )}

//         {/* Empty */}
//         {!loading && orders.length === 0 && (
//           <div className="flex flex-col items-center justify-center py-24 text-center">
//             <div className="w-20 h-20 rounded-2xl bg-indigo-50 flex items-center justify-center mb-5">
//               <ShoppingBag size={36} className="text-indigo-400" />
//             </div>
//             <h2 className="text-xl font-bold text-gray-700 mb-1">No orders yet</h2>
//             <p className="text-gray-400 text-sm mb-6">Start shopping to see your orders here.</p>
//             <Link to="/" className="px-6 py-3 bg-indigo-600 text-white rounded-full text-sm font-semibold hover:bg-indigo-700 transition-all">
//               Start Shopping
//             </Link>
//           </div>
//         )}

//         {/* Orders list */}
//         {!loading && filtered.length > 0 && (
//           <div className="space-y-3">
//             {filtered.map((order) => {
//               const sc = statusConfig[order.orderStatus] || statusConfig.processing;
//               return (
//                 <div key={order._id}
//                   className="bg-white rounded-2xl border border-gray-100 shadow-sm hover:shadow-md transition-all duration-200 overflow-hidden"
//                 >
//                   <div className="p-5">
//                     <div className="flex items-start justify-between gap-4 flex-wrap">

//                       {/* Left */}
//                       <div className="flex-1 min-w-0">
//                         <div className="flex items-center gap-2 mb-2 flex-wrap">
//                           <span className="text-xs font-mono text-indigo-500 bg-indigo-50 px-2 py-0.5 rounded-lg">
//                             #{order._id.slice(-8).toUpperCase()}
//                           </span>
//                           <span className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-semibold ${sc.bg} ${sc.text}`}>
//                             <span className={`w-1.5 h-1.5 rounded-full ${sc.dot}`} />
//                             {order.orderStatus.charAt(0).toUpperCase() + order.orderStatus.slice(1)}
//                           </span>
//                         </div>

//                         {/* Products */}
//                         <div className="flex items-center gap-2 mb-3">
//                           <div className="flex -space-x-2">
//                             {order.orderItems.slice(0, 3).map((item, i) => (
//                               <img key={i} src={item.image} alt={item.productTitle}
//                                 className="w-9 h-9 rounded-lg object-cover border-2 border-white bg-gray-100" />
//                             ))}
//                             {order.orderItems.length > 3 && (
//                               <div className="w-9 h-9 rounded-lg bg-gray-100 border-2 border-white flex items-center justify-center text-[10px] font-bold text-gray-500">
//                                 +{order.orderItems.length - 3}
//                               </div>
//                             )}
//                           </div>
//                           <span className="text-xs text-gray-400">
//                             {order.orderItems.length} item{order.orderItems.length !== 1 ? "s" : ""}
//                           </span>
//                         </div>

//                         <div className="flex items-center gap-4 text-xs text-gray-400 flex-wrap">
//                           <span>{new Date(order.createdAt).toLocaleDateString("en-GB", { day: "numeric", month: "short", year: "numeric" })}</span>
//                           <span className="capitalize">{order.paymentMethod} · {order.paymentStatus}</span>
//                         </div>
//                       </div>

//                       {/* Right */}
//                       <div className="flex flex-col items-end gap-3">
//                         <span className="text-xl font-black text-gray-800">
//                           ৳{order.totalPrice?.toLocaleString()}
//                         </span>
//                         <div className="flex items-center gap-2">
//                           {!["shipped", "delivered", "cancelled"].includes(order.orderStatus) && (
//                             <button
//                               onClick={() => handleCancel(order._id)}
//                               disabled={cancellingId === order._id}
//                               className="text-xs text-red-400 hover:text-red-600 font-semibold transition-colors disabled:opacity-40 flex items-center gap-1"
//                             >
//                               {cancellingId === order._id
//                                 ? <Loader2 size={12} className="animate-spin" />
//                                 : <X size={12} />
//                               }
//                               Cancel
//                             </button>
//                           )}
//                           <button
//                             onClick={() => setSelectedOrder(order)}
//                             className="flex items-center gap-1 text-xs text-indigo-500 hover:text-indigo-700 font-semibold transition-colors"
//                           >
//                             Details <ChevronRight size={13} />
//                           </button>
//                         </div>
//                       </div>

//                     </div>
//                   </div>
//                 </div>
//               );
//             })}
//           </div>
//         )}

//         {/* No filter results */}
//         {!loading && orders.length > 0 && filtered.length === 0 && (
//           <div className="text-center py-16 text-gray-400 text-sm">
//             No orders match your search.
//           </div>
//         )}

//       </div>

//       {/* ── DETAIL MODAL ── */}
//       {selectedOrder && (
//         <div
//           className="fixed inset-0 bg-black/40 backdrop-blur-sm z-50 flex items-center justify-center p-4"
//           onClick={() => setSelectedOrder(null)}
//         >
//           <div
//             className="bg-white rounded-3xl w-full max-w-lg shadow-2xl overflow-hidden max-h-[90vh] overflow-y-auto"
//             onClick={(e) => e.stopPropagation()}
//           >
//             {/* Modal Header */}
//             <div className="px-6 py-5 border-b border-gray-100 flex items-center justify-between sticky top-0 bg-white z-10">
//               <div>
//                 <p className="text-xs text-gray-400 mb-0.5">Order Details</p>
//                 <h2 className="text-base font-bold text-gray-800">
//                   #{selectedOrder._id.slice(-8).toUpperCase()}
//                 </h2>
//               </div>
//               <button onClick={() => setSelectedOrder(null)}
//                 className="w-8 h-8 rounded-xl bg-gray-100 flex items-center justify-center hover:bg-gray-200 transition-colors">
//                 <X size={15} className="text-gray-500" />
//               </button>
//             </div>

//             <div className="p-6 space-y-5">

//               {/* Status */}
//               {(() => {
//                 const sc = statusConfig[selectedOrder.orderStatus] || statusConfig.processing;
//                 return (
//                   <span className={`inline-flex items-center gap-2 px-3 py-1.5 rounded-full text-sm font-semibold ${sc.bg} ${sc.text}`}>
//                     <span className={`w-2 h-2 rounded-full ${sc.dot}`} />
//                     {selectedOrder.orderStatus.charAt(0).toUpperCase() + selectedOrder.orderStatus.slice(1)}
//                   </span>
//                 );
//               })()}

//               {/* Order Items */}
//               <div>
//                 <p className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-3">Items</p>
//                 <div className="space-y-2.5">
//                   {selectedOrder.orderItems.map((item, i) => (
//                     <div key={i} className="flex items-center gap-3 bg-gray-50 rounded-xl p-3">
//                       <img src={item.image} alt={item.productTitle}
//                         className="w-12 h-12 rounded-lg object-cover bg-gray-100 shrink-0" />
//                       <div className="flex-1 min-w-0">
//                         <p className="text-sm font-semibold text-gray-700 line-clamp-1">{item.productTitle}</p>
//                         <p className="text-xs text-gray-400">Qty: {item.quantity} × ৳{item.price?.toLocaleString()}</p>
//                       </div>
//                       <span className="text-sm font-bold text-gray-700 shrink-0">৳{item.subTotal?.toLocaleString()}</span>
//                     </div>
//                   ))}
//                 </div>
//               </div>

//               {/* Pricing */}
//               <div className="bg-gray-50 rounded-2xl p-4 space-y-2">
//                 <div className="flex justify-between text-sm text-gray-500">
//                   <span>Subtotal</span>
//                   <span>৳{selectedOrder.subTotal?.toLocaleString()}</span>
//                 </div>
//                 <div className="flex justify-between text-sm text-gray-500">
//                   <span>Shipping</span>
//                   <span>{selectedOrder.shippingCost === 0 ? "Free" : `৳${selectedOrder.shippingCost}`}</span>
//                 </div>
//                 <div className="flex justify-between font-bold text-gray-800 pt-2 border-t border-gray-200">
//                   <span>Total</span>
//                   <span className="text-indigo-600">৳{selectedOrder.totalPrice?.toLocaleString()}</span>
//                 </div>
//               </div>

//               {/* Shipping Address */}
//               <div>
//                 <p className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-3">Shipping Address</p>
//                 <div className="bg-gray-50 rounded-2xl p-4 text-sm text-gray-600 space-y-1">
//                   <p className="font-semibold text-gray-800">
//                     {selectedOrder.shippingAddress.firstName} {selectedOrder.shippingAddress.lastName}
//                   </p>
//                   <p>{selectedOrder.shippingAddress.street1}</p>
//                   {selectedOrder.shippingAddress.street2 && <p>{selectedOrder.shippingAddress.street2}</p>}
//                   <p>{selectedOrder.shippingAddress.city}, {selectedOrder.shippingAddress.state} {selectedOrder.shippingAddress.zipCode}</p>
//                   <p>{selectedOrder.shippingAddress.country}</p>
//                   <p className="text-indigo-500">{selectedOrder.shippingAddress.phone}</p>
//                   <p className="text-indigo-500">{selectedOrder.shippingAddress.email}</p>
//                 </div>
//               </div>

//               {/* Payment Info */}
//               <div className="grid grid-cols-2 gap-3">
//                 {[
//                   ["Payment Method", selectedOrder.paymentMethod],
//                   ["Payment Status", selectedOrder.paymentStatus],
//                   ["Shipping Method", selectedOrder.shippingMethod],
//                   ["Order Date", new Date(selectedOrder.createdAt).toLocaleDateString("en-GB")],
//                 ].map(([k, v]) => (
//                   <div key={k} className="bg-gray-50 rounded-xl px-4 py-3">
//                     <p className="text-xs text-gray-400 mb-0.5">{k}</p>
//                     <p className="text-sm font-semibold text-gray-700 capitalize">{v}</p>
//                   </div>
//                 ))}
//               </div>

//               {/* Cancel button in modal */}
//               {!["shipped", "delivered", "cancelled"].includes(selectedOrder.orderStatus) && (
//                 <button
//                   onClick={() => handleCancel(selectedOrder._id)}
//                   disabled={cancellingId === selectedOrder._id}
//                   className="w-full py-3 rounded-2xl border-2 border-red-200 text-red-500 text-sm font-bold hover:bg-red-50 transition-all disabled:opacity-40 flex items-center justify-center gap-2"
//                 >
//                   {cancellingId === selectedOrder._id
//                     ? <><Loader2 size={15} className="animate-spin" /> Cancelling...</>
//                     : "Cancel Order"
//                   }
//                 </button>
//               )}

//             </div>
//           </div>
//         </div>
//       )}
//     </div>
//   );
// };

// export default Orders;