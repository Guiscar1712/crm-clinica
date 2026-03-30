import { IsEmail, IsOptional, IsString, IsUrl, Length, Matches, MaxLength } from 'class-validator';

export class UpdateTenantInput {
  @IsOptional()
  @IsString()
  @MaxLength(150)
  name?: string;

  @IsOptional()
  @Length(14, 14)
  @Matches(/^\d{14}$/)
  document?: string | null;

  @IsOptional()
  @IsEmail()
  email?: string | null;

  @IsOptional()
  @IsString()
  @MaxLength(20)
  phone?: string | null;

  @IsOptional()
  @IsUrl()
  logoUrl?: string | null;
}
