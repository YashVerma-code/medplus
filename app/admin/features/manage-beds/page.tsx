"use client";
import { useEffect, useState } from "react";
import Beds from "./bed";

interface BedType {
  _id: string;
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
        const response = await fetch("/api/bed");
        const data: BedType[] = await response.json();
        console.log(data);
        setIcuBeds(data.filter((bed) => bed.bedtype.toLowerCase() === "icu"));
        setGeneralWardBeds(
          data.filter((bed) => bed.bedtype.toLowerCase() === "general ward")
        );
        setPrivateRoomBeds(
          data.filter((bed) => bed.bedtype.toLowerCase() === "private ward")
        );
        setIsolationRoomBeds(
          data.filter((bed) => bed.bedtype.toLowerCase() === "isolation room")
        );
      } catch (error) {
        console.error("Error fetching beds:", error);
      }
    };

    fetchBeds();
  }, []);

  const renderBedSection = (title: string, beds: BedType[]) => (
    <div className="h-auto w-auto p-4 bg-white flex flex-col flex-wrap gap-3 rounded-lg shadow-lg ">
      <div className="text-4xl text-blue font-bold tracking-widest mb-3 ">
        {title}
      </div>
      <div className="flex flex-row gap-4 justify-start items-start flex-wrap">
        {beds.map((bed) => (
          <Beds key={bed.bedid} bed={bed} />
        ))}
      </div>
    </div>
  );

  return (
    <div className="bg-black min-h-screen">
      <div className="flex flex-col gap-6">
        <div className="sticky top-0 z-10 bg-black py-4">
          <div className="container flex gap-4 justify-between items-end mx-auto px-4 py-2">
            <div className="text-3xl text-white font-semibold tracking-wider">
              Click on Bed to Change the Status
            </div>
            <div className="flex flex-row justify-end item-center gap-3 font-semibold text-lg  text-white">
              <div className="bg-gradient-to-b from-[#00F7DB] to-[#00D944] h-5 w-5 rounded-3xl self-center"></div>
              Empty
              <div className="bg-gradient-to-b from-[#FFE33F] to-[#FF9933] h-5 w-5 rounded-3xl self-center"></div>
              Occupied
            </div>
          </div>
        </div>
        <div className="grid grid-cols-1 gap-4 p-4 mx-3 my-0 box-border min-h-screen rounded-lg lg:mt-7">
          <div className=" rounded-lg rounded-tl-[18px] ">
            {" "}
            {renderBedSection("General Ward", generalWardBeds)}
          </div>
          <div className="  rounded-lg rounded-br-[18px]  ">
            {renderBedSection("ICU", icuBeds)}
          </div>
          <div className=" rounded-lg rounded-bl-[18px]  ">
            {" "}
            {renderBedSection("Private Room", privateRoomBeds)}
          </div>
          <div className="  rounded-lg  rounded-tr-[18px]   ">
            {renderBedSection("Isolation Room", isolationRoomBeds)}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Bed;
