import type { UserRole } from '../types';

export type Permission =
  | 'patients:read'
  | 'patients:write'
  | 'patients:delete'
  | 'appointments:read'
  | 'appointments:write'
  | 'appointments:manage'
  | 'appointments:notes'
  | 'users:read'
  | 'users:write'
  | 'tenant:manage';

export const ROLE_PERMISSIONS: Record<UserRole, Permission[]> = {
  SUPER_ADMIN: ['patients:read','patients:write','patients:delete','appointments:read','appointments:write','appointments:manage','appointments:notes','users:read','users:write','tenant:manage'],
  ADMIN:       ['patients:read','patients:write','patients:delete','appointments:read','appointments:write','appointments:manage','appointments:notes','users:read','users:write','tenant:manage'],
  MANAGER:     ['patients:read','patients:write','patients:delete','appointments:read','appointments:write','appointments:manage','appointments:notes','users:read'],
  ATTENDANT:   ['patients:read','patients:write','appointments:read','appointments:write','appointments:notes'],
  VIEWER:      ['patients:read','appointments:read'],
};
