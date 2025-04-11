import React, { useState } from 'react';

const AccordionItem = ({ title, content }) => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="border-2 border-gray-200 rounded mb-2 overflow-hidden">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-full cursor-pointer px-4 py-2 text-left transition-colors duration-300 focus:outline-none flex justify-between items-center"
      >
        <span className="font-medium text-xs md:text-sm lg:text-lg">{title}</span>
        <span className="text-base lg:text-xl">{isOpen ? '-' : '+'}</span>
      </button>
      <div
        className={`transition-all duration-300 overflow-hidden ${
          isOpen ? 'max-h-96 p-4' : 'max-h-0 p-0'
        }`}
      >
        <p className="text-gray-700 text-sm lg:text-base text-justify">{content}</p>
      </div>
    </div>
  );
};

export default AccordionItem;