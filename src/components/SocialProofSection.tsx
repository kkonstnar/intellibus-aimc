import React from 'react';
import Link from 'next/link';

const SocialProofSection: React.FC = () => {
  return (
    <section id="social-proof" className="relative w-full bg-black py-16 px-4 sm:px-6 lg:px-8 overflow-hidden">
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

      {/* Section Title */}
      <div className="relative z-10 text-center mb-12">
        <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold text-white mb-4">
          What Leaders Are Saying
        </h2>
        <p className="text-white/90 text-lg max-w-2xl mx-auto">
          Hear how executives sharpened AI strategy, governance, and execution.
        </p>
      </div>

      {/* Video Grid */}
      <div className="relative z-10 max-w-6xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Video 1 - Ayan Bhattacharya */}
          <div className="flex flex-col items-center">
            <div className="relative w-full aspect-[9/16] max-w-sm bg-black/20 backdrop-blur-sm rounded-lg border border-nyu-purple/20 shadow-lg shadow-nyu-purple/10 mb-4 overflow-hidden">
              <iframe
                src="https://player.mux.com/YlIB7SgfglvXI6iYW1GUcYylbB4X9pCZh8YmEK8OQcU?metadata-video-title=Ayan+Testimonial+FT+2024+Short&video-title=Ayan+Testimonial+FT+2024+Short"
                style={{width: '100%', height: '100%', border: 'none'}}
                allow="accelerometer; gyroscope; autoplay; encrypted-media; picture-in-picture;"
                allowFullScreen
                title="Ayan Bhattacharya Testimonial"
              />
            </div>
            
            {/* Alumni Card */}
            <div className="bg-white/5 backdrop-blur-sm rounded-lg border border-nyu-purple/15 p-6 w-full max-w-sm text-center">
              <h3 className="text-white font-semibold text-lg mb-2">Ayan Bhattacharya</h3>
              <p className="text-white/70 text-sm mb-2">Vice President Generative AI Practice Leader</p>
              <p className="text-white/60 text-sm mb-3">CAPGEMINI</p>
              <p className="text-white/80 text-sm mt-3">"The AI Masterclass provided invaluable insights into strategic AI implementation and governance frameworks."</p>
            </div>
          </div>

          {/* Video 2 - Chen Wang */}
          <div className="flex flex-col items-center">
            <div className="relative w-full aspect-[9/16] max-w-sm bg-black/20 backdrop-blur-sm rounded-lg border border-nyu-purple/20 shadow-lg shadow-nyu-purple/10 mb-4 overflow-hidden">
              <iframe
                src="https://player.mux.com/6wLyiDCnfz02EGGLKUHqugfwQ00J9G6R01wEHFG37lRhIs?metadata-video-title=Chen+Testimonial+FT+2024+Short+&video-title=Chen+Testimonial+FT+2024+Short+"
                style={{width: '100%', height: '100%', border: 'none'}}
                allow="accelerometer; gyroscope; autoplay; encrypted-media; picture-in-picture;"
                allowFullScreen
                title="Chen Wang Testimonial"
              />
            </div>
            
            {/* Alumni Card */}
            <div className="bg-white/5 backdrop-blur-sm rounded-lg border border-nyu-purple/15 p-6 w-full max-w-sm text-center">
              <h3 className="text-white font-semibold text-lg mb-2">Chen Wang</h3>
              <p className="text-white/70 text-sm mb-2">Lead Alliance Solution Architect</p>
              <p className="text-white/60 text-sm mb-3">AI21 LABS</p>
              <p className="text-white/80 text-sm mt-3">"This program gave me the confidence to lead AI initiatives across our global operations."</p>
            </div>
          </div>

          {/* Video 3 - Dinesh Moorjani */}
          <div className="flex flex-col items-center">
            <div className="relative w-full aspect-[9/16] max-w-sm bg-black/20 backdrop-blur-sm rounded-lg border border-nyu-purple/20 shadow-lg shadow-nyu-purple/10 mb-4 overflow-hidden">
              <iframe
                src="https://player.mux.com/HpIigzK4vJXETHPzaZdtVxm7399uHkGbmmAa00JNqtfA?metadata-video-title=Dinesh+Testimonial+FT+2024+Short&video-title=Dinesh+Testimonial+FT+2024+Short"
                style={{width: '100%', height: '100%', border: 'none'}}
                allow="accelerometer; gyroscope; autoplay; encrypted-media; picture-in-picture;"
                allowFullScreen
                title="Dinesh Moorjani Testimonial"
              />
            </div>
            
            {/* Alumni Card */}
            <div className="bg-white/5 backdrop-blur-sm rounded-lg border border-nyu-purple/15 p-6 w-full max-w-sm text-center">
              <h3 className="text-white font-semibold text-lg mb-2">Dinesh Moorjani</h3>
              <p className="text-white/70 text-sm mb-2">Co Founder</p>
              <p className="text-white/60 text-sm mb-3">TINDER</p>
              <p className="text-white/80 text-sm mt-3">"The practical applications and real-world case studies were invaluable for my role."</p>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom CTA */}
      <div className="text-center mt-12">
        <Link 
          href="/course-listing"
          className="inline-block bg-nyu-purple hover:bg-nyu-purple/90 text-white px-8 py-3 rounded font-medium text-base transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-nyu-purple/25"
        >
          Enroll Now
        </Link>
      </div>
    </section>
  );
};

export default SocialProofSection;
