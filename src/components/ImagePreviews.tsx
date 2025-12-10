"use client";

import React, { useState, useEffect } from 'react';

const ImagePreviews: React.FC = () => {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [imagesLoaded, setImagesLoaded] = useState(false);

  // Course images from AI Masterclass events
  const courseImages = [
    {
      src: "https://landing-page-media-540334252609.s3.us-east-2.amazonaws.com/Day-1-Dinner.avif",
      alt: "Day 1 dinner networking",
      caption: "Day 1 Executive Dinner & Networking"
    },
    {
      src: "https://landing-page-media-540334252609.s3.us-east-2.amazonaws.com/Day-2-Networking.avif",
      alt: "Day 2 networking session",
      caption: "Day 2 Networking & Collaboration"
    },
    {
      src: "https://landing-page-media-540334252609.s3.us-east-2.amazonaws.com/EAC_AI-MASTERCLASS_D1-003.avif",
      alt: "AI Masterclass Day 1 session",
      caption: "Interactive AI Strategy Workshop"
    },
    {
      src: "https://landing-page-media-540334252609.s3.us-east-2.amazonaws.com/EAC_AI-MASTERCLASS_D1-008.avif",
      alt: "AI Masterclass Day 1 presentation",
      caption: "Executive Learning & Insights"
    },
    {
      src: "https://landing-page-media-540334252609.s3.us-east-2.amazonaws.com/EAC_AI-MASTERCLASS_D1-017.avif",
      alt: "AI Masterclass Day 1 workshop",
      caption: "Hands-On AI Implementation"
    },
    {
      src: "https://landing-page-media-540334252609.s3.us-east-2.amazonaws.com/EAC_AI-MASTERCLASS_D1-018.avif",
      alt: "AI Masterclass Day 1 collaboration",
      caption: "Peer-to-Peer Learning Sessions"
    },
    {
      src: "https://landing-page-media-540334252609.s3.us-east-2.amazonaws.com/EAC_AI-MASTERCLASS_D1-158.avif",
      alt: "AI Masterclass Day 1 discussion",
      caption: "Strategic AI Planning & Discussion"
    },
    {
      src: "https://landing-page-media-540334252609.s3.us-east-2.amazonaws.com/EAC_AI-MASTERCLASS_D2-27.avif",
      alt: "AI Masterclass Day 2 session",
      caption: "Advanced AI Strategy Implementation"
    },
    {
      src: "https://landing-page-media-540334252609.s3.us-east-2.amazonaws.com/EAC_AI-MASTERCLASS_D2-72.avif",
      alt: "AI Masterclass Day 2 workshop",
      caption: "Real-World Case Studies & Analysis"
    },
    {
      src: "https://landing-page-media-540334252609.s3.us-east-2.amazonaws.com/EAC_AI-MASTERCLASS_D2-76.avif",
      alt: "AI Masterclass Day 2 finale",
      caption: "Executive Capstone & Takeaways"
    }
  ];

  // Start loading images after initial page render completes
  // This gives browser time to load critical content first, then loads carousel images
  useEffect(() => {
    const timer = setTimeout(() => {
      setImagesLoaded(true);
      
      // Preload first few images immediately
      const link1 = document.createElement('link');
      link1.rel = 'preload';
      link1.as = 'image';
      link1.href = courseImages[0].src;
      document.head.appendChild(link1);

      const link2 = document.createElement('link');
      link2.rel = 'preload';
      link2.as = 'image';
      link2.href = courseImages[1].src;
      document.head.appendChild(link2);

      return () => {
        document.head.removeChild(link1);
        document.head.removeChild(link2);
      };
    }, 1000); // Start loading after 1 second (after hero is rendered)

    return () => clearTimeout(timer);
  }, [courseImages]);

  // Preload next and previous images for smooth transitions
  useEffect(() => {
    const nextIndex = (currentSlide + 1) % courseImages.length;
    const prevIndex = (currentSlide - 1 + courseImages.length) % courseImages.length;
    
    // Create invisible images to trigger browser caching
    const nextImg = new Image();
    const prevImg = new Image();
    nextImg.src = courseImages[nextIndex].src;
    prevImg.src = courseImages[prevIndex].src;
  }, [currentSlide, courseImages]);

  // Auto-advance slides every 5 seconds
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % courseImages.length);
    }, 5000);

    return () => clearInterval(timer);
  }, [courseImages.length]);

  const nextSlide = () => {
    setCurrentSlide((prev) => (prev + 1) % courseImages.length);
  };

  const prevSlide = () => {
    setCurrentSlide((prev) => (prev - 1 + courseImages.length) % courseImages.length);
  };

  const goToSlide = (index: number) => {
    setCurrentSlide(index);
  };

  return (
    <section className="relative w-full bg-black py-16 px-4 sm:px-6 lg:px-8">
      {/* Section Title */}
      <div className="text-center mb-12">
        <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold text-nyu-light-violet-2 mb-4">
          Experience Our In-Person Program
        </h2>
        <p className="text-white/70 text-lg max-w-2xl mx-auto">
          See what makes our intensive 2-day executive retreat the ultimate AI learning experience
        </p>
      </div>

      {/* Carousel Container */}
      <div className="max-w-6xl mx-auto">
        <div className="relative">
          {/* Main Image Display */}
          <div className="relative aspect-[16/9] rounded-lg overflow-hidden bg-black/20 backdrop-blur-sm border border-white/20">
            <img
              src={courseImages[currentSlide].src}
              alt={courseImages[currentSlide].alt}
              className="w-full h-full object-cover transition-opacity duration-500"
              loading="eager"
              decoding="async"
              fetchPriority="high"
              sizes="(max-width: 640px) 100vw, (max-width: 1024px) 90vw, 1200px"
              style={{ 
                imageRendering: 'auto',
                contentVisibility: 'auto'
              }}
            />
            
            {/* Image Overlay */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
            
            {/* Caption */}
            <div className="absolute bottom-6 left-6 right-6">
              <h3 className="text-white text-xl sm:text-2xl font-semibold mb-2">
                {courseImages[currentSlide].caption}
              </h3>
            </div>

            {/* Navigation Arrows */}
            <button
              onClick={prevSlide}
              className="absolute left-4 top-1/2 -translate-y-1/2 w-12 h-12 bg-black/50 hover:bg-black/70 text-white rounded-full flex items-center justify-center transition-all duration-200 backdrop-blur-sm border border-white/20"
              aria-label="Previous image"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
            </button>

            <button
              onClick={nextSlide}
              className="absolute right-4 top-1/2 -translate-y-1/2 w-12 h-12 bg-black/50 hover:bg-black/70 text-white rounded-full flex items-center justify-center transition-all duration-200 backdrop-blur-sm border border-white/20"
              aria-label="Next image"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </button>
          </div>

          {/* Thumbnail Navigation */}
          <div className="mt-6 flex justify-center space-x-3 overflow-x-auto pb-2">
            {courseImages.map((image, index) => (
              <button
                key={index}
                onClick={() => goToSlide(index)}
                className={`relative w-20 h-20 rounded-lg overflow-hidden border-2 transition-all duration-200 flex-shrink-0 ${
                  index === currentSlide
                    ? 'border-nyu-purple shadow-lg shadow-nyu-purple/25'
                    : 'border-white/20 hover:border-white/40'
                }`}
                aria-label={`Go to slide ${index + 1}`}
              >
                <img
                  src={image.src}
                  alt={image.alt}
                  className="w-full h-full object-cover"
                  loading="lazy"
                  decoding="async"
                  width="80"
                  height="80"
                  style={{ 
                    imageRendering: 'auto',
                    willChange: index === currentSlide ? 'auto' : 'transform'
                  }}
                />
                {index === currentSlide && (
                  <div className="absolute inset-0 bg-nyu-purple/20" />
                )}
              </button>
            ))}
          </div>

          {/* Slide Indicators */}
          <div className="mt-4 flex justify-center space-x-2">
            {courseImages.map((_, index) => (
              <button
                key={index}
                onClick={() => goToSlide(index)}
                className={`w-2 h-2 rounded-full transition-all duration-200 ${
                  index === currentSlide ? 'bg-nyu-purple' : 'bg-white/30 hover:bg-white/50'
                }`}
                aria-label={`Go to slide ${index + 1}`}
              />
            ))}
          </div>
        </div>

        {/* Call to Action */}
        <div className="text-center mt-12">
          <p className="text-white/70 text-lg mb-6">
            Ready to experience the full in-person AI executive retreat?
          </p>
          <button className="bg-nyu-purple hover:bg-nyu-purple/90 text-white px-8 py-4 rounded font-medium text-lg transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-nyu-purple/25">
            Reserve Your Spot
          </button>
        </div>
      </div>
    </section>
  );
};

export default ImagePreviews;
