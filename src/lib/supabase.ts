import { createClient } from '@supabase/supabase-js';
import type { User } from '../types';

// These environment variables will be provided by Supabase connection
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || '';
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || '';

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error('Missing Supabase environment variables');
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

export async function getUserProfile(userId: string): Promise<User | null> {
  try {
    const { data, error } = await supabase
      .from('users')
      .select('*')
      .eq('id', userId)
      .maybeSingle();

    if (error) {
      console.error('Error fetching user profile:', error);
      throw error;
    }

    return data as User | null;
  } catch (error) {
    console.error('Unexpected error fetching user profile:', error);
    throw error;
  }
}

export async function createUserProfile(userId: string, email: string): Promise<User | null> {
  try {
    const newUser = {
      id: userId,
      email,
      is_premium: false,
      is_admin: false,
      is_banned: false,
      replies_generated: 0,
      shared_once: false,
      created_at: new Date().toISOString(),
    };

    const { data, error } = await supabase
      .from('users')
      .insert([newUser])
      .select()
      .single();

    if (error) {
      console.error('Error creating user profile:', error);
      throw error;
    }

    return data as User;
  } catch (error) {
    console.error('Unexpected error creating user profile:', error);
    throw error;
  }
}

export async function incrementRepliesGenerated(userId: string): Promise<boolean> {
  try {
    const { error } = await supabase.rpc('increment_replies_generated');

    if (error) {
      console.error('Error incrementing replies generated:', error);
      throw error;
    }

    return true;
  } catch (error) {
    console.error('Unexpected error incrementing replies:', error);
    throw error;
  }
}

export async function markAsShared(userId: string): Promise<boolean> {
  try {
    const { error } = await supabase
      .from('users')
      .update({ shared_once: true })
      .eq('id', userId);

    if (error) {
      console.error('Error marking as shared:', error);
      throw error;
    }

    return true;
  } catch (error) {
    console.error('Unexpected error marking as shared:', error);
    throw error;
  }
}

export async function getAllUsers(): Promise<User[]> {
  try {
    const { data, error } = await supabase
      .from('users')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Error fetching all users:', error);
      throw error;
    }

    return data as User[];
  } catch (error) {
    console.error('Unexpected error fetching all users:', error);
    throw error;
  }
}

export async function updateUserAdmin(userId: string, updates: Partial<User>): Promise<boolean> {
  try {
    const { error } = await supabase
      .from('users')
      .update(updates)
      .eq('id', userId);

    if (error) {
      console.error('Error updating user from admin:', error);
      throw error;
    }

    return true;
  } catch (error) {
    console.error('Unexpected error updating user from admin:', error);
    throw error;
  }
}

export async function createAnnouncement(message: string): Promise<boolean> {
  try {
    const { error } = await supabase
      .from('announcements')
      .insert([{
        message,
        active: true
      }]);

    if (error) {
      console.error('Error creating announcement:', error);
      throw error;
    }

    return true;
  } catch (error) {
    console.error('Unexpected error creating announcement:', error);
    throw error;
  }
}

export async function dismissAnnouncement(id: string): Promise<boolean> {
  try {
    const { error } = await supabase
      .from('announcements')
      .update({ active: false })
      .eq('id', id);

    if (error) {
      console.error('Error dismissing announcement:', error);
      throw error;
    }

    return true;
  } catch (error) {
    console.error('Unexpected error dismissing announcement:', error);
    throw error;
  }
}

export async function getLatestAnnouncement() {
  try {
    const { data, error } = await supabase
      .from('announcements')
      .select('*')
      .eq('active', true)
      .order('created_at', { ascending: false })
      .limit(1);

    if (error) {
      console.error('Error fetching latest announcement:', error);
      throw error;
    }

    return data ? data[0] : null;
  } catch (error) {
    console.error('Unexpected error fetching latest announcement:', error);
    throw error;
  }
}

export async function getVisitCount(): Promise<number> {
  try {
    const { data, error } = await supabase
      .from('app_stats')
      .select('visits')
      .single();

    if (error) {
      console.error('Error fetching visit count:', error);
      throw error;
    }

    return data?.visits || 0;
  } catch (error) {
    console.error('Unexpected error fetching visit count:', error);
    throw error;
  }
}