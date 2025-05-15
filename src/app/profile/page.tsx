'use client'; // Required for form handling if we make fields interactive

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Separator } from '@/components/ui/separator';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { User, Edit3, Shield, LogOut, Trash2, KeyRound } from 'lucide-react';
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


// Mock user data - in a real app, this would come from auth/DB
const mockUser = {
  name: 'Alex Johnson',
  email: 'alex.johnson@example.com',
  userType: 'Simple User', // Could be 'Visitor', 'Simple User', 'PRO User', 'Admin'
  avatarUrl: 'https://placehold.co/100x100.png',
  dataAiHint: 'person portrait',
  address: '123 Learning Lane, Dev City, JS 12345' // Example, as per request
};


export default function ProfilePage() {
  const { toast } = useToast();

  const handleSaveChanges = () => {
    // Placeholder for save logic
    toast({
      title: "Changes Saved (Mock)",
      description: "Your profile information has been updated (simulated).",
    });
  };
  
  const handlePasswordChange = () => {
    toast({
      title: "Password Change (Mock)",
      description: "Password change process initiated (simulated).",
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


  return (
    <div className="space-y-8">
      <Card className="shadow-md">
        <CardHeader className="flex flex-row items-center gap-4">
          <Avatar className="h-20 w-20">
            <AvatarImage src={mockUser.avatarUrl} alt={mockUser.name} data-ai-hint={mockUser.dataAiHint}/>
            <AvatarFallback>{mockUser.name.split(' ').map(n => n[0]).join('')}</AvatarFallback>
          </Avatar>
          <div>
            <CardTitle className="text-3xl flex items-center gap-3">
              <User className="h-8 w-8 text-primary" /> {mockUser.name}'s Profile
            </CardTitle>
            <CardDescription className="text-lg">
              Manage your account settings and preferences. Current Status: <span className="font-semibold text-primary">{mockUser.userType}</span>
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
              <Input id="name" defaultValue={mockUser.name} />
            </div>
            <div>
              <Label htmlFor="email">Email Address</Label>
              <Input id="email" type="email" defaultValue={mockUser.email} />
            </div>
            <div>
              <Label htmlFor="address">Address</Label>
              <Input id="address" defaultValue={mockUser.address} />
            </div>
          </CardContent>
          <CardFooter className="justify-end">
            <Button onClick={handleSaveChanges}>Save Changes</Button>
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
              {mockUser.userType.includes('PRO') && (
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
                    {mockUser.userType === 'Simple User' ? "Upgrade to PRO for full access and more features!" : "Manage your subscription and account status here."}
                </p>
            </CardFooter>
          </Card>
        </div>
      </div>
       <p className="text-center text-muted-foreground mt-8">
        This is a simplified profile page. Full functionality for user types, payments, and data persistence requires backend integration.
      </p>
    </div>
  );
}
