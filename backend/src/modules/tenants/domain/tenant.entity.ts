export interface CreateTenantProps {
  name: string;
  slug: string;
  document?: string | null;
  email?: string | null;
  phone?: string | null;
  logoUrl?: string | null;
}

export interface UpdateTenantProps {
  name?: string;
  document?: string | null;
  email?: string | null;
  phone?: string | null;
  logoUrl?: string | null;
}

export class Tenant {
  constructor(
    public readonly id: string,
    public name: string,
    public slug: string,
    public document: string | null,
    public email: string | null,
    public phone: string | null,
    public logoUrl: string | null,
    public isActive: boolean,
    public readonly createdAt: Date,
    public updatedAt: Date,
  ) {}

  static create(props: CreateTenantProps): Tenant {
    const now = new Date();
    return new Tenant(
      crypto.randomUUID(),
      props.name,
      props.slug,
      props.document ?? null,
      props.email ?? null,
      props.phone ?? null,
      props.logoUrl ?? null,
      true,
      now,
      now,
    );
  }

  update(props: UpdateTenantProps): void {
    if (props.name !== undefined) this.name = props.name;
    if (props.document !== undefined) this.document = props.document;
    if (props.email !== undefined) this.email = props.email;
    if (props.phone !== undefined) this.phone = props.phone;
    if (props.logoUrl !== undefined) this.logoUrl = props.logoUrl;
    this.updatedAt = new Date();
  }

  deactivate(): void {
    this.isActive = false;
    this.updatedAt = new Date();
  }
}
