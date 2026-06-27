import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Search, Info, Check, PackageOpen, AlertCircle, ShoppingBag, X } from 'lucide-react';
import { API_BASE_URL, useAuth } from '../context/AuthContext';

const Products = () => {
  const { isCustomerAuthenticated, customerUser } = useAuth();
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Search and filter state
  const [searchTerm, setSearchTerm] = useState('');
  const [activeCategory, setActiveCategory] = useState('All');

  // Selected package size state per product id (e.g. { prod_1: '25kg' })
  const [selectedSizes, setSelectedSizes] = useState({});

  // Inquiry Modal states
  const [inquiryProduct, setInquiryProduct] = useState(null);
  const [inquirySize, setInquirySize] = useState('25kg');
  const [inquiryQty, setInquiryQty] = useState(1);
  const [customerName, setCustomerName] = useState('');
  const [customerPhone, setCustomerPhone] = useState('');
  const [customerEmail, setCustomerEmail] = useState('');
  const [customerMessage, setCustomerMessage] = useState('');
  const [modalSubmitting, setModalSubmitting] = useState(false);
  const [modalSuccess, setModalSuccess] = useState(false);
  const [modalError, setModalError] = useState(null);
  const [validationErrors, setValidationErrors] = useState({});

  const categories = ['All', 'Premium', 'Standard', 'Super Premium', 'Economy'];

  useEffect(() => {
    fetchProducts();
  }, [activeCategory, searchTerm]);

  const fetchProducts = async () => {
    setLoading(true);
    try {
      const response = await axios.get(`${API_BASE_URL}/products`, {
        params: {
          category: activeCategory,
          search: searchTerm
        }
      });
      setProducts(response.data);
      
      // Initialize default selected sizes for new products
      const defaultSizes = {};
      response.data.forEach(p => {
        defaultSizes[p._id] = p.packageSizes && p.packageSizes.length > 0 ? p.packageSizes[0] : '25kg';
      });
      setSelectedSizes(prev => ({ ...defaultSizes, ...prev }));
      setError(null);
    } catch (err) {
      console.error(err);
      setError('Could not retrieve product list. Please check server connection.');
    } finally {
      setLoading(false);
    }
  };

  const handleSizeChange = (productId, size) => {
    setSelectedSizes(prev => ({
      ...prev,
      [productId]: size
    }));
  };

  const openInquiryModal = (product) => {
    setInquiryProduct(product);
    setInquirySize(selectedSizes[product._id] || '25kg');
    setInquiryQty(1);
    setModalSuccess(false);
    setModalError(null);
    setValidationErrors({});

    // Pre-fill user data if logged in
    if (isCustomerAuthenticated && customerUser) {
      setCustomerName(customerUser.name || '');
      setCustomerPhone(customerUser.phone || '');
      setCustomerEmail(customerUser.email || '');
    }
  };

  const validateModal = () => {
    const errs = {};
    if (!customerName.trim()) errs.name = 'Name is required';
    
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!customerEmail.trim()) {
      errs.email = 'Email is required';
    } else if (!emailRegex.test(customerEmail)) {
      errs.email = 'Invalid email format';
    }

    const phoneRegex = /^\d{10}$/;
    if (!customerPhone.trim()) {
      errs.phone = 'Phone number is required';
    } else if (!phoneRegex.test(customerPhone.replace(/[\s-()]/g, ''))) {
      errs.phone = 'Invalid 10-digit number';
    }

    if (inquiryQty < 1) errs.qty = 'Quantity must be at least 1';

    setValidationErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleSendInquiry = async (e) => {
    e.preventDefault();
    if (!validateModal()) return;

    setModalSubmitting(true);
    setModalError(null);

    try {
      const orderPayload = {
        customerName,
        customerPhone,
        customerEmail,
        message: customerMessage,
        products: [
          {
            name: inquiryProduct.name,
            size: inquirySize,
            quantity: Number(inquiryQty)
          }
        ]
      };

      await axios.post(`${API_BASE_URL}/orders`, orderPayload);
      setModalSuccess(true);
      setCustomerMessage('');
    } catch (err) {
      console.error(err);
      setModalError(err.response?.data?.message || 'Failed to submit inquiry. Please try again.');
    } finally {
      setModalSubmitting(false);
    }
  };

  return (
    <div className="pt-20 min-h-screen bg-gray-50/30 pb-20">
      {/* Page Header */}
      <div className="bg-gradient-to-r from-[#2E7D32] to-[#1B5E20] text-white py-20 px-4 text-center">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-4xl md:text-5xl font-bold mb-4">Our Rice Products</h1>
          <p className="text-lg text-green-100 max-w-2xl mx-auto">
            Browse our catalog of premium milled rice variants, select packet configurations, and request bulk price quotes.
          </p>
        </div>
      </div>

      {/* Search & Filter Container */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-12">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-white p-4 rounded-2xl border border-gray-100 shadow-sm mb-10">
          {/* Search bar */}
          <div className="relative flex-1 max-w-md">
            <span className="absolute inset-y-0 left-0 pl-3.5 flex items-center text-gray-400">
              <Search className="h-4 w-4" />
            </span>
            <input
              type="text"
              placeholder="Search by product name..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-[#2E7D32] transition-all text-sm"
            />
          </div>

          {/* Category filter tabs */}
          <div className="flex flex-wrap gap-1.5">
            {categories.map(cat => (
              <button
                key={cat}
                onClick={() => setActiveCategory(cat)}
                className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${
                  activeCategory === cat
                    ? 'bg-[#2E7D32] text-white shadow-sm'
                    : 'bg-gray-50 text-gray-600 hover:bg-gray-100'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>

        {/* Loading / Error states */}
        {loading ? (
          <div className="text-center py-20">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#2E7D32] mx-auto mb-4"></div>
            <p className="text-gray-500 font-semibold text-sm">Loading products catalog...</p>
          </div>
        ) : error ? (
          <div className="max-w-md mx-auto text-center py-16 px-4 bg-white rounded-2xl border border-gray-100 shadow-sm mt-10">
            <AlertCircle className="h-12 w-12 text-red-500 mx-auto mb-4" />
            <h3 className="text-lg font-bold text-gray-900 mb-2">Error Loading Catalog</h3>
            <p className="text-gray-500 text-sm mb-6">{error}</p>
            <button 
              onClick={fetchProducts}
              className="bg-[#2E7D32] text-white font-bold px-6 py-2.5 rounded-xl text-sm"
            >
              Retry Connection
            </button>
          </div>
        ) : products.length === 0 ? (
          <div className="max-w-md mx-auto text-center py-20">
            <PackageOpen className="h-14 w-14 text-gray-300 mx-auto mb-4" />
            <h3 className="text-lg font-bold text-gray-900 mb-1">No Products Found</h3>
            <p className="text-gray-500 text-sm">We couldn't find any products matching your active search filters.</p>
          </div>
        ) : (
          /* Products Grid */
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {products.map((product) => {
              const currentSelectedSize = selectedSizes[product._id] || (product.packageSizes && product.packageSizes[0]) || '25kg';
              
              return (
                <div 
                  key={product._id} 
                  className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden hover:shadow-md transition-shadow flex flex-col justify-between"
                >
                  <div>
                    {/* Image block */}
                    <div className="relative">
                      <img 
                        src={product.imageUrl || 'https://images.unsplash.com/photo-1586201375761-83865001e31c?auto=format&fit=crop&q=80&w=600'} 
                        alt={product.name} 
                        className="w-full h-48 object-cover"
                      />
                      <span className="absolute top-4 right-4 bg-[#2E7D32] text-white text-[10px] font-bold uppercase tracking-widest px-2.5 py-1 rounded-md shadow-sm">
                        {product.category}
                      </span>
                    </div>

                    {/* Content details */}
                    <div className="p-6">
                      <h3 className="text-xl font-bold text-gray-900 mb-2">{product.name}</h3>
                      <p className="text-gray-500 text-xs leading-relaxed mb-4 min-h-[48px]">{product.description}</p>
                      
                      {/* Price and Stock indicator */}
                      <div className="flex items-center justify-between border-t border-gray-50 pt-4 mb-4">
                        <div>
                          <span className="text-xs text-gray-400 block">Indicative Rate</span>
                          <span className="text-2xl font-black text-gray-900">
                            ₹{product.price} <span className="text-sm font-semibold text-gray-500">/ kg</span>
                          </span>
                        </div>
                        <div className="text-right flex flex-col items-end gap-1.5">
                          <span className={`inline-flex items-center text-xs font-semibold px-2 py-0.5 rounded ${
                            product.inStock 
                              ? 'bg-green-50 text-green-700' 
                              : 'bg-red-50 text-red-700'
                          }`}>
                            {product.inStock ? 'In Stock' : 'Out of Stock'}
                          </span>
                          {product.inStock && product.stockQuantity < 500 && (
                            <span className="text-[10px] font-bold text-red-600 bg-red-50 border border-red-100 px-2 py-0.5 rounded animate-pulse">
                              ⚠️ Low Stock: {product.stockQuantity}kg left!
                            </span>
                          )}
                        </div>
                      </div>

                      {/* Package sizes controls */}
                      <div className="mb-4">
                        <span className="text-[11px] font-semibold text-gray-400 block mb-2">Select Packaging Size</span>
                        <div className="flex flex-wrap gap-1.5">
                          {product.packageSizes && product.packageSizes.map((size) => (
                            <button
                              key={size}
                              onClick={() => handleSizeChange(product._id, size)}
                              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all border ${
                                currentSelectedSize === size
                                  ? 'bg-yellow-50 text-[#D4A017] border-[#D4A017] shadow-sm'
                                  : 'bg-white text-gray-600 border-gray-200 hover:bg-gray-50'
                              }`}
                            >
                              {size}
                            </button>
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Call-to-action button */}
                  <div className="p-6 pt-0">
                    <button
                      onClick={() => openInquiryModal(product)}
                      className="w-full bg-[#2E7D32] hover:bg-[#1B5E20] text-white font-bold py-2.5 rounded-xl shadow-sm hover:shadow-md transition-colors flex items-center justify-center gap-1.5 text-sm cursor-pointer"
                    >
                      <ShoppingBag className="h-4 w-4" />
                      Send Inquiry
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </section>

      {/* Inquiry Form Modal */}
      {inquiryProduct && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 animate-fade-in">
          <div className="bg-white rounded-2xl w-full max-w-lg overflow-hidden border border-gray-100 shadow-2xl relative">
            
            {/* Modal Header */}
            <div className="bg-[#2E7D32] text-white px-6 py-4 flex items-center justify-between">
              <div>
                <h3 className="font-bold text-lg">Product Inquiry</h3>
                <p className="text-xs text-green-100">Send details for a pricing quotation</p>
              </div>
              <button 
                onClick={() => setInquiryProduct(null)}
                className="text-white/80 hover:text-white bg-white/10 hover:bg-white/20 p-1.5 rounded-full transition-colors"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            {/* Modal Body */}
            <div className="p-6">
              {modalSuccess ? (
                <div className="text-center py-8">
                  <div className="bg-green-50 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4 text-green-600 shadow-inner">
                    <Check className="h-8 w-8" />
                  </div>
                  <h4 className="font-bold text-gray-900 text-lg mb-2">Inquiry Placed Successfully!</h4>
                  <p className="text-gray-500 text-sm mb-6 leading-relaxed">
                    We have received your product request for <span className="font-semibold text-gray-900">{inquiryProduct.name} ({inquirySize})</span>. Owner Rajashekar or our sales team will contact you shortly.
                  </p>
                  <button
                    onClick={() => setInquiryProduct(null)}
                    className="bg-[#2E7D32] hover:bg-[#1B5E20] text-white font-bold px-6 py-2.5 rounded-xl text-sm"
                  >
                    Close Window
                  </button>
                </div>
              ) : (
                <form onSubmit={handleSendInquiry} className="space-y-4">
                  {/* Selected product reference card */}
                  <div className="p-3 bg-gray-50 rounded-xl border border-gray-100 flex justify-between items-center text-xs">
                    <div>
                      <p className="text-gray-400 font-medium">Selected Variant</p>
                      <p className="font-bold text-gray-900 text-sm mt-0.5">{inquiryProduct.name}</p>
                    </div>
                    <div className="text-right">
                      <p className="text-gray-400 font-medium">Bag Size</p>
                      <p className="font-bold text-[#D4A017] text-sm mt-0.5">{inquirySize}</p>
                    </div>
                  </div>

                  {modalError && (
                    <div className="p-3 bg-red-50 border border-red-200 rounded-xl text-red-800 flex items-start gap-2 text-xs">
                      <AlertCircle className="h-4 w-4 text-red-600 flex-shrink-0 mt-0.5" />
                      <span>{modalError}</span>
                    </div>
                  )}

                  {/* Name Input */}
                  <div>
                    <label className="block text-xs font-semibold text-gray-700 mb-1">Your Name *</label>
                    <input
                      type="text"
                      value={customerName}
                      onChange={(e) => setCustomerName(e.target.value)}
                      className={`w-full px-3.5 py-2 rounded-xl border ${validationErrors.name ? 'border-red-300 bg-red-50/20' : 'border-gray-200'} text-xs focus:outline-none focus:ring-2 focus:ring-[#2E7D32]`}
                      placeholder="e.g. Ramesh Reddy"
                    />
                    {validationErrors.name && <span className="text-[10px] text-red-500 font-semibold mt-0.5 block">{validationErrors.name}</span>}
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    {/* Phone Input */}
                    <div>
                      <label className="block text-xs font-semibold text-gray-700 mb-1">Phone Number *</label>
                      <input
                        type="text"
                        value={customerPhone}
                        onChange={(e) => setCustomerPhone(e.target.value)}
                        className={`w-full px-3.5 py-2 rounded-xl border ${validationErrors.phone ? 'border-red-300 bg-red-50/20' : 'border-gray-200'} text-xs focus:outline-none focus:ring-2 focus:ring-[#2E7D32]`}
                        placeholder="10-digit mobile"
                      />
                      {validationErrors.phone && <span className="text-[10px] text-red-500 font-semibold mt-0.5 block">{validationErrors.phone}</span>}
                    </div>

                    {/* Email Input */}
                    <div>
                      <label className="block text-xs font-semibold text-gray-700 mb-1">Email Address *</label>
                      <input
                        type="email"
                        value={customerEmail}
                        onChange={(e) => setCustomerEmail(e.target.value)}
                        className={`w-full px-3.5 py-2 rounded-xl border ${validationErrors.email ? 'border-red-300 bg-red-50/20' : 'border-gray-200'} text-xs focus:outline-none focus:ring-2 focus:ring-[#2E7D32]`}
                        placeholder="email@example.com"
                      />
                      {validationErrors.email && <span className="text-[10px] text-red-500 font-semibold mt-0.5 block">{validationErrors.email}</span>}
                    </div>
                  </div>

                  <div className="grid grid-cols-3 gap-4 items-end">
                    {/* Quantity Input */}
                    <div className="col-span-1">
                      <label className="block text-xs font-semibold text-gray-700 mb-1">Quantity (Bags) *</label>
                      <input
                        type="number"
                        min="1"
                        value={inquiryQty}
                        onChange={(e) => setInquiryQty(e.target.value)}
                        className={`w-full px-3.5 py-2 rounded-xl border ${validationErrors.qty ? 'border-red-300 bg-red-50/20' : 'border-gray-200'} text-xs focus:outline-none focus:ring-2 focus:ring-[#2E7D32]`}
                      />
                      {validationErrors.qty && <span className="text-[10px] text-red-500 font-semibold mt-0.5 block">{validationErrors.qty}</span>}
                    </div>

                    <div className="col-span-2 text-xs text-gray-400 italic pb-2">
                      Minimum order: 1 bag. Bulk discounts calculated automatically.
                    </div>
                  </div>

                  {/* Message Input */}
                  <div>
                    <label className="block text-xs font-semibold text-gray-700 mb-1">Special Instructions / Message</label>
                    <textarea
                      value={customerMessage}
                      onChange={(e) => setCustomerMessage(e.target.value)}
                      rows="3"
                      className="w-full px-3.5 py-2 rounded-xl border border-gray-200 text-xs focus:outline-none focus:ring-2 focus:ring-[#2E7D32]"
                      placeholder="Add any specific questions, required shipping date or custom address..."
                    ></textarea>
                  </div>

                  {/* Submit Button */}
                  <button
                    type="submit"
                    disabled={modalSubmitting}
                    className="w-full bg-[#2E7D32] hover:bg-[#1B5E20] text-white font-bold py-2.5 rounded-xl text-xs shadow-md transition-colors flex items-center justify-center disabled:bg-gray-400"
                  >
                    {modalSubmitting ? 'Sending Request...' : 'Send Inquiry Request'}
                  </button>
                </form>
              )}
            </div>

          </div>
        </div>
      )}
    </div>
  );
};

export default Products;
