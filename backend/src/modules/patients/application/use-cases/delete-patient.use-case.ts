import { Inject, Injectable } from '@nestjs/common';
import { IDeletePatientUseCase } from './delete-patient.use-case.interface';
import {
  IPatientRepository,
  PATIENT_REPOSITORY,
} from '../../domain/patient.repository.interface';
import { NotFoundError } from '../../../../shared/errors/not-found.error';

@Injectable()
export class DeletePatientUseCase implements IDeletePatientUseCase {
  constructor(
    @Inject(PATIENT_REPOSITORY)
    private readonly patientRepository: IPatientRepository,
  ) {}

  async execute(id: string, tenantId: string): Promise<void> {
    const patient = await this.patientRepository.findById(id, tenantId);
    if (!patient) {
      throw new NotFoundError('Patient', id);
    }
    await this.patientRepository.delete(id, tenantId);
  }
}
