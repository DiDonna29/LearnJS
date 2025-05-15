
'use server';
/**
 * @fileOverview Server-side data fetching service.
 * Interacts with Firestore using the Firebase Admin SDK.
 */

import { dbAdmin } from '@/lib/firebase-admin-init';
import type { Roadmap, ContentItem, UserProfileData } from '@/lib/types';
import { USER_ROLES } from '@/lib/constants'; // Assuming USER_ROLES is defined in constants

// Simulate network delay - can be removed for production
// const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

export async function getRoadmaps(): Promise<Roadmap[]> {
  // console.log("Fetching roadmaps from Firestore...");
  if (!dbAdmin) {
    console.error("Firestore Admin DB not initialized. Cannot fetch roadmaps.");
    return []; // Or throw an error
  }
  try {
    const roadmapsSnapshot = await dbAdmin.collection('roadmaps').orderBy('displayOrder', 'asc').get();
    if (roadmapsSnapshot.empty) {
      console.log("No roadmaps found in Firestore.");
      return [];
    }
    const roadmaps = roadmapsSnapshot.docs.map(doc => {
      const data = doc.data();
      return {
        id: doc.id,
        title: data.title || '',
        description: data.description || '',
        iconName: data.iconName || 'GitFork',
        displayOrder: data.displayOrder || 0,
        courses: (data.courses || []).map((course: any, index: number) => ({ // Basic typing for course from DB
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
    console.error("Error fetching roadmaps from Firestore:", error);
    // Depending on your error handling strategy, you might throw the error
    // or return an empty array / cached data / mock data
    return []; 
  }
}

export async function getContentItems(): Promise<ContentItem[]> {
  // console.log("Fetching content items from Firestore...");
   if (!dbAdmin) {
    console.error("Firestore Admin DB not initialized. Cannot fetch content items.");
    return [];
  }
  try {
    const contentSnapshot = await dbAdmin.collection('contentItems').orderBy('createdAt', 'desc').get();
    if (contentSnapshot.empty) {
      console.log("No content items found in Firestore.");
      return [];
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
        createdAt: data.createdAt?.toDate ? data.createdAt.toDate() : new Date(), // Handle Timestamp
      } as ContentItem;
    });
    return contentItems;
  } catch (error) {
    console.error("Error fetching content items from Firestore:", error);
    return [];
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
        email: data?.email || '', // Email should be from Auth ideally but can be stored here
        photoURL: data?.photoURL || null,
        address: data?.address || '',
        role: data?.role || USER_ROLES.SIMPLE, // Default to SIMPLE if not set
        createdAt: data?.createdAt?.toDate ? data.createdAt.toDate() : new Date(),
        // any other fields you store in the user's Firestore document
      } as UserProfileData;
    } else {
      console.log(`No profile document found for user ${userId}.`);
      return null;
    }
  } catch (error) {
    console.error(`Error fetching user profile for ${userId} from Firestore:`, error);
    return null;
  }
}

export async function getRoadmapById(id: string): Promise<Roadmap | null> {
  if (!dbAdmin) {
    console.error("Firestore Admin DB not initialized. Cannot fetch roadmap.");
    return null;
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
    console.log(`Roadmap with id ${id} not found.`);
    return null;
  } catch (error) {
    console.error(`Error fetching roadmap ${id} from Firestore:`, error);
    return null;
  }
}
