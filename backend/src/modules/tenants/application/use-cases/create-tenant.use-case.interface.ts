import { CreateTenantInput } from '../dtos/create-tenant.input';
import { TenantOutput } from '../dtos/tenant.output';

export interface ICreateTenantUseCase {
  execute(input: CreateTenantInput): Promise<TenantOutput>;
}

export const CREATE_TENANT_USE_CASE = Symbol('ICreateTenantUseCase');
