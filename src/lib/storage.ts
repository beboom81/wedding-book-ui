/**
 * Tiny localStorage-backed key/value map, one JSON object per `table`.
 * Used for guest-side state the API doesn't return: `own` tokens (to edit/delete
 * your own comments) and `like` tokens (to unlike). Ported from storage.js.
 */
export const storage = (table: string) => {
  const read = (): Record<string, unknown> => {
    try {
      return JSON.parse(localStorage.getItem(table) || '{}');
    } catch {
      return {};
    }
  };

  if (!localStorage.getItem(table)) {
    localStorage.setItem(table, '{}');
  }

  return {
    get<T = unknown>(key: string): T | undefined {
      return read()[key] as T | undefined;
    },
    set(key: string, value: unknown): void {
      const data = read();
      data[key] = value;
      localStorage.setItem(table, JSON.stringify(data));
    },
    has(key: string): boolean {
      return Object.keys(read()).includes(key);
    },
    unset(key: string): void {
      const data = read();
      if (key in data) {
        delete data[key];
        localStorage.setItem(table, JSON.stringify(data));
      }
    },
    clear(): void {
      localStorage.setItem(table, '{}');
    },
  };
};
