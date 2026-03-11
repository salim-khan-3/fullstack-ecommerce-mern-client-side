import { useState } from "react";
import { Star, Send, ThumbsUp, MessageCircle, Loader2 } from "lucide-react";
import toast from "react-hot-toast";

const StarRating = ({ rating, size = 16, interactive = false, onRate }) => {
  const [hovered, setHovered] = useState(0);
  return (
    <div className="flex gap-0.5">
      {[1, 2, 3, 4, 5].map((star) => (
        <Star
          key={star}
          size={size}
          onClick={() => interactive && onRate?.(star)}
          onMouseEnter={() => interactive && setHovered(star)}
          onMouseLeave={() => interactive && setHovered(0)}
          className={`transition-all duration-150 ${interactive ? "cursor-pointer" : ""}`}
          fill={star <= (hovered || rating) ? "#f59e0b" : "none"}
          color={star <= (hovered || rating) ? "#f59e0b" : "#d1d5db"}
          strokeWidth={1.5}
        />
      ))}
    </div>
  );
};

// rating percentage calculate
const calcRatingStats = (reviews) => {
  const total = reviews.length;
  if (total === 0) return { average: 0, bars: [] };

  const avg = (reviews.reduce((s, r) => s + r.customerRating, 0) / total).toFixed(1);

  const bars = [5, 4, 3, 2, 1].map((star) => {
    const count = reviews.filter((r) => Math.round(r.customerRating) === star).length;
    return {
      stars: star,
      count,
      percentage: total > 0 ? Math.round((count / total) * 100) : 0,
    };
  });

  return { average: avg, bars };
};

const ReviewSection = ({ reviews = [], reviewsLoading, onAddReview, isLoggedIn, currentUser }) => {
  const [userRating, setUserRating] = useState(0);
  const [reviewText, setReviewText] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const { average, bars } = calcRatingStats(reviews);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!isLoggedIn) {
      toast.error("Please login to submit a review");
      return;
    }
    if (!reviewText.trim()) {
      toast.error("Please write a review");
      return;
    }
    if (userRating === 0) {
      toast.error("Please select a rating");
      return;
    }
    setSubmitting(true);
    const success = await onAddReview({ review: reviewText, customerRating: userRating });
    if (success) {
      toast.success("Review submitted!");
      setReviewText("");
      setUserRating(0);
    } else {
      toast.error("Failed to submit review");
    }
    setSubmitting(false);
  };

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=DM+Sans:ital,opsz,wght@0,9..40,300;0,9..40,400;0,9..40,500;0,9..40,600;0,9..40,700;1,9..40,300&family=Playfair+Display:wght@500;600&display=swap');
        .rv-root { font-family: 'DM Sans', sans-serif; }
        .rv-heading { font-family: 'Playfair Display', serif; }
        .rv-card { background: #fff; border-radius: 20px; transition: box-shadow 0.25s, transform 0.25s; }
        .rv-card:hover { box-shadow: 0 12px 40px rgba(0,0,0,0.08); transform: translateY(-2px); }
        .rv-bar-track { background: #f3f4f6; border-radius: 99px; overflow: hidden; height: 8px; }
        .rv-bar-fill { height: 100%; border-radius: 99px; background: linear-gradient(90deg, #f59e0b, #ef4444); transition: width 0.6s cubic-bezier(0.4,0,0.2,1); }
        .rv-submit-btn { background: linear-gradient(135deg, #667eea 0%, #764ba2 50%, #f093fb 100%); border-radius: 14px; color: white; font-weight: 600; font-size: 14px; padding: 12px 28px; display: flex; align-items: center; gap: 8px; transition: all 0.25s; border: none; cursor: pointer; letter-spacing: 0.3px; }
        .rv-submit-btn:hover { transform: translateY(-2px); box-shadow: 0 8px 24px rgba(102,126,234,0.45); }
        .rv-submit-btn:disabled { opacity: 0.6; cursor: not-allowed; transform: none; }
        .rv-textarea { width: 100%; border: 1.5px solid #e5e7eb; border-radius: 14px; padding: 14px 16px; font-size: 14px; font-family: 'DM Sans', sans-serif; resize: none; outline: none; transition: border-color 0.2s, box-shadow 0.2s; background: #fafafa; color: #374151; height: 120px; }
        .rv-textarea:focus { border-color: #667eea; box-shadow: 0 0 0 3px rgba(102,126,234,0.12); background: #fff; }
        .rv-input { border: 1.5px solid #e5e7eb; border-radius: 12px; padding: 11px 16px; font-size: 14px; font-family: 'DM Sans', sans-serif; outline: none; background: #fafafa; color: #374151; transition: border-color 0.2s, box-shadow 0.2s; width: 100%; }
        .rv-input:focus { border-color: #667eea; box-shadow: 0 0 0 3px rgba(102,126,234,0.12); background: #fff; }
        .rv-avatar { width: 48px; height: 48px; border-radius: 14px; object-fit: cover; flex-shrink: 0; }
        .rv-avatar-letter { width: 48px; height: 48px; border-radius: 14px; flex-shrink: 0; background: linear-gradient(135deg,#667eea,#764ba2); display:flex; align-items:center; justify-content:center; color:white; font-weight:700; font-size:18px; }
        .rv-helpful-btn { display: flex; align-items: center; gap: 5px; font-size: 12px; color: #9ca3af; background: #f9fafb; border: 1px solid #f3f4f6; border-radius: 8px; padding: 5px 10px; cursor: pointer; transition: all 0.15s; }
        .rv-helpful-btn:hover { background: #f0fdf4; color: #16a34a; border-color: #bbf7d0; }
        .rv-score-badge { background: linear-gradient(135deg, #f59e0b, #ef4444); -webkit-background-clip: text; -webkit-text-fill-color: transparent; background-clip: text; font-family: 'Playfair Display', serif; font-size: 52px; font-weight: 600; line-height: 1; }
        @keyframes fadeUp { from { opacity: 0; transform: translateY(16px); } to { opacity: 1; transform: translateY(0); } }
        .rv-fadein { animation: fadeUp 0.45s ease both; }
        .rv-fadein-1 { animation-delay: 0.05s; }
        .rv-fadein-2 { animation-delay: 0.12s; }
        .rv-fadein-3 { animation-delay: 0.2s; }
      `}</style>

      <div className="rv-root max-w-6xl mx-auto px-4 sm:px-6 py-12">

        <div className="rv-fadein mb-10">
          <h2 className="rv-heading text-3xl text-gray-900 mb-1">Reviews & Ratings</h2>
          <p className="text-gray-400 text-sm">What our customers are saying</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 lg:gap-12">

          {/* ── LEFT: Reviews + Form ── */}
          <div className="lg:col-span-2 space-y-5">

            {/* Loading */}
            {reviewsLoading && (
              <div className="flex items-center justify-center py-12 text-gray-400 gap-2">
                <Loader2 size={20} className="animate-spin" />
                <span className="text-sm">Loading reviews...</span>
              </div>
            )}

            {/* Empty */}
            {!reviewsLoading && reviews.length === 0 && (
              <div className="rv-card p-10 text-center" style={{ boxShadow: "0 2px 16px rgba(0,0,0,0.05)" }}>
                <Star size={36} className="mx-auto text-gray-200 mb-3" />
                <p className="text-gray-400 text-sm">No reviews yet. Be the first to review!</p>
              </div>
            )}

            {/* Review Cards */}
            {!reviewsLoading && reviews.map((r, i) => (
              <div key={r._id || r.id} className={`rv-card rv-fadein rv-fadein-${Math.min(i + 1, 3)} p-5 sm:p-6`}
                style={{ boxShadow: "0 2px 16px rgba(0,0,0,0.05)" }}>
                <div className="flex gap-4">
                  {/* Avatar — letter fallback */}
                  <div className="rv-avatar-letter shrink-0">
                    {r.customerName?.charAt(0).toUpperCase() || "U"}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between gap-2 flex-wrap mb-2">
                      <div>
                        <p className="font-semibold text-gray-800 text-[15px]">{r.customerName}</p>
                        <p className="text-gray-400 text-xs mt-0.5">
                          {r.createdAt ? new Date(r.createdAt).toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric" }) : ""}
                        </p>
                      </div>
                      <StarRating rating={r.customerRating} size={15} />
                    </div>
                    <p className="text-gray-600 text-sm leading-relaxed">{r.review}</p>
                    <div className="mt-4 flex items-center gap-2">
                      <button className="rv-helpful-btn"><ThumbsUp size={12} /> Helpful</button>
                      <button className="rv-helpful-btn"><MessageCircle size={12} /> Reply</button>
                    </div>
                  </div>
                </div>
              </div>
            ))}

            {/* Add Review Form */}
            <div className="rv-fadein rv-fadein-3 rv-card p-6 sm:p-7"
              style={{ boxShadow: "0 2px 16px rgba(0,0,0,0.05)" }}>
              <h3 className="rv-heading text-xl text-gray-800 mb-5">Write a Review</h3>

              {!isLoggedIn ? (
                <p className="text-sm text-gray-400 py-4 text-center">
                  Please <span className="text-blue-500 font-semibold cursor-pointer hover:underline">login</span> to write a review.
                </p>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-4">
                  <textarea
                    className="rv-textarea"
                    placeholder="Share your experience with this product..."
                    value={reviewText}
                    onChange={(e) => setReviewText(e.target.value)}
                  />
                  <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center">
                    {/* logged in user name — read only */}
                    <input
                      type="text"
                      className="rv-input bg-gray-100 text-gray-500 cursor-not-allowed"
                      value={currentUser?.name || ""}
                      readOnly
                    />
                    <div className="flex items-center gap-3 shrink-0">
                      <span className="text-sm text-gray-500 whitespace-nowrap">Your rating:</span>
                      <StarRating rating={userRating} size={22} interactive onRate={setUserRating} />
                    </div>
                  </div>
                  <div className="flex justify-end pt-1">
                    <button type="submit" className="rv-submit-btn" disabled={submitting}>
                      {submitting ? <Loader2 size={15} className="animate-spin" /> : <Send size={15} />}
                      {submitting ? "Submitting..." : "Submit Review"}
                    </button>
                  </div>
                </form>
              )}
            </div>
          </div>

          {/* ── RIGHT: Rating Summary ── */}
          <div className="rv-fadein rv-fadein-2">
            <div className="rv-card p-6 sticky top-24"
              style={{ boxShadow: "0 2px 16px rgba(0,0,0,0.05)" }}>

              <h3 className="rv-heading text-xl text-gray-800 mb-4">Customer Reviews</h3>

              <div className="flex items-end gap-3 mb-5 pb-5" style={{ borderBottom: "1px solid #f3f4f6" }}>
                <span className="rv-score-badge">{average || "0.0"}</span>
                <div className="mb-1">
                  <StarRating rating={Math.round(average)} size={16} />
                  <p className="text-xs text-gray-400 mt-1">Based on {reviews.length} review{reviews.length !== 1 ? "s" : ""}</p>
                </div>
              </div>

              <div className="space-y-3">
                {bars.map((item) => (
                  <div key={item.stars} className="flex items-center gap-3">
                    <span className="text-xs text-gray-500 w-10 shrink-0 font-medium">{item.stars} star</span>
                    <div className="rv-bar-track flex-1">
                      <div className="rv-bar-fill" style={{ width: `${item.percentage}%` }} />
                    </div>
                    <span className="text-xs text-gray-400 w-6 text-right shrink-0">{item.count}</span>
                  </div>
                ))}
              </div>

              <div className="mt-6 pt-5" style={{ borderTop: "1px solid #f3f4f6" }}>
                <p className="text-xs text-gray-400 text-center leading-relaxed">
                  Purchased this product? Share your review below!
                </p>
              </div>
            </div>
          </div>

        </div>
      </div>
    </>
  );
};

export default ReviewSection;




// import { useState } from "react";
// import { Star, Send, ThumbsUp, MessageCircle } from "lucide-react";

// const reviews = [
//   {
//     id: 1,
//     name: "Rinku Verma",
//     avatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=150&q=80",
//     date: "March 1, 2024",
//     rating: 4,
//     review: "Absolutely love this product! The quality exceeded my expectations. The material feels premium and the fit is perfect. Would definitely recommend to anyone looking for something stylish yet comfortable.",
//     helpful: 12,
//   },
//   {
//     id: 2,
//     name: "Arjun Mehta",
//     avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=150&q=80",
//     date: "February 14, 2024",
//     rating: 5,
//     review: "Fantastic purchase! Arrived quickly, packaged beautifully. Exactly as described and the color is even better in person. This is my second order and won't be my last.",
//     helpful: 8,
//   },
// ];

// const ratings = [
//   { stars: 5, percentage: 75, count: 124 },
//   { stars: 4, percentage: 50, count: 83 },
//   { stars: 3, percentage: 30, count: 49 },
//   { stars: 2, percentage: 15, count: 25 },
//   { stars: 1, percentage: 10, count: 16 },
// ];

// const StarRating = ({ rating, size = 16, interactive = false, onRate }) => {
//   const [hovered, setHovered] = useState(0);
//   return (
//     <div className="flex gap-0.5">
//       {[1, 2, 3, 4, 5].map((star) => (
//         <Star
//           key={star}
//           size={size}
//           onClick={() => interactive && onRate?.(star)}
//           onMouseEnter={() => interactive && setHovered(star)}
//           onMouseLeave={() => interactive && setHovered(0)}
//           className={`transition-all duration-150 ${interactive ? "cursor-pointer" : ""}`}
//           fill={star <= (hovered || rating) ? "#f59e0b" : "none"}
//           color={star <= (hovered || rating) ? "#f59e0b" : "#d1d5db"}
//           strokeWidth={1.5}
//         />
//       ))}
//     </div>
//   );
// };

// const ReviewSection = () => {
//   const [userRating, setUserRating] = useState(0);
//   const [reviewText, setReviewText] = useState("");
//   const [name, setName] = useState("");

//   const handleSubmit = (e) => {
//     e.preventDefault();
//   };

//   return (
//     <>
//       <style>{`
//         @import url('https://fonts.googleapis.com/css2?family=DM+Sans:ital,opsz,wght@0,9..40,300;0,9..40,400;0,9..40,500;0,9..40,600;0,9..40,700;1,9..40,300&family=Playfair+Display:wght@500;600&display=swap');
//         .rv-root { font-family: 'DM Sans', sans-serif; }
//         .rv-heading { font-family: 'Playfair Display', serif; }

//         .rv-card {
//           background: #fff;
//           border-radius: 20px;
//           transition: box-shadow 0.25s, transform 0.25s;
//         }
//         .rv-card:hover {
//           box-shadow: 0 12px 40px rgba(0,0,0,0.08);
//           transform: translateY(-2px);
//         }

//         .rv-bar-track {
//           background: #f3f4f6;
//           border-radius: 99px;
//           overflow: hidden;
//           height: 8px;
//         }
//         .rv-bar-fill {
//           height: 100%;
//           border-radius: 99px;
//           background: linear-gradient(90deg, #f59e0b, #ef4444);
//           transition: width 0.6s cubic-bezier(0.4,0,0.2,1);
//         }

//         .rv-submit-btn {
//           background: linear-gradient(135deg, #667eea 0%, #764ba2 50%, #f093fb 100%);
//           border-radius: 14px;
//           color: white;
//           font-weight: 600;
//           font-size: 14px;
//           padding: 12px 28px;
//           display: flex;
//           align-items: center;
//           gap: 8px;
//           transition: all 0.25s;
//           border: none;
//           cursor: pointer;
//           letter-spacing: 0.3px;
//         }
//         .rv-submit-btn:hover {
//           transform: translateY(-2px);
//           box-shadow: 0 8px 24px rgba(102,126,234,0.45);
//           background: linear-gradient(135deg, #764ba2 0%, #667eea 50%, #f093fb 100%);
//         }
//         .rv-submit-btn:active { transform: translateY(0); }

//         .rv-textarea {
//           width: 100%;
//           border: 1.5px solid #e5e7eb;
//           border-radius: 14px;
//           padding: 14px 16px;
//           font-size: 14px;
//           font-family: 'DM Sans', sans-serif;
//           resize: none;
//           outline: none;
//           transition: border-color 0.2s, box-shadow 0.2s;
//           background: #fafafa;
//           color: #374151;
//           height: 120px;
//         }
//         .rv-textarea:focus {
//           border-color: #667eea;
//           box-shadow: 0 0 0 3px rgba(102,126,234,0.12);
//           background: #fff;
//         }

//         .rv-input {
//           border: 1.5px solid #e5e7eb;
//           border-radius: 12px;
//           padding: 11px 16px;
//           font-size: 14px;
//           font-family: 'DM Sans', sans-serif;
//           outline: none;
//           background: #fafafa;
//           color: #374151;
//           transition: border-color 0.2s, box-shadow 0.2s;
//           width: 100%;
//         }
//         .rv-input:focus {
//           border-color: #667eea;
//           box-shadow: 0 0 0 3px rgba(102,126,234,0.12);
//           background: #fff;
//         }

//         .rv-avatar {
//           width: 48px;
//           height: 48px;
//           border-radius: 14px;
//           object-fit: cover;
//           flex-shrink: 0;
//         }

//         .rv-helpful-btn {
//           display: flex;
//           align-items: center;
//           gap: 5px;
//           font-size: 12px;
//           color: #9ca3af;
//           background: #f9fafb;
//           border: 1px solid #f3f4f6;
//           border-radius: 8px;
//           padding: 5px 10px;
//           cursor: pointer;
//           transition: all 0.15s;
//         }
//         .rv-helpful-btn:hover { background: #f0fdf4; color: #16a34a; border-color: #bbf7d0; }

//         .rv-score-badge {
//           background: linear-gradient(135deg, #f59e0b, #ef4444);
//           -webkit-background-clip: text;
//           -webkit-text-fill-color: transparent;
//           background-clip: text;
//           font-family: 'Playfair Display', serif;
//           font-size: 52px;
//           font-weight: 600;
//           line-height: 1;
//         }

//         @keyframes fadeUp {
//           from { opacity: 0; transform: translateY(16px); }
//           to   { opacity: 1; transform: translateY(0); }
//         }
//         .rv-fadein { animation: fadeUp 0.45s ease both; }
//         .rv-fadein-1 { animation-delay: 0.05s; }
//         .rv-fadein-2 { animation-delay: 0.12s; }
//         .rv-fadein-3 { animation-delay: 0.2s; }
//       `}</style>

//       <div className="rv-root max-w-6xl mx-auto px-4 sm:px-6 py-12">

//         <div className="rv-fadein mb-10">
//           <h2 className="rv-heading text-3xl text-gray-900 mb-1">Reviews & Ratings</h2>
//           <p className="text-gray-400 text-sm">What our customers are saying</p>
//         </div>

//         <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 lg:gap-12">

//           {/* ── LEFT: Reviews + Form ── */}
//           <div className="lg:col-span-2 space-y-5">

//             {/* Review Cards */}
//             {reviews.map((r, i) => (
//               <div key={r.id} className={`rv-card rv-fadein rv-fadein-${i + 1} p-5 sm:p-6`}
//                 style={{ boxShadow: "0 2px 16px rgba(0,0,0,0.05)" }}>
//                 <div className="flex gap-4">
//                   <img src={r.avatar} alt={r.name} className="rv-avatar" />
//                   <div className="flex-1 min-w-0">
//                     <div className="flex items-start justify-between gap-2 flex-wrap mb-2">
//                       <div>
//                         <p className="font-semibold text-gray-800 text-[15px]">{r.name}</p>
//                         <p className="text-gray-400 text-xs mt-0.5">{r.date}</p>
//                       </div>
//                       <StarRating rating={r.rating} size={15} />
//                     </div>
//                     <p className="text-gray-600 text-sm leading-relaxed">{r.review}</p>
//                     <div className="mt-4 flex items-center gap-2">
//                       <button className="rv-helpful-btn">
//                         <ThumbsUp size={12} /> Helpful ({r.helpful})
//                       </button>
//                       <button className="rv-helpful-btn">
//                         <MessageCircle size={12} /> Reply
//                       </button>
//                     </div>
//                   </div>
//                 </div>
//               </div>
//             ))}

//             {/* Add Review Form */}
//             <div className="rv-fadein rv-fadein-3 rv-card p-6 sm:p-7"
//               style={{ boxShadow: "0 2px 16px rgba(0,0,0,0.05)" }}>
//               <h3 className="rv-heading text-xl text-gray-800 mb-5">Write a Review</h3>
//               <form onSubmit={handleSubmit} className="space-y-4">
//                 <textarea
//                   className="rv-textarea"
//                   placeholder="Share your experience with this product..."
//                   value={reviewText}
//                   onChange={(e) => setReviewText(e.target.value)}
//                 />
//                 <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center">
//                   <input
//                     type="text"
//                     placeholder="Your name"
//                     className="rv-input"
//                     value={name}
//                     onChange={(e) => setName(e.target.value)}
//                   />
//                   <div className="flex items-center gap-3 shrink-0">
//                     <span className="text-sm text-gray-500 whitespace-nowrap">Your rating:</span>
//                     <StarRating rating={userRating} size={22} interactive onRate={setUserRating} />
//                   </div>
//                 </div>
//                 <div className="flex justify-end pt-1">
//                   <button type="submit" className="rv-submit-btn">
//                     <Send size={15} /> Submit Review
//                   </button>
//                 </div>
//               </form>
//             </div>
//           </div>

//           {/* ── RIGHT: Rating Summary ── */}
//           <div className="rv-fadein rv-fadein-2">
//             <div className="rv-card p-6 sticky top-24"
//               style={{ boxShadow: "0 2px 16px rgba(0,0,0,0.05)" }}>

//               <h3 className="rv-heading text-xl text-gray-800 mb-4">Customer Reviews</h3>

//               {/* Overall Score */}
//               <div className="flex items-end gap-3 mb-5 pb-5"
//                 style={{ borderBottom: "1px solid #f3f4f6" }}>
//                 <span className="rv-score-badge">4.8</span>
//                 <div className="mb-1">
//                   <StarRating rating={5} size={16} />
//                   <p className="text-xs text-gray-400 mt-1">Based on 297 reviews</p>
//                 </div>
//               </div>

//               {/* Rating Bars */}
//               <div className="space-y-3">
//                 {ratings.map((item) => (
//                   <div key={item.stars} className="flex items-center gap-3">
//                     <span className="text-xs text-gray-500 w-10 shrink-0 font-medium">
//                       {item.stars} star
//                     </span>
//                     <div className="rv-bar-track flex-1">
//                       <div className="rv-bar-fill" style={{ width: `${item.percentage}%` }} />
//                     </div>
//                     <span className="text-xs text-gray-400 w-6 text-right shrink-0">
//                       {item.count}
//                     </span>
//                   </div>
//                 ))}
//               </div>

//               {/* CTA */}
//               <div className="mt-6 pt-5" style={{ borderTop: "1px solid #f3f4f6" }}>
//                 <p className="text-xs text-gray-400 text-center leading-relaxed">
//                   Purchased this product? Scroll up to share your review!
//                 </p>
//               </div>
//             </div>
//           </div>

//         </div>
//       </div>
//     </>
//   );
// };

// export default ReviewSection;