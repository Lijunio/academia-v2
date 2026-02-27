// src/pages/Swimming/SwimmingRegistration.tsx
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { SwimmingActivity } from '../../types/activities.types';
import { workoutService } from '../../services/supabase.service';

const SwimmingRegistration: React.FC = () => {
  const navigate = useNavigate();

  const [duration, setDuration] = useState('');
  const [heartRate, setHeartRate] = useState('');
  const [calories, setCalories] = useState('');
  const [distance, setDistance] = useState('');
  const [poolLength, setPoolLength] = useState<15 | 25 | 50 | 100>();
  const [notes, setNotes] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async () => {

    if (!duration || !heartRate || !calories || !distance || !poolLength) {
      return;
    }

    const activity: SwimmingActivity = {
      id: `swimming-${Date.now()}`,
      type: 'natacao',
      date: new Date(),
      duration: parseInt(duration) * 60,
      calories: parseInt(calories),
      heartRate: parseInt(heartRate),
      distance: parseInt(distance),
      style: 'crawl',
      poolLength: poolLength, 
      notes: notes || undefined
    } as SwimmingActivity;

    setIsLoading(true);
    
    try {
      const existing = JSON.parse(localStorage.getItem('swimming-activities') || '[]');
      localStorage.setItem('swimming-activities', JSON.stringify([...existing, activity]));
      
      await workoutService.save({
        type: 'natacao',
        date: new Date(),
        duration: parseInt(duration) * 60,
        calories: parseInt(calories),
        heart_rate: parseInt(heartRate),
        details: {
          distance: parseInt(distance),
          poolLength: poolLength
        },
        notes: notes || undefined
      });
      
      await sendTelegramReport(activity);
      
      navigate('/');
      
    } catch (error) {
      console.error('Erro:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const sendTelegramReport = async (activity: SwimmingActivity): Promise<boolean> => {
    try {
      const formatDuration = (seconds: number): string => {
        const mins = Math.floor(seconds / 60);
        const secs = seconds % 60;
        return `${mins}:${secs.toString().padStart(2, '0')}`;
      };

      const pools = Math.round(activity.distance / activity.poolLength);
      const avgSpeed = (activity.distance / (activity.duration / 60)).toFixed(1);

      const message = `
🏊‍♂️ *RELATÓRIO DE NATAÇÃO* 🏊‍♂️

📅 *Data:* ${activity.date.toLocaleDateString('pt-BR')}
⏰ *Hora:* ${activity.date.toLocaleTimeString('pt-BR')}
⏱️ *Duração:* ${formatDuration(activity.duration)}

📊 *MÉTRICAS:*
├ 📏 Distância: ${activity.distance}m
├ 🏊‍♂️ Piscinas: ${pools} (${activity.poolLength}m)
├ 💓 FC Média: ${activity.heartRate} bpm
└ 🔥 Calorias: ${activity.calories} kcal

📈 *ESTATÍSTICAS:*
├ 🚀 Velocidade: ${avgSpeed} m/min
├ ⚡ Intensidade: ${activity.heartRate < 120 ? 'Leve' : activity.heartRate < 160 ? 'Moderada' : 'Alta'}
└ 🎯 Eficiência: ${(activity.calories / (activity.duration / 60)).toFixed(1)} kcal/min

${activity.notes ? `📝 *OBSERVAÇÕES:*\n${activity.notes}\n` : ''}

💪 *PRÓXIMOS PASSOS:*
• Aumentar distância gradualmente
• Manter respiração controlada

      `.trim();

      const TELEGRAM_BOT_TOKEN = process.env.REACT_APP_TELEGRAM_BOT_TOKEN || '';
      const TELEGRAM_CHAT_ID = process.env.REACT_APP_TELEGRAM_CHAT_ID || '';

      const response = await fetch(
        `https://api.telegram.org/bot${TELEGRAM_BOT_TOKEN}/sendMessage`,
        {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            chat_id: TELEGRAM_CHAT_ID,
            text: message,
            parse_mode: 'Markdown',
            disable_notification: false,
          }),
        }
      );

      return response.ok;

    } catch (error) {
      console.error('Erro Telegram:', error);
      return false;
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-900/20 to-black">
      <div className="container mx-auto px-4 py-8 max-w-4xl">
        
        <div className="mb-10">
          <button
            onClick={() => navigate('/')}
            className="mb-6 inline-flex items-center gap-2 text-blue-300 hover:text-white transition-colors"
          >
            <i className="fas fa-arrow-left"></i>
            Voltar
          </button>
          
          <div className="flex items-center gap-4 mb-6">
            <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-blue-500 to-cyan-400 
              flex items-center justify-center">
              <i className="fas fa-swimmer text-2xl text-white"></i>
            </div>
            <div>
              <h1 className="text-3xl font-bold text-white">Natação</h1>
              <p className="text-blue-300">Registro de treino aquático</p>
            </div>
          </div>
        </div>

        <div className="bg-gradient-to-br from-secondary-dark/50 to-black/50 rounded-2xl p-6 
          border border-white/10 mb-8">
          
          <h2 className="text-xl font-bold text-white mb-6">📋 Dados do Treino</h2>
          
          <div className="mb-4">
            <label className="block text-white mb-2">
              Duração (minutos) *
            </label>
            <input
              type="number"
              value={duration}
              onChange={(e) => setDuration(e.target.value)}
              placeholder="Ex: 45"
              className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 
                text-white placeholder-gray-400 focus:outline-none focus:border-blue-500"
              min="5"
              max="240"
              required
            />
          </div>

          <div className="mb-4">
            <label className="block text-white mb-2">
              Metros nadados *
            </label>
            <div className="flex flex-wrap gap-2 mb-2">
              {[500, 1000, 1500, 2000, 2500].map((dist) => (
                <button
                  key={dist}
                  type="button"
                  onClick={() => setDistance(dist.toString())}
                  className={`px-3 py-2 rounded-lg transition-all ${
                    distance === dist.toString()
                      ? 'bg-blue-600 text-white'
                      : 'bg-white/5 text-white hover:bg-white/10'
                  }`}
                >
                  {dist}m
                </button>
              ))}
            </div>
            <input
              type="number"
              value={distance}
              onChange={(e) => setDistance(e.target.value)}
              placeholder="Ex: 1250"
              className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 
                text-white placeholder-gray-400 focus:outline-none focus:border-blue-500"
              min="0"
              max="10000"
              step="25"
              required
            />
            <p className="text-blue-300 text-xs mt-2">
              ⚡ {distance && poolLength ? `${Math.round(parseInt(distance) / poolLength)} piscinas de ${poolLength}m` : 'Selecione o tamanho da piscina'}
            </p>
          </div>

          <div className="mb-4">
            <label className="block text-white mb-2">
              Tamanho da piscina *
            </label>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              {[15, 25, 50, 100].map((length) => (
                <button
                  key={length}
                  type="button"
                  onClick={() => setPoolLength(length as 15 | 25 | 50 | 100)}
                  className={`py-3 rounded-lg transition-all font-medium ${
                    poolLength === length
                      ? 'bg-blue-600 text-white'
                      : 'bg-white/5 text-white hover:bg-white/10'
                  }`}
                >
                  {length}m
                </button>
              ))}
            </div>
          </div>

          <div className="mb-4">
            <label className="block text-white mb-2">
              Frequência cardíaca média (bpm) *
            </label>
            <input
              type="number"
              value={heartRate}
              onChange={(e) => setHeartRate(e.target.value)}
              placeholder="Ex: 145"
              className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 
                text-white placeholder-gray-400 focus:outline-none focus:border-red-500"
              min="50"
              max="220"
              required
            />
          </div>

          <div className="mb-6">
            <label className="block text-white mb-2">
              Calorias perdidas (kcal) *
            </label>
            <input
              type="number"
              value={calories}
              onChange={(e) => setCalories(e.target.value)}
              placeholder="Ex: 450"
              className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 
                text-white placeholder-gray-400 focus:outline-none focus:border-orange-500"
              min="0"
              max="2000"
              required
            />
          </div>

          <div className="mb-8">
            <label className="block text-white mb-2">
              Observações (opcional)
            </label>
            <textarea
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="Ex: Dificuldade na respiração bilateral, boia de pernas..."
              className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 
                text-white placeholder-gray-400 focus:outline-none focus:border-green-500 
                resize-none h-24"
              maxLength={300}
            />
          </div>

          <div className="flex gap-3">
            <button
              onClick={() => navigate('/')}
              className="flex-1 py-3 bg-white/10 text-white rounded-xl hover:bg-white/20 transition-colors"
              disabled={isLoading}
            >
              Cancelar
            </button>
            <button
              onClick={handleSubmit}
              disabled={isLoading || !duration || !heartRate || !calories || !distance || !poolLength}
              className={`flex-1 py-3 rounded-xl font-bold transition-all ${
                !isLoading && duration && heartRate && calories && distance && poolLength
                  ? 'bg-gradient-to-r from-blue-600 to-cyan-600 text-white hover:opacity-90'
                  : 'bg-gray-700 text-gray-400 cursor-not-allowed'
              }`}
            >
              {isLoading ? 'Enviando...' : 'Registrar Treino'}
            </button>
          </div>
        </div>

        {duration && distance && poolLength && (
          <div className="bg-blue-500/10 rounded-2xl p-6 border border-blue-500/20">
            <h3 className="text-lg font-bold text-white mb-4">
              <i className="fas fa-calculator mr-2"></i>
              Estatísticas
            </h3>
            <div className="grid grid-cols-2 gap-4">
              <div className="bg-white/5 rounded-xl p-4 text-center">
                <div className="text-blue-300 text-sm mb-1">Velocidade</div>
                <div className="text-white font-bold text-xl">
                  {(parseInt(distance) / parseInt(duration)).toFixed(1)} m/min
                </div>
              </div>
              <div className="bg-white/5 rounded-xl p-4 text-center">
                <div className="text-blue-300 text-sm mb-1">Piscinas</div>
                <div className="text-white font-bold text-xl">
                  {Math.round(parseInt(distance) / poolLength)}
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default SwimmingRegistration;