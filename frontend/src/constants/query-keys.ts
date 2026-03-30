import type { ListAppointmentsParams } from '../types';

export const patientKeys = {
  all: ['patients'] as const,
  detail: (id: string) => ['patients', id] as const,
};

export const appointmentKeys = {
  all: ['appointments'] as const,
  list: (params: ListAppointmentsParams) => ['appointments', 'list', params] as const,
  detail: (id: string) => ['appointments', id] as const,
};

export const userKeys = {
  all: ['users'] as const,
  list: () => ['users', 'list'] as const,
  detail: (id: string) => ['users', id] as const,
};

export const tenantKeys = {
  detail: (id: string) => ['tenants', id] as const,
};
