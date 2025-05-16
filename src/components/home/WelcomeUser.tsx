
'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { onAuthStateChanged, type User as FirebaseUser } from 'firebase/auth';
import { auth } from '@/lib/firebase';
import { fetchUserProfile } from '@/app/profile/actions';
import type { UserProfileData } from '@/lib/types';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { User, ArrowRight, Brain, Waypoints, Loader2 } from 'lucide-react';

export default function WelcomeUser() {
  const [authUser, setAuthUser] = useState<FirebaseUser | null>(null);
  const [profile, setProfile] = useState<UserProfileData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (user) {
        setAuthUser(user);
        try {
          const userProfile = await fetchUserProfile(user.uid);
          setProfile(userProfile);
        } catch (e) {
          console.error("Failed to fetch user profile for welcome message:", e);
          // Set a default profile or parts of it if authUser is available
          setProfile({
            id: user.uid,
            displayName: user.displayName || "Learner",
            email: user.email || "",
            // Fill other fields with defaults or leave as is
            photoURL: user.photoURL,
            role: 'Simple User',
            address: '',
            createdAt: new Date(),
          });
        }
      } else {
        setAuthUser(null);
        setProfile(null);
      }
      setLoading(false);
    });
    return () => unsubscribe();
  }, []);

  if (loading) {
    return (
      <div className="my-8 p-6 text-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary mx-auto" />
      </div>
    );
  }

  if (authUser && profile) {
    return (
      <Card className="my-8 shadow-lg bg-gradient-to-r from-primary/10 via-card to-accent/10 border-primary/30">
        <CardHeader>
          <CardTitle className="text-3xl text-primary">
            Welcome back, {profile.displayName || "Learner"}!
          </CardTitle>
          <CardDescription className="text-lg text-foreground/80">
            Ready to continue your JavaScript journey? Here are some quick links to get you started.
          </CardDescription>
        </CardHeader>
        <CardContent className="grid md:grid-cols-2 gap-4">
          <Link href="/profile" passHref>
            <Button variant="outline" className="w-full justify-start text-left h-auto py-3 group">
              <User className="mr-3 h-5 w-5 text-primary group-hover:scale-110 transition-transform" />
              <div>
                <p className="font-semibold">Your Profile</p>
                <p className="text-sm text-muted-foreground">View and manage your account settings.</p>
              </div>
            </Button>
          </Link>
          <Link href="/ai-tool" passHref>
            <Button variant="outline" className="w-full justify-start text-left h-auto py-3 group">
              <Brain className="mr-3 h-5 w-5 text-primary group-hover:scale-110 transition-transform" />
               <div>
                <p className="font-semibold">AI Path Builder</p>
                <p className="text-sm text-muted-foreground">Get a personalized learning path.</p>
              </div>
            </Button>
          </Link>
           <Link href="/roadmaps" passHref>
            <Button variant="outline" className="w-full justify-start text-left h-auto py-3 group">
              <Waypoints className="mr-3 h-5 w-5 text-primary group-hover:scale-110 transition-transform" />
               <div>
                <p className="font-semibold">Explore Roadmaps</p>
                <p className="text-sm text-muted-foreground">Discover structured learning paths.</p>
              </div>
            </Button>
          </Link>
           <Link href="/content" passHref>
            <Button variant="outline" className="w-full justify-start text-left h-auto py-3 group">
              <Waypoints className="mr-3 h-5 w-5 text-primary group-hover:scale-110 transition-transform" /> {/* Consider a different icon like BookOpen */}
               <div>
                <p className="font-semibold">Browse Content</p>
                <p className="text-sm text-muted-foreground">Find articles, tutorials, and more.</p>
              </div>
            </Button>
          </Link>
        </CardContent>
      </Card>
    );
  }

  // If not logged in, this component can render nothing or a generic CTA
  // For now, it renders nothing if not logged in, as the main home page already has CTAs.
  return null; 
}
