"use client";

import React, { useState, useEffect, useMemo } from "react";
import { Input } from "@/components/ui/input";
import { Search, PlusIcon as HousePlus } from 'lucide-react';
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { ItemCardp } from "@/components/shared/ItemCardp";
import { DNA } from "react-loader-spinner";

interface Item {
  _id: string;
  itemName: string;
  quantity: number;
  photo:string;

}

export default function Resource() {
  const [list, setList] = useState<Item[]>([]);
  const [searchTerm, setSearchTerm] = useState<string>("");
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
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

 

  const filteredList = useMemo(() => {
    const lowercasedSearchTerm = searchTerm.toLowerCase().trim();
    return list.filter((item) =>
      (item?.itemName?.toLowerCase() ?? "").includes(lowercasedSearchTerm)
    );
  }, [list, searchTerm]);

  return (
    <div className="flex flex-col min-h-screen bg-gradient-to-br from-teal-100 to-blue-200">
        <header className="lg:sticky fixed top-16 sm:top-16 md:top-16 lg:top-0 z-10 w-full bg-lblue bg-opacity-20 backdrop-filter backdrop-blur-lg shadow-lg">
        <div className="container mx-auto px-4 py-2">
          <div className="flex gap-2 items-center justify-between ">
            <div className="flex items-center gap-1">
              <div className="bg-lblue bg-opacity-50 rounded-lg p-2">
                <HousePlus className="text-blue w-8 h-8" aria-hidden="true" />
              </div>
              <div className="flex flex-col">
                <h1 className="hidden lg:block text-2xl sm:text-3xl lg:text-3xl font-bold text-blue ml-0 sm:ml-2 leading-6 sm:leading-6">
                  Inventory
                </h1>
                <p className="hidden lg:block text-blue-700 text-sm sm:text-base ml-0 sm:ml-2">
                  Easily track and manage all your resources in one place, giving you the clarity and control you need
                </p>
              </div>
            </div>
            <div className="relative lg:w-96 w-full">
              <Search className="absolute left-2 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                type="search"
                placeholder="Search resources"
                className="pl-8"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
          </div>
        </div>
      </header>

      <main className="flex-grow p-6 mt-20 sm:mt-0">
        <div className="max-w-7xl mx-auto">
          {isLoading && (
            <div className="flex justify-center">
              <DNA
                visible={true}
                height="80"
                width="80"
                ariaLabel="dna-loading"
                wrapperStyle={{ filter: "hue-rotate(180deg)" }}
                wrapperClass="dna-wrapper"
              />
            </div>
          )}
          {error && <p className="text-center text-red-500 mt-8">{error}</p>}
          {filteredList.length === 0 && !isLoading ? (
            <p className="text-center text-gray-500 mt-8">
              No items found. Add some items to get started!
            </p>
          ) : (
            <ItemCardp
              items={filteredList}
              itemsPerPage={15}
          
            />
          )}
        </div>
      </main>
    </div>
  );
}
