"use client";
import React from 'react';
import { 
  ArrowLeft,
  Link as LinkIcon, // Renamed to avoid conflict with Next.js Link
  Webhook,
  HelpCircle,
  Eye,
  PenTool,
  ShieldCheck,
  CreditCard,
  UploadCloud,
  CheckCircle2,
  Sliders,
  Landmark,
  Bell,
  ChevronRight,
  ArrowRight
} from 'lucide-react';
import { useRouter } from 'next/navigation';

const ServiceConfiguration: React.FC = () => {
  const router = useRouter();

  return (
    <div className="min-h-screen bg-slate-50 font-sans text-slate-900 pb-20">
      
      {/* --- Header (from NewService/page.tsx) --- */}
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

        <h1 className="text-3xl font-bold text-slate-900 mb-2">Service Configuration</h1>
        <p className="text-slate-500 max-w-2xl">
          Define the endpoints and security parameters for your National Digital Platform integration.
        </p>
      </div>

      {/* --- Main Content --- */}
      <main className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6">
        
        {/* Progress Stepper Card */}
        <div className="bg-white rounded-xl border border-slate-200 p-6 shadow-sm">
          <div className="flex justify-between items-end mb-2">
            <span className="text-xs font-bold text-blue-700 uppercase tracking-wider">Step 2 of 3</span>
            <span className="text-xs text-slate-500">Next: Review</span>
          </div>
          
          <div className="grid grid-cols-3 gap-2 mb-2">
            <div className="h-1.5 bg-blue-700 rounded-full"></div>
            <div className="h-1.5 bg-blue-700 rounded-full"></div>
            <div className="h-1.5 bg-slate-100 rounded-full"></div>
          </div>

          <div className="grid grid-cols-3 gap-2 text-[10px] font-medium text-slate-400">
            <span>Basic Info</span>
            <span className="text-slate-900 font-bold">Configuration</span>
            <span>Review</span>
          </div>
        </div>

        {/* Form Card */}
        <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-8">
            <div className="space-y-8">
            
            {/* Input: Service Endpoint */}
            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-2">
                Service Endpoint URL
              </label>
              <div className="relative group">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
                  <LinkIcon size={16} />
                </div>
                <input 
                  type="text" 
                  className="w-full border border-slate-300 rounded-lg pl-10 pr-10 py-2.5 text-sm text-slate-900 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all"
                  defaultValue="https://api.transport.gov.in/v1/vehicles"
                />
                <div className="absolute inset-y-0 right-0 pr-3 flex items-center text-green-500">
                  <CheckCircle2 size={18} />
                </div>
              </div>
            </div>

            {/* Input: Webhook URL */}
            <div>
              <div className="flex justify-between mb-2">
                <label className="block text-sm font-semibold text-slate-700">
                  Webhook URL <span className="text-slate-400 font-normal">(Optional)</span>
                </label>
                <HelpCircle size={14} className="text-slate-400 cursor-help" />
              </div>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
                  <Webhook size={16} />
                </div>
                <input 
                  type="text" 
                  className="w-full border border-slate-300 rounded-lg pl-10 pr-4 py-2.5 text-sm text-slate-900 placeholder:text-slate-400 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all"
                  placeholder="https://your-domain.com/callback"
                />
              </div>
              <p className="text-xs text-slate-500 mt-2">Used for asynchronous status updates from NDP core services.</p>
            </div>

            {/* Card Selection: Scopes */}
            <div>
              <div className="flex justify-between items-center mb-4">
                <label className="text-sm font-semibold text-slate-700">Authentication Scopes</label>
                <span className="bg-slate-100 text-slate-500 text-[10px] px-2 py-0.5 rounded font-bold uppercase">Required</span>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* Active Card */}
                <div className="border-2 border-blue-500 bg-blue-50/30 rounded-xl p-4 cursor-pointer relative shadow-sm">
                  <div className="absolute top-4 right-4 text-blue-600">
                    <CheckCircle2 size={18} />
                  </div>
                  <div className="mb-3 text-blue-700">
                    <Eye size={20} />
                  </div>
                  <h4 className="font-bold text-slate-900 text-sm">Read User Data</h4>
                </div>

                {/* Inactive Card */}
                <div className="border border-slate-200 bg-white rounded-xl p-4 cursor-pointer hover:border-blue-300 transition-colors">
                  <div className="mb-3 text-slate-500">
                    <PenTool size={20} />
                  </div>
                  <h4 className="font-bold text-slate-700 text-sm">Write Transactions</h4>
                </div>

                {/* Inactive Card */}
                <div className="border border-slate-200 bg-white rounded-xl p-4 cursor-pointer hover:border-blue-300 transition-colors">
                  <div className="mb-3 text-slate-500">
                    <ShieldCheck size={20} />
                  </div>
                  <h4 className="font-bold text-slate-700 text-sm">Audit Logs</h4>
                </div>

                {/* Inactive Card */}
                <div className="border border-slate-200 bg-white rounded-xl p-4 cursor-pointer hover:border-blue-300 transition-colors">
                  <div className="mb-3 text-slate-500">
                    <CreditCard size={20} />
                  </div>
                  <h4 className="font-bold text-slate-700 text-sm">Payment Gateway</h4>
                </div>
              </div>
            </div>

            {/* File Upload: API Docs */}
            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-2">
                API Documentation
              </label>
              <div className="border-2 border-dashed border-slate-200 rounded-xl bg-slate-50/50 py-8 flex flex-col items-center justify-center text-center cursor-pointer hover:bg-blue-50 hover:border-blue-400 transition-colors">
                <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center text-blue-600 mb-3">
                  <UploadCloud size={20} />
                </div>
                <p className="text-sm font-medium text-blue-700">Upload OpenAPI Specification</p>
              </div>
            </div>

          </div>
        </div>

        {/* --- Footer Actions --- */}
        <div className="flex justify-between items-center pt-4">
            <button onClick={() => router.push('/ServiceRegistry/NewService'  )} className="px-6 py-3 border border-slate-300 rounded-lg text-sm font-semibold text-slate-700 hover:bg-slate-50 transition-colors bg-white">
                Back
            </button>
            <button onClick={() => router.push('/ServiceRegistry/NewService/Step2/Step3')} className="px-8 py-3 bg-blue-700 text-white rounded-lg text-sm font-bold hover:bg-blue-800 transition-colors shadow-lg shadow-blue-200 flex items-center gap-2">
                Next Step <ArrowRight size={16} />
            </button>
        </div>

      </main>
    </div>
  );
};

export default ServiceConfiguration;
