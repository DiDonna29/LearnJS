
'use client';

import { useEffect, useState, useTransition } from 'react';
import Link from 'next/link';
import { User as FirebaseUser, onAuthStateChanged, sendPasswordResetEmail, signOut } from 'firebase/auth';
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
import { updateUserProfile, deactivateAccount, fetchUserProfile } from './actions'; // Import Server Actions
import type { UserProfileData, UserProfileUpdateData } from '@/lib/types';
import { useRouter } from 'next/navigation';

const mockUserDisplayDefaults = { // Kept for fallback UI elements if needed
  name: 'User Name',
  userType: 'Simple User',
  avatarUrl: 'https://placehold.co/100x100.png',
  dataAiHint: 'person portrait',
  address: '' // Default empty address
};

export default function ProfilePage() {
  const { toast } = useToast();
  const router = useRouter();
  const [authUser, setAuthUser] = useState<FirebaseUser | null>(null);
  const [profileData, setProfileData] = useState<UserProfileData | null>(null);
  
  const [loadingAuth, setLoadingAuth] = useState(true);
  const [isFetchingProfile, setIsFetchingProfile] = useState(false);
  const [isUpdatingProfile, startUpdateTransition] = useTransition();
  const [isDeactivating, startDeactivationTransition] = useTransition();

  // Form state
  const [displayName, setDisplayName] = useState('');
  const [address, setAddress] = useState('');
  const [email, setEmail] = useState('');
  const [photoURL, setPhotoURL] = useState('');

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      setAuthUser(user);
      if (user) {
        setEmail(user.email || ''); // Set email from Auth user
        setIsFetchingProfile(true);
        try {
          // In a real app, pass ID token: const idToken = await user.getIdToken();
          const fetchedProfile = await fetchUserProfile(user.uid); // Pass UID
          setProfileData(fetchedProfile);
          // Initialize form fields after profile data is fetched
          setDisplayName(fetchedProfile?.displayName || user.displayName || mockUserDisplayDefaults.name);
          setAddress(fetchedProfile?.address || mockUserDisplayDefaults.address);
          setPhotoURL(fetchedProfile?.photoURL || user.photoURL || mockUserDisplayDefaults.avatarUrl);
        } catch (e) {
          console.error("Error fetching profile data:", e);
          toast({ title: "Error", description: "Could not load profile data.", variant: "destructive" });
          // Fallback form field initialization
          setDisplayName(user.displayName || mockUserDisplayDefaults.name);
          setAddress(mockUserDisplayDefaults.address);
          setPhotoURL(user.photoURL || mockUserDisplayDefaults.avatarUrl);
        } finally {
          setIsFetchingProfile(false);
        }
      } else {
        // No user, clear all data
        setProfileData(null);
        setDisplayName('');
        setAddress('');
        setEmail('');
        setPhotoURL('');
        setIsFetchingProfile(false);
      }
      setLoadingAuth(false);
    });
    return () => unsubscribe();
  }, [toast]);


  const handleSaveChanges = async () => {
    if (!authUser) {
      toast({ title: "Error", description: "You must be logged in to save changes.", variant: "destructive" });
      return;
    }
    startUpdateTransition(async () => {
      // const idToken = await authUser.getIdToken(); // For server action verification
      const updateData: UserProfileUpdateData = {
        displayName: displayName,
        address: address,
        // photoURL: photoURL, // Add if photo upload is implemented
      };
      // Pass authUser.uid for now, server action should verify token in real app.
      const result = await updateUserProfile(authUser.uid, updateData);

      if (result.success) {
        toast({ title: "Profile Updated", description: result.message });
        // Optionally, trigger a re-fetch or update local state if revalidatePath isn't immediate enough
        const refreshedProfile = await fetchUserProfile(authUser.uid);
        setProfileData(refreshedProfile);
        if (refreshedProfile) {
             setDisplayName(refreshedProfile.displayName || authUser.displayName || '');
             setAddress(refreshedProfile.address || '');
             setPhotoURL(refreshedProfile.photoURL || authUser.photoURL || mockUserDisplayDefaults.avatarUrl);
        }

      } else {
        toast({ title: "Update Failed", description: result.message, variant: "destructive" });
      }
    });
  };
  
  const handlePasswordChange = async () => {
    if (!authUser || !authUser.email) {
      toast({ title: "Error", description: "Email address not found for password reset.", variant: "destructive" });
      return;
    }
    try {
      await sendPasswordResetEmail(auth, authUser.email);
      toast({
        title: "Password Reset Email Sent",
        description: "Check your inbox for instructions to reset your password.",
      });
    } catch (error) {
      console.error("Password reset error:", error);
      toast({
        title: "Password Reset Failed",
        description: (error as Error).message,
        variant: "destructive",
      });
    }
  };

  const handleAccountDeactivation = async () => {
    if (!authUser) return;
    startDeactivationTransition(async () => {
      // const idToken = await authUser.getIdToken();
      // Pass authUser.uid for now
      const result = await deactivateAccount(authUser.uid);
      if (result.success) {
        toast({ title: "Account Deactivated", description: result.message });
        await signOut(auth); // Sign out client-side
        router.push('/'); // Redirect to home
      } else {
        toast({ title: "Deactivation Failed", description: result.message, variant: "destructive" });
      }
    });
  };

  const handleMembershipCancel = () => {
     toast({
      title: "Membership Action (Mock)",
      description: "Membership cancellation/downgrade process initiated (simulated). This would involve backend logic for subscriptions.",
    });
  };


  if (loadingAuth || (authUser && isFetchingProfile)) {
    return (
      <div className="flex justify-center items-center min-h-[calc(100vh-200px)]">
        <Loader2 className="h-12 w-12 animate-spin text-primary" />
        <p className="ml-4 text-lg">Loading profile...</p>
      </div>
    );
  }

  if (!authUser) {
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

  const displayAvatarFinal = photoURL || mockUserDisplayDefaults.avatarUrl;
  const currentDisplayNameFinal = displayName || mockUserDisplayDefaults.name;

  return (
    <div className="space-y-8">
      <Card className="shadow-md">
        <CardHeader className="flex flex-row items-center gap-4">
          <Avatar className="h-20 w-20">
            <AvatarImage src={displayAvatarFinal} alt={currentDisplayNameFinal} data-ai-hint={mockUserDisplayDefaults.dataAiHint}/>
            <AvatarFallback>{currentDisplayNameFinal.split(' ').map(n => n[0]).join('').toUpperCase() || 'U'}</AvatarFallback>
          </Avatar>
          <div>
            <CardTitle className="text-3xl flex items-center gap-3">
              <User className="h-8 w-8 text-primary" /> {displayName}'s Profile
            </CardTitle>
            <CardDescription className="text-lg">
              Manage your account settings and preferences. Current Status: <span className="font-semibold text-primary">{profileData?.role || mockUserDisplayDefaults.userType}</span>
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
              <Input id="name" value={displayName} onChange={(e) => setDisplayName(e.target.value)} disabled={isUpdatingProfile}/>
            </div>
            <div>
              <Label htmlFor="email">Email Address</Label>
              <Input id="email" type="email" value={email} readOnly disabled />
               <p className="text-xs text-muted-foreground mt-1">Email cannot be changed here. Firebase Auth manages email changes, typically involving verification.</p>
            </div>
            <div>
              <Label htmlFor="address">Address</Label>
              <Input id="address" value={address} onChange={(e) => setAddress(e.target.value)} disabled={isUpdatingProfile} placeholder="e.g., 123 Main St, Anytown, USA" />
            </div>
            {/* Photo URL input could be added if direct URL editing or upload is supported
            <div>
              <Label htmlFor="photoURLInput">Photo URL (optional)</Label>
              <Input id="photoURLInput" value={photoURL} onChange={(e) => setPhotoURL(e.target.value)} disabled={isUpdatingProfile} placeholder="https://example.com/avatar.png" />
            </div>
            */}
          </CardContent>
          <CardFooter className="justify-end">
            <Button onClick={handleSaveChanges} disabled={isUpdatingProfile}>
              {isUpdatingProfile ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Save className="mr-2 h-4 w-4" />}
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
              <Button variant="outline" className="w-full" onClick={handlePasswordChange} disabled={isUpdatingProfile || isDeactivating}>
                <KeyRound className="mr-2 h-4 w-4"/> Change Password
              </Button>
            </CardContent>
          </Card>

          <Card className="shadow-lg">
            <CardHeader>
              <CardTitle className="flex items-center gap-2"><LogOut className="text-destructive"/> Membership & Account</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              {(profileData?.role === 'PRO_USER') && ( // Check actual role from Firestore
                <AlertDialog>
                  <AlertDialogTrigger asChild>
                    <Button variant="outline" className="w-full" disabled={isUpdatingProfile || isDeactivating}>Cancel PRO Membership</Button>
                  </AlertDialogTrigger>
                  <AlertDialogContent>
                    <AlertDialogHeader>
                      <AlertDialogTitle>Are you sure you want to cancel your PRO membership?</AlertDialogTitle>
                      <AlertDialogDescription>
                        You will lose access to PRO features at the end of your current billing cycle. Your account will revert to a Simple User. (This is a mock action for now).
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
                     <Button variant="destructive" className="w-full" disabled={isUpdatingProfile || isDeactivating}>
                        <Trash2 className="mr-2 h-4 w-4"/> Deactivate Account
                      </Button>
                  </AlertDialogTrigger>
                  <AlertDialogContent>
                    <AlertDialogHeader>
                      <AlertDialogTitle>Are you sure you want to deactivate your account?</AlertDialogTitle>
                      <AlertDialogDescription>
                        This action will disable your account and you will lose access to LearnJS. You may need to contact support to reactivate it.
                      </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                      <AlertDialogCancel>Cancel</AlertDialogCancel>
                      <AlertDialogAction onClick={handleAccountDeactivation} className="bg-destructive hover:bg-destructive/90" disabled={isDeactivating}>
                        {isDeactivating ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : 'Deactivate Account'}
                      </AlertDialogAction>
                    </AlertDialogFooter>
                  </AlertDialogContent>
                </AlertDialog>
            </CardContent>
            <CardFooter>
                <p className="text-xs text-muted-foreground">
                    {(profileData?.role === 'SIMPLE_USER' || !profileData?.role) ? "Upgrade to PRO for full access and more features! (Mock)" : "Manage your subscription and account status here."}
                </p>
            </CardFooter>
          </Card>
        </div>
      </div>
       <p className="text-center text-muted-foreground mt-8">
        Profile data is now fetched from and saved to Firestore. Ensure Firestore is set up and security rules are configured.
      </p>
    </div>
  );
}
