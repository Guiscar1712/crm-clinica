import { User } from '../../../users/domain/user.entity';
import { UserRole } from '../../../users/domain/user-role.enum';

export class AuthOutput {
  accessToken: string;
  user: {
    id: string;
    name: string;
    email: string;
    role: UserRole;
    tenantId: string;
  };

  static create(accessToken: string, user: User): AuthOutput {
    const o = new AuthOutput();
    o.accessToken = accessToken;
    o.user = {
      id: user.id,
      name: user.name,
      email: user.email,
      role: user.role,
      tenantId: user.tenantId,
    };
    return o;
  }
}
