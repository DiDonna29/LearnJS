
// src/lib/firebase-admin-init.ts
import admin from 'firebase-admin';
import type { ServiceAccount } from 'firebase-admin';

let authAdminInstance: admin.auth.Auth | null = null;
let dbAdminInstance: admin.firestore.Firestore | null = null;

const PEM_HEADER = '-----BEGIN PRIVATE KEY-----';
const PEM_FOOTER = '-----END PRIVATE KEY-----';

if (!admin.apps.length) {
  console.log('Firebase Admin SDK: Attempting to initialize...');
  const projectId = process.env.FIREBASE_ADMIN_PROJECT_ID;
  const clientEmail = process.env.FIREBASE_ADMIN_CLIENT_EMAIL;
  const privateKeyEnv = process.env.FIREBASE_ADMIN_PRIVATE_KEY;

  if (!projectId || !clientEmail || !privateKeyEnv) {
    console.warn(
      'Firebase Admin SDK CANNOT be initialized. Missing one or more environment variables. Ensure FIREBASE_ADMIN_PROJECT_ID, FIREBASE_ADMIN_CLIENT_EMAIL, and FIREBASE_ADMIN_PRIVATE_KEY are set in your .env.local file.'
    );
    if (!projectId) console.warn('Firebase Admin SDK: Required environment variable FIREBASE_ADMIN_PROJECT_ID is missing.');
    if (!clientEmail) console.warn('Firebase Admin SDK: Required environment variable FIREBASE_ADMIN_CLIENT_EMAIL is missing.');
    if (!privateKeyEnv) console.warn('Firebase Admin SDK: Required environment variable FIREBASE_ADMIN_PRIVATE_KEY is missing.');
    authAdminInstance = null;
    dbAdminInstance = null;
  } else {
    // Log raw private key details BEFORE processing
    console.log(`Firebase Admin SDK: Raw FIREBASE_ADMIN_PRIVATE_KEY (type: ${typeof privateKeyEnv}, length: ${privateKeyEnv.length})`);
    // Only log parts if length is sufficient to avoid errors
    if (privateKeyEnv.length > 60) {
      console.log(`Firebase Admin SDK: Raw PK starts with: "${privateKeyEnv.substring(0, 30)}..."`);
      console.log(`Firebase Admin SDK: Raw PK ends with: "...${privateKeyEnv.substring(privateKeyEnv.length - 30)}"`);
    } else {
      console.log(`Firebase Admin SDK: Raw PK is very short, logging full raw value: "${privateKeyEnv}"`);
    }
    
    const processedPrivateKey = privateKeyEnv.replace(/\\n/g, '\n');
    
    // Log processed private key details
    console.log(`Firebase Admin SDK: Processed FIREBASE_ADMIN_PRIVATE_KEY (length: ${processedPrivateKey.length})`);
    if (processedPrivateKey.length >= PEM_HEADER.length) {
      console.log(`Firebase Admin SDK: Processed PK starts with: "${processedPrivateKey.substring(0, PEM_HEADER.length)}"`);
    } else {
       console.warn(`Firebase Admin SDK: Processed PK is shorter than PEM_HEADER.`);
    }
    if (processedPrivateKey.length >= PEM_FOOTER.length) {
      console.log(`Firebase Admin SDK: Processed PK ends with: "${processedPrivateKey.substring(processedPrivateKey.length - PEM_FOOTER.length)}"`);
    } else {
      console.warn(`Firebase Admin SDK: Processed PK is shorter than PEM_FOOTER.`);
    }


    if (!processedPrivateKey.startsWith(PEM_HEADER)) {
      console.error(`Firebase Admin SDK CRITICAL: Processed private key does NOT start with "${PEM_HEADER}". Check your FIREBASE_ADMIN_PRIVATE_KEY environment variable format. It might be corrupted, incomplete, or missing newlines.`);
    }
    if (!processedPrivateKey.trim().endsWith(PEM_FOOTER)) { 
      console.error(`Firebase Admin SDK CRITICAL: Processed private key does NOT end with "${PEM_FOOTER}". Check your FIREBASE_ADMIN_PRIVATE_KEY environment variable format. It might be corrupted, incomplete, or missing newlines.`);
    }
    
    const serviceAccount: ServiceAccount = {
      projectId: projectId,
      clientEmail: clientEmail,
      privateKey: processedPrivateKey,
    };

    try {
      admin.initializeApp({
        credential: admin.credential.cert(serviceAccount),
      });
      console.log('Firebase Admin SDK: Initialized successfully.');
      authAdminInstance = admin.auth();
      dbAdminInstance = admin.firestore();

    } catch (error: any) {
      console.error('Firebase Admin SDK: Initialization FAILED. Error:', error.message);
      console.error('Firebase Admin SDK: Full error object during initialization:', error);
      if (error.message && typeof error.message === 'string' && (error.message.toLowerCase().includes('privatekey') || error.message.toLowerCase().includes('pkcs8') || error.message.toLowerCase().includes('decoder'))) {
        console.error('Firebase Admin SDK: The error message strongly suggests an issue with FIREBASE_ADMIN_PRIVATE_KEY. Please VERIFY its format and value. Ensure it is the full key from your service account JSON, including -----BEGIN PRIVATE KEY----- and -----END PRIVATE KEY-----, with all newlines preserved (e.g., by wrapping in double quotes in your .env.local file).');
      }
      authAdminInstance = null;
      dbAdminInstance = null;
    }
  }
} else {
  console.log('Firebase Admin SDK: Already initialized. Attempting to retrieve existing instances.');
  try {
    const mainApp = admin.app(); // Get the default app
    authAdminInstance = admin.auth(mainApp);
    dbAdminInstance = admin.firestore(mainApp);
    console.log('Firebase Admin SDK: Retrieved existing instances successfully.');
  } catch (error: any) {
      console.error('Firebase Admin SDK: Error retrieving existing instances. This might indicate the initial setup was incomplete or flawed. Error:', error.message);
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
    return null; // Explicitly return null
  }
  try {
    const decodedToken = await authAdmin.verifyIdToken(idToken);
    return decodedToken.uid;
  } catch (error) {
    console.error('getUserIdFromToken: Error verifying ID token:', error);
    return null;
  }
}
