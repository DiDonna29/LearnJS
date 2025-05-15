
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
  idToken?: string | null; 
}

export async function saveAiLearningPath(
  data: SavePathData
): Promise<{ success: boolean; message: string; pathId?: string }> {
  
  if (!dbAdmin) {
    console.error("Firestore Admin DB not initialized. Cannot save AI learning path.");
    return { success: false, message: "Server error: Database service not available." };
  }

  let targetUserId: string | null = null;
  if (data.idToken) {
    // authAdmin check is implicitly handled by getUserIdFromToken
    targetUserId = await getUserIdFromToken(data.idToken);
    if (!targetUserId) {
      return { success: false, message: "Authentication failed. Could not verify user." };
    }
  } else {
    // If allowing anonymous saves (not recommended for user-specific data)
    // For this app, we'll assume login is required to save a path.
    console.log('User not logged in or ID token not provided. Path not saved.');
    return { success: false, message: "You must be logged in to save a learning path." };
  }

  try {
    const pathData = {
      userId: targetUserId, // Ensure userId is always included
      experienceLevel: data.input.experienceLevel,
      careerGoals: data.input.careerGoals,
      suggestedPath: data.output.suggestedPath,
      savedAt: FieldValue.serverTimestamp(),
    };

    // Save to a top-level collection 'aiLearningPaths'
    // You could also save to a subcollection under the user's document:
    // dbAdmin.collection('users').doc(targetUserId).collection('aiLearningPaths').doc();
    const pathRef = dbAdmin.collection('aiLearningPaths').doc(); // Auto-generate ID
    await pathRef.set(pathData);
    
    console.log(`AI learning path saved for user ${targetUserId} with ID: ${pathRef.id}`);
    
    // Example: revalidatePath('/profile/ai-paths'); // If you have a page to list saved paths
    return { success: true, message: 'Learning path saved successfully!', pathId: pathRef.id };
  } catch (error)
 {
    console.error('Error saving AI learning path to Firestore:', error);
    const errorMessage = error instanceof Error ? error.message : 'An unknown error occurred.';
    return { success: false, message: `Failed to save learning path: ${errorMessage}` };
  }
}
