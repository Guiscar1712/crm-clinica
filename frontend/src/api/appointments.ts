import type {
  Appointment,
  AppointmentStatus,
  ListAppointmentsParams,
  PaginatedResponse,
} from '../types';
import { apiFetch } from './client';

function buildQuery(params: ListAppointmentsParams): string {
  const q = new URLSearchParams();
  if (params.page != null) q.set('page', String(params.page));
  if (params.limit != null) q.set('limit', String(params.limit));
  if (params.status) q.set('status', params.status);
  if (params.patientId) q.set('patientId', params.patientId);
  if (params.assignedUserId) q.set('assignedUserId', params.assignedUserId);
  if (params.type) q.set('type', params.type);
  if (params.priority) q.set('priority', params.priority);
  const s = q.toString();
  return s ? `?${s}` : '';
}

function toIsoScheduledAt(localDatetime: string | null | undefined): string | null {
  if (!localDatetime?.trim()) return null;
  const d = new Date(localDatetime);
  return Number.isNaN(d.getTime()) ? null : d.toISOString();
}

export async function fetchAppointments(
  params: ListAppointmentsParams,
): Promise<PaginatedResponse<Appointment>> {
  const withDefaults = {
    page: params.page ?? 1,
    limit: params.limit ?? 10,
    ...params,
  };
  return apiFetch<PaginatedResponse<Appointment>>(`/appointments${buildQuery(withDefaults)}`);
}

export async function fetchAppointment(id: string): Promise<Appointment> {
  return apiFetch<Appointment>(`/appointments/${id}`);
}

export async function createAppointment(data: {
  patientId: string;
  description: string;
  type?: string;
  priority?: string;
  scheduledAt?: string | null;
  assignedUserId?: string | null;
}): Promise<Appointment> {
  const body = {
    patientId: data.patientId,
    description: data.description,
    type: data.type ?? 'CONSULTATION',
    priority: data.priority ?? 'NORMAL',
    scheduledAt: toIsoScheduledAt(data.scheduledAt ?? undefined),
    assignedUserId: data.assignedUserId ?? null,
  };
  return apiFetch<Appointment>('/appointments', {
    method: 'POST',
    body: JSON.stringify(body),
  });
}

export async function updateAppointment(
  id: string,
  data: {
    description?: string;
    priority?: string;
    type?: string;
    assignedUserId?: string | null;
    scheduledAt?: string | null;
  },
): Promise<Appointment> {
  const payload = { ...data };
  if (data.scheduledAt !== undefined) {
    payload.scheduledAt = data.scheduledAt ? toIsoScheduledAt(data.scheduledAt) : null;
  }
  return apiFetch<Appointment>(`/appointments/${id}`, {
    method: 'PATCH',
    body: JSON.stringify(payload),
  });
}

export async function advanceAppointmentStatus(
  id: string,
  status: AppointmentStatus,
): Promise<Appointment> {
  return apiFetch<Appointment>(`/appointments/${id}/status`, {
    method: 'PATCH',
    body: JSON.stringify({ status }),
  });
}

export async function cancelAppointment(id: string, reason: string): Promise<Appointment> {
  return apiFetch<Appointment>(`/appointments/${id}/cancel`, {
    method: 'PATCH',
    body: JSON.stringify({ reason }),
  });
}

export async function addAppointmentNote(id: string, content: string): Promise<Appointment> {
  return apiFetch<Appointment>(`/appointments/${id}/notes`, {
    method: 'POST',
    body: JSON.stringify({ content }),
  });
}

export async function deleteAppointment(id: string): Promise<void> {
  await apiFetch<void>(`/appointments/${id}`, { method: 'DELETE' });
}
