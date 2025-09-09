
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
  moduleProgress?: Record<number, number>;
}

// Utility function for retrying operations
const retryOperation = async <T>(operation: () => Promise<T>, maxRetries = 3, delay = 1000): Promise<T> => {
  let lastError: Error;
  
  for (let i = 0; i <= maxRetries; i++) {
    try {
      return await operation();
    } catch (error) {
      lastError = error as Error;
      if (i < maxRetries) {
        console.log(`Operation failed, retrying in ${delay}ms... (attempt ${i + 1}/${maxRetries + 1})`);
        await new Promise(resolve => setTimeout(resolve, delay));
        delay *= 2; // Exponential backoff
      }
    }
  }
  
  throw lastError;
};

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
  return new Promise((resolve, reject) => {
    // Add timeout to prevent hanging
    const timeout = setTimeout(() => {
      unsubscribe();
      reject(new Error('Authentication timeout'));
    }, 5000); // 5 second timeout
    
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      clearTimeout(timeout);
      unsubscribe();
      if (user) {
        // Get user data from the database
        try {
          const userData = await getUserData(user.uid);
          resolve(userData);
        } catch (error) {
          console.error("Error getting user data", error);
          resolve(null);
        }
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
  return retryOperation(async () => {
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
        completedTopics: 0,
        moduleProgress: {}
      };
      
      await set(newHistoryRef, historyEntry);
      console.log(`History entry saved with ID: ${newHistoryRef.key}`);
      return newHistoryRef.key as string;
    } catch (error) {
      console.error("Error saving search history", error);
      throw error;
    }
  });
};

export const updateHistoryProgress = async (
  uid: string, 
  historyId: string, 
  completedTopics: number, 
  moduleProgress: Record<number, number> = {}
): Promise<void> => {
  return retryOperation(async () => {
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
          lastAccessedAt: Date.now(),
          moduleProgress
        });
        console.log(`Updated progress to ${progress}% with module progress:`, moduleProgress);
      } else {
        console.error(`History entry ${historyId} not found for user ${uid}`);
        throw new Error(`History entry not found: ${historyId}`);
      }
    } catch (error) {
      console.error("Error updating history progress", error);
      throw error;
    }
  });
};

export const saveTopicDetails = async (uid: string, historyId: string, moduleIndex: number, topicIndex: number, topic: Topic): Promise<void> => {
  return retryOperation(async () => {
    try {
      if (!uid || !historyId) {
        console.log("Not saving topic details - missing user ID or history ID");
        return;
      }
      
      console.log(`Saving topic details for user ${uid}, history ${historyId}, module ${moduleIndex}, topic ${topicIndex}`);
      const topicRef = ref(database, `history/${uid}/${historyId}/modules/${moduleIndex}/topics/${topicIndex}`);
      await update(topicRef, topic);
      console.log("Topic details saved successfully");
    } catch (error) {
      console.error("Error saving topic details", error);
      throw error;
    }
  });
};

export const deleteHistoryEntry = async (uid: string, historyId: string): Promise<void> => {
  return retryOperation(async () => {
    try {
      console.log(`Deleting history entry ${historyId} for user ${uid}`);
      const historyEntryRef = ref(database, `history/${uid}/${historyId}`);
      await remove(historyEntryRef);
      console.log(`History entry deleted successfully`);
    } catch (error) {
      console.error("Error deleting history entry", error);
      throw error;
    }
  });
};

export const getSearchHistory = async (uid: string): Promise<HistoryEntry[]> => {
  return retryOperation(async () => {
    try {
      console.log(`Getting search history for user ${uid}`);
      const historyRef = ref(database, `history/${uid}`);
      const snapshot = await get(historyRef);
      
      if (snapshot.exists()) {
        const historyData = snapshot.val();
        const historyEntries = Object.keys(historyData).map(key => ({
          ...historyData[key],
          id: key
        }));
        console.log(`Found ${historyEntries.length} history entries`);
        return historyEntries.sort((a, b) => b.lastAccessedAt - a.lastAccessedAt);
      } else {
        console.log(`No history entries found for user ${uid}`);
        return [];
      }
    } catch (error) {
      console.error("Error getting search history", error);
      throw error;
    }
  });
};

export { auth, database };
