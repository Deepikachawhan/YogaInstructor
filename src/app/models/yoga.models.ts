export interface YogaPose {
  id: string;
  name_english: string;
  name_sanskrit: string;
  difficulty: 'beginner' | 'intermediate' | 'advanced';
  type: 'warm-up' | 'standing' | 'seated' | 'supine' | 'prone' | 'inversion' | 'backbend' | 'forward-fold' | 'twist' | 'arm-balance' | 'cool-down';
  category: 'strengthening' | 'stretching' | 'balancing' | 'relaxation' | 'core' | 'cardio';
  targets: string[];
  duration_s: number;
  image_url: string;
  benefits: string[];
  instructions: string[];
  modifications: string[];
  contraindications: string[];
  tags: string[];
}

export interface UserInput {
  description?: string;
  goal?: 'relaxation' | 'energy' | 'strength' | 'flexibility' | 'balance' | 'focus';
  focusAreas?: string[];
  duration: number; // in minutes
  level: 'beginner' | 'intermediate' | 'advanced';
  painPoints?: string[];
  mood?: string;
  energy?: 'low' | 'medium' | 'high';
}

export interface YogaSession {
  id: string;
  title: string;
  description: string;
  duration: number; // total duration in minutes
  level: 'beginner' | 'intermediate' | 'advanced';
  poses: SessionPose[];
  createdAt: Date;
  userInput: UserInput;
}

export interface SessionPose {
  pose: YogaPose;
  duration: number; // duration for this pose in seconds
  side?: 'left' | 'right' | 'both';
  repetitions?: number;
  transition?: string;
  notes?: string;
}

export interface FlowPhase {
  name: string;
  duration_percentage: number;
  pose_types: string[];
  description: string;
}
