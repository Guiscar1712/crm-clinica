import { Inject, Injectable } from '@nestjs/common';
import { IDeleteAppointmentUseCase } from './delete-appointment.use-case.interface';
import {
  IAppointmentRepository,
  APPOINTMENT_REPOSITORY,
} from '../../domain/appointment.repository.interface';
import { NotFoundError } from '../../../../shared/errors/not-found.error';

@Injectable()
export class DeleteAppointmentUseCase implements IDeleteAppointmentUseCase {
  constructor(
    @Inject(APPOINTMENT_REPOSITORY)
    private readonly appointmentRepository: IAppointmentRepository,
  ) {}

  async execute(id: string, tenantId: string): Promise<void> {
    const appointment = await this.appointmentRepository.findById(id, tenantId);
    if (!appointment) {
      throw new NotFoundError('Appointment', id);
    }
    await this.appointmentRepository.delete(id, tenantId);
  }
}
