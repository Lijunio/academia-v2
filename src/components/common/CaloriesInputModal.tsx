import React, { useState, useEffect } from 'react';

interface CaloriesInputModalProps {
  isVisible: boolean;
  workoutDuration: number; // Tempo REAL decorrido em segundos
  onSave: (calories: number, heartRate?: number) => void;
  onCancel: () => void;
  isLoading?: boolean;
}

const CaloriesInputModal: React.FC<CaloriesInputModalProps> = ({
  isVisible,
  workoutDuration,
  onSave,
  onCancel,
  isLoading = false
}) => {
  const [calories, setCalories] = useState('');
  const [heartRate, setHeartRate] = useState('');

  useEffect(() => {
    if (isVisible) {
      setCalories('');
      setHeartRate('');
    }
  }, [isVisible]);

  if (!isVisible) return null;

  const formatDuration = (seconds: number): string => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const handleSave = () => {
    const caloriesNum = parseInt(calories);
    const heartRateNum = heartRate ? parseInt(heartRate) : undefined;
    
    if (isNaN(caloriesNum) || caloriesNum < 0 || caloriesNum > 5000) {
      alert('Por favor, insira um valor entre 0 e 5000 calorias');
      return;
    }
    
    if (heartRateNum !== undefined && (heartRateNum < 40 || heartRateNum > 220)) {
      alert('Por favor, insira uma frequência cardíaca entre 40 e 220 bpm');
      return;
    }
    
    onSave(caloriesNum, heartRateNum);
  };

  const handleCancel = () => {
    onCancel();
  };

  const isValid = calories.trim() !== '' && 
                  !isNaN(parseInt(calories)) && 
                  parseInt(calories) >= 0 &&
                  parseInt(calories) <= 5000 &&
                  (!heartRate || 
                   (!isNaN(parseInt(heartRate)) && 
                    parseInt(heartRate) >= 40 && 
                    parseInt(heartRate) <= 220));

  const handleBackdropClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (e.target === e.currentTarget) {
      handleCancel();
    }
  };

  return (
    <div 
      className="fixed inset-0 bg-black/70 backdrop-blur-sm z-50 flex items-center justify-center p-4"
      onClick={handleBackdropClick}
    >
      <div className="bg-gradient-to-br from-secondary-dark to-black rounded-2xl 
        p-6 max-w-md w-full border border-white/10">
        
        <div className="text-center mb-6">
          <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-gradient-to-br 
            from-green-500 to-emerald-500 flex items-center justify-center">
            <i className="fas fa-fire text-2xl text-white"></i>
          </div>
          
          <h3 className="text-xl font-bold text-white mb-2">
            🏁 Treino Finalizado!
          </h3>
          <p className="text-text-secondary mb-4">
            Registre os dados do seu treino para o relatório.
          </p>
          
          {/* CARD COM TEMPO REAL */}
          <div className="bg-green-500/10 border border-green-500/20 rounded-lg p-4 mb-4">
            <div className="text-center">
              <div className="text-3xl font-bold text-white">
                {formatDuration(workoutDuration)}
              </div>
              <div className="text-xs text-green-300 mt-1">TEMPO TOTAL</div>
            </div>
          </div>
        </div>

        {/* CAMPO DE CALORIAS */}
        <div className="mb-4">
          <label className="block text-text-secondary text-sm mb-2">
            Calorias gastas (kcal) *
          </label>
          <div className="relative">
            <input
              type="number"
              value={calories}
              onChange={(e) => setCalories(e.target.value)}
              placeholder="Ex: 450"
              className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 
                text-white placeholder-gray-400 focus:outline-none focus:border-green-500"
              min="0"
              max="5000"
              autoFocus
            />
            <span className="absolute right-4 top-3 text-gray-400">kcal</span>
          </div>
          <p className="text-xs text-text-secondary mt-1">
            Consulte o registro do seu smartwatch ou app de fitness.
          </p>
        </div>

        {/* CAMPO DE FREQUÊNCIA CARDÍACA */}
        <div className="mb-6">
          <label className="block text-text-secondary text-sm mb-2">
            Frequência Cardíaca Média (opcional)
          </label>
          <div className="relative">
            <input
              type="number"
              value={heartRate}
              onChange={(e) => setHeartRate(e.target.value)}
              placeholder="Ex: 145"
              className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 
                text-white placeholder-gray-400 focus:outline-none focus:border-blue-500"
              min="40"
              max="220"
            />
            <span className="absolute right-4 top-3 text-gray-400">bpm</span>
          </div>
          <p className="text-xs text-text-secondary mt-1">
            Frequência cardíaca média durante o treino.
          </p>
        </div>

        {/* BOTÕES */}
        <div className="flex gap-3">
          <button
            onClick={handleCancel}
            disabled={isLoading}
            className="flex-1 py-3 bg-gradient-to-r from-gray-600 to-gray-700 
              text-white font-bold rounded-xl transition-all hover:opacity-90
              disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Cancelar
          </button>
          
          <button
            onClick={handleSave}
            disabled={!isValid || isLoading}
            className={`flex-1 py-3 font-bold rounded-xl transition-all flex items-center justify-center gap-2 ${
              isValid && !isLoading
                ? 'bg-gradient-to-r from-green-600 to-emerald-600 text-white hover:opacity-90 hover:scale-105'
                : 'bg-gray-700 text-gray-400 cursor-not-allowed'
            }`}
          >
            {isLoading ? (
              <>
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                Enviando...
              </>
            ) : (
              <>
                <i className="fas fa-paper-plane"></i>
                Finalizar e Enviar
              </>
            )}
          </button>
        </div>

        {/* NOTA */}
        <div className="mt-6 pt-4 border-t border-white/10">
          <p className="text-xs text-text-secondary text-center">
            <i className="fas fa-info-circle mr-1"></i>
            Um relatório completo será enviado para o Telegram.
          </p>
        </div>
      </div>
    </div>
  );
};

export default CaloriesInputModal;