import { useNavigate, useSearchParams } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { AppointmentForm } from '@/components/appointments/AppointmentForm';

export default function NewAppointment() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const patientId = searchParams.get('patientId') ?? undefined;

  return (
    <div className="mx-auto max-w-lg space-y-6">
      <h1 className="text-2xl font-bold">Novo Atendimento</h1>
      <Card>
        <CardHeader>
          <CardTitle>Dados do Atendimento</CardTitle>
        </CardHeader>
        <CardContent>
          <AppointmentForm defaultPatientId={patientId} onSuccess={() => navigate('/appointments')} />
        </CardContent>
      </Card>
    </div>
  );
}
