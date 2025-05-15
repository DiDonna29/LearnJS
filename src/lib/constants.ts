// src/lib/constants.ts

export const APP_NAME = "LearnJS";

export const USER_ROLES = {
  VISITOR: "Visitor",
  SIMPLE: "Simple User",
  PRO: "PRO User",
  ADMIN: "Admin",
} as const;

// Add other constants as needed

export interface Course {
  id: string;
  title: string;
  description: string; // Add description for each course
  // ... other existing fields
}

export interface Roadmap {
  id: string;
  title: string;
  description: string; // Add description for each roadmap
  courses: Course[];
}

export const roadmaps: Roadmap[] = [
  {
    id: 'frontend',
    title: 'Frontend JavaScript Roadmap',
    description: 'Learn the fundamentals of building interactive user interfaces with JavaScript, HTML, and CSS.', // Add roadmap description
    courses: [
      {
        id: 'html-css',
        title: 'HTML and CSS Fundamentals',
        description: 'Learn the building blocks of web pages.', // Add course description
      },
      {
        id: 'js-basics',
        title: 'JavaScript Basics',
        description: 'Understand core JavaScript concepts like variables, data types, and control flow.', // Add course description
      },
      {
        id: 'dom-manipulation',
        title: 'DOM Manipulation',
        description: 'Learn how to interact with and modify web page elements.', // Add course description
      },
      // Add descriptions for other frontend courses
    ],
  },
  {
    id: 'backend',
    title: 'Backend JavaScript Roadmap',
    description: 'Explore building server-side applications and APIs with Node.js.', // Add roadmap description
    courses: [
      {
        id: 'node-basics',
        title: 'Node.js Fundamentals',
        description: 'Get started with the Node.js runtime environment.', // Add course description
      },
      {
        id: 'express-js',
        title: 'Express.js Framework',
        description: 'Learn how to build web applications and APIs with Express.', // Add course description
      },
      // Add descriptions for other backend courses
    ],
  },
  {
    id: 'fullstack',
    title: 'Fullstack JavaScript Roadmap',
    description: 'Combine frontend and backend skills to build complete web applications.', // Add roadmap description
    courses: [
      {
        id: 'frontend-basics',
        title: 'Frontend Fundamentals (Review)',
        description: 'A quick refresher on essential frontend concepts.', // Add course description
      },
      {
        id: 'backend-basics',
        title: 'Backend Fundamentals (Review)',
        description: 'A quick refresher on essential backend concepts.', // Add course description
      },
      {
        id: 'database-integration',
        title: 'Database Integration',
        description: 'Learn how to connect your application to a database.', // Add course description
      },
      // Add descriptions for other fullstack courses
    ],
  },
];
// Add other constants as needed
