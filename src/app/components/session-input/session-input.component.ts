import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { YogaService } from '../../services/yoga.service';
import { UserInput } from '../../models/yoga.models';

@Component({
  selector: 'app-session-input',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  template: `
    <div class="session-input-container">
      <div class="container container-sm">
        <div class="input-header">
          <h1 class="page-title">Create Your Personalized Flow</h1>
          <p class="page-subtitle">
            Tell us how you're feeling and what you need. We'll create the perfect yoga session just for you.
          </p>
        </div>

        <form [formGroup]="inputForm" (ngSubmit)="onSubmit()" class="input-form">
          <!-- Natural Language Input -->
          <div class="form-section">
            <div class="section-header">
              <h2 class="section-title">How are you feeling today?</h2>
              <p class="section-subtitle">
                Describe your mood, energy level, physical sensations, or what you hope to achieve
              </p>
            </div>
            
            <div class="form-group">
              <label for="description" class="form-label">Tell us about your needs</label>
              <textarea
                id="description"
                formControlName="description"
                class="form-textarea"
                placeholder="I'm feeling stressed and have tight shoulders from sitting at my desk all day..."
                rows="4"
              ></textarea>
            </div>

            <!-- Quick Options -->
            <div class="quick-options">
              <label class="form-label">Or try one of these:</label>
              <div class="option-buttons">
                <button
                  type="button"
                  *ngFor="let option of quickOptions"
                  class="option-btn"
                  [class.active]="inputForm.get('description')?.value === option"
                  (click)="selectQuickOption(option)"
                >
                  {{ option }}
                </button>
              </div>
            </div>
          </div>

          <!-- Manual Options -->
          <div class="form-section">
            <div class="section-header">
              <h2 class="section-title">Session Preferences</h2>
              <p class="section-subtitle">Fine-tune your practice details</p>
            </div>

            <div class="form-row">
              <div class="form-group">
                <label for="goal" class="form-label">Primary Goal</label>
                <select id="goal" formControlName="goal" class="form-select">
                  <option value="">Select a goal (optional)</option>
                  <option value="relaxation">Relaxation & Stress Relief</option>
                  <option value="energy">Energy & Vitality</option>
                  <option value="strength">Strength & Power</option>
                  <option value="flexibility">Flexibility & Mobility</option>
                  <option value="balance">Balance & Stability</option>
                  <option value="focus">Focus & Mindfulness</option>
                </select>
              </div>

              <div class="form-group">
                <label for="level" class="form-label">Experience Level</label>
                <select id="level" formControlName="level" class="form-select">
                  <option value="beginner">Beginner</option>
                  <option value="intermediate">Intermediate</option>
                  <option value="advanced">Advanced</option>
                </select>
              </div>
            </div>

            <div class="form-row">
              <div class="form-group">
                <label for="duration" class="form-label">Duration ({{ inputForm.get('duration')?.value }} minutes)</label>
                <input
                  type="range"
                  id="duration"
                  formControlName="duration"
                  min="5"
                  max="60"
                  step="5"
                  class="form-range"
                >
                <div class="range-labels">
                  <span>5 min</span>
                  <span>30 min</span>
                  <span>60 min</span>
                </div>
              </div>

              <div class="form-group">
                <label for="energy" class="form-label">Current Energy Level</label>
                <select id="energy" formControlName="energy" class="form-select">
                  <option value="">Select energy level</option>
                  <option value="low">Low - Need gentle, restorative poses</option>
                  <option value="medium">Medium - Balanced practice</option>
                  <option value="high">High - Ready for dynamic flow</option>
                </select>
              </div>
            </div>

            <!-- Focus Areas -->
            <div class="form-group">
              <label class="form-label">Focus Areas (select all that apply)</label>
              <div class="checkbox-grid">
                <label *ngFor="let area of focusAreas" class="checkbox-label">
                  <input
                    type="checkbox"
                    [value]="area.value"
                    (change)="onFocusAreaChange($event)"
                  >
                  <span class="checkbox-text">{{ area.label }}</span>
                </label>
              </div>
            </div>

            <!-- Pain Points -->
            <div class="form-group">
              <label class="form-label">Any areas to avoid or be gentle with?</label>
              <div class="checkbox-grid">
                <label *ngFor="let pain of painPoints" class="checkbox-label">
                  <input
                    type="checkbox"
                    [value]="pain.value"
                    (change)="onPainPointChange($event)"
                  >
                  <span class="checkbox-text">{{ pain.label }}</span>
                </label>
              </div>
            </div>
          </div>

          <!-- Submit -->
          <div class="form-actions">
            <button
              type="submit"
              class="btn btn-primary btn-large"
              [disabled]="isGenerating || inputForm.invalid"
            >
              <span *ngIf="!isGenerating">✨ Generate My Flow</span>
              <span *ngIf="isGenerating">🔮 Creating Your Session...</span>
            </button>
            <p class="help-text">
              This usually takes just a few seconds
            </p>
          </div>
        </form>

        <!-- Error Message -->
        <div *ngIf="errorMessage" class="error-message">
          <div class="error-icon">⚠️</div>
          <div class="error-text">
            <h3>Something went wrong</h3>
            <p>{{ errorMessage }}</p>
            <button class="btn btn-ghost" (click)="clearError()">Try Again</button>
          </div>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .session-input-container {
      min-height: 100vh;
      background: var(--light-gray);
      padding: var(--spacing-xl) 0;
    }

    .input-header {
      text-align: center;
      margin-bottom: var(--spacing-xxl);
    }

    .page-title {
      font-size: 2.5rem;
      margin-bottom: var(--spacing-md);
      color: var(--black);
    }

    .page-subtitle {
      font-size: 1.125rem;
      color: var(--dark-gray);
      line-height: 1.6;
    }

    .input-form {
      background: var(--white);
      border-radius: var(--radius-lg);
      box-shadow: var(--shadow-lg);
      overflow: hidden;
    }

    .form-section {
      padding: var(--spacing-xxl);
      border-bottom: 1px solid var(--medium-gray);
    }

    .form-section:last-child {
      border-bottom: none;
    }

    .section-header {
      margin-bottom: var(--spacing-xl);
    }

    .section-title {
      font-size: 1.5rem;
      margin-bottom: var(--spacing-sm);
      color: var(--black);
    }

    .section-subtitle {
      color: var(--dark-gray);
      margin: 0;
    }

    .form-row {
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: var(--spacing-lg);
    }

    .form-textarea {
      min-height: 120px;
      resize: vertical;
    }

    .quick-options {
      margin-top: var(--spacing-lg);
    }

    .option-buttons {
      display: flex;
      flex-wrap: wrap;
      gap: var(--spacing-sm);
      margin-top: var(--spacing-sm);
    }

    .option-btn {
      background: var(--light-gray);
      border: 2px solid transparent;
      padding: var(--spacing-sm) var(--spacing-md);
      border-radius: var(--radius-md);
      font-size: 0.875rem;
      cursor: pointer;
      transition: all 0.2s ease;
    }

    .option-btn:hover {
      background: var(--medium-gray);
    }

    .option-btn.active {
      background: var(--primary-color);
      color: var(--white);
      border-color: var(--primary-color);
    }

    .form-range {
      width: 100%;
      margin: var(--spacing-sm) 0;
    }

    .range-labels {
      display: flex;
      justify-content: space-between;
      font-size: 0.875rem;
      color: var(--dark-gray);
    }

    .checkbox-grid {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
      gap: var(--spacing-sm);
      margin-top: var(--spacing-sm);
    }

    .checkbox-label {
      display: flex;
      align-items: center;
      gap: var(--spacing-sm);
      padding: var(--spacing-sm);
      border-radius: var(--radius-sm);
      cursor: pointer;
      transition: background-color 0.2s ease;
    }

    .checkbox-label:hover {
      background: var(--light-gray);
    }

    .checkbox-text {
      font-size: 0.875rem;
      color: var(--dark-gray);
    }

    .form-actions {
      padding: var(--spacing-xxl);
      text-align: center;
      background: var(--light-gray);
    }

    .help-text {
      margin-top: var(--spacing-md);
      color: var(--dark-gray);
      font-size: 0.875rem;
    }

    .error-message {
      background: var(--white);
      border: 2px solid var(--error-color);
      border-radius: var(--radius-lg);
      padding: var(--spacing-xl);
      margin-top: var(--spacing-lg);
      display: flex;
      gap: var(--spacing-md);
      align-items: flex-start;
    }

    .error-icon {
      font-size: 1.5rem;
      flex-shrink: 0;
    }

    .error-text h3 {
      margin-bottom: var(--spacing-sm);
      color: var(--error-color);
    }

    .error-text p {
      margin-bottom: var(--spacing-md);
      color: var(--dark-gray);
    }

    @media (max-width: 768px) {
      .page-title {
        font-size: 2rem;
      }

      .form-section {
        padding: var(--spacing-lg);
      }

      .form-row {
        grid-template-columns: 1fr;
      }

      .checkbox-grid {
        grid-template-columns: 1fr;
      }

      .option-buttons {
        flex-direction: column;
      }

      .form-actions {
        padding: var(--spacing-lg);
      }
    }
  `]
})
export class SessionInputComponent implements OnInit {
  inputForm: FormGroup;
  isGenerating = false;
  errorMessage = '';

  quickOptions = [
    "I'm feeling stressed and need to relax",
    "I have tight shoulders from desk work",
    "My lower back is sore and needs gentle stretches",
    "I'm tired but want to energize myself",
    "I need to improve my flexibility",
    "I want to build core strength",
    "I'm anxious and need to calm my mind",
    "I have hip tightness from sitting all day"
  ];

  focusAreas = [
    { value: 'neck', label: 'Neck & Shoulders' },
    { value: 'back', label: 'Lower Back' },
    { value: 'hips', label: 'Hips & Pelvis' },
    { value: 'core', label: 'Core & Abs' },
    { value: 'legs', label: 'Legs & Hamstrings' },
    { value: 'chest', label: 'Chest & Heart' },
    { value: 'spine', label: 'Spine Mobility' },
    { value: 'arms', label: 'Arms & Wrists' }
  ];

  painPoints = [
    { value: 'knee', label: 'Knee issues' },
    { value: 'wrist', label: 'Wrist pain' },
    { value: 'neck-injury', label: 'Neck injury' },
    { value: 'back-injury', label: 'Back injury' },
    { value: 'pregnancy', label: 'Pregnancy' },
    { value: 'high-bp', label: 'High blood pressure' },
    { value: 'recent-surgery', label: 'Recent surgery' }
  ];

  private selectedFocusAreas: string[] = [];
  private selectedPainPoints: string[] = [];

  constructor(
    private fb: FormBuilder,
    private yogaService: YogaService,
    private router: Router
  ) {
    this.inputForm = this.createForm();
  }

  ngOnInit(): void {
    // Component initialization
  }

  private createForm(): FormGroup {
    return this.fb.group({
      description: [''],
      goal: [''],
      level: ['beginner', Validators.required],
      duration: [20, [Validators.required, Validators.min(5), Validators.max(60)]],
      energy: ['']
    });
  }

  selectQuickOption(option: string): void {
    this.inputForm.patchValue({ description: option });
  }

  onFocusAreaChange(event: any): void {
    const value = event.target.value;
    if (event.target.checked) {
      this.selectedFocusAreas.push(value);
    } else {
      const index = this.selectedFocusAreas.indexOf(value);
      if (index > -1) {
        this.selectedFocusAreas.splice(index, 1);
      }
    }
  }

  onPainPointChange(event: any): void {
    const value = event.target.value;
    if (event.target.checked) {
      this.selectedPainPoints.push(value);
    } else {
      const index = this.selectedPainPoints.indexOf(value);
      if (index > -1) {
        this.selectedPainPoints.splice(index, 1);
      }
    }
  }

  onSubmit(): void {
    if (this.inputForm.valid) {
      this.isGenerating = true;
      this.errorMessage = '';

      const formValue = this.inputForm.value;
      const userInput: UserInput = {
        description: formValue.description,
        goal: formValue.goal || undefined,
        level: formValue.level,
        duration: formValue.duration,
        energy: formValue.energy || undefined,
        focusAreas: this.selectedFocusAreas.length > 0 ? this.selectedFocusAreas : undefined,
        painPoints: this.selectedPainPoints.length > 0 ? this.selectedPainPoints : undefined
      };

      this.yogaService.generateSession(userInput).subscribe({
        next: (session) => {
          this.isGenerating = false;
          this.router.navigate(['/session', session.id]);
        },
        error: (error) => {
          this.isGenerating = false;
          this.errorMessage = error.message || 'Failed to generate session. Please try again.';
          console.error('Error generating session:', error);
        }
      });
    }
  }

  clearError(): void {
    this.errorMessage = '';
  }
}
