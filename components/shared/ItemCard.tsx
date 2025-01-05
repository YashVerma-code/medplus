


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
  const role = "admin";
  const className = role === "admin" ? "bg-black-500 text-white" : "bg-blue-500"; 

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
    <Card className="w-full bg-gradient-to-r from-gray-800 to-gray-900 text-white shadow-lg rounded-lg border border-gray-700">
    <CardContent className="pt-6 px-4">
      <h3 className="text-xl font-semibold text-white mb-2 uppercase tracking-wide">{itemName}</h3>
      <p className="text-gray-400 text-sm">Current Quantity: {quantity}</p>
    </CardContent>
    <CardFooter className="flex flex-col sm:flex-row justify-between items-center px-4 py-3 bg-gray-800 rounded-b-lg gap-3">
      <div className="flex items-center gap-3 w-full sm:w-auto">
        <input
          type="number"
          value={inputQuantity}
          onChange={handleQuantityChange}
          className="w-20 px-2 py-1 text-White rounded border-none focus:outline-none focus:ring-2 focus:ring-teal-400"
          min={0}
        />
        <Button
          onClick={handleUpdate}
          size="sm"
          className="bg-teal-500 text-white hover:bg-teal-600 focus:ring-2 focus:ring-teal-400 px-4 py-1 rounded"
        >
          Update
        </Button>
      </div>
      <Button
        onClick={onDelete}
        variant="destructive"
        size="sm"
        className="bg-red-500 text-white hover:bg-red-600 w-full sm:w-auto px-4 py-1 rounded"
      >
        Delete
      </Button>
    </CardFooter>
  </Card>
  
  );
}

