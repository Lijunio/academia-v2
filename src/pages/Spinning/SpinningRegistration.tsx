// src/pages/Spinning/SpinningRegistration.tsx
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { SpinningActivity } from '../../types/activities.types';
import { workoutService } from '../../services/supabase.service';

const SpinningRegistration: React.FC = () => {
  const navigate = useNavigate();

  const [duration, setDuration] = useState('');
  const [heartRate, setHeartRate] = useState('');
  const [calories, setCalories] = useState('');
  const [distance, setDistance] = useState('');
  const [notes, setNotes] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const quickDistances = [5000, 10000, 15000, 20000, 30000];
  const quickDurations = [20, 30, 45, 60];

  const handleSubmit = async () => {
    if (!duration || !heartRate || !calories || !distance) {
      return;
    }

    const activity: SpinningActivity = {
      id: `spinning-${Date.now()}`,
      type: 'spinning',
      date: new Date(),
      duration: parseInt(duration) * 60,
      calories: parseInt(calories),
      heartRate: parseInt(heartRate),
      distance: parseInt(distance),
      notes: notes || undefined
    };

    setIsLoading(true);
    
    try {
      await workoutService.save({
        type: 'spinning',
        date: new Date(),
        duration: parseInt(duration) * 60,
        calories: parseInt(calories),
        heart_rate: parseInt(heartRate),
        details: {
          distance: parseInt(distance)
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

  const sendTelegramReport = async (activity: SpinningActivity): Promise<boolean> => {
    try {
      const formatDuration = (seconds: number): string => {
        const mins = Math.floor(seconds / 60);
        return `${mins} min`;
      };

      const avgSpeed = (activity.distance / (activity.duration / 60 / 60) / 1000).toFixed(1);

      const message = `
🚴‍♂️ *RELATÓRIO DE SPINNING* 🚴‍♀️

📅 *Data:* ${activity.date.toLocaleDateString('pt-BR')}
⏰ *Hora:* ${activity.date.toLocaleTimeString('pt-BR')}
⏱️ *Duração:* ${formatDuration(activity.duration)}

📊 *MÉTRICAS:*
├ 📏 Distância: ${(activity.distance / 1000).toFixed(2)} km
├ 💓 FC Média: ${activity.heartRate} bpm
└ 🔥 Calorias: ${activity.calories} kcal

📈 *ESTATÍSTICAS:*
├ 🚀 Velocidade: ${avgSpeed} km/h
├ ⚡ Intensidade: ${activity.heartRate < 120 ? 'Leve' : activity.heartRate < 150 ? 'Moderada' : 'Alta'}
└ 🎯 Eficiência: ${(activity.calories / (activity.duration / 60)).toFixed(1)} kcal/min

${activity.notes ? `📝 *OBSERVAÇÕES:*\n${activity.notes}\n` : ''}

💪 *PRÓXIMOS PASSOS:*
• Manter cadência constante
• Aumentar resistência gradualmente
• Controlar respiração

#Spinning #Bike #Cardio
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
    <div className="min-h-screen bg-gradient-to-b from-cyan-900/20 to-black">
      <div className="container mx-auto px-4 py-8 max-w-4xl">
        
        <div className="mb-10">
          <button
            onClick={() => navigate('/academia')}
            className="mb-6 inline-flex items-center gap-2 text-cyan-300 hover:text-white transition-colors"
          >
            <i className="fas fa-arrow-left"></i>
            Voltar
          </button>
          
          <div className="flex items-center gap-4 mb-6">
            <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-cyan-500 to-blue-500 
              flex items-center justify-center">
              <i className="fas fa-bicycle text-2xl text-white"></i>
            </div>
            <div>
              <h1 className="text-3xl font-bold text-white">Spinning</h1>
              <p className="text-cyan-300">Registro de bicicleta ergométrica</p>
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
            <div className="flex flex-wrap gap-2 mb-2">
              {quickDurations.map((dur) => (
                <button
                  key={dur}
                  type="button"
                  onClick={() => setDuration(dur.toString())}
                  className={`px-3 py-2 rounded-lg transition-all ${
                    duration === dur.toString()
                      ? 'bg-cyan-600 text-white'
                      : 'bg-white/5 text-white hover:bg-white/10'
                  }`}
                >
                  {dur}min
                </button>
              ))}
            </div>
            <input
              type="number"
              value={duration}
              onChange={(e) => setDuration(e.target.value)}
              placeholder="Ex: 45"
              className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 
                text-white placeholder-gray-400 focus:outline-none focus:border-cyan-500"
              min="5"
              max="240"
              required
            />
          </div>

          <div className="mb-4">
            <label className="block text-white mb-2">
              Distância percorrida (metros) *
            </label>
            <div className="flex flex-wrap gap-2 mb-2">
              {quickDistances.map((dist) => (
                <button
                  key={dist}
                  type="button"
                  onClick={() => setDistance(dist.toString())}
                  className={`px-3 py-2 rounded-lg transition-all ${
                    distance === dist.toString()
                      ? 'bg-cyan-600 text-white'
                      : 'bg-white/5 text-white hover:bg-white/10'
                  }`}
                >
                  {dist/1000}km
                </button>
              ))}
            </div>
            <input
              type="number"
              value={distance}
              onChange={(e) => setDistance(e.target.value)}
              placeholder="Ex: 15000"
              className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 
                text-white placeholder-gray-400 focus:outline-none focus:border-cyan-500"
              min="0"
              max="100000"
              step="100"
              required
            />
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
                text-white placeholder-gray-400 focus:outline-none focus:border-green-500"
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
              placeholder="Ex: Boa resistência, pernas fortes..."
              className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 
                text-white placeholder-gray-400 focus:outline-none focus:border-blue-500 
                resize-none h-24"
              maxLength={300}
            />
          </div>

          <div className="flex gap-3">
            <button
              onClick={() => navigate('/academia')}
              className="flex-1 py-3 bg-white/10 text-white rounded-xl hover:bg-white/20 transition-colors"
              disabled={isLoading}
            >
              Cancelar
            </button>
            <button
              onClick={handleSubmit}
              disabled={isLoading || !duration || !heartRate || !calories || !distance}
              className={`flex-1 py-3 rounded-xl font-bold transition-all ${
                !isLoading && duration && heartRate && calories && distance
                  ? 'bg-gradient-to-r from-cyan-600 to-blue-600 text-white hover:opacity-90'
                  : 'bg-gray-700 text-gray-400 cursor-not-allowed'
              }`}
            >
              {isLoading ? 'Enviando...' : 'Registrar Treino'}
            </button>
          </div>
        </div>

        {duration && distance && (
          <div className="bg-cyan-500/10 rounded-2xl p-6 border border-cyan-500/20">
            <h3 className="text-lg font-bold text-white mb-4">
              <i className="fas fa-calculator mr-2"></i>
              Estatísticas
            </h3>
            <div className="grid grid-cols-2 gap-4">
              <div className="bg-white/5 rounded-xl p-4 text-center">
                <div className="text-cyan-300 text-sm mb-1">Velocidade</div>
                <div className="text-white font-bold text-xl">
                  {((parseInt(distance) / 1000) / (parseInt(duration) / 60)).toFixed(1)} km/h
                </div>
              </div>
              <div className="bg-white/5 rounded-xl p-4 text-center">
                <div className="text-cyan-300 text-sm mb-1">Distância</div>
                <div className="text-white font-bold text-xl">
                  {(parseInt(distance) / 1000).toFixed(2)} km
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default SpinningRegistration;