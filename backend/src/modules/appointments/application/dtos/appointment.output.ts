import { Appointment } from '../../domain/appointment.entity';
import { AppointmentStatus } from '../../domain/appointment-status.enum';
import { AppointmentType } from '../../domain/appointment-type.enum';
import { AppointmentPriority } from '../../domain/appointment-priority.enum';

export class AppointmentNoteOutput {
  id: string;
  authorId: string;
  authorName?: string;
  content: string;
  createdAt: Date;
}

export interface AppointmentOutputContext {
  patientName?: string;
  assignedUserName?: string;
  noteAuthorNames?: Map<string, string>;
}

export class AppointmentOutput {
  id: string;
  tenantId: string;
  patientId: string;
  patientName?: string;
  assignedUserId: string | null;
  assignedUserName?: string;
  type: AppointmentType;
  priority: AppointmentPriority;
  description: string;
  status: AppointmentStatus;
  scheduledAt: Date | null;
  startedAt: Date | null;
  finishedAt: Date | null;
  cancelledAt: Date | null;
  cancellationReason: string | null;
  durationMinutes: number | null;
  notes: AppointmentNoteOutput[];
  createdAt: Date;
  updatedAt: Date;

  static fromDomain(
    appointment: Appointment,
    ctx: AppointmentOutputContext = {},
  ): AppointmentOutput {
    const o = new AppointmentOutput();
    o.id = appointment.id;
    o.tenantId = appointment.tenantId;
    o.patientId = appointment.patientId;
    o.patientName = ctx.patientName;
    o.assignedUserId = appointment.assignedUserId;
    o.assignedUserName = ctx.assignedUserName;
    o.type = appointment.type;
    o.priority = appointment.priority;
    o.description = appointment.description;
    o.status = appointment.status;
    o.scheduledAt = appointment.scheduledAt;
    o.startedAt = appointment.startedAt;
    o.finishedAt = appointment.finishedAt;
    o.cancelledAt = appointment.cancelledAt;
    o.cancellationReason = appointment.cancellationReason;
    o.durationMinutes = appointment.durationMinutes;
    o.notes = appointment.notes.map((n) => ({
      id: n.id,
      authorId: n.authorId,
      authorName: ctx.noteAuthorNames?.get(n.authorId),
      content: n.content,
      createdAt: n.createdAt,
    }));
    o.createdAt = appointment.createdAt;
    o.updatedAt = appointment.updatedAt;
    return o;
  }
}
