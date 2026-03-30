import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ITenantRepository } from '../../domain/tenant.repository.interface';
import { Tenant } from '../../domain/tenant.entity';
import { TenantTypeOrmEntity } from './tenant.typeorm-entity';
import { PaginationInput, PaginatedOutput } from '../../../../shared/types/pagination';

@Injectable()
export class TenantTypeOrmRepository implements ITenantRepository {
  constructor(
    @InjectRepository(TenantTypeOrmEntity)
    private readonly repo: Repository<TenantTypeOrmEntity>,
  ) {}

  private toOrm(tenant: Tenant): TenantTypeOrmEntity {
    const e = new TenantTypeOrmEntity();
    e.id = tenant.id;
    e.name = tenant.name;
    e.slug = tenant.slug;
    e.document = tenant.document;
    e.email = tenant.email;
    e.phone = tenant.phone;
    e.logoUrl = tenant.logoUrl;
    e.isActive = tenant.isActive;
    e.createdAt = tenant.createdAt;
    e.updatedAt = tenant.updatedAt;
    return e;
  }

  private toDomain(e: TenantTypeOrmEntity): Tenant {
    return new Tenant(
      e.id,
      e.name,
      e.slug,
      e.document,
      e.email,
      e.phone,
      e.logoUrl,
      e.isActive,
      e.createdAt,
      e.updatedAt,
    );
  }

  async save(tenant: Tenant): Promise<Tenant> {
    const saved = await this.repo.save(this.toOrm(tenant));
    return this.toDomain(saved);
  }

  async findById(id: string): Promise<Tenant | null> {
    const e = await this.repo.findOneBy({ id });
    return e ? this.toDomain(e) : null;
  }

  async findBySlug(slug: string): Promise<Tenant | null> {
    const e = await this.repo.findOneBy({ slug });
    return e ? this.toDomain(e) : null;
  }

  async findAll(pagination: PaginationInput): Promise<PaginatedOutput<Tenant>> {
    const qb = this.repo.createQueryBuilder('t').orderBy('t.createdAt', 'DESC');
    qb.skip((pagination.page - 1) * pagination.limit);
    qb.take(pagination.limit);
    const [rows, total] = await qb.getManyAndCount();
    const limit = pagination.limit;
    const totalPages = limit > 0 ? Math.ceil(total / limit) : 0;
    return {
      data: rows.map((r) => this.toDomain(r)),
      total,
      page: pagination.page,
      limit,
      totalPages,
    };
  }
}
