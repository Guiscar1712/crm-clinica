import { Patient } from './patient.entity';
import { PaginationInput, PaginatedOutput } from '../../../shared/types/pagination';

export interface ListPatientsFilter {
  tenantId: string;
  search?: string;
  isActive?: boolean;
}

export interface IPatientRepository {
  save(patient: Patient): Promise<Patient>;
  findById(id: string, tenantId: string): Promise<Patient | null>;
  findByCpf(cpf: string, tenantId: string): Promise<Patient | null>;
  findAll(
    filter: ListPatientsFilter,
    pagination: PaginationInput,
  ): Promise<PaginatedOutput<Patient>>;
  delete(id: string, tenantId: string): Promise<void>;
}

export const PATIENT_REPOSITORY = Symbol('IPatientRepository');
