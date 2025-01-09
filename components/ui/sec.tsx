'use client';
import Image from 'next/image';

const Sec1 = () => {
  return (
    <div className=" w-full flex flex-col md:flex-row justify-center items-start md:items-center gap-10 mt-10 md:pl-16">

      <div className="flex gap-2 flex-col items-start justify-center self-start ml-7 md:ml-4 lg:ml-12 md:mt-16 md:basis-[48%]">
        <div className="text-black font-bold tracking-wide text-5xl md:text-5xl lg:text-7xl leading-tight mb-4">The Next Quality of <p className="text-emerald-600"> care for everyone</p></div>
        <p className="mt-1 text-black font-semibold text-lg md:text-xl lg:text-2xl">Revolutionizing Hospital Management with Cutting-Edge Technology</p>
        <button
                type="button"
                title="Login"
                className="bg-black/90 mt-10 shadow-lg hover:bg-gray-900 text-white font-semibold rounded-lg text-3xl px-6 py-2 tracking-wider text-center"
                onClick={() => window.location.href = '/sign-in'}
                >
                  Get Started
                </button>
      </div>

      
    <div className="flex flex-col items-center justify-center self-center h-full w-full md:basis-[52%] max-h-40px"><Image src="/assets/images/main.png" alt="medplus" layout="responsive" width={500} height={500} className="object-cover max-h-[500px]" />
    </div>
    
    </div>
  );
};

export default Sec1;


