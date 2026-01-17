"use client";
import React, { useState } from 'react';
import { 
  Building2, 
  Landmark, 
  Search, 
  ArrowRight, 
  Bell, 
  ChevronRight,
  Briefcase
} from 'lucide-react';
import { useRouter } from 'next/navigation';

const RegisterNewService: React.FC = () => {
  const [description, setDescription] = useState('');

  const router = useRouter();

  return (
    <div className="min-h-screen bg-slate-50 font-sans text-slate-900 pb-20">
      
      {/* --- Header --- */}
      <header className="bg-white border-b border-slate-200 sticky top-0 z-30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center gap-2">
              <div className="bg-blue-700 text-white p-1.5 rounded-lg">
                <Landmark size={20} />
              </div>
              <span className="font-bold text-lg tracking-tight">National Service Portal</span>
            </div>
            
            <div className="flex items-center gap-4">
              <button className="text-slate-500 hover:text-blue-700">
                <Bell size={20} />
              </button>
              <div className="flex items-center gap-3 pl-4 border-l border-slate-200">
                <div className="text-right hidden sm:block">
                  <p className="text-sm font-bold text-slate-900">Sarah Jenkins</p>
                  <p className="text-xs text-slate-500">Admin</p>
                </div>
                <div className="w-9 h-9 rounded-full bg-slate-200 overflow-hidden border border-slate-300">
                   <img 
                     src="https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&q=80&w=200" 
                     alt="Profile" 
                     className="w-full h-full object-cover"
                   />
                </div>
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* --- Breadcrumb & Title --- */}
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex items-center text-xs text-slate-500 gap-2 mb-4">
          <a href="#" className="hover:text-blue-700">Home</a>
          <ChevronRight size={12} />
          <a href="#" className="hover:text-blue-700">Services</a>
          <ChevronRight size={12} />
          <span className="text-slate-800 font-medium">New Service</span>
        </div>

        <h1 className="text-3xl font-bold text-slate-900 mb-2">Register New Service</h1>
        <p className="text-slate-500 max-w-2xl">
          Complete the form below to initiate the onboarding process for a new government microservice.
        </p>
      </div>

      {/* --- Main Content --- */}
      <main className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6">
        
        {/* Progress Stepper Card */}
        <div className="bg-white rounded-xl border border-slate-200 p-6 shadow-sm">
          <div className="flex justify-between items-end mb-2">
            <span className="text-xs font-bold text-blue-700 uppercase tracking-wider">Step 1 of 3</span>
            <span className="text-xs text-slate-500">Next: Configuration</span>
          </div>
          
          <div className="grid grid-cols-3 gap-2 mb-2">
            <div className="h-1.5 bg-blue-700 rounded-full"></div>
            <div className="h-1.5 bg-slate-100 rounded-full"></div>
            <div className="h-1.5 bg-slate-100 rounded-full"></div>
          </div>

          <div className="grid grid-cols-3 gap-2 text-[10px] font-medium text-slate-400">
            <span className="text-slate-900 font-bold">Basic Info</span>
            <span>Configuration</span>
            
            <span>Review</span>
          </div>
        </div>

        {/* Form Card */}
        <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-8">
          
          {/* Section 1: Service Identification */}
          <section className="mb-10">
            <div className="flex items-center gap-2 mb-6 border-b border-slate-100 pb-4">
              <Briefcase className="text-blue-700" size={20} />
              <h2 className="text-lg font-bold text-slate-900">Service Identification</h2>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {/* Service Name Input */}
              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-2">
                  Service Name <span className="text-red-500">*</span>
                </label>
                <input 
                  type="text" 
                  className="w-full border border-slate-300 rounded-lg px-4 py-2.5 text-sm text-slate-900 placeholder:text-slate-400 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all bg-blue-50/30"
                  placeholder="e.g., National Health ID Renewal"
                />
                <p className="text-xs text-blue-700/70 mt-1.5">The public-facing name of the service.</p>
              </div>
              
              {/* Service Category Select */}
              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-2">
                  Service Category <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                  <select className="w-full border border-slate-300 rounded-lg px-4 py-2.5 text-sm text-slate-900 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none appearance-none bg-slate-50 cursor-pointer">
                    <option value="" disabled selected>Select a category...</option>
                    <option value="health">Healthcare</option>
                    <option value="finance">Finance & Tax</option>
                    <option value="transport">Transport</option>
                  </select>
                  <div className="absolute inset-y-0 right-0 flex items-center px-4 pointer-events-none text-slate-500">
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path></svg>
                  </div>
                </div>
              </div>
            </div>
          </section>

          {/* Section 2: Ownership & Context */}
          <section>
            <div className="flex items-center gap-2 mb-6 border-b border-slate-100 pb-4">
              <Building2 className="text-blue-700" size={20} />
              <h2 className="text-lg font-bold text-slate-900">Ownership & Context</h2>
            </div>

            <div className="space-y-6">
              {/* Department Owner Input */}
              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-2">
                  Department Owner <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Search size={18} className="text-blue-700" />
                  </div>
                  <input 
                    type="text" 
                    className="w-full border border-slate-300 rounded-lg pl-10 pr-4 py-3 text-sm text-slate-900 placeholder:text-slate-400 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none bg-slate-50"
                    placeholder="Search for a department..."
                  />
                </div>
                <p className="text-xs text-slate-500 mt-1.5">Select the government entity legally responsible for this service.</p>
              </div>

              {/* Short Description Textarea */}
              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-2">
                  Short Description
                </label>
                <textarea 
                  rows={4}
                  className="w-full border border-slate-300 rounded-lg p-4 text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none resize-none placeholder:text-slate-400 bg-slate-50"
                  placeholder="Briefly describe the purpose of this service..."
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  maxLength={250}
                ></textarea>
                <div className="text-right text-[10px] text-slate-400 mt-1">
                  {description.length}/250 characters
                </div>
              </div>
            </div>
          </section>

        </div>

        {/* --- Footer Actions --- */}
        <div className="flex justify-between items-center pt-4">
          <button className="px-6 py-3 border border-slate-300 rounded-lg text-sm font-semibold text-slate-700 hover:bg-slate-50 transition-colors bg-white">
            Cancel
          </button>
          
          <button onClick={() => {router.push('/ServiceRegistry/NewService/Step2')}} className="px-8 py-3 bg-blue-700 text-white rounded-lg text-sm font-bold hover:bg-blue-800 transition-colors shadow-lg shadow-blue-200 flex items-center gap-2">
            Next Step <ArrowRight size={16} />
          </button>
        </div>

      </main>
    </div>
  );
};

export default RegisterNewService;