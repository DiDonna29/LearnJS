
'use server';

/**
 * @fileOverview Server Actions for AI Tool functionalities.
 */
import { dbAdmin, getUserIdFromToken } from '@/lib/firebase-admin-init';
import type { SuggestLearningPathInput, SuggestLearningPathOutput } from '@/ai/flows/suggest-learning-path';
import { FieldValue } from 'firebase-admin/firestore';
// import { revalidatePath } from 'next/cache'; // Not strictly needed unless displaying saved paths

interface SavePathData {
  input: SuggestLearningPathInput;
  output: SuggestLearningPathOutput;
  idToken?: string | null; // ID token from the client for verification
}

export async function saveAiLearningPath(
  // userId parameter is now less critical if idToken is used for verification
  // userId: string | null, 
  data: SavePathData
): Promise<{ success: boolean; message: string; pathId?: string }> {
  
  if (!dbAdmin) {
    console.error("Firestore Admin DB not initialized.");
    return { success: false, message: "Server error: Database not initialized." };
  }

  let targetUserId: string | null = null;
  if (data.idToken) {
    targetUserId = await getUserIdFromToken(data.idToken);
    if (!targetUserId) {
      return { success: false, message: "Authentication failed. Could not verify user." };
    }
  } else {
    // Allow saving even if not logged in (path won't be associated with a user)
    // Or return error if login is strictly required
    console.log('User not logged in or ID token not provided. Saving path without user association (or this could be an error).');
    // To require login:
    // return { success: false, message: "You must be logged in to save a learning path." };
  }

  try {
    let pathRef;
    const pathData = {
      experienceLevel: data.input.experienceLevel,
      careerGoals: data.input.careerGoals,
      suggestedPath: data.output.suggestedPath,
      savedAt: FieldValue.serverTimestamp(),
      ...(targetUserId && { userId: targetUserId }), // Conditionally add userId
    };

    if (targetUserId) {
      // Save to a subcollection 'aiLearningPaths' under the user's document
      // pathRef = dbAdmin.collection('users').doc(targetUserId).collection('aiLearningPaths').doc();
      // OR save to a top-level collection 'aiLearningPaths'
      pathRef = dbAdmin.collection('aiLearningPaths').doc(); // Auto-generate ID
      await pathRef.set(pathData);
      console.log(`AI learning path saved for user ${targetUserId} with ID: ${pathRef.id}`);
    } else {
      // Save to a general 'publicAiLearningPaths' collection or similar if allowing anonymous saves
      pathRef = dbAdmin.collection('publicAiLearningPaths').doc();
      await pathRef.set(pathData);
      console.log(`Public AI learning path saved with ID: ${pathRef.id}`);
    }
    
    // revalidatePath('/profile/ai-paths'); // If you have a page to list saved paths
    return { success: true, message: 'Learning path saved successfully!', pathId: pathRef.id };
  } catch (error) {
    console.error('Error saving AI learning path to Firestore:', error);
    return { success: false, message: 'Failed to save learning path. Please try again.' };
  }
}
