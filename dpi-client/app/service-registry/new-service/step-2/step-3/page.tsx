"use client"
import {
  ArrowLeft,
  Info,
  Server,
  Shield,
  Edit2,
  Rocket,
  Save,
  Eye,
  Lock,
  Plane,
  Bell,
  Landmark,
  CheckCircle2,
  ExternalLink
} from 'lucide-react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import { NotificationDropdown } from '../../../../lib/NotificationDropdown';
import { SettingsDropdown } from '../../../../lib/SettingsDropdown';
import ModiImage from '@/app/modi.png';
const ReviewService: React.FC = () => {
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
              <span className="font-bold text-lg tracking-tight">BharatSetu</span>
            </div>
            
            <div className="flex items-center gap-4">
              <NotificationDropdown />
              <SettingsDropdown />
              <div className="flex items-center gap-3 pl-4 border-l border-slate-200">
                <div className="text-right hidden sm:block">
                  <p className="text-sm font-bold text-slate-900">Setu User</p>
                  <p className="text-xs text-slate-500">Admin</p>
                </div>
                <div className="w-9 h-9 rounded-full bg-slate-200 overflow-hidden border border-slate-300">
                   <Image 
                     src={ModiImage} 
                     alt="Profile" 
                     className="w-full h-full object-cover"
                   />
                </div>
              </div>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        
        {/* --- Top Navigation & Title --- */}
        <div className="mb-8">
          <button onClick={() => {router.push('/service-registry/new-service/step-2')}} className="flex items-center gap-2 text-sm text-slate-500 hover:text-blue-700 mb-4 transition-colors">
            <ArrowLeft size={16} />
            Back to Step 2
          </button>
          
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
            <div>
              <h1 className="text-3xl font-bold text-slate-900 mb-2">Review New Service Details</h1>
              <p className="text-slate-500">Please verify all configurations before publishing to the live registry.</p>
            </div>
            
            <div className="flex flex-col items-end gap-2">
              <div className="text-sm font-medium text-blue-700">Step 3 of 3 <span className="text-slate-400 mx-2">|</span> Review & Launch</div>
              <div className="w-48 h-1.5 bg-slate-200 rounded-full overflow-hidden">
                <div className="h-full bg-blue-600 w-full rounded-full"></div>
              </div>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          
          {/* --- Left Column: Details --- */}
          <div className="lg:col-span-2 space-y-6">
            
            {/* Card 1: Basic Information */}
            <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
              <div className="p-6 border-b border-slate-100 flex justify-between items-center bg-slate-50/50">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center text-blue-600">
                    <Info size={16} />
                  </div>
                  <h3 className="font-bold text-slate-900">Basic Information</h3>
                </div>
                <button className="text-sm font-medium text-blue-700 hover:underline flex items-center gap-1">
                  Edit <Edit2 size={12} />
                </button>
              </div>
              
              <div className="p-6 grid grid-cols-1 md:grid-cols-2 gap-y-6 gap-x-8">
                <div>
                  <label className="text-xs font-semibold text-slate-500 uppercase tracking-wider block mb-1">Service Name</label>
                  <p className="font-medium text-slate-900">Passport Renewal</p>
                </div>
                <div>
                  <label className="text-xs font-semibold text-slate-500 uppercase tracking-wider block mb-1">Department</label>
                  <p className="font-medium text-slate-900">Ministry of Foreign Affairs</p>
                </div>
                <div className="md:col-span-2">
                  <label className="text-xs font-semibold text-slate-500 uppercase tracking-wider block mb-1">Description</label>
                  <p className="text-sm text-slate-600 leading-relaxed">
                    Allows citizens to apply for passport renewal online, track application status, and schedule biometric appointments at regional offices.
                  </p>
                </div>
                <div>
                  <label className="text-xs font-semibold text-slate-500 uppercase tracking-wider block mb-2">Category</label>
                  <span className="inline-flex px-3 py-1 rounded-full bg-slate-100 text-slate-700 text-xs font-semibold border border-slate-200">
                    Citizen Services
                  </span>
                </div>
                <div>
                  <label className="text-xs font-semibold text-slate-500 uppercase tracking-wider block mb-2">SLA Level</label>
                  <span className="inline-flex px-3 py-1 rounded-full bg-amber-50 text-amber-700 text-xs font-semibold border border-amber-100">
                    Gold (99.9% Uptime)
                  </span>
                </div>
              </div>
            </div>

            {/* Card 2: Technical Configuration */}
            <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
              <div className="p-6 border-b border-slate-100 flex justify-between items-center bg-slate-50/50">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-full bg-purple-100 flex items-center justify-center text-purple-600">
                    <Server size={16} />
                  </div>
                  <h3 className="font-bold text-slate-900">Technical Configuration</h3>
                </div>
                <button className="text-sm font-medium text-blue-700 hover:underline flex items-center gap-1">
                  Edit <Edit2 size={12} />
                </button>
              </div>
              
              <div className="p-6 space-y-6">
                <div>
                  <label className="text-xs font-semibold text-slate-500 uppercase tracking-wider block mb-2">Base Endpoint URL</label>
                  <div className="bg-slate-50 border border-slate-200 rounded-lg p-3 font-mono text-sm text-slate-700 overflow-x-auto">
                    https://api.gov.portal/v1/passport
                  </div>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="text-xs font-semibold text-slate-500 uppercase tracking-wider block mb-1">Health Check Path</label>
                    <p className="font-mono text-sm text-slate-700">/healthz</p>
                  </div>
                  <div>
                    <label className="text-xs font-semibold text-slate-500 uppercase tracking-wider block mb-1">Timeout Policy</label>
                    <p className="font-medium text-slate-900">5000ms (Hard limit)</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Card 3: Security & Compliance */}
            <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
              <div className="p-6 border-b border-slate-100 flex justify-between items-center bg-slate-50/50">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-full bg-green-100 flex items-center justify-center text-green-600">
                    <Shield size={16} />
                  </div>
                  <h3 className="font-bold text-slate-900">Security & Compliance</h3>
                </div>
                <button className="text-sm font-medium text-blue-700 hover:underline flex items-center gap-1">
                  Edit <Edit2 size={12} />
                </button>
              </div>
              
              <div className="p-6 grid grid-cols-1 md:grid-cols-2 gap-y-6 gap-x-8">
                <div>
                  <label className="text-xs font-semibold text-slate-500 uppercase tracking-wider block mb-2">Authentication Method</label>
                  <div className="flex items-center gap-2 text-sm font-medium text-slate-900">
                    <Lock size={14} className="text-green-600" />
                    OAuth 2.0 (OIDC)
                  </div>
                </div>
                <div>
                  <label className="text-xs font-semibold text-slate-500 uppercase tracking-wider block mb-2">Data Classification</label>
                  <span className="inline-flex px-3 py-1 rounded-full bg-red-50 text-red-700 text-xs font-semibold border border-red-100">
                    PII / High Sensitivity
                  </span>
                </div>
                <div className="md:col-span-2">
                  <label className="text-xs font-semibold text-slate-500 uppercase tracking-wider block mb-2">Required Scopes</label>
                  <div className="flex flex-wrap gap-2">
                    {['citizen.read', 'documents.write', 'identity.verify'].map((scope) => (
                      <span key={scope} className="px-2 py-1 bg-slate-100 border border-slate-200 rounded text-xs font-mono text-slate-600">
                        {scope}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            </div>

          </div>

          {/* --- Right Column: Sidebar --- */}
          <div className="space-y-6">
            
            {/* Live Preview Widget */}
            <div>
              <div className="flex items-center gap-2 text-xs font-bold text-slate-500 uppercase tracking-wider mb-3">
                <Eye size={14} /> Live Preview
              </div>
              
              <div className="bg-slate-100 rounded-xl p-4 border border-slate-200/60 dashed-border">
                {/* The Card Preview */}
                <div className="bg-white rounded-lg shadow-sm border border-slate-200 overflow-hidden max-w-sm mx-auto">
                  <div className="h-24 bg-gradient-to-r from-slate-800 to-slate-900 relative flex items-center justify-center">
                     <div className="absolute inset-0 opacity-30" style={{ backgroundImage: 'url("https://www.transparenttextures.com/patterns/stardust.png")' }}></div>
                     <Lock className="text-white/20 w-16 h-16" />
                     <div className="absolute -bottom-4 left-4 bg-white p-2 rounded-lg shadow-sm border border-slate-100">
                       <Plane className="text-blue-600" size={24} />
                     </div>
                  </div>
                  <div className="pt-6 px-4 pb-4">
                    <h4 className="font-bold text-slate-900 text-lg">Passport Renewal</h4>
                    <p className="text-xs text-slate-500 mb-3">Ministry of Foreign Affairs</p>
                    <p className="text-sm text-slate-600 mb-4 line-clamp-3">
                      Fast track your travel documents online. Apply for renewal, track status, and book appointments.
                    </p>
                    <button className="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 rounded-lg text-sm flex items-center justify-center gap-1 transition-colors">
                      Access Service <ArrowRightIcon size={14} />
                    </button>
                  </div>
                </div>
                
                <p className="text-center text-[10px] text-slate-400 mt-3 max-w-xs mx-auto">
                  This is how the service tile will appear to citizens on the main dashboard.
                </p>
              </div>
            </div>

            {/* Actions Card */}
            <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-6">
              <h3 className="font-bold text-slate-900 mb-4">Actions</h3>
              
              <div className="space-y-3">
                <button className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-4 rounded-lg shadow-md shadow-blue-200 transition-all flex items-center justify-center gap-2">
                  <Rocket size={18} />
                  Authorize & Launch
                </button>
                
                <button className="w-full bg-white border border-slate-300 hover:bg-slate-50 text-slate-700 font-semibold py-3 px-4 rounded-lg transition-colors flex items-center justify-center gap-2">
                  <Save size={18} />
                  Save as Draft
                </button>
              </div>

              <p className="text-[10px] text-slate-400 mt-4 text-center leading-relaxed">
                By clicking "Authorize & Launch", you agree to the <a href="#" className="text-blue-600 hover:underline">Platform Governance Terms</a>.
              </p>
            </div>

          </div>
        </div>
      </main>
    </div>
  );
};

// Helper for the small arrow in the preview button
const ArrowRightIcon = ({ size }: { size: number }) => (
  <svg 
    width={size} 
    height={size} 
    viewBox="0 0 24 24" 
    fill="none" 
    stroke="currentColor" 
    strokeWidth="2" 
    strokeLinecap="round" 
    strokeLinejoin="round"
  >
    <path d="M5 12h14" />
    <path d="m12 5 7 7-7 7" />
  </svg>
);

export default ReviewService;