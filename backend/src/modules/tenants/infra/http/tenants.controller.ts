import { Body, Controller, Get, HttpCode, Inject, Param, Patch, Post, UseGuards } from '@nestjs/common';
import { UserRole } from '../../../users/domain/user-role.enum';
import { Roles } from '../../../../shared/decorators/roles.decorator';
import { JwtAuthGuard } from '../../../../shared/guards/jwt-auth.guard';
import { RolesGuard } from '../../../../shared/guards/roles.guard';
import { CurrentTenant } from '../../../../shared/decorators/current-tenant.decorator';
import { CurrentUser } from '../../../../shared/decorators/current-user.decorator';
import { TokenPayload } from '../../../auth/domain/token-payload.interface';
import { CreateTenantInput } from '../../application/dtos/create-tenant.input';
import { UpdateTenantInput } from '../../application/dtos/update-tenant.input';
import {
  CREATE_TENANT_USE_CASE,
  ICreateTenantUseCase,
} from '../../application/use-cases/create-tenant.use-case.interface';
import {
  GET_TENANT_USE_CASE,
  IGetTenantUseCase,
} from '../../application/use-cases/get-tenant.use-case.interface';
import {
  IUpdateTenantUseCase,
  UPDATE_TENANT_USE_CASE,
} from '../../application/use-cases/update-tenant.use-case.interface';

@Controller('tenants')
export class TenantsController {
  constructor(
    @Inject(CREATE_TENANT_USE_CASE)
    private readonly createTenant: ICreateTenantUseCase,
    @Inject(GET_TENANT_USE_CASE)
    private readonly getTenant: IGetTenantUseCase,
    @Inject(UPDATE_TENANT_USE_CASE)
    private readonly updateTenant: IUpdateTenantUseCase,
  ) {}

  @Post()
  @HttpCode(201)
  create(@Body() body: CreateTenantInput) {
    return this.createTenant.execute(body);
  }

  @Get(':id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN)
  get(
    @Param('id') id: string,
    @CurrentTenant() _tenantId: string,
    @CurrentUser() user: TokenPayload,
  ) {
    return this.getTenant.execute(id, user.tenantId, user.role);
  }

  @Patch(':id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN)
  update(
    @Param('id') id: string,
    @Body() body: UpdateTenantInput,
    @CurrentUser() user: TokenPayload,
  ) {
    return this.updateTenant.execute(id, body, user.tenantId, user.role);
  }
}
