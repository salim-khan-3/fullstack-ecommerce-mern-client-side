import { useState, useEffect, useRef } from "react";
import imageCompression from 'browser-image-compression';
import {
  User, Mail, Phone, Lock, Eye, EyeOff,
  Package, Heart, MapPin, ChevronRight,
  Camera, Check, Loader2, ShoppingBag,
} from "lucide-react";
import { Link } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import { getMyOrdersApi } from "../../utils/api/orderApi";
import { getMyList } from "../../utils/api/myListApi";
import toast from "react-hot-toast";
import axiosInstance from "../../utils/api/axiosInstance";

const MyAccount = () => {
  const { user, token, updateUser } = useAuth();

  // ── Profile state ──
  const [profileForm, setProfileForm] = useState({
    name: user?.name || "",
    email: user?.email || "",
    phone: user?.phone || "",
  });
  const [savingProfile, setSavingProfile] = useState(false);
  const [profileSaved, setProfileSaved]   = useState(false);

  // ── Password state ──
  const [passwordForm, setPasswordForm] = useState({
    current: "", newPass: "", confirm: "",
  });
  const [showPass, setShowPass]         = useState({ current: false, newPass: false, confirm: false });
  const [savingPass, setSavingPass]     = useState(false);

  // ── Stats ──
  const [orderCount, setOrderCount]   = useState(0);
  const [wishCount, setWishCount]     = useState(0);
  const [recentOrders, setRecentOrders] = useState([]);
  const [statsLoading, setStatsLoading] = useState(true);

  const [activeTab, setActiveTab] = useState("profile");
  const [imageUploading, setImageUploading] = useState(false);
  const imageFileRef = useRef();

  useEffect(() => {
    fetchStats();
  }, []);

  const fetchStats = async () => {
    setStatsLoading(true);
    try {
      const [ordersData, wishData] = await Promise.all([
        getMyOrdersApi(token),
        getMyList(token),
      ]);
      const orders = ordersData.orders || [];
      setOrderCount(orders.length);
      setRecentOrders(orders.slice(0, 3));
      setWishCount((wishData.myList || []).length);
    } catch {
      // silent fail
    } finally {
      setStatsLoading(false);
    }
  };

  const handleProfileChange = (e) => {
    setProfileForm({ ...profileForm, [e.target.name]: e.target.value });
  };

  const handleProfileSave = async () => {
    if (!profileForm.name.trim()) {
      toast.error("Name is required");
      return;
    }
    setSavingProfile(true);
    try {
      const userId = user?.id || user?._id;
      const res = await axiosInstance.put(`/user/${userId}`, profileForm, {
        headers: { Authorization: `Bearer ${token}` },
      });
      updateUser(res.data.user);
      setProfileSaved(true);
      setTimeout(() => setProfileSaved(false), 2500);
      toast.success("Profile updated");
    } catch {
      toast.error("Failed to update profile");
    } finally {
      setSavingProfile(false);
    }
  };

  const handlePasswordSave = async () => {
    if (!passwordForm.newPass || !passwordForm.confirm) {
      toast.error("Please fill all fields");
      return;
    }
    if (passwordForm.newPass !== passwordForm.confirm) {
      toast.error("Passwords do not match");
      return;
    }
    if (passwordForm.newPass.length < 6) {
      toast.error("Password must be at least 6 characters");
      return;
    }
    setSavingPass(true);
    try {
      const userId = user?.id || user?._id;
      await axiosInstance.put(
        `/user/${userId}`,
        { password: passwordForm.newPass },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setPasswordForm({ current: "", newPass: "", confirm: "" });
      toast.success("Password updated");
    } catch {
      toast.error("Failed to update password");
    } finally {
      setSavingPass(false);
    }
  };

const handleImageUpload = async (e) => {
  const file = e.target.files[0];
  if (!file) return;

  setImageUploading(true);
  try {
    // Compress করো
    const compressed = await imageCompression(file, {
  maxSizeMB: 3,           // 3MB — quality অনেক ভালো থাকবে
  maxWidthOrHeight: 1200, // resolution ও ভালো থাকবে
  useWebWorker: true,
  initialQuality: 0.9,    // 90% quality রাখো
});

    const formData = new FormData();
    formData.append("image", compressed);

    const userId = user?.id || user?._id;
    const res = await axiosInstance.put(`/user/${userId}/image`, formData, {
      headers: { Authorization: `Bearer ${token}`, "Content-Type": "multipart/form-data" },
    });
    updateUser(res.data.user);
    toast.success("Profile picture updated");
  } catch {
    toast.error("Failed to upload image");
  } finally {
    setImageUploading(false);
  }
};
  const avatarLetter = user?.name?.charAt(0).toUpperCase() || "U";

  const statusColors = {
    processing: "bg-blue-100 text-blue-700",
    confirmed:  "bg-indigo-100 text-indigo-700",
    shipped:    "bg-violet-100 text-violet-700",
    delivered:  "bg-emerald-100 text-emerald-700",
    cancelled:  "bg-red-100 text-red-700",
  };

  const tabs = [
    { id: "profile",  label: "Profile",  icon: User    },
    { id: "security", label: "Security", icon: Lock    },
    { id: "orders",   label: "Orders",   icon: Package },
  ];

  return (
    <div className="min-h-screen bg-gray-50 py-10 px-4">
      <div className="container mx-auto">

        {/* ── Top Profile Card ── */}
        <div className="bg-white rounded-3xl p-8 mb-6 shadow-sm border border-gray-100">
          <div className="flex items-center gap-6 flex-wrap">
            {/* Avatar */}
            <div className="relative shrink-0">
              <div className="w-20 h-20 rounded-2xl overflow-hidden bg-gradient-to-br from-violet-500 to-purple-600 flex items-center justify-center text-white text-3xl font-black shadow-md">
                {user?.image
                  ? <img src={user.image} alt="profile" className="w-full h-full object-cover" />
                  : avatarLetter
                }
              </div>
              <button
                onClick={() => imageFileRef.current.click()}
                disabled={imageUploading}
                className="absolute -bottom-1 -right-1 w-7 h-7 rounded-xl bg-white border border-gray-200 flex items-center justify-center shadow-sm hover:scale-110 transition-transform disabled:opacity-50"
              >
                {imageUploading
                  ? <Loader2 size={12} className="animate-spin text-gray-400" />
                  : <Camera size={13} className="text-gray-500" />
                }
              </button>
              <input
                ref={imageFileRef}
                type="file"
                accept="image/*"
                className="hidden"
                onChange={handleImageUpload}
              />
            </div>

            {/* Info */}
            <div className="flex-1">
              <h1 className="text-xl font-black text-gray-900 mb-1">{user?.name}</h1>
              <p className="text-gray-400 text-sm flex items-center gap-1.5">
                <Mail size={13} /> {user?.email}
              </p>
              {user?.phone && (
                <p className="text-gray-400 text-sm flex items-center gap-1.5 mt-0.5">
                  <Phone size={13} /> {user?.phone}
                </p>
              )}
            </div>

            {/* Stats */}
            <div className="flex gap-3 flex-wrap">
              {[
                { label: "Orders",   value: statsLoading ? "—" : orderCount },
                { label: "Wishlist", value: statsLoading ? "—" : wishCount  },
              ].map((s) => (
                <div key={s.label} className="bg-gray-50 border border-gray-100 rounded-2xl px-5 py-3 text-center min-w-[90px]">
                  <p className="text-2xl font-black text-gray-800">{s.value}</p>
                  <p className="text-gray-400 text-xs font-medium">{s.label}</p>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* ── Quick Links ── */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-6">
          {[
            { label: "My Orders",  icon: Package,     to: "/orders",  color: "from-blue-500 to-indigo-600"   },
            { label: "Wishlist",   icon: Heart,       to: "/my-list", color: "from-pink-500 to-rose-600"     },
            { label: "Cart",       icon: ShoppingBag, to: "/cart",    color: "from-amber-500 to-orange-600"  },
            { label: "Address",    icon: MapPin,      to: "#",        color: "from-emerald-500 to-teal-600"  },
          ].map((item) => (
            <Link key={item.label} to={item.to}
              className="group bg-white rounded-2xl p-4 flex items-center gap-3 shadow-sm hover:shadow-md border border-gray-100 transition-all duration-200 hover:-translate-y-0.5">
              <div className={`w-10 h-10 rounded-xl bg-gradient-to-br ${item.color} flex items-center justify-center shrink-0 group-hover:scale-110 transition-transform`}>
                <item.icon size={16} className="text-white" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-bold text-gray-700 truncate">{item.label}</p>
              </div>
              <ChevronRight size={14} className="text-gray-300 shrink-0" />
            </Link>
          ))}
        </div>

        {/* ── Tabs ── */}
        <div className="bg-white rounded-3xl shadow-sm border border-gray-100 overflow-hidden">

          {/* Tab Bar */}
          <div className="flex border-b border-gray-100">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex-1 flex items-center justify-center gap-2 py-4 text-sm font-bold transition-all ${
                  activeTab === tab.id
                    ? "text-violet-600 border-b-2 border-violet-600 bg-violet-50/50"
                    : "text-gray-400 hover:text-gray-600 hover:bg-gray-50"
                }`}
              >
                <tab.icon size={15} />
                <span className="hidden sm:inline">{tab.label}</span>
              </button>
            ))}
          </div>

          <div className="p-6">

            {/* ── Profile Tab ── */}
            {activeTab === "profile" && (
              <div className="w-full space-y-4">
                <div>
                  <p className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-4">Personal Information</p>
                  <div className="space-y-3">
                    {[
                      { label: "Full Name",     name: "name",  icon: User,  type: "text"  },
                      { label: "Email Address", name: "email", icon: Mail,  type: "email" },
                      { label: "Phone Number",  name: "phone", icon: Phone, type: "tel"   },
                    ].map((field) => (
                      <div key={field.name}>
                        <label className="text-xs font-semibold text-gray-500 mb-1.5 block">{field.label}</label>
                        <div className="relative">
                          <field.icon size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" />
                          <input
                            type={field.type}
                            name={field.name}
                            value={profileForm[field.name]}
                            onChange={handleProfileChange}
                            className="w-full pl-10 pr-4 py-3 rounded-xl border border-gray-200 text-sm text-gray-700 font-medium outline-none focus:border-violet-400 focus:ring-2 focus:ring-violet-100 transition-all bg-gray-50 focus:bg-white"
                          />
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                <button
                  onClick={handleProfileSave}
                  disabled={savingProfile}
                  className="w-full py-3.5 rounded-2xl bg-gradient-to-r from-violet-600 to-purple-600 text-white text-sm font-bold hover:opacity-90 transition-all disabled:opacity-50 flex items-center justify-center gap-2 shadow-lg shadow-violet-200"
                >
                  {savingProfile
                    ? <><Loader2 size={15} className="animate-spin" /> Saving...</>
                    : profileSaved
                    ? <><Check size={15} /> Saved!</>
                    : "Save Changes"
                  }
                </button>
              </div>
            )}

            {/* ── Security Tab ── */}
            {activeTab === "security" && (
              <div className="w-full space-y-4">
                <p className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-4">Change Password</p>
                <div className="space-y-3">
                  {[
                    { label: "New Password",     key: "newPass"  },
                    { label: "Confirm Password", key: "confirm"  },
                  ].map((field) => (
                    <div key={field.key}>
                      <label className="text-xs font-semibold text-gray-500 mb-1.5 block">{field.label}</label>
                      <div className="relative">
                        <Lock size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" />
                        <input
                          type={showPass[field.key] ? "text" : "password"}
                          value={passwordForm[field.key]}
                          onChange={(e) => setPasswordForm({ ...passwordForm, [field.key]: e.target.value })}
                          className="w-full pl-10 pr-10 py-3 rounded-xl border border-gray-200 text-sm text-gray-700 font-medium outline-none focus:border-violet-400 focus:ring-2 focus:ring-violet-100 transition-all bg-gray-50 focus:bg-white"
                          placeholder="••••••••"
                        />
                        <button
                          type="button"
                          onClick={() => setShowPass({ ...showPass, [field.key]: !showPass[field.key] })}
                          className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                        >
                          {showPass[field.key] ? <EyeOff size={15} /> : <Eye size={15} />}
                        </button>
                      </div>
                    </div>
                  ))}
                </div>

                <div className="bg-amber-50 border border-amber-200 rounded-2xl p-4">
                  <p className="text-xs font-semibold text-amber-700">Password must be at least 6 characters long.</p>
                </div>

                <button
                  onClick={handlePasswordSave}
                  disabled={savingPass}
                  className="w-full py-3.5 rounded-2xl bg-gradient-to-r from-violet-600 to-purple-600 text-white text-sm font-bold hover:opacity-90 transition-all disabled:opacity-50 flex items-center justify-center gap-2 shadow-lg shadow-violet-200"
                >
                  {savingPass
                    ? <><Loader2 size={15} className="animate-spin" /> Updating...</>
                    : "Update Password"
                  }
                </button>
              </div>
            )}

            {/* ── Orders Tab ── */}
            {activeTab === "orders" && (
              <div>
                <div className="flex items-center justify-between mb-4">
                  <p className="text-xs font-bold text-gray-400 uppercase tracking-wider">Recent Orders</p>
                  <Link to="/orders" className="text-xs font-bold text-violet-600 hover:text-violet-800 flex items-center gap-1">
                    View All <ChevronRight size={13} />
                  </Link>
                </div>

                {statsLoading ? (
                  <div className="space-y-3">
                    {[...Array(3)].map((_, i) => (
                      <div key={i} className="h-20 bg-gray-100 rounded-2xl animate-pulse" />
                    ))}
                  </div>
                ) : recentOrders.length === 0 ? (
                  <div className="flex flex-col items-center justify-center py-16 text-center">
                    <div className="w-16 h-16 rounded-2xl bg-violet-50 flex items-center justify-center mb-3">
                      <Package size={28} className="text-violet-400" />
                    </div>
                    <p className="text-gray-600 font-bold mb-1">No orders yet</p>
                    <p className="text-gray-400 text-xs mb-4">Start shopping to see your orders here</p>
                    <Link to="/"
                      className="px-5 py-2.5 bg-gradient-to-r from-violet-600 to-purple-600 text-white rounded-full text-xs font-bold hover:opacity-90 transition-all">
                      Shop Now
                    </Link>
                  </div>
                ) : (
                  <div className="space-y-3">
                    {recentOrders.map((order) => {
                      const sc = statusColors[order.orderStatus] || "bg-gray-100 text-gray-600";
                      return (
                        <div key={order._id} className="flex items-center gap-4 p-4 bg-gray-50 rounded-2xl hover:bg-gray-100 transition-colors">
                          {/* Images */}
                          <div className="flex -space-x-2 shrink-0">
                            {order.orderItems.slice(0, 2).map((item, i) => (
                              <img key={i} src={item.image} alt={item.productTitle}
                                className="w-10 h-10 rounded-xl object-cover border-2 border-white bg-gray-200" />
                            ))}
                          </div>
                          <div className="flex-1 min-w-0">
                            <p className="text-xs font-mono font-bold text-violet-500">
                              #{order._id.slice(-8).toUpperCase()}
                            </p>
                            <p className="text-xs text-gray-400 mt-0.5">
                              {order.orderItems.length} item{order.orderItems.length !== 1 ? "s" : ""} ·{" "}
                              {new Date(order.createdAt).toLocaleDateString("en-GB", { day: "numeric", month: "short" })}
                            </p>
                          </div>
                          <div className="text-right shrink-0">
                            <p className="text-sm font-black text-gray-800">৳{order.totalPrice?.toLocaleString()}</p>
                            <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full capitalize ${sc}`}>
                              {order.orderStatus}
                            </span>
                          </div>
                        </div>
                      );
                    })}
                    <Link to="/orders"
                      className="flex items-center justify-center gap-2 w-full py-3 rounded-2xl border-2 border-dashed border-violet-200 text-violet-500 text-sm font-bold hover:bg-violet-50 transition-colors mt-2">
                      View All Orders <ChevronRight size={14} />
                    </Link>
                  </div>
                )}
              </div>
            )}

          </div>
        </div>

      </div>
    </div>
  );
};

export default MyAccount;



















// import { useState, useEffect } from "react";
// import {
//   User, Mail, Phone, Lock, Eye, EyeOff,
//   Package, Heart, MapPin, ChevronRight,
//   Camera, Check, Loader2, ShoppingBag,
// } from "lucide-react";
// import { Link } from "react-router-dom";
// import { useAuth } from "../../context/AuthContext";
// import { getMyOrdersApi } from "../../utils/api/orderApi";
// import { getMyList } from "../../utils/api/myListApi";
// import toast from "react-hot-toast";
// import axiosInstance from "../../utils/api/axiosInstance";

// const MyAccount = () => {
//   const { user, token, updateUser } = useAuth();

//   // ── Profile state ──
//   const [profileForm, setProfileForm] = useState({
//     name: user?.name || "",
//     email: user?.email || "",
//     phone: user?.phone || "",
//   });
//   const [savingProfile, setSavingProfile] = useState(false);
//   const [profileSaved, setProfileSaved]   = useState(false);

//   // ── Password state ──
//   const [passwordForm, setPasswordForm] = useState({
//     current: "", newPass: "", confirm: "",
//   });
//   const [showPass, setShowPass]         = useState({ current: false, newPass: false, confirm: false });
//   const [savingPass, setSavingPass]     = useState(false);

//   // ── Stats ──
//   const [orderCount, setOrderCount]   = useState(0);
//   const [wishCount, setWishCount]     = useState(0);
//   const [recentOrders, setRecentOrders] = useState([]);
//   const [statsLoading, setStatsLoading] = useState(true);

//   const [activeTab, setActiveTab] = useState("profile");

//   useEffect(() => {
//     fetchStats();
//   }, []);

//   const fetchStats = async () => {
//     setStatsLoading(true);
//     try {
//       const [ordersData, wishData] = await Promise.all([
//         getMyOrdersApi(token),
//         getMyList(token),
//       ]);
//       const orders = ordersData.orders || [];
//       setOrderCount(orders.length);
//       setRecentOrders(orders.slice(0, 3));
//       setWishCount((wishData.myList || []).length);
//     } catch {
//       // silent fail
//     } finally {
//       setStatsLoading(false);
//     }
//   };

//   const handleProfileChange = (e) => {
//     setProfileForm({ ...profileForm, [e.target.name]: e.target.value });
//   };

//   const handleProfileSave = async () => {
//     if (!profileForm.name.trim()) {
//       toast.error("Name is required");
//       return;
//     }
//     setSavingProfile(true);
//     try {
//       const userId = user?.id || user?._id;
//       const res = await axiosInstance.put(`/user/${userId}`, profileForm, {
//         headers: { Authorization: `Bearer ${token}` },
//       });
//       updateUser(res.data.user);
//       setProfileSaved(true);
//       setTimeout(() => setProfileSaved(false), 2500);
//       toast.success("Profile updated");
//     } catch {
//       toast.error("Failed to update profile");
//     } finally {
//       setSavingProfile(false);
//     }
//   };

//   const handlePasswordSave = async () => {
//     if (!passwordForm.newPass || !passwordForm.confirm) {
//       toast.error("Please fill all fields");
//       return;
//     }
//     if (passwordForm.newPass !== passwordForm.confirm) {
//       toast.error("Passwords do not match");
//       return;
//     }
//     if (passwordForm.newPass.length < 6) {
//       toast.error("Password must be at least 6 characters");
//       return;
//     }
//     setSavingPass(true);
//     try {
//       const userId = user?.id || user?._id;
//       await axiosInstance.put(
//         `/user/${userId}`,
//         { password: passwordForm.newPass },
//         { headers: { Authorization: `Bearer ${token}` } }
//       );
//       setPasswordForm({ current: "", newPass: "", confirm: "" });
//       toast.success("Password updated");
//     } catch {
//       toast.error("Failed to update password");
//     } finally {
//       setSavingPass(false);
//     }
//   };

//   const avatarLetter = user?.name?.charAt(0).toUpperCase() || "U";

//   const statusColors = {
//     processing: "bg-blue-100 text-blue-700",
//     confirmed:  "bg-indigo-100 text-indigo-700",
//     shipped:    "bg-violet-100 text-violet-700",
//     delivered:  "bg-emerald-100 text-emerald-700",
//     cancelled:  "bg-red-100 text-red-700",
//   };

//   const tabs = [
//     { id: "profile",  label: "Profile",  icon: User    },
//     { id: "security", label: "Security", icon: Lock    },
//     { id: "orders",   label: "Orders",   icon: Package },
//   ];

//   return (
//     <div className="min-h-screen bg-gray-50 py-10 px-4">
//       <div className="max-w-5xl mx-auto">

//         {/* ── Top Profile Card ── */}
//         <div className="bg-white rounded-3xl p-8 mb-6 shadow-sm border border-gray-100">
//           <div className="flex items-center gap-6 flex-wrap">
//             {/* Avatar */}
//             <div className="relative shrink-0">
//               <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-violet-500 to-purple-600 flex items-center justify-center text-white text-3xl font-black shadow-md">
//                 {avatarLetter}
//               </div>
//               <button className="absolute -bottom-1 -right-1 w-7 h-7 rounded-xl bg-white border border-gray-200 flex items-center justify-center shadow-sm hover:scale-110 transition-transform">
//                 <Camera size={13} className="text-gray-500" />
//               </button>
//             </div>

//             {/* Info */}
//             <div className="flex-1">
//               <h1 className="text-xl font-black text-gray-900 mb-1">{user?.name}</h1>
//               <p className="text-gray-400 text-sm flex items-center gap-1.5">
//                 <Mail size={13} /> {user?.email}
//               </p>
//               {user?.phone && (
//                 <p className="text-gray-400 text-sm flex items-center gap-1.5 mt-0.5">
//                   <Phone size={13} /> {user?.phone}
//                 </p>
//               )}
//             </div>

//             {/* Stats */}
//             <div className="flex gap-3 flex-wrap">
//               {[
//                 { label: "Orders",   value: statsLoading ? "—" : orderCount },
//                 { label: "Wishlist", value: statsLoading ? "—" : wishCount  },
//               ].map((s) => (
//                 <div key={s.label} className="bg-gray-50 border border-gray-100 rounded-2xl px-5 py-3 text-center min-w-[90px]">
//                   <p className="text-2xl font-black text-gray-800">{s.value}</p>
//                   <p className="text-gray-400 text-xs font-medium">{s.label}</p>
//                 </div>
//               ))}
//             </div>
//           </div>
//         </div>

//         {/* ── Quick Links ── */}
//         <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-6">
//           {[
//             { label: "My Orders",  icon: Package,     to: "/orders",  color: "from-blue-500 to-indigo-600"   },
//             { label: "Wishlist",   icon: Heart,       to: "/my-list", color: "from-pink-500 to-rose-600"     },
//             { label: "Cart",       icon: ShoppingBag, to: "/cart",    color: "from-amber-500 to-orange-600"  },
//             { label: "Address",    icon: MapPin,      to: "#",        color: "from-emerald-500 to-teal-600"  },
//           ].map((item) => (
//             <Link key={item.label} to={item.to}
//               className="group bg-white rounded-2xl p-4 flex items-center gap-3 shadow-sm hover:shadow-md border border-gray-100 transition-all duration-200 hover:-translate-y-0.5">
//               <div className={`w-10 h-10 rounded-xl bg-gradient-to-br ${item.color} flex items-center justify-center shrink-0 group-hover:scale-110 transition-transform`}>
//                 <item.icon size={16} className="text-white" />
//               </div>
//               <div className="flex-1 min-w-0">
//                 <p className="text-sm font-bold text-gray-700 truncate">{item.label}</p>
//               </div>
//               <ChevronRight size={14} className="text-gray-300 shrink-0" />
//             </Link>
//           ))}
//         </div>

//         {/* ── Tabs ── */}
//         <div className="bg-white rounded-3xl shadow-sm border border-gray-100 overflow-hidden">

//           {/* Tab Bar */}
//           <div className="flex border-b border-gray-100">
//             {tabs.map((tab) => (
//               <button
//                 key={tab.id}
//                 onClick={() => setActiveTab(tab.id)}
//                 className={`flex-1 flex items-center justify-center gap-2 py-4 text-sm font-bold transition-all ${
//                   activeTab === tab.id
//                     ? "text-violet-600 border-b-2 border-violet-600 bg-violet-50/50"
//                     : "text-gray-400 hover:text-gray-600 hover:bg-gray-50"
//                 }`}
//               >
//                 <tab.icon size={15} />
//                 <span className="hidden sm:inline">{tab.label}</span>
//               </button>
//             ))}
//           </div>

//           <div className="p-6">

//             {/* ── Profile Tab ── */}
//             {activeTab === "profile" && (
//               <div className="max-w-lg mx-auto space-y-4">
//                 <div>
//                   <p className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-4">Personal Information</p>
//                   <div className="space-y-3">
//                     {[
//                       { label: "Full Name",     name: "name",  icon: User,  type: "text"  },
//                       { label: "Email Address", name: "email", icon: Mail,  type: "email" },
//                       { label: "Phone Number",  name: "phone", icon: Phone, type: "tel"   },
//                     ].map((field) => (
//                       <div key={field.name}>
//                         <label className="text-xs font-semibold text-gray-500 mb-1.5 block">{field.label}</label>
//                         <div className="relative">
//                           <field.icon size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" />
//                           <input
//                             type={field.type}
//                             name={field.name}
//                             value={profileForm[field.name]}
//                             onChange={handleProfileChange}
//                             className="w-full pl-10 pr-4 py-3 rounded-xl border border-gray-200 text-sm text-gray-700 font-medium outline-none focus:border-violet-400 focus:ring-2 focus:ring-violet-100 transition-all bg-gray-50 focus:bg-white"
//                           />
//                         </div>
//                       </div>
//                     ))}
//                   </div>
//                 </div>

//                 <button
//                   onClick={handleProfileSave}
//                   disabled={savingProfile}
//                   className="w-full py-3.5 rounded-2xl bg-gradient-to-r from-violet-600 to-purple-600 text-white text-sm font-bold hover:opacity-90 transition-all disabled:opacity-50 flex items-center justify-center gap-2 shadow-lg shadow-violet-200"
//                 >
//                   {savingProfile
//                     ? <><Loader2 size={15} className="animate-spin" /> Saving...</>
//                     : profileSaved
//                     ? <><Check size={15} /> Saved!</>
//                     : "Save Changes"
//                   }
//                 </button>
//               </div>
//             )}

//             {/* ── Security Tab ── */}
//             {activeTab === "security" && (
//               <div className="max-w-lg mx-auto space-y-4">
//                 <p className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-4">Change Password</p>
//                 <div className="space-y-3">
//                   {[
//                     { label: "New Password",     key: "newPass"  },
//                     { label: "Confirm Password", key: "confirm"  },
//                   ].map((field) => (
//                     <div key={field.key}>
//                       <label className="text-xs font-semibold text-gray-500 mb-1.5 block">{field.label}</label>
//                       <div className="relative">
//                         <Lock size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" />
//                         <input
//                           type={showPass[field.key] ? "text" : "password"}
//                           value={passwordForm[field.key]}
//                           onChange={(e) => setPasswordForm({ ...passwordForm, [field.key]: e.target.value })}
//                           className="w-full pl-10 pr-10 py-3 rounded-xl border border-gray-200 text-sm text-gray-700 font-medium outline-none focus:border-violet-400 focus:ring-2 focus:ring-violet-100 transition-all bg-gray-50 focus:bg-white"
//                           placeholder="••••••••"
//                         />
//                         <button
//                           type="button"
//                           onClick={() => setShowPass({ ...showPass, [field.key]: !showPass[field.key] })}
//                           className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
//                         >
//                           {showPass[field.key] ? <EyeOff size={15} /> : <Eye size={15} />}
//                         </button>
//                       </div>
//                     </div>
//                   ))}
//                 </div>

//                 <div className="bg-amber-50 border border-amber-200 rounded-2xl p-4">
//                   <p className="text-xs font-semibold text-amber-700">Password must be at least 6 characters long.</p>
//                 </div>

//                 <button
//                   onClick={handlePasswordSave}
//                   disabled={savingPass}
//                   className="w-full py-3.5 rounded-2xl bg-gradient-to-r from-violet-600 to-purple-600 text-white text-sm font-bold hover:opacity-90 transition-all disabled:opacity-50 flex items-center justify-center gap-2 shadow-lg shadow-violet-200"
//                 >
//                   {savingPass
//                     ? <><Loader2 size={15} className="animate-spin" /> Updating...</>
//                     : "Update Password"
//                   }
//                 </button>
//               </div>
//             )}

//             {/* ── Orders Tab ── */}
//             {activeTab === "orders" && (
//               <div>
//                 <div className="flex items-center justify-between mb-4">
//                   <p className="text-xs font-bold text-gray-400 uppercase tracking-wider">Recent Orders</p>
//                   <Link to="/orders" className="text-xs font-bold text-violet-600 hover:text-violet-800 flex items-center gap-1">
//                     View All <ChevronRight size={13} />
//                   </Link>
//                 </div>

//                 {statsLoading ? (
//                   <div className="space-y-3">
//                     {[...Array(3)].map((_, i) => (
//                       <div key={i} className="h-20 bg-gray-100 rounded-2xl animate-pulse" />
//                     ))}
//                   </div>
//                 ) : recentOrders.length === 0 ? (
//                   <div className="flex flex-col items-center justify-center py-16 text-center">
//                     <div className="w-16 h-16 rounded-2xl bg-violet-50 flex items-center justify-center mb-3">
//                       <Package size={28} className="text-violet-400" />
//                     </div>
//                     <p className="text-gray-600 font-bold mb-1">No orders yet</p>
//                     <p className="text-gray-400 text-xs mb-4">Start shopping to see your orders here</p>
//                     <Link to="/"
//                       className="px-5 py-2.5 bg-gradient-to-r from-violet-600 to-purple-600 text-white rounded-full text-xs font-bold hover:opacity-90 transition-all">
//                       Shop Now
//                     </Link>
//                   </div>
//                 ) : (
//                   <div className="space-y-3">
//                     {recentOrders.map((order) => {
//                       const sc = statusColors[order.orderStatus] || "bg-gray-100 text-gray-600";
//                       return (
//                         <div key={order._id} className="flex items-center gap-4 p-4 bg-gray-50 rounded-2xl hover:bg-gray-100 transition-colors">
//                           {/* Images */}
//                           <div className="flex -space-x-2 shrink-0">
//                             {order.orderItems.slice(0, 2).map((item, i) => (
//                               <img key={i} src={item.image} alt={item.productTitle}
//                                 className="w-10 h-10 rounded-xl object-cover border-2 border-white bg-gray-200" />
//                             ))}
//                           </div>
//                           <div className="flex-1 min-w-0">
//                             <p className="text-xs font-mono font-bold text-violet-500">
//                               #{order._id.slice(-8).toUpperCase()}
//                             </p>
//                             <p className="text-xs text-gray-400 mt-0.5">
//                               {order.orderItems.length} item{order.orderItems.length !== 1 ? "s" : ""} ·{" "}
//                               {new Date(order.createdAt).toLocaleDateString("en-GB", { day: "numeric", month: "short" })}
//                             </p>
//                           </div>
//                           <div className="text-right shrink-0">
//                             <p className="text-sm font-black text-gray-800">৳{order.totalPrice?.toLocaleString()}</p>
//                             <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full capitalize ${sc}`}>
//                               {order.orderStatus}
//                             </span>
//                           </div>
//                         </div>
//                       );
//                     })}
//                     <Link to="/orders"
//                       className="flex items-center justify-center gap-2 w-full py-3 rounded-2xl border-2 border-dashed border-violet-200 text-violet-500 text-sm font-bold hover:bg-violet-50 transition-colors mt-2">
//                       View All Orders <ChevronRight size={14} />
//                     </Link>
//                   </div>
//                 )}
//               </div>
//             )}

//           </div>
//         </div>

//       </div>
//     </div>
//   );
// };

// export default MyAccount;