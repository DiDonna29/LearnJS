
'use server';
/**
 * @fileOverview Server-side data fetching service.
 * Simulates fetching data from a database like Firestore.
 * In a real application, these functions would interact with dbAdmin from 'firebase-admin-init'.
 */

import { roadmaps, mockContent } from '@/lib/constants';
import type { Roadmap, ContentItem } from '@/lib/types';
// import { dbAdmin } from '@/lib/firebase-admin-init'; // Uncomment when using actual Firestore

// Simulate network delay
const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

export async function getRoadmaps(): Promise<Roadmap[]> {
  // console.log("Fetching roadmaps (simulated)...");
  // await delay(50); // Simulate network latency

  // Real Firestore example (replace mock data):
  /*
  if (!dbAdmin) {
    console.error("Firestore Admin DB not initialized. Returning mock data.");
    return roadmaps;
  }
  try {
    const roadmapsSnapshot = await dbAdmin.collection('roadmaps').orderBy('displayOrder').get();
    if (roadmapsSnapshot.empty) {
      return [];
    }
    return roadmapsSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Roadmap));
  } catch (error) {
    console.error("Error fetching roadmaps from Firestore:", error);
    throw new Error("Could not fetch roadmaps."); // Or return mock data as fallback
  }
  */
  return roadmaps;
}

export async function getContentItems(): Promise<ContentItem[]> {
  // console.log("Fetching content items (simulated)...");
  // await delay(50);

  // Real Firestore example (replace mock data):
  /*
  if (!dbAdmin) {
    console.error("Firestore Admin DB not initialized. Returning mock data.");
    return mockContent;
  }
  try {
    const contentSnapshot = await dbAdmin.collection('contentItems').orderBy('createdAt', 'desc').get();
    if (contentSnapshot.empty) {
      return [];
    }
    return contentSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as ContentItem));
  } catch (error) {
    console.error("Error fetching content items from Firestore:", error);
    throw new Error("Could not fetch content items.");
  }
  */
  return mockContent;
}

// Example of fetching a single item (not used yet, but good for future)
export async function getRoadmapById(id: string): Promise<Roadmap | null> {
  // console.log(`Fetching roadmap ${id} (simulated)...`);
  // await delay(50);
  const roadmap = roadmaps.find(r => r.id === id);
  return roadmap || null;

  // Real Firestore example:
  /*
  if (!dbAdmin) {
    return null;
  }
  try {
    const docRef = dbAdmin.collection('roadmaps').doc(id);
    const docSnap = await docRef.get();
    if (docSnap.exists) {
      return { id: docSnap.id, ...docSnap.data() } as Roadmap;
    }
    return null;
  } catch (error) {
    console.error(`Error fetching roadmap ${id} from Firestore:`, error);
    return null;
  }
  */
}
