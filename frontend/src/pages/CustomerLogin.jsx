import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Sprout, Mail, Lock, AlertCircle, ArrowRight } from 'lucide-react';

const CustomerLogin = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { customerLogin, isCustomerAuthenticated } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (isCustomerAuthenticated) {
      navigate('/customer-dashboard');
    }
  }, [isCustomerAuthenticated, navigate]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!email || !password) {
      setError('Please fill in all fields.');
      return;
    }

    setLoading(true);
    setError('');

    const res = await customerLogin(email, password);
    setLoading(false);

    if (res.success) {
      navigate('/customer-dashboard');
    } else {
      setError(res.message);
    }
  };

  return (
    <div className="pt-28 min-h-screen bg-gray-50 flex items-center justify-center px-4 pb-12">
      <div className="max-w-md w-full bg-white rounded-2xl border border-gray-100 p-8 shadow-md">
        
        {/* Brand Header */}
        <div className="text-center mb-8">
          <div className="bg-[#2E7D32] p-3.5 rounded-2xl text-white inline-block shadow-md mb-4">
            <Sprout className="h-8 w-8" />
          </div>
          <h2 className="text-2xl font-bold text-gray-900 font-sans">Customer Portal</h2>
          <p className="text-sm text-gray-500 mt-1">Sign in to track your rice inquiries and quote requests</p>
        </div>

        {error && (
          <div className="mb-6 p-3.5 bg-red-50 border border-red-200 rounded-xl text-red-800 flex items-start gap-2 text-sm">
            <AlertCircle className="h-5 w-5 text-red-600 flex-shrink-0 mt-0.5" />
            <span>{error}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-5" id="customer-login-form">
          {/* Email */}
          <div>
            <label className="block text-xs font-semibold text-gray-700 mb-1">Email Address</label>
            <div className="relative">
              <span className="absolute inset-y-0 left-0 pl-3.5 flex items-center text-gray-400">
                <Mail className="h-4 w-4" />
              </span>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-[#2E7D32] transition-all text-xs"
                placeholder="name@example.com"
                required
              />
            </div>
          </div>

          {/* Password */}
          <div>
            <div className="flex justify-between items-center mb-1">
              <label className="block text-xs font-semibold text-gray-700">Password</label>
              <button 
                type="button" 
                onClick={() => alert("Please contact support at support@rajaricetraders.com or visit the system manager to reset your password.")}
                className="text-[10px] text-[#2E7D32] hover:underline font-semibold"
              >
                Forgot password?
              </button>
            </div>
            <div className="relative">
              <span className="absolute inset-y-0 left-0 pl-3.5 flex items-center text-gray-400">
                <Lock className="h-4 w-4" />
              </span>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-[#2E7D32] transition-all text-xs"
                placeholder="••••••••"
                required
              />
            </div>
          </div>

          {/* Submit */}
          <button
            type="submit"
            disabled={loading}
            className="w-full bg-[#2E7D32] hover:bg-[#1B5E20] text-white font-bold py-3 px-6 rounded-xl shadow-md transition-all flex items-center justify-center cursor-pointer disabled:bg-gray-400 text-sm"
          >
            {loading ? 'Signing In...' : 'Sign In'}
          </button>
        </form>

        {/* Redirect Links */}
        <div className="mt-8 border-t pt-6 text-center text-xs text-gray-500 space-y-2">
          <p>
            Don't have an account?{' '}
            <Link to="/customer-register" className="text-[#2E7D32] hover:underline font-bold inline-flex items-center gap-0.5">
              Create Account <ArrowRight className="h-3 w-3" />
            </Link>
          </p>
          <div className="pt-2">
            <Link to="/login" className="text-xs text-gray-400 hover:text-[#2E7D32] font-semibold underline">
              Admin Login Portal
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CustomerLogin;
