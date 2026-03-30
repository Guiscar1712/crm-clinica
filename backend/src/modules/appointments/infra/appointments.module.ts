import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AppointmentTypeOrmEntity } from './typeorm/appointment.typeorm-entity';
import { AppointmentNoteTypeOrmEntity } from './typeorm/appointment-note.typeorm-entity';
import { AppointmentTypeOrmRepository } from './typeorm/appointment.typeorm-repository';
import { AppointmentsController } from './http/appointments.controller';
import { PatientsModule } from '../../patients/infra/patients.module';
import { UsersModule } from '../../users/infra/users.module';
import { APPOINTMENT_REPOSITORY } from '../domain/appointment.repository.interface';
import { CREATE_APPOINTMENT_USE_CASE } from '../application/use-cases/create-appointment.use-case.interface';
import { CreateAppointmentUseCase } from '../application/use-cases/create-appointment.use-case';
import { LIST_APPOINTMENTS_USE_CASE } from '../application/use-cases/list-appointments.use-case.interface';
import { ListAppointmentsUseCase } from '../application/use-cases/list-appointments.use-case';
import { GET_APPOINTMENT_USE_CASE } from '../application/use-cases/get-appointment.use-case.interface';
import { GetAppointmentUseCase } from '../application/use-cases/get-appointment.use-case';
import { UPDATE_APPOINTMENT_USE_CASE } from '../application/use-cases/update-appointment.use-case.interface';
import { UpdateAppointmentUseCase } from '../application/use-cases/update-appointment.use-case';
import { ADVANCE_STATUS_USE_CASE } from '../application/use-cases/advance-status.use-case.interface';
import { AdvanceStatusUseCase } from '../application/use-cases/advance-status.use-case';
import { DELETE_APPOINTMENT_USE_CASE } from '../application/use-cases/delete-appointment.use-case.interface';
import { DeleteAppointmentUseCase } from '../application/use-cases/delete-appointment.use-case';
import { CANCEL_APPOINTMENT_USE_CASE } from '../application/use-cases/cancel-appointment.use-case.interface';
import { CancelAppointmentUseCase } from '../application/use-cases/cancel-appointment.use-case';
import { ADD_NOTE_USE_CASE } from '../application/use-cases/add-note.use-case.interface';
import { AddNoteUseCase } from '../application/use-cases/add-note.use-case';

@Module({
  imports: [
    TypeOrmModule.forFeature([AppointmentTypeOrmEntity, AppointmentNoteTypeOrmEntity]),
    PatientsModule,
    UsersModule,
  ],
  controllers: [AppointmentsController],
  providers: [
    { provide: APPOINTMENT_REPOSITORY, useClass: AppointmentTypeOrmRepository },
    { provide: CREATE_APPOINTMENT_USE_CASE, useClass: CreateAppointmentUseCase },
    { provide: LIST_APPOINTMENTS_USE_CASE, useClass: ListAppointmentsUseCase },
    { provide: GET_APPOINTMENT_USE_CASE, useClass: GetAppointmentUseCase },
    { provide: UPDATE_APPOINTMENT_USE_CASE, useClass: UpdateAppointmentUseCase },
    { provide: ADVANCE_STATUS_USE_CASE, useClass: AdvanceStatusUseCase },
    { provide: CANCEL_APPOINTMENT_USE_CASE, useClass: CancelAppointmentUseCase },
    { provide: ADD_NOTE_USE_CASE, useClass: AddNoteUseCase },
    { provide: DELETE_APPOINTMENT_USE_CASE, useClass: DeleteAppointmentUseCase },
  ],
})
export class AppointmentsModule {}
