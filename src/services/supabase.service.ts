// src/services/supabase.service.ts
import { createClient } from '@supabase/supabase-js';
import { ActivityType } from '../types/activities.types';

const supabaseUrl = process.env.REACT_APP_SUPABASE_URL;
const supabaseAnonKey = process.env.REACT_APP_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error('Variáveis de ambiente do Supabase não configuradas');
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

export interface Workout {
  id?: string;
  type: ActivityType;
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
  },

  // Buscar último peso de um exercício específico
  async getLastExerciseWeight(exerciseId: number, workoutType: 'A' | 'B'): Promise<number | null> {
    try {
      const { data, error } = await supabase
        .from('workouts')
        .select('details')
        .eq('type', 'academia')
        .filter('details->>workoutType', 'eq', workoutType)
        .order('date', { ascending: false })
        .limit(10);

      if (error) throw error;

      for (const workout of data || []) {
        if (workout.details?.executionData && workout.details.executionData[exerciseId]) {
          return workout.details.executionData[exerciseId].weight;
        }
      }

      return null;
    } catch (error) {
      console.error('Erro ao buscar último peso:', error);
      return null;
    }
  },

  // Buscar histórico de pesos de um exercício
  async getExerciseWeightHistory(exerciseId: number, workoutType: 'A' | 'B'): Promise<Array<{ date: Date; weight: number }>> {
    try {
      const { data, error } = await supabase
        .from('workouts')
        .select('date, details')
        .eq('type', 'academia')
        .filter('details->>workoutType', 'eq', workoutType)
        .order('date', { ascending: false })
        .limit(20);

      if (error) throw error;

      const history: Array<{ date: Date; weight: number }> = [];

      for (const workout of data || []) {
        if (workout.details?.executionData && workout.details.executionData[exerciseId]) {
          history.push({
            date: new Date(workout.date),
            weight: workout.details.executionData[exerciseId].weight
          });
        }
      }

      return history;
    } catch (error) {
      console.error('Erro ao buscar histórico de pesos:', error);
      return [];
    }
  }
};