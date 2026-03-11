import { useState } from "react";
import { Star, Send, ThumbsUp, MessageCircle } from "lucide-react";

const reviews = [
  {
    id: 1,
    name: "Rinku Verma",
    avatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=150&q=80",
    date: "March 1, 2024",
    rating: 4,
    review: "Absolutely love this product! The quality exceeded my expectations. The material feels premium and the fit is perfect. Would definitely recommend to anyone looking for something stylish yet comfortable.",
    helpful: 12,
  },
  {
    id: 2,
    name: "Arjun Mehta",
    avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=150&q=80",
    date: "February 14, 2024",
    rating: 5,
    review: "Fantastic purchase! Arrived quickly, packaged beautifully. Exactly as described and the color is even better in person. This is my second order and won't be my last.",
    helpful: 8,
  },
];

const ratings = [
  { stars: 5, percentage: 75, count: 124 },
  { stars: 4, percentage: 50, count: 83 },
  { stars: 3, percentage: 30, count: 49 },
  { stars: 2, percentage: 15, count: 25 },
  { stars: 1, percentage: 10, count: 16 },
];

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

const ReviewSection = () => {
  const [userRating, setUserRating] = useState(0);
  const [reviewText, setReviewText] = useState("");
  const [name, setName] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
  };

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=DM+Sans:ital,opsz,wght@0,9..40,300;0,9..40,400;0,9..40,500;0,9..40,600;0,9..40,700;1,9..40,300&family=Playfair+Display:wght@500;600&display=swap');
        .rv-root { font-family: 'DM Sans', sans-serif; }
        .rv-heading { font-family: 'Playfair Display', serif; }

        .rv-card {
          background: #fff;
          border-radius: 20px;
          transition: box-shadow 0.25s, transform 0.25s;
        }
        .rv-card:hover {
          box-shadow: 0 12px 40px rgba(0,0,0,0.08);
          transform: translateY(-2px);
        }

        .rv-bar-track {
          background: #f3f4f6;
          border-radius: 99px;
          overflow: hidden;
          height: 8px;
        }
        .rv-bar-fill {
          height: 100%;
          border-radius: 99px;
          background: linear-gradient(90deg, #f59e0b, #ef4444);
          transition: width 0.6s cubic-bezier(0.4,0,0.2,1);
        }

        .rv-submit-btn {
          background: linear-gradient(135deg, #667eea 0%, #764ba2 50%, #f093fb 100%);
          border-radius: 14px;
          color: white;
          font-weight: 600;
          font-size: 14px;
          padding: 12px 28px;
          display: flex;
          align-items: center;
          gap: 8px;
          transition: all 0.25s;
          border: none;
          cursor: pointer;
          letter-spacing: 0.3px;
        }
        .rv-submit-btn:hover {
          transform: translateY(-2px);
          box-shadow: 0 8px 24px rgba(102,126,234,0.45);
          background: linear-gradient(135deg, #764ba2 0%, #667eea 50%, #f093fb 100%);
        }
        .rv-submit-btn:active { transform: translateY(0); }

        .rv-textarea {
          width: 100%;
          border: 1.5px solid #e5e7eb;
          border-radius: 14px;
          padding: 14px 16px;
          font-size: 14px;
          font-family: 'DM Sans', sans-serif;
          resize: none;
          outline: none;
          transition: border-color 0.2s, box-shadow 0.2s;
          background: #fafafa;
          color: #374151;
          height: 120px;
        }
        .rv-textarea:focus {
          border-color: #667eea;
          box-shadow: 0 0 0 3px rgba(102,126,234,0.12);
          background: #fff;
        }

        .rv-input {
          border: 1.5px solid #e5e7eb;
          border-radius: 12px;
          padding: 11px 16px;
          font-size: 14px;
          font-family: 'DM Sans', sans-serif;
          outline: none;
          background: #fafafa;
          color: #374151;
          transition: border-color 0.2s, box-shadow 0.2s;
          width: 100%;
        }
        .rv-input:focus {
          border-color: #667eea;
          box-shadow: 0 0 0 3px rgba(102,126,234,0.12);
          background: #fff;
        }

        .rv-avatar {
          width: 48px;
          height: 48px;
          border-radius: 14px;
          object-fit: cover;
          flex-shrink: 0;
        }

        .rv-helpful-btn {
          display: flex;
          align-items: center;
          gap: 5px;
          font-size: 12px;
          color: #9ca3af;
          background: #f9fafb;
          border: 1px solid #f3f4f6;
          border-radius: 8px;
          padding: 5px 10px;
          cursor: pointer;
          transition: all 0.15s;
        }
        .rv-helpful-btn:hover { background: #f0fdf4; color: #16a34a; border-color: #bbf7d0; }

        .rv-score-badge {
          background: linear-gradient(135deg, #f59e0b, #ef4444);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-clip: text;
          font-family: 'Playfair Display', serif;
          font-size: 52px;
          font-weight: 600;
          line-height: 1;
        }

        @keyframes fadeUp {
          from { opacity: 0; transform: translateY(16px); }
          to   { opacity: 1; transform: translateY(0); }
        }
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

            {/* Review Cards */}
            {reviews.map((r, i) => (
              <div key={r.id} className={`rv-card rv-fadein rv-fadein-${i + 1} p-5 sm:p-6`}
                style={{ boxShadow: "0 2px 16px rgba(0,0,0,0.05)" }}>
                <div className="flex gap-4">
                  <img src={r.avatar} alt={r.name} className="rv-avatar" />
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between gap-2 flex-wrap mb-2">
                      <div>
                        <p className="font-semibold text-gray-800 text-[15px]">{r.name}</p>
                        <p className="text-gray-400 text-xs mt-0.5">{r.date}</p>
                      </div>
                      <StarRating rating={r.rating} size={15} />
                    </div>
                    <p className="text-gray-600 text-sm leading-relaxed">{r.review}</p>
                    <div className="mt-4 flex items-center gap-2">
                      <button className="rv-helpful-btn">
                        <ThumbsUp size={12} /> Helpful ({r.helpful})
                      </button>
                      <button className="rv-helpful-btn">
                        <MessageCircle size={12} /> Reply
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ))}

            {/* Add Review Form */}
            <div className="rv-fadein rv-fadein-3 rv-card p-6 sm:p-7"
              style={{ boxShadow: "0 2px 16px rgba(0,0,0,0.05)" }}>
              <h3 className="rv-heading text-xl text-gray-800 mb-5">Write a Review</h3>
              <form onSubmit={handleSubmit} className="space-y-4">
                <textarea
                  className="rv-textarea"
                  placeholder="Share your experience with this product..."
                  value={reviewText}
                  onChange={(e) => setReviewText(e.target.value)}
                />
                <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center">
                  <input
                    type="text"
                    placeholder="Your name"
                    className="rv-input"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                  />
                  <div className="flex items-center gap-3 shrink-0">
                    <span className="text-sm text-gray-500 whitespace-nowrap">Your rating:</span>
                    <StarRating rating={userRating} size={22} interactive onRate={setUserRating} />
                  </div>
                </div>
                <div className="flex justify-end pt-1">
                  <button type="submit" className="rv-submit-btn">
                    <Send size={15} /> Submit Review
                  </button>
                </div>
              </form>
            </div>
          </div>

          {/* ── RIGHT: Rating Summary ── */}
          <div className="rv-fadein rv-fadein-2">
            <div className="rv-card p-6 sticky top-24"
              style={{ boxShadow: "0 2px 16px rgba(0,0,0,0.05)" }}>

              <h3 className="rv-heading text-xl text-gray-800 mb-4">Customer Reviews</h3>

              {/* Overall Score */}
              <div className="flex items-end gap-3 mb-5 pb-5"
                style={{ borderBottom: "1px solid #f3f4f6" }}>
                <span className="rv-score-badge">4.8</span>
                <div className="mb-1">
                  <StarRating rating={5} size={16} />
                  <p className="text-xs text-gray-400 mt-1">Based on 297 reviews</p>
                </div>
              </div>

              {/* Rating Bars */}
              <div className="space-y-3">
                {ratings.map((item) => (
                  <div key={item.stars} className="flex items-center gap-3">
                    <span className="text-xs text-gray-500 w-10 shrink-0 font-medium">
                      {item.stars} star
                    </span>
                    <div className="rv-bar-track flex-1">
                      <div className="rv-bar-fill" style={{ width: `${item.percentage}%` }} />
                    </div>
                    <span className="text-xs text-gray-400 w-6 text-right shrink-0">
                      {item.count}
                    </span>
                  </div>
                ))}
              </div>

              {/* CTA */}
              <div className="mt-6 pt-5" style={{ borderTop: "1px solid #f3f4f6" }}>
                <p className="text-xs text-gray-400 text-center leading-relaxed">
                  Purchased this product? Scroll up to share your review!
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