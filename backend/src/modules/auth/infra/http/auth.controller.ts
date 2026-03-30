import { Body, Controller, Get, HttpCode, Inject, Post, UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from '../../../../shared/guards/jwt-auth.guard';
import { CurrentUser } from '../../../../shared/decorators/current-user.decorator';
import { TokenPayload } from '../../domain/token-payload.interface';
import { RegisterInput } from '../../application/dtos/register.input';
import { LoginInput } from '../../application/dtos/login.input';
import {
  IRegisterUseCase,
  REGISTER_USE_CASE,
} from '../../application/use-cases/register.use-case.interface';
import {
  ILoginUseCase,
  LOGIN_USE_CASE,
} from '../../application/use-cases/login.use-case.interface';
import { IUserRepository, USER_REPOSITORY } from '../../../users/domain/user.repository.interface';
import { NotFoundError } from '../../../../shared/errors/not-found.error';

@Controller('auth')
export class AuthController {
  constructor(
    @Inject(REGISTER_USE_CASE)
    private readonly register: IRegisterUseCase,
    @Inject(LOGIN_USE_CASE)
    private readonly login: ILoginUseCase,
    @Inject(USER_REPOSITORY)
    private readonly userRepository: IUserRepository,
  ) {}

  @Post('register')
  @HttpCode(201)
  registerRoute(@Body() body: RegisterInput) {
    return this.register.execute(body);
  }

  @Post('login')
  @HttpCode(201)
  loginRoute(@Body() body: LoginInput) {
    return this.login.execute(body);
  }

  @Get('me')
  @UseGuards(JwtAuthGuard)
  async me(@CurrentUser() payload: TokenPayload) {
    const u = await this.userRepository.findById(payload.sub);
    if (!u) {
      throw new NotFoundError('User', payload.sub);
    }
    return {
      id: u.id,
      name: u.name,
      email: u.email,
      role: u.role,
      tenantId: u.tenantId,
    };
  }
}
