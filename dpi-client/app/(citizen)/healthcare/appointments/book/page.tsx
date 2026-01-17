'use client';

import React, { useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { useQuery, useMutation } from '@tanstack/react-query';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import toast from 'react-hot-toast';
import {
  ArrowLeft,
  ArrowRight,
  Building2,
  Stethoscope,
  Calendar,
  User,
  Check
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card';
import { Input } from '@/components/ui/Input';
import { Select } from '@/components/ui/Select';
import { Textarea } from '@/components/ui/Textarea';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import { CardSkeleton } from '@/components/ui/Skeleton';
import { healthcareApi } from '@/lib/api/healthcare';
import { Hospital, Doctor, SPECIALIZATION_LABELS, DayOfWeek } from '@/lib/types/healthcare';
import { formatCurrency } from '@/lib/utils/formatCurrency';
import { formatTime } from '@/lib/utils/formatDate';

const patientSchema = z.object({
  patientName: z.string().min(1, 'Patient name is required'),
  patientMobile: z.string().regex(/^[6-9]\d{9}$/, 'Enter valid 10-digit mobile'),
  symptoms: z.string().optional(),
  notes: z.string().optional(),
});

type PatientFormData = z.infer<typeof patientSchema>;

const DAY_ORDER: DayOfWeek[] = ['monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday', 'sunday'];

export default function BookAppointmentPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const preselectedDoctorId = searchParams.get('doctorId');

  const [step, setStep] = useState(preselectedDoctorId ? 3 : 1);
  const [selectedHospital, setSelectedHospital] = useState<Hospital | null>(null);
  const [selectedDoctor, setSelectedDoctor] = useState<Doctor | null>(null);
  const [selectedDate, setSelectedDate] = useState('');
  const [selectedTime, setSelectedTime] = useState('');

  const form = useForm<PatientFormData>({
    resolver: zodResolver(patientSchema),
    defaultValues: {
      patientName: '',
      patientMobile: '',
      symptoms: '',
      notes: '',
    },
  });

  // Fetch hospitals
  const { data: hospitalsData, isLoading: hospitalsLoading } = useQuery({
    queryKey: ['hospitals-booking'],
    queryFn: () => healthcareApi.getHospitals({ limit: 50 }),
    enabled: step === 1,
  });

  // Fetch doctors for selected hospital
  const { data: doctorsData, isLoading: doctorsLoading } = useQuery({
    queryKey: ['doctors-booking', selectedHospital?.id],
    queryFn: () => healthcareApi.getDoctors({ hospitalId: selectedHospital?.id, limit: 50 }),
    enabled: step === 2 && !!selectedHospital,
  });

  // Fetch preselected doctor
  const { data: preselectedDoctor, isLoading: preselectedLoading } = useQuery({
    queryKey: ['doctor', preselectedDoctorId],
    queryFn: () => healthcareApi.getDoctor(preselectedDoctorId!),
    enabled: !!preselectedDoctorId,
  });

  // Handle preselected doctor
  React.useEffect(() => {
    if (preselectedDoctor && !selectedDoctor) {
      setSelectedDoctor(preselectedDoctor);
      if (preselectedDoctor.hospital) {
        setSelectedHospital(preselectedDoctor.hospital);
      }
    }
  }, [preselectedDoctor, selectedDoctor]);

  // Fetch time slots for selected doctor
  const { data: slots } = useQuery({
    queryKey: ['doctorSlots', selectedDoctor?.id],
    queryFn: () => healthcareApi.getDoctorSlots(selectedDoctor!.id),
    enabled: !!selectedDoctor,
  });

  const bookMutation = useMutation({
    mutationFn: healthcareApi.bookAppointment,
    onSuccess: () => {
      toast.success('Appointment booked successfully!');
      router.push('/healthcare/appointments');
    },
    onError: () => {
      toast.error('Failed to book appointment');
    },
  });

  const handleSubmit = (data: PatientFormData) => {
    if (!selectedDoctor || !selectedHospital || !selectedDate || !selectedTime) {
      toast.error('Please complete all steps');
      return;
    }

    bookMutation.mutate({
      doctorId: selectedDoctor.id,
      hospitalId: selectedHospital.id,
      appointmentDate: selectedDate,
      appointmentTime: selectedTime,
      patientName: data.patientName,
      patientMobile: data.patientMobile,
      symptoms: data.symptoms,
      notes: data.notes,
    });
  };

  const getAvailableDates = () => {
    if (!slots) return [];
    const availableDays = slots.filter(s => s.isAvailable).map(s => s.dayOfWeek);
    const dates: string[] = [];
    const today = new Date();

    for (let i = 0; i < 30; i++) {
      const date = new Date(today);
      date.setDate(today.getDate() + i);
      const dayName = date.toLocaleDateString('en-US', { weekday: 'long' }).toLowerCase() as DayOfWeek;

      if (availableDays.includes(dayName)) {
        dates.push(date.toISOString().split('T')[0]);
      }
    }

    return dates;
  };

  const getAvailableTimes = () => {
    if (!slots || !selectedDate) return [];
    const date = new Date(selectedDate);
    const dayName = date.toLocaleDateString('en-US', { weekday: 'long' }).toLowerCase() as DayOfWeek;
    const daySlots = slots.filter(s => s.dayOfWeek === dayName && s.isAvailable);

    const times: string[] = [];
    daySlots.forEach(slot => {
      const [startHour, startMin] = slot.startTime.split(':').map(Number);
      const [endHour, endMin] = slot.endTime.split(':').map(Number);
      const duration = slot.slotDurationMinutes;

      let currentHour = startHour;
      let currentMin = startMin;

      while (currentHour < endHour || (currentHour === endHour && currentMin < endMin)) {
        times.push(`${String(currentHour).padStart(2, '0')}:${String(currentMin).padStart(2, '0')}`);
        currentMin += duration;
        if (currentMin >= 60) {
          currentHour += Math.floor(currentMin / 60);
          currentMin = currentMin % 60;
        }
      }
    });

    return times;
  };

  const steps = [
    { number: 1, title: 'Select Hospital' },
    { number: 2, title: 'Select Doctor' },
    { number: 3, title: 'Select Date & Time' },
    { number: 4, title: 'Patient Details' },
    { number: 5, title: 'Review & Confirm' },
  ];

  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      {/* Back Button */}
      <Link href="/healthcare/appointments" className="inline-flex items-center gap-2 text-slate-600 hover:text-blue-600 transition-colors">
        <ArrowLeft size={18} />
        <span>Back to Appointments</span>
      </Link>

      {/* Progress Steps */}
      <div className="flex items-center justify-center gap-2 overflow-x-auto pb-2">
        {steps.map((s, i) => (
          <React.Fragment key={s.number}>
            <div className="flex items-center gap-2">
              <div
                className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium ${
                  step > s.number
                    ? 'bg-green-500 text-white'
                    : step === s.number
                    ? 'bg-blue-600 text-white'
                    : 'bg-slate-100 text-slate-500'
                }`}
              >
                {step > s.number ? <Check size={16} /> : s.number}
              </div>
              <span className={`text-sm hidden sm:block ${step === s.number ? 'text-blue-600 font-medium' : 'text-slate-500'}`}>
                {s.title}
              </span>
            </div>
            {i < steps.length - 1 && <div className="w-8 h-px bg-slate-200" />}
          </React.Fragment>
        ))}
      </div>

      {/* Step Content */}
      <Card>
        <CardHeader>
          <CardTitle>{steps[step - 1].title}</CardTitle>
        </CardHeader>
        <CardContent>
          {/* Step 1: Select Hospital */}
          {step === 1 && (
            <div className="space-y-4">
              {hospitalsLoading ? (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {[1, 2, 3, 4].map(i => <CardSkeleton key={i} />)}
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {(hospitalsData?.data || []).map((hospital: Hospital) => (
                    <div
                      key={hospital.id}
                      onClick={() => setSelectedHospital(hospital)}
                      className={`p-4 border rounded-lg cursor-pointer transition-all ${
                        selectedHospital?.id === hospital.id
                          ? 'border-blue-500 bg-blue-50'
                          : 'border-slate-200 hover:border-blue-300'
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        <Building2 className="text-blue-600" size={20} />
                        <div>
                          <p className="font-medium text-slate-900">{hospital.name}</p>
                          <p className="text-sm text-slate-500">{hospital.city}, {hospital.state}</p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* Step 2: Select Doctor */}
          {step === 2 && (
            <div className="space-y-4">
              {doctorsLoading ? (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {[1, 2, 3, 4].map(i => <CardSkeleton key={i} />)}
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {(doctorsData?.data || []).map((doctor: Doctor) => (
                    <div
                      key={doctor.id}
                      onClick={() => doctor.isAvailable && setSelectedDoctor(doctor)}
                      className={`p-4 border rounded-lg transition-all ${
                        !doctor.isAvailable
                          ? 'border-slate-200 bg-slate-50 cursor-not-allowed opacity-60'
                          : selectedDoctor?.id === doctor.id
                          ? 'border-blue-500 bg-blue-50 cursor-pointer'
                          : 'border-slate-200 hover:border-blue-300 cursor-pointer'
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        <Stethoscope className="text-blue-600" size={20} />
                        <div className="flex-1">
                          <p className="font-medium text-slate-900">{doctor.name}</p>
                          <p className="text-sm text-slate-500">
                            {SPECIALIZATION_LABELS[doctor.specialization]}
                          </p>
                          <p className="text-sm text-blue-600 font-medium mt-1">
                            {formatCurrency(doctor.consultationFee)}
                          </p>
                        </div>
                        {!doctor.isAvailable && (
                          <Badge variant="default">Unavailable</Badge>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* Step 3: Select Date & Time */}
          {step === 3 && (
            <div className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">Select Date</label>
                <div className="grid grid-cols-4 sm:grid-cols-7 gap-2">
                  {getAvailableDates().slice(0, 14).map(date => {
                    const d = new Date(date);
                    return (
                      <button
                        key={date}
                        onClick={() => {
                          setSelectedDate(date);
                          setSelectedTime('');
                        }}
                        className={`p-3 rounded-lg text-center transition-all ${
                          selectedDate === date
                            ? 'bg-blue-600 text-white'
                            : 'bg-slate-50 hover:bg-slate-100 text-slate-700'
                        }`}
                      >
                        <div className="text-xs">{d.toLocaleDateString('en-US', { weekday: 'short' })}</div>
                        <div className="text-lg font-semibold">{d.getDate()}</div>
                      </button>
                    );
                  })}
                </div>
              </div>

              {selectedDate && (
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">Select Time</label>
                  <div className="grid grid-cols-4 sm:grid-cols-6 gap-2">
                    {getAvailableTimes().map(time => (
                      <button
                        key={time}
                        onClick={() => setSelectedTime(time)}
                        className={`p-2 rounded-lg text-center transition-all ${
                          selectedTime === time
                            ? 'bg-blue-600 text-white'
                            : 'bg-slate-50 hover:bg-slate-100 text-slate-700'
                        }`}
                      >
                        {formatTime(time)}
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}

          {/* Step 4: Patient Details */}
          {step === 4 && (
            <form className="space-y-4">
              <Input
                label="Patient Name"
                placeholder="Enter patient's full name"
                error={form.formState.errors.patientName?.message}
                {...form.register('patientName')}
              />
              <Input
                label="Mobile Number"
                placeholder="10-digit mobile number"
                error={form.formState.errors.patientMobile?.message}
                {...form.register('patientMobile')}
              />
              <Textarea
                label="Symptoms (optional)"
                placeholder="Describe your symptoms..."
                {...form.register('symptoms')}
              />
              <Textarea
                label="Additional Notes (optional)"
                placeholder="Any additional information..."
                {...form.register('notes')}
              />
            </form>
          )}

          {/* Step 5: Review & Confirm */}
          {step === 5 && (
            <div className="space-y-4">
              <div className="bg-slate-50 rounded-lg p-4 space-y-3">
                <div className="flex justify-between">
                  <span className="text-slate-500">Hospital</span>
                  <span className="font-medium text-slate-900">{selectedHospital?.name}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">Doctor</span>
                  <span className="font-medium text-slate-900">{selectedDoctor?.name}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">Date</span>
                  <span className="font-medium text-slate-900">
                    {selectedDate && new Date(selectedDate).toLocaleDateString('en-US', {
                      weekday: 'long',
                      year: 'numeric',
                      month: 'long',
                      day: 'numeric',
                    })}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">Time</span>
                  <span className="font-medium text-slate-900">{formatTime(selectedTime)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">Patient Name</span>
                  <span className="font-medium text-slate-900">{form.getValues('patientName')}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">Mobile</span>
                  <span className="font-medium text-slate-900">{form.getValues('patientMobile')}</span>
                </div>
                <div className="flex justify-between border-t border-slate-200 pt-3">
                  <span className="text-slate-500">Consultation Fee</span>
                  <span className="font-semibold text-blue-600">
                    {selectedDoctor && formatCurrency(selectedDoctor.consultationFee)}
                  </span>
                </div>
              </div>
            </div>
          )}

          {/* Navigation Buttons */}
          <div className="flex justify-between mt-6 pt-4 border-t border-slate-100">
            {step > 1 && (
              <Button variant="outline" onClick={() => setStep(step - 1)}>
                <ArrowLeft size={18} className="mr-2" />
                Previous
              </Button>
            )}
            {step < 5 ? (
              <Button
                className="ml-auto"
                onClick={() => {
                  if (step === 1 && !selectedHospital) {
                    toast.error('Please select a hospital');
                    return;
                  }
                  if (step === 2 && !selectedDoctor) {
                    toast.error('Please select a doctor');
                    return;
                  }
                  if (step === 3 && (!selectedDate || !selectedTime)) {
                    toast.error('Please select date and time');
                    return;
                  }
                  if (step === 4) {
                    form.trigger().then(valid => {
                      if (valid) setStep(step + 1);
                    });
                    return;
                  }
                  setStep(step + 1);
                }}
              >
                Next
                <ArrowRight size={18} className="ml-2" />
              </Button>
            ) : (
              <Button
                className="ml-auto"
                isLoading={bookMutation.isPending}
                onClick={form.handleSubmit(handleSubmit)}
              >
                Confirm Booking
              </Button>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
