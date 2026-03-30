const BASE =
  (import.meta.env.VITE_API_URL as string | undefined)?.replace(/\/$/, '') ?? '/api';

const AUTH_TOKEN_KEY = 'mini_crm_token';

export function getApiBase(): string {
  return BASE;
}

export function getStoredToken(): string | null {
  return localStorage.getItem(AUTH_TOKEN_KEY);
}

export function setStoredToken(token: string): void {
  localStorage.setItem(AUTH_TOKEN_KEY, token);
}

export function clearStoredToken(): void {
  localStorage.removeItem(AUTH_TOKEN_KEY);
}

function parseErrorMessage(body: unknown): string {
  if (!body || typeof body !== 'object') return 'Erro desconhecido';
  const m = (body as { message?: unknown }).message;
  if (typeof m === 'string') return m;
  if (Array.isArray(m)) return m.filter((x) => typeof x === 'string').join('; ') || 'Requisição inválida';
  return 'Erro desconhecido';
}

export async function apiFetch<T>(path: string, options: RequestInit = {}): Promise<T> {
  const token = getStoredToken();
  const baseHeaders: Record<string, string> = {
    ...(options.headers as Record<string, string> | undefined),
  };
  if (options.body != null && baseHeaders['Content-Type'] == null) {
    baseHeaders['Content-Type'] = 'application/json';
  }
  if (token) {
    baseHeaders['Authorization'] = `Bearer ${token}`;
  }

  const res = await fetch(`${BASE}${path.startsWith('/') ? path : `/${path}`}`, {
    ...options,
    headers: baseHeaders,
  });

  if (!res.ok) {
    const body = await res.json().catch(() => null);
    throw new Error(parseErrorMessage(body));
  }

  if (res.status === 204) {
    return undefined as T;
  }

  const text = await res.text();
  if (!text) return undefined as T;
  return JSON.parse(text) as T;
}
