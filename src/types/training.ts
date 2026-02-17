// types/training.ts
export interface Exercise {
  id: string;
  name: string;
  sets: number;
  reps: number;
  restTime: number;
  muscleGroup: 'peito' | 'ombro' | 'triceps' | 'pernas' | 'costas' | 'biceps';
  completed: boolean;
  started: boolean;
}

export interface WorkoutSession {
  currentExerciseIndex: number;
  workoutStarted: boolean;
  workoutCompleted: boolean;
  currentSet: number;
  exerciseOrder: string[];
  completedExercises: string[];
}

export interface WorkoutData {
  exercises: Exercise[];
  session: WorkoutSession;
}