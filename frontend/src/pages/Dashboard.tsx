import { useQuery } from '@tanstack/react-query';
import { Users, Calendar, Clock, Stethoscope } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { AppointmentTable } from '@/components/appointments/AppointmentTable';
import { fetchPatients } from '@/api/patients';
import { fetchAppointments } from '@/api/appointments';
import { patientKeys, appointmentKeys } from '@/constants/query-keys';

export default function Dashboard() {
  const { data: patients } = useQuery({
    queryKey: patientKeys.all,
    queryFn: fetchPatients,
  });

  const { data: allAppointments } = useQuery({
    queryKey: appointmentKeys.list({}),
    queryFn: () => fetchAppointments({}),
  });

  const { data: aguardando } = useQuery({
    queryKey: appointmentKeys.list({ status: 'AGUARDANDO' }),
    queryFn: () => fetchAppointments({ status: 'AGUARDANDO' }),
  });

  const { data: emAtendimento } = useQuery({
    queryKey: appointmentKeys.list({ status: 'EM_ATENDIMENTO' }),
    queryFn: () => fetchAppointments({ status: 'EM_ATENDIMENTO' }),
  });

  const { data: recent, isLoading: recentLoading } = useQuery({
    queryKey: appointmentKeys.list({ limit: 5 }),
    queryFn: () => fetchAppointments({ limit: 5 }),
  });

  const cards = [
    { label: 'Total de Pacientes', value: patients?.length ?? 0, icon: Users },
    { label: 'Atendimentos Hoje', value: allAppointments?.total ?? 0, icon: Calendar },
    { label: 'Aguardando', value: aguardando?.total ?? 0, icon: Clock },
    { label: 'Em Atendimento', value: emAtendimento?.total ?? 0, icon: Stethoscope },
  ];

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold">Dashboard</h1>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {cards.map((c) => (
          <Card key={c.label}>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">{c.label}</CardTitle>
              <c.icon className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{c.value}</div>
            </CardContent>
          </Card>
        ))}
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="text-base">Atendimentos Recentes</CardTitle>
        </CardHeader>
        <CardContent>
          <AppointmentTable appointments={recent?.data} isLoading={recentLoading} />
        </CardContent>
      </Card>
    </div>
  );
}
