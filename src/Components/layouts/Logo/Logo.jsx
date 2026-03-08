import { Link } from "react-router-dom";
import logo from "../../../assets/logo.png";

const Logo = () => {
  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=DM+Sans:ital,wght@0,300;0,400;0,500;1,300&display=swap');
        .logo-root { font-family: 'DM Sans', sans-serif; text-decoration: none; }
        .logo-img-wrap {
          position: relative;
          width: 32px;
          height: 32px;
          border-radius: 9px;
          overflow: hidden;
          background: linear-gradient(135deg, #f0f9ff 0%, #e0f2fe 100%);
          border: 1px solid rgba(43,190,249,0.18);
          flex-shrink: 0;
          transition: box-shadow 0.2s;
        }
        .logo-root:hover .logo-img-wrap {
          box-shadow: 0 4px 14px rgba(43,190,249,0.25);
        }
        .logo-img-wrap img {
          width: 100%;
          height: 100%;
          object-fit: contain;
          padding: 5px;
        }
        .logo-wordmark {
          display: flex;
          flex-direction: column;
          gap: 1px;
        }
        .logo-name {
          display: flex;
          align-items: baseline;
          gap: 0px;
          line-height: 1;
        }
        .logo-trend {
          font-size: 17px;
          font-weight: 500;
          letter-spacing: -0.5px;
          color: #0f172a;
        }
        .logo-cart {
          font-size: 17px;
          font-weight: 300;
          letter-spacing: -0.5px;
          color: #2bbef9;
        }
        .logo-dot {
          width: 4px;
          height: 4px;
          border-radius: 50%;
          background: #2bbef9;
          margin-bottom: 2px;
          flex-shrink: 0;
        }
        .logo-tag {
          font-size: 8.5px;
          font-weight: 400;
          letter-spacing: 0.08em;
          color: #94a3b8;
          text-transform: uppercase;
          line-height: 1;
          font-style: italic;
        }
      `}</style>

      <Link to="/" className="logo-root flex items-center gap-2.5 cursor-pointer select-none">
        {/* Icon */}
        <div className="logo-img-wrap">
          <img src={logo} alt="TrendCart" />
        </div>

        {/* Wordmark */}
        <div className="logo-wordmark">
          <div className="logo-name">
            <span className="logo-trend">Trend</span>
            <span className="logo-dot" style={{ margin: "0 1px 3px" }} />
            <span className="logo-cart">Cart</span>
          </div>
          <span className="logo-tag">Smart Shopping</span>
        </div>
      </Link>
    </>
  );
};

export default Logo;






// import logo from "../../../assets/logo.png"

// const Logo = () => {
//   return (
//     <div className="flex items-center gap-3 cursor-pointer group">
//       {/* 1. Logo Image Section */}
//       <div className="relative w-14 h-14 md:w-16 md:h-16 flex items-center justify-center">
//         <img 
//           src={logo} // Tomar image path eikhane hobe
//           alt="TrendCart Logo" 
//           className="w-full h-full object-contain transition-transform duration-300 group-hover:scale-110"
//         />
//       </div>

//       {/* 2. Text Section */}
//       <div className="flex flex-col leading-tight">
//         <div className="flex items-center">
//           <span className="text-2xl md:text-3xl font-black text-[#233a95] tracking-tighter uppercase italic">
//             TREND
//           </span>
//           <span className="text-2xl md:text-3xl font-light text-gray-500 tracking-tighter uppercase italic">
//             CART
//           </span>
//         </div>
//         {/* Tagline */}
//         <span className="text-[10px] md:text-[11px] font-bold text-gray-400 uppercase tracking-widest mt-[-2px]">
//           Smart Shopping, Delivered
//         </span>
//       </div>
//     </div>
//   );
// };

// export default Logo;