import { CreateAppointmentInput } from '../dtos/create-appointment.input';
import { AppointmentOutput } from '../dtos/appointment.output';

export interface ICreateAppointmentUseCase {
  execute(input: CreateAppointmentInput, tenantId: string): Promise<AppointmentOutput>;
}

export const CREATE_APPOINTMENT_USE_CASE = Symbol('ICreateAppointmentUseCase');
