import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Sprout, User, Phone, Mail, Lock, AlertCircle, ArrowLeft } from 'lucide-react';

const CustomerRegister = () => {
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    email: '',
    password: '',
    confirmPassword: ''
  });

  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const { customerRegister } = useAuth();
  const navigate = useNavigate();

  const validate = () => {
    const errs = {};
    if (!formData.name.trim()) errs.name = 'Full Name is required';
    
    const phoneRegex = /^\d{10}$/;
    if (!formData.phone.trim()) {
      errs.phone = 'Phone number is required';
    } else if (!phoneRegex.test(formData.phone.replace(/[\s-()]/g, ''))) {
      errs.phone = 'Please enter a valid 10-digit number';
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!formData.email.trim()) {
      errs.email = 'Email address is required';
    } else if (!emailRegex.test(formData.email)) {
      errs.email = 'Please enter a valid email address';
    }

    if (!formData.password) {
      errs.password = 'Password is required';
    } else if (formData.password.length < 6) {
      errs.password = 'Password must be at least 6 characters long';
    }

    if (formData.password !== formData.confirmPassword) {
      errs.confirmPassword = 'Passwords do not match';
    }

    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;

    setLoading(true);
    setErrors({});

    const res = await customerRegister(
      formData.name,
      formData.phone,
      formData.email,
      formData.password
    );
    setLoading(false);

    if (res.success) {
      setSuccess(true);
      setTimeout(() => {
        navigate('/customer-login');
      }, 3000);
    } else {
      setErrors({ global: res.message });
    }
  };

  return (
    <div className="pt-28 min-h-screen bg-gray-50 flex items-center justify-center px-4 pb-12">
      <div className="max-w-md w-full bg-white rounded-2xl border border-gray-100 p-8 shadow-md">
        
        {/* Brand Header */}
        <div className="text-center mb-6">
          <div className="bg-[#2E7D32] p-3.5 rounded-2xl text-white inline-block shadow-md mb-4">
            <Sprout className="h-8 w-8" />
          </div>
          <h2 className="text-2xl font-bold text-gray-900">Create Account</h2>
          <p className="text-sm text-gray-500 mt-1">Register to start submitting and tracking rice orders</p>
        </div>

        {success && (
          <div className="mb-6 p-4 bg-green-50 border border-green-200 rounded-xl text-green-800 text-xs">
            <p className="font-bold mb-1">Registration Successful!</p>
            <p>Your account has been created. Redirecting to sign in page...</p>
          </div>
        )}

        {errors.global && (
          <div className="mb-6 p-3.5 bg-red-50 border border-red-200 rounded-xl text-red-800 flex items-start gap-2 text-xs">
            <AlertCircle className="h-5 w-5 text-red-600 flex-shrink-0 mt-0.5" />
            <span>{errors.global}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4" id="customer-register-form">
          {/* Full Name */}
          <div>
            <label className="block text-xs font-semibold text-gray-700 mb-1">Full Name *</label>
            <div className="relative">
              <span className="absolute inset-y-0 left-0 pl-3.5 flex items-center text-gray-400">
                <User className="h-4 w-4" />
              </span>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                className={`w-full pl-10 pr-4 py-2.5 rounded-xl border ${errors.name ? 'border-red-300 bg-red-50/20' : 'border-gray-200'} focus:outline-none focus:ring-2 focus:ring-[#2E7D32] text-xs`}
                placeholder="Enter full name"
                required
              />
            </div>
            {errors.name && <span className="text-[10px] text-red-500 mt-0.5 block font-semibold">{errors.name}</span>}
          </div>

          {/* Phone */}
          <div>
            <label className="block text-xs font-semibold text-gray-700 mb-1">Phone Number *</label>
            <div className="relative">
              <span className="absolute inset-y-0 left-0 pl-3.5 flex items-center text-gray-400">
                <Phone className="h-4 w-4" />
              </span>
              <input
                type="text"
                name="phone"
                value={formData.phone}
                onChange={handleChange}
                className={`w-full pl-10 pr-4 py-2.5 rounded-xl border ${errors.phone ? 'border-red-300 bg-red-50/20' : 'border-gray-200'} focus:outline-none focus:ring-2 focus:ring-[#2E7D32] text-xs`}
                placeholder="10-digit number"
                required
              />
            </div>
            {errors.phone && <span className="text-[10px] text-red-500 mt-0.5 block font-semibold">{errors.phone}</span>}
          </div>

          {/* Email */}
          <div>
            <label className="block text-xs font-semibold text-gray-700 mb-1">Email Address *</label>
            <div className="relative">
              <span className="absolute inset-y-0 left-0 pl-3.5 flex items-center text-gray-400">
                <Mail className="h-4 w-4" />
              </span>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                className={`w-full pl-10 pr-4 py-2.5 rounded-xl border ${errors.email ? 'border-red-300 bg-red-50/20' : 'border-gray-200'} focus:outline-none focus:ring-2 focus:ring-[#2E7D32] text-xs`}
                placeholder="email@example.com"
                required
              />
            </div>
            {errors.email && <span className="text-[10px] text-red-500 mt-0.5 block font-semibold">{errors.email}</span>}
          </div>

          {/* Password */}
          <div>
            <label className="block text-xs font-semibold text-gray-700 mb-1">Password *</label>
            <div className="relative">
              <span className="absolute inset-y-0 left-0 pl-3.5 flex items-center text-gray-400">
                <Lock className="h-4 w-4" />
              </span>
              <input
                type="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                className={`w-full pl-10 pr-4 py-2.5 rounded-xl border ${errors.password ? 'border-red-300 bg-red-50/20' : 'border-gray-200'} focus:outline-none focus:ring-2 focus:ring-[#2E7D32] text-xs`}
                placeholder="Minimum 6 characters"
                required
              />
            </div>
            {errors.password && <span className="text-[10px] text-red-500 mt-0.5 block font-semibold">{errors.password}</span>}
          </div>

          {/* Confirm Password */}
          <div>
            <label className="block text-xs font-semibold text-gray-700 mb-1">Confirm Password *</label>
            <div className="relative">
              <span className="absolute inset-y-0 left-0 pl-3.5 flex items-center text-gray-400">
                <Lock className="h-4 w-4" />
              </span>
              <input
                type="password"
                name="confirmPassword"
                value={formData.confirmPassword}
                onChange={handleChange}
                className={`w-full pl-10 pr-4 py-2.5 rounded-xl border ${errors.confirmPassword ? 'border-red-300 bg-red-50/20' : 'border-gray-200'} focus:outline-none focus:ring-2 focus:ring-[#2E7D32] text-xs`}
                placeholder="Confirm password"
                required
              />
            </div>
            {errors.confirmPassword && <span className="text-[10px] text-red-500 mt-0.5 block font-semibold">{errors.confirmPassword}</span>}
          </div>

          {/* Submit */}
          <button
            type="submit"
            disabled={loading || success}
            className="w-full bg-[#2E7D32] hover:bg-[#1B5E20] text-white font-bold py-3 px-6 rounded-xl shadow-md transition-all flex items-center justify-center cursor-pointer disabled:bg-gray-400 text-sm"
          >
            {loading ? 'Processing...' : 'Register'}
          </button>
        </form>

        {/* Redirect */}
        <div className="mt-8 border-t pt-6 text-center text-xs text-gray-500">
          <Link to="/customer-login" className="text-gray-500 hover:text-[#2E7D32] font-semibold inline-flex items-center gap-1">
            <ArrowLeft className="h-3.5 w-3.5" /> Back to Sign In
          </Link>
        </div>
      </div>
    </div>
  );
};

export default CustomerRegister;
