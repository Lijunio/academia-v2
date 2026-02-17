// src/pages/Pilates/PilatesRegistration.tsx
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { PilatesActivity } from '../../types/activities.types';
import { workoutService } from '../../services/supabase.service';

const PilatesRegistration: React.FC = () => {
  const navigate = useNavigate();

  const [duration, setDuration] = useState('');
  const [heartRate, setHeartRate] = useState('');
  const [calories, setCalories] = useState('');
  const [notes, setNotes] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async () => {
    if (!duration || !heartRate || !calories) {
      alert('Preencha todos os campos obrigatórios');
      return;
    }

    const activity: PilatesActivity = {
      id: `pilates-${Date.now()}`,
      type: 'pilates',
      date: new Date(),
      duration: parseInt(duration) * 60,
      calories: parseInt(calories),
      heartRate: parseInt(heartRate),
      focusArea: 'core',
      difficulty: 3,
      notes: notes || undefined
    };

    setIsLoading(true);
    
    try {
      // 1. Salvar no LOCALSTORAGE
      const existing = JSON.parse(localStorage.getItem('pilates-activities') || '[]');
      localStorage.setItem('pilates-activities', JSON.stringify([...existing, activity]));
      
      // 2. Salvar no SUPABASE
      await workoutService.save({
        type: 'pilates',
        date: new Date(),
        duration: parseInt(duration) * 60,
        calories: parseInt(calories),
        heart_rate: parseInt(heartRate),
        details: {
          focusArea: 'core',
          difficulty: 3
        },
        notes: notes || undefined
      });
      
      // 3. Enviar para TELEGRAM
      await sendTelegramReport(activity);
      
      alert('Sessão de pilates registrada com sucesso!');
      navigate('/');
      
    } catch (error) {
      console.error('Erro:', error);
      alert('Erro ao salvar. Tente novamente.');
    } finally {
      setIsLoading(false);
    }
  };

  const sendTelegramReport = async (activity: PilatesActivity): Promise<boolean> => {
    try {
      const formatDuration = (seconds: number): string => {
        const mins = Math.floor(seconds / 60);
        return `${mins} min`;
      };

      const message = `
🧘‍♀️ *RELATÓRIO DE PILATES* 🧘‍♂️

📅 *Data:* ${activity.date.toLocaleDateString('pt-BR')}
⏰ *Hora:* ${activity.date.toLocaleTimeString('pt-BR')}
⏱️ *Duração:* ${formatDuration(activity.duration)}

📊 *MÉTRICAS:*
├ 💓 FC Média: ${activity.heartRate} bpm
└ 🔥 Calorias: ${activity.calories} kcal

📈 *ANÁLISE:*
├ ⚡ Intensidade: ${(activity.calories / (activity.duration / 60)).toFixed(1)} kcal/min
└ 🏆 Performance: ${activity.heartRate < 100 ? 'Leve' : activity.heartRate < 130 ? 'Moderada' : 'Alta'}

${activity.notes ? `📝 *OBSERVAÇÕES:*\n${activity.notes}\n` : ''}

💪 *PRÓXIMOS PASSOS:*
• Manter respiração controlada
• Aumentar tempo de isometria
• Trabalhar alinhamento postural

      `.trim();

      const TELEGRAM_BOT_TOKEN = '8161835192:AAFubpl3R2sgO5GfbnrRXrlNt5KNOtMn2nA';
      const TELEGRAM_CHAT_ID = '-1003838510525';

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
    <div className="min-h-screen bg-gradient-to-b from-green-900/20 to-black">
      <div className="container mx-auto px-4 py-8 max-w-4xl">
        
        {/* HEADER */}
        <div className="mb-10">
          <button
            onClick={() => navigate('/')}
            className="mb-6 inline-flex items-center gap-2 text-green-300 hover:text-white transition-colors"
          >
            <i className="fas fa-arrow-left"></i>
            Voltar
          </button>
          
          <div className="flex items-center gap-4 mb-6">
            <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-green-500 to-emerald-400 
              flex items-center justify-center">
              <i className="fas fa-spa text-2xl text-white"></i>
            </div>
            <div>
              <h1 className="text-3xl font-bold text-white">Pilates</h1>
              <p className="text-green-300">Registro de sessão de controle e flexibilidade</p>
            </div>
          </div>
        </div>

        {/* FORM */}
        <div className="bg-gradient-to-br from-secondary-dark/50 to-black/50 rounded-2xl p-6 
          border border-white/10 mb-8">
          
          <h2 className="text-xl font-bold text-white mb-6">📋 Dados da Sessão</h2>
          
          {/* DURAÇÃO */}
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
                text-white placeholder-gray-400 focus:outline-none focus:border-green-500"
              min="15"
              max="180"
              required
            />
          </div>

          {/* FREQUÊNCIA CARDÍACA */}
          <div className="mb-4">
            <label className="block text-white mb-2">
              Frequência cardíaca média (bpm) *
            </label>
            <input
              type="number"
              value={heartRate}
              onChange={(e) => setHeartRate(e.target.value)}
              placeholder="Ex: 95"
              className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 
                text-white placeholder-gray-400 focus:outline-none focus:border-red-500"
              min="50"
              max="180"
              required
            />
          </div>

          {/* CALORIAS */}
          <div className="mb-6">
            <label className="block text-white mb-2">
              Calorias perdidas (kcal) *
            </label>
            <input
              type="number"
              value={calories}
              onChange={(e) => setCalories(e.target.value)}
              placeholder="Ex: 180"
              className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 
                text-white placeholder-gray-400 focus:outline-none focus:border-orange-500"
              min="0"
              max="500"
              required
            />
          </div>

          {/* OBSERVAÇÕES */}
          <div className="mb-8">
            <label className="block text-white mb-2">
              Observações (opcional)
            </label>
            <textarea
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="Ex: Dificuldade no 'The Hundred', melhorou respiração..."
              className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 
                text-white placeholder-gray-400 focus:outline-none focus:border-blue-500 
                resize-none h-24"
              maxLength={300}
            />
          </div>

          {/* BOTÕES */}
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
              disabled={isLoading || !duration || !heartRate || !calories}
              className={`flex-1 py-3 rounded-xl font-bold transition-all ${
                !isLoading && duration && heartRate && calories
                  ? 'bg-gradient-to-r from-green-600 to-emerald-600 text-white hover:opacity-90'
                  : 'bg-gray-700 text-gray-400 cursor-not-allowed'
              }`}
            >
              {isLoading ? 'Enviando...' : 'Registrar Sessão'}
            </button>
          </div>
        </div>

        {/* ESTATÍSTICAS */}
        {duration && calories && heartRate && (
          <div className="bg-green-500/10 rounded-2xl p-6 border border-green-500/20">
            <h3 className="text-lg font-bold text-white mb-4">
              <i className="fas fa-chart-line mr-2"></i>
              Análise da Sessão
            </h3>
            <div className="grid grid-cols-2 gap-4">
              <div className="bg-white/5 rounded-xl p-4 text-center">
                <div className="text-green-300 text-sm mb-1">Intensidade</div>
                <div className="text-white font-bold text-xl">
                  {(parseInt(calories) / parseInt(duration)).toFixed(1)} kcal/min
                </div>
              </div>
              <div className="bg-white/5 rounded-xl p-4 text-center">
                <div className="text-green-300 text-sm mb-1">Zona FC</div>
                <div className="text-white font-bold text-xl">
                  {parseInt(heartRate) < 100 ? 'Descanso' :
                   parseInt(heartRate) < 120 ? 'Leve' :
                   parseInt(heartRate) < 140 ? 'Moderada' : 'Alta'}
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default PilatesRegistration;