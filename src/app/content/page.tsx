
import ContentCard from '@/components/content/ContentCard';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { BookOpenText, Search, Loader2 } from 'lucide-react';
import { getContentItems } from '@/lib/server/dataService';
import type { ContentItem } from '@/lib/types';
import { Suspense } from 'react';

// This is a Server Component, data is fetched directly using await
async function ContentListData() {
  const contentItems: ContentItem[] = await getContentItems();

  if (!contentItems || contentItems.length === 0) {
    return (
      <Card>
        <CardContent className="p-6 text-center text-muted-foreground">
          <p>No content available at the moment. Please check back later.</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
      {contentItems.map((content) => (
        <ContentCard key={content.id} {...content} />
      ))}
    </div>
  );
}


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
          {/* Filtering controls could be made interactive with client components and state management */}
          <div className="flex flex-col md:flex-row gap-4 mb-6">
            <div className="relative flex-grow">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
              <Input type="search" placeholder="Search content... (not implemented)" className="pl-10" disabled />
            </div>
            <Select disabled>
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
            <Select disabled>
              <SelectTrigger className="w-full md:w-[200px]">
                <SelectValue placeholder="Filter by category" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Categories</SelectItem>
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

      <Suspense fallback={
        <div className="flex justify-center items-center min-h-[200px]">
          <Loader2 className="h-12 w-12 animate-spin text-primary" />
          <p className="ml-4 text-lg">Loading content...</p>
        </div>
      }>
        <ContentListData />
      </Suspense>
      
       <p className="text-center text-muted-foreground mt-8">
        More content coming soon! Simple users can view limited content. Upgrade to PRO for full access.
      </p>
    </div>
  );
}
