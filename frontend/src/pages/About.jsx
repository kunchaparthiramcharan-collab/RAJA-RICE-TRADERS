import React from 'react';
import { Target, Eye, ShieldCheck, Heart, Award, Users } from 'lucide-react';

const About = () => {
  const values = [
    {
      icon: <Award className="h-8 w-8 text-[#D4A017]" />,
      title: "Quality First",
      desc: "We never compromise on grain quality. Each grain undergoes rigorous inspections."
    },
    {
      icon: <ShieldCheck className="h-8 w-8 text-[#D4A017]" />,
      title: "Integrity",
      desc: "Honest pricing, direct sourcing, and transparency in all our business trading transactions."
    },
    {
      icon: <Users className="h-8 w-8 text-[#D4A017]" />,
      title: "Customer Centric",
      desc: "Providing outstanding service to distributors, retailers, and individual families alike."
    },
    {
      icon: <Heart className="h-8 w-8 text-[#D4A017]" />,
      title: "Purity & Hygiene",
      desc: "Strict adherence to hygiene norms during cleaning, processing, and packaging."
    }
  ];

  return (
    <div className="pt-20">
      {/* Page Header */}
      <div className="bg-gradient-to-r from-[#2E7D32] to-[#1B5E20] text-white py-20 px-4 text-center">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-4xl md:text-5xl font-bold mb-4">About Raja Rice Traders</h1>
          <p className="text-lg text-green-100 max-w-2xl mx-auto">
            Establishing standards of purity and taste in every grain since inception.
          </p>
        </div>
      </div>

      {/* Main Intro & Owner Profile */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          <div>
            <span className="text-sm font-bold text-[#2E7D32] uppercase tracking-wider">Our Heritage</span>
            <h2 className="text-3xl font-bold text-gray-900 mt-2 mb-6">Premium Agricultural Milling & Trading</h2>
            <p className="text-gray-600 leading-relaxed mb-4">
              Raja Rice Traders is a premier rice milling and distribution company. We source our paddy directly from certified local farmers who cultivate crops under strict surveillance. Using high-efficiency modern milling machinery, we process rice to ensure it retains its natural aroma, taste, and nutritional value.
            </p>
            <p className="text-gray-600 leading-relaxed">
              Our state-of-the-art rice processing facility ensures that we remove impurities, polish, and package the rice under highly hygienic conditions. From Sona Masoori to fine Basmati, our grains represent superior quality trusted by thousands of families.
            </p>
          </div>
          
          {/* Owner Profile Card */}
          <div className="bg-gray-50 border border-gray-100 rounded-2xl p-8 shadow-sm flex flex-col md:flex-row items-center gap-6">
            <div className="w-32 h-32 rounded-full bg-[#2E7D32] flex items-center justify-center text-white text-4xl font-bold shadow-md flex-shrink-0">
              R
            </div>
            <div>
              <span className="bg-green-100 text-[#2E7D32] text-xs font-semibold px-3 py-1 rounded-full">Founder & Owner</span>
              <h3 className="text-2xl font-bold text-gray-900 mt-2">Rajashekar</h3>
              <p className="text-gray-500 text-sm mb-3">Raja Rice Traders</p>
              <p className="text-gray-600 italic text-sm">
                "Our business is built on a simple foundation: trust. We strive to deliver the highest quality grains to your kitchen table. For us, every grain is a promise of health and purity."
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Mission & Vision Section */}
      <section className="bg-gray-50 py-16 border-y border-gray-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
            {/* Mission */}
            <div className="bg-white p-8 rounded-2xl shadow-sm border border-gray-100 flex gap-5">
              <div className="bg-green-50 p-4 rounded-xl text-[#2E7D32] self-start">
                <Target className="h-8 w-8" />
              </div>
              <div>
                <h3 className="text-xl font-bold text-gray-900 mb-3">Our Mission</h3>
                <p className="text-gray-600 leading-relaxed">
                  To supply nutritious, pure, and premium quality rice to our customers by employing advanced processing technologies, maintaining ethical trade relationships with farmers, and delivering value at every touchpoint.
                </p>
              </div>
            </div>

            {/* Vision */}
            <div className="bg-white p-8 rounded-2xl shadow-sm border border-gray-100 flex gap-5">
              <div className="bg-green-50 p-4 rounded-xl text-[#2E7D32] self-start">
                <Eye className="h-8 w-8" />
              </div>
              <div>
                <h3 className="text-xl font-bold text-gray-900 mb-3">Our Vision</h3>
                <p className="text-gray-600 leading-relaxed">
                  To become a leading brand in the agricultural milling and rice trading industry, renowned for our commitment to quality, sustainable practices, and nourishing healthy lifestyles nationwide.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Core Values */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 text-center">
        <span className="text-sm font-bold text-[#2E7D32] uppercase tracking-wider">How We Work</span>
        <h2 className="text-3xl font-bold text-gray-900 mt-2 mb-12">Our Core Values</h2>
        
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
          {values.map((v, i) => (
            <div key={i} className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
              <div className="bg-yellow-50/50 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-5">
                {v.icon}
              </div>
              <h3 className="text-lg font-bold text-gray-900 mb-2">{v.title}</h3>
              <p className="text-gray-600 text-sm leading-relaxed">{v.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Quality Commitment CTA */}
      <section className="bg-gradient-to-br from-gray-900 to-gray-800 text-white py-16 px-4 text-center">
        <div className="max-w-3xl mx-auto">
          <h2 className="text-2xl md:text-3xl font-bold mb-4">Our Commitment to Quality</h2>
          <p className="text-gray-300 text-sm md:text-base leading-relaxed mb-6">
            From cleaning and destoning to polishing and multi-layer grading, our grain sorting process filters out broken kernels and foreign bodies. We guarantee clean, healthy, and fresh products in every package.
          </p>
          <div className="inline-flex items-center space-x-2 text-[#D4A017] font-semibold text-sm">
            <span>FSSAI Compliant & Quality Assured</span>
          </div>
        </div>
      </section>
    </div>
  );
};

export default About;
