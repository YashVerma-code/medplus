'use client'

import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ChevronLeft, ChevronRight } from 'lucide-react';

interface Item {
  _id: string;
  itemName: string;
  quantity: number;
  photo: string;
}

interface ItemCardProps {
  items: Item[];
  itemsPerPage: number;
  onUpdate: (itemId: string, newQuantity: number) => void;
  onDelete: (itemId: string) => void;
}

export function ItemCard({ items, itemsPerPage, onUpdate, onDelete }: ItemCardProps) {
  const [currentPage, setCurrentPage] = useState(1);
  const [currentItems, setCurrentItems] = useState<Item[]>([]);

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

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 ">
        {currentItems.map((item) => (
          <Card key={item._id} className="flex flex-col justify-between bg-gradient-to-r from-gray-800 to-gray-900 text-white shadow-lg rounded-lg border border-gray-700 overflow-hidden">
            <img 
              src={item.photo} 
              alt={item.itemName} 
              className="w-full h-32 object-cover rounded-t-lg" 
            />
            <CardContent className="p-4">
              <h3 className="text-lg font-semibold text-white mb-2">{item.itemName}</h3>
              <p className="text-gray-400 text-sm">Quantity: {item.quantity}</p>
            </CardContent>
            <CardFooter className="flex justify-between items-center p-4 bg-gray-800 overflow-hidden">
              <div className="flex items-center gap-2">
                <input
                  type="number"
                  value={item.quantity}
                  onChange={(e) => {
                    const value = parseInt(e.target.value, 10);
                    onUpdate(item._id, isNaN(value) ? 0 : value);
                  }}
                  className="w-20 px-2 py-1 text-white bg-gray-700 rounded border-none focus:outline-none focus:ring-2 focus:ring-teal-400"
                  min={0}
                />
                <Button
                  onClick={() => onUpdate(item._id, item.quantity)}
                  size="sm"
                  className="bg-teal-500 text-white hover:bg-teal-600 focus:ring-2 focus:ring-teal-400 px-4 py-1 rounded"
                >
                  Update
                </Button>
              </div>
              <Button
                onClick={() => onDelete(item._id)}
                variant="destructive"
                size="sm"
                className="bg-red-500 text-white hover:bg-red-600 px-4 py-1 rounded ml-1"
              >
                Delete
              </Button>
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
          className="bg-gray-800 text-white hover:bg-gray-700"
        >
          <ChevronLeft className="h-4 w-4 mr-2" />
          Previous
        </Button>
        <span className="text-sm text-gray-400">
          Page {currentPage} of {totalPages}
        </span>
        <Button
          onClick={nextPage}
          disabled={currentPage === totalPages}
          variant="outline"
          size="sm"
          className="bg-gray-800 text-white hover:bg-gray-700"
        >
          Next
          <ChevronRight className="h-4 w-4 ml-2" />
        </Button>
      </div>
    </div>
  );
}
