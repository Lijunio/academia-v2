// src/hooks/useWorkoutLogic.ts
import { useState, useCallback, useRef, useEffect } from 'react';
import { 
  Exercise, 
  ExerciseBase, 
  WorkoutSession, 
  WorkoutData, 
  WorkoutGroup,
  MuscleGroup,
  ExerciseExecution,
  WorkoutReport,
  WorkoutType
} from '../types/workout.types';

// Grupos para cada tipo de treino
const WORKOUT_A_GROUPS: MuscleGroup[] = ['peito', 'ombro', 'triceps', 'pernas'];
const WORKOUT_B_GROUPS: MuscleGroup[] = ['costas', 'trapezio', 'biceps', 'antebraco', 'posterior', 'panturrilha'];
const WORKOUT_1_GROUPS: MuscleGroup[] = ['peito', 'ombro', 'triceps', 'abdominal', 'cardio'];
const WORKOUT_2_GROUPS: MuscleGroup[] = ['costas', 'trapezio', 'biceps', 'antebraco', 'abdominal', 'cardio'];
const WORKOUT_3_GROUPS: MuscleGroup[] = ['posterior', 'pernas', 'complemento', 'abdominal'];

const GROUP_DISPLAY_NAMES: Record<MuscleGroup, string> = {
  peito: 'Peito',
  ombro: 'Ombro',
  triceps: 'Tríceps',
  pernas: 'Perna Anterior',
  costas: 'Costas',
  biceps: 'Bíceps',
  trapezio: 'Trapézio',
  antebraco: 'Antebraço',
  panturrilha: 'Panturrilha',
  posterior: 'Perna Posterior',
  abdominal: 'Abdominal',
  cardio: 'Cardio',
  complemento: 'Complemento'
};

interface EnhancedWorkoutReport extends Omit<WorkoutReport, 'heartRate'> {
  heartRate?: number;
}

export const useWorkoutLogic = (workoutType: WorkoutType) => {
  const [exercises, setExercises] = useState<Exercise[]>([]);
  const [groups, setGroups] = useState<WorkoutGroup[]>([]);
  const [session, setSession] = useState<WorkoutSession>({
    workoutStarted: false,
    workoutCompleted: false,
    currentGroupIndex: 0,
    currentExerciseId: null,
    completedExercises: [],
    completedGroups: [],
    smartwatchConfirmed: false,
    workoutStartTime: undefined
  });
  
  const [executionData, setExecutionData] = useState<Record<number, ExerciseExecution>>({});
  const [showSmartwatchModal, setShowSmartwatchModal] = useState(false);
  const [showWeightModal, setShowWeightModal] = useState(false);
  const [showCaloriesModal, setShowCaloriesModal] = useState(false);
  const [currentExerciseForWeight, setCurrentExerciseForWeight] = useState<Exercise | null>(null);
  const [isSendingReport, setIsSendingReport] = useState(false);
  
  const [showRest, setShowRest] = useState(false);
  const [restType, setRestType] = useState<'exercise' | 'group'>('exercise');
  const [nextExerciseName, setNextExerciseName] = useState('');
  
  const [showCardioModal, setShowCardioModal] = useState(false);
  const [currentCardioExercise, setCurrentCardioExercise] = useState<Exercise | null>(null);
  
  const isInitializedRef = useRef(false);
  const workoutStartTimeRef = useRef<Date | null>(null);
  
  // Lista linear de todos os exercícios em ordem
  const [linearExerciseOrder, setLinearExerciseOrder] = useState<{ id: number; name: string; groupIndex: number }[]>([]);
  
  const getWorkoutGroups = useCallback((): MuscleGroup[] => {
    switch(workoutType) {
      case 'A': return WORKOUT_A_GROUPS;
      case 'B': return WORKOUT_B_GROUPS;
      case '1': return WORKOUT_1_GROUPS;
      case '2': return WORKOUT_2_GROUPS;
      case '3': return WORKOUT_3_GROUPS;
      default: return WORKOUT_A_GROUPS;
    }
  }, [workoutType]);

  const initializeExercises = useCallback((initialExercises: ExerciseBase[]) => {
    if (isInitializedRef.current) return;

    const enhancedExercises: Exercise[] = initialExercises.map(exercise => ({
      ...exercise,
      completed: false,
      started: false,
      reps: 10,
      restTime: exercise.noWeight || exercise.isCardio ? 30 : 60,
      skipReason: undefined,
      hasVariations: exercise.hasVariations || false,
      variations: exercise.variations || []
    }));

    const workoutGroups = getWorkoutGroups();

    const workoutGroupsData: WorkoutGroup[] = workoutGroups.map(groupName => {
      const groupExercises = enhancedExercises.filter(ex => ex.muscleGroup === groupName);
      return {
        name: groupName,
        displayName: GROUP_DISPLAY_NAMES[groupName],
        exercises: groupExercises,
        completed: false
      };
    }).filter(group => group.exercises.length > 0);

    setExercises(enhancedExercises);
    setGroups(workoutGroupsData);
    
    // Criar lista linear de exercícios na ordem dos grupos
    const linear: { id: number; name: string; groupIndex: number }[] = [];
    workoutGroupsData.forEach((group, groupIdx) => {
      group.exercises.forEach(ex => {
        linear.push({
          id: ex.id,
          name: ex.name,
          groupIndex: groupIdx
        });
      });
    });
    setLinearExerciseOrder(linear);
    
    isInitializedRef.current = true;

    setTimeout(() => {
      const saved = localStorage.getItem(`workout-${workoutType}`);
      if (saved) {
        try {
          const parsed: WorkoutData = JSON.parse(saved);
          if (parsed.exercises) setExercises(parsed.exercises);
          if (parsed.groups) setGroups(parsed.groups);
          if (parsed.session) {
            const sessionWithDates = {
              ...parsed.session,
              workoutStartTime: parsed.session.workoutStartTime ? new Date(parsed.session.workoutStartTime) : undefined
            };
            setSession(sessionWithDates);
            if (sessionWithDates.workoutStartTime) {
              workoutStartTimeRef.current = sessionWithDates.workoutStartTime;
            }
          }
          if (parsed.executionData) {
            const executionDataWithDates: Record<number, ExerciseExecution> = {};
            Object.entries(parsed.executionData).forEach(([key, value]: [string, any]) => {
              executionDataWithDates[parseInt(key)] = {
                ...value,
                date: new Date(value.date)
              };
            });
            setExecutionData(executionDataWithDates);
          }
        } catch (error) {
          console.error('Erro ao carregar progresso:', error);
          localStorage.removeItem(`workout-${workoutType}`);
        }
      }
    }, 50);
  }, [workoutType, getWorkoutGroups]);

  useEffect(() => {
    if (exercises.length > 0 && groups.length > 0) {
      setGroups(prevGroups => 
        prevGroups.map(group => ({
          ...group,
          exercises: group.exercises.map(ex => {
            const updatedEx = exercises.find(e => e.id === ex.id);
            return updatedEx ? { ...ex, ...updatedEx } : ex;
          }),
          completed: group.exercises.every(ex => {
            const exerciseState = exercises.find(e => e.id === ex.id);
            return exerciseState?.completed || exerciseState?.skipReason;
          })
        }))
      );
    }
  }, [exercises, groups.length]);

  const saveProgress = useCallback(() => {
    if (exercises.length === 0 || groups.length === 0) return;
    const data: WorkoutData = { 
      exercises, 
      session: {
        ...session,
        workoutStartTime: workoutStartTimeRef.current || undefined
      }, 
      groups,
      executionData
    };
    localStorage.setItem(`workout-${workoutType}`, JSON.stringify(data));
  }, [exercises, session, groups, workoutType, executionData]);

  /**
   * FUNÇÃO REMOVIDA - Não envia mais mensagem para WhatsApp
   */
  // const sendWhatsAppStartMessage = useCallback(() => { ... }); // REMOVIDO

  /**
   * Encontra o próximo exercício baseado na lista linear
   */
  const getNextAvailableExercise = useCallback((currentExerciseId?: number): string => {
    if (!session.workoutStarted) return 'Inicie o treino';
    if (linearExerciseOrder.length === 0) return 'Treino finalizado';

    if (!currentExerciseId) {
      for (const item of linearExerciseOrder) {
        const state = exercises.find(e => e.id === item.id);
        if (!state?.completed && !state?.skipReason) {
          return item.name;
        }
      }
      return 'Treino finalizado';
    }

    let currentIndex = -1;
    for (let i = 0; i < linearExerciseOrder.length; i++) {
      if (linearExerciseOrder[i].id === currentExerciseId) {
        currentIndex = i;
        break;
      }
    }
    
    if (currentIndex === -1) return 'Treino finalizado';

    for (let i = currentIndex + 1; i < linearExerciseOrder.length; i++) {
      const nextItem = linearExerciseOrder[i];
      const state = exercises.find(e => e.id === nextItem.id);
      if (!state?.completed && !state?.skipReason) {
        return nextItem.name;
      }
    }

    return 'Treino finalizado';
  }, [session.workoutStarted, linearExerciseOrder, exercises]);

  const getNextExerciseOptions = useCallback((currentExerciseId?: number): { name: string; group: string }[] => {
    if (!session.workoutStarted) return [];
    if (linearExerciseOrder.length === 0) return [];
    
    const options: { name: string; group: string }[] = [];
    
    let startIndex = -1;
    if (currentExerciseId) {
      for (let i = 0; i < linearExerciseOrder.length; i++) {
        if (linearExerciseOrder[i].id === currentExerciseId) {
          startIndex = i;
          break;
        }
      }
    }
    
    for (let i = startIndex + 1; i < linearExerciseOrder.length && options.length < 5; i++) {
      const item = linearExerciseOrder[i];
      const state = exercises.find(e => e.id === item.id);
      if (!state?.completed && !state?.skipReason) {
        const group = groups[item.groupIndex];
        options.push({
          name: item.name,
          group: group?.displayName || 'Exercício'
        });
      }
    }
    
    return options;
  }, [session.workoutStarted, linearExerciseOrder, exercises, groups]);

  const showRestTimerWithOptions = useCallback((type: 'exercise' | 'group', currentExerciseId?: number, wasSkipped: boolean = false) => {
    if (!session.workoutStarted) return;
    
    if (wasSkipped) {
      const allCompleted = exercises.every(ex => ex.completed || ex.skipReason);
      if (allCompleted) {
        setSession(prev => ({ ...prev, workoutCompleted: true }));
        setTimeout(() => setShowCaloriesModal(true), 100);
      }
      return;
    }
    
    const nextName = getNextAvailableExercise(currentExerciseId);
    
    if (nextName === 'Treino finalizado') {
      const allCompleted = exercises.every(ex => ex.completed || ex.skipReason);
      if (allCompleted) {
        setSession(prev => ({ ...prev, workoutCompleted: true }));
        setTimeout(() => setShowCaloriesModal(true), 100);
      }
      return;
    }
    
    setRestType(type);
    setNextExerciseName(nextName);
    setShowRest(true);
  }, [session.workoutStarted, exercises, getNextAvailableExercise]);

  const closeRestTimer = useCallback(() => {
    setShowRest(false);
  }, []);

  /**
   * Verifica se todos os exercícios foram concluídos e finaliza o treino
   */
  const checkAndFinalizeWorkout = useCallback(() => {
    const allCompleted = exercises.every(ex => ex.completed || ex.skipReason);
    if (allCompleted) {
      console.log('🎉 Todos os exercícios concluídos! Finalizando treino...');
      setSession(prev => ({ ...prev, workoutCompleted: true }));
      setTimeout(() => setShowCaloriesModal(true), 100);
      return true;
    }
    return false;
  }, [exercises]);

  const completeExercise = useCallback((exerciseId: number) => {
    if (!session.workoutStarted) return;

    const existingExercise = exercises.find(ex => ex.id === exerciseId);
    if (!existingExercise || existingExercise.completed) return;
    
    setExercises(prevExercises => {
      return prevExercises.map(ex => 
        ex.id === exerciseId ? { ...ex, completed: true } : ex
      );
    });
    
    const newCompletedExercises = [...session.completedExercises, exerciseId];
    setSession(prev => ({
      ...prev,
      completedExercises: newCompletedExercises
    }));
    
    saveProgress();
    
    setTimeout(() => {
      // Verificar se todos os exercícios foram concluídos
      const updatedExercises = exercises.map(ex => 
        ex.id === exerciseId ? { ...ex, completed: true } : ex
      );
      const allCompleted = updatedExercises.every(ex => ex.completed || ex.skipReason);
      
      if (allCompleted) {
        console.log('🎉 Todos os exercícios concluídos!');
        setSession(prev => ({ ...prev, workoutCompleted: true }));
        setTimeout(() => setShowCaloriesModal(true), 100);
        return;
      }
      
      // Verificar se o grupo atual foi completamente concluído
      const currentGroup = groups[session.currentGroupIndex];
      if (currentGroup) {
        const allInGroupCompleted = currentGroup.exercises.every(ex => {
          const state = updatedExercises.find(e => e.id === ex.id);
          return state?.completed || state?.skipReason;
        });
        
        if (allInGroupCompleted) {
          setGroups(prevGroups => 
            prevGroups.map(g =>
              g.name === currentGroup.name ? { ...g, completed: true } : g
            )
          );
          
          const nextGroupIndex = session.currentGroupIndex + 1;
          if (nextGroupIndex < groups.length) {
            setSession(prev => ({
              ...prev,
              currentGroupIndex: nextGroupIndex
            }));
            
            const firstExerciseInNextGroup = groups[nextGroupIndex].exercises.find(e => {
              const state = updatedExercises.find(ex => ex.id === e.id);
              return !state?.completed && !state?.skipReason;
            });
            
            if (firstExerciseInNextGroup) {
              showRestTimerWithOptions('group', firstExerciseInNextGroup.id, false);
            }
          }
        } else {
          const nextExercise = getNextAvailableExercise(exerciseId);
          if (nextExercise !== 'Treino finalizado') {
            setRestType('exercise');
            setNextExerciseName(nextExercise);
            setShowRest(true);
          }
        }
      }
      
      saveProgress();
    }, 100);
  }, [session, exercises, groups, saveProgress, getNextAvailableExercise, showRestTimerWithOptions]);

  const showCardioInputModal = useCallback((exercise: Exercise) => {
    setCurrentCardioExercise(exercise);
    setShowCardioModal(true);
  }, []);

  /**
   * CORRIGIDO: Só pede Distância e Duração para caminhada
   */
  const saveCardioData = useCallback((data: {
    distance: number;
    duration: number;
  }) => {
    if (!currentCardioExercise) return;
    
    // Salvar apenas distância e duração. Calorias e FC serão pedidas no final do treino
    const execution: ExerciseExecution = {
      exerciseId: currentCardioExercise.id,
      date: new Date(),
      weight: 0,
      completed: true,
      cardioData: {
        distance: data.distance,
        duration: data.duration,
        calories: 0, // Será preenchido no final
        heartRate: 0 // Será preenchido no final
      }
    };
    
    setExecutionData(prev => ({
      ...prev,
      [currentCardioExercise.id]: execution
    }));
    
    completeExercise(currentCardioExercise.id);
    
    setShowCardioModal(false);
    setCurrentCardioExercise(null);
    
    saveProgress();
  }, [currentCardioExercise, saveProgress, completeExercise]);

  const closeCardioModal = useCallback(() => {
    setShowCardioModal(false);
    setCurrentCardioExercise(null);
  }, []);

  const prepareWeightRegistration = useCallback((exerciseId: number) => {
    const exercise = exercises.find(ex => ex.id === exerciseId);
    if (!exercise || exercise.completed) return;
    
    if (exercise.isCardio) {
      showCardioInputModal(exercise);
      return;
    }
    
    if (exercise.noWeight) {
      completeExercise(exerciseId);
      return;
    }
    
    setCurrentExerciseForWeight(exercise);
    setShowWeightModal(true);
  }, [exercises, showCardioInputModal, completeExercise]);

  const saveWeightRegistration = useCallback((data: {
    weight: number;
    variationId?: number;
    observations?: string;
  }) => {
    if (!currentExerciseForWeight) return;
    
    const execution: ExerciseExecution = {
      exerciseId: currentExerciseForWeight.id,
      date: new Date(),
      weight: data.weight,
      variationId: data.variationId,
      variationName: currentExerciseForWeight.variations?.find(v => v.id === data.variationId)?.name,
      observations: data.observations,
      completed: true
    };
    
    setExecutionData(prev => ({
      ...prev,
      [currentExerciseForWeight.id]: execution
    }));
    
    completeExercise(currentExerciseForWeight.id);
    
    setShowWeightModal(false);
    setCurrentExerciseForWeight(null);
    
    saveProgress();
  }, [currentExerciseForWeight, saveProgress, completeExercise]);

  const skipExercise = useCallback((exerciseId: number, reason: string) => {
    if (!session.workoutStarted) return;

    const existingExercise = exercises.find(ex => ex.id === exerciseId);
    if (!existingExercise || existingExercise.completed) return;
    
    setExercises(prevExercises => {
      const updatedExercises = prevExercises.map(ex => 
        ex.id === exerciseId ? { 
          ...ex, 
          completed: true,
          skipReason: reason
        } : ex
      );
      return updatedExercises;
    });
    
    const newCompletedExercises = [...session.completedExercises, exerciseId];
    setSession(prev => ({
      ...prev,
      completedExercises: newCompletedExercises
    }));
    
    saveProgress();
    
    setTimeout(() => {
      const updatedExercises = exercises.map(ex => 
        ex.id === exerciseId ? { ...ex, completed: true, skipReason: reason } : ex
      );
      const allCompleted = updatedExercises.every(ex => ex.completed || ex.skipReason);
      
      if (allCompleted) {
        setSession(prev => ({ ...prev, workoutCompleted: true }));
        setTimeout(() => setShowCaloriesModal(true), 100);
        return;
      }
      
      const currentGroup = groups[session.currentGroupIndex];
      if (currentGroup) {
        const allInGroupCompleted = currentGroup.exercises.every(ex => {
          const state = updatedExercises.find(e => e.id === ex.id);
          return state?.completed || state?.skipReason;
        });
        
        if (allInGroupCompleted) {
          setGroups(prevGroups => 
            prevGroups.map(g =>
              g.name === currentGroup.name ? { ...g, completed: true } : g
            )
          );
          
          const nextGroupIndex = session.currentGroupIndex + 1;
          if (nextGroupIndex < groups.length) {
            setSession(prev => ({
              ...prev,
              currentGroupIndex: nextGroupIndex
            }));
          }
        }
      }
      
      const nextExercise = getNextAvailableExercise(exerciseId);
      if (nextExercise !== 'Treino finalizado') {
        setRestType('exercise');
        setNextExerciseName(nextExercise);
        setShowRest(true);
      }
      
      saveProgress();
    }, 100);
  }, [session.workoutStarted, exercises, groups, session.completedExercises, session.currentGroupIndex, getNextAvailableExercise, saveProgress]);

  const completeExerciseWithRest = useCallback((exerciseId: number) => {
    prepareWeightRegistration(exerciseId);
  }, [prepareWeightRegistration]);

  const resetWorkout = useCallback(() => {
    setExercises(prevExercises => 
      prevExercises.map(exercise => ({
        ...exercise,
        completed: false,
        skipReason: undefined
      }))
    );
    
    const newSession: WorkoutSession = {
      workoutStarted: false,
      workoutCompleted: false,
      currentGroupIndex: 0,
      currentExerciseId: null,
      completedExercises: [],
      completedGroups: [],
      smartwatchConfirmed: false,
      workoutStartTime: undefined
    };
    setSession(newSession);
    
    setGroups(prevGroups => 
      prevGroups.map(group => ({
        ...group,
        completed: false
      }))
    );
    
    setExecutionData({});
    workoutStartTimeRef.current = null;
    
    localStorage.removeItem(`workout-${workoutType}`);
  }, [workoutType]);

  const startWorkout = useCallback(() => {
    setShowSmartwatchModal(true);
  }, []);

  const startWorkoutWithConfirmation = useCallback(() => {
    startWorkout();
  }, [startWorkout]);

  const confirmSmartwatchStart = useCallback(() => {
    const startTime = new Date();
    const newSession = {
      ...session,
      workoutStarted: true,
      currentGroupIndex: 0,
      smartwatchConfirmed: true,
      workoutStartTime: startTime
    };
    
    workoutStartTimeRef.current = startTime;
    
    setSession(newSession);
    setShowSmartwatchModal(false);
    saveProgress();
    // REMOVIDO: sendWhatsAppStartMessage();
  }, [session, saveProgress]);

  const cancelSmartwatchStart = useCallback(() => {
    setShowSmartwatchModal(false);
  }, []);

  const prepareWorkoutFinalization = useCallback(() => {
    const canFinish = exercises.every(ex => ex.completed || ex.skipReason);
    console.log('🔍 prepareWorkoutFinalization - canFinish:', canFinish);
    console.log('🔍 Exercícios pendentes:', exercises.filter(ex => !ex.completed && !ex.skipReason).map(ex => ex.name));
    
    if (!canFinish) {
      return;
    }
    
    console.log('🎯 Abrindo modal de calorias...');
    console.log('🎯 showCaloriesModal antes:', showCaloriesModal);
    setShowCaloriesModal(true);
    console.log('🎯 showCaloriesModal depois:', true);
  }, [exercises, showCaloriesModal]);

  const canFinishWorkout = useCallback((): boolean => {
    const allCompleted = exercises.every(ex => ex.completed || ex.skipReason);
    console.log('🔍 canFinishWorkout - resultado:', allCompleted);
    return allCompleted;
  }, [exercises]);

  const sendTelegramReport = useCallback(async (report: EnhancedWorkoutReport): Promise<boolean> => {
    try {
      const formatDuration = (seconds: number): string => {
        const mins = Math.floor(seconds / 60);
        const secs = seconds % 60;
        return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
      };

      const formattedDate = report.date.toLocaleDateString('pt-BR');
      const formattedTime = report.date.toLocaleTimeString('pt-BR');
      
      const completedExercises = report.exercises.filter(e => e.completed && !e.skipReason).length;
      const skippedExercises = report.exercises.filter(e => e.skipReason).length;
      const totalExercises = report.exercises.length;
      const completedPercentage = Math.round((completedExercises / totalExercises) * 100);
      
      const completedExercisesData = report.exercises.filter(e => e.completed && !e.skipReason);
      const skippedExercisesData = report.exercises.filter(e => e.skipReason);
      
      const totalWeight = completedExercisesData.reduce((sum, ex) => sum + (ex.weight || 0), 0);
      const avgWeight = completedExercisesData.length > 0 ? totalWeight / completedExercisesData.length : 0;
      
      let reportMessage = `
🏋️‍♂️ *RELATÓRIO DE TREINO - ${report.workoutType}* 🏋️‍♂️

📅 *Data:* ${formattedDate}
⏰ *Hora de início:* ${formattedTime}
⏱️ *Duração total:* ${formatDuration(report.duration)}

📊 *ESTATÍSTICAS:*
├ ✅ Exercícios completados: ${completedExercises}/${totalExercises} (${completedPercentage}%)
├ ⏭️ Exercícios pulados: ${skippedExercises}
├ 🔥 Calorias gastas: ${report.totalCalories} kcal
${report.heartRate ? `├ 💓 Frequência cardíaca média: ${report.heartRate} bpm` : ''}
└ 💪 Peso total movimentado: ${totalWeight.toFixed(1)} kg

📝 *EXERCÍCIOS REALIZADOS:*
`;

      completedExercisesData.forEach((ex, index) => {
        reportMessage += `
${index + 1}. *${ex.name}*
   ├ Peso: ${ex.weight || (ex.cardioData ? '-' : '0')} kg
   ├ Variação: ${ex.variation || 'Padrão'}
   ${ex.observations ? `└ Obs: ${ex.observations}` : '└ Obs: -'}
`;
        if (ex.cardioData && ex.cardioData.calories > 0) {
          reportMessage += `   ├ 📏 Distância: ${ex.cardioData.distance}m
   ├ 💓 FC: ${ex.cardioData.heartRate} bpm
   └ 🔥 Calorias: ${ex.cardioData.calories} kcal
`;
        }
      });

      if (skippedExercisesData.length > 0) {
        reportMessage += `
⏭️ *EXERCÍCIOS NÃO REALIZADOS:*`;
        skippedExercisesData.forEach((ex, index) => {
          reportMessage += `
${completedExercisesData.length + index + 1}. *${ex.name}*
   └ Motivo: ${ex.skipReason || 'Não informado'}`;
        });
      }

      reportMessage += `

🏆 *RESUMO:*
Peso médio por exercício: ${avgWeight.toFixed(1)} kg

💪 *Próximos passos:*
• Manter a consistência nos treinos
• Aumentar carga gradualmente
• Manter boa alimentação e hidratação

#EvoluçãoTreinos #${report.workoutType} #Progresso
      `.trim();
      
      const TELEGRAM_BOT_TOKEN = process.env.REACT_APP_TELEGRAM_BOT_TOKEN || '';
      const TELEGRAM_CHAT_ID = process.env.REACT_APP_TELEGRAM_CHAT_ID || '';
      
      if (!TELEGRAM_BOT_TOKEN || !TELEGRAM_CHAT_ID) {
        console.warn('Token ou Chat ID do Telegram não configurados');
        return false;
      }
      
      const response = await fetch(
        `https://api.telegram.org/bot${TELEGRAM_BOT_TOKEN}/sendMessage`,
        {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            chat_id: TELEGRAM_CHAT_ID,
            text: reportMessage,
            parse_mode: 'Markdown',
            disable_notification: false,
          }),
        }
      );
      
      return response.ok;
      
    } catch (error) {
      console.error('Erro ao enviar relatório para Telegram:', error);
      return false;
    }
  }, []);

  const finalizeWorkout = useCallback(async (calories: number, heartRate?: number) => {
    setIsSendingReport(true);
    
    try {
      const duration = workoutStartTimeRef.current 
        ? Math.floor((Date.now() - workoutStartTimeRef.current.getTime()) / 1000)
        : 0;
      
      // Atualizar os dados de cardio com as calorias e FC do treino completo
      const updatedExecutionData = { ...executionData };
      for (const [id, exec] of Object.entries(executionData)) {
        if (exec.cardioData && exec.cardioData.calories === 0) {
          updatedExecutionData[parseInt(id)] = {
            ...exec,
            cardioData: {
              ...exec.cardioData,
              calories: calories,
              heartRate: heartRate || 0
            }
          };
        }
      }
      setExecutionData(updatedExecutionData);
      
      const report: EnhancedWorkoutReport = {
        id: `report-${workoutType}-${Date.now()}`,
        workoutType,
        date: new Date(),
        duration,
        totalCalories: calories,
        heartRate,
        exercises: exercises.map(ex => ({
          id: ex.id,
          name: ex.name,
          weight: updatedExecutionData[ex.id]?.weight || 0,
          variation: updatedExecutionData[ex.id]?.variationName,
          observations: updatedExecutionData[ex.id]?.observations,
          sets: parseInt(ex.sets),
          completed: ex.completed,
          skipReason: ex.skipReason,
          cardioData: updatedExecutionData[ex.id]?.cardioData
        })),
        sentToTelegram: false
      };
      
      localStorage.setItem(`report-${report.id}`, JSON.stringify(report));
      
      const success = await sendTelegramReport(report);
      
      if (success) {
        report.sentToTelegram = true;
        localStorage.setItem(`report-${report.id}`, JSON.stringify(report));
      }
      
      localStorage.removeItem(`workout-${workoutType}`);
      
    } catch (error) {
      console.error('Erro ao finalizar treino:', error);
    } finally {
      setIsSendingReport(false);
      setShowCaloriesModal(false);
      resetWorkout();
    }
  }, [workoutType, exercises, executionData, sendTelegramReport, resetWorkout]);

  const getCurrentGroup = useCallback((): WorkoutGroup | undefined => {
    if (!groups || groups.length === 0) return undefined;
    const safeIndex = Math.min(session.currentGroupIndex, groups.length - 1);
    return groups[safeIndex];
  }, [groups, session.currentGroupIndex]);

  const isExerciseLocked = useCallback((exerciseId: number): boolean => {
    if (!groups || groups.length === 0) return true;
    const exercise = exercises.find(ex => ex.id === exerciseId);
    if (!exercise) return true;
    const exerciseGroupIndex = groups.findIndex(g => g.name === exercise.muscleGroup);
    return exerciseGroupIndex > session.currentGroupIndex;
  }, [groups, exercises, session.currentGroupIndex]);

  const isExerciseCurrent = useCallback((exerciseId: number): boolean => {
    const exercise = exercises.find(ex => ex.id === exerciseId);
    if (!exercise) return false;
    
    const currentGroupIndex = session.currentGroupIndex;
    if (currentGroupIndex >= groups.length) return false;
    
    const currentGroup = groups[currentGroupIndex];
    if (!currentGroup) return false;
    
    if (exercise.muscleGroup === currentGroup.name) {
      const exerciseState = exercises.find(e => e.id === exerciseId);
      if (exerciseState?.completed || exerciseState?.skipReason) return false;
      
      for (const ex of currentGroup.exercises) {
        const state = exercises.find(e => e.id === ex.id);
        if (!state?.completed && !state?.skipReason) {
          return ex.id === exerciseId;
        }
      }
    }
    return false;
  }, [exercises, groups, session.currentGroupIndex]);

  const isGroupActive = useCallback((groupName: MuscleGroup): boolean => {
    const currentGroupIndex = session.currentGroupIndex;
    if (currentGroupIndex >= groups.length) return false;
    const currentGroup = groups[currentGroupIndex];
    if (!currentGroup) return false;
    return groupName === currentGroup.name;
  }, [groups, session.currentGroupIndex]);

  const getAllGroupedExercises = useCallback((): WorkoutGroup[] => {
    return groups.map(group => ({
      ...group,
      exercises: group.exercises.map(ex => {
        const exerciseState = exercises.find(e => e.id === ex.id);
        return exerciseState || ex;
      }),
      completed: group.exercises.every(ex => {
        const exerciseState = exercises.find(e => e.id === ex.id);
        return exerciseState?.completed || exerciseState?.skipReason;
      })
    }));
  }, [groups, exercises]);

  const getWorkoutProgress = useCallback(() => {
    const totalExercises = exercises.length;
    const completedExercises = exercises.filter(ex => ex.completed || ex.skipReason).length;
    const progressPercentage = totalExercises > 0 ? (completedExercises / totalExercises) * 100 : 0;
    
    const completedGroupsCount = groups.filter(group => 
      group.exercises.every(ex => {
        const exerciseState = exercises.find(e => e.id === ex.id);
        return exerciseState?.completed || exerciseState?.skipReason;
      })
    ).length;
    
    return {
      totalExercises,
      completedExercises,
      progressPercentage: Math.round(progressPercentage),
      completedGroups: completedGroupsCount,
      totalGroups: groups.length
    };
  }, [exercises, groups]);

  const isGroupCompleted = useCallback((groupName: MuscleGroup): boolean => {
    const group = groups.find(g => g.name === groupName);
    if (!group) return false;
    return group.exercises.every(exercise => {
      const exerciseState = exercises.find(e => e.id === exercise.id);
      return exerciseState?.completed || exerciseState?.skipReason;
    });
  }, [groups, exercises]);

  const closeWeightModal = useCallback(() => {
    setShowWeightModal(false);
    setCurrentExerciseForWeight(null);
  }, []);

  const closeCaloriesModal = useCallback(() => {
    setShowCaloriesModal(false);
  }, []);

  const getElapsedWorkoutTime = useCallback((): number => {
    if (!workoutStartTimeRef.current) return 0;
    return Math.floor((Date.now() - workoutStartTimeRef.current.getTime()) / 1000);
  }, []);

  return {
    exercises,
    groups,
    session,
    executionData,
    
    showRest,
    restType,
    nextExerciseName,
    showSmartwatchModal,
    showWeightModal,
    showCaloriesModal,
    showCardioModal,
    currentExerciseForWeight,
    currentCardioExercise,
    isSendingReport,
    
    initializeExercises,
    resetWorkout,
    startWorkout,
    completeExerciseWithRest,
    
    startWorkoutWithConfirmation,
    confirmSmartwatchStart,
    cancelSmartwatchStart,
    
    prepareWeightRegistration,
    saveWeightRegistration,
    saveCardioData,
    closeCardioModal,
    skipExercise,
    
    closeRestTimer,
    showRestTimerWithOptions,
    getNextExerciseOptions,
    
    prepareWorkoutFinalization,
    finalizeWorkout,
    canFinishWorkout,
    
    getCurrentGroup,
    isExerciseLocked,
    isExerciseCurrent,
    isGroupActive,
    getAllGroupedExercises,
    getWorkoutProgress,
    saveProgress,
    getNextAvailableExercise,
    isGroupCompleted,
    
    closeWeightModal,
    closeCaloriesModal,
    
    getElapsedWorkoutTime
  };
};