'use client'

import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ChevronLeft, ChevronRight, Trash, Edit } from 'lucide-react';
import { Input } from "@/components/ui/input";
import { useUser } from "@clerk/nextjs";

interface Item {
  _id: string;
  itemName: string;
  quantity: number;
  photo: string;
}

interface ItemCardpProps {
  items: Item[];
  itemsPerPage: number;
 
}

export function ItemCardp({ items, itemsPerPage }: ItemCardpProps) {
  
  const { user} = useUser();
  const [currentPage, setCurrentPage] = useState(1);
  const [currentItems, setCurrentItems] = useState<Item[]>([]);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editQuantity, setEditQuantity] = useState<number>(0);

  useEffect(() => {
    const indexOfLastItem = currentPage * itemsPerPage;
    const indexOfFirstItem = indexOfLastItem - itemsPerPage;
    setCurrentItems(items.slice(indexOfFirstItem, indexOfLastItem));
  }, [currentPage, items, itemsPerPage]);

  const totalPages = Math.ceil(items.length / itemsPerPage);

  const nextPage = () => {
    setCurrentPage((prev) => Math.min(prev + 1, totalPages));
  };

  const prevPage = () => {
    setCurrentPage((prev) => Math.max(prev - 1, 1));
  };

  const userRole = user?.publicMetadata?.role as string | undefined;

  return (
    <div className="space-y-4 ">
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 gap-y-7 ">
        {currentItems.map((item) => (
          <Card key={item._id} className="flex flex-col justify-between  bg-emerald-100 shadow-lg rounded-2xl">
             <img 
              src={item.photo} 
              alt={item.itemName} 
              className="w-full h-52 object-cover aspect-square rounded-t-2xl" 
            />
            <CardContent className="p-4">
              <h3 className="text-2xl font-semibold text-gray-800 mb-2 tracking-wider">{item.itemName.charAt(0).toUpperCase() + item.itemName.slice(1)}</h3>
              {editingId === item._id ? (
                <div className="flex items-center gap-2">
                  <Input
                    type="number"
                    value={editQuantity}
                    onChange={(e) => setEditQuantity(Number(e.target.value))}
                    className="w-20"
                  />                
                  <Button onClick={() => setEditingId(null)} variant="outline" size="sm">Cancel</Button>
                </div>
              ) : (
                <p className="text-gray-600 text-lg">Quantity: {item.quantity}</p>
              )}
            </CardContent>
            <CardFooter className={`flex justify-between items-center p-4  ${userRole=='patient'|| userRole=='doctor'? 'hidden': ''}`}>
            
             
            </CardFooter>
          </Card>
          
        ))}
      </div>
      <div className="flex justify-between items-center mt-4">
        <Button
          onClick={prevPage}
          disabled={currentPage === 1}
          variant="outline"
          size="sm"
        >
          <ChevronLeft className="h-4 w-4 mr-2" />
          Previous
        </Button>
        <span className="text-sm text-gray-600">
          Page {currentPage} of {totalPages}
        </span>
        <Button
          onClick={nextPage}
          disabled={currentPage === totalPages}
          variant="outline"
          size="sm"
        >
          Next
          <ChevronRight className="h-4 w-4 ml-2" />
        </Button>
      </div>
    </div>
  );
}
