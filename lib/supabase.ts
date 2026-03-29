import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://placeholder-project.supabase.co';
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || 'placeholder-anon-key';

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

export type UserRole = 'UNIT' | 'TIM_MUTU';

export interface User {
  id: string;
  username: string; // Unit name or "Tim Mutu RS"
  role: UserRole;
}

// Mock auth state for preview purposes since we don't have real Supabase keys
export const mockAuth = {
  user: null as User | null,
  login: (username: string, role: UserRole) => {
    mockAuth.user = { id: '1', username, role };
    if (typeof window !== 'undefined') {
      localStorage.setItem('optimus_user', JSON.stringify(mockAuth.user));
    }
  },
  logout: () => {
    mockAuth.user = null;
    if (typeof window !== 'undefined') {
      localStorage.removeItem('optimus_user');
    }
  },
  getUser: () => {
    if (!mockAuth.user && typeof window !== 'undefined') {
      const stored = localStorage.getItem('optimus_user');
      if (stored) mockAuth.user = JSON.parse(stored);
    }
    return mockAuth.user;
  }
};
