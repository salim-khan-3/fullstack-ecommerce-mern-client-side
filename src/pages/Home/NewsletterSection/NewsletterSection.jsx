import { useState } from "react";
import { Send, Gift, Zap, ShieldCheck, ArrowRight } from "lucide-react";

const perks = [
  { icon: <Gift size={15} />,        text: "৳200 off your first order" },
  { icon: <Zap size={15} />,         text: "Flash sale alerts before anyone" },
  { icon: <ShieldCheck size={15} />, text: "Members-only exclusive deals" },
];

const Newsletter = () => {
  const [email, setEmail]       = useState("");
  const [status, setStatus]     = useState("idle"); // idle | loading | done

  const handleSubmit = () => {
    if (!email || !email.includes("@")) return;
    setStatus("loading");
    setTimeout(() => {
      setStatus("done");
      setEmail("");
    }, 1200);
  };

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Outfit:ital,wght@0,300;0,400;0,500;0,600;0,700;0,800;0,900;1,300&display=swap');
        .nl-root { font-family: 'Outfit', sans-serif; }

        .nl-bg {
          background: linear-gradient(135deg, #0f172a 0%, #1e3a8a 45%, #1d4ed8 100%);
          position: relative;
          overflow: hidden;
        }
        .nl-glow-1 {
          position: absolute;
          width: 500px; height: 500px;
          border-radius: 50%;
          background: radial-gradient(circle, rgba(59,130,246,0.25) 0%, transparent 70%);
          top: -200px; right: -100px;
          pointer-events: none;
        }
        .nl-glow-2 {
          position: absolute;
          width: 350px; height: 350px;
          border-radius: 50%;
          background: radial-gradient(circle, rgba(99,102,241,0.2) 0%, transparent 70%);
          bottom: -150px; left: 100px;
          pointer-events: none;
        }
        .nl-grid-pattern {
          position: absolute;
          inset: 0;
          background-image:
            linear-gradient(rgba(255,255,255,0.03) 1px, transparent 1px),
            linear-gradient(90deg, rgba(255,255,255,0.03) 1px, transparent 1px);
          background-size: 40px 40px;
          pointer-events: none;
        }

        .nl-input-wrap {
          background: rgba(255,255,255,0.07);
          border: 1.5px solid rgba(255,255,255,0.12);
          border-radius: 16px;
          transition: border-color 0.2s, background 0.2s;
          backdrop-filter: blur(8px);
        }
        .nl-input-wrap:focus-within {
          border-color: rgba(43,190,249,0.6);
          background: rgba(255,255,255,0.1);
          box-shadow: 0 0 0 4px rgba(43,190,249,0.1);
        }
        .nl-input {
          background: transparent;
          color: #fff;
          outline: none;
          font-family: 'Outfit', sans-serif;
        }
        .nl-input::placeholder { color: rgba(255,255,255,0.35); }

        .nl-btn {
          background: linear-gradient(135deg, #2bbef9, #1d4ed8);
          border-radius: 12px;
          transition: all 0.2s;
          font-family: 'Outfit', sans-serif;
        }
        .nl-btn:hover {
          transform: translateY(-1px);
          box-shadow: 0 8px 24px rgba(43,190,249,0.4);
        }
        .nl-btn:active { transform: scale(0.97); }

        .nl-perk {
          background: rgba(255,255,255,0.05);
          border: 1px solid rgba(255,255,255,0.08);
          border-radius: 12px;
          backdrop-filter: blur(4px);
          transition: background 0.2s, border-color 0.2s;
        }
        .nl-perk:hover {
          background: rgba(255,255,255,0.09);
          border-color: rgba(43,190,249,0.3);
        }

        .nl-badge {
          background: linear-gradient(135deg, rgba(43,190,249,0.2), rgba(99,102,241,0.2));
          border: 1px solid rgba(43,190,249,0.3);
          border-radius: 999px;
        }

        .nl-stat {
          border-right: 1px solid rgba(255,255,255,0.1);
        }
        .nl-stat:last-child { border-right: none; }

        @keyframes nlPop {
          0%   { transform: scale(0.8); opacity: 0; }
          60%  { transform: scale(1.08); }
          100% { transform: scale(1); opacity: 1; }
        }
        .nl-success { animation: nlPop 0.4s ease forwards; }

        @keyframes nlSpin {
          to { transform: rotate(360deg); }
        }
        .nl-spinner {
          width: 18px; height: 18px;
          border: 2px solid rgba(255,255,255,0.3);
          border-top-color: #fff;
          border-radius: 50%;
          animation: nlSpin 0.7s linear infinite;
        }
      `}</style>

      <section className="nl-root nl-bg py-16 md:py-20 lg:py-24">
        <div className="nl-glow-1" />
        <div className="nl-glow-2" />
        <div className="nl-grid-pattern" />

        <div className="relative container mx-auto px-5 md:px-8">
          <div className="max-w-3xl mx-auto text-center">

            {/* Badge */}
            <div className="inline-flex items-center gap-2 nl-badge px-4 py-1.5 mb-6">
              <span className="text-[10px] font-black uppercase tracking-[2px] text-[#2bbef9]">
                ✦ Exclusive Members Club
              </span>
            </div>

            {/* Headline */}
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-black text-white leading-[1.12] tracking-tight mb-4">
              Get the best deals{" "}
              <span
                className="italic font-light"
                style={{
                  background: "linear-gradient(90deg,#2bbef9,#818cf8)",
                  WebkitBackgroundClip: "text",
                  WebkitTextFillColor: "transparent",
                  backgroundClip: "text",
                }}
              >
                before anyone else
              </span>
            </h2>

            {/* Subtext */}
            <p className="text-[14px] md:text-[15px] text-white/50 font-medium max-w-md mx-auto mb-8 leading-relaxed">
              Subscribe to our newsletter and unlock exclusive discounts,
              flash sale alerts, and member-only offers — straight to your inbox.
            </p>

            {/* Perks row */}
            <div className="flex flex-wrap justify-center gap-3 mb-10">
              {perks.map((perk, i) => (
                <div key={i} className="nl-perk flex items-center gap-2 px-4 py-2.5">
                  <span className="text-[#2bbef9]">{perk.icon}</span>
                  <span className="text-[12.5px] font-semibold text-white/80">{perk.text}</span>
                </div>
              ))}
            </div>

            {/* Email form */}
            {status === "done" ? (
              <div className="nl-success flex flex-col items-center gap-3 py-6">
                <div
                  className="w-14 h-14 rounded-2xl flex items-center justify-center text-2xl mb-1"
                  style={{ background: "linear-gradient(135deg,#2bbef9,#6366f1)" }}
                >
                  🎉
                </div>
                <p className="text-white font-black text-lg">You're in!</p>
                <p className="text-white/50 text-[13px]">
                  Check your inbox — your ৳200 coupon is on its way.
                </p>
              </div>
            ) : (
              <div className="flex flex-col sm:flex-row items-stretch gap-3 max-w-lg mx-auto">
                <div className="nl-input-wrap flex-1 flex items-center px-4 py-1">
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    onKeyDown={(e) => e.key === "Enter" && handleSubmit()}
                    placeholder="Enter your email address..."
                    className="nl-input flex-1 py-3 text-[13.5px] font-medium w-full"
                  />
                </div>
                <button
                  onClick={handleSubmit}
                  disabled={status === "loading"}
                  className="nl-btn flex items-center justify-center gap-2 px-7 py-3.5 text-white font-bold text-[13px] whitespace-nowrap"
                >
                  {status === "loading" ? (
                    <span className="nl-spinner" />
                  ) : (
                    <>
                      Subscribe Free
                      <ArrowRight size={15} />
                    </>
                  )}
                </button>
              </div>
            )}

            {/* Trust note */}
            <p className="text-white/25 text-[11px] font-medium mt-4 tracking-wide">
              No spam, ever. Unsubscribe anytime. We respect your privacy.
            </p>

            {/* Stats */}
            <div className="flex items-center justify-center mt-10 divide-x divide-white/10">
              {[
                { val: "50K+",  label: "Subscribers" },
                { val: "৳200",  label: "Welcome Bonus" },
                { val: "Daily", label: "Exclusive Deals" },
              ].map((s, i) => (
                <div key={i} className="px-6 sm:px-10 text-center">
                  <p className="text-white font-black text-lg sm:text-xl leading-none mb-0.5">{s.val}</p>
                  <p className="text-white/35 text-[10.5px] font-semibold uppercase tracking-wider">{s.label}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>
    </>
  );
};

export default Newsletter;