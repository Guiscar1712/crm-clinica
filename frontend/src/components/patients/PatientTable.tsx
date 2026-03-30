import { useState } from 'react';
import { Eye, Pencil, Trash2, Power } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Skeleton } from '@/components/ui/skeleton';
import { PatientForm } from './PatientForm';
import { PatientDeleteDialog } from './PatientDeleteDialog';
import { PermissionGate } from '@/components/auth/PermissionGate';
import type { Patient } from '@/types';

interface Props {
  patients: Patient[] | undefined;
  isLoading: boolean;
}

function maskCpf(cpf: string | null): string {
  if (!cpf) return '—';
  const digits = cpf.replace(/\D/g, '');
  if (digits.length !== 11) return cpf;
  return `***.${digits.slice(3, 6)}.***-**`;
}

export function PatientTable({ patients, isLoading }: Props) {
  const navigate = useNavigate();
  const [editPatient, setEditPatient] = useState<Patient | null>(null);
  const [deleteTarget, setDeleteTarget] = useState<Patient | null>(null);

  if (isLoading) {
    return (
      <div className="space-y-3 p-4">
        {Array.from({ length: 5 }).map((_, i) => (
          <Skeleton key={i} className="h-12 w-full" />
        ))}
      </div>
    );
  }

  if (!patients || patients.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-16 text-muted-foreground">
        <p className="text-lg font-medium">Nenhum paciente encontrado</p>
        <p className="text-sm">Crie um novo paciente para começar.</p>
        <Button className="mt-4" onClick={() => navigate('/patients/new')}>
          Novo Paciente
        </Button>
      </div>
    );
  }

  return (
    <>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Nome</TableHead>
            <TableHead>CPF</TableHead>
            <TableHead>Telefone</TableHead>
            <TableHead>Convênio</TableHead>
            <TableHead>Status</TableHead>
            <TableHead className="text-right">Ações</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {patients.map((p) => (
            <TableRow key={p.id} className={!p.isActive ? 'opacity-50' : ''}>
              <TableCell className="font-medium">{p.name}</TableCell>
              <TableCell className="text-sm text-muted-foreground">{maskCpf(p.cpf)}</TableCell>
              <TableCell>{p.phone}</TableCell>
              <TableCell className="text-sm">{p.healthInsurance ?? '—'}</TableCell>
              <TableCell>
                {!p.isActive && (
                  <span className="inline-flex items-center rounded-full bg-red-100 px-2.5 py-0.5 text-xs font-medium text-red-700">
                    Inativo
                  </span>
                )}
              </TableCell>
              <TableCell className="text-right">
                <div className="flex justify-end gap-1">
                  <Button size="icon" variant="ghost" onClick={() => navigate(`/patients/${p.id}`)} title="Ver">
                    <Eye className="h-4 w-4" />
                  </Button>
                  <PermissionGate permission="patients:write">
                    <Button size="icon" variant="ghost" onClick={() => setEditPatient(p)} title="Editar">
                      <Pencil className="h-4 w-4" />
                    </Button>
                  </PermissionGate>
                  <PermissionGate permission="patients:delete">
                    <Button size="icon" variant="ghost" onClick={() => setDeleteTarget(p)} title="Excluir">
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </PermissionGate>
                </div>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>

      <Dialog open={!!editPatient} onOpenChange={(v) => !v && setEditPatient(null)}>
        <DialogContent className="max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Editar Paciente</DialogTitle>
          </DialogHeader>
          {editPatient && <PatientForm patient={editPatient} onSuccess={() => setEditPatient(null)} />}
        </DialogContent>
      </Dialog>

      {deleteTarget && (
        <PatientDeleteDialog
          id={deleteTarget.id}
          name={deleteTarget.name}
          open={!!deleteTarget}
          onClose={() => setDeleteTarget(null)}
        />
      )}
    </>
  );
}
