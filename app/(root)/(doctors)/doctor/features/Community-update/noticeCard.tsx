'use client'
import Image from 'next/image';
import React, { useState } from 'react';

interface Cardtype {
    username: string;
    tag: string;
    content: string;
    date: string;
    img:string;
    desc:string;
}
interface CardProps {
    card: Cardtype;
}
            
const Card: React.FC<CardProps> = ({ card }) => {
    const currentDate = new Date().toLocaleDateString();
    const [isZoomed, setIsZoomed] = useState(false);
    
    const handleImageClick = () => {
        setIsZoomed(!isZoomed);
    };

    const handleOutsideClick = (e: React.MouseEvent<HTMLDivElement>) => {
        if (isZoomed && !e.currentTarget.contains(e.target as Node)) {
            setIsZoomed(false);
        }
    };

    return (
        <div>
        <div className="bg-white rounded-lg shadow-md flex flex-col justify-center items-start gap-2 px-7 py-6">
            <div className='flex flex-row justify-between item bg-center w-full'>
                <div className="flex flex-col items-center justify-center mb-2 gap-1">
                <div className='self-start text-2xl font-semibold'>{card.username}</div>

                <div className="text-gray-800 font-semibold">{card.content}</div>
                </div>
                <div className={`font-semibold text-base text-white px-3 py-1 pb-2 rounded-3xl  mr-12 self-start mt-2  ${
                    card.tag === 'emergency' ? 'bg-red-500' :
                    card.tag === 'announcement' ? 'bg-blue' :
                    card.tag === 'donation' ? 'bg-green-500' :
                    card.tag === 'event' ? 'bg-purple-500' :
                    card.tag === 'job' ? 'bg-yellow-500' :
                    card.tag === 'volunteer' ? 'bg-orange-500' :
                    'bg-gray-500'
                }`}>{card.tag}</div></div>
           
            <div className="text-gray-600">
                       {card.desc}
                    </div>
          
                <div onClick={handleOutsideClick} className={`relative ${isZoomed ? 'overflow-hidden' : ''}`}>
                    
                    <div onClick={handleImageClick} className={`cursor-pointer ${isZoomed ? 'fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-75' : ''}`}>
                        <Image
                            src={card.img}
                            alt="Landscape picture"
                            width={isZoomed ? 800 : 700}
                            height={isZoomed ? 600 : 500}
                            className={`rounded-lg transition-transform duration-300 ${isZoomed ? 'transform scale-150' : ''}`}
                        />
                    </div>
                </div>
            
            <div className="text-gray-600">
                {card.date}
            </div>
        </div>


        
        </div>
    )
}

export default Card;