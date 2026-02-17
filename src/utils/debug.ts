// utils/debug.ts

// Função para log normal com timestamp
export const log = (title: string, data: any) => {
  const timestamp = new Date().toLocaleTimeString();
  console.log(`[${timestamp}] 🔍 ${title}:`, data);
};

// Função para log de erro com timestamp
export const logError = (title: string, error: any) => {
  const timestamp = new Date().toLocaleTimeString();
  console.error(`[${timestamp}] ❌ ${title}:`, error);
};

// Função para log de warning com timestamp
export const logWarning = (title: string, warning: any) => {
  const timestamp = new Date().toLocaleTimeString();
  console.warn(`[${timestamp}] ⚠️ ${title}:`, warning);
};

// Função para log de sucesso com timestamp
export const logSuccess = (title: string, data: any) => {
  const timestamp = new Date().toLocaleTimeString();
  console.log(`[${timestamp}] ✅ ${title}:`, data);
};

// Função para log de informações de workout
export const logWorkout = (title: string, workoutType: 'A' | 'B', data: any) => {
  const timestamp = new Date().toLocaleTimeString();
  console.log(`[${timestamp}] 🏋️‍♂️ ${workoutType} - ${title}:`, data);
};

// Função para log de exercício específico
export const logExercise = (exerciseId: number, action: string, data?: any) => {
  const timestamp = new Date().toLocaleTimeString();
  if (data) {
    console.log(`[${timestamp}] 🏃‍♂️ Exercício ${exerciseId} - ${action}:`, data);
  } else {
    console.log(`[${timestamp}] 🏃‍♂️ Exercício ${exerciseId} - ${action}`);
  }
};

// Função para log de grupo
export const logGroup = (groupName: string, action: string, data?: any) => {
  const timestamp = new Date().toLocaleTimeString();
  if (data) {
    console.log(`[${timestamp}] 📦 Grupo ${groupName} - ${action}:`, data);
  } else {
    console.log(`[${timestamp}] 📦 Grupo ${groupName} - ${action}`);
  }
};

// Função para log de progresso
export const logProgress = (workoutType: 'A' | 'B', progress: any) => {
  const timestamp = new Date().toLocaleTimeString();
  console.log(`[${timestamp}] 📊 ${workoutType} Progresso:`, {
    total: progress.totalExercises,
    completed: progress.completedExercises,
    percentage: `${progress.progressPercentage}%`,
    groups: `${progress.completedGroups}/${progress.totalGroups}`
  });
};