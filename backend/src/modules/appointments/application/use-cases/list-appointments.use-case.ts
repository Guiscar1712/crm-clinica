import { Inject, Injectable } from '@nestjs/common';
import { IListAppointmentsUseCase } from './list-appointments.use-case.interface';
import { ListAppointmentsInput } from '../dtos/list-appointments.input';
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
import { PaginatedOutput } from '../../../../shared/types/pagination';
import { Appointment } from '../../domain/appointment.entity';
import { buildNoteAuthorMap } from '../utils/appointment-enrichment.util';

@Injectable()
export class ListAppointmentsUseCase implements IListAppointmentsUseCase {
  constructor(
    @Inject(APPOINTMENT_REPOSITORY)
    private readonly appointmentRepository: IAppointmentRepository,
    @Inject(PATIENT_REPOSITORY)
    private readonly patientRepository: IPatientRepository,
    @Inject(USER_REPOSITORY)
    private readonly userRepository: IUserRepository,
  ) {}

  private async toOutput(appointment: Appointment, tenantId: string): Promise<AppointmentOutput> {
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

  async execute(
    tenantId: string,
    input: ListAppointmentsInput,
  ): Promise<PaginatedOutput<AppointmentOutput>> {
    const page = input.page ?? 1;
    const limit = input.limit ?? 10;
    const result = await this.appointmentRepository.findAll(
      {
        tenantId,
        status: input.status,
        patientId: input.patientId,
        assignedUserId: input.assignedUserId,
        type: input.type,
        priority: input.priority,
        scheduledFrom: input.scheduledFrom,
        scheduledTo: input.scheduledTo,
      },
      { page, limit },
    );
    const data = await Promise.all(
      result.data.map((a) => this.toOutput(a, tenantId)),
    );
    return { ...result, data };
  }
}
