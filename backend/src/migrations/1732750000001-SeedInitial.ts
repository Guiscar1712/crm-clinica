import { MigrationInterface, QueryRunner } from 'typeorm';

const DEFAULT_TENANT_ID = '11111111-1111-4111-8111-111111111111';

const SEED_PASSWORD_HASH =
  '$2b$10$.POyEhVa9gYE7D4Ai2wVGuNKLkG9rtDjFjLErtjQJhyfjrAODF6ru';

const SEED_ADMIN_ID = 'aaaaaaaa-aaaa-4aaa-8aaa-aaaaaaaaaaaa';
const SEED_ATTENDANT_ID = 'bbbbbbbb-bbbb-4bbb-8bbb-bbbbbbbbbbbb';
const SEED_VIEWER_ID = 'cccccccc-cccc-4ccc-8ccc-cccccccccccc';
const SEED_PATIENT_ID = 'dddddddd-dddd-4ddd-8ddd-dddddddddddd';
const SEED_APPOINTMENT_ID = 'eeeeeeee-eeee-4eee-8eee-eeeeeeeeeeee';
const SEED_NOTE_ID = 'ffffffff-ffff-4fff-8fff-ffffffffffff';

export class SeedInitial1732750000001 implements MigrationInterface {
  name = 'SeedInitial1732750000001';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `
      INSERT INTO "users" ("id", "tenantId", "name", "email", "passwordHash", "role", "isActive", "createdAt", "updatedAt")
      VALUES
        ($1, $5, 'Admin Demo', 'admin@clinica-legacy.local', $4, 'ADMIN', true, now(), now()),
        ($2, $5, 'Atendente Demo', 'atendente@clinica-legacy.local', $4, 'ATTENDANT', true, now(), now()),
        ($3, $5, 'Visualizador Demo', 'viewer@clinica-legacy.local', $4, 'VIEWER', true, now(), now())
      ON CONFLICT ("tenantId", "email") DO NOTHING
    `,
      [SEED_ADMIN_ID, SEED_ATTENDANT_ID, SEED_VIEWER_ID, SEED_PASSWORD_HASH, DEFAULT_TENANT_ID],
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`DELETE FROM "appointment_notes" WHERE "id" = $1`, [SEED_NOTE_ID]);
    await queryRunner.query(`DELETE FROM "appointments" WHERE "id" = $1`, [SEED_APPOINTMENT_ID]);
    await queryRunner.query(`DELETE FROM "patients" WHERE "id" = $1`, [SEED_PATIENT_ID]);
    await queryRunner.query(
      `DELETE FROM "users" WHERE "id" IN ($1, $2, $3)`,
      [SEED_ADMIN_ID, SEED_ATTENDANT_ID, SEED_VIEWER_ID],
    );
  }
}
