
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
  console.log("dataService: Entered getRoadmaps function.");
  if (!dbAdmin) {
    console.warn("dataService: Firestore Admin DB (dbAdmin) is not initialized in getRoadmaps. Returning mock roadmaps.");
    return [...mockRoadmaps]; // Return a copy
  }
  try {
    console.log("dataService: Attempting to fetch roadmaps from Firestore...");
    const roadmapsSnapshot = await dbAdmin.collection('roadmaps').orderBy('displayOrder', 'asc').get();
    console.log("dataService: Firestore query for roadmaps executed.");
    if (roadmapsSnapshot.empty) {
      console.warn("dataService: No roadmaps found in Firestore. Returning mock roadmaps.");
      return [...mockRoadmaps]; // Return a copy
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
    console.log("dataService: Successfully fetched and mapped roadmaps from Firestore.");
    return roadmapsData;
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : String(error);
    console.error(`dataService: Error during Firestore operation in getRoadmaps: ${errorMessage}. Full error:`, error);
    console.warn("dataService: Falling back to mock roadmaps due to Firestore error.");
    return [...mockRoadmaps]; // Return a copy
  }
}

export async function getContentItems(): Promise<ContentItem[]> {
  console.log("dataService: Entered getContentItems function.");
   if (!dbAdmin) {
    console.warn("dataService: Firestore Admin DB (dbAdmin) is not initialized in getContentItems. Returning mock content items.");
    return [...fallbackMockContent]; // Return a copy
  }
  try {
    console.log("dataService: Attempting to fetch content items from Firestore...");
    const contentSnapshot = await dbAdmin.collection('contentItems').orderBy('createdAt', 'desc').get();
    console.log("dataService: Firestore query for content items executed.");
    if (contentSnapshot.empty) {
      console.warn("dataService: No content items found in Firestore. Returning mock content items.");
      return [...fallbackMockContent]; // Return a copy
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
    console.log("dataService: Successfully fetched and mapped content items from Firestore.");
    return contentItemsData;
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : String(error);
    console.error(`dataService: Error during Firestore operation in getContentItems: ${errorMessage}. Full error:`, error);
    console.warn("dataService: Falling back to mock content items due to Firestore error.");
    return [...fallbackMockContent]; // Return a copy
  }
}

// This function is more of a placeholder/example as profile fetching is now in profile/actions.ts
// However, if a generic server-side profile fetcher is needed, it would look like this.
export async function getUserProfileServer(userId: string): Promise<UserProfileData | null> {
  console.log(`dataService: Entered getUserProfileServer for userId: ${userId}`);
  if (!dbAdmin) {
    console.error("dataService: Firestore Admin DB (dbAdmin) is not initialized. Cannot fetch user profile (getUserProfileServer).");
    return null;
  }
  if (!userId) {
    console.error("dataService: No userId provided to getUserProfileServer.");
    return null;
  }
  try {
    console.log(`dataService: Attempting to fetch profile for user ${userId} from Firestore...`);
    const userDocRef = dbAdmin.collection('users').doc(userId);
    const userDocSnap = await userDocRef.get();
    console.log(`dataService: Firestore query for user ${userId} profile executed.`);

    if (userDocSnap.exists) {
      const data = userDocSnap.data()!; // Assert data exists
      const profile = {
        id: userDocSnap.id,
        displayName: data.displayName || '',
        email: data.email || '',
        photoURL: data.photoURL || null,
        address: data.address || '',
        role: data.role || USER_ROLES.SIMPLE,
        createdAt: data.createdAt?.toDate ? data.createdAt.toDate() : new Date(),
        updatedAt: data.updatedAt?.toDate ? data.updatedAt.toDate() : undefined,
      } as UserProfileData;
      console.log(`dataService: Profile found for user ${userId}.`);
      return profile;
    } else {
      console.log(`dataService: No profile document found for user ${userId} in getUserProfileServer.`);
      return null;
    }
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : String(error);
    console.error(`dataService: Error fetching user profile for ${userId} from Firestore (getUserProfileServer): ${errorMessage}. Full error:`, error);
    return null;
  }
}

export async function getRoadmapById(id: string): Promise<Roadmap | null> {
  console.log(`dataService: Entered getRoadmapById for id: ${id}`);
  if (!dbAdmin) {
    console.warn(`dataService: Firestore Admin DB (dbAdmin) is not initialized. Cannot fetch roadmap ${id}. Attempting to find in mock data.`);
    const mockResult = mockRoadmaps.find(r => r.id === id) || null;
    if (mockResult) console.log(`dataService: Found roadmap ${id} in mock data.`);
    else console.log(`dataService: Roadmap ${id} not found in mock data.`);
    return mockResult;
  }
  try {
    console.log(`dataService: Attempting to fetch roadmap by ID ${id} from Firestore...`);
    const docRef = dbAdmin.collection('roadmaps').doc(id);
    const docSnap = await docRef.get();
    console.log(`dataService: Firestore query for roadmap ID ${id} executed.`);
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
      console.log(`dataService: Successfully fetched roadmap by ID ${id} from Firestore.`);
      return roadmapData;
    }
    console.warn(`dataService: Roadmap with id ${id} not found in Firestore. Attempting to find in mock data.`);
    const mockResultOnNotFound = mockRoadmaps.find(r => r.id === id) || null;
    if (mockResultOnNotFound) console.log(`dataService: Found roadmap ${id} in mock data after Firestore miss.`);
    else console.log(`dataService: Roadmap ${id} not found in mock data after Firestore miss.`);
    return mockResultOnNotFound;
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : String(error);
    console.error(`dataService: Error fetching roadmap ${id} from Firestore: ${errorMessage}. Falling back to mock data if available. Full error:`, error);
    const mockResultOnError = mockRoadmaps.find(r => r.id === id) || null;
    if (mockResultOnError) console.log(`dataService: Found roadmap ${id} in mock data after Firestore error.`);
    else console.log(`dataService: Roadmap ${id} not found in mock data after Firestore error.`);
    return mockResultOnError;
  }
}

