// src/pages/Workout1/Workout1.tsx
import React, { useState, useEffect, useCallback } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import ExerciseCard from '../../components/features/ExerciseCard/ExerciseCard';
import RestOverlay from '../../components/features/RestOverlay/RestOverlay';
import ConfirmModal from '../../components/features/ExerciseCard/ConfirmModal';
import SmartwatchConfirmModal from '../../components/common/SmartwatchConfirmModal';
import WeightRegistrationModal from '../../components/common/WeightRegistrationModal';
import WalkingModal from '../../components/common/WalkingModal';
import CaloriesInputModal from '../../components/common/CaloriesInputModal';
import { Timer } from '../../components/common';
import { useWorkoutLogic } from '../../hooks/useWorkoutLogic';
import { workouts3DaysData } from '../../data/workouts3days.data';
import { workoutService } from '../../services/supabase.service';

interface LastWeightData {
  [exerciseId: number]: number;
}

const Workout1: React.FC = () => {
  const navigate = useNavigate();
  
  const {
    exercises,
    groups,
    session,
    showRest,
    restType,
    nextExerciseName,
    executionData,
    showSmartwatchModal,
    showWeightModal,
    showCaloriesModal,
    showCardioModal,
    currentExerciseForWeight,
    currentCardioExercise,
    isSendingReport,
    initializeExercises,
    resetWorkout,
    startWorkoutWithConfirmation,
    confirmSmartwatchStart,
    cancelSmartwatchStart,
    prepareWeightRegistration,
    saveWeightRegistration,
    saveCardioData,
    closeCardioModal,
    skipExercise,
    closeRestTimer,
    isExerciseLocked,
    isExerciseCurrent,
    isGroupActive,
    getAllGroupedExercises,
    getWorkoutProgress,
    getNextExerciseOptions,
    prepareWorkoutFinalization,
    finalizeWorkout,
    canFinishWorkout,
    closeWeightModal,
    closeCaloriesModal,
    getElapsedWorkoutTime
  } = useWorkoutLogic('1');

  const [isInitialized, setIsInitialized] = useState(false);
  const [exerciseOptions, setExerciseOptions] = useState<{ name: string; group: string }[]>([]);
  const [showResetModal, setShowResetModal] = useState(false);
  const [lastWeights, setLastWeights] = useState<LastWeightData>({});

  useEffect(() => {
    console.log('📊 Workout1 - Estado atual:', {
      isInitialized,
      groupsCount: groups?.length || 0,
      exercisesCount: exercises?.length || 0,
      session: {
        ...session,
        currentGroupIndex: session.currentGroupIndex
      }
    });
  }, [groups, exercises, session, isInitialized]);

  useEffect(() => {
    console.log('🚀 Workout1 - Iniciando inicialização...');
    const workoutData = workouts3DaysData.workout1;
    
    if (workoutData && workoutData.exercises.length > 0) {
      console.log('✅ Workout1 - Dados encontrados:', workoutData.exercises.length, 'exercícios');
      initializeExercises(workoutData.exercises);
      setIsInitialized(true);
      loadLastWeights();
    } else {
      console.error('❌ Workout1 - Dados não encontrados!');
    }
  }, [initializeExercises]);

  const loadLastWeights = useCallback(async () => {
    try {
      const weights: LastWeightData = {};
      const exercisesList = workouts3DaysData.workout1.exercises || [];
      
      for (const exercise of exercisesList) {
        if (exercise.noWeight || exercise.isCardio) continue;
        const lastWeight = await workoutService.getLastExerciseWeight(exercise.id, '1');
        if (lastWeight) {
          weights[exercise.id] = lastWeight;
        }
      }
      
      setLastWeights(weights);
      console.log('📊 Últimos pesos carregados:', weights);
    } catch (error) {
      console.error('Erro ao carregar últimos pesos:', error);
    }
  }, []);

  useEffect(() => {
    if (session.workoutStarted) {
      const options = getNextExerciseOptions();
      setExerciseOptions(options);
      console.log('🔄 Workout1 - Opções de exercícios atualizadas:', options.length);
    }
  }, [session.workoutStarted, exercises, groups, session.currentGroupIndex, getNextExerciseOptions]);

  const handleExerciseComplete = (exerciseId: number) => {
    prepareWeightRegistration(exerciseId);
  };

  const handleFinishWorkout = () => {
    const progress = getWorkoutProgress();
    const remainingExercises = progress.totalExercises - progress.completedExercises;
    
    console.log('🔍 handleFinishWorkout - remainingExercises:', remainingExercises);
    console.log('🔍 canFinishWorkout:', canFinishWorkout());
    
    if (remainingExercises > 0) {
      if (window.confirm(`Você ainda tem ${remainingExercises} exercício(s) pendente(s). Tem certeza que deseja finalizar o treino?`)) {
        finalizeWorkoutManually();
      }
    } else {
      console.log('🎯 Forçando abertura do modal de calorias...');
      prepareWorkoutFinalization();
    }
  };

  const finalizeWorkoutManually = () => {
    localStorage.removeItem('workout-1');
    navigate('/');
  };

  const handleFinalizeWithCalories = async (calories: number, heartRate?: number) => {
    try {
      const durationInSeconds = getElapsedWorkoutTime();
      
      console.log('🔥 FINALIZANDO TREINO 1:', {
        durationInSeconds,
        formatado: `${Math.floor(durationInSeconds / 60)}:${(durationInSeconds % 60).toString().padStart(2, '0')}`,
        calories,
        heartRate
      });

      await finalizeWorkout(calories, heartRate);
      
      await workoutService.save({
        type: 'academia',
        date: new Date(),
        duration: durationInSeconds,
        calories: calories || 0,
        heart_rate: heartRate || 0,
        details: {
          workoutType: '1',
          exercises: exercises,
          executionData: executionData,
          progress: getWorkoutProgress()
        },
        notes: 'Treino 1 finalizado - Peito/Ombro/Tríceps + Abdominal + Caminhada'
      });
      
      await loadLastWeights();
      
      navigate('/');
    } catch (error) {
      console.error('Erro ao finalizar:', error);
    }
  };

  const groupedExercises = getAllGroupedExercises();
  const progress = getWorkoutProgress();
  
  const workoutDuration = 75;
  const totalSets = exercises.reduce((total, ex) => total + (parseInt(ex.sets) || 0), 0);

  const calculateWorkoutDuration = () => {
    return getElapsedWorkoutTime();
  };

  if (!isInitialized) {
    return (
      <div className="min-h-screen bg-primary-dark flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-green-500 mx-auto mb-4"></div>
          <h2 className="text-xl font-bold text-white mb-2">Carregando Treino 1...</h2>
          <p className="text-text-secondary">Preparando sua sessão de treino</p>
        </div>
      </div>
    );
  }

  if (!groups || groups.length === 0) {
    return (
      <div className="min-h-screen bg-primary-dark flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-yellow-500 mx-auto mb-4"></div>
          <h2 className="text-xl font-bold text-white mb-2">Organizando exercícios...</h2>
          <p className="text-text-secondary">Aguarde alguns instantes</p>
        </div>
      </div>
    );
  }

  return (
    <>
      <div className="min-h-screen bg-primary-dark">
        <div className="container mx-auto px-4 py-6 max-w-6xl">
          
          <header className="bg-gradient-to-r from-secondary-dark to-black rounded-2xl p-6 mb-8 
            border border-gray-800 flex flex-col md:flex-row items-center justify-between gap-6">
            
            <Link 
              to="/academia" 
              className="flex items-center gap-3 px-5 py-3 bg-white/5 rounded-xl border border-white/10 
                hover:bg-white/10 transition-colors group"
            >
              <i className="fas fa-arrow-left text-green-400 group-hover:translate-x-[-3px] transition-transform"></i>
              <span className="text-text-secondary group-hover:text-white">Voltar</span>
            </Link>
            
            <div className="flex items-center gap-6">
              <div className="w-16 h-16 rounded-xl bg-gradient-to-br from-green-500 to-emerald-500 
                flex items-center justify-center text-white font-black text-3xl shadow-lg">
                1
              </div>
              <div>
                <h1 className="text-3xl md:text-4xl font-bold text-white font-montserrat">
                  TREINO 1
                </h1>
                <p className="text-text-secondary uppercase tracking-wider text-sm font-inter">
                  Peito • Ombro • Tríceps • Abdominal • Caminhada
                </p>
              </div>
            </div>
            
            <div className="w-full md:w-72">
              <div className="flex justify-between mb-3">
                <span className="text-text-secondary text-sm">Progresso</span>
                <span className="text-accent-green font-bold text-lg">
                  {progress.completedExercises}/{progress.totalExercises}
                </span>
              </div>
              <div className="h-3 bg-white/5 rounded-full overflow-hidden">
                <div 
                  className="h-full bg-gradient-to-r from-green-500 to-emerald-500 transition-all duration-500"
                  style={{ width: `${progress.progressPercentage}%` }}
                />
              </div>
              <div className="text-right mt-1">
                <span className="text-accent-green font-bold">{progress.progressPercentage}%</span>
              </div>
            </div>
          </header>

          <div className="mb-10">
            <Timer 
              totalTime={workoutDuration * 60}
              onTimeUp={() => {
                const audio = new Audio('/assets/audio/finish.mp3');
                audio.play().catch(console.error);
              }}
              workoutStarted={session.workoutStarted}
              exerciseStarted={!!session.currentExerciseId}
              onStartWorkout={startWorkoutWithConfirmation}
            />
          </div>

          <main className="bg-gradient-to-b from-secondary-dark/50 to-transparent 
            rounded-2xl p-6 md:p-8 mb-10 border border-white/5">
            
            <div className="mb-10 pb-6 border-b border-white/10">
              <h2 className="flex items-center gap-4 text-2xl md:text-3xl font-bold text-white font-montserrat">
                <i className="fas fa-dumbbell text-green-400"></i>
                Todos os Exercícios
              </h2>
              <p className="text-text-secondary mt-3 font-inter">
                Os exercícios estão organizados por grupos musculares. Complete os exercícios na ordem que preferir.
              </p>
            </div>

            {groupedExercises.length > 0 ? (
              <div className="space-y-10">
                {groupedExercises.map((group, groupIndex) => {
                  const isActiveGroup = isGroupActive(group.name);
                  const groupExercisesCount = group.exercises.length;
                  const completedExercisesCount = group.exercises.filter(e => {
                    const exerciseState = exercises.find(ex => ex.id === e.id);
                    return exerciseState?.completed || exerciseState?.skipReason;
                  }).length;
                  
                  return (
                    <div 
                      key={group.name}
                      className={`bg-gradient-to-br from-secondary-dark/30 to-black/50 
                        rounded-2xl p-6 border transition-all duration-300
                        ${isActiveGroup 
                          ? 'border-yellow-500/50 bg-gradient-to-br from-yellow-900/10 to-black/50' 
                          : group.completed
                          ? 'border-green-500/30 bg-gradient-to-br from-green-900/10 to-black/50'
                          : groupIndex > session.currentGroupIndex
                          ? 'border-gray-700/50 bg-gradient-to-br from-gray-800/20 to-black/50 opacity-80'
                          : 'border-white/10'
                        }`}
                    >
                      <div className="mb-6">
                        <div className="flex items-center gap-3 mb-2">
                          <h3 className="text-xl md:text-2xl font-bold text-white font-montserrat">
                            {group.displayName}
                          </h3>
                          {isActiveGroup && (
                            <span className="px-3 py-1 bg-yellow-500/20 text-yellow-300 rounded-full text-xs font-bold">
                              GRUPO ATUAL
                            </span>
                          )}
                          {group.completed && (
                            <span className="px-3 py-1 bg-green-500/20 text-green-300 rounded-full text-xs font-bold">
                              CONCLUÍDO
                            </span>
                          )}
                          {groupIndex > session.currentGroupIndex && (
                            <span className="px-3 py-1 bg-gray-500/20 text-gray-400 rounded-full text-xs font-bold">
                              BLOQUEADO
                            </span>
                          )}
                        </div>
                        
                        <div className="flex items-center gap-4 text-sm text-text-secondary">
                          <div className="flex items-center gap-2">
                            <i className="fas fa-dumbbell text-xs"></i>
                            <span>{groupExercisesCount} exercícios</span>
                          </div>
                          <div className="flex items-center gap-2">
                            <i className="fas fa-check-circle text-xs"></i>
                            <span>{completedExercisesCount} concluídos</span>
                          </div>
                        </div>
                      </div>

                      <div className="space-y-4">
                        {group.exercises.map((exercise, exerciseIndex) => {
                          const exerciseState = exercises.find(e => e.id === exercise.id);
                          const isCurrent = isExerciseCurrent(exercise.id);
                          const isLocked = isExerciseLocked(exercise.id);
                          const execution = executionData[exercise.id];
                          const lastWeight = !exercise.noWeight && !exercise.isCardio ? lastWeights[exercise.id] : undefined;
                          
                          // Extrair cardioData se existir
                          const cardioData = execution?.cardioData;
                          
                          return (
                            <ExerciseCard
                              key={exercise.id}
                              exercise={exerciseState || exercise}
                              number={exerciseIndex + 1}
                              isCompleted={exerciseState?.completed || false}
                              isCurrent={isCurrent}
                              isLocked={isLocked}
                              onToggleComplete={() => handleExerciseComplete(exercise.id)}
                              onSkipExercise={(reason: string) => skipExercise(exercise.id, reason)}
                              workoutType="1"
                              workoutStarted={session.workoutStarted}
                              hasWeightData={!!execution && !exercise.noWeight && !exercise.isCardio}
                              weightData={execution && !exercise.noWeight && !exercise.isCardio ? {
                                weight: execution.weight,
                                variation: execution.variationName,
                                observations: execution.observations
                              } : undefined}
                              lastWeight={lastWeight}
                              cardioData={cardioData}
                            />
                          );
                        })}
                      </div>
                    </div>
                  );
                })}
              </div>
            ) : (
              <div className="text-center py-12">
                <i className="fas fa-dumbbell text-5xl text-gray-600 mb-4"></i>
                <h3 className="text-xl font-bold text-white mb-2">Nenhum exercício encontrado</h3>
                <p className="text-text-secondary">Inicie o treino para ver os exercícios</p>
              </div>
            )}

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-12">
              <div className="bg-gradient-to-br from-secondary-dark to-black rounded-xl p-6 
                border border-white/5 text-center">
                <i className="fas fa-check-circle text-4xl text-accent-green mb-4"></i>
                <h3 className="text-4xl font-bold text-white mb-2">
                  {progress.completedExercises}
                </h3>
                <p className="text-text-secondary uppercase tracking-wider text-sm">
                  Exercícios Concluídos
                </p>
              </div>
              
              <div className="bg-gradient-to-br from-secondary-dark to-black rounded-xl p-6 
                border border-white/5 text-center">
                <i className="fas fa-fire text-4xl text-green-400 mb-4"></i>
                <h3 className="text-4xl font-bold text-white mb-2">
                  {totalSets}
                </h3>
                <p className="text-text-secondary uppercase tracking-wider text-sm">
                  Séries Totais
                </p>
              </div>
              
              <div className="bg-gradient-to-br from-secondary-dark to-black rounded-xl p-6 
                border border-white/5 text-center">
                <i className="fas fa-layer-group text-4xl text-accent-blue mb-4"></i>
                <h3 className="text-4xl font-bold text-white mb-2">
                  {progress.completedGroups}/{progress.totalGroups}
                </h3>
                <p className="text-text-secondary uppercase tracking-wider text-sm">
                  Grupos Concluídos
                </p>
              </div>
            </div>
          </main>

          <footer className="bg-gradient-to-r from-secondary-dark to-black rounded-2xl p-8 
            border border-gray-800 flex flex-col md:flex-row items-center justify-between gap-6">
            
            <div className="flex items-center gap-4 text-text-secondary">
              <i className="fas fa-info-circle text-xl text-green-400"></i>
              <div>
                <p className="text-sm max-w-md mb-1">
                  <strong>Como funciona:</strong> Faça os exercícios em qualquer ordem dentro dos grupos disponíveis.
                </p>
                <p className="text-xs text-gray-500">
                  Grupos futuros serão desbloqueados conforme você progride no treino.
                </p>
              </div>
            </div>
            
            <div className="flex flex-col sm:flex-row gap-4">
              <button 
                onClick={() => setShowResetModal(true)}
                disabled={!session.workoutStarted}
                className={`px-6 py-3 rounded-xl font-bold transition-all flex items-center gap-3
                  ${session.workoutStarted 
                    ? 'bg-gradient-to-r from-orange-600 to-red-600 text-white hover:scale-105' 
                    : 'bg-gray-700 text-gray-400 cursor-not-allowed opacity-50'
                  }`}
              >
                <i className="fas fa-undo"></i>
                Resetar Treino
              </button>
              
              <button 
                onClick={handleFinishWorkout}
                disabled={!canFinishWorkout()}
                className={`px-6 py-3 bg-gradient-to-r from-green-500 to-emerald-500 
                  text-white font-bold rounded-xl transition-all flex items-center gap-3
                  ${canFinishWorkout() 
                    ? 'hover:scale-105' 
                    : 'opacity-50 cursor-not-allowed'
                  }`}
              >
                <i className="fas fa-flag-checkered"></i>
                {isSendingReport ? 'Enviando...' : 'Finalizar Treino'}
              </button>
            </div>
          </footer>
        </div>
      </div>

      {showRest && (
        <RestOverlay
          isVisible={showRest}
          onClose={closeRestTimer}
          restTime={restType === 'exercise' ? 45 : 90}
          nextExerciseName={nextExerciseName}
          workoutType="1"
          isGroupRest={restType === 'group'}
          exerciseOptions={exerciseOptions}
        />
      )}

      <SmartwatchConfirmModal
        isVisible={showSmartwatchModal}
        onConfirm={confirmSmartwatchStart}
        onCancel={cancelSmartwatchStart}
        workoutName="Treino 1"
      />

      <WeightRegistrationModal
        isVisible={showWeightModal}
        exercise={currentExerciseForWeight}
        lastWeight={currentExerciseForWeight ? lastWeights[currentExerciseForWeight.id] : undefined}
        onSave={saveWeightRegistration}
        onCancel={closeWeightModal}
      />

      <WalkingModal
        isVisible={showCardioModal}
        exerciseName={currentCardioExercise?.name || 'Caminhada'}
        onSave={saveCardioData}
        onCancel={closeCardioModal}
        isLoading={isSendingReport}
      />

      <CaloriesInputModal
        isVisible={showCaloriesModal}
        workoutDuration={calculateWorkoutDuration()}
        onSave={handleFinalizeWithCalories}
        onCancel={closeCaloriesModal}
        isLoading={isSendingReport}
      />

      <ConfirmModal
        isVisible={showResetModal}
        title="Resetar Treino"
        message="Tem certeza que deseja resetar o treino? Todo o progresso será perdido!"
        confirmText="Sim, resetar"
        cancelText="Não, cancelar"
        onConfirm={() => {
          resetWorkout();
          setShowResetModal(false);
        }}
        onCancel={() => setShowResetModal(false)}
      />
    </>
  );
};

export default Workout1;