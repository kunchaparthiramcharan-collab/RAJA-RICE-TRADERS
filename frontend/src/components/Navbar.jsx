import React, { useState, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { Menu, X, Sprout, LogOut, User, ShoppingBag } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const { 
    isAuthenticated, 
    logout, 
    isCustomerAuthenticated, 
    customerLogout, 
    customerUser 
  } = useAuth();
  
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 20) {
        setScrolled(true);
      } else {
        setScrolled(false);
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Close mobile menu when location changes
  useEffect(() => {
    setIsOpen(false);
  }, [location]);

  const navLinks = [
    { name: 'Home', path: '/' },
    { name: 'About', path: '/about' },
    { name: 'Products', path: '/products' },
    { name: 'Processing', path: '/processing' },
    { name: 'Contact', path: '/contact' }
  ];

  const handleAdminLogout = () => {
    logout();
    navigate('/login');
  };

  const handleCustomerLogout = () => {
    customerLogout();
    navigate('/customer-login');
  };

  const isActive = (path) => {
    return location.pathname === path;
  };

  return (
    <nav
      className={`fixed top-0 left-0 w-full z-40 transition-all duration-300 ${
        scrolled
          ? 'bg-white/95 backdrop-blur-md shadow-md py-3'
          : 'bg-transparent py-5'
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-12">
          {/* Logo Section */}
          <Link to="/" className="flex items-center space-x-2 group">
            <div className="bg-[#2E7D32] p-2 rounded-lg text-white group-hover:bg-[#D4A017] transition-colors duration-300">
              <Sprout className="h-6 w-6" />
            </div>
            <div>
              <span className="text-xl font-bold text-gray-900 tracking-tight group-hover:text-[#2E7D32] transition-colors duration-300">
                Raja Rice <span className="text-[#2E7D32]">Traders</span>
              </span>
              <p className="text-[10px] text-gray-500 font-semibold tracking-wider -mt-1 uppercase">
                Quality & Trust
              </p>
            </div>
          </Link>

          {/* Desktop Navigation Links */}
          <div className="hidden md:flex items-center space-x-6">
            {navLinks.map((link) => (
              <Link
                key={link.name}
                to={link.path}
                className={`text-sm font-semibold tracking-wide transition-all duration-200 hover:text-[#2E7D32] ${
                  isActive(link.path)
                    ? 'text-[#2E7D32] border-b-2 border-[#2E7D32] pb-1'
                    : 'text-gray-700'
                }`}
              >
                {link.name}
              </Link>
            ))}

            {/* Role-Specific Navigation Rendering */}
            {isAuthenticated ? (
              /* 1. Admin Logged In */
              <div className="flex items-center space-x-4 border-l pl-4 border-gray-200">
                <Link
                  to="/admin"
                  className={`flex items-center text-sm font-semibold tracking-wide hover:text-[#2E7D32] ${
                    isActive('/admin') ? 'text-[#2E7D32]' : 'text-gray-700'
                  }`}
                >
                  <User className="h-4 w-4 mr-1 text-[#2E7D32]" />
                  Dashboard
                </Link>
                <button
                  onClick={handleAdminLogout}
                  className="flex items-center text-sm font-semibold text-red-600 hover:text-red-800 transition-colors cursor-pointer"
                >
                  <LogOut className="h-4 w-4 mr-1" />
                  Logout Admin
                </button>
              </div>
            ) : isCustomerAuthenticated ? (
              /* 2. Customer Logged In */
              <div className="flex items-center space-x-4 border-l pl-4 border-gray-200">
                <Link
                  to="/customer-dashboard"
                  className={`flex items-center text-sm font-semibold tracking-wide hover:text-[#2E7D32] ${
                    isActive('/customer-dashboard') ? 'text-[#2E7D32]' : 'text-gray-700'
                  }`}
                >
                  <ShoppingBag className="h-4 w-4 mr-1 text-[#2E7D32]" />
                  My Inquiries
                </Link>
                <span className="text-xs text-gray-400 font-semibold bg-gray-50 border px-2 py-1 rounded-md">
                  {customerUser?.name.split(' ')[0]}
                </span>
                <button
                  onClick={handleCustomerLogout}
                  className="flex items-center text-xs font-semibold text-red-600 hover:text-red-800 transition-colors cursor-pointer"
                >
                  <LogOut className="h-3.5 w-3.5 mr-1" />
                  Logout
                </button>
              </div>
            ) : (
              /* 3. Guest User: Show Customer Portal login only (Admin portal hidden at /login) */
              <div className="flex items-center space-x-4 border-l pl-4 border-gray-200">
                <Link
                  to="/customer-login"
                  className="bg-[#2E7D32] hover:bg-[#1B5E20] text-white text-xs font-bold px-3.5 py-1.5 rounded-lg transition-colors shadow-sm"
                >
                  Login / Sign Up
                </Link>
              </div>
            )}
          </div>

          {/* Mobile Menu Button */}
          <div className="md:hidden flex items-center">
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="inline-flex items-center justify-center p-2 rounded-md text-gray-700 hover:text-[#2E7D32] hover:bg-gray-100 focus:outline-none transition-colors"
            >
              {isOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu Panel */}
      {isOpen && (
        <div className="md:hidden bg-white border-t border-gray-100 shadow-lg animate-fade-in-down">
          <div className="px-2 pt-2 pb-4 space-y-1 sm:px-3">
            {navLinks.map((link) => (
              <Link
                key={link.name}
                to={link.path}
                className={`block px-3 py-2.5 rounded-md text-base font-medium transition-colors ${
                  isActive(link.path)
                    ? 'bg-green-50 text-[#2E7D32]'
                    : 'text-gray-700 hover:bg-gray-50 hover:text-[#2E7D32]'
                }`}
              >
                {link.name}
              </Link>
            ))}

            {isAuthenticated ? (
              /* Mobile Admin link */
              <div className="pt-4 border-t border-gray-100 mt-2">
                <Link
                  to="/admin"
                  className="flex items-center px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:bg-gray-50 hover:text-[#2E7D32]"
                >
                  <User className="h-5 w-5 mr-2 text-[#2E7D32]" />
                  Admin Dashboard
                </Link>
                <button
                  onClick={handleAdminLogout}
                  className="w-full flex items-center px-3 py-2.5 mt-1 rounded-md text-base font-medium text-red-600 hover:bg-red-50 cursor-pointer"
                >
                  <LogOut className="h-5 w-5 mr-2" />
                  Logout Admin
                </button>
              </div>
            ) : isCustomerAuthenticated ? (
              /* Mobile Customer link */
              <div className="pt-4 border-t border-gray-100 mt-2">
                <Link
                  to="/customer-dashboard"
                  className="flex items-center px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:bg-gray-50 hover:text-[#2E7D32]"
                >
                  <ShoppingBag className="h-5 w-5 mr-2 text-[#2E7D32]" />
                  My Inquiries ({customerUser?.name})
                </Link>
                <button
                  onClick={handleCustomerLogout}
                  className="w-full flex items-center px-3 py-2.5 mt-1 rounded-md text-base font-medium text-red-600 hover:bg-red-50 cursor-pointer"
                >
                  <LogOut className="h-5 w-5 mr-2" />
                  Logout Account
                </button>
              </div>
            ) : (
              /* Mobile Guest link - Admin access hidden */
              <div className="pt-4 border-t border-gray-100 mt-2">
                <Link
                  to="/customer-login"
                  className="block text-center bg-[#2E7D32] text-white font-bold py-2.5 rounded-xl text-sm"
                >
                  Login / Sign Up
                </Link>
              </div>
            )}
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
