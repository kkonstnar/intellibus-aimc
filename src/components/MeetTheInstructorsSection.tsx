import React from 'react';

const MeetTheInstructorsSection: React.FC = () => {
  return (
    <section id="instructors" className="relative w-full bg-black py-16 px-4 sm:px-6 lg:px-8">
      {/* Section Title */}
      <div className="text-center mb-12">
        <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold text-white mb-4">
          Learn from World-Class Faculty
        </h2>
        <p className="text-white/90 text-lg max-w-2xl mx-auto">
          Led by experienced faculty. Panels and live sessions are featured in our paid experiences.
        </p>
      </div>

      {/* Instructor Profiles */}
      <div className="max-w-6xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
          
          {/* Instructor 1 - Ed Watal */}
          <div className="flex flex-col items-center text-left">
            {/* Instructor Photo */}
            <div className="relative w-48 h-48 mb-6">
              <div className="w-full h-full rounded-full overflow-hidden border-4 border-nyu-purple/20 shadow-lg shadow-nyu-purple/20">
                <img 
                  src="/Ed_Watal.jpg" 
                  alt="Ed Watal" 
                  className="w-full h-full object-cover"
                />
              </div>
            </div>
            
            {/* Name */}
            <h3 className="text-2xl sm:text-3xl font-bold text-white mb-2">
              Ed Watal
            </h3>
            
            {/* Title */}
            <p className="text-lg text-white/70 mb-6">
              Founder & Principal, Intellibus
            </p>
            
            {/* Bio */}
            <div className="text-left max-w-md">
              <p className="text-white/90 text-base leading-relaxed">
                Ed Watal is an AI thought leader and technology investor. He founded Intellibus, an Inc. 5000 Top 100 fastest-growing software firm, and leads BigParser, an ethical-AI data commons initiative. Forbes Books is collaborating with him on a seminal book about our AI future, and board members/C-suite leaders at major financial institutions rely on his strategic guidance for transformation.
              </p>
            </div>
          </div>

          {/* Instructor 2 - Jepson Taylor */}
          <div className="flex flex-col items-center text-left">
            {/* Instructor Photo */}
            <div className="relative w-48 h-48 mb-6">
              <div className="w-full h-full rounded-full overflow-hidden border-4 border-nyu-purple/20 shadow-lg shadow-nyu-purple/20">
                <img 
                  src="/jepson_taylor_headshot-1-e1705937899982.jpg" 
                  alt="Jepson Taylor" 
                  className="w-full h-full object-cover"
                />
              </div>
            </div>
            
            {/* Name */}
            <h3 className="text-2xl sm:text-3xl font-bold text-white mb-2">
              Jepson Taylor
            </h3>
            
            {/* Title */}
            <p className="text-lg text-white/70 mb-6">
              Former Chief AI Strategist, Dataiku
            </p>
            
            {/* Bio */}
            <div className="text-left max-w-md">
              <p className="text-white/90 text-base leading-relaxed">
                Jepson Taylor is a veteran AI leader with 18+ years in machine learning across semiconductors, finance, and enterprise software. Former Chief Data Scientist at HireVue (14 AI patents), he co-founded Zeff.ai (acquired by DataRobot), served as Chief AI Evangelist at DataRobot and Chief AI Strategist at Dataiku. He now co-founds a new AI venture bringing a breakthrough B2C product to market.
              </p>
            </div>
          </div>

        </div>
      </div>
    </section>
  );
};

export default MeetTheInstructorsSection;
