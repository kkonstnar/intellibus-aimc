import React from 'react';

const FreeSyllabusPreviewSection: React.FC = () => {
  return (
    <section id="free-syllabus-preview" className="relative w-full bg-black py-16 px-4 sm:px-6 lg:px-8">
      {/* Section Header */}
      <div className="text-center mb-12 max-w-4xl mx-auto">
        <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold text-white mb-4">
          Inside the Free Course
        </h2>
        <p className="text-lg sm:text-xl text-white/90 mb-8 leading-relaxed">
          Preview the foundational modules before you enroll.
        </p>
      </div>

      {/* Modules List */}
      <div className="max-w-4xl mx-auto space-y-6 mb-12">
        
        {/* Module 1 */}
        <div className="relative bg-white/5 backdrop-blur-sm rounded-lg border border-nyu-purple/15 p-6 hover:bg-white/10 transition-all duration-300 overflow-hidden group">
          <div className="absolute inset-0 -translate-x-full group-hover:translate-x-full transition-transform duration-1000 bg-gradient-to-r from-transparent via-white/10 to-transparent"></div>
          <div className="flex items-start justify-between gap-4 relative z-10">
            <div className="flex-1">
              <h3 className="text-xl font-semibold text-white mb-2">
                AI Basics & Business Strategy
              </h3>
              <p className="text-white/80">
                Foundational concepts and strategic frameworks for AI implementation
              </p>
            </div>
          </div>
        </div>

        {/* Module 2 */}
        <div className="relative bg-white/5 backdrop-blur-sm rounded-lg border border-nyu-purple/15 p-6 hover:bg-white/10 transition-all duration-300 overflow-hidden group">
          <div className="absolute inset-0 -translate-x-full group-hover:translate-x-full transition-transform duration-1000 bg-gradient-to-r from-transparent via-white/10 to-transparent"></div>
          <div className="flex items-start justify-between gap-4 relative z-10">
            <div className="flex-1">
              <h3 className="text-xl font-semibold text-white mb-2">
                Operating Model for AI & Key Terms
              </h3>
              <p className="text-white/80">
                Build the right structure and master essential AI terminology
              </p>
            </div>
          </div>
        </div>

        {/* Module 3 */}
        <div className="relative bg-white/5 backdrop-blur-sm rounded-lg border border-nyu-purple/15 p-6 hover:bg-white/10 transition-all duration-300 overflow-hidden group">
          <div className="absolute inset-0 -translate-x-full group-hover:translate-x-full transition-transform duration-1000 bg-gradient-to-r from-transparent via-white/10 to-transparent"></div>
          <div className="flex items-start justify-between gap-4 relative z-10">
            <div className="flex-1">
              <h3 className="text-xl font-semibold text-white mb-2">
                AI Future State
              </h3>
              <p className="text-white/80">
                Vision for the future and how to prepare your organization
              </p>
            </div>
          </div>
        </div>

      </div>
    </section>
  );
};

export default FreeSyllabusPreviewSection;

