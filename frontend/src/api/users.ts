import type { User, UserRole, PaginatedResponse } from '../types';
import { apiFetch } from './client';

const LIST_LIMIT = 100;

export async function listUsers(): Promise<User[]> {
  const res = await apiFetch<PaginatedResponse<User>>(`/users?page=1&limit=${LIST_LIMIT}`);
  return res.data;
}

export async function createUser(data: {
  name: string;
  email: string;
  password: string;
  role: UserRole;
}): Promise<User> {
  return apiFetch<User>('/users', {
    method: 'POST',
    body: JSON.stringify(data),
  });
}

export async function updateUser(
  id: string,
  data: Partial<{ name: string; email: string }>,
): Promise<User> {
  return apiFetch<User>(`/users/${id}`, {
    method: 'PATCH',
    body: JSON.stringify(data),
  });
}

export async function changeRole(id: string, role: UserRole): Promise<User> {
  return apiFetch<User>(`/users/${id}/role`, {
    method: 'PATCH',
    body: JSON.stringify({ role }),
  });
}

export async function deactivateUser(id: string): Promise<void> {
  await apiFetch<void>(`/users/${id}`, { method: 'DELETE' });
}
