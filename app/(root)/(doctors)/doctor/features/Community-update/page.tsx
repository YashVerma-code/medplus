'use client'
import React, { useState, useEffect } from 'react';
import Card from './noticeCard';
import { MessageSquarePlus as B } from "lucide-react";
import { useUser } from "@clerk/nextjs";

interface Cardtype {
  username: string;
  tag: string;
  content: string;
  date: string;
  img: string;
  desc: string;
}

const Page = () => {
  const [cards, setCards] = useState<Cardtype[]>([]);
  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  const [tag, setTag] = useState<string>('');
  const [title, setTitle] = useState<string>('');
  const [content, setContent] = useState<string>('');
  const [image, setImage] = useState<string>('');
  const { user } = useUser();
  console.log(user);
  const handleTagChange = (tag: string) => {
    setSelectedTags((prevTags) =>
      prevTags.includes(tag) ? prevTags.filter((t) => t !== tag) : [...prevTags, tag]
    );
  };

  const filteredCards = selectedTags.length === 0 ? cards : cards.filter((card) => selectedTags.includes(card.tag));

  useEffect(() => {
    const fetchCard = async () => {
      try {
        const response = await fetch('/api/notice');
        const data: Cardtype[] = await response.json();
        console.log("after fetching", data);
        setCards(data);
      } catch (error) {
        console.error('Error fetching card:', error);
      }
    };
    fetchCard();
  }, []);
  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const newCard: Cardtype = {
      username: user?.firstName || 'Anonymous',
      tag,
      content,
      date: new Date().toLocaleDateString(),
      img: image,
      desc: title,
    };
    console.log("Submitting new card:", newCard); // Log the new card
    const response = await fetch('/api/notice', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(newCard),
    });
    if (response.ok) {
      const data: Cardtype = await response.json();
      setCards([data, ...cards]); // Prepend the new card to the list
      setTitle('');
      setContent('');
      setTag('');
      setImage('');
    } else {
      console.error('Error adding new card:', await response.json());
    }
  };

  return (
    <div>
      <header className="lg:sticky fixed top-16 sm:top-16 md:top-16 lg:top-0 z-10 w-full bg-lblue bg-opacity-20 backdrop-filter backdrop-blur-lg shadow-lg">
        <div className="container mx-auto px-4 py-2">
          <div className="flex gap-2 items-center justify-between ">
            <div className="flex items-center gap-1">
              <div className="bg-lblue bg-opacity-50 rounded-lg p-2">
                <B className="text-blue w-8 h-8" aria-hidden="true" />
              </div>
              <div className="flex flex-col">
                <h1 className="hidden lg:block text-2xl sm:text-3xl lg:text-3xl font-bold text-blue ml-0 sm:ml-2 leading-6 sm:leading-6">
                  Announcements
                </h1>
                <p className="hidden lg:block text-blue-700 text-sm sm:text-base ml-0 sm:ml-2">
                  Stay updated with the latest hospital announcements
                </p>
              </div>
            </div>
          </div>
        </div>
      </header>
      <div className='flex  flex-col-reverse mt-24 lg:mt-10 lg:flex-row gap-4 justify-start lg:justify-center items-start md:item-center'>
        <div className='w-full md:px-10  flex flex-col gap-6 overflow-auto '>
            {filteredCards.length > 0 ? (
            [...filteredCards].reverse().map((card, index) => (
              <Card key={index} card={card} />
            ))
            ) : (
            <div className="text-center text-gray-700 text-2xl font-semibold mt-40">
              No notices present
            </div>
            )}
        </div>
        <div className="bg-white rounded-lg shadow-md px-7 py-3 lg:self-start self-center flex flex-col  md:flex-row lg:flex-col lg:mr-6  gap-2">
          <div className='flex flex-row md:flex-col  lg:flex-row items-start justify-around  md:justify-start  lg:justify-around w-full'>
          <label htmlFor="filter" className="block text-xl font-semibold text-gray-700 mb-1 md:mb-10 md:text-2xl lg:mx-2">FILTER</label>
            <div>
              {['emergency', 'announcement', 'donation', 'event'].map((filter) => (
                <div key={filter} className="flex items-center">
                  <input
                    id={filter}
                    name="filter"
                    type="checkbox"
                    className="h-4 w-4 rounded-md text-indigo-600 border-e-cyan-700  focus:ring-[#45e9ffc8] bg-[#45e9ffc8]  "
                    onChange={() => handleTagChange(filter)}
                  />
                  <label htmlFor={filter} className="ml-2 block text-sm text-gray-900 md:text-2xl lg:text-xl focus-within:bg-indigo-600">
                    {filter.charAt(0).toUpperCase() + filter.slice(1)}
                  </label>
                </div>
              ))}
            </div>
            <div>
              {['job', 'volunteer', 'other'].map((filter) => (
                <div key={filter} className="flex items-center">
                  <input
                    id={filter}
                    name="filter"
                    type="checkbox"
                    className="h-4 w-4 rounded-md text-indigo-600 border-e-cyan-700  focus:ring-[#45e9ffc8] bg-[#45e9ffc8] "
                    onChange={() => handleTagChange(filter)}
                  />
                  <label htmlFor={filter} className="ml-2 block text-sm text-gray-900 md:text-2xl lg:text-xl focus-within:bg-indigo-600">
                    {filter.charAt(0).toUpperCase() + filter.slice(1)}
                  </label>
                </div>
              ))}
            </div>
          </div>
          <form className='mt-4' onSubmit={handleSubmit}>
            <h1 className="text-xl font-semibold text-gray-700 mb-1 mr-20">Post Notice</h1>
            <label htmlFor="title" className="block text-lg font-semibold text-gray-700 mb-1 mr-20">Title</label>
            <input type="text" onChange={(e) => setContent(e.target.value)} name="title" id="title" className="w-full border-2 border-gray-300 rounded-lg p-2" placeholder="Type your title here"/>
            <label htmlFor="notice" className="block text-lg font-semibold text-gray-700 mb-1 mr-20">Content</label> 
            <textarea name="notice" id="notice" className="w-full h-24 border-2 border-gray-300 rounded-lg p-2" placeholder="Type your notice here" onChange={(e) => setTitle(e.target.value)}></textarea>
            
            <label htmlFor="tag" className="block text-lg font-semibold text-gray-700 mb-1 mr-20">Tag</label>
            <select name="tag" id="tag" className="w-full border-2 border-gray-300 rounded-lg p-2" onChange={(e) => setTag(e.target.value)}>
              <option value="">Select a tag</option>
              <option value="emergency">Emergency</option>
              <option value="announcement">Announcement</option>
              <option value="donation">Donation</option>
              <option value="event">Event</option>
              <option value="job">Job</option>
              <option value="volunteer">Volunteer</option>
              <option value="other">Other</option>
            </select>
            <label htmlFor="image" className="block text-lg font-semibold text-gray-700 mb-1 mr-20">Image</label>
            <input type="file" name="image" id="image" className="w-full border-2 border-gray-300 rounded-lg p-2" onChange={(e) => setImage(e.target.files?.[0] ? URL.createObjectURL(e.target.files[0]) : '')}/>
            <button type="submit" className="bg-blue-500 hover:bg-blue-700 text-white bg-blue font-bold py-2 px-4 rounded mt-2">
              Submit
            </button>
          </form>
        </div>
      </div>
    </div>
  )
}

export default Page;