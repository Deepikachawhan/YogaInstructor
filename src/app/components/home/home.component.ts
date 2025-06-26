import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { YogaService } from '../../services/yoga.service';
import { YogaSession } from '../../models/yoga.models';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CommonModule, RouterLink],
  template: `
    <div class="home-container">
      <!-- Hero Section -->
      <section class="hero-section">
        <div class="container">
          <div class="hero-content">
            <h1 class="hero-title fade-in">
              Don't follow someone else's yoga.<br>
              <span class="highlight">Flow with yours.</span>
            </h1>
            <p class="hero-subtitle fade-in">
              AI-powered personalized yoga sessions tailored to how you feel today.
              Just describe your mood, pain points, or goals, and we'll create the perfect flow for you.
            </p>
            <div class="hero-actions fade-in">
              <a routerLink="/create-session" class="btn btn-primary btn-large">
                <span>✨</span>
                Create Your Flow
              </a>
              <button class="btn btn-secondary btn-large" (click)="scrollToFeatures()">
                Learn More
              </button>
            </div>
          </div>
          <div class="hero-image">
            <div class="hero-visual">
              <div class="floating-card">
                <span class="card-icon">🧘‍♀️</span>
                <span class="card-text">Personalized</span>
              </div>
              <div class="floating-card delay-1">
                <span class="card-icon">🤖</span>
                <span class="card-text">AI-Powered</span>
              </div>
              <div class="floating-card delay-2">
                <span class="card-icon">💆‍♀️</span>
                <span class="card-text">Adaptive</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      <!-- Features Section -->
      <section class="features-section" id="features">
        <div class="container">
          <h2 class="section-title text-center">What Makes YogaFlow Unique</h2>
          <div class="features-grid">
            <div class="feature-card">
              <div class="feature-icon">🗣️</div>
              <h3>Free-text Input</h3>
              <p>Simply say "I feel anxious" or "I have back pain" - no complicated forms or dropdowns needed.</p>
            </div>
            <div class="feature-card">
              <div class="feature-icon">🤖</div>
              <h3>AI-Powered Flow Logic</h3>
              <p>Every session is unique. Our AI curates flows with smooth transitions and purposeful pose selection.</p>
            </div>
            <div class="feature-card">
              <div class="feature-icon">🔁</div>
              <h3>Live-Editable Flows</h3>
              <p>Replace any pose, ask "Why this pose?" or modify the sequence to match your preferences.</p>
            </div>
            <div class="feature-card">
              <div class="feature-icon">🧘‍♀️</div>
              <h3>Emotional Awareness</h3>
              <p>Inputs like "low energy," "tired legs," or "need to focus" intelligently alter your flow.</p>
            </div>
            <div class="feature-card">
              <div class="feature-icon">⏱️</div>
              <h3>Smart Timing</h3>
              <p>Choose your duration and we'll create the perfect balance of warm-up, practice, and cool-down.</p>
            </div>
            <div class="feature-card">
              <div class="feature-icon">📱</div>
              <h3>Practice Ready</h3>
              <p>Built-in timer, pose instructions, and benefits make it easy to flow without interruption.</p>
            </div>
          </div>
        </div>
      </section>

      <!-- Recent Sessions -->
      <section class="recent-sessions" *ngIf="recentSessions$ | async as sessions">
        <div class="container">
          <div class="section-header">
            <h2 class="section-title">Your Recent Sessions</h2>
            <a routerLink="/create-session" class="btn btn-ghost">Create New</a>
          </div>
          
          <div class="sessions-grid" *ngIf="sessions.length > 0; else noSessions">
            <div class="session-card" *ngFor="let session of sessions.slice(0, 3)">
              <div class="session-header">
                <h3>{{ session.title }}</h3>
                <span class="session-date">{{ formatDate(session.createdAt) }}</span>
              </div>
              <p class="session-description">{{ session.description }}</p>
              <div class="session-meta">
                <span class="duration">{{ session.duration }} min</span>
                <span class="level">{{ session.level }}</span>
                <span class="poses-count">{{ session.poses.length }} poses</span>
              </div>
              <div class="session-actions">
                <a [routerLink]="['/session', session.id]" class="btn btn-primary">Practice Again</a>
                <button class="btn btn-ghost" (click)="deleteSession(session.id)">Delete</button>
              </div>
            </div>
          </div>

          <ng-template #noSessions>
            <div class="empty-state">
              <div class="empty-icon">🧘‍♀️</div>
              <h3>Ready to start your journey?</h3>
              <p>Create your first personalized yoga session and begin flowing with intention.</p>
              <a routerLink="/create-session" class="btn btn-primary">Get Started</a>
            </div>
          </ng-template>
        </div>
      </section>

      <!-- How It Works -->
      <section class="how-it-works">
        <div class="container">
          <h2 class="section-title text-center">How It Works</h2>
          <div class="steps-container">
            <div class="step">
              <div class="step-number">1</div>
              <div class="step-content">
                <h3>Describe How You Feel</h3>
                <p>Tell us about your mood, energy level, or any physical concerns in natural language.</p>
              </div>
            </div>
            <div class="step">
              <div class="step-number">2</div>
              <div class="step-content">
                <h3>AI Creates Your Flow</h3>
                <p>Our intelligent system generates a personalized sequence with perfect transitions and timing.</p>
              </div>
            </div>
            <div class="step">
              <div class="step-number">3</div>
              <div class="step-content">
                <h3>Practice & Adapt</h3>
                <p>Follow your custom session with built-in guidance, or modify poses as you go.</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      <!-- CTA Section -->
      <section class="cta-section">
        <div class="container">
          <div class="cta-content">
            <h2>Ready to transform your practice?</h2>
            <p>Join thousands who've discovered the power of truly personalized yoga.</p>
            <a routerLink="/create-session" class="btn btn-primary btn-large">
              Start Your Journey
            </a>
          </div>
        </div>
      </section>
    </div>
  `,
  styles: [`
    .home-container {
      min-height: 100vh;
    }

    /* Hero Section */
    .hero-section {
      background: var(--gradient-primary);
      color: var(--white);
      padding: var(--spacing-xxl) 0;
      min-height: 80vh;
      display: flex;
      align-items: center;
      overflow: hidden;
      position: relative;
    }

    .hero-section::before {
      content: '';
      position: absolute;
      top: 0;
      left: 0;
      right: 0;
      bottom: 0;
      background: url('data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 20"><defs><radialGradient id="a" cx="50%" cy="50%"><stop offset="0%" stop-opacity=".1"/><stop offset="100%" stop-opacity="0"/></radialGradient></defs><rect width="100" height="20" fill="url(%23a)"/></svg>');
      opacity: 0.3;
    }

    .hero-content {
      flex: 1;
      z-index: 2;
      position: relative;
    }

    .hero-title {
      font-size: 3.5rem;
      font-weight: 600;
      line-height: 1.2;
      margin-bottom: var(--spacing-lg);
    }

    .highlight {
      background: linear-gradient(45deg, var(--accent-color), var(--warning-color));
      -webkit-background-clip: text;
      -webkit-text-fill-color: transparent;
      background-clip: text;
    }

    .hero-subtitle {
      font-size: 1.25rem;
      line-height: 1.6;
      margin-bottom: var(--spacing-xl);
      opacity: 0.9;
    }

    .hero-actions {
      display: flex;
      gap: var(--spacing-lg);
      flex-wrap: wrap;
    }

    .hero-image {
      flex: 1;
      display: flex;
      justify-content: center;
      align-items: center;
      z-index: 2;
      position: relative;
    }

    .hero-visual {
      position: relative;
      width: 300px;
      height: 300px;
    }

    .floating-card {
      position: absolute;
      background: rgba(255, 255, 255, 0.1);
      backdrop-filter: blur(10px);
      padding: var(--spacing-md);
      border-radius: var(--radius-lg);
      display: flex;
      align-items: center;
      gap: var(--spacing-sm);
      animation: float 6s ease-in-out infinite;
      border: 1px solid rgba(255, 255, 255, 0.2);
    }

    .floating-card:nth-child(1) {
      top: 20%;
      left: 10%;
    }

    .floating-card:nth-child(2) {
      top: 50%;
      right: 10%;
      animation-delay: -2s;
    }

    .floating-card:nth-child(3) {
      bottom: 20%;
      left: 20%;
      animation-delay: -4s;
    }

    .card-icon {
      font-size: 1.5rem;
    }

    .card-text {
      font-weight: 500;
    }

    @keyframes float {
      0%, 100% { transform: translateY(0px); }
      50% { transform: translateY(-20px); }
    }

    /* Features Section */
    .features-section {
      padding: var(--spacing-xxl) 0;
      background: var(--white);
    }

    .section-title {
      font-size: 2.5rem;
      margin-bottom: var(--spacing-xl);
      color: var(--black);
    }

    .features-grid {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
      gap: var(--spacing-xl);
      margin-top: var(--spacing-xxl);
    }

    .feature-card {
      text-align: center;
      padding: var(--spacing-xl);
      border-radius: var(--radius-lg);
      transition: transform 0.3s ease;
    }

    .feature-card:hover {
      transform: translateY(-8px);
    }

    .feature-icon {
      font-size: 3rem;
      margin-bottom: var(--spacing-lg);
      display: block;
    }

    .feature-card h3 {
      font-size: 1.25rem;
      margin-bottom: var(--spacing-md);
      color: var(--black);
    }

    .feature-card p {
      color: var(--dark-gray);
      line-height: 1.6;
    }

    /* Recent Sessions */
    .recent-sessions {
      padding: var(--spacing-xxl) 0;
      background: var(--light-gray);
    }

    .section-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: var(--spacing-xl);
    }

    .sessions-grid {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
      gap: var(--spacing-lg);
    }

    .session-card {
      background: var(--white);
      padding: var(--spacing-lg);
      border-radius: var(--radius-lg);
      box-shadow: var(--shadow-md);
      transition: transform 0.2s ease, box-shadow 0.2s ease;
    }

    .session-card:hover {
      transform: translateY(-4px);
      box-shadow: var(--shadow-lg);
    }

    .session-header {
      display: flex;
      justify-content: space-between;
      align-items: flex-start;
      margin-bottom: var(--spacing-md);
    }

    .session-header h3 {
      margin: 0;
      font-size: 1.125rem;
      color: var(--black);
    }

    .session-date {
      font-size: 0.875rem;
      color: var(--dark-gray);
    }

    .session-description {
      color: var(--dark-gray);
      margin-bottom: var(--spacing-md);
      line-height: 1.5;
    }

    .session-meta {
      display: flex;
      gap: var(--spacing-md);
      margin-bottom: var(--spacing-lg);
    }

    .session-meta span {
      background: var(--light-gray);
      padding: var(--spacing-xs) var(--spacing-sm);
      border-radius: var(--radius-sm);
      font-size: 0.875rem;
      color: var(--dark-gray);
    }

    .session-actions {
      display: flex;
      gap: var(--spacing-md);
    }

    .empty-state {
      text-align: center;
      padding: var(--spacing-xxl);
    }

    .empty-icon {
      font-size: 4rem;
      margin-bottom: var(--spacing-lg);
    }

    .empty-state h3 {
      margin-bottom: var(--spacing-md);
      color: var(--black);
    }

    .empty-state p {
      color: var(--dark-gray);
      margin-bottom: var(--spacing-lg);
    }

    /* How It Works */
    .how-it-works {
      padding: var(--spacing-xxl) 0;
      background: var(--white);
    }

    .steps-container {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
      gap: var(--spacing-xl);
      margin-top: var(--spacing-xxl);
    }

    .step {
      text-align: center;
      position: relative;
    }

    .step-number {
      width: 60px;
      height: 60px;
      background: var(--gradient-primary);
      color: var(--white);
      border-radius: var(--radius-full);
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: 1.5rem;
      font-weight: 600;
      margin: 0 auto var(--spacing-lg);
    }

    .step h3 {
      margin-bottom: var(--spacing-md);
      color: var(--black);
    }

    .step p {
      color: var(--dark-gray);
      line-height: 1.6;
    }

    /* CTA Section */
    .cta-section {
      background: var(--gradient-nature);
      color: var(--white);
      padding: var(--spacing-xxl) 0;
      text-align: center;
    }

    .cta-content h2 {
      font-size: 2.5rem;
      margin-bottom: var(--spacing-md);
    }

    .cta-content p {
      font-size: 1.125rem;
      margin-bottom: var(--spacing-xl);
      opacity: 0.9;
    }

    /* Responsive */
    @media (max-width: 768px) {
      .hero-title {
        font-size: 2.5rem;
      }

      .hero-subtitle {
        font-size: 1.125rem;
      }

      .hero-actions {
        flex-direction: column;
        align-items: flex-start;
      }

      .hero-visual {
        width: 250px;
        height: 250px;
      }

      .section-title {
        font-size: 2rem;
      }

      .section-header {
        flex-direction: column;
        gap: var(--spacing-md);
        align-items: flex-start;
      }

      .session-actions {
        flex-direction: column;
      }
    }
  `]
})
export class HomeComponent implements OnInit {
  recentSessions$: Observable<YogaSession[]>;

  constructor(private yogaService: YogaService) {
    this.recentSessions$ = this.yogaService.sessions$;
  }

  ngOnInit(): void {
    // Component initialization
  }

  scrollToFeatures(): void {
    const element = document.getElementById('features');
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  }

  deleteSession(sessionId: string): void {
    if (confirm('Are you sure you want to delete this session?')) {
      this.yogaService.deleteSession(sessionId);
    }
  }

  formatDate(date: Date): string {
    const now = new Date();
    const sessionDate = new Date(date);
    const diffTime = Math.abs(now.getTime() - sessionDate.getTime());
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

    if (diffDays === 1) {
      return 'Today';
    } else if (diffDays === 2) {
      return 'Yesterday';
    } else if (diffDays <= 7) {
      return `${diffDays - 1} days ago`;
    } else {
      return sessionDate.toLocaleDateString();
    }
  }
}
