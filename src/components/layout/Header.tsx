
'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { User as FirebaseUser, onAuthStateChanged, signOut } from 'firebase/auth';
import { auth } from '@/lib/firebase';
import { Button } from '@/components/ui/button';
import { Sheet, SheetContent, SheetTrigger, SheetClose } from '@/components/ui/sheet';
import { Menu, BookOpenText, LogOut, User as UserIcon, LogIn, UserPlus } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

const baseNavItems = [
  { href: '/', label: 'Home' },
  { href: '/roadmaps', label: 'Roadmaps' },
  { href: '/content', label: 'Content' },
  { href: '/ai-tool', label: 'AI Path Builder' },
  { href: '/about', label: 'About' },
];

export default function Header() {
  const [user, setUser] = useState<FirebaseUser | null>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();
  const { toast } = useToast();

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
      setLoading(false);
    });
    return () => unsubscribe();
  }, []);

  const handleLogout = async () => {
    try {
      await signOut(auth);
      toast({ title: 'Logged out successfully' });
      router.push('/'); // Redirect to home page after logout
    } catch (error) {
      console.error('Logout failed:', error);
      toast({
        title: 'Logout Failed',
        description: error instanceof Error ? error.message : 'An unexpected error occurred.',
        variant: 'destructive',
      });
    }
  };

  const navItems = user 
    ? [...baseNavItems, { href: '/profile', label: 'Profile' }]
    : baseNavItems;

  return (
    <header className="bg-card border-b sticky top-0 z-50 shadow-sm">
      <div className="container mx-auto px-4 h-16 flex items-center justify-between">
        <Link href="/" className="flex items-center gap-2 text-primary hover:text-primary/80 transition-colors">
          <BookOpenText className="h-7 w-7" />
          <span className="text-xl font-bold">LearnJS</span>
        </Link>
        
        {/* Desktop Navigation */}
        <nav className="hidden md:flex items-center space-x-1 lg:space-x-2">
          {navItems.map((item) => (
            <Button key={item.label} variant="ghost" asChild size="sm">
              <Link href={item.href}>{item.label}</Link>
            </Button>
          ))}
          {!loading && (
            user ? (
              <Button variant="outline" size="sm" onClick={handleLogout}>
                <LogOut className="mr-1 h-4 w-4" /> Logout
              </Button>
            ) : (
              <>
                <Button variant="ghost" asChild size="sm">
                  <Link href="/login"><LogIn className="mr-1 h-4 w-4" />Login</Link>
                </Button>
                <Button asChild size="sm">
                  <Link href="/register"><UserPlus className="mr-1 h-4 w-4" />Register</Link>
                </Button>
              </>
            )
          )}
        </nav>

        {/* Mobile Navigation */}
        <div className="md:hidden">
          <Sheet>
            <SheetTrigger asChild>
              <Button variant="outline" size="icon">
                <Menu className="h-6 w-6" />
                <span className="sr-only">Open menu</span>
              </Button>
            </SheetTrigger>
            <SheetContent side="right">
              <nav className="flex flex-col space-y-2 mt-8">
                {navItems.map((item) => (
                   <SheetClose asChild key={item.label}>
                    <Button variant="ghost" asChild className="w-full justify-start text-lg py-3">
                      <Link href={item.href}>{item.label}</Link>
                    </Button>
                  </SheetClose>
                ))}
                <hr className="my-2"/>
                {!loading && (
                  user ? (
                    <SheetClose asChild>
                      <Button variant="outline" onClick={handleLogout} className="w-full justify-start text-lg py-3">
                        <LogOut className="mr-2 h-5 w-5" /> Logout
                      </Button>
                    </SheetClose>
                  ) : (
                    <>
                      <SheetClose asChild>
                        <Button variant="ghost" asChild className="w-full justify-start text-lg py-3">
                          <Link href="/login"><LogIn className="mr-2 h-5 w-5" />Login</Link>
                        </Button>
                      </SheetClose>
                      <SheetClose asChild>
                        <Button variant="default" asChild className="w-full justify-start text-lg py-3">
                          <Link href="/register"><UserPlus className="mr-2 h-5 w-5" />Register</Link>
                        </Button>
                      </SheetClose>
                    </>
                  )
                )}
              </nav>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </header>
  );
}
