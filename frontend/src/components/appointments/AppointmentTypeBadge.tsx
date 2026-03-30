import { TYPE_LABELS } from '@/constants/appointment-type';
import type { AppointmentType } from '@/types';

interface Props {
  type: AppointmentType;
}

export function AppointmentTypeBadge({ type }: Props) {
  return (
    <span className="inline-flex items-center rounded-full bg-muted px-2.5 py-0.5 text-xs font-medium text-muted-foreground">
      {TYPE_LABELS[type]}
    </span>
  );
}
