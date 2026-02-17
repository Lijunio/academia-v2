// utils/workoutStorage.ts
export const saveWorkoutProgress = (workoutType: 'A' | 'B', data: any) => {
  localStorage.setItem(`workout-${workoutType}-progress`, JSON.stringify(data));
};

export const loadWorkoutProgress = (workoutType: 'A' | 'B') => {
  const saved = localStorage.getItem(`workout-${workoutType}-progress`);
  return saved ? JSON.parse(saved) : null;
};

export const clearWorkoutProgress = (workoutType: 'A' | 'B') => {
  localStorage.removeItem(`workout-${workoutType}-progress`);
};