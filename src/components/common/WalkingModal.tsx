// src/components/common/WalkingModal.tsx
import React, { useState, useEffect } from 'react';

interface WalkingModalProps {
  isVisible: boolean;
  exerciseName: string;
  onSave: (data: {
    distance: number;
    duration: number;
  }) => void;
  onCancel: () => void;
  isLoading?: boolean;
}

const WalkingModal: React.FC<WalkingModalProps> = ({
  isVisible,
  exerciseName,
  onSave,
  onCancel,
  isLoading = false
}) => {
  const [distance, setDistance] = useState('');
  const [duration, setDuration] = useState('');

  useEffect(() => {
    if (isVisible) {
      setDistance('');
      setDuration('');
    }
  }, [isVisible]);

  if (!isVisible) return null;

  const quickDistances = [1000, 2000, 3000, 5000];
  const quickDurations = [15, 30, 45, 60];

  const handleSave = () => {
    const distanceNum = parseInt(distance);
    const durationNum = parseInt(duration);
    
    if (isNaN(distanceNum) || distanceNum <= 0) return;
    if (isNaN(durationNum) || durationNum <= 0) return;
    
    onSave({
      distance: distanceNum,
      duration: durationNum
    });
  };

  const isValid = distance !== '' && duration !== '';

  return (
    <div className="fixed inset-0 bg-black/70 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-gradient-to-br from-secondary-dark to-black rounded-2xl 
        p-6 max-w-md w-full border border-white/10">
        
        <div className="text-center mb-6">
          <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-gradient-to-br 
            from-green-500 to-emerald-500 flex items-center justify-center">
            <i className="fas fa-person-walking text-2xl text-white"></i>
          </div>
          
          <h3 className="text-xl font-bold text-white mb-2">
            🚶‍♂️ {exerciseName}
          </h3>
          <p className="text-text-secondary">
            Registre os dados da sua caminhada
          </p>
          <p className="text-text-secondary text-xs mt-2">
            Calorias e frequência cardíaca serão registradas ao finalizar o treino
          </p>
        </div>

        <div className="mb-4">
          <label className="block text-text-secondary text-sm mb-2">
            Distância (metros) *
          </label>
          <div className="flex flex-wrap gap-2 mb-2">
            {quickDistances.map((dist) => (
              <button
                key={dist}
                type="button"
                onClick={() => setDistance(dist.toString())}
                className={`px-3 py-1 rounded-lg text-sm transition-all ${
                  distance === dist.toString()
                    ? 'bg-green-600 text-white'
                    : 'bg-white/10 text-white hover:bg-white/20'
                }`}
              >
                {dist/1000}km
              </button>
            ))}
          </div>
          <input
            type="number"
            value={distance}
            onChange={(e) => setDistance(e.target.value)}
            placeholder="Ex: 3000"
            className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 
              text-white placeholder-gray-400 focus:outline-none focus:border-green-500"
            min="0"
            step="100"
          />
        </div>

        <div className="mb-6">
          <label className="block text-text-secondary text-sm mb-2">
            Duração (minutos) *
          </label>
          <div className="flex flex-wrap gap-2 mb-2">
            {quickDurations.map((dur) => (
              <button
                key={dur}
                type="button"
                onClick={() => setDuration(dur.toString())}
                className={`px-3 py-1 rounded-lg text-sm transition-all ${
                  duration === dur.toString()
                    ? 'bg-green-600 text-white'
                    : 'bg-white/10 text-white hover:bg-white/20'
                }`}
              >
                {dur}min
              </button>
            ))}
          </div>
          <input
            type="number"
            value={duration}
            onChange={(e) => setDuration(e.target.value)}
            placeholder="Ex: 30"
            className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 
              text-white placeholder-gray-400 focus:outline-none focus:border-green-500"
            min="1"
          />
        </div>

        <div className="flex gap-3">
          <button
            onClick={onCancel}
            disabled={isLoading}
            className="flex-1 py-3 bg-gradient-to-r from-gray-600 to-gray-700 
              text-white font-bold rounded-xl transition-all hover:opacity-90"
          >
            Cancelar
          </button>
          
          <button
            onClick={handleSave}
            disabled={!isValid || isLoading}
            className={`flex-1 py-3 font-bold rounded-xl transition-all flex items-center justify-center gap-2 ${
              isValid && !isLoading
                ? 'bg-gradient-to-r from-green-600 to-emerald-600 text-white hover:opacity-90'
                : 'bg-gray-700 text-gray-400 cursor-not-allowed'
            }`}
          >
            {isLoading ? (
              <>
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                Salvando...
              </>
            ) : (
              <>
                <i className="fas fa-check"></i>
                Salvar
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};

export default WalkingModal;