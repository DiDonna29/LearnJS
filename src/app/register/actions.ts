
'use server';

/**
 * @fileOverview Server Actions for user registration post-auth.
 */
import { dbAdmin } from '@/lib/firebase-admin-init'; 
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
      console.log(`User profile for ${userId} already exists. Updating 'updatedAt' timestamp.`);
      await userRef.update({ updatedAt: FieldValue.serverTimestamp() });
      return { success: true, message: 'User profile already initialized and timestamp updated.' };
    }

    const profileDataForFirestore = {
      email: email,
      displayName: displayName || email.split('@')[0] || 'New User',
      photoURL: null, 
      role: USER_ROLES.SIMPLE, 
      address: '', 
      createdAt: FieldValue.serverTimestamp(),
      updatedAt: FieldValue.serverTimestamp(),
      // id: userId, // Not needed directly in the data being set, as it's the doc ID
    };
    
    await userRef.set(profileDataForFirestore);

    return { success: true, message: 'User profile initialized successfully in Firestore.' };
  } catch (error) {
    console.error('Error initializing user profile in Firestore:', error);
    const errorMessage = error instanceof Error ? error.message : 'An unknown error occurred.';
    return { success: false, message: `Failed to initialize user profile: ${errorMessage}` };
  }
}
