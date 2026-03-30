import { Inject, Injectable } from '@nestjs/common';
import { IUpdateUserUseCase } from './update-user.use-case.interface';
import { UpdateUserInput } from '../dtos/update-user.input';
import { UserOutput } from '../dtos/user.output';
import { IUserRepository, USER_REPOSITORY } from '../../domain/user.repository.interface';
import { NotFoundError } from '../../../../shared/errors/not-found.error';
import { UserRole } from '../../domain/user-role.enum';
import { AppError } from '../../../../shared/errors/app-error';
import { ConflictError } from '../../../../shared/errors/conflict.error';

@Injectable()
export class UpdateUserUseCase implements IUpdateUserUseCase {
  constructor(
    @Inject(USER_REPOSITORY)
    private readonly userRepository: IUserRepository,
  ) {}

  async execute(
    id: string,
    input: UpdateUserInput,
    callerUserId: string,
    callerTenantId: string,
    callerRole: UserRole,
  ): Promise<UserOutput> {
    const user = await this.userRepository.findById(id);
    if (!user) {
      throw new NotFoundError('User', id);
    }
    if (callerRole !== UserRole.SUPER_ADMIN && user.tenantId !== callerTenantId) {
      throw new AppError('Forbidden.', 403);
    }
    const isAdmin = callerRole === UserRole.ADMIN || callerRole === UserRole.SUPER_ADMIN;
    if (!isAdmin && callerUserId !== id) {
      throw new AppError('Forbidden.', 403);
    }
    if (input.email && input.email !== user.email) {
      const dup = await this.userRepository.findByEmailAndTenant(input.email, user.tenantId);
      if (dup && dup.id !== user.id) {
        throw new ConflictError(`User with email "${input.email}" already exists in this tenant.`);
      }
    }
    user.update({ name: input.name, email: input.email });
    const saved = await this.userRepository.save(user);
    return UserOutput.fromDomain(saved);
  }
}
