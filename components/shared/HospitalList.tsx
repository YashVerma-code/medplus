"use client";
import useGlobalStore from "@/zustand/useProps";
import React, { useEffect, useState } from "react";

interface Hospital {
  place_id: number;
  lat: string;
  lon: string;
  name: string;
  display_name: string;
}

interface HospitalListProps {
  hospitals: Hospital[]; // Prop expecting an array of hospitals
}

const HospitalList: React.FC<HospitalListProps> = ({ hospitals }) => {
  const { setLongitude, setLatitude, checkedIndex, setCheckedIndex } =
    useGlobalStore();

  const toggleCheckbox = (index: number) => {
    setCheckedIndex(checkedIndex === index ? null : index);
    const hospital = hospitals.find((hospital) => hospital.place_id === index);
    if (hospital) {
      setLatitude(parseFloat(hospital.lat));
      setLongitude(parseFloat(hospital.lon));
    }
  };

  function extractPincode(address: string): string | null {
    const regex = /\b\d{6}\b/; // Regular expression to match a 6-digit pincode
    const match = address.match(regex);
    return match ? match[0] : null; // If match is found, return the pincode, otherwise return null
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="w-full h-full flex flex-col items-center">
        <h2 className="text-lg font-semibold w-full text-center p-2">
          {hospitals.length === 0 ? `No hospitals found near your entered city`:`We found ${hospitals.length} results, all hospitals are cashless`}
        </h2>
        <div className="flex space-x-4 overflow-x-auto w-full p-4">
          {hospitals.map((hospital) => (
            <div
              key={hospital.place_id}
              className="p-4 w-full min-w-[250px] sm:w-[300px] md:w-[400px] rounded-lg shadow-md hover:shadow-xl hover:scale-105 transition-shadow duration-300 flex-shrink-0 space-y-3 text-gray-900 bg-gradient-to-br from-lblue to-blue border-gray-200"
            >
              {/* Checkbox */}
              <label className="flex items-center cursor-pointer space-x-3 float-right">
                <input
                  type="checkbox"
                  checked={checkedIndex === hospital.place_id}
                  onChange={() => toggleCheckbox(hospital.place_id)}
                  className="hidden"
                />
                <div
                  className={`w-5 h-5 border-2 rounded-md ${
                    checkedIndex === hospital.place_id
                      ? "bg-green-600 border-green-600 text-white "
                      : "border-gray-300 "
                  } flex items-center justify-center`}
                >
                  {checkedIndex === hospital.place_id && (
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="w-4 h-4"
                      viewBox="0 0 20 20"
                      fill="currentColor"
                    >
                      <path
                        fillRule="evenodd"
                        d="M16.707 5.293a1 1 0 00-1.414 0L8 12.586 5.707 10.293a1 1 0 10-1.414 1.414l3 3a1 1 0 001.414 0l8-8a1 1 0 000-1.414z"
                        clipRule="evenodd"
                      />
                    </svg>
                  )}
                </div>
              </label>
              {/* Pincode */}
              <div className="relative space-y-3">
                <p>
                  <span className="font-semibold text-xl"> Pincode :</span>
                  <span className="font-medium text-lg">
                    {extractPincode(hospital.display_name)}
                  </span>{" "}
                </p>

                {/* Hospital Name */}
                <h3 className="text-lg font-bold leading-tight">
                  {hospital.name}
                </h3>

                {/* Address */}
                <p className="text-sm ">{hospital.display_name}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default HospitalList;
