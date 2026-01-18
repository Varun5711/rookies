"use client"
import React, { useState } from 'react';
import { 
  Bell, 
  HelpCircle, 
  User, 
  ChevronRight, 
  ClipboardList, 
  MapPin, 
  Camera, 
  CloudUpload, 
  Lock, 
  Search,
  Check,
  Landmark,
  ArrowRight
} from 'lucide-react';

const FileGrievance: React.FC = () => {
  const [description, setDescription] = useState('');

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
            
            <nav className="hidden md:flex items-center gap-8 text-sm font-medium text-slate-600">
              <a href="#" className="hover:text-blue-700">Home</a>
              <a href="#" className="text-blue-700 font-semibold">Urban Services</a>
              <a href="#" className="hover:text-blue-700">Grievances</a>
              <a href="#" className="hover:text-blue-700">Profile</a>
            </nav>

            <div className="flex items-center gap-4">
              <button className="text-slate-500 hover:text-blue-700">
                <Bell size={20} />
              </button>
              <button className="text-slate-500 hover:text-blue-700">
                <HelpCircle size={20} />
              </button>
              <div className="w-8 h-8 rounded-full bg-orange-100 flex items-center justify-center border border-orange-200 overflow-hidden">
                <img 
                  src="https://images.unsplash.com/photo-1599566150163-29194dcaad36?auto=format&fit=crop&q=80&w=100" 
                  alt="User" 
                  className="w-full h-full object-cover"
                />
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* --- Breadcrumb --- */}
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <div className="flex items-center text-xs text-slate-500 gap-2 mb-4">
          <a href="#" className="hover:text-blue-700">Home</a>
          <ChevronRight size={12} />
          <a href="#" className="hover:text-blue-700">Urban Services</a>
          <ChevronRight size={12} />
          <span className="text-slate-800 font-medium">File Grievance</span>
        </div>

        <h1 className="text-3xl font-bold text-slate-900 mb-2">File a New Urban Grievance</h1>
        <p className="text-slate-500 max-w-2xl">
          Please provide details about the issue. Your identity will remain confidential and tracking updates will be sent to your profile.
        </p>
      </div>

      {/* --- Main Form Container --- */}
      <main className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">

        <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden p-6 md:p-8 space-y-10">
          
          {/* Section 1: Issue Details */}
          <section>
            <div className="flex items-center gap-2 mb-6">
              <ClipboardList className="text-blue-700" size={20} />
              <h2 className="text-lg font-bold text-slate-900">Issue Details</h2>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-2">
                  Grievance Category <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                  <select className="w-full border border-slate-300 rounded-lg p-3 text-sm text-slate-600 focus:ring-2 focus:ring-blue-500 outline-none bg-white appearance-none cursor-pointer">
                    <option>Select a category...</option>
                    <option>Road Maintenance</option>
                    <option>Garbage Collection</option>
                    <option>Street Lighting</option>
                    <option>Water Supply</option>
                  </select>
                  <ChevronRight className="absolute right-3 top-3.5 h-4 w-4 text-slate-400 rotate-90 pointer-events-none" />
                </div>
              </div>
              
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-2">
                  Urgency Level
                </label>
                <div className="relative">
                  <select className="w-full border border-slate-300 rounded-lg p-3 text-sm text-slate-600 focus:ring-2 focus:ring-blue-500 outline-none bg-white appearance-none cursor-pointer">
                    <option>Normal</option>
                    <option>Urgent</option>
                    <option>Critical</option>
                  </select>
                  <ChevronRight className="absolute right-3 top-3.5 h-4 w-4 text-slate-400 rotate-90 pointer-events-none" />
                </div>
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-2">
                Describe the Issue <span className="text-red-500">*</span>
              </label>
              <textarea 
                rows={4}
                className="w-full border border-slate-300 rounded-lg p-3 text-sm focus:ring-2 focus:ring-blue-500 outline-none resize-none placeholder:text-slate-400 bg-slate-50"
                placeholder="Please describe the problem in detail (e.g., location specifics, duration of issue)..."
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                maxLength={500}
              ></textarea>
              <div className="text-right text-[10px] text-slate-400 mt-1">
                {description.length}/500 characters
              </div>
            </div>
          </section>

          <hr className="border-slate-100" />

          {/* Section 2: Incident Location */}
          <section>
            <div className="flex items-center gap-2 mb-6">
              <MapPin className="text-blue-700" size={20} />
              <h2 className="text-lg font-bold text-slate-900">Incident Location</h2>
            </div>

            <div className="flex flex-col md:flex-row gap-6">
              <div className="flex-1 space-y-6">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-2">
                    Search Address or Landmark
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <Search size={16} className="text-slate-400" />
                    </div>
                    <input 
                      type="text" 
                      className="w-full border border-slate-300 rounded-lg pl-10 pr-24 py-2.5 text-sm focus:ring-2 focus:ring-blue-500 outline-none"
                      placeholder="Enter location..."
                    />
                    <button className="absolute right-1 top-1 bottom-1 bg-blue-50 text-blue-700 px-3 rounded text-xs font-bold hover:bg-blue-100 transition-colors">
                      Locate Me
                    </button>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-2">Pincode</label>
                    <input type="text" className="w-full border border-slate-300 rounded-lg p-2.5 text-sm outline-none focus:border-blue-500 bg-slate-50" />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-2">Ward No.</label>
                    <input type="text" className="w-full border border-slate-300 rounded-lg p-2.5 text-sm outline-none focus:border-blue-500 bg-slate-50" />
                  </div>
                </div>
              </div>

              {/* Map Mockup */}
              <div className="w-full md:w-64 h-40 bg-slate-200 rounded-lg relative overflow-hidden border border-slate-300 group cursor-pointer shadow-inner">
                {/* Simulated Map Background Pattern */}
                <div className="absolute inset-0 opacity-20" style={{ backgroundImage: 'radial-gradient(#64748b 1px, transparent 1px)', backgroundSize: '10px 10px' }}></div>
                
                {/* Pin */}
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2">
                  <div className="relative">
                    <MapPin size={32} className="text-blue-600 fill-blue-600 drop-shadow-md" />
                    <div className="absolute -top-6 left-1/2 -translate-x-1/2 bg-slate-800 text-white text-[10px] px-2 py-0.5 rounded whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity">
                      30.0, -30.0
                    </div>
                  </div>
                </div>
                
                <div className="absolute bottom-2 right-2 bg-white px-2 py-1 rounded text-[10px] font-medium shadow-sm border border-slate-200 text-slate-600">
                  Click to adjust pin
                </div>
              </div>
            </div>
          </section>

          <hr className="border-slate-100" />

          {/* Section 3: Upload Evidence */}
          <section>
            <div className="flex items-center gap-2 mb-6">
              <Camera className="text-blue-700" size={20} />
              <h2 className="text-lg font-bold text-slate-900">Upload Evidence</h2>
            </div>

            <div className="border-2 border-dashed border-slate-300 rounded-xl bg-white py-12 flex flex-col items-center justify-center text-center hover:bg-slate-50 hover:border-blue-400 transition-all cursor-pointer group">
              <div className="w-12 h-12 bg-blue-50 rounded-full flex items-center justify-center text-blue-600 mb-3 group-hover:scale-110 transition-transform">
                <CloudUpload size={24} />
              </div>
              <p className="text-sm font-bold text-slate-900">Click to upload or drag and drop</p>
              <p className="text-xs text-slate-500 mt-1">SVG, PNG, JPG or GIF (max. 5MB)</p>
              <button className="mt-4 text-sm font-bold text-blue-700 hover:underline">
                Browse files
              </button>
            </div>
          </section>

        </div>

        {/* --- Footer Actions --- */}
        <div className="flex flex-col md:flex-row justify-between items-center mt-8 gap-4">
          <div className="flex items-center gap-2 text-xs text-slate-500">
            <Lock size={14} />
            <span>Your data is securely processed.</span>
          </div>

          <div className="flex items-center gap-4 w-full md:w-auto">
            <button className="flex-1 md:flex-none px-6 py-2.5 border border-slate-300 rounded-lg text-sm font-bold text-slate-700 hover:bg-slate-50 transition-colors bg-white">
              Cancel
            </button>
            <button className="flex-1 md:flex-none px-6 py-2.5 bg-blue-700 text-white rounded-lg text-sm font-bold hover:bg-blue-800 transition-colors shadow-lg shadow-blue-200 flex items-center justify-center gap-2">
              Submit Grievance <ArrowRight size={16} />
            </button>
          </div>
        </div>

      </main>
    </div>
  );
};

// Helper Component for Stepper
const Step = ({ number, label, status }: { number: number, label: string, status: 'active' | 'completed' | 'pending' }) => {
  let circleClass = "bg-slate-200 text-slate-500 border-slate-200";
  let labelClass = "text-slate-400";

  if (status === 'active') {
    circleClass = "bg-blue-700 text-white border-blue-700 ring-4 ring-blue-50";
    labelClass = "text-blue-700 font-bold";
  } else if (status === 'completed') {
    circleClass = "bg-green-600 text-white border-green-600";
    labelClass = "text-green-600 font-medium";
  }

  return (
    <div className="relative z-10 flex flex-col items-center gap-2 bg-slate-50 px-4">
      <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold border-2 transition-all ${circleClass}`}>
        {status === 'completed' ? <Check size={16} /> : number}
      </div>
      <span className={`text-xs ${labelClass}`}>{label}</span>
    </div>
  );
};

export default FileGrievance;