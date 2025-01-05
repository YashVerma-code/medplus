'use client'

import React, { useState } from 'react';
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Search, Menu, PlusIcon as HousePlus, Pill } from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Skeleton } from "@/components/ui/skeleton"
import { cn } from "@/lib/utils"



export default function MedInfo() {
  const [medName, setMedName] = useState("");
  const [illness, setIllness] = useState("");
  const [data, setData] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const handleSearch = async () => {
    if (!medName || !illness) {
      setError("Please enter both medicine name and illness");
      return;
    }
  
    setIsLoading(true);
    setError(null);
    try {
      const response = await fetch(
        `https://api.fda.gov/drug/event.json?search=patient.drug.medicinalproduct:${medName}+AND+patient.reaction.reactionmeddrapt:${illness}&limit=1`
      );
  
      if (!response.ok) {
        throw new Error("Failed to fetch data");
      }
  
      const result = await response.json();
  
      // Enrich the drug data with additional info from the API
      const enrichedDrugs = result.results[0]?.patient.drug.map((drug: any) => ({
        ...drug,
        additionalInfo: `
          Medicinal Product: ${drug.medicinalproduct || "N/A"}
          Indication: ${drug.drugindication || "No specific indication provided"}
          Active Substance: ${drug.activesubstance?.activesubstancename || "Unknown"}
          Characterization: ${drug.drugcharacterization || "Unknown"}
        `,
      }));
  
      const enrichedData = {
        ...result.results[0],
        patient: {
          ...result.results[0]?.patient,
          drug: enrichedDrugs,
        },
      };
  
      setData(enrichedData);
    } catch (err) {
      setError("An error occurred while fetching data. Please try again.");
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };
  

  return (
    <div className="flex flex-col min-h-screen bg-gradient-to-br from-blue-50 to-teal-50">
      {/* Header Section */}
      <header className="sticky top-0 z-10 w-full bg-blue-300 bg-opacity-80 backdrop-filter backdrop-blur-lg shadow-lg">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="bg-blue-200 rounded-full p-2">
              <Pill className="text-blue w-8 h-8" aria-hidden="true" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-blue">Med-Info</h1>
              <p className="text-sm text-gray-500">Search the medicine for information</p>
            </div>
          </div>

          {/* Responsive Menu */}
          <div className="lg:hidden flex items-center">
            <Button variant="ghost" size="icon">
              <Menu className="h-6 w-6" />
            </Button>
          </div>
        </div>
      </header>

      <main className="flex-grow container mx-auto px-4 py-8">
        <Card className="mb-8 bg-lightblue-50 shadow-lg border-0">
          <CardContent className="p-6">
            <div className="grid md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <Label htmlFor="med-name" className="text-lightblue-400 font-medium">
                  Enter the medicine name
                </Label>
                <Input
                  id="med-name"
                  type="text"
                  value={medName}
                  onChange={(e) => setMedName(e.target.value)}
                  className="bg-blue-50 border-lightblue-200 focus:border-blue focus:ring-lightblue-400"
                  placeholder="e.g., Aspirin"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="illness" className="text-lightblue-400 font-medium">
                  Enter the illness
                </Label>
                <Input
                  id="illness"
                  type="text"
                  value={illness}
                  onChange={(e) => setIllness(e.target.value)}
                  className="bg-blue-50 border-lightblue-200 focus:border-blue focus:ring-lightblue-400"
                  placeholder="e.g., Headache"
                />
              </div>
            </div>
            <Button
              onClick={handleSearch}
              disabled={isLoading}
              className="mt-6 w-50px bg-lightblue-600 hover:bg-lightblue-800 text-white"
            >
              {isLoading ? (
                <>
                  <Skeleton className="h-4 w-4 mr-2 rounded-full animate-spin" />
                  Searching...
                </>
              ) : (
                <>
                  <Search className="w-4 h-4 mr-2  text-black" />
                  Search
                </>
              )}
            </Button>
          </CardContent>
        </Card>

        {error && (
          <div className="mb-8 p-4 bg-red-100 border border-red-400 text-red-700 rounded-lg">
            {error}
          </div>
        )}

        {isLoading ? (
          <div className="grid md:grid-cols-2 gap-8">
            {[1, 2].map((i) => (
              <Card key={i} className="bg-lightblue-100 shadow-lg border-0">
                <CardHeader>
                  <Skeleton className="h-6 w-32" />
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    {[1, 2, 3].map((j) => (
                      <Skeleton key={j} className="h-4 w-full" />
                    ))}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        ) : data && (
          <div className="grid md:grid-cols-2 gap-8">
          <Card className="bg-lightblue-100 shadow-lg border-0">
            <CardHeader>
              <CardTitle className="text-lightblue-400">Reaction</CardTitle>
            </CardHeader>
            <CardContent>
              <ul className="list-disc pl-5 space-y-4">
                {data.patient.reaction.map((reaction: any, index: number) => (
                  <Card key={index} className="transform transition-transform hover:scale-105 hover:shadow-xl rounded-lg bg-white p-4"> 
                    <div className="text-gray-700 text-lg font-medium">{reaction.reactionmeddrapt}</div>
                  </Card>
                ))}
              </ul>
            </CardContent>
          </Card>
        
          <Card className='bg-lightblue-100 shadow-lg border-0'>
      <CardHeader>
        <CardTitle className="text-lightblue-400">Drug Details</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {data.patient.drug?.map((drug: any, index: number) => (
            <Card 
              key={index} 
              className="transform transition-transform hover:scale-105 hover:shadow-xl rounded-lg bg-white p-4"
            >
              <div className="relative group">
                <span className="font-bold text-gray-500 cursor-pointer text-lg">
                  {drug.medicinalproduct}
                </span>
                <span className="text-gray-500"> - {drug.drugcharacterization}</span>

                {/* Modal/Tooltip - Positioned above with higher z-index */}
                <div className="absolute hidden group-hover:block bg-gray-800 text-white text-sm  rounded-lg shadow-lg w-60 p-4 left-0 z-50 whitespace-pre-line overflow-y-auto max-h-48 bottom-full mb-2">
                  <p><strong>Additional Info:</strong></p>
                  <p>{drug.additionalInfo}</p>
                </div>
              </div>
            </Card>
          ))}
        </div>
      </CardContent>
    </Card>
</div>
        
        )}
      </main>

     
    </div>
  );
}

