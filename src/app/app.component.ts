import { Component } from '@angular/core';
import { RouterOutlet, RouterLink } from '@angular/router';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [CommonModule, RouterOutlet, RouterLink],
  template: `
    <div class="app-container">
      <header class="app-header">
        <nav class="nav-container">
          <div class="nav-brand">
            <a routerLink="/" class="brand-link">
              <span class="brand-icon">🧘‍♀️</span>
              <span class="brand-text">YogaFlow</span>
            </a>
          </div>
          <div class="nav-links">
            <a routerLink="/" class="nav-link">Home</a>
            <a routerLink="/create-session" class="nav-link btn btn-primary">Create Session</a>
          </div>
        </nav>
      </header>

      <main class="main-content">
        <router-outlet></router-outlet>
      </main>

      <footer class="app-footer">
        <div class="container">
          <p class="footer-text">
            Made with ❤️ for personalized yoga practice • 
            <span class="tagline">"Don't follow someone else's yoga. Flow with yours."</span>
          </p>
        </div>
      </footer>
    </div>
  `,
  styles: [`
    .app-container {
      min-height: 100vh;
      display: flex;
      flex-direction: column;
    }

    .app-header {
      background: var(--white);
      box-shadow: var(--shadow-sm);
      position: sticky;
      top: 0;
      z-index: 100;
    }

    .nav-container {
      max-width: 1200px;
      margin: 0 auto;
      padding: 0 var(--spacing-lg);
      display: flex;
      align-items: center;
      justify-content: space-between;
      height: 70px;
    }

    .nav-brand {
      display: flex;
      align-items: center;
    }

    .brand-link {
      display: flex;
      align-items: center;
      text-decoration: none;
      color: var(--black);
      font-weight: 600;
      font-size: 1.25rem;
      gap: var(--spacing-sm);
    }

    .brand-icon {
      font-size: 1.5rem;
    }

    .brand-text {
      font-family: var(--font-family-display);
    }

    .nav-links {
      display: flex;
      align-items: center;
      gap: var(--spacing-lg);
    }

    .nav-link {
      text-decoration: none;
      color: var(--dark-gray);
      font-weight: 500;
      padding: var(--spacing-sm) var(--spacing-md);
      border-radius: var(--radius-md);
      transition: color 0.2s ease;
    }

    .nav-link:hover {
      color: var(--primary-color);
    }

    .main-content {
      flex: 1;
      padding: var(--spacing-xl) 0;
    }

    .app-footer {
      background: var(--dark-gray);
      color: var(--white);
      padding: var(--spacing-lg) 0;
      margin-top: auto;
    }

    .footer-text {
      text-align: center;
      margin: 0;
      font-size: 0.875rem;
    }

    .tagline {
      font-style: italic;
      color: var(--accent-color);
    }

    @media (max-width: 768px) {
      .nav-container {
        padding: 0 var(--spacing-md);
        height: 60px;
      }

      .brand-text {
        display: none;
      }

      .nav-links {
        gap: var(--spacing-md);
      }

      .nav-link {
        padding: var(--spacing-xs) var(--spacing-sm);
        font-size: 0.875rem;
      }
    }
  `]
})
export class AppComponent {
  title = 'YogaFlow - Personalized Yoga Sessions';
}
