
'use client';

import { useEffect, useState, useTransition } from 'react';
import Link from 'next/link';
import { User as FirebaseUser, onAuthStateChanged } from 'firebase/auth';
import { auth } from '@/lib/firebase';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { User, Edit3, Shield, LogOut, Trash2, KeyRound, Loader2, Save } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { updateUserProfile } from './actions'; // Import the Server Action

// Mock user data - will be partially overridden by auth data if available
const mockUserDisplayDefaults = {
  name: 'User Name', // Default if not set by auth
  userType: 'Simple User',
  avatarUrl: 'https://placehold.co/100x100.png',
  dataAiHint: 'person portrait',
  address: '123 Learning Lane, Dev City, JS 12345'
};

export default function ProfilePage() {
  const { toast } = useToast();
  const [user, setUser] = useState<FirebaseUser | null>(null);
  const [loading, setLoading] = useState(true);
  const [isPending, startTransition] = useTransition();

  // Form state
  const [displayName, setDisplayName] = useState(mockUserDisplayDefaults.name);
  const [address, setAddress] = useState(mockUserDisplayDefaults.address);
  const [email, setEmail] = useState('');


  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
      if (currentUser) {
        setDisplayName(currentUser.displayName || mockUserDisplayDefaults.name);
        setEmail(currentUser.email || '');
        // In a real app, you'd fetch address and other details from your Firestore 'users' collection
        // For now, we use mock or allow edits.
      }
      setLoading(false);
    });
    return () => unsubscribe();
  }, []);

  const handleSaveChanges = async () => {
    if (!user) {
      toast({ title: "Error", description: "You must be logged in to save changes.", variant: "destructive" });
      return;
    }
    startTransition(async () => {
      // In a real application, you would get the ID token to pass to the server action
      // const idToken = await user.getIdToken();
      // For simulation, we pass user.uid directly. 
      // The Server Action itself would need to verify this token/UID.
      const result = await updateUserProfile(user.uid, {
        displayName: displayName,
        address: address,
      });

      if (result.success) {
        toast({
          title: "Profile Updated",
          description: result.message,
        });
        // Optionally, update Firebase Auth profile if display name changed client-side too,
        // though server action should ideally handle this for consistency.
        // if (auth.currentUser && auth.currentUser.displayName !== displayName) {
        //   await updateProfile(auth.currentUser, { displayName });
        // }
      } else {
        toast({
          title: "Update Failed",
          description: result.message,
          variant: "destructive",
        });
      }
    });
  };
  
  const handlePasswordChange = () => {
    toast({
      title: "Password Change (Mock)",
      description: "Password change process initiated (simulated). This would typically involve re-authentication and Firebase SDK calls.",
    });
  }

  const handleMembershipCancel = () => {
     toast({
      title: "Membership Action (Mock)",
      description: "Membership cancellation/downgrade process initiated (simulated).",
    });
  }

  const handleAccountDeactivation = () => {
     toast({
      title: "Account Deactivation (Mock)",
      description: "Account deactivation process initiated (simulated).",
    });
  }

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-[calc(100vh-200px)]">
        <Loader2 className="h-12 w-12 animate-spin text-primary" />
        <p className="ml-4 text-lg">Loading profile...</p>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[calc(100vh-200px)] text-center">
        <User className="h-16 w-16 text-primary mb-4" />
        <h1 className="text-2xl font-semibold mb-2">Access Denied</h1>
        <p className="text-muted-foreground mb-6">Please log in or register to view your profile.</p>
        <div className="space-x-4">
          <Button asChild>
            <Link href="/login">Login</Link>
          </Button>
          <Button variant="outline" asChild>
            <Link href="/register">Register</Link>
          </Button>
        </div>
      </div>
    );
  }

  const displayAvatarUrl = user.photoURL || mockUserDisplayDefaults.avatarUrl;
  const currentDisplayName = user.displayName || mockUserDisplayDefaults.name; // For avatar fallback

  return (
    <div className="space-y-8">
      <Card className="shadow-md">
        <CardHeader className="flex flex-row items-center gap-4">
          <Avatar className="h-20 w-20">
            <AvatarImage src={displayAvatarUrl} alt={currentDisplayName} data-ai-hint={mockUserDisplayDefaults.dataAiHint}/>
            <AvatarFallback>{currentDisplayName.split(' ').map(n => n[0]).join('').toUpperCase() || 'U'}</AvatarFallback>
          </Avatar>
          <div>
            <CardTitle className="text-3xl flex items-center gap-3">
              <User className="h-8 w-8 text-primary" /> {displayName}'s Profile
            </CardTitle>
            <CardDescription className="text-lg">
              Manage your account settings and preferences. Current Status: <span className="font-semibold text-primary">{mockUserDisplayDefaults.userType}</span>
            </CardDescription>
          </div>
        </CardHeader>
      </Card>

      <div className="grid md:grid-cols-3 gap-6">
        <Card className="md:col-span-2 shadow-lg">
          <CardHeader>
            <CardTitle className="flex items-center gap-2"><Edit3 className="text-primary" /> Personal Information</CardTitle>
            <CardDescription>Update your personal details. Click "Save Changes" to apply.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Label htmlFor="name">Full Name</Label>
              <Input id="name" value={displayName} onChange={(e) => setDisplayName(e.target.value)} disabled={isPending}/>
            </div>
            <div>
              <Label htmlFor="email">Email Address</Label>
              <Input id="email" type="email" value={email} readOnly disabled />
            </div>
            <div>
              <Label htmlFor="address">Address</Label>
              <Input id="address" value={address} onChange={(e) => setAddress(e.target.value)} disabled={isPending} />
            </div>
          </CardContent>
          <CardFooter className="justify-end">
            <Button onClick={handleSaveChanges} disabled={isPending}>
              {isPending ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Save className="mr-2 h-4 w-4" />}
              Save Changes
            </Button>
          </CardFooter>
        </Card>

        <div className="space-y-6">
          <Card className="shadow-lg">
            <CardHeader>
              <CardTitle className="flex items-center gap-2"><Shield className="text-primary"/> Account Security</CardTitle>
            </CardHeader>
            <CardContent>
              <Button variant="outline" className="w-full" onClick={handlePasswordChange}>
                <KeyRound className="mr-2 h-4 w-4"/> Change Password
              </Button>
            </CardContent>
          </Card>

          <Card className="shadow-lg">
            <CardHeader>
              <CardTitle className="flex items-center gap-2"><LogOut className="text-destructive"/> Membership & Account</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              {mockUserDisplayDefaults.userType.includes('PRO') && (
                <AlertDialog>
                  <AlertDialogTrigger asChild>
                    <Button variant="outline" className="w-full">Cancel PRO Membership</Button>
                  </AlertDialogTrigger>
                  <AlertDialogContent>
                    <AlertDialogHeader>
                      <AlertDialogTitle>Are you sure you want to cancel your PRO membership?</AlertDialogTitle>
                      <AlertDialogDescription>
                        You will lose access to PRO features at the end of your current billing cycle. Your account will revert to a Simple User.
                      </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                      <AlertDialogCancel>Keep PRO</AlertDialogCancel>
                      <AlertDialogAction onClick={handleMembershipCancel} className="bg-destructive hover:bg-destructive/90">Confirm Cancellation</AlertDialogAction>
                    </AlertDialogFooter>
                  </AlertDialogContent>
                </AlertDialog>
              )}
               <AlertDialog>
                  <AlertDialogTrigger asChild>
                     <Button variant="destructive" className="w-full">
                        <Trash2 className="mr-2 h-4 w-4"/> Deactivate Account
                      </Button>
                  </AlertDialogTrigger>
                  <AlertDialogContent>
                    <AlertDialogHeader>
                      <AlertDialogTitle>Are you sure you want to deactivate your account?</AlertDialogTitle>
                      <AlertDialogDescription>
                        This action will temporarily disable your account and you will lose access to LearnJS. You can reactivate your account by logging in again.
                      </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                      <AlertDialogCancel>Cancel</AlertDialogCancel>
                      <AlertDialogAction onClick={handleAccountDeactivation} className="bg-destructive hover:bg-destructive/90">Deactivate Account</AlertDialogAction>
                    </AlertDialogFooter>
                  </AlertDialogContent>
                </AlertDialog>
            </CardContent>
            <CardFooter>
                <p className="text-xs text-muted-foreground">
                    {mockUserDisplayDefaults.userType === 'Simple User' ? "Upgrade to PRO for full access and more features!" : "Manage your subscription and account status here."}
                </p>
            </CardFooter>
          </Card>
        </div>
      </div>
       <p className="text-center text-muted-foreground mt-8">
        This profile page uses simulated data updates. Full functionality for user types, payments, and persistent data requires backend integration with Firestore or another database.
      </p>
    </div>
  );
}
