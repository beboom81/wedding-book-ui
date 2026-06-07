import { request, HTTP_POST, HTTP_STATUS_OK } from './api';
import type { LoginResponse } from './types';

const KEY = 'weddingbook_token';

/** JWT/admin session helpers. Ported from session.js (admin path only). */
export const session = {
  getToken(): string | null {
    return localStorage.getItem(KEY);
  },

  setToken(token: string): void {
    localStorage.setItem(KEY, token);
  },

  logout(): void {
    localStorage.removeItem(KEY);
  },

  /** A 3-part token is a JWT, i.e. an authenticated admin. */
  isAdmin(): boolean {
    return (this.getToken() ?? '.').split('.').length === 3;
  },

  decode(): { exp?: number; sub?: string } | null {
    if (!this.isAdmin()) {
      return null;
    }
    try {
      const payload = this.getToken()!.split('.')[1];
      const json = atob(payload.replace(/-/g, '+').replace(/_/g, '/'));
      return JSON.parse(decodeURIComponent(escape(json)));
    } catch {
      return null;
    }
  },

  /** True when the admin JWT is present and not expired. */
  isValid(): boolean {
    if (!this.isAdmin()) {
      return false;
    }
    return (this.decode()?.exp ?? 0) > Date.now() / 1000;
  },

  async login(email: string, password: string): Promise<boolean> {
    const res = await request(HTTP_POST, '/api/session')
      .body({ email, password })
      .send<LoginResponse>();

    if (res.code === HTTP_STATUS_OK && res.data?.token) {
      this.setToken(res.data.token);
      return true;
    }
    return false;
  },
};
