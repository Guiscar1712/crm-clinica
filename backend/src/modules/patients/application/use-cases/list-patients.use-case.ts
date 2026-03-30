import { Inject, Injectable } from '@nestjs/common';
import { IListPatientsUseCase } from './list-patients.use-case.interface';
import { ListPatientsInput } from '../dtos/list-patients.input';
import { PatientOutput } from '../dtos/patient.output';
import {
  IPatientRepository,
  PATIENT_REPOSITORY,
} from '../../domain/patient.repository.interface';
import { PaginatedOutput } from '../../../../shared/types/pagination';

@Injectable()
export class ListPatientsUseCase implements IListPatientsUseCase {
  constructor(
    @Inject(PATIENT_REPOSITORY)
    private readonly patientRepository: IPatientRepository,
  ) {}

  async execute(
    tenantId: string,
    input: ListPatientsInput,
  ): Promise<PaginatedOutput<PatientOutput>> {
    const page = input.page ?? 1;
    const limit = input.limit ?? 10;
    const result = await this.patientRepository.findAll(
      {
        tenantId,
        search: input.search,
        isActive: input.isActive,
      },
      { page, limit },
    );
    return {
      ...result,
      data: result.data.map((p) => PatientOutput.fromDomain(p)),
    };
  }
}
