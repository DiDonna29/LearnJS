
# LearnJS - Anti-Slop JavaScript Mastery Platform 🚀

LearnJS is a professional-grade learning platform designed to take developers from zero to fullstack JavaScript proficiency using high-end UI/UX standards and AI-driven personalization.

## 📖 App Overview

In a world filled with "slop" (generic, repetitive, low-quality content), LearnJS focuses on **design taste** and **educational clarity**. We provide curated roadmaps, high-performance resources, and an AI Path Builder to help you navigate the complex JS ecosystem without getting lost.

### Key Pillars
- **Premium UI/UX:** Following "Anti-Slop" principles—asymmetric modern layouts, Swiss-inspired typography (Geist), and balanced negative space.
- **AI-Personalization:** Leverages Google Gemini (Genkit) to build custom learning paths based on your specific goals and experience.
- **Interactive Roadmaps:** Visual step-by-step guides for Frontend, Backend, and Fullstack tracks.
- **Containment & Stability:** Strictly structured responsive layouts that ensure performance and visual integrity across all devices.

## 🛠 Tech Stack

- **Framework:** Next.js 15 (App Router, Turbopack)
- **Styling:** Tailwind CSS + Framer Motion (Premium micro-interactions)
- **UI Components:** Shadcn UI (Radix Primitives)
- **Backend/Auth:** Firebase (Firestore + Authentication)
- **AI Engine:** Genkit + Google Gemini 2.0
- **Package Managers:** Support for `npm`, `yarn`, and `pnpm`.

## 🚀 Installation & Setup

Ensure you have Node.js 18+ installed.

### 1. Clone & Install
```bash
# Clone the repository
git clone https://github.com/your-username/learnjs.git
cd learnjs

# Install dependencies
pnpm install 
# or 
yarn install
# or
npm install
```

### 2. Environment Variables
Create a `.env.local` file in the root directory:
```env
# AI
GEMINI_API_KEY=your_key

# Firebase Client
NEXT_PUBLIC_FIREBASE_API_KEY=your_key
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=your_project.firebaseapp.com
NEXT_PUBLIC_FIREBASE_PROJECT_ID=your_project_id
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=your_project.firebasestorage.app
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=your_id
NEXT_PUBLIC_FIREBASE_APP_ID=your_id

# Firebase Admin
FIREBASE_ADMIN_PROJECT_ID=your_project_id
FIREBASE_ADMIN_CLIENT_EMAIL=your_service_account_email
FIREBASE_ADMIN_PRIVATE_KEY="-----BEGIN PRIVATE KEY-----\n...\n-----END PRIVATE KEY-----\n"
```

### 3. Run Development
```bash
pnpm dev
```

## 🧠 Logic & Scalability

### Educational Logic
LearnJS doesn't just list tutorials; it organizes them into a **logical progression hierarchy**.
- **Foundations:** HTML/CSS/JS Core.
- **Specialization:** React, Node, or Fullstack integration.
- **Deployment:** Industry standards for CI/CD and production environments.

### Scalability Roadmap (Future)
1. **Interactive Quizzes:** Real-time assessment at the end of each module.
2. **Community Mentorship:** User-to-user review systems for code snippets.
3. **Certification:** Verifiable blockchain or digital badges upon path completion.
4. **Project Sandbox:** Integrated IDE (like Monaco) to practice JS directly in the browser.

## 📦 Production Readiness

This application is ready for production deployment on platforms like **Vercel**, **Railway**, or **Google Cloud**. It includes:
- **Middleware Security:** Integrated Auth checks.
- **Server Actions:** Secure data mutations without API overhead.
- **Optimized Assets:** Automatic image optimization via `next/image`.
- **Full Responsive Audit:** Tested for high-density desktop displays and mobile-first interactions.

---
Created with ❤️ by LearnJS Team. Master the web, one line of JS at a time.
