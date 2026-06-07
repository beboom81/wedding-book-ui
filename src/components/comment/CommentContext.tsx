import { createContext, useCallback, useContext, useMemo, useRef, useState } from 'react';
import type { ReactNode } from 'react';
import {
  request,
  HTTP_GET,
  HTTP_POST,
  HTTP_PUT,
  HTTP_DELETE,
  HTTP_PATCH,
  HTTP_STATUS_CREATED,
} from '../../lib/api';
import { storage } from '../../lib/storage';
import { notify } from '../../lib/util';
import type { CommentItem, CommentListV2, GuestConfig } from '../../lib/types';

interface CreatePayload {
  id: string | null;
  name: string;
  presence: boolean;
  comment: string | null;
  gif_id: string | null;
}

interface UpdatePayload {
  presence: boolean | null;
  comment: string | null;
  gif_id: string | null;
}

interface CommentContextValue {
  token: string;
  isAdmin: boolean;
  config: GuestConfig | null;
  lists: CommentItem[];
  count: number;
  loading: boolean;
  per: number;
  page: number;
  totalPages: number;
  owns: ReturnType<typeof storage>;
  likes: ReturnType<typeof storage>;
  reload: () => Promise<void>;
  nextPage: () => void;
  prevPage: () => void;
  create: (p: CreatePayload) => Promise<CommentItem | null>;
  update: (own: string, p: UpdatePayload) => Promise<boolean>;
  remove: (own: string) => Promise<boolean>;
  like: (uuid: string) => Promise<void>;
  unlike: (uuid: string) => Promise<void>;
}

const Ctx = createContext<CommentContextValue | undefined>(undefined);

export function CommentProvider({
  token,
  isAdmin,
  config,
  children,
}: {
  token: string;
  isAdmin: boolean;
  config: GuestConfig | null;
  children: ReactNode;
}) {
  const per = 10;
  const [page, setPage] = useState(0); // offset
  const [lists, setLists] = useState<CommentItem[]>([]);
  const [count, setCount] = useState(0);
  const [loading, setLoading] = useState(false);
  const owns = useRef(storage('weddingbook_owns')).current;
  const likes = useRef(storage('weddingbook_likes')).current;

  const reload = useCallback(async () => {
    if (!token) {
      return;
    }
    setLoading(true);
    try {
      const res = await request(HTTP_GET, `/api/v2/comment?per=${per}&next=${page}`)
        .token(token)
        .send<CommentListV2>();
      setLists(res.data.lists);
      setCount(res.data.count);
    } catch {
      // error already surfaced by request()
    } finally {
      setLoading(false);
    }
  }, [token, page]);

  const create = useCallback(
    async (p: CreatePayload): Promise<CommentItem | null> => {
      const res = await request(HTTP_POST, '/api/comment').token(token).body(p).send<CommentItem>();
      if (res.code !== HTTP_STATUS_CREATED) {
        return null;
      }
      if (res.data.own) {
        owns.set(res.data.uuid, res.data.own);
      }
      await reload();
      return res.data;
    },
    [token, owns, reload],
  );

  const update = useCallback(
    async (own: string, p: UpdatePayload): Promise<boolean> => {
      const res = await request(HTTP_PUT, `/api/comment/${own}`)
        .token(token)
        .body(p)
        .send<{ status: boolean }>();
      const ok = !!res.data?.status;
      if (ok) {
        await reload();
      }
      return ok;
    },
    [token, reload],
  );

  const remove = useCallback(
    async (own: string): Promise<boolean> => {
      const res = await request(HTTP_DELETE, `/api/comment/${own}`)
        .token(token)
        .send<{ status: boolean }>();
      const ok = !!res.data?.status;
      if (ok) {
        await reload();
      }
      return ok;
    },
    [token, reload],
  );

  const like = useCallback(
    async (uuid: string): Promise<void> => {
      try {
        const res = await request(HTTP_POST, `/api/comment/${uuid}`)
          .token(token)
          .send<{ uuid: string }>();
        if (res.code === HTTP_STATUS_CREATED) {
          likes.set(uuid, res.data.uuid);
          await reload();
        }
      } catch {
        /* surfaced */
      }
    },
    [token, likes, reload],
  );

  const unlike = useCallback(
    async (uuid: string): Promise<void> => {
      const likeId = likes.get<string>(uuid);
      if (!likeId) {
        return;
      }
      try {
        const res = await request(HTTP_PATCH, `/api/comment/${likeId}`)
          .token(token)
          .send<{ status: boolean }>();
        if (res.data?.status) {
          likes.unset(uuid);
          await reload();
        }
      } catch {
        /* surfaced */
      }
    },
    [token, likes, reload],
  );

  const totalPages = Math.max(1, Math.ceil(count / per));

  const nextPage = useCallback(() => {
    setPage((p) => (p + per < count ? p + per : p));
  }, [count]);

  const prevPage = useCallback(() => {
    setPage((p) => Math.max(0, p - per));
  }, []);

  const value = useMemo<CommentContextValue>(
    () => ({
      token,
      isAdmin,
      config,
      lists,
      count,
      loading,
      per,
      page,
      totalPages,
      owns,
      likes,
      reload,
      nextPage,
      prevPage,
      create,
      update,
      remove,
      like,
      unlike,
    }),
    [token, isAdmin, config, lists, count, loading, page, totalPages, owns, likes, reload, nextPage, prevPage, create, update, remove, like, unlike],
  );

  return <Ctx.Provider value={value}>{children}</Ctx.Provider>;
}

// eslint-disable-next-line react-refresh/only-export-components
export function useComments(): CommentContextValue {
  const ctx = useContext(Ctx);
  if (!ctx) {
    throw new Error('useComments must be used within CommentProvider');
  }
  return ctx;
}

export function notifyEmptyName(): void {
  notify('Name cannot be empty.').warning();
}
