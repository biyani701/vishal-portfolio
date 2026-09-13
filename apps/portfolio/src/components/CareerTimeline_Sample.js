import React, { useState } from 'react';

// Career data
const careerData = [
  {
    company: "Tata Infotech Ltd.",
    duration: "May 2000 – Oct 2003",
    title: "Senior Software Engineer",
    logo: "/api/placeholder/60/60"
  },
  {
    company: "Cognizant Technology Solutions",
    duration: "Oct 2003 – Sep 2019",
    title: "Delivery Lead",
    logo: "/api/placeholder/60/60"
  },
  {
    company: "CoreCard India Software",
    duration: "Nov 2019 – Present",
    title: "Principal Project Analyst",
    logo: "/api/placeholder/60/60"
  }
];

export default function CareerTimelineSample() {
  const [activeIndex, setActiveIndex] = useState(null);
  
  return (
    <div className="w-full max-w-6xl mx-auto p-6">
      <h2 className="text-3xl font-bold text-center mb-12 text-blue-600">Career Timeline</h2>
      
      <div className="relative">
        {/* Timeline Line */}
        <div className="absolute h-1 bg-gradient-to-r from-blue-500 to-purple-600 top-8 left-0 right-0"></div>
        
        {/* Timeline Items */}
        <div className="flex justify-between relative">
          {careerData.map((item, index) => (
            <div 
              key={index} 
              className="flex flex-col items-center relative"
              onMouseEnter={() => setActiveIndex(index)}
              onMouseLeave={() => setActiveIndex(null)}
            >
              {/* Timeline Node */}
              <div className="w-4 h-4 bg-blue-500 rounded-full mb-2 mt-6 z-10"></div>
              
              {/* Card */}
              <div 
                className={`bg-white rounded-lg shadow-lg p-4 w-48 transform transition-all duration-300 ${
                  activeIndex === index ? 'scale-105 shadow-xl' : ''
                }`}
              >
                {/* Logo */}
                <div className="w-16 h-16 bg-gray-100 rounded-full mx-auto mb-3 overflow-hidden p-1">
                  <img 
                    src={item.logo} 
                    alt={`${item.company} logo`} 
                    className="w-full h-full object-contain"
                  />
                </div>
                
                {/* Content */}
                <h3 className="text-lg font-semibold text-blue-600 text-center mb-1">{item.company}</h3>
                <p className="text-sm font-medium text-gray-700 text-center">{item.title}</p>
                <p className="text-xs text-gray-500 text-center mt-1">{item.duration}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
      
      {/* Mobile View (appears below 768px) */}
      <div className="md:hidden mt-12">
        <div className="relative pl-8 border-l-2 border-blue-500">
          {careerData.map((item, index) => (
            <div key={index} className="mb-8 relative">
              {/* Timeline Node */}
              <div className="absolute w-4 h-4 bg-blue-500 rounded-full left-0 top-0 transform -translate-x-1/2"></div>
              
              {/* Card */}
              <div className="bg-white rounded-lg shadow p-4">
                {/* Logo & Company in row */}
                <div className="flex items-center mb-2">
                  <div className="w-10 h-10 bg-gray-100 rounded-full overflow-hidden p-1 mr-3">
                    <img 
                      src={item.logo} 
                      alt={`${item.company} logo`} 
                      className="w-full h-full object-contain"
                    />
                  </div>
                  <h3 className="text-md font-semibold text-blue-600">{item.company}</h3>
                </div>
                
                {/* Content */}
                <p className="text-sm font-medium text-gray-700">{item.title}</p>
                <p className="text-xs text-gray-500 mt-1">{item.duration}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}