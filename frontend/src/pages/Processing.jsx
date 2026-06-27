import React from 'react';
import { 
  Sprout, 
  Trash2, 
  Sun, 
  Settings, 
  Sparkles, 
  FileCheck, 
  Package, 
  Warehouse, 
  Truck 
} from 'lucide-react';

const Processing = () => {
  const steps = [
    {
      icon: <Sprout className="h-6 w-6 text-white" />,
      title: "Paddy Collection",
      desc: "Sourcing premium-grade raw paddy directly from certified local farmers and agricultural fields."
    },
    {
      icon: <Trash2 className="h-6 w-6 text-white" />,
      title: "Cleaning",
      desc: "Passing paddy through advanced destoners and pre-cleaners to remove dust, straw, stones, and foreign objects."
    },
    {
      icon: <Sun className="h-6 w-6 text-white" />,
      title: "Drying",
      desc: "Using modern mechanical hot-air dryers to regulate moisture content, ensuring optimal grain milling quality."
    },
    {
      icon: <Settings className="h-6 w-6 text-white" />,
      title: "Milling & Dehusking",
      desc: "De-husking paddy grains using rubber rollers to separate the outer hulls from brown rice kernels."
    },
    {
      icon: <Sparkles className="h-6 w-6 text-white" />,
      title: "Polishing & Whitening",
      desc: "Removing bran layers gently with mist polishers to yield clean, polished, and shiny white rice."
    },
    {
      icon: <FileCheck className="h-6 w-6 text-white" />,
      title: "Quality Check & Grading",
      desc: "Utilizing optical color sorters to detect and filter out discolored, damaged, or broken grains."
    },
    {
      icon: <Package className="h-6 w-6 text-white" />,
      title: "Hygienic Packaging",
      desc: "Automated filling and sealing of rice into premium moisture-resistant bags (5kg, 10kg, 25kg, 50kg)."
    },
    {
      icon: <Warehouse className="h-6 w-6 text-white" />,
      title: "Warehouse Storage",
      desc: "Storing bagged rice in clean, dry, well-ventilated, and pest-controlled warehouse structures."
    },
    {
      icon: <Truck className="h-6 w-6 text-white" />,
      title: "Safe Delivery",
      desc: "Loading products onto transport trucks and shipping efficiently to wholesale partners and retail stores."
    }
  ];

  return (
    <div className="pt-20 bg-gray-50/50 min-h-screen">
      {/* Page Header */}
      <div className="bg-gradient-to-r from-[#2E7D32] to-[#1B5E20] text-white py-20 px-4 text-center">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-4xl md:text-5xl font-bold mb-4">Rice Processing Lifecycle</h1>
          <p className="text-lg text-green-100 max-w-2xl mx-auto">
            From lush agricultural fields to your kitchen table—discover how we process premium quality grains.
          </p>
        </div>
      </div>

      {/* Timeline Section */}
      <section className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <div className="relative border-l-2 border-green-200 ml-4 md:ml-32">
          {steps.map((step, index) => (
            <div key={index} className="mb-12 last:mb-0 relative pl-8 md:pl-12 group">
              {/* Timeline Icon Badge */}
              <div className="absolute -left-[17px] top-1.5 flex items-center justify-center w-8 h-8 rounded-full bg-[#2E7D32] ring-4 ring-white group-hover:bg-[#D4A017] transition-colors duration-300">
                {step.icon}
              </div>

              {/* Step number on desktop */}
              <div className="hidden md:block absolute -left-28 top-1.5 text-right w-20">
                <span className="text-xs font-bold text-gray-400 block uppercase">Step</span>
                <span className="text-2xl font-black text-[#2E7D32] group-hover:text-[#D4A017] transition-colors">
                  0{index + 1}
                </span>
              </div>

              {/* Step content card */}
              <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm hover:shadow-md transition-all duration-300 group-hover:border-green-100">
                {/* Mobile step label */}
                <span className="inline-block md:hidden text-xs font-bold text-[#2E7D32] mb-1 bg-green-50 px-2 py-0.5 rounded">
                  Step 0{index + 1}
                </span>
                <h3 className="text-xl font-bold text-gray-900 mb-2 group-hover:text-[#2E7D32] transition-colors">
                  {step.title}
                </h3>
                <p className="text-gray-600 text-sm leading-relaxed">
                  {step.desc}
                </p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Quality Standards Panel */}
      <section className="bg-white border-t border-gray-100 py-16 px-4">
        <div className="max-w-5xl mx-auto text-center">
          <span className="text-sm font-bold text-[#2E7D32] uppercase tracking-wider">Uncompromised Standard</span>
          <h2 className="text-3xl font-bold text-gray-900 mt-2 mb-6">Our Automated Processing Edge</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-left mt-12">
            <div className="p-6 bg-gray-50 rounded-xl border border-gray-100">
              <h4 className="font-bold text-gray-900 mb-2">Zero Hand-Touch Milling</h4>
              <p className="text-gray-600 text-sm leading-relaxed">
                Our mill operations are fully automated to maintain sterile conditions, ensuring maximum hygiene throughout processing.
              </p>
            </div>
            <div className="p-6 bg-gray-50 rounded-xl border border-gray-100">
              <h4 className="font-bold text-gray-900 mb-2">Precision Grading</h4>
              <p className="text-gray-600 text-sm leading-relaxed">
                Color sorter technology identifies and discards black tips or damaged grains, delivering uniform aesthetic purity.
              </p>
            </div>
            <div className="p-6 bg-gray-50 rounded-xl border border-gray-100">
              <h4 className="font-bold text-gray-900 mb-2">Moisture Regulation</h4>
              <p className="text-gray-600 text-sm leading-relaxed">
                We monitor humidity closely to protect kernels from cracking, preserving cooking expansion and aroma characteristics.
              </p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Processing;
