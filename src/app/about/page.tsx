
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Lightbulb, Users, DatabaseZap, UserPlus } from "lucide-react";
import Image from "next/image";
import Link from "next/link";

export default function AboutPage() {
  return (
    <div className="space-y-10">
      <section className="text-center">
        <h1 className="text-4xl font-bold mb-4 text-primary">About LearnJS</h1>
        <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
          Empowering aspiring developers to master JavaScript through clear roadmaps, quality resources, and innovative learning tools.
        </p>
      </section>

      <Card className="shadow-lg">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-2xl"><Lightbulb className="text-primary" /> Our Mission</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4 text-lg text-foreground/90">
          <p>
            Learning to code, especially a versatile language like JavaScript, can be daunting. With countless resources and ever-evolving technologies, it's easy to feel lost. LearnJS was created to simplify this journey. Our mission is to provide clear, structured, and accessible learning paths for anyone looking to break into web development or enhance their JavaScript skills.
          </p>
          <p>
            We believe that with the right guidance and resources, anyone can become a proficient JavaScript developer. Whether your goal is front-end, back-end, or full-stack development, LearnJS is here to support you every step of the way.
          </p>
        </CardContent>
      </Card>
      
      <div className="grid md:grid-cols-2 gap-8 items-start">
        <Card className="shadow-md">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-2xl"><Users className="text-primary" /> How to Use LearnJS</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3 text-foreground/90">
            <p><strong>1. Explore Roadmaps:</strong> Start by checking out our interactive roadmaps for front-end, back-end, and full-stack development. These visual guides break down complex learning into manageable stages.</p>
            <p><strong>2. Browse Curated Content:</strong> Supplement your learning with our collection of articles, tutorials, and documentation from trusted sources across the web.</p>
            <p><strong>3. Use the AI Path Builder:</strong> If you're unsure where to begin or want a personalized plan, our AI tool can suggest a learning path tailored to your experience and goals.</p>
            <p><strong>4. Register & Track Progress:</strong> Create an account to save your progress, customize your learning experience, and access more features.</p>
          </CardContent>
        </Card>
        <Image 
          src="https://placehold.co/500x350.png" 
          alt="Illustration of a person learning on a computer"
          data-ai-hint="learning computer"
          width={500} 
          height={350} 
          className="rounded-lg shadow-xl object-cover"
        />
      </div>

      <Card className="shadow-lg">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-2xl"><DatabaseZap className="text-primary" /> Content Sources</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4 text-lg text-foreground/90">
          <p>
            The content on LearnJS is carefully curated from reputable public sources. This includes:
          </p>
          <ul className="list-disc list-inside ml-4 space-y-1">
            <li>Official JavaScript documentation (e.g., MDN Web Docs)</li>
            <li>Well-known programming blogs and tutorial sites (e.g., JavaScript.info, CSS-Tricks, Smashing Magazine)</li>
            <li>Documentation from popular libraries and frameworks (e.g., React, Node.js, Express)</li>
          </ul>
          <p>
            Our goal is to point you to the best existing resources, not to reinvent the wheel. We believe in leveraging the fantastic work already done by the developer community. While roadmaps are our own, the learning material links will generally point to external trusted sites.
          </p>
          <p className="text-sm text-muted-foreground">
            Note: LearnJS is a learning platform and does not claim ownership of externally linked content. All rights belong to their respective owners.
          </p>
        </CardContent>
      </Card>

      <section className="text-center py-8">
        <h2 className="text-3xl font-semibold mb-4">Ready to Start Your Journey?</h2>
        <p className="text-lg text-muted-foreground mb-6">Join LearnJS today and take the first step towards JavaScript mastery.</p>
        <Button size="lg" asChild>
          <Link href="/register">
            <UserPlus className="mr-2 h-5 w-5" /> Sign Up Now
          </Link>
        </Button>
      </section>
    </div>
  );
}

