import { LoginInput } from '../dtos/login.input';
import { AuthOutput } from '../dtos/auth.output';

export interface ILoginUseCase {
  execute(input: LoginInput): Promise<AuthOutput>;
}

export const LOGIN_USE_CASE = Symbol('ILoginUseCase');
