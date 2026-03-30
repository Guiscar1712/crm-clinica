import { Navigate, Outlet } from 'react-router-dom';
import { Loader2 } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import type { Permission } from '@/constants/permissions';

interface Props {
  requiredPermission?: Permission;
}

export function PrivateRoute({ requiredPermission }: Props) {
  const { isAuthenticated, isLoading, canAccess } = useAuth();

  if (isLoading) {
    return (
      <div className="flex h-screen items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  if (requiredPermission && !canAccess(requiredPermission)) {
    return (
      <div className="flex h-screen flex-col items-center justify-center gap-4">
        <h1 className="text-4xl font-bold text-foreground">403</h1>
        <p className="text-lg text-muted-foreground">Você não tem permissão para acessar esta página.</p>
        <a href="/" className="text-primary underline">Voltar ao início</a>
      </div>
    );
  }

  return <Outlet />;
}
