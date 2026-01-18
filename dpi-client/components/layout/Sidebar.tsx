'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  Home,
  Heart,
  Building2,
  Stethoscope,
  CalendarDays,
  Leaf,
  FileText,
  TrendingUp,
  BookOpen,
  ClipboardList,
  Building,
  AlertCircle,
  FilePlus,
  User,
  Settings,
  LayoutDashboard,
  Users,
  Server,
  Shield,
  X
} from 'lucide-react';
import { useUIStore } from '@/lib/store/uiStore';

interface SidebarItem {
  label: string;
  href: string;
  icon: React.ReactNode;
  children?: SidebarItem[];
}

interface SidebarProps {
  variant: 'citizen' | 'admin';
}

const citizenNavItems: SidebarItem[] = [
  { label: 'Dashboard', href: '/dashboard', icon: <Home size={20} /> },
  {
    label: 'Healthcare',
    href: '/healthcare',
    icon: <Heart size={20} />,
    children: [
      { label: 'Hospitals', href: '/healthcare', icon: <Building2 size={18} /> },
      { label: 'Doctors', href: '/healthcare/doctors', icon: <Stethoscope size={18} /> },
      { label: 'My Appointments', href: '/healthcare/appointments', icon: <CalendarDays size={18} /> },
    ],
  },
  {
    label: 'Agriculture',
    href: '/agriculture',
    icon: <Leaf size={20} />,
    children: [
      { label: 'Schemes', href: '/agriculture/schemes', icon: <FileText size={18} /> },
      { label: 'Advisories', href: '/agriculture/advisories', icon: <BookOpen size={18} /> },
      { label: 'Market Prices', href: '/agriculture/market-prices', icon: <TrendingUp size={18} /> },
      { label: 'My Applications', href: '/agriculture/my-applications', icon: <ClipboardList size={18} /> },
    ],
  },
  {
    label: 'Urban Services',
    href: '/urban',
    icon: <Building size={20} />,
    children: [
      { label: 'Categories', href: '/urban/categories', icon: <LayoutDashboard size={18} /> },
      { label: 'My Grievances', href: '/urban/grievances', icon: <AlertCircle size={18} /> },
      { label: 'Submit Grievance', href: '/urban/grievances/new', icon: <FilePlus size={18} /> },
    ],
  },
  { label: 'Profile', href: '/profile', icon: <User size={20} /> },
];

const adminNavItems: SidebarItem[] = [
  { label: 'Dashboard', href: '/admin/dashboard', icon: <LayoutDashboard size={20} /> },
  { label: 'Service Registry', href: '/admin/services', icon: <Server size={20} /> },
  { label: 'Audit Logs', href: '/admin/audit', icon: <Shield size={20} /> },
  {
    label: 'Healthcare',
    href: '/admin/healthcare',
    icon: <Heart size={20} />,
    children: [
      { label: 'Appointments', href: '/admin/healthcare/appointments', icon: <CalendarDays size={18} /> },
    ],
  },
  {
    label: 'Agriculture',
    href: '/admin/agriculture',
    icon: <Leaf size={20} />,
    children: [
      { label: 'Schemes', href: '/admin/agriculture/schemes', icon: <FileText size={18} /> },
      { label: 'Applications', href: '/admin/agriculture/applications', icon: <ClipboardList size={18} /> },
    ],
  },
  {
    label: 'Urban Services',
    href: '/admin/urban',
    icon: <Building size={20} />,
    children: [
      { label: 'Grievances', href: '/admin/urban/grievances', icon: <AlertCircle size={18} /> },
    ],
  },
  { label: 'Users', href: '/admin/users', icon: <Users size={20} /> },
  { label: 'Settings', href: '/admin/settings', icon: <Settings size={20} /> },
];

export function Sidebar({ variant }: SidebarProps) {
  const pathname = usePathname();
  const { sidebarOpen, setSidebarOpen } = useUIStore();
  const [expandedItems, setExpandedItems] = React.useState<string[]>([]);

  const navItems = variant === 'admin' ? adminNavItems : citizenNavItems;

  const toggleExpand = (label: string) => {
    setExpandedItems(prev =>
      prev.includes(label)
        ? prev.filter(item => item !== label)
        : [...prev, label]
    );
  };

  const isActive = (href: string) => pathname === href;
  const isParentActive = (item: SidebarItem) =>
    item.children?.some(child => pathname.startsWith(child.href)) || pathname === item.href;

  React.useEffect(() => {
    // Auto-expand parent when child is active
    navItems.forEach(item => {
      if (item.children && isParentActive(item) && !expandedItems.includes(item.label)) {
        setExpandedItems(prev => [...prev, item.label]);
      }
    });
  }, [pathname]);

  return (
    <>
      {/* Mobile Overlay */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-40 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside
        className={`
          fixed left-0 top-0 z-50 h-full w-64 bg-white border-r border-slate-200
          transform transition-transform duration-300 ease-in-out
          lg:translate-x-0 lg:static lg:z-0
          ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'}
        `}
      >
        {/* Mobile Close Button */}
        <div className="lg:hidden flex justify-end p-4">
          <button
            onClick={() => setSidebarOpen(false)}
            className="p-2 text-slate-600 hover:bg-slate-100 rounded-lg"
          >
            <X size={20} />
          </button>
        </div>

        {/* Navigation */}
        <nav className="px-4 py-2 space-y-1 overflow-y-auto h-[calc(100vh-80px)] lg:h-[calc(100vh-64px)]">
          {navItems.map((item) => (
            <div key={item.label}>
              {item.children ? (
                <>
                  <button
                    onClick={() => toggleExpand(item.label)}
                    className={`
                      w-full flex items-center justify-between gap-3 px-3 py-2.5 rounded-lg
                      text-sm font-medium transition-colors
                      ${isParentActive(item)
                        ? 'bg-blue-50 text-blue-700'
                        : 'text-slate-600 hover:bg-slate-50'
                      }
                    `}
                  >
                    <div className="flex items-center gap-3">
                      {item.icon}
                      {item.label}
                    </div>
                    <svg
                      className={`w-4 h-4 transition-transform ${expandedItems.includes(item.label) ? 'rotate-180' : ''}`}
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                    </svg>
                  </button>

                  {expandedItems.includes(item.label) && (
                    <div className="ml-4 mt-1 space-y-1">
                      {item.children.map((child) => (
                        <Link
                          key={child.href}
                          href={child.href}
                          onClick={() => setSidebarOpen(false)}
                          className={`
                            flex items-center gap-3 px-3 py-2 rounded-lg text-sm transition-colors
                            ${isActive(child.href)
                              ? 'bg-blue-700 text-white'
                              : 'text-slate-600 hover:bg-slate-50'
                            }
                          `}
                        >
                          {child.icon}
                          {child.label}
                        </Link>
                      ))}
                    </div>
                  )}
                </>
              ) : (
                <Link
                  href={item.href}
                  onClick={() => setSidebarOpen(false)}
                  className={`
                    flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors
                    ${isActive(item.href)
                      ? 'bg-blue-700 text-white'
                      : 'text-slate-600 hover:bg-slate-50'
                    }
                  `}
                >
                  {item.icon}
                  {item.label}
                </Link>
              )}
            </div>
          ))}
        </nav>
      </aside>
    </>
  );
}
