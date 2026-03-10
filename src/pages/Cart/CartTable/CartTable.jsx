import CartItem from "../CartItem/CartItem";

const CartTable = ({ items, onUpdateQuantity, onRemove }) => {
  return (
    <div className="lg:w-2/3 overflow-x-auto">
      <table className="w-full min-w-[600px]">
        <thead>
          <tr className="bg-gray-200 text-left text-sm text-gray-700">
            <th className="p-4 rounded-l-md font-bold uppercase tracking-wider">Product</th>
            <th className="p-4 font-bold uppercase tracking-wider">Unit Price</th>
            <th className="p-4 text-center font-bold uppercase tracking-wider">Quantity</th>
            <th className="p-4 font-bold uppercase tracking-wider">Subtotal</th>
            <th className="p-4 text-center rounded-r-md font-bold uppercase tracking-wider">Remove</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-100">
          {items.map((item) => (
            <CartItem
              key={item._id}
              item={item}
              onUpdateQuantity={onUpdateQuantity}
              onRemove={onRemove}
            />
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default CartTable;
















// import CartItem from "../CartItem/CartItem";

// const CartTable = ({ items, onUpdateQuantity }) => {
//   return (
//     <div className="lg:w-2/3 overflow-x-auto">
//       <table className="w-full min-w-[600px]">
//         <thead>
//           <tr className="bg-gray-200 text-left text-sm text-gray-700">
//             <th className="p-4 rounded-l-md font-bold uppercase tracking-wider">Product</th>
//             <th className="p-4 font-bold uppercase tracking-wider">Unit Price</th>
//             <th className="p-4 text-center font-bold uppercase tracking-wider">Quantity</th>
//             <th className="p-4 font-bold uppercase tracking-wider">Subtotal</th>
//             <th className="p-4 text-center rounded-r-md font-bold uppercase tracking-wider">Remove</th>
//           </tr>
//         </thead>
//         <tbody className="divide-y divide-gray-100">
//           {items.map((item) => (
//             <CartItem 
//               key={item.id} 
//               item={item} 
//               onUpdateQuantity={onUpdateQuantity} 
//             />
//           ))}
//         </tbody>
//       </table>
//     </div>
//   );
// };

// export default CartTable;