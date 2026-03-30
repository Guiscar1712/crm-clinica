import { Inject, Injectable } from '@nestjs/common';
import { IGetUserUseCase } from './get-user.use-case.interface';
import { UserOutput } from '../dtos/user.output';
import { IUserRepository, USER_REPOSITORY } from '../../domain/user.repository.interface';
import { NotFoundError } from '../../../../shared/errors/not-found.error';
import { UserRole } from '../../domain/user-role.enum';
import { AppError } from '../../../../shared/errors/app-error';

@Injectable()
export class GetUserUseCase implements IGetUserUseCase {
  constructor(
    @Inject(USER_REPOSITORY)
    private readonly userRepository: IUserRepository,
  ) {}

  async execute(
    id: string,
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
    return UserOutput.fromDomain(user);
  }
}
