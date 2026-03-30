import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  Inject,
  Param,
  Patch,
  Post,
  Query,
  UseGuards,
} from '@nestjs/common';
import { UserRole } from '../../domain/user-role.enum';
import { JwtAuthGuard } from '../../../../shared/guards/jwt-auth.guard';
import { RolesGuard } from '../../../../shared/guards/roles.guard';
import { Roles } from '../../../../shared/decorators/roles.decorator';
import { CurrentTenant } from '../../../../shared/decorators/current-tenant.decorator';
import { CurrentUser } from '../../../../shared/decorators/current-user.decorator';
import { TokenPayload } from '../../../auth/domain/token-payload.interface';
import { CreateUserInput } from '../../application/dtos/create-user.input';
import { UpdateUserInput } from '../../application/dtos/update-user.input';
import { ChangeRoleInput } from '../../application/dtos/change-role.input';
import { ListUsersInput } from '../../application/dtos/list-users.input';
import {
  CREATE_USER_USE_CASE,
  ICreateUserUseCase,
} from '../../application/use-cases/create-user.use-case.interface';
import {
  IListUsersUseCase,
  LIST_USERS_USE_CASE,
} from '../../application/use-cases/list-users.use-case.interface';
import {
  GET_USER_USE_CASE,
  IGetUserUseCase,
} from '../../application/use-cases/get-user.use-case.interface';
import {
  IUpdateUserUseCase,
  UPDATE_USER_USE_CASE,
} from '../../application/use-cases/update-user.use-case.interface';
import {
  CHANGE_ROLE_USE_CASE,
  IChangeRoleUseCase,
} from '../../application/use-cases/change-role.use-case.interface';
import {
  DEACTIVATE_USER_USE_CASE,
  IDeactivateUserUseCase,
} from '../../application/use-cases/deactivate-user.use-case.interface';

@Controller('users')
@UseGuards(JwtAuthGuard, RolesGuard)
export class UsersController {
  constructor(
    @Inject(CREATE_USER_USE_CASE)
    private readonly createUser: ICreateUserUseCase,
    @Inject(LIST_USERS_USE_CASE)
    private readonly listUsers: IListUsersUseCase,
    @Inject(GET_USER_USE_CASE)
    private readonly getUser: IGetUserUseCase,
    @Inject(UPDATE_USER_USE_CASE)
    private readonly updateUser: IUpdateUserUseCase,
    @Inject(CHANGE_ROLE_USE_CASE)
    private readonly changeRole: IChangeRoleUseCase,
    @Inject(DEACTIVATE_USER_USE_CASE)
    private readonly deactivateUser: IDeactivateUserUseCase,
  ) {}

  @Post()
  @Roles(UserRole.ADMIN)
  create(@Body() body: CreateUserInput, @CurrentTenant() tenantId: string) {
    return this.createUser.execute(body, tenantId);
  }

  @Get()
  @Roles(UserRole.ADMIN, UserRole.MANAGER)
  list(@CurrentTenant() tenantId: string, @Query() query: ListUsersInput) {
    return this.listUsers.execute(tenantId, query);
  }

  @Get(':id')
  @Roles(UserRole.ADMIN, UserRole.MANAGER)
  get(
    @Param('id') id: string,
    @CurrentTenant() tenantId: string,
    @CurrentUser() user: TokenPayload,
  ) {
    return this.getUser.execute(id, tenantId, user.role);
  }

  @Patch(':id/role')
  @Roles(UserRole.ADMIN)
  changeRoleRoute(
    @Param('id') id: string,
    @Body() body: ChangeRoleInput,
    @CurrentTenant() tenantId: string,
  ) {
    return this.changeRole.execute(id, body, tenantId);
  }

  @Patch(':id')
  @Roles(
    UserRole.ADMIN,
    UserRole.MANAGER,
    UserRole.ATTENDANT,
    UserRole.VIEWER,
    UserRole.SUPER_ADMIN,
  )
  update(
    @Param('id') id: string,
    @Body() body: UpdateUserInput,
    @CurrentTenant() tenantId: string,
    @CurrentUser() user: TokenPayload,
  ) {
    return this.updateUser.execute(id, body, user.sub, tenantId, user.role);
  }

  @Delete(':id')
  @HttpCode(204)
  @Roles(UserRole.ADMIN)
  deactivate(@Param('id') id: string, @CurrentTenant() tenantId: string) {
    return this.deactivateUser.execute(id, tenantId);
  }
}
