'use client';
import Image from "next/image";
import { Menu } from 'lucide-react';
import { useState } from 'react';
import Sec1 from "./sec";
import Link from "next/link";




const Home = () => {


  return ( 
    <div className=" flex flex-col items-center justify-start gap-10 w-full">
      <header id="top" className="sticky top-0 z-10 w-full bg-white/10 shadow-md">
        <nav className="navbar bg-white/10 ring-1 ring-black/5 backdrop-blur-md p-4">
          <div className="container-fluid flex flex-wrap justify-between items-center max-sm:gap-5">
            <div className="flex items-center ">
              <Image src="/assets/images/logo-large2.png" alt="Logo" className="img-fluid" id="logo" width={100} height={100} />
              <div className=" text-4xl md:text-5xl font-bold text-black">MEDPLUS</div>
            </div>
            <div className="flex flex-row justify-center items-center gap-6 mr-5">
              <Link href={"/quiz"} title="Quiz" className="bg-blue-600  max-sm:hidden shadow-lg text-white bg-emerald-500 font-semibold rounded-full text-xl px-6 py-2 tracking-wider text-center">
                Take Free Mental Health Quiz
              </Link>
                <button
                type="button"
                title="Login"
                className="bg-black/90 shadow-lg hover:bg-gray-900 text-white font-semibold rounded-lg text-xl px-6 py-2 tracking-wider text-center"
                onClick={() => window.location.href = '/sign-in'}
                >
                Login
                </button>
           </div>
            
          </div>
        </nav>
      </header>
      <div className="w-full h-auto self-center">
        < Sec1/> 
      </div> 
      <div className="w-full h-auto self-center flex flex-col items-center justify-start gap-4 mt-10  px-10 md:px-32">
        <div className="text-5xl text-black font-bold text-center tracking-wide my-6 i ">Our components build better solutions.</div>
        <div className=" grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
            <div className="flex flex-col items-center justify-center gap-3 bg-[#112A46]/95 backdrop-blur-lg rounded-2xl shadow-lg py-4 px-6 lg:px-16 min-h-40">
            <div className="text-center text-2xl text-white font-semibold ">
            Hospital Nearby Finder
            </div>
            <div className="text-xl text-gray-100 font-medium text-center">Helps patients locate hospitals based on proximity</div>
            </div>

            <div className="flex flex-col items-center justify-center gap-3 bg-[#112A46]/95 backdrop-blur-lg rounded-2xl shadow-lg py-4 px-6 lg:px-16 min-h-40 ">
            <div className="text-center text-2xl text-white font-semibold ">
            Resource Management
            </div>
            <div className="text-xl text-gray-100 font-medium text-center">up-to-date information about hospital resources </div>
            </div>

            <div className="flex flex-col items-center justify-center gap-3 bg-[#112A46]/95 backdrop-blur-lg rounded-2xl shadow-lg py-4 px-6 lg:px-16 min-h-40">
            <div className="text-center text-2xl text-white font-semibold ">
            Medicine Info
            </div>
            <div className="text-xl text-gray-100 font-medium text-center"> Provides detailed insights into medications and patients records</div>
            </div>

            <div className="flex flex-col items-center justify-center gap-3 bg-[#112A46]/95 backdrop-blur-lg rounded-2xl shadow-lg py-4 px-6 lg:px-16 min-h-40">
            <div className="text-center text-2xl text-white font-semibold ">
            
Contact Doctor
            </div>
            <div className="text-xl text-gray-100 font-medium text-center">Enables direct communication between doctors and patients</div>
            </div>

            <div className="flex flex-col items-center justify-center gap-3 bg-[#112A46]/95 backdrop-blur-lg rounded-2xl shadow-lg py-4 px-6 lg:px-16 min-h-40">
            <div className="text-center text-2xl text-white font-semibold ">
            
Bed Management
            </div>
            <div className="text-xl text-gray-100 font-medium text-center">Facilitates real-time tracking of bed availability</div>
            </div>

            <div className="flex flex-col items-center justify-center gap-3 bg-[#112A46]/95 backdrop-blur-lg rounded-2xl shadow-lg py-4 px-6 lg:px-16 min-h-40">
            <div className="text-center text-2xl text-white font-semibold ">
            
Appointment Scheduling
            </div>
            <div className="text-xl text-gray-100 font-medium text-center"> Allows seamless booking for both patients and doctors</div>
            </div>
        </div>
      </div> 
      <div className="w-full flex flex-col gap-0 justify-start items-center mt-10">
      <div className="w-full flex flex-col md:flex-row justify-center items-start md:items-center gap-10 mt-10 md:pl-16  bg-emerald-500 py-6 md:py-2">
      <div className="flex flex-col items-center justify-center self-center h-full w-full md:basis-[52%] max-h-40px">
      <Image src="/assets/images/mental.png" alt="medplus" className="object-cover max-h-[300px] md:max-h-[400px]" width={400} height={300} />
    </div>
      <div className="flex gap-2 flex-col items-start justify-center self-start ml-7 md:ml-4 lg:ml-12 md:mt-16 md:basis-[48%]">
        <p className="text-black font-bold tracking-wide text-5xl md:text-5xl lg:text-5xl leading-tight mb-4">Take Care Of Your Mental Wellbeing</p>
        <p className="mt-1 text-gray-800 font-semibold text-lg md:text-xl lg:text-2xl">Quickly assess your mental well-being with our easy-to-use mental health quiz.This tool helps identify areas of concern and offers insights into your emotional state. Take the first step towards better mental health today</p>
        <a href="/sign-up" title="Quiz" className="bg-blue-600  my-4 max-sm:hidden shadow-lg text-white bg-black font-semibold rounded-xl text-2xl px-6 py-2 tracking-wider text-center">
                Take Quiz
              </a>
      </div>
      
      </div> 
      <footer className="bg-gray-900 text-white py-8 px-4 md:px-16 lg:px-24 w-full">
      <div className="container mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-8">
          <div>
            <h3 className="text-lg font-bold mb-4">About</h3>
            <ul>
              <li>
                <a href="#" className="hover:underline">
                  Our story
                </a>
              </li>
              <li>
                <a href="#" className="hover:underline">
                  Awards
                </a>
              </li>
              <li>
                <a href="#" className="hover:underline">
                  Our Team
                </a>
              </li>
              <li>
                <a href="#" className="hover:underline">
                  Career
                </a>
              </li>
            </ul>
          </div>
          <div>
            <h3 className="text-lg font-bold mb-4">Company</h3>
            <ul>
              <li>
                <a href="#" className="hover:underline">
                  Our services
                </a>
              </li>
              <li>
                <a href="#" className="hover:underline">
                  Clients
                </a>
              </li>
              <li>
                <a href="#" className="hover:underline">
                  Contact
                </a>
              </li>
              <li>
                <a href="#" className="hover:underline">
                  Press
                </a>
              </li>
            </ul>
          </div>
          <div>
            <h3 className="text-lg font-bold mb-4">Resources</h3>
            <ul>
              <li>
                <a href="#" className="hover:underline">
                  Blog
                </a>
              </li>
              <li>
                <a href="#" className="hover:underline">
                  Newsletter
                </a>
              </li>
              <li>
 <a href="#" className="hover:underline">
                  Documentation
                </a>
              </li>
              <li>
                <a href="#" className="hover:underline">
                  FAQs
                </a>
              </li>
            </ul>
          </div>
          <div>
            <h3 className="text-lg font-bold mb-4">Follow Us</h3>
            <ul className="flex space-x-4">
              <li>
                <a href="#" className="hover:underline">
                  Facebook
                </a>
              </li>
              <li>
                <a href="#" className="hover:underline">
                  Twitter
                </a>
              </li>
              <li>
                <a href="#" className="hover:underline">
                  Instagram
                </a>
              </li>
              <li>
                <a href="#" className="hover:underline">
                  LinkedIn
                </a>
              </li>
            </ul>
          </div>
        </div>
      </div>
      <div className="text-center mt-8">
        <p className="text-sm">&copy; {new Date().getFullYear()} Your Company. All rights reserved.</p>
      </div>
    </footer>
    </div>
    </div>
  );
};

export default Home; 