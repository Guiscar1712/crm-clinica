import { useState } from 'react';
import { Pencil, Trash2, XCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Skeleton } from '@/components/ui/skeleton';
import { AppointmentStatusBadge } from './AppointmentStatusBadge';
import { AppointmentPriorityBadge } from './AppointmentPriorityBadge';
import { AppointmentTypeBadge } from './AppointmentTypeBadge';
import { AppointmentStatusButton } from './AppointmentStatusButton';
import { AppointmentEditDialog } from './AppointmentEditDialog';
import { AppointmentDeleteDialog } from './AppointmentDeleteDialog';
import { CancelAppointmentDialog } from './CancelAppointmentDialog';
import { PermissionGate } from '@/components/auth/PermissionGate';
import type { Appointment } from '@/types';

interface Props {
  appointments: Appointment[] | undefined;
  isLoading: boolean;
  emptyMessage?: string;
}

export function AppointmentTable({ appointments, isLoading, emptyMessage }: Props) {
  const [editTarget, setEditTarget] = useState<Appointment | null>(null);
  const [deleteTarget, setDeleteTarget] = useState<Appointment | null>(null);
  const [cancelTarget, setCancelTarget] = useState<Appointment | null>(null);

  if (isLoading) {
    return (
      <div className="space-y-3 p-4">
        {Array.from({ length: 5 }).map((_, i) => (
          <Skeleton key={i} className="h-12 w-full" />
        ))}
      </div>
    );
  }

  if (!appointments || appointments.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-16 text-muted-foreground">
        <p className="text-lg font-medium">{emptyMessage ?? 'Nenhum atendimento encontrado'}</p>
      </div>
    );
  }

  const truncate = (text: string, max: number) => (text.length > max ? text.slice(0, max) + '…' : text);

  return (
    <>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Paciente</TableHead>
            <TableHead>Tipo</TableHead>
            <TableHead>Prioridade</TableHead>
            <TableHead>Descrição</TableHead>
            <TableHead>Status</TableHead>
            <TableHead>Agendado</TableHead>
            <TableHead>Data</TableHead>
            <TableHead className="text-right">Ações</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {appointments.map((a) => (
            <TableRow key={a.id} className={a.status === 'CANCELADO' ? 'opacity-50' : ''}>
              <TableCell className="font-medium">{a.patientName ?? '—'}</TableCell>
              <TableCell><AppointmentTypeBadge type={a.type} /></TableCell>
              <TableCell><AppointmentPriorityBadge priority={a.priority} /></TableCell>
              <TableCell className="max-w-[200px]">{truncate(a.description, 60)}</TableCell>
              <TableCell><AppointmentStatusBadge status={a.status} /></TableCell>
              <TableCell className="text-sm text-muted-foreground">
                {a.scheduledAt ? new Date(a.scheduledAt).toLocaleDateString('pt-BR') : '—'}
              </TableCell>
              <TableCell className="text-sm text-muted-foreground">
                {new Date(a.createdAt).toLocaleDateString('pt-BR')}
              </TableCell>
              <TableCell className="text-right">
                <div className="flex items-center justify-end gap-1">
                  {a.status !== 'CANCELADO' && (
                    <AppointmentStatusButton id={a.id} status={a.status} />
                  )}
                  <PermissionGate permission="appointments:manage">
                    <Button size="icon" variant="ghost" onClick={() => setEditTarget(a)} title="Editar">
                      <Pencil className="h-4 w-4" />
                    </Button>
                    {a.status !== 'FINALIZADO' && a.status !== 'CANCELADO' && (
                      <Button size="icon" variant="ghost" onClick={() => setCancelTarget(a)} title="Cancelar">
                        <XCircle className="h-4 w-4" />
                      </Button>
                    )}
                    <Button size="icon" variant="ghost" onClick={() => setDeleteTarget(a)} title="Excluir">
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </PermissionGate>
                </div>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>

      {editTarget && (
        <AppointmentEditDialog
          id={editTarget.id}
          description={editTarget.description}
          open={!!editTarget}
          onClose={() => setEditTarget(null)}
        />
      )}

      {deleteTarget && (
        <AppointmentDeleteDialog
          id={deleteTarget.id}
          name={deleteTarget.patientName ?? 'este atendimento'}
          open={!!deleteTarget}
          onClose={() => setDeleteTarget(null)}
        />
      )}

      {cancelTarget && (
        <CancelAppointmentDialog
          appointmentId={cancelTarget.id}
          open={!!cancelTarget}
          onClose={() => setCancelTarget(null)}
        />
      )}
    </>
  );
}
