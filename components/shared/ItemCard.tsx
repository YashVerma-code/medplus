// import React from 'react';
// import { Card, CardContent, CardFooter } from "@/components/ui/card";
// import { Button } from "@/components/ui/button";

// interface ItemCardProps {
//   itemName: string;
//   quantity: number;
//   onIncrement: () => void;
//   onDecrement: () => void;
//   onDelete: () => void;
// }

// export function ItemCard({ itemName, quantity, onIncrement, onDecrement, onDelete }: ItemCardProps) {
//   return (
//     <Card className="w-full bg-white shadow-lg rounded-lg border border-gray-200">
//       <CardContent className="pt-6 px-4">
//         <h3 className="text-xl font-semibold text-gray-800 mb-2">{itemName}</h3>
//         <p className="text-gray-600 text-sm">Quantity: {quantity}</p>
//       </CardContent>
//       <CardFooter className="flex justify-between items-center px-4 py-3 bg-gray-100">
//         <div className="flex gap-2">
//           <Button
//             onClick={onDecrement}
//             size="sm"
//             className="bg-teal-500 text-white hover:bg-teal-600 focus:ring-2 focus:ring-teal-400"
//             disabled={quantity === 0}
//           >
//             -
//           </Button>
//           <Button
//             onClick={onIncrement}
//             size="sm"
//             className="bg-teal-500 text-white hover:bg-teal-600 focus:ring-2 focus:ring-teal-400"
//           >
//             +
//           </Button>
//         </div>
//         <Button
//           onClick={onDelete}
//           variant="destructive"
//           size="sm"
//           className="bg-red-500 text-white hover:bg-red-600"
//         >
//           Delete
//         </Button>
//       </CardFooter>
//     </Card>
//   );
// }

// import React, { useState } from 'react';
// import { Card, CardContent, CardFooter } from "@/components/ui/card";
// import { Button } from "@/components/ui/button";

// interface ItemCardProps {
//   itemName: string;
//   quantity: number;
//   onUpdate: (newQuantity: number) => void;
//   onDelete: () => void;
// }

// export function ItemCard({ itemName, quantity, onUpdate, onDelete }: ItemCardProps) {
//   const [inputQuantity, setInputQuantity] = useState(quantity);

//   const handleQuantityChange = (e: React.ChangeEvent<HTMLInputElement>) => {
//     const value = parseInt(e.target.value, 10);
//     setInputQuantity(isNaN(value) ? 0 : value);
//   };

//   const handleUpdate = () => {
//     if (inputQuantity >= 0) {
//       onUpdate(inputQuantity);
//     }
//   };

//   return (
//     <Card className="w-full bg-white shadow-lg rounded-lg border border-gray-200">
//       <CardContent className="pt-6 px-4">
//         <h3 className="text-xl font-semibold text-gray-800 mb-2">{itemName}</h3>
//         <p className="text-gray-600 text-sm">Current Quantity: {quantity}</p>
//       </CardContent>
//       <CardFooter className="flex justify-between items-center px-4 py-3 bg-gray-100">
//         <div className="flex items-center gap-2">
//           <input
//             type="number"
//             value={inputQuantity}
//             onChange={handleQuantityChange}
//             className="w-20 px-2 py-1 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-teal-400"
//             min={0}
//           />
//           <Button
//             onClick={handleUpdate}
//             size="sm"
//             className="bg-teal-500 text-white hover:bg-teal-600 focus:ring-2 focus:ring-teal-400"
//           >
//             Update
//           </Button>
//         </div>
//         <Button
//           onClick={onDelete}
//           variant="destructive"
//           size="sm"
//           className="bg-red-500 text-white hover:bg-red-600"
//         >
//           Delete
//         </Button>
//       </CardFooter>
//     </Card>
//   );
// }


import React, { useState, useEffect } from 'react';

// import React, { useState } from 'react';
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

// Assuming necessary components like Card, CardContent, CardFooter, and Button are imported elsewhere.  You'll need to add these imports based on your UI library (e.g., Tailwind UI, Chakra UI, Material UI).  For this example, I'll assume they exist.

interface ItemCardProps {
  itemName: string;
  quantity: number;
  onUpdate: (newQuantity: number) => void;
  onDelete: () => void;
  
}

export function ItemCard({ itemName, quantity, onUpdate, onDelete }: ItemCardProps) {
  const [inputQuantity, setInputQuantity] = useState(quantity);

  useEffect(() => {
    setInputQuantity(quantity);
  }, [quantity]);

  const handleQuantityChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = parseInt(e.target.value, 10);
    setInputQuantity(isNaN(value) ? 0 : value);
  };

  const handleUpdate = () => {
    if (inputQuantity >= 0) {
      onUpdate(inputQuantity);
    }
  };

  return (
    <Card className="w-full bg-white shadow-lg rounded-lg border border-gray-200">
      <CardContent className="pt-6 px-4">
        <h3 className="text-xl font-semibold text-gray-800 mb-2">{itemName}</h3>
        <p className="text-gray-600 text-sm">Current Quantity: {quantity}</p>
      </CardContent>
      <CardFooter className="flex flex-col sm:flex-row justify-between items-center px-4 py-3 bg-gray-100 gap-2">
        <div className="flex items-center gap-2 w-full sm:w-auto">
          <input
            type="number"
            value={inputQuantity}
            onChange={handleQuantityChange}
            className="w-20 px-2 py-1 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-teal-400"
            min={0}
          />
          <Button
            onClick={handleUpdate}
            size="sm"
            className="bg-teal-500 text-white hover:bg-teal-600 focus:ring-2 focus:ring-teal-400"
          >
            Update
          </Button>
        </div>
        <Button
          onClick={onDelete}
          variant="destructive"
          size="sm"
          className="bg-red-500 text-white hover:bg-red-600 w-full sm:w-auto"
        >
          Delete
        </Button>
      </CardFooter>
    </Card>
  );
}

