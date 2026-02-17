import React from 'react';

interface SmartwatchConfirmModalProps {
  isVisible: boolean;
  onConfirm: () => void; // ← Envia WhatsApp E inicia timer
  onCancel: () => void;  // ← Volta para tela, NÃO faz nada
  workoutName: string;
}

const SmartwatchConfirmModal: React.FC<SmartwatchConfirmModalProps> = ({
  isVisible,
  onConfirm,
  onCancel,
  workoutName
}) => {
  if (!isVisible) return null;

  const handleBackdropClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (e.target === e.currentTarget) {
      onCancel(); // Clicar fora = cancelar
    }
  };

  return (
    <div 
      className="fixed inset-0 bg-black/70 backdrop-blur-sm z-50 flex items-center justify-center p-4"
      onClick={handleBackdropClick}
    >
      <div className="bg-gradient-to-br from-secondary-dark to-black rounded-2xl p-6 max-w-md w-full border border-white/10">
        <div className="text-center mb-6">

          <h3 className="text-xl font-bold text-white mb-2">
            ⏱️ Smartwatch Detectado
          </h3>
          <p className="text-text-secondary mb-1">
            Iniciar treino <span className="text-blue-300 font-bold">{workoutName}</span> no smartwatch?
          </p>
          <p className="text-text-secondary text-sm mb-4">
            O timer será sincronizado com seu dispositivo
          </p>
        </div>

        <div className="space-y-3">
          <button
            onClick={onConfirm}
            className="w-full py-3 bg-gradient-to-r from-blue-600 to-purple-600 
              text-white font-bold rounded-xl transition-all hover:opacity-90 flex items-center justify-center gap-2
              hover:scale-105 active:scale-95"
          >
            <i className="fas fa-check-circle"></i>
            Sim, iniciar com smartwatch
          </button>
          
          <button
            onClick={onCancel}
            className="w-full py-3 bg-gradient-to-r from-gray-600 to-gray-700 
              text-white font-bold rounded-xl transition-all hover:opacity-90 flex items-center justify-center gap-2
              hover:scale-105 active:scale-95"
          >
            <i className="fas fa-times-circle"></i>
            Não, iniciar sem smartwatch
          </button>
        </div>
      </div>
    </div>
  );
};

export default SmartwatchConfirmModal;
export {};