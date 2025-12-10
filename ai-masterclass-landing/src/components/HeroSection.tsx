import React, { useEffect, useRef } from 'react';

const HeroSection: React.FC = () => {
  const videoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    const video = videoRef.current;
    if (video) {
      video.play().catch(console.error);
    }
  }, []);

  return (
    <section className="relative h-screen w-full overflow-hidden bg-black">
      {/* Video Background */}
      <div className="absolute inset-0 z-0">
        <video
          ref={videoRef}
          className="h-full w-full object-cover"
          autoPlay
          muted
          loop
          playsInline
          poster="https://aimc-pics-540334252609.s3.us-east-2.amazonaws.com/Hero+section+thumbnail.png"
        >
          {/* Placeholder video - replace with actual AI/tech video */}
          <source src="https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4" type="video/mp4" />
        </video>
        
        {/* Video Overlay */}
        <div className="absolute inset-0 bg-gradient-to-b from-black/20 via-black/40 to-black/80" />
        <div className="absolute inset-0 bg-gradient-to-r from-nyu-purple/30 to-transparent" />
      </div>

      {/* Navigation */}
      <nav className="relative z-10 flex items-center justify-between px-4 py-6 sm:px-6 lg:px-8">
        <div className="flex items-center space-x-2">
          <div className="h-8 w-8 rounded-full bg-nyu-purple flex items-center justify-center">
            <span className="text-white font-bold text-sm">NYU</span>
          </div>
          <span className="text-white font-semibold text-lg">AI Masterclass</span>
        </div>
        
        <div className="hidden md:flex items-center space-x-8">
          <a href="#program" className="text-white/80 hover:text-white transition-colors">Program</a>
          <a href="#curriculum" className="text-white/80 hover:text-white transition-colors">Curriculum</a>
          <a href="#faculty" className="text-white/80 hover:text-white transition-colors">Faculty</a>
          <a href="#apply" className="text-white/80 hover:text-white transition-colors">Apply</a>
        </div>

        <button className="bg-nyu-purple hover:bg-nyu-purple/90 text-white px-6 py-2 rounded-full font-medium transition-colors">
          Enroll Now
        </button>
      </nav>

      {/* Hero Content */}
      <div className="relative z-10 flex items-center justify-center h-full px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-4xl mx-auto">
          {/* NYU Badge */}
          <div className="inline-flex items-center space-x-2 bg-white/10 backdrop-blur-sm rounded-full px-4 py-2 mb-8 animate-fade-in">
            <div className="h-2 w-2 bg-nyu-gold rounded-full animate-pulse-slow" />
            <span className="text-white/90 text-sm font-medium">In Partnership with NYU</span>
          </div>

          {/* Main Headline */}
          <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold text-white mb-6 animate-slide-up">
            <span className="block">AI Masterclass</span>
            <span className="block bg-gradient-to-r from-nyu-gold to-white bg-clip-text text-transparent">
              Executive Education
            </span>
          </h1>

          {/* Subtitle */}
          <p className="text-lg sm:text-xl md:text-2xl text-white/80 mb-8 max-w-3xl mx-auto leading-relaxed animate-slide-up">
            Master the future of artificial intelligence with world-class faculty and cutting-edge curriculum designed for executives and leaders.
          </p>

          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row items-center justify-center space-y-4 sm:space-y-0 sm:space-x-6 animate-slide-up">
            <button className="w-full sm:w-auto bg-nyu-purple hover:bg-nyu-purple/90 text-white px-8 py-4 rounded-full font-semibold text-lg transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-nyu-purple/25">
              Start Your Journey
            </button>
            <button className="w-full sm:w-auto border-2 border-white/30 hover:border-white text-white px-8 py-4 rounded-full font-semibold text-lg transition-all duration-300 backdrop-blur-sm hover:bg-white/10">
              Watch Trailer
            </button>
          </div>

          {/* Stats */}
          <div className="mt-16 grid grid-cols-1 sm:grid-cols-3 gap-8 max-w-2xl mx-auto animate-fade-in">
            <div className="text-center">
              <div className="text-3xl sm:text-4xl font-bold text-nyu-gold mb-2">12</div>
              <div className="text-white/70 text-sm sm:text-base">Week Program</div>
            </div>
            <div className="text-center">
              <div className="text-3xl sm:text-4xl font-bold text-nyu-gold mb-2">50+</div>
              <div className="text-white/70 text-sm sm:text-base">Industry Experts</div>
            </div>
            <div className="text-center">
              <div className="text-3xl sm:text-4xl font-bold text-nyu-gold mb-2">100%</div>
              <div className="text-white/70 text-sm sm:text-base">Online Learning</div>
            </div>
          </div>
        </div>
      </div>

      {/* Scroll Indicator */}
      <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 z-10 animate-bounce">
        <div className="w-6 h-10 border-2 border-white/30 rounded-full flex justify-center">
          <div className="w-1 h-3 bg-white/60 rounded-full mt-2 animate-pulse" />
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
