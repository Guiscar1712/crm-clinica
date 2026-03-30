import { cn } from '@/lib/utils';
import { STATUS_LABELS } from '@/constants/appointment-status';
import type { AppointmentStatus } from '@/types';

const statusStyles: Record<AppointmentStatus, string> = {
  AGUARDANDO: 'bg-status-aguardando-bg text-status-aguardando-text',
  EM_ATENDIMENTO: 'bg-status-em-atendimento-bg text-status-em-atendimento-text',
  FINALIZADO: 'bg-status-finalizado-bg text-status-finalizado-text',
  CANCELADO: 'bg-red-100 text-red-700',
};

interface Props {
  status: AppointmentStatus;
}

export function AppointmentStatusBadge({ status }: Props) {
  return (
    <span className={cn('inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium', statusStyles[status])}>
      {STATUS_LABELS[status]}
    </span>
  );
}
