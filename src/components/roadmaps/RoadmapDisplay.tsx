import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion"
import { Badge } from "@/components/ui/badge";
import { CheckCircle2, GitFork, Layers, MonitorSmartphone, Server, Zap } from "lucide-react";

interface RoadmapTopic {
  id: string;
  title: string;
  description: string;
  resources?: { type: 'article' | 'video' | 'docs'; url: string; title: string }[];
  difficulty: 'Beginner' | 'Intermediate' | 'Advanced';
}

interface RoadmapModule {
  id: string;
  title: string;
  topics: RoadmapTopic[];
}

interface Roadmap {
  id: string;
  title: string;
  icon: React.ElementType;
  description: string;
  modules: RoadmapModule[];
}

const roadmapsData: Roadmap[] = [
  {
    id: "frontend",
    title: "Front-End Developer Path",
    icon: MonitorSmartphone,
    description: "Learn to build modern, interactive user interfaces for the web.",
    modules: [
      {
        id: "fem1", title: "HTML & CSS Fundamentals", topics: [
          { id: "fet1", title: "HTML Structure", description: "Learn the basic building blocks of web pages.", difficulty: 'Beginner' },
          { id: "fet2", title: "CSS Styling", description: "Understand how to style HTML elements with CSS.", difficulty: 'Beginner' },
          { id: "fet3", title: "Responsive Design", description: "Make your websites look great on all devices.", difficulty: 'Intermediate' },
        ]
      },
      {
        id: "fem2", title: "JavaScript Basics", topics: [
          { id: "fet4", title: "Variables & Data Types", description: "Core concepts of JavaScript.", difficulty: 'Beginner' },
          { id: "fet5", title: "DOM Manipulation", description: "Interact with web page elements.", difficulty: 'Intermediate' },
          { id: "fet6", title: "ES6+ Features", description: "Modern JavaScript syntax and features.", difficulty: 'Intermediate' },
        ]
      },
      {
        id: "fem3", title: "Front-End Frameworks", topics: [
          { id: "fet7", title: "React.js / Next.js", description: "Build powerful single-page applications.", difficulty: 'Advanced' },
          { id: "fet8", title: "State Management", description: "Manage complex application state.", difficulty: 'Advanced' },
        ]
      },
    ]
  },
  {
    id: "backend",
    title: "Back-End Developer Path",
    icon: Server,
    description: "Master server-side logic, databases, and APIs with JavaScript.",
    modules: [
      {
        id: "bem1", title: "Node.js & Express.js", topics: [
          { id: "bet1", title: "Node.js Fundamentals", description: "Understand the Node.js runtime.", difficulty: 'Intermediate' },
          { id: "bet2", title: "Express.js for APIs", description: "Build RESTful APIs with Express.", difficulty: 'Intermediate' },
        ]
      },
      {
        id: "bem2", title: "Databases", topics: [
          { id: "bet3", title: "SQL Databases (e.g., PostgreSQL)", description: "Learn relational database concepts.", difficulty: 'Intermediate' },
          { id: "bet4", title: "NoSQL Databases (e.g., MongoDB)", description: "Explore document-based databases.", difficulty: 'Advanced' },
        ]
      },
      {
        id: "bem3", title: "Authentication & Security", topics: [
          { id: "bet5", title: "JWT Authentication", description: "Secure your APIs with JSON Web Tokens.", difficulty: 'Advanced' },
          { id: "bet6", title: "Common Security Practices", description: "Protect against web vulnerabilities.", difficulty: 'Advanced' },
        ]
      },
    ]
  },
  {
    id: "fullstack",
    title: "Full-Stack Developer Path",
    icon: Layers,
    description: "Become proficient in both front-end and back-end development using JavaScript.",
    modules: [
       {
        id: "fsm0", title: "Core Concepts (Recap)", topics: [
          { id: "fst0-1", title: "HTML, CSS, JS Review", description: "Ensure strong fundamentals.", difficulty: 'Beginner'},
          { id: "fst0-2", title: "Version Control (Git)", description: "Essential for collaboration.", difficulty: 'Beginner'},
        ]
      },
      {
        id: "fsm1", title: "Front-End Development", topics: [
          { id: "fst1", title: "React.js / Next.js Deep Dive", description: "Advanced front-end techniques.", difficulty: 'Intermediate' },
          { id: "fst2", title: "UI/UX Principles", description: "Understand user-centric design.", difficulty: 'Intermediate' },
        ]
      },
      {
        id: "fsm2", title: "Back-End Development", topics: [
          { id: "fst3", title: "Advanced Node.js & API Design", description: "Scalable and robust APIs.", difficulty: 'Advanced' },
          { id: "fst4", title: "Database Optimization", description: "Efficient data management.", difficulty: 'Advanced' },
        ]
      },
      {
        id: "fsm3", title: "DevOps & Deployment", topics: [
          { id: "fst5", title: "CI/CD Pipelines", description: "Automate testing and deployment.", difficulty: 'Advanced' },
          { id: "fst6", title: "Cloud Platforms (e.g., Firebase, Vercel)", description: "Deploy applications to the cloud.", difficulty: 'Advanced' },
        ]
      },
    ]
  }
];

export default function RoadmapDisplay() {
  return (
    <Accordion type="multiple" className="w-full space-y-4">
      {roadmapsData.map((roadmap) => (
        <AccordionItem key={roadmap.id} value={roadmap.id} className="bg-card border rounded-lg shadow-sm hover:shadow-md transition-shadow">
          <AccordionTrigger className="p-6 text-xl hover:no-underline">
            <div className="flex items-center gap-3">
              <roadmap.icon className="h-7 w-7 text-primary" />
              {roadmap.title}
            </div>
          </AccordionTrigger>
          <AccordionContent className="p-6 pt-0">
            <p className="text-muted-foreground mb-4">{roadmap.description}</p>
            <Accordion type="single" collapsible className="w-full space-y-3">
              {roadmap.modules.map(module => (
                <AccordionItem key={module.id} value={module.id} className="border rounded-md bg-background/50">
                  <AccordionTrigger className="px-4 py-3 text-lg font-medium hover:no-underline">
                    <div className="flex items-center gap-2">
                      <GitFork className="h-5 w-5 text-primary/80" />
                      {module.title}
                    </div>
                  </AccordionTrigger>
                  <AccordionContent className="px-4 pb-4 pt-0">
                    <ul className="space-y-3">
                      {module.topics.map(topic => (
                        <li key={topic.id} className="p-3 border rounded-sm bg-background hover:bg-secondary/30">
                          <div className="flex justify-between items-start">
                            <div>
                              <h4 className="font-semibold text-md flex items-center gap-2">
                                <Zap className="h-4 w-4 text-accent-foreground/80" /> {topic.title}
                              </h4>
                              <p className="text-sm text-muted-foreground mt-1">{topic.description}</p>
                            </div>
                            <Badge 
                              variant={topic.difficulty === 'Beginner' ? 'secondary' : topic.difficulty === 'Intermediate' ? 'default' : 'destructive'}
                              className="whitespace-nowrap opacity-80"
                            >
                              {topic.difficulty}
                            </Badge>
                          </div>
                          {/* Placeholder for resources, lessons, etc. */}
                          <div className="mt-3 text-right">
                             <Button variant="link" size="sm" className="text-primary p-0 h-auto">
                                View Content (Locked for Visitor) <CheckCircle2 className="ml-1 h-4 w-4" />
                              </Button>
                          </div>
                        </li>
                      ))}
                    </ul>
                  </AccordionContent>
                </AccordionItem>
              ))}
            </Accordion>
          </AccordionContent>
        </AccordionItem>
      ))}
    </Accordion>
  );
}
