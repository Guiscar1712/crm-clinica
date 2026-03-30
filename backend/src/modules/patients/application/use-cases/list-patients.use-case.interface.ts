import { ListPatientsInput } from '../dtos/list-patients.input';
import { PaginatedOutput } from '../../../../shared/types/pagination';
import { PatientOutput } from '../dtos/patient.output';

export interface IListPatientsUseCase {
  execute(tenantId: string, input: ListPatientsInput): Promise<PaginatedOutput<PatientOutput>>;
}

export const LIST_PATIENTS_USE_CASE = Symbol('IListPatientsUseCase');
