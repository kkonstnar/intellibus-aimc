"use client";

import React from 'react';
import Link from 'next/link';
import { trackEvent } from '../utils/analytics';

const Header: React.FC = () => {
  return (
    <nav className="fixed top-0 left-0 right-0 z-50 flex items-center justify-between px-4 sm:px-6 lg:px-8 bg-black/80 backdrop-blur-md border-b border-nyu-purple/15 h-[11.11vh]">
      <Link href="/" className="flex items-center space-x-4">
        <img 
          src="/AIMC_Angled_Horiz_w Title_Violet.png" 
          alt="AI Masterclass Logo" 
          className="h-[8vh] w-auto"
        />
      </Link>
      
      <div className="hidden md:flex items-center space-x-8">
        <Link href="/#social-proof" className="text-white/80 hover:text-white transition-colors" onClick={() => trackEvent('nav_link_clicked', { linkText: 'Alumni', destination: 'social-proof' })}>Alumni</Link>
        <Link href="/#instructors" className="text-white/80 hover:text-white transition-colors" onClick={() => trackEvent('nav_link_clicked', { linkText: 'Faculty', destination: 'instructors' })}>Faculty</Link>
        <Link href="/#value-prop" className="text-white/80 hover:text-white transition-colors" onClick={() => trackEvent('nav_link_clicked', { linkText: 'Program', destination: 'value-prop' })}>Program</Link>
        <Link href="/#faq" className="text-white/80 hover:text-white transition-colors" onClick={() => trackEvent('nav_link_clicked', { linkText: 'FAQ', destination: 'faq' })}>FAQ</Link>
      </div>

      <Link 
        href="/course-listing"
        className="bg-nyu-purple hover:bg-nyu-purple/90 text-white px-4 py-1.5 rounded font-medium text-sm transition-colors inline-block text-center"
        onClick={() => trackEvent('nav_enroll_clicked', { location: 'navbar' })}
      >
        Enroll Now
      </Link>
    </nav>
  );
};

export default Header;

