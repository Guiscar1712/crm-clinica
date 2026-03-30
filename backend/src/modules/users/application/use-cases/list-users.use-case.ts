import { Inject, Injectable } from '@nestjs/common';
import { IListUsersUseCase } from './list-users.use-case.interface';
import { ListUsersInput } from '../dtos/list-users.input';
import { IUserRepository, USER_REPOSITORY } from '../../domain/user.repository.interface';
import { UserOutput } from '../dtos/user.output';
import { PaginatedOutput } from '../../../../shared/types/pagination';

@Injectable()
export class ListUsersUseCase implements IListUsersUseCase {
  constructor(
    @Inject(USER_REPOSITORY)
    private readonly userRepository: IUserRepository,
  ) {}

  async execute(tenantId: string, input: ListUsersInput): Promise<PaginatedOutput<UserOutput>> {
    const page = input.page ?? 1;
    const limit = input.limit ?? 10;
    const result = await this.userRepository.findAll(tenantId, { page, limit });
    return {
      ...result,
      data: result.data.map((u) => UserOutput.fromDomain(u)),
    };
  }
}
