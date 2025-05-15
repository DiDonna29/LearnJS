
'use server';

/**
 * @fileOverview Server Actions for user registration post-auth.
 */
import { dbAdmin } from '@/lib/firebase-admin-init'; // authAdmin not directly needed here
import { USER_ROLES } from '@/lib/constants';
import { FieldValue } from 'firebase-admin/firestore';
import type { UserProfileData } from '@/lib/types';

export async function initializeUserProfile(
  userId: string, 
  email: string,
  displayName: string | null
): Promise<{ success: boolean; message: string }> {
  if (!dbAdmin) {
    console.error("Firestore Admin DB not initialized. Cannot initialize user profile.");
    return { success: false, message: "Server error: Database service not available." };
  }

  if (!userId || !email) {
    console.error("User ID or Email missing for profile initialization.");
    return { success: false, message: "User ID or Email missing." };
  }
  
  try {
    const userRef = dbAdmin.collection('users').doc(userId);
    const userDoc = await userRef.get();

    if (userDoc.exists) {
      console.log(`User profile for ${userId} already exists. Updating timestamp.`);
      await userRef.update({ updatedAt: FieldValue.serverTimestamp() });
      return { success: true, message: 'User profile already initialized.' };
    }

    const profileData: UserProfileData = {
      id: userId,
      email: email,
      displayName: displayName || email.split('@')[0] || 'New User',
      photoURL: null, 
      role: USER_ROLES.SIMPLE, 
      address: '', 
      createdAt: FieldValue.serverTimestamp() as any, // Cast to any for serverTimestamp
      updatedAt: FieldValue.serverTimestamp() as any, // Cast to any for serverTimestamp
    };
    
    // Firestore set expects a plain object, FieldValue is handled by the SDK
    // Remove the explicit Date conversion for createdAt/updatedAt for new docs
    const { createdAt, updatedAt, ...dataToSet } = profileData;


    await userRef.set({
      ...dataToSet,
      createdAt: FieldValue.serverTimestamp(),
      updatedAt: FieldValue.serverTimestamp(),
    });

    return { success: true, message: 'User profile initialized successfully in Firestore.' };
  } catch (error) {
    console.error('Error initializing user profile in Firestore:', error);
    const errorMessage = error instanceof Error ? error.message : 'An unknown error occurred.';
    return { success: false, message: `Failed to initialize user profile: ${errorMessage}` };
  }
}
