"use client";
import React from 'react';
import { 
  Search, 
  PlayCircle, 
  Globe, 
  Menu, 
  Shield, 
  Users, 
  Store, 
  FileCheck, 
  Share2, 
  Mail, 
  Rss, 
  ArrowRight,
  CheckCircle2
} from 'lucide-react';
import { useRouter } from 'next/navigation';

const LandingPage: React.FC = () => {
  const router = useRouter(); 
  return (
    <div className="min-h-screen bg-slate-50 font-sans text-slate-900">
      
      {/* Top Navigation */}
      <header className="sticky top-0 z-50 bg-white border-b border-slate-200">
        {/* Tricolor Top Border (Indian Flag Theme) */}
        <div className="h-1 w-full bg-gradient-to-r from-orange-400 via-white to-green-600"></div>
        
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-20">
            {/* Logo Section */}
            <div className="flex items-center gap-3">
              <div className="text-blue-700">
                <Shield size={32} fill="currentColor" className="text-blue-700" />
              </div>
              <div className="flex flex-col">
                <span className="font-bold text-lg leading-tight text-slate-900">BharatSetu</span>
                <span className="text-[10px] uppercase tracking-wider text-slate-500 font-semibold">One Platform, Many Services</span>
              </div>
            </div>

            {/* Desktop Navigation Links */}
            <nav className="hidden md:flex items-center gap-8 text-sm font-medium text-slate-600">
            </nav>

            {/* Right Actions */}
            <div className="hidden md:flex items-center gap-4">
              <button className="flex items-center gap-2 px-4 py-2 border border-slate-200 rounded-lg text-sm font-semibold hover:bg-slate-50 transition-colors">
                <Globe size={16} />
                English
              </button>
              <button onClick={() => router.push('/login')} className="px-5 py-2 bg-blue-700 text-white rounded-lg text-sm font-semibold hover:bg-blue-800 transition-colors shadow-sm shadow-blue-200">
                Login / Register
              </button>
            </div>

            {/* Mobile Menu Button */}
            <button className="md:hidden p-2 text-slate-600">
              <Menu size={24} />
            </button>
          </div>
        </div>
      </header>

      <main>
        {/* Hero Section */}
        <section className="pt-16 pb-24 overflow-hidden">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid lg:grid-cols-2 gap-12 items-center">
              
              {/* Left Content */}
              <div className="space-y-8">
                

                {/* Heading */}
                <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight text-slate-900 leading-[1.15]">
                  Unified Portal for <br />
                  <span className="text-blue-700">Government Services</span>
                </h1>

                {/* Subtext */}
                <p className="text-lg text-slate-500 max-w-xl leading-relaxed">
                  A single window for all citizen services. Apply, track, and manage your government interactions securely and efficiently from one platform.
                </p>

{/*               
                <div className="relative max-w-md shadow-sm">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Search className="h-5 w-5 text-slate-400" />
                  </div>
                  <input
                    type="text"
                    className="block w-full pl-10 pr-24 py-4 border border-slate-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none text-sm"
                    placeholder="Search for services (e.g. Passport, Tax, Land Records)"
                  />
                  <button className="absolute right-2 top-2 bottom-2 bg-blue-700 text-white px-4 rounded-md text-sm font-medium hover:bg-blue-800 transition-colors">
                    Search
                  </button>
                </div>  */}

                {/* Buttons */}
                <div className="flex flex-wrap gap-4">
                  <button onClick={() => router.push('/login')} className="flex items-center gap-2 px-6 py-3 bg-blue-700 text-white rounded-lg font-semibold shadow-lg shadow-blue-700/20 hover:bg-blue-800 transition-all transform hover:-translate-y-0.5">
                    Get Started
                    <ArrowRight size={16} />
                  </button>
                  <button onClick={() => router.push('/about-us')} className="flex items-center gap-2 px-6 py-3 bg-white border border-slate-200 text-slate-700 rounded-lg font-semibold hover:bg-slate-50 transition-colors">
                    About Us
                  </button>
                </div>

                {/* Social Proof */}
                <div className="flex items-center gap-4 pt-4 border-t border-slate-100">
                  <div className="flex -space-x-2">
                    {[1, 2, 3].map((i) => (
                      <div key={i} className="w-8 h-8 rounded-full border-2 border-white bg-slate-200 overflow-hidden">
                         <img src={`https://i.pravatar.cc/100?img=${i + 10}`} alt="User" />
                      </div>
                    ))}
                    <div className="w-8 h-8 rounded-full border-2 border-white bg-slate-100 flex items-center justify-center text-[10px] font-bold text-slate-600">
                      +2M
                    </div>
                  </div>
                  <div className="flex flex-col text-xs">
                    <span className="font-bold text-slate-900">Trusted by Citizens</span>
                    <span className="text-slate-500">Secure & Verified Platform</span>
                  </div>
                </div>
              </div>

              {/* Right Image / Mockup */}
              <div className="relative lg:ml-10">
                {/* Decorative blobs */}
                <div className="absolute -top-10 -right-10 w-32 h-32 bg-orange-100 rounded-full blur-2xl opacity-60"></div>
                <div className="absolute top-1/2 -left-10 w-40 h-40 bg-blue-100 rounded-full blur-3xl opacity-60"></div>
                
                <div className="relative rounded-2xl overflow-hidden shadow-2xl border-4 border-white bg-white">
                  {/* Using a placeholder that resembles digital services */}
                  <img 
                    src="https://images.unsplash.com/photo-1551288049-bebda4e38f71?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80" 
                    alt="Digital Services Portal" 
                    className="w-full h-auto object-cover min-h-[500px]"
                  />
                  
                  {/* Overlay Notification Card */}
                  <div className="absolute bottom-8 left-8 right-8 bg-white/95 backdrop-blur-sm p-4 rounded-xl border border-white/20 shadow-lg max-w-sm mx-auto">
                    <div className="flex items-center gap-3 mb-2">
                      <div className="bg-green-500 p-1 rounded-full text-white">
                        <CheckCircle2 size={12} />
                      </div>
                      <span className="font-semibold text-sm text-slate-800">Application Approved</span>
                    </div>
                    <div className="h-1.5 w-full bg-slate-100 rounded-full overflow-hidden mb-2">
                      <div className="h-full bg-green-500 w-full rounded-full"></div>
                    </div>
                    <p className="text-xs text-slate-500">Your passport renewal is complete.</p>
                  </div>
                </div>
              </div>

            </div>
          </div>
        </section>

        {/* Features Section */}
        <section className="py-20 bg-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center max-w-3xl mx-auto mb-16">
              <span className="text-orange-500 font-bold tracking-widest text-xs uppercase mb-2 block">Why Choose Us</span>
              <h2 className="text-3xl font-bold text-slate-900 mb-4">Seamless Digital Governance</h2>
              <p className="text-slate-500">Experience the ease of digital governance with our key features designed for every citizen, business, and administrator.</p>
            </div>

            <div className="grid md:grid-cols-3 gap-8">
              {/* Feature 1 */}
              <div className="bg-slate-50 rounded-2xl p-8 hover:shadow-lg transition-shadow border border-slate-100">
                <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center text-blue-600 mb-6">
                  <Users size={24} />
                </div>
                <h3 className="text-xl font-bold text-slate-900 mb-3">Citizen Services</h3>
                <p className="text-sm text-slate-500 leading-relaxed mb-6">
                  Apply for birth certificates, licenses, and social security schemes seamlessly from the comfort of your home.
                </p>
                <a href="#" className="inline-flex items-center text-blue-600 font-semibold text-sm hover:gap-2 transition-all">
                  Learn more <ArrowRight size={16} className="ml-1" />
                </a>
              </div>

              {/* Feature 2 */}
              <div className="bg-slate-50 rounded-2xl p-8 hover:shadow-lg transition-shadow border border-slate-100">
                <div className="w-12 h-12 bg-orange-100 rounded-lg flex items-center justify-center text-orange-500 mb-6">
                  <Store size={24} />
                </div>
                <h3 className="text-xl font-bold text-slate-900 mb-3">Business Solutions</h3>
                <p className="text-sm text-slate-500 leading-relaxed mb-6">
                  Register businesses, file taxes, and manage compliance with ease. A dedicated corridor for entrepreneurs.
                </p>
                <a href="#" className="inline-flex items-center text-orange-500 font-semibold text-sm hover:gap-2 transition-all">
                  Learn more <ArrowRight size={16} className="ml-1" />
                </a>
              </div>

              {/* Feature 3 */}
              <div className="bg-slate-50 rounded-2xl p-8 hover:shadow-lg transition-shadow border border-slate-100">
                <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center text-green-600 mb-6">
                  <FileCheck size={24} />
                </div>
                <h3 className="text-xl font-bold text-slate-900 mb-3">Document Wallet</h3>
                <p className="text-sm text-slate-500 leading-relaxed mb-6">
                  Store and access your digitally signed government documents securely. Never lose an important paper again.
                </p>
                <a href="#" className="inline-flex items-center text-green-600 font-semibold text-sm hover:gap-2 transition-all">
                  Learn more <ArrowRight size={16} className="ml-1" />
                </a>
              </div>
            </div>
          </div>
        </section>

        {/* Blue Banner / Stats */}
        <section className="bg-blue-700 py-16">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex flex-col md:flex-row justify-between items-center gap-10">
              <div className="text-center md:text-left">
                <h2 className="text-2xl font-bold text-white mb-2">Ready to simplify your life?</h2>
                <p className="text-blue-100 text-sm">Join millions of citizens already using the portal today.</p>
              </div>

              <div className="flex gap-8 md:gap-16 divide-x divide-blue-500">
                <div className="pl-4 text-center">
                  <div className="text-3xl font-extrabold text-white">500+</div>
                  <div className="text-[10px] uppercase tracking-wider text-blue-200 font-semibold mt-1">Services</div>
                </div>
                <div className="pl-8 md:pl-16 text-center">
                  <div className="text-3xl font-extrabold text-white">28</div>
                  <div className="text-[10px] uppercase tracking-wider text-blue-200 font-semibold mt-1">States</div>
                </div>
                <div className="pl-8 md:pl-16 text-center">
                  <div className="text-3xl font-extrabold text-white">24/7</div>
                  <div className="text-[10px] uppercase tracking-wider text-blue-200 font-semibold mt-1">Support</div>
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="bg-white pt-16 border-t border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row justify-between items-start mb-12 gap-8">
            
            <div className="flex items-center gap-3">
               <div className="w-10 h-10 bg-slate-100 rounded-full flex items-center justify-center text-slate-500">
                 <Shield size={20} fill="currentColor" />
               </div>
               <div>
                 <h4 className="font-bold text-slate-900">BharatSetu</h4>
                 <p className="text-xs text-slate-500">Government of India</p>
               </div>
            </div>

            <div className="flex gap-4">
              <button className="w-10 h-10 rounded-full bg-slate-50 flex items-center justify-center text-slate-500 hover:bg-blue-50 hover:text-blue-600 transition-colors">
                <Share2 size={18} />
              </button>
              <button className="w-10 h-10 rounded-full bg-slate-50 flex items-center justify-center text-slate-500 hover:bg-blue-50 hover:text-blue-600 transition-colors">
                <Mail size={18} />
              </button>
              <button className="w-10 h-10 rounded-full bg-slate-50 flex items-center justify-center text-slate-500 hover:bg-blue-50 hover:text-blue-600 transition-colors">
                <Rss size={18} />
              </button>
            </div>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 mb-12">
            <div>
              <h5 className="font-bold text-slate-900 mb-4 text-sm">About</h5>
              <ul className="space-y-3 text-sm text-slate-500">
                <li><a href="#" className="hover:text-blue-600">About Portal</a></li>
                <li><a href="#" className="hover:text-blue-600">Objectives</a></li>
                <li><a href="#" className="hover:text-blue-600">Citizens Charter</a></li>
              </ul>
            </div>
            <div>
              <h5 className="font-bold text-slate-900 mb-4 text-sm">Resources</h5>
              <ul className="space-y-3 text-sm text-slate-500">
                <li><a href="#" className="hover:text-blue-600">Tutorials</a></li>
                <li><a href="#" className="hover:text-blue-600">FAQ</a></li>
                <li><a href="#" className="hover:text-blue-600">Download App</a></li>
              </ul>
            </div>
            <div>
              <h5 className="font-bold text-slate-900 mb-4 text-sm">Legal</h5>
              <ul className="space-y-3 text-sm text-slate-500">
                <li><a href="#" className="hover:text-blue-600">Terms of Service</a></li>
                <li><a href="#" className="hover:text-blue-600">Privacy Policy</a></li>
                <li><a href="#" className="hover:text-blue-600">Copyright Policy</a></li>
              </ul>
            </div>
            <div>
              <h5 className="font-bold text-slate-900 mb-4 text-sm">Contact</h5>
              <ul className="space-y-3 text-sm text-slate-500">
                <li><a href="#" className="hover:text-blue-600">Help Desk</a></li>
                <li><a href="#" className="hover:text-blue-600">Feedback</a></li>
                <li><a href="#" className="hover:text-blue-600">Accessibility</a></li>
              </ul>
            </div>
          </div>

          <div className="border-t border-slate-100 py-8 text-center text-xs text-slate-400">
            <p className="mb-2">Content Owned by Ministry of Electronics & IT, Government of India.</p>
            <p>© 2024 BharatSetu. All rights reserved.</p>
            <div className="mt-4 flex justify-center gap-6">
              <span>Last Updated: 25 Oct 2024</span>
              <span>Version: 3.1.0</span>
            </div>
          </div>
        </div>
        
        {/* Bottom Saffron Bar */}
        <div className="h-2 w-full bg-orange-400"></div>
      </footer>
    </div>
  );
};

export default LandingPage;