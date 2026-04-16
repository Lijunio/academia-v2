// src/pages/History/History.tsx
import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  ArcElement,
  Title,
  Tooltip,
  Legend,
  Filler
} from 'chart.js';
import { Line, Doughnut } from 'react-chartjs-2';
import { workoutService } from '../../services/supabase.service';
import YearCalendar, { Workout } from '../../components/YearCalendar';
import WorkoutFullReportModal from '../../components/common/Modal/WorkoutFullReportModal';
import ChartCarousel from '../../components/ChartCarousel';
import ExpandedCaloriesChart from '../../components/ExpandedCaloriesChart';
import ChartDataLabels from 'chartjs-plugin-datalabels';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  ArcElement,
  Title,
  Tooltip,
  Legend,
  Filler,
  ChartDataLabels
);

interface Stats {
  totalWorkouts: number;
  totalCalories: number;
  avgHeartRate: number;
  totalMinutes: number;
  avgCaloriesPerWorkout: number;
  bestStreak: number;
  currentStreak: number;
  favoriteActivity: string;
  bestDay: { date: string; calories: number; type?: string; workoutType?: string };
}

const History: React.FC = () => {
  const [workouts, setWorkouts] = useState<Workout[]>([]);
  const [filteredWorkouts, setFilteredWorkouts] = useState<Workout[]>([]);
  const [stats, setStats] = useState<Stats | null>(null);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<'all' | 'academia' | 'natacao' | 'pilates' | 'esteira' | 'spinning'>('all');
  const [timeRange, setTimeRange] = useState<'week' | 'month' | 'year' | 'all'>('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [sortBy, setSortBy] = useState<'date' | 'calories' | 'duration'>('date');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc');
  const [selectedWorkout, setSelectedWorkout] = useState<Workout | null>(null);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [workoutToDelete, setWorkoutToDelete] = useState<string | null>(null);
  const [showFullReport, setShowFullReport] = useState(false);
  const [showExpandedChart, setShowExpandedChart] = useState(false);
  const [isMobileFilters, setIsMobileFilters] = useState(false);

  useEffect(() => {
    loadWorkouts();
    
    const checkMobile = () => {
      setIsMobileFilters(window.innerWidth < 768);
    };
    
    checkMobile();
    window.addEventListener('resize', checkMobile);
    
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  // ✅ NOVO: Verificar se tem um treino para selecionar vindo da Home
  useEffect(() => {
    const selectedId = sessionStorage.getItem('selectedWorkoutId');
    if (selectedId && workouts.length > 0) {
      const workout = workouts.find(w => w.id === selectedId);
      if (workout) {
        setSelectedWorkout(workout);
        // Limpar o storage para não selecionar novamente
        sessionStorage.removeItem('selectedWorkoutId');
        
        // Rolar até o card (opcional)
        setTimeout(() => {
          document.getElementById('workouts-list')?.scrollIntoView({ 
            behavior: 'smooth' 
          });
        }, 100);
      }
    }
  }, [workouts]);

  useEffect(() => {
    filterAndSortWorkouts();
  }, [workouts, filter, timeRange, searchTerm, sortBy, sortOrder]);

  const loadWorkouts = async () => {
    try {
      setLoading(true);
      const data = await workoutService.getAll();
      setWorkouts(data);
    } catch (error) {
      console.error('Erro ao carregar treinos:', error);
    } finally {
      setLoading(false);
    }
  };

  const filterAndSortWorkouts = () => {
    let filtered = [...workouts];

    if (filter !== 'all') {
      filtered = filtered.filter(w => w.type === filter);
    }

    const now = new Date();
    if (timeRange !== 'all') {
      const cutoff = new Date();
      if (timeRange === 'week') cutoff.setDate(now.getDate() - 7);
      if (timeRange === 'month') cutoff.setMonth(now.getMonth() - 1);
      if (timeRange === 'year') cutoff.setFullYear(now.getFullYear() - 1);
      
      filtered = filtered.filter(w => new Date(w.date) >= cutoff);
    }

    if (searchTerm) {
      filtered = filtered.filter(w => 
        w.notes?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        w.type.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    filtered.sort((a, b) => {
      let comparison = 0;
      if (sortBy === 'date') {
        comparison = new Date(a.date).getTime() - new Date(b.date).getTime();
      } else if (sortBy === 'calories') {
        comparison = a.calories - b.calories;
      } else if (sortBy === 'duration') {
        comparison = a.duration - b.duration;
      }
      return sortOrder === 'desc' ? -comparison : comparison;
    });

    setFilteredWorkouts(filtered);
    calculateStats(filtered);
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
    if (workout.type === 'esteira') return 'Esteira';
    if (workout.type === 'spinning') return 'Spinning';
    return workout.type;
  };

  const getWorkoutTypeColor = (type: string, subType?: string): string => {
    if (type === 'academia') {
      if (subType === 'Treino A') return 'bg-blue-500/20 text-blue-400';
      if (subType === 'Treino B') return 'bg-red-500/20 text-red-400';
      return 'bg-purple-500/20 text-purple-400';
    }
    if (type === 'natacao') return 'bg-emerald-500/20 text-emerald-400';
    if (type === 'pilates') return 'bg-amber-500/20 text-amber-400';
    if (type === 'esteira') return 'bg-orange-500/20 text-orange-400';
    if (type === 'spinning') return 'bg-cyan-500/20 text-cyan-400';
    return 'bg-gray-500/20 text-gray-400';
  };

  const calculateStats = (data: Workout[]) => {
    if (data.length === 0) {
      setStats(null);
      return;
    }

    const totalWorkouts = data.length;
    const totalCalories = data.reduce((sum, w) => sum + w.calories, 0);
    const avgHeartRate = Math.round(data.reduce((sum, w) => sum + w.heart_rate, 0) / data.length);

    const totalSeconds = data.reduce((sum, w) => sum + w.duration, 0);
    const totalMinutes = Math.round(totalSeconds / 60);
    
    const avgCaloriesPerWorkout = Math.round(totalCalories / totalWorkouts);

    const typeCount = data.reduce((acc, w) => {
      acc[w.type] = (acc[w.type] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);
    
    const favoriteActivity = Object.entries(typeCount).reduce((a, b) => 
      b[1] > (typeCount[a] || 0) ? b[0] : a, 'academia'
    );

    const caloriesByDate = data.reduce((acc, w) => {
      const date = new Date(w.date).toLocaleDateString();
      if (!acc[date]) {
        acc[date] = { 
          calories: 0, 
          workouts: [] 
        };
      }
      acc[date].calories += w.calories;
      acc[date].workouts.push(w);
      return acc;
    }, {} as Record<string, { calories: number; workouts: Workout[] }>);

    const dates = Object.keys(caloriesByDate);
    let bestDate = dates.length > 0 
      ? dates.reduce((a, b) => caloriesByDate[a].calories > caloriesByDate[b].calories ? a : b)
      : 'N/A';

    const bestDayWorkouts = caloriesByDate[bestDate]?.workouts || [];
    const bestDayType = bestDayWorkouts.length === 1 
      ? getWorkoutTypeDisplay(bestDayWorkouts[0])
      : 'Múltiplos';

    const dateStrings = data.map(w => new Date(w.date).toLocaleDateString());
    const uniqueDates = dateStrings.filter((value, index, self) => self.indexOf(value) === index);
    uniqueDates.sort((a, b) => new Date(b).getTime() - new Date(a).getTime());

    let currentStreak = 1;
    for (let i = 0; i < uniqueDates.length - 1; i++) {
      const curr = new Date(uniqueDates[i]);
      const prev = new Date(uniqueDates[i + 1]);
      const diffDays = Math.round((curr.getTime() - prev.getTime()) / (1000 * 60 * 60 * 24));
      if (diffDays === 1) currentStreak++;
      else break;
    }

    let maxStreak = 1;
    let tempStreak = 1;
    for (let i = 0; i < uniqueDates.length - 1; i++) {
      const curr = new Date(uniqueDates[i]);
      const prev = new Date(uniqueDates[i + 1]);
      const diffDays = Math.round((curr.getTime() - prev.getTime()) / (1000 * 60 * 60 * 24));
      if (diffDays === 1) {
        tempStreak++;
        maxStreak = Math.max(maxStreak, tempStreak);
      } else {
        tempStreak = 1;
      }
    }

    setStats({
      totalWorkouts,
      totalCalories,
      avgHeartRate,
      totalMinutes,
      avgCaloriesPerWorkout,
      bestStreak: maxStreak,
      currentStreak,
      favoriteActivity,
      bestDay: {
        date: bestDate,
        calories: caloriesByDate[bestDate]?.calories || 0,
        type: bestDayType
      }
    });
  };

  const handleDelete = async (id: string) => {
    try {
      await workoutService.delete(id);
      await loadWorkouts();
      setShowDeleteConfirm(false);
      setWorkoutToDelete(null);
    } catch (error) {
      console.error('Erro ao deletar:', error);
    }
  };

  const getActivityIcon = (type: string) => {
    switch (type) {
      case 'academia': return 'dumbbell';
      case 'natacao': return 'swimmer';
      case 'pilates': return 'spa';
      case 'esteira': return 'person-walking';
      case 'spinning': return 'bicycle';
      default: return 'question';
    }
  };

  const getActivityBgColor = (type: string) => {
    switch (type) {
      case 'academia': return 'bg-red-500/20 text-red-400';
      case 'natacao': return 'bg-blue-500/20 text-blue-400';
      case 'pilates': return 'bg-green-500/20 text-green-400';
      case 'esteira': return 'bg-orange-500/20 text-orange-400';
      case 'spinning': return 'bg-cyan-500/20 text-cyan-400';
      default: return 'bg-gray-500/20 text-gray-400';
    }
  };

  const prepareChartData = () => {
    const last30Days = [...Array(30)].map((_, i) => {
      const d = new Date();
      d.setDate(d.getDate() - i);
      return d.toLocaleDateString();
    }).reverse();

    const caloriesByDay = last30Days.map(date => {
      return filteredWorkouts
        .filter(w => new Date(w.date).toLocaleDateString() === date)
        .reduce((sum, w) => sum + w.calories, 0);
    });

    return { labels: last30Days, calories: caloriesByDay };
  };

  const chartData = prepareChartData();

  const caloriesChart = {
    labels: chartData.labels,
    datasets: [
      {
        label: 'Calorias',
        data: chartData.calories,
        borderColor: 'rgb(255, 99, 132)',
        backgroundColor: 'rgba(255, 99, 132, 0.1)',
        fill: true,
        tension: 0.4
      }
    ]
  };

  // Separar Academia em Treino A e Treino B
  const treinoACount = filteredWorkouts.filter(w => 
    w.type === 'academia' && 
    (w.notes?.toLowerCase().includes('treino a') || w.details?.workoutType === 'A')
  ).length;

  const treinoBCount = filteredWorkouts.filter(w => 
    w.type === 'academia' && 
    (w.notes?.toLowerCase().includes('treino b') || w.details?.workoutType === 'B')
  ).length;

  const academiaSemTipoCount = filteredWorkouts.filter(w => 
    w.type === 'academia' && 
    !w.notes?.toLowerCase().includes('treino a') && 
    !w.notes?.toLowerCase().includes('treino b') && 
    w.details?.workoutType !== 'A' && 
    w.details?.workoutType !== 'B'
  ).length;

  const treinoAFinal = treinoACount + academiaSemTipoCount;
  
  const natacaoCount = filteredWorkouts.filter(w => w.type === 'natacao').length;
  const pilatesCount = filteredWorkouts.filter(w => w.type === 'pilates').length;
  const esteiraCount = filteredWorkouts.filter(w => w.type === 'esteira').length;
  const spinningCount = filteredWorkouts.filter(w => w.type === 'spinning').length;

  // Para o gráfico, agrupar esteira e spinning como "Aeróbico"
  const aerobicoCount = esteiraCount + spinningCount;

  const typeDistribution = {
    labels: ['Treino A', 'Treino B', 'Natação', 'Pilates', 'Aeróbico'],
    datasets: [
      {
        data: [treinoAFinal, treinoBCount, natacaoCount, pilatesCount, aerobicoCount],
        backgroundColor: [
          'rgba(59, 130, 246, 0.8)',   // Azul - Treino A
          'rgba(239, 68, 68, 0.8)',    // Vermelho - Treino B
          'rgba(16, 185, 129, 0.8)',   // Verde - Natação
          'rgba(245, 158, 11, 0.8)',   // Laranja - Pilates
          'rgba(147, 51, 234, 0.8)'    // Roxo - Aeróbico (esteira + spinning)
        ],
        borderColor: [
          'rgba(59, 130, 246, 1)',
          'rgba(239, 68, 68, 1)',
          'rgba(16, 185, 129, 1)',
          'rgba(245, 158, 11, 1)',
          'rgba(147, 51, 234, 1)'
        ],
        borderWidth: 1
      }
    ]
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-primary-dark via-secondary-dark to-black 
        flex items-center justify-center">
        <div className="text-center">
          <div className="relative">
            <div className="w-20 h-20 border-4 border-accent-red/20 border-t-accent-red rounded-full animate-spin"></div>
            <div className="absolute inset-0 flex items-center justify-center">
              <i className="fas fa-dumbbell text-accent-red animate-pulse"></i>
            </div>
          </div>
          <h2 className="text-xl font-bold text-white mt-4">Carregando histórico...</h2>
          <p className="text-text-secondary">Buscando seus dados na nuvem</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary-dark via-secondary-dark to-black">
      
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-20 left-20 w-72 h-72 bg-accent-red/10 rounded-full blur-3xl"></div>
        <div className="absolute bottom-20 right-20 w-72 h-72 bg-accent-blue/10 rounded-full blur-3xl"></div>
      </div>

      <div className="relative z-10 container mx-auto px-4 py-8 max-w-7xl">
        
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-4">
            <Link
              to="/"
              className="w-12 h-12 rounded-xl bg-white/5 border border-white/10 
                flex items-center justify-center text-white hover:bg-white/10 
                transition-all hover:scale-110 group"
            >
              <i className="fas fa-arrow-left group-hover:-translate-x-1 transition-transform"></i>
            </Link>
            <div>
              <h1 className="text-2xl sm:text-3xl md:text-4xl font-black text-white font-montserrat whitespace-nowrap overflow-hidden text-ellipsis">
                Histórico <span className="bg-gradient-to-r from-accent-red to-accent-purple bg-clip-text text-transparent">Completo</span>
              </h1>
              <p className="text-text-secondary">
                {filteredWorkouts.length} treinos encontrados
              </p>
            </div>
          </div>

          <button
            onClick={loadWorkouts}
            className="px-4 py-2 bg-white/5 rounded-xl border border-white/10 
              text-white hover:bg-white/10 transition-all group"
            title="Atualizar dados"
          >
            <i className="fas fa-sync-alt group-hover:rotate-180 transition-transform duration-500"></i>
          </button>
        </div>

        {stats && (
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
            <div className="bg-gradient-to-br from-secondary-dark/50 to-black/50 rounded-xl p-4 
              border border-white/10 hover:border-accent-red/30 transition-all group">
              <p className="text-text-secondary text-xs mb-1">Total</p>
              <p className="text-2xl font-bold text-white group-hover:scale-105 transition-transform">
                {stats.totalWorkouts}
              </p>
              <p className="text-xs text-accent-green">treinos</p>
            </div>
            
            <div className="bg-gradient-to-br from-secondary-dark/50 to-black/50 rounded-xl p-4 
              border border-white/10 hover:border-accent-blue/30 transition-all group">
              <p className="text-text-secondary text-xs mb-1">FC Média</p>
              <p className="text-2xl font-bold text-white group-hover:scale-105 transition-transform">
                {stats.avgHeartRate}
              </p>
              <p className="text-xs text-accent-blue">bpm</p>
            </div>
            
            <div className="bg-gradient-to-br from-secondary-dark/50 to-black/50 rounded-xl p-4 
              border border-white/10 hover:border-accent-green/30 transition-all group">
              <p className="text-text-secondary text-xs mb-1">Minutos</p>
              <p className="text-2xl font-bold text-white group-hover:scale-105 transition-transform">
                {stats.totalMinutes}
              </p>
              <p className="text-xs text-accent-green">totais</p>
            </div>

            <div className="bg-gradient-to-br from-secondary-dark/50 to-black/50 rounded-xl p-4 
              border border-white/10 hover:border-purple-500/30 transition-all group">
              <p className="text-text-secondary text-xs mb-1">Média Cal</p>
              <p className="text-2xl font-bold text-white group-hover:scale-105 transition-transform">
                {stats.avgCaloriesPerWorkout}
              </p>
              <p className="text-xs text-purple-500">kcal/treino</p>
            </div>
          </div>
        )}

        <div className="mb-12">
          <h2 className="text-2xl font-bold text-white mb-6 flex items-center gap-3">
            <i className="fas fa-calendar-alt text-accent-red"></i>
            Calendário de Treinos
          </h2>
          <YearCalendar 
            workouts={filteredWorkouts} 
            onWorkoutClick={(workout) => setSelectedWorkout(workout)}
          />
        </div>

        <ChartCarousel>
          {/* Card de Calorias - Expansível */}
          <div 
            className="bg-gradient-to-br from-secondary-dark/50 to-black/50 rounded-2xl p-6 
              border border-white/10 h-full cursor-pointer hover:scale-[1.02] transition-all group"
            onClick={() => setShowExpandedChart(true)}
          >
            <h3 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
              <i className="fas fa-fire text-accent-red"></i>
              Evolução de Calorias
              <span className="ml-auto text-xs bg-accent-blue/20 text-accent-blue px-2 py-1 rounded-full opacity-0 group-hover:opacity-100 transition-opacity">
                <i className="fas fa-expand-alt mr-1"></i>
                Expandir
              </span>
            </h3>
            <div className="h-64">
              <Line 
                key="calories-chart"
                data={caloriesChart}
                options={{
                  responsive: true,
                  maintainAspectRatio: false,
                  scales: {
                    y: {
                      grid: { color: 'rgba(255,255,255,0.1)' },
                      ticks: { color: 'white' }
                    },
                    x: {
                      grid: { display: false },
                      ticks: { color: 'white', maxRotation: 45, maxTicksLimit: 5 }
                    }
                  },
                  plugins: {
                    legend: { display: false },
                    tooltip: { backgroundColor: '#1A1F2E' }
                  }
                }}
              />
            </div>
          </div>

          {/* Card de Distribuição por Tipo */}
          <div className="bg-gradient-to-br from-secondary-dark/50 to-black/50 rounded-2xl p-6 
            border border-white/10 h-full">
            <h3 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
              <i className="fas fa-chart-pie text-accent-purple"></i>
              Distribuição por Tipo
            </h3>
            <div className="h-64">
              <Doughnut 
                key="distribution-chart"
                data={typeDistribution}
                options={{
                  responsive: true,
                  maintainAspectRatio: false,
                  plugins: {
                    legend: {
                      position: 'bottom',
                      labels: { 
                        color: 'white',
                        font: {
                          size: window.innerWidth < 640 ? 10 : 12
                        }
                      }
                    },
                    tooltip: {
                      callbacks: {
                        label: (context) => {
                          const label = context.label || '';
                          const value = context.raw as number;
                          const total = (context.dataset.data as number[]).reduce((a, b) => a + b, 0);
                          const percentage = total > 0 ? Math.round((value / total) * 100) : 0;
                          return `${label}: ${value} treinos (${percentage}%)`;
                        }
                      }
                    },
                    datalabels: {
                      display: true,
                      color: 'white',
                      font: {
                        weight: 'bold',
                        size: window.innerWidth < 640 ? 10 : 12
                      },
                      formatter: (value: number, context: any) => {
                        const total = (context.dataset.data as number[]).reduce((a, b) => a + b, 0);
                        const percentage = total > 0 ? Math.round((value / total) * 100) : 0;
                        return percentage > 5 ? `${percentage}%` : '';
                      }
                    }
                  },
                  onClick: (event, elements) => {
                    if (elements.length > 0) {
                      const element = elements[0];
                      const index = element.index;
                      
                      if (index === 0) setFilter('academia');
                      else if (index === 1) setFilter('academia');
                      else if (index === 2) setFilter('natacao');
                      else if (index === 3) setFilter('pilates');
                      else if (index === 4) setFilter('all'); // Aeróbico
                      
                      document.getElementById('workouts-list')?.scrollIntoView({ behavior: 'smooth' });
                    }
                  }
                }}
              />
            </div>
          </div>
        </ChartCarousel>

        {stats && (
          <div className="bg-gradient-to-br from-secondary-dark/50 to-black/50 
            rounded-2xl p-8 border border-white/10 mb-8 text-center">
            
            <h3 className="best-day-title font-bold text-white mb-6 flex items-center justify-center gap-3">
              <i className="fas fa-trophy text-yellow-500 best-day-trophy"></i>
              Melhor Dia
            </h3>
            
            <div className="flex flex-col items-center justify-center gap-3">
              <p className="best-day-date font-bold text-white/90">
                {stats.bestDay.date}
              </p>
              
              <div className="flex items-center gap-2">
                <span className="best-day-calories font-bold text-accent-green">
                  {stats.bestDay.calories}
                </span>
                <span className="best-day-kcal text-text-secondary">kcal</span>
              </div>
              
              <span className={`best-day-badge rounded-full font-bold mt-1
                ${stats.bestDay.type === 'Treino A' ? 'bg-blue-500/20 text-blue-400' :
                  stats.bestDay.type === 'Treino B' ? 'bg-red-500/20 text-red-400' :
                  stats.bestDay.type === 'Natação' ? 'bg-emerald-500/20 text-emerald-400' :
                  stats.bestDay.type === 'Pilates' ? 'bg-amber-500/20 text-amber-400' :
                  stats.bestDay.type === 'Esteira' ? 'bg-orange-500/20 text-orange-400' :
                  stats.bestDay.type === 'Spinning' ? 'bg-cyan-500/20 text-cyan-400' :
                  stats.bestDay.type === 'Múltiplos' ? 'bg-purple-500/20 text-purple-400' :
                  'bg-gray-500/20 text-gray-400'}`}>
                <i className={`fas fa-${stats.bestDay.type === 'Treino A' || stats.bestDay.type === 'Treino B' ? 'dumbbell' : 
                  stats.bestDay.type === 'Natação' ? 'swimmer' :
                  stats.bestDay.type === 'Pilates' ? 'spa' :
                  stats.bestDay.type === 'Esteira' ? 'person-walking' :
                  stats.bestDay.type === 'Spinning' ? 'bicycle' : 'trophy'} mr-1`}></i>
                {stats.bestDay.type}
              </span>
            </div>
          </div>
        )}

        <div className="bg-gradient-to-br from-secondary-dark/50 to-black/50 rounded-2xl p-6 
          border border-white/10 mb-8">
          
          <div className="mb-4">
            <input
              type="text"
              placeholder="Buscar treinos..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 
                text-white placeholder-text-secondary focus:outline-none focus:border-accent-red"
            />
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            <select
              value={filter}
              onChange={(e) => setFilter(e.target.value as any)}
              className="bg-white/5 border border-white/10 rounded-xl px-3 py-3 text-white
                focus:outline-none focus:border-accent-red text-sm"
            >
              <option value="all">Todos</option>
              <option value="academia">Academia</option>
              <option value="natacao">Natação</option>
              <option value="pilates">Pilates</option>
              <option value="esteira">Esteira</option>
              <option value="spinning">Spinning</option>
            </select>

            <select
              value={timeRange}
              onChange={(e) => setTimeRange(e.target.value as any)}
              className="bg-white/5 border border-white/10 rounded-xl px-3 py-3 text-white
                focus:outline-none focus:border-accent-red text-sm"
            >
              <option value="week">7 dias</option>
              <option value="month">30 dias</option>
              <option value="year">1 ano</option>
              <option value="all">Todo</option>
            </select>

            <select
              value={`${sortBy}-${sortOrder}`}
              onChange={(e) => {
                const [newSortBy, newSortOrder] = e.target.value.split('-');
                setSortBy(newSortBy as any);
                setSortOrder(newSortOrder as any);
              }}
              className="col-span-2 md:col-span-1 bg-white/5 border border-white/10 rounded-xl px-3 py-3 text-white
                focus:outline-none focus:border-accent-red text-sm"
            >
              <option value="date-desc">Mais recentes</option>
              <option value="date-asc">Mais antigos</option>
              <option value="calories-desc">🔥 Mais kcal</option>
              <option value="calories-asc">🔥 Menos kcal</option>
              <option value="duration-desc">⏱️ Mais longo</option>
              <option value="duration-asc">⏱️ Mais curto</option>
            </select>
          </div>

          {(filter !== 'all' || timeRange !== 'month' || searchTerm) && (
            <div className="mt-3 flex items-center gap-2 text-xs text-accent-red">
              <i className="fas fa-filter"></i>
              <span>Filtros ativos</span>
              <button 
                onClick={() => {
                  setFilter('all');
                  setTimeRange('month');
                  setSearchTerm('');
                  setSortBy('date');
                  setSortOrder('desc');
                }}
                className="ml-auto text-white/50 hover:text-white transition-colors"
              >
                Limpar todos
              </button>
            </div>
          )}
        </div>

        <div id="workouts-list" className="space-y-4">
          {filteredWorkouts.length === 0 ? (
            <div className="text-center py-16 bg-gradient-to-br from-secondary-dark/30 to-black/30 
              rounded-2xl border border-white/10">
              <i className="fas fa-history text-5xl text-text-secondary mb-4"></i>
              <h3 className="text-xl font-bold text-white mb-2">Nenhum treino encontrado</h3>
              <p className="text-text-secondary">Comece a registrar seus treinos para ver o histórico</p>
              <Link
                to="/"
                className="inline-block mt-6 px-6 py-3 bg-gradient-to-r from-accent-red to-accent-purple 
                  text-white rounded-xl font-bold hover:opacity-90 transition-all"
              >
                Ir para Home
              </Link>
            </div>
          ) : (
            filteredWorkouts.map((workout) => {
              const workoutTypeDisplay = getWorkoutTypeDisplay(workout);
              const typeColor = getWorkoutTypeColor(workout.type, workoutTypeDisplay);
              
              return (
                <div
                  key={workout.id}
                  className="group bg-gradient-to-br from-secondary-dark/30 to-black/30 
                    rounded-xl p-4 md:p-6 border border-white/10 hover:border-accent-red/30 
                    transition-all hover:scale-[1.01] cursor-pointer"
                  onClick={() => setSelectedWorkout(workout)}
                >
                  <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
                    <div className="flex items-center gap-3 md:gap-4 flex-1 w-full">
                      <div className={`w-12 h-12 md:w-14 md:h-14 rounded-xl flex items-center justify-center
                        ${getActivityBgColor(workout.type)} transition-all group-hover:scale-110 flex-shrink-0`}>
                        <i className={`fas fa-${getActivityIcon(workout.type)} text-xl md:text-2xl`}></i>
                      </div>

                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-1 flex-wrap">
                          <h3 className="text-base md:text-lg font-bold text-white truncate">
                            {workout.type === 'academia' ? 'Treino de Academia' : 
                             workout.type === 'natacao' ? 'Natação' : 
                             workout.type === 'pilates' ? 'Pilates' :
                             workout.type === 'esteira' ? 'Esteira' :
                             workout.type === 'spinning' ? 'Spinning' : ''}
                          </h3>
                          <span className={`px-2 py-0.5 rounded-full text-[10px] md:text-xs font-bold ${typeColor}`}>
                            {workoutTypeDisplay}
                          </span>
                        </div>
                        
                        <p className="text-text-secondary text-xs md:text-sm">
                          {new Date(workout.date).toLocaleString('pt-BR', {
                            day: '2-digit',
                            month: 'short',
                            year: 'numeric',
                            hour: '2-digit',
                            minute: '2-digit'
                          })}
                        </p>

                        {workout.type === 'natacao' && workout.details && (
                          <p className="text-xs text-accent-blue mt-1 truncate">
                            <i className="fas fa-water mr-1"></i>
                            {workout.details.distance}m • {workout.details.poolLength}m
                          </p>
                        )}

                        {(workout.type === 'esteira' || workout.type === 'spinning') && workout.details && (
                          <p className="text-xs text-accent-blue mt-1 truncate">
                            <i className="fas fa-route mr-1"></i>
                            {workout.details.distance}m
                          </p>
                        )}

                        {workout.notes && (
                          <p className="text-xs text-text-secondary mt-1 italic truncate">
                            📝 {workout.notes.substring(0, 30)}
                            {workout.notes.length > 30 && '...'}
                          </p>
                        )}
                      </div>
                    </div>

                    <div className="flex items-center justify-between w-full md:w-auto gap-4 md:gap-6">
                      <div className="text-center md:text-right flex-1 md:flex-none">
                        <p className="text-accent-green font-bold text-base md:text-xl">{workout.calories}</p>
                        <p className="text-text-secondary text-[10px] md:text-xs">kcal</p>
                      </div>
                      <div className="text-center md:text-right flex-1 md:flex-none">
                        <p className="text-accent-blue font-bold text-base md:text-xl">{workout.heart_rate}</p>
                        <p className="text-text-secondary text-[10px] md:text-xs">bpm</p>
                      </div>
                      <div className="text-center md:text-right flex-1 md:flex-none">
                        <p className="text-white font-bold text-base md:text-xl">
                          {Math.floor(workout.duration / 60)}
                        </p>
                        <p className="text-text-secondary text-[10px] md:text-xs">min</p>
                      </div>

                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          setWorkoutToDelete(workout.id);
                          setShowDeleteConfirm(true);
                        }}
                        className={`
                          p-2 md:p-3 
                          bg-red-500/20 text-red-400 
                          rounded-xl hover:bg-red-500/30 
                          transition-all 
                          flex items-center justify-center
                          w-10 h-10 md:w-auto md:h-auto
                          opacity-100 md:opacity-0
                          md:group-hover:opacity-100
                        `}
                        title="Excluir treino"
                      >
                        <i className="fas fa-trash text-sm md:text-base"></i>
                      </button>
                    </div>
                  </div>
                </div>
              );
            })
          )}
        </div>

        {selectedWorkout && (
          <div className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center z-50 p-4"
            onClick={() => setSelectedWorkout(null)}>
            <div className="bg-gradient-to-br from-secondary-dark to-black rounded-2xl p-6 md:p-8 
              max-w-2xl w-full max-h-[90vh] overflow-y-auto border border-white/10"
              onClick={(e) => e.stopPropagation()}>
              
              <div className="flex items-center justify-between mb-6 sticky top-0 bg-gradient-to-br from-secondary-dark to-black py-2">
                <h2 className="text-xl md:text-2xl font-bold text-white flex items-center gap-3">
                  <div className={`w-10 h-10 md:w-12 md:h-12 rounded-xl flex items-center justify-center
                    ${getActivityBgColor(selectedWorkout.type)}`}>
                    <i className={`fas fa-${getActivityIcon(selectedWorkout.type)} text-lg md:text-xl`}></i>
                  </div>
                  Detalhes do Treino
                </h2>
                <button
                  onClick={() => setSelectedWorkout(null)}
                  className="w-8 h-8 md:w-10 md:h-10 rounded-xl bg-white/5 text-white 
                    hover:bg-white/10 transition-all"
                >
                  <i className="fas fa-times"></i>
                </button>
              </div>

              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-3 md:gap-4">
                  <div className="bg-white/5 rounded-xl p-3 md:p-4">
                    <p className="text-text-secondary text-xs mb-1">Tipo</p>
                    <p className="text-white font-bold text-sm md:text-base capitalize">
                      {getWorkoutTypeDisplay(selectedWorkout)}
                    </p>
                  </div>
                  <div className="bg-white/5 rounded-xl p-3 md:p-4">
                    <p className="text-text-secondary text-xs mb-1">Data</p>
                    <p className="text-white font-bold text-sm md:text-base">
                      {new Date(selectedWorkout.date).toLocaleDateString('pt-BR')}
                    </p>
                  </div>
                  <div className="bg-white/5 rounded-xl p-3 md:p-4">
                    <p className="text-text-secondary text-xs mb-1">Duração</p>
                    <p className="text-white font-bold text-sm md:text-base">
                      {Math.floor(selectedWorkout.duration / 60)} min
                    </p>
                  </div>
                  <div className="bg-white/5 rounded-xl p-3 md:p-4">
                    <p className="text-text-secondary text-xs mb-1">Calorias</p>
                    <p className="text-accent-green font-bold text-sm md:text-base">
                      {selectedWorkout.calories} kcal
                    </p>
                  </div>
                  <div className="bg-white/5 rounded-xl p-3 md:p-4 col-span-2">
                    <p className="text-text-secondary text-xs mb-1">FC Média</p>
                    <p className="text-accent-blue font-bold text-sm md:text-base">
                      {selectedWorkout.heart_rate} bpm
                    </p>
                  </div>
                </div>

                {selectedWorkout.notes && (
                  <div className="bg-white/5 rounded-xl p-4">
                    <p className="text-text-secondary text-sm mb-2">Observações</p>
                    <p className="text-white text-sm">{selectedWorkout.notes}</p>
                  </div>
                )}

                {selectedWorkout.type === 'natacao' && selectedWorkout.details && (
                  <div className="bg-blue-500/10 rounded-xl p-4 border border-blue-500/20">
                    <p className="text-blue-300 font-medium mb-2">Detalhes da Natação</p>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <p className="text-text-secondary text-xs">Distância</p>
                        <p className="text-white font-bold">{selectedWorkout.details.distance}m</p>
                      </div>
                      <div>
                        <p className="text-text-secondary text-xs">Piscina</p>
                        <p className="text-white font-bold">{selectedWorkout.details.poolLength}m</p>
                      </div>
                    </div>
                  </div>
                )}

                {(selectedWorkout.type === 'esteira' || selectedWorkout.type === 'spinning') && selectedWorkout.details && (
                  <div className={`rounded-xl p-4 border ${
                    selectedWorkout.type === 'esteira' 
                      ? 'bg-orange-500/10 border-orange-500/20' 
                      : 'bg-cyan-500/10 border-cyan-500/20'
                  }`}>
                    <p className={`font-medium mb-2 ${
                      selectedWorkout.type === 'esteira' ? 'text-orange-300' : 'text-cyan-300'
                    }`}>
                      Detalhes do {selectedWorkout.type === 'esteira' ? 'Esteira' : 'Spinning'}
                    </p>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <p className="text-text-secondary text-xs">Distância</p>
                        <p className="text-white font-bold">{selectedWorkout.details.distance}m</p>
                      </div>
                      {selectedWorkout.details.avgSpeed && (
                        <div>
                          <p className="text-text-secondary text-xs">Velocidade Média</p>
                          <p className="text-white font-bold">{selectedWorkout.details.avgSpeed} km/h</p>
                        </div>
                      )}
                    </div>
                  </div>
                )}

                <div className="flex justify-center mt-6">
                  <button
                    onClick={() => setShowFullReport(true)}
                    className="w-full px-6 py-3 bg-gradient-to-r from-accent-red to-accent-purple 
                      text-white font-bold rounded-xl hover:opacity-90 transition-all 
                      flex items-center justify-center gap-2"
                  >
                    <i className="fas fa-file-alt"></i>
                    Ver Relatório Completo
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {showFullReport && selectedWorkout && (
          <WorkoutFullReportModal
            workout={selectedWorkout}
            onClose={() => setShowFullReport(false)}
          />
        )}

        {showExpandedChart && (
          <ExpandedCaloriesChart 
            data={caloriesChart} 
            onClose={() => setShowExpandedChart(false)} 
          />
        )}

        {showDeleteConfirm && (
          <div className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center z-50 p-4"
            onClick={() => setShowDeleteConfirm(false)}>
            <div className="bg-gradient-to-br from-secondary-dark to-black rounded-2xl p-6 md:p-8 
              max-w-md w-full border border-white/10"
              onClick={(e) => e.stopPropagation()}>
              
              <div className="text-center mb-6">
                <div className="w-16 h-16 md:w-20 md:h-20 bg-red-500/20 rounded-full flex items-center justify-center 
                  mx-auto mb-4">
                  <i className="fas fa-exclamation-triangle text-3xl md:text-4xl text-red-400"></i>
                </div>
                <h2 className="text-xl md:text-2xl font-bold text-white mb-2">Confirmar exclusão</h2>
                <p className="text-text-secondary text-sm md:text-base">
                  Tem certeza que deseja excluir este treino? Esta ação não pode ser desfeita.
                </p>
              </div>

              <div className="flex gap-3">
                <button
                  onClick={() => setShowDeleteConfirm(false)}
                  className="flex-1 py-3 bg-white/10 text-white rounded-xl 
                    hover:bg-white/20 transition-all text-sm md:text-base"
                >
                  Cancelar
                </button>
                <button
                  onClick={() => workoutToDelete && handleDelete(workoutToDelete)}
                  className="flex-1 py-3 bg-gradient-to-r from-red-600 to-red-500 
                    text-white rounded-xl font-bold hover:opacity-90 transition-all text-sm md:text-base"
                >
                  Excluir
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default History;