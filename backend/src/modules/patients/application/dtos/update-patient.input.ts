import { Type } from 'class-transformer';
import {
  IsDate,
  IsEmail,
  IsEnum,
  IsOptional,
  IsString,
  Length,
  Matches,
  MaxLength,
  ValidateNested,
} from 'class-validator';
import { PatientGender } from '../../domain/patient-gender.enum';
import { AddressInput } from './address.input';

export class UpdatePatientInput {
  @IsOptional()
  @IsString()
  @MaxLength(100)
  name?: string;

  @IsOptional()
  @Length(11, 11)
  @Matches(/^\d{11}$/)
  cpf?: string | null;

  @IsOptional()
  @Type(() => Date)
  @IsDate()
  dateOfBirth?: Date | null;

  @IsOptional()
  @IsEnum(PatientGender)
  gender?: PatientGender | null;

  @IsOptional()
  @IsString()
  @MaxLength(20)
  phone?: string;

  @IsOptional()
  @IsString()
  @MaxLength(20)
  secondaryPhone?: string | null;

  @IsOptional()
  @IsEmail()
  @MaxLength(150)
  email?: string | null;

  @IsOptional()
  @ValidateNested()
  @Type(() => AddressInput)
  address?: AddressInput | null;

  @IsOptional()
  @IsString()
  @MaxLength(100)
  healthInsurance?: string | null;

  @IsOptional()
  @IsString()
  @MaxLength(50)
  healthInsuranceNumber?: string | null;

  @IsOptional()
  @IsString()
  @MaxLength(5000)
  notes?: string | null;
}
