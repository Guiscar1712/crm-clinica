import { User } from './user.entity';
import { PaginationInput, PaginatedOutput } from '../../../shared/types/pagination';

export interface IUserRepository {
  save(user: User): Promise<User>;
  findById(id: string): Promise<User | null>;
  findByEmailAndTenant(email: string, tenantId: string): Promise<User | null>;
  findActiveByEmail(email: string): Promise<User[]>;
  findAll(tenantId: string, pagination: PaginationInput): Promise<PaginatedOutput<User>>;
}

export const USER_REPOSITORY = Symbol('IUserRepository');
