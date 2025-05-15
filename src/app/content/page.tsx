import ContentCard from '@/components/content/ContentCard';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { BookOpenText, Search } from 'lucide-react';

const mockContent = [
  { id: '1', title: 'Understanding JavaScript Closures', type: 'Article', source: 'MDN Web Docs', description: "A deep dive into closures, a fundamental concept in JavaScript.", imageUrl: "https://placehold.co/600x400.png", dataAiHint: "code editor", category: "Core Concepts" },
  { id: '2', title: 'Asynchronous JavaScript with Async/Await', type: 'Tutorial', source: 'JavaScript.info', description: "Learn how to handle asynchronous operations gracefully using async/await.", imageUrl: "https://placehold.co/600x400.png", dataAiHint: "network nodes", category: "Asynchronous JS" },
  { id: '3', title: 'React State Management with Hooks', type: 'Documentation', source: 'React Official Docs', description: "Official documentation on using useState and useEffect for state in React.", imageUrl: "https://placehold.co/600x400.png", dataAiHint: "react logo", category: "React" },
  { id: '4', title: 'Building a REST API with Node.js and Express', type: 'Article', source: 'Smashing Magazine', description: "A comprehensive guide to creating backend APIs.", imageUrl: "https://placehold.co/600x400.png", dataAiHint: "server database", category: "Node.js" },
  { id: '5', title: 'CSS Grid Layout Tutorial', type: 'Tutorial', source: 'CSS-Tricks', description: "Master the powerful CSS Grid for complex web layouts.", imageUrl: "https://placehold.co/600x400.png", dataAiHint: "layout grid", category: "CSS" },
  { id: '6', title: 'Introduction to TypeScript', type: 'Documentation', source: 'TypeScriptLang.org', description: "Get started with TypeScript for safer JavaScript development.", imageUrl: "https://placehold.co/600x400.png", dataAiHint: "typescript logo", category: "TypeScript" },
];

export default function ContentPage() {
  return (
    <div className="space-y-8">
      <Card className="shadow-md">
        <CardHeader>
          <CardTitle className="text-3xl flex items-center gap-3"><BookOpenText className="h-8 w-8 text-primary" /> Curated Learning Content</CardTitle>
          <CardDescription className="text-lg">
            Explore a collection of high-quality JavaScript articles, tutorials, and documentation to supplement your learning.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col md:flex-row gap-4 mb-6">
            <div className="relative flex-grow">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
              <Input type="search" placeholder="Search content..." className="pl-10" />
            </div>
            <Select>
              <SelectTrigger className="w-full md:w-[200px]">
                <SelectValue placeholder="Filter by type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Types</SelectItem>
                <SelectItem value="article">Article</SelectItem>
                <SelectItem value="tutorial">Tutorial</SelectItem>
                <SelectItem value="documentation">Documentation</SelectItem>
              </SelectContent>
            </Select>
            <Select>
              <SelectTrigger className="w-full md:w-[200px]">
                <SelectValue placeholder="Filter by category" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Categories</SelectItem>
                <SelectItem value="core">Core Concepts</SelectItem>
                <SelectItem value="async">Asynchronous JS</SelectItem>
                <SelectItem value="react">React</SelectItem>
                <SelectItem value="node">Node.js</SelectItem>
                <SelectItem value="css">CSS</SelectItem>
                <SelectItem value="ts">TypeScript</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
        {mockContent.map((content) => (
          <ContentCard key={content.id} {...content} />
        ))}
      </div>
       <p className="text-center text-muted-foreground mt-8">
        More content coming soon! Simple users can view limited content. Upgrade to PRO for full access.
      </p>
    </div>
  );
}
