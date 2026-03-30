import { CreatePatientInput } from '../dtos/create-patient.input';
import { PatientOutput } from '../dtos/patient.output';

export interface ICreatePatientUseCase {
  execute(input: CreatePatientInput, tenantId: string): Promise<PatientOutput>;
}

export const CREATE_PATIENT_USE_CASE = Symbol('ICreatePatientUseCase');
