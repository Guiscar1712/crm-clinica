import { IsIn } from 'class-validator';
import { AppointmentStatus } from '../../domain/appointment-status.enum';

export class AdvanceStatusInput {
  @IsIn([AppointmentStatus.EM_ATENDIMENTO, AppointmentStatus.FINALIZADO])
  status: AppointmentStatus.EM_ATENDIMENTO | AppointmentStatus.FINALIZADO;
}
