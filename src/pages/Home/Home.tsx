// src/pages/Home/Home.tsx
import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { workoutService } from '../../services/supabase.service';
import { useAuth } from '../../contexts/AuthContext';

interface Workout {
  id: string;
  type: 'academia' | 'natacao' | 'pilates';
  date: string;
  duration: number;
  calories: number;
  heart_rate: number;
  details?: any;
  notes?: string;
}

interface Stats {
  totalWorkouts: number;
  totalCalories: number;
  avgHeartRate: number;
  totalHours: number;
  byType: {
    academia: number;
    natacao: number;
    pilates: number;
  };
  streak: number;
  bestDay: string;
}

const Home: React.FC = () => {
  const navigate = useNavigate();
  const { user, signOut } = useAuth();
  const [workouts, setWorkouts] = useState<Workout[]>([]);
  const [stats, setStats] = useState<Stats | null>(null);
  const [recentWorkouts, setRecentWorkouts] = useState<Workout[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadStats();
  }, []);

  const loadStats = async () => {
    try {
      const data = await workoutService.getAll();
      setWorkouts(data);
      
      const totalWorkouts = data.length;
      const totalCalories = data.reduce((sum: number, w: Workout) => sum + w.calories, 0);
      const avgHeartRate = data.length > 0 
        ? Math.round(data.reduce((sum: number, w: Workout) => sum + w.heart_rate, 0) / data.length) 
        : 0;
      const totalHours = Math.round(data.reduce((sum: number, w: Workout) => sum + w.duration, 0) / 3600);
      
      const byType = {
        academia: data.filter((w: Workout) => w.type === 'academia').length,
        natacao: data.filter((w: Workout) => w.type === 'natacao').length,
        pilates: data.filter((w: Workout) => w.type === 'pilates').length
      };

      const dateStrings = data.map((w: Workout) => new Date(w.date).toLocaleDateString());
      const uniqueDates = dateStrings.filter((value, index, self) => self.indexOf(value) === index);
      uniqueDates.sort((a, b) => new Date(b).getTime() - new Date(a).getTime());

      let streak = 1;
      for (let i = 0; i < uniqueDates.length - 1; i++) {
        const curr = new Date(uniqueDates[i]);
        const prev = new Date(uniqueDates[i + 1]);
        const diffDays = Math.round((curr.getTime() - prev.getTime()) / (1000 * 60 * 60 * 24));
        if (diffDays === 1) streak++;
        else break;
      }

      const caloriesByDate = data.reduce((acc: any, w: Workout) => {
        const date = new Date(w.date).toLocaleDateString();
        acc[date] = (acc[date] || 0) + w.calories;
        return acc;
      }, {});
      
      const dates = Object.keys(caloriesByDate);
      const bestDay = dates.length > 0 
        ? dates.reduce((a, b) => caloriesByDate[a] > caloriesByDate[b] ? a : b)
        : 'N/A';

      setStats({
        totalWorkouts,
        totalCalories,
        avgHeartRate,
        totalHours,
        byType,
        streak,
        bestDay
      });

      setRecentWorkouts(data.slice(0, 5));
      
    } catch (error) {
      console.error('Erro ao carregar estatísticas:', error);
    } finally {
      setLoading(false);
    }
  };

  const activities = [
    {
      id: 'academia',
      title: 'Academia',
      icon: 'fas fa-dumbbell',
      gradientFrom: '#ff4757',
      gradientTo: '#ff6b81',
      path: '/academia',
      description: 'Treinos de musculação com pesos e séries',
      stats: ['Treino A/B', 'Registro de pesos', 'Controle de séries'],
      count: stats?.byType.academia || 0
    },
    {
      id: 'natacao',
      title: 'Natação',
      icon: 'fas fa-swimmer',
      gradientFrom: '#2e86de',
      gradientTo: '#54a0ff',
      path: '/swimming',
      description: 'Treino aquático com métricas específicas',
      stats: ['Metros nadados', 'Estilos', 'Calorias aquáticas'],
      count: stats?.byType.natacao || 0
    },
    {
      id: 'pilates',
      title: 'Pilates',
      icon: 'fas fa-spa',
      gradientFrom: '#10ac84',
      gradientTo: '#1dd1a1',
      path: '/pilates',
      description: 'Exercícios de controle e flexibilidade',
      stats: ['Foco em Core', 'Respiração', 'Postura'],
      count: stats?.byType.pilates || 0
    }
  ];

  const handleCardClick = (path: string, e: React.MouseEvent) => {
    if (e.ctrlKey || e.metaKey || e.button === 1) {
      return;
    }
    e.preventDefault();
    navigate(path);
  };

  const getWorkoutTypeDisplay = (workout: Workout): string => {
    if (workout.type === 'academia') {
      const notes = workout.notes?.toLowerCase() || '';
      const details = workout.details || {};
      
      if (notes.includes('treino a') || details.workoutType === 'A') return 'Treino A';
      if (notes.includes('treino b') || details.workoutType === 'B') return 'Treino B';
      return 'Academia';
    }
    if (workout.type === 'natacao') return 'Natação';
    if (workout.type === 'pilates') return 'Pilates';
    return workout.type;
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#0A0F1C] via-[#1A1F2E] to-[#0D0F1A]">
      
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-0 -left-4 w-96 h-96 bg-accent-red/20 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-0 -right-4 w-96 h-96 bg-accent-blue/20 rounded-full blur-3xl animate-pulse delay-1000"></div>
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-accent-purple/5 rounded-full blur-3xl"></div>
      </div>

      <div className="relative z-10 container mx-auto px-4 py-8 max-w-7xl">
        
        <div className="mb-12">
          <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6 mb-8">
            <div className="flex items-center gap-4">
              <img 
                src="/logo512.png" 
                alt="Logo" 
                className="w-20 h-20 md:w-24 md:h-24 animate-float"
              />
              <div>
                <h1 className="text-3xl md:text-4xl font-black text-white font-montserrat 
                  bg-gradient-to-r from-white via-white to-accent-red bg-clip-text text-transparent">
                  TREINOS DO ELIJUNIO
                </h1>
                <p className="text-text-secondary/80 text-sm flex items-center gap-2">
                  <i className="fas fa-chart-line text-accent-green"></i>
                  Sua evolução em tempo real
                </p>
              </div>
            </div>

            <div className="flex items-center gap-3">
              {user && (
                <span className="text-text-secondary text-sm hidden md:block">
                  <i className="fas fa-user-circle mr-1"></i>
                  {user.email}
                </span>
              )}
              
              <Link
                to="/history"
                className="group relative px-6 py-3 bg-gradient-to-r from-accent-red to-accent-purple 
                  rounded-xl text-white font-bold flex items-center gap-3 overflow-hidden
                  hover:shadow-2xl hover:shadow-accent-red/30 transition-all duration-300
                  before:absolute before:inset-0 before:bg-white/20 before:translate-x-[-100%] 
                  before:hover:translate-x-[100%] before:transition-transform before:duration-700"
              >
                <i className="fas fa-history group-hover:rotate-12 transition-transform"></i>
                <span>Ver Histórico</span>
                <div className="absolute -top-1 -right-1 w-3 h-3 bg-white rounded-full animate-ping"></div>
                <div className="absolute -top-1 -right-1 w-3 h-3 bg-white rounded-full"></div>
              </Link>
              
              <button
                onClick={signOut}
                className="w-12 h-12 rounded-xl bg-white/5 border border-white/10 
                  text-white hover:bg-white/10 transition-all group"
                title="Sair"
              >
                <i className="fas fa-sign-out-alt group-hover:scale-110 transition-transform"></i>
              </button>
            </div>
          </div>
        </div>

        {workouts.length > 0 && (
          <div className="relative mb-12 overflow-hidden rounded-3xl">
            <div className="absolute inset-0 bg-gradient-to-r from-accent-red/20 via-accent-purple/20 to-accent-blue/20 
              animate-pulse"></div>
            <div className="relative bg-gradient-to-br from-white/5 to-white/0 backdrop-blur-xl 
              rounded-3xl p-8 border border-white/10">
              
              <div className="flex items-center gap-3 mb-4">
                <i className="fas fa-sun text-yellow-400 text-3xl md:text-4xl animate-spin-slow"></i>
                <span className="text-white/80 text-xl md:text-2xl font-medium">
                  {new Date().getHours() < 12 ? 'Bom dia!' : 
                  new Date().getHours() < 18 ? 'Boa tarde!' : 'Boa noite!'}
                </span>
              </div>
                    
              <div className="bg-white/5 rounded-xl p-6 border border-white/10">
                <p className="text-text-secondary text-base md:text-lg mb-4 flex items-center gap-2">
                  <i className="fas fa-trophy text-yellow-500 text-xl md:text-2xl"></i>
                  SEU MELHOR DESEMPENHO
                </p>
                
                {(() => {
                  const bestWorkout = workouts.reduce((best: Workout, current: Workout) => {
                    return (current.calories > (best?.calories || 0)) ? current : best;
                  }, workouts[0]);
                  
                  if (!bestWorkout) return null;
                  
                  const workoutType = getWorkoutTypeDisplay(bestWorkout);
                  
                  const durationMinutes = Math.floor(bestWorkout.duration / 60);
                  const durationSeconds = bestWorkout.duration % 60;
                  
                  return (
                    <div className="flex flex-col gap-2">
                      <p className="text-white text-xl md:text-2xl font-bold">
                        Seu melhor dia foi{' '}
                        <span className="text-accent-green">
                          {new Date(bestWorkout.date).toLocaleDateString('pt-BR')}
                        </span>
                      </p>
                      <p className="text-text-secondary text-base md:text-lg">
                        com{' '}
                        <span className="text-accent-red font-bold">
                          {workoutType}
                        </span>{' '}
                        em{' '}
                        <span className="text-accent-blue font-bold">
                          {durationMinutes} min{durationSeconds > 0 ? ` e ${durationSeconds} seg` : ''}
                        </span>
                        , queimando{' '}
                        <span className="text-accent-green font-bold">
                          {bestWorkout.calories} kcal
                        </span>
                        {bestWorkout.heart_rate > 0 && (
                          <> com FC média de <span className="text-accent-blue font-bold">{bestWorkout.heart_rate} bpm</span></>
                        )}
                        !
                      </p>
                    </div>
                  );
                })()}
              </div>             
            </div>
          </div>
        )}

        <div className="mb-12">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold text-white flex items-center gap-3">
              <i className="fas fa-dumbbell text-accent-red"></i>
              Atividades Disponíveis
            </h2>
            <div className="h-px flex-1 bg-gradient-to-r from-transparent via-white/20 to-transparent mx-4"></div>
            <span className="text-text-secondary text-sm">
              {stats?.totalWorkouts || 0} treinos realizados
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {activities.map((activity, index) => (
              <Link
                key={activity.id}
                to={activity.path}
                onClick={(e) => handleCardClick(activity.path, e)}
                className="group relative overflow-hidden rounded-2xl bg-gradient-to-br 
                  from-secondary-dark/30 to-black/50 border border-white/10 
                  hover:scale-[1.02] hover:shadow-2xl transition-all duration-500
                  before:absolute before:inset-0 before:bg-gradient-to-r 
                  before:from-transparent before:via-white/5 before:to-transparent 
                  before:translate-x-[-200%] before:hover:translate-x-[200%] 
                  before:transition-transform before:duration-1000"
                style={{
                  animationDelay: `${index * 150}ms`,
                  animation: 'fadeInUp 0.6s ease-out forwards',
                  opacity: 0,
                  transform: 'translateY(20px)'
                }}
              >
                <div className="absolute inset-0 opacity-0 group-hover:opacity-100 
                  transition-opacity duration-700"
                  style={{
                    background: `radial-gradient(circle at 50% 50%, ${activity.gradientFrom}20, transparent 70%)`
                  }}
                />

                <div className="relative p-6">
                  <div className="absolute top-4 right-4">
                    <div className="relative">
                      <div className="absolute inset-0 bg-white/20 rounded-full blur-md"></div>
                      <div className="relative px-3 py-1 bg-white/10 backdrop-blur-sm 
                        rounded-full border border-white/20 text-sm font-bold text-white">
                        {activity.count} treinos
                      </div>
                    </div>
                  </div>

                  <div className="relative mb-6">
                    <div className="absolute inset-0 bg-gradient-to-br from-white/20 to-transparent 
                      rounded-2xl blur-xl group-hover:blur-2xl transition-all"
                      style={{ background: `linear-gradient(135deg, ${activity.gradientFrom}40, ${activity.gradientTo}40)` }}
                    />
                    <div className="relative w-20 h-20 rounded-2xl flex items-center justify-center
                      group-hover:scale-110 group-hover:rotate-3 transition-all duration-300"
                      style={{
                        background: `linear-gradient(135deg, ${activity.gradientFrom}, ${activity.gradientTo})`
                      }}
                    >
                      <i className={`${activity.icon} text-3xl text-white`}></i>
                    </div>
                  </div>

                  <h3 className="text-2xl font-bold text-white mb-2 group-hover:translate-x-1 transition-transform">
                    {activity.title}
                  </h3>
                  <p className="text-text-secondary text-sm mb-4">
                    {activity.description}
                  </p>

                  <ul className="space-y-2 mb-6">
                    {activity.stats.map((stat, idx) => (
                      <li key={idx} className="flex items-center gap-2 text-text-secondary/80 text-sm">
                        <i className="fas fa-check-circle text-accent-green text-xs"></i>
                        {stat}
                      </li>
                    ))}
                  </ul>

                  <div className="relative">
                    <div className="absolute inset-0 bg-gradient-to-r from-white/0 via-white/20 to-white/0 
                      translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-1000"
                      style={{
                        background: `linear-gradient(90deg, transparent, ${activity.gradientFrom}40, transparent)`
                      }}
                    />
                    <div className="relative w-full py-3 rounded-xl font-bold
                      flex items-center justify-center gap-2 group-hover:gap-3
                      bg-gradient-to-r text-white transition-all duration-300"
                      style={{
                        background: `linear-gradient(135deg, ${activity.gradientFrom}, ${activity.gradientTo})`
                      }}
                    >
                      <span>Iniciar {activity.title}</span>
                      <i className="fas fa-arrow-right group-hover:translate-x-1 transition-transform"></i>
                    </div>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>

        {recentWorkouts.length > 0 && (
          <div className="bg-gradient-to-br from-secondary-dark/30 to-black/30 
            rounded-2xl p-6 border border-white/10">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-xl font-bold text-white flex items-center gap-2">
                <i className="fas fa-history text-accent-purple"></i>
                Últimas Atividades
              </h3>
              <Link to="/history" className="text-sm text-accent-blue hover:text-white transition-colors 
                flex items-center gap-1 group">
                Ver todos
                <i className="fas fa-arrow-right group-hover:translate-x-1 transition-transform"></i>
              </Link>
            </div>

            <div className="space-y-3">
              {recentWorkouts.map((workout) => (
                <div key={workout.id} 
                  className="flex items-center justify-between p-4 bg-white/5 rounded-xl
                    hover:bg-white/10 transition-all group cursor-pointer"
                >
                  <div className="flex items-center gap-4">
                    <div className={`w-10 h-10 rounded-xl flex items-center justify-center
                      ${workout.type === 'academia' ? 'bg-red-500/20 text-red-400' : 
                        workout.type === 'natacao' ? 'bg-blue-500/20 text-blue-400' : 
                        'bg-green-500/20 text-green-400'}`}
                    >
                      <i className={`fas fa-${
                        workout.type === 'academia' ? 'dumbbell' : 
                        workout.type === 'natacao' ? 'swimmer' : 'spa'
                      }`}></i>
                    </div>
                    <div>
                      <p className="text-white font-medium">
                        {workout.type === 'academia' ? 'Treino de Academia' : 
                         workout.type === 'natacao' ? 'Natação' : 'Pilates'}
                      </p>
                      <p className="text-text-secondary text-xs">
                        {new Date(workout.date).toLocaleDateString('pt-BR', {
                          day: '2-digit',
                          month: 'short',
                          hour: '2-digit',
                          minute: '2-digit'
                        })}
                      </p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-accent-green font-bold">{workout.calories} kcal</p>
                    <p className="text-text-secondary text-xs">{workout.heart_rate} bpm</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        <footer className="mt-12 text-center">
          <p className="text-text-muted/50 text-xs mt-4">
            © 2026 Treinos do Elijunio
          </p>
        </footer>
      </div>

      <style>{`
        @keyframes fadeInUp {
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        @keyframes spin {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
      `}</style>
    </div>
  );
};

export default Home;