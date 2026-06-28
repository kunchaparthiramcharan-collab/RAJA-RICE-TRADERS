import React from 'react';
import { Link } from 'react-router-dom';
import { Sprout, Phone, Mail, MapPin, Clock } from 'lucide-react';

const Footer = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-gray-900 text-gray-300">
      {/* Upper Footer section */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10">
          {/* Brand Info */}
          <div className="space-y-4">
            <div className="flex items-center space-x-2">
              <div className="bg-[#2E7D32] p-2 rounded-lg text-white">
                <Sprout className="h-6 w-6" />
              </div>
              <span className="text-xl font-bold text-white tracking-tight">
                Raja Rice <span className="text-[#D4A017]">Traders</span>
              </span>
            </div>
            <p className="text-sm text-gray-400 leading-relaxed">
              Premium Quality Rice, Trusted by Every Family. We process and supply high-quality, nutritious rice variants across India.
            </p>
            <div className="flex space-x-4 pt-2">
              <a href="#" className="hover:text-[#D4A017] transition-colors" aria-label="Facebook">
                <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                  <path fillRule="evenodd" d="M22 12c0-5.523-4.477-10-10-10S2 6.477 2 12c0 4.991 3.657 9.128 8.438 9.878v-6.987h-2.54V12h2.54V9.797c0-2.506 1.492-3.89 3.777-3.89 1.094 0 2.238.195 2.238.195v2.46h-1.26c-1.243 0-1.63.771-1.63 1.562V12h2.773l-.443 2.89h-2.33v6.988C18.343 21.128 22 16.991 22 12z" clipRule="evenodd" />
                </svg>
              </a>
              <a href="#" className="hover:text-[#D4A017] transition-colors" aria-label="Instagram">
                <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                  <path fillRule="evenodd" d="M12.315 2c2.43 0 2.784.008 3.885.056 1.13.05 1.83.224 2.228.375a4.865 4.865 0 011.67 1.086 4.865 4.865 0 011.085 1.67c.15.397.325 1.097.375 2.228.05 1.1.056 1.455.056 3.885v1.23c0 2.43-.008 2.784-.056 3.885-.05 1.13-.224 1.83-.375 2.228a4.865 4.865 0 01-1.086 1.67 4.865 4.865 0 01-1.67 1.085c-.397.15-1.097.325-2.228.375-1.1.05-1.455.056-3.885.056h-1.23c-2.43 0-2.784-.008-3.885-.056-1.13-.05-1.83-.224-2.228-.375a4.816 4.816 0 01-1.67-1.086 4.816 4.816 0 01-1.085-1.67c-.15-.397-.325-1.097-.375-2.228C2.008 15.63 2 15.275 2 12.845v-1.23c0-2.43.008-2.784.056-3.885.05-1.13.224-1.83.375-2.228a4.816 4.816 0 011.086-1.67 4.816 4.816 0 011.67-1.085c.397-.15 1.097-.325 2.228-.375 1.1-.05 1.455-.056 3.885-.056h1.23zM12 5.807a6.193 6.193 0 100 12.386 6.193 6.193 0 000-12.386zm0 10.17a3.978 3.978 0 110-7.957 3.978 3.978 0 010 7.957zm5.278-8.308a1.44 1.44 0 100-2.88 1.44 1.44 0 000 2.88z" clipRule="evenodd" />
                </svg>
              </a>
              <a href="#" className="hover:text-[#D4A017] transition-colors" aria-label="Twitter">
                <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                  <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
                </svg>
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-white text-md font-semibold mb-6 uppercase tracking-wider relative after:content-[''] after:absolute after:bottom-0 after:left-0 after:w-12 after:h-0.5 after:bg-[#D4A017] pb-2">
              Quick Links
            </h3>
            <ul className="space-y-3 text-sm">
              <li>
                <Link to="/" className="hover:text-white hover:translate-x-1 inline-block transition-all">Home</Link>
              </li>
              <li>
                <Link to="/about" className="hover:text-white hover:translate-x-1 inline-block transition-all">About Us</Link>
              </li>
              <li>
                <Link to="/products" className="hover:text-white hover:translate-x-1 inline-block transition-all">Our Products</Link>
              </li>
              <li>
                <Link to="/processing" className="hover:text-white hover:translate-x-1 inline-block transition-all">Rice Processing</Link>
              </li>
              <li>
                <Link to="/contact" className="hover:text-white hover:translate-x-1 inline-block transition-all">Contact Us</Link>
              </li>
            </ul>
          </div>

          {/* Contact Details */}
          <div>
            <h3 className="text-white text-md font-semibold mb-6 uppercase tracking-wider relative after:content-[''] after:absolute after:bottom-0 after:left-0 after:w-12 after:h-0.5 after:bg-[#D4A017] pb-2">
              Contact Info
            </h3>
            <ul className="space-y-4 text-sm">
              <li className="flex items-start">
                <MapPin className="h-5 w-5 mr-3 text-[#2E7D32] flex-shrink-0 mt-0.5" />
                <span>Near Krishna Talkies, Barlapenta Bazaar, Suryapet, Telangana, India</span>
              </li>
              <li className="flex items-center">
                <Phone className="h-5 w-5 mr-3 text-[#2E7D32]" />
                <a href="tel:+919848223681" className="hover:text-white transition-colors">+91 98482 23681</a>
              </li>
              <li className="flex items-center">
                <Mail className="h-5 w-5 mr-3 text-[#2E7D32]" />
                <a href="mailto:rajaricetraders01@gmail.com" className="hover:text-white transition-colors">rajaricetraders01@gmail.com</a>
              </li>
            </ul>
          </div>

          {/* Business Hours */}
          <div>
            <h3 className="text-white text-md font-semibold mb-6 uppercase tracking-wider relative after:content-[''] after:absolute after:bottom-0 after:left-0 after:w-12 after:h-0.5 after:bg-[#D4A017] pb-2">
              Business Hours
            </h3>
            <ul className="space-y-4 text-sm">
              <li className="flex items-start">
                <Clock className="h-5 w-5 mr-3 text-[#D4A017] flex-shrink-0 mt-0.5" />
                <div>
                  <p className="font-semibold text-white">Monday - Saturday</p>
                  <p className="text-gray-400 text-xs">9:00 AM - 6:00 PM</p>
                </div>
              </li>
              <li className="flex items-start">
                <Clock className="h-5 w-5 mr-3 text-gray-600 flex-shrink-0 mt-0.5" />
                <div>
                  <p className="font-semibold text-gray-500">Sunday</p>
                  <p className="text-gray-500 text-xs">Closed / Holiday</p>
                </div>
              </li>
            </ul>
          </div>
        </div>
      </div>

      {/* Bottom Footer Section */}
      <div className="border-t border-gray-800 bg-gray-950 py-6 text-center text-xs text-gray-500">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row justify-between items-center gap-4">
          <p>© {currentYear} Raja Rice Traders. All rights reserved.</p>
          <p className="text-gray-600">
            Owner: <span className="text-gray-400 font-medium">Rajashekar</span> | Premium Rice Milling & Trading | <Link to="/login" className="hover:text-white transition-colors">Admin Portal</Link>
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
