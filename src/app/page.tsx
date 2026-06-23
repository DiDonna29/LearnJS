'use client';

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { ArrowRight, Brain, Waypoints, Zap, Shield, Sparkles } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import WelcomeUser from '@/components/home/WelcomeUser';
import { motion } from 'framer-motion';
import placeholderImages from '@/app/lib/placeholder-images.json';

export default function HomePage() {
  const container = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: { staggerChildren: 0.1 }
    }
  };

  const item = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0 }
  };

  return (
    <div className="space-y-24 pb-20">
      {/* Hero Section */}
      <section className="relative pt-12 lg:pt-20 text-center overflow-hidden">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5 }}
          className="container mx-auto px-4 relative z-10"
        >
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 text-primary text-sm font-medium mb-6 border border-primary/20">
            <Sparkles className="h-4 w-4" />
            <span>Master JavaScript with AI Guidance</span>
          </div>
          <h1 className="text-5xl lg:text-7xl font-bold tracking-tight mb-6 text-balance leading-[1.1]">
            Your Journey to <span className="text-primary italic">Mastery</span> Starts Here
          </h1>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto mb-10 text-balance leading-relaxed">
            Navigate the JavaScript ecosystem with clarity. Interactive roadmaps, expert resources, and AI-driven personalization for the modern developer.
          </p>
          
          <WelcomeUser />

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Button size="lg" className="rounded-full px-8 h-12 text-base font-semibold transition-all hover:scale-105 active:scale-95" asChild>
              <Link href="/roadmaps">Explore Roadmaps <Waypoints className="ml-2 h-5 w-5" /></Link>
            </Button>
            <Button size="lg" variant="outline" className="rounded-full px-8 h-12 text-base font-semibold border-2 transition-all hover:bg-accent" asChild>
              <Link href="/ai-tool">AI Path Builder <Brain className="ml-2 h-5 w-5" /></Link>
            </Button>
          </div>
        </motion.div>
        
        {/* Background Decor */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-full -z-10 opacity-30 pointer-events-none">
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[800px] bg-primary/20 rounded-full blur-[120px]" />
        </div>
      </section>

      {/* Feature Highlight */}
      <section className="container mx-auto px-4">
        <div className="grid lg:grid-cols-2 gap-16 items-center">
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="space-y-6"
          >
            <h2 className="text-3xl lg:text-4xl font-bold leading-tight">Professional JS Curriculum, <br/>Simplified.</h2>
            <p className="text-muted-foreground text-lg leading-relaxed">
              We've audited thousands of resources to bring you only what matters. No fluff, no outdated patterns—just pure, high-performance JavaScript engineering.
            </p>
            <ul className="space-y-4">
              {[
                { icon: Zap, text: "Accelerated learning with AI suggestions" },
                { icon: Shield, text: "Curated content from official sources" },
                { icon: Sparkles, text: "Modern ESM & Fullstack roadmaps" }
              ].map((f, i) => (
                <li key={i} className="flex items-center gap-3 font-medium">
                  <f.icon className="h-5 w-5 text-primary" />
                  <span>{f.text}</span>
                </li>
              ))}
            </ul>
            <Button variant="link" asChild className="text-lg px-0 text-primary group">
              <Link href="/about">
                Learn our philosophy 
                <ArrowRight className="ml-2 h-5 w-5 transition-transform group-hover:translate-x-1" />
              </Link>
            </Button>
          </motion.div>
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="relative"
          >
            <div className="absolute -inset-4 bg-primary/5 rounded-3xl -rotate-2" />
            <Image
              src={placeholderImages.hero.url}
              alt="Professional Code Workspace"
              width={placeholderImages.hero.width}
              height={placeholderImages.hero.height}
              className="relative rounded-2xl shadow-2xl border border-border grayscale-[0.2] hover:grayscale-0 transition-all duration-500"
              data-ai-hint={placeholderImages.hero.hint}
            />
          </motion.div>
        </div>
      </section>

      {/* Action Grid */}
      <motion.section 
        variants={container}
        initial="hidden"
        whileInView="show"
        viewport={{ once: true }}
        className="container mx-auto px-4 grid md:grid-cols-3 gap-8"
      >
        {[
          {
            icon: Waypoints,
            title: "Roadmaps",
            desc: "Visual paths for Frontend, Backend, and Fullstack JS.",
            link: "/roadmaps"
          },
          {
            icon: Brain,
            title: "AI Builder",
            desc: "Personalized path based on your experience.",
            link: "/ai-tool"
          },
          {
            icon: Sparkles,
            title: "Resources",
            desc: "The best documentation, curated for efficiency.",
            link: "/content"
          }
        ].map((card, i) => (
          <motion.div key={i} variants={item}>
            <Card className="h-full border-2 border-transparent hover:border-primary/20 hover:bg-accent/50 transition-all duration-300 group shadow-none">
              <CardHeader>
                <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center mb-4 group-hover:bg-primary group-hover:text-primary-foreground transition-colors">
                  <card.icon className="h-6 w-6" />
                </div>
                <CardTitle className="text-xl">{card.title}</CardTitle>
                <CardDescription className="text-base">{card.desc}</CardDescription>
              </CardHeader>
              <CardFooter>
                <Button variant="ghost" className="p-0 h-auto font-bold text-primary hover:bg-transparent" asChild>
                  <Link href={card.link} className="flex items-center gap-1 uppercase tracking-wider text-xs">
                    Explore <ArrowRight className="h-3 w-3" />
                  </Link>
                </Button>
              </CardFooter>
            </Card>
          </motion.div>
        ))}
      </motion.section>
    </div>
  );
}
