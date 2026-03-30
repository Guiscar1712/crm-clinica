export interface IDeletePatientUseCase {
  execute(id: string, tenantId: string): Promise<void>;
}

export const DELETE_PATIENT_USE_CASE = Symbol('IDeletePatientUseCase');
