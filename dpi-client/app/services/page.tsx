"use client";
import React from 'react';
import { Shield, ArrowRight, Briefcase, Heart, Tractor, Building } from 'lucide-react';
import { useRouter } from 'next/navigation';

const ServicesPage: React.FC = () => {
  const router = useRouter();

  const serviceCategories = [
    { 
      name: 'Healthcare', 
      icon: Heart, 
      description: 'Access health records, book appointments, and find doctors near you.',
      path: '/citizen/healthcare'
    },
    { 
      name: 'Agriculture', 
      icon: Tractor, 
      description: 'Get crop advisories, market prices, and information on government schemes for farmers.',
      path: '/citizen/agriculture'
    },
    { 
      name: 'Urban Services', 
      icon: Building, 
      description: 'Manage property taxes, report civic issues, and access other urban amenities.',
      path: '/citizen/urban'
    },
  ];

  return (
    <div className="min-h-screen bg-slate-50 font-sans text-slate-900">
      {/* Header */}
      <header className="sticky top-0 z-50 bg-white border-b border-slate-200">
        <div className="h-1 w-full bg-gradient-to-r from-orange-400 via-white to-green-600"></div>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-20">
            <div className="flex items-center gap-3 cursor-pointer" onClick={() => router.push('/')}>
              <div className="text-blue-700">
                <Shield size={32} fill="currentColor" className="text-blue-700" />
              </div>
              <div className="flex flex-col">
                <span className="font-bold text-lg leading-tight text-slate-900">BharatSetu</span>
                <span className="text-xs uppercase tracking-wider text-slate-500 font-semibold">One Platform, Many Services</span>
              </div>
            </div>
            <button onClick={() => router.push('/login')} className="px-5 py-2 bg-blue-700 text-white rounded-lg text-sm font-semibold hover:bg-blue-800 transition-colors shadow-sm shadow-blue-200">
              Login / Register
            </button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h1 className="text-4xl lg:text-5xl font-extrabold tracking-tight text-slate-900">Explore Our Services</h1>
            <p className="mt-4 text-lg text-slate-500 max-w-3xl mx-auto">A comprehensive suite of digital services designed to be accessible, transparent, and efficient for every citizen.</p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {serviceCategories.map((service) => (
              <div 
                key={service.name} 
                className="bg-white rounded-2xl p-8 shadow-sm hover:shadow-xl transition-shadow border border-slate-100 flex flex-col cursor-pointer"
                onClick={() => router.push(service.path)}
              >
                <div className="w-14 h-14 bg-blue-100 rounded-lg flex items-center justify-center text-blue-600 mb-6">
                  <service.icon size={28} />
                </div>
                <h3 className="text-xl font-bold text-slate-900 mb-3">{service.name}</h3>
                <p className="text-sm text-slate-500 leading-relaxed mb-6 flex-grow">
                  {service.description}
                </p>
                <div className="inline-flex items-center text-blue-600 font-semibold text-sm group">
                  Explore Services 
                  <ArrowRight size={16} className="ml-2 group-hover:translate-x-1 transition-transform" />
                </div>
              </div>
            ))}
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="bg-white pt-16 border-t border-slate-200 mt-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="border-t border-slate-100 py-8 text-center text-xs text-slate-400">
                <p>© 2024 BharatSetu. All rights reserved.</p>
            </div>
        </div>
      </footer>
    </div>
  );
};

export default ServicesPage;
