// src/services/supabase.service.ts
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.REACT_APP_SUPABASE_URL;
const supabaseAnonKey = process.env.REACT_APP_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error('Variáveis de ambiente do Supabase não configuradas');
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

export interface Workout {
  id?: string;
  type: 'academia' | 'natacao' | 'pilates';
  date: Date;
  duration: number;
  calories: number;
  heart_rate: number;
  details: any;
  notes?: string;
}

export const workoutService = {

  async save(workout: Workout) {
    const { data, error } = await supabase
      .from('workouts')
      .insert([{
        ...workout,
        date: workout.date.toISOString()
      }])
      .select();
    
    if (error) {
      console.error('Erro ao salvar:', error);
      throw error;
    }
    return data;
  },

  async getAll() {
    const { data, error } = await supabase
      .from('workouts')
      .select('*')
      .order('date', { ascending: false });
    
    if (error) {
      console.error('Erro ao buscar:', error);
      throw error;
    }
    return data || [];
  },

  async getByType(type: string) {
    const { data, error } = await supabase
      .from('workouts')
      .select('*')
      .eq('type', type)
      .order('date', { ascending: false });
    
    if (error) {
      console.error('Erro ao buscar por tipo:', error);
      throw error;
    }
    return data || [];
  },

  async delete(id: string) {
    const { error } = await supabase
      .from('workouts')
      .delete()
      .eq('id', id);
    
    if (error) {
      console.error('Erro ao deletar:', error);
      throw error;
    }
  },

  async update(id: string, updates: Partial<Workout>) {
    const { data, error } = await supabase
      .from('workouts')
      .update(updates)
      .eq('id', id)
      .select();
    
    if (error) {
      console.error('Erro ao atualizar:', error);
      throw error;
    }
    return data;
  }
};