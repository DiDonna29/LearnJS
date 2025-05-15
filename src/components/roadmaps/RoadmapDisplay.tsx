import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,} from "@/components/ui/accordion"
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { CheckCircle2, GitFork, Layers, MonitorSmartphone, Server, Zap } from "lucide-react";
import { roadmaps } from "@/lib/constants"; // Import the updated data

export default function RoadmapDisplay() {
  return (
    <Accordion type="multiple" className="w-full space-y-4">
      {roadmaps.map((roadmap) => (
        <AccordionItem key={roadmap.id} value={roadmap.id} className="bg-card border rounded-lg shadow-sm hover:shadow-md transition-shadow">
          <AccordionTrigger className="p-6 text-xl hover:no-underline">
            <div className="flex items-center gap-3">
              {/* Dynamically rendering icon based on roadmap.id or a predefined mapping */}
              {roadmap.id === 'frontend' && <MonitorSmartphone className="h-7 w-7 text-primary" />}
              {roadmap.id === 'backend' && <Server className="h-7 w-7 text-primary" />}
              {roadmap.id === 'fullstack' && <Layers className="h-7 w-7 text-primary" />}
              {roadmap.title}
            </div>
          </AccordionTrigger>
          <AccordionContent className="p-6 pt-0">
            <p className="text-muted-foreground mb-4">{roadmap.description}</p>
            <Accordion type="single" collapsible className="w-full space-y-3">
              {roadmap.courses.map(module => ( // Changed from modules to courses to match constants.ts structure
                <AccordionItem key={module.id} value={module.id} className="border rounded-md bg-background/50">
                  <AccordionTrigger className="px-4 py-3 text-lg font-medium hover:no-underline">
                    <div className="flex items-center gap-2">
                      <GitFork className="h-5 w-5 text-primary/80" />
                      {module.title}
                    </div>
                  </AccordionTrigger>
                  <AccordionContent className="px-4 pb-4 pt-0">
                    {/* Display course description instead of topics list, as topics are not in constants.ts */}
                    <p className="text-sm text-muted-foreground mt-1 p-3 border rounded-sm bg-background">
                      {module.description}
                    </p>
                    {/* Placeholder for future topic details or link to content */}
                     <div className="mt-3 text-right">
                       <Button variant="link" size="sm" className="text-primary p-0 h-auto">
                          View Content (Locked for Visitor) <CheckCircle2 className="ml-1 h-4 w-4" />
                        </Button>
                    </div>
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
