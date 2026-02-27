// components/Modal/WorkoutReport.tsx
import React from 'react';
import { WorkoutReport as WorkoutReportType } from '../../../types/workout.types';

interface WorkoutReportProps {
  report: WorkoutReportType;
  onSend: () => Promise<void>;
  onClose: () => void;
  sending: boolean;
}

const WorkoutReport: React.FC<WorkoutReportProps> = ({
  report,
  onSend,
  onClose,
  sending
}) => {
  const formatDuration = (seconds: number): string => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const formatDate = (date: Date): string => {
    return new Date(date).toLocaleDateString('pt-BR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  return (
    <div className="fixed inset-0 bg-black/70 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-gradient-to-br from-secondary-dark to-black rounded-2xl 
        p-6 max-w-4xl w-full border border-white/10 max-h-[90vh] overflow-y-auto">
        
        <div className="flex justify-between items-center mb-6">
          <h3 className="text-2xl font-bold text-white">
            📋 Relatório do Treino {report.workoutType}
          </h3>
          <button
            onClick={onClose}
            className="text-text-secondary hover:text-white transition-colors"
          >
            <i className="fas fa-times text-xl"></i>
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
          <div className="bg-white/5 rounded-xl p-4 border border-white/10">
            <div className="text-center">
              <div className="text-3xl font-bold text-white mb-1">
                {formatDuration(report.duration)}
              </div>
              <div className="text-text-secondary text-sm">TEMPO TOTAL</div>
            </div>
          </div>
          
          <div className="bg-white/5 rounded-xl p-4 border border-white/10">
            <div className="text-center">
              <div className="text-3xl font-bold text-accent-red mb-1">
                {report.totalCalories}
              </div>
              <div className="text-text-secondary text-sm">CALORIAS</div>
            </div>
          </div>
          
          <div className="bg-white/5 rounded-xl p-4 border border-white/10">
            <div className="text-center">
              <div className="text-3xl font-bold text-accent-blue mb-1">
                {formatDate(report.date)}
              </div>
              <div className="text-text-secondary text-sm">DATA</div>
            </div>
          </div>
        </div>

        <div className="mb-8">
          <h4 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
            <i className="fas fa-dumbbell"></i>
            Exercícios Realizados
          </h4>
          
          <div className="space-y-4">
            {report.exercises.map((exercise, index) => (
              <div 
                key={exercise.id}
                className={`bg-gradient-to-br from-white/5 to-transparent rounded-xl p-4 border ${
                  exercise.completed
                    ? 'border-green-500/20'
                    : 'border-red-500/20'
                }`}
              >
                <div className="flex justify-between items-start mb-2">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-accent-red to-accent-purple 
                      flex items-center justify-center text-white font-bold text-sm">
                      {index + 1}
                    </div>
                    <h5 className="text-lg font-bold text-white">
                      {exercise.name}
                    </h5>
                  </div>
                  
                  <div className="flex items-center gap-2">
                    {exercise.completed ? (
                      <span className="px-3 py-1 bg-green-500/20 text-green-300 rounded-full text-xs font-bold">
                        CONCLUÍDO
                      </span>
                    ) : (
                      <span className="px-3 py-1 bg-red-500/20 text-red-300 rounded-full text-xs font-bold">
                        NÃO REALIZADO
                      </span>
                    )}
                  </div>
                </div>
                
                {exercise.completed ? (
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-3">
                    <div>
                      <div className="text-text-secondary text-sm mb-1">Peso</div>
                      <div className="text-white font-bold">{exercise.weight} kg</div>
                    </div>
                    
                    <div>
                      <div className="text-text-secondary text-sm mb-1">Séries</div>
                      <div className="text-white font-bold">{exercise.sets} séries</div>
                    </div>
                    
                    {exercise.variation && (
                      <div>
                        <div className="text-text-secondary text-sm mb-1">Variação</div>
                        <div className="text-white font-bold">{exercise.variation}</div>
                      </div>
                    )}
                    
                    {exercise.observations && (
                      <div className="md:col-span-3 mt-2">
                        <div className="text-text-secondary text-sm mb-1">Observações</div>
                        <div className="text-white bg-white/5 rounded-lg p-3">
                          {exercise.observations}
                        </div>
                      </div>
                    )}
                  </div>
                ) : (
                  <div className="mt-2">
                    <div className="text-text-secondary text-sm mb-1">Motivo</div>
                    <div className="text-red-300">{exercise.skipReason || 'Não realizado'}</div>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>

        <div className="flex gap-3 pt-6 border-t border-white/10">
          <button
            onClick={onClose}
            className="flex-1 py-3 bg-gradient-to-r from-gray-600 to-gray-700 
              text-white font-bold rounded-xl transition-all hover:opacity-90"
          >
            Fechar
          </button>
          
          <button
            onClick={onSend}
            disabled={sending || report.sentToTelegram}
            className={`flex-1 py-3 font-bold rounded-xl transition-all flex items-center justify-center gap-2 ${
              !sending && !report.sentToTelegram
                ? 'bg-gradient-to-r from-blue-600 to-purple-600 text-white hover:opacity-90'
                : 'bg-gray-700 text-gray-400 cursor-not-allowed'
            }`}
          >
            {sending ? (
              <>
                <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                Enviando...
              </>
            ) : report.sentToTelegram ? (
              <>
                <i className="fas fa-check"></i>
                Já Enviado
              </>
            ) : (
              <>
                <i className="fab fa-telegram"></i>
                Enviar para Telegram
              </>
            )}
          </button>
        </div>
        
        <div className="mt-6 text-center">
          <p className="text-text-secondary text-sm">
            <i className="fas fa-info-circle mr-1"></i>
            Este relatório será salvo localmente e enviado para o grupo do Telegram configurado.
          </p>
        </div>
      </div>
    </div>
  );
};

export default WorkoutReport;