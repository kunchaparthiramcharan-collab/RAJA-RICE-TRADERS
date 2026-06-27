import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { 
  ShoppingBag, 
  Clock, 
  CheckCircle, 
  XCircle, 
  TrendingUp, 
  ChevronRight, 
  LogOut, 
  RefreshCw,
  HelpCircle
} from 'lucide-react';

const CustomerDashboard = () => {
  const { isCustomerAuthenticated, customerUser, api, customerLogout } = useAuth();
  const navigate = useNavigate();

  const [inquiries, setInquiries] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!isCustomerAuthenticated) {
      navigate('/customer-login');
      return;
    }
    fetchMyInquiries();
  }, [isCustomerAuthenticated, navigate]);

  const fetchMyInquiries = async () => {
    setLoading(true);
    try {
      const response = await api.get('/orders/my-inquiries');
      setInquiries(response.data);
      setError(null);
    } catch (err) {
      console.error(err);
      setError('Failed to fetch your inquiries list. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    customerLogout();
    navigate('/customer-login');
  };

  // Metrics
  const totalInquiries = inquiries.length;
  const pendingCount = inquiries.filter(i => i.status === 'Pending').length;
  const completedCount = inquiries.filter(i => i.status === 'Completed').length;

  if (loading) {
    return (
      <div className="pt-32 text-center min-h-screen bg-gray-50">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#2E7D32] mx-auto mb-4"></div>
        <p className="text-gray-500 font-semibold text-sm">Loading your inquiry history...</p>
      </div>
    );
  }

  return (
    <div className="pt-20 min-h-screen bg-gray-50/50 pb-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        
        {/* Header panel */}
        <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-4 bg-white p-6 rounded-2xl border border-gray-100 shadow-sm mb-8">
          <div>
            <h1 className="text-3xl font-extrabold text-gray-900 tracking-tight">My Inquiries</h1>
            <p className="text-sm text-gray-500 mt-1">Welcome back, <span className="font-bold text-gray-800">{customerUser?.name}</span>. Track your quotes below.</p>
          </div>
          <div className="flex gap-2">
            <button 
              onClick={fetchMyInquiries}
              className="bg-gray-100 hover:bg-gray-200 text-gray-700 p-2.5 rounded-xl border border-gray-200 transition-colors flex items-center gap-1.5 text-xs font-bold"
            >
              <RefreshCw className="h-4 w-4" />
              Refresh
            </button>
            <button 
              onClick={handleLogout}
              className="bg-red-50 hover:bg-red-100 text-red-700 px-4 py-2.5 rounded-xl border border-red-200 transition-colors text-xs font-bold"
            >
              Logout Account
            </button>
          </div>
        </div>

        {error && (
          <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-xl text-red-800 text-xs">
            {error}
          </div>
        )}

        {/* Metrics Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 mb-8">
          {/* Card 1 */}
          <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm flex items-center gap-4">
            <div className="bg-blue-50 p-4 rounded-xl text-blue-600">
              <ShoppingBag className="h-6 w-6" />
            </div>
            <div>
              <span className="text-xs text-gray-400 font-semibold block">Total Inquiries</span>
              <span className="text-2xl font-black text-gray-900">{totalInquiries}</span>
            </div>
          </div>

          {/* Card 2 */}
          <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm flex items-center gap-4">
            <div className="bg-yellow-50 p-4 rounded-xl text-yellow-600">
              <Clock className="h-6 w-6" />
            </div>
            <div>
              <span className="text-xs text-gray-400 font-semibold block">Pending Quotes</span>
              <span className="text-2xl font-black text-gray-900">{pendingCount}</span>
            </div>
          </div>

          {/* Card 3 */}
          <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm flex items-center gap-4">
            <div className="bg-green-50 p-4 rounded-xl text-[#2E7D32]">
              <CheckCircle className="h-6 w-6" />
            </div>
            <div>
              <span className="text-xs text-gray-400 font-semibold block">Completed Orders</span>
              <span className="text-2xl font-black text-gray-900">{completedCount}</span>
            </div>
          </div>
        </div>

        {/* Inquiries Table */}
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
          <div className="p-6 border-b">
            <h3 className="font-bold text-gray-900 text-lg">My Inquiry History</h3>
          </div>

          {inquiries.length === 0 ? (
            <div className="text-center py-20 px-4">
              <ShoppingBag className="h-14 w-14 text-gray-300 mx-auto mb-4" />
              <h4 className="font-bold text-gray-900 text-lg mb-1">No Inquiries Found</h4>
              <p className="text-gray-500 text-sm mb-6 max-w-sm mx-auto">
                You haven't requested any rice quotes yet. View our catalog and send an inquiry.
              </p>
              <Link 
                to="/products"
                className="bg-[#2E7D32] hover:bg-[#1B5E20] text-white font-bold px-6 py-2.5 rounded-xl text-xs inline-flex items-center gap-1 shadow-sm"
              >
                Browse Rice Products
                <ChevronRight className="h-4 w-4" />
              </Link>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse text-sm">
                <thead>
                  <tr className="bg-gray-50 text-gray-400 uppercase text-[10px] tracking-wider border-b">
                    <th className="py-4 px-6 font-bold">Date Submitted</th>
                    <th className="py-4 px-6 font-bold">Rice Varieties Requested</th>
                    <th className="py-4 px-6 font-bold">Your Instructions</th>
                    <th className="py-4 px-6 font-bold">Quote Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {inquiries.map((inquiry) => (
                    <tr key={inquiry._id} className="hover:bg-gray-50/50">
                      <td className="py-4 px-6 text-gray-600 font-semibold text-xs">
                        {new Date(inquiry.createdAt).toLocaleDateString(undefined, {
                          year: 'numeric',
                          month: 'long',
                          day: 'numeric'
                        })}
                      </td>
                      <td className="py-4 px-6">
                        {inquiry.products && inquiry.products.length > 0 ? (
                          <ul className="space-y-1">
                            {inquiry.products.map((item, idx) => (
                              <li key={idx} className="font-bold text-gray-900 text-xs bg-gray-50 border p-1 rounded-md max-w-xs">
                                {item.name} ({item.size}) <span className="text-[#2E7D32]">x {item.quantity} bags</span>
                              </li>
                            ))}
                          </ul>
                        ) : (
                          <span className="text-xs text-gray-400 italic bg-gray-50 border p-1 rounded-md">General Inquiry</span>
                        )}
                      </td>
                      <td className="py-4 px-6 text-xs text-gray-500 max-w-xs truncate" title={inquiry.message}>
                        {inquiry.message || '-'}
                      </td>
                      <td className="py-4 px-6">
                        <span className={`inline-flex items-center text-xs font-bold px-2.5 py-1 rounded-md ${
                          inquiry.status === 'Pending' ? 'bg-yellow-50 text-yellow-700 border border-yellow-200' :
                          inquiry.status === 'Completed' ? 'bg-green-50 text-green-700 border border-green-200' :
                          'bg-red-50 text-red-700 border border-red-200'
                        }`}>
                          {inquiry.status === 'Pending' && <Clock className="h-3 w-3 mr-1" />}
                          {inquiry.status === 'Completed' && <CheckCircle className="h-3 w-3 mr-1" />}
                          {inquiry.status === 'Cancelled' && <XCircle className="h-3 w-3 mr-1" />}
                          {inquiry.status}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>

        {/* Support panel */}
        <div className="mt-8 bg-gray-950 text-white p-6 rounded-2xl flex flex-col md:flex-row justify-between items-center gap-4">
          <div className="flex items-center gap-3">
            <div className="bg-[#2E7D32] p-2.5 rounded-xl">
              <HelpCircle className="h-6 w-6 text-white" />
            </div>
            <div>
              <h4 className="font-bold text-sm">Need immediate assistance?</h4>
              <p className="text-xs text-gray-400 mt-0.5">Connect directly with owner Rajashekar for bulk delivery rates.</p>
            </div>
          </div>
          <a 
            href="tel:+919876543210" 
            className="bg-[#2E7D32] hover:bg-[#1B5E20] text-white font-bold px-6 py-2.5 rounded-xl text-xs transition-colors"
          >
            Call +91 98765 43210
          </a>
        </div>
      </div>
    </div>
  );
};

export default CustomerDashboard;
