import { Tenant } from './tenant.entity';
import { PaginationInput, PaginatedOutput } from '../../../shared/types/pagination';

export interface ITenantRepository {
  save(tenant: Tenant): Promise<Tenant>;
  findById(id: string): Promise<Tenant | null>;
  findBySlug(slug: string): Promise<Tenant | null>;
  findAll(pagination: PaginationInput): Promise<PaginatedOutput<Tenant>>;
}

export const TENANT_REPOSITORY = Symbol('ITenantRepository');
