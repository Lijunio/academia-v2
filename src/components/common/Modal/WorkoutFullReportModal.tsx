// src/components/common/Modal/WorkoutFullReportModal.tsx
import React from 'react';

interface Workout {
  id: string;
  type: 'academia' | 'natacao' | 'pilates' | 'esteira' | 'spinning'; // Tipos atualizados
  date: string;
  duration: number;
  calories: number;
  heart_rate: number;
  details?: any;
  notes?: string;
}

interface WorkoutFullReportModalProps {
  workout: Workout;
  onClose: () => void;
}

const WorkoutFullReportModal: React.FC<WorkoutFullReportModalProps> = ({ workout, onClose }) => {
  
  const formatDuration = (seconds: number): string => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const getWorkoutTypeName = (type: string) => {
    switch(type) {
      case 'academia': return 'Treino de Academia';
      case 'natacao': return 'Natação';
      case 'pilates': return 'Pilates';
      case 'esteira': return 'Esteira / Caminhada';
      case 'spinning': return 'Spinning';
      default: return type;
    }
  };

  const getWorkoutSubType = (workout: Workout): string => {
    if (workout.type !== 'academia') return '';
    
    const notes = workout.notes?.toLowerCase() || '';
    const details = workout.details || {};
    
    if (notes.includes('treino a') || details.workoutType === 'A') return ' - Treino A';
    if (notes.includes('treino b') || details.workoutType === 'B') return ' - Treino B';
    return '';
  };

  const renderAcademiaDetails = () => {
    const exercises = workout.details?.exercises || [];
    const executionData = workout.details?.executionData || {};
    
    const completedExercises = exercises.filter((ex: any) => ex.completed && !ex.skipReason).length;
    const skippedExercises = exercises.filter((ex: any) => ex.skipReason).length;
    const totalExercises = exercises.length;
    
    if (exercises.length === 0) {
      return (
        <div className="bg-blue-500/10 rounded-xl p-6 text-center">
          <p className="text-blue-300">Detalhes dos exercícios não disponíveis</p>
        </div>
      );
    }
    
    return (
      <div className="space-y-4">
        <div className="bg-blue-500/10 rounded-xl p-4 border border-blue-500/20">
          <h4 className="text-blue-300 font-bold mb-3">📊 ESTATÍSTICAS DO TREINO</h4>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <p className="text-text-secondary text-xs">Exercícios</p>
              <p className="text-white font-bold">{completedExercises}/{totalExercises}</p>
            </div>
            <div>
              <p className="text-text-secondary text-xs">Pulados</p>
              <p className="text-yellow-400 font-bold">{skippedExercises}</p>
            </div>
            <div className="col-span-2">
              <p className="text-text-secondary text-xs">Conclusão</p>
              <p className="text-accent-green font-bold">{Math.round((completedExercises/totalExercises)*100)}%</p>
            </div>
          </div>
        </div>

        <h4 className="text-white font-bold mt-4 mb-2">📝 EXERCÍCIOS REALIZADOS:</h4>
        
        {exercises.map((ex: any, index: number) => {
          const execution = executionData[ex.id];
          const isCompleted = ex.completed && !ex.skipReason;
          const isSkipped = ex.skipReason;
          
          return (
            <div key={ex.id} className="bg-white/5 rounded-xl p-4 border border-white/10">
              <div className="flex items-start justify-between">
                <div className="flex-1 min-w-0">
                  <p className="text-white font-bold flex items-center gap-2">
                    <span className="hidden sm:inline">{index + 1}. </span>
                    <span className="truncate">{ex.name}</span>
                  </p>
                  
                  <div className="sm:hidden mt-3 space-y-2">
                    {isCompleted && (
                      <>
                        <div className="flex items-center gap-2">
                          <span className="text-accent-green">
                            <i className="fas fa-check-circle text-lg"></i>
                          </span>
                          <span className="text-white text-sm font-medium">
                            {execution?.weight} kg
                          </span>
                        </div>
                        
                        {execution?.variationName && (
                          <div className="flex items-start gap-2 ml-6">
                            <span className="text-text-secondary text-xs">Variação:</span>
                            <span className="text-white text-xs">{execution.variationName}</span>
                          </div>
                        )}
                        
                        {execution?.observations && (
                          <div className="flex items-start gap-2 ml-6">
                            <span className="text-text-secondary text-xs">Obs:</span>
                            <span className="text-white text-xs italic">{execution.observations}</span>
                          </div>
                        )}
                      </>
                    )}
                    
                    {isSkipped && (
                      <>
                        <div className="flex items-center gap-2">
                          <span className="text-yellow-500">
                            <i className="fas fa-exclamation-triangle text-lg"></i>
                          </span>
                          <span className="text-yellow-400 text-sm font-medium">
                            Não realizado
                          </span>
                        </div>
                        
                        <div className="flex items-start gap-2 ml-6">
                          <span className="text-text-secondary text-xs">Motivo:</span>
                          <span className="text-yellow-300 text-xs">{ex.skipReason}</span>
                        </div>
                      </>
                    )}
                  </div>
                  
                  <div className="hidden sm:block">
                    {isCompleted && execution && (
                      <div className="mt-2 space-y-1">
                        <p className="text-accent-green text-sm">✅ Peso: {execution.weight} kg</p>
                        {execution.variationName && (
                          <p className="text-text-secondary text-xs">Variação: {execution.variationName}</p>
                        )}
                        {execution.observations && (
                          <p className="text-text-secondary text-xs italic">Obs: {execution.observations}</p>
                        )}
                      </div>
                    )}
                    {isSkipped && (
                      <div className="mt-2">
                        <p className="text-yellow-500 text-sm">⏭️ Pulado: {ex.skipReason}</p>
                      </div>
                    )}
                  </div>
                </div>
                
                <div className="hidden sm:flex sm:items-center">
                  {isCompleted && (
                    <span className="px-2 py-1 bg-green-500/20 text-green-400 rounded-full text-xs font-medium">
                      Concluído
                    </span>
                  )}
                  {isSkipped && (
                    <span className="px-2 py-1 bg-yellow-500/20 text-yellow-400 rounded-full text-xs font-medium">
                      Pulado
                    </span>
                  )}
                </div>
              </div>
            </div>
          );
        })}
      </div>
    );
  };

  const renderNatacaoDetails = () => {
    const details = workout.details || {};
    
    if (!details.distance || !details.poolLength) {
      return (
        <div className="bg-blue-500/10 rounded-xl p-6 text-center">
          <p className="text-blue-300">Detalhes da natação não disponíveis</p>
        </div>
      );
    }
    
    return (
      <div className="space-y-4">
        <div className="bg-blue-500/10 rounded-xl p-4 border border-blue-500/20">
          <h4 className="text-blue-300 font-bold mb-3">🏊‍♂️ DETALHES DA NATAÇÃO</h4>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <p className="text-text-secondary text-xs">Distância</p>
              <p className="text-white font-bold text-xl">{details.distance}m</p>
            </div>
            <div>
              <p className="text-text-secondary text-xs">Piscina</p>
              <p className="text-white font-bold text-xl">{details.poolLength}m</p>
            </div>
          </div>
          <div className="mt-3">
            <p className="text-text-secondary text-xs">Piscinas</p>
            <p className="text-white font-bold">{Math.round(details.distance / details.poolLength)}</p>
          </div>
        </div>
      </div>
    );
  };

  const renderPilatesDetails = () => {
    const details = workout.details || {};
    const equipmentList = details.equipment || [];
    
    return (
      <div className="space-y-4">
        <div className="bg-green-500/10 rounded-xl p-4 border border-green-500/20">
          <h4 className="text-green-300 font-bold mb-3">🧘‍♀️ DETALHES DO PILATES</h4>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <p className="text-text-secondary text-xs">Foco</p>
              <p className="text-white font-bold capitalize">{details.focusArea || 'Core'}</p>
            </div>
            <div>
              <p className="text-text-secondary text-xs">Dificuldade</p>
              <p className="text-white font-bold">{details.difficulty || 3}/5</p>
            </div>
          </div>
          
          {equipmentList.length > 0 && (
            <div className="mt-4 pt-4 border-t border-green-500/20">
              <p className="text-green-300 text-sm mb-3">🛠️ Equipamentos utilizados:</p>
              <div className="flex flex-wrap gap-2">
                {equipmentList.map((eq: string) => (
                  <span key={eq} className="px-3 py-1 bg-green-500/20 text-green-300 rounded-full text-xs">
                    {eq === 'reformer' ? 'Reformer' :
                     eq === 'cadillac' ? 'Cadillac' :
                     eq === 'chair' ? 'Chair (Cadeira)' :
                     eq === 'barrel' ? 'Barrel' : eq}
                  </span>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    );
  };

const renderEsteiraDetails = () => {
  const details = workout.details || {};
  
  if (!details.distance) {
    return (
      <div className="bg-orange-500/10 rounded-xl p-6 text-center">
        <p className="text-orange-300">Detalhes da esteira não disponíveis</p>
      </div>
    );
  }
  
  const distanceKm = (details.distance / 1000).toFixed(2);
  const pace = workout.duration > 0 
    ? ((workout.duration / 60) / (details.distance / 1000)).toFixed(2)
    : '0.00';
  const avgSpeed = details.avgSpeed?.toFixed(1) || 
    ((details.distance / 1000) / (workout.duration / 3600)).toFixed(1);
  
  return (
    <div className="space-y-4">
      <div className="bg-orange-500/10 rounded-xl p-4 border border-orange-500/20">
        <h4 className="text-orange-300 font-bold mb-3">🚶‍♂️ DETALHES DA ESTEIRA</h4>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <p className="text-text-secondary text-xs">Distância</p>
            <p className="text-white font-bold text-xl">{distanceKm} km</p>
          </div>
          <div>
            <p className="text-text-secondary text-xs">Velocidade Média</p>
            <p className="text-white font-bold text-xl">{avgSpeed} km/h</p>
          </div>
          <div>
            <p className="text-text-secondary text-xs">Pace</p>
            <p className="text-white font-bold text-xl">{pace} min/km</p>
          </div>
          <div>
            <p className="text-text-secondary text-xs">Duração</p>
            <p className="text-white font-bold text-xl">
              {Math.floor(workout.duration / 60)}:{String(workout.duration % 60).padStart(2, '0')} min
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

  const renderSpinningDetails = () => {
    const details = workout.details || {};
    
    if (!details.distance) {
      return (
        <div className="bg-cyan-500/10 rounded-xl p-6 text-center">
          <p className="text-cyan-300">Detalhes do spinning não disponíveis</p>
        </div>
      );
    }
    
    const distanceKm = (details.distance / 1000).toFixed(2);
    const speed = workout.duration > 0 
      ? ((details.distance / 1000) / (workout.duration / 3600)).toFixed(1)
      : '0.0';
    
    return (
      <div className="space-y-4">
        <div className="bg-cyan-500/10 rounded-xl p-4 border border-cyan-500/20">
          <h4 className="text-cyan-300 font-bold mb-3">🚴‍♂️ DETALHES DO SPINNING</h4>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <p className="text-text-secondary text-xs">Distância</p>
              <p className="text-white font-bold text-xl">{distanceKm} km</p>
            </div>
            <div>
              <p className="text-text-secondary text-xs">Velocidade</p>
              <p className="text-white font-bold text-xl">{speed} km/h</p>
            </div>
          </div>
          {details.rpm && (
            <div className="mt-3">
              <p className="text-text-secondary text-xs">RPM</p>
              <p className="text-white font-bold">{details.rpm}</p>
            </div>
          )}
          {details.resistance && (
            <div className="mt-3">
              <p className="text-text-secondary text-xs">Resistência</p>
              <p className="text-white font-bold">{details.resistance}/10</p>
            </div>
          )}
        </div>
      </div>
    );
  };

  return (
    <div className="fixed inset-0 bg-black/90 backdrop-blur-sm flex items-center justify-center z-[60] p-4">
      <div className="bg-gradient-to-br from-secondary-dark to-black rounded-2xl p-4 sm:p-6 md:p-8 
        max-w-4xl w-full max-h-[90vh] overflow-y-auto border border-white/10">
        
        <div className="flex items-center justify-between mb-4 sm:mb-6 sticky top-0 bg-gradient-to-br from-secondary-dark to-black py-2 z-10">
          <h2 className="text-lg sm:text-xl md:text-2xl font-bold text-white flex items-center gap-2 sm:gap-3">
            <i className="fas fa-file-alt text-accent-red"></i>
            <span className="truncate">Relatório Completo</span>
          </h2>
          <button
            onClick={onClose}
            className="w-8 h-8 sm:w-10 sm:h-10 rounded-xl bg-white/5 text-white 
              hover:bg-white/10 transition-all flex items-center justify-center flex-shrink-0"
          >
            <i className="fas fa-times"></i>
          </button>
        </div>

        <div className="bg-white/5 rounded-xl p-4 sm:p-6 mb-4 sm:mb-6">
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4">
            <div className="col-span-2 sm:col-span-1">
              <p className="text-text-secondary text-xs mb-1">Tipo</p>
              <p className="text-white font-bold text-sm sm:text-base capitalize truncate">
                {getWorkoutTypeName(workout.type)}
                {getWorkoutSubType(workout)}
              </p>
            </div>
            <div>
              <p className="text-text-secondary text-xs mb-1">Data</p>
              <p className="text-white font-bold text-sm sm:text-base">
                {new Date(workout.date).toLocaleDateString('pt-BR')}
              </p>
            </div>
            <div>
              <p className="text-text-secondary text-xs mb-1">Duração</p>
              <p className="text-white font-bold text-sm sm:text-base">
                {formatDuration(workout.duration)}
              </p>
            </div>
            <div className="col-span-2 sm:col-span-1">
              <p className="text-text-secondary text-xs mb-1">Calorias</p>
              <p className="text-accent-green font-bold text-sm sm:text-base">{workout.calories} kcal</p>
            </div>
          </div>
        </div>

        {workout.type === 'academia' && renderAcademiaDetails()}
        {workout.type === 'natacao' && renderNatacaoDetails()}
        {workout.type === 'pilates' && renderPilatesDetails()}
        {workout.type === 'esteira' && renderEsteiraDetails()}
        {workout.type === 'spinning' && renderSpinningDetails()}

        <div className="mt-4 sm:mt-6 pt-4 border-t border-white/10">
          <h4 className="text-white font-bold mb-3">📈 RESUMO</h4>
          <div className="bg-gradient-to-br from-accent-red/10 to-accent-purple/10 rounded-xl p-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-text-secondary text-xs">FC Média</p>
                <p className="text-white font-bold">{workout.heart_rate} bpm</p>
              </div>
              <div>
                <p className="text-text-secondary text-xs">Intensidade</p>
                <p className="text-white font-bold">
                  {workout.heart_rate < 100 ? 'Leve' : 
                   workout.heart_rate < 130 ? 'Moderada' : 
                   workout.heart_rate < 160 ? 'Alta' : 'Máxima'}
                </p>
              </div>
            </div>
            {workout.notes && (
              <div className="mt-3">
                <p className="text-text-secondary text-xs mb-1">Observações</p>
                <p className="text-white text-sm italic">"{workout.notes}"</p>
              </div>
            )}
          </div>
        </div>

      </div>
    </div>
  );
};

export default WorkoutFullReportModal;