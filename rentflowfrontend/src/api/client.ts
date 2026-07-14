import { API_URL } from './config';

/** Error thrown for any non-2xx response or network failure. */
export class ApiError extends Error {
  /** HTTP status code, or 0 for a network-level failure. */
  status: number;

  constructor(status: number, message: string) {
    super(message);
    this.name = 'ApiError';
    this.status = status;
  }
}

/**
 * Bearer token used for authenticated requests. The auth store keeps this in
 * sync so every request module can stay stateless. Held in memory only — it's
 * cleared on reload (see the auth store for the persistence follow-up).
 */
let authToken: string | null = null;

export function setAuthToken(token: string | null) {
  authToken = token;
}

export function getAuthToken() {
  return authToken;
}

type Method = 'GET' | 'POST' | 'PUT' | 'DELETE';

function parseBody(text: string): unknown {
  if (!text) return null;
  try {
    return JSON.parse(text);
  } catch {
    // Backend occasionally returns a plain-text error body.
    return text;
  }
}

function extractMessage(body: unknown, status: number): string {
  if (body && typeof body === 'object') {
    const record = body as Record<string, unknown>;
    const message = record.error ?? record.message;
    if (typeof message === 'string' && message.length > 0) return message;
  }
  if (typeof body === 'string' && body.length > 0) return body;
  return `Request failed with status ${status}`;
}

async function request<T>(method: Method, path: string, body?: unknown): Promise<T> {
  const headers: Record<string, string> = { Accept: 'application/json' };
  if (body !== undefined) headers['Content-Type'] = 'application/json';
  if (authToken) headers.Authorization = `Bearer ${authToken}`;

  let response: Response;
  try {
    response = await fetch(`${API_URL}${path}`, {
      method,
      headers,
      body: body !== undefined ? JSON.stringify(body) : undefined,
    });
  } catch {
    throw new ApiError(
      0,
      'Cannot reach the server. Check your connection and that the backend is running.',
    );
  }

  const parsed = parseBody(await response.text());
  if (!response.ok) {
    throw new ApiError(response.status, extractMessage(parsed, response.status));
  }
  return parsed as T;
}

export const api = {
  get: <T>(path: string) => request<T>('GET', path),
  post: <T>(path: string, body?: unknown) => request<T>('POST', path, body),
  put: <T>(path: string, body?: unknown) => request<T>('PUT', path, body),
  del: <T>(path: string) => request<T>('DELETE', path),
};
