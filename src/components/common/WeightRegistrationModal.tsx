import React, { useState, useEffect } from 'react';
import { Exercise } from '../../types/workout.types';

interface WeightRegistrationModalProps {
  isVisible: boolean;
  exercise: Exercise | null;
  lastWeight?: number;
  lastVariation?: string;
  lastObservation?: string;
  weightsByVariation?: Record<string, { weight: number; observations?: string }>;
  onSave: (data: {
    weight: number;
    variationId?: number;
    observations?: string;
  }) => void;
  onCancel: () => void;
}

interface ExerciseVariation {
  id: number;
  name: string;
  description?: string;
}

const WeightRegistrationModal: React.FC<WeightRegistrationModalProps> = ({
  isVisible,
  exercise,
  lastWeight,
  lastVariation,
  lastObservation,
  weightsByVariation,
  onSave,
  onCancel
}) => {
  const [weight, setWeight] = useState('');
  const [selectedVariation, setSelectedVariation] = useState<number | undefined>();
  const [selectedVariationName, setSelectedVariationName] = useState<string | undefined>();
  const [observations, setObservations] = useState('');
  
  const quickWeights = [2, 5, 7, 10];
  const hasVariations = exercise?.hasVariations && exercise?.variations && exercise.variations.length > 0;

  useEffect(() => {
    if (selectedVariationName && weightsByVariation && weightsByVariation[selectedVariationName]) {
      const variationData = weightsByVariation[selectedVariationName];
      if (variationData.weight > 0) {
        setWeight(variationData.weight.toString());
      } else {
        setWeight('');
      }
      if (variationData.observations) {
        setObservations(variationData.observations);
      } else {
        setObservations('');
      }
    }
  }, [selectedVariationName, weightsByVariation]);

  useEffect(() => {
    if (exercise && isVisible) {
      if (lastVariation && weightsByVariation && weightsByVariation[lastVariation]) {
        const variationData = weightsByVariation[lastVariation];
        if (variationData.weight > 0) {
          setWeight(variationData.weight.toString());
        } else if (lastWeight && lastWeight > 0) {
          setWeight(lastWeight.toString());
        } else {
          setWeight('');
        }
        if (variationData.observations) {
          setObservations(variationData.observations);
        } else if (lastObservation) {
          setObservations(lastObservation);
        } else {
          setObservations('');
        }
      } else {
        if (lastWeight && lastWeight > 0) {
          setWeight(lastWeight.toString());
        } else {
          setWeight('');
        }
        if (lastObservation) {
          setObservations(lastObservation);
        } else {
          setObservations('');
        }
      }
      
      if (lastVariation && exercise.variations) {
        const foundVariation = exercise.variations.find(v => v.name === lastVariation);
        if (foundVariation) {
          setSelectedVariation(foundVariation.id);
          setSelectedVariationName(foundVariation.name);
        } else {
          setSelectedVariation(undefined);
          setSelectedVariationName(undefined);
        }
      } else {
        setSelectedVariation(undefined);
        setSelectedVariationName(undefined);
      }
    }
  }, [exercise, isVisible, lastWeight, lastVariation, lastObservation, weightsByVariation]);

  const addQuickWeight = (quickWeight: number) => {
    const currentWeight = parseFloat(weight) || 0;
    const newWeight = currentWeight + quickWeight;
    setWeight(newWeight.toFixed(1));
  };

  const removeQuickWeight = (quickWeight: number) => {
    const currentWeight = parseFloat(weight) || 0;
    const newWeight = Math.max(0, currentWeight - quickWeight);
    setWeight(newWeight.toFixed(1));
  };

  const clearWeight = () => {
    setWeight('');
  };

  const handleCloseModal = () => {
    setWeight('');
    setSelectedVariation(undefined);
    setSelectedVariationName(undefined);
    setObservations('');
    onCancel();
  };

  const handleVariationSelect = (variationId: number, variationName: string) => {
    setSelectedVariation(variationId);
    setSelectedVariationName(variationName);
  };

  const handleSave = () => {
    const weightNum = parseFloat(weight);
    if (isNaN(weightNum) || weightNum < 0) {
      return;
    }

    if (hasVariations && !selectedVariation) {
      return;
    }

    onSave({
      weight: weightNum,
      variationId: selectedVariation,
      observations: observations.trim() || undefined
    });
  };

  const isValid = weight.trim() !== '' && parseFloat(weight) >= 0 && (!hasVariations || selectedVariation);

  if (!isVisible || !exercise) return null;

  return (
    <div className="fixed inset-0 bg-black/70 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      {/* ✅ Adicionado max-h-[90vh] e flex flex-col para controle de altura */}
      <div className="bg-gradient-to-br from-secondary-dark to-black rounded-2xl 
        p-6 max-w-md w-full border border-white/10 relative max-h-[90vh] flex flex-col">
        
        <button
          onClick={handleCloseModal}
          className="absolute top-4 right-4 w-8 h-8 rounded-full bg-white/10 
            hover:bg-white/20 transition-colors flex items-center justify-center
            text-white hover:text-gray-300 z-10"
          title="Voltar (exercício ficará pendente)"
          type="button"
        >
          <i className="fas fa-times text-sm"></i>
        </button>
        
        {/* ✅ Header - NÃO scrolla */}
        <div className="flex-shrink-0">
          <div className="text-center mb-4 sm:mb-6 pt-2">
            <div className="w-12 h-12 sm:w-16 sm:h-16 mx-auto mb-3 sm:mb-4 rounded-full bg-gradient-to-br 
              from-orange-500 to-red-500 flex items-center justify-center">
              <i className="fas fa-dumbbell text-xl sm:text-2xl text-white"></i>
            </div>
            
            <h3 className="text-lg sm:text-xl font-bold text-white mb-1 sm:mb-2">
              {exercise.name}
            </h3>
            <p className="text-text-secondary text-xs sm:text-sm mb-1">
              {exercise.sets} × {exercise.reps}
            </p>
            
            {(lastWeight || lastVariation || lastObservation) && (
              <div className="mt-2 inline-flex flex-col items-center gap-1 px-3 py-1 bg-blue-500/20 
                rounded-lg border border-blue-500/30">
                <span className="text-xs text-blue-300 font-medium">Último registro:</span>
                <div className="flex flex-wrap items-center justify-center gap-2 text-xs">
                  {lastWeight && lastWeight > 0 && (
                    <span className="text-blue-300">🏋️ {lastWeight} kg</span>
                  )}
                  {lastVariation && (
                    <span className="text-purple-300">🔄 {lastVariation}</span>
                  )}
                  {lastObservation && (
                    <span className="text-green-300">📝 {lastObservation.length > 30 ? lastObservation.substring(0, 30) + '...' : lastObservation}</span>
                  )}
                </div>
              </div>
            )}
          </div>
        </div>

        {/* ✅ Conteúdo - COM SCROLL! */}
        <div className="flex-1 overflow-y-auto px-1 space-y-4" style={{ maxHeight: 'calc(90vh - 280px)' }}>
          <div className="mb-4">
            <div className="flex items-center justify-between mb-2">
              <label className="block text-text-secondary text-xs sm:text-sm">
                Peso (kg) <span className="text-red-400">*</span>
              </label>
              <button
                onClick={clearWeight}
                className="text-xs text-gray-400 hover:text-white transition-colors px-2 py-1"
                type="button"
              >
                <i className="fas fa-times mr-1"></i>
                Limpar
              </button>
            </div>
            
            <div className="relative">
              <input
                type="number"
                value={weight}
                onChange={(e) => setWeight(e.target.value)}
                placeholder="0.0"
                className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 sm:py-4 
                  text-white placeholder-gray-400 focus:outline-none focus:ring-2 
                  focus:ring-blue-500 text-center text-xl sm:text-2xl font-bold
                  [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none 
                  [&::-webkit-inner-spin-button]:appearance-none"
                step="0.5"
                min="0"
                max="500"
                inputMode="decimal"
              />
              <div className="absolute right-3 sm:right-4 top-1/2 transform -translate-y-1/2 
                text-gray-400 font-semibold pointer-events-none text-sm sm:text-base">
                kg
              </div>
            </div>
            
            <div className="mt-3 sm:mt-4">
              <p className="text-text-secondary text-xs sm:text-sm mb-2">Peso rápido:</p>
              
              <div className="grid grid-cols-4 gap-1.5 sm:gap-2 mb-2 sm:mb-3">
                {quickWeights.map((quickWeight) => (
                  <button
                    key={quickWeight}
                    onClick={() => addQuickWeight(quickWeight)}
                    onMouseDown={(e) => e.preventDefault()}
                    className="bg-gradient-to-br from-blue-600 to-blue-700 
                      text-white rounded-lg py-2 sm:py-2.5 hover:opacity-90 transition-all 
                      active:scale-95 font-medium text-xs sm:text-sm"
                    type="button"
                  >
                    +{quickWeight}
                  </button>
                ))}
              </div>
              
              <div className="grid grid-cols-4 gap-1.5 sm:gap-2 mb-4 sm:mb-6">
                {quickWeights.map((quickWeight) => (
                  <button
                    key={`minus-${quickWeight}`}
                    onClick={() => removeQuickWeight(quickWeight)}
                    onMouseDown={(e) => e.preventDefault()}
                    className="bg-gradient-to-br from-red-600 to-red-700 
                      text-white rounded-lg py-2 sm:py-2.5 hover:opacity-90 transition-all 
                      active:scale-95 font-medium text-xs sm:text-sm"
                    type="button"
                  >
                    -{quickWeight}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {hasVariations && exercise.variations && exercise.variations.length > 0 && (
            <div className="mb-3 sm:mb-4">
              <label className="block text-text-secondary text-xs sm:text-sm mb-2">
                Variação <span className="text-red-400">* (obrigatória)</span>
              </label>
              {/* ✅ Scroll vertical para variações */}
              <div className="space-y-1.5 sm:space-y-2 max-h-48 sm:max-h-52 overflow-y-auto pr-1">
                {exercise.variations.map((variation: ExerciseVariation) => {
                  const variationWeightData = weightsByVariation?.[variation.name];
                  const hasCustomWeight = variationWeightData && variationWeightData.weight > 0;
                  
                  return (
                    <button
                      key={variation.id}
                      onClick={() => handleVariationSelect(variation.id, variation.name)}
                      className={`w-full text-left px-3 sm:px-4 py-2 sm:py-3 rounded-lg transition-all ${
                        selectedVariation === variation.id
                          ? 'bg-gradient-to-r from-blue-600/30 to-blue-700/30 border border-blue-500/50'
                          : 'bg-white/5 border border-white/10 hover:bg-white/10'
                      }`}
                      type="button"
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex-1">
                          <div className="flex items-center gap-2 flex-wrap">
                            <span className="text-white text-sm sm:text-base">{variation.name}</span>
                            {hasCustomWeight && (
                              <span className="text-xs bg-blue-500/30 text-blue-300 px-2 py-0.5 rounded-full">
                                🏋️ {variationWeightData.weight} kg
                              </span>
                            )}
                            {variationWeightData?.observations && (
                              <span className="text-xs bg-green-500/30 text-green-300 px-2 py-0.5 rounded-full">
                                📝 {variationWeightData.observations.length > 20 
                                  ? variationWeightData.observations.substring(0, 20) + '...' 
                                  : variationWeightData.observations}
                              </span>
                            )}
                          </div>
                          {variation.description && (
                            <p className="text-text-secondary text-xs mt-0.5">{variation.description}</p>
                          )}
                        </div>
                        {selectedVariation === variation.id && (
                          <i className="fas fa-check text-blue-400 text-sm sm:text-base ml-2"></i>
                        )}
                      </div>
                    </button>
                  );
                })}
              </div>
              {!selectedVariation && (
                <p className="text-red-400 text-xs mt-2">⚠️ Selecione a variação realizada</p>
              )}
            </div>
          )}

          <div className="mb-4 sm:mb-6">
            <label className="block text-text-secondary text-xs sm:text-sm mb-2">
              Observações (opcional)
            </label>
            <textarea
              value={observations}
              onChange={(e) => setObservations(e.target.value)}
              placeholder="Ex: Fácil, Pode aumentar, etc."
              className="w-full bg-white/5 border border-white/10 rounded-xl px-3 sm:px-4 py-2 sm:py-3 
                text-white placeholder-gray-400 focus:outline-none focus:ring-2 
                focus:ring-blue-500 resize-none h-20 sm:h-24 text-sm sm:text-base"
              maxLength={200}
            />
            <div className="flex justify-between items-center mt-1">
              <div className="text-xs text-text-secondary">
                {observations.length}/200 caracteres
              </div>
              {observations.length > 0 && (
                <button
                  onClick={() => setObservations('')}
                  className="text-xs text-gray-400 hover:text-white transition-colors px-2 py-1"
                  type="button"
                >
                  <i className="fas fa-times mr-1"></i>
                  Limpar
                </button>
              )}
            </div>
          </div>
        </div>

        {/* ✅ Botões - NÃO scrolla, fica fixo no final */}
        <div className="flex-shrink-0 mt-4">
          <button
            onClick={handleSave}
            disabled={!isValid}
            className={`w-full py-3 sm:py-4 font-bold rounded-xl transition-all 
              hover:scale-[1.02] active:scale-[0.98] text-sm sm:text-lg ${
                isValid
                  ? 'bg-gradient-to-r from-green-600 to-emerald-600 text-white hover:opacity-90'
                  : 'bg-gray-700 text-gray-400 cursor-not-allowed'
              }`}
            type="button"
          >
            <i className="fas fa-check mr-2"></i>
            {isValid ? 'Salvar e Continuar' : hasVariations && !selectedVariation ? 'Selecione a variação' : 'Digite um peso válido'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default WeightRegistrationModal;