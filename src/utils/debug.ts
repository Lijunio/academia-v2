export const log = (title: string, data: any) => {
  const timestamp = new Date().toLocaleTimeString();
  console.log(`[${timestamp}] 🔍 ${title}:`, data);
};

export const logError = (title: string, error: any) => {
  const timestamp = new Date().toLocaleTimeString();
  console.error(`[${timestamp}] ❌ ${title}:`, error);
};

export const logWarning = (title: string, warning: any) => {
  const timestamp = new Date().toLocaleTimeString();
  console.warn(`[${timestamp}] ⚠️ ${title}:`, warning);
};

export const logSuccess = (title: string, data: any) => {
  const timestamp = new Date().toLocaleTimeString();
  console.log(`[${timestamp}] ✅ ${title}:`, data);
};

export const logWorkout = (title: string, workoutType: 'A' | 'B', data: any) => {
  const timestamp = new Date().toLocaleTimeString();
  console.log(`[${timestamp}] 🏋️‍♂️ ${workoutType} - ${title}:`, data);
};

export const logExercise = (exerciseId: number, action: string, data?: any) => {
  const timestamp = new Date().toLocaleTimeString();
  if (data) {
    console.log(`[${timestamp}] 🏃‍♂️ Exercício ${exerciseId} - ${action}:`, data);
  } else {
    console.log(`[${timestamp}] 🏃‍♂️ Exercício ${exerciseId} - ${action}`);
  }
};

export const logGroup = (groupName: string, action: string, data?: any) => {
  const timestamp = new Date().toLocaleTimeString();
  if (data) {
    console.log(`[${timestamp}] 📦 Grupo ${groupName} - ${action}:`, data);
  } else {
    console.log(`[${timestamp}] 📦 Grupo ${groupName} - ${action}`);
  }
};

export const logProgress = (workoutType: 'A' | 'B', progress: any) => {
  const timestamp = new Date().toLocaleTimeString();
  console.log(`[${timestamp}] 📊 ${workoutType} Progresso:`, {
    total: progress.totalExercises,
    completed: progress.completedExercises,
    percentage: `${progress.progressPercentage}%`,
    groups: `${progress.completedGroups}/${progress.totalGroups}`
  });
};