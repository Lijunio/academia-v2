// hooks/useWorkoutLogic.ts
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

const WORKOUT_A_GROUPS: MuscleGroup[] = ['peito', 'ombro', 'triceps', 'pernas'];
const WORKOUT_B_GROUPS: MuscleGroup[] = ['costas', 'trapezio', 'biceps', 'antebraco', 'posterior', 'panturrilha'];

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
  posterior: 'Perna Posterior'
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
  
  const isInitializedRef = useRef(false);
  const workoutStartTimeRef = useRef<Date | null>(null);
  
  const initializeExercises = useCallback((initialExercises: ExerciseBase[]) => {
    if (isInitializedRef.current) return;

    const enhancedExercises: Exercise[] = initialExercises.map(exercise => ({
      ...exercise,
      completed: false,
      started: false,
      reps: 10,
      restTime: 60,
      skipReason: undefined,
      hasVariations: exercise.hasVariations || false,
      variations: exercise.variations || []
    }));

    const workoutGroups = workoutType === 'A' ? WORKOUT_A_GROUPS : WORKOUT_B_GROUPS;

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
    isInitializedRef.current = true;

    setTimeout(() => {
      const saved = localStorage.getItem(`workout-${workoutType}`);
      if (saved) {
        try {
          const parsed: WorkoutData = JSON.parse(saved);
          
          if (parsed.exercises && Array.isArray(parsed.exercises)) {
            setExercises(parsed.exercises);
          }
          
          if (parsed.groups && Array.isArray(parsed.groups)) {
            setGroups(parsed.groups);
          }
          
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
  }, [workoutType]);

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

  const sendWhatsAppStartMessage = useCallback(() => {
    try {
      const now = new Date();
      const formattedTime = now.toLocaleTimeString('pt-BR', {
        hour: '2-digit',
        minute: '2-digit'
      });
      const formattedDate = now.toLocaleDateString('pt-BR');
      
      const message = `🏋️‍♂️ *INÍCIO DE TREINO* 🏋️‍♂️\n\n` +
        `✅ *Treino iniciado com sucesso!*\n\n` +
        `📅 Data: ${formattedDate}\n` +
        `⏰ Hora: ${formattedTime}\n` +
        `🏋️ Tipo: ${workoutType}\n\n` +
        `🚀 *Bom treino! Vamos evoluir!* 💪`;
      
      const encodedMessage = encodeURIComponent(message);
      const whatsappUrl = `https://wa.me/?text=${encodedMessage}`;
      
      window.open(whatsappUrl, '_blank');
      
      console.log('✅ WhatsApp enviado após confirmação do smartwatch');
    } catch (error) {
      console.error('❌ Erro ao enviar WhatsApp:', error);
    }
  }, [workoutType]);

  const getNextAvailableExercise = useCallback((currentExerciseId?: number): string => {
    if (!session.workoutStarted) return 'Inicie o treino';

    const currentGroup = groups[session.currentGroupIndex];
    if (!currentGroup) return 'Treino finalizado';
    
    for (const ex of currentGroup.exercises) {
      const exerciseState = exercises.find(e => e.id === ex.id);
      if (currentExerciseId && ex.id === currentExerciseId) continue;
      if (!exerciseState?.completed && !exerciseState?.skipReason) {
        return ex.name;
      }
    }
    
    const nextGroupIndex = session.currentGroupIndex + 1;
    if (nextGroupIndex < groups.length) {
      const nextGroup = groups[nextGroupIndex];
      for (const ex of nextGroup.exercises) {
        const exerciseState = exercises.find(e => e.id === ex.id);
        if (!exerciseState?.completed && !exerciseState?.skipReason) {
          return ex.name;
        }
      }
    }
    
    return 'Treino finalizado';
  }, [session.workoutStarted, session.currentGroupIndex, groups, exercises]);

  const getNextExerciseOptions = useCallback((currentExerciseId?: number): { name: string; group: string }[] => {
    if (!session.workoutStarted) return [];
    
    const options: { name: string; group: string }[] = [];
    
    for (let i = session.currentGroupIndex; i < groups.length; i++) {
      const group = groups[i];
      
      for (const ex of group.exercises) {
        const exerciseState = exercises.find(e => e.id === ex.id);
        if (currentExerciseId && ex.id === currentExerciseId) continue;
        if (!exerciseState?.completed && !exerciseState?.skipReason) {
          options.push({
            name: ex.name,
            group: group.displayName
          });
        }
      }
      
      if (options.length >= 5) break;
    }
    
    return options;
  }, [session.workoutStarted, session.currentGroupIndex, groups, exercises]);

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
    
    const options = getNextExerciseOptions(currentExerciseId);
    
    if (options.length === 0) {
      const allCompleted = exercises.every(ex => ex.completed || ex.skipReason);
      if (allCompleted) {
        setSession(prev => ({ ...prev, workoutCompleted: true }));
        setTimeout(() => setShowCaloriesModal(true), 100);
      }
      return;
    }
    
    const nextName = getNextAvailableExercise(currentExerciseId);
    
    setRestType(type);
    setNextExerciseName(nextName);
    setShowRest(true);
  }, [session.workoutStarted, getNextExerciseOptions, getNextAvailableExercise, exercises]);

  const closeRestTimer = useCallback(() => {
    setShowRest(false);
  }, []);

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
    
    setTimeout(() => {
      const groupIndex = groups.findIndex(g => g.name === existingExercise.muscleGroup);
      const group = groups[groupIndex];
      
      if (group) {
        const updatedExercises = exercises.map(ex => 
          ex.id === exerciseId ? { ...ex, completed: true } : ex
        );
        
        const allGroupExercisesCompleted = group.exercises.every(groupEx => {
          const exerciseState = updatedExercises.find(e => e.id === groupEx.id);
          return exerciseState?.completed || exerciseState?.skipReason;
        });
        
        if (allGroupExercisesCompleted) {
          setGroups(prevGroups => 
            prevGroups.map(g =>
              g.name === group.name ? { ...g, completed: true } : g
            )
          );
          
          const nextGroupIndex = groupIndex + 1;
          if (nextGroupIndex < groups.length) {
            setSession(prev => ({
              ...prev,
              currentGroupIndex: nextGroupIndex
            }));
            
            const nextGroup = groups[nextGroupIndex];
            const firstExerciseInNextGroup = nextGroup.exercises.find(e => {
              const state = updatedExercises.find(ex => ex.id === e.id);
              return !state?.completed && !state?.skipReason;
            });
            
            if (firstExerciseInNextGroup) {
              showRestTimerWithOptions('group', firstExerciseInNextGroup.id, false);
            }
          } else {
            const allCompleted = updatedExercises.every(ex => ex.completed || ex.skipReason);
            if (allCompleted) {
              setSession(prev => ({ ...prev, workoutCompleted: true }));
              setTimeout(() => setShowCaloriesModal(true), 100);
            }
          }
        } else {
          const nextExerciseInGroup = group.exercises.find(e => {
            const state = updatedExercises.find(ex => ex.id === e.id);
            return !state?.completed && !state?.skipReason;
          });
          
          if (nextExerciseInGroup) {
            showRestTimerWithOptions('exercise', nextExerciseInGroup.id, false);
          }
        }
      }
      
      saveProgress();
    }, 100);
  }, [session, exercises, groups, saveProgress, showRestTimerWithOptions]);

  const prepareWeightRegistration = useCallback((exerciseId: number) => {
    const exercise = exercises.find(ex => ex.id === exerciseId);
    if (!exercise || exercise.completed) return;
    
    setCurrentExerciseForWeight(exercise);
    setShowWeightModal(true);
  }, [exercises]);

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
      const groupIndex = groups.findIndex(g => g.name === existingExercise.muscleGroup);
      const group = groups[groupIndex];
      
      if (group) {
        const currentExercisesState = exercises.map(ex => 
          ex.id === exerciseId ? { ...ex, completed: true, skipReason: reason } : ex
        );
        
        const allGroupExercisesCompleted = group.exercises.every(groupEx => {
          const exerciseState = currentExercisesState.find(e => e.id === groupEx.id);
          return exerciseState?.completed || exerciseState?.skipReason;
        });
        
        if (allGroupExercisesCompleted) {
          setGroups(prevGroups => 
            prevGroups.map(g =>
              g.name === group.name ? { ...g, completed: true } : g
            )
          );
          
          const nextGroupIndex = groupIndex + 1;
          if (nextGroupIndex < groups.length) {
            setSession(prev => ({
              ...prev,
              currentGroupIndex: nextGroupIndex
            }));
          }
          
          saveProgress();
        }
      }
    }, 150);
  }, [session.workoutStarted, exercises, groups, session.completedExercises, saveProgress]);

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
    
    console.log('✅ Treino resetado');
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
    sendWhatsAppStartMessage();
  }, [session, saveProgress, sendWhatsAppStartMessage]);

  const cancelSmartwatchStart = useCallback(() => {
    setShowSmartwatchModal(false);
  }, []);

  const prepareWorkoutFinalization = useCallback(() => {
    const canFinish = exercises.every(ex => ex.completed || ex.skipReason);
    
    if (!canFinish) {
      return;
    }
    
    setShowCaloriesModal(true);
  }, [exercises]);

  const canFinishWorkout = useCallback((): boolean => {
    return exercises.every(ex => ex.completed || ex.skipReason);
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
🏋️‍♂️ *RELATÓRIO DE TREINO - ${report.workoutType.toUpperCase()}* 🏋️‍♂️

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
   ├ Peso: ${ex.weight} kg
   ├ Variação: ${ex.variation || 'Padrão'}
   ${ex.observations ? `└ Obs: ${ex.observations}` : '└ Obs: -'}
`;
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
          weight: executionData[ex.id]?.weight || 0,
          variation: executionData[ex.id]?.variationName,
          observations: executionData[ex.id]?.observations,
          sets: parseInt(ex.sets),
          completed: ex.completed,
          skipReason: ex.skipReason
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
      
      if (exerciseState?.completed || exerciseState?.skipReason) {
        return false;
      }
      
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
    if (!workoutStartTimeRef.current) {
      return 0;
    }
    
    const now = new Date();
    const startTime = workoutStartTimeRef.current;
    const elapsedSeconds = Math.floor((now.getTime() - startTime.getTime()) / 1000);
    
    return elapsedSeconds;
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
    currentExerciseForWeight,
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