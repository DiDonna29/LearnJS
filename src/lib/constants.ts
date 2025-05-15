
// src/lib/constants.ts
import type { Roadmap, ContentItem } from './types';

export const APP_NAME = "LearnJS";

export const USER_ROLES = {
  VISITOR: "Visitor",
  SIMPLE: "Simple User",
  PRO: "PRO User",
  ADMIN: "Admin",
} as const;


export const roadmaps: Roadmap[] = [
  {
    id: 'frontend',
    title: 'Frontend JavaScript Roadmap',
    description: 'Learn the fundamentals of building interactive user interfaces with JavaScript, HTML, and CSS.',
    iconName: 'MonitorSmartphone',
    courses: [
      {
        id: 'html-css',
        title: 'HTML and CSS Fundamentals',
        description: 'Learn the building blocks of web pages: structure with HTML and styling with CSS. Covers semantics, layout techniques like Flexbox and Grid, and responsive design principles.',
      },
      {
        id: 'js-basics',
        title: 'JavaScript Basics',
        description: 'Understand core JavaScript concepts like variables, data types, operators, control flow (loops, conditionals), functions, and scope. Essential for any JavaScript developer.',
      },
      {
        id: 'dom-manipulation',
        title: 'DOM Manipulation',
        description: 'Learn how to interact with and modify web page elements using JavaScript. Covers selecting elements, changing content, handling events, and creating dynamic user experiences.',
      },
      {
        id: 'js-advanced',
        title: 'Advanced JavaScript Concepts',
        description: 'Dive deeper into JavaScript with topics like closures, `this` keyword, prototypes, ES6+ features (arrow functions, destructuring, promises, async/await), and error handling.',
      },
      {
        id: 'modern-frameworks',
        title: 'Modern Frontend Frameworks (e.g., React)',
        description: 'Explore popular frameworks like React, Vue, or Angular for building complex single-page applications. Learn about components, state management, and routing.',
      },
    ],
  },
  {
    id: 'backend',
    title: 'Backend JavaScript Roadmap',
    description: 'Explore building server-side applications and APIs with Node.js and common backend technologies.',
    iconName: 'Server',
    courses: [
      {
        id: 'node-basics',
        title: 'Node.js Fundamentals',
        description: 'Get started with the Node.js runtime environment. Understand its architecture, module system, event loop, and how to run JavaScript outside the browser.',
      },
      {
        id: 'npm-ecosystem',
        title: 'NPM and Package Management',
        description: 'Learn to use Node Package Manager (NPM) or Yarn to manage project dependencies, scripts, and share your own packages.',
      },
      {
        id: 'express-js',
        title: 'Express.js Framework',
        description: 'Learn how to build web applications and APIs with Express, a minimal and flexible Node.js web application framework. Covers routing, middleware, and request/response handling.',
      },
      {
        id: 'restful-apis',
        title: 'RESTful API Design',
        description: 'Understand the principles of designing RESTful APIs, including HTTP methods, status codes, request/response formats (JSON), and versioning.',
      },
      {
        id: 'database-node',
        title: 'Databases with Node.js',
        description: 'Learn to connect Node.js applications to various databases (SQL like PostgreSQL, NoSQL like MongoDB) and perform CRUD operations using ORMs/ODMs.',
      },
    ],
  },
  {
    id: 'fullstack',
    title: 'Fullstack JavaScript Roadmap',
    description: 'Combine frontend and backend skills to build complete web applications from user interface to database.',
    iconName: 'Layers',
    courses: [
      {
        id: 'fullstack-frontend-review',
        title: 'Frontend Fundamentals (Review)',
        description: 'A quick refresher on essential frontend concepts: HTML, CSS, JavaScript, DOM manipulation, and a chosen frontend framework (e.g., React).',
      },
      {
        id: 'fullstack-backend-review',
        title: 'Backend Fundamentals (Review)',
        description: 'A quick refresher on essential backend concepts: Node.js, Express.js, API design, and package management.',
      },
      {
        id: 'database-integration',
        title: 'Database Design and Integration',
        description: 'Learn data modeling, choosing the right database (SQL vs NoSQL), and integrating it with your backend application to persist and retrieve data.',
      },
      {
        id: 'authentication-authorization',
        title: 'Authentication and Authorization',
        description: 'Implement user authentication (login, registration) and authorization (permissions, roles) strategies for secure applications (e.g., JWT, OAuth).',
      },
      {
        id: 'deployment-devops',
        title: 'Deployment and DevOps Basics',
        description: 'Understand the basics of deploying full-stack applications (e.g., to cloud platforms like Vercel, Netlify, AWS, Google Cloud) and CI/CD pipelines.',
      },
    ],
  },
];

export const mockContent: ContentItem[] = [
  { id: '1', title: 'Understanding JavaScript Closures', type: 'Article', source: 'MDN Web Docs', description: "A deep dive into closures, a fundamental concept in JavaScript that allows functions to remember their lexical scope even when executed outside that scope.", imageUrl: "https://placehold.co/600x400.png", dataAiHint: "code editor", category: "Core Concepts", externalLink: "https://developer.mozilla.org/en-US/docs/Web/JavaScript/Closures" },
  { id: '2', title: 'Asynchronous JavaScript with Async/Await', type: 'Tutorial', source: 'JavaScript.info', description: "Learn how to handle asynchronous operations gracefully using async/await, making your code cleaner and easier to understand compared to traditional Promises or callbacks.", imageUrl: "https://placehold.co/600x400.png", dataAiHint: "network nodes", category: "Asynchronous JS", externalLink: "https://javascript.info/async-await" },
  { id: '3', title: 'React State Management with Hooks', type: 'Documentation', source: 'React Official Docs', description: "Official documentation on using useState and useEffect for managing component state and side effects in React functional components.", imageUrl: "https://placehold.co/600x400.png", dataAiHint: "react logo", category: "React", externalLink: "https://react.dev/reference/react/useState" },
  { id: '4', title: 'Building a REST API with Node.js and Express', type: 'Article', source: 'Smashing Magazine', description: "A comprehensive guide to creating backend APIs using Node.js and the Express framework, covering routing, middleware, and best practices.", imageUrl: "https://placehold.co/600x400.png", dataAiHint: "server database", category: "Node.js", externalLink: "https://www.smashingmagazine.com/2021/01/nodejs-express-tutorial-rest-api/" },
  { id: '5', title: 'CSS Grid Layout Tutorial', type: 'Tutorial', source: 'CSS-Tricks', description: "Master the powerful CSS Grid for creating complex two-dimensional web layouts with more control and flexibility than older methods.", imageUrl: "https://placehold.co/600x400.png", dataAiHint: "layout grid", category: "CSS", externalLink: "https://css-tricks.com/getting-started-css-grid/" },
  { id: '6', title: 'Introduction to TypeScript', type: 'Documentation', source: 'TypeScriptLang.org', description: "Get started with TypeScript, a superset of JavaScript that adds static typing, to build more robust and maintainable applications.", imageUrl: "https://placehold.co/600x400.png", dataAiHint: "typescript logo", category: "TypeScript", externalLink: "https://www.typescriptlang.org/docs/handbook/typescript-in-5-minutes.html" },
  { id: '7', title: 'JavaScript Promises: An In-Depth Guide', type: 'Article', source: 'Web Dev Simplified', description: "A detailed explanation of JavaScript Promises, how they work, and how to use them effectively for handling asynchronous operations.", imageUrl: "https://placehold.co/600x400.png", dataAiHint: "promise chain", category: "Asynchronous JS", externalLink: "https://blog.webdevsimplified.com/2020-05/javascript-promises/" },
  { id: '8', title: 'React Router: Declarative Routing for React', type: 'Documentation', source: 'React Router Docs', description: "Learn how to implement client-side routing in your React applications using React Router for seamless navigation.", imageUrl: "https://placehold.co/600x400.png", dataAiHint: "navigation map", category: "React", externalLink: "https://reactrouter.com/en/main" },
];
