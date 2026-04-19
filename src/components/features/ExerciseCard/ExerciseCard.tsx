// src/components/features/ExerciseCard/ExerciseCard.tsx
import React, { useState, useCallback, useRef, useEffect } from 'react';
import { Exercise } from '../../../types/workout.types';
import ExerciseSkipModal from './ExerciseSkipModal';

interface ExerciseCardProps {
  exercise: Exercise;
  number: number;
  isCompleted: boolean;
  isCurrent: boolean;
  isLocked: boolean;
  onToggleComplete: () => void;
  onSkipExercise?: (reason: string) => void;
  workoutType: 'A' | 'B' | '1' | '2' | '3';
  workoutStarted: boolean;
  hasWeightData?: boolean;
  weightData?: {
    weight: number;
    variation?: string;
    observations?: string;
  };
  lastWeight?: number;
  cardioData?: {
    distance: number;
    duration: number;
  };
}

const ExerciseCard: React.FC<ExerciseCardProps> = ({
  exercise,
  number,
  isCompleted: propIsCompleted,
  isCurrent,
  isLocked,
  onToggleComplete,
  onSkipExercise,
  workoutType,
  workoutStarted,
  hasWeightData = false,
  weightData,
  lastWeight,
  cardioData
}) => {
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [showSkipModal, setShowSkipModal] = useState(false);
  const [localIsCompleted, setLocalIsCompleted] = useState(propIsCompleted);
  const [localSkipReason, setLocalSkipReason] = useState(exercise.skipReason);
  const [isProcessing, setIsProcessing] = useState(false);
  
  const hasBeenCompletedRef = useRef(propIsCompleted);
  const isProcessingRef = useRef(false);
  const clickTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  const hasMultipleImages = exercise.images && exercise.images.length > 1;

  useEffect(() => {
    setLocalIsCompleted(propIsCompleted);
    setLocalSkipReason(exercise.skipReason);
    hasBeenCompletedRef.current = propIsCompleted;
  }, [propIsCompleted, exercise.skipReason]);

  useEffect(() => {
    return () => {
      if (clickTimeoutRef.current) {
        clearTimeout(clickTimeoutRef.current);
      }
    };
  }, []);

  const handleNextImage = () => {
    if (!hasMultipleImages) return;
    setCurrentImageIndex((prev) => 
      prev === exercise.images!.length - 1 ? 0 : prev + 1
    );
  };

  const handlePrevImage = () => {
    if (!hasMultipleImages) return;
    setCurrentImageIndex((prev) => 
      prev === 0 ? exercise.images!.length - 1 : prev - 1
    );
  };

  const handleCompleteClick = useCallback(() => {
    if (localIsCompleted || hasBeenCompletedRef.current) {
      return;
    }
    
    if (isProcessingRef.current || isProcessing) {
      return;
    }
    
    if (!workoutStarted) {
      return;
    }
    
    if (isLocked) {
      return;
    }
    
    isProcessingRef.current = true;
    setIsProcessing(true);
    
    onToggleComplete();
    
    clickTimeoutRef.current = setTimeout(() => {
      isProcessingRef.current = false;
      setIsProcessing(false);
    }, 1000);
    
  }, [localIsCompleted, workoutStarted, isProcessing, isLocked, onToggleComplete]);

  const handleSkipClick = useCallback(() => {
    if (localIsCompleted || hasBeenCompletedRef.current) {
      return;
    }
    
    if (isProcessingRef.current || isProcessing) {
      return;
    }
    
    if (!workoutStarted) {
      return;
    }
    
    setShowSkipModal(true);
    
  }, [localIsCompleted, workoutStarted, isProcessing]);

  const handleSkipExercise = (reason: string) => {
    isProcessingRef.current = true;
    setIsProcessing(true);
    
    setLocalIsCompleted(true);
    setLocalSkipReason(reason);
    hasBeenCompletedRef.current = true;
    
    clickTimeoutRef.current = setTimeout(() => {
      isProcessingRef.current = false;
      setIsProcessing(false);
    }, 1000);
    
    if (onSkipExercise) {
      onSkipExercise(reason);
    }
  };

  const accentColors = {
    'A': { primary: '#ff4757', gradient: 'linear-gradient(135deg, #ff4757, #ff6b81)' },
    'B': { primary: '#2e86de', gradient: 'linear-gradient(135deg, #2e86de, #54a0ff)' },
    '1': { primary: '#10ac84', gradient: 'linear-gradient(135deg, #10ac84, #1dd1a1)' },  
    '2': { primary: '#54a0ff', gradient: 'linear-gradient(135deg, #54a0ff, #5f27cd)' },  
    '3': { primary: '#9c88ff', gradient: 'linear-gradient(135deg, #9c88ff, #8e44ad)' }  
  };

  const colors = accentColors[workoutType];
  const shouldBeDisabled = localIsCompleted || isProcessing || !workoutStarted;
  const isSkipped = localSkipReason !== undefined;

  return (
    <div className={`
      bg-gradient-to-br from-secondary-dark/30 to-black/50 
      rounded-lg sm:rounded-xl md:rounded-2xl
      p-3 sm:p-4 md:p-6
      mb-3 sm:mb-4 md:mb-6
      border transition-all duration-300 relative overflow-hidden
      ${localIsCompleted 
        ? isSkipped
          ? 'border-orange-500/30 bg-gradient-to-br from-orange-500/5 to-black/50'
          : 'border-accent-green/30 bg-gradient-to-br from-accent-green/5 to-black/50'
        : isCurrent && !isLocked
        ? 'border-yellow-500/50 bg-gradient-to-br from-yellow-500/5 to-black/50'
        : isLocked
        ? 'border-gray-700/50 bg-gradient-to-br from-gray-800/30 to-black/50 opacity-70'
        : 'border-white/10'
      }
    `}>
      
      <div className="absolute top-2 right-2 sm:top-3 sm:right-3 md:top-4 md:right-4 z-10">
        <div 
          className="w-8 h-8 sm:w-10 sm:h-10 md:w-12 md:h-12
            rounded-md sm:rounded-lg md:rounded-xl 
            flex items-center justify-center text-white font-black
            text-sm sm:text-base md:text-lg"
          style={{ 
            background: colors.gradient,
            boxShadow: '0 2px 10px rgba(0,0,0,0.3)' 
          }}
        >
          {number}
        </div>
      </div>

      <div className="flex flex-col lg:flex-row gap-4 sm:gap-6 md:gap-8 pt-8 sm:pt-10 md:pt-0">
        
        <div className="flex-1 min-w-0">
          <div className="flex flex-col sm:flex-row sm:items-center gap-2 mb-2">
            <h3 className="text-base sm:text-lg md:text-xl font-bold text-white 
              font-montserrat pr-12 break-words">
              {exercise.name}
            </h3>
            
            <div className="hidden sm:flex items-center gap-2">
              {localIsCompleted && !isSkipped && (
                <span className="px-2 py-1 bg-green-500/20 text-green-300 rounded-full text-xs font-bold">
                  CONCLUÍDO
                </span>
              )}
              
              {localIsCompleted && isSkipped && (
                <span className="px-2 py-1 bg-orange-500/20 text-orange-300 rounded-full text-xs font-bold">
                  NÃO REALIZADO
                </span>
              )}
              
              {isLocked && (
                <span className="px-2 py-1 bg-gray-500/20 text-gray-400 rounded-full text-xs font-bold">
                  BLOQUEADO
                </span>
              )}
              
              {!workoutStarted && !localIsCompleted && !isLocked && (
                <span className="px-2 py-1 bg-gray-600/20 text-gray-300 rounded-full text-xs font-bold">
                  AGUARDANDO
                </span>
              )}
              
              {isProcessing && (
                <span className="px-2 py-1 bg-blue-500/20 text-blue-300 rounded-full text-xs font-bold">
                  PROCESSANDO...
                </span>
              )}
            </div>
          </div>

          <div className="mb-3 sm:mb-4 md:mb-6">
            <div className="flex flex-wrap items-center gap-2 sm:gap-3 mb-2">
              <span 
                className="inline-block px-3 py-1.5 sm:px-4 sm:py-2 md:px-5 md:py-2.5
                  rounded-full text-xs sm:text-sm md:text-base font-bold whitespace-nowrap"
                style={{ 
                  background: colors.gradient,
                  color: 'white'
                }}
              >
                {exercise.sets} séries
              </span>
              
              {/* Mostrar último peso se disponível e exercício não concluído */}
              {lastWeight && lastWeight > 0 && !localIsCompleted && !isLocked && (
                <span className="inline-flex items-center gap-1 px-3 py-1.5 sm:px-4 sm:py-2
                  bg-blue-500/20 text-blue-300 rounded-full text-xs sm:text-sm font-medium border border-blue-500/30">
                  <i className="fas fa-history text-xs"></i>
                  Último: {lastWeight} kg
                </span>
              )}
            </div>
            
            {exercise.description && (
              <p className="text-text-secondary 
                text-sm sm:text-base md:text-lg 
                leading-relaxed break-words">
                {exercise.description}
              </p>
            )}

            {/* Dados Registrados - Para exercícios com peso */}
            {hasWeightData && weightData && !exercise.isCardio && (
              <div className="mt-3 p-3 bg-blue-500/10 border border-blue-500/20 rounded-lg">
                <div className="flex items-center gap-2 mb-2">
                  <i className="fas fa-weight-hanging text-blue-400"></i>
                  <span className="text-blue-300 font-bold text-sm">Dados Registrados:</span>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div className="flex items-center gap-2">
                    <div className="w-8 h-8 rounded-md bg-blue-500/20 flex items-center justify-center">
                      <i className="fas fa-dumbbell text-blue-300 text-xs"></i>
                    </div>
                    <div>
                      <div className="text-text-secondary text-xs">Peso</div>
                      <div className="text-white font-bold">{weightData.weight} kg</div>
                    </div>
                  </div>
                  
                  {weightData.variation && (
                    <div className="flex items-center gap-2">
                      <div className="w-8 h-8 rounded-md bg-purple-500/20 flex items-center justify-center">
                        <i className="fas fa-exchange-alt text-purple-300 text-xs"></i>
                      </div>
                      <div>
                        <div className="text-text-secondary text-xs">Variação</div>
                        <div className="text-white font-bold">{weightData.variation}</div>
                      </div>
                    </div>
                  )}
                  
                  {weightData.observations && (
                    <div className="sm:col-span-2">
                      <div className="flex items-start gap-2">
                        <div className="w-8 h-8 rounded-md bg-green-500/20 flex items-center justify-center mt-1">
                          <i className="fas fa-sticky-note text-green-300 text-xs"></i>
                        </div>
                        <div className="flex-1">
                          <div className="text-text-secondary text-xs mb-1">Observações</div>
                          <div className="text-white text-sm bg-white/5 rounded p-2">
                            {weightData.observations}
                          </div>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* Dados Registrados - Para exercícios de cardio (caminhada) - SOMENTE DISTÂNCIA E DURAÇÃO */}
            {cardioData && (
              <div className="mt-3 p-3 bg-green-500/10 border border-green-500/20 rounded-lg">
                <div className="flex items-center gap-2 mb-2">
                  <i className="fas fa-person-walking text-green-400"></i>
                  <span className="text-green-300 font-bold text-sm">Dados da Caminhada:</span>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div className="flex items-center gap-2">
                    <div className="w-8 h-8 rounded-md bg-green-500/20 flex items-center justify-center">
                      <i className="fas fa-route text-green-300 text-xs"></i>
                    </div>
                    <div>
                      <div className="text-text-secondary text-xs">Distância</div>
                      <div className="text-white font-bold">{cardioData.distance}m</div>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-8 h-8 rounded-md bg-green-500/20 flex items-center justify-center">
                      <i className="fas fa-clock text-green-300 text-xs"></i>
                    </div>
                    <div>
                      <div className="text-text-secondary text-xs">Duração</div>
                      <div className="text-white font-bold">{cardioData.duration}min</div>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {localSkipReason && (
              <div className="mt-3 p-3 bg-orange-500/10 border border-orange-500/20 rounded-lg">
                <div className="flex items-center gap-2 mb-1">
                  <i className="fas fa-info-circle text-orange-400"></i>
                  <span className="text-orange-300 font-bold text-sm">Motivo:</span>
                </div>
                <p className="text-orange-200 text-sm break-words">{localSkipReason}</p>
              </div>
            )}
          </div>
        </div>

        {exercise.images && exercise.images.length > 0 && (
          <div className="w-full lg:w-2/5 xl:w-1/3 mt-4 lg:mt-0">
            <div className="bg-gradient-to-br from-secondary-dark/50 to-black/50 rounded-lg sm:rounded-xl 
              shadow h-40 sm:h-48 md:h-56 lg:h-64 relative overflow-hidden">
              
              <div className="h-full w-full flex items-center justify-center">
                <img
                  src={exercise.images[currentImageIndex]}
                  alt={`${exercise.name}`}
                  className="max-h-full max-w-full object-contain"
                  loading="lazy"
                />
              </div>

              {hasMultipleImages && (
                <>
                  <button
                    onClick={handlePrevImage}
                    className="absolute left-2 top-1/2 transform -translate-y-1/2 
                      w-8 h-8 bg-black/70 text-white rounded-full flex items-center justify-center
                      hover:bg-black/90 transition-colors z-20 border border-white/20"
                    aria-label="Imagem anterior"
                  >
                    <i className="fas fa-chevron-left text-sm"></i>
                  </button>

                  <button
                    onClick={handleNextImage}
                    className="absolute right-2 top-1/2 transform -translate-y-1/2 
                      w-8 h-8 bg-black/70 text-white rounded-full flex items-center justify-center
                      hover:bg-black/90 transition-colors z-20 border border-white/20"
                    aria-label="Próxima imagem"
                  >
                    <i className="fas fa-chevron-right text-sm"></i>
                  </button>
                </>
              )}
            </div>
          </div>
        )}
      </div>

      <div className="mt-4 sm:mt-6 pt-3 sm:pt-4 border-t border-white/10">
        {isCurrent && !localIsCompleted && !isLocked && (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <button
              onClick={handleCompleteClick}
              disabled={shouldBeDisabled}
              className={`
                w-full py-3 rounded-lg font-bold transition-all duration-200
                flex items-center justify-center gap-2
                ${shouldBeDisabled 
                  ? 'bg-gray-600 cursor-not-allowed text-gray-400 opacity-70' 
                  : 'bg-gradient-to-r from-green-600 to-emerald-600 text-white hover:opacity-90 active:scale-95'
                }
              `}
            >
              <i className="fas fa-check-circle"></i>
              <span className="truncate">
                {isProcessing ? 'Abrindo modal...' : 'Concluir'}
              </span>
            </button>
            
            <button
              onClick={handleSkipClick}
              disabled={shouldBeDisabled}
              className={`
                w-full py-3 rounded-lg font-bold transition-all duration-200
                flex items-center justify-center gap-2
                ${shouldBeDisabled 
                  ? 'bg-gray-600 cursor-not-allowed text-gray-400 opacity-70' 
                  : 'bg-gradient-to-r from-orange-600 to-red-600 text-white hover:opacity-90 active:scale-95'
                }
              `}
            >
              <i className="fas fa-forward"></i>
              <span className="hidden sm:inline truncate">
                {isProcessing ? 'Processando...' : 'Não posso fazer este exercício'}
              </span>
              <span className="sm:hidden truncate">
                {isProcessing ? 'Processando...' : 'Impossibilitado'}
              </span>
            </button>
          </div>
        )}

        {isLocked && (
          <div className="text-center p-3 sm:p-4 bg-red-500/10 border border-red-500/20 rounded-lg">
            <p className="text-red-400 text-sm sm:text-base">
              <i className="fas fa-lock mr-2"></i>
              Este exercício pertence a um grupo futuro. Complete os grupos anteriores primeiro.
            </p>
          </div>
        )}

        {localIsCompleted && !isLocked && (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {!isSkipped ? (
              <button
                disabled
                className="w-full py-3 rounded-lg font-bold flex items-center justify-center gap-2
                  bg-green-500/20 text-green-300 cursor-not-allowed border border-green-500/30 opacity-80"
              >
                <i className="fas fa-check-circle"></i>
                <span className="truncate">Concluído</span>
              </button>
            ) : (
              <button
                disabled
                className="w-full py-3 rounded-lg font-bold flex items-center justify-center gap-2
                  bg-orange-500/20 text-orange-300 cursor-not-allowed border border-orange-500/30 opacity-80"
              >
                <i className="fas fa-times-circle"></i>
                <span className="truncate">Não Realizado</span>
              </button>
            )}
            
            <button
              disabled
              className="w-full py-3 rounded-lg font-bold flex items-center justify-center gap-2
                bg-gray-600/30 text-gray-400 cursor-not-allowed border border-gray-500/30 opacity-80"
            >
              <i className="fas fa-forward"></i>
              <span className="truncate">
                {isSkipped ? 'Não realizado' : 'Já processado'}
              </span>
            </button>
          </div>
        )}

        {!isCurrent && !isLocked && !localIsCompleted && (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
            <button
              onClick={handleCompleteClick}
              disabled={shouldBeDisabled}
              className={`
                py-2 rounded-lg font-bold transition-all duration-200 text-sm
                flex items-center justify-center gap-1
                ${shouldBeDisabled 
                  ? 'bg-gray-600 cursor-not-allowed text-gray-400 opacity-70' 
                  : 'bg-green-600 hover:bg-green-700 text-white active:scale-95'
                }
              `}
            >
              <i className="fas fa-check-circle text-xs"></i>
              <span className="truncate">
                {isProcessing ? 'Abrindo...' : 'Concluir'}
              </span>
            </button>
            
            <button
              onClick={handleSkipClick}
              disabled={shouldBeDisabled}
              className={`
                py-2 rounded-lg font-bold transition-all duration-200 text-sm
                flex items-center justify-center gap-1
                ${shouldBeDisabled 
                  ? 'bg-gray-600 cursor-not-allowed text-gray-400 opacity-70' 
                  : 'bg-orange-600 hover:bg-orange-700 text-white active:scale-95'
                }
              `}
            >
              <i className="fas fa-forward text-xs"></i>
              <span className="hidden sm:inline truncate">
                {isProcessing ? 'Processando...' : 'Não posso fazer'}
              </span>
              <span className="sm:hidden truncate">
                {isProcessing ? 'Processando...' : 'Impossibilitado'}
              </span>
            </button>
          </div>
        )}

        {!workoutStarted && !localIsCompleted && !isLocked && (
          <div className="text-center p-3 bg-gray-800/30 rounded-lg mt-2">
            <p className="text-gray-400 text-sm">
              <i className="fas fa-info-circle mr-1"></i>
              Clique em "Iniciar Treino" no timer para começar
            </p>
          </div>
        )}

        <ExerciseSkipModal
          isVisible={showSkipModal}
          onClose={() => setShowSkipModal(false)}
          onConfirm={handleSkipExercise}
          exerciseName={exercise.name}
        />
      </div>
    </div>
  );
};

export default ExerciseCard;