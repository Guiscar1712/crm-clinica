import { MigrationInterface, QueryRunner } from 'typeorm';

const DEFAULT_TENANT_ID = '11111111-1111-4111-8111-111111111111';

export class MultiTenantAuth1732750000000 implements MigrationInterface {
  name = 'MultiTenantAuth1732750000000';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
      CREATE TABLE "tenants" (
        "id" uuid NOT NULL,
        "name" character varying(150) NOT NULL,
        "slug" character varying(60) NOT NULL,
        "document" character varying(14),
        "email" character varying(150),
        "phone" character varying(20),
        "logoUrl" text,
        "isActive" boolean NOT NULL DEFAULT true,
        "createdAt" TIMESTAMP NOT NULL DEFAULT now(),
        "updatedAt" TIMESTAMP NOT NULL DEFAULT now(),
        CONSTRAINT "PK_tenants" PRIMARY KEY ("id"),
        CONSTRAINT "UQ_tenants_slug" UNIQUE ("slug"),
        CONSTRAINT "UQ_tenants_document" UNIQUE ("document")
      )
    `);

    await queryRunner.query(`
      INSERT INTO "tenants" ("id", "name", "slug", "isActive", "createdAt", "updatedAt")
      VALUES ($1, 'Clínica Legacy', 'legacy', true, now(), now())
    `, [DEFAULT_TENANT_ID]);

    await queryRunner.query(`
      CREATE TABLE "users" (
        "id" uuid NOT NULL,
        "tenantId" uuid NOT NULL,
        "name" character varying(100) NOT NULL,
        "email" character varying(150) NOT NULL,
        "passwordHash" character varying(255) NOT NULL,
        "role" character varying(20) NOT NULL,
        "isActive" boolean NOT NULL DEFAULT true,
        "createdAt" TIMESTAMP NOT NULL DEFAULT now(),
        "updatedAt" TIMESTAMP NOT NULL DEFAULT now(),
        CONSTRAINT "PK_users" PRIMARY KEY ("id"),
        CONSTRAINT "FK_users_tenant" FOREIGN KEY ("tenantId") REFERENCES "tenants"("id") ON DELETE CASCADE,
        CONSTRAINT "UQ_users_tenant_email" UNIQUE ("tenantId", "email")
      )
    `);

    await queryRunner.query(`
      ALTER TABLE "patients" ADD "tenantId" uuid
    `);
    await queryRunner.query(`UPDATE "patients" SET "tenantId" = $1 WHERE "tenantId" IS NULL`, [
      DEFAULT_TENANT_ID,
    ]);
    await queryRunner.query(`
      ALTER TABLE "patients" ALTER COLUMN "tenantId" SET NOT NULL
    `);
    await queryRunner.query(`
      ALTER TABLE "patients" ADD CONSTRAINT "FK_patients_tenant" FOREIGN KEY ("tenantId") REFERENCES "tenants"("id") ON DELETE CASCADE
    `);

    await queryRunner.query(`ALTER TABLE "patients" ADD "cpf" character varying(11)`);
    await queryRunner.query(`ALTER TABLE "patients" ADD "dateOfBirth" date`);
    await queryRunner.query(
      `ALTER TABLE "patients" ADD "gender" character varying(24)`,
    );
    await queryRunner.query(`ALTER TABLE "patients" ADD "secondaryPhone" character varying(20)`);
    await queryRunner.query(`ALTER TABLE "patients" ADD "email" character varying(150)`);
    await queryRunner.query(`ALTER TABLE "patients" ADD "addressStreet" character varying(200)`);
    await queryRunner.query(`ALTER TABLE "patients" ADD "addressNumber" character varying(20)`);
    await queryRunner.query(
      `ALTER TABLE "patients" ADD "addressComplement" character varying(100)`,
    );
    await queryRunner.query(
      `ALTER TABLE "patients" ADD "addressNeighborhood" character varying(100)`,
    );
    await queryRunner.query(`ALTER TABLE "patients" ADD "addressCity" character varying(100)`);
    await queryRunner.query(`ALTER TABLE "patients" ADD "addressState" character varying(2)`);
    await queryRunner.query(`ALTER TABLE "patients" ADD "addressZipCode" character varying(8)`);
    await queryRunner.query(
      `ALTER TABLE "patients" ADD "healthInsurance" character varying(100)`,
    );
    await queryRunner.query(
      `ALTER TABLE "patients" ADD "healthInsuranceNumber" character varying(50)`,
    );
    await queryRunner.query(`ALTER TABLE "patients" ADD "notes" text`);
    await queryRunner.query(
      `ALTER TABLE "patients" ADD "isActive" boolean NOT NULL DEFAULT true`,
    );
    await queryRunner.query(`ALTER TABLE "patients" ADD "updatedAt" TIMESTAMP NOT NULL DEFAULT now()`);

    await queryRunner.query(`CREATE INDEX "IDX_patients_tenant_cpf" ON "patients" ("tenantId", "cpf")`);
    await queryRunner.query(
      `CREATE INDEX "IDX_patients_tenant_active" ON "patients" ("tenantId", "isActive")`,
    );

    await queryRunner.query(`ALTER TABLE "appointments" ADD "tenantId" uuid`);
    await queryRunner.query(`
      UPDATE "appointments" a SET "tenantId" = p."tenantId" FROM "patients" p WHERE a."patientId" = p.id
    `);
    await queryRunner.query(
      `ALTER TABLE "appointments" ALTER COLUMN "tenantId" SET NOT NULL`,
    );
    await queryRunner.query(`
      ALTER TABLE "appointments" ADD CONSTRAINT "FK_appointments_tenant" FOREIGN KEY ("tenantId") REFERENCES "tenants"("id") ON DELETE CASCADE
    `);

    await queryRunner.query(
      `ALTER TABLE "appointments" ADD "assignedUserId" uuid`,
    );
    await queryRunner.query(
      `ALTER TABLE "appointments" ADD "type" character varying(30) NOT NULL DEFAULT 'CONSULTATION'`,
    );
    await queryRunner.query(
      `ALTER TABLE "appointments" ADD "priority" character varying(20) NOT NULL DEFAULT 'NORMAL'`,
    );
    await queryRunner.query(
      `ALTER TABLE "appointments" ADD "scheduledAt" TIMESTAMP`,
    );
    await queryRunner.query(`ALTER TABLE "appointments" ADD "startedAt" TIMESTAMP`);
    await queryRunner.query(`ALTER TABLE "appointments" ADD "finishedAt" TIMESTAMP`);
    await queryRunner.query(`ALTER TABLE "appointments" ADD "cancelledAt" TIMESTAMP`);
    await queryRunner.query(
      `ALTER TABLE "appointments" ADD "cancellationReason" text`,
    );

    await queryRunner.query(`
      ALTER TABLE "appointments" ADD CONSTRAINT "FK_appointments_assigned_user" FOREIGN KEY ("assignedUserId") REFERENCES "users"("id") ON DELETE SET NULL
    `);

    await queryRunner.query(`
      CREATE INDEX "IDX_appointments_tenant_status" ON "appointments" ("tenantId", "status")
    `);
    await queryRunner.query(`
      CREATE INDEX "IDX_appointments_tenant_patient" ON "appointments" ("tenantId", "patientId")
    `);
    await queryRunner.query(`
      CREATE INDEX "IDX_appointments_tenant_scheduled" ON "appointments" ("tenantId", "scheduledAt")
    `);

    await queryRunner.query(`
      CREATE TABLE "appointment_notes" (
        "id" uuid NOT NULL,
        "appointmentId" uuid NOT NULL,
        "authorId" uuid NOT NULL,
        "content" text NOT NULL,
        "createdAt" TIMESTAMP NOT NULL DEFAULT now(),
        CONSTRAINT "PK_appointment_notes" PRIMARY KEY ("id"),
        CONSTRAINT "FK_appointment_notes_appointment" FOREIGN KEY ("appointmentId") REFERENCES "appointments"("id") ON DELETE CASCADE
      )
    `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`DROP TABLE "appointment_notes"`);
    await queryRunner.query(
      `ALTER TABLE "appointments" DROP CONSTRAINT "FK_appointments_assigned_user"`,
    );
    await queryRunner.query(`DROP INDEX "IDX_appointments_tenant_scheduled"`);
    await queryRunner.query(`DROP INDEX "IDX_appointments_tenant_patient"`);
    await queryRunner.query(`DROP INDEX "IDX_appointments_tenant_status"`);
    await queryRunner.query(
      `ALTER TABLE "appointments" DROP CONSTRAINT "FK_appointments_tenant"`,
    );
    await queryRunner.query(`ALTER TABLE "appointments" DROP COLUMN "cancellationReason"`);
    await queryRunner.query(`ALTER TABLE "appointments" DROP COLUMN "cancelledAt"`);
    await queryRunner.query(`ALTER TABLE "appointments" DROP COLUMN "finishedAt"`);
    await queryRunner.query(`ALTER TABLE "appointments" DROP COLUMN "startedAt"`);
    await queryRunner.query(`ALTER TABLE "appointments" DROP COLUMN "scheduledAt"`);
    await queryRunner.query(`ALTER TABLE "appointments" DROP COLUMN "priority"`);
    await queryRunner.query(`ALTER TABLE "appointments" DROP COLUMN "type"`);
    await queryRunner.query(`ALTER TABLE "appointments" DROP COLUMN "assignedUserId"`);
    await queryRunner.query(`ALTER TABLE "appointments" DROP COLUMN "tenantId"`);
    await queryRunner.query(`DROP INDEX "IDX_patients_tenant_active"`);
    await queryRunner.query(`DROP INDEX "IDX_patients_tenant_cpf"`);
    await queryRunner.query(
      `ALTER TABLE "patients" DROP CONSTRAINT "FK_patients_tenant"`,
    );
    await queryRunner.query(`ALTER TABLE "patients" DROP COLUMN "updatedAt"`);
    await queryRunner.query(`ALTER TABLE "patients" DROP COLUMN "isActive"`);
    await queryRunner.query(`ALTER TABLE "patients" DROP COLUMN "notes"`);
    await queryRunner.query(`ALTER TABLE "patients" DROP COLUMN "healthInsuranceNumber"`);
    await queryRunner.query(`ALTER TABLE "patients" DROP COLUMN "healthInsurance"`);
    await queryRunner.query(`ALTER TABLE "patients" DROP COLUMN "addressZipCode"`);
    await queryRunner.query(`ALTER TABLE "patients" DROP COLUMN "addressState"`);
    await queryRunner.query(`ALTER TABLE "patients" DROP COLUMN "addressCity"`);
    await queryRunner.query(`ALTER TABLE "patients" DROP COLUMN "addressNeighborhood"`);
    await queryRunner.query(`ALTER TABLE "patients" DROP COLUMN "addressComplement"`);
    await queryRunner.query(`ALTER TABLE "patients" DROP COLUMN "addressNumber"`);
    await queryRunner.query(`ALTER TABLE "patients" DROP COLUMN "addressStreet"`);
    await queryRunner.query(`ALTER TABLE "patients" DROP COLUMN "email"`);
    await queryRunner.query(`ALTER TABLE "patients" DROP COLUMN "secondaryPhone"`);
    await queryRunner.query(`ALTER TABLE "patients" DROP COLUMN "gender"`);
    await queryRunner.query(`ALTER TABLE "patients" DROP COLUMN "dateOfBirth"`);
    await queryRunner.query(`ALTER TABLE "patients" DROP COLUMN "cpf"`);
    await queryRunner.query(`ALTER TABLE "patients" DROP COLUMN "tenantId"`);
    await queryRunner.query(`DROP TABLE "users"`);
    await queryRunner.query(`DELETE FROM "tenants" WHERE "id" = $1`, [DEFAULT_TENANT_ID]);
    await queryRunner.query(`DROP TABLE "tenants"`);
  }
}
