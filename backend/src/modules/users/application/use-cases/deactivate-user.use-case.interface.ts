export interface IDeactivateUserUseCase {
  execute(id: string, callerTenantId: string): Promise<void>;
}

export const DEACTIVATE_USER_USE_CASE = Symbol('IDeactivateUserUseCase');
