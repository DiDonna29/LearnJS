
// src/lib/firebase-admin-init.ts
import admin from 'firebase-admin';

// Ensure this is only initialized once
if (!admin.apps.length) {
  try {
    // These environment variables would be populated from your service account JSON key
    // Ensure they are set in your Vercel/Cloud Run environment for deployment
    const serviceAccount = {
      projectId: process.env.FIREBASE_ADMIN_PROJECT_ID,
      clientEmail: process.env.FIREBASE_ADMIN_CLIENT_EMAIL,
      privateKey: process.env.FIREBASE_ADMIN_PRIVATE_KEY?.replace(/\\n/g, '\n'), // Handle escaped newlines
    };

    if (!serviceAccount.projectId || !serviceAccount.clientEmail || !serviceAccount.privateKey) {
      console.warn(
        'Firebase Admin SDK not initialized. Missing environment variables: FIREBASE_ADMIN_PROJECT_ID, FIREBASE_ADMIN_CLIENT_EMAIL, FIREBASE_ADMIN_PRIVATE_KEY. Server-side Firebase operations will not work.'
      );
    } else {
      admin.initializeApp({
        credential: admin.credential.cert(serviceAccount),
        // If you also use Firebase Realtime Database server-side:
        // databaseURL: `https://${process.env.FIREBASE_ADMIN_PROJECT_ID}.firebaseio.com`
      });
      console.log('Firebase Admin SDK initialized successfully.');
    }
  } catch (error) {
    console.error('Firebase Admin SDK initialization error:', error);
  }
}

export const authAdmin = admin.apps.length ? admin.auth() : null;
export const dbAdmin = admin.apps.length ? admin.firestore() : null;

// Helper function to get the authenticated user's UID from an ID token
// This would be used in Server Actions or API Routes
export async function getUserIdFromToken(idToken: string | undefined | null): Promise<string | null> {
  if (!idToken || !authAdmin) {
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
