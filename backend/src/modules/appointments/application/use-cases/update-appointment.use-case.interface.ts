import { UpdateAppointmentInput } from '../dtos/update-appointment.input';
import { AppointmentOutput } from '../dtos/appointment.output';

export interface IUpdateAppointmentUseCase {
  execute(
    id: string,
    tenantId: string,
    input: UpdateAppointmentInput,
  ): Promise<AppointmentOutput>;
}

export const UPDATE_APPOINTMENT_USE_CASE = Symbol('IUpdateAppointmentUseCase');
