"use client";

import React, { useEffect, useRef } from 'react';
import Link from 'next/link';
import MuxPlayer from '@mux/mux-player-react';
import { initializeSmoothScroll } from '../utils/smoothScroll';
import { trackEvent } from '../utils/analytics';
import { useVideoTracking } from '../hooks/useVideoTracking';

const HeroSection: React.FC = () => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const muxPlayerRef = useRef<any>(null);
  
  const playbackId = "FQlNEHa3G90117sMdpV7cxXW8FGFZe34S8tEklf1xFDs";
  const posterUrl = "https://aimc-pics-540334252609.s3.us-east-2.amazonaws.com/Hero%20section%20thumbnail.png";

  // Enhanced video tracking
  const videoTracking = useVideoTracking({
    videoId: playbackId,
    videoTitle: "AI Masterclass Hero Video",
    location: "hero_section",
  });

  useEffect(() => {
    console.log('🎬 HeroSection mounted');
    console.log('🎥 Playback ID:', playbackId);
    console.log('📸 Poster URL:', posterUrl);
    
    // Test if poster image loads with detailed error info
    const img = new Image();
    img.onload = () => {
      console.log('✅ Poster image loaded successfully!');
      console.log('📐 Image dimensions:', img.width, 'x', img.height);
    };
    img.onerror = (e) => {
      console.error('❌ Failed to load poster image');
      console.error('🔗 URL:', posterUrl);
      console.error('💡 Make sure:');
      console.error('   1. Bucket policy allows GetObject for public');
      console.error('   2. Object ACL allows public read access');
      console.error('   3. CORS is enabled on the bucket');
      console.error('   4. File name matches exactly (check spaces)');
      
      // Try fetching to get more details
      fetch(posterUrl, { method: 'HEAD', mode: 'cors' })
        .then((response) => {
          console.log('📡 Fetch response status:', response.status);
          console.log('📡 Fetch response headers:', Object.fromEntries(response.headers.entries()));
        })
        .catch((err) => {
          console.error('📡 Fetch error details:', err);
        });
    };
    // Don't set crossOrigin initially - test if basic access works first
    img.src = posterUrl;
  }, []);

  useEffect(() => {
    const video = videoRef.current;
    if (video) {
      // Handle autoplay restrictions gracefully
      video.play().catch((error) => {
        // Autoplay was prevented - this is normal in many browsers
        // The video will still be visible and playable on user interaction
        if (error.name !== 'NotAllowedError') {
          console.error('Video play error:', error);
        }
      });
    }
    
    // Initialize smooth scrolling for anchor links with a small delay
    setTimeout(() => {
      initializeSmoothScroll();
    }, 100);
  }, []);


  return (
    <section className="relative min-h-screen w-full overflow-hidden bg-black">
      {/* Video Background */}
      <div className="absolute inset-0 z-0">
        <video
          ref={videoRef}
          className="h-full w-full object-cover"
          autoPlay
          muted
          loop
          playsInline
          onError={(e) => {
            console.error('Background video error:', e);
          }}
        >
          {/* AI Masterclass Hero Background Video */}
          <source src="/HeroBackgroundVideo.mp4" type="video/mp4" />
        </video>
        
        {/* Video Overlay */}
        <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-black/70 to-black/90" />
        <div className="absolute inset-0 bg-gradient-to-r from-nyu-purple/20 to-transparent" />
        {/* Bottom fade overlay for smooth transition */}
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-black/95" style={{background: 'linear-gradient(to bottom, transparent 0%, transparent 70%, rgba(0,0,0,0.95) 100%)'}} />
      </div>

      {/* Fixed Navigation */}
      <nav className="fixed top-0 left-0 right-0 z-50 flex items-center justify-between px-4 sm:px-6 lg:px-8 bg-black/80 backdrop-blur-md border-b border-nyu-purple/15 h-[11.11vh]">
        <div className="flex items-center space-x-4">
          <img 
            src="/AIMC_Angled_Horiz_w Title_Violet.png" 
            alt="AI Masterclass Logo" 
            className="h-[8vh] w-auto"
          />
        </div>
        
        <div className="hidden md:flex items-center space-x-8">
          <a href="#social-proof" className="text-white/80 hover:text-white transition-colors" onClick={() => trackEvent('nav_link_clicked', { linkText: 'Alumni', destination: 'social-proof' })}>Alumni</a>
          <a href="#instructors" className="text-white/80 hover:text-white transition-colors" onClick={() => trackEvent('nav_link_clicked', { linkText: 'Faculty', destination: 'instructors' })}>Faculty</a>
          <a href="#value-prop" className="text-white/80 hover:text-white transition-colors" onClick={() => trackEvent('nav_link_clicked', { linkText: 'Program', destination: 'value-prop' })}>Program</a>
          <a href="#faq" className="text-white/80 hover:text-white transition-colors" onClick={() => trackEvent('nav_link_clicked', { linkText: 'FAQ', destination: 'faq' })}>FAQ</a>
        </div>

        <Link 
          href="/course-listing"
          className="bg-nyu-purple hover:bg-nyu-purple/90 text-white px-4 py-1.5 rounded font-medium text-sm transition-colors inline-block text-center"
          onClick={() => trackEvent('nav_enroll_clicked', { location: 'navbar' })}
        >
          Enroll Now
        </Link>
      </nav>

      {/* Hero Content */}
      <div className="relative z-10 flex items-start min-h-screen px-4 sm:px-6 lg:px-8 pt-[20vh] pb-16">
        <div className="flex flex-col lg:flex-row w-full items-start min-h-full">
          {/* Desktop Video - Shows only on desktop (LEFT COLUMN) */}
          <div className="hidden lg:flex w-1/2 items-center justify-center pr-8 pt-8">
            <div className="relative w-full max-w-xs aspect-[9/16] bg-black/20 backdrop-blur-sm rounded-lg border border-nyu-purple/20 shadow-lg shadow-nyu-purple/10 overflow-hidden">
              <MuxPlayer
                ref={muxPlayerRef}
                playbackId={playbackId}
                poster={posterUrl}
                metadataVideoTitle="AI Masterclass Vertical Testimonial 2025"
                streamType="on-demand"
                className="w-full h-full"
                onLoadedMetadata={(e: any) => {
                  console.log('✅ Desktop MuxPlayer metadata loaded');
                  const duration = e.target?.duration || 0;
                  videoTracking.onLoadedMetadata(duration);
                }}
                onCanPlay={() => console.log('✅ Desktop MuxPlayer can play')}
                onLoadStart={() => console.log('🔄 Desktop MuxPlayer load started')}
                onPlay={videoTracking.onPlay}
                onPause={videoTracking.onPause}
                onEnded={videoTracking.onEnded}
                onTimeUpdate={(e: any) => {
                  const currentTime = e.target?.currentTime || 0;
                  const duration = e.target?.duration || 0;
                  videoTracking.onTimeUpdate(currentTime, duration);
                }}
                onError={(e: any) => console.error('❌ Desktop MuxPlayer error:', e)}
              />
            </div>
          </div>

          {/* Right Content (TEXT COLUMN) */}
          <div className="w-full lg:w-1/2 text-center lg:text-left max-w-2xl lg:pl-8">

          {/* Main Headline */}
          <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold text-white mb-4 animate-slide-up">
            <span className="block">AI Masterclass</span>
            <span className="block">Executive Education</span>
            <span className="block">(Free Online)</span>
          </h1>

          {/* Subtitle */}
          <p className="text-lg sm:text-xl md:text-2xl text-white/90 mb-6 max-w-2xl leading-relaxed animate-slide-up">
            Start with our complimentary online program. Upgrade anytime to the Full Online Masterclass or the Intensive In-Person Experience.
          </p>

          {/* CTA Button */}
          <div className="flex flex-col sm:flex-row items-center lg:items-start justify-center lg:justify-start animate-slide-up">
            <Link
              href="/course-listing"
              className="w-full max-w-sm sm:w-auto bg-nyu-purple hover:bg-nyu-purple/90 text-white px-6 py-3 rounded font-medium text-base transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-nyu-purple/25 text-center block"
              onClick={() => trackEvent('hero_cta_clicked', { 
                buttonText: 'Get Free Course Now',
                location: 'hero_section' 
              })}
            >
              Get Free Course Now
            </Link>
          </div>

          {/* Mobile Video - Shows only on mobile */}
          <div className="w-full lg:hidden flex items-center justify-center pt-8">
            <div className="relative w-full max-w-md aspect-[9/16] bg-black/20 backdrop-blur-sm rounded-lg border border-nyu-purple/20 shadow-lg shadow-nyu-purple/10 overflow-hidden">
              <MuxPlayer
                playbackId={playbackId}
                poster={posterUrl}
                metadataVideoTitle="AI Masterclass Vertical Testimonial 2025"
                streamType="on-demand"
                className="w-full h-full"
                onLoadedMetadata={(e: any) => {
                  console.log('✅ Mobile MuxPlayer metadata loaded');
                  const duration = e.target?.duration || 0;
                  videoTracking.onLoadedMetadata(duration);
                }}
                onCanPlay={() => console.log('✅ Mobile MuxPlayer can play')}
                onLoadStart={() => console.log('🔄 Mobile MuxPlayer load started')}
                onPlay={videoTracking.onPlay}
                onPause={videoTracking.onPause}
                onEnded={videoTracking.onEnded}
                onTimeUpdate={(e: any) => {
                  const currentTime = e.target?.currentTime || 0;
                  const duration = e.target?.duration || 0;
                  videoTracking.onTimeUpdate(currentTime, duration);
                }}
                onError={(e: any) => console.error('❌ Mobile MuxPlayer error:', e)}
              />
            </div>
          </div>

          {/* Partnership Logos */}
          <div className="mt-8 flex flex-col lg:flex-row items-start lg:items-center space-y-2 lg:space-y-0 lg:space-x-6 animate-fade-in">
            <p className="text-white/60 text-sm font-medium">Presented by:</p>
            <div className="flex items-center space-x-6">
              <img 
                src="/whiteNyuLogo.png" 
                alt="NYU Logo" 
                className="h-12 w-auto"
              />
              <img 
                src="/White_Text_Blue_Bkg-removebg-preview.png" 
                alt="Intellibus Logo" 
                className="h-12 w-auto"
              />
            </div>
          </div>
          </div>

        </div>
      </div>

    </section>
  );
};

export default HeroSection;
