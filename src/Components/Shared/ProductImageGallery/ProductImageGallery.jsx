import { useState } from "react";
import ProductImageZoom from "../ProductImageZoom/ProductImageZoom";

const ProductImageGallery = ({ images = [] }) => {
  const [activeImage, setActiveImage] = useState(images[0]);

  return (
    <div className="flex flex-col gap-3 w-full">

      {/* Main Image */}
      <div className="w-full rounded-2xl overflow-hidden bg-gray-50 border border-gray-100">
        <ProductImageZoom Image={activeImage} />
      </div>

      {/* Thumbnails */}
      {images.length > 1 && (
        <div className="flex gap-2 flex-wrap">
          {images.map((img, index) => (
            <button
              key={index}
              onClick={() => setActiveImage(img)}
              className={`w-16 h-16 sm:w-20 sm:h-20 rounded-xl overflow-hidden border-2 transition-all shrink-0
                ${activeImage === img
                  ? "border-blue-500"
                  : "border-gray-200 hover:border-gray-300"
                }`}
            >
              <img
                src={img}
                alt={`thumb-${index}`}
                className="w-full h-full object-cover"
              />
            </button>
          ))}
        </div>
      )}
    </div>
  );
};

export default ProductImageGallery;






// import { useState } from "react";
// import ProductImageZoom from "../ProductImageZoom/ProductImageZoom";

// const ProductImageGallery = ({ images }) => {
//   const [activeImage, setActiveImage] = useState(images[0]);

//   return (
//     // items-center theke items-start ba stretch e ante paren jodi bame rakhte chan
//     <div className="flex flex-col items-center lg:items-start gap-4 w-full">
      
//       {/* Main Zoom Image Container */}
//       {/* Fixed pixels er bodole percentage (%) ba max-width use kora safe */}
//       <div className="w-full max-w-[420px] aspect-square overflow-hidden flex items-center justify-center border rounded-xl bg-white">
//         <ProductImageZoom Image={activeImage} />
//       </div>

//       {/* Thumbnails */}
//       <div className="flex flex-wrap justify-center lg:justify-start gap-2 sm:gap-3 mt-3">
//         {images.map((img, index) => (
//           <button
//             key={index}
//             onClick={() => setActiveImage(img)}
//             className={`w-14 h-14 sm:w-20 sm:h-20 border-2 rounded-lg overflow-hidden transition-all
//               ${
//                 activeImage === img
//                   ? "border-blue-500 shadow-sm"
//                   : "border-gray-200 hover:border-gray-300"
//               }`}
//           >
//             <img
//               src={img}
//               alt={`thumbnail-${index}`}
//               className="w-full h-full object-cover" // object-contain er bodole cover use korle thumbnail gulo bhalo dekhay
//             />
//           </button>
//         ))}
//       </div>
//     </div>
//   );
// };

// export default ProductImageGallery;