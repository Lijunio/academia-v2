// types/workout.types.ts
export type MuscleGroup = 
  | 'peito' 
  | 'ombro' 
  | 'triceps' 
  | 'pernas' 
  | 'costas' 
  | 'biceps'
  | 'trapezio'
  | 'antebraco'
  | 'panturrilha'
  | 'posterior';

export interface ExerciseVariation {
  id: number;
  name: string;
  description?: string;
}

export interface ExerciseBase {
  id: number;
  name: string;
  sets: string;
  description: string;
  muscleGroup: MuscleGroup;
  images: string[];
  hasVariations?: boolean;
  variations?: ExerciseVariation[];
}

export interface Exercise extends ExerciseBase {
  completed: boolean;
  started: boolean;
  reps: number;
  restTime: number;
  skipReason?: string;
}

export interface ExerciseExecution {
  exerciseId: number;
  date: Date;
  weight: number;
  variationId?: number;
  variationName?: string;
  observations?: string;
  completed: boolean;
}

export interface WorkoutGroup {
  name: MuscleGroup;
  displayName: string;
  exercises: Exercise[];
  completed: boolean;
}

export type WorkoutType = 'A' | 'B';

export interface Workout {
  id: WorkoutType;
  name: string;
  focus: string;
  groups: MuscleGroup[];
  exercises: ExerciseBase[];
  totalExercises: number;
  totalSets: number;
  duration: number;
  backgroundImage: string;
}

export interface WorkoutSession {
  workoutStarted: boolean;
  workoutCompleted: boolean;
  currentGroupIndex: number;
  currentExerciseId: number | null;
  completedExercises: number[];
  completedGroups: MuscleGroup[];
  smartwatchConfirmed?: boolean;
  workoutStartTime?: Date;
}

export interface WorkoutData {
  exercises: Exercise[];
  session: WorkoutSession;
  groups: WorkoutGroup[];
  executionData?: Record<number, ExerciseExecution>;
}

export interface WorkoutReport {
  id: string;
  workoutType: WorkoutType;
  date: Date;
  duration: number;
  totalCalories: number;
  exercises: Array<{
    id: number;
    name: string;
    weight: number;
    variation?: string;
    observations?: string;
    sets: number;
    completed: boolean;
    skipReason?: string;
  }>;
  sentToTelegram: boolean;
  telegramMessageId?: string;
}