
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
          const basicProfile = {
            id: authUserRecord.uid,
            displayName: authUserRecord.displayName || '',
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
    console.error("Firestore Admin DB or Auth Admin not initialized.");
    return { success: false, message: "Server error: Services not initialized." };
  }
  
  // In a real production app, you might verify the userId against a passed ID token
  // const verifiedUserId = await getUserIdFromToken(idTokenFromClient);
  // if (!verifiedUserId || verifiedUserId !== userId) {
  //   return { success: false, message: "Authentication failed or UID mismatch." };
  // }
  const targetUserId = userId;


  try {
    const userDocRef = dbAdmin.collection('users').doc(targetUserId);
    
    const firestoreUpdateData: Record<string, any> = {
      updatedAt: FieldValue.serverTimestamp(),
    };
    if (data.address !== undefined) {
      firestoreUpdateData.address = data.address;
    }
    if (data.displayName !== undefined) {
      firestoreUpdateData.displayName = data.displayName;
    }
    if (data.photoURL !== undefined) {
      firestoreUpdateData.photoURL = data.photoURL;
    }

    await userDocRef.update(firestoreUpdateData);
    
    const authUpdatePayload: { displayName?: string; photoURL?: string } = {};
    if (data.displayName !== undefined) {
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
  newPassword?: string | null // Made optional to align with potential token usage
): Promise<{ success: boolean; message: string }> {
  if (!authAdmin) {
    console.error("Auth Admin not initialized.");
    return { success: false, message: "Server error: Auth service not initialized." };
  }
  
  // In a real app, you would get userId from a verified ID token, not pass it.
  // const verifiedUserId = await getUserIdFromToken(idTokenFromClient);
  // if (!verifiedUserId) {
  //   return { success: false, message: "Authentication failed. User not found or token invalid." };
  // }
  const targetUserId = userId;

  if (!newPassword || newPassword.length < 6) {
     return { success: false, message: "New password must be at least 6 characters long." };
  }

  try {
    await authAdmin.updateUser(targetUserId, {
      password: newPassword,
    });
    // No need to revalidate path as password change doesn't visually change the profile page itself immediately.
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
    console.error("Auth Admin not initialized.");
    return { success: false, message: "Server error: Auth service not initialized." };
  }

  // const targetUserId = await getUserIdFromToken(idTokenFromClient);
  // if (!targetUserId) {
  //   return { success: false, message: "Authentication failed." };
  // }
  const targetUserId = userId;

  try {
    await authAdmin.updateUser(targetUserId, {
      disabled: true,
    });
    // Optionally, update a status in Firestore 'users' document
    if (dbAdmin) {
        await dbAdmin.collection('users').doc(targetUserId).update({ 
            status: 'deactivated', 
            disabledAt: FieldValue.serverTimestamp() 
        });
    }
    return { success: true, message: 'Account deactivated successfully.' };
  } catch (error) {
    console.error('Error deactivating account:', error);
    return { success: false, message: 'Failed to deactivate account.' };
  }
}

