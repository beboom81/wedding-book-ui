export interface ApiResponse<T> {
  code: number;
  data: T;
  error: string[] | null;
  id?: string;
}

export interface CommentItem {
  uuid: string;
  own?: string;
  name: string;
  presence: boolean;
  comment: string | null;
  created_at: string;
  is_admin: boolean;
  is_parent: boolean;
  gif_url: string | null;
  ip?: string | null;
  user_agent?: string | null;
  comments: CommentItem[];
  like_count: number;
}

export interface CommentListV2 {
  count: number;
  lists: CommentItem[];
}

export interface UserDetail {
  name: string;
  email: string;
  access_key: string | null;
  is_filter: boolean;
  can_edit: boolean;
  can_delete: boolean;
  can_reply: boolean;
  tenor_key: string | null;
  is_confetti_animation: boolean;
  tz: string | null;
}

export interface GuestConfig {
  tz: string | null;
  can_edit: boolean;
  can_delete: boolean;
  can_reply: boolean;
  tenor_key: string | null;
  is_confetti_animation: boolean;
}

export interface Stats {
  present: number;
  absent: number;
  likes: number;
  comments: number;
}

export interface LoginResponse {
  token: string;
  user: { name: string; email: string };
}
