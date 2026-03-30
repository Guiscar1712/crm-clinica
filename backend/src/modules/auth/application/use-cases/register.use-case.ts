import { Inject, Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { IRegisterUseCase } from './register.use-case.interface';
import { RegisterInput } from '../dtos/register.input';
import { AuthOutput } from '../dtos/auth.output';
import {
  ITenantRepository,
  TENANT_REPOSITORY,
} from '../../../tenants/domain/tenant.repository.interface';
import { IUserRepository, USER_REPOSITORY } from '../../../users/domain/user.repository.interface';
import { User } from '../../../users/domain/user.entity';
import { UserRole } from '../../../users/domain/user-role.enum';
import { NotFoundError } from '../../../../shared/errors/not-found.error';
import { ConflictError } from '../../../../shared/errors/conflict.error';
import { hashPassword } from '../../../../shared/utils/password.util';
import { TokenPayload } from '../../domain/token-payload.interface';

@Injectable()
export class RegisterUseCase implements IRegisterUseCase {
  constructor(
    @Inject(TENANT_REPOSITORY)
    private readonly tenantRepository: ITenantRepository,
    @Inject(USER_REPOSITORY)
    private readonly userRepository: IUserRepository,
    private readonly jwtService: JwtService,
  ) {}

  async execute(input: RegisterInput): Promise<AuthOutput> {
    const tenant = await this.tenantRepository.findById(input.tenantId);
    if (!tenant) {
      throw new NotFoundError('Tenant', input.tenantId);
    }
    if (!tenant.isActive) {
      throw new NotFoundError('Tenant', input.tenantId);
    }
    const existing = await this.userRepository.findByEmailAndTenant(input.email, input.tenantId);
    if (existing) {
      throw new ConflictError(`User with email "${input.email}" already exists in this tenant.`);
    }
    const passwordHash = await hashPassword(input.password);
    const user = User.create(input.tenantId, {
      name: input.name,
      email: input.email,
      passwordHash,
      role: UserRole.ATTENDANT,
    });
    const saved = await this.userRepository.save(user);
    const payload: TokenPayload = {
      sub: saved.id,
      tenantId: saved.tenantId,
      role: saved.role,
      email: saved.email,
    };
    const accessToken = await this.jwtService.signAsync({
      sub: payload.sub,
      tenantId: payload.tenantId,
      role: payload.role,
      email: payload.email,
    });
    return AuthOutput.create(accessToken, saved);
  }
}
