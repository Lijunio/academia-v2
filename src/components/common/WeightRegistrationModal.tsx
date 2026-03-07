// components/common/WeightRegistrationModal.tsx
import React, { useState, useEffect } from 'react';
import { Exercise } from '../../types/workout.types';

interface WeightRegistrationModalProps {
  isVisible: boolean;
  exercise: Exercise | null;
  lastWeight?: number; // Novo: último peso utilizado
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
  onSave,
  onCancel
}) => {
  const [weight, setWeight] = useState('');
  const [selectedVariation, setSelectedVariation] = useState<number | undefined>();
  const [observations, setObservations] = useState('');
  
  const quickWeights = [2, 5, 7, 10];
  
  // Inicializar com o último peso quando o modal abrir
  useEffect(() => {
    if (exercise && isVisible) {
      // Se tiver último peso, usar ele como valor inicial
      if (lastWeight && lastWeight > 0) {
        setWeight(lastWeight.toString());
      } else {
        setWeight('');
      }
      setSelectedVariation(undefined);
      setObservations('');
      
      // Não focar automaticamente o input
    }
  }, [exercise, isVisible, lastWeight]);

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
    setObservations('');
    onCancel();
  };

  const handleSave = () => {
    const weightNum = parseFloat(weight);
    if (isNaN(weightNum) || weightNum < 0) {
      return;
    }

    onSave({
      weight: weightNum,
      variationId: selectedVariation,
      observations: observations.trim() || undefined
    });
  };

  const isValid = weight.trim() !== '' && parseFloat(weight) >= 0;

  if (!isVisible || !exercise) return null;

  return (
    <div className="fixed inset-0 bg-black/70 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-gradient-to-br from-secondary-dark to-black rounded-2xl 
        p-6 max-w-md w-full border border-white/10 relative">
        
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
          
          {/* Mostrar último peso se disponível */}
          {lastWeight && lastWeight > 0 && (
            <div className="mt-2 inline-flex items-center gap-2 px-3 py-1 bg-blue-500/20 
              rounded-full border border-blue-500/30">
              <i className="fas fa-history text-xs text-blue-400"></i>
              <span className="text-xs text-blue-300">Último peso: <span className="font-bold">{lastWeight} kg</span></span>
            </div>
          )}
        </div>

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
              placeholder={lastWeight ? lastWeight.toString() : "0.0"}
              className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 sm:py-4 
                text-white placeholder-gray-400 focus:outline-none focus:ring-2 
                focus:ring-blue-500 text-center text-xl sm:text-2xl font-bold
                [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none 
                [&::-webkit-inner-spin-button]:appearance-none"
              step="0.5"
              min="0"
              max="500"
              inputMode="decimal"
              // Removido o autoFocus
            />
            <div className="absolute right-3 sm:right-4 top-1/2 transform -translate-y-1/2 
              text-gray-400 font-semibold pointer-events-none text-sm sm:text-base">
              kg
            </div>
          </div>
          
          <div className="mt-3 sm:mt-4">
            <p className="text-text-secondary text-xs sm:text-sm mb-2">
              Peso rápido:
            </p>
            
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

        {exercise.hasVariations && exercise.variations && exercise.variations.length > 0 && (
          <div className="mb-3 sm:mb-4">
            <label className="block text-text-secondary text-xs sm:text-sm mb-2">
              Variação (opcional)
            </label>
            <div className="space-y-1.5 sm:space-y-2 max-h-32 sm:max-h-40 overflow-y-auto pr-1">
              {exercise.variations.map((variation: ExerciseVariation) => (
                <button
                  key={variation.id}
                  onClick={() => setSelectedVariation(
                    selectedVariation === variation.id ? undefined : variation.id
                  )}
                  className={`w-full text-left px-3 sm:px-4 py-2 sm:py-3 rounded-lg transition-all ${
                    selectedVariation === variation.id
                      ? 'bg-gradient-to-r from-blue-600/30 to-blue-700/30 border border-blue-500/50'
                      : 'bg-white/5 border border-white/10 hover:bg-white/10'
                  }`}
                  type="button"
                >
                  <div className="flex items-center justify-between">
                    <span className="text-white text-sm sm:text-base">{variation.name}</span>
                    {selectedVariation === variation.id && (
                      <i className="fas fa-check text-blue-400 text-sm sm:text-base"></i>
                    )}
                  </div>
                  {variation.description && (
                    <p className="text-text-secondary text-xs mt-0.5 sm:mt-1">
                      {variation.description}
                    </p>
                  )}
                </button>
              ))}
            </div>
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

        <div>
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
            {isValid ? 'Salvar e Continuar' : 'Digite um peso válido'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default WeightRegistrationModal;