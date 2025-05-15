import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { ArrowRight, Brain, Waypoints } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';

export default function HomePage() {
  return (
    <div className="space-y-12">
      <section className="text-center py-12">
        <h1 className="text-5xl font-bold mb-6 text-primary">Welcome to LearnJS</h1>
        <p className="text-xl text-muted-foreground max-w-2xl mx-auto mb-8">
          Navigate your path from beginner to JavaScript expert with interactive roadmaps, curated content, and AI-powered learning suggestions.
        </p>
        <div className="space-x-4">
          <Button size="lg" asChild>
            <Link href="/roadmaps">Explore Roadmaps <Waypoints className="ml-2 h-5 w-5" /></Link>
          </Button>
          <Button size="lg" variant="outline" asChild>
            <Link href="/ai-tool">AI Path Builder <Brain className="ml-2 h-5 w-5" /></Link>
          </Button>
        </div>
      </section>

      <section className="grid md:grid-cols-2 gap-8 items-center">
        <div>
          <h2 className="text-3xl font-semibold mb-4">Master JavaScript Development</h2>
          <p className="text-muted-foreground mb-6 text-lg">
            Whether you're aiming for front-end, back-end, or full-stack proficiency, LearnJS provides structured learning paths and resources to guide you. Our AI tool can even suggest a personalized plan based on your experience and goals.
          </p>
          <Button variant="link" asChild className="text-lg px-0 text-primary">
            <Link href="/about">Learn more about us <ArrowRight className="ml-2 h-5 w-5" /></Link>
          </Button>
        </div>
        <div>
          <Image
            src="https://placehold.co/600x400.png"
            alt="Abstract representation of learning paths"
            data-ai-hint="learning code"
            width={600}
            height={400}
            className="rounded-lg shadow-xl object-cover"
          />
        </div>
      </section>

      <section className="grid md:grid-cols-3 gap-6">
        <Card className="shadow-lg hover:shadow-xl transition-shadow">
          <CardHeader>
            <CardTitle className="flex items-center gap-2"><Waypoints className="text-primary"/> Interactive Roadmaps</CardTitle>
          </CardHeader>
          <CardContent>
            <CardDescription>Clear, visual learning paths for full-stack, front-end, and back-end JavaScript development.</CardDescription>
          </CardContent>
          <CardFooter>
            <Button variant="secondary" asChild>
              <Link href="/roadmaps">View Roadmaps</Link>
            </Button>
          </CardFooter>
        </Card>

        <Card className="shadow-lg hover:shadow-xl transition-shadow">
          <CardHeader>
            <CardTitle className="flex items-center gap-2"><Brain className="text-primary"/> AI Path Builder</CardTitle>
          </CardHeader>
          <CardContent>
            <CardDescription>Get personalized learning suggestions based on your experience level and career goals.</CardDescription>
          </CardContent>
          <CardFooter>
            <Button variant="secondary" asChild>
              <Link href="/ai-tool">Try AI Tool</Link>
            </Button>
          </CardFooter>
        </Card>

        <Card className="shadow-lg hover:shadow-xl transition-shadow">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-primary"><path d="M4 19.5v-15A2.5 2.5 0 0 1 6.5 2H20v20H6.5a2.5 2.5 0 0 1 0-5H20"/><path d="M6.5 2H20v20H6.5C4 22 4 19.5 4 19.5zM8 7h6M8 12h8M8 17h4"/></svg>
              Curated Content
            </CardTitle>
          </CardHeader>
          <CardContent>
            <CardDescription>Access a rich library of articles, tutorials, and documentation to support your learning journey.</CardDescription>
          </CardContent>
          <CardFooter>
            <Button variant="secondary" asChild>
              <Link href="/content">Browse Content</Link>
            </Button>
          </CardFooter>
        </Card>
      </section>
    </div>
  );
}
