import { RegisterInput } from '../dtos/register.input';
import { AuthOutput } from '../dtos/auth.output';

export interface IRegisterUseCase {
  execute(input: RegisterInput): Promise<AuthOutput>;
}

export const REGISTER_USE_CASE = Symbol('IRegisterUseCase');
