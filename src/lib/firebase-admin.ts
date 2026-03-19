
// src/lib/firebase-admin.ts
import * as admin from 'firebase-admin';

// This ensures we only initialize the app once
if (!admin.apps.length) {
  const serviceAccountJson = process.env.FIREBASE_ADMIN_SDK_JSON;
  if (!serviceAccountJson) {
    throw new Error('Firebase Admin SDK JSON is not set. Please check your .env file and ensure FIREBASE_ADMIN_SDK_JSON is set correctly.');
  }

  try {
    const serviceAccount = JSON.parse(serviceAccountJson);
    admin.initializeApp({
      credential: admin.credential.cert(serviceAccount),
      projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
    });
  } catch (e: any) {
    console.error("Failed to parse Firebase Admin SDK JSON:", e);
    throw new Error("The FIREBASE_ADMIN_SDK_JSON environment variable is not a valid JSON object. Please check your .env file.");
  }
}

const db = admin.firestore();
const auth = admin.auth();

export { db, auth, admin };
