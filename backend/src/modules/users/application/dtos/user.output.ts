import { User } from '../../domain/user.entity';
import { UserRole } from '../../domain/user-role.enum';

export class UserOutput {
  id: string;
  tenantId: string;
  name: string;
  email: string;
  role: UserRole;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;

  static fromDomain(user: User): UserOutput {
    const o = new UserOutput();
    o.id = user.id;
    o.tenantId = user.tenantId;
    o.name = user.name;
    o.email = user.email;
    o.role = user.role;
    o.isActive = user.isActive;
    o.createdAt = user.createdAt;
    o.updatedAt = user.updatedAt;
    return o;
  }
}
