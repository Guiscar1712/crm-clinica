export interface AuthUser {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  tenantId: string;
}

export interface AuthResponse {
  accessToken: string;
  user: AuthUser;
}

export interface Tenant {
  id: string;
  name: string;
  slug: string;
  document: string | null;
  email: string | null;
  phone: string | null;
  logoUrl: string | null;
  isActive: boolean;
  createdAt: string;
  updatedAt?: string;
}

export type UserRole = 'SUPER_ADMIN' | 'ADMIN' | 'MANAGER' | 'ATTENDANT' | 'VIEWER';

export interface User {
  id: string;
  tenantId: string;
  name: string;
  email: string;
  role: UserRole;
  isActive: boolean;
  createdAt: string;
  updatedAt?: string;
}

export type PatientGender = 'MALE' | 'FEMALE' | 'OTHER' | 'PREFER_NOT_TO_SAY';

export interface Address {
  street: string;
  number: string;
  complement: string | null;
  neighborhood: string;
  city: string;
  state: string;
  zipCode: string;
}

export interface Patient {
  id: string;
  tenantId: string;
  name: string;
  cpf: string | null;
  dateOfBirth: string | null;
  age: number | null;
  gender: PatientGender | null;
  phone: string;
  secondaryPhone: string | null;
  email: string | null;
  address: Address | null;
  healthInsurance: string | null;
  healthInsuranceNumber: string | null;
  notes: string | null;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export type AppointmentType = 'CONSULTATION' | 'RETURN' | 'EXAM' | 'PROCEDURE' | 'EMERGENCY' | 'TELEMEDICINE';
export type AppointmentPriority = 'LOW' | 'NORMAL' | 'HIGH' | 'URGENT';
export type AppointmentStatus = 'AGUARDANDO' | 'EM_ATENDIMENTO' | 'FINALIZADO' | 'CANCELADO';

export interface AppointmentNote {
  id: string;
  authorId: string;
  authorName?: string;
  content: string;
  createdAt: string;
}

export interface Appointment {
  id: string;
  tenantId: string;
  patientId: string;
  patientName?: string;
  assignedUserId: string | null;
  assignedUserName?: string | null;
  type: AppointmentType;
  priority: AppointmentPriority;
  description: string;
  status: AppointmentStatus;
  scheduledAt: string | null;
  startedAt: string | null;
  finishedAt: string | null;
  cancelledAt: string | null;
  cancellationReason: string | null;
  durationMinutes: number | null;
  notes: AppointmentNote[];
  createdAt: string;
  updatedAt: string;
}

export interface PaginatedResponse<T> {
  data: T[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

export interface ListAppointmentsParams {
  page?: number;
  limit?: number;
  status?: AppointmentStatus;
  patientId?: string;
  assignedUserId?: string;
  type?: AppointmentType;
  priority?: AppointmentPriority;
}
