export interface Category {
  id: string;
  name: string;
  description: string;
  department: string;
  departmentEmail?: string;
  departmentPhone?: string;
  slaDays: number;
  isActive: boolean;
  icon?: string;
}

export interface Grievance {
  id: string;
  userId: string;
  categoryId: string;
  title: string;
  description: string;
  complainantName: string;
  complainantMobile: string;
  complainantEmail?: string;
  location: string;
  address: string;
  ward?: string;
  pincode: string;
  latitude?: number;
  longitude?: number;
  status: GrievanceStatus;
  priority: Priority;
  attachments: string[];
  assignedTo?: string;
  assignedDepartment?: string;
  escalationReason?: string;
  escalatedAt?: string;
  dueDate: string;
  category?: Category;
  createdAt: string;
  updatedAt: string;
}

export type GrievanceStatus = 'submitted' | 'acknowledged' | 'in_progress' | 'pending_info' | 'escalated' | 'resolved' | 'closed' | 'rejected';
export type Priority = 'low' | 'medium' | 'high' | 'urgent';

export interface SubmitGrievanceDTO {
  categoryId: string;
  title: string;
  description: string;
  complainantName: string;
  complainantMobile: string;
  complainantEmail?: string;
  location: string;
  address: string;
  ward?: string;
  pincode: string;
  latitude?: number;
  longitude?: number;
  priority: Priority;
  attachments?: string[];
}

export const GRIEVANCE_STATUS_LABELS: Record<GrievanceStatus, string> = {
  submitted: 'Submitted',
  acknowledged: 'Acknowledged',
  in_progress: 'In Progress',
  pending_info: 'Pending Info',
  escalated: 'Escalated',
  resolved: 'Resolved',
  closed: 'Closed',
  rejected: 'Rejected',
};

export const PRIORITY_LABELS: Record<Priority, string> = {
  low: 'Low',
  medium: 'Medium',
  high: 'High',
  urgent: 'Urgent',
};

export const GRIEVANCE_STATUS_COLORS: Record<GrievanceStatus, string> = {
  submitted: 'bg-gray-100 text-gray-800',
  acknowledged: 'bg-blue-100 text-blue-800',
  in_progress: 'bg-yellow-100 text-yellow-800',
  pending_info: 'bg-orange-100 text-orange-800',
  escalated: 'bg-red-100 text-red-800',
  resolved: 'bg-green-100 text-green-800',
  closed: 'bg-slate-100 text-slate-800',
  rejected: 'bg-red-100 text-red-800',
};

export const PRIORITY_COLORS: Record<Priority, string> = {
  low: 'bg-gray-100 text-gray-800',
  medium: 'bg-blue-100 text-blue-800',
  high: 'bg-orange-100 text-orange-800',
  urgent: 'bg-red-100 text-red-800',
};
