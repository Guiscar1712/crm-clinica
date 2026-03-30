import { UserRole } from '../../domain/user-role.enum';
import { UserOutput } from '../dtos/user.output';

export interface IGetUserUseCase {
  execute(
    id: string,
    callerTenantId: string,
    callerRole: UserRole,
  ): Promise<UserOutput>;
}

export const GET_USER_USE_CASE = Symbol('IGetUserUseCase');
