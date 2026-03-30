import { Inject, Injectable } from '@nestjs/common';
import { ICreateUserUseCase } from './create-user.use-case.interface';
import { CreateUserInput } from '../dtos/create-user.input';
import { UserOutput } from '../dtos/user.output';
import { IUserRepository, USER_REPOSITORY } from '../../domain/user.repository.interface';
import { User } from '../../domain/user.entity';
import { UserRole } from '../../domain/user-role.enum';
import { ConflictError } from '../../../../shared/errors/conflict.error';
import { AppError } from '../../../../shared/errors/app-error';
import { hashPassword } from '../../../../shared/utils/password.util';

@Injectable()
export class CreateUserUseCase implements ICreateUserUseCase {
  constructor(
    @Inject(USER_REPOSITORY)
    private readonly userRepository: IUserRepository,
  ) {}

  async execute(input: CreateUserInput, tenantId: string): Promise<UserOutput> {
    if (input.role === UserRole.SUPER_ADMIN) {
      throw new AppError('Cannot create user with SUPER_ADMIN role.', 400);
    }
    const dup = await this.userRepository.findByEmailAndTenant(input.email, tenantId);
    if (dup) {
      throw new ConflictError(`User with email "${input.email}" already exists in this tenant.`);
    }
    const passwordHash = await hashPassword(input.password);
    const user = User.create(tenantId, {
      name: input.name,
      email: input.email,
      passwordHash,
      role: input.role,
    });
    const saved = await this.userRepository.save(user);
    return UserOutput.fromDomain(saved);
  }
}
