import { MigrationInterface, QueryRunner } from 'typeorm';

export class Initial1732646400000 implements MigrationInterface {
  name = 'Initial1732646400000';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
      CREATE TABLE "patients" (
        "id" uuid NOT NULL,
        "name" character varying(100) NOT NULL,
        "phone" character varying(20) NOT NULL,
        "createdAt" TIMESTAMP NOT NULL DEFAULT now(),
        CONSTRAINT "PK_86bb2301c06f6f4326d9e559a74ad56b" PRIMARY KEY ("id")
      )
    `);
    await queryRunner.query(`
      CREATE TABLE "appointments" (
        "id" uuid NOT NULL,
        "patientId" uuid NOT NULL,
        "description" text NOT NULL,
        "status" character varying(20) NOT NULL,
        "createdAt" TIMESTAMP NOT NULL DEFAULT now(),
        "updatedAt" TIMESTAMP NOT NULL DEFAULT now(),
        CONSTRAINT "PK_5a06cb9809ccd5798c0ce295ad0a53d7" PRIMARY KEY ("id"),
        CONSTRAINT "FK_appointments_patientId" FOREIGN KEY ("patientId") REFERENCES "patients"("id") ON DELETE CASCADE
      )
    `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`DROP TABLE "appointments"`);
    await queryRunner.query(`DROP TABLE "patients"`);
  }
}
