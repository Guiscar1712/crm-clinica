import { ChangeRoleInput } from '../dtos/change-role.input';
import { UserOutput } from '../dtos/user.output';

export interface IChangeRoleUseCase {
  execute(id: string, input: ChangeRoleInput, callerTenantId: string): Promise<UserOutput>;
}

export const CHANGE_ROLE_USE_CASE = Symbol('IChangeRoleUseCase');
