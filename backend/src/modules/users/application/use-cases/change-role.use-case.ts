import { Inject, Injectable } from '@nestjs/common';
import { IChangeRoleUseCase } from './change-role.use-case.interface';
import { ChangeRoleInput } from '../dtos/change-role.input';
import { UserOutput } from '../dtos/user.output';
import { IUserRepository, USER_REPOSITORY } from '../../domain/user.repository.interface';
import { NotFoundError } from '../../../../shared/errors/not-found.error';
import { AppError } from '../../../../shared/errors/app-error';
import { UserRole } from '../../domain/user-role.enum';

@Injectable()
export class ChangeRoleUseCase implements IChangeRoleUseCase {
  constructor(
    @Inject(USER_REPOSITORY)
    private readonly userRepository: IUserRepository,
  ) {}

  async execute(
    id: string,
    input: ChangeRoleInput,
    callerTenantId: string,
  ): Promise<UserOutput> {
    const user = await this.userRepository.findById(id);
    if (!user) {
      throw new NotFoundError('User', id);
    }
    if (user.tenantId !== callerTenantId) {
      throw new AppError('Forbidden.', 403);
    }
    if (input.role === UserRole.SUPER_ADMIN) {
      throw new AppError('Cannot assign SUPER_ADMIN role.', 400);
    }
    try {
      user.changeRole(input.role);
    } catch (e) {
      if (e instanceof Error) {
        throw new AppError(e.message, 422);
      }
      throw e;
    }
    const saved = await this.userRepository.save(user);
    return UserOutput.fromDomain(saved);
  }
}
