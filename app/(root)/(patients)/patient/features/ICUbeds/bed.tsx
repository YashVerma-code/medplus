import React from 'react';

interface BedsType {
  bedid: string;
  occupied: boolean;
  bedtype: string;
}

interface BedsProps {
  bed: BedsType;
}

const Beds: React.FC<BedsProps> = ({ bed }) => {
  return (
    <div
      className={`min-w-20 min-h-20 flex justify-center items-center rounded-lg shadow-md transition-transform transform hover:scale-105 ${
      bed.occupied
        ? 'bg-gradient-to-b from-[#FFE33F] to-[#FF9933] text-gray-100' // Updated colors for occupied
        : 'bg-gradient-to-b from-[#00F7DB] to-[#00D944] text-gray-200' // Updated colors for empty
      }`}
    >
      <div className="text-center flex flex-col items-center justify-center">
      <div className="font-Poppins font-bold text-xl text-white ">{bed.bedid}</div>
     
      </div>
    </div>
  );
};

export default Beds;