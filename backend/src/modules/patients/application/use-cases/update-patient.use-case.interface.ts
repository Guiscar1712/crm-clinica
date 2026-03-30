import { UpdatePatientInput } from '../dtos/update-patient.input';
import { PatientOutput } from '../dtos/patient.output';

export interface IUpdatePatientUseCase {
  execute(id: string, tenantId: string, input: UpdatePatientInput): Promise<PatientOutput>;
}

export const UPDATE_PATIENT_USE_CASE = Symbol('IUpdatePatientUseCase');
