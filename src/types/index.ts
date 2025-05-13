export interface User {
  id: string;
  email: string;
  is_premium: boolean;
  is_admin: boolean;
  is_banned: boolean;
  replies_generated: number;
  shared_once: boolean;
  created_at: string;
  note_admin?: string;
}

export interface AppState {
  user: User | null;
  loading: boolean;
  session: any | null;
}

export type ToneOption = 'Romantic' | 'Cheeky' | 'Savage' | 'Distant' | 'Crazy';

export interface GenerateReplyParams {
  message: string;
  tone: ToneOption;
}