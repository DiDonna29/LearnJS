
import { initializeApp, getApps, getApp, type FirebaseApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';
import { getAuth } from 'firebase/auth';

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyD6GwfWM_sckzuWAo4OoS_c66Z66tbL_mw",
  authDomain: "learnjs-6th23.firebaseapp.com",
  projectId: "learnjs-6th23",
  storageBucket: "learnjs-6th23.firebasestorage.app",
  messagingSenderId: "98677290844",
  appId: "1:98677290844:web:e70728daebc8f70f6f7399"
};

// Initialize Firebase
let app: FirebaseApp;
if (!getApps().length) {
  app = initializeApp(firebaseConfig);
} else {
  app = getApp();
}

const db = getFirestore(app);
const auth = getAuth(app);

export { db, auth, app };
