import { AdvanceStatusInput } from '../dtos/advance-status.input';
import { AppointmentOutput } from '../dtos/appointment.output';

export interface IAdvanceStatusUseCase {
  execute(id: string, tenantId: string, input: AdvanceStatusInput): Promise<AppointmentOutput>;
}

export const ADVANCE_STATUS_USE_CASE = Symbol('IAdvanceStatusUseCase');
