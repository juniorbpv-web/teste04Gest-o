import { initializeApp, getApps, getApp } from 'firebase/app';
import { getAuth, Auth } from 'firebase/auth';
import { getFirestore, Firestore, doc, getDocFromServer } from 'firebase/firestore';
import firebaseConfig from '../../firebase-applet-config.json';

// Initialize Firebase App
export const app = getApps().length === 0 ? initializeApp(firebaseConfig) : getApp();

// Initialize Auth
export const auth: Auth = getAuth(app);

// Initialize Firestore with custom databaseId if configured
const customDatabaseId = (firebaseConfig as Record<string, any>).firestoreDatabaseId;
export const db: Firestore = customDatabaseId
  ? getFirestore(app, customDatabaseId)
  : getFirestore(app);

// Connection state tracker
let isConnected = false;

export async function testFirestoreConnection(): Promise<boolean> {
  try {
    // Validate connection by reading a test doc directly from server
    await getDocFromServer(doc(db, 'test', 'connection'));
    isConnected = true;
    return true;
  } catch (error: unknown) {
    if (error instanceof Error && error.message.includes('the client is offline')) {
      console.warn('Firestore client is currently offline. Offline persistence is active.');
      isConnected = false;
      return false;
    }
    // If permission or not found, it still reached the server
    isConnected = true;
    return true;
  }
}

export function getIsConnected(): boolean {
  return isConnected;
}

export default db;
