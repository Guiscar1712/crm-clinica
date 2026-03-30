import { Inject, Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { ILoginUseCase } from './login.use-case.interface';
import { LoginInput } from '../dtos/login.input';
import { AuthOutput } from '../dtos/auth.output';
import { IUserRepository, USER_REPOSITORY } from '../../../users/domain/user.repository.interface';
import { UnauthorizedError } from '../../../../shared/errors/unauthorized.error';
import { comparePassword } from '../../../../shared/utils/password.util';
import { TokenPayload } from '../../domain/token-payload.interface';

@Injectable()
export class LoginUseCase implements ILoginUseCase {
  constructor(
    @Inject(USER_REPOSITORY)
    private readonly userRepository: IUserRepository,
    private readonly jwtService: JwtService,
  ) {}

  async execute(input: LoginInput): Promise<AuthOutput> {
    const candidates = await this.userRepository.findActiveByEmail(input.email);
    if (candidates.length === 0) {
      throw new UnauthorizedError('Invalid credentials.');
    }
    let matched = null;
    for (const u of candidates) {
      const ok = await comparePassword(input.password, u.passwordHash);
      if (ok) {
        matched = u;
        break;
      }
    }
    if (!matched) {
      throw new UnauthorizedError('Invalid credentials.');
    }
    const payload: TokenPayload = {
      sub: matched.id,
      tenantId: matched.tenantId,
      role: matched.role,
      email: matched.email,
    };
    const accessToken = await this.jwtService.signAsync({
      sub: payload.sub,
      tenantId: payload.tenantId,
      role: payload.role,
      email: payload.email,
    });
    return AuthOutput.create(accessToken, matched);
  }
}
