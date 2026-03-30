import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { IUserRepository } from '../../domain/user.repository.interface';
import { User } from '../../domain/user.entity';
import { UserTypeOrmEntity } from './user.typeorm-entity';
import { UserRole } from '../../domain/user-role.enum';
import { PaginationInput, PaginatedOutput } from '../../../../shared/types/pagination';

@Injectable()
export class UserTypeOrmRepository implements IUserRepository {
  constructor(
    @InjectRepository(UserTypeOrmEntity)
    private readonly repo: Repository<UserTypeOrmEntity>,
  ) {}

  private toOrm(user: User): UserTypeOrmEntity {
    const e = new UserTypeOrmEntity();
    e.id = user.id;
    e.tenantId = user.tenantId;
    e.name = user.name;
    e.email = user.email;
    e.passwordHash = user.passwordHash;
    e.role = user.role;
    e.isActive = user.isActive;
    e.createdAt = user.createdAt;
    e.updatedAt = user.updatedAt;
    return e;
  }

  private toDomain(e: UserTypeOrmEntity): User {
    return new User(
      e.id,
      e.tenantId,
      e.name,
      e.email,
      e.passwordHash,
      e.role as UserRole,
      e.isActive,
      e.createdAt,
      e.updatedAt,
    );
  }

  async save(user: User): Promise<User> {
    const saved = await this.repo.save(this.toOrm(user));
    return this.toDomain(saved);
  }

  async findById(id: string): Promise<User | null> {
    const e = await this.repo.findOneBy({ id });
    return e ? this.toDomain(e) : null;
  }

  async findByEmailAndTenant(email: string, tenantId: string): Promise<User | null> {
    const e = await this.repo.findOneBy({ email, tenantId });
    return e ? this.toDomain(e) : null;
  }

  async findActiveByEmail(email: string): Promise<User[]> {
    const rows = await this.repo.find({ where: { email, isActive: true } });
    return rows.map((e) => this.toDomain(e));
  }

  async findAll(tenantId: string, pagination: PaginationInput): Promise<PaginatedOutput<User>> {
    const qb = this.repo
      .createQueryBuilder('u')
      .where('u.tenantId = :tenantId', { tenantId })
      .orderBy('u.createdAt', 'DESC');
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
