import { useNavigate } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { PatientForm } from '@/components/patients/PatientForm';

export default function NewPatient() {
  const navigate = useNavigate();

  return (
    <div className="mx-auto max-w-lg space-y-6">
      <h1 className="text-2xl font-bold">Novo Paciente</h1>
      <Card>
        <CardHeader>
          <CardTitle>Dados do Paciente</CardTitle>
        </CardHeader>
        <CardContent>
          <PatientForm onSuccess={() => navigate('/patients')} />
        </CardContent>
      </Card>
    </div>
  );
}
