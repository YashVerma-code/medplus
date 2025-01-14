'use client'

import React, { useState } from 'react';
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Search, Menu, PlusIcon as HousePlus, Pill } from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Skeleton } from "@/components/ui/skeleton"
import { cn } from "@/lib/utils"
import { set } from 'lodash';
import Image from 'next/image';

import img2 from '../../../../../../public/assets/images/med.png'

export default function MedInfo() {
  const [medName, setMedName] = useState("");
  const [illness, setIllness] = useState("");
  const [data, setData] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [load, setLoad] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const handleSearch = async () => {
    setLoad(false);
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
    <div className="flex flex-col min-h-screen  bg-gradient-to-br from-teal-100 to-blue-200 ">
      {/* Header Section */}
 <header className="lg:sticky fixed top-16 sm:top-16 md:top-16 lg:top-0 z-10 w-full bg-lblue bg-opacity-20 backdrop-filter backdrop-blur-lg shadow-lg">
         <div className="container mx-auto px-4 py-2">
           <div className="flex gap-2 items-center justify-between ">
             <div className="flex items-center gap-1">
               <div className="bg-lblue bg-opacity-50 rounded-lg p-2">
                 <Pill className="text-blue w-8 h-8" aria-hidden="true" />
               </div>
               <div className="flex flex-col">
                 <h1 className="hidden lg:block text-2xl sm:text-3xl lg:text-3xl font-bold text-blue ml-0 sm:ml-2 leading-6 sm:leading-6">
                   MedInfo
                 </h1>
                 <p className="hidden lg:block text-blue-700 text-sm sm:text-base ml-0 sm:ml-2">
                 Your Health, Your Knowledge—Explore Medicines and Insights with MedInfo.
                 </p>
               </div>
             </div>
            
           </div>
         </div>
       </header>
      <main className="flex-grow p-6 mt-8 sm:mt-12 md:mt-10 mx-10">
        <Card className="mb-8 bg-lightblue-50 shadow-lg border-0">
          <CardContent className="p-6">
            <div className="grid md:grid-cols-2 gap-16">
              <div className="space-y-2">
                <Label htmlFor="med-name" className="text-lightblue-400 font-medium">
                  Enter the medicine name
                </Label>
                <Input
                  id="med-name"
                  type="text"
                  value={medName}
                  onChange={(e) => setMedName(e.target.value)}
                  className="bg-blue-50 border-lightblue-200 focus:border-blue focus:ring-lightblue-400  rounded-full"
                  placeholder="E.g. Aspirin"
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
                  className="bg-blue-50 border-lightblue-200 focus:border-blue focus:ring-lightblue-400  rounded-full"
                  placeholder="E.g. Headache"
                />
              </div>
            </div>
            <Button
              onClick={handleSearch}
              disabled={isLoading}
              className="mt-6 w-50px bg-lightblue-600 hover:bg-lightblue-800 text-white rounded-xl"
            >
              {isLoading ? (
                <>
                  <Skeleton className="h-4 w-4 mr-2 rounded-full animate-spin" />
                  Searching...
                </>
              ) : (
                <>
                  <Search className="w-4 h-4 mr-2  text-white" />
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

{load ? (
  <div className="px-10 py-4 flex flex-col lg:flex-row  justify-start items-center gap-10 mt-10 bg-emerald-200 w-full h-auto rounded-3xl shadow-lg border-0">
    <p className='text-gray-600 text-2xl tracking-wide leading-relaxed basis-1/2 font-normal'>Designed with you in mind, our easy-to-use feature makes finding the information you need a breeze. Search for medications by name, condition, or category and get the details you need quickly and efficiently.</p>
    <Image src={img2}
                            alt="Landscape picture"
                            width={300 }
                            height={250 }
                            className={`rounded-lg basis-1/2 `}
                        />
  </div>
) : isLoading ? (
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
          <div className="grid md:grid-cols-2 gap-24 md:px-10 ">
          <Card className="bg-lightblue-100 shadow-lg border-0">
            <CardHeader>
              <CardTitle className="text-emerald-400 text-4xl ml-4  tracking-widest">Reaction</CardTitle>
            </CardHeader>
            <CardContent>
              <ul className="list-disc pl-1 space-y-4">
                {data.patient.reaction.map((reaction: any, index: number) => (
                    <li key={index} className="list-none">
                    <Card className="transform transition-transform hover:scale-105 hover:shadow-xl rounded-lg bg-white p-4"> 
                      <div className="text-gray-700 text-lg font-medium">{reaction.reactionmeddrapt}</div>
                    </Card>
                    </li>
                ))}
              </ul>
            </CardContent>
          </Card>
        
          <Card className='bg-lightblue-100 shadow-lg border-0'>
      <CardHeader>
        <CardTitle className="text-emerald-400 text-4xl ml-3  tracking-widest">Drug Details</CardTitle>
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

