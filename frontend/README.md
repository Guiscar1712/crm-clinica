# CRM Médico — Frontend

Interface **React 18** + **Vite** + **TypeScript**, com **shadcn/ui** e **TanStack Query**. Consome a API NestJS em `/api` (proxy no desenvolvimento e Nginx em produção no Docker).

## Scripts

- `npm run dev` — servidor de desenvolvimento (porta padrão `8080`).
- `npm run build` — build para produção (`dist/`).
- `npm run preview` — pré-visualização do build.
- `npm run lint` — ESLint.
- `npm run test` — Vitest.

## Variáveis de ambiente

- `API_PROXY_TARGET` — URL do backend para o proxy Vite em `/api` (ex.: `http://127.0.0.1:3001`). Opcional; o padrão aponta para `3001`.
- `VITE_API_URL` — base da API no cliente (ex.: `/api` ou URL absoluta). Se omitido, usa `/api`.

## Documentação do produto

Funcionalidades, usuários de teste e como subir o monorepo estão no [README da raiz](../README.md).
