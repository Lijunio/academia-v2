// hooks/usePersistentTimer.ts
import { useRef, useCallback, useEffect } from 'react';

interface TimerState {
  timeLeft: number;
  isRunning: boolean;
  hasStarted: boolean;
}

export const usePersistentTimer = (totalTime: number) => {
  const timerRef = useRef<NodeJS.Timeout | null>(null);
  const startTimeRef = useRef<number | null>(null);
  const timeLeftRef = useRef<number>(totalTime);
  const isRunningRef = useRef<boolean>(false);
  const hasStartedRef = useRef<boolean>(false);
  const listenersRef = useRef<Set<(state: TimerState) => void>>(new Set());

  const updateListeners = useCallback(() => {
    const state = {
      timeLeft: timeLeftRef.current,
      isRunning: isRunningRef.current,
      hasStarted: hasStartedRef.current
    };
    listenersRef.current.forEach(listener => listener(state));
  }, []);

  const startTimer = useCallback(() => {
    if (!hasStartedRef.current) {
      hasStartedRef.current = true;
      startTimeRef.current = Date.now() - (totalTime - timeLeftRef.current) * 1000;
    }
    
    if (!isRunningRef.current) {
      isRunningRef.current = true;
      startTimeRef.current = Date.now() - (totalTime - timeLeftRef.current) * 1000;
      
      timerRef.current = setInterval(() => {
        if (!startTimeRef.current) return;
        
        const elapsedSeconds = Math.floor((Date.now() - startTimeRef.current) / 1000);
        const newTimeLeft = Math.max(0, totalTime - elapsedSeconds);
        
        timeLeftRef.current = newTimeLeft;
        updateListeners();
        
        if (newTimeLeft === 0) {
          if (timerRef.current) clearInterval(timerRef.current);
          isRunningRef.current = false;
          updateListeners();
        }
      }, 1000);
    }
  }, [totalTime, updateListeners]);

  const pauseTimer = useCallback(() => {
    if (timerRef.current) {
      clearInterval(timerRef.current);
      timerRef.current = null;
    }
    isRunningRef.current = false;
    updateListeners();
  }, [updateListeners]);

  const subscribe = useCallback((listener: (state: TimerState) => void) => {
    listenersRef.current.add(listener);
    return () => {
      listenersRef.current.delete(listener);
    };
  }, []);

  useEffect(() => {
    return () => {
      if (timerRef.current) {
        clearInterval(timerRef.current);
      }
    };
  }, []);

  return {
    startTimer,
    pauseTimer,
    subscribe,
    getTimeLeft: () => timeLeftRef.current,
    isRunning: () => isRunningRef.current,
    hasStarted: () => hasStartedRef.current
  };
};