import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, BehaviorSubject, of } from 'rxjs';
import { map, catchError } from 'rxjs/operators';
import { YogaPose, UserInput, YogaSession, SessionPose, FlowPhase } from '../models/yoga.models';

@Injectable({
  providedIn: 'root'
})
export class YogaService {
  private posesSubject = new BehaviorSubject<YogaPose[]>([]);
  private sessionsSubject = new BehaviorSubject<YogaSession[]>([]);
  
  poses$ = this.posesSubject.asObservable();
  sessions$ = this.sessionsSubject.asObservable();

  private flowPhases: FlowPhase[] = [
    {
      name: 'Warm-up',
      duration_percentage: 15,
      pose_types: ['warm-up'],
      description: 'Gentle movements to prepare the body'
    },
    {
      name: 'Main Practice',
      duration_percentage: 70,
      pose_types: ['standing', 'seated', 'supine', 'prone', 'backbend', 'forward-fold', 'twist', 'arm-balance'],
      description: 'Core poses targeting your specific needs'
    },
    {
      name: 'Cool Down',
      duration_percentage: 15,
      pose_types: ['cool-down', 'supine'],
      description: 'Relaxing poses to integrate the practice'
    }
  ];

  constructor(private http: HttpClient) {
    this.loadPoses();
    this.loadSessions();
  }

  private loadPoses(): void {
    this.http.get<YogaPose[]>('/assets/data/yoga-poses.json')
      .pipe(
        catchError(error => {
          console.error('Error loading poses:', error);
          return of([]);
        })
      )
      .subscribe(poses => {
        this.posesSubject.next(poses);
      });
  }

  private loadSessions(): void {
    const saved = localStorage.getItem('yoga-sessions');
    if (saved) {
      try {
        const sessions = JSON.parse(saved);
        this.sessionsSubject.next(sessions);
      } catch (error) {
        console.error('Error loading saved sessions:', error);
        this.sessionsSubject.next([]);
      }
    }
  }

  private saveSessions(sessions: YogaSession[]): void {
    localStorage.setItem('yoga-sessions', JSON.stringify(sessions));
  }

  generateSession(userInput: UserInput): Observable<YogaSession> {
    return this.poses$.pipe(
      map(poses => {
        if (poses.length === 0) {
          throw new Error('No poses available');
        }

        const session = this.createSessionFromInput(userInput, poses);
        
        // Save the session
        const currentSessions = this.sessionsSubject.value;
        const updatedSessions = [...currentSessions, session];
        this.sessionsSubject.next(updatedSessions);
        this.saveSessions(updatedSessions);

        return session;
      })
    );
  }

  private createSessionFromInput(userInput: UserInput, poses: YogaPose[]): YogaSession {
    const sessionId = this.generateSessionId();
    const filteredPoses = this.filterPosesByInput(poses, userInput);
    const sessionPoses = this.createSessionFlow(filteredPoses, userInput);
    
    const session: YogaSession = {
      id: sessionId,
      title: this.generateSessionTitle(userInput),
      description: this.generateSessionDescription(userInput),
      duration: userInput.duration,
      level: userInput.level,
      poses: sessionPoses,
      createdAt: new Date(),
      userInput
    };

    return session;
  }

  private filterPosesByInput(poses: YogaPose[], input: UserInput): YogaPose[] {
    return poses.filter(pose => {
      // Filter by difficulty level
      const levelMatch = this.isLevelAppropriate(pose.difficulty, input.level);
      if (!levelMatch) return false;

      // Filter by focus areas
      if (input.focusAreas && input.focusAreas.length > 0) {
        const focusMatch = input.focusAreas.some(area => 
          pose.targets.some(target => target.toLowerCase().includes(area.toLowerCase()))
        );
        if (!focusMatch && pose.type !== 'warm-up' && pose.type !== 'cool-down') {
          return false;
        }
      }

      // Filter by goal
      if (input.goal) {
        const goalMatch = this.doesPoseMatchGoal(pose, input.goal);
        if (!goalMatch && pose.type !== 'warm-up' && pose.type !== 'cool-down') {
          return false;
        }
      }

      return true;
    });
  }

  private isLevelAppropriate(poseLevel: string, userLevel: string): boolean {
    const levels = { beginner: 1, intermediate: 2, advanced: 3 };
    const poseLevelNum = levels[poseLevel as keyof typeof levels] || 1;
    const userLevelNum = levels[userLevel as keyof typeof levels] || 1;
    
    // Allow poses at user level or below, plus one level above for intermediate/advanced
    return poseLevelNum <= userLevelNum + (userLevel === 'beginner' ? 0 : 1);
  }

  private doesPoseMatchGoal(pose: YogaPose, goal: string): boolean {
    const goalMappings = {
      'relaxation': ['relaxation', 'stretching'],
      'energy': ['strengthening', 'cardio'],
      'strength': ['strengthening', 'core'],
      'flexibility': ['stretching'],
      'balance': ['balancing'],
      'focus': ['balancing', 'relaxation']
    };

    const categories = goalMappings[goal as keyof typeof goalMappings] || [];
    return categories.includes(pose.category);
  }

  private createSessionFlow(poses: YogaPose[], input: UserInput): SessionPose[] {
    const sessionPoses: SessionPose[] = [];
    const totalDurationSeconds = input.duration * 60;

    // Allocate time for each phase
    for (const phase of this.flowPhases) {
      const phaseDuration = Math.floor(totalDurationSeconds * phase.duration_percentage / 100);
      const phasePoses = poses.filter(pose => phase.pose_types.includes(pose.type));
      
      if (phasePoses.length > 0) {
        const selectedPoses = this.selectPosesForPhase(phasePoses, phaseDuration, phase.name);
        sessionPoses.push(...selectedPoses);
      }
    }

    // Ensure we always end with Savasana
    const savasana = poses.find(pose => pose.id === 'savasana');
    if (savasana && !sessionPoses.some(sp => sp.pose.id === 'savasana')) {
      sessionPoses.push({
        pose: savasana,
        duration: Math.min(300, Math.floor(totalDurationSeconds * 0.1)), // 10% of session or 5 minutes max
        transition: 'Rest and integrate your practice'
      });
    }

    return sessionPoses;
  }

  private selectPosesForPhase(poses: YogaPose[], phaseDuration: number, phaseName: string): SessionPose[] {
    const sessionPoses: SessionPose[] = [];
    let remainingTime = phaseDuration;

    // For warm-up, prioritize gentle movements
    if (phaseName === 'Warm-up') {
      const gentlePoses = poses.filter(pose => 
        pose.type === 'warm-up' || pose.difficulty === 'beginner'
      );
      poses = gentlePoses.length > 0 ? gentlePoses : poses;
    }

    // Shuffle poses for variety
    const shuffledPoses = [...poses].sort(() => Math.random() - 0.5);

    for (const pose of shuffledPoses) {
      if (remainingTime <= 0) break;

      const duration = Math.min(pose.duration_s, remainingTime);
      if (duration >= 30) { // Minimum 30 seconds per pose
        sessionPoses.push({
          pose,
          duration,
          transition: this.generateTransition(pose, phaseName)
        });
        remainingTime -= duration;
      }
    }

    return sessionPoses;
  }

  private generateTransition(pose: YogaPose, phaseName: string): string {
    const transitions = {
      'Warm-up': [
        'Take a deep breath as you move into this pose',
        'Move slowly and mindfully',
        'Listen to your body'
      ],
      'Main Practice': [
        'Engage your core as you transition',
        'Use your breath to guide the movement',
        'Find stability before deepening'
      ],
      'Cool Down': [
        'Soften into this pose',
        'Let your body relax',
        'Release any tension'
      ]
    };

    const phaseTransitions = transitions[phaseName as keyof typeof transitions] || transitions['Main Practice'];
    return phaseTransitions[Math.floor(Math.random() * phaseTransitions.length)];
  }

  private generateSessionTitle(input: UserInput): string {
    const goalTitles = {
      'relaxation': 'Calming Flow',
      'energy': 'Energizing Practice',
      'strength': 'Power Yoga Session',
      'flexibility': 'Deep Stretch Flow',
      'balance': 'Balance & Focus',
      'focus': 'Mindful Movement'
    };

    const baseTitle = input.goal ? goalTitles[input.goal] || 'Custom Yoga Flow' : 'Personalized Yoga Session';
    const duration = `${input.duration} min`;
    const level = input.level.charAt(0).toUpperCase() + input.level.slice(1);

    return `${baseTitle} • ${duration} • ${level}`;
  }

  private generateSessionDescription(input: UserInput): string {
    let description = `A ${input.duration}-minute ${input.level} level practice`;
    
    if (input.goal) {
      const goalDescriptions = {
        'relaxation': 'designed to calm your mind and release tension',
        'energy': 'to energize your body and boost your mood',
        'strength': 'focused on building strength and stability',
        'flexibility': 'to increase flexibility and ease',
        'balance': 'for improving balance and concentration',
        'focus': 'to enhance mindfulness and mental clarity'
      };
      description += ` ${goalDescriptions[input.goal]}`;
    }

    if (input.focusAreas && input.focusAreas.length > 0) {
      description += `, with special attention to your ${input.focusAreas.join(', ')}`;
    }

    return description + '.';
  }

  private generateSessionId(): string {
    return Date.now().toString(36) + Math.random().toString(36).substr(2);
  }

  getSessionById(id: string): Observable<YogaSession | undefined> {
    return this.sessions$.pipe(
      map(sessions => sessions.find(session => session.id === id))
    );
  }

  deleteSession(id: string): void {
    const currentSessions = this.sessionsSubject.value;
    const updatedSessions = currentSessions.filter(session => session.id !== id);
    this.sessionsSubject.next(updatedSessions);
    this.saveSessions(updatedSessions);
  }

  getAllPoses(): Observable<YogaPose[]> {
    return this.poses$;
  }

  getPosesByCategory(category: string): Observable<YogaPose[]> {
    return this.poses$.pipe(
      map(poses => poses.filter(pose => pose.category === category))
    );
  }

  searchPoses(query: string): Observable<YogaPose[]> {
    return this.poses$.pipe(
      map(poses => poses.filter(pose =>
        pose.name_english.toLowerCase().includes(query.toLowerCase()) ||
        pose.name_sanskrit.toLowerCase().includes(query.toLowerCase()) ||
        pose.targets.some(target => target.toLowerCase().includes(query.toLowerCase()))
      ))
    );
  }
}
