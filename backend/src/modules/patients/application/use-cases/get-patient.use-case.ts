import { Inject, Injectable } from '@nestjs/common';
import { IGetPatientUseCase } from './get-patient.use-case.interface';
import { PatientOutput } from '../dtos/patient.output';
import {
  IPatientRepository,
  PATIENT_REPOSITORY,
} from '../../domain/patient.repository.interface';
import { NotFoundError } from '../../../../shared/errors/not-found.error';

@Injectable()
export class GetPatientUseCase implements IGetPatientUseCase {
  constructor(
    @Inject(PATIENT_REPOSITORY)
    private readonly patientRepository: IPatientRepository,
  ) {}

  async execute(id: string, tenantId: string): Promise<PatientOutput> {
    const patient = await this.patientRepository.findById(id, tenantId);
    if (!patient) {
      throw new NotFoundError('Patient', id);
    }
    return PatientOutput.fromDomain(patient);
  }
}
