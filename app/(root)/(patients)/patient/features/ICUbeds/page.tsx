'use client'
import React, { useEffect, useState } from 'react';
import Beds from './bed';

import {  Bed as B } from "lucide-react";

interface BedType {
  bedid: string;
  occupied: boolean;
  bedtype: string;
}

const Bed = () => {
  const [icuBeds, setIcuBeds] = useState<BedType[]>([]);
  const [generalWardBeds, setGeneralWardBeds] = useState<BedType[]>([]);
  const [privateRoomBeds, setPrivateRoomBeds] = useState<BedType[]>([]);
  const [isolationRoomBeds, setIsolationRoomBeds] = useState<BedType[]>([]);

  useEffect(() => {
    const fetchBeds = async () => {
      try {
        const response = await fetch('/api/bed');
        const data: BedType[] = await response.json();
        setIcuBeds(data.filter(bed => bed.bedtype.toLowerCase() === 'icu'));
        setGeneralWardBeds(data.filter(bed => bed.bedtype.toLowerCase() === 'general ward'));
        setPrivateRoomBeds(data.filter(bed => bed.bedtype.toLowerCase() === 'private ward'));
        setIsolationRoomBeds(data.filter(bed => bed.bedtype.toLowerCase() === 'isolation room'));
      } catch (error) {
        console.error('Error fetching beds:', error);
      }
    };

    fetchBeds();
  }, []);

  const renderBedSection = (title: string, beds: BedType[]) => (
    <div className="h-auto w-auto p-4 bg-white flex flex-col flex-wrap gap-3 rounded-lg shadow-lg ">
      <div className='text-4xl text-blue font-bold tracking-widest mb-3 '>{title}</div>
      <div className='flex flex-row gap-4 justify-start items-start flex-wrap'>
        {beds.map(bed => (
          <Beds key={bed.bedid} bed={bed} />
        ))}
      </div>
    </div>
  );

  return (
    <div >
      <header className="lg:sticky fixed top-16 sm:top-16 md:top-16 lg:top-0 z-10 w-full bg-lblue bg-opacity-20 backdrop-filter backdrop-blur-lg shadow-lg">
        <div className="container mx-auto px-4 py-2">
          <div className="flex flex-row gap-2 items-center justify-between ">
            <div className="flex items-center gap-1">
              <div className="bg-lblue bg-opacity-50 rounded-lg p-2">
                <B className="text-blue w-8 h-8" aria-hidden="true" />
              </div>
              <div className="flex flex-col">
                <h1 className="hidden lg:block text-2xl sm:text-3xl lg:text-3xl font-bold text-blue ml-0 sm:ml-2 leading-6 sm:leading-6">
                  Hospital Beds Status
                </h1>
                <p className="hidden lg:block text-blue-700 text-sm sm:text-base ml-0 sm:ml-2">
                  Check the availability of beds in the hospital
                </p>
              </div>
            </div>
            <div className="flex flex-row justify-end item-center gap-3 font-semibold text-lg  text-white">
                <div className='bg-gradient-to-b from-[#00F7DB] to-[#00D944] h-5 w-5 rounded-3xl self-center'></div>Empty
                <div className='bg-gradient-to-b from-[#FFE33F] to-[#FF9933] h-5 w-5 rounded-3xl self-center'></div>Occupied
              </div>
          </div>
        </div>
      </header>
    <div className="grid grid-cols-1  gap-4 p-4 mx-3 my-0 box-border min-h-screen rounded-lg mt-24 lg:mt-10">
        <div className=" rounded-lg rounded-tl-[18px] "> {renderBedSection('General Ward', generalWardBeds)}</div>
        <div className="  rounded-lg rounded-br-[18px]  ">{renderBedSection('ICU', icuBeds)}</div>
        <div className=" rounded-lg rounded-bl-[18px]  "> {renderBedSection('Private Room', privateRoomBeds)}</div>
        <div className="  rounded-lg  rounded-tr-[18px]   ">{renderBedSection('Isolation Room', isolationRoomBeds)}</div>
    </div>
    </div>
  );
}

export default Bed;