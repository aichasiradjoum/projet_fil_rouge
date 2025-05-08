import React, { useState } from "react";
import { FaStar } from "react-icons/fa";
import { FiUser } from "react-icons/fi";

const testimonials = [
  {
    name: "Emily Rodriguez",
    title: "Graphic Engineer",
    text: "\"As a graphic designer trying to showcase my talent, this job portal was a game-changer. The creative-focused job categories made it easy to target design-related opportunities...\"",
  },
  {
    name: "Leslie Alexander",
    title: "Electrical Engineer",
    text: "\"I can't express how grateful I am to this job portal for transforming my job search. As a recent graduate, I was eager to kickstart my career as a Software Engineer...\"",
  },
  {
    name: "Mark Johnson",
    title: "Computer Engineer",
    text: "\"For anyone struggling with job hunting, I can't recommend this job portal enough. It changed the trajectory of my career...\"",
  },
];

const Temoignage = () => {
  const [activeIndex, setActiveIndex] = useState(0);

  const nextSlide = () => {
    setActiveIndex((prevIndex) => (prevIndex + 1) % testimonials.length);
  };

  const prevSlide = () => {
    setActiveIndex((prevIndex) => (prevIndex - 1 + testimonials.length) % testimonials.length);
  };

  const goToSlide = (index) => {
    setActiveIndex(index);
  };

  return (
    <div id="testimonial" className="bg-gradient-to-r from-indigo-50 to-blue-50 py-16 px-4 md:px-8 rounded-xl shadow-lg">
      <div className="max-w-4xl mx-auto">
        <h2 className="text-3xl font-bold text-center text-gray-800 mb-10">Temoignages</h2>
        <p className="text-center text-gray-600 mb-8">Découvrez ce que nos utilisateurs disent de nous.</p>
        <div className="relative">
          {/* Navigation Controls */}
          <div className="absolute top-1/2 -left-4 transform -translate-y-1/2 z-10">
            <button 
              onClick={prevSlide}
              className="bg-white p-2 rounded-full shadow-md hover:bg-gray-100 text-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-400 transition-all duration-300"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
            </button>
          </div>

          <div className="absolute top-1/2 -right-4 transform -translate-y-1/2 z-10">
            <button 
              onClick={nextSlide}
              className="bg-white p-2 rounded-full shadow-md hover:bg-gray-100 text-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-400 transition-all duration-300"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </button>
          </div>

          {/* Testimonials Carousel */}
          <div className="overflow-hidden">
            <div 
              className="flex transition-transform duration-500 ease-in-out" 
              style={{ transform: `translateX(-${activeIndex * 100}%)` }}
            >
              {testimonials.map((testimonial, index) => (
                <div key={index} className="min-w-full px-4">
                  <div className="bg-white rounded-xl p-8 shadow-md hover:shadow-lg transition-shadow duration-300">
                    <div className="flex items-center mb-6">
                      <div className="bg-blue-100 text-blue-600 p-3 rounded-full mr-4">
                        <FiUser className="w-6 h-6" />
                      </div>
                      <div>
                        <h3 className="font-bold text-lg text-gray-900">{testimonial.name}</h3>
                        <p className="text-gray-600">{testimonial.title}</p>
                      </div>
                    </div>

                    <p className="text-gray-700 leading-relaxed italic mb-6">{testimonial.text}</p>

                    <div className="flex items-center">
                      {Array.from({ length: 5 }).map((_, i) => (
                        <FaStar key={i} className="text-yellow-400 mr-1" />
                      ))}
                      <span className="text-gray-500 ml-2 text-sm">5.0</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Dots Indicator */}
          <div className="flex justify-center mt-8 space-x-2">
            {testimonials.map((_, index) => (
              <button
                key={index}
                onClick={() => goToSlide(index)}
                className={`w-3 h-3 rounded-full focus:outline-none transition-all duration-300 ${
                  activeIndex === index ? "bg-blue-600 w-6" : "bg-gray-300 hover:bg-gray-400"
                }`}
                aria-label={`Go to slide ${index + 1}`}
              />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Temoignage;