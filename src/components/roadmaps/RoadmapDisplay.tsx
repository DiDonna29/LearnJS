
'use client'; // This component uses client-side interactions (Accordion)

import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion"
import { Button } from "@/components/ui/button";
import { CheckCircle2, GitFork, Layers, MonitorSmartphone, Server } from "lucide-react";
import type { Roadmap as RoadmapType, Course as CourseType } from "@/lib/types";

const iconMap: Record<string, React.ElementType> = {
  MonitorSmartphone,
  Server,
  Layers,
  GitFork, // Added GitFork as a default if not specified
};

interface RoadmapDisplayProps {
  roadmaps: RoadmapType[];
}

export default function RoadmapDisplay({ roadmaps }: RoadmapDisplayProps) {
  if (!roadmaps || roadmaps.length === 0) {
    return <p className="text-center text-muted-foreground">No roadmaps available at the moment.</p>;
  }

  return (
    <Accordion type="multiple" className="w-full space-y-4">
      {roadmaps.map((roadmap: RoadmapType) => {
        const IconComponent = roadmap.iconName && iconMap[roadmap.iconName] ? iconMap[roadmap.iconName] : GitFork;
        return (
          <AccordionItem key={roadmap.id} value={roadmap.id} className="bg-card border rounded-lg shadow-sm hover:shadow-md transition-shadow">
            <AccordionTrigger className="p-6 text-xl hover:no-underline">
              <div className="flex items-center gap-3">
                <IconComponent className="h-7 w-7 text-primary" />
                {roadmap.title}
              </div>
            </AccordionTrigger>
            <AccordionContent className="p-6 pt-0">
              <p className="text-muted-foreground mb-4">{roadmap.description}</p>
              {roadmap.courses && roadmap.courses.length > 0 ? (
                <Accordion type="single" collapsible className="w-full space-y-3">
                  {roadmap.courses.map((course: CourseType) => (
                    <AccordionItem key={course.id} value={course.id} className="border rounded-md bg-background/50">
                      <AccordionTrigger className="px-4 py-3 text-lg font-medium hover:no-underline">
                        <div className="flex items-center gap-2">
                          <GitFork className="h-5 w-5 text-primary/80" />
                          {course.title}
                        </div>
                      </AccordionTrigger>
                      <AccordionContent className="px-4 pb-4 pt-0">
                        <p className="text-sm text-muted-foreground mt-1 p-3 border rounded-sm bg-background">
                          {course.description}
                        </p>
                         <div className="mt-3 text-right">
                           <Button variant="link" size="sm" className="text-primary p-0 h-auto" disabled={!course.contentLink} href={course.contentLink || '#'} target="_blank" rel="noopener noreferrer">
                              View Content {course.contentLink ? <CheckCircle2 className="ml-1 h-4 w-4" /> : '(Coming Soon)'}
                            </Button>
                        </div>
                      </AccordionContent>
                    </AccordionItem>
                  ))}
                </Accordion>
              ) : (
                <p className="text-muted-foreground">No courses available for this roadmap yet.</p>
              )}
            </AccordionContent>
          </AccordionItem>
        );
      })}
    </Accordion>
  );
}
