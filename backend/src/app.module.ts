import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PatientsModule } from './modules/patients/infra/patients.module';
import { AppointmentsModule } from './modules/appointments/infra/appointments.module';
import { TenantsModule } from './modules/tenants/infra/tenants.module';
import { UsersModule } from './modules/users/infra/users.module';
import { AuthModule } from './modules/auth/infra/auth.module';
import { PatientTypeOrmEntity } from './modules/patients/infra/typeorm/patient.typeorm-entity';
import { AppointmentTypeOrmEntity } from './modules/appointments/infra/typeorm/appointment.typeorm-entity';
import { AppointmentNoteTypeOrmEntity } from './modules/appointments/infra/typeorm/appointment-note.typeorm-entity';
import { TenantTypeOrmEntity } from './modules/tenants/infra/typeorm/tenant.typeorm-entity';
import { UserTypeOrmEntity } from './modules/users/infra/typeorm/user.typeorm-entity';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    TypeOrmModule.forRoot({
      type: 'postgres',
      url: process.env.DATABASE_URL ?? 'postgres://crm:crm@localhost:5432/crm',
      entities: [
        TenantTypeOrmEntity,
        UserTypeOrmEntity,
        PatientTypeOrmEntity,
        AppointmentTypeOrmEntity,
        AppointmentNoteTypeOrmEntity,
      ],
      synchronize: false,
    }),
    TenantsModule,
    UsersModule,
    AuthModule,
    PatientsModule,
    AppointmentsModule,
  ],
})
export class AppModule {}
