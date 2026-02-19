// src/components/YearCalendar.tsx
import React, { useState } from 'react';

export interface Workout {
  id: string;
  type: 'academia' | 'natacao' | 'pilates';
  date: string;
  duration: number;
  calories: number;
  heart_rate: number;
  details?: any;
  notes?: string;
}

interface DayData {
  count: number;
  workouts: Workout[];
}

interface YearCalendarProps {
  workouts: Workout[];
  onWorkoutClick: (workout: Workout) => void;
}

const YearCalendar: React.FC<YearCalendarProps> = ({ workouts, onWorkoutClick }) => {
  const [selectedDate, setSelectedDate] = useState(new Date());
  
  const currentYear = selectedDate.getFullYear();
  const currentMonth = selectedDate.getMonth();
  
  const months = [
    'Janeiro', 'Fevereiro', 'Março', 'Abril', 'Maio', 'Junho',
    'Julho', 'Agosto', 'Setembro', 'Outubro', 'Novembro', 'Dezembro'
  ];

  const getWorkoutVariant = (workout: Workout): string => {
    if (workout.type !== 'academia') return workout.type;
    
    const notes = workout.notes?.toLowerCase() || '';
    const details = workout.details || {};
    
    if (notes.includes('treino a') || details.workoutType === 'A') return 'Treino A';
    if (notes.includes('treino b') || details.workoutType === 'B') return 'Treino B';
    return 'Treino A';
  };

  const workoutsByDate = workouts.reduce((acc: Record<string, DayData>, workout: Workout) => {
    const date = new Date(workout.date).toLocaleDateString();
    if (!acc[date]) {
      acc[date] = { 
        count: 0, 
        workouts: []
      };
    }
    acc[date].count += 1;
    acc[date].workouts.push(workout);
    return acc;
  }, {});

  const goToPreviousMonth = () => {
    setSelectedDate(new Date(currentYear, currentMonth - 1, 1));
  };

  const goToNextMonth = () => {
    setSelectedDate(new Date(currentYear, currentMonth + 1, 1));
  };

  const canGoToNextMonth = () => {
    const today = new Date();
    return currentYear < today.getFullYear() || 
           (currentYear === today.getFullYear() && currentMonth < today.getMonth());
  };

  const getDaysInMonth = (year: number, month: number): number => {
    return new Date(year, month + 1, 0).getDate();
  };

  const getFirstDayOfMonth = (year: number, month: number): number => {
    return new Date(year, month, 1).getDay();
  };

  const isFutureDate = (year: number, month: number, day: number): boolean => {
    const today = new Date();
    const date = new Date(year, month, day);
    return date > today;
  };

  const getDayColor = (year: number, month: number, day: number): { bg: string, border: string } => {
    const dateStr = new Date(year, month, day).toLocaleDateString();
    const dayData = workoutsByDate[dateStr];
    
    if (!dayData) {
      return { 
        bg: 'bg-gray-800/50', 
        border: 'border-gray-700/30' 
      };
    }

    const workout = dayData.workouts[0];
    const variant = getWorkoutVariant(workout);
    
    if (workout.type === 'academia') {
      if (variant === 'Treino A') {
        return { 
          bg: 'bg-blue-600/30',
          border: 'border-blue-500/50' 
        };
      } else {
        return { 
          bg: 'bg-orange-600/30',
          border: 'border-orange-500/50' 
        };
      }
    }
    
    if (workout.type === 'natacao') {
      return { 
        bg: 'bg-emerald-600/30',
        border: 'border-emerald-500/50' 
      };
    }
    
    if (workout.type === 'pilates') {
      return { 
        bg: 'bg-purple-600/30',
        border: 'border-purple-500/50' 
      };
    }
    
    return { 
      bg: 'bg-gray-800/50', 
      border: 'border-gray-700/30' 
    };
  };

  const daysInMonth = getDaysInMonth(currentYear, currentMonth);
  const firstDay = getFirstDayOfMonth(currentYear, currentMonth);
  const days: React.ReactNode[] = [];

  for (let i = 0; i < firstDay; i++) {
    days.push(<div key={`empty-${i}`} className="aspect-square"></div>);
  }

  for (let day = 1; day <= daysInMonth; day++) {
    const dateStr = new Date(currentYear, currentMonth, day).toLocaleDateString();
    const dayData = workoutsByDate[dateStr];
    
    const future = isFutureDate(currentYear, currentMonth, day);
    
    const colors = getDayColor(currentYear, currentMonth, day);
    const hasWorkout = !!dayData;

    days.push(
      <button
        key={day}
        onClick={() => {
          if (!future && dayData) {
            onWorkoutClick(dayData.workouts[0]);
          }
        }}
        disabled={future || !dayData}
        className={`aspect-square rounded-lg border flex flex-col items-center justify-center
          transition-all duration-200 relative group
          ${future 
            ? 'opacity-30 cursor-not-allowed' 
            : hasWorkout 
              ? `${colors.bg} ${colors.border} hover:scale-105 hover:shadow-lg hover:border-white cursor-pointer` 
              : 'bg-gray-800/30 border-gray-700/20 text-gray-600 hover:bg-gray-700/30'
          }`}
      >
        <span className={`text-sm font-bold ${hasWorkout ? 'text-white' : 'text-gray-500'}`}>
          {day}
        </span>
        
        {dayData && dayData.workouts.length > 1 && (
          <div className="flex gap-0.5 mt-1">
            {dayData.workouts.map((workout, index) => {
              const variant = getWorkoutVariant(workout);
              let dotColor = 'bg-white/70';
              
              if (workout.type === 'academia') {
                dotColor = variant === 'Treino A' ? 'bg-blue-300' : 'bg-orange-300';
              } else if (workout.type === 'natacao') {
                dotColor = 'bg-emerald-300';
              } else if (workout.type === 'pilates') {
                dotColor = 'bg-purple-300';
              }
              
              return (
                <div key={index} className={`w-1 h-1 rounded-full ${dotColor}`}></div>
              );
            })}
          </div>
        )}
        
        {dayData && (
          <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 w-40 
            bg-gray-900/95 backdrop-blur-xl rounded-lg p-2 text-xs
            border border-white/10 opacity-0 group-hover:opacity-100 
            transition-opacity pointer-events-none z-50">
            <p className="text-white font-bold mb-1">
              {dayData.workouts.length} {dayData.workouts.length === 1 ? 'treino' : 'treinos'}
            </p>
            {dayData.workouts.map((workout, index) => {
              const variant = getWorkoutVariant(workout);
              return (
                <div key={index} className="text-gray-300 text-[10px] flex justify-between">
                  <span>{variant}</span>
                  <span className="text-green-400">{workout.calories} kcal</span>
                </div>
              );
            })}
          </div>
        )}
      </button>
    );
  }

  return (
    <div className="bg-gradient-to-br from-secondary-dark/30 to-black/30 
      rounded-xl p-6 border border-white/10">
      
      <div className="flex items-center justify-between mb-6">
        <button
          onClick={goToPreviousMonth}
          className="w-10 h-10 rounded-xl bg-white/10 text-white 
            hover:bg-white/20 hover:scale-110 transition-all"
          title="Mês anterior"
        >
          <i className="fas fa-chevron-left"></i>
        </button>
        
        <h3 className="text-2xl font-bold text-white">
          {months[currentMonth]} {currentYear}
        </h3>
        
        <button
          onClick={goToNextMonth}
          disabled={!canGoToNextMonth()}
          className={`w-10 h-10 rounded-xl transition-all ${
            canGoToNextMonth()
              ? 'bg-white/10 text-white hover:bg-white/20 hover:scale-110'
              : 'bg-white/5 text-gray-600 cursor-not-allowed'
          }`}
          title="Próximo mês"
        >
          <i className="fas fa-chevron-right"></i>
        </button>
      </div>

      <div className="grid grid-cols-7 gap-1 mb-2">
        {['Dom', 'Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sáb'].map((day, index) => (
          <div key={index} className="text-center text-text-secondary text-xs font-medium">
            {day}
          </div>
        ))}
      </div>

      <div className="grid grid-cols-7 gap-1">
        {days}
      </div>

      <div className="flex flex-wrap items-center justify-center gap-4 mt-6 pt-4 
        border-t border-white/10">
        <div className="flex items-center gap-2">
          <div className="w-4 h-4 rounded bg-blue-600/50 border border-blue-500"></div>
          <span className="text-text-secondary text-xs">Treino A</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-4 h-4 rounded bg-orange-600/50 border border-orange-500"></div>
          <span className="text-text-secondary text-xs">Treino B</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-4 h-4 rounded bg-emerald-600/50 border border-emerald-500"></div>
          <span className="text-text-secondary text-xs">Natação</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-4 h-4 rounded bg-purple-600/50 border border-purple-500"></div>
          <span className="text-text-secondary text-xs">Pilates</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-4 h-4 rounded bg-gray-700 border border-gray-600"></div>
          <span className="text-text-secondary text-xs">Sem treino</span>
        </div>
      </div>
    </div>
  );
};

export default YearCalendar;