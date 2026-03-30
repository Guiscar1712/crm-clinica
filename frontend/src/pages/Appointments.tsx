import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { Plus, ChevronLeft, ChevronRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { AppointmentTable } from '@/components/appointments/AppointmentTable';
import { fetchAppointments } from '@/api/appointments';
import { fetchPatients } from '@/api/patients';
import { appointmentKeys, patientKeys } from '@/constants/query-keys';
import { STATUS_LABELS } from '@/constants/appointment-status';
import { PermissionGate } from '@/components/auth/PermissionGate';
import type { AppointmentStatus } from '@/types';

const tabs: Array<{ label: string; value: AppointmentStatus | 'ALL' }> = [
  { label: 'Todos', value: 'ALL' },
  { label: STATUS_LABELS.AGUARDANDO, value: 'AGUARDANDO' },
  { label: STATUS_LABELS.EM_ATENDIMENTO, value: 'EM_ATENDIMENTO' },
  { label: STATUS_LABELS.FINALIZADO, value: 'FINALIZADO' },
  { label: STATUS_LABELS.CANCELADO, value: 'CANCELADO' },
];

export default function Appointments() {
  const navigate = useNavigate();
  const [statusFilter, setStatusFilter] = useState<AppointmentStatus | 'ALL'>('ALL');
  const [patientFilter, setPatientFilter] = useState<string>('ALL');
  const [page, setPage] = useState(1);

  const params = {
    page,
    limit: 10,
    ...(statusFilter !== 'ALL' && { status: statusFilter }),
    ...(patientFilter !== 'ALL' && { patientId: patientFilter }),
  };

  const { data, isLoading } = useQuery({
    queryKey: appointmentKeys.list(params),
    queryFn: () => fetchAppointments(params),
  });

  const { data: patients } = useQuery({
    queryKey: patientKeys.all,
    queryFn: fetchPatients,
  });

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">Atendimentos</h1>
        <PermissionGate permission="appointments:write">
          <Button onClick={() => navigate('/appointments/new')}>
            <Plus className="mr-2 h-4 w-4" /> Novo Atendimento
          </Button>
        </PermissionGate>
      </div>

      <div className="flex flex-wrap items-center gap-3">
        <div className="flex gap-1 rounded-lg border bg-card p-1">
          {tabs.map((tab) => (
            <button
              key={tab.value}
              onClick={() => { setStatusFilter(tab.value); setPage(1); }}
              className={`rounded-md px-3 py-1.5 text-sm font-medium transition-colors ${
                statusFilter === tab.value
                  ? 'bg-primary text-primary-foreground'
                  : 'text-muted-foreground hover:bg-muted'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        <Select value={patientFilter} onValueChange={(v) => { setPatientFilter(v); setPage(1); }}>
          <SelectTrigger className="w-[200px]">
            <SelectValue placeholder="Filtrar por paciente" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="ALL">Todos os pacientes</SelectItem>
            {patients?.map((p) => (
              <SelectItem key={p.id} value={p.id}>{p.name}</SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <Card>
        <CardContent className="p-0">
          <AppointmentTable appointments={data?.data} isLoading={isLoading} />
        </CardContent>
      </Card>

      {data && data.totalPages > 1 && (
        <div className="flex items-center justify-center gap-4">
          <Button variant="outline" size="sm" disabled={page <= 1} onClick={() => setPage(page - 1)}>
            <ChevronLeft className="mr-1 h-4 w-4" /> Anterior
          </Button>
          <span className="text-sm text-muted-foreground">
            Página {data.page} de {data.totalPages}
          </span>
          <Button variant="outline" size="sm" disabled={page >= data.totalPages} onClick={() => setPage(page + 1)}>
            Próxima <ChevronRight className="ml-1 h-4 w-4" />
          </Button>
        </div>
      )}
    </div>
  );
}
