import type { ReactNode } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import type { Permission } from '@/constants/permissions';

interface Props {
  permission: Permission;
  fallback?: ReactNode;
  children: ReactNode;
}

export function PermissionGate({ permission, fallback = null, children }: Props) {
  const { canAccess } = useAuth();

  if (!canAccess(permission)) {
    return <>{fallback}</>;
  }

  return <>{children}</>;
}
