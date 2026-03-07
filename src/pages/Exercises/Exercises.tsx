// src/pages/Exercises/Exercises.tsx
import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { workoutsData } from '../../data/workouts.data';
import { workoutService } from '../../services/supabase.service';

interface ExerciseWithHistory {
  id: number;
  name: string;
  sets: string;
  workoutType: 'A' | 'B';
  lastWeight?: number;
  history: Array<{ date: Date; weight: number }>;
}

const Exercises: React.FC = () => {
  const [exercises, setExercises] = useState<ExerciseWithHistory[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedExercise, setSelectedExercise] = useState<ExerciseWithHistory | null>(null);
  const [showHistory, setShowHistory] = useState(false);

  useEffect(() => {
    loadAllExercises();
  }, []);

  const loadAllExercises = async () => {
    try {
      setLoading(true);
      const allExercises: ExerciseWithHistory[] = [];

      // Carregar exercícios do Treino A
      const workoutA = workoutsData.find(w => w.id === 'A');
      if (workoutA) {
        for (const ex of workoutA.exercises) {
          const history = await workoutService.getExerciseWeightHistory(ex.id, 'A');
          const lastWeight = history.length > 0 ? history[0].weight : undefined;
          
          allExercises.push({
            id: ex.id,
            name: ex.name,
            sets: ex.sets,
            workoutType: 'A',
            lastWeight,
            history
          });
        }
      }

      // Carregar exercícios do Treino B
      const workoutB = workoutsData.find(w => w.id === 'B');
      if (workoutB) {
        for (const ex of workoutB.exercises) {
          const history = await workoutService.getExerciseWeightHistory(ex.id, 'B');
          const lastWeight = history.length > 0 ? history[0].weight : undefined;
          
          allExercises.push({
            id: ex.id,
            name: ex.name,
            sets: ex.sets,
            workoutType: 'B',
            lastWeight,
            history
          });
        }
      }

      setExercises(allExercises);
    } catch (error) {
      console.error('Erro ao carregar exercícios:', error);
    } finally {
      setLoading(false);
    }
  };

  const viewHistory = (exercise: ExerciseWithHistory) => {
    setSelectedExercise(exercise);
    setShowHistory(true);
  };

  const formatDate = (date: Date): string => {
    return new Date(date).toLocaleDateString('pt-BR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric'
    });
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-primary-dark flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-accent-red mx-auto mb-4"></div>
          <h2 className="text-xl font-bold text-white mb-2">Carregando exercícios...</h2>
          <p className="text-text-secondary">Buscando histórico de pesos</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary-dark via-secondary-dark to-black">
      <div className="container mx-auto px-4 py-8 max-w-6xl">
        
        <div className="flex items-center gap-4 mb-8">
          <Link
            to="/"
            className="w-12 h-12 rounded-xl bg-white/5 border border-white/10 
              flex items-center justify-center text-white hover:bg-white/10 
              transition-all hover:scale-110 group"
          >
            <i className="fas fa-arrow-left group-hover:-translate-x-1 transition-transform"></i>
          </Link>
          <div>
            <h1 className="text-2xl sm:text-3xl md:text-4xl font-black text-white font-montserrat">
              Histórico de <span className="bg-gradient-to-r from-accent-red to-accent-purple bg-clip-text text-transparent">Exercícios</span>
            </h1>
            <p className="text-text-secondary">
              {exercises.length} exercícios cadastrados
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {exercises.map((exercise) => (
            <div
              key={`${exercise.workoutType}-${exercise.id}`}
              className="bg-gradient-to-br from-secondary-dark/30 to-black/30 
                rounded-xl p-4 border border-white/10 hover:border-accent-red/30 
                transition-all cursor-pointer"
              onClick={() => viewHistory(exercise)}
            >
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-2">
                  <span className={`px-2 py-1 rounded-full text-xs font-bold ${
                    exercise.workoutType === 'A' 
                      ? 'bg-accent-red/20 text-accent-red' 
                      : 'bg-accent-blue/20 text-accent-blue'
                  }`}>
                    Treino {exercise.workoutType}
                  </span>
                  <span className="text-xs text-text-secondary">{exercise.sets}</span>
                </div>
                {exercise.lastWeight && (
                  <span className="text-accent-green font-bold">
                    {exercise.lastWeight} kg
                  </span>
                )}
              </div>
              
              <h3 className="text-lg font-bold text-white mb-2">
                {exercise.name}
              </h3>
              
              <div className="flex items-center justify-between text-xs text-text-secondary">
                <span>{exercise.history.length} registros</span>
                <span className="text-accent-blue">Ver histórico →</span>
              </div>
            </div>
          ))}
        </div>

        {showHistory && selectedExercise && (
          <div className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center z-50 p-4"
            onClick={() => setShowHistory(false)}>
            <div className="bg-gradient-to-br from-secondary-dark to-black rounded-2xl p-6 
              max-w-2xl w-full max-h-[80vh] overflow-y-auto border border-white/10"
              onClick={(e) => e.stopPropagation()}>
              
              <div className="flex items-center justify-between mb-6 sticky top-0 bg-gradient-to-br from-secondary-dark to-black py-2">
                <h2 className="text-xl font-bold text-white">
                  Histórico: {selectedExercise.name}
                </h2>
                <button
                  onClick={() => setShowHistory(false)}
                  className="w-8 h-8 rounded-xl bg-white/5 text-white hover:bg-white/10"
                >
                  <i className="fas fa-times"></i>
                </button>
              </div>

              {selectedExercise.history.length > 0 ? (
                <div className="space-y-3">
                  {selectedExercise.history.map((entry, index) => (
                    <div
                      key={index}
                      className="flex items-center justify-between p-3 bg-white/5 rounded-lg border border-white/10"
                    >
                      <span className="text-text-secondary">{formatDate(entry.date)}</span>
                      <span className="text-accent-green font-bold">{entry.weight} kg</span>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8">
                  <i className="fas fa-history text-4xl text-text-secondary mb-3"></i>
                  <p className="text-text-secondary">Nenhum histórico encontrado</p>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Exercises;