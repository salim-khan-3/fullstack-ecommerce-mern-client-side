import React, { useState } from 'react';

const sampleOrders = [
  {
    orderId: "ORD-2024-001",
    paymentId: "PAY-8821",
    products: ["Nike Air Max", "Adidas Tee"],
    name: "Arif Rahman",
    phone: "+880 1712-345678",
    address: "House 12, Road 5, Dhanmondi",
    pincode: "1205",
    totalAmount: 4850,
    email: "arif@gmail.com",
    userId: "USR-441",
    orderStatus: "Delivered",
    date: "2024-03-10",
  },
  {
    orderId: "ORD-2024-002",
    paymentId: "PAY-9934",
    products: ["Samsung Watch"],
    name: "Nadia Islam",
    phone: "+880 1855-667788",
    address: "Apt 4B, Mirpur-10",
    pincode: "1216",
    totalAmount: 12500,
    email: "nadia.islam@yahoo.com",
    userId: "USR-882",
    orderStatus: "Processing",
    date: "2024-03-11",
  },
  {
    orderId: "ORD-2024-003",
    paymentId: "PAY-7712",
    products: ["Levi's Jeans", "Polo Shirt", "Belt"],
    name: "Tanvir Hossain",
    phone: "+880 1933-112233",
    address: "Block C, Uttara Sector 7",
    pincode: "1230",
    totalAmount: 6200,
    email: "tanvir.h@outlook.com",
    userId: "USR-229",
    orderStatus: "Shipped",
    date: "2024-03-09",
  },
  {
    orderId: "ORD-2024-004",
    paymentId: "PAY-6650",
    products: ["iPhone Case"],
    name: "Sumaiya Akter",
    phone: "+880 1611-998877",
    address: "Road 3, Bashundhara R/A",
    pincode: "1229",
    totalAmount: 890,
    email: "sumaiya.a@gmail.com",
    userId: "USR-557",
    orderStatus: "Cancelled",
    date: "2024-03-08",
  },
  {
    orderId: "ORD-2024-005",
    paymentId: "PAY-5541",
    products: ["Puma Sneakers", "Sports Bag"],
    name: "Rakib Uddin",
    phone: "+880 1744-556677",
    address: "Lane 9, Gulshan-2",
    pincode: "1212",
    totalAmount: 9300,
    email: "rakib.uddin@gmail.com",
    userId: "USR-773",
    orderStatus: "Pending",
    date: "2024-03-12",
  },
];

const statusConfig = {
  Delivered: { bg: "bg-emerald-100", text: "text-emerald-700", dot: "bg-emerald-500" },
  Processing: { bg: "bg-blue-100", text: "text-blue-700", dot: "bg-blue-500" },
  Shipped: { bg: "bg-violet-100", text: "text-violet-700", dot: "bg-violet-500" },
  Cancelled: { bg: "bg-red-100", text: "text-red-700", dot: "bg-red-400" },
  Pending: { bg: "bg-amber-100", text: "text-amber-700", dot: "bg-amber-500" },
};

const Orders = () => {
  const [search, setSearch] = useState("");
  const [filterStatus, setFilterStatus] = useState("All");
  const [selectedOrder, setSelectedOrder] = useState(null);

  const filtered = sampleOrders.filter((o) => {
    const matchSearch =
      o.orderId.toLowerCase().includes(search.toLowerCase()) ||
      o.name.toLowerCase().includes(search.toLowerCase()) ||
      o.email.toLowerCase().includes(search.toLowerCase());
    const matchStatus = filterStatus === "All" || o.orderStatus === filterStatus;
    return matchSearch && matchStatus;
  });

  const totalRevenue = sampleOrders.reduce((s, o) => s + o.totalAmount, 0);

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 font-sans" style={{ fontFamily: "'DM Sans', sans-serif" }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@300;400;500;600;700&family=Space+Grotesk:wght@400;600;700&display=swap');
        * { box-sizing: border-box; }
        .stat-card { background: linear-gradient(135deg, rgba(255,255,255,0.05) 0%, rgba(255,255,255,0.02) 100%); border: 1px solid rgba(255,255,255,0.08); }
        .table-row:hover { background: rgba(255,255,255,0.04); transition: background 0.15s; }
        .glow-dot { box-shadow: 0 0 6px currentColor; }
        .modal-bg { backdrop-filter: blur(8px); background: rgba(2, 6, 23, 0.85); }
        .tag { background: rgba(255,255,255,0.06); border: 1px solid rgba(255,255,255,0.1); }
      `}</style>

      {/* Header */}
      <div className="border-b border-slate-800 px-8 py-5 flex items-center justify-between">
        <div>
          <p className="text-xs text-slate-500 uppercase tracking-widest mb-1">Dashboard</p>
          <h1 className="text-2xl font-bold tracking-tight" style={{ fontFamily: "'Space Grotesk', sans-serif" }}>
            Orders
          </h1>
        </div>
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-full bg-gradient-to-br from-violet-500 to-blue-500 flex items-center justify-center text-xs font-bold">A</div>
          <span className="text-sm text-slate-400">Admin</span>
        </div>
      </div>

      <div className="px-8 py-6 space-y-6">
        {/* Stats */}
        <div className="grid grid-cols-4 gap-4">
          {[
            { label: "Total Orders", value: sampleOrders.length, accent: "text-blue-400" },
            { label: "Revenue", value: `৳${totalRevenue.toLocaleString()}`, accent: "text-emerald-400" },
            { label: "Delivered", value: sampleOrders.filter(o => o.orderStatus === "Delivered").length, accent: "text-emerald-400" },
            { label: "Pending / Processing", value: sampleOrders.filter(o => ["Pending", "Processing"].includes(o.orderStatus)).length, accent: "text-amber-400" },
          ].map((s) => (
            <div key={s.label} className="stat-card rounded-xl p-4">
              <p className="text-xs text-slate-500 mb-1">{s.label}</p>
              <p className={`text-2xl font-bold ${s.accent}`} style={{ fontFamily: "'Space Grotesk', sans-serif" }}>{s.value}</p>
            </div>
          ))}
        </div>

        {/* Filters */}
        <div className="flex items-center gap-3 flex-wrap">
          <div className="relative flex-1 min-w-64">
            <svg className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-4.35-4.35M11 19A8 8 0 1011 3a8 8 0 000 16z" />
            </svg>
            <input
              className="w-full bg-slate-900 border border-slate-800 rounded-lg pl-10 pr-4 py-2.5 text-sm text-slate-200 placeholder-slate-600 focus:outline-none focus:border-slate-600"
              placeholder="Search order, name, email…"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>
          <div className="flex gap-2">
            {["All", "Pending", "Processing", "Shipped", "Delivered", "Cancelled"].map((s) => (
              <button
                key={s}
                onClick={() => setFilterStatus(s)}
                className={`px-3 py-2 rounded-lg text-xs font-medium transition-all ${
                  filterStatus === s
                    ? "bg-slate-100 text-slate-900"
                    : "bg-slate-900 border border-slate-800 text-slate-400 hover:border-slate-600"
                }`}
              >
                {s}
              </button>
            ))}
          </div>
        </div>

        {/* Table */}
        <div className="rounded-xl border border-slate-800 overflow-hidden">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-slate-800 bg-slate-900">
                {["Order ID", "Payment ID", "Products", "Customer", "Phone", "Address", "Amount", "Status", "Date", ""].map((h) => (
                  <th key={h} className="px-4 py-3 text-left text-xs font-semibold text-slate-500 uppercase tracking-wider whitespace-nowrap">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {filtered.length === 0 ? (
                <tr><td colSpan={10} className="text-center py-16 text-slate-600">No orders found</td></tr>
              ) : (
                filtered.map((order) => {
                  const sc = statusConfig[order.orderStatus];
                  return (
                    <tr key={order.orderId} className="table-row border-b border-slate-800/60 last:border-0">
                      <td className="px-4 py-3.5">
                        <span className="font-mono text-xs text-blue-400">{order.orderId}</span>
                      </td>
                      <td className="px-4 py-3.5">
                        <span className="font-mono text-xs text-slate-500">{order.paymentId}</span>
                      </td>
                      <td className="px-4 py-3.5 max-w-36">
                        <div className="flex flex-wrap gap-1">
                          {order.products.map((p) => (
                            <span key={p} className="tag rounded text-xs px-1.5 py-0.5 text-slate-300">{p}</span>
                          ))}
                        </div>
                      </td>
                      <td className="px-4 py-3.5">
                        <p className="font-medium text-slate-200">{order.name}</p>
                        <p className="text-xs text-slate-600">{order.email}</p>
                      </td>
                      <td className="px-4 py-3.5 text-slate-400 whitespace-nowrap">{order.phone}</td>
                      <td className="px-4 py-3.5 text-slate-500 text-xs max-w-32 truncate">{order.address}</td>
                      <td className="px-4 py-3.5">
                        <span className="font-semibold text-slate-200">৳{order.totalAmount.toLocaleString()}</span>
                      </td>
                      <td className="px-4 py-3.5">
                        <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium ${sc.bg} ${sc.text}`}>
                          <span className={`w-1.5 h-1.5 rounded-full ${sc.dot} glow-dot`}></span>
                          {order.orderStatus}
                        </span>
                      </td>
                      <td className="px-4 py-3.5 text-slate-500 text-xs whitespace-nowrap">{order.date}</td>
                      <td className="px-4 py-3.5">
                        <button
                          onClick={() => setSelectedOrder(order)}
                          className="text-slate-600 hover:text-slate-300 transition-colors"
                        >
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                          </svg>
                        </button>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>

        <div className="flex items-center justify-between text-xs text-slate-600">
          <span>Showing {filtered.length} of {sampleOrders.length} orders</span>
          <span>Last updated: just now</span>
        </div>
      </div>

      {/* Detail Modal */}
      {selectedOrder && (
        <div className="fixed inset-0 modal-bg z-50 flex items-center justify-center p-4" onClick={() => setSelectedOrder(null)}>
          <div className="bg-slate-900 border border-slate-700 rounded-2xl p-6 max-w-lg w-full shadow-2xl" onClick={(e) => e.stopPropagation()}>
            <div className="flex items-start justify-between mb-5">
              <div>
                <p className="text-xs text-slate-500 mb-1">Order Details</p>
                <h2 className="text-lg font-bold text-slate-100" style={{ fontFamily: "'Space Grotesk', sans-serif" }}>{selectedOrder.orderId}</h2>
              </div>
              <button onClick={() => setSelectedOrder(null)} className="text-slate-600 hover:text-slate-300 transition-colors">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
            <div className="grid grid-cols-2 gap-3">
              {[
                ["Customer", selectedOrder.name],
                ["Email", selectedOrder.email],
                ["Phone", selectedOrder.phone],
                ["User ID", selectedOrder.userId],
                ["Payment ID", selectedOrder.paymentId],
                ["Date", selectedOrder.date],
                ["Pincode", selectedOrder.pincode],
                ["Total Amount", `৳${selectedOrder.totalAmount.toLocaleString()}`],
              ].map(([k, v]) => (
                <div key={k} className="bg-slate-800/60 rounded-lg px-3 py-2.5">
                  <p className="text-xs text-slate-500 mb-0.5">{k}</p>
                  <p className="text-sm text-slate-200 font-medium">{v}</p>
                </div>
              ))}
              <div className="col-span-2 bg-slate-800/60 rounded-lg px-3 py-2.5">
                <p className="text-xs text-slate-500 mb-0.5">Address</p>
                <p className="text-sm text-slate-200">{selectedOrder.address}</p>
              </div>
              <div className="col-span-2 bg-slate-800/60 rounded-lg px-3 py-2.5">
                <p className="text-xs text-slate-500 mb-1.5">Products</p>
                <div className="flex flex-wrap gap-1.5">
                  {selectedOrder.products.map((p) => (
                    <span key={p} className="tag rounded-md text-xs px-2 py-1 text-slate-300">{p}</span>
                  ))}
                </div>
              </div>
              <div className="col-span-2">
                {(() => {
                  const sc = statusConfig[selectedOrder.orderStatus];
                  return (
                    <span className={`inline-flex items-center gap-2 px-3 py-1.5 rounded-full text-sm font-medium ${sc.bg} ${sc.text}`}>
                      <span className={`w-2 h-2 rounded-full ${sc.dot}`}></span>
                      {selectedOrder.orderStatus}
                    </span>
                  );
                })()}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Orders;