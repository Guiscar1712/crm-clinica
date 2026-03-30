import { Inject, Injectable } from '@nestjs/common';
import { IUpdateTenantUseCase } from './update-tenant.use-case.interface';
import { UpdateTenantInput } from '../dtos/update-tenant.input';
import { TenantOutput } from '../dtos/tenant.output';
import { ITenantRepository, TENANT_REPOSITORY } from '../../domain/tenant.repository.interface';
import { NotFoundError } from '../../../../shared/errors/not-found.error';
import { UserRole } from '../../../users/domain/user-role.enum';
import { AppError } from '../../../../shared/errors/app-error';

@Injectable()
export class UpdateTenantUseCase implements IUpdateTenantUseCase {
  constructor(
    @Inject(TENANT_REPOSITORY)
    private readonly tenantRepository: ITenantRepository,
  ) {}

  async execute(
    id: string,
    input: UpdateTenantInput,
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
    tenant.update({
      name: input.name,
      document: input.document,
      email: input.email,
      phone: input.phone,
      logoUrl: input.logoUrl,
    });
    const saved = await this.tenantRepository.save(tenant);
    return TenantOutput.fromDomain(saved);
  }
}
