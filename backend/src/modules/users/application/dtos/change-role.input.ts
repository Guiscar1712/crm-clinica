import { IsEnum } from 'class-validator';
import { UserRole } from '../../domain/user-role.enum';

export class ChangeRoleInput {
  @IsEnum(UserRole)
  role: UserRole;
}
