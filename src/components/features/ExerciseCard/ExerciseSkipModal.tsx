// components/features/ExerciseCard/ExerciseSkipModal.tsx
import React, { useState } from 'react';

interface ExerciseSkipModalProps {
  isVisible: boolean;
  onClose: () => void;
  onConfirm: (reason: string) => void;
  exerciseName: string;
}

const ExerciseSkipModal: React.FC<ExerciseSkipModalProps> = ({
  isVisible,
  onClose,
  onConfirm,
  exerciseName
}) => {
  const [selectedReason, setSelectedReason] = useState('');
  const [customReason, setCustomReason] = useState('');

  const reasons = [
    'Dores musculares',
    'Lesão/Problema físico',
    'Equipamento indisponível',
    'Falta de técnica/segurança',
    'Outro motivo'
  ];

  const handleConfirm = () => {
    const finalReason = selectedReason === 'Outro motivo' 
      ? customReason 
      : selectedReason;
    
    if (finalReason.trim()) {
      onConfirm(finalReason);
      setSelectedReason('');
      setCustomReason('');
      onClose();
    }
  };

  if (!isVisible) return null;

  return (
    <div className="fixed inset-0 bg-black/90 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-gradient-to-br from-secondary-dark to-black 
        rounded-2xl w-full max-w-md p-6 border border-white/10">
        
        <div className="text-center mb-6">
          <div className="w-16 h-16 rounded-full bg-yellow-500/20 
            flex items-center justify-center mx-auto mb-4">
            <i className="fas fa-question-circle text-3xl text-yellow-500"></i>
          </div>
          
          <h3 className="text-xl font-bold text-white mb-2">
            Pular Exercício
          </h3>
          <p className="text-text-secondary">
            Por que você não pode fazer <span className="text-yellow-400 font-bold">{exerciseName}</span>?
          </p>
        </div>

        <div className="mb-6">
          <div className="space-y-3 mb-4">
            {reasons.map((reason) => (
              <label 
                key={reason}
                className="flex items-center gap-3 p-3 rounded-lg bg-white/5 
                  border border-white/10 hover:bg-white/10 cursor-pointer transition-colors"
              >
                <input
                  type="radio"
                  name="skipReason"
                  value={reason}
                  checked={selectedReason === reason}
                  onChange={(e) => setSelectedReason(e.target.value)}
                  className="text-yellow-500"
                />
                <span className="text-white">{reason}</span>
              </label>
            ))}
          </div>

          {selectedReason === 'Outro motivo' && (
            <div className="mt-4">
              <textarea
                value={customReason}
                onChange={(e) => setCustomReason(e.target.value)}
                placeholder="Descreva o motivo..."
                className="w-full p-3 bg-white/5 border border-white/10 rounded-lg 
                  text-white placeholder-gray-400 resize-none h-24"
                maxLength={200}
              />
              <p className="text-text-secondary text-xs mt-2 text-right">
                {customReason.length}/200 caracteres
              </p>
            </div>
          )}
        </div>

        <div className="flex gap-3">
          <button
            onClick={onClose}
            className="flex-1 py-3 bg-white/10 text-white rounded-lg 
              border border-white/20 hover:bg-white/20 transition-colors"
          >
            Cancelar
          </button>
          
          <button
            onClick={handleConfirm}
            disabled={!selectedReason || (selectedReason === 'Outro motivo' && !customReason.trim())}
            className={`
              flex-1 py-3 rounded-lg font-bold text-white transition-all
              ${!selectedReason || (selectedReason === 'Outro motivo' && !customReason.trim())
                ? 'bg-gray-600 cursor-not-allowed'
                : 'bg-gradient-to-r from-yellow-600 to-orange-600 hover:opacity-90'
              }
            `}
          >
            Confirmar
          </button>
        </div>
      </div>
    </div>
  );
};

export default ExerciseSkipModal;