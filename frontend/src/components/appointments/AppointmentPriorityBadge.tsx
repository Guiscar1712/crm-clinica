import { cn } from '@/lib/utils';
import { PRIORITY_LABELS, PRIORITY_BADGE_CLASSES } from '@/constants/appointment-priority';
import type { AppointmentPriority } from '@/types';

interface Props {
  priority: AppointmentPriority;
}

export function AppointmentPriorityBadge({ priority }: Props) {
  return (
    <span className={cn('inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium', PRIORITY_BADGE_CLASSES[priority])}>
      {PRIORITY_LABELS[priority]}
    </span>
  );
}
