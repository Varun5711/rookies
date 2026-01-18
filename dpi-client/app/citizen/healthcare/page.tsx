"use client";
import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { healthcareApi } from '@/lib/api';
import { Hospital, Doctor } from '@/lib/types/healthcare';
import { ArrowRight, Search, Hospital as HospitalIcon, Stethoscope } from 'lucide-react';
import { useRouter } from 'next/navigation';

// Skeleton Loader
const SkeletonCard = () => (
  <div className="bg-white rounded-lg p-4 shadow-sm border border-slate-100 animate-pulse">
    <div className="h-24 bg-slate-200 rounded-md mb-4"></div>
    <div className="h-4 bg-slate-200 rounded w-3/4 mb-2"></div>
    <div className="h-3 bg-slate-200 rounded w-1/2"></div>
  </div>
);

const HealthcarePage: React.FC = () => {
  const router = useRouter();

  const { data: hospitals, isLoading: isLoadingHospitals } = useQuery<Hospital[], Error>({
    queryKey: ['hospitals'],
    queryFn: () => healthcareApi.getHospitals({ limit: 6 }).then(res => res.items),
  });

  const { data: doctors, isLoading: isLoadingDoctors } = useQuery<Doctor[], Error>({
    queryKey: ['doctors'],
    queryFn: () => healthcareApi.getDoctors({ limit: 6 }).then(res => res.items),
  });

  return (
    <div className="p-4 sm:p-6 lg:p-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-slate-800">Healthcare Services</h1>
        <p className="text-slate-500 mt-1">Find hospitals, book appointments, and manage your health records.</p>
      </div>

      <div className="bg-white p-6 rounded-lg shadow-sm border border-slate-100 mb-8">
        <div className="flex items-center gap-3 mb-4">
            <Search className="text-slate-400" size={20} />
            <h2 className="text-xl font-semibold text-slate-700">Find a Healthcare Provider</h2>
        </div>
        <div className="flex flex-col sm:flex-row gap-4">
          <input
            type="text"
            placeholder="Search by hospital name, city, or specialization..."
            className="flex-grow p-3 border border-slate-200 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
          />
          <button className="bg-blue-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-blue-700 transition-colors">
            Search
          </button>
        </div>
      </div>
      
      {/* Featured Hospitals */}
      <section className="mb-12">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-2xl font-bold text-slate-800 flex items-center gap-3"><HospitalIcon className="text-blue-500" /> Featured Hospitals</h2>
          <a href="/citizen/healthcare/hospitals" className="flex items-center text-sm font-medium text-blue-600 hover:underline">
            View All <ArrowRight size={16} className="ml-1" />
          </a>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {isLoadingHospitals ? (
            Array.from({ length: 3 }).map((_, i) => <SkeletonCard key={i} />)
          ) : (
            hospitals?.map(hospital => (
              <div key={hospital.id} className="bg-white rounded-lg p-6 shadow-sm border border-slate-100 hover:shadow-md transition-shadow cursor-pointer" onClick={() => router.push(`/citizen/healthcare/hospitals/${hospital.id}`)}>
                <h3 className="font-bold text-lg text-slate-800 truncate mb-1">{hospital.name}</h3>
                <p className="text-sm text-slate-500">{hospital.city}, {hospital.state}</p>
                <div className="mt-4 text-xs text-white">
                  <span className="bg-blue-500 px-2 py-1 rounded-full font-semibold">{hospital.type}</span>
                </div>
              </div>
            ))
          )}
        </div>
      </section>

      {/* Top Doctors */}
      <section>
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-2xl font-bold text-slate-800 flex items-center gap-3"><Stethoscope className="text-green-500" /> Top Doctors</h2>
          <a href="/citizen/healthcare/doctors" className="flex items-center text-sm font-medium text-blue-600 hover:underline">
            View All <ArrowRight size={16} className="ml-1" />
          </a>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {isLoadingDoctors ? (
            Array.from({ length: 3 }).map((_, i) => <SkeletonCard key={i} />)
          ) : (
            doctors?.map(doctor => (
              <div key={doctor.id} className="bg-white rounded-lg p-6 shadow-sm border border-slate-100 hover:shadow-md transition-shadow cursor-pointer" onClick={() => router.push(`/citizen/healthcare/doctors/${doctor.id}`)}>
                <h3 className="font-bold text-lg text-slate-800">Dr. {doctor.name}</h3>
                <p className="text-sm text-slate-500">{doctor.specialization}</p>
                 <div className="text-xs mt-4">
                   <p className="text-slate-600 font-medium">{doctor.hospital?.name}</p>
                 </div>
              </div>
            ))
          )}
        </div>
      </section>
    </div>
  );
};

export default HealthcarePage;
