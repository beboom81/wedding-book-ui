import { config } from '../config';
import type { ApiResponse } from './types';

export const HTTP_GET = 'GET';
export const HTTP_PUT = 'PUT';
export const HTTP_POST = 'POST';
export const HTTP_PATCH = 'PATCH';
export const HTTP_DELETE = 'DELETE';

export const HTTP_STATUS_OK = 200;
export const HTTP_STATUS_CREATED = 201;
export const HTTP_STATUS_INTERNAL_SERVER_ERROR = 500;

const defaultHeaders = {
  Accept: 'application/json',
  'Content-Type': 'application/json',
};

/**
 * A small fluent HTTP client mirroring the original `request.js`: it talks to
 * the C# API, attaches either a JWT bearer (admin) or the `x-access-key`
 * header (guest) via `.token()`, and unwraps the `{ id, data, error }` envelope.
 */
export const request = (method: string, path: string) => {
  const headers = new Headers(defaultHeaders);
  let body: string | undefined;
  let isDownload: string | null = null;

  const api = {
    /** Attach auth: a 3-part JWT goes as Bearer, anything else as access key. */
    token(token: string | null | undefined) {
      if (token && token.split('.').length === 3) {
        headers.set('Authorization', `Bearer ${token}`);
      } else if (token) {
        headers.set('x-access-key', token);
      }
      return api;
    },
    body(payload: unknown) {
      body = JSON.stringify(payload);
      return api;
    },
    /** Trigger a browser download (used for the CSV export). */
    download(filename: string) {
      isDownload = filename;
      return api;
    },
    async send<T = unknown>(): Promise<ApiResponse<T>> {
      const url = new URL(path.replace(/^\//, ''), config.apiUrl);

      let res: Response;
      try {
        res = await fetch(url.toString(), { method, headers, body });
      } catch {
        const message = '🟥 Network error or rate limit exceeded';
        window.alert(message);
        throw new Error(message);
      }

      if (isDownload && res.ok) {
        const blob = await res.blob();
        const cd = res.headers.get('Content-Disposition');
        const name = cd?.match(/filename="?([^"]+)"?/)?.[1] ?? isDownload;
        const href = URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = href;
        link.download = name;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        URL.revokeObjectURL(href);
        return { code: res.status, data: res as unknown as T, error: null };
      }

      const json = await res.json();
      if (json.error) {
        const msg = json.error[0];
        const isServer = res.status >= HTTP_STATUS_INTERNAL_SERVER_ERROR;
        const text = isServer ? `ID: ${json.id}\n🟥 ${msg}` : `🟨 ${msg}`;
        window.alert(text);
        throw new Error(msg);
      }

      return { ...json, code: res.status } as ApiResponse<T>;
    },
  };

  return api;
};
