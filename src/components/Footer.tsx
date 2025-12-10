import React from 'react';
import { trackEvent } from '../utils/analytics';

const Footer: React.FC = () => {
  return (
    <footer className="relative w-full bg-black border-t border-white/10">
      {/* Footer Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          
          {/* Logo and Description */}
          <div className="lg:col-span-2">
            <div className="flex items-center space-x-4 mb-4">
              <img 
                src="/AIMC_Angled_Horiz_w Title_Violet.png" 
                alt="AI Masterclass Logo" 
                className="h-10 w-auto"
              />
            </div>
            <p className="text-white/70 text-sm leading-relaxed max-w-md">
              Transform your career with world-class AI education. Join Fortune 500 executives who have mastered the future of artificial intelligence.
            </p>
            
            {/* Partnership Logos */}
            <div className="mt-6 flex items-center space-x-6">
              <p className="text-white/60 text-xs">Presented by:</p>
              <img 
                src="/whiteNyuLogo.png" 
                alt="NYU Logo" 
                className="h-6 w-auto opacity-80"
              />
              <img 
                src="/White_Text_Blue_Bkg-removebg-preview.png" 
                alt="Intellibus Logo" 
                className="h-6 w-auto opacity-80"
              />
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-white font-semibold text-lg mb-4">Program</h3>
            <ul className="space-y-2">
              <li><a href="#social-proof" className="text-white/70 hover:text-white transition-colors text-sm" onClick={() => trackEvent('footer_link_clicked', { linkText: 'Alumni', destination: 'social-proof' })}>Alumni</a></li>
              <li><a href="#instructors" className="text-white/70 hover:text-white transition-colors text-sm" onClick={() => trackEvent('footer_link_clicked', { linkText: 'Faculty', destination: 'instructors' })}>Faculty</a></li>
              <li><a href="#value-prop" className="text-white/70 hover:text-white transition-colors text-sm" onClick={() => trackEvent('footer_link_clicked', { linkText: 'Curriculum', destination: 'value-prop' })}>Curriculum</a></li>
              <li><a href="#faq" className="text-white/70 hover:text-white transition-colors text-sm" onClick={() => trackEvent('footer_link_clicked', { linkText: 'FAQ', destination: 'faq' })}>FAQ</a></li>
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h3 className="text-white font-semibold text-lg mb-4">Contact</h3>
            <ul className="space-y-2">
              <li><a href="mailto:info@aimasterclass.com" className="text-white/70 hover:text-white transition-colors text-sm" onClick={() => trackEvent('footer_link_clicked', { linkText: 'Email', contactType: 'email' })}>info@aimasterclass.com</a></li>
              <li><a href="tel:+1-555-AI-MASTER" className="text-white/70 hover:text-white transition-colors text-sm" onClick={() => trackEvent('footer_link_clicked', { linkText: 'Phone', contactType: 'phone' })}>+1 (555) AI-MASTER</a></li>
              <li><span className="text-white/70 text-sm">New York University</span></li>
              <li><span className="text-white/70 text-sm">Executive Education</span></li>
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="mt-12 pt-8 border-t border-white/10">
          <div className="flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
            <div className="text-white/60 text-sm">
              © 2025 AI Masterclass Executive Education. All rights reserved.
            </div>
            <div className="flex items-center space-x-6">
              <a href="#" className="text-white/60 hover:text-white transition-colors text-sm" onClick={(e) => { e.preventDefault(); trackEvent('footer_link_clicked', { linkText: 'Privacy Policy', linkType: 'legal' }); }}>Privacy Policy</a>
              <a href="#" className="text-white/60 hover:text-white transition-colors text-sm" onClick={(e) => { e.preventDefault(); trackEvent('footer_link_clicked', { linkText: 'Terms of Service', linkType: 'legal' }); }}>Terms of Service</a>
              <a href="#" className="text-white/60 hover:text-white transition-colors text-sm" onClick={(e) => { e.preventDefault(); trackEvent('footer_link_clicked', { linkText: 'Accessibility', linkType: 'legal' }); }}>Accessibility</a>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
