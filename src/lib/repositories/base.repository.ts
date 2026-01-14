import { supabase } from '@/integrations/supabase/client';
import type { PostgrestError } from '@supabase/supabase-js';

export type RepositoryResult<T> = {
  data: T | null;
  error: PostgrestError | Error | null;
};

export type RepositoryListResult<T> = {
  data: T[];
  error: PostgrestError | Error | null;
};

/**
 * Helper function to create typed Supabase queries
 * Used to work around TypeScript limitations with generic Supabase client
 */
export function getSupabaseClient() {
  return supabase;
}

/**
 * Generic repository helper functions
 * These provide a consistent interface for Supabase operations
 */
export const repositoryHelpers = {
  async findById<T>(
    tableName: string,
    id: string
  ): Promise<RepositoryResult<T>> {
    const { data, error } = await supabase
      .from(tableName as 'migrei_phases')
      .select('*')
      .eq('id' as never, id as never)
      .maybeSingle();

    return { data: data as T | null, error };
  },

  async findAll<T>(
    tableName: string,
    options?: {
      orderBy?: string;
      ascending?: boolean;
      limit?: number;
    }
  ): Promise<RepositoryListResult<T>> {
    let query = supabase.from(tableName as 'migrei_phases').select('*');

    if (options?.orderBy) {
      query = query.order(options.orderBy as never, { 
        ascending: options.ascending ?? true 
      });
    }

    if (options?.limit) {
      query = query.limit(options.limit);
    }

    const { data, error } = await query;
    return { data: (data as T[]) || [], error };
  },

  async findByUserId<T>(
    tableName: string,
    userId: string
  ): Promise<RepositoryListResult<T>> {
    const { data, error } = await supabase
      .from(tableName as 'user_progress')
      .select('*')
      .eq('user_id' as never, userId as never);

    return { data: (data as T[]) || [], error };
  },

  async findOneByUserId<T>(
    tableName: string,
    userId: string
  ): Promise<RepositoryResult<T>> {
    const { data, error } = await supabase
      .from(tableName as 'user_progress')
      .select('*')
      .eq('user_id' as never, userId as never)
      .maybeSingle();

    return { data: data as T | null, error };
  },

  async create<T>(
    tableName: string,
    entity: Partial<T>
  ): Promise<RepositoryResult<T>> {
    const { data, error } = await supabase
      .from(tableName as 'user_progress')
      .insert(entity as never)
      .select()
      .single();

    return { data: data as T | null, error };
  },

  async update<T>(
    tableName: string,
    id: string,
    updates: Partial<T>
  ): Promise<RepositoryResult<T>> {
    const { data, error } = await supabase
      .from(tableName as 'user_progress')
      .update(updates as never)
      .eq('id' as never, id as never)
      .select()
      .single();

    return { data: data as T | null, error };
  },

  async updateByUserId<T>(
    tableName: string,
    userId: string,
    updates: Partial<T>
  ): Promise<RepositoryResult<T>> {
    const { data, error } = await supabase
      .from(tableName as 'user_progress')
      .update(updates as never)
      .eq('user_id' as never, userId as never)
      .select()
      .single();

    return { data: data as T | null, error };
  },

  async delete(
    tableName: string,
    id: string
  ): Promise<{ error: PostgrestError | null }> {
    const { error } = await supabase
      .from(tableName as 'user_progress')
      .delete()
      .eq('id' as never, id as never);

    return { error };
  },

  async upsert<T>(
    tableName: string,
    entity: Partial<T>,
    onConflict?: string
  ): Promise<RepositoryResult<T>> {
    const { data, error } = await supabase
      .from(tableName as 'user_progress')
      .upsert(entity as never, { onConflict })
      .select()
      .single();

    return { data: data as T | null, error };
  },
};
