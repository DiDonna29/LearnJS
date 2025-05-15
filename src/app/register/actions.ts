
'use server';

/**
 * @fileOverview Server Actions for user registration post-auth.
 */
import { dbAdmin, getUserIdFromToken } from '@/lib/firebase-admin-init';
import { USER_ROLES } from '@/lib/constants';
import { FieldValue } from 'firebase-admin/firestore';

export async function initializeUserProfile(
  userId: string, // This should be the Firebase Auth UID
  email: string,
  displayName: string | null
): Promise<{ success: boolean; message: string }> {
  if (!dbAdmin) {
    console.error("Firestore Admin DB not initialized.");
    return { success: false, message: "Server error: Database not initialized." };
  }

  // In a real scenario with token verification, you'd do this:
  // const verifiedUserId = await getUserIdFromToken(passedIdTokenFromClient);
  // if (!verifiedUserId || verifiedUserId !== userId) {
  //   return { success: false, message: "Authentication failed or UID mismatch." };
  // }
  // For now, we trust the passed userId from the client post-auth client-side.

  try {
    const userRef = dbAdmin.collection('users').doc(userId);
    const userDoc = await userRef.get();

    if (userDoc.exists) {
      // User document already exists, perhaps update it or do nothing
      console.log(`User profile for ${userId} already exists.`);
      // You might want to update displayName or email if they changed
      // await userRef.update({ updatedAt: FieldValue.serverTimestamp() });
      return { success: true, message: 'User profile already initialized.' };
    }

    await userRef.set({
      email: email,
      displayName: displayName || email.split('@')[0] || 'New User', // Default display name
      photoURL: null, // Or a default avatar URL
      role: USER_ROLES.SIMPLE, // Default role
      address: '', // Default empty address
      createdAt: FieldValue.serverTimestamp(),
      updatedAt: FieldValue.serverTimestamp(),
    });

    return { success: true, message: 'User profile initialized successfully in Firestore.' };
  } catch (error) {
    console.error('Error initializing user profile in Firestore:', error);
    return { success: false, message: 'Failed to initialize user profile. Please try again.' };
  }
}
