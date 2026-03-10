import { useState } from "react";

const ProductImageZoom = ({ Image }) => {
  const [pos, setPos] = useState({ x: 50, y: 50 });

  const handleMove = (e) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const x = ((e.clientX - rect.left) / rect.width) * 100;
    const y = ((e.clientY - rect.top) / rect.height) * 100;
    setPos({ x, y });
  };

  return (
    <div
      onMouseMove={handleMove}
      className="w-full h-[420px] overflow-hidden rounded-lg cursor-zoom-in"
    >
      <img
        src={Image}
        alt="product"
        className="w-full h-full object-contain scale-[1.7] transition-transform duration-200"
        style={{
          transformOrigin: `${pos.x}% ${pos.y}%`,
        }}
      />
    </div>
  );
};

export default ProductImageZoom;
