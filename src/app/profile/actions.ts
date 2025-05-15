
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
  // In a real app, you'd pass an ID token from the client
  // and verify it here to get the targetUserId
  // idToken: string | undefined
  userId: string // For now, assuming userId is securely obtained or for direct fetch
): Promise<UserProfileData | null> {
  if (!dbAdmin) {
    console.error("Firestore Admin DB not initialized. Cannot fetch user profile.");
    return null;
  }
  // const targetUserId = await getUserIdFromToken(idToken);
  // if (!targetUserId) {
  //   console.error("Authentication failed or no user ID found from token.");
  //   return null;
  // }
  if (!userId) {
     console.error("No user ID provided for fetching profile.");
    return null;
  }

  try {
    const userRef = dbAdmin.collection('users').doc(userId);
    const docSnap = await userRef.get();

    if (docSnap.exists) {
      const data = docSnap.data();
      // Fetch auth data for the most up-to-date email and photoURL from Firebase Auth
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
        // Any other custom fields from your Firestore 'users' document
      };
    } else {
      console.log(`User profile document not found for UID: ${userId}`);
      // Optionally, try to fetch from Auth directly if Firestore doc is missing
      if (authAdmin) {
        try {
          const authUserRecord = await authAdmin.getUser(userId);
          return {
            id: authUserRecord.uid,
            displayName: authUserRecord.displayName || '',
            email: authUserRecord.email || '',
            photoURL: authUserRecord.photoURL || null,
            address: '', // No address in Auth
            role: USER_ROLES.SIMPLE, // Default role
            createdAt: new Date(authUserRecord.metadata.creationTime || Date.now()),
          };
        } catch (e) { /* ignore if not found in Auth either */ }
      }
      return null;
    }
  } catch (error) {
    console.error('Error fetching user profile:', error);
    return null;
  }
}


export async function updateUserProfile(
  // In a real app, you'd pass an ID token from the client
  // idToken: string | undefined,
  userId: string, // Temporarily passing userId directly
  data: UserProfileUpdateData
): Promise<{ success: boolean; message: string }> {
  
  if (!dbAdmin || !authAdmin) {
    console.error("Firestore Admin DB or Auth Admin not initialized.");
    return { success: false, message: "Server error: Services not initialized." };
  }

  // const targetUserId = await getUserIdFromToken(idToken);
  // if (!targetUserId) {
  //   return { success: false, message: "Authentication failed. User not found or token invalid." };
  // }
  // For simulation, we use the passed userId directly, assuming it's verified.
  const targetUserId = userId;


  try {
    const userDocRef = dbAdmin.collection('users').doc(targetUserId);
    
    const firestoreUpdateData: Record<string, any> = {
      address: data.address,
      updatedAt: FieldValue.serverTimestamp(),
    };

    // Only update displayName in Firestore if it's part of the UserProfileUpdateData
    if (data.displayName !== undefined) {
      firestoreUpdateData.displayName = data.displayName;
    }
    // Only update photoURL in Firestore if it's part of the UserProfileUpdateData
     if (data.photoURL !== undefined) {
      firestoreUpdateData.photoURL = data.photoURL;
    }


    await userDocRef.update(firestoreUpdateData);
    
    // Update Firebase Auth display name and photoURL if they changed
    const authUpdatePayload: { displayName?: string; photoURL?: string } = {};
    if (data.displayName !== undefined) {
      authUpdatePayload.displayName = data.displayName;
    }
    if (data.photoURL !== undefined) { // Assuming photoURL might be part of UserProfileUpdateData
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

export async function deactivateAccount(
  // In a real app, pass ID token
  // idToken: string | undefined
  userId: string // Temporarily passing userId directly
): Promise<{ success: boolean; message: string }> {
  if (!authAdmin) {
    console.error("Auth Admin not initialized.");
    return { success: false, message: "Server error: Auth service not initialized." };
  }

  // const targetUserId = await getUserIdFromToken(idToken);
  // if (!targetUserId) {
  //   return { success: false, message: "Authentication failed." };
  // }
  const targetUserId = userId;

  try {
    await authAdmin.updateUser(targetUserId, {
      disabled: true,
    });
    // Optionally, you might want to update a status in your Firestore 'users' document as well.
    // e.g., dbAdmin.collection('users').doc(targetUserId).update({ status: 'deactivated', disabledAt: FieldValue.serverTimestamp() });

    // Revalidating path might not be useful if user is logged out immediately
    // revalidatePath('/profile'); 
    return { success: true, message: 'Account deactivated successfully.' };
  } catch (error) {
    console.error('Error deactivating account:', error);
    return { success: false, message: 'Failed to deactivate account.' };
  }
}
