// src/types/activities.types.ts
export type ActivityType = 'academia' | 'natacao' | 'pilates' | 'esteira' | 'spinning';

export interface BaseActivity {
  id: string;
  type: ActivityType;
  date: Date;
  duration: number; // em segundos
  calories: number;
  heartRate: number;
  notes?: string;
}

export interface SwimmingActivity extends BaseActivity {
  type: 'natacao';
  distance: number;
  style: 'crawl' | 'backstroke' | 'breaststroke' | 'butterfly' | 'mixed';
  poolLength: 25 | 50;
}

export interface PilatesActivity extends BaseActivity {
  type: 'pilates';
  focusArea: 'core' | 'flexibility' | 'strength' | 'posture' | 'breathing';
  difficulty: 1 | 2 | 3 | 4 | 5;
  equipment?: string[];
}

export interface EsteiraActivity extends BaseActivity {
  type: 'esteira';
  distance: number; // em metros
  avgSpeed?: number; // ✅ Velocidade média em km/h (calculada)
}

export interface SpinningActivity extends BaseActivity {
  type: 'spinning';
  distance: number; // em metros
}

export type Activity = SwimmingActivity | PilatesActivity | EsteiraActivity | SpinningActivity;