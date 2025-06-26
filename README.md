# 🧘‍♀️ Personalized Yoga Session Generator

A beautiful, empathetic web application that creates custom yoga sequences based on how you're feeling and what your body needs.

![Angular](https://img.shields.io/badge/Angular-18+-red?logo=angular)
![TypeScript](https://img.shields.io/badge/TypeScript-5.0+-blue?logo=typescript)
![License](https://img.shields.io/badge/License-MIT-green)

## ✨ Features

### Current MVP
- **Intuitive Input**: Express how you feel through free-text or detailed manual forms
- **Smart Generation**: Rule-based yoga sequence creation from 40+ curated poses
- **Practice Mode**: Guided sessions with timer, pose details, and smooth transitions
- **Personalized Experience**: Sessions tailored to your energy, focus areas, and time
- **Beautiful UI**: Modern, calming interface designed for wellness

### Coming Soon
- 🤖 AI-powered session generation with GPT integration
- 🔄 Pose replacement and sequence editing
- 💭 "Why this pose?" explanations
- 🔊 Audio guidance and meditation
- 👤 User accounts and session history
- 📱 Progressive Web App (PWA) support

## 🚀 Quick Start

### Prerequisites
- Node.js 18+ and npm
- Angular CLI 18+ (optional for development)

### Installation

```bash
# Clone the repository
git clone <repository-url>
cd yoga-instructor

# Install dependencies
npm install

# Start development server
npm start
```

Visit `http://localhost:4200` to see your personalized yoga experience!

### Build for Production

```bash
npm run build
```

## 🎯 How It Works

### 1. Express Yourself
- **Free-text Input**: "I'm feeling stressed and my shoulders are tight"
- **Manual Form**: Select specific preferences, energy levels, and focus areas
- **Quick Options**: Pre-defined sessions for common needs

### 2. Smart Generation
Our rule-based engine analyzes your input to:
- Select appropriate poses based on benefits and intensity
- Create balanced sequences with proper warm-up and cool-down
- Ensure smooth transitions and complementary pose combinations
- Adjust for your available time and experience level

### 3. Practice & Flow
- **Session Overview**: See your complete sequence before starting
- **Practice Mode**: Step-by-step guidance with timers
- **Pose Details**: Instructions, benefits, and modifications
- **Progress Tracking**: Visual indicators and session completion

## 🏗️ Architecture

```
src/
├── app/
│   ├── components/
│   │   ├── home/              # Landing page with features
│   │   ├── session-input/     # User input forms
│   │   └── session-display/   # Practice mode & session view
│   ├── models/
│   │   └── yoga.models.ts     # TypeScript interfaces
│   ├── services/
│   │   └── yoga.service.ts    # Core business logic
│   └── app.component.ts       # Main app shell
├── assets/
│   └── data/
│       └── yoga-poses.json    # Curated pose dataset
└── styles.scss               # Global styles & design system
```

## 🧩 Key Components

### YogaService
Central service managing:
- Pose dataset loading and filtering
- Session generation with rule-based logic
- Local storage for session persistence
- Reactive state management

### Pose Dataset
Rich JSON data including:
- 40+ carefully curated yoga poses
- Physical attributes (difficulty, focus areas, body parts)
- Mental/emotional benefits
- Detailed instructions and modifications
- Timing and breathing guidance

### Rule-Based Engine
Intelligent pose selection based on:
- User's emotional state and energy level
- Physical focus areas and pain points
- Session duration and difficulty preferences
- Pose compatibility and flow sequences

## 🎨 Design System

### Color Palette
- **Primary**: Calming teals and blues
- **Secondary**: Warm oranges and corals  
- **Neutrals**: Soft grays and whites
- **Accent**: Gentle purples for highlights

### Typography
- Clean, readable fonts optimized for wellness content
- Proper contrast ratios for accessibility
- Responsive sizing for all devices

### Components
- Consistent spacing and elevation
- Gentle animations and transitions
- Mobile-first responsive design
- Accessibility-focused interactions

## 🛠️ Development

### Available Scripts

```bash
npm start          # Development server
npm run build      # Production build
npm test           # Run unit tests
npm run e2e        # End-to-end tests
npm run lint       # Code linting
```

### Project Structure
Built with Angular 18+ using:
- Standalone components for better tree-shaking
- Signal-based reactivity for performance
- SCSS with BEM methodology
- TypeScript strict mode
- Responsive design patterns

### Code Quality
- ESLint + Prettier configuration
- Strict TypeScript compilation
- Comprehensive test coverage
- Accessibility compliance (WCAG 2.1 AA)

## 🔮 Roadmap

### Phase 1: AI Integration (Q1 2024)
- [ ] GPT-powered session generation
- [ ] Natural language processing for user input
- [ ] Intelligent pose explanations
- [ ] Adaptive learning from user feedback

### Phase 2: Enhanced Experience (Q2 2024)
- [ ] Audio guidance and meditation tracks
- [ ] Pose correction using computer vision
- [ ] Social features and community sharing
- [ ] Advanced analytics and progress tracking

### Phase 3: Wellness Ecosystem (Q3 2024)
- [ ] Integration with fitness trackers
- [ ] Nutrition and mindfulness recommendations
- [ ] Instructor certification and marketplace
- [ ] Mobile app with offline capabilities

## 🤝 Contributing

We welcome contributions! Please see our [Contributing Guidelines](CONTRIBUTING.md) for details.

### Getting Started
1. Fork the repository
2. Create a feature branch: `git checkout -b feature/amazing-feature`
3. Commit changes: `git commit -m 'Add amazing feature'`
4. Push to branch: `git push origin feature/amazing-feature`
5. Open a Pull Request

## 📝 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- Yoga pose data curated from certified instructors
- Design inspiration from wellness and mindfulness apps
- Community feedback from yoga practitioners
- Open source Angular and TypeScript communities

---

**Made with 💚 for wellness and mindful living**

*Experience personalized yoga that adapts to your needs, emotions, and goals. Start your journey to better physical and mental well-being today.*
