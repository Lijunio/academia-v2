// src/pages/Academia/AcademiaSelection.tsx
import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { workoutsData } from '../../data/workouts.data';

const AcademiaSelection: React.FC = () => {
  const navigate = useNavigate();

  const cardioActivities = [
    {
      id: 'esteira',
      title: 'Esteira / Caminhada',
      icon: 'fas fa-person-walking',
      gradientFrom: '#ff9f43',
      gradientTo: '#feca57',
      path: '/esteira',
      description: 'Caminhada ou corrida na esteira',
      stats: ['Distância percorrida', 'Batimentos cardíacos', 'Calorias']
    },
    {
      id: 'spinning',
      title: 'Spinning',
      icon: 'fas fa-bicycle',
      gradientFrom: '#54a0ff',
      gradientTo: '#2e86de',
      path: '/spinning',
      description: 'Bicicleta ergométrica / Spinning',
      stats: ['Distância percorrida', 'Batimentos cardíacos', 'Calorias']
    }
  ];

  const handleCardClick = (path: string, e: React.MouseEvent) => {
    if (e.ctrlKey || e.metaKey || e.button === 1) {
      return;
    }
    e.preventDefault();
    navigate(path);
  };

  return (
    <div className="min-h-screen bg-primary-dark overflow-x-hidden">
      <div className="container mx-auto px-4 py-6 md:py-8 max-w-6xl">
        
        {/* Header */}
        <header className="text-center py-8 md:py-12 px-4 md:px-6 
          bg-gradient-to-br from-secondary-dark via-black to-secondary-dark 
          rounded-3xl border border-white/5 
          shadow-[0_20px_60px_-15px_rgba(0,0,0,0.7)] 
          mb-10 md:mb-12 relative overflow-hidden group">
          
          <div className="absolute -inset-[100px] bg-gradient-to-r from-accent-red/5 via-transparent to-accent-blue/5 
            group-hover:from-accent-red/10 group-hover:to-accent-blue/10 
            transition-all duration-1000 blur-3xl" />
          
          <div className="absolute top-0 left-0 right-0 h-[3px] 
            bg-gradient-to-r from-transparent via-accent-red via-50% to-transparent 
            animate-shimmer bg-[length:200%_auto]" />
          
          <div className="relative z-10">
            <div className="flex flex-col md:flex-row items-center justify-center gap-4 md:gap-6 mb-4 md:mb-6">
              <div className="text-4xl md:text-5xl text-accent-red 
                animate-float filter drop-shadow-[0_0_15px_rgba(255,71,87,0.5)]">
                <i className="fas fa-dumbbell"></i>
              </div>
              
              <h1 className="text-3xl md:text-5xl lg:text-6xl 
                font-montserrat font-black text-white 
                bg-clip-text text-transparent 
                bg-gradient-to-r from-white via-accent-red to-white 
                animate-shimmer bg-[length:200%_auto]
                leading-tight">
                ACADEMIA <span className="bg-gradient-to-r from-accent-red via-accent-purple to-accent-blue 
                  bg-clip-text text-transparent">ELIJUNIO</span>
              </h1>
            </div>
            
            <p className="text-text-secondary/90 text-base md:text-lg 
              font-inter font-light tracking-wide 
              bg-gradient-to-r from-text-secondary to-white 
              bg-clip-text text-transparent
              max-w-2xl mx-auto">
              Transformação através da disciplina • Evolução através do esforço
            </p>
          </div>
        </header>

        {/* Seção Treinos de Musculação */}
        <section className="mb-12">
          <div className="flex items-center gap-3 mb-6">
            <div className="p-3 rounded-xl bg-gradient-to-br from-accent-red to-accent-purple">
              <i className="fas fa-dumbbell text-white"></i>
            </div>
            <h2 className="text-2xl md:text-3xl font-bold text-white">
              Treinos de Musculação
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-8 mb-12 md:mb-16">
            {workoutsData.map((workout) => {
              const isWorkoutA = workout.id === 'A';
              
              return (
                <Link
                  key={workout.id}
                  to={`/workout-${workout.id.toLowerCase()}`}
                  className={`group relative 
                    rounded-2xl overflow-hidden
                    border ${isWorkoutA ? 'border-accent-red/30' : 'border-accent-blue/30'}
                    shadow-xl shadow-black/30
                    transition-all duration-500
                    hover:scale-[1.02] hover:-translate-y-2
                    ${isWorkoutA ? 'hover:shadow-glow-red' : 'hover:shadow-glow-blue'}
                    active:scale-95`}
                >
                  <div 
                    className="absolute inset-0 bg-cover bg-center transition-transform duration-700 group-hover:scale-110"
                    style={{
                      backgroundImage: `url(${workout.backgroundImage})`,
                      filter: 'brightness(0.6)'
                    }}
                  />
                  
                  <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/50 to-transparent" />
                  
                  <div className={`absolute inset-0 opacity-0 group-hover:opacity-100 
                    transition-opacity duration-500 
                    bg-gradient-to-br ${isWorkoutA 
                      ? 'from-accent-red/10 via-transparent to-accent-purple/5' 
                      : 'from-accent-blue/10 via-transparent to-accent-purple/5'}`} />
                  
                  <div className={`absolute top-4 right-4 md:top-6 md:right-6 
                    w-10 h-10 md:w-14 md:h-14 
                    rounded-full flex items-center justify-center 
                    text-white font-black 
                    text-xl md:text-2xl z-20
                    ${isWorkoutA 
                      ? 'bg-gradient-to-br from-accent-red to-accent-red-light' 
                      : 'bg-gradient-to-br from-accent-blue to-accent-blue-light'}
                    border-2 border-white/30 
                    shadow-lg shadow-black/50
                    transition-all duration-300
                    group-hover:scale-110 group-hover:rotate-12
                    group-hover:shadow-xl group-hover:shadow-black/70
                    animate-pulse-glow`}>
                    {workout.id}
                  </div>
                  
                  <div className="relative z-10 p-6 md:p-8 min-h-[320px] flex flex-col justify-end">
                    <div className="mb-4 md:mb-6">
                      <h3 className={`text-2xl md:text-3xl 
                        font-montserrat font-bold mb-2
                        ${isWorkoutA ? 'text-accent-red' : 'text-accent-blue'}`}>
                        {workout.name}
                      </h3>
                      <p className="text-text-secondary text-sm uppercase tracking-widest 
                        font-inter font-semibold opacity-90">
                        {workout.focus}
                      </p>
                    </div>
                    
                    <div className="grid grid-cols-3 gap-3 mb-6">
                      <div className={`text-center p-3 rounded-xl backdrop-blur-sm
                        ${isWorkoutA ? 'bg-accent-red/20' : 'bg-accent-blue/20'}
                        border ${isWorkoutA ? 'border-accent-red/30' : 'border-accent-blue/30'}
                        transition-all duration-300 hover:scale-105`}>
                        <div className="text-white font-bold text-xl">
                          {workout.totalExercises}
                        </div>
                        <div className="text-text-secondary text-xs mt-1 uppercase tracking-wider">
                          Exercícios
                        </div>
                      </div>
                      
                      <div className={`text-center p-3 rounded-xl backdrop-blur-sm
                        ${isWorkoutA ? 'bg-accent-red/20' : 'bg-accent-blue/20'}
                        border ${isWorkoutA ? 'border-accent-red/30' : 'border-accent-blue/30'}
                        transition-all duration-300 hover:scale-105`}>
                        <div className="text-white font-bold text-xl">
                          {workout.totalSets}
                        </div>
                        <div className="text-text-secondary text-xs mt-1 uppercase tracking-wider">
                          Séries
                        </div>
                      </div>
                      
                      <div className={`text-center p-3 rounded-xl backdrop-blur-sm
                        ${isWorkoutA ? 'bg-accent-red/20' : 'bg-accent-blue/20'}
                        border ${isWorkoutA ? 'border-accent-red/30' : 'border-accent-blue/30'}
                        transition-all duration-300 hover:scale-105`}>
                        <div className="text-white font-bold text-xl">
                          {workout.duration}
                        </div>
                        <div className="text-text-secondary text-xs mt-1 uppercase tracking-wider">
                          Minutos
                        </div>
                      </div>
                    </div>
                    
                    <div className="flex items-center justify-between pt-6 
                      border-t border-white/10">
                      <span className={`font-montserrat font-bold 
                        ${isWorkoutA ? 'text-accent-red' : 'text-accent-blue'}`}>
                        Iniciar Treino
                      </span>
                      <div className={`p-2 rounded-full 
                        ${isWorkoutA ? 'bg-accent-red/20' : 'bg-accent-blue/20'}
                        transition-all duration-300 
                        group-hover:translate-x-2 group-hover:scale-110`}>
                        <i className={`fas fa-arrow-right ${isWorkoutA ? 'text-accent-red' : 'text-accent-blue'}`}></i>
                      </div>
                    </div>
                  </div>
                </Link>
              );
            })}
          </div>
        </section>

        {/* Seção Treinos Aeróbicos */}
        <section className="mb-12">
          <div className="flex items-center gap-3 mb-6">
            <div className="p-3 rounded-xl bg-gradient-to-br from-orange-500 to-yellow-500">
              <i className="fas fa-heart-pulse text-white"></i>
            </div>
            <h2 className="text-2xl md:text-3xl font-bold text-white">
              Treinos Aeróbicos
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-8">
            {cardioActivities.map((activity, index) => (
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
                      <span>Iniciar {activity.title.split('/')[0]}</span>
                      <i className="fas fa-arrow-right group-hover:translate-x-1 transition-transform"></i>
                    </div>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </section>

        {/* Dica Profissional */}
        <div className="relative overflow-hidden rounded-2xl mb-12 md:mb-16 
          bg-gradient-to-br from-accent-red/5 via-accent-purple/5 to-accent-blue/5
          border border-white/10 
          backdrop-blur-sm">
          
          <div className="absolute top-0 left-0 w-32 h-32 
            bg-accent-green/10 rounded-full -translate-x-16 -translate-y-16 
            blur-3xl" />
          <div className="absolute bottom-0 right-0 w-32 h-32 
            bg-accent-purple/10 rounded-full translate-x-16 translate-y-16 
            blur-3xl" />
          
          <div className="relative z-10 p-6 md:p-8">
            <div className="flex items-center gap-3 md:gap-4 mb-4">
              <div className="p-3 rounded-xl 
                bg-gradient-to-br from-accent-green to-accent-green/80 
                shadow-lg shadow-accent-green/30">
                <i className="fas fa-lightbulb text-white text-lg md:text-xl"></i>
              </div>
              <h3 className="text-lg md:text-xl font-montserrat font-bold 
                text-white">
                <span className="bg-gradient-to-r from-accent-green to-accent-green/80 
                  bg-clip-text text-transparent">
                  Dica Profissional
                </span>
              </h3>
            </div>
            
            <p className="text-text-secondary font-inter 
              text-sm md:text-base leading-relaxed">
              Para <span className="text-accent-green font-semibold">hipertrofia máxima</span>, 
              mantenha o descanso entre 45-60 segundos. Para <span className="text-accent-red font-semibold">força</span>, 
              descanse 90+ segundos. Combine com treinos aeróbicos para melhor condicionamento.
            </p>
          </div>
        </div>

        <footer className="text-center py-6 md:py-8 
          border-t border-white/5">
          <p className="text-text-muted/70 text-xs md:text-sm 
            font-inter tracking-wide uppercase">
            ACADEMIA ELIJUNIO © 2026
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
      `}</style>
    </div>
  );
};

export default AcademiaSelection;