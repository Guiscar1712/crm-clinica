import { UserRole } from '../../../users/domain/user-role.enum';
import { TenantOutput } from '../dtos/tenant.output';

export interface IGetTenantUseCase {
  execute(
    id: string,
    callerTenantId: string,
    callerRole: UserRole,
  ): Promise<TenantOutput>;
}

export const GET_TENANT_USE_CASE = Symbol('IGetTenantUseCase');
