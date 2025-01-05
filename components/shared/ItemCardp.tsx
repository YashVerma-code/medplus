


import React, { useState, useEffect } from 'react';

// import React, { useState } from 'react';
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

// Assuming necessary components like Card, CardContent, CardFooter, and Button are imported elsewhere.  You'll need to add these imports based on your UI library (e.g., Tailwind UI, Chakra UI, Material UI).  For this example, I'll assume they exist.

interface ItemCardpProps {
  itemName: string;
  quantity: number;
 
  
}

export function ItemCardp({ itemName, quantity}: ItemCardpProps) {
  const [inputQuantity, setInputQuantity] = useState(quantity);
  const role = "admin";
  const className = role === "admin" ? "bg-black-500 text-white" : "bg-blue-500"; 

  useEffect(() => {
    setInputQuantity(quantity);
  }, [quantity]);

 

  return (
    <Card className="w-full bg-white shadow-lg rounded-lg border border-gray-200">
      <CardContent className="pt-6 px-4">
        <h3 className="text-xl font-semibold text-gray-800 mb-2">{itemName}</h3>
        <p className="text-gray-600 text-sm">Current Quantity: {quantity}</p>
      </CardContent>
      <CardFooter className="flex flex-col sm:flex-row justify-between items-center px-4 py-3 bg-gray-100 gap-2">
        <div className="flex items-center gap-2 w-full sm:w-auto">
        
          
        </div>
      
      </CardFooter>
    </Card>
  );
}

