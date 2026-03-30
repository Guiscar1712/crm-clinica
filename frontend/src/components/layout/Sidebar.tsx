import { NavLink, useLocation } from 'react-router-dom';
import { LayoutDashboard, Users, Calendar, Settings, X, Menu, LogOut } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { ROLE_LABELS } from '@/constants/user-roles';

export function Sidebar() {
  const location = useLocation();
  const [mobileOpen, setMobileOpen] = useState(false);
  const { user, logout, canAccess } = useAuth();

  const links = [
    { to: '/', label: 'Dashboard', icon: LayoutDashboard, show: true },
    { to: '/patients', label: 'Pacientes', icon: Users, show: true },
    { to: '/appointments', label: 'Atendimentos', icon: Calendar, show: true },
    { to: '/users', label: 'Usuários', icon: Users, show: canAccess('users:read') },
    { to: '/settings', label: 'Configurações', icon: Settings, show: canAccess('tenant:manage') },
  ];

  const nav = (
    <nav className="flex flex-1 flex-col gap-1 px-3 py-4">
      {links.filter((l) => l.show).map((link) => {
        const active = link.to === '/' ? location.pathname === '/' : location.pathname.startsWith(link.to);
        return (
          <NavLink
            key={link.to}
            to={link.to}
            onClick={() => setMobileOpen(false)}
            className={cn(
              'flex items-center gap-3 rounded-md px-3 py-2.5 text-sm font-medium transition-colors',
              active
                ? 'bg-sidebar-accent text-sidebar-accent-foreground'
                : 'text-sidebar-foreground/70 hover:bg-sidebar-accent/50 hover:text-sidebar-foreground'
            )}
          >
            <link.icon className="h-4 w-4" />
            <span>{link.label}</span>
          </NavLink>
        );
      })}
    </nav>
  );

  return (
    <>
      <button
        onClick={() => setMobileOpen(true)}
        className="fixed left-4 top-4 z-50 rounded-md bg-sidebar p-2 text-sidebar-foreground md:hidden"
        aria-label="Abrir menu"
      >
        <Menu className="h-5 w-5" />
      </button>

      {mobileOpen && (
        <div className="fixed inset-0 z-40 bg-foreground/50 md:hidden" onClick={() => setMobileOpen(false)} />
      )}

      <aside
        className={cn(
          'fixed inset-y-0 left-0 z-50 flex w-60 flex-col bg-sidebar transition-transform md:static md:translate-x-0',
          mobileOpen ? 'translate-x-0' : '-translate-x-full'
        )}
      >
        <div className="flex h-14 items-center justify-between border-b border-sidebar-border px-4">
          <span className="text-base font-bold text-sidebar-foreground">Mini CRM</span>
          <button onClick={() => setMobileOpen(false)} className="text-sidebar-foreground md:hidden">
            <X className="h-5 w-5" />
          </button>
        </div>

        {nav}

        {user && (
          <div className="border-t border-sidebar-border px-3 py-3">
            <div className="mb-2">
              <p className="truncate text-sm font-medium text-sidebar-foreground">{user.name}</p>
              <p className="text-xs text-sidebar-foreground/60">{ROLE_LABELS[user.role]}</p>
            </div>
            <button
              onClick={logout}
              className="flex w-full items-center gap-2 rounded-md px-3 py-2 text-sm text-sidebar-foreground/70 hover:bg-sidebar-accent/50 hover:text-sidebar-foreground transition-colors"
            >
              <LogOut className="h-4 w-4" />
              <span>Sair</span>
            </button>
          </div>
        )}
      </aside>
    </>
  );
}
