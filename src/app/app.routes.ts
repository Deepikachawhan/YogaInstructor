import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: '',
    loadComponent: () => import('./components/home/home.component').then(m => m.HomeComponent)
  },
  {
    path: 'create-session',
    loadComponent: () => import('./components/session-input/session-input.component').then(m => m.SessionInputComponent)
  },
  {
    path: 'session/:id',
    loadComponent: () => import('./components/session-display/session-display.component').then(m => m.SessionDisplayComponent)
  },
  {
    path: '**',
    redirectTo: ''
  }
];
