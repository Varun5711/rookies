'use client'
import React, { useState} from 'react';
import { 
  Landmark, 
  HelpCircle, 
  User, 
  ShieldCheck, 
  Briefcase, 
  Lock, 
  Flag 
} from 'lucide-react';

const LoginPage: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'citizen' | 'admin' | 'provider'>('citizen');
  const [mobileNumber, setMobileNumber] = useState('');

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    console.log(`Logging in as ${activeTab} with number: ${mobileNumber}`);
  };

  return (
    <div className="min-h-screen bg-slate-50 font-sans text-slate-900 flex flex-col">
      
      {/* --- Minimal Header --- */}
      <header className="bg-white border-b border-slate-200 sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            {/* Logo Section */}
            <div className="flex items-center gap-3">
              <div className="p-2 bg-blue-50 rounded-lg text-blue-700">
                <Landmark size={24} strokeWidth={2} />
              </div>
              <div className="flex flex-col">
                <span className="font-bold text-base leading-tight text-slate-900">National Service Portal</span>
                <span className="text-[10px] uppercase tracking-wider text-slate-500 font-semibold">Government of India</span>
              </div>
            </div>

            {/* Help Button */}
            <button className="flex items-center gap-2 px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg text-sm font-semibold transition-colors">
              <HelpCircle size={18} />
              Help & Support
            </button>
          </div>
        </div>
      </header>

      {/* --- Main Content Area --- */}
      <main className="flex-1 flex items-center justify-center p-4 sm:p-6">
        <div className="w-full max-w-[480px]">
          
          {/* Login Card */}
          <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
            
            {/* Role Tabs */}
            <div className="grid grid-cols-3 border-b border-slate-100">
              <button 
                onClick={() => setActiveTab('citizen')}
                className={`flex flex-col items-center justify-center gap-2 py-4 text-sm font-medium transition-all ${
                  activeTab === 'citizen' 
                    ? 'text-blue-700 border-b-2 border-blue-700 bg-blue-50/50' 
                    : 'text-slate-500 hover:bg-slate-50 hover:text-slate-700'
                }`}
              >
                <User size={20} />
                Citizen
              </button>
              <button 
                onClick={() => setActiveTab('admin')}
                className={`flex flex-col items-center justify-center gap-2 py-4 text-sm font-medium transition-all ${
                  activeTab === 'admin' 
                    ? 'text-blue-700 border-b-2 border-blue-700 bg-blue-50/50' 
                    : 'text-slate-500 hover:bg-slate-50 hover:text-slate-700'
                }`}
              >
                <ShieldCheck size={20} />
                Admin
              </button>
              <button 
                onClick={() => setActiveTab('provider')}
                className={`flex flex-col items-center justify-center gap-2 py-4 text-sm font-medium transition-all ${
                  activeTab === 'provider' 
                    ? 'text-blue-700 border-b-2 border-blue-700 bg-blue-50/50' 
                    : 'text-slate-500 hover:bg-slate-50 hover:text-slate-700'
                }`}
              >
                <Briefcase size={20} />
                Provider
              </button>
            </div>

            {/* Form Section */}
            <div className="p-8">
              <div className="text-center mb-8">
                <h1 className="text-2xl font-bold text-slate-900 mb-2">Sign in to your account</h1>
                <p className="text-slate-500 text-sm">Access government services, manage applications, and more.</p>
              </div>

              <form onSubmit={handleLogin} className="space-y-6">
                <div>
                  <label htmlFor="mobile" className="block text-sm font-medium text-slate-700 mb-2">
                    Mobile Number
                  </label>
                  <div className="relative flex rounded-lg shadow-sm border border-slate-300 overflow-hidden focus-within:ring-2 focus-within:ring-blue-500 focus-within:border-blue-500 transition-all">
                    <div className="px-4 py-3 bg-slate-50 border-r border-slate-300 text-slate-500 text-sm font-medium flex items-center">
                      +91
                    </div>
                    <input
                      type="tel"
                      id="mobile"
                      className="block w-full px-4 py-3 outline-none text-slate-900 placeholder-slate-400"
                      placeholder="Enter mobile number"
                      value={mobileNumber}
                      onChange={(e) => setMobileNumber(e.target.value)}
                    />
                  </div>
                </div>

                <button 
                  type="submit" 
                  className="w-full bg-blue-700 hover:bg-blue-800 text-white font-semibold py-3 px-4 rounded-lg shadow-sm transition-colors focus:ring-4 focus:ring-blue-200"
                >
                  Send One-Time Password
                </button>
              </form>

              {/* Divider */}
              <div className="relative my-6">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-slate-200"></div>
                </div>
                <div className="relative flex justify-center text-xs uppercase">
                  <span className="bg-white px-3 text-slate-500 font-medium">Or sign in with</span>
                </div>
              </div>

              {/* Google Button */}
              <button className="w-full flex items-center justify-center gap-3 bg-white border border-slate-300 hover:bg-slate-50 text-slate-700 font-semibold py-3 px-4 rounded-lg transition-colors">
                {/* Simple SVG for Google Logo */}
                <svg className="w-5 h-5" viewBox="0 0 24 24">
                  <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4" />
                  <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853" />
                  <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05" />
                  <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335" />
                </svg>
                Continue with Google
              </button>
            </div>

            {/* Secure Footer on Card */}
            <div className="bg-blue-50/50 border-t border-blue-100 p-4 flex items-center justify-center gap-2 text-xs text-blue-700 font-medium">
              <Lock size={14} />
              This is a secure government service. Your information is protected.
            </div>
          </div>

          {/* Bottom Links */}
          <div className="mt-8 flex flex-col items-center space-y-4">
            <div className="flex flex-wrap justify-center gap-6 text-sm text-slate-500">
              <a href="#" className="hover:text-blue-700 transition-colors">Privacy Policy</a>
              <a href="#" className="hover:text-blue-700 transition-colors">Terms of Service</a>
              <a href="#" className="hover:text-blue-700 transition-colors">Grievance Redressal</a>
            </div>
            
            <div className="flex items-center gap-2 text-xs text-slate-400">
              <Flag size={12} fill="currentColor" className="text-slate-300" />
              <span>© {new Date().getFullYear()} National Service Portal. All rights reserved.</span>
            </div>
          </div>

        </div>
      </main>
    </div>
  );
};

export default LoginPage;