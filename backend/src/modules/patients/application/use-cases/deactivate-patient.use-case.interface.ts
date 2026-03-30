import { PatientOutput } from '../dtos/patient.output';

export interface IDeactivatePatientUseCase {
  execute(id: string, tenantId: string): Promise<PatientOutput>;
}

export const DEACTIVATE_PATIENT_USE_CASE = Symbol('IDeactivatePatientUseCase');
