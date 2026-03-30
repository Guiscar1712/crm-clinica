import { Inject, Injectable } from '@nestjs/common';
import { IActivatePatientUseCase } from './activate-patient.use-case.interface';
import { PatientOutput } from '../dtos/patient.output';
import {
  IPatientRepository,
  PATIENT_REPOSITORY,
} from '../../domain/patient.repository.interface';
import { NotFoundError } from '../../../../shared/errors/not-found.error';

@Injectable()
export class ActivatePatientUseCase implements IActivatePatientUseCase {
  constructor(
    @Inject(PATIENT_REPOSITORY)
    private readonly patientRepository: IPatientRepository,
  ) {}

  async execute(id: string, tenantId: string): Promise<PatientOutput> {
    const patient = await this.patientRepository.findById(id, tenantId);
    if (!patient) {
      throw new NotFoundError('Patient', id);
    }
    patient.activate();
    const saved = await this.patientRepository.save(patient);
    return PatientOutput.fromDomain(saved);
  }
}
