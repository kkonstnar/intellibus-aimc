"use client";

import React, { useState } from 'react';
import { trackEvent } from '../utils/analytics';

const FAQSection: React.FC = () => {
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  const faqs = [
    {
      question: "What is the duration of the AI Masterclass program?",
      answer: "The AI Masterclass is an intensive 2-day program designed for busy executives. The program covers essential AI concepts, strategic frameworks, and practical applications in a condensed format that fits your schedule."
    },
    {
      question: "Do I need technical experience to participate?",
      answer: "No technical background is required. The program is specifically designed for executives and leaders who want to understand AI from a strategic perspective. We focus on business applications and decision-making frameworks rather than technical implementation."
    },
    {
      question: "What will I learn in the program?",
      answer: "You'll learn AI strategy frameworks, practical applications for your industry, how to assess AI opportunities and risks, and how to build winning AI strategies. The program covers real-world case studies and provides actionable insights you can implement immediately."
    },
    {
      question: "Who are the instructors?",
      answer: "Our faculty includes world-class AI experts from top tech companies like Google, Microsoft, Amazon, and Meta. You'll learn from Ed Watal (Founder & Principal, Intellibus) and Jepson Taylor (Former Chief AI Strategist, Dataiku), along with other industry leaders."
    },
    {
      question: "Is there ongoing support after the program?",
      answer: "Yes! You'll join an exclusive network of 50+ Fortune 500 executives who've completed our program. This includes access to ongoing mastermind sessions, exclusive AI trend reports, and a private community for continued learning and networking."
    },
    {
      question: "What is the investment for the program?",
      answer: "The AI Masterclass represents exceptional value for the comprehensive curriculum, world-class faculty, and exclusive networking opportunities. Contact our admissions team for detailed pricing information and available payment options."
    }
  ];

  const toggleFAQ = (index: number) => {
    const isOpening = openIndex !== index;
    setOpenIndex(openIndex === index ? null : index);
    
    if (isOpening) {
      trackEvent('faq_item_clicked', {
        question: faqs[index].question,
        index,
        location: 'faq_section'
      });
    }
  };

  return (
    <section id="faq" className="relative w-full bg-black py-16 px-4 sm:px-6 lg:px-8">
      {/* Section Title */}
      <div className="text-center mb-12">
        <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold text-nyu-light-violet-2 mb-4">
          Frequently Asked Questions
        </h2>
        <p className="text-white/70 text-lg max-w-2xl mx-auto">
          Get answers to the most common questions about our AI Masterclass program
        </p>
      </div>

      {/* FAQ Container */}
      <div className="max-w-4xl mx-auto">
        <div className="bg-white/5 backdrop-blur-sm rounded-lg border border-white/20 p-8">
          <div className="space-y-0">
            {faqs.map((faq, index) => (
              <div key={index} className="border-b border-white/10 last:border-b-0">
                <button
                  onClick={() => toggleFAQ(index)}
                  className="w-full py-6 text-left flex items-center justify-between hover:bg-white/5 transition-colors duration-200"
                >
                  <span className="text-white font-medium text-lg pr-4">
                    {faq.question}
                  </span>
                  <svg
                    className={`w-6 h-6 text-white transition-transform duration-200 flex-shrink-0 ${
                      openIndex === index ? 'rotate-180' : ''
                    }`}
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                  </svg>
                </button>
                
                {openIndex === index && (
                  <div className="pb-6 px-0">
                    <p className="text-white/80 leading-relaxed">
                      {faq.answer}
                    </p>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Bottom CTA */}
      <div className="text-center mt-12">
        <button 
          className="bg-nyu-purple hover:bg-nyu-purple/90 text-white px-8 py-4 rounded font-medium text-lg transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-nyu-purple/25"
          onClick={() => trackEvent('cta_clicked', {
            buttonText: 'Have More Questions?',
            location: 'faq_section',
            ctaType: 'contact'
          })}
        >
          Have More Questions?
        </button>
      </div>
    </section>
  );
};

export default FAQSection;
