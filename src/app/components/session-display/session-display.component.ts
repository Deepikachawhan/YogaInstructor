import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
import { YogaService } from '../../services/yoga.service';
import { YogaSession, SessionPose } from '../../models/yoga.models';
import { Observable, interval, Subscription } from 'rxjs';
import { map, takeWhile } from 'rxjs/operators';

@Component({
  selector: 'app-session-display',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="session-container" *ngIf="session">
      <!-- Session Header -->
      <div class="session-header">
        <div class="container">
          <div class="header-content">
            <div class="session-info">
              <h1 class="session-title">{{ session.title }}</h1>
              <p class="session-description">{{ session.description }}</p>
              <div class="session-meta">
                <span class="meta-item">
                  <span class="meta-icon">⏱️</span>
                  {{ session.duration }} minutes
                </span>
                <span class="meta-item">
                  <span class="meta-icon">📊</span>
                  {{ session.level }}
                </span>
                <span class="meta-item">
                  <span class="meta-icon">🧘‍♀️</span>
                  {{ session.poses.length }} poses
                </span>
              </div>
            </div>
            <div class="session-controls">
              <button 
                class="btn btn-primary btn-large"
                [class.btn-secondary]="isPlaying"
                (click)="toggleSession()"
              >
                <span *ngIf="!isPlaying">▶️ Start Practice</span>
                <span *ngIf="isPlaying && !isPaused">⏸️ Pause</span>
                <span *ngIf="isPlaying && isPaused">▶️ Resume</span>
              </button>
              <button class="btn btn-ghost" (click)="resetSession()" *ngIf="isPlaying">
                🔄 Reset
              </button>
            </div>
          </div>
        </div>
      </div>

      <!-- Practice Area -->
      <div class="practice-area" *ngIf="isPlaying">
        <div class="container">
          <!-- Progress Bar -->
          <div class="progress-container">
            <div class="progress-bar">
              <div 
                class="progress-fill" 
                [style.width.%]="overallProgress"
              ></div>
            </div>
            <div class="progress-text">
              {{ currentPoseIndex + 1 }} of {{ session.poses.length }} poses
            </div>
          </div>

          <!-- Current Pose Display -->
          <div class="current-pose" *ngIf="currentPose">
            <div class="pose-content">
              <div class="pose-image">
                <img 
                  [src]="currentPose.pose.image_url" 
                  [alt]="currentPose.pose.name_english"
                  (error)="onImageError($event)"
                >
                <div class="pose-timer">
                  <div class="timer-display">
                    {{ formatTime(poseTimeRemaining) }}
                  </div>
                  <div class="timer-circle">
                    <svg width="80" height="80">
                      <circle
                        cx="40"
                        cy="40"
                        r="35"
                        stroke="#e9ecef"
                        stroke-width="3"
                        fill="none"
                      />
                      <circle
                        cx="40"
                        cy="40"
                        r="35"
                        stroke="#6B73FF"
                        stroke-width="3"
                        fill="none"
                        [style.stroke-dasharray]="circumference"
                        [style.stroke-dashoffset]="circleOffset"
                        style="transform: rotate(-90deg); transform-origin: 50% 50%;"
                      />
                    </svg>
                  </div>
                </div>
              </div>

              <div class="pose-details">
                <h2 class="pose-name">
                  {{ currentPose.pose.name_english }}
                  <span class="sanskrit-name">{{ currentPose.pose.name_sanskrit }}</span>
                </h2>
                
                <div class="pose-instructions">
                  <h3>Instructions</h3>
                  <ul>
                    <li *ngFor="let instruction of currentPose.pose.instructions">
                      {{ instruction }}
                    </li>
                  </ul>
                </div>

                <div class="pose-benefits" *ngIf="currentPose.pose.benefits.length > 0">
                  <h3>Benefits</h3>
                  <div class="benefits-tags">
                    <span 
                      *ngFor="let benefit of currentPose.pose.benefits.slice(0, 3)" 
                      class="benefit-tag"
                    >
                      {{ benefit }}
                    </span>
                  </div>
                </div>

                <div class="pose-transition" *ngIf="currentPose.transition">
                  <p class="transition-text">
                    <span class="transition-icon">💭</span>
                    {{ currentPose.transition }}
                  </p>
                </div>
              </div>
            </div>

            <!-- Pose Navigation -->
            <div class="pose-navigation">
              <button 
                class="btn btn-ghost"
                (click)="previousPose()"
                [disabled]="currentPoseIndex === 0"
              >
                ⬅️ Previous
              </button>
              
              <div class="navigation-info">
                <span class="current-pose-indicator">
                  Pose {{ currentPoseIndex + 1 }}: {{ currentPose.pose.name_english }}
                </span>
              </div>

              <button 
                class="btn btn-ghost"
                (click)="nextPose()"
                [disabled]="currentPoseIndex === session.poses.length - 1"
              >
                Next ⮕
              </button>
            </div>
          </div>
        </div>
      </div>

      <!-- Session Overview (when not practicing) -->
      <div class="session-overview" *ngIf="!isPlaying">
        <div class="container">
          <h2 class="overview-title">Your Practice Flow</h2>
          <div class="poses-list">
            <div 
              class="pose-card"
              *ngFor="let sessionPose of session.poses; let i = index"
              [class.completed]="i < currentPoseIndex"
              [class.current]="i === currentPoseIndex && isPlaying"
            >
              <div class="pose-card-image">
                <img 
                  [src]="sessionPose.pose.image_url" 
                  [alt]="sessionPose.pose.name_english"
                  (error)="onImageError($event)"
                >
              </div>
              <div class="pose-card-content">
                <h3 class="pose-card-title">
                  {{ sessionPose.pose.name_english }}
                  <span class="pose-duration">{{ formatTime(sessionPose.duration) }}</span>
                </h3>
                <p class="pose-card-description">
                  {{ sessionPose.pose.benefits[0] || 'Focus on your breath and alignment' }}
                </p>
                <div class="pose-card-meta">
                  <span class="difficulty">{{ sessionPose.pose.difficulty }}</span>
                  <span class="type">{{ sessionPose.pose.type }}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Session Complete -->
      <div class="session-complete" *ngIf="isSessionComplete">
        <div class="container">
          <div class="complete-content">
            <div class="complete-icon">🎉</div>
            <h2>Practice Complete!</h2>
            <p>You've completed your {{ session.duration }}-minute yoga session.</p>
            <div class="complete-actions">
              <button class="btn btn-primary" (click)="router.navigate(['/'])">
                Back to Home
              </button>
              <button class="btn btn-secondary" (click)="resetSession()">
                Practice Again
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Loading State -->
    <div class="loading-container" *ngIf="!session">
      <div class="loading-content">
        <div class="loading-spinner"></div>
        <p>Loading your yoga session...</p>
      </div>
    </div>
  `,
  styles: [`
    .session-container {
      min-height: 100vh;
      background: var(--light-gray);
    }

    /* Session Header */
    .session-header {
      background: var(--white);
      box-shadow: var(--shadow-sm);
      padding: var(--spacing-xl) 0;
    }

    .header-content {
      display: flex;
      justify-content: space-between;
      align-items: flex-start;
      gap: var(--spacing-xl);
    }

    .session-info {
      flex: 1;
    }

    .session-title {
      font-size: 2rem;
      margin-bottom: var(--spacing-sm);
      color: var(--black);
    }

    .session-description {
      color: var(--dark-gray);
      margin-bottom: var(--spacing-md);
      line-height: 1.6;
    }

    .session-meta {
      display: flex;
      gap: var(--spacing-lg);
      flex-wrap: wrap;
    }

    .meta-item {
      display: flex;
      align-items: center;
      gap: var(--spacing-xs);
      font-size: 0.875rem;
      color: var(--dark-gray);
    }

    .meta-icon {
      font-size: 1rem;
    }

    .session-controls {
      display: flex;
      gap: var(--spacing-md);
      flex-shrink: 0;
    }

    /* Practice Area */
    .practice-area {
      padding: var(--spacing-xl) 0;
    }

    .progress-container {
      margin-bottom: var(--spacing-xl);
    }

    .progress-bar {
      width: 100%;
      height: 8px;
      background: var(--medium-gray);
      border-radius: var(--radius-sm);
      overflow: hidden;
      margin-bottom: var(--spacing-sm);
    }

    .progress-fill {
      height: 100%;
      background: var(--gradient-primary);
      transition: width 0.3s ease;
    }

    .progress-text {
      text-align: center;
      color: var(--dark-gray);
      font-size: 0.875rem;
    }

    /* Current Pose */
    .current-pose {
      background: var(--white);
      border-radius: var(--radius-lg);
      box-shadow: var(--shadow-lg);
      overflow: hidden;
    }

    .pose-content {
      display: grid;
      grid-template-columns: 1fr 1fr;
      min-height: 500px;
    }

    .pose-image {
      position: relative;
      background: var(--light-gray);
      display: flex;
      align-items: center;
      justify-content: center;
    }

    .pose-image img {
      width: 100%;
      height: 100%;
      object-fit: cover;
    }

    .pose-timer {
      position: absolute;
      top: var(--spacing-lg);
      right: var(--spacing-lg);
      background: rgba(255, 255, 255, 0.9);
      border-radius: var(--radius-full);
      padding: var(--spacing-md);
      display: flex;
      align-items: center;
      justify-content: center;
    }

    .timer-display {
      position: absolute;
      font-size: 1.125rem;
      font-weight: 600;
      color: var(--primary-color);
    }

    .timer-circle svg {
      transform: rotate(-90deg);
    }

    .pose-details {
      padding: var(--spacing-xxl);
      overflow-y: auto;
    }

    .pose-name {
      font-size: 1.75rem;
      margin-bottom: var(--spacing-lg);
      color: var(--black);
    }

    .sanskrit-name {
      display: block;
      font-size: 1rem;
      color: var(--dark-gray);
      font-style: italic;
      font-weight: 400;
    }

    .pose-instructions h3,
    .pose-benefits h3 {
      font-size: 1.125rem;
      margin-bottom: var(--spacing-md);
      color: var(--black);
    }

    .pose-instructions ul {
      list-style: none;
      margin-bottom: var(--spacing-lg);
    }

    .pose-instructions li {
      margin-bottom: var(--spacing-sm);
      padding-left: var(--spacing-md);
      position: relative;
    }

    .pose-instructions li::before {
      content: '•';
      color: var(--primary-color);
      position: absolute;
      left: 0;
    }

    .benefits-tags {
      display: flex;
      flex-wrap: wrap;
      gap: var(--spacing-sm);
      margin-bottom: var(--spacing-lg);
    }

    .benefit-tag {
      background: var(--light-gray);
      padding: var(--spacing-xs) var(--spacing-sm);
      border-radius: var(--radius-sm);
      font-size: 0.875rem;
      color: var(--dark-gray);
    }

    .pose-transition {
      margin-top: auto;
      padding-top: var(--spacing-lg);
      border-top: 1px solid var(--medium-gray);
    }

    .transition-text {
      display: flex;
      align-items: center;
      gap: var(--spacing-sm);
      font-style: italic;
      color: var(--dark-gray);
      margin: 0;
    }

    .transition-icon {
      font-size: 1.125rem;
    }

    /* Pose Navigation */
    .pose-navigation {
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding: var(--spacing-lg) var(--spacing-xxl);
      background: var(--light-gray);
      border-top: 1px solid var(--medium-gray);
    }

    .navigation-info {
      text-align: center;
    }

    .current-pose-indicator {
      font-weight: 500;
      color: var(--dark-gray);
    }

    /* Session Overview */
    .session-overview {
      padding: var(--spacing-xl) 0;
    }

    .overview-title {
      text-align: center;
      margin-bottom: var(--spacing-xl);
      color: var(--black);
    }

    .poses-list {
      display: grid;
      grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
      gap: var(--spacing-lg);
    }

    .pose-card {
      background: var(--white);
      border-radius: var(--radius-lg);
      overflow: hidden;
      box-shadow: var(--shadow-md);
      transition: all 0.2s ease;
    }

    .pose-card:hover {
      transform: translateY(-4px);
      box-shadow: var(--shadow-lg);
    }

    .pose-card.completed {
      opacity: 0.7;
    }

    .pose-card.current {
      border: 3px solid var(--primary-color);
    }

    .pose-card-image {
      height: 200px;
      background: var(--light-gray);
      overflow: hidden;
    }

    .pose-card-image img {
      width: 100%;
      height: 100%;
      object-fit: cover;
    }

    .pose-card-content {
      padding: var(--spacing-lg);
    }

    .pose-card-title {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: var(--spacing-sm);
      font-size: 1.125rem;
      color: var(--black);
    }

    .pose-duration {
      font-size: 0.875rem;
      color: var(--primary-color);
      font-weight: 500;
    }

    .pose-card-description {
      color: var(--dark-gray);
      margin-bottom: var(--spacing-md);
      line-height: 1.5;
    }

    .pose-card-meta {
      display: flex;
      gap: var(--spacing-sm);
    }

    .pose-card-meta span {
      background: var(--light-gray);
      padding: var(--spacing-xs) var(--spacing-sm);
      border-radius: var(--radius-sm);
      font-size: 0.75rem;
      color: var(--dark-gray);
      text-transform: capitalize;
    }

    /* Session Complete */
    .session-complete {
      position: fixed;
      top: 0;
      left: 0;
      right: 0;
      bottom: 0;
      background: rgba(0, 0, 0, 0.8);
      display: flex;
      align-items: center;
      justify-content: center;
      z-index: 1000;
    }

    .complete-content {
      background: var(--white);
      padding: var(--spacing-xxl);
      border-radius: var(--radius-lg);
      text-align: center;
      max-width: 400px;
      width: 90%;
    }

    .complete-icon {
      font-size: 4rem;
      margin-bottom: var(--spacing-lg);
    }

    .complete-content h2 {
      margin-bottom: var(--spacing-md);
      color: var(--black);
    }

    .complete-content p {
      margin-bottom: var(--spacing-lg);
      color: var(--dark-gray);
    }

    .complete-actions {
      display: flex;
      gap: var(--spacing-md);
      justify-content: center;
    }

    /* Loading */
    .loading-container {
      min-height: 100vh;
      display: flex;
      align-items: center;
      justify-content: center;
    }

    .loading-content {
      text-align: center;
    }

    .loading-spinner {
      width: 50px;
      height: 50px;
      border: 3px solid var(--medium-gray);
      border-top: 3px solid var(--primary-color);
      border-radius: 50%;
      animation: spin 1s linear infinite;
      margin: 0 auto var(--spacing-lg);
    }

    @keyframes spin {
      0% { transform: rotate(0deg); }
      100% { transform: rotate(360deg); }
    }

    /* Responsive */
    @media (max-width: 968px) {
      .pose-content {
        grid-template-columns: 1fr;
      }

      .pose-image {
        height: 300px;
      }

      .header-content {
        flex-direction: column;
        gap: var(--spacing-lg);
      }

      .session-controls {
        align-self: stretch;
      }

      .pose-navigation {
        flex-direction: column;
        gap: var(--spacing-md);
      }

      .complete-actions {
        flex-direction: column;
      }
    }

    @media (max-width: 768px) {
      .session-title {
        font-size: 1.5rem;
      }

      .session-meta {
        flex-direction: column;
        gap: var(--spacing-sm);
      }

      .pose-details {
        padding: var(--spacing-lg);
      }

      .poses-list {
        grid-template-columns: 1fr;
      }
    }
  `]
})
export class SessionDisplayComponent implements OnInit, OnDestroy {
  session: YogaSession | null = null;
  currentPoseIndex = 0;
  isPlaying = false;
  isPaused = false;
  isSessionComplete = false;
  
  poseTimeRemaining = 0;
  overallProgress = 0;
  
  private timerSubscription?: Subscription;
  private sessionId: string = '';
  
  // Timer circle properties
  circumference = 2 * Math.PI * 35; // radius = 35
  circleOffset = 0;

  constructor(
    private route: ActivatedRoute,
    public router: Router,
    private yogaService: YogaService
  ) {}

  ngOnInit(): void {
    this.route.params.subscribe(params => {
      this.sessionId = params['id'];
      this.loadSession();
    });
  }

  ngOnDestroy(): void {
    this.stopTimer();
  }

  private loadSession(): void {
    this.yogaService.getSessionById(this.sessionId).subscribe(session => {
      if (session) {
        this.session = session;
        this.resetSession();
      } else {
        this.router.navigate(['/']);
      }
    });
  }

  get currentPose(): SessionPose | null {
    if (!this.session || this.currentPoseIndex >= this.session.poses.length) {
      return null;
    }
    return this.session.poses[this.currentPoseIndex];
  }

  toggleSession(): void {
    if (!this.isPlaying) {
      this.startSession();
    } else {
      this.togglePause();
    }
  }

  private startSession(): void {
    if (!this.session) return;
    
    this.isPlaying = true;
    this.isPaused = false;
    this.startPoseTimer();
  }

  private togglePause(): void {
    this.isPaused = !this.isPaused;
    
    if (this.isPaused) {
      this.stopTimer();
    } else {
      this.startPoseTimer();
    }
  }

  private startPoseTimer(): void {
    if (!this.currentPose) return;
    
    if (this.poseTimeRemaining === 0) {
      this.poseTimeRemaining = this.currentPose.duration;
    }

    this.stopTimer();
    this.timerSubscription = interval(1000)
      .pipe(takeWhile(() => this.poseTimeRemaining > 0 && !this.isPaused))
      .subscribe(() => {
        this.poseTimeRemaining--;
        this.updateProgress();
        this.updateCircleProgress();
        
        if (this.poseTimeRemaining === 0) {
          this.onPoseComplete();
        }
      });
  }

  private stopTimer(): void {
    if (this.timerSubscription) {
      this.timerSubscription.unsubscribe();
      this.timerSubscription = undefined;
    }
  }

  private onPoseComplete(): void {
    if (this.currentPoseIndex < this.session!.poses.length - 1) {
      this.nextPose();
    } else {
      this.completeSession();
    }
  }

  private completeSession(): void {
    this.isPlaying = false;
    this.isSessionComplete = true;
    this.stopTimer();
  }

  nextPose(): void {
    if (!this.session || this.currentPoseIndex >= this.session.poses.length - 1) {
      return;
    }
    
    this.currentPoseIndex++;
    this.poseTimeRemaining = 0;
    
    if (this.isPlaying && !this.isPaused) {
      this.startPoseTimer();
    }
    
    this.updateProgress();
  }

  previousPose(): void {
    if (this.currentPoseIndex <= 0) {
      return;
    }
    
    this.currentPoseIndex--;
    this.poseTimeRemaining = 0;
    
    if (this.isPlaying && !this.isPaused) {
      this.startPoseTimer();
    }
    
    this.updateProgress();
  }

  resetSession(): void {
    this.currentPoseIndex = 0;
    this.isPlaying = false;
    this.isPaused = false;
    this.isSessionComplete = false;
    this.poseTimeRemaining = 0;
    this.overallProgress = 0;
    this.circleOffset = this.circumference;
    this.stopTimer();
  }

  private updateProgress(): void {
    if (!this.session) return;
    
    const totalPoses = this.session.poses.length;
    const completedPoses = this.currentPoseIndex;
    const currentPoseProgress = this.currentPose ? 
      (this.currentPose.duration - this.poseTimeRemaining) / this.currentPose.duration : 0;
    
    this.overallProgress = ((completedPoses + currentPoseProgress) / totalPoses) * 100;
  }

  private updateCircleProgress(): void {
    if (!this.currentPose) return;
    
    const progress = (this.currentPose.duration - this.poseTimeRemaining) / this.currentPose.duration;
    this.circleOffset = this.circumference - (progress * this.circumference);
  }

  formatTime(seconds: number): string {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  }

  onImageError(event: any): void {
    // Fallback to a placeholder image
    event.target.src = 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDAwIiBoZWlnaHQ9IjMwMCIgdmlld0JveD0iMCAwIDQwMCAzMDAiIGZpbGw9Im5vbmUiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+CjxyZWN0IHdpZHRoPSI0MDAiIGhlaWdodD0iMzAwIiBmaWxsPSIjRjhGOUZBIi8+CjxwYXRoIGQ9Ik0yMDAgMTAwVjIwME0xNTAgMTUwSDI1MCIgc3Ryb2tlPSIjNjIxOEZGIiBzdHJva2Utd2lkdGg9IjMiIHN0cm9rZS1saW5lY2FwPSJyb3VuZCIvPgo8L3N2Zz4K';
  }
}
