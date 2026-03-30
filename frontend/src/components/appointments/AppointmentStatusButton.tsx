import { useMutation, useQueryClient } from '@tanstack/react-query';
import { Loader2 } from 'lucide-react';
import { toast } from 'sonner';
import { Button } from '@/components/ui/button';
import { advanceAppointmentStatus } from '@/api/appointments';
import { ADVANCE_BUTTON_LABELS, STATUS_TRANSITIONS } from '@/constants/appointment-status';
import { appointmentKeys } from '@/constants/query-keys';
import { PermissionGate } from '@/components/auth/PermissionGate';
import type { AppointmentStatus } from '@/types';

interface Props {
  id: string;
  status: AppointmentStatus;
}

export function AppointmentStatusButton({ id, status }: Props) {
  const queryClient = useQueryClient();
  const nextStatus = STATUS_TRANSITIONS[status];

  const mutation = useMutation({
    mutationFn: () => advanceAppointmentStatus(id, nextStatus!),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: appointmentKeys.all });
      toast.success('Status atualizado com sucesso');
    },
    onError: (error: Error) => {
      toast.error(error.message);
    },
  });

  if (!nextStatus) return null;

  return (
    <PermissionGate permission="appointments:write">
      <Button size="sm" variant="outline" onClick={() => mutation.mutate()} disabled={mutation.isPending}>
        {mutation.isPending && <Loader2 className="mr-1 h-3 w-3 animate-spin" />}
        {ADVANCE_BUTTON_LABELS[status]}
      </Button>
    </PermissionGate>
  );
}
