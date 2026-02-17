// services/telegram.service.ts
import { WorkoutReport } from '../types/workout.types';

const TELEGRAM_BOT_TOKEN = process.env.REACT_APP_TELEGRAM_BOT_TOKEN || '';
const TELEGRAM_CHAT_ID = process.env.REACT_APP_TELEGRAM_CHAT_ID || '';

export interface TelegramMessage {
  chat_id: string;
  text: string;
  parse_mode?: 'HTML' | 'Markdown';
}

// Função para formatar tempo
const formatTime = (seconds: number): string => {
  const mins = Math.floor(seconds / 60);
  const secs = seconds % 60;
  return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
};

// Função para salvar relatório com falha (simulação)
const saveFailedReport = (report: WorkoutReport) => {
  try {
    const failedReports = JSON.parse(localStorage.getItem('failed-telegram-reports') || '[]');
    failedReports.push({
      ...report,
      failedAt: new Date().toISOString()
    });
    localStorage.setItem('failed-telegram-reports', JSON.stringify(failedReports));
  } catch (error) {
    console.error('Erro ao salvar relatório com falha:', error);
  }
};

export const sendWorkoutReport = async (report: WorkoutReport): Promise<boolean> => {
  try {
    // Verificar se temos token e chat ID
    if (!TELEGRAM_BOT_TOKEN || !TELEGRAM_CHAT_ID) {
      console.warn('Token ou Chat ID do Telegram não configurados');
      saveFailedReport(report);
      return false;
    }

    const message = formatReportForTelegram(report);
    
    const response = await fetch(`https://api.telegram.org/bot${TELEGRAM_BOT_TOKEN}/sendMessage`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        chat_id: TELEGRAM_CHAT_ID,
        text: message,
        parse_mode: 'HTML'
      })
    });
    
    const data = await response.json();
    
    if (data.ok === true) {
      console.log('✅ Relatório enviado para Telegram com sucesso');
      return true;
    } else {
      console.error('❌ Erro ao enviar para Telegram:', data);
      saveFailedReport(report);
      return false;
    }
    
  } catch (error) {
    console.error('Erro ao enviar para Telegram:', error);
    saveFailedReport(report);
    return false;
  }
};

const formatReportForTelegram = (report: WorkoutReport): string => {
  const time = formatTime(report.duration);
  const date = new Date(report.date).toLocaleDateString('pt-BR');
  
  let message = `🏋️ <b>RELATÓRIO DE TREINO ${report.workoutType}</b>\n`;
  message += `📅 ${date} | ⏱️ ${time} | 🔥 ${report.totalCalories} kcal\n\n`;
  
  message += `<b>EXERCÍCIOS REALIZADOS:</b>\n`;
  
  report.exercises.forEach((ex: any, index: number) => {
    if (ex.completed) {
      message += `${index + 1}. ${ex.name}\n`;
      message += `   🏋️ ${ex.weight}kg | ${ex.sets} séries\n`;
      if (ex.variation) message += `   🔄 ${ex.variation}\n`;
      if (ex.observations) message += `   📝 ${ex.observations}\n`;
    } else {
      message += `${index + 1}. ❌ ${ex.name} (${ex.skipReason || 'Não realizado'})\n`;
    }
    message += '\n';
  });
  
  return message;
};

// Função para retentar envios com falha
export const retryFailedReports = async (): Promise<number> => {
  try {
    const failedReports = JSON.parse(localStorage.getItem('failed-telegram-reports') || '[]');
    let successCount = 0;
    
    for (const failedReport of failedReports) {
      const success = await sendWorkoutReport(failedReport);
      if (success) successCount++;
    }
    
    // Remover relatórios enviados com sucesso
    if (successCount > 0) {
      const remainingReports = failedReports.slice(successCount);
      localStorage.setItem('failed-telegram-reports', JSON.stringify(remainingReports));
    }
    
    return successCount;
  } catch (error) {
    console.error('Erro ao retentar envios:', error);
    return 0;
  }
};