import { PatientOutput } from '../dtos/patient.output';

export interface IGetPatientUseCase {
  execute(id: string, tenantId: string): Promise<PatientOutput>;
}

export const GET_PATIENT_USE_CASE = Symbol('IGetPatientUseCase');
