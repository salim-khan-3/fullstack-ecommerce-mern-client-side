// const TopStrip = () => {
//   return (
//     <div className="w-full bg-[#233a95] text-white py-2 text-center text-[11px] md:text-xs font-medium">
//       Due to the COVID 19 epidemic, orders may be processed with a slight delay
//     </div>
//   );
// };

// export default TopStrip;
import { useState, useEffect } from "react";
import { X, Truck, Tag, Headphones, ShieldCheck } from "lucide-react";

const messages = [
  { icon: <Truck size={13} />,        text: "Free shipping on orders over ৳999 — Shop now & save big!" },
  { icon: <Tag size={13} />,          text: "🔥 Mega Sale is LIVE — Up to 60% off on top brands today only!" },
  { icon: <Headphones size={13} />,   text: "24/7 Customer Support available — We're always here for you." },
  { icon: <ShieldCheck size={13} />,  text: "100% Secure Payments · Easy Returns · Trusted by 50,000+ customers" },
];

const TopStrip = () => {
  const [current, setCurrent] = useState(0);
  const [visible, setVisible] = useState(true);
  const [animating, setAnimating] = useState(false);

  useEffect(() => {
    const interval = setInterval(() => {
      setAnimating(true);
      setTimeout(() => {
        setCurrent((prev) => (prev + 1) % messages.length);
        setAnimating(false);
      }, 300);
    }, 4000);
    return () => clearInterval(interval);
  }, []);

  if (!visible) return null;

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Outfit:wght@400;500;600;700&display=swap');
        .ts-root { font-family: 'Outfit', sans-serif; }
        .ts-msg {
          transition: opacity 0.3s ease, transform 0.3s ease;
        }
        .ts-msg.out {
          opacity: 0;
          transform: translateY(-6px);
        }
        .ts-msg.in {
          opacity: 1;
          transform: translateY(0);
        }
        .ts-dot { transition: all 0.3s ease; }
        .ts-close:hover { background: rgba(255,255,255,0.15); }
        @keyframes shimmer {
          0%   { background-position: -200% center; }
          100% { background-position: 200% center; }
        }
        .ts-shimmer {
          background: linear-gradient(90deg, #ffffff40, #ffffff90, #ffffff40);
          background-size: 200% auto;
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-clip: text;
          animation: shimmer 3s linear infinite;
        }
      `}</style>

      <div
        className="ts-root w-full relative overflow-hidden"
        style={{
          background: "linear-gradient(90deg, #1e3a8a 0%, #1d4ed8 40%, #2563eb 60%, #1e40af 100%)",
          minHeight: 36,
        }}
      >
        {/* Subtle pattern overlay */}
        <div
          className="absolute inset-0 opacity-[0.04]"
          style={{
            backgroundImage: "repeating-linear-gradient(45deg, #fff 0, #fff 1px, transparent 0, transparent 50%)",
            backgroundSize: "8px 8px",
          }}
        />

        <div className="relative flex items-center justify-between px-4 md:px-6 py-2">
          {/* Left — promo dots (desktop) */}
          <div className="hidden md:flex items-center gap-1.5">
            {messages.map((_, i) => (
              <button
                key={i}
                onClick={() => setCurrent(i)}
                className="ts-dot rounded-full transition-all"
                style={{
                  width: current === i ? 18 : 6,
                  height: 6,
                  background: current === i ? "#fff" : "rgba(255,255,255,0.35)",
                }}
              />
            ))}
          </div>

          {/* Center — message */}
          <div className="flex-1 flex items-center justify-center">
            <div
              className={`ts-msg flex items-center gap-2 text-white text-[11.5px] md:text-[12px] font-medium ${
                animating ? "out" : "in"
              }`}
            >
              <span className="opacity-80">{messages[current].icon}</span>
              <span>{messages[current].text}</span>
              <a
                href="#"
                className="ts-shimmer hidden sm:inline text-[11px] font-bold underline underline-offset-2 ml-1"
                style={{
                  background: "linear-gradient(90deg,#93c5fd,#fff,#93c5fd)",
                  backgroundSize: "200% auto",
                  WebkitBackgroundClip: "text",
                  WebkitTextFillColor: "transparent",
                  backgroundClip: "text",
                  animation: "shimmer 2.5s linear infinite",
                }}
              >
                Shop Now →
              </a>
            </div>
          </div>

          {/* Right — close */}
          <div className="hidden md:flex items-center justify-end" style={{ width: 60 }}>
            <button
              onClick={() => setVisible(false)}
              className="ts-close w-6 h-6 rounded-full flex items-center justify-center transition-all"
            >
              <X size={13} className="text-white/70" />
            </button>
          </div>
        </div>
      </div>
    </>
  );
};

export default TopStrip;