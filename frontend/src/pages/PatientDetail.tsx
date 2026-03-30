import { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { Plus, Pencil } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Skeleton } from '@/components/ui/skeleton';
import { PatientForm } from '@/components/patients/PatientForm';
import { AppointmentTable } from '@/components/appointments/AppointmentTable';
import { PermissionGate } from '@/components/auth/PermissionGate';
import { fetchPatient } from '@/api/patients';
import { fetchAppointments } from '@/api/appointments';
import { patientKeys, appointmentKeys } from '@/constants/query-keys';
import { GENDER_LABELS } from '@/constants/patient-enums';

export default function PatientDetail() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [editOpen, setEditOpen] = useState(false);

  const { data: patient, isLoading } = useQuery({
    queryKey: patientKeys.detail(id!),
    queryFn: () => fetchPatient(id!),
    enabled: !!id,
  });

  const { data: appointments, isLoading: apptLoading } = useQuery({
    queryKey: appointmentKeys.list({ patientId: id, limit: 100, page: 1 }),
    queryFn: () => fetchAppointments({ patientId: id, limit: 100, page: 1 }),
    enabled: !!id,
  });

  if (isLoading) {
    return (
      <div className="space-y-4">
        <Skeleton className="h-8 w-48" />
        <Skeleton className="h-32 w-full" />
      </div>
    );
  }

  if (!patient) {
    return <p className="text-muted-foreground">Paciente não encontrado.</p>;
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">{patient.name}</h1>
        <div className="flex gap-2">
          <PermissionGate permission="patients:write">
            <Button variant="outline" onClick={() => setEditOpen(true)}>
              <Pencil className="mr-2 h-4 w-4" /> Editar
            </Button>
          </PermissionGate>
          <PermissionGate permission="appointments:write">
            <Button onClick={() => navigate(`/appointments/new?patientId=${id}`)}>
              <Plus className="mr-2 h-4 w-4" /> Novo Atendimento
            </Button>
          </PermissionGate>
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="text-base">Informações</CardTitle>
        </CardHeader>
        <CardContent className="grid gap-2 text-sm sm:grid-cols-2">
          <div><span className="font-medium text-muted-foreground">Telefone:</span> {patient.phone}</div>
          {patient.secondaryPhone && <div><span className="font-medium text-muted-foreground">Tel. Secundário:</span> {patient.secondaryPhone}</div>}
          {patient.email && <div><span className="font-medium text-muted-foreground">E-mail:</span> {patient.email}</div>}
          {patient.cpf && <div><span className="font-medium text-muted-foreground">CPF:</span> {patient.cpf}</div>}
          {patient.dateOfBirth && <div><span className="font-medium text-muted-foreground">Data de Nascimento:</span> {new Date(patient.dateOfBirth).toLocaleDateString('pt-BR')}</div>}
          {patient.gender && <div><span className="font-medium text-muted-foreground">Gênero:</span> {GENDER_LABELS[patient.gender]}</div>}
          {patient.healthInsurance && <div><span className="font-medium text-muted-foreground">Convênio:</span> {patient.healthInsurance}</div>}
          {patient.healthInsuranceNumber && <div><span className="font-medium text-muted-foreground">Nº Plano:</span> {patient.healthInsuranceNumber}</div>}
          {patient.address && (
            <div className="sm:col-span-2">
              <span className="font-medium text-muted-foreground">Endereço:</span>{' '}
              {[patient.address.street, patient.address.number, patient.address.complement, patient.address.neighborhood, patient.address.city, patient.address.state, patient.address.zipCode].filter(Boolean).join(', ')}
            </div>
          )}
          {patient.notes && (
            <div className="sm:col-span-2">
              <span className="font-medium text-muted-foreground">Observações:</span> {patient.notes}
            </div>
          )}
          <div><span className="font-medium text-muted-foreground">Cadastrado em:</span> {new Date(patient.createdAt).toLocaleDateString('pt-BR')}</div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="text-base">Atendimentos</CardTitle>
        </CardHeader>
        <CardContent className="p-0">
          <AppointmentTable appointments={appointments?.data} isLoading={apptLoading} emptyMessage="Nenhum atendimento para este paciente" />
        </CardContent>
      </Card>

      <Dialog open={editOpen} onOpenChange={setEditOpen}>
        <DialogContent className="max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Editar Paciente</DialogTitle>
          </DialogHeader>
          <PatientForm patient={patient} onSuccess={() => setEditOpen(false)} />
        </DialogContent>
      </Dialog>
    </div>
  );
}
