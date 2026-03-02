// src/components/ExpandedCaloriesChart.tsx
import React, { useEffect, useState } from 'react';
import { Line } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  Filler
} from 'chart.js';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  Filler
);

interface ExpandedCaloriesChartProps {
  data: any;
  onClose: () => void;
}

const ExpandedCaloriesChart: React.FC<ExpandedCaloriesChartProps> = ({ data, onClose }) => {
  const [isMobile, setIsMobile] = useState(false);
  const [isRotated, setIsRotated] = useState(false);
  const [windowSize, setWindowSize] = useState({
    width: window.innerWidth,
    height: window.innerHeight
  });

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
      setWindowSize({
        width: window.innerWidth,
        height: window.innerHeight
      });
    };
    
    checkMobile();
    window.addEventListener('resize', checkMobile);
    
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  // Ativar rotação automaticamente em mobile
  useEffect(() => {
    if (isMobile) {
      setIsRotated(true);
    }
  }, [isMobile]);

  const toggleRotation = () => {
    setIsRotated(!isRotated);
  };

  // Calcular estatísticas básicas (apenas para desktop)
  const totalCalories = data.datasets[0].data.reduce((sum: number, val: number) => sum + val, 0);
  const workoutsWithData = data.datasets[0].data.filter((v: number) => v > 0).length;
  const averageCalories = workoutsWithData > 0 ? Math.round(totalCalories / workoutsWithData) : 0;
  const maxCalories = Math.max(...data.datasets[0].data);
  const maxDayIndex = data.datasets[0].data.indexOf(maxCalories);
  const bestDay = data.labels[maxDayIndex] || 'N/A';

  return (
    <div className="fixed inset-0 bg-black/95 backdrop-blur-sm z-50 flex items-center justify-center p-0 overflow-hidden">
      <div className="bg-gradient-to-br from-secondary-dark to-black rounded-0 
        border-0 relative w-full h-full flex flex-col
      ">
        
        {/* Header - mais compacto em mobile rotacionado */}
        <div className={`
          bg-gradient-to-br from-secondary-dark to-black px-4 py-2 sm:p-6 border-b border-white/10 
          flex items-center justify-between flex-shrink-0
          ${isMobile && isRotated ? 'py-1' : ''}
        `}>
          <div className="flex items-center gap-2 sm:gap-3">
            <i className="fas fa-fire text-accent-red"></i>
            <h2 className={`
              font-bold text-white truncate
              ${isMobile && isRotated ? 'text-base' : 'text-lg sm:text-xl md:text-2xl'}
            `}>
              {isMobile && isRotated ? 'Calorias' : 'Evolução de Calorias'}
            </h2>
          </div>
          
          <div className="flex items-center gap-2 flex-shrink-0">
            {/* Botão de rotacionar - apenas em mobile */}
            {isMobile && (
              <button
                onClick={toggleRotation}
                className={`
                  rounded-xl bg-accent-blue/20 text-accent-blue 
                  hover:bg-accent-blue/30 transition-all flex items-center justify-center
                  ${isMobile && isRotated ? 'w-8 h-8' : 'w-10 h-10'}
                `}
                title={isRotated ? "Voltar ao normal" : "Rotacionar para melhor visualização"}
              >
                <i className={`fas fa-${isRotated ? 'undo' : 'redo'} ${isMobile && isRotated ? 'text-sm' : ''}`}></i>
              </button>
            )}
            
            <button
              onClick={onClose}
              className={`
                rounded-xl bg-white/5 text-white 
                hover:bg-white/10 transition-all hover:scale-110 flex items-center justify-center
                ${isMobile && isRotated ? 'w-8 h-8' : 'w-10 h-10 sm:w-12 sm:h-12'}
              `}
            >
              <i className={`fas fa-times ${isMobile && isRotated ? 'text-sm' : ''}`}></i>
            </button>
          </div>
        </div>

        {/* Conteúdo - ocupa todo espaço restante sem scroll */}
        <div className="flex-1 flex items-center justify-center overflow-hidden p-0">
          {!isMobile ? (
            /* DESKTOP: layout normal com cards */
            <div className="flex flex-row gap-6 w-full h-full p-6 overflow-auto">
              <div className="flex-1 bg-white/5 rounded-xl p-4 border border-white/10 h-full">
                <div className="h-full w-full">
                  <Line 
                    data={data}
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
                          ticks: { color: 'white', maxRotation: 45, maxTicksLimit: 12 }
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

              <div className="w-80 space-y-4 overflow-auto">
                <div className="bg-gradient-to-br from-accent-red/10 to-accent-purple/10 rounded-xl p-6 border border-white/10">
                  <h3 className="text-white font-bold mb-4 flex items-center gap-2">
                    <i className="fas fa-chart-line text-accent-red"></i>
                    Resumo
                  </h3>
                  <div className="space-y-3">
                    <div className="flex justify-between items-center">
                      <span className="text-text-secondary">Total:</span>
                      <span className="text-white font-bold">{totalCalories} kcal</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-text-secondary">Média:</span>
                      <span className="text-accent-green font-bold">{averageCalories} kcal</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-text-secondary">Máximo:</span>
                      <span className="text-accent-red font-bold">{maxCalories} kcal</span>
                    </div>
                  </div>
                </div>

                <div className="bg-gradient-to-br from-yellow-500/10 to-orange-500/10 rounded-xl p-6 border border-white/10">
                  <h3 className="text-white font-bold mb-4 flex items-center gap-2">
                    <i className="fas fa-trophy text-yellow-500"></i>
                    Melhor Dia
                  </h3>
                  <p className="text-lg font-bold text-white mb-1 break-words">{bestDay}</p>
                  <p className="text-accent-green text-xl font-bold">{maxCalories} kcal</p>
                </div>

                <div className="bg-gradient-to-br from-blue-500/10 to-cyan-500/10 rounded-xl p-6 border border-white/10">
                  <h3 className="text-white font-bold mb-4 flex items-center gap-2">
                    <i className="fas fa-lightbulb text-blue-400"></i>
                    Insights
                  </h3>
                  <ul className="space-y-3 text-sm">
                    <li className="flex items-start gap-2">
                      <i className="fas fa-calendar text-accent-blue mt-1"></i>
                      <span className="text-text-secondary">
                        {workoutsWithData} dias com treino
                      </span>
                    </li>
                  </ul>
                </div>
              </div>
            </div>
          ) : isRotated ? (
            /* MOBILE ROTACIONADO: gráfico ocupa TELA INTEIRA sem scroll */
            <div className="w-full h-full flex items-center justify-center p-0">
              <div className="transform rotate-90 origin-center" style={{
                width: Math.min(windowSize.height * 0.98, windowSize.width * 1.5),
                height: Math.min(windowSize.width * 0.98, windowSize.height * 0.7)
              }}>
                <div className="bg-white/5 rounded-xl border border-white/10 w-full h-full p-2">
                  <div className="w-full h-full">
                    <Line 
                      data={data}
                      options={{
                        responsive: true,
                        maintainAspectRatio: false,
                        scales: {
                          y: {
                            grid: { color: 'rgba(255,255,255,0.1)' },
                            ticks: { 
                              color: 'white',
                              font: { size: 14 }
                            }
                          },
                          x: {
                            grid: { display: false },
                            ticks: { 
                              color: 'white', 
                              maxRotation: 45,
                              maxTicksLimit: 20,
                              font: { size: 14 }
                            }
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
              </div>
            </div>
          ) : (
            /* MOBILE NORMAL: gráfico normal com botão */
            <div className="w-full h-full p-4 flex flex-col">
              <div className="flex-1 bg-white/5 rounded-xl p-3 border border-white/10">
                <div className="h-full w-full">
                  <Line 
                    data={data}
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
              <button
                onClick={onClose}
                className="w-full py-4 bg-gradient-to-r from-accent-red to-accent-purple 
                  text-white font-bold rounded-xl hover:opacity-90 transition-all mt-4 flex-shrink-0"
              >
                Fechar
              </button>
            </div>
          )}
        </div>

      </div>
    </div>
  );
};

export default ExpandedCaloriesChart;