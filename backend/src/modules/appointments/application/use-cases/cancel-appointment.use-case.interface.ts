import { CancelAppointmentInput } from '../dtos/cancel-appointment.input';
import { AppointmentOutput } from '../dtos/appointment.output';

export interface ICancelAppointmentUseCase {
  execute(
    id: string,
    tenantId: string,
    input: CancelAppointmentInput,
  ): Promise<AppointmentOutput>;
}

export const CANCEL_APPOINTMENT_USE_CASE = Symbol('ICancelAppointmentUseCase');
