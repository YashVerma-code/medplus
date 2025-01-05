

"use client";

import React, { useState, useEffect, useMemo } from "react";
import { Input } from "@/components/ui/input";
import { Search, Menu, PlusIcon as HousePlus } from 'lucide-react';
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
// import Add from "@/components/shared/Add";
import { ItemCardp } from "@/components/shared/ItemCardp";

interface Item {
  _id: string;
  itemName: string;
  quantity: number;
}

export default function Resource() {
  const [list, setList] = useState<Item[]>([]);
  const [searchTerm, setSearchTerm] = useState<string>("");
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const className = "patient";

  const fetchData = async () => {
    setIsLoading(true);
    try {
      const response = await fetch(`/api/resources/add`);
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const data = await response.json();
      setList(data);
    } catch (error) {
      setError("Failed to fetch data. Please try again later.");
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleAddItem = async (item: Omit<Item, "_id">) => {
    setList((prevList) => [...prevList, { ...item, _id: "temp-id" }]);
    setIsLoading(true);
    setError(null);

    try {
      const response = await fetch(`/api/resources/add`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(item),
      });

      if (!response.ok) {
        throw new Error(`Failed to add item: ${response.status}`);
      }

      const newItem = await response.json();
      setList((prevList) =>
        prevList.map((listItem) =>
          listItem._id === "temp-id" ? newItem : listItem
        )
      );
      setIsAddDialogOpen(false);
    } catch (error) {
      console.error("Failed to add item:", error);
      setList((prevList) =>
        prevList.filter((listItem) => listItem._id !== "temp-id")
      );
      setError("Failed to add item. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleDeleteItem = async (itemId: string) => {
    setIsLoading(true);
    setError(null);
    try {
      const response = await fetch(`/api/resources/add?id=${itemId}`, {
        method: "DELETE",
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || `Failed to delete item: ${response.status}`);
      }

      setList((prevList) => prevList.filter((item) => item._id !== itemId));
    } catch (error) {
      setError("Failed to delete item. Please try again.");
      console.error("Error deleting item:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleUpdateItem = async (itemId: string, newQuantity: number) => {
    setIsLoading(true);
    setError(null);
    try {
      const response = await fetch(`/api/resources/add`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ id: itemId, newQuantity }),
      });

      if (!response.ok) {
        throw new Error(`Failed to update item quantity: ${response.status}`);
      }

      const updatedItem = await response.json();
      setList((prevList) =>
        prevList.map((listItem) =>
          listItem._id === itemId ? updatedItem : listItem
        )
      );
    } catch (error) {
      console.error("Failed to update item quantity:", error);
      setError("Failed to update item quantity. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const filteredList = useMemo(() => {
    const lowercasedSearchTerm = searchTerm.toLowerCase().trim();
    return list.filter((item) =>
      (item?.itemName?.toLowerCase() ?? "").includes(lowercasedSearchTerm)
    );
  }, [list, searchTerm]);

  return (
    <div className="flex flex-col min-h-screen bg-gradient-to-br from-teal-100 to-blue-200">
      <header className="sticky top-0 z-10 w-full bg-lblue bg-opacity-20 backdrop-filter backdrop-blur-lg shadow-lg">
        <div className="container mx-auto px-4 py-4 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="bg-blue-200 rounded-full p-2">
              <HousePlus className="text-blue-500 w-8 h-8" aria-hidden="true" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-blue-700">Inventory</h1>
              <p className="text-sm text-gray-500">Manage your resources effectively</p>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row items-center gap-3 w-full sm:w-auto">
            <div className="relative w-full sm:w-auto">
              <Input
                type="text"
                placeholder="Search items..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full sm:w-60 md:w-96 pr-10"
              />
              <Search className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 w-5 h-5" />
            </div>
            {/* <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
              <DialogTrigger asChild>
              <Button className="bg-blue text-white hover:bg-blue-600">
                Add Item
              </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Add New Item</DialogTitle>
                </DialogHeader>
                <Add onAdd={handleAddItem} />
              </DialogContent>
            </Dialog> */}
          </div>
        </div>
      </header>

      <main className="flex-grow">
        <div className="p-6 max-w-6xl mx-auto">
          {isLoading && (
            <p className="text-center text-gray-500 mt-8">Loading...</p>
          )}
          {error && <p className="text-center text-red-500 mt-8">{error}</p>}
          {filteredList.length === 0 && !isLoading ? (
            <p className="text-center text-gray-500 mt-8">
              No items found. Add some items to get started!
            </p>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredList.map((item) => (
                <ItemCardp
                  key={item._id}
                  itemName={item.itemName}
                  quantity={item.quantity}
                 
                  
                />
              ))}
            </div>
          )}
        </div>
      </main>
    </div>
  );
}

