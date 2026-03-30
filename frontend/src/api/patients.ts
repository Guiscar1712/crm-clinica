import type { Patient, PaginatedResponse } from '../types';
import { apiFetch } from './client';

const DEFAULT_LIST_LIMIT = 100;

function normalizePatient(raw: Patient): Patient {
  return {
    ...raw,
    dateOfBirth: raw.dateOfBirth
      ? typeof raw.dateOfBirth === 'string'
        ? raw.dateOfBirth.split('T')[0]
        : String(raw.dateOfBirth)
      : null,
  };
}

export async function fetchPatients(): Promise<Patient[]> {
  const res = await apiFetch<PaginatedResponse<Patient>>(
    `/patients?page=1&limit=${DEFAULT_LIST_LIMIT}`,
  );
  return res.data.map(normalizePatient);
}

export async function fetchPatient(id: string): Promise<Patient> {
  const raw = await apiFetch<Patient>(`/patients/${id}`);
  return normalizePatient(raw);
}

export type CreatePatientBody = {
  name: string;
  phone: string;
  cpf?: string | null;
  dateOfBirth?: string | null;
  gender?: string | null;
  secondaryPhone?: string | null;
  email?: string | null;
  address?: {
    street: string;
    number: string;
    complement?: string | null;
    neighborhood: string;
    city: string;
    state: string;
    zipCode: string;
  } | null;
  healthInsurance?: string | null;
  healthInsuranceNumber?: string | null;
  notes?: string | null;
};

export async function createPatient(data: CreatePatientBody): Promise<Patient> {
  const raw = await apiFetch<Patient>('/patients', {
    method: 'POST',
    body: JSON.stringify(data),
  });
  return normalizePatient(raw);
}

export async function updatePatient(
  id: string,
  data: Partial<CreatePatientBody>,
): Promise<Patient> {
  const raw = await apiFetch<Patient>(`/patients/${id}`, {
    method: 'PATCH',
    body: JSON.stringify(data),
  });
  return normalizePatient(raw);
}

export async function activatePatient(id: string): Promise<Patient> {
  const raw = await apiFetch<Patient>(`/patients/${id}/activate`, { method: 'PATCH' });
  return normalizePatient(raw);
}

export async function deactivatePatient(id: string): Promise<Patient> {
  const raw = await apiFetch<Patient>(`/patients/${id}/deactivate`, { method: 'PATCH' });
  return normalizePatient(raw);
}

export async function deletePatient(id: string): Promise<void> {
  await apiFetch<void>(`/patients/${id}`, { method: 'DELETE' });
}
