
// src/lib/firebase-admin-init.ts
import admin from 'firebase-admin';
import type { ServiceAccount } from 'firebase-admin';

let authAdminInstance: admin.auth.Auth | null = null;
let dbAdminInstance: admin.firestore.Firestore | null = null;

if (!admin.apps.length) {
  console.log('Attempting to initialize Firebase Admin SDK...');
  const projectId = process.env.FIREBASE_ADMIN_PROJECT_ID;
  const clientEmail = process.env.FIREBASE_ADMIN_CLIENT_EMAIL;
  const privateKeyEnv = process.env.FIREBASE_ADMIN_PRIVATE_KEY;

  if (!projectId || !clientEmail || !privateKeyEnv) {
    console.warn(
      'Firebase Admin SDK CANNOT be initialized. Missing one or more environment variables: FIREBASE_ADMIN_PROJECT_ID, FIREBASE_ADMIN_CLIENT_EMAIL, FIREBASE_ADMIN_PRIVATE_KEY. Server-side Firebase operations will FAIL.'
    );
    if (!projectId) console.warn('Required environment variable FIREBASE_ADMIN_PROJECT_ID is missing.');
    if (!clientEmail) console.warn('Required environment variable FIREBASE_ADMIN_CLIENT_EMAIL is missing.');
    if (!privateKeyEnv) console.warn('Required environment variable FIREBASE_ADMIN_PRIVATE_KEY is missing.');
    // Ensure instances are null if essential config is missing
    authAdminInstance = null;
    dbAdminInstance = null;
  } else {
    try {
      const privateKey = privateKeyEnv.replace(/\\n/g, '\n');
      
      const serviceAccount: ServiceAccount = {
        projectId: projectId,
        clientEmail: clientEmail,
        privateKey: privateKey,
      };

      admin.initializeApp({
        credential: admin.credential.cert(serviceAccount),
      });

      console.log('Firebase Admin SDK initialized successfully.');
      authAdminInstance = admin.auth();
      dbAdminInstance = admin.firestore();

    } catch (error: any) {
      console.error('Firebase Admin SDK initialization FAILED. Error:', error.message);
      console.error('Full error object during initialization:', error);
      console.error('This usually indicates an issue with the service account credentials, especially the private key format or value.');
      authAdminInstance = null;
      dbAdminInstance = null;
    }
  }
} else {
  console.log('Firebase Admin SDK already initialized. Getting existing instances.');
  const mainApp = admin.apps[0]; 
  if (mainApp) {
    try {
      authAdminInstance = admin.auth(mainApp);
      dbAdminInstance = admin.firestore(mainApp);
      console.log('Retrieved existing Firebase Admin SDK instances.');
    } catch (error: any) {
        console.error('Error retrieving existing Firebase Admin SDK instances:', error.message);
        authAdminInstance = null;
        dbAdminInstance = null;
    }
  } else {
    console.warn('Firebase Admin SDK: admin.apps has length > 0 but no app instance could be retrieved.');
    authAdminInstance = null;
    dbAdminInstance = null;
  }
}

export const authAdmin = authAdminInstance;
export const dbAdmin = dbAdminInstance;

export async function getUserIdFromToken(idToken: string | undefined | null): Promise<string | null> {
  if (!idToken ) {
    console.log('getUserIdFromToken: No ID token provided.');
    return null;
  }
  if (!authAdmin) {
    console.error('getUserIdFromToken: Firebase Auth Admin is not initialized. Cannot verify ID token.');
    return null;
  }
  try {
    const decodedToken = await authAdmin.verifyIdToken(idToken);
    return decodedToken.uid;
  } catch (error) {
    console.error('Error verifying ID token in getUserIdFromToken:', error);
    return null;
  }
}
