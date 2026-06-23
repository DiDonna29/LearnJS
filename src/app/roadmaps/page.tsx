
import RoadmapDisplay from '@/components/roadmaps/RoadmapDisplay';
import { Waypoints, Loader2, Sparkles, Map } from 'lucide-react';
import { getRoadmaps } from '@/lib/server/dataService';
import type { Roadmap } from '@/lib/types';
import { Suspense } from 'react';

async function RoadmapsData() {
  const roadmapsData: Roadmap[] = await getRoadmaps();
  return <RoadmapDisplay roadmaps={roadmapsData} />;
}

export default function RoadmapsPage() {
  return (
    <div className="max-w-6xl mx-auto px-4 space-y-12 pb-20">
      <header className="space-y-6 pt-8 text-center lg:text-left">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 text-primary text-sm font-bold border border-primary/20">
          <Map className="h-4 w-4" />
          <span>Professional Paths</span>
        </div>
        <div className="space-y-2">
          <h1 className="text-4xl lg:text-6xl font-black tracking-tighter uppercase leading-tight">
            Interactive <br/><span className="text-primary italic">Roadmaps</span>
          </h1>
          <p className="text-xl text-muted-foreground max-w-2xl leading-relaxed text-balance">
            Follow our battle-tested learning paths to master modern JavaScript engineering. Choose your specialty and start building.
          </p>
        </div>
      </header>

      <Suspense fallback={
        <div className="flex flex-col justify-center items-center py-40 space-y-4">
          <Loader2 className="h-12 w-12 animate-spin text-primary" />
          <p className="text-muted-foreground font-bold uppercase tracking-widest text-xs">Assembling curriculum...</p>
        </div>
      }>
        <div className="relative overflow-hidden">
          <RoadmapsData />
        </div>
      </Suspense>

      <footer className="mt-20 p-8 rounded-3xl bg-primary/5 border border-primary/10 text-center space-y-4">
        <Sparkles className="h-8 w-8 text-primary mx-auto mb-2" />
        <h3 className="text-xl font-bold">Unsure which path is right for you?</h3>
        <p className="text-muted-foreground max-w-lg mx-auto">
          Our AI tool can analyze your current skills and suggest the perfect starting point.
        </p>
        <div className="pt-4">
          <a href="/ai-tool" className="inline-flex items-center gap-2 font-bold uppercase tracking-widest text-xs text-primary hover:underline">
            Try AI Builder →
          </a>
        </div>
      </footer>
    </div>
  );
}
