import React from 'react';
import { trackEvent } from '../utils/analytics';

const FinalCallSection: React.FC = () => {
  return (
    <section className="relative w-full bg-black py-16 px-4 sm:px-6 lg:px-8 overflow-hidden">
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

      {/* Two Column Layout */}
      <div className="relative z-10 max-w-6xl mx-auto">
        <div className="flex flex-col lg:flex-row items-center gap-12">
          
          {/* Left Column - Text Content */}
          <div className="w-full lg:w-1/2">
            <div className="text-left">
              {/* Main Heading */}
              <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-nyu-light-violet-2 mb-6 leading-tight">
                Final Recap
              </h2>

              {/* Descriptive Paragraph */}
              <p className="text-white text-lg mb-8 leading-relaxed">
                Don't let another day pass without gaining the AI expertise your career demands. Join 50+ Fortune 500 executives who've already transformed their leadership with our proven frameworks. This is your last chance to secure your spot in the next cohort and stay ahead of the AI revolution.
              </p>

              {/* Value Propositions */}
              <div className="space-y-4 mb-8">
                <div className="flex items-start">
                  <div className="w-6 h-6 bg-nyu-purple rounded-full flex items-center justify-center mr-4 flex-shrink-0 mt-1">
                    <svg className="w-3 h-3 text-white" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                    </svg>
                  </div>
                  <span className="text-white text-lg">Master AI strategy frameworks used by Fortune 500 leaders</span>
                </div>
                
                <div className="flex items-start">
                  <div className="w-6 h-6 bg-nyu-purple rounded-full flex items-center justify-center mr-4 flex-shrink-0 mt-1">
                    <svg className="w-3 h-3 text-white" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                    </svg>
                  </div>
                  <span className="text-white text-lg">Join exclusive network of AI-forward executives</span>
                </div>
                
                <div className="flex items-start">
                  <div className="w-6 h-6 bg-nyu-purple rounded-full flex items-center justify-center mr-4 flex-shrink-0 mt-1">
                    <svg className="w-3 h-3 text-white" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                    </svg>
                  </div>
                  <span className="text-white text-lg">Get immediate access to cutting-edge AI insights</span>
                </div>
              </div>

              {/* Main CTA Button */}
              <div className="mb-6">
                <a 
                  href="https://learn.aimasterclass.com/course/free-ai-masterclass"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-block w-full sm:w-auto bg-nyu-purple hover:bg-nyu-purple/90 text-white px-12 py-4 rounded font-medium text-xl transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-nyu-purple/25 text-center"
                  onClick={() => trackEvent('cta_clicked', {
                    buttonText: 'SECURE YOUR SPOT NOW',
                    location: 'final_call_section',
                    ctaType: 'enroll_now'
                  })}
                >
                  SECURE YOUR SPOT NOW
                </a>
              </div>

            </div>
          </div>

          {/* Right Column - Video */}
          <div className="w-full lg:w-1/2">
            <div className="relative w-full aspect-video bg-black/20 backdrop-blur-sm rounded-lg border-2 border-nyu-purple/20 shadow-lg shadow-nyu-purple/10 overflow-hidden">
              <iframe
                src="https://player.mux.com/64KM2EXTWKytbMWP2tJKJqvsJGdNUz4wKPRX5vW8PKU?metadata-video-title=AIMC_Testimonial_Robert+Jakobsze_1&video-title=AIMC_Testimonial_Robert+Jakobsze_1"
                style={{width: '100%', height: '100%', border: 'none'}}
                allow="accelerometer; gyroscope; autoplay; encrypted-media; picture-in-picture;"
                allowFullScreen
                title="AIMC Testimonial Robert Jakobsze"
              />
            </div>
          </div>

        </div>
      </div>
    </section>
  );
};

export default FinalCallSection;

