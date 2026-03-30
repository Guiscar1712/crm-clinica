import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { TenantTypeOrmEntity } from './typeorm/tenant.typeorm-entity';
import { TenantTypeOrmRepository } from './typeorm/tenant.typeorm-repository';
import { TenantsController } from './http/tenants.controller';
import { TENANT_REPOSITORY } from '../domain/tenant.repository.interface';
import { CREATE_TENANT_USE_CASE } from '../application/use-cases/create-tenant.use-case.interface';
import { CreateTenantUseCase } from '../application/use-cases/create-tenant.use-case';
import { GET_TENANT_USE_CASE } from '../application/use-cases/get-tenant.use-case.interface';
import { GetTenantUseCase } from '../application/use-cases/get-tenant.use-case';
import { UPDATE_TENANT_USE_CASE } from '../application/use-cases/update-tenant.use-case.interface';
import { UpdateTenantUseCase } from '../application/use-cases/update-tenant.use-case';

@Module({
  imports: [TypeOrmModule.forFeature([TenantTypeOrmEntity])],
  controllers: [TenantsController],
  providers: [
    { provide: TENANT_REPOSITORY, useClass: TenantTypeOrmRepository },
    { provide: CREATE_TENANT_USE_CASE, useClass: CreateTenantUseCase },
    { provide: GET_TENANT_USE_CASE, useClass: GetTenantUseCase },
    { provide: UPDATE_TENANT_USE_CASE, useClass: UpdateTenantUseCase },
  ],
  exports: [TENANT_REPOSITORY],
})
export class TenantsModule {}
