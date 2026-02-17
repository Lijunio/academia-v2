// src/types/activities.types.ts
export type ActivityType = 'academia' | 'natacao' | 'pilates';

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
  distance: number; // em metros
  style: 'crawl' | 'backstroke' | 'breaststroke' | 'butterfly' | 'mixed';
  poolLength: 25 | 50; // comprimento da piscina
}

export interface PilatesActivity extends BaseActivity {
  type: 'pilates';
  focusArea: 'core' | 'flexibility' | 'strength' | 'posture' | 'breathing';
  difficulty: 1 | 2 | 3 | 4 | 5; // 1-5
}

export type Activity = SwimmingActivity | PilatesActivity;