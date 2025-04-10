
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getAuth, GoogleAuthProvider, signInWithPopup, signOut, onAuthStateChanged, User } from "firebase/auth";
import { getDatabase, ref, set, get, push, onValue } from "firebase/database";
import { toast } from "sonner";

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

// Rabbit Hole type
export interface RabbitHole {
  id: string;
  query: string;
  createdAt: number;
  progress: number;
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

// Rabbit Holes functions
export const saveRabbitHole = async (uid: string, query: string): Promise<string> => {
  try {
    const rabbitHolesRef = ref(database, `rabbitHoles/${uid}`);
    const newRabbitHoleRef = push(rabbitHolesRef);
    
    const rabbitHole = {
      id: newRabbitHoleRef.key,
      query,
      createdAt: Date.now(),
      progress: 0
    };
    
    await set(newRabbitHoleRef, rabbitHole);
    return newRabbitHoleRef.key as string;
  } catch (error) {
    console.error("Error saving rabbit hole", error);
    throw error;
  }
};

export const updateRabbitHoleProgress = async (uid: string, rabbitHoleId: string, progress: number): Promise<void> => {
  try {
    const rabbitHoleRef = ref(database, `rabbitHoles/${uid}/${rabbitHoleId}`);
    await set(rabbitHoleRef, { progress });
  } catch (error) {
    console.error("Error updating rabbit hole progress", error);
    throw error;
  }
};

export const getRabbitHoles = async (uid: string): Promise<RabbitHole[]> => {
  try {
    const rabbitHolesRef = ref(database, `rabbitHoles/${uid}`);
    return new Promise((resolve) => {
      onValue(rabbitHolesRef, (snapshot) => {
        if (snapshot.exists()) {
          const rabbitHolesData = snapshot.val();
          const rabbitHoles = Object.keys(rabbitHolesData).map(key => ({
            ...rabbitHolesData[key],
            id: key
          }));
          resolve(rabbitHoles.sort((a, b) => b.createdAt - a.createdAt));
        } else {
          resolve([]);
        }
      });
    });
  } catch (error) {
    console.error("Error getting rabbit holes", error);
    return [];
  }
};

export { auth, database };
