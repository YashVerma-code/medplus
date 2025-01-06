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



  const filteredList = useMemo(() => {
    const lowercasedSearchTerm = searchTerm.toLowerCase().trim();
    return list.filter((item) =>
      (item?.itemName?.toLowerCase() ?? "").includes(lowercasedSearchTerm)
    );
  }, [list, searchTerm]);

  return (
    <div className="flex flex-col min-h-screen bg-gradient-to-br from-teal-100 to-blue-200">
      <header className="lg:sticky fixed top-16 sm:top-16 md:top-16 lg:top-0 z-10 w-full bg-lblue bg-opacity-20 backdrop-filter backdrop-blur-lg shadow-lg">
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
          </div>
        </div>
      </header>

      <main className="flex-grow p-6">
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
