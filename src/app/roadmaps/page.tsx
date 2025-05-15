import RoadmapDisplay from '@/components/roadmaps/RoadmapDisplay';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Waypoints } from 'lucide-react';

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
      <RoadmapDisplay />
    </div>
  );
}
