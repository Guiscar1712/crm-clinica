import { Inject, Injectable } from '@nestjs/common';
import { IDeactivateUserUseCase } from './deactivate-user.use-case.interface';
import { IUserRepository, USER_REPOSITORY } from '../../domain/user.repository.interface';
import { NotFoundError } from '../../../../shared/errors/not-found.error';
import { AppError } from '../../../../shared/errors/app-error';

@Injectable()
export class DeactivateUserUseCase implements IDeactivateUserUseCase {
  constructor(
    @Inject(USER_REPOSITORY)
    private readonly userRepository: IUserRepository,
  ) {}

  async execute(id: string, callerTenantId: string): Promise<void> {
    const user = await this.userRepository.findById(id);
    if (!user) {
      throw new NotFoundError('User', id);
    }
    if (user.tenantId !== callerTenantId) {
      throw new AppError('Forbidden.', 403);
    }
    user.deactivate();
    await this.userRepository.save(user);
  }
}
