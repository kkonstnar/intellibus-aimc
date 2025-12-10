import React from 'react';

const ValuePropositionSection: React.FC = () => {
  return (
    <section id="value-prop" className="relative w-full bg-black py-16 px-4 sm:px-6 lg:px-8 overflow-hidden">
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

      {/* Main Header */}
      <div className="relative z-10 text-center mb-16 max-w-4xl mx-auto">
        <h2 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-6">
          Get AI Fluent Fast. Executive Foundations
        </h2>
        <p className="text-lg sm:text-xl text-white/90 mb-8 leading-relaxed">
          Executive focus, not technical overload. Get practical guidance for board-level decisions on AI strategy and risk. Start free today and expand into the full masterclass when ready.
        </p>
      </div>

      {/* Value Proposition Blocks */}
      <div className="relative z-10 max-w-7xl mx-auto space-y-16">
        
        {/* Block 1: Image Left, Text Right */}
        <div className="flex flex-col lg:flex-row items-center gap-12">
          <div className="w-full lg:w-1/2">
            <div className="relative w-full aspect-video bg-black/20 backdrop-blur-sm rounded-lg border-2 border-nyu-purple/20 shadow-lg shadow-nyu-purple/10 overflow-hidden">
              <iframe
                src="https://player.mux.com/2Tsv5wIfxTCs9nEvzAsKkBva8KjWlnCK7KY76f845gI?metadata-video-title=Balvinder+-+Chaos+to+Clarity+ST25&video-title=Balvinder+-+Chaos+to+Clarity+ST25"
                style={{width: '100%', height: '100%', border: 'none'}}
                allow="accelerometer; gyroscope; autoplay; encrypted-media; picture-in-picture;"
                allowFullScreen
                title="Balvinder - Chaos to Clarity ST25"
              />
            </div>
          </div>
          
          <div className="w-full lg:w-1/2">
            <div className="text-center">
              <h3 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-nyu-light-violet-2 mb-6">
                Master AI Strategy Without the Technical Overwhelm
              </h3>
              <p className="text-lg text-white mb-8 leading-relaxed">
                Learn the proven frameworks used by Fortune 500 executives to identify AI opportunities, assess risks, and build winning AI strategies. Our proprietary methodology cuts through complexity to give you clear, actionable decision-making tools.
              </p>
              <button className="bg-nyu-purple hover:bg-nyu-purple/90 text-white px-6 py-3 rounded font-medium text-base transition-all duration-300 transform hover:scale-105">
                Learn the Framework
              </button>
            </div>
          </div>
        </div>

        {/* Block 2: Text Left, Image Right */}
        <div className="flex flex-col lg:flex-row-reverse items-center gap-12">
          <div className="w-full lg:w-1/2">
            <div className="relative w-full aspect-video bg-black/20 backdrop-blur-sm rounded-lg border-2 border-nyu-purple/20 shadow-lg shadow-nyu-purple/10 overflow-hidden">
              <iframe
                src="https://player.mux.com/XhjDhi75UrDiwTUtxPOe7LiBnQCGP5K02tUrRiMXQVYE?metadata-video-title=Naveen+Jain+Snippet+3+FT+2024&video-title=Naveen+Jain+Snippet+3+FT+2024"
                style={{width: '100%', height: '100%', border: 'none'}}
                allow="accelerometer; gyroscope; autoplay; encrypted-media; picture-in-picture;"
                allowFullScreen
                title="Naveen Jain Snippet 3 FT 2024"
              />
            </div>
          </div>
          
          <div className="w-full lg:w-1/2">
            <div className="text-center">
              <h3 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-nyu-light-violet-2 mb-6">
                See AI Success Stories from Industry Leaders
              </h3>
              <p className="text-lg text-white mb-8 leading-relaxed">
                Dive deep into real implementations from companies like yours. Learn from both successes and failures, understand the ROI calculations that matter, and discover the hidden pitfalls that derail AI initiatives.
              </p>
              <button className="bg-nyu-purple hover:bg-nyu-purple/90 text-white px-6 py-3 rounded font-medium text-base transition-all duration-300 transform hover:scale-105">
                Explore Case Studies
              </button>
            </div>
          </div>
        </div>

        {/* Block 3: Image Left, Text Right */}
        <div className="flex flex-col lg:flex-row items-center gap-12">
          <div className="w-full lg:w-1/2">
            <div className="relative w-full aspect-video bg-black/20 backdrop-blur-sm rounded-lg border-2 border-nyu-purple/20 shadow-lg shadow-nyu-purple/10 overflow-hidden">
              <iframe
                src="https://player.mux.com/HDd01yD1DDHKcZ701QHugR8z015WMZI8DT2QFytCuBLOq4?metadata-video-title=AIMC_+Testimonial_Vibhav_Prasad+%281%29&video-title=AIMC_+Testimonial_Vibhav_Prasad+%281%29"
                style={{width: '100%', height: '100%', border: 'none'}}
                allow="accelerometer; gyroscope; autoplay; encrypted-media; picture-in-picture;"
                allowFullScreen
                title="AIMC Testimonial Vibhav Prasad"
              />
            </div>
          </div>
          
          <div className="w-full lg:w-1/2">
            <div className="text-center">
              <h3 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-white mb-6">
                Stay Connected with AI-Forward Leaders
              </h3>
              <p className="text-lg text-white/90 mb-8 leading-relaxed">
                Get updates, occasional invites to live Q&A, and news from our executive community. Access to curated peer cohorts is part of our paid experiences.
              </p>
            </div>
          </div>
        </div>

      </div>
    </section>
  );
};

export default ValuePropositionSection;
