import React, { useState, useEffect, useRef } from 'react';

interface RestOverlayProps {
  isVisible: boolean;
  onClose: () => void;
  restTime: number;
  nextExerciseName: string;
  workoutType: 'A' | 'B';
  isGroupRest?: boolean;
  exerciseOptions?: { name: string; group: string }[];
}

const RestOverlay: React.FC<RestOverlayProps> = ({
  isVisible,
  onClose,
  restTime,
  nextExerciseName,
  workoutType,
  isGroupRest = false,
  exerciseOptions = []
}) => {
  const [timeLeft, setTimeLeft] = useState(restTime);
  const timerRef = useRef<NodeJS.Timeout | null>(null);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  const colors = {
    'A': { primary: '#ff4757', gradient: 'linear-gradient(135deg, #ff4757, #ff6b81)' },
    'B': { primary: '#2e86de', gradient: 'linear-gradient(135deg, #2e86de, #54a0ff)' }
  };

  const workoutColor = colors[workoutType];

  useEffect(() => {
    if (!isVisible) return;

    try {
      audioRef.current = new Audio('/assets/audio/rest-start.mp3');
      audioRef.current.preload = 'auto';
    } catch (error) {
      console.error('Erro ao criar áudio:', error);
    }

    return () => {
      if (audioRef.current) {
        audioRef.current.pause();
        audioRef.current = null;
      }
    };
  }, [isVisible]);

  useEffect(() => {
    if (isVisible) {
      setTimeLeft(restTime);
      
      if (audioRef.current) {
        try {
          audioRef.current.currentTime = 0;
          audioRef.current.play().catch(console.error);
        } catch (error) {
          console.error('Erro ao tocar áudio:', error);
        }
      }

      timerRef.current = setInterval(() => {
        setTimeLeft(prev => {
          if (prev <= 1) {
            if (timerRef.current) clearInterval(timerRef.current);
            
            try {
              const finishAudio = new Audio('/assets/audio/rest-end.mp3');
              finishAudio.play().catch(console.error);
            } catch (error) {
              console.error('Erro ao tocar áudio de término:', error);
            }
            
            setTimeout(() => onClose(), 100);
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    }

    return () => {
      if (timerRef.current) {
        clearInterval(timerRef.current);
        timerRef.current = null;
      }
    };
  }, [isVisible, restTime, onClose]);

  const handleSkip = () => {
    if (timerRef.current) {
      clearInterval(timerRef.current);
      timerRef.current = null;
    }
    
    try {
      const finishAudio = new Audio('/assets/audio/rest-end.mp3');
      finishAudio.play().catch(console.error);
    } catch (error) {
      console.error('Erro ao tocar áudio:', error);
    }
    
    onClose();
  };

  const formatTime = (seconds: number): string => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const handleClose = () => {
    onClose();
  };

  if (!isVisible) return null;

  return (
    <div className="fixed inset-0 bg-black/95 backdrop-blur-sm z-50 flex items-center justify-center p-2 sm:p-3 md:p-4">
      <div 
        className="bg-gradient-to-br from-secondary-dark to-black 
          rounded-xl sm:rounded-2xl w-full max-w-xs sm:max-w-sm md:max-w-md p-4 sm:p-5 md:p-6 border border-white/10 relative overflow-hidden"
        style={{
          boxShadow: `0 10px 30px ${workoutColor.primary}40`
        }}
      >
        <button
          onClick={handleClose}
          className="absolute top-3 right-3 sm:top-4 sm:right-4 w-8 h-8 rounded-full bg-white/10 
            hover:bg-white/20 transition-colors flex items-center justify-center
            text-white hover:text-red-400 z-10"
          title="Fechar"
        >
          <i className="fas fa-times text-sm"></i>
        </button>

        <div 
          className="absolute top-0 left-0 right-0 h-1 sm:h-2"
          style={{ background: workoutColor.gradient }}
        />

        <div className="text-center mb-4 sm:mb-5 md:mb-6 pt-2">
          <div className="flex flex-col items-center gap-1 sm:gap-2 mb-2 sm:mb-3">
            <div className="w-12 h-12 sm:w-14 sm:h-14 md:w-16 md:h-16 rounded-full bg-gradient-to-br from-black/30 to-transparent 
              flex items-center justify-center border-2"
              style={{ borderColor: workoutColor.primary }}
            >
              <i className={`fas ${isGroupRest ? 'fa-layer-group' : 'fa-dumbbell'} text-xl sm:text-2xl md:text-3xl`}
                style={{ color: workoutColor.primary }}>
              </i>
            </div>
            
            <div>
              <h2 className="text-lg sm:text-xl md:text-2xl font-bold text-white font-montserrat">
                {isGroupRest ? 'DESCANSO ENTRE GRUPOS' : 'DESCANSO'}
              </h2>
              <div className="text-text-secondary text-xs sm:text-sm mt-0.5 sm:mt-1">
                {isGroupRest ? 'Mudança de grupo muscular' : 'Entre exercícios'}
              </div>
            </div>
          </div>
          
          <div className="bg-white/5 rounded-lg p-2 sm:p-3 border border-white/10 mb-4">
            <p className="text-text-secondary text-xs sm:text-sm mb-0.5 sm:mb-1">Próximo exercício:</p>
            <p 
              className="text-sm sm:text-base md:text-lg font-bold truncate px-1 text-center mb-2" 
              title={nextExerciseName}
              style={{ color: workoutColor.primary }}
            >
              {nextExerciseName}
            </p>
          </div>
        </div>

        <div className="relative w-40 h-40 sm:w-48 sm:h-48 md:w-56 md:h-56 mx-auto mb-4 sm:mb-5 md:mb-6">
          <svg className="absolute inset-0 w-full h-full transform -rotate-90">
            <circle
              cx="50%"
              cy="50%"
              r="48%"
              stroke="rgba(255,255,255,0.1)"
              strokeWidth="6"
              fill="transparent"
            />
            <circle
              cx="50%"
              cy="50%"
              r="48%"
              stroke={workoutColor.primary}
              strokeWidth="6"
              fill="transparent"
              strokeDasharray={2 * Math.PI * 48}
              strokeDashoffset={2 * Math.PI * 48 * (1 - timeLeft / restTime)}
              strokeLinecap="round"
              style={{
                filter: `drop-shadow(0 0 8px ${workoutColor.primary})`,
                transition: 'stroke-dashoffset 1s linear'
              }}
            />
          </svg>
          
          <div className="absolute inset-0 flex flex-col items-center justify-center">
            <div className="text-3xl sm:text-4xl md:text-5xl font-bold text-white font-montserrat mb-1 sm:mb-2">
              {formatTime(timeLeft)}
            </div>
            <div className="text-xs sm:text-sm text-text-secondary font-bold">
              ⏱️ TEMPO RESTANTE
            </div>
            <div className="text-[10px] sm:text-xs text-text-secondary mt-0.5 sm:mt-1">
              {isGroupRest ? 'Descanso longo (90s)' : 'Descanso curto (45s)'}
            </div>
          </div>
        </div>

        <div className="flex gap-2 sm:gap-3 mb-4 sm:mb-5 md:mb-6">
          <button
            onClick={handleSkip}
            className="flex-1 py-2.5 sm:py-3 rounded-lg font-bold text-white transition-all 
              flex items-center justify-center gap-1 sm:gap-2 text-sm sm:text-base
              hover:scale-105 active:scale-95"
            style={{ 
              background: workoutColor.gradient,
              border: `1px solid ${workoutColor.primary}`
            }}
          >
            <i className="fas fa-forward text-xs sm:text-sm"></i>
            Pular Descanso
          </button>
        </div>

        <div className="hidden sm:grid grid-cols-2 gap-2 sm:gap-3 mb-4 sm:mb-5 md:mb-6">
          <div className="bg-white/5 rounded-lg sm:rounded-xl p-2 sm:p-3 text-center border border-white/10">
            <i className="fas fa-clock text-lg sm:text-xl mb-1 sm:mb-2" style={{ color: workoutColor.primary }}></i>
            <div className="text-[10px] sm:text-xs text-text-secondary mb-0.5 sm:mb-1">Duração</div>
            <div className="text-sm sm:text-base md:text-lg font-bold text-white">
              {restTime === 45 ? '45 seg' : '1m 30s'}
            </div>
          </div>
          
          <div className="bg-white/5 rounded-lg sm:rounded-xl p-2 sm:p-3 text-center border border-white/10">
            <i className="fas fa-heart text-lg sm:text-xl mb-1 sm:mb-2" style={{ color: workoutColor.primary }}></i>
            <div className="text-[10px] sm:text-xs text-text-secondary mb-0.5 sm:mb-1">Recuperação</div>
            <div className="text-sm sm:text-base md:text-lg font-bold text-white">
              {isGroupRest ? 'Recuperação total' : 'Recuperação parcial'}
            </div>
          </div>
        </div>

        <div className="bg-gradient-to-r from-black/30 to-transparent rounded-lg sm:rounded-xl p-3 sm:p-4 mb-3 sm:mb-4 border border-white/10">
          <div className="flex items-center gap-2 mb-1 sm:mb-2">
            <i className="fas fa-lightbulb text-base sm:text-lg" style={{ color: workoutColor.primary }}></i>
            <span className="text-white font-bold text-sm sm:text-base">Dica do momento:</span>
          </div>
          <p className="text-text-secondary text-xs sm:text-sm leading-relaxed">
            {timeLeft > 30 
              ? (isGroupRest 
                ? "🚰 Aproveite para hidratar-se bem. O próximo grupo muscular requer energia renovada."
                : "💧 Beba um gole de água. Mantenha-se hidratado para melhor performance.")
              : (isGroupRest 
                ? "🎯 Prepare-se mentalmente para o próximo grupo. Visualize os movimentos."
                : "⚡ Ajuste sua postura. Prepare-se para começar em instantes.")
            }
          </p>
        </div>

        {timeLeft <= 10 && (
          <div className="text-center mb-3 sm:mb-4">
            <div className="inline-flex items-center gap-1 sm:gap-2 px-3 sm:px-4 py-1.5 sm:py-2 bg-black/40 rounded-full border border-white/20">
              <i className="fas fa-hourglass-end text-yellow-400 text-xs sm:text-sm"></i>
              <span className="text-yellow-400 font-bold text-xs sm:text-sm">Últimos {timeLeft} segundos!</span>
            </div>
          </div>
        )}

        <div className="hidden sm:block text-center pt-3 sm:pt-4 border-t border-white/10">
          <p className="text-text-secondary text-[10px] sm:text-xs">
            <i className="fas fa-info-circle mr-1 text-[10px] sm:text-xs"></i>
            O descanso adequado é fundamental para seus ganhos musculares e recuperação
          </p>
        </div>
      </div>
    </div>
  );
};

export default RestOverlay;