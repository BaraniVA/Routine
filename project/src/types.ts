export interface RoutineStep {
  id: string;
  title: string;
  duration: number;
  completed: boolean;
  musicUrl?: string;
  musicPlatform?: 'spotify' | 'amazon';
}

export interface Routine {
  id: string;
  title: string;
  description: string;
  category: 'morning' | 'evening' | 'workout' | 'meditation' | 'custom' | string;
  steps: RoutineStep[];
}

export interface NewRoutineFormData {
  title: string;
  description: string;
  category: Routine['category'];
}</content>