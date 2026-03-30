import { CreateUserInput } from '../dtos/create-user.input';
import { UserOutput } from '../dtos/user.output';

export interface ICreateUserUseCase {
  execute(input: CreateUserInput, tenantId: string): Promise<UserOutput>;
}

export const CREATE_USER_USE_CASE = Symbol('ICreateUserUseCase');
