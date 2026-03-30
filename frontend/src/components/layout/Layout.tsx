import { Outlet, useLocation } from 'react-router-dom';
import { Sidebar } from './Sidebar';

const ROUTE_LABELS: Record<string, string> = {
  '/': 'Dashboard',
  '/patients': 'Pacientes',
  '/patients/new': 'Novo Paciente',
  '/appointments': 'Atendimentos',
  '/appointments/new': 'Novo Atendimento',
  '/users': 'Usuários',
  '/settings': 'Configurações',
};

function Breadcrumb() {
  const location = useLocation();
  const path = location.pathname;

  const segments: Array<{ label: string; path: string }> = [{ label: 'Início', path: '/' }];

  if (path !== '/') {
    const parts = path.split('/').filter(Boolean);
    let current = '';
    for (const part of parts) {
      current += `/${part}`;
      const label = ROUTE_LABELS[current];
      if (label) {
        segments.push({ label, path: current });
      } else {
        segments.push({ label: 'Detalhes', path: current });
      }
    }
  }

  return (
    <nav className="mb-4 text-sm text-muted-foreground">
      {segments.map((seg, i) => (
        <span key={seg.path}>
          {i > 0 && <span className="mx-1">/</span>}
          <span className={i === segments.length - 1 ? 'font-medium text-foreground' : ''}>
            {seg.label}
          </span>
        </span>
      ))}
    </nav>
  );
}

export function Layout() {
  return (
    <div className="flex min-h-screen w-full">
      <Sidebar />
      <main className="flex-1 bg-content-background p-4 md:p-8 md:pl-8">
        <Breadcrumb />
        <Outlet />
      </main>
    </div>
  );
}
