import React from 'react';
import { Link } from 'react-router-dom';
import { Sprout, CheckCircle2, ChevronRight, Star, ShieldCheck, Truck, ShoppingBag, Eye } from 'lucide-react';

const Home = () => {
  const whyChooseUs = [
    {
      icon: <ShieldCheck className="h-8 w-8 text-[#2E7D32]" />,
      title: "100% Premium Quality",
      desc: "Every batch undergoes rigorous quality control to ensure clean, sorted, and delicious grains."
    },
    {
      icon: <Sprout className="h-8 w-8 text-[#2E7D32]" />,
      title: "Direct Farm Sourcing",
      desc: "We source raw paddy directly from trusted farmers, supporting agriculture and getting authentic seeds."
    },
    {
      icon: <Truck className="h-8 w-8 text-[#2E7D32]" />,
      title: "Fast & Reliable Shipping",
      desc: "Efficient distribution network ensures timely bulk deliveries to wholesalers and stores."
    },
    {
      icon: <ShoppingBag className="h-8 w-8 text-[#2E7D32]" />,
      title: "Flexible Packaging",
      desc: "Moisture-sealed bags available in various sizes: 5kg, 10kg, 25kg, and 50kg for convenience."
    }
  ];

  const featuredProducts = [
    {
      name: "Sona Masoori Rice",
      desc: "Lightweight and aromatic medium grain rice, ideal for daily meals.",
      image: "https://images.unsplash.com/photo-1586201375761-83865001e31c?auto=format&fit=crop&q=80&w=600",
      sizes: ["5kg", "10kg", "25kg", "50kg"]
    },
    {
      name: "BPT Rice",
      desc: "Fine quality grain with delicious texture and premium expansion when cooked.",
      image: "https://images.unsplash.com/photo-1568254183919-78a4f43a2877?auto=format&fit=crop&q=80&w=600",
      sizes: ["10kg", "25kg", "50kg"]
    },
    {
      name: "Basmati Rice",
      desc: "Aromatic extra-long slender grains, aged to perfection for biryanis.",
      image: "https://images.unsplash.com/photo-1586201375761-83865001e31c?auto=format&fit=crop&q=80&w=600",
      sizes: ["5kg", "10kg", "25kg"]
    }
  ];

  const testimonials = [
    {
      name: "K. Venkatesh",
      role: "Wholesale Distributor, Hyderabad",
      text: "We have been sourcing Sona Masoori and BPT rice from Raja Rice Traders for over 3 years. The grain consistency is top-notch, and the polish quality is excellent.",
      stars: 5
    },
    {
      name: "Gopal Rao",
      role: "Paddy Farmer, Suryapet",
      text: "Rajashekar pays fair market prices directly to farmers. They are honest partners who appreciate our hard work in cultivating premium grade paddy crops.",
      stars: 5
    },
    {
      name: "Anjali Sharma",
      role: "Retail Store Owner",
      text: "The packaging quality is highly durable and prevents moisture. Customers frequently request Raja Rice variants because of their rich aroma and cooking properties.",
      stars: 5
    }
  ];

  return (
    <div>
      {/* Hero Section */}
      <div 
        className="relative bg-cover bg-center h-screen flex items-center justify-center text-white"
        style={{ backgroundImage: `url('https://images.unsplash.com/photo-1536630590255-f8555e1ae722?auto=format&fit=crop&q=80&w=1920')` }}
      >
        <div className="absolute inset-0 hero-overlay"></div>
        <div className="relative z-10 max-w-4xl mx-auto px-4 text-center">
          <div className="flex justify-center mb-6">
            <div className="bg-[#2E7D32] p-4 rounded-2xl text-white inline-block shadow-lg animate-bounce">
              <Sprout className="h-10 w-10" />
            </div>
          </div>
          <h1 className="text-4xl sm:text-6xl font-extrabold tracking-tight mb-4">
            Raja Rice <span className="text-[#D4A017]">Traders</span>
          </h1>
          <p className="text-xl sm:text-2xl font-medium text-yellow-500 mb-6 italic">
            "Premium Quality Rice, Trusted by Every Family."
          </p>
          <p className="text-md sm:text-lg text-gray-300 max-w-2xl mx-auto mb-10 leading-relaxed">
            Led by Rajashekar, we are a leading rice mill processing and distributing hygienic, aromatic, and nutritional rice variants. Direct sourcing from farmers guarantees organic purity.
          </p>
          <div className="flex flex-col sm:flex-row justify-center gap-4">
            <Link 
              to="/products"
              className="bg-[#2E7D32] hover:bg-[#1B5E20] text-white font-bold px-8 py-3.5 rounded-xl shadow-lg transition-colors flex items-center justify-center"
            >
              View Products
              <ChevronRight className="ml-1.5 h-5 w-5" />
            </Link>
            <Link 
              to="/contact"
              className="bg-transparent hover:bg-white/10 text-white font-bold px-8 py-3.5 rounded-xl border border-white transition-colors flex items-center justify-center"
            >
              Contact Us
            </Link>
          </div>
        </div>
      </div>

      {/* Why Choose Us */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <div className="text-center mb-16">
          <span className="text-sm font-bold text-[#2E7D32] uppercase tracking-wider">Our Strengths</span>
          <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mt-2">Why Choose Raja Rice Traders</h2>
          <p className="text-gray-500 max-w-lg mx-auto mt-4 text-sm sm:text-base">
            We deliver state-of-the-art milling standards with dedication to nutrition and customer trust.
          </p>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
          {whyChooseUs.map((item, index) => (
            <div key={index} className="bg-white p-8 rounded-2xl shadow-sm hover:shadow-md border border-gray-100 transition-all duration-300">
              <div className="bg-green-50 w-14 h-14 rounded-xl flex items-center justify-center mb-6">
                {item.icon}
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-3">{item.title}</h3>
              <p className="text-gray-600 text-sm leading-relaxed">{item.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Featured Products */}
      <section className="bg-gray-50 py-20 border-y border-gray-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col sm:flex-row justify-between items-center mb-16">
            <div>
              <span className="text-sm font-bold text-[#2E7D32] uppercase tracking-wider">Premium Selection</span>
              <h2 className="text-3xl font-bold text-gray-900 mt-2">Featured Products</h2>
            </div>
            <Link 
              to="/products" 
              className="text-[#2E7D32] hover:text-[#1B5E20] font-bold text-sm flex items-center gap-1 mt-4 sm:mt-0"
            >
              Browse All Products <ChevronRight className="h-4 w-4" />
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {featuredProducts.map((p, idx) => (
              <div key={idx} className="bg-white rounded-2xl shadow-sm overflow-hidden border border-gray-100 hover:shadow-lg transition-shadow">
                <img 
                  src={p.image} 
                  alt={p.name} 
                  className="w-full h-48 object-cover"
                />
                <div className="p-6">
                  <h3 className="text-xl font-bold text-gray-900 mb-2">{p.name}</h3>
                  <p className="text-gray-600 text-sm mb-4 leading-relaxed line-clamp-2">{p.desc}</p>
                  <div className="border-t border-gray-100 pt-4">
                    <span className="text-xs font-semibold text-gray-500 block mb-2">Available in packet sizes:</span>
                    <div className="flex flex-wrap gap-1.5">
                      {p.sizes.map((s, sidx) => (
                        <span key={sidx} className="bg-gray-100 text-gray-700 text-xs px-2.5 py-1 rounded-md font-semibold">
                          {s}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Teaser: Processing Timeline */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 text-center">
        <span className="text-sm font-bold text-[#2E7D32] uppercase tracking-wider">The Milling Process</span>
        <h2 className="text-3xl font-bold text-gray-900 mt-2 mb-6">From Paddy fields to White Rice</h2>
        <p className="text-gray-600 max-w-2xl mx-auto mb-10 text-sm sm:text-base leading-relaxed">
          Our grains undergo a meticulous 9-step automated process: Cleaning, Drying, De-husking, Polishing, optical Sorting, and sealed Packaging. This ensures a dirt-free product with natural food value intact.
        </p>
        <Link 
          to="/processing" 
          className="bg-white hover:bg-gray-50 text-[#2E7D32] border-2 border-[#2E7D32] font-bold px-8 py-3 rounded-xl transition-colors inline-flex items-center gap-1.5"
        >
          <Eye className="h-5 w-5" />
          View Interactive Process Timeline
        </Link>
      </section>

      {/* Customer Testimonials */}
      <section className="bg-gray-900 text-white py-20 px-4">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <span className="text-sm font-bold text-[#D4A017] uppercase tracking-wider">Testimonials</span>
            <h2 className="text-3xl font-bold mt-2">What Our Customers Say</h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {testimonials.map((t, index) => (
              <div key={index} className="bg-gray-800 p-8 rounded-2xl border border-gray-700 flex flex-col justify-between">
                <div>
                  <div className="flex gap-1 mb-4 text-[#D4A017]">
                    {[...Array(t.stars)].map((_, i) => (
                      <Star key={i} className="h-5 w-5 fill-current" />
                    ))}
                  </div>
                  <p className="text-gray-300 text-sm italic leading-relaxed mb-6">"{t.text}"</p>
                </div>
                <div>
                  <h4 className="font-bold text-white text-md">{t.name}</h4>
                  <p className="text-[#D4A017] text-xs font-semibold">{t.role}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Banner */}
      <section className="bg-gradient-to-br from-[#2E7D32] to-[#1B5E20] text-white py-16 px-4 text-center relative overflow-hidden">
        <div className="relative z-10 max-w-4xl mx-auto">
          <h2 className="text-3xl font-bold mb-4">Request a Wholesale or Retail Quote Today</h2>
          <p className="text-green-100 max-w-xl mx-auto mb-8 text-sm sm:text-base leading-relaxed">
            Interested in bulk distribution or pricing inquiries? Get in touch with our team, and we will get back to you with custom pricing quotes.
          </p>
          <div className="flex justify-center gap-4 flex-wrap">
            <Link 
              to="/contact" 
              className="bg-[#D4A017] hover:bg-[#B3860F] text-white font-bold px-8 py-3 rounded-xl shadow-md transition-colors"
            >
              Get In Touch
            </Link>
            <Link 
              to="/products" 
              className="bg-transparent hover:bg-white/10 text-white font-bold px-8 py-3 rounded-xl border border-white/30 transition-colors"
            >
              Inquire Products
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home;
