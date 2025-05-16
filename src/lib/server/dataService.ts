
'use server';
/**
 * @fileOverview Server-side data fetching service.
 * Interacts with Firestore using the Firebase Admin SDK.
 */

import { dbAdmin } from '@/lib/firebase-admin-init';
import type { Roadmap, ContentItem, UserProfileData } from '@/lib/types';
import { USER_ROLES, roadmaps as mockRoadmapsConstants, mockContent as fallbackMockContentConstants } from '@/lib/constants';

// Ensure mock data is consistently typed and prepared.
const mockRoadmaps = mockRoadmapsConstants.map(r => ({ ...r }));
const fallbackMockContent = fallbackMockContentConstants.map(c => ({ ...c, createdAt: c.createdAt || new Date() }));


export async function getRoadmaps(): Promise<Roadmap[]> {
  if (!dbAdmin) {
    console.warn("Firestore Admin DB not initialized. Returning mock roadmaps.");
    return [...mockRoadmaps];
  }
  try {
    console.log("Attempting to fetch roadmaps from Firestore...");
    const roadmapsSnapshot = await dbAdmin.collection('roadmaps').orderBy('displayOrder', 'asc').get();
    if (roadmapsSnapshot.empty) {
      console.warn("No roadmaps found in Firestore. Returning mock roadmaps.");
      return [...mockRoadmaps];
    }
    const roadmapsData = roadmapsSnapshot.docs.map(doc => {
      const data = doc.data();
      return {
        id: doc.id,
        title: data.title || '',
        description: data.description || '',
        iconName: data.iconName || 'GitFork',
        displayOrder: data.displayOrder || 0,
        courses: (data.courses || []).map((course: any, index: number) => ({
          id: course.id || `course-${index}`,
          title: course.title || '',
          description: course.description || '',
          displayOrder: course.displayOrder || index + 1,
          contentLink: course.contentLink || undefined,
        }))
      } as Roadmap;
    });
    console.log("Successfully fetched roadmaps from Firestore.");
    return roadmapsData;
  } catch (error) {
    // Log the error for debugging, but ensure we always fall back.
    // The DECODER error is a common symptom of an invalid private key.
    const errorMessage = error instanceof Error ? error.message : String(error);
    console.error(`Error fetching roadmaps from Firestore: ${errorMessage}. Falling back to mock roadmaps. Full error:`, error);
    return [...mockRoadmaps];
  }
}

export async function getContentItems(): Promise<ContentItem[]> {
   if (!dbAdmin) {
    console.warn("Firestore Admin DB not initialized. Returning mock content items.");
    return [...fallbackMockContent];
  }
  try {
    console.log("Attempting to fetch content items from Firestore...");
    const contentSnapshot = await dbAdmin.collection('contentItems').orderBy('createdAt', 'desc').get();
    if (contentSnapshot.empty) {
      console.warn("No content items found in Firestore. Returning mock content items.");
      return [...fallbackMockContent];
    }
    const contentItemsData = contentSnapshot.docs.map(doc => {
      const data = doc.data();
      return {
        id: doc.id,
        title: data.title || '',
        type: data.type || 'Article',
        source: data.source || '',
        description: data.description || '',
        imageUrl: data.imageUrl || 'https://placehold.co/600x400.png',
        dataAiHint: data.dataAiHint || 'code abstract',
        category: data.category || 'General',
        externalLink: data.externalLink || undefined,
        createdAt: data.createdAt?.toDate ? data.createdAt.toDate() : new Date(),
      } as ContentItem;
    });
    console.log("Successfully fetched content items from Firestore.");
    return contentItemsData;
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : String(error);
    console.error(`Error fetching content items from Firestore: ${errorMessage}. Falling back to mock content items. Full error:`, error);
    return [...fallbackMockContent];
  }
}

// This function is more of a placeholder/example as profile fetching is now in profile/actions.ts
// However, if a generic server-side profile fetcher is needed, it would look like this.
export async function getUserProfileServer(userId: string): Promise<UserProfileData | null> {
  if (!dbAdmin) {
    console.error("Firestore Admin DB not initialized. Cannot fetch user profile (getUserProfileServer).");
    return null;
  }
  if (!userId) {
    console.error("No userId provided to getUserProfileServer.");
    return null;
  }
  try {
    const userDocRef = dbAdmin.collection('users').doc(userId);
    const userDocSnap = await userDocRef.get();

    if (userDocSnap.exists) {
      const data = userDocSnap.data()!; // Assert data exists
      return {
        id: userDocSnap.id,
        displayName: data.displayName || '',
        email: data.email || '',
        photoURL: data.photoURL || null,
        address: data.address || '',
        role: data.role || USER_ROLES.SIMPLE,
        createdAt: data.createdAt?.toDate ? data.createdAt.toDate() : new Date(),
        updatedAt: data.updatedAt?.toDate ? data.updatedAt.toDate() : undefined,
      } as UserProfileData;
    } else {
      console.log(`No profile document found for user ${userId} in getUserProfileServer.`);
      return null;
    }
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : String(error);
    console.error(`Error fetching user profile for ${userId} from Firestore (getUserProfileServer): ${errorMessage}. Full error:`, error);
    return null;
  }
}

export async function getRoadmapById(id: string): Promise<Roadmap | null> {
  if (!dbAdmin) {
    console.warn(`Firestore Admin DB not initialized. Cannot fetch roadmap ${id}. Attempting to find in mock data.`);
    return mockRoadmaps.find(r => r.id === id) || null;
  }
  try {
    console.log(`Attempting to fetch roadmap by ID ${id} from Firestore...`);
    const docRef = dbAdmin.collection('roadmaps').doc(id);
    const docSnap = await docRef.get();
    if (docSnap.exists) {
      const data = docSnap.data()!; // Assert data exists
       const roadmapData = {
        id: docSnap.id,
        title: data.title || '',
        description: data.description || '',
        iconName: data.iconName || 'GitFork',
        displayOrder: data.displayOrder || 0,
        courses: (data.courses || []).map((course: any, index: number) => ({
          id: course.id || `course-${index}`,
          title: course.title || '',
          description: course.description || '',
          displayOrder: course.displayOrder || index + 1,
          contentLink: course.contentLink || undefined,
        }))
      } as Roadmap;
      console.log(`Successfully fetched roadmap by ID ${id} from Firestore.`);
      return roadmapData;
    }
    console.warn(`Roadmap with id ${id} not found in Firestore. Attempting to find in mock data.`);
    return mockRoadmaps.find(r => r.id === id) || null;
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : String(error);
    console.error(`Error fetching roadmap ${id} from Firestore: ${errorMessage}. Falling back to mock data if available. Full error:`, error);
    return mockRoadmaps.find(r => r.id === id) || null;
  }
}
