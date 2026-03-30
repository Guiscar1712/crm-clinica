import { Tenant } from '../../domain/tenant.entity';

export class TenantOutput {
  id: string;
  name: string;
  slug: string;
  document: string | null;
  email: string | null;
  phone: string | null;
  logoUrl: string | null;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;

  static fromDomain(tenant: Tenant): TenantOutput {
    const o = new TenantOutput();
    o.id = tenant.id;
    o.name = tenant.name;
    o.slug = tenant.slug;
    o.document = tenant.document;
    o.email = tenant.email;
    o.phone = tenant.phone;
    o.logoUrl = tenant.logoUrl;
    o.isActive = tenant.isActive;
    o.createdAt = tenant.createdAt;
    o.updatedAt = tenant.updatedAt;
    return o;
  }
}
