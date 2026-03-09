import React, { useState } from "react";

const PriceFilter = ({ minPrice, maxPrice, onMinChange, onMaxChange }) => {
  const minLimit = 0;
  const maxLimit = 100000;

  const handleMinChange = (e) => {
    const value = Math.min(Number(e.target.value), maxPrice - 1000);
    onMinChange(value);
  };

  const handleMaxChange = (e) => {
    const value = Math.max(Number(e.target.value), minPrice + 1000);
    onMaxChange(value);
  };

  return (
    <div className="mb-10 w-full">
      <h3 className="text-gray-800 font-bold text-sm tracking-widest uppercase mb-6">
        Filter by Price
      </h3>

      <div className="relative h-1 w-full bg-gray-200 rounded-full mb-6">
        <div
          className="absolute h-1 bg-[#2bbef9] rounded-full"
          style={{
            left: `${(minPrice / maxLimit) * 100}%`,
            right: `${100 - (maxPrice / maxLimit) * 100}%`,
          }}
        />
        <input
          type="range"
          min={minLimit}
          max={maxLimit}
          value={minPrice}
          onChange={handleMinChange}
          className="absolute w-full h-1 bg-transparent appearance-none pointer-events-none cursor-pointer z-10
          [&::-webkit-slider-thumb]:pointer-events-auto [&::-webkit-slider-thumb]:w-4 [&::-webkit-slider-thumb]:h-4
          [&::-webkit-slider-thumb]:bg-[#2bbef9] [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:appearance-none"
        />
        <input
          type="range"
          min={minLimit}
          max={maxLimit}
          value={maxPrice}
          onChange={handleMaxChange}
          className="absolute w-full h-1 bg-transparent appearance-none pointer-events-none cursor-pointer z-20
          [&::-webkit-slider-thumb]:pointer-events-auto [&::-webkit-slider-thumb]:w-4 [&::-webkit-slider-thumb]:h-4
          [&::-webkit-slider-thumb]:bg-[#2bbef9] [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:appearance-none"
        />
      </div>

      <div className="flex justify-between items-center text-[13px] text-gray-600 font-medium">
        <div>From: <span className="text-gray-800 font-bold ml-1">৳{minPrice.toLocaleString()}</span></div>
        <div>To: <span className="text-gray-800 font-bold ml-1">৳{maxPrice.toLocaleString()}</span></div>
      </div>
    </div>
  );
};

export default PriceFilter;




















// import React, { useState } from "react";

// const PriceFilter = () => {
//   const [minPrice, setMinPrice] = useState(100);
//   const [maxPrice, setMaxPrice] = useState(60000);
//   const minLimit = 0;
//   const maxLimit = 100000;

//   // স্লাইডারের হ্যান্ডেল কন্ট্রোল করার ফাংশন
//   const handleMinChange = (e) => {
//     const value = Math.min(Number(e.target.value), maxPrice - 1000);
//     setMinPrice(value);
//   };

//   const handleMaxChange = (e) => {
//     const value = Math.max(Number(e.target.value), minPrice + 1000);
//     setMaxPrice(value);
//   };

//   return (
//     <div className="mb-10 w-full">
//       <h3 className="text-gray-800 font-bold text-sm tracking-widest uppercase mb-6">
//         Filter by Price
//       </h3>

//       {/* স্লাইডার কন্টেইনার */}
//       <div className="relative h-1 w-full bg-gray-200 rounded-full mb-6">
//         {/* একটি হ্যান্ডেল থেকে অন্যটির মাঝখানের কালারড লাইন */}
//         <div 
//           className="absolute h-1 bg-purple-600 rounded-full"
//           style={{
//             left: `${(minPrice / maxLimit) * 100}%`,
//             right: `${100 - (maxPrice / maxLimit) * 100}%`
//           }}
//         ></div>

//         {/* ডাবল রেঞ্জ ইনপুট (একটির ওপর আরেকটি বসানো) */}
//         <input
//           type="range"
//           min={minLimit}
//           max={maxLimit}
//           value={minPrice}
//           onChange={handleMinChange}
//           className="absolute w-full h-1 bg-transparent appearance-none pointer-events-none cursor-pointer z-10 
//           [&::-webkit-slider-thumb]:pointer-events-auto [&::-webkit-slider-thumb]:w-4 [&::-webkit-slider-thumb]:h-4 
//           [&::-webkit-slider-thumb]:bg-purple-600 [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:appearance-none"
//         />
//         <input
//           type="range"
//           min={minLimit}
//           max={maxLimit}
//           value={maxPrice}
//           onChange={handleMaxChange}
//           className="absolute w-full h-1 bg-transparent appearance-none pointer-events-none cursor-pointer z-20 
//           [&::-webkit-slider-thumb]:pointer-events-auto [&::-webkit-slider-thumb]:w-4 [&::-webkit-slider-thumb]:h-4 
//           [&::-webkit-slider-thumb]:bg-purple-600 [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:appearance-none"
//         />
//       </div>

//       {/* নিচের প্রাইস টেক্সট */}
//       <div className="flex justify-between items-center text-[13px] text-gray-600 font-medium">
//         <div>
//           From: <span className="text-gray-800 font-bold ml-1">Rs: {minPrice}</span>
//         </div>
//         <div>
//           To: <span className="text-gray-800 font-bold ml-1">Rs: {maxPrice}</span>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default PriceFilter;