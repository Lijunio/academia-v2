// components/common/Timer/Timer.tsx - VERSÃO CORRIGIDA
import React, { useState, useEffect, useRef } from 'react';

interface TimerProps {
  totalTime: number;
  onTimeUp?: () => void;
  workoutStarted: boolean; // ← AGORA O HOOK CONTROLA SE O TIMER INICIOU
  exerciseStarted: boolean;
  onStartWorkout?: () => void; // ← APENAS MOSTRAR MODAL
  onResetTimer?: () => void; // ← NOVA PROP PARA RESETAR TIMER
}

const Timer: React.FC<TimerProps> = ({ 
  totalTime, 
  onTimeUp,
  workoutStarted, // ← RECEBE DO HOOK
  exerciseStarted,
  onStartWorkout,
  onResetTimer // ← NOVA PROP
}) => {
  const [timeLeft, setTimeLeft] = useState(totalTime);
  const [isRunning, setIsRunning] = useState(false);
  const [hasStarted, setHasStarted] = useState(false);
  const timerRef = useRef<NodeJS.Timeout | null>(null);
  const startTimeRef = useRef<number | null>(null);

  // EFEITO PARA SINCRONIZAR COM workoutStarted DO HOOK
  useEffect(() => {
    // console.log('⏰ Timer - workoutStarted mudou para:', workoutStarted);
    
    if (workoutStarted) {
      // O HOOK DIZ QUE O TREINO INICIOU (usuário confirmou smartwatch)
      setHasStarted(true);
      setIsRunning(true);
      startTimeRef.current = Date.now() - (totalTime - timeLeft) * 1000;
       //console.log('✅ Timer iniciado pelo hook');
    } else {
      // O HOOK DIZ QUE O TREINO NÃO INICIOU (usuário cancelou)
      setHasStarted(false);
      setIsRunning(false);
      setTimeLeft(totalTime);
      if (timerRef.current) {
        clearInterval(timerRef.current);
        timerRef.current = null;
      }
       //console.log('❌ Timer resetado pelo hook');
    }
  }, [workoutStarted, totalTime]);

  const formatTime = (seconds: number): string => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  // BOTÃO "INICIAR TREINO" - APENAS MOSTRA MODAL SMARTWATCH
  const startTimer = () => {
     //console.log('🔄 Timer - Botão "Iniciar Treino" clicado');
    
    if (!hasStarted) {
       //console.log('📱 Mostrando modal smartwatch...');
      if (onStartWorkout) {
        onStartWorkout(); // ← APENAS MOSTRA MODAL
      }
    } else {
      // Se já iniciou e está pausado, continua
       //console.log('▶️ Continuando timer...');
      setIsRunning(true);
      startTimeRef.current = Date.now() - (totalTime - timeLeft) * 1000;
    }
  };

  const pauseTimer = () => {
     //console.log('⏸️ Pausando timer...');
    setIsRunning(false);
    if (timerRef.current) {
      clearInterval(timerRef.current);
      timerRef.current = null;
    }
  };

  const resetTimer = () => {
     //console.log('🔄 Resetando timer...');
    setIsRunning(false);
    setHasStarted(false);
    setTimeLeft(totalTime);
    if (timerRef.current) {
      clearInterval(timerRef.current);
      timerRef.current = null;
    }
    
    // Chama a função de reset do hook
    if (onResetTimer) {
      onResetTimer();
    }
  };

  // Efeito para o timer rodar
  useEffect(() => {
    if (isRunning && timeLeft > 0) {
      timerRef.current = setInterval(() => {
        setTimeLeft(prev => {
          const newTime = Math.max(0, prev - 1);
          
          if (newTime === 0) {
            setIsRunning(false);
            if (timerRef.current) clearInterval(timerRef.current);
            
            if (onTimeUp) onTimeUp();
            const finishSound = new Audio('/assets/audio/finish.mp3');
            finishSound.play().catch(console.error);
          }
          
          return newTime;
        });
      }, 1000);
    }

    return () => {
      if (timerRef.current) {
        clearInterval(timerRef.current);
      }
    };
  }, [isRunning, timeLeft, onTimeUp]);

  const progressPercentage = ((totalTime - timeLeft) / totalTime) * 100;

  const getTimeColor = () => {
    if (timeLeft <= 300) return '#ff4757';
    if (timeLeft <= 600) return '#ffa502';
    return '#00d26a';
  };

  // console.log('⏰ Timer - Estado atual:', {
  //   workoutStartedFromHook: workoutStarted,
  //   hasStartedInternal: hasStarted,
  //   isRunning,
  //   timeLeft
  // });

  return (
    <div className="bg-gradient-to-r from-secondary-dark to-black 
      rounded-[clamp(0.75rem,2vw,1.5rem)] 
      p-[clamp(0.75rem,2vw,1.5rem)] sm:p-[clamp(1rem,3vw,2rem)]
      border border-gray-800 shadow-xl">
      
      {/* TIMER DISPLAY */}
      <div className="text-center mb-[clamp(1rem,2vw,1.5rem)]">
        <h3 className="text-[clamp(0.75rem,1.5vw,1.125rem)] text-text-secondary 
          uppercase tracking-wider mb-[clamp(0.25rem,0.5vw,0.5rem)]">
          TEMPO DE TREINO
        </h3>
        <div className="text-[clamp(2.5rem,8vw,4.5rem)] font-bold font-montserrat 
          mb-[clamp(0.25rem,0.5vw,0.5rem)]"
          style={{ color: getTimeColor() }}>
          {formatTime(timeLeft)}
        </div>
        <div className="text-text-secondary text-[clamp(0.75rem,1.25vw,0.875rem)]">
          {!hasStarted 
            ? 'Clique em "Iniciar Treino" para começar' 
            : isRunning 
            ? 'Treino em andamento...' 
            : 'Treino pausado'
          }
        </div>
      </div>

      {/* BARRA DE PROGRESSO */}
      <div className="mb-[clamp(1rem,2vw,1.5rem)]">
        <div className="flex justify-between mb-[clamp(0.25rem,0.5vw,0.5rem)]">
          <span className="text-text-secondary text-[clamp(0.75rem,1.25vw,0.875rem)]">
            Progresso
          </span>
          <span className="text-accent-green font-bold 
            text-[clamp(0.875rem,1.5vw,1.125rem)]">
            {Math.round(progressPercentage)}%
          </span>
        </div>
        <div className="h-[clamp(0.375rem,0.75vw,0.5rem)] bg-white/5 rounded-full overflow-hidden">
          <div 
            className="h-full bg-gradient-to-r from-accent-red via-accent-purple to-accent-blue 
              transition-all duration-1000"
            style={{ width: `${progressPercentage}%` }}
          />
        </div>
      </div>

      {/* CONTROLES SIMPLIFICADOS */}
      <div className="flex flex-col sm:flex-row gap-[clamp(0.5rem,1vw,0.75rem)] justify-center">
        {/* BOTÕES CONDICIONAIS */}
        {!hasStarted ? (
          // BOTÃO "INICIAR TREINO" - SÓ APARECE SE NÃO INICIOU
          <button
            onClick={startTimer}
            className={`
              px-[clamp(1.5rem,3vw,2rem)] py-[clamp(0.75rem,1.5vw,1rem)]
              rounded-[clamp(0.5rem,1vw,0.75rem)] font-bold 
              text-[clamp(0.875rem,1.5vw,1.125rem)] flex items-center justify-center gap-[clamp(0.5rem,1vw,0.75rem)]
              transition-all duration-300 min-h-[clamp(2.75rem,5vw,3rem)]
              bg-gradient-to-r from-accent-red to-accent-purple text-white hover:scale-105
            `}
          >
            <i className="fas fa-play"></i>
            Iniciar Treino
          </button>
        ) : (
          // BOTÕES "CONTINUAR/PAUSAR" E "REINICIAR" - SÓ APARECEM APÓS INICIAR
          <>
            {isRunning ? (
              <button
                onClick={pauseTimer}
                className="px-[clamp(1.5rem,3vw,2rem)] py-[clamp(0.75rem,1.5vw,1rem)]
                  rounded-[clamp(0.5rem,1vw,0.75rem)] font-bold 
                  text-[clamp(0.875rem,1.5vw,1.125rem)] 
                  bg-white/10 text-white border border-white/20 hover:bg-white/20 
                  flex items-center justify-center gap-[clamp(0.5rem,1vw,0.75rem)] 
                  transition-all duration-300 hover:scale-105 min-h-[clamp(2.75rem,5vw,3rem)]"
              >
                <i className="fas fa-pause"></i>
                Pausar
              </button>
            ) : (
              <button
                onClick={startTimer}
                className={`
                  px-[clamp(1.5rem,3vw,2rem)] py-[clamp(0.75rem,1.5vw,1rem)]
                  rounded-[clamp(0.5rem,1vw,0.75rem)] font-bold 
                  text-[clamp(0.875rem,1.5vw,1.125rem)] flex items-center justify-center gap-[clamp(0.5rem,1vw,0.75rem)]
                  transition-all duration-300 min-h-[clamp(2.75rem,5vw,3rem)]
                  bg-gradient-to-r from-accent-green to-accent-blue text-white hover:scale-105
                `}
              >
                <i className="fas fa-play"></i>
                Continuar
              </button>
            )}
            
            {/* BOTÃO RESETAR */}
            <button
              onClick={resetTimer}
              className={`
                px-[clamp(1.5rem,3vw,2rem)] py-[clamp(0.75rem,1.5vw,1rem)]
                rounded-[clamp(0.5rem,1vw,0.75rem)] font-bold 
                text-[clamp(0.875rem,1.5vw,1.125rem)] flex items-center justify-center gap-[clamp(0.5rem,1vw,0.75rem)]
                transition-all duration-300 border-2 min-h-[clamp(2.75rem,5vw,3rem)]
                border-accent-red/50 text-accent-red hover:bg-accent-red/10
              `}
            >
              <i className="fas fa-redo"></i>
              Reiniciar
            </button>
          </>
        )}
      </div>

      {/* STATUS DO TIMER */}
      <div className="mt-[clamp(1rem,2vw,1.5rem)] text-center">
        <div className="inline-flex items-center gap-[clamp(0.5rem,1vw,0.75rem)] 
          px-[clamp(0.75rem,1.5vw,1rem)] py-[clamp(0.375rem,0.75vw,0.5rem)]
          rounded-full bg-white/5 text-[clamp(0.75rem,1.25vw,0.875rem)]">
          <i className={`fas ${
            isRunning ? 'fa-play text-accent-green' : 
            hasStarted ? 'fa-pause text-accent-red' : 
            'fa-clock text-text-secondary'
          }`}></i>
          <span>
            {!hasStarted ? 'Pronto para começar' :
             isRunning ? 'Treino em andamento' : 
             'Treino pausado'}
          </span>
        </div>
      </div>

      {/* DICA DO TIMER */}
      {timeLeft <= 300 && timeLeft > 0 && (
        <div className="mt-[clamp(0.75rem,1.5vw,1rem)] p-[clamp(0.5rem,1vw,0.75rem)] 
          bg-accent-red/10 border border-accent-red/20 rounded-lg">
          <div className="flex items-center gap-[clamp(0.5rem,1vw,0.75rem)] text-accent-red">
            <i className="fas fa-exclamation-triangle"></i>
            <span className="text-[clamp(0.75rem,1.25vw,0.875rem)] font-bold">
              ÚLTIMOS 5 MINUTOS!
            </span>
          </div>
          <p className="text-text-secondary text-[clamp(0.75rem,1.25vw,0.875rem)] mt-1">
            Mantenha o foco até o final! Você está quase lá!
          </p>
        </div>
      )}
    </div>
  );
};

export default Timer;