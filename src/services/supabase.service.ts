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
  user_id?: string;
}

export const workoutService = {

  async save(workout: Omit<Workout, 'id' | 'user_id'>) {
    const { data: { user } } = await supabase.auth.getUser();
    
    if (!user) {
      throw new Error('Usuário não autenticado');
    }
    
    console.log('💾 Salvando treino para usuário:', user.id);
    
    const { data, error } = await supabase
      .from('workouts')
      .insert([{
        ...workout,
        user_id: user.id,
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
    const { data: { user } } = await supabase.auth.getUser();
    
    if (!user) {
      throw new Error('Usuário não autenticado');
    }
    
    console.log('📊 Buscando treinos do usuário:', user.id);
    
    const { data, error } = await supabase
      .from('workouts')
      .select('*')
      .eq('user_id', user.id)
      .order('date', { ascending: false });
    
    if (error) {
      console.error('Erro ao buscar:', error);
      throw error;
    }
    return data || [];
  },

  async getByType(type: string) {
    const { data: { user } } = await supabase.auth.getUser();
    
    if (!user) {
      throw new Error('Usuário não autenticado');
    }
    
    const { data, error } = await supabase
      .from('workouts')
      .select('*')
      .eq('type', type)
      .eq('user_id', user.id)
      .order('date', { ascending: false });
    
    if (error) {
      console.error('Erro ao buscar por tipo:', error);
      throw error;
    }
    return data || [];
  },

  async delete(id: string) {
    const { data: { user } } = await supabase.auth.getUser();
    
    if (!user) {
      throw new Error('Usuário não autenticado');
    }
    
    console.log('🗑️ Deletando treino:', id, 'do usuário:', user.id);
    
    const { error } = await supabase
      .from('workouts')
      .delete()
      .eq('id', id)
      .eq('user_id', user.id);
    
    if (error) {
      console.error('Erro ao deletar:', error);
      throw error;
    }
  },

  async update(id: string, updates: Partial<Workout>) {
    const { data: { user } } = await supabase.auth.getUser();
    
    if (!user) {
      throw new Error('Usuário não autenticado');
    }
    
    const { data, error } = await supabase
      .from('workouts')
      .update(updates)
      .eq('id', id)
      .eq('user_id', user.id)
      .select();
    
    if (error) {
      console.error('Erro ao atualizar:', error);
      throw error;
    }
    return data;
  },

  async getLastExerciseWeight(exerciseId: number, workoutType: 'A' | 'B' | '1' | '2' | '3'): Promise<number | null> {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      
      if (!user) return null;
      
      const { data, error } = await supabase
        .from('workouts')
        .select('details')
        .eq('type', 'academia')
        .eq('user_id', user.id)
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

  async getExerciseWeightHistory(exerciseId: number, workoutType: 'A' | 'B' | '1' | '2' | '3'): Promise<Array<{ date: Date; weight: number }>> {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      
      if (!user) return [];
      
      const { data, error } = await supabase
        .from('workouts')
        .select('date, details')
        .eq('type', 'academia')
        .eq('user_id', user.id)
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
  },

  // Buscar último registro completo de um exercício (geral)
  async getLastExerciseRecord(exerciseId: number, workoutType: '1' | '2' | '3'): Promise<{
    weight: number;
    variationName?: string;
    observations?: string;
  } | null> {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return null;
      
      const { data, error } = await supabase
        .from('workouts')
        .select('details')
        .eq('type', 'academia')
        .eq('user_id', user.id)
        .filter('details->>workoutType', 'eq', workoutType)
        .order('date', { ascending: false })
        .limit(20);

      if (error) throw error;

      for (const workout of data || []) {
        if (workout.details?.executionData && workout.details.executionData[exerciseId]) {
          const exec = workout.details.executionData[exerciseId];
          return {
            weight: exec.weight || 0,
            variationName: exec.variationName,
            observations: exec.observations
          };
        }
      }
      return null;
    } catch (error) {
      console.error('Erro ao buscar último registro:', error);
      return null;
    }
  },

  // ✅ NOVA FUNÇÃO: Buscar último registro por variação específica
  async getLastExerciseRecordByVariation(exerciseId: number, variationName: string, workoutType: '1' | '2' | '3'): Promise<{
    weight: number;
    observations?: string;
  } | null> {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return null;
      
      const { data, error } = await supabase
        .from('workouts')
        .select('details')
        .eq('type', 'academia')
        .eq('user_id', user.id)
        .filter('details->>workoutType', 'eq', workoutType)
        .order('date', { ascending: false })
        .limit(30);

      if (error) throw error;

      for (const workout of data || []) {
        if (workout.details?.executionData && workout.details.executionData[exerciseId]) {
          const exec = workout.details.executionData[exerciseId];
          if (exec.variationName === variationName) {
            return {
              weight: exec.weight || 0,
              observations: exec.observations
            };
          }
        }
      }
      return null;
    } catch (error) {
      console.error('Erro ao buscar último registro por variação:', error);
      return null;
    }
  }
};