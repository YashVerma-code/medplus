"use client";

import React, { useState, useEffect, useMemo } from "react";
import { Input } from "@/components/ui/input";
import { Search, PlusIcon as HousePlus } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import Add from "@/components/shared/Add";
import { ItemCard } from "@/components/shared/ItemCard";
import { DNA } from "react-loader-spinner";
import { ThreeDots } from "react-loader-spinner";
import toast from "react-hot-toast";
interface Item {
  _id: string;
  itemName: string;
  quantity: number;
  photo: string;
}

export default function Resource() {
  const [list, setList] = useState<Item[]>([]);
  const [searchTerm, setSearchTerm] = useState<string>("");
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const className = "admin";

  const fetchData = async () => {
    setIsLoading(true);
    try {
      const response = await fetch(`/api/resources/add`);
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const data = await response.json();
      console.log(data);
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
  }, [list]);

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
      toast.success("Item added successfully")
      fetchData();
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
        throw new Error(
          errorData.error || `Failed to delete item: ${response.status}`
        );
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
    <div className="flex flex-col min-h-screen bg-black">
      <header className="lg:sticky fixed top-16 sm:top-16 md:top-16 lg:top-0 z-10 w-full bg-black bg-opacity-20 backdrop-filter backdrop-blur-lg shadow-lg">
        <div className="container mx-auto px-4 py-2">
          <div className="flex gap-2 items-center justify-between ">
            <div className="relative lg:w-96 w-full">
              <Search className="absolute left-2 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                type="search"
                placeholder="Search doctors by name or specialty"
                className="pl-8"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
              <DialogTrigger asChild>
                <Button className="bg-teal-500 text-white hover:bg-teal-600 focus:ring-2 focus:ring-teal-400">
                  Add Item
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Add New Item</DialogTitle>
                </DialogHeader>
                <Add onAdd={handleAddItem} />
              </DialogContent>
            </Dialog>
          </div>
        </div>
      </header>

      <main className="flex-grow p-6 mt-20 sm:mt-0">
        <div className="p-6 mx-auto">
          {isLoading && (
            <div className="h-[calc(100vh-65px)] mx-auto flex items-center justify-center">
              <ThreeDots
                visible={true}
                height="80"
                width="80"
                color="#2fe0d8"
              />
            </div>
          )}
          {error && <p className="text-center text-red-500 mt-8">{error}</p>}
          {filteredList.length === 0 && !isLoading ? (
            <p className="text-center text-gray-500 mt-8">
              No items found. Add some items to get started!
            </p>
          ) : (
            <ItemCard
              items={filteredList}
              itemsPerPage={8}
              onUpdate={handleUpdateItem}
              onDelete={handleDeleteItem}
            />
          )}
        </div>
      </main>
    </div>
  );
}
