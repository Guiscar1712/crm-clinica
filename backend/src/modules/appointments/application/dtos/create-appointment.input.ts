import { Type } from 'class-transformer';
import {
  IsDate,
  IsEnum,
  IsNotEmpty,
  IsOptional,
  IsString,
  IsUUID,
  MaxLength,
} from 'class-validator';
import { AppointmentType } from '../../domain/appointment-type.enum';
import { AppointmentPriority } from '../../domain/appointment-priority.enum';

export class CreateAppointmentInput {
  @IsUUID()
  patientId: string;

  @IsOptional()
  @IsUUID()
  assignedUserId?: string | null;

  @IsEnum(AppointmentType)
  type: AppointmentType;

  @IsOptional()
  @IsEnum(AppointmentPriority)
  priority?: AppointmentPriority;

  @IsString()
  @IsNotEmpty()
  @MaxLength(1000)
  description: string;

  @IsOptional()
  @Type(() => Date)
  @IsDate()
  scheduledAt?: Date | null;
}
