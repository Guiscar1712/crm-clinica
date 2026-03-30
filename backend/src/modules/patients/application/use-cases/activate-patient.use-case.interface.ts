import { PatientOutput } from '../dtos/patient.output';

export interface IActivatePatientUseCase {
  execute(id: string, tenantId: string): Promise<PatientOutput>;
}

export const ACTIVATE_PATIENT_USE_CASE = Symbol('IActivatePatientUseCase');
