import { Inject, Injectable } from '@nestjs/common';
import { ICreateAppointmentUseCase } from './create-appointment.use-case.interface';
import { CreateAppointmentInput } from '../dtos/create-appointment.input';
import {
  AppointmentOutput,
  AppointmentOutputContext,
} from '../dtos/appointment.output';
import {
  IAppointmentRepository,
  APPOINTMENT_REPOSITORY,
} from '../../domain/appointment.repository.interface';
import {
  IPatientRepository,
  PATIENT_REPOSITORY,
} from '../../../patients/domain/patient.repository.interface';
import { IUserRepository, USER_REPOSITORY } from '../../../users/domain/user.repository.interface';
import { Appointment } from '../../domain/appointment.entity';
import { AppointmentPriority } from '../../domain/appointment-priority.enum';
import { NotFoundError } from '../../../../shared/errors/not-found.error';
import { buildNoteAuthorMap } from '../utils/appointment-enrichment.util';

@Injectable()
export class CreateAppointmentUseCase implements ICreateAppointmentUseCase {
  constructor(
    @Inject(APPOINTMENT_REPOSITORY)
    private readonly appointmentRepository: IAppointmentRepository,
    @Inject(PATIENT_REPOSITORY)
    private readonly patientRepository: IPatientRepository,
    @Inject(USER_REPOSITORY)
    private readonly userRepository: IUserRepository,
  ) {}

  async execute(
    input: CreateAppointmentInput,
    tenantId: string,
  ): Promise<AppointmentOutput> {
    const patient = await this.patientRepository.findById(input.patientId, tenantId);
    if (!patient) {
      throw new NotFoundError('Patient', input.patientId);
    }
    const priority = input.priority ?? AppointmentPriority.NORMAL;
    const appointment = Appointment.create(tenantId, {
      patientId: input.patientId,
      assignedUserId: input.assignedUserId ?? null,
      type: input.type,
      priority,
      description: input.description,
      scheduledAt: input.scheduledAt ?? null,
    });
    const saved = await this.appointmentRepository.save(appointment);
    const ctx: AppointmentOutputContext = {
      patientName: patient.name,
      noteAuthorNames: await buildNoteAuthorMap(this.userRepository, saved.notes),
    };
    if (saved.assignedUserId) {
      const u = await this.userRepository.findById(saved.assignedUserId);
      ctx.assignedUserName = u?.name;
    }
    return AppointmentOutput.fromDomain(saved, ctx);
  }
}
