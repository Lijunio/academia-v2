// src/test-supabase.tsx
import React, { useEffect } from 'react';
import { workoutService } from './services/supabase.service';

const TestSupabase = () => {
  useEffect(() => {
    async function test() {
      try {
        console.log('🧪 Testando conexão com Supabase...');
        
        // Tenta salvar um treino de teste
        const result = await workoutService.save({
          type: 'natacao',
          date: new Date(),
          duration: 1800,
          calories: 300,
          heart_rate: 130,
          details: {
            distance: 1000,
            poolLength: 25
          },
          notes: 'Teste de conexão'
        });
        
        console.log('✅ Sucesso! Treino salvo:', result);
        
        // Tenta buscar todos
        const all = await workoutService.getAll();
        console.log('📊 Todos os treinos:', all);
        
      } catch (error) {
        console.error('❌ Erro:', error);
      }
    }
    
    test();
  }, []);

  return (
    <div className="p-8 text-white">
      <h1 className="text-2xl mb-4">Teste Supabase</h1>
      <p>Veja o console (F12) para ver o resultado</p>
    </div>
  );
};

export default TestSupabase;