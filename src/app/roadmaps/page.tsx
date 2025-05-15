
import RoadmapDisplay from '@/components/roadmaps/RoadmapDisplay';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Waypoints, Loader2 } from 'lucide-react';
import { getRoadmaps } from '@/lib/server/dataService';
import type { Roadmap } from '@/lib/types';
import { Suspense } from 'react';

async function RoadmapsData() {
  const roadmapsData: Roadmap[] = await getRoadmaps();
  return <RoadmapDisplay roadmaps={roadmapsData} />;
}

export default function RoadmapsPage() {
  return (
    <div className="space-y-8">
      <Card className="shadow-md">
        <CardHeader>
          <CardTitle className="text-3xl flex items-center gap-3"><Waypoints className="h-8 w-8 text-primary" /> Interactive Learning Roadmaps</CardTitle>
          <CardDescription className="text-lg">
            Follow our structured learning paths to master JavaScript development. Choose your desired track and expand sections to see detailed topics.
          </CardDescription>
        </CardHeader>
        <CardContent>
           <p className="text-muted-foreground mb-6">
            These roadmaps provide a step-by-step guide, helping you understand what to learn and in what order. Click on any path to explore its modules and topics.
          </p>
        </CardContent>
      </Card>
      <Suspense fallback={
        <div className="flex justify-center items-center min-h-[200px]">
          <Loader2 className="h-12 w-12 animate-spin text-primary" />
          <p className="ml-4 text-lg">Loading roadmaps...</p>
        </div>
      }>
        <RoadmapsData />
      </Suspense>
    </div>
  );
}
