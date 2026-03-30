import { Inject, Injectable } from '@nestjs/common';
import { ICreateTenantUseCase } from './create-tenant.use-case.interface';
import { CreateTenantInput } from '../dtos/create-tenant.input';
import { TenantOutput } from '../dtos/tenant.output';
import { ITenantRepository, TENANT_REPOSITORY } from '../../domain/tenant.repository.interface';
import { Tenant } from '../../domain/tenant.entity';
import { ConflictError } from '../../../../shared/errors/conflict.error';

@Injectable()
export class CreateTenantUseCase implements ICreateTenantUseCase {
  constructor(
    @Inject(TENANT_REPOSITORY)
    private readonly tenantRepository: ITenantRepository,
  ) {}

  async execute(input: CreateTenantInput): Promise<TenantOutput> {
    const existing = await this.tenantRepository.findBySlug(input.slug);
    if (existing) {
      throw new ConflictError(`Tenant with slug "${input.slug}" already exists.`);
    }
    const tenant = Tenant.create({
      name: input.name,
      slug: input.slug,
      document: input.document,
      email: input.email,
      phone: input.phone,
      logoUrl: input.logoUrl,
    });
    const saved = await this.tenantRepository.save(tenant);
    return TenantOutput.fromDomain(saved);
  }
}
