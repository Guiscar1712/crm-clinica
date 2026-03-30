import { Inject, Injectable } from '@nestjs/common';
import { IGetTenantUseCase } from './get-tenant.use-case.interface';
import { TenantOutput } from '../dtos/tenant.output';
import { ITenantRepository, TENANT_REPOSITORY } from '../../domain/tenant.repository.interface';
import { NotFoundError } from '../../../../shared/errors/not-found.error';
import { UserRole } from '../../../users/domain/user-role.enum';
import { AppError } from '../../../../shared/errors/app-error';

@Injectable()
export class GetTenantUseCase implements IGetTenantUseCase {
  constructor(
    @Inject(TENANT_REPOSITORY)
    private readonly tenantRepository: ITenantRepository,
  ) {}

  async execute(
    id: string,
    callerTenantId: string,
    callerRole: UserRole,
  ): Promise<TenantOutput> {
    if (callerRole !== UserRole.SUPER_ADMIN && id !== callerTenantId) {
      throw new AppError('Forbidden.', 403);
    }
    const tenant = await this.tenantRepository.findById(id);
    if (!tenant) {
      throw new NotFoundError('Tenant', id);
    }
    return TenantOutput.fromDomain(tenant);
  }
}
