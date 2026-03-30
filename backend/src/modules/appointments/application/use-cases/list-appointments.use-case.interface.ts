import { ListAppointmentsInput } from '../dtos/list-appointments.input';
import { PaginatedOutput } from '../../../../shared/types/pagination';
import { AppointmentOutput } from '../dtos/appointment.output';

export interface IListAppointmentsUseCase {
  execute(
    tenantId: string,
    input: ListAppointmentsInput,
  ): Promise<PaginatedOutput<AppointmentOutput>>;
}

export const LIST_APPOINTMENTS_USE_CASE = Symbol('IListAppointmentsUseCase');
