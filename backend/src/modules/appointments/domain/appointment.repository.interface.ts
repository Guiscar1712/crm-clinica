import { Appointment } from './appointment.entity';
import { AppointmentStatus } from './appointment-status.enum';
import { AppointmentType } from './appointment-type.enum';
import { AppointmentPriority } from './appointment-priority.enum';
import { PaginationInput, PaginatedOutput } from '../../../shared/types/pagination';

export interface ListAppointmentsFilter {
  tenantId: string;
  status?: AppointmentStatus;
  patientId?: string;
  assignedUserId?: string;
  type?: AppointmentType;
  priority?: AppointmentPriority;
  scheduledFrom?: Date;
  scheduledTo?: Date;
}

export interface IAppointmentRepository {
  save(appointment: Appointment): Promise<Appointment>;
  findById(id: string, tenantId: string): Promise<Appointment | null>;
  findAll(
    filter: ListAppointmentsFilter,
    pagination: PaginationInput,
  ): Promise<PaginatedOutput<Appointment>>;
  delete(id: string, tenantId: string): Promise<void>;
}

export const APPOINTMENT_REPOSITORY = Symbol('IAppointmentRepository');
