import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { TenantsModule } from '../../tenants/infra/tenants.module';
import { UsersModule } from '../../users/infra/users.module';
import { JwtStrategy } from './strategies/jwt.strategy';
import { AuthController } from './http/auth.controller';
import { REGISTER_USE_CASE } from '../application/use-cases/register.use-case.interface';
import { RegisterUseCase } from '../application/use-cases/register.use-case';
import { LOGIN_USE_CASE } from '../application/use-cases/login.use-case.interface';
import { LoginUseCase } from '../application/use-cases/login.use-case';

@Module({
  imports: [
    ConfigModule,
    PassportModule.register({ defaultStrategy: 'jwt' }),
    JwtModule.registerAsync({
      imports: [ConfigModule],
      useFactory: (config: ConfigService) => ({
        secret: config.getOrThrow<string>('JWT_SECRET'),
        signOptions: {
          expiresIn: config.get<string>('JWT_EXPIRES_IN') ?? '7d',
        },
      }),
      inject: [ConfigService],
    }),
    TenantsModule,
    UsersModule,
  ],
  controllers: [AuthController],
  providers: [
    JwtStrategy,
    { provide: REGISTER_USE_CASE, useClass: RegisterUseCase },
    { provide: LOGIN_USE_CASE, useClass: LoginUseCase },
  ],
  exports: [JwtModule],
})
export class AuthModule {}
