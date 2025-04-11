
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getAuth, GoogleAuthProvider, signInWithPopup, signOut, onAuthStateChanged, User } from "firebase/auth";
import { getDatabase, ref, set, get, push, onValue, update, remove } from "firebase/database";
import { toast } from "sonner";
import { Module, Topic } from "@/types/knowledge";

// Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyBKUKCci6NWh1mCX8gPZC8BUzSgyAiiYmc",
  authDomain: "chipling-6505e.firebaseapp.com",
  projectId: "chipling-6505e",
  storageBucket: "chipling-6505e.firebasestorage.app",
  messagingSenderId: "83441437965",
  appId: "1:83441437965:web:c4cf8d26d9c844f0fff444",
  measurementId: "G-J8B9033FVF",
  databaseURL: "https://chipling-6505e-default-rtdb.asia-southeast1.firebasedatabase.app"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
const auth = getAuth(app);
const database = getDatabase(app);
const googleProvider = new GoogleAuthProvider();

// User type
export interface FirebaseUser {
  uid: string;
  displayName: string | null;
  email: string | null;
  photoURL: string | null;
  subscriptionType: string;
}

// History Entry type
export interface HistoryEntry {
  id: string;
  query: string;
  createdAt: number;
  lastAccessedAt: number;
  modules: Module[];
  progress: number;
  totalTopics: number;
  completedTopics: number;
}

// Authentication functions
export const signInWithGoogle = async (): Promise<FirebaseUser | null> => {
  try {
    const result = await signInWithPopup(auth, googleProvider);
    const user = result.user;
    
    // Create or update user in the database
    await createOrUpdateUser(user);
    
    toast.success("Successfully signed in with Google");
    
    return {
      uid: user.uid,
      displayName: user.displayName,
      email: user.email,
      photoURL: user.photoURL,
      subscriptionType: "free" // Default subscription type
    };
  } catch (error) {
    console.error("Error signing in with Google", error);
    toast.error("Failed to sign in with Google");
    return null;
  }
};

export const logoutUser = async (): Promise<void> => {
  try {
    await signOut(auth);
    toast.success("Successfully logged out");
  } catch (error) {
    console.error("Error logging out", error);
    toast.error("Failed to log out");
  }
};

export const getCurrentUser = (): Promise<FirebaseUser | null> => {
  return new Promise((resolve) => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      unsubscribe();
      if (user) {
        // Get user data from the database
        const userData = await getUserData(user.uid);
        resolve(userData);
      } else {
        resolve(null);
      }
    });
  });
};

// Database functions
export const createOrUpdateUser = async (user: User): Promise<void> => {
  try {
    // Check if user already exists
    const userRef = ref(database, `users/${user.uid}`);
    const snapshot = await get(userRef);
    
    if (!snapshot.exists()) {
      // Create new user
      await set(userRef, {
        uid: user.uid,
        displayName: user.displayName,
        email: user.email,
        photoURL: user.photoURL,
        subscriptionType: "free", // Default subscription type
        createdAt: Date.now()
      });
    }
  } catch (error) {
    console.error("Error creating/updating user", error);
    throw error;
  }
};

export const getUserData = async (uid: string): Promise<FirebaseUser | null> => {
  try {
    const userRef = ref(database, `users/${uid}`);
    const snapshot = await get(userRef);
    
    if (snapshot.exists()) {
      const userData = snapshot.val();
      return {
        uid: userData.uid,
        displayName: userData.displayName,
        email: userData.email,
        photoURL: userData.photoURL,
        subscriptionType: userData.subscriptionType || "free"
      };
    }
    
    return null;
  } catch (error) {
    console.error("Error getting user data", error);
    return null;
  }
};

// History functions
export const saveSearchHistory = async (uid: string, query: string, modules: Module[]): Promise<string> => {
  try {
    console.log(`Saving search history for user ${uid}: ${query}`);
    const historyRef = ref(database, `history/${uid}`);
    const newHistoryRef = push(historyRef);
    
    const totalTopics = modules.reduce((total, module) => total + module.topics.length, 0);
    
    const historyEntry = {
      id: newHistoryRef.key,
      query,
      createdAt: Date.now(),
      lastAccessedAt: Date.now(),
      modules,
      progress: 0,
      totalTopics,
      completedTopics: 0
    };
    
    await set(newHistoryRef, historyEntry);
    console.log(`History entry saved with ID: ${newHistoryRef.key}`);
    return newHistoryRef.key as string;
  } catch (error) {
    console.error("Error saving search history", error);
    throw error;
  }
};

export const updateHistoryProgress = async (uid: string, historyId: string, completedTopics: number): Promise<void> => {
  try {
    console.log(`Updating history progress for user ${uid}, history ${historyId}: ${completedTopics} topics`);
    const historyEntryRef = ref(database, `history/${uid}/${historyId}`);
    const snapshot = await get(historyEntryRef);
    
    if (snapshot.exists()) {
      const historyEntry = snapshot.val();
      const progress = Math.round((completedTopics / historyEntry.totalTopics) * 100);
      
      await update(historyEntryRef, { 
        completedTopics, 
        progress,
        lastAccessedAt: Date.now()
      });
      console.log(`Updated progress to ${progress}%`);
    } else {
      console.error(`History entry ${historyId} not found for user ${uid}`);
    }
  } catch (error) {
    console.error("Error updating history progress", error);
    throw error;
  }
};

export const deleteHistoryEntry = async (uid: string, historyId: string): Promise<void> => {
  try {
    console.log(`Deleting history entry ${historyId} for user ${uid}`);
    const historyEntryRef = ref(database, `history/${uid}/${historyId}`);
    await remove(historyEntryRef);
    console.log(`History entry deleted successfully`);
  } catch (error) {
    console.error("Error deleting history entry", error);
    throw error;
  }
};

export const getSearchHistory = async (uid: string): Promise<HistoryEntry[]> => {
  try {
    console.log(`Getting search history for user ${uid}`);
    const historyRef = ref(database, `history/${uid}`);
    return new Promise((resolve) => {
      onValue(historyRef, (snapshot) => {
        if (snapshot.exists()) {
          const historyData = snapshot.val();
          const historyEntries = Object.keys(historyData).map(key => ({
            ...historyData[key],
            id: key
          }));
          console.log(`Found ${historyEntries.length} history entries`);
          resolve(historyEntries.sort((a, b) => b.lastAccessedAt - a.lastAccessedAt));
        } else {
          console.log(`No history entries found for user ${uid}`);
          resolve([]);
        }
      });
    });
  } catch (error) {
    console.error("Error getting search history", error);
    return [];
  }
};

export { auth, database };
