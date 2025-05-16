
'use server';

/**
 * @fileOverview Server Actions for user profile management.
 */

import { authAdmin, dbAdmin, getUserIdFromToken } from '@/lib/firebase-admin-init';
import { revalidatePath } from 'next/cache';
import type { UserProfileData, UserProfileUpdateData } from '@/lib/types';
import { USER_ROLES } from '@/lib/constants';
import { FieldValue } from 'firebase-admin/firestore';


export async function fetchUserProfile(
  userId: string 
): Promise<UserProfileData | null> {
  if (!dbAdmin) {
    console.error("Firestore Admin DB not initialized. Cannot fetch user profile.");
    return null; 
  }
  if (!userId) {
     console.error("No user ID provided for fetching profile.");
    return null;
  }

  try {
    const userRef = dbAdmin.collection('users').doc(userId);
    const docSnap = await userRef.get();

    if (docSnap.exists) {
      const data = docSnap.data();
      let authUserRecord;
      if (authAdmin) {
        try {
          authUserRecord = await authAdmin.getUser(userId);
        } catch (authError) {
          console.warn(`Could not fetch Firebase Auth record for user ${userId}:`, authError);
        }
      }
      
      return {
        id: docSnap.id,
        displayName: data?.displayName || authUserRecord?.displayName || '',
        email: data?.email || authUserRecord?.email || '',
        photoURL: data?.photoURL || authUserRecord?.photoURL || null,
        address: data?.address || '',
        role: data?.role || USER_ROLES.SIMPLE,
        createdAt: data?.createdAt?.toDate ? data.createdAt.toDate() : (authUserRecord?.metadata?.creationTime ? new Date(authUserRecord.metadata.creationTime) : new Date()),
        updatedAt: data?.updatedAt?.toDate ? data.updatedAt.toDate() : (authUserRecord?.metadata?.lastSignInTime ? new Date(authUserRecord.metadata.lastSignInTime) : undefined),
      };
    } else {
      console.log(`User profile document not found for UID: ${userId}. Attempting to create a basic one if Auth user exists.`);
      if (authAdmin) {
        try {
          const authUserRecord = await authAdmin.getUser(userId);
          // Create a basic profile in Firestore if it doesn't exist but Auth user does
          const basicProfile: UserProfileData = { 
            id: authUserRecord.uid,
            displayName: authUserRecord.displayName || authUserRecord.email?.split('@')[0] || 'New User',
            email: authUserRecord.email || '',
            photoURL: authUserRecord.photoURL || null,
            address: '',
            role: USER_ROLES.SIMPLE,
            createdAt: authUserRecord.metadata?.creationTime ? new Date(authUserRecord.metadata.creationTime) : new Date(),
            updatedAt: authUserRecord.metadata?.lastSignInTime ? new Date(authUserRecord.metadata.lastSignInTime) : new Date()
          };
          // Use .set with merge:true to avoid overwriting if a race condition occurred.
          // Or use .create if you are certain it doesn't exist.
          await dbAdmin.collection('users').doc(authUserRecord.uid).set({
            ...basicProfile,
            createdAt: FieldValue.serverTimestamp(), // Firestore server timestamp for creation
            updatedAt: FieldValue.serverTimestamp(), // Firestore server timestamp for update
          }, { merge: true });
          console.log(`Basic profile created in Firestore for user ${authUserRecord.uid}`);
          return {
            ...basicProfile,
            createdAt: new Date(), // Approximate client-side date, Firestore version is source of truth
            updatedAt: new Date(),
          };
        } catch (e) { 
           console.error(`User ${userId} not found in Auth either after missing in Firestore, or failed to create basic profile.`, e);
           return null;
        }
      }
      return null;
    }
  } catch (error) {
    console.error('Error fetching user profile:', error);
    return null;
  }
}


export async function updateUserProfile(
  userId: string, 
  data: UserProfileUpdateData
): Promise<{ success: boolean; message: string }> {
  
  if (!dbAdmin || !authAdmin) {
    const serviceMissing = !dbAdmin ? "Firestore Admin" : "Auth Admin";
    console.error(`${serviceMissing} not initialized. Cannot update profile.`);
    return { success: false, message: `Server error: ${serviceMissing} service not available.` };
  }
  
  if (!userId) {
    return { success: false, message: "User ID not provided." };
  }

  try {
    const userDocRef = dbAdmin.collection('users').doc(userId);
    
    const firestoreUpdateData: Record<string, any> = {
      updatedAt: FieldValue.serverTimestamp(),
    };
    
    const authUpdatePayload: { displayName?: string; photoURL?: string } = {};

    if (data.displayName !== undefined) {
      firestoreUpdateData.displayName = data.displayName.trim();
      if (data.displayName.trim() !== '') {
         authUpdatePayload.displayName = data.displayName.trim();
      }
    }
    if (data.address !== undefined) {
      firestoreUpdateData.address = data.address;
    }
    if (data.photoURL !== undefined) { 
      firestoreUpdateData.photoURL = data.photoURL; // Can be null to remove
      authUpdatePayload.photoURL = data.photoURL;
    }

    // Only update Firestore if there's something other than 'updatedAt'
    if (Object.keys(firestoreUpdateData).length > 1) {
        await userDocRef.update(firestoreUpdateData);
    }
    
    // Only update Firebase Auth if there's something to update
    if (Object.keys(authUpdatePayload).length > 0) {
      await authAdmin.updateUser(userId, authUpdatePayload);
    }

    revalidatePath('/profile');
    revalidatePath('/'); // Also revalidate home if display name changed for WelcomeUser
    return { success: true, message: 'Profile updated successfully!' };
  } catch (error) {
    console.error('Error updating profile:', error);
    const errorMessage = error instanceof Error ? error.message : 'Failed to update profile.';
    return { success: false, message: errorMessage };
  }
}

export async function updateUserPasswordInternal(
  userId: string,
  newPassword?: string | null 
): Promise<{ success: boolean; message: string }> {
  if (!authAdmin) {
    console.error("Auth Admin not initialized. Cannot update password.");
    return { success: false, message: "Server error: Auth service not available." };
  }
  
  if (!userId) {
    return { success: false, message: "User ID not provided." };
  }

  if (!newPassword || newPassword.length < 6) {
     return { success: false, message: "New password must be at least 6 characters long." };
  }

  try {
    await authAdmin.updateUser(userId, {
      password: newPassword,
    });
    return { success: true, message: 'Password updated successfully.' };
  } catch (error) {
    console.error('Error updating password:', error);
    const errorMessage = error instanceof Error ? error.message : 'Failed to update password.';
    return { success: false, message: errorMessage };
  }
}


export async function deactivateAccount(
  userId: string 
): Promise<{ success: boolean; message: string }> {
  if (!authAdmin) {
    console.error("Auth Admin not initialized. Cannot deactivate account.");
    return { success: false, message: "Server error: Auth service not available." };
  }

  if (!userId) {
    return { success: false, message: "User ID not provided." };
  }

  try {
    // Disable in Firebase Auth
    await authAdmin.updateUser(userId, {
      disabled: true,
    });

    // Update status in Firestore
    if (dbAdmin) {
        await dbAdmin.collection('users').doc(userId).update({ 
            status: 'deactivated', // Consider adding a 'status' field to UserProfileData
            disabledAt: FieldValue.serverTimestamp(),
            updatedAt: FieldValue.serverTimestamp(),
        });
    } else {
        console.warn("dbAdmin not available. Skipping Firestore update for deactivation status.");
    }

    revalidatePath('/profile'); 
    revalidatePath('/'); 
    return { success: true, message: 'Account deactivated successfully. You will be logged out.' };
  } catch (error) {
    console.error('Error deactivating account:', error);
    const errorMessage = error instanceof Error ? error.message : 'An unknown error occurred.';
    return { success: false, message: `Failed to deactivate account: ${errorMessage}` };
  }
}
