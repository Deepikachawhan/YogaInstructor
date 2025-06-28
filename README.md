# 🧘‍♀️ Personalized Yoga Session Generator

YogaInstructor is a modern web application built with Angular that generates personalized yoga sessions based on a user's mood, physical condition, and goals. The app features a dynamic yoga flow builder, pose visuals with detailed instructions, and an AI-powered chatbot for yoga-related queries.

## ✨ Features

- ✅ **Personalized Yoga Sessions**: Users input their mood and preferences to receive a tailored session.
- 🧍‍♂️ **Pose Cards**: Each session includes images, instructions, and benefits for every yoga pose.
- 💬 **AI Chatbot Support**: Chat with an OpenAI-powered assistant for yoga tips and guidance.
- 📱 **Responsive Design**: Works smoothly across desktops, tablets, and smartphones.
- 💾 **Session History**: Stores previously generated sessions using local storage.

## 🛠️ Tech Stack

- **Frontend**: Angular (standalone components, routing), TypeScript, SCSS, HTML5
- **Reactive Programming**: RxJS
- **Data**: JSON (pose data)
- **AI Integration**: OpenAI API for chatbot responses

## 🚀 Getting Started

### Prerequisites

- Node.js and npm installed
- Angular CLI installed globally (`npm install -g @angular/cli`)

### Installation

```bash
git clone https://github.com/Deepikachawhan/YogaInstructor.git
cd YogaInstructor
npm install
ng serve

```

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

🧠 Future Improvements
- User authentication and profile saving
- More advanced chat features (voice support, multilingual)
- Analytics dashboard for progress tracking

**Made with 💚 for wellness and mindful living**

*Experience personalized yoga that adapts to your needs, emotions, and goals. Start your journey to better physical and mental well-being today.*
](https://github.com/Deepikachawhan/YogaInstructor.git)
