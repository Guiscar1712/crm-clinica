export interface IDeleteAppointmentUseCase {
  execute(id: string, tenantId: string): Promise<void>;
}

export const DELETE_APPOINTMENT_USE_CASE = Symbol('IDeleteAppointmentUseCase');
