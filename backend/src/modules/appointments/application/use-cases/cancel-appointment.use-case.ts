import { Inject, Injectable } from '@nestjs/common';
import { ICancelAppointmentUseCase } from './cancel-appointment.use-case.interface';
import { CancelAppointmentInput } from '../dtos/cancel-appointment.input';
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
import { AppError } from '../../../../shared/errors/app-error';
import { buildNoteAuthorMap } from '../utils/appointment-enrichment.util';

@Injectable()
export class CancelAppointmentUseCase implements ICancelAppointmentUseCase {
  constructor(
    @Inject(APPOINTMENT_REPOSITORY)
    private readonly appointmentRepository: IAppointmentRepository,
    @Inject(PATIENT_REPOSITORY)
    private readonly patientRepository: IPatientRepository,
    @Inject(USER_REPOSITORY)
    private readonly userRepository: IUserRepository,
  ) {}

  async execute(
    id: string,
    tenantId: string,
    input: CancelAppointmentInput,
  ): Promise<AppointmentOutput> {
    const appointment = await this.appointmentRepository.findById(id, tenantId);
    if (!appointment) {
      throw new NotFoundError('Appointment', id);
    }
    try {
      appointment.cancel(input.reason);
    } catch (e) {
      if (e instanceof Error) {
        throw new AppError(e.message, 422);
      }
      throw e;
    }
    const saved = await this.appointmentRepository.save(appointment);
    const patient = await this.patientRepository.findById(saved.patientId, tenantId);
    const ctx: AppointmentOutputContext = {
      patientName: patient?.name,
      noteAuthorNames: await buildNoteAuthorMap(this.userRepository, saved.notes),
    };
    if (saved.assignedUserId) {
      const u = await this.userRepository.findById(saved.assignedUserId);
      ctx.assignedUserName = u?.name;
    }
    return AppointmentOutput.fromDomain(saved, ctx);
  }
}
