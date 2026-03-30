# Mini CRM de Atendimento — Backend

API NestJS com **Clean Architecture** (domain / application / infra), TypeORM e PostgreSQL.

## Como subir tudo com Docker

Na raiz do monorepo:

```bash
docker compose up --build
```

Isso sobe PostgreSQL (**host `55432` → container 5432**), o backend (**API em `http://localhost:3001`**) e o frontend (**`http://localhost:18080`** — padrão evita conflito com Vite na 8080). Você pode mudar com `CRM_DB_PORT`, `CRM_API_PORT` e `CRM_WEB_PORT` no ambiente.

## Desenvolvimento local

1. Copie `.env.example` para `.env` e defina `DATABASE_URL`, `JWT_SECRET` e (opcional) `JWT_EXPIRES_IN`.
2. PostgreSQL acessível (ex.: `postgres://crm:crm@localhost:5432/crm`).
3. No diretório `backend`:

```bash
npm ci
npm run build
npm run migration:run
npm run start:dev
```

Com Docker Compose, defina `JWT_SECRET` no ambiente (há valor padrão no `docker-compose` apenas para desenvolvimento).

## Testes e2e

```bash
cd backend && npm run test:e2e
```

Os testes e2e usam **PostgreSQL** (URL configurada nos specs, ex.: host `127.0.0.1:5433`, banco `crm_medico_e2e`). É preciso ter o servidor acessível antes de rodar a suíte.

## Migrations

- `1732646400000-Initial`: `patients` e `appointments` (legado).
- `1732750000000-MultiTenantAuth`: `tenants`, `users`, evolução de `patients`/`appointments`, `appointment_notes` e tenant padrão para linhas existentes.
- Gerar novas: `npm run migration:generate` (ajuste o caminho em `src/migrations/`).
- Rodar: `npm run migration:run` (usa `dist/data-source.js` após o build).

Documentação complementar do monorepo: [Módulos (visão detalhada)](../docs/MODULOS.md) e [estrutura do banco](../docs/DATABASE.md).

## Decisões de arquitetura

1. **Camadas (Clean Architecture)**  
   O domínio não conhece Nest nem TypeORM; a aplicação orquestra casos de uso; a infraestrutura concentra HTTP, ORM e wiring. Isso facilita **testes unitários do domínio** e **trocar persistência ou framework** sem reescrever regras de negócio.

2. **Duas representações de entidade**  
   Entidades de domínio (classes puras) e entidades TypeORM (decorators) são distintas. O repositório na infra faz o **mapeamento explícito** entre elas, evitando vazar detalhes de banco para o núcleo e mantendo invariantes no domínio (ex.: transições de status do atendimento).

3. **Injeção com `Symbol`**  
   Interfaces de repositório e de use cases são registradas com tokens `Symbol` e implementações concretas via `useClass` nos módulos Nest. Assim o código da aplicação depende de **contratos**, não de classes de infraestrutura.

4. **Interfaces de use case (`ICreatePatientUseCase`, etc.)**  
   Cada caso de uso expõe um contrato mínimo (`execute`), alinhado ao SOLID e fácil de mockar em testes.

5. **Escopo**  
   O projeto é um **mini** CRM focado em pacientes e atendimentos com autenticação e RBAC básicos; recursos como auditoria formal, retenção legal de prontuário e integrações clínicas ficam fora do escopo deste repositório.

6. **PostgreSQL em todos os ambientes de integração**  
   A API e as migrations são pensadas para **PostgreSQL**. Os testes e2e também usam Postgres para aproximar o comportamento de produção.

## Referência da API

Rotas autenticadas esperam `Authorization: Bearer <token>`. O `tenantId` **nunca** vem do body para isolamento: é lido do JWT (`@CurrentTenant()`).

### Auth (público: login)

| Método | Rota | Descrição |
| ------ | ---- | ----------- |
| POST | /auth/login | Login por e-mail + senha |
| GET | /auth/me | Perfil (JWT obrigatório) |

### Tenants

| Método | Rota | Descrição |
| ------ | ---- | ----------- |
| POST | /tenants | Criar tenant (público — setup) |
| GET | /tenants/:id | Obter (ADMIN) |
| PATCH | /tenants/:id | Atualizar (ADMIN) |

### Users (JWT + papéis)

| Método | Rota | Papéis |
| ------ | ---- | ------ |
| POST | /users | ADMIN |
| GET | /users | ADMIN, MANAGER |
| GET | /users/:id | ADMIN, MANAGER |
| PATCH | /users/:id | ADMIN / SUPER_ADMIN ou próprio usuário |
| PATCH | /users/:id/role | ADMIN |
| DELETE | /users/:id | ADMIN (desativa) |

### Pacientes

| Método | Rota | Descrição |
| ------ | ---- | --------- |
| POST | /patients | Criar |
| GET | /patients | Listar paginado (`search`, `isActive`, `page`, `limit`) |
| GET | /patients/:id | Obter |
| PATCH | /patients/:id/activate | Ativar (`MANAGER`+) |
| PATCH | /patients/:id/deactivate | Desativar (`MANAGER`+) |
| PATCH | /patients/:id | Atualizar |
| DELETE | /patients/:id | Remover (`MANAGER`+) |

### Atendimentos (appointments)

| Método | Rota | Descrição |
| ------ | ---- | --------- |
| POST | /appointments | Criar (`AGUARDANDO`; tipo, prioridade, `scheduledAt` opcional) |
| GET | /appointments | Listar (filtros: `status`, `patientId`, `assignedUserId`, `type`, `priority`, `scheduledFrom`, `scheduledTo`) |
| GET | /appointments/:id | Obter |
| PATCH | /appointments/:id/status | Avançar (`EM_ATENDIMENTO` → `FINALIZADO`) |
| PATCH | /appointments/:id/cancel | Cancelar (com `reason`) |
| POST | /appointments/:id/notes | Nota clínica (`authorId` = usuário do JWT) |
| PATCH | /appointments/:id | Atualizar detalhes (`MANAGER`+) |
| DELETE | /appointments/:id | Remover (`MANAGER`+) |

## Estrutura de pastas (módulos)

Os bounded contexts ficam em `src/modules/*/`, com `domain`, `application` e `infra`. Código compartilhado fica em `src/shared/`.
