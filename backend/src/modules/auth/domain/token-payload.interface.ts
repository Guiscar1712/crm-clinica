import { UserRole } from '../../users/domain/user-role.enum';

export interface TokenPayload {
  sub: string;
  tenantId: string;
  role: UserRole;
  email: string;
}
