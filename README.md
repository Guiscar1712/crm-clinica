# CRM Médico (Mini CRM de Atendimento)

Monorepo com **API NestJS** (PostgreSQL, JWT, multi-tenant) e **interface React** (Vite, shadcn/ui) para gestão de **clínicas**, **pacientes**, **usuários** e **atendimentos** (agenda / fila de status).

## Funcionalidades

| Área | O que faz |
|------|-----------|
| **Autenticação** | Login vinculados a um tenant; JWT no `localStorage`; rota `/auth/me` retorna perfil completo. |
| **Tenants** | Cadastro de clínica (`slug`, documento, contato, cores opcionais); isolamento de dados por `tenantId` (nunca enviado manualmente no body — vem do token). |
| **Usuários e papéis** | CRUD com RBAC (`ADMIN`, `MANAGER`, `ATTENDANT`, `VIEWER`, etc.). Permissões controlam acesso a telas e ações (ex.: gerenciar tenant, listar usuários). |
| **Pacientes** | Cadastro com dados pessoais, endereço, plano de saúde e observações; listagem paginada com busca; ativar/desativar; integração opcional com ViaCEP no formulário. |
| **Atendimentos** | Criação com tipo, prioridade, agendamento e descrição; fluxo de status (`AGUARDANDO` → `EM_ATENDIMENTO` → `FINALIZADO` ou cancelamento com motivo); notas por atendimento. |
| **Dashboard** | Visão resumida na área logada (métricas / gráficos conforme implementação atual). |
| **Configurações da clínica** | Tela para administradores ajustarem dados do tenant (quando a API permitir). |

Documentação complementar:

- [Estrutura do banco](docs/DATABASE.md)
- [Módulos do backend](docs/MODULOS.md)

## Usuários para testes (seed)

Após rodar as migrations (incluindo a seed), use o tenant **Clínica Legacy** e estes logins. **Senha para todos:** `Senha123!`

| E-mail | Papel | Observação |
|--------|-------|------------|
| `admin@clinica-legacy.local` | ADMIN | Acesso amplo, gestão de usuários e configurações. |
| `atendente@clinica-legacy.local` | ATTENDANT | Operação do dia a dia (pacientes e atendimentos). |
| `viewer@clinica-legacy.local` | VIEWER | Leitura restrita (sem criar/editar conforme regras de permissão). |

**ID do tenant (seed):** `11111111-1111-4111-8111-111111111111`

O seed também cria um paciente de demonstração (**Maria Silva Santos**) e um atendimento de exemplo com nota.

## Como executar com Docker

Na raiz do repositório:

```bash
docker compose up --build
```

Padrão de portas no host (evita conflitos comuns):

- PostgreSQL: `55432` → `5432` no container
- API: `http://localhost:3001` → aplicação na porta `3000` no container
- Frontend: `http://localhost:18080` → Nginx servindo o build estático e fazendo proxy de `/api` para o backend

Variáveis opcionais: `CRM_DB_PORT`, `CRM_API_PORT`, `CRM_WEB_PORT`, `JWT_SECRET`.

## Desenvolvimento local

### Backend

```bash
cd backend
cp .env.example .env  # ajuste DATABASE_URL, JWT_SECRET, etc.
npm ci
npm run build
npm run migration:run
npm run start:dev
```

### Frontend

```bash
cd frontend
npm ci
cp .env.example .env.local  # opcional: API_PROXY_TARGET para apontar o proxy Vite
npm run dev
```

O Vite usa proxy de `/api` para o backend (por padrão `http://127.0.0.1:3001`; ajuste com `API_PROXY_TARGET` se a API estiver em outra porta).