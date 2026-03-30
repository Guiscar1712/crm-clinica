import { AppointmentOutput } from '../dtos/appointment.output';

export interface IGetAppointmentUseCase {
  execute(id: string, tenantId: string): Promise<AppointmentOutput>;
}

export const GET_APPOINTMENT_USE_CASE = Symbol('IGetAppointmentUseCase');
