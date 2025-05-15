
import ContentCard from '@/components/content/ContentCard';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { BookOpenText, Search } from 'lucide-react';
import { mockContent } from '@/lib/constants'; // Import centralized mock data

// This is now a Server Component, data is fetched/imported directly
export default function ContentPage() {
  // In a real application, you'd fetch this data from your backend/database
  const contentItems = mockContent;

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
                <SelectItem value="Article">Article</SelectItem>
                <SelectItem value="Tutorial">Tutorial</SelectItem>
                <SelectItem value="Documentation">Documentation</SelectItem>
              </SelectContent>
            </Select>
            <Select>
              <SelectTrigger className="w-full md:w-[200px]">
                <SelectValue placeholder="Filter by category" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Categories</SelectItem>
                {/* Dynamically generate categories if needed, or list them */}
                <SelectItem value="Core Concepts">Core Concepts</SelectItem>
                <SelectItem value="Asynchronous JS">Asynchronous JS</SelectItem>
                <SelectItem value="React">React</SelectItem>
                <SelectItem value="Node.js">Node.js</SelectItem>
                <SelectItem value="CSS">CSS</SelectItem>
                <SelectItem value="TypeScript">TypeScript</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {contentItems.length > 0 ? (
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {contentItems.map((content) => (
            <ContentCard key={content.id} {...content} />
          ))}
        </div>
      ) : (
        <Card>
          <CardContent className="p-6 text-center text-muted-foreground">
            <p>No content available at the moment. Please check back later.</p>
          </CardContent>
        </Card>
      )}
       <p className="text-center text-muted-foreground mt-8">
        More content coming soon! Simple users can view limited content. Upgrade to PRO for full access.
      </p>
    </div>
  );
}
