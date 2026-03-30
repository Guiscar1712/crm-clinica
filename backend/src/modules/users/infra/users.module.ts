import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserTypeOrmEntity } from './typeorm/user.typeorm-entity';
import { UserTypeOrmRepository } from './typeorm/user.typeorm-repository';
import { UsersController } from './http/users.controller';
import { USER_REPOSITORY } from '../domain/user.repository.interface';
import { CREATE_USER_USE_CASE } from '../application/use-cases/create-user.use-case.interface';
import { CreateUserUseCase } from '../application/use-cases/create-user.use-case';
import { LIST_USERS_USE_CASE } from '../application/use-cases/list-users.use-case.interface';
import { ListUsersUseCase } from '../application/use-cases/list-users.use-case';
import { GET_USER_USE_CASE } from '../application/use-cases/get-user.use-case.interface';
import { GetUserUseCase } from '../application/use-cases/get-user.use-case';
import { UPDATE_USER_USE_CASE } from '../application/use-cases/update-user.use-case.interface';
import { UpdateUserUseCase } from '../application/use-cases/update-user.use-case';
import { CHANGE_ROLE_USE_CASE } from '../application/use-cases/change-role.use-case.interface';
import { ChangeRoleUseCase } from '../application/use-cases/change-role.use-case';
import { DEACTIVATE_USER_USE_CASE } from '../application/use-cases/deactivate-user.use-case.interface';
import { DeactivateUserUseCase } from '../application/use-cases/deactivate-user.use-case';

@Module({
  imports: [TypeOrmModule.forFeature([UserTypeOrmEntity])],
  controllers: [UsersController],
  providers: [
    { provide: USER_REPOSITORY, useClass: UserTypeOrmRepository },
    { provide: CREATE_USER_USE_CASE, useClass: CreateUserUseCase },
    { provide: LIST_USERS_USE_CASE, useClass: ListUsersUseCase },
    { provide: GET_USER_USE_CASE, useClass: GetUserUseCase },
    { provide: UPDATE_USER_USE_CASE, useClass: UpdateUserUseCase },
    { provide: CHANGE_ROLE_USE_CASE, useClass: ChangeRoleUseCase },
    { provide: DEACTIVATE_USER_USE_CASE, useClass: DeactivateUserUseCase },
  ],
  exports: [USER_REPOSITORY],
})
export class UsersModule {}
