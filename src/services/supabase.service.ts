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
  user_id?: string; // ← ADICIONADO: campo para o ID do usuário
}

export const workoutService = {

  // ===== FUNÇÃO DE SALVAR (MODIFICADA) =====
  async save(workout: Omit<Workout, 'id' | 'user_id'>) {
    // Pega o usuário atual
    const { data: { user } } = await supabase.auth.getUser();
    
    if (!user) {
      throw new Error('Usuário não autenticado');
    }
    
    console.log('💾 Salvando treino para usuário:', user.id);
    
    const { data, error } = await supabase
      .from('workouts')
      .insert([{
        ...workout,
        user_id: user.id, // ← ADICIONADO: ID do usuário
        date: workout.date.toISOString()
      }])
      .select();
    
    if (error) {
      console.error('Erro ao salvar:', error);
      throw error;
    }
    return data;
  },

  // ===== FUNÇÃO DE BUSCAR TODOS (MODIFICADA) =====
  async getAll() {
    const { data: { user } } = await supabase.auth.getUser();
    
    if (!user) {
      throw new Error('Usuário não autenticado');
    }
    
    console.log('📊 Buscando treinos do usuário:', user.id);
    
    const { data, error } = await supabase
      .from('workouts')
      .select('*')
      .eq('user_id', user.id) // ← ADICIONADO: filtrar por usuário
      .order('date', { ascending: false });
    
    if (error) {
      console.error('Erro ao buscar:', error);
      throw error;
    }
    return data || [];
  },

  // ===== FUNÇÃO DE BUSCAR POR TIPO (MODIFICADA) =====
  async getByType(type: string) {
    const { data: { user } } = await supabase.auth.getUser();
    
    if (!user) {
      throw new Error('Usuário não autenticado');
    }
    
    const { data, error } = await supabase
      .from('workouts')
      .select('*')
      .eq('type', type)
      .eq('user_id', user.id) // ← ADICIONADO: filtrar por usuário
      .order('date', { ascending: false });
    
    if (error) {
      console.error('Erro ao buscar por tipo:', error);
      throw error;
    }
    return data || [];
  },

  // ===== FUNÇÃO DE DELETAR (MODIFICADA) =====
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
      .eq('user_id', user.id); // ← ADICIONADO: garantir que é do usuário
    
    if (error) {
      console.error('Erro ao deletar:', error);
      throw error;
    }
  },

  // ===== FUNÇÃO DE ATUALIZAR (MODIFICADA) =====
  async update(id: string, updates: Partial<Workout>) {
    const { data: { user } } = await supabase.auth.getUser();
    
    if (!user) {
      throw new Error('Usuário não autenticado');
    }
    
    const { data, error } = await supabase
      .from('workouts')
      .update(updates)
      .eq('id', id)
      .eq('user_id', user.id) // ← ADICIONADO: garantir que é do usuário
      .select();
    
    if (error) {
      console.error('Erro ao atualizar:', error);
      throw error;
    }
    return data;
  },

  // ===== FUNÇÃO DE BUSCAR ÚLTIMO PESO (MODIFICADA) =====
  async getLastExerciseWeight(exerciseId: number, workoutType: 'A' | 'B'): Promise<number | null> {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      
      if (!user) return null;
      
      const { data, error } = await supabase
        .from('workouts')
        .select('details')
        .eq('type', 'academia')
        .eq('user_id', user.id) // ← ADICIONADO: filtrar por usuário
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

  // ===== FUNÇÃO DE BUSCAR HISTÓRICO DE PESOS (MODIFICADA) =====
  async getExerciseWeightHistory(exerciseId: number, workoutType: 'A' | 'B'): Promise<Array<{ date: Date; weight: number }>> {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      
      if (!user) return [];
      
      const { data, error } = await supabase
        .from('workouts')
        .select('date, details')
        .eq('type', 'academia')
        .eq('user_id', user.id) // ← ADICIONADO: filtrar por usuário
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