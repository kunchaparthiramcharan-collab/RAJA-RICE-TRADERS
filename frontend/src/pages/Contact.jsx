import React, { useState } from 'react';
import axios from 'axios';
import { Phone, Mail, MapPin, Clock, Send, CheckCircle2, AlertCircle } from 'lucide-react';
import { API_BASE_URL } from '../context/AuthContext';

const Contact = () => {
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    email: '',
    message: ''
  });

  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitSuccess, setSubmitSuccess] = useState(false);
  const [submitError, setSubmitError] = useState(null);

  const validate = () => {
    const newErrors = {};
    if (!formData.name.trim()) newErrors.name = 'Name is required';
    
    // Simple email regex validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!formData.email.trim()) {
      newErrors.email = 'Email is required';
    } else if (!emailRegex.test(formData.email)) {
      newErrors.email = 'Please enter a valid email address';
    }

    // Phone validation
    const phoneRegex = /^\d{10}$/;
    if (!formData.phone.trim()) {
      newErrors.phone = 'Phone number is required';
    } else if (!phoneRegex.test(formData.phone.replace(/[\s-()]/g, ''))) {
      newErrors.phone = 'Please enter a valid 10-digit phone number';
    }

    if (!formData.message.trim()) newErrors.message = 'Message details are required';

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    // Clear error for this field
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;

    setIsSubmitting(true);
    setSubmitSuccess(false);
    setSubmitError(null);

    try {
      // General inquiries are stored as empty products order list on backend
      await axios.post(`${API_BASE_URL}/orders`, {
        customerName: formData.name,
        customerPhone: formData.phone,
        customerEmail: formData.email,
        message: formData.message,
        products: [] 
      });

      setSubmitSuccess(true);
      setFormData({ name: '', phone: '', email: '', message: '' });
    } catch (err) {
      console.error(err);
      setSubmitError(err.response?.data?.message || 'Failed to submit inquiry. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="pt-20">
      {/* Page Header */}
      <div className="bg-gradient-to-r from-[#2E7D32] to-[#1B5E20] text-white py-20 px-4 text-center">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-4xl md:text-5xl font-bold mb-4">Contact Us</h1>
          <p className="text-lg text-green-100 max-w-2xl mx-auto">
            Have questions about pricing, bulk orders, or shipping? Reach out to Rajashekar and the team.
          </p>
        </div>
      </div>

      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
          {/* Contact Details Column */}
          <div className="lg:col-span-1 space-y-8">
            <div>
              <h2 className="text-2xl font-bold text-gray-900 mb-6">Get in Touch</h2>
              <p className="text-gray-600 text-sm leading-relaxed">
                Connect with our commercial office directly by phone, email, or visit our mill in the industrial belt.
              </p>
            </div>

            <div className="space-y-6">
              {/* Phone */}
              <div className="flex gap-4">
                <div className="bg-green-50 p-3.5 rounded-xl text-[#2E7D32] self-start shadow-sm">
                  <Phone className="h-6 w-6" />
                </div>
                <div>
                  <h4 className="font-bold text-gray-900 text-sm">Call/WhatsApp</h4>
                  <a href="tel:+919876543210" className="text-gray-600 hover:text-[#2E7D32] transition-colors text-sm mt-1 block">+91 98765 43210</a>
                  <span className="text-xs text-gray-400">Owner: Rajashekar</span>
                </div>
              </div>

              {/* Email */}
              <div className="flex gap-4">
                <div className="bg-green-50 p-3.5 rounded-xl text-[#2E7D32] self-start shadow-sm">
                  <Mail className="h-6 w-6" />
                </div>
                <div>
                  <h4 className="font-bold text-gray-900 text-sm">Email Address</h4>
                  <a href="mailto:rajaricetraders01@gmail.com" className="text-gray-600 hover:text-[#2E7D32] transition-colors text-sm mt-1 block">rajaricetraders01@gmail.com</a>
                </div>
              </div>

              {/* Address */}
              <div className="flex gap-4">
                <div className="bg-green-50 p-3.5 rounded-xl text-[#2E7D32] self-start shadow-sm">
                  <MapPin className="h-6 w-6" />
                </div>
                <div>
                  <h4 className="font-bold text-gray-900 text-sm">Factory & Office</h4>
                  <p className="text-gray-600 text-sm mt-1 leading-relaxed">
                    Near Krishna Talkies, Barlapenta Bazaar, Suryapet, Telangana, 508213, India
                  </p>
                </div>
              </div>

              {/* Hours */}
              <div className="flex gap-4">
                <div className="bg-green-50 p-3.5 rounded-xl text-[#2E7D32] self-start shadow-sm">
                  <Clock className="h-6 w-6" />
                </div>
                <div>
                  <h4 className="font-bold text-gray-900 text-sm">Operational Hours</h4>
                  <p className="text-gray-600 text-sm mt-1">Mon - Sat: 9:00 AM - 6:00 PM</p>
                  <p className="text-gray-400 text-xs mt-0.5">Sunday: Closed</p>
                </div>
              </div>
            </div>
          </div>

          {/* Form Column */}
          <div className="lg:col-span-2 bg-white rounded-2xl border border-gray-100 p-8 shadow-sm">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">Send an Inquiry Message</h2>
            
            {submitSuccess && (
              <div className="mb-6 p-4 bg-green-50 border border-green-200 rounded-xl text-green-800 flex items-start gap-3">
                <CheckCircle2 className="h-5 w-5 text-green-600 flex-shrink-0 mt-0.5" />
                <div>
                  <p className="font-bold">Thank You!</p>
                  <p className="text-sm text-green-700">Your inquiry message has been submitted. Our team will review the details and get back to you shortly.</p>
                </div>
              </div>
            )}

            {submitError && (
              <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-xl text-red-800 flex items-start gap-3">
                <AlertCircle className="h-5 w-5 text-red-600 flex-shrink-0 mt-0.5" />
                <p className="text-sm">{submitError}</p>
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-6" id="contact-form">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                {/* Name */}
                <div>
                  <label htmlFor="name" className="block text-sm font-semibold text-gray-700 mb-1">Your Name *</label>
                  <input
                    type="text"
                    id="name"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    className={`w-full px-4 py-2.5 rounded-xl border ${errors.name ? 'border-red-300 bg-red-50/20' : 'border-gray-200'} focus:outline-none focus:ring-2 focus:ring-[#2E7D32] transition-all text-sm`}
                    placeholder="Enter your name"
                  />
                  {errors.name && <span className="text-xs text-red-500 mt-1 block font-medium">{errors.name}</span>}
                </div>

                {/* Phone */}
                <div>
                  <label htmlFor="phone" className="block text-sm font-semibold text-gray-700 mb-1">Phone Number *</label>
                  <input
                    type="text"
                    id="phone"
                    name="phone"
                    value={formData.phone}
                    onChange={handleChange}
                    className={`w-full px-4 py-2.5 rounded-xl border ${errors.phone ? 'border-red-300 bg-red-50/20' : 'border-gray-200'} focus:outline-none focus:ring-2 focus:ring-[#2E7D32] transition-all text-sm`}
                    placeholder="e.g. 9876543210"
                  />
                  {errors.phone && <span className="text-xs text-red-500 mt-1 block font-medium">{errors.phone}</span>}
                </div>
              </div>

              {/* Email */}
              <div>
                <label htmlFor="email" className="block text-sm font-semibold text-gray-700 mb-1">Email Address *</label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  className={`w-full px-4 py-2.5 rounded-xl border ${errors.email ? 'border-red-300 bg-red-50/20' : 'border-gray-200'} focus:outline-none focus:ring-2 focus:ring-[#2E7D32] transition-all text-sm`}
                  placeholder="name@example.com"
                />
                {errors.email && <span className="text-xs text-red-500 mt-1 block font-medium">{errors.email}</span>}
              </div>

              {/* Message */}
              <div>
                <label htmlFor="message" className="block text-sm font-semibold text-gray-700 mb-1">Inquiry Description *</label>
                <textarea
                  id="message"
                  name="message"
                  rows="4"
                  value={formData.message}
                  onChange={handleChange}
                  className={`w-full px-4 py-2.5 rounded-xl border ${errors.message ? 'border-red-300 bg-red-50/20' : 'border-gray-200'} focus:outline-none focus:ring-2 focus:ring-[#2E7D32] transition-all text-sm`}
                  placeholder="Specify grain type, bulk quantities or direct questions here..."
                ></textarea>
                {errors.message && <span className="text-xs text-red-500 mt-1 block font-medium">{errors.message}</span>}
              </div>

              {/* Submit */}
              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full bg-[#2E7D32] hover:bg-[#1B5E20] text-white font-bold py-3 px-6 rounded-xl shadow-md hover:shadow-lg transition-all flex items-center justify-center gap-2 cursor-pointer disabled:bg-gray-400"
              >
                {isSubmitting ? 'Submitting...' : 'Send Message'}
                <Send className="h-4 w-4" />
              </button>
            </form>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Contact;
