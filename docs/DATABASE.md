# Estrutura do banco de dados (PostgreSQL)

O schema é criado pelas migrations TypeORM em `backend/src/migrations/`. Convenção: chaves primárias `uuid`, timestamps `TIMESTAMP`, nomes de colunas em **camelCase** nas tabelas (como gerado pelo TypeORM).

## `tenants`

Instância da clínica / organização (multi-tenant).

| Coluna | Tipo | Obrigatório | Notas |
|--------|------|-------------|--------|
| `id` | uuid | sim | PK |
| `name` | varchar(150) | sim | |
| `slug` | varchar(60) | sim | Único global |
| `document` | varchar(14) | não | CNPJ/identificador; único se preenchido |
| `email` | varchar(150) | não | |
| `phone` | varchar(20) | não | |
| `logoUrl` | text | não | URL opcional (campo existe no modelo; o front atual não depende de imagem externa) |
| `isActive` | boolean | sim | default `true` |
| `createdAt` | timestamp | sim | default `now()` |
| `updatedAt` | timestamp | sim | default `now()` |

## `users`

Usuários por tenant; e-mail único **por tenant** (`tenantId`, `email`).

| Coluna | Tipo | Obrigatório | Notas |
|--------|------|-------------|--------|
| `id` | uuid | sim | PK |
| `tenantId` | uuid | sim | FK → `tenants.id` ON DELETE CASCADE |
| `name` | varchar(100) | sim | |
| `email` | varchar(150) | sim | |
| `passwordHash` | varchar(255) | sim | bcrypt/bcryptjs |
| `role` | varchar(20) | sim | ex.: `ADMIN`, `ATTENDANT`, `VIEWER` |
| `isActive` | boolean | sim | default `true` |
| `createdAt` | timestamp | sim | |
| `updatedAt` | timestamp | sim | |

## `patients`

Pacientes isolados por tenant.

| Coluna | Tipo | Obrigatório | Notas |
|--------|------|-------------|--------|
| `id` | uuid | sim | PK |
| `tenantId` | uuid | sim | FK → `tenants.id` ON DELETE CASCADE |
| `name` | varchar(100) | sim | |
| `phone` | varchar(20) | sim | |
| `cpf` | varchar(11) | não | |
| `dateOfBirth` | date | não | |
| `gender` | varchar(24) | não | enum de domínio (texto no banco) |
| `secondaryPhone` | varchar(20) | não | |
| `email` | varchar(150) | não | |
| `addressStreet` … `addressZipCode` | varchar | não | Endereço em colunas planas |
| `healthInsurance` | varchar(100) | não | |
| `healthInsuranceNumber` | varchar(50) | não | |
| `notes` | text | não | |
| `isActive` | boolean | sim | default `true` |
| `createdAt` | timestamp | sim | |
| `updatedAt` | timestamp | sim | |

**Índices:** `("tenantId", "cpf")`, `("tenantId", "isActive")`.

## `appointments`

Atendimento vinculado a paciente e tenant; pode ter profissional atribuído (`assignedUserId`).

| Coluna | Tipo | Obrigatório | Notas |
|--------|------|-------------|--------|
| `id` | uuid | sim | PK |
| `tenantId` | uuid | sim | FK → `tenants.id` ON DELETE CASCADE |
| `patientId` | uuid | sim | FK → `patients.id` ON DELETE CASCADE |
| `assignedUserId` | uuid | não | FK → `users.id` ON DELETE SET NULL |
| `type` | varchar(30) | sim | default `CONSULTATION` |
| `priority` | varchar(20) | sim | default `NORMAL` |
| `description` | text | sim | |
| `status` | varchar(20) | sim | ex.: `AGUARDANDO`, `EM_ATENDIMENTO`, … |
| `scheduledAt` | timestamp | não | |
| `startedAt` | timestamp | não | |
| `finishedAt` | timestamp | não | |
| `cancelledAt` | timestamp | não | |
| `cancellationReason` | text | não | |
| `createdAt` | timestamp | sim | |
| `updatedAt` | timestamp | sim | |

**Índices:** `("tenantId", "status")`, `("tenantId", "patientId")`, `("tenantId", "scheduledAt")`.

## `appointment_notes`

Notas textuais ligadas a um atendimento.

| Coluna | Tipo | Obrigatório | Notas |
|--------|------|-------------|--------|
| `id` | uuid | sim | PK |
| `appointmentId` | uuid | sim | FK → `appointments.id` ON DELETE CASCADE |
| `authorId` | uuid | sim | Referência lógica ao autor (`users.id`); na migration inicial **não** há FK declarada no banco para esta coluna. |
| `content` | text | sim | |
| `createdAt` | timestamp | sim | |

## Ordem das migrations

1. `1732646400000-Initial` — cria `patients` e `appointments` (schema legado mínimo).
2. `1732750000000-MultiTenantAuth` — `tenants`, `users`, enriquece pacientes/atendimentos, `appointment_notes`, associa dados legados ao tenant padrão.
3. `1732750000001-SeedInitial` — insere usuários demo, paciente e atendimento (idempotente com `ON CONFLICT` onde aplicável).

## Tenant e dados de demonstração (seed)

- Tenant padrão da migration multi-tenant: **Clínica Legacy**, `slug` `legacy`, `id` `11111111-1111-4111-8111-111111111111`.
- Usuários seed: e-mails `@clinica-legacy.local`; senha em texto plano de referência: `Senha123!` (armazenado como hash na coluna `passwordHash`).
