
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
    // Consider throwing an error or returning a specific error object
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
        displayName: authUserRecord?.displayName || data?.displayName || '',
        email: authUserRecord?.email || data?.email || '',
        photoURL: authUserRecord?.photoURL || data?.photoURL || null,
        address: data?.address || '',
        role: data?.role || USER_ROLES.SIMPLE,
        createdAt: data?.createdAt?.toDate ? data.createdAt.toDate() : new Date(),
      };
    } else {
      console.log(`User profile document not found for UID: ${userId}`);
      if (authAdmin) {
        try {
          const authUserRecord = await authAdmin.getUser(userId);
          // Create a basic profile in Firestore if it doesn't exist but Auth user does
          const basicProfile: UserProfileData = { // Ensure type compliance
            id: authUserRecord.uid,
            displayName: authUserRecord.displayName || authUserRecord.email?.split('@')[0] || 'New User',
            email: authUserRecord.email || '',
            photoURL: authUserRecord.photoURL || null,
            address: '',
            role: USER_ROLES.SIMPLE,
            createdAt: new Date(authUserRecord.metadata.creationTime || Date.now()),
            updatedAt: new Date(authUserRecord.metadata.lastSignInTime || Date.now())
          };
          await dbAdmin.collection('users').doc(authUserRecord.uid).set(basicProfile, {merge: true});
          return basicProfile;
        } catch (e) { 
           console.error(`User ${userId} not found in Auth either after missing in Firestore.`, e);
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
  
  const targetUserId = userId; // Assuming userId is already verified or handled appropriately client-side

  try {
    const userDocRef = dbAdmin.collection('users').doc(targetUserId);
    
    const firestoreUpdateData: Record<string, any> = {
      updatedAt: FieldValue.serverTimestamp(),
    };
    if (data.address !== undefined) {
      firestoreUpdateData.address = data.address;
    }
    // Only update displayName in Firestore if it's provided
    if (data.displayName !== undefined && data.displayName.trim() !== '') {
      firestoreUpdateData.displayName = data.displayName;
    }
    if (data.photoURL !== undefined) { // Check if photoURL is part of the update
      firestoreUpdateData.photoURL = data.photoURL;
    }


    if (Object.keys(firestoreUpdateData).length > 1) { // if more than just updatedAt
        await userDocRef.update(firestoreUpdateData);
    }
    
    const authUpdatePayload: { displayName?: string; photoURL?: string } = {};
    if (data.displayName !== undefined && data.displayName.trim() !== '') {
      authUpdatePayload.displayName = data.displayName;
    }
     if (data.photoURL !== undefined) { 
      authUpdatePayload.photoURL = data.photoURL;
    }

    if (Object.keys(authUpdatePayload).length > 0) {
      await authAdmin.updateUser(targetUserId, authUpdatePayload);
    }

    revalidatePath('/profile');
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
  
  const targetUserId = userId;

  if (!newPassword || newPassword.length < 6) {
     return { success: false, message: "New password must be at least 6 characters long." };
  }

  try {
    await authAdmin.updateUser(targetUserId, {
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

  const targetUserId = userId;

  try {
    await authAdmin.updateUser(targetUserId, {
      disabled: true,
    });
    if (dbAdmin) {
        await dbAdmin.collection('users').doc(targetUserId).update({ 
            status: 'deactivated', 
            disabledAt: FieldValue.serverTimestamp(),
            updatedAt: FieldValue.serverTimestamp(),
        });
    } else {
        console.warn("dbAdmin not available. Skipping Firestore update for deactivation status.");
    }
    revalidatePath('/profile'); // Revalidate profile to reflect changes if any
    revalidatePath('/'); // Revalidate home to reflect logout state for header etc.
    return { success: true, message: 'Account deactivated successfully. You will be logged out.' };
  } catch (error) {
    console.error('Error deactivating account:', error);
    return { success: false, message: 'Failed to deactivate account.' };
  }
}
