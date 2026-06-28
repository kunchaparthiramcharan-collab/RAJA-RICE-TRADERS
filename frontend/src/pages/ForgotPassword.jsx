import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';
import { Mail, Lock, Key, ArrowLeft, AlertCircle, CheckCircle2, ShieldAlert } from 'lucide-react';
import { API_BASE_URL } from '../context/AuthContext';

const ForgotPassword = () => {
  const [step, setStep] = useState(1); // 1: Enter Email, 2: Enter Code & New Password
  const [email, setEmail] = useState('');
  const [code, setCode] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [isMock, setIsMock] = useState(false);
  const navigate = useNavigate();

  const handleRequestCode = async (e) => {
    e.preventDefault();
    if (!email.trim()) {
      setError('Please enter your email address');
      return;
    }

    setLoading(true);
    setError('');
    setSuccess('');

    try {
      const response = await axios.post(`${API_BASE_URL}/auth/forgot-password`, {
        email: email.trim()
      });

      setSuccess(response.data.message);
      setIsMock(response.data.mock);
      setStep(2);
    } catch (err) {
      console.error(err);
      setError(err.response?.data?.message || 'Failed to send verification code. Please check your email and try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleResetPassword = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    if (!code.trim() || !newPassword || !confirmPassword) {
      setError('Please fill in all fields');
      return;
    }

    if (newPassword.length < 6) {
      setError('Password must be at least 6 characters long');
      return;
    }

    if (newPassword !== confirmPassword) {
      setError('Passwords do not match');
      return;
    }

    setLoading(true);

    try {
      const response = await axios.post(`${API_BASE_URL}/auth/reset-password`, {
        email: email.trim(),
        code: code.trim(),
        newPassword
      });

      setSuccess(response.data.message);
      
      // Redirect to login after 3 seconds
      setTimeout(() => {
        navigate('/customer-login');
      }, 3000);
    } catch (err) {
      console.error(err);
      setError(err.response?.data?.message || 'Password reset failed. Please check your verification code and try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="pt-28 min-h-screen bg-gray-50 flex items-center justify-center px-4 pb-12">
      <div className="max-w-md w-full bg-white rounded-2xl border border-gray-100 p-8 shadow-md">
        
        {/* Step 1: Request OTP Code */}
        {step === 1 && (
          <div>
            <div className="text-center mb-6">
              <div className="bg-[#2E7D32]/10 p-3.5 rounded-2xl text-[#2E7D32] inline-block shadow-sm mb-4">
                <Key className="h-8 w-8" />
              </div>
              <h2 className="text-2xl font-bold text-gray-900">Forgot Password?</h2>
              <p className="text-sm text-gray-500 mt-1">
                Enter your registered email address to receive a 6-digit verification code.
              </p>
            </div>

            {error && (
              <div className="mb-6 p-3.5 bg-red-50 border border-red-200 rounded-xl text-red-800 flex items-start gap-2 text-xs">
                <AlertCircle className="h-5 w-5 text-red-600 flex-shrink-0 mt-0.5" />
                <span>{error}</span>
              </div>
            )}

            <form onSubmit={handleRequestCode} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-gray-700 mb-1">Email Address *</label>
                <div className="relative">
                  <span className="absolute inset-y-0 left-0 pl-3.5 flex items-center text-gray-400">
                    <Mail className="h-4 w-4" />
                  </span>
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-[#2E7D32] text-xs"
                    placeholder="email@example.com"
                    required
                  />
                </div>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full bg-[#2E7D32] hover:bg-[#1B5E20] text-white font-bold py-3 px-6 rounded-xl shadow-md transition-all flex items-center justify-center cursor-pointer disabled:bg-gray-400 text-sm"
              >
                {loading ? 'Sending Code...' : 'Send Verification Code'}
              </button>
            </form>
          </div>
        )}

        {/* Step 2: Reset Password */}
        {step === 2 && (
          <div>
            <div className="text-center mb-6">
              <div className="bg-[#2E7D32]/10 p-3.5 rounded-2xl text-[#2E7D32] inline-block shadow-sm mb-4">
                <ShieldAlert className="h-8 w-8" />
              </div>
              <h2 className="text-2xl font-bold text-gray-900">Reset Password</h2>
              <p className="text-sm text-gray-500 mt-1">
                Enter the code sent to your email and set your new password.
              </p>
            </div>

            {success && (
              <div className="mb-6 p-4 bg-green-50 border border-green-200 rounded-xl text-green-800 text-xs">
                <div className="flex items-start gap-2">
                  <CheckCircle2 className="h-5 w-5 text-green-600 flex-shrink-0 mt-0.5" />
                  <div>
                    <p className="font-bold">{success}</p>
                    {isMock && (
                      <p className="text-green-700 mt-1 font-medium bg-green-100/50 p-2 rounded-lg border border-green-200/50">
                        ℹ️ Development mode is active. Since SMTP credentials are not configured on the backend, the OTP code has been printed to the server logs. Please check the logs to verify.
                      </p>
                    )}
                  </div>
                </div>
              </div>
            )}

            {error && (
              <div className="mb-6 p-3.5 bg-red-50 border border-red-200 rounded-xl text-red-800 flex items-start gap-2 text-xs">
                <AlertCircle className="h-5 w-5 text-red-600 flex-shrink-0 mt-0.5" />
                <span>{error}</span>
              </div>
            )}

            <form onSubmit={handleResetPassword} className="space-y-4">
              {/* Verification Code */}
              <div>
                <label className="block text-xs font-semibold text-gray-700 mb-1">6-Digit Verification Code *</label>
                <div className="relative">
                  <span className="absolute inset-y-0 left-0 pl-3.5 flex items-center text-gray-400">
                    <Key className="h-4 w-4" />
                  </span>
                  <input
                    type="text"
                    maxLength="6"
                    value={code}
                    onChange={(e) => setCode(e.target.value)}
                    className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-[#2E7D32] text-xs font-semibold tracking-widest text-center"
                    placeholder="123456"
                    required
                  />
                </div>
              </div>

              {/* New Password */}
              <div>
                <label className="block text-xs font-semibold text-gray-700 mb-1">New Password *</label>
                <div className="relative">
                  <span className="absolute inset-y-0 left-0 pl-3.5 flex items-center text-gray-400">
                    <Lock className="h-4 w-4" />
                  </span>
                  <input
                    type="password"
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-[#2E7D32] text-xs"
                    placeholder="Minimum 6 characters"
                    required
                  />
                </div>
              </div>

              {/* Confirm New Password */}
              <div>
                <label className="block text-xs font-semibold text-gray-700 mb-1">Confirm New Password *</label>
                <div className="relative">
                  <span className="absolute inset-y-0 left-0 pl-3.5 flex items-center text-gray-400">
                    <Lock className="h-4 w-4" />
                  </span>
                  <input
                    type="password"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-[#2E7D32] text-xs"
                    placeholder="Confirm new password"
                    required
                  />
                </div>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full bg-[#2E7D32] hover:bg-[#1B5E20] text-white font-bold py-3 px-6 rounded-xl shadow-md transition-all flex items-center justify-center cursor-pointer disabled:bg-gray-400 text-sm"
              >
                {loading ? 'Resetting Password...' : 'Reset Password'}
              </button>

              <div className="text-center pt-2">
                <button
                  type="button"
                  onClick={() => setStep(1)}
                  className="text-xs text-[#2E7D32] hover:underline font-bold"
                >
                  Resend Code
                </button>
              </div>
            </form>
          </div>
        )}

        {/* Redirect */}
        <div className="mt-8 border-t pt-6 text-center">
          <Link to="/customer-login" className="text-xs text-gray-500 hover:text-[#2E7D32] font-semibold inline-flex items-center gap-1">
            <ArrowLeft className="h-3.5 w-3.5" /> Back to Login
          </Link>
        </div>
      </div>
    </div>
  );
};

export default ForgotPassword;
