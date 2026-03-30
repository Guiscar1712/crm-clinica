import { ListUsersInput } from '../dtos/list-users.input';
import { PaginatedOutput } from '../../../../shared/types/pagination';
import { UserOutput } from '../dtos/user.output';

export interface IListUsersUseCase {
  execute(tenantId: string, input: ListUsersInput): Promise<PaginatedOutput<UserOutput>>;
}

export const LIST_USERS_USE_CASE = Symbol('IListUsersUseCase');
