"use client"
import React, { useRef, useState } from 'react';
import { useRouter } from 'next/navigation';
import { 
  Bell, 
  Globe, 
  ChevronDown, 
  Search, 
  ShieldCheck, 
  Clock, 
  Download, 
  RotateCcw, 
  ArrowRight, 
  BriefcaseMedical, 
  Tractor, 
  Building2, 
  Bookmark, 
  Megaphone, 
  Banknote, 
  Headphones, 
  Landmark,
  User,
  LogOut,
  Settings
} from 'lucide-react';

const initialServices = [
  {
    id: 1,
    category: 'Health',
    title: 'Healthcare Services',
    description: 'Book OPD appointments, access digital health records (ABHA), and enroll in national insurance schemes securely.',
    icon: <BriefcaseMedical size={24} />,
    bookmarked: false,
  },
  {
    id: 2,
    category: 'Farming',
    title: 'Agriculture Support',
    description: 'Apply for PM-KISAN subsidies, check real-time market prices (Mandi), and request Soil Health Cards.',
    icon: <Tractor size={24} />,
    bookmarked: true,
  },
  {
    id: 3,
    category: 'Civic',
    title: 'Urban Grievance Redressal',
    description: 'File complaints regarding water, roads, or sanitation, track resolution status, and provide feedback.',
    icon: <Building2 size={24} />,
    bookmarked: false,
  },
];

const notifications = [
  {
    id: 1,
    title: 'New Vaccination Drive Announced',
    time: '2 hours ago',
    icon: <Megaphone size={18} />,
  },
  {
    id: 2,
    title: 'Tax Filing Deadline Extended',
    time: '1 day ago',
    icon: <Banknote size={18} />,
  },
];

const CitizenDashboard: React.FC = () => {
  const serviceCategoriesRef = useRef<HTMLDivElement>(null);
  const [services, setServices] = useState(initialServices);
  const [isProfileOpen, setProfileOpen] = useState(false);
  const [isNotificationsOpen, setNotificationsOpen] = useState(false);
  const router = useRouter();
  const toggleBookmark = (id: number) => {
    setServices(
      services.map((service) =>
        service.id === id ? { ...service, bookmarked: !service.bookmarked } : service
      )
    );
  };



  const scrollToServiceCategories = () => {
    if (serviceCategoriesRef.current) {
      serviceCategoriesRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  };
  return (
    <div className="min-h-screen bg-slate-50 font-sans text-slate-900">
      
      {/* --- Top Navigation --- */}
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

            {/* Nav Links (Desktop) */}
            <nav className="hidden md:flex items-center gap-8 text-sm font-medium text-slate-600">
              <a href="/citizen-dashboard" className="text-blue-700 font-semibold">Dashboard</a>
              <a href="#service-categories" onClick={scrollToServiceCategories} className="hover:text-blue-700 transition-colors">Services</a>
              <a href="#" className="hover:text-blue-700 transition-colors">Support</a>
            </nav>

            {/* Right Actions */}
            <div className="flex items-center gap-4">
            <div className="relative">
                <button onClick={() => setNotificationsOpen(!isNotificationsOpen)} className="relative text-slate-500 hover:text-blue-700 transition-colors">
                  <Bell size={20} />
                  <span className="absolute top-0 right-0 h-2 w-2 bg-red-500 rounded-full border border-white"></span>
                </button>
                {isNotificationsOpen && (
                  <div className="absolute right-0 mt-2 w-72 bg-white rounded-lg shadow-lg border border-slate-200">
                    <div className="p-4 border-b border-slate-100">
                      <h4 className="font-bold text-slate-900">Notifications</h4>
                    </div>
                    <div className="py-2">
                      {notifications.map((notification) => (
                        <div key={notification.id} className="flex items-start gap-3 px-4 py-3 hover:bg-slate-50">
                          <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center flex-shrink-0 text-blue-600">
                            {notification.icon}
                          </div>
                          <div>
                            <p className="text-sm font-medium text-slate-800">{notification.title}</p>
                            <p className="text-xs text-slate-500 mt-0.5">{notification.time}</p>
                          </div>
                        </div>
                      ))}
                    </div>
                    <a href="#" className="block bg-slate-50 text-center text-xs font-bold text-blue-700 py-2 hover:underline">
                      View all notifications
                    </a>
                  </div>
                )}
              </div>
              <button className="text-slate-500 hover:text-blue-700 transition-colors">
                <Globe size={20} />
              </button>
              
              {/* User Dropdown */}
              <div className="relative">
                <div onClick={() => setProfileOpen(!isProfileOpen)} className="flex items-center gap-2 pl-4 border-l border-slate-200 cursor-pointer">
                  <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center text-blue-700 font-bold text-xs">
                    PS
                  </div>
                  <div className="hidden sm:flex items-center gap-1">
                    <span className="text-sm font-medium">Priya Sharma</span>
                    <ChevronDown size={14} className={`text-slate-400 transition-transform ${isProfileOpen ? 'rotate-180' : ''}`} />
                  </div>
                </div>
                {isProfileOpen && (
                  <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg border border-slate-200 overflow-hidden">
                    <a href="#" className="flex items-center gap-3 px-4 py-2 text-sm text-slate-700 hover:bg-slate-50">
                      <User size={16} /> My Profile
                    </a>
                    <a href="#" className="flex items-center gap-3 px-4 py-2 text-sm text-slate-700 hover:bg-slate-50">
                      <Settings size={16} /> Settings
                    </a>
                    <a href="#" className="flex items-center gap-3 px-4 py-2 text-red-600 hover:bg-red-50 border-t border-slate-100">
                      <LogOut size={16} /> Logout
                    </a>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
        
        {/* --- Welcome Section --- */}
        <section className="flex flex-col md:flex-row justify-between md:items-end gap-4">
          <div>
            <h1 className="text-3xl font-bold text-slate-900 mb-2">Welcome, Priya Sharma</h1>
            <p className="text-slate-500 max-w-xl">
              Access your government services, track application status, and manage your certificates securely in one place.
            </p>
          </div>
          <div className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-green-50 border border-green-100 text-green-700 rounded-full text-xs font-semibold self-start md:self-auto">
            <ShieldCheck size={14} />
            Identity Verified
          </div>
        </section>

        {/* --- Stats Cards --- */}
        <section className="grid grid-cols-1 md:grid-cols-3 gap-6">
          
          {/* Card 1: Pending */}
          <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm relative overflow-hidden group hover:shadow-md transition-all">
            <div className="absolute -right-4 -top-4 w-24 h-24 bg-orange-50 rounded-full group-hover:scale-110 transition-transform"></div>
            <div className="relative z-10">
              <p className="text-sm font-medium text-slate-500 mb-1">Pending Applications</p>
              <h3 className="text-3xl font-bold text-slate-900 mb-4">2</h3>
              <a href="#" className="inline-flex items-center text-xs font-semibold text-orange-600 hover:text-orange-700">
                View details <ArrowRight size={12} className="ml-1" />
              </a>
            </div>
          </div>

          {/* Card 2: Approved */}
          <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm relative overflow-hidden group hover:shadow-md transition-all">
            <div className="absolute -right-4 -top-4 w-24 h-24 bg-green-50 rounded-full group-hover:scale-110 transition-transform"></div>
            <div className="relative z-10">
              <p className="text-sm font-medium text-slate-500 mb-1">Approved Certificates</p>
              <h3 className="text-3xl font-bold text-slate-900 mb-4">5</h3>
              <a href="#" className="inline-flex items-center text-xs font-semibold text-green-600 hover:text-green-700">
                Download now <Download size={12} className="ml-1" />
              </a>
            </div>
          </div>

          {/* Card 3: Grievances */}
          <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm relative overflow-hidden group hover:shadow-md transition-all">
            <div className="absolute -right-4 -top-4 w-24 h-24 bg-blue-50 rounded-full group-hover:scale-110 transition-transform"></div>
            <div className="relative z-10">
              <p className="text-sm font-medium text-slate-500 mb-1">Grievances Resolved</p>
              <h3 className="text-3xl font-bold text-slate-900 mb-4">12</h3>
              <a href="#" className="inline-flex items-center text-xs font-semibold text-blue-600 hover:text-blue-700">
                History <RotateCcw size={12} className="ml-1" />
              </a>
            </div>
          </div>
        </section>

        {/* --- Service Categories --- */}
        <section id="service-categories" ref={serviceCategoriesRef}>
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-xl font-bold text-slate-900">Service Categories</h2>
            <a href="#" className="text-sm font-medium text-blue-700 hover:underline flex items-center gap-1">
              View all categories <ArrowRight size={16} />
            </a>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {services
              .sort((a, b) => (b.bookmarked ? 1 : -1) - (a.bookmarked ? 1 : -1))
              .map((service) => (
              <div key={service.id} className="bg-white rounded-2xl border border-slate-200 overflow-hidden flex flex-col hover:shadow-lg transition-shadow">
                <div className={`h-32 ${service.bookmarked ? 'bg-amber-50' : 'bg-blue-50'} flex items-center justify-center`}>
                  <div className={`w-12 h-12 ${service.bookmarked ? 'bg-amber-500' : 'bg-blue-600'} rounded-lg flex items-center justify-center text-white shadow-lg ${service.bookmarked ? 'shadow-amber-200' : 'shadow-blue-200'}`}>
                    {service.icon}
                  </div>
                </div>
                <div className="p-6 flex-1 flex flex-col">
                  <span className={`inline-block px-2 py-0.5 rounded text-[10px] font-bold uppercase ${service.bookmarked ? 'bg-amber-100 text-amber-700' : 'bg-blue-100 text-blue-700'} w-fit mb-3`}>{service.category}</span>
                  <h3 className="text-lg font-bold text-slate-900 mb-2">{service.title}</h3>
                  <p className="text-sm text-slate-500 mb-6 flex-1">
                    {service.description}
                  </p>
                  <div className="flex items-center gap-3 mt-auto">
                    <button onClick={() => router.push('/healthcare')} className="flex-1 bg-blue-700 text-white py-2.5 rounded-lg text-sm font-semibold hover:bg-blue-800 transition-colors">
                      View Services
                    </button>
                    <button onClick={() => toggleBookmark(service.id)} className={`p-2.5 rounded-lg transition-colors ${service.bookmarked ? 'text-amber-500 bg-amber-100' : 'text-slate-400 hover:text-blue-700 hover:bg-blue-50'}`}>
                      <Bookmark size={20} fill={service.bookmarked ? 'currentColor' : 'none'} />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* --- Bottom Split Section --- */}
        <section className="grid grid-cols-1 lg:grid-cols-3 gap-6 pb-8">
          
          {/* Recent Updates (2/3 width) */}
          <div className="lg:col-span-2 bg-white rounded-2xl border border-slate-200 p-6">
            <div className="flex justify-between items-center mb-6">
              <h3 className="font-bold text-slate-900">Recent Updates</h3>
              <a href="#" className="text-xs font-semibold text-blue-700 hover:underline">View All</a>
            </div>

            <div className="space-y-6">
              {/* Update Item 1 */}
              <div className="flex gap-4">
                <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center flex-shrink-0 text-blue-600">
                  <Megaphone size={18} />
                </div>
                <div>
                  <h4 className="text-sm font-bold text-slate-900">New Vaccination Drive Announced</h4>
                  <p className="text-xs text-slate-500 mt-0.5">Ministry of Health • 2 hours ago</p>
                </div>
              </div>
              
              {/* Divider */}
              <div className="border-t border-slate-100"></div>

              {/* Update Item 2 */}
              <div className="flex gap-4">
                <div className="w-10 h-10 rounded-full bg-green-100 flex items-center justify-center flex-shrink-0 text-green-600">
                  <Banknote size={18} />
                </div>
                <div>
                  <h4 className="text-sm font-bold text-slate-900">Tax Filing Deadline Extended</h4>
                  <p className="text-xs text-slate-500 mt-0.5">Finance Dept • 1 day ago</p>
                </div>
              </div>
            </div>
          </div>

          {/* Need Assistance (1/3 width) */}
          <div className="bg-slate-100 rounded-2xl p-6 flex flex-col items-center text-center justify-center">
            <div className="w-12 h-12 bg-blue-200 rounded-full flex items-center justify-center text-blue-700 mb-4">
              <Headphones size={24} />
            </div>
            <h3 className="font-bold text-slate-900 mb-2">Need Assistance?</h3>
            <p className="text-xs text-slate-500 mb-6">
              Our helpline is available 24/7 to assist you with any service related queries.
            </p>
            <button className="w-full bg-white border border-slate-200 text-slate-900 font-bold py-3 rounded-lg hover:bg-slate-50 transition-colors shadow-sm">
              Call 1800-123-4567
            </button>
          </div>
        </section>

      </main>

      {/* --- Footer --- */}
      <footer className="bg-white border-t border-slate-200 py-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div className="col-span-1 md:col-span-1">
              <div className="flex items-center gap-2 mb-4">
                 <Landmark size={24} className="text-slate-400" />
                 <span className="font-bold text-slate-900">NSP</span>
              </div>
              <p className="text-xs text-slate-500 leading-relaxed">
                BharatSetu is the official digital platform for citizen services, ensuring transparency and efficiency in governance.
              </p>
            </div>
            
            <div className="flex flex-col gap-2">
              <h5 className="font-bold text-sm text-slate-900 mb-2">Quick Links</h5>
              <a href="#" className="text-xs text-slate-500 hover:text-blue-700">About Us</a>
              <a href="#" className="text-xs text-slate-500 hover:text-blue-700">Contact</a>
              <a href="#" className="text-xs text-slate-500 hover:text-blue-700">Sitemap</a>
            </div>

            <div className="flex flex-col gap-2">
              <h5 className="font-bold text-sm text-slate-900 mb-2">Legal</h5>
              <a href="#" className="text-xs text-slate-500 hover:text-blue-700">Privacy Policy</a>
              <a href="#" className="text-xs text-slate-500 hover:text-blue-700">Terms of Service</a>
              <a href="#" className="text-xs text-slate-500 hover:text-blue-700">Disclaimer</a>
            </div>

            <div>
              <h5 className="font-bold text-sm text-slate-900 mb-4">Connect</h5>
              <div className="flex gap-3">
                <div className="w-8 h-8 rounded-full bg-slate-100 hover:bg-blue-100 transition-colors"></div>
                <div className="w-8 h-8 rounded-full bg-slate-100 hover:bg-blue-100 transition-colors"></div>
                <div className="w-8 h-8 rounded-full bg-slate-100 hover:bg-blue-100 transition-colors"></div>
              </div>
            </div>
          </div>

          <div className="border-t border-slate-100 mt-8 pt-8 flex flex-col md:flex-row justify-between items-center gap-4 text-[10px] text-slate-400">
            <p>© 2023 BharatSetu. All rights reserved.</p>
            <p>Last Updated: Oct 26, 2023</p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default CitizenDashboard;