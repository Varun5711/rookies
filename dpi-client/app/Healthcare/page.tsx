"use client"
import React, { useState } from 'react';
import { 
  Search, 
  MapPin, 
  Map, 
  Star, 
  Phone, 
  Clock, 
  Briefcase, 
  Navigation, 
  ChevronDown, 
  ChevronLeft, 
  ChevronRight,
  BadgeCheck,
  Stethoscope,
  Building2,
  Landmark,
  User
} from 'lucide-react';

// --- Types & Mock Data ---

interface Healthcare {
  id: number;
  name: string;
  type: string; // 'PUBLIC HOSPITAL' | 'EMPANELED PRIVATE' | 'PUBLIC CLINIC'
  rating: number;
  reviewCount: number;
  isOpen247: boolean;
  closingTime?: string; // e.g., "5 PM"
  address: string;
  phone: string;
  specialties: string;
  image: string;
  isVerified: boolean;
}

const hospitals: Healthcare[] = [
  {
    id: 1,
    name: "General Civil Hospital",
    type: "PUBLIC HOSPITAL",
    rating: 4.2,
    reviewCount: 120,
    isOpen247: true,
    address: "Sector 10, Mahatma Gandhi Road, Central District, New Delhi - 110001",
    phone: "+91 11-2345-6789",
    specialties: "Cardiology, Neurology, General Surgery",
    image: "https://images.unsplash.com/photo-1587351021759-3e566b9af923?auto=format&fit=crop&q=80&w=1000",
    isVerified: true
  },
  {
    id: 2,
    name: "City Care Institute",
    type: "EMPANELED PRIVATE",
    rating: 4.8,
    reviewCount: 850,
    isOpen247: true,
    address: "Plot 45, Ring Road, South Extension, New Delhi - 110049",
    phone: "+91 11-4567-8901",
    specialties: "Orthopedics, Physiotherapy, Trauma",
    image: "https://images.unsplash.com/photo-1519494026892-80bbd2d6fd0d?auto=format&fit=crop&q=80&w=1000",
    isVerified: true
  },
  {
    id: 3,
    name: "Community Health Center",
    type: "PUBLIC CLINIC",
    rating: 3.9,
    reviewCount: 45,
    isOpen247: false,
    closingTime: "5 PM",
    address: "Block C, Janakpuri District Center, West Delhi - 110058",
    phone: "+91 11-9876-5432",
    specialties: "General Medicine, Vaccination",
    image: "https://images.unsplash.com/photo-1538108149393-fbbd81895907?auto=format&fit=crop&q=80&w=1000",
    isVerified: true
  },
  {
    id: 4,
    name: "Apex Specialty Clinic",
    type: "EMPANELED PRIVATE",
    rating: 4.5,
    reviewCount: 210,
    isOpen247: true,
    address: "Sector 62, Institutional Area, Noida - 201309",
    phone: "+91 120-1122-3344",
    specialties: "Pediatrics, Gynecology",
    image: "https://images.unsplash.com/photo-1516549655169-df83a0774514?auto=format&fit=crop&q=80&w=1000",
    isVerified: true
  }
];

const Healthcare: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');

  return (
    <div className="min-h-screen bg-slate-50 font-sans text-slate-900">
      
      {/* --- Top Header --- */}
      <header className="bg-white border-b border-slate-200 sticky top-0 z-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            {/* Logo */}
            <div className="flex items-center gap-2">
              <div className="bg-blue-700 text-white p-1.5 rounded-lg">
                <Landmark size={20} />
              </div>
              <span className="font-bold text-lg tracking-tight">BharatSetu</span>
            </div>

            {/* Nav (Middle) */}
            <nav className="hidden md:flex items-center gap-6 text-sm font-medium text-slate-600">
              <a href="#" className="hover:text-blue-700">Home</a>
              <a href="#" className="text-blue-700 font-semibold">Healthcare</a>
              <a href="#" className="hover:text-blue-700">Dashboard</a>
              <a href="#" className="hover:text-blue-700">Support</a>
            </nav>

            {/* Right Actions */}
            <div className="flex items-center gap-3">
              <button className="flex items-center gap-1.5 px-3 py-1.5 bg-slate-100 rounded text-xs font-bold text-slate-600 hover:bg-slate-200">
                <GlobeIcon size={14} /> EN
              </button>
              <button className="px-4 py-1.5 bg-blue-700 text-white rounded text-sm font-bold hover:bg-blue-800">
                Login
              </button>
              <div className="w-8 h-8 rounded-full bg-orange-100 flex items-center justify-center text-orange-600 border border-orange-200">
                <User size={16} />
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* --- Breadcrumbs --- */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
        <div className="flex items-center text-xs text-slate-500 gap-2">
          <a href="#" className="hover:text-blue-700">Home</a>
          <ChevronRight size={12} />
          <a href="#" className="hover:text-blue-700">Healthcare Services</a>
          <ChevronRight size={12} />
          <span className="text-slate-800 font-medium">Find a Hospital</span>
        </div>
      </div>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-12">
        
        {/* --- Search Section Container --- */}
        <div className="bg-white rounded-2xl border border-slate-200 p-6 md:p-8 shadow-sm mb-8">
          
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 gap-4">
            <div>
              <h1 className="text-2xl md:text-3xl font-bold text-slate-900 mb-2">Find a Hospital</h1>
              <p className="text-slate-500 text-sm max-w-2xl">
                Search government and empaneled private hospitals near you for appointments, emergency care, and specialized treatments. All listed facilities are NHA verified.
              </p>
            </div>
            <button className="flex items-center gap-2 text-blue-700 font-semibold text-sm hover:underline">
              <Map size={18} />
              View on Map
            </button>
          </div>

          {/* Search Bar */}
          <div className="flex flex-col md:flex-row gap-4 mb-4">
            <div className="flex-1 relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Search className="h-5 w-5 text-slate-400" />
              </div>
              <input
                type="text"
                className="block w-full pl-10 pr-4 py-3 border border-slate-200 rounded-lg bg-slate-50 focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none text-sm"
                placeholder="Search by hospital name, city, or PIN code..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            <button className="bg-blue-700 text-white px-8 py-3 rounded-lg font-semibold text-sm hover:bg-blue-800 transition-colors">
              Search
            </button>
          </div>

          {/* Filters Row */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            {/* Filter 1 */}
            <div className="relative">
              <select className="appearance-none w-full bg-white border border-slate-200 text-slate-700 py-2.5 px-4 pr-8 rounded-lg text-sm focus:outline-none focus:border-blue-500">
                <option>Select State</option>
                <option>Delhi</option>
                <option>Maharashtra</option>
              </select>
              <ChevronDown className="absolute right-3 top-3 h-4 w-4 text-slate-400 pointer-events-none" />
            </div>
            
            {/* Filter 2 */}
            <div className="relative">
              <select className="appearance-none w-full bg-white border border-slate-200 text-slate-700 py-2.5 px-4 pr-8 rounded-lg text-sm focus:outline-none focus:border-blue-500">
                <option>Select District</option>
                <option>New Delhi</option>
                <option>South Delhi</option>
              </select>
              <ChevronDown className="absolute right-3 top-3 h-4 w-4 text-slate-400 pointer-events-none" />
            </div>

            {/* Filter 3 */}
            <div className="relative">
              <select className="appearance-none w-full bg-white border border-slate-200 text-slate-700 py-2.5 px-4 pr-8 rounded-lg text-sm focus:outline-none focus:border-blue-500">
                <option>Specialty / Dept.</option>
                <option>Cardiology</option>
                <option>Orthopedics</option>
              </select>
              <ChevronDown className="absolute right-3 top-3 h-4 w-4 text-slate-400 pointer-events-none" />
            </div>

            {/* Locate Button */}
            <button className="flex items-center justify-center gap-2 w-full bg-slate-50 border border-slate-200 text-blue-700 font-semibold py-2.5 rounded-lg text-sm hover:bg-blue-50 transition-colors">
              <Navigation size={16} className="fill-blue-700/20" />
              Locate Near Me
            </button>
          </div>
        </div>

        {/* --- Results Section --- */}
        <div className="flex justify-between items-center mb-6">
          <h2 className="font-bold text-slate-900">Showing 4 results</h2>
          <div className="flex items-center gap-2 text-sm text-slate-500">
            <span>Sort by:</span>
            <button className="flex items-center gap-1 font-semibold text-slate-900">
              Relevance <ChevronDown size={14} />
            </button>
          </div>
        </div>

        {/* --- Cards Grid --- */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
          {hospitals.map((hospital) => (
            <div key={hospital.id} className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden hover:shadow-md transition-shadow flex flex-col">
              
              {/* Image Header */}
              <div className="relative h-48 w-full">
                <img 
                  src={hospital.image} 
                  alt={hospital.name} 
                  className="w-full h-full object-cover"
                />
                
                {/* Status Badge */}
                <div className="absolute top-3 left-3 flex gap-2">
                  <span className={`px-2 py-1 text-[10px] font-bold uppercase rounded shadow-sm ${
                    hospital.isOpen247 ? 'bg-green-100 text-green-700' : 'bg-yellow-100 text-yellow-700'
                  }`}>
                    {hospital.isOpen247 ? 'Open 24/7' : `Closes ${hospital.closingTime}`}
                  </span>
                </div>

                {/* Rating Badge */}
                <div className="absolute bottom-3 left-3 bg-white/90 backdrop-blur-sm px-2 py-1 rounded text-xs font-bold text-slate-900 flex items-center gap-1 shadow-sm">
                  {hospital.rating} <Star size={10} fill="black" /> 
                  <span className="text-slate-500 font-normal">({hospital.reviewCount})</span>
                </div>
              </div>

              {/* Content */}
              <div className="p-5 flex flex-col flex-1">
                <div className="flex justify-between items-start mb-2">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-purple-700">
                    {hospital.type}
                  </span>
                  {hospital.isVerified && (
                    <BadgeCheck size={18} className="text-blue-500 fill-blue-50" />
                  )}
                </div>
                
                <h3 className="text-lg font-bold text-slate-900 mb-4 line-clamp-1">{hospital.name}</h3>
                
                <div className="space-y-3 mb-6">
                  <div className="flex items-start gap-3">
                    <MapPin size={16} className="text-slate-400 mt-0.5 flex-shrink-0" />
                    <p className="text-xs text-slate-500 leading-relaxed line-clamp-2">
                      {hospital.address}
                    </p>
                  </div>
                  <div className="flex items-center gap-3">
                    <Phone size={16} className="text-slate-400 flex-shrink-0" />
                    <p className="text-xs text-slate-500 font-medium">
                      {hospital.phone}
                    </p>
                  </div>
                  <div className="flex items-start gap-3">
                    <Briefcase size={16} className="text-slate-400 mt-0.5 flex-shrink-0" />
                    <p className="text-xs text-slate-500 line-clamp-1">
                      {hospital.specialties}
                    </p>
                  </div>
                </div>

                {/* Actions */}
                <div className="mt-auto flex gap-3">
                  <button className="flex-1 bg-blue-700 text-white py-2.5 rounded-lg text-sm font-semibold hover:bg-blue-800 transition-colors">
                    Book Appointment
                  </button>
                  <button className="px-3 py-2.5 border border-slate-200 rounded-lg text-blue-700 hover:bg-blue-50 transition-colors">
                    <Navigation size={18} className="rotate-45" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* --- Pagination --- */}
        <div className="flex justify-center items-center gap-2">
          <button className="p-2 border border-slate-200 rounded-lg text-slate-400 hover:text-slate-600 disabled:opacity-50">
            <ChevronLeft size={16} />
          </button>
          
          <button className="w-8 h-8 flex items-center justify-center rounded-lg bg-blue-700 text-white text-sm font-bold">1</button>
          <button className="w-8 h-8 flex items-center justify-center rounded-lg border border-slate-200 text-slate-600 text-sm font-medium hover:bg-slate-50">2</button>
          <button className="w-8 h-8 flex items-center justify-center rounded-lg border border-slate-200 text-slate-600 text-sm font-medium hover:bg-slate-50">3</button>
          <span className="text-slate-400 text-sm px-1">...</span>
          <button className="w-8 h-8 flex items-center justify-center rounded-lg border border-slate-200 text-slate-600 text-sm font-medium hover:bg-slate-50">12</button>

          <button className="p-2 border border-slate-200 rounded-lg text-slate-600 hover:bg-slate-50">
            <ChevronRight size={16} />
          </button>
        </div>

      </main>

      {/* --- Simple Footer --- */}
      <footer className="bg-white border-t border-slate-200 py-8 mt-auto">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="flex justify-center gap-6 mb-4 text-xs font-medium text-slate-500">
            <a href="#" className="hover:text-blue-700">About Portal</a>
            <a href="#" className="hover:text-blue-700">Privacy Policy</a>
            <a href="#" className="hover:text-blue-700">Terms of Use</a>
            <a href="#" className="hover:text-blue-700">Help Desk</a>
          </div>
          <p className="text-[10px] text-slate-400">
            © 2023 National Service Portal. All rights reserved.
          </p>
        </div>
      </footer>
    </div>
  );
};

// Helper component for the Globe Icon
const GlobeIcon = ({ size }: { size: number }) => (
  <svg 
    xmlns="http://www.w3.org/2000/svg" 
    width={size} 
    height={size} 
    viewBox="0 0 24 24" 
    fill="none" 
    stroke="currentColor" 
    strokeWidth="2" 
    strokeLinecap="round" 
    strokeLinejoin="round"
  >
    <circle cx="12" cy="12" r="10"></circle>
    <line x1="2" y1="12" x2="22" y2="12"></line>
    <path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"></path>
  </svg>
);

export default Healthcare;