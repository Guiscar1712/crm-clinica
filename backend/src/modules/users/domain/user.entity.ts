import { UserRole } from './user-role.enum';

export interface CreateUserProps {
  name: string;
  email: string;
  passwordHash: string;
  role: UserRole;
}

export interface UpdateUserProps {
  name?: string;
  email?: string;
}

export class User {
  constructor(
    public readonly id: string,
    public readonly tenantId: string,
    public name: string,
    public email: string,
    public passwordHash: string,
    public role: UserRole,
    public isActive: boolean,
    public readonly createdAt: Date,
    public updatedAt: Date,
  ) {}

  static create(tenantId: string, props: CreateUserProps): User {
    const now = new Date();
    return new User(
      crypto.randomUUID(),
      tenantId,
      props.name,
      props.email,
      props.passwordHash,
      props.role,
      true,
      now,
      now,
    );
  }

  update(props: UpdateUserProps): void {
    if (props.name !== undefined) this.name = props.name;
    if (props.email !== undefined) this.email = props.email;
    this.updatedAt = new Date();
  }

  changeRole(newRole: UserRole): void {
    if (this.role === UserRole.SUPER_ADMIN) {
      throw new Error('Cannot change SUPER_ADMIN role.');
    }
    this.role = newRole;
    this.updatedAt = new Date();
  }

  deactivate(): void {
    this.isActive = false;
    this.updatedAt = new Date();
  }

  activate(): void {
    this.isActive = true;
    this.updatedAt = new Date();
  }
}
