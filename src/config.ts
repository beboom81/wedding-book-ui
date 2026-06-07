/**
 * Central app configuration, sourced from Vite env vars. These replace the
 * `data-*` attributes the original HTML put on <body>.
 */
const env = import.meta.env;

export const config = {
  /** API base url (the C# backend). */
  apiUrl: (env.VITE_API_URL as string) || 'http://localhost:5080/',

  /** Guest access key for the comment feature ("" disables comments). */
  guestKey: (env.VITE_GUEST_KEY as string) || '',

  /** Countdown target. */
  weddingTime: (env.VITE_WEDDING_TIME as string) || '2026-10-13 18:00:00',

  /** Background music url ("" disables). */
  audio: (env.VITE_AUDIO as string) ?? '/assets/music/pure-love-304010.mp3',

  /** Confetti on open (only when comments disabled). */
  confetti: ((env.VITE_CONFETTI as string) ?? 'true') === 'true',
};

/** Resolves an asset path against the configured Vite base url. */
export const asset = (path: string): string => {
  const base = (import.meta.env.BASE_URL || '/').replace(/\/$/, '');
  const clean = path.startsWith('/') ? path : `/${path}`;
  return `${base}${clean}`;
};
