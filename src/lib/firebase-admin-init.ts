
// src/lib/firebase-admin-init.ts
import admin from 'firebase-admin';
import type { ServiceAccount } from 'firebase-admin';

// Ensure this is only initialized once
if (!admin.apps.length) {
  try {
    const privateKey = process.env.FIREBASE_ADMIN_PRIVATE_KEY?.replace(/\\n/g, '\n');
    if (!process.env.FIREBASE_ADMIN_PROJECT_ID || !process.env.FIREBASE_ADMIN_CLIENT_EMAIL || !privateKey) {
      console.warn(
        'Firebase Admin SDK not initialized. Missing environment variables: FIREBASE_ADMIN_PROJECT_ID, FIREBASE_ADMIN_CLIENT_EMAIL, FIREBASE_ADMIN_PRIVATE_KEY. Server-side Firebase operations will not work.'
      );
    } else {
      const serviceAccount: ServiceAccount = {
        projectId: process.env.FIREBASE_ADMIN_PROJECT_ID,
        clientEmail: process.env.FIREBASE_ADMIN_CLIENT_EMAIL,
        privateKey: privateKey,
      };
      admin.initializeApp({
        credential: admin.credential.cert(serviceAccount),
      });
      console.log('Firebase Admin SDK initialized successfully.');
    }
  } catch (error) {
    console.error('Firebase Admin SDK initialization error:', error);
  }
}

export const authAdmin = admin.apps.length ? admin.auth() : null;
export const dbAdmin = admin.apps.length ? admin.firestore() : null;

export async function getUserIdFromToken(idToken: string | undefined | null): Promise<string | null> {
  if (!idToken || !authAdmin) {
    console.log('getUserIdFromToken: No ID token or authAdmin not available.');
    return null;
  }
  try {
    const decodedToken = await authAdmin.verifyIdToken(idToken);
    return decodedToken.uid;
  } catch (error) {
    console.error('Error verifying ID token:', error);
    return null;
  }
}
