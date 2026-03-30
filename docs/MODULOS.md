# Módulos do backend (NestJS)

A API em `backend/src` segue **Clean Architecture** por bounded context: cada módulo de negócio tem pastas **`domain`** (entidades e contratos), **`application`** (casos de uso) e **`infra`** (HTTP Nest, TypeORM, wiring). Código transversal fica em `src/shared/` (paginação, JWT, hash de senha, decorators, etc.).

## `AppModule` (`app.module.ts`)

Ponto de entrada: carrega `ConfigModule`, `TypeOrmModule` (PostgreSQL, entidades registradas explicitamente) e importa todos os módulos de feature abaixo.

## `modules/auth`

**Responsabilidade:** login, registro de usuário em tenant existente, emissão e validação de JWT, endpoint `GET /auth/me`.

- **Application:** casos de uso de autenticação (validar credenciais, gerar token, registrar usuário com perfil mínimo).
- **Infra:** `AuthController`, guards JWT, integração com repositório de usuários e serviço de hash; `tenantId` e `userId` extraídos do token para escopo.

## `modules/users`

**Responsabilidade:** CRUD de usuários **dentro do tenant** do token; alteração de papel (`role`) onde permitido; desativação (`DELETE` lógico ou por flag conforme implementação).

- **Domain:** entidade de usuário e regras ligadas a papéis.
- **Application:** criar/atualizar/listar usuários respeitando RBAC.
- **Infra:** `UsersController`, `UserTypeOrmEntity`, repositório TypeORM.

## `modules/tenants`

**Responsabilidade:** criação de tenant (setup público), leitura e atualização por administradores (`GET`/`PATCH` com autorização).

- **Domain:** tenant como agregado (nome, slug, branding opcional).
- **Infra:** `TenantTypeOrmEntity`, controller e persistência.

## `modules/patients`

**Responsabilidade:** cadastro e manutenção de pacientes; listagem paginada com filtros; mapeamento entre modelo de domínio e colunas planas de endereço no ORM.

- **Domain:** `Patient`, objetos de valor (ex.: endereço), enum de gênero.
- **Application:** criar, atualizar, listar, ativar/desativar, remover conforme políticas.
- **Infra:** `PatientTypeOrmRepository` (conversão `Date`/`string` vindas do Postgres).

## `modules/appointments`

**Responsabilidade:** ciclo de vida do atendimento (criação, mudança de status, cancelamento com motivo), notas (`appointment_notes`), atribuição opcional a `assignedUserId`.

- **Domain:** `Appointment`, transições de estado válidas, tipos e prioridades.
- **Application:** casos de uso alinhados às rotas REST (incluir nota, cancelar, etc.).
- **Infra:** entidades TypeORM de atendimento e nota, controllers, repositórios.

## Fluxo típico de uma requisição autenticada

1. Guard JWT valida o token e anexa payload ao request.
2. Decorators (`@CurrentTenant()`, usuário atual) definem o **tenant** e o **ator**.
3. Caso de uso consulta repositórios sempre filtrando por `tenantId` — o cliente **não** escolhe o tenant no corpo da requisição para dados já isolados.

## Migrations e CLI

- Scripts em `package.json` usam `data-source.ts`: lista de `entities` vazia para `migration:run` / `migration:revert` sem carregar metadados de entidades; caminhos de migration apontam para `dist/migrations/*.js` após `npm run build`.

Para detalhes de tabelas e FKs, veja [DATABASE.md](DATABASE.md).
