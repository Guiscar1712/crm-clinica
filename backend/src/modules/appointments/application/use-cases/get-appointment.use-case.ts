import { Inject, Injectable } from '@nestjs/common';
import { IGetAppointmentUseCase } from './get-appointment.use-case.interface';
import { AppointmentOutput, AppointmentOutputContext } from '../dtos/appointment.output';
import {
  IAppointmentRepository,
  APPOINTMENT_REPOSITORY,
} from '../../domain/appointment.repository.interface';
import {
  IPatientRepository,
  PATIENT_REPOSITORY,
} from '../../../patients/domain/patient.repository.interface';
import { IUserRepository, USER_REPOSITORY } from '../../../users/domain/user.repository.interface';
import { NotFoundError } from '../../../../shared/errors/not-found.error';
import { buildNoteAuthorMap } from '../utils/appointment-enrichment.util';

@Injectable()
export class GetAppointmentUseCase implements IGetAppointmentUseCase {
  constructor(
    @Inject(APPOINTMENT_REPOSITORY)
    private readonly appointmentRepository: IAppointmentRepository,
    @Inject(PATIENT_REPOSITORY)
    private readonly patientRepository: IPatientRepository,
    @Inject(USER_REPOSITORY)
    private readonly userRepository: IUserRepository,
  ) {}

  async execute(id: string, tenantId: string): Promise<AppointmentOutput> {
    const appointment = await this.appointmentRepository.findById(id, tenantId);
    if (!appointment) {
      throw new NotFoundError('Appointment', id);
    }
    const patient = await this.patientRepository.findById(appointment.patientId, tenantId);
    const ctx: AppointmentOutputContext = {
      patientName: patient?.name,
      noteAuthorNames: await buildNoteAuthorMap(this.userRepository, appointment.notes),
    };
    if (appointment.assignedUserId) {
      const u = await this.userRepository.findById(appointment.assignedUserId);
      ctx.assignedUserName = u?.name;
    }
    return AppointmentOutput.fromDomain(appointment, ctx);
  }
}
