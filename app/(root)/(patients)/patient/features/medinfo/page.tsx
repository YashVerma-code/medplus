'use client'

import React, { useState } from 'react'
import Image from 'next/image'
import { motion, AnimatePresence } from 'framer-motion'
import { Search, Pill } from 'lucide-react'
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Skeleton } from "@/components/ui/skeleton"

export default function MedInfo() {
  const [medName, setMedName] = useState("")
  const [illness, setIllness] = useState("")
  const [data, setData] = useState<any>(null)
  const [isLoading, setIsLoading] = useState(false)
  const [load, setLoad] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const handleSearch = async () => {
    setLoad(false)
    if (!medName || !illness) {
      setError("Please enter both medicine name and illness")
      return
    }

    setIsLoading(true)
    setError(null)
    try {
      const response = await fetch(`
        https://api.fda.gov/drug/event.json?search=patient.drug.medicinalproduct:${medName}+AND+patient.reaction.reactionmeddrapt:${illness}&limit=1`)

      if (!response.ok) {
        throw new Error("Failed to fetch data")
      }

      const result = await response.json()

      const enrichedDrugs = result.results[0]?.patient.drug.map((drug: any) => ({
        ...drug,
        additionalInfo: `
          Medicinal Product: ${drug.medicinalproduct || "N/A"}
          Indication: ${drug.drugindication || "No specific indication provided"}
          Active Substance: ${drug.activesubstance?.activesubstancename || "Unknown"}
          Characterization: ${drug.drugcharacterization || "Unknown"}
        `,
      }))

      const enrichedData = {
        ...result.results[0],
        patient: {
          ...result.results[0]?.patient,
          drug: enrichedDrugs,
        },
      }

      setData(enrichedData)
    const uniqueDrugs = enrichedDrugs.filter(
      (drug: any, index: number, self: any[]) =>
        index === self.findIndex((d) => d.medicinalproduct === drug.medicinalproduct)
    )

    const uniqueData = {
      ...result.results[0],
      patient: {
        ...result.results[0]?.patient,
        drug: uniqueDrugs,
      },
    }

    setData(uniqueData)
    } catch (err) {
      setError("An error occurred while fetching data. Please try again.")
      console.error(err)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="flex flex-col min-h-screen bg-gradient-to-br from-teal-100 to-blue-200">
      <header className=" hidden lg:block lg:sticky fixed top-16 sm:top-16 md:top-16 lg:top-0 z-10 w-full bg-lblue bg-opacity-20 backdrop-filter backdrop-blur-lg shadow-lg">
        <div className="container mx-auto px-4 py-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
            <div className="bg-lblue bg-opacity-50 rounded-lg p-2">
                <Pill className="text-blue w-8 h-8" aria-hidden="true" />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-green-800">MedInfo</h1>
                <p className="hidden lg:block text-2xl sm:text-3xl lg:text-3xl font-bold text-blue ml-0 sm:ml-2 leading-6 sm:leading-6">Your Health, Your Knowledge</p>
              </div>
            </div>
          </div>
        </div>
      </header>

      <main className="flex-grow p-6 mt-8 mx-auto max-w-7xl w-full">
        <Card className="mb-8 bg-white shadow-lg border-0 overflow-hidden">
          <CardContent className="p-6">
            <div className="grid md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <Label htmlFor="med-name" className="text-green-700 font-medium">
                  Enter the medicine name
                </Label>
                <Input
                  id="med-name"
                  type="text"
                  value={medName}
                  onChange={(e) => setMedName(e.target.value)}
                  className="bg-green-50 border-green-200 focus:border-green-400 focus:ring-green-400 rounded-full"
                  placeholder="E.g. Aspirin"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="illness" className="text-green-700 font-medium">
                  Enter the illness
                </Label>
                <Input
                  id="illness"
                  type="text"
                  value={illness}
                  onChange={(e) => setIllness(e.target.value)}
                  className="bg-green-50 border-green-200 focus:border-green-400 focus:ring-green-400 rounded-full"
                  placeholder="E.g. Headache"
                />
              </div>
            </div>
            <Button
              onClick={handleSearch}
              disabled={isLoading}
              className="mt-6 bg-green-600 hover:bg-green-700 text-white rounded-full transition-colors duration-300"
            >
              {isLoading ? (
                <>
                  <Skeleton className="h-4 w-4 mr-2 rounded-full animate-spin" />
                  Searching...
                </>
              ) : (
                <>
                  <Search className="w-4 h-4 mr-2 text-white" />
                  Search
                </>
              )}
            </Button>
          </CardContent>
        </Card>

        <AnimatePresence>
          {error && (
            <motion.div
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="mb-8 p-4 bg-red-100 border border-red-400 text-red-700 rounded-lg"
            >
              {error}
            </motion.div>
          )}
        </AnimatePresence>

        <AnimatePresence>
          {load ? (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 20 }}
              className="px-10 py-8 flex flex-col lg:flex-row justify-start items-center gap-10 mt-10  bg-gradient-to-br from-teal-100 to-blue-200  "
            >
              <p className='text-gray-700 text-xl tracking-wide leading-relaxed basis-1/2 font-normal'>
                Designed with you in mind, our easy-to-use feature makes finding the information you need a breeze. Search for medications by name, condition, or category and get the details you need quickly and efficiently.
              </p>
              <Image
                src="/assets/images/med.png"
                alt="MedInfo illustration"
                width={300}
                height={250}
                className="rounded-lg basis-1/2"
              />
            </motion.div>
          ) : isLoading ? (
            <div className="grid md:grid-cols-2 gap-8">
              {[1, 2].map((i) => (
                <Card key={i} className="bg-green-50 shadow-lg border-0">
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
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="grid md:grid-cols-2 gap-8"
            >
              <Card className="bg-green-50 shadow-lg border-0 overflow-hidden">
                <CardHeader className="bg-bule">
                  <CardTitle className="text-black text-2xl">Reactions</CardTitle>
                </CardHeader>
                <CardContent className="p-4">
                  <ul className="space-y-4">
                    {data.patient.reaction.map((reaction: any, index: number) => (
                      <motion.li
                        key={index}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: index * 0.1 }}
                      >
                        <Card className="transform transition-all duration-300 hover:scale-105 hover:shadow-xl rounded-lg bg-white p-4">
                          <div className="text-gray-700 text-lg font-medium">{reaction.reactionmeddrapt}</div>
                        </Card>
                      </motion.li>
                    ))}
                  </ul>
                </CardContent>
              </Card>

              <Card className="bg-green-50 shadow-lg border-0 overflow-hidden">
                <CardHeader className="">
                  <CardTitle className="text-black text-2xl">Drug Details</CardTitle>
                </CardHeader>
                <CardContent className="p-4">
                  <div className="space-y-4">
                    {data.patient.drug?.map((drug: any, index: number) => (
                      <motion.div
                        key={index}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: index * 0.1 }}
                      >
                        <Card className="transform transition-all duration-300 hover:scale-105 hover:shadow-xl rounded-lg bg-white p-4">
                          <div className="relative group">
                            <span className="font-bold text-gray-700 cursor-pointer text-lg">
                              {drug.medicinalproduct}
                            </span>
                            <span className="text-gray-600 ml-2">- {drug.drugcharacterization}</span>

                            <div className="absolute hidden group-hover:block bg-gray-800 text-white text-sm  rounded-lg shadow-lg w-60 p-4 left-0 z-50 whitespace-pre-line overflow-y-auto max-h-48 bottom-full mb-2"><p><strong>Additional Info:</strong></p>
                              <p>{drug.additionalInfo}</p>
                            </div>
                          </div>
                        </Card>
                      </motion.div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          )}
        </AnimatePresence>
      </main>

    </div>
  )
}




// <div className="absolute hidden group-hover:block bg-gray-800 text-white text-sm  rounded-lg shadow-lg w-60 p-4 left-0 z-50 whitespace-pre-line overflow-y-auto max-h-48 bottom-full mb-2">
// <p><strong>Additional Info:</strong></p>
// <p>{drug.additionalInfo}</p>
// </div>