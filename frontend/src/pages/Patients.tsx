import { useQuery } from '@tanstack/react-query';
import { useNavigate } from 'react-router-dom';
import { Plus } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { PatientTable } from '@/components/patients/PatientTable';
import { fetchPatients } from '@/api/patients';
import { patientKeys } from '@/constants/query-keys';
import { PermissionGate } from '@/components/auth/PermissionGate';

export default function Patients() {
  const navigate = useNavigate();
  const { data, isLoading } = useQuery({
    queryKey: patientKeys.all,
    queryFn: fetchPatients,
  });

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">Pacientes</h1>
        <PermissionGate permission="patients:write">
          <Button onClick={() => navigate('/patients/new')}>
            <Plus className="mr-2 h-4 w-4" /> Novo Paciente
          </Button>
        </PermissionGate>
      </div>
      <Card>
        <CardContent className="p-0">
          <PatientTable patients={data} isLoading={isLoading} />
        </CardContent>
      </Card>
    </div>
  );
}
