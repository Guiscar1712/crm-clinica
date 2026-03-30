import type { Tenant } from '../types';
import { apiFetch } from './client';

export async function getTenant(id: string): Promise<Tenant> {
  return apiFetch<Tenant>(`/tenants/${id}`);
}

export async function createTenant(data: {
  name: string;
  slug: string;
  document?: string;
  email?: string;
  phone?: string;
  logoUrl?: string;
}): Promise<Tenant> {
  return apiFetch<Tenant>('/tenants', {
    method: 'POST',
    body: JSON.stringify(data),
  });
}

export async function updateTenant(
  id: string,
  data: Partial<{
    name: string;
    document: string | null;
    email: string | null;
    phone: string | null;
    logoUrl: string | null;
  }>,
): Promise<Tenant> {
  return apiFetch<Tenant>(`/tenants/${id}`, {
    method: 'PATCH',
    body: JSON.stringify(data),
  });
}
