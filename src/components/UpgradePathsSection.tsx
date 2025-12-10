"use client";

import React, { useState } from 'react';
import { trackEvent } from '../utils/analytics';

const UpgradePathsSection: React.FC = () => {
  const [showSuccess, setShowSuccess] = useState(false);

  const handleNotifyMe = () => {
    trackEvent('cta_clicked', {
      buttonText: 'Notify Me When Live',
      location: 'upgrade_paths_section',
      ctaType: 'notify_me',
      programType: 'full_online_masterclass'
    });
    
    setShowSuccess(true);
    // Reset after 5 seconds
    setTimeout(() => setShowSuccess(false), 5000);
  };

  return (
    <section id="upgrades" className="relative w-full bg-black py-16 px-4 sm:px-6 lg:px-8 overflow-hidden">
      {/* Video Background */}
      <div className="absolute inset-0 z-0">
        <video
          className="h-full w-full object-cover"
          autoPlay
          muted
          loop
          playsInline
        >
          <source src="/HeroBackgroundVideo.mp4" type="video/mp4" />
        </video>
        
        {/* Video Overlay */}
        <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-black/70 to-black/90" />
        <div className="absolute inset-0 bg-gradient-to-r from-nyu-purple/20 to-transparent" />
        {/* Top fade overlay for smooth transition from previous section */}
        <div className="absolute inset-0 bg-gradient-to-b from-black/95 via-transparent to-transparent" style={{background: 'linear-gradient(to bottom, rgba(0,0,0,0.95) 0%, transparent 30%, transparent 100%)'}} />
        {/* Bottom fade overlay for smooth transition to next section */}
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-black/95" style={{background: 'linear-gradient(to bottom, transparent 0%, transparent 70%, rgba(0,0,0,0.95) 100%)'}} />
      </div>

      {/* Section Header */}
      <div className="relative z-10 text-center mb-12 max-w-4xl mx-auto">
        <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold text-white mb-4">
          Ready for more?
        </h2>
        <p className="text-lg sm:text-xl text-white/90 mb-8 leading-relaxed">
          Start free today. When you want deeper immersion, choose the path that fits your schedule.
        </p>
      </div>

      {/* Two Cards */}
      <div className="relative z-10 max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-8 mb-12">
        
        {/* Card A - Intensive In-Person */}
        <div className="relative bg-white/5 backdrop-blur-sm rounded-lg border-2 border-nyu-purple/20 p-8 hover:border-nyu-purple/40 transition-all duration-300 overflow-hidden group">
          <div className="absolute inset-0 -translate-x-full group-hover:translate-x-full transition-transform duration-1000 bg-gradient-to-r from-transparent via-white/10 to-transparent"></div>
          
          {/* Badge */}
          <div className="inline-block bg-nyu-purple/20 border border-nyu-purple/30 rounded-full px-4 py-1 mb-4 relative z-10">
            <span className="text-white text-sm font-medium">In-Person • NYC</span>
          </div>
          
          {/* Title */}
          <h3 className="text-2xl sm:text-3xl font-bold text-white mb-3 relative z-10">
            AI Masterclass — Intensive In-Person
          </h3>
          
          {/* When/Where */}
          <p className="text-white text-lg font-medium mb-6 relative z-10">
            NYU, New York • Nov 20–22, 2025
          </p>
          
          {/* Bullets */}
          <ul className="space-y-4 mb-8 relative z-10">
            <li className="flex items-start gap-3">
              <span className="w-2 h-2 bg-nyu-purple rounded-full mt-2 flex-shrink-0"></span>
              <span className="text-white/90">Strategy labs, live cases, and executive panels</span>
            </li>
            <li className="flex items-start gap-3">
              <span className="w-2 h-2 bg-nyu-purple rounded-full mt-2 flex-shrink-0"></span>
              <span className="text-white/90">World-class faculty + curated peer network</span>
            </li>
            <li className="flex items-start gap-3">
              <span className="w-2 h-2 bg-nyu-purple rounded-full mt-2 flex-shrink-0"></span>
              <span className="text-white/90">2 weeks online prep + 2-day NYC immersion</span>
            </li>
            <li className="flex items-start gap-3">
              <span className="w-2 h-2 bg-nyu-purple rounded-full mt-2 flex-shrink-0"></span>
              <span className="text-white/90">Leave with a personalized AI roadmap</span>
            </li>
          </ul>
          
          {/* CTA */}
          <a 
            href="https://www.aimasterclass.com" 
            target="_blank" 
            rel="noopener noreferrer"
            className="inline-block bg-nyu-purple hover:bg-nyu-purple/90 text-white px-6 py-3 rounded font-medium transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-nyu-purple/25 relative z-10"
            onClick={() => trackEvent('cta_clicked', {
              buttonText: 'Explore In-Person',
              location: 'upgrade_paths_section',
              ctaType: 'explore_program',
              programType: 'intensive_in_person'
            })}
          >
            Explore In-Person →
          </a>
        </div>

        {/* Card B - Full Online Masterclass */}
        <div className="relative bg-white/5 backdrop-blur-sm rounded-lg border-2 border-nyu-purple/20 p-8 hover:border-nyu-purple/40 transition-all duration-300 overflow-hidden group">
          <div className="absolute inset-0 -translate-x-full group-hover:translate-x-full transition-transform duration-1000 bg-gradient-to-r from-transparent via-white/10 to-transparent"></div>
          
          {/* Badge */}
          <div className="inline-block bg-nyu-purple/20 border border-nyu-purple/30 rounded-full px-4 py-1 mb-4 relative z-10">
            <span className="text-white text-sm font-medium">Online • Self-Paced</span>
          </div>
          
          {/* Title */}
          <h3 className="text-2xl sm:text-3xl font-bold text-white mb-3 relative z-10">
            AI Masterclass — Full Online
          </h3>
          
          {/* Status */}
          <p className="text-white/70 text-lg font-medium mb-6 relative z-10">
            Coming Soon
          </p>
          
          {/* Bullets */}
          <ul className="space-y-4 mb-8 relative z-10">
            <li className="flex items-start gap-3">
              <span className="w-2 h-2 bg-nyu-purple rounded-full mt-2 flex-shrink-0"></span>
              <span className="text-white/90">Modular deep dives with executive use-cases</span>
            </li>
            <li className="flex items-start gap-3">
              <span className="w-2 h-2 bg-nyu-purple rounded-full mt-2 flex-shrink-0"></span>
              <span className="text-white/90">Optional live sessions and community forum</span>
            </li>
            <li className="flex items-start gap-3">
              <span className="w-2 h-2 bg-nyu-purple rounded-full mt-2 flex-shrink-0"></span>
              <span className="text-white/90">Templates, playbooks, and board prompts</span>
            </li>
            <li className="flex items-start gap-3">
              <span className="w-2 h-2 bg-nyu-purple rounded-full mt-2 flex-shrink-0"></span>
              <span className="text-white/90">Seamless upgrade from the free foundations</span>
            </li>
          </ul>
          
          {/* CTA */}
          <button 
            onClick={handleNotifyMe}
            className="inline-block bg-nyu-purple hover:bg-nyu-purple/90 text-white px-6 py-3 rounded font-medium transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-nyu-purple/25 relative z-10"
          >
            Notify Me When Live →
          </button>
          
          {/* Success Message */}
          {showSuccess && (
            <p className="text-green-400 text-sm mt-3 relative z-10">
              ✓ You're on the list. We'll email you when enrollment opens.
            </p>
          )}
        </div>

      </div>

      {/* Mini Comparison Table */}
      <div className="relative z-10 max-w-6xl mx-auto">
        <div className="bg-white/5 backdrop-blur-sm rounded-lg border border-nyu-purple/15 overflow-hidden">
          <div className="grid grid-cols-1 md:grid-cols-3 divide-y md:divide-y-0 md:divide-x divide-nyu-purple/15">
            
            {/* Row 1 - Delivery */}
            <div className="p-6">
              <h4 className="text-white font-semibold mb-2">Delivery</h4>
              <p className="text-white/70 text-sm mb-2">Self-paced online</p>
              <p className="text-white/50 text-sm italic">vs.</p>
              <p className="text-white/70 text-sm mt-2">2-day NYC workshop</p>
            </div>

            {/* Row 2 - Depth */}
            <div className="p-6">
              <h4 className="text-white font-semibold mb-2">Depth</h4>
              <p className="text-white/70 text-sm mb-2">Advanced modules + templates</p>
              <p className="text-white/50 text-sm italic">vs.</p>
              <p className="text-white/70 text-sm mt-2">Live labs + panels</p>
            </div>

            {/* Row 3 - Networking */}
            <div className="p-6">
              <h4 className="text-white font-semibold mb-2">Networking</h4>
              <p className="text-white/70 text-sm mb-2">Community forum</p>
              <p className="text-white/50 text-sm italic">vs.</p>
              <p className="text-white/70 text-sm mt-2">Curated peer cohort</p>
            </div>

          </div>
        </div>
      </div>
    </section>
  );
};

export default UpgradePathsSection;

