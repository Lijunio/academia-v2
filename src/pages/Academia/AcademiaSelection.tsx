import React from 'react';
import { Link } from 'react-router-dom';
import { workoutsData } from '../../data/workouts.data';

const Home: React.FC = () => {
  return (
    <div className="min-h-screen bg-primary-dark overflow-x-hidden">
      <div className="container mx-auto px-4 py-6 md:py-8 max-w-6xl">
        
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

        <section className="text-center py-6 md:py-8 px-4 md:px-6 
          bg-gradient-to-b from-white/5 to-transparent 
          backdrop-blur-xl rounded-2xl 
          border border-white/10 
          shadow-lg shadow-black/30 
          mb-10 md:mb-12 
          transition-all duration-300 hover:shadow-xl hover:shadow-black/40">
          
          <h2 className="text-xl md:text-2xl lg:text-3xl 
            font-montserrat font-bold text-white mb-3 
            bg-gradient-to-r from-white to-text-secondary 
            bg-clip-text text-transparent">
            Selecione seu treino da semana
          </h2>
          
          <p className="text-text-secondary/80 text-sm md:text-base 
            font-inter max-w-xl mx-auto leading-relaxed">
            Treinos cientificamente otimizados para maximizar 
            <span className="text-accent-green font-semibold"> hipertrofia </span> 
            e 
            <span className="text-accent-red font-semibold"> força</span>
          </p>
        </section>

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
                  animate-pulse-glow ${isWorkoutA ? 'text-accent-red' : 'text-accent-blue'}`}>
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
                      <div className="text-text-secondary/70 text-xs mt-1 flex items-center justify-center">
                        <i className="fas fa-list-check mr-1"></i>
                        total
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
                      <div className="text-text-secondary/70 text-xs mt-1 flex items-center justify-center">
                        <i className="fas fa-repeat mr-1"></i>
                        totais
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
                      <div className="text-text-secondary/70 text-xs mt-1 flex items-center justify-center">
                        <i className="fas fa-clock mr-1"></i>
                        estimado
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
                      group-hover:translate-x-2 group-hover:scale-110
                      group-hover:${isWorkoutA ? 'bg-accent-red/30' : 'bg-accent-blue/30'}`}>
                      <i className={`fas fa-arrow-right ${isWorkoutA ? 'text-accent-red' : 'text-accent-blue'}`}></i>
                    </div>
                  </div>
                </div>
              </Link>
            );
          })}
        </div>

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
              descanse 90+ segundos. A respiração controlada potencializa os resultados.
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
    </div>
  );
};

export default Home;