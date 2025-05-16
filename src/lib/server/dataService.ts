
'use server';
/**
 * @fileOverview Server-side data fetching service.
 * Interacts with Firestore using the Firebase Admin SDK.
 */

import { dbAdmin } from '@/lib/firebase-admin-init';
import type { Roadmap, ContentItem, UserProfileData } from '@/lib/types';
import { USER_ROLES, roadmaps as mockRoadmaps, mockContent as fallbackMockContent } from '@/lib/constants'; // Assuming USER_ROLES is defined in constants

// Simulate network delay - can be removed for production
// const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

export async function getRoadmaps(): Promise<Roadmap[]> {
  if (!dbAdmin) {
    console.warn("Firestore Admin DB not initialized. Returning mock roadmaps.");
    return mockRoadmaps;
  }
  try {
    // console.log("Fetching roadmaps from Firestore...");
    const roadmapsSnapshot = await dbAdmin.collection('roadmaps').orderBy('displayOrder', 'asc').get();
    if (roadmapsSnapshot.empty) {
      console.warn("No roadmaps found in Firestore. Returning mock roadmaps.");
      return mockRoadmaps;
    }
    const roadmaps = roadmapsSnapshot.docs.map(doc => {
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
          displayOrder: course.displayOrder || index,
          contentLink: course.contentLink || undefined,
        }))
      } as Roadmap;
    });
    return roadmaps;
  } catch (error) {
    console.error("Error fetching roadmaps from Firestore. Returning mock roadmaps.", error);
    return mockRoadmaps; 
  }
}

export async function getContentItems(): Promise<ContentItem[]> {
   if (!dbAdmin) {
    console.warn("Firestore Admin DB not initialized. Returning mock content items.");
    return fallbackMockContent;
  }
  try {
    // console.log("Fetching content items from Firestore...");
    const contentSnapshot = await dbAdmin.collection('contentItems').orderBy('createdAt', 'desc').get();
    if (contentSnapshot.empty) {
      console.warn("No content items found in Firestore. Returning mock content items.");
      return fallbackMockContent;
    }
    const contentItems = contentSnapshot.docs.map(doc => {
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
    return contentItems;
  } catch (error) {
    console.error("Error fetching content items from Firestore. Returning mock content items.", error);
    return fallbackMockContent;
  }
}

export async function getUserProfile(userId: string): Promise<UserProfileData | null> {
  if (!dbAdmin) {
    console.error("Firestore Admin DB not initialized. Cannot fetch user profile.");
    return null;
  }
  if (!userId) {
    console.error("No userId provided to getUserProfile.");
    return null;
  }
  try {
    const userDocRef = dbAdmin.collection('users').doc(userId);
    const userDocSnap = await userDocRef.get();

    if (userDocSnap.exists) {
      const data = userDocSnap.data();
      return {
        id: userDocSnap.id,
        displayName: data?.displayName || '',
        email: data?.email || '', 
        photoURL: data?.photoURL || null,
        address: data?.address || '',
        role: data?.role || USER_ROLES.SIMPLE, 
        createdAt: data?.createdAt?.toDate ? data.createdAt.toDate() : new Date(),
      } as UserProfileData;
    } else {
      console.log(`No profile document found for user ${userId}. Attempting to fetch from Auth to create basic profile.`);
      // Fallback: If Firestore profile doesn't exist, but Auth user might, try to create one.
      // This part might be better handled directly in fetchUserProfile in actions.ts
      // For now, dataService assumes it's mainly for reading existing profiles.
      return null;
    }
  } catch (error) {
    console.error(`Error fetching user profile for ${userId} from Firestore:`, error);
    return null;
  }
}

export async function getRoadmapById(id: string): Promise<Roadmap | null> {
  if (!dbAdmin) {
    console.warn(`Firestore Admin DB not initialized. Cannot fetch roadmap ${id}. Attempting to find in mock data.`);
    return mockRoadmaps.find(r => r.id === id) || null;
  }
  try {
    const docRef = dbAdmin.collection('roadmaps').doc(id);
    const docSnap = await docRef.get();
    if (docSnap.exists) {
      const data = docSnap.data();
       return {
        id: docSnap.id,
        title: data?.title || '',
        description: data?.description || '',
        iconName: data?.iconName || 'GitFork',
        displayOrder: data?.displayOrder || 0,
        courses: (data?.courses || []).map((course: any, index: number) => ({
          id: course.id || `course-${index}`,
          title: course.title || '',
          description: course.description || '',
          displayOrder: course.displayOrder || index,
          contentLink: course.contentLink || undefined,
        }))
      } as Roadmap;
    }
    console.warn(`Roadmap with id ${id} not found in Firestore. Attempting to find in mock data.`);
    return mockRoadmaps.find(r => r.id === id) || null;
  } catch (error) {
    console.error(`Error fetching roadmap ${id} from Firestore:`, error);
    return mockRoadmaps.find(r => r.id === id) || null;
  }
}
