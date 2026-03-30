import { UserRole } from '../../domain/user-role.enum';
import { UpdateUserInput } from '../dtos/update-user.input';
import { UserOutput } from '../dtos/user.output';

export interface IUpdateUserUseCase {
  execute(
    id: string,
    input: UpdateUserInput,
    callerUserId: string,
    callerTenantId: string,
    callerRole: UserRole,
  ): Promise<UserOutput>;
}

export const UPDATE_USER_USE_CASE = Symbol('IUpdateUserUseCase');
