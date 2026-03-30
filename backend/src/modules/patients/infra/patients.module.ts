import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PatientTypeOrmEntity } from './typeorm/patient.typeorm-entity';
import { PatientTypeOrmRepository } from './typeorm/patient.typeorm-repository';
import { PatientsController } from './http/patients.controller';
import { PATIENT_REPOSITORY } from '../domain/patient.repository.interface';
import { CREATE_PATIENT_USE_CASE } from '../application/use-cases/create-patient.use-case.interface';
import { CreatePatientUseCase } from '../application/use-cases/create-patient.use-case';
import { LIST_PATIENTS_USE_CASE } from '../application/use-cases/list-patients.use-case.interface';
import { ListPatientsUseCase } from '../application/use-cases/list-patients.use-case';
import { GET_PATIENT_USE_CASE } from '../application/use-cases/get-patient.use-case.interface';
import { GetPatientUseCase } from '../application/use-cases/get-patient.use-case';
import { UPDATE_PATIENT_USE_CASE } from '../application/use-cases/update-patient.use-case.interface';
import { UpdatePatientUseCase } from '../application/use-cases/update-patient.use-case';
import { DELETE_PATIENT_USE_CASE } from '../application/use-cases/delete-patient.use-case.interface';
import { DeletePatientUseCase } from '../application/use-cases/delete-patient.use-case';
import { ACTIVATE_PATIENT_USE_CASE } from '../application/use-cases/activate-patient.use-case.interface';
import { ActivatePatientUseCase } from '../application/use-cases/activate-patient.use-case';
import { DEACTIVATE_PATIENT_USE_CASE } from '../application/use-cases/deactivate-patient.use-case.interface';
import { DeactivatePatientUseCase } from '../application/use-cases/deactivate-patient.use-case';

@Module({
  imports: [TypeOrmModule.forFeature([PatientTypeOrmEntity])],
  controllers: [PatientsController],
  providers: [
    { provide: PATIENT_REPOSITORY, useClass: PatientTypeOrmRepository },
    { provide: CREATE_PATIENT_USE_CASE, useClass: CreatePatientUseCase },
    { provide: LIST_PATIENTS_USE_CASE, useClass: ListPatientsUseCase },
    { provide: GET_PATIENT_USE_CASE, useClass: GetPatientUseCase },
    { provide: UPDATE_PATIENT_USE_CASE, useClass: UpdatePatientUseCase },
    { provide: DELETE_PATIENT_USE_CASE, useClass: DeletePatientUseCase },
    { provide: ACTIVATE_PATIENT_USE_CASE, useClass: ActivatePatientUseCase },
    { provide: DEACTIVATE_PATIENT_USE_CASE, useClass: DeactivatePatientUseCase },
  ],
  exports: [PATIENT_REPOSITORY],
})
export class PatientsModule {}
