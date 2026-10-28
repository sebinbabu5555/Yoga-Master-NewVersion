import React from 'react';
import { Link } from 'react-router-dom';

const Footer = () => {
  return (
    <footer className="bg-navy-800 border-t border-white/10 text-white/70">
      {/* Main footer */}
      <div className="max-w-[1360px] mx-auto px-4 sm:px-6 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-10">
          {/* Brand */}
          <div className="md:col-span-1">
            <div className="flex items-center gap-2 mb-3">
              <div className="w-7 h-7 rounded-lg bg-teal flex items-center justify-center">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none">
                  <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 4c1.1 0 2 .9 2 2s-.9 2-2 2-2-.9-2-2 .9-2 2-2zm4 12H8v-1c0-2.21 3.58-4 4-4s4 1.79 4 4v1z" fill="white"/>
                </svg>
              </div>
              <span className="text-white font-bold text-base">Yoga Master</span>
            </div>
            <p className="text-sm leading-relaxed mb-4">
              Yoga classes, personal coaching, and smart training plans — built around your goals and schedule.
            </p>
            <p className="text-xs text-white/30">Fitness. Progress. Coaching. Intelligence.</p>
          </div>

          {/* Platform */}
          <div>
            <h4 className="text-white text-xs font-bold uppercase tracking-widest mb-4">Platform</h4>
            <ul className="space-y-2.5">
              {['Explore Classes', 'Instructors', 'Programs', 'AI Coach', 'Pricing'].map((item) => (
                <li key={item}>
                  <Link to="/classes" className="text-sm hover:text-teal transition-colors duration-150">{item}</Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Company */}
          <div>
            <h4 className="text-white text-xs font-bold uppercase tracking-widest mb-4">Company</h4>
            <ul className="space-y-2.5">
              {['About', 'Careers', 'Teach on Yoga Master', 'Blog'].map((item) => (
                <li key={item}>
                  <span className="text-sm cursor-pointer hover:text-teal transition-colors duration-150">{item}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* Support */}
          <div>
            <h4 className="text-white text-xs font-bold uppercase tracking-widest mb-4">Support</h4>
            <ul className="space-y-2.5">
              {['Help Center', 'Contact Us', 'Privacy Policy', 'Terms of Service'].map((item) => (
                <li key={item}>
                  <span className="text-sm cursor-pointer hover:text-teal transition-colors duration-150">{item}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>

      {/* Bottom bar */}
      <div className="border-t border-white/10 py-5">
        <div className="max-w-[1360px] mx-auto px-4 sm:px-6 flex flex-col sm:flex-row items-center justify-between gap-3">
          <p className="text-xs text-white/30">© {new Date().getFullYear()} Yoga Master. All rights reserved.</p>
          <p className="text-xs text-white/30">Built with care for learners and instructors.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
