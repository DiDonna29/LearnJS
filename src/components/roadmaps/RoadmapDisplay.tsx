'use client';

import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion"
import { Button } from "@/components/ui/button";
import { GitFork, Layers, MonitorSmartphone, Server, ArrowUpRight } from "lucide-react";
import type { Roadmap as RoadmapType, Course as CourseType } from "@/lib/types";
import { motion } from "framer-motion";
import Link from 'next/link';

const iconMap: Record<string, React.ElementType> = {
  MonitorSmartphone,
  Server,
  Layers,
  GitFork,
};

interface RoadmapDisplayProps {
  roadmaps: RoadmapType[];
}

export default function RoadmapDisplay({ roadmaps }: RoadmapDisplayProps) {
  if (!roadmaps || roadmaps.length === 0) {
    return (
      <div className="text-center py-20 bg-accent/30 rounded-2xl border border-dashed border-primary/20">
        <p className="text-muted-foreground font-medium">No roadmaps available at the moment.</p>
      </div>
    );
  }

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="w-full space-y-6 overflow-hidden"
    >
      <Accordion type="multiple" className="space-y-4">
        {roadmaps.map((roadmap: RoadmapType) => {
          const IconComponent = roadmap.iconName && iconMap[roadmap.iconName] ? iconMap[roadmap.iconName] : GitFork;
          return (
            <AccordionItem 
              key={roadmap.id} 
              value={roadmap.id} 
              className="bg-card border-2 rounded-2xl overflow-hidden shadow-sm hover:shadow-md transition-all duration-300 px-2"
            >
              <AccordionTrigger className="p-4 lg:p-6 text-xl hover:no-underline font-bold group">
                <div className="flex items-center gap-4 text-left w-full overflow-hidden">
                  <div className="flex-shrink-0 w-12 h-12 rounded-xl bg-primary/5 flex items-center justify-center group-hover:bg-primary/10 transition-colors">
                    <IconComponent className="h-6 w-6 text-primary" />
                  </div>
                  <span className="truncate break-words pr-4 block w-full">{roadmap.title}</span>
                </div>
              </AccordionTrigger>
              <AccordionContent className="px-6 pb-6 pt-0">
                <div className="pl-0 md:pl-16 space-y-6 overflow-hidden">
                  <p className="text-muted-foreground text-lg leading-relaxed max-w-3xl border-l-2 border-primary/20 pl-4 break-words">
                    {roadmap.description}
                  </p>
                  
                  <div className="space-y-3 pt-4 overflow-hidden">
                    <h4 className="text-sm font-bold uppercase tracking-widest text-primary/60 flex items-center gap-2">
                      <Layers className="h-4 w-4" /> Path Modules
                    </h4>
                    
                    {roadmap.courses && roadmap.courses.length > 0 ? (
                      <div className="grid gap-3 overflow-hidden">
                        {roadmap.courses.sort((a,b) => (a.displayOrder || 0) - (b.displayOrder || 0)).map((course: CourseType, cIndex: number) => (
                          <motion.div
                            key={course.id}
                            initial={{ opacity: 0, x: -10 }}
                            whileInView={{ opacity: 1, x: 0 }}
                            viewport={{ once: true }}
                            transition={{ delay: cIndex * 0.05 }}
                            className="group flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-4 rounded-xl border border-border bg-background hover:bg-accent/30 transition-colors overflow-hidden"
                          >
                            <div className="flex items-center gap-4 min-w-0 flex-1 overflow-hidden">
                              <span className="flex-shrink-0 w-8 h-8 rounded-full bg-secondary flex items-center justify-center text-xs font-bold text-muted-foreground">
                                {cIndex + 1}
                              </span>
                              <div className="min-w-0 flex-1">
                                <h5 className="font-bold truncate break-words">{course.title}</h5>
                                <p className="text-sm text-muted-foreground truncate break-words">
                                  {course.description}
                                </p>
                              </div>
                            </div>
                            
                            <Button variant="outline" size="sm" className="flex-shrink-0 rounded-full group-hover:bg-primary group-hover:text-primary-foreground transition-all" asChild disabled={!course.contentLink}>
                              <Link href={course.contentLink || '#'} target="_blank">
                                {course.contentLink ? (
                                  <>Access <ArrowUpRight className="ml-1 h-3 w-3" /></>
                                ) : (
                                  'Soon'
                                )}
                              </Link>
                            </Button>
                          </motion.div>
                        ))}
                      </div>
                    ) : (
                      <p className="text-muted-foreground italic text-sm">Curriculum under development.</p>
                    )}
                  </div>
                </div>
              </AccordionContent>
            </AccordionItem>
          );
        })}
      </Accordion>
    </motion.div>
  );
}
