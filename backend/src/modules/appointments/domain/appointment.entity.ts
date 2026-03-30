import { AppointmentStatus } from './appointment-status.enum';
import { AppointmentType } from './appointment-type.enum';
import { AppointmentPriority } from './appointment-priority.enum';
import { AppointmentNote } from './appointment-note.value-object';

export interface CreateAppointmentProps {
  patientId: string;
  assignedUserId: string | null;
  type: AppointmentType;
  priority: AppointmentPriority;
  description: string;
  scheduledAt: Date | null;
}

export interface UpdateAppointmentProps {
  assignedUserId?: string | null;
  type?: AppointmentType;
  priority?: AppointmentPriority;
  description?: string;
  scheduledAt?: Date | null;
}

export class Appointment {
  constructor(
    public readonly id: string,
    public readonly tenantId: string,
    public readonly patientId: string,
    public assignedUserId: string | null,
    public type: AppointmentType,
    public priority: AppointmentPriority,
    public description: string,
    public status: AppointmentStatus,
    public scheduledAt: Date | null,
    public startedAt: Date | null,
    public finishedAt: Date | null,
    public cancelledAt: Date | null,
    public cancellationReason: string | null,
    public notes: AppointmentNote[],
    public readonly createdAt: Date,
    public updatedAt: Date,
  ) {}

  static create(tenantId: string, props: CreateAppointmentProps): Appointment {
    const now = new Date();
    return new Appointment(
      crypto.randomUUID(),
      tenantId,
      props.patientId,
      props.assignedUserId,
      props.type,
      props.priority,
      props.description,
      AppointmentStatus.AGUARDANDO,
      props.scheduledAt,
      null,
      null,
      null,
      null,
      [],
      now,
      now,
    );
  }

  updateDetails(props: UpdateAppointmentProps): void {
    if (props.assignedUserId !== undefined) this.assignedUserId = props.assignedUserId;
    if (props.type !== undefined) this.type = props.type;
    if (props.priority !== undefined) this.priority = props.priority;
    if (props.description !== undefined) this.description = props.description;
    if (props.scheduledAt !== undefined) this.scheduledAt = props.scheduledAt;
    this.updatedAt = new Date();
  }

  private static nextStatus(current: AppointmentStatus): AppointmentStatus | null {
    const transitions: Record<AppointmentStatus, AppointmentStatus | null> = {
      [AppointmentStatus.AGUARDANDO]: AppointmentStatus.EM_ATENDIMENTO,
      [AppointmentStatus.EM_ATENDIMENTO]: AppointmentStatus.FINALIZADO,
      [AppointmentStatus.FINALIZADO]: null,
      [AppointmentStatus.CANCELADO]: null,
    };
    return transitions[current];
  }

  advanceStatus(requested: AppointmentStatus): void {
    if (this.status === AppointmentStatus.CANCELADO) {
      throw new Error('Cannot advance a cancelled appointment.');
    }
    const next = Appointment.nextStatus(this.status);
    if (next === null) {
      throw new Error(`Appointment is already ${this.status} and cannot be advanced.`);
    }
    if (requested !== next) {
      throw new Error(
        `Invalid status transition from ${this.status} to ${requested}. Expected ${next}.`,
      );
    }
    this.status = requested;
    if (requested === AppointmentStatus.EM_ATENDIMENTO) {
      this.startedAt = new Date();
    }
    if (requested === AppointmentStatus.FINALIZADO) {
      this.finishedAt = new Date();
    }
    this.updatedAt = new Date();
  }

  cancel(reason: string): void {
    if (this.status === AppointmentStatus.FINALIZADO) {
      throw new Error('Cannot cancel a finalized appointment.');
    }
    if (this.status === AppointmentStatus.CANCELADO) {
      throw new Error('Appointment is already cancelled.');
    }
    this.status = AppointmentStatus.CANCELADO;
    this.cancelledAt = new Date();
    this.cancellationReason = reason;
    this.updatedAt = new Date();
  }

  addNote(authorId: string, content: string): void {
    this.notes.push(AppointmentNote.create(authorId, content));
    this.updatedAt = new Date();
  }

  get durationMinutes(): number | null {
    if (!this.startedAt || !this.finishedAt) return null;
    return Math.round((this.finishedAt.getTime() - this.startedAt.getTime()) / 60000);
  }
}
