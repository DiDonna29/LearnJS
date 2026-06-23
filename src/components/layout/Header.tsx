
'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { User as FirebaseUser, onAuthStateChanged, signOut } from 'firebase/auth';
import { auth } from '@/lib/firebase';
import { Button } from '@/components/ui/button';
import { Sheet, SheetContent, SheetTrigger, SheetClose } from '@/components/ui/sheet';
import { Menu, BookOpenText, LogOut, LogIn, UserPlus, Sparkles } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

const baseNavItems = [
  { href: '/', label: 'Home' },
  { href: '/roadmaps', label: 'Roadmaps' },
  { href: '/content', label: 'Resources' },
  { href: '/ai-tool', label: 'AI Builder' },
  { href: '/about', label: 'About' },
];

export default function Header() {
  const [user, setUser] = useState<FirebaseUser | null>(null);
  const [loading, setLoading] = useState(true);
  const [scrolled, setScrolled] = useState(false);
  const router = useRouter();
  const { toast } = useToast();

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', handleScroll);
    
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
      setLoading(false);
    });
    
    return () => {
      window.removeEventListener('scroll', handleScroll);
      unsubscribe();
    };
  }, []);

  const handleLogout = async () => {
    try {
      await signOut(auth);
      toast({ title: 'Logged out successfully' });
      router.push('/');
    } catch (error) {
      toast({
        title: 'Logout Failed',
        variant: 'destructive',
      });
    }
  };

  const navItems = user 
    ? [...baseNavItems, { href: '/profile', label: 'Profile' }]
    : baseNavItems;

  return (
    <header className={`sticky top-0 z-50 transition-all duration-300 ${scrolled ? 'glass py-2 shadow-lg' : 'bg-transparent py-4'}`}>
      <div className="container mx-auto px-4 flex items-center justify-between">
        <Link href="/" className="flex items-center gap-2 group">
          <div className="w-10 h-10 rounded-xl bg-primary flex items-center justify-center text-primary-foreground group-hover:rotate-6 transition-transform">
            <BookOpenText className="h-6 w-6" />
          </div>
          <div className="flex flex-col">
            <span className="text-xl font-black tracking-tighter uppercase leading-none">LearnJS</span>
            <span className="text-[10px] uppercase tracking-widest text-primary/60 font-bold">Anti-Slop Edition</span>
          </div>
        </Link>
        
        <nav className="hidden md:flex items-center bg-secondary/50 p-1 rounded-full border border-border">
          {navItems.map((item) => (
            <Link 
              key={item.label} 
              href={item.href}
              className="px-4 py-2 text-sm font-bold text-muted-foreground hover:text-primary transition-colors rounded-full hover:bg-background"
            >
              {item.label}
            </Link>
          ))}
        </nav>

        <div className="flex items-center gap-3">
          {!loading && (
            user ? (
              <Button variant="ghost" size="sm" onClick={handleLogout} className="font-bold text-xs uppercase tracking-widest">
                <LogOut className="mr-2 h-4 w-4" /> Logout
              </Button>
            ) : (
              <div className="hidden sm:flex items-center gap-2">
                <Button variant="ghost" asChild size="sm" className="font-bold text-xs uppercase tracking-widest">
                  <Link href="/login">Login</Link>
                </Button>
                <Button asChild size="sm" className="rounded-full font-bold px-5 bg-primary hover:scale-105 transition-transform text-xs uppercase tracking-widest">
                  <Link href="/register">Join Free</Link>
                </Button>
              </div>
            )
          )}

          {/* Mobile Navigation */}
          <div className="md:hidden">
            <Sheet>
              <SheetTrigger asChild>
                <Button variant="outline" size="icon" className="rounded-full">
                  <Menu className="h-5 w-5" />
                </Button>
              </SheetTrigger>
              <SheetContent side="right" className="glass">
                <div className="mt-8 flex flex-col gap-6">
                  <div className="flex items-center gap-2 mb-4">
                    <Sparkles className="h-5 w-5 text-primary" />
                    <span className="font-bold uppercase tracking-widest text-sm">Navigation</span>
                  </div>
                  {navItems.map((item) => (
                    <SheetClose asChild key={item.label}>
                      <Link href={item.href} className="text-3xl font-black tracking-tighter hover:text-primary transition-colors">
                        {item.label}
                      </Link>
                    </SheetClose>
                  ))}
                  <hr className="border-primary/10" />
                  {!loading && !user && (
                    <div className="flex flex-col gap-3">
                      <SheetClose asChild>
                        <Button asChild className="rounded-full h-12 text-lg">
                          <Link href="/register">Create Account</Link>
                        </Button>
                      </SheetClose>
                      <SheetClose asChild>
                        <Button variant="outline" asChild className="rounded-full h-12 text-lg">
                          <Link href="/login">Login</Link>
                        </Button>
                      </SheetClose>
                    </div>
                  )}
                  {user && (
                    <SheetClose asChild>
                      <Button variant="destructive" onClick={handleLogout} className="rounded-full h-12 text-lg">
                        Logout
                      </Button>
                    </SheetClose>
                  )}
                </div>
              </SheetContent>
            </Sheet>
          </div>
        </div>
      </div>
    </header>
  );
}
