
'use client';

import { useState, useTransition, useEffect } from 'react';
import { User as FirebaseUser, sendPasswordResetEmail, signOut } from 'firebase/auth';
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
import { updateUserProfile, deactivateAccount } from '@/app/profile/actions';
import type { UserProfileData, UserProfileUpdateData } from '@/lib/types';
import { useRouter } from 'next/navigation';

interface ProfileClientPageProps {
  authUser: FirebaseUser | null; // Firebase Auth user object
  profileData: UserProfileData | null; // Data from Firestore
}

const mockUserDisplayDefaults = {
  name: 'User Name',
  userType: 'Simple User', // This might come from profileData.role eventually
  avatarUrl: 'https://placehold.co/100x100.png',
  dataAiHint: 'person portrait',
  address: '123 Learning Lane, Dev City, JS 12345'
};

export default function ProfileClientPage({ authUser, profileData }: ProfileClientPageProps) {
  const { toast } = useToast();
  const router = useRouter();
  const [isPending, startTransition] = useTransition();

  // Form state, initialized from profileData or authUser or mocks
  const [displayName, setDisplayName] = useState(profileData?.displayName || authUser?.displayName || mockUserDisplayDefaults.name);
  const [address, setAddress] = useState(profileData?.address || mockUserDisplayDefaults.address);
  const [email, setEmail] = useState(authUser?.email || profileData?.email || '');
  const [photoURL, setPhotoURL] = useState(authUser?.photoURL || profileData?.photoURL || mockUserDisplayDefaults.avatarUrl);

  // Update state if props change (e.g., after revalidation)
  useEffect(() => {
    setDisplayName(profileData?.displayName || authUser?.displayName || mockUserDisplayDefaults.name);
    setAddress(profileData?.address || mockUserDisplayDefaults.address);
    setEmail(authUser?.email || profileData?.email || '');
    setPhotoURL(authUser?.photoURL || profileData?.photoURL || mockUserDisplayDefaults.avatarUrl);
  }, [profileData, authUser]);


  const handleSaveChanges = async () => {
    if (!authUser) {
      toast({ title: "Error", description: "You must be logged in to save changes.", variant: "destructive" });
      return;
    }
    startTransition(async () => {
      // const idToken = await authUser.getIdToken(); // Get ID token for server action
      const updateData: UserProfileUpdateData = {
        displayName: displayName,
        address: address,
        // photoURL: photoURL, // Add if you have photo upload logic
      };

      const result = await updateUserProfile(authUser.uid, updateData); // Pass authUser.uid for now

      if (result.success) {
        toast({
          title: "Profile Updated",
          description: result.message,
        });
        // Firebase Auth profile might need client-side update if not handled by server action fully
        // or if you want immediate reflection without waiting for revalidation
        // For example: if (auth.currentUser && auth.currentUser.displayName !== displayName) {
        //   await updateAuthProfileClient(auth.currentUser, { displayName });
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
  
  const handlePasswordChange = async () => {
    if (!email) {
      toast({ title: "Error", description: "Email address not found.", variant: "destructive" });
      return;
    }
    try {
      await sendPasswordResetEmail(auth, email);
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
    startTransition(async () => {
      // const idToken = await authUser.getIdToken();
      const result = await deactivateAccount(authUser.uid); // Pass authUser.uid for now
      if (result.success) {
        toast({
          title: "Account Deactivated",
          description: result.message,
        });
        // Log out the user client-side
        await signOut(auth);
        router.push('/'); // Redirect to home
      } else {
        toast({
          title: "Deactivation Failed",
          description: result.message,
          variant: "destructive",
        });
      }
    });
  };
  
  const handleMembershipCancel = () => {
     toast({
      title: "Membership Action (Mock)",
      description: "Membership cancellation/downgrade process initiated (simulated). This would involve backend logic for subscriptions.",
    });
  };

  const displayAvatarUrl = photoURL || mockUserDisplayDefaults.avatarUrl;
  const currentDisplayNameForFallback = displayName || mockUserDisplayDefaults.name;

  return (
    <div className="space-y-8">
      <Card className="shadow-md">
        <CardHeader className="flex flex-row items-center gap-4">
          <Avatar className="h-20 w-20">
            <AvatarImage src={displayAvatarUrl} alt={currentDisplayNameForFallback} data-ai-hint={mockUserDisplayDefaults.dataAiHint}/>
            <AvatarFallback>{currentDisplayNameForFallback.split(' ').map(n => n[0]).join('').toUpperCase() || 'U'}</AvatarFallback>
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
              <Input id="name" value={displayName} onChange={(e) => setDisplayName(e.target.value)} disabled={isPending}/>
            </div>
            <div>
              <Label htmlFor="email">Email Address</Label>
              <Input id="email" type="email" value={email} readOnly disabled />
              <p className="text-xs text-muted-foreground mt-1">Email cannot be changed here. Firebase Auth manages email changes, typically involving verification.</p>
            </div>
            <div>
              <Label htmlFor="address">Address</Label>
              <Input id="address" value={address} onChange={(e) => setAddress(e.target.value)} disabled={isPending} placeholder="e.g., 123 Main St, Anytown, USA"/>
            </div>
            {/* Add photoURL input if you implement photo upload */}
            {/* <div>
              <Label htmlFor="photoURL">Photo URL</Label>
              <Input id="photoURL" value={photoURL} onChange={(e) => setPhotoURL(e.target.value)} disabled={isPending} placeholder="https://example.com/avatar.png"/>
            </div> */}
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
              <Button variant="outline" className="w-full" onClick={handlePasswordChange} disabled={isPending}>
                <KeyRound className="mr-2 h-4 w-4"/> Change Password
              </Button>
            </CardContent>
          </Card>

          <Card className="shadow-lg">
            <CardHeader>
              <CardTitle className="flex items-center gap-2"><LogOut className="text-destructive"/> Membership & Account</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              {(profileData?.role === 'PRO_USER' || mockUserDisplayDefaults.userType.includes('PRO')) && ( // Adjust condition based on actual role
                <AlertDialog>
                  <AlertDialogTrigger asChild>
                    <Button variant="outline" className="w-full" disabled={isPending}>Cancel PRO Membership</Button>
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
                     <Button variant="destructive" className="w-full" disabled={isPending}>
                        <Trash2 className="mr-2 h-4 w-4"/> Deactivate Account
                      </Button>
                  </AlertDialogTrigger>
                  <AlertDialogContent>
                    <AlertDialogHeader>
                      <AlertDialogTitle>Are you sure you want to deactivate your account?</AlertDialogTitle>
                      <AlertDialogDescription>
                        This action will disable your account and you will lose access to LearnJS. You will need to contact support to reactivate it.
                      </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                      <AlertDialogCancel>Cancel</AlertDialogCancel>
                      <AlertDialogAction onClick={handleAccountDeactivation} className="bg-destructive hover:bg-destructive/90" disabled={isPending}>
                        {isPending ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : 'Deactivate Account'}
                      </AlertDialogAction>
                    </AlertDialogFooter>
                  </AlertDialogContent>
                </AlertDialog>
            </CardContent>
            <CardFooter>
                <p className="text-xs text-muted-foreground">
                    {(profileData?.role === 'SIMPLE_USER' || mockUserDisplayDefaults.userType === 'Simple User') ? "Upgrade to PRO for full access and more features! (Mock)" : "Manage your subscription and account status here."}
                </p>
            </CardFooter>
          </Card>
        </div>
      </div>
    </div>
  );
}
