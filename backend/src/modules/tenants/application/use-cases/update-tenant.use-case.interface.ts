import { UserRole } from '../../../users/domain/user-role.enum';
import { UpdateTenantInput } from '../dtos/update-tenant.input';
import { TenantOutput } from '../dtos/tenant.output';

export interface IUpdateTenantUseCase {
  execute(
    id: string,
    input: UpdateTenantInput,
    callerTenantId: string,
    callerRole: UserRole,
  ): Promise<TenantOutput>;
}

export const UPDATE_TENANT_USE_CASE = Symbol('IUpdateTenantUseCase');
