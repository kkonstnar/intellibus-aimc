import React from 'react';

const WhatYouGetSection: React.FC = () => {
  return (
    <section id="what-you-get" className="relative w-full bg-black py-16 px-4 sm:px-6 lg:px-8">
      {/* Section Header */}
      <div className="text-center mb-12 max-w-4xl mx-auto">
        <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold text-white mb-4">
          Executive Foundations in AI
        </h2>
        <p className="text-lg sm:text-xl text-white/90 mb-8 leading-relaxed">
          Complimentary, self-paced modules for senior leaders and boards.
        </p>
      </div>

      {/* 6-Item Grid */}
      <div className="max-w-6xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-12">
          
          {/* Item 1 */}
          <div className="relative bg-white/5 backdrop-blur-sm rounded-lg border border-nyu-purple/15 p-6 hover:bg-white/10 transition-all duration-300 overflow-hidden group">
            <div className="absolute inset-0 -translate-x-full group-hover:translate-x-full transition-transform duration-1000 bg-gradient-to-r from-transparent via-white/10 to-transparent"></div>
            <div className="w-12 h-12 bg-nyu-purple/20 rounded-lg flex items-center justify-center mb-4 relative z-10">
              <svg className="w-6 h-6 text-white" fill="currentColor" viewBox="0 0 24 24">
                <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/>
              </svg>
            </div>
            <h3 className="text-lg font-semibold text-white mb-2 relative z-10">AI Strategy Primers</h3>
            <p className="text-white/80 text-sm relative z-10">Board-level questions that clarify direction and investment.</p>
          </div>

          {/* Item 2 */}
          <div className="relative bg-white/5 backdrop-blur-sm rounded-lg border border-nyu-purple/15 p-6 hover:bg-white/10 transition-all duration-300 overflow-hidden group">
            <div className="absolute inset-0 -translate-x-full group-hover:translate-x-full transition-transform duration-1000 bg-gradient-to-r from-transparent via-white/10 to-transparent"></div>
            <div className="w-12 h-12 bg-nyu-purple/20 rounded-lg flex items-center justify-center mb-4 relative z-10">
              <svg className="w-6 h-6 text-white" fill="currentColor" viewBox="0 0 24 24">
                <path d="M12 1L3 5v6c0 5.55 3.84 10.74 9 12 5.16-1.26 9-6.45 9-12V5l-9-4zm-2 16l-4-4 1.41-1.41L10 14.17l6.59-6.59L18 9l-8 8z"/>
              </svg>
            </div>
            <h3 className="text-lg font-semibold text-white mb-2 relative z-10">Governance & Risk</h3>
            <p className="text-white/80 text-sm relative z-10">Practical guardrails and oversight frameworks that scale.</p>
          </div>

          {/* Item 3 */}
          <div className="relative bg-white/5 backdrop-blur-sm rounded-lg border border-nyu-purple/15 p-6 hover:bg-white/10 transition-all duration-300 overflow-hidden group">
            <div className="absolute inset-0 -translate-x-full group-hover:translate-x-full transition-transform duration-1000 bg-gradient-to-r from-transparent via-white/10 to-transparent"></div>
            <div className="w-12 h-12 bg-nyu-purple/20 rounded-lg flex items-center justify-center mb-4 relative z-10">
              <svg className="w-6 h-6 text-white" fill="currentColor" viewBox="0 0 24 24">
                <path d="M19 3H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zm-5 14H7v-2h7v2zm3-4H7v-2h10v2zm0-4H7V7h10v2z"/>
              </svg>
            </div>
            <h3 className="text-lg font-semibold text-white mb-2 relative z-10">Sector Vignettes</h3>
            <p className="text-white/80 text-sm relative z-10">Short, relevant examples across key industries.</p>
          </div>

          {/* Item 4 */}
          <div className="relative bg-white/5 backdrop-blur-sm rounded-lg border border-nyu-purple/15 p-6 hover:bg-white/10 transition-all duration-300 overflow-hidden group">
            <div className="absolute inset-0 -translate-x-full group-hover:translate-x-full transition-transform duration-1000 bg-gradient-to-r from-transparent via-white/10 to-transparent"></div>
            <div className="w-12 h-12 bg-nyu-purple/20 rounded-lg flex items-center justify-center mb-4 relative z-10">
              <svg className="w-6 h-6 text-white" fill="currentColor" viewBox="0 0 24 24">
                <path d="M20 2H4c-1.1 0-1.99.9-1.99 2L2 22l4-4h14c1.1 0 2-.9 2-2V4c0-1.1-.9-2-2-2zm-2 12H6v-2h12v2zm0-3H6V9h12v2zm0-3H6V6h12v2z"/>
              </svg>
            </div>
            <h3 className="text-lg font-semibold text-white mb-2 relative z-10">Boardroom Prompts</h3>
            <p className="text-white/80 text-sm relative z-10">Agenda questions to align your leadership team.</p>
          </div>

          {/* Item 5 */}
          <div className="relative bg-white/5 backdrop-blur-sm rounded-lg border border-nyu-purple/15 p-6 hover:bg-white/10 transition-all duration-300 overflow-hidden group">
            <div className="absolute inset-0 -translate-x-full group-hover:translate-x-full transition-transform duration-1000 bg-gradient-to-r from-transparent via-white/10 to-transparent"></div>
            <div className="w-12 h-12 bg-nyu-purple/20 rounded-lg flex items-center justify-center mb-4 relative z-10">
              <svg className="w-6 h-6 text-white" fill="currentColor" viewBox="0 0 24 24">
                <path d="M17 10.5V7c0-.55-.45-1-1-1H4c-.55 0-1 .45-1 1v10c0 .55.45 1 1 1h12c.55 0 1-.45 1-1v-3.5l4 4v-11l-4 4zM14 13h-3v3H9v-3H6v-2h3V8h2v3h3v2z"/>
              </svg>
            </div>
            <h3 className="text-lg font-semibold text-white mb-2 relative z-10">Optional Live Invites</h3>
            <p className="text-white/80 text-sm relative z-10">Periodic Q&A and faculty updates.</p>
          </div>

          {/* Item 6 */}
          <div className="relative bg-white/5 backdrop-blur-sm rounded-lg border border-nyu-purple/15 p-6 hover:bg-white/10 transition-all duration-300 overflow-hidden group">
            <div className="absolute inset-0 -translate-x-full group-hover:translate-x-full transition-transform duration-1000 bg-gradient-to-r from-transparent via-white/10 to-transparent"></div>
            <div className="w-12 h-12 bg-nyu-purple/20 rounded-lg flex items-center justify-center mb-4 relative z-10">
              <svg className="w-6 h-6 text-white" fill="currentColor" viewBox="0 0 24 24">
                <path d="M14,2H6A2,2 0 0,0 4,4V20A2,2 0 0,0 6,22H18A2,2 0 0,0 20,20V8L14,2M18,20H6V4H13V9H18V20Z"/>
              </svg>
            </div>
            <h3 className="text-lg font-semibold text-white mb-2 relative z-10">Lite Templates</h3>
            <p className="text-white/80 text-sm relative z-10">Simple tools you can use in the next meeting.</p>
          </div>

        </div>
      </div>
    </section>
  );
};

export default WhatYouGetSection;
